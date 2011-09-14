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
 * @class Ext.util.Stateful
 * @extends Ext.util.Observable
 * 该类表示任意对象其数据都可以被存储的，主要透过{@link Ext.data.Proxy Proxy}来实现。
 * Ext.Model和Ext.View都几次于这个类，以便能够实现了记忆状态的功能
 * Represents any object whose data can be saved by a {@link Ext.data.Proxy Proxy}. Ext.Model
 * and Ext.View both inherit from this class as both can save state (Models save field state, 
 * Views save configuration)
 */
Ext.util.Stateful = Ext.extend(Ext.util.Observable, {
    
    /**
     * 内置的标记，用于跟踪模型实例当前是否正在编辑中。只读的。
     * Internal flag used to track whether or not the model instance is currently being edited. Read-only
     * @property editing
     * @type Boolean
     */
    editing : false,
    
    /**
     * 只读的标记——true表示为Record已经被修改了。
     * Readonly flag - true if this Record has been modified.
     * @type Boolean
     */
    dirty : false,
    
    /**
     * @cfg {String} persistanceProperty 持久化对象它的哪一个属性是保存的属性。默认为“data”，即表示所有可持久化的数据位于this.data。 The property on this Persistable object that its data is saved to.
     * Defaults to 'data' (e.g. all persistable data resides in this.data.)
     */
    persistanceProperty: 'data',
    
    constructor: function(config) {
        Ext.applyIf(this, {
            data: {}
        });        
        
        /**
         * 表示它的值经过修改过的全体字段的结对组。
         * Key: value pairs of all fields whose values have changed
         * @property modified
         * @type Object
         */
        this.modified = {};
        
        this[this.persistanceProperty] = {};
        
        Ext.util.Stateful.superclass.constructor.call(this, config);
    },
    
    /**
     * 指定字段获取其值。
     * Returns the value of the given field
     * @param {String} fieldName 要获取值得字段名称。The field to fetch the value for
     * @return {Mixed} 值。The value
     */
    get: function(field) {
        return this[this.persistanceProperty][field];
    },
    
    /**
     * 设置特定的字段为特定的值，使得实例为脏记录。
     * Sets the given field to the given value, marks the instance as dirty
     * @param {String|Object} fieldName 要设置的字段，或key/value的对象。The field to set, or an object containing key/value pairs
     * @param {Mixed} value 要设置的值。The value to set
     */
    set: function(fieldName, value) {
        var fields = this.fields,
            field, key;
        
        if (arguments.length == 1 && Ext.isObject(fieldName)) {
            for (key in fieldName) {
                if (!fieldName.hasOwnProperty(key)) {
                    continue;
                }
                this.set(key, fieldName[key]);
            }
        } else {
            if (fields) {
                field = fields.get(fieldName);
                
                if (field && field.convert) {
                    value = field.convert(value, this);
                }
            }
            
            this[this.persistanceProperty][fieldName] = value;

            this.dirty = true;

            if (!this.editing) {
                this.afterEdit();
            }
        }
    },
    
    /**
     * 已经创建模型或提交了模型，获取那些已经修改过的字段。
     * Gets a hash of only the fields that have been modified since this Model was created or commited.
     * @return Object
     */
    getChanges : function(){
        var modified = this.modified,
            changes  = {},
            field;
            
        for (field in modified) {
            if (modified.hasOwnProperty(field)){
                changes[field] = this[this.persistanceProperty][field];
            }
        }
        
        return changes;
    },
    
    /**
     * 返回true表示传入的字段从加载或上次提交起已经<code>{@link #modified}</code>。
     * Returns <tt>true</tt> if the passed field name has been <code>{@link #modified}</code>
     * since the load or last commit.
     * @param {String} fieldName {@link Ext.data.Field#name}
     * @return {Boolean}
     */
    isModified : function(fieldName) {
        return !!(this.modified && this.modified.hasOwnProperty(fieldName));
    },
    
    /**
     * <p>
     * 使得这个<b>记录</b>为<code>{@link #dirty}</code>脏记录。当添加影子<code>{@link #phantom}</code>记录到{@link Ext.data.Store#writer writer enabled store}的时候，内部会调用这个方法。
     * Marks this <b>Record</b> as <code>{@link #dirty}</code>.  This method
     * is used interally when adding <code>{@link #phantom}</code> records to a
     * {@link Ext.data.Store#writer writer enabled store}.</p>
     * <br><p>
     * 控制记录为<code>{@link #dirty}</code>会使得{@link Ext.data.Store#getModifiedRecords}返回影子
     * 记录，在{@link Ext.data.Store#save store save}操作进行期间组成一个创建的动作。
     * Marking a record <code>{@link #dirty}</code> causes the phantom to
     * be returned by {@link Ext.data.Store#getModifiedRecords} where it will
     * have a create action composed for it during {@link Ext.data.Store#save store save}
     * operations.</p>
     */
    setDirty : function() {
        this.dirty = true;
        
        if (!this.modified) {
            this.modified = {};
        }
        
        this.fields.each(function(field) {
            this.modified[field.name] = this[this.persistanceProperty][field.name];
        }, this);
    },
    
    //<debug>
    markDirty : function() {
        throw "Stateful: markDirty has been deprecated. Please use setDirty.";
    },
    //</debug>
    
    /**
     * 通常有其所在的模型实例的{@link Ext.data.Store}来调用。
     * 当模型实例创建或最后提交后，就会引起撤销所有变化。
     * <p>开发者应订阅{@link Ext.data.Store#update}事件以便能够通知撤销的操作。</p>
     * Usually called by the {@link Ext.data.Store} to which this model instance has been {@link #join joined}.
     * Rejects all changes made to the model instance since either creation, or the last commit operation.
     * Modified fields are reverted to their original values.
     * <p>Developers should subscribe to the {@link Ext.data.Store#update} event
     * to have their code notified of reject operations.</p>
     * @param {Boolean} silent （可选的）True表示为不通知所属的Store进行更改（默认为false）。(optional) True to skip notification of the owning
     * store of the change (defaults to false)
     */
    reject : function(silent) {
        var modified = this.modified,
            field;
            
        for (field in modified) {
            if (!modified.hasOwnProperty(field)) {
                continue;
            }
            if (typeof modified[field] != "function") {
                this[this.persistanceProperty][field] = modified[field];
            }
        }
        
        this.dirty = false;
        this.editing = false;
        delete this.modified;
        
        if (silent !== true) {
            this.afterReject();
        }
    },
    
    /**
     * 通常有其所在的模型实例的{@link Ext.data.Store}来调用。
     * 当模型实例创建或最后提交后，就会引起Commit所有变化。
     * <p>开发者应订阅{@link Ext.data.Store#update}事件以便能够通知提交的操作。</p>
     * Usually called by the {@link Ext.data.Store} which owns the model instance.
     * Commits all changes made to the instance since either creation or the last commit operation.
     * <p>Developers should subscribe to the {@link Ext.data.Store#update} event
     * to have their code notified of commit operations.</p>
     * @param {Boolean} silent （可选的）True表示为不通知所属的Store进行更改（默认为false）。(optional) True to skip notification of the owning
     * store of the change (defaults to false)
     */
    commit : function(silent) {
        this.dirty = false;
        this.editing = false;
        
        delete this.modified;
        
        if (silent !== true) {
            this.afterCommit();
        }
    },
    
    /**
     * 创建模型实例的拷贝 （克隆）。
     * Creates a copy (clone) of this Model instance.
     * @param {String} id （可选的）新id，默认是实例被拷贝的id。参阅(optional)<code>{@link #id}</code>。
     * 要生成影子实例，传人新id，采用如下方法：
     * A new id, defaults to the id
     * of the instance being copied. See <code>{@link #id}</code>. 
     * To generate a phantom instance with a new id use:<pre><code>
var rec = record.copy(); // 克隆record  clone the record
Ext.data.Model.id(rec); // 自动生成连续不同的id。automatically generate a unique sequential id
     * </code></pre>
     * @return {Record}
     */
    copy : function(newId) {
        return new this.constructor(Ext.apply({}, this[this.persistanceProperty]), newId || this.internalId);
    }
});