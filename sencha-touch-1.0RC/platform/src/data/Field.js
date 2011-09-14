/*
 * @version Sencha 0.98
 * @ignore
 * @todo
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */
/**
 * @author Ed Spencer
 * @class Ext.data.Field
 * @extends Object
 * 
 * <p>
 * 该类封装了字段信息，用于{@link Ext.regModel}方法中的字段定义对象所用。 
 * <br />
 * This class encapsulates the field definition information specified in the field definition objects
 * passed to {@link Ext.regModel}.</p>
 * 
 * <p>
 * 开发者一般不需要实例化这该类。{@link Ext.regModel}一般会创建实例，并且在Model构建器的原型中定义设置Field，进而达到缓存之目的。
 * <br />
 * Developers do not need to instantiate this class. Instances are created by {@link Ext.regModel}
 * and cached in the {@link Ext.data.Model#fields fields} property of the created Model constructor's <b>prototype.</b></p>
 */
Ext.data.Field = Ext.extend(Object, {
    
    constructor : function(config) {
        if (Ext.isString(config)) {
            config = {name: config};
        }
        Ext.apply(this, config);
        
        var types = Ext.data.Types,
            st = this.sortType,
            t;

        if (this.type) {
            if (Ext.isString(this.type)) {
                this.type = types[this.type.toUpperCase()] || types.AUTO;
            }
        } else {
            this.type = types.AUTO;
        }

        // named sortTypes are supported, here we look them up
        if (Ext.isString(st)) {
            this.sortType = Ext.data.SortTypes[st];
        } else if(Ext.isEmpty(st)) {
            this.sortType = this.type.sortType;
        }

        if (!this.convert) {
            this.convert = this.type.convert;
        }
    },
    
    /**
     * @cfg {String} name
     * Record对象所引用的字段名称。通常是一标识作它者引用，
     * 例如，在列定义中，该值会作为{@link Ext.grid.ColumnModel}的<em>dataIndex</em>属性。
     * <p>注意，字段定义中，其他不需要其他字段，但最起码得有name项。</p>
     * The name by which the field is referenced within the Record. This is referenced by, for example,
     * the <code>dataIndex</code> property in column definition objects passed to {@link Ext.grid.ColumnModel}.
     * <p>Note: In the simplest case, if no properties other than <code>name</code> are required, a field
     * definition may consist of just a String for the field name.</p>
     */
    /**
     * @cfg {Mixed} type
     * （可选的） 指明数据类型，转化为可显示的值。有效值是：
     * (Optional) The data type for automatic conversion from received data to the <i>stored</i> value if <code>{@link Ext.data.Field#convert convert}</code>
     * has not been specified. This may be specified as a string value. Possible values are
     * <div class="mdetail-params"><ul>
     * <li>auto (auto是默认的，不声明就用auto。不作转换Default, implies no conversion)</li>
     * <li>string</li>
     * <li>int</li>
     * <li>float</li>
     * <li>boolean</li>
     * <li>date</li></ul></div>
     * <p>This may also be specified by referencing a member of the {@link Ext.data.Types} class.</p>
     * <p>Developers may create their own application-specific data types by defining new members of the
     * {@link Ext.data.Types} class.</p>
     */
    /**
     * @cfg {Function} convert
     * （可选的） 由Reader提供的用于转换值的函数，将值变为Record下面的对象。它会送入以下的参数：
     * (Optional) A function which converts the value provided by the Reader into an object that will be stored
     * in the Record. It is passed the following parameters:<div class="mdetail-params"><ul>
     * <li><b>v</b> : Mixed<div class="sub-desc">数据值，和Reader读取的一样。The data value as read by the Reader, if undefined will use
     * the configured <code>{@link Ext.data.Field#defaultValue defaultValue}</code>.</div></li>
     * <li><b>rec</b> : Mixed<div class="sub-desc">包含行的数据对象，和Reader读取的一样。
 	 * 这可以是数组，对象，XML元素对象，这取决于{@link Ext.data.XMLReader XMLReader}对象的类型。
 	 * The data object containing the row as read by the Reader.
     * Depending on the Reader type, this could be an Array ({@link Ext.data.ArrayReader ArrayReader}), an object
     *  ({@link Ext.data.JsonReader JsonReader}), or an XML element ({@link Ext.data.XMLReader XMLReader}).</div></li>
     * </ul></div>
     * <pre><code>
// example of convert function
function fullName(v, record){
    return record.name.last + ', ' + record.name.first;
}

function location(v, record){
    return !record.city ? '' : (record.city + ', ' + record.state);
}

var Dude = Ext.data.Record.create([
    {name: 'fullname',  convert: fullName},
    {name: 'firstname', mapping: 'name.first'},
    {name: 'lastname',  mapping: 'name.last'},
    {name: 'city', defaultValue: 'homeless'},
    'state',
    {name: 'location',  convert: location}
]);

// create the data store
var store = new Ext.data.Store({
    reader: new Ext.data.JsonReader(
        {
            idProperty: 'key',
            root: 'daRoot',
            totalProperty: 'total'
        },
        Dude  // recordType
    )
});

var myData = [
    { key: 1,
      name: { first: 'Fat',    last:  'Albert' }
      // notice no city, state provided in data object
    },
    { key: 2,
      name: { first: 'Barney', last:  'Rubble' },
      city: 'Bedrock', state: 'Stoneridge'
    },
    { key: 3,
      name: { first: 'Cliff',  last:  'Claven' },
      city: 'Boston',  state: 'MA'
    }
];
     * </code></pre>
     */
    /**
     * @cfg {String} dateFormat
     * <p>（可选的） 字符串格式的{@link Date#parseDate Date.parseDate}函数，或“timestamp”表示Reader读取UNIX格式的timestamp，或“time”是Reader读取的是javascript毫秒的timestamp。
     * (Optional) Used when converting received data into a Date when the {@link #type} is specified as <code>"date"</code>.</p>
     * <p>A format string for the {@link Date#parseDate Date.parseDate} function, or "timestamp" if the
     * value provided by the Reader is a UNIX timestamp, or "time" if the value provided by the Reader is a
     * javascript millisecond timestamp. See {@link Date}</p>
     */
    dateFormat: null,
    
    /**
     * @cfg {Boolean} useNull
     * <p>(Optional) Use when converting received data into a Number type (either int or float). If the value cannot be parsed,
     * null will be used if useNull is true, otherwise the value will be 0. Defaults to <tt>false</tt>
     */
    useNull: false,
    
    /**
     * @cfg {Mixed} defaultValue
     * 当经过{@link Ext.data.Reader Reader}创建Record时会使用该值；</b> 当<b><tt>mapping</tt></b>的引用项不存在的时候，典型的情况为undefined时候会使用该值（默认为''）。
     * (Optional) The default value used <b>when a Record is being created by a {@link Ext.data.Reader Reader}</b>
     * when the item referenced by the <code>{@link Ext.data.Field#mapping mapping}</code> does not exist in the data
     * object (i.e. undefined). (defaults to "")
     */
    defaultValue: "",
    /**
     * @cfg {String/Number} mapping
     * <p>
	 * （可选的） 如果使用的是{@link Ext.data.DataReader}，这是一个Reader能够获取数据对象的数组值创建到{@link Ext.data.Record Record}对象下面的对应的映射项；
     * (Optional) A path expression for use by the {@link Ext.data.DataReader} implementation
     * that is creating the {@link Ext.data.Record Record} to extract the Field value from the data object.
     * If the path expression is the same as the field name, the mapping may be omitted.</p>
     * 
     * <p>The form of the mapping expression depends on the Reader being used.</p>
     * <div class="mdetail-params"><ul>
     * <li>
     * 如果使用的是{@link Ext.data.JsonReader}，那么这是一个javascript表达式的字符串，能够获取数据的引用到Record对象的下面；
     * {@link Ext.data.JsonReader}<div class="sub-desc">The mapping is a string containing the javascript
     * expression to reference the data from an element of the data item's {@link Ext.data.JsonReader#root root} Array. Defaults to the field name.</div></li>
     * 
     * <li>如果使用的是{@link Ext.data.XmlReader}，这是一个{@link Ext.DomQuery}路径，能够获取数据元素的引用到{@link Ext.data.XmlReader#record record}对象的下面；默认是字段名称。
     * {@link Ext.data.XmlReader}<div class="sub-desc">The mapping is an {@link Ext.DomQuery} path to the data
     * item relative to the DOM element that represents the {@link Ext.data.XmlReader#record record}. Defaults to the field name.</div></li>
     * <li>
     * 如果映射名与字段名都是相同的，那么映射名可以省略。
     * {@link Ext.data.ArrayReader}<div class="sub-desc">The mapping is a number indicating the Array index
     * of the field's value. Defaults to the field specification's Array position.</div></li>
     * </ul></div>
     * <p>If a more complex value extraction strategy is required, then configure the Field with a {@link #convert}
     * function. This is passed the whole row object, and may interrogate it in whatever way is necessary in order to
     * return the desired data.</p>
     */
    mapping: null,
    /**
     * @cfg {Function} sortType
     * 按照既定的排序而设的函数。在这个函数中，将Field的值转换为可比较的数值。
     * 预定义的函数储存在{@link Ext.data.SortTypes}。自定义的例子如下：
     * (Optional) A function which converts a Field's value to a comparable value in order to ensure
     * correct sort ordering. Predefined functions are provided in {@link Ext.data.SortTypes}. A custom
     * sort example:<pre><code>
// current sort     after sort we want
// +-+------+          +-+------+
// |1|First |          |1|First |
// |2|Last  |          |3|Second|
// |3|Second|          |2|Last  |
// +-+------+          +-+------+

sortType: function(value) {
   switch (value.toLowerCase()) // native toLowerCase():
   {
      case 'first': return 1;
      case 'second': return 2;
      default: return 3;
   }
}
     * </code></pre>
     */
    sortType : null,
    /**
     * @cfg {String} sortDir
     * （可选的） 初始化的排序方向，“ASC”或“DESC”。默认为code>"ASC"</code>。
     * (Optional) Initial direction to sort (<code>"ASC"</code> or  <code>"DESC"</code>).  Defaults to
     * <code>"ASC"</code>.
     */
    sortDir : "ASC",
    /**
     * @cfg {Boolean} allowBlank
     * （可选的）用于验证{@link Ext.data.Record record}，默认为<code>true</code>。若空值的话会引起{@link Ext.data.Record}.{@link Ext.data.Record#isValid isValid}视其为<code>false</code>。
     * (Optional) Used for validating a {@link Ext.data.Record record}, defaults to <code>true</code>.
     * An empty value here will cause {@link Ext.data.Record}.{@link Ext.data.Record#isValid isValid}
     * to evaluate to <code>false</code>.
     */
    allowBlank : true
});
