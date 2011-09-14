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
 * @class Ext.form.Field
 * @extends Ext.BoxComponent
 * 表单元素的基类，提供事件操作、尺寸调整、值操作与其它功能。<br />
 * Base class for form fields that provides default event handling, sizing, value handling and other functionality.
 * @constructor 创建一个新的字段 Creates a new Field
 * @param {Object} config 配制选项 Configuration options
 */
Ext.form.Field = Ext.extend(Ext.BoxComponent,  {
    /**
     * @cfg {String} fieldLabel 
     * 显示在该字段旁边的标签文本（label text），默认为''。
     * <p><b>
     * 由于字段的lable不属于字段结构的一部分因此默认下不会渲染。
     * 应该交由{@link Ext.layout.FormLayout 表单布局}的布局管理器之所在{@link Ext.form.Container Container}来控制对字段的添加lable。
     * </b></p>
     * The label text to display next to this field (defaults to '')
     * <p><b>A Field's label is not by default rendered as part of the Field's structure.
     * The label is rendered by the {@link Ext.layout.FormLayout form layout} layout manager
     * of the {@link Ext.form.Container Container} to which the Field is added.</b></p>
     */
    /**
     * @cfg {String}  inputType 
     * input字段的type属性，诸如 radio、text、password、file等的元素都有type属性。
     * 属性是“file”与“怕ssword”就要在这里设置了，因为当前Ext并没有这些单独的组件。
     * 注意当你使用<tt>inputType:'file'</tt>时，{@link #emptyText}就避免使用。
     * The type attribute for input fields -- e.g. radio, text, password, file (defaults
     * to "text"). The types "file" and "password" must be used to render those field types currently -- there are
     * no separate Ext components for those. Note that if you use <tt>inputType:'file'</tt>, {@link #emptyText}
     * is not supported and should be avoided.
     */
    /**
     * @cfg {Number} tabIndex 字段的tabIndex。注意这只对已渲染的元素有效，applyTo的那些无效（默认为undfined）。
     * The tabIndex for this field. Note this only applies to fields that are rendered, not those which are built via applyTo (defaults to undefined).
     */
    /**
     * @cfg {Mixed} value 字段初始化的值（默认为undefined）。
     * A value to initialize this field with (defaults to undefined).
     */
    /**
     * @cfg {String} name 字段的name属性，HTML的name属性（默认为''）。
     * The field's HTML name attribute (defaults to "").
     */
    /**
     * @cfg {String} cls 给字段所属的元素添加上制定的CSS样式。
     * A custom CSS class to apply to the field's underlying element (defaults to "").
     */

    /**
     * @cfg {String} invalidClass 
     * 当出现无效字段所使用上的CSS样式（默认为"x-form-invalid）。
     * The CSS class to use when marking a field invalid (defaults to "x-form-invalid")
     */
    invalidClass : "x-form-invalid",
    /**
     * @cfg {String} invalidText 表单元素无效时标在上面的文本信息（默认为"The value in this field is invalid"）。
     * The error text to use when marking a field invalid and no message is provided (defaults to "The value in this field is invalid")
     */
    invalidText : "The value in this field is invalid",
    /**
     * @cfg {String} focusClass 当表单元素获取焦点时的CSS样式（默认为"x-form-focus"）。
     * The CSS class to use when the field receives focus (defaults to "x-form-focus")
     */
    focusClass : "x-form-focus",
    /**
     * @cfg {String/Boolean} validationEvent 初始化元素验证的事件名，如果设假，则不进行验证（默认"keyup"）。
     * The event that should initiate field validation. Set to false to disable automatic validation (defaults to "keyup").
     */
    validationEvent : "keyup",
    /**
     * @cfg {Boolean} validateOnBlur 是否当失去焦点时验证此表单元素（默认真）。
     * Whether the field should validate when it loses focus (defaults to true).
     */
    validateOnBlur : true,
    /**
     * @cfg {Number} validationDelay 用户输入开始到验证开始的间隔毫秒数（默认250毫秒）。
     * The length of time in milliseconds after user input begins until validation is initiated (defaults to 250)
     */
    validationDelay : 250,
    /**
     * @cfg {String/Object} autoCreate 一个指定的DomHelper配置对象，如果为真则为一个默认对象（{tag: "input", type: "text", size: "20", autocomplete: "off"}）。
     * A DomHelper element spec, or true for a default element spec (defaults to {tag: "input", type: "text", size: "20", autocomplete: "off"})
     */
    defaultAutoCreate : {tag: "input", type: "text", size: "20", autocomplete: "off"},
    /**
     * @cfg {String} fieldClass 表单元素一般状态CSS样式（默认为"x-form-field"）。
     * The default CSS class for the field (defaults to "x-form-field")
     */
    fieldClass : "x-form-field",
    /**
     * @cfg {String} msgTarget 错误提示的显示位置。 可以是以下列表中的任意一项（默认为"qtip"）。
     * The location where error text should display. Should be one of the following values
     * (defaults to 'qtip'):
     *<pre>
值Value        说明Description
-----------   ----------------------------------------------------------------------
qtip          当鼠标旋停在表单元素上时显示。 Display a quick tip when the user hovers over the field 
title         显示浏览器默认"popup"提示。 Display a default browser title attribute popup
under         创建一个包函错误信息的"div"对象（块显示方式）在表单元素下面。	Add a block div beneath the field containing the error text
side          在表单元素右侧加错误图标，鼠标旋停上面时显示错误信息。Add an error icon to the right of the field with a popup on hover
[element id]  直接在指定的对象的"innerHTML"属性里添加错误信息。Add the error text directly to the innerHTML of the specified element
</pre>
     */
    msgTarget : 'qtip',
    /**
     * @cfg {String} msgFx <b>Experimental</b> 表单元素无效提示显示的动画效果（默认为"normal"）The effect used when displaying a validation message under the field
     * (defaults to 'normal').
     */
    msgFx : 'normal',
    /**
     * @cfg {Boolean} readOnly 如果为真，则在HTML时标明此表单元素为只读 -- 注意：只是设置表单对象的只读属性。 True to mark the field as readOnly in HTML (defaults to false) -- Note: this only
     * sets the element's readOnly DOM attribute.
     */
    readOnly : false,
    /**
     * @cfg {Boolean} disabled 为真则标明此表单元素为不可用（默认为假）。
     * <p>注意根据<a href="http://www.w3.org/TR/html401/interact/forms.html#h-17.12.1">HTML规范</a>，
     * 禁用的字段不会被{@link Ext.form.BasicForm#submit 提交}。</p>
     * True to disable the field (defaults to false).
     * <p>Be aware that conformant with the <a href="http://www.w3.org/TR/html401/interact/forms.html#h-17.12.1">HTML specification</a>,
     * disabled Fields will not be {@link Ext.form.BasicForm#submit submitted}.</p>
     */
    disabled : false,

    // private
    isFormField : true,

    // private
    hasFocus : false,

	// private
	initComponent : function(){
        Ext.form.Field.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event focus
             * 当此元素获取焦点时激发此事件。
             * Fires when this field receives input focus.
             * @param {Ext.form.Field} this
             */
            'focus',
            /**
             * @event blur
             * 当此元素推动焦点时激发此事件。
             * Fires when this field loses input focus.
             * @param {Ext.form.Field} this
             */
            'blur',
            /**
             * @event specialkey
             * 任何一个关于导航类键（arrows、tab、enter、esc等）被敲击则触发此事件。你可以查看{@link Ext.EventObject#getKey}去断定哪个键被敲击。
             * Fires when any key related to navigation (arrows, tab, enter, esc, etc.) is pressed.  You can check
             * {@link Ext.EventObject#getKey} to determine which key was pressed.
             * @param {Ext.form.Field} this
             * @param {Ext.EventObject} e The event object
             */
            'specialkey',
            /**
             * @event change
             * 当元素失去焦点时，如果值被修改则触发此事件。
             * Fires just before the field blurs if the field value has changed.
             * @param {Ext.form.Field} this
             * @param {Mixed} newValue 新值 The new value
             * @param {Mixed} oldValue 原始值 The original value
             */
            'change',
            /**
             * @event invalid
             * 当此元素被标为无效后触发此事件。
             * Fires after the field has been marked as invalid.
             * @param {Ext.form.Field} this
             * @param {String} msg 验证信息 The validation message
             */
            'invalid',
            /**
             * @event valid
             * 在此元素被验证有效后触发此事件。
             * Fires after the field has been validated with no errors.
             * @param {Ext.form.Field} this
             */
            'valid'
        );
    },

    /**
     * 试图获取元素的名称。
     * Returns the name attribute of the field if available
     * @return {String} name 域名 The field name
     */
    getName: function(){
         return this.rendered && this.el.dom.name ? this.el.dom.name : (this.hiddenName || '');
    },

    // private
    onRender : function(ct, position){
        if(!this.el){
            var cfg = this.getAutoCreate();

            if(!cfg.name){
                cfg.name = this.name || this.id;
            }
            if(this.inputType){
                cfg.type = this.inputType;
            }
            this.autoEl = cfg;
        }
        Ext.form.Field.superclass.onRender.call(this, ct, position);
        
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
    },

    // private
    getItemCt : function(){
        return this.el.up('.x-form-item', 4);
    },

    // private
    initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value);
        }else if(!Ext.isEmpty(this.el.dom.value) && this.el.dom.value != this.emptyText){
            this.setValue(this.el.dom.value);
        }
        // reference to original value for reset
        this.originalValue = this.getValue();
    },

    /**
     * 把组件应用到一个现有的对象上。这个被用来代替render()方法。
     * Returns true if this field has been changed since it was originally loaded and is not disabled.
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
        this.initValue();
    },

    // private
    fireKey : function(e){
        if(e.isSpecialKey()){
            this.fireEvent("specialkey", this, e);
        }
    },

    /**
     * 重置此元素的值到原始值，并且清除所有无效提示信息。
     * Resets the current field value to the originally loaded value and clears any validation messages
     */
    reset : function(){
        this.setValue(this.originalValue);
        this.clearInvalid();
    },

    // private
    initEvents : function(){
    	this.mon(this.el, Ext.isIE || Ext.isSafari3 ? "keydown" : "keypress", this.fireKey,  this);
		this.mon(this.el, 'focus', this.onFocus, this);

        // fix weird FF/Win editor issue when changing OS window focus
        var o = this.inEditor && Ext.isWindows && Ext.isGecko ? {buffer:10} : null;
        this.mon(this.el, 'blur', this.onBlur, this, o);
    },

    // private
    onFocus : function(){
        if(this.focusClass){
            this.el.addClass(this.focusClass);
        }
        if(!this.hasFocus){
            this.hasFocus = true;
            this.startValue = this.getValue();
            this.fireEvent("focus", this);
        }
    },

    // private
    beforeBlur : Ext.emptyFn,

    // private
    onBlur : function(){
        this.beforeBlur();
        if(this.focusClass){
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
     * 它的原始值没有变更，并且它是可用的则返回真。
     * Returns whether or not the field value is currently valid
     * @param {Boolean} preventMark True表示为禁止标记字段无效True to disable marking the field invalid
     * @return {Boolean} True表示为这是有效值，否则为false。True if the value is valid, else false
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
     * 验证域的值。
     * Validates the field value
     * @return {Boolean} True表示为值有效，否则为false。True if the value is valid, else false
     */
    validate : function(){
        if(this.disabled || this.validateValue(this.processValue(this.getRawValue()))){
            this.clearInvalid();
            return true;
        }
        return false;
    },

    // protected - should be overridden by subclasses if necessary to prepare raw values for validation
    processValue : function(value){
        return value;
    },

    // private
    // Subclasses should provide the validation implementation by overriding this
    validateValue : function(value){
        return true;
    },

    /**
     * 标记该字段无效，使用{@link #msgTarget}来确定错误信息显示在哪里并设置字段元素的{@link #invalidClass}。
     * Mark this field as invalid, using {@link #msgTarget} to determine how to display the error and
     * applying {@link #invalidClass} to the field's element.
     * @param {String} msg (optional) 验证信息（默认为{@link #invalidText}）The validation message (defaults to {@link #invalidText})
     */
    markInvalid : function(msg){
        if(!this.rendered || this.preventMark){ // not rendered
            return;
        }
        msg = msg || this.invalidText;

        var mt = this.getMessageHandler();
        if(mt){
            mt.mark(this, msg);
        }else if(this.msgTarget){
            this.el.addClass(this.invalidClass);
            var t = Ext.getDom(this.msgTarget);
            if(t){
                t.innerHTML = msg;
                t.style.display = this.msgDisplay;
            }
        }
        this.fireEvent('invalid', this, msg);
    },

    /**
     * 清除元素任何无效标志样式与信息。
     * Clear any invalid styles/messages for this field
     */
    clearInvalid : function(){
        if(!this.rendered || this.preventMark){ // not rendered
            return;
        }
        this.el.removeClass(this.invalidClass);
        var mt = this.getMessageHandler();
        if(mt){
            mt.clear(this);
        }else if(this.msgTarget){
            this.el.removeClass(this.invalidClass);
            var t = Ext.getDom(this.msgTarget);
            if(t){
                t.innerHTML = '';
                t.style.display = 'none';
            }
        }
        this.fireEvent('valid', this);
    },

    // private
    getMessageHandler : function(){
        return Ext.form.MessageTargets[this.msgTarget];
    },

    // private
    getErrorCt : function(){
        return this.el.findParent('.x-form-element', 5, true) || // use form element wrap if available
            this.el.findParent('.x-form-field-wrap', 5, true);   // else direct field wrap
    },

    // private
    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.el, 'tl-tr', [2, 0]);
    },

    /**
     * 返回可能无效的原始值。要返回正式的值应该使用{@link #getValue}。
     * Returns the raw data value which may or may not be a valid, defined value.  To return a normalized value see {@link #getValue}.
     * @return {Mixed} value The field value
     */
    getRawValue : function(){
        var v = this.rendered ? this.el.getValue() : Ext.value(this.value, '');
        if(v === this.emptyText){
            v = '';
        }
        return v;
    },

    /**
     * 返回格式化后的数据（未定义或空值则会返回''）。返回原始值可以查看{@link #getRawValue}。 
     * Returns the normalized data value (undefined or emptyText will be returned as '').  To return the raw value see {@link #getRawValue}.
     * @return {Mixed} value The field value
     */
    getValue : function(){
        if(!this.rendered) {
            return this.value;
        }
        var v = this.el.getValue();
        if(v === this.emptyText || v === undefined){
            v = '';
        }
        return v;
    },

    /**
     * 跃过验证直接设置DOM元素值。需要验证的设值方法可以查看{@link #setValue}。
     * Sets the underlying DOM field's value directly, bypassing validation.  To set the value with validation see {@link #setValue}.
     * @param {Mixed} value 要设置的值 The value to set
     * @return {Mixed} value 已设置的值 The field value that is set
     */
    setRawValue : function(v){
        return this.el.dom.value = (v === null || v === undefined ? '' : v);
    },

    /**
     * 设置元素值并加以验证。如果想跃过验证直接设值则请看{@link #setRawValue}。
     * Sets a data value into the field and validates it.  To set the value directly without validation see {@link #setRawValue}.
     * @param {Mixed} value 要设置的值 The value to set
     */
    setValue : function(v){
        this.value = v;
        if(this.rendered){
            this.el.dom.value = (v === null || v === undefined ? '' : v);
            this.validate();
        }
    },

    // private, does not work for all fields
    append :function(v){
         this.setValue([this.getValue(), v].join(''));
    },

    // private
    adjustSize : function(w, h){
        var s = Ext.form.Field.superclass.adjustSize.call(this, w, h);
        s.width = this.adjustWidth(this.el.dom.tagName, s.width);
        if(this.offsetCt){
            var ct = this.getItemCt();
            s.width -= ct.getFrameWidth('lr');
            s.height -= ct.getFrameWidth('tb');
        }
        return s;
    },

    // private
    adjustWidth : function(tag, w){
        tag = tag.toLowerCase();
        if(typeof w == 'number' && !Ext.isSafari && !this.normalWidth){
            if(Ext.isIE && (tag == 'input' || tag == 'textarea')){
                if(tag == 'input' && !Ext.isStrict){
                    return this.inEditor ? w : w - 3;
                }
                if(tag == 'input' && Ext.isStrict){
                    return w - (Ext.isIE6 ? 4 : 1);
                }
                if(tag == 'textarea' && Ext.isStrict){
                    return w-2;
                }
            }else if(Ext.isOpera && Ext.isStrict){
                if(tag == 'input'){
                    return w + 2;
                }
                if(tag == 'textarea'){
                    return w-2;
                }
            }
        }
        return w;
    }

    /**
     * @cfg {Boolean} autoWidth @hide
     */
    /**
     * @cfg {Boolean} autoHeight @hide
     */

    /**
     * @cfg {String} autoEl @hide
     */
});


Ext.form.MessageTargets = {
    'qtip' : {
        mark: function(field, msg){
            field.el.addClass(field.invalidClass);
            field.el.dom.qtip = msg;
            field.el.dom.qclass = 'x-form-invalid-tip';
            if(Ext.QuickTips){ // fix for floating editors interacting with DND
                Ext.QuickTips.enable();
            }
        },
        clear: function(field){
            field.el.removeClass(field.invalidClass);
            field.el.dom.qtip = '';
        }
    },
    'title' : {
        mark: function(field, msg){
            field.el.addClass(field.invalidClass);
            field.el.dom.title = msg;
        },
        clear: function(field){
            field.el.dom.title = '';
        }
    },
    'under' : {
        mark: function(field, msg){
            field.el.addClass(field.invalidClass);
            if(!field.errorEl){
                var elp = field.getErrorCt();
                if(!elp){ // field has no container el
                    field.el.dom.title = msg;
                    return;
                }
                field.errorEl = elp.createChild({cls:'x-form-invalid-msg'});
                field.errorEl.setWidth(elp.getWidth(true)-20);
            }
            field.errorEl.update(msg);
            Ext.form.Field.msgFx[field.msgFx].show(field.errorEl, field);
        },
        clear: function(field){
            field.el.removeClass(field.invalidClass);
            if(field.errorEl){
                Ext.form.Field.msgFx[field.msgFx].hide(field.errorEl, field);
            }else{
                field.el.dom.title = '';
            }
        }
    },
    'side' : {
        mark: function(field, msg){
            field.el.addClass(field.invalidClass);
            if(!field.errorIcon){
                var elp = field.getErrorCt();
                if(!elp){ // field has no container el
                    field.el.dom.title = msg;
                    return;
                }
                field.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});
            }
            field.alignErrorIcon();
            field.errorIcon.dom.qtip = msg;
            field.errorIcon.dom.qclass = 'x-form-invalid-tip';
            field.errorIcon.show();
            field.on('resize', field.alignErrorIcon, field);
        },
        clear: function(field){
            field.el.removeClass(field.invalidClass);
            if(field.errorIcon){
                field.errorIcon.dom.qtip = '';
                field.errorIcon.hide();
                field.un('resize', field.alignErrorIcon, field);
            }else{
                field.el.dom.title = '';
            }
        }
    }
};

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
Ext.reg('field', Ext.form.Field);
