/**
 * @class Ext.XTemplate
 * @extends Ext.Template
 * <p>支持高级功能的模板类，如：A template class that supports advanced functionality like:<div class="mdetail-params"><ul>
 * <li>自动数组输出，主模板和子模板均可用。Autofilling arrays using templates and sub-templates</li>
 * <li>利用基本的比较符进行条件判断。Conditional processing with basic comparison operators</li>
 * <li>支持基本算术运算。Basic math function support</li>
 * <li>特殊内建的模板变量。Execute arbitrary inline code with special built-in template variables</li>
 * <li>自定义成员函数。Custom member functions</li>
 * <li>XTemplate有些特殊的标签和内建的操作运算符，是模板创建时生成的，不属于API条目的一部分。
 * Many special tags and built-in operators that aren't defined as part of
 * the API, but are supported in the templates that can be created</li>
 * </ul></div></p>
 * <p>
 * 下面的例子就演示了这些特殊部分的用法。每一个例子使用的数据对象如下：
 * XTemplate provides the templating mechanism built into:<div class="mdetail-params"><ul>
 * <li>{@link Ext.DataView}</li>
 * </ul></div></p>
 *
 * The {@link Ext.Template} describes
 * the acceptable parameters to pass to the constructor. The following
 * examples demonstrate all of the supported features.</p>
 *
 * <div class="mdetail-params"><ul>
 *
 * <li><b><u>样本数据。Sample Data</u></b>
 * <div class="sub-desc">
 * <p>下面是为每一个例子所使用的数据对象。This is the data object used for reference in each code example:</p>
 * <pre><code>
var data = {
name: 'Tommy Maintz',
title: 'Lead Developer',
company: 'Ext JS, Inc',
email: 'tommy@extjs.com',
address: '5 Cups Drive',
city: 'Palo Alto',
state: 'CA',
zip: '44102',
drinks: ['Coffee', 'Soda', 'Water'],
kids: [{
        name: 'Joshua',
        age:3
    },{
        name: 'Matthew',
        age:2
    },{
        name: 'Solomon',
        age:0
}]
};
 </code></pre>
 * </div>
 * </li>
 *
 *
 * <li><b><u>Auto filling of arrays</u></b>
 * <div class="sub-desc">
 * <p>The <b><tt>tpl</tt></b> tag and the <b><tt>for</tt></b> operator are used
 * to process the provided data object:
 * <ul>
 * <li>If the value specified in <tt>for</tt> is an array, it will auto-fill,
 * repeating the template block inside the <tt>tpl</tt> tag for each item in the
 * array.</li>
 * <li>If <tt>for="."</tt> is specified, the data object provided is examined.</li>
 * <li>While processing an array, the special variable <tt>{#}</tt>
 * will provide the current array index + 1 (starts at 1, not 0).</li>
 * </ul>
 * </p>
 * <pre><code>
&lt;tpl <b>for</b>=".">...&lt;/tpl>       // loop through array at root node
&lt;tpl <b>for</b>="foo">...&lt;/tpl>     // loop through array at foo node
&lt;tpl <b>for</b>="foo.bar">...&lt;/tpl> // loop through array at foo.bar node
 </code></pre>
 * Using the sample data above:
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Kids: ',
    '&lt;tpl <b>for</b>=".">',       // process the data.kids node
        '&lt;p>{#}. {name}&lt;/p>',  // use current array index to autonumber
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data.kids); // pass the kids property of the data object
 </code></pre>
 * <p>An example illustrating how the <b><tt>for</tt></b> property can be leveraged
 * to access specified members of the provided data object to populate the template:</p>
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Title: {title}&lt;/p>',
    '&lt;p>Company: {company}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl <b>for="kids"</b>>',     // interrogate the kids property within the data
        '&lt;p>{name}&lt;/p>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);  // pass the root node of the data object
 </code></pre>
 * <p>Flat arrays that contain values (and not objects) can be auto-rendered
 * using the special <b><tt>{.}</tt></b> variable inside a loop.  This variable
 * will represent the value of the array at the current index:</p>
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>{name}\&#39;s favorite beverages:&lt;/p>',
    '&lt;tpl for="drinks">',
        '&lt;div> - {.}&lt;/div>',
    '&lt;/tpl>'
);
tpl.overwrite(panel.body, data);
 </code></pre>
 * <p>When processing a sub-template, for example while looping through a child array,
 * you can access the parent object's members via the <b><tt>parent</tt></b> object:</p>
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="age &amp;gt; 1">',
            '&lt;p>{name}&lt;/p>',
            '&lt;p>Dad: {<b>parent</b>.name}&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);
 </code></pre>
 * </div>
 * </li>
 *
 *
 * <li><b><u>Conditional processing with basic comparison operators</u></b>
 * <div class="sub-desc">
 * <p>The <b><tt>tpl</tt></b> tag and the <b><tt>if</tt></b> operator are used
 * to provide conditional checks for deciding whether or not to render specific
 * parts of the template. Notes:<div class="sub-desc"><ul>
 * <li>Double quotes must be encoded if used within the conditional</li>
 * <li>There is no <tt>else</tt> operator &mdash; if needed, two opposite
 * <tt>if</tt> statements should be used.</li>
 * </ul></div>
 * <pre><code>
&lt;tpl if="age &gt; 1 &amp;&amp; age &lt; 10">Child&lt;/tpl>
&lt;tpl if="age >= 10 && age < 18">Teenager&lt;/tpl>
&lt;tpl <b>if</b>="this.isGirl(name)">...&lt;/tpl>
&lt;tpl <b>if</b>="id==\'download\'">...&lt;/tpl>
&lt;tpl <b>if</b>="needsIcon">&lt;img src="{icon}" class="{iconCls}"/>&lt;/tpl>
// no good:
&lt;tpl if="name == "Tommy"">Hello&lt;/tpl>
// encode &#34; if it is part of the condition, e.g.
&lt;tpl if="name == &#38;quot;Tommy&#38;quot;">Hello&lt;/tpl>
 * </code></pre>
 * Using the sample data above:
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="age &amp;gt; 1">',
            '&lt;p>{name}&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);
 </code></pre>
 * </div>
 * </li>
 *
 * <li><b><u>基本的算术。Basic math support</u></b>
 * <div class="sub-desc">
 * <p>处理数值类型的数据时候，可支持下列的数学运算符（加减乘除）： The following basic math operators may be applied directly on numeric
 * data values:</p><pre>
 * + - * /
 * </pre>
 * 举例如下：For example:
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="age &amp;gt; 1">',  // <-- 注意&gt;要被编码。Note that the &gt; is encoded
            '&lt;p>{#}: {name}&lt;/p>',  // <-- 为每一项自动排号。Auto-number each item
            '&lt;p>In 5 Years: {age+5}&lt;/p>',  // <-- 简单的计算。Basic math
            '&lt;p>Dad: {parent.name}&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);
 </code></pre>
 * </div>
 * </li>
 *
 *
 * <li><b><u>即时执行任意的代码，支持访问模板变量。Execute arbitrary inline code with special built-in template variables</u></b>
 * <div class="sub-desc">
 * <p>
 * 在XTemplate中，<code>{[ ... ]}</code>范围内的内容会在模板作用域的范围下执行。这里有一些特殊的变量：
 * Anything between <code>{[ ... ]}</code> is considered code to be executed
 * in the scope of the template. There are some special variables available in that code:
 * <ul>
 * <li><b><tt>values</tt></b>: 当前作用域下的值。若想改变其中的<tt>值</tt>，你可以切换子模板的作用域。
 * The values in the current scope. If you are using
 * scope changing sub-templates, you can change what <tt>values</tt> is.</li>
 * <li><b><tt>parent</tt></b>: 父级模板的对象。The scope (values) of the ancestor template.</li>
 * <li><b><tt>xindex</tt></b>: 若是循环模板，这是当前循环的索引index（从1-based开始）。<If you are in a looping template, the index of the
 * loop you are in (1-based).</li>
 * <li><b><tt>xcount</tt></b>: 若是循环模板，这是循环的次数。If you are in a looping template, the total length
 * of the array you are looping.</li>
 * </ul>
 * 这是一个例子说明怎么利用这个知识点生成交错行：
 * This example demonstrates basic row striping using an inline code block and the
 * <tt>xindex</tt> variable:</p>
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Company: {[values.company.toUpperCase() + ", " + values.title]}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;div class="{[xindex % 2 === 0 ? "even" : "odd"]}">',
        '{name}',
        '&lt;/div>',
    '&lt;/tpl>&lt;/p>'
 );
tpl.overwrite(panel.body, data);
 </code></pre>
 * </div>
 * </li>
 *
 * <li><b><u>模板成员函数。Template member functions</u></b>
 * <div class="sub-desc">
 * <p>
 * 对于一些复制的处理，可以配置项对象的方式传入一个或一个以上的成员函数到XTemplate构造器中：
 * One or more member functions can be specified in a configuration
 * object passed into the XTemplate constructor for more complex processing:</p>
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="this.isGirl(name)">',
            '&lt;p>Girl: {name} - {age}&lt;/p>',
        '&lt;/tpl>',
         // 使用相反的if语句来模拟“else”的逻辑过程：use opposite if statement to simulate 'else' processing:
        '&lt;tpl if="this.isGirl(name) == false">',
            '&lt;p>Boy: {name} - {age}&lt;/p>',
        '&lt;/tpl>',
        '&lt;tpl if="this.isBaby(age)">',
            '&lt;p>{name} is a baby!&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>',
    {
        // XTemplate的配置项： XTemplate configuration:
        compiled: true,
        // 成员函数：member functions:
        isGirl: function(name){
           return name == 'Sara Grace';
        },
        isBaby: function(age){
           return age < 1;
        }
    }
);
tpl.overwrite(panel.body, data);
 </code></pre>
 * </div>
 * </li>
 *
 * </ul></div>
 *
 * @param {Mixed} config
 */

Ext.XTemplate = Ext.extend(Ext.Template, {
    argsRe: /<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/,
    nameRe: /^<tpl\b[^>]*?for="(.*?)"/,
    ifRe: /^<tpl\b[^>]*?if="(.*?)"/,
    execRe: /^<tpl\b[^>]*?exec="(.*?)"/,
    constructor: function() {
        Ext.XTemplate.superclass.constructor.apply(this, arguments);

        var me = this,
            html = me.html,
            argsRe = me.argsRe,
            nameRe = me.nameRe,
            ifRe = me.ifRe,
            execRe = me.execRe,
            id = 0,
            tpls = [],
            VALUES = 'values',
            PARENT = 'parent',
            XINDEX = 'xindex',
            XCOUNT = 'xcount',
            RETURN = 'return ',
            WITHVALUES = 'with(values){ ',
            m, matchName, matchIf, matchExec, exp, fn, exec, name, i;

        html = ['<tpl>', html, '</tpl>'].join('');

        while ((m = html.match(argsRe))) {
            exp = null;
            fn = null;
            exec = null;
            matchName = m[0].match(nameRe);
            matchIf = m[0].match(ifRe);
            matchExec = m[0].match(execRe);

            exp = matchIf ? matchIf[1] : null;
            if (exp) {
                fn = new Function(VALUES, PARENT, XINDEX, XCOUNT, WITHVALUES + 'try{' + RETURN + Ext.util.Format.htmlDecode(exp) + ';}catch(e){return;}}');
            }

            exp = matchExec ? matchExec[1] : null;
            if (exp) {
                exec = new Function(VALUES, PARENT, XINDEX, XCOUNT, WITHVALUES + Ext.util.Format.htmlDecode(exp) + ';}');
            }
            
            name = matchName ? matchName[1] : null;
            if (name) {
                if (name === '.') {
                    name = VALUES;
                } else if (name === '..') {
                    name = PARENT;
                }
                name = new Function(VALUES, PARENT, 'try{' + WITHVALUES + RETURN + name + ';}}catch(e){return;}');
            }

            tpls.push({
                id: id,
                target: name,
                exec: exec,
                test: fn,
                body: m[1] || ''
            });

            html = html.replace(m[0], '{xtpl' + id + '}');
            id = id + 1;
        }

        for (i = tpls.length - 1; i >= 0; --i) {
            me.compileTpl(tpls[i]);
        }
        me.master = tpls[tpls.length - 1];
        me.tpls = tpls;
    },

    // @private
    applySubTemplate: function(id, values, parent, xindex, xcount) {
        var me = this, t = me.tpls[id];
        return t.compiled.call(me, values, parent, xindex, xcount);
    },
    /**
     * @cfg {RegExp} codeRe 用来捕获模板变量的正则表达式（默认格式是<tt>{[expression]}</tt>）。
     * The regular expression used to match code variables (default: matches <tt>{[expression]}</tt>).
     */
    codeRe: /\{\[((?:\\\]|.|\n)*?)\]\}/g,

    re: /\{([\w-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\/]\s?[\d\.\+\-\*\/\(\)]+)?\}/g,

    // @private
    compileTpl: function(tpl) {
        var fm = Ext.util.Format,
            me = this,
            useFormat = me.disableFormats !== true,
            body, bodyReturn, evaluatedFn;

        function fn(m, name, format, args, math) {
            var v;
            // name is what is inside the {}
            // Name begins with xtpl, use a Sub Template
            if (name.substr(0, 4) == 'xtpl') {
                return "',this.applySubTemplate(" + name.substr(4) + ", values, parent, xindex, xcount),'";
            }
            // name = "." - Just use the values object.
            if (name == '.') {
                v = 'typeof values == "string" ? values : ""';
            }

            // name = "#" - Use the xindex
            else if (name == '#') {
                v = 'xindex';
            }
            else if (name.substr(0, 7) == "parent.") {
                v = name;
            }
            // name has a . in it - Use object literal notation, starting from values
            else if (name.indexOf('.') != -1) {
                v = "values." + name;
            }

            // name is a property of values
            else {
                v = "values['" + name + "']";
            }
            if (math) {
                v = '(' + v + math + ')';
            }
            if (format && useFormat) {
                args = args ? ',' + args : "";
                if (format.substr(0, 5) != "this.") {
                    format = "fm." + format + '(';
                }
                else {
                    format = 'this.' + format.substr(5) + '(';
                }
            }
            else {
                args = '';
                format = "(" + v + " === undefined ? '' : ";
            }
            return "'," + format + v + args + "),'";
        }

        function codeFn(m, code) {
            // Single quotes get escaped when the template is compiled, however we want to undo this when running code.
            return "',(" + code.replace(me.compileARe, "'") + "),'";
        }
        
        bodyReturn = tpl.body.replace(me.compileBRe, '\\n').replace(me.compileCRe, "\\'").replace(me.re, fn).replace(me.codeRe, codeFn);
        body = "evaluatedFn = function(values, parent, xindex, xcount){return ['" + bodyReturn + "'].join('');};";
        eval(body);
                        
        tpl.compiled = function(values, parent, xindex, xcount) {
            var vs, 
                length,
                buffer,
                i;
                
            if (tpl.test && !tpl.test.call(me, values, parent, xindex, xcount)) {
                return '';
            } 
                           
            vs = tpl.target ? tpl.target.call(me, values, parent) : values;
            if (!vs) {
               return '';
            }
   
            parent = tpl.target ? values : parent;
            if (tpl.target && Ext.isArray(vs)) {
                buffer = [], length = vs.length;
                if (tpl.exec) {
                    for (i = 0; i < length; i++) {
                        buffer[buffer.length] = evaluatedFn.call(me, vs[i], parent, i + 1, length);
                        tpl.exec.call(me, vs[i], parent, i + 1, length);
                    }
                } else {
                    for (i = 0; i < length; i++) {
                        buffer[buffer.length] = evaluatedFn.call(me, vs[i], parent, i + 1, length);
                    }
                }
                return buffer.join('');
            }
                
            if (tpl.exec) {
                tpl.exec.call(me, vs, parent, xindex, xcount);
            }
            return evaluatedFn.call(me, vs, parent, xindex, xcount);
        }
                
        return this;
    },

  
    /**
     * 返回HTML片断,这块片断是由数据填充模板之后而成的。
     * Returns an HTML fragment of this template with the specified values applied.
     * @param {Object} values 模板填充值。该参数可以是一个数组(如果参数是数值型，如{0}，或是一个对象,如{foo: 'bar'}.The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @return {String} HTML片断。The HTML fragment
     */
    applyTemplate: function(values) {
        return this.master.compiled.call(this, values, {}, 1, 1);
    },

    /**
     * 把这个模板编译为一个函数，推荐多次使用这个模板时用这个方法，以提高性能。
     * Compile the template to a function for optimized performance.  Recommended if the template will be used frequently.
     * @return {Function} 编译后的函数。The compiled function
     */
    compile: function() {
        return this;
    }
});

/**
 * {@link #applyTemplate}的简写方式。
 * 返回HTML片断,这块片断是由数据填充模板之后而成的。
 * Returns an HTML fragment of this template with the specified values applied.
 * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型，如{0}，或是一个对象,如{foo: 'bar'}.The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
 * @return {String} HTML片断。The HTML fragment
 * @member Ext.XTemplate
 * @method apply
 */
Ext.XTemplate.prototype.apply = Ext.XTemplate.prototype.applyTemplate;

/**
 * 从某个元素的value或innerHTML中创建模板（推荐<i>display:none</i> textarea元素）。
 * Creates a template from the passed element's value (<i>display:none</i> textarea, preferred) or innerHTML.
 * @param {String/HTMLElement} el DOM元素或其id。A DOM element or its id
 * @return {Ext.Template} 模板对象。The created Template.
 * @static
 */
Ext.XTemplate.from = function(el, config) {
    el = Ext.getDom(el);
    return new Ext.XTemplate(el.value || el.innerHTML, config || {});
};

