/**
 * @author Ed Spencer
 * @class Ext.Interaction
 * @extends Ext.util.Observable
 * @ignore
 * 
 * <p>Represents a single interaction performed by a controller/action pair</p>
 * @constructor
 * @param {Object} config Options object containing at least a controller/action pair
 */
Ext.Interaction = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {String} controller The controller to dispatch to
     */
    controller: '',
    
    /**
     * @cfg {String} action The controller action to invoke
     */
    action: '',
    
    /**
     * @cfg {Array} args Any arguments to pass to the action
     */
    
    /**
     * @cfg {Object} scope Optional scope to execute the controller action in
     */
    
    /**
     * True if this Interaction has already been dispatched
     * @property dispatched
     * @type Boolean
     */
    dispatched: false,
    
    constructor: function(config) {
        Ext.Interaction.superclass.constructor.apply(this, arguments);
        
        config = config || {};
              
        Ext.applyIf(config, {
            scope: this
        });
        
        Ext.apply(this, config);
        
        if (typeof this.controller == 'string') {
            this.controller = Ext.ControllerManager.get(this.controller);
        }
    }
});