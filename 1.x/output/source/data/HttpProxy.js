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
 * @class Ext.data.HttpProxy
 * An implementation of {@link Ext.data.DataProxy} that reads a data object from an {@link Ext.data.Connection} object
 * configured to reference a certain URL.<br><br>
 * <p>
 * <em>Note that this class cannot be used to retrieve data from a domain other than the domain
 * from which the running page was served.<br><br>
 * <p>
 * For cross-domain access to remote data, use an {@link Ext.data.ScriptTagProxy}.</em><br><br>
 * <p>
 * Be aware that to enable the browser to parse an XML document, the server must set
 * the Content-Type header in the HTTP response to "text/xml".
 * @constructor
 * @param {Object} conn Connection config options to add to each request (e.g. {url: 'foo.php'} or
 * an {@link Ext.data.Connection} object.  If a Connection config is passed, the singleton {@link Ext.Ajax} object
 * will be used to make the request.
 */

 /**
 * @ Ext.data.HttpProxy 类
 *  Ext.data.DataProxy类的一个实现类,能从Ext.data.Connection(对某一url有着引用的)对象读取数据 <br><br>
 * <p>
 * <em>注意:该类不能够被用来从非本域(本域指为提供当前页面服务的域)的其它域外获取数据<br><br>
 * <p>
 * 使用Ext.data.ScriptTagProxy,从交叉域访问远程数据.</em><br><br>
 * <p>
 * 必须要明白,为了使浏览器能够解析一xml document,该服务器必须将http 响应头的content-type的值为"text/xml"
 * @构建器
 * @param {Object} conn 添加入每个请求中的Connection配置项(如{url:'foo.php'}) 或者 一个Ext.data.Connection对象.
 * 如果一个Connection配置被传入,该单例Ext.Ajax对象将会被用来创建请求
 */
Ext.data.HttpProxy = function(conn){
    Ext.data.HttpProxy.superclass.constructor.call(this);
    // is conn a conn config or a real conn?
    this.conn = conn;
    this.useAjax = !conn || !conn.events;
};

Ext.extend(Ext.data.HttpProxy, Ext.data.DataProxy, {
    /**
     * Return the {@link Ext.data.Connection} object being used by this Proxy.
     * @return {Connection} The Connection object. This object may be used to subscribe to events on
     * a finer-grained basis than the DataProxy events.
     */
	  /**
     * 返回该Proxy使用的Ext.data.Connection对象.
	 * @return {Connection} 该Connection对象.该对象可以被用来订阅事件
     */
    getConnection : function(){
        return this.useAjax ? Ext.Ajax : this.conn;
    },

    /**
     * Load data from the configured {@link Ext.data.Connection}, read the data object into
     * a block of Ext.data.Records using the passed {@link Ext.data.DataReader} implementation, and
     * process that block using the passed callback.
     * @param {Object} params An object containing properties which are to be used as HTTP parameters
     * for the request to the remote server.
     * @param {Ext.data.DataReader} reader The Reader object which converts the data
     * object into a block of Ext.data.Records.
     * @param {Function} callback The function into which to pass the block of Ext.data.Records.
     * The function must be passed <ul>
     * <li>The Record block object</li>
     * <li>The "arg" argument from the load function</li>
     * <li>A boolean success indicator</li>
     * </ul>
     * @param {Object} scope The scope in which to call the callback
     * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
     */
	 /**
     * 从Ext.data.Connection的配置装载数据,使用传入的Ext.data.DataReader实现类将数据对象读入到
	 * Ext.data.Records数据块中,并通过传入的回调函数处理该数据块
     * @param {Object} params 一个包含请求远程主机的http 参数作为属性的对象
     * @param {Ext.data.DataReader} reader 一个能将数据对象转换成Ext.data.Record块的数据读取器
     * @param {Function} callback 该函数在传入的Ext.data.Record块中.该函数必须被传入 <ul>
     * <li>Record 块对象</li>
     * <li>来自装载函数中的参数</li>
     * <li>成功指示器</li>
     * </ul>
     * @param {Object} scope 回调函数的作用域
     * @param {Object} arg 一可选参数.被传入回调函中中作为它的第二个参数
     */
    load : function(params, reader, callback, scope, arg){
        if(this.fireEvent("beforeload", this, params) !== false){
            var  o = {
                params : params || {},
                request: {
                    callback : callback,
                    scope : scope,
                    arg : arg
                },
                reader: reader,
                callback : this.loadResponse,
                scope: this
            };
            if(this.useAjax){
                Ext.applyIf(o, this.conn);
                if(this.activeRequest){
                    Ext.Ajax.abort(this.activeRequest);
                }
                this.activeRequest = Ext.Ajax.request(o);
            }else{
                this.conn.request(o);
            }
        }else{
            callback.call(scope||this, null, arg, false);
        }
    },

    // private
    loadResponse : function(o, success, response){
        delete this.activeRequest;
        if(!success){
            this.fireEvent("loadexception", this, o, response);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        var result;
        try {
            result = o.reader.read(response);
        }catch(e){
            this.fireEvent("loadexception", this, o, response, e);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        this.fireEvent("load", this, o, o.request.arg);
        o.request.callback.call(o.request.scope, result, o.request.arg, true);
    },

    // private
    update : function(dataSet){

    },

    // private
    updateResponse : function(dataSet){

    }
});