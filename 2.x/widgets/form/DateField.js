/**
 * @class Ext.form.DateField
 * @extends Ext.form.TriggerField
 * Provides a date input field with a {@link Ext.DatePicker} dropdown and automatic date validation.
 * 提供一个包含 {@link Ext.DatePicker} 日期选择、自动效验控件的日期输入字段。
 * @constructor
 * 创建一个 DateField 对象
 * @param {Object} config
 */
Ext.form.DateField = Ext.extend(Ext.form.TriggerField,  {
     /**
     * @cfg {String} format
     * 用以覆盖本地化的默认日期格式化字串。字串必须为符合 {@link Date#parseDate} 指定的形式(默认为 'm/d/y')。
     */
    format : "m/d/y",
    /**
     * @cfg {String} altFormats

     * 用 "|" 符号分隔的多个日期格式化字串, 当输入的日期与默认的格式不符时用来尝试格式化输入值(默认为 'm/d/Y|m-d-y|m-d-Y|m/d|m-d|d')。
     */
    altFormats : "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d",
    /**
     * @cfg {Array} disabledDays
     * 一个禁用的星期数组, 以 0 开始。例如, [0，6] 表示禁用周六和周日(默认为 null)。
     */
    disabledDays : null,
    /**
     * @cfg {String} disabledDaysText
     * 禁用星期上显示的工具提示(默认为 'Disabled')
     */
    disabledDaysText : "Disabled",
    /**
     * @cfg {Array} disabledDates
     * 一个以字串形式表示的禁用的日期数组。这些字串将会被用来创建一个动态正则表达式, 所以它们是很强大的。一个例子:
     * <ul>
     * <li>["03/08/2003", "09/16/2003"] 将会禁用那些确切的日期</li>
     * <li>["03/08", "09/16"] 将会禁用每年中的那些日子</li>
     * <li>["^03/08"] 将会只匹配开头(当使用短年份时非常有用)</li>
     * <li>["03/../2006"] 将会禁用 2006 年 三月 的每一天</li>
     * <li>["^03"] 将会禁用每年三月的每一天</li>
     * </ul>
     * 为了提供正则表达式的支持, 如果你使用一个包含 "." 的日期格式, 你就得将小数点转义使用。例如: ["03\\.08\\.03"]。
     */
    disabledDates : null,
    /**
     * @cfg {String} disabledDatesText
     * 禁用日期上显示的工具提示(默认为 'Disabled')
     */
    disabledDatesText : "Disabled",
    /**
     * @cfg {Date/String} minValue
     * 允许的最小日期。可以是一个 Javascript 日期对象或一个有效格式的字串(默认为 null)
     */
    minValue : null,
    /**
     * @cfg {Date/String} maxValue
     * 允许的最大日期。可以是一个 Javascript 日期对象或一个有效格式的字串(默认为 null)
     */
    maxValue : null,
    /**
     * @cfg {String} minText
     * 当字段的日期早于 minValue 属性指定值时显示的错误文本(默认为 'The date in this field must be after {minValue}')。
     */
    minText : "The date in this field must be equal to or after {0}",
    /**
     * @cfg {String} maxText
     * 当字段的日期晚于 maxValue 属性指定值时显示的错误文本(默认为 'The date in this field must be before {maxValue}')。
     */
    maxText : "The date in this field must be equal to or before {0}",
    /**
     * @cfg {String} invalidText
     * 当字段的日期无效时显示的错误文本(默认为 '{value} is not a valid date - it must be in the format {format}')。
     */
    invalidText : "{0} is not a valid date - it must be in the format {1}",
    /**
     * @cfg {String} triggerClass
     * 用以指定触发按钮的附加CSS样式类。触发按钮的类名将总是 'x-form-trigger', 而如果指定了 triggerClass 则会被<b>追加</b>在其后(默认为 'x-form-date-trigger' 用以显示一个日历图标)。
     */
    triggerClass : 'x-form-date-trigger',
    /**
     * @cfg {String/Object} autoCreate
     * 指定一个 DomHelper 元素, 或者 true 指定默认的元素(默认为 {tag: "input", type: "text", size: "10", autocomplete: "off"})
     */

    // private
    defaultAutoCreate : {tag: "input", type: "text", size: "10", autocomplete: "off"},

    initComponent : function(){
        Ext.form.DateField.superclass.initComponent.call(this);
        if(typeof this.minValue == "string"){
            this.minValue = this.parseDate(this.minValue);
        }
        if(typeof this.maxValue == "string"){
            this.maxValue = this.parseDate(this.maxValue);
        }
        this.ddMatch = null;
        if(this.disabledDates){
            var dd = this.disabledDates;
            var re = "(?:";
            for(var i = 0; i < dd.length; i++){
                re += dd[i];
                if(i != dd.length-1) re += "|";
            }
            this.ddMatch = new RegExp(re + ")");
        }
    },

    // private
    validateValue : function(value){
        value = this.formatDate(value);
        if(!Ext.form.DateField.superclass.validateValue.call(this, value)){
            return false;
        }
        if(value.length < 1){ // if it's blank and textfield didn't flag it then it's valid
             return true;
        }
        var svalue = value;
        value = this.parseDate(value);
        if(!value){
            this.markInvalid(String.format(this.invalidText, svalue, this.format));
            return false;
        }
        var time = value.getTime();
        if(this.minValue && time < this.minValue.getTime()){
            this.markInvalid(String.format(this.minText, this.formatDate(this.minValue)));
            return false;
        }
        if(this.maxValue && time > this.maxValue.getTime()){
            this.markInvalid(String.format(this.maxText, this.formatDate(this.maxValue)));
            return false;
        }
        if(this.disabledDays){
            var day = value.getDay();
            for(var i = 0; i < this.disabledDays.length; i++) {
            	if(day === this.disabledDays[i]){
            	    this.markInvalid(this.disabledDaysText);
                    return false;
            	}
            }
        }
        var fvalue = this.formatDate(value);
        if(this.ddMatch && this.ddMatch.test(fvalue)){
            this.markInvalid(String.format(this.disabledDatesText, fvalue));
            return false;
        }
        return true;
    },

    // private
    // Provides logic to override the default TriggerField.validateBlur which just returns true
    validateBlur : function(){
        return !this.menu || !this.menu.isVisible();
    },

    /**
     * 返回当前日期字段的值。
     * @return {Date} 日期值
     */
    getValue : function(){
        return this.parseDate(Ext.form.DateField.superclass.getValue.call(this)) || "";
    },

    /**
     * 设置日期字段的值。你可以传递一个日期对象或任何可以被转换为有效日期的字串, 使用 DateField.format 当作日期格式化字串, 与 {@link Date#parseDate} 规则相同。(默认的格式化字串为 "m/d/y")。
     * <br />用法:
     * <pre><code>
//所有的调用均设置同样的日期(May 4, 2006)

//传递一个日期对象:
var dt = new Date('5/4/06');
dateField.setValue(dt);

//传递一个日期字串(采用默认的格式化字串):
dateField.setValue('5/4/06');

//转换一个日期字串(自定义的格式化字串):
dateField.format = 'Y-m-d';
dateField.setValue('2006-5-4');
</code></pre>
     * @param {String/Date} date 日期对象或有效的日期字串
     */
    setValue : function(date){
        Ext.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
    },

    // private
    parseDate : function(value){
        if(!value || value instanceof Date){
            return value;
        }
        var v = Date.parseDate(value, this.format);
        if(!v && this.altFormats){
            if(!this.altFormatsArray){
                this.altFormatsArray = this.altFormats.split("|");
            }
            for(var i = 0, len = this.altFormatsArray.length; i < len && !v; i++){
                v = Date.parseDate(value, this.altFormatsArray[i]);
            }
        }
        return v;
    },

    // private
    onDestroy : function(){
        if(this.wrap){
            this.wrap.remove();
        }
        Ext.form.DateField.superclass.onDestroy.call(this);
    },

    // private
    formatDate : function(date){
        return (!date || !(date instanceof Date)) ?
               date : date.dateFormat(this.format);
    },

    // private
    menuListeners : {
        select: function(m, d){
            this.setValue(d);
        },
        show : function(){ // retain focus styling
            this.onFocus();
        },
        hide : function(){
            this.focus.defer(10, this);
            var ml = this.menuListeners;
            this.menu.un("select", ml.select,  this);
            this.menu.un("show", ml.show,  this);
            this.menu.un("hide", ml.hide,  this);
        }
    },

    // private
    // Implements the default empty TriggerField.onTriggerClick function to display the DatePicker
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.menu == null){
            this.menu = new Ext.menu.DateMenu();
        }
        Ext.apply(this.menu.picker,  {
            minDate : this.minValue,
            maxDate : this.maxValue,
            disabledDatesRE : this.ddMatch,
            disabledDatesText : this.disabledDatesText,
            disabledDays : this.disabledDays,
            disabledDaysText : this.disabledDaysText,
            format : this.format,
            minText : String.format(this.minText, this.formatDate(this.minValue)),
            maxText : String.format(this.maxText, this.formatDate(this.maxValue))
        });
        this.menu.on(Ext.apply({}, this.menuListeners, {
            scope:this
        }));
        this.menu.picker.setValue(this.getValue() || new Date());
        this.menu.show(this.el, "tl-bl?");
    },

    beforeBlur : function(){
        var v = this.parseDate(this.getRawValue());
        if(v){
            this.setValue(v);
        }
    }

    /** 
     * @cfg {Boolean} grow @hide
     */
    /**
     * @cfg {Number} growMin @hide
     */
    /**
     * @cfg {Number} growMax @hide
     */
    /**
     * @hide
     * @method autoSize
     */
});
Ext.reg('datefield', Ext.form.DateField);