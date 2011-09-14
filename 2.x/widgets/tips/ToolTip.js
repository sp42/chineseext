/**
 * @class Ext.ToolTip
 * @extends Ext.Tip
 * 一个标准的快捷提示实现，用于悬浮在目标元素之上时出现的提示信息。
 * @constructor
 * 建立快捷提示新对象
 * @param {Object} config 配置项对象
 */
Ext.ToolTip = Ext.extend(Ext.Tip, {
    /**
     * @cfg {Mixed} target HTMLElement目标元素，既可是Ext.Element或是与这个快捷提示相关联的id。
     */
    /**
    * @cfg {Boolean} autoHide
    * 值为 true 时在鼠标移出目标元素自动隐藏快捷提示(默认为 true)。与{@link #dismissDelay}协同生效（默认为true）。
    * 若{@link closable}，一个关闭的按钮会出现在快捷提示的开头。
    */   
    /**
    * @cfg {Number} showDelay
    * 以毫秒表示的当鼠标进入目标元素后显示快捷提示的延迟时间(默认为 500)
    */
    showDelay: 500,
   /**
    * @cfg {Number} hideDelay
    * 以毫秒表示的隐藏快捷提示的延迟时间。设置为0立即隐藏快捷提示。
    */   
    hideDelay: 200,
   /**
    * @cfg {Number} dismissDelay
    * 以毫秒表示的隐藏快捷提示的延迟时间, 仅在 autoDismiss = true 时生效(默认为 5000)。要禁止隐藏，设置dismissDelay ＝ 0
    */
    dismissDelay: 5000,
    /**
     * @cfg {Array} mouseOffset Tooltip显示时，距离鼠标位置一定的XY偏移（默认[15,18]）。
     */
    mouseOffset: [15,18],
    /**
    * @cfg {Boolean} trackMouse 值为 true 时当鼠标经过目标对象时快捷提示将跟随鼠标移动(默认为 false)
    */   
    trackMouse : false,
    constrainPosition: true,

    // private
    initComponent: function(){
        Ext.ToolTip.superclass.initComponent.call(this);
        this.lastActive = new Date();
        this.initTarget();
    },

    // private
    initTarget : function(){
        if(this.target){
            this.target = Ext.get(this.target);
            this.target.on('mouseover', this.onTargetOver, this);
            this.target.on('mouseout', this.onTargetOut, this);
            this.target.on('mousemove', this.onMouseMove, this);
        }
    },

    // private
    onMouseMove : function(e){
        this.targetXY = e.getXY();
        if(!this.hidden && this.trackMouse){
            this.setPagePosition(this.getTargetXY());
        }
    },

    // private
    getTargetXY : function(){
        return [this.targetXY[0]+this.mouseOffset[0], this.targetXY[1]+this.mouseOffset[1]];
    },

    // private
    onTargetOver : function(e){
        if(this.disabled || e.within(this.target.dom, true)){
            return;
        }
        this.clearTimer('hide');
        this.targetXY = e.getXY();
        this.delayShow();
    },

    // private
    delayShow : function(){
        if(this.hidden && !this.showTimer){
            if(this.lastActive.getElapsed() < this.quickShowInterval){
                this.show();
            }else{
                this.showTimer = this.show.defer(this.showDelay, this);
            }
        }else if(!this.hidden && this.autoHide !== false){
            this.show();
        }
    },

    // private
    onTargetOut : function(e){
        if(this.disabled || e.within(this.target.dom, true)){
            return;
        }
        this.clearTimer('show');
        if(this.autoHide !== false){
            this.delayHide();
        }
    },

    // private
    delayHide : function(){
        if(!this.hidden && !this.hideTimer){
            this.hideTimer = this.hide.defer(this.hideDelay, this);
        }
    },

    /**
     * 隐藏快捷提示。
     */
    hide: function(){
        this.clearTimer('dismiss');
        this.lastActive = new Date();
        Ext.ToolTip.superclass.hide.call(this);
    },

    /**
     * 在当前事件对象XY的位置上显示快捷提示。
     * 
     */
    show : function(){
        this.showAt(this.getTargetXY());
    },

    // inherit docs
    showAt : function(xy){
        this.lastActive = new Date();
        this.clearTimers();
        Ext.ToolTip.superclass.showAt.call(this, xy);
        if(this.dismissDelay && this.autoHide !== false){
            this.dismissTimer = this.hide.defer(this.dismissDelay, this);
        }
    },

    // private
    clearTimer : function(name){
        name = name + 'Timer';
        clearTimeout(this[name]);
        delete this[name];
    },

    // private
    clearTimers : function(){
        this.clearTimer('show');
        this.clearTimer('dismiss');
        this.clearTimer('hide');
    },

    // private
    onShow : function(){
        Ext.ToolTip.superclass.onShow.call(this);
        Ext.getDoc().on('mousedown', this.onDocMouseDown, this);
    },

    // private
    onHide : function(){
        Ext.ToolTip.superclass.onHide.call(this);
        Ext.getDoc().un('mousedown', this.onDocMouseDown, this);
    },

    // private
    onDocMouseDown : function(e){
        if(this.autoHide !== false && !e.within(this.el.dom)){
            this.disable();
            this.enable.defer(100, this);
        }
    },

    // private
    onDisable : function(){
        this.clearTimers();
        this.hide();
    },

    // private
    adjustPosition : function(x, y){
        // keep the position from being under the mouse
        var ay = this.targetXY[1], h = this.getSize().height;
        if(this.constrainPosition && y <= ay && (y+h) >= ay){
            y = ay-h-5;
        }
        return {x : x, y: y};
    },

    // private
    onDestroy : function(){
        Ext.ToolTip.superclass.onDestroy.call(this);
        if(this.target){
            this.target.un('mouseover', this.onTargetOver, this);
            this.target.un('mouseout', this.onTargetOut, this);
            this.target.un('mousemove', this.onMouseMove, this);
        }
    }
});