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
 * @class Ext.Component
 * @extends Ext.util.Observable
 * <p>
 * 全体Ext组件的基类。Component下所有的子类均按照统一的Ext组件生命周期（lifeycle）执行运作，
 * 即创建、渲染和销毁（creation、rendering和destruction），并具有隐藏/显示、启用/禁用的基本行为特性。
 * Component下的子类可被延时渲染（lazy-rendered）成为{@link Ext.Container}的一种，同时自动登记到{@link Ext.ComponentMgr}，这样便可在后面的代码使用{@link Ext#getCmp}获取组件的引用。
 * 当需要以盒子模型（box model）的模式管理这些可视的器件（widgets），这些器件就必须从Component（或{@link Ext.BoxComponent}）继承。<br />
 * Base class for all Ext components. 
 * All subclasses of Component can automatically participate in the standard
 * Ext component lifecycle of creation, rendering and destruction. 
 * They also have automatic support for basic hide/show
 * and enable/disable behavior.  
 * Component allows any subclass to be lazy-rendered into any {@link Ext.Container} and
 * to be automatically registered with the {@link Ext.ComponentMgr} so that it can be referenced at any time via
 * {@link Ext#getCmp}. 
 * All visual widgets that require rendering into a layout should subclass Component (or
 * {@link Ext.BoxComponent} if managed box model handling is required).</p>
 * <p>
 * 可参阅教程<a href="http://extjs.com/learn/Tutorial:Creating_new_UI_controls_(Chinese)">Creating new UI controls</a>创建自定义的组件。
 * See the <a href="http://extjs.com/learn/Tutorial:Creating_new_UI_controls">Creating new UI controls</a> tutorial for details on how
 * and to either extend or augment ExtJs base classes to create custom Components.</p>
 * <p>
 * 每种component都有特定的类型，是Ext自身设置的类型。
 * 对xtype检查的相关方法如{@link #getXType}和{@link #isXType}。
 * 这里是所有有效的xtypes列表：
 * Every component has a specific xtype, which is its Ext-specific type name, along with methods for checking the
 * xtype like {@link #getXType} and {@link #isXType}. This is the list of all valid xtypes:</p>
 * <pre>
xtype            类 Class
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

工具条组件 Toolbar components
---------------------------------------
toolbar          Ext.Toolbar
tbbutton         Ext.Toolbar.Button（已废弃，用button代替）
tbfill           Ext.Toolbar.Fill
tbitem           Ext.Toolbar.Item
tbseparator      Ext.Toolbar.Separator
tbspacer         Ext.Toolbar.Spacer
tbsplit          Ext.Toolbar.SplitButton（已废弃，用splitbutton代替）
tbtext           Ext.Toolbar.TextItem

表单组件 Form components
---------------------------------------
form             Ext.FormPanel
checkbox         Ext.form.Checkbox
combo            Ext.form.ComboBox
datefield        Ext.form.DateField
field            Ext.form.Field
fieldset         Ext.form.FieldSet
hidden           Ext.form.Hidden
htmleditor       Ext.form.HtmlEditor
label            Ext.form.Label
numberfield      Ext.form.NumberField
radio            Ext.form.Radio
textarea         Ext.form.TextArea
textfield        Ext.form.TextField
timefield        Ext.form.TimeField
trigger          Ext.form.TriggerField

图表组件 Chart components
---------------------------------------
chart            {@link Ext.chart.Chart}
barchart         {@link Ext.chart.BarChart}
cartesianchart   {@link Ext.chart.CartesianChart}
columnchart      {@link Ext.chart.ColumnChart}
linechart        {@link Ext.chart.LineChart}
piechart         {@link Ext.chart.PieChart}

Store对象 Store xtypes
---------------------------------------
arraystore       {@link Ext.data.ArrayStore}
directstore      {@link Ext.data.DirectStore}
groupingstore    {@link Ext.data.GroupingStore}
jsonstore        {@link Ext.data.JsonStore}
simplestore      {@link Ext.data.SimpleStore}     （已废弃，用arraystore代替） 
store            {@link Ext.data.Store}
xmlstore         {@link Ext.data.XmlStore}
</pre>
 * @constructor
 * @param {Ext.Element/String/Object} config 配置项。
 * 如果传入的是一个元素，那么它将是内置的元素以及其id将用于组件的id。
 * 如果传入的是一个字符串，那么就假设它是现有元素身上的id，也用于组件的id。
 * 否则，那应该是一个标准的配置项对象，应用到组件身上。
 * The configuration options.  If an element is passed, it is set as the internal
 * element and its id used as the component id.  If a string is passed, it is assumed to be the id of an existing element
 * and is used as the component id.  Otherwise, it is assumed to be a standard config object and is applied to the component.
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
     * 组件初始化配置项。只读的。
     * This Component's initial configuration specification. Read-only.
     * @type Object
     * @property initialConfig
     */
    this.initialConfig = config;

    Ext.apply(this, config);
    this.addEvents(
        /**
         * @event disable
         * 当组件禁用后触发。
         * Fires after the component is disabled.
         * @param {Ext.Component} this
         */
        'disable',
        /**
         * @event enable
         * 当组件被启用后触发。
         * Fires after the component is enabled.
         * @param {Ext.Component} this
         */
        'enable',
        /**
         * @event beforeshow
         * 当组件显示出来之前触发。如返回false则阻止显示。
         * Fires before the component is shown. Return false to stop the show.
         * @param {Ext.Component} this
         */
        'beforeshow',
        /**
         * @event show
         * 当组件显示后触发。
         * Fires after the component is shown.
         * @param {Ext.Component} this
         */
        'show',
        /**
         * @event beforehide
         * 当组件将要隐藏的时候触发。如返回false则阻止隐藏。
         * Fires before the component is hidden. Return false to stop the hide.
         * @param {Ext.Component} this
         */
        'beforehide',
        /**
         * @event hide
         * 当组件隐藏后触发。
         * Fires after the component is hidden.
         * @param {Ext.Component} this
         */
        'hide',
        /**
         * @event beforerender
         * 当组件渲染之前触发。如返回false则阻止渲染。
         * Fires before the component is rendered. Return false to stop the render.
         * @param {Ext.Component} this
         */
        'beforerender',
        /**
         * @event render
         * 组件渲染之后触发。
         * Fires after the component markup is rendered.
         * @param {Ext.Component} this
         */
        'render',
        /**
         * @event afterrender
         * 组件销毁之前触发。如返回false则停止销毁。
         * Fires after the component rendering is finished.
         * @param {Ext.Component} this
         */
        'afterrender',
        /**
         * @event beforedestroy
         * 组件销毁之前触发。如返回false则停止销毁。
         * Fires before the component is destroyed. Return false to stop the destroy.
         * @param {Ext.Component} this
         */
        'beforedestroy',
        /**
         * @event destroy
         * 组件销毁之后触发。
         * Fires after the component is destroyed.
         * @param {Ext.Component} this
         */
        'destroy',
        /**
         * @event beforestaterestore
         * 当组件的状态复原之前触发。如返回false则停止复原状态。
         * Fires before the state of the component is restored. Return false to stop the restore.
         * @param {Ext.Component} this
         * @param {Object} state StateProvider返回状态的哈希表。如果事件被撤销，那么<b><tt>applyState</tt></b>会送入一个状态对象（state object）。
         * 默认下状态对象的属性会复制到此组件身上。可以提供自定义的状态复原方法，重写便可。
         * The hash of state values returned from the StateProvider. If this
         * event is not vetoed, then the state object is passed to <b><tt>applyState</tt></b>. By default,
         * that simply copies property values into this Component. The method maybe overriden to
         * provide custom state restoration.
         */
        'beforestaterestore',
        /**
         * @event staterestore
         * 当组件的状态复原后触发。
         * Fires after the state of the component is restored.
         * @param {Ext.Component} this
         * @param {Object} state StateProvider返回状态的哈希表。如果事件被撤销，那么<b><tt>applyState</tt></b>会送入一个状态对象（state object）。
         * 默认下状态对象的属性会复制到此组件身上。可以提供自定义的状态复原方法，重写便可。
         * The hash of state values returned from the StateProvider. This is passed
         * to <b><tt>applyState</tt></b>. By default, that simply copies property values into this
         * Component. The method maybe overriden to provide custom state restoration.
         */
        'staterestore',
        /**
         * @event beforestatesave
         * 当组件的状态被保存到state provider之前触发。如返回false则停止保存。
         * Fires before the state of the component is saved to the configured state provider. Return false to stop the save.
         * @param {Ext.Component} this this
         * @param {Object} state 保存状态的哈希表。该项的值由Component的<b><tt>getState()</tt></b>方法执行后返回。
         * 由于该方法是一个虚拟的方法，因此需由程序员所指定实作的方法，以便能够指定状态是怎么表征的。
         * 缺省下Ext.Component提供一个null的实现（空的实现）。
         * The hash of state values. This is determined by calling
         * <b><tt>getState()</tt></b> on the Component. This method must be provided by the
         * developer to return whetever representation of state is required, by default, Ext.Component
         * has a null implementation.
         */
        'beforestatesave',
        /**
         * @event statesave
         * 当组件的状态被保存到state provider后触发。
         * Fires after the state of the component is saved to the configured state provider.
         * @param {Ext.Component} this this
         * @param {Object} state 保存状态的哈希表。该项的值由Component的<b><tt>getState()</tt></b>方法执行后返回。
         * 由于该方法是一个虚拟的方法，因此需由程序员所指定，以便能够指定状态是怎么表征的。
         * 缺省下Ext.Component提供一个null的实现（空的实现）。
         * The hash of state values. This is determined by calling
         * <b><tt>getState()</tt></b> on the Component. This method must be provided by the
         * developer to return whetever representation of state is required, by default, Ext.Component
         * has a null implementation.
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
        if(Ext.isArray(this.plugins)){
            for(var i = 0, len = this.plugins.length; i < len; i++){
                this.plugins[i] = this.initPlugin(this.plugins[i]);
            }
        }else{
            this.plugins = this.initPlugin(this.plugins);
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
	// 下面的几个配置项都是关于FormLayout的组件
	// Configs below are used for all Components when rendered by FormLayout.
    /**
     * @cfg {String} fieldLabel 在组件旁边那里显示的label文本（默认为''）。
     * The label text to display next to this Component (defaults to '')
     * <p><b>
     * 此组件只有在{@link Ext.form.FormLayout FormLayout}布局管理器控制的容器下渲染才有用。
     * This config is only used when this Component is rendered by a Container which has been
     * configured to use the {@link Ext.form.FormLayout FormLayout} layout manager.</b></p>
     * Example use:<pre><code>
new Ext.FormPanel({
    height: 100,
    renderTo: Ext.getBody(),
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Name'
    }]
});
</code></pre>
     */
    /**
     * @cfg {String} labelStyle 关于表单字段的label提示文本的CSS样式的“完全表达式（CSS style specification）”。
     * 默认为""，若容器的lableStyle有设置这样设置值。
     * A CSS style specification to apply directly to this field's label (defaults to the
     * container's labelStyle value if set, or '').
     * <p><b>
     * 此组件只有在{@link Ext.layout.FormLayout FormLayout}布局管理器控制的容器下渲染才有用。
     * This config is only used when this Component is rendered by a Container which has been
     * configured to use the {@link Ext.layout.FormLayout FormLayout} layout manager.</b></p>
     * 演示实例：Example use:<pre><code>
new Ext.FormPanel({
    height: 100,
    renderTo: Ext.getBody(),
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Name',
        labelStyle: 'font-weight:bold;'
    }]
});
</code></pre>
     */
    /**
     * @cfg {String} labelSeparator 
     * 分隔符，就是每行表单中的label文本显示后面紧接着的那个分隔符（默认值是{@link Ext.layout.FormLayout#labelSeparator}，即缺省是分号“:”）。
     * 如果指定空白字符串""就表示不显示所谓的“分隔符”。
     * The standard separator to display after the text of each form label (defaults
     * to the value of {@link Ext.layout.FormLayout#labelSeparator}, which is a colon ':' by default).  To display
     * no separator for this field's label specify empty string ''.
     * <p><b>
     * 此组件只有在{@link Ext.form.FormLayout FormLayout}布局管理器控制的容器下渲染才有用。
     * This config is only used when this Component is rendered by a Container which has been
     * configured to use the {@link Ext.form.FormLayout FormLayout} layout manager.</b></p>
     * Example use:<pre><code>
new Ext.FormPanel({
    height: 100,
    renderTo: Ext.getBody(),
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Name',
        labelSeparator: '...'
    }]
});
</code></pre>
     */
    /**
     * @cfg {Boolean} hideLabel 
     * True表示为完全隐藏label元素。默认下，即使你不指定{@link fieldLabel}都会有一个空白符插入，好让支撑field为一行。
     * 设该值为true就不会有这个空白符了。
     * True to completely hide the label element (defaults to false).  By default, even if
     * you do not specify a {@link fieldLabel} the space will still be reserved so that the field will line up with
     * other fields that do have labels. Setting this to true will cause the field to not reserve that space.
     * <p><b>
     * 此组件只有在{@link Ext.form.FormLayout FormLayout}布局管理器控制的容器下渲染才有用。
     * This config is only used when this Component is rendered by a Container which has been
     * configured to use the {@link Ext.form.FormLayout FormLayout} layout manager.</b></p>
     * Example use:<pre><code>
new Ext.FormPanel({
    height: 100,
    renderTo: Ext.getBody(),
    items: [{
        xtype: 'textfield'
        hideLabel: true
    }]
});
</code></pre>
     */
    /**
     * @cfg {String} clearCls 
     * 关于field的清除样式（默认为“x-form-clear-left”）。
     * The CSS class used to provide field clearing (defaults to 'x-form-clear-left').
     * <p><b>
     * 此组件只有在{@link Ext.form.FormLayout FormLayout}布局管理器控制的容器下渲染才有用。
     * This config is only used when this Component is rendered by a Container which has been
     * configured to use the {@link Ext.form.FormLayout FormLayout} layout manager.</b></p>
     */
    /**
     * @cfg {String} itemCls 
     * 关于容器的表单项元素的额外的CSS样式（默认为""，如容器的itemCls有设置的话就用那个值）。
     * 由于该样式是作用于整个条目容器的，这就会对在内的表单字段、label元素（若有指定）或其他元素只要属于条目内的元素都有效。
     * An additional CSS class to apply to the wrapper's form item element of this field (defaults
     * to the container's itemCls value if set, or '').  Since it is applied to the item wrapper, it allows you to write
     * standard CSS rules that can apply to the field, the label (if specified) or any other element within the markup for
     * the field.
     * <p><b>
     * 此组件只有在{@link Ext.form.FormLayout FormLayout}布局管理器控制的容器下渲染才有用。
     * This config is only used when this Component is rendered by a Container which has been
     * configured to use the {@link Ext.form.FormLayout FormLayout} layout manager.</b></p>
     * Example use:<pre><code>
// 对表单字段的lable有效 Apply a style to the field's label:
&lt;style>
    .required .x-form-item-label {font-weight:bold;color:red;}
&lt;/style>

new Ext.FormPanel({
	height: 100,
	renderTo: Ext.getBody(),
	items: [{
		xtype: 'textfield',
		fieldLabel: 'Name',
		itemCls: 'required' //该label就会有效果 this label will be styled
	},{
		xtype: 'textfield',
		fieldLabel: 'Favorite Color'
	}]
});
</code></pre>
     */
    /**
     * @cfg {String} anchor <p><b>Note</b>: this config is only used when this Component is rendered
     * by a Container which has been configured to use an <b>{@link Ext.layout.AnchorLayout AnchorLayout}</b>
     * based layout manager, for example:<div class="mdetail-params"><ul>
     * <li>{@link Ext.form.FormPanel}</li>
     * <li>specifying <code>layout: 'anchor' // or 'form', or 'absolute'</code></li>
     * </ul></div></p>
     * <p>See {@link Ext.layout.AnchorLayout}.{@link Ext.layout.AnchorLayout#anchor anchor} also.</p>
     */
    /**
     * @cfg {String} id
     * 唯一的组件id（默认为自动分配的id）。
     * 出于你打算用id来获取组件引用这一目的（像使用{@link Ext.ComponentMgr#getCmp}的情形），你就会送入一个你写好的id到这个方法。
     * 提示：容器的元素即HTML元素也会使用该id渲染在页面上。如此一来你就可以采用CSS id匹配的规则来定义该组件的样式。
     * 换句话说，实例化该组件时，送入不同的Id，就有对应不同的样式效果。
     * The unique id of this component (defaults to an auto-assigned id). You should assign an id if you need to
     * be able to access the component later and you do not have an object reference available (e.g., using
     * {@link Ext.ComponentMgr#getCmp}). Note that this id will also be used as the element id for the containing
     * HTML element that is rendered to the page for this component. This allows you to write id-based CSS rules to
     * style the specific instance of this component uniquely, and also to select sub-elements using this
     * component's id as the parent.
     */
    /**
     * @cfg {String} itemId
     * <p>
     * 若没有为该组件分配到一个访问的应用（换言之是建立变量然后分配置），那么就可以用这个<tt>itemId</tt>的索引来获取这个组件，
     * 另外一个方式就是<code>{@link #id}</code>，对应用{@link Ext}.{@link Ext#getCmp getCmp}获取；
     * 而<code>itemId</code>就对应用{@link Ext.Container#getComponent getComponent}方法获取，
     * 但范围更窄，在{@link Ext.Container}范围内。
     * An <tt>itemId</tt> can be used as an alternative way to get a reference to a component
     * when no object reference is available.     
     * Instead of using an <code>{@link #id}</code> with
     * {@link Ext}.{@link Ext#getCmp getCmp}, use <code>itemId</code> with
     * {@link Ext.Container}.
     * 
     * {@link Ext.Container#getComponent getComponent} which will retrieve
     * <code>itemId</code>'s or <tt>{@link #id}</tt>'s. Since <code>itemId</code>'s are an index to the
     * container's internal MixedCollection, the <code>itemId</code> is scoped locally to the container --
     * avoiding potential conflicts with {@link Ext.ComponentMgr} which requires a <b>unique</b>
     * <code>{@link #id}</code>.</p>
     * <pre><code>
var c = new Ext.Panel({ //
    {@link Ext.BoxComponent#height height}: 300,
    {@link #renderTo}: document.body,
    {@link Ext.Container#layout layout}: 'auto',
    {@link Ext.Container#items items}: [
        {
            itemId: 'p1',
            {@link Ext.Panel#title title}: 'Panel 1',
            {@link Ext.BoxComponent#height height}: 150
        },
        {
            itemId: 'p2',
            {@link Ext.Panel#title title}: 'Panel 2',
            {@link Ext.BoxComponent#height height}: 150
        }
    ]
})
p1 = c.{@link Ext.Container#getComponent getComponent}('p1'); // not the same as {@link Ext#getCmp Ext.getCmp()}
p2 = p1.{@link #ownerCt}.{@link Ext.Container#getComponent getComponent}('p2'); // reference via a sibling
     * </code></pre>
     * <p>Also see <tt>{@link #id}</tt> and <code>{@link #ref}</code>.</p>
     * <p><b>Note</b>: to access the container of an item see <tt>{@link #ownerCt}</tt>.</p>
     */
    /**
     * @cfg {String} xtype
     * 用于登记一个xtype。
     * The registered xtype to create. This config option is not used when passing
     * a config object into a constructor. This config option is used only when
     * lazy instantiation is being used, and a child item of a Container is being
     * specified not as a fully instantiated Component, but as a <i>Component config
     * object</i>. The xtype will be looked up at render time up to determine what
     * type of child Component to create.<br><br>
     * The predefined xtypes are listed {@link Ext.Component here}.
     * <br><br>
     * If you subclass Components to create your own Components, you may register
     * them using {@link Ext.ComponentMgr#registerType} in order to be able to
     * take advantage of lazy instantiation and rendering.
     */
    /**
     * @cfg {String} ptype
     * The registered <tt>ptype</tt> to create. This config option is not used when passing
     * a config object into a constructor. This config option is used only when
     * lazy instantiation is being used, and a Plugin is being
     * specified not as a fully instantiated Component, but as a <i>Component config
     * object</i>. The <tt>ptype</tt> will be looked up at render time up to determine what
     * type of Plugin to create.<br><br>
     * If you create your own Plugins, you may register them using
     * {@link Ext.ComponentMgr#registerPlugin} in order to be able to
     * take advantage of lazy instantiation and rendering.
     */
    /**
     * @cfg {String} cls
     * 一个可选添加的CSS样式类，加入到组件的元素上（默认为''）。这为组件或组件的子节点加入标准CSS规则提供了方便。
     * An optional extra CSS class that will be added to this component's Element (defaults to '').  This can be
     * useful for adding customized styles to the component or any of its children using standard CSS rules.
     */
    /**
     * @cfg {String} overCls
     * 关于鼠标上移至该组件元素的CSS样式类，移出时撤销该样式的效果（默认为''）。
     * 该配置项在处理元素"active"或"hover"的时候很有用。
     * An optional extra CSS class that will be added to this component's Element when the mouse moves
     * over the Element, and removed when the mouse moves out. (defaults to '').  This can be
     * useful for adding customized "active" or "hover" styles to the component or any of its children using standard CSS rules.
     */
    /**
     * @cfg {String} style
     * 作用在组件元素上特定的样式。该值的有效格式应如{@link Ext.Element#applyStyles}。
     * A custom style specification to be applied to this component's Element.  Should be a valid argument to
     * {@link Ext.Element#applyStyles}.
     */
    /**
     * @cfg {String} ctCls
     * 一个可选添加的CSS样式类，加入到组件的容器上（默认为''）。这为容器或容器的子节点加入标准CSS规则提供了方便。
     * An optional extra CSS class that will be added to this component's container (defaults to '').  This can be
     * useful for adding customized styles to the container or any of its children using standard CSS rules.
     */
    /**
     * @cfg {Boolean} disabled
     * 渲染该组件为禁用状态的（默认为false）。
     * Render this component disabled (default is false).
     */
    /**
     * @cfg {Boolean} hidden
     * 渲染该组件为隐藏状态的（默认为false）。
     * Render this component hidden (default is false).
     */
    /**
     * @cfg {Object/Array} plugins
     * 针对该组件自定义的功能，是对象或这些对象组成的数组。一个有效的插件须保证带有一个init的方法以便接收属于Ext.Component类型的引用。
     * 当一个组件被创建后，若发现由插件可用，组件会调用每个插件上的init方法，传入一个应用到插件本身。这样，插件便能按照组件所提供的功能，调用到组件的方法或响应事件。
     * An object or array of objects that will provide custom functionality for this component.  The only
     * requirement for a valid plugin is that it contain an init method that accepts a reference of type Ext.Component.
     * When a component is created, if any plugins are available, the component will call the init method on each
     * plugin, passing a reference to itself.  Each plugin can then call methods or respond to events on the
     * component as needed to provide its functionality.
     */
    /**
     * @cfg {Mixed} applyTo
     * 节点的id,或是DOM节点，又或者是与DIV相当的现有元素，这些都是文档中已经存在的元素
     * 当使用applyTo后，主元素所指定的id或CSS样式类将会作用于组件构成的部分，而被创建的组件将会尝试着根据这些markup构建它的子组件。
     * 使用了这项配置后，不需要执行render()的方法。
     * 若指定了applyTo，那么任何由{@link #renderTo}传入的值将会被忽略并使用目标元素的父级元素作为组件的容器。
     * The id of the element, a DOM element or an existing Element corresponding to a DIV that is already present in
     * the document that specifies some structural markup for this component.  When applyTo is used, constituent parts of
     * the component can also be specified by id or CSS class name within the main element, and the component being created
     * may attempt to create its subcomponents from that markup if applicable. Using this config, a call to render() is
     * not required.  If applyTo is specified, any value passed for {@link #renderTo} will be ignored and the target
     * element's parent node will automatically be used as the component's container.
     */
    /**
     * @cfg {Mixed} renderTo
     * <p>
     * 容器渲染的那个节点的id，或是DOM节点，又或者是与DIV相当的现有元素。
     * 使用了这项配置后，不需要执行render()的方法。
     * The id of the element, a DOM element or an existing Element that this component will be rendered into.
     * When using this config, a call to render() is not required.<p>
     * <p>If this Component needs to be managed by a {@link Ext.Container Container}'s
     * {@link Ext.Component#layout layout manager}, do not use this option. It is the responsiblity
     * of the Container's layout manager to perform rendering. See {@link #render}.</p>
     */

    /**
     * @cfg {Boolean} stateful
     * <p>
     * 组件记忆了一个状态信息，启动时候就根据这个标记获取状态信息。
     * 组件必须设置其{@link #stateId}或{@link #id}，较有保障性，
     * 而自动生成的id在跨页面加载的时候则不能保证一定不出现相同的情形。
     * A flag which causes the Component to attempt to restore the state of internal properties
     * from a saved state on startup. The component must have either a {@link #stateId} or {@link #id}
     * assigned for state to be managed.  Auto-generated ids are not guaranteed to be stable across page
     * loads and cannot be relied upon to save and restore the same state for a component.<p>
     * <p>
     * 为了能记忆状态，必须通过方法设置一个{@link Ext.state.Provider}的实例置于一个状态管理器之中，
     * 然后才可以用{@link Ext.state.Provider#set set}与{@link Ext.state.Provider#get get}的方法，保存记忆和提取记忆。
     * 可用内建的{@link Ext.state.CookieProvider}实现设置一个。
     * For state saving to work, the state manager's provider must have been set to an implementation
     * of {@link Ext.state.Provider} which overrides the {@link Ext.state.Provider#set set}
     * and {@link Ext.state.Provider#get get} methods to save and recall name/value pairs.
     * A built-in implementation, {@link Ext.state.CookieProvider} is available.</p>
     * <p>
     * 要设置页面的状态供应器：
     * To set the state provider for the current page:
     * </p>
     * <pre><code>
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
</code></pre>
     * <p>
     * 接下来，具备状态记忆功能的组件就可以在相关的事件触发过程中保存记忆，事件例表在{@link #stateEvents}。
     * A stateful Component attempts to save state when one of the events listed in the {@link #stateEvents}
     * configuration fires.</p>
     * <p>
     * 要保存状态，该组件首先会调用b><tt>getState</tt></b>初始化状态。
     * 默认下该方法是没有的，这就要让程序员提供针对性的实现，以返回一个该组件可复原状态的对象。
     * To save state, A stateful Component first serializes its state by calling <b><tt>getState</tt></b>. By default,
     * this function does nothing. The developer must provide an implementation which returns an object hash
     * which represents the Component's restorable state.</p>
     * <p>
     * 所返回的对象会被送入到{@link Ext.state.Manager#set}配置项所指定{@link Ext.state.Provider}对象的方法，
     * 还有组件的{@link stateId}作为键值，如果不指定，那{@link #id}代替之。
     * The value yielded by getState is passed to {@link Ext.state.Manager#set} which uses the configured
     * {@link Ext.state.Provider} to save the object keyed by the Component's {@link stateId}, or,
     * if that is not specified, its {@link #id}.</p>
     * <p>
     * 构造过程中，状态化组件首先会尝试使用{@link Ext.state.Manager#get}根据(@link #stateId}<i>复原</i>其状态，
     * 如不能，就用{@link #id}代替之，得到的结果对象就送入至<b><tt>applyState</tt></b>。
     * 缺省的情况是简单的复制属性到对象，但程序员是可在重写该函数的过程添加更多的功能。
     * During construction, a stateful Component attempts to <i>restore</i> its state by calling
     * {@link Ext.state.Manager#get} passing the (@link #stateId}, or, if that is not specified, the {@link #id}.</p>
     * <p>The resulting object is passed to <b><tt>applyState</tt></b>. The default implementation of applyState
     * simply copies properties into the object, but a developer may override this to support more behaviour.</p>
     * <p>
     * 同样你可以加入更多额外的功能，如是者有{@link #beforestaterestore}事件、{@link #staterestore}事件、{@link #beforestatesave}事件、{@link #beforestatesave}事件和{@link #statesave}。
     * You can perform extra processing on state save and restore by attaching handlers to the
     * {@link #beforestaterestore}, {@link #staterestore}, {@link #beforestatesave} and {@link #statesave} events</p>
     */
    /**
     * @cfg {String} stateId
     * 出于状态管理目的id，（默认是人为设置过的组件id，如果组件是自动生成的id那种那么该项是null。
     * The unique id for this component to use for state management purposes (defaults to the component id if one was
     * set, otherwise null if the component is using a generated id).
     * <p>参阅{@link #stateful}了解记忆与复原的机制。See {@link #stateful} for an explanation of saving and restoring Component state.</p>
     */
    /* //internal - to be set by subclasses
     * @cfg {Array} stateEvents
     * An array of events that, when fired, should trigger this component to save its state (defaults to none).
     * These can be any types of events supported by this component, including browser or custom events (e.g.,
     * ['click', 'customerchange']).
     * <p>See {@link #stateful} for an explanation of saving and restoring Component state.</p>
     */

    /**
     * @cfg {Mixed} autoEl
     * <p>
     * 某种标签的字符串或者{@link Ext.DomHelper DomHelper}配置对象，用于创建承载此组件的元素。
     * A tag name or {@link Ext.DomHelper DomHelper} spec used to create the {@link #getEl Element} which will
     * encapsulate this Component.</p>
     * <p>
     * 一般而言你无须对其设置。对于这些基础类而言，就会使用<b><tt>div</tt></b>作为其默认的元素。
     * Ext类写得越复杂，组件的onRender方法产生的DOM结构就随之更为复杂。
     * You do not normally need to specify this. For the base classes {@link Ext.Component}, {@link Ext.BoxComponent},
     * and {@link Ext.Container}, this defaults to <b><tt>'div'</tt></b>. The more complex Ext classes use a more complex
     * DOM structure created by their own onRender methods.</p>
     * <p>
     * 该项是为创建形形色色的DOM元素而准备的，开发者可根据程序的特定要求去制定，如：
     * This is intended to allow the developer to create application-specific utility Components encapsulated by
     * different DOM elements. Example usage:</p><pre><code>
{
    xtype: 'box',
    autoEl: {
        tag: 'img',
        src: 'http://www.example.com/example.jpg'
    }
}, {
    xtype: 'box',
    autoEl: {
        tag: 'blockquote',
        html: 'autoEl is cool!'
    }
}, {
    xtype: 'container',
    autoEl: 'ul',
    cls: 'ux-unordered-list',
    items: {
        xtype: 'box',
        autoEl: 'li',
        html: 'First list item'
    }
}
</code></pre>
     */
    autoEl : 'div',
    
    /**
     * @cfg {String} disabledClass
     * 当组件被禁用时作用的CSS样式类（默认为"x-item-disabled"）。
     * CSS class added to the component when it is disabled (defaults to "x-item-disabled").
     */
    disabledClass : "x-item-disabled",
    /**
     * @cfg {Boolean} allowDomMove
     * 当渲染进行时能否移动Dom节点上的组件（默认为true）。
     * Whether the component can move the Dom node when rendering (defaults to true).
     */
    allowDomMove : true,
    /**
     * @cfg {Boolean} autoShow
     * True表示为在渲染的时候先检测一下有否关于隐藏的样式类（如：'x-hidden'或'x-hide-display'），有就移除隐藏的样式类（缺省为false）。
     * True if the component should check for hidden classes (e.g. 'x-hidden' or 'x-hide-display') and remove
     * them on render (defaults to false).
     */
    autoShow : false,
    /**
     * @cfg {String} hideMode
     * <p>
     * 这个组件是怎么隐藏的。可支持的值有"visibility" （css中的visibility），"offsets"（负偏移位置）和"display"（css中的display）－默认为“display”。
     * How this component should be hidden. Supported values are "visibility" (css visibility), "offsets" (negative
     * offset position) and "display" (css display) - defaults to "display".</p>
     * <p>
     * 容器可能是{@link Ext.layout.CardLayout card layout}或{@link Ext.TabPanel TabPanel}中的一员，会有隐藏/显未的情形，这种情形下最好将其hideMode模式设为"offsets"。
     * 这保证了计算布局时，组件仍有正确的高度和宽度，组件管理器才能顺利地测量。
     * For Containers which may be hidden and shown as part of a {@link Ext.layout.CardLayout card layout} Container such as a
     * {@link Ext.TabPanel TabPanel}, it is recommended that hideMode is configured as "offsets". This ensures
     * that hidden Components still have height and width so that layout managers can perform measurements when
     * calculating layouts.</p>
     */
    hideMode: 'display',
    /**
     * @cfg {Boolean} hideParent
     * True表示为当隐藏/显示组件时对组件的容器亦一同隐藏/显示,false就只会隐藏/显示组件本身（默认为false）。
     * 例如，可设置一个hide:true的隐藏按钮在window，如果按下就通知其父容器一起隐藏，这样做起来比较快捷省事。
     * True to hide and show the component's container when hide/show is called on the component, false to hide
     * and show the component itself (defaults to false).  For example, this can be used as a shortcut for a hide
     * button on a window by setting hide:true on the button when adding it to its parent container.
     */
    hideParent: false,
    
    /**
     * <p>该组件的{@link Ext.Element}元素对象。只读的。</p>
     * <p>用<tt>{@link #getEl getEl}可返回该对象。</p>
     * @type Ext.Element
     * @property el
     */
    /**
     * 组件自身的{@link Ext.Container}（默认是undefined，只有在组件加入到容器时才会自动设置该属性）只读的。
     * The component's owner {@link Ext.Container} (defaults to undefined, and is set automatically when
     * the component is added to a container).  Read-only.
     * @type Ext.Container
     * @property ownerCt
     */
    /**
     * True表示为组件是隐藏的。只读的。
     * True if this component is hidden. Read-only.
     * @type Boolean
     * @property hidden
     */
    hidden : false,
    /**
     * True表示为组件已被禁止。只读的。
     * True if this component is disabled. Read-only.
     * @type Boolean
     * @property disabled
     */
    disabled : false,
    /**
     * True表示为该组件已经渲染好了。只读的。
     * True if this component has been rendered. Read-only.
     * @type Boolean
     * @property rendered
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

    initPlugin : function(p){
        if(p.ptype && typeof p.init != 'function'){
            p = Ext.ComponentMgr.createPlugin(p);
        }else if(typeof p == 'string'){
            p = Ext.ComponentMgr.createPlugin({
                ptype: p
            });
        }
        p.init(this);
        return p;
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
     * <p>执行容器的渲染，可以将渲染执行在送入的HTML元素上面。
     * Render this Component into the passed HTML element.</p>
     * <p><b>如果你在使用{@link Ext.Container Container}对象来存放该组件，那么就不要使用render方法。
     * If you are using a {@link Ext.Container Container} object to house this Component, then
     * do not use the render method.</b></p>
     * <p>一个容器的子组件可以由容器其{@link Ext.Container#layout layout}属性在第一次渲染的时候来明确指定。
     * A Container's child Components are rendered by that Container's
     * {@link Ext.Container#layout layout} manager when the Container is first rendered.</p>
     * <p>Certain layout managers allow dynamic addition of child components. Those that do
     * include {@link Ext.layout.CardLayout}, {@link Ext.layout.AnchorLayout},
     * {@link Ext.layout.FormLayout}, {@link Ext.layout.TableLayout}.</p>
     * <p>
     * 对于已渲染的组件加入新的子组件在内，就要调用{@link Ext.Container#doLayout doLayout}方法刷新视图，
     * 并层引发未渲染的于组件进行渲染，如果加入多个子组件渲染一次就足够了。
     * If the Container is already rendered when a new child Component is added, you may need to call
     * the Container's {@link Ext.Container#doLayout doLayout} to refresh the view which causes any
     * unrendered child Components to be rendered. This is required so that you can add multiple
     * child components if needed while only refreshing the layout once.</p>
     * <p>
     * 对于复杂的而言，要请楚知道的是其子项的定位与大小调节的任务是归属于容器的{@link Ext.Container#layout layout}管理器的。
     * When creating complex UIs, it is important to remember that sizing and positioning
     * of child items is the responsibility of the Container's {@link Ext.Container#layout layout} manager.
     * If you expect child items to be sized in response to user interactions, you must
     * configure the Container with a layout manager which creates and manages the type of layout you
     * have in mind.</p>
     * <p><b>
     * 省略不写容器的{@link Ext.Container#layout layout}配置项表示使用的最最简单的布局管理器，功能只有渲染子组件到容器中，没有大小调节和定位的功能，
     * 不过你想实现这些功能就要为容器准备好一个你要调置的布局管理器。
     * Omitting the Container's {@link Ext.Container#layout layout} config means that a basic
     * layout manager is used which does nothing but render child components sequentially into the
     * Container. No sizing or positioning will be performed in this situation.</b></p>
     * @param {Element/HTMLElement/String} container （可选的）组件准备渲染到的元素，如果基于现有的元素，那该项就应有略。
     * (optional) The element this Component should be
     * rendered into. If it is being created from existing markup, this should be omitted.
     * @param {String/Number} position （可选的）元素ID或Dom节点索引，说明该组件在容器中的哪一个子组件<b>之前</b>插入（默认加在容器中最后的位置）。
     * (optional) The element ID or DOM node index within the container <b>before</b>
     * which this component will be inserted (defaults to appending to the end of the container)
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
            if(this.overCls){
                this.el.addClassOnOver(this.overCls);
            }
            this.fireEvent("render", this);
            this.afterRender(this.container);
            if(this.hidden){
                this.hide();
            }
            if(this.disabled){
                this.disable();
            }

            if(this.stateful !== false){
                this.initStateEvents();
            }
            this.initRef();
            this.fireEvent("afterrender", this);
        }
        return this;
    },
    /**
         * @cfg {String} ref
         * <p>
         * 一种路径的规范，可获取位于该容器下某一子组件的{@link #ownerCt}。该路径依靠此组件本身为引用根据。
         * A path specification, relative to the Component's {@link #ownerCt} specifying into which
         * ancestor Container to place a named reference to this Component.</p>
         * <p>
         * 父亲轴可以用'/'字符横切开来。例如在一个Panel面板中的工具栏上如此地引用按钮，会是这样：
         * The ancestor axis can be traversed by using '/' characters in the path.
         * For example, to put a reference to a Toolbar Button into <i>the Panel which owns the Toolbar</i>:</p><pre><code>
var myGrid = new Ext.grid.EditorGridPanel({
    title: '我的EditorGridPanel',
    store: myStore,
    colModel: myColModel,
    tbar: [{
        text: '保存',
        handler: saveChanges,
        disabled: true,
        ref: '../saveButton'
    }],
    listeners: {
        afteredit: function() {
//          GridPanel（myGrid）就有了这个savaButton的引用。The button reference is in the GridPanel
            myGrid.saveButton.enable();
        }
    }
});
</code></pre>
         * <p>
         * 以上代码中，ref: '../saveButton'就是配置项的按钮其标识为saveButton，“../”相对为该组件，即目标组件的{@link #ownerCt}的上一层组件。
         * In the code above, if the ref had been <code>'saveButton'</code> the reference would
         * have been placed into the Toolbar. Each '/' in the ref moves up one level from the
         * Component's {@link #ownerCt}.</p>
         */
    initRef : function(){
        if(this.ref){
            var levels = this.ref.split('/');
            var last = levels.length, i = 0;
            var t = this;
            while(i < last){
                if(t.ownerCt){
                    t = t.ownerCt;
                }
                i++;
            }
            t[levels[--i]] = this;
        }
    },

    // private
    initState : function(config){
        if(Ext.state.Manager){
            var id = this.getStateId();
            if(id){
                var state = Ext.state.Manager.get(id);
                if(state){
                    if(this.fireEvent('beforestaterestore', this, state) !== false){
                        this.applyState(state);
                        this.fireEvent('staterestore', this, state);
                    }
                }
            }
        }
    },

    // private
    getStateId : function(){
        return this.stateId || ((this.id.indexOf('ext-comp-') == 0 || this.id.indexOf('ext-gen') == 0) ? null : this.id);
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
            var id = this.getStateId();
            if(id){
                var state = this.getState();
                if(this.fireEvent('beforestatesave', this, state) !== false){
                    Ext.state.Manager.set(id, state);
                    this.fireEvent('statesave', this, state);
                }
            }
        }
    },

    /**
     * 把这个组件应用到当前有效的markup。执行该函数后，无须调用render()。
     * Apply this component to existing markup that is valid. With this function, no call to render() is required.
     * @param {String/HTMLElement} el
     */
    applyToMarkup : function(el){
        this.allowDomMove = false;
        this.el = Ext.get(el);
        this.render(this.el.dom.parentNode);
    },

    /**
     * 加入CSS样式类到组件所在的元素。
     * Adds a CSS class to the component's underlying element.
     * @param {string} cls 要加入的CSS样式类。The CSS class name to add
     * @return {Ext.Component} this
     */
    addClass : function(cls){
        if(this.el){
            this.el.addClass(cls);
        }else{
            this.cls = this.cls ? this.cls + ' ' + cls : cls;
        }
        return this;
    },

    /**
     * 移除CSS样式类到组件所属的元素。
     * Removes a CSS class from the component's underlying element.
     * @param {string} cls 要移除的CSS样式类。The CSS class name to remove
     * @return {Ext.Component} this
     */
    removeClass : function(cls){
        if(this.el){
            this.el.removeClass(cls);
        }else if(this.cls){
            this.cls = this.cls.split(' ').remove(cls).join(' ');
        }
        return this;
    },

    // private
    // default function is not really useful
    onRender : function(ct, position){
        if(!this.el && this.autoEl){
            if(typeof this.autoEl == 'string'){
                this.el = document.createElement(this.autoEl);
            }else{
                var div = document.createElement('div');
                Ext.DomHelper.overwrite(div, this.autoEl);
                this.el = div.firstChild;
            }
            if (!this.el.id) {
                this.el.id = this.getId();
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
     * Destroys this component by purging any event listeners, removing the component's element from the DOM,
     * removing the component from its {@link Ext.Container} (if applicable) and unregistering it from
     * {@link Ext.ComponentMgr}.  Destruction is generally handled automatically by the framework and this method
     * should usually not need to be called directly.
     */
    destroy : function(){
        if(this.fireEvent("beforedestroy", this) !== false){
            this.beforeDestroy();
            if(this.rendered){
                this.el.removeAllListeners();
                this.el.remove();
                if(this.actionMode == "container" || this.removeMode == "container"){
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
     * <p>返回所属的{@link Ext.Element}。<i>通常</i>这是一个&lt;DIV>元素，由onRender方法所创建，但也有可能是{@link #autoEl}配置项所制定的那个。
     * Returns the {@link Ext.Element} which encapsulates this Component. This will <i>usually</i> be
     * a &lt;DIV> element created by the class's onRender method, but that may be overridden using the {@link #autoEl} config.</p>
     * <p><b>
     * 该组件若是未完全渲染完毕的话，这个元素是不存在的。
     * The Element will not be available until this Component has been rendered.</b></p>
     * <p>
     * 要登记改组件的<b>DOM事件</b>（相当于组件本身的Observable事件而言），就要这样加入事件侦听器（如render事件）：
     * To add listeners for <b>DOM events</b> to this Component (as opposed to listeners for this Component's
     * own Observable events), perform the adding of the listener in a render event listener:</p><pre><code>
new Ext.Panel({
    title: 'The Clickable Panel',
    listeners: {
        render: function(p) {
//          Append the Panel to the click handler's argument list.
            p.getEl().on('click', handlePanelClick.createDelegate(null, [p], true));
        }
    }
});
</code></pre>
     * @return {Ext.Element} 包含该组件的元素对象。The Element which encapsulates this Component.
     */
    getEl : function(){
        return this.el;
    },

    /**
     * 返回该组件的id。
     * Returns the id of this component.
     * @return {String}
     */
    getId : function(){
        return this.id || (this.id = "ext-comp-" + (++Ext.Component.AUTO_ID));
    },

    /**
     * 返回该组件的item id。
     * Returns the item id of this component.
     * @return {String}
     */
    getItemId : function(){
        return this.itemId || this.getId();
    },

    /**
     * 试着将焦点放到此项。
     * Try to focus this component.
     * @param {Boolean} selectText （可选的）true的话同时亦选中组件中的文本（尽可能）。(optional)If applicable, true to also select the text in this component
     * @param {Boolean/Number} delay （可选的）延时聚焦行为的毫秒数（true表示为10毫秒）。(optional) Delay the focus this number of milliseconds (true for 10 milliseconds)
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
     * Disable this component.
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
     * Enable this component.
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
     * Convenience function for setting disabled/enabled by boolean.
     * @param {Boolean} disabled
     * @return {Ext.Component} this
     */
    setDisabled : function(disabled){
        return this[disabled ? "disable" : "enable"]();
    },

    /**
     * 显示该组件。
     * Show this component.
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
     * Hide this component.
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
     * Convenience function to hide or show this component by boolean.
     * @param {Boolean} visible 为True时显示/false时隐藏。True to show, false to hide
     * @return {Ext.Component} this
     */
    setVisible: function(visible){
        return this[visible ? "show" : "hide"]();
    },

    /**
     * 该组件可见时返回true。
     * Returns true if this component is visible.
     * @return {Boolean} 为True时显示/false时隐藏。True if this component is visible, false otherwise.
     */
    isVisible : function(){
        return this.rendered && this.getActionEl().isVisible();
    },

    /**
     * 根据原始传入到该实例的配置项值，克隆一份组件。
     * Clone the current component using the original config values passed into this instance by default.
     * @param {Object} overrides 一个新配置项对象，用于对克隆版本的属性进行重写。属性id应要重写，避免重复生成一个。 A new config containing any properties to override in the cloned version.
     * An id property can be passed on this object, otherwise one will be generated to avoid duplicates.
     * @return {Ext.Component} clone 克隆该组件的copy。The cloned copy of this component
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
     * Gets the xtype for this component as registered with {@link Ext.ComponentMgr}. For a list of all
     * available xtypes, see the {@link Ext.Component} header. Example usage:
     * <pre><code>
var t = new Ext.form.TextField();
alert(t.getXType());  // 提示alerts 'textfield'
</code></pre>
     * @return {String} The xtype
     */
    getXType : function(){
        return this.constructor.xtype;
    },

    /**
     * <p>测试这个组件是否属于某个指定的xtype。
     * 这个方法既可测试该组件是否为某个xtype的子类，或直接是这个xtype的实例（shallow = true）
     * Tests whether or not this Component is of a specific xtype. This can test whether this Component is descended
     * from the xtype (default) or whether it is directly of the xtype specified (shallow = true).</p>
     * <p><b>
     * 如果你创建了子类，要注意必须登记一个新的xtype，让xtype的层次性发挥作用。
     * If using your own subclasses, be aware that a Component must register its own xtype
     * to participate in determination of inherited xtypes.</b></p>
     * <p>全部可用的xtypes列表，可参考{@link Ext.Component}开头。
     * For a list of all available xtypes, see the {@link Ext.Component} header.</p>
     * <p>用法举例：Example usage:</p>
     * <pre><code>
var t = new Ext.form.TextField();
var isText = t.isXType('textfield');        // true
var isBoxSubclass = t.isXType('box');       // true，textfield继承自BoxComponent  true, descended from BoxComponent
var isBoxInstance = t.isXType('box', true); // false，非BoxComponent本身的实例 false, not a direct BoxComponent instance
</code></pre>
     * @param {String} xtype 测试该组件的xtype。The xtype to check for this Component
     * @param {Boolean} shallow （可选的）False表示为测试该组件是否为某个xtype的子类（缺省）。(optional) False to check whether this Component is descended from the xtype (this is
     * the default), or true to check whether this Component is directly of the specified xtype.
     * @return {Boolean} true就表示为测试该组件是否这个xtype本身的实例。True if this component descends from the specified xtype, false otherwise.
     */
    isXType : function(xtype, shallow){
        //assume a string by default
        if (typeof xtype == 'function'){
            xtype = xtype.xtype; //handle being passed the class, eg. Ext.Component
        }else if (typeof xtype == 'object'){
            xtype = xtype.constructor.xtype; //handle being passed an instance
        }
            
        return !shallow ? ('/' + this.getXTypes() + '/').indexOf('/' + xtype + '/') != -1 : this.constructor.xtype == xtype;
    },

    /**
     * <p>
     * 返回以斜杠分割的字符串，表示组件的xtype层次。
     * 全部可用的xtypes列表，可参考{@link Ext.Component}开头。
     * Returns this Component's xtype hierarchy as a slash-delimited string. For a list of all
     * available xtypes, see the {@link Ext.Component} header.</p>
     * <p><b>
     * 如果你创建了子类，要注意必须登记一个新的xtype，让xtype的层次性发挥作用。
     * If using your own subclasses, be aware that a Component must register its own xtype
     * to participate in determination of inherited xtypes.</b></p>
     * <p>用法举例：Example usage:</p>
     * <pre><code>
var t = new Ext.form.TextField();
alert(t.getXTypes());  // 提示alerts 'component/box/field/textfield'
</pre></code>
     * @return {String} 层次的字符串。The xtype hierarchy string
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
    },

    /**
     * 在此组件之下由自定义的函数作搜索依据查找容器。
     * 如函数返回true返回容器的结果。传入的函数会有(container, this component)的参数。
     * Find a container above this component at any level by a custom function. If the passed function returns
     * true, the container will be returned. The passed function is called with the arguments (container, this component).
     * @param {Function} fcn
     * @param {Object} scope (optional)（可选的）
     * @return {Ext.Container} 首次匹配的容器。The first Container for which the custom function returns true
     */
    findParentBy: function(fn) {
        for (var p = this.ownerCt; (p != null) && !fn(p, this); p = p.ownerCt);
        return p || null;
    },

    /**
     * 根据xtype或class查找该容器下任意层次中某个容器。
     * Find a container above this component at any level by xtype or class
     * @param {String/Class} xtype 组件的xtype字符串，或直接就是组件的类本身。The xtype string for a component, or the class of the component directly
     * @return {Ext.Container} 首次匹配的容器。The first Container which matches the given xtype or class
     */
    findParentByType: function(xtype) {
        return typeof xtype == 'function' ?
            this.findParentBy(function(p){
                return p.constructor === xtype;
            }) :
            this.findParentBy(function(p){
                return p.constructor.xtype === xtype;
            });
    },

    getDomPositionEl : function(){
        return this.getPositionEl ? this.getPositionEl() : this.getEl();
    },

    // internal function for auto removal of assigned event handlers on destruction
    mon : function(item, ename, fn, scope, opt){
        if(!this.mons){
            this.mons = [];
            this.on('beforedestroy', function(){
                for(var i= 0, len = this.mons.length; i < len; i++){
                    var m = this.mons[i];
                    m.item.un(m.ename, m.fn, m.scope);
                }
            }, this, {single: true});
        }
		
        if(typeof ename == "object"){
        	var propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;
        	
            var o = ename;
            for(var e in o){
                if(propRe.test(e)){
                    continue;
                }
                if(typeof o[e] == "function"){
                    // shared options
			        this.mons.push({
			            item: item, ename: e, fn: o[e], scope: o.scope
			        });
			        item.on(e, o[e], o.scope, o);
                }else{
                    // individual options
			        this.mons.push({
			            item: item, ename: e, fn: o[e], scope: o.scope
			        });
			        item.on(e, o[e]);
                }
            }
            return;
        }

            
        this.mons.push({
            item: item, ename: ename, fn: fn, scope: scope
        });        
        item.on(ename, fn, scope, opt);
    },

    /**
     * 在所属的容器范围中范围旁边下一个的组件。
     * Returns the next component in the owning container
     * @return Ext.Component
     */
    nextSibling : function(){
        if(this.ownerCt){
            var index = this.ownerCt.items.indexOf(this);
            if(index != -1 && index+1 < this.ownerCt.items.getCount()){
                return this.ownerCt.items.itemAt(index+1);
            }
        }
        return null;
    },

    /**
     * 在所属的容器范围中范围旁边上一个的组件。
     * Returns the previous component in the owning container
     * @return Ext.Component
     */
    previousSibling : function(){
        if(this.ownerCt){
            var index = this.ownerCt.items.indexOf(this);
            if(index > 0){
                return this.ownerCt.items.itemAt(index-1);
            }
        }
        return null;
    },

    /**
     * 为Observable对象的fireEvent方法，方便对该组件的父级组件进行逐层上报。
     * Provides the link for Observable's fireEvent method to bubble up the ownership hierarchy.
     * @return 包含该组件的容器。the Container which owns this Component.
     */
    getBubbleTarget : function(){
        return this.ownerCt;
    }
});

Ext.reg('component', Ext.Component);
