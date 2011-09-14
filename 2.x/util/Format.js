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
            return value !== undefined ? value : "";
        },

        /**
         * 检查一个值（引用的）是否为空，若是则转换到缺省值。
         * @param {Mixed} value 要检查的引用值
         * @param {String} defaultValue 默认赋予的值（默认为""）
         * @return {String}
         */
        defaultValue : function(value, defaultValue){
            return value !== undefined && value !== '' ? value : defaultValue;
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
         * 将（&, <, >, and '）字符从HTML显示的格式还原
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
            v = whole + sub;
            if(v.charAt(0) == '-'){
                return '-$' + v.substr(1);
            }
            return "$" +  v;
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
        },

        stripScriptsRe : /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,

        /**
         * 剥去所有脚本（Script）标签
         * @param {Mixed} value 要剥去的文本
         * @return {String} 剥去后的HTML标签
         */        
        stripScripts : function(v){
            return !v ? v : String(v).replace(this.stripScriptsRe, "");
        },

        /**
         * 对文件大小进行简单的格式化（xxx bytes、xxx KB、xxx MB）
         * @param {Number/String} size 要格式化的数值
         * @return {String} 已格式化的值
         */
        fileSize : function(size){
            if(size < 1024) {
                return size + " bytes";
            } else if(size < 1048576) {
                return (Math.round(((size*10) / 1024))/10) + " KB";
            } else {
                return (Math.round(((size*10) / 1048576))/10) + " MB";
            }
        },

        math : function(){
            var fns = {};
            return function(v, a){
                if(!fns[a]){
                    fns[a] = new Function('v', 'return v ' + a + ';');
                }
                return fns[a](v);
            }
        }()
    };
}();