/**
 * @author Ed Spencer
 * @class Ext.data.SessionStorageProxy
 * @extends Ext.data.WebStorageProxy
 * 
 * <p>这个Proxy是以HTML5 Session存储为服务对象的，但倘若浏览器不支持HTML5 Session客户端存储方案，构造函数就会立刻抛出一个异常。Proxy which uses HTML5 local storage as its data storage/retrieval mechanism.
 * 本地存储需要一个独一无二的ID作为存放全部记录对象的KEY。
 * Proxy which uses HTML5 session storage as its data storage/retrieval mechanism.
 * If this proxy is used in a browser where session storage is not supported, the constructor will throw an error.
 * A session storage proxy requires a unique ID which is used as a key in which all record data are stored in the
 * session storage object.</p>
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
        type: 'sessionstorage',
        id  : 'myProxyKey'
    }
});
</code></pre>
 * 
 * <p>外你也可以直接地创建Proxy：Alternatively you can instantiate the Proxy directly:</p>
 * 
<pre><code>
new Ext.data.SessionStorageProxy({
    id  : 'myOtherProxyKey'
});
 </code></pre>
 * 
 * <p>
 * 那么Session存储与本地存储（也就是{@link Ext.data.LocalStorageProxy}）有什么区别呢？就是如果浏览器的Session会话结束后（比如您关闭了浏览器），
 * 将会丢失SessionStorageProxy中所有的数据。但是{@link Ext.data.LocalStorageProxy}中的数据还是存在。
 * Note that session storage is different to local storage (see {@link Ext.data.LocalStorageProxy}) - if a browser
 * session is ended (e.g. by closing the browser) then all data in a SessionStorageProxy are lost. Browser restarts
 * don't affect the {@link Ext.data.LocalStorageProxy} - the data are preserved.</p>
 */
Ext.data.SessionStorageProxy = Ext.extend(Ext.data.WebStorageProxy, {
    //inherit docs
    getStorageObject: function() {
        return window.sessionStorage;
    }
});

Ext.data.ProxyMgr.registerType('sessionstorage', Ext.data.SessionStorageProxy);