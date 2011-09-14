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
 * @class Ext.data.XmlWriter
 * @extends Ext.data.Writer
 * 
 * <p>Writer负责将Model的实体数据以XML格式输出。Writer that outputs model data in XML format</p>
 */
Ext.data.XmlWriter = Ext.extend(Ext.data.Writer, {
    /**
     * @cfg {String} documentRoot 文档的各节点的名称是什么。默认是<tt>'xmlData'</tt>。The name of the root element of the document. Defaults to <tt>'xmlData'</tt>.
     */
    documentRoot: 'xmlData',

    /**
     * @cfg {String} header XML文档的header是什么，默认是<tt>''</tt>。A header to use in the XML document (such as setting the encoding or version).
     * Defaults to <tt>''</tt>.
     */
    header: '',

    /**
     * @cfg {String} record 每一个记录变为i节点时它的标签名称是什么。默认是“record”。The name of the node to use for each record. Defaults to <tt>'record'</tt>.
     */
    record: 'record',

    //inherit docs
    writeRecords: function(request, data) {
        var tpl = this.buildTpl(request, data);

        request.xmlData = tpl.apply(data);

        return request;
    },

    buildTpl: function(request, data) {
        if (this.tpl) {
            return this.tpl;
        }

        var tpl = [],
            root = this.documentRoot,
            record = this.record,
            first,
            key;

        if (this.header) {
            tpl.push(this.header);
        }
        tpl.push('<', root, '>');
        if (data.length > 0) {
            tpl.push('<tpl for="."><', record, '>');
            first = data[0];
            for (key in first) {
                if (first.hasOwnProperty(key)) {
                    tpl.push('<', key, '>{', key, '}</', key, '>');
                }
            }
            tpl.push('</', record, '></tpl>');
        }
        tpl.push('</', root, '>');
        this.tpl = new Ext.XTemplate(tpl.join(''));
        return this.tpl;
    }
});

Ext.data.WriterMgr.registerType('xml', Ext.data.XmlWriter);