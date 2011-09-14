/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://www.extjs.com/license
 */

/**
 @class Ext.grid.RowSelectionModel
 * @extends Ext.grid.AbstractSelectionModel
 * {@link Ext.grid.Grid}默认使用的SelectionModel。支持多个选区和键盘选区/导航 <br><br>
 @constructor
 * @param {Object} config
 */
Ext.grid.RowSelectionModel = function(config){
    Ext.apply(this, config);
    this.selections = new Ext.util.MixedCollection(false, function(o){
        return o.id;
    });

    this.last = false;
    this.lastActive = false;

    this.addEvents({
        /**
	     * @event selectionchange
	     * 当选区改变时触发
	     * @param {SelectionModel} this
	     */
	    "selectionchange" : true,
        /**
	     * @event beforerowselect
	     * 当行（row）是选中又被选择触发，返回false取消。
	     * @param {SelectionModel} this
	     * @param {Number} rowIndex 选中的索引
	     */
	    "beforerowselect" : true,
        /**
	     * @event rowselect
	     * 当行（row）被选中时触发。
	     * @param {SelectionModel} this
	     * @param {Number} rowIndex 选中的索引
	     */
	    "rowselect" : true,
        /**
	     * @event rowdeselect
	     * 当行（row）反选时触发。
	     * @param {SelectionModel} this
	     * @param {Number} rowIndex 选中的索引
	     */
        "rowdeselect" : true
    });

    this.locked = false;
};

Ext.extend(Ext.grid.RowSelectionModel, Ext.grid.AbstractSelectionModel,  {
    /**
     * @cfg {Boolean} singleSelect
     * True：同时只能选单行（默认false）
     */
    singleSelect : false,

    // private
    initEvents : function(){

        if(!this.grid.enableDragDrop && !this.grid.enableDrag){
            this.grid.on("mousedown", this.handleMouseDown, this);
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
                if(!e.shiftKey){
                    this.selectPrevious(e.shiftKey);
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
                if(!e.shiftKey){
                    this.selectNext(e.shiftKey);
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
        var ds = this.grid.dataSource, i, v = this.grid.view;
        var s = this.selections;
        s.each(function(r){
            if((i = ds.indexOfId(r.id)) != -1){
                v.onRowSelect(i);
            }else{
                s.remove(r);
            }
        });
    },

    // private
    onRemove : function(v, index, r){
        this.selections.remove(r);
    },

    // private
    onRowUpdated : function(v, index, r){
        if(this.isSelected(r)){
            v.onRowSelect(index);
        }
    },

    /**
     * 选择多个记录
     * @param {Array} records 要选择的record
     * @param {Boolean} keepExisting (可选的)true表示为保持当前现有的选区
     */
    selectRecords : function(records, keepExisting){
        if(!keepExisting){
            this.clearSelections();
        }
        var ds = this.grid.dataSource;
        for(var i = 0, len = records.length; i < len; i++){
            this.selectRow(ds.indexOf(records[i]), true);
        }
    },

    /**
     * 获取已选择的行数
     * @return {Number}
     */
    getCount : function(){
        return this.selections.length;
    },

    /**
     * 选择GRID的第一行
     */
    selectFirstRow : function(){
        this.selectRow(0);
    },

    /**
     * 选择最后一行
     * @param {Boolean} keepExisting (可选的)true表示为保持当前现有的选区
     */
    selectLastRow : function(keepExisting){
        this.selectRow(this.grid.dataSource.getCount() - 1, keepExisting);
    },

    /**
     * 选取上次选取的最后一行
     * @param {Boolean} keepExisting (可选的)true表示为保持当前现有的选区
     */
    selectNext : function(keepExisting){
        if(this.last !== false && (this.last+1) < this.grid.dataSource.getCount()){
            this.selectRow(this.last+1, keepExisting);
            this.grid.getView().focusRow(this.last);
        }
    },

    /**
     * 选取上次选取的最前一行
     * @param {Boolean} keepExisting (可选的)true表示为保持当前现有的选区
     */
    selectPrevious : function(keepExisting){
        if(this.last){
            this.selectRow(this.last-1, keepExisting);
            this.grid.getView().focusRow(this.last);
        }
    },

   /**
     * 返回选中的记录
     * @return {Array} 选中记录的数组
     */
    getSelections : function(){
        return [].concat(this.selections.items);
    },

    /**
     * 返回第一个选中的记录
     * @return {Record}
     */
    getSelected : function(){
        return this.selections.itemAt(0);
    },


    /**
     * 清楚所有选区
     */rSelections : function(fast){
        if(this.locked) return;
        if(fast !== true){
            var ds = this.grid.dataSource;
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
     * 选择所有行。
     */
    selectAll : function(){
        if(this.locked) return;
        this.selections.clear();
        for(var i = 0, len = this.grid.dataSource.getCount(); i < len; i++){
            this.selectRow(i, true);
        }
    },

    /**
     * 返回true说明这里有选区
     * @return {Boolean}
     */
    hasSelection : function(){
        return this.selections.length > 0;
    },


    /**
     * 返回true说明指定的行被选中
     * @param {Number/Record} record Record record或者是要检查record的索引
     * @return {Boolean}
     */
    isSelected : function(index){
        var r = typeof index == "number" ? this.grid.dataSource.getAt(index) : index;
        return (r && this.selections.key(r.id) ? true : false);
    },

    /**
     * 返回true说明指定的record之id被选中。
     * @param {String} id 检查record的id
     * @return {Boolean}
     */
    isIdSelected : function(id){
        return (this.selections.key(id) ? true : false);
    },

    // private
    handleMouseDown : function(e, t){
        var view = this.grid.getView(), rowIndex;
        if(this.isLocked() || (rowIndex = view.findRowIndex(t)) === false){
            return;
        };
        if(e.shiftKey && this.last !== false){
            var last = this.last;
            this.selectRange(last, rowIndex, e.ctrlKey);
            this.last = last; // reset the last
            view.focusRow(rowIndex);
        }else{
            var isSelected = this.isSelected(rowIndex);
            if(e.button != 0 && isSelected){
                view.focusRow(rowIndex);
            }else if(e.ctrlKey && isSelected){
                this.deselectRow(rowIndex);
            }else{
                this.selectRow(rowIndex, e.button == 0 && (e.ctrlKey || e.shiftKey));
                view.focusRow(rowIndex);
            }
        }
    },

    /**
     * 选取多行。
     * @param {Array} rows 要选取行的Id集合
     * @param {Boolean} keepExisting (可选的)表示为保持现有的选区
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
     * @param {Number} startRow 范围内的第一行之索引
     * @param {Number} endRow 范围内的最后一行之索引
     * @param {Boolean} keepExisting（可选的）表示为保持现有的选区
     */
    selectRange : function(startRow, endRow, keepExisting){
        if(this.locked) return;
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
     * @param {Number} startRow 范围内的第一行之索引
     * @param {Number} endRow 范围内的最后一行之索引
     * @param {Boolean} keepExisting (可选的)true表示为保持现有的选区
     */
    deselectRange : function(startRow, endRow, preventViewNotify){
        if(this.locked) return;
        for(var i = startRow; i <= endRow; i++){
            this.deselectRow(i, preventViewNotify);
        }
    },

    /**
     * 选择一行
     * @param {Number} row 要选择行的index
     * @param {Boolean} keepExisting（可选的）表示为保持现有的选区
     */
    selectRow : function(index, keepExisting, preventViewNotify){
        if(this.locked || (index < 0 || index >= this.grid.dataSource.getCount())) return;
        if(this.fireEvent("beforerowselect", this, index, keepExisting) !== false){
            if(!keepExisting || this.singleSelect){
                this.clearSelections();
            }
            var r = this.grid.dataSource.getAt(index);
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
     * 反选一个行
     * @param {Number} row 反选行的索引
     */
    deselectRow : function(index, preventViewNotify){
        if(this.locked) return;
        if(this.last == index){
            this.last = false;
        }
        if(this.lastActive == index){
            this.lastActive = false;
        }
        var r = this.grid.dataSource.getAt(index);
        this.selections.remove(r);
        if(!preventViewNotify){
            this.grid.getView().onRowDeselect(index);
        }
        this.fireEvent("rowdeselect", this, index);
        this.fireEvent("selectionchange", this);
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
        if(k == e.TAB){
            e.stopEvent();
            ed.completeEdit();
            if(e.shiftKey){
                newCell = g.walkCells(ed.row, ed.col-1, -1, this.acceptsNav, this);
            }else{
                newCell = g.walkCells(ed.row, ed.col+1, 1, this.acceptsNav, this);
            }
        }else if(k == e.ENTER && !e.ctrlKey){
            e.stopEvent();
            ed.completeEdit();
            if(e.shiftKey){
                newCell = g.walkCells(ed.row-1, ed.col, -1, this.acceptsNav, this);
            }else{
                newCell = g.walkCells(ed.row+1, ed.col, 1, this.acceptsNav, this);
            }
        }else if(k == e.ESC){
            ed.cancelEdit();
        }
        if(newCell){
            g.startEditing(newCell[0], newCell[1]);
        }
    }
});