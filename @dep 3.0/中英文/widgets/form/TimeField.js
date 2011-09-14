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
 * @class Ext.form.TimeField
 * @extends Ext.form.ComboBox
 * 提供一个带有下拉框和自动时间验证的时间输入框。 <br />
 * Provides a time input field with a time dropdown and automatic time validation.  Example usage:
 * <pre><code>
new Ext.form.TimeField({
    minValue: '9:00 AM',
    maxValue: '6:00 PM',
    increment: 30
});
</code></pre>
 * @constructor 创建新的TimeField对象 Create a new TimeField
 * @param {Object} config 参数
 */
Ext.form.TimeField = Ext.extend(Ext.form.ComboBox, {
    /**
     * @cfg {Date/String} minValue
     * 允许输入的最早的时间。可以是JavaScript Date对象，也可以是一个格式正确的字符串，请参阅{@link #format}和{@link #altFormats}（默认为null）。 
     * The minimum allowed time. Can be either a Javascript date object with a valid time value or a string 
     * time in a valid format -- see {@link #format} and {@link #altFormats} (defaults to null).
     */
    minValue : null,
    /**
     * @cfg {Date/String} maxValue
     * 允许输入的最晚时间。可以是JavaScriptDate对象，也可以是一个格式正确的字符串，请参阅{@link #format}和{@link #altFormats}（默认为null）。
     * The maximum allowed time. Can be either a Javascript date object with a valid time value or a string 
     * time in a valid format -- see {@link #format} and {@link #altFormats} (defaults to null).
     */
    maxValue : null,
    /**
     * @cfg {String} minText
     * 单元格里的时间早于限定的最早时间的错误信息（默认为:'The time in this field must be equal to or after {0}'）。
     * The error text to display when the date in the cell is before minValue (defaults to 'The time in this field must be equal to or after {0}').
     */
    minText : "The time in this field must be equal to or after {0}",
    /**
     * @cfg {String} maxText
     * 单元格里的时间晚于限定的最早时间的错误信息（默认为:'The time in this field must be equal to or before {0}'）。
     * The error text to display when the time is after maxValue (defaults to 'The time in this field must be equal to or before {0}').
     */
    maxText : "The time in this field must be equal to or before {0}",
    /**
     * @cfg {String} invalidText
     * 单元格里的时间不符合格式的错误信息（默认：'m/d/y'的格式）。
     * 默认为： The error text to display when the time in the field is invalid (defaults to'{value} is not a valid time'). 
     */
    invalidText : "{0} is not a valid time",
    /**
     * @cfg {String} format
     * 默认的字符串时间的格式，可以被覆盖以支持本地化。表示此格式的该字符串必须符合{@link Date#parseDate}（默认为'g:i A', e.g., '3:15 PM'）。 
     * The default time format string which can be overriden for localization support.  The format must be
     * valid according to {@link Date#parseDate} (defaults to 'g:i A', e.g., '3:15 PM').  For 24-hour time
     * format try 'H:i' instead.
     */
    format : "g:i A",
    /**
     * @cfg {String} altFormats
     * 当用户输入数值时对输入数值解析的每一个“段落”，每个“段落”就用这个“|”符号分隔。（默认为'g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H'）
     * Multiple date formats separated by "|" to try when parsing a user input value and it doesn't match the defined
     * format (defaults to 'g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H').
     */
    altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H",
    /**
     * @cfg {Number} increment
     * 下拉框里显示时间的步长（默认为15分钟）。PS:数字的单位是分钟。
     * The number of minutes between each time value in the list (defaults to 15).
     */
    increment: 15,

    // private override
    mode: 'local',
    // private override
    triggerAction: 'all',
    // private override
    typeAhead: false,
    
    // private - This is the date to use when generating time values in the absence of either minValue
    // or maxValue.  Using the current date causes DST issues on DST boundary dates, so this is an 
    // arbitrary "safe" date that can be any date aside from DST boundary dates.
    initDate: '1/1/2008',

    // private
    initComponent : function(){
        Ext.form.TimeField.superclass.initComponent.call(this);

        if(typeof this.minValue == "string"){
            this.minValue = this.parseDate(this.minValue);
        }
        if(typeof this.maxValue == "string"){
            this.maxValue = this.parseDate(this.maxValue);
        }

        if(!this.store){
            var min = this.parseDate(this.minValue);
            if(!min){
                min = new Date(this.initDate).clearTime();
            }
            var max = this.parseDate(this.maxValue);
            if(!max){
                max = new Date(this.initDate).clearTime().add('mi', (24 * 60) - 1);
            }
            var times = [];
            while(min <= max){
                times.push([min.dateFormat(this.format)]);
                min = min.add('mi', this.increment);
            }
            this.store = new Ext.data.ArrayStore({
                fields: ['text'],
                data : times
            });
            this.displayField = 'text';
        }
    },

    // inherited docs
    getValue : function(){
        var v = Ext.form.TimeField.superclass.getValue.call(this);
        return this.formatDate(this.parseDate(v)) || '';
    },

    // inherited docs
    setValue : function(value){
        Ext.form.TimeField.superclass.setValue.call(this, this.formatDate(this.parseDate(value)));
    },

    // private overrides
    validateValue : Ext.form.DateField.prototype.validateValue,
    parseDate : Ext.form.DateField.prototype.parseDate,
    formatDate : Ext.form.DateField.prototype.formatDate,

    // private
    beforeBlur : function(){
        var v = this.parseDate(this.getRawValue());
        if(v){
            this.setValue(v.dateFormat(this.format));
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
Ext.reg('timefield', Ext.form.TimeField);