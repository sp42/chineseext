/**
 * @class Ext.data.DataReader
 * 用于读取结构化数据（来自数据源）然后转换为{@link Ext.data.Record}对象集合和元数据{@link Ext.data.Store}这二者合成的对象。 
 * 这个类应用于被扩展而最好不要直接使用。要了解当前的实现，可参阅{@link Ext.data.ArrayReader}，
 * {@link Ext.data.JsonReader}以及{@link Ext.data.XmlReader}。
 * @constructor 创建DataReader对象
 * @param {Object} meta 配置选项的元数据（由实现指定的）
 * @param {Object} recordType 既可以是字段的定义对象组成的数组，如{@link Ext.data.Record#create}那般，也可以是一个由
 * {@link Ext.data.Record#create}创建的{@link Ext.data.Record}对象。
 */
Ext.data.DataReader = function(meta, recordType){
    /**
     * 送入构造器的DataReader的配置元数据。
     * @type Mixed
     * @property meta
     */
    this.meta = meta;
    this.recordType = Ext.isArray(recordType) ? 
        Ext.data.Record.create(recordType) : recordType;
};

Ext.data.DataReader.prototype = {
    
};