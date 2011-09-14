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
 * @class Array
 */
Ext.applyIf(Array.prototype, {
	

    /**
     * 检查对象是否存在于当前数组中。
     * Checks whether or not the specified object exists in the array.
     * @param {Object} o 要检查的对象。The object to check for
     * @param {Number} from （可选的）开始搜索的位置。(Optional) The index at which to begin the search
     * @return {Number} 返回该对象在数组中的位置（不存在则返回-1）。The index of o in the array (or -1 if it is not found)
     */
    indexOf: function(o, from) {
        var len = this.length;
        from = from || 0;
        from += (from < 0) ? len: 0;
        for (; from < len; ++from) {
            if (this[from] === o) {
                return from;
            }
        }
        return - 1;
    },

    /**
     * 删除数组中指定对象。如果该对象不在数组中，则不进行操作。
     * Removes the specified object from the array.  If the object is not found nothing happens.
     * @param {Object} o  要移除的对象。The object to remove
     * @return {Array} 该数组。this array
     */
    remove: function(o) {
        var index = this.indexOf(o);
        if (index != -1) {
            this.splice(index, 1);
        }
        return this;
    },

    contains: function(o) {
        return this.indexOf(o) !== -1;
    }
});