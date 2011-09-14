/**
 * @class Ext.Tip
 * @extends Ext.Panel
 * 这是 {@link Ext.QuickTip} 和 {@link Ext.Tooltip} 对象的基类，提供了所有基于提示的类所必须的基础布局和定位。
 * 这个类可以直接用于简单的、静态定位、需要编程显示的提示，还可以提供实现自定义扩展的提示。
 * @constructor
 * 创建一个 Tip 对象
 * @param {Object} config 配置选项对象
 */
Ext.Tip = Ext.extend(Ext.Panel, {
    /**
     * @cfg {Boolean} closable 值为 true 则在工具提示的头部渲染一个关闭按钮（默认为 false）。
     */
    /**
     * @cfg {Number} minWidth 以像素为单位表示的提示的最小宽度（默认为 40）。
     */
    minWidth : 40,
    /**
     * @cfg {Number} maxWidth 以像素为单位表示的提示的最大宽度（默认为 300）。
     */
    maxWidth : 300,
    /**
     * @cfg {Boolean/String} shadow 值为 true 或者 "sides" 时展现默认效果，值为 "frame" 时则在4个方向展现阴影，值为 "drop" 时则在右下角展现阴影（默认为 "sides"）。
     */
    shadow : "sides",
    /**
     * @cfg {String} defaultAlign <b>试验性的</b>。默认为 {@link Ext.Element#alignTo} 锚点定位值，用来让该提示定位到它所属元素的关联位置（默认为 "tl-bl?"）。
     */
    defaultAlign : "tl-bl?",
    autoRender: true,
    quickShowInterval : 250,

    // private panel overrides
    frame:true,
    hidden:true,
    baseCls: 'x-tip',
    floating:{shadow:true,shim:true,useDisplay:true,constrain:false},
    autoHeight:true,

    // private
    initComponent : function(){
        Ext.Tip.superclass.initComponent.call(this);
        if(this.closable && !this.title){
            this.elements += ',header';
        }
    },

    // private
    afterRender : function(){
        Ext.Tip.superclass.afterRender.call(this);
        if(this.closable){
            this.addTool({
                id: 'close',
                handler: this.hide,
                scope: this
            });
        }
    },

    /**
     * 在指定的 XY 坐标处显示该提示。用法示例：
     * <pre><code>
// 在 x:50、y:100 处显示提示
tip.showAt([50,100]);
</code></pre>
     * @param {Array} xy 一个由 x、y 坐标组成的数组
     */
    showAt : function(xy){
        Ext.Tip.superclass.show.call(this);
        if(this.measureWidth !== false && (!this.initialConfig || typeof this.initialConfig.width != 'number')){
            var bw = this.body.getTextWidth();
            if(this.title){
                bw = Math.max(bw, this.header.child('span'）。getTextWidth(this.title));
            }
            bw += this.getFrameWidth() + (this.closable ? 20 : 0) + this.body.getPadding("lr");
            this.setWidth(bw.constrain(this.minWidth, this.maxWidth));
        }
        if(this.constrainPosition){
            xy = this.el.adjustForConstraints(xy);
        }
        this.setPagePosition(xy[0], xy[1]);
    },

    /**
     * <b>试验性的</b>。根据标准的 {@link Ext.Element#alignTo} 锚点定位值在另一个元素的关联位置上显示该提示。用法示例：
     * <pre><code>
// 在默认位置显示该提示 ('tl-br?')
tip.showBy('my-el');

// 将该提示的左上角对齐到元素的右上角
tip.showBy('my-el', 'tl-tr');
</code></pre>
     * @param {Mixed} el 一个 HTMLElement、Ext.Element 或者要对齐的目标元素的 ID 文本
     * @param {String} position （可选）一个有效的 {@link Ext.Element#alignTo} 锚点定位值（默认为 'tl-br?' 或者 {@link #defaultAlign} 中指定的值，如果设置过该值的话）。
     */
    showBy : function(el, pos){
        if(!this.rendered){
            this.render(Ext.getBody());
        }
        this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign));
    },

    initDraggable : function(){
        this.dd = new Ext.Tip.DD(this, typeof this.draggable == 'boolean' ? null : this.draggable);
        this.header.addClass('x-tip-draggable');
    }
});

// private - custom Tip DD implementation
Ext.Tip.DD = function(tip, config){
    Ext.apply(this, config);
    this.tip = tip;
    Ext.Tip.DD.superclass.constructor.call(this, tip.el.id, 'WindowDD-'+tip.id);
    this.setHandleElId(tip.header.id);
    this.scroll = false;
};

Ext.extend(Ext.Tip.DD, Ext.dd.DD, {
    moveOnly:true,
    scroll:false,
    headerOffsets:[100, 25],
    startDrag : function(){
        this.tip.el.disableShadow();
    },
    endDrag : function(e){
        this.tip.el.enableShadow(true);
    }
});