/*
 * @version Sencha 0.98
 * @ignore
 * @todo
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */

/**
 * @author Ed Spencer
 * @class Ext.data.validations
 * @extends Object
 * 
 * <p>
 * 这是一个单例，其下面的一系列方法和属性用于验证数据所必须的数据类型。但是多数情况是{@link Ext.data.Model Models}来自动调用。
 * This singleton contains a set of validation functions that can be used to validate any type
 * of data. They are most often used in {@link Ext.data.Model Models}, where they are automatically
 * set up and executed.</p>
 */
Ext.data.validations = {
    
    /**
     * 当验证是否存在不符合要求时，所提示的错误消息。
     * The default error message used when a presence validation fails
     * @property presenceMessage
     * @type String
     */
    presenceMessage: 'must be present',
    
    /**
     * 当验证长度(length)不符合要求时，所提示的错误消息。The default error message used when a length validation fails
     * @property lengthMessage
     * @type String
     */
    lengthMessage: 'is the wrong length',
    
    /**
     * 当验证格式（format）不符合要求时，所提示的错误消息。The default error message used when a format validation fails
     * @property formatMessage
     * @type Boolean
     */
    formatMessage: 'is the wrong format',
    
    /**
     * 当验证可接纳内容不符合要求时，所提示的错误消息。
     * The default error message used when an inclusion validation fails
     * @property inclusionMessage
     * @type String
     */
    inclusionMessage: 'is not included in the list of acceptable values',
    
    /**
     * 当验证不可接纳内容不符合要求时，所提示的错误消息。
     * The default error message used when an exclusion validation fails
     * @property exclusionMessage
     * @type String
     */
    exclusionMessage: 'is not an acceptable value',
    
    /**
     * 验证输入的是否存在。
     * Validates that the given value is present
     * @param {Object} config Optional config object
     * @param {Mixed} value The value to validate
     * @return {Boolean} True if validation passed
     */
    presence: function(config, value) {
        if (value == undefined) {
            value = config;
        }
        
        return !!value;
    },
    
    /**
     * Returns true if the given value is between the configured min and max values
     * @param {Object} config Optional config object
     * @param {String} value The value to validate
     * @return {Boolean} True if the value passes validation
     */
    length: function(config, value) {
        if (value == undefined) {
            return false;
        }
        
        var length = value.length,
            min    = config.min,
            max    = config.max;
        
        if ((min && length < min) || (max && length > max)) {
            return false;
        } else {
            return true;
        }
    },
    
    /**
     * Returns true if the given value passes validation against the configured {@link #matcher} regex
     * @param {Object} config Optional config object
     * @param {String} value The value to validate
     * @return {Boolean} True if the value passes the format validation
     */
    format: function(config, value) {
        return !!(config.matcher && config.matcher.test(value));
    },
    
    /**
     * Validates that the given value is present in the configured {@link #list}
     * @param {String} value The value to validate
     * @return {Boolean} True if the value is present in the list
     */
    inclusion: function(config, value) {
        return config.list && config.list.indexOf(value) != -1;
    },
    
    /**
     * Validates that the given value is present in the configured {@link #list}
     * @param {Object} config Optional config object
     * @param {String} value The value to validate
     * @return {Boolean} True if the value is not present in the list
     */
    exclusion: function(config, value) {
        return config.list && config.list.indexOf(value) == -1;
    }
};