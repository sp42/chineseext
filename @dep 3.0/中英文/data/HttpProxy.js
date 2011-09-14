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
 * @class Ext.data.HttpProxy
 * @extends Ext.data.DataProxy
 * 一个{@link Ext.data.DataProxy}所实现的子类，能从{@link Ext.data.Connection Connection}（针对某个URL地址）对象读取数据。<br />
 * An implementation of {@link Ext.data.DataProxy} that reads a data object from a {@link Ext.data.Connection Connection} object
 * configured to reference a certain URL.
 * @constructor
 * @param {Object} conn 一个{@link Ext.data.Connection}对象，或像{@link Ext.Ajax#request}那样的配置项。
 * 如果是配置项，那么就会创建一个为这次请求服务的{@link Ext.Ajax}单件对象。
 * An implementation of {@link Ext.data.DataProxy} that reads a data object from a {@link Ext.data.Connection Connection} object
 * configured to reference a certain URL.<br>
 * <b>注意这个类不能脱离本页面的范围进行跨域（Cross Domain）获取数据。
 * Note that this class cannot be used to retrieve data from a domain other than the domain
 * from which the running page was served.</b><br>
 * 要进行跨域获取数据，请使用{@link Ext.data.ScriptTagProxy ScriptTagProxy}。
 * For cross-domain access to remote data, use a {@link Ext.data.ScriptTagProxy ScriptTagProxy}.
 * <br>
 * 为了浏览器能成功解析返回来的XML document对象，HTTP Response的content-type 头必须被设成为text/xml。
 * Be aware that to enable the browser to parse an XML document, the server must set
 * the Content-Type header in the HTTP response to "text/xml".
 * @constructor
 * @param {Object} conn 一个{@link Ext.data.Connection}对象，或者{@link Ext.Ajax#request}选项参数。<br />
 * an {@link Ext.data.Connection} object, or options parameter to {@link Ext.Ajax#request}.
 * <p>
 * 注意如果该HttpProxy正在使用的是{@link Ext.data.Store Store}，那么Store的{@link #load}调用将会覆盖全部指定的<tt>callback</tt>与<tt>params</tt>选项。
 * 这样，在Store的{@link Ext.data.Store#events events}那里就可以改变参数，或处理加载事件。
 * 在实例化的时候就会使用了Store的{@link Ext.data.Store#baseParams baseParams}。<br />
 * Note that if this HttpProxy is being used by a {@link Ext.data.Store Store}, then the Store's call to
 * {@link #load} will override any specified <tt>callback</tt> and <tt>params</tt> options. In this
 * case, use the Store's {@link Ext.data.Store#events events} to modify parameters, or react to loading events.
 * The Store's {@link Ext.data.Store#baseParams baseParams} may also be used to pass parameters known at
 * instantiation time.
 * </p>
 * <p>如果传入一个选项参数，那么就即会使用{@link Ext.Ajax}这个单例对象进行网络通讯。If an options parameter is passed, the singleton {@link Ext.Ajax} object will be used to make the request.</p>
 */
Ext.data.HttpProxy = function(conn){
    Ext.data.HttpProxy.superclass.constructor.call(this);
    /**
     * 向服务器端方面负责发起请求的Connection对象（或者是{@link Ext.Ajax#request}参数对象）。
     * 当请求数据的方式改变时该对象的这个属性也会应因应改变。
     * The Connection object (Or options parameter to {@link Ext.Ajax#request}) which this HttpProxy uses to make requests to the server.
     * Properties of this object may be changed dynamically to change the way data is requested.
     * @type Connection
     * @property conn
     */
    this.conn = conn;
    this.useAjax = !conn || !conn.events;
    
    /**
     * @event loadexception
     * 当数据加载的时候如有错误发生触发该事件。发生该事件归咎于两种原因：
     * Fires if an exception occurs in the Proxy during data loading.  This event can be fired for one of two reasons:
     * <ul><li><b>load方法返回success: false。The load call returned success: false.</b>  
     * 这表示服务端逻辑返回错误的状态信号，没有可用的数据。这样该事件将会触发而第四个参数（读错误）将是null。
     * This means the server logic returned a failure
     * status and there is no data to read.  In this case, this event will be raised and the
     * fourth parameter (read error) will be null.</li>
     * <li><b>虽然load方法成功了，但reader不能够读取响应的数据。The load succeeded but the reader could not read the response.</b>  
     * 这表示服务端是返回了数据，但解析数据时有问题，已配置好的Reader就抛出异常。这样会触发该事件并将捕获的异常放在该事件的第四个参数中。
     * 注意该事件依赖了{@link Ext.data.Store}，所以你也可以直接在任意一个Store实例上侦听事件。
     * This means the server returned data, but the configured Reader threw an error while reading the data.  In this case, this event will be 
     * raised and the caught error will be passed along as the fourth parameter of this event.</li></ul>
     * Note that this event is also relayed through {@link Ext.data.Store}, so you can listen for it directly
     * on any Store instance.
     * @param {Object} this
     * @param {Object} options 指定的加载选项（请参阅{@link #load}）。The loading options that were specified (see {@link #load} for details)
     * @param {Object} response 包含响应数据的XMLHttpRequest对象。The XMLHttpRequest object containing the response data
     * @param {Error} e 已准备好的Reader无法读取数据的情况下，捕获的JavaScript Error对象。
     * 如果load调用返回success: false的话，该参数为null。
     * The JavaScript Error object caught if the configured Reader could not read the data.
     * If the load call returned success: false, this parameter will be null.
     */
};

Ext.extend(Ext.data.HttpProxy, Ext.data.DataProxy, {
    /**
     * 返回这个Proxy所调用的{@link Ext.data.Connection}。
     * Return the {@link Ext.data.Connection} object being used by this Proxy.
     * @return {Connection} {Connection} Connection对象。该对象可以被用来订阅事件，而且比DataProxy事件更细微的颗粒度。
     * The Connection object. This object may be used to subscribe to events on
     * a finer-grained basis than the DataProxy events.
     */
    getConnection : function(){
        return this.useAjax ? Ext.Ajax : this.conn;
    },

    /**
     * 根据指定的URL位置加载数据（透过一个配置好的{@link Ext.data.Connection}）。
     * 由指定的{@link Ext.data.DataReader}实例来解析这个Ext.data.Records块，并由指定的回调来处理这个块。
     * Load data from the configured {@link Ext.data.Connection}, read the data object into
     * a block of Ext.data.Records using the passed {@link Ext.data.DataReader} implementation, and
     * process that block using the passed callback.
     * @param {Object} params 一个对象，其属性用于向远端服务器作HTTP请求时所用的参数。An object containing properties which are to be used as HTTP parameters
     * for the request to the remote server.
     * @param {Ext.data.DataReader} reader 能转换数据为Ext.data.Records块的Reader对象。The Reader object which converts the data
     * object into a block of Ext.data.Records.
     * @param {Function} callback 会送入Ext.data.records块的函数。函数一定会传入：The function into which to pass the block of Ext.data.Records.
     * The function must be passed <ul>
     * <li>Record对象。The Record block object</li>
     * <li>从load函数那里来的参数"arg"。The "arg" argument from the load function</li>
     * <li>是否成功的标识符。A boolean success indicator</li>
     * </ul>
     * @param {Object} scope 回调函数的作用域。The scope in which to call the callback
     * @param {Object} arg 送入到回调函数的参数，在参数第二个位置中出现（可选的）。An optional argument which is passed to the callback as its second parameter.
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