/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.StoreMgr
 * @extends Ext.util.MixedCollection
 * store组管理器。这是全局的、并且是缺省的。<br />
 * The default global group of stores.
 * @singleton
 */
Ext.StoreMgr = Ext.apply(new Ext.util.MixedCollection(), {
    /**
     * @cfg {Object} listeners @hide
     */

    /**
     * 登记更多的Store对象到StoreMgr。一般情况下你不需要手动加入。任何透过{@link Ext.data.Store#storeId}初始化的Store都会自动登记。
     * Registers one or more Stores with the StoreMgr. You do not normally need to register stores
     * manually.  Any store initialized with a {@link Ext.data.Store#storeId} will be auto-registered. 
     * @param {Ext.data.Store} store1 Store实例。A Store instance
     * @param {Ext.data.Store} store2 （可选的）Store实例2。(optional)
     * @param {Ext.data.Store} etc... （可选的）Store实例x……。(optional)
     */
    register : function(){
        for(var i = 0, s; s = arguments[i]; i++){
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
    unregister : function(){
        for(var i = 0, s; s = arguments[i]; i++){
            this.remove(this.lookup(s));
        }
    },

    /**
     * 由id返回一个已登记的Store。
     * Gets a registered Store by id
     * @param {String/Object} id Store的id或是Store对象。The id of the Store, or a Store instance
     * @return {Ext.data.Store}
     */
    lookup : function(id){
        return typeof id == "object" ? (id.events ? id : Ext.create(id, 'store')) : this.get(id);
    },

    // getKey implementation for MixedCollection
    getKey : function(o){
         return o.storeId || o.id;
    }
});