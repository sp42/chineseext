/**
 * @class Ext.data.JsonReader
 * @extends Ext.data.DataReader
 * Data reader类接受一个JSON响应结果后，创建一个由{@link Ext.data.Record}对象组成的数组，
 * 数组内的每个对象都是{@link Ext.data.Record}构造器负责映射（mappings）的结果。
 * <br>
 * <p>
 * 示例代码：
 * <pre><code>
var Employee = Ext.data.Record.create([
    {name: 'firstname'},                  // 映射了Record的"firstname" 字段为行对象的同名键名称
    {name: 'job', mapping: 'occupation'}  // 映射了"job"字段为行对象的"occupation"键
]);
var myReader = new Ext.data.JsonReader({
    totalProperty: "results",             // 该属性是指定记录集的总数（可选的）
    root: "rows",                         // 该属性是指定包含所有行对象的数组
    id: "id"                              // 该属性是指定每一个行对象中究竟哪一个是记录的ID字段（可选的）
}, Employee);
</code></pre>
 * <p>
 * 形成这种形式的JSON对象：
 * <pre><code>
{
    results: 2,
    rows: [
        { id: 1, firstname: 'Bill', occupation: 'Gardener' },         // 行对象
        { id: 2, firstname: 'Ben' , occupation: 'Horticulturalist' }  // 另外一个行对象
    ]
}
</code></pre>
 * <p>
 * 随时都可以改变JsonReader的元数据，只要在数据对象中放置一个<b><tt>metaData</tt></b>的属性。
 * 一旦将该属性对象检测出来，就会触发Reader所使用的{@link Ext.data.Store Store}对象身上的{@link Ext.data.Store#metachange metachange}事件。</p>
 * <p>属性<b><tt>metaData</tt></b>可包含任何为该类服务的配置选项。
 * 还可以包含<b><tt>fields</tt></b>的属性，会给JsonReader用作{@link Ext.data.Record#create}的参数，以便配置所产生的Records布局。<p>
 * 配合使用<b><tt>metaData</tt></b>属性，和Store的{@link Ext.data.Store#metachange metachange}事件，
 * 就可产生“基于Store”控制的自我初始化。
 * metachange的处理函数会解析<b><tt>metaData</tt></b>属性（包含了任意的用户制定属性）来执行所需的配置操作，
 * 当然还有用于定义字段的<b><tt>metaData.fields</tt></b>数组。</p>
 * <p>
 * 要创建无须好像上一例那样配置的Record构造器的JsonReader对象，你可以采取这样的机制：
 * </p><pre><code>
var myReader = new Ext.data.JsonReader();
</code></pre>
 * <p>
 * 可由数据库返回reader所需的配置信息，叫做metaData属性，只需要在第一次请求的时候返回便可，而且metaData属性可以实际数据并列放在一起：
 * </p><pre><code>
{
    metaData: {
        totalProperty: 'results',
        root: 'rows',
        id: 'id',
        fields: [
            {name: 'name'},
            {name: 'occupation'}
        ]
    },
    results: 2,
    rows: [
        { 'id': 1, 'name': 'Bill', occupation: 'Gardener' },
        { 'id': 2, 'name': 'Ben', occupation: 'Horticulturalist' }
    ]
}
</code></pre>
 * @cfg {String} totalProperty 记录集的总数的属性名称。如果是需要分页的话该属性就必须指定。
 * @cfg {String} successProperty Name of the property from which to retrieve the success attribute used by forms.
 * @cfg {String} root 指定包含所有行对象的数组
 * @cfg {String} id 指定每一个行对象中究竟哪一个是记录的ID字段（可选的）
 * @constructor
 * 创建JsonReader对象
 * @param {Object} meta 元数据配置参数
 * @param {Object} recordType 既可以是字段的定义对象组成的数组，如{@link Ext.data.Record#create}那般，也可以是一个由
 * {@link Ext.data.Record#create}创建的{@link Ext.data.Record}对象
 */
Ext.data.JsonReader = function(meta, recordType){
    meta = meta || {};
    Ext.data.JsonReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};
Ext.extend(Ext.data.JsonReader, Ext.data.DataReader, {
    /**
     * 送入到构造器的JsonReader的元数据，或由数据包携带的<b><tt>metaData</tt></b>属性。
     * @type Mixed
     * @property meta
     */
    /**
     * 从远端服务器取得数据后，仅供DataProxy对象所使用的方法。
     * @param {Object} response 包含JSON的数据在responseText属性的XHR的对象
     * @return {Object} data 给Ext.data.Store对象用的数据块，Ext.data.Records会用它作为缓存
     */
    read : function(response){
        var json = response.responseText;
        var o = eval("("+json+")");
        if(!o) {
            throw {message: "JsonReader.read: Json object not found"};
        }
        return this.readRecords(o);
    },

    // private function a store will implement
    onMetaChange : function(meta, recordType, o){

    },

    /**
	 * @ignore
	 */
    simpleAccess: function(obj, subsc) {
    	return obj[subsc];
    },

	/**
	 * @ignore
	 */
    getJsonAccessor: function(){
        var re = /[\[\.]/;
        return function(expr) {
            try {
                return(re.test(expr))
                    ? new Function("obj", "return obj." + expr)
                    : function(obj){
                        return obj[expr];
                    };
            } catch(e){}
            return Ext.emptyFn;
        };
    }(),

    /**
     * 由一个JSON对象产生一个包含Ext.data.Records的对象块。
     * @param {Object} o 该对象包含以下属性：root指定包含所有行对象的数组；totalProperty制定了记录集的总数的属性名称（可选的）
     * @return {Object} data 给Ext.data.Store对象用的数据块，Ext.data.Records会用它作为缓存
     */
    readRecords : function(o){
        /**
         * 异步通信完毕后，保留原始JSON数据以便将来由必要的用途。如果没有数据加载，那么会抛出一个load异常，该属性为undefined。
         * @type Object
         */
        this.jsonData = o;
        if(o.metaData){
            delete this.ef;
            this.meta = o.metaData;
            this.recordType = Ext.data.Record.create(o.metaData.fields);
            this.onMetaChange(this.meta, this.recordType, o);
        }
        var s = this.meta, Record = this.recordType,
            f = Record.prototype.fields, fi = f.items, fl = f.length;

//      Generate extraction functions for the totalProperty, the root, the id, and for each field
        if (!this.ef) {
            if(s.totalProperty) {
	            this.getTotal = this.getJsonAccessor(s.totalProperty);
	        }
	        if(s.successProperty) {
	            this.getSuccess = this.getJsonAccessor(s.successProperty);
	        }
	        this.getRoot = s.root ? this.getJsonAccessor(s.root) : function(p){return p;};
	        if (s.id) {
	        	var g = this.getJsonAccessor(s.id);
	        	this.getId = function(rec) {
	        		var r = g(rec);
		        	return (r === undefined || r === "") ? null : r;
	        	};
	        } else {
	        	this.getId = function(){return null;};
	        }
            this.ef = [];
            for(var i = 0; i < fl; i++){
                f = fi[i];
                var map = (f.mapping !== undefined && f.mapping !== null) ? f.mapping : f.name;
                this.ef[i] = this.getJsonAccessor(map);
            }
        }

    	var root = this.getRoot(o), c = root.length, totalRecords = c, success = true;
    	if(s.totalProperty){
            var v = parseInt(this.getTotal(o), 10);
            if(!isNaN(v)){
                totalRecords = v;
            }
        }
        if(s.successProperty){
            var v = this.getSuccess(o);
            if(v === false || v === 'false'){
                success = false;
            }
        }
        var records = [];
	    for(var i = 0; i < c; i++){
		    var n = root[i];
	        var values = {};
	        var id = this.getId(n);
	        for(var j = 0; j < fl; j++){
	            f = fi[j];
                var v = this.ef[j](n);
                values[f.name] = f.convert((v !== undefined) ? v : f.defaultValue, n);
	        }
	        var record = new Record(values, id);
	        record.json = n;
	        records[i] = record;
	    }
	    return {
	        success : success,
	        records : records,
	        totalRecords : totalRecords
	    };
    }
});