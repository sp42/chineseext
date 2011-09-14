/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.data.DataProxy
 * This class is an abstract base class for implementations which provide retrieval of
 * unformatted data objects.<br>
 * <p>
 * DataProxy implementations are usually used in conjunction with an implementation of Ext.data.DataReader
 * (of the appropriate type which knows how to parse the data object) to provide a block of
 * {@link Ext.data.Records} to an {@link Ext.data.Store}.<br>
 * <p>
 * Custom implementations must implement the load method as described in
 * {@link Ext.data.HttpProxy#load}.
 */
 /**
 * @ Ext.data.DataProxy类
 * 该类是所有实现例的一抽象基类.该实现例能重获未格式化数据对象<br>
 * <p>
 * 数据代理实现类通常被用来与一Ext.data.DataReader实现(适当类型的DataReader实现类知道如何去解析数据对象)
 * 例协作向一Ext.data.Store类提供Ext.data.Records块
 * <p>
 * 如Ext.data.HttpProxy的load方法要求.客户实现类必须实现load方法
 */
Ext.data.DataProxy = function(){
    this.addEvents({
        /**
         * @event beforeload
         * Fires before a network request is made to retrieve a data object.
         * @param {Object} This DataProxy object.
         * @param {Object} params The params parameter to the load function.
         */
		 /**
         * @ beforeload 事件
         * 在一个网络请求(该请求为了获得数据对象)之前触发
         * @param {Object} 该 DataProxy 对象.
         * @param {Object} params 装载函数的参数
         */
        beforeload : true,
        /**
         * @event load
         * Fires before the load method's callback is called.
         * @param {Object} This DataProxy object.
         * @param {Object} o The data object.
         * @param {Object} arg The callback argument object passed to the load function.
         */
		 /**
         * @ load 事件
         * 在load方法的回调函数被调用之前触发该事件
         * @param {Object} 该 DataProxy 对象.
         * @param {Object} o 数据对象
         * @param {Object} arg 传入load 函数的回调参数对象
         */
        load : true,
        /**
         * @event loadexception
         * Fires if an Exception occurs during data retrieval.
         * @param {Object} This DataProxy object.
         * @param {Object} o The data object.
         * @param {Object} arg The callback argument object passed to the load function.
         * @param {Object} e The Exception.
         */
		   /**
         * @ loadexception 事件
         * 在获取数据期间有民常发生时触发该事件
         * @param {Object}  该 DataProxy 对象.
         * @param {Object} o 数据对象.
         * @param {Object} arg  传入load 函数的回调参数对象
         * @param {Object} e 异常
         */
        loadexception : true
    });
    Ext.data.DataProxy.superclass.constructor.call(this);
};

Ext.extend(Ext.data.DataProxy, Ext.util.Observable);