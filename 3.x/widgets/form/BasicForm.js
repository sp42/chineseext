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
 * @class Ext.form.BasicForm
 * @extends Ext.util.Observable
 * <p>提供表单的多种动作("actions")功能，并且初始化 Ext.form.Field 类型在现有的标签上。<br />
 * Encapsulates the DOM &lt;form> element at the heart of the {@link Ext.form.FormPanel FormPanel} class, and provides
 * input field management, validation, submission, and form loading services.</p>
 * <p>By default, Ext Forms are submitted through Ajax, using an instance of {@link Ext.form.Action.Submit}.
 * To enable normal browser submission of an Ext Form, use the {@link #standardSubmit} config option.</p>
 * <p><h3>File Uploads</h3>{@link #fileUpload File uploads} are not performed using Ajax submission, that
 * is they are <b>not</b> performed using XMLHttpRequests. Instead the form is submitted in the standard
 * manner with the DOM <tt>&lt;form></tt> element temporarily modified to have its
 * <a href="http://www.w3.org/TR/REC-html40/present/frames.html#adef-target">target</a> set to refer
 * to a dynamically generated, hidden <tt>&lt;iframe></tt> which is inserted into the document
 * but removed after the return data has been gathered.</p>
 * <p>The server response is parsed by the browser to create the document for the IFRAME. If the
 * server is using JSON to send the return object, then the
 * <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17">Content-Type</a> header
 * must be set to "text/html" in order to tell the browser to insert the text unchanged into the document body.</p>
 * <p>Characters which are significant to an HTML parser must be sent as HTML entities, so encode
 * "&lt;" as "&amp;lt;", "&amp;" as "&amp;amp;" etc.</p>
 * <p>The response text is retrieved from the document, and a fake XMLHttpRequest object
 * is created containing a <tt>responseText</tt> property in order to conform to the
 * requirements of event handlers and callbacks.</p>
 * <p>Be aware that file upload packets are sent with the content type <a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form</a>
 * and some server technologies (notably JEE) may require some custom processing in order to
 * retrieve parameter names and parameter values from the packet content.</p>
 * @constructor
 * @param {Mixed} el 表单对象或它的ID el The form element or its id
 * @param {Object} config 配置表单对象的配置项选项 config Configuration options
 */
Ext.form.BasicForm = function(el, config){
    Ext.apply(this, config);
    /**
     * @property items
     * 所有表单内元素的集合。 The Ext.form.Field items in this form.
     * @type MixedCollection
     */
    this.items = new Ext.util.MixedCollection(false, function(o){
        return o.id || (o.id = Ext.id());
    });
    this.addEvents(
        /**
         * @event beforeaction
         * 在任何动作被执行前被触发。如果返回false则取消这个动作。 
         * Fires before any action is performed. Return false to cancel the action.
         * @param {Form} this
         * @param {Action} action 要被执行的{@link Ext.form.Action}动作对象 action The {@link Ext.form.Action} to be performed
         */
        'beforeaction',
        /**
         * @event actionfailed
         * 当动作失败时被触发。 
         * Fires when an action fails.
         * @param {Form} this
         * @param {Action} action 失败的{@link Ext.form.Action}动作对象 action The {@link Ext.form.Action} that failed
         */
        'actionfailed',
        /**
         * @event actioncomplete
         * 当动作完成时被触发。Fires when an action is completed.
         * @param {Form} this
         * @param {Action} action 完成的{@link Ext.form.Action}动作对象 action The {@link Ext.form.Action} that completed
         */
        'actioncomplete'
    );

    if(el){
        this.initEl(el);
    }
    Ext.form.BasicForm.superclass.constructor.call(this);
};

Ext.extend(Ext.form.BasicForm, Ext.util.Observable, {
    /**
     * @cfg {String} method
     * 如不指定，所有动作使用的默认表单请求方法（GET或POST）。
     * The request method to use (GET or POST) for form actions if one isn't supplied in the action options.
     */
    /**
     * @cfg {DataReader} reader
     * 当执行"load"动作时，设置一个Ext.data.DataReader对象（如{@link Ext.data.XmlReader}实例）用来读取数据。它是一个可选项，因为这里已经有了一个内建对象来读取JSON数据。
     * An Ext.data.DataReader (e.g. {@link Ext.data.XmlReader}) to be used to read data when executing "load" actions.
     * This is optional as there is built-in support for processing JSON.
     */
    /**
     * @cfg {DataReader} errorReader
     * <p>一个Ext.data.DataReader对象 An Ext.data.DataReader (e.g. {@link Ext.data.XmlReader}) 当执行"submit"动作出错时被用来读取数据 to be used to read field error messages returned from "submit" actions.
     * This is completely optional as there is built-in support for processing JSON.</p>
     * <p>The Records which provide messages for the invalid Fields must use the Field name (or id) as the Record ID,
     * and must contain a field called "msg" which contains the error message.</p>
     * <p>The errorReader does not have to be a full-blown implementation of a DataReader. It simply needs to implement a 
     * <tt>read(xhr)</tt> function which returns an Array of Records in an object with the following structure:<pre><code>
{
    records: recordArray
}
</code></pre>
     */
    /**
     * @cfg {String} url
     * 通讯url地址。该地址也可以由action那里指定。
     * The URL to use for form actions if one isn't supplied in the action options.
     */
    /**
     * @cfg {Boolean} fileUpload
     * 当为true时，表单为文件上传类型。Set to true if this form is a file upload.
     * <p>File uploads are not performed using normal "Ajax" techniques, that is they are <b>not</b>
     * performed using XMLHttpRequests. Instead the form is submitted in the standard manner with the
     * DOM <tt>&lt;form></tt> element temporarily modified to have its
     * <a href="http://www.w3.org/TR/REC-html40/present/frames.html#adef-target">target</a> set to refer
     * to a dynamically generated, hidden <tt>&lt;iframe></tt> which is inserted into the document
     * but removed after the return data has been gathered.</p>
     * <p>The server response is parsed by the browser to create the document for the IFRAME. If the
     * server is using JSON to send the return object, then the
     * <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17">Content-Type</a> header
     * must be set to "text/html" in order to tell the browser to insert the text unchanged into the document body.</p>
     * <p>Characters which are significant to an HTML parser must be sent as HTML entities, so encode
     * "&lt;" as "&amp;lt;", "&amp;" as "&amp;amp;" etc.</p>
     * <p>The response text is retrieved from the document, and a fake XMLHttpRequest object
     * is created containing a <tt>responseText</tt> property in order to conform to the
     * requirements of event handlers and callbacks.</p>
     * <p>Be aware that file upload packets are sent with the content type <a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form</a>
     * and some server technologies (notably JEE) may require some custom processing in order to
     * retrieve parameter names and parameter values from the packet content.</p>
     */
    /**
     * @cfg {Object} baseParams
     * 表单请求时传递的参数，例{id: '123', foo: 'bar'}。
     * Parameters to pass with all requests. e.g. baseParams: {id: '123', foo: 'bar'}.
     */
    /**
     * @cfg {Number} timeout 
     * 表单动作的超时秒数（默认30秒）。
     * Timeout for form actions in seconds (default is 30 seconds).
     */
    timeout: 30,

    // private
    activeAction : null,

    /**
     * @cfg {Boolean} trackResetOnLoad 
     * 如果为true，则表单对象的form.reset()方法重置到最后一次加载的数据或setValues()数据，以相对于一开始创建表单那时的数据。 
     * If set to true, form.reset() resets to the last loaded or setValues() data instead of when the form was first created.
     */
    trackResetOnLoad : false,

    /**
     * @cfg {Boolean} standardSubmit If set to true, standard HTML form submits are used instead of XHR (Ajax) style
     * form submissions. (defaults to false)<br>
     * <p><b>Note:</b> When using standardSubmit, any the options to {@link #submit} are
     * ignored because Ext's Ajax infrastracture is bypassed. To pass extra parameters, you will need to create
     * hidden fields within the form.</p>
     */
    /**
     * 默认的等待提示窗口为Ext.MessageBox.wait。也可以指定一个对象或它的ID做为遮罩目标，如果指定为真则直接遮罩在表单对象上 By default wait messages are displayed with Ext.MessageBox.wait. You can target a specific
     * element by passing it or its id or mask the form itself by passing in true.
     * @type Mixed
     * @property waitMsgTarget
     */
    // 私有的
    // private
    initEl : function(el){
        this.el = Ext.get(el);
        this.id = this.el.id || Ext.id();
        if(!this.standardSubmit){
            this.el.on('submit', this.onSubmit, this);
        }
        this.el.addClass('x-form');
    },

    /**
     * 如果客户端的验证通过则返回真 Get the HTML form Element
     * @return Ext.Element
     */
    getEl: function(){
        return this.el;
    },
    // 私有的
    // private
    onSubmit : function(e){
        e.stopEvent();
    },
    // 私有的
    // private
    destroy: function() {
        this.items.each(function(f){
            Ext.destroy(f);
        });
        if(this.el){
            this.el.removeAllListeners();
            this.el.remove();
        }
        this.purgeListeners();
    },

    /**
     * 如果客户端的验证通过则返回真。
     * Returns true if client-side validation on the form is successful.
     * @return Boolean
     */
    isValid : function(){
        var valid = true;
        this.items.each(function(f){
           if(!f.validate()){
               valid = false;
           }
        });
        return valid;
    },

    /**
     * 表单加载后，一旦有任何一个表单元素被修了，就返回真。
     * Returns true if any fields in this form have changed since their original load.
     * @return Boolean
     */
    isDirty : function(){
        var dirty = false;
        this.items.each(function(f){
           if(f.isDirty()){
               dirty = true;
               return false;
           }
        });
        return dirty;
    },

    /**
     * 执行一个预定义的(提交或加载)或一个在表单上自定义的动作，Performs a predefined action ({@link Ext.form.Action.Submit} or
     * {@link Ext.form.Action.Load}) or a custom extension of {@link Ext.form.Action} 
     * to perform application-specific processing.
     * @param {String/Object} actionName The name of the predefined action type, 行为名称
     * or instance of {@link Ext.form.Action} to perform.
     * @param {Object} options (optional) The options to pass to the {@link Ext.form.Action}. 
     * All of the config options listed below are supported by both the submit
     * and load actions unless otherwise noted (custom actions could also accept
     * other config options):<ul>
     * 传递给行动作象的选项配制。除非另有声明（自定义的动作仍然可以有附加的选项配制），下面是所有提供给提交与加载动作的选项配制列表。
     * <li><b>url</b> : String<p style="margin-left:1em">The url for the action (defaults
     * to the form's url.)</p></li>
     * <li><b>method</b> : String<p style="margin-left:1em">The form method to use (defaults
     * to the form's method, or POST if not defined)</p></li>
     * <li><b>params</b> : String/Object<p style="margin-left:1em">The params to pass
     * (defaults to the form's baseParams, or none if not defined)</p></li>
     * <li><b>headers</b> : Object<p style="margin-left:1em">Request headers to set for the action
     * (defaults to the form's default headers)</p></li>
     * <li><b>success</b> : Function<p style="margin-left:1em">The callback that will
     * be invoked after a successful response. The function is passed the following parameters:<ul>
     * <li><code>form</code> : Ext.form.BasicForm<div class="sub-desc">The form that requested the action</div></li>
     * <li><code>action</code> : Ext.form.Action<div class="sub-desc">The {@link Ext.form.Action Action} object which
     * performed the operation. The {@link Ext.form.Action#result result}
     * property of this object may be examined to perform custom postprocessing.</div></li>
     * </ul></p></li>
     * <li><b>failure</b> : Function<p style="margin-left:1em">The callback that will
     * be invoked after a failed transaction attempt.  This is invoked for field validation failure,
     * communication failure, and in the case of the server returning a failure response packet.
     * Which type of failure is indicated in the Action's {@link Ext.form.Action#failureType failureType}.
     * The function is passed the following parameters:<ul>
     * <li><code>form</code> : Ext.form.BasicForm<div class="sub-desc">The form that requested the action</div></li>
     * <li><code>action</code> : Ext.form.Action<div class="sub-desc">The {@link Ext.form.Action Action} object which
     * performed the operation. The failure type
     * will be in {@link Ext.form.Action#failureType failureType}. The {@link Ext.form.Action#result result}
     * property of this object may be examined to perform custom postprocessing.</div></li>
     * </ul></p></li>
     * <li><b>scope</b> : Object<p style="margin-left:1em">The scope in which to call the
     * callback functions (The <tt>this</tt> reference for the callback functions).</p></li>
     * <li><b>clientValidation</b> : Boolean<p style="margin-left:1em">Submit Action only.
     * Determines whether a Form's fields are validated in a final call to
     * {@link Ext.form.BasicForm#isValid isValid} prior to submission. Set to <tt>false</tt>
     * to prevent this. If undefined, pre-submission field validation is performed.</p></li></ul>
     * 属性					类型					描述
     * 	----------------  	---------------  	----------------------------------------------------------------------------------
     *	url					String				动作请求的url		（默认为表单的url）
     * 	method				String				表单使用的提交方式 	（默认为表单的方法，如果没有指定则"POST"）
     * 	params				String/Object		要传递的参数		（默认为表单的基本参数，如果没有指定则为空）
     *	clientValidation	Boolean				只应用到提交方法。为真则在提交前调用表单对像的isValid方法，实现在客户端的验证。（默认为假）
     * @return {BasicForm} this
     */
    doAction : function(action, options){
        if(typeof action == 'string'){
            action = new Ext.form.Action.ACTION_TYPES[action](this, options);
        }
        if(this.fireEvent('beforeaction', this, action) !== false){
            this.beforeAction(action);
            action.run.defer(100, action);
        }
        return this;
    },

    /**
     * 做提交动作的简便方法。Shortcut to do a submit action.
     * @param {Object} options 传递给动作对象的选项配制 (请见 options The options to pass to the action (see {@link #doAction} for details).<br>
     * <p><b>Note:</b> this is ignored when using the {@link #standardSubmit} option.</p>
     * <p>The following code:</p><pre><code>
myFormPanel.getForm().submit({
    clientValidation: true,
    url: 'updateConsignment.php',
    params: {
        newStatus: 'delivered'
    },
    success: function(form, action) {
       Ext.Msg.alert("Success", action.result.msg);
    },
    failure: function(form, action) {
        switch (action.failureType) {
            case Ext.form.Action.CLIENT_INVALID:
                Ext.Msg.alert("Failure", "Form fields may not be submitted with invalid values");
                break;
            case Ext.form.Action.CONNECT_FAILURE:
                Ext.Msg.alert("Failure", "Ajax communication failed");
                break;
            case Ext.form.Action.SERVER_INVALID:
               Ext.Msg.alert("Failure", action.result.msg);
       }
    }
});
</code></pre>
     * would process the following server response for a successful submission:<pre><code>
{
    success: true,
    msg: 'Consignment updated'
}
</code></pre>
     * and the following server response for a failed submission:<pre><code>
{
    success: false,
    msg: 'You do not have permission to perform this operation'
}
</code></pre>
     * @return {BasicForm} this
     */
    submit : function(options){
        if(this.standardSubmit){
            var v = this.isValid();
            if(v){
                this.el.dom.submit();
            }
            return v;
        }
        this.doAction('submit', options);
        return this;
    },

    /**
     * load动作的简写方式。
     * Shortcut to do a load action.
     * @param {Object} options 传到{@link #doAction}的参数 The options to pass to the action (see {@link #doAction} for details)
     * @return {BasicForm} this
     */
    load : function(options){
        this.doAction('load', options);
        return this;
    },

    /**
     * 表单内的元素数据考贝到所传递的Ext.data.Record对象中(beginEdit/endEdit块中进行赋值操作)。
     * Persists the values in this form into the passed Ext.data.Record object in a beginEdit/endEdit block.
     * @param {Record} record 要编辑的record The record to edit
     * @return {BasicForm} this
     */
    updateRecord : function(record){
        record.beginEdit();
        var fs = record.fields;
        fs.each(function(f){
            var field = this.findField(f.name);
            if(field){
                record.set(f.name, field.getValue());
            }
        }, this);
        record.endEdit();
        return this;
    },

    /**
     * 加载Ext.data.Record对象的数据到表单元素中。 Loads an Ext.data.Record into this form.
     * @param {Record} record 加载的record The record to load
     * @return {BasicForm} this
     */
    loadRecord : function(record){
        this.setValues(record.data);
        return this;
    },
    // 私有的
    // private
    beforeAction : function(action){
        var o = action.options;
        if(o.waitMsg){
            if(this.waitMsgTarget === true){
                this.el.mask(o.waitMsg, 'x-mask-loading');
            }else if(this.waitMsgTarget){
                this.waitMsgTarget = Ext.get(this.waitMsgTarget);
                this.waitMsgTarget.mask(o.waitMsg, 'x-mask-loading');
            }else{
                Ext.MessageBox.wait(o.waitMsg, o.waitTitle || this.waitTitle || 'Please Wait...');
            }
        }
    },
     // 私有的
    // private
    afterAction : function(action, success){
        this.activeAction = null;
        var o = action.options;
        if(o.waitMsg){
            if(this.waitMsgTarget === true){
                this.el.unmask();
            }else if(this.waitMsgTarget){
                this.waitMsgTarget.unmask();
            }else{
                Ext.MessageBox.updateProgress(1);
                Ext.MessageBox.hide();
            }
        }
        if(success){
            if(o.reset){
                this.reset();
            }
            Ext.callback(o.success, o.scope, [this, action]);
            this.fireEvent('actioncomplete', this, action);
        }else{
            Ext.callback(o.failure, o.scope, [this, action]);
            this.fireEvent('actionfailed', this, action);
        }
    },

    /**
     * 按传递的ID、索引或名称查询表单中的元素。 
     * Find a Ext.form.Field in this form by id, dataIndex, name or hiddenName.
     * @param {String} id 所要查询的值 id The value to search for
     * @return Field
     */
    findField : function(id){
        var field = this.items.get(id);
        if(!field){
            this.items.each(function(f){
                if(f.isFormField && (f.dataIndex == id || f.id == id || f.getName() == id)){
                    field = f;
                    return false;
                }
            });
        }
        return field || null;
    },

    /**
     * 可批量地标记表单元素为失效的。
     * Mark fields in this form invalid in bulk.
     * @param {Array/Object}  errors 即可以是像这样的[{id:'fieldId', msg:'The message'},...]的数组，也可以是像这样 {id: msg, id2: msg2} 的一个HASH结构对象。Either an array in the form [{id:'fieldId', msg:'The message'},...], or an object hash of {id: msg, id2: msg2}
     * @return {BasicForm} this
     */
    markInvalid : function(errors){
        if(Ext.isArray(errors)){
            for(var i = 0, len = errors.length; i < len; i++){
                var fieldError = errors[i];
                var f = this.findField(fieldError.id);
                if(f){
                    f.markInvalid(fieldError.msg);
                }
            }
        }else{
            var field, id;
            for(id in errors){
                if(typeof errors[id] != 'function' && (field = this.findField(id))){
                    field.markInvalid(errors[id]);
                }
            }
        }
        return this;
    },

    /**
     * 表单元素批量赋值。 
     * Set values for fields in this form in bulk.
     * @param {Array/Object} values 既可以是数组也或是可以是像这样的一个HASH结构对象。 
     * Either an arrayor an object hash in the form:<br><br><code><pre>
[{id:'clientName', value:'Fred. Olsen Lines'},
 {id:'portOfLoading', value:'FXT'},
 {id:'portOfDischarge', value:'OSL'} ]</pre></code><br><br>
     * @return {BasicForm} this
     */
    setValues : function(values){
        if(Ext.isArray(values)){ // array of objects
            for(var i = 0, len = values.length; i < len; i++){
                var v = values[i];
                var f = this.findField(v.id);
                if(f){
                    f.setValue(v.value);
                    if(this.trackResetOnLoad){
                        f.originalValue = f.getValue();
                    }
                }
            }
        }else{ // object hash
            var field, id;
            for(id in values){
                if(typeof values[id] != 'function' && (field = this.findField(id))){
                    field.setValue(values[id]);
                    if(this.trackResetOnLoad){
                        field.originalValue = field.getValue();
                    }
                }
            }
        }
        return this;
    },

    /**
     * <p>
     * 返回以键/值形式包函表单所有元素的信息对象。 
     * 如果表单元素中有相同名称的对象，则返回一个同名数组。 </p> 
     * <p>
     * Returns the fields in this form as an object with key/value pairs as they would be submitted using a standard form submit.
     * If multiple fields exist with the same name they are returned as an array.</p>
     * <p><b>Note:</b> The values are collected from all enabled HTML input elements within the form, <u>not</u> from
     * the Ext Field objects. This means that all returned values are Strings (or Arrays of Strings) and that the the
     * value can potentionally be the emptyText of a field.</p>
     * <p><b>Note:</b> The values are collected from all enabled HTML input elements within the form, <u>not</u> from
     * the Ext Field objects. This means that all returned values are Strings (or Arrays of Strings) and that the the
     * value can potentionally be the emptyText of a field.</p>
     * @param {Boolean} asString 如果为真则返回一个字串，如果为假则返回一个键/值对象。（默认为假） (optional)false to return the values as an object (defaults to returning as a string)
     * @return {String/Object}
     */
    getValues : function(asString){
        var fs = Ext.lib.Ajax.serializeForm(this.el.dom);
        if(asString === true){
            return fs;
        }
        return Ext.urlDecode(fs);
    },

    getFieldValues : function(){
        var o = {};
        this.items.each(function(f){
           o[f.getName()] = f.getValue();
        });
        return o;
    },

    /**
     * 清除表单中全部由校验错误的信息。
     * Clears all invalid messages in this form.
     * @return {BasicForm} this
     */
    clearInvalid : function(){
        this.items.each(function(f){
           f.clearInvalid();
        });
        return this;
    },

    /**
     * 重置表单。
     * Resets this form.
     * @return {BasicForm} this
     */
    reset : function(){
        this.items.each(function(f){
            f.reset();
        });
        return this;
    },

    /**
     * 向表单中加入组件，成为collection中的一员。这样做不会渲染传入的组件，只会通知表单要验证这个field，或分配值给field。
     * Add Ext.form Components to this form's Collection. 
     * This does not result in rendering of
     * the passed Component, 
     * it just enables the form to validate Fields, and distribute values to Fields.
     * <p><b>通常你不会用到该函数。要渲染的话，应该是在{@link Ext.Container Container}中加入Field，
     * 准确些来说是其子类{@link Ext.form.FormPanel FormPanel}。FormPanel会其Collection内子元素特别处理与协调。</b></p>
     * <p><b>You will not usually call this function. In order to be rendered, a Field must be added
     * to a {@link Ext.Container Container}, usually an {@link Ext.form.FormPanel FormPanel}.
     *  The FormPanel to which the field is added takes care of adding the Field to the BasicForm's
     * collection.</b></p>
     * @param {Field} field1
     * @param {Field} field2 (optional)
     * @param {Field} etc (optional)
     * @return {BasicForm} this
     */
    add : function(){
        this.items.addAll(Array.prototype.slice.call(arguments, 0));
        return this;
    },


    /**
     * 从表单对象集中清除一个元素（不清除它的页面标签）。
     * Removes a field from the items collection (does NOT remove its markup).
     * @param {Field} field
     * @return {BasicForm} this
     */
    remove : function(field){
        this.items.remove(field);
        return this;
    },

    /**
     * 遍历表单所有已{@link #add 添加}的{@link Ext.form.Field Field}元素，获取他们的id值，并生成到对应的dom元素上（用{@link Ext.form.Field#applyToMarkup}方法）。
     * Iterates through the {@link Ext.form.Field Field}s,which have been {@link #add add}ed to this BasicForm,
     * checks them for an id attribute, and calls {@link Ext.form.Field#applyToMarkup} on the existing dom element with that id.
     * @return {BasicForm} this
     */
    render : function(){
        this.items.each(function(f){
            if(f.isFormField && !f.rendered && document.getElementById(f.id)){ // if the element exists
                f.applyToMarkup(f.id);
            }
        });
        return this;
    },

    /**
     * 遍历表单元素，对每一个元素调用{@link Ext#apply}方法，附加上传入的对象参数。 
     * Calls {@link Ext#apply} for all fields in this form with the passed object.
     * @param {Object} values
     * @return {BasicForm} this
     */
    applyToFields : function(o){
        this.items.each(function(f){
           Ext.apply(f, o);
        });
        return this;
    },

    /**
     * 遍历表单元素，对每一个元素调用{@link Ext#applyIf}方法，附加上传入的对象参数。 
     * Calls {@link Ext#applyIf} for all field in this form with the passed object.
     * @param {Object} values
     * @return {BasicForm} this
     */
    applyIfToFields : function(o){
        this.items.each(function(f){
           Ext.applyIf(f, o);
        });
        return this;
    },

    callFieldMethod : function(fnName, args){
        args = args || [];
        this.items.each(function(f){
            if(typeof f[fnName] == 'function'){
                f[fnName].apply(f, args);
            }
        });
        return this;
    }
});

// back compat
Ext.BasicForm = Ext.form.BasicForm;