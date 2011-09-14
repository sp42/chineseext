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
* @class Ext.layout.ContainerLayout
* @extends Ext.layout.Layout
* <p>
* 这个类应该通过<tt><b>{@link Ext.Container#layout layout}</b></tt>的配置项属性来扩展或创建。
* 参阅<tt><b>{@link Ext.Container#layout}</b></tt>了解更多。
* This class is intended to be extended or created via the <tt><b>{@link Ext.Container#layout layout}</b></tt>
* configuration property.  See <tt><b>{@link Ext.Container#layout}</b></tt> for additional details.</p>
*/
Ext.layout.ContainerLayout = Ext.extend(Ext.layout.Layout, {
    type: 'container',
        
    /**
     * @cfg {String} itemCls
     * 
     * <p>
     * 容器的CSS样式类。可选的，当自定义容器的样式的时候该属性很有用。
     * 参阅{@link Ext.Component}.{@link Ext.Component#ctCls ctCls}。
     * An optional extra CSS class that will be added to the container. This can be useful for adding
     * customized styles to the container or any of its children using standard CSS rules. See
     * {@link Ext.Component}.{@link Ext.Component#ctCls ctCls} also.</p>
     * </p>
     */
     
    /**
     * 返回子组件的数组。
     * Returns an array of child components.
     * @return {Array} 子组件。of child components
     */
    getLayoutItems : function() {
        return this.owner && this.owner.items && this.owner.items.items || [];
    },
    
    afterLayout : function() {
        this.owner.afterLayout(this);
    },    
    /**
    * 返回自身组件的resize元素。
    * Returns the owner component's resize element.
    * @return {Ext.Element}
    */
    getTarget : function() {
        return this.owner.getTargetEl();
    }
});
