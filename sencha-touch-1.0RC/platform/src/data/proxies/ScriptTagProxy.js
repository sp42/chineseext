Ext.apply(Ext, {
    /**
     * Returns the current document body as an {@link Ext.Element}.
     * @ignore
     * @memberOf Ext
     * @return Ext.Element The document body
     */
    getHead : function() {
        var head;
        
        return function() {
            if (head == undefined) {
                head = Ext.get(document.getElementsByTagName("head")[0]);
            }
            
            return head;
        };
    }()
});

/*
 * @version Sencha 1.0 RC-1
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
 * @class Ext.data.ScriptTagProxy
 * @extends Ext.data.ServerProxy
 * 
 * <p>
 * 一个{@link Ext.data.DataProxy}所实现的子类，能从一个与本页不同的域的URL地址上读取数据对象。<br />
 * An implementation of Ext.data.DataProxy that reads a data object from a URL which may be in a domain
 * other than the originating domain of the running page.</p>
 * 
 * <p><b>
 * 注意如果你从与一个本页所在域不同的地方获取数据的话，应该使用这个类，而非HttpProxy。
 * Note that if you are retrieving data from a page that is in a domain that is NOT the same as the originating domain
 * of the running page, you must use this class, rather than HttpProxy.</b></p>
 * 
 * <p>
 * 透过ScriptTagProxy获取回来的服务端内容必须得是合法可执行的JavaScript代码，因为这都是在&lt;script>中执行的。
 * The content passed back from a server resource requested by a ScriptTagProxy <b>must</b> be executable JavaScript
 * source code because it is used as the source inside a &lt;script> tag.</p>
 * 
 * <p>
 * 为了浏览器能够自动处理返回的数据，服务器应该在打包数据对象的同时，指定一个回调函数的函数名称，这个名称从ScriptTagProxy发出的参数送出。
 * 下面是一个Java中的Servlet例子，可适应ScriptTagProxy或者HttpProxy的情况，取决于是否有callback的参数送入:
 * In order for the browser to process the returned data, the server must wrap the data object
 * with a call to a callback function, the name of which is passed as a parameter by the ScriptTagProxy.
 * Below is a Java example for a servlet which returns data for either a ScriptTagProxy, or an HttpProxy
 * depending on whether the callback name was passed:</p>
 * 
<pre><code>
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
 * <p>下面的PHP例子同样如是：Below is a PHP example to do the same thing:</p><pre><code>
$callback = $_REQUEST['callback'];

// 定义输出对象。Create the output object.
$output = array('a' => 'Apple', 'b' => 'Banana');

// 开始输出 start output
if ($callback) {
    header('Content-Type: text/javascript');
    echo $callback . '(' . json_encode($output) . ');';
} else {
    header('Content-Type: application/x-json');
    echo json_encode($output);
}
</code></pre>
 * 
 * <p>下面的ASP.Net同样如是：Below is the ASP.Net code to do the same thing:</p>
 * 
<pre><code>
String jsonString = "{success: true}";
String cb = Request.Params.Get("callback");
String responseString = "";
if (!String.IsNullOrEmpty(cb)) {
    responseString = cb + "(" + jsonString + ")";
} else {
    responseString = jsonString;
}
Response.Write(responseString);
</code></pre>
 *
 */
Ext.data.ScriptTagProxy = Ext.extend(Ext.data.ServerProxy, {
    defaultWriterType: 'base',
  
    /**
     * @cfg {String} callbackParam (Optional) （可选的）这个值会作为参数传到服务端方面。默认是“callback”。The name of the parameter to pass to the server which tells
     * the server the name of the callback function set up by the load call to process the returned data object.
     * Defaults to "callback".<p>
     * 得到返回的数据后，客户端方面会执行callbackParam指定名称的函数，因此这个值必须要让服务端进行处理。这个函数将有一个唯一的参数，就是数据对象本身。
     * The server-side processing must read this parameter value, and generate
     * javascript output which calls this named function passing the data object as its only parameter.
     */
    callbackParam : "callback",
    
    /**
     * @cfg {String} scriptIdPrefix
     * 为注入的script标签元素创建其独一无二的ID字符串（默认为“stcScript”）。
     * The prefix string that is used to create a unique ID for the injected script tag element (defaults to 'stcScript')
     */
    scriptIdPrefix: 'stcScript',
    
    /**
     * @cfg {String} callbackPrefix
     * 在全局空间中，创建一个独特的回调函数。这是该函数名称的前缀字符串。如果对服务器通话时，需要修改服务器生成的回调函数其名称，可以修改这项。默认为“stcCallback”。
     * The prefix string that is used to create a unique callback function name in the global scope. This can optionally
     * be modified to give control over how the callback string passed to the remote server is generated. Defaults to 'stcCallback'
     */
    callbackPrefix: 'stcCallback',
    
    /**
     * @cfg {String} recordParam
     * 当传送记录到服务器时所用的参数名称（如“records=someEncodedRecordString”）。默认为“records”
     * The param name to use when passing records to the server (e.g. 'records=someEncodedRecordString').
     * Defaults to 'records'
     */
    recordParam: 'records',
    
    /**
     * 这是记录最近通过Proxy所产生的请求对象。当Proxy被销毁会内部用来清理。
     * Reference to the most recent request made through this Proxy. Used internally to clean up when the Proxy is destroyed
     * @property lastRequest 
     * @type Ext.data.Request
     */
    lastRequest: undefined,
    
    /**
     * @cfg {Boolean} autoAppendParams True表示为自动添加请求的参数到生成的URL。默认为true。True to automatically append the request's params to the generated url. Defaults to true
     */
    autoAppendParams: true,
    
    constructor: function(){
        this.addEvents(
            /**
             * @event exception
             * 当服务器返回一个异常时触发该事件。
             * Fires when the server returns an exception
             * @param {Ext.data.Proxy} this
             * @param {Ext.data.Request} request 发出的请求对象。The request that was sent
             * @param {Ext.data.Operation} operation 请求所触发的操作对象。The operation that triggered the request
             */
            'exception'
        );
        
        Ext.data.ScriptTagProxy.superclass.constructor.apply(this, arguments);    
    },

    /**
     * @private
     * 执行一个通往远程域的读取请求。ScriptTagProxy不会产生AJAX请求，而是依据内置的Ext.data.Request对象动态创建一个<script>标签来进行。
     * Performs the read request to the remote domain. ScriptTagProxy does not actually create an Ajax request,
     * instead we write out a&lt;script> tag based on the configuration of the internal Ext.data.Request object
     * @param {Ext.data.Operation} operation 要执行的{@link Ext.data.Operation Operation}对象。The {@link Ext.data.Operation Operation} object to execute
     * @param {Function} callback 当请求对象完成后执行的回调函数。A callback function to execute when the Operation has been completed
     * @param {Object} scope 回调函数所执行的作用域。The scope to execute the callback in
     */
    doRequest: function(operation, callback, scope) {
        //generate the unique IDs for this request
        var format     = Ext.util.Format.format,
            transId    = ++Ext.data.ScriptTagProxy.TRANS_ID,
            scriptId   = format("{0}{1}", this.scriptIdPrefix, transId),
            stCallback = format("{0}{1}", this.callbackPrefix, transId);
        
        var writer  = this.getWriter(),
            request = this.buildRequest(operation),
            //FIXME: ideally this would be in buildUrl, but we don't know the stCallback name at that point
            url     = Ext.urlAppend(request.url, format("{0}={1}", this.callbackParam, stCallback));
            
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
        
        // 根据ScriptTagProxy的特殊属性应用在请求对象身上。
        //apply ScriptTagProxy-specific attributes to the Request
        Ext.apply(request, {
            url       : url,
            transId   : transId,
            scriptId  : scriptId,
            stCallback: stCallback
        });
        
        // 如果请求太久了就会执行这个超时函数取消它。
        //if the request takes too long this timeout function will cancel it
        request.timeoutId = Ext.defer(this.createTimeoutHandler, this.timeout, this, [request, operation]);
        
        // 这是请求完成后就会执行的回调函数。
        //this is the callback that will be called when the request is completed
        window[stCallback] = this.createRequestCallback(request, operation, callback, scope);
        
        // 创建注入到document的script标签名称。
        //create the script tag and inject it into the document
        var script = document.createElement("script");
        script.setAttribute("src", url);
        script.setAttribute("async", true);
        script.setAttribute("type", "text/javascript");
        script.setAttribute("id", scriptId);
        
        Ext.getHead().appendChild(script);
        operation.setStarted();
        
        this.lastRequest = request;
        
        return request;
    },
    
    /**
     * @private
     * 创建并返回一个用于完成请求之时就要执行的函数。返回的函数应该要接受一个Response对象，该对象应该包含会给配置好Reader来解析的那些响应信息。
     * 第三个参数就是完成请求后所执行的回调函数，并由Reader解码Repsonse。典型地，这个回调会被传入到一个Store，如proxy.read(operation, theCallback, scope)
     * 这儿的代码还会决定回调其参数是什么。
     * Creates and returns the function that is called when the request has completed. The returned function
     * should accept a Response object, which contains the response to be read by the configured Reader.
     * The third argument is the callback that should be called after the request has been completed and the Reader has decoded
     * the response. This callback will typically be the callback passed by a store, e.g. in proxy.read(operation, theCallback, scope)
     * theCallback refers to the callback argument received by this function.
     * See {@link #doRequest} for details.
     * @param {Ext.data.Request} request 请求对象。The Request object
     * @param {Ext.data.Operation} operation 正在执行的Opearion对象。The Operation being executed
     * @param {Function} callback 当完成请求后执行的回调函数。通常这是传入到doRquest的回调函数。The callback function to be called when the request completes. This is usually the callback
     * passed to doRequest
     * @param {Object} scope 回调函数所执行的作用域。The scope in which to execute the callback function
     * @return {Function} 回调函数。The callback function
     */
    createRequestCallback: function(request, operation, callback, scope) {
        var me = this;
        
        return function(response) {
            var reader = me.getReader(),
                result = reader.read(response);
            
            //see comment in buildRequest for why we include the response object here
            Ext.apply(operation, {
                response : response,
                resultSet: result
            });
            
            operation.setCompleted();
            operation.setSuccessful();
            
            //this callback is the one that was passed to the 'read' or 'write' function above
            if (typeof callback == 'function') {
                callback.call(scope || me, operation);
            }
            
            me.afterRequest(request, true);
        };
    },
    
    /**
     * 当完成了请求之后，通过移除DOM中无用的script标签，执行的清理动作。
     * Cleans up after a completed request by removing the now unnecessary script tag from the DOM. Also removes the 
     * global JSON-P callback function.
     * @param {Ext.data.Request} request 请求对象。The request object
     * @param {Boolean} isLoaded True表示为已经成功完成了请求。True if the request completed successfully
     */
    afterRequest: function() {
    	// 清除函数
        var cleanup = function(functionName) {
            return function() {
                window[functionName] = undefined;
                
                try {
                    delete window[functionName];
                } catch(e) {}
            };
        };
        
        return function(request, isLoaded) {
            Ext.get(request.scriptId).remove();
            clearTimeout(request.timeoutId);
            
            var callbackName = request.stCallback;
            
            if (isLoaded) {
            	// 为何需要多个函数？直接cleanup()不可？
                cleanup(callbackName)();
                this.lastRequest.completed = true;
            } else {
            	// 原来是表示为加载完毕，所以还需要调用函数，不过就覆盖旧函数，变为cleanup的函数。也就是cleanup返回函数的原因。
                // if we haven't loaded yet, the callback might still be called in the future so don't unset it immediately
                window[callbackName] = cleanup(callbackName);
            }
        };
    }(),
    
    /**
     * 根据给出的Ext.data.Request生成一个url。还会替url加上参数和回调函数其名称。
     * Generates a url based on a given Ext.data.Request object. Adds the params and callback function name to the url
     * @param {Ext.data.Request} request The request object
     * @return {String} The url
     */
    buildUrl: function(request) {
        var url     = Ext.data.ScriptTagProxy.superclass.buildUrl.call(this, request),  
            params  = Ext.apply({}, request.params),
            filters = params.filters,
            filter, i;
            
        delete params.filters;
        
        if (this.autoAppendParams) {
            url = Ext.urlAppend(url, Ext.urlEncode(params));
        }
        
        if (filters.length) {
            for (i = 0; i < filters.length; i++) {
                filter = filters[i];
                
                if (filter.value) {
                    url = Ext.urlAppend(url, filter.property + "=" + filter.value);
                }
            }
        }
        // 如果遇到多个记录，每个都要加上url。
        //if there are any records present, append them to the url also
        var records = request.records;
        
        if (Ext.isArray(records) && records.length > 0) {
            url = Ext.urlAppend(url, Ext.util.Format.format("{0}={1}", this.recordParam, this.encodeRecords(records)));
        }
        
        return url;
    },
    
    //inherit docs
    destroy: function() {
        this.abort();
        
        Ext.data.ScriptTagProxy.superclass.destroy.apply(this, arguments);
    },
        
    /**
     * @private
     * @return {Boolean} True表示为当前全球尚未完成。True if there is a current request that hasn't completed yet
     */
    isLoading : function(){
        var lastRequest = this.lastRequest;
        
        return (lastRequest != undefined && !lastRequest.completed);
    },
    
    /**
     * 如果请求中执行该方法会终止请求。
     * Aborts the current server request if one is currently running
     */
    abort: function() {
        if (this.isLoading()) {
            this.afterRequest(this.lastRequest);
        }
    },
        
    /**
     * 对script标签的src地址添加适合的字符串，这是对Records而言的。这是从原来的函数中分裂出来，这样才能方便地为大家来重写。
     * Encodes an array of records into a string suitable to be appended to the script src url. This is broken
     * out into its own function so that it can be easily overridden.
     * @param {Array} records 记录数组。The records array
     * @return {String} 已编码的记录字符串。The encoded records string
     */
    encodeRecords: function(records) {
        var encoded = "";
        
        for (var i = 0, length = records.length; i < length; i++) {
            encoded += Ext.urlEncode(records[i].data);
        }
        
        return encoded;
    },
    
    /**
     * @private
     * 按照this.timeout的值开始计时器，到了时候执行到这儿，如果触发了的话，表明请求太久了必须取消。如果请求成功的话，this.afterRequest会取消掉计时器计时。
     * Starts a timer with the value of this.timeout - if this fires it means the request took too long so we
     * cancel the request. If the request was successful this timer is cancelled by this.afterRequest
     * @param {Ext.data.Request} request 处理的请求对象。The Request to handle
     */
    createTimeoutHandler: function(request, operation) {
        this.afterRequest(request, false);

        this.fireEvent('exception', this, request, operation);
        
        if (typeof request.callback == 'function') {
            request.callback.call(request.scope || window, null, request.options, false);
        }        
    }
});

Ext.data.ScriptTagProxy.TRANS_ID = 1000;

Ext.data.ProxyMgr.registerType('scripttag', Ext.data.ScriptTagProxy);