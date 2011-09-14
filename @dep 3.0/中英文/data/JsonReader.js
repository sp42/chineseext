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
 * @class Ext.data.JsonReader
 * @extends Ext.data.DataReader
 * Data reader类接受一个JSON响应结果后，创建一个由{@link Ext.data.Record}对象组成的数组，数组内的每个对象都是{@link Ext.data.Record}构造器负责映射（mappings）的结果。<br />
 * Data reader class to create an Array of {@link Ext.data.Record} objects from a JSON response
 * based on mappings in a provided {@link Ext.data.Record} constructor.<br>
 * <p>
 * 示例代码：Example code:
 * <pre><code>
var Employee = Ext.data.Record.create([
    {name: 'firstname'},                  // 映射了Record的"firstname" 字段为行对象的同名键名称 map the Record's "firstname" field to the row object's key of the same name
    {name: 'job', mapping: 'occupation'}  // 映射了"job"字段为行对象的"occupation"键 map the Record's "job" field to the row object's "occupation" key
]);
var myReader = new Ext.data.JsonReader(
    {                             // metadata元数据属性，有以下的属性：The metadata property, with configuration options:
        totalProperty: "results", //   该属性是指定记录集的总数（可选的）the property which contains the total dataset size (optional)
        root: "rows",             //   该属性是指定包含所有行对象的数组the property which contains an Array of row objects
        idProperty: "id"          //   该属性是指定每一个行对象中究竟哪一个是记录的ID字段（可选的）the property within each row object that provides an ID for the record (optional)
    },
    Employee  // {@link Ext.data.Record}构造器是提供JSON对象的映射。{@link Ext.data.Record} constructor that provides mapping for JSON object
);
</code></pre>
 * <p>形成这种形式的JSON对象：<br />This would consume a JSON data object of the form:</p><pre><code>
{
    results: 2,  // 对应Reader对象total属性。的Reader's configured totalProperty
    rows: [      // 对应Reader对象root属性。Reader's configured root
        { id: 1, firstname: 'Bill', occupation: 'Gardener' },         // 一行对象 a row object
        { id: 2, firstname: 'Ben' , occupation: 'Horticulturalist' }  // 另外的行对象 another row object
    ]
}
</code></pre>
 * <p><b><u>使用metaData自动配置。 <br />Automatic configuration using metaData</u></b>
 * <p>
 * 随时都可以改变JsonReader的元数据，只要在数据对象中放置一个<b><tt>metaData</tt></b>的属性。
 * 一旦将该属性对象检测出来，就会触发Reader所使用的{@link Ext.data.Store Store}对象身上的{@link Ext.data.Store#metachange metachange}事件。
 * Metachange事件的处理函数在重新进行配置之时会处理<b><tt>metaData</tt></b>属性。
 * 注意重新配置Store有可能会引发不存在的Fields或Records变为无效。<br />
 * It is possible to change a JsonReader's metadata at any time by including a <b><tt>metaData</tt></b>
 * property in the JSON data object. 
 * If the JSON data object has a <b><tt>metaData</tt></b> property, a
 * {@link Ext.data.Store Store} object using this Reader will reconfigure itself to use the newly provided
 * field definition and fire its {@link Ext.data.Store#metachange metachange} event. 
 * The metachange event
 * handler may interrogate the <b><tt>metaData</tt></b> property to perform any configuration required. 
 * Note that reconfiguring a Store potentially invalidates objects which may refer to Fields or Records
 * which no longer exist.</p>
 * 
 * <p>
 * JSON数据对象其中包含的<b><tt>metaData</tt></b>属性有：
 * The <b><tt>metaData</tt></b> property in the JSON data object may contain:</p>
 * 
 * <div class="mdetail-params"><ul>
 * <li>
 * 任何为该类服务的配置选项。<br />
 * any of the configuration options for this class</li>
 * 
 * <li>
 * <b><tt>{@link Ext.data.Record#fields fields}</tt></b>的属性，会给JsonReader用作{@link Ext.data.Record#create data 产生Record方法}的参数，以便配置所产生的Records布局。<br />
 * a <b><tt>{@link Ext.data.Record#fields fields}</tt></b> property which the JsonReader will
 * use as an argument to the {@link Ext.data.Record#create data Record create method} in order to
 * configure the layout of the Records it will produce.</li>
 * 
 * <li>
 * JsonReader设置{@link Ext.data.Store}的{@link Ext.data.Store#sortInfo sortInfo}属性所使用的b><tt>{@link Ext.data.Store#sortInfo sortInfo}</tt></b>。
 * a <b><tt>{@link Ext.data.Store#sortInfo sortInfo}</tt></b> property which the JsonReader will
 * use to set the {@link Ext.data.Store}'s {@link Ext.data.Store#sortInfo sortInfo} property</li>  
 * <li>
 * 任何需要的用户自定义属性。<br />
 * any user-defined properties needed</li>
 * </ul></div>
 * 
 * <p>
 * 要创建无须好像上一例那样配置的Record构造器的JsonReader对象，你可以采取这样的机制：<br />
 * To use this facility to send the same data as the example above (without having to code the creation
 * of the Record constructor), you would create the JsonReader like this:</p>
 * <pre><code>
var myReader = new Ext.data.JsonReader();
</code></pre>

 * <p>
 * 可由数据库返回reader所需的配置信息，叫做metaData属性，只需要在第一次请求的时候返回便可，而且metaData属性可以实际数据并列放在一起：<br />
 * The first data packet from the server would configure the reader by containing a
 * <b><tt>metaData</tt></b> property <b>and</b> the data. For example, the JSON data object might take
 * the form:</p>
<pre><code>
{
    metaData: {
        idProperty: 'id',
        root: 'rows',
        totalProperty: 'results',
        fields: [
            {name: 'name'},
            {name: 'job', mapping: 'occupation'}
        ],
        sortInfo: {field: 'name', direction:'ASC'}, // used by store to set its sortInfo
        foo: 'bar' // custom property
    },
    results: 2,
    rows: [
        { 'id': 1, 'name': 'Bill', occupation: 'Gardener' },
        { 'id': 2, 'name': 'Ben', occupation: 'Horticulturalist' }
    ]
}
</code></pre> 
 * @cfg {String} totalProperty 记录集的总数的属性名称。如果是需要分页的话该属性就必须指定。 
 * Name of the property from which to retrieve the total number of records
 * in the dataset. This is only needed if the whole dataset is not passed in one go, but is being
 * paged from the remote server.
 * @cfg {String} successProperty 指定包含所有行对象的数组。
 * Name of the property from which to retrieve the success attribute used by forms.
 * @cfg {String} root 放置行对象数组的属性名称。
 * name of the property which contains the Array of row objects.
 * @cfg {String} idProperty 指定每一个行对象中究竟哪一个是记录的ID字段（可选的）。
 * Name of the property within a row object that contains a record identifier value.
 * @constructor 创建一个新的JsonReader对象。Create a new JsonReader
 * @param {Object} meta 元数据配置参数。Metadata configuration options.
 * @param {Object} recordType 既可以是字段的定义对象组成的数组，如{@link Ext.data.Record#create}那般，也可以是一个由{@link Ext.data.Record#create}创建的{@link Ext.data.Record}对象。 
 * Either an Array of field definition objects as passed to {@link Ext.data.Record#create}, or a {@link Ext.data.Record Record} constructor created using {@link Ext.data.Record#create}.
 */
Ext.data.JsonReader = function(meta, recordType){
    meta = meta || {};
    Ext.data.JsonReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};
Ext.extend(Ext.data.JsonReader, Ext.data.DataReader, {
    /**
     * 送入到构造器的JsonReader的元数据，或由数据包携带的<b><tt>metaData</tt></b>属性。 
     * This JsonReader's metadata as passed to the constructor, or as passed in
     * the last data packet's <b><tt>metaData</tt></b> property.
     * @type Mixed
     * @property meta
     */
    /**
     * 从远端服务器取得数据后，仅供DataProxy对象所使用的方法。
     * This method is only used by a DataProxy which has retrieved data from a remote server.
     * @param {Object} response 包含JSON的数据在responseText属性的XHR的对象。The XHR object which contains the JSON data in its responseText.
     * @return {Object} data 给Ext.data.Store对象用的数据块，Ext.data.Records会用它作为缓存。A data block which is used by an Ext.data.Store object as
     * a cache of Ext.data.Records.
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
     * Create a data block containing Ext.data.Records from a JSON object.
     * @param {Object} o 该对象包含以下属性：root指定包含所有行对象的数组；totalProperty制定了记录集的总数的属性名称（可选的）。
     * An object which contains an Array of row objects in the property specified
     * in the config as 'root, and optionally a property, specified in the config as 'totalProperty'
     * which contains the total size of the dataset.
     * @return {Object} 给Ext.data.Store对象用的数据块，Ext.data.Records会用它作为缓存。data A data block which is used by an Ext.data.Store object as
     * a cache of Ext.data.Records.
     */
    readRecords : function(o){
        /**
         * 异步通信完毕后，保留原始JSON数据以便将来有必要的用途。如果没有数据加载，那么会抛出一个load异常，该属性为undefined。
         * After any data loads, the raw JSON data is available for further custom processing.  If no data is
         * loaded or there is a load exception this property will be undefined.
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
            if (s.id || s.idProperty) {
                var g = this.getJsonAccessor(s.id || s.idProperty);
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