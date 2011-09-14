/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */


/**
 * @class Ext.form.TextField
 * @extends Ext.form.Field
 * Basic text field.  Can be used as a direct replacement for traditional text inputs, or as the base
 * class for more sophisticated input controls (like {@link Ext.form.TextArea} and {@link Ext.form.ComboBox}).
 * 基本的文本字段。可以被当作传统文本转入框的直接代替, 或者当作其他更复杂输入控件的基础类(比如 {@link Ext.form.TextArea} 和 {@link Ext.form.ComboBox})。
 * @constructor
 * 创建一个 TextField 对象
 * @param {Object} config 配置项
 */
Ext.form.TextField = function(config){
    Ext.form.TextField.superclass.constructor.call(this, config);
    this.addEvents({
        /**
         * @event autosize
         * Fires when the autosize function is triggered.  The field may or may not have actually changed size
         * according to the default logic, but this event provides a hook for the developer to apply additional
         * logic at runtime to resize the field if needed.
         * 当 autosize 函数被调用时触发。根据默认逻辑字段可能被改变或者没有改变大小, 此事件为开发者提供了一个远行时的附加逻辑用以改变字段的大小。
	     * @param {Ext.form.Field} this 文本字段本身
	     * @param {Number} width 新的字段宽度
	     */
        autosize : true
    });
};

Ext.extend(Ext.form.TextField, Ext.form.Field,  {
    /**
     * @cfg {Boolean} grow 当值为 true 时表示字段可以根据内容自动伸缩
     */
    grow : false,
    /**
     * @cfg {Number} growMin 当 grow = true 时允许的字段最小宽度(默认为 30)
     */
    growMin : 30,
    /**
     * @cfg {Number} growMax 当 grow = true 时允许的字段最大宽度(默认为 800)
     */
    growMax : 800,
    /**
     * @cfg {String} vtype {@link Ext.form.VTypes} 中定义的效验类型名(默认为 null)
     */
    vtype : null,
    /**
     * @cfg {String} maskRe 一个用来过滤无效按键的正则表达式(默认为 null)
     */
    maskRe : null,
    /**
     * @cfg {Boolean} disableKeyFilter 值为 true 时禁用输入按键过滤(默认为 false)
     */
    disableKeyFilter : false,
    /**
     * @cfg {Boolean} allowBlank 值为 false 时将效验输入字符个数大于0(默认为 true)
     */
    allowBlank : true,
    /**
     * @cfg {Number} minLength 输入字段所需的最小字符数(默认为 0)
     */
    minLength : 0,
    /**
     * @cfg {Number} maxLength 输入字段允许的最大字符数(默认为 Number.MAX_VALUE)
     */
    maxLength : Number.MAX_VALUE,
    /**
     * @cfg {String} minLengthText 输入字符数小于最小字符数时显示的文本(默认为 "The minimum length for this field is {minLength}")
     */
    minLengthText : "The minimum length for this field is {0}",
    /**
     * @cfg {String} maxLengthText 输入字符数小于最小字符数时显示的文本(默认为 "The maximum length for this field is {maxLength}")
     */
    maxLengthText : "The maximum length for this field is {0}",
    /**
     * @cfg {Boolean} selectOnFocus 值为 ture 时表示字段获取焦点时自动选择字段既有文本(默认为 false)
     */
    selectOnFocus : false,
    /**
     * @cfg {String} blankText 当允许为空效验失败时显示的错误文本(默认为 "This field is required")
     */
    blankText : "This field is required",
    /**
     * @cfg {Function} validator 字段效验时调用的自定义的效验函数(默认为 null)。如果启用此项, 则此函数将在所有基础效验成功之后被调用, 调用函数时传递的参数为该字段的值。且此函数的有效返回应为成功时返回 true, 失败时返回错误文本。
     */
    validator : null,
    /**
     * @cfg {RegExp} regex 一个用以在效验时使用的 JavaScript 正则表达式对象(默认为 null)。如果启用此项, 则此正则表达式将在所有基础效验成功之后被执行, 执行此正则表达式时传递的参数为该字段的值。如果效验失败, 则根据 {@link #regexText} 的设置将字段标记为无效。
     */
    regex : null,
    /**
     * @cfg {String} regexText 当 {@link #regex} 被设置且效验失败时显示的错误文本(默认为 "")
     */
    regexText : "",
    /**
     * @cfg {String} emptyText 空字段中显示的文本(默认为 null)。
     */
    emptyText : null,
    /**
     * @cfg {String} emptyClass {@link #emptyText} 使用的CSS样式类名(默认为 'x-form-empty-field')。此类的添加与移除均由当前字段是否有值来自动处理。
     */
    emptyClass : 'x-form-empty-field',

    // private
    initEvents : function(){
        Ext.form.TextField.superclass.initEvents.call(this);
        if(this.validationEvent == 'keyup'){
            this.validationTask = new Ext.util.DelayedTask(this.validate, this);
            this.el.on('keyup', this.filterValidation, this);
        }
        else if(this.validationEvent !== false){
            this.el.on(this.validationEvent, this.validate, this, {buffer: this.validationDelay});
        }
        if(this.selectOnFocus || this.emptyText){
            this.on("focus", this.preFocus, this);
            if(this.emptyText){
                this.on('blur', this.postBlur, this);
                this.applyEmptyText();
            }
        }
        if(this.maskRe || (this.vtype && this.disableKeyFilter !== true && (this.maskRe = Ext.form.VTypes[this.vtype+'Mask']))){
            this.el.on("keypress", this.filterKeys, this);
        }
        if(this.grow){
            this.el.on("keyup", this.onKeyUp,  this, {buffer:50});
            this.el.on("click", this.autoSize,  this);
        }
    },

    processValue : function(value){
        if(this.stripCharsRe){
            var newValue = value.replace(this.stripCharsRe, '');
            if(newValue !== value){
                this.setRawValue(newValue);
                return newValue;
            }
        }
        return value;
    },

    filterValidation : function(e){
        if(!e.isNavKeyPress()){
            this.validationTask.delay(this.validationDelay);
        }
    },

    // private
    onKeyUp : function(e){
        if(!e.isNavKeyPress()){
            this.autoSize();
        }
    },

    /**
     * Resets the current field value to the originally-loaded value and clears any validation messages.
     * Also adds emptyText and emptyClass if the original value was blank.
     * 将字段值重置为原始值, 并清除所有效验信息。如果原始值为空时还将使 emptyText 和 emptyClass 属性生效。
     */
    reset : function(){
        Ext.form.TextField.superclass.reset.call(this);
        this.applyEmptyText();
    },

    applyEmptyText : function(){
        if(this.rendered && this.emptyText && this.getRawValue().length < 1){
            this.setRawValue(this.emptyText);
            this.el.addClass(this.emptyClass);
        }
    },

    // private
    preFocus : function(){
        if(this.emptyText){
            if(this.el.dom.value == this.emptyText){
                this.setRawValue('');
            }
            this.el.removeClass(this.emptyClass);
        }
        if(this.selectOnFocus){
            this.el.dom.select();
        }
    },

    // private
    postBlur : function(){
        this.applyEmptyText();
    },

    // private
    filterKeys : function(e){
        var k = e.getKey();
        if(!Ext.isIE && (e.isNavKeyPress() || k == e.BACKSPACE || (k == e.DELETE && e.button == -1))){
            return;
        }
        var c = e.getCharCode(), cc = String.fromCharCode(c);
        if(Ext.isIE && (e.isSpecialKey() || !cc)){
            return;
        }
        if(!this.maskRe.test(cc)){
            e.stopEvent();
        }
    },

    setValue : function(v){
        if(this.emptyText && this.el && v !== undefined && v !== null && v !== ''){
            this.el.removeClass(this.emptyClass);
        }
        Ext.form.TextField.superclass.setValue.apply(this, arguments);
        this.applyEmptyText();
        this.autoSize();
    },

    /**
     * Validates a value according to the field's validation rules and marks the field as invalid
     * if the validation fails
     * 根据字段的效验规则效验字段值, 并在效验失败时将字段标记为无效
     * @param {Mixed} value 要效验的值
     * @return {Boolean} 值有效时返回 true, 否则返回 false
     */
    validateValue : function(value){
        if(value.length < 1 || value === this.emptyText){ // if it's blank
             if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else{
                 this.markInvalid(this.blankText);
                 return false;
             }
        }
        if(value.length < this.minLength){
            this.markInvalid(String.format(this.minLengthText, this.minLength));
            return false;
        }
        if(value.length > this.maxLength){
            this.markInvalid(String.format(this.maxLengthText, this.maxLength));
            return false;
        }
        if(this.vtype){
            var vt = Ext.form.VTypes;
            if(!vt[this.vtype](value, this)){
                this.markInvalid(this.vtypeText || vt[this.vtype +'Text']);
                return false;
            }
        }
        if(typeof this.validator == "function"){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        if(this.regex && !this.regex.test(value)){
            this.markInvalid(this.regexText);
            return false;
        }
        return true;
    },

    /**
     * 选择此字段中的文本
     * @param {Number} start (可选项) 选择区域的索引起点(默认为 0)
     * @param {Number} end (可选项) 选择区域的索引终点(默认为文本长度)
     */
    selectText : function(start, end){
        var v = this.getRawValue();
        if(v.length > 0){
            start = start === undefined ? 0 : start;
            end = end === undefined ? v.length : end;
            var d = this.el.dom;
            if(d.setSelectionRange){
                d.setSelectionRange(start, end);
            }else if(d.createTextRange){
                var range = d.createTextRange();
                range.moveStart("character", start);
                range.moveEnd("character", v.length-end);
                range.select();
            }
        }
    },

    /**
     * Automatically grows the field to accomodate the width of the text up to the maximum field width allowed.
     * This only takes effect if grow = true, and fires the autosize event.
     * 自动增长字段宽度以便容纳字段所允许的最大文本。仅在 grow = true 时有效, 并触发 autosize 事件。
     */
    autoSize : function(){
        if(!this.grow || !this.rendered){
            return;
        }
        if(!this.metrics){
            this.metrics = Ext.util.TextMetrics.createInstance(this.el);
        }
        var el = this.el;
        var v = el.dom.value;
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(v));
        v = d.innerHTML;
        d = null;
        v += "&#160;";
        var w = Math.min(this.growMax, Math.max(this.metrics.getWidth(v) + /* add extra padding */ 10, this.growMin));
        this.el.setWidth(w);
        this.fireEvent("autosize", this, w);
    }
});