/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
 * 
 * 本翻译采用“创作共同约定、Creative Commons”。您可以自由：
 * 复制、发行、展览、表演、放映、广播或通过信息网络传播本作品
 * 创作演绎作品
 * 请遵守：
 *    署名. 您必须按照作者或者许可人指定的方式对作品进行署名。
 * # 对任何再使用或者发行，您都必须向他人清楚地展示本作品使用的许可协议条款。
 * # 如果得到著作权人的许可，您可以不受任何这些条件的限制
 * http://creativecommons.org/licenses/by/2.5/cn/
 */

/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.data.Store
 * @extends Ext.util.Observable
 * The Store class encapsulates a client side cache of {@link Ext.data.Record} objects which provide input data
 * for widgets such as the Ext.grid.Grid, or the Ext.form.ComboBox.<br>
 * <p>
 * A Store object uses an implementation of {@link Ext.data.DataProxy} to access a data object unless you call loadData() directly and pass in your data. The Store object
 * has no knowledge of the format of the data returned by the Proxy.<br>
 * <p>
 * A Store object uses its configured implementation of {@link Ext.data.DataReader} to create {@link Ext.data.Record}
 * instances from the data object. These records are cached and made available through accessor functions.
 * @constructor
 * Creates a new Store.
 * @param {Object} config A config object containing the objects needed for the Store to access data,
 * and read the data into Records.
 */
 /**
 * @ Ext.data.Store类
 * @继承了 Ext.util.Observable
 * 该类封装了一个客户端的Ext.data.Record对象的缓存.该缓存为窗口小部件如grid,combobox等提供了填充数据<br>
 * <p>
 * 一个store对象使用一个Ext.data.Proxy的实现类来访问一数据对象.直到你调用loadData()直接地传入你的数据.<br>
 * <p>
 * 该类使用配置的一个Ext.data.DataReader的实例类来从数据对象创建Ext.data.Record实例.这些records都被缓存并且
 * 通过访问器函数可利用到
 * @构建器
 * 创建一新Store
 * @param {Object} config 一配置对象,包含了Store用来访问数据,及读数据至Records的对象
 */
Ext.data.Store = function(config){
    this.data = new Ext.util.MixedCollection(false);
    this.data.getKey = function(o){
        return o.id;
    };
    this.baseParams = {};
    // private
    this.paramNames = {
        "start" : "start",
        "limit" : "limit",
        "sort" : "sort",
        "dir" : "dir"
    };

    if(config && config.data){
        this.inlineData = config.data;
        delete config.data;
    }

    Ext.apply(this, config);

    if(this.reader){ // reader passed
        if(!this.recordType){
            this.recordType = this.reader.recordType;
        }
        if(this.reader.onMetaChange){
            this.reader.onMetaChange = this.onMetaChange.createDelegate(this);
        }
    }

    if(this.recordType){
        this.fields = this.recordType.prototype.fields;
    }
    this.modified = [];

    this.addEvents({
        /**
         * @event datachanged
         * Fires when the data cache has changed, and a widget which is using this Store
         * as a Record cache should refresh its view.
         * @param {Store} this
         */
		  /**
         * @event datachanged
         * 当数据缓存有改变时触发该事件.使用了该Store作为Record缓存的窗口部件应当更新
         * @param {Store} this
         */
        datachanged : true,
        /**
         * @event metachange
         * Fires when this store's reader provides new metadata (fields). This is currently only support for JsonReaders.
         * @param {Store} this
         * @param {Object} meta The JSON metadata
         */
		  /**
         * @event metachange
         * 当store的reader 提供新的元数据字段时触发.这目前仅支持jsonReader
         * @param {Store} this
         * @param {Object} meta JSON 元数据
         */
        metachange : true,
        /**
         * @event add
         * Fires when Records have been added to the Store
         * @param {Store} this
         * @param {Ext.data.Record[]} records The array of Records added
         * @param {Number} index The index at which the record(s) were added
         */
		 /**
         * @event add
         * 当Records被添加到store时激发
         * @param {Store} this
         * @param {Ext.data.Record[]} records The 要被加入的Record数组
         * @param {Number} index 被添加进去的record的索引
         */
        add : true,
        /**
         * @event remove
         * Fires when a Record has been removed from the Store
         * @param {Store} this
         * @param {Ext.data.Record} record The Record that was removed
         * @param {Number} index The index at which the record was removed
         */
		 /**
         * @event remove
         * 当一个record被从store里移出时激发
         * @param {Store} this
         * @param {Ext.data.Record} record 被移出的对Record象
         * @param {Number} index 被移出的record的索引值
         */
        remove : true,
        /**
         * @event update
         * Fires when a Record has been updated
         * @param {Store} this
         * @param {Ext.data.Record} record The Record that was updated
         * @param {String} operation The update operation being performed.  Value may be one of:
         * <pre><code>
 Ext.data.Record.EDIT
 Ext.data.Record.REJECT
 Ext.data.Record.COMMIT
         * </code></pre>
         */
		 /**
         * @event update
         * 当有record被更新时激发
         * @param {Store} this
         * @param {Ext.data.Record} record 被更新的记录
         * @param {String} operation 更新操作将要执行时的操作.  可能是下列值:
         * <pre><code>
 Ext.data.Record.EDIT
 Ext.data.Record.REJECT
 Ext.data.Record.COMMIT
         * </code></pre>
         */
        update : true,
        /**
         * @event clear
         * Fires when the data cache has been cleared.
         * @param {Store} this
         */
		  /**
         * @event clear
         * 当数据缓存被清除时激发
         * @param {Store} this
         */
        clear : true,
        /**
         * @event beforeload
         * Fires before a request is made for a new data object.  If the beforeload handler returns false
         * the load action will be canceled.
         * @param {Store} this
         * @param {Object} options The loading options that were specified (see {@link #load} for details)
         */
		 /**
         * @event beforeload
         * 在一个请求新数据的请求发起之前触发  ,如果beforeload事件句柄返回false.装载动作将会被取消
         * @param {Store} this
         * @param {Object} options 指定的loading选项 (从 {@link #load} 查看更多细节)
         */
        beforeload : true,
        /**
         * @event load
         * 在一个新的数据集被装载之后激发该事件
         * @param {Store} this
         * @param {Ext.data.Record[]} records 被载入的records
         * @param {Object} options The 指定的loading选项 (从 {@link #load} 查看更多细节)
         */
        load : true,
        /**
         * @event loadexception
         * Fires if an exception occurs in the Proxy during loading.
         * Called with the signature of the Proxy's "loadexception" event.
         */
		  /**
         * @event loadexception
         * 在装载过程中有错误发生在代理中时触发该事件
		 * 调用代理的"loadexception"事件的签名
         */
        loadexception : true
    });

    if(this.proxy){
        this.relayEvents(this.proxy,  ["loadexception"]);
    }
    this.sortToggle = {};

    Ext.data.Store.superclass.constructor.call(this);

    if(this.inlineData){
        this.loadData(this.inlineData);
        delete this.inlineData;
    }
};
Ext.extend(Ext.data.Store, Ext.util.Observable, {
    /**
    * @cfg {Ext.data.DataProxy} proxy The Proxy object which provides access to a data object.
    */
	/**
    * @cfg {Ext.data.DataProxy} proxy 提供访问数据对象的代理对象
    */
    /**
    * @cfg {Array} data Inline data to be loaded when the store is initialized.
    */
	 /**
    * @cfg {Array} data 当store被初使化时,将被装载的inline 数据.
    */
    /**
    * @cfg {Ext.data.Reader} reader The Reader object which processes the data object and returns
    * an Array of Ext.data.record objects which are cached keyed by their <em>id</em> property.
    */
	/**
    * @cfg {Ext.data.Reader} 处理数据对象并返回通过他的id属性映射的被缓存的Ext.data.record对象数组的Reader对象.
    */
    /**
    * @cfg {Object} baseParams An object containing properties which are to be sent as parameters
    * on any HTTP request
    */
	 /**
    * @cfg {Object} baseParams 一个包含属性的对象.这些属性在http请求时作为参数被发送出去
    */
    /**
    * @cfg {Object} sortInfo A config object in the format: {field: "fieldName", direction: "ASC|DESC"}
    */
	 /**
    * @cfg {Object} sortInfo  一个有着类似如下格式的配置对象: {field: "fieldName", direction: "ASC|DESC"}
    */
    /**
    * @cfg {boolean} remoteSort True if sorting is to be handled by requesting the Proxy to provide a refreshed
    * version of the data object in sorted order, as opposed to sorting the Record cache in place (defaults to false).
    */
	/**
    * @cfg {boolean} remoteSort 如果设置为true,在排序命定时排序被请求的代理(用来提供一个制新了的版本的数据对象)处理.
	* 如果不想对Record缓存排序则设为false,默认为false.
    */
    remoteSort : false,

    /**
    * @cfg {boolean} pruneModifiedRecords True to clear all modified record information each time the store is
     * loaded or when a record is removed. (defaults to false).
    */
	/**
    * @cfg {boolean} pruneModifiedRecords 设置为true,则每次当store装载或有record被移除时,清空所有修改了的record信息.
	* 默认为false.
    */
    pruneModifiedRecords : false,

    // private
    lastOptions : null,

    /**
     * Add Records to the Store and fires the add event.
     * @param {Ext.data.Record[]} records An Array of Ext.data.Record objects to add to the cache.
     */
	 /**
     * 在触发add事件时添加一个Records进Store.
     * @param {Ext.data.Record[]} records 被添加到缓存中的Ext.data.Record对象或其数组对象
     */
    add : function(records){
        records = [].concat(records);
        for(var i = 0, len = records.length; i < len; i++){
            records[i].join(this);
        }
        var index = this.data.length;
        this.data.addAll(records);
        this.fireEvent("add", this, records, index);
    },

    /**
     * Remove a Record from the Store and fires the remove event.
     * @param {Ext.data.Record} record Th Ext.data.Record object to remove from the cache.
     */
	  /**
     * 在触发移除事件时从Store中移除一Record对象
     * @param {Ext.data.Record} record 被从缓存中移除的Ext.data.Record对象.
     */
    remove : function(record){
        var index = this.data.indexOf(record);
        this.data.removeAt(index);
        if(this.pruneModifiedRecords){
            this.modified.remove(record);
        }
        this.fireEvent("remove", this, record, index);
    },

    /**
     * Remove all Records from the Store and fires the clear event.
     */
	 /**
     * 在清除事件触发时从Store移除所有Record
     */
    removeAll : function(){
        this.data.clear();
        if(this.pruneModifiedRecords){
            this.modified = [];
        }
        this.fireEvent("clear", this);
    },

    /**
     * Inserts Records to the Store at the given index and fires the add event.
     * @param {Number} index The start index at which to insert the passed Records.
     * @param {Ext.data.Record[]} records An Array of Ext.data.Record objects to add to the cache.
     */
	  /**
     * 触发添加事件时插入records到指定的store位置
     * @param {Number} index The 传入的Records插入的开始位置
     * @param {Ext.data.Record[]} records.
     */
    insert : function(index, records){
        records = [].concat(records);
        for(var i = 0, len = records.length; i < len; i++){
            this.data.insert(index, records[i]);
            records[i].join(this);
        }
        this.fireEvent("add", this, records, index);
    },

    /**
     * Get the index within the cache of the passed Record.
     * @param {Ext.data.Record} record The Ext.data.Record object to to find.
     * @return {Number} The index of the passed Record. Returns -1 if not found.
     */
	  /**
     * 获取传入的Record在缓存中的索引
     * @param {Ext.data.Record} record 要找寻的Ext.data.Record.
     * @return {Number} 被传入的Record的索引,如果未找到返回-1.
     */
    indexOf : function(record){
        return this.data.indexOf(record);
    },

    /**
     * Get the index within the cache of the Record with the passed id.
     * @param {String} id The id of the Record to find.
     * @return {Number} The index of the Record. Returns -1 if not found.
     */

	 /**
     * 根据传入的id查询缓存里的Record的索引
     * @param {String} id  要找到Record的id.
     * @return {Number} 被找到的Record的索引. 如果未找到返回-1.
     */
    indexOfId : function(id){
        return this.data.indexOfKey(id);
    },

    /**
     * Get the Record with the specified id.
     * @param {String} id The id of the Record to find.
     * @return {Ext.data.Record} The Record with the passed id. Returns undefined if not found.
     */
	 /**
     * 根据指定的id找到Record.
     * @param {String} id 要找的Record的id
     * @return {Ext.data.Record} 返回找到的指定id的Record,如果未找到则返回underfined.
     */
    getById : function(id){
        return this.data.key(id);
    },

    /**
     * Get the Record at the specified index.
     * @param {Number} index The index of the Record to find.
     * @return {Ext.data.Record} The Record at the passed index. Returns undefined if not found.
     */
	  /**
     * 根据指定的索引找到Record.
     * @param {Number} index 要找的Record的索引.
     * @return {Ext.data.Record} 返回找到的指定索引的Record,如果未找到则返回undefined.
     */
    getAt : function(index){
        return this.data.itemAt(index);
    },

    /**
     * Returns a range of Records between specified indices.
     * @param {Number} startIndex (optional) The starting index (defaults to 0)
     * @param {Number} endIndex (optional) The ending index (defaults to the last Record in the Store)
     * @return {Ext.data.Record[]} An array of Records
     */
	 /**
     *  返回指定范围里的Records.
     * @param {Number} startIndex (可选项) 开始索引 (默认为 0)
     * @param {Number} endIndex (可选项) 结束的索引 (默认是Store中最后一个Record的索引)
     * @return {Ext.data.Record[]} 返回一个Record数组
     */
    getRange : function(start, end){
        return this.data.getRange(start, end);
    },

    // private
    storeOptions : function(o){
        o = Ext.apply({}, o);
        delete o.callback;
        delete o.scope;
        this.lastOptions = o;
    },

    /**
     * Loads the Record cache from the configured Proxy using the configured Reader.
     * <p>
     * If using remote paging, then the first load call must specify the <em>start</em>
     * and <em>limit</em> properties in the options.params property to establish the initial
     * position within the dataset, and the number of Records to cache on each read from the Proxy.
     * <p>
     * <strong>It is important to note that for remote data sources, loading is asynchronous,
     * and this call will return before the new data has been loaded. Perform any post-processing
     * in a callback function, or in a "load" event handler.</strong>
     * <p>
     * @param {Object} options An object containing properties which control loading options:<ul>
     * <li>params {Object} An object containing properties to pass as HTTP parameters to a remote data source.</li>
     * <li>callback {Function} A function to be called after the Records have been loaded. The callback is
     * passed the following arguments:<ul>
     * <li>r : Ext.data.Record[]</li>
     * <li>options: Options object from the load call</li>
     * <li>success: Boolean success indicator</li></ul></li>
     * <li>scope {Object} Scope with which to call the callback (defaults to the Store object)</li>
     * <li>add {Boolean} indicator to append loaded records rather than replace the current cache.</li>
     * </ul>
     */
	 /**
     * 使用配置的Record从配置的代理中装载Record缓存.
     * <p>
     * 如果使用远程(服务端)分页, 在第一次装载调用时必须在配置项中指定start,和limit属性.
	 * 参数的属性确定在数据集初使化位置,和每次从代理的缓存中的Record的数目.
     * <p>
     * <strong>这是很重要的,对于远程数据源,请注意:装载是异步的,而且此次调用将会在新数据被装载之前返回.
	 * 在回调函数中执行后处理,或者在"load"事件中处理</strong>
     * <p>
     * @param {Object} options 包含控制装载的可选项作为属性的对象:<ul>
     * <li>params {Object} 包含了一组属性的对象.这些属性作为向http参数传入远程数据源.</li>
     * <li>callback {Function} 当Record被传入后被调用的参数,该函数传入如下参数:<ul>
     * <li>r : Ext.data.Record[]</li>
     * <li>options: 来自装载调用的可选项对象</li>
     * <li>success: 布尔值的成功指示器</li></ul></li>
     * <li>scope {Object} 调用回调函数的作用域 (默认为Store对象)</li>
     * <li>add {Boolean}  追加装载的records而不是代替当前缓存的布尔指示器.</li>
     * </ul>
     */
    load : function(options){
        options = options || {};
        if(this.fireEvent("beforeload", this, options) !== false){
            this.storeOptions(options);
            var p = Ext.apply(options.params || {}, this.baseParams);
            if(this.sortInfo && this.remoteSort){
                var pn = this.paramNames;
                p[pn["sort"]] = this.sortInfo.field;
                p[pn["dir"]] = this.sortInfo.direction;
            }
            this.proxy.load(p, this.reader, this.loadRecords, this, options);
        }
    },

    /**
     * Reloads the Record cache from the configured Proxy using the configured Reader and
     * the options from the last load operation performed.
     * @param {Object} options (optional) An object containing properties which may override the options
     * used in the last load operation. See {@link #load} for details (defaults to null, in which case
     * the most recently used options are reused).
     */ 
	/**
     * 使用被配置的reader和可选项从最后一次装载操作任务从配置的proxy中装载record缓存
     * @param {Object} options (optional) An object containing properties which may override the options
     * used in the last load operation. See {@link #load} for details (defaults to null, in which case
     * the most recently used options are reused).
     */
    reload : function(options){
        this.load(Ext.applyIf(options||{}, this.lastOptions));
    },

    // private
    // Called as a callback by the Reader during a load operation.
	// 在装载操作时,被Reader作为回调函数来调用
    loadRecords : function(o, options, success){
        if(!o || success === false){
            if(success !== false){
                this.fireEvent("load", this, [], options);
            }
            if(options.callback){
                options.callback.call(options.scope || this, [], options, false);
            }
            return;
        }
        var r = o.records, t = o.totalRecords || r.length;
        if(!options || options.add !== true){
            if(this.pruneModifiedRecords){
                this.modified = [];
            }
            for(var i = 0, len = r.length; i < len; i++){
                r[i].join(this);
            }
            if(this.snapshot){
                this.data = this.snapshot;
                delete this.snapshot;
            }
            this.data.clear();
            this.data.addAll(r);
            this.totalLength = t;
            this.applySort();
            this.fireEvent("datachanged", this);
        }else{
            this.totalLength = Math.max(t, this.data.length+r.length);
            this.add(r);
        }
        this.fireEvent("load", this, r, options);
        if(options.callback){
            options.callback.call(options.scope || this, r, options, true);
        }
    },

    /**
     * Loads data from a passed data block. A Reader which understands the format of the data
     * must have been configured in the constructor.
     * @param {Object} data The data block from which to read the Records.  The format of the data expected
     * is dependent on the type of Reader that is configured and should correspond to that Reader's readRecords parameter.
     * @param {Boolean} append (Optional) True to append the new Records rather than replace the existing cache.
     */
	 /**
     * 从传入的数据块中装载数据,了解数据格式的reader必须被配置在构建器中
     * @param {Object} data 从该处读取record的数据块.  预期数据的格式由被配置的reader的类型决定.它应该符合reader的readRecords参数
     * @param {Boolean} append (可选项) 设置为true,追加一新记录而不是代替己存在的缓存
     */
    loadData : function(o, append){
        var r = this.reader.readRecords(o);
        this.loadRecords(r, {add: append}, true);
    },

    /**
     * Gets the number of cached records.
     * <p>
     * <em>If using paging, this may not be the total size of the dataset. If the data object
     * used by the Reader contains the dataset size, then the getTotalCount() function returns
     * the data set size</em>
     */
	 /**
     * 获取缓存记录的数
     * <p>
     * <em>如果分页.这里将不再是数据集的总数. 如果Reader使用的数据对象里包含了数据的总数,则可用
	 * getTotalCount() 方法返回总计录数</em>
     */
    getCount : function(){
        return this.data.length || 0;
    },

    /**
     * Gets the total number of records in the dataset as returned by the server.
     * <p>
     * <em>If using paging, for this to be accurate, the data object used by the Reader must contain
     * the dataset size</em>
     */
	 /**
     *获取作为服务端返回的数据集中记录的总数.
     * <p>
     * <em>如果分页,这将要计算.Reader使用的数据对象必须包含数据集的大小</em>
     */
    getTotalCount : function(){
        return this.totalLength || 0;
    },

    /**
     * Returns the sort state of the Store as an object with two properties:
     * <pre><code>
 field {String} The name of the field by which the Records are sorted
 direction {String} The sort order, "ASC" or "DESC"
     * </code></pre>
     */
	 /**
     *以对象的形式返回排序的状态.它包含两属性:
     * <pre><code>
 field {String} 一个是排序字段
 direction {String} 一个是排序方向
     * </code></pre>
     */
    getSortState : function(){
        return this.sortInfo;
    },

    // private
    applySort : function(){
        if(this.sortInfo && !this.remoteSort){
            var s = this.sortInfo, f = s.field;
            var st = this.fields.get(f).sortType;
            var fn = function(r1, r2){
                var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
                return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
            };
            this.data.sort(s.direction, fn);
            if(this.snapshot && this.snapshot != this.data){
                this.snapshot.sort(s.direction, fn);
            }
        }
    },

    /**
     * Sets the default sort column and order to be used by the next load operation.
     * @param {String} fieldName The name of the field to sort by.
     * @param {String} dir (optional) The sort order, "ASC" or "DESC" (defaults to "ASC")
     */
	 /**
     * 设置默认的排序列,以便下次load操作时使用
     * @param {String} fieldName The name of the field to sort by.
     * @param {String} dir (optional) The sort order, "ASC" or "DESC" (defaults to "ASC")
     */
    setDefaultSort : function(field, dir){
        this.sortInfo = {field: field, direction: dir ? dir.toUpperCase() : "ASC"};
    },

    /**
     * Sort the Records.
     * If remote sorting is used, the sort is performed on the server, and the cache is
     * reloaded. If local sorting is used, the cache is sorted internally.
     * @param {String} fieldName The name of the field to sort by.
     * @param {String} dir (optional) The sort order, "ASC" or "DESC" (defaults to "ASC")
     */
	 /**
     * 为Records排序.
     * 如果使用了远程排序, 排序在服务端执行, 然后重新载入缓存.
	 * 如果只是客户端排序, 只是缓存内部排序.
     * @param {String} fieldName 排序字段.
     * @param {String} dir (optional) 排序方向.(默认升序  "ASC")
     */
    sort : function(fieldName, dir){
        var f = this.fields.get(fieldName);
        if(!dir){
            if(this.sortInfo && this.sortInfo.field == f.name){ // toggle sort dir
                dir = (this.sortToggle[f.name] || "ASC").toggle("ASC", "DESC");
            }else{
                dir = f.sortDir;
            }
        }
        this.sortToggle[f.name] = dir;
        this.sortInfo = {field: f.name, direction: dir};
        if(!this.remoteSort){
            this.applySort();
            this.fireEvent("datachanged", this);
        }else{
            this.load(this.lastOptions);
        }
    },

    /**
     * Calls the specified function for each of the Records in the cache.
     * @param {Function} fn The function to call. The Record is passed as the first parameter.
     * Returning <em>false</em> aborts and exits the iteration.
     * @param {Object} scope (optional) The scope in which to call the function (defaults to the Record).
     */
	 /**
     * 缓存的的每一个record调用的指定函数
     * @param {Function} fn 要调用的函数. 该Record作为第一个参数被传入
     * 返回 <em>false</em>  中断或退出循环.
     * @param {Object} scope (可选项) 调用函数的作用域 (默认为 Record).
     */
    each : function(fn, scope){
        this.data.each(fn, scope);
    },

    /**
     * Gets all records modified since the last commit.  Modified records are persisted across load operations
     * (e.g., during paging).
     * @return {Ext.data.Record[]} An array of Records containing outstanding modifications.
     */
	 /**
     * 获取所有的自从最后一次提交后被修改的record. 被修改的记录通过load操作来持久化
     * (例如,在分页期间).
     * @return {Ext.data.Record[]} 包含了显注修改的record数组.
     */
    getModifiedRecords : function(){
        return this.modified;
    },

    // private
    createFilterFn : function(property, value, anyMatch){
        if(!value.exec){ // not a regex
            value = String(value);
            if(value.length == 0){
                return false;
            }
            value = new RegExp((anyMatch === true ? '' : '^') + Ext.escapeRe(value), "i");
        }
        return function(r){
            return value.test(r.data[property]);
        };
    },

    /**
     * Sums the value of <i>property</i> for each record between start and end and returns the result.
     * @param {String} property A field on your records
     * @param {Number} start The record index to start at (defaults to 0)
     * @param {Number} end The last record index to include (defaults to length - 1)
     * @return {Number} The sum
     */
	 /**
     * 为每个记录的(开始和结束)属性求和并返回结果.
     * @param {String} property 记录的某个字段
     * @param {Number} start 该record的开始索引(默认为0)
     * @param {Number} end The 该record的结束索引 (默认为 - 1)
     * @return {Number} 和
     */
    sum : function(property, start, end){
        var rs = this.data.items, v = 0;
        start = start || 0;
        end = (end || end === 0) ? end : rs.length-1;

        for(var i = start; i <= end; i++){
            v += (rs[i].data[property] || 0);
        }
        return v;
    },

    /**
     * Filter the records by a specified property.
     * @param {String} field A field on your records
     * @param {String/RegExp} value Either a string that the field
     * should start with or a RegExp to test against the field
     * @param {Boolean} anyMatch True to match any part not just the beginning
     */
	 /**
     * 通过指定的属性过滤records
     * @param {String} field records的字段
     * @param {String/RegExp} value 任意一个字符串(即以该字符串打头的字段)或匹配字段的规则式
     * @param {Boolean} anyMatch 设置true,则全文匹配,而不仅是以**打头的匹配
     */
    filter : function(property, value, anyMatch){
        var fn = this.createFilterFn(property, value, anyMatch);
        return fn ? this.filterBy(fn) : this.clearFilter();
    },

    /**
     * Filter by a function. The specified function will be called with each
     * record in this data source. If the function returns true the record is included,
     * otherwise it is filtered.
     * @param {Function} fn The function to be called, it will receive 2 args (record, id)
     * @param {Object} scope (optional) The scope of the function (defaults to this)
     */
	  /**
     * 通过函数过滤,该数据源里的所有record将会调用该函数.
	 *  如果该函数返回true,结果里也包含了record,否则它被过滤掉了
     * @param {Function} fn 将被调用的函数,它将接受两个参数 (record, id)
     * @param {Object} scope (可选项)该函数的作用域.默认为本函数
     */
    filterBy : function(fn, scope){
        this.snapshot = this.snapshot || this.data;
        this.data = this.queryBy(fn, scope||this);
        this.fireEvent("datachanged", this);
    },

    /**
     * Query the records by a specified property.
     * @param {String} field A field on your records
     * @param {String/RegExp} value Either a string that the field
     * should start with or a RegExp to test against the field
     * @param {Boolean} anyMatch True to match any part not just the beginning
     * @return {MixedCollection} Returns an Ext.util.MixedCollection of the matched records
     */
	/**
     * 通过指定的属性查询record
     * @param {String} field 你records里的字段名
     * @param {String/RegExp} value 任意一个字符串(即以该字符串打头的字段)或匹配字段的规则式
     * @param {Boolean} anyMatch 设置true,则全文匹配,而不仅是以**打头的匹配
     * @return {MixedCollection} 返回匹配的record的一个 Ext.util.MixedCollection
     */

    query : function(property, value, anyMatch){
        var fn = this.createFilterFn(property, value, anyMatch);
        return fn ? this.queryBy(fn) : this.data.clone();
    },

    /**
     * Query by a function. The specified function will be called with each
     * record in this data source. If the function returns true the record is included
     * in the results.
     * @param {Function} fn The function to be called, it will receive 2 args (record, id)
     * @param {Object} scope (optional) The scope of the function (defaults to this)
      @return {MixedCollection} Returns an Ext.util.MixedCollection of the matched records
     **/
	  /**
     * 通过一函数查询. 指定的函数将会被该数据源里的每个record调用.
	 * 如果该函数返回true,该record被包含在结果中
     * @param {Function} fn 将被调用的函数,它将接受两个参数 (record, id)
     * @param {Object} scope (可选项)该函数的作用域.默认为本函数
     * @return {MixedCollection} 返回匹配的record的一个 Ext.util.MixedCollection
     **/
    queryBy : function(fn, scope){
        var data = this.snapshot || this.data;
        return data.filterBy(fn, scope||this);
    },

    /**
     * Collects unique values for a particular dataIndex from this store.
     * @param {String} dataIndex The property to collect
     * @param {Boolean} allowNull (optional) Pass true to allow null, undefined or empty string values
     * @param {Boolean} bypassFilter (optional) Pass true to collect from all records, even ones which are filtered
     * @return {Array} An array of the unique values
     **/
	  /**
     * 从该store中为精确的数据索引搜集独一无二的值
     * @param {String} dataIndex 搜集的一属性
     * @param {Boolean} allowNull (可选项) 传入为true,则否许为空或未定义或空字符串值
     * @param {Boolean} bypassFilter (可选项) 传入为true,则搜集所有记录,偶数项被过滤掉
     * @return {Array} 返回一独一无二的值
     **/
    collect : function(dataIndex, allowNull, bypassFilter){
        var d = (bypassFilter === true && this.snapshot) ?
                this.snapshot.items : this.data.items;
        var v, sv, r = [], l = {};
        for(var i = 0, len = d.length; i < len; i++){
            v = d[i].data[dataIndex];
            sv = String(v);
            if((allowNull || !Ext.isEmpty(v)) && !l[sv]){
                l[sv] = true;
                r[r.length] = v;
            }
        }
        return r;
    },

    /**
     * Revert to a view of the Record cache with no filtering applied.
     * @param {Boolean} suppressEvent If true the filter is cleared silently without notifying listeners
     */
	 /**
     * 不应用过滤回复record缓存的视图
     * @param {Boolean} suppressEvent 如果设置为true,该过滤器清空,并且不会通知监听器
     */
    clearFilter : function(suppressEvent){
        if(this.snapshot && this.snapshot != this.data){
            this.data = this.snapshot;
            delete this.snapshot;
            if(suppressEvent !== true){
                this.fireEvent("datachanged", this);
            }
        }
    },

    // private
    afterEdit : function(record){
        if(this.modified.indexOf(record) == -1){
            this.modified.push(record);
        }
        this.fireEvent("update", this, record, Ext.data.Record.EDIT);
    },

    // private
    afterReject : function(record){
        this.modified.remove(record);
        this.fireEvent("update", this, record, Ext.data.Record.REJECT);
    },

    // private
    afterCommit : function(record){
        this.modified.remove(record);
        this.fireEvent("update", this, record, Ext.data.Record.COMMIT);
    },

    /**
     * Commit all Records with outstanding changes. To handle updates for changes, subscribe to the
     * Store's "update" event, and perform updating when the third parameter is Ext.data.Record.COMMIT.
     */
	  /**
     * 有显注改变时提交所有Record,为了处理更新这些改变.订阅store的update事件.在执行更新时使用第三参数为
	 * data.Record.COMMIT
     */
    commitChanges : function(){
        var m = this.modified.slice(0);
        this.modified = [];
        for(var i = 0, len = m.length; i < len; i++){
            m[i].commit();
        }
    },

    /**
     * Cancel outstanding changes on all changed records.
     */
    rejectChanges : function(){
        var m = this.modified.slice(0);
        this.modified = [];
        for(var i = 0, len = m.length; i < len; i++){
            m[i].reject();
        }
    },

    onMetaChange : function(meta, rtype, o){
        this.recordType = rtype;
        this.fields = rtype.prototype.fields;
        delete this.snapshot;
        this.sortInfo = meta.sortInfo;
        this.modified = [];
        this.fireEvent('metachange', this, this.reader.meta);
    }
});