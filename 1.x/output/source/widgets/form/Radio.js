/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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