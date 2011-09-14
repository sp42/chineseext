/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.direct.PollingProvider
 * @extends Ext.direct.JsonProvider
 *
 * <p>
 * 按一定的{@link #interval 周期}不断轮询服务端。最开始的数据由客户端发出，然后由服务端响应。<br />
 * Provides for repetitive polling of the server at distinct {@link #interval intervals}.
 * The initial request for data originates from the client, and then is responded to by the
 * server.</p>
 * 
 * <p>
 * 应该由运行在服务端其余部分的Ext.Direct包来生成PollingProvider的所有配置内容。<br />
 * All configurations for the PollingProvider should be generated by the server-side
 * API portion of the Ext.Direct stack.</p>
 *
 * <p>
 * 创建一个PollingProvider实例可以通过new关键字实现，或者只是指定<tt>type = 'polling'</tt>就可以，例如：<br />
 * An instance of PollingProvider may be created directly via the new keyword or by simply
 * specifying <tt>type = 'polling'</tt>.  For example:</p>
 * <pre><code>
var pollA = new Ext.direct.PollingProvider({
    type:'polling',
    url: 'php/pollA.php',
});
Ext.Direct.addProvider(pollA);
pollA.disconnect();

Ext.Direct.addProvider(
    {
        type:'polling',
        url: 'php/pollB.php',
        id: 'pollB-provider'
    }
);
var pollB = Ext.Direct.getProvider('pollB-provider');
 * </code></pre>
 */
Ext.direct.PollingProvider = Ext.extend(Ext.direct.JsonProvider, {
    /**
     * @cfg {Number} priority
     * 请求的优先级（默认是<tt>3</tt>）。请参阅{@link Ext.direct.Provider#priority}。
     * Priority of the request (defaults to <tt>3</tt>). See {@link Ext.direct.Provider#priority}.
     */
    // override default priority
    priority: 3,
    
    /**
     * @cfg {Number} interval
     * 隔多久的时候轮询服务端，单位是毫秒（默认是<tt>3000</tt>，三秒钟）
     * How often to poll the server-side in milliseconds (defaults to <tt>3000</tt> - every
     * 3 seconds).
     */
    interval: 3000,

    /**
     * @cfg {Object} baseParams 每一次轮询所发出的请求当中所包含的参数对象。An object containing properties which are to be sent as parameters
     * on every polling request
     */
    
    /**
     * @cfg {String/Function} url
     * 每次请求PollingProvider连接url的地址。这配置项也可以是一个Ext.Direct方法，参数就是baseParams这一个。The url which the PollingProvider should contact with each request. This can also be
     * an imported Ext.Direct method which will accept the baseParams as its only argument.
     */

    // private
    constructor : function(config){
        Ext.direct.PollingProvider.superclass.constructor.call(this, config);
        this.addEvents(
            /**
             * @event beforepoll
             * 在轮询发生之前的时候触发，过程中任一次返回false都会中止整个轮询。
             * Fired immediately before a poll takes place, an event handler can return false
             * in order to cancel the poll.
             * @param {Ext.direct.PollingProvider} pObj PollingProvider对象
             */
            'beforepoll',            
            /**
             * @event poll
             * This event has not yet been implemented.
             * @param {Ext.direct.PollingProvider} pObj PollingProvider对象
             */
            'poll'
        );
    },

    // inherited
    isConnected: function(){
        return !!this.pollTask;
    },

    /**
     * 连接到服务器并开始轮询的进程。要处理每一次的响应内容就要订阅数据data事件。
     * Connect to the server-side and begin the polling process. To handle each
     * response subscribe to the data event.
     */
    connect: function(){
        if(this.url && !this.pollTask){
            this.pollTask = Ext.TaskMgr.start({
                run: function(){
                    if(this.fireEvent('beforepoll', this) !== false){
                        if(typeof this.url == 'function'){
                            this.url(this.baseParams);
                        }else{
                            Ext.Ajax.request({
                                url: this.url,
                                callback: this.onData,
                                scope: this,
                                params: this.baseParams
                            });
                        }
                    }
                },
                interval: this.interval,
                scope: this
            });
            this.fireEvent('connect', this);
        }else if(!this.url){
            throw 'Error initializing PollingProvider, no url configured.';
        }
    },

    /**
     * 停止轮询的进程并与服务器断开。断开成功后会触发disconnect事件。
     * Disconnect from the server-side and stop the polling process. The disconnect
     * event will be fired on a successful disconnect.
     */
    disconnect: function(){
        if(this.pollTask){
            Ext.TaskMgr.stop(this.pollTask);
            delete this.pollTask;
            this.fireEvent('disconnect', this);
        }
    },

    // private
    onData: function(opt, success, xhr){
        if(success){
            var events = this.getEvents(xhr);
            for(var i = 0, len = events.length; i < len; i++){
                var e = events[i];
                this.fireEvent('data', this, e);
            }
        }else{
            var e = new Ext.Direct.ExceptionEvent({
                data: e,
                code: Ext.Direct.exceptions.TRANSPORT,
                message: 'Unable to connect to the server.',
                xhr: xhr
            });
            this.fireEvent('data', this, e);
        }
    }
});

Ext.Direct.PROVIDERS['polling'] = Ext.direct.PollingProvider;