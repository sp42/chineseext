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
 * @class Ext.layout.Accordion
 * @extends Ext.layout.FitLayout
 * <p>此layout包含了多个像卡片垂直方向堆栈的面板。在某一时间，只有一个卡片（面板）是可见的。 
 * 每个面板都支持内建的展开和闭合功能。应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'accordion'的方式创建，而一般很少通过关键字new直接使用。<br />
 * This is a layout that contains multiple panels in an expandable accordion style such that only one
 * panel can be open at any given time.  Each panel has built-in support for expanding and collapsing.
 * This class is intended to be extended or created via the layout:'accordion' {@link Ext.Container#layout}
 * config, and should generally not need to be created directly via the new keyword.
 * </p>
 * <p>
 * 注意必须通过{@link Ext.Container#layoutConfig}属性对象来指定属于此布局的配置，以便传入到layout的内部。<br />
 * Note that when creating a layout via config, the layout-specific config properties must be passed in via
 * the {@link Ext.Container#layoutConfig} object which will then be applied internally to the layout.
 * 用法举例：Example usage:</p>
 * <pre><code>
var accordion = new Ext.Panel({
    title: 'Accordion Layout',
    layout:'accordion',
    defaults: {
        // 作用每个面板上applied to each contained panel
        bodyStyle: 'padding:15px'
    },
    layoutConfig: {
        // layout特定的配置layout-specific configs go here
        titleCollapse: false,
        animate: true,
        activeOnTop: true
    },
    items: [{
        title: 'Panel 1',
        html: '&lt;p&gt;Panel content!&lt;/p&gt;'
    },{
        title: 'Panel 2',
        html: '&lt;p&gt;Panel content!&lt;/p&gt;'
    },{
        title: 'Panel 3',
        html: '&lt;p&gt;Panel content!&lt;/p&gt;'
    }]
});
</code></pre>
 */
Ext.layout.Accordion = Ext.extend(Ext.layout.FitLayout, {
    /**
     * @cfg {Boolean} fill
     * True表示为调整活动的面板以填充整个容器的空白空间，false表示使用当前的高度，或不声明即表示自动高度（缺省为true）。
     * True to adjust the active item's height to fill the available space in the container, false to use the
     * item's current height, or auto height if not explicitly set (defaults to true).
     */
    fill : true,
    /**
     * @cfg {Boolean} autoWidth
     * True表示为设置每个容器的宽度为‘auto’，false表示用子项当前的宽度（缺省为true）。
     * True to set each contained item's width to 'auto', false to use the item's current width (defaults to true).
     * Note that some components, in particular the {@link Ext.grid.GridPanel grid}, will not function properly within
     * layouts if they have auto width, so in such cases this config should be set to false.
     */
    autoWidth : true,
    /**
     * @cfg {Boolean} titleCollapse
     * True表示为单击标题栏上任意的位置就允许展开、闭合每个子面板，false表示为只能从工具条上轮换的按钮来展开、闭合面板（缺省为true）。
     * 当设置为fasle,{@link #hideCollapseTool}也必须为fasle。
     * True to allow expand/collapse of each contained panel by clicking anywhere on the title bar, false to allow
     * expand/collapse only when the toggle tool button is clicked (defaults to true).  When set to false,
     * {@link #hideCollapseTool} should be false also.
     */
    titleCollapse : true,
    /**
     * @cfg {Boolean} hideCollapseTool
     * True表示为隐藏包含面板上闭合、展开轮换按钮，false表示为显示（默认为true），
     * 当设置为true,{@link #hideCollapseTool}也必须为true。
     * True to hide the contained panels' collapse/expand toggle buttons, false to display them (defaults to false).
     * When set to true, {@link #titleCollapse} should be true also.
     */
    hideCollapseTool : false,
    /**
     * @cfg {Boolean} collapseFirst
     * True表示为确保展开闭合的轮换按钮总是排在第一个的位置渲染（从左算起），false表示为放在最后显示（默认为fasle）。
     * True to make sure the collapse/expand toggle button always renders first (to the left of) any other tools
     * in the contained panels' title bars, false to render it last (defaults to false).
     */
    collapseFirst : false,
    /**
     * @cfg {Boolean} animate
     * True表示为当展开、闭合面板时附有动画效果以滑动打开和关闭面板。
     * 注意：要在每个面板上设置特定延时的配置项，必须在layout级别上设置为undefined。 
     * True to slide the contained panels open and closed during expand/collapse using animation, false to open and
     * close directly with no animation (defaults to false).  Note: to defer to the specific config setting of each
     * contained panel for this property, set this to undefined at the layout level.
     */
    animate : false,
    /**
     * @cfg {Boolean} sequence
     * <b>Experimental　如打开动画，会按顺序地执行动画。</b>. 
     * If animate is set to true, this will result in each animation running in sequence.
     */
    sequence : false,
    /**
     * @cfg {Boolean} activeOnTop
     * True表示为交换每个面板的位置，以便成为容器上的第一项，false表示为保持原有渲染的顺序， 
     * <b>"animate:true"时该项不兼容</b>(缺省为false)。
     * True to swap the position of each panel as it is expanded so that it becomes the first item in the container,
     * false to keep the panels in the rendered order. <b>This is NOT compatible with "animate:true"</b> (defaults to false).
     */
    activeOnTop : false,

    renderItem : function(c){
        if(this.animate === false){
            c.animCollapse = false;
        }
        c.collapsible = true;
        if(this.autoWidth){
            c.autoWidth = true;
        }
        if(this.titleCollapse){
            c.titleCollapse = true;
        }
        if(this.hideCollapseTool){
            c.hideCollapseTool = true;
        }
        if(this.collapseFirst !== undefined){
            c.collapseFirst = this.collapseFirst;
        }
        if(!this.activeItem && !c.collapsed){
            this.activeItem = c;
        }else if(this.activeItem && this.activeItem != c){
            c.collapsed = true;
        }
        Ext.layout.Accordion.superclass.renderItem.apply(this, arguments);
        c.header.addClass('x-accordion-hd');
        c.on('beforeexpand', this.beforeExpand, this);
    },

    // private
    beforeExpand : function(p, anim){
        var ai = this.activeItem;
        if(ai){
            if(this.sequence){
                delete this.activeItem;
                if (!ai.collapsed){
                    ai.collapse({callback:function(){
                        p.expand(anim || true);
                    }, scope: this});
                    return false;
                }
            }else{
                ai.collapse(this.animate);
            }
        }
        this.activeItem = p;
        if(this.activeOnTop){
            p.el.dom.parentNode.insertBefore(p.el.dom, p.el.dom.parentNode.firstChild);
        }
        this.layout();
    },

    // private
    setItemSize : function(item, size){
        if(this.fill && item){
            var items = this.container.items.items;
            var hh = 0;
            for(var i = 0, len = items.length; i < len; i++){
                var p = items[i];
                if(p != item){
                    hh += (p.getSize().height - p.bwrap.getHeight());
                }
            }
            size.height -= hh;
            item.setSize(size);
        }
    },

    /**
     * 让布局中某一项设为活动的（或展开的）。
     * Sets the active (expanded) item in the layout.
     * @param {String/Number} item 组件id的字符串或tab面板的数字索引。The string component id or numeric index of the item to activate
     */
    setActiveItem : function(item){
        item = this.container.getComponent(item);
        this.activeItem = item;
        if(item){
            item.expand();
        }
    }
});
Ext.Container.LAYOUTS['accordion'] = Ext.layout.Accordion;