/*
 * @version Sencha 1.0RC-1
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
 * @class Ext.data.XmlReader
 * @extends Ext.data.Reader
 * 
 * <p>Xml Reader</p>
 */
Ext.data.XmlReader = Ext.extend(Ext.data.Reader, {

    /**
     * @cfg {String} record 指明一个DomQuery查询路径，指定包含所有行对象的信息。这是一个{@link #root}配置项对象的简写方式。The DomQuery path to the repeated element which contains record information.
     * <b>This is an alias for the {@link #root} config option.</b>
     */

    /**
     * @private
     * 返回获取访问器的函数。
     * Creates a function to return some particular key of data from a response. The totalProperty and
     * successProperty are treated as special cases for type casting, everything else is just a simple selector.
     * @param {String} key
     * @return {Function}
     */
    createAccessor: function() {
        var selectValue = function(key, root, defaultValue){
            var node = Ext.DomQuery.selectNode(key, root),
                val;
            if(node && node.firstChild){
                val = node.firstChild.nodeValue;
            }
            return Ext.isEmpty(val) ? defaultValue : val;
        };

        return function(key) {
            var fn;

            if (key == this.totalProperty) {
                fn = function(root, defaultValue) {
                    var value = selectValue(key, root, defaultValue);
                    return parseFloat(value);
                };
            }

            else if (key == this.successProperty) {
                fn = function(root, defaultValue) {
                    var value = selectValue(key, root, true);
                    return (value !== false && value !== 'false');
                };
            }

            else {
                fn = function(root, defaultValue) {
                    return selectValue(key, root, defaultValue);
                };
            }

            return fn;
        };
    }(),

    //inherit docs
    getResponseData: function(response) {
        var xml = response.responseXML;

        if (!xml) {
            throw {message: 'Ext.data.XmlReader.read: XML data not found'};
        }

        return xml;
    },

    /**
     * 获取数据。
     * Normalizes the data object
     * @param {Object} data 原始数据。The raw data object
     * @return {Object} Returns the documentElement property of the data object if present, or the same object if not
     */
    getData: function(data) {
        return data.documentElement || data;
    },

    /**
     * @private
     * Given an XML object, returns the Element that represents the root as configured by the Reader's meta data
     * @param {Object} data The XML data object
     * @return {Element} The root node element
     */
    getRoot: function(data) {
        return Ext.DomQuery.select(this.root, data);
    },


    //EVERYTHING BELOW THIS LINE WILL BE DEPRECATED IN EXT JS 5.0


    /**
     * @cfg {String} idPath DEPRECATED - this will be removed in Ext JS 5.0. Please use idProperty instead
     */

    /**
     * @cfg {String} id DEPRECATED - this will be removed in Ext JS 5.0. Please use idProperty instead
     */

    /**
     * @cfg {String} success DEPRECATED - this will be removed in Ext JS 5.0. Please use successProperty instead
     */

    /**
     * @constructor
     * @ignore
     * TODO: This can be removed in 5.0 as all it does is support some deprecated config
     */
    constructor: function(config) {
        config = config || {};

        // backwards compat, convert idPath or id / success
        // DEPRECATED - remove this in 5.0

        /*
         * Want to leave record in here. Makes sense to have it, since "root" doesn't really match
         * When describing the XmlReader. Internally we can apply it as root, however for the public
         * API it makes more sense for it to be called record. Especially since in the writer, we will
         * need both root AND record.
         */
        Ext.applyIf(config, {
            idProperty     : config.idPath || config.id,
            successProperty: config.success,
            root           : config.record
        });
        Ext.data.XmlReader.superclass.constructor.call(this, config);
    },

    /**
     * 由一个XML文档产生一个包含实例模型的ResultSet对象。
     * Parses an XML document and returns a ResultSet containing the model instances
     * @param {Object} doc 一个可被解析的XML文档。Parsed XML document
     * @return {Ext.data.ResultSet} 已解析的记录集合。The parsed result set
     */
    readRecords: function(doc) {
        /**
         * DEPRECATED - will be removed in Ext JS 5.0. This is just a copy of this.rawData - use that instead
         * @property xmlData
         * @type Object
         */
        this.xmlData = doc;

        return Ext.data.XmlReader.superclass.readRecords.call(this, doc);
    }
});

Ext.data.ReaderMgr.registerType('xml', Ext.data.XmlReader);