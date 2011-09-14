/**
 * @class Ext.data.MemoryProxy
 * @extends Ext.data.DataProxy
 * 一个Ext.data.DataProxy的实现类，当其load方法调用时就是用送入Reader来读取那个在构造器中传入的数据。
 * @constructor
 * @param {Object} data Reader用这个数据对象来构造Ext.data.Records块。
 */
Ext.data.MemoryProxy = function(data){
    Ext.data.MemoryProxy.superclass.constructor.call(this);
    this.data = data;
};

Ext.extend(Ext.data.MemoryProxy, Ext.data.DataProxy, {
	 /**
	 * @event loadexception
	 * 在加载数据期间有异常发生时触发该事件。注意该事件是与{@link Ext.data.Store}对象联动的，所以你只监听其中一个事件就可以的了。
	 * @param {Object} this 此DataProxy 对象.
	 * @param {Object} o 数据对象.
	 * @param {Object} arg  传入{@link #load}函数的回调参数对象
     * @param {Object} null 使用MemoryProxy的这就一直是null
     * @param {Error} e 如果Reader不能读取数据就抛出一个JavaScript Error对象
	 */
    
    /**
     * 根据数据源加载数据（本例中是客户端内存中的数据对象，透过构造器传入的），由指定的Ext.data.DataReader实例来解析这个Ext.data.Records块，并由指定的回调来处理这个块。
     * @param {Object} params 这个参数对MemoryProxy类不起作用
     * @param {Ext.data.DataReader} reader 能转换数据为Ext.data.Records块的Reader对象
     * @param {Function} callback 会送入Ext.data.records块的函数。函数一定会传入：<ul>
     * <li>Record对象t</li>
     * <li>从load函数那里来的参数"arg"</li>
     * <li>是否成功的标识符</li>
     * </ul>
     * @param {Object} scope 回调函数的作用域
     * @param {Object} arg 送入到回调函数的参数，在参数第二个位置中出现（可选的）
     */
    load : function(params, reader, callback, scope, arg){
        params = params || {};
        var result;
        try {
            result = reader.readRecords(this.data);
        }catch(e){
            this.fireEvent("loadexception", this, arg, null, e);
            callback.call(scope, null, arg, false);
            return;
        }
        callback.call(scope, result, arg, true);
    },
    
    // private
    update : function(params, records){
        
    }
});