/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */
/**
 * @class Ext.EventManager
 * 对于登记的事件句柄（Event handlers），能够接受一个常规化的（已作跨浏览器处理的）EventObject的参数
 * ，而非浏览器的标准事件，并直接提供一些有用的事件。
 * 更多“已常规化的事件对象（normalized event objects）”的信息，请参阅{@link Ext.EventObject}
 * @singleton
 */
Ext.EventManager = function(){
    var docReadyEvent, docReadyProcId, docReadyState = false;
    var resizeEvent, resizeTask, textEvent, textSize;
    var E = Ext.lib.Event;
    var D = Ext.lib.Dom;


    var fireDocReady = function(){
        if(!docReadyState){
            docReadyState = true;
            Ext.isReady = true;
            if(docReadyProcId){
                clearInterval(docReadyProcId);
            }
            if(Ext.isGecko || Ext.isOpera) {
                document.removeEventListener("DOMContentLoaded", fireDocReady, false);
            }
            if(docReadyEvent){
                docReadyEvent.fire();
                docReadyEvent.clearListeners();
            }
        }
    };
    
    var initDocReady = function(){
        docReadyEvent = new Ext.util.Event();
        if(Ext.isGecko || Ext.isOpera) {
            document.addEventListener("DOMContentLoaded", fireDocReady, false);
        }else if(Ext.isIE){
            // inspired by  http://www.thefutureoftheweb.com/blog/2006/6/adddomloadevent
            document.write("<s"+'cript id="ie-deferred-loader" defer="defer" src="/'+'/:"></s'+"cript>");
            var defer = document.getElementById("ie-deferred-loader");
            defer.onreadystatechange = function(){
                if(this.readyState == "complete"){
                    fireDocReady();
                    defer.onreadystatechange = null;
                    defer.parentNode.removeChild(defer);
                }
            };
        }else if(Ext.isSafari){ 
            docReadyProcId = setInterval(function(){
                var rs = document.readyState;
                if(rs == "complete") {
                    fireDocReady();     
                 }
            }, 10);
        }
        // no matter what, make sure it fires on load
        // 无论怎么样，保证on load时触发
        E.on(window, "load", fireDocReady);
    };

    var createBuffered = function(h, o){
        var task = new Ext.util.DelayedTask(h);
        return function(e){
            // create new event object impl so new events don't wipe out properties
            // 创建新的impl事件对象,这样新的事件就不会消灭掉（wipe out）属性（译注,js都是by refenerce）
            e = new Ext.EventObjectImpl(e);
            task.delay(o.buffer, h, null, [e]);
        };
    };

    var createSingle = function(h, el, ename, fn){
        return function(e){
            Ext.EventManager.removeListener(el, ename, fn);
            h(e);
        };
    };

    var createDelayed = function(h, o){
        return function(e){
            // create new event object impl so new events don't wipe out properties
            e = new Ext.EventObjectImpl(e);
            setTimeout(function(){
                h(e);
            }, o.delay || 10);
        };
    };

    var listen = function(element, ename, opt, fn, scope){
        var o = (!opt || typeof opt == "boolean") ? {} : opt;
        fn = fn || o.fn; scope = scope || o.scope;
        var el = Ext.getDom(element);
        if(!el){
            throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
        }
        var h = function(e){
            e = Ext.EventObject.setEvent(e);
            var t;
            if(o.delegate){
                t = e.getTarget(o.delegate, el);
                if(!t){
                    return;
                }
            }else{
                t = e.target;
            }
            if(o.stopEvent === true){
                e.stopEvent();
            }
            if(o.preventDefault === true){
               e.preventDefault();
            }
            if(o.stopPropagation === true){
                e.stopPropagation();
            }

            if(o.normalized === false){
                e = e.browserEvent;
            }

            fn.call(scope || el, e, t, o);
        };
        if(o.delay){
            h = createDelayed(h, o);
        }
        if(o.single){
            h = createSingle(h, el, ename, fn);
        }
        if(o.buffer){
            h = createBuffered(h, o);
        }
        fn._handlers = fn._handlers || [];
        fn._handlers.push([Ext.id(el), ename, h]);

        E.on(el, ename, h);
        if(ename == "mousewheel" && el.addEventListener){ // workaround for jQuery
            el.addEventListener("DOMMouseScroll", h, false);
            E.on(window, 'unload', function(){
                el.removeEventListener("DOMMouseScroll", h, false);
            });
        }
        if(ename == "mousedown" && el == document){ // fix stopped mousedowns on the document
            Ext.EventManager.stoppedMouseDownEvent.addListener(h);
        }
        return h;
    };

    var stopListening = function(el, ename, fn){
        var id = Ext.id(el), hds = fn._handlers, hd = fn;
        if(hds){
            for(var i = 0, len = hds.length; i < len; i++){
                var h = hds[i];
                if(h[0] == id && h[1] == ename){
                    hd = h[2];
                    hds.splice(i, 1);
                    break;
                }
            }
        }
        E.un(el, ename, hd);
        el = Ext.getDom(el);
        if(ename == "mousewheel" && el.addEventListener){
            el.removeEventListener("DOMMouseScroll", hd, false);
        }
        if(ename == "mousedown" && el == document){ // fix stopped mousedowns on the document
            Ext.EventManager.stoppedMouseDownEvent.removeListener(hd);
        }
    };

    var propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;
    var pub = {
        
        /** 
         * 这个已经不在使用而且不推荐使用 
         * Places a simple wrapper around an event handler to override the browser event
         * object with a Ext.EventObject
         * @param {Function} fn        The method the event invokes
         * @param {Object}   scope    An object that becomes the scope of the handler
         * @param {boolean}  override If true, the obj passed in becomes
         *                             the execution scope of the listener
         * @return {Function} The wrapped function
         * @deprecated
         */          
        wrap : function(fn, scope, override){
            return function(e){
                Ext.EventObject.setEvent(e);
                fn.call(override ? scope || window : window, Ext.EventObject, scope);
            };
        },
        
   /**
     * 为该组件加入事件句柄（event handler）。跟简写方式{@link #on}是一样的。
     * 通常你会更多的使用元素本身{@link Ext.Element#removeListener}的方法。
     * @param {String}   eventName 侦听事件的类型
     * @param {Function} handler 句柄，事件涉及的方法
     * @param {Object}   scope (可选的) 句柄函数执行时所在的作用域。句柄函数“this”的上下文。
     * @param {Object}   options (可选的) 包含句柄配置属性的一个对象。该对象可能会下来的属性：<ul>
     * <li>scope {Object} 句柄函数执行时所在的作用域。句柄函数“this”的上下文。</li>
     * <li>delegate {String} 一个简易选择符，用于过滤目标，或是查找目标的子孙。</li>
     * <li>stopEvent {Boolean} true表示为阻止事件。即停止传播、阻止默认动作。</li>
     * <li>preventDefault {Boolean} true表示为阻止默认动作</li>
     * <li>stopPropagation {Boolean} true表示为阻止事件传播</li>
     * <li>normalized {Boolean} false表示对句柄函数传入一个浏览器对象代替Ext.EventObject</li>    
     * <li>delay {Number} 触发事件后开始执行句柄的延时时间（invocation：the act of making a particular function start），单位：毫秒</li>
     * <li>single {Boolean} true代表为下次事件触发加入一个要处理的句柄，然后再移除本身。</li> 
     * <li>buffer {Number} 指定一个毫秒数，会将句柄安排到{@link Ext.util.DelayedTask}延时之后才执行 . 
     * 如果事件在那个事件再次触发，则原句柄将<em>不会</em> 被启用，但是新句柄会安排在其位置。</li>
     * </ul><br>
     * <p>
     * <b>组合选项</b><br>
     * 利用参数选项，可以组合成不同类型的侦听器：<br>
     * <br>
     * 这个事件的含义是，已常规化的，延时的，自动停止事件并有传入一个自定义的参数（forumId）
     * 的一次性侦听器
		<pre><code>
		el.on('click', this.onClick, this, {
 			single: true,
    		delay: 100,
    		forumId: 4
		});
		</code></pre>
     * <p>
     * <b>在同一个调用附加上多个句柄（handlers）</b><br>
     * 这个方法可允许单个参数传入，包含多个句柄的配置对象。
     * <pre><code>
		el.on({
			'click': {
        		fn: this.onClick,
        		scope: this,
        		delay: 100
    		}, 
    		'mouseover': {
        		fn: this.onMouseOver,
        		scope: this
    		},
    		'mouseout': {
        		fn: this.onMouseOut,
        		scope: this
    		}
		});
		</code></pre>
     * <p>
     * 或者是以简写方式将相同的作用域对象传入到所有的句柄中：
     	<pre><code>
		el.on({
			'click': this.onClick,
    		'mouseover': this.onMouseOver,
    		'mouseout': this.onMouseOut,
    		scope: this
		});
		</code></pre>
     */       
        addListener : function(element, eventName, fn, scope, options){
            if(typeof eventName == "object"){
                var o = eventName;
                for(var e in o){
                    if(propRe.test(e)){
                        continue;
                    }
                    if(typeof o[e] == "function"){
                        // shared options
                        listen(element, e, o, o[e], o.scope);
                    }else{
                        // individual options
                        listen(element, e, o[e]);
                    }
                }
                return;
            }
            return listen(element, eventName, options, fn, scope);
        },
        
        /**
         * 移除事件句柄（event handler），跟简写方式{@link #un}是一样的。
         * 通常你会更多的使用元素本身{@link Ext.Element#removeListener}的方法。
         * @param {String/HTMLElement} element 欲移除事件的html元素或id
         * @param {String}   eventName  事件的类型
         * @param {Function} fn   事件的执行那个函数
         * @return {Boolean}  true表示为侦听器移除成功 
         */       
        removeListener : function(element, eventName, fn){
            return stopListening(element, eventName, fn);
        },
        
		/**
		  * 当Document准备好的时候触发（在onload之前和在图片加载之前）。可以简写为Ext.onReady()。
		  * @param {Function} fn       方法所涉及的事件
		  * @param {Object}   scope    句柄的作用域
		  * @param {boolean}  override  （可选的）标准{@link #addListener}的选型对象
		  * @member Ext
		  * @method onReady
		 */       
        onDocumentReady : function(fn, scope, options){
            if(docReadyState){ // if it already fired
                fn.call(scope || window, scope);
                return;
            }
            if(!docReadyEvent){
                initDocReady();
            }
            docReadyEvent.addListener(fn, scope, options);
        },
        
        /**
         * 当window改变大小后触发，并有随改变大小的缓冲（50毫秒），
         * 对句柄传入新视图的高度、宽度的参数。
         * @param {Function} fn     事件执行的方法
         * @param {Object}   scope   句柄的作用域
         * @param {boolean}  options
         */      
        onWindowResize : function(fn, scope, options){
            if(!resizeEvent){
                resizeEvent = new Ext.util.Event();
                resizeTask = new Ext.util.DelayedTask(function(){
                    resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
                });
                E.on(window, "resize", function(){
                    if(Ext.isIE){
                        resizeTask.delay(50);
                    }else{
                        resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
                    }
                });
            }
            resizeEvent.addListener(fn, scope, options);
        },

       	/**
         * 当激活的文本尺寸被用户改变时触发该事件。
         * 对句柄传入旧尺寸、新尺寸的参数。
         * @param {Function} fn      事件涉及的方法
         * @param {Object}   scope   句柄的作用域
         * @param {boolean}  options
         */
        onTextResize : function(fn, scope, options){
            if(!textEvent){
                textEvent = new Ext.util.Event();
                var textEl = new Ext.Element(document.createElement('div'));
                textEl.dom.className = 'x-text-resize';
                textEl.dom.innerHTML = 'X';
                textEl.appendTo(document.body);
                textSize = textEl.dom.offsetHeight;
                setInterval(function(){
                    if(textEl.dom.offsetHeight != textSize){
                        textEvent.fire(textSize, textSize = textEl.dom.offsetHeight);
                    }
                }, this.textResizeInterval);
            }
            textEvent.addListener(fn, scope, options);
        },

        /**
         * 移除传入的window resize侦听器。
         * @param {Function} fn      事件涉及的方法
         * @param {Object}   scope   句柄的作用域
         */
        removeResizeListener : function(fn, scope){
            if(resizeEvent){
                resizeEvent.removeListener(fn, scope);
            }
        },
        
        fireResize : function(){
            if(resizeEvent){
                resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
            }   
        },
        /**
         * 配合SSL为onDocumentReady使用的Url（默认为Ext.SSL_SECURE_URL）
         */
        ieDeferSrc : false,
        textResizeInterval : 50
    };
    
    /**
     * 为该组件加入事件处理器（event handler）
     * @param {String}   eventName 侦听事件的类型
     * @param {Function} handler  句柄，事件涉及的方法
     * @param {Object}   scope (可选的) 句柄函数执行时所在的作用域。句柄函数“this”的上下文。
     * @param {Object}   options (可选的) 包含句柄配置属性的一个对象。该对象可能会下来的属性：<ul>
     * <li>scope {Object} 句柄函数执行时所在的作用域。句柄函数“this”的上下文。</li>
     * <li>delegate {String} 一个简易选择符，用于过滤目标，或是查找目标的子孙。</li>
     * <li>stopEvent {Boolean} true表示为阻止事件。即停止传播、阻止默认动作。</li>
     * <li>preventDefault {Boolean} true表示为阻止默认动作</li>
     * <li>stopPropagation {Boolean} true表示为阻止事件传播</li>
     * <li>normalized {Boolean} false表示对句柄函数传入一个浏览器对象代替Ext.EventObject</li>    
     * <li>delay {Number} 触发事件后开始执行句柄的延时时间（invocation：the act of making a particular function start），单位：毫秒</li>
     * <li>single {Boolean} true代表为下次事件触发加入一个要处理的句柄，然后再移除本身。</li> 
     * <li>buffer {Number} 指定一个毫秒数，会将句柄安排到{@link Ext.util.DelayedTask}延时之后才执行 . 
     * 如果事件在那个事件再次触发，则原句柄将<em>不会</em> 被启用，但是新句柄会安排在其位置。</li>
     * </ul><br>
     * <p>
     * <b>组合选项</b><br>
     * 利用参数选项，可以组合成不同类型的侦听器：<br>
     * <br>
     * 这个事件的含义是，已常规化的，延时的，自动停止事件并有传入一个自定义的参数（forumId）
     * 的一次性侦听器
		<pre><code>
		el.on('click', this.onClick, this, {
 			single: true,
    		delay: 100,
    		forumId: 4
		});
		</code></pre>
     * <p>
     * <b>在同一个调用附加上多个句柄（handlers）</b><br>
     * 这个方法可允许单个参数传入，包含多个句柄的配置对象。
     * <pre><code>
		el.on({
			'click': {
        		fn: this.onClick,
        		scope: this,
        		delay: 100
    		}, 
    		'mouseover': {
        		fn: this.onMouseOver,
        		scope: this
    		},
    		'mouseout': {
        		fn: this.onMouseOut,
        		scope: this
    		}
		});
		</code></pre>
     * <p>
     * 或者是以简写方式将相同的作用域对象传入到所有的句柄中：
     	<pre><code>
		el.on({
			'click': this.onClick,
    		'mouseover': this.onMouseOver,
    		'mouseout': this.onMouseOut,
    		scope: this
		});
		</code></pre>
     */   
    pub.on = pub.addListener;
    pub.un = pub.removeListener;

    pub.stoppedMouseDownEvent = new Ext.util.Event();
    return pub;
}();
/**
  * 当文档准备好的时候触发（在onload之前和在图片加载之前）。可以简写为Ext.onReady()。
  * @param {Function} fn       方法所涉及的事件
  * @param {Object}   scope    handler的作用域
  * @param {boolean}  override  传入的对象将会是这个监听器（listener）所执行的作用域
  * @member Ext
  * @method onReady
 */ 
Ext.onReady = Ext.EventManager.onDocumentReady;

Ext.onReady(function(){
    var bd = Ext.get(document.body);
    if(!bd){ return; }

    var cls = [
            Ext.isIE ? "ext-ie"
            : Ext.isGecko ? "ext-gecko"
            : Ext.isOpera ? "ext-opera"
            : Ext.isSafari ? "ext-safari" : ""];

    if(Ext.isMac){
        cls.push("ext-mac");
    }
    if(Ext.isLinux){
        cls.push("ext-linux");
    }
    if(Ext.isBorderBox){
        cls.push('ext-border-box');
    }
    if(Ext.isStrict){ // add to the parent to allow for selectors like ".ext-strict .ext-ie"
        var p = bd.dom.parentNode;
        if(p){
            p.className = p.className ? ' ext-strict' : 'ext-strict';
        }
    }
    bd.addClass(cls.join(' '));
});

/**
 * @class Ext.EventObject
 * 为了方便操作，在你定义的事件句柄上传入事件对象（Event Object），
 * 这个对象直接暴露了Yahoo! UI 事件功能。
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
        /** True if the shift key was down during the event */
        shiftKey : false,
        /** True if the control key was down during the event */
        ctrlKey : false,
        /** True if the alt key was down during the event */
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
                if(this.type == 'mousedown'){
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
            return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : this.target;
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
                /* In Opera 9, delta differs in sign as compared to IE. */
                if(window.opera) delta = -delta;
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
            return !!((this.ctrlKey || this.altKey) || this.shiftKey);
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
            
    