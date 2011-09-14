/**
 * @class Ext.data.XmlReader
 * @extends Ext.data.DataReader
 * Data reader类接受一个XML文档响应结果后，创建一个由{@link Ext.data.Record}对象组成的数组，
 * 数组内的每个对象都是{@link Ext.data.Record}构造器负责映射（mappings）的结果。<br><br>
 * <p>
 * <em>注意:为了浏览器能成功解析返回来的XML document对象，HHTP Response的content-type 头必须被设成text/xml。</em>
 * <p>
 * 示例代码：
 * <pre><code>
var Employee = Ext.data.Record.create([
   {name: 'name', mapping: 'name'},     // 如果名称相同就不需要"mapping"属性的啦
   {name: 'occupation'}                 // 进行"occupation"的映射
]);
var myReader = new Ext.data.XmlReader({
    totalProperty: "results",             // 该属性是指定记录集的总数（可选的）
    root: "rows",                         // 该属性是指定包含所有行对象的数组
    id: "id"                              // 该属性是指定每一个行对象中究竟哪一个是记录的ID字段（可选的）
}, Employee);
</code></pre>
 * <p>
 *  形成这种形式的XML文件：
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
 * @cfg {String} record 指明一个DomQuery查询路径，指定包含所有行对象的信息
 * @cfg {String} success 指明一个DomQuery查询路径，The DomQuery path to the success attribute used by forms.
 * @cfg {String} id 指明一个DomQuery查询路径，用于获取每一个行对象中究竟哪一个是记录的ID字段（可选的）
 * @constructor
 * 创建XmlReader对象
 * @param {Object} meta 元数据配置参数
 * @param {Object} recordType 既可以是字段的定义对象组成的数组，如{@link Ext.data.Record#create}那般，也可以是一个由
 * {@link Ext.data.Record#create}创建的{@link Ext.data.Record}对象
 */
Ext.data.XmlReader = function(meta, recordType){
    meta = meta || {};
    Ext.data.XmlReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};
Ext.extend(Ext.data.XmlReader, Ext.data.DataReader, {
    /**
     * 从远端服务器取得数据后，仅供DataProxy对象所使用的方法。
     * @param {Object} response 包含可被解析的XML文档数据在<tt>responseXML</tt>属性中的XHR的对象
     * @return {Object} data 给Ext.data.Store对象用的数据块，Ext.data.Records会用它作为缓存
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
     * @param {Object} o 一个可被解析的XML文档
     * @return {Object} data 给Ext.data.Store对象用的数据块，Ext.data.Records会用它作为缓存
     */
    readRecords : function(doc){
        /**
         * 异步通信完毕和读取之后，保留原始XML文档数据以便将来由必要的用途。
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