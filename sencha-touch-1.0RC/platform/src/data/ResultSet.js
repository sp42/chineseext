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
 * @author Ed Spencer
 * @class Ext.data.ResultSet
 * @extends Object
 * 
 * <p>简单的包装类，用于表示由Proxy返回过来的记录集合。Simple wrapper class that represents a set of records returned by a Proxy.</p>
 * 
 * @constructor
 * 创建一个ResultSet。
 * Creates the new ResultSet
 */
Ext.data.ResultSet = Ext.extend(Object, {
    /**
     * @cfg {Boolean} loaded
     * True表示为已经加载记录完毕。这是在处理SQL后端Proxy时才有意义。 
     * True if the records have already been loaded. This is only meaningful when dealing with
     * SQL-backed proxies
     */
    loaded: true,
    
    /**
     * @cfg {Number} count
     * 记录集合的记录总数。请注意total与该值的不同
     * The number of records in this ResultSet. Note that total may differ from this number
     */
    count: 0,
    
    /**
     * @cfg {Number} total
     * 由数据源报告的记录总数。该记录集合可能会形成一个子记录的集合（参见count）。
     * The total number of records reported by the data source. This ResultSet may form a subset of
     * those records (see count)
     */
    total: 0,
    
    /**
     * @cfg {Boolean} success
     * True表示为加载记录集合成功。false表示遇到了错误。
     * True if the ResultSet loaded successfully, false if any errors were encountered
     */
    success: false,
    
    /**
     * @cfg {Array} records record实例的数组。必须得。The array of record instances. Required
     */

    constructor: function(config) {
        Ext.apply(this, config);
        
        /**
         * DEPRECATED - 在5.0中将会被移除。will be removed in Ext JS 5.0. This is just a copy of this.total - use that instead
         * @property totalRecords
         * @type Mixed
         */
        this.totalRecords = this.total;
        
        if (config.count == undefined) {
            this.count = this.records.length;
        }
    }
});