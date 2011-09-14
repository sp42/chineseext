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
 * @class Ext.KeyNav
 * <p>
 * 为跨浏览器的键盘方向键加上一层快捷的包装器（wrapper）。
 * KeyNav允许你为某个功能绑定方向键，按下的时候即调用该功能。
 * KeyNav允许你对方向键进行函数调用的绑定，即按下相应的键便立即执行函数，轻松实现了对任意UI组件的键盘事件控制</p>
 * <p>下列是全部有可能会出现的键（已实现的）： enter, left, right, up, down, tab, esc,
 * pageUp, pageDown, del, home, end。 举例：</p>
 <pre><code>
var nav = new Ext.KeyNav("my-element", {
    "left" : function(e){
        this.moveLeft(e.ctrlKey);
    },
    "right" : function(e){
        this.moveRight(e.ctrlKey);
    },
    "enter" : function(e){
        this.save();
    },
    scope : this
});
</code></pre>
 * @constructor
 * @param {Mixed} el 绑定的元素
 * @param {Object} config 配置项
 */
Ext.KeyNav = function(el, config){
    this.el = Ext.get(el);
    Ext.apply(this, config);
    if(!this.disabled){
        this.disabled = true;
        this.enable();
    }
};

Ext.KeyNav.prototype = {
    /**
     * @cfg {Boolean} disabled
     * True表示为禁止该KeyNav的实例（默认为false）
     */
    disabled : false,
    /**
     * @cfg {String} defaultEventAction
     * 当KeyNav拦截某键之后，所调用的{@link Ext.EventObject}方法。该值可以是
     * {@link Ext.EventObject#stopEvent}， {@link Ext.EventObject#preventDefault}与
     * {@link Ext.EventObject#stopPropagation}（默认为“stopEvent”）
     */
    defaultEventAction: "stopEvent",
    /**
     * @cfg {Boolean} forceKeyDown
     * 以keydown事件代替keypress（默认为false）。
     * 由于IE上按下special键不能有效触发keypress事件，所以IE上会自动设置为true。
     * 然而将该项规定为true的话，则表示所以浏览器上都以以keydown事件代替keypress
     */
    forceKeyDown : false,

    // private
    prepareEvent : function(e){
        var k = e.getKey();
        var h = this.keyToHandler[k];
        if(Ext.isSafari2 && h && k >= 37 && k <= 40){
            e.stopEvent();
        }
    },

    // private
    relay : function(e){
        var k = e.getKey();
        var h = this.keyToHandler[k];
        if(h && this[h]){
            if(this.doRelay(e, this[h], h) !== true){
                e[this.defaultEventAction]();
            }
        }
    },

    // private
    doRelay : function(e, h, hname){
        return h.call(this.scope || this, e);
    },

    // possible handlers
    enter : false,
    left : false,
    right : false,
    up : false,
    down : false,
    tab : false,
    esc : false,
    pageUp : false,
    pageDown : false,
    del : false,
    home : false,
    end : false,

    // quick lookup hash
    keyToHandler : {
        37 : "left",
        39 : "right",
        38 : "up",
        40 : "down",
        33 : "pageUp",
        34 : "pageDown",
        46 : "del",
        36 : "home",
        35 : "end",
        13 : "enter",
        27 : "esc",
        9  : "tab"
    },

	/**
	 * 激活这个KeyNav
	 */
	enable: function(){
		if(this.disabled){
            // ie won't do special keys on keypress, no one else will repeat keys with keydown
            // the EventObject will normalize Safari automatically
            if(this.forceKeyDown || Ext.isIE || Ext.isSafari3 || Ext.isAir){
                this.el.on("keydown", this.relay,  this);
            }else{
                this.el.on("keydown", this.prepareEvent,  this);
                this.el.on("keypress", this.relay,  this);
            }
		    this.disabled = false;
		}
	},

	/**
	 * 禁用这个KeyNav
	 */
	disable: function(){
		if(!this.disabled){
		    if(this.forceKeyDown || Ext.isIE || Ext.isSafari3 || Ext.isAir){
                this.el.un("keydown", this.relay, this);
            }else{
                this.el.un("keydown", this.prepareEvent, this);
                this.el.un("keypress", this.relay, this);
            }
		    this.disabled = true;
		}
	}
};
