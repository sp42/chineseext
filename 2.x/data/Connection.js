/**
 * @class Ext.data.Connection
 * @extends Ext.util.Observable
 * 此类封装了一个页面到当前域的连接,以响应(来自配置文件中的url或请求时指定的url)请求
 * <p>通过该类产生的请求都是异步的,并且会立刻返回,紧根其后的{@link #request}调用将得不到数据
 * 可以使用在request配置项一个回调函数,或事件临听器来处理返回来的数据。<br></p><br>
 * <p>
 * 注意:如果你正在上传文件,你将得不到一个正常的响应对象送回到你的回调或事件名柄中，原因是上传利用iframe来处理的.
 * 这里没有xmlhttpRequest对象。response对象是通过iframe的document的innerTHML作为responseText属性,如果存在,
 * 该iframe的xml document作为responseXML属性</p><p>
 * 这意味着一个有效的xml或html document必须被返回，如果需要json数据,这次意味着它将放到
 * @constructor 
 * @param {Object} config a configuration object. 配置对象
 */
 
Ext.data.Connection = function(config){
    Ext.apply(this, config);
    this.addEvents(
       /**
		 * @ beforrequest
		 * 在网络请求要求返回数据对象之前触发该事件
		 * @param {Connection} conn 该Connection对象
		 * @param {Object} options 传入{@link #request}方法的配置项对象
         */        
        "beforerequest",

         /**
         * @ requestcomplete
         * 当请求成功完成时触发该事件
         * @param {Connection} conn 该Connection对象
         * @param {Object} response 包含返回数据的XHR对象。去{@link http://www.w3.org/TR/XMLHttpRequest/} 获取更多信息
         * @param {Object} options 传入{@link #request}方法的配置对象
         */
         
        "requestcomplete",

         /**
         * @event requestexception
         * 当服务器端返回的错误http状态代码时触发该事件
         * 去 {@link http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html} 获取更多关于HTTP status codes信息.
         * @param {Connection} conn 该Connection对象
         * @param {Object} response 包含返回数据的XHR对象。到{@link http://www.w3.org/TR/XMLHttpRequest/} 获取更多信息.
         * @param {Object} 传入{@link #request}方法的配置对象.
         */
        "requestexception"
    );
    Ext.data.Connection.superclass.constructor.call(this);
};

Ext.extend(Ext.data.Connection, Ext.util.Observable, {
    /**
     * @cfg {String} url (可选项) 被用来向服务发起请求默认的url,默认值为undefined
     */
    /**
     * @cfg {Object} extraParams (可选项) 一个包含属性值的对象(这些属性在该Connection发起的每次请求中作为外部参数)。默认值为undefined
     */

   /**
     * @cfg {Object} defaultHeaders (可选项) 一个包含请求头信息的对象(此请求头被附加在该Connection对象的每次请求中) 默认值为undefined
     */

     /**
     * @cfg {String} method (可选项) 请求时使用的默认的http方法(默认为undefined;如果存在参数但没有设值.则值为post,否则为get) 
     */

     /**
     * @cfg {Number} timeout (可选项) 一次请求超时的毫秒数.(默认为30秒钟) 
     */
    timeout : 30000,

     /**
     * @cfg {Boolean} autoAbort (可选项) 该request是否应当中断挂起的请求.(默认值为false)
     * @type Boolean
     */
    autoAbort:false,

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
            if((method == 'GET' && p) || o.xmlData || o.jsonData){
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
     * 确认该对象是否有正在的请求
     * @param {Number} transactionId (可选项) 默认是最后一次通讯
     * @return {Boolean} 如果这是个正在的请求的话,返回true.
     */
    isLoading : function(transId){
        if(transId){
            return Ext.lib.Ajax.isCallInProgress(transId);
        }else{
            return this.transId ? true : false;
        }
    },

     /**
     * 中断任何正在的请求.
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

            setTimeout(function(){Ext.removeNode(frame);}, 100);
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
 * <pre><code>
// Basic request
Ext.Ajax.request({
   url: 'foo.php',
   success: someFn,
   failure: otherFn,
   headers: {
       'my-header': 'foo'
   },
   params: { foo: 'bar' }
});

// Simple ajax form submission
Ext.Ajax.request({
    form: 'some-form',
    params: 'foo=bar'
});

// Default headers to pass in every request
Ext.Ajax.defaultHeaders = {
    'Powered-By': 'Ext'
};

// Global Ajax events can be handled on every request!
Ext.Ajax.on('beforerequest', this.showSpinner, this);
</code></pre>
 * @singleton
 */
Ext.Ajax = new Ext.data.Connection({
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
     * @cfg {Object} 默认请求头 @hide
     */

	/**
     * @cfg {String} 请求的方法 (可选项) @hide
     */

	/**
     * @cfg {Number} 超时时间 (可选项) @hide
     */

	/**
     * @cfg {Boolean} 自动中断 (可选项) @hide
     */

	/**
     * @cfg {Boolean} 不启用缓存 (可选项) @hide
     */
    
      /**
     * @property  disableCaching
     * 设置为true使得增加一cache-buster参数来获取请求. (默认为true)
     * @type Boolean
     */

     /**
     * @property  url
     * 默认的被用来向服务器发起请求的url. (默认为 undefined)
     * @type String
     */

     /**
     * @property  外部参数
     * 一个包含属性的对象(这些属性在该Connection发起的每次请求中作为外部参数)
	 * @type Object
     */

     /**
     * @property  默认的请求头
     * 一个包含请求头信息的对象(此请求头被附加在该Connection对象的每次请求中)
     * @type Object
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
     *  该request是否应当中断挂起的请求.(默认值为false)
     * @type Boolean
     */
    autoAbort : false,

    /**
     * 序列化传入的form为编码后的url字符串
     * @param {String/HTMLElement} form
     * @return {String}
     */
    serializeForm : function(form){
        return Ext.lib.Ajax.serializeForm(form);
    }
});