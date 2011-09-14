/**
 * @class Ext.EventObject
 * 为了方便操作，在你定义的事件句柄上传入事件对象（Event Object），这个对象直接呈现了Yahoo! UI 事件功能。
 * 同时也解决了自动null检查的不便。
 * 举例：
 * <pre><code>
 fu<>nction handleClick(e){ // e它不是一个标准的事件对象，而是Ext.EventObject
    e.preventDefault();
    var target = e.getTarget();
    ...
 }
 var myDiv = Ext.get("myDiv");
 myDiv.on("click", handleClick);
 //或者
 Ext.EventManager.on("myDiv", 'click', handleClick);
 Ext.EventManager.addListener("myDiv", 'click', handleClick);
 </code></pre>
 * @singleton
 */
Ext.EventObject = function(){

    var E = Ext.lib.Event;

    // safari keypress events for special keys return bad keycodes
    var safariKeys = {
        63234 : 37, // left
        63235 : 39, // right
        63232 : 38, // up
        63233 : 40, // down
        63276 : 33, // page up
        63277 : 34, // page down
        63272 : 46, // delete
        63273 : 36, // home
        63275 : 35  // end
    };

    // normalize button clicks
    var btnMap = Ext.isIE ? {1:0,4:1,2:2} :
                (Ext.isSafari ? {1:0,2:1,3:2} : {0:0,1:1,2:2});

    Ext.EventObjectImpl = function(e){
        if(e){
            this.setEvent(e.browserEvent || e);
        }
    };
    Ext.EventObjectImpl.prototype = {
        /** The normal browser event */
        browserEvent : null,
        /** The button pressed in a mouse event */
        button : -1,
        /** True表示事件触发时是有按下shift键的。True if the shift key was down during the event */
        shiftKey : false,
        /** True表示事件触发时是有按下ctrl键的。True if the control key was down during the event */
        ctrlKey : false,
        /** True表示事件触发时是有按下alt键的。True if the alt key was down during the event */
        altKey : false,

        /** 键码常量 @type Number */
        BACKSPACE : 8,
        /** 键码常量 @type Number */
        TAB : 9,
        /** 键码常量 @type Number */
        RETURN : 13,
        /** 键码常量 @type Number */
        ENTER : 13,
        /** 键码常量 @type Number */
        SHIFT : 16,
        /** 键码常量 @type Number */
        CONTROL : 17,
        /** 键码常量 @type Number */
        ESC : 27,
        /** 键码常量 @type Number */
        SPACE : 32,
        /** 键码常量 @type Number */
        PAGEUP : 33,
        /** 键码常量 @type Number */
        PAGEDOWN : 34,
        /** 键码常量 @type Number */
        END : 35,
        /** 键码常量 @type Number */
        HOME : 36,
        /** 键码常量 @type Number */
        LEFT : 37,
        /** 键码常量 @type Number */
        UP : 38,
        /** 键码常量 @type Number */
        RIGHT : 39,
        /** 键码常量 @type Number */
        DOWN : 40,
        /** 键码常量 @type Number */
        DELETE : 46,
        /** 键码常量 @type Number */
        F5 : 116,

           /** @private */
        setEvent : function(e){
            if(e == this || (e && e.browserEvent)){ // already wrapped
                return e;
            }
            this.browserEvent = e;
            if(e){
                // normalize buttons
                this.button = e.button ? btnMap[e.button] : (e.which ? e.which-1 : -1);
                if(e.type == 'click' && this.button == -1){
                    this.button = 0;
                }
                this.type = e.type;
                this.shiftKey = e.shiftKey;
                // mac metaKey behaves like ctrlKey
                this.ctrlKey = e.ctrlKey || e.metaKey;
                this.altKey = e.altKey;
                // in getKey these will be normalized for the mac
                this.keyCode = e.keyCode;
                this.charCode = e.charCode;
                // cache the target for the delayed and or buffered events
                this.target = E.getTarget(e);
                // same for XY
                this.xy = E.getXY(e);
            }else{
                this.button = -1;
                this.shiftKey = false;
                this.ctrlKey = false;
                this.altKey = false;
                this.keyCode = 0;
                this.charCode =0;
                this.target = null;
                this.xy = [0, 0];
            }
            return this;
        },

        /**
         * 停止事件（preventDefault和stopPropagation）
         */
        stopEvent : function(){
            if(this.browserEvent){
                if(this.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(this);
                }
                E.stopEvent(this.browserEvent);
            }
        },
        
        /**
         * 阻止浏览器默认行为处理事件
         */
        preventDefault : function(){
            if(this.browserEvent){
                E.preventDefault(this.browserEvent);
            }
        },

        /** @private */
        isNavKeyPress : function(){
            var k = this.keyCode;
            k = Ext.isSafari ? (safariKeys[k] || k) : k;
            return (k >= 33 && k <= 40) || k == this.RETURN || k == this.TAB || k == this.ESC;
        },

        isSpecialKey : function(){
            var k = this.keyCode;
            return (this.type == 'keypress' && this.ctrlKey) || k == 9 || k == 13  || k == 40 || k == 27 ||
            (k == 16) || (k == 17) ||
            (k >= 18 && k <= 20) ||
            (k >= 33 && k <= 35) ||
            (k >= 36 && k <= 39) ||
            (k >= 44 && k <= 45);
        },
        /**
         * 取消事件上报
         */
        stopPropagation : function(){
            if(this.browserEvent){
                if(this.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(this);
                }
                E.stopPropagation(this.browserEvent);
            }
        },

        /**
         * 获取事件的键盘代码
         * @return {Number}
         */
        getCharCode : function(){
            return this.charCode || this.keyCode;
        },

        /**
         * 返回一个常规化的事件键盘代码
         * @return {Number} 键盘代码
         */
        getKey : function(){
            var k = this.keyCode || this.charCode;
            return Ext.isSafari ? (safariKeys[k] || k) : k;
        },

       /**
         * 获取事件X坐标。
         * @return {Number}
         */
        getPageX : function(){
            return this.xy[0];
        },

       /**
         * 获取事件Y坐标。
         * @return {Number}
         */
        getPageY : function(){
            return this.xy[1];
        },

        /**
         * 获取事件的时间。
         * @return {Number}
         */
        getTime : function(){
            if(this.browserEvent){
                return E.getTime(this.browserEvent);
            }
            return null;
        },

        /**
         * 获取事件的页面坐标。
         * @return {Array} xy值，格式[x, y]
         */
        getXY : function(){
            return this.xy;
        },

        /**
         * 获取事件的目标对象。
         * @param {String} selector （可选的） 一个简易的选择符，用于筛选目标或查找目标的父级元素
         * @param {Number/String/HTMLElement/Element} maxDepth （可选的）搜索的最大深度（数字或是元素，默认为10||document.body）   
         * @param {Boolean} returnEl （可选的） True表示为返回Ext.Element的对象而非DOM节点
         * @return {HTMLelement}
         */
        getTarget : function(selector, maxDepth, returnEl){
        	var t = Ext.get(this.target);
            return selector ? t.findParent(selector, maxDepth, returnEl) : (returnEl ? t : this.target);
        },
        
        /**
         * 获取相关的目标对象。
         * @return {HTMLElement}
         */
        getRelatedTarget : function(){
            if(this.browserEvent){
                return E.getRelatedTarget(this.browserEvent);
            }
            return null;
        },

        /**
         * 常规化鼠标滚轮的有限增量（跨浏览器）
         * @return {Number} The delta
         */
        getWheelDelta : function(){
            var e = this.browserEvent;
            var delta = 0;
            if(e.wheelDelta){ /* IE/Opera. */
                delta = e.wheelDelta/120;
            }else if(e.detail){ /* Mozilla case. */
                delta = -e.detail/3;
            }
            return delta;
        },

        /**
         * 返回一个布尔值，表示当该事件执行的过程中，ctrl、alt、shift有否被按下。
         * @return {Boolean}
         */
        hasModifier : function(){
            return ((this.ctrlKey || this.altKey) || this.shiftKey) ? true : false;
        },

        /**
         * 返回true表示如果该事件的目标对象等于el，或是el的子元素
         * @param {String/HTMLElement/Element} el
         * @param {Boolean} related (optional) （可选的）如果相关的target就是el而非target本身，返回true
         * @return {Boolean}
         */
        within : function(el, related){
            var t = this[related ? "getRelatedTarget" : "getTarget"]();
            return t && Ext.fly(el).contains(t);
        },

        getPoint : function(){
            return new Ext.lib.Point(this.xy[0], this.xy[1]);
        }
    };

    return new Ext.EventObjectImpl();
}();