/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.menu.DateItem
 * @extends Ext.menu.Adapter
 * 一个通过封装 {@link Ext.DatPicker} 组件而成的菜单项。
 * @constructor
 * 创建一个 DateItem 对象
 * @param {Object} config 配置选项对象
 */
Ext.menu.DateItem = function(config){
    Ext.menu.DateItem.superclass.constructor.call(this, new Ext.DatePicker(config), config);
    /** The Ext.DatePicker object @type Ext.DatePicker */
    this.picker = this.component;
    this.addEvents({select: true});
    
    this.picker.on("render", function(picker){
        picker.getEl().swallowEvent("click");
        picker.container.addClass("x-menu-date-item");
    });

    this.picker.on("select", this.onSelect, this);
};

Ext.extend(Ext.menu.DateItem, Ext.menu.Adapter, {
    // private
    onSelect : function(picker, date){
        this.fireEvent("select", this, date, picker);
        Ext.menu.DateItem.superclass.handleClick.call(this);
    }
});