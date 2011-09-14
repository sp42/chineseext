/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://www.extjs.com/license
 */

/**
 * @class Ext.util.DelayedTask
 * 提供快捷的方法执行setTimeout，新的超时时限会取消旧的超时时限.
 * 例如验证表单的时候，键盘按下(keypress)那一瞬，就可用上该类（不会立即验证表单，稍作延时）。
 * keypress事件会稍作停顿之后（某个时间）才继续执行、
 * @constructor 该构建器无须参数
 * @param {Function} fn (optional) 默认超时的函数。
 * @param {Object} scope (optional) 默认超时的作用域
 * @param {Array} args (optional) 默认参数数组
 */
Ext.util.DelayedTask = function(fn, scope, args){
    var id = null, d, t;

    var call = function(){
        var now = new Date().getTime();
        if(now - t >= d){
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        }
    };
    /**
     * 取消所有待定的超时（any pending timeout），并重新排列（queues）。
     * @param {Number} delay 延迟毫秒数
     * @param {Function} newFn (optional) 重写传入到构建器的函数
     * @param {Object} newScope (optional) 重写传入到构建器的作用域
     * @param {Array} newArgs (optional)  重写传入到构建器的参数
     */
    this.delay = function(delay, newFn, newScope, newArgs){
        if(id && delay != d){
            this.cancel();
        }
        d = delay;
        t = new Date().getTime();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        if(!id){
            id = setInterval(call, d);
        }
    };

    /**
     * 取消最后的排列超时
     */
    this.cancel = function(){
        if(id){
            clearInterval(id);
            id = null;
        }
    };
};