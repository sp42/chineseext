/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
/**
 * @class Ext.layout.CardLayout
 * @extends Ext.layout.FitLayout
 * <p>
 * 此布局包含的多个面板，里面的每个面板都会填充整个容器，而在同一时候只有一个面板是被显示的。此布局比较常见的应用场合是Wizards（向导式对话框）、Tab标签页这些的实现等等。
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'card'的方式创建，一般很少通过关键字new直接使用。<br />
 * This layout contains multiple panels, each fit to the container, where only a single panel can be
 * visible at any given time.  This layout style is most commonly used for wizards, tab implementations, etc.
 * This class is intended to be extended or created via the layout:'card' {@link Ext.Container#layout} config,
 * and should generally not need to be created directly via the new keyword.
 * </p>
 * <p>
 * CardLayout的重点方法是{@link #setActiveItem}。在某一时刻，只有一个面板显示，而负责移动到下一面板的方法便是这个setActiveItem方法。 
 * 方法执行时会有下一个面板的id或索引作为参数传入，布局本身并没有为下一步、上一步的导航提供直接的处理机制，所有这方面的功能应由开发者提供。<br />
 * The CardLayout's focal method is {@link #setActiveItem}.  Since only one panel is displayed at a time,
 * the only way to move from one panel to the next is by calling setActiveItem, passing the id or index of
 * the next panel to display.  The layout itself does not provide a mechanism for handling this navigation,
 * so that functionality must be provided by the developer.
 * </p>
 * <p>
 * 在下面的例子中，就演示了一个简单的用法，在包含的面板的底部键入了一组用于导航路由的按钮。由于自定义的逻辑是未知的，所以例子中的路由这部分的具体实现是省略的。
 * 注意CradLayout其他的用法（如Tab控件）会是另外一种不同的实现。对于一些真正的使用场合，应通过扩展此类以提供更多自定义的功能。用法举例：<br />
 * In the following example, a simplistic wizard setup is demonstrated.  A button bar is added
 * to the footer of the containing panel to provide navigation buttons.  The buttons will be handled by a
 * common navigation routine -- for this example, the implementation of that routine has been ommitted since
 * it can be any type of custom logic.  Note that other uses of a CardLayout (like a tab control) would require a
 * completely different implementation.  For serious implementations, a better approach would be to extend
 * CardLayout to provide the custom functionality needed.  Example usage:</p>
 * <pre><code>
var navHandler = function(direction){
    // 每当切换卡片时就会执行这个函数。
    // 这里可按照实际情况调用setActiveItem方法，处理任何有分支的判断，包括一些可能的动作包括“取消”或“完结卡片”等等。
    // 一个真实的向导根据其设计的情况，可能很复杂，最好就是创建一个子类的完成其设计。
    // This routine could contain business logic required to manage the navigation steps.
    // It would call setActiveItem as needed, manage navigation button state, handle any
    // branching logic that might be required, handle alternate actions like cancellation
    // or finalization, etc.  A complete wizard implementation could get pretty
    // sophisticated depending on the complexity required, and should probably be
    // done as a subclass of CardLayout in a real-world implementation.
};

var card = new Ext.Panel({
    title: '向导的演示 Example Wizard',
    layout:'card',
    activeItem: 0, // 激活的item不能缺少 make sure the active item is set on the container config!
    bodyStyle: 'padding:15px',
    defaults: {
       // 每个子组件都有效 applied to each contained panel
        border:false
    },
    // 简单的导航按钮，可以扩展更多 just an example of one possible navigation scheme, using buttons
    bbar: [
        {
            id: 'move-prev',
            text: '后退',
            text: 'Back',
            handler: navHandler.createDelegate(this, [-1]),
            disabled: true
        },
        '->', // 表示会占据所有空白的区域 greedy spacer so that the buttons are aligned to each side
        {
            id: 'move-next',
            text: '前进 Next',
            handler: navHandler.createDelegate(this, [1])
        }
    ],
    // 内面的面板，就是“卡片” the panels (or "cards") within the layout
    items: [{
        id: 'card-0',
        html: 欢迎来到向导！'&lt;h1&gt;Welcome to the Wizard!&lt;/h1&gt;&lt;p&gt;Step 1 of 3&lt;/p&gt;'
    },{
        id: 'card-1',
        html: '&lt;p&gt;Step 2 of 3&lt;/p&gt;'
    },{
        id: 'card-2',
        html: '祝贺！</h1><p>Step 3 of 3 - 完成！&lt;h1&gt;Congratulations!&lt;/h1&gt;&lt;p&gt;Step 3 of 3 - Complete&lt;/p&gt;'
    }]
});
</code></pre>
 */
Ext.layout.CardLayout = Ext.extend(Ext.layout.FitLayout, {
    /**
     * @cfg {Boolean} deferredRender
     * True表示为处于激活的状态时才渲染每个子项，False表示为在布局渲染出来时就逐个渲染子项（缺省为fasle）。
     * 如果这里有相当多数量的内容或包含重型控件需要渲染到面板而又不是等一时间显示的时候，设置为true以提示性能。<br />
     * True to render each contained item at the time it becomes active, false to render all contained items
     * as soon as the layout is rendered (defaults to false).  If there is a significant amount of content or
     * a lot of heavy controls being rendered into panels that are not displayed by default, setting this to
     * true might improve performance.
     */
    deferredRender : false,

    // private
    renderHidden : true,

    /**
     * 设置布局中某项为活动项（即可见的项）。
     * @param {String/Number} item 要激活项的id或字符串索引。 Sets the active (visible) item in the layout.
     * @param {String/Number} item The string component id or numeric index of the item to activate
     */
    setActiveItem : function(item){
        item = this.container.getComponent(item);
        if(this.activeItem != item){
            if(this.activeItem){
                this.activeItem.hide();
            }
            this.activeItem = item;
            item.show();
            this.container.doLayout();
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