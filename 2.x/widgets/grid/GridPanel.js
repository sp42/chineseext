/**
 * @class Ext.grid.GridPanel
 * @extends Ext.Panel
 * 基于Grid控件的一个面板组件，此类呈现了主要的接口。
 * <br><br>用法：
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
        forceFit: true
    },
    sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
    width:600,
    height:300,
    frame:true,
    title:'Framed with Checkbox Selection and Horizontal Scrolling',
    iconCls:'icon-grid'
});</code></pre>
 * <b>注意：</b>
 * 尽管本类是由基类继承而得到的，但是不支持基类的某些功能，不能做到好像Panel类那样的方法，如autoScroll、layout、items等
 * <br>
 * <br>
 * 要访问GRID中的数据，就必须通过由{@link #store Store}封装的数据模型。参与{@link #cellclick}事件。
 * @constructor
 * @param {Object} config 配置项对象
 */
Ext.grid.GridPanel = Ext.extend(Ext.Panel, {

    /**
     * @cfg {Ext.data.Store} store Grid应使用 {@link Ext.data.Store} 作为其数据源 (必须的).
     */
     /**
     * @cfg {Object} cm {@link #colModel}的简写方式
     */

    /**
     * @cfg {Object} colModel 渲染Grid所使用的 {@link Ext.grid.ColumnModel} (必须的).
     */
     /**
     * @cfg {Object} sm  {@link #selModel}的简写方式
     */
    /**
     * @cfg {Object} selModel AbstractSelectionModel 的子类，以为Grid提供选区模型(selection model)
     * (默认为 {@link Ext.grid.RowSelectionModel} 如不指定).
     */

    /**
     * @cfg {Array} columns 自动创建列模型 (ColumnModel)的数组。
     */

    /**
    * @cfg {Number} maxHeight 设置Grid的最大高度 (若autoHeight关闭则忽略)。
    */

    /**
     * @cfg {Boolean} disableSelection True表示为禁止grid的选区功能 (默认为 false). - 若指定了SelectionModel则忽略
     */

    /**
     * @cfg {Boolean} enableColumnMove False表示为在列拖动时禁止排序 (默认为 true).
     */

    /**
     * @cfg {Boolean} enableColumnResize False 表示为关闭列的大小调节功能 (默认为 true).
     */

	/**
     * @cfg {Object} viewConfig 作用在grid's UI试图上的配置项对象，
     * 任 {@link Ext.grid.GridView} 可用的配置选项都可在这里指定。
     */
     
    /**
     * 配置拖动代理中的文本 (缺省为 "{0} selected row(s)").
     * 选中行的行数会替换到 {0}。
     * @type String
     */
     ddText : "{0} selected row{1}",
     /**
     * @cfg {Number} minColumnWidth 列的宽度的调整下限。默认为25。
	 */
	minColumnWidth : 25,

    /**
	 * @cfg {Boolean} autoSizeColumns True表示为在<b>初始渲染的时候</b>便根据每一列内容的宽度自适应列的大小
	 * 通过配置{@link Ext.grid.ColumnModel#width}的选项，精确指明每列的尺寸，会有更佳的效率。默认为false。
	 */
	autoSizeColumns : false,

	/**
	 * @cfg {Boolean} autoSizeHeaders True表示为根据头部内容的宽度调整列大小（默认为true）。
	 */
	autoSizeHeaders : true,

	/**
	 * @cfg {Boolean} monitorWindowResize True表示为windows调整大小时自动调整grid（默认为true）。
	 */
	monitorWindowResize : true,

	/**
	 * @cfg {Boolean} maxRowsToMeasure 如果autoSizeColumns打开，maxRowsToMeasure可用于检测每列宽度的最大行数。默认为0（所有的行）
	 */
	maxRowsToMeasure : 0,

	/**
	 * @cfg {Boolean} trackMouseOver True表示为鼠标移动时高亮显示（默认为true）。
	 */
	trackMouseOver : true,

	/**
	 * @cfg {Boolean} enableDragDrop True表示为激活行的拖动（默认为false）。
	 */
	enableDragDrop : false,

	/**
	 * @cfg {Boolean} enableColumnMove True表示为激活列的拖动（默认为true）。
	 */
	enableColumnMove : true,

	/**
	 * @cfg {Boolean} enableColumnHide True表示为隐藏每列头部的邮件菜单（默认为true）。
	 */
	enableColumnHide : true,

	/**
	 * @cfg {Boolean} enableRowHeightSync True表示为在锁定和非锁定行之中手动同步行的高度。默认为false。
	 */
	enableRowHeightSync : false,

	/**
	 * @cfg {Boolean} stripeRows True表示为显示行的分隔符（默认为true）。
	 */
	stripeRows : true,

	/**
	 * @cfg {Boolean} autoHeight True说明会根据内容的高度自动调整grid的整体高度。默认为false
	 */
	autoHeight : false,

    /**
     * @cfg {String} autoExpandColumn 指定某个列之id,grid就会在这一列自动扩展宽度，以填满空白的位置，该id不能为0。默认为false。
     */
    autoExpandColumn : false,

    /**
    * @cfg {Number} autoExpandMin autoExpandColumn可允许最小之宽度（有激活的话）。默认为50。
    */
    autoExpandMin : 50,

    /**
    * @cfg {Number} autoExpandMax autoExpandColumn可允许最大之宽度（有激活的话）。默认为 1000。
    */
    autoExpandMax : 1000,
    /**
	 * @cfg {Object} view Grid所使用的{@link Ext.grid.GridView}。该项可在render()调用之前设置。
	 */
    view : null,
	/**
     * @cfg {Object} loadMask True表示为当grid加载过程中，会有一个{@link Ext.LoadMask}的遮罩效果。默认为false。
	 */
    loadMask : false,

    // private
    rendered : false,
    // private
    viewReady: false,
    // private
    stateEvents: ["columnmove", "columnresize", "sortchange"],

    // private
    initComponent : function(){
        Ext.grid.GridPanel.superclass.initComponent.call(this);

        // override any provided value since it isn't valid
        // and is causing too many bug reports ;)
        this.autoScroll = false;

        if(this.columns && (this.columns instanceof Array)){
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
             * @param {Ext.EventObject} e
             */
            "click",
            /**
             * @event dblclick
             * 整个Grid被双击的原始事件。
             * @param {Ext.EventObject} e
             */
            "dblclick",
            /**
             * @event contextmenu
             * 整个Grid被右击的原始事件。
             * @param {Ext.EventObject} e
             */
            "contextmenu",
            /**
             * @event mousedown
             * 整个Grid的mousedown的原始事件。
             * @param {Ext.EventObject} e
             */
            "mousedown",
            /**
             * @event mouseup
             * 整个Grid的mouseup的原始事件。
             * @param {Ext.EventObject} e
             */
            "mouseup",
            /**
             * @event mouseover
             * 整个Grid的mouseover的原始事件。
             * @param {Ext.EventObject} e
             */
            "mouseover",
            /**
             * @event mouseout
             * 整个Grid的mouseout的原始事件。
             * @param {Ext.EventObject} e
             */
            "mouseout",
            /**
             * @event keypress
             * 整个Grid的keypress的原始事件。
             * @param {Ext.EventObject} e
             */
            "keypress",
            /**
             * @event keydown
             * 整个Grid的keydown的原始事件。
             * @param {Ext.EventObject} e
             */
            "keydown",

            // custom events
            /**
             * @event cellmousedown
             * 当单元格被单击之前触发。
             * @param {Grid} this
             * @param {Number} rowIndex
             * @param {Number} columnIndex
             * @param {Ext.EventObject} e
             */
            "cellmousedown",
            /**
             * @event rowmousedown
             * 当行被单击之前触发。
             * @param {Grid} this
             * @param {Number} rowIndex
             * @param {Ext.EventObject} e
             */
            "rowmousedown",
            /**
             * @event headermousedown
             * 当头部被单击之前触发。
             * @param {Grid} this
             * @param {Number} columnIndex
             * @param {Ext.EventObject} e
             */
            "headermousedown",

            /**
             * @event cellclick
             * 当单元格被点击时触发。
             * 单击格的数据保存在{@link Ext.data.Record Record}。要在侦听器函数内访问数据，可按照以下的办法：
             * <pre><code>
    function(grid, rowIndex, columnIndex, e) {
        var record = grid.getStore().getAt(rowIndex);  // 返回Record对象
        var fieldName = grid.getColumnModel().getDataIndex(columnIndex); // 返回字段名称
        var data = record.get(fieldName);
    }
</code></pre>
             * @param {Grid} this
             * @param {Number} rowIndex
             * @param {Number} columnIndex
             * @param {Ext.EventObject} e
             */
            "cellclick",
            /**
             * @event celldblclick
             * 单元格（cell）被双击时触发
             * @param {Grid} this
             * @param {Number} rowIndex 行索引
             * @param {Number} columnIndex 列索引
             * @param {Ext.EventObject} e
             */
            "celldblclick",
            /**
             * @event rowclick
             * 行（row）被单击时触发
             * @param {Grid} this
             * @param {Number} rowIndex 行索引
             * @param {Ext.EventObject} e
             */
            "rowclick",
            /**
             * @event rowdblclick
             * 行（row）被双击时触发
             * @param {Grid} this
             * @param {Number} rowIndex 行索引
             * @param {Ext.EventObject} e
             */
            "rowdblclick",
            /**
             * @event headerclick
             * 头部（header）被单击时触发
             * @param {Grid} this
             * @param {Number} columnIndex 列索引
             * @param {Ext.EventObject} e
             */
            "headerclick",
            /**
             * @event headerdblclick
             * 头部（header）被双击时触发
             * @param {Grid} this
             * @param {Number} columnIndex 列索引
             * @param {Ext.EventObject} e
             */
            "headerdblclick",
            /**
             * @event rowcontextmenu
             * 行（row）被右击时触发
             * @param {Grid} this
             * @param {Number} rowIndex 行索引
             * @param {Ext.EventObject} e
             */
            "rowcontextmenu",
            /**
             * @event cellcontextmenu
             * 单元格（cell）被右击时触发
             * @param {Grid} this
             * @param {Number} rowIndex 行索引
             * @param {Number} cellIndex 单元格索引
             * @param {Ext.EventObject} e
             */
            "cellcontextmenu",
            /**
             * @event headercontextmenu
             * 头部（header）被右击时触发
             * @param {Grid} this
             * @param {Number} columnIndex
             * @param {Ext.EventObject} e
             */
            "headercontextmenu",
            /**
             * @event bodyscroll
             * 当body元素被滚动后触发
             * @param {Number} scrollLeft
             * @param {Number} scrollTop
             */
            "bodyscroll",
            /**
             * @event columnresize
             * 当用户调整某个列（column）大小时触发
             * @param {Number} columnIndex
             * @param {Number} newSize
             */
            "columnresize",
            /**
             * @event columnmove
             * 当用户移动某个列（column）时触发
             * @param {Number} oldIndex
             * @param {Number} newIndex
             */
            "columnmove",
            /**
             * @event sortchange
	     	 * 当行（row）开始被拖动时触发
             * @param {Grid} this
             * @param {Object} sortInfo 包含键字段和方向的对象
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

        c.on("mousedown", this.onMouseDown, this);
        c.on("click", this.onClick, this);
        c.on("dblclick", this.onDblClick, this);
        c.on("contextmenu", this.onContextMenu, this);
        c.on("keydown", this.onKeyDown, this);

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
        this.colModel.on('hiddenchange', this.saveState, this, {delay: 100});
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
        if(state.sort){
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
        var ss = this.store.getSortState();
        if(ss){
            o.sort = ss;
        }
        return o;
    },

    // private
    afterRender : function(){
        Ext.grid.GridPanel.superclass.afterRender.call(this);
        this.view.layout();
        this.viewReady = true;
    },

	/**
	 * 重新配置Grid的Store和Column Model（列模型）。视图会重新绑定对象并刷新。
	 * @param {Ext.data.Store} dataSource 另外一个{@link Ext.data.Store}对象
	 * @param {Ext.grid.ColumnModel} 另外一个{@link Ext.grid.ColumnModel}对象
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
     * 返回Grid的元素
     * @return {Element} 元素
     */
    getGridEl : function(){
        return this.body;
    },

    // private for compatibility, overridden by editor grid
    stopEditing : function(){},

    /**
     * 返回grid的SelectionModel.
     * @return {SelectionModel} 选区模型
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
     * @return {DataSource} store对象
     */
    getStore : function(){
        return this.store;
    },

    /**
     * 返回Grid的列模型（ColumnModel）。
     * @return {ColumnModel} 列模型
     */
    getColumnModel : function(){
        return this.colModel;
    },

    /**
     * 返回Grid的GridView对象。
     * @return {GridView} GridView
     */
    getView : function(){
        if(!this.view){
            this.view = new Ext.grid.GridView(this.viewConfig);
        }
        return this.view;
    },
    /**
     *获取GRID拖动的代理文本（drag proxy text），默认返回this.ddText。
     * @return {String} GRID拖动的代理文本
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
});
Ext.reg('grid', Ext.grid.GridPanel);