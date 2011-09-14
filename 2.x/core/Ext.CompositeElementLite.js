/**
 * @class Ext.CompositeElementLite
 * @extends Ext.CompositeElement
 * 享元的组合类（Flyweight composite class）。为相同的元素操作可复用Ext.Element
 <pre><code>

 var els = Ext.select("#some-el div.some-class");
 // 或者是从现有的元素直接选择
 var el = Ext.get('some-el');
 el.select('div.some-class');

 els.setWidth(100); // 所有的元素变为宽度100
 els.hide(true); // 所有的元素渐隐
 // 或
 els.setWidth(100).hide(true);
 </code></pre><br><br>
 * <b>注意：尽管未全部罗列，该类支持全部Ext.Element的set/update方法。
 * 集合里面的全部元素都会执行全体的Ext.Element动作。</b>
 */
Ext.CompositeElementLite = function(els){
    Ext.CompositeElementLite.superclass.constructor.call(this, els);
    this.el = new Ext.Element.Flyweight();
};
Ext.extend(Ext.CompositeElementLite, Ext.CompositeElement, {
    addElements : function(els){
        if(els){
            if(els instanceof Array){
                this.elements = this.elements.concat(els);
            }else{
                var yels = this.elements;
                var index = yels.length-1;
                for(var i = 0, len = els.length; i < len; i++) {
                    yels[++index] = els[i];
                }
            }
        }
        return this;
    },
    invoke : function(fn, args){
        var els = this.elements;
        var el = this.el;
        for(var i = 0, len = els.length; i < len; i++) {
            el.dom = els[i];
        	Ext.Element.prototype[fn].apply(el, args);
        }
        return this;
    },
    /**
     * 根据指定的索引，返回DOM元素对象的享元元素
     * @param {Number} index
     * @return {Ext.Element}
     */
    item : function(index){
        if(!this.elements[index]){
            return null;
        }
        this.el.dom = this.elements[index];
        return this.el;
    },

     // 修正享元的作用域
    addListener : function(eventName, handler, scope, opt){
        var els = this.elements;
        for(var i = 0, len = els.length; i < len; i++) {
            Ext.EventManager.on(els[i], eventName, handler, scope || els[i], opt);
        }
        return this;
    },

	/**
	* 传入一个Function类型的参数，在该composite中每个元素中执行Function（带参数el, this, index）。
	* <b>传入的元素是享元（共享的）Ext.Element实例，所以你需要引用dom节点的话，使用el.dom。</b>
	* @param {Function} fn 要调用的函数
	* @param {Object} scope （可选的） <i>this</i> 指向的对象（默认为element）
	* @return {CompositeElement} this
	*/
    each : function(fn, scope){
        var els = this.elements;
        var el = this.el;
        for(var i = 0, len = els.length; i < len; i++){
            el.dom = els[i];
        	if(fn.call(scope || el, el, this, i) === false){
                break;
            }
        }
        return this;
    },

    indexOf : function(el){
        return this.elements.indexOf(Ext.getDom(el));
    },

    replaceElement : function(el, replacement, domReplace){
        var index = typeof el == 'number' ? el : this.indexOf(el);
        if(index !== -1){
            replacement = Ext.getDom(replacement);
            if(domReplace){
                var d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Ext.removeNode(d);
            }
            this.elements.splice(index, 1, replacement);
        }
        return this;
    }
});
Ext.CompositeElementLite.prototype.on = Ext.CompositeElementLite.prototype.addListener;
if(Ext.DomQuery){
    Ext.Element.selectorFunction = Ext.DomQuery.select;
}

Ext.Element.select = function(selector, unique, root){
    var els;
    if(typeof selector == "string"){
        els = Ext.Element.selectorFunction(selector, root);
    }else if(selector.length !== undefined){
        els = selector;
    }else{
        throw "Invalid selector";
    }
    if(unique === true){
        return new Ext.CompositeElement(els);
    }else{
        return new Ext.CompositeElementLite(els);
    }
};

/**
 * 传入一个CSS选择符的参数，基于该选择符选取多个元素合成为一个元素，以看待单个元素的方式工作。
 * @param {String/Array} selector CSS选择符或元素数组
 * @param {Boolean} unique True表示为为每个子元素创建唯一的 Ext.Element（默认为false，享元的普通对象flyweight object）
 * @param {HTMLElement/String} root （可选的）查询时的根元素或元素的id
 * @return {CompositeElementLite/CompositeElement}
 * @member Ext
 * @method select
 */
Ext.select = Ext.Element.select;