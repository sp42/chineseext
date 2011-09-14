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
 * @class Ext.data.ClientProxy
 * @extends Ext.data.Proxy
 * 
 * <p>
 * Ext.data.ClientProxy是为服务端而设的存储基类。它的子类有{@link Ext.data.MemoryProxy Memory}和{@link Ext.data.WebStorageProxy Web Storage}。
 * 因为是基类，请不要直接使用。
 * Base class for any client-side storage. Used as a superclass for {@link Ext.data.MemoryProxy Memory} and 
 * {@link Ext.data.WebStorageProxy Web Storage} proxies. Do not use directly, use one of the subclasses instead.</p>
 */
Ext.data.ClientProxy = Ext.extend(Ext.data.Proxy, {
    /**
     * 抽象函数，每一个子类都必须实现该方法。这个方法会删除掉客户端的使所有记录数据，包括像IDs的这样的支持数据。
     * Abstract function that must be implemented by each ClientProxy subclass. This should purge all record data
     * from the client side storage, as well as removing any supporting data (such as lists of record IDs)
     */
    clear: function() {
        throw new Error("The Ext.data.ClientProxy subclass that you are using has not defined a 'clear' function. See src/data/ClientProxy.js for details.");
    }
});