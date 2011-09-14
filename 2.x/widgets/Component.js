/**
 * @class Ext.Component
 * @extends Ext.util.Observable
 * <p>Base class for all Ext components. 
 * 全体Ext组件的基类。
 * Component下所有的子类均按照统一的Ext组件生命周期（lifeycle）执行运作,即创建、渲染和销毁（creation,rendering和destruction）。
 * 并具有隐藏/显示和启用/禁用的基本行为特性。</p> 
 * Component下的子类可被延时渲染（lazy-rendered）成为{@link Ext.Container}的一种，同时自动登记到{@link Ext.ComponentMgr}，
 * 这样便可在后面的代码使用{@link Ext#getCmp}获取组件的引用。
 * 当需要以盒子模型（box model）的方式管理这些可视的器件（widgets），
 * 器件就必须从Component（或{@link Ext.BoxComponent}）继承，渲染为一种布局。 
 * </p>
 * <p>
 * 每种component都有特定的类型，是Ext自身设置的类型。对xtype检查的相关方法如{@link #getXType}和{@link #isXType}。
 * 这里是所有有效的xtypes列表：</p>
 * <pre>
xtype            类Class
-------------    ------------------
box              Ext.BoxComponent
button           Ext.Button
colorpalette     Ext.ColorPalette
component        Ext.Component
container        Ext.Container
cycle            Ext.CycleButton
dataview         Ext.DataView
datepicker       Ext.DatePicker
editor           Ext.Editor
editorgrid       Ext.grid.EditorGridPanel
grid             Ext.grid.GridPanel
paging           Ext.PagingToolbar
panel            Ext.Panel
progress         Ext.ProgressBar
splitbutton      Ext.SplitButton
tabpanel         Ext.TabPanel
treepanel        Ext.tree.TreePanel
viewport         Ext.ViewPort
window           Ext.Window

Toolbar components 工具条组件
---------------------------------------
toolbar          Ext.Toolbar
tbbutton         Ext.Toolbar.Button
tbfill           Ext.Toolbar.Fill
tbitem           Ext.Toolbar.Item
tbseparator      Ext.Toolbar.Separator
tbspacer         Ext.Toolbar.Spacer
tbsplit          Ext.Toolbar.SplitButton
tbtext           Ext.Toolbar.TextItem

Form components 表单组件
---------------------------------------
form             Ext.FormPanel
checkbox         Ext.form.Checkbox
combo            Ext.form.ComboBox
datefield        Ext.form.DateField
field            Ext.form.Field
fieldset         Ext.form.FieldSet
hidden           Ext.form.Hidden
htmleditor       Ext.form.HtmlEditor
numberfield      Ext.form.NumberField
radio            Ext.form.Radio
textarea         Ext.form.TextArea
textfield        Ext.form.TextField
timefield        Ext.form.TimeField
trigger          Ext.form.TriggerField
</pre>
 * @constructor
 * @param {Ext.Element/String/Object} config The configuration options.  配置项
 * 如果传入的是一个元素，那么它将是内置的元素以及其id将用于组件的id。
 * 如果传入的是一个字符串，那么就假设它是现有元素身上的id,也用于组件的id。
 * 否则，那应该是一个标准的配置项对象，应用到组件身上。
 */
Ext.Component = function(config){
    config = config || {};
    if(config.initialConfig){
        if(config.isAction){           // actions
            this.baseAction = config;
        }
        config = config.initialConfig; // component cloning / action set up
    }else if(config.tagName || config.dom || typeof config == "string"){ // element object
        config = {applyTo: config, id: config.id || config};
    }

    /**
     * 组件初始化配置项。只读的
     * @type Object
     * @property initialConfig
     */
    this.initialConfig = config;

    Ext.apply(this, config);
    this.addEvents(
        /**
         * @event disable
         * 当组件禁用后触发。
	     * @param {Ext.Component} this
	     */
        'disable',
        /**
         * @event enable
         * 当组件启用后触发。
	     * @param {Ext.Component} this
	     */
        'enable',
        /**
         * @event beforeshow
         * 当组件显示出来之前触发。如返回false则阻止显示。
	     * @param {Ext.Component} this
	     */
        'beforeshow',
        /**
         * @event show
         * 当组件显示后触发。
	     * @param {Ext.Component} this
	     */
        'show',
        /**
         * @event beforehide
         * 当组件将要隐藏的时候触发。如返回false则阻止隐藏。
	     * @param {Ext.Component} this
	     */
        'beforehide',
        /**
         * @event hide
         * 当组件隐藏后触发。
	     * @param {Ext.Component} this
	     */
        'hide',
        /**
         * @event beforerender
         * 当组件渲染之前触发。如返回false则阻止渲染。
	     * @param {Ext.Component} this
	     */
        'beforerender',
        /**
         * @event render
         * 组件渲染之后触发。
	     * @param {Ext.Component} this
	     */
        'render',
        /**
         * @event beforedestroy
         * 组件销毁之前触发。如返回false则停止销毁。
	     * @param {Ext.Component} this
	     */
        'beforedestroy',
        /**
         * @event destroy
         * 组件销毁之后触发。
	     * @param {Ext.Component} this
	     */        
        'destroy',
        /**
         * @event beforestaterestore
	     * 当组件的状态复原之前触发。如返回false则停止复原状态。
	     * @param {Ext.Component} this
	     * @param {Object} state 保存状态的哈希表
	     */
        'beforestaterestore',
        /**
         * @event staterestore
         * 当组件的状态复原后触发。
	     * @param {Ext.Component} this
	     * @param {Object} state  保存状态的哈希表
	     */
        'staterestore',
        /**
         * @event beforestatesave
	     * 当组件的状态被保存到state provider之前触发。如返回false则停止保存。
	     * @param {Ext.Component} this
	     * @param {Object} state  保存状态的哈希表
	     */
        'beforestatesave',
        /**
         * @event statesave
	     * 当组件的状态被保存到state provider后触发。
	     * @param {Ext.Component} this
	     * @param {Object} state  保存状态的哈希表
	     */
        'statesave'
    );
    this.getId();
    Ext.ComponentMgr.register(this);
    Ext.Component.superclass.constructor.call(this);

    if(this.baseAction){
        this.baseAction.addComponent(this);
    }

    this.initComponent();

    if(this.plugins){
        if(this.plugins instanceof Array){
            for(var i = 0, len = this.plugins.length; i < len; i++){
                this.plugins[i].init(this);
            }
        }else{
            this.plugins.init(this);
        }
    }

    if(this.stateful !== false){
        this.initState(config);
    }

    if(this.applyTo){
        this.applyToMarkup(this.applyTo);
        delete this.applyTo;
    }else if(this.renderTo){
        this.render(this.renderTo);
        delete this.renderTo;
    }
};

// private
Ext.Component.AUTO_ID = 1000;

Ext.extend(Ext.Component, Ext.util.Observable, {
    /**
     * @cfg {String} id
     * 唯一的组件id（默认为自动分配的id）。
     */
    /**
     * @cfg {String} xtype
     * The registered xtype to create. 
     * 用于登记一个xtype。
     * This config option is not used when passing
     * a config object into a constructor. 
     * This config option is used only when
     * lazy instantiation is being used, and a child item of a Container is being
     * specified not as a fully instantiated Component, but as a <i>Component config
     * object</i>. 
     * The xtype will be looked up at render time up to determine what
     * type of child Component to create.<br><br>
     * The predefined xtypes are listed {@link Ext.Component here}.
     * <br><br>
     * If you subclass Components to create your own Components, you may register
     * them using {@link Ext.ComponentMgr#registerType} in order to be able to
     * take advantage of lazy instantiation and rendering.
     */
    /**
     * @cfg {String} cls
     * 一个可选添加的CSS样式类，加入到组件的元素上（默认为''）。
     * 这为组件或组件的子节点加入标准CSS规则提供了方便。
     */
    /**
     * @cfg {String} style
     * 作用在组件元素上特定的样式。该值的有效格式应如{@link Ext.Element#applyStyles}。
     */
     /**
     * @cfg {String} cls
     * 一个可选添加的CSS样式类，加入到组件的容器上（默认为''）。
     * 这为容器或容器的子节点加入标准CSS规则提供了方便。
     */
    /**
     * @cfg {Object/Array} plugins
     * 针对该组件自定义的功能，是对象或这些对象组成的数组。
     * 一个有效的插件须保证带有一个init的方法以便接收属于Ext.Component类型的引用。
     * 当一个组件被创建后，若发现由插件可用，组件会调用每个插件上的init方法，传入一个应用到插件本身。  
     * 这样，插件便能按照组件所提供的功能，调用到组件的方法或响应事件。
     */
     
    /**
     * @cfg {Mixed} applyTo
     * 节点的id,或是DOM节点，又或者是与DIV相当的现有元素，这些都是文档中已经存在的元素
     * 当使用applyTo后，主元素所指定的id或CSS样式类将会作用于组件构成的部分，
     * 而被创建的组件将会尝试着根据这些markup构建它的子组件。
     * 使用了这项配置后，不需要执行render()的方法。
     * 若指定了applyTo，那么任何由{@link #renderTo}传入的值将会被忽略并使用目标元素的父级元素作为组件的容器。
     */
     /*
      * 译者：applyTo/renderTo-->容器定位选择的问题?
      * applyTo拿它的父元素作为container
      * renderTo该元素被用作容器
      */
    /**
     * @cfg {Mixed} renderTo
     * 容器渲染的那个节点的id,或是DOM节点，又或者是与DIV相当的现有元素。
     * 使用了这项配置后，不需要执行render()的方法。
     */

    /* //internal - to be set by subclasses
     * @cfg {String} stateId
     * The unique id for this component to use for state management purposes (defaults to the component id).
     */
    /* //internal - to be set by subclasses
     * @cfg {Array} stateEvents
     * An array of events that, when fired, should trigger this component to save its state (defaults to none).
     * These can be any types of events supported by this component, including browser or custom events (e.g.,
     * ['click', 'customerchange']).
     */

    /**
     * @cfg {String} disabledClass
     * 当组件被禁用时作用的CSS样式类（默认为"x-item-disabled"）。
     */
    disabledClass : "x-item-disabled",
	/**
	 * @cfg {Boolean} allowDomMove
	 * 当渲染进行时能否移动Dom节点上的组件（默认为true）。
	 */
    allowDomMove : true,
	/**
	 * @cfg {Boolean} autoShow
	 * True表示为在渲染的时候先检测一下有否关于隐藏的样式类（如：'x-hidden'或'x-hide-display'），有就移除隐藏的样式类。
	 * （缺省为false）
	 */
    autoShow : false,
    /**
     * @cfg {String} hideMode
     * 这个组件是怎么隐藏的。可支持的值有"visibility" （css中的visibility）, "offsets"（负偏移位置）和
     * "display"（css中的display）－默认为“display”。
     */
    hideMode: 'display',
    /**
     * @cfg {Boolean} hideParent
     * True表示为当隐藏/显示组件时对组件的容器亦一同隐藏/显示,false就只会隐藏/显示组件本身（默认为false）。
     * 例如，可设置一个hide:true的隐藏按钮在window，如果按下就通知其父容器一起隐藏，这样做起来比较快捷省事。
     */
    hideParent: false,

    /**
     * 组件自身的{@link Ext.Container}（默认是undefined，只有在组件加入到容器时才会自动设置该属性）只读的。
     * @type Ext.Container
     * @property ownerCt
     */
    /**
     * True表示为组件是隐藏的。只读的
     * @type Boolean
     * @property
     */
    hidden : false,
    /**
     * True表示为组件已被禁止。只读的
     * @type Boolean
     * @property
     */
    disabled : false,
    /**
     * True表示为该组件已经渲染好了。只读的。
     * @type Boolean
     * @property
     */
    rendered : false,

    // private
    ctype : "Ext.Component",

    // private
    actionMode : "el",

    // private
    getActionEl : function(){
        return this[this.actionMode];
    },

    /* // protected
     * Function to be implemented by Component subclasses to be part of standard component initialization flow (it is empty by default).
     * <pre><code>
// Traditional constructor:
Ext.Foo = function(config){
	// call superclass constructor:
    Ext.Foo.superclass.constructor.call(this, config);

    this.addEvents({
		// add events
    });
};
Ext.extend(Ext.Foo, Ext.Bar, {
   // class body
}

// initComponent replaces the constructor:
Ext.Foo = Ext.extend(Ext.Bar, {
    initComponent : function(){
		// call superclass initComponent
        Ext.Container.superclass.initComponent.call(this);

        this.addEvents({
            // add events
        });
    }
}
</code></pre>
     */
    initComponent : Ext.emptyFn,

    /**
     * 如果这是延时加载的组件，就要执行这个渲染的方法到其容器的元素。
     * @param {Mixed} container （可选的）该组件应该渲染到的元素。这一项不应是现有的元素。
     * @param {String/Number} position （可选的） 
     * 这个组件插入到容器的<b>之前</b>位置，可以是元素的ID或是DOM节点的索引（缺省是插入到容器的尾部）
     */
    render : function(container, position){
        if(!this.rendered && this.fireEvent("beforerender", this) !== false){
            if(!container && this.el){
                this.el = Ext.get(this.el);
                container = this.el.dom.parentNode;
                this.allowDomMove = false;
            }
            this.container = Ext.get(container);
            if(this.ctCls){
                this.container.addClass(this.ctCls);
            }
            this.rendered = true;
            if(position !== undefined){
                if(typeof position == 'number'){
                    position = this.container.dom.childNodes[position];
                }else{
                    position = Ext.getDom(position);
                }
            }
            this.onRender(this.container, position || null);
            if(this.autoShow){
                this.el.removeClass(['x-hidden','x-hide-' + this.hideMode]);
            }
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

            this.initStateEvents();
        }
        return this;
    },

    // private
    initState : function(config){
        if(Ext.state.Manager){
            var state = Ext.state.Manager.get(this.stateId || this.id);
            if(state){
                if(this.fireEvent('beforestaterestore', this, state) !== false){
                    this.applyState(state);
                    this.fireEvent('staterestore', this, state);
                }
            }
        }
    },

    // private
    initStateEvents : function(){
        if(this.stateEvents){
            for(var i = 0, e; e = this.stateEvents[i]; i++){
                this.on(e, this.saveState, this, {delay:100});
            }
        }
    },

    // private
    applyState : function(state, config){
        if(state){
            Ext.apply(this, state);
        }
    },

    // private
    getState : function(){
        return null;
    },

    // private
    saveState : function(){
        if(Ext.state.Manager){
            var state = this.getState();
            if(this.fireEvent('beforestatesave', this, state) !== false){
                Ext.state.Manager.set(this.stateId || this.id, state);
                this.fireEvent('statesave', this, state);
            }
        }
    },

    /**
     * 把这个组件应用到当前有效的markup。执行该函数后，无须调用render()
     * @param {String/HTMLElement} el 
     */
    applyToMarkup : function(el){
        this.allowDomMove = false;
        this.el = Ext.get(el);
        this.render(this.el.dom.parentNode);
    },

    /**
     * 加入CSS样式类到组件所在的元素。
     * @param {string} cls 要加入的CSS样式类
     */
    addClass : function(cls){
        if(this.el){
            this.el.addClass(cls);
        }else{
            this.cls = this.cls ? this.cls + ' ' + cls : cls;
        }
    },

    /**
     * 移除CSS样式类到组件所属的元素。
     * @param {string} cls 要移除的CSS样式类
     */
    removeClass : function(cls){
        if(this.el){
            this.el.removeClass(cls);
        }else if(this.cls){
            this.cls = this.cls.split(' ').remove(cls).join(' ');
        }
    },

    // private
    // default function is not really useful
    onRender : function(ct, position){
        if(this.autoEl){
            if(typeof this.autoEl == 'string'){
                this.el = document.createElement(this.autoEl);
            }else{
                var div = document.createElement('div');
                Ext.DomHelper.overwrite(div, this.autoEl);
                this.el = div.firstChild;
            }
        }
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
     * 清除任何的事件的句柄，在DOM中移除组件的元素，从容器{@link Ext.Container}中移除本身（如果适合的话）和在{@link Ext.ComponentMgr}注销
     * 销毁的方法一般由框架自动执行，通常不需要直接执行。
     */
    destroy : function(){
        if(this.fireEvent("beforedestroy", this) !== false){
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
            this.purgeListeners();
        }
    },

	// private
    beforeDestroy : Ext.emptyFn,

	// private
    onDestroy  : Ext.emptyFn,

    /**
     * 返回所属的{@link Ext.Element}.
     * @return {Ext.Element} 元素
     */
    getEl : function(){
        return this.el;
    },

    /**
     * 返回该组件的id
     * @return {String}
     */
    getId : function(){
        return this.id || (this.id = "ext-comp-" + (++Ext.Component.AUTO_ID));
    },

    /**
     * 返回该组件的item id。
     * @return {String}
     */
    getItemId : function(){
        return this.itemId || this.getId();
    },

    /**
     * 试着将焦点放到此项。
     * @param {Boolean} selectText （可选的）  true的话同时亦选中组件中的文本（尽可能）
     * @param {Boolean/Number} delay （可选的） 延时聚焦行为的毫秒数（true表示为10毫秒）
     * @return {Ext.Component} this
     */
    focus : function(selectText, delay){
        if(delay){
            this.focus.defer(typeof delay == 'number' ? delay : 10, this, [selectText, false]);
            return;
        }
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
     * 方便的函数用来控制组件禁用/可用。
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
            if(this.autoRender){
                this.render(typeof this.autoRender == 'boolean' ? Ext.getBody() : this.autoRender);
            }
            if(this.rendered){
                this.onShow();
            }
            this.fireEvent("show", this);
        }
        return this;
    },

    // private
    onShow : function(){
        if(this.hideParent){
            this.container.removeClass('x-hide-' + this.hideMode);
        }else{
            this.getActionEl().removeClass('x-hide-' + this.hideMode);
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
        if(this.hideParent){
            this.container.addClass('x-hide-' + this.hideMode);
        }else{
            this.getActionEl().addClass('x-hide-' + this.hideMode);
        }
    },

    /**
     * 方便的函数用来控制组件显示/隐藏。
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
        return this.rendered && this.getActionEl().isVisible();
    },

    /**
     * 根据原始传入到该实例的配置项值，克隆一份组件。
     * @param {Object} 一个新配置项对象，用于对克隆版本的属性进行重写。属性id应要重写，避免重复生成一个。
     * @return {Ext.Component} clone 该组件的克隆copy
     */
    cloneConfig : function(overrides){
        overrides = overrides || {};
        var id = overrides.id || Ext.id();
        var cfg = Ext.applyIf(overrides, this.initialConfig);
        cfg.id = id; // prevent dup id
        return new this.constructor(cfg);
    },

    /**
     * 获取{@link Ext.ComponentMgr}在已登记组件的xtypes。 
     * 全部可用的xtypes列表，可参考{@link Ext.Component}开头，用法举例：
     * <pre><code>
var t = new Ext.form.TextField();
alert(t.getXType());  // alerts 'textfield'
</code></pre>
     * @return {String} The xtype
     */
    getXType : function(){
        return this.constructor.xtype;
    },

    /**
     * 测试这个组件是否属于某个指定的xtype。
     * 这个方法既可测试该组件是否为某个xtype的子类，或直接是这个xtype的实例（shallow = true）
     * 全部可用的xtypes列表，可参考{@link Ext.Component}开头，用法举例：
     * <pre><code>
var t = new Ext.form.TextField();
var isText = t.isXType('textfield');        // true
var isBoxSubclass = t.isXType('box');       // true，textfield继承自BoxComponent
var isBoxInstance = t.isXType('box', true); // false，非BoxComponent本身的实例
</code></pre>
     * @param {String} xtype 测试该组件的xtype
     * @param {Boolean} shallow （可选的） False表示为测试该组件是否为某个xtype的子类（缺省），
     * true就表示为测试该组件是否这个xtype本身的实例
     */
    isXType : function(xtype, shallow){
        return !shallow ?
               ('/' + this.getXTypes() + '/').indexOf('/' + xtype + '/') != -1 :
                this.constructor.xtype == xtype;
    },

    /**
     * 返回以斜杠分割的字符串，表示组件的xtype层次。
     * 全部可用的xtypes列表，可参考{@link Ext.Component}开头，用法举例：
     * <pre><code>
var t = new Ext.form.TextField();
alert(t.getXTypes());  // alerts 'component/box/field/textfield'
</pre></code>
     * @return {String} xtype层次的字符串
     */
    getXTypes : function(){
        var tc = this.constructor;
        if(!tc.xtypes){
            var c = [], sc = this;
            while(sc && sc.constructor.xtype){
                c.unshift(sc.constructor.xtype);
                sc = sc.constructor.superclass;
            }
            tc.xtypeChain = c;
            tc.xtypes = c.join('/');
        }
        return tc.xtypes;
    }
});

Ext.reg('component', Ext.Component);
