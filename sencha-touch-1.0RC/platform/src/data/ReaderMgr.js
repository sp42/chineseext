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
 * @class Ext.data.ReaderMgr
 * @extends Ext.AbstractManager
 * @singleton
 * @ignore
 * 
 * <p>保存了所有已登记的{@link Ext.data.Reader Reader}类型。Maintains the set of all registered {@link Ext.data.Reader Reader} types.</p>
 */
Ext.data.ReaderMgr = new Ext.AbstractManager({
    typeName: 'rtype'
});