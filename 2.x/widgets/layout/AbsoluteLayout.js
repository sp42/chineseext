/**
 * @class Ext.layout.AbsoluteLayout
 * @extends Ext.layout.AnchorLayout
 * <p>继承自{@link Ext.layout.AnchorLayout}，增加了通过组件配置项标准的x、y来定位的能力。</p>
 */
Ext.layout.AbsoluteLayout = Ext.extend(Ext.layout.AnchorLayout, {
    extraCls: 'x-abs-layout-item',
    onLayout : function(ct, target){
        target.position();
        Ext.layout.AbsoluteLayout.superclass.onLayout.call(this, ct, target);
    }
    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['absolute'] = Ext.layout.AbsoluteLayout;