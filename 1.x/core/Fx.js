/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://www.extjs.com/license
 */


//通知 Element 对象 FX 的方法可用
Ext.enableFx = true;

/**
 * @class Ext.Fx
 * <p>这是一个提供基础动画和视觉效果支持的类。<b>注意：</b>此类被引用后会自动应用于 {@link Ext.Element} 的接口，
 * 因此所有的效果必须通过 Element 对象来实现。反过来说，既然 Element 对象实际上并没有定义这些效果，
 * Ext.Fx 类<b>必须</b>被 Element 对象引用后才能使那些效果生效。</p><br/>
 *
 * <p>值得注意的是，虽然 Fx 的方法和许多非 Fx Element 对象的方法支持“方法链”，即他们返回 Element 对象本身作为方法的返回值，
 * 但是并非每次都能将两个对象混合在一个方法链中。Fx 的方法使用一个内部的效果队列以使每个效果能够在适当的时候按次序展现。
 * 另一方面，对于非 Fx 的方法则没有这样的一个内部队列，它们总是立即生效。正因为如此，虽然可以在一个单链中混合调用 Fx 和非 Fx 的方法，
 * 但是并非总能得到预期的结果，而且必须小心处理类似的情况。</p><br/>
 *
 * <p>移动类的效果支持8个方向的定位锚，这意味着你可以选择 Element 对象所有8个不同的锚点中的任意一个来作为动画的起点或终点。
 * 下面是所有支持的定位锚点位置：</p>
<pre>
值     说明
-----  -----------------------------
tl     左上角
t      顶部中央
tr     右上角
l      左边中央
r      右边中央
bl     左下角
b      底部中央
br     右下角
</pre>
<<<<<<< .mine
 * <b>尽管某些 Fx 方法可以接受特殊的自定义配置参数，然而下面的配置选项区域内显示了可供所有 Fx 方法使用的公共选项。</b>
 * @cfg {Function} callback 指定当效果完成时调用的函数
 * @cfg {Object} scope 特效函数的作用域
 * @cfg {String} easing 指定特效函数使用的合法的 Easing 值
 * @cfg {String} afterCls 特效完成后应用的CSS样式类
 * @cfg {Number} duration 以秒为单位设置的特效持续时间
 * @cfg {Boolean} remove 特效完成后是否从 DOM 树中完全删除 Element 对象
 * @cfg {Boolean} useDisplay 隐藏 Element 对象时是否使用 <i>display</i> CSS样式属性替代 <i>visibility</i>属性（仅仅应用于那些结束后隐藏 Element 对象的等效，其他的等效无效）
 * @cfg {String/Object/Function} afterStyle 特效完成后应用于 Element 对象的指定样式的字符串，例如："width:100px"，或者形如 {width:"100px"} 的对象，或者返回值为类似形式的函数
 * @cfg {Boolean} block 当特效生效时是否阻塞队列中的其他特效
 * @cfg {Boolean} concurrent 是否允许特效与队列中的下一个特效并行生效，或者确保他们在运行队列中
 * @cfg {Boolean} stopFx 是否在当前特效完成后停止并删除后续（并发）的特效
 */
Ext.Fx = {
	/**
	 * 将元素滑入到视图中。作为可选参数传入的定位锚点将被设置为滑入特效的起始点。该函数会在需要的时候自动将元素与一个固定尺寸的容器封装起来。
	 * 有效的定位锚点可以参见 Fx 类的概述。
	 * 用法：
	 *<pre><code>
// 默认情况：将元素从顶部滑入
el.slideIn();

// 自定义：在2秒钟内将元素从右边滑入
el.slideIn('r', { duration: 2 });

// 常见的配置选项及默认值
el.slideIn('t', {
    easing: 'easeOut',
    duration: .5
});
</code></pre>
	 * @param {String} anchor （可选）有效的 Fx 定位锚点之一（默认为顶部：'t'）
	 * @param {Object} options （可选）由任何 Fx 的配置选项构成的对象
	 * @return {Ext.Element} Element 对象
	 */
    slideIn : function(anchor, o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){

            anchor = anchor || "t";

            // fix display to visibility
            this.fixDisplay();

            // restore values after effect
            var r = this.getFxRestore();
            var b = this.getBox();
            // fixed size for slide
            this.setSize(b);

            // wrap if needed
            var wrap = this.fxWrap(r.pos, o, "hidden");

            var st = this.dom.style;
            st.visibility = "visible";
            st.position = "absolute";

            // clear out temp styles after slide and unwrap
            var after = function(){
                el.fxUnwrap(wrap, r.pos, o);
                st.width = r.width;
                st.height = r.height;
                el.afterFx(o);
            };
            // time to calc the positions
            var a, pt = {to: [b.x, b.y]}, bw = {to: b.width}, bh = {to: b.height};

            switch(anchor.toLowerCase()){
                case "t":
                    wrap.setSize(b.width, 0);
                    st.left = st.bottom = "0";
                    a = {height: bh};
                break;
                case "l":
                    wrap.setSize(0, b.height);
                    st.right = st.top = "0";
                    a = {width: bw};
                break;
                case "r":
                    wrap.setSize(0, b.height);
                    wrap.setX(b.right);
                    st.left = st.top = "0";
                    a = {width: bw, points: pt};
                break;
                case "b":
                    wrap.setSize(b.width, 0);
                    wrap.setY(b.bottom);
                    st.left = st.top = "0";
                    a = {height: bh, points: pt};
                break;
                case "tl":
                    wrap.setSize(0, 0);
                    st.right = st.bottom = "0";
                    a = {width: bw, height: bh};
                break;
                case "bl":
                    wrap.setSize(0, 0);
                    wrap.setY(b.y+b.height);
                    st.right = st.top = "0";
                    a = {width: bw, height: bh, points: pt};
                break;
                case "br":
                    wrap.setSize(0, 0);
                    wrap.setXY([b.right, b.bottom]);
                    st.left = st.top = "0";
                    a = {width: bw, height: bh, points: pt};
                break;
                case "tr":
                    wrap.setSize(0, 0);
                    wrap.setX(b.x+b.width);
                    st.left = st.bottom = "0";
                    a = {width: bw, height: bh, points: pt};
                break;
            }
            this.dom.style.visibility = "visible";
            wrap.show();

            arguments.callee.anim = wrap.fxanim(a,
                o,
                'motion',
                .5,
                'easeOut', after);
        });
        return this;
    },

	/**
	 * 将元素从视图中滑出。作为可选参数传入的定位锚点将被设置为滑出特效的结束点。特效结束后，元素会被隐藏（visibility = 'hidden'），
	 * 但是块元素仍然会在 document 对象中占据空间。如果需要将元素从 DOM 树删除，则使用'remove'配置选项。
	 * 该函数会在需要的时候自动将元素与一个固定尺寸的容器封装起来。有效的定位锚点可以参见 Fx 类的概述。
	 * 用法：
	 *<pre><code>
// 默认情况：将元素从顶部滑出
el.slideOut();

// 自定义：在2秒钟内将元素从右边滑出
el.slideOut('r', { duration: 2 });

// 常见的配置选项及默认值
el.slideOut('t', {
    easing: 'easeOut',
    duration: .5,
    remove: false,
    useDisplay: false
});
</code></pre>
	 * @param {String} anchor （可选）有效的 Fx 定位锚点之一（默认为顶部：'t'）
	 * @param {Object} options （可选）由任何 Fx 的配置选项构成的对象
	 * @return {Ext.Element} Element 对象
	 */
    slideOut : function(anchor, o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){

            anchor = anchor || "t";

            // restore values after effect
            var r = this.getFxRestore();

            var b = this.getBox();
            // fixed size for slide
            this.setSize(b);

            // wrap if needed
            var wrap = this.fxWrap(r.pos, o, "visible");

            var st = this.dom.style;
            st.visibility = "visible";
            st.position = "absolute";

            wrap.setSize(b);

            var after = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else{
                    el.hide();
                }

                el.fxUnwrap(wrap, r.pos, o);

                st.width = r.width;
                st.height = r.height;

                el.afterFx(o);
            };

            var a, zero = {to: 0};
            switch(anchor.toLowerCase()){
                case "t":
                    st.left = st.bottom = "0";
                    a = {height: zero};
                break;
                case "l":
                    st.right = st.top = "0";
                    a = {width: zero};
                break;
                case "r":
                    st.left = st.top = "0";
                    a = {width: zero, points: {to:[b.right, b.y]}};
                break;
                case "b":
                    st.left = st.top = "0";
                    a = {height: zero, points: {to:[b.x, b.bottom]}};
                break;
                case "tl":
                    st.right = st.bottom = "0";
                    a = {width: zero, height: zero};
                break;
                case "bl":
                    st.right = st.top = "0";
                    a = {width: zero, height: zero, points: {to:[b.x, b.bottom]}};
                break;
                case "br":
                    st.left = st.top = "0";
                    a = {width: zero, height: zero, points: {to:[b.x+b.width, b.bottom]}};
                break;
                case "tr":
                    st.left = st.bottom = "0";
                    a = {width: zero, height: zero, points: {to:[b.right, b.y]}};
                break;
            }

            arguments.callee.anim = wrap.fxanim(a,
                o,
                'motion',
                .5,
                "easeOut", after);
        });
        return this;
    },

	/**
	 * 渐隐元素的同时还伴随着向各个方向缓慢地展开。特效结束后，元素会被隐藏（visibility = 'hidden'），
	 * 但是块元素仍然会在 document 对象中占据空间。如果需要将元素从 DOM 树删除，则使用'remove'配置选项。
	 * 用法：
	 *<pre><code>
// 默认
el.puff();

// 常见的配置选项及默认值
el.puff({
    easing: 'easeOut',
    duration: .5,
    remove: false,
    useDisplay: false
});
</code></pre>
	 * @param {Object} options （可选）由任何 Fx 的配置选项构成的对象
	 * @return {Ext.Element} Element 对象
	 */
    puff : function(o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            this.clearOpacity();
            this.show();

            // restore values after effect
            var r = this.getFxRestore();
            var st = this.dom.style;

            var after = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else{
                    el.hide();
                }

                el.clearOpacity();

                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                st.fontSize = '';
                el.afterFx(o);
            };

            var width = this.getWidth();
            var height = this.getHeight();

            arguments.callee.anim = this.fxanim({
                    width : {to: this.adjustWidth(width * 2)},
                    height : {to: this.adjustHeight(height * 2)},
                    points : {by: [-(width * .5), -(height * .5)]},
                    opacity : {to: 0},
                    fontSize: {to:200, unit: "%"}
                },
                o,
                'motion',
                .5,
                "easeOut", after);
        });
        return this;
    },

	/**
	 * 类似单击过后般地闪烁一下元素，然后从元素的中间开始收缩（类似于关闭电视机时的效果）。
	 * 特效结束后，元素会被隐藏（visibility = 'hidden'），但是块元素仍然会在 document 对象中占据空间。
	 * 如果需要将元素从 DOM 树删除，则使用'remove'配置选项。
	 * 用法：
	 *<pre><code>
// 默认
el.switchOff();

// 所有的配置选项及默认值
el.switchOff({
    easing: 'easeIn',
    duration: .3,
    remove: false,
    useDisplay: false
});
</code></pre>
	 * @param {Object} options （可选）由任何 Fx 的配置选项构成的对象
	 * @return {Ext.Element} Element 对象
	 */
    switchOff : function(o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            this.clearOpacity();
            this.clip();

            // restore values after effect
            var r = this.getFxRestore();
            var st = this.dom.style;

            var after = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else{
                    el.hide();
                }

                el.clearOpacity();
                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;

                el.afterFx(o);
            };

            this.fxanim({opacity:{to:0.3}}, null, null, .1, null, function(){
                this.clearOpacity();
                (function(){
                    this.fxanim({
                        height:{to:1},
                        points:{by:[0, this.getHeight() * .5]}
                    }, o, 'motion', 0.3, 'easeIn', after);
                }).defer(100, this);
            });
        });
        return this;
    },

    /**
     * 根据设置的颜色高亮显示 Element 对象（默认情况下应用于 background-color 属性，但是也可以通过"attr"配置选项来改变），
     * 然后渐隐为原始颜色。如果原始颜色不可用，你应该设置"endColor"配置选项以免动画结束后被清除。
     * 用法：
<pre><code>
// 默认情况：高亮显示的背景颜色为黄色
el.highlight();

// 自定义：高亮显示前景字符颜色为蓝色并持续2秒
el.highlight("0000ff", { attr: 'color', duration: 2 });

// 常见的配置选项及默认值
el.highlight("ffff9c", {
    attr: "background-color", //可以是任何能够把值设置成颜色代码的 CSS 属性
    endColor: (current color) or "ffffff",
    easing: 'easeIn',
    duration: 1
});
</code></pre>
     * @param {String} color （可选）高亮颜色。必须为不以 # 开头的6位16进制字符（默认为黄色：'ffff9c'）
     * @param {Object} options （可选）由任何 Fx 的配置选项构成的对象
     * @return {Ext.Element} Element 对象
     */
    highlight : function(color, o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            color = color || "ffff9c";
            attr = o.attr || "backgroundColor";

            this.clearOpacity();
            this.show();

            var origColor = this.getColor(attr);
            var restoreColor = this.dom.style[attr];
            endColor = (o.endColor || origColor) || "ffffff";

            var after = function(){
                el.dom.style[attr] = restoreColor;
                el.afterFx(o);
            };

            var a = {};
            a[attr] = {from: color, to: endColor};
            arguments.callee.anim = this.fxanim(a,
                o,
                'color',
                1,
                'easeIn', after);
        });
        return this;
    },

   /**
    * 展示一个展开的波纹，伴随着渐隐的边框以突出显示 Element 对象。
    * 用法：
<pre><code>
// 默认情况：一个淡蓝色的波纹
el.frame();

// 自定义：三个红色的波纹并持续3秒
el.frame("ff0000", 3, { duration: 3 });

// 常见的配置选项及默认值
el.frame("C3DAF9", 1, {
    duration: 1 //整个动画持续的时间（不是每个波纹持续的时间）
    // 注意：这里不能使用 Easing 选项在，即使被包含了也会被忽略
});
</code></pre>
    * @param {String} color （可选）边框的颜色。必须为不以 # 开头的6位16进制字符（默认为淡蓝色色：'C3DAF9'）
    * @param {Number} count （可选）要显示的波纹的个数（默认为1）
    * @param {Object} options （可选）由任何 Fx 的配置选项构成的对象
    * @return {Ext.Element} Element 对象
    */
    frame : function(color, count, o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            color = color || "#C3DAF9";
            if(color.length == 6){
                color = "#" + color;
            }
            count = count || 1;
            duration = o.duration || 1;
            this.show();

            var b = this.getBox();
            var animFn = function(){
                var proxy = this.createProxy({

                     style:{
                        visbility:"hidden",
                        position:"absolute",
                        "z-index":"35000", // yee haw
                        border:"0px solid " + color
                     }
                  });
                var scale = Ext.isBorderBox ? 2 : 1;
                proxy.animate({
                    top:{from:b.y, to:b.y - 20},
                    left:{from:b.x, to:b.x - 20},
                    borderWidth:{from:0, to:10},
                    opacity:{from:1, to:0},
                    height:{from:b.height, to:(b.height + (20*scale))},
                    width:{from:b.width, to:(b.width + (20*scale))}
                }, duration, function(){
                    proxy.remove();
                });
                if(--count > 0){
                     animFn.defer((duration/2)*1000, this);
                }else{
                    el.afterFx(o);
                }
            };
            animFn.call(this);
        });
        return this;
    },

   /**
    * 在任何后续的等效开始之前创建一次暂停。如果队列中没有后续特效则没有效果。
    * 用法：
<pre><code>
el.pause(1);
</code></pre>
    * @param {Number} seconds 以秒为单位的暂停时间
    * @return {Ext.Element} Element 对象
    */
    pause : function(seconds){
        var el = this.getFxEl();
        var o = {};

        el.queueFx(o, function(){
            setTimeout(function(){
                el.afterFx(o);
            }, seconds * 1000);
        });
        return this;
    },

   /**
    * 将元素从透明渐变为不透明。结束时的透明度可以根据"endOpacity"选项来指定。
    * 用法：
<pre><code>
// 默认情况：将可见度由 0 渐变到 100%
el.fadeIn();

// 自定义：在2秒钟之内将可见度由 0 渐变到 75%
el.fadeIn({ endOpacity: .75, duration: 2});

// 常见的配置选项及默认值
el.fadeIn({
    endOpacity: 1, //可以是 0 到 1 之前的任意值（例如：.5）
    easing: 'easeOut',
    duration: .5
});
</code></pre>
    * @param {Object} options （可选）由任何 Fx 的配置选项构成的对象
    * @return {Ext.Element} Element 对象
    */
    fadeIn : function(o){
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function(){
            this.setOpacity(0);
            this.fixDisplay();
            this.dom.style.visibility = 'visible';
            var to = o.endOpacity || 1;
            arguments.callee.anim = this.fxanim({opacity:{to:to}},
                o, null, .5, "easeOut", function(){
                if(to == 1){
                    this.clearOpacity();
                }
                el.afterFx(o);
            });
        });
        return this;
    },

   /**
    * 将元素从不透明渐变为透明。结束时的透明度可以根据"endOpacity"选项来指定。
    * 用法：
<pre><code>
// 默认情况：将元素的可见度由当前值渐变到 0
el.fadeOut();

// 自定义：在2秒钟内将元素的可见度由当前值渐变到 25%
el.fadeOut({ endOpacity: .25, duration: 2});

// 常见的配置选项及默认值
el.fadeOut({
    endOpacity: 0, 可以是 0 到 1 之前的任意值（例如：.5）
    easing: 'easeOut',
    duration: .5
    remove: false,
    useDisplay: false
});
</code></pre>
    * @param {Object} options （可选）由任何 Fx 的配置选项构成的对象
    * @return {Ext.Element} Element 对象
    */
    fadeOut : function(o){
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function(){
            arguments.callee.anim = this.fxanim({opacity:{to:o.endOpacity || 0}},
                o, null, .5, "easeOut", function(){
                if(this.visibilityMode == Ext.Element.DISPLAY || o.useDisplay){
                     this.dom.style.display = "none";
                }else{
                     this.dom.style.visibility = "hidden";
                }
                this.clearOpacity();
                el.afterFx(o);
            });
        });
        return this;
    },

   /**
    * 以动画展示元素从开始的高度/宽度转换到结束的高度/宽度。
    * 用法：
<pre><code>
// 将宽度和高度设置为 100x100 象素
el.scale(100, 100);

// 常见的配置选项及默认值。如果给定值为 null，则高度和宽度默认被设置为元素已有的值。
el.scale(
    [element's width],
    [element's height], {
    easing: 'easeOut',
    duration: .35
});
</code></pre>
    * @param {Number} width  新的宽度（传递 undefined 则保持原始宽度）
    * @param {Number} height  新的高度（传递 undefined 则保持原始高度）
    * @param {Object} options （可选）由任何 Fx 的配置选项构成的对象
    * @return {Ext.Element} Element 对象
    */
    scale : function(w, h, o){
        this.shift(Ext.apply({}, o, {
            width: w,
            height: h
        }));
        return this;
    },

   /**
    * 以动画展示元素任意组合属性的改变，如元素的尺寸、位置坐标和（或）透明度。
    * 如果以上属性中的任意一个没有在配置选项对象中指定则该属性不会发生改变。
    * 为了使该特效生效，则必须在配置选项对象中设置至少一个新的尺寸、位置坐标或透明度属性。
    * 用法：
<pre><code>
// 将元素水平地滑动到X坐标值为200的位置，同时还伴随着高度和透明度的改变
el.shift({ x: 200, height: 50, opacity: .8 });

// 常见的配置选项及默认值。
el.shift({
    width: [element's width],
    height: [element's height],
    x: [element's x position],
    y: [element's y position],
    opacity: [element's opacity],
    easing: 'easeOut',
    duration: .35
});
</code></pre>
    * @param {Object} options 由任何 Fx 的配置选项构成的对象
    * @return {Ext.Element} Element 对象
    */
    shift : function(o){
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function(){
            var a = {}, w = o.width, h = o.height, x = o.x, y = o.y,  op = o.opacity;
            if(w !== undefined){
                a.width = {to: this.adjustWidth(w)};
            }
            if(h !== undefined){
                a.height = {to: this.adjustHeight(h)};
            }
            if(x !== undefined || y !== undefined){
                a.points = {to: [
                    x !== undefined ? x : this.getX(),
                    y !== undefined ? y : this.getY()
                ]};
            }
            if(op !== undefined){
                a.opacity = {to: op};
            }
            if(o.xy !== undefined){
                a.points = {to: o.xy};
            }
            arguments.callee.anim = this.fxanim(a,
                o, 'motion', .35, "easeOut", function(){
                el.afterFx(o);
            });
        });
        return this;
    },

	/**
	 * 将元素从视图滑出并伴随着渐隐。作为可选参数传入的定位锚点将被设置为滑出特效的结束点。
	 * 用法：
	 *<pre><code>
// 默认情况：将元素向下方滑出并渐隐
el.ghost();

// 自定义：在2秒钟内将元素向右边滑出并渐隐
el.ghost('r', { duration: 2 });

// 常见的配置选项及默认值。
el.ghost('b', {
    easing: 'easeOut',
    duration: .5
    remove: false,
    useDisplay: false
});
</code></pre>
	 * @param {String} anchor （可选）有效的 Fx 定位锚点之一（默认为底部：'b'）
	 * @param {Object} options （可选）由任何 Fx 的配置选项构成的对象
	 * @return {Ext.Element} Element 对象
	 */
    ghost : function(anchor, o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            anchor = anchor || "b";

            // restore values after effect
            var r = this.getFxRestore();
            var w = this.getWidth(),
                h = this.getHeight();

            var st = this.dom.style;

            var after = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else{
                    el.hide();
                }

                el.clearOpacity();
                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;

                el.afterFx(o);
            };

            var a = {opacity: {to: 0}, points: {}}, pt = a.points;
            switch(anchor.toLowerCase()){
                case "t":
                    pt.by = [0, -h];
                break;
                case "l":
                    pt.by = [-w, 0];
                break;
                case "r":
                    pt.by = [w, 0];
                break;
                case "b":
                    pt.by = [0, h];
                break;
                case "tl":
                    pt.by = [-w, -h];
                break;
                case "bl":
                    pt.by = [-w, h];
                break;
                case "br":
                    pt.by = [w, h];
                break;
                case "tr":
                    pt.by = [w, -h];
                break;
            }

            arguments.callee.anim = this.fxanim(a,
                o,
                'motion',
                .5,
                "easeOut", after);
        });
        return this;
    },

	/**
	 * 确保元素调用 syncFx 方法之后所有队列中的特效并发运行。它与 {@link #sequenceFx} 的作用是相反的。
	 * @return {Ext.Element} Element 对象
	 */
    syncFx : function(){
        this.fxDefaults = Ext.apply(this.fxDefaults || {}, {
            block : false,
            concurrent : true,
            stopFx : false
        });
        return this;
    },

	/**
	 * 确保元素调用 sequenceFx 方法之后所有队列中的特效依次运行。它与 {@link #syncFx} 的作用是相反的。
	 * @return {Ext.Element} Element 对象
	 */
    sequenceFx : function(){
        this.fxDefaults = Ext.apply(this.fxDefaults || {}, {
            block : false,
            concurrent : false,
            stopFx : false
        });
        return this;
    },

	/* @private */
    nextFx : function(){
        var ef = this.fxQueue[0];
        if(ef){
            ef.call(this);
        }
    },

	/**
	 * 当元素拥有任何活动的或队列中的特效时返回 true，否则返回 false。
	 * @return {Boolean} 如果元素拥有特效为 true，否则为 false。
	 */
    hasActiveFx : function(){
        return this.fxQueue && this.fxQueue[0];
    },

	/**
	 * 停止运行中的任何特效，如果元素的内部特效队列中还包含其他尚未开始的特效也一并清除。
	 * @return {Ext.Element} Element 对象
	 */
    stopFx : function(){
        if(this.hasActiveFx()){
            var cur = this.fxQueue[0];
            if(cur && cur.anim && cur.anim.isAnimated()){
                this.fxQueue = [cur]; // clear out others
                cur.anim.stop(true);
            }
        }
        return this;
    },

	/* @private */
    beforeFx : function(o){
        if(this.hasActiveFx() && !o.concurrent){
           if(o.stopFx){
               this.stopFx();
               return true;
           }
           return false;
        }
        return true;
    },

	/**
	 * 如果元素的当前特效阻塞了特效队列以致于在当前特效完成前其他特效无法排队，则返回 true。如果元素没有阻塞队列则返回 false。
	 * 此方法一般用于保证由用户动作启动的特效在相同的特效重新启动之前能够顺利完成（例如：即使用户点击了很多次也只触发一个效果）。
	 * @return {Boolean} 如果阻塞返回 true，否则返回 false。
	 */
    hasFxBlock : function(){
        var q = this.fxQueue;
        return q && q[0] && q[0].block;
    },

	/* @private */
    queueFx : function(o, fn){
        if(!this.fxQueue){
            this.fxQueue = [];
        }
        if(!this.hasFxBlock()){
            Ext.applyIf(o, this.fxDefaults);
            if(!o.concurrent){
                var run = this.beforeFx(o);
                fn.block = o.block;
                this.fxQueue.push(fn);
                if(run){
                    this.nextFx();
                }
            }else{
                fn.call(this);
            }
        }
        return this;
    },

	/* @private */
    fxWrap : function(pos, o, vis){
        var wrap;
        if(!o.wrap || !(wrap = Ext.get(o.wrap))){
            var wrapXY;
            if(o.fixPosition){
                wrapXY = this.getXY();
            }
            var div = document.createElement("div");
            div.style.visibility = vis;
            wrap = Ext.get(this.dom.parentNode.insertBefore(div, this.dom));
            wrap.setPositioning(pos);
            if(wrap.getStyle("position") == "static"){
                wrap.position("relative");
            }
            this.clearPositioning('auto');
            wrap.clip();
            wrap.dom.appendChild(this.dom);
            if(wrapXY){
                wrap.setXY(wrapXY);
            }
        }
        return wrap;
    },

	/* @private */
    fxUnwrap : function(wrap, pos, o){
        this.clearPositioning();
        this.setPositioning(pos);
        if(!o.wrap){
            wrap.dom.parentNode.insertBefore(this.dom, wrap.dom);
            wrap.remove();
        }
    },

	/* @private */
    getFxRestore : function(){
        var st = this.dom.style;
        return {pos: this.getPositioning(), width: st.width, height : st.height};
    },

	/* @private */
    afterFx : function(o){
        if(o.afterStyle){
            this.applyStyles(o.afterStyle);
        }
        if(o.afterCls){
            this.addClass(o.afterCls);
        }
        if(o.remove === true){
            this.remove();
        }
        Ext.callback(o.callback, o.scope, [this]);
        if(!o.concurrent){
            this.fxQueue.shift();
            this.nextFx();
        }
    },

	/* @private */
    getFxEl : function(){ //以支持composite element fx
        return Ext.get(this.dom);
    },

	/* @private */
    fxanim : function(args, opt, animType, defaultDur, defaultEase, cb){
        animType = animType || 'run';
        opt = opt || {};
        var anim = Ext.lib.Anim[animType](
            this.dom, args,
            (opt.duration || defaultDur) || .35,
            (opt.easing || defaultEase) || 'easeOut',
            function(){
                Ext.callback(cb, this);
            },
            this
        );
        opt.anim = anim;
        return anim;
    }
};

//向后兼容
Ext.Fx.resize = Ext.Fx.scale;

//被引用后，Ext.Fx 自动应用到 Element 对象，以便所有基础特效可以通过 Element API 直接使用
Ext.apply(Ext.Element.prototype, Ext.Fx);
