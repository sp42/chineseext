/* // Internal developer documentation -- will not show up in API docs
 * @class Ext.dd.PanelProxy
 * 为 {@link Ext.Panel} 对象定制的拖拽代理的实现。该主要被 Panel 对象在内部调用以实现拖拽，因此不需要直接创建。
 * @constructor
 * @param panel 要代理的 {@link Ext.Panel} 对象
 * @param config 配置选项对象
 */
Ext.dd.PanelProxy = function(panel, config){
    this.panel = panel;
    this.id = this.panel.id +'-ddproxy';
    Ext.apply(this, config);
};

Ext.dd.PanelProxy.prototype = {
    /**
     * @cfg {Boolean} insertProxy 如果值为 true 则在拖拽 Panel 时插入一个代理占位元素，值为 false 则在拖拽时没有代理（默认为 true）。
     */
    insertProxy : true,

    // private overrides
    setStatus : Ext.emptyFn,
    reset : Ext.emptyFn,
    update : Ext.emptyFn,
    stop : Ext.emptyFn,
    sync: Ext.emptyFn,

    /**
     * 获取代理元素
     * @return {Element} 代理元素
     */
    getEl : function(){
        return this.ghost;
    },

    /**
     * 获取代理的影子元素
     * @return {Element} 代理的影子元素
     */
    getGhost : function(){
        return this.ghost;
    },

    /**
     * 获取代理元素
     * @return {Element} 代理元素
     */
    getProxy : function(){
        return this.proxy;
    },

    /**
     * 隐藏代理
     */
    hide : function(){
        if(this.ghost){
            if(this.proxy){
                this.proxy.remove();
                delete this.proxy;
            }
            this.panel.el.dom.style.display = '';
            this.ghost.remove();
            delete this.ghost;
        }
    },

    /**
     * 显示代理
     */
    show : function(){
        if(!this.ghost){
            this.ghost = this.panel.createGhost(undefined, undefined, Ext.getBody());
            this.ghost.setXY(this.panel.el.getXY())
            if(this.insertProxy){
                this.proxy = this.panel.el.insertSibling({cls:'x-panel-dd-spacer'});
                this.proxy.setSize(this.panel.getSize());
            }
            this.panel.el.dom.style.display = 'none';
        }
    },

    // private
    repair : function(xy, callback, scope){
        this.hide();
        if(typeof callback == "function"){
            callback.call(scope || this);
        }
    },

    /**
     * 将代理元素移动到 DOM 中不同的位置。通常该方法被用来当拖拽 Panel 对象时保持两者位置的同步。
     * @param {HTMLElement} parentNode 代理元素的父级 DOM 节点
     * @param {HTMLElement} before （可选）代理被插入的位置的前一个侧边节点（如果不指定则默认为父节点的最后一个子节点）
     */
    moveProxy : function(parentNode, before){
        if(this.proxy){
            parentNode.insertBefore(this.proxy.dom, before);
        }
    }
};

// private - DD implementation for Panels
Ext.Panel.DD = function(panel, cfg){
    this.panel = panel;
    this.dragData = {panel: panel};
    this.proxy = new Ext.dd.PanelProxy(panel, cfg);
    Ext.Panel.DD.superclass.constructor.call(this, panel.el, cfg);
    this.setHandleElId(panel.header.id);
    panel.header.setStyle('cursor', 'move');
    this.scroll = false;
};

Ext.extend(Ext.Panel.DD, Ext.dd.DragSource, {
    showFrame: Ext.emptyFn,
    startDrag: Ext.emptyFn,
    b4StartDrag: function(x, y) {
        this.proxy.show();
    },
    b4MouseDown: function(e) {
        var x = e.getPageX();
        var y = e.getPageY();
        this.autoOffset(x, y);
    },
    onInitDrag : function(x, y){
        this.onStartDrag(x, y);
        return true;
    },
    createFrame : Ext.emptyFn,
    getDragEl : function(e){
        return this.proxy.ghost.dom;
    },
    endDrag : function(e){
        this.proxy.hide();
        this.panel.saveState();
    },

    autoOffset : function(x, y) {
        x -= this.startPageX;
        y -= this.startPageY;
        this.setDelta(x, y);
    }
});