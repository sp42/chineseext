/*
 * @version Sencha 0.98
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
 * @class Ext.data.Association
 * @extends Object
 * 
 * <p>
 * 定义关联的基类。一般情况不会直接使用到这个类，而是使用其子类{@link Ext.data.HasManyAssociation}和{@link Ext.data.BelongsToAssociation}。
 * <br />
 * Base Association class. Not to be used directly as it simply supports its subclasses
 * {@link Ext.data.HasManyAssociation} and {@link Ext.data.BelongsToAssociation}.</p>
 * 
 * @constructor
 * @param {Object} config 配置项对象。Optional config object
 */
Ext.data.Association = Ext.extend(Object, {
    /**
     * @cfg {String} ownerModel 拥有关联的模型其名称，字符串，必须的。The string name of the model that owns the association. Required
     */
    
    /**
     * @cfg {String} associatedModel 被关联的模型名称，字符串，必须的。The string name of the model that is being associated with. Required
     */
    
    /**
     * @cfg {String} primaryKey 关联模型的外键名称。默认为'id'。The name of the primary key on the associated model. Defaults to 'id'
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