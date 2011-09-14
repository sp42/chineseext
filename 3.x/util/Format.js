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
 * @class Ext.util.Format
 * 可复用的数据格式化函数。
 * @singleton
 */
Ext.util.Format = function(){
    var trimRe = /^\s+|\s+$/g;
    return {
        /**
         * 对大于指定长度部分的字符串，进行裁剪，增加省略号（“...”）的显示。
         * @param {String} value 要裁剪的字符串
         * @param {Number} length 允许的最大长度
         * @param {Boolean} word True表示尝试以一个单词来结束
         * @return {String} 转换后的文本
         */
        ellipsis : function(value, len, word){
            if(value && value.length > len){
                if(word){
                    var vs = value.substr(0, len - 2);
                    var index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                    if(index == -1 || index < (len - 15)){
                        return value.substr(0, len - 3) + "...";
                    }else{
                        return vs.substr(0, index) + "...";
                    }
                } else{
                    return value.substr(0, len - 3) + "...";
                }
            }
            return value;
        },

        /**
         * 检查一个引用值是否为underfined，若是的话转换其为空值。
         * @param {Mixed} value 要检查的值
         * @return {Mixed} 转换成功为空白字符串，否则为原来的值
         */
        undef : function(value){
            return value !== undefined ? value : "";
        },

        /**
         * 检查一个引用值是否为空，若是则转换到缺省值。
         * @param {Mixed} value 要检查的引用值
         * @param {String} defaultValue 默认赋予的值（默认为""）
         * @return {String}
         */
        defaultValue : function(value, defaultValue){
            return value !== undefined && value !== '' ? value : defaultValue;
        },

        /**
         * 为能在HTML显示的字符转义&、<、>以及'。
         * @param {String} value 要编码的字符串
         * @return {String} 编码后的文本
         */
        htmlEncode : function(value){
            return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        },

        /**
         * 将&, <, >, and '字符从HTML显示的格式还原。
         * @param {String} value 解码的字符串
         * @return {String} 编码后的文本
         */
        htmlDecode : function(value){
            return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
        },

        /**
         * 裁剪一段文本的前后多余的空格。
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
            if(!Ext.isDate(v)){
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
         * 剥去所有HTML标签。
         * @param {Mixed} value 要剥去的文本
         * @return {String} 剥去后的HTML标签
         */
        stripTags : function(v){
            return !v ? v : String(v).replace(this.stripTagsRE, "");
        },

        stripScriptsRe : /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,

        /**
         * 剥去所有脚本（<script>...</script>）标签
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
        }(),


        /**
         * 依据某种（字符串）格式来转换数字。
         * <div style="margin-left:40px">例子 (123456.789):
         * <div style="margin-left:10px">
         * 0 - (123456) 只显示整数，没有小数位<br>
         * 0.00 - (123456.78) 显示整数，保留两位小数位<br>
         * 0.0000 - (123456.7890) 显示整数，保留四位小数位<br>
         * 0,000 - (123,456) 只显示整数，用逗号分开<br>
         * 0,000.00 - (123,456.78) 显示整数，用逗号分开，保留两位小数位<br>
         * 0,0.00 - (123,456.78) 快捷方法，显示整数，用逗号分开，保留两位小数位<br>
         * 在一些国际化的场合需要反转分组（,）和小数位（.），那么就在后面加上/i
         * 例如： 0.000,00/i
         * </div></div>
         *
         * @method format
         * @param {Number} v 要转换的数字。
         * @param {String} format 格式化数字的“模”。
         * @return {String} 已转换的数字。
         * @public
         */
        number: function(v, format) {
            if(!format){
                return v;
            }
            v *= 1;
            if(typeof v != 'number' || isNaN(v)){
                return '';
            }
            var comma = ',';
            var dec = '.';
            var i18n = false;
            
            if(format.substr(format.length - 2) == '/i'){
                format = format.substr(0, format.length-2);
                i18n = true;
                comma = '.';
                dec = ',';
            }

            var hasComma = format.indexOf(comma) != -1,
                psplit = (i18n ? format.replace(/[^\d\,]/g,'') : format.replace(/[^\d\.]/g,'')).split(dec);

            if (1 < psplit.length) {
                v = v.toFixed(psplit[1].length);
            }
            else if (2 < psplit.length) {
                throw('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
            }
            else {
                v = v.toFixed(0);
            }

            var fnum = v.toString();

            if (hasComma) {
                psplit = fnum.split('.');

                var cnum = psplit[0],
                    parr = [],
                    j = cnum.length,
                    m = Math.floor(j / 3),
                    n = cnum.length % 3 || 3;

                for (var i = 0; i < j; i += n) {
                    if (i != 0) {n = 3;}
                    parr[parr.length] = cnum.substr(i, n);
                    m -= 1;
                }
                fnum = parr.join(comma);
                if (psplit[1]) {
                    fnum += dec + psplit[1];
                }
            }

            return format.replace(/[\d,?\.?]+/, fnum);
        },

        /**
         * 在多次转换数字时，为提高效率，不断复用由这个方法返回的函数。
         * @param {String} format 任何{@link #number}可接受的字符串
         * @return {Function} 数字格式化函数
         */
        numberRenderer : function(format){
            return function(v){
                return Ext.util.Format.number(v, format);
            };
        },

        /**
         * 可选地为一个单词转为为复数形式。例如在模板中，{commentCount:plural("Comment")}这样的模板语言如果commentCount是1那就是 "1 Comment"；
         * 如果是0或者大于1就是"x Comments"。 
         * @param {Number} value 参与比较的数
         * @param {String} singular 单词的单数形式
         * @param {String} plural （可选的） 单词的复数部分（默认为加上's'）
         */
        plural : function(v, s, p){
            return v +' ' + (v == 1 ? s : (p ? p : s+'s'));
        }
    }
}();