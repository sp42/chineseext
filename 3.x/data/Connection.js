/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.data.Connection
 * @extends Ext.util.Observable
 * <p>
 * 此类封装了一个页面到当前域的连接，以响应（来自配置文件中的url或请求时指定的url）请求。<br />
 * The class encapsulates a connection to the page's originating domain, allowing requests to be made
 * either to a configured URL, or to a URL specified at request time.</p>
 * 
 * <p>
 * 通过该类产生的请求都是异步的，并且会立刻返回，这样紧跟其后的{@link #request}调用将得不到数据
 * 可以使用在request配置项一个<a href="#request-option-success" ext:member="request-option-success" ext:cls="Ext.data.Connection">回调函数</a>，
 * 或{@link #requestcomplete 事件侦听器}来处理返回来的数据。<br />
 * Requests made by this class are asynchronous, and will return immediately. 
 * No data from the server will be available to the statement immediately following the {@link #request} call.
 * To process returned data, use a <a href="#request-option-success" ext:member="request-option-success" ext:cls="Ext.data.Connection">success callback</a>
 * in the request options object,or an {@link #requestcomplete event listener}.</p>
 * 
 * <p>
 * response对象是通过iframe的document的innerTHML作为responseText属性，如果存在，
 * 该iframe的xml document作为responseXML属性。<br />
 * <h3>File Uploads</h3><a href="#request-option-isUpload" ext:member="request-option-isUpload" ext:cls="Ext.data.Connection">File uploads</a> are not performed using normal "Ajax" techniques, 
 * that is they are <b>not</b> performed using XMLHttpRequests. 
 * Instead the form is submitted in the standard manner with the DOM <tt>&lt;form></tt> element temporarily modified to 
 * have its <a href="http://www.w3.org/TR/REC-html40/present/frames.html#adef-target">target</a> set to refer
 * to a dynamically generated, hidden <tt>&lt;iframe></tt> which is inserted into the document
 * but removed after the return data has been gathered.</p>
 * 
 * <p>
 * 注意:如果你正在上传文件，你将得不到一个正常的响应对象送回到你的回调或事件处理函数中，原因是上传利用iframe来处理的。
 * 这意味着一个有效的xml或html document必须被返回，如果需要json数据，这次意味着它将放到。<br />
 * The server response is parsed by the browser to create the document for the IFRAME. 
 * If the server is using JSON to send the return object, then the
 * <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17">Content-Type</a> header
 * must be set to "text/html" in order to tell the browser to insert the text unchanged into the document body.</p>
 * 
 * <p>
 * Characters which are significant to an HTML parser must be sent as HTML entities, so encode
 * "&lt;" as "&amp;lt;", "&amp;" as "&amp;amp;" etc.</p>
 * 
 * <p>
 * 响应结果取自document对象，这里利用了一个xmlhttpRequest对象的<tt>responseText</tt>属性来暂时存储响应结果，目的是利用其事件处理器和回调的机制完成所需的任务。<br />
 * The response text is retrieved from the document, and a fake XMLHttpRequest object
 * is created containing a <tt>responseText</tt> property in order to conform to the
 * requirements of event handlers and callbacks.</p>
 * 
 * <p>Be aware that file upload packets are sent with the content type <a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form</a>
 * and some server technologies (notably JEE) may require some custom processing in order to
 * retrieve parameter names and parameter values from the packet content.</p>
 * @constructor
 * @param {Object} config 配置对象。a configuration object.
 */
Ext.data.Connection = function(config){
    Ext.apply(this, config);
    this.addEvents(
        /**
         * @event beforerequest
         * 任何Ajax请求发送之前触发。 
         * Fires before a network request is made to retrieve a data object.
         * @param {Connection} conn This Connection object.
         * @param {Object} options The options config object passed to the {@link #request} method.
         */
        "beforerequest",
        /**
         * @event requestcomplete
         * 任何Ajax成功请求后触发。
         * Fires if the request was successfully completed.
         * @param {Connection} conn This Connection object.
         * @param {Object} response The XHR object containing the response data.
         * See <a href="http://www.w3.org/TR/XMLHttpRequest/">The XMLHttpRequest Object</a>
         * for details.
         * @param {Object} options The options config object passed to the {@link #request} method.
         */
        "requestcomplete",
        /**
         * @event requestexception
         * 服务端返回一个错误的HTTP状态码时触发。
         * Fires if an error HTTP status was returned from the server.
         * See <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html">HTTP Status Code Definitions</a>
         * for details of HTTP status codes.
         * @param {Connection} conn This Connection object.
         * @param {Object} response The XHR object containing the response data.
         * See <a href="http://www.w3.org/TR/XMLHttpRequest/">The XMLHttpRequest Object</a>
         * for details.
         * @param {Object} options The options config object passed to the {@link #request} method.
         */
        "requestexception"
    );
    Ext.data.Connection.superclass.constructor.call(this);
};

Ext.extend(Ext.data.Connection, Ext.util.Observable, {
    /**
     * @cfg {String} url （可选项）被用来向服务发起请求默认的url（默认值为undefined）。
     * (Optional) The default URL to be used for requests to the server. (defaults to undefined)
     */
    /**
     * @cfg {Object} extraParams （可选项）一个包含属性值的对象，这些属性在该Connection发起的每次请求中作为外部参数（默认值为undefined）。
     * (Optional) An object containing properties which are used as
     * extra parameters to each request made by this object. (defaults to undefined)
     */
    /**
     * @cfg {Object} defaultHeaders （可选项）一个包含请求头信息的对象，此请求头被附加在该Connection对象的每次请求中（默认值为undefined）。 
     * (Optional) An object containing request headers which are added
     *  to each request made by this object. (defaults to undefined)
     */
    /**
     * @cfg {String} method （可选项）请求时使用的默认的http方法（默认为undefined；如果存在参数但没有设值，则值为post,否则为get）。
     * (Optional) The default HTTP method to be used for requests.
     * (defaults to undefined; if not set, but {@link #request} params are present, POST will be used;
     * otherwise, GET will be used.)
     */
    /**
     * @cfg {Number} timeout （可选项）一次请求超时的毫秒数（默认为30秒钟）。
     * (Optional) The timeout in milliseconds to be used for requests. (defaults to 30000)
     */
    timeout : 30000,
    /**
     * @cfg {Boolean} autoAbort （可选项）该request是否应当中断挂起的请求（默认值为false）。
     * (Optional) Whether this request should abort any pending requests. (defaults to false)
     * @type Boolean
     */
    autoAbort:false,

    /**
     * @cfg {Boolean} disableCaching （可选项）设置为true就会添加一个独一无二的cache-buster参数来获取请求（默认值为true）。
     * (Optional) True to add a unique cache-buster param to GET requests. (defaults to true)
     * @type Boolean
     */
    disableCaching: true,
    
    /**
     * @cfg {String} disableCachingParam （可选项）(Optional) Change the parameter which is sent went disabling caching
     * through a cache buster. Defaults to '_dc'
     * @type String
     */
    disableCachingParam: '_dc',    

	/**
     * <p>
     * 向远程服务器发送一http请求。
     * Sends an HTTP request to a remote server.</p>
     * <p>
     * <b>Important:</b> Ajax server requests are asynchronous, and this call will
     * return before the response has been received. Process any returned data
     * in a callback function.</p>

     * <p>
     * 要正确指定回调函数的作用域，应适用<tt>scope</tt>选项。
     * To execute a callback function in the correct scope, use the <tt>scope</tt> option.</p>
     * @param {Object} options 包含如下属性的一对象：An object which may contain the following properties:<ul>
     * <li><b>url</b> : String/Function (Optional)<div class="sub-desc">
     * （可选项）发送请求的url，默认为配置的url。
     * 若为函数类型那么其作用域将由配置项<tt>scope</tt>所指定。默认为配置好的URL。
     * The URL to which to send the request, or a function to call which returns a URL string. The scope of the
     * function is specified by the <tt>scope</tt> option. Defaults to configured URL.</div></li>
     * 
     * <li><b>params</b> : Object/String/Function （可选项）(Optional)<div class="sub-desc">
     * 一包含属性的对象（这些属性被用作request的参数）或一个编码后的url字串或一个能调用其中任一一属性的函数。
     * 若为函数类型那么其作用域将由配置项<tt>scope</tt>所指定。
     * An object containing properties which are used as parameters to the
     * request, a url encoded string or a function to call to get either. The scope of the function
     * is specified by the <tt>scope</tt> option.</div></li>
     * 
     * <li><b>method</b> : String （可选项）(Optional)<div class="sub-desc">
     * 该请求所用的http方面，默认值为配置的方法，或者当没有方法被配置时，如果没有发送参数时用get，有参数时用post。
     * The HTTP method to use for the request. Defaults to the configured method, or if no method was configured,
     * "GET" if no parameters are being sent, and "POST" if parameters are being sent.  Note that
     * the method name is case-sensitive and should be all caps.</div></li>
     * 
     * <li><b>callback</b> : Function （可选项）(Optional)<div class="sub-desc">
     * 该方法被调用时附上返回的http response对象。不管成功还是失败，该回调函数都将被调用，该函数中传入了如下参数:
     * The function to be called upon receipt of the HTTP response. The callback is
     * called regardless of success or failure and is passed the following
     * parameters:<ul>
     * <li><b>options</b> : Object<div class="sub-desc">>请求所调用的参数。The parameter to the request call.</div></li>
     * <li><b>success</b> : Boolean<div class="sub-desc">请求成功则为true。True if the request succeeded.</div></li>
     * <li><b>response</b> : Object<div class="sub-desc">包含了返回数据的xhr对象。The XMLHttpRequest object containing the response data. 
     * See <a href="http://www.w3.org/TR/XMLHttpRequest/">http://www.w3.org/TR/XMLHttpRequest/</a> for details about 
     * accessing elements of the response.</div></li>
     * </ul></div></li>
     * <li><a id="request-option-success"></a><b>success</b>: Function （可选项）(Optional)<div class="sub-desc">
     * 该函数被调用取决于请求是否成功。该回调函数被传入如下参数:
     * The function to be called upon success of the request. The callback is passed the following
     * parameters:<ul>
     * <li><b>response</b> : Object<div class="sub-desc">包含数据的xhr对象。The XMLHttpRequest object containing the response data.</div></li>
     * <li><b>options</b> : Object<div class="sub-desc">请求所调用的参数。The parameter to the request call.</div></li>
     * </ul></div></li>
     * <li><b>failure</b> : Function （可选项）(Optional)<div class="sub-desc">
     * 该函数被调用取决于请求失败。该回调函数被传入如下参数:
     * The function to be called upon failure of the request. The callback is passed the following parameters:<ul>
     * 
     * <li><b>response</b> : Object<div class="sub-desc">
     * 包含数据的xhr对象。
     * The XMLHttpRequest object containing the response data.</div></li>
     * 
     * <li><b>options</b> : Object<div class="sub-desc">
     * 请求所调用的参数。
     * The parameter to the request call.</div></li>
     * </ul></div></li>
     * 
     * <li><b>scope</b> : Object （可选项）(Optional)<div class="sub-desc">
     * 回调函数的作用域：回调函数"this"对象指针。默认值为浏览器窗口。
     * The scope in which to execute the callbacks: The "this" object for the callback function. If the <tt>url</tt>, or <tt>params</tt> options were
     * specified as functions from which to draw values, then this also serves as the scope for those function calls.
     * Defaults to the browser window.</div></li>
     * 
     * <li><b>form</b> : Element/HTMLElement/String （可选项）(Optional)<div class="sub-desc">
     * 用来压入参数的一个<tt>&lt;form&gt;</tt>元素或<tt>&lt;form&gt;</tt>的标识。
     * The <tt>&lt;form&gt;</tt> Element or the id of the <tt>&lt;form&gt;</tt> to pull parameters from.</div></li>
     * 
     * <li><a id="request-option-isUpload"></a><b>isUpload</b> : Boolean （可选项）(Optional)<div class="sub-desc"><b>
     * 如果该form对象是上传form，为true（通常情况下会自动探测）。
     * Only meaningful when used with the <tt>form</tt> option</b>.
     * <p>True if the form object is a file upload (will be set automatically if the form was
     * configured with <b><tt>enctype</tt></b> "multipart/form-data").</p>
     * <p>File uploads are not performed using normal "Ajax" techniques, that is they are <b>not</b>
     * performed using XMLHttpRequests. Instead the form is submitted in the standard manner with the
     * DOM <tt>&lt;form></tt> element temporarily modified to have its
     * <a href="http://www.w3.org/TR/REC-html40/present/frames.html#adef-target">target</a> set to refer
     * to a dynamically generated, hidden <tt>&lt;iframe></tt> which is inserted into the document
     * but removed after the return data has been gathered.</p>
     * <p>The server response is parsed by the browser to create the document for the IFRAME. If the
     * server is using JSON to send the return object, then the
     * <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17">Content-Type</a> header
     * must be set to "text/html" in order to tell the browser to insert the text unchanged into the document body.</p>
     * <p>The response text is retrieved from the document, and a fake XMLHttpRequest object
     * is created containing a <tt>responseText</tt> property in order to conform to the
     * requirements of event handlers and callbacks.</p>
     * <p>Be aware that file upload packets are sent with the content type <a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form</a>
     * and some server technologies (notably JEE) may require some custom processing in order to
     * retrieve parameter names and parameter values from the packet content.</p>
     * </div></li>
     * 
     * <li><b>headers</b> : Object （可选项）(Optional)<div class="sub-desc">为请求所加的请求头。
     * Request headers to set for the request.</div></li>
     * 
     * <li><b>xmlData</b> : Object （可选项）(Optional)<div class="sub-desc">
     * 用于发送的xml document。注意:它将会被用来在发送数据中代替参数任务参数将会被追加在url中。
     * XML document to use for the post. Note: This will be used instead of params for the post
     * data. Any params will be appended to the URL.</div></li>
     * 
     * <li>
     * <b>jsonData</b> : Object/String （可选项）(Optional)<div class="sub-desc">
     * 
     * JSON data to use as the post. Note: This will be used instead of params for the post
     * data. Any params will be appended to the URL.</div>
     * </li>
     * 
     * <li>
     * <b>disableCaching</b> : Boolean （可选项）(Optional)<div class="sub-desc">
     * 设置为True,则添加一个独一无二的cache-buster参数来获取请求。
     * True to add a unique cache-buster param to GET requests.</div>
     * </li>
     * 
     * </ul></p>
     * <p>The options object may also contain any other property which might be needed to perform
     * postprocessing in a callback because it is passed to callback functions.</p>
     * @return {Number} transactionId The id of the server transaction. This may be used
     * to cancel the request.
     */   
    
    request : function(o){
        if(this.fireEvent("beforerequest", this, o) !== false){
            var p = o.params;

            if(typeof p == "function"){
                p = p.call(o.scope||window, o);
            }
            if(typeof p == "object"){
                p = Ext.urlEncode(p);
            }
            if(this.extraParams){
                var extras = Ext.urlEncode(this.extraParams);
                p = p ? (p + '&' + extras) : extras;
            }

            var url = o.url || this.url;
            if(typeof url == 'function'){
                url = url.call(o.scope||window, o);
            }

            if(o.form){
                var form = Ext.getDom(o.form);
                url = url || form.action;

                var enctype = form.getAttribute("enctype");
                if(o.isUpload || (enctype && enctype.toLowerCase() == 'multipart/form-data')){
                    return this.doFormUpload(o, p, url);
                }
                var f = Ext.lib.Ajax.serializeForm(form);
                p = p ? (p + '&' + f) : f;
            }

            var hs = o.headers;
            if(this.defaultHeaders){
                hs = Ext.apply(hs || {}, this.defaultHeaders);
                if(!o.headers){
                    o.headers = hs;
                }
            }

            var cb = {
                success: this.handleResponse,
                failure: this.handleFailure,
                scope: this,
                argument: {options: o},
                timeout : o.timeout || this.timeout
            };

            var method = o.method||this.method||((p || o.xmlData || o.jsonData) ? "POST" : "GET");

            if(method == 'GET' && (this.disableCaching && o.disableCaching !== false) || o.disableCaching === true){
                var dcp = o.disableCachingParam || this.disableCachingParam;
                url += (url.indexOf('?') != -1 ? '&' : '?') + dcp + '=' + (new Date().getTime());
            }

            if(typeof o.autoAbort == 'boolean'){ // options gets top priority
                if(o.autoAbort){
                    this.abort();
                }
            }else if(this.autoAbort !== false){
                this.abort();
            }
            if((method == 'GET' || o.xmlData || o.jsonData) && p){
                url += (url.indexOf('?') != -1 ? '&' : '?') + p;
                p = '';
            }
            this.transId = Ext.lib.Ajax.request(method, url, cb, p, o);
            return this.transId;
        }else{
            Ext.callback(o.callback, o.scope, [o, null, null]);
            return null;
        }
    },

    /**
     * 确认该对象是否有正在的请求。
     * Determine whether this object has a request outstanding.
     * @param {Number} transactionId （可选项）默认是最后一次通讯。(Optional) defaults to the last transaction
     * @return {Boolean} 如果这是个正在的请求的话，返回true。True if there is an outstanding request.
     */
    isLoading : function(transId){
        if(transId){
            return Ext.lib.Ajax.isCallInProgress(transId);
        }else{
            return this.transId ? true : false;
        }
    },

    /**
     * 中断任何正在的请求。
     * Aborts any outstanding request.
     * @param {Number} transactionId (或选项)默认值为最后一次事务。{(Optional) defaults to the last transaction
     */
    abort : function(transId){
        if(transId || this.isLoading()){
            Ext.lib.Ajax.abort(transId || this.transId);
        }
    },

    // private
    handleResponse : function(response){
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent("requestcomplete", this, response, options);
        Ext.callback(options.success, options.scope, [response, options]);
        Ext.callback(options.callback, options.scope, [options, true, response]);
    },

    // private
    handleFailure : function(response, e){
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent("requestexception", this, response, options, e);
        Ext.callback(options.failure, options.scope, [response, options]);
        Ext.callback(options.callback, options.scope, [options, false, response]);
    },

    // private
    doFormUpload : function(o, ps, url){
        var id = Ext.id();
        var frame = document.createElement('iframe');
        frame.id = id;
        frame.name = id;
        frame.className = 'x-hidden';
        if(Ext.isIE){
            frame.src = Ext.SSL_SECURE_URL;
        }
        document.body.appendChild(frame);

        if(Ext.isIE){
           document.frames[id].name = id;
        }

        var form = Ext.getDom(o.form);
        form.target = id;
        form.method = 'POST';
        form.enctype = form.encoding = 'multipart/form-data';
        if(url){
            form.action = url;
        }

        var hiddens, hd;
        if(ps){ // add dynamic params
            hiddens = [];
            ps = Ext.urlDecode(ps, false);
            for(var k in ps){
                if(ps.hasOwnProperty(k)){
                    hd = document.createElement('input');
                    hd.type = 'hidden';
                    hd.name = k;
                    hd.value = ps[k];
                    form.appendChild(hd);
                    hiddens.push(hd);
                }
            }
        }

        function cb(){
            var r = {  // bogus response object
                responseText : '',
                responseXML : null
            };

            r.argument = o ? o.argument : null;

            try { //
                var doc;
                if(Ext.isIE){
                    doc = frame.contentWindow.document;
                }else {
                    doc = (frame.contentDocument || window.frames[id].document);
                }
                if(doc && doc.body){
                    var fc = doc.body.firstChild;
                    if(fc && String(fc.tagName).toLowerCase() == 'textarea'){ // json response wrapped in textarea
                        r.responseText = fc.value;
                    }else{
                        r.responseText = doc.body.innerHTML;
                    }
                }
                if(doc && doc.XMLDocument){
                    r.responseXML = doc.XMLDocument;
                }else {
                    r.responseXML = doc;
                }
            }
            catch(e) {
                // ignore
            }

            Ext.EventManager.removeListener(frame, 'load', cb, this);

            this.fireEvent("requestcomplete", this, r, o);

            Ext.callback(o.success, o.scope, [r, o]);
            Ext.callback(o.callback, o.scope, [o, true, r]);

            if(!this.debugUploads){
                setTimeout(function(){Ext.removeNode(frame);}, 100);
            }
        }

        Ext.EventManager.on(frame, 'load', cb, this);
        form.submit();

        if(hiddens){ // remove dynamic params
            for(var i = 0, len = hiddens.length; i < len; i++){
                Ext.removeNode(hiddens[i]);
            }
        }
    }
});

/**
 * @class Ext.Ajax
 * @extends Ext.data.Connection
 * Ext.Ajax类继承了Ext.data.Connection，为Ajax的请求提供了最大灵活性的操作方式。示例代码：
 * Global Ajax request class.  Provides a simple way to make Ajax requests with maximum flexibility.  Example usage:
 * <pre><code>
// 简单的请求 Basic request
Ext.Ajax.request({
   url: 'foo.php',
   success: someFn,
   failure: otherFn,
   headers: {
       'my-header': 'foo'
   },
   params: { foo: 'bar' }
});

// 简单的Ajax式的表单提交。Simple ajax form submission
Ext.Ajax.request({
    form: 'some-form',
    params: 'foo=bar'
});

// 规定每次请求的头部都有这样的字段。Default headers to pass in every request
Ext.Ajax.defaultHeaders = {
    'Powered-By': 'Ext'
};

// 规定每次请求的头部都有这样的事件！Global Ajax events can be handled on every request!
Ext.Ajax.on('beforerequest', this.showSpinner, this);
</code></pre>
 * @singleton
 */
Ext.Ajax = new Ext.data.Connection({
    /**
     * @cfg {String} url @hide
     */
    /**
     * @cfg {Object} extraParams 外部参数 @hide
     */
    /**
     * @cfg {Object} defaultHeaders 默认请求头 @hide
     */
    /**
     * @cfg {String} method 请求的方法 （可选项）(Optional) @hide
     */
    /**
     * @cfg {Number} timeout 超时时间 （可选项）(Optional) @hide
     */
    /**
     * @cfg {Boolean} autoAbort 自动中断 （可选项）(Optional) @hide
     */

    /**
     * @cfg {Boolean} disableCaching (Optional) 不启用缓存 （可选项）@hide
     */

    /**
     * @property disableCaching 设置为true使得增加一cache-buster参数来获取请求（默认为true）。
     * True to add a unique cache-buster param to GET requests. (defaults to true)
     * @type Boolean
     */
    /**
     * @property url 默认的被用来向服务器发起请求的url（默认为 undefined）。 
     * The default URL to be used for requests to the server. (defaults to undefined)
     * @type String
     */
    /**
     * @property extraParams 外部参数，一个包含属性的对象（这些属性在该Connection发起的每次请求中作为外部参数）。
     * An object containing properties which are used as extra parameters to each request made by this object. (defaults to undefined)
     * @type Object
     */
    /**
     * @property defaultHeaders 默认的请求头，一个包含请求头信息的对象（此请求头被附加在该Connection对象的每次请求中）。
     * An object containing request headers which are added to each request made by this object. (defaults to undefined)
     * @type Object
     */
    /**
     * @property method 请求的方法，请求时使用的默认的http方法（默认为undefined;如果存在参数但没有设值，则值为post，否则为get）。
     * The default HTTP method to be used for requests. Note that this is case-sensitive and should be all caps (defaults
     * to undefined; if not set but parms are present will use "POST," otherwise "GET.")
     * @type String
     */
    /**
     * @property timeout 超时时间，请求的超时豪秒数（默认为30秒）。
     * The timeout in milliseconds to be used for requests. (defaults to 30000)
     * @type Number
     */

    /**
     * @property  autoAbort 自动中断。该request是否应当中断挂起的请求（默认值为false）。
     * Whether a new request should abort any pending requests. (defaults to false)
     * @type Boolean
     */
    autoAbort : false,

    /**
     * 序列化传入的form为编码后的url字符串。
     * Serialize the passed form into a url encoded string
     * @param {String/HTMLElement} form
     * @return {String}
     */
    serializeForm : function(form){
        return Ext.lib.Ajax.serializeForm(form);
    }
});