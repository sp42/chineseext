
/**
 * @类 Ext.form.Action.Submit
 * @继承于 Ext.form.Action
 * <p>处理数据表单{@link Ext.form.BasicForm Form} 和返回的response对象的类。</p>
 * <p>该类的实例仅在表单{@link Ext.form.BasicForm#submit submit}的时候由{@link Ext.form.BasicForm Form}创建。</p>
 * <p>返回的数据包必须包含一个 boolean 类型的<tt style="font-weight:bold">success</tt> 属性,和一个含有无效字段的错误信息的可选<tt style="font-weight:bold">errors</tt> 属性。</p>
 * <p>默认情况下，response数据包被认为是一个JSON对象, 所以典型的response数据包看起来像是这样的:</p><pre><code>
{
    success: false,
    errors: {
        clientCode: "Client not found",
        portOfLoading: "This field must not be null"
    }
}</code></pre>
 * <p>其他的数据可能会由{@link Ext.form.BasicForm}的回调函数甚至事件处理函数置入response,由这个JSON解码的对象也在{@link #result} 属性里。
 * <p>另外, 如果指定了一个{@link Ext.data.XmlReader XmlReader}的{@link #errorReader}:</p><pre><code>
    errorReader: new Ext.data.XmlReader({
            record : 'field',
            success: '@success'
        }, [
            'id', 'msg'
        ]
    )
</code></pre>
 * <p>那么结果集将会以XML形式返回。:</p><pre><code>
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
 * <p>{@link Ext.form.BasicForm}表单的回调函数或者时间处理函数可以向相应的XML里置入其他的元素，XML文档在{@link #errorReader}的{@link Ext.data.XmlReader#xmlData xmlData}属性里。
 */
Ext.form.Action.Submit = function(form, options){
    Ext.form.Action.Submit.superclass.constructor.call(this, form, options);
};

Ext.extend(Ext.form.Action.Submit, Ext.form.Action, {
    /**
    * @cfg {Ext.data.DataReader} errorReader <b>可选的。 解读JSON对象不需要errorReader.</b>
    * <p>从返回结果中读取一条记录的Reader。DataReader的<b>success</b> 属性指明决定是否提交成功。Record对象的数据提供了任何未通过验证(非法)的表单字段的错误信息</P>
    */
    /**
    * @cfg {boolean} clientValidation Determines whether a Form's fields are validated
    * @cfg {boolean} clientValidation 表明一个表单的字段是否都合法。在表单最终提交前调用{@link Ext.form.BasicForm#isValid isValid}。
    * 在表单的提交选项中选择 <tt>false</tt> 可以避免执行该操作。如果没有定义改属性，执行提交前的表单验证。
    */
    type : 'submit',

    // 私有的
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
 * 类 Ext.form.Action.Load
 * @继承于 Ext.form.Action
 * <p>处理从服务器加载数据到{@link Ext.form.BasicForm}的字段的类。</p>
 * <p>该类的实例仅在{@link Ext.form.BasicForm Form}表单{@link Ext.form.BasicForm#load load}加载的时候才被创建。</p>
 * <p>相应数据包<b>必须</b>包含一个boolean类型的<tt style="font-weight:bold">success</tt>属性，和一个<tt style="font-weight:bold">data</tt> 属性。<tt style="font-weight:bold">data</tt> 属性
 * 包含了表单字段要加载的数据。每个值对象被传递到字段的{@link Ext.form.Field#setValue setValue}方法里。</p>
 * <p>默认情况下，相应数据包会被认为是一个JSON对象，所以典型的相应数据包看起来是这样的:</p><pre><code>
{
    success: true,
    data: {
        clientName: "Fred. Olsen Lines",
        portOfLoading: "FXT",
        portOfDischarge: "OSL"
    }
}</code></pre>
 * <p>
 * 其他的数据可以由{@link Ext.form.BasicForm Form}的回调函数甚至是事件处理函数置入response对象进行处理。解码的JSON对象在{@link #result}属性里。
 * </p>
 */
Ext.form.Action.Load = function(form, options){
    Ext.form.Action.Load.superclass.constructor.call(this, form, options);
    this.reader = this.form.reader;
};

Ext.extend(Ext.form.Action.Load, Ext.form.Action, {
    // private
    type : 'load',

    // private
    run : function(){
        Ext.Ajax.request(Ext.apply(
                this.createCallback(this.options), {
                    method:this.getMethod(),
                    url:this.getUrl(false),
                    headers: this.options.headers,
                    params:this.getParams()
        }));
    },

    // private
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

    // private
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