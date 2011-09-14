/*
 * @version Sencha 1.0RC-1
 * @ignore
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
 * @class Ext.data.AjaxProxy
 * @extends Ext.data.ServerProxy
 * 
 * <p>处理数据请求的{@link Ext.data.Proxy}实现，只针对同源的页面。An implementation of {@link Ext.data.Proxy} that processes data requests within the same
 * domain of the originating page.</p>
 * 
 * <p>
 * 注意这个类不能脱离本页面的范围进行跨域（Cross Domain）获取数据。要进行跨域获取数据，请使用{@link Ext.data.ScriptTagProxy ScriptTagProxy}。
 * <b>Note</b>: this class cannot be used to retrieve data from a domain other
 * than the domain from which the running page was served. For cross-domain requests, use a
 * {@link Ext.data.ScriptTagProxy ScriptTagProxy}.</p>
 * 
 * <p>
 * 为了浏览器能成功解析返回来的XML document对象，HTTP Response头的Content-Type必须被设成为"<tt>text/xml</tt>"。
 * Be aware that to enable the browser to parse an XML document, the server must set
 * the Content-Type header in the HTTP response to "<tt>text/xml</tt>".</p>
 * 
 * @constructor
 * 
 * <p>
 * 注意如果该AjaxProxy正在使用的是{@link Ext.data.Store Store}，那么Store的{@link #load}调用将会覆盖全部指定的<tt>callback</tt>与<tt>params</tt>选项。
 * 这样，在Store的{@link Ext.data.Store#events events}那里就可以改变参数，或处理加载事件。
 * 在实例化的时候就会使用了Store的{@link Ext.data.Store#baseParams baseParams}。<br />
 * Note that if this AjaxProxy is being used by a {@link Ext.data.Store Store}, then the
 * Store's call to {@link #load} will override any specified <tt>callback</tt> and <tt>params</tt>
 * options. In this case, use the Store's {@link Ext.data.Store#events events} to modify parameters,
 * or react to loading events. The Store's {@link Ext.data.Store#baseParams baseParams} may also be
 * used to pass parameters known at instantiation time.</p>
 * 
 * <p>如果传入一个选项参数，那么就即会使用{@link Ext.Ajax}这个单例对象进行网络通讯。If an options parameter is passed, the singleton {@link Ext.Ajax} object will be used to make
 * the request.</p>
 */
Ext.data.AjaxProxy = Ext.extend(Ext.data.ServerProxy, {
    /**
     * @property actionMethods
     * 映射动作名称到HTTP请求方法。AjaxProxy只是简单地认为“GET”是读操作，而“POST”就代表了其余的 'create', 'update' and 'destroy'操作。
     * 要应用的RESTful方法，可以参考{@link Ext.data.RestProxy}。
     * Mapping of action name to HTTP request method. In the basic AjaxProxy these are set to 'GET' for 'read' actions and 'POST' 
     * for 'create', 'update' and 'destroy' actions. The {@link Ext.data.RestProxy} maps these to the correct RESTful methods.
     */
    actionMethods: {
        create : 'POST',
        read   : 'GET',
        update : 'POST',
        destroy: 'POST'
    },
    
    /**
     * @cfg {Object} headers 添加到AJAX请求的头部。默认为<tt>undefined</tt>。Any headers to add to the Ajax request. Defaults to <tt>undefined</tt>.
     */
    
    constructor: function() {
        this.addEvents(
            /**
             * @event exception
             * 当数据加载的时候如有错误发生触发该事件。
             * Fires when the server returns an exception
             * @param {Ext.data.Proxy} this
             * @param {Object} response 响应对象。The response from the AJAX request
             * @param {Ext.data.Operation} operation 操作对象。The operation that triggered request
             */
            'exception'
        );
        
        Ext.data.AjaxProxy.superclass.constructor.apply(this, arguments);    
    },
    
    /**
     * @ignore
     */
    doRequest: function(operation, callback, scope) {
        var writer  = this.getWriter(),
            request = this.buildRequest(operation, callback, scope);
            
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
        
        Ext.apply(request, {
            headers : this.headers,
            timeout : this.timeout,
            scope   : this,
            callback: this.createRequestCallback(request, operation, callback, scope),
            method  : this.getMethod(request)
        });
        
        Ext.Ajax.request(request);
        
        return request;
    },
    
    /**
     * 根据给出请求对象返回其HTTP方法。默认返回{@link #actionMethods}中的一种。
     * Returns the HTTP method name for a given request. By default this returns based on a lookup on {@link #actionMethods}.
     * @param {Ext.data.Request} request 请求对象。The request object
     * @return {String} HTTP请求方法，应该是以下'GET'、'POST'、'PUT'或'DELETE'中的一种。The HTTP method to use (should be one of 'GET', 'POST', 'PUT' or 'DELETE')
     */
    getMethod: function(request) {
        return this.actionMethods[request.action];
    },
    
    /**
     * @private
     * TODO: This is currently identical to the ScriptTagProxy version except for the return function's signature. There is a lot
     * of code duplication inside the returned function so we need to find a way to DRY this up.
     * @param {Ext.data.Request} request The Request object
     * @param {Ext.data.Operation} operation The Operation being executed
     * @param {Function} callback The callback function to be called when the request completes. This is usually the callback
     * passed to doRequest
     * @param {Object} scope The scope in which to execute the callback function
     * @return {Function} The callback function
     */
    createRequestCallback: function(request, operation, callback, scope) {
        var me = this;
        
        return function(options, success, response) {
            if (success === true) {
                var reader = me.getReader(),
                    result = reader.read(response);

                //see comment in buildRequest for why we include the response object here
                Ext.apply(operation, {
                    response : response,
                    resultSet: result
                });

                operation.setCompleted();
                operation.setSuccessful();
            } else {
                me.fireEvent('exception', this, response, operation);
                
                //TODO: extract error message from reader
                operation.setException();                
            }
            
            //this callback is the one that was passed to the 'read' or 'write' function above
            if (typeof callback == 'function') {
                callback.call(scope || me, operation);
            }
            
            me.afterRequest(request, true);
        };
    }
});

Ext.data.ProxyMgr.registerType('ajax', Ext.data.AjaxProxy);

//backwards compatibility, remove in Ext JS 5.0
Ext.data.HttpProxy = Ext.data.AjaxProxy;