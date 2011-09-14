/**
 * @class Ext.menu.Separator
 * @extends Ext.menu.BaseItem
 * 添加一个分隔栏到菜单中，用来区分菜单项的逻辑分组。通常你可以在调用 add()方法时或者在菜单项的配置选项中使用 "-" 参数直接创建一个分隔栏。
 * @constructor
 * 创建一个Separator对象
 * @param {Object} config 配置选项对象
 */
Ext.menu.Separator = function(config){
    Ext.menu.Separator.superclass.constructor.call(this, config);
};

Ext.extend(Ext.menu.Separator, Ext.menu.BaseItem, {

    /**
     * @cfg {String} itemCls 分隔栏使用的默认CSS样式类（默认为 "x-menu-sep"）
     */
    itemCls : "x-menu-sep",

    /**
     * @cfg {Boolean} hideOnClick 值为 True 时该项被点击后隐藏包含的菜单（默认为 false）
     */
    hideOnClick : false,

    // private
    onRender : function(li){
        var s = document.createElement("span");
        s.className = this.itemCls;
        s.innerHTML = "&#160;";
        this.el = s;
        li.addClass("x-menu-sep-li");
        Ext.menu.Separator.superclass.onRender.apply(this, arguments);
    }
});