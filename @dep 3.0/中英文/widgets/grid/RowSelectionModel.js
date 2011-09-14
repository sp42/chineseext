/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=90 Ext中文站翻译小组
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
 @class Ext.grid.RowSelectionModel
 * @extends Ext.grid.AbstractSelectionModel
 * {@link Ext.grid.GridPanel}的默认选区模型。它支持多选区和键盘选区/导航。{@link #getSelected}方法返回选中的对象，{@link #getSelections}就是多个已选择的{@link Ext.data.Record Record}（支持多选的）。<br />
 * The default SelectionModel used by {@link Ext.grid.GridPanel}.
 * It supports multiple selections and keyboard selection/navigation. The objects stored
 * as selections and returned by {@link #getSelected}, and {@link #getSelections} are
 * the {@link Ext.data.Record Record}s which provide the data for the selected rows.
 * @constructor
 * @param {Object} config
 */
Ext.grid.RowSelectionModel = function(config){
    Ext.apply(this, config);
    this.selections = new Ext.util.MixedCollection(false, function(o){
        return o.id;
    });

    this.last = false;
    this.lastActive = false;

    this.addEvents(
        /**
	     * @event selectionchange
	     * 当选区改变时触发。
	     * Fires when the selection changes
	     * @param {SelectionModel} this
	     */
	    "selectionchange",
        /**
	     * @event beforerowselect
	     * 当行（row）是选中又被选择触发，返回false取消。
	     * Fires when a row is being selected, return false to cancel.
	     * @param {SelectionModel} this
	     * @param {Number} rowIndex The index to be selected
	     * @param {Boolean} keepExisting 选中的索引。False if other selections will be cleared
	     * @param {Record} record The record to be selected
	     */
	    "beforerowselect",
        /**
	     * @event rowselect
	     * 当行（row）被选中时触发。
	     * Fires when a row is selected.
	     * @param {SelectionModel} this
	     * @param {Number} rowIndex 选中的索引。The selected index
	     * @param {Ext.data.Record} r The selected record
	     */
	    "rowselect",
        /**
	     * @event rowdeselect
	     * 当行（row）反选时触发。
	     * Fires when a row is deselected.
	     * @param {SelectionModel} this
	     * @param {Number} rowIndex 选中的索引。
	     * @param {Record} record 记录
	     */
	    "rowdeselect"
    );

    Ext.grid.RowSelectionModel.superclass.constructor.call(this);
};

Ext.extend(Ext.grid.RowSelectionModel, Ext.grid.AbstractSelectionModel,  {
    /**
     * @cfg {Boolean} singleSelect True表示为同时只能选单行（默认false）。
     * True to allow selection of only one row at a time (defaults to false)
     */
    singleSelect : false,

	/**
	 * @cfg {Boolean} moveEditorOnEnter
	 * False表示禁止按下回车键时就是移动到下一行，shift+回车就是网上移动。
	 * False to turn off moving the editor to the next row down when the enter key is pressed
	 * or the next row up when shift + enter keys are pressed.
	 */
    // private
    initEvents : function(){

        if(!this.grid.enableDragDrop && !this.grid.enableDrag){
            this.grid.on("rowmousedown", this.handleMouseDown, this);
        }else{ // allow click to work like normal
            this.grid.on("rowclick", function(grid, rowIndex, e) {
                if(e.button === 0 && !e.shiftKey && !e.ctrlKey) {
                    this.selectRow(rowIndex, false);
                    grid.view.focusRow(rowIndex);
                }
            }, this);
        }

        this.rowNav = new Ext.KeyNav(this.grid.getGridEl(), {
            "up" : function(e){
                if(!e.shiftKey || this.singleSelect){
                    this.selectPrevious(false);
                }else if(this.last !== false && this.lastActive !== false){
                    var last = this.last;
                    this.selectRange(this.last,  this.lastActive-1);
                    this.grid.getView().focusRow(this.lastActive);
                    if(last !== false){
                        this.last = last;
                    }
                }else{
                    this.selectFirstRow();
                }
            },
            "down" : function(e){
                if(!e.shiftKey || this.singleSelect){
                    this.selectNext(false);
                }else if(this.last !== false && this.lastActive !== false){
                    var last = this.last;
                    this.selectRange(this.last,  this.lastActive+1);
                    this.grid.getView().focusRow(this.lastActive);
                    if(last !== false){
                        this.last = last;
                    }
                }else{
                    this.selectFirstRow();
                }
            },
            scope: this
        });

        var view = this.grid.view;
        view.on("refresh", this.onRefresh, this);
        view.on("rowupdated", this.onRowUpdated, this);
        view.on("rowremoved", this.onRemove, this);
    },

    // private
    onRefresh : function(){
        var ds = this.grid.store, index;
        var s = this.getSelections();
        this.clearSelections(true);
        for(var i = 0, len = s.length; i < len; i++){
            var r = s[i];
            if((index = ds.indexOfId(r.id)) != -1){
                this.selectRow(index, true);
            }
        }
        if(s.length != this.selections.getCount()){
            this.fireEvent("selectionchange", this);
        }
    },

    // private
    onRemove : function(v, index, r){
        if(this.selections.remove(r) !== false){
            this.fireEvent('selectionchange', this);
        }
    },

    // private
    onRowUpdated : function(v, index, r){
        if(this.isSelected(r)){
            v.onRowSelect(index);
        }
    },

    /**
     * 选择多个记录。
     * Select records.
     * @param {Array} records 要选择的record。The records to select
     * @param {Boolean} keepExisting （可选的）true表示为保持当前现有的选区。 (optional)True to keep existing selections
     */
    selectRecords : function(records, keepExisting){
        if(!keepExisting){
            this.clearSelections();
        }
        var ds = this.grid.store;
        for(var i = 0, len = records.length; i < len; i++){
            this.selectRow(ds.indexOf(records[i]), true);
        }
    },

    /**
     * 获取已选择的行数。
     * Gets the number of selected rows.
     * @return {Number}
     */
    getCount : function(){
        return this.selections.length;
    },

    /**
     * 选择GRID的第一行。
     * Selects the first row in the grid.
     */
    selectFirstRow : function(){
        this.selectRow(0);
    },

    /**
     * 选择最后一行。
     * Select the last row.
     * @param {Boolean} keepExisting （可选的）true表示为保持当前现有的选区。(optional) True to keep existing selections
     */
    selectLastRow : function(keepExisting){
        this.selectRow(this.grid.store.getCount() - 1, keepExisting);
    },

    /**
     * 选取上次选取的最后一行。
     * Selects the row immediately following the last selected row.
     * @param {Boolean} keepExisting （可选的）true表示为保持当前现有的选区。(optional)True to keep existing selections
     * @return {Boolean} True if there is a next row, else false
     */
    selectNext : function(keepExisting){
        if(this.hasNext()){
            this.selectRow(this.last+1, keepExisting);
            this.grid.getView().focusRow(this.last);
			return true;
        }
		return false;
    },

    /**
     * 选取上次选取的最前一行。
     * Selects the row that precedes the last selected row.
     * @param {Boolean} keepExisting （可选的）true表示为保持当前现有的选区。(optional)True to keep existing selections
     * @return {Boolean} True表示为有前一行，false表示没有。True if there is a previous row, else false
     */
    selectPrevious : function(keepExisting){
        if(this.hasPrevious()){
            this.selectRow(this.last-1, keepExisting);
            this.grid.getView().focusRow(this.last);
			return true;
        }
		return false;
    },

    /**
     * 若有下一个可选取的记录返回true。
     * Returns true if there is a next record to select
     * @return {Boolean}
     */
    hasNext : function(){
        return this.last !== false && (this.last+1) < this.grid.store.getCount();
    },

    /**
     * 若有前一个可选取的记录返回true。
     * Returns true if there is a previous record to select
     * @return {Boolean}
     */
    hasPrevious : function(){
        return !!this.last;
    },


    /**
     * 返回以选取的纪录。
     * Returns the selected records
     * @return {Array} 已选取记录的数组。Array of selected records
     */
    getSelections : function(){
        return [].concat(this.selections.items);
    },

    /**
     * 返回选区中的第一个记录。
     * Returns the first selected record.
     * @return {Record}
     */
    getSelected : function(){
        return this.selections.itemAt(0);
    },

    /**
     * 对选区执行传入函数。
     * 如果函数返回false，枚举将会中止，each函数就会返回false，否则返回true。
     * Calls the passed function with each selection. If the function returns false, iteration is
     * stopped and this function returns false. Otherwise it returns true.
     * @param {Function} fn
     * @param {Object} scope (optional)
     * @return {Boolean} true表示为已枚举所有的记录。true if all selections were iterated
     */
    each : function(fn, scope){
        var s = this.getSelections();
        for(var i = 0, len = s.length; i < len; i++){
            if(fn.call(scope || this, s[i], i) === false){
                return false;
            }
        }
        return true;
    },

    /**
     * 清除全部的选区。
     * Clears all selections.
     */
    clearSelections : function(fast){
        if(this.isLocked()) return;
        if(fast !== true){
            var ds = this.grid.store;
            var s = this.selections;
            s.each(function(r){
                this.deselectRow(ds.indexOfId(r.id));
            }, this);
            s.clear();
        }else{
            this.selections.clear();
        }
        this.last = false;
    },


    /**
     * 选择所有的行
     * Selects all rows.
     */
    selectAll : function(){
        if(this.isLocked()) return;
        this.selections.clear();
        for(var i = 0, len = this.grid.store.getCount(); i < len; i++){
            this.selectRow(i, true);
        }
    },

    /**
     * 返回True表示有选中。
     * Returns True if there is a selection.
     * @return {Boolean}
     */
    hasSelection : function(){
        return this.selections.length > 0;
    },

    /**
     * 返回True表示有特定的行是被选中的。
     * Returns True if the specified row is selected.
     * @param {Number/Record} record Record对象或Record的id。The record or index of the record to check
     * @return {Boolean}
     */
    isSelected : function(index){
        var r = typeof index == "number" ? this.grid.store.getAt(index) : index;
        return (r && this.selections.key(r.id) ? true : false);
    },

    /**
     * 返回True表示特定的记录是否被选中。
     * Returns True if the specified record id is selected.
     * @param {String} id 要检查的记录id。The id of record to check
     * @return {Boolean}
     */
    isIdSelected : function(id){
        return (this.selections.key(id) ? true : false);
    },

    // private
    handleMouseDown : function(g, rowIndex, e){
        if(e.button !== 0 || this.isLocked()){
            return;
        };
        var view = this.grid.getView();
        if(e.shiftKey && !this.singleSelect && this.last !== false){
            var last = this.last;
            this.selectRange(last, rowIndex, e.ctrlKey);
            this.last = last; // reset the last
            view.focusRow(rowIndex);
        }else{
            var isSelected = this.isSelected(rowIndex);
            if(e.ctrlKey && isSelected){
                this.deselectRow(rowIndex);
            }else if(!isSelected || this.getCount() > 1){
                this.selectRow(rowIndex, e.ctrlKey || e.shiftKey);
                view.focusRow(rowIndex);
            }
        }
    },

    /**
     * 选取多行。
     * Selects multiple rows.
     * @param {Array} rows 要选取行的索引的集合。Array of the indexes of the row to select
     * @param {Boolean} keepExisting （可选的）表示为保持现有的选区。 (optional)True to keep existing selections (defaults to false)
     */
    selectRows : function(rows, keepExisting){
        if(!keepExisting){
            this.clearSelections();
        }
        for(var i = 0, len = rows.length; i < len; i++){
            this.selectRow(rows[i], true);
        }
    },

    /**
     * 选取某个范围内的行（rows）。所有在startRow和endRow之间的行都会被选中。
     * Selects a range of rows. All rows in between startRow and endRow are also selected.
     * @param {Number} startRow 范围内的第一行之索引。The index of the first row in the range
     * @param {Number} endRow 范围内的最后一行之索引。The index of the last row in the range
     * @param {Boolean} keepExisting （可选的）表示为保持现有的选区。 (optional)True to retain existing selections
     */
    selectRange : function(startRow, endRow, keepExisting){
        if(this.isLocked()) return;
        if(!keepExisting){
            this.clearSelections();
        }
        if(startRow <= endRow){
            for(var i = startRow; i <= endRow; i++){
                this.selectRow(i, true);
            }
        }else{
            for(var i = startRow; i >= endRow; i--){
                this.selectRow(i, true);
            }
        }
    },

    /**
     * 反选某个范围内的行（rows）。所有在startRow和endRow之间的行都会被选反。
     * Deselects a range of rows. All rows in between startRow and endRow are also deselected.
     * @param {Number} startRow 范围内的第一行之索引。The index of the first row in the range
     * @param {Number} endRow 范围内的最后一行之索引。The index of the last row in the range
     */
    deselectRange : function(startRow, endRow, preventViewNotify){
        if(this.isLocked()) return;
        for(var i = startRow; i <= endRow; i++){
            this.deselectRow(i, preventViewNotify);
        }
    },

    /**
     * 选择一行。
     * Selects a row.
     * @param {Number} row 要选择行的索引。The index of the row to select
     * @param {Boolean} keepExisting (optional) （可选的）表示为保持现有的选区。True to keep existing selections
     */
    selectRow : function(index, keepExisting, preventViewNotify){
        if(this.isLocked() || (index < 0 || index >= this.grid.store.getCount()) || this.isSelected(index)) return;
        var r = this.grid.store.getAt(index);
        if(r && this.fireEvent("beforerowselect", this, index, keepExisting, r) !== false){
            if(!keepExisting || this.singleSelect){
                this.clearSelections();
            }
            this.selections.add(r);
            this.last = this.lastActive = index;
            if(!preventViewNotify){
                this.grid.getView().onRowSelect(index);
            }
            this.fireEvent("rowselect", this, index, r);
            this.fireEvent("selectionchange", this);
        }
    },

    /**
     * 反选一个行。
     * Deselects a row.
     * @param {Number} row 反选行的索引。The index of the row to deselect
     */
    deselectRow : function(index, preventViewNotify){
        if(this.isLocked()) return;
        if(this.last == index){
            this.last = false;
        }
        if(this.lastActive == index){
            this.lastActive = false;
        }
        var r = this.grid.store.getAt(index);
        if(r){
            this.selections.remove(r);
            if(!preventViewNotify){
                this.grid.getView().onRowDeselect(index);
            }
            this.fireEvent("rowdeselect", this, index, r);
            this.fireEvent("selectionchange", this);
        }
    },

    // private
    restoreLast : function(){
        if(this._last){
            this.last = this._last;
        }
    },

    // private
    acceptsNav : function(row, col, cm){
        return !cm.isHidden(col) && cm.isCellEditable(col, row);
    },

    // private
    onEditorKey : function(field, e){
        var k = e.getKey(), newCell, g = this.grid, ed = g.activeEditor;
        var shift = e.shiftKey;
        if(k == e.TAB){
            e.stopEvent();
            ed.completeEdit();
            if(shift){
                newCell = g.walkCells(ed.row, ed.col-1, -1, this.acceptsNav, this);
            }else{
                newCell = g.walkCells(ed.row, ed.col+1, 1, this.acceptsNav, this);
            }
        }else if(k == e.ENTER){
            e.stopEvent();
            ed.completeEdit();
			if(this.moveEditorOnEnter !== false){
				if(shift){
					newCell = g.walkCells(ed.row - 1, ed.col, -1, this.acceptsNav, this);
				}else{
					newCell = g.walkCells(ed.row + 1, ed.col, 1, this.acceptsNav, this);
				}
			}
        }else if(k == e.ESC){
            ed.cancelEdit();
        }
        if(newCell){
            g.startEditing(newCell[0], newCell[1]);
        }
    }
});