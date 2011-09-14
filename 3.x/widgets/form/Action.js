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
 * @class Ext.form.Action
 * <p>
 * 该类的子类提供在{@link Ext.form.BasicForm Form}上执行的行为。<br />
 * The subclasses of this class provide actions to perform upon {@link Ext.form.BasicForm Form}s.</p>
 * <p>
 * 该类的实例只在{@link Ext.form.BasicForm Form}要执行提交或者加载动作的时候才由Form创建，下列该类的配置选项通过激活表单的动作来设置：
 * {@link Ext.form.BasicForm#submit submit}、{@link Ext.form.BasicForm#load load}以及{@link Ext.form.BasicForm#doAction doAction}。<br />
 * Instances of this class are only created by a {@link Ext.form.BasicForm Form} when
 * the Form needs to perform an action such as submit or load. The Configuration options
 * listed for this class are set through the Form's action methods: {@link Ext.form.BasicForm#submit submit},
 * {@link Ext.form.BasicForm#load load} and {@link Ext.form.BasicForm#doAction doAction}</p>
 * <p>
 * 执行了表单动作的Action的实例被传递到表单的success，failure回调函数（
 * {@link Ext.form.BasicForm#submit submit}、{@link Ext.form.BasicForm#load load}和{@link Ext.form.BasicForm#doAction doAction}
 * ），以及{@link Ext.form.BasicForm#actioncomplete actioncomplete}和{@link Ext.form.BasicForm#actionfailed actionfailed}事件处理器。<br />
 * The instance of Action which performed the action is passed to the success
 * and failure callbacks of the Form's action methods ({@link Ext.form.BasicForm#submit submit},
 * {@link Ext.form.BasicForm#load load} and {@link Ext.form.BasicForm#doAction doAction}),
 * and to the {@link Ext.form.BasicForm#actioncomplete actioncomplete} and
 * {@link Ext.form.BasicForm#actionfailed actionfailed} event handlers.</p>
 */
Ext.form.Action = function(form, options){
    this.form = form;
    this.options = options || {};
};

/**
 * 当客户端的表单验证出现错误而中断提交动作的时候返回<tt>false</tt>的错误类型。
 * Failure type returned when client side validation of the Form fails
 * thus aborting a submit action. Client side validation is performed unless
 * {@link #clientValidation} is explicitly set to <tt>false</tt>.
 * @type {String}
 * @static
 */
Ext.form.Action.CLIENT_INVALID = 'client';
/**
 * <p>
 * 服务端验证表单出错时返回的错误类型，在response的<tt style="font-weight:bold">errors</tt>属性里指明具体的字段错误信息。
 * Failure type returned when server side processing fails and the {@link #result}'s
 * <tt style="font-weight:bold">success</tt> property is set to <tt>false</tt>.</p>
 * <p>In the case of a form submission, field-specific error messages may be returned in the
 * {@link #result}'s <tt style="font-weight:bold">errors</tt> property.</p>
 * @type {String}
 * @static
 */
Ext.form.Action.SERVER_INVALID = 'server';
/**
 * 尝试向远程服务器发送请求遇到通信错误返回的错误类型。可用{@link #response}提取更多信息。
 * Failure type returned when a communication error happens when attempting
 * to send a request to the remote server. The {@link #response} may be examined to
 * provide further information.
 * @type {String}
 * @static
 */
Ext.form.Action.CONNECT_FAILURE = 'connect';
/**
 * 服务端response的<tt style="font-weight:bold">data</tt>属性没有返回任何字段的值得时候返回的错误类型。
 * Failure type returned when the response's <tt style="font-weight:bold">success</tt>
 * property is set to <tt>false</tt>, or no field values are returned in the response's
 * <tt style="font-weight:bold">data</tt> property.
 * @type {String}
 * @static
 */
Ext.form.Action.LOAD_FAILURE = 'load';

Ext.form.Action.prototype = {
/**
 * @cfg {String} url 调用的URL资源。
 * The URL that the Action is to invoke.
 */
/**
 * @cfg {Boolean} reset 当设置为<tt><b>true</b></tt>的时候，导致表单重置{@link Ext.form.BasicForm.reset reset} 
 * 如果指定了该值，reset将在表单的{@link #success} 回调函数<b>前</b>和{@link Ext.form.BasicForm.actioncomplete actioncomplete}事件被激发前执行。
 * When set to <tt><b>true</b></tt>, causes the Form to be
 * {@link Ext.form.BasicForm.reset reset} on Action success. If specified, this happens
 * <b>before</b> the {@link #success} callback is called and before the Form's
 * {@link Ext.form.BasicForm.actioncomplete actioncomplete} event fires.
 */
/**
 * @cfg {String} method 获取请求的URL的HTTP方法。默认为{@link Ext.form.BasicForm}的方法。如果没有指定，使用DOM表单的方法。
 * The HTTP method to use to access the requested URL. Defaults to the
 * {@link Ext.form.BasicForm}'s method, or if that is not specified, the underlying DOM form's method.
 */
/**
 * @cfg {Mixed} params 传递到额外值。它们添加到表单的{@link Ext.form.BasicForm#baseParams}由表单的输入字段传递到指定的URL。
 * Extra parameter values to pass. These are added to the Form's {@link Ext.form.BasicForm#baseParams} and passed to the specified URL along with the Form's input fields.
 */
/**
 * @cfg {Number} timeout 在服务端返回{@link #CONNECT_FAILURE}这样的{@link #failureType}之前等待的毫秒数。
 * The number of milliseconds to wait for a server response before failing with the {@link #failureType} as {@link #Action.CONNECT_FAILURE}.
 */
/**
 * @cfg {Function} success 当接收到一个有效的成功返回的数据包的时候调用的回调函数。这个函数传递以下的参数:  
 * The function to call when a valid success return packet is recieved.
 * The function is passed the following parameters:<ul class="mdetail-params">
 * <li><b>form</b> : Ext.form.BasicForm<div class="sub-desc">作出请求动作的表单。The form that requested the action</div></li>
 * <li><b>action</b> : Ext.form.Action<div class="sub-desc">Action类。该对象的{@link #result}属性可能被检查，用来执行自定义的后期处理。
 * The Action class. The {@link #result}
 * property of this object may be examined to perform custom postprocessing.</div></li>
 * </ul>
 */
/**
 * @cfg {Function} failure 当接收到一个返回失败的数据包或者在Ajax通信时发生错误调用的回调函数。这个函数传递以下的参数: 
 * The function to call when a failure packet was recieved, or when an error ocurred in the Ajax communication.
 * The function is passed the following parameters:<ul class="mdetail-params">
 * <li><b>form</b> : Ext.form.BasicForm<div class="sub-desc">作出请求动作的表单。The form that requested the action</div></li>
 * <li><b>action</b> : Ext.form.Action<div class="sub-desc">Action类。如果发生了Ajax异常，错误类型会在{@link #failureType}里。
 * 该对象的{@link #result}属性可能被检查，用来执行自定义的后期处理。
 * The Action class. If an Ajax error ocurred, the failure type will be in {@link #failureType}. The {@link #result}
 * property of this object may be examined to perform custom postprocessing.</div></li>
 * </ul>
*/
/**
 * @cfg {Object} scope  回调函数执行的范围。指改回调函数的<tt>this</tt>。
 * The scope in which to call the callback functions (The <tt>this</tt> reference for the callback functions).
 */
/**
 * @cfg {String} waitMsg 在调用一个action的处理过程中调用{@link Ext.MessageBox#wait}显示的内容。 
 * The message to be displayed by a call to {@link Ext.MessageBox#wait} during the time the action is being processed.
 */
/**
 * @cfg {String} waitTitle 在调用一个action的处理过程中调用{@link Ext.MessageBox#wait}显示的标题。
 * The title to be displayed by a call to {@link Ext.MessageBox#wait} during the time the action is being processed.
 */

/**
 * 改Action的实例执行的action类型。目前仅支持“提交”和“加载”。
 * The type of action this Action instance performs.Currently only "submit" and "load" are supported.
 * @type {String}
 */
    type : 'default',
/**
 * 错误检查类型。可参阅{@link link Ext.form.Action#Action.CLIENT_INVALID CLIENT_INVALID}、
 * {@link link Ext.form.Action#Action.SERVER_INVALID SERVER_INVALID}、
 * {@link #link Ext.form.ActionAction.CONNECT_FAILURE CONNECT_FAILURE}、{@link Ext.form.Action#Action.LOAD_FAILURE LOAD_FAILURE}。
 * The type of failure detected.
 * See {@link link Ext.form.Action#Action.CLIENT_INVALID CLIENT_INVALID},
 * {@link link Ext.form.Action#Action.SERVER_INVALID SERVER_INVALID},
 * {@link #link Ext.form.ActionAction.CONNECT_FAILURE CONNECT_FAILURE}, {@link Ext.form.Action#Action.LOAD_FAILURE LOAD_FAILURE}
 * @property failureType
 * @type {String}
 */
 /**
 * 用来执行action的XMLHttpRequest对象。
 * The XMLHttpRequest object used to perform the action.
 * @property response
 * @type {Object}
 */
 /**
 * 解码了的response对象包含一个boolean类型的<tt style="font-weight:bold">success</tt>属性和一些action的属性。
 * The decoded response object containing a boolean <tt style="font-weight:bold">success</tt> property and
 * other, action-specific properties.
 * @property result
 * @type {Object}
 */
    // 接口方法
    // interface method
    run : function(options){

    },
    // 接口方法
    // interface method
    success : function(response){

    },
    // 接口方法
    // interface method
    handleResponse : function(response){

    },
    // 默认的连接错误
    // default connection failure
    failure : function(response){
        this.response = response;
        this.failureType = Ext.form.Action.CONNECT_FAILURE;
        this.form.afterAction(this, false);
    },
    // 私有的
    // private
    processResponse : function(response){
        this.response = response;
        if(!response.responseText){
            return true;
        }
        this.result = this.handleResponse(response);
        return this.result;
    },
    // 内部使用的工具函数
    // utility functions used internally
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
    // private
    getMethod : function(){
        return (this.options.method || this.form.method || this.form.el.dom.method || 'POST').toUpperCase();
    },
    // 私有的
    // private
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
    // private
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

/**
 * @class Ext.form.Action.Submit
 * @extends Ext.form.Action
 * <p>
 * 处理表单{@link Ext.form.BasicForm Form}数据和返回的response对象的类。
 * A class which handles submission of data from {@link Ext.form.BasicForm Form}s and processes the returned response.</p>
 * <p>
 * 该类的实例仅在表单{@link Ext.form.BasicForm Form}{@link Ext.form.BasicForm#submit 提交}的时候创建。
 * Instances of this class are only created by a {@link Ext.form.BasicForm Form} when
 * {@link Ext.form.BasicForm#submit submit}ting.</p>
 * <p>
 * 返回的数据包必须包含一个 boolean 类型的<tt style="font-weight:bold">success</tt>属性，还有可选地，一个含有无效字段的<tt style="font-weight:bold">错误信息</tt>的属性。
 * A response packet must contain a boolean <tt style="font-weight:bold">success</tt> property, and, optionally
 * an <tt style="font-weight:bold">errors</tt> property. The <tt style="font-weight:bold">errors</tt> property contains error
 * messages for invalid fields.</p>
 * <p>
 * 默认情况下，response数据包被认为是一个JSON对象，所以典型的response数据包看起来像是这样的：
 * By default, response packets are assumed to be JSON, so a typical response
 * packet may look like this:</p><pre><code>
{
    success: false,
    errors: {
        clientCode: "Client not found",
        portOfLoading: "This field must not be null"
    }
}</code></pre>
 * <p>{@link Ext.form.BasicForm}的回调函数或其它处理函数的方法可能会处理其他的数据，放置在响应中。
 * JSON解码后的数据可在{@link #result}找到。
 * Other data may be placed into the response for processing by the {@link Ext.form.BasicForm} 's callback
 * or event handler methods. The object decoded from this JSON is available in the {@link #result} property.</p>
 * <p>
 * 另外，如果一个{@link #errorReader}指定为{@link Ext.data.XmlReader XmlReader}：
 * Alternatively, if an {@link #errorReader} is specified as an {@link Ext.data.XmlReader XmlReader}:</p><pre><code>
    errorReader: new Ext.data.XmlReader({
            record : 'field',
            success: '@success'
        }, [
            'id', 'msg'
        ]
    )
</code></pre>
 * <p>那么结果集将会以XML形式返回。then the results may be sent back in XML format:</p><pre><code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;message success="false"&gt;
&lt;errors&gt;
    &lt;field&gt;
        &lt;id&gt;clientCode&lt;/id&gt;
        &lt;msg&gt;&lt;![CDATA[Code not found. &lt;br /&gt;&lt;i&gt;This is a test validation message from the server &lt;/i&gt;]]&gt;&lt;/msg&gt;
    &lt;/field&gt;
    &lt;field&gt;
        &lt;id&gt;portOfLoading&lt;/id&gt;
        &lt;msg&gt;&lt;![CDATA[Port not found. &lt;br /&gt;&lt;i&gt;This is a test validation message from the server &lt;/i&gt;]]&gt;&lt;/msg&gt;
    &lt;/field&gt;
&lt;/errors&gt;
&lt;/message&gt;
</code></pre>
 * <p>表单的回调函数或者时间处理函数可以向相应的XML里置入其他的元素。
 * XML文档在{@link #errorReader}的{@link Ext.data.XmlReader#xmlData xmlData}属性。
 * Other elements may be placed into the response XML for processing by the {@link Ext.form.BasicForm}'s callback
 * or event handler methods. The XML document is available in the {@link #errorReader}'s {@link Ext.data.XmlReader#xmlData xmlData} property.</p>
 */
Ext.form.Action.Submit = function(form, options){
    Ext.form.Action.Submit.superclass.constructor.call(this, form, options);
};

Ext.extend(Ext.form.Action.Submit, Ext.form.Action, {
    /**
    * @cfg {Ext.data.DataReader} errorReader <b>可选的。解读JSON对象不需要errorReader。
    * Optional. JSON is interpreted with no need for an errorReader.</b>
    * <p>
    * 从返回结果中读取一条记录的Reader。
    * DataReader的<b>success</b>属性指明决定是否提交成功。
    * Record对象的数据提供了任何未通过验证(非法)的表单字段的错误信息。
    * A Reader which reads a single record from the returned data. 
    * The DataReader's <b>success</b> property specifies how submission success is determined. The Record's data provides the error messages to apply to any invalid form Fields.</p>.
    */
    /**
    * @cfg {boolean}  clientValidation 表明一个表单的字段是否都合法。在表单最终提交前调用。
    * 可以在表单的提交选项中选择避免执行该操作。如果没有定义改属性，执行提交前的表单验证。 
    * Determines whether a Form's fields are validated in a final call to {@link Ext.form.BasicForm#isValid isValid} prior to submission.
    * Pass <tt>false</tt> in the Form's submit options to prevent this. If not defined, pre-submission field validation is performed.
    */
    type : 'submit',
    // 私有的
    // private
    run : function(){
        var o = this.options;
        var method = this.getMethod();
        var isGet = method == 'GET';
        if(o.clientValidation === false || this.form.isValid()){
            Ext.Ajax.request(Ext.apply(this.createCallback(o), {
                form:this.form.el.dom,
                url:this.getUrl(isGet),
                method: method,
                headers: o.headers,
                params:!isGet ? this.getParams() : null,
                isUpload: this.form.fileUpload
            }));
        }else if (o.clientValidation !== false){ // client validation failed
            this.failureType = Ext.form.Action.CLIENT_INVALID;
            this.form.afterAction(this, false);
        }
    },
    // 私有的
    // private
    success : function(response){
        var result = this.processResponse(response);
        if(result === true || result.success){
            this.form.afterAction(this, true);
            return;
        }
        if(result.errors){
            this.form.markInvalid(result.errors);
            this.failureType = Ext.form.Action.SERVER_INVALID;
        }
        this.form.afterAction(this, false);
    },
    // 私有的
    // private
    handleResponse : function(response){
        if(this.form.errorReader){
            var rs = this.form.errorReader.read(response);
            var errors = [];
            if(rs.records){
                for(var i = 0, len = rs.records.length; i < len; i++) {
                    var r = rs.records[i];
                    errors[i] = r.data;
                }
            }
            if(errors.length < 1){
                errors = null;
            }
            return {
                success : rs.success,
                errors : errors
            };
        }
        return Ext.decode(response.responseText);
    }
});


/**
 * @class 类 Ext.form.Action.Load
 * @extends Ext.form.Action
 * <p>
 * {@link Ext.form.BasicForm}处理从服务器加载数据到的字段的类。 
 * A class which handles loading of data from a server into the Fields of an {@link Ext.form.BasicForm}.</p>
 * <p>
 * 该类的实例仅在{@link Ext.form.BasicForm Form}表单加载的时候才被创建。
 * Instances of this class are only created by a {@link Ext.form.BasicForm Form}。 when {@link Ext.form.BasicForm#load load}ing.</p>
 * 
 * <p>
 * 相应数据包<b>必须</b>包含一个boolean类型的<tt style="font-weight:bold">success</tt>属性，和<tt style="font-weight:bold">data</tt>属性。
 * <tt style="font-weight:bold">data</tt>属性包含了表单字段要加载的数据。每个值对象被传递到字段的{@link Ext.form.Field#setValue setValue}方法里。
 * A response packet <b>must</b> contain a boolean <tt style="font-weight:bold">success</tt> property, and
 * a <tt style="font-weight:bold">data</tt> property. The <tt style="font-weight:bold">data</tt> property
 * contains the values of Fields to load. The individual value object for each Field
 * is passed to the Field's {@link Ext.form.Field#setValue setValue} method.</p>
 * 
 * <p>
 * 默认情况下，相应数据包会被认为是一个JSON对象，所以典型的相应数据包看起来是这样的: 
 * By default, response packets are assumed to be JSON, so a typical response packet may look like this:</p><pre><code>
{
    success: true,
    data: {
        clientName: "Fred. Olsen Lines",
        portOfLoading: "FXT",
        portOfDischarge: "OSL"
    }
}</code></pre>
 * <p>
 * 其他的数据可以由{@link Ext.form.BasicForm Form}的回调函数甚至是事件处理函数置入response对象进行处理。
 * 解码的JSON对象在{@link #result}属性里。 
 * Other data may be placed into the response for processing the {@link Ext.form.BasicForm Form}'s callback
 * or event handler methods.
 * The object decoded from this JSON is available in the {@link #result} property.</p>
 */
Ext.form.Action.Load = function(form, options){
    Ext.form.Action.Load.superclass.constructor.call(this, form, options);
    this.reader = this.form.reader;
};

Ext.extend(Ext.form.Action.Load, Ext.form.Action, {
    // 私有的// private
    type : 'load',

    // 私有的// private
    run : function(){
        Ext.Ajax.request(Ext.apply(
                this.createCallback(this.options), {
                    method:this.getMethod(),
                    url:this.getUrl(false),
                    headers: this.options.headers,
                    params:this.getParams()
        }));
    },

    // 私有的// private
    success : function(response){
        var result = this.processResponse(response);
        if(result === true || !result.success || !result.data){
            this.failureType = Ext.form.Action.LOAD_FAILURE;
            this.form.afterAction(this, false);
            return;
        }
        this.form.clearInvalid();
        this.form.setValues(result.data);
        this.form.afterAction(this, true);
    },

    // 私有的// private
    handleResponse : function(response){
        if(this.form.reader){
            var rs = this.form.reader.read(response);
            var data = rs.records && rs.records[0] ? rs.records[0].data : null;
            return {
                success : rs.success,
                data : data
            };
        }
        return Ext.decode(response.responseText);
    }
});

Ext.form.Action.ACTION_TYPES = {
    'load' : Ext.form.Action.Load,
    'submit' : Ext.form.Action.Submit
};
