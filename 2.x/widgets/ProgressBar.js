/**
 * @class Ext.ProgressBar
 * @extends Ext.BoxComponent
 * <p>  
 * 可更新进度条的组件。进度条支持两种不同的模式：手动的和自动的。</p>
 * <p>手动模式下，进度条的显示、更新（通过{@link #updateProgress}）和清除这些任务便需要你代码的去完成。
 * 此方法最适用于可实现预测点的操作显示进度条。</p>
 * <p>自动模式下，你只需要调用{@link #wait}并让进度条不停地运行下去，然后直到操作完成后停止进度条。另外一种用法是你让进度条显示一定的时间（wait方法），wait一定时间后停止显示进度。
 * 自动模式最适用于已知时间的操作或不需要标识实际进度的异步操作。</p>
 * @cfg {Float} value 0到1区间的浮点数（例如：.5，默认为0）
 * @cfg {String} text 进度条提示的文本（默认为''）
 * @cfg {Mixed} textEl 负责进度条渲染的那个元素（默认为进度条内部文本元素）
 * @cfg {String} id 进度条元素的Id（默认为自动生成的id）
 */
Ext.ProgressBar = Ext.extend(Ext.BoxComponent, {
   /**
    * @cfg {String} baseCls
    * 进度条外层元素所使用的CSS样式类基类（默认为'x-progress'）
    */
    baseCls : 'x-progress',

    // private
    waitTimer : null,

    // private
    initComponent : function(){
        Ext.ProgressBar.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event update
             * 每一次更新就触发该事件
             * @param {Ext.ProgressBar} this
             * @param {Number} value 当前进度条的值
             * @param {String} text 当前进度条的提示文字
             */
            "update"
        );
    },

    // private
    onRender : function(ct, position){
        Ext.ProgressBar.superclass.onRender.call(this, ct, position);

        var tpl = new Ext.Template(
            '<div class="{cls}-wrap">',
                '<div class="{cls}-inner">',
                    '<div class="{cls}-bar">',
                        '<div class="{cls}-text">',
                            '<div>&#160;</div>',
                        '</div>',
                    '</div>',
                    '<div class="{cls}-text {cls}-text-back">',
                        '<div>&#160;</div>',
                    '</div>',
                '</div>',
            '</div>'
        );

        if(position){
            this.el = tpl.insertBefore(position, {cls: this.baseCls}, true);
        }else{
            this.el = tpl.append(ct, {cls: this.baseCls}, true);
        }
        if(this.id){
            this.el.dom.id = this.id;
        }
        var inner = this.el.dom.firstChild;
        this.progressBar = Ext.get(inner.firstChild);

        if(this.textEl){
            //use an external text el
            this.textEl = Ext.get(this.textEl);
            delete this.textTopEl;
        }else{
            //setup our internal layered text els
            this.textTopEl = Ext.get(this.progressBar.dom.firstChild);
            var textBackEl = Ext.get(inner.childNodes[1]);
            this.textTopEl.setStyle("z-index", 99).addClass('x-hidden');
            this.textEl = new Ext.CompositeElement([this.textTopEl.dom.firstChild, textBackEl.dom.firstChild]);
            this.textEl.setWidth(inner.offsetWidth);
        }
        if(this.value){
            this.updateProgress(this.value, this.text);
        }else{
            this.updateText(this.text);
        }
        this.setSize(this.width || 'auto', 'auto');
        this.progressBar.setHeight(inner.offsetHeight);
    },

    /**
     * 更新进度条的刻度值，也可以更新提示文本。如果文本的参数没传入，那么当前的文本将不会有变化。
     * 要取消当前文本，传入''。注意即使进度条的值溢出（大于1），也不会自动复位，这样你就要确定进度是何时完成然后调用{@link #reset}停止或隐藏控件。
     * @param {Float} value （可选的） 介乎0与1之间浮点数（如.5，默认为零）
     * @param {String} text （可选的） 显示在进度条提示文本元素的字符串（默认为''）
     * @return {Ext.ProgressBar} this
     */
    updateProgress : function(value, text){
        this.value = value || 0;
        if(text){
            this.updateText(text);
        }
        var w = Math.floor(value*this.el.dom.firstChild.offsetWidth);
        this.progressBar.setWidth(w);
        if(this.textTopEl){
            //textTopEl should be the same width as the bar so overflow will clip as the bar moves
            this.textTopEl.removeClass('x-hidden').setWidth(w);
        }
        this.fireEvent('update', this, value, text);
        return this;
    },

    /**
     * 初始化一个自动更新的进度条。
     * 如果有duration的参数传入，那么代表进度条会运行到一定的时间后停止（自动调用reset方法），并若然有指定一个回调函数，也会执行。
     * 如果duration的参数不传入，那么进度条将会不停地运行下去，这样你就要调用{@link #reset}的方法停止他。wait方法可接受以下属性的配置对象：
     * <pre>
属性        类型          内容
---------- ------------  ----------------------------------------------------------------------
duration   Number        进度条运作时间的长度，单位是毫秒，跑完后执行自身的复位方法（默认为undefined，即不断地运行除非执行reset方法结束）
interval   Number        每次更新的间隔周期（默认为1000毫秒）
increment  Number        进度条每次更新的幅度大小（默认为10）。如果进度条达到最后，那么它会回到原点。
fn         Function      当进度条完成自动更新后执行的回调函数。该函数没有参数。如不指定duration该项自动忽略，这样进度条只能写代码结束更新
scope      Object        回调函数的作用域（只当duration与fn两项都传入时有效）
</pre>
         *
         * 用法举例：
         * <pre><code>
var p = new Ext.ProgressBar({
   renderTo: 'my-el'
});

//等待五秒，然后更新状态元素（进度条会自动复位）
p.wait({
   interval: 100, //非常快地移动！
   duration: 5000,
   increment: 15,
   scope: this,
   fn: function(){
      Ext.fly('status').update('完成了！');
   }
});

//一种情况是，不停的更新直到有手工的操作控制结束。
p.wait();
myAction.on('complete', function(){
    p.reset();
    Ext.fly('status').update('完成了！');
});
</code></pre>
     * @param {Object} config （可选的）配置项对象
     * @return {Ext.ProgressBar} this
     */
    wait : function(o){
        if(!this.waitTimer){
            var scope = this;
            o = o || {};
            this.waitTimer = Ext.TaskMgr.start({
                run: function(i){
                    var inc = o.increment || 10;
                    this.updateProgress(((((i+inc)%inc)+1)*(100/inc))*.01);
                },
                interval: o.interval || 1000,
                duration: o.duration,
                onStop: function(){
                    if(o.fn){
                        o.fn.apply(o.scope || this);
                    }
                    this.reset();
                },
                scope: scope
            });
        }
        return this;
    },

    /**
     * 返回进度条当前是否在{@link #wait}的操作中。
     * @return {Boolean} True表示在等待，false反之
     */
    isWaiting : function(){
        return this.waitTimer != null;
    },

    /**
     * 更新进度条的提示文本。  如传入text参数，textEl会更新其内容，否则进度条本身会显示已更新的文本。
     * @param {String} text （可选的）显示的字符串（默认为''）
     * @return {Ext.ProgressBar} this
     */
    updateText : function(text){
        this.text = text || '&#160;';
        this.textEl.update(this.text);
        return this;
    },

    /**
     * 设置进度条的尺寸大小。
     * @param {Number} width 新宽度（像素）
     * @param {Number} height 新高度（像素）
     * @return {Ext.ProgressBar} this
     */
    setSize : function(w, h){
        Ext.ProgressBar.superclass.setSize.call(this, w, h);
        if(this.textTopEl){
            var inner = this.el.dom.firstChild;
            this.textEl.setSize(inner.offsetWidth, inner.offsetHeight);
        }
        return this;
    },

    /**
     * 将进度条的刻度复位为零并将提示文本设置为空白字符串。如果hide=true，那么进度条会被隐藏（根据在内部的{@link #hideMode}属性）。
     * @param {Boolean} hide （可选的）True表示隐藏进度条（默认为false）
     * @return {Ext.ProgressBar} this
     */
    reset : function(hide){
        this.updateProgress(0);
        if(this.textTopEl){
            this.textTopEl.addClass('x-hidden');
        }
        if(this.waitTimer){
            this.waitTimer.onStop = null; //prevent recursion
            Ext.TaskMgr.stop(this.waitTimer);
            this.waitTimer = null;
        }
        if(hide === true){
            this.hide();
        }
        return this;
    }
});
Ext.reg('progress', Ext.ProgressBar);