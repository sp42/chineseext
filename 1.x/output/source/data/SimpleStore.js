/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.data.SimpleStore
 * @extends Ext.data.Store
 * Small helper class to make creating Stores from Array data easier.
 * @cfg {Number} id The array index of the record id. Leave blank to auto generate ids.
 * @cfg {Array} fields An array of field definition objects, or field name strings.
 * @cfg {Array} data The multi-dimensional array of data
 * @constructor
 * @param {Object} config
 */
 /**
 * @Ext.data.SimpleStore类
 * @继承Ext.data.Store
 * 使得从数组创建stores更为方便的简单帮助类
 * @cfg {Number} id 记录索引的数组ID.不填则自动生成 
 * @cfg {Array} fields 字段定义对象的数组,或字段名字符串.
 * @cfg {Array} data 多维数据数组
 * @constructor
 * @param {Object} config
 */
Ext.data.SimpleStore = function(config){
    Ext.data.SimpleStore.superclass.constructor.call(this, {
        reader: new Ext.data.ArrayReader({
                id: config.id
            },
            Ext.data.Record.create(config.fields)
        ),
        proxy : new Ext.data.MemoryProxy(config.data)
    });
    this.load();
};
Ext.extend(Ext.data.SimpleStore, Ext.data.Store);