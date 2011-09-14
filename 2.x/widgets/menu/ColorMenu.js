/**
 * @class Ext.menu.ColorMenu
 * @extends Ext.menu.Menu
 * 一个包含 {@link Ext.menu.ColorItem} 组件的菜单（提供了基本的颜色选择器）。
 * @constructor
 * 创建一个 ColorMenu 对象
 * @param {Object} config 配置选项对象
 */
Ext.menu.ColorMenu = function(config){
    Ext.menu.ColorMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var ci = new Ext.menu.ColorItem(config);
    this.add(ci);
    /**
     * 该菜单中 {@link Ext.ColorPalette} 类的实例
     * @type ColorPalette
     */
    this.palette = ci.palette;
    /**
     * @event select
     * @param {ColorPalette} palette
     * @param {String} color
     */
    this.relayEvents(ci, ["select"]);
};
Ext.extend(Ext.menu.ColorMenu, Ext.menu.Menu);