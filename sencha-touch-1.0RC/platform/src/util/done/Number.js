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
 * @class Ext.util.Numbers
 * @singleton
 */

Ext.util.Numbers = {
    
    // detect toFixed implementation bug in IE
    toFixedBroken: (0.9).toFixed() != 1,
    
    /**
     * 检查当前数字是否属于某个期望的范围内。
     * 若数字是在范围内的就返回数字，否则最小或最大的极限值，那个极限值取决于数字是倾向那一面（最大、最小）。
     * 注意返回的极限值并不会影响当前的值。
     * Checks whether or not the current number is within a desired range.  If the number is already within the
     * range it is returned, otherwise the min or max value is returned depending on which side of the range is
     * exceeded.  Note that this method returns the constrained value but does not change the current number.
     * @param {Number} number 要检查的数字。The number to check
     * @param {Number} min 范围中最小的极限值。The minimum number in the range
     * @param {Number} max 范围中最大的极限值。The maximum number in the range
     * @return {Number} 若在范围内，返回原值，否则返回超出那个范围边界的值。The constrained value if outside the range, otherwise the current value
     */
    constrain : function(number, min, max) {
        number = parseFloat(number);
        if (!isNaN(min)) {
            number = Math.max(number, min);
        }
        if (!isNaN(max)) {
            number = Math.min(number, max);
        }
        return number;
    },
    
    /**
     * 格式定点标记的数字。
     * Formats a number using fixed-point notation
     * @param {Number} value 要格式化的数字。The number to format
     * @param {Number} precision 小数点后面出现的位数。The number of digits to show after the decimal point
     */
    toFixed : function(value, precision) {
        if(Ext.util.Numbers.toFixedBroken) {
            precision = precision || 0;
            var pow = Math.pow(10, precision);
            return Math.round(value * pow) / pow;
        }
        return value.toFixed(precision);
    }
};
