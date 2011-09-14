/*
 * @version Sencha 1.0RC-1
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */
 
/**
 * @class Ext.data.SortTypes
 * @singleton
 * @ignore
 * 定义一些缺省的比较函数，供排序时使用。<br />
 * Defines the default sorting (casting?) comparison functions used when sorting data.
 */
Ext.data.SortTypes = {
    /**
     * Default sort that does nothing
     * @param {Mixed} s The value being converted
     * @return {Mixed} The comparison value
     */
    none : function(s) {
        return s;
    },

    /**
     * 用来去掉标签的规则表达式。
     * The regular expression used to strip tags
     * @type {RegExp}
     * @property stripTagsRE
     */
    stripTagsRE : /<\/?[^>]+>/gi,
    
    /**
     * 去掉所有html标签来基于纯文本排序。
     * Strips all HTML tags to sort on text only
     * @param {Mixed} s 将被转换的值将被转换的值。The value being converted
     * @return {String} 用来比较的值所比较的值。The comparison value
     */
    asText : function(s) {
        return String(s).replace(this.stripTagsRE, "");
    },

    /**
     * 去掉所有html标签来基于无大小写区别的文本的排序。
     * Strips all HTML tags to sort on text only - Case insensitive
     * @param {Mixed} s 将被转换的值。The value being converted
     * @return {String} 所比较的值所比较的值。The comparison value
     */
    asUCText : function(s) {
        return String(s).toUpperCase().replace(this.stripTagsRE, "");
    },

    /**
     * 无分大小写的字符串。
     * Case insensitive string
     * @param {Mixed} s 将被转换的值。The value being converted
     * @return {String} 所比较的值。The comparison value
     */
    asUCString : function(s) {
        return String(s).toUpperCase();
    },

    /**
     * 对日期排序。
     * Date sorting
     * @param {Mixed} s 将被转换的值。The value being converted
     * @return {Number} 所比较的值。The comparison value
     */
    asDate : function(s) {
        if(!s){
            return 0;
        }
        if(Ext.isDate(s)){
            return s.getTime();
        }
        return Date.parse(String(s));
    },

    /**
     * 浮点数的排序。
     * Float sorting
     * @param {Mixed} s 将被转换的值。The value being converted
     * @return {Float} 所比较的值。The comparison value
     */
    asFloat : function(s) {
        var val = parseFloat(String(s).replace(/,/g, ""));
        return isNaN(val) ? 0 : val;
    },

    /**
     * 整数的排序。
     * Integer sorting
     * @param {Mixed} s 将被转换的值。The value being converted
     * @return {Number} 所比较的值。The comparison value
     */
    asInt : function(s) {
        var val = parseInt(String(s).replace(/,/g, ""), 10);
        return isNaN(val) ? 0 : val;
    }
};