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
 * @class Ext.grid.EditorGridPanel
 * @extends Ext.grid.GridPanel
 *          <p>
 *          在GridPanel的基础上扩展的新类用于在指定某些的列可以编辑单元格。 这些可编辑的列取决于{@link Ext.grid.ColumnModel#editor editor}的配置情况。<br />
 *          This class extends the GridPanel to provide cell editing on selected
 *          columns. The editable columns are specified by providing an
 *          {@link Ext.grid.ColumnModel#editor editor} in the column
 *          configuration.
 *          </p>
 *          <p>
 *          你可以在ColumnModel插入一个{@link Ext.grid.ColumnModel#isCellEditable isCellEditable}的实作来控制
 *          某些列是否可以被编辑。 <br />Editability of columns may be controlled programatically
 *          by inserting an implementation of
 *          {@link Ext.grid.ColumnModel#isCellEditable isCellEditable} into your
 *          ColumnModel.
 *          </p>
 *          <p>
 *          正在编辑的是什么的值，就取决于列所指定的{@link Ext.grid.ColumnModel#dataIndex dataIndex}是指向{@link Ext.data.Store Store}里面的什么的值。
 *          （这样的话，如果你使用{@link Ext.grid.ColumnModel#setRenderer renderer（数据重新显示）}）来转换了的数据，那么该项一定要说明清楚。<br />
 *          Editing is performed on the value of the <i>field</i> specified by
 *          the column's {@link Ext.grid.ColumnModel#dataIndex dataIndex} in the
 *          backing {@link Ext.data.Store Store} (so if you are using a
 *          {@link Ext.grid.ColumnModel#setRenderer renderer} in order to
 *          display transformed data, this must be accounted for).
 *          </p>
 *          <p>
 *          如果渲染列的时候，其映射关系是“值为内，说明文本为外”的关系，譬如{Ext.form.Field#ComboBox
 *          ComboBox}的情况， 便是这样{@link Ext.form.Field#valueField value}到{@link Ext.form.Field#displayFieldField description}的关系，
 *          那么就会采用适当的编辑器。<br /> If a value-to-description mapping is used to render a
 *          column, then a {Ext.form.Field#ComboBox ComboBox} which uses the
 *          same {@link Ext.form.Field#valueField value}-to-{@link Ext.form.Field#displayFieldField description}
 *          mapping would be an appropriate editor.
 *          </p>
 *          如果在Grid显示数据的时候有更复杂的情形，与{@link Edt.data.Store Store}不一定对称的话，那么就可以利用
 *          {@link #beforeedit}{@link #afteredit}的事件来转换数据，达成是一致的数据。 <br />If there
 *          is a more complex mismatch between the visible data in the grid, and
 *          the editable data in the {@link Edt.data.Store Store}, then code to
 *          transform the data both before and after editing can be injected
 *          using the {@link #beforeedit} and {@link #afteredit} events.
 * @constructor
 * @param {Object}
 *            config 配置项对象。The config object
 * @xtype editorgrid
 */
Ext.grid.EditorGridPanel = Ext.extend(Ext.grid.GridPanel, {
	/**
	 * @cfg {Number} clicksToEdit
	 *      <p>
	 *      要转换单元格为编辑状态所需的鼠标点击数（默认为两下，即双击）。 The number of clicks on a cell
	 *      required to display the cell's editor (defaults to 2).
	 *      </p>
	 *      <p>
	 *      把该项设置为“auto”表示鼠标移至<i>选中单元格</i>上面就开始编辑的状态。 Setting this option to
	 *      'auto' means that mousedown <i>on the selected cell</i> starts
	 *      editing that cell.
	 *      </p>
	 */
	clicksToEdit : 2,

	/**
	 * @cfg {Boolean} forceValidation True表示即使没有被碰的值过都要去验证（默认为false）。 True to
	 *      force validation even if the value is unmodified (defaults to false)
	 */
	forceValidation : false,

	// private
	isEditor : true,
	// private
	detectEdit : false,

	/**
	 * @cfg {Boolean} autoEncode True表示为对任何值和任何后来输入的值都要自动HTML编码或解码（默认为false）。
	 *      True to automatically HTML encode and decode values pre and post
	 *      edit (defaults to false)
	 */
	autoEncode : false,

	/**
	 * @cfg {Boolean} trackMouseOver
	 * @hide
	 */
	// private
	trackMouseOver : false, // causes very odd FF errors

	// private
	initComponent : function() {
		Ext.grid.EditorGridPanel.superclass.initComponent.call(this);

		if (!this.selModel) {
			/**
			 * @cfg {Object} selModel
			 *      Grid必须需要一个AbstractSelectionModel的子类来为其选区模型提供服务（如不指定则默认为{@link Ext.grid.CellSelectionModel}）。
			 *      注意凡是选区模型必须是兼容单元格选区的模型，要有<tt>getSelectedCell</tt>方法（基于这些原因{@link Ext.grid.RowSelectionModel}就不兼容了）。
			 *      Any subclass of AbstractSelectionModel that will provide the
			 *      selection model for the grid (defaults to
			 *      {@link Ext.grid.CellSelectionModel} if not specified). Note
			 *      that the SelectionModel must be compatible with the model of
			 *      selecting cells individually, and should support a method
			 *      named <tt>getSelectedCell</tt> (for these reasons,
			 *      {@link Ext.grid.RowSelectionModel} is not compatible).
			 */
			this.selModel = new Ext.grid.CellSelectionModel();
		}

		this.activeEditor = null;

		this.addEvents(
				/**
				 * @event beforeedit 当一个单元格被切换到编辑之前触发。编辑的事件对象会有下列的属性： Fires
				 *        before cell editing is triggered. The edit event
				 *        object has the following properties <br />
				 *        <ul style="padding:5px;padding-left:16px;">
				 *        <li>grid - grid本身。This grid</li>
				 *        <li>record - 正在编辑的record。The record being edited</li>
				 *        <li>field - 正在编辑的字段名。The field name being edited</li>
				 *        <li>value - 正在设置的值（value）。The value for the field
				 *        being edited.</li>
				 *        <li>row - grid行索引。The grid row index</li>
				 *        <li>column - grid列索引。The grid column index</li>
				 *        <li>cancel - 由处理函数返回的布尔值，决定true为取消编辑，否则为false。Set
				 *        this to true to cancel the edit or return false from
				 *        your handler.</li>
				 *        </ul>
				 * @param {Object}
				 *            e 一个编辑事件（参见上面的解释）。An edit event (see above for
				 *            description)
				 */
				"beforeedit",
				/**
				 * @event afteredit 当一个单元格被编辑后触发。 Fires after a cell is edited.
				 *        The edit event object has the following properties
				 *        <br />
				 *        <ul style="padding:5px;padding-left:16px;">
				 *        <li>grid - grid本身。This grid</li>
				 *        <li>record - 正在编辑的record。The record being edited</li>
				 *        <li>field - 正在编辑的字段名。The field name being edited</li>
				 *        <li>value - 正在设置的值（value）。The value being set</li>
				 *        <li>originalValue - 在编辑之前的原始值。The original value for
				 *        the field, before the edit.</li>
				 *        <li>row - grid行索引。The grid row index</li>
				 *        <li>column - grid行索引。The grid column index</li>
				 *        </ul>
				 * @param {Object}
				 *            e 一个编辑事件（参见上面的解释）。An edit event (see above for
				 *            description)
				 */
				"afteredit",
				/**
				 * @event validateedit
				 *        编辑单元格后触发，但发生在更改值被设置到record之前。如果返回false即取消更改。
				 *        编辑的事件有以下属性： Fires after a cell is edited, but before
				 *        the value is set in the record. Return false to cancel
				 *        the change. The edit event object has the following
				 *        properties <br />
				 *        <ul style="padding:5px;padding-left:16px;">
				 *        <li>grid - grid本身。This grid</li>
				 *        <li>record - 正在编辑的record。The record being edited</li>
				 *        <li>field - 正在编辑的字段名。The field name being edited</li>
				 *        <li>value - 正在设置的值（value）。The value being set</li>
				 *        <li>originalValue - 在编辑之前的原始值。The original value for
				 *        the field, before the edit.</li>
				 *        <li>row - grid行索引。The grid row index</li>
				 *        <li>column - grid行索引。The grid column index</li>
				 *        <li>cancel - 由处理函数返回的布尔值，决定true为取消编辑，否则为false。Set
				 *        this to true to cancel the edit or return false from
				 *        your handler.</li>
				 *        </ul>
				 * @param {Object}
				 *            e 一个编辑事件（参见上面的解释）。An edit event (see above for
				 *            description)
				 */
				"validateedit");
	},

	// private
	initEvents : function() {
		Ext.grid.EditorGridPanel.superclass.initEvents.call(this);

		this.on("bodyscroll", this.stopEditing, this, [true]);
		this.on("columnresize", this.stopEditing, this, [true]);

		if (this.clicksToEdit == 1) {
			this.on("cellclick", this.onCellDblClick, this);
		} else {
			if (this.clicksToEdit == 'auto' && this.view.mainBody) {
				this.view.mainBody.on("mousedown", this.onAutoEditClick, this);
			}
			this.on("celldblclick", this.onCellDblClick, this);
		}
	},

	// private
	onCellDblClick : function(g, row, col) {
		this.startEditing(row, col);
	},

	// private
	onAutoEditClick : function(e, t) {
		if (e.button !== 0) {
			return;
		}
		var row = this.view.findRowIndex(t);
		var col = this.view.findCellIndex(t);
		if (row !== false && col !== false) {
			this.stopEditing();
			if (this.selModel.getSelectedCell) { // cell sm
				var sc = this.selModel.getSelectedCell();
				if (sc && sc.cell[0] === row && sc.cell[1] === col) {
					this.startEditing(row, col);
				}
			} else {
				if (this.selModel.isSelected(row)) {
					this.startEditing(row, col);
				}
			}
		}
	},

	// private
	onEditComplete : function(ed, value, startValue) {
		this.editing = false;
		this.activeEditor = null;
		ed.un("specialkey", this.selModel.onEditorKey, this.selModel);
		var r = ed.record;
		var field = this.colModel.getDataIndex(ed.col);
		value = this.postEditValue(value, startValue, r, field);
		if (this.forceValidation === true
				|| String(value) !== String(startValue)) {
			var e = {
				grid : this,
				record : r,
				field : field,
				originalValue : startValue,
				value : value,
				row : ed.row,
				column : ed.col,
				cancel : false
			};
			if (this.fireEvent("validateedit", e) !== false && !e.cancel
					&& String(value) !== String(startValue)) {
				r.set(field, e.value);
				delete e.cancel;
				this.fireEvent("afteredit", e);
			}
		}
		this.view.focusCell(ed.row, ed.col);
	},

	/**
	 * 指定的行/列，进行单元格内容的编辑。 Starts editing the specified for the specified
	 * row/column
	 * 
	 * @param {Number}
	 *            rowIndex
	 * @param {Number}
	 *            colIndex
	 */
	startEditing : function(row, col) {
		this.stopEditing();
		if (this.colModel.isCellEditable(col, row)) {
			this.view.ensureVisible(row, col, true);
			var r = this.store.getAt(row);
			var field = this.colModel.getDataIndex(col);
			var e = {
				grid : this,
				record : r,
				field : field,
				value : r.data[field],
				row : row,
				column : col,
				cancel : false
			};
			if (this.fireEvent("beforeedit", e) !== false && !e.cancel) {
				this.editing = true;
				var ed = this.colModel.getCellEditor(col, row);
				if (!ed) {
					return;
				}
				if (!ed.rendered) {
					ed.render(this.view.getEditorParent(ed));
				}
(function		() { // complex but required for focus issues in safari, ie
						// and opera
					ed.row = row;
					ed.col = col;
					ed.record = r;
					ed.on("complete", this.onEditComplete, this, {
								single : true
							});
					ed.on("specialkey", this.selModel.onEditorKey,
							this.selModel);
					/**
					 * 当前活动着的编辑器对象。The currently active editor or null
					 * 
					 * @type Ext.Editor
					 */
					this.activeEditor = ed;
					var v = this.preEditValue(r, field);
					ed.startEdit(this.view.getCell(row, col).firstChild,
							v === undefined ? '' : v);
				}).defer(50, this);
			}
		}
	},

	// private
	preEditValue : function(r, field) {
		var value = r.data[field];
		return this.autoEncode && typeof value == 'string' ? Ext.util.Format
				.htmlDecode(value) : value;
	},

	// private
	postEditValue : function(value, originalValue, r, field) {
		return this.autoEncode && typeof value == 'string' ? Ext.util.Format
				.htmlEncode(value) : value;
	},

	/**
	 * 停止任何激活的行为。 Stops any active editing
	 * 
	 * @param {Boolean}
	 *            cancel （可选的）True撤销更改。(optional) True to cancel any changes
	 */
	stopEditing : function(cancel) {
		if (this.activeEditor) {
			this.activeEditor[cancel === true ? 'cancelEdit' : 'completeEdit']();
		}
		this.activeEditor = null;
	}
});
Ext.reg('editorgrid', Ext.grid.EditorGridPanel);