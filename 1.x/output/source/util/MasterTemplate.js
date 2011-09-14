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
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.MasterTemplate
 * @extends Ext.Template
 * 用于包含多个子模板的父级模板.其语法是：
<pre><code>
var t = new Ext.MasterTemplate(
	'&lt;select name="{name}"&gt;',
		'&lt;tpl name="options"&gt;&lt;option value="{value:trim}"&gt;{text:ellipsis(10)}&lt;/option&gt;&lt;/tpl&gt;',
	'&lt;/select&gt;'
);
t.add('options', {value: 'foo', text: 'bar'});
// 或者是一次过加入多个元素
t.addAll('options', [
    {value: 'foo', text: 'bar'},
    {value: 'foo2', text: 'bar2'},
    {value: 'foo3', text: 'bar3'}
]);
// 然后根据相应的标签名称(name)应用模板
t.append('my-form', {name: 'my-select'});
</code></pre>
* 如果只有一个子模板的情况，可不指子模板的name属性，又或你是想用索引指向它。
 */
Ext.MasterTemplate = function(){
    Ext.MasterTemplate.superclass.constructor.apply(this, arguments);
    this.originalHtml = this.html;
    var st = {};
    var m, re = this.subTemplateRe;
    re.lastIndex = 0;
    var subIndex = 0;
    while(m = re.exec(this.html)){
        var name = m[1], content = m[2];
        st[subIndex] = {
            name: name,
            index: subIndex,
            buffer: [],
            tpl : new Ext.Template(content)
        };
        if(name){
            st[name] = st[subIndex];
        }
        st[subIndex].tpl.compile();
        st[subIndex].tpl.call = this.call.createDelegate(this);
        subIndex++;
    }
    this.subCount = subIndex;
    this.subs = st;
};
Ext.extend(Ext.MasterTemplate, Ext.Template, {
    /**
    * 匹配子模板的正则表达式
    * @type RegExp
    * @property
    */
    subTemplateRe : /<tpl(?:\sname="([\w-]+)")?>((?:.|\n)*?)<\/tpl>/gi,

    /**
     * 对子模板填充数据
     * @param {String/Number} name (可选的)子模板的名称或索引
     * @param {Array/Object} values 要被填充的值
     * @return {MasterTemplate} this
     */
     add : function(name, values){
        if(arguments.length == 1){
            values = arguments[0];
            name = 0;
        }
        var s = this.subs[name];
        s.buffer[s.buffer.length] = s.tpl.apply(values);
        return this;
    },

    /**
     * 填充所有的数据到子模板
     * @param {String/Number} name (可选的)子模板的名称或索引
     * @param {Array} values  要被填充的值，这应该是由多个对象组成的数组
     * @param {Boolean} reset (可选的)Ture表示为先对模板复位.
     * @return {MasterTemplate} this
     */
    fill : function(name, values, reset){
        var a = arguments;
        if(a.length == 1 || (a.length == 2 && typeof a[1] == "boolean")){
            values = a[0];
            name = 0;
            reset = a[1];
        }
        if(reset){
            this.reset();
        }
        for(var i = 0, len = values.length; i < len; i++){
            this.add(name, values[i]);
        }
        return this;
    },

    /**
     * 重置模板以备复用
     * @return {MasterTemplate} this
     */
     reset : function(){
        var s = this.subs;
        for(var i = 0; i < this.subCount; i++){
            s[i].buffer = [];
        }
        return this;
    },

    applyTemplate : function(values){
        var s = this.subs;
        var replaceIndex = -1;
        this.html = this.originalHtml.replace(this.subTemplateRe, function(m, name){
            return s[++replaceIndex].buffer.join("");
        });
        return Ext.MasterTemplate.superclass.applyTemplate.call(this, values);
    },

    apply : function(){
        return this.applyTemplate.apply(this, arguments);
    },

    compile : function(){return this;}
});

/**
 * Alias for fill().
 * @method
 */
Ext.MasterTemplate.prototype.addAll = Ext.MasterTemplate.prototype.fill;
 /**
 * 传入一个元素的值的参数,用于创建模板,(推荐<i>display:none</i> textarea)或innerHTML.
 * var tpl = Ext.MasterTemplate.from('element-id');
 * @param {String/HTMLElement} el
 * @param {Object} config
 * @static
 */
Ext.MasterTemplate.from = function(el, config){
    el = Ext.getDom(el);
    return new Ext.MasterTemplate(el.value || el.innerHTML, config || '');
};