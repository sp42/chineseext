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
 * @class Ext.util.Sorter
 * @extends Object
 * 代表可以应用到Store的单个排序器。
 * Represents a single sorter that can be applied to a Store
 */
Ext.util.Sorter = Ext.extend(Object, {
    /**
     * @cfg {String} property 
     * 要排序的属性。除非提供了{@link #sorter}。
     * The property to sort by. Required unless {@link #sorter} is provided
     */
    
    /**
     * @cfg {Function} sorterFn 
     * 特定要执行的排序函数，可以由{@link #property}代替指定。
     * A specific sorter function to execute. Can be passed instead of {@link #property}
     */
    
    /**
     * @cfg {String} root 可选的根属性。在排序Store时候很有用。
     * 我们设置根为“data”使得过滤器提取出每一项的数据对象。
     * Optional root property. This is mostly useful when sorting a Store, in which case we set the
     * root to 'data' to make the filter pull the {@link #property} out of the data object of each item
     */
    
    /**
     * @cfg {String} direction 排序的方向，默认是ASC。The direction to sort by. Defaults to ASC
     */
    direction: "ASC",
    
    constructor: function(config) {
        Ext.apply(this, config);
        
        if (this.property == undefined && this.sorterFn == undefined) {
            throw "A Sorter requires either a property or a sorter function";
        }
        
        this.sort = this.createSortFunction(this.sorterFn || this.defaultSorterFn);
    },
    
    /**
     * @private
     * 指定属性和方向，为数组创建并返回排序的函数。
     * Creates and returns a function which sorts an array by the given property and direction
     * @return {Function} 指定的属性、方向组合而成的排序函数。A function which sorts by the property/direction combination provided
     */
    createSortFunction: function(sorterFn) {
        var me        = this,
            property  = me.property,
            direction = me.direction,
            modifier  = direction.toUpperCase() == "DESC" ? -1 : 1;
        
        //create a comparison function. Takes 2 objects, returns 1 if object 1 is greater,
        //-1 if object 2 is greater or 0 if they are equal
        return function(o1, o2) {
            return modifier * sorterFn.call(me, o1, o2);
        };
    },
    
    /**
     * @private
     * 只是比较每个对象已定义的属性的基本默认排序函数。
     * Basic default sorter function that just compares the defined property of each object
     */
    defaultSorterFn: function(o1, o2) {
        var v1 = this.getRoot(o1)[this.property],
            v2 = this.getRoot(o2)[this.property];

        return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
    },
    
    /**
     * @private
     * 返回给定项的根属性，基于已配置好的{@link #root}属性。
     * Returns the root property of the given item, based on the configured {@link #root} property
     * @param {Object} item 哪一项？The item
     * @return {Object} 对象的根属性。The root property of the object
     */
    getRoot: function(item) {
        return this.root == undefined ? item : item[this.root];
    }
});