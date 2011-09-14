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
 * @class Ext.data.Model
 * @extends Ext.util.Stateful
 * 
 * <p>
 * Model模型就是一些归你程序所管理的对象。例如，为用户、产品、汽车……等等其他现实世界中的食物，只要您认为可以加入到系统的，都可被认为模型。
 * 你可以向{@link Ext.ModelMgr model manager}登记一个模型对象。
 * 模型是抽象的，其实体数据就是{@link Ext.data.Store stores}所携带的数据，用于Ext组件的通用数据绑定。
 * <br />
 * A Model represents some object that your application manages. 
 * For example, one might define a Model for Users, Products,
 * Cars, or any other real-world object that we want to model in the system. 
 * Models are registered via the {@link Ext.ModelMgr model manager},
 * and are used by {@link Ext.data.Store stores}, 
 * which are in turn used by many of the data-bound components in Ext.</p>
 * 
 * <p>
 * 虽然说模型是抽象的，但是模型中总得包含一些内容吧？模型中有什么呢？API规定，模型由一系列的字段、相关的方法/属性组成。例如：
 * <br />
 * Models are defined as a set of fields and any arbitrary methods and properties relevant to the model. For example:</p>
 * 
<pre><code>
Ext.regModel('User', {
    fields: [
        {name: 'name',  type: 'string'},
        {name: 'age',   type: 'int'},
        {name: 'phone', type: 'string'},
        {name: 'alive', type: 'boolean', defaultValue: true}
    ],

    changeName: function() {
        var oldName = this.get('name'),
            newName = oldName + " The Barbarian";

        this.set('name', newName);
    }
});
</code></pre>
* 
* <p>
* 字段所构成的数组会经过{@link Ext.ModelMgr ModelMgr}自动转化为{@link Ext.util.MixedCollection MixedCollection}的结构，而所有的函数和属性就会被指向Model的原型prototype。
* <br />
* The fields array is turned into a {@link Ext.util.MixedCollection MixedCollection} automatically 
* by the {@link Ext.ModelMgr ModelMgr}, and all
* other functions and properties are copied to the new Model's prototype.</p>
* 
* <p>
* 现在我们测试一下，创建用户的模型，调用其方法：
*  <br />
* Now we can create instances of our User model and call any model logic we defined:</p>
* 
<pre><code>
var user = Ext.ModelMgr.create({
    name : 'Conan',
    age  : 24,
    phone: '555-555-5555'
}, 'User');

user.changeName();
user.get('name'); //returns "Conan The Barbarian"
</code></pre>
 * 
 * <p><u>数据验证 Validations</u></p>
 * 
 * <p>
 * 通过{@link Ext.data.validations}验证器，Model内部可实现数据验证功能（请参阅{@link Ext.data.validations 了解更多地验证器函数}），而且在模型身上加入验证器是非常简单的。
 * <br />
 * Models have built-in support for validations, which are executed against the validator functions in 
 * {@link Ext.data.validations} ({@link Ext.data.validations see all validation functions}). Validations are easy to add to models:</p>
 * 
<pre><code>
Ext.regModel('User', {
    fields: [
        {name: 'name',     type: 'string'},
        {name: 'age',      type: 'int'},
        {name: 'phone',    type: 'string'},
        {name: 'gender',   type: 'string'},
        {name: 'username', type: 'string'},
        {name: 'alive',    type: 'boolean', defaultValue: true}
    ],

    validations: [
        {type: 'presence',  field: 'age'},
        {type: 'length',    field: 'name',     min: 2},
        {type: 'inclusion', field: 'gender',   list: ['Male', 'Female']},
        {type: 'exclusion', field: 'username', list: ['Admin', 'Operator']},
        {type: 'format',    field: 'username', matcher: /([a-z]+)[0-9]{2,3}/}
    ]
});
</code></pre>
 * 
 * <p>
 * 只需要调用{@link #validate}函数就可进入验证的程序，该程序返回一个{@link Ext.data.Errors}对象。
 * The validations can be run by simply calling the {@link #validate} function, which returns a {@link Ext.data.Errors}
 * object:</p>
 * 
<pre><code>
var instance = Ext.ModelMgr.create({
    name: 'Ed',
    gender: 'Male',
    username: 'edspencer'
}, 'User');

var errors = instance.validate();
</code></pre>
 * 
 * <p><u>关联 Associations</u></p>
 *  
 * <p>
 * 除了加入业务的方法外，还可以通过{@link Ext.data.BelongsToAssociation belongsTo}方法和{@link Ext.data.HasManyAssociation hasMany}方法建立模型之间的关系。
 * 例如，假设一个博客的管理程序，有用户Users、贴子Posts和评论Comments业务对象。我们可以用以下语法表达它们之间的关系：
 * <br />
 * Models can have associations with other Models via {@link Ext.data.BelongsToAssociation belongsTo} and 
 * {@link Ext.data.HasManyAssociation hasMany} associations. For example, let's say we're writing a blog administration
 * application which deals with Users, Posts and Comments. We can express the relationships between these models like this:</p>
 * 
<pre><code>
Ext.regModel('Post', {
    fields: ['id', 'user_id'],

    belongsTo: 'User',
    hasMany  : {model: 'Comment', name: 'comments'}
});

Ext.regModel('Comment', {
    fields: ['id', 'user_id', 'post_id'],

    belongsTo: 'Post'
});

Ext.regModel('User', {
    fields: ['id'],

    hasMany: [
        'Post',
        {model: 'Comment', name: 'comments'}
    ]
});
</code></pre>
 * 
 * <p>
 * 参阅{@link Ext.data.BelongsToAssociation}和{@link Ext.data.HasManyAssociation}了解更多关联的用法和配置。请注意也可以这样关联：
 * See the docs for {@link Ext.data.BelongsToAssociation} and {@link Ext.data.HasManyAssociation} for details on the usage
 * and configuration of associations. Note that associations can also be specified like this:</p>
 * 
<pre><code>
Ext.regModel('User', {
    fields: ['id'],

    associations: [
        {type: 'hasMany', model: 'Post',    name: 'posts'},
        {type: 'hasMany', model: 'Comment', name: 'comments'}
    ]
});
</code></pre>
 * 
 * @constructor
 * @param {Object} data 模型字段所涉及的相关信息，和字段Value。An object containing keys corresponding to this model's fields, and their associated values
 * @param {Number} id 可选的，分配到模型实例的ID。Optional unique ID to assign to this model instance
 */
Ext.data.Model = Ext.extend(Ext.util.Stateful, {
    evented: false,
    isModel: true,
    
    /**
     * <tt>true</tt> when the record does not yet exist in a server-side database (see
     * {@link #markDirty}).  Any record which has a real database pk set as its id property
     * is NOT a phantom -- it's real.
     * @property phantom
     * @type {Boolean}
     */
    phantom : false,
    
    /**
     * 说明那一个字段才是模型的id。（默认为“id”）。The name of the field treated as this Model's unique id (defaults to 'id').
     * @property idProperty
     * @type String
     */
    idProperty: 'id',
    
    /**
     * 默认模型的通讯代理，默认为“ajax”。
     * The string type of the default Model Proxy. Defaults to 'ajax'
     * @property defaultProxyType
     * @type String
     */
    defaultProxyType: 'ajax',
    
    constructor: function(data, id) {
        data = data || {};
        
        if (this.evented) {
            this.addEvents(
                
            );
        }
        
        /**
         * 内部用的模型实例id，用于在没有提供id情况下的识别。
         * An internal unique ID for each Model instance, used to identify Models that don't have an ID yet
         * @property internalId
         * @type String
         * @private
         */
        this.internalId = (id || id === 0) ? id : Ext.data.Model.id(this);
        
        Ext.data.Model.superclass.constructor.apply(this);
        
        //如果有默认内容，加入。add default field values if present
        var fields = this.fields.items,
            length = fields.length,
            field, name, i;
        
        for (i = 0; i < length; i++) {
            field = fields[i];
            name  = field.name;
            
            if (data[name] == undefined) {
                data[name] = field.defaultValue;
            }
        }
        
        this.set(data);
        
        if (this.getId()) {
            this.phantom = false;
        }
        
        if (typeof this.init == 'function') {
            this.init();
        }
    },
    
    /**
     * 根据所配置的{@link #validations}进行当前数据验证，并返回一个{@link Ext.data.Errors Errors}对象。
     * Validates the current data against all of its configured {@link #validations} and returns an 
     * {@link Ext.data.Errors Errors} object
     * @return {Ext.data.Errors} The errors object
     */
    validate: function() {
        var errors      = new Ext.data.Errors(),
            validations = this.validations,
            validators  = Ext.data.validations,
            length, validation, field, valid, type, i;

        if (validations) {
            length = validations.length;
            
            for (i = 0; i < length; i++) {
                validation = validations[i];
                field = validation.field;
                type  = validation.type;
                valid = validators[type](validation, this.get(field));
                
                if (!valid) {
                    errors.add({
                        field  : field,
                        message: validation.message || validators[type + 'Message']
                    });
                }
            }
        }
        
        return errors;
    },
    
    /**
     * 返回该模型的Proxy。
     * Returns the configured Proxy for this Model
     * @return {Ext.data.Proxy} The proxy
     */
    getProxy: function() {
        return this.constructor.proxy;
    },
    
    /**
     * 根据已配置的proxy保存一个模型实例。
     * Saves the model instance using the configured proxy
     * @param {Object} options 传入到proxy的配置项。Options to pass to the proxy
     * @return {Ext.data.Model} 模型实例。The Model instance
     */
    save: function(options) {
        var action = this.phantom ? 'create' : 'update';
        
        options = options || {};
        
        Ext.apply(options, {
            records: [this],
            action : action
        });
        
        var operation  = new Ext.data.Operation(options),
            successCb  = options.success,
            failureCb  = options.failure,
            callbackFn = options.callback,
            scope      = options.scope,
            record;
        
        var callback = function(operation) {
            record = operation.getRecords()[0];
            
            if (operation.wasSuccessful()) {
                record.dirty = false;

                if (typeof successCb == 'function') {
                    successCb.call(scope, record, operation);
                }
            } else {
                if (typeof failureCb == 'function') {
                    failureCb.call(scope, record, operation);
                }
            }
            
            if (typeof callbackFn == 'function') {
                callbackFn.call(scope, record, operation);
            }
        };
        
        this.getProxy()[action](operation, callback, this);
        
        return this;
    },
    
    /**
     * 
     * Returns the unique ID allocated to this model instance as defined by {@link #idProperty}
     * @return {Number} The id
     */
    getId: function() {
        return this.get(this.idProperty);
    },
    
    /**
     * Sets the model instance's id field to the given id
     * @param {Number} id The new id
     */
    setId: function(id) {
        this.set(this.idProperty, id);
    },
    
    /**
     * Tells this model instance that it has been added to a store
     * @param {Ext.data.Store} store The store that the model has been added to
     */
    join : function(store) {
        /**
         * The {@link Ext.data.Store} to which this Record belongs.
         * @property store
         * @type {Ext.data.Store}
         */
        this.store = store;
    },
    
    /**
     * Tells this model instance that it has been removed from the store
     * @param {Ext.data.Store} store The store to unjoin
     */
    unjoin: function(store) {
        delete this.store;
    },
    
    /**
     * @private
     * If this Model instance has been {@link #join joined} to a {@link Ext.data.Store store}, the store's
     * afterEdit method is called
     */
    afterEdit : function() {
        this.callStore('afterEdit');
    },
    
    /**
     * @private
     * If this Model instance has been {@link #join joined} to a {@link Ext.data.Store store}, the store's
     * afterReject method is called
     */
    afterReject : function() {
        this.callStore("afterReject");
    },
    
    /**
     * @private
     * If this Model instance has been {@link #join joined} to a {@link Ext.data.Store store}, the store's
     * afterCommit method is called
     */
    afterCommit: function() {
        this.callStore('afterCommit');
    },
    
    /**
     * @private
     * Helper function used by afterEdit, afterReject and afterCommit. Calls the given method on the 
     * {@link Ext.data.Store store} that this instance has {@link #join joined}, if any. The store function
     * will always be called with the model instance as its single argument.
     * @param {String} fn The function to call on the store
     */
    callStore: function(fn) {
        var store = this.store;
        
        if (store != undefined && typeof store[fn] == "function") {
            store[fn](this);
        }
    }
});

Ext.apply(Ext.data.Model, {
    /**
     * 设置该模型所用的Proxy对象。输入的对象必须符合{@link Ext.data.ProxyMgr#create}的参数要求。
     * Sets the Proxy to use for this model. Accepts any options that can be accepted by {@link Ext.data.ProxyMgr#create}
     * @param {String/Object/Ext.data.Proxy} proxy The proxy
     */
    setProxy: function(proxy) {
        //make sure we have an Ext.data.Proxy object
        proxy = Ext.data.ProxyMgr.create(proxy);
        
        proxy.setModel(this);
        this.proxy = proxy;
        
        return proxy;
    },
    
    /**
     * 通过id指定一个model，进行异步加载。用法如下：
     * Asynchronously loads a model instance by id. Sample usage:
<pre><code>
MyApp.User = Ext.regModel('User', {
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'}
    ]
});

MyApp.User.load(10, {
    scope: this,
    failure: function(record, operation) {
        //do something if the load failed
    },
    success: function(record, operation) {
        //do something if the load succeeded
    },
    callback: function(record, operation) {
        //do something whether the load succeeded or failed
    }
});
</code></pre>
     * @param {Number} id 加载模型的id。The id of the model to load
     * @param {Object} config 包含success、failure、callback和作用域的配置项对象。Optional config object containing success, failure and callback functions, plus optional scope
     */
    load: function(id, config) {
        config = Ext.applyIf(config || {}, {
            action: 'read',
            id    : id
        });
        
        var operation  = new Ext.data.Operation(config),
            callbackFn = config.callback,
            successCb  = config.success,
            failureCb  = config.failure,
            scope      = config.scope,
            record, callback;
        
        callback = function(operation) {
            record = operation.getRecords()[0];
            
            if (operation.wasSuccessful()) {
                if (typeof successCb == 'function') {
                    successCb.call(scope, record, operation);
                }
            } else {
                if (typeof failureCb == 'function') {
                    failureCb.call(scope, record, operation);
                }
            }
            
            if (typeof callbackFn == 'function') {
                callbackFn.call(scope, record, operation);
            }
        };
        
        this.proxy.read(operation, callback, this);
    }
});

/**
 * Generates a sequential id. This method is typically called when a record is {@link #create}d
 * and {@link #Record no id has been specified}. The returned id takes the form:
 * <tt>&#123;PREFIX}-&#123;AUTO_ID}</tt>.<div class="mdetail-params"><ul>
 * <li><b><tt>PREFIX</tt></b> : String<p class="sub-desc"><tt>Ext.data.Model.PREFIX</tt>
 * (defaults to <tt>'ext-record'</tt>)</p></li>
 * <li><b><tt>AUTO_ID</tt></b> : String<p class="sub-desc"><tt>Ext.data.Model.AUTO_ID</tt>
 * (defaults to <tt>1</tt> initially)</p></li>
 * </ul></div>
 * @param {Record} rec The record being created.  The record does not exist, it's a {@link #phantom}.
 * @return {String} auto-generated string id, <tt>"ext-record-i++'</tt>;
 */
Ext.data.Model.id = function(rec) {
    rec.phantom = true;
    return [Ext.data.Model.PREFIX, '-', Ext.data.Model.AUTO_ID++].join('');
};


//[deprecated 5.0]
Ext.ns('Ext.data.Record');

//Backwards compat
Ext.data.Record.id = Ext.data.Model.id;
//[end]

Ext.data.Model.PREFIX = 'ext-record';
Ext.data.Model.AUTO_ID = 1;
Ext.data.Model.EDIT = 'edit';
Ext.data.Model.REJECT = 'reject';
Ext.data.Model.COMMIT = 'commit';
