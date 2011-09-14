/*
 * @version Sencha 1.0RC-1
 * @ignore
 * @todo
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
 * @class Ext.data.ServerProxy
 * @extends Ext.data.Proxy
 * 
 * <p>
 * ServerProxy是{@link Ext.data.ScriptTagProxy ScriptTagProxy}这{@link Ext.data.AjaxProxy AjaxProxy}这个两个类的超类。一般情况下不直接使用。
 * ServerProxy is a superclass of {@link Ext.data.ScriptTagProxy ScriptTagProxy} and {@link Ext.data.AjaxProxy AjaxProxy},
 * and would not usually be used directly.</p>
 * 
 * <p>
 * 理想情况下，应该称ServerProxy为HttpProxy，因为这是涵盖所有HTTP Proxy的超类——但在Ext4.0中作了调整，HttpProxy只是AjaxProxy的简写。
 * 3.x中的HttpProxy则变为这里的ServerProxy。
 * ServerProxy should ideally be named HttpProxy as it is a superclass for all HTTP proxies - for Ext JS 4.x it has been 
 * called ServerProxy to enable any 3.x applications that reference the HttpProxy to continue to work (HttpProxy is now an 
 * alias of AjaxProxy).</p>
 */
Ext.data.ServerProxy = Ext.extend(Ext.data.Proxy, {
    /**
     * @cfg {String} url 请求数据对象到哪里的url。The URL from which to request the data object.
     */
    
    /**
     * @cfg {Boolean} noCache （可选项）设置为true就会添加一个独一无二的cache-buster参数来获取请求（默认值为true）。(optional) Defaults to true. Disable caching by adding a unique parameter
     * name to the request.
     */
    noCache : true,
    
    /**
     * @cfg {String} cacheString 防止缓存参数的名称。（默认为_dc）。The name of the cache param added to the url when using noCache (defaults to "_dc")
     */
    cacheString: "_dc",
    
    /**
     * @cfg {Number} timeout （可选项）一次请求超时的毫秒数（默认为30秒钟）。(optional) The number of milliseconds to wait for a response. Defaults to 30 seconds.
     */
    timeout : 30000,
    
    /**
     * @ignore
     */
    constructor: function(config) {
        Ext.data.ServerProxy.superclass.constructor.call(this, config);
        
        /**
         * @cfg {Object} extraParams 外部参数，一个包含属性的对象（这些属性在该Connection发起的每次请求中作为外部参数）。
         * Extra parameters that will be included on every request. Individual requests with params
         * of the same name will override these params when they are in conflict.
         */
        this.extraParams = config.extraParams || {};
        
        //backwards compatibility, will be deprecated in 5.0
        this.nocache = this.noCache;
    },
    
    //in a ServerProxy all four CRUD operations are executed in the same manner, so we delegate to doRequest in each case
    create: function() {
        return this.doRequest.apply(this, arguments);
    },
    
    read: function() {
        return this.doRequest.apply(this, arguments);
    },
    
    update: function() {
        return this.doRequest.apply(this, arguments);
    },
    
    destroy: function() {
        return this.doRequest.apply(this, arguments);
    },
    
    /**
     * 通过该Proxy所在的{@link Ext.data.Store Store}对象，依据其参数创建并返回一个Ext.data.Request对象。
     * Creates and returns an Ext.data.Request object based on the options passed by the {@link Ext.data.Store Store}
     * that this Proxy is attached to.
     * @param {Ext.data.Operation} operation 要执行的{@link Ext.data.Operation Operation}对象。The {@link Ext.data.Operation Operation} object to execute
     * @return {Ext.data.Request} 请求对象。The request object
     */
    buildRequest: function(operation) {
        var params = Ext.applyIf(operation.params || {}, this.extraParams || {});
        
        //copy any sorters, filters etc into the params so they can be sent over the wire
        params = Ext.applyIf(params, this.getParams(params, operation));
        
        var request = new Ext.data.Request({
            params   : params,
            action   : operation.action,
            records  : operation.records,
            operation: operation
        });
        
        request.url = this.buildUrl(request);
        
        /*
         * Save the request on the Operation. Operations don't usually care about Request and Response data, but in the
         * ServerProxy and any of its subclasses we add both request and response as they may be useful for further processing
         */
        operation.request = request;
        
        return request;
    },
    
    /**
     * @private
     * Copy any sorters, filters etc into the params so they can be sent over the wire
     */
    getParams: function(params, operation) {
        var options = ['page', 'start', 'limit', 'group', 'filters', 'sorters'],
            o = {},
            len = options.length,
            i, opt;
            
        for (i = 0; i < len; ++i) {
            opt = options[i];
            o[opt] = params[opt] || operation[opt] || o[opt];
        }
        
        return o;
    },
    
    /**
     * Generates a url based on a given Ext.data.Request object. By default, ServerProxy's buildUrl will
     * add the cache-buster param to the end of the url. Subclasses may need to perform additional modifications
     * to the url.
     * @param {Ext.data.Request} request The request object
     * @return {String} The url
     */
    buildUrl: function(request) {
        var url = request.url || this.url;
        
        if (!url) {
            throw "You are using a ServerProxy but have not supplied it with a url. ";
        }
        
        if (this.noCache) {
            url = Ext.urlAppend(url, Ext.util.Format.format("{0}={1}", this.cacheString, (new Date().getTime())));
        }
        
        return url;
    },
    
    /**
     * In ServerProxy subclasses, the {@link #create}, {@link #read}, {@link #update} and {@link #destroy} methods all pass
     * through to doRequest. Each ServerProxy subclass must implement the doRequest method - see {@link Ext.data.ScriptTagProxy}
     * and {@link Ext.data.AjaxProxy} for examples. This method carries the same signature as each of the methods that delegate to it.
     * @param {Ext.data.Operation} operation The Ext.data.Operation object
     * @param {Function} callback The callback function to call when the Operation has completed
     * @param {Object} scope The scope in which to execute the callback
     */
    doRequest: function(operation, callback, scope) {
        throw new Error("The doRequest function has not been implemented on your Ext.data.ServerProxy subclass. See src/data/ServerProxy.js for details");
    },
    
    /**
     * Optional callback function which can be used to clean up after a request has been completed.
     * @param {Ext.data.Request} request The Request object
     * @param {Boolean} success True if the request was successful
     */
    afterRequest: Ext.emptyFn,
    
    onDestroy: function() {
        Ext.destroy(this.reader, this.writer);
        
        Ext.data.ServerProxy.superclass.destroy.apply(this, arguments);
    }
});