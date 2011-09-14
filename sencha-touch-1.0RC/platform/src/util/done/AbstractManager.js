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
 * @class Ext.AbstractManager
 * @extends Object
 * @ignore
 * 管理器基类。给ComponentMgr或PluginMgr等的类来扩展。
 * Base Manager class - extended by ComponentMgr and PluginMgr
 */
Ext.AbstractManager = Ext.extend(Object, {
    typeName: 'type',

    constructor: function(config) {
        Ext.apply(this, config || {});

        /**
         * 为组件缓存所使用的MixedCollection。可在这个MixedCollection中加入相应的事件，监视增加或移除的情况。只读的。
         * Contains all of the items currently managed
         * @property all
         * @type Ext.util.MixedCollection
         */
        this.all = new Ext.util.MixedCollection();

        this.types = {};
    },

    /**
     * 由{@link Ext.Component#id id}返回组件。更多细节请参阅{@link Ext.util.MixedCollection#get}。
     * Returns a component by {@link Ext.Component#id id}.
     * For additional details see {@link Ext.util.MixedCollection#get}.
     * @param {String} id 组件 {@link Ext.Component#id id}。The component {@link Ext.Component#id id}
     * @return Ext.Component 如果找不到返回<code>undefined</code>,如果找到返回<code>null</code>。The Component, <code>undefined</code> if not found, or <code>null</code> if a
     * Class was found.
     */
    get : function(id) {
        return this.all.get(id);
    },

    /**
     * 注册一个组件。Registers an item to be managed
     * @param {Mixed} item 要注册的内容。The item to register
     */
    register: function(item) {
        this.all.add(item);
    },

    /**
     * 撤消登记一个组件。
     * Unregisters a component by removing it from this manager
     * @param {Mixed} item 要撤消的内容。The item to unregister
     */
    unregister: function(item) {
        this.all.remove(item);
    },

    /**
     * <p>
     * 输入新的{@link Ext.Component#xtype}，登记一个新组件的构造器。
     * Registers a new Component constructor, keyed by a new
     * {@link Ext.Component#xtype}.</p>
     * <p>
     * 使用该方法（或其简写方式{@link Ext#reg Ext.reg}）登记{@link Ext.Component}的子类以便当指定子组件的xtype时即可延时加载（lazy instantiation）。
     * 请参阅{@link Ext.Container#items}。
     * Use this method (or its alias {@link Ext#reg Ext.reg}) to register new
     * subclasses of {@link Ext.Component} so that lazy instantiation may be used when specifying
     * child Components.
     * see {@link Ext.Container#items}</p>
     * @param {String} xtype 组件类的标识字符串。The mnemonic string by which the Component class may be looked up.
     * @param {Constructor} cls 新的组件类。The new Component class.
     */
    registerType : function(type, cls) {
        this.types[type] = cls;
        cls[this.typeName] = type;
    },

    /**
     * 简单这个组件是否已注册。
     * Checks if a Component type is registered.
     * @param {Ext.Component} xtype 组建类对应的字符串。The mnemonic string by which the Component class may be looked up
     * @return {Boolean} 是否注册。Whether the type is registered.
     */
    isRegistered : function(type){
        return this.types[type] !== undefined;
    },

    /**
     * 告诉需要哪个组建的{@link Ext.component#xtype xtype}，添加适合的配置项对象，就创建新的Component，实际上返回这个类的实例。
     * Creates and returns an instance of whatever this manager manages, based on the supplied type and config object
     * @param {Object} config 你打算创建组件的配置项对象。The config object
     * @param {String} defaultType 如果第一个参数不包含组件的xtype就在第二个参数中指定，作为默认的组件类型。（如果第一个参数已经有的话这个参数就可选吧）。
     * If no type is discovered in the config object, we fall back to this type
     * @return {Mixed} 刚实例化的组件。The instance of whatever this manager is managing
     */
    create: function(config, defaultType) {
        var type        = config[this.typeName] || config.type || defaultType,
            Constructor = this.types[type];

        if (Constructor == undefined) {
            throw new Error(Ext.util.Format.format("The '{0}' type has not been registered with this manager", type));
        }

        return new Constructor(config);
    },

    /**
     * 当指定组件被加入到ComponentMgr时调用的函数。
     * Registers a function that will be called when a Component with the specified id is added to the manager. This will happen on instantiation.
     * @param {String} id 组件{@link Ext.Component#id id}。The component {@link Ext.Component#id id}
     * @param {Function} fn  回调函数。The callback function
     * @param {Object} scope 回调的作用域。指定<code>this</code>引用，默认为该组件。The scope (<code>this</code> reference) in which the callback is executed. Defaults to the Component.
     */
    onAvailable : function(id, fn, scope){
        var all = this.all;

        all.on("add", function(index, o){
            if (o.id == id) {
                fn.call(scope || o, o);
                all.un("add", fn, scope);
            }
        });
    }
});
