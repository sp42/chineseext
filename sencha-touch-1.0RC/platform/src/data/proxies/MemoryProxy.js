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
 * @class Ext.data.MemoryProxy
 * @extends Ext.data.ClientProxy
 * 
 * <p>内存中proxy，所以一刷新浏览器的话，就没有了本地数据。通常来说不会直接使用到这个类，什么时候使用呢？
 * 比如一个User模型和来源不同的数据，它们之间的结构并不是十分吻合，我们就可以灵活使用MemoryProxy和JsonReader作转换，然后加载到{@link Ext.data.Store Store} 中去。
 * In-memory proxy. This proxy simply uses a local variable for data storage/retrieval, so its contents are
 * lost on every page refresh. Usually this Proxy isn't used directly, serving instead as a helper to a 
 * {@link Ext.data.Store Store} where a reader is required to load data. For example, say we have a Store for
 * a User model and have some inline data we want to load, but this data isn't in quite the right format: we 
 * can use a MemoryProxy with a JsonReader to read it into our Store:</p>
 * 
<pre><code>
//这时Store中所使用的模型。this is the model we'll be using in the store
Ext.regModel('User', {
    fields: [
        {name: 'id',    type: 'int'},
        {name: 'name',  type: 'string'},
        {name: 'phone', type: 'string', mapping: 'phoneNumber'}
    ]
});

//此数据并不是与我们上面定义的模型所吻合，就是phone字段必须映射为phoneNumber。this data doesn't line up to our model fields - the phone field is called phoneNumber
var data = {
    users: [
        {
            id: 1,
            name: 'Ed Spencer',
            phoneNumber: '555 1234'
        },
        {
            id: 2,
            name: 'Abe Elias',
            phoneNumber: '666 1234'
        }
    ]
};

//注意如何设置reader中的“root: 'users'”，看看是怎么对应上面的数据结构的。note how we set the 'root' in the reader to match the data structure above
var store = new Ext.data.Store({
    autoLoad: true,
    model: 'User',
    data : data,
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'users'
        }
    }
});
</code></pre>
 */
Ext.data.MemoryProxy = Ext.extend(Ext.data.ClientProxy, {
    /**
     * @cfg {Array} data 可选的，加载到Proxy的Record数组。Optional array of Records to load into the Proxy
     */
    
    constructor: function(config) {
        Ext.data.MemoryProxy.superclass.constructor.call(this, config);
        
        //保证reader一定要实例化了的才可以。 ensures that the reader has been instantiated properly
        this.setReader(this.reader);
    },
    
    /**
     * 通过Proxy所依赖的{@link #reader}去读本对象身上{@link #data}对象。
     * Reads data from the configured {@link #data} object. Uses the Proxy's {@link #reader}, if present
     * @param {Ext.data.Operation} operation 读操作对象。The read Operation
     * @param {Function} callback 回调函数。The callback to call when reading has completed
     * @param {Object} scope 作用域。 The scope to call the callback function in
     */
    read: function(operation, callback, scope) {
        var reader = this.getReader(),
            result = reader.read(this.data);
            
		// operation.resultSet = result;
        Ext.apply(operation, {
            resultSet: result
        });
        
        operation.setCompleted();
        
        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },
    // 覆盖掉原来的throw函数。
    clear: Ext.emptyFn
});

Ext.data.ProxyMgr.registerType('memory', Ext.data.MemoryProxy);