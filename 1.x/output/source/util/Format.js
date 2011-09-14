/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.0
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */


/**
 * @class Ext.util.Format
 *可复用的数据格式化函数。
 * @singleton
 */
Ext.util.Format = function(){
    var trimRe = /^\s+|\s+$/g;
    return {
        /**
         * 对大于指定长度部分的字符串，进行裁剪，增加省略号（“...”）的显示
         * @param {String} value 要裁剪的字符串
         * @param {Number} length 允许长度
         * @return {String} 转换后的文本
         */
        ellipsis : function(value, len){
            if(value && value.length > len){
                return value.substr(0, len-3)+"...";
            }
            return value;
        },

        /**
         * 检查一个值是否为underfined，若是的话转换为空值
         * @param {Mixed} value 要检查的值
         * @return {Mixed} 转换成功为空白字符串，否则为原来的值
         */
        undef : function(value){
            return typeof value != "undefined" ? value : "";
        },

        /**
         * 转义(&, <, >, and ') 为能在HTML显示的字符
         * @param {String} value 要编码的字符串
         * @return {String} 编码后的文本
         */
        htmlEncode : function(value){
            return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        },

        /**
         * 将（&, <, >, and '）字符还原
         * @param {String} value 解码的字符串
         * @return {String} 编码后的文本
         */
        htmlDecode : function(value){
            return !value ? value : String(value).replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
        },

        /**
         * 裁剪一段文本的前后多余的空格
         * @param {String} value 要裁剪的文本
         * @return {String} 裁剪后的文本
         */
        trim : function(value){
            return String(value).replace(trimRe, "");
        },

        /**
         * 返回一个从指定位置开始的指定长度的子字符串。
         * @param {String} value 原始文本
         * @param {Number} start 所需的子字符串的起始位置
         * @param {Number} length 在返回的子字符串中应包括的字符个数。
         * @return {String} 指定长度的子字符串
         */
        substr : function(value, start, length){
            return String(value).substr(start, length);
        },

        /**
         * 返回一个字符串，该字符串中的字母被转换为小写字母。
         * @param {String} value 要转换的字符串
         * @return {String} 转换后的字符串
         */
        lowercase : function(value){
            return String(value).toLowerCase();
        },

        /**
         * 返回一个字符串，该字符串中的字母被转换为大写字母。
         * @param {String} value 要转换的字符串
         * @return {String} 转换后的字符串
         */
        uppercase : function(value){
            return String(value).toUpperCase();
        },

        /**
         * 返回一个字符串，该字符串中的第一个字母转化为大写字母，剩余的为小写。
         * @param {String} value 要转换的字符串
         * @return {String} 转换后的字符串
         */
        capitalize : function(value){
            return !value ? value : value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
        },

        // private
        call : function(value, fn){
            if(arguments.length > 2){
                var args = Array.prototype.slice.call(arguments, 2);
                args.unshift(value);
                return eval(fn).apply(window, args);
            }else{
                return eval(fn).call(window, value);
            }
        },

        /**
         * 格式化数字到美元货币
         * @param {Number/String} value 要格式化的数字
         * @return {String} 已格式化的货币
         */
        usMoney : function(v){
            v = (Math.round((v-0)*100))/100;
            v = (v == Math.floor(v)) ? v + ".00" : ((v*10 == Math.floor(v*10)) ? v + "0" : v);
            v = String(v);
            var ps = v.split('.');
            var whole = ps[0];
            var sub = ps[1] ? '.'+ ps[1] : '.00';
            var r = /(\d+)(\d{3})/;
            while (r.test(whole)) {
                whole = whole.replace(r, '$1' + ',' + '$2');
            }
            return "$" + whole + sub ;
        },

        /**
         * 将某个值解析成为一个特定格式的日期。
         * @param {Mixed} value 要格式化的值
         * @param {String} format （可选的）任何有效的日期字符串（默认为“月/日/年”）
         * @return {Function} 日期格式函数
         */
        date : function(v, format){
            if(!v){
                return "";
            }
            if(!(v instanceof Date)){
                v = new Date(Date.parse(v));
            }
            return v.dateFormat(format || "m/d/Y");
        },

        /**
         * 返回一个函数，该函数的作用是渲染日期格式，便于复用。
         * @param {String} format 任何有效的日期字符串
         * @return {Function} 日期格式函数
         */
        dateRenderer : function(format){
            return function(v){
                return Ext.util.Format.date(v, format);  
            };
        },

        // private
        stripTagsRE : /<\/?[^>]+>/gi,
        
        /**
         * 剥去所有HTML标签
         * @param {Mixed} value 要剥去的文本
         * @return {String} 剥去后的HTML标签
         */
        stripTags : function(v){
            return !v ? v : String(v).replace(this.stripTagsRE, "");
        }
    };
}();