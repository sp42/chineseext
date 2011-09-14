/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://www.extjs.com/license
 */

/**
 * @class Ext.grid.Grid
 * @extends Ext.util.Observable
 * 将主要的控制Grid组件的接口呈现为该类。
 *
 * <br><br>Usage:<pre><code>
 var grid = new Ext.grid.Grid("my-container-id", {
     ds: myDataStore,
     cm: myColModel,
     selModel: mySelectionModel,
     autoSizeColumns: true,
     monitorWindowResize: false,
     trackMouseOver: true
 });
 // 设置任意的选项
 grid.render();
 * </code></pre>
 * <b>常见问题：</b><br/>
 * - Grid变小的时候并不会自己调整大小，不过可以通用在容器元素上设置overflow：hidden来修正这个问题。<br/>
 * - 如果得到的el.style[camel]= NaNpx 或 -2px 或是相关的内容，须确认你已经指定了容器元素的尺寸。
 * Grid会自适应容器的尺寸大小，如不设置容器的大小会导致难以预料的问题。 <br/>
 * －不要在一个display:none的元素上渲染grid。尝试一下visibility:hidden。不然的话grid不能够计算出尺寸、偏移值。<br/>
  * @constructor
 * @param {String/HTMLElement/Ext.Element} container Grid进行渲染的那个元素 -
 * 为了能够装下grid，容器须指定相应的宽度、高度。
 * 容器会自动设置为相对布局。
 * @param {Object} config 设置GRID属性的配置项对象
 */
Ext.grid.Grid = function(container, config){
	// 初始化容器
	this.container = Ext.get(container);
	this.container.update("");
	this.container.setStyle("overflow", "hidden");
    this.container.addClass('x-grid-container');

    this.id = this.container.id;

    Ext.apply(this, config);
    // check and correct shorthanded configs
    if(this.ds){
        this.dataSource = this.ds;
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

    if(this.width){
        this.container.setWidth(this.width);
    }

    if(this.height){
        this.container.setHeight(this.height);
    }
    /** @private */
	this.addEvents({
	    // 原始未加工的事件
	    /**
	     * @event click
	     * 单击整个grid的原始事件
	     * @param {Ext.EventObject} e
	     */
	    "click" : true,
	    /**
	     * @event dblclick
	     * 双击整个grid的原始事件
	     * @param {Ext.EventObject} e
	     */
	    "dblclick" : true,
	    /**
	     * @event contextmenu
	     * 右击整个grid的原始事件
	     * @param {Ext.EventObject} e
	     */
	    "contextmenu" : true,
	    /**
	     * @event mousedown
	     * 整个grid mousedown 的原始事件
	     * @param {Ext.EventObject} e
	     */
	    "mousedown" : true,
	    /**
	     * @event mouseup
	     * 整个grid mouseup 的原始事件
	     * @param {Ext.EventObject} e
	     */
	    "mouseup" : true,
	    /**
	     * @event mouseover
	     * 整个grid mouseover 的原始事件
	     * @param {Ext.EventObject} e
	     */
	    "mouseover" : true,
	    /**
	     * @event mouseout
	     * 整个grid mouseout 的原始事件
	     * @param {Ext.EventObject} e
	     */
	    "mouseout" : true,
	    /**
	     * @event keypress
	     * 整个grid keypress 的原始事件
	     * @param {Ext.EventObject} e
	     */
	    "keypress" : true,
	    /**
	     * @event keydown
	     * 整个grid keydown 的原始事件
	     * @param {Ext.EventObject} e
	     */
	    "keydown" : true,

	    // custom events

	    /**
	     * @event cellclick
	     * 单元格（cell）被单击时触发
	     * @param {Grid} this
	     * @param {Number} rowIndex行索引
	     * @param {Number} columnIndex列索引
	     * @param {Ext.EventObject} e
	     */
	    "cellclick" : true,
	    /**
	     * @event celldblclick
	     * 单元格（cell）被双击时触发
	     * @param {Grid} this
	     * @param {Number} rowIndex行索引
	     * @param {Number} columnIndex列索引
	     * @param {Ext.EventObject} e
	     */
	    "celldblclick" : true,
	    /**
	     * @event rowclick
	     * 行（row）被单击时触发
	     * @param {Grid} this
	     * @param {Number} rowIndex行索引
	     * @param {Ext.EventObject} e
	     */
	    "rowclick" : true,
	    /**
	     * @event rowdblclick
	     * 行（row）被双击时触发
	     * @param {Grid} this
	     * @param {Number} rowIndex行索引
	     * @param {Ext.EventObject} e
	     */
	    "rowdblclick" : true,
	    /**
	     * @event headerclick
	     * 头部（header）被单击时触发
	     * @param {Grid} this
	     * @param {Number} columnIndex列索引
	     * @param {Ext.EventObject} e
	     */
	    "headerclick" : true,
	    /**
	     * @event headerdblclick
	     * 头部（header）被双击时触发
	     * @param {Grid} this
	     * @param {Number} columnIndex列索引
	     * @param {Ext.EventObject} e
	     */
	    "headerdblclick" : true,
	    /**
	     * @event rowcontextmenu
	     * 行（row）被右击时触发
	     * @param {Grid} this
	     * @param {Number} rowIndex行索引
	     * @param {Ext.EventObject} e
	     */
	    "rowcontextmenu" : true,
	    /**
         * @event cellcontextmenu
	     * 单元格（cell）被右击时触发
         * @param {Grid} this
         * @param {Number} rowIndex行索引
         * @param {Number} cellIndex单元格索引
         * @param {Ext.EventObject} e
         */
         "cellcontextmenu" : true,
	    /**
	     * @event headercontextmenu
	     * 头部（header）被右击时触发
	     * @param {Grid} this
	     * @param {Number} columnIndex列索引
	     * @param {Ext.EventObject} e
	     */
	    "headercontextmenu" : true,
	    /**
	     * @event bodyscroll
	     * 当body元素被滚动后触发
	     * @param {Number} scrollLeft
	     * @param {Number} scrollTop
	     */
	    "bodyscroll" : true,
	    /**
	     * @event columnresize
	     * 当用户调整某个列（column）大小时触发
	     * @param {Number} columnIndex列索引
	     * @param {Number} newSize
	     */
	    "columnresize" : true,
	    /**
	     * @event columnmove
	     * 当用户移动某个列（column）时触发
	     * @param {Number} oldIndex
	     * @param {Number} newIndex
	     */
	    "columnmove" : true,
	    /**
	     * @event startdrag
	     * 当行（row）开始被拖动时触发
	     * @param {Grid} this
	     * @param {Ext.GridDD} dd 拖放对象
	     * @param {event} e 浏览器原始的事件对象
	     */
	    "startdrag" : true,
	    /**
	     * @event enddrag
	     * 当拖动完成后触发
	     * @param {Grid} this
	     * @param {Ext.GridDD} dd 拖放对象
	     * @param {event} e 浏览器原始的事件对象
	     */
	    "enddrag" : true,
	    /**
	     * @event dragdrop
	     * 拖动行（row）放到一个有效的DD target 身上，触发该事件
	     * @param {Grid} this
	     * @param {Ext.GridDD} dd 拖放对象
	     * @param {String} targetId 拖放对象之目标
	     * @param {event} e 浏览器原始的事件对象
	     */
	    "dragdrop" : true,
	    /**
	     * @event dragover
	     * 当行（row）拖动着的时候触发。
	     * “targetId”是行拖动中Yahoo.util.DD对象所选取的ID。
	     * @param {Grid} this
	     * @param {Ext.GridDD} dd 拖放对象
	     * @param {String} targetId 拖放对象之目标
	     * @param {event} e 浏览器原始的事件对象
	     */
	    "dragover" : true,
	    /**
	     * @event dragenter
	     * 当拖动的行开始进入其它DD目标时触发。
	     * @param {Grid} this
	     * @param {Ext.GridDD} dd 拖放对象
	     * @param {String} targetId 拖放对象之目标
	     * @param {event} e 浏览器原始的事件对象
	     */
	    "dragenter" : true,
	    /**
	     * @event dragout
	     * 当拖动的行开始离开其它DD目标时触发。
	     * @param {Grid} this
	     * @param {Ext.GridDD} dd 拖放对象
	     * @param {String} targetId 拖放对象之目标
	     * @param {event} e 浏览器原始的事件对象
	     */
	    "dragout" : true,
        /**
         * @event render
	     * 当grid渲染完成后触发
         * @param {Grid} grid
         */
        render : true
    });

    Ext.grid.Grid.superclass.constructor.call(this);
};
Ext.extend(Ext.grid.Grid, Ext.util.Observable, {
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

    /**
    * @cfg {Boolean} autoWidth True表示为grid的总宽度为各个列宽度之和，而不是一个固定值。默认为false。
    */
    /**
    * @cfg {Number} maxHeight 设置grid的高度上限。若关闭autoHeight则忽略。
    */
    /**
     * 完成Grid所有设置后，进入可用状态后，即可调用该方法渲染Grid。
     * @return {Ext.grid.Grid} this
     */
    render : function(){
        var c = this.container;
        // try to detect autoHeight/width mode
        if((!c.dom.offsetHeight || c.dom.offsetHeight < 20) || c.getStyle("height") == "auto"){
    	    this.autoHeight = true;
    	}
    	var view = this.getView();
        view.init(this);

        c.on("click", this.onClick, this);
        c.on("dblclick", this.onDblClick, this);
        c.on("contextmenu", this.onContextMenu, this);
        c.on("keydown", this.onKeyDown, this);

        this.relayEvents(c, ["mousedown","mouseup","mouseover","mouseout","keypress"]);

        this.getSelectionModel().init(this);

        view.render();

        if(this.loadMask){
            this.loadMask = new Ext.LoadMask(this.container,
                    Ext.apply({store:this.dataSource}, this.loadMask));
        }
        this.rendered = true;
        this.fireEvent('render', this);
        return this;
    },

	/**
	 * 重新配置Grid的Store和Column Model（列模型）。
	 * 视图会重新绑定对象并刷新。
	 * @param {Ext.data.Store} dataSource 另外一个{@link Ext.data.Store}对象
	 * @param {Ext.grid.ColumnModel} 另外一个{@link Ext.grid.ColumnModel}对象
	 */
    reconfigure : function(dataSource, colModel){
        if(this.loadMask){
            this.loadMask.destroy();
            this.loadMask = new Ext.LoadMask(this.container,
                    Ext.apply({store:dataSource}, this.loadMask));
        }
        this.view.bind(dataSource, colModel);
        this.dataSource = dataSource;
        this.colModel = colModel;
        this.view.refresh(true);
    },

    // private
    onKeyDown : function(e){
        this.fireEvent("keydown", e);
    },

    /**
     * 销毁该Grid
     * @param {Boolean} removeEl True :移除元素
     */
    destroy : function(removeEl, keepListeners){
        if(this.loadMask){
            this.loadMask.destroy();
        }
        var c = this.container;
        c.removeAllListeners();
        this.view.destroy();
        this.colModel.purgeListeners();
        if(!keepListeners){
            this.purgeListeners();
        }
        c.update("");
        if(removeEl === true){
            c.remove();
        }
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
        var ds = this.dataSource, rlen = ds.getCount(), first = true;
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

    /**让Grid重新计算尺寸。一般情况下无须手工执行，
     * 除非手动更新后需要调整一下。
     */
    autoSize : function(){
        if(this.rendered){
            this.view.layout();
            if(this.view.adjustForScroll){
                this.view.adjustForScroll();
            }
        }
    },

    /**
     * 返回Grid的元素
     * @return {Element} 元素
     */
    getGridEl : function(){
        return this.container;
    },

    // private for compatibility, overridden by editor grid
    stopEditing : function(){},

    /**
     * 返回grid的SelectionModel.
     * @return {SelectionModel}
     */
    getSelectionModel : function(){
        if(!this.selModel){
            this.selModel = new Ext.grid.RowSelectionModel();
        }
        return this.selModel;
    },

    /**
     * 返回Grid的DataSource.
     * @return {DataSource}
     */
    getDataSource : function(){
        return this.dataSource;
    },

    /**
     * 返回Grid的ColumnModel.
     * @return {ColumnModel}
     */
    getColumnModel : function(){
        return this.colModel;
    },

    /**
     * 返回Grid的GridView object.
     * @return {GridView}
     */
    getView : function(){
        if(!this.view){
            this.view = new Ext.grid.GridView(this.viewConfig);
        }
        return this.view;
    },
    /**
     *获取GRID拖动的代理文本，默认返回 this.ddText。
     * @return {String}
     */
    getDragDropText : function(){
        var count = this.selModel.getCount();
        return String.format(this.ddText, count, count == 1 ? '' : 's');
    }
});
/**
 * 配置一段文本，将（默认的“%0 selected row(s)”）中的"%0"替换为选取的行数。
 * @type String
 */
Ext.grid.Grid.prototype.ddText = "{0} selected row{1}";