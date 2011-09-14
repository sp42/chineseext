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
 * @class Ext.data.Request
 * @extends Object
 * 
 * <p>
 * 用于表示Request对象的这么一个简单的类，它是由{@link Ext.data.ServerProxy}其子类所产生。该类就是表示统一请求的表示（representation），可在任意ServerProxy子类中使用。
 * 它并不包含任何业务逻辑也不会进行自身的请求。
 * Simple class that represents a Request that will be made by any {@link Ext.data.ServerProxy} subclass.
 * All this class does is standardize the representation of a Request as used by any ServerProxy subclass,
 * it does not contain any actual logic or perform the request itself.</p>
 * 
 * @constructor
 * @param {Object} config 可选的配置项对象。Optional config object
 */
Ext.data.Request = Ext.extend(Object, {
    /**
     * @cfg {String} action 该请求所代表的动作名称，可以是“create”、“read”、“update”或“destory”。The name of the action this Request represents. Usually one of 'create', 'read', 'update' or 'destroy'
     */
    action: undefined,
    
    /**
     * @cfg {Object} params HTTP请求的参数。可以允许Proxu及其Writer访问并且允许修改。HTTP request params. The Proxy and its Writer have access to and can modify this object.
     */
    params: undefined,
    
    /**
     * @cfg {String} method 请求的方法（默认为“GET”）。该值应该为“GET”、“POST”、“PUT”、“DELETE”之中的一个值。The HTTP method to use on this Request (defaults to 'GET'). Should be one of 'GET', 'POST', 'PUT' or 'DELETE'
     */
    method: 'GET',
    
    /**
     * @cfg {String} url 发起请求的url。The url to access on this Request
     */
    url: undefined,

    constructor: function(config) {
        Ext.apply(this, config);
    }
});