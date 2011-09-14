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
 * @class Ext.util.Filter
 * @extends Object
 * <p>
 * 表示{@link Ext.data.MixedCollection MixedCollection}的筛选器。
 * 你可以简单地只是指定一个属性/值的结对，也可以创建筛选的函数来自定义逻辑。
 * 虽然在筛选和搜索记录的时候，{@link Ext.data.Store Store}常常创建筛选器，但筛选器总是在MixedCollections中使用，
 * Represents a filter that can be applied to a {@link Ext.data.MixedCollection MixedCollection}. Can either simply
 * filter on a property/value pair or pass in a filter function with custom logic. Filters are always used in the context
 * of MixedCollections, though {@link Ext.data.Store Store}s frequently create them when filtering and searching on their
 * records. Example usage:</p>
<pre><code>
// 设置一个虚拟MixedCollection包含一些要筛选的人。 set up a fictional MixedCollection containing a few people to filter on
var allNames = new Ext.util.MixedCollection();
allNames.addAll([
    {id: 1, name: 'Ed',    age: 25},
    {id: 2, name: 'Jamie', age: 37},
    {id: 3, name: 'Abe',   age: 32},
    {id: 4, name: 'Aaron', age: 26},
    {id: 5, name: 'David', age: 32}
]);

var ageFilter = new Ext.util.Filter({
    property: 'age',
    value   : 32
});

var longNameFilter = new Ext.util.Filter({
    filterFn: function(item) {
        return item.name.length > 4;
    }
});

// 新的MixedCollection有三个名字长于四个字符的人。a new MixedCollection with the 3 names longer than 4 characters
var longNames = allNames.filter(longNameFilter);

// 新的MixedCollection有两个24岁的人。a new MixedCollection with the 2 people of age 24:
var youngFolk = allNames.filter(ageFilter);
</code></pre>
 * @constructor
 * @param {Object} config 配置项对象。Config object
 */
Ext.util.Filter = Ext.extend(Object, {
    /**
     * @cfg {String} property 要筛选的属性。除非{@link #filter}已指定否则是必须的。The property to filter on. Required unless a {@link #filter} is passed
     */
    
    /**
     * @cfg {Function} filterFn 
     * 一个自定义函数传入{@link Ext.util.MixedCollection} 的每一项。应该要返回true表示接受每一项否则false代表不接受。
     * A custom filter function which is passed each item in the {@link Ext.util.MixedCollection} 
     * in turn. Should return true to accept each item or false to reject it
     */
    
    /**
     * @cfg {Boolean} anyMatch 
     * True表示为允许任意匹配，没有增加正则的start/end线标记。默认为fasle。
     * True to allow any match - no regex start/end line anchors will be added. Defaults to false
     */
    anyMatch: false,
    
    /**
     * @cfg {Boolean} exactMatch 
     * True表示为强制匹配（加入正则的^与$）。默认为false。如果anyMatch为true则忽略。 
     * True to force exact match (^ and $ characters added to the regex). Defaults to false.
     * Ignored if anyMatch is true.
     */
    exactMatch: false,
    
    /**
     * @cfg {Boolean} caseSensitive 
     * True表示为要正则大小写敏感（加入正则的“i”）。默认为fasle。
     * True to make the regex case sensitive (adds 'i' switch to regex). Defaults to false.
     */
    caseSensitive: false,
    
    /**
     * @cfg {String} root 
     * 
     * Optional root property. 
     * 可选的根属性。在筛选Store时候很有用。
     * 我们设置根为“data”使得筛选器提取出每一项的数据对象的{@link #property}。
     * This is mostly useful when filtering a Store, in which case we set the
     * root to 'data' to make the filter pull the {@link #property} out of the data object of each item
     */
    
    constructor: function(config) {
        Ext.apply(this, config);
        
        //we're aliasing filter to filterFn mostly for API cleanliness reasons, despite the fact it dirties the code here.
        //Ext.util.Sorter takes a sorterFn property but allows .sort to be called - we do the same here
        this.filter = this.filter || this.filterFn;
        
        if (this.filter == undefined) {
            if (this.property == undefined || this.value == undefined) {
                // Commented this out temporarily because it stops us using string ids in models. TODO: Remove this once
                // Model has been updated to allow string ids
                
                // throw "A Filter requires either a property or a filterFn to be set";
            } else {
                this.filter = this.createFilterFn();
            }
            
            this.filterFn = this.filter;
        }
    },
    
    /**
     * @private
     * 为该筛选器创建筛选器函数（要配置好属性、值、anyMatch、是否大小写敏感）。
     * Creates a filter function for the configured property/value/anyMatch/caseSensitive options for this Filter
     */
    createFilterFn: function() {
        var me       = this,
            matcher  = me.createValueMatcher(),
            property = me.property;
        
        return function(item) {
            return matcher.test(me.getRoot.call(me, item)[property]);
        };
    },
    
    /**
     * @private
     * 根据配置好的{@link #root}，返回给定项的根属性。
     * Returns the root property of the given item, based on the configured {@link #root} property
     * @param {Object} item 项。The item
     * @return {Object} 对象的根属性。The root property of the object
     */
    getRoot: function(item) {
        return this.root == undefined ? item : item[this.root];
    },
    
    /**
     * @private
     * 根据给定的值和匹配的选项，返回正则。
     * Returns a regular expression based on the given value and matching options
     */
    createValueMatcher : function() {
        var me            = this,
            value         = me.value,
            anyMatch      = me.anyMatch,
            exactMatch    = me.exactMatch,
            caseSensitive = me.caseSensitive,
            escapeRe      = Ext.util.Format.escapeRegex;
        
        if (!value.exec) { // not a regex
            value = String(value);

            if (anyMatch === true) {
                value = escapeRe(value);
            } else {
                value = '^' + escapeRe(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
         }
         
         return value;
    }
});