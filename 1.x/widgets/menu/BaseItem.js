/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.menu.BaseItem
 * @extends Ext.Component
 * 菜单组件中包含的所有选项的基类。BaseItem 提供默认的渲染、活动状态管理和由菜单组件共享的基本配置。
 * @constructor
 * 创建一个 BaseItem 对象
 * @param {Object} config 配置选项对象
 */
Ext.menu.BaseItem = function(config){
    Ext.menu.BaseItem.superclass.constructor.call(this, config);

    this.addEvents({
        /**
         * @event click
         * 当该选项被点击时触发
         * @param {Ext.menu.BaseItem} this
         * @param {Ext.EventObject} e
         */
        click: true,
        /**
         * @event activate
         * 当该选项被激活时触发
         * @param {Ext.menu.BaseItem} this
         */
        activate : true,
        /**
         * @event deactivate
         * 当该选项被释放里触发
         * @param {Ext.menu.BaseItem} this
         */
        deactivate : true
    });

    if(this.handler){
        this.on("click", this.handler, this.scope, true);
    }
};

Ext.extend(Ext.menu.BaseItem, Ext.Component, {
    /**
     * @cfg {Function} handler
     * 用来处理该选项单击事件的函数（默认为 undefined）
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