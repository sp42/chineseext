/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=90 Ext中文站翻译小组
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
 * @class Ext.form.TriggerField
 * @extends Ext.form.TextField
 * 为添加了带有可触发事件的按钮的TextFields（文本域）提供一个方便的封装（很像一个默认combobox）。 
 * 触发器没有默认行为（action），因此你必须通过重写方法{@link #onTriggerClick}的方式，指派一个方法实现触发器的点击事件处理。
 * 你可以直接创建一个TriggerField（触发域），由于它会呈现与combobox相像的效果，你可以通过它提供一种自定义的实现。例如： <br />
 * Provides a convenient wrapper for TextFields that adds a clickable trigger button (looks like a combobox by default).
 * The trigger has no default action, so you must assign a function to implement the trigger click handler by
 * overriding {@link #onTriggerClick}. 
 * You can create a TriggerField directly, as it renders exactly like a combobox
 * for which you can provide a custom implementation.  For example:
 * <pre><code>
var trigger = new Ext.form.TriggerField();
trigger.onTriggerClick = myTriggerFn;
trigger.applyToMarkup('my-field');
</code></pre>
 *
 * 然而，你可能会更倾向于将TriggerField作为一个可复用容器的基类。{@link Ext.form.DateField}和{@link Ext.form.ComboBox}就是两个较好的样板。
 * However, in general you will most likely want to use TriggerField as the base class for a reusable component.{@link Ext.form.DateField}and {@link Ext.form.ComboBox}are perfect examples of this.
 * @cfg {String} triggerClass 配置项triggerClass（字符串）是一个附加的CSS类，用于为触发器按钮设置样式。配置项triggerClass（触发器样式）如果被指定的话则会被<b>附加</b>，否则默认为“x-form-trigger”。
 * An additional CSS class used to style the trigger button.  The trigger will always get the class 'x-form-trigger' by default and triggerClass will be <b>appended</b> if specified.
 * @constructor 创建一个新TriggerField的对象。 Create a new TriggerField.
 * @param {Object} config 配置选择（对于有效的{@Ext.form.TextField}配置项也会被传入到TextField） Configuration options (valid {@Ext.form.TextField} config options will also be applied
 * to the base TextField)
 */
Ext.form.TriggerField = Ext.extend(Ext.form.TextField,  {
    /**
     * @cfg {String} triggerClass 应用到触发器身上的CSS样式类。
     * A CSS class to apply to the trigger
     */
    /**
     * @cfg {String/Object} autoCreate 一个DomHelper创建元素的对象，或者为true，表示采用默认的方式创建元素。（默认为{tag: "input", type: "text", size: "16", autocomplete: "off"}）
     * A DomHelper element spec, or true for a default element spec (defaults to {tag: "input", type: "text", size: "16", autocomplete: "off"})
     */
    defaultAutoCreate : {tag: "input", type: "text", size: "16", autocomplete: "off"},
    /**
     * @cfg {Boolean} hideTrigger 为true时隐藏触发元素，只显示基本文本域（默认为false）。 
     * True to hide the trigger element and display only the base text field (defaults to false)
     */
    hideTrigger:false,

    /**
     * @hide 
     * @method autoSize
     */
    autoSize: Ext.emptyFn,
    // private
    monitorTab : true,
    // private
    deferHeight : true,
    // private
    mimicing : false,

    // private
    onResize : function(w, h){
        Ext.form.TriggerField.superclass.onResize.call(this, w, h);
        if(typeof w == 'number'){
            this.el.setWidth(this.adjustWidth('input', w - this.trigger.getWidth()));
        }
        this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
    },

    // private
    adjustSize : Ext.BoxComponent.prototype.adjustSize,

    // private
    getResizeEl : function(){
        return this.wrap;
    },

    // private
    getPositionEl : function(){
        return this.wrap;
    },

    // private
    alignErrorIcon : function(){
        if(this.wrap){
            this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
        }
    },

    // private
    onRender : function(ct, position){
        Ext.form.TriggerField.superclass.onRender.call(this, ct, position);

        this.wrap = this.el.wrap({cls: "x-form-field-wrap"});
        this.trigger = this.wrap.createChild(this.triggerConfig ||
                {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.triggerClass});
        if(this.hideTrigger){
            this.trigger.setDisplayed(false);
        }
        this.initTrigger();
        if(!this.width){
            this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
        }
    },

    afterRender : function(){
        Ext.form.TriggerField.superclass.afterRender.call(this);
        var y;
        if(Ext.isIE && !this.hideTrigger && this.el.getY() != (y = this.trigger.getY())){
            this.el.position();
            this.el.setY(y);
        }
    },

    // private
    initTrigger : function(){
    	this.mon(this.trigger, 'click', this.onTriggerClick, this, {preventDefault:true});
        this.trigger.addClassOnOver('x-form-trigger-over');
        this.trigger.addClassOnClick('x-form-trigger-click');
    },

    // private
    onDestroy : function(){
        if(this.trigger){
            this.trigger.removeAllListeners();
            this.trigger.remove();
        }
        if(this.wrap){
            this.wrap.remove();
        }
        Ext.form.TriggerField.superclass.onDestroy.call(this);
    },

    // private
    onFocus : function(){
        Ext.form.TriggerField.superclass.onFocus.call(this);
        if(!this.mimicing){
            this.wrap.addClass('x-trigger-wrap-focus');
            this.mimicing = true;
            Ext.get(Ext.isIE ? document.body : document).on("mousedown", this.mimicBlur, this, {delay: 10});
            if(this.monitorTab){
            	this.el.on('keydown', this.checkTab, this);
            }
        }
    },

    // private
    checkTab : function(e){
        if(e.getKey() == e.TAB){
            this.triggerBlur();
        }
    },

    // private
    onBlur : function(){
        // do nothing
    },

    // private
    mimicBlur : function(e){
        if(!this.wrap.contains(e.target) && this.validateBlur(e)){
            this.triggerBlur();
        }
    },

    // private
    triggerBlur : function(){
        this.mimicing = false;
        Ext.get(Ext.isIE ? document.body : document).un("mousedown", this.mimicBlur, this);
        if(this.monitorTab && this.el){
            this.el.un("keydown", this.checkTab, this);
        }
        this.beforeBlur();
        if(this.wrap){
            this.wrap.removeClass('x-trigger-wrap-focus');
        }
        Ext.form.TriggerField.superclass.onBlur.call(this);
    },

    beforeBlur : Ext.emptyFn, 

    // private
    // 这个方法须有子类重写（覆盖），需要确认该域是否可以失去焦点（blurred）。 
    // This should be overriden by any subclass that needs to check whether or not the field can be blurred.
    validateBlur : function(e){
        return true;
    },

    // private
    onDisable : function(){
        Ext.form.TriggerField.superclass.onDisable.call(this);
        if(this.wrap){
            this.wrap.addClass(this.disabledClass);
            this.el.removeClass(this.disabledClass);
        }
    },

    // private
    onEnable : function(){
        Ext.form.TriggerField.superclass.onEnable.call(this);
        if(this.wrap){
            this.wrap.removeClass(this.disabledClass);
        }
    },

    // private
    onShow : function(){
        if(this.wrap){
            this.wrap.dom.style.display = '';
            this.wrap.dom.style.visibility = 'visible';
        }
    },

    // private
    onHide : function(){
        this.wrap.dom.style.display = 'none';
    },

    /**
     * 该方法应该用于处理触发器的click事件。默认为空方法，要被某个实现的方法重写后才会有效。 
     * The function that should handle the trigger's click event.  This method does nothing by default until overridden
     * by an implementing function.
     * @method
     * @param {EventObject} e 参数e是（{EventObject}类型）
     */
    onTriggerClick : Ext.emptyFn

    /**
     * @cfg {Boolean} grow @hide
     */
    /**
     * @cfg {Number} growMin @hide
     */
    /**
     * @cfg {Number} growMax @hide
     */
});

// TwinTriggerField is not a public class to be used directly.  It is meant as an abstract base class
// to be extended by an implementing class.  For an example of implementing this class, see the custom
// SearchField implementation here: http://extjs.com/deploy/ext/examples/form/custom.html
Ext.form.TwinTriggerField = Ext.extend(Ext.form.TriggerField, {
    initComponent : function(){
        Ext.form.TwinTriggerField.superclass.initComponent.call(this);

        this.triggerConfig = {
            tag:'span', cls:'x-form-twin-triggers', cn:[
            {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger1Class},
            {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger2Class}
        ]};
    },

    getTrigger : function(index){
        return this.triggers[index];
    },

    initTrigger : function(){
        var ts = this.trigger.select('.x-form-trigger', true);
        this.wrap.setStyle('overflow', 'hidden');
        var triggerField = this;
        ts.each(function(t, all, index){
            t.hide = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = 'none';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
            };
            t.show = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = '';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
            };
            var triggerIndex = 'Trigger'+(index+1);

            if(this['hide'+triggerIndex]){
                t.dom.style.display = 'none';
            }
            this.mon(t, 'click', this['on'+triggerIndex+'Click'], this, {preventDefault:true});
            t.addClassOnOver('x-form-trigger-over');
            t.addClassOnClick('x-form-trigger-click');
        }, this);
        this.triggers = ts.elements;
    },

    onTrigger1Click : Ext.emptyFn,
    onTrigger2Click : Ext.emptyFn
});
Ext.reg('trigger', Ext.form.TriggerField);