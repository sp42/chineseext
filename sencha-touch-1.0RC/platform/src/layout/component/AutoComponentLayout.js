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
 * @class Ext.layout.AutoComponentLayout
 * @extends Ext.layout.ComponentLayout
 * <p>
 * 如果没有配置<tt>{@link Ext.Component#layout layout}</tt>的话，{@link Ext.Component}就采用这种AutoLayout为默认的布局管理器来渲染子元素。
 * The AutoLayout is the default layout manager delegated by {@link Ext.Component} to
 * render any child Elements when no <tt>{@link Ext.Component#layout layout}</tt> is configured.</p>
 */
Ext.layout.AutoComponentLayout = Ext.extend(Ext.layout.ComponentLayout, {
    type: 'autocomponent',

    onLayout : function(width, height) {
        this.setTargetSize(width, height);
    }
});

Ext.regLayout('autocomponent', Ext.layout.AutoComponentLayout);
