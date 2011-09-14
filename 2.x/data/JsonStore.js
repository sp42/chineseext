/**
 * @class Ext.data.JsonStore
 * @extends Ext.data.Store
 * 使得从远程JSON数据创建stores更为方便的简单辅助类。
 * JsonStore合成了{@link Ext.data.HttpProxy}与{@link Ext.data.JsonReader}两者。
 * 如果你需要其他类型的proxy或reader组合，那么你要创建以 {@link Ext.data.Store}为基类的配置。
 * <br/>
<pre><code>
var store = new Ext.data.JsonStore({
    url: 'get-images.php',
    root: 'images',
    fields: ['name', 'url', {name:'size', type: 'float'}, {name:'lastmod', type:'date'}]
});
</code></pre>
 *  形成这种形式的对象：
<pre><code>
{
    images: [
        {name: 'Image one', url:'/GetImage.php?id=1', size:46.5, lastmod: new Date(2007, 10, 29)},
        {name: 'Image Two', url:'/GetImage.php?id=2', size:43.2, lastmod: new Date(2007, 10, 30)}
    ]
}
</code></pre>
 * 这种形式的数据（对象实字，object literal）会用在 {@link #data}配置项上。
 * <b>注意：尽管未有列出，该类继承了Store对象、JsonReader对象的所有的配置项。</b>
 * @cfg {String} url  HttpProxy对象的URL地址。可以从这里指定，也可以从{@link #data}配置中指定。不能缺少。
 * @cfg {Object} data  能够被该对象所属的JsonReader解析的数据对象。可以从这里指定，也可以从{@link #url}配置中指定。不能缺少。
 * @cfg {Array} fields  既可以是字段的定义对象组成的数组，会作为{@link Ext.data.Record#create}方法的参数用途，也可以是一个
 * {@link Ext.data.Record Record}构造器，来给{@link Ext.data.Record#create}创建的{@link Ext.data.Record}对象
 * @constructor
 * @param {Object} config
 */
Ext.data.JsonStore = function(c){
    /**
     * @cfg {Ext.data.DataReader} reader @hide
     */
    /**
     * @cfg {Ext.data.DataProxy} proxy @hide
     */
    Ext.data.JsonStore.superclass.constructor.call(this, Ext.apply(c, {
        proxy: c.proxy || (!c.data ? new Ext.data.HttpProxy({url: c.url}) : undefined),
        reader: new Ext.data.JsonReader(c, c.fields)
    }));
};
Ext.extend(Ext.data.JsonStore, Ext.data.Store);