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
 * @class Ext.layout.AutoContainerLayout
 * @extends Ext.layout.ContainerLayout
 *
 * <p>
 * 如果一个<tt>{@link Ext.Container Container}</tt>没有配置 <tt>{@link Ext.Container#layout layout}</tt>的话，{@link Ext.Container}就采用这种AutoLayout为默认的布局管理器。
 * AutoLayout只是向子容器提供了任意布局调用的通道。
 * The AutoLayout is the default layout manager delegated by {@link Ext.Container} to
 * render any child Components when no <tt>{@link Ext.Container#layout layout}</tt> is configured into
 * a <tt>{@link Ext.Container Container}.</tt>.  AutoLayout provides only a passthrough of any layout calls
 * to any child containers.</p>
 */
Ext.layout.AutoContainerLayout = Ext.extend(Ext.layout.ContainerLayout, {
    type: 'autocontainer',

    // @private
    onLayout : function(owner, target) {
        var items = this.getLayoutItems(),
            ln = items.length, i;
        for (i = 0; i < ln; i++) {
            items[i].doComponentLayout();
        }
    }
});

Ext.regLayout('auto', Ext.layout.AutoContainerLayout);
Ext.regLayout('autocontainer', Ext.layout.AutoContainerLayout);