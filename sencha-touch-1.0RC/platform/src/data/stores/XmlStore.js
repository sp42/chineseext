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
 * @class Ext.data.XmlStore
 * @extends Ext.data.Store
 * @private
 * @ignore
 * <p>
 * 一个轻型的辅助类，好让处理XML类型的{@link Ext.data.Store}起来更加轻松。XmlStore可通过{@link Ext.data.XmlReader}自动配置。
 * Small helper class to make creating {@link Ext.data.Store}s from XML data easier.
 * A XmlStore will be automatically configured with a {@link Ext.data.XmlReader}.</p>
 * <p>如是这样地配置一个Store：A store configuration would be something like:<pre><code>
var store = new Ext.data.XmlStore({
    // store configs
    autoDestroy: true,
    storeId: 'myStore',
    url: 'sheldon.xml', // 自动转为HttpProxy的代理。automatically configures a HttpProxy
    // reader configs
    record: 'Item', // 每条记录都有Item标签。records will have an "Item" tag
    idPath: 'ASIN',
    totalRecords: '@TotalResults'
    fields: [
        // 设置与xml文档映射的字段。最紧要的事mapping项，其他的就次要。
        // set up the fields mapping into the xml doc
        // The first needs mapping, the others are very basic
        {name: 'Author', mapping: 'ItemAttributes > Author'},
        'Title', 'Manufacturer', 'ProductGroup'
    ]
});
 * </code></pre></p>
 * <p>经过配置后，这样的xml会演变成为store对象：This store is configured to consume a returned object of the form:<pre><code>
&#60?xml version="1.0" encoding="UTF-8"?>
&#60ItemSearchResponse xmlns="http://webservices.amazon.com/AWSECommerceService/2009-05-15">
    &#60Items>
        &#60Request>
            &#60IsValid>True&#60/IsValid>
            &#60ItemSearchRequest>
                &#60Author>Sidney Sheldon&#60/Author>
                &#60SearchIndex>Books&#60/SearchIndex>
            &#60/ItemSearchRequest>
        &#60/Request>
        &#60TotalResults>203&#60/TotalResults>
        &#60TotalPages>21&#60/TotalPages>
        &#60Item>
            &#60ASIN>0446355453&#60/ASIN>
            &#60DetailPageURL>
                http://www.amazon.com/
            &#60/DetailPageURL>
            &#60ItemAttributes>
                &#60Author>Sidney Sheldon&#60/Author>
                &#60Manufacturer>Warner Books&#60/Manufacturer>
                &#60ProductGroup>Book&#60/ProductGroup>
                &#60Title>Master of the Game&#60/Title>
            &#60/ItemAttributes>
        &#60/Item>
    &#60/Items>
&#60/ItemSearchResponse>
 * </code></pre>
 * “对象字面化”的形式也可以用于{@link #data}的配置项。<br />
 * An object literal of this form could also be used as the {@link #data} config option.</p>
 * <p><b>注意：</b>尽管还没有列出，该类可接收来自<b>{@link Ext.data.XmlReader XmlReader}</b>所有的配置项。<br />
 * <b>Note:</b> Although not listed here, this class accepts all of the configuration options of 
 * <b>{@link Ext.data.XmlReader XmlReader}</b>.</p>
 * @constructor
 * @param {Object} config
 * @xtype xmlstore
 */
Ext.data.XmlStore = Ext.extend(Ext.data.Store, {
    /**
     * @cfg {Ext.data.DataReader} reader @hide
     */
    constructor: function(config){
        config = config || {};
        config = config || {};
              
        Ext.applyIf(config, {
            proxy: {
                type: 'ajax',
                reader: 'xml',
                writer: 'xml'
            }
        });
        Ext.data.XmlStore.superclass.constructor.call(this, config);
    }
});
Ext.reg('xmlstore', Ext.data.XmlStore);