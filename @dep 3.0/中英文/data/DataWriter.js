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
 * @class Ext.data.DataWriter
 * <p>
 * Ext.data.DataWriter提供了增、删、改、查的实现让Ext.data.Store与服务端框架密切通讯。
 * Writer控制了Store了自动管理AJAX的请求，让其成为Store CRUD操作的管道。
 * <br />
 * Ext.data.DataWriter facilitates create, update, and destroy actions between
 * an Ext.data.Store and a server-side framework. A Writer enabled Store will
 * automatically manage the Ajax requests to perform CRUD actions on a Store.</p>
 * <p>
 * Ext.data.DataWriter是一个抽象类，一般用于让来被继承。例如{@link Ext.data.JsonWriter}。
 * <br />
 * Ext.data.DataWriter is an abstract base class which is intended to be extended
 * and should not be created directly. For existing implementations, see
 * {@link Ext.data.JsonWriter}.</p>
 * <p>创建一个Writer很简单：Creating a writer is simple:</p>
 * <pre><code>
var writer = new Ext.data.JsonWriter();
 * </code></pre>
 * <p>通过proxy对象激活Store对象来控制writer，也就是配置一个<code>url</code>：<br />The proxy for a writer enabled store can be configured with a simple <code>url</code>:</p>
 * <pre><code>
// Create a standard HttpProxy instance.
var proxy = new Ext.data.HttpProxy({
    url: 'app.php/users'
});
 * </code></pre>
 * <p>
 * 对于更细颗粒的控制，proxy也可配置成为 <code>api</code>：
 * For finer grained control, the proxy may also be configured with an <code>api</code>:</p>
 * <pre><code>
// Use the api specification 用API指定
var proxy = new Ext.data.HttpProxy({
    api: {
        read    : 'app.php/users/read',
        create  : 'app.php/users/create',
        update  : 'app.php/users/update',
        destroy : 'app.php/users/destroy'
    }
});
 * </code></pre>
 * <p>创建Writer控制的Store的：Creating a Writer enabled store:</p>
 * <pre><code>
var store = new Ext.data.Store({
    proxy: proxy,
    reader: reader,
    writer: writer
});
 * </code></pre>
 * @constructor 创建一个新的DataWriter。Create a new DataWriter
 * @param {Object} meta 配置选项的元数据（由实现指定）Metadata configuration options (implementation-specific)
 * @param {Object} recordType {@link Ext.data.Record#create}规定的对象数组，或是用{@link Ext.data.Record#create}生成的{@link Ext.data.Record}对象。Either an Array of field definition objects as specified
 * in {@link Ext.data.Record#create}, or an {@link Ext.data.Record} object created
 * using {@link Ext.data.Record#create}.
 */
Ext.data.DataWriter = function(config){
    /**
     * This DataWriter's configured metadata as passed to the constructor.
     * @type Mixed
     * @property meta
     */
    Ext.apply(this, config);
};

Ext.data.DataWriter.prototype = {

    /**
     * @cfg {Boolean} writeAllFields
     * 默认是<tt>false</tt>。设为<tt>true</tt>的话，就表示让DataWriter返回所有那个记录的所有字段，不仅仅是修改的那些字段。<br />
     * <tt>true</tt>就是记录那些修改的字段而已。<br />
     * <tt>false</tt> by default.  Set <tt>true</tt> to have DataWriter return ALL fields of a modified
     * record -- not just those that changed.
     * <tt>false</tt> to have DataWriter only request modified fields from a record.
     */
    writeAllFields : false,
    /**
     * @cfg {Boolean} listful
     * 默认是<tt>false</tt>。设为<tt>true</tt>的话，就表示DataWriter写入HTTP参数的时候总是一数组，即使单个记录也如是。<br />
     * <tt>false</tt> by default.  Set <tt>true</tt> to have the DataWriter <b>always</b> write HTTP params as a list,
     * even when acting upon a single record.
     */
    listful : false,    // <-- listful is actually not used internally here in DataWriter.  @see Ext.data.Store#execute.

    /**
     * 服务端写操作的前期写数据。只需要有DataWriter#update、DataWriter#create、DataWriter#destroy的proxy就可以囊括“写”的操作。<br />
     * Writes data in preparation for server-write action.  Simply proxies to DataWriter#update, DataWriter#create
     * DataWriter#destroy.
     * @param {String} action [CREATE|UPDATE|DESTROY]
     * @param {Object} params 写入的hash参数。The params-hash to write-to
     * @param {Record/Record[]} rs 要写的数据。The recordset write.
     */
    write : function(action, params, rs) {
        this.render(action, rs, params, this[action](rs));
    },

    /**
     * 抽象的方法，应该由DataWriter的子类提供，扩展子类时重写该方法就可以使用参数“data”和“params”。
     * 送抵的数据对象会依据用户在DataReader配置的元数据信息产生真正的渲染数据。<br />
     * abstract method meant to be overridden by all DataWriter extensions.  It's the extension's job to apply the "data" to the "params".
     * The data-object provided to render is populated with data according to the meta-info defined in the user's DataReader config,
     * @param {String} action [Ext.data.Api.actions.create|read|update|destroy]
     * @param {Record[]} rs Store数据集。Store recordset
     * @param {Object} params 发送到服务器的HTTP参数。Http params to be sent to server.
     * @param {Object} data 依据DataReader元数据产生的数据对象。data object populated according to DataReader meta-data.
     */
    render : Ext.emptyFn,

    /**
     * update
     * @param {Object} p 应用于结果的hash参数。Params-hash to apply result to.
     * @param {Record/Record[]} rs 写入的记录。Record(s) to write
     * @private
     */
    update : function(rs) {
        var params = {};
        if (Ext.isArray(rs)) {
            var data = [],
                ids = [];
            Ext.each(rs, function(val){
                ids.push(val.id);
                data.push(this.updateRecord(val));
            }, this);
            params[this.meta.idProperty] = ids;
            params[this.meta.root] = data;
        }
        else if (rs instanceof Ext.data.Record) {
            params[this.meta.idProperty] = rs.id;
            params[this.meta.root] = this.updateRecord(rs);
        }
        return params;
    },

    /**
     * @cfg {Function} saveRecord 抽象的方法，应该由子类提供，如{@link Ext.data.JsonWriter#saveRecord JsonWriter.saveRecord}。Abstract method that should be implemented in all subclasses
     * (e.g.: {@link Ext.data.JsonWriter#saveRecord JsonWriter.saveRecord}
     */
    updateRecord : Ext.emptyFn,

    /**
     * create
     * @param {Object} p 应用于结果的hash参数。Params-hash to apply result to.
     * @param {Record/Record[]} rs 写入的记录。Record(s) to write
     * @private
     */
    create : function(rs) {
        var params = {};
        if (Ext.isArray(rs)) {
            var data = [];
            Ext.each(rs, function(val){
                data.push(this.createRecord(val));
            }, this);
            params[this.meta.root] = data;
        }
        else if (rs instanceof Ext.data.Record) {
            params[this.meta.root] = this.createRecord(rs);
        }
        return params;
    },

    /**
     * @cfg {Function} createRecord 抽象的方法，应该由子类提供，如{@link Ext.data.JsonWriter#createRecord JsonWriter.createRecord}。Abstract method that should be implemented in all subclasses
     * (e.g.: {@link Ext.data.JsonWriter#createRecord JsonWriter.createRecord})
     */
    createRecord : Ext.emptyFn,

    /**
     * destroy
     * @param {Object} p 应用于结果的hash参数。Params-hash to apply result to.
     * @param {Record/Record[]} rs 写入的记录。Record(s) to write
     * @private
     */
    destroy : function(rs) {
        var params = {};
        if (Ext.isArray(rs)) {
            var data = [],
                ids = [];
            Ext.each(rs, function(val){
                data.push(this.destroyRecord(val));
            }, this);
            params[this.meta.root] = data;
        } else if (rs instanceof Ext.data.Record) {
            params[this.meta.root] = this.destroyRecord(rs);
        }
        return params;
    },

    /**
     * @cfg {Function} destroyRecord 抽象的方法，应该由子类提供，如{@link Ext.data.JsonWriter#destroyRecord JsonWriter.destroyRecord}。Abstract method that should be implemented in all subclasses
     * (e.g.: {@link Ext.data.JsonWriter#destroyRecord JsonWriter.destroyRecord})
     */
    destroyRecord : Ext.emptyFn,

    /**
     * 转换Recod为hash。Converts a Record to a hash
     * @param {Record} record 记录
     * @private
     */
    toHash : function(rec) {
        var map = rec.fields.map,
            data = {},
            raw = (this.writeAllFields === false && rec.phantom === false) ? rec.getChanges() : rec.data,
            m;
        Ext.iterate(raw, function(prop, value){
            if((m = map[prop])){
                data[m.mapping ? m.mapping : m.name] = value;
            }
        });
        data[this.meta.idProperty] = rec.id;
        return data;
    }
};