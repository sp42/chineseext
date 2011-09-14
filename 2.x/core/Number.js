/**
 * @class Number
 */
Ext.applyIf(Number.prototype, {
    /**
     * 检查当前数字是否属于某个期望的范围内。
     * 若数字是在范围内的就返回数字，否则最小或最大的极限值，那个极限值取决于数字是倾向那一面（最大、最小）。
     * 注意返回的极限值并不会影响当前的值。
     * @param {Number} min 范围中最小的极限值
     * @param {Number} max 范围中最大的极限值
     * @return {Number} 若超出范围返回极限值，反正是值本身
     */
    constrain : function(min, max){
        return Math.min(Math.max(this, min), max);
    }
});