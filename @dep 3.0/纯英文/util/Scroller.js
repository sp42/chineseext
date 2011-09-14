(function(){

Ext.ScrollManager = new Ext.AbstractManager();

/**
 * @class Ext.util.ScrollView
 * @extends Ext.util.Observable
 *
 * A wrapper class that listens to scroll events and control the scroll indicators
 */
Ext.util.ScrollView = Ext.extend(Ext.util.Observable, {

    useIndicators: true,

    indicatorConfig: {},
    
    indicatorMargin: 4,

    constructor: function(el, config) {
        var indicators = [],
            directions = ['vertical', 'horizontal'];

        Ext.util.ScrollView.superclass.constructor.call(this);

        ['useIndicators', 'indicatorConfig', 'indicatorMargin'].forEach(function(c) {
            if (config.hasOwnProperty(c)) {
                this[c] = config[c];
                delete config[c];
            }
        }, this);

        config.scrollView = this;
        this.scroller = new Ext.util.Scroller(el, config);

        if (this.useIndicators === true) {
            directions.forEach(function(d) {
                if (this.scroller[d]) {
                    indicators.push(d);
                }
            }, this);
        } else if (directions.indexOf(this.useIndicators) !== -1) {
            indicators.push(this.useIndicators);
        }

        this.indicators = {};

        indicators.forEach(function(i) {
            this.indicators[i] = new Ext.util.Scroller.Indicator(this.scroller.container, Ext.apply({}, this.indicatorConfig, {type: i}));
        }, this);

        this.mon(this.scroller, {
            scrollstart: this.onScrollStart,
            scrollend: this.onScrollEnd,
            scroll: this.onScroll,
            scope: this
        });
    },

    onScrollStart: function() {
        this.showIndicators();
    },

    onScrollEnd: function() {
        this.hideIndicators();
    },
    
    showIndicators : function() {
        Ext.iterate(this.indicators, function(axis, indicator) {
            indicator.show();
        }, this);        
    },
    
    hideIndicators : function() {
        Ext.iterate(this.indicators, function(axis, indicator) {
            indicator.hide();
        }, this);        
    },

    onScroll: function(scroller) {
        if (scroller.offsetBoundary == null || (!this.indicators.vertical && !this.indicators.horizontal))
            return;

        var sizeAxis,
            offsetAxis,
            offsetMark,
            boundary = scroller.offsetBoundary,
            offset = scroller.offset;

        this.containerSize = scroller.containerBox;
        this.scrollerSize = scroller.size;
        this.outOfBoundOffset = boundary.getOutOfBoundOffset(offset);
        this.restrictedOffset = boundary.restrict(offset);
        this.boundarySize = boundary.getSize();

        if (!this.indicatorSizes) {
            this.indicatorSizes = { vertical: 0, horizontal: 0 };
        }

        if (!this.indicatorOffsets) {
            this.indicatorOffsets = { vertical: 0, horizontal: 0 };
        }

        Ext.iterate(this.indicators, function(axis, indicator) {
            sizeAxis = (axis == 'vertical') ? 'height' : 'width';
            offsetAxis = (axis == 'vertical') ? 'y' : 'x';
            offsetMark = (axis == 'vertical') ? 'bottom' : 'right';

            if (this.scrollerSize[sizeAxis] < this.containerSize[sizeAxis]) {
                this.indicatorSizes[axis] = this.containerSize[sizeAxis] * (this.scrollerSize[sizeAxis] / this.containerSize[sizeAxis]);
            }
            else {
                this.indicatorSizes[axis] = this.containerSize[sizeAxis] * (this.containerSize[sizeAxis] / this.scrollerSize[sizeAxis]);
            }
            this.indicatorSizes[axis] -= Math.abs(this.outOfBoundOffset[offsetAxis]);
            this.indicatorSizes[axis] = Math.max(this.indicatorMargin * 4, this.indicatorSizes[axis]);

            if (this.boundarySize[sizeAxis] != 0) {
                this.indicatorOffsets[axis] = (((boundary[offsetMark] - this.restrictedOffset[offsetAxis]) / this.boundarySize[sizeAxis])
                                              * (this.containerSize[sizeAxis] - this.indicatorSizes[axis]));
            } else if (offset[offsetAxis] < boundary[offsetMark]) {
                this.indicatorOffsets[axis] = this.containerSize[sizeAxis] - this.indicatorSizes[axis];
//                this.indicatorOffsets[axis] = Math.round(this.indicatorOffsets[axis]);
            } else {
                this.indicatorOffsets[axis] = 0;
            }
            
            indicator.setOffset(this.indicatorOffsets[axis] + this.indicatorMargin);
            indicator.setSize(this.indicatorSizes[axis] - (this.indicatorMargin * 2));
        }, this);
    }
});

/**
 * @class Ext.util.Scroller
 * @extends Ext.util.Draggable
 *
 * Mimic the native scrolling experience on iDevices
 */
Ext.util.Scroller = Ext.extend(Ext.util.Draggable, {
    // Inherited
    baseCls: '',

    // Inherited
    draggingCls: '',

    // Inherited
    direction: 'both',

    // Inherited
    constrain: 'parent',

    /**
     * @cfg {Number} outOfBoundRestrictFactor
     * Determines the offset ratio when the scroller is pulled / pushed out of bound (when it's not decelerating)
     * A value of 0.5 means 1px allowed for every 2px. Defaults to 0.5
     */
    outOfBoundRestrictFactor: 0.5,

    /**
     * @cfg {Number} acceleration
     * A higher acceleration gives the scroller more initial velocity. Defaults to 30
     */
    acceleration: 30,
    
    /**
     * @cfg {Number} fps
     * The desired fps of the deceleration. Defaults to 100.
     */
    fps: 100,

    /**
     * @cfg {Number} friction
     * The friction of the scroller.
     * By raising this value the length that momentum scrolls becomes shorter. This value is best kept
     * between 0 and 1. The default value is 0.5
     */
    friction: 0.5,

    /**
     * @cfg {Number} startMomentumResetTime
     * The time duration in ms to reset the start time of momentum
     * Defaults to 350
     */
    startMomentumResetTime: 350,

    /**
     * @cfg {Number} springTension
     * The tension of the spring that is attached to the scroller when it bounces.
     * By raising this value the bounce becomes shorter. This value is best kept
     * between 0 and 1. The default value is 0.3
     */
    springTension: 0.3,

    /**
     * @cfg {Number} minVelocityForAnimation
     * The minimum velocity to keep animating. Defaults to 1 (1px per second)
     */
    minVelocityForAnimation: 1,

    /**
     * @cfg {Boolean/String} bounces
     * Enable bouncing during scrolling past the bounds. Defaults to true. (Which is 'both').
     * You can also specify 'vertical', 'horizontal', or 'both'
     */
    bounces: true,

    /**
     * @cfg {Boolean} momentum
     * Whether or not to enable scrolling momentum. Defaults to true
     */
    momentum: true,

    cancelRevert: true,
    
    threshold: 5,

    constructor: function(el, config) {
        el = Ext.get(el);

        var scroller = Ext.ScrollManager.get(el.id);
        if (scroller) {
            return Ext.apply(scroller, config);
        }

//        this.eventTarget = el.parent();
        Ext.util.Scroller.superclass.constructor.apply(this, arguments);

        this.addEvents(
            /**
             * @event scrollstart
             * @param {Ext.util.Scroller} this
             * @param {Ext.EventObject} e
             */
            'scrollstart',
            /**
             * @event scroll
             * @param {Ext.util.Scroller} this
             * @param {Object} offsets An object containing the x and y offsets for the scroller.
             */
            'scroll',
            /**
             * @event scrollend
             * @param {Ext.util.Scroller} this
             * @param {Object} offsets An object containing the x and y offsets for the scroller.
             */
            'scrollend',
            /**
             * @event bouncestart
             * @param {Ext.util.Scroller} this
             * @param {Object} info Object containing information regarding the bounce
             */
             'bouncestart',
             /**
              * @event bouncestart
              * @param {Ext.util.Scroller} this
              * @param {Object} info Object containing information regarding the bounce
              */
             'bounceend'           
        );

        this.on({
            dragstart: this.onDragStart,
            scope: this
        });

        Ext.ScrollManager.register(this);

        this.el.addCls('x-scroller');
        this.container.addCls('x-scroller-parent');

        if (this.bounces !== false) {
            var both = this.bounces === 'both' || this.bounces === true,
                horizontal = both || this.bounces === 'horizontal',
                vertical = both || this.bounces === 'vertical';

            this.bounces = {
                x: horizontal,
                y: vertical
            };
        }

        this.frameDuration = 1000 / this.fps;
        this.omega = 1 - (this.friction / 10);

//        this.updateBoundary();

        if (!this.decelerationAnimation) {
            this.decelerationAnimation = {};
        }

        if (!this.bouncingAnimation) {
            this.bouncingAnimation = {};
        }

        ['x', 'y'].forEach(function(a) {
            if (!this.decelerationAnimation[a]) {
                this.decelerationAnimation[a] = new Ext.util.Scroller.Animation.Deceleration({
                    acceleration: this.acceleration,
                    omega: this.omega
                });
            }

            if (!this.bouncingAnimation[a]) {
                this.bouncingAnimation[a] = new Ext.util.Scroller.Animation.Bouncing({
                    acceleration: this.acceleration,
                    springTension: this.springTension
                });
            }
        }, this);

        return this;
    },

    setEnabled: function(enabled) {
        Ext.util.Scroller.superclass.setEnabled.apply(this, arguments);

        this.eventTarget[enabled ? 'on' : 'un']('touchstart', this.onTouchStart, this);
    },


    updateBoundary: function() {
        Ext.util.Scroller.superclass.updateBoundary.apply(this, arguments);
        
        this.snapToBoundary();
    },
    
    setOffset: function(p) {
        p.round();
        
        Ext.util.Scroller.superclass.setOffset.apply(this, arguments);

        this.fireEvent('scroll', this, this.getOffset());
    },

    onTouchStart: function(e) {
        this.stopMomentumAnimation();
    },

    onDragStart: function(e) {
        this.fireEvent('scrollstart', this, e);
    },

    onStart: function(e) {
        if (Ext.util.Scroller.superclass.onStart.apply(this, arguments) !== true)
            return;
        
        this.startTime = e.event.timeStamp;
        this.lastEventTime = e.event.timeStamp;
        this.startTimeOffset = this.offset.copy();
    },

    onDrag: function(e) {
        if (Ext.util.Scroller.superclass.onDrag.apply(this, arguments) !== true)
            return;

        this.lastEventTime = e.event.timeStamp;

        if (this.lastEventTime - this.startTime > this.startMomentumResetTime) {
            this.startTime = this.lastEventTime;
            this.startTimeOffset = this.offset.copy();
        }
    },

    onDragEnd: function(e) {
        if (Ext.util.Scroller.superclass.onDragEnd.apply(this, arguments) !== true)
            return;

        if (!this.startMomentumAnimation(e)) {
            this.fireScrollEndEvent();
        }
    },

    onOrientationChange: function() {
        Ext.util.Scroller.superclass.onOrientationChange.apply(this, arguments);
        
        this.snapToBoundary();
    },

    fireScrollEndEvent: function() {
        this.isAnimating = false;
        this.snapToBoundary();
        this.fireEvent('scrollend', this, this.getOffset());
    },

    scrollTo: function(pos, animate) {
        this.stopMomentumAnimation();

        var newOffset = this.offsetBoundary.restrict(new Ext.util.Offset(-pos.x, -pos.y));

        this.setOffset(newOffset, animate);

        return this;
    },
    
    setSnap : function(snap) {
        this.snap = snap;
    },

    snapToBoundary: function() {
        var offset = this.offsetBoundary.restrict(this.offset);
        offset.round();
        
        if (this.snap) {
            if (this.snap === true) {
                this.snap = {
                    x: 50,
                    y: 50
                };
            }
            else if (Ext.isNumber(this.snap)) {
                this.snap = {
                    x: this.snap,
                    y: this.snap
                };
            }
            if (this.snap.y) {
                offset.y = Math.round(offset.y / this.snap.y) * this.snap.y;
            }
            if (this.snap.x) {
                offset.x = Math.round(offset.x / this.snap.x) * this.snap.x;
            }

            if (!this.offset.equals(offset)) {
                this.scrollTo({x: -offset.x, y: -offset.y}, this.snapDuration);
            }
        }
        else if (!this.offset.equals(offset)) {
            this.setOffset(offset);
        }

        return this;
    },

    startMomentumAnimation: function(e) {
        if (
            (!this.momentum || !((e.event.timeStamp - this.lastEventTime) <= this.startMomentumResetTime)) &&
            !this.offsetBoundary.isOutOfBound(this.offset)
        ) {
            return false;
        }
        
        // Determine the duration of the momentum
        var duration = (e.time - this.startTime),
            minVelocity = this.minVelocityForAnimation,
            currentVelocity,
            currentOffset = this.offset.copy(),
            restrictedOffset;

        this.isBouncing = {x: false, y: false};
        this.isDecelerating = {x: false, y: false};
        
        // Determine the deceleration velocity
        this.animationStartVelocity = {
            x: (this.offset.x - this.startTimeOffset.x) / (duration / this.acceleration),
            y: (this.offset.y - this.startTimeOffset.y) / (duration / this.acceleration)
        };
        
        this.animationStartOffset = currentOffset;

        ['x', 'y'].forEach(function(axis) {
            this.isDecelerating[axis] = (Math.abs(this.animationStartVelocity[axis]) > minVelocity);
            if (this.bounces && this.bounces[axis]) {
                restrictedOffset = this.offsetBoundary.restrict(axis, currentOffset[axis]);
                
                if (restrictedOffset != currentOffset[axis]) {
                    currentVelocity = (currentOffset[axis] - restrictedOffset) * this.springTension * Math.E;
                    this.bouncingAnimation[axis].set({
                        startTime: e.time - ((1 / this.springTension) * this.acceleration),
                        startOffset: restrictedOffset,
                        startVelocity: currentVelocity
                    });
                    this.isBouncing[axis] = true;
                    this.fireEvent('bouncestart', this, {
                        axis: axis,
                        offset: restrictedOffset,
                        time: e.time,
                        velocity: currentVelocity
                    });
                    this.isDecelerating[axis] = false;
                }
            }
            
            if (this.isDecelerating[axis]) {
                this.decelerationAnimation[axis].set({
                    startVelocity: this.animationStartVelocity[axis],
                    startOffset: this.animationStartOffset[axis],
                    startTime: e.time
                });
            }
        }, this);
        
        if (this.isDecelerating.x || this.isDecelerating.y || this.isBouncing.x || this.isBouncing.y) {
            this.isAnimating = true;
            this.framesHandled = 0;
            this.fireEvent('momentumanimationstart');
            this.animationTimer = Ext.defer(this.handleFrame, this.frameDuration, this);
            return true;
        }

        return false;
    },

    stopMomentumAnimation: function() {
        if (this.isAnimating) {
            if (this.animationTimer) {
                clearTimeout(this.animationTimer);
            }

            this.isDecelerating = {};
            this.isBouncing = {};

            this.fireEvent('momentumanimationend');
            this.fireScrollEndEvent();
        }

        return this;
    },
    
    /**
     * @private
     */
    handleFrame : function() {
        if (!this.isAnimating) {
            return;
        }

        this.animationTimer = Ext.defer(this.handleFrame, this.frameDuration, this);
        
        var currentTime = (new Date()).getTime(),
            newOffset = this.offset.copy(),
            currentVelocity,
            restrictedOffset,
            outOfBoundDistance;
            
        ['x', 'y'].forEach(function(axis) {
            if (this.isDecelerating[axis]) {
                newOffset[axis] = this.decelerationAnimation[axis].getOffset();
                currentVelocity = this.animationStartVelocity[axis] * this.decelerationAnimation[axis].getFrictionFactor();
                outOfBoundDistance = this.offsetBoundary.getOutOfBoundOffset(axis, newOffset[axis]);

                // If the new offset is out of boundary, we are going to start a bounce
                if (outOfBoundDistance != 0) {
                    restrictedOffset = this.offsetBoundary.restrict(axis, newOffset[axis]);
                    if (this.bounces && this.bounces[axis]) {
                        this.bouncingAnimation[axis].set({
                            startTime: currentTime,
                            startOffset: restrictedOffset,
                            startVelocity: currentVelocity
                        });
                        this.isBouncing[axis] = true;
                        this.fireEvent('bouncestart', this, {
                            axis: axis,
                            offset: restrictedOffset,
                            time: currentTime,
                            velocity: currentVelocity
                        });
                    }
                    this.isDecelerating[axis] = false;
                }
                else if (Math.abs(currentVelocity) <= 1) {
                    this.isDecelerating[axis] = false;
                }
            }
            else if (this.isBouncing[axis]) {
                newOffset[axis] = this.bouncingAnimation[axis].getOffset();
                restrictedOffset = this.offsetBoundary.restrict(axis, newOffset[axis]);

                if (Math.abs(newOffset[axis] - restrictedOffset) <= 1) {
                    this.isBouncing[axis] = false;
                    this.fireEvent('bounceend', this, {
                        axis: axis,
                        offset: restrictedOffset,
                        time: currentTime,
                        velocity: 0
                    });
                    newOffset[axis] = restrictedOffset;
                }
            }            
        }, this);

        if (!this.isDecelerating.x && !this.isDecelerating.y && !this.isBouncing.x && !this.isBouncing.y) {
            this.stopMomentumAnimation();
            return;
        }

//        this.framesHandled++;

        this.setOffset(newOffset);

    },

    destroy: function() {
        return Ext.util.Scroller.superclass.destroy.apply(this, arguments);
    }
});

Ext.util.Scroller.Animation = {};

Ext.util.Scroller.Animation.Deceleration = Ext.extend(Ext.util.Draggable.Animation.Abstract, {
    acceleration: 30,
    omega: null,
    startVelocity: null,
    
    getOffset: function() {
        return this.startOffset - (
            (this.startVelocity / Math.log(this.omega)) -
            (this.startVelocity * (this.getFrictionFactor() / Math.log(this.omega)))
        );
    },
    
    getFrictionFactor : function() {
        var deltaTime = (new Date()).getTime() - this.startTime;

        return Math.pow(this.omega, deltaTime / this.acceleration);        
    }
});

Ext.util.Scroller.Animation.Bouncing = Ext.extend(Ext.util.Draggable.Animation.Abstract, {
    springTension: 0.3,
    acceleration: 30,
    startVelocity: null,
    
    getOffset: function() {
        var deltaTime = ((new Date()).getTime() - this.startTime),
            powTime = (deltaTime / this.acceleration) * Math.pow(Math.E, -this.springTension * (deltaTime / this.acceleration));

        return this.startOffset + (this.startVelocity * powTime);
    }
});

/**
 * @class Ext.util.Indicator
 * @extends Object
 *
 * Scroll indicator for the ScrollView
 */
Ext.util.Scroller.Indicator = Ext.extend(Object, {
    baseCls: 'x-scrollbar',
  
    type: 'horizontal',
    
    ui: 'dark',

    constructor: function(container, config) {
        this.container = container;
        
        Ext.apply(this, config);

        this.el = this.container.createChild({
            cls: [this.baseCls, this.baseCls + '-' + this.type, this.baseCls + '-' + this.ui].join(' ')
        });

        this.hide();
    },

    hide: function() {
        var me = this;

        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
        }

        this.hideTimer = setTimeout(function() {
            me.el.setStyle('opacity', 0);
        }, 100);

        return this;
    },

    show: function() {
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
        }

        this.el.setStyle('opacity', 1);

        return this;
    },

    setVisibility: function(isVisible) {
        this[isVisible ? 'show' : 'hide']();

        return this;
    },

    setSize: function(size) {
        if (this.size && size > this.size) {
            size = Math.round(size);
        }
        
        // this.el.setStyle(height) is cleaner here but let's save some performance...
        this.el.dom.style[(this.type == 'horizontal') ? 'width' : 'height'] = size + 'px';

        this.size = size;

        return this;
    },

    setOffset: function(p) {
        p = Math.round(p);
        
        var offset = (this.type == 'vertical') ? [0, p] : [p];
        
        Ext.Element.cssTransform(this.el, {translate: offset});

        return this;
    }
    
});

})();
