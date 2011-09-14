/**
 * @class Ext.layout.Accordion
 * @extends Ext.layout.FitLayout
 * <p>此layout包含了多个像卡片垂直方向堆栈的面板。在某一时间，只有一个卡片（面板）是可见的。 
 * 每个面板都支持内建的展开和闭合功能。
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'accordion' 的方式创建，一般很少通过关键字new直接使用。</p>
 * <p>注意必须通过{@link Ext.Container#layoutConfig}属性对象来指定属于此布局的配置，以便传入到layout的内部。
 * 用法举例：</p>
 * <pre><code>
var accordion = new Ext.Panel({
    title: 'Accordion Layout',
    layout:'accordion',
    defaults: {
        // 作用每个面板上
        bodyStyle: 'padding:15px'
    },
    layoutConfig: {
        // layout特定的配置
        titleCollapse: false,
        animate: true,
        activeOnTop: true
    }
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
     */
    fill : true,
    /**
     * @cfg {Boolean} autoWidth
     * True表示为设置每个容器的宽度为‘auto’，false表示用子项当前的宽度（缺省为true）。
     */
    autoWidth : true,
    /**
     * @cfg {Boolean} titleCollapse
     * True表示为单击标题栏上任意的位置就允许展开、闭合每个子面板，
     * false表示为只能从工具条上轮换的按钮来展开、闭合面板（缺省为true）。
     * 当设置为fasle,{@link #hideCollapseTool}也必须为fasle。
     */
    titleCollapse : true,
    /**
     * @cfg {Boolean} hideCollapseTool
     * True表示为隐藏包含面板上闭合、展开轮换按钮，false表示为显示（默认为true），
     * 当设置为true,{@link #hideCollapseTool}也必须为true。
     */
    hideCollapseTool : false,
    /**
     * @cfg {Boolean} collapseFirst
     * True表示为确保展开闭合的轮换按钮总是排在第一个的位置渲染（从左算起），
     * false表示为放在最后显示（默认为fasle）。
     */
    collapseFirst : false,
    /**
     * @cfg {Boolean} animate
     * True表示为当展开、闭合面板时附有动画效果以滑动打开和关闭面板。
     * 注意：要在每个面板上设置特定延时的配置项，必须在layout级别上设置为undefined。  
     */
    animate : false,
    /**
     * @cfg {Boolean} sequence
     * <b>Experimental</b>. 如打开动画，会按顺序地执行动画。
     */
    sequence : false,
    /**
     * @cfg {Boolean} activeOnTop
     * True表示为交换每个面板的位置，以便成为容器上的第一项，false表示为保持原有渲染的顺序， 
     * <b>"animate:true"时该项不兼容</b>(缺省为false)。
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
        }else if(this.activeItem){
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
                ai.collapse({callback:function(){
                    p.expand(anim || true);
                }, scope: this});
                return false;
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
    }
});
Ext.Container.LAYOUTS['accordion'] = Ext.layout.Accordion;