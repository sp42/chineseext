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
 * @class Ext.grid.ColumnModel
 * @extends Ext.util.Observable
 * Grid的列模型（ColumnModel）的默认实现。该类由列配置组成的数组初始化。<br />
 * This is the default implementation of a ColumnModel used by the Grid. This class is initialized with an Array of column config objects.
 * <br>我们用配置对象来定义不同列是怎么显示的，
 * 包括头部（header）的字符串、对当前列是否可排序、对齐方式等的一般设置、当然还有最重要的dataIndex，该配置指定了数据的来源（须配合{@link Ext.data.Record}字段的描述）
 * 另外render也是我们开发者经常要特别设置的，它本质上就是一个自定义数据格式的渲染函数。
 * 这里介绍一个小技巧，就是允许通过和配置选项{@link #id}相同名称的CSS样式类来指定某列的样式。<br />
 * An individual column's config object defines the header string, the {@link Ext.data.Record}
 * field the column draws its data from, an optional rendering function to provide customized
 * data formatting, and the ability to apply a CSS class to all cells in a column through its
 * {@link #id} config option.<br>
 * <br>用法：Usage:<br>
<pre><code>
 var colModel = new Ext.grid.ColumnModel([
    { header: "Ticker", width: 60, sortable: true},
    { header: "Company Name", width: 150, sortable: true},
    { header: "Market Cap.", width: 100, sortable: true},
    { header: "$ Sales", width: 100, sortable: true, renderer: money},
    { header: "Employees", width: 100, sortable: true, resizable: false}
 ]);
 </code></pre>
 * <p>
 * 适用于该类的许多配置项参数也适用于每一个<b>列的定义</b>。
 * 为了让父类能够使用更多的配置项参数，可以将列的参数指定在配置项<tt><b>columns<b><tt>的数组中，如：<br />
 * The config options <b>defined by</b> this class are options which may appear in each
 * individual column definition. In order to use configuration options from the superclass,
 * specify the column configuration Array in the <tt><b>columns<b><tt> config property. eg:<pre><code>
 var colModel = new Ext.grid.ColumnModel({
    listeners: {
        widthchange: function(cm, colIndex, width) {
            saveConfig(colIndex, width);
        }
    },
    columns: [
        { header: "Ticker", width: 60, sortable: true},
        { header: "Company Name", width: 150, sortable: true},
        { header: "Market Cap.", width: 100, sortable: true},
        { header: "$ Sales", width: 100, sortable: true, renderer: money},
        { header: "Employees", width: 100, sortable: true, resizable: false}
     ]
});
 </code></pre>
 * @constructor
 * @param {Object} config 列配置组成的数组，参阅关于本类的配置对象的更多资料。An Array of column config objects. See this class's
 * config objects for details.
*/
Ext.grid.ColumnModel = function(config){
    /**
     * 传入配置到构建函数。
     * The config passed into the constructor
     * @type {Array}
     * @property config
     */
    if(config.columns){
        Ext.apply(this, config);
        this.setConfig(config.columns, true);
    }else{
        this.setConfig(config, true);
    }
    this.addEvents(
        /**
         * @event widthchange
         * 当列宽度变动时触发。
         * Fires when the width of a column changes.
         * @param {ColumnModel} this
         * @param {Number} columnIndex 列索引。The column index
         * @param {Number} newWidth 新宽度。The new width
         */
        "widthchange",
        /**
         * @event headerchange
         * 当头部文字改变时触发。
         * Fires when the text of a header changes.
         * @param {ColumnModel} this
         * @param {Number} columnIndex 列索引。The column index
         * @param {String} newText 新头部文字。The new header text
         */
        "headerchange",
        /**
         * @event hiddenchange
         * 当某一列隐藏或“反隐藏”时触发。
         * Fires when a column is hidden or "unhidden".
         * @param {ColumnModel} this
         * @param {Number} columnIndex 列索引。The column index
         * @param {Boolean} hidden 隐藏，false：“反隐藏”。true if hidden, false otherwise
         */
        "hiddenchange",
        /**
         * @event columnmoved
         * 当列被移动时触发。
         * Fires when a column is moved.
         * @param {ColumnModel} this
         * @param {Number} oldIndex
         * @param {Number} newIndex
         */
        "columnmoved",
        // deprecated - to be removed
        "columnlockchange",
        /**
         * @event configchange
         * 当列锁定状态被改变时触发。
         * Fires when the configuration is changed
         * @param {ColumnModel} this
         */
        "configchange"
    );
    Ext.grid.ColumnModel.superclass.constructor.call(this);
};
Ext.extend(Ext.grid.ColumnModel, Ext.util.Observable, {
    /**
     * 列不指定宽度时的默认值（默认为100）。
     * The width of columns which have no width specified (defaults to 100)
     * @type Number
     * @property defaultWidth
     */
    defaultWidth: 100,
    /**
     * 是否默认排序（默认为false）。只对那些没有指定sortable的有效。
     * Default sortable of columns which have no sortable specified (defaults to false)
     * @type Boolean
     * @property defaultSortable
     */
    defaultSortable: false,
    /**
     * @cfg {String} id （可选的）默认值是按列出现的位置的序号。
     * 这就是该列的标示。该列的所有单元格包括头部都是用这个值来创建CSS class属性。
     * CSS Class产生的格式将是<pre>x-grid3-td-<b>id</b></pre>。
     * (optional) Defaults to the column's initial ordinal position.
     * A name which identifies this column. The id is used to create a CSS class name which
     * is applied to all table cells (including headers) in that column. The class name
     * takes the form of <pre>x-grid3-td-<b>id</b></pre>
     * <br><br>
     * 头部区域也有这个CSS类，但会多出<pr>x-grid3-hd</pre>，因此使用这样的<pre>.x-grid3-hd.x-grid3-td-<b>id</b></pre>
     * CSS选择符就可以找到头部。
     * {@link Ext.grid.GridPanel#autoExpandColumn}也是透过这个id来配置的。
     * Header cells will also recieve this class name, but will also have the class <pr>x-grid3-hd</pre>,
     * so to target header cells, use CSS selectors such as:<pre>.x-grid3-hd.x-grid3-td-<b>id</b></pre>
     * The {@link Ext.grid.GridPanel#autoExpandColumn} grid config option references the column
     * via this identifier.
     */
    /**
     * @cfg {String} header 在Grid头部视图中显示的文字。
     * The header text to display in the Grid view.
     */
    /**
     * @cfg {String} dataIndex （可选的）数据索引，相当于Grid记录集（{@link Ext.data.Store}里面的{@link Ext.data.Record} ）中字段名称，字段的值用于展示列里面的值（column's value）。
     * 如不指定，Record的数据列中的索引将作为列的索引。
	 * (optional) The name of the field in the grid's {@link Ext.data.Store}'s
     * {@link Ext.data.Record} definition from which to draw the column's value. If not
     * specified, the column's index is used as an index into the Record's data Array.
     */
    /**
     * @cfg {Number} width （可选的）列的初始宽度（像素）。如采用{@link Ext.grid.Grid#autoSizeColumns}性能较差。
	 * (optional) The initial width in pixels of the column. This is ignored if the
     * Grid's {@link Ext.grid.GridView view} is configured with {@link Ext.grid.GridView#forceFit forceFit} true.
     */
    /**
     * @cfg {Boolean} sortable （可选的）True表示为可在该列上进行排列。
     * 默认为{@link #defaultSortable}属性的值。
     * 由{@link Ext.data.Store#remoteSort}指定本地排序抑或是远程排序。 
	 * (optional) True if sorting is to be allowed on this column.
     * Defaults to the value of the {@link #defaultSortable} property.
     * Whether local/remote sorting is used is specified in {@link Ext.data.Store#remoteSort}.
     */
    /**
     * @cfg {Boolean} fixed (optional) True表示为列的宽度不能够改变。默认为fasle。
     * True if the column width cannot be changed.  Defaults to false.
     */
    /**
     * @cfg {Boolean} resizable （可选的）False禁止列可变动大小。默认为true。
     * (optional) False to disable column resizing. Defaults to true.
     */
    /**
     * @cfg {Boolean} menuDisabled True表示禁止列菜单。默认为fasle。
     * (optional) True to disable the column menu. Defaults to false.
     */
    /**
     * @cfg {Boolean} hidden (optional) （可选的）True表示隐藏列，默认为false。
     * True to hide the column. Defaults to false.
     */
    /**
     * @cfg {String} tooltip (optional) （可选的）在列头部显示的提示文字。
     * 如果Quicktips的功能有被打开，那么就会用Quicktps来显示，否则就会用HTML的title属性来显示。
     * 默认为""。
     * A text string to use as the column header's tooltip.  If Quicktips are enabled, this
     * value will be used as the text of the quick tip, otherwise it will be set as the header's HTML title attribute.
     * Defaults to ''.
     */
    /**
     * @cfg {Function} renderer （可选的）该函数用于加工单元格的原始数据，转换成为HTML并返回给GridView进一步处理。
     * 请参阅{@link #setRenderer}。如不指定，则对原始数据值进行默认地渲染。
     * (optional) A function used to generate HTML markup for a cell
     * given the cell's data value. See {@link #setRenderer}. If not specified, the
     * default renderer uses the raw data value.
     */
    /**
     * @cfg {String} align （可选的）设置列的CSS text-align属性。默认为undefined。
     * (optional) Set the CSS text-align property of the column.  Defaults to undefined.
     */
    /**
     * @cfg {String} css （可选的）设置表格中全体单元格的CSS样式（包括头部）。默认为undefined。
     * (optional) Set custom CSS for all table cells in the column (excluding headers).  Defaults to undefined.
     */
    /**
     * @cfg {Boolean} hideable （可选的）指定<tt>false</tt>可禁止用户隐藏该列。默认为True。
     * 要全局地禁止Grid中所有列的隐藏性，使用{@link Ext.grid.GridPanel#enableColumnHide}。
	 * (optional) Specify as <tt>false</tt> to prevent the user from hiding this column
     * (defaults to true).  To disallow column hiding globally for all columns in the grid, use
     * {@link Ext.grid.GridPanel#enableColumnHide} instead.
     */
    /**
     * @cfg {Ext.form.Field} editor （可选的）如果Grid的编辑器支持被打开，这属性指定了用户编辑时所用的编辑器{@link Ext.form.Field}。
	 *(optional) The {@link Ext.form.Field} to use when editing values in this column if editing is supported by the grid.
     */
    /**
     * @cfg {Function} groupRenderer 如果Grid是通过{@link Ext.grid.GroupingView}负责渲染的，
     * 那么该配置项将对格式化组字段的值有用，指定一个函数就是这个格式化的函数，告知Grid怎么显示头部的组。这函数应该返回字符串。
     * If the grid is being rendered by an {@link Ext.grid.GroupingView}, this
     * option may be used to specify the function used to format the grouping field value for
     * display in the group header. Should return a string value.
     * <p>
     * 可以有以下的参数:
     * This takes the following parameters:
     * <div class="mdetail-params"><ul>
     * <li><b>v</b> : Object<p class="sub-desc">组字段的新值。The new value of the group field.</p></li>
     * <li><b>unused</b> : undefined<p class="sub-desc">未用的参数。Unused parameter.</p></li>
     * <li><b>r</b> : Ext.data.Record<p class="sub-desc">引发组变动的Record对象。The Record providing the data
     * for the row which caused group change.</p></li>
     * <li><b>rowIndex</b> : Number<p class="sub-desc">引发组变动的Record行索引。The row index of the Record which caused group change.</p></li>
     * <li><b>colIndex</b> : Number<p class="sub-desc">组字段的列索引。The column index of the group field.</p></li>
     * <li><b>ds</b> : Ext.data.Store<p class="sub-desc">提高数据模型的Store对象。The Store which is providing the data Model.</p></li>
     * </ul></div></p>
     */

    /**
     * 返回指定index列的Id。
     * Returns the id of the column at the specified index.
     * @param {Number} index 列索引。The column index
     * @return {String} the id
     */
    getColumnId : function(index){
        return this.config[index].id;
    },

    getColumnAt : function(index){
        return this.config[index];
    },

    /**
     * <p>
     * 重新配置列模型。传入一个数组，就是各个列的配置对象。
     * 要了解各个列的配置说明，请参阅<a href="#Ext.grid.ColumnModel-configs">Config Options</a>。
     * Reconfigures this column model according to the passed Array of column definition objects. For a description of
     * the individual properties of a column definition object, see the <a href="#Ext.grid.ColumnModel-configs">Config Options</a>.</p>
     * <p>
     * 这会引起{@link #configchange}事件的触发。
     * {@link Ext.grid.GridPanel GridPanel}就是靠这个事件来得知其所用的列有变化并自动刷新Grid的UI。
     * Causes the {@link #configchange} event to be fired. A {@link Ext.grid.GridPanel GridPanel} using
     * this ColumnModel will listen for this event and refresh its UI automatically.</p>
     * @param {Array} config 列配置组成的数组。Array of Column definition objects.
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
            if(!c.isColumn){
                var cls = Ext.grid.Column.types[c.xtype || 'gridcolumn'];
                c = new cls(c);
                config[i] = c;
            }
            this.lookup[c.id] = c;
        }
        if(!initial){
            this.fireEvent('configchange', this);
        }
    },

    /**
     * 返回指定id的列。
     * Returns the column for a specified id.
     * @param {String} id 列id。The column id
     * @return {Object} 列。the column
     */
    getColumnById : function(id){
        return this.lookup[id];
    },

    /**
     * 返回指定列id的索引。
     * Returns the index for a specified column id.
     * @param {String} id 列id The column id
     * @return {Number} 索引，-1表示找不到。the index, or -1 if not found
     */
    getIndexById : function(id){
        for(var i = 0, len = this.config.length; i < len; i++){
            if(this.config[i].id == id){
                return i;
            }
        }
        return -1;
    },

    /**
     * 把列从一个位置移到别处。
     * Moves a column from one position to another.
     * @param {Number} oldIndex 移动之前的列索引。The index of the column to move.
     * @param {Number} newIndex 移动之后的列索引。The position at which to reinsert the coolumn.
     */
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
     * 返回列数。 
     * Returns the number of columns.
     * @param {Boolean} visibleOnly （可选的）传入true表示只是包含可见那些的列。Optional. Pass as true to only include visible columns.
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
     * 传入一个function类型的参数，这个函数执行时会有(columnConfig, index)的参数送入其内，如函数返回true则加入到数组中保存并返回数组。
	 * Returns the column configs that return true by the passed function that is called with (columnConfig, index)
     * @param {Function} fn
     * @param {Object} scope （可选的）(optional)
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
     * 返回指定的列可否排序。
     * Returns true if the specified column is sortable.
     * @param {Number} col 列索引。The column index
     * @return {Boolean}
     */
    isSortable : function(col){
        if(typeof this.config[col].sortable == "undefined"){
            return this.defaultSortable;
        }
        return this.config[col].sortable;
    },

    /**
     * 如果列的菜单被禁用的话，返回true。
     * Returns true if the specified column menu is disabled.
     * @param {Number} col 列索引。The column index
     * @return {Boolean}
     */
    isMenuDisabled : function(col){
        return !!this.config[col].menuDisabled;
    },

    /**
     * 返回对某个列的渲染（格式化）函数。
     * Returns the rendering (formatting) function defined for the column.
     * @param {Number} col 列索引。The column index.
     * @return {Function} 用于渲染单元格的那个函数。可参阅{@link #setRenderer}。 The function used to render the cell. See {@link #setRenderer}.
     */
    getRenderer : function(col){
        if(!this.config[col].renderer){
            return Ext.grid.ColumnModel.defaultRenderer;
        }
        return this.config[col].renderer;
    },

    /**
     * 设置对某个列的渲染（格式化formatting）函数
     * Sets the rendering (formatting) function for a column.  See {@link Ext.util.Format} for some
     * default formatting functions.
     * @param {Number} col 列索引。The column index
     * @param {Function} fn 该函数用于加工单元格的原始数据，转换成为HTML并返回给GridView进一步处理。这个渲染函数调用时会有下列的参数：
     * The function to use to process the cell's raw data
     * to return HTML markup for the grid view. The render function is called with
     * the following parameters:<ul>
     * <li><b>value</b> : Object<p class="sub-desc">单元格的数据值。The data value for the cell.</p></li>
     * <li><b>metadata</b> : Object<p class="sub-desc">单元格元数据（Cell metadata）对象。你也可以设置下列的属性：An object in which you may set the following attributes:<ul>
     * <li><b>css</b> : String<p class="sub-desc">单元格CSS样式字符串，作用在td元素上。A CSS class name to add to the cell's TD element.</p></li>
     * <li><b>attr</b> : String<p class="sub-desc">一段HTML属性的字符串，将作用于表格单元格<i>内的</i>数据容器元素（如'style="color:red;"'）。An HTML attribute definition string to apply to the data container element <i>within</i> the table cell
     * (e.g. 'style="color:red;"').</p></li></ul></p></li>
     * <li><b>record</b> : Ext.data.record<p class="sub-desc">从数据中提取的{@link Ext.data.Record}。The {@link Ext.data.Record} from which the data was extracted.</p></li>
     * <li><b>rowIndex</b> : Number<p class="sub-desc">行索引。Row index</p></li>
     * <li><b>colIndex</b> : Number<p class="sub-desc">列索引。Column index</p></li>
     * <li><b>store</b> : Ext.data.Store<p class="sub-desc">从Record中提取的{@link Ext.data.Store}对象。The {@link Ext.data.Store} object from which the Record was extracted.</p></li></ul>
     */
    setRenderer : function(col, fn){
        this.config[col].renderer = fn;
    },

    /**
     * 返回某个列的宽度。 
     * Returns the width for the specified column.
     * @param {Number} col 列索引。The column index
     * @return {Number}
     */
    getColumnWidth : function(col){
        return this.config[col].width || this.defaultWidth;
    },

    /**
     * 设置某个列的宽度。
     * Sets the width for a column.
     * @param {Number} col 列索引。The column index
     * @param {Number} width 新宽度。The new width
     */
    setColumnWidth : function(col, width, suppressEvent){
        this.config[col].width = width;
        this.totalWidth = null;
        if(!suppressEvent){
             this.fireEvent("widthchange", this, col, width);
        }
    },

    /**
     * 返回所有列宽度之和。
     * Returns the total width of all columns.
     * @param {Boolean} includeHidden True表示为包括隐藏的宽度。True to include hidden column widths
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
     * 返回某个列的头部（header）。
     * Returns the header for the specified column.
     * @param {Number} col 列索引。The column index
     * @return {String}
     */
    getColumnHeader : function(col){
        return this.config[col].header;
    },

    /**
     * 设置某个列的头部（header）。
     * Sets the header for a column.
     * @param {Number} col 列索引。The column index
     * @param {String} header 新头部。The new header
     */
    setColumnHeader : function(col, header){
        this.config[col].header = header;
        this.fireEvent("headerchange", this, col, header);
    },

    /**
     * 返回某个列的工具提示（tooltip）。
     * Returns the tooltip for the specified column.
     * @param {Number} col 列索引。The column index
     * @return {String}
     */
    getColumnTooltip : function(col){
            return this.config[col].tooltip;
    },
    /**
     * 设置某个列的提示文字（tooltip）。
     * Sets the tooltip for a column.
     * @param {Number} col 列索引。The column index
     * @param {String} tooltip 新tooltip对象。The new tooltip
     */
    setColumnTooltip : function(col, tooltip){
            this.config[col].tooltip = tooltip;
    },

    /**
     * 返回某个列的数据索引。
     * Returns the dataIndex for the specified column.
     * @param {Number} col 列索引。The column index
     * @return {String} 列的数据索引。The column's dataIndex
     */
    getDataIndex : function(col){
        return this.config[col].dataIndex;
    },

    /**
     * 设置某个列的数据索引。
     * Sets the dataIndex for a column.
     * @param {Number} col 列索引。The column index
     * @param {String} dataIndex 新数据索引。The new dataIndex
     */
    setDataIndex : function(col, dataIndex){
        this.config[col].dataIndex = dataIndex;
    },

    /**
     * 送入数据索引，找到第一个匹配的列。
     * Finds the index of the first matching column for the given dataIndex.
     * @param {String} col dataIndex结果。The dataIndex to find
     * @return {Number} 列索引，如果是-1就表示没找到。The column index, or -1 if no match was found
     */
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
     * 返回true如果列是隐藏的。
     * Returns true if the cell is editable.
     * @param {Number} colIndex 列索引。The column index
     * @param {Number} rowIndex 行索引。The row index
     * @return {Boolean}
     */
    isCellEditable : function(colIndex, rowIndex){
        return (this.config[colIndex].editable || (typeof this.config[colIndex].editable == "undefined" && this.config[colIndex].editor)) ? true : false;
    },

    /**
     * 返回单元格/列所定义的编辑器。
     * Returns the editor defined for the cell/column.
     * @param {Number} colIndex 列索引。The column index
     * @param {Number} rowIndex 行索引。The row index
     * @return {Ext.Editor} 创建一个{@link Ext.Editor Editor}用于{@link Ext.form.Field Field}编辑时所用。
     * The {@link Ext.Editor Editor} that was created to wrap the {@link Ext.form.Field Field} used to edit the cell.
     */
    getCellEditor : function(colIndex, rowIndex){
        return this.config[colIndex].getCellEditor(rowIndex);
    },

    /**
     * 设置列是否可编辑的。
     * Sets if a column is editable.
     * @param {Number} col 列索引。The column index
     * @param {Boolean} editable True表示为列是可编辑的。True if the column is editable
     */
    setEditable : function(col, editable){
        this.config[col].editable = editable;
    },


    /**
     * 如果列是隐藏的则返回true。
     * Returns true if the column is hidden.
     * @param {Number} colIndex 列索引。The column index
     * @return {Boolean}
     */
    isHidden : function(colIndex){
        return this.config[colIndex].hidden;
    },


    /**
     * 如果列是固定的则返回true。
     * Returns true if the column width cannot be changed
     */
    isFixed : function(colIndex){
        return this.config[colIndex].fixed;
    },

    /**
     * 如果列不能调整尺寸返回true。
     * Returns true if the column can be resized
     * @return {Boolean}
     */
    isResizable : function(colIndex){
        return colIndex >= 0 && this.config[colIndex].resizable !== false && this.config[colIndex].fixed !== true;
    },
    /**
     * 设置列隐藏。
     * Sets if a column is hidden.
     * @param {Number} colIndex 列索引。The column index
     * @param {Boolean} hidden True表示为列是已隐藏的。True if the column is hidden
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
     * 为列设置编辑器。
     * Sets the editor for a column.
     * @param {Number} col 列索引。The column index
     * @param {Object} editor 编辑器对象。The editor object
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