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
Ext = {version: '3.0'};

// 为老版本浏览器提供，老版本没有undefined……——但这样会占据多个全局变量？
window["undefined"] = window["undefined"];

/**
 * @class Ext
 * Ext核心工具与函数
 * @singleton
 */

/**
 * 复制config对象的所有属性到obj（第一个参数为obj，第二个参数为config）。
 * Copies all the properties of config to obj.
 * @param {Object} obj 属性接受方对象。The receiver of the properties
 * @param {Object} config 属性源对象。The source of the properties
 * @param {Object} defaults 默认对象，如果该参数存在，obj将会得到那些defaults有而config没有的属性。
 * A different object that will also be applied for default values
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
	var scrollWidth;
    var isStrict = document.compatMode == "CSS1Compat",
        isOpera = ua.indexOf("opera") > -1,
        isChrome = ua.indexOf("chrome") > -1,
        isSafari = !isChrome && (/webkit|khtml/).test(ua),
        isSafari3 = isSafari && ua.indexOf('webkit/5') != -1,
        isIE = !isOpera && ua.indexOf("msie") > -1,
        isIE7 = !isOpera && ua.indexOf("msie 7") > -1,
        isIE8 = !isOpera && ua.indexOf("msie 8") > -1,
        isGecko = !isSafari && !isChrome && ua.indexOf("gecko") > -1,
        isGecko3 = isGecko && ua.indexOf("rv:1.9") > -1,
        isBorderBox = isIE && !isStrict,
        isWindows = (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1),
        isMac = (ua.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1),
        isAir = (ua.indexOf("adobeair") != -1),
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
         * 判断浏览器是否是精确（Strict）模式，以相对于怪癖模式（quirks mode）。
         * True if the browser is in strict (standards-compliant) mode, as opposed to quirks mode
         * @type Boolean
         */
        isStrict : isStrict,
        /**
         * 判断页面是否运行在SSL状态。
         * True if the page is running over SSL
         * @type Boolean
         */
        isSecure : isSecure,
        /**
         * 页面是否完全被初始化，并可供使用。
         * True when the document is fully initialized and ready for action
         * @type Boolean
         */
        isReady : false,

        /**
         * 是否自动定时清除孤立的Ext.Elements缓存（默认为是）。
         * True to automatically uncache orphaned Ext.Elements periodically (defaults to true)
         * @type Boolean
         */
        enableGarbageCollector : true,

        /**
         * 是否在清除缓存后自动清除事件监听器（默认为否）。
         * 注意:仅当enableGarbageCollector为true时该项的设置才有效。
         * True to automatically purge event listeners after uncaching an element (defaults to false).
         * Note: this only happens if enableGarbageCollector is true.
         * @type Boolean
         */
        enableListenerCollection:false,


        /**
         * 在非安全模式下，Ext要一个空白文件的链接，链接是为了iframe与onReady所指向的连接（src），以便能够组织IE不安全内容的警告（默认为javascript:fasle）
         * URL to a blank file used by Ext when in secure mode for iframe src and onReady src to prevent
         * the IE insecure content warning (defaults to javascript:false).
         * @type String
         */
        SSL_SECURE_URL : "javascript:false",

        /**
         * 一个1*1的透明gif图片连接，用于内置图标和css背景。
         * 默认地址为"http://extjs.com/s.gif"，应用时应该设为自己的服务器连接。
         * URL to a 1x1 transparent gif image used by Ext to create inline icons with CSS background images. (Defaults to
         * "http://extjs.com/s.gif" and you should change this to a URL on your server).
         * @type String
         */
        BLANK_IMAGE_URL : "http:/"+"/extjs.com/s.gif",

        /**
         * 可复用的空函数。
         * A reusable empty function
         * @property emptyFn
         * @type Function
         */
        emptyFn : function(){},

        /**
         * 复制所有config的属性至obj，如果obj已有该属性，则不复制（第一个参数为obj，第二个参数为config）。
         * Copies all the properties of config to obj if they don't already exist.
         * @param {Object} obj 接受方对象。The receiver of the properties
         * @param {Object} config 源对象。The source of the properties
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
         * 页面被初始化完毕后，在元素上绑定事件监听。事件名在'@'符号后。
         * Applies event listeners to elements by selectors when the document is ready.
         * The event name is specified with an @ suffix.
<pre><code>
Ext.addBehaviors({
   // 为id为foo的锚点元素增加onclick事件监听。
   // add a listener for click on all anchors in element with id foo
   '#foo a@click' : function(e, t){
       // do something
   },

   // 为多个元素增加mouseover事件监听（在'@'前用逗号(,)分隔）。
   // add the same listener to multiple selectors (separated by comma BEFORE the @)
   '#foo a, #bar span.some-class@mouseover' : function(){
       // do something
   }
});
</code></pre>
         * @param {Object} obj 所绑定的事件及其行为。The list of behaviors to apply
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
         * 对页面元素生成唯一id，如果该元素已存在id，则不会再生成。
         * Generates unique ids. If the element already has an id, it is unchanged
         * @param {Mixed} el （可选的） 将要生成id的元素。(optional)The element to generate an id for
         * @param {String} prefix （可选的） 该id的前缀（默认为 "ext-gen"）。(optional) Id prefix (defaults "ext-gen")
         * @return {String} 生成的Id。The generated Id.
         */
        id : function(el, prefix){
            prefix = prefix || "ext-gen";
            el = Ext.getDom(el);
            var id = prefix + (++idSeed);
            return el ? (el.id ? el.id : (el.id = id)) : id;
        },

        /**
         * OO继承，并由传递的值决定是否覆盖原对象的属性。
         * 返回的类对象中也增加了“override()”函数，用于覆盖实例的成员。
         * Extends one class with another class and optionally overrides members with the passed literal. This class
         * also adds the function "override()" to the class that can be used to override
         * members on an instance.
         * <p>
         * 另外一种用法是，第一个参数不是父类（严格说是父类构造器）的话那么将会发生如下的变化（这是使用2个参数的方式）：
         * This function also supports a 2-argument call in which the subclass's constructor is
         * not passed as an argument. In this form, the parameters are as follows:</p><p>
         * <div class="mdetail-params"><ul>
         * <li><code>superclass</code>
         * <div class="sub-desc">被继承的类。The class being extended</div></li>
         * <li><code>overrides</code>
         * <div class="sub-desc">
         * 成员列表，就是将会复制到子类的prototype对象身上，——这便会让该新类的实例可共享这些成员。
         * A literal with members which are copied into the subclass's
         * prototype, and are therefore shared among all instances of the new class.<p>
         * 注意其中可以包含一个元素为属于子类的构造器，叫<tt><b>constructor</b></tt>的成员。
         * 如果该项<i>不</i>指定，就意味引用父类的构造器，父类构造器就会直接接收所有的参数。
         * This may contain a special member named <tt><b>constructor</b></tt>. This is used
         * to define the constructor of the new class, and is returned. If this property is
         * <i>not</i> specified, a constructor is generated and returned which just calls the
         * superclass's constructor passing on its parameters.</p></div></li>
         * </ul></div></p><p>
         * 例如，这样创建Ext GridPanel的子类。
         * For example, to create a subclass of the Ext GridPanel:
         * <pre><code>
    MyGridPanel = Ext.extend(Ext.grid.GridPanel, {
        constructor: function(config) {
            // 你先这样调用……（就是调用父类的构造函数）
            MyGridPanel.superclass.constructor.apply(this, arguments);
            // 然后接着是子类的代码……
        },

        yourMethod: function() {
            // ……
        }
    });
</code></pre>
         * </p>
         * @param {Function} subclass 子类，用于继承（该类继承了父类所有属性，并最终返回该对象）。The class inheriting the functionality
         * @param {Function} superclass 父类，被继承。The class being extended
         * @param {Object} overrides （可选的）一个对象，将它本身携带的属性对子类进行覆盖。(optional) A literal with members which are copied into the subclass's
         * prototype, and are therefore shared between all instances of the new class.
         * @return {Function} 子类的构造器。The subclass constructor.
         * @method extend
         */
        extend : function(){
            // inline overrides
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(typeof sp == 'object'){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){}, sbp, spp = sp.prototype;
                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Ext.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                Ext.override(sb, overrides);
                sb.extend = function(o){Ext.extend(sb, o);};
                return sb;
            };
        }(),

        extendX : function(supr, fn){
            return Ext.extend(supr, fn(supr.prototype));
        },

        /**
         * 在类上添加overrides指定的方法（多个方法），同名则覆盖，例如：
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
         * @param {Object} origclass 要override的类。The class to override
         * @param {Object} overrides 加入到origClass的函数列表。这应该是一个包含一个或多个方法的对象。The list of functions to add to origClass.  This should be specified as an object literal
         * containing one or more methods.
         * @method override
         */
        override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                for(var method in overrides){
                    p[method] = overrides[method];
                }
                if(Ext.isIE && overrides.toString != origclass.toString){
                    p.toString = overrides.toString;
                }
            }
        },

        /**
         * 为变量创建其命名空间，这样类就有了“安身之所”，不是飘荡四处的“全局变量”。例如：
         * Creates namespaces to be used for scoping variables and classes so that they are not global.  Usage:
         * <pre><code>
Ext.namespace('Company', 'Company.data');
Company.Widget = function() { ... }
Company.data.CustomStore = function(config) { ... }
</code></pre>
         * @param {String} namespace1 命名空间一
         * @param {String} namespace2 命名空间二
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
            return o;
        },

        /**
         * 把一个对象转换为一串以编码的URL字符。例如Ext.urlEncode({foo: 1, bar: 2});变为"foo=1&bar=2"。
         * 可选地，如果遇到属性的类型是数组的话，那么该属性对应的key就是每个数组元素的key，逐一进行“结对的”编码。
         * Takes an object and converts it to an encoded URL. e.g. Ext.urlEncode({foo: 1, bar: 2}); would return "foo=1&bar=2".  
         * Optionally, property values can be arrays, 
         * instead of keys and the resulting string that's returned will contain a name/value pair for each array value.
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
                }else if(Ext.isArray(ov)){
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
         * 把一个已经encoded的URL字符串转换为对象。如Ext.urlDecode("foo=1&bar=2"); 就是{foo: "1", bar: "2"}；
         * Ext.urlDecode("foo=1&bar=2&bar=3&bar=4", false);就是{foo: "1", bar: ["2", "3", "4"]}。
         * Takes an encoded URL and and converts it to an object. e.g. Ext.urlDecode("foo=1&bar=2"); would return {foo: "1", bar: "2"}
         * or Ext.urlDecode("foo=1&bar=2&bar=3&bar=4", false); would return {foo: "1", bar: ["2", "3", "4"]}.
         * @param {String} string URL字符串
         * @param {Boolean} overwrite （可选的）重复名称的就当作为数组，如果该项为true就禁止该功能（默认为false）。(optional) Items of the same name will overwrite previous values instead of creating an an array (Defaults to false).
         * @return {Object} 成员实体。A literal with members
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
         * 迭代一个数组，数组中每个成员都将调用一次所传函数，直到函数返回false才停止执行。
         * 如果传递的数组并非一个真正的数组，所传递的函数只调用它一次。
         * （译注：如果不是数组，就将该“数组”放入一个[]中，而且会返回一个隐藏的int参数，代表为该array调用function的次数。）
         * Iterates an array calling the passed function with each item, stopping if your function returns false. If the
         * passed array is not really an array, your function is called once with it.
         * The supplied function is called with (Object item, Number index, Array allItems).
         * @param {Array/NodeList/Mixed} array 数组
         * @param {Function} fn 函数
         * @param {Object} scope 作用域
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
                if(Ext.isArray(a)){
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
         * 避免传递的字符串参数被正则表达式读取。
         * Escapes the passed string for use in a regular expression
         * @param {String} str
         * @return {String}
         */
        escapeRe : function(s) {
            return s.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
        },
        
        /**
         * 计算浏览器滚动体实际的物理宽度。该值根据OS的不同有所变化，例如主题、字体大小的影响。Utility method for getting the width of the browser scrollbar. This can differ depending on
         * operating system settings, such as the theme or font size.
         * @param {Boolean} force （可选的）True表示为计算一次实际的值。(optional) true to force a recalculation of the value.
         * @return {Number} 滚动体的宽度。The width of the scrollbar.
         */
        getScrollBarWidth: function(force){
            if(!Ext.isReady){
                return 0;
            }
            
            if(force === true || scrollWidth === null){
                // 供测试用的div，临时的，用完删除掉。Append our div, do our calculation and then remove it
                var div = Ext.getBody().createChild('<div class="x-hide-offsets" style="width:100px;height:50px;overflow:hidden;"><div style="height:200px;"></div></div>'),
                    child = div.child('div', true);
                var w1 = child.offsetWidth;
                div.setStyle('overflow', (Ext.isWebKit || Ext.isGecko) ? 'auto' : 'scroll');
                var w2 = child.offsetWidth;
                div.remove();
                // 补上2才够位置。Need to add 2 to ensure we leave enough space
                scrollWidth = w1 - w2 + 2;
                
            }
            
            return scrollWidth;
        },
        
        /**
         * 是否使用浏览器的原生JSON解析方法，一些新型的浏览器会提供该方法。Indicates whether to use native browser parsing for JSON methods.
         * This option is ignored if the browser does not support native JSON methods.
         * <b>需要注意的是，原生JSON方法对于那些携带函数的对象没作用，而且属性名称（即key）必须是要引号套着的，否则将不能被解析（严格很多）（默认为false）。Note: Native JSON methods will not work with objects that have functions.
         * Also, property names must be quoted, otherwise the data will not parse.</b> (Defaults to false)
         * @type Boolean
         */
        USE_NATIVE_JSON : false,   
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
         * 返回dom对象，参数可以是string(id)，dom node，或Ext.Element。
         * Return the dom node for the passed string (id), dom node, or Ext.Element
         * @param {Mixed} el
         * @return HTMLElement
         */
        getDom : function(el){
            if(!el || !document){
                return null;
            }
            return el.dom ? el.dom : (typeof el == 'string' ? document.getElementById(el) : el);
        },

       /**
        * 返回当前HTML文档的{@link Ext.Element}类型。
        * Returns the current HTML document object as an {@link Ext.Element}.
        * @return Ext.Element document对象。The document
        */
        getDoc : function(){
            return Ext.get(document);
        },

       /**
        * 返回当前document.body的{@link Ext.Element}类型。
        * Returns the current document body as an {@link Ext.Element}.
        * @return Ext.Element document对象。The document body
        */
        getBody : function(){
            return Ext.get(document.body || document.documentElement);
        },

       /**
        * {@link Ext.ComponentMgr#get}的简写方式。
        * Shorthand for {@link Ext.ComponentMgr#get}
        * @param {String} id
        * @return Ext.Component
        */
        getCmp : function(id){
            return Ext.ComponentMgr.get(id);
        },

        /**
         * 验证某个值是否数字的一个辅助方法，若不是，返回指定的缺省值。
         * Utility method for validating that a value is numeric, returning the specified default value if it is not.
         * @param {Mixed} value 应该是一个数字，但其它的类型的值亦可适当地处理。Should be a number, but any type will be handled appropriately
         * @param {Number} defaultValue 若传入的值是非数字，则返回缺省值。The value to return if the original value is non-numeric
         * @return {Number} 数字或缺省值Value。if numeric, else defaultValue
         */
        num : function(v, defaultValue){
            if(typeof v != 'number' || isNaN(v)){
                return defaultValue;
            }
            return v;
        },

        /**
         * 尝试去移除每个传入的对象，包括DOM，事件侦听者，并呼叫他们的destroy方法（如果存在）。
         * 该方法主要接纳{@link Ext.Element}与{@link Ext.Component}类型的参数。
         * 但理论上任何继承自Ext.util.Observable的子类都可以做为参数传入（支持传入多参）。
         * Attempts to destroy any objects passed to it by removing all event listeners, removing them from the
         * DOM (if applicable) and calling their destroy functions (if available).  
         * This method is primarily intended for arguments of type {@link Ext.Element} and {@link Ext.Component}, but any subclass of
         * {@link Ext.util.Observable} can be passed in. 
         * Any number of elements and/or components can be passed into this function in a single call as separate arguments.
         * @param {Mixed} arg1 任意要销毁的{@link Ext.Element}或{@link Ext.Component}。An {@link Ext.Element} or {@link Ext.Component} to destroy
         * @param {Mixed} arg2 （可选的）
         * @param {Mixed} etc... （可选的）
         */
        destroy : function(){
            for(var i = 0, a = arguments, len = a.length; i < len; i++) {
                var as = a[i];
                if(as){
                    if(typeof as.destroy == 'function'){
                        as.destroy();
                    }
                    else if(as.dom){
                        as.removeAllListeners();
                        as.remove();
                    }
                }
            }
        },

        /**
         * 删除对象的指定属性（支持传入多参，同时删除多个属性）。
         * Attempts to destroy and then remove a set of named properties of the passed object.
         * @param {Object} o 打算删除的对象（通常是Component类型的对象）。The object (most likely a Component) who's properties you wish to destroy.
         * @param {Mixed} arg1 打算删除的属性名称。The name of the property to destroy and remove from the object.
         * @param {Mixed} etc... 其他更多要删除的属性名称。More property names to destroy and remove.
         */
        destroyMembers : function(o, arg1, arg2, etc){
            for(var i = 1, a = arguments, len = a.length; i < len; i++) {
                Ext.destroy(o[a[i]]);
                delete o[a[i]];
            }
        },

        /**
         * 移除document的DOM节点。如果是body节点的话会被忽略。
         * Removes a DOM node from the document.  The body node will be ignored if passed in.
         * @param {HTMLElement} node 要移除的节点。The node to remove
         */
        removeNode : isIE ? function(){
            var d;
            return function(n){
                if(n && n.tagName != 'BODY'){
                    d = d || document.createElement('div');
                    d.appendChild(n);
                    d.innerHTML = '';
                }
            }
        }() : function(n){
            if(n && n.parentNode && n.tagName != 'BODY'){
                n.parentNode.removeChild(n);
            }
        },

        // inpired by a similar function in mootools library
        /**
         * 返回参数类型的详细信息。如果送入的对象是null或undefined那么返回false，又或是以下类型：
         * Returns the type of object that is passed in. If the object passed in is null or undefined it
         * return false otherwise it returns one of the following values:<ul>
         * <li><b>string</b>: 如果传入的是字符串。If the object passed is a string</li>
         * <li><b>number</b>: 如果输入的是数字。If the object passed is a number</li>
         * <li><b>boolean</b>: 如果传入的是布尔值。If the object passed is a boolean value</li>
         * <li><b>date</b>: 如果传入的是日期。If the object passed is a Date object</li>
         * <li><b>function</b>: 如果传入的是函数。If the object passed is a function reference</li>
         * <li><b>object</b>: 如果传入的是对象。If the object passed is an object</li>
         * <li><b>array</b>: 如果传入的是数组。If the object passed is an array</li>
         * <li><b>regexp</b>: 如果传入的是正则表达式。If the object passed is a regular expression</li>
         * <li><b>element</b>: 如果传入的是DOM Element。If the object passed is a DOM Element</li>
         * <li><b>nodelist</b>: 如果传入的是DOM NodeList。If the object passed is a DOM NodeList</li>
         * <li><b>textnode</b>: 如果传入的是DOM Text，且非空或空格。If the object passed is a DOM text node and contains something other than whitespace</li>
         * <li><b>whitespace</b>: 如果传入的是DOM Text，且是空格。If the object passed is a DOM text node and contains only whitespace</li>
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
                    case Date: return 'date';
                }
                if(typeof o.length == 'number' && typeof o.item == 'function') {
                    return 'nodelist';
                }
            }
            return t;
        },

        /**
         * 如果传入的值是null、undefined或空字符串，则返回true。（可选的）
         * Returns true if the passed value is null, undefined or an empty string.
         * @param {Mixed} value 要验证的值。The value to test
         * @param {Boolean} allowBlank （可选的） 如果该值为true，则空字符串不会当作空而返回true。(optional) true to allow empty strings (defaults to false)
         * @return {Boolean}
         */
        isEmpty : function(v, allowBlank){
            return v === null || v === undefined || (!allowBlank ? v === '' : false);
        },

        /**
         * 验证值是否非空、非null、非undefined、非空白字符的便捷方法。如指定了默认值还会返回默认值。
         * Utility method for validating that a value is non-empty (i.e. i) not null, ii) not undefined, and iii) not an empty string), 
         * returning the specified default value if it is.
         * @param {Mixed} value 要测试的值。The value to test
         * @param {Mixed} defaultValue 如果原值是空的所返回的值。The value to return if the original value is empty
         * @param {Boolean} allowBlank （可选的）true表示为允许空白的字符串（默认为false）。(optional) true to allow empty strings (defaults to false)
         * @return {Mixed} 值，若果是非空，就是defalutValue。value, if non-empty, else defaultValue
         */
        value : function(v, defaultValue, allowBlank){
            return Ext.isEmpty(v, allowBlank) ? defaultValue : v;
        },

        /**
         * 返回true表名送入的对象是JavaScript的array类型对象，否则为false。
         * Returns true if the passed object is a JavaScript array, otherwise false.
         * @param {Object} v 要测试的对象。The object to test
         * @return {Boolean}
         */
        isArray : function(v){
            return v && typeof v.length == 'number' && typeof v.splice == 'function';
        },

        /**
         * 返回true表名送入的对象是JavaScript的date类型对象，否则为false。
         * Returns true if the passed object is a JavaScript date object, otherwise false.
         * @param {Object} v 要测试的对象。The object to test
         * @return {Boolean}
         */
        isDate : function(v){
            return v && typeof v.getFullYear == 'function';
        },

        /**
         * 复制源对象身上指定的属性到目标对象。
         * Copies a set of named properties fom the source object to the destination object.
         * @param {Object} dest 目标对象。The destination object.
         * @param {Object} source 源对象。The source object.
         * @param {Array/String} names 可以是属性名称构成的数组，也可以是属性名称构成的字符串，用逗号、分号隔开。Either an Array of property names, or a comma-delimited list
         * of property names to copy.
         * @return {Object} 以修改的对象。The modified object.
         * <p>例子：example:<pre><code>
ImageComponent = Ext.extend(Ext.BoxComponent, {
    initComponent: function() {
        this.autoEl = { tag: 'img' };
        MyComponent.superclass.initComponent.apply(this, arguments);
        this.initialBox = Ext.copyTo({}, this.initialConfig, 'x,y,width,height');
    }
});
</code></pre>
         */
        copyTo: function(dest, source, names){
            if(typeof names == 'string'){
                names = names.split(/[,;\s]/);
            }
            for(var i = 0, len = names.length; i< len; i++){
                var n = names[i];
                if(source.hasOwnProperty(n)){
                    dest[n] = source[n];
                }
            }
            return dest;
        },

        intercept : function(o, name, fn, scope){
            o[name] = o[name].createInterceptor(fn, scope);
        },

        sequence : function(o, name, fn, scope){
            o[name] = o[name].createSequence(fn, scope);
        },

        /**
         * True表示为浏览器是True表示为浏览器是Opera。
         * True if the detected browser is Opera.
         * @type Boolean
         */
        isOpera : isOpera,
        /**
         * True表示为浏览器是Chrome。
         * True if the detected browser is Chrome.
         * @type Boolean
         */
        isChrome : isChrome,
        /**
         * True表示为浏览器是Safari。
         * True if the detected browser is Chrome.
         * @type Boolean
         */
        isSafari : isSafari,
        /**
         * True表示为浏览器是Safari 3.x。
         * True if the detected browser is Safari 3.x.
         * @type Boolean
         */
        isSafari3 : isSafari3,
        /**
         * True表示为浏览器是Safari 2.x。
         * True if the detected browser is Safari 2.x.
         * @type Boolean
         */
        isSafari2 : isSafari && !isSafari3,
        /**
         * True表示为浏览器是Internet Explorer。
         * True if the detected browser is Internet Explorer.
         * @type Boolean
         */
        isIE : isIE,
        /**
         * True表示为浏览器是Internet Explorer6。
         * True if the detected browser is Internet Explorer 6.x.
         * @type Boolean
         */
        isIE6 : isIE && !isIE7 && !isIE8,
        /**
         * True表示为浏览器是Internet Explorer7。
         * True if the detected browser is Internet Explorer 7.x.
         * @type Boolean
         */
        isIE7 : isIE7,
        /**
         * True表示为浏览器是Internet Explorer8。
         * True if the detected browser is Internet Explorer 8.x.
         * @type Boolean
         */
        isIE8 : isIE8,
        /**
         * True表示为浏览器是Gecko。
         * True if the detected browser uses the Gecko layout engine (e.g. Mozilla, Firefox).
         * @type Boolean
         */
        isGecko : isGecko,
        /**
         * True表示为浏览器是pre-Gecko 1.9。
         * True if the detected browser uses a pre-Gecko 1.9 layout engine (e.g. Firefox 2.x).
         * @type Boolean
         */
        isGecko2 : isGecko && !isGecko3,
        /**
         * True表示为浏览器是Gecko 1.9+引擎的（如Firefox 3.X）。
         * True if the detected browser uses a Gecko 1.9+ layout engine (e.g. Firefox 3.x).
         * @type Boolean
         */
        isGecko3 : isGecko3,
        /**
         * True表示为浏览器是非strict模式状态下的Internet Explorer。
         * True if the detected browser is Internet Explorer running in non-strict mode.
         * @type Boolean
         */
        isBorderBox : isBorderBox,
        /**
         * True表示为Linux平台的系统。
         * True if the detected platform is Linux.
         * @type Boolean
         */
        isLinux : isLinux,
        /**
         * True表示为Windows平台的系统。
         * True if the detected platform is Windows.
         * @type Boolean
         */
        isWindows : isWindows,
        /**
         * True表示为Mac OS平台的系统。
         * True if the detected platform is Mac OS.
         * @type Boolean
         */
        isMac : isMac,
        /**
         * True表示为Adobe Air平台的系统。
         * True if the detected platform is Adobe Air.
         * @type Boolean
         */
        isAir : isAir,

        /**
         * 默认下，Ext会自动决定浮动元素是否应该被填充。如果你在用Flash那么该值很可能要设置为True。
         * By default, Ext intelligently decides whether floating elements should be shimmed. If you are using flash,
         * you may want to set this to true.
         * @type Boolean
         */
        useShims : ((isIE && !isIE7) || (isMac && isGecko && !isGecko3))
    });

    // in intellij using keyword "namespace" causes parsing errors
    Ext.ns = Ext.namespace;
})();

Ext.ns("Ext", "Ext.util", "Ext.grid", "Ext.dd", "Ext.tree", "Ext.data",
                "Ext.form", "Ext.menu", "Ext.state", "Ext.lib", "Ext.layout", "Ext.app", "Ext.ux", "Ext.chart", "Ext.direct");


/**
 * @class Function
 * 这些函数在所有Function对象上均可用的（随便一个JavaScript函数）。
 * These functions are available on every Function object (any JavaScript function).
 */
Ext.apply(Function.prototype, {
    /**
     * 创建一个回调函数，该回调传递参数的形式为：arguments[0], arguments[1], arguments[2], ...
     * 对于任何函数来说都是可以直接调用的，例如<code>myFunction.createCallback(arg1, arg2)</code>。
     * 这样就会为这个函数绑定它两个参数。<b>如果需要指定这个函数的作用域，就应使用{@link #createDelegate}。</b>
     * 如果这个函数需要作用域，请使用#createDelegate。
     * 本方法仅使用于Window作用域。
     * 在回调方法的参数引用中，如果是一个没有任何参数的方法，那么直接指明其引用即可，并不需要本方法，如（如callback:myFn）。
     * 然而，如果想指定带有参数的方法， 就应该使用该方法了。
     * 因为callback: myFn(arg1, arg2)会引起myFn的方法调用，而得到结果却不是函数引用而是这个函数的返回值。
     * 要得到一个加参的方法引用就需要使用本方法了，达到对函数“加壳”的目的，如下例：
     * Creates a callback that passes arguments[0], arguments[1], arguments[2], ...
     * Call directly on any function. Example: <code>myFunction.createCallback(arg1, arg2)</code>
     * Will create a function that is bound to those 2 args. <b>If a specific scope is required in the
     * callback, use {@link #createDelegate} instead.</b> The function returned by createCallback always
     * executes in the window scope.
     * This method is required when you want to pass arguments to a callback function.  If no arguments
     * are needed, you can simply pass a reference to the function as a callback (e.g., callback: myFn).
     * However, if you tried to pass a function with arguments (e.g., callback: myFn(arg1, arg2)) the function
     * would simply execute immediately when the code is parsed. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

// 点击按钮就提示“Hi, Fred”。clicking the button alerts "Hi, Fred"
new Ext.Button({
    text: 'Say Hi',
    renderTo: Ext.getBody(),
    handler: sayHi.createCallback('Fred')
});
</code></pre>
     * @return {Function} 新产生的函数。The new function
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
     * 创建一个委派对象（就是回调），该对象的作用域指向obj。
     * 对于任何函数来说都是可以直接调用的。例如：<code>this.myFunction.createDelegate(this)</code>
     * 将创建一个函数，该函数的作用域会自动指向<tt>this</tt>。
     * Creates a delegate (callback) that sets the scope to obj.
     * Call directly on any function. Example: <code>this.myFunction.createDelegate(this, [arg1, arg2])</code>
     * Will create a function that is automatically scoped to obj so that the <tt>this</tt> variable inside the
     * callback points to obj. Example usage:
     * <pre><code>
var sayHi = function(name){
    // Note this use of "this.text" here.  This function expects to
    // execute within a scope that contains a text property.  In this
    // example, the "this" variable is pointing to the btn object that
    // was passed in createDelegate below.
    alert('Hi, ' + name + '. You clicked the "' + this.text + '" button.');
}

var btn = new Ext.Button({
    text: 'Say Hi',
    renderTo: Ext.getBody()
});

// This callback will execute in the scope of the
// button instance. Clicking the button alerts
// "Hi, Fred. You clicked the "Say Hi" button."
btn.on('click', sayHi.createDelegate(btn, ['Fred']));
</code></pre>
     * @param {Object} obj （可选的） 自定义的作用域对象。
     * (optional) The object for which the scope is set
     * @param {Array} args （可选的） 覆盖该次调用的参数列表。（默认为该函数的arguments）。
     * (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs （可选的） 如果该参数为true，将args加载到该函数的后面，如果该参数为数字类型，则args将插入到所指定的位置。
     * (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Function} 新产生的函数。The new function
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
     * 延迟调用该函数。你可以加入一个作用域的参数，例如：
     * Calls this function after the number of millseconds specified, optionally in a specific scope. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

//即刻执行的：
sayHi('Fred');

// 两秒过后执行的：
sayHi.defer(2000, this, ['Fred']);

// 有时候加上一个匿名函数也是很方便的：this syntax is sometimes useful for deferring
// execution of an anonymous function:
(function(){
    alert('Anonymous');
}).defer(100);
</code></pre>
     * @param {Number} millis 延迟时间，以毫秒为单位（如果是0则立即执行）。The number of milliseconds for the setTimeout call (if 0 the function is executed immediately)
     * @param {Object} obj （可选的） fcn的作用域（默认指向原函数或window）。(optional) The object for which the scope is set
     * @param {Array} args （可选的） 覆盖原函数的参数列表（默认为该函数的arguments）。(optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs （可选的）如果该参数为true，将args加载到该函数的后面，如果该参数为数字类型，则args将插入到所指定的位置。
     * (optional) if True args are appended to call args instead of overriding,if a number the args are inserted at the specified position
     * @return {Number} 可被clearTimeout所使用的timeout id。The timeout id that can be used with clearTimeout
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
     * 该函数返回了原函数执行的结果（也就是返回了原函数的返回值）。
     * 在参数中传递的函数fcn，它的参数也是原函数的参数。
     * Create a combined function call sequence of the original function + the passed function.
     * The resulting function returns the results of the original function.
     * The passed fcn is called with the parameters of the original function. 举例：Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

sayHi('Fred'); // 提示 "Hi, Fred"

var sayGoodbye = sayHi.createSequence(function(name){
    alert('Bye, ' + name);
});

sayGoodbye('Fred'); // both alerts show
</code></pre>
     * @param {Function} fcn 将要进行组合的函数。The function to sequence
     * @param {Object} scope （可选的）fcn的作用域（默认指向原函数或window）。(optional) The scope of the passed fcn (Defaults to scope of original function or window)
     * @return {Function} 新产生的函数。The new function
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
     * 创建一个拦截器函数。 
     * 传递的参数fcn被原函数之前调用。如果fcn的返回值为false，则原函数不会被调用。
     * 在返回函数中，将返回原函数的返回值。
     * 参数fcn会被调用，fcn被调用时会被传入原函数的参数。
     * Creates an interceptor function. 
     * The passed fcn is called before the original one. If it returns false, the original one is not called. 
     * The resulting function returns the results of the original function.
     * The passed fcn is called with the parameters of the original function. 
     * 例如：Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

sayHi('Fred'); // 提示"Hi, Fred"

// 不修改原函数的前提下创建新验证的函数。
// create a new function that validates input without
// directly modifying the original function:
var sayHiToFriend = sayHi.createInterceptor(function(name){
    return name == 'Brian';
});

sayHiToFriend('Fred');  // 没提示
sayHiToFriend('Brian'); // 提示 "Hi, Brian"
</code></pre>
     * @param {Function} fcn 在原函数被调用前调用的函数。The function to call before the original
     * @param {Object} scope （可选的）fcn的作用域（默认指向原函数或window）。(optional) The scope of the passed fcn (Defaults to scope of original function or window)
     * @return {Function} 新产生的函数。The new function
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
 * 为JavaScript的String对象添加静态方法。
 * These functions are available as static methods on the JavaScript String object.
 */
Ext.applyIf(String, {

    /**
     * 把输入的' 与 \字符转义。
     * Escapes the passed string for ' and \
     * @param {String} string 要转义的字符。
     * @return {String} 以转义的字符。The escaped string
     * @static
     */
    escape : function(string) {
        return string.replace(/('|\\)/g, "\\$1");
    },

    /**
     * 在字符串左边填充指定字符。这对于统一字符或日期标准格式非常有用。
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings. 例如：Example usage:
     * <pre><code>
var s = String.leftPad('123', 5, '0');
// s 现在是：'00123's now contains the string: '00123'
</code></pre>
     * @param {String} string 源字符串。The original string
     * @param {Number} size 源+填充字符串的总长度。The total length of the output string
     * @param {String} char （可选的） 填充字符串（默认是" "）。(optional) The character with which to pad the original string (defaults to empty string " ")
     * @return {String} 填充后的字符串。The padded string
     * @static
     */
    leftPad : function (val, size, ch) {
        var result = new String(val);
        if(!ch) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result.toString();
    },

    /**
     * 定义带标记的字符串，并用传入的字符替换标记。每个标记必须是唯一的，而且必须要像{0},{1}...{n}这样地自增长。
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.  
     * 例如：Example usage:
     * <pre><code>
var cls = 'my-class', text = 'Some text';
var s = String.format('&lt;div class="{0}">{1}&lt;/div>', cls, text);
//s现在是字符串：s now contains the string: '&lt;div class="my-class">Some text&lt;/div>'
</code></pre>
     * @param {String} string 带标记的字符串。The tokenized string to be formatted
     * @param {String} value1 第一个值，替换{0}。The value to replace token {0}
     * @param {String} value2 第二个值，替换{1}...等等（可以有任意多个）。Etc...
     * @return {String} 转化过的字符串。The formatted string
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
 * Utility function that allows you to easily switch a string between two alternating values.  The passed value
 * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
 * they are already different, the first value passed in is returned.  
 * 注意：这个方法返回新值，但并不改变现有字符串。
 * Note that this method returns the new value
 * but does not change the current string.
 * <pre><code>
// 可供选择的排序方向。alternate sort directions
sort = sort.toggle('ASC', 'DESC');

// 等价判断语句：instead of conditional logic:
sort = (sort == 'ASC' ? 'DESC' : 'ASC');
</code></pre>
 * @param {String} value 第一个参数，与函数相等则返回。The value to compare to the current string
 * @param {String} other 传入的第二个参数，不等返回。The new value to use if the string already equals the first value passed in
 * @return {String} 新值。The new value
 */
String.prototype.toggle = function(value, other){
    return this == value ? other : value;
};


/**
 * 裁剪字符串两旁的空白符，保留中间空白符，例如：
 * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
 * <pre><code>
var s = '  foo bar  ';
alert('-' + s + '-');         //alerts "- foo bar -"
alert('-' + s.trim() + '-');  //alerts "-foo bar-"
</code></pre>
 * @return {String} 已裁剪的字符串。The trimmed string
 */
String.prototype.trim = function(){
    var re = /^\s+|\s+$/g;
    return function(){ return this.replace(re, ""); };
}();
/**
 * @class Number
 */
Ext.applyIf(Number.prototype, {
    /**
     * 否则返回超出那个范围边界的值（最大，最小）。
     * 若数字是在范围内的就返回数字，否则最小或最大的极限值，那个极限值取决于数字是倾向那一面（最大、最小）。
     * 注意返回的极限值并不会影响当前的值。
     * Checks whether or not the current number is within a desired range.  If the number is already within the
     * range it is returned, otherwise the min or max value is returned depending on which side of the range is
     * exceeded.  Note that this method returns the constrained value but does not change the current number.
     * @param {Number} min 范围中最小的极限值。The minimum number in the range
     * @param {Number} max 范围中最大的极限值。The maximum number in the range
     * @return {Number} 若在范围内，返回原值，否则返回超出那个范围边界的值。The constrained value if outside the range, otherwise the current value
     */
    constrain : function(min, max){
        return Math.min(Math.max(this, min), max);
    }
});

/**
 * @class Array
 */
Ext.applyIf(Array.prototype, {
    /**
     * 检查对象是否存在于当前数组中。
     * Checks whether or not the specified object exists in the array.
     * @param {Object} o 要检查的对象。The object to check for
     * @return {Number} 返回该对象在数组中的位置（不存在则返回-1）。The index of o in the array (or -1 if it is not found)
     */
    indexOf : function(o){
       for (var i = 0, len = this.length; i < len; i++){
           if(this[i] == o) return i;
       }
        return -1;
    },

    /**
     * 删除数组中指定对象。如果该对象不在数组中，则不进行操作。
     * Removes the specified object from the array.  If the object is not found nothing happens.
     * @param {Object} o 要移除的对象。The object to remove
     * @return {Array} 当前数组。this array
     */
    remove : function(o){
       var index = this.indexOf(o);
       if(index != -1){
           this.splice(index, 1);
       }
       return this;
    }
});

// 写在这里就不用依赖Date.js
/**
 * 返回date对象创建时间与现在时间的时间差，单位为毫秒。
 * Returns the number of milliseconds between this date and date
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
 * @param {Date} date （可选的）默认时间是now。(optional) Defaults to now
 * @return {Number} 间隔毫秒数。The diff in milliseconds
 * @member Date getElapsed
 */
Date.prototype.getElapsed = function(date) {
    return Math.abs((date || new Date()).getTime()-this.getTime());
};

Ext.Element.addMethods({
    /**
     * 返回元素的坐标，这个坐标是依据元素某一个方位（anchor position）所确定的坐标。
     * Gets the x,y coordinates specified by the anchor position on the element.
     * @param {String} anchor （可选的） 指定的方位位置点（默认为 "c"，正中）。参阅 {@link #alignTo}可了解有什么支持的方位位置点。(optional) The specified anchor position (defaults to "c").  See {@link #alignTo}
     * for details on supported anchor positions.
     * @param {Boolean} local (optional) （可选的） true表示为获取元素局部的（相对于元素左上角位置）的坐标而非页面坐标。True to get the local (element top/left-relative) anchor position instead
     * of page coordinates
     * @param {Object} size (optional) （可选的） 用于计算方位位置点大小的对象（默认为元素当前大小）。An object containing the size to use for calculating anchor position
     * {width: (target width), height: (target height)} (defaults to the element's current size)
     * @return {Array} [x, y] 包含元素X、Y坐标的数组。An array containing the element's x and y coordinates
     */
    getAnchorXY : function(anchor, local, s){
        //Passing a different size is useful for pre-calculating anchors,
        //especially for anchored animations that change the el size.

        var w, h, vp = false;
        if(!s){
            var d = this.dom;
            if(d == document.body || d == document){
                vp = true;
                w = Ext.lib.Dom.getViewWidth(); h = Ext.lib.Dom.getViewHeight();
            }else{
                w = this.getWidth(); h = this.getHeight();
            }
        }else{
            w = s.width;  h = s.height;
        }
        var x = 0, y = 0, r = Math.round;
        switch((anchor || "tl").toLowerCase()){
            case "c":
                x = r(w*.5);
                y = r(h*.5);
            break;
            case "t":
                x = r(w*.5);
                y = 0;
            break;
            case "l":
                x = 0;
                y = r(h*.5);
            break;
            case "r":
                x = w;
                y = r(h*.5);
            break;
            case "b":
                x = r(w*.5);
                y = h;
            break;
            case "tl":
                x = 0;
                y = 0;
            break;
            case "bl":
                x = 0;
                y = h;
            break;
            case "br":
                x = w;
                y = h;
            break;
            case "tr":
                x = w;
                y = 0;
            break;
        }
        if(local === true){
            return [x, y];
        }
        if(vp){
            var sc = this.getScroll();
            return [x + sc.left, y + sc.top];
        }
        //Add the element's offset xy
        var o = this.getXY();
        return [x+o[0], y+o[1]];
    },

    /**
     * 当window大小变化时，让当前的元素向送入的元素看齐（Anchors & realigns）。
     * Anchors an element to another element and realigns it when the window is resized.
     * @param {Mixed} element 对齐的元素对齐的元素。The element to align to.
     * @param {String} position 对齐的位置。The position to align to.
     * @param {Array} offsets （可选的） 偏移位置 [x, y]。(optional) Offset the positioning by [x, y]
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象(optional)。True for the default animation or a standard Element animation config object
     * @param {Boolean/Number} monitorScroll （可选的）true表示为监视body的滚动然后重新定位。如果这是一个数字型的参数，即意味有缓冲延时（默认为50ms）。(optional) True to monitor body scroll and reposition. If this parameter
     * is a number, it is used as the buffer delay (defaults to 50ms).
     * @param {Function} callback 动画执行完毕的函数。The function to call after the animation finishes
     * @return {Ext.Element} this
     */
    anchorTo : function(el, alignment, offsets, animate, monitorScroll, callback){
        var action = function(){
            this.alignTo(el, alignment, offsets, animate);
            Ext.callback(callback, this);
        };
        Ext.EventManager.onWindowResize(action, this);
        var tm = typeof monitorScroll;
        if(tm != 'undefined'){
            Ext.EventManager.on(window, 'scroll', action, this,
                {buffer: tm == 'number' ? monitorScroll : 50});
        }
        action.call(this); // align immediately
        return this;
    },

    /**
     * 获取当前元素相对于另一个元素时候的x,y坐标，这时当前元素的坐标是[0,0]。关于可支持的位置，可参阅{@link #alignTo}。
     * Gets the x,y coordinates to align this element with another element. See {@link #alignTo} for more info on the
     * supported position values.
     * @param {Mixed} element 对齐的元素。The element to align to.
     * @param {String} position 对齐的位置，如“tl-bl”。The position to align to.
     * @param {Array} offsets （可选的） 偏移位置 [x, y]。(optional) Offset the positioning by [x, y]
     * @return {Array} [x, y]
     */
    getAlignToXY : function(el, p, o){
        el = Ext.get(el);
        if(!el || !el.dom){
            throw "Element.alignToXY with an element that doesn't exist";
        }
        var d = this.dom;
        var c = false; //constrain to viewport
        var p1 = "", p2 = "";
        o = o || [0,0];

        if(!p){
            p = "tl-bl";
        }else if(p == "?"){
            p = "tl-bl?";
        }else if(p.indexOf("-") == -1){
            p = "tl-" + p;
        }
        p = p.toLowerCase();
        var m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);
        if(!m){
           throw "Element.alignTo with an invalid alignment " + p;
        }
        p1 = m[1]; p2 = m[2]; c = !!m[3];

        //Subtract the aligned el's internal xy from the target's offset xy
        //plus custom offset to get the aligned el's new offset xy
        var a1 = this.getAnchorXY(p1, true);
        var a2 = el.getAnchorXY(p2, false);

        var x = a2[0] - a1[0] + o[0];
        var y = a2[1] - a1[1] + o[1];

        if(c){
            //constrain the aligned el to viewport if necessary
            var w = this.getWidth(), h = this.getHeight(), r = el.getRegion();
            // 10px of margin for ie
            var dw = Ext.lib.Dom.getViewWidth()-10, dh = Ext.lib.Dom.getViewHeight()-10;

            //If we are at a viewport boundary and the aligned el is anchored on a target border that is
            //perpendicular to the vp border, allow the aligned el to slide on that border,
            //otherwise swap the aligned el to the opposite border of the target.
            var p1y = p1.charAt(0), p1x = p1.charAt(p1.length-1);
           var p2y = p2.charAt(0), p2x = p2.charAt(p2.length-1);
           var swapY = ((p1y=="t" && p2y=="b") || (p1y=="b" && p2y=="t"));
           var swapX = ((p1x=="r" && p2x=="l") || (p1x=="l" && p2x=="r"));

           var doc = document;
           var scrollX = (doc.documentElement.scrollLeft || doc.body.scrollLeft || 0)+5;
           var scrollY = (doc.documentElement.scrollTop || doc.body.scrollTop || 0)+5;

           if((x+w) > dw + scrollX){
                x = swapX ? r.left-w : dw+scrollX-w;
            }
           if(x < scrollX){
               x = swapX ? r.right : scrollX;
           }
           if((y+h) > dh + scrollY){
                y = swapY ? r.top-h : dh+scrollY-h;
            }
           if (y < scrollY){
               y = swapY ? r.bottom : scrollY;
           }
        }
        return [x,y];
    },

    /**
     * 以另外一个元素为基准，根据任意的方位位置点对齐当前元素（送入的元素“不动”，当前元素“动”）。如果这个元素是document，则对齐到视图。
     * Aligns this element with another element relative to the specified anchor points. If the other element is the
     * document it aligns it to the viewport.
     * 位置参数是可选的，可指定为下列任意的格式：The position parameter is optional, and can be specified in any one of the following formats:
     * <ul>
     *   <li><b>空白Blank</b>: 默认对齐元素的左上角(即"tl-bl")。Defaults to aligning the element's top-left corner to the target's bottom-left corner ("tl-bl").</li>
     *   <li><b>有一个锚点（已弃置的，不翻译了）One anchor (deprecated)</b>: The passed anchor position is used as the target element's anchor point.
     *       The element being aligned will position its top-left corner (tl) to that point.  <i>This method has been
     *       deprecated in favor of the newer two anchor syntax below</i>.</li>
     *   <li><b>有两个锚点Two anchors</b>: 如果有如下表的两个值被传入，以“-”分隔开，那么第一个值是要往那个看齐元素的方位位置点，第二个值是当前目标元素的。If two values from the table below are passed separated by a dash, the first value is used as the
     *       element's anchor point, and the second value is used as the target's anchor point.</li>
     * </ul>
     * 除了罗列的方位位置点外，位置（position）参数还支持“?”字符。如果送入一“?”字符在方位位置点后面，那元素首先会正确地对齐然后看情况需要调整在视图的范围内显示。（are you sure？）
     * In addition to the anchor points, the position parameter also supports the "?" character.  If "?" is passed at the end of
     * the position string, the element will attempt to align as specified, but the position will be adjusted to constrain to
     * the viewport if necessary. 
     * 注意这一过程中，元素可能会被不断地以各种方向调整位置，以适合视图显示的要求。 
     * Note that the element being aligned might be swapped to align to a different position than
     * that specified in order to enforce the viewport constraints.
     * 支持的锚点位置如下列Following are all of the supported anchor positions:
<pre>
值Value  描述Description
-----  -----------------------------
tl     左上角（缺省值）。The top left corner (default)
t      顶部中央。The center of the top edge
tr     右上角。The top right corner
l      左边中央。The center of the left edge
c      元素正中。In the center of the element
r      右边中央。The center of the right edge
bl     左下角。The bottom left corner
b      底部中央。The center of the bottom edge
br     右下角。The bottom right corner
</pre>
使用范例：Example Usage:
<pre><code>
// 这是默认值（"tl-bl"）对齐到other-e。align el to other-el using the default positioning ("tl-bl", non-constrained)
el.alignTo("other-el");

// align the top left corner of el with the top right corner of other-el (constrained to viewport)
el.alignTo("other-el", "tr?");

// align the bottom right corner of el with the center left edge of other-el
el.alignTo("other-el", "br-l?");

// align the center of el with the bottom left corner of other-el and
// adjust the x position by -6 pixels (and the y position by 0)
el.alignTo("other-el", "c-bl", [-6, 0]);
</code></pre>
     * @param {Mixed} element 对齐的元素。The element to align to.
     * @param {String} position 对齐的位置。The position to align to.
     * @param {Array} offsets （可选的） 偏移位置 [x, y]。(optional) Offset the positioning by [x, y]
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象。(optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     */
    alignTo : function(element, position, offsets, animate){
        var xy = this.getAlignToXY(element, position, offsets);
        this.setXY(xy, this.preanim(arguments, 3));
        return this;
    },

    // private
    getConstrainToXY : function(){
        var os = {top:0, left:0, bottom:0, right: 0};

        return function(el, local, offsets, proposedXY){
            el = Ext.get(el);
            offsets = offsets ? Ext.applyIf(offsets, os) : os;

            var vw, vh, vx = 0, vy = 0;
            if(el.dom == document.body || el.dom == document){
                vw =Ext.lib.Dom.getViewWidth();
                vh = Ext.lib.Dom.getViewHeight();
            }else{
                vw = el.dom.clientWidth;
                vh = el.dom.clientHeight;
                if(!local){
                    var vxy = el.getXY();
                    vx = vxy[0];
                    vy = vxy[1];
                }
            }

            var s = el.getScroll();

            vx += offsets.left + s.left;
            vy += offsets.top + s.top;

            vw -= offsets.right;
            vh -= offsets.bottom;

            var vr = vx+vw;
            var vb = vy+vh;

            var xy = proposedXY || (!local ? this.getXY() : [this.getLeft(true), this.getTop(true)]);
            var x = xy[0], y = xy[1];
            var w = this.dom.offsetWidth, h = this.dom.offsetHeight;

            // only move it if it needs it
            var moved = false;

            // first validate right/bottom
            if((x + w) > vr){
                x = vr - w;
                moved = true;
            }
            if((y + h) > vb){
                y = vb - h;
                moved = true;
            }
            // then make sure top/left isn't negative
            if(x < vx){
                x = vx;
                moved = true;
            }
            if(y < vy){
                y = vy;
                moved = true;
            }
            return moved ? [x, y] : false;
        };
    }()
});

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
Ext.Element.addMethods({
    /**
     * 为当前元素初始化{@link Ext.dd.DD}对象。
     * Initializes a {@link Ext.dd.DD} drag drop object for this element.
     * @param {String} group DD对象隶属于的那个组（Group）。The group the DD object is member of
     * @param {Object} config DD之配置对象。The DD config object
     * @param {Object} overrides 包含一些方法的对象，用于重写或实现（override/implement）DDTarget对象。An object containing methods to override/implement on the DD object
     * @return {Ext.dd.DD} DD对象。The DD object
     */
    initDD : function(group, config, overrides){
        var dd = new Ext.dd.DD(Ext.id(this.dom), group, config);
        return Ext.apply(dd, overrides);
    },

    /**
     * 为当前元素初始化{@link Ext.dd.DDProxy}对象。
     * Initializes a {@link Ext.dd.DDProxy} drag drop object for this element.
     * @param {String} group DD对象隶属于的那个组。（Group）The group the DD object is member of
     * @param {Object} config DD之配置对象。The DD config object
     * @param {Object} overrides 包含一些方法的对象，用于重写或实现（override/implement）DDTarget对象。An object containing methods to override/implement on the DD object
     * @return {Ext.dd.DD} DD对象。The DD object
     */
    initDDProxy : function(group, config, overrides){
        var dd = new Ext.dd.DDProxy(Ext.id(this.dom), group, config);
        return Ext.apply(dd, overrides);
    },

    /**
     * 为当前元素初始化{@link Ext.dd.DDTarget}对象。
     * Initializes a {@link Ext.dd.DDTarget} drag drop object for this element.
     * @param {String} group DD对象隶属于的那个组（Group）。The group the DD object is member of
     * @param {Object} config DD之配置对象。The DD config object
     * @param {Object} overrides 包含一些方法的对象，用于重写或实现（override/implement）DDTarget对象。An object containing methods to override/implement on the DD object
     * @return {Ext.dd.DD} DD对象。The DD object
     */
    initDDTarget : function(group, config, overrides){
        var dd = new Ext.dd.DDTarget(Ext.id(this.dom), group, config);
        return Ext.apply(dd, overrides);
    }
});

Ext.Element.addMethods({
    /**
     * 把送入的元素归为这个元素的子元素。
     * Appends the passed element(s) to this element
     * @param {String/HTMLElement/Array/Element/CompositeElement} el
     * @return {Ext.Element} this
     */
    appendChild: function(el){
        el = Ext.get(el);
        el.appendTo(this);
        return this;
    },

    /**
     * 把这个元素添加到送入的元素里面。
     * Appends this element to the passed element
     * @param {Mixed} el 新父元素。The new parent element
     * @return {Ext.Element} this
     */
    appendTo: function(el){
        el = Ext.getDom(el);
        el.appendChild(this.dom);
        return this;
    },

    /**
     * 传入一个元素的参数，将其放置在当前元素之前的位置。
     * Inserts this element before the passed element in the DOM
     * @param {Mixed} el 要插入在当前元素之前的元素。The element before which this element will be inserted
     * @return {Ext.Element} this
     */
    insertBefore: function(el){
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el);
        return this;
    },

    /**
     * 传入一个元素的参数，将其放置在当前元素之后的位置。
     * Inserts this element after the passed element in the DOM
     * @param {Mixed} el 要插入在当前元素之后的元素。The element to insert after
     * @return {Ext.Element} this
     */
    insertAfter: function(el){
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el.nextSibling);
        return this;
    },

    /**
     * 可以是插入一个元素，也可以是创建一个元素（要创建的话请使用“DomHelper配置项对象”作为参数传入），
     * 总之，这个元素作为当前元素的第一个子元素出现。
     * Inserts (or creates) an element (or DomHelper config) as the first child of this element
     * @param {Mixed/Object} el 可以是元素的id，或是插入的元素本身，或是要创建的“DomHelper配置项”对象。The id or element to insert or a DomHelper config to create and insert
     * @return {Ext.Element} 新子元素。The new child
     */
    insertFirst: function(el, returnDom){
        el = el || {};
        if(typeof el == 'object' && !el.nodeType && !el.dom){ // dh config
            return this.createChild(el, this.dom.firstChild, returnDom);
        }else{
            el = Ext.getDom(el);
            this.dom.insertBefore(el, this.dom.firstChild);
            return !returnDom ? Ext.get(el) : el;
        }
    },

    /**
     * 可以是插入一个元素，也可以是创建一个元素（要创建的话请使用“DomHelper配置项对象”作为参数传入），总之，这个元素作为当前元素的相邻元素出现。
     * Inserts (or creates) the passed element (or DomHelper config) as a sibling of this element
     * @param {Mixed/Object/Array} el 可以是元素的id，或是插入的元素本身，或是要创建的“DomHelper配置项”对象。The id, element to insert or a DomHelper config to create and insert *or* an array of any of those.
     * @param {String} where (optional) 在当前元素之前还是之后默认为'before'。'before' or 'after' defaults to before
     * @param {Boolean} returnDom （可选的）True表示为返回原始的DOM类型对象而非Ext标准对象。(optional) True to return the raw DOM element instead of Ext.Element
     * @return {Ext.Element} 插入的元素。the inserted Element
     */
    insertSibling: function(el, where, returnDom){
        var rt;
        if(Ext.isArray(el)){
            for(var i = 0, len = el.length; i < len; i++){
                rt = this.insertSibling(el[i], where, returnDom);
            }
            return rt;
        }
        where = where ? where.toLowerCase() : 'before';
        el = el || {};
        var refNode = where == 'before' ? this.dom : this.dom.nextSibling;

        if(typeof el == 'object' && !el.nodeType && !el.dom){ // dh config
            if(where == 'after' && !this.dom.nextSibling){
                rt = Ext.DomHelper.append(this.dom.parentNode, el, !returnDom);
            }else{
                rt = Ext.DomHelper[where == 'after' ? 'insertAfter' : 'insertBefore'](this.dom, el, !returnDom);
            }

        }else{
            rt = this.dom.parentNode.insertBefore(Ext.getDom(el), refNode);
            if(!returnDom){
                rt = Ext.get(rt);
            }
        }
        return rt;
    },

    /**
     * 用于当前这个元素替换传入的元素。
     * Replaces the passed element with this element
     * @param {Mixed} el 要替换的元素。The element to replace
     * @return {Ext.Element} this
     */
    replace: function(el){
        el = Ext.get(el);
        this.insertBefore(el);
        el.remove();
        return this;
    },

    /**
     * 用传入的元素替换这个元素。
     * Replaces this element with the passed element
     * @param {Mixed/Object} el 新元素或是要创建的DomHelper配置项对象。The new element or a DomHelper config of an element to create
     * @return {Ext.Element} this
     */
    replaceWith: function(el){
        if(typeof el == 'object' && !el.nodeType && !el.dom){ // dh config
            el = this.insertSibling(el, 'before', true);
        }else{
            el = Ext.getDom(el);
            this.dom.parentNode.insertBefore(el, this.dom);
        }
        Ext.Element.uncache(this.id);
        Ext.removeNode(this.dom);
        this.dom = el;
        this.id = Ext.id(el);
        Ext.Element.cache[this.id] = this;
        return this;
    }
});

Ext.Element.addMethods({
    /**
     * 构建KeyMap的快捷方式Convenience method for constructing a KeyMap
     * @param {Number/Array/Object/String} key 可侦听key代码的数值、key代码的数组的字串符，或者是像这样的object:Either a string with the keys to listen for, the numeric key code, array of key codes or an object with the following options:
     *                                  {key: (number or array), shift: (true/false), ctrl: (true/false), alt: (true/false)}
     * @param {Function} fn 按下键后调用的函数。The function to call
     * @param {Object} scope （可选的） 函数的作用域。(optional) The scope of the function
     * @return {Ext.KeyMap} 创建好的KeyMap。The KeyMap created
     */
    addKeyListener : function(key, fn, scope){
        var config;
        if(typeof key != "object" || Ext.isArray(key)){
            config = {
                key: key,
                fn: fn,
                scope: scope
            };
        }else{
            config = {
                key : key.key,
                shift : key.shift,
                ctrl : key.ctrl,
                alt : key.alt,
                fn: fn,
                scope: scope
            };
        }
        return new Ext.KeyMap(this, config);
    },

    /**
     * 为该元素创建一个KeyMap。
     * Creates a KeyMap for this element
     * @param {Object} config KeyMap配置项。请参阅{@link Ext.KeyMap}。The KeyMap config. See {@link Ext.KeyMap} for more details
     * @return {Ext.KeyMap} 创建好的KeyMap。The KeyMap created
     */
    addKeyMap : function(config){
        return new Ext.KeyMap(this, config);
    }
});

Ext.Element.addMethods({
    /**
     * Measures the element's content height and updates height to match. Note: this function uses setTimeout so
     * the new height may not be available immediately.
     * @param {Boolean} animate (optional) Animate the transition (defaults to false)
     * @param {Float} duration (optional) Length of the animation in seconds (defaults to .35)
     * @param {Function} onComplete (optional) Function to call when animation completes
     * @param {String} easing (optional) Easing method to use (defaults to easeOut)
     * @return {Ext.Element} this
     */
    autoHeight : function(animate, duration, onComplete, easing){
        var oldHeight = this.getHeight();
        this.clip();
        this.setHeight(1); // force clipping
        setTimeout(function(){
            var height = parseInt(this.dom.scrollHeight, 10); // parseInt for Safari
            if(!animate){
                this.setHeight(height);
                this.unclip();
                if(typeof onComplete == "function"){
                    onComplete();
                }
            }else{
                this.setHeight(oldHeight); // restore original height
                this.setHeight(height, animate, duration, function(){
                    this.unclip();
                    if(typeof onComplete == "function") onComplete();
                }.createDelegate(this), easing);
            }
        }.createDelegate(this), 0);
        return this;
    }
});

Ext.Element.addMethods({
    /**
     * 测量元素其内容的实际高度，使元素之高度适合。
     * 注：改函数使用setTimeout所以新高度或者不会立即有效。
     * Measures the element's content height and updates height to match. Note: this function uses setTimeout so
     * the new height may not be available immediately.
     * @param {Boolean} animate （可选的）是否要动画（默认 false）。(optional) Animate the transition (defaults to false)
     * @param {Float} duration （可选的）动画持续时间（默认为0.35秒）。(optional) Length of the animation in seconds (defaults to .35)
     * @param {Function} onComplete （可选的）动画完成后执行的函数。(optional) Function to call when animation completes
     * @param {String} easing （可选的）采用清除的方法（默认为easeOut）。(optional) Easing method to use (defaults to easeOut)
     * @return {Ext.Element} this
     */
    autoHeight : function(animate, duration, onComplete, easing){
        var oldHeight = this.getHeight();
        this.clip();
        this.setHeight(1); // force clipping
        setTimeout(function(){
            var height = parseInt(this.dom.scrollHeight, 10); // parseInt for Safari
            if(!animate){
                this.setHeight(height);
                this.unclip();
                if(typeof onComplete == "function"){
                    onComplete();
                }
            }else{
                this.setHeight(oldHeight); // restore original height
                this.setHeight(height, animate, duration, function(){
                    this.unclip();
                    if(typeof onComplete == "function") onComplete();
                }.createDelegate(this), easing);
            }
        }.createDelegate(this), 0);
        return this;
    }
});

Ext.Element.addMethods({
    /**
     * 传入一个容器（container）参数，把元素滚动到容器视图的范围内（View）。
     * Scrolls this element into view within the passed container.
     * @param {Mixed} container （可选的）滚动容器的元素（默认为document.body）该值应该是字符串id，dom节点或Ext.Element。(optional) The container element to scroll (defaults to document.body).  Should be a
     * string (id), dom node, or Ext.Element.
     * @param {Boolean} hscroll （可选的）false表示为禁止水平滚动（默认为true）。(optional) False to disable horizontal scroll (defaults to true)
     * @return {Ext.Element} this
     */
    scrollIntoView : function(container, hscroll){
        var c = Ext.getDom(container) || Ext.getBody().dom;
        var el = this.dom;

        var o = this.getOffsetsTo(c),
            l = o[0] + c.scrollLeft,
            t = o[1] + c.scrollTop,
            b = t+el.offsetHeight,
            r = l+el.offsetWidth;

        var ch = c.clientHeight;
        var ct = parseInt(c.scrollTop, 10);
        var cl = parseInt(c.scrollLeft, 10);
        var cb = ct + ch;
        var cr = cl + c.clientWidth;

        if(el.offsetHeight > ch || t < ct){
        	c.scrollTop = t;
        }else if(b > cb){
            c.scrollTop = b-ch;
        }
        c.scrollTop = c.scrollTop; // corrects IE, other browsers will ignore

        if(hscroll !== false){
			if(el.offsetWidth > c.clientWidth || l < cl){
                c.scrollLeft = l;
            }else if(r > cr){
                c.scrollLeft = r-c.clientWidth;
            }
            c.scrollLeft = c.scrollLeft;
        }
        return this;
    },

    // private
    scrollChildIntoView : function(child, hscroll){
        Ext.fly(child, '_scrollChildIntoView').scrollIntoView(this, hscroll);
    },
    
    /**
     * 返回true表示为该元素是允许滚动的。
     * Returns true if this element is scrollable.
     * @return {Boolean}
     */
     isScrollable : function(){
        var dom = this.dom;
        return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
    },

    /**
	 * 滚动该元素到指定的点（scroll point）。
     * 它不会做边界检查所以若果你滚动到一个不合理的值时它也会试着去这么做。
     * 要自动检查边界，请使用scroll()。
     * Scrolls this element the specified scroll point. 
     * It does NOT do bounds checking so if you scroll to a weird value it will try to do it. For auto bounds checking, use scroll().
     * @param {String} side 即可是对应于scrollLeft"left"值，也可以是scrollTop对应于的"top"值。Either "left" for scrollLeft values or "top" for scrollTop values.
     * @param {Number} value 新滚动值。The new scroll value
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象。(optional) true for the default animation or a standard Element animation config object
     * @return {Element} this
     */
    scrollTo : function(side, value, animate){
        var prop = side.toLowerCase() == "left" ? "scrollLeft" : "scrollTop";
        if(!animate){
            this.dom[prop] = value;
        }else{
            var to = prop == "scrollLeft" ? [value, this.dom.scrollTop] : [this.dom.scrollLeft, value];
            this.anim({scroll: {"to": to}}, this.preanim(arguments, 2), 'scroll');
        }
        return this;
    },

    /**
     * 按照指定的方向滚动该当前元素。须确认元素可滚动的范围，以免滚动超出元素可滚动的范围（溢出）。
     * Scrolls this element the specified direction. Does bounds checking to make sure the scroll is
     * within this element's scrollable range.
     * @param {String} direction 允许值: "l","left" - "r","right" - "t","top","up" - "b","bottom","down"。Possible values are: "l" (or "left"), "r" (or "right"), "t" (or "top", or "up"), "b" (or "bottom", or "down").
     * @param {Number} distance 元素滚动有多远（像素）。How far to scroll the element in pixels
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象。(optional) true for the default animation or a standard Element animation config object
     * @return {Boolean} true表示为滚动是轮换的；false表示为元素能滚动其最远的。Returns true if a scroll was triggered or false if the element
     * was scrolled as far as it could go.
     */
     scroll : function(direction, distance, animate){
         if(!this.isScrollable()){
             return;
         }
         var el = this.dom;
         var l = el.scrollLeft, t = el.scrollTop;
         var w = el.scrollWidth, h = el.scrollHeight;
         var cw = el.clientWidth, ch = el.clientHeight;
         direction = direction.toLowerCase();
         var scrolled = false;
         var a = this.preanim(arguments, 2);
         switch(direction){
             case "l":
             case "left":
                 if(w - l > cw){
                     var v = Math.min(l + distance, w-cw);
                     this.scrollTo("left", v, a);
                     scrolled = true;
                 }
                 break;
            case "r":
            case "right":
                 if(l > 0){
                     var v = Math.max(l - distance, 0);
                     this.scrollTo("left", v, a);
                     scrolled = true;
                 }
                 break;
            case "t":
            case "top":
            case "up":
                 if(t > 0){
                     var v = Math.max(t - distance, 0);
                     this.scrollTo("top", v, a);
                     scrolled = true;
                 }
                 break;
            case "b":
            case "bottom":
            case "down":
                 if(h - t > ch){
                     var v = Math.min(t + distance, h-ch);
                     this.scrollTo("top", v, a);
                     scrolled = true;
                 }
                 break;
         }
         return scrolled;
    }
});