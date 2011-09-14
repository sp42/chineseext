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
 * @class Ext.direct.Provider
 * @extends Ext.util.Observable
 * <p>Ext.direct.Provider是一个抽象类，用来扩展的。
 * Ext.direct.Provider is an abstract class meant to be extended.</p>
 * 
 * <p>例如ExtJS现在就实现了以下的子类了：
 * For example ExtJs implements the following subclasses:</p>
 * <pre><code>
Provider
|
+---{@link Ext.direct.JsonProvider JsonProvider} 
    |
    +---{@link Ext.direct.PollingProvider PollingProvider}   
    |
    +---{@link Ext.direct.RemotingProvider RemotingProvider}   
 * </code></pre>
 * @abstract
 */
Ext.direct.Provider = Ext.extend(Ext.util.Observable, {    
    /**
     * @cfg {String} id
     * 供应器的id（默认的由{@link Ext#id auto-assigned id}方法产生）。
     * 如果你没有用全局变量保存着这个供应器，那么你就应该分配一个id来记住这个供应器，以便日后寻找。例如：
     * The unique id of the provider (defaults to an {@link Ext#id auto-assigned id}).
     * You should assign an id if you need to be able to access the provider later and you do
     * not have an object reference available, for example:
     * <pre><code>
Ext.Direct.addProvider(
    {
        type: 'polling',
        url:  'php/poll.php',
        id:   'poll-provider'
    }
);
     
var p = {@link Ext.Direct Ext.Direct}.{@link Ext.Direct#getProvider getProvider}('poll-provider');
p.disconnect();
     * </code></pre>
     */
        
    /**
     * @cfg {Number} priority
     * 请求的优先权（priority）,数值愈低表示优先权愈高，<tt>0</tt>就表示“双工的”（总是打开）。
     * 所有的供应器默认为<tt>1</tt>，但PollingProvider就除外，默认为<tt>3</tt>。<br />
     * Priority of the request. Lower is higher priority, <tt>0</tt> means "duplex" (always on).
     * All Providers default to <tt>1</tt> except for PollingProvider which defaults to <tt>3</tt>.
     */    
    priority: 1,

    /**
     * @cfg {String} type
     * 这是{@link Ext.Direct Ext.Direct}的类型，这是<b>必须的</b>，默认是<tt>undefined</tt>。
     * 执行{@link Ext.Direct#addProvider addProvider}创建新的供应器的时候就会用到这个类型。
     * 默认可识别的类型如下规格：<br />
     * <b>Required</b>, <tt>undefined</tt> by default.  The <tt>type</tt> of provider specified
     * to {@link Ext.Direct Ext.Direct}.{@link Ext.Direct#addProvider addProvider} to create a
     * new Provider. Acceptable values by default are:<div class="mdetail-params"><ul>
     * <li><b><tt>polling</tt></b> : {@link Ext.direct.PollingProvider PollingProvider}</li>
     * <li><b><tt>remoting</tt></b> : {@link Ext.direct.RemotingProvider RemotingProvider}</li>
     * </ul></div>
     */    
 
    // private
    constructor : function(config){
        Ext.apply(this, config);
        this.addEvents(
            /**
             * @event connect
             * 当连接服务端之后触发。
             * Fires when the Provider connects to the server-side
             * @param {Ext.direct.Provider} provider The {@link Ext.direct.Provider Provider}.
             */            
            'connect',
            /**
             * @event disconnect
             * 当与服务端断开之后触发。
             * Fires when the Provider disconnects from the server-side
             * @param {Ext.direct.Provider} provider The {@link Ext.direct.Provider Provider}.
             */            
            'disconnect',
            /**
             * @event data
             * 当接收到来自服务端的数据的时候触发。
             * Fires when the Provider receives data from the server-side
             * @param {Ext.direct.Provider} provider The {@link Ext.direct.Provider Provider}.
             * @param {event} e The {@link Ext.Direct#eventTypes Ext.Direct.Event type} that occurred.
             */            
            'data',
            /**
             * @event exception
             * 当供应器接收一个服务端的异常后触发。
             * Fires when the Provider receives an exception from the server-side
             */                        
            'exception'
        );
        Ext.direct.Provider.superclass.constructor.call(this, config);
    },

    /**
     * 返回是否与服务端链接者的。由子类实现的抽象方法。
     * Returns whether or not the server-side is currently connected.
     * Abstract method for subclasses to implement.
     */
    isConnected: function(){
        return false;
    },

    /**
     * 由子类实现的抽象方法。
     * Abstract methods for subclasses to implement.
     */
    connect: Ext.emptyFn,
    
    /**
     * 由子类实现的抽象方法。
     * Abstract methods for subclasses to implement.
     */
    disconnect: Ext.emptyFn
});
