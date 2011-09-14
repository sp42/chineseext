/**
 * @class Ext.StoreMgr
 * @extends Ext.util.MixedCollection
 * 缺省的全局store对象组
 * @singleton
 */
Ext.StoreMgr = Ext.apply(new Ext.util.MixedCollection(), {
    /**
     * @cfg {Object} listeners @hide
     */

    /**
     * 登记更多的Store对象到StoreMgr。一般情况下你不需要手动加入。任何透过{@link Ext.data.Store#storeId}初始化的Store都会自动登记。
     * @param {Ext.data.Store} store1 Store实例
     * @param {Ext.data.Store} store2 （可选的）
     * @param {Ext.data.Store} etc... （可选的）
     */
    register : function(){
        for(var i = 0, s; s = arguments[i]; i++){
            this.add(s);
        }
    },

    /**
     * 注销一个或多个Stores
     * @param {String/Object} id1 Store的id或是Store对象
     * @param {String/Object} id2 （可选的）
     * @param {String/Object} etc... （可选的）
     */
    unregister : function(){
        for(var i = 0, s; s = arguments[i]; i++){
            this.remove(this.lookup(s));
        }
    },
    
    /**
     * 由id返回一个已登记的Store
     * @param {String/Object} id Store的id或是Store对象
     * @return {Ext.data.Store}
     */
    lookup : function(id){
        return typeof id == "object" ? id : this.get(id);
    },

    // getKey implementation for MixedCollection
    getKey : function(o){
         return o.storeId || o.id;
    }
});