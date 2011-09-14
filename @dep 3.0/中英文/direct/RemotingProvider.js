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
 * @class Ext.direct.RemotingProvider
 * @extends Ext.direct.JsonProvider
 * 
 * <p>
 * {@link Ext.direct.RemotingProvider RemotingProvider}暴露了在客户端上访问服务端方法的方式方法。
 * 这是一种RPC（remote procedure call，远程过程调录）的连接类型，即客户端可以初始化服务端上的进程。<br />
 * The {@link Ext.direct.RemotingProvider RemotingProvider} exposes access to
 * server side methods on the client (a remote procedure call (RPC) type of
 * connection where the client can initiate a procedure on the server).
 * </p>
 * 
 * <p>
 * 这样的话，组织代码的时候会更具可维护性，客户端与服务端之间的道路怎么走也会越加地清晰。如果单使用URL的话这点是不容易做到的。
 * <br />
 * This allows for code to be organized in a fashion that is maintainable,
 * while providing a clear path between client and server, something that is
 * not always apparent when using URLs.</p>
 * 
 * <p>
 * 完成上述功能，服务端必须将有关类和方法的信息告诉给客户端知道。一般这些配置的信息由服务端的Ext.Direct包完成，构建一系列的API信息输出。<br />
 * To accomplish this the server-side needs to describe what classes and methods
 * are available on the client-side. This configuration will typically be
 * outputted by the server-side Ext.Direct stack when the API description is built.</p>
 */
Ext.direct.RemotingProvider = Ext.extend(Ext.direct.JsonProvider, {       
    /**
     * @cfg {Object} actions
     * 用对象字面化（Object literal）确定服务端的动作或方法。例如，如果供应器（Provider）是如下配置的：
     * Object literal defining the server side actions and methods. For example, if
     * the Provider is configured with:
     * <pre><code>
"actions":{ // actions对象下面的属性每个都代表者对应服务端的类。each property within the 'actions' object represents a server side Class 
    "TestAction":[ // 服务端的类其方法所组成的数组，要将他们暴露给客户端。array of methods within each server side Class to be   
    {              // stubbed out on client
        "name":"doEcho", 
        "len":1            
    },{
        "name":"multiply",// name of method
        "len":2           // 参数的个数是多少。一定要是数字类型，而不能是字符串。The number of parameters that will be used to create an
                          // array of data to send to the server side function.
                          // Ensure the server sends back a Number, not a String. 
    },{
        "name":"doForm",
        "formHandler":true, // direct the client to use specialized form handling method 
        "len":1
    }]
}
     * </code></pre>
     * <p>
     * 注意Store不是必须的，一个服务端方法可以在任何的时候被调用。下面的例子中我们<b>客户端</b>的方法调用服务端中的“乘法”，就在服务端的“TestAction”类中：
     * <br />
     * Note that a Store is not required, a server method can be called at any time.
     * In the following example a <b>client side</b> handler is used to call the
     * server side method "multiply" in the server-side "TestAction" Class:</p>
     * <pre><code>
TestAction.multiply(
    2, 4, // 这两个参数都会传到服务器中，所以指定len=2。pass two arguments to server, so specify len=2
    // 下面的回调函数在服务端调用后执行。callback function after the server is called
    // result: the result returned by the server
    //      e: Ext.Direct.RemotingEvent object result就是由服务端返回的对象，例如Ext.Direct.RemotingEvent类型的对象
    function(result, e){
        var t = e.getTransaction();
        var action = t.action; // 调用服务端的类。server side Class called
        var method = t.method; // 调用服务端的方法。server side method called
        if(e.status){
            var answer = Ext.encode(result); // 8
    
        }else{
            var msg = e.message; // 失败的信息 failure message
        }
    }
);
     * </code></pre>
     * 上面的例子中，服务端的“multiply”函数会送入两个参数（2和4）。“multiply”函数就应该返回8，最后变为<tt>result</tt>变量。
     * In the example above, the server side "multiply" function will be passed two
     * arguments (2 and 4).  The "multiply" method should return the value 8 which will be
     * available as the <tt>result</tt> in the example above. 
     */
    
    /**
     * @cfg {String/Object} namespace
     * 远程供应器的命名空间（默认为浏览器的全局空间<i>window</i>）。完全命名这个空间，或者指定一个String执行{@link Ext#namespace namespace created}隐式命名。 <br />
     * Namespace for the Remoting Provider (defaults to the browser global scope of <i>window</i>).
     * Explicitly specify the namespace Object, or specify a String to have a
     * {@link Ext#namespace namespace created} implicitly.
     */
    
    /**
     * @cfg {String} url
     * 该项是必须的。连接到{@link Ext.Direct}所在的服务端路由器（router）。
     * <b>Required<b>. The url to connect to the {@link Ext.Direct} server-side router. 
     */
    
    /**
     * @cfg {String} enableUrlEncode
     * 指定哪个param会保存方法的参数。默认是<tt>'data'</tt>。
     * Specify which param will hold the arguments for the method.
     * Defaults to <tt>'data'</tt>.
     */
    
    /**
     * @cfg {Number/Boolean} enableBuffer
     * <p>
     * 设置为<tt>true</tt>或<tt>false</tt>决定是否捆绑多个方法调用在一起。如果指定一个数字表示就等待形成一次批调用的机会（默认为10毫秒）。<br />
     * <tt>true</tt> or <tt>false</tt> to enable or disable combining of method
     * calls. If a number is specified this is the amount of time in milliseconds
     * to wait before sending a batched request (defaults to <tt>10</tt>).</p>
     * <br>
     * <p>
     * 多个调用按一定的时候聚集在一起然后统一在一次请求中发出，就可以优化程序了，因为减少了服务端之间的往返次数。<br />
     * Calls which are received within the specified timeframe will be
     * concatenated together and sent in a single request, optimizing the
     * application by reducing the amount of round trips that have to be made
     * to the server.</p>
     */
    enableBuffer: 10,
    
    /**
     * @cfg {Number} maxRetries
     * 当failure后，尝试再连接的次数。默认为一次。
     * Number of times to re-attempt delivery on failure of a call. Defaults to <tt>1</tt>.
     */
    maxRetries: 1,
    
    /**
     * @cfg {Number} timeout
     * 每次请求的超时时限。默认为<tt>undefined</tt>。
     * The timeout to use for each request. Defaults to <tt>undefined</tt>.
     */
    timeout: undefined,

    constructor : function(config){
        Ext.direct.RemotingProvider.superclass.constructor.call(this, config);
        this.addEvents(
            /**
             * @event beforecall
             * 在客户端发送PRC请求之前触发。事件处理器中返回false的话表示阻止这次远程调用。
             * Fires immediately before the client-side sends off the RPC call.
             * By returning false from an event handler you can prevent the call from
             * executing.
             * @param {Ext.direct.RemotingProvider} provider
             * @param {Ext.Direct.Transaction} transaction
             */            
            'beforecall',            
            /**
             * @event call
             * 当送往服务端的请求发送后触发。有响应的时候不会触发该事件。
             * Fires immediately after the request to the server-side is sent. This does
             * NOT fire after the response has come back from the call.
             * @param {Ext.direct.RemotingProvider} provider
             * @param {Ext.Direct.Transaction} transaction
             */            
            'call'
        );
        this.namespace = (Ext.isString(this.namespace)) ? Ext.ns(this.namespace) : this.namespace || window;
        this.transactions = {};
        this.callBuffer = [];
    },

    // private
    initAPI : function(){
        var o = this.actions;
        for(var c in o){
            var cls = this.namespace[c] || (this.namespace[c] = {}),
                ms = o[c];
            for(var i = 0, len = ms.length; i < len; i++){
                var m = ms[i];
                cls[m.name] = this.createMethod(c, m);
            }
        }
    },

    // inherited
    isConnected: function(){
        return !!this.connected;
    },

    connect: function(){
        if(this.url){
            this.initAPI();
            this.connected = true;
            this.fireEvent('connect', this);
        }else if(!this.url){
            throw 'Error initializing RemotingProvider, no url configured.';
        }
    },

    disconnect: function(){
        if(this.connected){
            this.connected = false;
            this.fireEvent('disconnect', this);
        }
    },

    onData: function(opt, success, xhr){
        if(success){
            var events = this.getEvents(xhr);
            for(var i = 0, len = events.length; i < len; i++){
                var e = events[i],
                    t = this.getTransaction(e);
                this.fireEvent('data', this, e);
                if(t){
                    this.doCallback(t, e, true);
                    Ext.Direct.removeTransaction(t);
                }
            }
        }else{
            var ts = [].concat(opt.ts);
            for(var i = 0, len = ts.length; i < len; i++){
                var t = this.getTransaction(ts[i]);
                if(t && t.retryCount < this.maxRetries){
                    t.retry();
                }else{
                    var e = new Ext.Direct.ExceptionEvent({
                        data: e,
                        transaction: t,
                        code: Ext.Direct.exceptions.TRANSPORT,
                        message: 'Unable to connect to the server.',
                        xhr: xhr
                    });
                    this.fireEvent('data', this, e);
                    if(t){
                        this.doCallback(t, e, false);
                        Ext.Direct.removeTransaction(t);
                    }
                }
            }
        }
    },

    getCallData: function(t){
        return {
            action: t.action,
            method: t.method,
            data: t.data,
            type: 'rpc',
            tid: t.tid
        };
    },

    doSend : function(data){
        var o = {
            url: this.url,
            callback: this.onData,
            scope: this,
            ts: data,
            timeout: this.timeout
        }, callData;

        if(Ext.isArray(data)){
            callData = [];
            for(var i = 0, len = data.length; i < len; i++){
                callData.push(this.getCallData(data[i]));
            }
        }else{
            callData = this.getCallData(data);
        }

        if(this.enableUrlEncode){
            var params = {};
            params[Ext.isString(this.enableUrlEncode) ? this.enableUrlEncode : 'data'] = Ext.encode(callData);
            o.params = params;
        }else{
            o.jsonData = callData;
        }
        Ext.Ajax.request(o);
    },

    combineAndSend : function(){
        var len = this.callBuffer.length;
        if(len > 0){
            this.doSend(len == 1 ? this.callBuffer[0] : this.callBuffer);
            this.callBuffer = [];
        }
    },

    queueTransaction: function(t){
        if(t.form){
            this.processForm(t);
            return;
        }
        this.callBuffer.push(t);
        if(this.enableBuffer){
            if(!this.callTask){
                this.callTask = new Ext.util.DelayedTask(this.combineAndSend, this);
            }
            this.callTask.delay(Ext.isNumber(this.enableBuffer) ? this.enableBuffer : 10);
        }else{
            this.combineAndSend();
        }
    },

    doCall : function(c, m, args){
        var data = null, hs = args[m.len], scope = args[m.len+1];

        if(m.len !== 0){
            data = args.slice(0, m.len);
        }

        var t = new Ext.Direct.Transaction({
            provider: this,
            args: args,
            action: c,
            method: m.name,
            data: data,
            cb: scope && Ext.isFunction(hs) ? hs.createDelegate(scope) : hs
        });

        if(this.fireEvent('beforecall', this, t) !== false){
            Ext.Direct.addTransaction(t);
            this.queueTransaction(t);
            this.fireEvent('call', this, t);
        }
    },

    doForm : function(c, m, form, callback, scope){
        var t = new Ext.Direct.Transaction({
            provider: this,
            action: c,
            method: m.name,
            args:[form, callback, scope],
            cb: scope && Ext.isFunction(callback) ? callback.createDelegate(scope) : callback,
            isForm: true
        });

        if(this.fireEvent('beforecall', this, t) !== false){
            Ext.Direct.addTransaction(t);
            var isUpload = String(form.getAttribute("enctype")).toLowerCase() == 'multipart/form-data',
                params = {
                    extTID: t.tid,
                    extAction: c,
                    extMethod: m.name,
                    extType: 'rpc',
                    extUpload: String(isUpload)
                };
            
            // change made from typeof callback check to callback.params
            // to support addl param passing in DirectSubmit EAC 6/2
            Ext.apply(t, {
                form: Ext.getDom(form),
                isUpload: isUpload,
                params: callback && Ext.isObject(callback.params) ? Ext.apply(params, callback.params) : params
            });
            this.fireEvent('call', this, t);
            this.processForm(t);
        }
    },
    
    processForm: function(t){
        Ext.Ajax.request({
            url: this.url,
            params: t.params,
            callback: this.onData,
            scope: this,
            form: t.form,
            isUpload: t.isUpload,
            ts: t
        });
    },

    createMethod : function(c, m){
        var f;
        if(!m.formHandler){
            f = function(){
                this.doCall(c, m, Array.prototype.slice.call(arguments, 0));
            }.createDelegate(this);
        }else{
            f = function(form, callback, scope){
                this.doForm(c, m, form, callback, scope);
            }.createDelegate(this);
        }
        f.directCfg = {
            action: c,
            method: m
        };
        return f;
    },

    getTransaction: function(opt){
        return opt && opt.tid ? Ext.Direct.getTransaction(opt.tid) : null;
    },

    doCallback: function(t, e){
        var fn = e.status ? 'success' : 'failure';
        if(t && t.cb){
            var hs = t.cb,
                result = Ext.isDefined(e.result) ? e.result : e.data;
            if(Ext.isFunction(hs)){
                hs(result, e);
            } else{
                Ext.callback(hs[fn], hs.scope, [result, e]);
                Ext.callback(hs.callback, hs.scope, [result, e]);
            }
        }
    }
});
Ext.Direct.PROVIDERS['remoting'] = Ext.direct.RemotingProvider;