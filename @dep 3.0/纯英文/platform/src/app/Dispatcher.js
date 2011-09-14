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
             * Fires before an interaction is dispatched. Return false from any listen to cancel the dispatch
             * @param {Ext.Interaction} interaction The Interaction about to be dispatched
             */
            'before-dispatch',
            
            /**
             * @event dispatch
             * Fired once an Interaction has been dispatched
             * @param {Ext.Interaction} interaction The Interaction that was just dispatched
             */
            'dispatch'
        );
        
        Ext.util.Dispatcher.superclass.constructor.call(this, config);
    },
    
    /**
     * Dispatches a single interaction to a controller/action pair
     * @param {Object} options Options representing at least the controller and action to dispatch to
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
     * Convenience method which returns a function that calls Ext.Dispatcher.redirect. Useful when setting
     * up several listeners that should redirect, e.g.:
<pre><code>
myComponent.on({
    homeTap : Ext.Dispatcher.createRedirect('home'),
    inboxTap: Ext.Dispatcher.createRedirect('inbox'),
});
</code></pre>
     * @param {String/Object} url The url to create the redirect function for
     * @return {Function} The redirect function
     */
    createRedirect: function(url) {
        return function() {
            Ext.Dispatcher.redirect(url);
        };
    }
});

Ext.Dispatcher = new Ext.util.Dispatcher();

Ext.dispatch = function() {
    return Ext.Dispatcher.dispatch.apply(Ext.Dispatcher, arguments);
};

Ext.redirect = function() {
    return Ext.Dispatcher.redirect.apply(Ext.Dispatcher, arguments);
};

Ext.createRedirect = Ext.Dispatcher.createRedirect;