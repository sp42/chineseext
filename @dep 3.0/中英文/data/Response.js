/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见http://ajaxjs.com 或者 http://jstang.cn
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
 * @class Ext.data.Response
 * 框架内使用的通用类，用于规范一般的响应处理。<br />
 * A generic response class to normalize response-handling internally to the framework.
 */
Ext.data.Response = function(params) {
    Ext.apply(this, params);
};
Ext.data.Response.prototype = {
    /**
     * @cfg {String} action {@link Ext.data.Api#actions}
     */
    action: undefined,
    /**
     * @cfg {Boolean} success
     */
    success : undefined,
    /**
     * @cfg {String} message
     */
    message : undefined,
    /**
     * @cfg {Array/Object} data
     */
    data: undefined,
    /**
     * @cfg {Object} raw 由服务端代码生成的最原始响应内容。The raw response returned from server-code
     */
    raw: undefined,
    /**
     * @cfg {Ext.data.Record/Ext.data.Record[]} records 相关的请求动作。related to the Request action
     */
    records: undefined
};
