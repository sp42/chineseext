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