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
 * @class Ext.data.RestProxy
 * @extends Ext.data.AjaxProxy
 * 
 * <p>
 * 如果需要进行RESTful的风格应用，我们可以在{@link Ext.data.AjaxProxy AjaxProxy}的基础上增加四个HTTP动词（CRUD对应POST、GET、PUT、DELETE）。
 * Specialization of the {@link Ext.data.AjaxProxy AjaxProxy} which simply maps the four actions (create, read, 
 * update and destroy) to RESTful HTTP verbs</p>
 */
Ext.data.RestProxy = Ext.extend(Ext.data.AjaxProxy, {
    /**
     * 映射动作名称到HTTP请求方法。默认常规就是'create', 'read','update' and 'destroy'分别对应POST、GET、PUT、DELETE。
     * 该项应该保持不变除非使用全局{@link Ext.override}的方法，也可以用重写{@link #getMethod}来代替。
     * Mapping of action name to HTTP request method. These default to RESTful conventions for the 'create', 'read',
     * 'update' and 'destroy' actions (which map to 'POST', 'GET', 'PUT' and 'DELETE' respectively). This object should
     * not be changed except globally via {@link Ext.override} - the {@link #getMethod} function can be overridden instead.
     * @property actionMethods
     * @type Object
     */
    actionMethods: {
        create : 'POST',
        read   : 'GET',
        update : 'PUT',
        destroy: 'DELETE'
    },
    
    api: {
        create : 'create',
        read   : 'read',
        update : 'update',
        destroy: 'destroy'
    }
});

Ext.data.ProxyMgr.registerType('rest', Ext.data.RestProxy);