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
 @class Ext.util.ClickRepeater
 @extends Ext.util.Observable
 适用于任何元素的包装类。当鼠标按下时触发一个“单击”的事件。
 可在配置项中设置间隔时间，默认是20毫秒。可选地，按下的过程中可能会加入一个CSS类。
 @cfg {Mixed}   el             该元素作为一个按钮。
 @cfg {Number}  delay          开始触发事件重复之前的初始延迟，类似自动重复键延时。
 @cfg {Number}  interval       “fire”事件之间的间隔时间。默认20ms。
 @cfg {String}  pressClass     当元素被按下时所指定的CSS样式。
 @cfg {Boolean} accelerate     True：如果要自动重复开始时缓慢，然后加速的话，设置为TRUE。 "interval" 和 "delay"将会被忽略。
 @cfg {Boolean} preventDefault True:预防默认的单击事件。
 @cfg {Boolean} stopDefault    True:停止默认的单击事件。
 @constructor
 @param {String/HTMLElement/Element} el 侦听的函数。
 @param {Object} config
 */
Ext.util.ClickRepeater = function(el, config)
{
    this.el = Ext.get(el);
    this.el.unselectable();

    Ext.apply(this, config);

    this.addEvents(
    /**
     * @event mousedown
     * 当鼠标按下的时候触发。
     * Fires when the mouse button is depressed.
     * @param {Ext.util.ClickRepeater} this
     */
        "mousedown",
    /**
     * @event click
     * 当元素被按下接受到按下的消息的时候出发，比mousedown事件慢。
     * Fires on a specified interval during the time the element is pressed.
     * @param {Ext.util.ClickRepeater} this
     */
        "click",
    /**
     * @event mouseup
     * 当鼠标释放后触发。
     * Fires when the mouse key is released.
     * @param {Ext.util.ClickRepeater} this
     */
        "mouseup"
    );

    this.el.on("mousedown", this.handleMouseDown, this);
    if(this.preventDefault || this.stopDefault){
        this.el.on("click", function(e){
            if(this.preventDefault){
                e.preventDefault();
            }
            if(this.stopDefault){
                e.stopEvent();
            }
        }, this);
    }

    // allow inline handler
    if(this.handler){
        this.on("click", this.handler,  this.scope || this);
    }

    Ext.util.ClickRepeater.superclass.constructor.call(this);
};

Ext.extend(Ext.util.ClickRepeater, Ext.util.Observable, {
    interval : 20,
    delay: 250,
    preventDefault : true,
    stopDefault : false,
    timer : 0,

    destroy : function() {
        Ext.destroy(this.el);
        this.purgeListeners();
    },
    // private
    handleMouseDown : function(){
        clearTimeout(this.timer);
        this.el.blur();
        if(this.pressClass){
            this.el.addClass(this.pressClass);
        }
        this.mousedownTime = new Date();

        Ext.getDoc().on("mouseup", this.handleMouseUp, this);
        this.el.on("mouseout", this.handleMouseOut, this);

        this.fireEvent("mousedown", this);
        this.fireEvent("click", this);

//      Do not honor delay or interval if acceleration wanted.
        if (this.accelerate) {
            this.delay = 400;
	    }
        this.timer = this.click.defer(this.delay || this.interval, this);
    },

    // private
    click : function(){
        this.fireEvent("click", this);
        this.timer = this.click.defer(this.accelerate ?
            this.easeOutExpo(this.mousedownTime.getElapsed(),
                400,
                -390,
                12000) :
            this.interval, this);
    },

    easeOutExpo : function (t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },

    // private
    handleMouseOut : function(){
        clearTimeout(this.timer);
        if(this.pressClass){
            this.el.removeClass(this.pressClass);
        }
        this.el.on("mouseover", this.handleMouseReturn, this);
    },

    // private
    handleMouseReturn : function(){
        this.el.un("mouseover", this.handleMouseReturn);
        if(this.pressClass){
            this.el.addClass(this.pressClass);
        }
        this.click();
    },

    // private
    handleMouseUp : function(){
        clearTimeout(this.timer);
        this.el.un("mouseover", this.handleMouseReturn);
        this.el.un("mouseout", this.handleMouseOut);
        Ext.getDoc().un("mouseup", this.handleMouseUp);
        this.el.removeClass(this.pressClass);
        this.fireEvent("mouseup", this);
    }
});