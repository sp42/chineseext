/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.data.Connection
 * @extends Ext.util.Observable
 * 该类压缩了一个页面到当前域的连接,以响应(来自配置文件中的url或请求时指定的url)请求
 * 通过该类产生的请求都是异步的,并且会立刻返回,紧根其后的request调用将得不到数据
 * 可以使用在request配置项一个回调函数,或事件临听器来处理返回来的数据.
 * The class encapsulates a connection to the page's originating domain, allowing requests to be made
 * either to a configured URL, or to a URL specified at request time.<br><br>
 * <p>
 * Requests made by this class are asynchronous, and will return immediately. No data from
 * the server will be available to the statement immediately following the {@link #request} call.
 * To process returned data, use a callback in the request options object, or an event listener.</p><br>
 * <p>
 * 注意:如果你正在上传文件,你将不会有一正常的响应对象送回到你的回调或事件名柄中,因为上传是通过iframe来处理的.
 * 这里没有xmlhttpRequest对象.response对象是通过iframe的document的innerTHML作为responseText属性,如果存在,
 * 该iframe的xml document作为responseXML属性
 * 这意味着一个有效的xml或html document必须被返回,如果json数据是被需要的,这次意味着它将放到
 * html document的textarea元素内(通过某种规则可以从responseText重新得到)或放到一个元数据区内(通过标准的dom方法可以重新得到)
 * 
 * Note: If you are doing a file upload, you will not get a normal response object sent back to
 * your callback or event handler.  Since the upload is handled via in IFRAME, there is no XMLHttpRequest.
 * The response object is created using the innerHTML of the IFRAME's document as the responseText
 * property and, if present, the IFRAME's XML document as the responseXML property.</p><br>
 * This means that a valid XML or HTML document must be returned. If JSON data is required, it is suggested
 * that it be placed either inside a &lt;textarea> in an HTML document and retrieved from the responseText
 * using a regex, or inside a CDATA section in an XML document and retrieved from the responseXML using
 * standard DOM methods.
 * @constructor 构建器
 * @param {Object} config a configuration object. 配置对象
 */
Ext.data.Connection = function(config){
    Ext.apply(this, config);
    this.addEvents({
        /**
		 * @ beforrequest 事件
		 * 在一网络请求要求返回数据对象之前触发该事件
		 * @param {Connection} conn 该Connection对象
		 * @param {Object} options 传入reauest 方法的配置对象
         * @event beforerequest 
         * Fires before a network request is made to retrieve a data object.
         * @param {Connection} conn This Connection object.
         * @param {Object} options The options config object passed to the {@link #request} method.
         */
        "beforerequest" : true,
        /**
         * @event requestcomplete
         * Fires if the request was successfully completed.
         * @param {Connection} conn This Connection object.
         * @param {Object} response The XHR object containing the response data.
         * See {@link http://www.w3.org/TR/XMLHttpRequest/} for details.
         * @param {Object} options The options config object passed to the {@link #request} method.
         */
		 /**
         * @ requestcomplete 事件
         * 当请求成功完成时触发该事件
         * @param {Connection} conn 该Connection对象
         * @param {Object} response 包含返回数据的XHR对象
         * 去 {@link http://www.w3.org/TR/XMLHttpRequest/} 获取更多信息
         * @param {Object} options 传入reauest 方法的配置对象
         */
        "requestcomplete" : true,
        /**
         * @event requestexception
         * Fires if an error HTTP status was returned from the server.
         * See {@link http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html} for details of HTTP status codes.
         * @param {Connection} conn This Connection object.
         * @param {Object} response The XHR object containing the response data.
         * See {@link http://www.w3.org/TR/XMLHttpRequest/} for details.
         * @param {Object} options The options config object passed to the {@link #request} method.
         */
		   /**
         * @ requestexception 事件
         * 当服务器端返回代表错误的http状态时触发该事件
         * 去 {@link http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html} 获取更多关于HTTP status codes信息.
         * @param {Connection} conn 该Connection对象
         * @param {Object} response 包含返回数据的XHR对象
         * 去 {@link http://www.w3.org/TR/XMLHttpRequest/} 获取更多信息.
         * @param {Object} 传入reauest 方法的配置对象.
         */
        "requestexception" : true
    });
    Ext.data.Connection.superclass.constructor.call(this);
};

Ext.extend(Ext.data.Connection, Ext.util.Observable, {
    /**
     * @cfg {String} url (Optional) The default URL to be used for requests to the server. (defaults to undefined)
     */
	 /**
     * @cfg {String} url (可选项) 被用来向服务发起请求默认的url,默认值为undefined
     */
    /**
     * @cfg {Object} extraParams (Optional) An object containing properties which are used as
     * extra parameters to each request made by this object. (defaults to undefined)
     */
	  /**
     * @cfg {Object} extraParams (可选项) 一个包含属性值的对象(这些属性在该Connection发起的每次请求中作为外部参数)
     */
    /**
     * @cfg {Object} defaultHeaders (Optional) An object containing request headers which are added
     *  to each request made by this object. (defaults to undefined)
     */
	  /**
     * @cfg {Object} defaultHeaders (可选项) 一个包含请求头信息的对象(此请求头被附加在该Connection对象的每次请求中) 
     */
    /**
     * @cfg {String} method (Optional) The default HTTP method to be used for requests. (defaults to undefined; if not set but parms are present will use POST, otherwise GET)
     */
	 /**
     * @cfg {String} method (可选项) 请求时使用的默认的http方法(默认为undefined;
	 * 如果存在参数但没有设值.则值为post,否则为get) 
     */
    /**
     * @cfg {Number} timeout (Optional) The timeout in milliseconds to be used for requests. (defaults to 30000)
     */
	 /**
     * @cfg {Number} timeout (可选项) 一次请求超时的毫秒数.(默认为30秒钟) 
     */
    timeout : 30000,
    /**
     * @cfg {Boolean} autoAbort (Optional) Whether this request should abort any pending requests. (defaults to false)
     * @type Boolean
     */
	 /**
     * @cfg {Boolean} autoAbort (可选项) 该request是否应当中断挂起的请求.(默认值为false)
     * @type Boolean
     */
    autoAbort:false,

    /**
     * @cfg {Boolean} disableCaching (Optional) True to add a unique cache-buster param to GET requests. (defaults to true)
     * @type Boolean
     */
	 /**
     * @cfg {Boolean} disableCaching (可选项) 设置为true就会添加一个独一无二的cache-buster参数来获取请求(默认值为true)
     * @type Boolean
     */
    disableCaching: true,

    /**
	 * 向远程服务器发送一http请求
	 * @param {Object} options 包含如下属性的一对象<ul>
	  * <li><b>url</b> {String} (可选项) 发送请求的url.默认为配置的url</li>
     * <li><b>params</b> {Object/String/Function} (可选项) 一包含属性的对象(这些属性被用作request的参数)或一个编码后的url字串或一个能调用其中任一一属性的函数.</li>
     * <li><b>method</b> {String} (可选项) 该请求所用的http方面,默认值为配置的方法,或者当没有方法被配置时,如果没有发送参数时用get,有参数时用post.</li>
     * <li><b>callback</b> {Function} (可选项) 该方法被调用时附上返回的http response 对象.
	 * 不管成功还是失败,该回调函数都将被调用,该函数中传入了如下参数:<ul>
     * <li>options {Object} 该request调用的参数.</li>
     * <li>success {Boolean} 请求成功则为true.</li>
     * <li>response {Object} 包含返回数据的xhr对象.</li>
     * </ul></li>
     * <li><b>success</b> {Function} (可选项) 该函数被调用取决于请求成功.
     * 该回调函数被传入如下参数:<ul>
     * <li>response {Object} 包含了返回数据的xhr对象.</li>
     * <li>options {Object} 请求所调用的参数.</li>
     * </ul></li>
     * <li><b>failure</b> {Function} (可选项) 该函数被调用取决于请求失败.
     * 该回调函数被传入如下参数:<ul>
     * <li>response {Object} 包含了数据的xhr对象.</li>
     * <li>options {Object} 请求所调用的参数.</li>
     * </ul></li>
     * <li><b>scope</b> {Object} (可选项) 回调函数的作用域: "this" 指代回调函数本身
     * 默认值为浏览器窗口</li>
     * <li><b>form</b> {Object/String} (可选项) 用来压入参数的一个form对象或 form的标识</li>
     * <li><b>isUpload</b> {Boolean} (可选项)如果该form对象是上传form,为true, (通常情况下会自动探测).</li>
     * <li><b>headers</b> {Object} (可选项) 为请求所加的请求头.</li>
     * <li><b>xmlData</b> {Object} (可选项) 用于发送的xml document.注意:它将会被用来在发送数据中代替参数
     * 任务参数将会被追加在url中.</li>
     * <li><b>disableCaching</b> {Boolean} (可选项) 设置为True,则添加一个独一无二的 cache-buster参数来获取请求.</li>
     * </ul>


     * Sends an HTTP request to a remote server.
     * @param {Object} options An object which may contain the following properties:<ul>
     * <li><b>url</b> {String} (Optional) The URL to which to send the request. Defaults to configured URL</li>
     * <li><b>params</b> {Object/String/Function} (Optional) An object containing properties which are used as parameters to the
     * request, a url encoded string or a function to call to get either.</li>
     * <li><b>method</b> {String} (Optional) The HTTP method to use for the request. Defaults to the configured method, or
     * if no method was configured, "GET" if no parameters are being sent, and "POST" if parameters are being sent.</li>
     * <li><b>callback</b> {Function} (Optional) The function to be called upon receipt of the HTTP response.
     * The callback is called regardless of success or failure and is passed the following parameters:<ul>
     * <li>options {Object} The parameter to the request call.</li>
     * <li>success {Boolean} True if the request succeeded.</li>
     * <li>response {Object} The XMLHttpRequest object containing the response data.</li>
     * </ul></li>
     * <li><b>success</b> {Function} (Optional) The function to be called upon success of the request.
     * The callback is passed the following parameters:<ul>
     * <li>response {Object} The XMLHttpRequest object containing the response data.</li>
     * <li>options {Object} The parameter to the request call.</li>
     * </ul></li>
     * <li><b>failure</b> {Function} (Optional) The function to be called upon failure of the request.
     * The callback is passed the following parameters:<ul>
     * <li>response {Object} The XMLHttpRequest object containing the response data.</li>
     * <li>options {Object} The parameter to the request call.</li>
     * </ul></li>
     * <li><b>scope</b> {Object} (Optional) The scope in which to execute the callbacks: The "this" object
     * for the callback function. Defaults to the browser window.</li>
     * <li><b>form</b> {Object/String} (Optional) A form object or id to pull parameters from.</li>
     * <li><b>isUpload</b> {Boolean} (Optional) True if the form object is a file upload (will usually be automatically detected).</li>
     * <li><b>headers</b> {Object} (Optional) Request headers to set for the request.</li>
     * <li><b>xmlData</b> {Object} (Optional) XML document to use for the post. Note: This will be used instead of
     * params for the post data. Any params will be appended to the URL.</li>
     * <li><b>disableCaching</b> {Boolean} (Optional) True to add a unique cache-buster param to GET requests.</li>
     * </ul>
     * @return {Number} transactionId
     */
    request : function(o){
        if(this.fireEvent("beforerequest", this, o) !== false){
            var p = o.params;

            if(typeof p == "function"){
                p = p.call(o.scope||window, o);
            }
            if(typeof p == "object"){
                p = Ext.urlEncode(o.params);
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
                timeout : this.timeout
            };

            var method = o.method||this.method||(p ? "POST" : "GET");

            if(method == 'GET' && (this.disableCaching && o.disableCaching !== false) || o.disableCaching === true){
                url += (url.indexOf('?') != -1 ? '&' : '?') + '_dc=' + (new Date().getTime());
            }

            if(typeof o.autoAbort == 'boolean'){ // options gets top priority
                if(o.autoAbort){
                    this.abort();
                }
            }else if(this.autoAbort !== false){
                this.abort();
            }

            if((method == 'GET' && p) || o.xmlData){
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
     * Determine whether this object has a request outstanding.
     * @param {Number} transactionId (Optional) defaults to the last transaction
     * @return {Boolean} True if there is an outstanding request.
     */
	  /**
     * 确认该对象是否有显注的请求
     * @param {Number} transactionId (可选项) 默认是最后一次事务
     * @return {Boolean} 如果这是个显注的请求的话,返回true.
     */
    isLoading : function(transId){
        if(transId){
            return Ext.lib.Ajax.isCallInProgress(transId);
        }else{
            return this.transId ? true : false;
        }
    },

    /**
     * Aborts any outstanding request.
     * @param {Number} transactionId (Optional) defaults to the last transaction
     */
	 /**
     * 中断任何显注的请求.
     * @param {Number} transactionId (或选项) 默认值为最后一次事务
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
                    r.responseText = doc.body.innerHTML;
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

            setTimeout(function(){document.body.removeChild(frame);}, 100);
        }

        Ext.EventManager.on(frame, 'load', cb, this);
        form.submit();

        if(hiddens){ // remove dynamic params
            for(var i = 0, len = hiddens.length; i < len; i++){
                form.removeChild(hiddens[i]);
            }
        }
    }
});

/**
 * @class Ext.Ajax
 * @extends Ext.data.Connection
 * Global Ajax request class.
 * Ext.Ajax类,继承了Ext.data.Connection,全局的ajax请求类
 * @singleton单例
 */
Ext.Ajax = new Ext.data.Connection({
    // fix up the docs
   /**
     * @cfg {String} url @hide
     */

	 /**
     * @cfg {String} url @hide
     */
    /**
     * @cfg {Object} extraParams @hide
     */

	 /**
     * @cfg {Object} 外部参数 @hide
     */
    /**
     * @cfg {Object} defaultHeaders @hide
     */
	/**
     * @cfg {Object} 默认请求头 @hide
     */
    /**
     * @cfg {String} method (Optional) @hide
     */
	  /**
     * @cfg {String} 请求的方法 (可选项) @hide
     */
    /**
     * @cfg {Number} timeout (Optional) @hide
     */
	 /**
     * @cfg {Number} 超时时间 (可选项) @hide
     */
    /**
     * @cfg {Boolean} autoAbort (Optional) @hide
     */
	/**
     * @cfg {Boolean} 自动中断 (可选项) @hide
     */
    /**
     * @cfg {Boolean} disableCaching (Optional) @hide
     */
	 /**
     * @cfg {Boolean} 不启用缓存 (可选项) @hide
     */

    /**
     * @property  disableCaching
     * True to add a unique cache-buster param to GET requests. (defaults to true)
     * @type Boolean
     */

	  /**
     * @property  disableCaching
     * 设置为true使得增加一cache-buster参数来获取请求. (默认为true)
     * @type Boolean
     */
    /**
     * @property  url
     * The default URL to be used for requests to the server. (defaults to undefined)
     * @type String
     */
	  /**
     * @property  url
     * 默认的被用来向服务器发起请求的url. (默认为 undefined)
     * @type String
     */
    /**
     * @property  extraParams
     * An object containing properties which are used as
     * extra parameters to each request made by this object. (defaults to undefined)
     * @type Object
     */
	 /**
     * @property  外部参数
     * 一个包含属性的对象(这些属性在该Connection发起的每次请求中作为外部参数)
	 * @type Object
     */
    /**
     * @property  defaultHeaders
     * An object containing request headers which are added to each request made by this object. (defaults to undefined)
     * @type Object
     */
	  /**
     * @property  默认的请求头
     * 一个包含请求头信息的对象(此请求头被附加在该Connection对象的每次请求中)
     * @type Object
     */
    /**
     * @property  method
     * The default HTTP method to be used for requests. (defaults to undefined; if not set but parms are present will use POST, otherwise GET)
     * @type String
     */
	  /**
     * @property  method
     * 请求时使用的默认的http方法(默认为undefined;
	 * 如果存在参数但没有设值.则值为post,否则为get) 
     * @type String
     */
    /**
     * @property  timeout
     * 请求的超时豪秒数. (默认为30秒)
     * @type Number
     */

    /**
     * @property  autoAbort
     * Whether a new request should abort any pending requests. (defaults to false)
     * @type Boolean
     */

	  /**
     * @property  autoAbort
     *  该request是否应当中断挂起的请求.(默认值为false)
     * @type Boolean
     */
    autoAbort : false,

    /**
     * Serialize the passed form into a url encoded string
     * @param {String/HTMLElement} form
     * @return {String}
     */
	  /**
     * 续列化传入的form为编码后的url字符串
     * @param {String/HTMLElement} form
     * @return {String}
     */
    serializeForm : function(form){
        return Ext.lib.Ajax.serializeForm(form);
    }
});