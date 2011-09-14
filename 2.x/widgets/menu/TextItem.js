/**
 * @class Ext.menu.TextItem
 * @extends Ext.menu.BaseItem
 * 添加一个静态文本到菜单中，通常用来作为标题或者组分隔符。
 * @constructor
 * 创建一个 TextItem 对象
 * @param {String} text 要显示的文本
 */
Ext.menu.TextItem = function(text){
    this.text = text;
    Ext.menu.TextItem.superclass.constructor.call(this);
};

Ext.extend(Ext.menu.TextItem, Ext.menu.BaseItem, {
    /**
     * @cfg {String} text 此项所显示的文本（默认为''）
     */
    /**
     * @cfg {Boolean} hideOnClick 值为 True 时该项被点击后隐藏包含的菜单（默认为 false）
     */
    hideOnClick : false,
    /**
     * @cfg {String} itemCls 文本项使用的默认CSS样式类（默认为 "x-menu-text"）
     */
    itemCls : "x-menu-text",

    // private
    onRender : function(){
        var s = document.createElement("span");
        s.className = this.itemCls;
        s.innerHTML = this.text;
        this.el = s;
        Ext.menu.TextItem.superclass.onRender.apply(this, arguments);
    }
});