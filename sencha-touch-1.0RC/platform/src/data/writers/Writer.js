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
 * @author Ed Spencer
 * @class Ext.data.Writer
 * @extends Object
 * 
 * <p>Base Writer class used by most subclasses of {@link Ext.data.ServerProxy}. This class is
 * responsible for taking a set of {@link Ext.data.Operation} objects and a {@link Ext.data.Request}
 * object and modifying that request based on the Operations.
 * 通常为{@link Ext.data.ServerProxy}其子类所使用。该类的作用是让{@link Ext.data.Operation}与{@link Ext.data.Request}产生关系，
 * 具体说，就是根据Operations修改请求对象。
 * </p>
 * 
 * <p>
 * 例如{@link Ext.data.JsonWriter}会根据配置项参数格式化操作对象及其{@link Ext.data.Model}实例。配置项参数来自哪里？
 * 就是来自{@link Ext.data.JsonWriter JsonWriter's}的构造器参数。
 * For example a {@link Ext.data.JsonWriter} would format the Operations and their {@link Ext.data.Model} 
 * instances based on the config options passed to the {@link Ext.data.JsonWriter JsonWriter's} constructor.</p>
 * 
 * <p>Writers对于本地储存（local storage）而言没什么意义。
 * Writers are not needed for any kind of local storage - whether via a
 * {@link Ext.data.WebStorageProxy Web Storage proxy} (see {@link Ext.data.LocalStorageProxy localStorage}
 * and {@link Ext.data.SessionStorageProxy sessionStorage}) or just in memory via a
 * {@link Ext.data.MemoryProxy MemoryProxy}.</p>
 * 
 * @constructor
 * @param {Object} config 可选的配置项对象。Optional config object
 */
Ext.data.Writer = Ext.extend(Object, {

    constructor: function(config) {
        Ext.apply(this, config);
    },

    /**
     * 准备Proxy的Ext.data.Request请求对象。Prepares a Proxy's Ext.data.Request object
     * @param {Ext.data.Request} request 请求对象。The request object
     * @return {Ext.data.Request} 已准备好的请求对象。The modified request object
     */
    write: function(request) {
        var operation = request.operation,
            records   = operation.records || [],
            ln        = records.length,
            i         = 0,
            data      = [];

        for (; i < ln; i++) {
            data.push(this.getRecordData(records[i]));
        }
        return this.writeRecords(request, data);
    },

    /**
     * 在发送数据服务端之前先格式化数据。应该重写这个函数以适应不同格式的需求。
     * Formats the data for each record before sending it to the server. This
     * method should be overridden to format the data in a way that differs from the default.
     * @param {Object} record 我们对服务端正在写入的记录。The record that we are writing to the server.
     * @return {Object} 符合服务端要求的JSON。默认该方法返回Record对象的data属性。An object literal of name/value keys to be written to the server.
     * By default this method returns the data property on the record.
     */
    getRecordData: function(record) {
        return record.data;
    }
});

Ext.data.WriterMgr.registerType('base', Ext.data.Writer);