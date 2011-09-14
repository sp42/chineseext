/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.form.NumberField
 * @extends Ext.form.TextField
 * 数字型文本域，提供自动键击过滤和数字校验。
 * @constructor
 * 创建一个新的NumberField对象
 * @param {Object} config 配置选项
 */
Ext.form.NumberField = function(config){
    Ext.form.NumberField.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.NumberField, Ext.form.TextField,  {
   /**
     * @cfg {String} fieldClass 设置该域的CSS，默认为x-form-field x-form-num-field
     */
    fieldClass: "x-form-field x-form-num-field",
    /**
     * @cfg {Boolean} allowDecimals 值为 False时将不接受十进制值 (默认为true)
     */
    allowDecimals : true,
    /**
     * @cfg {String} decimalSeparator 设置十进制数分割符(默认为 '.')（？？指的大概是小数点）
     */
    decimalSeparator : ".",
    /**
     * @cfg {Number} decimalPrecision 设置小数点后最大精确位数(默认为 2)
     */
    decimalPrecision : 2,
    /**
     * @cfg {Boolean} allowNegative 值为 False时只允许为正数 (默认为 true，即默认允许为负数)
     */
    allowNegative : true,
    /**
     * @cfg {Number} minValue 允许的最小值 (默认为 Number.NEGATIVE_INFINITY)
     */
    minValue : Number.NEGATIVE_INFINITY,
    /**
     * @cfg {Number} maxValue 允许的最大值 (默认为Number.MAX_VALUE)
     */
    maxValue : Number.MAX_VALUE,
    /**
     * @cfg {String} minText 最小值验证失败（ps：超出设置的最小值范围）时显示该错误信息（默认为"The minimum value for this field is {0}"）
	 */
    minText : "The minimum value for this field is {0}",
    /**
     * @cfg {String} maxText  最大值验证失败（ps：超出设置的最大值范围）时显示该错误信息(默认为 "The maximum value for this field is {maxValue}")
	 */
    maxText : "The maximum value for this field is {0}",
    /**
     * @cfg {String} nanText 当值非数字时显示此错误信息。例如，如果仅仅合法字符如'.' 或 '-'而没有其他任何数字出现在该域时，会显示该错误信息。(默认为"{value} is not a valid number")
     */
    nanText : "{0} is not a valid number",

    // private
    initEvents : function(){
        Ext.form.NumberField.superclass.initEvents.call(this);
        var allowed = "0123456789";
        if(this.allowDecimals){
            allowed += this.decimalSeparator;
        }
        if(this.allowNegative){
            allowed += "-";
        }
        this.stripCharsRe = new RegExp('[^'+allowed+']', 'gi');
        var keyPress = function(e){
            var k = e.getKey();
            if(!Ext.isIE && (e.isSpecialKey() || k == e.BACKSPACE || k == e.DELETE)){
                return;
            }
            var c = e.getCharCode();
            if(allowed.indexOf(String.fromCharCode(c)) === -1){
                e.stopEvent();
            }
        };
        this.el.on("keypress", keyPress, this);
    },

    // private
    validateValue : function(value){
        if(!Ext.form.NumberField.superclass.validateValue.call(this, value)){
            return false;
        }
        if(value.length < 1){ // if it's blank and textfield didn't flag it then it's valid
             return true;
        }
        var num = this.parseValue(value);
        if(isNaN(num)){
            this.markInvalid(String.format(this.nanText, value));
            return false;
        }
        if(num < this.minValue){
            this.markInvalid(String.format(this.minText, this.minValue));
            return false;
        }
        if(num > this.maxValue){
            this.markInvalid(String.format(this.maxText, this.maxValue));
            return false;
        }
        return true;
    },

    getValue : function(){
        return this.fixPrecision(this.parseValue(Ext.form.NumberField.superclass.getValue.call(this)));
    },

    // private
    parseValue : function(value){
        value = parseFloat(String(value).replace(this.decimalSeparator, "."));
        return isNaN(value) ? '' : value;
    },

    // private
    fixPrecision : function(value){
        var nan = isNaN(value);
        if(!this.allowDecimals || this.decimalPrecision == -1 || nan || !value){
            return nan ? '' : value;
        }
        return parseFloat(value).toFixed(this.decimalPrecision);
    },

    setValue : function(v){
        Ext.form.NumberField.superclass.setValue.call(this, String(v).replace(".", this.decimalSeparator));
    },

    // private
    decimalPrecisionFcn : function(v){
        return Math.floor(v);
    },

    beforeBlur : function(){
        var v = this.parseValue(this.getRawValue());
        if(v){
            this.setValue(this.fixPrecision(v));
        }
    }
});