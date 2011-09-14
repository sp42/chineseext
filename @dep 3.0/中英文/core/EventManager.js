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
 * @class Ext.EventManager
 * 对于登记的事件处理器（Event handlers），能够接受一个常规化的（已作跨浏览器处理的）EventObject的参数，而非浏览器的标准事件，并直接提供一些有用的事件。
 * 更多“已常规化的事件对象（normalized event objects）”的信息，请参阅{@link Ext.EventObject}。
 * Registers event handlers that want to receive a normalized EventObject instead of the standard browser event and provides
 * several useful events directly.
 * See {@link Ext.EventObject} for more details on normalized event objects.
 * @singleton
 */
Ext.EventManager = function(){
    var docReadyEvent, docReadyProcId, docReadyState = false;
    var resizeEvent, resizeTask, textEvent, textSize;
    var E = Ext.lib.Event;
    var D = Ext.lib.Dom;
    // fix parser confusion
    var xname = 'Ex' + 't';

    var elHash = {};

    var addListener = function(el, ename, fn, wrap, scope){
        var id = Ext.id(el);
        if(!elHash[id]){
            elHash[id] = {};
        }
        var es = elHash[id];
        if(!es[ename]){
            es[ename] = [];
        }
        var ls = es[ename];
        ls.push({
            id: id,
            ename: ename,
            fn: fn,
            wrap: wrap,
            scope: scope
        });

         E.on(el, ename, wrap);

        if(ename == "mousewheel" && el.addEventListener){ // workaround for jQuery
            el.addEventListener("DOMMouseScroll", wrap, false);
            E.on(window, 'unload', function(){
                el.removeEventListener("DOMMouseScroll", wrap, false);
            });
        }
        if(ename == "mousedown" && el == document){ // fix stopped mousedowns on the document
            Ext.EventManager.stoppedMouseDownEvent.addListener(wrap);
        }
    }

    var removeListener = function(el, ename, fn, scope){
        el = Ext.getDom(el);

        var id = Ext.id(el), es = elHash[id], wrap;
        if(es){
            var ls = es[ename], l;
            if(ls){
                for(var i = 0, len = ls.length; i < len; i++){
                    l = ls[i];
                    if(l.fn == fn && (!scope || l.scope == scope)){
                        wrap = l.wrap;
                        E.un(el, ename, wrap);
                        ls.splice(i, 1);
                        break;
                    }
                }
            }
        }
        if(ename == "mousewheel" && el.addEventListener && wrap){
            el.removeEventListener("DOMMouseScroll", wrap, false);
        }
        if(ename == "mousedown" && el == document && wrap){ // fix stopped mousedowns on the document
            Ext.EventManager.stoppedMouseDownEvent.removeListener(wrap);
        }
    }

    var removeAll = function(el){
        el = Ext.getDom(el);
        var id = Ext.id(el), es = elHash[id], ls;
        if(es){
            for(var ename in es){
                if(es.hasOwnProperty(ename)){
                    ls = es[ename];
                    for(var i = 0, len = ls.length; i < len; i++){
                        E.un(el, ename, ls[i].wrap);
                        ls[i] = null;
                    }
                }
                es[ename] = null;
            }
            delete elHash[id];
        }
    }


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
            if(Ext.isIE){
                var defer = document.getElementById("ie-deferred-loader");
                if(defer){
                    defer.onreadystatechange = null;
                    defer.parentNode.removeChild(defer);
                }
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
            document.write("<s"+'cript id="ie-deferred-loader" defer="defer" src="/'+'/:"></s'+"cript>");
            var defer = document.getElementById("ie-deferred-loader");
            defer.onreadystatechange = function(){
                if(this.readyState == "complete"){
                    fireDocReady();
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
        // 无论怎么样，保证on load时触发。no matter what, make sure it fires on load
        E.on(window, "load", fireDocReady);
    };

    var createBuffered = function(h, o){
        var task = new Ext.util.DelayedTask(h);
        return function(e){
            // 创建新的impl事件对象,这样新的事件就不会消灭掉（wipe out）属性（译注,js都是by refenerce）。
        	// create new event object impl so new events don't wipe out properties
            e = new Ext.EventObjectImpl(e);
            task.delay(o.buffer, h, null, [e]);
        };
    };

    var createSingle = function(h, el, ename, fn, scope){
        return function(e){
            Ext.EventManager.removeListener(el, ename, fn, scope);
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

    var createTargeted = function(h, o){
        return function(){
            if(o.target == Ext.EventObject.setEvent(arguments[0]).target){
                h.apply(this, Array.prototype.slice.call(arguments, 0));
            }
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
            // prevent errors while unload occurring
            if(!window[xname]){
                return;
            }
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
        if(o.target){
            h = createTargeted(h, o);
        }
        if(o.delay){
            h = createDelayed(h, o);
        }
        if(o.single){
            h = createSingle(h, el, ename, fn, scope);
        }
        if(o.buffer){
            h = createBuffered(h, o);
        }

        addListener(el, ename, fn, h, scope);
        return h;
    };

    var propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;
    var pub = {

    /**
     * 加入一个事件处理函数，方法{@link #on}是其简写方式。
     * Appends an event handler to an element.  The shorthand version {@link #on} is equivalent.  Typically you will
     * use {@link Ext.Element#addListener} directly on an Element in favor of calling this version.
     * @param {String/HTMLElement} el 要分配的html元素或者其id。The html element or id to assign the event handler to
     * @param {String} eventName 事件处理函数的名称。The type of event to listen for
     * @param {Function} handler 事件处理函数。该函数会送入以下的参数：The handler function the event invokes This function is passed
     * the following parameters:<ul>
     * <li>evt : EventObject<div class="sub-desc">
     * 用于描述这次事件{@link Ext.EventObject EventObject}的事件对象。
     * The {@link Ext.EventObject EventObject} describing the event.</div></li>
     * <li>t : Element<div class="sub-desc">
     * 事件源对象，类型为{@link Ext.Element Element}。
     * 注意该项可能会因<tt>delegate</tt>选项的筛选而发生变化。
     * The {@link Ext.Element Element} which was the target of the event.
     * Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
     * <li>o : Object<div class="sub-desc">
     * 调用addListener时送入的选项对象。
     * The options object from the addListener call.</div></li>
     * </ul>
     * @param {Object} scope （可选的）事件处理函数执行时所在的作用域。处理函数“this”的上下文。(optional) The scope in which to execute the handler
     * function (the handler function's "this" context)
     * @param {Object} options （可选的） 包含句柄配置属性的一个对象。该对象可能会下来的属性：(optional) An object containing handler configuration properties.
     * This may contain any of the following properties:<ul>
     * <li>scope {Object} : 事件处理函数执行时所在的作用域。处理函数“this”的上下文环境。The scope in which to execute the handler function. The handler function's "this" context.</li>
     * <li>delegate {String} : 一个简易选择符，用于过滤目标，或是查找目标的子孙。A simple selector to filter the target or look for a descendant of the target</li>
     * <li>stopEvent {Boolean} : true表示为阻止事件。即停止传播、阻止默认动作。True to stop the event. That is stop propagation, and prevent the default action.</li>
     * <li>preventDefault {Boolean} : true表示为阻止默认动作。True to prevent the default action</li>
     * <li>stopPropagation {Boolean} : true表示为阻止事件传播。True to prevent event propagation</li>
     * <li>normalized {Boolean} : false表示对处理函数送入一个原始、未封装过的浏览器对象而非标准的Ext.EventObject。False to pass a browser event to the handler function instead of an Ext.EventObject</li>
     * <li>delay {Number} : 触发事件后处理函数延时执行的时间。The number of milliseconds to delay the invocation of the handler after te event fires.</li>
     * <li>single {Boolean} : true代表为下次事件触发加入一个要处理的函数，然后再移除本身。True to add a handler to handle just the next firing of the event, and then remove itself.</li>
     * <li>buffer {Number} : 若指定一个毫秒数会把该处理函数安排到{@link Ext.util.DelayedTask}延时之后才执行。
     * 如果事件在那个事件再次触发，则原句柄将<em>不会</em> 被启用，但是新句柄会安排在其位置。
     * Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
     * by the specified number of milliseconds. If the event fires again within that time, the original
     * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</li>
     * <li>target {Element} : 
     * 只在目标元素触发的事件才有在这句柄上，事件上报中的子元素就<i>没有</i>。
     * Only call the handler if the event was fired on the target Element, <i>not</i>
     * if the event was bubbled up from a child node.</li>
     * </ul><br>
     * <p>
     * 请参阅{@link Ext.Element#addListener}其中的例子以了解这些选项更多的用法。
     * See {@link Ext.Element#addListener} for examples of how to use these options.</p>
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
         * 移除事件处理器（event handler），跟简写方式{@link #un}是一样的。
         * 通常你会更多的使用元素本身{@link Ext.Element#removeListener}的方法。
         * Removes an event handler from an element.  The shorthand version {@link #un} is equivalent.  Typically
         * you will use {@link Ext.Element#removeListener} directly on an Element in favor of calling this version.
         * @param {String/HTMLElement} el 欲移除事件的html元素或id。The id or html element from which to remove the event
         * @param {String} eventName 事件的类型。The type of event
         * @param {Function} fn 事件的执行那个函数。The handler function to remove
         */
        removeListener : function(element, eventName, fn, scope){
            return removeListener(element, eventName, fn, scope);
        },

        /**
         * 移除某个元素所有的事件处理器。一般而言你直接在元素身上调用{@link Ext.Element#removeAllListeners}方法即可。
         * Removes all event handers from an element.  Typically you will use {@link Ext.Element#removeAllListeners}
         * directly on an Element in favor of calling this version.
         * @param {String/HTMLElement} el HTML元素或其id。The id or html element from which to remove the event
         */
        removeAll : function(element){
            return removeAll(element);
        },
     
        /**
   	     * 当Document准备好的时候触发（在onload之前和在图片加载之前）。可以简写为Ext.onReady()。
         * Fires when the document is ready (before onload and before images are loaded). Can be
         * accessed shorthanded as Ext.onReady().
         * @param {Function} fn 执行的函数。The method the event invokes
         * @param {Object} scope （可选的）函数的作用域。(optional) An object that becomes the scope of the handler
         * @param {boolean} options （可选的）标准{@link #addListener}的选项对象。(optional) An object containing standard {@link #addListener} options
         */
        onDocumentReady : function(fn, scope, options){
            if(docReadyState){ // if it already fired
                docReadyEvent.addListener(fn, scope, options);
                docReadyEvent.fire();
                docReadyEvent.clearListeners();
                return;
            }
            if(!docReadyEvent){
                initDocReady();
            }
            options = options || {};
            if(!options.delay){
                options.delay = 1;
            }
            docReadyEvent.addListener(fn, scope, options);
        },

        // private
        doResizeEvent: function(){
            resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
        },
    
        /**
         * 当window改变大小后触发，并有随改变大小的缓冲（50毫秒），对回调函数传入新视图的高度、宽度的参数。
         * Fires when the window is resized and provides resize event buffering (50 milliseconds), passes new viewport width and height to handlers.
         * @param {Function} fn       事件执行的函数。The method the event invokes
         * @param {Object}   scope    函数的作用域。An object that becomes the scope of the handler
         * @param {boolean}  options
         */
        onWindowResize : function(fn, scope, options){
            if(!resizeEvent){
                resizeEvent = new Ext.util.Event();
                resizeTask = new Ext.util.DelayedTask(this.doResizeEvent);
                E.on(window, "resize", this.fireWindowResize, this);
            }
            resizeEvent.addListener(fn, scope, options);
        },

        // exposed only to allow manual firing
        fireWindowResize : function(){
            if(resizeEvent){
                if((Ext.isIE||Ext.isAir) && resizeTask){
                    resizeTask.delay(50);
                }else{
                    resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
                }
            }
        },
        
        /**
         * 当激活的文本尺寸被用户改变时触发该事件。对回调函数传入旧尺寸、新尺寸的参数。
         * Fires when the user changes the active text size. Handler gets called with 2 params, the old size and the new size.
         * @param {Function} fn      事件执行的函数。The method the event invokes
         * @param {Object}   scope   函数的作用域。An object that becomes the scope of the handler
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
         * Removes the passed window resize listener.
         * @param {Function} fn       事件执行的函数。The method the event invokes
         * @param {Object}   scope    函数的作用域。The scope of handler
         */
        removeResizeListener : function(fn, scope){
            if(resizeEvent){
                resizeEvent.removeListener(fn, scope);
            }
        },

        // private
        fireResize : function(){
            if(resizeEvent){
                resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
            }
        },
        /**
         * 配合SSL为onDocumentReady使用的Url（默认为Ext.SSL_SECURE_URL）。
         * Url used for onDocumentReady with using SSL (defaults to Ext.SSL_SECURE_URL)
         */
        ieDeferSrc : false,
        /**
         * 检查resize事件的频率，单位是毫秒数（默认为50）。
         * The frequency, in milliseconds, to check for text resize events (defaults to 50)
         */
        textResizeInterval : 50
    };
     /**
     * Appends an event handler to an element.  Shorthand for {@link #addListener}.
     * @param {String/HTMLElement} el The html element or id to assign the event handler to
     * @param {String} eventName The type of event to listen for
     * @param {Function} handler The handler function the event invokes
     * @param {Object} scope (optional) The scope in which to execute the handler
     * function (the handler function's "this" context)
     * @param {Object} options (optional) An object containing standard {@link #addListener} options
     * @member Ext.EventManager
     * @method on
     */
    pub.on = pub.addListener;
    /**
     * Removes an event handler from an element.  Shorthand for {@link #removeListener}.
     * @param {String/HTMLElement} el The id or html element from which to remove the event
     * @param {String} eventName The type of event
     * @param {Function} fn The handler function to remove
     * @return {Boolean} True if a listener was actually removed, else false
     * @member Ext.EventManager
     * @method un
     */
    pub.un = pub.removeListener;

    pub.stoppedMouseDownEvent = new Ext.util.Event();
    return pub;
}();
/**
  * 当文档准备好的时候触发（在onload之前和在图片加载之前）。系{@link Ext.EventManager#onDocumentReady}的简写方式。
  * Fires when the document is ready (before onload and before images are loaded).  Shorthand of {@link Ext.EventManager#onDocumentReady}.
  * @param {Function} fn The method the event invokes
  * @param {Object} scope An object that becomes the scope of the handler
  * @param {boolean} options (optional) An object containing standard {@link #addListener} options
  * @member Ext
  * @method onReady
 */
Ext.onReady = Ext.EventManager.onDocumentReady;


// Initialize doc classes
(function(){
    var initExtCss = function(){
        // find the body element
        var bd = document.body || document.getElementsByTagName('body')[0];
        if(!bd){ return false; }
        var cls = [' ',
                Ext.isIE ? "ext-ie " + (Ext.isIE6 ? 'ext-ie6' : (Ext.isIE7 ? 'ext-ie7' : 'ext-ie8'))
                : Ext.isGecko ? "ext-gecko " + (Ext.isGecko2 ? 'ext-gecko2' : 'ext-gecko3')
                : Ext.isOpera ? "ext-opera"
                : Ext.isSafari ? "ext-safari"
                : Ext.isChrome ? "ext-chrome" : ""];

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
            var p = bd.parentNode;
            if(p){
                p.className += ' ext-strict';
            }
        }
        bd.className += cls.join(' ');
        return true;
    }

    if(!initExtCss()){
        Ext.onReady(initExtCss);
    }
})();

/**
 * @class Ext.EventObject
 * 为方便操作，在你定义的事件句柄上传入事件对象（Event Object），这个对象直接呈现了Yahoo! UI事件功能。
 * 同时也解决了自动null检查的不便。<br />
 * EventObject exposes the Yahoo! UI Event functionality directly on the object
 * passed to your event handler. It exists mostly for convenience. It also fixes the annoying null checks automatically to cleanup your code
 * 举例：Example:
 * <pre><code>
 function handleClick(e){ // e它不是一个标准的事件对象，而是Ext.EventObject。e is not a standard event object, it is a Ext.EventObject
    e.preventDefault();
    var target = e.getTarget();
    ...
 }
 var myDiv = Ext.get("myDiv");
 myDiv.on("click", handleClick);
 // 或者or
 Ext.EventManager.on("myDiv", 'click', handleClick);
 Ext.EventManager.addListener("myDiv", 'click', handleClick);
 </code></pre>
 * @singleton
 */
Ext.EventObject = function(){

    var E = Ext.lib.Event;

    // safari keypress events for special keys return bad keycodes
    var safariKeys = {
        3 : 13, // enter
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
        /** 一般浏览器事件。The normal browser event */
        browserEvent : null,
        /** 鼠标世界有按钮按下。The button pressed in a mouse event */
        button : -1,
        /** True表示事件触发时是有按下shift键的。True if the shift key was down during the event */
        shiftKey : false,
        /** True表示事件触发时是有按下ctrl键的。True if the control key was down during the event */
        ctrlKey : false,
        /** True表示事件触发时是有按下alt键的。True if the alt key was down during the event */
        altKey : false,

        /** 键码常量。Key constant @type Number */
        BACKSPACE: 8,
        /** 键码常量。Key constant @type Number */
        TAB: 9,
        /** 键码常量。Key constant @type Number */
        NUM_CENTER: 12,
        /** 键码常量。Key constant @type Number */
        ENTER: 13,
        /** 键码常量。Key constant @type Number */
        RETURN: 13,
        /** 键码常量。Key constant @type Number */
        SHIFT: 16,
        /** 键码常量。Key constant @type Number */
        CTRL: 17,
        CONTROL : 17, // legacy
        /** 键码常量。Key constant @type Number */
        ALT: 18,
        /** 键码常量。Key constant @type Number */
        PAUSE: 19,
        /** 键码常量。Key constant @type Number */
        CAPS_LOCK: 20,
        /** 键码常量。Key constant @type Number */
        ESC: 27,
        /** 键码常量。Key constant @type Number */
        SPACE: 32,
        /** 键码常量。Key constant @type Number */
        PAGE_UP: 33,
        PAGEUP : 33, // legacy
        /** 键码常量。Key constant @type Number */
        PAGE_DOWN: 34,
        PAGEDOWN : 34, // legacy
        /** 键码常量。Key constant @type Number */
        END: 35,
        /** 键码常量。Key constant @type Number */
        HOME: 36,
        /** 键码常量。Key constant @type Number */
        LEFT: 37,
        /** 键码常量。Key constant @type Number */
        UP: 38,
        /** 键码常量。Key constant @type Number */
        RIGHT: 39,
        /** 键码常量。Key constant @type Number */
        DOWN: 40,
        /** 键码常量。Key constant @type Number */
        PRINT_SCREEN: 44,
        /** 键码常量。Key constant @type Number */
        INSERT: 45,
        /** 键码常量。Key constant @type Number */
        DELETE: 46,
        /** 键码常量。Key constant @type Number */
        ZERO: 48,
        /** 键码常量。Key constant @type Number */
        ONE: 49,
        /** 键码常量。Key constant @type Number */
        TWO: 50,
        /** 键码常量。Key constant @type Number */
        THREE: 51,
        /** 键码常量。Key constant @type Number */
        FOUR: 52,
        /** 键码常量。Key constant @type Number */
        FIVE: 53,
        /** 键码常量。Key constant @type Number */
        SIX: 54,
        /** 键码常量。Key constant @type Number */
        SEVEN: 55,
        /** 键码常量。Key constant @type Number */
        EIGHT: 56,
        /** 键码常量。Key constant @type Number */
        NINE: 57,
        /** 键码常量。Key constant @type Number */
        A: 65,
        /** 键码常量。Key constant @type Number */
        B: 66,
        /** 键码常量。Key constant @type Number */
        C: 67,
        /** 键码常量。Key constant @type Number */
        D: 68,
        /** 键码常量。Key constant @type Number */
        E: 69,
        /** 键码常量。Key constant @type Number */
        F: 70,
        /** 键码常量。Key constant @type Number */
        G: 71,
        /** 键码常量。Key constant @type Number */
        H: 72,
        /** 键码常量。Key constant @type Number */
        I: 73,
        /** 键码常量。Key constant @type Number */
        J: 74,
        /** 键码常量。Key constant @type Number */
        K: 75,
        /** 键码常量。Key constant @type Number */
        L: 76,
        /** 键码常量。Key constant @type Number */
        M: 77,
        /** 键码常量。Key constant @type Number */
        N: 78,
        /** 键码常量。Key constant @type Number */
        O: 79,
        /** 键码常量。Key constant @type Number */
        P: 80,
        /** 键码常量。Key constant @type Number */
        Q: 81,
        /** 键码常量。Key constant @type Number */
        R: 82,
        /** 键码常量。Key constant @type Number */
        S: 83,
        /** 键码常量。Key constant @type Number */
        T: 84,
        /** 键码常量。Key constant @type Number */
        U: 85,
        /** 键码常量。Key constant @type Number */
        V: 86,
        /** 键码常量。Key constant @type Number */
        W: 87,
        /** 键码常量。Key constant @type Number */
        X: 88,
        /** 键码常量。Key constant @type Number */
        Y: 89,
        /** 键码常量。Key constant @type Number */
        Z: 90,
        /** 键码常量。Key constant @type Number */
        CONTEXT_MENU: 93,
        /** 键码常量。Key constant @type Number */
        NUM_ZERO: 96,
        /** 键码常量。Key constant @type Number */
        NUM_ONE: 97,
        /** 键码常量。Key constant @type Number */
        NUM_TWO: 98,
        /** 键码常量。Key constant @type Number */
        NUM_THREE: 99,
        /** 键码常量。Key constant @type Number */
        NUM_FOUR: 100,
        /** 键码常量。Key constant @type Number */
        NUM_FIVE: 101,
        /** 键码常量。Key constant @type Number */
        NUM_SIX: 102,
        /** 键码常量。Key constant @type Number */
        NUM_SEVEN: 103,
        /** 键码常量。Key constant @type Number */
        NUM_EIGHT: 104,
        /** 键码常量。Key constant @type Number */
        NUM_NINE: 105,
        /** 键码常量。Key constant @type Number */
        NUM_MULTIPLY: 106,
        /** 键码常量。Key constant @type Number */
        NUM_PLUS: 107,
        /** 键码常量。Key constant @type Number */
        NUM_MINUS: 109,
        /** 键码常量。Key constant @type Number */
        NUM_PERIOD: 110,
        /** 键码常量。Key constant @type Number */
        NUM_DIVISION: 111,
        /** 键码常量。Key constant @type Number */
        F1: 112,
        /** 键码常量。Key constant @type Number */
        F2: 113,
        /** 键码常量。Key constant @type Number */
        F3: 114,
        /** 键码常量。Key constant @type Number */
        F4: 115,
        /** 键码常量。Key constant @type Number */
        F5: 116,
        /** 键码常量。Key constant @type Number */
        F6: 117,
        /** 键码常量。Key constant @type Number */
        F7: 118,
        /** 键码常量。Key constant @type Number */
        F8: 119,
        /** 键码常量。Key constant @type Number */
        F9: 120,
        /** 键码常量。Key constant @type Number */
        F10: 121,
        /** 键码常量。Key constant @type Number */
        F11: 122,
        /** 键码常量。Key constant @type Number */
        F12: 123,

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
                this.charCode = 0;
                this.target = null;
                this.xy = [0, 0];
            }
            return this;
        },

        /**
         * 停止事件（preventDefault和stopPropagation）。
         * Stop the event (preventDefault and stopPropagation)
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
         * 阻止浏览器默认行为处理事件。
         * Prevents the browsers default handling of the event.
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
         * 获取事件的键盘代码。
         * Cancels bubbling of the event.
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
         * 返回一个常规化的事件键盘代码
         * Gets the character code for the event.
         * @return {Number} 键盘代码
         */
        getCharCode : function(){
            return this.charCode || this.keyCode;
        },

        /**
         * Returns a normalized keyCode for the event.
         * @return {Number} The key code
         */
        getKey : function(){
            var k = this.keyCode || this.charCode;
            return Ext.isSafari ? (safariKeys[k] || k) : k;
        },

        /**
         * 获取事件X坐标。
         * Gets the x coordinate of the event.
         * @return {Number}
         */
        getPageX : function(){
            return this.xy[0];
        },

        /**
         * 获取事件Y坐标。
         * Gets the y coordinate of the event.
         * @return {Number}
         */
        getPageY : function(){
            return this.xy[1];
        },

        /**
         * 获取事件的时间。
         * Gets the time of the event.
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
         * Gets the page coordinates of the event.
         * @return {Array} xy值，格式[x, y]。The xy values like [x, y]
         */
        getXY : function(){
            return this.xy;
        },
 
        /**
         * 获取事件的目标对象。
         * Gets the target for the event.
         * @param {String} selector （可选的） 一个简易的选择符，用于筛选目标或查找目标的父级元素。(optional) A simple selector to filter the target or look for an ancestor of the target
         * @param {Number/Mixed} maxDepth （可选的）搜索的最大深度（数字或是元素，默认为10||document.body）。(optional) The max depth to search as a number or element (defaults to 10 || document.body)
         * @param {Boolean} returnEl （可选的） True表示为返回Ext.Element的对象而非DOM节点。(optional) True to return a Ext.Element object instead of DOM node
         * @return {HTMLelement}
         */
        getTarget : function(selector, maxDepth, returnEl){
            return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Ext.get(this.target) : this.target);
        },

        /**
         * 获取相关的目标对象。
         * Gets the related target.
         * @return {HTMLElement}
         */
        getRelatedTarget : function(){
            if(this.browserEvent){
                return E.getRelatedTarget(this.browserEvent);
            }
            return null;
        },

        /**
         * 常规化鼠标滚轮的有限增量（跨浏览器）。
         * Normalizes mouse wheel delta across browsers
         * @return {Number} 有限增量。The delta
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
         * Returns true if the control, meta, shift or alt key was pressed during this event.
         * @return {Boolean}
         */
        hasModifier : function(){
            return ((this.ctrlKey || this.altKey) || this.shiftKey) ? true : false;
        },

        /**
         * 返回true表示如果该事件的目标对象等于el，或是el的子元素。
         * Returns true if the target of this event is a child of el.  Unless the allowEl parameter is set, it will return false if if the target is el.
         * Example usage:<pre><code>
// Handle click on any child of an element
Ext.getBody().on('click', function(e){
    if(e.within('some-el')){
        alert('Clicked on a child of some-el!');
    }
});

// Handle click directly on an element, ignoring clicks on child nodes
Ext.getBody().on('click', function(e,t){
    if((t.id == 'some-el') && !e.within(t, true)){
        alert('Clicked directly on some-el!');
    }
});
</code></pre>
         * @param {Mixed} el The id, DOM element or Ext.Element to check
         * @param {Boolean} related （可选的）如果相关的target就是el而非target本身，返回true。(optional) true to test if the related target is within el instead of the target
         * @param {Boolean} allowEl {optional} true to also check if the passed element is the target or related target
         * @return {Boolean}
         */
        within : function(el, related, allowEl){
            var t = this[related ? "getRelatedTarget" : "getTarget"]();
            return t && ((allowEl ? (t === Ext.getDom(el)) : false) || Ext.fly(el).contains(t));
        },

        getPoint : function(){
            return new Ext.lib.Point(this.xy[0], this.xy[1]);
        }
    };

    return new Ext.EventObjectImpl();
}();