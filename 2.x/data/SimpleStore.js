 /**
 * @class Ext.data.SimpleStore
 * @extends Ext.data.Store
 * 使得从数组创建stores更为方便的简单辅助类。
 * @cfg {Number} id 记录索引的数组ID。不填则自动生成 
 * @cfg {Array} fields 字段定义对象的数组，或字段名字符串
 * @cfg {Array} data 多维数据数组
 * @constructor
 * @param {Object} config
 */
Ext.data.SimpleStore = function(config){
    Ext.data.SimpleStore.superclass.constructor.call(this, Ext.apply(config, {
        reader: new Ext.data.ArrayReader({
                id: config.id
            },
            Ext.data.Record.create(config.fields)
        )
    }));
};
Ext.extend(Ext.data.SimpleStore, Ext.data.Store, {
    loadData : function(data, append){
        if(this.expandData === true){
            var r = [];
            for(var i = 0, len = data.length; i < len; i++){
                r[r.length] = [data[i]];
            }
            data = r;
        }
        Ext.data.SimpleStore.superclass.loadData.call(this, data, append);
    }
});