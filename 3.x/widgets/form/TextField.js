/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.form.TextField
 * @extends Ext.form.Field
 * 基本的文本字段。可以被当作传统文本转入框的直接代替, 或者当作其他更复杂输入控件的基础类（比如 {@link Ext.form.TextArea} 和 {@link Ext.form.ComboBox}）。<br />
 * Basic text field. Can be used as a direct replacement for traditional text inputs, or as the base
 * class for more sophisticated input controls (like {@link Ext.form.TextArea} and {@link Ext.form.ComboBox}).
 * @constructor 创建一个 TextField 对象 Creates a new TextField
 * @param {Object} config 配置项 Configuration options
 */
Ext.form.TextField = Ext.extend(Ext.form.Field,  {
    /**
     * @cfg {String} vtypeText 
     * 在当前字段的{@link #vtype}中，制定一个错误信息代替默认的（默认为null）。如vtype不设置该项就无效。
     * A custom error message to display in place of the default message provided
     * for the {@link #vtype} currently set for this field (defaults to '').  Only applies if vtype is set, else ignored.
     */
    /**
     * @cfg {RegExp} stripCharsRe
     * 一个JavaScript正则表达式，用于在进行验证该动作之前抽离不需要的内容（默认为null）。
     * A JavaScript RegExp object used to strip unwanted content from the value before validation (defaults to null).
     */
    /**
     * @cfg {Boolean} grow 当值为 true 时表示字段可以根据内容自动伸缩。 
     * True if this field should automatically grow and shrink to its content
     */
    grow : false,
    /**
     * @cfg {Number} growMin 当 grow = true 时允许的字段最小宽度（默认为 30）
     * The minimum width to allow when grow = true (defaults to 30)
     */
    growMin : 30,
    /**
     * @cfg {Number} growMax 当 grow = true 时允许的字段最大宽度(默认为 800) 
     * The maximum width to allow when grow = true (defaults to 800)
     */
    growMax : 800,
    /**
     * @cfg {String} vtype 中定义的效验类型名(默认为 null) 
     * A validation type name as defined in {@link Ext.form.VTypes} (defaults to null)
     */
    vtype : null,
    /**
     * @cfg {RegExp} maskRe 一个用来过滤无效按键的正则表达式(默认为 null) 
     * An input mask regular expression that will be used to filter keystrokes that don't match (defaults to null)
     */
    maskRe : null,
    /**
     * @cfg {Boolean} disableKeyFilter 值为 true 时禁用输入按键过滤(默认为 false) 
     * True to disable input keystroke filtering (defaults to false)
     */
    disableKeyFilter : false,
    /**
     * @cfg {Boolean} allowBlank 值为 false 时将效验输入字符个数大于0(默认为 true) 
     * False to validate that the value length > 0 (defaults to true)
     */
    allowBlank : true,
    /**
     * @cfg {Number} minLength 输入字段所需的最小字符数(默认为 0) 
     * Minimum input field length required (defaults to 0)
     */
    minLength : 0,
    /**
     * @cfg {Number} maxLength 输入字段允许的最大字符数(默认为 Number.MAX_VALUE) 
     * Maximum input field length allowed (defaults to Number.MAX_VALUE)
     */
    maxLength : Number.MAX_VALUE,
    /**
     * @cfg {String} minLengthText 输入字符数小于最小字符数时显示的文本（默认为"The minimum length for this field is {minLength}"）
     * Error text to display if the minimum length validation fails (defaults to "The minimum length for this field is {minLength}")
     */
    minLengthText : "The minimum length for this field is {0}",
    /**
     * @cfg {String} maxLengthText 输入字符数小于最小字符数时显示的文本（默认为"The maximum length for this field is {maxLength}"）
     * Error text to display if the maximum length validation fails (defaults to "The maximum length for this field is {maxLength}")
     */
    maxLengthText : "The maximum length for this field is {0}",
    /**
     * @cfg {Boolean} selectOnFocus 值为 ture 时表示字段获取焦点时自动选择字段既有文本(默认为 false)。
     * True to automatically select any existing field text when the field receives input focus (defaults to false)
     */
    selectOnFocus : false,
    /**
     * @cfg {String} blankText 当允许为空效验失败时显示的错误文本（默认为 "This field is required"）。
     * Error text to display if the allow blank validation fails (defaults to "This field is required")
     */
    blankText : "This field is required",
    /**
     * @cfg {Function} validator 
     * 字段效验时调用的自定义的效验函数(默认为 null)。
     * 如果启用此项，则此函数将在所有基础效验（{@link #allowBlank}、{@link #minLength}、{@link #maxLength}和任意的{@link #vtype}）成功之后被调用，调用函数时传递的参数为该字段的值。且此函数的有效返回应为成功时返回 true，失败时返回错误文本。 
     * A custom validation function to be called during field validation (defaults to null).
     * If specified, this function will be called only after the built-in validations ({@link #allowBlank}, {@link #minLength},
     * {@link #maxLength}) and any configured {@link #vtype} all return true. This function will be passed the current field
     * value and expected to return boolean true if the value is valid or a string error message if invalid.
     */
    validator : null,
    /**
     * @cfg {RegExp} regex 一个用以在效验时使用的 JavaScript 正则表达式对象(默认为 null)。如果启用此项，则此正则表达式将在所有基础效验成功之后被执行，执行此正则表达式时传递的参数为该字段的值。如果效验失败，则根据{@link #regexText}的设置将字段标记为无效。
     * A JavaScript RegExp object to be tested against the field value during validation (defaults to null).
     * If available, this regex will be evaluated only after the basic validators all return true, and will be passed the
     * current field value.  If the test fails, the field will be marked invalid using {@link #regexText}.
     */
    regex : null,
    /**
     * @cfg {String} regexText 当{@link #regex}被设置且效验失败时显示的错误文本(默认为 "")。 
     * The error text to display if {@link #regex} is used and the test fails during validation (defaults to "")
     */
    regexText : "",
    /**
     * @cfg {String} emptyText 空字段中显示的文本(默认为 null)。注意，只要这个字段是被激活的而且name属性是有被指定的，那么也会发送到服务端。
     * The default text to place into an empty field (defaults to null). Note that this
     * value will be submitted to the server if this field is enabled and configured with a {@link #name}.
     */
    emptyText : null,
    /**
     * @cfg {String} emptyClass {@link #emptyText}使用的CSS样式类名(默认为 'x-form-empty-field')。此类的添加与移除均由当前字段是否有值来自动处理。
     * The CSS class to apply to an empty field to style the {@link #emptyText} (defaults to
     * 'x-form-empty-field').  This class is automatically added and removed as needed depending on the current field value.
     */
    emptyClass : 'x-form-empty-field',

    /**
     * @cfg {Boolean} enableKeyEvents True表示，为HTML的input输入字段激活键盘事件的代理（默认为false） 
     * True to enable the proxying of key events for the HTML input field (defaults to false)
     */

    initComponent : function(){
        Ext.form.TextField.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event autosize
             * 当autosize函数调用时触发。根据缺省的逻辑，字段有可能不会真正地改变大小，但该事件的目的在于，允许开发人员在运行时加入额外的逻辑，以备调整输入字段的大小。
             * Fires when the autosize function is triggered.  The field may or may not have actually changed size
             * according to the default logic, but this event provides a hook for the developer to apply additional
             * logic at runtime to resize the field if needed.
             * @param {Ext.form.Field} this 文本输入字段。This text field
             * @param {Number} width 新宽度。The new field width
             */
            'autosize',

            /**
             * @event keydown
             * 输入字段键盘下降时的事件。该事件只会在enableKeyEvents为true时有效。 
             * Keydown input field event. This event only fires if enableKeyEvents is set to true.
             * @param {Ext.form.TextField} this 文本输入字段。This text field
             * @param {Ext.EventObject} e
             */
            'keydown',
            /**
             * @event keyup
             * 输入字段键盘升起时的事件。该事件只会在enableKeyEvents为true时有效。 
             * Keyup input field event. This event only fires if enableKeyEvents is set to true.
             * @param {Ext.form.TextField} this 文本输入字段。This text field
             * @param {Ext.EventObject} e
             */
            'keyup',
            /**
             * @event keypress
             * 输入字段键盘按下时的事件。该事件只会在enableKeyEvents为true时有效。 
             * Keypress input field event. This event only fires if enableKeyEvents is set to true.
             * @param {Ext.form.TextField} this 文本输入字段。This text field
             * @param {Ext.EventObject} e
             */
            'keypress'
        );
    },

    // private
    initEvents : function(){
        Ext.form.TextField.superclass.initEvents.call(this);
        if(this.validationEvent == 'keyup'){
            this.validationTask = new Ext.util.DelayedTask(this.validate, this);
            this.mon(this.el, 'keyup', this.filterValidation, this);
        }
        else if(this.validationEvent !== false){
        	this.mon(this.el, this.validationEvent, this.validate, this, {buffer: this.validationDelay});
        }
        if(this.selectOnFocus || this.emptyText){
            this.on("focus", this.preFocus, this);
            
            this.mon(this.el, 'mousedown', function(){
                if(!this.hasFocus){
                    this.el.on('mouseup', function(e){
                        e.preventDefault();
                    }, this, {single:true});
                }
            }, this);
            
            if(this.emptyText){
                this.on('blur', this.postBlur, this);
                this.applyEmptyText();
            }
        }
        if(this.maskRe || (this.vtype && this.disableKeyFilter !== true && (this.maskRe = Ext.form.VTypes[this.vtype+'Mask']))){
        	this.mon(this.el, 'keypress', this.filterKeys, this);
        }
        if(this.grow){
        	this.mon(this.el, 'keyup', this.onKeyUpBuffered, this, {buffer: 50});
			this.mon(this.el, 'click', this.autoSize, this);
        }
        if(this.enableKeyEvents){
        	this.mon(this.el, 'keyup', this.onKeyUp, this);
        	this.mon(this.el, 'keydown', this.onKeyDown, this);
        	this.mon(this.el, 'keypress', this.onKeyPress, this);
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
    
    //private
    onDisable: function(){
        Ext.form.TextField.superclass.onDisable.call(this);
        if(Ext.isIE){
            this.el.dom.unselectable = 'on';
        }
    },
    
    //private
    onEnable: function(){
        Ext.form.TextField.superclass.onEnable.call(this);
        if(Ext.isIE){
            this.el.dom.unselectable = '';
        }
    },

    // private
    onKeyUpBuffered : function(e){
        if(!e.isNavKeyPress()){
            this.autoSize();
        }
    },

    // private
    onKeyUp : function(e){
        this.fireEvent('keyup', this, e);
    },

    // private
    onKeyDown : function(e){
        this.fireEvent('keydown', this, e);
    },

    // private
    onKeyPress : function(e){
        this.fireEvent('keypress', this, e);
    },

    /**
     * 将字段值重置为原始值，并清除所有效验信息。如果原始值为空时还将使 emptyText 和 emptyClass 属性生效。
     * Resets the current field value to the originally-loaded value and clears any validation messages.
     * Also adds emptyText and emptyClass if the original value was blank.
     */
    reset : function(){
        Ext.form.TextField.superclass.reset.call(this);
        this.applyEmptyText();
    },

    applyEmptyText : function(){
        if(this.rendered && this.emptyText && this.getRawValue().length < 1 && !this.hasFocus){
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
        if(e.ctrlKey){
            return;
        }
        var k = e.getKey();
        if(Ext.isGecko && (e.isNavKeyPress() || k == e.BACKSPACE || (k == e.DELETE && e.button == -1))){
            return;
        }
        var c = e.getCharCode(), cc = String.fromCharCode(c);
        if(!Ext.isGecko && e.isSpecialKey() && !cc){
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
     * 根据字段的效验规则效验字段值，并在效验失败时将字段标记为无效。 
     * Validates a value according to the field's validation rules and marks the field as invalid
     * if the validation fails
     * @param {Mixed} value 要效验的值 The value to validate
     * @return {Boolean} 值有效时返回true，否则返回 false True if the value is valid, else false
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
     * 选择此字段中的文本。
     * Selects text in this field
     * @param {Number} start （可选项） 选择区域的索引起点(默认为 0) (optional)The index where the selection should start (defaults to 0)
     * @param {Number} end （可选项） 选择区域的索引终点(默认为文本长度) (optional)The index where the selection should end (defaults to the text length)
     */
    selectText : function(start, end){
        var v = this.getRawValue();
        var doFocus = false;
        if(v.length > 0){
            start = start === undefined ? 0 : start;
            end = end === undefined ? v.length : end;
            var d = this.el.dom;
            if(d.setSelectionRange){
                d.setSelectionRange(start, end);
            }else if(d.createTextRange){
                var range = d.createTextRange();
                range.moveStart("character", start);
                range.moveEnd("character", end-v.length);
                range.select();
            }
            doFocus = Ext.isGecko || Ext.isOpera;
        }else{
            doFocus = true;
        }
        if(doFocus){
            this.focus();
        }
    },

    /**
     * 自动增长字段宽度以便容纳字段所允许的最大文本。仅在 grow = true 时有效，并触发{@link #autosize}事件。 
     * Automatically grows the field to accomodate the width of the text up to the maximum field width allowed.
     * This only takes effect if grow = true, and fires the {@link #autosize} event.
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
        Ext.removeNode(d);
        v += "&#160;";
        var w = Math.min(this.growMax, Math.max(this.metrics.getWidth(v) + /* add extra padding */ 10, this.growMin));
        this.el.setWidth(w);
        this.fireEvent("autosize", this, w);
    }
});
Ext.reg('textfield', Ext.form.TextField);
