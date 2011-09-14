/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
 * 
 * 本翻译采用“创作共同约定、Creative Commons”。您可以自由：
 * 复制、发行、展览、表演、放映、广播或通过信息网络传播本作品
 * 创作演绎作品
 * 请遵守：
 *    署名. 您必须按照作者或者许可人指定的方式对作品进行署名。
 * # 对任何再使用或者发行，您都必须向他人清楚地展示本作品使用的许可协议条款。
 * # 如果得到著作权人的许可，您可以不受任何这些条件的限制
 * http://creativecommons.org/licenses/by/2.5/cn/
 */
/**
 * // Internal developer documentation -- will not show up in API docs
 * @class Ext.dd.PanelProxy
 * 为{@link Ext.Panel}对象定制的拖拽代理的实现。该主要被Panel对象在内部调用以实现拖拽，因此不需要直接创建。
 * A custom drag proxy implementation specific to {@link Ext.Panel}s. This class is primarily used internally
 * for the Panel's drag drop implementation, and should never need to be created directly.
 * @constructor
 * @param {Ext.Panel} panel 要代理的{@link Ext.Panel}对象。The {@link Ext.Panel} to proxy for
 * @param {Object} config 配置选项对象。Configuration options
 */
Ext.dd.PanelProxy = function(panel, config){
    this.panel = panel;
    this.id = this.panel.id +'-ddproxy';
    Ext.apply(this, config);
};

Ext.dd.PanelProxy.prototype = {
    /**
     * @cfg {Boolean} insertProxy 如果值为 true 则在拖拽Panel时插入一个代理占位元素，值为 false 则在拖拽时没有代理（默认为 true）。
     * True to insert a placeholder proxy element while dragging the panel,
     * false to drag with no proxy (defaults to true).
     */
    insertProxy : true,

    // private overrides
    setStatus : Ext.emptyFn,
    reset : Ext.emptyFn,
    update : Ext.emptyFn,
    stop : Ext.emptyFn,
    sync: Ext.emptyFn,

    /**
     * 获取代理元素。
     * Gets the proxy's element
     * @return {Element} 代理元素。The proxy's element
     */
    getEl : function(){
        return this.ghost;
    },

    /**
     * 获取代理的影子元素。
     * Gets the proxy's ghost element
     * @return {Element} 代理的影子元素。The proxy's ghost element
     */
    getGhost : function(){
        return this.ghost;
    },

    /**
     * 获取代理元素。
     * Gets the proxy's element
     * @return {Element} 代理元素。The proxy's element
     */
    getProxy : function(){
        return this.proxy;
    },

    /**
     * 隐藏代理。
     * Hides the proxy
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
     * 显示代理。
     * Shows the proxy
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
     * 将代理元素移动到 DOM 中不同的位置。通常该方法被用来当拖拽Panel对象时保持两者位置的同步。 
     * Moves the proxy to a different position in the DOM.  This is typically called while dragging the Panel
     * to keep the proxy sync'd to the Panel's location.
     * @param {HTMLElement} parentNode 代理元素的父级DOM节点。The proxy's parent DOM node
     * @param {HTMLElement} before （可选的）代理被插入的位置的前一个侧边节点（如果不指定则默认为父节点的最后一个子节点） (optional)The sibling node before which the proxy should be inserted (defaults
     * to the parent's last child if not specified)
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
    var h = panel.header;
    if(h){
        this.setHandleElId(h.id);
    }
    (h ? h : this.panel.body).setStyle('cursor', 'move');
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