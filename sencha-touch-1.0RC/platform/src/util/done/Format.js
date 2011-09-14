/*
 * @version Sencha 1.0RC-1
 * @ignore
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */
 
/**
 * @class Ext.util.Format
 * 可复用的数据格式化函数。
 * @singleton
 */
/**
 * @class Ext.util.Format
 * 可复用的数据格式化函数。
 * Reusable data formatting functions
 * @singleton
 */
Ext.util.Format = {
    defaultDateFormat: 'm/d/Y',
    escapeRe: /('|\\)/g,
    trimRe: /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
    formatRe: /\{(\d+)\}/g,
    escapeRegexRe: /([-.*+?^${}()|[\]\/\\])/g,
    

    /**
     * 对大于指定长度部分的字符串，进行裁剪，增加省略号（“...”）的显示。
     * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length
     * @param {String} value 要裁剪的字符串。The string to truncate
     * @param {Number} length 允许的最大长度。The maximum length to allow before truncating
     * @param {Boolean} word True表示尝试以一个单词来结束。True to try to find a common word break
     * @return {String} 转换后的文本。The converted text
     */
    ellipsis: function(value, len, word) {
        if (value && value.length > len) {
            if (word) {
                var vs = value.substr(0, len - 2),
                index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                if (index != -1 && index >= (len - 15)) {
                    return vs.substr(0, index) + "...";
                }
            } 
            return value.substr(0, len - 3) + "...";
        }
        return value;
    },

    /**
     * 转义字符，可以在政治表达式regexp的构造器中使用。
     * Escapes the passed string for use in a regular expression
     * @param {String} str
     * @return {String}
     */
    escapeRegex : function(s) {
        return s.replace(Ext.util.Format.escapeRegexRe, "\\$1");
    },

    /**
     * Escapes the passed string for ' and \
     * @param {String} string 要转义的字符。The string to escape
     * @return {String} 已转义的字符。The escaped string
     * @static
     */
    escape : function(string) {
        return string.replace(Ext.util.Format.escapeRe, "\\$1");
    },

    /**
	 * 比较并交换字符串的值。
	 * 参数中的第一个值与当前字符串对象比较，如果相等则返回传入的第一个参数，否则返回第二个参数。
	 * 注意：这个方法返回新值，但并不改变现有字符串。
     * Utility function that allows you to easily switch a string between two alternating values.  The passed value
     * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
     * they are already different, the first value passed in is returned.  Note that this method returns the new value
     * but does not change the current string.
     * <pre><code>
    // 可供选择的排序方向。alternate sort directions
    sort = Ext.util.Format.toggle(sort, 'ASC', 'DESC');

    // 等价判断语句：instead of conditional logic:
    sort = (sort == 'ASC' ? 'DESC' : 'ASC');
       </code></pre>
     * @param {String} string 当前字符。The current string
     * @param {String} value 第一个参数，与函数相等则返回。The value to compare to the current string
     * @param {String} other 传入的第二个参数，不等返回。The new value to use if the string already equals the first value passed in
     * @return {String} 新值。The new value
     */
    toggle : function(string, value, other) {
        return string == value ? other : value;
    },

    /**
	 * 裁剪字符串两旁的空白符，保留中间空白符，例如：
     * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
     * <pre><code>
    var s = '  foo bar  ';
    alert('-' + s + '-');         //alerts "- foo bar -"
    alert('-' + Ext.util.Format.trim(s) + '-');  //alerts "-foo bar-"
       </code></pre>
	 * @param {String} string 要裁剪的字符。The string to escape
     * @return {String} 已裁剪的字符串。The trimmed string
     */
    trim : function(string) {
        return string.replace(Ext.util.Format.trimRe, "");
    },

    /**
     * 在字符串左边填充指定字符。这对于统一字符或日期标准格式非常有用。
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings.  Example usage:
     *
     * <pre><code>
var s = Ext.util.Format.leftPad('123', 5, '0');
// s 现在是：s now contains the string: '00123'
       </code></pre>
     * @param {String} string 源字符串。The original string
     * @param {Number} size  源+填充字符串的总长度。The total length of the output string
     * @param {String} char （可选的） 填充字符串（默认是" "）。(optional) The character with which to pad the original string (defaults to empty string " ")
     * @return {String} 填充后的字符串。The padded string
     * @static
     */
    leftPad : function (val, size, ch) {
        var result = String(val);
        ch = ch || " ";
        while (result.length < size) {
            result = ch + result;
        }
        return result;
    },

    /**
     * 定义带标记的字符串，并用传入的字符替换标记。每个标记必须是唯一的，而且必须要像{0},{1}...{n}这样地自增长。
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.  
     * 例如：Example usage:
     * <pre><code>
var cls = 'my-class', text = 'Some text';
var s = String.format('&lt;div class="{0}">{1}&lt;/div>', cls, text);
//s现在是字符串：s now contains the string: '&lt;div class="my-class">Some text&lt;/div>'
</code></pre>
     * @param {String} string 带标记的字符串。The tokenized string to be formatted
     * @param {String} value1 第一个值，替换{0}。The value to replace token {0}
     * @param {String} value2 第二个值，替换{1}...等等（可以有任意多个）。Etc...
     * @return {String} 转化过的字符串。The formatted string
     * @static
     */
    format : function (format) {
        var args = Ext.toArray(arguments, 1);
        return format.replace(Ext.util.Format.formatRe, function(m, i) {
            return args[i];
        });
    },

    /**
     * 为能在HTML显示的字符转义&、<、>以及'。
     * Convert certain characters (&, <, >, and ') to their HTML character equivalents for literal display in web pages.
     * @param {String} value 要编码的字符串。The string to encode
     * @return {String} 编码后的文本。The encoded text
     */
    htmlEncode: function(value) {
        return ! value ? value: String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    },

    /**
     * 将&, <, >, and '字符从HTML显示的格式还原。
     * Convert certain characters (&, <, >, and ') from their HTML character equivalents.
     * @param {String} value 解码的字符串。The string to decode
     * @return {String} 编码后的文本。The decoded text
     */
    htmlDecode: function(value) {
        return ! value ? value: String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    },

    /**
     * 按照特定的格式模式格式化日期。
     * Parse a value into a formatted date using the specified format pattern.
     * @param {String/Date} value 要格式化的值（字符串必须符合JavaScript日期对象的格式要求，参阅<a href="http://www.w3schools.com/jsref/jsref_parse.asp">parse()</a>）The value to format (Strings must conform to the format expected by the javascript 
     * Date object's <a href="http://www.w3schools.com/jsref/jsref_parse.asp">parse()</a> method)
     * @param {String} format （可选的）任意的日期格式化字符串。（默认为'm/d/Y'）(optional) Any valid date format string (defaults to 'm/d/Y')
     * @return {String} 已格式化字符串。The formatted date string
     */
    date: function(v, format) {
        if (!v) {
            return "";
        }
        if (!Ext.isDate(v)) {
            v = new Date(Date.parse(v));
        }
        return v.dateFormat(format || Ext.util.Format.defaultDateFormat);
    }
};
