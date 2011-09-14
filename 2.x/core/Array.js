/**
 * @class Array
 */
Ext.applyIf(Array.prototype, {
    /**
     * 检查对象是否存在于该数组。
     * @param {Object} 要检查的对象
     * @return {Number} 返回该对象在数组中的位置（不存在则返回-1）。
     */
    indexOf : function(o){
       for (var i = 0, len = this.length; i < len; i++){
 	      if(this[i] == o) return i;
       }
 	   return -1;
    },

    /**
     * 删除数组中指定对象。如果该对象不在数组中，则不进行操作。
     * @param {Object} o 要移除的对象
     */
    remove : function(o){
       var index = this.indexOf(o);
       if(index != -1){
           this.splice(index, 1);
       }
       return this;
    }
});