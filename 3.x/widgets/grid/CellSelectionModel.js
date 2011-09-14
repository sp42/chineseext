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
 * @class Ext.grid.CellSelectionModel
 * @extends Ext.grid.AbstractSelectionModel
 * 本类提供了grid单元格选区的基本实现。
 * 执行{@link getSelectedCell}的方法返回一个选区对象，这个对象包含下列的属性：<br />
 * This class provides the basic implementation for single cell selection in a grid. The object stored
 * as the selection and returned by {@link getSelectedCell} contains the following properties:
 * <div class="mdetail-params"><ul>
 * <li><b>record</b> : Ext.data.record<p class="sub-desc">提供所选行中的 {@link Ext.data.Record}数据
 * The {@link Ext.data.Record Record} which provides the data for the row containing the selection</p></li>
 * <li><b>cell</b> : Ext.data.record<p class="sub-desc">一个包含下列属性的对象：An object containing the following properties:
 * <div class="mdetail-params"><ul>
 * <li><b>rowIndex</b> : Number<p class="sub-desc">选中行的索引 The index of the selected row</p></li>
 * <li><b>cellIndex</b> : Number<p class="sub-desc">选中单元格的索引 The index of the selected cell<br>
 * <b>注意有时会因为列渲染的问题，单元格索引不应用于Record数据的索引。因此，应该使用当前的字段<i>名称</i>来获取数据值，如： 
 * Note that due to possible column reordering, the cellIndex should not be used as an index into
 * the Record's data. Instead, the <i>name</i> of the selected field should be determined
 * in order to retrieve the data value from the record by name:</b><pre><code>
    var fieldName = grid.getColumnModel().getDataIndex(cellIndex);
    var data = record.get(fieldName);
</code></pre></p></li>
 * </ul></div></p></li>
 * </ul></div>
 * @constructor
 * @param {Object} config 针对该模型的配置对象 The object containing the configuration of this model.
 */
Ext.grid.CellSelectionModel = function(config){
    Ext.apply(this, config);

    this.selection = null;

    this.addEvents(
        /**
	     * @event beforecellselect
	     * 单元格被选中之前触发。
	     * Fires before a cell is selected.
	     * @param {SelectionModel} this
	     * @param {Number} rowIndex 选中的行索引 The selected row index
	     * @param {Number} colIndex 选中的单元格索引 The selected cell index
	     */
	    "beforecellselect",
        /**
	     * @event cellselect
	     * 当单元格被选中时触发。
	     * Fires when a cell is selected.
	     * @param {SelectionModel} this
	     * @param {Number} rowIndex 选中的行索引 The selected row index
	     * @param {Number} colIndex 选中的单元格索引 The selected cell index
	     */
	    "cellselect",
        /**
	     * @event selectionchange
	     * 当已激活的选区改变时触发。
	     * Fires when the active selection changes.
	     * @param {SelectionModel} this
	     * @param {Object} selection null代表没选区而object (o) 则代表有下列两个属性的对象： nullfor no selection or an object (o) with two properties:
	        <ul>
	        <li>o.record: 选区所在的record对象 the record object for the row the selection is in</li>
	        <li>o.cell: [rowIndex, columnIndex]的数组  An array of [rowIndex, columnIndex]</li>
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
        this.grid.getGridEl().on(Ext.isIE || Ext.isSafari3 ? "keydown" : "keypress", this.handleKeyDown, this);
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
     * 返回当前选中的单元格，如[0, 0]。
     * Returns the currently selected cell's row and column indexes as an array (e.g., [0, 0]).
     * @return {Array} 选中的单元格，null就代表没选中。 An array containing the row and column indexes of the selected cell, or null if none selected.
	 */
    getSelectedCell : function(){
        return this.selection ? this.selection.cell : null;
    },

    /**
     * 清除所有选区。 
     * Clears all selections.
     * @param {Boolean} preventNotify true表示改变时不通知gridview。 true to prevent the gridview from being notified about the change.
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
     * 有选区的话返回true。 
     * Returns true if there is a selection.
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
     * Selects a cell.
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