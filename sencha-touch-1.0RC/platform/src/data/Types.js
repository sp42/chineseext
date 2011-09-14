/*
 * @version Sencha 1.0RC
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */


/**
 * @class Ext.data.Types
 * @ignore
 * <p>
 * 这是由Ext定义的数据类型静态类，可用于{@link Ext.data.Field Field}的时候指定。
 * This is s static class containing the system-supplied data types which may be given to a {@link Ext.data.Field Field}.<p/>
 * <p>
 * {@link Ext.data.Field Field}类中的类型标识指的就是这个类的属性，所以如要测试某个字段的类型，拿它与Ext.data.Types['类型名称']比较即可。
 * The properties in this class are used as type indicators in the {@link Ext.data.Field Field} class, so to
 * test whether a Field is of a certain type, compare the {@link Ext.data.Field#type type} property against properties
 * of this class.</p>
 * <p>新建的数据类型，一定要以下的三项属性齐备：Developers may add their own application-specific data types to this class. Definition names must be UPPERCASE.
 * each type definition must contain three properties:</p>
 * <div class="mdetail-params"><ul>
 * <li><code>convert</code> : <i>Function</i><div class="sub-desc">
 * A function to convert raw data values from a data block into the data
 * to be stored in the Field. The function is passed the collowing parameters:
 * 形成自定义数据类型的转换函数。
 * 从数据源得到是原始数据，可能性需要经过特定转换，变为符合该数据类型其结构的对象。
 * 该函数有两个参数供调用：
 * <div class="mdetail-params"><ul>
 * <li><b>v</b> : Mixed<div class="sub-desc">
 * Reader读取过的值（一切合法的JavaScript的数据类型），
 * 如果没有的话便读取<tt>{@link Ext.data.Field#defaultValue defaultValue}</tt>的值（默认值）。
 * The data value as read by the Reader, if undefined will use
 * the configured <tt>{@link Ext.data.Field#defaultValue defaultValue}</tt>.</div></li>
 * <li><b>rec</b> : 
 * Reader读取过的整行数据。如果这是一个{@link Ext.data.ArrayReader ArrayReader}，那么这将是一个Array；
 * 如果这是一个{@link Ext.data.JsonReader JsonReader}，那么这将是一个JSON对象；如果这是一个{@link Ext.data.XMLReader XMLReader}，
 * 那么这是一个XML Element节点或元素的对象。
 * Mixed<div class="sub-desc">The data object containing the row as read by the Reader.
 * Depending on the Reader type, this could be an Array ({@link Ext.data.ArrayReader ArrayReader}), an object
 * ({@link Ext.data.JsonReader JsonReader}), or an XML element ({@link Ext.data.XMLReader XMLReader}).</div></li>
 * </ul></div></div></li>
 * <li><code>sortType</code> : <i>Function</i> <div class="sub-desc">排序函数。根据Ext.data.SortTypes的配置信息来定义。A function to convert the stored data into comparable form, as defined by {@link Ext.data.SortTypes}.</div></li>
 * <li><code>type</code> : <i>String</i> <div class="sub-desc">自定义类型的名称。A textual data type name.</div></li>
 * </ul></div>
 * <p>假设有这么一个例子，创建一个VELatLong字段，微软在线地图专用的数据类型，才可以访问微软Bing地图的API。首先我们从 JsonReader中得到数据块，其中包含了laittude/longitude信息和内容，即lat和long属性，那么，我们可以这样定义 VELatLong数据类型
 * For example, to create a VELatLong field (See the Microsoft Bing Mapping API) containing the latitude/longitude value of a datapoint on a map from a JsonReader data block
 * which contained the properties <code>lat</code> and <code>long</code>, you would define a new data type like this:</p>
 *<pre><code>
// Add a new Field data type which stores a VELatLong object in the Record.
Ext.data.Types.VELATLONG = {
    convert: function(v, data) {
        return new VELatLong(data.lat, data.long);
    },
    sortType: function(v) {
        return v.Latitude;  // When sorting, order by latitude
    },
    type: 'VELatLong'
};
</code></pre>
 * <p>Then, when declaring a Record, use <pre><code>
var types = Ext.data.Types; // allow shorthand type access
UnitRecord = Ext.data.Record.create([
    { name: 'unitName', mapping: 'UnitName' },
    { name: 'curSpeed', mapping: 'CurSpeed', type: types.INT },
    { name: 'latitude', mapping: 'lat', type: types.FLOAT },
    { name: 'latitude', mapping: 'lat', type: types.FLOAT },
    { name: 'position', type: types.VELATLONG }
]);
</code></pre>
 * @singleton
 */
Ext.data.Types = new function() {
    var st = Ext.data.SortTypes;
    
    Ext.apply(this, {
        /**
         * @type Regexp
         * @property stripRe
         * 为数字剔除非数字的字符串的正则。默认为 <tt>/[\$,%]/g</tt>，可按照本地化覆盖这个值。 
         * A regular expression for stripping non-numeric characters from a numeric value. Defaults to <tt>/[\$,%]/g</tt>.
         * This should be overridden for localization.
         */
        stripRe: /[\$,%]/g,
        
        /**
         * @type Object.
         * @property AUTO
         *  该数据类型的意思是不作转换，将原始数据放到Record之中去。
         * This data type means that no conversion is applied to the raw data before it is placed into a Record.
         */
        AUTO: {
            convert: function(v) {
                return v;
            },
            sortType: st.none,
            type: 'auto'
        },

        /**
         * @type Object.
         * @property STRING
         * 该数据类型的意思是将原始数据转换为String后再放到Record之中去。
         * This data type means that the raw data is converted into a String before it is placed into a Record.
         */
        STRING: {
            convert: function(v) {
                return (v === undefined || v === null) ? '' : String(v);
            },
            sortType: st.asUCString,
            type: 'string'
        },

        /**
         * @type Object.
         * @property INT
         * 该数据类型的意思是将原始数据转换为整数类型后再放到Record之中去。
         * This data type means that the raw data is converted into an integer before it is placed into a Record.
         * <p>
         * 另外，全称 <code>INTEGER</code>也是等价的。
         * The synonym <code>INTEGER</code> is equivalent.</p>
         */
        INT: {
            convert: function(v) {
                return v !== undefined && v !== null && v !== '' ?
                    parseInt(String(v).replace(Ext.data.Types.stripRe, ''), 10) : (this.useNull ? null : 0);
            },
            sortType: st.none,
            type: 'int'
        },
        
        /**
         * @type Object.
         * @property FLOAT
         * 该数据类型的意思是将原始数据转换为Nubmer后再放到Record之中去。
         * This data type means that the raw data is converted into a number before it is placed into a Record.
         * <p>
         * 另外，全称 <code>NUMBER</code>也是等价的。
         * The synonym <code>NUMBER</code> is equivalent.</p>
         */
        FLOAT: {
            convert: function(v) {
                return v !== undefined && v !== null && v !== '' ?
                    parseFloat(String(v).replace(Ext.data.Types.stripRe, ''), 10) : (this.useNull ? null : 0);
            },
            sortType: st.none,
            type: 'float'
        },
        
        /**
         * @type Object.
         * @property BOOL
         * <p>
         * 该数据类型的意思是将原始数据转换为Boolean后再放到Record之中去。
         * 字符串“true”和数字 1 都会被转换为布尔值<code>true</code>。
         * This data type means that the raw data is converted into a boolean before it is placed into
         * a Record. The string "true" and the number 1 are converted to boolean <code>true</code>.</p>
         * <p>
         * 另外，全称 <code>BOOLEAN</code>也是等价的。
         * The synonym <code>BOOLEAN</code> is equivalent.</p>
         */
        BOOL: {
            convert: function(v) {
                return v === true || v === 'true' || v == 1;
            },
            sortType: st.none,
            type: 'bool'
        },
        
        /**
         * @type Object.
         * @property DATE
         * 该数据类型的意思是将原始数据转换为Date后再放到Record之中去。
         * 可在{@link Ext.data.Field}构造函数中指定日期的格式化函数。
         * This data type means that the raw data is converted into a Date before it is placed into a Record.
         * The date format is specified in the constructor of the {@link Ext.data.Field} to which this type is
         * being applied.
         */
        DATE: {
            convert: function(v) {
                var df = this.dateFormat;
                if (!v) {
                    return null;
                }
                if (Ext.isDate(v)) {
                    return v;
                }
                if (df) {
                    if (df == 'timestamp') {
                        return new Date(v*1000);
                    }
                    if (df == 'time') {
                        return new Date(parseInt(v, 10));
                    }
                    return Date.parseDate(v, df);
                }
                
                var parsed = Date.parse(v);
                return parsed ? new Date(parsed) : null;
            },
            sortType: st.asDate,
            type: 'date'
        }
    });
    
    Ext.apply(this, {
        /**
         * @type Object.
         * @property BOOLEAN
         * 表示数据在放置到Record之前，从原始数据转换为布尔类型的数据。
         * 字符串“true”和数字1都被视作布尔类型的<code>true</code>。
         * <p>同义词<code>BOOL</code>与它是等价的。</p>
         * <p>This data type means that the raw data is converted into a boolean before it is placed into
         * a Record. The string "true" and the number 1 are converted to boolean <code>true</code>.</p>
         * <p>The synonym <code>BOOL</code> is equivalent.</p>
         */
        BOOLEAN: this.BOOL,
        
        /**
         * @type Object.
         * @property INTEGER
         * 表示数据在放置到Record之前，从原始数据转换为整数类型的数据。
         * <p>同义词<code>INT</code>与它是等价的。</p>
         * This data type means that the raw data is converted into an integer before it is placed into a Record.
         * <p>The synonym <code>INT</code> is equivalent.</p>
         */
        INTEGER: this.INT,
        
        /**
         * @type Object.
         * @property NUMBER
         * 表示数据在放置到Record之前，从原始数据转换为数字类型的数据。
         * <p>同义词<code>FLOAT</code>与它是等价的。</p>
         * This data type means that the raw data is converted into a number before it is placed into a Record.
         * <p>The synonym <code>FLOAT</code> is equivalent.</p>
         */
        NUMBER: this.FLOAT    
    });
};