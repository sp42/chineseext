/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

	/**
 * @class Ext.data.XmlReader
 * @extends Ext.data.DataReader
 * Data reader class to create an Array of {@link Ext.data.Record} objects from an XML document
 * based on mappings in a provided Ext.data.Record constructor.<br><br>
 * xmlReader类,继承Ext.data.DataReader类.基于Ext.data.Record的构建器提供的映射,从一xml document
 * 中创建一Ext.data.Record对象的数组 的数据读取器
 * <p>
 * <em>Note that in order for the browser to parse a returned XML document, the Content-Type
 * header in the HTTP response must be set to "text/xml".</em>
 * 注意:为了浏览器解析返回来的xml document,  http response的content-type 头必须被设成text/xml
 * <p>
 * Example code:
 * <pre><code>
var RecordDef = Ext.data.Record.create([
   {name: 'name', mapping: 'name'},     // "mapping" property not needed if it's the same as "name"
   {name: 'occupation'}                 // This field will use "occupation" as the mapping.
]);
var myReader = new Ext.data.XmlReader({
   totalRecords: "results", // The element which contains the total dataset size (optional)
   record: "row",           // The repeated element which contains row information
   id: "id"                 // The element within the row that provides an ID for the record (optional)
}, RecordDef);
</code></pre>
 * <p>
 * This would consume an XML file like this:
 * <pre><code>
&lt;?xml?>
&lt;dataset>
 &lt;results>2&lt;/results>
 &lt;row>
   &lt;id>1&lt;/id>
   &lt;name>Bill&lt;/name>
   &lt;occupation>Gardener&lt;/occupation>
 &lt;/row>
 &lt;row>
   &lt;id>2&lt;/id>
   &lt;name>Ben&lt;/name>
   &lt;occupation>Horticulturalist&lt;/occupation>
 &lt;/row>
&lt;/dataset>
</code></pre>
 * @cfg {String} totalRecords The DomQuery path from which to retrieve the total number of records
 * in the dataset. This is only needed if the whole dataset is not passed in one go, but is being
 * paged from the remote server.
 * @cfg {String} record The DomQuery path to the repeated element which contains record information.
 * @cfg {String} success The DomQuery path to the success attribute used by forms.
 * @cfg {String} id The DomQuery path relative from the record element to the element that contains
 * a record identifier value.
 * @constructor
 * Create a new XmlReader
 * @param {Object} meta Metadata configuration options
 * @param {Mixed} recordType The definition of the data record type to produce.  This can be either a valid
 * Record subclass created with {@link Ext.data.Record#create}, or an array of objects with which to call
 * Ext.data.Record.create.  See the {@link Ext.data.Record} class for more details.
 */
 /*
  * @cfg {String} totalRecords domQuery 路径,据此可以找到数据集里的记录总行数.该属性仅当整个数据集里被一次性
  * 拿出(而不是远程肥务器分页后的数据)时有用.
 * @cfg {String} record 包含记录信息的多个重复元素的DomQurey路径
 * @cfg {String} success 被forms使用的成功属性的DomQuery 路径
 * @cfg {String} id 关联记录元素到包含记录标识值元素的domQuery路径
 * @构建器
 * 创建一新xmlReader
 * @param {Object} meta 元数据配置项
 * @param {Mixed} recordType 用于产生数据记录类型的定义.这既可以是通过Ext.data.Record的create方法产生的一个有效的Record
 * 子类,也可以是一个通过调用Ext.data.Record的create方法产生的对象数组.从Ext.data.Record类可以了解更多细节
 */
Ext.data.XmlReader = function(meta, recordType){
    meta = meta || {};
    Ext.data.XmlReader.superclass.constructor.call(this, meta, recordType||meta.fields);
};
Ext.extend(Ext.data.XmlReader, Ext.data.DataReader, {
    /**
     * This method is only used by a DataProxy which has retrieved data from a remote server.
	 * @param {Object} response The XHR object which contains the parsed XML document.  The response is expected
	 * to contain a method called 'responseXML' that returns an XML document object.
     * @return {Object} records A data block which is used by an {@link Ext.data.Store} as
     * a cache of Ext.data.Records.
     */
	 /**
     * 该方法仅仅被DataProxy用来从远程服务器找回数据
	 * @param {Object} response 包含了解析的xml document的xhr对象
	 * 该response 被期望包含一方法调用responseXML来返回xml document对象
     * @return {Object} records 被Ext.data.Store作为Ext.data.Records缓存的数据块.
     */
    read : function(response){
        var doc = response.responseXML;
        if(!doc) {
            throw {message: "XmlReader.read: XML Document not available"};
        }
        return this.readRecords(doc);
    },

    /**
     * Create a data block containing Ext.data.Records from an XML document.
	 * @param {Object} doc A parsed XML document.
     * @return {Object} records A data block which is used by an {@link Ext.data.Store} as
     * a cache of Ext.data.Records.
     */
	 /**
     * 通过xml document创建一包含Ext.data.Records的数据块
	 * @param {Object} doc 一个被解析的 XML document.
     * @return {Object} 被Ext.data.Store当作Ext.data.Records缓存的数据块
     */
    readRecords : function(doc){
        /**
         * After any data loads/reads, the raw XML Document is available for further custom processing.
         * @type XMLDocument
         */
		 /**
         * 当有数据loads或reads后,原始的xml Document对于后面的客户操作不可用!
         * @type XMLDocument
         */
        this.xmlData = doc;
        var root = doc.documentElement || doc;
    	var q = Ext.DomQuery;
    	var recordType = this.recordType, fields = recordType.prototype.fields;
    	var sid = this.meta.id;
    	var totalRecords = 0, success = true;
    	if(this.meta.totalRecords){
    	    totalRecords = q.selectNumber(this.meta.totalRecords, root, 0);
    	}
        
        if(this.meta.success){
            var sv = q.selectValue(this.meta.success, root, true);
            success = sv !== false && sv !== 'false';
    	}
    	var records = [];
    	var ns = q.select(this.meta.record, root);
        for(var i = 0, len = ns.length; i < len; i++) {
	        var n = ns[i];
	        var values = {};
	        var id = sid ? q.selectValue(sid, n) : undefined;
	        for(var j = 0, jlen = fields.length; j < jlen; j++){
	            var f = fields.items[j];
                var v = q.selectValue(f.mapping || f.name, n, f.defaultValue);
	            v = f.convert(v);
	            values[f.name] = v;
	        }
	        var record = new recordType(values, id);
	        record.node = n;
	        records[records.length] = record;
	    }

	    return {
	        success : success,
	        records : records,
	        totalRecords : totalRecords || records.length
	    };
    }
});