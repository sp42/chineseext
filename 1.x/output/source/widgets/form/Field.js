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
 * @class Ext.form.Field
 * @extends Ext.BoxComponent
 * Base class for form fields that provides default event handling, sizing, value handling and other functionality.
 * 表单元素的基类，提供事件操作、尺寸调整、值操作与其它功能。
 * @constructor
 * Creates a new Field
 * 创建一个新的字段
 * @param {Object} config Configuration options
 *					配制选项
 */
Ext.form.Field = function(config){
    Ext.form.Field.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.Field, Ext.BoxComponent,  {
    /**
     * @cfg {String} invalidClass The CSS class to use when marking a field invalid (defaults to "x-form-invalid")
     * 表单元素无效时标在上面的CSS样式（默认为"x-form-invalid"）
     */
    invalidClass : "x-form-invalid",
    /**
     * @cfg {String} invalidText The error text to use when marking a field invalid and no message is provided (defaults to "The value in this field is invalid")
     * 表单元素无效时标在上面的文本信息（默认为"The value in this field is invalid"）
     */
    invalidText : "The value in this field is invalid",
    /**
     * @cfg {String} focusClass The CSS class to use when the field receives focus (defaults to "x-form-focus")
     * 当表单元素获取焦点时的CSS样式（默认为"x-form-focus"）
     */
    focusClass : "x-form-focus",
    /**
     * @cfg {String/Boolean} validationEvent The event that should initiate field validation. Set to false to disable
      automatic validation (defaults to "keyup").
     * 初始化元素验证的事件名，如果设假，则不进行验证（默认"keyup"）
     */
    validationEvent : "keyup",
    /**
     * @cfg {Boolean} validateOnBlur Whether the field should validate when it loses focus (defaults to true).
     * 是否当失去焦点时验证此表单元素（默认真）。
     */
    validateOnBlur : true,
    /**
     * @cfg {Number} validationDelay The length of time in milliseconds after user input begins until validation is initiated (defaults to 250)
     * 用户输入开始到验证开始的间隔毫秒数（默认250毫秒）
     */
    validationDelay : 250,
    /**
     * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "text", size: "20", autocomplete: "off"})
     * 一个指定的DomHelper对象，如果为真则为一个默认对象（默认 {tag: "input", type: "text", size: "20", autocomplete: "off"}）
     */
    defaultAutoCreate : {tag: "input", type: "text", size: "20", autocomplete: "off"},
    /**
     * @cfg {String} fieldClass The default CSS class for the field (defaults to "x-form-field")
     * 表单元素一般状态CSS样式（默认为"x-form-field"）
     */
    fieldClass : "x-form-field",
    /**
     * @cfg {String} msgTarget The location where error text should display.  Should be one of the following values (defaults to 'qtip'):
     * 错误提示的显示位置。 可以是以下列表中的任意一项（默认为"qtip"）
     *<pre>
Value         Description
-----------   ----------------------------------------------------------------------
qtip          Display a quick tip when the user hovers over the field	当鼠标旋停在表单元素上时显示。
title         Display a default browser title attribute popup			显示浏览器默认"popup"提示。
under         Add a block div beneath the field containing the error text 创建一个包函错误信息的"div"对象（块显示方式）在表单元素下面。	
side          Add an error icon to the right of the field with a popup on hover 在表单元素右侧加错误图标，鼠标旋停上面时显示错误信息。
[element id]  Add the error text directly to the innerHTML of the specified element 直接在指定的对象的"innerHTML"属性里添加错误信息。 
</pre>
     */
    msgTarget : 'qtip',
    /**
     * @cfg {String} msgFx <b>Experimental</b> The effect used when displaying a validation message under the field (defaults to 'normal').
     * 表单元素无效提示显示的动画效果（默认为"normal"）
     */
    msgFx : 'normal',

    /**
     * @cfg {Boolean} readOnly True to mark the field as readOnly in HTML (defaults to false) -- Note: this only sets the element's readOnly DOM attribute.
     * 如果为真，则在HTML时标明此表单元素为只读 -- 注意：只是设置表单对象的只读属性。
     */
    readOnly : false,

    /**
     * @cfg {Boolean} disabled True to disable the field (defaults to false).
     * 为真则标明此表单元素为不可用（默认为假）
     */
    disabled : false,

    /**
     * @cfg {String} inputType The type attribute for input fields -- e.g. radio, text, password (defaults to "text").
     * "input"类表单元素的类型属性  -- 例如：radio,text,password （默认为"text"）
     */
    inputType : undefined,
    
    /**
     * @cfg {Number} tabIndex The tabIndex for this field. Note this only applies to fields that are rendered, not those which are built via applyTo (defaults to undefined).
     * 这个表单元素的"tabIndex"（Tab键索引数）。只适用于被渲染的表单元素，并不是通过用"applyTo"方法建立的对象（默认为未定义）
	 */
	tabIndex : undefined,
	
    // private
    isFormField : true,

    // private
    hasFocus : false,

    /**
     * @cfg {Mixed} value A value to initialize this field with.
     * 表单元素初始化值。
     */
    value : undefined,

    /**
     * @cfg {String} name The field's HTML name attribute.
     * 在表单元素的HTML名称属性。
     */
    /**
     * @cfg {String} cls A CSS class to apply to the field's underlying element.
     * 一个应用于表单元素上的CSS样式。
     */

	// private ??
	initComponent : function(){
        Ext.form.Field.superclass.initComponent.call(this);
        this.addEvents({
            /**
             * @event focus
             * Fires when this field receives input focus.
             * 当此元素获取焦点时激发此事件。
             * @param {Ext.form.Field} this
             */
            focus : true,
            /**
             * @event blur
             * Fires when this field loses input focus.
             * 当此元素推动焦点时激发此事件。
             * @param {Ext.form.Field} this
             */
            blur : true,
            /**
             * @event specialkey
             * Fires when any key related to navigation (arrows, tab, enter, esc, etc.) is pressed.  You can check
             * {@link Ext.EventObject#getKey} to determine which key was pressed.
             * 任何一个关于导航类键（arrows,tab,enter,esc等）被敲击则触发此事件。你可以查看{@link Ext.EventObject#getKey}去断定哪个键被敲击。
             * @param {Ext.form.Field} this
             * @param {Ext.EventObject} e The event object
             */
            specialkey : true,
            /**
             * @event change
             * Fires just before the field blurs if the field value has changed.
             * 当元素失去焦点时，如果值被修改则触发此事件。
             * @param {Ext.form.Field} this
             * @param {Mixed} newValue The new value	新值
             * @param {Mixed} oldValue The original value	原始值
             */
            change : true,
            /**
             * @event invalid
             * Fires after the field has been marked as invalid.
             * 当此元素被标为无效后触发此事件。
             * @param {Ext.form.Field} this
             * @param {String} msg The validation message
             */
            invalid : true,
            /**
             * @event valid
             * Fires after the field has been validated with no errors.
             * 在此元素被验证有效后触发此事件。
             * @param {Ext.form.Field} this
             */
            valid : true
        });
    },

    /**
     * Returns the name attribute of the field if available
     * 试图获取元素的名称。
     * @return {String} name The field name
     */
    getName: function(){
         return this.rendered && this.el.dom.name ? this.el.dom.name : (this.hiddenName || '');
    },

    // private
    onRender : function(ct, position){
        Ext.form.Field.superclass.onRender.call(this, ct, position);
        if(!this.el){
            var cfg = this.getAutoCreate();
            if(!cfg.name){
                cfg.name = this.name || this.id;
            }
            if(this.inputType){
                cfg.type = this.inputType;
            }
            this.el = ct.createChild(cfg, position);
        }
        var type = this.el.dom.type;
        if(type){
            if(type == 'password'){
                type = 'text';
            }
            this.el.addClass('x-form-'+type);
        }
        if(this.readOnly){
            this.el.dom.readOnly = true;
        }
        if(this.tabIndex !== undefined){
            this.el.dom.setAttribute('tabIndex', this.tabIndex);
        }

        this.el.addClass([this.fieldClass, this.cls]);
        this.initValue();
    },

    /**
     * Apply the behaviors of this component to an existing element. <b>This is used instead of render().</b>
     * 把组件应用到一个现有的对象上。这个被用来代替render()方法。
     * @param {String/HTMLElement/Element} el The id of the node, a DOM node or an existing Element
     * 节点对象的ID、DOM节点或一个现有对象。
     * @return {Ext.form.Field} this
     */
    applyTo : function(target){
        this.allowDomMove = false;
        this.el = Ext.get(target);
        this.render(this.el.dom.parentNode);
        return this;
    },

    // private
    initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value);
        }else if(this.el.dom.value.length > 0){
            this.setValue(this.el.dom.value);
        }
    },

    /**
     * Returns true if this field has been changed since it was originally loaded and is not disabled.
     * 它的原始值没有变更，并且它是可用的则返回真。
     */
    isDirty : function() {
        if(this.disabled) {
            return false;
        }
        return String(this.getValue()) !== String(this.originalValue);
    },

    // private
    afterRender : function(){
        Ext.form.Field.superclass.afterRender.call(this);
        this.initEvents();
    },

    // private
    fireKey : function(e){
        if(e.isNavKeyPress()){
            this.fireEvent("specialkey", this, e);
        }
    },

    /**
     * Resets the current field value to the originally loaded value and clears any validation messages
     * 重置此元素的值到原始值，并且清除所有无效提示信息。
     */
    reset : function(){
        this.setValue(this.originalValue);
        this.clearInvalid();
    },

    // private
    initEvents : function(){
        this.el.on(Ext.isIE ? "keydown" : "keypress", this.fireKey,  this);
        this.el.on("focus", this.onFocus,  this);
        this.el.on("blur", this.onBlur,  this);

        // reference to original value for reset
        this.originalValue = this.getValue();
    },

    // private
    onFocus : function(){
        if(!Ext.isOpera && this.focusClass){ // don't touch in Opera
            this.el.addClass(this.focusClass);
        }
        if(!this.hasFocus){
            this.hasFocus = true;
            this.startValue = this.getValue();
            this.fireEvent("focus", this);
        }
    },

    beforeBlur : Ext.emptyFn,

    // private
    onBlur : function(){
        this.beforeBlur();
        if(!Ext.isOpera && this.focusClass){ // don't touch in Opera
            this.el.removeClass(this.focusClass);
        }
        this.hasFocus = false;
        if(this.validationEvent !== false && this.validateOnBlur && this.validationEvent != "blur"){
            this.validate();
        }
        var v = this.getValue();
        if(String(v) !== String(this.startValue)){
            this.fireEvent('change', this, v, this.startValue);
        }
        this.fireEvent("blur", this);
    },

    /**
     * Returns whether or not the field value is currently valid
     * 此元素是否有效。
     * @param {Boolean} preventMark True to disable marking the field invalid
     * 为真则不去标志此对象任何无效信息。
     * @return {Boolean} True if the value is valid, else false
     * 有效过则返回真，否则返回假。
     */
    isValid : function(preventMark){
        if(this.disabled){
            return true;
        }
        var restore = this.preventMark;
        this.preventMark = preventMark === true;
        var v = this.validateValue(this.processValue(this.getRawValue()));
        this.preventMark = restore;
        return v;
    },

    /**
     * 验证域的值
     * @return {Boolean} True表示为值有效，否则为false
     */
    validate : function(){
        if(this.disabled || this.validateValue(this.processValue(this.getRawValue()))){
            this.clearInvalid();
            return true;
        }
        return false;
    },

    processValue : function(value){
        return value;
    },

    // private
    // Subclasses should provide the validation implementation by overriding this
    // 
    validateValue : function(value){
        return true;
    },

    /**
     * 让该域无效
     * @param {String} msg 验证的信息
     */
    markInvalid : function(msg){
        if(!this.rendered || this.preventMark){ // 未渲染的
            return;
        }
        this.el.addClass(this.invalidClass);
        msg = msg || this.invalidText;
        switch(this.msgTarget){
            case 'qtip':
                this.el.dom.qtip = msg;
                this.el.dom.qclass = 'x-form-invalid-tip';
                if(Ext.QuickTips){ // 修改拖放时的 editors浮动问题
                    Ext.QuickTips.enable();
                }
                break;
            case 'title':
                this.el.dom.title = msg;
                break;
            case 'under':
                if(!this.errorEl){
                    var elp = this.el.findParent('.x-form-element', 5, true);
                    this.errorEl = elp.createChild({cls:'x-form-invalid-msg'});
                    this.errorEl.setWidth(elp.getWidth(true)-20);
                }
                this.errorEl.update(msg);
                Ext.form.Field.msgFx[this.msgFx].show(this.errorEl, this);
                break;
            case 'side':
                if(!this.errorIcon){
                    var elp = this.el.findParent('.x-form-element', 5, true);
                    this.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});
                }
                this.alignErrorIcon();
                this.errorIcon.dom.qtip = msg;
                this.errorIcon.dom.qclass = 'x-form-invalid-tip';
                this.errorIcon.show();
                this.on('resize', this.alignErrorIcon, this);
                break;
            default:
                var t = Ext.getDom(this.msgTarget);
                t.innerHTML = msg;
                t.style.display = this.msgDisplay;
                break;
        }
        this.fireEvent('invalid', this, msg);
    },

    // private
    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.el, 'tl-tr', [2, 0]);
    },

    /**
     * Clear any invalid styles/messages for this field
     * 清除元素任何无效标志样式与信息。
     */
    clearInvalid : function(){
        if(!this.rendered || this.preventMark){ // 未渲染的
            return;
        }
        this.el.removeClass(this.invalidClass);
        switch(this.msgTarget){
            case 'qtip':
                this.el.dom.qtip = '';
                break;
            case 'title':
                this.el.dom.title = '';
                break;
            case 'under':
                if(this.errorEl){
                    Ext.form.Field.msgFx[this.msgFx].hide(this.errorEl, this);
                }
                break;
            case 'side':
                if(this.errorIcon){
                    this.errorIcon.dom.qtip = '';
                    this.errorIcon.hide();
                    this.un('resize', this.alignErrorIcon, this);
                }
                break;
            default:
                var t = Ext.getDom(this.msgTarget);
                t.innerHTML = '';
                t.style.display = 'none';
                break;
        }
        this.fireEvent('valid', this);
    },

    /**
     * Returns the raw data value which may or may not be a valid, defined value.  To return a normalized value see {@link #getValue}.
     * 返回可能无效的原始值。
     * @return {Mixed} value The field value
     */
    getRawValue : function(){
        var v = this.el.getValue();
        if(v === this.emptyText){
            v = '';
        }
        return v;
    },

    /**
     * Returns the normalized data value (undefined or emptyText will be returned as '').  To return the raw value see {@link #getRawValue}.
     * 返回格式化后的数据（未定义或空值则会返回''）。返回原始值可以查看{@link #getRawValue}。
     * @return {Mixed} value The field value
     */
    getValue : function(){
        var v = this.el.getValue();
        if(v === this.emptyText || v === undefined){
            v = '';
        }
        return v;
    },

    /**
     * Sets the underlying DOM field's value directly, bypassing validation.  To set the value with validation see {@link #setValue}.
     * 跃过验证直接设置DOM元素值。需要验证的设值方法可以查看{@link #setValue}。
     * @param {Mixed} value The value to set
     */
    setRawValue : function(v){
        return this.el.dom.value = (v === null || v === undefined ? '' : v);
    },

    /**
     * Sets a data value into the field and validates it.  To set the value directly without validation see {@link #setRawValue}.
     * 设置元素值并加以验证。如果想跃过验证直接设值则请看{@link #setRawValue}。
     * @param {Mixed} value The value to set
     */
    setValue : function(v){
        this.value = v;
        if(this.rendered){
            this.el.dom.value = (v === null || v === undefined ? '' : v);
            this.validate();
        }
    },

    adjustSize : function(w, h){
        var s = Ext.form.Field.superclass.adjustSize.call(this, w, h);
        s.width = this.adjustWidth(this.el.dom.tagName, s.width);
        return s;
    },

    adjustWidth : function(tag, w){
        tag = tag.toLowerCase();
        if(typeof w == 'number' && Ext.isStrict && !Ext.isSafari){
            if(Ext.isIE && (tag == 'input' || tag == 'textarea')){
                if(tag == 'input'){
                    return w + 2;
                }
                if(tag = 'textarea'){
                    return w-2;
                }
            }else if(Ext.isOpera){
                if(tag == 'input'){
                    return w + 2;
                }
                if(tag = 'textarea'){
                    return w-2;
                }
            }
        }
        return w;
    }
});


// anything other than normal should be considered experimental
Ext.form.Field.msgFx = {
    normal : {
        show: function(msgEl, f){
            msgEl.setDisplayed('block');
        },

        hide : function(msgEl, f){
            msgEl.setDisplayed(false).update('');
        }
    },

    slide : {
        show: function(msgEl, f){
            msgEl.slideIn('t', {stopFx:true});
        },

        hide : function(msgEl, f){
            msgEl.slideOut('t', {stopFx:true,useDisplay:true});
        }
    },

    slideRight : {
        show: function(msgEl, f){
            msgEl.fixDisplay();
            msgEl.alignTo(f.el, 'tl-tr');
            msgEl.slideIn('l', {stopFx:true});
        },

        hide : function(msgEl, f){
            msgEl.slideOut('l', {stopFx:true,useDisplay:true});
        }
    }
};