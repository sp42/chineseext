 /**
 * @class Ext.layout.CardLayout
 * @extends Ext.layout.FitLayout
 * <p>此布局包含的多个面板，里面的每个面板都会填充整个容器，而在同一时候只有一个面板是被显示的。
 * 此布局比较常见的应用场合是Wizards（向导式对话框）、Tab标签页这些的实现等等。
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'card' 的方式创建，一般很少通过关键字new直接使用。</p>
 * <p>CardLayout的重点方法是{@link #setActiveItem}。在某一时刻，只有一个面板显示，而负责移动到下一面板的方法便是这个setActiveItem方法。 
 * 方法执行时会有下一个面板的id或索引作为参数传入，布局本身并没有为下一步、上一步的导航提供直接的处理机制，所有这方面的功能应由开发者提供。</p>
 * <p>
 * 在下面的例子中，就演示了一个简单的用法，在包含的面板的底部键入了一组用于导航路由的按钮。
 * 由于自定义的逻辑是未知的，所以这个例子的路由这部分的实现是省略的。
 * 注意CradLayout其他的用法（如Tab控件）会是另外一种不同的实现。对于一些真正的使用场合，应通过扩展此类以提供更多自定义的功能。用法举例：</p>
 * <pre><code>
var navHandler = function(direction){
    // 每当切换卡片时就会执行这个函数。
    // 这里可按照实际情况调用setActiveItem方法，处理任何有分支的判断，包括一些可能的动作包括“取消”或“完结卡片”等等。
    // 一个真实的向导根据其设计的情况，可能很复杂，最好就是创建一个子类的完成其设计。
}
var card = new Ext.Panel({
    title: '向导的演示',
    layout:'card',
    activeItem: 0, // 激活的item不能缺少
    bodyStyle: 'padding:15px',
    defaults: {
        // 每个子组件都有效
        border:false
    },
    // 简单的导航按钮，可以扩展更多
    bbar: [
        {
            id: 'move-prev',
            text: '后退',
            handler: navHandler.createDelegate(this, [-1]),
            disabled: true
        },
        '->', // 表示会占据所有空白的区域
        {
            id: 'move-next',
            text: '前进',
            handler: navHandler.createDelegate(this, [1])
        }
    ],
    // 内面的面板，就是“卡片”
    items: [{
        id: 'card-0',
        html: '<h1>欢迎来到向导！</h1><p>Step 1 of 3</p>'
    },{
        id: 'card-1',
        html: '<p>Step 2 of 3</p>'
    },{
        id: 'card-2',
        html: '<h1>祝贺！</h1><p>Step 3 of 3 - 完成！</p>'
    }]
});
</code></pre>
 */
Ext.layout.CardLayout = Ext.extend(Ext.layout.FitLayout, {
    /**
     * @cfg {Boolean} deferredRender
     * True表示为处于激活的状态时才渲染每个子项，False表示为在布局渲染出来时就逐个渲染子项（缺省为fasle）。
     * 如果这里有相当多数量的内容或包含重型控件需要渲染到面板而又不是等一时间显示的时候，设置为true以提示性能。
     */     
    deferredRender : false,

    // private
    renderHidden : true,

    /**
     * 设置布局中某项为活动项（可见的项）。
     * @param {String/Number} item 要激活项的id或字符串索引
     */     
    setActiveItem : function(item){
        item = this.container.getComponent(item);
        if(this.activeItem != item){
            if(this.activeItem){
                this.activeItem.hide();
            }
            this.activeItem = item;
            item.show();
            this.layout();
        }
    },

    // private
    renderAll : function(ct, target){
        if(this.deferredRender){
            this.renderItem(this.activeItem, undefined, target);
        }else{
            Ext.layout.CardLayout.superclass.renderAll.call(this, ct, target);
        }
    }
});
Ext.Container.LAYOUTS['card'] = Ext.layout.CardLayout;