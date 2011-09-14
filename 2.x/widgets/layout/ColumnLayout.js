 /**
 * @class Ext.layout.ColumnLayout
 * @extends Ext.layout.ContainerLayout
 * <p>
 * 这是为构建多个垂直式结构而准备的布局，
 * 当中包含已指定宽度的多个列，列的宽度可以是固定值，也可以是可伸缩的百分比宽度，但里面的内容就是自适应高度了。
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'column' 的方式创建，一般很少通过关键字new直接使用。</p>
 * </p><p>虽然ColumnLayout没有直接的配置项（不同于继承），但是ColumnLayout的任意一个子面板都支持特殊的配置项属性 <b>columnWidth</b>。
 * 可采用width（像素）或columnWidth（百分比）的方式来决定面板的尺寸大小，如不为面板指定width或columnWidth，
 * 那么将缺省为面板的自动宽度。
 * 属性width是以象素pixles来固定宽度，并必须是数字大于或等于1；属性columnWidth是百分比相对单位，并必须是百分比字符串区间是大于0小于1（像.25）。
 * <p>分配列宽度的基本规则非常简单。UI逻辑会将所包含的一组面板分成两类：
 * 第一类是宽度固定值或不指定的（设置为auto）面板，当此类面板传入到布局时，先不立即渲染，但它们的宽度就会从容器的总宽度减去；
 * 第二类是以百分比指定的面板，百分比的含义时在基于剩下宽度中计算的百分比。当传入布局时，会将这些百分比转换为宽度的固定数字值，分配到面板上。
 * 换句话讲，百分比的面板的用途填充由固定值宽度或AUTO宽度面板占据后<b>所留下</b>的空间。因此，虽然你可以以不同的百分比来分配列，但columnWidth加起来必须是等于1（或100%）。
 * 否则的话，渲染出来的布局可能出现不正常。用法举例：</p>
 * <pre><code>
// All columns are percentages -- they must add up to 1
var p = new Ext.Panel({
    title: 'Column Layout - Percentage Only',
    layout:'column',
    items: [{
        title: 'Column 1',
        columnWidth: .25 
    },{
        title: 'Column 2',
        columnWidth: .6
    },{
        title: 'Column 3',
        columnWidth: .15
    }]
});

// Mix of width and columnWidth -- all columnWidth values values must add
// up to 1. The first column will take up exactly 120px, and the last two
// columns will fill the remaining container width.
var p = new Ext.Panel({
    title: 'Column Layout - Mixed',
    layout:'column',
    items: [{
        title: 'Column 1',
        width: 120
    },{
        title: 'Column 2',
        columnWidth: .8
    },{
        title: 'Column 3',
        columnWidth: .2
    }]
});
</code></pre>
 */
Ext.layout.ColumnLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize:true,
    // private
    extraCls: 'x-column',

    scrollOffset : 0,

    // private
    isValidParent : function(c, target){
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    // private
    onLayout : function(ct, target){
        var cs = ct.items.items, len = cs.length, c, i;

        if(!this.innerCt){
            target.addClass('x-column-layout-ct');

            // the innerCt prevents wrapping and shuffling while
            // the container is resizing
            this.innerCt = target.createChild({cls:'x-column-inner'});
            this.innerCt.createChild({cls:'x-clear'});
        }
        this.renderAll(ct, this.innerCt);

        var size = target.getViewSize();

        if(size.width < 1 && size.height < 1){ // display none?
            return;
        }

        var w = size.width - target.getPadding('lr') - this.scrollOffset,
            h = size.height - target.getPadding('tb'),
            pw = w;

        this.innerCt.setWidth(w);
        
        // some columns can be percentages while others are fixed
        // so we need to make 2 passes

        for(i = 0; i < len; i++){
            c = cs[i];
            if(!c.columnWidth){
                pw -= (c.getSize().width + c.getEl().getMargins('lr'));
            }
        }

        pw = pw < 0 ? 0 : pw;

        for(i = 0; i < len; i++){
            c = cs[i];
            if(c.columnWidth){
                c.setSize(Math.floor(c.columnWidth*pw) - c.getEl().getMargins('lr'));
            }
        }
    }
    
    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS['column'] = Ext.layout.ColumnLayout;