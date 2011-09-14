/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */


/**
 * @class Ext.form.Radio
 * @extends Ext.form.Checkbox
 * 单个的radio按钮。与Checkbox类似，提供一种简便，自动的输入方式。
 *  如果你给radio按钮组中的每个按钮相同的名字（属性name值相同），按钮组会自动被浏览器获得。
 * @constructor
 * 创建一个新的radio按钮对象
 * @param {Object} config 配置选项
 */
Ext.form.Radio = function(){
    Ext.form.Radio.superclass.constructor.apply(this, arguments);
};
Ext.extend(Ext.form.Radio, Ext.form.Checkbox, {
    inputType: 'radio',

    /**
     * 如果该radio是组的一部分，将返回已选中的值。
     * @return {String}
     */
    getGroupValue : function(){
        return this.el.up('form').child('input[name='+this.el.dom.name+']:checked', true).value;
    }
});