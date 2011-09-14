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


Ext = {};

//为老版本浏览器提供
window["undefined"] = window["undefined"];

/**
 * @class Ext
 * Ext核心工具与函数
 * @单例的（singleton）
 */

/**
 * 复制所有参数 config 中的属性至参数 obj（第一个参数为obj，第二个参数为config）
 * @param {Object} obj 接受方对象
 * @param {Object} config 源对象
 * @param {Object} defaults 默认对象，如果该参数存在，obj将会获取那些defaults有而config没有的属性
 * @return {Object} returns obj
 * @member Ext apply
 */
Ext.apply = function(o, c, defaults){
    if(defaults){
        // no "this" reference for friendly out of scope calls
        Ext.apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};

(function(){
    var idSeed = 0;
    var ua = navigator.userAgent.toLowerCase();

    var isStrict = document.compatMode == "CSS1Compat",
        isOpera = ua.indexOf("opera") > -1,
        isSafari = (/webkit|khtml/).test(ua),
        isIE = ua.indexOf("msie") > -1,
        isIE7 = ua.indexOf("msie 7") > -1,
        isGecko = !isSafari && ua.indexOf("gecko") > -1,
        isBorderBox = isIE && !isStrict,
        isWindows = (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1),
        isMac = (ua.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1),
        isLinux = (ua.indexOf("linux") != -1),
        isSecure = window.location.href.toLowerCase().indexOf("https") === 0;

    // remove css image flicker
	if(isIE && !isIE7){
        try{
            document.execCommand("BackgroundImageCache", false, true);
        }catch(e){}
    }

    Ext.apply(Ext, {
        /**
         * 判断浏览器是否是 精确（Strict） 模式
         * @type Boolean
         */
        isStrict : isStrict,
        /**
         * 判断页面是否运行在SSL状态
         * @type Boolean
         */
        isSecure : isSecure,
        /**
         * 页面是否被完全读取，并可供使用
         * @type Boolean
         */
        isReady : false,

        /**
         * 是否定时清Ext.Elements缓存 (默认为是)
         * @type Boolean
         */
        enableGarbageCollector : true,

        /**
         * 是否在清缓存后自动清除事件监听器 (默认为否).
         * 注意：前置条件是enableGarbageCollector:true
         * @type Boolean
         */
        enableListenerCollection:false,

        /**
         * iframe与onReady所指向的连接为空白连接
         * IE不可靠的内容警告 (默认为 javascript:false).
         * @type String
         */
        SSL_SECURE_URL : "javascript:false",

        /**
         * 一个1*1的透明gif图片连接，用于内置图标和css背景
         * 默认地址为 "http://extjs.com/s.gif" ，应用时应该设为自己的服务器连接).
         * @type String
         */
        BLANK_IMAGE_URL : "http:/"+"/extjs.com/s.gif",

        emptyFn : function(){},

        /**
         * 复制所有config的属性至obj，如果obj已有该属性，则不复制（第一个参数为obj，第二个参数为config）
         * @param {Object} obj 接受方对象
         * @param {Object} config 源对象
         * @return {Object} returns obj
         */
        applyIf : function(o, c){
            if(o && c){
                for(var p in c){
                    if(typeof o[p] == "undefined"){ o[p] = c[p]; }
                }
            }
            return o;
        },

        /**
         * 页面被初始化完毕后，在元素上绑定事件监听
         * 事件名在'@'符号后
			<pre><code>
			Ext.addBehaviors({
			   // 为id为foo的锚点元素增加onclick事件监听
			   '#foo a@click' : function(e, t){
			       // do something
			   },

			   // 为多个元素增加mouseover事件监听 (在'@'前用逗号(,)分隔)
			   '#foo a, #bar span.some-class@mouseover' : function(){
			       // do something
			   }
			});
			</code></pre>
         * @param {Object} obj 所绑定的事件及其行为
         */
        addBehaviors : function(o){
            if(!Ext.isReady){
                Ext.onReady(function(){
                    Ext.addBehaviors(o);
                });
                return;
            }
            var cache = {}; // simple cache for applying multiple behaviors to same selector does query multiple times
            for(var b in o){
                var parts = b.split('@');
                if(parts[1]){ // for Object prototype breakers
                    var s = parts[0];
                    if(!cache[s]){
                        cache[s] = Ext.select(s);
                    }
                    cache[s].on(parts[1], o[b]);
                }
            }
            cache = null;
        },
        /**
         * 对页面元素生成唯一id，如果该元素已存在id，则不会再生成
         * @param {String/HTMLElement/Element} el (该参数可选) 将要生成id的元素
         * @param {String} prefix (该参数可选) 该id的前缀(默认为 "ext-gen")
         * @return {String} 导出的Id.
         */
        id : function(el, prefix){
            prefix = prefix || "ext-gen";
            el = Ext.getDom(el);
            var id = prefix + (++idSeed);
            return el ? (el.id ? el.id : (el.id = id)) : id;
        },

        /**
         * 继承，并由传递的值决定是否覆盖原对象的属性
         * 返回的对象中也增加了override()函数，用于覆盖实例的成员
         * @param {Object} subclass 子类，用于继承（该类继承了父类所有属性，并最终返回该对象）
         * @param {Object} superclass 父类，被继承
         * @param {Object} overrides (该参数可选) 一个对象，将它本身携带的属性对子类进行覆盖
         * @method extend
         */
        extend : function(){
            // inline overrides
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            return function(sb, sp, overrides){
                if(typeof sp == 'object'){
                    overrides = sp;
                    sp = sb;
                    sb = function(){sp.apply(this, arguments);};
                }
                var F = function(){}, sbp, spp = sp.prototype;
                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == Object.prototype.constructor){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Ext.override(sb, o);
                };
                sbp.override = io;
                Ext.override(sb, overrides);
                return sb;
            };
        }(),

        /**
         * Adds a list of functions to the prototype of an existing class, overwriting any existing methods with the same name.
         * Usage:<pre><code>
Ext.override(MyClass, {
    newMethod1: function(){
        // etc.
    },
    newMethod2: function(foo){
        // etc.
    }
});
 </code></pre>
         * @param {Object} origclass The class to override
         * @param {Object} overrides The list of functions to add to origClass.  This should be specified as an object literal
         * containing one or more methods.
         * @method override
         */
        override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                for(var method in overrides){
                    p[method] = overrides[method];
                }
            }
        },
        /**
         * 创建命名空间
         * @param {String} namespace1
         * @param {String} namespace2
         * @param {String} etc
         * @method namespace
         */
        namespace : function(){
            var a=arguments, o=null, i, j, d, rt;
            for (i=0; i<a.length; ++i) {
                d=a[i].split(".");
                rt = d[0];
                eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {};} o = ' + rt + ';');
                for (j=1; j<d.length; ++j) {
                    o[d[j]]=o[d[j]] || {};
                    o=o[d[j]];
                }
            }
        },

        /**
         * 将对象转化为一个编码后的URL连接
         * 例如：Ext.urlEncode({foo: 1, bar: 2}); 将返回 "foo=1&bar=2".
         * 参数值可以是一个数组，数组下标将作为“健”，“值”则是数组所含内容
         * （以下为译注）例：var myConn = Ext.urlEncode(['a','b','c']);将返回 "0=a&1=b&2=c"
         * @param {Object} o
         * @return {String}
         */
        urlEncode : function(o){
            if(!o){
                return "";
            }
            var buf = [];
            for(var key in o){
                var ov = o[key];
                var type = typeof ov;
                if(type == 'undefined'){
                    buf.push(encodeURIComponent(key), "=&");
                }else if(type != "function" && type != "object"){
                    buf.push(encodeURIComponent(key), "=", encodeURIComponent(ov), "&");
                }else if(ov instanceof Array){
                    for(var i = 0, len = ov.length; i < len; i++) {
                        buf.push(encodeURIComponent(key), "=", encodeURIComponent(ov[i] === undefined ? '' : ov[i]), "&");
                    }
                }
            }
            buf.pop();
            return buf.join("");
        },

       /**
         * 将一个URL连接解码为一个对象
         * 例如：Ext.urlDecode("foo=1&bar=2"); 将返回 {foo: 1, bar: 2}
         * 或：  Ext.urlDecode("foo=1&bar=2&bar=3&bar=4", true); 将返回 {foo: 1, bar: [2, 3, 4]}.
         * @param {String} string
         * @param {Boolean} overwrite (该参数可选) 如果该参数为true，在传递的字符串中如果有相同的键，值将会自动组装成一个数组（默认为false）。
         * @return {Object} A literal with members
         */
        urlDecode : function(string, overwrite){
            if(!string || !string.length){
                return {};
            }
            var obj = {};
            var pairs = string.split('&');
            var pair, name, value;
            for(var i = 0, len = pairs.length; i < len; i++){
                pair = pairs[i].split('=');
                name = decodeURIComponent(pair[0]);
                value = decodeURIComponent(pair[1]);
                if(overwrite !== true){
                    if(typeof obj[name] == "undefined"){
                        obj[name] = value;
                    }else if(typeof obj[name] == "string"){
                        obj[name] = [obj[name]];
                        obj[name].push(value);
                    }else{
                        obj[name].push(value);
                    }
                }else{
                    obj[name] = value;
                }
            }
            return obj;
        },

        /**
         * 迭代一个数组，数组中每个成员都将调用一次所传函数, 直到函数返回false才停止执行。
         * 如果传递的数组并非一个真正的数组，所传递的函数只调用它一次。（译注：如果不是数组，就将该“数组”放入一个[]中，而且会返回一个隐藏的int参数，代表为该array调用function的次数）
         * 该函数可被以下调用： (Object item, Number index, Array allItems).
         * @param {Array/NodeList/Mixed} 数组
         * @param {Function} 函数
         * @param {Object} 作用域
         */
        each : function(array, fn, scope){
            if(typeof array.length == "undefined" || typeof array == "string"){
                array = [array];
            }
            for(var i = 0, len = array.length; i < len; i++){
                if(fn.call(scope || array[i], array[i], i, array) === false){ return i; };
            }
        },

        // 不推荐使用
        combine : function(){
            var as = arguments, l = as.length, r = [];
            for(var i = 0; i < l; i++){
                var a = as[i];
                if(a instanceof Array){
                    r = r.concat(a);
                }else if(a.length !== undefined && !a.substr){
                    r = r.concat(Array.prototype.slice.call(a, 0));
                }else{
                    r.push(a);
                }
            }
            return r;
        },

       /**
         * 避免传递的字符串参数被正则表达式读取
         * @param {String} str
         * @return {String}
         */
        escapeRe : function(s) {
            return s.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
        },

        // 内部函数
        callback : function(cb, scope, args, delay){
            if(typeof cb == "function"){
                if(delay){
                    cb.defer(delay, scope, args || []);
                }else{
                    cb.apply(scope, args || []);
                }
            }
        },

        /**
         * 返回dom对象，参数可以是 string (id)，dom node，或Ext.Element
         * @param {String/HTMLElement/Element) el
         * @return HTMLElement
         */
        getDom : function(el){
            if(!el){
                return null;
            }
            return el.dom ? el.dom : (typeof el == 'string' ? document.getElementById(el) : el);
        },

        /**
        * {@link Ext.ComponentMgr#get}的简写方式
        * @param {String} id
        * @return Ext.Component
        */
        getCmp : function(id){
            return Ext.ComponentMgr.get(id);
        },

        num : function(v, defaultValue){
            if(typeof v != 'number'){
                return defaultValue;
            }
            return v;
        },

        destroy : function(){
            for(var i = 0, a = arguments, len = a.length; i < len; i++) {
                var as = a[i];
                if(as){
                    if(as.dom){
                        as.removeAllListeners();
                        as.remove();
                        continue;
                    }
                    if(typeof as.purgeListeners == 'function'){
                        as.purgeListeners();
                    }
                    if(typeof as.destroy == 'function'){
                        as.destroy();
                    }
                }
            }
        },

        // inpired by a similar function in mootools library
        /**
         * 返回参数类型的详细信息
         * 返回false，或是以下类型：<ul>
         * <li><b>string</b>: 如果传入的是字符串</li>
         * <li><b>number</b>: 如果输入的是数字</li>
         * <li><b>boolean</b>: 如果传入的是布尔值</li>
         * <li><b>function</b>: 如果传入的是函数</li>
         * <li><b>object</b>: 如果传入的是对象</li>
         * <li><b>array</b>: 如果传入的是数组</li>
         * <li><b>regexp</b>: 如果传入的是正则表达式</li>
         * <li><b>element</b>: 如果传入的是DOM Element</li>
         * <li><b>nodelist</b>: 如果传入的是DOM Node</li>
         * <li><b>textnode</b>: 如果传入的是DOM Text，且非空或空格</li>
         * <li><b>whitespace</b>: 如果传入的是DOM Text，且是空格</li>
         * @param {Mixed} object
         * @return {String}
         */
        type : function(o){
            if(o === undefined || o === null){
                return false;
            }
            if(o.htmlElement){
                return 'element';
            }
            var t = typeof o;
            if(t == 'object' && o.nodeName) {
                switch(o.nodeType) {
                    case 1: return 'element';
                    case 3: return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
                }
            }
            if(t == 'object' || t == 'function') {
                switch(o.constructor) {
                    case Array: return 'array';
                    case RegExp: return 'regexp';
                }
                if(typeof o.length == 'number' && typeof o.item == 'function') {
                    return 'nodelist';
                }
            }
            return t;
        },

        /**
         * 如果传入的值是null、undefined或空字符串，则返回true。（可选）
         * @param {Mixed} value 要验证的值
         * @param {Boolean} allowBlank (可选) 如果该值为true，则空字符串不会当作空而返回true
         * @return {Boolean}
         */
        isEmpty : function(v, allowBlank){
            return v === null || v === undefined || (!allowBlank ? v === '' : false);
        },

        /** @type Boolean */
        isOpera : isOpera,
        /** @type Boolean */
        isSafari : isSafari,
        /** @type Boolean */
        isIE : isIE,
        /** @type Boolean */
        isIE7 : isIE7,
        /** @type Boolean */
        isGecko : isGecko,
        /** @type Boolean */
        isBorderBox : isBorderBox,
        /** @type Boolean */
        isWindows : isWindows,
        /** @type Boolean */
        isLinux : isLinux,
        /** @type Boolean */
        isMac : isMac,

    /**
	 Ext 自动决定浮动元素是否应该被填充。
     @type Boolean
     */
        useShims : ((isIE && !isIE7) || (isGecko && isMac))
    });


})();

Ext.namespace("Ext", "Ext.util", "Ext.grid", "Ext.dd", "Ext.tree", "Ext.data",
                "Ext.form", "Ext.menu", "Ext.state", "Ext.lib", "Ext.layout", "Ext.app", "Ext.ux");


/**
 * @class Function
 * 这个函数可用于任何Function对象 (任何javascript函数)。
 */
Ext.apply(Function.prototype, {
     /**
     * 创建一个回调函数，该回调传递参数的形式为： arguments[0], arguments[1], arguments[2], ...
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
     * (译注：这是一个极其有用的函数，既创建一个即带参数又没有执行的函数，封装事件时很有价值)
     * @param {Object} obj (该参数可选) 自定义的作用域对象
     * @param {Array} args (该参数可选) 覆盖原函数的参数。（默认为该函数的arguments）
     * @param {Boolean/Number} appendArgs (该参数可选) 如果该参数为true，将args加载到该函数的后面，
     *                                             如果该参数为数字类型，则args将插入到所指定的位置
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
     * @addon
     * @param {Function} fcn 在原函数被调用前调用的函数
     * @param {Object} scope (该参数可选) fcn的作用域 （默认指向原函数或window）
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

/**
 * @class String
 * 将javascript的String对象进行修改，增加以下方法
 */
Ext.applyIf(String, {

    /*
     * 避免传入 ' 与 \
     * @param {String} str
     * @return {String}
     */
    escape : function(string) {
        return string.replace(/('|\\)/g, "\\$1");
    },

    /**
     * 在字符串左边填充指定字符。这对于统一字符或日期标准格式非常有用。
     * 例如：
     * <pre><code>
var s = String.leftPad('123', 5, '0');
// s now contains the string: '00123'
</code></pre>
     * @param {String} 源字符串
     * @param {Number} 源+填充字符串的总长度
     * @param {String} 填充字符串（默认是" "）
     * @return {String} 填充后的字符串
     * @static
     */
    leftPad : function (val, size, ch) {
        var result = new String(val);
        if(ch === null || ch === undefined || ch === '') {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result;
    },

    /**
     * 定义带标记的字符串，并用自定义字符替换标记。
     * 每个标记必须是唯一的，而且必须要像{0},{1}...{n}这样自增长。
     * 例如：
     * <pre><code>
var cls = 'my-class', text = 'Some text';
var s = String.format('<div class="{0}">{1}</div>', cls, text);
// s now contains the string: '<div class="my-class">Some text</div>'
</code></pre>
     * @param {String} 带标记的字符串
     * @param {String} 第一个值，替换{0}
     * @param {String} 第二个值，替换{1}...等等（可以有任意多个）
     * @return {String} 转化过的字符串
     * @static
     */
    format : function(format){
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    }
});

/**
 * 比较并交换字符串的值。
 * 参数中的第一个值与当前字符串对象比较，如果相等则返回传入的第一个参数，否则返回第二个参数。
 * 注意：这个方法返回新值，但并不改变现有字符串。
 * <pre><code>
// alternate sort directions
sort = sort.toggle('ASC', 'DESC');

// instead of conditional logic:
sort = (sort == 'ASC' ? 'DESC' : 'ASC');
</code></pre>
 * @param {String} 第一个参数，与函数相等则返回
 * @param {String} 传入的第二个参数，不等返回
 * @return {String} 新值
 */
String.prototype.toggle = function(value, other){
    return this == value ? other : value;
};

Ext.applyIf(Number.prototype, {
    /**
     * 检验数字大小。
     * 传入两个数字，一小一大，如果当前数字小于传入的小数字，则返回小的；如果该数字大于大的，则返回大的；如果在中间，则返回该数字本身
     * 注意：这个方法返回新数字，但并不改变现有数字
     * @param {Number} 小数
     * @param {Number} 大数
     * @return {Number} 大小数字，或其本身
     */
    constrain : function(min, max){
        return Math.min(Math.max(this, min), max);
    }
});

Ext.applyIf(Array.prototype, {
    /**
     * 检查对象是否存在于该数组
     * @param {Object} 要检查的对象
     * @return {Number} 返回该对象在数组中的位置。（不存在则返回-1）
     */
    indexOf : function(o){
       for (var i = 0, len = this.length; i < len; i++){
 	      if(this[i] == o) return i;
       }
 	   return -1;
    },

    /**
     * 删除数组中指定对象。如果该对象不在数组中，则不进行操作。
     * @param {Object} o 要移除的对象
     */
    remove : function(o){
       var index = this.indexOf(o);
       if(index != -1){
           this.splice(index, 1);
       }
    }
});

/**
 * 返回date对象创建时间与现在时间的时间差，单位为毫秒
 * （译注：）例：var date = new Date();
 *						var x=0;
 *						while(x<2){
 *							alert('x');
 *							x++;
 *						}
 *
 *		var theTime = date.getElapsed();
 *		alert(theTime);       //将显示间隔的时间，单位是毫秒
 *
 * @param {Date} date (该参数可选) 默认时间是now
 * @return {Number} 间隔毫秒数
 * @member Date getElapsed
 */
Date.prototype.getElapsed = function(date) {
	return Math.abs((date || new Date()).getTime()-this.getTime());
};
