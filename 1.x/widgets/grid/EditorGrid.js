/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.grid.EditorGrid
 * @extends Ext.grid.Grid
 * 创建和编辑GRID的类。
 * @param {String/HTMLElement/Ext.Element} container 承载GRID的那个元素
 * 容器必须先定义一些类型和长度，以便Grid填充。容器会自动设置其为相对定位（ position relative）。
 * @param {Object} dataSource 绑定的数据模型（DataModel）
 * @param {Object} colModel Grid的列模型（Column Model），负责保存grid每一列的有关信息
 */
Ext.grid.EditorGrid = function(container, config){
    Ext.grid.EditorGrid.superclass.constructor.call(this, container, config);
    this.getGridEl().addClass("xedit-grid");

    if(!this.selModel){
        this.selModel = new Ext.grid.CellSelectionModel();
    }

    this.activeEditor = null;

	this.addEvents({
	    /**
	     * @event beforeedit
	     * 当一个单元格被切换到编辑之前触发。编辑的事件对象会有下列的属性：<br />
	     * <ul style="padding:5px;padding-left:16px;">
	     * <li>grid - grid本身</li>
	     * <li>record - 正在编辑的record</li>
	     * <li>field - 正在编辑的字段名</li>
	     * <li>value - 正在设置的值（value）</li>
	     * <li>row - grid行索引</li>
	     * <li>column - grid列索引</li>
	     * <li>cancel - 由句柄（handler）返回的布尔值，决定true为取消编辑，否则为false</li>
	     * </ul>
	     * @param {Object} e 一个编辑的事件（参阅上面的解释）
	     */
	    "beforeedit" : true,
	    /**
	     * @event afteredit
	     * 当一个单元格被编辑后触发。<br />
	     * <ul style="padding:5px;padding-left:16px;">
	     * <li>grid - grid本身</li>
	     * <li>record - 正在编辑的record</li>
	     * <li>field - 正在编辑的字段名</li>
	     * <li>value - 正在设置的值（value）</li>
	     * <li>originalValue - 在编辑之前的原始值</li>
	     * <li>row - grid行索引</li>
	     * <li>column - grid列索引</li>
	     * </ul>
	     * @param {Object} e 一个编辑的事件（参阅上面的解释）
	     */
	    "afteredit" : true,
	    /**
	     * @event validateedit
	     * 编辑单元格后触发，但发生在更改值被设置到record之前。如果返回false即取消更改。
	     * 编辑的事件有以下属性 <br />
	     * <ul style="padding:5px;padding-left:16px;">
	     * <li>grid - grid本身</li>
	     * <li>record - 正在编辑的record</li>
	     * <li>field - 正在编辑的字段名</li>
	     * <li>value - 正在设置的值（value）</li>
	     * <li>originalValue - 在编辑之前的原始值</li>
	     * <li>row - grid行索引</li>
	     * <li>column - grid列索引</li>
	     * <li>cancel - 由句柄（handler）返回的布尔值，决定true为取消编辑，否则为false</li>
	     * </ul>
	     * @param {Object} e 一个编辑的事件（参阅上面的解释）
	     */
	    "validateedit" : true
	});
    this.on("bodyscroll", this.stopEditing,  this);
    this.on(this.clicksToEdit == 1 ? "cellclick" : "celldblclick", this.onCellDblClick,  this);
};

Ext.extend(Ext.grid.EditorGrid, Ext.grid.Grid, {
    isEditor : true,
     /**
     * @cfg {Number} clicksToEdit
     * 要转换单元格为编辑状态所需的鼠标点击数（默认为两下，即双击）
     */   
    clicksToEdit: 2,
    trackMouseOver: false, // 引起奇怪的FF错误

    onCellDblClick : function(g, row, col){
        this.startEditing(row, col);
    },

    onEditComplete : function(ed, value, startValue){
        this.editing = false;
        this.activeEditor = null;
        ed.un("specialkey", this.selModel.onEditorKey, this.selModel);
        if(String(value) != String(startValue)){
            var r = ed.record;
            var field = this.colModel.getDataIndex(ed.col);
            var e = {
                grid: this,
                record: r,
                field: field,
                originalValue: startValue,
                value: value,
                row: ed.row,
                column: ed.col,
                cancel:false
            };
            if(this.fireEvent("validateedit", e) !== false && !e.cancel){
                r.set(field, e.value);
                delete e.cancel;
                this.fireEvent("afteredit", e);
            }
        }
        this.view.focusCell(ed.row, ed.col);
    },

    /**
     * 开始编辑指定的单元格
     * @param {Number} row 行索引
     * @param {Number} col 类索引
     */
    startEditing : function(row, col){
        this.stopEditing();
        if(this.colModel.isCellEditable(col, row)){
            this.view.ensureVisible(row, col, true);
            var r = this.dataSource.getAt(row);
            var field = this.colModel.getDataIndex(col);
            var e = {
                grid: this,
                record: r,
                field: field,
                value: r.data[field],
                row: row,
                column: col,
                cancel:false
            };
            if(this.fireEvent("beforeedit", e) !== false && !e.cancel){
                this.editing = true;
                var ed = this.colModel.getCellEditor(col, row);
                if(!ed.rendered){
                    ed.render(ed.parentEl || document.body);
                }
                (function(){ // complex but required for focus issues in safari, ie and opera
                    ed.row = row;
                    ed.col = col;
                    ed.record = r;
                    ed.on("complete", this.onEditComplete, this, {single: true});
                    ed.on("specialkey", this.selModel.onEditorKey, this.selModel);
                    this.activeEditor = ed;
                    var v = r.data[field];
                    ed.startEdit(this.view.getCell(row, col), v);
                }).defer(50, this);
            }
        }
    },
        
   /**
     * 停止任何激活的编辑
     */
    stopEditing : function(){
        if(this.activeEditor){
            this.activeEditor.completeEdit();
        }
        this.activeEditor = null;
    }
});