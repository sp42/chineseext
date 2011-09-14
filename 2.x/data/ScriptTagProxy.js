/**
 * @class Ext.data.ScriptTagProxy
 * @extends Ext.data.DataProxy
 * 一个{@link Ext.data.DataProxy}所实现的子类，能从一个与本页不同的域的URL地址上读取数据对象。<br>
 * <p>
 * <b>
 * 注意如果你从与一个本页所在域不同的地方获取数据的话，应该使用这个类，而非HttpProxy。</b><br>
 * </p>
 * 服务端返回的<b>必须是</b>JSON格式的数据，这是因为ScriptTagProxy是把返回的数据放在一个&lt;script>标签中保存的。<br>
 * <p>
 * 为了浏览器能够自动处理返回的数据，服务器应该在打包数据对象的同时，指定一个回调函数的函数名称，这个名称从ScriptTagProxy发出的参数送出。
 * 下面是一个Java中的Servlet例子，可适应ScriptTagProxy或者HttpProxy的情况，取决于是否有callback的参数送入:
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
 * @param {Object} config 配置项对象
 */
Ext.data.ScriptTagProxy = function(config){
    Ext.data.ScriptTagProxy.superclass.constructor.call(this);
    Ext.apply(this, config);
    this.head = document.getElementsByTagName("head")[0];
    
    /**
     * @event loadexception
     * Fires if an exception occurs in the Proxy during data loading.  This event can be fired for one of two reasons:
     * <ul><li><b>The load call timed out.</b>  This means the load callback did not execute within the time limit
     * specified by {@link #timeout}.  In this case, this event will be raised and the
     * fourth parameter (read error) will be null.</li>
     * <li><b>The load succeeded but the reader could not read the response.</b>  This means the server returned
     * data, but the configured Reader threw an error while reading the data.  In this case, this event will be 
     * raised and the caught error will be passed along as the fourth parameter of this event.</li></ul>
     * Note that this event is also relayed through {@link Ext.data.Store}, so you can listen for it directly
     * on any Store instance.
     * @param {Object} this
     * @param {Object} options The loading options that were specified (see {@link #load} for details).  If the load
     * call timed out, this parameter will be null.
     * @param {Object} arg The callback's arg object passed to the {@link #load} function
     * @param {Error} e The JavaScript Error object caught if the configured Reader could not read the data.
     * If the load call returned success: false, this parameter will be null.
     */
};

Ext.data.ScriptTagProxy.TRANS_ID = 1000;

Ext.extend(Ext.data.ScriptTagProxy, Ext.data.DataProxy, {
    /**
     * @cfg {String} url 请求数据对象的URL地址
     */
     
    /**
     * @cfg {Number} timeout (optional) 响应的超时限制。默认为30秒
     */
    timeout : 30000,
    
    /**
	 * @cfg {String} callbackParam 
	 * （可选的）这个值会作为参数传到服务端方面。默认是“callback”。
	 * 得到返回的数据后，客户端方面会执行callbackParam指定名称的函数，因此这个值必须要让服务端进行处理。这个函数将有一个唯一的参数，就是数据对象本身。
     */
    callbackParam : "callback",
    
    /**
     *  @cfg {Boolean} nocache （可选的）默认值为true，在请求中添加一个独一无二的参数来禁用缓存
     */
    nocache : true,
    
    /**
     * 根据指定的URL位置加载数据
     * 由指定的Ext.data.DataReader实例来解析这个Ext.data.Records块，并由指定的回调来处理这个块。
     * @param {Object} params 一个对象，其属性用于向远端服务器作HTTP请求时所用的参数
     * @param {Ext.data.DataReader} reader 能转换数据为Ext.data.Records块的Reader对象
     * @param {Function} callback 会送入Ext.data.records块的函数。函数一定会传入这些参数：<ul>
     * <li>Record对象t</li>
     * <li>从load函数那里来的参数"arg"</li>
     * <li>是否成功的标识符</li>
     * </ul>
     * @param {Object} scope 回调函数的作用域
     * @param {Object} arg 送入到回调函数的参数，在参数第二个位置中出现（可选的）
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

/**
 * @class Ext.data.ScriptTagProxy
 * @extends Ext.data.DataProxy
 * Ext.data.DataProxy实现类,从原始域(原始域指当前运行页所在的域)而是其它域读取数据对象<br><br>
 * <p>
 * <em>注意:如果你从一非本域运行的页面获取的数据与从本域获取数据不同,你必须使用此类来操作,而不是使用DataProxy.</em><br><br>
 * <p>
 * 被一ScriptTagProxy请求的从服务器资源传回的内容是可执行的javascript脚本,在<script>标签中被当作源.<br><br>
 * <p>
 * 为了使浏览器能处理返回的数据,服务器必须用对回调函数的调用来封装数据对象.它的名字为作为参数被scriptTagProxy传入
 * 下面是一个java的小程序例子.它将返回数据到scriptTagProxy或httpProxy,取决于是否有回调函数名
 * <p>
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
 * @param {Object} config 配置项对象
 */
Ext.data.ScriptTagProxy = function(config){
    Ext.data.ScriptTagProxy.superclass.constructor.call(this);
    Ext.apply(this, config);
    this.head = document.getElementsByTagName("head")[0];
};

Ext.data.ScriptTagProxy.TRANS_ID = 1000;

Ext.extend(Ext.data.ScriptTagProxy, Ext.data.DataProxy, {

     /**
     * @cfg {String} url从该处请求数据的url.
     */

    /**
     * @cfg {Number} timeout (可选项) 等待响应的毫秒数.默认为30秒
     */
    timeout : 30000,

    /**
     * @cfg {String} callbackParam (可选项) 传到服务器的参数的名字.通过这名字告诉服各器回调函数的名字,装载时装配该函数来
	 * 处理返回的数据对象,默认值为"callback". 服务器端处理必须读取该参数值.然后生成javascript输出.该javascript调用
	 * 该名字的函数作为自己的参数传递数据对象
     */
    callbackParam : "callback",

     /**
     *  @cfg {Boolean} nocache (可选项) 默认值为true,添加一个独一无二的参数名到请求中来取消缓存
     */
    nocache : true,

     /**
     * 从配置的url中加载数据,使用传入的Ext.data.DataReader实现来读取数据对象到Ext.data.Records块中.
	 * 并通过传入的回调函数处理该数据块
     * @param {Object} params 一包含属性的对象,这些属性被用来当作向远程服务器发送的请求http 参数.
     * @param {Ext.data.DataReader} reader 转换数据对象到Ext.data.Records块的Reader对象.
     * @param {Function} callback 传入Ext.data.Record的函数.
     * 该函数必须被传入<ul>
     * <li>记录块对象</li>
     * <li>来自load函数的参数</li>
     * <li>布尔值的成功指示器</li>
     * </ul>
     * @param {Object} scope 回调函数的作用域
     * @param {Object} arg 被传到回调函数中作为第二参数的可选参数.
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