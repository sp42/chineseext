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
 * @class Ext.layout.FitLayout
 * @extends Ext.layout.ContainerLayout
 * <p>
 * 这是包含<b>单个项</b>布局的基类，这种布局会在容器上自动铺开以填充整个容器。 
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置<tt>layout:'fit' </tt>的方式创建，一般很少通过关键字new直接使用。<br />
 * This is a base class for layouts that contain <b>a single item</b> that automatically expands to fill the layout's
 * container.  This class is intended to be extended or created via the <tt>layout:'fit'</tt> {@link Ext.Container#layout}
 * config, and should generally not need to be created directly via the new keyword.</p>
 * <p>
 * FitLayout没有直接的配置选项（不同于继承），要采用FitLayout填充容器的面板，只需设置容器的layout:'fit'和加入一个面板。
 * 即使容器指定了多个面板，只会渲染第一个面板。用法举例：<br />
 * FitLayout does not have any direct config options (other than inherited ones).  To fit a panel to a container
 * using FitLayout, simply set layout:'fit' on the container and add a single panel to it.  If the container has
 * multiple panels, only the first one will be displayed.</p>
 */
Ext.layout.FitLayout = Ext.extend(Ext.layout.ContainerLayout, {
    itemCls: 'x-fit-item',
    targetCls: 'x-layout-fit',
    type: 'fit',
    
    // @private
    onLayout : function() {
        Ext.layout.FitLayout.superclass.onLayout.call(this);

        if (this.owner.items.length) {
            var box = this.getTargetBox(),
                item = this.owner.items.get(0);
            
            this.setItemBox(item, box);
            item.cancelAutoSize = true;
        }
    },

    getTargetBox : function() {
        var target = this.getTarget(),
            size = target.getSize(),
            padding = {
                left: target.getPadding('l'),
                right: target.getPadding('r'),
                top: target.getPadding('t'),
                bottom: target.getPadding('b')
            }, 
            border = {
                left: target.getBorderWidth('l'),
                right: target.getBorderWidth('r'),
                top: target.getBorderWidth('t'),
                bottom: target.getBorderWidth('b')
            };
            
        return {
            width: size.width- padding.left - padding.right - border.left - border.right,
            height: size.height - padding.top - padding.bottom - border.top - border.bottom,
            x: padding.left + border.left,
            y: padding.top + border.top
        };        
    },
    
    // @private
    setItemBox : function(item, box) {
        if (item && box.height > 0) {
            box.width -= item.el.getMargin('lr');
            //box.width = null;
            box.height -= item.el.getMargin('tb');
            item.setCalculatedSize(box);
            item.setPosition(box);
        }
    }
});

Ext.regLayout('fit', Ext.layout.FitLayout);
