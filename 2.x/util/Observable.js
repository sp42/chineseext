
/**
 * @class Ext.util.Observable
 * 一个抽象基类（Abstract base class），为事件机制的管理提供一个公共接口。子类应有一个"events"属性来定义所有的事件。<br>
 * 例如：
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
     * @cfg {Object} listeners
     * 一个配置项对象，可方便在该对象初始化时便加入多个事件处理函数。
     * 这应该是一个如{@link #addListener}有效的配置项对象，即可一次过加入多个事件处理函数。
     */
    if(this.listeners){
        this.on(this.listeners);
        delete this.listeners;
    }
};
Ext.util.Observable.prototype = {
    /**
     * 触发指定的事件,并将欲执行的处理函数的参数传入。（应该至少要有事件的名称）
     * @param {String} eventName 事件名称
     * @param {Object...} args 传入事件处理函数（Event Handlers）的参数
     * @return {Boolean} 如果有处理函数返回true或者false
     */
    fireEvent : function(){
        if(this.eventsSuspended !== true){
            var ce = this.events[arguments[0].toLowerCase()];
            if(typeof ce == "object"){
                return ce.fire.apply(ce, Array.prototype.slice.call(arguments, 1));
            }
        }
        return true;
    },

    // private
    filterOptRe : /^(?:scope|delay|buffer|single)$/,

    /**
     * 加入一个事件处理函数。{@link #on}是其简写方式。
     * Appends an event handler to this element.  The shorthand version {@link #on} is equivalent.
     * @param {String} eventName 事件处理函数的名称The type of event to handle
     * @param {Function} fn 事件处理函数。该函数会送入以下的参数：The handler function the event invokes. This function is passed
     * the following parameters:<ul>
     * <li>evt : EventObject<div class="sub-desc">用于描述这次事件{@link Ext.EventObject EventObject}的事件对象The {@link Ext.EventObject EventObject} describing the event.</div></li>
     * <li>t : Element<div class="sub-desc">事件源对象，类型是{@link Ext.Element Element} The {@link Ext.Element Element} which was the target of the event.
     * 注意该项可能会选项<tt>delegate</tt>筛选而发生变化Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
     * <li>o : Object<div class="sub-desc">调用addListener时送入的选项对象The options object from the addListener call.</div></li>
     * </ul>
     * @param {Object} scope （可选的） 事件处理函数执行时所在的作用域。处理函数“this”的上下文。(optional) The scope (The <tt>this</tt> reference) of the handler function. Defaults
     * to this Element.
     * @param {Object} options （可选的） 包含句柄配置属性的一个对象。该对象可能会下来的属性：(optional) An object containing handler configuration properties.
     * This may contain any of the following properties:<ul>
     * <li>scope {Object} : 事件处理函数执行时所在的作用域。处理函数“this”的上下文环境。The scope in which to execute the handler function. The handler function's "this" context.</li>
     * <li>delegate {String} : 一个简易选择符，用于过滤目标，或是查找目标的子孙。A simple selector to filter the target or look for a descendant of the target</li>
     * <li>stopEvent {Boolean} : true表示为阻止事件。即停止传播、阻止默认动作。True to stop the event. That is stop propagation, and prevent the default action.</li>
     * <li>preventDefault {Boolean} : true表示为阻止默认动作True to prevent the default action</li>
     * <li>stopPropagation {Boolean} : true表示为阻止事件传播True to prevent event propagation</li>
     * <li>normalized {Boolean} : false表示对处理函数送入一个原始、未封装过的浏览器对象而非标准的Ext.EventObjectFalse to pass a browser event to the handler function instead of an Ext.EventObject</li>
     * <li>delay {Number} : 触发事件后处理函数延时执行的时间The number of milliseconds to delay the invocation of the handler after te event fires.</li>
     * <li>single {Boolean} : true代表为下次事件触发加入一个要处理的函数，然后再移除本身。True to add a handler to handle just the next firing of the event, and then remove itself.</li>
     * <li>buffer {Number} : 若指定一个毫秒数会把该处理函数安排到{@link Ext.util.DelayedTask}延时之后才执行。 
     * 如果事件在那个事件再次触发，则原句柄将<em>不会</em> 被启用，但是新句柄会安排在其位置。Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
     * by the specified number of milliseconds. If the event fires again within that time, the original
     * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</li>
     * </ul><br>
     * <p>
     * <b>不同配搭方式的选项Combining Options</b><br>
     * In the following examples, the shorthand form {@link #on} is used rather than the more verbose
     * addListener.  The two are equivalent. 
     * 下面的例子，使用的是{@link #on}的简写方式。和addListener是等价的。
     * 利用参数选项，可以组合成不同类型的侦听器：
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
     * <b>多个处理函数一次性登记Attaching multiple handlers in 1 call</b><br>
      * 这样的话，可允许多个事件处理函数都共享一个配置事件的配置项对象。The method also allows for a single argument to be passed which is a config object containing properties
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
     * 移除侦听器
     * @param {String}   eventName     侦听事件的类型
     * @param {Function} handler        移除的处理函数
     * @param {Object}   scope  （可选的）处理函数之作用域
     */
    removeListener : function(eventName, fn, scope){
        var ce = this.events[eventName.toLowerCase()];
        if(typeof ce == "object"){
            ce.removeListener(fn, scope);
        }
    },

    /**
     * 从这个对象身上移除所有的侦听器
     */
    purgeListeners : function(){
        for(var evt in this.events){
            if(typeof this.events[evt] == "object"){
                 this.events[evt].clearListeners();
            }
        }
    },

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
     * 定义观察者的事件。
     * @param {Object} object 定义的事件对象
     */
    addEvents : function(o){
        if(!this.events){
            this.events = {};
        }
        if(typeof o == 'string'){
            for(var i = 0, a = arguments, v; v = a[i]; i++){
                if(!this.events[a[i]]){
                    o[a[i]] = true;
                }
            }
        }else{
            Ext.applyIf(this.events, o);
        }
    },

    /**
     * 查询该对象是否有指定事件的侦听器
     * @param {String} eventName 查询事件之名称
     * @return {Boolean} True表示为事件正在被侦听
     */
    hasListener : function(eventName){
        var e = this.events[eventName];
        return typeof e == "object" && e.listeners.length > 0;
    },

    /**
     * 暂停触发所有的事件（参阅{@link #resumeEvents}）
     */
    suspendEvents : function(){
        this.eventsSuspended = true;
    },

    /**
     * 重新触发事件（参阅{@link #suspendEvents}）
     */
    resumeEvents : function(){
        this.eventsSuspended = false;
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
 * 为该元素添加事件处理函数（event handler），addListener的简写方式
 * @param {String}   eventName 侦听事件的类型
 * @param {Object}   scope     （可选的） 执行处理函数的作用域
 * @param {Function} handler    事件涉及的方法
 * @param {Object}   options   （可选的）
 */
Ext.util.Observable.prototype.on = Ext.util.Observable.prototype.addListener;
/**
 * 移除侦听器
 * @param {String}   eventName     侦听事件的类型
 * @param {Function} handler        事件涉及的方法
 * @param {Object}   scope  （可选的）处理函数的作用域
 */
Ext.util.Observable.prototype.un = Ext.util.Observable.prototype.removeListener;

/**
 * 开始捕捉特定的观察者。
 * 在事件触发<b>之前</b>,所有的事件会以“事件名称+标准签名”的形式传入到函数（传入的参数是function类型）。
 * 如果传入的函数执行后返回false，则接下的事件将不会触发。
 * @param {Observable} o 要捕捉的观察者
 * @param {Function} fn 要调用的函数
 * @param {Object} scope （可选的）函数作用域
 */
Ext.util.Observable.capture = function(o, fn, scope){
    o.fireEvent = o.fireEvent.createInterceptor(fn, scope);
};

/**
 * 从Observable身上移除<b>所有</b>已加入的捕捉captures。
 * @param {Observable} o 要释放的观察者
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