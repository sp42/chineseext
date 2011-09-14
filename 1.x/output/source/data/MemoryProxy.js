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
 * @class Ext.data.MemoryProxy
 * An implementation of Ext.data.DataProxy that simply passes the data specified in its constructor
 * to the Reader when its load method is called.
 * @constructor
 * @param {Object} data The data object which the Reader uses to construct a block of Ext.data.Records.
 */
 /**
 * 一个Ext.data.DataProxy的实现类,当它的load方法调用时简单的传入它的构建器指定的数据到Reader
 * @构建器
 * @param {Object} data Reader用来构建Ext.data.Records 块的数据对象
 */
Ext.data.MemoryProxy = function(data){
    Ext.data.MemoryProxy.superclass.constructor.call(this);
    this.data = data;
};

Ext.extend(Ext.data.MemoryProxy, Ext.data.DataProxy, {
    /**
     * Load data from the requested source (in this case an in-memory
     * data object passed to the constructor), read the data object into
     * a block of Ext.data.Records using the passed Ext.data.DataReader implementation, and
     * process that block using the passed callback.
     * @param {Object} params This parameter is not used by the MemoryProxy class.
     * @param {Ext.data.DataReader) reader The Reader object which converts the data
     * object into a block of Ext.data.Records.
     * @param {Function} callback The function into which to pass the block of Ext.data.records.
     * The function must be passed <ul>
     * <li>The Record block object</li>
     * <li>The "arg" argument from the load function</li>
     * <li>A boolean success indicator</li>
     * </ul>
     * @param {Object} scope The scope in which to call the callback
     * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
     */
	 /**
     * 从请求的源装载数据(在这种情况下在内存里的数据对象被传入构建器),使用传入的Ext.data.DataReader的实现
	 * 将数据对象读入Ext.data.Records块.并使用传入的回调函数处理该块.
     * @param {Object} params 这些参数不是MemoryProxy 类用到的参数.
     * @param {Ext.data.DataReader) reader 将数据对象转换成Ext.data.Records块对象的读取器.
     * @param {Function} callback 传入到Ext.data.records块的函数.
     * 该函数必须被传入 <ul>
     * <li>Record 块对象</li>
     * <li>来自装载函数的参数</li>
     * <li>布尔变量的成功指示器</li>
     * </ul>
     * @param {Object} scope 回调函数的作用域
     * @param {Object} arg 被传处回调函数作为第二参数码的可选参数.
     */
    load : function(params, reader, callback, scope, arg){
        params = params || {};
        var result;
        try {
            result = reader.readRecords(this.data);
        }catch(e){
            this.fireEvent("loadexception", this, arg, null, e);
            callback.call(scope, null, arg, false);
            return;
        }
        callback.call(scope, result, arg, true);
    },
    
    // private
    update : function(params, records){
        
    }
});