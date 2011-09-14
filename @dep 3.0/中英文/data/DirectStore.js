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
 * @class Ext.data.DirectStore
 * @extends Ext.data.Store
 * <p>
 * 一个小型的辅助类，用来创建配搭了{@link Ext.data.DirectProxy}与{@link Ext.data.JsonReader}两者的{@link Ext.data.Store}更为轻松，
 * 使得沟通{@link Ext.Direct}服务端供应器{@link Ext.direct.Provider Provider}更也来得更为畅顺。
 * 要创建另外的proxy/reader组合，就创建一个单纯的{@link Ext.data.Store}来配置。
 * <br />
 * Small helper class to create an {@link Ext.data.Store} configured with an
 * {@link Ext.data.DirectProxy} and {@link Ext.data.JsonReader} to make interacting
 * with an {@link Ext.Direct} Server-side {@link Ext.direct.Provider Provider} easier.
 * To create a different proxy/reader combination create a basic {@link Ext.data.Store}
 * configured as needed.</p>
 *
 * <p>
 * <b>注意：</b>尽管还没有列出，该类继承了以下类所有的配置项：<br />
 * <b>*Note:</b> Although they are not listed, this class inherits all of the config options of:</p>
 * <div><ul class="mdetail-params">
 * <li><b>{@link Ext.data.Store Store}</b></li>
 * <div class="sub-desc"><ul class="mdetail-params">
 *
 * </ul></div>
 * <li><b>{@link Ext.data.JsonReader JsonReader}</b></li>
 * <div class="sub-desc"><ul class="mdetail-params">
 * <li><tt><b>{@link Ext.data.JsonReader#root root}</b></tt></li>
 * <li><tt><b>{@link Ext.data.JsonReader#idProperty idProperty}</b></tt></li>
 * <li><tt><b>{@link Ext.data.JsonReader#totalProperty totalProperty}</b></tt></li>
 * </ul></div>
 *
 * <li><b>{@link Ext.data.DirectProxy DirectProxy}</b></li>
 * <div class="sub-desc"><ul class="mdetail-params">
 * <li><tt><b>{@link Ext.data.DirectProxy#directFn directFn}</b></tt></li>
 * <li><tt><b>{@link Ext.data.DirectProxy#paramOrder paramOrder}</b></tt></li>
 * <li><tt><b>{@link Ext.data.DirectProxy#paramsAsHash paramsAsHash}</b></tt></li>
 * </ul></div>
 * </ul></div>
 *
 * @xtype directstore
 *
 * @constructor
 * @param {Object} config
 */
Ext.data.DirectStore = function(c){
    // each transaction upon a singe record will generatie a distinct Direct transaction since Direct queues them into one Ajax request.
    c.batchTransactions = false;

    Ext.data.DirectStore.superclass.constructor.call(this, Ext.apply(c, {
        proxy: (typeof(c.proxy) == 'undefined') ? new Ext.data.DirectProxy(Ext.copyTo({}, c, 'paramOrder,paramsAsHash,directFn,api')) : c.proxy,
        reader: (typeof(c.reader) == 'undefined' && typeof(c.fields) == 'object') ? new Ext.data.JsonReader(Ext.copyTo({}, c, 'totalProperty,root,idProperty'), c.fields) : c.reader
    }));
};
Ext.extend(Ext.data.DirectStore, Ext.data.Store, {});
Ext.reg('directstore', Ext.data.DirectStore);
