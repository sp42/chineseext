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
 * @class Ext.form.Checkbox
 * @extends Ext.form.Field
 * 单独的checkbox域，可以直接代替传统checkbox域。<br />
 * Single checkbox field. Can be used as a direct replacement for traditional checkbox fields.
 * @constructor 创建一个新的CheckBox对象 Creates a new Checkbox
 * @param {Object} config 配置项选项 config Configuration options
 */
Ext.form.Checkbox = Ext.extend(Ext.form.Field,  {
    /**
     * @cfg {String} focusClass checkbox得到焦点时所使用的样式表（css）默认为undefined。
     * The CSS class to use when the checkbox receives focus (defaults to undefined)
     */
    focusClass : undefined,
    /**
     * @cfg {String} fieldClass checkbox默认的样式表（css）默认为x-form-field。
     * The default CSS class for the checkbox (defaults to "x-form-field")
     */
    fieldClass: "x-form-field",
    /**
     * @cfg {Boolean} checked 如果checkbox需要呈现选中状态，设置checked为True（默认为false）。
     * True if the the checkbox should render already checked (defaults to false)
     */
    checked: false,
    /**
     * @cfg {String/Object} autoCreate 一个DomHelper创建元素的对象，或者为true，表示采用默认的方式创建元素。（默认为 A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "checkbox", autocomplete: "off"})
     */
    defaultAutoCreate : { tag: "input", type: 'checkbox', autocomplete: "off"},
    /**
     * @cfg {String} boxLabel  checkbox旁边显示的文字。
     * The text that appears beside the checkbox
     */
    /**
     * @cfg {String} inputValue 应该显示在元素value处的值。
     * The value that should go into the generated input element's value attribute
     */

	// 私有的
    // private
    initComponent : function(){
        Ext.form.Checkbox.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event check
             * 当checkbox选中也好，不选中也好，触发该事件。
             * Fires when the checkbox is checked or unchecked.
             * @param {Ext.form.Checkbox} this This checkbox
             * @param {Boolean} checked 是否选中了 The new checked value
             */
            'check'
        );
    },

    // 私有的
    // private
    onResize : function(){
        Ext.form.Checkbox.superclass.onResize.apply(this, arguments);
        if(!this.boxLabel){
            this.el.alignTo(this.wrap, 'c-c');
        }
    },

    // 私有的
    // private
    initEvents : function(){
        Ext.form.Checkbox.superclass.initEvents.call(this);
        this.mon(this.el, 'click', this.onClick, this);
        this.mon(this.el, 'change', this.onClick, this);
    },

	// 私有的
    // private
    getResizeEl : function(){
        return this.wrap;
    },

    // 私有的
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

    // 私有的
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

    // 私有的
    // private
    onDestroy : function(){
        if(this.wrap){
            this.wrap.remove();
        }
        Ext.form.Checkbox.superclass.onDestroy.call(this);
    },

    // 私有的
    // private
    initValue : Ext.emptyFn,

    /**
     * 返回checkbox的选择状态。 
     * Returns the checked state of the checkbox.
     * @return {Boolean} True表示为已选中，否则false。 True if checked, else false
     */
    getValue : function(){
        if(this.rendered){
            return this.el.dom.checked;
        }
        return false;
    },

	// 私有的// private
    onClick : function(){
        if(this.el.dom.checked != this.checked){
            this.setValue(this.el.dom.checked);
        }
    },

    /**
     * 设置checkbox的选择状态。
     * Sets the checked state of the checkbox.
     * @param {Boolean/String} v 传入的参数可以为boolean或者String类型，值为True、'true,'或'1'都表示选中，其他为没有选中。
     * checked True, 'true', '1', or 'on' to check the checkbox, any other value will uncheck it.
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