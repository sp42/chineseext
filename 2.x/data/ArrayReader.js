/**
 * @class Ext.data.ArrayReader
 * @extends Ext.data.JsonReader
 * 这个Data reader透过一个数组的数据转化为{@link Ext.data.Record}对象组成的数组，
 * 数组内的每个元素代表一行数据。通过使用下标来把字段抽取到Record对象，
 * 字段定义中，属性<em>mapping</em>用于指定下标，如果不指定就按照定义的先后顺序。
 * <br>
 * <p>
 * 示例代码：
 * <pre><code>
var Employee = Ext.data.Record.create([
    {name: 'name', mapping: 1},         // 属性<em>mapping</em>用于指定下标
    {name: 'occupation', mapping: 2}    // 如果不指定就按照定义的先后顺序
]);
var myReader = new Ext.data.ArrayReader({
    id: 0                     // 提供数组的下标位置存放记录的ID（可选的）
}, Employee);
</code></pre>
 * <p>
 * 形成这种形式的数组：
 * <pre><code>
[ [1, 'Bill', 'Gardener'], [2, 'Ben', 'Horticulturalist'] ]
  </code></pre>
 * @cfg {String} id 提供数组的下标位置存放记录的ID（可选的）
 * @constructor
 * 创建一个ArrayReader对象
 * @param {Object} meta 元数据配置参数
 * @param {Object} recordType 既可以是字段的定义对象组成的数组，如{@link Ext.data.Record#create}那般，也可以是一个由
 * {@link Ext.data.Record#create}创建的{@link Ext.data.Record}对象
 */
Ext.data.ArrayReader = Ext.extend(Ext.data.JsonReader, {
    /**
     * 由一个数组产生一个包含Ext.data.Records的对象块。
     * @param {Object} o 包含行对象的数组，就是记录集
     * @return {Object} data 给Ext.data.Store对象用的数据块，Ext.data.Records会用它作为缓存
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
                v = f.convert(v, n);
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