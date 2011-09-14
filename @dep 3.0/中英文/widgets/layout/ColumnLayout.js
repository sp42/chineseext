/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=90 Ext中文站翻译小组
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
 * @class Ext.layout.ColumnLayout
 * @extends Ext.layout.ContainerLayout
 * <p>
 * 这是为构建多个垂直式结构而准备的布局，当中包含已指定宽度的多个列，列的宽度可以是固定值，也可以是可伸缩的百分比宽度，但里面的内容就是自适应高度了。
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'column'的方式创建该类，一般很少通过关键字new直接使用该类。<br />
 * This is the layout style of choice for creating structural layouts in a multi-column format where the width of
 * each column can be specified as a percentage or fixed width, but the height is allowed to vary based on the content.
 * This class is intended to be extended or created via the layout:'column' {@link Ext.Container#layout} config,
 * and should generally not need to be created directly via the new keyword.
 * </p>
 * <p>
 * 虽然ColumnLayout没有直接的配置项（不同于继承），但是ColumnLayout的任意一个子面板都支持特殊的配置项属性<b>columnWidth</b>。
 * 可采用width（像素）或columnWidth（百分比）的方式来决定面板的尺寸大小，如不为面板指定width或columnWidth，那么将缺省为面板的自动宽度。<br />
 * ColumnLayout does not have any direct config options (other than inherited ones), but it does support a
 * specific config property of <b><tt>columnWidth</tt></b> that can be included in the config of any panel added to it.  The
 * layout will use the columnWidth (if present) or width of each panel during layout to determine how to size each panel.
 * If width or columnWidth is not specified for a given panel, its width will default to the panel's width (or auto).
 * </p>
 * <p>
 * 属性width总是以象素（pixles）来固定宽度，并必须是数字大于或等于1；属性columnWidth是百分比相对单位，并必须是百分比字符串区间是大于0小于1（像.25）。<br />
 * The width property is always evaluated as pixels, and must be a number greater than or equal to 1.
 * The columnWidth property is always evaluated as a percentage, and must be a decimal value greater than 0 and
 * less than 1 (e.g., .25).
 * </p>
 * <p>
 * 分配列宽度的基本规则非常简单。UI逻辑会将所包含的一组面板分成两类：
 * 第一类是宽度固定值或不指定的（设置为auto）面板，当此类面板传入到布局时，先不立即渲染，但它们的宽度就会从容器的总宽度减去；
 * 第二类是以百分比指定的面板，百分比的含义时在基于剩下宽度中计算的百分比。当传入布局时，会将这些百分比转换为宽度的固定数字值，分配到面板上。
 * 换句话讲，百分比的面板的用途填充由固定值宽度或AUTO宽度面板占据后<b>所留下</b>的空间。因此，虽然你可以以不同的百分比来分配列，但columnWidth加起来必须是等于1（或100%）。
 * 否则的话，渲染出来的布局可能出现不正常。用法举例：<br />
 * The basic rules for specifying column widths are pretty simple.  The logic makes two passes through the
 * set of contained panels.  During the first layout pass, all panels that either have a fixed width or none
 * specified (auto) are skipped, but their widths are subtracted from the overall container width.  During the second
 * pass, all panels with columnWidths are assigned pixel widths in proportion to their percentages based on
 * the total <b>remaining</b> container width.  In other words, percentage width panels are designed to fill the space
 * left over by all the fixed-width and/or auto-width panels.  Because of this, while you can specify any number of columns
 * with different percentages, the columnWidths must always add up to 1 (or 100%) when added together, otherwise your
 * layout may not render as expected.  Example usage:
 * </p>
 * <pre><code>
// 所有的列都是百分比单位，加起来就应该是1。
// All columns are percentages -- they must add up to 1
var p = new Ext.Panel({
    title: '列布局 - 百分比Only',
    layout:'column',
    items: [{
        title: '列一',
        columnWidth: .25 
    },{
        title: '列二',
        columnWidth: .6
    },{
        title: '列三',
        columnWidth: .15
    }]
});

// width的配置项和columnWidth的配置项两者都可以混合使用，但columnWidth的值加起来就一定要是1。
// 例子的第一列就精确指明120px，剩余的两个列就自适应了容器内余下的部分。 
// Mix of width and columnWidth -- all columnWidth values must add up
// to 1. The first column will take up exactly 120px, and the last two
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
    
    /**
     * @cfg {String} extraCls
     * 加入的容器的额外的CSS样式类（默认为'x-column'）。要修改样式起来这样就很方便了，同时也方便为子元素加入样式。
     * An optional extra CSS class that will be added to the container (defaults to ).  This can be useful for
     * adding customized styles to the container or any of its children using standard CSS rules.
     */
    extraCls: 'x-column',

    scrollOffset : 0,

    // private
    isValidParent : function(c, target){
        return (c.getPositionEl ? c.getPositionEl() : c.getEl()).dom.parentNode == this.innerCt.dom;
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

        var size = Ext.isIE && target.dom != Ext.getBody().dom ? target.getStyleSize() : target.getViewSize();

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