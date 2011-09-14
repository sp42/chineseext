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
 * @class Ext.data.AbstractStore
 * @extends Ext.util.Observable
 *
 * <p>
 * 抽象的Store负责和Proxy和Reader耦合，却没有任何的实体数据的存储representation。也就是说AbstractStore只是各对象之间耦合的一些共性内容，
 * 如真正的数据区域是根据不同组件而不同的，如一般Store就是Ext.util.MixedCollection，而Tree组件就是Ext.data.Tree。
 * AbstractStore which provides interactivity with proxies and readers but
 * does NOT rely on any internal data storage representation. Subclasses of
 * Store and TreeStore use the internal representation of Ext.util.MixedCollection
 * and Ext.data.Tree respectively.</p>
 * 
 */
Ext.data.AbstractStore = Ext.extend(Ext.util.Observable, {
    remoteSort  : false,
    remoteFilter: false,

    /**
     * @cfg {String/Ext.data.Proxy/Object} proxy Store的Proxy。该项可以是字符串、Proxy实例对象、配置项对象，参见{@link #setProxy}。The Proxy to use for this Store. This can be either a string, a config
     * object or a Proxy instance - see {@link #setProxy} for details.
     */

    /**
     * @cfg {Boolean/Object} autoLoad 如果有值传入，那么store的load会自动调用，发生在autoLoaded对象创建之后。
     * If data is not specified, and if autoLoad is true or an Object, this store's load method
     * is automatically called after creation. If the value of autoLoad is an Object, this Object will be passed to the store's
     * load method. Defaults to false.
     */
    autoLoad: false,

    /**
     * @cfg {Boolean} autoSave True表示为在每次编辑记录的时候，都自动同步Store及其Proxy。默认为false。True to automatically sync the Store with its Proxy after every edit to one of its Records.
     * Defaults to false.
     */
    autoSave: false,

    /**
     * 根据批处理的同步方案设置更新行为。默认指定的“operation”表示，每当批处理中的每一个操作完成好了之后；就会更新Store内部的数据内容；
     * 若指定'complete'则会等待到整个批处理结束了才会更新Store的数据内容。对于local storgae Proxy来说'complete'是好的选择，
     * 'operation'则适用于远程的Proxy，相对比较高延时。
     * Sets the updating behavior based on batch synchronization. 'operation' (the default) will update the Store's
     * internal representation of the data after each operation of the batch has completed, 'complete' will wait until
     * the entire batch has been completed before updating the Store's data. 'complete' is a good choice for local
     * storage proxies, 'operation' is better for remote proxies, where there is a comparatively high latency.
     * @property batchUpdateMode
     * @type String
     */
    batchUpdateMode: 'operation',

    /**
     * true表示为每当Store加载数据之后就进行数据过滤，在触发datachanged事件之前执行。
     * 默认为true，如{@link #remoteFilter}=true则忽略该项。
     * If true, any filters attached to this Store will be run after loading data, before the datachanged event is fired.
     * Defaults to true, ignored if {@link #remoteFilter} is true
     * @property filterOnLoad
     * @type Boolean
     */
    filterOnLoad: true,

    /**
     * true表示为每当Store加载数据之后就进行数据排序，在触发datachanged事件之前执行。
     * 默认为true，如{@link #remoteFilter}=true则忽略该项。
     * If true, any sorters attached to this Store will be run after loading data, before the datachanged event is fired.
     * Defaults to true, igored if {@link #remoteSort} is true
     * @property sortOnLoad
     * @type Boolean
     */
    sortOnLoad: true,

    /**
     * 默认的排序方法（默认是“ASC”）。The default sort direction to use if one is not specified (defaults to "ASC")
     * @property defaultSortDirection
     * @type String
     */
    defaultSortDirection: "ASC",

    /**
     * True表示为为Store隐式创建模型。只有Store构建器传入了字段信息才有用而不是模型其构建器或名称。
     * True if a model was created implicitly for this Store. This happens if a fields array is passed to the Store's constructor
     * instead of a model constructor or name.
     * @property implicitModel
     * @type Boolean
     * @private
     */
    implicitModel: false,

    /**
     * 默认的Proxy类型。默认为{@link Ext.data.MemoryProxy memory proxy}。
     * The string type of the Proxy to create if none is specified. This defaults to creating a {@link Ext.data.MemoryProxy memory proxy}.
     * @property defaultProxyType
     * @type String
     */
    defaultProxyType: 'memory',

    /**
     * True表示为Store已经透过{@link #destroyStore}摧毁了。如果true，Store的引用应该被删除。
     * True if the Store has already been destroyed via {@link #destroyStore}. If this is true, the reference to Store should be deleted
     * as it will not function correctly any more.
     * @property isDestroyed
     * @type Boolean
     */
    isDestroyed: false,

    isStore: true,

    /**
     * @cfg {String} storeId 可选的独一无二的Store标识。如果有的话，将会在{@link Ext.StoreMgr}中登记Store。以便更好的复用。默认是undefined。Optional unique identifier for this store. If present, this Store will be registered with 
     * the {@link Ext.StoreMgr}, making it easy to reuse elsewhere. Defaults to undefined.
     */

    //documented above
    constructor: function(config) {
        this.addEvents(
	        /**
	         * @event add
	         * 当有Model添加到Store里面后触发。
	         * Fired when a Model instance has been added to this Store
	         * @param {Ext.data.Store} this Ext.data.Store
	         * @param {Array} records 加入的Model数组（Ext.data.Model []）。The Model instances that were added
	         * @param {Number} index 添加Record的索引。The index at which the instances were inserted
	         */
            'add',

            /**
             * @event remove
             *  当Store中的Model被移除后触发。
             * Fired when a Model instance has been removed from this Store
             * @param {Ext.data.Model} record 被移除的Model。The record that was removed
             */
            'remove',
            
            /**
             * @event update
             * 当有Record更新时触发。
             * Fires when a Record has been updated
             * @param {Store} this
             * @param {Ext.data.Model} record 被更新的Model。The Model instance that was updated
             * @param {String} operation更新的Opeation对象。可以是以下的值： The update operation being performed. Value may be one of:
             * <pre><code>
               Ext.data.Model.EDIT
               Ext.data.Model.REJECT
               Ext.data.Model.COMMIT
             * </code></pre>
             */
            'update',

            /**
             * @event datachanged
             * 当有数据发生变动的时候触发该事件，包括添加或删除记录，又或者更新记录。
             * Fires whenever the records in the Store have changed in some way - this could include adding or removing records,
             * or updating the data in existing records
             * @param {Ext.data.Store} this Store对象。The data store
             */
            'datachanged',

            /**
             * @event beforeload
             * 当一笔新的Record加载之前触发。
             * Event description
             * @param {Ext.data.Store} store This Store
             * @param {Ext.data.Operation} operation 会传入到Proxy的Ext.data.Operation对象以加载Store数据。The Ext.data.Operation object that will be passed to the Proxy to load the Store
             */
            'beforeload',

            /**
             * @event load
             * 当一笔新的Record加载完毕后触发。
             * Fires whenever the store reads data from a remote data source.
             * @param {Ext.data.store} this
             * @param {Array} records 记录数组。An array of records
             * @param {Boolean} successful True表示为操作成功。True if the operation was successful.
             */
            'load',

            /**
             * @event beforesync
             * 在执行{@link #sync}之前触发的事件。返回false就取消任何同步的事件。
             * Called before a call to {@link #sync} is executed. Return false from any listener to cancel the synv
             * @param {Object} options 要同步的全体记录。断裂的create、update和destroy。Hash of all records to be synchronized, broken down into create, update and destroy
             */
            'beforesync'
        );
        
        Ext.apply(this, config);

        /**
         * 临时的缓存，用于保存Proxy同步之前的那些要被移除的模型实例。
         * Temporary cache in which removed model instances are kept until successfully synchronised with a Proxy,
         * at which point this is cleared.
         * @private
         * @property removed
         * @type Array
         */
        this.removed = [];

        /**
         * 为每个字段排序的方向（'ASC'或'DESC'），只读的。
         * Stores the current sort direction ('ASC' or 'DESC') for each field. Used internally to manage the toggling
         * of sort direction per field. Read only
         * @property sortToggle
         * @type Object
         */
        this.sortToggle = {};

        Ext.data.AbstractStore.superclass.constructor.apply(this, arguments);

        this.model = Ext.ModelMgr.getModel(config.model);
        
        /**
         * @property modelDefaults
         * @type Object
         * @private
         * 透过{@link #insert}或{@link #create}创建每一个模型实例的时候，所读取得默认值。
         * 这是内部建立外键和其它字段的关系。参阅Association源代码的例子。用户不需要接触这个属性。
         * A set of default values to be applied to every model instance added via {@link #insert} or created via {@link #create}.
         * This is used internally by associations to set foreign keys and other fields. See the Association classes source code
         * for examples. This should not need to be used by application developers.
         */
        Ext.applyIf(this, {
            modelDefaults: {}
        });

        //向后兼容 Supports the 3.x style of simply passing an array of fields to the store, implicitly creating a model
        if (!this.model && config.fields) {
            this.model = Ext.regModel('ImplicitModel-' + this.storeId || Ext.id(), {
                fields: config.fields
            });

            delete this.fields;

            this.implicitModel = true;
        }

        //保证Proxy都被实例化。ensures that the Proxy is instantiated correctly
        this.setProxy(config.proxy || this.model.proxy);

        if (this.id && !this.storeId) {
            this.storeId = this.id;
            delete this.id;
        }

        if (this.storeId) {
            Ext.StoreMgr.register(this);
        }
        
        /**
         * 当前应用到该Store的{@link Ext.util.Sorter 排序器}集合。
         * The collection of {@link Ext.util.Sorter Sorters} currently applied to this Store. 
         * @property sorters
         * @type Ext.util.MixedCollection
         */
        this.sorters = new Ext.util.MixedCollection();
        this.sorters.addAll(this.decodeSorters(config.sorters));
        
        /**
         * 当前应用到该Store的{@link Ext.util.Filter 过滤器}集合。
         * The collection of {@link Ext.util.Filter Filters} currently applied to this Store
         * @property filters
         * @type Ext.util.MixedCollection
         */
        this.filters = new Ext.util.MixedCollection();
        this.filters.addAll(this.decodeFilters(config.filters));
    },


    /**
     * 设置Store的Proxy，该项可以是字符串、Proxy实例对象、配置项对象。
     * Sets the Store's Proxy by string, config object or Proxy instance
     * @param {String|Object|Ext.data.Proxy} proxy 新型Proxy，该项可以是字符串、Proxy实例对象、配置项对象。The new Proxy, which can be either a type string, a configuration object
     * or an Ext.data.Proxy instance
     * @return {Ext.data.Proxy} 加入的Proxy对象。The attached Proxy object
     */
    setProxy: function(proxy) {
        if (proxy instanceof Ext.data.Proxy) {
            proxy.setModel(this.model);
        } else {
            Ext.applyIf(proxy, {
                model: this.model
            });
            
            proxy = Ext.data.ProxyMgr.create(proxy);
        }
        
        this.proxy = proxy;
        
        return this.proxy;
    },

    /**
     * 返回当前绑定到Store的Proxy。
     * Returns the proxy currently attached to this proxy instance
     * @return {Ext.data.Proxy} Proxy实例。The Proxy instance
     */
    getProxy: function() {
        return this.proxy;
    },

    //保存虚记录。 saves any phantom records
    create: function(data, options) {
        var instance = Ext.ModelMgr.create(Ext.applyIf(data, this.modelDefaults), this.model.modelName),
            operation;
        
        options = options || {};

        Ext.applyIf(options, {
            action : 'create',
            records: [instance]
        });

        operation = new Ext.data.Operation(options);

        this.proxy.create(operation, this.onProxyWrite, this);
        
        return instance;
    },

    read: function() {
        return this.load.apply(this, arguments);
    },

    onProxyRead: Ext.emptyFn,

    update: function(options) {
        options = options || {};

        Ext.applyIf(options, {
            action : 'update',
            records: this.getUpdatedRecords()
        });

        var operation = new Ext.data.Operation(options);

        return this.proxy.update(operation, this.onProxyWrite, this);
    },

    onProxyWrite: Ext.emptyFn,


    //让加入的proxy消耗指定的记录。tells the attached proxy to destroy the given records
    destroy: function(options) {
        options = options || {};

        Ext.applyIf(options, {
            action : 'destroy',
            records: this.getRemovedRecords()
        });

        var operation = new Ext.data.Operation(options);

        return this.proxy.destroy(operation, this.onProxyWrite, this);
    },


    onBatchOperationComplete: function(batch, operation) {
        if (operation.action == 'create') {
            var records = operation.records,
                length  = records.length,
                i;

            for (i = 0; i < length; i++) {
                records[i].needsAdd = false;
            }
        }
        
        this.fireEvent('datachanged', this);
    },

    /**
     * @private
     * 为Proxy的批处理对象登记“complete”事件。遍历批处理的Opeartion对象并更新Store内部的MixedCollection数据集合。
     * Attached as the 'complete' event listener to a proxy's Batch object. Iterates over the batch operations
     * and updates the Store's internal data MixedCollection.
     */
    onBatchComplete: function(batch, operation) {
        var operations = batch.operations,
            length = operations.length,
            i;

        this.suspendEvents();

        for (i = 0; i < length; i++) {
            this.onProxyWrite(operations[i]);
        }

        this.resumeEvents();

        this.fireEvent('datachanged', this);
    },

    onBatchException: function(batch, operation) {
        // //decide what to do... could continue with the next operation
        // batch.start();
        //
        // //or retry the last operation
        // batch.retry();
    },

    /**
     * @private
     * 新纪录的过滤器函数。
     * Filter function for new records.
     */
    filterNew: function(item) {
        return item.phantom == true || item.needsAdd == true;
    },

    /**
     * 返回全部模型实例 
     * 返回全部虚模型实例（例如没有id的），或者返回有ID但是这个Store尚未保存的模型实例（当从另外一个Store取得一个非虚记录到这个Store的时候发生）。 
     * Returns all Model instances that are either currently a phantom (e.g. have no id), or have an ID but have not
     * yet been saved on this Store (this happens when adding a non-phantom record from another Store into this one)
     * @return {Array} Model实例。The Model instances
     */
    getNewRecords: function() {
        return [];
    },

    /**
     *返回全部已经更新但是没有与Proxy同步的模型实例。 
     * Returns all Model instances that have been updated in the Store but not yet synchronized with the Proxy
     * @return {Array} 更新的模型实例。The updated Model instances
     */
    getUpdatedRecords: function() {
        return [];
    },

    /**
     * @private
     * 脏纪录的过滤器函数。
     * Filter function for dirty records.
     */
    filterDirty: function(item) {
        return item.dirty == true;
    },
	// 返回在Store已经消失的记录，但在Proxy上尚未被摧毁这些记录。
    //returns any records that have been removed from the store but not yet destroyed on the proxy
    getRemovedRecords: function() {
        return this.removed;
    },


    sort: function(sorters, direction) {

    },

    /**
     * @private
     * 常规化排序器对象，保证它们都是Ext.util.Sorter实例。
     * Normalizes an array of sorter objects, ensuring that they are all Ext.util.Sorter instances
     * @param {Array} sorters 排序器对象。The sorters array
     * @return {Array} Ext.util.Sorter对象组成的数组。Array of Ext.util.Sorter objects
     */
    decodeSorters: function(sorters) {
        if (!Ext.isArray(sorters)) {
            if (sorters == undefined) {
                sorters = [];
            } else {
                sorters = [sorters];
            }
        }

        var length = sorters.length,
            Sorter = Ext.util.Sorter,
            config, i;

        for (i = 0; i < length; i++) {
            config = sorters[i];

            if (!(config instanceof Sorter)) {
                if (Ext.isString(config)) {
                    config = {
                        property: config
                    };
                }
                
                Ext.applyIf(config, {
                    root     : 'data',
                    direction: "ASC"
                });

                //支持3.x 向后兼容。support for 3.x style sorters where a function can be defined as 'fn'
                if (config.fn) {
                    config.sorterFn = config.fn;
                }

                //支持函数类型的。support a function to be passed as a sorter definition
                if (typeof config == 'function') {
                    config = {
                        sorterFn: config
                    };
                }

                sorters[i] = new Sorter(config);
            }
        }

        return sorters;
    },

    filter: function(filters, value) {

    },

    /**
     * @private
     * 创建排序函数。
     * Creates and returns a function which sorts an array by the given field and direction
     * @param {String} field 要排序的字段。The field to create the sorter for
     * @param {String} direction 排序大的方向（默认“ASC”）The direction to sort by (defaults to "ASC")
     * @return {Function} 排序函数。A function which sorts by the field/direction combination provided
     */
    createSortFunction: function(field, direction) {
        direction = direction || "ASC";
        var directionModifier = direction.toUpperCase() == "DESC" ? -1 : 1;

        var fields   = this.model.prototype.fields,
            sortType = fields.get(field).sortType;

        //create a comparison function. Takes 2 records, returns 1 if record 1 is greater,
        //-1 if record 2 is greater or 0 if they are equal
        return function(r1, r2) {
            var v1 = sortType(r1.data[field]),
                v2 = sortType(r2.data[field]);

            return directionModifier * (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0));
        };
    },

    /**
     * @private
     * 常规化排序器对象，保证它们都是Ext.util.Filter实例。
     * Normalizes an array of filter objects, ensuring that they are all Ext.util.Filter instances
     * @param {Array} filters 排序器对象。The filters array
     * @return {Array} Ext.util.Sorter对象组成的数组。Array of Ext.util.Filter objects
     */
    decodeFilters: function(filters) {
        if (!Ext.isArray(filters)) {
            if (filters == undefined) {
                filters = [];
            } else {
                filters = [filters];
            }
        }

        var length = filters.length,
            Filter = Ext.util.Filter,
            config, i;

        for (i = 0; i < length; i++) {
            config = filters[i];

            if (!(config instanceof Filter)) {
                Ext.apply(config, {
                    root: 'data'
                });

                //向后兼容 support for 3.x style filters where a function can be defined as 'fn'
                if (config.fn) {
                    config.filterFn = config.fn;
                }

                //support a function to be passed as a filter definition
                if (typeof config == 'function') {
                    config = {
                        filterFn: config
                    };
                }

                filters[i] = new Filter(config);
            }
        }

        return filters;
    },

    clearFilter: function(supressEvent) {

    },

    isFiltered: function() {

    },

    filterBy: function(fn, scope) {

    },


    /**
     * 使得Store及其Proxy于同步的状态，让Proxy打包任何Store中的new、updated、deleted的记录，更新Store内部的记录内容为每个操作的完成状态。
     * Synchronizes the Store with its Proxy. This asks the Proxy to batch together any new, updated
     * and deleted records in the store, updating the Store's internal representation of the records
     * as each operation completes.
     */
    sync: function() {
        var me        = this,
            options   = {},
            toCreate  = me.getNewRecords(),
            toUpdate  = me.getUpdatedRecords(),
            toDestroy = me.getRemovedRecords(),
            needsSync = false;

        if (toCreate.length > 0) {
            options.create = toCreate;
            needsSync = true;
        }

        if (toUpdate.length > 0) {
            options.update = toUpdate;
            needsSync = true;
        }

        if (toDestroy.length > 0) {
            options.destroy = toDestroy;
            needsSync = true;
        }

        if (needsSync && me.fireEvent('beforesync', options) !== false) {
            me.proxy.batch(options, me.getBatchListeners());
        }
    },


    /**
     * @private
     * 返回传入到this.sync中的proxy.batch侦听器参数。这里分开了函数是为了可以自定义侦听器。
     * Returns an object which is passed in as the listeners argument to proxy.batch inside this.sync.
     * This is broken out into a separate function to allow for customisation of the listeners
     * @return {Object} 侦听器对象。The listeners object
     */
    getBatchListeners: function() {
        var listeners = {
            scope: this,
            exception: this.onBatchException
        };

        if (this.batchUpdateMode == 'operation') {
            listeners['operationcomplete'] = this.onBatchOperationComplete;
        } else {
            listeners['complete'] = this.onBatchComplete;
        }

        return listeners;
    },

    //deprecated, will be removed in 5.0
    save: function() {
        return this.sync.apply(this, arguments);
    },

    /**
     * 通过已配置的{@link #proxy}加载Store的数据。
     * Loads the Store using its configured {@link #proxy}.
     * @param {Object} options 可选的配置项对象。该对象会传入到里面要创建的{@link Ext.data.Operation Operation}对象中去。
     * 然后送到Proxy的{@link Ext.data.Proxy#read}函数。
     * Optional config object. This is passed into the {@link Ext.data.Operation Operation}
     * object that is created and then sent to the proxy's {@link Ext.data.Proxy#read} function
     */
    load: function(options) {
        var me = this,
            operation;

        options = options || {};

        Ext.applyIf(options, {
            action : 'read',
            filters: me.filters.items,
            sorters: me.sorters.items
        });

        operation = new Ext.data.Operation(options);

        if (me.fireEvent('beforeload', me, operation) !== false) {
            me.loading = true;
            me.proxy.read(operation, me.onProxyLoad, me);
        }
        
        return me;
    },

    /**
     * @private
     * 当{@link Ext.data.Model#join joined}到Store后，模型实例应该调用这个方法。
     * A model instance should call this method on the Store it has been {@link Ext.data.Model#join joined} to.
     * @param {Ext.data.Model} record 编辑的模型实例。The model instance that was edited
     */
    afterEdit : function(record) {
        this.fireEvent('update', this, record, Ext.data.Model.EDIT);
    },

    /**
     * @private
     * 当{@link Ext.data.Model#join joined}到Store后，模型实例应该调用这个方法。
     * A model instance should call this method on the Store it has been {@link Ext.data.Model#join joined} to..
     * @param {Ext.data.Model} record 编辑的模型实例。The model instance that was edited
     */
    afterReject : function(record) {
        this.fireEvent('update', this, record, Ext.data.Model.REJECT);
    },

    /**
     * @private
     * 当{@link Ext.data.Model#join joined}到Store后，模型实例应该调用这个方法。
     * A model instance should call this method on the Store it has been {@link Ext.data.Model#join joined} to.
     * @param {Ext.data.Model} record 编辑的模型实例。The model instance that was edited
     */
    afterCommit : function(record) {
        if (this.autoSave) {
            this.sync();
        }

        this.fireEvent('update', this, record, Ext.data.Model.COMMIT);
    },

    clearData: Ext.emptFn,

    destroyStore: function() {
        if (!this.isDestroyed) {
            if (this.storeId) {
                Ext.StoreMgr.unregister(this);
            }
            this.clearData();
            this.data = null;
            this.tree = null;
            // Ext.destroy(this.proxy);
            this.reader = this.writer = null;
            this.clearListeners();
            this.isDestroyed = true;

            if (this.implicitModel) {
                Ext.destroy(this.model);
            }
        }
    },

    /**
     * 返回描述该Store的排列对象信息的对象。
     * Returns an object describing the current sort state of this Store.
     * @return {Object} Store的排序信息。有两个属性：The sort state of the Store. An object with two properties:<ul>
     * <li><b>field : String<p class="sub-desc">Records的那一个对象被排序。The name of the field by which the Records are sorted.</p></li>
     * <li><b>direction : String<p class="sub-desc">排序方向：'ASC'或'DESC'（大小写敏感的）The sort order, 'ASC' or 'DESC' (case-sensitive).</p></li>
     * </ul>
     * 参阅<tt>{@link #sortInfo}</tt>了解更多。See <tt>{@link #sortInfo}</tt> for additional details.
     */
    getSortState : function() {
        return this.sortInfo;
    },

    getCount: function() {

    },

    getById: function(id) {

    },

    // individual substores should implement a "fast" remove
    // and fire a clear event afterwards
    removeAll: function() {

    }
});