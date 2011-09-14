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
 * @class Ext.data.DataReader
 * 用于读取结构化数据（来自数据源）然后转换为{@link Ext.data.Record}对象集合和元数据{@link Ext.data.Store}这二者合成的对象。 
 * 这个类应用于被扩展而最好不要直接使用。要了解当前的实现，可参阅{@link Ext.data.ArrayReader}，{@link Ext.data.JsonReader}以及{@link Ext.data.XmlReader}。
 * <br />
 * Abstract base class for reading structured data from a data source and converting
 * it into an object containing {@link Ext.data.Record} objects and metadata for use
 * by an {@link Ext.data.Store}.  This class is intended to be extended and should not
 * be created directly. For existing implementations, see {@link Ext.data.ArrayReader},
 * {@link Ext.data.JsonReader} and {@link Ext.data.XmlReader}.
 * @constructor 创建DataReader对象。Create a new DataReader
 * @param {Object} meta Metadata 配置选项的元数据（由实现指定的）。configuration options (implementation-specific)
 * @param {Object} recordType 既可以是字段的定义对象组成的数组，可以是一个由{@link Ext.data.Record#create}创建的{@link Ext.data.Record}对象。
 * Either an Array of field definition objects as specified
 * in {@link Ext.data.Record#create}, or an {@link Ext.data.Record} object created
 * using {@link Ext.data.Record#create}.
 */
Ext.data.DataReader = function(meta, recordType){
    /**
     * 透过构造器参数传入到此DataReader的配置信息。<br />
     * This DataReader's configured metadata as passed to the constructor.
     * @type Mixed
     * @property meta
     */
    this.meta = meta;
    this.recordType = Ext.isArray(recordType) ? 
        Ext.data.Record.create(recordType) : recordType;
};

Ext.data.DataReader.prototype = {
    
};