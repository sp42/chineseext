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
 * @class Ext.data.JsonReader
 * @extends Ext.data.Reader
 * 
 * <p>
 * 数据阅读器，定位在从JSON数据包以创建{@link Ext.data.Model}对象的数组，其中的映射关系来自于{@link Ext.data.Model}的构造器。
 * Data reader class to create an Array of {@link Ext.data.Model} objects from a
 * JSON packet based on mappings in a provided Ext.data.Model constructor.</p>
 * 
 * <p>例子：Example code:</p>
 * 
<pre><code>
var myReader = new Ext.data.Store({
    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            // 元数据 metadata configuration options:
            idProperty: 'id'
            root: 'rows',
            totalProperty: 'results'
        }
    },

    // 这些字段的配置参数将会用于内部创建Ext.data.Model的构建器。
    // the fields config option will internally create an Ext.data.Model
    // constructor that provides mapping for reading the record data objects
    fields: [
        // map Record's 'firstname' field to data object's key of same name
        {name: 'name'},
        // map Record's 'job' field to data object's 'occupation' key
        {name: 'job', mapping: 'occupation'}
    ],
});
</code></pre>
 * 
 * <p>被分析的JSON数据对象假设如下：This would consume a JSON data object of the form:</p>
 * 
<pre><code>
{
    results: 2000, // Reader指定的总数。 Reader's configured totalProperty
    rows: [        // Reader指定的根节点。Reader's configured root
        // 记录对象如下：record data objects:
        { id: 1, firstname: 'Bill', occupation: 'Gardener' },
        { id: 2, firstname: 'Ben' , occupation: 'Horticulturalist' },
        ...
    ]
}
</code></pre>
 */
Ext.data.JsonReader = Ext.extend(Ext.data.Reader, {
    
    /**
     * 读取JSON对象，返回ResultSet。使用内部的getTotal和getSuccess方法读取来自响应的元数据，并将这些JSON数据输出到模型实例。
     * Reads a JSON object and returns a ResultSet. Uses the internal getTotal and getSuccess extractors to
     * retrieve meta data from the response, and extractData to turn the JSON data into model instances.
     * @param {Object} data 原始的JSON数据。The raw JSON data
     * @return {Ext.data.ResultSet} 携带实体数据的ResultSet。A ResultSet containing model instances and meta data about the results
     */
    readRecords: function(data) {
        //this has to be before the call to super because we use the meta data in the superclass readRecords
        if (data.metaData) {
            this.onMetaChange(data.metaData);
        }

        /**
         * 这只是this.rawData的拷贝，会被弃置。
         * DEPRECATED - will be removed in Ext JS 5.0. This is just a copy of this.rawData - use that instead
         * @property jsonData
         * @type Mixed
         */
        this.jsonData = data;

        return Ext.data.JsonReader.superclass.readRecords.call(this, data);
    },

    //inherit docs
    getResponseData: function(response) {
        try {
            var data = Ext.decode(response.responseText);
        }
        catch (ex) {
            throw 'Ext.data.JsonReader.getResponseData: Unable to parse JSON returned by Server.';
        }

        if (!data) {
            throw 'Ext.data.JsonReader.getResponseData: JSON object not found';
        }

        return data;
    },

    //inherit docs
    buildExtractors : function() {
        Ext.data.JsonReader.superclass.buildExtractors.apply(this, arguments);

        if (this.root) {
            this.getRoot = this.createAccessor(this.root);
        } else {
            this.getRoot = function(root) {
                return root;
            };
        }
    },

    /**
     * @private
     * 返回accessor函数。
     * Returns an accessor function for the given property string. Gives support for properties such as the following:
     * 'someProperty'
     * 'some.property'
     * 'some["property"]'
     * This is used by buildExtractors to create optimized extractor functions when casting raw data into model instances.
     */
    createAccessor: function() {
        var re = /[\[\.]/;

        return function(expr) {
            if (Ext.isEmpty(expr)) {
                return Ext.emptyFn;
            }
            if (Ext.isFunction(expr)) {
                return expr;
            }
            var i = String(expr).search(re);
            if (i >= 0) {
                return new Function('obj', 'return obj' + (i > 0 ? '.' : '') + expr);
            }
            return function(obj) {
                return obj[expr];
            };
        };
    }()
});

Ext.data.ReaderMgr.registerType('json', Ext.data.JsonReader);