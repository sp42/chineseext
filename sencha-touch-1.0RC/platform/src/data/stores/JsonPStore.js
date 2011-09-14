/*
 * @version Sencha 1.0RC-1
 * @ignore
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */
 
/**
 * @class Ext.data.JsonPStore
 * @extends Ext.data.Store
 * @ignore
 * @private
 * <p><b>NOTE:</b>该类需要迁移到新的API。 This class is in need of migration to the new API.</p>
 * <p>
 * 小型的辅助类使得创建跨域读取JSON数据的{@link Ext.data.Store}更来得容易。JsonPStore自动与{@link Ext.data.JsonReader}和{@link Ext.data.ScriptTagProxy ScriptTagProxy}进行配置。
 * Small helper class to make creating {@link Ext.data.Store}s from different domain JSON data easier.
 * A JsonPStore will be automatically configured with a {@link Ext.data.JsonReader} and a {@link Ext.data.ScriptTagProxy ScriptTagProxy}.</p>
 * <p>配置Store的例子如下：A store configuration would be something like:<pre><code>
var store = new Ext.data.JsonPStore({
    // store configs
    autoDestroy: true,
    storeId: 'myStore',

    // proxy configs
    url: 'get-images.php',

    // reader configs
    root: 'images',
    idProperty: 'name',
    fields: ['name', 'url', {name:'size', type: 'float'}, {name:'lastmod', type:'date'}]
});
 * </code></pre></p>
 * <p>该Store可以配置为读取下面对象的格式：This store is configured to consume a returned object of the form:<pre><code>
stcCallback({
    images: [
        {name: 'Image one', url:'/GetImage.php?id=1', size:46.5, lastmod: new Date(2007, 10, 29)},
        {name: 'Image Two', url:'/GetImage.php?id=2', size:43.2, lastmod: new Date(2007, 10, 30)}
    ]
})
 * </code></pre>
 * <p>stcCallback是回调函数的名称，需要在请求中指定。请参阅{@link Ext.data.ScriptTagProxy ScriptTagProxy}了解更多。Where stcCallback is the callback name passed in the request to the remote domain. See {@link Ext.data.ScriptTagProxy ScriptTagProxy}
 * for details of how this works.</p>
 * An object literal of this form could also be used as the {@link #data} config option.</p>
 * <p><b>注意*Note:</b>尽管没有列出，<b>{@link Ext.data.JsonReader JsonReader}</b>及<b>{@link Ext.data.ScriptTagProxy ScriptTagProxy}</b>的配置项对于该类同样也是适用的。<b>*Note:</b> Although not listed here, this class accepts all of the configuration options of
 * <b>{@link Ext.data.JsonReader JsonReader}</b> and <b>{@link Ext.data.ScriptTagProxy ScriptTagProxy}</b>.</p>
 * @constructor
 * @param {Object} config
 * @xtype jsonpstore
 */
Ext.data.JsonPStore = Ext.extend(Ext.data.Store, {
    /**
     * @cfg {Ext.data.DataReader} reader @hide
     */
    constructor: function(config) {
        Ext.data.JsonPStore.superclass.constructor.call(this, Ext.apply(config, {
            reader: new Ext.data.JsonReader(config),
            proxy : new Ext.data.ScriptTagProxy(config)
        }));
    }
});

Ext.reg('jsonpstore', Ext.data.JsonPStore);