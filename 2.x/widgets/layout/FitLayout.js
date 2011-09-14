/**
 * @class Ext.layout.FitLayout
 * @extends Ext.layout.ContainerLayout
 * <p>

 * 这是包含单个项布局的基类，这种布局会在容器上自动铺开以填充整个容器。 
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'fit' 的方式创建，一般很少通过关键字new直接使用。
 * </p>
 * <p>
 * FitLayout没有直接的配置选项（不同于继承）
 * 要采用FitLayout填充容器的面板，只需设置容器的layout:'fit'和加入一个面板。
 * 即使容器指定了多个面板，只会渲染第一个面板。用法举例：</p>
 * <pre><code>
var p = new Ext.Panel({
    title: 'Fit Layout',
    layout:'fit',
    items: {
        title: '内层面板',
        html: '&lt;p&gt;这是内层面板的内容&lt;/p&gt;',
        border: false
    }
});
</code></pre>
 */
Ext.layout.FitLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize:true,

    // private
    onLayout : function(ct, target){
        Ext.layout.FitLayout.superclass.onLayout.call(this, ct, target);
        if(!this.container.collapsed){
            this.setItemSize(this.activeItem || ct.items.itemAt(0), target.getStyleSize());
        }
    },

    // private
    setItemSize : function(item, size){
        if(item && size.height > 0){ // display none?
            item.setSize(size);
        }
    }
});
Ext.Container.LAYOUTS['fit'] = Ext.layout.FitLayout;