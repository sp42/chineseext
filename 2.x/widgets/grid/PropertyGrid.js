/**
 * @class Ext.grid.PropertyRecord
 * {@link Ext.grid.PropertyGrid}的一种特定类型，用于表示一对“名称/值”的数据。数据的格式必须是{@link Ext.data.Record}类型。
 * 典型的，属性记录（PropertyRecords）由于能够隐式生成而不需要直接创建，
 * 只需要配置适当的数据配置，即通过 {@link Ext.grid.PropertyGrid#source}的配置属性或是调用 {@link Ext.grid.PropertyGrid#setSource}的方法。
 * 然而，如需要的情况下，这些记录也可以显式创建起来，例子如下：
 * <pre><code>
var rec = new Ext.grid.PropertyRecord({
    name: 'Birthday',
    value: new Date(Date.parse('05/26/1972'))
});
//对当前的grid加入记录
grid.store.addSorted(rec);
</code></pre>
 * @constructor
 * @param {Object} config 数据对象，格式如下： {name: [name], value: [value]}。Grid会自动读取指定值的格式以决定用哪种方式来显示。
 */
Ext.grid.PropertyRecord = Ext.data.Record.create([
    {name:'name',type:'string'}, 'value'
]);

/**
 * @class Ext.grid.PropertyStore
 * @extends Ext.util.Observable
 * 一个属于{@link Ext.grid.PropertyGrid}的{@link Ext.data.Store}的制定包裹器。
 * 该类负责属于grid的自定义数据对象与这个类 {@link Ext.grid.PropertyRecord}本身格式所需store之间的映射，使得两者可兼容一起。
 * 一般情况下不需要直接使用该类－－应该通过属性{@link #store} 从所属的store访问Grid的数据。
 * @constructor
 * @param {Ext.grid.Grid} grid stroe所绑定的grid
 * @param {Object} source 配置项对象数据源
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
        if(val && val instanceof Date){
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
 * 为{@link Ext.grid.PropertyGrid}制定的列模型一般情况下不需要直接使用该类
 * @constructor
 * @param {Ext.grid.Grid} grid stroe所绑定的grid
 * @param {Object} source 配置项对象数据源
 */
Ext.grid.PropertyColumnModel = function(grid, store){
    this.grid = grid;
    var g = Ext.grid;
    g.PropertyColumnModel.superclass.constructor.call(this, [
        {header: this.nameText, width:50, sortable: true, dataIndex:'name', id: 'name'},
        {header: this.valueText, width:50, resizable:false, dataIndex: 'value', id: 'value'}
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
        if(val instanceof Date){
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
        if(val instanceof Date){
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
 * Grid的一种特殊实现，其意义为效仿IDE开发环境中的属性grid。
 * Grid中的每一行表示一些对象当中的属性、数据，以“名称/值”的形式保存在{@link Ext.grid.PropertyRecord}中。举例如下：
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
 * @param {Object} config Grid配置参数
 */
Ext.grid.PropertyGrid = Ext.extend(Ext.grid.EditorGridPanel, {
    /**
    * @cfg {Object} source 数据对象，作为grid的数据源（参阅 {@link #setSource} ）。
    */
    /**
    * @cfg {Object} customEditors An object containing name/value pairs of custom editor type definitions that allow
    * the grid to support additional types of editable fields. 
    * 为了使grid能够支持一些可编辑字段，把这些编辑字段的类型的定义写在这个对象中，
    * 以“名称/值”的形式出现。 缺省下，Grid内置的表单编辑器支持强类型的编辑，如字符串、日期、数字和布尔型，但亦可以将任意的input控件关联到特定的编辑器。	
    * 编辑器的名字应该与属性的名字相一致，例如：
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
    enableColLock:false,
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
             * 当属性值改变时触发。如要取消事件可在这个句柄中返回一个false值（同时会内置调用{@link Ext.data.Record#reject}方法在这个属性的记录上）
             * @param {Object} source grid的数据源对象（与传入到配置属性的{@link #source}对象相一致 ）
             * @param {String} recordId Data store里面的记录id
             * @param {Mixed} value 当前被编辑的属性值
             * @param {Mixed} oldValue 属性原始值
             */
            'beforepropertychange',
            /**
             * @event propertychange
             * 当属性改变之后触发的事件
             * @param {Object} source grid的数据源对象（与传入到配置属性的{@link #source}对象相一致 ）
             * @param {String} recordId Data store里面的记录id
             * @param {Mixed} value 当前被编辑的属性值
             * @param {Mixed} oldValue 属性原始值
             */
            'propertychange'
        );
        this.cm = cm;
        this.ds = store.store;
        Ext.grid.PropertyGrid.superclass.initComponent.call(this);

        this.selModel.on('beforecellselect', function(sm, rowIndex, colIndex){
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
     * 设置包含属性的源数据对象。数据对象包含了一个或一个以上的“名称/值”格式的对象以显示在grid。这些数据也会自动加载到grid的 {@link #store}。如果grid已经包含数据，该方法会替换原有的数据。请参阅{@link #source} 的配置值。举例：
     * <pre><code>
grid.setSource({
    "(name)": "My Object",
    "Created": new Date(Date.parse('10/15/2006')),
    "Available": false,
    "Version": .01,
    "Description": "一个测试对象"
});
</code></pre>
     * @param {Object} source 数据对象
     */
    setSource : function(source){
        this.propStore.setSource(source);
    },

    /**
     * Gets the source data object containing the property data.  Seefor details regarding the
     * format of the data object.
     * 返回包含属性的数据对象源。参阅 {@link #setSource}以了解数据对象的格式
     * @return {Object} 数据对象
     */
    getSource : function(){
        return this.propStore.getSource();
    }
});