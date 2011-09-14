/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.data.DataProxy
 * @extends Ext.util.Observable
 * <p>
 * 一个抽象的基类，只提供获取未格式化的原始数据。<br />
 * This class is an abstract base class for implementations which provide retrieval of unformatted data objects.
 * </p>
 * <p>
 * DataProxy的实现通常用于连接Ext.data.DataReader的实现（以适当的类型去解析数据对象）来一同协作，向一{@link Ext.data.Store}提供{@link Ext.data.Records}块。<br />
 * DataProxy implementations are usually used in conjunction with an implementation of Ext.data.DataReader
 * (of the appropriate type which knows how to parse the data object) to provide a block of
 * {@link Ext.data.Records} to an {@link Ext.data.Store}.
 * </p>
 * 自定义子类的实现必须符合{@link Ext.data.HttpProxy#load}方法那般的实现。<br />
 * Custom implementations must implement the load method as described in {@link Ext.data.HttpProxy#load}.
 */
Ext.data.DataProxy = function(){
    this.addEvents(
        /**
         * @event beforeload
         * 当在获取一个数据对象之前，向网络发起请求之前触发。
         * Fires before a network request is made to retrieve a data object.
         * @param {Object} this DataProxy
         * @param {Object} params 送入{@link #load}函数的参数对象。The params object passed to the {@link #load} function
         */
        'beforeload',
        /**
         * @event load
         * 当load方法的回调执行后触发。
         * Fires before the load method's callback is called.
         * @param {Object} this DataProxy
         * @param {Object} o 数据对象。The data object
         * @param {Object} arg 送入{@link #load}函数的回调参数对象。The callback's arg object passed to the {@link #load} function
         */
        'load'
    );
    Ext.data.DataProxy.superclass.constructor.call(this);
};

Ext.extend(Ext.data.DataProxy, Ext.util.Observable);