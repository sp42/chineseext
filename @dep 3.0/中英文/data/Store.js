/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=90 Ext中文站翻译小组
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
/**
 * @class Ext.data.Store
 * @extends Ext.util.Observable
 * Store类封装了一个客户端的{@link Ext.data.Record Record}对象的缓存，
 * 为诸如{@link Ext.grid.GridPanel GridPanel}、{@link Ext.form.ComboBox ComboBox}和{@link Ext.DataView DataView}等的小部件提供了数据的入口。<br />
 * The Store class encapsulates a client side cache of {@link Ext.data.Record Record}
 * objects which provide input data for Components such as the {@link Ext.grid.GridPanel GridPanel},
 * the {@link Ext.form.ComboBox ComboBox}, or the {@link Ext.DataView DataView}<br>
 * 
 * <p>
 * Store对象使用一个{@link Ext.data.DataProxy DataProxy}的实现来访问数据对象，该Proxy对象在{@link #proxy configured}定义。
 * 不过你可以调用{@link #loadData}直接地把数据对象传入你的数据。<br />
 * A Store object uses its {@link #proxy configured} implementation of {@link Ext.data.DataProxy DataProxy}
 * to access a data object unless you call {@link #loadData} directly and pass in your data.</p>
 * 
 * <p>Store没有储存关于Proxy返回数据格式的信息。<br />
 * A Store object has no knowledge of the format of the data returned by the Proxy.</p>
 * 
 * <p>
 * 在{@link Ext.data.DataReader DataReader}实现的帮助下，从该类提供的数据对象来创建{@link Ext.data.Record Record}实例。
 * 你可在{@link #reader configured}指定这个DataReader对象。这些records都被缓存的并且通过访问器函数可利用到。<br />
 * A Store object uses its {@link #reader configured} implementation of {@link Ext.data.DataReader DataReader}
 * to create {@link Ext.data.Record Record} instances from the data object. These Records
 * are cached and made available through accessor functions.</p>
 * @constructor 创建新的Store对象。Creates a new Store.
 * @param {Object} config  一配置对象，包含了Store用来访问数据，及读数据至Records的对象。A config object containing the objects needed for the Store to access data,
 * and read the data into Records.
 */
Ext.data.Store = function(config){
    this.data = new Ext.util.MixedCollection(false);
    this.data.getKey = function(o){
        return o.id;
    };
    /**
     * 每次HTTP请求都会携带的参数，就保存在这个对象身上。
     * An object containing properties which are used as parameters on any HTTP request.
     * @type Object
     * @property baseParams
     */
    this.baseParams = {};
    /**
     * <p>
     * 当进行服务端分页的时候，加载分页数据所必须的分页参数是什么和排序参数是什么。
     * 默认下是这样的：<br />
     * An object containing properties which specify the names of the paging and
     * sorting parameters passed to remote servers when loading blocks of data. By default, this
     * object takes the following form:</p><pre><code>
{
    start : "start",    // 指定哪一行开始的参数是什么。The parameter name which specifies the start row
    limit : "limit",    // 指定读取的行数的参数是什么。The parameter name which specifies number of rows to return
    sort : "sort",      // 指定哪一列进行排序的参数是什名。The parameter name which specifies the column to sort on
    dir : "dir"         // 指定哪一个方向排序的参数时什么。The parameter name which specifies the sort direction
}
</code></pre>
     * <p>
     * 服务端就必须清楚这些参数名称是作何种用途的。
     * 如果有不同的参数名称，在配置的时候覆盖对象的值便可。<br />
     * The server must produce the requested data block upon receipt of these parameter names.
     * If different parameter names are required, this property can be overriden using a configuration
     * property.</p>
     * 绑定在这个Grid的{@link Ext.PagingToolbar PagingToolbar}就使用这些配置来分页。请求中将会使用到。<br />
     * A {@link Ext.PagingToolbar PagingToolbar} bound to this grid uses this property to determine
     * the parameter names to use in its requests.
     * @type Object
     * @property paramNames
     */
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

    if(this.url && !this.proxy){
        this.proxy = new Ext.data.HttpProxy({url: this.url});
    }

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

    this.addEvents(
        /**
         * @event datachanged
         * 当有批量操作的时候，也就是数据发生改动的时候触发（如进行了排序、过滤的操作）。
         * 使用该Store应该的UI应该有所响应，如刷新其视图。<br />
         * Fires when the data cache has changed in a bulk manner (e.g., it has been sorted, filtered, etc.) and a 
         * widget that is using this Store as a Record cache should refresh its view.
         * @param {Store} this Ext.data.Store
         */
        'datachanged',
        /**
         * @event metachange
         * 当Store的Reader对象有提供新的元数据（也就是新字段）时触发。当前只对JsonReaders有效。
         * Fires when this store's reader provides new metadata (fields). This is currently only supported for JsonReaders.
         * @param {Store} this Ext.data.Store
         * @param {Object} meta JSON格式的元数据。The JSON metadata
         */
        'metachange',
        /**
         * @event add
         * 当有Record添加到Store里面后触发。
         * Fires when Records have been added to the Store
         * @param {Store} this Ext.data.Store
         * @param {Ext.data.Record} records 加入的Record数组（Ext.data.Record[]）。The array of Records added
         * @param {Number} index 添加Record的索引。The index at which the record(s) were added
         */
        'add',
        /**
         * @event remove
         * 当Store中的Record被移除后触发。
         * Fires when a Record has been removed from the Store
         * @param {Store} this
         * @param {Ext.data.Record} record 那个被移出的RecordThe Record that was removed
         * @param {Number} index 移出Record的索引。The index at which the record was removed
         */
        'remove',
        /**
         * @event update
         * 当有Record改动时触发。
         * Fires when a Record has been updated
         * @param {Store} this
         * @param {Ext.data.Record} record 那个被改动的Record。The Record that was updated
         * @param {String} operation 执行得改动操作。可以是以下的值：The update operation being performed.  Value may be one of:
         * <pre><code>
 Ext.data.Record.EDIT
 Ext.data.Record.REJECT
 Ext.data.Record.COMMIT
         * </code></pre>
         */
        'update',
        /**
         * @event clear
         * 当数据缓存被清除的时候触发。
         * Fires when the data cache has been cleared.
         * @param {Store} this
         */
        'clear',
        /**
         * @event beforeload
         * 当请求新的数据对象之前触发。如果beforeload返回false表示load的操作被取消。
         * Fires before a request is made for a new data object.  If the beforeload handler returns false
         * the load action will be canceled.
         * @param {Store} this
         * @param {Object} options 所指定的laoding操作（请参阅{@link #load}了解更多）。The loading options that were specified (see {@link #load} for details)
         */
        'beforeload',
        /**
         * @event load
         * 当一笔新的Record加载完毕后触发。
         * Fires after a new set of Records has been loaded.
         * @param {Store} this
         * @param {Ext.data.Record} records 加载好的Record（Ext.data.Record[]）。The Records that were loaded
         * @param {Object} options 所指定的laoding操作（请参阅{@link #load}了解更多）。The loading options that were specified (see {@link #load} for details)
         */
        'load',
        /**
         * @event loadexception
         * 当Proxy加载过程中有异常时触发。连同Proxy“loadexception”的事件一起触发。
         * Fires if an exception occurs in the Proxy during loading.
         * Called with the signature of the Proxy's "loadexception" event.
         */
        'loadexception'
    );

    if(this.proxy){
        this.relayEvents(this.proxy,  ["loadexception"]);
    }

    this.sortToggle = {};
    if(this.sortField){
        this.setDefaultSort(this.sortField, this.sortDir);
    }else if(this.sortInfo){
		this.setDefaultSort(this.sortInfo.field, this.sortInfo.direction);
	}

    Ext.data.Store.superclass.constructor.call(this);

    if(this.storeId || this.id){
        Ext.StoreMgr.register(this);
    }
    if(this.inlineData){
        this.loadData(this.inlineData);
        delete this.inlineData;
    }else if(this.autoLoad){
        this.load.defer(10, this, [
            typeof this.autoLoad == 'object' ?
                this.autoLoad : undefined]);
    }
};
Ext.extend(Ext.data.Store, Ext.util.Observable, {
    /**
    * @cfg {String} storeId 如果有值传入，该ID用于在StoreMgr登记时用。
    * storeId If passed, the id to use to register with the StoreMgr
    */
    /**
    * @cfg {String} url 如果有值传入，会为该URL创建一个HttpProxy对象。
    * url If passed, an HttpProxy is created for the passed URL
    */
    /**
    * @cfg {Boolean/Object} autoLoad 如果有值传入，那么store的load会自动调用，发生在autoLoaded对象创建之后。
    * autoLoad If passed, this store's load method is automatically called after creation with the autoLoad object
    */
    /**
    * @cfg {Ext.data.DataProxy} proxy Proxy对象，用于访问数据对象。
    * proxy The Proxy object which provides access to a data object.
    */
    /**
    * @cfg {Array} data 表示store初始化后，要加载的内联数据。
    * data Inline data to be loaded when the store is initialized.
    */
    /**
    * @cfg {Ext.data.DataReader} reader 处理数据对象的DataReader会返回一个Ext.data.Record对象的数组。其中的<em>id</em>属性会是一个缓冲了的键。
    * reader The DataReader object which processes the data object and returns
    * an Array of Ext.data.Record objects which are cached keyed by their <em>id</em> property.
    */
    /**
    * @cfg {Object} baseParams 每次HTTP请求都会带上这个参数，本来它是一个对象的形式，请求时会转化为参数的字符串。
    * baseParams An object containing properties which are to be sent as parameters
    * on any HTTP request
    */
    /**
    * @cfg {Object} sortInfo 如何排序的对象，格式如下：{field: "fieldName", direction: "ASC|DESC"}。排序方向的大小写敏感的。
    * sortInfo A config object in the format: {field: "fieldName", direction: "ASC|DESC"} to 
    * specify the sort order in the request of a remote Store's {@link #load} operation.  Note that for
    * local sorting, the direction property is case-sensitive.
    */
    /**
    * @cfg {boolean} remoteSort True表示在proxy配合下，要求服务器提供一个更新版本的数据对象以便排序，反之就是在Record缓存中排序（默认是false）。
    * remoteSort True if sorting is to be handled by requesting the
    * Proxy to provide a refreshed version of the data object in sorted order, as
    * opposed to sorting the Record cache in place (defaults to false).
    * <p>如果开启远程排序，那么点击头部时就会使当前页面向服务器请求排序，会有以下的参数：
    * If remote sorting is specified, then clicking on a column header causes the
    * current page to be requested from the server with the addition of the following
    * two parameters:
    * <div class="mdetail-params"><ul>
    * <li><b>sort</b> : String<p class="sub-desc">要排序的字段字符串（即在Record对象内的字段定义）
    * The name (as specified in
    * the Record's Field definition) of the field to sort on.</p></li>
    * <li><b>dir</b> : String<p class="sub-desc">排序的方向，“ASC”或“DESC”（一定要大写）
    * The direction of the sort, "ASC" or "DESC" (case-sensitive).</p></li>
    * </ul></div></p>
    */
    remoteSort : false,

    /**
    * @cfg {boolean} pruneModifiedRecords True表示为，每次Store加载后，清除所有修改过的记录信息；record被移除时也会这样（默认为false）。
    * pruneModifiedRecords True to clear all modified record information each time the store is
     * loaded or when a record is removed. (defaults to false).
    */
    pruneModifiedRecords : false,

    /**
     * 保存了上次load方法执行时，发出去的参数是什么。参阅{@link #load}了解这些是什么的参数。
     * 加载当前的Record缓存的时候，清楚用了哪些的参数有时是非常有用的。
     * Contains the last options object used as the parameter to the load method. See {@link #load}
     * for the details of what this may contain. This may be useful for accessing any params which
     * were used to load the current Record cache.
     * @type Object
     * @property lastOptions
     */
   lastOptions : null,

    destroy : function(){
        if(this.id){
            Ext.StoreMgr.unregister(this);
        }
        this.data = null;
        this.purgeListeners();
    },

    /**
     * 往Store对象添加Records，并触发{@link #add}事件。
     * Add Records to the Store and fires the {@link #add} event.
     * @param {Ext.data.Record} records 准备加入到缓存的Ext.data.Record对象数组（Ext.data.Record[]）。
     *  An Array of Ext.data.Record objects to add to the cache.
     */
    add : function(records){
        records = [].concat(records);
        if(records.length < 1){
            return;
        }
        for(var i = 0, len = records.length; i < len; i++){
            records[i].join(this);
        }
        var index = this.data.length;
        this.data.addAll(records);
        if(this.snapshot){
            this.snapshot.addAll(records);
        }
        this.fireEvent("add", this, records, index);
    },

    /**
     * （只限本地排序） 传入一个Record，按照队列（以固定的排序顺序）插入到Store对象中。
     * (Local sort only) Inserts the passed Record into the Store at the index where it
     * should go based on the current sort information.
     * @param {Ext.data.Record} record
     */
    addSorted : function(record){
        var index = this.findInsertIndex(record);
        this.insert(index, record);
    },

    /**
     * 从Store中移除一Record对象，并触发{@link #remove}移除事件。
     * Remove a Record from the Store and fires the {@link #remove} event.
     * @param {Ext.data.Record} record 被从缓存中移除的Ext.data.Record对象
     * record The Ext.data.Record object to remove from the cache.
     */
    remove : function(record){
        var index = this.data.indexOf(record);
        this.data.removeAt(index);
        if(this.pruneModifiedRecords){
            this.modified.remove(record);
        }
        if(this.snapshot){
            this.snapshot.remove(record);
        }
        this.fireEvent("remove", this, record, index);
    },
    
    /**
     * 根据指定的索引移除Store中的某个Record。
     * 触发{@link #remove}事件。
     * Remove a Record from the Store at the specified index. Fires the {@link #remove} event.
     * @param {Number} index 要被移除的Record索引。The index of the record to remove.
     */
    removeAt : function(index){
        this.remove(this.getAt(index));    
    },

    /**
     * 从Store中清空所有Record对象，并触发{@link #clear}事件。
     * Remove all Records from the Store and fires the {@link #clear} event.
     */
    removeAll : function(){
        this.data.clear();
        if(this.snapshot){
            this.snapshot.clear();
        }
        if(this.pruneModifiedRecords){
            this.modified = [];
        }
        this.fireEvent("clear", this);
    },

    /**
     * 触发添加事件时插入records到指定的store位置
     * Inserts Records into the Store at the given index and fires the {@link #add} event.
     * @param {Number} index 传入的Records插入的开始位置
     * index The start index at which to insert the passed Records.
     * @param {Ext.data.Record} records 加入到缓存中的Ext.data.Record对象（Ext.data.Record[]）。
     * records An Array of Ext.data.Record objects to add to the cache.
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
     * 传入一个记录，根据记录在缓存里查询的匹配的记录，返回其索引。
     * Get the index within the cache of the passed Record.
     * @param {Ext.data.Record} record 要找寻的Ext.data.Record
     * record The Ext.data.Record object to find.
     * @return {Number} 被传入的Record的索引，如果未找到返回-1
     * The index of the passed Record. Returns -1 if not found.
     */
    indexOf : function(record){
        return this.data.indexOf(record);
    },

    /**
     * 传入一个id，根据id查询缓存里的Record，返回其索引。
     * Get the index within the cache of the Record with the passed id.
     * @param {String} id  要找到Record的id
     * id The id of the Record to find.
     * @return {Number} 被找到的Record的索引，如果未找到返回-1
     * The index of the Record. Returns -1 if not found.
     */
    indexOfId : function(id){
        return this.data.indexOfKey(id);
    },

    /**
     * 根据指定的id找到Record。
     * Get the Record with the specified id.
     * @param {String} id 要找的Record的id
     * The id of the Record to find.
     * @return {Ext.data.Record} 返回匹配id的Record，如果未找到则返回undefined
     * The Record with the passed id. Returns undefined if not found.
     */
    getById : function(id){
        return this.data.key(id);
    },

    /**
     * 根据指定的索引找到Record。
     * Get the Record at the specified index.
     * @param {Number} index 要找的Record的索引
     * The index of the Record to find.
     * @return {Ext.data.Record} 返回匹配索引的Record，如果未找到则返回undefined
     * The Record at the passed index. Returns undefined if not found.
     */
    getAt : function(index){
        return this.data.itemAt(index);
    },

    /**
     * 查找指定范围里的Records。
     * Returns a range of Records between specified indices.
     * @param {Number} startIndex （可选项）开始索引 （默认为 0）
     * startIndex (optional) The starting index (defaults to 0)
     * @param {Number} endIndex （可选项）结束的索引 （默认是Store中最后一个Record的索引）
     * endIndex (optional) The ending index (defaults to the last Record in the Store)
     * @return {Ext.data.Record[]} 返回一个Record数组
     * An array of Records
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
     * 采用配置好的Reader格式去加载Record缓存，具体请求的任务由配置好的Proxy对象完成。
     * Loads the Record cache from the configured Proxy using the configured Reader.
     * <p>
     * 如果使用服务器分页，那么必须指定在options.params中<tt>start</tt>和<tt>limit</tt>两个参数。
     * start参数表明了从记录集（dataset）的哪一个位置开始读取，limit是读取多少笔的记录。Proxy负责送出参数。If using remote paging, then the first load call must specify the <tt>start</tt>
     * and <tt>limit</tt> properties in the options.params property to establish the initial
     * position within the dataset, and the number of Records to cache on each read from the Proxy.</p>
     * <p><b>
     * 由于采用了异步加载，因此该方法执行完毕后，数据不是按照load()方法下一个语句的顺序可以获取得到的。
     * 应该登记一个回调函数，或者“load”的事件，登记一个处理函数。
     * It is important to note that for remote data sources, loading is asynchronous,
     * and this call will return before the new data has been loaded. Perform any post-processing
     * in a callback function, or in a "load" event handler.</b></p>

     * @param {Object} options 传入以下属性的对象，传入的对象会影响加载的选项：An object containing properties which control loading options:<ul>
     * <li><b>params</b> :Object<p class="sub-desc">送出的HTTP参数，格式是JS对象。
     * An object containing properties to pass as HTTP parameters to a remote data source.</p></li>
     * <li><b>callback</b> : Function<p class="sub-desc">回调函数，这个函数会有以下的参数传入：A function to be called after the Records have been loaded. The callback is
     * passed the following arguments:<ul>
     * <li>r : Ext.data.Record[]</li>
     * <li>options: 加载的配置项对象。Options object from the load call</li>
     * <li>success: 是否成功。Boolean success indicator</li></ul></p></li>
     * <li><b>scope</b> : Object<p class="sub-desc">回调函数的作用域（默认为Store对象）。
     * Scope with which to call the callback (defaults to the Store object)</p></li>
     * <li><b>add</b> : Boolean<p class="sub-desc">表示到底是追加数据，还是替换数据。
     * Indicator to append loaded records rather than replace the current cache.</p></li>
     * </ul>
     * @return {Boolean} 是否执行了load（受beforeload的影响，参见源码）。Whether the load fired (if beforeload failed).
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
            return true;
        } else {
          return false;
        }
    },

    /**
     * 
     * <p>依据上一次的load操作的参数的Reader制订的格式，再一次向Proxy对象要求施以加载（Reload）Record缓存的操作。
     * Reloads the Record cache from the configured Proxy using the configured Reader and
     * the options from the last load operation performed.</p>
     * <p><b>
     * 由于采用了异步加载，因此该方法执行完毕后，数据不是按照load()方法下一个语句的顺序可以获取得到的。
     * 应该登记一个回调函数，或者“load”的事件，登记一个处理函数。
     * It is important to note that for remote data sources, loading is asynchronous,
     * and this call will return before the new data has been loaded. Perform any post-processing
     * in a callback function, or in a "load" event handler.</b></p>
     * @param {Object} options （可选的）该对象包含的属性会覆盖上次load操作的参数。参阅{@link #load}了解详细内容（默认为null，即就是复用上次的选项参数）。
     * (optional) An object containing loading options which may override the options
     * used in the last load operation. See {@link #load} for details (defaults to null, in which case
     * the most recently used options are reused).
     */
    reload : function(options){
        this.load(Ext.applyIf(options||{}, this.lastOptions));
    },

    // private
    // Called as a callback by the Reader during a load operation.
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
     * 从传入的数据块中装载数据，并触发{@link #load}事件。传入的数据格式是Reader必须能够读取理解的，Reader是在构造器中配置好的。
     * Loads data from a passed data block and fires the {@link #load} event. A Reader which understands the format of the data
     * must have been configured in the constructor.
     * @param {Object} data 要被转化为Records的数据块。数据类型会是由这个Reader的配置所决定的，并且符合Reader对象的readRecord参数的要求。
     * The data block from which to read the Records.  The format of the data expected
     * is dependent on the type of Reader that is configured and should correspond to that Reader's readRecords parameter.
     * @param {Boolean} add （可选的）True表示为是在缓存中追加新的Records而不是进行替换。
     * (Optional) True to add the new Records rather than replace the existing cache. 
     * <b>切记Store中的Record是按照{@link Ext.data.Record#id id}记录的，所以新加的Records如果id一样的话就会<i>替换</i>Stroe里面原有的，新的就会追加。
     * Remember that Records in a Store are keyed by their {@link Ext.data.Record#id id}, so added Records with ids which are already present in
     * the Store will <i>replace</i> existing Records. Records with new, unique ids will be added.</b>
     */
    loadData : function(o, append){
        var r = this.reader.readRecords(o);
        this.loadRecords(r, {add: append}, true);
    },

    /**
     * 获取缓存记录的总数。
     * Gets the number of cached records.
     * <p>如果使用了分页，那么这就是当前分页的总数，而不是全部记录的总数。
     * 要获取记录总数应使用{@link #getTotalCount}方法，才能从Reader身上获取正确的全部记录数。
     * If using paging, this may not be the total size of the dataset. If the data object
     * used by the Reader contains the dataset size, then the {@link #getTotalCount} function returns
     * the dataset size.</p>
     * @return {Number} Store缓存中记录总数
     * The number of Records in the Store's cache.
     */
    getCount : function(){
        return this.data.length || 0;
    },

    /**
     * 获取作为服务端返回的数据集中记录的总数。
     * Gets the total number of records in the dataset as returned by the server.
     * <p>如果分页，该值必须声明存在才能成功分页。Reader对象处理数据对象该值不能或缺。
     * 对于远程数据而言，这是有服务器查询的结果。
     * If using paging, for this to be accurate, the data object used by the Reader must contain
     * the dataset size. For remote data sources, this is provided by a query on the server.</p>
     * @return {Number} 数据对象由Proxy传给Reader对象，这个数据对象包含Record记录的总数
     * The number of Records as specified in the data object passed to the Reader
     * by the Proxy
     * <p><b>如果是在本地更新Store的内容，那么该值是不会发生变化的。
     * This value is not updated when changing the contents of the Store locally.</b></p>
     */
    getTotalCount : function(){
        return this.totalLength || 0;
    },

    /**
     * 以对象的形式返回当前排序的状态。
     * Returns an object describing the current sort state of this Store.
     * @return {Object} 当前排序的状态：它是一个对象，有以下两个属性：
     * The sort state of the Store. An object with two properties:<ul>
     * <li><b>field : String<p class="sub-desc">一个是排序字段
     * The name of the field by which the Records are sorted.</p></li>
     * <li><b>direction : String<p class="sub-desc">一个是排序方向，"ASC"或"DESC"
     * The sort order, "ASC" or "DESC" (case-sensitive).</p></li>
     * </ul>
     */
    getSortState : function(){
        return this.sortInfo;
    },

    // private
    applySort : function(){
        if(this.sortInfo && !this.remoteSort){
            var s = this.sortInfo, f = s.field;
            this.sortData(f, s.direction);
        }
    },

    // private
    sortData : function(f, direction){
        direction = direction || 'ASC';
        var st = this.fields.get(f).sortType;
        var fn = function(r1, r2){
            var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        };
        this.data.sort(direction, fn);
        if(this.snapshot && this.snapshot != this.data){
            this.snapshot.sort(direction, fn);
        }
    },

    /**
     * 设置默认的列排序，以便下次load操作时使用
     * Sets the default sort column and order to be used by the next load operation.
     * @param {String} fieldName 要排序的字段
     * The name of the field to sort by.
     * @param {String} dir （可选的） 排序顺序，“ASC”或“DESC”（默认为“ASC”）
     * (optional) The sort order, "ASC" or "DESC" (case-sensitive, defaults to "ASC")
     */
    setDefaultSort : function(field, dir){
        dir = dir ? dir.toUpperCase() : "ASC";
        this.sortInfo = {field: field, direction: dir};
        this.sortToggle[field] = dir;
    },

    /**
     * 对记录排序。
     * 如果使用远程排序，排序是在服务端中进行的，缓存就会重新加载；如果使用本地排序，缓存就会内部排序。
     * Sort the Records.
     * If remote sorting is used, the sort is performed on the server, and the cache is
     * reloaded. If local sorting is used, the cache is sorted internally.
     * @param {String} fieldName 要排序的字段的字符串。The name of the field to sort by.
     * @param {String} dir (optional) 排序方向，“ASC”或“DESC”（大小写敏感的，默认为“ASC”）。The sort order, "ASC" or "DESC" (case-sensitive, defaults to "ASC")
     */
    sort : function(fieldName, dir){
        var f = this.fields.get(fieldName);
        if(!f){
            return false;
        }
        if(!dir){
            if(this.sortInfo && this.sortInfo.field == f.name){ // toggle sort dir
                dir = (this.sortToggle[f.name] || "ASC").toggle("ASC", "DESC");
            }else{
                dir = f.sortDir;
            }
        }
        var st = (this.sortToggle) ? this.sortToggle[f.name] : null;
        var si = (this.sortInfo) ? this.sortInfo : null;

        this.sortToggle[f.name] = dir;
        this.sortInfo = {field: f.name, direction: dir};
        if(!this.remoteSort){
            this.applySort();
            this.fireEvent("datachanged", this);
        }else{
            if (!this.load(this.lastOptions)) {
                if (st) {
                    this.sortToggle[f.name] = st;
                }
                if (si) {
                    this.sortInfo = si;
                }
            }
        }
    },

    /**
     * 对缓存中每个记录调用特点的函数。
     * Calls the specified function for each of the Records in the cache.
     * @param {Function} fn 要调用的函数。Record对象将是第一个参数。如果返回
     * The function to call. The Record is passed as the first parameter.
     * Returning <tt>false</tt> aborts and exits the iteration.
     * @param {Object} scope 函数的作用域（默认为Record对象）（可选的）
     * (optional) The scope in which to call the function (defaults to the Record).
     */
    each : function(fn, scope){
        this.data.each(fn, scope);
    },

    /**
     * 距离上次提交之后，把所有修改过的、变化的记录收集起来。
     * 通过加载（load）的操作来持久化这些修改的记录。（例如在分页期间）
     * Gets all records modified since the last commit.  Modified records are persisted across load operations
     * (e.g., during paging).
     * @return {Ext.data.Record[]} 包含了显注修改的Record数组.
     * An array of Records containing outstanding modifications.
     */
    getModifiedRecords : function(){
        return this.modified;
    },

    // private
    createFilterFn : function(property, value, anyMatch, caseSensitive){
        if(Ext.isEmpty(value, false)){
            return false;
        }
        value = this.data.createValueMatcher(value, anyMatch, caseSensitive);
        return function(r){
            return value.test(r.data[property]);
        };
    },

    /**
     * 统计每个记录<i>属性</i>值的个数。可设置区间。
     * Sums the value of <i>property</i> for each record between start and end and returns the result.
     * @param {String} property 记录集中要统计的字段名称。A field on your records
     * @param {Number} start 计算的记录开始索引（默认为0）。start The record index to start at (defaults to 0)
     * @param {Number} end 计算的记录结尾索引（默认为length - 1，从零开始算）。The last record index to include (defaults to length - 1)
     * @return {Number} 总数 The sum
     * 
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
     * 由指定的属性筛选记录。
     * Filter the records by a specified property.
     * @param {String} field 要查询的字段。A field on your records
     * @param {String/RegExp} value 既可以是字段开头的字符串，也可以是针对该字段的正则表达式
     * value Either a string that the field should begin with, or a RegExp to test against the field.
     * @param {Boolean} anyMatch （可选的）True表示不一定要开头的，当中包含的亦可 
     * (optional) True to match any part not just the beginning
     * @param {Boolean} caseSensitive （可选的）True表示大小写敏感 
     * (optional) True for case sensitive comparison
     */
    filter : function(property, value, anyMatch, caseSensitive){
        var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
        return fn ? this.filterBy(fn) : this.clearFilter();
    },

    /**
     * 由外部函数进行筛选。Store里面的每个记录都经过这个函数内部使用。
     * 如果函数返回<tt>true</tt>的话，就引入（included）到匹配的结果集中，否则就会被过滤掉。
     * Filter by a function. The specified function will be called for each
     * Record in this Store. If the function returns <tt>true</tt> the Record is included,
     * otherwise it is filtered out.
     * @param {Function} fn 要执行的函数。它会被传入以下的参数：
     * The function to be called. It will be passed the following parameters:<ul>
     * <li><b>record</b> : Ext.data.Record<p class="sub-desc">The {@link Ext.data.Record record}
     * 对象用来测试过滤结果的。访问字段值就用{@link Ext.data.Record#get}方法。
     * to test for filtering. Access field values using {@link Ext.data.Record#get}.</p></li>
     * <li><b>id</b> : Object<p class="sub-desc">所传入的Record的ID
     * The ID of the Record passed.</p></li>
     * </ul>
     * @param {Object} scope （可选的）函数作用域（默认为this）。
     * (optional) The scope of the function (defaults to this)
     */
    filterBy : function(fn, scope){
        this.snapshot = this.snapshot || this.data;
        this.data = this.queryBy(fn, scope||this);
        this.fireEvent("datachanged", this);
    },

    /**
     * 由指定的属性查询记录。
     * Query the records by a specified property.
     * @param {String} field 要查询的字段。A field on your records
     * @param {String/RegExp} value 既可以是字段开头的字符串，也可以是针对该字段的正则表达式
     * Either a string that the field
     * should begin with, or a RegExp to test against the field.
     * @param {Boolean} anyMatch （可选的）True表示不一定要开头的，当中包含的亦可 
     * (optional) True to match any part not just the beginning
     * @param {Boolean} caseSensitive （可选的）True表示大小写敏感 
     * (optional) True for case sensitive comparison
     * @return {MixedCollection} 返回一个Ext.util.MixedCollection实例，包含了匹配的记录
     * Returns an Ext.util.MixedCollection of the matched records
     */
    query : function(property, value, anyMatch, caseSensitive){
        var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
        return fn ? this.queryBy(fn) : this.data.clone();
    },

    /**
     * 由外部函数进行该Store缓存记录的筛选。Store里面的每个记录都经过这个函数内部使用。
     * 如果函数返回<tt>true</tt>的话，就引入（included）到匹配的结果集中。
     * Query the cached records in this Store using a filtering function. The specified function
     * will be called with each record in this Store. If the function returns <tt>true</tt> the record is
     * included in the results.
     * @param {Function} fn 要执行的函数。它会被传入以下的参数：
     * The function to be called. It will be passed the following parameters:<ul>
     * <li><b>record</b> : Ext.data.Record<p class="sub-desc">The {@link Ext.data.Record record}
     * 对象用来测试过滤结果的。访问字段值就用{@link Ext.data.Record#get}方法。
     * to test for filtering. Access field values using {@link Ext.data.Record#get}.</p></li>
     * <li><b>id</b> : Object<p class="sub-desc">所传入的Record的ID
     * The ID of the Record passed.</p></li>
     * </ul>
     * @param {Object} scope （可选的）函数作用域（默认为this）
     * (optional) The scope of the function (defaults to this)
     * @return {MixedCollection} 返回一个Ext.util.MixedCollection实例，包含了匹配的记录
     * Returns an Ext.util.MixedCollection of the matched records
     **/
    queryBy : function(fn, scope){
        var data = this.snapshot || this.data;
        return data.filterBy(fn, scope||this);
    },

    /**
     * 由指定的属性、值来查询记录，返回的是记录的索引值。只考虑第一次匹配的结果。
     * Finds the index of the first matching record in this store by a specific property/value.
     * @param {String} property 你查询对象的属性
     * A property on your objects
     * @param {String/RegExp} value 既可以是字段开头的字符串，也可以是针对该字段的正则表达式
     * Either a string that the property value
     * should begin with, or a RegExp to test against the property.
     * @param {Number} startIndex （可选的） 查询的开始索引
     * (optional) The index to start searching at
     * @param {Boolean} anyMatch （可选的）True表示不一定要开头的，当中包含的亦可 
     * (optional) True to match any part of the string, not just the beginning
     * @param {Boolean} caseSensitive （可选的）True表示大小写敏感 
     * (optional) True for case sensitive comparison
     * @return {Number} 匹配的索引或-1 The matched index or -1
     */
    find : function(property, value, start, anyMatch, caseSensitive){
        var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
        return fn ? this.data.findIndexBy(fn, null, start) : -1;
    },

    /**
     * 由外部函数从某个索引开始进行筛选。只考虑第一次匹配的结果。
     * 如果函数返回<tt>true</tt>的话，就被认为是一个匹配的结果。
     * Find the index of the first matching Record in this Store by a function.
     * If the function returns <tt>true</tt> it is considered a match.
     * @param {Function} fn 要执行的函数。它会被传入以下的参数：The function to be called. It will be passed the following parameters:<ul>
     * <li><b>record</b> : Ext.data.Record<p class="sub-desc">{@link Ext.data.Record record}
     * 对象用来测试过滤结果的。访问字段值就用{@link Ext.data.Record#get}方法。The {@link Ext.data.Record record}
     * to test for filtering. Access field values using {@link Ext.data.Record#get}.</p></li>
     * <li><b>id</b> : Object<p class="sub-desc">所传入的Record的IDThe ID of the Record passed.</p></li>
     * </ul>
     * @param {Object} scope （可选的） 函数作用域（默认为this）(optional) The scope of the function (defaults to this)
     * @param {Number} startIndex （可选的） 查询的开始索引(optional) The index to start searching at
     * @return {Number} 匹配的索引或-1The matched index or -1
     */
    findBy : function(fn, scope, start){
        return this.data.findIndexBy(fn, scope, start);
    },

    /**
     * 从这个Store身上收集由dataIndex指定的惟一的值。
     * Collects unique values for a particular dataIndex from this store.
     * @param {String} dataIndex 要收集的属性The property to collect
     * @param {Boolean} allowNull （可选的） 送入true表示允许null、undefined或空白字符串这些无意义的值(optional) Pass true to allow null, undefined or empty string values
     * @param {Boolean} bypassFilter （可选的）送入true表示收集所有记录，哪怕是被经过筛选的记录(optional) Pass true to collect from all records, even ones which are filtered
     * @return {Array} 惟一的值所构成的数组An array of the unique values
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
     * 恢复到Record缓存的视图，这是没有经过筛选的Record。
     * Revert to a view of the Record cache with no filtering applied.
     * @param {Boolean} suppressEvent 如果设置为true，该筛选器会低调地清空，而不会通知监听器If true the filter is cleared silently without notifying listeners
     */
    clearFilter : function(suppressEvent){
        if(this.isFiltered()){
            this.data = this.snapshot;
            delete this.snapshot;
            if(suppressEvent !== true){
                this.fireEvent("datachanged", this);
            }
        }
    },

    /**
     * 返回true表明这个store当前是在筛选的。
     * Returns true if this store is currently filtered
     * @return {Boolean}
     */
    isFiltered : function(){
        return this.snapshot && this.snapshot != this.data;
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
     * 提交全部有变化的Record集。在实际处理这些更新的编码中，
     * 应该登记Store的“update”事件，事件的处理函数中的第三个参数就是Ext.data.Record.COMMIT，用它来进行更新。
     * Commit all Records with outstanding changes. To handle updates for changes, subscribe to the
     * Store's "update" event, and perform updating when the third parameter is Ext.data.Record.COMMIT.
     */
    commitChanges : function(){
        var m = this.modified.slice(0);
        this.modified = [];
        for(var i = 0, len = m.length; i < len; i++){
            m[i].commit();
        }
    },

    /**
     * 放弃所有的变更。
     * Cancel outstanding changes on all changed records.
     */
    rejectChanges : function(){
        var m = this.modified.slice(0);
        this.modified = [];
        for(var i = 0, len = m.length; i < len; i++){
            m[i].reject();
        }
    },

    // private
    onMetaChange : function(meta, rtype, o){
        this.recordType = rtype;
        this.fields = rtype.prototype.fields;
        delete this.snapshot;
        this.sortInfo = meta.sortInfo;
        this.modified = [];
        this.fireEvent('metachange', this, this.reader.meta);
    },

    // private
    findInsertIndex : function(record){
        this.suspendEvents();
        var data = this.data.clone();
        this.data.add(record);
        this.applySort();
        var index = this.data.indexOf(record);
        this.data = data;
        this.resumeEvents();
        return index;
    },

    setBaseParam : function (name, value){
        this.baseParams = this.baseParams || {};
        this.baseParams[name] = value;
    }
});

Ext.reg('store', Ext.data.Store);