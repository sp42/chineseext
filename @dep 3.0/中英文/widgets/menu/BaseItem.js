/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=90 Ext中文站翻译小组
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
 * @class Ext.menu.BaseItem
 * @extends Ext.Component
 * 菜单组件中包含的所有选项的基类。BaseItem 提供默认的渲染、活动状态管理和由菜单组件共享的基本配置。<br />
 * @constructor
 * 创建一个 BaseItem 对象
 * @param {Object} config 配置选项对象
 */
Ext.menu.BaseItem = function(config){
    Ext.menu.BaseItem.superclass.constructor.call(this, config);

    this.addEvents(

		/**
         * @event click
         * 当该选项被点击时触发
         * @param {Ext.menu.BaseItem} this
         * @param {Ext.EventObject} e
         */
        'click',

	    /**
         * @event activate
         * 当该选项被激活时触发
         * @param {Ext.menu.BaseItem} this
         */
        'activate',

		/**
         * @event deactivate
         * 当该选项被释放里触发
         * @param {Ext.menu.BaseItem} this
         */
        'deactivate'
    );

    if(this.handler){
        this.on("click", this.handler, this.scope);
    }
};

Ext.extend(Ext.menu.BaseItem, Ext.Component, {

	/**
     * @cfg {Function} handler
     * 用来处理该选项单击事件的函数（默认为 undefined）
     */

	/**
     * @cfg {Object} scope
     * 句柄函数内的作用域会被调用
     */

	/**
     * @cfg {Boolean} canActivate 值为 True 时该选项能够在可见的情况下被激活
     */
    canActivate : false,

	/**
     * @cfg {String} activeClass 当该选项成为激活状态时所使用的CSS样式类（默认为 "x-menu-item-active"）
     */
    activeClass : "x-menu-item-active",

	/**
     * @cfg {Boolean} hideOnClick 值为 True 时该选项单击后隐藏所包含的菜单（默认为 true）
     */
    hideOnClick : true,

	/**
     * @cfg {Number} hideDelay 以毫秒为单位表示的单击后隐藏的延迟时间（默认为 100）
     */
    hideDelay : 100,

    // private
    ctype: "Ext.menu.BaseItem",

    // private
    actionMode : "container",

    // private
    render : function(container, parentMenu){
        this.parentMenu = parentMenu;
        Ext.menu.BaseItem.superclass.render.call(this, container);
        this.container.menuItemId = this.id;
    },

    // private
    onRender : function(container, position){
        this.el = Ext.get(this.el);
        container.dom.appendChild(this.el.dom);
    },

    /** 
     * 为该项设置单击事件的句柄（相当于传入一个{@link #handler}配置项属性）
     * 如果该句柄以登记，那么先会把它卸掉。
     * @param {Function} handler 单击时所执行的函数
     * @param {Object} scope 句柄所在的作用域
     */
    setHandler : function(handler, scope){
        if(this.handler){
            this.un("click", this.handler, this.scope);
        }
        this.on("click", this.handler = handler, this.scope = scope);
    },

    // private
    onClick : function(e){
        if(!this.disabled && this.fireEvent("click", this, e) !== false
                && this.parentMenu.fireEvent("itemclick", this, e) !== false){
            this.handleClick(e);
        }else{
            e.stopEvent();
        }
    },

    // private
    activate : function(){
        if(this.disabled){
            return false;
        }
        var li = this.container;
        li.addClass(this.activeClass);
        this.region = li.getRegion().adjust(2, 2, -2, -2);
        this.fireEvent("activate", this);
        return true;
    },

    // private
    deactivate : function(){
        this.container.removeClass(this.activeClass);
        this.fireEvent("deactivate", this);
    },

    // private
    shouldDeactivate : function(e){
        return !this.region || !this.region.contains(e.getPoint());
    },

    // private
    handleClick : function(e){
        if(this.hideOnClick){
            this.parentMenu.hide.defer(this.hideDelay, this.parentMenu, [true]);
        }
    },

    // private
    expandMenu : function(autoActivate){
        // do nothing
    },

    // private
    hideMenu : function(){
        // do nothing
    }
});