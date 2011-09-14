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
 * @class Ext.util.Router
 * @extends Ext.util.Observable
 * @ignore
 */
Ext.util.Router = Ext.extend(Ext.util.Observable, {
    
    constructor: function(config) {
        config = config || {};

        Ext.apply(this, config, {
            defaults: {
                action: 'index'
            }
        });
        
        this.routes = [];

        Ext.util.Router.superclass.constructor.call(this, config);
    },
    
    /**
     * 连接基于url的路由到一个加上额外参数的控制器、动作结对。
     * Connects a url-based route to a controller/action pair plus additional params
     * @param {String} url 要识辨的url。The url to recognize
     */
    connect: function(url, params) {
        params = Ext.apply({url: url}, params || {}, this.defaults);
        var route = new Ext.util.Route(params);
        
        this.routes.push(route);
        
        return route;
    },
    
    /**
     * 识辨到路由器的url字符串，返回控制器、动作结对。
     * Recognizes a url string connected to the Router, return the controller/action pair plus any additional
     * config associated with it
     * @param {String} url 要识辨的url。The url to recognize
     * @return {Object/undefined} 如果能够识别url，那么调用控制器和动作。否则就是undefined。If the url was recognized, the controller and action to call, else undefined
     */
    recognize: function(url) {
        var routes = this.routes,
            length = routes.length,
            i, result;
        
        for (i = 0; i < length; i++) {
            result = routes[i].recognize(url);
            
            if (result != undefined) {
                return result;
            }
        }
        return undefined;
    },
    
    /**
     * 快捷方法， 调用送入的函数，该函数包含了路由器实例。例如：
     * Convenience method which just calls the supplied function with the Router instance. Example usage:
<pre><code>
Ext.Router.draw(function(map) {
    map.connect('activate/:token', {controller: 'users', action: 'activate'});
    map.connect('home',            {controller: 'index', action: 'home'});
});
</code></pre>
     * @param {Function} fn 要调用的函数。The fn to call
     */
    draw: function(fn) {
        fn.call(this, this);
    }
});

Ext.Router = new Ext.util.Router();