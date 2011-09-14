/*
 * @version Sencha 1.0RC-1
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */

/**
 * @class Ext.StoreMgr
 * @extends Ext.util.MixedCollection
 * store组管理器。这是全局的、并且是缺省的。<br />
 * The default global group of stores.
 * @singleton
 * TODO: Make this an AbstractMgr
 */
Ext.StoreMgr = Ext.apply(new Ext.util.MixedCollection(), {
    /**
     * @cfg {Object} listeners @hide
     */


    /**
     * 登记更多的Store对象到StoreMgr。一般情况下你不需要手动加入。任何透过{@link Ext.data.Store#storeId}初始化的Store都会自动登记。
     * Registers one or more Stores with the StoreMgr. You do not normally need to register stores
     * manually.  Any store initialized with a {@link Ext.data.Store#storeId} will be auto-registered. 
     * @param {Ext.data.Store} store1 A Store instance
     * @param {Ext.data.Store} store2 (optional)
     * @param {Ext.data.Store} etc... (optional)
     */
    register : function() {
        for (var i = 0, s; (s = arguments[i]); i++) {
            this.add(s);
        }
    },

    /**
     * 注销一个或多个Stores。
     * Unregisters one or more Stores with the StoreMgr
     * @param {String/Object} id1 Store的id或是Store对象The id of the Store, or a Store instance
     * @param {String/Object} id2 （可选的）Store实例2。(optional)
     * @param {String/Object} etc... （可选的）Store实例x……。(optional)
     */

    unregister : function() {
        for (var i = 0, s; (s = arguments[i]); i++) {
            this.remove(this.lookup(s));
        }
    },

    /**
     * 由id返回一个已登记的Store。
     * Gets a registered Store by id
     * @param {String/Object} id Store的id或是Store对象。The id of the Store, or a Store instance
     * @return {Ext.data.Store}
     */
    lookup : function(id) {
        if (Ext.isArray(id)) {
            var fields = ['field1'], expand = !Ext.isArray(id[0]);
            if(!expand){
                for(var i = 2, len = id[0].length; i <= len; ++i){
                    fields.push('field' + i);
                }
            }
            return new Ext.data.ArrayStore({
                data  : id,
                fields: fields,
                expandData : expand,
                autoDestroy: true,
                autoCreated: true
            });
        }
        return Ext.isObject(id) ? (id.events ? id : Ext.create(id, 'store')) : this.get(id);
    },

    // getKey implementation for MixedCollection
    getKey : function(o) {
         return o.storeId;
    }
});

/**
 * <p>
 * 指定id和配置项创建新的Store，并将其登记到{@link Ext.StoreMgr Store Mananger}。
 * Creates a new store for the given id and config, then registers it with the {@link Ext.StoreMgr Store Mananger}. 
 * 简单用法：Sample usage:</p>
<pre><code>
Ext.regStore('AllUsers', {
    model: 'User'
});

// 这样Store很容易与UI作整合。the store can now easily be used throughout the application
new Ext.List({
    store: 'AllUsers',
    ... other config
});
</code></pre>
 * @param {String} id 新Store它的id。The id to set on the new store
 * @param {Object} config Store的配置项。The store config
 * @param {Constructor} cls 新组件？？The new Component class.
 * @member Ext
 * @method regStore
 */
Ext.regStore = function(name, config) {
    var store;

    if (Ext.isObject(name)) {
        config = name;
    } else {
        config.storeId = name;
    }

    if (config instanceof Ext.data.Store) {
        store = config;
    } else {
        store = new Ext.data.Store(config);
    }

    return Ext.StoreMgr.register(store);
};

/**
 * 返回已注册的Store（简写方式为{@link #lookup}）
 * Gets a registered Store by id (shortcut to {@link #lookup})
 * @param {String/Object} id Stroe的Id，Store实例亦可。The id of the Store, or a Store instance
 * @return {Ext.data.Store}
 * @member Ext
 * @method getStore
 */
Ext.getStore = function(name) {
    return Ext.StoreMgr.lookup(name);
};
