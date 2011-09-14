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
* @class Ext.layout.ComponentLayout
* @extends Ext.layout.Layout
* <p>
* 这个类应该通过<tt><b>{@link Ext.Component#componentLayout layout}</b></tt>的配置项属性来扩展或创建。
* 参阅<tt><b>{@link Ext.Component#componentLayout}</b></tt> 了解更多。
* This class is intended to be extended or created via the <tt><b>{@link Ext.Component#componentLayout layout}</b></tt>
* configuration property.  See <tt><b>{@link Ext.Component#componentLayout}</b></tt> for additional details.</p>
*/
Ext.layout.ComponentLayout = Ext.extend(Ext.layout.Layout, {
    type: 'component',

    monitorChildren: true,

    beforeLayout : function(width, height) {
        Ext.layout.ComponentLayout.superclass.beforeLayout.call(this);
        var owner = this.owner,
            isVisible = owner.isVisible(),
            layoutCollection;
        // If an ownerCt is hidden, add my reference onto the layoutOnShow stack.  Set the needsLayout flag.
        if (!isVisible && owner.hiddenOwnerCt) {
            layoutCollection = owner.hiddenOwnerCt.layoutOnShow;
            layoutCollection.remove(owner);
            layoutCollection.add(owner);
            owner.needsLayout = {
                width: width,
                height: height,
                isSetSize: false
            };
        }

        return isVisible && this.needsLayout(width, height);
    },

    /**
    * 检查新的尺寸是否不同于当前的尺寸并有需要的话触动一个布局。
    * Check if the new size is different from the current size and only
    * trigger a layout if it is necessary.
    * @param {Mixed} width 新设置的宽度。The new width to set.
    * @param {Mixed} height 新设置的高度。The new height to set.
    */
    needsLayout : function(width, height) {
        this.lastComponentSize = this.lastComponentSize || {
            width: -Infinity,
            height: -Infinity
        };

        var childrenChanged = this.childrenChanged;
        this.childrenChanged = false;

        return (childrenChanged || this.lastComponentSize.width !== width || this.lastComponentSize.height !== height);
    },

    /**
    * 设置任意元素尺寸可支持undefined、null和值。
    * Set the size of any element supporting undefined, null, and values.
    * @param {Mixed} width 新设置的宽度。The new width to set.
    * @param {Mixed} height 新设置的高度。The new height to set.
    */
    setElementSize: function(el, width, height) {
        if (width !== undefined && height !== undefined) {
            el.setSize(width, height);
        }
        else if (height !== undefined) {
            el.setHeight(height);
        }
        else if (width !== undefined) {
            el.setWidth(width);
        }
    },

    /**
    * 返回其自身的调整尺寸元素。
    * Returns the owner component's resize element.
    * @return {Ext.Element}
    */
    getTarget : function() {
        return this.owner.el;
    },

    /**
    * 设置目标元素的尺寸。
    * Set the size of the target element.
    * @param {Mixed} width 新设置的宽度。The new width to set.
    * @param {Mixed} height 新设置的高度。The new height to set.
    */
    setTargetSize : function(width, height) {
        this.setElementSize(this.owner.el, width, height);
        this.lastComponentSize = {
            width: width,
            height: height
        };
    },

    afterLayout : function() {
        var owner = this.owner,
            layout = owner.layout,
            ownerCt = owner.ownerCt,
            ownerCtSize, activeSize, ownerSize, width, height;

        owner.afterComponentLayout(this);

        // Run the container layout if it exists (layout for child items)
        if (layout && layout.isLayout) {
            layout.layout();
        }

        if (ownerCt && ownerCt.componentLayout && ownerCt.componentLayout.monitorChildren && !ownerCt.componentLayout.layoutBusy) {
            ownerCt.componentLayout.childrenChanged = true;

            // If the ownerCt isn't running a containerLayout, run doComponentLayout now.
            if (ownerCt.layout && !ownerCt.layout.layoutBusy) {
                if (ownerCt.layout.type == 'autocontainer') {
                    ownerCt.doComponentLayout(width, height);
                }
                else {
                    ownerCt.layout.layout();
                }
            }
        }
    }
});
