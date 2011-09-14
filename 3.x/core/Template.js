/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
/**
* @class Ext.Template
* 将一段Html片段呈现为模板。可将模板编译以获取更高的性能。
* 针对格式化的函数的可用列表,请参阅{@link Ext.util.Format}.<br />
* 用法：
<pre><code>
var t = new Ext.Template(
    '&lt;div name="{id}"&gt;',
        '&lt;span class="{cls}"&gt;{name:trim} {value:ellipsis(10)}&lt;/span&gt;',
    '&lt;/div&gt;'
);
t.append('some-element', {id: 'myid', cls: 'myclass', name: 'foo', value: 'bar'});
</code></pre>
* @constructor
* @param {String/Array} html HTML片断或是片断的数组(用于join(''))或多个参数(会执行join(''))。
*/
Ext.Template = function(html){
    var a = arguments;
    if(html instanceof Array){
        html = html.join("");
    }else if(a.length > 1){
        var buf = [];
        for(var i = 0, len = a.length; i < len; i++){
            if(typeof a[i] == 'object'){
                Ext.apply(this, a[i]);
            }else{
                buf[buf.length] = a[i];
            }
        }
        html = buf.join('');
    }
    /**@private*/
    this.html = html;
    if(this.compiled){
        this.compile();
    }
};
Ext.Template.prototype = {
    /**
     * 返回HTML片段,这块片断是由数据填充模板之后而成的。
     * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型,如{0},或是一个对象,如{foo: 'bar'}.
     * @return {String} HTML片段
     */	
    applyTemplate : function(values){
        if(this.compiled){
            return this.compiled(values);
        }
        var useF = this.disableFormats !== true;
        var fm = Ext.util.Format, tpl = this;
        var fn = function(m, name, format, args){
            if(format && useF){
                if(format.substr(0, 5) == "this."){
                    return tpl.call(format.substr(5), values[name], values);
                }else{
                    if(args){
                        // quoted values are required for strings in compiled templates,
                        // but for non compiled we need to strip them
                        // quoted reversed for jsmin
                        var re = /^\s*['"](.*)["']\s*$/;
                        args = args.split(',');
                        for(var i = 0, len = args.length; i < len; i++){
                            args[i] = args[i].replace(re, "$1");
                        }
                        args = [values[name]].concat(args);
                    }else{
                        args = [values[name]];
                    }
                    return fm[format].apply(fm, args);
                }
            }else{
                return values[name] !== undefined ? values[name] : "";
            }
        };
        return this.html.replace(this.re, fn);
    },

    /**
     * 使得某段HTML可作用模板使用,也可将其编译
     * @param {String} html
     * @param {Boolean} compile （可选的） ture表示为编译模板（默认为undefined）
     * @return {Ext.Template} this
     */
    set : function(html, compile){
        this.html = html;
        this.compiled = null;
        if(compile){
            this.compile();
        }
        return this;
    },

    /**
     * Ture表示为禁止格式化功能（默认为false）
     * @type Boolean
     */
    disableFormats : false,

    /**
    * 匹配模板变量的正则表达式。
    * @type RegExp
    * @property re
    */
    re : /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,

    /**
     * 将模板编译成内置调用函数,消除刚才的正则表达式
     * @return {Ext.Template} this
     */
    compile : function(){
        var fm = Ext.util.Format;
        var useF = this.disableFormats !== true;
        var sep = Ext.isGecko ? "+" : ",";
        var fn = function(m, name, format, args){
            if(format && useF){
                args = args ? ',' + args : "";
                if(format.substr(0, 5) != "this."){
                    format = "fm." + format + '(';
                }else{
                    format = 'this.call("'+ format.substr(5) + '", ';
                    args = ", values";
                }
            }else{
                args= ''; format = "(values['" + name + "'] == undefined ? '' : ";
            }
            return "'"+ sep + format + "values['" + name + "']" + args + ")"+sep+"'";
        };
        var body;
        // branched to use + in gecko and [].join() in others
        if(Ext.isGecko){
            body = "this.compiled = function(values){ return '" +
                   this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
                    "';};";
        }else{
            body = ["this.compiled = function(values){ return ['"];
            body.push(this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn));
            body.push("'].join('');};");
            body = body.join('');
        }
        eval(body);
        return this;
    },

    // private function used to call members
    call : function(fnName, value, allValues){
        return this[fnName](value, allValues);
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
     * 填充模板的数据,形成为一个或多个新节点，并位于el之前的位置插入。
     * @param {Mixed} el 上下文的元素
     * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型,如{0},或是一个对象,如{foo: 'bar'}.
     * @param {Boolean} returnElement （可选的）true表示为返回 Ext.Element (默认为undefined)
     * @return {HTMLElement/Ext.Element} 新节点或元素
     */
    insertBefore: function(el, values, returnElement){
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    /**
     * 填充模板的数据,形成为一个或多个新节点，并位于el之后的位置插入。
     * @param {Mixed} el 上下文的元素
     * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型,如{0},或是一个对象,如{foo: 'bar'}.
     * @param {Boolean} returnElement （可选的）true表示为返回 Ext.Element (默认为undefined)
     * @return {HTMLElement/Ext.Element} 新节点或元素
     */
    insertAfter : function(el, values, returnElement){
        return this.doInsert('afterEnd', el, values, returnElement);
    },
    
    /**
     * 填充模板的数据,形成为一个或多个新节点，并追加到e1。
     * @param {Mixed} el 上下文的元素
     * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型,如{0},或是一个对象,如{foo: 'bar'}.
     * @param {Boolean} returnElement （可选的）true表示为返回 Ext.Element (默认为undefined)
     * @return {HTMLElement/Ext.Element} 新节点或元素
     */
    append : function(el, values, returnElement){
        return this.doInsert('beforeEnd', el, values, returnElement);
    },

    doInsert : function(where, el, values, returnEl){
        el = Ext.getDom(el);
        var newNode = Ext.DomHelper.insertHtml(where, el, this.applyTemplate(values));
        return returnEl ? Ext.get(newNode, true) : newNode;
    },

    /**
     * 填充模板的数据,形成为一个或多个新节点，对el的内容进行覆盖。
     * @param {Mixed} el 正文元素
     * @param {Object/Array} values 模板填充值。该参数可以是一个数组(如果参数是数值型,如{0},或是一个对象,如{foo: 'bar'}.
     * @param {Boolean} returnElement （可选的）true表示为返回 Ext.Element（默认为undefined）
     * @return {HTMLElement/Ext.Element} 新节点或元素
     */
    overwrite : function(el, values, returnElement){
        el = Ext.getDom(el);
        el.innerHTML = this.applyTemplate(values);
        return returnElement ? Ext.get(el.firstChild, true) : el.firstChild;
    }
};
/**
 * {@link #applyTemplate}的简写方式
 * @method
 */
Ext.Template.prototype.apply = Ext.Template.prototype.applyTemplate;

/**
 * 传入一个元素的值的参数,用于创建模板,（推荐<i>display:none</i> textarea）或innerHTML.
 * @param {String/HTMLElement} DOM元素或某id
 * @param {Object} config 一个配置项对象
 * @returns {Ext.Template} 创建好的模板
 * @static
 */
Ext.Template.from = function(el, config){
    el = Ext.getDom(el);
    return new Ext.Template(el.value || el.innerHTML, config || '');
};