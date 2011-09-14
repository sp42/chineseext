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
 * @class Ext.ComponentMgr
 * 公开提供一个包含所有组件的注册页，以便可以轻松地通过ID访问组件（参阅{@link Ext.getCmp}）。
 * @singleton
 */
Ext.ComponentMgr = function(){
    var all = new Ext.util.MixedCollection();

    return {
        /**
         * 登记组件。
         * @param {Ext.Component} c 组件
         */
        register : function(c){
            all.add(c);
        },

        /**
         * 注销组件
         * @param {Ext.Component} c 组件
         */
        unregister : function(c){
            all.remove(c);
        },

        /**
         * 根据ID返回组件。
         * @param {String} id 组件的ID
         */
        get : function(id){
            return all.get(id);
        },

        /**
         * 注册一个函数，当指定的组件加入到 ComponentMgr 对象时调用。
         * @param {String} id 组件的ID
         * @param {Funtction} fn 回调函数
         * @param {Object} scope 回调的作用域
         */
        onAvailable : function(id, fn, scope){
            all.on("add", function(index, o){
                if(o.id == id){
                    fn.call(scope || o, o);
                    all.un("add", fn, scope);
                }
            });
        }
    };
}();

/**
 * @class Ext.Component
 * @extends Ext.util.Observable
 * EXT大部分组件的基类。组件所有的子类都按照标准的Ext组件创建、渲染、销毁这样的周期生存，并具有隐藏/显示，启用/禁用的基本行为。
 * 组件的任意子类允许延时渲染（lazy-rendered）到任何的{@link Ext.Container}，并且在{@link Ext.ComponentMgr}自动登记，
 * 以便随时可让{@link Ext.getCmp}获取其引用。所有可视的组件（widgets/器件）渲染时都离不开某个布局，因此均应为组件的子类。
 * @constructor
 * @param {Ext.Element/String/Object} config 若传入一个元素类型的参数，会被设置为内置使用的元素，其id会作为组件id使用。
 * 若传入一个字符串类型的参数，会被认为是利用现有元素的id,当作组件的id用。若不是，则被认为是标准的配置项对象，
 * 应用到组件上。
 */
Ext.Component = function(config){
    config = config || {};
    if(config.tagName || config.dom || typeof config == "string"){ // 元素对象
        config = {el: config, id: config.id || config};
    }
    this.initialConfig = config;

    Ext.apply(this, config);
    this.addEvents({
        /**
         * @event disable
         * 组件被禁止之后触发。
	     * @param {Ext.Component} this
	     */
        disable : true,
        /**
         * @event enable
         * 组件被启用之后触发。
	     * @param {Ext.Component} this
	     */
        enable : true,
        /**
         * @event beforeshow
         * 组件显示之前触发。如返回false则取消显示
	     * @param {Ext.Component} this
	     */
        beforeshow : true,
        /**
         * @event show
         * 组件显示之后触发。
	     * @param {Ext.Component} this
	     */
        show : true,
        /**
         * @event beforehide
         * 组件隐藏之前触发。如返回false则取消隐藏。
	     * @param {Ext.Component} this
	     */
        beforehide : true,
        /**
         * @event hide
         * 组件隐藏之后触发。
	     * @param {Ext.Component} this
	     */
        hide : true,
        /**
         * @event beforerender
         * 组件渲染之前触发。如返回false则取消渲染。
	     * @param {Ext.Component} this
	     */
        beforerender : true,
        /**
         * @event render
         * 组件渲染之后触发。
	     * @param {Ext.Component} this
	     */
        render : true,
        /**
         * @event beforedestroy
         * 组件销毁之前触发。如返回false则取消消耗。
	     * @param {Ext.Component} this
	     */
        beforedestroy : true,
        /**
         * @event destroy
         * 组件销毁之后触发。
	     * @param {Ext.Component} this
	     */
        destroy : true
    });
    if(!this.id){
        this.id = "ext-comp-" + (++Ext.Component.AUTO_ID);
    }
    Ext.ComponentMgr.register(this);
    Ext.Component.superclass.constructor.call(this);
    this.initComponent();
    if(this.renderTo){ // not supported by all components yet. use at your own risk!
        this.render(this.renderTo);
        delete this.renderTo;
    }
};

// private
Ext.Component.AUTO_ID = 1000;

Ext.extend(Ext.Component, Ext.util.Observable, {
    /**
     * 只读。组件隐藏时为true
     */
    hidden : false,
    /**
     * 只读。组件禁用时为true
     */
    disabled : false,
    /**
     * 只读。组件未被渲染时为true
     */
    rendered : false,

    /** @cfg {String} disableClass
     * 组件禁用时所调用的CSS样式类（默认为x-item-disabled）
     */
    disabledClass : "x-item-disabled",
	/** @cfg {Boolean} allowDomMove
	 * 当渲染时，组件能否在DOM树中间移动（默认为true）。
	 */
    allowDomMove : true,
    /** @cfg {String} hideMode
     * 怎么样去隐藏组件。可支持"visibility"（CSS的visibility），
     * "offsets"（负值偏移位置）和"display"（CSS display）。－默认为"display"。
     */
    hideMode: 'display',

    // private
    ctype : "Ext.Component",

    // private
    actionMode : "el",

    // private
    getActionEl : function(){
        return this[this.actionMode];
    },

    initComponent : Ext.emptyFn,
    /**
     * 如果这是一个延时渲染的组件，那么渲染其容器所在的元素。
     * @param {String/HTMLElement/Element} container （可选的）这个组件发生渲染所在的元素。
     * If it is being applied to existing markup, this should be left off.
     */
    render : function(container, position){
        if(!this.rendered && this.fireEvent("beforerender", this) !== false){
            if(!container && this.el){
                this.el = Ext.get(this.el);
                container = this.el.dom.parentNode;
                this.allowDomMove = false;
            }
            this.container = Ext.get(container);
            this.rendered = true;
            if(position !== undefined){
                if(typeof position == 'number'){
                    position = this.container.dom.childNodes[position];
                }else{
                    position = Ext.getDom(position);
                }
            }
            this.onRender(this.container, position || null);
            if(this.cls){
                this.el.addClass(this.cls);
                delete this.cls;
            }
            if(this.style){
                this.el.applyStyles(this.style);
                delete this.style;
            }
            this.fireEvent("render", this);
            this.afterRender(this.container);
            if(this.hidden){
                this.hide();
            }
            if(this.disabled){
                this.disable();
            }
        }
        return this;
    },

    // private
    // default function is not really useful
    onRender : function(ct, position){
        if(this.el){
            this.el = Ext.get(this.el);
            if(this.allowDomMove !== false){
                ct.dom.insertBefore(this.el.dom, position);
            }
        }
    },

    // private
    getAutoCreate : function(){
        var cfg = typeof this.autoCreate == "object" ?
                      this.autoCreate : Ext.apply({}, this.defaultAutoCreate);
        if(this.id && !cfg.id){
            cfg.id = this.id;
        }
        return cfg;
    },

    // private
    afterRender : Ext.emptyFn,

    /**
     * 清除组件所有的事件侦听器，销毁该组件，并在DOM树中移除组件
     * （尽可能地）从{@link Ext.Container}当中移除组件并从{@link Ext.ComponentMgr}注销
     */
    destroy : function(){
        if(this.fireEvent("beforedestroy", this) !== false){
            this.purgeListeners();
            this.beforeDestroy();
            if(this.rendered){
                this.el.removeAllListeners();
                this.el.remove();
                if(this.actionMode == "container"){
                    this.container.remove();
                }
            }
            this.onDestroy();
            Ext.ComponentMgr.unregister(this);
            this.fireEvent("destroy", this);
        }
    },

	// private
    beforeDestroy : function(){

    },

	// private
	onDestroy : function(){

    },

    /**
     * 返回所属的 {@link Ext.Element}.
     * @return {Ext.Element} 元素
     */
    getEl : function(){
        return this.el;
    },

    /**
     * 返回该组件的id。
     * @return {String}
     */
    getId : function(){
        return this.id;
    },

    /**
     * 试着聚焦到此项。
     * @param {Boolean} selectText true的话同时亦选中组件中的文本（尽可能）
     * @return {Ext.Component} this
     */
    focus : function(selectText){
        if(this.rendered){
            this.el.focus();
            if(selectText === true){
                this.el.dom.select();
            }
        }
        return this;
    },

    // private
    blur : function(){
        if(this.rendered){
            this.el.blur();
        }
        return this;
    },

    /**
     * 禁止该组件。
     * @return {Ext.Component} this
     */
    disable : function(){
        if(this.rendered){
            this.onDisable();
        }
        this.disabled = true;
        this.fireEvent("disable", this);
        return this;
    },

	// private
    onDisable : function(){
        this.getActionEl().addClass(this.disabledClass);
        this.el.dom.disabled = true;
    },

    /**
     * 启用该组件。
     * @return {Ext.Component} this
     */
    enable : function(){
        if(this.rendered){
            this.onEnable();
        }
        this.disabled = false;
        this.fireEvent("enable", this);
        return this;
    },

	// private
    onEnable : function(){
        this.getActionEl().removeClass(this.disabledClass);
        this.el.dom.disabled = false;
    },

    /**
     * 方便的布尔函数用来控制组件禁用/可用。
     * @param {Boolean} disabled
     */
    setDisabled : function(disabled){
        this[disabled ? "disable" : "enable"]();
    },

    /**
     * 显示该组件。
     * @return {Ext.Component} this
     */
    show: function(){
        if(this.fireEvent("beforeshow", this) !== false){
            this.hidden = false;
            if(this.rendered){
                this.onShow();
            }
            this.fireEvent("show", this);
        }
        return this;
    },

    // private
    onShow : function(){
        var ae = this.getActionEl();
        if(this.hideMode == 'visibility'){
            ae.dom.style.visibility = "visible";
        }else if(this.hideMode == 'offsets'){
            ae.removeClass('x-hidden');
        }else{
            ae.dom.style.display = "";
        }
    },

    /**
     * 隐藏该组件。
     * @return {Ext.Component} this
     */
    hide: function(){
        if(this.fireEvent("beforehide", this) !== false){
            this.hidden = true;
            if(this.rendered){
                this.onHide();
            }
            this.fireEvent("hide", this);
        }
        return this;
    },

    // private
    onHide : function(){
        var ae = this.getActionEl();
        if(this.hideMode == 'visibility'){
            ae.dom.style.visibility = "hidden";
        }else if(this.hideMode == 'offsets'){
            ae.addClass('x-hidden');
        }else{
            ae.dom.style.display = "none";
        }
    },

    /**
     * 方便的布尔函数用来控制组件显示/隐藏。
     * @param {Boolean} visible true 时显示/false 时隐藏
     * @return {Ext.Component} this
     */
    setVisible: function(visible){
        if(visible) {
            this.show();
        }else{
            this.hide();
        }
        return this;
    },

    /**
     * 该组件可见时返回true。
     */
    isVisible : function(){
        return this.getActionEl().isVisible();
    },

    cloneConfig : function(overrides){
        overrides = overrides || {};
        var id = overrides.id || Ext.id();
        var cfg = Ext.applyIf(overrides, this.initialConfig);
        cfg.id = id; // prevent dup id
        return new this.constructor(cfg);
    }
});