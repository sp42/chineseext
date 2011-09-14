
/**
 * @class String
 * 将javascript的String原型对象进行修改，增加工具的方法。
 */
Ext.applyIf(String, {

    /*
     * 避免传入 ' 与 \
     * @param {String} str
     * @return {String}
     */
    escape : function(string) {
        return string.replace(/('|\\)/g, "\\$1");
    },

    /**
     * 在字符串左边填充指定字符。这对于统一字符或日期标准格式非常有用。
     * 例如：
     * <pre><code>
var s = String.leftPad('123', 5, '0');
// s 现在是：'00123'
</code></pre>
     * @param {String} 源字符串
     * @param {Number} 源+填充字符串的总长度
     * @param {String} 填充字符串（默认是" "）
     * @return {String} 填充后的字符串
     * @static
     */
    leftPad : function (val, size, ch) {
        var result = new String(val);
        if(ch === null || ch === undefined || ch === '') {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result;
    },

    /**
     * 定义带标记的字符串，并用自定义字符替换标记。
     * 每个标记必须是唯一的，而且必须要像{0},{1}...{n}这样自增长。
     * 例如：
     * <pre><code>
var cls = 'my-class', text = 'Some text';
var s = String.format('<div class="{0}">{1}</div>', cls, text);
// s now contains the string: '<div class="my-class">Some text</div>'
</code></pre>
     * @param {String} 带标记的字符串
     * @param {String} 第一个值，替换{0}
     * @param {String} 第二个值，替换{1}...等等（可以有任意多个）
     * @return {String} 转化过的字符串
     * @static
     */
    format : function(format){
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    }
});

/**
 * 比较并交换字符串的值。
 * 参数中的第一个值与当前字符串对象比较，如果相等则返回传入的第一个参数，否则返回第二个参数。
 * 注意：这个方法返回新值，但并不改变现有字符串。
 * <pre><code>
// alternate sort directions
sort = sort.toggle('ASC', 'DESC');

// instead of conditional logic:
sort = (sort == 'ASC' ? 'DESC' : 'ASC');
</code></pre>
 * @param {String} 第一个参数，与函数相等则返回
 * @param {String} 传入的第二个参数，不等返回
 * @return {String} 新值
 */
String.prototype.toggle = function(value, other){
    return this == value ? other : value;
};

/**
 * 检验数字大小。
 * 传入两个数字，一小一大，如果当前数字小于传入的小数字，则返回小的；如果该数字大于大的，则返回大的；如果在中间，则返回该数字本身
 * 注意：这个方法返回新数字，但并不改变现有数字
 * @param {Number} 小数
 * @param {Number} 大数
 * @return {Number} 大小数字，或其本身
 */
String.prototype.trim = function(){
    var re = /^\s+|\s+$/g;
    return function(){ return this.replace(re, ""); };
}();