/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://www.extjs.com/license
 */

/**
 @class Ext.util.ClickRepeater
 @extends Ext.util.Observable
 适用于任何元素的包装类。当鼠标按下时触发一个“单击”的事件。
 可在配置项中设置间隔时间但默认是10毫秒。
 可选地，按下的过程中可能会加入一个CSS类。
 @cfg {String/HTMLElement/Element} el 该元素作为一个按钮。
 @cfg {Number} delay 开始触发事件重复之前的初始延迟，类似自动重复键延时。
 @cfg {Number} interval “fire”事件之间的间隔时间。默认10ms。
 @cfg {String} pressClass 当元素被按下时所指定的CSS样式。
 @cfg {Boolean} accelerate True：如果要自动重复开始时缓慢，然后加速的话，设置为TRUE。 "interval" 和 "delay"将会被忽略。
 @cfg {Boolean} preventDefault True:预防默认的单击事件
 @cfg {Boolean} stopDefault True:停止默认的单击事件
 @constructor
 @param {String/HTMLElement/Element} el 侦听的函数
 @param {Object} config
 */
Ext.util.ClickRepeater = function(el, config){
    this.el = Ext.get(el);
    this.el.unselectable();

    Ext.apply(this, config);

    this.addEvents({
    /**
     * @event mousedown
     * 当鼠标键按下的时候触发。
     * @param {Ext.util.ClickRepeater} this
     */
        "mousedown" : true,
    /**
     * @event click
     * 元素被按下的过程中，指定间隔的时间触发。
     * @param {Ext.util.ClickRepeater} this
     */
        "click" : true,
    /**
     * @event mouseup
     * 当鼠标键释放的时候触发。
     * @param {Ext.util.ClickRepeater} this
     */
        "mouseup" : true
    });

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

    // private
    handleMouseDown : function(){
        clearTimeout(this.timer);
        this.el.blur();
        if(this.pressClass){
            this.el.addClass(this.pressClass);
        }
        this.mousedownTime = new Date();

        Ext.get(document).on("mouseup", this.handleMouseUp, this);
        this.el.on("mouseout", this.handleMouseOut, this);

        this.fireEvent("mousedown", this);
        this.fireEvent("click", this);

        this.timer = this.click.defer(this.delay || this.interval, this);
    },

    // private
    click : function(){
        this.fireEvent("click", this);
        this.timer = this.click.defer(this.getInterval(), this);
    },

    // private
    getInterval: function(){
        if(!this.accelerate){
            return this.interval;
        }
        var pressTime = this.mousedownTime.getElapsed();
        if(pressTime < 500){
            return 400;
        }else if(pressTime < 1700){
            return 320;
        }else if(pressTime < 2600){
            return 250;
        }else if(pressTime < 3500){
            return 180;
        }else if(pressTime < 4400){
            return 140;
        }else if(pressTime < 5300){
            return 80;
        }else if(pressTime < 6200){
            return 50;
        }else{
            return 10;
        }
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
        Ext.get(document).un("mouseup", this.handleMouseUp);
        this.el.removeClass(this.pressClass);
        this.fireEvent("mouseup", this);
    }
});