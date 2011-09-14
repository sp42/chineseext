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
 * @class Ext.form.Form
 * @extends Ext.form.BasicForm
 * 使用js为类{@link Ext.form.BasicForm}添加动态加载效果的能力
 * @constructor
 * @param {Object} config 配置选项
 */
Ext.form.Form = function(config){
    Ext.form.Form.superclass.constructor.call(this, null, config);
    this.url = this.url || this.action;
    if(!this.root){
        this.root = new Ext.form.Layout(Ext.applyIf({
            id: Ext.id()
        }, config));
    }
    this.active = this.root;
    /**
     * 通过addButton方法向该表单添加的全部button（数组类型）
     * @type Array
     */
    this.buttons = [];
    this.addEvents({
        /**
         * @event clientvalidation
         * If the 如果配置项monitorValid为true，, 该事件会反复执行以通知valid state
         * @param {Form} this
         * @param {Boolean} valid true表示通过客户端的验证
         */
        clientvalidation: true
    });
};

Ext.extend(Ext.form.Form, Ext.form.BasicForm, {
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
    column : function(c){
        var col = new Ext.form.Column(c);
        this.start(col);
        if(arguments.length > 1){ //兼容Opera的代码（duplicated)
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return col;
    },

    /**
     * 在布局堆栈中打开一个新的{@link Ext.form.FieldSet}类容器。
     * 如果所有域在配置之后被通过，域将被添加同时该fieldset（域集合）被关闭，如果没有域被通过该fieldset仍然打开，直至end（）方法被调用
     * @param {Object} config 传入fieldset的配置
     * @param {Field} field1 (可选的) 参数变量field1（Field类型）
     * @param {Field} field2 (可选的) 参数变量field2（Field类型）
     * @param {Field} etc (可选的) 可以自行添加多个域参数
     * @return Column 该fieldset容器对象
     */     
    fieldset : function(c){
        var fs = new Ext.form.FieldSet(c);
        this.start(fs);
        if(arguments.length > 1){ //兼容Opera的代码（duplicated)
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return fs;
    },
    
   /**
     * 在布局堆栈中打开一个新的{@link Ext.form.Layout}类容器。如果所有域在配置之后被通过，域将被添加同时该容器被关闭，
     * 如果没有域被通过该容器仍然打开，直至end（）方法被调用。
     * @param {Object} config 传入Layout的配置
     * @param {Field} field1 (可选的)参数变量field1（Field类型）（可选）
     * @param {Field} field2 (可选的)参数变量field2（Field类型）（可选）
     * @param {Field} etc (可选的) 可自行添加多个域参数
     * @return Layout The container object 返回Layout，该容器对象
     */
    container : function(c){
        var l = new Ext.form.Layout(c);
        this.start(l);
        if(arguments.length > 1){ //兼容Opera的代码（duplicated)
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return l;
    },

    /**
     * 在布局堆栈中打开被通过的容器。该容器可以是任意{@link Ext.form.Layout}或其子类的类型。
     * @param {Object} container 一个类型为{@link Ext.form.Layout}或其子类的布局
     * @return {Form} this
     */
    start : function(c){
        // 级联标签信息
        Ext.applyIf(c, {'labelAlign': this.active.labelAlign, 'labelWidth': this.active.labelWidth, 'itemCls': this.active.itemCls});
        this.active.stack.push(c);
        c.ownerCt = this.active;
        this.active = c;
        return this;
    },

    /**
     * 关闭当前打开的容器
     * @return {Form} this
     */
    end : function(){
        if(this.active == this.root){
            return this;
        }
        this.active = this.active.ownerCt;
        return this;
    },

    /**
     * 将Ext.form组件添加至当前打开的容器（例如 column、fieldset..等等）通过该方法加入的域，
     * 可允许带有fieldLabel的属性，这样的话，会有域标签（label of the field）文字的显示。
     * @param {Field} field1
     * @param {Field} field2 (可选的)
     * @param {Field} etc. (可选的)
     * @return {Form} this
     */
    add : function(){
        this.active.stack.push.apply(this.active.stack, arguments);
        var r = [];
        for(var i = 0, a = arguments, len = a.length; i < len; i++) {
            if(a[i].isFormField){
                r.push(a[i]);
            }
        }
        if(r.length > 0){
            Ext.form.Form.superclass.add.apply(this, r);
        }
        return this;
    },

    /**
     * 在被通过的容器中实施该form，
     * 传入一个容器的参数，在该容器上渲染form，该方法只能被调用一次。
     * @param {String/HTMLElement/Element} container 要渲染组件所在的元素
     * @return {Form} this
     */
    render : function(ct){
        ct = Ext.get(ct);
        var o = this.autoCreate || {
            tag: 'form',
            method : this.method || 'POST',
            id : this.id || Ext.id()
        };
        this.initEl(ct.createChild(o));

        this.root.render(this.el);

        this.items.each(function(f){
            f.render('x-form-el-'+f.id);
        });

        if(this.buttons.length > 0){
            // 要在IE上实现正确的布局，离不开表格
            var tb = this.el.createChild({cls:'x-form-btns-ct', cn: {
                cls:"x-form-btns x-form-btns-"+this.buttonAlign,
                html:'<table cellspacing="0"><tbody><tr></tr></tbody></table><div class="x-clear"></div>'
            }}, null, true);
            var tr = tb.getElementsByTagName('tr')[0];
            for(var i = 0, len = this.buttons.length; i < len; i++) {
                var b = this.buttons[i];
                var td = document.createElement('td');
                td.className = 'x-form-btn-td';
                b.render(tr.appendChild(td));
            }
        }
        if(this.monitorValid){ // 渲染后的初始化
            this.startMonitoring();
        }
        return this;
    },

    /**
     * 在该form末尾添加按钮，<b>必须</b>在该form被渲染之前被调用。
     * @param {String/Object} config 字符串会成为按钮的文字，一个对象可以是一个Button的config或者一个有效的Ext.DomHelper生成元素的配置对象
     * @param {Function} handler 单击按钮时调用的函数
     * @param {Object} scope (可选的) 句柄函数的作用域
     * @return {Ext.Button}
     */
    addButton : function(config, handler, scope){
        var bc = {
            handler: handler,
            scope: scope,
            minWidth: this.minButtonWidth,
            hideParent:true
        };
        if(typeof config == "string"){
            bc.text = config;
        }else{
            Ext.apply(bc, config);
        }
        var btn = new Ext.Button(null, bc);
        this.buttons.push(btn);
        return btn;
    },

    /**
     * 开始监视该form的有效状态。通常传入配置项“monitorValid”就会开始
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
     * 停止监视该form的有效状态
     */
    stopMonitoring : function(){
        this.bound = false;
    },

    // private
    bindHandler : function(){
        if(!this.bound){
            return false; // 停止绑定
        }
        var valid = true;
        this.items.each(function(f){
            if(!f.isValid(true)){
                valid = false;
                return false;
            }
        });
        for(var i = 0, len = this.buttons.length; i < len; i++){
            var btn = this.buttons[i];
            if(btn.formBind === true && btn.disabled === valid){
                btn.setDisabled(!valid);
            }
        }
        this.fireEvent('clientvalidation', this, valid);
    }
});


// 向下兼容
Ext.Form = Ext.form.Form;

