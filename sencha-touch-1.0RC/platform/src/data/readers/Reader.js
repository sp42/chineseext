/*
 * @version Sencha 1.0.1
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
 * @class Ext.data.Reader
 * @extends Object
 * 
 <p>Readers are used to interpret data to be loaded into a {@link Ext.data.Model Model} instance or a {@link Ext.data.Store Store}
 * - usually in response to an AJAX request. This is normally handled transparently by passing some configuration to either the 
 * {@link Ext.data.Model Model} or the {@link Ext.data.Store Store} in question - see their documentation for further details.</p>
    <p>Reader负责解析加载到Model或Store的数据，通常值的是AJAX请求完毕后的那些数据。要告诉Reader类怎么工作，实际就是在配置Model或Sotre的时候说明清楚Reader该怎么做。参阅它们的文档或者更好。 </p>
 * 
 * <p><u>加载内嵌数据Loading Nested Data</u></p>
 * 
 * <p>Reader可以按照 Ext.data.Association 
        为每个model所设定的规则读取复杂多层的数据。如下一个例子充分说明了怎么在一个财务CRM中灵活地透析模型与数据之间操作。首先时定义一些模型： Readers have the ability to automatically load deeply-nested data objects based on the {@link Ext.data.Association associations}
 * configured on each Model. Below is an example demonstrating the flexibility of these associations in a fictional CRM system which
 * manages a User, their Orders, OrderItems and Products. First we'll define the models:
 * 
<pre><code>
Ext.regModel("User", {
    fields: [
        'id', 'name'
    ],

    hasMany: {model: 'Order', name: 'orders'},

    proxy: {
        type: 'rest',
        url : 'users.json',
        reader: {
            type: 'json',
            root: 'users'
        }
    }
});

Ext.regModel("Order", {
    fields: [
        'id', 'total'
    ],

    hasMany  : {model: 'OrderItem', name: 'orderItems', associationKey: 'order_items'},
    belongsTo: 'User'
});

Ext.regModel("OrderItem", {
    fields: [
        'id', 'price', 'quantity', 'order_id', 'product_id'
    ],

    belongsTo: ['Order', {model: 'Product', associationKey: 'product'}]
});

Ext.regModel("Product", {
    fields: [
        'id', 'name'
    ],

    hasMany: 'OrderItem'
});
</code></pre>
 * 
 * <p>看上去工作量不少，我们只需要知道，用户有许多张订单，其中每张订单有不同的货物组成。它们的实体数据演示如下：This may be a lot to take in - basically a User has many Orders, each of which is composed of several OrderItems. Finally,
 * each OrderItem has a single Product. This allows us to consume data like this:</p>
 * 
<pre><code>
{
    "users": [
        {
            "id": 123,
            "name": "Ed",
            "orders": [
                {
                    "id": 50,
                    "total": 100,
                    "order_items": [
                        {
                            "id"      : 20,
                            "price"   : 40,
                            "quantity": 2,
                            "product" : {
                                "id": 1000,
                                "name": "MacBook Pro"
                            }
                        },
                        {
                            "id"      : 21,
                            "price"   : 20,
                            "quantity": 3,
                            "product" : {
                                "id": 1001,
                                "name": "iPhone"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
</code></pre>
 * 
 * <p>返回的JSON层数很多，包括有全部用户（出于演示目的暂且一个）以及用户下面的全部订单（演示一个）以及每张订单里面具体有什么货品（演示两个），最后就是Product关联与OrderItem。于是，我们可以这样地读取和使用数据： The JSON response is deeply nested - it returns all Users (in this case just 1 for simplicity's sake), all of the Orders
 * for each User (again just 1 in this case), all of the OrderItems for each Order (2 order items in this case), and finally
 * the Product associated with each OrderItem. Now we can read the data and use it as follows:
 * 
<pre><code>
var store = new Ext.data.Store({
    model: "User"
});

store.load({
    callback: function() {
        //得到的用户 the user that was loaded
        var user = store.first();

        console.log("Orders for " + user.get('name') + ":")

        //列出用户的订单 iterate over the Orders for each User
        user.orders().each(function(order) {
            console.log("Order ID: " + order.getId() + ", which contains items:");

            //列出每张订单的货物 iterate over the OrderItems for each Order
            order.orderItems().each(function(orderItem) {
                // 货品数据已经有了，因此我们可以getProduct同步数据。一般而言我们用异步的版本（请参阅{@link Ext.data.BelongsToAssociation}） 
                // we know that the Product data is already loaded, so we can use the synchronous getProduct
                //usually, we would use the asynchronous version (see {@link Ext.data.BelongsToAssociation})
                var product = orderItem.getProduct();

                console.log(orderItem.get('quantity') + ' orders of ' + product.get('name'));
            });
        });
    }
});
</code></pre>
 * 
 * <p>运行上述代码的结果会如下： Running the code above results in the following:</p>
 * 
<pre><code>
Orders for Ed:
Order ID: 50, which contains items:
2 orders of MacBook Pro
3 orders of iPhone
</code></pre>
 * 
 * @constructor
 * @param {Object} config Optional config object
 */
Ext.data.Reader = Ext.extend(Object, {
    /**
     * @cfg {String} idProperty 在行对象中说明记录独一无二值的名称。默认是<tt>id</tt>。Name of the property within a row object
     * that contains a record identifier value.  Defaults to <tt>id</tt>
     */
    idProperty: 'id',

    /**
     * @cfg {String} totalProperty 决定数据集合中哪一个属性是可以获取记录总算的名称。
     * 如果一次性地获取所有数据到这里的话，不需要这个值；但在分页远程服务器数据的时候，就需要明确总数是几多。
     * 默认是<tt>total</tt>。
     * Name of the property from which to
     * retrieve the total number of records in the dataset. This is only needed
     * if the whole dataset is not passed in one go, but is being paged from
     * the remote server.  Defaults to <tt>total</tt>.
     */
    totalProperty: 'total',

    /**
     * @cfg {String} successProperty 决定哪一个属性是获取“成功”的属性。
     * 默认是<tt>success</tt>。请参阅{@link Ext.data.DataProxy}.{@link Ext.data.DataProxy#exception exception}了解更多。
     * Name of the property from which to
     * retrieve the success attribute. Defaults to <tt>success</tt>.  See
     * {@link Ext.data.DataProxy}.{@link Ext.data.DataProxy#exception exception}
     * for additional information.
     */
    successProperty: 'success',

    /**
     * @cfg {String} root <b>必须指定的属性。</b>
     * 包含行对象的那个属性。默认是<tt>undefined</tt>。这是必须指定的属性，若为undefined，就会抛出一个异常。
     * 这是属性所对应的数据包应该是一个空的数组，用来清除数据或者显示数据。
     * <b>Required</b>.  The name of the property
     * which contains the Array of row objects.  Defaults to <tt>undefined</tt>.
     * An exception will be thrown if the root property is undefined. The data
     * packet value for this property should be an empty array to clear the data
     * or show no data.
     */
    root: '',
    
    /**
     * @cfg {Boolean} implicitIncludes True表示为遇到响应中的模型如果有内嵌其他模型的话，也一同解析。参阅Ext.data.Reader的完整解释。默认为true。True to automatically parse models nested within other models in a response
     * object. See the Ext.data.Reader intro docs for full explanation. Defaults to true.
     */
    implicitIncludes: true,

    constructor: function(config) {
        Ext.apply(this, config || {});

        this.model = Ext.ModelMgr.getModel(config.model);
        if (this.model) {
            this.buildExtractors();
        }
    },

    /**
     * 为Reader设置一个新的模型。
     * Sets a new model for the reader.
     * @private
     * @param {Object} model 新模型。The model to set.
     * @param {Boolean} setOnProxy True表示为也为Proxy设置新的模型。True to also set on the Proxy, if one is configured
     */
    setModel: function(model, setOnProxy) {
        this.model = Ext.ModelMgr.getModel(model);
        this.buildExtractors(true);
        
        if (setOnProxy && this.proxy) {
            this.proxy.setModel(this.model, true);
        }
    },

    /**
     * 读取指定的响应对象。这个方法会常规化可以传入到响应对象其不同的类型，在{@link readRecords}函数读取解析记录之前。
     * Reads the given response object. This method normalizes the different types of response object that may be passed
     * to it, before handing off the reading of records to the {@link readRecords} function.
     * @param {Object} response 响应对象。既可以是XMLHttpRequest对象，也可以是一个普通的JS对象。The response object. This may be either an XMLHttpRequest object or a plain JS object
     * @return {Ext.data.ResultSet} 以解析的ResultSet对象。The parsed ResultSet object
     */
    read: function(response) {
        var data = response;

        if (response.responseText) {
            data = this.getResponseData(response);
        }

        return this.readRecords(data);
    },

    /**
     * 由Reader的所有子类来使用的抽象功能函数。每个子类的方法应该先执行这个父类的方法然后才执行自己的逻辑，最后返回Ext.data.ResultSet实例。对于大多数子类而言，不需要添加额外的处理过程。
     * Abstracts common functionality used by all Reader subclasses. Each subclass is expected to call
     * this function before running its own logic and returning the Ext.data.ResultSet instance. For most
     * Readers additional processing should not be needed.
     * @param {Mixed} data 原始数据对象。The raw data object
     * @return {Ext.data.ResultSet} 一个ResultSet对象。A ResultSet object
     */
    readRecords: function(data) {
        /**
         * 最后送入到readRecords的原始数据对象。如果打后仍需要的话，可以先存储。
         * The raw data object that was last passed to readRecords. Stored for further processing if needed
         * @property rawData
         * @type Mixed
         */
        this.rawData = data;

        data = this.getData(data);

        var root    = this.getRoot(data),
            total   = root.length,
            success = true,
            value, records, recordCount;

        if (this.totalProperty) {
            value = parseInt(this.getTotal(data), 10);
            if (!isNaN(value)) {
                total = value;
            }
        }

        if (this.successProperty) {
            value = this.getSuccess(data);
            if (value === false || value === 'false') {
                success = false;
            }
        }

        records = this.extractData(root, true);
        recordCount = records.length;

        return new Ext.data.ResultSet({
            total  : total || recordCount,
            count  : recordCount,
            records: records,
            success: success
        });
    },

    /**
     * 返回已展开，类型转换的行数据。
     * Returns extracted, type-cast rows of data.  Iterates to call #extractValues for each row
     * @param {Object[]/Object} data-root from server response
     * @param {Boolean} returnRecords [false] Set true to return instances of Ext.data.Record
     * @private
     */
    extractData : function(root, returnRecords) {
        var values  = [],
            records = [],
            Model   = this.model,
            length  = root.length,
            idProp  = this.idProperty,
            node, id, record, i;

        for (i = 0; i < length; i++) {
            node   = root[i];
            values = this.extractValues(node);
            id     = this.getId(node);

            if (returnRecords === true) {
                record = new Model(values, id);
                record.raw = node;
                records.push(record);
                
                if (this.implicitIncludes) {
                    this.readAssociated(record, node);
                }
            } else {
                values[idProp] = id;
                records.push(values);
            }
        }

        return records;
    },
    
    /**
     * @private
     * 加载数据对象的记录关联。这会预取hasMany和belongTo关系。
     * Loads a record's associations from the data object. This prepopulates hasMany and belongsTo associations
     * on the record provided.
     * @param {Ext.data.Model} record The record to load associations for
     * @param {Mixed} data 数据对象。The data object
     * @return {String} 返回值得描述。Return value description
     */
    readAssociated: function(record, data) {
        var associations = record.associations.items,
            length       = associations.length,
            association, associationName, associatedModel, associationData, inverseAssociation, proxy, reader, store, i;
        
        for (i = 0; i < length; i++) {
            association     = associations[i];
            associationName = association.name;
            associationData = this.getAssociatedDataRoot(data, association.associationKey || associationName);
            associatedModel = association.associatedModel;
            
            if (associationData) {
                proxy = associatedModel.proxy;
                
                // if the associated model has a Reader already, use that, otherwise attempt to create a sensible one
                if (proxy) {
                    reader = proxy.getReader();
                } else {
                    reader = new this.constructor({
                        model: association.associatedName
                    });
                }
                
                if (association.type == 'hasMany') {
                    store = record[associationName]();
                    
                    store.add.apply(store, reader.read(associationData).records);
                    
                    //now that we've added the related records to the hasMany association, set the inverse belongsTo
                    //association on each of them if it exists
                    inverseAssociation = associatedModel.prototype.associations.findBy(function(assoc) {
                        return assoc.type == 'belongsTo' && assoc.associatedName == record.constructor.modelName;
                    });
                    
                    //if the inverse association was found, set it now on each record we've just created
                    if (inverseAssociation) {
                        store.data.each(function(associatedRecord) {
                            associatedRecord[inverseAssociation.instanceName] = record;
                        });                        
                    }

                } else if (association.type == 'belongsTo') {
                    record[association.instanceName] = reader.read([associationData]).records[0];
                }
            }
        }
    },
    
    /**
     * @private
     * 只对XML Reader适用。
     * Used internally by {@link #readAssociated}. Given a data object (which could be json, xml etc) for a specific
     * record, this should return the relevant part of that data for the given association name. This is only really
     * needed to support the XML Reader, which has to do a query to get the associated data object
     * @param {Mixed} data 原始数据对象。The raw data object
     * @param {String} associationName 关联名称。The name of the association to get data for (uses associationKey if present)
     * @return {Mixed} 根。The root
     */
    getAssociatedDataRoot: function(data, associationName) {
        return data[associationName];
    },

    /**
     * @private
     * 根据模型实例的数据，迭代模型的字段和构建每个字段的值。
     * Given an object representing a single model instance's data, iterates over the model's fields and
     * builds an object with the value for each field.
     * @param {Object} data 要转换的数据对象。The data object to convert
     * @return {Object} 适合模型构造器所用的模型。Data object suitable for use with a model constructor
     */
    extractValues: function(data) {
        var fields = this.model.prototype.fields.items,
            length = fields.length,
            output = {},
            field, value, i;

        for (i = 0; i < length; i++) {
            field = fields[i];
            value = this.extractorFunctions[i](data) || field.defaultValue;

            output[field.name] = value;
        }

        return output;
    },

    /**
     * @private
     * 默认下这个函数送入什么就返回什么，这需要由一个子类来实现的方法。参阅XmlReader就是一个例子。
     * By default this function just returns what is passed to it. It can be overridden in a subclass
     * to return something else. See XmlReader for an example.
     * @param {Object} data 数据对象。The data object
     * @return {Object} 常规化数据对象。The normalized data object
     */
    getData: function(data) {
        return data;
    },

    /**
     * @private
     * 这需要由一个子类来实现的方法。该方法返回的对象就是供Reader的“root”元数据配置项。参阅XmlReader的getRoot实现就是一个例子。默认下这个函数送入什么就返回什么。
     * This will usually need to be implemented in a subclass. Given a generic data object (the type depends on the type
     * of data we are reading), this function should return the object as configured by the Reader's 'root' meta data config.
     * See XmlReader's getRoot implementation for an example. By default the same data object will simply be returned.
     * @param {Mixed} data The data object
     * @return {Mixed} The same data object
     */
    getRoot: function(data) {
        return data;
    },

    /**
     * 把原始数据对象（即送入到this.read的）并返回有用的数据判断。必须由每个子类来实现这个方法。
     * Takes a raw response object (as passed to this.read) and returns the useful data segment of it. This must be implemented by each subclass
     * @param {Object} response 响应对象。 The responce object
     * @return {Object} 来自响应有用的数据。 The useful data from the response
     */
    getResponseData: function(response) {
        throw new Error("getResponseData must be implemented in the Ext.data.Reader subclass");
    },

    /**
     * @private
     * 对绑定到该Reader的元数据重新配置。
     * Reconfigures the meta data tied to this Reader
     */
    onMetaChange : function(meta) {
        var fields = meta.fields,
            newModel;
        
        Ext.apply(this, meta);
        
        if (fields) {
            newModel = Ext.regModel("JsonReader-Model" + Ext.id(), {fields: fields});
            this.setModel(newModel, true);
        } else {
            this.buildExtractors(true);
        }
    },

    /**
     * @private
     * 为获取记录数据和元数据构建优化的函数。子类的话可以不用实现其自身的getRoot函数。
     * This builds optimized functions for retrieving record data and meta data from an object.
     * Subclasses may need to implement their own getRoot function.
     * @param {Boolean} force True表示为先自动移除现有的extractor函数（默认为false）。True to automatically remove existing extractor functions first (defaults to false)
     */
    buildExtractors: function(force) {
        if (force === true) {
            delete this.extractorFunctions;
        }
        
        if (this.extractorFunctions) {
            return;
        }

        var idProp      = this.id || this.idProperty,
            totalProp   = this.totalProperty,
            successProp = this.successProperty,
            messageProp = this.messageProperty;

        //build the extractors for all the meta data
        if (totalProp) {
            this.getTotal = this.createAccessor(totalProp);
        }

        if (successProp) {
            this.getSuccess = this.createAccessor(successProp);
        }

        if (messageProp) {
            this.getMessage = this.createAccessor(messageProp);
        }

        if (idProp) {
            var accessor = this.createAccessor(idProp);

            this.getId = function(record) {
                var id = accessor(record);

                return (id == undefined || id == '') ? null : id;
            };
        } else {
            this.getId = function() {
                return null;
            };
        }
        this.buildFieldExtractors();
    },

    /**
     * @private
     */
    buildFieldExtractors: function() {
        //now build the extractors for all the fields
        var fields = this.model.prototype.fields.items,
            ln = fields.length,
            i  = 0,
            extractorFunctions = [],
            field, map;

        for (; i < ln; i++) {
            field = fields[i];
            map   = (field.mapping !== undefined && field.mapping !== null) ? field.mapping : field.name;

            extractorFunctions.push(this.createAccessor(map));
        }

        this.extractorFunctions = extractorFunctions;
    }
});