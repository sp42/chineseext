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
 * @class Ext.menu.TextItem
 * @extends Ext.menu.BaseItem
 * 添加一个静态文本到菜单中，通常用来作为标题或者组分隔符。
 * @constructor 创建一个 TextItem 对象
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