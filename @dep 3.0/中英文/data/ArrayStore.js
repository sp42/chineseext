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
 * @class Ext.data.ArrayStore
 * @extends Ext.data.Store
 * 小型的辅助类使得数组转化为Store更来得容易。<br />
 * Small helper class to make creating Stores from Array data easier.
 * @cfg {Number} id 记录id的索引数组，留空为自动生成id。The array index of the record id. Leave blank to auto generate ids.
 * @cfg {Array} fields 定义字段对象的数组，或字段名称的数组。An array of field definition objects, or field name strings.
 * @cfg {Array} data 数据的多维数组。The multi-dimensional array of data
 * @constructor
 * @param {Object} config
 */
Ext.data.ArrayStore = Ext.extend(Ext.data.Store, {
    constructor: function(config){
        Ext.data.ArrayStore.superclass.constructor.call(this, Ext.apply(config, {
            reader: new Ext.data.ArrayReader(config)
        }));
    },

    loadData : function(data, append){
        if(this.expandData === true){
            var r = [];
            for(var i = 0, len = data.length; i < len; i++){
                r[r.length] = [data[i]];
            }
            data = r;
        }
        Ext.data.ArrayStore.superclass.loadData.call(this, data, append);
    }
});
Ext.reg('arraystore', Ext.data.ArrayStore);

// backwards compat
Ext.data.SimpleStore = Ext.data.ArrayStore;
Ext.reg('simplestore', Ext.data.SimpleStore);