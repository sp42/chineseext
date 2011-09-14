/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://www.extjs.com/license
 */

/**
 * @class Ext.UpdateManager
 * @extends Ext.util.Observable
 *为元素对象提供Ajax式更新。<br><br>
 * 用法：<br>
 * <pre><code>
 * // 从Ext.Element对象上获取
 * var el = Ext.get("foo");
 * var mgr = el.getUpdateManager();
 * mgr.update("http://myserver.com/index.php", "param1=1&amp;param2=2");
 * ...
 * mgr.formUpdate("myFormId", "http://myserver.com/index.php");
 * <br>
 * // 或直接声明（返回相同的UpdateManager实例）
 * var mgr = new Ext.UpdateManager("myElementId");
 * mgr.startAutoRefresh(60, "http://myserver.com/index.php");
 * mgr.on("update", myFcnNeedsToKnow);
 * <br>
   //用快捷的方法在元素上直接访问
   Ext.get("foo").load({
        url: "bar.php",
        scripts:true,
        params: "for=bar",
        text: "Loading Foo..."
   });
 * </code></pre>
 * @constructor
 * 直接创建新UpdateManager。
 * @param {String/HTMLElement/Ext.Element} el 被更新的元素
 * @param {Boolean} forceNew （可选地）  默认下 构造器会检查传入之元素是否有UpdateManager，如果有的话它返回该实例。这个也跳过检查（继承类时有用）。
 */
Ext.UpdateManager = function(el, forceNew){
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

    this.addEvents({
        /**
         * @event beforeupdate
         * 在一个更新开始之前触发，如在事件处理器中返回false即代表取消这次更新。
         * @param {Ext.Element} el
         * @param {String/Object/Function} url
         * @param {String/Object} params
         */
        "beforeupdate": true,
        /**
         * @event update
         * 当更新成功后触发
         * @param {Ext.Element} el
         * @param {Object} oResponseObject response对象
         */
        "update": true,
        /**
         * @event failure
         *  当更新失败后触发
         * @param {Ext.Element} el
         * @param {Object} oResponseObject response对象
         */
        "failure": true
    });
    var d = Ext.UpdateManager.defaults;
    /**
     * 用于SSL文件上传的空白页面地址。（默认为Ext.UpdateManager.defaults.sslBlankUrl 或 "about:blank"）
     * @type String
     */
    this.sslBlankUrl = d.sslBlankUrl;
    /**
     * 是否在请求中添加上随机的参数，以禁止返回缓冲的数据（默认为Ext.UpdateManager.defaults.disableCaching或false）
     * @type Boolean
     */
    this.disableCaching = d.disableCaching;
    /**
     * “加载中...”显示的文字（默认为 Ext.UpdateManager.defaults.indicatorText或'&lt;div class="loading-indicator"&gt;加载中...&lt;/div&gt;'）。
     * @type String
     */
    this.indicatorText = d.indicatorText;
    /**
     * 加载时是否显示像“加载中...”的文字（默认为 Ext.UpdateManager.defaults.showLoadIndicator或true）。
     * @type String
     */
    this.showLoadIndicator = d.showLoadIndicator;
    /**
     * 请求或表单post的超时时限，单位：秒（默认为Ext.UpdateManager.defaults.timeout或30秒）。
     * @type Number
     */
    this.timeout = d.timeout;

    /**
     * 是否执行输出的脚本（默认为 Ext.UpdateManager.defaults.loadScripts (false)）
     * @type Boolean
     */
    this.loadScripts = d.loadScripts;

    /**
     * 执行当前事务的事务对象。
     */
    this.transaction = null;

    /**
     * @private
     */
    this.autoRefreshProcId = null;
    /**
     * refresh()的委托，预绑定到"this"，使用myUpdater.refreshDelegate.createCallback(arg1, arg2)绑定参数。
     * @type Function
     */
    this.refreshDelegate = this.refresh.createDelegate(this);
    /**
     * update()的委托，预绑定到"this"，使用myUpdater.updateDelegate.createCallback(arg1, arg2)绑定参数。
     * @type Function
     */
    this.updateDelegate = this.update.createDelegate(this);
    /**
     * formUpdate()的委托，预绑定到"this"，使用myUpdater.formUpdateDelegate.createCallback(arg1, arg2)绑定参数。
     * @type Function
     */
    this.formUpdateDelegate = this.formUpdate.createDelegate(this);
    /**
     * @private
     */
    this.successDelegate = this.processSuccess.createDelegate(this);
    /**
     * @private
     */
    this.failureDelegate = this.processFailure.createDelegate(this);

    if(!this.renderer){
     /**
      * UpdateManager所用的渲染器。默认为{@link Ext.UpdateManager.BasicRenderer}。
      */
    this.renderer = new Ext.UpdateManager.BasicRenderer();
    }

    Ext.UpdateManager.superclass.constructor.call(this);
};

Ext.extend(Ext.UpdateManager, Ext.util.Observable, {
    /**
     * 获取当前UpdateManager所绑定的元素
     * @return {Ext.Element} 元素
     */
    getEl : function(){
        return this.el;
    },
    /**
     * 发起一个的异步请求，然后根据响应的response更新元素。
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
    update : function(url, params, callback, discardUrl){
        if(this.fireEvent("beforeupdate", this.el, url, params) !== false){
            var method = this.method, cfg;
            if(typeof url == "object"){ //必需系对象
                cfg = url;
                url = cfg.url;
                params = params || cfg.params;
                callback = callback || cfg.callback;
                discardUrl = discardUrl || cfg.discardUrl;
                if(callback && cfg.scope){
                    callback = callback.createDelegate(cfg.scope);
                }
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
                params: params,
                success: this.successDelegate,
                failure: this.failureDelegate,
                callback: undefined,
                timeout: (this.timeout*1000),
                argument: {"url": url, "form": null, "callback": callback, "params": params}
            });

            this.transaction = Ext.Ajax.request(o);
        }
    },

    /**
     * 执行表单的异步请求，然后根据响应response更新元素。
     * 表单若有enctype="multipart/form-data"的属性，即被认为是文件上传。
     * SSL文件上传应使用this.sslBlankUrl以阻止IE的安全警告。
     * @param {String/HTMLElement} form 表单元素或表单id
     * @param {String} url （可选的） 表单提交的url。如忽略则采用表单的action属性
     * @param {Boolean} reset （可选的） 完成更新后是否试着将表单复位
     * @param {Function} callback （可选的） Callback 事务完成后 ，执行的回调（带参数oElement, bSuccess）
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
                success: this.successDelegate,
                failure: this.failureDelegate,
                timeout: (this.timeout*1000),
                argument: {"url": url, "form": form, "callback": callback, "reset": reset}
            });
            this.showLoading.defer(1, this);
        }
    },

    /**
     * 根据最后一次使用的url，或属性defaultUrl，刷新元素。
     * 如果未发现url，则立即返回。
     * @param {Function} callback （可选的） Callback 事务完成，执行的回调（带参数oElement, bSuccess）
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
            try{ //由于旧版的FF这段代码会有点问题所以加上try/catch
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
            response.argument.callback(this.el, true, response);
        }
    },

    /**
     * @private
     */
    processFailure : function(response){
        this.transaction = null;
        this.fireEvent("failure", this.el, response);
        if(typeof response.argument.callback == "function"){
            response.argument.callback(this.el, false, response);
        }
    },

    /**
     * 为这次更新设置内容渲染器。参阅{@link Ext.UpdateManager.BasicRenderer#render}的更多资料。
     * @param {Object} renderer 实现render()的对象
     */
    setRenderer : function(renderer){
        this.renderer = renderer;
    },

    getRenderer : function(){
       return this.renderer;
    },

    /**
     * 为这次更新设置defaultUrl
     * @param {String/Function} defaultUrl URL或是返回的URL的函数
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
 * @class Ext.UpdateManager.defaults
 * UpdateManager组件中可定制的属性，这里是默认值集合。
 */
   Ext.UpdateManager.defaults = {
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
 * <pre><code>Ext.UpdateManager.updateElement("my-div", "stuff.php");</code></pre>
 * @param {String/HTMLElement/Ext.Element} el The element to update
 * @param {String} url The url
 * @param {String/Object} params （可选的） Url encoded param string or an object of name/value pairs
 * @param {Object} options （可选的） A config object with any of the UpdateManager properties you want to set - for example: {disableCaching:true, indicatorText: "Loading data..."}
 * @static
 * @deprecated
 * @member Ext.UpdateManager
 */
Ext.UpdateManager.updateElement = function(el, url, params, options){
    var um = Ext.get(el, true).getUpdateManager();
    Ext.apply(um, options);
    um.update(url, params, options ? options.callback : null);
};
// 向后兼容
Ext.UpdateManager.update = Ext.UpdateManager.updateElement;
/**
 * @class Ext.UpdateManager.BasicRenderer
 * 默认的内容渲染器。使用responseText更新元素的innerHTML属性。
 */
Ext.UpdateManager.BasicRenderer = function(){};

Ext.UpdateManager.BasicRenderer.prototype = {
    /**
     * 当事务完成并准备更新元素的时候调用此方法。
     * BasicRenderer 使用 responseText 更新元素的 innerHTML 属性。
     * 如想要指定一个定制的渲染器（如：XML 或 JSON），使用“render(el, response)”方法创建一个对象，
     * 并通过setRenderer方法传递给UpdateManager。
     * @param {Ext.Element} el 呈现的元素。
     * @param {Object} response YUI 响应的对象。
     * @param {UpdateManager} updateManager 调用的 UpdateManager 对象。
     * @param {Function} callback 如果 loadScripts 属性为 true 时，UpdateManager 对象需要指定一个回调函数。
     */
     render : function(el, response, updateManager, callback){
        el.update(response.responseText, updateManager.loadScripts, callback);
    }
};
