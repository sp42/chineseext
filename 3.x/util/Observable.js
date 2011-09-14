/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.util.Observable
 * 一个抽象基类（Abstract base class），为事件机制的管理提供一个公共接口。子类应有一个"events"属性来定义所有的事件。
 * Abstract base class that provides a common interface for publishing events. Subclasses are expected to
 * to have a property "events" with all the events defined.<br>
 * 例如：For example:
 * <pre><code>
 Employee = function(name){
    this.name = name;
    this.addEvents({
        "fired" : true,
        "quit" : true
    });
 }
 Ext.extend(Employee, Ext.util.Observable);
</code></pre>
 */
Ext.util.Observable = function(){
    /**
     * @cfg {Object} listeners (optional) A config object containing one or more event handlers to be added to this
     * object during initialization.  This should be a valid listeners config object as specified in the
     * {@link #addListener} example for attaching multiple handlers at once.
     */
    if(this.listeners){
        this.on(this.listeners);
        delete this.listeners;
    }
    if(!this.events){
        this.events = {};
    }
};
Ext.util.Observable.prototype = {
    /**
     * 触发指定的事件,并在这里把处理函数的参数传入（应该至少要有事件的名称）。
     * Fires the specified event with the passed parameters (minus the event name).
     * @param {String} eventName 事件名称The name of the event to fire. If the event is to bubble
     * up an Observable parent hierarchy (See {@link Ext.Component#getBubbleTarget}) then
     * the first argument must be passed as <tt>true</tt>, and the event name is passed
     * as the second argument.
     * 如果这个事件是要在Observable父类上逐层上报（参阅{@link Ext.Component#getBubbleTarget}），那么第一个参数一定是<tt>true</tt>，然后第二个参数是事件名称。
     * @param {Object...} args 传入事件处理函数的参数Variable number of parameters are passed to handlers
     * @return {Boolean} 从处理函数返回true或者false returns false if any of the handlers return false otherwise it returns true
     */
    fireEvent : function(){
        var a = Array.prototype.slice.call(arguments, 0);
        var ename = a[0];
        if(ename === true){
            a.shift();
            var c = this;
            while(c){
                if(c.fireEvent.apply(c, a) === false){
                    return false;
                }
                c = c.getBubbleTarget ? c.getBubbleTarget() : null;
            }
            return true;
        }
        if(this.eventsSuspended === true){
            var q = this.suspendedEventsQueue;
            if (q) {
                q[q.length] = a;
            }
        } else {
            var ce = this.events[ename.toLowerCase()];
            if(typeof ce == "object"){
                a.shift();
                return ce.fire.apply(ce, a);
            }
        }
        return true;
    },

    // private
    filterOptRe : /^(?:scope|delay|buffer|single)$/,

    /**
     * 加入一个事件处理函数。{@link #on}是其简写方式。
     * Appends an event handler to this element.  The shorthand version {@link #on} is equivalent.
     * @param {String} eventName 事件处理函数的名称。The type of event to handle
     * @param {Function} fn 事件处理函数。该函数会送入以下的参数：The handler function the event invokes. This function is passed
     * the following parameters:<ul>
     * <li>evt : EventObject<div class="sub-desc">用于描述这次事件{@link Ext.EventObject EventObject}的事件对象。The {@link Ext.EventObject EventObject} describing the event.</div></li>
     * <li>t : Element<div class="sub-desc">事件源对象，类型是{@link Ext.Element Element} The {@link Ext.Element Element} which was the target of the event.
     * 注意该项可能会选项<tt>delegate</tt>筛选而发生变化Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
     * <li>o : Object<div class="sub-desc">调用addListener时送入的选项对象The options object from the addListener call.</div></li>
     * </ul>
     * @param {Object} scope （可选的） 事件处理函数执行时所在的作用域。处理函数“this”的上下文。(optional) The scope (The <tt>this</tt> reference) of the handler function. Defaults
     * to this Element.
     * @param {Object} options （可选的） 包含句柄配置属性的一个对象。该对象可能会下来的属性：
     * (optional) An object containing handler configuration properties.
     * This may contain any of the following properties:<ul>
     * <li>scope {Object} : 事件处理函数执行时所在的作用域。处理函数“this”的上下文环境。The scope in which to execute the handler function. The handler function's "this" context.</li>
     * <li>delegate {String} : 一个简易选择符，用于过滤目标，或是查找目标的子孙。A simple selector to filter the target or look for a descendant of the target</li>
     * <li>stopEvent {Boolean} : true表示为阻止事件。即停止传播、阻止默认动作。True to stop the event. That is stop propagation, and prevent the default action.</li>
     * <li>preventDefault {Boolean} : true表示为阻止默认动作。True to prevent the default action</li>
     * <li>stopPropagation {Boolean} : true表示为阻止事件传播。True to prevent event propagation</li>
     * <li>normalized {Boolean} : false表示对处理函数送入一个原始、未封装过的浏览器对象而非标准的Ext.EventObject。False to pass a browser event to the handler function instead of an Ext.EventObject</li>
     * <li>delay {Number} : 触发事件后处理函数延时执行的时间。The number of milliseconds to delay the invocation of the handler after te event fires.</li>
     * <li>single {Boolean} : true代表为事件触发后加入一个下次移除本身的处理函数。True to add a handler to handle just the next firing of the event, and then remove itself.</li>
     * <li>buffer {Number} : 若指定一个毫秒数会把该处理函数安排到{@link Ext.util.DelayedTask}延时之后才执行。 
     * 如果事件在那个事件再次触发，则原处理器句柄将<em>不会</em> 被启用，但是新处理器句柄会安排在其位置。Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
     * by the specified number of milliseconds. If the event fires again within that time, the original
     * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</li>
     * </ul><br>
     * <p>
     * <b>不同配搭方式的选项 Combining Options</b><br>
     * 下面的例子，使用的是{@link #on}的简写方式。和addListener是等价的。
     * 利用参数选项，可以组合成不同类型的侦听器：
     * In the following examples, the shorthand form {@link #on} is used rather than the more verbose
     * addListener.  The two are equivalent. 
     * Using the options argument, it is possible to combine different
     * types of listeners:<br>
     * <br>
     * 这个事件的含义是，已常规化的，延时的，自动停止事件并有传入一个自定义的参数（forumId）的一次性侦听器。这些事件设置在处理函数（也就是第三个的参数）中也可以找到的。
     * A normalized, delayed, one-time listener that auto stops the event and adds a custom argument (forumId) to the
     * options object. The options object is available as the third parameter in the handler function.<div style="margin: 5px 20px 20px;">
     * 代码：Code:<pre><code>
el.on('click', this.onClick, this, {
    single: true,
    delay: 100,
    stopEvent : true,
    forumId: 4
});</code></pre></p>
     * <p>
     * <b>多个处理函数一次性登记。Attaching multiple handlers in 1 call</b><br>
     * 这样的话，可允许多个事件处理函数都共享一个配置事件的配置项对象。
     * The method also allows for a single argument to be passed which is a config object containing properties
     * which specify multiple handlers.</p>
     * <p>
     * 代码：Code:<pre><code>
el.on({
    'click' : {
        fn: this.onClick,
        scope: this,
        delay: 100
    },
    'mouseover' : {
        fn: this.onMouseOver,
        scope: this
    },
    'mouseout' : {
        fn: this.onMouseOut,
        scope: this
    }
});</code></pre></p>
     * <p>
     * 或者是简写的语法：Or a shorthand syntax:<br>
     * Code:<pre><code>
el.on({
    'click' : this.onClick,
    'mouseover' : this.onMouseOver,
    'mouseout' : this.onMouseOut,
    scope: this
});</code></pre></p>
     */
    addListener : function(eventName, fn, scope, o){
        if(typeof eventName == "object"){
            o = eventName;
            for(var e in o){
                if(this.filterOptRe.test(e)){
                    continue;
                }
                if(typeof o[e] == "function"){
                    // shared options
                    this.addListener(e, o[e], o.scope,  o);
                }else{
                    // individual options
                    this.addListener(e, o[e].fn, o[e].scope, o[e]);
                }
            }
            return;
        }
        o = (!o || typeof o == "boolean") ? {} : o;
        eventName = eventName.toLowerCase();
        var ce = this.events[eventName] || true;
        if(typeof ce == "boolean"){
            ce = new Ext.util.Event(this, eventName);
            this.events[eventName] = ce;
        }
        ce.addListener(fn, scope, o);
    },
    
    /**
     * 移除侦听器Removes a listener
     * @param {String}   eventName 侦听事件的类型The type of event to listen for
     * @param {Function} handler 移除的处理函数The handler to remove
     * @param {Object}   scope  （可选的） 处理函数之作用域(optional) The scope (this object) for the handler
     */
    removeListener : function(eventName, fn, scope){
        var ce = this.events[eventName.toLowerCase()];
        if(typeof ce == "object"){
            ce.removeListener(fn, scope);
        }
    },

    /**
     * 从这个对象身上移除所有的侦听器。Removes all listeners for this object
     */
    purgeListeners : function(){
        for(var evt in this.events){
            if(typeof this.events[evt] == "object"){
                 this.events[evt].clearListeners();
            }
        }
    },

    /**
     * Relays selected events from the specified Observable as if the events were fired by <tt><b>this</b></tt>.
     * @param {Object} o The Observable whose events this object is to relay.
     * @param {Array} events Array of event names to relay.
     */
    relayEvents : function(o, events){
        var createHandler = function(ename){
            return function(){
                return this.fireEvent.apply(this, Ext.combine(ename, Array.prototype.slice.call(arguments, 0)));
            };
        };
        for(var i = 0, len = events.length; i < len; i++){
            var ename = events[i];
            if(!this.events[ename]){ this.events[ename] = true; };
            o.on(ename, createHandler(ename), this);
        }
    },

    /**
     * 定义观察者的事件。Used to define events on this Observable
     * @param {Object} o 定义的事件对象。object The object with the events defined
     */
    addEvents : function(o){
        if(!this.events){
            this.events = {};
        }
        if(typeof o == 'string'){
            for(var i = 0, a = arguments, v; v = a[i]; i++){
                if(!this.events[a[i]]){
                    this.events[a[i]] = true;
                }
            }
        }else{
            Ext.applyIf(this.events, o);
        }
    },

    /**
     * 检测当前对象是否有指定的事件。
     * Checks to see if this object has any listeners for a specified event
     * @param {String} eventName 要检查的事件名称。The name of the event to check for
     * @return {Boolean} True表示有事件正在被监听，否则为false。True if the event is being listened for, else false
     */
    hasListener : function(eventName){
        var e = this.events[eventName];
        return typeof e == "object" && e.listeners.length > 0;
    },

    /**
     * 暂停触发所有的事件（参阅{@link #resumeEvents}）。
     * Suspend the firing of all events. (see {@link #resumeEvents})
     * @param {Boolean} queueSuspended  Pass as true to queue up suspended events to be fired
     * after the {@link #resumeEvents} call instead of discarding all suspended events;
     */
    suspendEvents : function(queueSuspended){
        this.eventsSuspended = true;
        if (queueSuspended === true) {
            this.suspendedEventsQueue = [];
        }
    },

    /**
     * 重新触发事件（参阅{@link #suspendEvents}）。
     * Resume firing events. (see {@link #suspendEvents})
     * If events were suspended using the <tt><b>queueSuspended</b></tt> parameter, then all
     * events fired during event suspension will be sent to any listeners now.
     */
    resumeEvents : function(){
        this.eventsSuspended = false;
        if (this.suspendedEventsQueue) {
            for (var i = 0, e = this.suspendedEventsQueue, l = e.length; i < l; i++) {
                this.fireEvent.apply(this, e[i]);
            }
            delete this.suspendedEventQueue;
        }
    },

    // these are considered experimental
    // allows for easier interceptor and sequences, including cancelling and overwriting the return value of the call
    // private
    getMethodEvent : function(method){
        if(!this.methodEvents){
            this.methodEvents = {};
        }
        var e = this.methodEvents[method];
        if(!e){
            e = {};
            this.methodEvents[method] = e;

            e.originalFn = this[method];
            e.methodName = method;
            e.before = [];
            e.after = [];


            var returnValue, v, cancel;
            var obj = this;

            var makeCall = function(fn, scope, args){
                if((v = fn.apply(scope || obj, args)) !== undefined){
                    if(typeof v === 'object'){
                        if(v.returnValue !== undefined){
                            returnValue = v.returnValue;
                        }else{
                            returnValue = v;
                        }
                        if(v.cancel === true){
                            cancel = true;
                        }
                    }else if(v === false){
                        cancel = true;
                    }else {
                        returnValue = v;
                    }
                }
            }

            this[method] = function(){
                returnValue = v = undefined; cancel = false;
                var args = Array.prototype.slice.call(arguments, 0);
                for(var i = 0, len = e.before.length; i < len; i++){
                    makeCall(e.before[i].fn, e.before[i].scope, args);
                    if(cancel){
                        return returnValue;
                    }
                }

                if((v = e.originalFn.apply(obj, args)) !== undefined){
                    returnValue = v;
                }

                for(var i = 0, len = e.after.length; i < len; i++){
                    makeCall(e.after[i].fn, e.after[i].scope, args);
                    if(cancel){
                        return returnValue;
                    }
                }
                return returnValue;
            };
        }
        return e;
    },

    // adds an "interceptor" called before the original method
    beforeMethod : function(method, fn, scope){
        var e = this.getMethodEvent(method);
        e.before.push({fn: fn, scope: scope});
    },

    // adds a "sequence" called after the original method
    afterMethod : function(method, fn, scope){
        var e = this.getMethodEvent(method);
        e.after.push({fn: fn, scope: scope});
    },

    removeMethodListener : function(method, fn, scope){
        var e = this.getMethodEvent(method);
        for(var i = 0, len = e.before.length; i < len; i++){
            if(e.before[i].fn == fn && e.before[i].scope == scope){
                e.before.splice(i, 1);
                return;
            }
        }
        for(var i = 0, len = e.after.length; i < len; i++){
            if(e.after[i].fn == fn && e.after[i].scope == scope){
                e.after.splice(i, 1);
                return;
            }
        }
    }
};

/**
 * 为该元素添加事件处理函数（addListener的简写方式）。
 * Appends an event handler to this element (shorthand for addListener)
 * @param {String}   eventName     事件名称The type of event to listen for
 * @param {Function} handler        处理函数The method the event invokes
 * @param {Object}   scope （可选的） 执行处理函数的作用域。“this”对象指针(optional) The scope in which to execute the handler
 * function. The handler function's "this" context.
 * @param {Object}   options  （可选的）(optional)
 * @method
 */
Ext.util.Observable.prototype.on = Ext.util.Observable.prototype.addListener;
/**
 * 移除侦听器（removeListener的快捷方式）Removes a listener (shorthand for removeListener)
 * @param {String}   eventName     侦听事件的类型The type of event to listen for
 * @param {Function} handler       事件涉及的方法 The handler to remove
 * @param {Object}   scope  （可选的） 处理函数的作用域(optional) The scope (this object) for the handler
 * @method
 */
Ext.util.Observable.prototype.un = Ext.util.Observable.prototype.removeListener;

/**
 * 开始捕捉特定的观察者。
 * 在事件触发<b>之前</b>，所有的事件会以“事件名称+标准签名”的形式传入到函数（传入的参数是function类型）。
 * 如果传入的函数执行后返回false，则接下的事件将不会触发。
 * Starts capture on the specified Observable. All events will be passed
 * to the supplied function with the event name + standard signature of the event
 * <b>before</b> the event is fired. If the supplied function returns false,
 * the event will not fire.
 * @param {Observable} o 要捕捉的观察者The Observable to capture
 * @param {Function} fn 要调用的函数The function to call
 * @param {Object} scope （可选的） 函数作用域(optional) The scope (this object) for the fn
 * @static
 */
Ext.util.Observable.capture = function(o, fn, scope){
    o.fireEvent = o.fireEvent.createInterceptor(fn, scope);
};

/**
 * 从Observable身上移除<b>所有</b>已加入的捕捉captures。Removes <b>all</b> added captures from the Observable.
 * @param {Observable} o 要释放的观察者The Observable to release
 * @static
 */
Ext.util.Observable.releaseCapture = function(o){
    o.fireEvent = Ext.util.Observable.prototype.fireEvent;
};

(function(){

    var createBuffered = function(h, o, scope){
        var task = new Ext.util.DelayedTask();
        return function(){
            task.delay(o.buffer, h, scope, Array.prototype.slice.call(arguments, 0));
        };
    };

    var createSingle = function(h, e, fn, scope){
        return function(){
            e.removeListener(fn, scope);
            return h.apply(scope, arguments);
        };
    };

    var createDelayed = function(h, o, scope){
        return function(){
            var args = Array.prototype.slice.call(arguments, 0);
            setTimeout(function(){
                h.apply(scope, args);
            }, o.delay || 10);
        };
    };

    var createTargeted = function(h, o, scope){
        return function(){
            if(o.target == arguments[0]){
                h.apply(scope, Array.prototype.slice.call(arguments, 0));
            }
        };
    };

    Ext.util.Event = function(obj, name){
        this.name = name;
        this.obj = obj;
        this.listeners = [];
    };

    Ext.util.Event.prototype = {
        addListener : function(fn, scope, options){
            scope = scope || this.obj;
            if(!this.isListening(fn, scope)){
                var l = this.createListener(fn, scope, options);
                if(!this.firing){
                    this.listeners.push(l);
                }else{ // if we are currently firing this event, don't disturb the listener loop
                    this.listeners = this.listeners.slice(0);
                    this.listeners.push(l);
                }
            }
        },

        createListener : function(fn, scope, o){
            o = o || {};
            scope = scope || this.obj;
            var l = {fn: fn, scope: scope, options: o};
            var h = fn;
            if(o.target){
                h = createTargeted(h, o, scope);
            }
            if(o.delay){
                h = createDelayed(h, o, scope);
            }
            if(o.single){
                h = createSingle(h, this, fn, scope);
            }
            if(o.buffer){
                h = createBuffered(h, o, scope);
            }
            l.fireFn = h;
            return l;
        },

        findListener : function(fn, scope){
            scope = scope || this.obj;
            var ls = this.listeners;
            for(var i = 0, len = ls.length; i < len; i++){
                var l = ls[i];
                if(l.fn == fn && l.scope == scope){
                    return i;
                }
            }
            return -1;
        },

        isListening : function(fn, scope){
            return this.findListener(fn, scope) != -1;
        },

        removeListener : function(fn, scope){
            var index;
            if((index = this.findListener(fn, scope)) != -1){
                if(!this.firing){
                    this.listeners.splice(index, 1);
                }else{
                    this.listeners = this.listeners.slice(0);
                    this.listeners.splice(index, 1);
                }
                return true;
            }
            return false;
        },

        clearListeners : function(){
            this.listeners = [];
        },

        fire : function(){
            var ls = this.listeners, scope, len = ls.length;
            if(len > 0){
                this.firing = true;
                var args = Array.prototype.slice.call(arguments, 0);
                for(var i = 0; i < len; i++){
                    var l = ls[i];
                    if(l.fireFn.apply(l.scope||this.obj||window, arguments) === false){
                        this.firing = false;
                        return false;
                    }
                }
                this.firing = false;
            }
            return true;
        }
    };
})();