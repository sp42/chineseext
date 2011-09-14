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
 * @class Ext.data.Proxy
 * @extends Ext.util.Observable
 * 
 * <p>
 * 当{@link Ext.data.Store Stores}要为{@link Ext.data.Model Model}加载或者保存数据的时候，就必须通过这个Proxy类。
 * 一般情况下开发者不要直接使用这个类。
 * Proxies are used by {@link Ext.data.Store Stores} to handle the loading and saving of {@link Ext.data.Model Model} data.
 * Usually developers will not need to create or interact with proxies directly.</p>
 * <p><u>Proxy类型：Types of Proxy</u></p>
 * 
 * <p>
 * 主要的两种Proxy是{@link Ext.data.ClientProxy Client}和{@link Ext.data.ServerProxy Server}。
 * Client Proxy的意思是在客户端保存本地的数据，有下面的子类：
 * There are two main types of Proxy - {@link Ext.data.ClientProxy Client} and {@link Ext.data.ServerProxy Server}. The Client proxies
 * save their data locally and include the following subclasses:</p>
 * 
 * <ul style="list-style-type: disc; padding-left: 25px">
 * <li>{@link Ext.data.LocalStorageProxy LocalStorageProxy} -如果浏览器支持，保存localStorage的数据。 saves its data to localStorage if the browser supports it</li>
 * <li>{@link Ext.data.SessionStorageProxy SessionStorageProxy} -如果浏览器支持，保存sessionStorage的数据。 saves its data to sessionStorage if the browsers supports it</li>
 * <li>{@link Ext.data.MemoryProxy MemoryProxy} - 内存中的数据，一旦刷新页面数据将不复存在。 holds data in memory only, any data is lost when the page is refreshed</li>
 * </ul>
 * 
 * <p>Server Proxy就是通过Request发送数据到远端。有以下子类： The Server proxies save their data by sending requests to some remote server. These proxies include:</p>
 * 
 * <ul style="list-style-type: disc; padding-left: 25px">
 * <li>{@link Ext.data.AjaxProxy AjaxProxy} -同源的数据请求。 sends requests to a server on the same domain</li>
 * <li>{@link Ext.data.ScriptTagProxy ScriptTagProxy} - 使用JSON-P进行跨域通讯。 uses JSON-P to send requests to a server on a different domain</li>
 * </ul>
 * 
 * <p>
 * Proxy的操作就是将所有全部的操作视作为增、删、改、查四种，即Create、Read、Update或Delete。这四个操作分别映射了{@link #create}, {@link #read}, {@link #update} and {@link #destroy}。
 * 不同的Proxy子类就要逐个去具体化这些CRUD是什么了。
 * Proxies operate on the principle that all operations performed are either Create, Read, Update or Delete. These four operations 
 * are mapped to the methods {@link #create}, {@link #read}, {@link #update} and {@link #destroy} respectively. Each Proxy subclass 
 * implements these functions.
 * </p>
 * 
 * <p>
 * CRUD方法期待一个{@link Ext.data.Operation operation}对象的独占参数传入。
 * Opeartion封装了Stroe将要执行的动作信息、要修改的{@link Ext.data.Model model}实例等等。
 * 请参阅{@link Ext.data.Operation Operation}文档了解更多。
 * 在完成阶段，每个CRUD方法都支持异步的回调函数。
 * The CRUD methods each expect an {@link Ext.data.Operation operation} object as the sole argument. The Operation encapsulates 
 * information about the action the Store wishes to perform, the {@link Ext.data.Model model} instances that are to be modified, etc.
 * See the {@link Ext.data.Operation Operation} documentation for more details. Each CRUD method also accepts a callback function to be 
 * called asynchronously on completion.</p>
 * 
 * <p>
 * Proxy支持多个Opeartions的批处理，也就是{@link Ext.data.Batch batch}对象，参见{@link #batch}方法。
 * Proxies also support batching of Operations via a {@link Ext.data.Batch batch} object, invoked by the {@link #batch} method.</p>
 * 
 * @constructor
 * Creates the Proxy
 * @param {Object} config 可选的配置项对象。Optional config object
 */
Ext.data.Proxy = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {String} batchOrder
     * 当执行批处理时执行'create'、'update'和'destroy'动作的顺序。要改变个中顺序可以覆盖这个属性。默认就是'create,update,destroy'。
     * Comma-separated ordering 'create', 'update' and 'destroy' actions when batching. Override this
     * to set a different order for the batched CRUD actions to be executed in. Defaults to 'create,update,destroy'
     */
    batchOrder: 'create,update,destroy',
    
    /**
     * @cfg {String} defaultReaderType 默认的reader类型。默认是“json”。The default registered reader type. Defaults to 'json'
     */
    defaultReaderType: 'json',
    
    /**
     * @cfg {String} defaultWriterType 默认的writer类型。默认是“json”。The default registered writer type. Defaults to 'json'
     */
    defaultWriterType: 'json',
    
    constructor: function(config) {
        config = config || {};
        
        if (config.model == undefined) {
            delete config.model;
        }

        Ext.data.Proxy.superclass.constructor.call(this, config);
        
        if (this.model != undefined && !(this.model instanceof Ext.data.Model)) {
            this.setModel(this.model);
        }
    },
    
    /**
     * 设置这个proxy关联的模型。通常由Store来调用。
     * Sets the model associated with this proxy. This will only usually be called by a Store
     * @param {String|Ext.data.Model} model 新模型。既可以是模型名称的字符串，也可以是模型构造器的引用。The new model. Can be either the model name string,
     * or a reference to the model's constructor
     * @param {Boolean} setOnStore 如果有的话，设置一个新的模型在关联的Store身上。Sets the new model on the associated Store, if one is present
     */
    setModel: function(model, setOnStore) {
        this.model = Ext.ModelMgr.getModel(model);
        
        var reader = this.reader,
            writer = this.writer;
        
        this.setReader(reader);
        this.setWriter(writer);
        
        if (setOnStore && this.store) {
            this.store.setModel(this.model);
        }
    },
    
    /**
     * 返回附加在这个Proxy身上的模型。
     * Returns the model attached to this Proxy
     * @return {Ext.data.Model} 模型。The model
     */
    getModel: function() {
        return this.model;
    },
    
    /**
     * 设置Proxy的Reader，可以传入字符串、配置项对象或Reader实例本身。
     * Sets the Proxy's Reader by string, config object or Reader instance
     * @param {String|Object|Ext.data.Reader} reader 可以传入字符串、配置项对象或Reader实例本身。The new Reader, which can be either a type string, a configuration object
     * or an Ext.data.Reader instance
     * @return {Ext.data.Reader} 已绑定的Reader对象。The attached Reader object
     */
    setReader: function(reader) {
        if (reader == undefined || typeof reader == 'string') {
            reader = {
                type: reader
            };
        }

        if (!(reader instanceof Ext.data.Reader)) {
            Ext.applyIf(reader, {
                proxy: this,
                model: this.model,
                type : this.defaultReaderType
            });

            reader = Ext.data.ReaderMgr.create(reader);
        }
        
        this.reader = reader;
        
        return this.reader;
    },
    
    /**
     * 返回当前Proxy实例的Reader对象。
     * Returns the reader currently attached to this proxy instance
     * @return {Ext.data.Reader} Reader实例。The Reader instance
     */
    getReader: function() {
        return this.reader;
    },
    
    /**
     * 设置Proxy的Writer，可以传入字符串、配置项对象或Writer实例本身。
     * Sets the Proxy's Writer by string, config object or Writer instance
     * @param {String|Object|Ext.data.Writer} writer 可以传入字符串、配置项对象或Writer实例本身。The new Writer, which can be either a type string, a configuration object
     * or an Ext.data.Writer instance
     * @return {Ext.data.Writer} 加入的Writer对象。The attached Writer object
     */
    setWriter: function(writer) {
        if (writer == undefined || typeof writer == 'string') {
            writer = {
                type: writer
            };
        }

        if (!(writer instanceof Ext.data.Writer)) {
            Ext.applyIf(writer, {
                model: this.model,
                type : this.defaultWriterType
            });

            writer = Ext.data.WriterMgr.create(writer);
        }
        
        this.writer = writer;
        
        return this.writer;
    },
    
    /**
     *  返回当前Proxy实例的writer对象。
     * Returns the writer currently attached to this proxy instance
     * @return {Ext.data.Writer} writer对象The Writer instance
     */
    getWriter: function() {
        return this.writer;
    },
    
    /**
     * 执行指定的Create操作。
     * Performs the given create operation.
     * @param {Ext.data.Operation} operation 所执行的Operation对象。The Operation to perform
     * @param {Function} callback 当操作完成后调用的回调函数（不管是否成功都执行的）。Callback function to be called when the Operation has completed (whether successful or not)
     * @param {Object} scope 回调函数的作用域。Scope to execute the callback function in
     */
    create: Ext.emptyFn,
    
    /**
     * 执行指定的Read操作。
     * Performs the given read operation.
     * @param {Ext.data.Operation} operation 所执行的Operation对象。The Operation to perform
     * @param {Function} callback 当操作完成后调用的回调函数（不管是否成功都执行的）。Callback function to be called when the Operation has completed (whether successful or not)
     * @param {Object} scope 回调函数的作用域。Scope to execute the callback function in
     */
    read: Ext.emptyFn,
    
    /**
     * 执行指定的Update操作。
     * Performs the given update operation.
     * @param {Ext.data.Operation} operation 所执行的Operation对象。The Operation to perform
     * @param {Function} callback 当操作完成后调用的回调函数（不管是否成功都执行的）。Callback function to be called when the Operation has completed (whether successful or not)
     * @param {Object} scope 回调函数的作用域。Scope to execute the callback function in
     */
    update: Ext.emptyFn,
    
    /**
     * 执行指定的Destroy操作。
     * Performs the given destroy operation.
     * @param {Ext.data.Operation} operation 所执行的Operation对象。The Operation to perform
     * @param {Function} callback 当操作完成后调用的回调函数（不管是否成功都执行的）。Callback function to be called when the Operation has completed (whether successful or not)
     * @param {Object} scope 回调函数的作用域。Scope to execute the callback function in
     */
    destroy: Ext.emptyFn,
    
    /**
     * 执行{@link Ext.data.Operation Operations}的批处理命令，其顺序由{@link #batchOrder}决定。
     * 它内部会调用{@link Ext.data.Store}的{@link Ext.data.Store#sync sync}方法。例子如下：
     * Performs a batch of {@link Ext.data.Operation Operations}, in the order specified by {@link #batchOrder}. Used internally by
     * {@link Ext.data.Store}'s {@link Ext.data.Store#sync sync} method. Example usage:
     * <pre><code>
     * myProxy.batch({
     *     create : [myModel1, myModel2],
     *     update : [myModel3],
     *     destroy: [myModel4, myModel5]
     * });
     * </code></pre>
     * 上面的myModel*就是{@link Ext.data.Model Model}实例。假设1和2都是新实例还没有保存的，3就是之前保存过的了但是需要更新，4和5就是已经保存的了但是现在要删除。
     * Where the myModel* above are {@link Ext.data.Model Model} instances - in this case 1 and 2 are new instances and have not been 
     * saved before, 3 has been saved previously but needs to be updated, and 4 and 5 have already been saved but should now be destroyed.
     * @param {Object} operations模型实例的所在对象，（？？也可以是字符串的key??） Object containing the Model instances to act upon, keyed by action name
     * @param {Object} listeners 可选的事件侦听器的配置项对象，会被传入的{@link Ext.data.Batch}对象中，请参阅其文档。 Optional listeners object passed straight through to the Batch - see {@link Ext.data.Batch}
     * @return {Ext.data.Batch} 新创建的Ext.data.Batch对象。 The newly created Ext.data.Batch object
     */
    batch: function(operations, listeners) {
        var batch = new Ext.data.Batch({
            proxy: this,
            listeners: listeners || {}
        });
        
        Ext.each(this.batchOrder.split(','), function(action) {
            if (operations[action]) {
                batch.add(new Ext.data.Operation({
                    action : action, 
                    records: operations[action]
                }));
            }
        }, this);
        
        batch.start();
        
        return batch;
    }
});

//backwards compatibility
Ext.data.DataProxy = Ext.data.Proxy;

Ext.data.ProxyMgr.registerType('proxy', Ext.data.Proxy);