/**
* @class Ext.data.Record
 * Record类不但封装了Record的<em>相关定义</em>信息，还封装了在{@link Ext.data.Store}里使用的Recrod对象的值信息，
 * 并且在任何代码里需要访问Records的缓存{@link Ext.data.Store}的信息<br>
 * <p>
 * 该对象的静态方法{@link #create}会接受一个字段定义的数组参数来生成一个构造器。
 * 只当{@link Ext.data.Reader}处理未格式化的数据对象时，才会创建Record的实例。<br>
 * <p>
 * 该构建器不能被用来创建Record对象。取而代之的，是用{@link #create}方法生成的构建器。参数都是相同的。
 * @constructor
 * @param {Array} data 对象数组，提供了每一个Record实例所需的字段属性定义。
 * @param {Object} id （可选的）记录的id，应当是独一无二的。
 * {@link Ext.data.Store}会用这个id表示来标识记录里面的Record对象，如不指定就生成一个。
 */
Ext.data.Record = function(data, id){
    this.id = (id || id === 0) ? id : ++Ext.data.Record.AUTO_ID;
    this.data = data;
};

/**
 * 生成一个构造函数，该函数能产生符合特定规划的Record对象。
 * @param {Array} o 
 * 数组。各个字段的定义，包括字段名、数据类型（可选的）、映射项（用于在{@link Ext.data.Reader}的数据对象中提取真实的数据）。
 * 每一个字段的定义对象可包含以下的属性：<ul>
 * <li><b>name</b> : String<div class="sub-desc">Record对象所引用的字段名称。通常是一标识作它者引用，
 * 例如，在列定义中，该值会作为{@link Ext.grid.ColumnModel}的<em>dataIndex</em>属性。</div></li>
 * <li><b>mapping</b> : String<div class="sub-desc">（可选的） 如果使用的是{@link Ext.data.Reader}，这是一个Reader能够获取数据对象的数组值创建到Record对象下面的对应的映射项；
 * 如果使用的是{@link Ext.data.JsonReader}，那么这是一个javascript表达式的字符串，
 * 能够获取数据的引用到Record对象的下面；
 * 如果使用的是{@link Ext.data.XmlReader}，这是一个{@link Ext.DomQuery}路径，
 * 能够获取数据元素的引用到Record对象的下面；
 * 如果映射名与字段名都是相同的，那么映射名可以省略。
 * </div></li>
 * <li><b>type</b> : String<div class="sub-desc">（可选的） 指明数据类型，转化为可显示的值。有效值是：
 * <ul><li>auto （auto是默认的，不声明就用auto。不作转换）</li>
 * <li>string</li>
 * <li>int</li>
 * <li>float</li>
 * <li>boolean</li>
 * <li>date</li></ul></div></li>
 * <li><b>sortType</b> : Mixed<div class="sub-desc">（可选的） {@link Ext.data.SortTypes}的成语。</div></li>
 * <li><b>sortDir</b> : String<div class="sub-desc">（可选的） 初始化的排序方向，“ASC”或“DESC”。</div></li>
 * <li><b>convert</b> : Function<div class="sub-desc">（可选的） 由Reader提供的用于转换值的函数，将值变为Record下面的对象。它会送入以下的参数：<ul>
 * <li><b>v</b> : Mixed<div class="sub-desc">数据值，和Reader读取的一样。</div></li>
 * <li><b>rec</b> : Mixed<div class="sub-desc">包含行的数据对象，和Reader读取的一样。
 * 这可以是数组，对象，XML元素对象，这取决于Reader对象的类型。</div></li>
 * </ul></div></li>
 * <li><b>dateFormat</b> : String<div class="sub-desc">（可选的） 字符串格式的{@link Date#parseDate Date.parseDate}函数,
 * 或“timestamp”表示Reader读取UNIX格式的timestamp，或“time”是Reader读取的是javascript毫秒的timestamp。</div></li>
 * <li><b>defaultValue</b> : Mixed<div class="sub-desc">（可选的）默认值。<b>
 * 当经过{@link Ext.data.Reader Reader}创建Record时会使用该值；</b> 当<b><tt>mapping</tt></b>的引用项不存在的时候，典型的情况为undefined时候会使用该值（默认为''）
 * </div></li>
 * </ul>
 * 透过create方法会返回一个构造器的函数，这样就可以用来创建一个一个Record对象了。
 * 数据对象（在第一个参数上）一定要有一个属性，是名为<b>names</b>的属性，以说明是什么字段。
 * <br>用法：<br><pre><code>
var TopicRecord = Ext.data.Record.create([
    {name: 'title', mapping: 'topic_title'},
    {name: 'author', mapping: 'username'},
    {name: 'totalPosts', mapping: 'topic_replies', type: 'int'},
    {name: 'lastPost', mapping: 'post_time', type: 'date'},
    {name: 'lastPoster', mapping: 'user2'},
    {name: 'excerpt', mapping: 'post_text'}
]);

var myNewRecord = new TopicRecord({
    title: 'Do my job please',
    author: 'noobie',
    totalPosts: 1,
    lastPost: new Date(),
    lastPoster: 'Animal',
    excerpt: 'No way dude!'
});
myStore.add(myNewRecord);
</code></pre>
 * <p>
 * 简单地说，除了 <tt>name</tt>属性是必须的外，其他属性是可以不要的，因此，你只要传入一个字符串就可满足最低条件了，因为它就代表字段名称。</p>
 * @method create
 * @return {function} 根据定义创建新Records的构造器。
 * @static
 */
Ext.data.Record.create = function(o){
    var f = Ext.extend(Ext.data.Record, {});
	var p = f.prototype;
    p.fields = new Ext.util.MixedCollection(false, function(field){
        return field.name;
    });
    for(var i = 0, len = o.length; i < len; i++){
        p.fields.add(new Ext.data.Field(o[i]));
    }
    f.getField = function(name){
        return p.fields.get(name);
    };
    return f;
};

Ext.data.Record.AUTO_ID = 1000;
Ext.data.Record.EDIT = 'edit';
Ext.data.Record.REJECT = 'reject';
Ext.data.Record.COMMIT = 'commit';

Ext.data.Record.prototype = {
	/**
	 * Record的数据对象
	 * @property data
	 * @type {Object}
	 */
    /**
	 * 惟一的ID，在Record创建时分派此值。
	 * @property id
	 * @type {Object}
	 */
    /**
     * 只读。true表示为Record有修改。
     * @type Boolean
     */
    dirty : false,
    editing : false,
    error: null,
    /**
     * 
	 * 该对象保存了所有修改过的字段的原始值数据（键和值key and Value）。
	 * 如果没有字段被修改的话，该值是null。
	 * @property modified
	 * @type {Object}
	 */
    modified: null,

    // private
    join : function(store){
        this.store = store;
    },

    /**
     * 根据字段设置值。
     * @param {String} name 字段名称的字符串
     * @return {Object} 值
     */
    set : function(name, value){
        if(String(this.data[name]) == String(value)){
            return;
        }
        this.dirty = true;
        if(!this.modified){
            this.modified = {};
        }
        if(typeof this.modified[name] == 'undefined'){
            this.modified[name] = this.data[name];
        }
        this.data[name] = value;
        if(!this.editing && this.store){
            this.store.afterEdit(this);
        }
    },

    /**
     * 根据字段返回值。
     * @param {String} name 字段名称的字符串
     * @return {Object} 值
     */
    get : function(name){
        return this.data[name];
    },

    /**
     * 开始进入编辑。编辑期间，没有与所在的store任何关联的事件。
     */
    beginEdit : function(){
        this.editing = true;
        this.modified = {};
    },

    /**
     * 取消所有已修改过的数据。
     */
    cancelEdit : function(){
        this.editing = false;
        delete this.modified;
    },

    /**
     * 结束编辑。如数据有变动，则会通知所在的store。
     */
    endEdit : function(){
        this.editing = false;
        if(this.dirty && this.store){
            this.store.afterEdit(this);
        }
    },

    /**
     * 这个方法通常给Record对象所在的那个{@link Ext.data.Store}对象调用。
     * 创建Record、或上一次提交的操作都会使得Record对象执行reject撤销方法。
     * 原始值会变化为已修改的值。
     * <p>
     * 要根据提交（commit）操作而传达的通知，开发人员应该登记{@link Ext.data.Store#update}事件来编码来执行特定的撤销操作。</p>
     * @param {Boolean} silent （可选的）True表示不通知自身的store对象有所改变（默认为false）
     */
    reject : function(silent){
        var m = this.modified;
        for(var n in m){
            if(typeof m[n] != "function"){
                this.data[n] = m[n];
            }
        }
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(this.store && silent !== true){
            this.store.afterReject(this);
        }
    },

    /**
     * 这个方法通常给Record对象所在的那个{@link Ext.data.Store}对象调用。
     * 创建Record、或上一次提交的操作都会使得Record对象执行commit提交方法。
     * <p>
     * 要根据提交（commit）操作而传达的通知，开发人员应该登记{@link Ext.data.Store#update}事件来编码来执行特定的更新操作。</p>
     * @param {Boolean} silent （可选的） True表示不通知自身的store对象有所改变（默认为false）
     */
    commit : function(silent){
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(this.store && silent !== true){
            this.store.afterCommit(this);
        }
    },

    /**
     * 该对象被创建或提交之后，用来获取字段的哈希值（hash）
     * @return Object
     */
    getChanges : function(){
        var m = this.modified, cs = {};
        for(var n in m){
            if(m.hasOwnProperty(n)){
                cs[n] = this.data[n];
            }
        }
        return cs;
    },

    // private
    hasError : function(){
        return this.error != null;
    },

    // private
    clearError : function(){
        this.error = null;
    },

    /**
     * 创建记录的副本。
     * @param {String} id （可选的）创建新的ID如果你不想在ID上也雷同
     * @return {Record}
     */
    copy : function(newId) {
        return new this.constructor(Ext.apply({}, this.data), newId || this.id);
    },

    /**
     * 如果传入的字段是修改过的（load或上一次提交）就返回true。
     * @param {String} fieldName
     * @return {Boolean}
     */
    isModified : function(fieldName){
        return !!(this.modified && this.modified.hasOwnProperty(fieldName));
    }
};