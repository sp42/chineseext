/**
 * @class Ext.form.TimeField
 * @extends Ext.form.ComboBox
 * 提供一个带有下拉框和自动时间验证的时间输入框。</br>
 * @构造函数constructor
 * Create a new TimeField
 * @参数{Object} config 
 */
Ext.form.TimeField = Ext.extend(Ext.form.ComboBox, {
    /**
     * @cfg {Date/String} minValue
     *允许输入的最早的时间。可以是JavaScriptDate对象，也可以是一个格式正确的字符串（默认为null）
     */
    minValue : null,
    /**
     * @cfg {Date/String} maxValue
     * 允许输入的最晚时间。可以是JavaScriptDate对象，也可以是一个格式正确的字符串（默认为null）
     */
    maxValue : null,
    /**
     * @cfg {String} minText
     *单元格里的时间早于限定的最早时间的错误信息。(默认为: The time in this field must be equal to or after {0}')
     */
    minText : "The time in this field must be equal to or after {0}",
    /**
     * @cfg {String} maxText
     * 单元格里的时间晚于限定的最早时间的错误信息。(默认为:'The time in this field must be equal to or before {0}').
     */
    maxText : "The time in this field must be equal to or before {0}",
    /**
     * @cfg {String} invalidText
     * 单元格里的时间不符合格式的错误信息。(默认为：
     * '{value} is not a valid time - it must be in the format {format}').
     */
    invalidText : "{0} is not a valid time",
    /**
     * @cfg {String} format
     * 默认的字符串时间的格式，可以被覆盖以支持本地化。表示此格式的该字符串必须符合
     *  {@link Date#parseDate} (默认：'m/d/y')的格式。
     */
    format : "g:i A",
    /**
     * @cfg {String} altFormats
     * Multiple date formats separated by "|" to try when parsing a user input value and it doesn't match the defined
     * format (defaults to 'm/d/Y|m-d-y|m-d-Y|m/d|m-d|d').
     */
    altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H",
    /**
     * @cfg {Number} increment
     *下拉框里显示时间的步长(默认为15分钟) 。PS:数字的单位是分钟
     */
    increment: 15,

    // private override
    mode: 'local',
    // private override
    triggerAction: 'all',
    // private override
    typeAhead: false,

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
                min = new Date().clearTime();
            }
            var max = this.parseDate(this.maxValue);
            if(!max){
                max = new Date().clearTime().add('mi', (24 * 60) - 1);
            }
            var times = [];
            while(min <= max){
                times.push([min.dateFormat(this.format)]);
                min = min.add('mi', this.increment);
            }
            this.store = new Ext.data.SimpleStore({
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