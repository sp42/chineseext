/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
 * 
 * 本翻译采用“创作共同约定、Creative Commons”。您可以自由：
 * 复制、发行、展览、表演、放映、广播或通过信息网络传播本作品
 * 创作演绎作品
 * 请遵守：
 *    署名. 您必须按照作者或者许可人指定的方式对作品进行署名。
 * # 对任何再使用或者发行，您都必须向他人清楚地展示本作品使用的许可协议条款。
 * # 如果得到著作权人的许可，您可以不受任何这些条件的限制
 * http://creativecommons.org/licenses/by/2.5/cn/
 */

/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.ReaderLayout
 * @extends Ext.BorderLayout
 * 这是代表经典之作的一个预建的布局，5星级应用.它是由一个头部，主要中心区域该中心区域包含了两个嵌套的区域(上面的区域用来得到一列表，下面的用来预览.)
 * ，该区域在其它方面能够被用来导航、系统命令、信息发布等.此类的用法与配置项与BorderLayout类几乎一样，此类用通用的应用样式简单的初始化整个的布局和区域.
 * 如例:
 <pre><code>
var reader = new Ext.ReaderLayout();
var CP = Ext.ContentPanel;  // 加入的简写方式

reader.beginUpdate();
reader.add("north", new CP("north", "North"));
reader.add("west", new CP("west", {title: "West"}));
reader.add("east", new CP("east", {title: "East"}));

reader.regions.listView.add(new CP("listView", "List"));
reader.regions.preview.add(new CP("preview", "Preview"));
reader.endUpdate();
</code></pre>
* @constructor
* 创建一个 ReaderLayout的对象
* @param {Object} config 可选项的配置
* @param {String/HTMLElement/Element} container (可选项) 与布局相绑定的容器 (默认值为document.body)
*/
Ext.ReaderLayout = function(config, renderTo){
    var c = config || {size:{}};
    Ext.ReaderLayout.superclass.constructor.call(this, renderTo || document.body, {
        north: c.north !== false ? Ext.apply({
            split:false,
            initialSize: 32,
            titlebar: false
        }, c.north) : false,
        west: c.west !== false ? Ext.apply({
            split:true,
            initialSize: 200,
            minSize: 175,
            maxSize: 400,
            titlebar: true,
            collapsible: true,
            animate: true,
            margins:{left:5,right:0,bottom:5,top:5},
            cmargins:{left:5,right:5,bottom:5,top:5}
        }, c.west) : false,
        east: c.east !== false ? Ext.apply({
            split:true,
            initialSize: 200,
            minSize: 175,
            maxSize: 400,
            titlebar: true,
            collapsible: true,
            animate: true,
            margins:{left:0,right:5,bottom:5,top:5},
            cmargins:{left:5,right:5,bottom:5,top:5}
        }, c.east) : false,
        center: Ext.apply({
            tabPosition: 'top',
            autoScroll:false,
            closeOnTab: true,
            titlebar:false,
            margins:{left:c.west!==false ? 0 : 5,right:c.east!==false ? 0 : 5,bottom:5,top:2}
        }, c.center)
    });

    this.el.addClass('x-reader');

    this.beginUpdate();

    var inner = new Ext.BorderLayout(Ext.get(document.body).createChild(), {
        south: c.preview !== false ? Ext.apply({
            split:true,
            initialSize: 200,
            minSize: 100,
            autoScroll:true,
            collapsible:true,
            titlebar: true,
            cmargins:{top:5,left:0, right:0, bottom:0}
        }, c.preview) : false,
        center: Ext.apply({
            autoScroll:false,
            titlebar:false,
            minHeight:200
        }, c.listView)
    });
    this.add('center', new Ext.NestedLayoutPanel(inner,
            Ext.apply({title: c.mainTitle || '',tabTip:''},c.innerPanelCfg)));

    this.endUpdate();

    this.regions.preview = inner.getRegion('south');
    this.regions.listView = inner.getRegion('center');
};

Ext.extend(Ext.ReaderLayout, Ext.BorderLayout);