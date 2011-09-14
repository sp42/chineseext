/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.data.JsonStore
 * @extends Ext.data.Store
 * Small helper class to make creating Stores for JSON data easier. <br/>
 * Ext.data.JsonStore类,继承Ext.data.Store.一小帮助类,使得创建json 数据 store更加容易
<pre><code>
var store = new Ext.data.JsonStore({
    url: 'get-images.php',
    root: 'images',
    fields: ['name', 'url', {name:'size', type: 'float'}, {name:'lastmod', type:'date'}]
});
</code></pre>
 * <b>Note: Although they are not listed, this class inherits all of the config options of Store,
 * JsonReader and HttpProxy (unless inline data is provided).</b>
 * @cfg {Array} fields An array of field definition objects, or field name strings.
 * @constructor
 * @param {Object} config
 */
 /*
 * <b>注意: 尽管他们没有列出来.除非内在数据己提供,否则该类继承了所有store,jsonReader,和heepProxy的配置项.</b>
 * @cfg {Array} fields 一字段定义的对象,或字段名 数组
 * @constructor
 * @param {Object} config
 */
Ext.data.JsonStore = function(c){
    Ext.data.JsonStore.superclass.constructor.call(this, Ext.apply(c, {
        proxy: !c.data ? new Ext.data.HttpProxy({url: c.url}) : undefined,
        reader: new Ext.data.JsonReader(c, c.fields)
    }));
};
Ext.extend(Ext.data.JsonStore, Ext.data.Store);