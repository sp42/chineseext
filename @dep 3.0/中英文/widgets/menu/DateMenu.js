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
 * @class Ext.menu.DateMenu
 * @extends Ext.menu.Menu
 * 一个包含 {@link Ext.menu.DateItem} 组件的菜单（提供了日期选择器）。<br />
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