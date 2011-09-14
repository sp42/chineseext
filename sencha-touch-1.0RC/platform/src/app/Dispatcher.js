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
 * @class Ext.util.Dispatcher
 * @extends Ext.util.Observable
 * @ignore
 * 
 * @constructor
 */
Ext.util.Dispatcher = Ext.extend(Ext.util.Observable, {
    
    constructor: function(config) {
        this.addEvents(
            /**
             * @event before-dispatch
             * 当调度交互之前触发该事件。返回false表示取消调度。
             * Fires before an interaction is dispatched. Return false from any listen to cancel the dispatch
             * @param {Ext.Interaction} interaction 要被调度的交互对象。The Interaction about to be dispatched
             */
            'before-dispatch',
            
            /**
             * @event dispatch
             * 当已经调度交互后触发该事件。
             * Fired once an Interaction has been dispatched
             * @param {Ext.Interaction} interaction 刚才被调度的交互对象。The Interaction that was just dispatched
             */
            'dispatch'
        );
        
        Ext.util.Dispatcher.superclass.constructor.call(this, config);
    },
    
    /**
     * 调度一个独立的交互对象到控制器、 动作结对。
     * Dispatches a single interaction to a controller/action pair
     * @param {Object} options 至少包含一個控制器、动作结对的配置项对象。Options representing at least the controller and action to dispatch to
     */
    dispatch: function(options) {
        var interaction = new Ext.Interaction(options),
            controller  = interaction.controller,
            action      = interaction.action,
            History     = Ext.History;
        
        if (this.fireEvent('before-dispatch', interaction) !== false) {
            if (History && options.historyUrl) {
                History.suspendEvents(false);
                History.add(options.historyUrl);
                Ext.defer(History.resumeEvents, 100, History);
            }
            
            if (controller && action) {
                controller[action].call(controller, interaction);
                interaction.dispatched = true;
            }
            
            this.fireEvent('dispatch', interaction);
        }
    },
    
    /**
     * 调度到控制器、 动作结对，加入新的url到历史记录。
     * Dispatches to a controller/action pair, adding a new url to the History stack
     */
    redirect: function(options) {
        if (options instanceof Ext.data.Model) {
            //compose a route for the model
            
        } else if (typeof options == 'string') {
            //use router
            var route = Ext.Router.recognize(options);
            
            if (route) {
                return this.dispatch(route);
            }
        }
        return null;
    },
    
    /**
     * 快捷方法，返回一个调用Ext.Dirspatcher.redirect的函数。当设置几个转移的侦听器时有用。例如： 
     * Convenience method which returns a function that calls Ext.Dispatcher.redirect. Useful when setting
     * up several listeners that should redirect, e.g.:
<pre><code>
myComponent.on({
    homeTap : Ext.Dispatcher.createRedirect('home'),
    inboxTap: Ext.Dispatcher.createRedirect('inbox'),
});
</code></pre>
     * @param {String/Object} url 创建跳转函数的url。The url to create the redirect function for
     * @return {Function} 跳转函数。The redirect function
     */
    createRedirect: function(url) {
        return function() {
            Ext.Dispatcher.redirect(url);
        };
    }
});

Ext.Dispatcher = new Ext.util.Dispatcher();
//译注：此处是不是很绕啊？呵呵——不過話說囘來這裡真是必須的。
Ext.dispatch = function() {
    return Ext.Dispatcher.dispatch.apply(Ext.Dispatcher, arguments);
};

Ext.redirect = function() {
    return Ext.Dispatcher.redirect.apply(Ext.Dispatcher, arguments);
};

Ext.createRedirect = Ext.Dispatcher.createRedirect;