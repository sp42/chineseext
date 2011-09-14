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
 * @class Ext.data.JsonStore
 * @extends Ext.data.Store
 * 使得从远程JSON数据创建stores更为方便的简单辅助类。
 * JsonStore合成了{@link Ext.data.HttpProxy}与{@link Ext.data.JsonReader}两者。
 * 如果你需要其他类型的proxy或reader组合，那么你要创建以{@link Ext.data.Store}为基类的配置。<br />
 * Small helper class to make creating Stores for remotely-loaded JSON data easier. JsonStore is pre-configured
 * with a built-in {@link Ext.data.HttpProxy} and {@link Ext.data.JsonReader}.  If you require some other proxy/reader
 * combination then you'll have to create a basic {@link Ext.data.Store} configured as needed.<br/>
<pre><code>
var store = new Ext.data.JsonStore({
    url: 'get-images.php',
    root: 'images',
    fields: ['name', 'url', {name:'size', type: 'float'}, {name:'lastmod', type:'date'}]
});
</code></pre>
 * 形成这种形式的对象： This would consume a returned object of the form:
<pre><code>
{
    images: [
        {name: 'Image one', url:'/GetImage.php?id=1', size:46.5, lastmod: new Date(2007, 10, 29)},
        {name: 'Image Two', url:'/GetImage.php?id=2', size:43.2, lastmod: new Date(2007, 10, 30)}
    ]
}
</code></pre>
 * 
 * <b></b>
 * @cfg {String} url  
 * @cfg {Object} data  
 * @cfg {Array} fields 这种形式的数据（对象实字，object literal）会作用在{@link #data}配置项上。<br />
 * An object literal of this form could also be used as the {@link #data} config option.
 * <b>注意：尽管未有列出，该类继承了Store对象、JsonReader对象的所有的配置项。<br />
 * Note: Although they are not listed, this class inherits all of the config options of Store,
 * JsonReader.</b>
 * 
 * @cfg {String} url HttpProxy对象的URL地址。可以从这里指定，也可以从{@link #data}配置中指定。不能缺少。
 * The URL from which to load data through an HttpProxy. Either this option, or the {@link #data} option must be specified.
 * 
 * @cfg {Object} data 能够被该对象所属的JsonReader解析的数据对象。可以从这里指定，也可以从{@link #url}配置中指定。不能缺少。
 * A data object readable by this object's JsonReader. Either this option, or the {@link #url} option must be specified.
 * 
 * @cfg {Array} fields 既可以是字段的定义对象组成的数组，会作为{@link Ext.data.Record#create}方法的参数用途，也可以是一个{@link Ext.data.Record Record}构造器，来给{@link Ext.data.Record#create}创建的{@link Ext.data.Record}对象。
 * Either an Array of field definition objects as passed to {@link Ext.data.Record#create}, or a {@link Ext.data.Record Record} constructor created using {@link Ext.data.Record#create}.<br>
 * <p>
 * 这个配置项是用于创建{@link Ext.data.JsonReader#JsonReader JsonReader}构造器中的<tt>recordType</tt>，它是隐式调用，还创建了供Store使用的{@link Ext.data.Record Record definition}。
 * This config is used to create the <tt>recordType</tt> parameter to the {@link Ext.data.JsonReader#JsonReader JsonReader}
 * constructor that is implicitly called, and creates the {@link Ext.data.Record Record definition} used by the Store.
 * @constructor
 * @param {Object} config
 */
Ext.data.JsonStore = Ext.extend(Ext.data.Store, {
    constructor: function(config){
        Ext.data.JsonStore.superclass.constructor.call(this, Ext.apply(config, {
            reader: new Ext.data.JsonReader(config)
        }));
    }
    /**
     * @cfg {Ext.data.DataReader} reader @hide
     */
    /**
     * @cfg {Ext.data.DataProxy} proxy @hide
     */
});
Ext.reg('jsonstore', Ext.data.JsonStore);