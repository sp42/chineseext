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
 * @class Ext.Direct
 * @extends Ext.util.Observable
 * <p><b><u>概述 Overview</u></b></p>
 * <p>
 * Ext.Direct的目的在于提供一个无缝的通讯流（streamline）介乎于客户端和服务端之间，形成一种单一的接口，从而使得我们减少一些乏味的编码，例如数据的验证和出来返回的数据包（读数据、错误条件等等）。<br />
 * Ext.Direct aims to streamline communication between the client and server
 * by providing a single interface that reduces the amount of common code
 * typically required to validate data and handle returned data packets
 * (reading data, error conditions, etc).</p>
 *  
 * <p>
 * Ext.direct命名空间下有若干的类是为了与服务端更密切地整合。Ext.Direct的一些方法产生出来的数据经过Ext.data另外的一些类，就可以转给Ext.data.Stores处理。<br />
 * The Ext.direct namespace includes several classes for a closer integration
 * with the server-side. The Ext.data namespace also includes classes for working
 * with Ext.data.Stores which are backed by data from an Ext.Direct method.</p>
 * 
 * <p><b><u>规范文件 Specification</u></b></p>
 * 
 * <p>For additional information consult the 
 * <a href="http://extjs.com/products/extjs/direct.php">Ext.Direct Specification</a>.</p>
 *   
 * <p><b><u>供应器 Providers</u></b></p>
 * 
 * <p>
 * Ext.Direct的架构属于“供应器（provider）”的架构，一个或多个的供应器负责将数据传输到服务器上。当前有几种关键的供应器：<br />
 * Ext.Direct uses a provider architecture, where one or more providers are
 * used to transport data to and from the server. There are several providers
 * that exist in the core at the moment:</p><div class="mdetail-params"><ul>
 * 
 * <li>{@link Ext.direct.JsonProvider JsonProvider} for simple JSON operations 简易的JSON操作</li>
 * <li>{@link Ext.direct.PollingProvider PollingProvider} for repeated requests 重复的请求</li>
 * <li>{@link Ext.direct.RemotingProvider RemotingProvider} exposes server side
 * on the client.向客户端暴露了服务端</li>
 * </ul></div>
 * 
 * <p>供应器本身不能直接的使用，应该通过{@link Ext.Direct}.{@link Ext.Direct#add add}加入。<br />
 * A provider does not need to be invoked directly, providers are added via
 * {@link Ext.Direct}.{@link Ext.Direct#add add}.</p>
 * 
 * <p><b><u>路由器 Router</u></b></p>
 * 
 * <p>
 * 在客户端与服务端部分方法之间，Ext.Direct使用了服务端“路由器（router）”的概念来直接请求。
 * 由于Ext.Direct是真正平台无关性的，所以你完全可以在以Java为解决方案的服务端，立刻替换成为C#的服务端，过程中你不需要对JavaScript作任何的变动或修改。
 * <br />
 * Ext.Direct utilizes a "router" on the server to direct requests from the client
 * to the appropriate server-side method. Because the Ext.Direct API is completely
 * platform-agnostic, you could completely swap out a Java based server solution
 * and replace it with one that uses C# without changing the client side JavaScript
 * at all.</p>
 * 
 * <p><b><u>服务端事件。Server side events</u></b></p>
 * 
 * <p>
 * 由服务器通知而来的事件，可以添加一个事件侦听器来应接并触发：<br />
 * Custom events from the server may be handled by the client by adding
 * listeners, for example:</p>
 * <pre><code>
{"type":"event","name":"message","data":"Successfully polled at: 11:19:30 am"}

// 对应服务端“message”的事件的处理函数。add a handler for a 'message' event sent by the server 
Ext.Direct.on('message', function(e){
    out.append(String.format('&lt;p>&lt;i>{0}&lt;/i>&lt;/p>', e.data));
            out.el.scrollTo('t', 100000, true);
});
 * </code></pre>
 * @singleton
 */
Ext.Direct = Ext.extend(Ext.util.Observable, {
    /**
     * 每个事件类型实现一个getData()方法。缺省的事件类型是：<br />
     * Each event type implements a getData() method. The default event types are:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>event</tt></b> : Ext.Direct.Event</li>
     * <li><b><tt>exception</tt></b> : Ext.Direct.ExceptionEvent</li>
     * <li><b><tt>rpc</tt></b> : Ext.Direct.RemotingEvent</li>
     * </ul></div>
     * @property eventTypes
     * @type Object
     */

    /**
     * 对于可能出现的异常的四种类型有：<br />
     * Four types of possible exceptions which can occur:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>Ext.Direct.exceptions.TRANSPORT</tt></b> : 'xhr'</li>
     * <li><b><tt>Ext.Direct.exceptions.PARSE</tt></b> : 'parse'</li>
     * <li><b><tt>Ext.Direct.exceptions.LOGIN</tt></b> : 'login'</li>
     * <li><b><tt>Ext.Direct.exceptions.SERVER</tt></b> : 'exception'</li>
     * </ul></div>
     * @property exceptions
     * @type Object
     */
    exceptions: {
        TRANSPORT: 'xhr',
        PARSE: 'parse',
        LOGIN: 'login',
        SERVER: 'exception'
    },
    
    // private
    constructor: function(){
        this.addEvents(
            /**
             * @event event
             * 一个事件之后触发。
             * Fires after an event.
             * @param {event} e The {@link Ext.Direct#eventTypes Ext.Direct.Event type} that occurred.
             * @param {Ext.direct.Provider} provider The {@link Ext.direct.Provider Provider}.
             */
            'event',
            /**
             * @event exception
             * 一个异常事件之后触发。
             * Fires after an event exception.
             * @param {event} e The {@link Ext.Direct#eventTypes Ext.Direct.Event type} that occurred.
             */
            'exception'
        );
        this.transactions = {};
        this.providers = {};
    },

    /**
     * 加入一个Ext.Direct供应器并创建代理，或者对服务端执行的方法进行一个快照。
     * 如果供应器还没有链接，那么就会自动链接。下面的例子创建了两个provider。<br />
     * Adds an Ext.Direct Provider and creates the proxy or stub methods to execute server-side methods.
     * If the provider is not already connected, it will auto-connect.
     * <pre><code>
var pollProv = new Ext.direct.PollingProvider({
    url: 'php/poll2.php'
}); 

Ext.Direct.addProvider(
    {
        "type":"remoting",       // create a {@link Ext.direct.RemotingProvider} 
        "url":"php\/router.php", // url to connect to the Ext.Direct server-side router.
        "actions":{              // each property within the actions object represents a Class 
            "TestAction":[       // array of methods within each server side Class   
            {
                "name":"doEcho", // name of method
                "len":1
            },{
                "name":"multiply",
                "len":1
            },{
                "name":"doForm",
                "formHandler":true, // handle form on server with Ext.Direct.Transaction 
                "len":1
            }]
        },
        "namespace":"myApplication",// namespace to create the Remoting Provider in
    },{
        type: 'polling', // create a {@link Ext.direct.PollingProvider} 
        url:  'php/poll.php'
    },
    pollProv // reference to previously created instance
);
     * </code></pre>
     * @param {Object/Array} provider 供应器，可以多个一起传入。每个供应器告诉了 Ext.Direct如何创建客户端快照的方法。
     * Accepts either an Array of Provider descriptions (an instance
     * or config object for a Provider) or any number of Provider descriptions as arguments.  Each
     * Provider description instructs Ext.Direct how to create client-side stub methods.
     */
    addProvider : function(provider){        
        var a = arguments;
        if(a.length > 1){
            for(var i = 0, len = a.length; i < len; i++){
                this.addProvider(a[i]);
            }
            return;
        }
        
        // if provider has not already been instantiated
        if(!provider.events){
            provider = new Ext.Direct.PROVIDERS[provider.type](provider);
        }
        provider.id = provider.id || Ext.id();
        this.providers[provider.id] = provider;

        provider.on('data', this.onProviderData, this);
        provider.on('exception', this.onProviderException, this);


        if(!provider.isConnected()){
            provider.connect();
        }

        return provider;
    },

    /**
     * 通过{@link #addProvider 已经加入}的{@link Ext.direct.Provider 供应器}，可以指定一个<b><tt>{@link Ext.direct.Provider#id id}</tt></b>执行该方法返回。
     * <br />
     * Retrieve a {@link Ext.direct.Provider provider} by the
     * <b><tt>{@link Ext.direct.Provider#id id}</tt></b> specified when the provider is
     * {@link #addProvider added}.
     * @param {String} id 执行{@link #addProvider}的时候，都会分配一个ID表示供应器。Unique identifier assigned to the provider when calling {@link #addProvider} 
     */
    getProvider : function(id){
        return this.providers[id];
    },

    removeProvider : function(id){
        var provider = id.id ? id : this.providers[id.id];
        provider.un('data', this.onProviderData, this);
        provider.un('exception', this.onProviderException, this);
        delete this.providers[provider.id];
        return provider;
    },

    addTransaction: function(t){
        this.transactions[t.tid] = t;
        return t;
    },

    removeTransaction: function(t){
        delete this.transactions[t.tid || t];
        return t;
    },

    getTransaction: function(tid){
        return this.transactions[tid.tid || tid];
    },

    onProviderData : function(provider, e){
        if(Ext.isArray(e)){
            for(var i = 0, len = e.length; i < len; i++){
                this.onProviderData(provider, e[i]);
            }
            return;
        }
        if(e.name && e.name != 'event' && e.name != 'exception'){
            this.fireEvent(e.name, e);
        }else if(e.type == 'exception'){
            this.fireEvent('exception', e);
        }
        this.fireEvent('event', e, provider);
    },

    createEvent : function(response, extraProps){
        return new Ext.Direct.eventTypes[response.type](Ext.apply(response, extraProps));
    }
});
// overwrite impl. with static instance
Ext.Direct = new Ext.Direct();

Ext.Direct.TID = 1;
Ext.Direct.PROVIDERS = {};