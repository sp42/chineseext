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
 * @class Ext.data.JsonWriter
 * @extends Ext.data.DataWriter
 * 这个DataWriter的子类相对于远程CRUD操作而言，这是一个在前端的初始化部分，负责写入单个或多个的{@link Ext.data.Record}对象。<br />
 * DataWriter extension for writing an array or single {@link Ext.data.Record} object(s) in preparation for executing a remote CRUD action.
 */
Ext.data.JsonWriter = function(config) {
    Ext.data.JsonWriter.superclass.constructor.call(this, config);

    // careful to respect "returnJson", renamed to "encode"
    // TODO: remove after Ext-3.0.1 release
    if (this.returnJson != undefined) {
        this.encode = this.returnJson;
    }
}
Ext.extend(Ext.data.JsonWriter, Ext.data.DataWriter, {
    /**
     * @cfg {Boolean} returnJson <b>Deprecated, will be removed in Ext-3.0.1</b>.  Use {@link Ext.data.JsonWriter#encode} instead.
     */
    returnJson : undefined,
    /**
     * @cfg {Boolean} encode 
     * <tt>true</tt>表示对{@link Ext.data.DataWriter#toHash 哈希数据}进行{@link Ext.util.JSON#encode 编码}。
     * 默认为<tt>true</tt>。当使用{@link Ext.data.DirectProxy}的时候，不同于Ext.Direct.JsonProvider有自己的JSON编码，所以该配置项要设置为<tt>false</tt>。
     * 此外，如果你使用的是{@link Ext.data.HttpProxy}，设置该项为<tt>false</tt>就会使得HttpProxy采用 {@link Ext.Ajax#request}配置参数的<b>jsonData</b>传输数据，而非<b>params</b>。
     * 当使用{@link Ext.data.Store#restful}的Store，一些服务端框架就会认为数据从jsonData的通道经过。如果采用这样的机制的话，应该让底层的连接对象完成编码的工作（如Ext.Ajax），把<b>encode: 设为<tt>false</tt></b>。
     * <br />
     * <tt>true</tt> to {@link Ext.util.JSON#encode encode} the
     * {@link Ext.data.DataWriter#toHash hashed data}. Defaults to <tt>true</tt>.  When using
     * {@link Ext.data.DirectProxy}, set this to <tt>false</tt> since Ext.Direct.JsonProvider will perform
     * its own json-encoding.  In addition, if you're using {@link Ext.data.HttpProxy}, setting to <tt>false</tt>
     * will cause HttpProxy to transmit data using the <b>jsonData</b> configuration-params of {@link Ext.Ajax#request}
     * instead of <b>params</b>.  When using a {@link Ext.data.Store#restful} Store, some serverside frameworks are
     * tuned to expect data through the jsonData mechanism.  In those cases, one will want to set <b>encode: <tt>false</tt></b>, as in
     * let the lower-level connection object (eg: Ext.Ajax) do the encoding.
     */
    encode : true,

    /**
     * 写事件的最后动作。将写入的数据对象添加到参数。
     * Final action of a write event.  Apply the written data-object to params.
     * @param {Object} params 要写入的参数对象。http params object to write-to.
     * @param {Object} baseParams Store定义的那个{@link Ext.data.Store#baseParams}，该参数必须由{@link Ext.data.JsonWriter}或{@link Ext.data.XmlWriter}进行编码。baseParams as defined by {@link Ext.data.Store#baseParams}.  The baseParms must be encoded by the extending class, eg: {@link Ext.data.JsonWriter}, {@link Ext.data.XmlWriter}.
     * @param {Object/Object[]} data 由Store推演过来的数据对象。Data-object representing compiled Store-recordset.
     */
    render : function(params, baseParams, data) {
        if (this.encode === true) {
            // Encode here now.
            Ext.apply(params, baseParams);
            params[this.meta.root] = Ext.encode(data);
        } else {
            // defer encoding for some other layer, probably in {@link Ext.Ajax#request}.  Place everything into "jsonData" key.
            var jdata = Ext.apply({}, baseParams);
            jdata[this.meta.root] = data;
            params.jsonData = jdata;
        }
    },
    /**
     * Implements abstract Ext.data.DataWriter#createRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    createRecord : function(rec) {
       return this.toHash(rec);
    },
    /**
     * Implements abstract Ext.data.DataWriter#updateRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    updateRecord : function(rec) {
        return this.toHash(rec);

    },
    /**
     * Implements abstract Ext.data.DataWriter#destroyRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    destroyRecord : function(rec) {
        return rec.id;
    }
});