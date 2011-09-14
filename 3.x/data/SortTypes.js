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
 * @class Ext.data.SortTypes
 * @singleton
 * 定义一些缺省的比较函数，供排序时使用。<br />
 * Defines the default sorting (casting?) comparison functions used when sorting data.
 */
Ext.data.SortTypes = {
    /**
     * 默认的排序即什么也不做。
     * Default sort that does nothing
     * @param {Mixed} s 将被转换的值将被转换的值。The value being converted
     * @return {Mixed} 用来比较的值所比较的值。The comparison value
     */
    none : function(s){
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
    asText : function(s){
        return String(s).replace(this.stripTagsRE, "");
    },
    
    /**
     * 去掉所有html标签来基于无大小写区别的文本的排序。
     * Strips all HTML tags to sort on text only - Case insensitive
     * @param {Mixed} s 将被转换的值。The value being converted
     * @return {String} 所比较的值所比较的值。The comparison value
     */
    asUCText : function(s){
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
        if(isNaN(val)) val = 0;
    	return val;
    },
    
    /**
     * 整数的排序。
     * Integer sorting
     * @param {Mixed} s 将被转换的值。The value being converted
     * @return {Number} 所比较的值。The comparison value
     */
    asInt : function(s) {
        var val = parseInt(String(s).replace(/,/g, ""));
        if(isNaN(val)) val = 0;
    	return val;
    }
};