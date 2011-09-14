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
 * @class Ext.menu.Item
 * @extends Ext.menu.BaseItem
 * 所有与菜单功能相关的（如：子菜单）以及非静态显示的菜单项的基类。Item 类继承了 {@link Ext.menu.BaseItem} 
 * 类的基本功能，并添加了菜单所特有的动作和点击事件的处理方法<br />
 * @constructor
 * 创建一个 Item 对象
 * @param {Object} config 配置选项对象
 */
Ext.menu.Item = function(config){
    Ext.menu.Item.superclass.constructor.call(this, config);
    if(this.menu){
        this.menu = Ext.menu.MenuMgr.get(this.menu);
    }
};
Ext.extend(Ext.menu.Item, Ext.menu.BaseItem, {

	/**
     * @cfg {String} icon
     * 指定该菜单项显示的图标的路径（默认为 Ext.BLANK_IMAGE_URL）如果icon指定了{@link #iconCls}就不应存在
     */
	/**
     * @cfg {String} iconCls 定义了背景图的CSS样式类，用于该项的图标显示。(默认为 '')
	 * 如果iconCls指定了{@link #icon}就不应存在
     */

	/**
     * @cfg {String} text 此项显示的文本 (默认为 '').
     */
	/**
     * @cfg {String} href 要使用的那个连接的href属性 (默认为 '#').
     */
	/**
     * @cfg {String} hrefTarget 要使用的那个连接的target属性 (defaults to '').
     */
	/**
     * @cfg {String} itemCls The 菜单项使用的默认CSS样式类（默认为 "x-menu-item"）
     */
    itemCls : "x-menu-item",
	/**
     * @cfg {Boolean} canActivate 值为 True 时该选项能够在可见的情况下被激活（默认为 true）
     */
    canActivate : true,
	/**
     * @cfg {Number} showDelay 菜单项显示之前的延时时间（默认为200）
     */
    showDelay: 200,
    // doc'd in BaseItem
    hideDelay: 200,

    // private
    ctype: "Ext.menu.Item",

    // private
    onRender : function(container, position){
        var el = document.createElement("a");
        el.hideFocus = true;
        el.unselectable = "on";
        el.href = this.href || "#";
        if(this.hrefTarget){
            el.target = this.hrefTarget;
        }
        el.className = this.itemCls + (this.menu ?  " x-menu-item-arrow" : "") + (this.cls ?  " " + this.cls : "");
        el.innerHTML = String.format(
                '<img src="{0}" class="x-menu-item-icon {2}" />{1}',
                this.icon || Ext.BLANK_IMAGE_URL, this.itemText||this.text||'&#160;', this.iconCls || '');
        this.el = el;
        Ext.menu.Item.superclass.onRender.call(this, container, position);
    },

	/**
     * 设置该菜单项显示的文本
     * @param {String} text 显示的文本
     */
    setText : function(text){
        this.text = text||'&#160;';
        if(this.rendered){
            this.el.update(String.format(
                '<img src="{0}" class="x-menu-item-icon {2}">{1}',
                this.icon || Ext.BLANK_IMAGE_URL, this.text, this.iconCls || ''));
            this.parentMenu.doAutoSize();
        }
    },

	/**
     * 把CSS样式类得效果应用在items的图标元素上
     * @param {String} cls The CSS class to apply
     */
    setIconClass : function(cls){
        var oldCls = this.iconCls;
        this.iconCls = cls;
        if(this.rendered){
            this.el.child('img.x-menu-item-icon').replaceClass(oldCls, this.iconCls);
        }
    },
    
    //private
    beforeDestroy: function(){
        if (this.menu){
            this.menu.destroy();
        }
        Ext.menu.Item.superclass.beforeDestroy.call(this);
    },
    
    // private
    handleClick : function(e){
        if(!this.href){ // if no link defined, stop the event automatically
            e.stopEvent();
        }
        Ext.menu.Item.superclass.handleClick.apply(this, arguments);
    },

    // private
    activate : function(autoExpand){
        if(Ext.menu.Item.superclass.activate.apply(this, arguments)){
            this.focus();
            if(autoExpand){
                this.expandMenu();
            }
        }
        return true;
    },

    // private
    shouldDeactivate : function(e){
        if(Ext.menu.Item.superclass.shouldDeactivate.call(this, e)){
            if(this.menu && this.menu.isVisible()){
                return !this.menu.getEl().getRegion().contains(e.getPoint());
            }
            return true;
        }
        return false;
    },

    // private
    deactivate : function(){
        Ext.menu.Item.superclass.deactivate.apply(this, arguments);
        this.hideMenu();
    },

    // private
    expandMenu : function(autoActivate){
        if(!this.disabled && this.menu){
            clearTimeout(this.hideTimer);
            delete this.hideTimer;
            if(!this.menu.isVisible() && !this.showTimer){
                this.showTimer = this.deferExpand.defer(this.showDelay, this, [autoActivate]);
            }else if (this.menu.isVisible() && autoActivate){
                this.menu.tryActivate(0, 1);
            }
        }
    },

    // private
    deferExpand : function(autoActivate){
        delete this.showTimer;
        this.menu.show(this.container, this.parentMenu.subMenuAlign || "tl-tr?", this.parentMenu);
        if(autoActivate){
            this.menu.tryActivate(0, 1);
        }
    },

    // private
    hideMenu : function(){
        clearTimeout(this.showTimer);
        delete this.showTimer;
        if(!this.hideTimer && this.menu && this.menu.isVisible()){
            this.hideTimer = this.deferHide.defer(this.hideDelay, this);
        }
    },

    // private
    deferHide : function(){
        delete this.hideTimer;
        this.menu.hide();
    }
});   }
    },

    // private
    deferHide : function(){
        delete this.hideTimer;
        this.menu.hide();
    }
});