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
 * @class Ext.Updater
 * @extends Ext.util.Observable
 * 为元素对象提供Ajax式更新。<br><br>
 * 用法：<br>
 * <pre><code>
 * // 从Ext.Element对象上获取Updater
 * var el = Ext.get("foo");
 * var mgr = el.getUpdater();
 * mgr.update({
 *     url: "http://myserver.com/index.php",
 *     params: {
 *         param1: "foo",
 *         param2: "bar"
 *     }
 * });
 * ...
 * mgr.formUpdate("myFormId", "http://myserver.com/index.php");
 * <br>
 * // 或直接声明（返回相同的UpdateManager实例）
 * var mgr = new Ext.Updater("myElementId");
 * mgr.startAutoRefresh(60, "http://myserver.com/index.php");
 * mgr.on("update", myFcnNeedsToKnow);
 * <br>
   // 用快捷的方法在元素上直接访问
   Ext.get("foo").load({
        url: "bar.php",
        scripts: true,
        params: "param1=foo&amp;param2=bar",
        text: "Loading Foo..."
   });
 * </code></pre>
 * @constructor
 * 直接创建新UpdateManager。
 * @param {Mixed} el 被更新的元素
 * @param {Boolean} forceNew （可选的） 默认下，构造器会检查传入之元素是否有UpdateManager，如果有的话它返回该实例，也会跳过检查（继承类时有用）。
 */
Ext.Updater = function(el, forceNew){
    el = Ext.get(el);
    if(!forceNew && el.updateManager){
        return el.updateManager;
    }
    /**
     * 元素对象
     * @type Ext.Element
     */
    this.el = el;
    /**
     * 用于刷新的缓存url,如参数设置为false，每次调用update()都会重写该值。
     * @type String
     */
    this.defaultUrl = null;

    this.addEvents(
        /**
         * @event beforeupdate
         * 在一个更新开始之前触发，如在事件句柄中返回false即意味着取消这次更新。
         * @param {Ext.Element} el
         * @param {String/Object/Function} url
         * @param {String/Object} params
         */
        "beforeupdate",
        /**
         * @event update
         * 当更新成功后触发
         * @param {Ext.Element} el
         * @param {Object} oResponseObject response对象
         */
        "update",
        /**
         * @event failure
         *  当更新失败后触发
         * @param {Ext.Element} el
         * @param {Object} oResponseObject response对象
         */
        "failure"
    );
    

    Ext.apply(this, Ext.Updater.defaults);
    /**
     * Blank page URL to use with SSL file uploads (defaults to {@link Ext.Updater.defaults#sslBlankUrl}).
     * @property sslBlankUrl
     * @type String
     */
    /**
     * Whether to append unique parameter on get request to disable caching (defaults to {@link Ext.Updater.defaults#disableCaching}).
     * @property disableCaching
     * @type Boolean
     */
    /**
     * Text for loading indicator (defaults to {@link Ext.Updater.defaults#indicatorText}).
     * @property indicatorText
     * @type String
     */
    /**
     * Whether to show indicatorText when loading (defaults to {@link Ext.Updater.defaults#showLoadIndicator}).
     * @property showLoadIndicator
     * @type String
     */
    /**
     * Timeout for requests or form posts in seconds (defaults to {@link Ext.Updater.defaults#timeout}).
     * @property timeout
     * @type Number
     */
    /**
     * True to process scripts in the output (defaults to {@link Ext.Updater.defaults#loadScripts}).
     * @property loadScripts
     * @type Boolean
     */

    /**
     * Transaction object of current executing transaction
     */
    this.transaction = null;

    /**
     * @private
     */
    this.autoRefreshProcId = null;
    /**
     * Delegate for refresh() prebound to "this", use myUpdater.refreshDelegate.createCallback(arg1, arg2) to bind arguments
     * @type Function
     */
    this.refreshDelegate = this.refresh.createDelegate(this);
    /**
     * Delegate for update() prebound to "this", use myUpdater.updateDelegate.createCallback(arg1, arg2) to bind arguments
     * @type Function
     */
    this.updateDelegate = this.update.createDelegate(this);
    /**
     * Delegate for formUpdate() prebound to "this", use myUpdater.formUpdateDelegate.createCallback(arg1, arg2) to bind arguments
     * @type Function
     */
    this.formUpdateDelegate = this.formUpdate.createDelegate(this);

    if(!this.renderer){
     /**
      * The renderer for this Updater. Defaults to {@link Ext.Updater.BasicRenderer}.
      */
    this.renderer = new Ext.Updater.BasicRenderer();
    }
    Ext.Updater.superclass.constructor.call(this);
};

Ext.extend(Ext.Updater, Ext.util.Observable, {
    /**
     * 获取当前UpdateManager所绑定的元素
     * @return {Ext.Element} 元素
     */
    getEl : function(){
        return this.el;
    },
    /**
     * 发起一个的<b>异步</b>请求，然后根据响应的response更新元素。
     * 如不指定使用GET，否则POST。
     * @param {Object/String/Function} url （可选的）请求的url或是能够返回url的函数（默认为最后使用的url），也可以是一个对象，包含下列可选项：
<pre><code>
um.update({<br/>
    url: "your-url.php",<br/>
    params: {param1: "foo", param2: "bar"}, // 或是可URL编码的字符串<br/>
    callback: yourFunction,<br/>
    scope: yourObject, //（作用域可选）  <br/>
    discardUrl: false, <br/>
    nocache: false,<br/>
    text: "加载中...",<br/>
    timeout: 30,<br/>
    scripts: false<br/>
});
</code></pre>
     * 只有url的属性是必须的。
     * 可选属性有nocache, text and scripts，分别是disableCaching，indicatorText和loadScripts的简写方式
     * 它们用于设置UpdateManager实例相关的属性。
     * @param {String/Object} params （可选的） 提交的参数，为可url编码的字符串"&param1=1&param2=2"，也可以是对象的形式{param1: 1, param2: 2}
     * @param {Function} callback （可选的） Callback 事务完成后执行的回调（带参数oElement, bSuccess）
     * @param {Boolean} discardUrl （可选的） 默认情况下，完成更新后，最后一次使用的url会保存到defaultUrl属性
     * 该参数为true的话，就不会保存。
     */
    /**
     * 发起一个的<b>异步</b>请求，然后根据响应的response更新元素。
     * 如不指定使用GET，否则POST。<br><br>
     * <b>NB:</b> 根据异步请求远端服务器的特性，此函数执行后元素不会立即被更新。要处理返回的数据，使用回调选项，或指定<b><tt>update</tt></b>事件句柄
     * @param {Object} options 一个配置项对象可以包含下列属性：<ul>
     * <li>url : <b>String/Function</b><p class="sub-desc">The URL to
     * request or a function which <i>returns</i> the URL.</p></li>
     * <li>method : <b>String</b><p class="sub-desc">The HTTP method to
     * use. Defaults to POST if params are present, or GET if not.</p></li>
     * <li>params : <b>String/Object/Function</b><p class="sub-desc">The
     * parameters to pass to the server. 传到服务器的参数。这可以字符串（未urlencoded亦可），或代表参数的对象，或返回对象的函数。</p></li>
     * <li><b>scripts</b> : Boolean<p class="sub-desc">If <tt>true</tt>
     * any &lt;script&gt; tags embedded in the response text will be extracted
     * and executed. If this option is specified, the callback will be
     * called <i>after</i> the execution of the scripts.</p></li>
     *
     * <li><b>callback</b> : Function<p class="sub-desc">
     * 接收到服务器的响应后，执行的回调函数。该函数带下列的参数：
     * <ul>
     * <li><b>el</b> : Ext.Element<p class="sub-desc">被更新的元素</p></li>
     * <li><b>success</b> : Boolean<p class="sub-desc">True表示成功，false表示失败。</p></li>
     * <li><b>response</b> : XMLHttpRequest<p class="sub-desc">进行更新的那个XMLHttpRequest对象</p></li>
     * </ul>
     * </p>
     * </li>
     *
     * <li><b>scope</b> : Object<p class="sub-desc">The scope in which
     * to execute the callback 回调函数所在的作用域（<tt>this<tt>所指向的引用）。如果
     * <tt>params</tt> 选项是一个函数，那么这个作用域也用于该函数。</p></li>
     *
     *  <li><b>discardUrl</b> : Boolean<p class="sub-desc">If not passed
     * as <tt>false</tt> the URL of this request becomes the default URL for
     * this Updater object, and will be subsequently used in {@link #refresh}
     * calls.（可选的） 默认情况下，完成更新后，最后一次使用的url会保存到defaultUrl属性
     * 该参数为true的话，就不会保存。</p></li>
     * <li><b>timeout</b> : Number<p class="sub-desc">The timeout to use
     * when waiting for a response.</p></li>
     * <li><b>nocache</b> : Boolean<p class="sub-desc">Only needed for GET
     * requests, this option causes an extra, generated parameter to be passed
     * to defeat caching.</p></li></ul>
     * <p>
     * For example:
<pre><code>
um.update({
    url: "your-url.php",
    params: {param1: "foo", param2: "bar"}, // or a URL encoded string
    callback: yourFunction,
    scope: yourObject, //(optional scope)
    discardUrl: false,
    nocache: false,
    text: "Loading...",
    timeout: 30,
    scripts: false // Save time by avoiding RegExp execution.
});
</code></pre>
     */
    update : function(url, params, callback, discardUrl){
        if(this.fireEvent("beforeupdate", this.el, url, params) !== false){
            var method = this.method, cfg, callerScope;
            if(typeof url == "object"){ // must be config object
                cfg = url;
                url = cfg.url;
                params = params || cfg.params;
                callback = callback || cfg.callback;
                discardUrl = discardUrl || cfg.discardUrl;
	            callerScope = cfg.scope;
                if(typeof cfg.method != "undefined"){method = cfg.method;};
                if(typeof cfg.nocache != "undefined"){this.disableCaching = cfg.nocache;};
                if(typeof cfg.text != "undefined"){this.indicatorText = '<div class="loading-indicator">'+cfg.text+"</div>";};
                if(typeof cfg.scripts != "undefined"){this.loadScripts = cfg.scripts;};
                if(typeof cfg.timeout != "undefined"){this.timeout = cfg.timeout;};
            }
            this.showLoading();
            if(!discardUrl){
                this.defaultUrl = url;
            }
            if(typeof url == "function"){
                url = url.call(this);
            }

            method = method || (params ? "POST" : "GET");
            if(method == "GET"){
                url = this.prepareUrl(url);
            }

            var o = Ext.apply(cfg ||{}, {
                url : url,
                params: (typeof params == "function" && callerScope) ? params.createDelegate(callerScope) : params,
                success: this.processSuccess,
                failure: this.processFailure,
                scope: this,
                callback: undefined,
                timeout: (this.timeout*1000),
                argument: {
                	"options": cfg,
                	"url": url,
                	"form": null,
                	"callback": callback,
                	"scope": callerScope || window,
                	"params": params
                }
            });

            this.transaction = Ext.Ajax.request(o);
        }
    },

    /**
     * <p>执行表单的异步请求，然后根据响应response更新元素。Performs an async form post, updating this element with the response. 
     * 表单若有enctype="<a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form-data</a>"的属性，即被认为是文件上传。
     * If the form has the attribute
     * enctype="<a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form-data</a>", it assumes it's a file upload.
     * SSL文件上传应使用this.sslBlankUrl以阻止IE的安全警告。
     * Uses this.sslBlankUrl for SSL file uploads to prevent IE security warning.</p>
     * 
     * <p>不能通过常规的“Ajax”方法来上传文件，XMLHttpRequests是不能为处理二进制文件服务的。File uploads are not performed using normal "Ajax" techniques, that is they are <b>not</b>
     * performed using XMLHttpRequests. Instead the form is submitted in the standard manner with the
     * DOM <tt>&lt;form></tt> element temporarily modified to have its
     * <a href="http://www.w3.org/TR/REC-html40/present/frames.html#adef-target">target</a> set to refer
     * to a dynamically generated, hidden <tt>&lt;iframe></tt> which is inserted into the document
     * but removed after the return data has been gathered.</p>
     * <p>Be aware that file upload packets, sent with the content type <a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form-data</a>
     * and some server technologies (notably JEE) may require some custom processing in order to
     * retrieve parameter names and parameter values from the packet content.</p>
     * @param {String/HTMLElement} form 表单元素或表单idThe form Id or form element
     * @param {String} url （可选的） 表单提交的url。如忽略则采用表单的action属性(optional) The url to pass the form to. If omitted the action attribute on the form will be used.
     * @param {Boolean} reset （可选的） 完成更新后是否试着将表单复位(optional) Whether to try to reset the form after the update
     * @param {Function} callback （可选的） 事务完成后执行的回调，回调带下列参数：(optional) Callback when transaction is complete. The following
     * parameters are passed:<ul>
     * <li><b>el</b> : Ext.Element<p class="sub-desc">被更新的元素The Element being updated.</p></li>
     * <li><b>success</b> : Boolean<p class="sub-desc">True表示成功，false表示失败True for success, false for failure.</p></li>
     * <li><b>response</b> : XMLHttpRequest<p class="sub-desc">进行更新的那个XMLHttpRequest对象The XMLHttpRequest which processed the update.</p></li></ul>
     */
    formUpdate : function(form, url, reset, callback){
        if(this.fireEvent("beforeupdate", this.el, form, url) !== false){
            if(typeof url == "function"){
                url = url.call(this);
            }
            form = Ext.getDom(form)
            this.transaction = Ext.Ajax.request({
                form: form,
                url:url,
                success: this.processSuccess,
                failure: this.processFailure,
                scope: this,
                timeout: (this.timeout*1000),
                argument: {
                	"url": url,
                	"form": form,
                	"callback": callback,
                	"reset": reset
                }
            });
            this.showLoading.defer(1, this);
        }
    },

    /**
     * 根据最后一次使用的url，或属性defaultUrl，刷新元素。
     * 如果未发现url，则立即返回。
     * @param {Function} callback （可选的） Callback 事务完成后，执行的回调（带参数oElement, bSuccess）
     */
    refresh : function(callback){
        if(this.defaultUrl == null){
            return;
        }
        this.update(this.defaultUrl, null, callback, true);
    },

    /**
     * 设置该元素自动刷新。
     * @param {Number} interval 更新频率（单位：秒）
     * @param {String/Function} url （可选的） 请求的url或是能够返回url的函数（默认为最后使用那个的url）
     * @param {String/Object} params （可选的） 提交的参数，为可url编码的字符串"&param1=1&param2=2"，也可是对象的形式{param1: 1, param2: 2}
     * @param {Function} callback （可选的） Callback 事务完成后执行的回调（带参数oElement, bSuccess）
     * @param {Boolean} refreshNow （可选的） 是否立即执行更新，或等待下一次更新
     */
    startAutoRefresh : function(interval, url, params, callback, refreshNow){
        if(refreshNow){
            this.update(url || this.defaultUrl, params, callback, true);
        }
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
        }
        this.autoRefreshProcId = setInterval(this.update.createDelegate(this, [url || this.defaultUrl, params, callback, true]), interval*1000);
    },

    /**
     * 停止该元素的自动刷新
     */
     stopAutoRefresh : function(){
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
            delete this.autoRefreshProcId;
        }
    },

    isAutoRefreshing : function(){
       return this.autoRefreshProcId ? true : false;
    },

    /**
     * 把元素换成“加载中”的状态，可重写该方法执行自定义的动作。
     */
    showLoading : function(){
        if(this.showLoadIndicator){
            this.el.update(this.indicatorText);
        }
    },

    /**
     * 加入查询字符串的唯一的参数，前提是disableCaching = true。
     * @private
     */
    prepareUrl : function(url){
        if(this.disableCaching){
            var append = "_dc=" + (new Date().getTime());
            if(url.indexOf("?") !== -1){
                url += "&" + append;
            }else{
                url += "?" + append;
            }
        }
        return url;
    },

    /**
     * @private
     */
    processSuccess : function(response){
        this.transaction = null;
        if(response.argument.form && response.argument.reset){
            try{ // put in try/catch since some older FF releases had problems with this
                response.argument.form.reset();
            }catch(e){}
        }
        if(this.loadScripts){
            this.renderer.render(this.el, response, this,
                this.updateComplete.createDelegate(this, [response]));
        }else{
            this.renderer.render(this.el, response, this);
            this.updateComplete(response);
        }
    },

    updateComplete : function(response){
        this.fireEvent("update", this.el, response);
        if(typeof response.argument.callback == "function"){
            response.argument.callback.call(response.argument.scope, this.el, true, response, response.argument.options);
        }
    },

    /**
     * @private
     */
    processFailure : function(response){
        this.transaction = null;
        this.fireEvent("failure", this.el, response);
        if(typeof response.argument.callback == "function"){
            response.argument.callback.call(response.argument.scope, this.el, false, response, response.argument.options);
        }
    },

    /**
     * 为这次更新设置内容渲染器。参阅{@link Ext.Updater.BasicRenderer#render}的更多资料。
     * @param {Object} renderer 实现render()的对象
     */
    setRenderer : function(renderer){
        this.renderer = renderer;
    },
    /**
     * 返回Updater当前的内容渲染器。参阅{@link Ext.Updater.BasicRenderer#render}以了解更多。
     * Returns the current content renderer for this Updater. See {@link Ext.Updater.BasicRenderer#render} for more details.
     * @return {Object}
     */
    getRenderer : function(){
       return this.renderer;
    },

    /**
     * 为这次更新设置defaultUrl
     * @param {String/Function} defaultUrl URL或是能返回的URL的函数
     */
    setDefaultUrl : function(defaultUrl){
        this.defaultUrl = defaultUrl;
    },

    /**
     * 取消执行事务
     */
    abort : function(){
        if(this.transaction){
            Ext.Ajax.abort(this.transaction);
        }
    },

    /**
     * 当更新进行时返回true。
     * @return {Boolean}
     */
    isUpdating : function(){
        if(this.transaction){
            return Ext.Ajax.isLoading(this.transaction);
        }
        return false;
    }
});

/**
 * @class Ext.Updater.defaults
 * UpdateManager组件中可定制的属性，这里是默认值集合。
 */
   Ext.Updater.defaults = {
       /**
         * 以秒为单位的请求超时时限（默认为30秒）。
         * @type Number
         */
         timeout : 30,

        /**
         * True表示为执行脚本（默认为false）。
         * @type Boolean
         */
        loadScripts : false,

        /**
        * 空白页的URL，通过SSL链接上传文件时使用（默认为“javascript:false”）。
        * @type String
        */
        sslBlankUrl : (Ext.SSL_SECURE_URL || "javascript:false"),
        /**
         * 是否添加一个唯一的参数以使接到请求时禁止缓存（默认为 false）。
         * @type Boolean
         */
        disableCaching : false,
        /**
         * 加载时是否显示“indicatorText”（默认为 true）。
         * @type Boolean
         */
        showLoadIndicator : true,
        /**
         * 加载指示器显示的内容（默认为'&lt;div class="loading-indicator"&gt;Loading...&lt;/div&gt;'）
         * @type String
         */
        indicatorText : '<div class="loading-indicator">Loading...</div>'
   };

/**
 * 静态的快捷方法。这个方法已经是过时的，推荐使用el.load({url:'foo.php', ...})。
 *Usage:
 * <pre><code>Ext.Updater.updateElement("my-div", "stuff.php");</code></pre>
 * @param {Mixed} el The element to update
 * @param {String} url The url
 * @param {String/Object} params (optional) Url encoded param string or an object of name/value pairs
 * @param {Object} options (optional) A config object with any of the Updater properties you want to set - for example: {disableCaching:true, indicatorText: "Loading data..."}
 * @static
 * @deprecated
 * @member Ext.Updater
 */
Ext.Updater.updateElement = function(el, url, params, options){
    var um = Ext.get(el).getUpdater();
    Ext.apply(um, options);
    um.update(url, params, options ? options.callback : null);
};
// alias for backwards compat
Ext.Updater.update = Ext.Updater.updateElement;
/**
 * @class Ext.Updater.BasicRenderer
 * 默认的内容渲染器。使用responseText更新元素的innerHTML属性。
 */
Ext.Updater.BasicRenderer = function(){};

Ext.Updater.BasicRenderer.prototype = {
    /**
     * 当事务完成并准备更新元素的时候调用此方法。
     * BasicRenderer 使用 responseText 更新元素的 innerHTML 属性。
     * 如想要指定一个定制的渲染器（如：XML 或 JSON），使用“render(el, response)”方法创建一个对象，
     * 并通过setRenderer方法传递给UpdateManager。
     * @param {Ext.Element} el 所渲染的元素
     * @param {Object} response XMLHttpRequest对象
     * @param {Updater} updateManager 调用的UpdateManager对象
     * @param {Function} callback 如果loadScripts属性为true时，UpdateManager对象需要指定一个回调函数
     */
     render : function(el, response, updateManager, callback){
        el.update(response.responseText, updateManager.loadScripts, callback);
    }
};

Ext.UpdateManager = Ext.Updater;
