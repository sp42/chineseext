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
 * @class Ext.grid.PropertyRecord
 * {@link Ext.grid.PropertyGrid}的一种特定类型，用于表示一对“名称/值”的数据。数据的格式必须是{@link Ext.data.Record}类型。
 * 典型状态下，属性记录（PropertyRecords）由于能够隐式生成而不需要直接创建，
 * 只需要配置适当的数据配置，即通过 {@link Ext.grid.PropertyGrid#source}的配置属性或是调用{@link Ext.grid.PropertyGrid#setSource}的方法。
 * 然而在如需要的情况下，这些记录也可以显式创建起来，例子如下：<br />
 * A specific {@link Ext.data.Record} type that represents a name/value pair and is made to work with the
 * {@link Ext.grid.PropertyGrid}.  Typically, PropertyRecords do not need to be created directly as they can be
 * created implicitly by simply using the appropriate data configs either via the {@link Ext.grid.PropertyGrid#source}
 * config property or by calling {@link Ext.grid.PropertyGrid#setSource}.  However, if the need arises, these records
 * can also be created explicitly as shwon below.  Example usage:
 * <pre><code>
var rec = new Ext.grid.PropertyRecord({
    name: 'Birthday',
    value: new Date(Date.parse('05/26/1972'))
});
// 对当前的grid加入记录 Add record to an already populated grid
grid.store.addSorted(rec);
</code></pre>
 * @constructor
 * @param {Object} config 数据对象，格式如下：{name: [name], value: [value]}。
 * Grid会自动读取指定值的格式以决定用哪种方式来显示。
 * A data object in the format: {name: [name], value: [value]}.  The specified value's type
 * will be read automatically by the grid to determine the type of editor to use when displaying it.
 */
Ext.grid.PropertyRecord = Ext.data.Record.create([
    {name:'name',type:'string'}, 'value'
]);

/**
 * @class Ext.grid.PropertyStore
 * @extends Ext.util.Observable
 * 一个属于{@link Ext.grid.PropertyGrid}的{@link Ext.data.Store}的制定包裹器（custom wrapper）。
 * 该类负责属于grid的自定义数据对象与这个类 {@link Ext.grid.PropertyRecord}本身格式所需store之间的映射，使得两者可兼容一起。
 * 一般情况下不需要直接使用该类——应该通过属性{@link #store}从所属的store访问Grid的数据。
 * A custom wrapper for the {@link Ext.grid.PropertyGrid}'s {@link Ext.data.Store}. This class handles the mapping
 * between the custom data source objects supported by the grid and the {@link Ext.grid.PropertyRecord} format
 * required for compatibility with the underlying store. Generally this class should not need to be used directly --
 * the grid's data should be accessed from the underlying store via the {@link #store} property.
 * @constructor
 * @param {Ext.grid.Grid} grid stroe所绑定的grid。The grid this store will be bound to
 * @param {Object} source 配置项对象数据源。The source data config object
 */
Ext.grid.PropertyStore = function(grid, source){
    this.grid = grid;
    this.store = new Ext.data.Store({
        recordType : Ext.grid.PropertyRecord
    });
    this.store.on('update', this.onUpdate,  this);
    if(source){
        this.setSource(source);
    }
    Ext.grid.PropertyStore.superclass.constructor.call(this);
};
Ext.extend(Ext.grid.PropertyStore, Ext.util.Observable, {
    // protected - should only be called by the grid.  Use grid.setSource instead.
    setSource : function(o){
        this.source = o;
        this.store.removeAll();
        var data = [];
        for(var k in o){
            if(this.isEditableValue(o[k])){
                data.push(new Ext.grid.PropertyRecord({name: k, value: o[k]}, k));
            }
        }
        this.store.loadRecords({records: data}, {}, true);
    },

    // private
    onUpdate : function(ds, record, type){
        if(type == Ext.data.Record.EDIT){
            var v = record.data['value'];
            var oldValue = record.modified['value'];
            if(this.grid.fireEvent('beforepropertychange', this.source, record.id, v, oldValue) !== false){
                this.source[record.id] = v;
                record.commit();
                this.grid.fireEvent('propertychange', this.source, record.id, v, oldValue);
            }else{
                record.reject();
            }
        }
    },

    // private
    getProperty : function(row){
       return this.store.getAt(row);
    },

    // private
    isEditableValue: function(val){
        if(Ext.isDate(val)){
            return true;
        }else if(typeof val == 'object' || typeof val == 'function'){
            return false;
        }
        return true;
    },

    // private
    setValue : function(prop, value){
        this.source[prop] = value;
        this.store.getById(prop).set('value', value);
    },

    // protected - should only be called by the grid.  Use grid.getSource instead.
    getSource : function(){
        return this.source;
    }
});

/**
 * @class Ext.grid.PropertyColumnModel
 * @extends Ext.grid.ColumnModel
 * 为{@link Ext.grid.PropertyGrid}制定的列模型。一般情况下不需要直接使用该类。
 * A custom column model for the {@link Ext.grid.PropertyGrid}.Generally it should not need to be used directly.
 * @constructor
 * @param {Ext.grid.Grid} grid stroe所绑定的grid。The grid this store will be bound to
 * @param {Object} source 配置项对象数据源。The source data config object
 */
Ext.grid.PropertyColumnModel = function(grid, store){
    this.grid = grid;
    var g = Ext.grid;
    g.PropertyColumnModel.superclass.constructor.call(this, [
        {header: this.nameText, width:50, sortable: true, dataIndex:'name', id: 'name', menuDisabled:true},
        {header: this.valueText, width:50, resizable:false, dataIndex: 'value', id: 'value', menuDisabled:true}
    ]);
    this.store = store;
    this.bselect = Ext.DomHelper.append(document.body, {
        tag: 'select', cls: 'x-grid-editor x-hide-display', children: [
            {tag: 'option', value: 'true', html: 'true'},
            {tag: 'option', value: 'false', html: 'false'}
        ]
    });
    var f = Ext.form;

    var bfield = new f.Field({
        el:this.bselect,
        bselect : this.bselect,
        autoShow: true,
        getValue : function(){
            return this.bselect.value == 'true';
        }
    });
    this.editors = {
        'date' : new g.GridEditor(new f.DateField({selectOnFocus:true})),
        'string' : new g.GridEditor(new f.TextField({selectOnFocus:true})),
        'number' : new g.GridEditor(new f.NumberField({selectOnFocus:true, style:'text-align:left;'})),
        'boolean' : new g.GridEditor(bfield)
    };
    this.renderCellDelegate = this.renderCell.createDelegate(this);
    this.renderPropDelegate = this.renderProp.createDelegate(this);
};

Ext.extend(Ext.grid.PropertyColumnModel, Ext.grid.ColumnModel, {
    // private - strings used for locale support
    nameText : 'Name',
    valueText : 'Value',
    dateFormat : 'm/j/Y',

    // private
    renderDate : function(dateVal){
        return dateVal.dateFormat(this.dateFormat);
    },

    // private
    renderBool : function(bVal){
        return bVal ? 'true' : 'false';
    },

    // private
    isCellEditable : function(colIndex, rowIndex){
        return colIndex == 1;
    },

    // private
    getRenderer : function(col){
        return col == 1 ?
            this.renderCellDelegate : this.renderPropDelegate;
    },

    // private
    renderProp : function(v){
        return this.getPropertyName(v);
    },

    // private
    renderCell : function(val){
        var rv = val;
        if(Ext.isDate(val)){
            rv = this.renderDate(val);
        }else if(typeof val == 'boolean'){
            rv = this.renderBool(val);
        }
        return Ext.util.Format.htmlEncode(rv);
    },

    // private
    getPropertyName : function(name){
        var pn = this.grid.propertyNames;
        return pn && pn[name] ? pn[name] : name;
    },

    // private
    getCellEditor : function(colIndex, rowIndex){
        var p = this.store.getProperty(rowIndex);
        var n = p.data['name'], val = p.data['value'];
        if(this.grid.customEditors[n]){
            return this.grid.customEditors[n];
        }
        if(Ext.isDate(val)){
            return this.editors['date'];
        }else if(typeof val == 'number'){
            return this.editors['number'];
        }else if(typeof val == 'boolean'){
            return this.editors['boolean'];
        }else{
            return this.editors['string'];
        }
    }
});

/**
 * @class Ext.grid.PropertyGrid
 * @extends Ext.grid.EditorGridPanel
 * Grid的一种特殊形式的实现，大体情形类似于IDE开发环境中的属性grid。
 * Grid中的每一行表示一些对象当中的属性、数据，以“名称/值”的形式保存在{@link Ext.grid.PropertyRecord}中。举例如下：
 * A specialized grid implementation intended to mimic the traditional property grid as typically seen in
 * development IDEs.  Each row in the grid represents a property of some object, and the data is stored
 * as a set of name/value pairs in {@link Ext.grid.PropertyRecord}s.  Example usage:
 * <pre><code>
var grid = new Ext.grid.PropertyGrid({
    title: 'Properties Grid',
    autoHeight: true,
    width: 300,
    renderTo: 'grid-ct',
    source: {
        "(name)": "My Object",
        "Created": new Date(Date.parse('10/15/2006')),
        "Available": false,
        "Version": .01,
        "Description": "A test object"
    }
});
</pre></code>
 * @constructor
 * @param {Object} config Grid配置参数。The grid config object
 */
Ext.grid.PropertyGrid = Ext.extend(Ext.grid.EditorGridPanel, {
    /**
    * @cfg {Object} propertyNames 
    * 包含“名称（键值）/显示名称”的结对对象。
    * 如指定，将用“显示名称”以代替直接显示属性名称（即键值名称）。
    * An object containing property name/display name pairs.
    * If specified, the display name will be shown in the name column instead of the property name.
    */
    /**
    * @cfg {Object} source 数据对象，作为grid的数据源（参阅{@link #setSource}）。
    * A data object to use as the data source of the grid (see {@link #setSource} for details).
    */
    /**
    * @cfg {Object} customEditors 为了使grid能够支持一些可编辑字段，把这些编辑字段的类型的定义写在这个对象中，它以“名称/值”的形式出现。
    * 缺省下，Grid内置的表单编辑器支持强类型的编辑，如字符串、日期、数字和布尔型，但亦可以将任意的input控件关联到特定的编辑器。	
    * 编辑器的名字应该与属性的名字相一致，例如：
    * An object containing name/value pairs of custom editor type definitions that allow
    * the grid to support additional types of editable fields.  By default, the grid supports strongly-typed editing
    * of strings, dates, numbers and booleans using built-in form editors, but any custom type can be supported and
    * associated with a custom input control by specifying a custom editor.  The name of the editor
    * type should correspond with the name of the property that will use the editor.  Example usage:
    * <pre><code>
var grid = new Ext.grid.PropertyGrid({
    ...
    customEditors: {
        'Start Time': new Ext.grid.GridEditor(new Ext.form.TimeField({selectOnFocus:true}))
    },
    source: {
        'Start Time': '10:00 AM'
    }
});
</code></pre>
    */

    // private config overrides
    enableColumnMove:false,
    stripeRows:false,
    trackMouseOver: false,
    clicksToEdit:1,
    enableHdMenu : false,
    viewConfig : {
        forceFit:true
    },

    // private
    initComponent : function(){
        this.customEditors = this.customEditors || {};
        this.lastEditRow = null;
        var store = new Ext.grid.PropertyStore(this);
        this.propStore = store;
        var cm = new Ext.grid.PropertyColumnModel(this, store);
        store.store.sort('name', 'ASC');
        this.addEvents(
            /**
             * @event beforepropertychange
             * 当属性值改变时触发。如要取消事件可在这个句柄中返回一个false值（同时会内置调用{@link Ext.data.Record#reject}方法在这个属性的记录上）。
			 * Fires before a property value changes.  Handlers can return false to cancel the property change
             * (this will internally call {@link Ext.data.Record#reject} on the property's record).
             * @param {Object} source grid的数据源对象（与传入到配置属性的{@link #source}对象相一致）。 
			 * The source data object for the grid (corresponds to the same object passed in
             * as the {@link #source} config property).
             * @param {String} recordId Data store里面的记录id。The record's id in the data store
             * @param {Mixed} value 当前被编辑的属性值。The current edited property value
             * @param {Mixed} oldValue 属性原始值。The original property value prior to editing
             */
            'beforepropertychange',
            /**
             * @event propertychange
             * 当属性改变之后触发的事件。
             * Fires after a property value has changed.
             * @param {Object} source grid的数据源对象（与传入到配置属性的{@link #source}对象相一致）。The source data object for the grid (corresponds to the same object passed in
             * as the {@link #source} config property).
             * @param {String} recordId Data store里面的记录id。 The record's id in the data store
             * @param {Mixed} value 当前被编辑的属性值。The current edited property value
             * @param {Mixed} oldValue 属性原始值。The original property value prior to editing
             */
            'propertychange'
        );
        this.cm = cm;
        this.ds = store.store;
        Ext.grid.PropertyGrid.superclass.initComponent.call(this);

		this.mon(this.selModel, 'beforecellselect', function(sm, rowIndex, colIndex){
            if(colIndex === 0){
                this.startEditing.defer(200, this, [rowIndex, 1]);
                return false;
            }
        }, this);
    },

    // private
    onRender : function(){
        Ext.grid.PropertyGrid.superclass.onRender.apply(this, arguments);

        this.getGridEl().addClass('x-props-grid');
    },

    // private
    afterRender: function(){
        Ext.grid.PropertyGrid.superclass.afterRender.apply(this, arguments);
        if(this.source){
            this.setSource(this.source);
        }
    },

    /**
	 * 设置包含属性的源数据对象。数据对象包含了一个或一个以上的“名称/值”格式的对象以显示在grid。
	 * 这些数据也会自动加载到grid的{@link #store}。
	 * 如果grid已经包含数据，该方法会替换原有Grid的数据。请参阅{@link #source}的配置值。举例：
     * Sets the source data object containing the property data.  The data object can contain one or more name/value
     * pairs representing all of the properties of an object to display in the grid, and this data will automatically
     * be loaded into the grid's {@link #store}.  The values should be supplied in the proper data type if needed,
     * otherwise string type will be assumed.  If the grid already contains data, this method will replace any
     * existing data.  See also the {@link #source} config value.  Example usage:
     * <pre><code>
grid.setSource({
    "(name)": "My Object",
    "Created": new Date(Date.parse('10/15/2006')),  // 日期类型 date type
    "Available": false,  // 布尔类型 boolean type
    "Version": .01,      // 小数类型 decimal type
    "Description": "一个测试对象  A test object"
});
</code></pre>
     * @param {Object} source 数据对象。The data object
     */
    setSource : function(source){
        this.propStore.setSource(source);
    },

    /**
	 * 返回包含属性的数据对象源。请参阅{@link #setSource}以了解数据对象的格式。
     * Gets the source data object containing the property data. See {@link #setSource} for details regarding the
     * format of the data object.
     * @return {Object} 数据对象 The data object
     */
    getSource : function(){
        return this.propStore.getSource();
    }
});
Ext.reg("propertygrid", Ext.grid.PropertyGrid);
