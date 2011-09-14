/**
 * @class Ext.Template
 * <p>Represents an HTML fragment template. Templates may be {@link #compile precompiled}
 * for greater performance.</p>
 * An instance of this class may be created by passing to the constructor either
 * a single argument, or multiple arguments:
 * <div class="mdetail-params"><ul>
 * <li><b>single argument</b> : String/Array
 * <div class="sub-desc">
 * The single argument may be either a String or an Array:<ul>
 * <li><tt>String</tt> : </li><pre><code>
var t = new Ext.Template("&lt;div>Hello {0}.&lt;/div>");
t.{@link #append}('some-element', ['foo']);
   </code></pre>
 * <li><tt>Array</tt> : </li>
 * An Array will be combined with <code>join('')</code>.
<pre><code>
var t = new Ext.Template([
    '&lt;div name="{id}"&gt;',
        '&lt;span class="{cls}"&gt;{name:trim} {value:ellipsis(10)}&lt;/span&gt;',
    '&lt;/div&gt;',
]);
t.{@link #compile}();
t.{@link #append}('some-element', {id: 'myid', cls: 'myclass', name: 'foo', value: 'bar'});
   </code></pre>
 * </ul></div></li>
 * <li><b>multiple arguments</b> : String, Object, Array, ...
 * <div class="sub-desc">
 * Multiple arguments will be combined with <code>join('')</code>.
 * <pre><code>
var t = new Ext.Template(
    '&lt;div name="{id}"&gt;',
        '&lt;span class="{cls}"&gt;{name} {value}&lt;/span&gt;',
    '&lt;/div&gt;',
    // a configuration object:
    {
        compiled: true,      // {@link #compile} immediately
    }
);
   </code></pre>
 * <p><b>Notes</b>:</p>
 * <div class="mdetail-params"><ul>
 * <li>Formatting and <code>disableFormats</code> are not applicable for Sencha Touch.</li>
 * <li>For a list of available format functions, see {@link Ext.util.Format}.</li>
 * <li><code>disableFormats</code> reduces <code>{@link #apply}</code> time
 * when no formatting is required.</li>
 * </ul></div>
 * </div></li>
 * </ul></div>
 * @param {Mixed} config
 */
Ext.Template = Ext.extend(Object, {
    constructor: function(html) {
        var me = this,
            args = arguments,
            buffer = [],
            value, i, length;
            
        me.initialConfig = {};

        if (Ext.isArray(html)) {
            html = html.join("");
        }
        else if (args.length > 1) {
            for (i = 0, length = args.length; i < length; i++) {
                value = args[i];
                if (typeof value == 'object') {
                    Ext.apply(me.initialConfig, value);
                    Ext.apply(me, value);
                } else {
                    buffer.push(value);
                }
            }
            html = buffer.join('');
        }

        // @private
        me.html = html;
        
        if (me.compiled) {
            me.compile();
        }
    },
    isTemplate: true,  
    
    /**
     * @cfg {Boolean} disableFormats Ture表示为禁止格式化功能（默认为false）。如果模板不包含转换函数，将该项设为true有助于apply()时的速度提升。true to disable format functions in the template. If the template doesn't contain format functions, setting 
     * disableFormats to true will reduce apply time (defaults to false)
     */
    disableFormats: false,
    
    re: /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,      
    /**
     * 返回HTML片段,这块片断是由数据填充模板之后而成的。
     * Returns an HTML fragment of this template with the specified values applied.
     * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型，如{0}，或是一个对象,如{foo: 'bar'}。The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @return {String} The HTML fragment
     * @hide repeat doc
     */
    applyTemplate: function(values) {
        var me = this,
            useFormat = me.disableFormats !== true,
            fm = Ext.util.Format,
            tpl = me;

        if (me.compiled) {
            return me.compiled(values);
        }
        function fn(m, name, format, args) {
            if (format && useFormat) {
                if (args) {
                    args = [values[name]].concat(new Function('return ['+ args +'];')());
                } else {
                    args = [values[name]];
                }
                if (format.substr(0, 5) == "this.") {
                    return tpl[format.substr(5)].apply(tpl, args);
                }
                else {
                    return fm[format].apply(fm, args);
                }
            }
            else {
                return values[name] !== undefined ? values[name] : "";
            }
        }
        return me.html.replace(me.re, fn);
    },


    /**
     * 使得某段HTML可作用模板使用，也可将其编译。Sets the HTML used as the template and optionally compiles it.
     * @param {String} html
     * @param {Boolean} compile （可选的） ture表示为编译模板（默认为undefined）(optional) True to compile the template (defaults to undefined)
     * @return {Ext.Template} this
     */
    set: function(html, compile) {
        var me = this;
        me.html = html;
        me.compiled = null;
        return compile ? me.compile() : me;
    },
    
    compileARe: /\\/g,
    compileBRe: /(\r\n|\n)/g,
    compileCRe: /'/g,
    /**
     * 将模板编译成内置调用函数，消除刚才的正则表达式。
     * Compiles the template into an internal function, eliminating the RegEx overhead.
     * @return {Ext.Template} this
     * @hide repeat doc
     */
    compile: function() {
        var me = this,
            fm = Ext.util.Format,
            useFormat = me.disableFormats !== true,
            body, bodyReturn;

        function fn(m, name, format, args) {
            if (format && useFormat) {
                args = args ? ',' + args: "";
                if (format.substr(0, 5) != "this.") {
                    format = "fm." + format + '(';
                }
                else {
                    format = 'this.' + format.substr(5) + '(';
                }
            }
            else {
                args = '';
                format = "(values['" + name + "'] == undefined ? '' : ";
            }
            return "'," + format + "values['" + name + "']" + args + ") ,'";
        }

        bodyReturn = me.html.replace(me.compileARe, '\\\\').replace(me.compileBRe, '\\n').replace(me.compileCRe, "\\'").replace(me.re, fn);
        body = "this.compiled = function(values){ return ['" + bodyReturn + "'].join('');};";
        eval(body);
        return me;
    },

    /**
     * 填充模板的数据,形成为一个或多个新节点，作为首个子节点插入到e1。
     * @param {Mixed} el 上下文的元素
     * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型,如{0},或是一个对象,如{foo: 'bar'}.
     * @param {Boolean} returnElement （可选的）true表示为返回 Ext.Element (默认为undefined)
     * @return {HTMLElement/Ext.Element} 新节点或元素
     */
    insertFirst: function(el, values, returnElement){
        return this.doInsert('afterBegin', el, values, returnElement);
    },
    
    
    /**
     * 填充模板的数据,形成为一个或多个新节点，作为首个子节点插入到e1。
     * Applies the supplied values to the template and inserts the new node(s) as the first child of el.
     * @param {Mixed} el 上下文的元素The context element
     * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型，如{0}，或是一个对象,如{foo: 'bar'}。The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement （可选的）true表示为返回 Ext.Element (默认为undefined)。(optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} 新节点或元素The new node or Element
     */
    insertFirst: function(el, values, returnElement) {
        return this.doInsert('afterBegin', el, values, returnElement);
    },


    /**
     * 填充模板的数据,形成为一个或多个新节点，并位于el之前的位置插入。
     * Applies the supplied values to the template and inserts the new node(s) before el.
     * @param {Mixed} el The context element
     * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型,如{0}，或是一个对象，如{foo: 'bar'}。The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement （可选的）true表示为返回 Ext.Element (默认为undefined)。(optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} 新节点或元素The new node or Element
     */
    insertBefore: function(el, values, returnElement) {
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    /**
     * 填充模板的数据,形成为一个或多个新节点，作为首个子节点插入到e1。
     * @param {Mixed} el 上下文的元素
     * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型,如{0},或是一个对象,如{foo: 'bar'}.
     * @param {Boolean} returnElement （可选的）true表示为返回 Ext.Element (默认为undefined)
     * @return {HTMLElement/Ext.Element} 新节点或元素
     */
    insertAfter: function(el, values, returnElement) {
        return this.doInsert('afterEnd', el, values, returnElement);
    },

    /**
     * Applies the supplied <code>values</code> to the template and appends
     * the new node(s) to the specified <code>el</code>.
     * <p>For example usage {@link #Template see the constructor}.</p>
     * @param {Mixed} el The context element
     * @param {Object/Array} values
     * The template values. Can be an array if the params are numeric (i.e. <code>{0}</code>)
     * or an object (i.e. <code>{foo: 'bar'}</code>).
     * @param {Boolean} returnElement (optional) true to return an Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    append: function(el, values, returnElement) {
        return this.doInsert('beforeEnd', el, values, returnElement);
    },

    doInsert: function(where, el, values, returnEl) {
        el = Ext.getDom(el);
        var newNode = Ext.DomHelper.insertHtml(where, el, this.applyTemplate(values));
        return returnEl ? Ext.get(newNode, true) : newNode;
    },

    /**
     * Applies the supplied values to the template and overwrites the content of el with the new node(s).
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    overwrite: function(el, values, returnElement) {
        el = Ext.getDom(el);
        el.innerHTML = this.applyTemplate(values);
        return returnElement ? Ext.get(el.firstChild, true) : el.firstChild;
    }
});
/**
 * Alias for {@link #applyTemplate}
 * Returns an HTML fragment of this template with the specified <code>values</code> applied.
 * @param {Object/Array} values
 * The template values. Can be an array if the params are numeric (i.e. <code>{0}</code>)
 * or an object (i.e. <code>{foo: 'bar'}</code>).
 * @return {String} The HTML fragment
 * @member Ext.Template
 * @method apply
 */
Ext.Template.prototype.apply = Ext.Template.prototype.applyTemplate;

/**
 * 传入一个元素的值的参数,用于创建模板,（推荐<i>display:none</i> textarea）或innerHTML.
 * Creates a template from the passed element's value (<i>display:none</i> textarea, preferred) or innerHTML.
 * @param {String/HTMLElement} DOM元素或某id。A DOM element or its id
 * @param {Object} config 一个配置项对象。A configuration object
 * @returns {Ext.Template} 创建好的模板。The created template
 * @static
 */

Ext.Template.from = function(el, config) {
    el = Ext.getDom(el);
    return new Ext.Template(el.value || el.innerHTML, config || '');
};
