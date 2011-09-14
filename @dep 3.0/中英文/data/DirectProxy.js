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
 * @class Ext.data.DirectProxy
 * @extends Ext.data.DataProxy
 */
Ext.data.DirectProxy = function(config){
    Ext.apply(this, config);
    if(typeof this.paramOrder == 'string'){
        this.paramOrder = this.paramOrder.split(/[\s,|]/);
    }
    Ext.data.DirectProxy.superclass.constructor.call(this, config);
};

Ext.extend(Ext.data.DirectProxy, Ext.data.DataProxy, {
    /**
     * @cfg {Array/String} paramOrder 
     * 默认为<tt>undefined</tt>。服务端处理执行的参数顺序列表。
     * 指定一定的顺序的话服务端将甄别处理，可以(1)字符串的数组，或(2)空格、逗号、分号划分的字符串。例如以下的字符都可被处理：
     * <br />
     * Defaults to <tt>undefined</tt>. A list of params to be executed
     * server side.  Specify the params in the order in which they must be executed on the server-side
     * as either (1) an Array of String values, or (2) a String of params delimited by either whitespace,
     * comma, or pipe. For example,
     * any of the following would be acceptable:<pre><code>
paramOrder: ['param1','param2','param3']
paramOrder: 'param1 param2 param3'
paramOrder: 'param1,param2,param3'
paramOrder: 'param1|param2|param'
     </code></pre>
     */
    paramOrder: undefined,

    /**
     * @cfg {Boolean} paramsAsHash
     * 以一个Hash结果发送参数（默认为<tt>true</tt>）。有了<tt>{@link #paramOrder}</tt>这项那此项无效。<br />
     * Send parameters as a collection of named arguments (defaults to <tt>true</tt>). Providing a
     * <tt>{@link #paramOrder}</tt> nullifies this configuration.
     */
    paramsAsHash: true,

    /**
     * @cfg {Function} directFn
     * 当发起一个请求的时候执行的函数。directFn是另外一个简单的方案，适用于在未完整实现CRUD Api的Store的时候，定义一个API的配置参数。<br />
     * Function to call when executing a request.  directFn is a simple alternative to defining the api configuration-parameter
     * for Store's which will not implement a full CRUD api.
     */
    directFn : undefined,

    /**
     * {@link Ext.data.DataProxy#doRequest}的DirectProxy实现。
     * DirectProxy implementation of {@link Ext.data.DataProxy#doRequest}
     * @param {String} action CRUD操作的类型。The crud action type (create, read, update, destroy)
     * @param {Ext.data.Record/Ext.data.Record[]} rs 动作操作后，rs变为null。If action is load, rs will be null
     * @param {Object} params 表明HTTP参数的参数对象，请求到远程服务器上。An object containing properties which are to be used as HTTP parameters
     * for the request to the remote server.
     * @param {Ext.data.DataReader} reader Reader的作用是转换数据对象为标准的{@link Ext.data.DataProxy#doRequest}块。The Reader object which converts the data
     * object into a block of Ext.data.Records.
     * @param {Function} callback
     * <div class="sub-desc"><p>请求完毕后的执行的函数。A function to be called after the request.
     * 这个<tt>回调函数</tt>就有以下的参数：The <tt>callback</tt> is passed the following arguments:<ul>
     * <li><tt>r</tt> : Ext.data.Record[] Ext.data.Records数据块。The block of Ext.data.Records.</li>
     * <li><tt>options</tt>: 该次动作请求的参数对象。Options object from the action request</li>
     * <li><tt>success</tt>:是否XHR通讯成功？ Boolean success indicator</li></ul></p></div>
     * @param {Object} scope 回调函数的作用域（即<code>this</code>引用）。默认为浏览器的window对象。The scope (<code>this</code> reference) in which the callback function is executed. Defaults to the browser window.
     * @param {Object} arg 送入到回调函数的第二个参数，可选的。An optional argument which is passed to the callback as its second parameter.
     * @protected
     */
    doRequest : function(action, rs, params, reader, callback, scope, options) {
        var args = [],
            directFn = this.api[action] || this.directFn;

        switch (action) {
            case Ext.data.Api.actions.create:
                args.push(params.jsonData);		// <-- create(Hash)
                break;
            case Ext.data.Api.actions.read:
                // If the method has no parameters, ignore the paramOrder/paramsAsHash.
                if(directFn.directCfg.method.len > 0){
                    if(this.paramOrder){
                        for(var i = 0, len = this.paramOrder.length; i < len; i++){
                            args.push(params[this.paramOrder[i]]);
                        }
                    }else if(this.paramsAsHash){
                        args.push(params);
                    }
                }
                break;
            case Ext.data.Api.actions.update:
                args.push(params.jsonData);        // <-- update(Hash/Hash[])
                break;
            case Ext.data.Api.actions.destroy:
                args.push(params.jsonData);        // <-- destroy(Int/Int[])
                break;
        }

        var trans = {
            params : params || {},
            request: {
                callback : callback,
                scope : scope,
                arg : options
            },
            reader: reader
        };

        args.push(this.createCallback(action, rs, trans), this);
        directFn.apply(window, args);
    },

    // private
    createCallback : function(action, rs, trans) {
        return function(result, res) {
            if (!res.status) {
                // @deprecated fire loadexception
                if (action === Ext.data.Api.actions.read) {
                    this.fireEvent("loadexception", this, trans, res, null);
                }
                this.fireEvent('exception', this, 'remote', action, trans, res, null);
                trans.request.callback.call(trans.request.scope, null, trans.request.arg, false);
                return;
            }
            if (action === Ext.data.Api.actions.read) {
                this.onRead(action, trans, result, res);
            } else {
                this.onWrite(action, trans, result, res, rs);
            }
        };
    },
    /**
     * 读操作的回调函数。
     * Callback for read actions
     * @param {String} action [Ext.data.Api.actions.create|read|update|destroy]
     * @param {Object} trans 请求的事务对象。The request transaction object
     * @param {Object} result 返回的数据对象。Data object picked out of the server-response.
     * @param {Object} res 服务端响应。The server response
     * @protected
     */
    onRead : function(action, trans, result, res) {
        var records;
        try {
            records = trans.reader.readRecords(result);
        }
        catch (ex) {
            // @deprecated: Fire old loadexception for backwards-compat.
            this.fireEvent("loadexception", this, trans, res, ex);

            this.fireEvent('exception', this, 'response', action, trans, res, ex);
            trans.request.callback.call(trans.request.scope, null, trans.request.arg, false);
            return;
        }
        this.fireEvent("load", this, res, trans.request.arg);
        trans.request.callback.call(trans.request.scope, records, trans.request.arg, true);
    },
    /**
     * 写操作的回调函数。
     * Callback for write actions
     * @param {String} action [{@link Ext.data.Api#actions create|read|update|destroy}]
     * @param {Object} trans 请求的事务对象。The request transaction object
     * @param {Object} result 返回的数据对象。Data object picked out of the server-response.
     * @param {Object} res 服务端响应。The server response
     * @param {Ext.data.Record/[Ext.data.Record]} rs 执行动作相关的Store结果集。The Store resultset associated with the action.
     * @protected
     */
    onWrite : function(action, trans, result, res, rs) {
        var data = trans.reader.extractData(result);
        this.fireEvent("write", this, action, data, res, rs, trans.request.arg);
        trans.request.callback.call(trans.request.scope, data, res, true);
    }
});

