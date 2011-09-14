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
 * @class Ext.data.Operation
 * @extends Object
 * 
 * <p>Operation类表征了{@link Ext.data.Proxy Proxy}进行单个读或者写的时候的具体操作。
 * Operation对象用于激活Stores和Proxy之间操作。开发人员通常不会直接与Operation对象打交道。
 * Represents a single read or write operation performed by a {@link Ext.data.Proxy Proxy}.
 * Operation objects are used to enable communication between Stores and Proxies. Application
 * developers should rarely need to interact with Operation objects directly.</p>
 * 
 * <p>多个Operation可以批处理为一个{@link Ext.data.Batch batch}。Several Operations can be batched together in a {@link Ext.data.Batch batch}.</p>
 * 
 * @constructor
 * @param {Object} config 可选的配置项对象。Optional config object
 */
Ext.data.Operation = Ext.extend(Object, {
    /**
     * @cfg {Boolean} synchronous True表示为执行操作的时候是同步的（默认为True）。该属性为{@link Ext.data.Batch Batch}而设，看是否可以并行处理多个Operation。True if this Operation is to be executed synchronously (defaults to true). This
     * property is inspected by a {@link Ext.data.Batch Batch} to see if a series of Operations can be executed in
     * parallel or not.
     */
    synchronous: true,
    
    /**
     * @cfg {String} action Operation执行的动作。可以是“create”、“read”、“update”或“destory”。The action being performed by this Operation. Should be one of 'create', 'read', 'update' or 'destroy'
     */
    action: undefined,
    
    /**
     * @cfg {Array} filters 可选的。过滤器对象数组。只当‘read读’操作时有效。Optional array of filter objects. Only applies to 'read' actions.
     */
    filters: undefined,
    
    /**
     * @cfg {Array} sorters 可选的。排序对象数组。只当‘read读’操作时有效。Optional array of sorter objects. Only applies to 'read' actions.
     */
    sorters: undefined,
    
    /**
     * @cfg {Object} group 可选的。分组信息。只当在‘read读’操作时候期望分组有效。Optional grouping configuration. Only applies to 'read' actions where grouping is desired.
     */
    group: undefined,
    
    /**
     * @cfg {Number} start start（offset）'read读'操作时的分页有用。The start index (offset), used in paging when running a 'read' action.
     */
    start: undefined,
    
    /**
     * @cfg {Number} limit 指定要加载的记录数量。'read读'操作时的分页有用。 The number of records to load. Used on 'read' actions when paging is being used.
     */
    limit: undefined,
    
    /**
     * @cfg {Ext.data.Batch} batch 可选的。该操作所在的batch对象。The batch that this Operation is a part of (optional)
     */
    batch: undefined,
        
    /**
     * 只读的属性，用于跟踪该操作的异常状态。该属性私有的请使用{@link #isStarted}。
     * Read-only property tracking the start status of this Operation. Use {@link #isStarted}.
     * @property started
     * @type Boolean
     * @private
     */
    started: false,
    
    /**
     * 只读的属性，用于跟踪该操作的运行状态。该属性私有的请使用{@link #isRunning}。
     * Read-only property tracking the run status of this Operation. Use {@link #isRunning}.
     * @property running
     * @type Boolean
     * @private
     */
    running: false,
    
    /**
     * 只读的属性，用于跟踪该操作的完成状态。该属性私有的请使用{@link #isComplete}。
     * Read-only property tracking the completion status of this Operation. Use {@link #isComplete}.
     * @property complete
     * @type Boolean
     * @private
     */
    complete: false,
    
    /**
     * 只读的属性，用于跟踪该操作是否成功的状态。该值开始时是undefined，而当透过Proxy执行Operation后，该值会设置为true或false。{@link #setException}也会设置该值。请使用{@link #wasSuccessful}查询是否成功的状态。
     * Read-only property tracking whether the Operation was successful or not. This starts as undefined and is set to true
     * or false by the Proxy that is executing the Operation. It is also set to false by {@link #setException}. Use
     * {@link #wasSuccessful} to query success status.
     * @property success
     * @type Boolean
     * @private
     */
    success: undefined,
    
    /**
     * 只读的属性，用于跟踪该操作的异常状态。该属性私有的请使用{@link #hasException}并参阅{@link #getError}。
     * Read-only property tracking the exception status of this Operation. Use {@link #hasException} and see {@link #getError}.
     * @property exception
     * @type Boolean
     * @private
     */
    exception: false,
    
    /**
     *传入到{@link #setException}的错误对象。该对象应该是私有的。 The error object passed when {@link #setException} was called. This could be any object or primitive.
     * @property error
     * @type Mixed
     * @private
     */
    error: undefined,
    
    constructor: function(config) {
        Ext.apply(this, config || {});
    },
    
    /**
     * 标记Opeationn为开始的。
     * Marks the Operation as started
     */
    setStarted: function() {
        this.started = true;
        this.running = true;
    },
    
    /**
     * 标记Opeationn为完成的。
     * Marks the Operation as completed
     */
    setCompleted: function() {
        this.complete = true;
        this.running  = false;
    },
    
    /**
     * 标记Opeationn为成功的。
     * Marks the Operation as successful
     */
    setSuccessful: function() {
        this.success = true;
    },
    
    /**
     * 标记Opeationn已经遭遇过一次异常。可以送入一个错误消息或对象的。
     * Marks the Operation as having experienced an exception. Can be supplied with an option error message/object.
     * @param {Mixed} error 可选的错误字符串或对象。Optional error string/object
     */
    setException: function(error) {
        this.exception = true;
        this.success = false;
        this.running = false;
        this.error = error;
    },
    
    /**
     * @private
     */
    markStarted: function() {
        console.warn("Operation: markStarted has been deprecated. Please use setStarted");
        return this.setStarted();
    },
    
    /**
     * @private
     */
    markCompleted: function() {
        console.warn("Operation: markCompleted has been deprecated. Please use setCompleted");
        return this.setCompleted();
    },
    
    /**
     * @private
     */
    markSuccessful: function() {
        console.warn("Operation: markSuccessful has been deprecated. Please use setSuccessful");
        return this.setSuccessful();
    },
    
    /**
     * @private
     */
    markException: function() {
        console.warn("Operation: markException has been deprecated. Please use setException");
        return this.setException();
    },
    
    /**
     * 返回true表示Opeaetion遭遇到一次异常（请参阅{@link #getError}）
     * Returns true if this Operation encountered an exception (see also {@link #getError})
     * @return {Boolean} True表示为有异常。True if there was an exception
     */
    hasException: function() {
        return this.exception === true;
    },
    
    /**
     * 返回通过{@link #setException}设置的错误字符串或对象。
     * Returns the error string or object that was set using {@link #setException}
     * @return {Mixed} 错误对象。The error object
     */
    getError: function() {
        return this.error;
    },
    
    /**
     * 返回通过Proxy设置的Ext.data.Model实例数组。
     * Returns an array of Ext.data.Model instances as set by the Proxy.
     * @return {Array} Any loaded Records
     */
    getRecords: function() {
        var resultSet = this.getResultSet();
        
        return (resultSet == undefined ? this.records : resultSet.records);
    },
    
    /**
     * 返回记录集合对象（如有通过Proxy设置的话）。该对象会包含{@link Ext.data.Model model}还有建立实例、可用数等的元数据。
     * Returns the ResultSet object (if set by the Proxy). This object will contain the {@link Ext.data.Model model} instances
     * as well as meta data such as number of instances fetched, number available etc
     * @return {Ext.data.ResultSet} 记录集合对象。The ResultSet object
     */
    getResultSet: function() {
        return this.resultSet;
    },
    
    /**
     * 返回True表示Operation已经开始了。注意Operation或者已经开始并且完成了的了，参阅{@link #isRunning}以了解如何测试Operation当前是否在运行着的。Returns true if the Operation has been started. Note that the Operation may have started AND completed,
     * see {@link #isRunning} to test if the Operation is currently running.
     * @return {Boolean} True表示为Operation已经开始。True if the Operation has started
     */
    isStarted: function() {
        return this.started === true;
    },
    
    /**
     * 返回True表示Operation已经开始却并没有完成。
     * Returns true if the Operation has been started but has not yet completed.
     * @return {Boolean} True表示Operation正在运行。True if the Operation is currently running
     */
    isRunning: function() {
        return this.running === true;
    },
    
    /**
     * 返回True表示Operation已结束。
     * eturns true if the Operation has been completed
     * @return {Boolean} True表示Operation已结束。。True if the Operation is complete
     */
    isComplete: function() {
        return this.complete === true;
    },
    
    /**
     * 返回True表示Operation已经完成并且是成功的。
     * Returns true if the Operation has completed and was successful
     * @return {Boolean} True表示为成功。True if successful
     */
    wasSuccessful: function() {
        return this.isComplete() && this.success === true;
    },
    
    /**
     * @private
     * 关联一个Batch到Operation。
     * Associates this Operation with a Batch
     * @param {Ext.data.Batch} batch The batch
     */
    setBatch: function(batch) {
        this.batch = batch;
    },
    
    /**
     * 是否允许这个Operation可以写操作。
     * Checks whether this operation should cause writing to occur.
     * @return {Boolean} 是否可以进行写的操作。Whether the operation should cause a write to occur.
     */
    allowWrite: function() {
        return this.action != 'read';
    }
});