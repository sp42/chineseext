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
 * @author Ed Spencer
 * @class Ext.data.JsonStore
 * @extends Ext.data.Store
 * @ignore
 * 
 * <p>
 * 小型的辅助类使得转化JSON为{@link Ext.data.Store}更来得容易。ArrayStore自动与{@link Ext.data.JsonReader}进行配置。
 * Small helper class to make creating {@link Ext.data.Store}s from JSON data easier.
 * A JsonStore will be automatically configured with a {@link Ext.data.JsonReader}.</p>
 * 
 * <p>配置Store的例子如下：A store configuration would be something like:</p>
 * 
<pre><code>
var store = new Ext.data.JsonStore({
    // store configs
    autoDestroy: true,
    storeId: 'myStore'
    
    proxy: {
        type: 'ajax',
        url: 'get-images.php',
        reader: {
            type: 'json',
            root: 'images',
            idProperty: 'name'
        }
    },
    
    // 可选的，也可以指定{@link Ext.data.Model}名称，请参阅{@link Ext.data.Store}的例子。alternatively, a {@link Ext.data.Model} name can be given (see {@link Ext.data.Store} for an example)
    fields: ['name', 'url', {name:'size', type: 'float'}, {name:'lastmod', type:'date'}]
});
</code></pre>
 * 
 * <p>样本数据如下：This store is configured to consume a returned object of the form:<pre><code>
{
    images: [
        {name: 'Image one', url:'/GetImage.php?id=1', size:46.5, lastmod: new Date(2007, 10, 29)},
        {name: 'Image Two', url:'/GetImage.php?id=2', size:43.2, lastmod: new Date(2007, 10, 30)}
    ]
}
</code></pre>
 * 
 * <p>如果传入字面化对象，就要指定{@link #data}是哪一个属性。An object literal of this form could also be used as the {@link #data} config option.</p>
 * 
 * @constructor
 * @param {Object} config
 * @xtype jsonstore
 */
Ext.data.JsonStore = Ext.extend(Ext.data.Store, {
    /**
     * @cfg {Ext.data.DataReader} reader @hide
     */
    constructor: function(config) {
        config = config || {};
              
        Ext.applyIf(config, {
            proxy: {
                type  : 'ajax',
                reader: 'json',
                writer: 'json'
            }
        });
        
        Ext.data.JsonStore.superclass.constructor.call(this, config);
    }
});

Ext.reg('jsonstore', Ext.data.JsonStore);