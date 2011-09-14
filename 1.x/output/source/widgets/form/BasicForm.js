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
 * @class Ext.form.BasicForm
 * @extends Ext.util.Observable
 * Supplies the functionality to do "actions" on forms and initialize Ext.form.Field types on existing markup.
 * 提供表单的多种动作("actions")功能，并且初始化 Ext.form.Field 类型在现有的标签上
 * @constructor
 * @param {String/HTMLElement/Ext.Element} el The form element or its id 表单对象或它的ID
 
 * @param {Object} config Configuration options 配置表单对象的配置项选项
 */
Ext.form.BasicForm = function(el, config){
    Ext.apply(this, config);
    /*
     * The Ext.form.Field items in this form.
     * 所有表单内元素的集合。
     * @type MixedCollection
     */
    this.items = new Ext.util.MixedCollection(false, function(o){
        return o.id || (o.id = Ext.id());
    });
    this.addEvents({
        /**
         * @event beforeaction
         * Fires before any action is performed. Return false to cancel the action.
         * 在任何动作被执行前被触发。如果返回假则取消这个动作
         * @param {Form} this
         * @param {Action} action action The action to be performed 要被执行的动作对象
         */
        beforeaction: true,
        /**
         * @event actionfailed
         * Fires when an action fails.
         * 当动作失败时被触发。
         * @param {Form} this
         * @param {Action} action  The action that failed 失败的动作对象
         */
        actionfailed : true,
        /**
         * @event actioncomplete
         * Fires when an action is completed.
         * 当动作完成时被触发。
         * @param {Form} this
         * @param {Action} action action The action that completed 完成的动作对象
         */
        actioncomplete : true
    });
    if(el){
        this.initEl(el);
    }
    Ext.form.BasicForm.superclass.constructor.call(this);
};

Ext.extend(Ext.form.BasicForm, Ext.util.Observable, {
    /**
     * @cfg {String} method
     * The request method to use (GET or POST) for form actions if one isn't supplied in the action options.
     * 所有动作的默认表单请求方法(GET 或 POST)
     */
    /**
     * @cfg {DataReader} reader
     * An Ext.data.DataReader (e.g. {@link Ext.data.XmlReader}) to be used to read data when executing "load" actions.
     * This is optional as there is built-in support for processing JSON.
     * 一个Ext.data.DataReader对象(e.g. {@link Ext.data.XmlReader})，当执行"load"动作时被用来读取数据
     * 它是一个可选项，因为这里已经有了一个内建对象来读取JSON数据
     */
    /**
     * @cfg {DataReader} errorReader
     * An Ext.data.DataReader (e.g. {@link Ext.data.XmlReader}) to be used to read data when reading validation errors on "submit" actions.
     * This is completely optional as there is built-in support for processing JSON.
     * 一个Ext.data.DataReader对象(e.g. {@link Ext.data.XmlReader})，当执行"submit"动作出错时被用来读取数据
     */
    /**
     * @cfg {String} url
     * The URL to use for form actions if one isn't supplied in the action options.
     * 当动作选项未指定url时使用
     */
    /**
     * @cfg {Boolean} fileUpload
     * Set to true if this form is a file upload.
     * 当为true时，表单为文件上传类型。
     */
    /**
     * @cfg {Object} baseParams
     * Parameters to pass with all requests. e.g. baseParams: {id: '123', foo: 'bar'}.
     * 表单请求时传递的参数。例,baseParams: {id: '123', foo: 'bar'}
     */
    /**
     * @cfg {Number} timeout Timeout for form actions in seconds (default is 30 seconds).
     * 表单动作的超时秒数（默认30秒）
     */
    timeout: 30,

    // private
    activeAction : null,

    /**
     * @cfg {Boolean} trackResetOnLoad If set to true, form.reset() resets to the last loaded
     * or setValues() data instead of when the form was first created.
     * 如果为true，表单对象的form.reset()方法重置到最后一次加载或setValues()数据，
     * 
     */
    trackResetOnLoad : false,

    /**
     * By default wait messages are displayed with Ext.MessageBox.wait. You can target a specific
     * element by passing it or its id or mask the form itself by passing in true.
     * 默认的等待提示窗口为Ext.MessageBox.wait。也可以指定一个对象或它的ID做为遮罩目标，如果指定为真则直接遮罩在表单对象上
     * @type Mixed
     */
    waitMsgTarget : undefined,

    // private
    initEl : function(el){
        this.el = Ext.get(el);
        this.id = this.el.id || Ext.id();
        this.el.on('submit', this.onSubmit, this);
        this.el.addClass('x-form');
    },

    // private
    onSubmit : function(e){
        e.stopEvent();
    },

    /**
     * Returns true if client-side validation on the form is successful.
     * 如果客户端的验证通过则返回真
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
     * Returns true if any fields in this form have changed since their original load.
     * 如果自从被加载后任何一个表单元素被修了，则返回真
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
     * Performs a predefined action (submit or load) or custom actions you define on this form.
     *  执行一个预定义的(提交或加载)或一个在表单上自定义的动作，
     * @param {String} actionName The name of the action type	行为名称
     * @param {Object} options (optional) The options to pass to the action.  All of the config options listed
     * below are supported by both the submit and load actions unless otherwise noted (custom actions could also
     * accept other config options):
     * 传递给行动作象的选项配制。除非另有声明（自定义的动作仍然可以有附加的选项配制），下面是所有提供给提交与加载动作的选项配制列表。
     * <pre>
	 *	Property          Type             Description
	 *	----------------  ---------------  ----------------------------------------------------------------------------------
	 *	url               String           The url for the action (defaults to the form's url)
	 *	method            String           The form method to use (defaults to the form's method, or POST if not defined)
	 *	params            String/Object    The params to pass (defaults to the form's baseParams, or none if not defined)
	 *	clientValidation  Boolean          Applies to submit only.  Pass true to call form.isValid() prior to posting to
     *                             validate the form on the client (defaults to false)
     * </pre>
     * 	属性					类型					描述
     * 	----------------  	---------------  	----------------------------------------------------------------------------------
     *	url					String				动作请求的url		（默认为表单的url）
     * 	method				String				表单使用的提交方式 	（默认为表单的方法，如果没有指定则"POST"）
     * 	params				String/Object		要传递的参数		（默认为表单的基本参数，如果没有指定则为空）
     *	clientValidation	Boolean				只应用到提交方法。为真则在提交前调用表单对像的isValid方法，实现在客户端的验证。（默认为假）
     * 
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
     * Shortcut to do a submit action.
     * 做提交动作的简便方法。
     * @param {Object} options The options to pass to the action (see {@link #doAction} for details)
     *					传递给动作对象的选项配制 (请见 {@link #doAction} )
     * @return {BasicForm} this
     */
    submit : function(options){
        this.doAction('submit', options);
        return this;
    },

    /**
     * Shortcut to do a load action.
     * 做加载动作的简便方法。
     * @param {Object} options The options to pass to the action (see {@link #doAction} for details)
     *					传递给动作对象的选项配制 (请见 {@link #doAction} )
     * @return {BasicForm} this
     */
    load : function(options){
        this.doAction('load', options);
        return this;
    },

    /**
     * Persists the values in this form into the passed Ext.data.Record object in a beginEdit/endEdit block.
     * 表单内的元素数据考贝到所传递的Ext.data.Record对象中(beginEdit/endEdit块中进行赋值操作)。
     * @param {Record} record The record to edit
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
     * Loads an Ext.data.Record into this form.
     * 加载Ext.data.Record对象的数据到表单元素中。
     * @param {Record} record The record to load
     * @return {BasicForm} this
     */
    loadRecord : function(record){
        this.setValues(record.data);
        return this;
    },

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
     * Find a Ext.form.Field in this form by id, dataIndex, name or hiddenName
     * 按传递的ID、索引或名称查询表单中的元素。
     * @param {String} id The value to search for 
     *					所要查询的值
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
     * Mark fields in this form invalid in bulk.
     * 可以批量的标记表单元素为失效的。
     * @param {Array/Object} errors Either an array in the form [{id:'fieldId', msg:'The message'},...] or an object hash of {id: msg, id2: msg2}
     *				即可以是像这样的 [{id:'fieldId', msg:'The message'},...] 数组，也可以是像这样 {id: msg, id2: msg2} 的一个HASH结构对象。
     * @return {BasicForm} this
     */
    markInvalid : function(errors){
        if(errors instanceof Array){
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
     * Set values for fields in this form in bulk.
     * 表单元素批量赋值。
     * @param {Array/Object} values Either an array in the form [{id:'fieldId', value:'foo'},...] or an object hash of {id: value, id2: value2}
     *					即可以是像这样的 [{id:'fieldId', value:'foo'},...] 数组，也可以是像这样 {id: value, id2: value2} 的一个HASH结构对象。
     * @return {BasicForm} this
     */
    setValues : function(values){
        if(values instanceof Array){ // array of objects
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
     * Returns the fields in this form as an object with key/value pairs. If multiple fields exist with the same name
     * 返回以键/值形式包函表单所有元素的信息对象。
     * they are returned as an array.
     * 如果表单元素中有相同名称的对象，则返回一个同名数组。
     * @param {Boolean} asString 如果为真则返回一个字串，如果为假则返回一个键/值对象。(默认为假)
     * @return {Object}
     */
    getValues : function(asString){
        var fs = Ext.lib.Ajax.serializeForm(this.el.dom);
        if(asString === true){
            return fs;
        }
        return Ext.urlDecode(fs);
    },

    /**
     * Clears all invalid messages in this form.
     * 清除表单中所有校验错误的显示信息。
     * @return {BasicForm} this
     */
    clearInvalid : function(){
        this.items.each(function(f){
           f.clearInvalid();
        });
        return this;
    },

    /**
     * Resets this form.
     * 重置表单。
     * @return {BasicForm} this
     */
    reset : function(){
        this.items.each(function(f){
            f.reset();
        });
        return this;
    },

    /**
     * Add Ext.form components to this form.
     * 向表单中清加组件。
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
     * Removes a field from the items collection (does NOT remove its markup).
     * 从表单对象集中清除一个元素（不清除它的页面标签）。
     * @param {Field} field
     * @return {BasicForm} this
     */
    remove : function(field){
        this.items.remove(field);
        return this;
    },

    /**
     * Looks at the fields in this form, checks them for an id attribute,
     * 遍历表单所有元素，以ID属性检查它们是否在页面上存在，
     * and calls applyTo on the existing dom element with that id.
     * 以它的ID为值调用每个元素的applyTo方法到现有的页面对象。
     * @return {BasicForm} this
     */
    render : function(){
        this.items.each(function(f){
            if(f.isFormField && !f.rendered && document.getElementById(f.id)){ // if the element exists
                f.applyTo(f.id);
            }
        });
        return this;
    },

    /**
     * Calls {@link Ext#apply} for all fields in this form with the passed object.
     * 遍历表单元素并以传递的对象为参调用 {@link Ext#apply} 方法。
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
     * Calls {@link Ext#applyIf} for all field in this form with the passed object.
     *  遍历表单元素并以传递的对象为参调用 {@link Ext#applyIf} 方法。
     * @param {Object} values
     * @return {BasicForm} this
     */
    applyIfToFields : function(o){
        this.items.each(function(f){
           Ext.applyIf(f, o);
        });
        return this;
    }
});

// back compat
Ext.BasicForm = Ext.form.BasicForm;