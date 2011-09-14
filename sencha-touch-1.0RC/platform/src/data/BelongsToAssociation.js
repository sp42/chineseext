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
 * @class Ext.data.BelongsToAssociation
 * @extends Ext.data.Association
 * 
 * <p>Ext.data.Association表示一对一的关系模型。主模型（owner model）应该有一个外键（a foreign key）的设置，也就是与之关联模型的主键（the primary key）。
 * <br />
 * Represents a one to one association with another model. The owner model is expected to have
 * a foreign key which references the primary key of the associated model:</p>
 * 
<pre><code>
var Category = Ext.regModel('Category', {
    fields: [
        {name: 'id',   type: 'int'},
        {name: 'name', type: 'string'}
    ]
});

var Product = Ext.regModel('Product', {
    fields: [
        {name: 'id',          type: 'int'},
        {name: 'category_id', type: 'int'},
        {name: 'name',        type: 'string'}
    ],

    associations: [
        {type: 'belongsTo', model: 'Category'}
    ]
});
</code></pre>
 * <p>上面例子中我们分别创建了Products和Cattegory模型，然后将它们关联起来，此过程我们可以说产品Product是“属于”种类Category的。
 * 默认情况下，Product有一个category_id的字段，通过该字段，每个Product实体可以与Category关联在一起，并在Product模型身上产生新的函数：
 * <br />
 * In the example above we have created models for Products and Categories, and linked them together
 * by saying that each Product belongs to a Category. This automatically links each Product to a Category
 * based on the Product's category_id, and provides new functions on the Product model:</p>
 * 
 * <p><u>通过反射得出getter函数Generated getter function</u></p>
 * 
 * <p>第一个加入到主模型的函数是Getter函数。The first function that is added to the owner model is a getter function:</p>
 * 
<pre><code>
var product = new Product({
    id: 100,
    category_id: 20,
    name: 'Sneakers'
});

product.getCategory(function(category, operation) {
    //这里可以根据cateory对象来完成一些任务。do something with the category object
    alert(category.get('id')); //alerts 20
}, this);
</code></pre>
* 
 * <p>
 * 在定义关联关系的时候，就为Product模型创建了getCategory函数。
 * 另外一种getCategory函数的用法是送入一个包含success、failure和callback的对象，都是函数类型。
 * 其中，必然一定会调用callback，而success就是成功加载所关联的模型后，才会调用的success的函数；反之没有加载关联模型，就执行failure函数。
 * <br />
 * The getCategory function was created on the Product model when we defined the association. This uses the
 * Category's configured {@link Ext.data.Proxy proxy} to load the Category asynchronously, calling the provided
 * callback when it has loaded. The new getCategory function will also accept an object containing success, 
 * failure and callback properties - callback will always be called, success will only be called if the associated
 * model was loaded successfully and failure will only be called if the associatied model could not be loaded:</p>
 * 
<pre><code>
product.getCategory({
    callback: function(category, operation), //一定会调用的函数。a function that will always be called
    success : function(category, operation), //成功时调用的函数。a function that will only be called if the load succeeded
    failure : function(category, operation), //失败时调用的函数。a function that will only be called if the load did not succeed
    scope   : this // 作用域对象是一个可选的参数，其决定了回调函数中的作用域。optionally pass in a scope object to execute the callbacks in
});
</code></pre>
 * 
 * <p>以上的回调函数执行时带有两个参数：1、所关联的模型之实例；2、负责加载模型实例的{@link Ext.data.Operation operation}对象。当加载实例有问题时，Operation对象就非常有用。 
 * <br />
 * In each case above the callbacks are called with two arguments - the associated model instance and the 
 * {@link Ext.data.Operation operation} object that was executed to load that instance. The Operation object is
 * useful when the instance could not be loaded.</p>
 * 
 * <p><u>Generated setter function</u></p>
 * 
 * <p>
 * 第二个生成的函数设置了关联的模型实例。如果只传入一个参数到setter那么下面的两个调用是一致的：
 * The second generated function sets the associated model instance - if only a single argument is passed to
 * the setter then the following two calls are identical:</p>
 * 
<pre><code>
// this call
product.setCategory(10);

//is equivalent to this call:
product.set('category_id', 10);
</code></pre>
 * <p>如果传入第二个参数，那么模型会自动保存并且将第二个参数传入到主模型的{@link Ext.data.Model#save save}方法：If we pass in a second argument, the model will be automatically saved and the second argument passed to
 * the owner model's {@link Ext.data.Model#save save} method:</p>
<pre><code>
product.setCategory(10, function(product, operation) {
    //商品已经保持了。the product has been saved
    alert(product.get('category_id')); //now alerts 10
});

//另外一种语法： alternative syntax:
product.setCategory(10, {
    callback: function(product, operation), //一定会调用的函数。a function that will always be called
    success : function(product, operation), //成功时调用的函数。a function that will only be called if the load succeeded
    failure : function(product, operation), //失败时调用的函数。a function that will only be called if the load did not succeed
    scope   : this //作用域对象是一个可选的参数，其决定了回调函数中的作用域。optionally pass in a scope object to execute the callbacks in
})
</code></pre>
* 
 * <p><u>自定义 Customisation</u></p>
 * 
 * <p>若不设置，关联模型的时候会自动根据{@link #primaryKey}和{@link #foreignKey}属性设置。可制定的值有：Associations reflect on the models they are linking to automatically set up properties such as the
 * {@link #primaryKey} and {@link #foreignKey}. These can alternatively be specified:</p>
 * 
<pre><code>
var Product = Ext.regModel('Product', {
    fields: [...],

    associations: [
        {type: 'belongsTo', model: 'Category', primaryKey: 'unique_id', foreignKey: 'cat_id'}
    ]
});
 </code></pre>
 * 
 * <p>这里我们替换掉了默认的主键（默认为'id'）和外键（默认为'category_id'）。一般情况却是不需要的。和Here we replaced the default primary key (defaults to 'id') and foreign key (calculated as 'category_id')
 * with our own settings. Usually this will not be needed.</p>
 */
Ext.data.BelongsToAssociation = Ext.extend(Ext.data.Association, {
    /**
     * @cfg {String} foreignKey The name of the foreign key on the owner model that links it to the associated
     * model. Defaults to the lowercased name of the associated model plus "_id", e.g. an association with a
     * model called Product would set up a product_id foreign key.
     */
    
    /**
     * @cfg {String} getterName The name of the getter function that will be added to the local model's prototype. 
     * Defaults to 'get' + the name of the foreign model, e.g. getCategory
     */

    /**
     * @cfg {String} setterName The name of the setter function that will be added to the local model's prototype.
     * Defaults to 'set' + the name of the foreign model, e.g. setCategory
     */
    
    constructor: function(config) {
        Ext.data.BelongsToAssociation.superclass.constructor.apply(this, arguments);
        
        var me             = this,
            ownerProto     = me.ownerModel.prototype,
            associatedName = me.associatedName,
            getterName     = me.getterName || 'get' + associatedName,
            setterName     = me.setterName || 'set' + associatedName;

        Ext.applyIf(me, {
            name      : associatedName,
            foreignKey: associatedName.toLowerCase() + "_id"
        });
        
        ownerProto[getterName] = me.createGetter();
        ownerProto[setterName] = me.createSetter();
    },
    
    /**
     * @private
     * Returns a setter function to be placed on the owner model's prototype
     * @return {Function} The setter function
     */
    createSetter: function() {
        var me              = this,
            ownerModel      = me.ownerModel,
            associatedModel = me.associatedModel,
            foreignKey      = me.foreignKey,
            primaryKey      = me.primaryKey;
        
        //'this' refers to the Model instance inside this function
        return function(value, options, scope) {
            this.set(foreignKey, value);
            
            if (typeof options == 'function') {
                options = {
                    callback: options,
                    scope: scope || this
                };
            }
            
            if (Ext.isObject(options)) {
                return this.save(options);
            }
        };
    },
    
    /**
     * @private
     * Returns a getter function to be placed on the owner model's prototype. We cache the loaded instance
     * the first time it is loaded so that subsequent calls to the getter always receive the same reference.
     * @return {Function} The getter function
     */
    createGetter: function() {
        var me              = this,
            ownerModel      = me.ownerModel,
            associatedName  = me.associatedName,
            associatedModel = me.associatedModel,
            foreignKey      = me.foreignKey,
            primaryKey      = me.primaryKey,
            instanceName    = me.name + 'BelongsToInstance';
        
        //'this' refers to the Model instance inside this function
        return function(options, scope) {
            options = options || {};
            
            var foreignKeyId = this.get(foreignKey),
                instance, callbackFn;
                
            if (this[instanceName] == undefined) {
                instance = Ext.ModelMgr.create({}, associatedName);
                instance.set(primaryKey, foreignKeyId);

                if (typeof options == 'function') {
                    options = {
                        callback: options,
                        scope: scope || this
                    };
                }
                
                associatedModel.load(foreignKeyId, options);
            } else {
                instance = this[instanceName];
                
                //TODO: We're duplicating the callback invokation code that the instance.load() call above
                //makes here - ought to be able to normalize this - perhaps by caching at the Model.load layer
                //instead of the association layer.
                if (typeof options == 'function') {
                    options.call(scope || this, instance);
                }
                
                if (options.success) {
                    options.success.call(scope || this, instance);
                }
                
                if (options.callback) {
                    options.callback.call(scope || this, instance);
                }
                
                return instance;
            }
        };
    }
});