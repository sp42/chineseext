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
 * @class Ext.CompositeElement
 * 标准的复合类（composite class）。为集合中每个元素创建一个Ext.Element。
 * <br><br>
 * <b>注意：尽管未全部罗列，该类支持全部Ext.Element的set/update方法。
 * 集合里面的全部元素都会执行所有的Ext.Element动作。</b>
 * <br><br>
 * 所有的方法都返回<i>this</i>所以可写成链式的语法。
 <pre><code>
 var els = Ext.select("#some-el div.some-class", true);
 //或者是从现有的元素直接选择
 var el = Ext.get('some-el');
 el.select('div.some-class', true);

 els.setWidth(100); // 所有的元素变为宽度100
 els.hide(true); // 所有的元素渐隐。
 // 或
 els.setWidth(100).hide(true);
 </code></pre>
 */
Ext.CompositeElement = function(els){
    this.elements = [];
    this.addElements(els);
};
Ext.CompositeElement.prototype = {
    isComposite: true,
    addElements : function(els){
        if(!els) return this;
        if(typeof els == "string"){
            els = Ext.Element.selectorFunction(els);
        }
        var yels = this.elements;
        var index = yels.length-1;
        for(var i = 0, len = els.length; i < len; i++) {
        	yels[++index] = Ext.get(els[i]);
        }
        return this;
    },

    /**
    * 清除该composite，将传入一个选择符的元素加入到composite中。
    * @param {String/Array} els CSS选择符，一个或多个元素组成的数组
    * @return {CompositeElement} this
    */
    fill : function(els){
        this.elements = [];
        this.add(els);
        return this;
    },

    /**
    * 传入一个选择符的参数,若匹配成功，则保存到该composite，其它的就会被过滤
    * @param {String} selector CSS选择符字符串
    * @return {CompositeElement} this
    */
    filter : function(selector){
        var els = [];
        this.each(function(el){
            if(el.is(selector)){
                els[els.length] = el.dom;
            }
        });
        this.fill(els);
        return this;
    },

    invoke : function(fn, args){
        var els = this.elements;
        for(var i = 0, len = els.length; i < len; i++) {
        	Ext.Element.prototype[fn].apply(els[i], args);
        }
        return this;
    },
    /**
    * 加入元素到这个composite.
    * @param {String/Array} els CSS选择符，一个或多个元素组成的数组
    * @return {CompositeElement} this
    */
    add : function(els){
        if(typeof els == "string"){
            this.addElements(Ext.Element.selectorFunction(els));
        }else if(els.length !== undefined){
            this.addElements(els);
        }else{
            this.addElements([els]);
        }
        return this;
    },
    /**
    * 传入一个Function类型的参数，在这个composite中每个元素中执行Function（带参数el, this, index）。
    * @param {Function} fn 要调用的函数
    * @param {Object} scope (可选的) <i>this</i> 指向的对象（默认为element）
    * @return {CompositeElement} this
    */
    each : function(fn, scope){
        var els = this.elements;
        for(var i = 0, len = els.length; i < len; i++){
            if(fn.call(scope || els[i], els[i], this, i) === false) {
                break;
            }
        }
        return this;
    },

    /**
     * 根据指定的索引返回元素对象
     * @param {Number} index
     * @return {Ext.Element}
     */
    item : function(index){
        return this.elements[index] || null;
    },

    /**
     * 返回第一个元素
     * @return {Ext.Element}
     */
    first : function(){
        return this.item(0);
    },

    /**
     * 返回最后的元素
     * @return {Ext.Element}
     */
    last : function(){
        return this.item(this.elements.length-1);
    },

    /**
     * 返回该composite的元素的总数
     * @return Number
     */
    getCount : function(){
        return this.elements.length;
    },

    /**
     * 传入一个元素的参数，如果该composite里面有的话返回true
     * @return Boolean
     */
    contains : function(el){
        return this.indexOf(el) !== -1;
    },

    /**
     * 传入一个元素的参数，返回元素第一次出现的位置。
     * @return Boolean
     */
    indexOf : function(el){
        return this.elements.indexOf(Ext.get(el));
    },


    /**
    * 移除指定的元素。
    * @param {Mixed} el 元素的ID，或是元素本身,也可以是该composite中的元素索引（Number类型），或是以上类型组成的数组。
    * @param {Boolean} removeDom （可选的） True表示为DOM文档中的元素一并删除
    * @return {CompositeElement} this
    */
    removeElement : function(el, removeDom){
        if(el instanceof Array){
            for(var i = 0, len = el.length; i < len; i++){
                this.removeElement(el[i]);
            }
            return this;
        }
        var index = typeof el == 'number' ? el : this.indexOf(el);
        if(index !== -1 && this.elements[index]){
            if(removeDom){
                var d = this.elements[index];
                if(d.dom){
                    d.remove();
                }else{
                    Ext.removeNode(d);
                }
            }
            this.elements.splice(index, 1);
        }
        return this;
    },

    /**
    * 传入一个元素，替换指定的元素。
    * @param {Mixed} el 元素的ID，或是元素本身,也可以是该composite中的元素索引（Number类型），或是以上类型组成的数组。
    * @param {String/HTMLElement/Element} replacement 元素的ID，或是元素本身
    * @param {Boolean} removeDom （可选的） True表示为DOM文档中的元素一并删除
    * @return {CompositeElement} this
    */
    replaceElement : function(el, replacement, domReplace){
        var index = typeof el == 'number' ? el : this.indexOf(el);
        if(index !== -1){
            if(domReplace){
                this.elements[index].replaceWith(replacement);
            }else{
                this.elements.splice(index, 1, Ext.get(replacement))
            }
        }
        return this;
    },

    /**
     * 移除所有元素。
     */
    clear : function(){
        this.elements = [];
    }
};
(function(){
Ext.CompositeElement.createCall = function(proto, fnName){
    if(!proto[fnName]){
        proto[fnName] = function(){
            return this.invoke(fnName, arguments);
        };
    }
};
for(var fnName in Ext.Element.prototype){
    if(typeof Ext.Element.prototype[fnName] == "function"){
        Ext.CompositeElement.createCall(Ext.CompositeElement.prototype, fnName);
    }
};
})();