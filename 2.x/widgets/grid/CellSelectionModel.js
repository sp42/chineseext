/**
 * @class Ext.grid.CellSelectionModel
 * @extends Ext.grid.AbstractSelectionModel
 * 本类提供了grid单元格选区的基本实现。
 * 执行{@link getSelectedCell}的方法返回一个选区对象，这个对象包含下列的属性：
 * <div class="mdetail-params"><ul>
 * <li><b>record</b> : Ext.data.record<p class="sub-desc">提供所选行中的 {@link Ext.data.Record}数据</p></li>
 * <li><b>cell</b> : Ext.data.record<p class="sub-desc">一个包含下列属性的对象：
 * <div class="mdetail-params"><ul>
 * <li><b>rowIndex</b> : Number<p class="sub-desc">选中行的索引</p></li>
 * <li><b>cellIndex</b> : Number<p class="sub-desc">选中单元格的索引<br>
 * <b>注意有时会因为列渲染的问题，单元格索引不应用于 Record数据的索引。
 * 因此，应该使用当前的字段<i>名称</i>来获取数据值，如：:</b><pre><code>
    var fieldName = grid.getColumnModel().getDataIndex(cellIndex);
    var data = record.get(fieldName);
</code></pre></p></li>
 * </ul></div></p></li>
 * </ul></div>
 * @constructor
 * @param {Object} config 针对该模型的配置对象。
 */
Ext.grid.CellSelectionModel = function(config){
    Ext.apply(this, config);

    this.selection = null;

    this.addEvents(
        /**
	     * @event beforerowselect
	     * 单元格被选中之前触发
	     * @param {SelectionModel} this
	     * @param {Number} rowIndex 选中的行索引
	     * @param {Number} colIndex 选中的单元格索引
	     */
	    "beforecellselect",
        /**
	     * @event cellselect
	     * 当单元格被选中时触发
	     * @param {SelectionModel} this
	     * @param {Number} rowIndex 选中的行索引
	     * @param {Number} colIndex 选中的单元格索引
	     */
	    "cellselect",
        /**
	     * @event selectionchange
	     * 当已激活的选区改变时触发
	     * @param {SelectionModel} this
	     * @param {Object} selection null 代表没选区而object (o) 则代表有下列两个属性的对象：
	        <ul>
	        <li>o.record: 选区所在的record对象</li>
	        <li>o.cell: [rowIndex, columnIndex]的数组</li>
	        </ul>
	     */
	    "selectionchange"
    );

    Ext.grid.CellSelectionModel.superclass.constructor.call(this);
};

Ext.extend(Ext.grid.CellSelectionModel, Ext.grid.AbstractSelectionModel,  {

    /** @ignore */
    initEvents : function(){
        this.grid.on("cellmousedown", this.handleMouseDown, this);
        this.grid.getGridEl().on(Ext.isIE ? "keydown" : "keypress", this.handleKeyDown, this);
        var view = this.grid.view;
        view.on("refresh", this.onViewChange, this);
        view.on("rowupdated", this.onRowUpdated, this);
        view.on("beforerowremoved", this.clearSelections, this);
        view.on("beforerowsinserted", this.clearSelections, this);
        if(this.grid.isEditor){
            this.grid.on("beforeedit", this.beforeEdit,  this);
        }
    },

	//private
    beforeEdit : function(e){
        this.select(e.row, e.column, false, true, e.record);
    },

	//private
    onRowUpdated : function(v, index, r){
        if(this.selection && this.selection.record == r){
            v.onCellSelect(index, this.selection.cell[1]);
        }
    },

	//private
    onViewChange : function(){
        this.clearSelections(true);
    },

	/**
	 * 返回当前选中的单元格。
	 * @return {Object} 选中的单元格，null就代表没选中
	 */
    getSelectedCell : function(){
        return this.selection ? this.selection.cell : null;
    },

    /**
     * 清除所有选区。
     * @param {Boolean} true表示改变时不通知gridview
     */
    clearSelections : function(preventNotify){
        var s = this.selection;
        if(s){
            if(preventNotify !== true){
                this.grid.view.onCellDeselect(s.cell[0], s.cell[1]);
            }
            this.selection = null;
            this.fireEvent("selectionchange", this, null);
        }
    },

    /**
     * 有选区的话返回true
     * @return {Boolean}
     */
    hasSelection : function(){
        return this.selection ? true : false;
    },

    /** @ignore */
    handleMouseDown : function(g, row, cell, e){
        if(e.button !== 0 || this.isLocked()){
            return;
        };
        this.select(row, cell);
    },

    /**
     * 选中一个单元格。
     * @param {Number} rowIndex
     * @param {Number} collIndex
     */
    select : function(rowIndex, colIndex, preventViewNotify, preventFocus, /*internal*/ r){
        if(this.fireEvent("beforecellselect", this, rowIndex, colIndex) !== false){
            this.clearSelections();
            r = r || this.grid.store.getAt(rowIndex);
            this.selection = {
                record : r,
                cell : [rowIndex, colIndex]
            };
            if(!preventViewNotify){
                var v = this.grid.getView();
                v.onCellSelect(rowIndex, colIndex);
                if(preventFocus !== true){
                    v.focusCell(rowIndex, colIndex);
                }
            }
            this.fireEvent("cellselect", this, rowIndex, colIndex);
            this.fireEvent("selectionchange", this, this.selection);
        }
    },

	//private
    isSelectable : function(rowIndex, colIndex, cm){
        return !cm.isHidden(colIndex);
    },

    /** @ignore */
    handleKeyDown : function(e){
        if(!e.isNavKeyPress()){
            return;
        }
        var g = this.grid, s = this.selection;
        if(!s){
            e.stopEvent();
            var cell = g.walkCells(0, 0, 1, this.isSelectable,  this);
            if(cell){
                this.select(cell[0], cell[1]);
            }
            return;
        }
        var sm = this;
        var walk = function(row, col, step){
            return g.walkCells(row, col, step, sm.isSelectable,  sm);
        };
        var k = e.getKey(), r = s.cell[0], c = s.cell[1];
        var newCell;

        switch(k){
             case e.TAB:
                 if(e.shiftKey){
                     newCell = walk(r, c-1, -1);
                 }else{
                     newCell = walk(r, c+1, 1);
                 }
             break;
             case e.DOWN:
                 newCell = walk(r+1, c, 1);
             break;
             case e.UP:
                 newCell = walk(r-1, c, -1);
             break;
             case e.RIGHT:
                 newCell = walk(r, c+1, 1);
             break;
             case e.LEFT:
                 newCell = walk(r, c-1, -1);
             break;
             case e.ENTER:
                 if(g.isEditor && !g.editing){
                    g.startEditing(r, c);
                    e.stopEvent();
                    return;
                }
             break;
        };
        if(newCell){
            this.select(newCell[0], newCell[1]);
            e.stopEvent();
        }
    },

    acceptsNav : function(row, col, cm){
        return !cm.isHidden(col) && cm.isCellEditable(col, row);
    },

    onEditorKey : function(field, e){
        var k = e.getKey(), newCell, g = this.grid, ed = g.activeEditor;
        if(k == e.TAB){
            if(e.shiftKey){
                newCell = g.walkCells(ed.row, ed.col-1, -1, this.acceptsNav, this);
            }else{
                newCell = g.walkCells(ed.row, ed.col+1, 1, this.acceptsNav, this);
            }
            e.stopEvent();
        }else if(k == e.ENTER){
            ed.completeEdit();
            e.stopEvent();
        }else if(k == e.ESC){
        	e.stopEvent();
            ed.cancelEdit();
        }
        if(newCell){
            g.startEditing(newCell[0], newCell[1]);
        }
    }
});