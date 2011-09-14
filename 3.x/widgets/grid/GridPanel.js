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
 * @class Ext.grid.GridPanel
 * @extends Ext.Panel
 * <p>此类系基于Grid控件的一个面板组件，呈现了Grid的主要交互接口。<br />
 * This class represents the primary interface of a component based grid control to represent data
 * in a tabular format of rows and columns. The GridPanel is composed of the following:</p>
 * <div class="mdetail-params"><ul>
 * <li><b>{@link Ext.data.Store Store}</b> :数据记录的模型（行为单位 ） The Model holding the data records (rows)
 * <div class="sub-desc"></div></li>
 * <li><b>{@link Ext.grid.ColumnModel Column model}</b> : 列怎么显示 Column makeup
 * <div class="sub-desc"></div></li>
 * <li><b>{@link Ext.grid.GridView View}</b> : 封装了用户界面 Encapsulates the user interface 
 * <div class="sub-desc"></div></li>
 * <li><b>{@link Ext.grid.AbstractSelectionModel selection model}</b> : 选择行为的模型 Selection behavior 
 * <div class="sub-desc"></div></li>
 * </ul></div>
 * <br><br>用法 Usage:
 * <pre><code>var grid = new Ext.grid.GridPanel({
    store: new Ext.data.Store({
        reader: reader,
        data: xg.dummyData
    }),
    columns: [
        {id:'company', header: "Company", width: 200, sortable: true, dataIndex: 'company'},
        {header: "Price", width: 120, sortable: true, renderer: Ext.util.Format.usMoney, dataIndex: 'price'},
        {header: "Change", width: 120, sortable: true, dataIndex: 'change'},
        {header: "% Change", width: 120, sortable: true, dataIndex: 'pctChange'},
        {header: "Last Updated", width: 135, sortable: true, renderer: Ext.util.Format.dateRenderer('m/d/Y'), dataIndex: 'lastChange'}
    ],
    viewConfig: {
        forceFit: true,

//      Return CSS class to apply to rows depending upon data values
        getRowClass: function(record, index) {
            var c = record.get('change');
            if (c < 0) {
                return 'price-fall';
            } else if (c > 0) {
                return 'price-rise';
            }
        }
    },
    sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
    width:600,
    height:300,
    frame:true,
    title:'Framed with Checkbox Selection and Horizontal Scrolling',
    iconCls:'icon-grid'
});</code></pre>
 * <b>注意 Notes:</b><ul>
 * <li>
 * 尽管本类是由Panel类继承而得到的，但是不支持其基类的某些功能，不能都做到好像一般Panel类那样的方法，如autoScroll、autoWidth、layout、items等……
 * Although this class inherits many configuration options from base classes, some of them
 * (such as autoScroll, autoWidth,layout, items, etc) are not used by this class, and will have no effect.</li>
 * 
 * <li>
 * Grid<b>需要</b>一个宽度来显示其所有的列，也需要一个高度来滚动列出所有的行。这些尺寸都通过配置项<tt>{@link Ext.BoxComponent#height height}</tt>
 * 和<tt>{@link Ext.BoxComponent#width width}</tt>来精确地指定，
 * 又或者将Grid放置进入一个带有{@link Ext.Container#layout 某种布局风格}的{@link Ext.Container 容器}中去，让上层容器来管理子容器的尺寸大小。
 * 例如指定{@link Ext.Container#layout layout}为“fit”的布局就可以很好地自适应容器的拉伸了。 
 * 
 * A grid <b>requires</b> a width in which to scroll its columns, and a height in which to
 * scroll its rows. These dimensions can either be set explicitly through the
 * <tt>{@link Ext.BoxComponent#height height}</tt> and <tt>{@link Ext.BoxComponent#width width}</tt>
 * configuration options or implicitly set by using the grid as a child item of a
 * {@link Ext.Container Container} which will have a {@link Ext.Container#layout layout manager}
 * provide the sizing of its child items (for example the Container of the Grid may specify
 * <tt>{@link Ext.Container#layout layout}:'fit'</tt>).</li>
 * 
 * 
 * <li>要访问GRID中的数据，就必须通过由{@link #store Store}封装的数据模型。参与{@link #cellclick}事件。
 * To access the data in a Grid, it is necessary to use the data model encapsulated
 * by the {@link #store Store}. See the {@link #cellclick} event.</li>
 * </ul>
 * @constructor
 * @param {Object} config 配置项对象 The config object
 */
Ext.grid.GridPanel = Ext.extend(Ext.Panel, {
    /**
     * @cfg {Ext.data.Store} store Grid应使用{@link Ext.data.Store}作为其数据源（必须的）。
	 * The {@link Ext.data.Store} the grid should use as its data source (required).
     */
    /**
     * @cfg {Object} cm {@link #colModel}的简写方式。
     * Shorthand for {@link #colModel}.
     */
    /**
     * @cfg {Object} colModel 渲染Grid所使用的{@link Ext.grid.ColumnModel}（必须的）。
     * The {@link Ext.grid.ColumnModel} to use when rendering the grid (required).
     */
    /**
     * @cfg {Object} sm {@link #selModel}的简写方式。
     * Shorthand for {@link #selModel}.
     */
    /**
     * @cfg {Object} selModel AbstractSelectionModel的子类，以为Grid提供选区模型（selection model）。
     * （如不指定则默认为{@link Ext.grid.RowSelectionModel}）。
	 * Any subclass of {@link Ext.grid.AbstractSelectionModel} that will provide
     * the selection model for the grid (defaults to {@link Ext.grid.RowSelectionModel} if not specified).
     */
    /**
     * @cfg {Array} columns 自动创建列模型（ColumnModel）的数组。
     * An array of columns to auto create a ColumnModel
     */
    /**
    * @cfg {Number} maxHeight 设置Grid的高度最大值（若autoHeight关闭则忽略）。
    * Sets the maximum height of the grid - ignored if autoHeight is not on.
    */
    /**
     * @cfg {Boolean} disableSelection True表示为禁止grid的选区功能（默认为false）——若指定了SelectionModel则忽略。 
	 * True to disable selections in the grid (defaults to false). - ignored if a SelectionModel is specified 
     */
    /**
     * @cfg {Boolean} enableColumnMove False表示为在列拖动时禁止排序（默认为true）。
     * False to turn off column reordering via drag drop (defaults to true).
     */
    /**
     * @cfg {Boolean} enableColumnResize False 表示为关闭列的大小调节功能（默认为true）。
     * False to turn off column resizing for the whole grid (defaults to true).
     */
    /**
     * @cfg {Object} viewConfig 作用在grid's UI试图上的配置项对象，
     * 任何{@link Ext.grid.GridView}可用的配置选项都可在这里指定。若{@link #view}已指定则此项无效。
	 * A config object that will be applied to the grid's UI view.  Any of
     * the config options available for {@link Ext.grid.GridView} can be specified here. This option
     * is ignored if {@link #view} is xpecified.
     */
    /**
     * @cfg {Boolean} hideHeaders True表示为隐藏Grid的头部（默认为false）。
     * True to hide the grid's header (defaults to false).
     */

    /**
     * 配置拖动代理中的文本（缺省为"{0} selected row(s)"）。选中行的行数会替换到{0}。
	 * Configures the text in the drag proxy (defaults to "{0} selected row(s)").
     * {0} is replaced with the number of selected rows.
     * @type String
     */
    ddText : "{0} selected row{1}",
    /**
     * @cfg {Number} minColumnWidth 列的宽度的调整下限。默认为25。
     * The minimum width a column can be resized to. Defaults to 25.
     */
    minColumnWidth : 25,
    /**
     * @cfg {Boolean} trackMouseOver True表示为鼠标移动时高亮显示（默认为true）。
     * True to highlight rows when the mouse is over. Default is true.
     */
    trackMouseOver : true,
    /**
     * @cfg {Boolean} enableDragDrop <p>True表示为激活GridPanel行的拖动。
     * True to enable dragging of the selected rows of the GridPanel.</p>
     * <p>
     * 设置该项为<b><tt>true</tt></b>那样{GridPanel@link #getView GridView}的将会创建一个{@link Ext.grid.GridDragZone}实例。
     * 通过GridView的{@link Ext.grid.GridView#dragZone dragZone}属性可访问该实例（只在Grid渲染后的条件后）。
     * Setting this to <b><tt>true</tt></b> causes this GridPanel's {@link #getView GridView} to create an instance of 
     * {@link Ext.grid.GridDragZone}. This is available <b>(only after the Grid has been rendered)</b> as the
     * GridView's {@link Ext.grid.GridView#dragZone dragZone} property.
     * </p>
     * <p>
     * 要让{@link Ext.dd.DropZone DropZone}运作起来必须一定要有{@link Ext.dd.DropZone#onNodeEnter onNodeEnter}、{@link Ext.dd.DropZone#onNodeOver onNodeOver},
     * {@link Ext.dd.DropZone#onNodeOut onNodeOut}以及{@link Ext.dd.DropZone#onNodeDrop onNodeDrop}这些实现的定义，好让能够处理{@link Ext.grid.GridDragZone#getDragData data}。
     * A cooperating {@link Ext.dd.DropZone DropZone} must be created who's implementations of
     * {@link Ext.dd.DropZone#onNodeEnter onNodeEnter}, {@link Ext.dd.DropZone#onNodeOver onNodeOver},
     * {@link Ext.dd.DropZone#onNodeOut onNodeOut} and {@link Ext.dd.DropZone#onNodeDrop onNodeDrop} are able
     * to process the {@link Ext.grid.GridDragZone#getDragData data} which is provided. </p>
     */
    enableDragDrop : false,
    /**
     * @cfg {Boolean} enableColumnMove True表示为激活列的拖动（默认为true）。
     * True to enable drag and drop reorder of columns.
     */
    enableColumnMove : true,
    /**
     * @cfg {Boolean} enableColumnHide True表示为隐藏每列头部的邮件菜单（默认为true）。
     * True to enable hiding of columns with the header context menu.
     */
    enableColumnHide : true,
    /**
     * @cfg {Boolean} enableHdMenu True表示为在头部出现下拉按钮，以激活头部菜单。
     * True to enable the drop down button for menu in the headers.
     */
    enableHdMenu : true,
    /**
     * @cfg {Boolean} stripeRows True表示为显示行的分隔符（默认为true）。
     * True to stripe the rows. Default is false.
     * <p>为Grid的隔行之处都会加上<tt><b>x-grid3-row-alt</b></tt>样式。
     * 原理是利用加入背景色的CSS规则来实现，但你可以用有修饰符"!important"的<b>background-color</b>样式覆盖这个规则，或使用较高优先级的CSS选择符。
     * This causes the CSS class <tt><b>x-grid3-row-alt</b></tt> to be added to alternate rows of
     * the grid. A default CSS rule is provided which sets a background colour, but you can override this
     * with a rule which either overrides the <b>background-color</b> style using the "!important"
     * modifier, or which uses a CSS selector of higher specificity.
     * </p>
     */
    stripeRows : false,
    /**
     * @cfg {String} autoExpandColumn 指定某个列之id,grid就会在这一列自动扩展宽度，以填满空白的位置，该id不能为0。
	 * The id of a column in this grid that should expand to fill unused space. This id can not be 0.
     */
    autoExpandColumn : false,
    /**
    * @cfg {Number} autoExpandMin autoExpandColumn可允许最小之宽度（有激活的话）。默认为50。
    * The minimum width the autoExpandColumn can have (if enabled).
    * defaults to 50.
    */
    autoExpandMin : 50,
    /**
    * @cfg {Number} autoExpandMax autoExpandColumn可允许最大之宽度（有激活的话）。默认为 1000。
	* The maximum width the autoExpandColumn can have (if enabled). Defaults to 1000.
    */
    autoExpandMax : 1000,
    /**
     * @cfg {Object} view Grid所使用的{@link Ext.grid.GridView}。该项可在render()调用之前设置。
	 * The {@link Ext.grid.GridView} used by the grid. This can be set before a call to render().
     */
    view : null,
    /**
     * @cfg {Object} loadMask True表示为当grid加载过程中，会有一个{@link Ext.LoadMask}的遮罩效果。默认为false。
	 * An {@link Ext.LoadMask} config or true to mask the grid while loading (defaults to false).
     */
    loadMask : false,

    /**
     * @cfg {Boolean} columnLines True表示为在列分隔处显示分隔符。默认为false。
     * True to add css for column separation lines. Default is false.
     */
    columnLines : false,

    /**
     * @cfg {Boolean} deferRowRender True表示为延时激活行渲染。默认为true。
     * True to enable deferred row rendering. Default is true.
     */
    deferRowRender : true,

    // private
    rendered : false,
    // private
    viewReady: false,
    /**
     * @cfg {Array} stateEvents
     * 事件名称组成的数组。这些事件触发时会导致该组件进行状态记忆（默认为["columnmove", "columnresize", "sortchange"]）。
     * 可支持该组件身上的任意事件类型，包括浏览器原生的或自定义的，如['click', 'customerchange']。
     * An array of events that, when fired, should trigger this component to save its state (defaults to ["columnmove", "columnresize", "sortchange"]).
     * These can be any types of events supported by this component, including browser or custom events (e.g.,['click', 'customerchange']).
     * <p>请参阅{@link #stateful}有关Component状态的恢复与保存方面的解释。See {@link #stateful} for an explanation of saving and restoring Component state.</p>
     */
    stateEvents: ["columnmove", "columnresize", "sortchange"],

    // private
    initComponent : function(){
        Ext.grid.GridPanel.superclass.initComponent.call(this);

        if(this.columnLines){
            this.cls = (this.cls || '') + ' x-grid-with-col-lines';
        }
        // override any provided value since it isn't valid
        // and is causing too many bug reports ;)
        this.autoScroll = false;
        this.autoWidth = false;

        if(Ext.isArray(this.columns)){
            this.colModel = new Ext.grid.ColumnModel(this.columns);
            delete this.columns;
        }

        // check and correct shorthanded configs
        if(this.ds){
            this.store = this.ds;
            delete this.ds;
        }
        if(this.cm){
            this.colModel = this.cm;
            delete this.cm;
        }
        if(this.sm){
            this.selModel = this.sm;
            delete this.sm;
        }
        this.store = Ext.StoreMgr.lookup(this.store);

        this.addEvents(
            // raw events
            /**
             * @event click
             * 整个Grid被单击的原始事件。
             * The raw click event for the entire grid.
             * @param {Ext.EventObject} e
             */
            "click",
            /**
             * @event dblclick
             * 整个Grid被双击的原始事件。
             * The raw dblclick event for the entire grid.
             * @param {Ext.EventObject} e
             */
            "dblclick",
            /**
             * @event contextmenu
             * 整个Grid被右击的原始事件。
             * The raw contextmenu event for the entire grid.
             * @param {Ext.EventObject} e
             */
            "contextmenu",
            /**
             * @event mousedown
             * 整个Grid的mousedown的原始事件。
             * The raw mousedown event for the entire grid.
             * @param {Ext.EventObject} e
             */
            "mousedown",
            /**
             * @event mouseup
             * 整个Grid的mouseup的原始事件。
             * The raw mouseup event for the entire grid.
             * @param {Ext.EventObject} e
             */
            "mouseup",
            /**
             * @event mouseover
             * 整个Grid的mouseover的原始事件。
             * The raw mouseover event for the entire grid.
             * @param {Ext.EventObject} e
             */
            "mouseover",
            /**
             * @event mouseout
             * 整个Grid的mouseout的原始事件。
             * The raw mouseout event for the entire grid.
             * @param {Ext.EventObject} e
             */
            "mouseout",
            /**
             * @event keypress
             * 整个Grid的keypress的原始事件。
             * The raw keypress event for the entire grid.
             * @param {Ext.EventObject} e
             */
            "keypress",
            /**
             * @event keydown
             * 整个Grid的keydown的原始事件。
             * The raw keydown event for the entire grid.
             * @param {Ext.EventObject} e
             */
            "keydown",

            // custom events
            /**
             * @event cellmousedown
             * 当单元格被单击之前触发。
             * Fires before a cell is clicked
             * @param {Grid} this
             * @param {Number} rowIndex
             * @param {Number} columnIndex
             * @param {Ext.EventObject} e
             */
            "cellmousedown",
            /**
             * @event rowmousedown
             * 当行被单击之前触发。
             * Fires before a row is clicked
             * @param {Grid} this
             * @param {Number} rowIndex
             * @param {Ext.EventObject} e
             */
            "rowmousedown",
            /**
             * @event headermousedown
             * 当头部被单击之前触发。
             * Fires before a header is clicked
             * @param {Grid} this
             * @param {Number} columnIndex
             * @param {Ext.EventObject} e
             */
            "headermousedown",

            /**
             * @event cellclick
             * 当单元格被点击时触发。
             * 单击格的数据保存在{@link Ext.data.Record Record}。要在侦听器函数内访问数据，可按照以下的办法：
             * Fires when a cell is clicked.
			 * The data for the cell is drawn from the {@link Ext.data.Record Record}
             * for this row. To access the data in the listener function use the
             * following technique:
             * <pre><code>
function(grid, rowIndex, columnIndex, e) {
    var record = grid.getStore().getAt(rowIndex);  // 返回Record对象 Get the Record
    var fieldName = grid.getColumnModel().getDataIndex(columnIndex); // 返回字段名称 Get field name
    var data = record.get(fieldName);
}
</code></pre>
             * @param {Grid} this
             * @param {Number} rowIndex 行索引。rowIndex
             * @param {Number} columnIndex 列索引。columnIndex
             * @param {Ext.EventObject} e
             */
            "cellclick",
            /**
             * @event celldblclick
             * 单元格（cell）被双击时触发。
             * Fires when a cell is double clicked
             * @param {Grid} this
             * @param {Number} rowIndex 行索引。rowIndex
             * @param {Number} columnIndex 列索引。columnIndex
             * @param {Ext.EventObject} e
             */
            "celldblclick",
            /**
             * @event rowclick
             * 行（row）被单击时触发。
             * Fires when a row is clicked
             * @param {Grid} this
             * @param {Number} rowIndex 行索引。rowIndex
             * @param {Ext.EventObject} e
             */
            "rowclick",
            /**
             * @event rowdblclick
             * 行（row）被双击时触发。
             * Fires when a row is double clicked
             * @param {Grid} this
             * @param {Number} rowIndex 行索引。rowIndex
             * @param {Ext.EventObject} e
             */
            "rowdblclick",
            /**
             * @event headerclick
             * 头部（header）被单击时触发。
             * Fires when a header is clicked
             * @param {Grid} this
             * @param {Number} columnIndex 列索引。columnIndex
             * @param {Ext.EventObject} e
             */
            "headerclick",
            /**
             * @event headerdblclick
             * 头部（header）被双击时触发。
             * Fires when a header cell is double clicked
             * @param {Grid} this
             * @param {Number} columnIndex 列索引。columnIndex
             * @param {Ext.EventObject} e
             */
            "headerdblclick",
            /**
             * @event rowcontextmenu
             * 行（row）被右击时触发。
             * Fires when a row is right clicked
             * @param {Grid} this
             * @param {Number} rowIndex 行索引。rowIndex
             * @param {Ext.EventObject} e
             */
            "rowcontextmenu",
            /**
             * @event cellcontextmenu
             * 单元格（cell）被右击时触发。
             * Fires when a cell is right clicked
             * @param {Grid} this
             * @param {Number} rowIndex 行索引。rowIndex
             * @param {Number} cellIndex 单元格索引。cellIndex
             * @param {Ext.EventObject} e
             */
            "cellcontextmenu",
            /**
             * @event headercontextmenu
             * 头部（header）被右击时触发。
             * Fires when a header is right clicked
             * @param {Grid} this
             * @param {Number} columnIndex
             * @param {Ext.EventObject} e
             */
            "headercontextmenu",
            /**
             * @event bodyscroll
             * 当body元素被滚动后触发。
             * Fires when the body element is scrolled
             * @param {Number} scrollLeft
             * @param {Number} scrollTop
             */
            "bodyscroll",
            /**
             * @event columnresize
             * 当用户调整某个列（column）大小时触发。
             * Fires when the user resizes a column
             * @param {Number} columnIndex
             * @param {Number} newSize
             */
            "columnresize",
            /**
             * @event columnmove
             * 当用户移动某个列（column）时触发。
             * Fires when the user moves a column
             * @param {Number} oldIndex
             * @param {Number} newIndex
             */
            "columnmove",
            /**
             * @event sortchange
             * 当行（row）开始被拖动时触发。
             * Fires when the grid's store sort changes
             * @param {Grid} this
             * @param {Object} sortInfo 包含键字段和方向的对象。An object with the keys field and direction
             */
            "sortchange"
        );
    },

    // private
    onRender : function(ct, position){
        Ext.grid.GridPanel.superclass.onRender.apply(this, arguments);

        var c = this.body;

        this.el.addClass('x-grid-panel');

        var view = this.getView();
        view.init(this);

		this.mon(c, {
			mousedown: this.onMouseDown,
			click: this.onClick,
			dblclick: this.onDblClick,
			contextmenu: this.onContextMenu,
			keydown: this.onKeyDown,
			scope: this
		})

        this.relayEvents(c, ["mousedown","mouseup","mouseover","mouseout","keypress"]);

        this.getSelectionModel().init(this);
        this.view.render();
    },

    // private
    initEvents : function(){
        Ext.grid.GridPanel.superclass.initEvents.call(this);

        if(this.loadMask){
            this.loadMask = new Ext.LoadMask(this.bwrap,
                    Ext.apply({store:this.store}, this.loadMask));
        }
    },

    initStateEvents : function(){
        Ext.grid.GridPanel.superclass.initStateEvents.call(this);
        this.mon(this.colModel, 'hiddenchange', this.saveState, this, {delay: 100});
    },

    applyState : function(state){
        var cm = this.colModel;
        var cs = state.columns;
        if(cs){
            for(var i = 0, len = cs.length; i < len; i++){
                var s = cs[i];
                var c = cm.getColumnById(s.id);
                if(c){
                    c.hidden = s.hidden;
                    c.width = s.width;
                    var oldIndex = cm.getIndexById(s.id);
                    if(oldIndex != i){
                        cm.moveColumn(oldIndex, i);
                    }
                }
            }
        }
        if(state.sort && this.store){
            this.store[this.store.remoteSort ? 'setDefaultSort' : 'sort'](state.sort.field, state.sort.direction);
        }
    },

    getState : function(){
        var o = {columns: []};
        for(var i = 0, c; c = this.colModel.config[i]; i++){
            o.columns[i] = {
                id: c.id,
                width: c.width
            };
            if(c.hidden){
                o.columns[i].hidden = true;
            }
        }
        if(this.store){
            var ss = this.store.getSortState();
            if(ss){
                o.sort = ss;
            }
        }
        return o;
    },

    // private
    afterRender : function(){
        Ext.grid.GridPanel.superclass.afterRender.call(this);
        this.view.layout();
        if(this.deferRowRender){
            this.view.afterRender.defer(10, this.view);
        }else{
            this.view.afterRender();
        }
        this.viewReady = true;
    },

    /**
     * <p>重新配置Grid的Store和Column Model（列模型）。视图会重新绑定对象并刷新。
	 * Reconfigures the grid to use a different Store and Column Model.
     * The View will be bound to the new objects and refreshed.</p>
     * <p>
     * 要注意当重新配置这个GridPanel之后，某些现有的设置<i>可能会</i>变为无效。
     * 比如配置项{@link #autoExpandColumn}的设置在新的ColumnModel作用后就不复存在；
     * 再譬如，{@link Ext.PagingToolbar PagingToolbar}还是旧Store的，需要重新绑定之；
     * 某些{@link #plugins}需要在新数据的配合下再配置配置。
     * Be aware that upon reconfiguring a GridPanel, certain existing settings <i>may</i> become
     * invalidated. For example the configured {@link #autoExpandColumn} may no longer exist in the
     * new ColumnModel. Also, an existing {@link Ext.PagingToolbar PagingToolbar} will still be bound
     * to the old Store, and will need rebinding. Any {@link #plugins} might also need reconfiguring
     * with the new data.</p>
     * @param {Ext.data.Store} store 另外一个{@link Ext.data.Store}对象。The new {@link Ext.data.Store} object
     * @param {Ext.grid.ColumnModel} colModel 另外一个{@link Ext.grid.ColumnModel}对象。The new {@link Ext.grid.ColumnModel} object
     */
    reconfigure : function(store, colModel){
        if(this.loadMask){
            this.loadMask.destroy();
            this.loadMask = new Ext.LoadMask(this.bwrap,
                    Ext.apply({store:store}, this.initialConfig.loadMask));
        }
        this.view.bind(store, colModel);
        this.store = store;
        this.colModel = colModel;
        if(this.rendered){
            this.view.refresh(true);
        }
    },

    // private
    onKeyDown : function(e){
        this.fireEvent("keydown", e);
    },

    // private
    onDestroy : function(){
        if(this.rendered){
            if(this.loadMask){
                this.loadMask.destroy();
            }
            var c = this.body;
            c.removeAllListeners();
            this.view.destroy();
            c.update("");
        }
        this.colModel.purgeListeners();
        Ext.grid.GridPanel.superclass.onDestroy.call(this);
    },

    // private
    processEvent : function(name, e){
        this.fireEvent(name, e);
        var t = e.getTarget();
        var v = this.view;
        var header = v.findHeaderIndex(t);
        if(header !== false){
            this.fireEvent("header" + name, this, header, e);
        }else{
            var row = v.findRowIndex(t);
            var cell = v.findCellIndex(t);
            if(row !== false){
                this.fireEvent("row" + name, this, row, e);
                if(cell !== false){
                    this.fireEvent("cell" + name, this, row, cell, e);
                }
            }
        }
    },

    // private
    onClick : function(e){
        this.processEvent("click", e);
    },

    // private
    onMouseDown : function(e){
        this.processEvent("mousedown", e);
    },

    // private
    onContextMenu : function(e, t){
        this.processEvent("contextmenu", e);
    },

    // private
    onDblClick : function(e){
        this.processEvent("dblclick", e);
    },

    // private
    walkCells : function(row, col, step, fn, scope){
        var cm = this.colModel, clen = cm.getColumnCount();
        var ds = this.store, rlen = ds.getCount(), first = true;
        if(step < 0){
            if(col < 0){
                row--;
                first = false;
            }
            while(row >= 0){
                if(!first){
                    col = clen-1;
                }
                first = false;
                while(col >= 0){
                    if(fn.call(scope || this, row, col, cm) === true){
                        return [row, col];
                    }
                    col--;
                }
                row--;
            }
        } else {
            if(col >= clen){
                row++;
                first = false;
            }
            while(row < rlen){
                if(!first){
                    col = 0;
                }
                first = false;
                while(col < clen){
                    if(fn.call(scope || this, row, col, cm) === true){
                        return [row, col];
                    }
                    col++;
                }
                row++;
            }
        }
        return null;
    },

    // private
    getSelections : function(){
        return this.selModel.getSelections();
    },

    // private
    onResize : function(){
        Ext.grid.GridPanel.superclass.onResize.apply(this, arguments);
        if(this.viewReady){
            this.view.layout();
        }
    },

    /**
     * 返回Grid的元素。
     * Returns the grid's underlying element.
     * @return {Element} 元素。The element
     */
    getGridEl : function(){
        return this.body;
    },

    // private for compatibility, overridden by editor grid
    stopEditing : Ext.emptyFn,

    /**
     * 返回grid的SelectionModel。
     * Returns the grid's SelectionModel.
     * @return 其实就是配置项的(@link #selModel}选区模型。它是{Ext.grid.AbstractSelectionModel}的子类，提供了单元格或行的选区。
     * The selection model configured by the (@link #selModel} configuration option. This will be a subclass of {Ext.grid.AbstractSelectionModel}
     * which provides either cell or row selectability.
     */
    getSelectionModel : function(){
        if(!this.selModel){
            this.selModel = new Ext.grid.RowSelectionModel(
                    this.disableSelection ? {selectRow: Ext.emptyFn} : null);
        }
        return this.selModel;
    },

    /**
     * 返回Grid的Data store。
     * Returns the grid's data store.
     * @return Store对象。The store
     */
    getStore : function(){
        return this.store;
    },

    /**
     * 返回Grid的列模型（ColumnModel）。
     * Returns the grid's ColumnModel.
     * @return {Ext.grid.ColumnModel} 列模型。The column model
     */
    getColumnModel : function(){
        return this.colModel;
    },

    /**
     * 返回Grid的GridView对象。
     * Returns the grid's GridView object.
     * @return {Ext.grid.GridView} GridView对象。The grid view
     */
    getView : function(){
        if(!this.view){
            this.view = new Ext.grid.GridView(this.viewConfig);
        }
        return this.view;
    },
    /**
     * 获取GRID拖动的代理文本（drag proxy text），默认返回this.ddText。
     * Called to get grid's drag proxy text, by default returns this.ddText.
     * @return {String} GRID拖动的代理文本。The text
     */
    getDragDropText : function(){
        var count = this.selModel.getCount();
        return String.format(this.ddText, count, count == 1 ? '' : 's');
    }

    /** 
     * @cfg {String/Number} activeItem 
     * @hide 
     */
    /** 
     * @cfg {Boolean} autoDestroy 
     * @hide 
     */
    /** 
     * @cfg {Object/String/Function} autoLoad 
     * @hide 
     */
    /** 
     * @cfg {Boolean} autoWidth 
     * @hide 
     */
    /** 
     * @cfg {Boolean/Number} bufferResize 
     * @hide 
     */
    /** 
     * @cfg {String} defaultType 
     * @hide 
     */
    /** 
     * @cfg {Object} defaults 
     * @hide 
     */
    /** 
     * @cfg {Boolean} hideBorders 
     * @hide 
     */
    /** 
     * @cfg {Mixed} items 
     * @hide 
     */
    /** 
     * @cfg {String} layout 
     * @hide 
     */
    /** 
     * @cfg {Object} layoutConfig 
     * @hide 
     */
    /** 
     * @cfg {Boolean} monitorResize 
     * @hide 
     */
    /** 
     * @property items 
     * @hide 
     */
    /** 
     * @method add 
     * @hide 
     */
    /** 
     * @method cascade 
     * @hide 
     */
    /** 
     * @method doLayout 
     * @hide 
     */
    /** 
     * @method find 
     * @hide 
     */
    /** 
     * @method findBy 
     * @hide 
     */
    /** 
     * @method findById 
     * @hide 
     */
    /** 
     * @method findByType 
     * @hide 
     */
    /** 
     * @method getComponent 
     * @hide 
     */
    /** 
     * @method getLayout 
     * @hide 
     */
    /** 
     * @method getUpdater 
     * @hide 
     */
    /** 
     * @method insert 
     * @hide 
     */
    /** 
     * @method load 
     * @hide 
     */
    /** 
     * @method remove 
     * @hide 
     */
    /** 
     * @event add 
     * @hide 
     */
    /** 
     * @event afterLayout 
     * @hide 
     */
    /** 
     * @event beforeadd 
     * @hide 
     */
    /** 
     * @event beforeremove 
     * @hide 
     */
    /** 
     * @event remove 
     * @hide 
     */



    /**
     * @cfg {String} allowDomMove  @hide
     */
    /**
     * @cfg {String} autoEl @hide
     */
    /**
     * @cfg {String} applyTo  @hide
     */
    /**
     * @cfg {String} autoScroll  @hide
     */
    /**
     * @cfg {String} bodyBorder  @hide
     */
    /**
     * @cfg {String} bodyStyle  @hide
     */
    /**
     * @cfg {String} contentEl  @hide
     */
    /**
     * @cfg {String} disabledClass  @hide
     */
    /**
     * @cfg {String} elements  @hide
     */
    /**
     * @cfg {String} html  @hide
     */
    /**
     * @property disabled
     * @hide
     */
    /**
     * @method applyToMarkup
     * @hide
     */
    /**
     * @method enable
     * @hide
     */
    /**
     * @method disable
     * @hide
     */
    /**
     * @method setDisabled
     * @hide
     */
});
Ext.reg('grid', Ext.grid.GridPanel);