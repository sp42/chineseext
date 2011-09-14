/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=90 Ext中文站翻译小组
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
 * @class Ext.form.FormPanel
 * @extends Ext.Panel
 * Standard form container.
 * <p><b>使用js为类{@link Ext.form.BasicForm}添加动态加载效果的能力<br />Although they are not listed, this class also accepts all the config options required to configure its internal {@link Ext.form.BasicForm}</b></p>
 * <p>The BasicForm is configured using the {@link #initialConfig} of the FormPanel - that is the configuration object passed to the constructor.
 * This means that if you subclass FormPanel, and you wish to configure the BasicForm, you will need to insert any configuration options
 * for the BasicForm into the <tt><b>initialConfig</b></tt> property. Applying BasicForm configuration settings to <b><tt>this</tt></b> will
 * not affect the BasicForm's configuration.</p>
 * <p>By default, FormPanel uses an {@link Ext.layout.FormLayout} layout manager, which styles and renders fields and labels correctly.
 * When nesting additional Containers within a FormPanel, you should ensure that any descendant Containers which
 * host input Fields use the {@link Ext.layout.FormLayout} layout manager.</p>
 * <p>By default, Ext Forms are submitted through Ajax, using {@link Ext.form.Action}.
 * To enable normal browser submission of the Ext Form contained in this FormPanel,
 * use the {@link Ext.form.BasicForm#standardSubmit standardSubmit) option:</p><pre><code>
var myForm = new Ext.form.FormPanel({
    standardSubmit: true,
    items: myFieldset
});</code></pre>
 * @constructor
 * @param {Object} config 配置选项 Configuration options
 */
Ext.FormPanel = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {String} formId （可选的）FORM标签的id（默认是自动生成的）。
	 * (optional) The id of the FORM tag (defaults to an auto-generated id).
	 */
    /**
     * @cfg {Number} labelWidth 标签的宽度。该属性级联于子容器。
     * The width of labels. This property cascades to child containers and can be overridden
     * on any child container (e.g., a fieldset can specify a different labelWidth for its fields).
     */
    /**
     * @cfg {String} itemCls 一个应用字段“x-form-item”的样式（css）类型，该属性级联于子容器。
     * A css class to apply to the x-form-item of fields. This property cascades to child containers.
     */
    /**
     * @cfg {Array} buttons 送入{@link Ext.Button}或其配置组成的数组来创建按钮，在FormPanel的底部。<br>
     * An array of {@link Ext.Button}s or {@link Ext.Button} configs used to add buttons to the footer of this FormPanel.<br>
     * <p>Buttons in the footer of a FormPanel may be configured with the option <tt>formBind: true</tt>. This causes
     * the form's {@link #monitorValid valid state monitor task} to enable/disable those Buttons depending on
     * the form's valid/invalid state.</p>
     */
    /**
     * @cfg {String} buttonAlign 有效值为"left," "center" 和 "right"(默认为"center")。
     * Valid values are "left," "center" and "right" (defaults to "center")
     */
    buttonAlign:'center',

    /**
     * @cfg {Number} minButtonWidth 每个button的最小宽度（默认75）。
     * Minimum width of all buttons in pixels (defaults to 75)
     */
    minButtonWidth:75,

    /**
     * @cfg {String} labelAlign 有效值为"left," "top" 和 "right" (默认为"left")。该属性级联于没有设定此属性的子容器。 
     * Valid values are "left," "top" and "right" (defaults to "left").
     * This property cascades to child containers and can be overridden on any child container 
     * (e.g., a fieldset can specify a different labelAlign for its fields).
     */
    labelAlign:'left',

    /**
     * @cfg {Boolean} monitorValid true表示为通过不断触发一个事件，来监视有效值的状态（<b>在客户端进行</b>）  If true, the form monitors its valid state <b>client-side</b> and
     * regularly fires the {@link #clientvalidation} event passing that state.<br>
     * <p>该项须绑定到有配置项formBind:true的按钮的valid state When monitoring valid state, the FormPanel enables/disables any of its configured
     * {@link #button}s which have been configured with <tt>formBind: true<tt> depending
     * on whether the form is valid or not.</p>
     */
    monitorValid : false,

    /**
     * @cfg {Number} monitorPoll 检验valid state的间隔毫秒数，如monitorValid非真则忽略改项（默认为200）。
     * The milliseconds to poll valid state, ignored if monitorValid is not true (defaults to 200)
     */
    monitorPoll : 200,

    layout:'form',

    // private
    initComponent :function(){
        this.form = this.createForm();
        Ext.FormPanel.superclass.initComponent.call(this);

        this.bodyCfg = {
            tag: 'form',
            cls: this.baseCls + '-body',
            method : this.method || 'POST',
            id : this.formId || Ext.id()
        };
        if(this.fileUpload) {
            this.bodyCfg.enctype = 'multipart/form-data';
        }
        this.initItems();
        
        this.addEvents(
            /**
             * @event clientvalidation
             * 如果配置项monitorValid为true，那么为通知验证的状态（valid state）该事件将不断地触发。
             * If the monitorValid config option is true, this event fires repetitively to notify of valid state
             * @param {Ext.form.FormPanel} this
             * @param {Boolean} valid 如果客户端验证都通过的话传入一个true true if the form has passed client-side validation
             */
            'clientvalidation'
        );

        this.relayEvents(this.form, ['beforeaction', 'actionfailed', 'actioncomplete']);
    },

    // private
    createForm: function(){
        delete this.initialConfig.listeners;
        return new Ext.form.BasicForm(null, this.initialConfig);
    },

    // private
    initFields : function(){
        var f = this.form;
        var formPanel = this;
        var fn = function(c){
            if(formPanel.isField(c)){
                f.add(c);
            }if(c.isFieldWrap){
                Ext.applyIf(c, {
                    labelAlign: c.ownerCt.labelAlign,
                    labelWidth: c.ownerCt.labelWidth,
                    itemCls: c.ownerCt.itemCls
                });
                f.add(c.field);
            }else if(c.doLayout && c != formPanel){
                Ext.applyIf(c, {
                    labelAlign: c.ownerCt.labelAlign,
                    labelWidth: c.ownerCt.labelWidth,
                    itemCls: c.ownerCt.itemCls
                });
                if(c.items){
                    c.items.each(fn, this);
                }
            }
        };
        this.items.each(fn, this);
    },

    // private
    getLayoutTarget : function(){
        return this.form.el;
    },

    /**
     * 返回该面板包含的{@link Ext.form.BasicForm Form}。
     * Provides access to the {@link Ext.form.BasicForm Form} which this Panel contains.
     * @return {Ext.form.BasicForm} 返回面板对象包含的 {@link Ext.form.BasicForm Form}以供访问。 The {@link Ext.form.BasicForm Form} which this Panel contains.
     */
    getForm : function(){
        return this.form;
    },

    // private
    onRender : function(ct, position){
        this.initFields();
        Ext.FormPanel.superclass.onRender.call(this, ct, position);
        this.form.initEl(this.body);
    },
    
    // private
    beforeDestroy: function(){
        Ext.FormPanel.superclass.beforeDestroy.call(this);
        this.stopMonitoring();
        Ext.destroy(this.form);
    },

	// Determine if a Component is usable as a form Field.
    isField: function(c) {
        return !!c.setValue && !!c.getValue && !!c.markInvalid && !!c.clearInvalid;
    },

    // private
    initEvents : function(){
        Ext.FormPanel.superclass.initEvents.call(this);
        this.on('remove', this.onRemove, this);
        this.on('add', this.onAdd, this);
        if(this.monitorValid){ // initialize after render
            this.startMonitoring();
        }
    },
    
    // private
    onAdd : function(ct, c) {
		// If a single form Field, add it
        if (this.isField(c)) {
            this.form.add(c);
		// If a Container, add any Fields it might contain
        } else if (c.findBy) {
            Ext.applyIf(c, {
                labelAlign: c.ownerCt.labelAlign,
                labelWidth: c.ownerCt.labelWidth,
                itemCls: c.ownerCt.itemCls
            });
            this.form.add.apply(this.form, c.findBy(this.isField));
        }
    },
	
    // private
    onRemove : function(ct, c) {
		// If a single form Field, remove it
        if (this.isField(c)) {
            Ext.destroy(c.container.up('.x-form-item'));
        	this.form.remove(c);
		// If a Container, remove any Fields it might contain
        } else if (c.findByType) {
            Ext.each(c.findBy(this.isField), this.form.remove, this.form);
        }
    },

    /**
     * 开始监视该表单的验证过程。通常这是由配置项"monitorValid"完成的。
     * Starts monitoring of the valid state of this form. Usually this is done by passing the config option "monitorValid"
     */
    startMonitoring : function(){
        if(!this.bound){
            this.bound = true;
            Ext.TaskMgr.start({
                run : this.bindHandler,
                interval : this.monitorPoll || 200,
                scope: this
            });
        }
    },

    /**
     * 停止监视该form的验证状态。
     * Stops monitoring of the valid state of this form
     */
    stopMonitoring : function(){
        this.bound = false;
    },

    /**
     * 这是BasicForm{@link Ext.form.BasicForm#load}方法调用时所在的代理。
     * This is a proxy for the underlying BasicForm's {@link Ext.form.BasicForm#load} call.
     * @param {Object} options 传入动作的选项（参阅{@link Ext.form.BasicForm#doAction}了解更多）。The options to pass to the action (see {@link Ext.form.BasicForm#doAction} for details)
     */
    load : function(){
        this.form.load.apply(this.form, arguments);  
    },

    // private
    onDisable : function(){
        Ext.FormPanel.superclass.onDisable.call(this);
        if(this.form){
            this.form.items.each(function(){
                 this.disable();
            });
        }
    },

    // private
    onEnable : function(){
        Ext.FormPanel.superclass.onEnable.call(this);
        if(this.form){
            this.form.items.each(function(){
                 this.enable();
            });
        }
    },

    // private
    bindHandler : function(){
        if(!this.bound){
            return false; // stops binding
        }
        var valid = true;
        this.form.items.each(function(f){
            if(!f.isValid(true)){
                valid = false;
                return false;
            }
        });
        if(this.fbar){
            var fitems = this.fbar.items.items;
            for(var i = 0, len = fitems.length; i < len; i++){
                var btn = fitems[i];
                if(btn.formBind === true && btn.disabled === valid){
                    btn.setDisabled(!valid);
                }
            }
        }
        this.fireEvent('clientvalidation', this, valid);
    }
});
Ext.reg('form', Ext.FormPanel);

Ext.form.FormPanel = Ext.FormPanel;

