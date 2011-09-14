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
 * @class Ext.Container
 * @extends Ext.BoxComponent
 * <p>
 * {@link Ext.BoxComponent}的子类，用于承载其它任何组件，容器负责一些基础性的行为，也就是装载子项、添加、插入和移除子项。
 * 根据容纳子项的不同，所产生的可视效果，需委托任意布局类{@link #layout}中的一种来指点特定的布局逻辑（layout logic）。
 * 此类被于继承而且一般情况下不应通过关键字new来直接实例化。<br />
 * Base class for any {@link Ext.BoxComponent} that can contain other Components. The most commonly
 * used Container classes are {@link Ext.Panel}, {@link Ext.Window} and {@link Ext.TabPanel}, but you can
 * create a lightweight Container to be encapsulated by an HTML element that is created to your
 * specifications at render time by using the {@link Ext.Component#autoEl autoEl} config option
 * which takes the form of a {@link Ext.DomHelper DomHelper} specification, or tag name. If you do not need
 * the capabilities offered by the above mentioned classes, for instance when creating embedded
 * {@link Ext.layout.ColumnLayout column} layouts inside FormPanels, then this is a useful technique.</p>
 * <p>The code below illustrates both how to explicitly <i>create</i> a Container, and how to implicitly
 * create one using the <b><tt>'container'</tt></b> xtype:<pre><code>
var embeddedColumns = new Ext.Container({
    autoEl: 'div',  // 默认的设置。This is the default
    layout: 'column',
    defaults: {
        xtype: 'container',
        autoEl: 'div', // 默认的设置。This is the default.
        layout: 'form',
        columnWidth: 0.5,
        style: {
            padding: '10px'
        }
    },
// 下面两项都成为Ext.Containers，都是对&lt;DIV>元素的封装。
// The two items below will be Ext.Containers, each encapsulated by a &lt;DIV> element.
    items: [{
        items: {
            xtype: 'datefield',
            name: 'startDate',
            fieldLabel: 'Start date'
        }
    }, {
        items: {
            xtype: 'datefield',
            name: 'endDate',
            fieldLabel: 'End date'
        }
    }]
});</code></pre></p>
 * 容器负责处理容纳子项的基本行为，命名式加入、插入和移除等任务。进行可视化子项的渲染任务，其制定的布局逻辑是委托任意一个{@link #layout}类来完成的。<br />
 * Containers handle the basic behavior of containing items, namely adding, inserting and removing them.
 * The specific layout logic required to visually render contained items is delegated to any one of the different
 * {@link #layout} classes available.</p>
 * <p>
 * 无论是通过配置项{@link #items}说明容器的子项，还是动态地加入容器，都要考虑何如安排这些子元素的，并是否处于Ext内建的布局规程下的大小调节控制。<br />
 * When either specifying child {@link #items} of a Container, or dynamically adding components to a Container,
 * remember to consider how you wish the Container to arrange those child elements, and whether those child elements
 * need to be sized using one of Ext's built-in layout schemes.</p>
 * <p>
 * 默认下，容器使用{@link Ext.layout.ContainerLayout ContainerLayout}规程。
 * 该布局规程充其量只会负责渲染子组件，将容器中的内容一个接着一个来渲染，并没有提供任何大小调节的功能。
 * 出于该原因，有时在使用GridPanel或TreePanel的时候，误用了某种风格的布局规程便会有不正确的效果。
 * 如果容器用着还是ContainerLayout规程，这即意味着调节父容器大小，子容器也是熟视无睹的。<br />
 * By default, Containers use the {@link Ext.layout.ContainerLayout ContainerLayout} scheme. This simply renders
 * child components, appending them one after the other inside the Container, and does not apply any sizing at all.
 * This is a common source of confusion when widgets like GridPanels or TreePanels are added to Containers for
 * which no layout has been specified. If a Container is left to use the ContainerLayout scheme, none of its child
 * components will be resized, or changed in any way when the Container is resized.</p>
 * <p>
 * 
 * A very common example of this is where a developer will attempt to add a GridPanel to a TabPanel by wrapping
 * the GridPanel <i>inside</i> a wrapping Panel and add that wrapping Panel to the TabPanel. This misses the point that
 * Ext's inheritance means that a GridPanel <b>is</b> a Component which can be added unadorned into a Container. If
 * that wrapping Panel has no layout configuration, then the GridPanel will not be sized as expected.<p>
 * <p>Below is an example of adding a newly created GridPanel to a TabPanel. A TabPanel uses {@link Ext.layout.CardLayout}
 * as its layout manager which means all its child items are sized to fit exactly into its client area. The following
 * code requires prior knowledge of how to create GridPanels. See {@link Ext.grid.GridPanel}, {@link Ext.data.Store}
 * and {@link Ext.data.JsonReader} as well as the grid examples in the Ext installation's <tt>examples/grid</tt>
 * directory.</p><pre><code>
//  创建一个GridPanel。Create the GridPanel.
myGrid = new Ext.grid.GridPanel({
    store: myStore,
    columns: myColumnModel,
    title: 'Results',
});

myTabPanel.add(myGrid);
myTabPanel.setActiveTab(myGrid);
</code></pre>
 */
Ext.Container = Ext.extend(Ext.BoxComponent, {
    /** @cfg {Boolean} monitorResize
     * Ture表示为自动监视window resize的事件，以处理接下来一切的事情，包括对视见区（viewport）当前大小的感知，一般情况该值由{@link #layout}调控，而无须手动设置。True to automatically monitor window resize events to handle anything that is sensitive to the current size
     * of the viewport.  This value is typically managed by the chosen {@link #layout} and should not need to be set manually.
     */
    /**
     * @cfg {String} layout
     * 此容器所使用的布局类型。如不指定，则使用缺省的{@link Ext.layout.ContainerLayout}类型。
     * 当中有效的值可以是：accordion、anchor、border、cavd、column、fit、form和table。
	 * 针对所选择布局类型，可指定{@link #layoutConfig}进一步配置。
     * The layout type to be used in this container.  If not specified, a default {@link Ext.layout.ContainerLayout}
     * will be created and used. Specific config values for the chosen layout type can be specified using 
     * {@link #layoutConfig}. Valid values are:<ul class="mdetail-params">
     * <li>absolute</li>
     * <li>accordion</li>
     * <li>anchor</li>
     * <li>border</li>
     * <li>card</li>
     * <li>column</li>
     * <li>fit</li>
     * <li>form</li>
     * <li>table</li></ul>
     */
    /**
     * @cfg {Object} layoutConfig
     * 选定好layout布局后，其相应的配置属性就在这个对象上进行设置。 
     * （即与{@link #layout}配置联合使用）有关不同类型布局有效的完整配置信息，参阅对应的布局类：
     * This is a config object containing properties specific to the chosen layout (to be used in conjunction with
     * the {@link #layout} config value).  For complete details regarding the valid config options for each layout
     * type, see the layout class corresponding to the type specified:<ul class="mdetail-params">
     * <li>{@link Ext.layout.Absolute}</li>
     * <li>{@link Ext.layout.Accordion}</li>
     * <li>{@link Ext.layout.AnchorLayout}</li>
     * <li>{@link Ext.layout.BorderLayout}</li>
     * <li>{@link Ext.layout.CardLayout}</li>
     * <li>{@link Ext.layout.ColumnLayout}</li>
     * <li>{@link Ext.layout.FitLayout}</li>
     * <li>{@link Ext.layout.FormLayout}</li>
     * <li>{@link Ext.layout.TableLayout}</li></ul>
     */
    /**
     * @cfg {Boolean/Number} bufferResize
     * 当设置为true（100毫秒）或输入一个毫秒数，为此容器所分配的布局会缓冲其计算的频率和缓冲组件的重新布局。
     * 如容器包含大量的子组件或这样重型容器，在频繁进行高开销的布局时，该项尤为有用。
     * When set to true (100 milliseconds) or a number of milliseconds, the layout assigned for this container will buffer
     * the frequency it calculates and does a re-layout of components. This is useful for heavy containers or containers
     * with a large quantity of sub-components for which frequent layout calls would be expensive.
     */
    /**
     * @cfg {String/Number} activeItem
     * 组件id的字符串，或组件的索引，用于在容器布局渲染时候的设置为活动。例如，activeItem: 'item-1'或activeItem: 0
     * index 0 = 容器集合中的第一项）。只有某些风格的布局可设置activeItem（如{@link Ext.layout.Accordion}、{@link Ext.layout.CardLayout}和
     * {@link Ext.layout.FitLayout}），以在某个时刻中显示一项内容。相关内容请参阅{@link Ext.layout.ContainerLayout#activeItem}。
     * A string component id or the numeric index of the component that should be initially activated within the
     * container's layout on render.  For example, activeItem: 'item-1' or activeItem: 0 (index 0 = the first
     * item in the container's collection).  activeItem only applies to layout styles that can display
     * items one at a time (like {@link Ext.layout.Accordion}, {@link Ext.layout.CardLayout} and
     * {@link Ext.layout.FitLayout}).  Related to {@link Ext.layout.ContainerLayout#activeItem}.
     */
    /**
     * @cfg {Mixed} items
     * 一个单独项，或子组件组成的数组，加入到此容器中。
     * 每一项的对象类型是基于{@link Ext.Component}的<br><br>
     * 你可传入一个组件的配置对象即是lazy-rendering的做法，这样做的好处是组件不会立即渲染，减低直接构建组件对象带来的开销。
     * 要发挥"lazy instantiation延时初始化"的特性，应对组件所属的登记类型的{@link Ext.Component#xtype}属性进行配置。<br><br>
     * 要了解所有可用的xtyps，可参阅{@link Ext.Component}。如传入的单独一个项，应直接传入一个对象的引用（
     * 如items: {...}）。多个项应以数组的类型传入（如items: [{...}, {...}]）。
     * A single item, or an array of child Components to be added to this container.
     * Each item can be any type of object based on {@link Ext.Component}.<br><br>
     * Component config objects may also be specified in order to avoid the overhead
     * of constructing a real Component object if lazy rendering might mean that the
     * added Component will not be rendered immediately. To take advantage of this
     * "lazy instantiation", set the {@link Ext.Component#xtype} config property to
     * the registered type of the Component wanted.<br><br>
     * For a list of all available xtypes, see {@link Ext.Component}.
     * If a single item is being passed, it should be passed directly as an object
     * reference (e.g., items: {...}).  Multiple items should be passed as an array
     * of objects (e.g., items: [{...}, {...}]).
     */
    /**
     * @cfg {Object} defaults
     * 应用在全体组件上的配置项对象，无论组件是由{@link #items}指定，抑或是通过{@link #add}、{@link #insert}的方法加入，都可支持。
     * 缺省的配置可以是任意多个容器能识别的“名称/值”，
     * 假设要自动为每一个{@link Ext.Panel}项设置padding内补丁，你可以传入defaults: {bodyStyle:'padding:15px'}。
     * A config object that will be applied to all components added to this container either via the {@link #items}
     * config or via the {@link #add} or {@link #insert} methods.  The defaults config can contain any number of
     * name/value property pairs to be added to each item, and should be valid for the types of items
     * being added to the container.  For example, to automatically apply padding to the body of each of a set of
     * contained {@link Ext.Panel} items, you could pass: defaults: {bodyStyle:'padding:15px'}.
     */

    /** @cfg {Boolean} autoDestroy
     * 若为true容器会自动销毁容器下面全部的组件，否则的话必须手动执行销毁过程（默认为true）。
     * If true the container will automatically destroy any contained component that is removed from it, else
     * destruction must be handled manually (defaults to true).
     */
    autoDestroy: true,
    /** @cfg {Boolean} hideBorders
     * True表示为隐藏容器下每个组件的边框，false表示保留组件现有的边框设置（默认为false）。
     * True to hide the borders of each contained component, false to defer to the component's existing
     * border settings (defaults to false).
     */
    /** @cfg {String} defaultType
     * <p>容器的默认类型，用于在{@link Ext.ComponentMgr}中表示它的对象。（默认为'panel'）The default {@link Ext.Component xtype} of child Components to create in this Container when
     * a child item is specified as a raw configuration object, rather than as an instantiated Component.</p>
     * <p>Defaults to 'panel'.</p>
     */
    defaultType: 'panel',

    // private
    initComponent : function(){
        Ext.Container.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event afterlayout
             * 由关联的布局管理器（layout manager）分配好容器上的组件后触发 Fires when the components in this container are arranged by the associated layout manager.
             * @param {Ext.Container} this
             * @param {ContainerLayout} layout 此容器的ContainerLayout实现。 The ContainerLayout implementation for this container
             */
            'afterlayout',
            /**
             * @event beforeadd
             * {@link Ext.Component}要加入或要插入到容器之前触发的事件 Fires before any {@link Ext.Component} is added or inserted into the container.
             * A handler can return false to cancel the add.
             * @param {Ext.Container} this
             * @param {Ext.Component} component 要添加的组件 The component being added
             * @param {Number} index 组件将会加入到容器items集合中的那个索引。 The index at which the component will be added to the container's items collection
             */
            'beforeadd',
            /**
             * @event beforeremove
             * 任何从该容器身上移除{@link Ext.Component}之前触发的事件。若句柄返回false则取消移除。 Fires before any {@link Ext.Component} is removed from the container.  A handler can return
             * false to cancel the remove.
             * @param {Ext.Container} this
             * @param {Ext.Component} component 要被移除的组件 The component being removed
             */
            'beforeremove',
            /**
             * @event add
             * @bubbles
             * {@link Ext.Component}加入或插入到容器成功后触发的事件 Fires after any {@link Ext.Component} is added or inserted into the container.
             * @param {Ext.Container} this
             * @param {Ext.Component} component 已添加的组件 The component that was added
             * @param {Number} index 组件加入到容器items集合中的索引。 The index at which the component was added to the container's items collection
             */
            'add',
            /**
             * @event remove
             * @bubbles
             * 任何从该容器身上移除{@link Ext.Component}成功后触发的事件。 Fires after any {@link Ext.Component} is removed from the container.
             * @param {Ext.Container} this
             * @param {Ext.Component} component 被移除的组件对象 The component that was removed
             */
            'remove'
        );
		
		this.enableBubble(['add', 'remove']);

        /**
         * 此容器的组件集合，类型为{@link Ext.util.MixedCollection}。
         * The collection of components in this container as a {@link Ext.util.MixedCollection}
         * @type MixedCollection
         * @property items
         */
        var items = this.items;
        if(items){
            delete this.items;
            if(Ext.isArray(items) && items.length > 0){
                this.add.apply(this, items);
            }else{
                this.add(items);
            }
        }
    },

    // private
    initItems : function(){
        if(!this.items){
            this.items = new Ext.util.MixedCollection(false, this.getComponentId);
            this.getLayout(); // initialize the layout
        }
    },

    // private
    setLayout : function(layout){
        if(this.layout && this.layout != layout){
            this.layout.setContainer(null);
        }
        this.initItems();
        this.layout = layout;
        layout.setContainer(this);
    },

    // private
    render : function(){
        Ext.Container.superclass.render.apply(this, arguments);
        if(this.layout){
            if(typeof this.layout == 'object' && !this.layout.layout){
                this.layoutConfig = this.layout;
                this.layout = this.layoutConfig.type;
            }
            if(typeof this.layout == 'string'){
                this.layout = new Ext.Container.LAYOUTS[this.layout.toLowerCase()](this.layoutConfig);
            }
            this.setLayout(this.layout);

            if(this.activeItem !== undefined){
                var item = this.activeItem;
                delete this.activeItem;
                this.layout.setActiveItem(item);
                return;
            }
        }
        if(!this.ownerCt){
            this.doLayout();
        }
        if(this.monitorResize === true){
            Ext.EventManager.onWindowResize(this.doLayout, this, [false]);
        }
    },

    /**
     * <p>Returns the Element to be used to contain the child Components of this Container.</p>
     * <p>An implementation is provided which returns the Container's {@link #getEl Element}, but
     * if there is a more complex structure to a Container, this may be overridden to return
     * the element into which the {@link #layout layout} renders child Components.</p>
     * @return {Ext.Element} The Element to render child Components into.
     */
    getLayoutTarget : function(){
        return this.el;
    },

    // private - used as the key lookup function for the items collection
    getComponentId : function(comp){
        return comp.itemId || comp.id;
    },

    /**
     * <p>
     * 把{@link Ext.Component 组件}加入到此容器。
     * 在加入之前触发{@link #beforeadd}事件和加入完毕后触发{@link #add}事件。
	 * 如果在容器已渲染后执行add方法（译注，如没渲染，即是属于lazy rending状态，自由地调用add方法是无所谓的），
	 * 你或许需要调用{@link #doLayout}的方法，刷新视图。
	 * 而多个子组件加入到布局，你只需执行一次这个方法。
	 * Adds a {@link Ext.Component Component} to this Container. Fires the {@link #beforeadd} event before
     * adding, then fires the {@link #add} event after the component has been added.</p>
     * <p>
     * You will never call the render method of a child Component when using a Container.
     * Child Components are rendered by this Container's {@link #layout} manager when
     * this Container is first rendered.</p>
     * 
     * <p>
     * Certain layout managers allow dynamic addition of child components. Those that do
     * include {@link Ext.layout.CardLayout}, {@link Ext.layout.AnchorLayout},
     * {@link Ext.layout.FormLayout}, {@link Ext.layout.TableLayout}.</p>
     * 
     * <p>
     * If the Container is already rendered when add is called, you may need to call
     * {@link #doLayout} to refresh the view which causes any unrendered child Components
     * to be rendered. This is required so that you can add multiple child components if needed
     * while only refreshing the layout once.</p>
     * 
     * <p>
     * When creating complex UIs, it is important to remember that sizing and positioning
     * of child items is the responsibility of the Container's {@link #layout} manager. If
     * you expect child items to be sized in response to user interactions, you must
     * specify a layout manager which creates and manages the type of layout you have in mind.</p>
     * 
     * <p><b>
     * Omitting the {@link #layout} config means that a basic layout manager is
     * used which does nothing but render child components sequentially into the Container.
     * No sizing or positioning will be performed in this situation.</b></p>
     * @param {Ext.Component/Object} component 欲加入的组件。The Component to add.<br><br>
     * Ext采用延时渲染（lazy-rendering），加入的组件只有到了需要显示的时候才会被渲染出来。<br><br>
     * 你可传入一个组件的配置对象即是lazy-rendering的做法，这样做的好处是组件不会立即渲染，减低直接构建组件对象带来的开销。<br><br>
	 * 要了解所有可用的xtyps，可参阅{@link Ext.Component}。
	 * 要发挥"lazy instantiation延时初始化"的特性，应对组件所属的登记类型的{@link Ext.Component#xtype}属性进行配置。
     * Ext uses lazy rendering, and will only render the added Component should
     * it become necessary, that is: when the Container is layed out either on first render
     * or in response to a {@link #doLayout} call.<br><br>
     * A Component config object may be passed instead of an instantiated Component object.
     * The type of Component created from a config object is determined by the {@link Ext.Component#xtype xtype}
     * config property. If no xtype is configured, the Container's {@link #defaultType}
     * is used.<br><br>
     * 对于全部可用xtype列表可参阅{@link Ext.Component}。
     * For a list of all available xtypes, see {@link Ext.Component}.
     * @param {Ext.Component/Object} component2
     * @param {Ext.Component/Object} etc
     * @return {Ext.Component} component 包含容器缺省配置值的组件（或配置项对象）。The Component (or config object) that was
     * added with the Container's default config values applied.
     * <p>example:</p><pre><code>
var myNewGrid = new Ext.grid.GridPanel({
    store: myStore,
    colModel: myColModel
});
myTabPanel.add(myNewGrid);
myTabPanel.setActiveTab(myNewGrid);
</code></pre>
     */
    add : function(comp){
        this.initItems();
        var a = arguments, len = a.length;
        if(len > 1){
            for(var i = 0; i < len; i++) {
                Ext.Container.prototype.add.call(this, a[i]);
            }
            return;
        }
        var c = this.lookupComponent(this.applyDefaults(comp));
        var pos = this.items.length;
        if(this.fireEvent('beforeadd', this, c, pos) !== false && this.onBeforeAdd(c) !== false){
            this.items.add(c);
            c.ownerCt = this;
            this.fireEvent('add', this, c, pos);
        }
        return c;
    },

    /**
     * 把插件(Component)插入到容器指定的位置（按索引）。
     * 执行插入之前触发{@link #beforeadd}事件，插入完毕触发{@link #add}事件。
     * Inserts a Component into this Container at a specified index. Fires the
     * {@link #beforeadd} event before inserting, then fires the {@link #add} event after the
     * Component has been inserted.
     * @param {Number} index 组件插入到容器collection集合的索引。The index at which the Component will be inserted
     * into the Container's items collection
     * @param {Ext.Component} component 欲加入的组件。The child Component to insert.<br><br>
     * Ext采用延时渲染（lazy-rendering），加入的组件只有到了需要显示的时候才会被渲染出来。<br><br>
     * 你可传入一个组件的配置对象即是lazy-rendering，这样做的好处是组件不会立即渲染
	 * 减低直接构建组件对象带来的开销。<br><br>
	 * 要了解所有可用的xtyps，可参阅{@link Ext.Component}。
	 * 要发挥“lazy instantiation延时初始化”的特性，应对组件所属的登记类型的{@link Ext.Component#xtype}属性进行配置。
     * Ext uses lazy rendering, and will only render the inserted Component should
     * it become necessary.<br><br>
     * A Component config object may be passed in order to avoid the overhead of
     * constructing a real Component object if lazy rendering might mean that the
     * inserted Component will not be rendered immediately. To take advantage of
     * this "lazy instantiation", set the {@link Ext.Component#xtype} config
     * property to the registered type of the Component wanted.<br><br>
     * For a list of all available xtypes, see {@link Ext.Component}.
     * @return {Ext.Component} component 包含容器缺省配置值的组件（或配置项对象）。The Component (or config object) that was
     * inserted with the Container's default config values applied.
     */
    insert : function(index, comp){
        this.initItems();
        var a = arguments, len = a.length;
        if(len > 2){
            for(var i = len-1; i >= 1; --i) {
                this.insert(index, a[i]);
            }
            return;
        }
        var c = this.lookupComponent(this.applyDefaults(comp));

        if(c.ownerCt == this && this.items.indexOf(c) < index){
            --index;
        }

        if(this.fireEvent('beforeadd', this, c, index) !== false && this.onBeforeAdd(c) !== false){
            this.items.insert(index, c);
            c.ownerCt = this;
            this.fireEvent('add', this, c, index);
        }
        return c;
    },

    // private
    applyDefaults : function(c){
        if(this.defaults){
            if(typeof c == 'string'){
                c = Ext.ComponentMgr.get(c);
                Ext.apply(c, this.defaults);
            }else if(!c.events){
                Ext.applyIf(c, this.defaults);
            }else{
                Ext.apply(c, this.defaults);
            }
        }
        return c;
    },

    // private
    onBeforeAdd : function(item){
        if(item.ownerCt){
            item.ownerCt.remove(item, false);
        }
        if(this.hideBorders === true){
            item.border = (item.border === true);
        }
    },

    /**
     * 从此容器中移除某个组件。执行之前触发{@link #beforeremove}事件，移除完毕后触发{@link #remove}事件。
     * Removes a component from this container.  Fires the {@link #beforeremove} event before removing, then fires
     * the {@link #remove} event after the component has been removed.
     * @param {Component/String} component 组件的引用或其id。The component reference or id to remove.
     * @param {Boolean} autoDestroy （可选的）True表示为自动执行组件{@link Ext.Component#destroy} 的函数。(optional)True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Ext.Component} component 被移除的Component对象。The Component that was removed.
     */
    remove : function(comp, autoDestroy){
        this.initItems();
        var c = this.getComponent(comp);
        if(c && this.fireEvent('beforeremove', this, c) !== false){
            this.items.remove(c);
            delete c.ownerCt;
            if(autoDestroy === true || (autoDestroy !== false && this.autoDestroy)){
                c.destroy();
            }
            if(this.layout && this.layout.activeItem == c){
                delete this.layout.activeItem;
            }
            this.fireEvent('remove', this, c);
        }
        return c;
    },
    
    /**
     * 从此容器中移除某个组件。
     * Removes all components from this container.
     * @param {Boolean} autoDestroy （可选的） True表示为自动执行组件{@link Ext.Component#destroy} 的函数。(optional) True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Array} 被销毁的组件数组。Array of the destroyed components
     */
    removeAll: function(autoDestroy){
        this.initItems();
        var item, items = [];
        while((item = this.items.last())){
            items.unshift(this.remove(item, autoDestroy));
        }
        return items;
    },

    /**
     * 由id或索引直接返回容器的子组件。
     * Gets a direct child Component by id, or by index.
     * @param {String/Number} comp 子组件的id或index。 id or index of child Component to return.
     * @return Ext.Component
     */
    getComponent : function(comp){
        if(typeof comp == 'object'){
            return comp;
        }
        return this.items.get(comp);
    },

    // private
    lookupComponent : function(comp){
        if(typeof comp == 'string'){
            return Ext.ComponentMgr.get(comp);
        }else if(!comp.events){
            return this.createComponent(comp);
        }
        return comp;
    },

    // private
    createComponent : function(config){
        return Ext.create(config, this.defaultType);
    },

    /**
     * 重新计算容器的布局尺寸。当有新组件加入到已渲染容器或改变子组件的大小/位置之后，就需要执行此函数。
     * Force this container's layout to be recalculated. A call to this function is required after adding a new component
     * to an already rendered container, or possibly after changing sizing/position properties of child components.
     * @param {Boolean} shallow （可选的）True表示只是计算该组件的布局，而子组件则有需要才自动计算（默认为false每个子容器就调用doLayout）。
     * (optional) True to only calc the layout of this component, and let child components auto
     * calc layouts as required (defaults to false, which calls doLayout recursively for each subcontainer)
     * @return {Ext.Container} this
     */
    doLayout : function(shallow){
        if(this.rendered && this.layout){
            this.layout.layout();
        }
        if(shallow !== false && this.items){
            var cs = this.items.items;
            for(var i = 0, len = cs.length; i < len; i++) {
                var c  = cs[i];
                if(c.doLayout){
                    c.doLayout();
                }
            }
        }
        return this;
    },

    /**
     * 返回容器在使用的布局。如没设置，会创建默认的{@link Ext.layout.ContainerLayout}作为容器的布局。
     * Returns the layout currently in use by the container.  If the container does not currently have a layout
     * set, a default {@link Ext.layout.ContainerLayout} will be created and set as the container's layout.
     * @return {ContainerLayout} layout 容器的布局。The container's layout
     */
    getLayout : function(){
        if(!this.layout){
            var layout = new Ext.layout.ContainerLayout(this.layoutConfig);
            this.setLayout(layout);
        }
        return this.layout;
    },

    // private
    beforeDestroy : function(){
        if(this.items){
            Ext.destroy.apply(Ext, this.items.items);
        }
        if(this.monitorResize){
            Ext.EventManager.removeResizeListener(this.doLayout, this);
        }
        if (this.layout && this.layout.destroy) {
            this.layout.destroy();
        }
        Ext.Container.superclass.beforeDestroy.call(this);
    },

    /**
     * 逐层上报（Bubbles up）组件/容器，上报过程中对组件执行指定的函数。
     * 函数的作用域（<i>this</i>）既可是参数传入或是当前组件(默认)函数的参数可经由args指定或当前组件提供，
     * 如果函数在某一个层次上返回false，上升将会停止。
     * Bubbles up the component/container heirarchy, calling the specified function with each component. The scope (<i>this</i>) of
     * function call will be the scope provided or the current component. The arguments to the function
     * will be the args provided or the current component. If the function returns false at any point,
     * the bubble is stopped.
     * @param {Function} fn 调用的函数。The function to call
     * @param {Object} scope （可选的）函数的作用域（默认当前的点）。(optional)The scope of the function (defaults to current node)
     * @param {Array} args （可选的）函数将会传入的参数（默认为当前组件）。(optional) The args to call the function with (default to passing the current component)
     * @return {Ext.Container} this
     */
    bubble : function(fn, scope, args){
        var p = this;
        while(p){
            if(fn.apply(scope || p, args || [p]) === false){
                break;
            }
            p = p.ownerCt;
        }
        return this;
    },

    /**
     * 逐层下报（Cascades down）组件/容器（从它开始），下报过程中对组件执行指定的函数。
     * 函数的作用域（<i>this</i>）既可是参数传入或是当前组件（默认）函数的参数可经由args指定或当前组件提供，
     * 如果函数在某一个层次上返回false，下降将会停止。
     * Cascades down the component/container heirarchy from this component (called first), calling the specified function with
     * each component. The scope (<i>this</i>) of
     * function call will be the scope provided or the current component. The arguments to the function
     * will be the args provided or the current component. If the function returns false at any point,
     * the cascade is stopped on that branch.
     * @param {Function} fn 调用的函数。The function to call
     * @param {Object} scope （可选的）函数的作用域（默认当前的点）。(optional)The scope of the function (defaults to current node)
     * @param {Array} args （可选的）函数将会传入的参数（默认为当前组件）。(optional) The args to call the function with (default to passing the current component)
     * @return {Ext.Container} this
     */
    cascade : function(fn, scope, args){
        if(fn.apply(scope || this, args || [this]) !== false){
            if(this.items){
                var cs = this.items.items;
                for(var i = 0, len = cs.length; i < len; i++){
                    if(cs[i].cascade){
                        cs[i].cascade(fn, scope, args);
                    }else{
                        fn.apply(scope || cs[i], args || [cs[i]]);
                    }
                }
            }
        }
        return this;
    },

    /**
     * 在此容器之下由id查找任意层次的组件。
     * Find a component under this container at any level by id
     * @param {String} id
     * @return Ext.Component
     */
    findById : function(id){
        var m, ct = this;
        this.cascade(function(c){
            if(ct != c && c.id === id){
                m = c;
                return false;
            }
        });
        return m || null;
    },

    /**
     * 根据xtype或class查找该容器下任意层次中某个组件。
     * Find a component under this container at any level by xtype or class
     * @param {String/Class} xtype 组件的xtype字符串，或直接就是组件的类本身。
     * The xtype string for a component, or the class of the component directly
     * @param {Boolean} shallow （可选的）False表示xtype可兼容组件的父类（这里缺省的），或true就表示xtype压根就是这个组件，没有继承上的泛指。
     * (optional) False to check whether this Component is descended from the xtype (this is
     * the default), or true to check whether this Component is directly of the specified xtype.
     * @return {Array} Ext.Components数组。Array of Ext.Components
     */
    findByType : function(xtype, shallow){
        return this.findBy(function(c){
            return c.isXType(xtype, shallow);
        });
    },

    /**
     * 在此容器之下由属性作搜索依据查找组件。
     * Find a component under this container at any level by property
     * @param {String} prop
     * @param {String} value
     * @return {Array} Array of Ext.Components 数组
     */
    find : function(prop, value){
        return this.findBy(function(c){
            return c[prop] === value;
        });
    },

    /**
     * 在此容器之下由自定义的函数作搜索依据查找组件。
     * 如函数返回true返回组件的结果。传入的函数会有(component, this container)的参数。
     * Find a component under this container at any level by a custom function. If the passed function returns
     * true, the component will be included in the results. The passed function is called with the arguments (component, this container).
     * @param {Function} fcn
     * @param {Object} scope (optional)（可选的）
     * @return {Array}  Ext.Component数组。Array of Ext.Components
     */
    findBy : function(fn, scope){
        var m = [], ct = this;
        this.cascade(function(c){
            if(ct != c && fn.call(scope || c, c, ct) === true){
                m.push(c);
            }
        });
        return m;
    },

    /**
     *返回该容器下辖的某个组件（是items.get(key)的简写方式）。
     * Get a component contained by this container (alias for items.get(key))
     * @param {String/Number} key 组件的索引或id。The index or id of the component
     * @return {Ext.Component} Ext.Component
     */
    get : function(key){
        return this.items.get(key);
    }
});

Ext.Container.LAYOUTS = {};
Ext.reg('container', Ext.Container);