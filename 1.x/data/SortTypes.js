/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */


/**
 * @class Ext.data.SortTypes
 * @singleton
 * Defines the default sorting (casting?) comparison functions used when sorting data.
 */
 /**
 * @ Ext.data.SortTypes类
 * @单例
 * 定义在排序数据时一个默认的排序比较函数
 */
Ext.data.SortTypes = {
    /**
     * Default sort that does nothing
     * @param {Mixed} s The value being converted
     * @return {Mixed} The comparison value
     */
	 /**
     * 默认的排序即什么也不做
     * @param {Mixed} s 将被转换的值
     * @return {Mixed} 用来比较的值
     */
    none : function(s){
        return s;
    },
    
    /**
     * The regular expression used to strip tags
     * @type {RegExp}
     * @property
     */
	 /**
     * 用来去掉标签的规则表达式
     * @type {RegExp}
     * @property
     */
    stripTagsRE : /<\/?[^>]+>/gi,
    
    /**
     * Strips all HTML tags to sort on text only
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
	 /**
     * 去掉所有html标签来基于纯文本排序
     * @param {Mixed} s 将被转换的值
     * @return {String} 用来比较的值
     */
    asText : function(s){
        return String(s).replace(this.stripTagsRE, "");
    },
    
    /**
     * Strips all HTML tags to sort on text only - Case insensitive
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
	 /**
     * 去掉所有html标签来基于无大小写区别的文本的排序
     * @param {Mixed} s 将被转换的值
     * @return {String} 所比较的值
     */
    asUCText : function(s){
        return String(s).toUpperCase().replace(this.stripTagsRE, "");
    },
    
    /**
     * Case insensitive string
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
	  /**
     * 无大小写区别的字符串
     * @param {Mixed} s 将被转换的值
     * @return {String} 所比较的值
     */
    asUCString : function(s) {
    	return String(s).toUpperCase();
    },
    
    /**
     * Date sorting
     * @param {Mixed} s The value being converted
     * @return {Number} The comparison value
     */
	 /**
     * 日期排序
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
     * Float sorting
     * @param {Mixed} s The value being converted
     * @return {Float} The comparison value
     */
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
     * Integer sorting
     * @param {Mixed} s The value being converted
     * @return {Number} The comparison value
     */
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