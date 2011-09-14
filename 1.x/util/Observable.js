/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://www.extjs.com/license
 */

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
     * 一个配置项对象，可方便在该对象初始化时便加入多个事件句柄。
     * 这应该是一个如{@link #addListener}有效的配置项对象，即可一次过加入多个事件句柄。
     */
    if(this.listeners){
        this.on(this.listeners);
        delete this.listeners;
    }
};
Ext.util.Observable.prototype = {
    /**
     * 触发指定的事件,并将参数传入（至少要有事件名称）。
     * @param {String} eventName
     * @param {Object...} args 传入句柄（handlers）的参数
     * @return {Boolean} 如果有句柄返回false而返回false，否则返回true
     */
    fireEvent : function(){
        var ce = this.events[arguments[0].toLowerCase()];
        if(typeof ce == "object"){
            return ce.fire.apply(ce, Array.prototype.slice.call(arguments, 1));
        }else{
            return true;
        }
    },

    // private
    filterOptRe : /^(?:scope|delay|buffer|single)$/,

    /**
     * 为该组件加入事件句柄（event handler）
     * @param {String}   eventName 侦听事件的类型
     * @param {Function} handler  句柄，事件执行的方法
     * @param {Object}   scope (可选的) 句柄函数执行时所在的作用域。句柄函数“this”的上下文。
     * @param {Object}   options (可选的) 包含句柄配置属性的一个对象。该对象可能会有下列的属性：<ul>
     * <li>scope {Object} 句柄函数执行时所在的作用域。句柄函数“this”的上下文。</li>
     * <li>delay {Number} 触发事件后开始执行句柄的延时时间（invocation：the act of making a particular function start），单位：毫秒</li>
     * <li>single {Boolean} true代表为下次事件触发加入一个要处理的句柄，然后再移除本身。</li>
     * <li>buffer {Number} 指定一个毫秒数，会将句柄安排到{@link Ext.util.DelayedTask}延时之后才执行 .
     * 如果事件在那个事件再次触发，则原句柄将<em>不会</em> 被启用，但是新句柄会安排在其位置。</li>
     * </ul><br>
     * <p>
     * <b>不同配搭方式的选项</b><br>
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
     * <b>一次调用加入上多个句柄（handlers）</b><br>
     * 这个方法可接收一个参数，该参数是包含了多个句柄的配置的对象。
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
     * 或者是以简写的方式书写，前提是只允许同一个的作用域对象传入到所有的句柄中：
     	<pre><code>
		el.on({
			'click': this.onClick,
    		'mouseover': this.onMouseOver,
    		'mouseout': this.onMouseOut,
    		scope: this
		});
		</code></pre>
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
     * @param {Function} handler        移除的句柄
     * @param {Object}   scope  (optional) 句柄之作用域
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
        Ext.applyIf(this.events, o);
    },

    /**
     * 查询该对象是否有指定事件的侦听器
     * @param {String} eventName 查询事件之名称
     * @return {Boolean} True表示为事件正在被侦听
     */
    hasListener : function(eventName){
        var e = this.events[eventName];
        return typeof e == "object" && e.listeners.length > 0;
    }
};
/**
 * 为该元素添加事件句柄（event handler），addListener的简写方式
 * @param {String}   eventName 侦听事件的类型
 * @param {Object}   scope     （可选的） 执行句柄的作用域
 * @param {Function} handler    事件涉及的方法
 * @param {Object}   options   （可选的）
 * @method
 */
Ext.util.Observable.prototype.on = Ext.util.Observable.prototype.addListener;

/**
 * 移除侦听器
 * @param {String}   eventName     侦听事件的类型
 * @param {Function} handler        事件涉及的方法
 * @param {Object}   scope  （可选的）句柄的作用域
 * @method
 */
Ext.util.Observable.prototype.un = Ext.util.Observable.prototype.removeListener;

/**.
 * 开始捕捉特定的观察者。
 * 在事件触发<b>之前</b>,所有的事件会以"事件名称+标准签名"的形式传入到函数（传入的参数是function类型）。
 * 如果传入的函数执行后返回false，则接下的事件将不会触发。
 * @param {Observable} o 要捕捉的观察者
 * @param {Function} fn 要调用的函数
 * @param {Object} scope （可选的）函数作用域
 * @static
 */
Ext.util.Observable.capture = function(o, fn, scope){
    o.fireEvent = o.fireEvent.createInterceptor(fn, scope);
};

/**
 * 从Observable身上移除<b>所有</b>已加入的捕捉captures
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
            var o = options || {};
            scope = scope || this.obj;
            if(!this.isListening(fn, scope)){
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
                if(!this.firing){ // if we are currently firing this event, don't disturb the listener loop
                    this.listeners.push(l);
                }else{
                    this.listeners = this.listeners.slice(0);
                    this.listeners.push(l);
                }
            }
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