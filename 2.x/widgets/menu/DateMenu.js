/**
 * @class Ext.menu.DateMenu
 * @extends Ext.menu.Menu
 * 一个包含 {@link Ext.menu.DateItem} 组件的菜单（提供了日期选择器）。
 * @constructor
 * 创建一个 DateMenu 对象
 * @param {Object} config 配置选项对象
 */
Ext.menu.DateMenu = function(config){
    Ext.menu.DateMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var di = new Ext.menu.DateItem(config);
    this.add(di);
    /**
     * 此菜单中 {@link Ext.DatePicker} 类的实例
     * @type DatePicker
     */
    this.picker = di.picker;
    /**
     * @event select
     * @param {DatePicker} picker
     * @param {Date} date
     */
    this.relayEvents(di, ["select"]);

    this.on('beforeshow', function(){
        if(this.picker){
            this.picker.hideMonthPicker(true);
        }
    }, this);
};
Ext.extend(Ext.menu.DateMenu, Ext.menu.Menu, {
    cls:'x-date-menu'
});