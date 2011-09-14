/**
 * @class Ext
 * Ext核心工具与函数
 * @singleton
 */
/**
 * @class Ext
 * Ext core utilities and functions.
 * @singleton
 */
if (typeof Ext === "undefined") {
    Ext = {};
}

/**
 * 复制config对象的所有属性到obj（第一个参数为obj，第二个参数为config）。
 * Copies all the properties of config to obj.
 * @param {Object} object 属性接受方对象。The receiver of the properties
 * @param {Object} config 属性源对象。The source of the properties
 * @param {Object} defaults 默认对象，如果该参数存在，obj将会得到那些defaults有而config没有的属性。A different object that will also be applied for default values
 * @return {Object} returns obj
 * @member Ext apply
 */
Ext.apply = (function() {
    // IE doesn't recognize that toString (and valueOf) method as explicit one but it "thinks" that's a native one.
    for(var key in {valueOf:1}) {
        return function(object, config, defaults) {
            // no "this" reference for friendly out of scope calls
            if (defaults) {
                Ext.apply(object, defaults);
            }
            if (object && config && typeof config === 'object') {
                for (var key in config) {
                    object[key] = config[key];
                }
            }
            return object;
        };
    }
    return function(object, config, defaults) {
        // no "this" reference for friendly out of scope calls
        if (defaults) {
            Ext.apply(object, defaults);
        }
        if (object && config && typeof config === 'object') {
            for (var key in config) {
                object[key] = config[key];
            }
            if (config.toString !== Object.prototype.toString) {
                object.toString = config.toString;
            }
            if (config.valueOf !== Object.prototype.valueOf) {
                object.valueOf = config.valueOf;
            }
        }
        return object;
    };
})();

Ext.apply(Ext, {
    platformVersion: '0.2',
    platformVersionDetail: {
        major: 0,
        minor: 2,
        patch: 0
    },
    userAgent: navigator.userAgent.toLowerCase(),
    cache: {},
    idSeed: 1000,
    BLANK_IMAGE_URL : 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    isStrict: document.compatMode == "CSS1Compat",

    windowId: 'ext-window',
    documentId: 'ext-document',

    /**
    * 反复使用的空函数。
    * A reusable empty function
    * @property
    * @type Function
    */
    emptyFn : function() {},

     /**
     * 判断页面是否运行在SSL状态。
     * True if the page is running over SSL
     * @type Boolean
     */
    isSecure : /^https/i.test(window.location.protocol),

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
     * 是否在垃圾回收期间自动清除事件监听器（默认为true）。
     * True to automatically purge event listeners during garbageCollection (defaults to true).
     * @type Boolean
     */
    enableListenerCollection : true,

    /**
     * 复制所有config的属性至obj，如果obj已有该属性，则不复制（第一个参数为obj，第二个参数为config）。
     * Copies all the properties of config to obj if they don't already exist.
     * @param {Object} obj 接受方对象。The receiver of the properties
     * @param {Object} config 源对象。The source of the properties
     * @return {Object} returns obj
     */
    applyIf : function(object, config) {
        var property, undefined;

        if (object) {
            for (property in config) {
                if (object[property] === undefined) {
                    object[property] = config[property];
                }
            }
        }

        return object;
    },

    /**
     * 重绘张页面。该方法解决了移动Safari的绘图问题。
     * Repaints the whole page. This fixes frequently encountered painting issues in mobile Safari.
     */
    repaint : function() {
        var mask = Ext.getBody().createChild({
            cls: 'x-mask x-mask-transparent'
        });
        setTimeout(function() {
            mask.remove();
        }, 0);
    },

    /**
     * 对页面元素生成唯一id，如果该元素已存在id，则不会再生成。
     * Generates unique ids. If the element already has an id, it is unchanged
     * @param {Mixed} el （可选的） 将要生成id的元素。(optional)The element to generate an id for
     * @param {String} prefix （可选的） 该id的前缀（默认为 "ext-gen"）。(optional) Id prefix (defaults "ext-gen")
     * @return {String} 生成的Id。The generated Id.
     */
    id : function(el, prefix) {
        el = Ext.getDom(el) || {};
        if (el === document) {
            el.id = this.documentId;
        }
        else if (el === window) {
            el.id = this.windowId;
        }
        el.id = el.id || ((prefix || 'ext-gen') + (++Ext.idSeed));
        return el.id;
    },

    /**
     * <p>Extends one class to create a subclass and optionally overrides members with the passed literal. This method
     * also adds the function "override()" to the subclass that can be used to override members of the class.</p>
     * For example, to create a subclass of Ext GridPanel:
     * <pre><code>
MyGridPanel = Ext.extend(Ext.grid.GridPanel, {
constructor: function(config) {

//      Create configuration for this Grid.
    var store = new Ext.data.Store({...});
    var colModel = new Ext.grid.ColumnModel({...});

//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
    config = Ext.apply({
        store: store,
        colModel: colModel
    }, config);

    MyGridPanel.superclass.constructor.call(this, config);

//      Your postprocessing here
},

yourMethod: function() {
    // etc.
}
});
       </code></pre>
     *
     * <p>This function also supports a 3-argument call in which the subclass's constructor is
     * passed as an argument. In this form, the parameters are as follows:</p>
     * <div class="mdetail-params"><ul>
     * <li><code>subclass</code> : Function <div class="sub-desc">The subclass constructor.</div></li>
     * <li><code>superclass</code> : Function <div class="sub-desc">The constructor of class being extended</div></li>
     * <li><code>overrides</code> : Object <div class="sub-desc">A literal with members which are copied into the subclass's
     * prototype, and are therefore shared among all instances of the new class.</div></li>
     * </ul></div>
     *
     * @param {Function} superclass The constructor of class being extended.
     * @param {Object} overrides <p>A literal with members which are copied into the subclass's
     * prototype, and are therefore shared between all instances of the new class.</p>
     * <p>This may contain a special member named <tt><b>constructor</b></tt>. This is used
     * to define the constructor of the new class, and is returned. If this property is
     * <i>not</i> specified, a constructor is generated and returned which just calls the
     * superclass's constructor passing on its parameters.</p>
     * <p><b>It is essential that you call the superclass constructor in any provided constructor. See example code.</b></p>
     * @return {Function} The subclass constructor from the <code>overrides</code> parameter, or a generated one if not provided.
     */
    extend : function() {
        // inline overrides
        var inlineOverrides = function(o){
            for (var m in o) {
                if (!o.hasOwnProperty(m)) {
                    continue;
                }
                this[m] = o[m];
            }
        };

        var objectConstructor = Object.prototype.constructor;

        return function(subclass, superclass, overrides){
            // First we check if the user passed in just the superClass with overrides
            if (Ext.isObject(superclass)) {
                overrides = superclass;
                superclass = subclass;
                subclass = overrides.constructor != objectConstructor
                    ? overrides.constructor
                    : function(){ superclass.apply(this, arguments); };
            }

            if (!superclass) {
                throw "Attempting to extend from a class which has not been loaded on the page.";
            }

            // We create a new temporary class
            var F = function(){},
                subclassProto,
                superclassProto = superclass.prototype;

            F.prototype = superclassProto;
            subclassProto = subclass.prototype = new F();
            subclassProto.constructor = subclass;
            subclass.superclass = superclassProto;

            if(superclassProto.constructor == objectConstructor){
                superclassProto.constructor = superclass;
            }

            subclass.override = function(overrides){
                Ext.override(subclass, overrides);
            };

            subclassProto.superclass = subclassProto.supr = (function(){
                return superclassProto;
            });

            subclassProto.override = inlineOverrides;
            subclassProto.proto = subclassProto;

            subclass.override(overrides);
            subclass.extend = function(o) {
                return Ext.extend(subclass, o);
            };

            return subclass;
        };
    }(),

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
	 * @param {Object} overrides 加入到origClass的函数列表。这应该是一个包含一个或多个方法的对象。The list of functions to add to origClass. This should be specified as an object literal
	 * containing one or more methods.
	 * @method override
	 */

    override : function(origclass, overrides) {
        Ext.apply(origclass.prototype, overrides);
    },

    /**
     * 为变量创建其命名空间，这样类就有了“安身之所”，不是飘荡四处的“全局变量”。例如：
     * Creates namespaces to be used for scoping variables and classes so that they are not global.  Usage:
     * <pre><code>
Ext.namespace('Company', 'Company.data');
Ext.namespace('Company.data'); // 与上面的语法相等价，推荐上面的写法。equivalent and preferable to above syntax
Company.Widget = function() { ... }
Company.data.CustomStore = function(config) { ... }
</code></pre>
     * @param {String} namespace1 命名空间一
     * @param {String} namespace2 命名空间二
     * @param {String} etc
     * @return {Object} 命名空间对象（如果传入多个对象，就返回最后一个命名空间对象）。The namespace object. (If multiple arguments are passed, this will be the last namespace created)
     * @method namespace
     */
    namespace : function() {
        var ln = arguments.length,
            i, value, split, x, xln, parts, object;

        for (i = 0; i < ln; i++) {
            value = arguments[i];
            parts = value.split(".");
            if (window.Ext) {
                object = window[parts[0]] = Object(window[parts[0]]);
            } else {
                object = arguments.callee.caller.arguments[0];
            }
            for (x = 1, xln = parts.length; x < xln; x++) {
                object = object[parts[x]] = Object(object[parts[x]]);
            }
        }
        return object;
    },

    /**
     * 把一个对象转换为一串以编码的URL字符。例如Ext.urlEncode({foo: 1, bar: 2});变为"foo=1&bar=2"。
     * 可选地，如果遇到属性的类型是数组的话，那么该属性对应的key就是每个数组元素的key，逐一进行“结对的”编码。
     * Takes an object and converts it to an encoded URL. e.g. Ext.urlEncode({foo: 1, bar: 2}); would return "foo=1&bar=2".  Optionally,
     * property values can be arrays, instead of keys and the resulting string that's returned will contain a name/value pair for each array value.
     * @param {Object} o 要编码的对象。The object to encode
     * @param {String} pre （可选的）添加的url编码字符串的那个前缀。(optional) A prefix to add to the url encoded string
     * @return {String}
     */
    urlEncode : function(o, pre) {
        var empty,
            buf = [],
            e = encodeURIComponent;

        Ext.iterate(o, function(key, item){
            empty = Ext.isEmpty(item);
            Ext.each(empty ? key : item, function(val){
                buf.push('&', e(key), '=', (!Ext.isEmpty(val) && (val != key || !empty)) ? (Ext.isDate(val) ? Ext.encode(val).replace(/"/g, '') : e(val)) : '');
            });
        });

        if(!pre){
            buf.shift();
            pre = '';
        }

        return pre + buf.join('');
    },
    
    /**
	 * 把一个已经encoded的URL字符串转换为对象。如Ext.urlDecode("foo=1&bar=2"); 就是{foo: "1", bar: "2"}；
     * Takes an encoded URL and and converts it to an object. Example:
     * <pre><code>
Ext.urlDecode("foo=1&bar=2"); // returns {foo: "1", bar: "2"}
Ext.urlDecode("foo=1&bar=2&bar=3&bar=4", false); // returns {foo: "1", bar: ["2", "3", "4"]}
       </code></pre>
     * @param {String} string URL编码后的字符串
     * @param {Boolean} overwrite （可选的）重复名称的就当作为数组，如果该项为true就禁止该功能（默认为false）。(optional) Items of the same name will overwrite previous values instead of creating an an array (Defaults to false).
     * @return {Object} 成员实体。A literal with members
     */
    urlDecode : function(string, overwrite) {
        if (Ext.isEmpty(string)) {
            return {};
        }

        var obj = {},
            pairs = string.split('&'),
            d = decodeURIComponent,
            name,
            value;

        Ext.each(pairs, function(pair) {
            pair = pair.split('=');
            name = d(pair[0]);
            value = d(pair[1]);
            obj[name] = overwrite || !obj[name] ? value : [].concat(obj[name]).concat(value);
        });

        return obj;
    },

    /**
     * Convert certain characters (&, <, >, and ') to their HTML character equivalents for literal display in web pages.
     * @param {String} value The string to encode
     * @return {String} The encoded text
     */
    htmlEncode : function(value) {
        return Ext.util.Format.htmlEncode(value);
    },

    /**
     * Convert certain characters (&, <, >, and ') from their HTML character equivalents.
     * @param {String} value The string to decode
     * @return {String} The decoded text
     */
    htmlDecode : function(value) {
         return Ext.util.Format.htmlDecode(value);
    },

    /**
     * Appends content to the query string of a URL, handling logic for whether to place
     * a question mark or ampersand.
     * @param {String} url The URL to append to.
     * @param {String} s The content to append to the URL.
     * @return (String) The resulting URL
     */
    urlAppend : function(url, s) {
        if (!Ext.isEmpty(s)) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + s;
        }
        return url;
    },

    /**
     * Converts any iterable (numeric indices and a length property) into a true array
     * Don't use this on strings. IE doesn't support "abc"[0] which this implementation depends on.
     * For strings, use this instead: "abc".match(/./g) => [a,b,c];
     * @param {Iterable} array the iterable object to be turned into a true Array.
     * @param {Number} start a number that specifies where to start the selection.
     * @param {Number} end a number that specifies where to end the selection.
     * @return (Array) array
     */
     toArray : function(array, start, end) {
        return Array.prototype.slice.call(array, start || 0, end || array.length);
     },

     /**
      * Iterates an array calling the supplied function.
      * @param {Array/NodeList/Mixed} array The array to be iterated. If this
      * argument is not really an array, the supplied function is called once.
      * @param {Function} fn The function to be called with each item. If the
      * supplied function returns false, iteration stops and this method returns
      * the current <code>index</code>. This function is called with
      * the following arguments:
      * <div class="mdetail-params"><ul>
      * <li><code>item</code> : <i>Mixed</i>
      * <div class="sub-desc">The item at the current <code>index</code>
      * in the passed <code>array</code></div></li>
      * <li><code>index</code> : <i>Number</i>
      * <div class="sub-desc">The current index within the array</div></li>
      * <li><code>allItems</code> : <i>Array</i>
      * <div class="sub-desc">The <code>array</code> passed as the first
      * argument to <code>Ext.each</code>.</div></li>
      * </ul></div>
      * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed.
      * Defaults to the <code>item</code> at the current <code>index</code>util
      * within the passed <code>array</code>.
      * @return See description for the fn parameter.
      */
     each : function(array, fn, scope) {
         if (Ext.isEmpty(array, true)) {
             return 0;
         }
         if (!Ext.isIterable(array) || Ext.isPrimitive(array)) {
             array = [array];
         }
         for (var i = 0, len = array.length; i < len; i++) {
             if (fn.call(scope || array[i], array[i], i, array) === false) {
                 return i;
             }
         }
         return true;
     },

     /**
      * Iterates either the elements in an array, or each of the properties in an object.
      * <b>Note</b>: If you are only iterating arrays, it is better to call {@link #each}.
      * @param {Object/Array} object The object or array to be iterated
      * @param {Function} fn The function to be called for each iteration.
      * The iteration will stop if the supplied function returns false, or
      * all array elements / object properties have been covered. The signature
      * varies depending on the type of object being interated:
      * <div class="mdetail-params"><ul>
      * <li>Arrays : <tt>(Object item, Number index, Array allItems)</tt>
      * <div class="sub-desc">
      * When iterating an array, the supplied function is called with each item.</div></li>
      * <li>Objects : <tt>(String key, Object value, Object)</tt>
      * <div class="sub-desc">
      * When iterating an object, the supplied function is called with each key-value pair in
      * the object, and the iterated object</div></li>
      * </ul></divutil>
      * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed. Defaults to
      * the <code>object</code> being iterated.
      */
     iterate : function(obj, fn, scope) {
         if (Ext.isEmpty(obj)) {
             return;
         }
         if (Ext.isIterable(obj)) {
             Ext.each(obj, fn, scope);
             return;
         }
         else if (Ext.isObject(obj)) {
             for (var prop in obj) {
                 if (obj.hasOwnProperty(prop)) {
                     if (fn.call(scope || obj, prop, obj[prop], obj) === false) {
                         return;
                     }
                 }
             }
         }
     },

    /**
     * Plucks the value of a property from each item in the Array
     *
// Example:
Ext.pluck(Ext.query("p"), "className"); // [el1.className, el2.className, ..., elN.className]
     *
     * @param {Array|NodeList} arr The Array of items to pluck the value from.
     * @param {String} prop The property name to pluck from each element.
     * @return {Array} The value from each item in the Array.
     */
    pluck : function(arr, prop) {
        var ret = [];
        Ext.each(arr, function(v) {
            ret.push(v[prop]);
        });
        return ret;
    },

    /**
     * Returns the current document body as an {@link Ext.Element}.
     * @return Ext.Element The document body
     */
    getBody : function() {
        return Ext.get(document.body || false);
    },

    /**
     * Returns the current document head as an {@link Ext.Element}.
     * @return Ext.Element The document head
     */
    getHead : function() {
        var head;

        return function() {
            if (head == undefined) {
                head = Ext.get(DOC.getElementsByTagName("head")[0]);
            }

            return head;
        };
    }(),

    /**
     * Returns the current HTML document object as an {@link Ext.Element}.
     * @return Ext.Element The document
     */
    getDoc : function() {
        return Ext.get(document);
    },

    /**
     * This is shorthand reference to {@link Ext.ComponentMgr#get}.
     * Looks up an existing {@link Ext.Component Component} by {@link Ext.Component#id id}
     * @param {String} id The component {@link Ext.Component#id id}
     * @return Ext.Component The Component, <tt>undefined</tt> if not found, or <tt>null</tt> if a
     * Class was found.
    */
    getCmp : function(id) {
        return Ext.ComponentMgr.get(id);
    },

    /**
     * Returns the current orientation of the mobile device
     * @return {String} Either 'portrait' or 'landscape'
     */
    getOrientation: function() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    },

    isIterable : function(v) {
        if (!v) {
            return false;
        }
        //check for array or arguments
        if (Ext.isArray(v) || v.callee) {
            return true;
        }
        //check for node list type
        if (/NodeList|HTMLCollection/.test(Object.prototype.toString.call(v))) {
            return true;
        }

        //NodeList has an item and length property
        //IXMLDOMNodeList has nextNode method, needs to be checked first.
        return ((typeof v.nextNode != 'undefined' || v.item) && Ext.isNumber(v.length)) || false;
    },

    /**
     * Utility method for validating that a value is numeric, returning the specified default value if it is not.
     * @param {Mixed} value Should be a number, but any type will be handled appropriately
     * @param {Number} defaultValue The value to return if the original value is non-numeric
     * @return {Number} Value, if numeric, else defaultValue
     */
    num : function(v, defaultValue) {
        v = Number(Ext.isEmpty(v) || Ext.isArray(v) || typeof v == 'boolean' || (typeof v == 'string' && Ext.util.Format.trim(v).length == 0) ? NaN : v);
        return isNaN(v) ? defaultValue : v;
    },

    /**
     * <p>Returns true if the passed value is empty.</p>
     * <p>The value is deemed to be empty if it is<div class="mdetail-params"><ul>
     * <li>null</li>
     * <li>undefined</li>
     * <li>an empty array</li>
     * <li>a zero length string (Unless the <tt>allowBlank</tt> parameter is <tt>true</tt>)</li>
     * </ul></div>
     * @param {Mixed} value The value to test
     * @param {Boolean} allowBlank (optional) true to allow empty strings (defaults to false)
     * @return {Boolean}
     */
    isEmpty : function(value, allowBlank) {
        var isNull       = value == null,
            emptyArray   = (Ext.isArray(value) && !value.length),
            blankAllowed = !allowBlank ? value === '' : false;

        return isNull || emptyArray || blankAllowed;
    },

    /**
     * Returns true if the passed value is a JavaScript array, otherwise false.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isArray : function(v) {
        return Object.prototype.toString.apply(v) === '[object Array]';
    },

    /**
     * Returns true if the passed object is a JavaScript date object, otherwise false.
     * @param {Object} object The object to test
     * @return {Boolean}
     */
    isDate : function(v) {
        return Object.prototype.toString.apply(v) === '[object Date]';
    },

    /**
     * Returns true if the passed value is a JavaScript Object, otherwise false.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isObject : function(v) {
        return !!v && !v.tagName && Object.prototype.toString.call(v) === '[object Object]';
    },

    /**
     * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isPrimitive : function(v) {
        return Ext.isString(v) || Ext.isNumber(v) || Ext.isBoolean(v);
    },

    /**
     * Returns true if the passed value is a JavaScript Function, otherwise false.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isFunction : function(v) {
        return Object.prototype.toString.apply(v) === '[object Function]';
    },

    /**
     * Returns true if the passed value is a number. Returns false for non-finite numbers.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isNumber : function(v) {
        return Object.prototype.toString.apply(v) === '[object Number]' && isFinite(v);
    },

    /**
     * Returns true if the passed value is a string.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isString : function(v) {
        return typeof v === 'string';
    },

    /**util
     * Returns true if the passed value is a boolean.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isBoolean : function(v) {
        return Object.prototype.toString.apply(v) === '[object Boolean]';
    },

    /**
     * Returns true if the passed value is an HTMLElement
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isElement : function(v) {
        return v ? !!v.tagName : false;
    },

    /**
     * Returns true if the passed value is not undefined.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isDefined : function(v){
        return typeof v !== 'undefined';
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
    /**
     * Attempts to destroy any objects passed to it by removing all event listeners, removing them from the
     * DOM (if applicable) and calling their destroy functions (if available).  This method is primarily
     * intended for arguments of type {@link Ext.Element} and {@link Ext.Component}, but any subclass of
     * {@link Ext.util.Observable} can be passed in.  Any number of elements and/or components can be
     * passed into this function in a single call as separate arguments.
     * @param {Mixed} arg1 An {@link Ext.Element}, {@link Ext.Component}, or an Array of either of these to destroy
     * @param {Mixed} arg2 (optional)
     * @param {Mixed} etc... (optional)
     */
    destroy : function() {
        var ln = arguments.length,
            i, arg;

        for (i = 0; i < ln; i++) {
            arg = arguments[i];
            if (arg) {
                if (Ext.isArray(arg)) {
                    this.destroy.apply(this, arg);
                }
                else if (Ext.isFunction(arg.destroy)) {
                    arg.destroy();
                }
                else if (arg.dom) {
                    arg.remove();
                }
            }
        }
    }
});

/**
 * URL to a blank file used by Ext when in secure mode for iframe src and onReady src to prevent
 * the IE insecure content warning (<tt>'about:blank'</tt>, except for IE in secure mode, which is <tt>'javascript:""'</tt>).
 * @type String
 */
Ext.SSL_SECURE_URL = Ext.isSecure && 'about:blank';

Ext.ns = Ext.namespace;

Ext.ns(
    'Ext.util',
    'Ext.data',
    'Ext.list',
    'Ext.form',
    'Ext.menu',
    'Ext.state',
    'Ext.layout',
    'Ext.app',
    'Ext.ux',
    'Ext.plugins',
    'Ext.direct',
    'Ext.lib',
    'Ext.gesture'
);
