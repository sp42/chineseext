/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.dd.DragSource
 * @extends Ext.dd.DDProxy
 * 一个简单的基础类,该实现使得任何元素变成为拖动,以便让拖动的元素放到其身上。
 * @constructor
 * @param {String/HTMLElement/Element} el 容器元素
 * @param {Object} config
 */
Ext.dd.DragSource = function(el, config){
    this.el = Ext.get(el);
    this.dragData = {};
    
    Ext.apply(this, config);
    
    if(!this.proxy){
        this.proxy = new Ext.dd.StatusProxy();
    }
    Ext.dd.DragSource.superclass.constructor.call(this, this.el.dom, this.ddGroup || this.group, 
          {dragElId : this.proxy.id, resizeFrame: false, isTarget: false, scroll: this.scroll === true});
    
    this.dragging = false;
};

Ext.extend(Ext.dd.DragSource, Ext.dd.DDProxy, {
    /**
     * @cfg {String} dropAllowed
     * 当落下被允许的时候返回到拖动源的样式（默认为"x-dd-drop-ok"）。
     */
    dropAllowed : "x-dd-drop-ok",
    /**
     * @cfg {String} dropNotAllowed
     * 当落下不允许的时候返回到拖动源的样式（默认为"x-dd-drop-nodrop"）。
     */
    dropNotAllowed : "x-dd-drop-nodrop",

    /**
     * 返回与拖动源关联的数据对象
     * @return {Object} data 包含自定义数据的对象
     */
    getDragData : function(e){
        return this.dragData;
    },

    // private
    onDragEnter : function(e, id){
        var target = Ext.dd.DragDropMgr.getDDById(id);
        this.cachedTarget = target;
        if(this.beforeDragEnter(target, e, id) !== false){
            if(target.isNotifyTarget){
                var status = target.notifyEnter(this, e, this.dragData);
                this.proxy.setStatus(status);
            }else{
                this.proxy.setStatus(this.dropAllowed);
            }
            
            if(this.afterDragEnter){
                /**
                 * 默认为一空函数，但你可提供一个自定义动作的实现，这个实现在拖动条目进入落下目标的时候。
                 * @param {Ext.dd.DragDrop} target 落下目标
                 * @param {Event} e 事件对象
                 * @param {String} id 被拖动元素之id
                 * @method afterDragEnter
                 */
                this.afterDragEnter(target, e, id);
            }
        }
    },

    /**
     * 默认是一个空函数，在拖动项进入落下目标时，你应该提供一个自定义的动作。
     * 该动作可被取消onDragEnter。
     * @param {Ext.dd.DragDrop} target 落下目标
     * @param {Event} e 事件对象
     * @param {String} id 被拖动元素之id
     * @return {Boolean} isValid true的话说明拖动事件是有效的，false代表取消
     */
    beforeDragEnter : function(target, e, id){
        return true;
    },

    // private
    alignElWithMouse: function() {
        Ext.dd.DragSource.superclass.alignElWithMouse.apply(this, arguments);
        this.proxy.sync();
    },

    // private
    onDragOver : function(e, id){
        var target = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(id);
        if(this.beforeDragOver(target, e, id) !== false){
            if(target.isNotifyTarget){
                var status = target.notifyOver(this, e, this.dragData);
                this.proxy.setStatus(status);
            }

            if(this.afterDragOver){
                /**
    			 * 默认是一个空函数，在拖动项位于落下目标上方时（由实现促成的），你应该提供一个自定义的动作。
                 * @param {Ext.dd.DragDrop} target 落下目标
                 * @param {Event} e 事件对象
                 * @param {String} id 被拖动元素之id
                 * @method afterDragOver
                 */
                this.afterDragOver(target, e, id);
            }
        }
    },

    /**
     * 默认是一个空函数，在拖动项位于落下目标上方时，你应该提供一个自定义的动作。
     * 该动作可被取消。
     * @param {Ext.dd.DragDrop} target 落下目标
     * @param {Event} e 事件对象
     * @param {String} id 被拖动元素之id
     * @return {Boolean} isValid true的话说明拖动事件是有效的，false代表取消
     */
    beforeDragOver : function(target, e, id){
        return true;
    },

    // private
    onDragOut : function(e, id){
        var target = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(id);
        if(this.beforeDragOut(target, e, id) !== false){
            if(target.isNotifyTarget){
                target.notifyOut(this, e, this.dragData);
            }
            this.proxy.reset();
            if(this.afterDragOut){
                /**
			     * 默认是一个空函数，在拖动项离开目标而没有落下之前，你应该提供一个自定义的动作。
			     * 该动作可被取消。
                 * @param {Ext.dd.DragDrop} target 落下目标
                 * @param {Event} e 事件对象
                 * @param {String} id 被拖动元素之id
                 * @method afterDragOut
                 */
                this.afterDragOut(target, e, id);
            }
        }
        this.cachedTarget = null;
    },

    /**
     * 默认是一个空函数，在拖动项离开目标而没有落下之前，你应该提供一个自定义的动作。
     * 该动作可被取消。
     * @param {Ext.dd.DragDrop} target 落下目标
     * @param {Event} e 事件对象
     * @param {String} id 被拖动元素之id
     * @return {Boolean} isValid true的话说明拖动事件是有效的，false代表取消
     */
    beforeDragOut : function(target, e, id){
        return true;
    },
    
    // private
    onDragDrop : function(e, id){
        var target = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(id);
        if(this.beforeDragDrop(target, e, id) !== false){
            if(target.isNotifyTarget){
                if(target.notifyDrop(this, e, this.dragData)){ // valid drop?
                    this.onValidDrop(target, e, id);
                }else{
                    this.onInvalidDrop(target, e, id);
                }
            }else{
                this.onValidDrop(target, e, id);
            }
            
            if(this.afterDragDrop){
                /**
			     * 默认是一个空函数，在由实现促成的有效拖放发生之后，你应该提供一个自定义的动作。
                 * @param {Ext.dd.DragDrop} target 落下目标
                 * @param {Event} e 事件对象
                 * @param {String} id 落下元素的id
                 * @method afterDragDrop
                 */
                this.afterDragDrop(target, e, id);
            }
        }
    },

    /**
     * 默认是一个空函数，在拖动项被放下到目标之前，你应该提供一个自定义的动作。
     * 该动作可被取消。
     * @param {Ext.dd.DragDrop} target 落下目标
     * @param {Event} e 事件对象
     * @param {String} id 被拖动元素之id
     * @return {Boolean} isValid true的话说明拖动事件是有效的，false代表取消
     */
    beforeDragDrop : function(target, e, id){
        return true;
    },

    // private
    onValidDrop : function(target, e, id){
        this.hideProxy();
        if(this.afterValidDrop){
            /**
    		 * 默认是一个空函数，在由实现促成的有效落下发生之后，你应该提供一个自定义的动作。
             * @param {Object} target DD目标
             * @param {Event} e 事件对象
             * @param {String} id 落下元素的id
             * @method afterInvalidDrop
             */
            this.afterValidDrop(target, e, id);
        }
    },

    // private
    getRepairXY : function(e, data){
        return this.el.getXY();  
    },

    // private
    onInvalidDrop : function(target, e, id){
        this.beforeInvalidDrop(target, e, id);
        if(this.cachedTarget){
            if(this.cachedTarget.isNotifyTarget){
                this.cachedTarget.notifyOut(this, e, this.dragData);
            }
            this.cacheTarget = null;
        }
        this.proxy.repair(this.getRepairXY(e, this.dragData), this.afterRepair, this);

        if(this.afterInvalidDrop){
            /**
    		 * 默认是一个空函数，在由实现促成的无效落下发生之后，你应该提供一个自定义的动作。
             * @param {Event} e 事件对象
             * @param {String} id 落下元素的id
             * @method afterInvalidDrop
             */
            this.afterInvalidDrop(e, id);
        }
    },

    // private
    afterRepair : function(){
        if(Ext.enableFx){
            this.el.highlight(this.hlColor || "c3daf9");
        }
        this.dragging = false;
    },

    /**
     * 默认是一个空函数，在一次无效的落下发生之后，你应该提供一个自定义的动作。
     * @param {Ext.dd.DragDrop} target 落下目标
     * @param {Event} e 事件对象
     * @param {String} id 拖动元素的id
     * @return {Boolean} isValid true的话说明拖动事件是有效的，false代表取消
     */
    beforeInvalidDrop : function(target, e, id){
        return true;
    },

    // private
    handleMouseDown : function(e){
        if(this.dragging) {
            return;
        }
        var data = this.getDragData(e);
        if(data && this.onBeforeDrag(data, e) !== false){
            this.dragData = data;
            this.proxy.stop();
            Ext.dd.DragSource.superclass.handleMouseDown.apply(this, arguments);
        } 
    },

    /**
     * 默认是一个空函数，在初始化拖动事件之前，你应该提供一个自定义的动作。
     * 该动作可被取消。
     * @param {Object} data 与落下目标共享的自定义数据对象
     * @param {Event} e 事件对象
     * @return {Boolean} isValid True的话拖动事件有效，否则false取消
     */
    onBeforeDrag : function(data, e){
        return true;
    },

    /**
     * 默认是一个空函数，一旦拖动事件开始，你应该提供一个自定义的动作。
     * 不能在该函数中取消拖动。
     * @param {Number} x 在拖动对象身上单击点的x值
     * @param {Number} y 在拖动对象身上单击点的y值
     */
    onStartDrag : Ext.emptyFn,

    // private - YUI override
    startDrag : function(x, y){
        this.proxy.reset();
        this.dragging = true;
        this.proxy.update("");
        this.onInitDrag(x, y);
        this.proxy.show();
    },

    // private
    onInitDrag : function(x, y){
        var clone = this.el.dom.cloneNode(true);
        clone.id = Ext.id(); // prevent duplicate ids
        this.proxy.update(clone);
        this.onStartDrag(x, y);
        return true;
    },

    /**
     * 返回拖动源所在的{@link Ext.dd.StatusProxy}
     * @return {Ext.dd.StatusProxy} proxy StatusProxy对象
     */
    getProxy : function(){
        return this.proxy;  
    },

    /**
     * 隐藏拖动源的{@link Ext.dd.StatusProxy}
     */
    hideProxy : function(){
        this.proxy.hide();  
        this.proxy.reset(true);
        this.dragging = false;
    },

    // private
    triggerCacheRefresh : function(){
        Ext.dd.DDM.refreshCache(this.groups);
    },

    // private - override to prevent hiding
    b4EndDrag: function(e) {
    },

    // private - override to prevent moving
    endDrag : function(e){
        this.onEndDrag(this.dragData, e);
    },

    // private
    onEndDrag : function(data, e){
    },
    
    // private - pin to cursor
    autoOffset : function(x, y) {
        this.setDelta(-12, -20);
    }    
});