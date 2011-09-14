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
 * @class Ext.data.Batch
 * @extends Ext.util.Observable
 * 
 * <p>
 * 提供一个运行一个或多个的手段，可指定既定的顺序。当完成了一个操作对象就触发“operationcomplete”事件；当完成好所有的操作就触发“complete”事件；当操作抛出任何异常就会触发“exception”事件。
 * Provides a mechanism to run one or more {@link Ext.data.Operation operations} in a given order. Fires the 'operationcomplete' event
 * after the completion of each Operation, and the 'complete' event when all Operations have been successfully executed. Fires an 'exception'
 * event if any of the Operations encounter an exception.</p>
 * 
 * <p>一般情况下，由{@link Ext.data.Proxy}类调用该类。Usually these are only used internally by {@link Ext.data.Proxy} classes</p>
 * 
 * @constructor
 * @param {Object} config 可选定的，配置项对象。Optional config object
 */
Ext.data.Batch = Ext.extend(Ext.util.Observable, {
    /**
     * 当实例化该类的时候就是立刻进行批处理（默认为false）。True to immediately start processing the batch as soon as it is constructed (defaults to false)
     * @property autoStart
     * @type Boolean
     */
    autoStart: false,
    
    /**
     * 当前执行第几个的Opeartion。The index of the current operation being executed
     * @property current
     * @type Number
     */
    current: -1,
    
    /**
     * 该批处理中所有Operation的总数。只读的。
     * The total number of operations in this batch. Read only
     * @property total
     * @type Number
     */
    total: 0,
    
    /**
     * True表示为批处理正在运行着。
     * True if the batch is currently running
     * @property isRunning
     * @type Boolean
     */
    isRunning: false,
    
    /**
     * True表示为批处理已经执行完毕。True if this batch has been executed completely
     * @property isComplete
     * @type Boolean
     */
    isComplete: false,
    
    /**
     * True表示为该批处理遇到异常。轮到下一个操作执行时就会清除该值。True if this batch has encountered an exception. This is cleared at the start of each operation
     * @property hasException
     * @type Boolean
     */
    hasException: false,
    
    /**
     * True表示为，如果操作抛出一个异常，就自动暂停批处理的执行（默认为true）。
     * True to automatically pause the execution of the batch if any operation encounters an exception (defaults to true)
     * @property pauseOnException
     * @type Boolean
     */
    pauseOnException: true,
    
    constructor: function(config) {                
        this.addEvents(
          /**
           * @event complete
           * 当全部的操作都执行完毕后触发该事件。Fired when all operations of this batch have been completed
           * @param {Ext.data.Batch} batch 批处理对象。The batch object
           * @param {Object} operation 最后一个执行的操作对象。The last operation that was executed
           */
          'complete',
          
          /**
           * @event exception
           * 当抛出异常时触发该事件。Fired when a operation encountered an exception
           * @param {Ext.data.Batch} batch The batch object
           * @param {Object} operation 遭遇异常的那个操作对象。The operation that encountered the exception
           */
          'exception',
          
          /**
           * @event operationcomplete
           * 当批处理中每一个处理对象执行完成后触发。
           * Fired when each operation of the batch completes
           * @param {Ext.data.Batch} batch 批处理对象。The batch object
           * @param {Object} operation 上一个已完成的操作对象。The operation that just completed
           */
          'operationcomplete',
          
          //TODO: Remove this once we deprecate this function in 1.0. See below for further details
          'operation-complete'
        );
        
        Ext.data.Batch.superclass.constructor.call(this, config);
        
        /**
         * 已排序的操作对象。
         * Ordered array of operations that will be executed by this batch
         * @property operations
         * @type Array
         */
        this.operations = [];
    },
    
    /**
     * 加入一个新的操作对象到批处理。Adds a new operation to this batch
     * @param {Object} operation The {@link Ext.data.Operation Operation} object
     */
    add: function(operation) {
        this.total++;
        
        operation.setBatch(this);
        
        this.operations.push(operation);
    },
    
    /**
     * 开始执行批处理。如果前一个操作抛出异常继续执行下一个操作，除非异常要求暂停。
     * Kicks off the execution of the batch, continuing from the next operation if the previous
     * operation encountered an exception, or if execution was paused
     */
    start: function() {
        this.hasException = false;
        this.isRunning = true;
        
        this.runNextOperation();
    },
    
    /**
     * @private
     * 运行下个操作，关联到this.current。
     * Runs the next operation, relative to this.current.
     */
    runNextOperation: function() {
        this.runOperation(this.current + 1);
    },
    
    /**
     * 暂停批处理的执行，但不取消当前的操作。
     * Pauses execution of the batch, but does not cancel the current operation
     */
    pause: function() {
        this.isRunning = false;
    },
    
    /**
     * 指定一个索引，执行索引的操作。
     * Executes a operation by its numeric index
     * @param {Number} index 哪个索引？ The operation index to run
     */
    runOperation: function(index) {
        var operations = this.operations,
            operation  = operations[index];
        
        if (operation == undefined) {
            this.isRunning  = false;
            this.isComplete = true;
            this.fireEvent('complete', this, operations[operations.length - 1]);
        } else {
            this.current = index;
            
            var onProxyReturn = function(operation) {
                var hasException = operation.hasException();
                
                if (hasException) {
                    this.hasException = true;
                    this.fireEvent('exception', this, operation);
                } else {
                    //TODO: deprecate the dashed version of this event name 'operation-complete' as it breaks convention
                    //to be removed in 1.0
                    this.fireEvent('operation-complete', this, operation);
                    
                    this.fireEvent('operationcomplete', this, operation);
                }

                if (hasException && this.pauseOnException) {
                    this.pause();
                } else {
                    operation.setCompleted();
                    
                    this.runNextOperation();
                }
            };
            
            operation.setStarted();
            
            this.proxy[operation.action](operation, onProxyReturn, this);
        }
    }
});