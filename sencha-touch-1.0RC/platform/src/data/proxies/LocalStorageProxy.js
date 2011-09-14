/*
 * @version Sencha 0.98
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
 * @class Ext.data.LocalStorageProxy
 * @extends Ext.data.WebStorageProxy
 * 
 * <p>这个Proxy是以HTML5本地存储为服务对象的，但倘若浏览器不支持HTML5客户端存储方案，构造函数就会立刻抛出一个异常。Proxy which uses HTML5 local storage as its data storage/retrieval mechanism.
 * 本地存储需要一个独一无二的ID作为存放全部记录对象的KEY。
 * If this proxy is used in a browser where local storage is not supported, the constructor will throw an error.
 * A local storage proxy requires a unique ID which is used as a key in which all record data are stored in the
 * local storage object.</p>
 * 
 * <p>
 * 切记送入的ID必须是独一无二的，否则调用过程将是不稳定的。如果没有送入ID，则storeId会视为ID。如果什么ID都没有将会抛出一个异常。
 * It's important to supply this unique ID as it cannot be reliably determined otherwise. If no id is provided
 * but the attached store has a storeId, the storeId will be used. If neither option is presented the proxy will
 * throw an error.</p>
 * 
 * <p>Proxy总是结合{@link Ext.data.Store store}使用的，如下例：Proxies are almost always used with a {@link Ext.data.Store store}:<p>
 * 
<pre><code>
new Ext.data.Store({
    proxy: {
        type: 'localstorage',
        id  : 'myProxyKey'
    }
});
</code></pre>
 * 
 * <p>另外你也可以直接地创建Proxy：Alternatively you can instantiate the Proxy directly:</p>
 * 
<pre><code>
new Ext.data.LocalStorageProxy({
    id  : 'myOtherProxyKey'
});
</code></pre>
 */
Ext.data.LocalStorageProxy = Ext.extend(Ext.data.WebStorageProxy, {
    //inherit docs
    getStorageObject: function() {
        return window.localStorage;
    }
});

Ext.data.ProxyMgr.registerType('localstorage', Ext.data.LocalStorageProxy);