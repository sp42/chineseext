/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=90 Ext中文站翻译小组
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
 * @class Ext.data.ArrayReader
 * @extends Ext.data.JsonReader
 * <p> 
 * Data reader透过一个数组而转化成为{@link Ext.data.Record}对象所组成的数组，数组内的每个元素就代表一行数据。
 * 字段定义中，通过使用下标来把字段抽取到Record对象，属性<em>mapping</em>用于指定下标，如果不指定就按照定义的先后顺序。<br />
 * Data reader class to create an Array of {@link Ext.data.Record} objects from an Array.
 * Each element of that Array represents a row of data fields. 
 * The fields are pulled into a Record object using as a subscript, the <em>mapping</em> property
 * of the field definition if it exists, or the field's ordinal position in the definition.<br>
 * </p>
 * 示例代码：
 * Example code:.
 * <pre><code>
var Employee = Ext.data.Record.create([
    {name: 'name', mapping: 1},        // 属性<em>mapping</em>用于指定下标 // "mapping" only needed if an "id" field is present which
    {name: 'occupation', mapping: 2}   // 如果不指定就按照定义的先后顺序 // precludes using the ordinal position as the index.
]);
var myReader = new Ext.data.ArrayReader({
    id: 0                 // 提供数组的下标位置存放记录的ID（可选的）    // The subscript within row Array that provides an ID for the Record (optional)
}, Employee);
</code></pre>
 * <p>
 * 形成这种形式的数组：This would consume an Array like this:
 * <pre><code>
[ [1, 'Bill', 'Gardener'], [2, 'Ben', 'Horticulturalist'] ]
  </code></pre>
 * @cfg {String} id （可选的）提供数组的下标位置存放记录的ID。(optional)The subscript within row Array that provides an ID for the Record
 * @constructor 创建一个ArrayReader对象。Create a new ArrayReader
 * @param {Object}  meta 元数据配置参数。Metadata configuration options.
 * @param {Object} recordType 既可以是字段的定义对象组成的数组，如{@link Ext.data.Record#create}那般，也可以是一个由
 * {@link Ext.data.Record#create}创建的{@link Ext.data.Record}对象。
 * Either an Array of field definition objects as specified to {@link Ext.data.Record#create},
 * or a {@link Ext.data.Record Record} constructor created using {@link Ext.data.Record#create}.
 */
Ext.data.ArrayReader = Ext.extend(Ext.data.JsonReader, {
    /**
     * 由一个数组产生一个包含Ext.data.Records的对象块。
     * Create a data block containing Ext.data.Records from an Array.
     * @param {Object} o 包含行对象的数组，就是记录集。An Array of row objects which represents the dataset.
     * @return {Object} 给Ext.data.Store对象用的数据块，Ext.data.Records会用它作为缓存。data A data block which is used by an Ext.data.Store object as
     * a cache of Ext.data.Records.
     */
    readRecords : function(o){
        this.arrayData = o;
        var s = this.meta;
        var sid = s ? (s.idIndex || s.id) : null;
    	var recordType = this.recordType, fields = recordType.prototype.fields;
    	var records = [];

        if(!this.getRoot){
            this.getRoot = s.root ? this.getJsonAccessor(s.root) : function(p){return p;};
            if(s.totalProperty) {
                this.getTotal = this.getJsonAccessor(s.totalProperty);
            }
        }

        var root = this.getRoot(o);

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

        var totalRecords = records.length;

        if(s.totalProperty){
            var v = parseInt(this.getTotal(o), 10);
            if(!isNaN(v)){
                totalRecords = v;
            }
        }

        return {
	        records : records,
	        totalRecords : totalRecords
	    };
    }
});