Ext.gesture.Manager = new Ext.AbstractManager({
    startEvent: 'touchstart',
    moveEvent: 'touchmove',
    endEvent: 'touchend',
    
    init: function() {
        this.targets = []; 

        if (!Ext.supports.Touch) {
            Ext.apply(this, {
                startEvent: 'mousedown',
                moveEvent: 'mousemove',
                endEvent: 'mouseup'
            });
        }
        
        this.followTouches = [];
        this.currentGestures = [];
        this.currentTargets = [];
        
        document.addEventListener(this.startEvent, Ext.createDelegate(this.onTouchStart, this), true);
        document.addEventListener(this.endEvent, Ext.createDelegate(this.onTouchEnd, this), true);

        if (!Ext.is.Desktop) {
            document.addEventListener('click', Ext.createDelegate(this.onClick, this), true);
            this.addEventListener(Ext.getBody(), 'tap', Ext.emptyFn, {capture: true, fireClickEvent: true});
        }

        // Not sure if it's even needed
//        if (Ext.is.Blackberry) {
//            document.addEventListener('mousedown', this.onMouseDown, false);
//        }
    },

    onClick: function(e) {
        var target = e.target;

        if (!(e.isManufactured == true) || target.disabled == true) {
            e.stopPropagation();
            e.preventDefault();
        }
    },
    
    onMouseDown: function(e) {
        e.stopPropagation();
        e.preventDefault();    
    },
    
    onTouchStart: function(e) {
        var targets = [],
            target = e.target;
        
        this.locks = {};
        
        this.currentTargets = [target];
        
        while (target) {
            if (this.targets.indexOf(target) != -1) {
                targets.unshift(target);
            }
            target = target.parentNode;
            this.currentTargets.push(target);
        }
        
        this.startEvent = e;
        this.handleTargets(targets, e);
    },
    
    /**
     * This listener is here to always ensure we stop all current gestures
     * @private
     */    
    onTouchEnd: function(e) {
        var gestures = this.currentGestures.slice(0),
            ln = gestures.length,
            i, gesture;

        this.followTouches = [];
        this.startedChangedTouch = false;
        this.currentTargets = [];
        this.startEvent = null;
        
        for (i = 0; i < ln; i++) {
            gesture = gestures[i];
            
            if (!e.stopped && gesture.listenForEnd) {
                gesture.onTouchEnd(e, e.changedTouches ? e.changedTouches[0]: e);
                gesture.lastMovePoint = null;
            }

            this.stopGesture(gesture);
        }
    },

    startGesture: function(gesture) {
        var me = this;

        gesture.started = true;
        
        if (gesture.listenForMove) {
            gesture.onTouchMoveWrap = function(e) {
                var point = Ext.util.Point.fromEvent(e);

                if (!gesture.lastMovePoint) {
                    gesture.lastMovePoint = point;
                } else {
                    if (gesture.lastMovePoint.equals(point)) {
                        return;
                    } else {
                        gesture.lastMovePoint.copyFrom(point);
                    }
                }
                
                if (!e.stopped) {
                    gesture.onTouchMove(e, e.changedTouches ? e.changedTouches[0]: e);
                }
            };
            
            gesture.target.addEventListener(me.moveEvent, gesture.onTouchMoveWrap, !!gesture.capture);
        }
        
        this.currentGestures.push(gesture);
    },

    stopGesture: function(gesture) {
        gesture.started = false;
        if (gesture.listenForMove) {
            gesture.target.removeEventListener(this.moveEvent, gesture.onTouchMoveWrap, !!gesture.capture);
        }
        this.currentGestures.remove(gesture);
    },
    
    handleTargets: function(targets, e) {
        // In handle targets we have to first handle all the capture targets,
        // then all the bubble targets.
        var ln = targets.length,
            i, target;
        
        this.startedChangedTouch = false;
        this.startedTouches = Ext.supports.Touch ? e.touches : [e];

        for (i = 0; i < ln; i++) {
            if (e.stopped) {
                break;
            }
            target = targets[i];
            this.handleTarget(target, e, true);
        }
        
        for (i = ln - 1; i >= 0; i--) {
            if (e.stopped) {
                break;
            }
            target = targets[i];
            this.handleTarget(target, e, false);
        }
        
        if (this.startedChangedTouch) {
            this.followTouches = this.followTouches.concat(Ext.supports.Touch ? Ext.toArray(e.targetTouches) : [e]);
        }
    },
    
    handleTarget: function(target, e, capture) {
        var gestures = Ext.Element.data(target, 'x-gestures') || [],
            ln = gestures.length,
            i, gesture;

        for (i = 0; i < ln; i++) {
            gesture = gestures[i];
            if (
                (!!gesture.capture === !!capture) &&
                (this.followTouches.length < gesture.touches) && 
                (Ext.supports.Touch ? (e.targetTouches.length === gesture.touches) : true)
            ) {
                this.startedChangedTouch = true;
                this.startGesture(gesture);

                if (gesture.listenForStart) {
                    gesture.onTouchStart(e, e.changedTouches ? e.changedTouches[0] : e);
                }
                                
                if (e.stopped) {
                    break;
                }                
            }
        }
    },
        
    addEventListener: function(target, eventName, listener, options) {
        target = Ext.getDom(target);

        var targets = this.targets,
            name = this.getGestureName(eventName),
            gestures = Ext.Element.data(target, 'x-gestures') || [],
            gesture;
        
        // <debug>
        if (!name) {
            throw 'Trying to subscribe to unknown event ' + eventName;
        }
        // </debug>
        
        if (targets.indexOf(target) == -1) {
            this.targets.push(target);
        }
        
        gesture = this.get(target.id + '-' + name);
        
        if (!gesture) {
            gesture = this.create(Ext.apply({}, options || {}, {
                target: target,
                type: name
            }));

            gestures.push(gesture);

            Ext.Element.data(target, 'x-gestures', gestures);
        }
        
        gesture.addListener(eventName, listener);
        // If there is already a finger down, then instantly start the gesture
        if (this.startedChangedTouch && this.currentTargets.contains(target) && !gesture.started) {
            this.startGesture(gesture);
            if (gesture.listenForStart) {
                gesture.onTouchStart(this.startEvent, this.startedTouches[0]);                
            }
        }
    },
    
    removeEventListener: function(target, eventName, listener) {
        target = Ext.getDom(target);
        
        var name = this.getGestureName(eventName),
            gestures = Ext.Element.data(target, 'x-gestures') || [],
            gesture;
            
        gesture = this.get(target.id + '-' + name);
        
        if (gesture) {
            gesture.removeListener(eventName, listener);

            for (name in gesture.listeners) {
                return;
            }
            gesture.destroy();
            gestures.remove(gesture);
            Ext.Element.data(target, 'x-gestures', gestures);
        }
    },
    
    getGestureName: function(ename) {
        return this.names && this.names[ename];
    },
        
    registerType: function(type, cls) {
        var handles = cls.prototype.handles,
            i, ln;

        this.types[type] = cls;

        cls[this.typeName] = type;
        
        if (!handles) {
            handles = cls.prototype.handles = [type];
        }
        
        this.names = this.names || {};
        
        for (i = 0, ln = handles.length; i < ln; i++) {
            this.names[handles[i]] = type;
        }
    }
});

Ext.regGesture = function() {
    return Ext.gesture.Manager.registerType.apply(Ext.gesture.Manager, arguments);
};