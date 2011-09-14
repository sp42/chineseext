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
 * @class Ext.ProgressBar
 * @extends Ext.BoxComponent
 * <p>
 * 可更新进度条的组件。进度条支持两种不同的模式：手动的和自动的。<br />
 * An updateable progress bar component.  The progress bar supports two different modes: manual and automatic.</p>
 * <p>
 * 手动模式下，进度条的显示、更新（通过{@link #updateProgress}）和清除这些任务便需要你代码的去完成。
 * 此方法最适用于可实现预测点的操作显示进度条。<br />
 * In manual mode, you are responsible for showing, updating (via {@link #updateProgress}) and clearing the
 * progress bar as needed from your own code.  This method is most appropriate when you want to show progress
 * throughout an operation that has predictable points of interest at which you can update the control.</p>
 * <p>
 * 自动模式下，你只需要调用{@link #wait}并让进度条不停地运行下去，然后直到操作完成后停止进度条。另外一种用法是你让进度条显示一定的时间（wait方法），wait一定时间后停止显示进度。
 * 自动模式最适用于已知时间的操作或不需要标识实际进度的异步操作。<br />
 * In automatic mode, you simply call {@link #wait} and let the progress bar run indefinitely, only clearing it
 * once the operation is complete.  You can optionally have the progress bar wait for a specific amount of time
 * and then clear itself.  Automatic mode is most appropriate for timed operations or asynchronous operations in
 * which you have no need for indicating intermediate progress.</p>
 * @cfg {Float} value 0到1区间的浮点数（例如：.5，默认为0）。A floating point value between 0 and 1 (e.g., .5, defaults to 0)
 * @cfg {String} text 进度条提示的文本（默认为''）。The progress bar text (defaults to '')
 * @cfg {Mixed} textEl 负责进度条渲染的那个元素（默认为进度条内部文本元素）。The element to render the progress text to (defaults to the progress
 * bar's internal text element)
 * @cfg {String} id 进度条元素的Id（默认为自动生成的id）。The progress bar element's id (defaults to an auto-generated id)
 */
Ext.ProgressBar = Ext.extend(Ext.BoxComponent, {
   /**
    * @cfg {String} baseCls
    * 进度条外层元素所使用的CSS样式类基类（默认为'x-progress'）。
    * The base CSS class to apply to the progress bar's wrapper element (defaults to 'x-progress')
    */
    baseCls : 'x-progress',
    
    /**
    * @cfg {Boolean} animate
    * True表示为变化过程中将有动画效果（默认为false）。
    * True to animate the progress bar during transitions (defaults to false)
    */
    animate : false,

    // private
    waitTimer : null,

    // private
    initComponent : function(){
        Ext.ProgressBar.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event update
             * 每一次更新就触发该事件。
             * Fires after each update interval
             * @param {Ext.ProgressBar} this
             * @param {Number} v 当前进度条的值。The current progress value
             * @param {String} text 当前进度条的提示文字。The current progress text
             */
            "update"
        );
    },

    // private
    onRender : function(ct, position){
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

        this.el = position 
        	? tpl.insertBefore(position, {cls: this.baseCls}, true)
        	: tpl.append(ct, {cls: this.baseCls}, true);
		        
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
        this.progressBar.setHeight(inner.offsetHeight);
    },
    
    // private
    afterRender : function(){
        Ext.ProgressBar.superclass.afterRender.call(this);
        if(this.value){
            this.updateProgress(this.value, this.text);
        }else{
            this.updateText(this.text);
        }
    },

    /**
     * 更新进度条的刻度值，也可以更新提示文本。如果文本的参数没传入，那么当前的文本将不会有变化。
     * 要取消当前文本，传入''。注意即使进度条的值溢出（大于1），也不会自动复位，这样你就要确定进度是何时完成然后调用{@link #reset}停止或隐藏控件。
     * Updates the progress bar value, and optionally its text.  If the text argument is not specified,
     * any existing text value will be unchanged.  To blank out existing text, pass ''.  Note that even
     * if the progress bar value exceeds 1, it will never automatically reset -- you are responsible for
     * determining when the progress is complete and calling {@link #reset} to clear and/or hide the control.
     * @param {Float} value （可选的）介乎0与1之间浮点数（如.5，默认为零）。(optional) A floating point value between 0 and 1 (e.g., .5, defaults to 0)
     * @param {String} text （可选的）显示在进度条提示文本元素的字符串（默认为''）。(optional) The string to display in the progress text element (defaults to '')
     * @param {Boolean} animate （可选的）True表示为变化过程中将有动画效果（默认为false）。如果不制定值那就使用默认当前类所使用着的。(optional) Whether to animate the transition of the progress bar. If this value is
     * not specified, the default for the class is used (default to false)
     * @return {Ext.ProgressBar} this
     */
    updateProgress : function(value, text, animate){
        this.value = value || 0;
        if(text){
            this.updateText(text);
        }
        if(this.rendered){
            var w = Math.floor(value*this.el.dom.firstChild.offsetWidth);
            this.progressBar.setWidth(w, animate === true || (animate !== false && this.animate));
            if(this.textTopEl){
                //textTopEl should be the same width as the bar so overflow will clip as the bar moves
                this.textTopEl.removeClass('x-hidden').setWidth(w);
            }
        }
        this.fireEvent('update', this, value, text);
        return this;
    },

    /**
     * 初始化一个自动更新的进度条。
     * 如果有duration的参数传入，那么代表进度条会运行到一定的时间后停止（自动调用reset方法），并若然有指定一个回调函数，也会执行。
     * 如果duration的参数不传入，那么进度条将会不停地运行下去，这样你就要调用{@link #reset}的方法停止他。wait方法可接受以下属性的配置对象：
     * Initiates an auto-updating progress bar.  A duration can be specified, in which case the progress
     * bar will automatically reset after a fixed amount of time and optionally call a callback function
     * if specified.  If no duration is passed in, then the progress bar will run indefinitely and must
     * be manually cleared by calling {@link #reset}.  The wait method accepts a config object with
     * the following properties:
     * <pre>
Property   Type          Description
属性        类型          内容
---------- ------------  ----------------------------------------------------------------------
duration   Number        进度条运作时间的长度，单位是毫秒，跑完后执行自身的复位方法（默认为undefined，即不断地运行除非执行reset方法结束）The length of time in milliseconds that the progress bar should
                         run before resetting itself (defaults to undefined, in which case it
                         will run indefinitely until reset is called)
interval   Number        每次更新的间隔周期（默认为1000毫秒）The length of time in milliseconds between each progress update
                         (defaults to 1000 ms)
animate    Boolean       Whether to animate the transition of the progress bar. If this value is
                         not specified, the default for the class is used.                                                   
increment  Number        进度条每次更新的幅度大小（默认为10）。如果进度条达到最后，那么它会回到原点。The number of progress update segments to display within the progress
                         bar (defaults to 10).  If the bar reaches the end and is still
                         updating, it will automatically wrap back to the beginning.
text       String        Optional text to display in the progress bar element (defaults to '').
fn         Function      当进度条完成自动更新后执行的回调函数。该函数没有参数。如不指定duration该项自动忽略，这样进度条只能写代码结束更新A callback function to execute after the progress bar finishes auto-
                         updating.  The function will be called with no arguments.  This function
                         will be ignored if duration is not specified since in that case the
                         progress bar can only be stopped programmatically, so any required function
                         should be called by the same code after it resets the progress bar.
scope      Object        回调函数的作用域（只当duration与fn两项都传入时有效）The scope that is passed to the callback function (only applies when
                         duration and fn are both passed).
</pre>
         *
         * 用法举例： Example usage:
         * <pre><code>
var p = new Ext.ProgressBar({
   renderTo: 'my-el'
});

//等待五秒，然后更新状态元素（进度条会自动复位） Wait for 5 seconds, then update the status el (progress bar will auto-reset)
p.wait({
   interval: 100, //非常快地移动！ bar will move fast!
   duration: 5000,
   increment: 15,
   text: 'Updating...',
   scope: this,
   fn: function(){
      Ext.fly('status').update(完成了！'Done!');
   }
});

//一种情况是，不停的更新直到有手工的操作控制结束。 Or update indefinitely until some async action completes, then reset manually
p.wait();
myAction.on('complete', function(){
    p.reset();
    Ext.fly('status').update('Done!');
});
</code></pre>
     * @param {Object} config (optional)（可选的）配置项对象 Configuration options
     * @return {Ext.ProgressBar} this
     */
    wait : function(o){
        if(!this.waitTimer){
            var scope = this;
            o = o || {};
            this.updateText(o.text);
            this.waitTimer = Ext.TaskMgr.start({
                run: function(i){
                    var inc = o.increment || 10;
                    this.updateProgress(((((i+inc)%inc)+1)*(100/inc))*.01, null, o.animate);
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
     * Returns true if the progress bar is currently in a {@link #wait} operation
     * @return {Boolean} True表示在等待，false反之。True if waiting, else false
     */
    isWaiting : function(){
        return this.waitTimer != null;
    },

    /**
     * 更新进度条的提示文本。如传入text参数，textEl会更新其内容，否则进度条本身会显示已更新的文本。
     * Updates the progress bar text.  If specified, textEl will be updated, otherwise the progress
     * bar itself will display the updated text.
     * @param {String} text （可选的）显示的字符串（默认为''）。(optional)The string to display in the progress text element (defaults to '')
     * @return {Ext.ProgressBar} this
     */
    updateText : function(text){
        this.text = text || '&#160;';
        if(this.rendered){
            this.textEl.update(this.text);
        }
        return this;
    },
    
    /**
     * 按照进度条当前的{@link #value}，同步接度条的内宽，与外组件宽度自适应。
     * 如果进度条是自适应某个部件的，那么该方法会自动调用，但若此进度条渲染为自动的宽度，那么该方法会根据别的resize来酌情调用。
     * Synchronizes the inner bar width to the proper proportion of the total componet width based
     * on the current progress {@link #value}. This will be called automatically when the ProgressBar
     * is resized by a layout, but if it is rendered auto width, this method can be called from
     * another resize handler to sync the ProgressBar if necessary.
     */
    syncProgressBar : function(){
        if(this.value){
            this.updateProgress(this.value, this.text);
        }
        return this;
    },

    /**
     * 设置进度条的尺寸大小。
     * Sets the size of the progress bar.
     * @param {Number} width  新宽度（像素）。The new width in pixels
     * @param {Number} height 新高度（像素）。The new height in pixels
     * @return {Ext.ProgressBar} this
     */
    setSize : function(w, h){
        Ext.ProgressBar.superclass.setSize.call(this, w, h);
        if(this.textTopEl){
            var inner = this.el.dom.firstChild;
            this.textEl.setSize(inner.offsetWidth, inner.offsetHeight);
        }
        this.syncProgressBar();
        return this;
    },

    /**
     * 将进度条的刻度复位为零，并将提示文本设置为空白字符串。
     * 如果hide=true，那么进度条会被隐藏（根据在内部的{@link #hideMode}属性）。 
     * Resets the progress bar value to 0 and text to empty string.  If hide = true, the progress
     * bar will also be hidden (using the {@link #hideMode} property internally).
     * @param {Boolean} hide （可选的）True表示隐藏进度条（默认为false）。(optional) True to hide the progress bar (defaults to false)
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