/**
 * @class Ext.form.Form
 * @extends Ext.form.BasicForm
 * 使用js为类{@link Ext.form.BasicForm}添加动态加载效果的能力
 * @constructor
 * @param {Object} config 配置选项
 */Ext.FormPanel = Ext.extend(Ext.Panel, {
 /**
     * @cfg {Number} labelWidth  标签的宽度。该属性级联于子容器。
     */
    /**
     * @cfg {String} itemCls一个应用字段“x-form-item”的样式（css）类型，该属性级联于子容器
     */
    /**
     * @cfg {String} buttonAlign 有效值为"left," "center" 和 "right" (默认为"center")
     */
    buttonAlign:'center',

     /**
     * @cfg {Number} minButtonWidth  每个button的最小宽度（默认75）
     */
    minButtonWidth:75,

  
    /**
     * @cfg {String} labelAlign 有效值为"left," "top" 和 "right" (默认为"left")。
     * 该属性级联于没有设定此属性的子容器。
     */
    labelAlign:'left',
/**
     * @cfg {Boolean} monitorValid true表示为通过不断触发一个事件，来监视有效值的状态（<b>在客户端进行</b>） 
     * 该项须绑定到有配置项formBind:true的按钮的valid state
     */
    monitorValid : false,

   
    /**
     * @cfg {Number} monitorPoll 检验valid state的间隔毫秒数，如monitorValid非真则忽略改项。（默认为200）
     */
    monitorPoll : 200,

      /**
     * 在布局堆栈中打开一个新的{@link Ext.form.Column}类容器。如果所有域在配置之后被通过，域将被添加同时该column被关闭，
     * 如果没有域被通过该column仍然打开，直至end（）方法被调用。
     * @param {Object} config 传入column的配置
     * @param {Field} field1 (可选的) 参数变量field1（Field类型）
     * @param {Field} field2 (可选的) 参数变量field2（Field类型）
     * @param {Field} etc (可选的) 可以自行添加多个域参数
     * @return Column 该column容器对象
     */
    layout: 'form',

    // private
    initComponent :function(){
        this.form = this.createForm();
        
        Ext.FormPanel.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event clientvalidation
             * If the monitorValid config option is true, this event fires repetitively to notify of valid state
             * 如果配置项monitorValid为true，那么为通知验证的状态（valid state）该事件将不断地触发。
             * @param {Ext.form.FormPanel} this
             * @param {Boolean} 如果客户端验证都通过的话传入一个true
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
            if(c.doLayout && c != formPanel){
                Ext.applyIf(c, {
                    labelAlign: c.ownerCt.labelAlign,
                    labelWidth: c.ownerCt.labelWidth,
                    itemCls: c.ownerCt.itemCls
                });
                if(c.items){
                    c.items.each(fn);
                }
            }else if(c.isFormField){
                f.add(c);
            }
        }
        this.items.each(fn);
    },

    // private
    getLayoutTarget : function(){
        return this.form.el;
    },

    /**
     * Provides access to the {@link Ext.form.BasicForm Form} which this Panel contains.
     * 返回面板对象包含的 {@link Ext.form.BasicForm Form}以供访问。
     * @return {Ext.form.BasicForm} The {@link Ext.form.BasicForm Form} which this Panel contains. 该面板对象包含的 {@link Ext.form.BasicForm Form}
     */
    getForm : function(){
        return this.form;
    },

    // private
    onRender : function(ct, position){
        this.initFields();

        Ext.FormPanel.superclass.onRender.call(this, ct, position);
        var o = {
            tag: 'form',
            method : this.method || 'POST',
            id : this.formId || Ext.id()
        };
        if(this.fileUpload) {
            o.enctype = 'multipart/form-data';
        }
        this.form.initEl(this.body.createChild(o));
    },
    
    // private
    beforeDestroy: function(){
        Ext.FormPanel.superclass.beforeDestroy.call(this);
        Ext.destroy(this.form);
    },

    // private
    initEvents : function(){
        Ext.FormPanel.superclass.initEvents.call(this);
		this.items.on('remove', this.onRemove, this);
		this.items.on('add', this.onAdd, this);
        if(this.monitorValid){ // initialize after render
            this.startMonitoring();
        }
    },
    
    // private
	onAdd : function(ct, c) {
		if (c.isFormField) {
			this.form.add(c);
		}
	},
	
	// private
	onRemove : function(c) {
		if (c.isFormField) {
			Ext.destroy(c.container.up('.x-form-item'));
			this.form.remove(c);
		}
	},

    /**
     * Starts monitoring of the valid state of this form. Usually this is done by passing the config
     * option "monitorValid"
     * 开始监视该表单的验证过程。通常这是由配置项"monitorValid"完成的。
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
     */
    stopMonitoring : function(){
        this.bound = false;
    },

    /**
     * 这是BasicForm{@link Ext.form.BasicForm#load}方法调用时所在的代理。
     * @param {Object} options The options to pass to the action (see {@link Ext.form.BasicForm#doAction} for details)
     * 传入动作的选项（参阅{@link Ext.form.BasicForm#doAction}了解更多）。
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
        if(this.buttons){
            for(var i = 0, len = this.buttons.length; i < len; i++){
                var btn = this.buttons[i];
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