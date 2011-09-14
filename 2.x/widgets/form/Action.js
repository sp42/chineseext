/**
 * @class Ext.form.Action
 * <p>该类的子类提供在{@link Ext.form.BasicForm Form}上执行的行为。</p>
 * <p>该类的实例尽在{@link Ext.form.BasicForm Form}要执行提交或者加载动作的时候才由 Form 创建 ,下列该类的配置选项通过表单的
 * action methods {@link Ext.form.BasicForm#submit submit},{@link Ext.form.BasicForm#load load} 和 {@link Ext.form.BasicForm#doAction doAction}设置</p>
 * <p>执行了表单动作的Action的实例被传递到表单的 success，failure 回调函数({@link Ext.form.BasicForm#submit submit},
 * {@link Ext.form.BasicForm#load load} 和 {@link Ext.form.BasicForm#doAction doAction}),
 * 以及 {@link Ext.form.BasicForm#actioncomplete actioncomplete} 和{@link Ext.form.BasicForm#actionfailed actionfailed}事件处理器</p>
 */
Ext.form.Action = function(form, options){
    this.form = form;
    this.options = options || {};
};

/**
 * 当客户端的表单验证出现错误而中断提交动作的时候返回的错误类型。
 * @type {String}
 * @static
 */
Ext.form.Action.CLIENT_INVALID = 'client';
/**
 * 服务端验证表单出错时返回的错误类型，在response的<tt style="font-weight:bold">errors</tt>属性里指明具体的字段错误信息。
 * @type {String}
 * @static
 */
Ext.form.Action.SERVER_INVALID = 'server';
/**
 * 尝试向远程服务器发送请求遇到通信错误返回的错误类型。
 * @type {String}
 * @static
 */
Ext.form.Action.CONNECT_FAILURE = 'connect';
/**
 * 服务端response的<tt style="font-weight:bold">data</tt> 属性没有返回任何字段的值得时候返回的错误类型。
 * @type {String}
 * @static
 */
Ext.form.Action.LOAD_FAILURE = 'load';

Ext.form.Action.prototype = {
/**
 * @cfg {String} url Action调用的URL资源。
 */
/**
 * @cfg {Boolean} reset 当设置为 <tt><b>true</b></tt>的时候, 导致表单重置 {@link Ext.form.BasicForm.reset reset} 
 * 如果指定了该值，reset将在表单的{@link #success} 回调函数<b>前</b>和{@link Ext.form.BasicForm.actioncomplete actioncomplete}事件被激发前执行。
 *  event fires.
 */
/**
 * @cfg {String} method The HTTP method to use to access the requested URL. Defaults to the 
 * @cfg {String} method 获取请求的URL的HTTP方法。默认为{@link Ext.form.BasicForm}的方法。如果没有指定，使用DOM表单的方法。
 */
/**
 * @cfg {Mixed} params 传递到额外值。它们添加到表单的{@link Ext.form.BasicForm#baseParams}由表单的输入字段传递到指定的URL。
 */
/**
 * @cfg {Number} timeout 在服务端返回 {@link #CONNECT_FAILURE}这样的{@link #failureType}之前等待的毫秒数。
 */
/**
 * @cfg {Function} success 当接收到一个有效的成功返回的数据包的时候调用的回调函数。
 * 这个函数传递以下的参数:<ul class="mdetail-params">
 * <li><b>form</b> : Ext.form.BasicForm<div class="sub-desc">作出请求动作的表单</div></li>
 * <li><b>action</b> : Ext.form.Action<div class="sub-desc">Action类。该对象的{@link #result}
 * 属性可能被检查，用来执行自定义的后期处理。 </ul>
 */
/**
 * @cfg {Function} failure 当接收到一个返回失败的数据包或者在Ajax通信时发生错误调用的回调函数。
 * 这个函数传递以下的参数:<ul class="mdetail-params">
 * <li><b>form</b> : Ext.form.BasicForm<div class="sub-desc">作出请求动作的表单</div></li>
 * <li><b>action</b> : Ext.form.Action<div class="sub-desc">Action类。如果发生了Ajax异常，
 * 错误类型会在{@link #failureType}里。该对象的{@link #result} 属性可能被检查，用来执行自定义的后期处理。 </ul>
*/
/**
 * @cfg {Object} scope 回调函数执行的范围。<tt>this</tt> 指改回调函数自身。
 */
/**
 * @cfg {String} waitMsg 在调用一个action的处理过程中调用 {@link Ext.MessageBox#wait} 显示的信息。
 */
/**
 * @cfg {String} waitMsg 在调用一个action的处理过程中调用 {@link Ext.MessageBox#wait} 显示的标题。
 */

/**
 * 改Action的实例执行的action类型。
 * 目前仅支持“提交”和“加载”。
 * @type {String}
 */
    type : 'default',
/**
 * 错误检查类型。见 {@link #Ext.form.Action.CLIENT_INVALID CLIENT_INVALID}, {@link #Ext.form.Action.SERVER_INVALID SERVER_INVALID},
 * {@link #Ext.form.Action.CONNECT_FAILURE CONNECT_FAILURE}, {@link #Ext.form.Action.LOAD_FAILURE LOAD_FAILURE}
 * @property failureType
 * @type {String}
 *//**
 * 用来执行action的XMLHttpRequest对象。
 * @property response
 * @type {Object}
 *//**
 * 解码了的response对象包含一个boolean类型的 <tt style="font-weight:bold">success</tt> 属性和一些action的属性。
 * @property result
 * @type {Object}
 */

    // 接口方法
    run : function(options){

    },

    // 接口方法
    success : function(response){

    },

    // 接口方法
    handleResponse : function(response){

    },

    // 默认的连接错误
    failure : function(response){
        this.response = response;
        this.failureType = Ext.form.Action.CONNECT_FAILURE;
        this.form.afterAction(this, false);
    },

    // 私有的
    processResponse : function(response){
        this.response = response;
        if(!response.responseText){
            return true;
        }
        this.result = this.handleResponse(response);
        return this.result;
    },

    // 内部使用的工具函数
    getUrl : function(appendParams){
        var url = this.options.url || this.form.url || this.form.el.dom.action;
        if(appendParams){
            var p = this.getParams();
            if(p){
                url += (url.indexOf('?') != -1 ? '&' : '?') + p;
            }
        }
        return url;
    },

    // 私有的
    getMethod : function(){
        return (this.options.method || this.form.method || this.form.el.dom.method || 'POST').toUpperCase();
    },

    // 私有的
    getParams : function(){
        var bp = this.form.baseParams;
        var p = this.options.params;
        if(p){
            if(typeof p == "object"){
                p = Ext.urlEncode(Ext.applyIf(p, bp));
            }else if(typeof p == 'string' && bp){
                p += '&' + Ext.urlEncode(bp);
            }
        }else if(bp){
            p = Ext.urlEncode(bp);
        }
        return p;
    },

    // 私有的
    createCallback : function(opts){
		var opts = opts || {};
        return {
            success: this.success,
            failure: this.failure,
            scope: this,
            timeout: (opts.timeout*1000) || (this.form.timeout*1000),
            upload: this.form.fileUpload ? this.success : undefined
        };
    }
};

