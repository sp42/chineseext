/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.data.ScriptTagProxy
 * An implementation of Ext.data.DataProxy that reads a data object from a URL which may be in a domain
 * other than the originating domain of the running page.<br><br>
 * <p>
 * <em>Note that if you are retrieving data from a page that is in a domain that is NOT the same as the originating domain
 * of the running page, you must use this class, rather than DataProxy.</em><br><br>
 * <p>
 * The content passed back from a server resource requested by a ScriptTagProxy is executable JavaScript
 * source code that is used as the source inside a &lt;script> tag.<br><br>
 * <p>
 * In order for the browser to process the returned data, the server must wrap the data object
 * with a call to a callback function, the name of which is passed as a parameter by the ScriptTagProxy.
 * Below is a Java example for a servlet which returns data for either a ScriptTagProxy, or an HttpProxy
 * depending on whether the callback name was passed:
 * <p>
 /**
 * @ Ext.data.ScriptTagProxy类
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
</pre></code>
 *
 * @constructor
 * @param {Object} config A configuration object.
 */
 /*
 * @constructor
 * @param {Object} config一配置对象
 */
Ext.data.ScriptTagProxy = function(config){
    Ext.data.ScriptTagProxy.superclass.constructor.call(this);
    Ext.apply(this, config);
    this.head = document.getElementsByTagName("head")[0];
};

Ext.data.ScriptTagProxy.TRANS_ID = 1000;

Ext.extend(Ext.data.ScriptTagProxy, Ext.data.DataProxy, {
    /**
     * @cfg {String} url The URL from which to request the data object.
     */
	 /**
     * @cfg {String} url从该处请求数据的url.
     */
    /**
     * @cfg {Number} timeout (Optional) The number of milliseconds to wait for a response. Defaults to 30 seconds.
     */
	 /**
     * @cfg {Number} timeout (可选项) 等待响应的毫秒数.默认为30秒
     */
    timeout : 30000,
    /**
     * @cfg {String} callbackParam (Optional) The name of the parameter to pass to the server which tells
     * the server the name of the callback function set up by the load call to process the returned data object.
     * Defaults to "callback".<p>The server-side processing must read this parameter value, and generate
     * javascript output which calls this named function passing the data object as its only parameter.
     */
	  /**
     * @cfg {String} callbackParam (可选项) 传到服务器的参数的名字.通过这名字告诉服各器回调函数的名字,装载时装配该函数来
	 * 处理返回的数据对象,默认值为"callback". 服务器端处理必须读取该参数值.然后生成javascript输出.该javascript调用
	 * 该名字的函数作为自己的参数传递数据对象
     */
    callbackParam : "callback",
    /**
     *  @cfg {Boolean} nocache (Optional) Defaults to true. Disable cacheing by adding a unique parameter
     * name to the request.
     */
	 /**
     *  @cfg {Boolean} nocache (可选项) 默认值为true,添加一个独一无二的参数名到请求中来取消缓存
     */
    nocache : true,

    /**
     * Load data from the configured URL, read the data object into
     * a block of Ext.data.Records using the passed Ext.data.DataReader implementation, and
     * process that block using the passed callback.
     * @param {Object} params An object containing properties which are to be used as HTTP parameters
     * for the request to the remote server.
     * @param {Ext.data.DataReader} reader The Reader object which converts the data
     * object into a block of Ext.data.Records.
     * @param {Function} callback The function into which to pass the block of Ext.data.Records.
     * The function must be passed <ul>
     * <li>The Record block object</li>
     * <li>The "arg" argument from the load function</li>
     * <li>A boolean success indicator</li>
     * </ul>
     * @param {Object} scope The scope in which to call the callback
     * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
     */
	  /**
     * 从配置的url中装载数据,使用传入的Ext.data.DataReader实现来读取数据对象到Ext.data.Records块中.
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
	 /**
     * 中断当前的服务器请求
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
			 // 如果没有被装载,等待装载来移除前面的脚本错误
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