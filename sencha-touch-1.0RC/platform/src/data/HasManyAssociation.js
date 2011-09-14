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
 * @class Ext.data.HasManyAssociation
 * @extends Ext.data.Association
 * 
 * <p>表示一对多的关系模型。一般使用model声明来指定：Represents a one-to-many relationship between two models. Usually created indirectly via a model definition:</p>
 * 
<pre><code>
Ext.regModel('Product', {
    fields: [
        {name: 'id',      type: 'int'},
        {name: 'user_id', type: 'int'},
        {name: 'name',    type: 'string'}
    ]
});

Ext.regModel('User', {
    fields: [
        {name: 'id',   type: 'int'},
        {name: 'name', type: 'string'}
    ],

    associations: [
        {type: 'hasMany', model: 'Product', name: 'products'}
    ]
});
</pre></code>
* 
 * <p>以上我们创建了Products和model模型，我们可以说用户有许多商品。
 * 每一个User实例都有一个新的函数，此时此刻具体这个函数就是“product”，这正是我们在name配置项中所指定的名字。
 * Above we created Product and User models, and linked them by saying that a User hasMany Products. This gives
 * us a new function on every User instance, in this case the function is called 'products' because that is the name
 * we specified in the association configuration above.</p>
 * 
 * <p>
 * 新的函数返回一个特殊的Ext.data.Store，自动根据模型实例建立产品。
 * This new function returns a specialized {@link Ext.data.Store Store} which is automatically filtered to load
 * only Products for the given model instance:</p>
 * 
<pre><code>
// 首先，为user创建一笔新的纪录1。first, we load up a User with id of 1
var user = Ext.ModelMgr.create({id: 1, name: 'Ed'}, 'User');

// 根据既定的关系，创建user.products方法，该方法返回Store对象。the user.products function was created automatically by the association and returns a {@link Ext.data.Store Store}
// 创建的Store的作用域自动定义为User的id等于1的产品。the created store is automatically scoped to the set of Products for the User with id of 1
var products = user.products();

// products是一个普通的Store，可以加入轻松地通过add()纪录we still have all of the usual Store functions, for example it's easy to add a Product for this User
products.add({
    name: 'Another Product'
});

// 执行Store的保存命令。保存之前都自动哦你将产品的user_id为1。saves the changes to the store - this automatically sets the new Product's user_id to 1 before saving
products.sync();
</code></pre>
 * 
 * <p>所述的Store只在头一次执行product()时实例化，持久化在内存中不会反复创建。The new Store is only instantiated the first time you call products() to conserve memory and processing time,
 * though calling products() a second time returns the same store instance.</p>
 * 
 * <p><u>Custom filtering</u></p>
 * 
 * <p>由于Store的API中自带filter过滤器的功能，所以默认下过滤器告诉Store只返回关联模型其外键所匹配主模型其主键。例如，用户User是ID=100拥有的产品Products，那么过滤器只会返回那些符合user_id=100的产品。The Store is automatically furnished with a filter - by default this filter tells the store to only return
 * records where the associated model's foreign key matches the owner model's primary key. For example, if a User
 * with ID = 100 hasMany Products, the filter loads only Products with user_id == 100.</p>
 * 
 * <p>
 * 但是有些时间必须指定任意字段来过滤，例如Twitter搜索的应用程序，我们就需要Search和Tweet模型：
 * Sometimes we want to filter by another field - for example in the case of a Twitter search application we may
 * have models for Search and Tweet:</p>
 * 
<pre><code>
var Search = Ext.regModel('Search', {
    fields: [
        'id', 'query'
    ],

    hasMany: {
        model: 'Tweet',
        name : 'tweets',
        filterProperty: 'query'
    }
});

Ext.regModel('Tweet', {
    fields: [
        'id', 'text', 'from_user'
    ]
});

// 返回filterProperty指定的过程字段。returns a Store filtered by the filterProperty
var store = new Search({query: 'Sencha Touch'}).tweets();
</code></pre>
 * 
 * <p>例子中的tweets关系等价于下面，也就是通过Ext.data.HasManyAssociation.filterProperty定义过滤器。The tweets association above is filtered by the query property by setting the {@link #filterProperty}, and is
 * equivalent to this:</p>
 * 
<pre><code>
var store = new Ext.data.Store({
    model: 'Tweet',
    filters: [
        {
            property: 'query',
            value   : 'Sencha Touch'
        }
    ]
});
</code></pre>
 */
Ext.data.HasManyAssociation = Ext.extend(Ext.data.Association, {
    /**
     * @cfg {String} foreignKey The name of the foreign key on the associated model that links it to the owner
     * model. Defaults to the lowercased name of the owner model plus "_id", e.g. an association with a where a
     * model called Group hasMany Users would create 'group_id' as the foreign key.
     */
    
    /**
     * @cfg {String} name 创建主模型函数的名称，必须的。The name of the function to create on the owner model. Required
     */

    /**
     * @cfg {Object} storeConfig （可选的）传入到生成那个Store的配置项对象。默认是undefined.Optional configuration object that will be passed to the generated Store. Defaults to 
     * undefined.
     */
    
    /**
     * @cfg {String} filterProperty Optionally overrides the default filter that is set up on the associated Store. If
     * this is not set, a filter is automatically created which filters the association based on the configured 
     * {@link #foreignKey}. See intro docs for more details. Defaults to undefined
     */
    
    constructor: function(config) {
        Ext.data.HasManyAssociation.superclass.constructor.apply(this, arguments);
        
        var ownerProto = this.ownerModel.prototype,
            name       = this.name;
        
        Ext.applyIf(this, {
            storeName : name + "Store",
            foreignKey: this.ownerName.toLowerCase() + "_id"
        });
        
        ownerProto[name] = this.createStore();
    },
    
    /**
     * @private
     * Creates a function that returns an Ext.data.Store which is configured to load a set of data filtered
     * by the owner model's primary key - e.g. in a hasMany association where Group hasMany Users, this function
     * returns a Store configured to return the filtered set of a single Group's Users.
     * @return {Function} The store-generating function
     */
    createStore: function() {
        var associatedModel = this.associatedModel,
            storeName       = this.storeName,
            foreignKey      = this.foreignKey,
            primaryKey      = this.primaryKey,
            filterProperty  = this.filterProperty,
            storeConfig     = this.storeConfig || {};
        
        return function() {
            var me = this,
                config, filter,
                modelDefaults = {};
                
            if (me[storeName] == undefined) {
                if (filterProperty) {
                    filter = {
                        property  : filterProperty,
                        value     : me.get(filterProperty),
                        exactMatch: true
                    };
                } else {
                    filter = {
                        property  : foreignKey,
                        value     : me.get(primaryKey),
                        exactMatch: true
                    };
                }
                
                modelDefaults[foreignKey] = me.get(primaryKey);
                
                config = Ext.apply({}, storeConfig, {
                    model        : associatedModel,
                    filters      : [filter],
                    remoteFilter : false,
                    modelDefaults: modelDefaults
                });
                
                me[storeName] = new Ext.data.Store(config);
            }
            
            return me[storeName];
        };
    }
});