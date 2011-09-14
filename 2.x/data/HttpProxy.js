/**
 * @class Ext.data.HttpProxy
 * @extends Ext.data.DataProxy
 * 一个{@link Ext.data.DataProxy}所实现的子类，能从{@link Ext.data.Connection Connection}（针对某个URL地址）对象读取数据。<br>
 * <b>
 * 注意这个类不能跨域（Cross Domain）获取数据。<br>
 * 要进行跨域获取数据，请使用{@link Ext.data.ScriptTagProxy ScriptTagProxy}。</b><br>
 * <em>为了浏览器能成功解析返回来的XML document对象，HHTP Response的content-type 头必须被设成text/xml。</em>
 * @constructor
 * @param {Object} conn 一个{@link Ext.data.Connection}对象，或像{@link Ext.Ajax#request}那样的配置项。
 * 如果是配置项，那么就会创建一个为这次请求服务的{@link Ext.Ajax}单件对象。
 */
Ext.data.HttpProxy = function(conn){
    Ext.data.HttpProxy.superclass.constructor.call(this);
   /**
    * Connection对象（或是{@link Ext.Ajax.request}配置项）。这个HttpProxy实例会使用这个Connection对象对服务端发起请求。
    * 该对象的属性可能会随着请求的数据改变而改变。
    * @property
    */
    this.conn = conn;
    this.useAjax = !conn || !conn.events;

	 /**
	 * @event loadexception
	 * Proxy在加载数据期间，有异常发生时就触发该事件。注意该事件是与{@link Ext.data.Store}对象联动的，所以你只监听其中一个事件就可以的了。
	 * @param {Object} this 此DataProxy 对象.
	 * @param {Object} o 数据对象.
	 * @param {Object} arg  传入{@link #load}函数的回调参数对象
     * @param {Object} null 使用MemoryProxy的这就一直是null
     * @param {Error} e 如果Reader不能读取数据就抛出一个JavaScript Error对象
	 */

    /**
     * @event loadexception
     * Fires if an exception occurs in the Proxy during data loading.  This event can be fired for one of two reasons:
     * <ul><li><b>The load call returned success: false.</b>  This means the server logic returned a failure
     * status and there is no data to read.  In this case, this event will be raised and the
     * fourth parameter (read error) will be null.</li>
     * <li><b>The load succeeded but the reader could not read the response.</b>  This means the server returned
     * data, but the configured Reader threw an error while reading the data.  In this case, this event will be 
     * raised and the caught error will be passed along as the fourth parameter of this event.</li></ul>
     * Note that this event is also relayed through {@link Ext.data.Store}, so you can listen for it directly
     * on any Store instance.
     * @param {Object} this
     * @param {Object} options The loading options that were specified (see {@link #load} for details)
     * @param {Object} response The XMLHttpRequest object containing the response data
     * @param {Error} e The JavaScript Error object caught if the configured Reader could not read the data.
     * If the load call returned success: false, this parameter will be null.
     */
};

Ext.extend(Ext.data.HttpProxy, Ext.data.DataProxy, {
    /**
     * 返回这个Proxy所调用的{@link Ext.data.Connection}。
     * @return {Connection} Connection对象。该对象可以被用来订阅事件，而且比DataProxy事件更细微的颗粒度
     */
    getConnection : function(){
        return this.useAjax ? Ext.Ajax : this.conn;
    },

    /**
     * 根据指定的URL位置加载数据
     * 由指定的Ext.data.DataReader实例来解析这个Ext.data.Records块，并由指定的回调来处理这个块。
     * @param {Object} params 一个对象，其属性用于向远端服务器作HTTP请求时所用的参数
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
        if(this.fireEvent("beforeload", this, params) !== false){
            var  o = {
                params : params || {},
                request: {
                    callback : callback,
                    scope : scope,
                    arg : arg
                },
                reader: reader,
                callback : this.loadResponse,
                scope: this
            };
            if(this.useAjax){
                Ext.applyIf(o, this.conn);
                if(this.activeRequest){
                    Ext.Ajax.abort(this.activeRequest);
                }
                this.activeRequest = Ext.Ajax.request(o);
            }else{
                this.conn.request(o);
            }
        }else{
            callback.call(scope||this, null, arg, false);
        }
    },

    // private
    loadResponse : function(o, success, response){
        delete this.activeRequest;
        if(!success){
            this.fireEvent("loadexception", this, o, response);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        var result;
        try {
            result = o.reader.read(response);
        }catch(e){
            this.fireEvent("loadexception", this, o, response, e);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        this.fireEvent("load", this, o, o.request.arg);
        o.request.callback.call(o.request.scope, result, o.request.arg, true);
    },
    
    // private
    update : function(dataSet){
        
    },
    
    // private
    updateResponse : function(dataSet){
        
    }
});