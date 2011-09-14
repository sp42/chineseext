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
 * @class Ext.data.MemoryProxy
 * @extends Ext.data.DataProxy
 * 一个Ext.data.DataProxy的实现类，当其load方法调用时就是用送入Reader来读取那个在构造器中传入的数据。<br />
 * An implementation of Ext.data.DataProxy that simply passes the data specified in its constructor
 * to the Reader when its load method is called.
 * @constructor
 * @param {Object} data 用这个数据对象来构造Ext.data.Records块。<br />The data object which the Reader uses to construct a block of Ext.data.Records.
 */
Ext.data.MemoryProxy = function(data){
    Ext.data.MemoryProxy.superclass.constructor.call(this);
    this.data = data;
};

Ext.extend(Ext.data.MemoryProxy, Ext.data.DataProxy, {
    /**
     * @event loadexception
     * 在加载数据期间有异常发生时触发该事件。注意该事件是与{@link Ext.data.Store}对象联动的，所以你只监听其中一个事件就可以的了。
     * Fires if an exception occurs in the Proxy during data loading. Note that this event is also relayed 
     * through {@link Ext.data.Store}, so you can listen for it directly on any Store instance.
     * @param {Object} this 此DataProxy对象。
     * @param {Object} arg 传入{@link #load}函数的回调参数对象。The callback's arg object passed to the {@link #load} function
     * @param {Object} null 使用MemoryProxy的这就一直是null。This parameter does not apply and will always be null for MemoryProxy
     * @param {Error} e 如果Reader不能读取数据就抛出一个JavaScript Error对象。The JavaScript Error object caught if the configured Reader could not read the data
     */
    
    /**
     * 根据数据源加载数据（本例中是客户端内存中的数据对象，透过构造器传入的），由指定的Ext.data.DataReader实例来解析这个Ext.data.Records块，并由指定的回调来处理这个块。
     * Load data from the requested source (in this case an in-memory data object passed to the constructor), 
     * read the data object into a block of Ext.data.Records using the passed Ext.data.DataReader implementation, and
     * process that block using the passed callback.
     * @param {Object} params 这个参数对MemoryProxy类不起作用。This parameter is not used by the MemoryProxy class.
     * @param {Ext.data.DataReader} reader 能转换数据为Ext.data.Records块的Reader对象。The Reader object which converts the data
     * object into a block of Ext.data.Records.
     * @param {Function} callback 会送入Ext.data.records块的函数。函数一定会传入：The function into which to pass the block of Ext.data.records.
     * The function must be passed <ul>
     * <li>Record对象。The Record block object</li>
     * <li>从load函数那里来的参数"arg"。The "arg" argument from the load function</li>
     * <li>是否成功的标识符。A boolean success indicator</li>
     * </ul>
     * @param {Object} scope 回调函数的作用域。The scope in which to call the callback
     * @param {Object} arg 送入到回调函数的参数，在参数第二个位置中出现（可选的）。An optional argument which is passed to the callback as its second parameter.
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