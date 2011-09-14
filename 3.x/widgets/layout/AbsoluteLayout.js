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
 * @class Ext.layout.AbsoluteLayout
 * @extends Ext.layout.AnchorLayout
 * <p>此类是{@link Ext.layout.AnchorLayout}的子类，它增加了通过标准的x、y的配置项来定位的能力。<br />
 * Inherits the anchoring of {@link Ext.layout.AnchorLayout} and adds the ability for x/y positioning using the
 * standard x and y component config options.</p>
 * <p>
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'absolute'的方式创建该类，一般很少通过关键字new直接使用该类。<br />
 * This class is intended to be extended or created via the <tt><b>{@link Ext.Container#layout layout}</b></tt>
 * configuration property.  See <tt><b>{@link Ext.Container#layout}</b></tt> for additional details.</p>
 * <p>用法举例：Example usage:</p>
 * <pre><code>
var form = new Ext.form.FormPanel({
    title: 'Absolute Layout',
    layout:'absolute',
    layoutConfig: {
        // 布局的配置项就在这里配置 layout-specific configs go here
        extraCls: 'x-abs-layout-item'
    },
    baseCls: 'x-plain',
    url:'save-form.php',
    defaultType: 'textfield',
    items: [{
        x: 0,
        y: 5,
        xtype:'label',
        text: 'Send To:'
    },{
        x: 60,
        y: 0,
        name: 'to',
        anchor:'100%'  // 由百分比来定位宽度 anchor width by percentage
    },{
        x: 0,
        y: 35,
        xtype:'label',
        text: 'Subject:'
    },{
        x: 60,
        y: 30,
        name: 'subject',
        anchor: '100%'  // 由百分比来定位宽度 anchor width by percentage
    },{
        x:0,
        y: 60,
        xtype: 'textarea',
        name: 'msg',
        anchor: '100% 100%'  // 由百分比来定位高、宽 anchor width and height
    }]
});
</code></pre>
 */
Ext.layout.AbsoluteLayout = Ext.extend(Ext.layout.AnchorLayout, {
    /**
     * @cfg {String} extraCls
     * 加入的容器的额外的CSS样式类（默认为'x-column'）。要修改样式起来这样就很方便了，同时也方便为子元素加入样式。
     * An optional extra CSS class that will be added to the container (defaults to 'x-abs-layout-item').  This can be useful for
     * adding customized styles to the container or any of its children using standard CSS rules.
     */
    extraCls: '',

    onLayout : function(ct, target){
        target.position();
        this.paddingLeft = target.getPadding('r');
        this.paddingTop = target.getPadding('t');

        Ext.layout.AbsoluteLayout.superclass.onLayout.call(this, ct, target);
    },

    // private
    adjustWidthAnchor : function(value, comp){
        return value ? value - comp.getPosition(true)[0] + this.paddingLeft : value;
    },

    // private
    adjustHeightAnchor : function(value, comp){
        return  value ? value - comp.getPosition(true)[1] + this.paddingTop : value;
    }
    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['absolute'] = Ext.layout.AbsoluteLayout;