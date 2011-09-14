/**
 * @class Ext.form.Checkbox
 * @extends Ext.form.Field
 * 单独的checkbox域，可以直接代替传统checkbox域
 * @constructor
 * 创建一个新的CheckBox对象
 * @param {Object} config 配置项选项
 */
Ext.form.Checkbox = Ext.extend(Ext.form.Field,  {
   /**
	 * checkbox得到焦点时所使用的样式表（css）默认为undefined
     */	
    focusClass : undefined,
   /**
	 * checkbox默认的样式表（css）默认为x-form-field
     */  
    fieldClass: "x-form-field",
   /**
     * @cfg {Boolean} checked 如果checkbox需要呈现选中状态，设置checked为True（默认为false）
     */
    checked: false,
    /**
     * @cfg {String/Object} autoCreate 一个DomHelper创建元素的对象，或者为true，表示采用默认的方式创建元素。（默认为
     * {tag: "input", type: "checkbox", autocomplete: "off"}）
     */
    defaultAutoCreate : { tag: "input", type: 'checkbox', autocomplete: "off"},
    /**
     * @cfg {String} boxLabel checkbox旁边显示的文字
	 * 
     */  
    initComponent : function(){
        Ext.form.Checkbox.superclass.initComponent.call(this);
        this.addEvents(
           
            'check'
        );
    },

    // private
    onResize : function(){
        Ext.form.Checkbox.superclass.onResize.apply(this, arguments);
        if(!this.boxLabel){
            this.el.alignTo(this.wrap, 'c-c');
        }
    },
    
    // private
    initEvents : function(){
        Ext.form.Checkbox.superclass.initEvents.call(this);
        this.el.on("click", this.onClick,  this);
        this.el.on("change", this.onClick,  this);
    },

	// private
    getResizeEl : function(){
        return this.wrap;
    },

    // private
    getPositionEl : function(){
        return this.wrap;
    },

    /**
     * Overridden and disabled. The editor element does not support standard valid/invalid marking. @hide
     * @method
     */
    markInvalid : Ext.emptyFn,
    /**
     * Overridden and disabled. The editor element does not support standard valid/invalid marking. @hide
     * @method
     */
    clearInvalid : Ext.emptyFn,

    // private
    onRender : function(ct, position){
        Ext.form.Checkbox.superclass.onRender.call(this, ct, position);
        if(this.inputValue !== undefined){
            this.el.dom.value = this.inputValue;
        }
        this.wrap = this.el.wrap({cls: "x-form-check-wrap"});
        if(this.boxLabel){
            this.wrap.createChild({tag: 'label', htmlFor: this.el.id, cls: 'x-form-cb-label', html: this.boxLabel});
        }
        if(this.checked){
            this.setValue(true);
        }else{
            this.checked = this.el.dom.checked;
        }
    },
    
    // private
    onDestroy : function(){
        if(this.wrap){
            this.wrap.remove();
        }
        Ext.form.Checkbox.superclass.onDestroy.call(this);
    },

    // private
    initValue : Ext.emptyFn,

     /**
     * 返回checkbox的选择状态
     * @return {Boolean} True表示为已选中，否则false
     */
    getValue : function(){
        if(this.rendered){
            return this.el.dom.checked;
        }
        return false;
    },

	// private
    onClick : function(){
        if(this.el.dom.checked != this.checked){
            this.setValue(this.el.dom.checked);
        }
    },

     /**
     * 设置checkbox的选择状态
     * @param {Boolean/String}  传入的参数可以为boolean或者String类型，值为True, 'true,' 或 '1'都表示选中，其他为没有选中
     */
    setValue : function(v){
        this.checked = (v === true || v === 'true' || v == '1' || String(v).toLowerCase() == 'on');
        if(this.el && this.el.dom){
            this.el.dom.checked = this.checked;
            this.el.dom.defaultChecked = this.checked;
        }
        this.fireEvent("check", this, this.checked);
    }
});
Ext.reg('checkbox', Ext.form.Checkbox);