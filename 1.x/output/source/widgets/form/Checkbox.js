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
 * @class Ext.form.Checkbox
 * @extends Ext.form.Field
 * 单独的checkbox域，可以直接代替传统checkbox域
 * @constructor
 * 创建一个新的CheckBox对象
 * @param {Object} config 配置项选项
 */
Ext.form.Checkbox = function(config){
    Ext.form.Checkbox.superclass.constructor.call(this, config);
    this.addEvents({
        /**
         * @event check
         * 当checkbox被单击时触发事件，无论有选中还是没有选中。
	     * @param {Ext.form.Checkbox} this 表示当前checkbox
	     * @param {Boolean} checked 选中的值
	     */
        check : true
    });
};

Ext.extend(Ext.form.Checkbox, Ext.form.Field,  {
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
    boxLabel : undefined,
    /**
     * @cfg {String} inputValue 导出input元素属性值
     */
    //
    onResize : function(){
        Ext.form.Checkbox.superclass.onResize.apply(this, arguments);
        if(!this.boxLabel){
            this.el.alignTo(this.wrap, 'c-c');
        }
    },

    initEvents : function(){
        Ext.form.Checkbox.superclass.initEvents.call(this);
        this.el.on("click", this.onClick,  this);
        this.el.on("change", this.onClick,  this);
    },


    getResizeEl : function(){
        return this.wrap;
    },

    getPositionEl : function(){
        return this.wrap;
    },

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