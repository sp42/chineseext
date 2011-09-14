/**
 * @class Ext.form.Field
 * @extends Ext.BoxComponent
 * 表单元素的基类，提供事件操作、尺寸调整、值操作与其它功能。
 * @constructor
 * 创建一个新的字段
 * @param {Object} config 配制选项
 */
Ext.form.Field = Ext.extend(Ext.BoxComponent,  {
/**
     * @cfg {String} 
     * 表单元素无效时标在上面的CSS样式（默认为"x-form-invalid"）
     */
    invalidClass : "x-form-invalid",
    /**
     * @cfg {String} invalidText 
     * 表单元素无效时标在上面的文本信息（默认为"The value in this field is invalid"）
     */
    invalidText : "The value in this field is invalid",
     /**
     * @cfg {String} focusClass 
     * 当表单元素获取焦点时的CSS样式（默认为"x-form-focus"）
     */
    focusClass : "x-form-focus",
   /**
     * @cfg {String/Boolean} validationEvent 
     * 初始化元素验证的事件名，如果设假，则不进行验证（默认"keyup"）
     */
    validationEvent : "keyup",
     /**
     * @cfg {Boolean} validateOnBlur 
     * 是否当失去焦点时验证此表单元素（默认真）。
     */
    validateOnBlur : true,
    /**
     * @cfg {Number} validationDelay 
     * 用户输入开始到验证开始的间隔毫秒数（默认250毫秒）
     */
    validationDelay : 250,
   /**
     * @cfg {String/Object} autoCreate 
     * 一个指定的DomHelper对象，如果为真则为一个默认对象（默认 {tag: "input", type: "text", size: "20", autocomplete: "off"}）
     */
    defaultAutoCreate : {tag: "input", type: "text", size: "20", autocomplete: "off"},
    /**
     * @cfg {String} fieldClass 
     * 表单元素一般状态CSS样式（默认为"x-form-field"）
     */
    fieldClass : "x-form-field",
     /**
     * @cfg {String} msgTarget 
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
     * @cfg {String} msgFx <b>Experimental</b> 
     * 表单元素无效提示显示的动画效果（默认为"normal"）
     */
    msgFx : 'normal',
    /**
     * @cfg {Boolean} readOnly 
     * 如果为真，则在HTML时标明此表单元素为只读 -- 注意：只是设置表单对象的只读属性。
     */
    readOnly : false,
    
    /**
     * @cfg {Boolean} disabled 
     * 为真则标明此表单元素为不可用（默认为假）
     */
    disabled : false,
    
    /**
     * @cfg {String} inputType 
     * "input"类表单元素的类型属性  -- 例如：radio,text,password （默认为"text"）
     */
    isFormField : true,
    
   
    hasFocus : false,


	initComponent : function(){
        Ext.form.Field.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event focus
             * 当此元素获取焦点时激发此事件。
             * @param {Ext.form.Field} this
             */
            'focus',
             /**
             * @event blur
             * 当此元素推动焦点时激发此事件。
             * @param {Ext.form.Field} this
             */
            'blur',
            /**
             * @event specialkey
             * 任何一个关于导航类键（arrows,tab,enter,esc等）被敲击则触发此事件。你可以查看{@link Ext.EventObject#getKey}去断定哪个键被敲击。
             * @param {Ext.form.Field} this
             * @param {Ext.EventObject} e The event object
             */
            'specialkey',
           /**
             * @event change
             * 当元素失去焦点时，如果值被修改则触发此事件。
             * @param {Ext.form.Field} this
             * @param {Mixed} newValue 新值
             * @param {Mixed} oldValue 原始值
             */
            'change',
           /**
             * @event invalid
             * 当此元素被标为无效后触发此事件。
             * @param {Ext.form.Field} this
             * @param {String} msg 验证信息
             */
            'invalid',
            /**
             * @event valid
             * 在此元素被验证有效后触发此事件。
             * @param {Ext.form.Field} this
             */
            'valid'
        );
    },

   /**
     * 试图获取元素的名称。
     * @return {String} name 域名
     */
    getName: function(){
         return this.rendered && this.el.dom.name ? this.el.dom.name : (this.hiddenName || '');
    },

  
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
     * 把组件应用到一个现有的对象上。这个被用来代替render()方法。
     * @param {String/HTMLElement/Element} el 节点对象的ID、DOM节点或一个现有对象。
     * @return {Ext.form.Fielhd} this
     */
    initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value);
        }else if(this.el.dom.value.length > 0){
            this.setValue(this.el.dom.value);
        }
    },

    /**
     * 它的原始值没有变更，并且它是可用的则返回真。
     * @return {Boolean}
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
        if(e.isSpecialKey()){
            this.fireEvent("specialkey", this, e);
        }
    },

   /**
     * 重置此元素的值到原始值，并且清除所有无效提示信息。
     */
    reset : function(){
        this.setValue(this.originalValue);
        this.clearInvalid();
    },

  
    initEvents : function(){
        this.el.on(Ext.isIE || Ext.isSafari3 ? "keydown" : "keypress", this.fireKey,  this);
        this.el.on("focus", this.onFocus,  this);
        this.el.on("blur", this.onBlur,  this);

        this.originalValue = this.getValue();
    },

    
    onFocus : function(){
        if(!Ext.isOpera && this.focusClass){ 
            this.el.addClass(this.focusClass);
        }
        if(!this.hasFocus){
            this.hasFocus = true;
            this.startValue = this.getValue();
            this.fireEvent("focus", this);
        }
    },

    beforeBlur : Ext.emptyFn,

    onBlur : function(){
        this.beforeBlur();
        if(!Ext.isOpera && this.focusClass){
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
     * 此元素是否有效。
     * @param {Boolean} preventMark 为真则不去标志此对象任何无效信息。
     * @return {Boolean} 有效过则返回真，否则返回假。
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
    validateValue : function(value){
        return true;
    },

    /**
     * 让该域无效
     * @param {String} msg 验证的信息
     */
    markInvalid : function(msg){
        if(!this.rendered || this.preventMark){  // 未渲染的
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
                    var elp = this.getErrorCt();
                    this.errorEl = elp.createChild({cls:'x-form-invalid-msg'});
                    this.errorEl.setWidth(elp.getWidth(true)-20);
                }
                this.errorEl.update(msg);
                Ext.form.Field.msgFx[this.msgFx].show(this.errorEl, this);
                break;
            case 'side':
                if(!this.errorIcon){
                    var elp = this.getErrorCt();
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
    
   
    getErrorCt : function(){
        return this.el.findParent('.x-form-element', 5, true) || 
            this.el.findParent('.x-form-field-wrap', 5, true);   
    },

   
    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.el, 'tl-tr', [2, 0]);
    },

   
    /**
     * 清除元素任何无效标志样式与信息。
     */
    clearInvalid : function(){
        if(!this.rendered || this.preventMark){  // 未渲染的
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
     * 返回可能无效的原始值。
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
     * @param {Mixed} value 要设置的值
     */
    setRawValue : function(v){
        return this.el.dom.value = (v === null || v === undefined ? '' : v);
    },

    /**
     * 设置元素值并加以验证。如果想跃过验证直接设值则请看{@link #setRawValue}。
     * @param {Mixed} value 要设置的值
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
        if(typeof w == 'number' && !Ext.isSafari){
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

   
});


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