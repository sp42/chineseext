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
 * @class Ext.data.ScriptTagProxy
 * @extends Ext.data.DataProxy
 * 一个{@link Ext.data.DataProxy}所实现的子类，能从一个与本页不同的域的URL地址上读取数据对象。<br />
 * An implementation of Ext.data.DataProxy that reads a data object from a URL which may be in a domain
 * other than the originating domain of the running page.<br>
 * <p>
 * <b>注意如果你从与一个本页所在域不同的地方获取数据的话，应该使用这个类，而非HttpProxy。<br />
 * Note that if you are retrieving data from a page that is in a domain that is NOT the same as the originating domain
 * of the running page, you must use this class, rather than HttpProxy.</b><br>
 * </p>
 * 服务端返回的必须是JSON格式的数据，这是因为ScriptTagProxy是把返回的数据放在一个&lt;script>标签中保存的。<br />
 * The content passed back from a server resource requested by a ScriptTagProxy <b>must</b> be executable JavaScript
 * source code because it is used as the source inside a &lt;script> tag.<br>
 * <p>为了浏览器能够自动处理返回的数据，服务器应该在打包数据对象的同时，指定一个回调函数的函数名称，这个名称从ScriptTagProxy发出的参数送出。
 * 下面是一个Java中的Servlet例子，可适应ScriptTagProxy或者HttpProxy的情况，取决于是否有callback的参数送入:<br />
 * In order for the browser to process the returned data, the server must wrap the data object
 * with a call to a callback function, the name of which is passed as a parameter by the ScriptTagProxy.
 * Below is a Java example for a servlet which returns data for either a ScriptTagProxy, or an HttpProxy
 * depending on whether the callback name was passed:
 * </p>
 * <pre><code>
boolean scriptTag = false;
String cb = request.getParameter("callback");
if (cb != null) {
    scriptTag = true;
    response.setContentType("text/javascript");
} else {
    response.setContentType("application/x-json");
}
Writer out = response.getWriter();
if (scriptTag) {
    out.write(cb + "(");
}
out.print(dataBlock.toJsonString());
if (scriptTag) {
    out.write(");");
}
</code></pre>
 *
 * @constructor
 * @param {Object} config 配置项对象 A configuration object.
 */
Ext.data.ScriptTagProxy = function(config){
    Ext.data.ScriptTagProxy.superclass.constructor.call(this);
    Ext.apply(this, config);
    this.head = document.getElementsByTagName("head")[0];
    
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

Ext.data.ScriptTagProxy.TRANS_ID = 1000;

Ext.extend(Ext.data.ScriptTagProxy, Ext.data.DataProxy, {
    /**
     * @cfg {String} url 请求数据对象的URL地址。
     * The URL from which to request the data object.
     */
    /**
     * @cfg {Number} timeout (optional) 响应的超时限制。默认为30秒。
     * The number of milliseconds to wait for a response. Defaults to 30 seconds.
     */
    timeout : 30000,
    /**
     * @cfg {String} callbackParam (Optional) （可选的）这个值会作为参数传到服务端方面。默认是“callback”。
     * The name of the parameter to pass to the server which tells
     * the server the name of the callback function set up by the load call to process the returned data object. Defaults to "callback".
     * <p>得到返回的数据后，客户端方面会执行callbackParam指定名称的函数，因此这个值必须要让服务端进行处理。这个函数将有一个唯一的参数，就是数据对象本身。The server-side processing must read this parameter value, and generate
     * javascript output which calls this named function passing the data object as its only parameter.
     */
    callbackParam : "callback",
    /**
     *  @cfg {Boolean} nocache (optional) （可选的）默认值为true，在请求中添加一个独一无二的参数来禁用缓存。
     *  Defaults to true. Disable caching by adding a unique parameter name to the request.
     */
    nocache : true,

    /**
     * 根据指定的URL位置加载数据。
     * 由指定的Ext.data.DataReader实例来解析这个Ext.data.Records块，并由指定的回调来处理这个块。
     * Load data from the configured URL, read the data object into
     * a block of Ext.data.
     * Records using the passed Ext.data.DataReader implementation, and process that block using the passed callback.
     * @param {Object} params  一个对象，其属性用于向远端服务器作HTTP请求时所用的参数。
     * An object containing properties which are to be used as HTTP parameters
     * for the request to the remote server.
     * @param {Ext.data.DataReader} reader 能转换数据为Ext.data.Records块的Reader对象。
     * The Reader object which converts the data
     * object into a block of Ext.data.Records.
     * @param {Function} callback 会送入Ext.data.records块的函数。函数一定会传入这些参数：
     * The function into which to pass the block of Ext.data.Records.
     * The function must be passed <ul>
     * <li>Record对象 The Record block object</li>
     * <li>从load函数那里来的参数"arg"。The "arg" argument from the load function</li>
     * <li>是否成功的标识符。A boolean success indicator</li>
     * </ul>
     * @param {Object} scope 回调函数的作用域。The scope in which to call the callback
     * @param {Object} arg 送入到回调函数的参数，在参数第二个位置中出现（可选的）。An optional argument which is passed to the callback as its second parameter.
     */
    load : function(params, reader, callback, scope, arg){
        if(this.fireEvent("beforeload", this, params) !== false){

            var p = Ext.urlEncode(Ext.apply(params, this.extraParams));

            var url = this.url;
            url += (url.indexOf("?") != -1 ? "&" : "?") + p;
            if(this.nocache){
                url += "&_dc=" + (new Date().getTime());
            }
            var transId = ++Ext.data.ScriptTagProxy.TRANS_ID;
            var trans = {
                id : transId,
                cb : "stcCallback"+transId,
                scriptId : "stcScript"+transId,
                params : params,
                arg : arg,
                url : url,
                callback : callback,
                scope : scope,
                reader : reader
            };
            var conn = this;

            window[trans.cb] = function(o){
                conn.handleResponse(o, trans);
            };

            url += String.format("&{0}={1}", this.callbackParam, trans.cb);

            if(this.autoAbort !== false){
                this.abort();
            }

            trans.timeoutId = this.handleFailure.defer(this.timeout, this, [trans]);

            var script = document.createElement("script");
            script.setAttribute("src", url);
            script.setAttribute("type", "text/javascript");
            script.setAttribute("id", trans.scriptId);
            this.head.appendChild(script);

            this.trans = trans;
        }else{
            callback.call(scope||this, null, arg, false);
        }
    },

    // private
    isLoading : function(){
        return this.trans ? true : false;
    },

    /**
     * Abort the current server request.
     */
    abort : function(){
        if(this.isLoading()){
            this.destroyTrans(this.trans);
        }
    },

    // private
    destroyTrans : function(trans, isLoaded){
        this.head.removeChild(document.getElementById(trans.scriptId));
        clearTimeout(trans.timeoutId);
        if(isLoaded){
            window[trans.cb] = undefined;
            try{
                delete window[trans.cb];
            }catch(e){}
        }else{
            // if hasn't been loaded, wait for load to remove it to prevent script error
            window[trans.cb] = function(){
                window[trans.cb] = undefined;
                try{
                    delete window[trans.cb];
                }catch(e){}
            };
        }
    },

    // private
    handleResponse : function(o, trans){
        this.trans = false;
        this.destroyTrans(trans, true);
        var result;
        try {
            result = trans.reader.readRecords(o);
        }catch(e){
            this.fireEvent("loadexception", this, o, trans.arg, e);
            trans.callback.call(trans.scope||window, null, trans.arg, false);
            return;
        }
        this.fireEvent("load", this, o, trans.arg);
        trans.callback.call(trans.scope||window, result, trans.arg, true);
    },

    // private
    handleFailure : function(trans){
        this.trans = false;
        this.destroyTrans(trans, false);
        this.fireEvent("loadexception", this, null, trans.arg);
        trans.callback.call(trans.scope||window, null, trans.arg, false);
    }
});