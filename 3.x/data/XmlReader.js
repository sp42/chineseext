/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
 * 
 * 本翻译采用“创作共同约定、Creative Commons”。您可以自由：
 * 复制、发行、展览、表演、放映、广播或通过信息网络传播本作品
 * 创作演绎作品
 * 请遵守：
 *    署名. 您必须按照作者或者许可人指定的方式对作品进行署名。
 * # 对任何再使用或者发行，您都必须向他人清楚地展示本作品使用的许可协议条款。
 * # 如果得到著作权人的许可，您可以不受任何这些条件的限制
 * http://creativecommons.org/licenses/by/2.5/cn/
 */
/**
 * @class Ext.data.XmlReader
 * @extends Ext.data.DataReader
 * Data reader类接受一个XML文档响应后，创建一个由{@link Ext.data.Record}对象组成的数组，数组内的每个对象都是{@link Ext.data.Record}构造器负责映射（mappings）的结果。<br />
 * Data reader class to create an Array of {@link Ext.data.Record} objects from an XML document
 * based on mappings in a provided {@link Ext.data.Record} constructor.<br><br>
 * <p>
 * <em>
 * 注意:为了浏览器能成功解析返回来的XML document对象，HHTP Response的content-type头必须被设成text/xml。<br />
 * Note that in order for the browser to parse a returned XML document, the Content-Type
 * header in the HTTP response must be set to "text/xml" or "application/xml".</em>
 * <p>
 * Example code:
 * <pre><code>
var Employee = Ext.data.Record.create([
   {name: 'name', mapping: 'name'},     // 如果名称相同就不需要"mapping"属性的啦"mapping" property not needed if it's the same as "name"
   {name: 'occupation'}                 // This field will use "occupation" as the mapping.
]);
var myReader = new Ext.data.XmlReader({
   totalRecords: "results", // 该属性是指定记录集的总数（可选的）。The element which contains the total dataset size (optional)
   record: "row",           // 该属性是指定包含所有行对象的数组。The repeated element which contains row information
   id: "id"                 // 该属性是指定每一个行对象中究竟哪一个是记录的ID字段（可选的）。The element within the row that provides an ID for the record (optional)
}, Employee);
</code></pre>
 * <p>
 * 将形成这种形式的XML文件：
 * This would consume an XML file like this:
 * <pre><code>
&lt;?xml version="1.0" encoding="UTF-8"?>
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
 * @cfg {String} totalRecords 记录集的总数的DomQuery查询路径。如果是需要分页的话该属性就必须指定。
 * The DomQuery path from which to retrieve the total number of records
 * in the dataset. This is only needed if the whole dataset is not passed in one go, but is being
 * paged from the remote server.
 * @cfg {String} record 指明一个DomQuery查询路径，指定包含所有行对象的信息。
 * The DomQuery path to the repeated element which contains record information.
 * @cfg {String} success 指明一个DomQuery查询路径用于定位表单的success属性。The DomQuery path to the success attribute used by forms.
 * @cfg {String} idPath 指明一个DomQuery查询路径，用于获取每一个行对象中究竟哪一个是记录的ID字段。The DomQuery path relative from the record element to the element that contains
 * a record identifier value.
 * @constructor 创建XmlReader对象。Create a new XmlReader.
 * @param {Object} meta 元数据配置参数。Metadata configuration options
 * @param {Object} recordType 既可以是字段的定义对象组成的数组，如{@link Ext.data.Record#create}那般，也可以是一个由
 * {@link Ext.data.Record#create}创建的{@link Ext.data.Record}对象。
 * Either an Array of field definition objects as passed to
 * {@link Ext.data.Record#create}, or a Record constructor object created using {@link Ext.data.Record#create}.
 */
Ext.data.XmlReader = function(meta, recordType){
    meta = meta || {};
    Ext.data.XmlReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};
Ext.extend(Ext.data.XmlReader, Ext.data.DataReader, {
    /**
     * 从远端服务器取得数据后，仅供DataProxy对象所使用的方法。
     * This method is only used by a DataProxy which has retrieved data from a remote server.
	 * @param {Object} response 包含可被解析的XML文档数据在<tt>responseXML</tt>属性中的XHR的对象。The XHR object which contains the parsed XML document.  The response is expected
	 * to contain a property called <tt>responseXML</tt> which refers to an XML document object.
     * @return {Object} records 给Ext.data.Store对象用的数据块，Ext.data.Records会用它作为缓存块。A data block which is used by an {@link Ext.data.Store} as
     * a cache of Ext.data.Records.
     */
    read : function(response){
        var doc = response.responseXML;
        if(!doc) {
            throw {message: "XmlReader.read: XML Document not available"};
        }
        return this.readRecords(doc);
    },

    /**
     * 由一个XML文档产生一个包含Ext.data.Records的对象块。
     * Create a data block containing Ext.data.Records from an XML document.
	 * @param {Object} doc 一个可被解析的XML文档。A parsed XML document.
     * @return {Object} records 给Ext.data.Store对象用的数据块，Ext.data.Records会用它作为缓存块。A data block which is used by an {@link Ext.data.Store} as
     * a cache of Ext.data.Records.
     */
    readRecords : function(doc){
        /**
         * 异步通信完毕和读取之后，保留原始XML文档数据以便将来由必要的用途。
         * After any data loads/reads, the raw XML Document is available for further custom processing.
         * @type XMLDocument
         */
        this.xmlData = doc;
        var root = doc.documentElement || doc;
    	var q = Ext.DomQuery;
    	var recordType = this.recordType, fields = recordType.prototype.fields;
    	var sid = this.meta.idPath || this.meta.id;
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
	            v = f.convert(v, n);
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