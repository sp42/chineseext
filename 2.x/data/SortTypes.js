
/**
 * @class Ext.data.SortTypes
 * @singleton
 * 定义一些缺省的比较函数，供排序时使用。
 */

Ext.data.SortTypes = {
     /**
     * 默认的排序即什么也不做
     * @param {Mixed} s 将被转换的值
     * @return {Mixed} 用来比较的值
     */
    none : function(s){
        return s;
    },
    
     /**
     * 用来去掉标签的规则表达式
     * @type {RegExp}
     * @property
     */
    stripTagsRE : /<\/?[^>]+>/gi,
    

     /**
     * 去掉所有html标签来基于纯文本排序
     * @param {Mixed} s 将被转换的值
     * @return {String} 用来比较的值
     */
    asText : function(s){
        return String(s).replace(this.stripTagsRE, "");
    },
    

     /**
     * 去掉所有html标签来基于无大小写区别的文本的排序
     * @param {Mixed} s 将被转换的值
     * @return {String} 所比较的值
     */
    asUCText : function(s){
        return String(s).toUpperCase().replace(this.stripTagsRE, "");
    },
    

    /**
     * 无分大小写的字符串
     * @param {Mixed} s 将被转换的值
     * @return {String} 所比较的值
     */
    asUCString : function(s) {
    	return String(s).toUpperCase();
    },
    

     /**
     * 对日期排序
     * @param {Mixed} s 将被转换的值
     * @return {Number} 所比较的值
     */
    asDate : function(s) {
        if(!s){
            return 0;
        }
        if(s instanceof Date){
            return s.getTime();
        }
    	return Date.parse(String(s));
    },
    

     /**
     * 浮点数的排序
     * @param {Mixed} s 将被转换的值
     * @return {Float} 所比较的值
     */
    asFloat : function(s) {
    	var val = parseFloat(String(s).replace(/,/g, ""));
        if(isNaN(val)) val = 0;
    	return val;
    },
    
     /**
     * 整数的排序
     * @param {Mixed} s 将被转换的值
     * @return {Number} 所比较的值
     */
    asInt : function(s) {
        var val = parseInt(String(s).replace(/,/g, ""));
        if(isNaN(val)) val = 0;
    	return val;
    }
};