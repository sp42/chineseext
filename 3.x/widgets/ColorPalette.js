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
 * @class Ext.ColorPalette
 * @extends Ext.Component
 * 选择颜色使用的简单的调色板。调色板可在任意窗口内渲染。
 * Simple color palette class for choosing colors.  The palette can be rendered to any container.<br />
 * 这里是一个典型用例:Here's an example of typical usage:
 * <pre><code>
var cp = new Ext.ColorPalette({value:'993300'});  // 初始化时选中的颜色 initial selected color
cp.render('my-div');

cp.on('select', function(palette, selColor){
    // 用selColor来做此事情 do something with selColor
});
</code></pre>
 * @constructor 创建一个ColorPalette对象。Create a new ColorPalette
 * @param {Object} config 配置项对象 The config object
 */
Ext.ColorPalette = function(config){
    Ext.ColorPalette.superclass.constructor.call(this, config);
    this.addEvents(
        /**
	     * @event select
	     * 颜色被选取时触发。
	     * Fires when a color is selected
	     * @param {ColorPalette} this
	     * @param {String} color 6位16进制颜色编码（没有#符号）。The 6-digit color hex code (without the # symbol)
	     */
        'select'
    );

    if(this.handler){
        this.on("select", this.handler, this.scope, true);
    }
};
Ext.extend(Ext.ColorPalette, Ext.Component, {
	/**
	 * @cfg {String} tpl 用于渲染该组件的XTemplate字符串。
	 * An existing XTemplate instance to be used in place of the default template for rendering the component.
	 */
    /**
     * @cfg {String} itemCls 容器元素应用的 CSS 样式类（默认为 "x-color-palette"）。
     * The CSS class to apply to the containing element (defaults to "x-color-palette")
     */
    itemCls : "x-color-palette",
    /**
     * @cfg {String} value
     * 初始化时高亮的颜色（必须为不包含 # 符号的6位16进制颜色编码）。注意16进制编码是区分大小写的。
     * The initial color to highlight (should be a valid 6-digit color hex code without the # symbol).  Note that
     * the hex codes are case-sensitive.
     */
    value : null,
    clickEvent:'click',
    // private
    ctype: "Ext.ColorPalette",

    /**
     * @cfg {Boolean} allowReselect 如果值为 true，则在触发{@link #select}事件时重选已经选择的颜色。
     * If set to true then reselecting a color that is already selected fires the {@link #select} event
     */
    allowReselect : false,

    /**
     * <p>一个由6位16进制颜色编码组成的数组(不包含#符号)。此数组可以包含任意个数颜色，
     * 且每个16进制编码必须是唯一的。调色板的宽度可以通过设置样式表中的'x-color-palette'类的width属性来控制（或者指定一个制定的类），  
     * 因此你可以通过调整颜色的个数和调色板的宽度来使调色板保持对称。
     * An array of 6-digit color hex code strings (without the # symbol).  This array can contain any number
     * of colors, and each hex code should be unique.  The width of the palette is controlled via CSS by adjusting
     * the width property of the 'x-color-palette' class (or assigning a custom class), so you can balance the number
     * of colors with the width setting until the box is symmetrical.</p>
     * <p>你可以根据需要覆写单个的颜色: You can override individual colors if needed:</p>
     * <pre><code>
var cp = new Ext.ColorPalette();
cp.colors[0] = "FF0000";  // 把第一个选框换成红色 change the first box to red
</code></pre>

或者自己提供一个定制的数组来实现完全控制: Or you can provide a custom array of your own for complete control:
<pre><code>
var cp = new Ext.ColorPalette();
cp.colors = ["000000", "993300", "333300"];
</code></pre>
     * @type Array
     */
    colors : [
        "000000", "993300", "333300", "003300", "003366", "000080", "333399", "333333",
        "800000", "FF6600", "808000", "008000", "008080", "0000FF", "666699", "808080",
        "FF0000", "FF9900", "99CC00", "339966", "33CCCC", "3366FF", "800080", "969696",
        "FF00FF", "FFCC00", "FFFF00", "00FF00", "00FFFF", "00CCFF", "993366", "C0C0C0",
        "FF99CC", "FFCC99", "FFFF99", "CCFFCC", "CCFFFF", "99CCFF", "CC99FF", "FFFFFF"
    ],

    // private
    onRender : function(container, position){
        var t = this.tpl || new Ext.XTemplate(
            '<tpl for="."><a href="#" class="color-{.}" hidefocus="on"><em><span style="background:#{.}" unselectable="on">&#160;</span></em></a></tpl>'
        );
        var el = document.createElement("div");
        el.id = this.getId();
        el.className = this.itemCls;
        t.overwrite(el, this.colors);
        container.dom.insertBefore(el, position);
        this.el = Ext.get(el);
        this.mon(this.el, this.clickEvent, this.handleClick, this, {delegate: 'a'});
        if(this.clickEvent != 'click'){
        	this.mon(this.el, 'click', Ext.emptyFn, this, {delegate: 'a', preventDefault: true});
        }
    },

    // private
    afterRender : function(){
        Ext.ColorPalette.superclass.afterRender.call(this);
        if(this.value){
            var s = this.value;
            this.value = null;
            this.select(s);
        }
    },

    // private
    handleClick : function(e, t){
        e.preventDefault();
        if(!this.disabled){
            var c = t.className.match(/(?:^|\s)color-(.{6})(?:\s|$)/)[1];
            this.select(c.toUpperCase());
        }
    },

    /**
     * 在调色板中选择指定的颜色（触发{@link #select}事件）。
     * Selects the specified color in the palette (fires the {@link #select} event)
     * @param {String} color 6位16进制颜色编码（如果含有#符号则自动舍去）。A valid 6-digit color hex code (# will be stripped if included)
     */
    select : function(color){
        color = color.replace("#", "");
        if(color != this.value || this.allowReselect){
            var el = this.el;
            if(this.value){
                el.child("a.color-"+this.value).removeClass("x-color-palette-sel");
            }
            el.child("a.color-"+color).addClass("x-color-palette-sel");
            this.value = color;
            this.fireEvent("select", this, color);
        }
    }

    /**
     * @cfg {String} autoEl @hide
     */
});
Ext.reg('colorpalette', Ext.ColorPalette);