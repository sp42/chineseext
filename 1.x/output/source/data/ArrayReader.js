/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.data.ArrayReader
 * @extends Ext.data.DataReader
 * Data reader class to create an Array of Ext.data.Record objects from an Array.
 * Each element of that Array represents a row of data fields. The
 * fields are pulled into a Record object using as a subscript, the <em>mapping</em> property
 * of the field definition if it exists, or the field's ordinal position in the definition.<br>
 * <p>
 * 数组读到器,继承数据读取器
 * 该类作用是将一个数组(该数组中的每个元素代表着一行数据字段,字段被放到Record对象中作为子脚本使用)转换成
 * Ext.data.Record的对象数组,字段定义的mapping属性如果存在.或字段在定义中的原始位置
 * 
 * Example code:.
 * <pre><code>
var RecordDef = Ext.data.Record.create([
    {name: 'name', mapping: 1},         // "mapping" only needed if an "id" field is present which
    {name: 'occupation', mapping: 2}    // precludes using the ordinal position as the index.
]); //"mapping"仅当有"id"字段出现时(排除了使用原始位置作为索引)需要
var myReader = new Ext.data.ArrayReader({
    id: 0                     // The subscript within row Array that provides an ID for the Record (optional)
}, RecordDef);                //下面的行数组内提供了该记录的id
</code></pre>
 * <p>
 * This would consume an Array like this:
 * <pre><code>
[ [1, 'Bill', 'Gardener'], [2, 'Ben', 'Horticulturalist'] ]
  </code></pre>
 * @cfg {String} id (optional) The subscript within row Array that provides an ID for the Record
 * @constructor
 * Create a new JsonReader
 * @param {Object} meta Metadata configuration options.
 * @param {Object} recordType Either an Array of field definition objects
 * as specified to {@link Ext.data.Record#create},
 * or an {@link Ext.data.Record} object
 * created using {@link Ext.data.Record#create}.
 */
 /*
 * @cfg {String} id (可选项) 下面的行数组内提供了该记录的id
 * @构建器
 * 创建一新的JsonReader
 * @param {Object} meta 元数据配置项.
 * @param {Object} recordType 既是一字段的字义指定对象的数组,又是通过Ext.data.Record的create方法创建的Ext.data.Record对象
 */
Ext.data.ArrayReader = function(meta, recordType){
    Ext.data.ArrayReader.superclass.constructor.call(this, meta, recordType);
};

Ext.extend(Ext.data.ArrayReader, Ext.data.JsonReader, {
    /**
     * Create a data block containing Ext.data.Records from an XML document.
     * @param {Object} o An Array of row objects which represents the dataset.
     * @return {Object} data A data block which is used by an Ext.data.Store object as
     * a cache of Ext.data.Records.
     */
	  /**
     * 从xml document创建一包含Ext.data.Records的数据块
     * @param {Object} o 一代表着数据集的行对象数组
     * @return {Object} data 被Ext.data.Store对象当作Ext.data.Records 缓存的数据块
     */
    readRecords : function(o){
        var sid = this.meta ? this.meta.id : null;
    	var recordType = this.recordType, fields = recordType.prototype.fields;
    	var records = [];
    	var root = o;
	    for(var i = 0; i < root.length; i++){
		    var n = root[i];
	        var values = {};
	        var id = ((sid || sid === 0) && n[sid] !== undefined && n[sid] !== "" ? n[sid] : null);
	        for(var j = 0, jlen = fields.length; j < jlen; j++){
                var f = fields.items[j];
                var k = f.mapping !== undefined && f.mapping !== null ? f.mapping : j;
                var v = n[k] !== undefined ? n[k] : f.defaultValue;
                v = f.convert(v);
                values[f.name] = v;
            }
	        var record = new recordType(values, id);
	        record.json = n;
	        records[records.length] = record;
	    }
	    return {
	        records : records,
	        totalRecords : records.length
	    };
    }
});