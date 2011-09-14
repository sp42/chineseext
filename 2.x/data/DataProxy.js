/**
 * @class Ext.data.DataProxy
 * @extends Ext.util.Observable
 * 一个抽象的基类，只提供获取未格式化的原始数据。
 * <br>
 * <p>
 * DataProxy的实现通常用于连接Ext.data.DataReader的实现（以适当的类型去解析数据对象）
 * 来一同协作向一{@link Ext.data.Store}提供{@link Ext.data.Records}块。<br>
 * 自定义子类的实现必须符合{@link Ext.data.HttpProxy#load}方法那般。</p>
 */
Ext.data.DataProxy = function(){
    this.addEvents(
        /**
         * @event beforeload
         * 在达致一次成功的网络请求之后，获取数据之前触发。
         * @param {Object} this 此DataProxy对象
         * @param {Object} params {@link #load}事件处理函数的参数
         */
        'beforeload',
        /**
         * @event load
         * 在load方法的回调函数被调用之前触发该事件。
         * @param {Object} this 此DataProxy对象
         * @param {Object} o 数据对象
         * @param {Object} arg 送入到{@link #load}事件处理函数的那个回调函数的参数
         */
        'load'
    );
    Ext.data.DataProxy.superclass.constructor.call(this);
};

Ext.extend(Ext.data.DataProxy, Ext.util.Observable);