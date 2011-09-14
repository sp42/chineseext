/*
 * @version Sencha 1.0RC-1
 * @ignore
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
 * @class Ext.data.ArrayReader
 * @extends Ext.data.JsonReader
 * 
 * <p>
 * Data reader透过一个数组而转化成为{@link Ext.data.Record}对象所组成的数组，数组内的每个元素就代表一行数据。
 * 字段定义中，通过使用下标来把字段抽取到Record对象，属性<em>mapping</em>用于指定下标，如果不指定就按照定义的先后顺序。<br />
 * Data reader class to create an Array of {@link Ext.data.Record} objects from an Array.
 * Each element of that Array represents a row of data fields. The
 * fields are pulled into a Record object using as a subscript, the <code>mapping</code> property
 * of the field definition if it exists, or the field's ordinal position in the definition.</p>
 * 
 * <p><u>示例代码：Example code:</u></p>
 * 
<pre><code>
var Employee = Ext.data.Record.create([
    {name: 'name', mapping: 1},         // 属性<em>mapping</em>用于指定下标"mapping" only needed if an "id" field is present which
    {name: 'occupation', mapping: 2}    // 如果不指定就按照定义的先后顺序precludes using the ordinal position as the index.
]);
var myReader = new Ext.data.ArrayReader({
    {@link #idIndex}: 0
}, Employee);
</code></pre>
 * 
 * <p>形成这种形式的数组：This would consume an Array like this:</p>
 * 
<pre><code>
[ [1, 'Bill', 'Gardener'], [2, 'Ben', 'Horticulturalist'] ]
</code></pre>
 * 
 * @constructor
 * 创建一个ArrayReader对象。Create a new ArrayReader
 * @param {Object} meta 元数据配置参数。Metadata configuration options.
 * @param {Array/Object} recordType
 * <p> 既可以是{@link Ext.data.Field Field}的定义对象组成的数组，如{@link Ext.data.Record#create}那般，也可以是一个由
 * {@link Ext.data.Record#create}创建的{@link Ext.data.Record}对象。
 * Either an Array of {@link Ext.data.Field Field} definition objects (which
 * will be passed to {@link Ext.data.Record#create}, or a {@link Ext.data.Record Record}
 * constructor created from {@link Ext.data.Record#create}.</p>
 */
Ext.data.ArrayReader = Ext.extend(Ext.data.JsonReader, {

    /**
     * @private
     * 由一个数组产生一个包含Ext.data.Records的对象块。
     * Most of the work is done for us by JsonReader, but we need to overwrite the field accessors to just
     * reference the correct position in the array.
     */
    buildExtractors: function() {
        Ext.data.ArrayReader.superclass.buildExtractors.apply(this, arguments);
        
        var fields = this.model.prototype.fields.items,
            length = fields.length,
            extractorFunctions = [],
            i;
        
        for (i = 0; i < length; i++) {
            extractorFunctions.push(function(index) {
                return function(data) {
                    return data[index];
                };
            }(fields[i].mapping || i));
        }
        
        this.extractorFunctions = extractorFunctions;
    }
});

Ext.data.ReaderMgr.registerType('array', Ext.data.ArrayReader);
