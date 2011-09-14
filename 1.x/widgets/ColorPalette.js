/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.ColorPalette
 * @extends Ext.Component
 * 选择颜色使用的简单的调色板。调色板可在任意窗口内渲染。<br />
 * 这里是一个典型用例:
 * <pre><code>
var cp = new Ext.ColorPalette({value:'993300'});  // 初始化时选中的颜色
cp.render('my-div');

cp.on('select', function(palette, selColor){
    // 用 selColor 来做此事情
});
</code></pre>
 * @constructor
 * 创建一个 ColorPalette 对象
 * @param {Object} config 配置项对象
 */
Ext.ColorPalette = function(config){
    Ext.ColorPalette.superclass.constructor.call(this, config);
    this.addEvents({
        /**
	     * @event select
	     * 颜色被选取时触发
	     * @param {ColorPalette} this
	     * @param {String} color 6位16进制颜色编码(没有 # 符号)
	     */
        select: true
    });

    if(this.handler){
        this.on("select", this.handler, this.scope, true);
    }
};
Ext.extend(Ext.ColorPalette, Ext.Component, {
    /**
     * @cfg {String} itemCls
     * 容器元素应用的 CSS 样式类(默认为 "x-color-palette")
     */
    itemCls : "x-color-palette",
    /**
     * @cfg {String} value
     * 初始化时高亮的颜色(必须为不包含 # 符号的6位16进制颜色编码)。注意16进制编码是区分大小写的。
     */
    value : null,
    clickEvent:'click',
    // private
    ctype: "Ext.ColorPalette",

    /**
     * @cfg {Boolean} allowReselect 如果值为 true, 则在触发 select 事件时重选已经选择的颜色
     */
    allowReselect : false,

    /**
     * <p>一个由6位16进制颜色编码组成的数组(不包含 # 符号)。此数组可以包含任意个数颜色, 
     * 且每个16进制编码必须是唯一的。调色板的宽度可以通过设置样式表中的 'x-color-palette' 类的 width 属性来控制(或者指定一个定制类), 
     * 因此你可以通过调整颜色的个数和调色板的宽度来使调色板保持对称。</p>
     * <p>你可以根据需要覆写单个的颜色:</p>
     * <pre><code>
var cp = new Ext.ColorPalette();
cp.colors[0] = "FF0000";  // 把第一个选框换成红色
</code></pre>

或者自己提供一个定制的数组来实现完全控制:
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
        var t = new Ext.MasterTemplate(
            '<tpl><a href="#" class="color-{0}" hidefocus="on"><em><span style="background:#{0}" unselectable="on">&#160;</span></em></a></tpl>'
        );
        var c = this.colors;
        for(var i = 0, len = c.length; i < len; i++){
            t.add([c[i]]);
        }
        var el = document.createElement("div");
        el.className = this.itemCls;
        t.overwrite(el);
        container.dom.insertBefore(el, position);
        this.el = Ext.get(el);
        this.el.on(this.clickEvent, this.handleClick,  this, {delegate: "a"});
        if(this.clickEvent != 'click'){
            this.el.on('click', Ext.emptyFn,  this, {delegate: "a", preventDefault:true});
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
     * 在调色板中选择指定的颜色(触发 select 事件)
     * @param {String} color 6位16进制颜色编码(如果含有 # 符号则自动舍去)
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
});