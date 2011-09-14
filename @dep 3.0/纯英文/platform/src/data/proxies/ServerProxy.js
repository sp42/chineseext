/**
 * @author Ed Spencer
 * @class Ext.data.ServerProxy
 * @extends Ext.data.Proxy
 * 
 * <p>ServerProxy is a superclass of {@link Ext.data.ScriptTagProxy ScriptTagProxy} and {@link Ext.data.AjaxProxy AjaxProxy},
 * and would not usually be used directly.</p>
 * 
 * <p>ServerProxy should ideally be named HttpProxy as it is a superclass for all HTTP proxies - for Ext JS 4.x it has been 
 * called ServerProxy to enable any 3.x applications that reference the HttpProxy to continue to work (HttpProxy is now an 
 * alias of AjaxProxy).</p>
 */
Ext.data.ServerProxy = Ext.extend(Ext.data.Proxy, {
    /**
     * @cfg {String} url The URL from which to request the data object.
     */
    
    /**
     * @cfg {Boolean} noCache (optional) Defaults to true. Disable caching by adding a unique parameter
     * name to the request.
     */
    noCache : true,
    
    /**
     * @cfg {String} cacheString The name of the cache param added to the url when using noCache (defaults to "_dc")
     */
    cacheString: "_dc",
    
    /**
     * @cfg {Number} timeout (optional) The number of milliseconds to wait for a response. Defaults to 30 seconds.
     */
    timeout : 30000,
    
    /**
     * @ignore
     */
    constructor: function(config) {
        Ext.data.ServerProxy.superclass.constructor.call(this, config);
        
        /**
         * @cfg {Object} extraParams Extra parameters that will be included on every request. Individual requests with params
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
     * Creates and returns an Ext.data.Request object based on the options passed by the {@link Ext.data.Store Store}
     * that this Proxy is attached to.
     * @param {Ext.data.Operation} operation The {@link Ext.data.Operation Operation} object to execute
     * @return {Ext.data.Request} The request object
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