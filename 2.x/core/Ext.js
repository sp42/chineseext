
Ext = {version: '2.0'};

//为老版本浏览器提供
window["undefined"] = window["undefined"];

/**
 * @class Ext
 * Ext核心工具与函数
 * @singleton
 */

/**
 * 复制所有参数config中的属性至参数obj（第一个参数为obj，第二个参数为config）
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
        isIE = !isOpera && ua.indexOf("msie") > -1,
        isIE7 = !isOpera && ua.indexOf("msie 7") > -1,
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
         * 是否在清缓存后自动清除事件监听器 (默认为否)
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
         * 默认地址为 "http://extjs.com/s.gif"，应用时应该设为自己的服务器连接).
         * @type String
         */
        BLANK_IMAGE_URL : "http:/"+"/extjs.com/s.gif",

        /**
        * 可复用的空函数
        * @property
         * @type Function
        */
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
         * @param {Object} overrides （该参数可选） 一个对象，将它本身携带的属性对子类进行覆盖
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
         * 利用overrides重写origclass的方法,例
         
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
         * Creates namespaces to be used for scoping variables and classes so that they are not global.  Usage:
         * <pre><code>
Ext.namespace('Company', 'Company.data');
Company.Widget = function() { ... }
Company.data.CustomStore = function(config) { ... }
</code></pre>
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
                var ov = o[key], k = encodeURIComponent(key);
                var type = typeof ov;
                if(type == 'undefined'){
                    buf.push(k, "=&");
                }else if(type != "function" && type != "object"){
                    buf.push(k, "=", encodeURIComponent(ov), "&");
                }else if(ov instanceof Array){
                    if (ov.length) {
	                    for(var i = 0, len = ov.length; i < len; i++) {
	                        buf.push(k, "=", encodeURIComponent(ov[i] === undefined ? '' : ov[i]), "&");
	                    }
	                } else {
	                    buf.push(k, "=&");
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
         * 如果传递的数组并非一个真正的数组，所传递的函数只调用它一次。
         * 译注：如果不是数组，就将该“数组”放入一个[]中，而且会返回一个隐藏的int参数，代表为该array调用function的次数。
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

        // deprecated
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

        // internal
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
            if(!el || !document){
                return null;
            }
            return el.dom ? el.dom : (typeof el == 'string' ? document.getElementById(el) : el);
        },

       /**
        * 返回当前HTML文档的{@link Ext.Element}类型
        * @return Ext.Element 文档
        */
        getDoc : function(){
            return Ext.get(document);
        },

       /**
        * 返回当前document.body的{@link Ext.Element}类型
        * @return Ext.Element document.body
        */
        getBody : function(){
            return Ext.get(document.body || document.documentElement);
        },

        /**
        * {@link Ext.ComponentMgr#get}的简写方式
        * @param {String} id
        * @return Ext.Component
        */
        getCmp : function(id){
            return Ext.ComponentMgr.get(id);
        },

        /**
         * 验证某个值是否数字的一个辅助方法，若不是，返回指定的缺省值。
         * @param {Mixed} value 应该是一个数字，但其它的类型的值亦可适当地处理
         * @param {Number} defaultValue 若传入的值是非数字所返回的缺省值
         * @return {Number} 数字或缺省值
         */
        num : function(v, defaultValue){
            if(typeof v != 'number'){
                return defaultValue;
            }
            return v;
        },

        /**
         * 尝试去移除每个传入的对象,包括DOM,事件侦听者,并呼叫他们的destroy方法(如果存在)
         * Attempts to destroy any objects passed to it by removing all event listeners, removing them from the
         * DOM (if applicable) and calling their destroy functions (if available).  This method is primarily
         * intended for arguments of type {@link Ext.Element} and {@link Ext.Component}, but any subclass of
         * {@link Ext.util.Observable} can be passed in.  Any number of elements and/or components can be
         * passed into this function in a single call as separate arguments.
         * @param {Mixed} arg1 An {@link Ext.Element} or {@link Ext.Component} to destroy
         * @param {Mixed} (optional) arg2
         * @param {Mixed} (optional) etc...
         */
        destroy : function(){
            for(var i = 0, a = arguments, len = a.length; i < len; i++) {
                var as = a[i];
                if(as){
                    if(as.dom){
                        as.removeAllListeners();
                        as.remove();
                        continue;
                    }
                    if(typeof as.destroy == 'function'){
                        as.destroy();
                    }
                }
            }
        },

        removeNode : isIE ? function(){
            var d;
            return function(n){
                if(n){
                    d = d || document.createElement('div');
                    d.appendChild(n);
                    d.innerHTML = '';
                }
            }
        }() : function(n){
            if(n && n.parentNode){
                n.parentNode.removeChild(n);
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

        value : function(v, defaultValue, allowBlank){
            return Ext.isEmpty(v, allowBlank) ? defaultValue : v;
        },

        /** @type Boolean */
        isOpera : isOpera,
        /** @type Boolean */
        isSafari : isSafari,
        /** @type Boolean */
        isIE : isIE,
        /** @type Boolean */
        isIE6 : isIE && !isIE7,
        /** @type Boolean */
        isIE7 : isIE7,
        /** @type Boolean */
        isGecko : isGecko,
        /** @type Boolean */
        isBorderBox : isBorderBox,
        /** @type Boolean */
        isLinux : isLinux,
        /** @type Boolean */
        isWindows : isWindows,
        /** @type Boolean */
        isMac : isMac,
        /** @type Boolean */
        isAir : !!window.htmlControl,

    /**
     * Ext自动决定浮动元素是否应该被填充。
     * @type Boolean
     */
        useShims : ((isIE && !isIE7) || (isGecko && isMac))
    });

    // in intellij using keyword "namespace" causes parsing errors
    Ext.ns = Ext.namespace;
})();

Ext.ns("Ext", "Ext.util", "Ext.grid", "Ext.dd", "Ext.tree", "Ext.data",
                "Ext.form", "Ext.menu", "Ext.state", "Ext.lib", "Ext.layout", "Ext.app", "Ext.ux");