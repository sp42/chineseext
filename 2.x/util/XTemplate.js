/**
* @class Ext.XTemplate
* <p>支持高级功能的模板类，
* 如自动数组输出、条件判断、子模板、基本数学运行、特殊内建的模板变量，
* 直接执行代码和更多的功能。XTemplate亦提供相应的机制整合到 {@link Ext.DataView}.
* </p>
* <p>XTemplate有些特殊的标签和内建的操作运算符，是模板创建时生成的，不属于API条目的一部分。
* 下面的例子就演示了这些特殊部分的用法。每一个例子使用的数据对象如下：</p>
* <pre><code>
var data = {
    name: 'Jack Slocum',
    title: 'Lead Developer',
    company: 'Ext JS, LLC',
    email: 'jack@extjs.com',
    address: '4 Red Bulls Drive',
    city: 'Cleveland',
    state: 'Ohio',
    zip: '44102',
    drinks: ['Red Bull', 'Coffee', 'Water'],
    kids: [{
        name: 'Sara Grace',
        age:3
    },{
        name: 'Zachary',
        age:2
    },{
        name: 'John James',
        age:0
    }]
};
</cpde></pre>
* <p>
*  配合使用标签<code>tpl</code>和操作符<code>for</code>，
* 你可自由切换<code>for<code>所指定的对象作用域，即可访问声明于模板之中对象。
* 如果这个对象是一个数组，它就会自动循环输出，不断重复<code>tpl</code>标签内的模板代码块，输出数组内的每一条内容：
* <b>自动数组输出和作用域切换。</b>
* </p>
* <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Title: {title}&lt;/p>',
    '&lt;p>Company: {company}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;p>{name}&lt;/p>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);
</code></pre>
* <p><b>在子模板的范围内访问父元素对象。</b> 
* 当正在处理子模板时，例如在循环子数组的时候，
* 可以通过<code>parent</code>对象访问父级的对象成员。
* </p>
* <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="age &gt; 1">',
            '&lt;p>{name}&lt;/p>',
            '&lt;p>Dad: {parent.name}&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);
</code></pre>
* <p><b>数组元素索引和简单匹配支持。</b> 
当正在处理数组的时候，特殊变量<code>#</code>表示当前数组索引+1（由1开始，不是0）。
* 如遇到数字型的元素，模板也支持简单的数学运算符+ - * /。
* </p>
* <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="age &gt; 1">',
            '&lt;p>{#}: {name}&lt;/p>',  // <-- 每一项都加上序号
            '&lt;p>In 5 Years: {age+5}&lt;/p>',  // <-- 简单的运算
            '&lt;p>Dad: {parent.name}&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);
</code></pre>
* <p><b>自动渲染单根数组（flat arrays）。</b> 
* 单根数组（Flat arrays），指的是不包含分支对象只包含值的数组。
* 使用特殊变量<code>{.}</code>可循环输出这类型的数组：
* </p>
* <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>{name}\'s favorite beverages:&lt;/p>',
    '&lt;tpl for="drinks">',
       '&lt;div> - {.}&lt;/div>',
    '&lt;/tpl>'
);
tpl.overwrite(panel.body, data);
</code></pre>
* <p><b>基本的条件逻辑判断</b>
* 配合标签<coed>tpl</code>和操作符<code>if</code>的使用，可为你执行条件判断，以决定模板的哪一部分需要被渲染出来。
* 注意这没有<code>else</code>的操作符－－如需要，就要写两个逻辑相反的<code>if</code>的语句。
* 属性项要记得进行编码，好像下面的例子：</p>
* <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="age &amp;gt; 1">',  // <-- 注意&gt;要被编码
            '&lt;p>{name}&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);
</code></pre>
* <p><b>即时执行任意的代码</b> <br/>
* 在XTemplate中，{[ ... ]}范围内的内容会在模板作用域的范围下执行。这里有一些特殊的变量：
* <ul>
* <li><b><tt>values</tt></b>：当前作用域下的值。若想改变其中的<tt>值</tt>，你可以切换子模板的作用域。</li>
* <li><b><tt>parent</tt></b>：父级模板的对象</li>
* <li><b><tt>xindex</tt></b>：若是循环模板，这是当前循环的索引index（从1开始）。</li>
* <li><b><tt>xcount</tt></b>：若是循环模板，这是循环的次数。</li>
* <li><b><tt>fm</tt></b>：<tt>Ext.util.Format</tt>的简写方式。</li>
* </ul>
* 这是一个例子说明怎么利用这个知识点生成交错行：
</p>
* <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Company: {[company.toUpperCase() + ', ' + title]}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
       '&lt;div class="{[xindex % 2 === 0 ? "even" : "odd"]}">,
        '{name}',
        '&lt;/div>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);
</code></pre>
* <p><b>模板成员函数。</b> 对于一些复制的处理，
* 可以配置项对象的方式传入一个或一个以上的成员函数到XTemplate构造器中：</p>
* <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="this.isGirl(name)">',
            '&lt;p>Girl: {name} - {age}&lt;/p>',
        '&lt;/tpl>',
        '&lt;tpl if="this.isGirl(name) == false">',
            '&lt;p>Boy: {name} - {age}&lt;/p>',
        '&lt;/tpl>',
        '&lt;tpl if="this.isBaby(age)">',
            '&lt;p>{name} is a baby!&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>', {
     isGirl: function(name){
         return name == 'Sara Grace';
     },
     isBaby: function(age){
        return age < 1;
     }
});
tpl.overwrite(panel.body, data);
</code></pre>
* @constructor
* @param {String/Array/Object} parts HTML判断或片断组成的数组，或多个参数然后执行join("")。
*/
Ext.XTemplate = function(){
    Ext.XTemplate.superclass.constructor.apply(this, arguments);
    var s = this.html;

    s = ['<tpl>', s, '</tpl>'].join('');

    var re = /<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/;

    var nameRe = /^<tpl\b[^>]*?for="(.*?)"/;
    var ifRe = /^<tpl\b[^>]*?if="(.*?)"/;
    var execRe = /^<tpl\b[^>]*?exec="(.*?)"/;
    var m, id = 0;
    var tpls = [];

    while(m = s.match(re)){
       var m2 = m[0].match(nameRe);
       var m3 = m[0].match(ifRe);
       var m4 = m[0].match(execRe);
       var exp = null, fn = null, exec = null;
       var name = m2 && m2[1] ? m2[1] : '';
       if(m3){
           exp = m3 && m3[1] ? m3[1] : null;
           if(exp){
               fn = new Function('values', 'parent', 'xindex', 'xcount', 'with(values){ return '+(Ext.util.Format.htmlDecode(exp))+'; }');
           }
       }
       if(m4){
           exp = m4 && m4[1] ? m4[1] : null;
           if(exp){
               exec = new Function('values', 'parent', 'xindex', 'xcount', 'with(values){ '+(Ext.util.Format.htmlDecode(exp))+'; }');
           }
       }
       if(name){
           switch(name){
               case '.': name = new Function('values', 'parent', 'with(values){ return values; }'); break;
               case '..': name = new Function('values', 'parent', 'with(values){ return parent; }'); break;
               default: name = new Function('values', 'parent', 'with(values){ return '+name+'; }');
           }
       }
       tpls.push({
            id: id,
            target: name,
            exec: exec,
            test: fn,
            body: m[1]||''
        });
       s = s.replace(m[0], '{xtpl'+ id + '}');
       ++id;
    }
    for(var i = tpls.length-1; i >= 0; --i){
        this.compileTpl(tpls[i]);
    }
    this.master = tpls[tpls.length-1];
    this.tpls = tpls;
};
Ext.extend(Ext.XTemplate, Ext.Template, {
    // private
    re : /\{([\w-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\\]\s?[\d\.\+\-\*\\\(\)]+)?\}/g,
    // private
    codeRe : /\{\[((?:\\\]|.|\n)*?)\]\}/g,

    // private
    applySubTemplate : function(id, values, parent, xindex, xcount){
        var t = this.tpls[id];
        if(t.test && !t.test.call(this, values, parent, xindex, xcount)){
            return '';
        }
        if(t.exec && t.exec.call(this, values, parent, xindex, xcount)){
            return '';
        }
        var vs = t.target ? t.target.call(this, values, parent) : values;
        parent = t.target ? values : parent;
        if(t.target && vs instanceof Array){
            var buf = [];
            for(var i = 0, len = vs.length; i < len; i++){
                buf[buf.length] = t.compiled.call(this, vs[i], parent, i+1, len);
            }
            return buf.join('');
        }
        return t.compiled.call(this, vs, parent, xindex, xcount);
    },

    // private
    compileTpl : function(tpl){
        var fm = Ext.util.Format;
        var useF = this.disableFormats !== true;
        var sep = Ext.isGecko ? "+" : ",";
        var fn = function(m, name, format, args, math){
            if(name.substr(0, 4) == 'xtpl'){
                return "'"+ sep +'this.applySubTemplate('+name.substr(4)+', values, parent, xindex, xcount)'+sep+"'";
            }
            var v;
            if(name === '.'){
                v = 'values';
            }else if(name === '#'){
                v = 'xindex';
            }else if(name.indexOf('.') != -1){
                v = name;
            }else{
                v = "values['" + name + "']";
            }
            if(math){
                v = '(' + v + math + ')';
            }
            if(format && useF){
                args = args ? ',' + args : "";
                if(format.substr(0, 5) != "this."){
                    format = "fm." + format + '(';
                }else{
                    format = 'this.call("'+ format.substr(5) + '", ';
                    args = ", values";
                }
            }else{
                args= ''; format = "("+v+" === undefined ? '' : ";
            }
            return "'"+ sep + format + v + args + ")"+sep+"'";
        };
        var codeFn = function(m, code){
            return "'"+ sep +'('+code+')'+sep+"'";
        };

        var body;
        // branched to use + in gecko and [].join() in others
        if(Ext.isGecko){
            body = "tpl.compiled = function(values, parent, xindex, xcount){ return '" +
                   tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn) +
                    "';};";
        }else{
            body = ["tpl.compiled = function(values, parent, xindex, xcount){ return ['"];
            body.push(tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn));
            body.push("'].join('');};");
            body = body.join('');
        }
        eval(body);
        return this;
    },

    /**
     * {@link #applyTemplate}的简写方式。
     */
    apply : function(values){
        return this.master.compiled.call(this, values, {}, 1, 1);
    },

    /**
     * 返回HTML片断,这块片断是由数据填充模板之后而成的。
     * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型,如{0},或是一个对象,如{foo: 'bar'}.
     * @return {String} HTML片断
     */
    applyTemplate : function(values){
        return this.master.compiled.call(this, values, {}, 1, 1);
    },

    /**
     * 把这个模板编译为一个函数，推荐多次使用这个模板时用这个方法，以提供性能。
     * @return {Function} 编译后的函数
     */
    compile : function(){return this;}

    /**
     * @property re
     * @hide
     */
    /**
     * @property disableFormats
     * @hide
     */
    /**
     * @method set
     * @hide
     */
    
});
/**
 * 传入一个元素的值的参数,用于创建模板,（推荐<i>display:none</i> textarea）或innerHTML.
 * @param {String/HTMLElement} DOM元素或某id
 * @param {Object} config 一个配置项对象
 * @returns {Ext.Template} 创建好的模板
 * @static
 */
Ext.XTemplate.from = function(el){
    el = Ext.getDom(el);
    return new Ext.XTemplate(el.value || el.innerHTML);
};