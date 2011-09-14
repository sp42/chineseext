/**
 * @class Ext.data.Store
 * @extends Ext.util.Observable
 * Store类封装了一个客户端的{@link Ext.data.Record Record}对象的缓存，
 * 为诸如{@link Ext.grid.GridPanel GridPanel}、{@link Ext.form.ComboBox ComboBox}和{@link Ext.DataView DataView}的小部件等提供了数据的入口。<br>
 * <p>Store对象使用一个 {@link Ext.data.DataProxy DataProxy}的实现来访问数据对象，该Proxy对象在{@link #proxy configured}定义。不过你可以调用{@link #loadData}直接地传入你的数据.<br>
 * </p>
 * <p>A Store对没有Proxy返回数据格式的信息。</p>
 * <p>在{@link Ext.data.DataReader DataReader}实现的帮助下，从该类提供的数据对象来创建{@link Ext.data.Record Record}实例。
 * 你可在{@link #reader configured}指定这个DataReader对象。这些records都被缓存的并且通过访问器函数可利用到。</p>
 * @constructor
 * 创建Store对象。
 * @param {Object} config 一配置对象，包含了Store用来访问数据，及读数据至Records的对象。（原文：A config object containing the objects needed for the Store to access data,
 * and read the data into Records）
 */
Ext.data.Store = function(config){
    this.data = new Ext.util.MixedCollection(false);
    this.data.getKey = function(o){
        return o.id;
    };
    /**
     * 该属性是HTTP请求所携带的参数。如果Store的参数有改变那么这个属性也会改变。
     * @property
     */
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
         * 
         * Fires when the data cache has changed in a bulk manner (e.g., it has been sorted, filtered, etc.) and a 
         * widget that is using this Store as a Record cache should refresh its view.
         * @param {Store} this
         */
        'datachanged',
        
         /**
         * @event metachange
         * 当store的reader 提供新的元数据字段时触发。这目前仅支持jsonReader。
         * @param {Store} this
         * @param {Object} meta JSON元数据
         */
        'metachange',

        /**
         * @event add
         * 当Records被添加到store时触发。
         * @param {Store} this
         * @param {Ext.data.Record[]} records The 要被加入的Record数组
         * @param {Number} index 被添加进去的record的索引
         */
        'add',
        
        /**
         * @event remove
         * 当一个record被从store里移出时触发。
         * @param {Store} this
         * @param {Ext.data.Record} record 被移出的对Record象
         * @param {Number} index 被移出的record的索引值
         */
        'remove',
        
        /**
         * @event update
         * 当有record被更新时触发。
         * @param {Store} this
         * @param {Ext.data.Record} record 被更新的记录
         * @param {String} operation 将要执行的更新操作。可能是下列值:
         * <pre><code>
			 Ext.data.Record.EDIT
			 Ext.data.Record.REJECT
			 Ext.data.Record.COMMIT
         * </code></pre>
         */
        'update',
        
        /**
         * @event clear
         * 当数据缓存被清除时触发。
         * @param {Store} this
         */
        'clear',
        
        /**
         * @event beforeload
         * 在一个新的数据请求发起之前触发，如果beforeload事件处理函数返回false。加载动作将会被取消。
         * @param {Store} this
         * @param {Object} options 指定的loading选项（从 {@link #load} 查看更多细节）
         */
        'beforeload',
        
        /**
         * @event load
         * 在一个新的数据集被加载之后触发该事件
         * @param {Store} this
         * @param {Ext.data.Record[]} records 被载入的记录集
         * @param {Object} options The 指定的loading选项（从 {@link #load} 查看更多细节）
         */
        'load',
        
        /**
         * @event loadexception
         * 到Proxy对象进行加载的时候，遇到异常随即会触发该事件。这是与Proxy的“loadexception”事件一起联动的。
         */
        'loadexception'
    );

    if(this.proxy){
        this.relayEvents(this.proxy,  ["loadexception"]);
    }

    this.sortToggle = {};
	if(this.sortInfo){
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
    */
   /**
    * @cfg {String} url 如果有值传入，会为该URL创建一个HttpProxy对象。
    */
   /**
    * @cfg {Boolean/Object} autoLoad 如果有值传入，那么store的load会自动调用，发生在autoLoaded对象创建之后。
    */
    /**
    * @cfg {Ext.data.DataProxy} proxy Proxy对象，用于访问数据对象。
    */
   /**
    * @cfg {Array} data 表示store初始化后，要加载的内联数据。
    */
   /**
    * @cfg {Ext.data.DataReader} reader 
    * 处理数据对象的DataReader会返回一个Ext.data.Record对象的数组。其中的<em>id</em>属性会是一个缓冲了的键。
    * （原文：The DataReader object which processes the data object and returns an Array of Ext.data.Record objects which are cached keyed by their  property.）
    */
   /**
    * @cfg {Object} baseParams 每次HTTP请求都会带上这个参数，本来它是一个对象的形式，请求时会转化为参数的字符串。
    */
   /**
    * @cfg {Object} sortInfo 如何排序的对象，格式如下：{field: "fieldName", direction: "ASC|DESC"}。排序方向的大小写敏感的。
    */
   /**
    * @cfg {boolean} remoteSort True表示在roxy配合下，要求服务器提供一个更新版本的数据对象以便排序，反之就是在Record缓存中排序（默认是false）。
    * <p>
    * 如果开启远程排序，那么点击头部时就会使当前页面向服务器请求排序，会有以下的参数：
    * <div class="mdetail-params"><ul>
    * <li><b>sort</b> : String<p class="sub-desc">要排序的字段字符串（即 在Record对象内的字段定义）</p></li>
    * <li><b>dir</b> : String<p class="sub-desc">排序的方向，“ASC”或“DESC”（一定要大写）</p></li>
    * </ul></div></p>
    */
    remoteSort : false,

    /**
    * @cfg {boolean} pruneModifiedRecords True表示为，每次Store加载后，清除所有修改过的记录信息；record被移除时也会这样（默认为false）。
    */
    pruneModifiedRecords : false,

    /**
     * 保存了上次load方法执行时，发出去的参数是什么。参阅{@link #load}了解这些是什么的参数。
     * 加载当前的Record缓存的时候，清楚用了哪些的参数有时是非常有用的。
     * @property
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
     * @param {Ext.data.Record[]} records Ext.data.Record对象数组，在缓存中
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
     * @param {Ext.data.Record} record
     */
    addSorted : function(record){
        var index = this.findInsertIndex(record);
        this.insert(index, record);
    },
    
    /**
     * 从Store中移除一Record对象，并触发{@link #remove}移除事件。
     * @param {Ext.data.Record} record 被从缓存中移除的Ext.data.Record对象
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
     * 从Store中清空所有Record对象，并触发{@link #clear}事件。
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
     * @param {Number} index 传入的Records插入的开始位置
     * @param {Ext.data.Record[]} records 加入到缓存中的Ext.data.Record对象
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
     * @param {Ext.data.Record} record 要找寻的Ext.data.Record
     * @return {Number} 被传入的Record的索引，如果未找到返回-1
     */
    indexOf : function(record){
        return this.data.indexOf(record);
    },

    /**
     * 传入一个id，根据id查询缓存里的Record，返回其索引。
     * @param {String} id  要找到Record的id
     * @return {Number} 被找到的Record的索引，如果未找到返回-1
     */
    indexOfId : function(id){
        return this.data.indexOfKey(id);
    },
    
    /**
     * 根据指定的id找到Record。
     * @param {String} id 要找的Record的id
     * @return {Ext.data.Record} 返回匹配id的Record，如果未找到则返回undefined
     */
    getById : function(id){
        return this.data.key(id);
    },

    /**
     * 根据指定的索引找到Record。
     * @param {Number} index 要找的Record的索引
     * @return {Ext.data.Record} 返回匹配索引的Record，如果未找到则返回undefined
     */
    getAt : function(index){
        return this.data.itemAt(index);
    },
    
    /**
     * 查找指定范围里的Records。
     * @param {Number} startIndex （可选项）开始索引 （默认为 0）
     * @param {Number} endIndex （可选项）结束的索引 （默认是Store中最后一个Record的索引）
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
     * 采用配置好的Reader格式去加载Record缓存，具体请求的任务由配置好的Proxy对象完成。
     * <p>如果使用服务器分页，那么必须指定在options.params中<tt>start</tt>和<tt>limit</tt>两个参数。
     * start参数表明了从记录集（dataset）的哪一个位置开始读取，limit是读取多少笔的记录。Proxy负责送出参数。
     * </p>
     * <p><b>
     * 由于采用了异步加载，因此该方法执行完毕后，数据不是按照load()方法下一个语句的顺序可以获取得到的。
     * 应该登记一个回调函数，或者“load”的事件，登记一个处理函数</b></p>
     * @param {Object} options 传入以下属性的对象，或影响加载的选项：<ul>
     * <li><b>params</b> :Object<p class="sub-desc">送出的HTTP参数，格式是JS对象</p></li>
     * <li><b>callback</b> : Function<p class="sub-desc">回调函数，这个函数会有以下的参数传入：<ul>
     * <li>r : Ext.data.Record[]</li>
     * <li>options: Options 加载的选项</li>
     * <li>success: Boolean 是否成功</li></ul></p></li>
     * <li><b>scope</b> : Object<p class="sub-desc">回调函数的作用域（默认为Store对象）</p></li>
     * <li><b>add</b> : Boolean<p class="sub-desc">表示到底是追加数据，还是替换数据</p></li>
     * </ul>
     * @return {Boolean} load是否执行了（受beforeload的影响，参见源码）
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
     * 依据上一次的load操作的参数的Reader制订的格式，再一次向Proxy对象要求施以加载（Reload）Record缓存的操作。
     * @param {Object} options （可选的）该对象包含的属性会覆盖上次load操作的参数。参阅{@link #load}了解详细内容（默认为null，即就是复用上次的选项参数）。
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
     * 从传入的数据块中装载数据，并触发{@link #load}事件。传入的数据格式是Reader必须能够读取理解的，Reader是在构造器
     * 中配置好的。
     * @param {Object} data 要被转化为Records的数据块。数据类型会是由这个Reader的配置所决定的，并且符合Reader对象的readRecord参数的要求。
     * @param {Boolean} add (Optional) True表示为是在缓存中追加新的Records而不是进行替换。<b>
     * 切记Store中的Record是按照{@link Ext.data.Record#id id}记录的，所以新加的Records如果id一样的话就会<i>替换</i>Stroe里面原有的，新的就会追加。
     * </b>
     */
    loadData : function(o, append){
        var r = this.reader.readRecords(o);
        this.loadRecords(r, {add: append}, true);
    },

    /**
     * <p>如果使用了分页，那么这就是当前分页的总数，而不是全部记录的总数。
     * 要获取记录总数应使用{@link #getTotalCount}方法，才能从Reader身上获取正确的全部记录数。</p>
     * @return {Number} Store缓存中记录总数
     */
    getCount : function(){
        return this.data.length || 0;
    },

    /**
     * 获取作为服务端返回的数据集中记录的总数。
     * <p>
     * 如果分页，该值必须声明存在才能成功分页。Reader对象处理数据对象该值不能或缺。
     * 对于远程数据而言，这是有服务器查询的结果。</p>
     * @return {Number} 数据对象由Proxy传给Reader对象，这个数据对象包含Record记录的总数
     * <p><b>如果是在本地更新Store的内容，那么该值是不会发生变化的。</b></p>
     */
    getTotalCount : function(){
        return this.totalLength || 0;
    },

    /**
     * 以对象的形式返回当前排序的状态。
     * @return {Object} 当前排序的状态：它是一个对象，有以下两个属性：<ul>
     * <li><b>field : String<p class="sub-desc"> 一个是排序字段</p></li>
     * <li><b>direction : String<p class="sub-desc">一个是排序方向，"ASC"或"DESC" （一定要大写）</p></li>
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
     * @param {String} fieldName 要排序的字段
     * @param {String} dir （可选的） 排序顺序，“ASC”或“DESC”（默认为“ASC”）
     */
    setDefaultSort : function(field, dir){
        dir = dir ? dir.toUpperCase() : "ASC";
        this.sortInfo = {field: field, direction: dir};
        this.sortToggle[field] = dir;
    },

    /**
     * 对记录排序。
     * 如果使用远程排序，排序是在服务端中进行的，缓存就会重新加载；如果使用本地排序，缓存就会内部排序。
     * @param {String} fieldName 要排序的字段的字符串
     * @param {String} dir (optional) 排序方向，“ASC”或“DESC”（大小写敏感的，默认为“ASC”）
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
     * @param {Function} fn 要调用的函数。Record对象将是第一个参数。如果返回<tt>false</tt>就中止或推出循环。
     * @param {Object} scope 函数的作用域（默认为Record对象）（可选的）
     */
    each : function(fn, scope){
        this.data.each(fn, scope);
    },

    /**
     * 距离上次提交之后，把所有修改过的、变化的记录收集起来。
     * 通过加载（load）的操作来持久化这些修改的记录。（例如在分页期间）
     * @return {Ext.data.Record[]} 包含了显注修改的Record数组.
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
     * Sums the value of <i>property</i> for each record between start and end and returns the result.
     * @param {String} property 记录集中要统计的字段名称
     * @param {Number} start 计算的记录开始索引（默认为0）
     * @param {Number} end 计算的记录结尾索引（默认为length - 1，从零开始算）
     * @return {Number} 总数
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
     * @param {String} field 你查询的字段
     * @param {String/RegExp} value 既可以是字段开头的字符串，也可以是针对该字段的正则表达式
     * @param {Boolean} anyMatch （可选的）True表示不一定要开头的，当中包含的亦可 
     * @param {Boolean} caseSensitive （可选的）True表示大小写敏感 
     */
    filter : function(property, value, anyMatch, caseSensitive){
        var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
        return fn ? this.filterBy(fn) : this.clearFilter();
    },

    /**
     * 由外部函数进行筛选。Store里面的每个记录都经过这个函数内部使用。
     * 如果函数返回<tt>true</tt>的话，就引入（included）到匹配的结果集中，否则就会被过滤掉。
     * @param {Function} fn 要执行的函数。它会被传入以下的参数：<ul>
     * <li><b>record</b> : Ext.data.Record<p class="sub-desc"> {@link Ext.data.Record record}
     * 对象用来测试过滤结果的。访问字段值就用{@link Ext.data.Record#get}方法。</p></li>
     * <li><b>id</b> : Object<p class="sub-desc">所传入的Record的ID</p></li>
     * </ul>
     * @param {Object} scope （可选的）函数作用域（默认为this）
     */
    filterBy : function(fn, scope){
        this.snapshot = this.snapshot || this.data;
        this.data = this.queryBy(fn, scope||this);
        this.fireEvent("datachanged", this);
    },

    /**
     * 由指定的属性查询记录。
     * @param {String} field 你查询的字段
     * @param {String/RegExp} value 既可以是字段开头的字符串，也可以是针对该字段的正则表达式
     * @param {Boolean} anyMatch （可选的）True表示不一定要开头的，当中包含的亦可 
     * @param {Boolean} caseSensitive （可选的）True表示大小写敏感 
     * @return {MixedCollection} 返回一个Ext.util.MixedCollection实例，包含了匹配的记录
     */
    query : function(property, value, anyMatch, caseSensitive){
        var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
        return fn ? this.queryBy(fn) : this.data.clone();
    },

    /**
     * 由外部函数进行该Store缓存记录的筛选。Store里面的每个记录都经过这个函数内部使用。
     * 如果函数返回<tt>true</tt>的话，就引入（included）到匹配的结果集中。
     * @param {Function} fn 要执行的函数。它会被传入以下的参数：<ul>
     * <li><b>record</b> : Ext.data.Record<p class="sub-desc"> {@link Ext.data.Record record}
     * 对象用来测试过滤结果的。访问字段值就用{@link Ext.data.Record#get}方法。</p></li>
     * <li><b>id</b> : Object<p class="sub-desc">所传入的Record的ID</p></li>
     * </ul>
     * @param {Object} scope （可选的）函数作用域（默认为this）
     * @return {MixedCollection} 返回一个Ext.util.MixedCollection实例，包含了匹配的记录
     */
    queryBy : function(fn, scope){
        var data = this.snapshot || this.data;
        return data.filterBy(fn, scope||this);
    },

    /**
     * 由指定的属性、值来查询记录，返回的是记录的索引值。只考虑第一次匹配的结果。
     * @param {String} property 你查询对象的属性
     * @param {String/RegExp} value 既可以是字段开头的字符串，也可以是针对该字段的正则表达式
     * @param {Number} startIndex （可选的） 查询的开始索引
     * @param {Boolean} anyMatch （可选的）True表示不一定要开头的，当中包含的亦可 
     * @param {Boolean} caseSensitive （可选的）True表示大小写敏感 
     * @return {Number} 匹配的索引或-1
     */
    find : function(property, value, start, anyMatch, caseSensitive){
        var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
        return fn ? this.data.findIndexBy(fn, null, start) : -1;
    },

    /**
     * 由外部函数从某个索引开始进行筛选。只考虑第一次匹配的结果。
     * 如果函数返回<tt>true</tt>的话，就被认为是一个匹配的结果。
     * @param {Function} fn 要执行的函数。它会被传入以下的参数：<ul>
     * <li><b>record</b> : Ext.data.Record<p class="sub-desc"> {@link Ext.data.Record record}
     * 对象用来测试过滤结果的。访问字段值就用{@link Ext.data.Record#get}方法。</p></li>
     * <li><b>id</b> : Object<p class="sub-desc">所传入的Record的ID</p></li>
     * </ul>
     * @param {Object} scope （可选的） 函数作用域（默认为this）
     * @param {Number} startIndex （可选的） 查询的开始索引
     * @return {Number} 匹配的索引或-1
     */
    findBy : function(fn, scope, start){
        return this.data.findIndexBy(fn, scope, start);
    },

    /**
     * 从这个Store身上收集由dataIndex指定的惟一的值。
     * @param {String} dataIndex 要收集的属性
     * @param {Boolean} allowNull （可选的） 送入true表示允许null、undefined或空白字符串这些无意义的值
     * @param {Boolean} bypassFilter （可选的）送入true表示收集所有记录，哪怕是被经过筛选的记录
     * @return {Array} 惟一值的数组
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
     * @param {Boolean} suppressEvent 如果设置为true，该筛选器会低调地清空，而不会通知监听器
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
    }
});