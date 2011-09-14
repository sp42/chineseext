/**
 * @class Ext.grid.ColumnModel
 * @extends Ext.util.Observable
 * Grid的列模型（ColumnModel）的默认实现。该类由列配置组成的数组初始化。
 * <br><br>
 * 不同列的配置对象定义了头部字符串，配合{@link Ext.data.Record}字段列描述了数据的来源，
 * 一个自定义数据格式的渲染函数，并允许通过和配置选项{@link #id}相同名称的CSS样式类来指定某列的样式。<br>
 * <br>用法：<br>
 <pre><code>
 var colModel = new Ext.grid.ColumnModel([
	{header: "Ticker", width: 60, sortable: true},
	{header: "Company Name", width: 150, sortable: true},
	{header: "Market Cap.", width: 100, sortable: true},
	{header: "$ Sales", width: 100, sortable: true, renderer: money},
	{header: "Employees", width: 100, sortable: true, resizable: false}
 ]);
 </code></pre>
 * <p>
 * 该类列出的配置选项也适用于各个列的定义（column definition）。
 * @constructor
 * @param {Object} config 列配置组成的数组，参阅关于本类的配置对象的更多资料。
*/
Ext.grid.ColumnModel = function(config){
	/**
     * 传入配置到构建函数
     * @property {Array} config
     */
     this.setConfig(config, true);
    /**
     * 列不指定宽度时的默认值（默认为100）
     * @type Number
     */
    this.defaultWidth = 100;

    /**
     * 是否默认排序（默认为false）
     * @type Boolean
     */
    this.defaultSortable = false;

    this.addEvents(
         /**
	     * @event widthchange
	     * 当列宽度变动时触发
	     * @param {ColumnModel} this
	     * @param {Number} columnIndex 列索引
	     * @param {Number} newWidth 新宽度
	     */   
	    "widthchange",
        /**
	     * @event headerchange
	     * 当头部文字改变时触发
	     * @param {ColumnModel} this
	     * @param {Number} columnIndex 列索引
	     * @param {Number} newText 新头部文字
	     */
	    "headerchange",
        /**
	     * @event hiddenchange
	     * 当列隐藏或“反隐藏”时触发
	     * @param {ColumnModel} this
	     * @param {Number} columnIndex 列索引
	     * @param {Number} hidden true：隐藏，false：“反隐藏”
	     */
	    "hiddenchange",
	    /**
         * @event columnmoved
         * 当列被移动时触发
         * @param {ColumnModel} this
         * @param {Number} oldIndex
         * @param {Number} newIndex
         */
        "columnmoved",
        // deprecated - to be removed
        "columnlockchange",
        /**
         * @event columlockchange
         * 当列锁定状态被改变时触发
         * @param {ColumnModel} this
         */
        "configchange"
    );
    Ext.grid.ColumnModel.superclass.constructor.call(this);
};
Ext.extend(Ext.grid.ColumnModel, Ext.util.Observable, {
    /**
     * @cfg {String} id (optional) Defaults to the column's initial ordinal position.
     * A name which identifies this column. The id is used to create a CSS class name which
     * is applied to all table cells (including headers) in that column. The class name
     * takes the form of <pre>x-grid3-td-<b>id</b></pre>
     * <br><br>
     * Header cells will also recieve this class name, but will also have the class <pr>x-grid3-hd</pre>,
     * so to target header cells, use CSS selectors such as:<pre>.x-grid3-hd.x-grid3-td-<b>id</b></pre>
     * The {@link Ext.grid.Grid#autoExpandColumn} grid config option references the column
     * via this identifier.
     */
     /**
     * @cfg {String} header 在Grid头部视图中显示的文字。
     */
    /**
     * @cfg {String} dataIndex （可选的）数据索引，相当于Grid记录集（{@link Ext.data.Store}里面的
     * {@link Ext.data.Record} ）中字段名称，字段的值用于展示列里面的值（column's value）。
     * 如不指定，Record的数据列中的索引将作为列的索引。
     */
    /**
     * @cfg {Number} width （可选的）列的初始宽度（像素）。如采用{@link Ext.grid.Grid#autoSizeColumns} 性能较差。
     */
    /**
     * @cfg {Boolean} sortable （可选的）True表示为可在该列上进行排列。默认为true
     * 由{@link Ext.data.Store#remoteSort}指定本地排序抑或是远程排序。
     */
    /**
     * @cfg {Boolean} locked （可选的）True表示当滚动grid时，锁定列在某个位置。默认为false。
     */
    /**
     * @cfg {Boolean} resizable （可选的） False禁止列可变动大小。默认为true。
     */
    /**
     * @cfg {Boolean} hidden （可选的） True表示隐藏列，默认为false
     */
    /**
     * @cfg {Function} renderer （可选的）该函数用于加工单元格的原始数据，转换成为HTML并返回给GridView进一步处理。 参阅{@link #setRenderer}。 
     * 如不指定，则对原始数据值进行默认地渲染。
     */
    /**
     * @cfg {String} align （可选的）设置列的CSS text-align 属性。默认为undefined。
     */
    /**
     * @cfg {Boolean} hideable （可选的）指定<tt>false</tt>可禁止用户隐藏该列。默认为True。 
     */
    /**
     * @cfg {Ext.form.Field} editor （可选的）如果Grid的编辑器支持被打开，这属性指定了用户编辑时所用的编辑器{@link Ext.form.Field}。
     */

    /**
     * 返回指定index列的Id
     * @param {Number} index
     * @return {String} the id
     */
    getColumnId : function(index){
        return this.config[index].id;
    },

    /**
     * 重新配置列模型
     * @param {Array} config 列配置组成的数组
     */
    setConfig : function(config, initial){
        if(!initial){ // cleanup
            delete this.totalWidth;
            for(var i = 0, len = this.config.length; i < len; i++){
                var c = this.config[i];
                if(c.editor){
                    c.editor.destroy();
                }
            }
        }
        this.config = config;
        this.lookup = {};
        // if no id, create one
        for(var i = 0, len = config.length; i < len; i++){
            var c = config[i];
            if(typeof c.renderer == "string"){
                c.renderer = Ext.util.Format[c.renderer];
            }
            if(typeof c.id == "undefined"){
                c.id = i;
            }
            if(c.editor && c.editor.isFormField){
                c.editor = new Ext.grid.GridEditor(c.editor);
            }
            this.lookup[c.id] = c;
        }
        if(!initial){
            this.fireEvent('configchange', this);
        }
    },

    /**
     * 返回指定id的列
     * @param {String} id 列id
     * @return {Object} 列
     */
    getColumnById : function(id){
        return this.lookup[id];
    },

    /**
     * 返回指定列id的索引
     * @param {String} id 列id
     * @return {Number} 索引，-1表示找不到
     */
    getIndexById : function(id){
        for(var i = 0, len = this.config.length; i < len; i++){
            if(this.config[i].id == id){
                return i;
            }
        }
        return -1;
    },

    // private
    moveColumn : function(oldIndex, newIndex){
        var c = this.config[oldIndex];
        this.config.splice(oldIndex, 1);
        this.config.splice(newIndex, 0, c);
        this.dataMap = null;
        this.fireEvent("columnmoved", this, oldIndex, newIndex);
    },

    // deprecated - to be removed
    isLocked : function(colIndex){
        return this.config[colIndex].locked === true;
    },

    // deprecated - to be removed
    setLocked : function(colIndex, value, suppressEvent){
        if(this.isLocked(colIndex) == value){
            return;
        }
        this.config[colIndex].locked = value;
        if(!suppressEvent){
            this.fireEvent("columnlockchange", this, colIndex, value);
        }
    },

    // deprecated - to be removed
    getTotalLockedWidth : function(){
        var totalWidth = 0;
        for(var i = 0; i < this.config.length; i++){
            if(this.isLocked(i) && !this.isHidden(i)){
                this.totalWidth += this.getColumnWidth(i);
            }
        }
        return totalWidth;
    },

    // deprecated - to be removed
    getLockedCount : function(){
        for(var i = 0, len = this.config.length; i < len; i++){
            if(!this.isLocked(i)){
                return i;
            }
        }
    },

    /**
     * 返回列数
     * @return {Number}
     */
    getColumnCount : function(visibleOnly){
        if(visibleOnly === true){
            var c = 0;
            for(var i = 0, len = this.config.length; i < len; i++){
                if(!this.isHidden(i)){
                    c++;
                }
            }
            return c;
        }
        return this.config.length;
    },

    /**
     * 传入一个function类型的参数，这个函数执行时会有(columnConfig, index)的参数，如函数返回true则加入到数组中并返回
     * @param {Function} fn
     * @param {Object} scope （可选的）
     * @return {Array} result
     */
    getColumnsBy : function(fn, scope){
        var r = [];
        for(var i = 0, len = this.config.length; i < len; i++){
            var c = this.config[i];
            if(fn.call(scope||this, c, i) === true){
                r[r.length] = c;
            }
        }
        return r;
    },

    /**
     * 返回指定的列可否排序
     * @param {Number} col 列索引
     * @return {Boolean}
     */
    isSortable : function(col){
        if(typeof this.config[col].sortable == "undefined"){
            return this.defaultSortable;
        }
        return this.config[col].sortable;
    },

    /**
     * 返回对某个列的渲染（格式化）函数
     * @param {Number} col 列索引
     * @return {Function} 用于渲染单元格的那个函数。可参阅 {@link #setRenderer}。
     */
    getRenderer : function(col){
        if(!this.config[col].renderer){
            return Ext.grid.ColumnModel.defaultRenderer;
        }
        return this.config[col].renderer;
    },

    /**
     * Sets the rendering (formatting) function for a column.  See {@link Ext.util.Format} for some 
     * default formatting functions.
     * @param {Number} col The column index
     * @param {Function} fn The function to use to process the cell's raw data
     * to return HTML markup for the grid view. The render function is called with
     * the following parameters:<ul>
     * <li><b>value</b> : Object<p class="sub-desc">The data value for the cell.</p></li>
     * <li><b>metadata</b> : Object<p class="sub-desc">An object in which you may set the following attributes:<ul>
     * <li><b>css</b> : String<p class="sub-desc">A CSS class name to add to the cell's TD element.</p></li>
     * <li><b>attr</b> : String<p class="sub-desc">An HTML attribute definition string to apply to the data container element <i>within</i> the table cell
     * (e.g. 'style="color:red;"').</p></li></ul></p></li>
     * <li><b>record</b> : Ext.data.record<p class="sub-desc">The {@link Ext.data.Record} from which the data was extracted.</p></li>
     * <li><b>rowIndex</b> : Number<p class="sub-desc">Row index</p></li>
     * <li><b>colIndex</b> : Number<p class="sub-desc">Column index</p></li>
     * <li><b>store</b> : Ext.data.Store<p class="sub-desc">The {@link Ext.data.Store} object from which the Record was extracted.</p></li></ul>
     */
    /**
     * 设置对某个列的渲染（格式化formatting）函数
     * @param {Number} col 列索引
     * @param {Function} fn 该函数用于加工单元格的原始数据，转换成为HTML并返回给GridView进一步处理。
     * 这个渲染函数调用时会有下列的参数：<ul>
     * <li><b>value</b> : Object<p class="sub-desc">单元格的数据值</p></li>
     * <li><b>metadata</b> : Object<p class="sub-desc">单元格元数据（Cell metadata）对象。 你也可以设置下列的属性：<ul>
     * <li><b>css</b> : String<p class="sub-desc">单元格CSS样式字符串，作用在td元素上。</p></li>
     * <li><b>attr</b> : String<p class="sub-desc">一段HTML属性的字符串，应用于表格单元格<i>内</i>的数据容器元素（如'style="color:red;"'）</p></li></ul></p></li>
     * <li><b>record</b> : Ext.data.record<p class="sub-desc">从数据中提取的{@link Ext.data.Record}。</p></li>
     * <li><b>rowIndex</b> : Number<p class="sub-desc">行索引</p></li>
     * <li><b>colIndex</b> : Number<p class="sub-desc">列索引</p></li>
     * <li><b>store</b> : Ext.data.Store<p class="sub-desc">{@link Ext.data.Store}从Record中提取的对象。</p></li></ul>
     */	
    setRenderer : function(col, fn){
        this.config[col].renderer = fn;
    },

    /**
     * 返回某个列的宽度
     * @param {Number} col 列索引
     * @return {Number}
     */
    getColumnWidth : function(col){
        return this.config[col].width || this.defaultWidth;
    },

    /**
     * 设置某个列的宽度
     * @param {Number} col 列索引
     * @param {Number} width 新宽度
     */
    setColumnWidth : function(col, width, suppressEvent){
        this.config[col].width = width;
        this.totalWidth = null;
        if(!suppressEvent){
             this.fireEvent("widthchange", this, col, width);
        }
    },
    
    /**
     * 返回所有列宽度之和
     * @param {Boolean} includeHidden True表示为包括隐藏的宽度
     * @return {Number}
     */
    getTotalWidth : function(includeHidden){
        if(!this.totalWidth){
            this.totalWidth = 0;
            for(var i = 0, len = this.config.length; i < len; i++){
                if(includeHidden || !this.isHidden(i)){
                    this.totalWidth += this.getColumnWidth(i);
                }
            }
        }
        return this.totalWidth;
    },

	/**
	 * 返回某个列的头部（header）
	 * @param {Number} col 列索引
	 * @return {String}
	 */
    getColumnHeader : function(col){
        return this.config[col].header;
    },

    /**
     * 设置某个列的头部（header）
     * @param {Number} col 列索引
     * @param {String} header 新头部
     */
    setColumnHeader : function(col, header){
        this.config[col].header = header;
        this.fireEvent("headerchange", this, col, header);
    },
    
    /**
     * 返回某个列的工具提示（tooltip）
     * @param {Number} col 列索引
     * @return {String}
     */
    getColumnTooltip : function(col){
            return this.config[col].tooltip;
    },
    /**
     * 设置某个列的提示文字（tooltip）
     * @param {Number} col 列索引
     * @param {String} tooltip 新tooltip
     */
    setColumnTooltip : function(col, tooltip){
            this.config[col].tooltip = tooltip;
    },

    /**
     * 返回某个列的数据索引
     * @param {Number} col 列索引
     * @return {Number}
     */
    getDataIndex : function(col){
        return this.config[col].dataIndex;
    },

    /**
     * 设置某个列的数据索引
     * @param {Number} col 列索引
     * @param {Number} dataIndex 新数据索引
     */
    setDataIndex : function(col, dataIndex){
        this.config[col].dataIndex = dataIndex;
    },

    findColumnIndex : function(dataIndex){
        var c = this.config;
        for(var i = 0, len = c.length; i < len; i++){
            if(c[i].dataIndex == dataIndex){
                return i;
            }
        }
        return -1;
    },

    /**
     * 返回单元格能否被编辑。
     * @param {Number} colIndex 列索引
     * @param {Number} rowIndex 行索引
     * @return {Boolean}
     */
    isCellEditable : function(colIndex, rowIndex){
        return (this.config[colIndex].editable || (typeof this.config[colIndex].editable == "undefined" && this.config[colIndex].editor)) ? true : false;
    },

    /**
     * 返回单元格/列所定义的编辑器
     * @param {Number} colIndex 列索引
     * @param {Number} rowIndex 行索引
     * @return {Object}
     */
    getCellEditor : function(colIndex, rowIndex){
        return this.config[colIndex].editor;
    },

    /**
     * 设置列是否可编辑的。
     * @param {Number} col 列索引
     * @param {Boolean} editable True表示为列是可编辑的
     */
    setEditable : function(col, editable){
        this.config[col].editable = editable;
    },

    /**
     * 返回true如果列是隐藏的
     * @param {Number} colIndex 列索引
     * @return {Boolean}
     */
    isHidden : function(colIndex){
        return this.config[colIndex].hidden;
    },

    /**
     * 返回true如果列是固定的
     */
    isFixed : function(colIndex){
        return this.config[colIndex].fixed;
    },

    /**
     * 如果列不能调整尺寸返回true
     * @return {Boolean}
     */
    isResizable : function(colIndex){
        return colIndex >= 0 && this.config[colIndex].resizable !== false && this.config[colIndex].fixed !== true;
    },
    /**
     * 设置列隐藏
     * @param {Number} colIndex 列索引
     * @param {Boolean} hidden True表示为列是已隐藏的
     */    
    setHidden : function(colIndex, hidden){
        var c = this.config[colIndex];
        if(c.hidden !== hidden){
            c.hidden = hidden;
            this.totalWidth = null;
            this.fireEvent("hiddenchange", this, colIndex, hidden);
        }
    },

    /**
     * 为列设置编辑器
     * @param {Number} col 列索引
     * @param {Object} editor 编辑器对象
     */
    setEditor : function(col, editor){
        this.config[col].editor = editor;
    }
});

// private
Ext.grid.ColumnModel.defaultRenderer = function(value){
	if(typeof value == "string" && value.length < 1){
	    return "&#160;";
	}
	return value;
};

// Alias for backwards compatibility
Ext.grid.DefaultColumnModel = Ext.grid.ColumnModel;
