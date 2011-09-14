/**
 * @class Ext.grid.EditorGridPanel
 * @extends Ext.grid.GridPanel
 * 创建和编辑GRID的类。
 * @constructor
 */
Ext.grid.EditorGridPanel = Ext.extend(Ext.grid.GridPanel, {
    /**
     * @cfg {Number} clicksToEdit 
     * 要转换单元格为编辑状态所需的鼠标点击数（默认为两下，即双击）
     */
    clicksToEdit: 2,

    // private
    isEditor : true,
    // private
    detectEdit: false,

	/**
	 * @cfg {Boolean} trackMouseOver @hide
	 */
    // private
    trackMouseOver: false, // causes very odd FF errors
    
    // private
    initComponent : function(){
        Ext.grid.EditorGridPanel.superclass.initComponent.call(this);

        if(!this.selModel){
            this.selModel = new Ext.grid.CellSelectionModel();
        }

        this.activeEditor = null;

	    this.addEvents(
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
            "beforeedit",
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
            "afteredit",
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
            "validateedit"
        );
    },

    // private
    initEvents : function(){
        Ext.grid.EditorGridPanel.superclass.initEvents.call(this);
        
        this.on("bodyscroll", this.stopEditing, this);

        if(this.clicksToEdit == 1){
            this.on("cellclick", this.onCellDblClick, this);
        }else {
            if(this.clicksToEdit == 'auto' && this.view.mainBody){
                this.view.mainBody.on("mousedown", this.onAutoEditClick, this);
            }
            this.on("celldblclick", this.onCellDblClick, this);
        }
        this.getGridEl().addClass("xedit-grid");
    },

    // private
    onCellDblClick : function(g, row, col){
        this.startEditing(row, col);
    },

    // private
    onAutoEditClick : function(e, t){
        var row = this.view.findRowIndex(t);
        var col = this.view.findCellIndex(t);
        if(row !== false && col !== false){
        if(this.selModel.getSelectedCell){ // cell sm
            var sc = this.selModel.getSelectedCell();
            if(sc && sc.cell[0] === row && sc.cell[1] === col){
                this.startEditing(row, col);
            }
        }else{
            if(this.selModel.isSelected(row)){
                this.startEditing(row, col);
            }
        }
        }
    },

    // private
    onEditComplete : function(ed, value, startValue){
        this.editing = false;
        this.activeEditor = null;
        ed.un("specialkey", this.selModel.onEditorKey, this.selModel);
        if(String(value) !== String(startValue)){
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
     * 指定的行/列，进行单元格内容的编辑。
     * @param {Number} rowIndex
     * @param {Number} colIndex
     */
    startEditing : function(row, col){
        this.stopEditing();
        if(this.colModel.isCellEditable(col, row)){
            this.view.ensureVisible(row, col, true);
            var r = this.store.getAt(row);
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
                    ed.render(this.view.getEditorParent(ed));
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
     * 停止任何激活的行为。
     */
    stopEditing : function(){
        if(this.activeEditor){
            this.activeEditor.completeEdit();
        }
        this.activeEditor = null;
    }
});
Ext.reg('editorgrid', Ext.grid.EditorGridPanel);