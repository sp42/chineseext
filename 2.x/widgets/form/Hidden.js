/**
 * @class Ext.form.Hidden
 * @extends Ext.form.Field
 * 用于存放表单里需要被传递到后台的隐藏值得隐藏域。
 * @constructor
 * 生成一个隐藏字段。
 * @param {Object} config 配置项
 */
Ext.form.Hidden = Ext.extend(Ext.form.Field, {
    // private
    inputType : 'hidden',

    // private
    onRender : function(){
        Ext.form.Hidden.superclass.onRender.apply(this, arguments);
    },

    // private
    initEvents : function(){
        this.originalValue = this.getValue();
    },

    // These are all private overrides
    setSize : Ext.emptyFn,
    setWidth : Ext.emptyFn,
    setHeight : Ext.emptyFn,
    setPosition : Ext.emptyFn,
    setPagePosition : Ext.emptyFn,
    markInvalid : Ext.emptyFn,
    clearInvalid : Ext.emptyFn
});
Ext.reg('hidden', Ext.form.Hidden);