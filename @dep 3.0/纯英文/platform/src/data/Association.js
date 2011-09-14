/**
 * @author Ed Spencer
 * @class Ext.data.Association
 * @extends Object
 * 
 * <p>Base Association class. Not to be used directly as it simply supports its subclasses
 * {@link Ext.data.HasManyAssociation} and {@link Ext.data.BelongsToAssociation}.</p>
 * 
 * @constructor
 * @param {Object} config Optional config object
 */
Ext.data.Association = Ext.extend(Object, {
    /**
     * @cfg {String} ownerModel The string name of the model that owns the association. Required
     */
    
    /**
     * @cfg {String} associatedModel The string name of the model that is being associated with. Required
     */
    
    /**
     * @cfg {String} primaryKey The name of the primary key on the associated model. Defaults to 'id'
     */
    primaryKey: 'id',
    
    constructor: function(config) {
        Ext.apply(this, config);
        
        var types           = Ext.ModelMgr.types,
            ownerName       = config.ownerModel,
            associatedName  = config.associatedModel,
            ownerModel      = types[ownerName],
            associatedModel = types[associatedName],
            ownerProto;
        
        if (ownerModel == undefined) {
            throw("The configured ownerModel was not valid (you tried " + ownerName + ")");
        }
        
        if (associatedModel == undefined) {
            throw("The configured associatedModel was not valid (you tried " + associatedName + ")");
        }
        
        this.ownerModel = ownerModel;
        this.associatedModel = associatedModel;
        
        Ext.applyIf(this, {
            ownerName : ownerName,
            associatedName: associatedName
        });
    }
});