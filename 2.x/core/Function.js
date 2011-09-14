/**
 * @class Function
 * 这个函数可用于任何Function对象（任何javascript函数）。
 */
Ext.apply(Function.prototype, {
     /**
     * 创建一个回调函数，该回调传递参数的形式为：arguments[0], arguments[1], arguments[2], ...
     * 对于任何函数来说都是可以直接调用的。
     * 例如: <code>myFunction.createCallback(myarg, myarg2)</code>
     * 将创建一个函数，要求有2个参数
     * @return {Function} 新产生的函数
    */
    createCallback : function(/*args...*/){
        // make args available, in function below
        var args = arguments;
        var method = this;
        return function() {
            return method.apply(window, args);
        };
    },

    /**
     * 创建一个委派对象 (回调) ，该对象的作用域指向obj
     * 对于任何函数来说都是可以直接调用的。
     * 例如：<code>this.myFunction.createDelegate(this)</code>
     * 将创建一个函数，该函数的作用域会自动指向 this。
     * （译注：这是一个极其有用的函数，既创建一个即带参数又没有执行的函数，封装事件时很有价值）
     * @param {Object} obj (该参数可选) 自定义的作用域对象
     * @param {Array} args (该参数可选) 覆盖原函数的参数。（默认为该函数的arguments）
     * @param {Boolean/Number} appendArgs (该参数可选) 如果该参数为true，将args加载到该函数的后面，如果该参数为数字类型，则args将插入到所指定的位置
     * @return {Function} 新产生的函数
     */
    createDelegate : function(obj, args, appendArgs){
        var method = this;
        return function() {
            var callArgs = args || arguments;
            if(appendArgs === true){
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }else if(typeof appendArgs == "number"){
                callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                var applyArgs = [appendArgs, 0].concat(args); // create method call params
                Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
            }
            return method.apply(obj || window, callArgs);
        };
    },

    /**
     * 延迟调用该函数。
     * @param {Number} 延迟时间，以毫秒为记 （如果是0则立即执行）
     * @param {Object} obj (该参数可选) 该函数作用域
     * @param {Array} args (该参数可选) 覆盖原函数的参数。（默认为该函数的arguments）
     * @param {Boolean/Number} appendArgs (该参数可选) 如果该参数为true，将args加载到该函数的后面，
     *                                             如果该参数为数字类型，则args将插入到所指定的位置
     * @return {Number} The timeout id that can be used with clearTimeout
     */
    defer : function(millis, obj, args, appendArgs){
        var fn = this.createDelegate(obj, args, appendArgs);
        if(millis){
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    },
    /**
     * 创建一个组合函数，调用次序为：原函数 + 参数中的函数。
     * 该函数返回了原函数执行的结果（也就是返回了原函数的返回值）
     * 在参数中传递的函数fcn，它的参数也是原函数的参数。
     * @param {Function} fcn 将要进行组合的函数
     * @param {Object} scope (该参数可选) fcn的作用域 （默认指向原函数或window）
     * @return {Function} 新产生的函数
     */
    createSequence : function(fcn, scope){
        if(typeof fcn != "function"){
            return this;
        }
        var method = this;
        return function() {
            var retval = method.apply(this || window, arguments);
            fcn.apply(scope || this || window, arguments);
            return retval;
        };
    },

    /**
     * 创建一个拦截器函数。 传递的参数fcn被原函数之前调用。 如果fcn的返回值为false，则原函数不会被调用。
     * 在返回函数中，将返回原函数的返回值。
     * 参数fcn会被调用，fcn被调用时会被传入原函数的参数。
     * @param {Function} fcn 在原函数被调用前调用的函数
     * @param {Object} scope （可选的）fcn的作用域（默认指向原函数或window）
     * @return {Function} 新产生的函数
     */
    createInterceptor : function(fcn, scope){
        if(typeof fcn != "function"){
            return this;
        }
        var method = this;
        return function() {
            fcn.target = this;
            fcn.method = method;
            if(fcn.apply(scope || this || window, arguments) === false){
                return;
            }
            return method.apply(this || window, arguments);
        };
    }
});