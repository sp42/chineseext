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
/**
 * @class Ext.Element
 * 表示着DOM里面的一个元素。Represents an Element in the DOM.<br><br>
 * 用法：Usage:<br>
<pre><code>
// 通过id获取
var el = Ext.get("my-div");

// 通过DOM元素引用by DOM element reference
var el = Ext.get(myDivElement);
</code></pre>
 * <b>动画Animations</b><br />
 * 操作DOM元素，很多情况下会用一些到动画效果（可选的）。
 * 动画选项应该是布尔值（true）或是动画的配置项对象（以Object Literal形式）。
 * 注意要产生动画效果必须依赖{@link Ext.Fx}的包方可正确调用功能。动画的可选项有：
 * Many of the functions for manipulating an element have an optional "animate" parameter. The animate parameter
 * should either be a boolean (true) or an object literal with animation options. Note that the supported Element animation
 * options are a subset of the {@link Ext.Fx} animation options specific to Fx effects.  The Element animation options are:
<pre>
可选项Option默认值Default 描述Description
--------- --------  ---------------------------------------------
duration  .35       动画持续的时间（单位：秒）。The duration of the animation in seconds
easing    easeOut   退却（收尾）的方法。The easing method
callback  none      动画完成之后执行的函数。A function to execute when the anim completes
scope     this      回调函数的作用域。The scope (this) of the callback function
</pre>
* 另外，可通过配置项中的“anim”来获取动画对象，这样便可停止或操控这个动画效果。例子如下：
* Also, the Anim object being used for the animation will be set on your options object as "anim", which allows you to stop or
* manipulate the animation. Here's an example:
<pre><code>
var el = Ext.get("my-div");

// 没有动画no animation
el.setWidth(100);

// 默认动画default animation
el.setWidth(100, true);

// 对动画的一些设置animation with some options set
el.setWidth(100, {
    duration: 1,
    callback: this.foo,
    scope: this
});

// 使用属性“anim”来获取动画对象using the "anim" property to get the Anim object
var opt = {
    duration: 1,
    callback: this.foo,
    scope: this
};
el.setWidth(100, opt);
...
if(opt.anim.isAnimated()){
    opt.anim.stop();
}
</code></pre>
* <b>组合（集合的）元素Composite (Collections of) Elements</b><br />
 * 要处理一组的元素，请参阅{@link Ext.CompositeElement}。
 * For working with collections of Elements, see {@link Ext.CompositeElement}
 * @constructor 直接创建新元素对象。Create a new Element directly.
 * @param {String/HTMLElement} element
 * @param {Boolean} forceNew （可选的） 构建函数默认会检查在Cache中是否已经有这个element实例。如果有，则返回缓存中的对象。如果设置为否，则跳过缓存的验查。
 * 设置这个布尔值会中止检查（扩展这个类时较有用）。
 * (optional) By default the constructor checks to see if there is already an instance of this element in the cache and if there is it returns the same instance. This will skip that check (useful for extending this class).
 */
(function(){
var D = Ext.lib.Dom;
var E = Ext.lib.Event;
var A = Ext.lib.Anim;

// local style camelizing for speed
var propCache = {};
var camelRe = /(-[a-z])/gi;
var camelFn = function(m, a){ return a.charAt(1).toUpperCase(); };
var view = document.defaultView;

Ext.Element = function(element, forceNew){
    var dom = typeof element == "string" ?
            document.getElementById(element) : element;
    if(!dom){ // invalid id/element
        return null;
    }
    var id = dom.id;
    if(forceNew !== true && id && Ext.Element.cache[id]){ // element object already exists
        return Ext.Element.cache[id];
    }

    /**
     * DOM元素。The DOM element
     * @type HTMLElement
     */
    this.dom = dom;

    /**
     * DOM元素之ID。The DOM element ID
     * @type String
     */
    this.id = id || Ext.id(dom);
};

var El = Ext.Element;

El.prototype = {
    /**
     * 元素默认的显示模式（默认为""）。
     * The element's default display mode  (defaults to "")
     * @type String
     */
    originalDisplay : "",

    visibilityMode : 1,
    /**
     * CSS值的单位。如不指定则默认为px。
     * The default unit to append to CSS values where a unit isn't provided (defaults to px).
     * @type String
     */
    defaultUnit : "px",
    /**
     * 设置元素的可见模式。
     * 当通过调用setVisible()方法确定，可见模式（visibility mode）究竟是“可见性visibility”的还是“显示display”的。
     * Sets the element's visibility mode. When setVisible() is called it
     * will use this to determine whether to set the visibility or the display property.
     * @param  {String} visMode Element.VISIBILITY或Element.DISPLAY Element.VISIBILITY or Element.DISPLAY
     * @return {Ext.Element} this
     */
    setVisibilityMode : function(visMode){
        this.visibilityMode = visMode;
        return this;
    },
    /**
     * 调用setVisibilityMode(Element.DISPLAY)的快捷方式。
     * Convenience method for setVisibilityMode(Element.DISPLAY)
     * @param {String} display  （可选的） 当可见时显示的内容。(optional) What to set display to when visible
     * @return {Ext.Element} this
     */
    enableDisplayMode : function(display){
        this.setVisibilityMode(El.DISPLAY);
        if(typeof display != "undefined") this.originalDisplay = display;
        return this;
    },

    /**
     * 定位于此节点，以此节点为起点，向外围搜索外层的父节点，搜索条件必须符合并匹配传入的简易选择符（简易选择符形如div.some-class、span:first-child）。
     * Looks at this node and then at parent nodes for a match of the passed simple selector (e.g. div.some-class or span:first-child)
     * @param {String} selector 要进行测试的简易选择符。The simple selector to test
     * @param {Number/Mixed} maxDepth  （可选的） 搜索深度，可以为数字或元素（默认是10||document.body）。(optional) The max depth to
            search as a number or element (defaults to 10 || document.body)
     * @param {Boolean} returnEl （可选的） True表示为返回Ext.Element类型的对象，false的话返回标准DOM类型的节点(optional) True to return a Ext.Element object instead of DOM node
     * @return {HTMLElement} 匹配的DOM节点（null的话表示没有找到匹配结果）。The matching DOM node (or null if no match was found)
     */
    findParent : function(simpleSelector, maxDepth, returnEl){
        var p = this.dom, b = document.body, depth = 0, dq = Ext.DomQuery, stopEl;
        maxDepth = maxDepth || 50;
        if(typeof maxDepth != "number"){
            stopEl = Ext.getDom(maxDepth);
            maxDepth = 10;
        }
        while(p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl){
            if(dq.is(p, simpleSelector)){
                return returnEl ? Ext.get(p) : p;
            }
            depth++;
            p = p.parentNode;
        }
        return null;
    },


    /**
     * 定位于此节点的“父节点”，以此节点的“父节点”为起点，向外围搜索外层的“父父”节点，搜索条件必须符合并匹配传入的简易选择符，简易选择符形如div.some-class、span:first-child）。
     * Looks at parent nodes for a match of the passed simple selector (e.g. div.some-class or span:first-child)
     * @param {String} selector 要进行测试的简易选择符。The simple selector to test
     * @param {Number/Mixed} maxDepth （可选的） 搜索深度，可以为数字或元素（默认是10||document.body）。(optional) The max depth to
            search as a number or element (defaults to 10 || document.body)
     * @param {Boolean} returnEl （可选的） True表示为返回Ext.Element类型的对象，false的话返回标准DOM类型的节点(optional) True to return a Ext.Element object instead of DOM node
     * @return {HTMLElement} 匹配的DOM节点（null的话表示没有找到匹配结果）。The matching DOM node (or null if no match was found)
     */
    findParentNode : function(simpleSelector, maxDepth, returnEl){
        var p = Ext.fly(this.dom.parentNode, '_internal');
        return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
    },

    /**
     * 沿着DOM，向外围搜索外层的“父父”节点，搜索条件必须符合并匹配传入的简易选择符，简易选择符形如div.some-class、span:first-child）。
     * Walks up the dom looking for a parent node that matches the passed simple selector (e.g. div.some-class or span:first-child).
     * 这是一个便捷方法因此总是返回Ext.Element类型的节点。
     * This is a shortcut for findParentNode() that always returns an Ext.Element.
     * @param {String} selector 要进行测试的简易选择符。The simple selector to test
     * @param {Number/Mixed} maxDepth （可选的） 搜索深度，可以为数字或元素（默认是10||document.body）。(optional) The max depth to
            search as a number or element (defaults to 10 || document.body)
     * @return {Ext.Element} 匹配的DOM节点（null的话表示没有找到匹配结果）。The matching DOM node (or null if no match was found)
     */
    up : function(simpleSelector, maxDepth){
        return this.findParentNode(simpleSelector, maxDepth, true);
    },

    /**
     * 如果这个元素符合传入的简易选择符的条件就返回true，简易选择符形如div.some-class或span:first-child。
     * Returns true if this element matches the passed simple selector (e.g. div.some-class or span:first-child)
     * @param {String} selector 要进行测试的简易选择符。The simple selector to test
     * @return {Boolean} true表示元素匹配选择符成功，否则返回false。True if this element matches the selector, else false
     */
    is : function(simpleSelector){
        return Ext.DomQuery.is(this.dom, simpleSelector);
    },

    /**
     * 在元素上执行动画
     * Perform animation on this element.
     * @param {Object} args 动画配置项参数。The animation control args
     * @param {Float} duration （可选的） 动画持续多久（默认为 .35 秒）。(optional) How long the animation lasts in seconds (defaults to .35)
     * @param {Function} onComplete （可选的） 动画完成后调用的函数。(optional) Function to call when animation completes
     * @param {String} easing (optional) （可选的） 指定“收尾”的方法（默认为 'easeOut'）。Easing method to use (defaults to 'easeOut')
     * @param {String} animType （可选的） 默认为'run'，可以是'color'，'motion'，或'scroll'。(optional) 'run' is the default. Can also be 'color', 'motion', or 'scroll'
     * @return {Ext.Element} this
     */
    animate : function(args, duration, onComplete, easing, animType){
        this.anim(args, {duration: duration, callback: onComplete, easing: easing}, animType);
        return this;
    },

    /*
     * @private 内置动画调用Internal animation call
     */
    anim : function(args, opt, animType, defaultDur, defaultEase, cb){
        animType = animType || 'run';
        opt = opt || {};
        var anim = Ext.lib.Anim[animType](
            this.dom, args,
            (opt.duration || defaultDur) || .35,
            (opt.easing || defaultEase) || 'easeOut',
            function(){
                Ext.callback(cb, this);
                Ext.callback(opt.callback, opt.scope || this, [this, opt]);
            },
            this
        );
        opt.anim = anim;
        return anim;
    },

    // private legacy anim prep 预设的动画配置参数
    preanim : function(a, i){
        return !a[i] ? false : (typeof a[i] == "object" ? a[i]: {duration: a[i+1], callback: a[i+2], easing: a[i+3]});
    },

    /**
     * 移除无用的文本节点。
     * Removes worthless text nodes
     * @param {Boolean} forceReclean （可选的）缺省地，
     * 元素会追踪自己是否已被清除了，所以你可以不断地调用这个方法。
     * 然而，如果你需要更新元素而且需要强制清除，你可以传入true的参数。(optional) By default the element
     * keeps track if it has been cleaned already so
     * you can call this over and over. However, if you update the element and
     * need to force a reclean, you can pass true.
     */
    clean : function(forceReclean){
        if(this.isCleaned && forceReclean !== true){
            return this;
        }
        var ns = /\S/;
        var d = this.dom, n = d.firstChild, ni = -1;
 	    while(n){
 	        var nx = n.nextSibling;
 	        if(n.nodeType == 3 && !ns.test(n.nodeValue)){
 	            d.removeChild(n);
 	        }else{
 	            n.nodeIndex = ++ni;
 	        }
 	        n = nx;
 	    }
 	    this.isCleaned = true;
 	    return this;
 	},

    /**
     * 如果当前元素是传入元素的父辈级元素（ancestor)返回true。
     * Returns true if this element is an ancestor of the passed element
     * @param {HTMLElement/String} el 要检查的元素。The element to check
     * @return {Boolean} true表示这个元素是传入元素的父级元素，否则返回false。True if this element is an ancestor of el, else false
     */
    contains : function(el){
        if(!el){return false;}
        return D.isAncestor(this.dom, el.dom ? el.dom : el);
    },

    /**
     * 检查当前该元素是否都使用属性visibility和属性display来显示。
     * Checks whether the element is currently visible using both visibility and display properties.
     * @param {Boolean} deep （可选的）True表示为沿着DOM一路看父元素是否隐藏的。(optional) True to walk the dom and see if parent elements are hidden (defaults to false)
     * @return {Boolean} true表示该元素当前是可见的，否则返回false。True if the element is currently visible, else false
     */
    isVisible : function(deep) {
        var vis = !(this.getStyle("visibility") == "hidden" || this.getStyle("display") == "none");
        if(deep !== true || !vis){
            return vis;
        }
        var p = this.dom.parentNode;
        while(p && p.tagName.toLowerCase() != "body"){
            if(!Ext.fly(p, '_isVisible').isVisible()){
                return false;
            }
            p = p.parentNode;
        }
        return true;
    },

    /**
     * 传入一个CSS选择符的参数，然后依据该CSS选择符从当前元素下面，形成期待匹配子节点的集合，也就是“选择”的操作，最后以一个{@link Ext.CompositeElement}类型的组合元素的形式返回（因为id的元素唯一的，所以选择符不应是id的选择符）。
     * Creates a {@link Ext.CompositeElement} for child nodes based on the passed CSS selector (the selector should not contain an id).
     * @param {String} selector CSS选择符。The CSS selector
     * @param {Boolean} unique （可选的）true表示为为每个子元素创建唯一的Ext.Element（默认为false享元的普通对象flyweight object）。
     * (optional) True to create a unique Ext.Element for each child (defaults to false, which creates a single shared flyweight object)
     * @return {CompositeElement/CompositeElementLite} 组合元素。The composite element
     */
    select : function(selector, unique){
        return El.select(selector, unique, this.dom);
    },

    /**
     * 传入一个CSS选择符的参数，然后基于该选择符选取其子节点（因为id的元素唯一的，所以选择符不应是id的选择符）。
     * Selects child nodes based on the passed CSS selector (the selector should not contain an id).
     * @param {String} selector CSS选择符。The CSS selector
     * @return {Array} 匹配节点之数组。An array of the matched nodes
     */
    query : function(selector, unique){
        return Ext.DomQuery.select(selector, this.dom);
    },

    /**
     * 传入一个CSS选择符的参数，然后基于该选择符，不限定深度进行搜索，符合的话选取单个子节点（选择符不应有id）。
     * Selects a single child at any depth below this element based on the passed CSS selector (the selector should not contain an id).
     * @param {String} selector CSS选择符。The CSS selector
     * @param {Boolean} returnDom （可选的） True表示为返回Ext.Element类型的对象，false的话返回标准DOM类型的节点。
     * (optional) True to return the DOM node instead of Ext.Element (defaults to false)
     * @return {HTMLElement/Ext.Element} 子节点，Ext.Element类型（如returnDom = true则为DOM节点）。The child Ext.Element (or DOM node if returnDom = true)
     */
    child : function(selector, returnDom){
        var n = Ext.DomQuery.selectNode(selector, this.dom);
        return returnDom ? n : Ext.get(n);
    },

    /**
     * 传入一个CSS选择符的参数，然后基于该选择符，"直接"选取单个子节点（选择符不应有id）。
     * Selects a single *direct* child based on the passed CSS selector (the selector should not contain an id).
     * @param {String} selector The CSS selector
     * @param {Boolean} returnDom （可选的） True表示为返回Ext.Element类型的对象，false的话返回标准DOM类型的节点。
     * (optional) True to return the DOM node instead of Ext.Element (defaults to false)
     * @return {HTMLElement/Ext.Element} 子节点，Ext.Element类型。The child Ext.Element (or DOM node if returnDom = true)
     */
    down : function(selector, returnDom){
        var n = Ext.DomQuery.selectNode(" > " + selector, this.dom);
        return returnDom ? n : Ext.get(n);
    },

    /**
     * 设置元素可见性（请参阅细节）。
     * 如果visibilityMode被设置成常量Element.DISPLAY，
     * 那么它会使用display属性来隐藏元素，否则它会使用visibility。默认是使用visibility属性。
     * Sets the visibility of the element (see details). If the visibilityMode is set to Element.DISPLAY, it will use
     * the display property to hide the element, otherwise it uses visibility. The default is to hide and show using the visibility property.
     * @param {Boolean} visible 元素是否可见的。Whether the element is visible
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象。
     * (optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.Element} this
     */
     setVisible : function(visible, animate){
        if(!animate || !A){
            if(this.visibilityMode == El.DISPLAY){
                this.setDisplayed(visible);
            }else{
                this.fixDisplay();
                this.dom.style.visibility = visible ? "visible" : "hidden";
            }
        }else{
            // closure for composites
            var dom = this.dom;
            var visMode = this.visibilityMode;
            if(visible){
                this.setOpacity(.01);
                this.setVisible(true);
            }
            this.anim({opacity: { to: (visible?1:0) }},
                  this.preanim(arguments, 1),
                  null, .35, 'easeIn', function(){
                     if(!visible){
                         if(visMode == El.DISPLAY){
                             dom.style.display = "none";
                         }else{
                             dom.style.visibility = "hidden";
                         }
                         Ext.get(dom).setOpacity(1);
                     }
                 });
        }
        return this;
    },

    /**
     * 如果属性display不是"none"就返回true。
     * Returns true if display is not "none"
     * @return {Boolean}
     */
    isDisplayed : function() {
        return this.getStyle("display") != "none";
    },

    /**
     * 轮换（两种状态中转换到一个状态）元素的visibility或display，取决于visibility mode。
     * Toggles the element's visibility or display, depending on visibility mode.
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象。
     * (optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.Element} this
     */
    toggle : function(animate){
        this.setVisible(!this.isVisible(), this.preanim(arguments, 0));
        return this;
    },

    /**
     * 设置元素在样式中的display属性。如果value为true，则使用originalDisplay。
     * Sets the CSS display property. Uses originalDisplay if the specified value is a boolean true.
     * @param {Mixed} value 如果value为true，则使用originalDisplay。否则直接设置显示的字符串。
     * Boolean value to display the element using its default display, or a string to set the display directly.
     * @return {Ext.Element} this
     */
    setDisplayed : function(value) {
        if(typeof value == "boolean"){
           value = value ? this.originalDisplay : "none";
        }
        this.setStyle("display", value);
        return this;
    },

    /**
     * 使这个元素得到焦点。忽略任何已捕获的异常。
     * Tries to focus the element. Any exceptions are caught and ignored.
     * @param {Number} defer （可选的） 延时执行focus的毫秒数。(optional) Milliseconds to defer the focus
     * @return {Ext.Element} this
     */
    focus : function(defer) {
        try{
            if(typeof defer == 'number'){
                this.focus.defer(defer, this);
            }else{
                this.dom.focus();
            }
        }catch(e){}
        return this;
    },

    /**
     * 使这个元素失去焦点。忽略任何已捕获的异常。
     * Tries to blur the element. Any exceptions are caught and ignored.
     * @return {Ext.Element} this
     */
    blur : function() {
        try{
            this.dom.blur();
        }catch(e){}
        return this;
    },

    /**
     * 为元素添加设置CSS类（CSS Class）。重复出来的类会被忽略。
     * Adds one or more CSS classes to the element. Duplicate classes are automatically filtered out.
     * @param {String/Array} className 要加入的CSS类或者由各类组成的数组。The CSS class to add, or an array of classes
     * @return {Ext.Element} this
     */
    addClass : function(className){
        if(Ext.isArray(className)){
            for(var i = 0, len = className.length; i < len; i++) {
            	this.addClass(className[i]);
            }
        }else{
            if(className && !this.hasClass(className)){
                this.dom.className = this.dom.className + " " + className;
            }
        }
        return this;
    },

    /**
     * 添加一个或多个className到这个元素，并移除其所有侧边（siblings）节点上的同名样式。
     * Adds one or more CSS classes to this element and removes the same class(es) from all siblings.
     * @param {String/Array} className 要加入的className，或者是由类组成的数组。The CSS class to add, or an array of classes
     * @return {Ext.Element} this
     */
    radioClass : function(className){
        var siblings = this.dom.parentNode.childNodes;
        for(var i = 0; i < siblings.length; i++) {
        	var s = siblings[i];
        	if(s.nodeType == 1){
        	    Ext.get(s).removeClass(className);
        	}
        }
        this.addClass(className);
        return this;
    },

    /**
     * 移除元素身上一个或多个的CSS类。
     * Removes one or more CSS classes from the element.
     * @param {String/Array} className 要加入的className，或者是由类组成的数组。The CSS class to remove, or an array of classes
     * @return {Ext.Element} this
     */
    removeClass : function(className){
        if(!className || !this.dom.className){
            return this;
        }
        if(Ext.isArray(className)){
            for(var i = 0, len = className.length; i < len; i++) {
            	this.removeClass(className[i]);
            }
        }else{
            if(this.hasClass(className)){
                var re = this.classReCache[className];
                if (!re) {
                   re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', "g");
                   this.classReCache[className] = re;
                }
                this.dom.className =
                    this.dom.className.replace(re, " ");
            }
        }
        return this;
    },

    // private
    classReCache: {},

    /**
     * 轮换（Toggles，两种状态中转换到一个状态）--添加或移除指定的CSS类（如果已经存在的话便删除，否则就是新增加）。
     * Toggles the specified CSS class on this element (removes it if it already exists, otherwise adds it).
     * @param {String} className 轮换的CSS类The CSS class to toggle
     * @return {Ext.Element} this
     */
    toggleClass : function(className){
        if(this.hasClass(className)){
            this.removeClass(className);
        }else{
            this.addClass(className);
        }
        return this;
    },

    /**
     * 检查某个CSS类是否作用于这个元素身上。
     * Checks if the specified CSS class exists on this element's DOM node.
     * @param {String} className 要检查CSS类The CSS class to check for
     * @return {Boolean} true表示为类是有的，否则为falseTrue if the class exists, else false
     */
    hasClass : function(className){
        return className && (' '+this.dom.className+' ').indexOf(' '+className+' ') != -1;
    },

    /**
     * 在这个元素身上替换CSS类。如果旧的CSS名称不存在，新的就会加入。
     * Replaces a CSS class on the element with another.  If the old name does not exist, the new name will simply be added.
     * @param {String} oldClassName 要被替换之CSS类，旧的CSS类The CSS class to replace
     * @param {String} newClassName 新CSS类The replacement CSS class
     * @return {Ext.Element} this
     */
    replaceClass : function(oldClassName, newClassName){
        this.removeClass(oldClassName);
        this.addClass(newClassName);
        return this;
    },

    /**
     * 给出一些CSS属性名，得到其值。
     * 如el.getStyles('color', 'font-size', 'width')会返回
     * {'color': '#FFFFFF', 'font-size': '13px', 'width': '100px'}。
     * Returns an object with properties matching the styles requested.
     * For example, el.getStyles('color', 'font-size', 'width') might return
     * {'color': '#FFFFFF', 'font-size': '13px', 'width': '100px'}.
     * @param {String} style1 样式一A style name
     * @param {String} style2 样式二A style name
     * @param {String} etc.
     * @return {Object} 样式对象The style object
     */
    getStyles : function(){
        var a = arguments, len = a.length, r = {};
        for(var i = 0; i < len; i++){
            r[a[i]] = this.getStyle(a[i]);
        }
        return r;
    },

    /**
     * 统一化当前样式和计算样式。
     * Normalizes currentStyle and computedStyle.
     * @param {String} property 返回值的那个样式属性The style property whose value is returned.
     * @return {String} 该元素样式属性的当前值The current value of the style property for this element.
     */
    getStyle : function(){
        return view && view.getComputedStyle ?
            function(prop){
                var el = this.dom, v, cs, camel;
                if(prop == 'float'){
                    prop = "cssFloat";
                }
                if(v = el.style[prop]){
                    return v;
                }
                if(cs = view.getComputedStyle(el, "")){
                    if(!(camel = propCache[prop])){
                        camel = propCache[prop] = prop.replace(camelRe, camelFn);
                    }
                    return cs[camel];
                }
                return null;
            } :
            function(prop){
                var el = this.dom, v, cs, camel;
                if(prop == 'opacity'){
                    if(typeof el.style.filter == 'string'){
                        var m = el.style.filter.match(/alpha\(opacity=(.*)\)/i);
                        if(m){
                            var fv = parseFloat(m[1]);
                            if(!isNaN(fv)){
                                return fv ? fv / 100 : 0;
                            }
                        }
                    }
                    return 1;
                }else if(prop == 'float'){
                    prop = "styleFloat";
                }
                if(!(camel = propCache[prop])){
                    camel = propCache[prop] = prop.replace(camelRe, camelFn);
                }
                if(v = el.style[camel]){
                    return v;
                }
                if(cs = el.currentStyle){
                    return cs[camel];
                }
                return null;
            };
    }(),

    /**
     * 设置元素的样式，也可以用一个对象参数包含多个样式。
     * Wrapper for setting style properties, also takes single object parameter of multiple styles.
     * @param {String/Object} property 要设置的样式属性，或是包含多个样式的对象The style property to be set, or an object of multiple styles.
     * @param {String} value （可选的）样式属性的值，如果第一个参数是对象，则这个参数为null（不需要了）(optional) The value to apply to the given property, or null if an object was passed.
     * @return {Ext.Element} this
     */
    setStyle : function(prop, value){
        if(typeof prop == "string"){
            var camel;
            if(!(camel = propCache[prop])){
                camel = propCache[prop] = prop.replace(camelRe, camelFn);
            }
            if(camel == 'opacity') {
                this.setOpacity(value);
            }else{
                this.dom.style[camel] = value;
            }
        }else{
            for(var style in prop){
                if(typeof prop[style] != "function"){
                   this.setStyle(style, prop[style]);
                }
            }
        }
        return this;
    },

    /**
     * {@link #setStyle}的另一个版本，更能灵活地设置样式属性。
     * More flexible version of {@link #setStyle} for setting style properties.
     * @param {String/Object/Function} styles 表示样式的特定格式字符串，如“width:100px”，或是对象的形式如{width:"100px"}，或是能返回这些格式的函数。
     * A style specification string, e.g. "width:100px", or object in the form {width:"100px"}, or
     * a function which returns such a specification.
     * @return {Ext.Element} this
     */
    applyStyles : function(style){
        Ext.DomHelper.applyStyles(this.dom, style);
        return this;
    },

    /**
      * 返回元素相对于页面坐标的X位置。
      * 元素必须是属于DOM树中的一部分才拥有正确的页面坐标（display:none或未加入的elements返回false）。
      * Gets the current X position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
      * @return {Number} 元素的X位置。The X position of the element
      */
    getX : function(){
        return D.getX(this.dom);
    },

    /**
      * 返回元素相对于页面坐标的Y位置。
      * 元素必须是属于DOM树中的一部分才拥有正确的页面坐标（display:none或未加入的elements返回false）。
      * Gets the current Y position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
      * @return {Number} 元素的Y位置。The Y position of the element
      */
    getY : function(){
        return D.getY(this.dom);
    },

    /**
      * 返回元素当前页面坐标的位置。
      * 元素必须是属于DOM树中的一部分才拥有正确的页面坐标（display:none或未加入的elements返回false）。
      * Gets the current position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
      * @return {Array} 元素的XY位置。The XY position of the element
      */
    getXY : function(){
        return D.getXY(this.dom);
    },

   /**
    * 返回当前元素与送入元素的距离。
    * 这两个元素都必须是属于DOM树中的一部分才拥有正确的页面坐标（display:none或未加入的elements返回false）。
    * Returns the offsets of this element from the passed element. Both element must be part of the DOM tree and not have display:none to have page coordinates.
    * @param {Mixed} element 测距离的那个元素。The element to get the offsets from.
    * @return {Array} 页面会上两点的距离。The XY page offsets (e.g. [100, -200])
    */
    getOffsetsTo : function(el){
        var o = this.getXY();
        var e = Ext.fly(el, '_internal').getXY();
        return [o[0]-e[0],o[1]-e[1]];
    },

    /**
     * 设置元素相对于页面坐标的X位置。
     * 元素必须是属于DOM树中的一部分才拥有正确的页面坐标（display:none或未加入的elements返回false）。
     * Sets the X position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} x 元素的Y位置The X position of the element
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象(optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.Element} this
     */
    setX : function(x, animate){
        if(!animate || !A){
            D.setX(this.dom, x);
        }else{
            this.setXY([x, this.getY()], this.preanim(arguments, 1));
        }
        return this;
    },

    /**
     * 设置元素基于页面坐标的Y位置。
     * 元素必须是DOM树中的一部分才拥有页面坐标（display:none或未加入的elements会当作无效而返回false）。
     * Sets the Y position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} The Y position of the element
     * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.Element} this
     */
    setY : function(y, animate){
        if(!animate || !A){
            D.setY(this.dom, y);
        }else{
            this.setXY([this.getX(), y], this.preanim(arguments, 1));
        }
        return this;
    },

    /**
     * 直接使用CSS样式（代替{@link #setX}），设定元素的left位置。
     * Sets the element's left position directly using CSS style (instead of {@link #setX}).
     * @param {String} left CSS left属性值。The left CSS property value
     * @return {Ext.Element} this
     */
    setLeft : function(left){
        this.setStyle("left", this.addUnits(left));
        return this;
    },

    /**
     * 直接使用CSS样式（代替{@link #setY}），设定元素的top位置。
     * Sets the element's top position directly using CSS style (instead of {@link #setY}).
     * @param {String} top CSS属性top的值。The top CSS property value
     * @return {Ext.Element} this
     */
    setTop : function(top){
        this.setStyle("top", this.addUnits(top));
        return this;
    },

    /**
     * 设置元素CSS Right的样式。
     * Sets the element's CSS right style.
     * @param {String} right Bottom CSS属性值。The right CSS property value
     * @return {Ext.Element} this
     */
    setRight : function(right){
        this.setStyle("right", this.addUnits(right));
        return this;
    },

    /**
     * 设置元素CSS Bottom的样式。
     * Sets the element's CSS bottom style.
     * @param {String} bottom Bottom CSS属性值。The bottom CSS property value
     * @return {Ext.Element} this
     */
    setBottom : function(bottom){
        this.setStyle("bottom", this.addUnits(bottom));
        return this;
    },

    /**
     * 无论这个元素如何定位，设置其在页面的坐标位置，。
     * 元素必须是DOM树中的一部分才拥有页面坐标（display:none或未加入的elements会当作无效而返回false）。
     * Sets the position of the element in page coordinates, regardless of how the element is positioned.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Array} pos 对于新位置（基于页面坐标）包含X & Y [x, y]的值Contains X & Y [x, y] values for new position (coordinates are page-based)
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象(optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.Element} this
     */
    setXY : function(pos, animate){
        if(!animate || !A){
            D.setXY(this.dom, pos);
        }else{
            this.anim({points: {to: pos}}, this.preanim(arguments, 1), 'motion');
        }
        return this;
    },

    /**
     * 无论这个元素如何定位，设置其在页面的坐标位置。
     * 元素必须是DOM树中的一部分才拥有页面坐标（display:none或未加入的elements会当作无效而返回false）。
     * Sets the position of the element in page coordinates, regardless of how the element is positioned.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} x 新定位的X值（基于页面坐标）。X value for new position (coordinates are page-based)
     * @param {Number} y 新定位的Y值（基于页面坐标）。Y value for new position (coordinates are page-based)
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象。
     * (optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.Element} this
     */
    setLocation : function(x, y, animate){
        this.setXY([x, y], this.preanim(arguments, 2));
        return this;
    },

    /**
     * 无论这个元素如何定位，设置其在页面的坐标位置，。
     * 元素必须是DOM树中的一部分才拥有页面坐标（display:none或未加入的elements会当作无效而返回false）。
     * Sets the position of the element in page coordinates, regardless of how the element is positioned.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} x 新定位的X值（基于页面坐标）。X value for new position (coordinates are page-based)
     * @param {Number} y 新定位的Y值（基于页面坐标）。Y value for new position (coordinates are page-based)
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象。
     * (optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.Element} this
     */
    moveTo : function(x, y, animate){
        this.setXY([x, y], this.preanim(arguments, 2));
        return this;
    },

    /**
     * 返回当前元素的区域。元素必须是DOM树中的一部分才拥有页面坐标（display:none或未加入的elements会当作无效而返回false）。
     * Returns the region of the given element.
     * The element must be part of the DOM tree to have a region (display:none or elements not appended return false).
     * @return {Region} Ext.lib.Region包含"top, left, bottom, right"成员数据A Ext.lib.Region containing "top, left, bottom, right" member data.
     */
    getRegion : function(){
        return D.getRegion(this.dom);
    },

    /**
     * 返回元素的偏移（offset）高度。
     * Returns the offset height of the element
     * @param {Boolean} contentHeight （可选的） true表示为返回的是减去边框和内补丁（borders & padding）的宽度。
     * (optional) true to get the height minus borders and padding
     * @return {Number} The element's height
     */
    getHeight : function(contentHeight){
        var h = this.dom.offsetHeight || 0;
        h = contentHeight !== true ? h : h-this.getBorderWidth("tb")-this.getPadding("tb");
        return h < 0 ? 0 : h;
    },

    /**
     * 返回元素的偏移（offset）宽度。
     * @param {Boolean} contentWidth （可选的） true表示为返回的是减去边框和内补丁（borders & padding）的宽度。
     * (optional) true to get the width minus borders and padding
     * @return {Number} 元素宽度The element's width
     */
    getWidth : function(contentWidth){
        var w = this.dom.offsetWidth || 0;
        w = contentWidth !== true ? w : w-this.getBorderWidth("lr")-this.getPadding("lr");
        return w < 0 ? 0 : w;
    },

    /**
     * 当偏移值不可用时就模拟一个出来。该方法返回由padding或borders调整过的元素CSS高度，也可能是偏移的高度。
     * 如果不用CSS设置高度而且是display:none的元素，可能会没有。
     * @return {Number}
     */
    getComputedHeight : function(){
        var h = Math.max(this.dom.offsetHeight, this.dom.clientHeight);
        if(!h){
            h = parseInt(this.getStyle('height'), 10) || 0;
            if(!this.isBorderBox()){
                h += this.getFrameWidth('tb');
            }
        }
        return h;
    },

    /**
     * 当偏移值不可用时就模拟一个出来。该方法返回由padding或borders调整过的元素CSS宽度，也可能是偏移的宽度。
     * 如果不用CSS设置宽度而且是display:none的元素，可能会没有。
     * Returns either the offsetWidth or the width of this element based on CSS width adjusted by padding or borders
     * when needed to simulate offsetWidth when offsets aren't available. This may not work on display:none elements
     * if a width has not been set using CSS.
     * @return {Number}
     */
    getComputedWidth : function(){
        var w = Math.max(this.dom.offsetWidth, this.dom.clientWidth);
        if(!w){
            w = parseInt(this.getStyle('width'), 10) || 0;
            if(!this.isBorderBox()){
                w += this.getFrameWidth('lr');
            }
        }
        return w;
    },

    /**
     * 返回元素大小。
     * Returns the size of the element.
     * @param {Boolean} contentSize （可选的） true表示为获取的是减去border和padding的宽度大小(optional) true to get the width/size minus borders and padding
     * @return {Object} 包含元素大小尺寸的对象An object containing the element's size {width: (element width), height: (element height)}
     */
    getSize : function(contentSize){
        return {width: this.getWidth(contentSize), height: this.getHeight(contentSize)};
    },

    getStyleSize : function(){
        var w, h, d = this.dom, s = d.style;
        if(s.width && s.width != 'auto'){
            w = parseInt(s.width, 10);
            if(this.isBorderBox()){
               w -= this.getFrameWidth('lr');
            }
        }
        if(s.height && s.height != 'auto'){
            h = parseInt(s.height, 10);
            if(this.isBorderBox()){
               h -= this.getFrameWidth('tb');
            }
        }
        return {width: w || this.getWidth(true), height: h || this.getHeight(true)};

    },

    /**
     * 返回视图的高度和宽度。
     * Returns the width and height of the viewport.
     * @return {Object} 包含视图大小尺寸的对象，如{width: (viewport width), height: (viewport height)}An object containing the viewport's size {width: (viewport width), height: (viewport height)}
     */
    getViewSize : function(){
        var d = this.dom, doc = document, aw = 0, ah = 0;
        if(d == doc || d == doc.body){
            return {width : D.getViewWidth(), height: D.getViewHeight()};
        }else{
            return {
                width : d.clientWidth,
                height: d.clientHeight
            };
        }
    },

    /**
     * 返回“值的”属性值。
     * Returns the value of the "value" attribute
     * @param {Boolean} asNumber 表示为将值解析为数字。true to parse the value as a number
     * @return {String/Number}
     */
    getValue : function(asNumber){
        return asNumber ? parseInt(this.dom.value, 10) : this.dom.value;
    },

    // private
    adjustWidth : function(width){
        if(typeof width == "number"){
            if(this.autoBoxAdjust && !this.isBorderBox()){
               width -= (this.getBorderWidth("lr") + this.getPadding("lr"));
            }
            if(width < 0){
                width = 0;
            }
        }
        return width;
    },

    // private
    adjustHeight : function(height){
        if(typeof height == "number"){
           if(this.autoBoxAdjust && !this.isBorderBox()){
               height -= (this.getBorderWidth("tb") + this.getPadding("tb"));
           }
           if(height < 0){
               height = 0;
           }
        }
        return height;
    },

    /**
     * 设置元素的宽度。
     * Set the width of the element
     * @param {Number} width 新宽度。The new width
     * @param {Boolean/Object} animate  （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象。
     * (optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     */
    setWidth : function(width, animate){
        width = this.adjustWidth(width);
        if(!animate || !A){
            this.dom.style.width = this.addUnits(width);
        }else{
            this.anim({width: {to: width}}, this.preanim(arguments, 1));
        }
        return this;
    },

    /**
     * 设置元素的高度。
     * Set the height of the element
     * @param {Number} height 新高度。The new height
     * @param {Boolean/Object} animate  （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象。
     * (optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     */
     setHeight : function(height, animate){
        height = this.adjustHeight(height);
        if(!animate || !A){
            this.dom.style.height = this.addUnits(height);
        }else{
            this.anim({height: {to: height}}, this.preanim(arguments, 1));
        }
        return this;
    },

    /**
     * 设置元素的大小尺寸。如果动画选项被打开，高度和宽度都会顺带产生变化的动画效果。
     * Set the size of the element. If animation is true, both width an height will be animated concurrently.
     * @param {Number} width 新宽度The new width
     * @param {Number} height 新高度The new height
     * @param {Boolean/Object} animate  （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象(optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     */
     setSize : function(width, height, animate){
        if(typeof width == "object"){ // in case of object from getSize()
            height = width.height; width = width.width;
        }
        width = this.adjustWidth(width); height = this.adjustHeight(height);
        if(!animate || !A){
            this.dom.style.width = this.addUnits(width);
            this.dom.style.height = this.addUnits(height);
        }else{
            this.anim({width: {to: width}, height: {to: height}}, this.preanim(arguments, 2));
        }
        return this;
    },

    /**
     * 同时设置元素的位置和大小。如果动画选项被打开，高度和宽度都会顺带产生变化的动画效果。
     * Sets the element's position and size in one shot. If animation is true then width, height, x and y will be animated concurrently.
     * @param {Number} x 新位置上的x值（基于页面的坐标）X value for new position (coordinates are page-based)
     * @param {Number} y 新位置上的y值（基于页面的坐标）Y value for new position (coordinates are page-based)
     * @param {Number} width 新宽度The new width
     * @param {Number} height 新高度The new height
     * @param {Boolean/Object} animate  （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象(optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     */
    setBounds : function(x, y, width, height, animate){
        if(!animate || !A){
            this.setSize(width, height);
            this.setLocation(x, y);
        }else{
            width = this.adjustWidth(width); height = this.adjustHeight(height);
            this.anim({points: {to: [x, y]}, width: {to: width}, height: {to: height}},
                          this.preanim(arguments, 4), 'motion');
        }
        return this;
    },

    /**
     * 设置元素的位置并调整大小到指定的位置。如果动画选项被打开，高度和宽度都会顺带产生变化的动画效果。
     * Sets the element's position and size the specified region. If animation is true then width, height, x and y will be animated concurrently.
     * @param {Ext.lib.Region} region 要填充的区域The region to fill
     * @param {Boolean/Object} animate  （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象(optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     */
    setRegion : function(region, animate){
        this.setBounds(region.left, region.top, region.right-region.left, region.bottom-region.top, this.preanim(arguments, 1));
        return this;
    },

    /**
     * 加入一个事件处理函数。{@link #on}是其简写方式。
     * Appends an event handler to this element.  The shorthand version {@link #on} is equivalent.
     * @param {String} eventName 事件处理函数的名称The type of event to handle
     * @param {Function} fn 事件处理函数。该函数会送入以下的参数：The handler function the event invokes. This function is passed
     * the following parameters:<ul>
     * <li>evt : EventObject<div class="sub-desc">用于描述这次事件{@link Ext.EventObject EventObject}的事件对象The {@link Ext.EventObject EventObject} describing the event.</div></li>
     * <li>t : Element<div class="sub-desc">事件源对象，类型是{@link Ext.Element Element} The {@link Ext.Element Element} which was the target of the event.
     * 注意该项可能会选项<tt>delegate</tt>筛选而发生变化Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
     * <li>o : Object<div class="sub-desc">调用addListener时送入的选项对象The options object from the addListener call.</div></li>
     * </ul>
     * @param {Object} scope （可选的） 事件处理函数执行时所在的作用域。处理函数“this”的上下文。(optional) The scope (The <tt>this</tt> reference) of the handler function. Defaults
     * to this Element.
     * @param {Object} options （可选的） 包含句柄配置属性的一个对象。该对象可能会下来的属性：(optional) An object containing handler configuration properties.
     * This may contain any of the following properties:<ul>
     * <li>scope {Object} : 事件处理函数执行时所在的作用域。处理函数“this”的上下文环境。The scope in which to execute the handler function. The handler function's "this" context.</li>
     * <li>delegate {String} : 一个简易选择符，用于过滤目标，或是查找目标的子孙。A simple selector to filter the target or look for a descendant of the target</li>
     * <li>stopEvent {Boolean} : true表示为阻止事件。即停止传播、阻止默认动作。True to stop the event. That is stop propagation, and prevent the default action.</li>
     * <li>preventDefault {Boolean} : true表示为阻止默认动作True to prevent the default action</li>
     * <li>stopPropagation {Boolean} : true表示为阻止事件传播True to prevent event propagation</li>
     * <li>normalized {Boolean} : false表示对处理函数送入一个原始、未封装过的浏览器对象而非标准的Ext.EventObjectFalse to pass a browser event to the handler function instead of an Ext.EventObject</li>
     * <li>delay {Number} : 触发事件后处理函数延时执行的时间The number of milliseconds to delay the invocation of the handler after te event fires.</li>
     * <li>single {Boolean} : true代表为下次事件触发加入一个要处理的函数，然后再移除本身。True to add a handler to handle just the next firing of the event, and then remove itself.</li>
     * <li>buffer {Number} : 若指定一个毫秒数会把该处理函数安排到{@link Ext.util.DelayedTask}延时之后才执行。 
     * 如果事件在那个事件再次触发，则原句柄将<em>不会</em> 被启用，但是新句柄会安排在其位置。Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
     * by the specified number of milliseconds. If the event fires again within that time, the original
     * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</li>
     * </ul><br>
     * <p>
     * <b>不同配搭方式的选项Combining Options</b><br>
     * In the following examples, the shorthand form {@link #on} is used rather than the more verbose
     * addListener.  The two are equivalent. 
     * 下面的例子，使用的是{@link #on}的简写方式。和addListener是等价的。
     * 利用参数选项，可以组合成不同类型的侦听器：
     * Using the options argument, it is possible to combine different
     * types of listeners:<br>
     * <br>
     * 这个事件的含义是，已常规化的，延时的，自动停止事件并有传入一个自定义的参数（forumId）的一次性侦听器。这些事件设置在处理函数（也就是第三个的参数）中也可以找到的。
     * A normalized, delayed, one-time listener that auto stops the event and adds a custom argument (forumId) to the
     * options object. The options object is available as the third parameter in the handler function.<div style="margin: 5px 20px 20px;">
     * 代码：Code:<pre><code>
el.on('click', this.onClick, this, {
    single: true,
    delay: 100,
    stopEvent : true,
    forumId: 4
});</code></pre></p>
     * <p>
     * <b>多个处理函数一次性登记Attaching multiple handlers in 1 call</b><br>
      * 这样的话，可允许多个事件处理函数都共享一个配置事件的配置项对象。The method also allows for a single argument to be passed which is a config object containing properties
     * which specify multiple handlers.</p>
     * <p>
     * 代码：Code:<pre><code>
el.on({
    'click' : {
        fn: this.onClick,
        scope: this,
        delay: 100
    },
    'mouseover' : {
        fn: this.onMouseOver,
        scope: this
    },
    'mouseout' : {
        fn: this.onMouseOut,
        scope: this
    }
});</code></pre></p>
     * <p>
     * 或者是简写的语法：Or a shorthand syntax:<br>
     * Code:<pre><code>
el.on({
    'click' : this.onClick,
    'mouseover' : this.onMouseOver,
    'mouseout' : this.onMouseOut,
    scope: this
});</code></pre></p>
     */
    addListener : function(eventName, fn, scope, options){
        Ext.EventManager.on(this.dom,  eventName, fn, scope || this, options);
    },

    /**
     * 从这个元素上移除一个事件处理函数。{@link #un}是它的简写方式。
     * Removes an event handler from this element.  The shorthand version {@link #un} is equivalent.  Example:
     * <pre><code>
el.removeListener('click', this.handlerFn);
// 或者
el.un('click', this.handlerFn);
</code></pre>
     * @param {String} eventName 要移除的事件处理函数的名称the type of event to remove
     * @param {Function} fn 事件处理器the method the event invokes
     * @param {Object} scope （可选的）函数的作用域（默认这个元素）(optional) The scope (The <tt>this</tt> reference) of the handler function. Defaults
     * to this Element.
     * @return {Ext.Element} this
     */
    removeListener : function(eventName, fn, scope){
        Ext.EventManager.removeListener(this.dom,  eventName, fn, scope || this);
        return this;
    },

    /**
     * 在该元素身上移除所有已加入的侦听器。
     * Removes all previous added listeners from this element
     * @return {Ext.Element} this
     */
    removeAllListeners : function(){
        Ext.EventManager.removeAll(this.dom);
        return this;
    },

    /**
     * 创建此元素的事件句柄，由此元素接替另外的对象触发和处理事件。
     * Create an event handler on this element such that when the event fires and is handled by this element,
     * it will be relayed to another object (i.e., fired again as if it originated from that object instead).
     * @param {String} eventName 要接替的事件名称The type of event to relay
     * @param {Object} object 任何继承自{@link Ext.util.Observable}的对象用于在上下文里触发接替的事件Any object that extends {@link Ext.util.Observable} that will provide the context
     * for firing the relayed event
     */
    relayEvent : function(eventName, observable){
        this.on(eventName, function(e){
            observable.fireEvent(eventName, e);
        });
    },

    /**
     * 设置元素的透明度。
     * Set the opacity of the element
     * @param {Float} opacity 新的透明度。0 = 透明，.5 = 50% 可见，1 = 完全可见……The new opacity. 0 = transparent, .5 = 50% visibile, 1 = fully visible, etc
     * @param {Boolean/Object} animate  （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象(optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     */
     setOpacity : function(opacity, animate){
        if(!animate || !A){
            var s = this.dom.style;
            if(Ext.isIE){
                s.zoom = 1;
                s.filter = (s.filter || '').replace(/alpha\([^\)]*\)/gi,"") +
                           (opacity == 1 ? "" : " alpha(opacity=" + opacity * 100 + ")");
            }else{
                s.opacity = opacity;
            }
        }else{
            this.anim({opacity: {to: opacity}}, this.preanim(arguments, 1), null, .35, 'easeIn');
        }
        return this;
    },

    /**
     * 获取左边的X坐标。
     * Gets the left X coordinate
     * @param {Boolean} local True表示为获取局部CSS位置而非页面坐标。
     * True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getLeft : function(local){
        if(!local){
            return this.getX();
        }else{
            return parseInt(this.getStyle("left"), 10) || 0;
        }
    },

    /**
     * 获取元素右边的X坐标（元素X位置 + 元素宽度）。
     * Gets the right X coordinate of the element (element X position + element width)
     * @param {Boolean} local True表示为获取局部CSS位置而非页面坐标。
     * True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getRight : function(local){
        if(!local){
            return this.getX() + this.getWidth();
        }else{
            return (this.getLeft(true) + this.getWidth()) || 0;
        }
    },

    /**
     * 获取顶部Y坐标。
     * Gets the top Y coordinate
     * @param {Boolean} local True表示为获取局部CSS位置而非页面坐标。
     * True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getTop : function(local) {
        if(!local){
            return this.getY();
        }else{
            return parseInt(this.getStyle("top"), 10) || 0;
        }
    },

    /**
     * 获取元素的底部Y坐标（元素Y位置 + 元素宽度）。
     * Gets the bottom Y coordinate of the element (element Y position + element height)
     * @param {Boolean} local True表示为获取局部CSS位置而非页面坐标。
     * True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getBottom : function(local){
        if(!local){
            return this.getY() + this.getHeight();
        }else{
            return (this.getTop(true) + this.getHeight()) || 0;
        }
    },

   /**
    * 初始化元素的位置。如果未传入期待的位置，而又还没定位的话，将会设置当前元素为相对（relative）定位。
    * Initializes positioning on this element. If a desired position is not passed, it will make the
    * the element positioned relative IF it is not already positioned.
    * @param {String} pos （可选的） 使用"relative","absolute"或"fixed"的定位。(optional) Positioning to use "relative", "absolute" or "fixed"
    * @param {Number} zIndex （可选的） z-Index值。(optional) The zIndex to apply
    * @param {Number} x （可选的）设置页面X方向位置。(optional) Set the page X position
    * @param {Number} y （可选的）设置页面Y方向位置。(optional) Set the page Y position
    */
    position : function(pos, zIndex, x, y){
        if(!pos){
           if(this.getStyle('position') == 'static'){
               this.setStyle('position', 'relative');
           }
        }else{
            this.setStyle("position", pos);
        }
        if(zIndex){
            this.setStyle("z-index", zIndex);
        }
        if(x !== undefined && y !== undefined){
            this.setXY([x, y]);
        }else if(x !== undefined){
            this.setX(x);
        }else if(y !== undefined){
            this.setY(y);
        }
    },

    /**
     * 当文档加载后清除位置并复位到默认。
     * Clear positioning back to the default when the document was loaded
     * @param {String} value （可选的） 用于left,right,top,bottom的值，默认为''(空白字符串)。你可使用'auto'。
     * (optional) The value to use for the left,right,top,bottom, defaults to '' (empty string). You could use 'auto'.
     * @return {Ext.Element} this
     */
    clearPositioning : function(value){
        value = value ||'';
        this.setStyle({
            "left": value,
            "right": value,
            "top": value,
            "bottom": value,
            "z-index": "",
            "position" : "static"
        });
        return this;
    },

   /**
    * 返回一个包含CSS定位信息的对象。
    * 有用的技巧：连同setPostioning一起，可在更新执行之前，先做一个快照（snapshot），之后便可恢复该元素。
    * Gets an object with all CSS positioning properties. Useful along with setPostioning to get
    * snapshot before performing an update and then restoring the element.
    * @return {Object}
    */
    getPositioning : function(){
        var l = this.getStyle("left");
        var t = this.getStyle("top");
        return {
            "position" : this.getStyle("position"),
            "left" : l,
            "right" : l ? "" : this.getStyle("right"),
            "top" : t,
            "bottom" : t ? "" : this.getStyle("bottom"),
            "z-index" : this.getStyle("z-index")
        };
    },

    /**
     * 返回指定边（side(s)）的padding宽度。
     * Gets the width of the border(s) for the specified side(s)
     * @param {String} side 可以是t, l, r, b或是任何组合。例如，传入lr的参数会得到(l)eft padding +(r)ight padding。
     * Can be t, l, r, b or any combination of those to add multiple values. For example,
     * passing lr would get the border (l)eft width + the border (r)ight width.
     * @return {Number} 四边的padding之和。The width of the sides passed added together
     */
    getBorderWidth : function(side){
        return this.addStyles(side, El.borders);
    },

    /**
     * 获取指定方位（side(s)）的padding宽度。
     * Gets the width of the padding(s) for the specified side(s)
     * @param {String} side 可以是t, l, r, b或是任何组合，例如，传入lr的参数会得到(l)eft padding +(r)ight padding。Can be t, l, r, b or any combination of those to add multiple values. For example,
     * passing lr would get the padding (l)eft + the padding (r)ight.
     * @return {Number} 四边的padding之和The padding of the sides passed added together
     */
    getPadding : function(side){
        return this.addStyles(side, El.paddings);
    },

    /**
    * 由getPositioning()返回的对象去进行定位。
    * Set positioning with an object returned by getPositioning().
    * @param {Object} posCfg
    * @return {Ext.Element} this
     */
    setPositioning : function(pc){
        this.applyStyles(pc);
        if(pc.right == "auto"){
            this.dom.style.right = "";
        }
        if(pc.bottom == "auto"){
            this.dom.style.bottom = "";
        }
        return this;
    },

    // private
    fixDisplay : function(){
        if(this.getStyle("display") == "none"){
            this.setStyle("visibility", "hidden");
            this.setStyle("display", this.originalDisplay); // first try reverting to default
            if(this.getStyle("display") == "none"){ // if that fails, default to block
                this.setStyle("display", "block");
            }
        }
    },

    // private
	setOverflow : function(v){
    	if(v=='auto' && Ext.isMac && Ext.isGecko2){ // work around stupid FF 2.0/Mac scroll bar bug
    		this.dom.style.overflow = 'hidden';
        	(function(){this.dom.style.overflow = 'auto';}).defer(1, this);
    	}else{
    		this.dom.style.overflow = v;
    	}
	},

    /**
     * 快速设置left和top（采用默认单位）。
     * Quick set left and top adding default units
     * @param {String} left CSS的left属性值The left CSS property value
     * @param {String} top CSS的top属性值The top CSS property value
     * @return {Ext.Element} this
     */
     setLeftTop : function(left, top){
        this.dom.style.left = this.addUnits(left);
        this.dom.style.top = this.addUnits(top);
        return this;
    },

    /**
     * 移动这个元素到相对于当前的位置。
     * Move this element relative to its current position.
     * @param {String} direction 允许的值：Possible values are: "l" (or "left"), "r" (or "right"), "t" (or "top", or "up"), "b" (or "bottom", or "down").
     * @param {Number} distance 元素移动有多远（像素）How far to move the element in pixels
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象(optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     */
     move : function(direction, distance, animate){
        var xy = this.getXY();
        direction = direction.toLowerCase();
        switch(direction){
            case "l":
            case "left":
                this.moveTo(xy[0]-distance, xy[1], this.preanim(arguments, 2));
                break;
           case "r":
           case "right":
                this.moveTo(xy[0]+distance, xy[1], this.preanim(arguments, 2));
                break;
           case "t":
           case "top":
           case "up":
                this.moveTo(xy[0], xy[1]-distance, this.preanim(arguments, 2));
                break;
           case "b":
           case "bottom":
           case "down":
                this.moveTo(xy[0], xy[1]+distance, this.preanim(arguments, 2));
                break;
        }
        return this;
    },

    /**
     * 保存当前的溢出（overflow），然后进行裁剪元素的溢出部分 - 使用{@link #unclip}来移除。
     * Store the current overflow setting and clip overflow on the element - use {@link #unclip} to remove
     * @return {Ext.Element} this
     */
    clip : function(){
        if(!this.isClipped){
           this.isClipped = true;
           this.originalClip = {
               "o": this.getStyle("overflow"),
               "x": this.getStyle("overflow-x"),
               "y": this.getStyle("overflow-y")
           };
           this.setStyle("overflow", "hidden");
           this.setStyle("overflow-x", "hidden");
           this.setStyle("overflow-y", "hidden");
        }
        return this;
    },

    /**
     * 在调用clip()之前，返回原始的裁剪部分（溢出的）。
     * Return clipping (overflow) to original clipping before clip() was called
     * @return {Ext.Element} this
     */
    unclip : function(){
        if(this.isClipped){
            this.isClipped = false;
            var o = this.originalClip;
            if(o.o){this.setStyle("overflow", o.o);}
            if(o.x){this.setStyle("overflow-x", o.x);}
            if(o.y){this.setStyle("overflow-y", o.y);}
        }
        return this;
    },

    // private
    adjustForConstraints : function(xy, parent, offsets){
        return this.getConstrainToXY(parent || document, false, offsets, xy) ||  xy;
    },

    /**
     * 清除这个元素的透明度设置。IE有时候会用到。
     * Clears any opacity settings from this element. Required in some cases for IE.
     * @return {Ext.Element} this
     */
    clearOpacity : function(){
        if (window.ActiveXObject) {
            if(typeof this.dom.style.filter == 'string' && (/alpha/i).test(this.dom.style.filter)){
                this.dom.style.filter = "";
            }
        } else {
            this.dom.style.opacity = "";
            this.dom.style["-moz-opacity"] = "";
            this.dom.style["-khtml-opacity"] = "";
        }
        return this;
    },

    /**
     * 隐藏此元素-使用display mode来决定用"display"抑或"visibility"。请参阅{@link #setVisible}。
     * Hide this element - Uses display mode to determine whether to use "display" or "visibility". See {@link #setVisible}.
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象(optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     */
    hide : function(animate){
        this.setVisible(false, this.preanim(arguments, 0));
        return this;
    },

    /**
     * 显示此元素-使用display mode来决定用"display"抑或"visibility"。请参阅{@link #setVisible}。
     * Show this element - Uses display mode to determine whether to use "display" or "visibility". See {@link #setVisible}.
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象(optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     */
    show : function(animate){
        this.setVisible(true, this.preanim(arguments, 0));
        return this;
    },

    /**
     * @private Test if size has a unit, otherwise appends the default
     */
    addUnits : function(size){
        return Ext.Element.addUnits(size, this.defaultUnit);
    },

   /**
    * 更新该元素的innerHTML属性，有时遇到脚本便可以执行。
    * Update the innerHTML of this element, optionally searching for and processing scripts
    * @param {String} html 新的HTMLThe new HTML
    * @param {Boolean} loadScripts （可选的） true表示为遇到脚本要执行(optional) True to look for and process scripts (defaults to false)
    * @param {Function} callback 当更新完成后，你加载一个异步函数执行它，以得知更新完成。(optional) For async script loading you can be notified when the update completes
    * @return {Ext.Element} this
     */
    update : function(html, loadScripts, callback){
        if(typeof html == "undefined"){
            html = "";
        }
        if(loadScripts !== true){
            this.dom.innerHTML = html;
            if(typeof callback == "function"){
                callback();
            }
            return this;
        }
        var id = Ext.id();
        var dom = this.dom;

        html += '<span id="' + id + '"></span>';

        E.onAvailable(id, function(){
            var hd = document.getElementsByTagName("head")[0];
            var re = /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig;
            var srcRe = /\ssrc=([\'\"])(.*?)\1/i;
            var typeRe = /\stype=([\'\"])(.*?)\1/i;

            var match;
            while(match = re.exec(html)){
                var attrs = match[1];
                var srcMatch = attrs ? attrs.match(srcRe) : false;
                if(srcMatch && srcMatch[2]){
                   var s = document.createElement("script");
                   s.src = srcMatch[2];
                   var typeMatch = attrs.match(typeRe);
                   if(typeMatch && typeMatch[2]){
                       s.type = typeMatch[2];
                   }
                   hd.appendChild(s);
                }else if(match[2] && match[2].length > 0){
                    if(window.execScript) {
                       window.execScript(match[2]);
                    } else {
                       window.eval(match[2]);
                    }
                }
            }
            var el = document.getElementById(id);
            if(el){Ext.removeNode(el);}
            if(typeof callback == "function"){
                callback();
            }
        });
        dom.innerHTML = html.replace(/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig, "");
        return this;
    },

    /**
     * 直接访问Updater的{@link Ext.Updater#update}方法（相同的参数）。
     * 参数与{@link Ext.Updater#update}方法的一致。
     * Direct access to the Updater {@link Ext.Updater#update} method. The method takes the same object
     * parameter as {@link Ext.Updater#update}
     * @return {Ext.Element} this
     */
    load : function(){
        var um = this.getUpdater();
        um.update.apply(um, arguments);
        return this;
    },

   /**
    * 获取这个元素的UpdateManager。
    * Gets this element's Updater
    * @return {Ext.Updater} The Updater
    */
    getUpdater : function(){
        if(!this.updateManager){
            this.updateManager = new Ext.Updater(this);
        }
        return this.updateManager;
    },

    /**
     * 禁止该元素的文本可被选择（可跨浏览器）。
     * Disables text selection for this element (normalized across browsers)
     * @return {Ext.Element} this
     */
    unselectable : function(){
        this.dom.unselectable = "on";
        this.swallowEvent("selectstart", true);
        this.applyStyles("-moz-user-select:none;-khtml-user-select:none;");
        this.addClass("x-unselectable");
        return this;
    },

   /** 
    * 返回该元素的x，y到屏幕中心的值
    * Calculates the x, y to center this element on the screen
    * @return {Array} The x, y values [x, y]
    */
    getCenterXY : function(){
        return this.getAlignToXY(document, 'c-c');
    },

   /**
    * 在视图或其他元素中，居中元素。
    * Centers the Element in either the viewport, or another Element.
    * @param {Mixed} centerIn （可选的）视图或其他元素(optional) The element in which to center the element.
    */
    center : function(centerIn){
        this.alignTo(centerIn || document, 'c-c');
        return this;
    },

    /**
     * 测试不同的CSS规则/浏览器以确定该元素是否使用Border Box。
     * Tests various css rules/browsers to determine if this element uses a border box
     * @return {Boolean}
     */
    isBorderBox : function(){
        return noBoxAdjust[this.dom.tagName.toLowerCase()] || Ext.isBorderBox;
    },

    /**
     * 返回一个BOX对象，形如{x, y, width, height}，可用于设置其他与之匹配的元素的大小/位置。
     * Return a box {x, y, width, height} that can be used to set another elements
     * size/location to match this element.
     * @param {Boolean} contentBox （可选的）true表示为返回元素内容的BOX(optional)。If true a box for the content of the element is returned.
     * @param {Boolean} local （可选的） true表示为返回元素的left和top代替页面的x/y。(optional) If true the element's left and top are returned instead of page x/y.
     * @return {Object} box BOX对象，形如{x, y, width, height}
     */
    getBox : function(contentBox, local){
        var xy;
        if(!local){
            xy = this.getXY();
        }else{
            var left = parseInt(this.getStyle("left"), 10) || 0;
            var top = parseInt(this.getStyle("top"), 10) || 0;
            xy = [left, top];
        }
        var el = this.dom, w = el.offsetWidth, h = el.offsetHeight, bx;
        if(!contentBox){
            bx = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: w, height: h};
        }else{
            var l = this.getBorderWidth("l")+this.getPadding("l");
            var r = this.getBorderWidth("r")+this.getPadding("r");
            var t = this.getBorderWidth("t")+this.getPadding("t");
            var b = this.getBorderWidth("b")+this.getPadding("b");
            bx = {x: xy[0]+l, y: xy[1]+t, 0: xy[0]+l, 1: xy[1]+t, width: w-(l+r), height: h-(t+b)};
        }
        bx.right = bx.x + bx.width;
        bx.bottom = bx.y + bx.height;
        return bx;
    },

    /**
	 * 传入的“side”的参数，统计边框和内补丁（padding & borders）的宽度并返回该值。
     * 参阅getBorderWidth()以得到更多sides的资料。
     * Returns the sum width of the padding and borders for the passed "sides". See getBorderWidth()
     for more information about the sides.
     * @param {String} sides
     * @return {Number}
     */
    getFrameWidth : function(sides, onlyContentBox){
        return onlyContentBox && this.isBorderBox() ? 0 : (this.getPadding(sides) + this.getBorderWidth(sides));
    },

    /**
	 * 设置元素之Box。使用getBox() 在其他对象身上获取box对象。
     * 如果动画为true，那么高度和宽度都会同时出现动画效果。
     * Sets the element's box. Use getBox() on another element to get a box obj. If animate is true then width, height, x and y will be animated concurrently.
     * @param {Object} box 填充的Box {x, y, width, height}The box to fill {x, y, width, height}
     * @param {Boolean} adjust （可选的） 是否自动调整由“箱子”问题引起的高度和宽度设置(optional) Whether to adjust for box-model issues automatically
     * @param {Boolean/Object} animate （可选的）true表示为默认的动画，或是一个配置项对象，这个配置项是标准的“元素动画”对象(optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     */
    setBox : function(box, adjust, animate){
        var w = box.width, h = box.height;
        if((adjust && !this.autoBoxAdjust) && !this.isBorderBox()){
           w -= (this.getBorderWidth("lr") + this.getPadding("lr"));
           h -= (this.getBorderWidth("tb") + this.getPadding("tb"));
        }
        this.setBounds(box.x, box.y, w, h, this.preanim(arguments, 2));
        return this;
    },

    /**
     * 强制浏览器重新渲染该元素。
     * Forces the browser to repaint this element
     * @return {Ext.Element} this
     */
     repaint : function(){
        var dom = this.dom;
        this.addClass("x-repaint");
        setTimeout(function(){
            Ext.get(dom).removeClass("x-repaint");
        }, 1);
        return this;
    },

    /**
     * 返回该元素的top、left、right和bottom属性，以表示margin（外补丁）除非有side参数。
     * 若有sides参数传入，即返回已计算好的sides宽度（参见getPading）。
     * Returns an object with properties top, left, right and bottom representing the margins of this element unless sides is passed,
     * then it returns the calculated width of the sides (see getPadding)
     * @param {String} sides （可选的） 任何 l, r, t, b的组合，以获取该sides的统计。(optional) Any combination of l, r, t, b to get the sum of those sides
     * @return {Object/Number}
     */
    getMargins : function(side){
        if(!side){
            return {
                top: parseInt(this.getStyle("margin-top"), 10) || 0,
                left: parseInt(this.getStyle("margin-left"), 10) || 0,
                bottom: parseInt(this.getStyle("margin-bottom"), 10) || 0,
                right: parseInt(this.getStyle("margin-right"), 10) || 0
            };
        }else{
            return this.addStyles(side, El.margins);
         }
    },

    // private
    addStyles : function(sides, styles){
        var val = 0, v, w;
        for(var i = 0, len = sides.length; i < len; i++){
            v = this.getStyle(styles[sides.charAt(i)]);
            if(v){
                 w = parseInt(v, 10);
                 if(w){ val += (w >= 0 ? w : -1 * w); }
            }
        }
        return val;
    },

    /**
     * 创建当前元素的代理（Proxy）元素。
     * Creates a proxy element of this element
     * @param {String/Object} config 代理元素的class名称或是DomHelper配置项对象The class name of the proxy element or a DomHelper config object
     * @param {String/HTMLElement} renderTo （可选的） 成为代理的元素或是元素ID（默认为 document.body）(optional) The element or element id to render the proxy to (defaults to document.body)
     * @param {Boolean} matchBox (optional) （可选的） true表示为立即与代理对齐和设置大小（默认为false）True to align and size the proxy to this element now (defaults to false)
     * @return {Ext.Element} 新代理元素The new proxy element
     */
    createProxy : function(config, renderTo, matchBox){
        config = typeof config == "object" ?
            config : {tag : "div", cls: config};

        var proxy;
        if(renderTo){
            proxy = Ext.DomHelper.append(renderTo, config, true);
        }else {
            proxy = Ext.DomHelper.insertBefore(this.dom, config, true);
        }
        if(matchBox){
           proxy.setBox(this.getBox());
        }
        return proxy;
    },

    /**
     * 在元素身上遮上一个蒙板（mask），以禁止用户操作。须依赖core.css文件。
     * 这个方法只能作用于接受子节点（child nodes）的元素。
     * Puts a mask over this element to disable user interaction. Requires core.css.
     * This method can only be applied to elements which accept child nodes.
     * @param {String} msg （可选的） 蒙板作用时显示的信息(optional) A message to display in the mask
     * @param {String} msgCls （可选的） 蒙板元素的CSS类(optional) A css class to apply to the msg element
     * @return {Element} 蒙板元素The mask element
     */
    mask : function(msg, msgCls){
        if(this.getStyle("position") == "static"){
            this.addClass("x-masked-relative");
        }
        if(this._maskMsg){
            this._maskMsg.remove();
        }
        if(this._mask){
            this._mask.remove();
        }

        this._mask = Ext.DomHelper.append(this.dom, {cls:"ext-el-mask"}, true);

        this.addClass("x-masked");
        this._mask.setDisplayed(true);
        if(typeof msg == 'string'){
            this._maskMsg = Ext.DomHelper.append(this.dom, {cls:"ext-el-mask-msg", cn:{tag:'div'}}, true);
            var mm = this._maskMsg;
            mm.dom.className = msgCls ? "ext-el-mask-msg " + msgCls : "ext-el-mask-msg";
            mm.dom.firstChild.innerHTML = msg;
            mm.setDisplayed(true);
            mm.center(this);
        }
        if(Ext.isIE && !(Ext.isIE7 && Ext.isStrict) && this.getStyle('height') == 'auto'){ // ie will not expand full height automatically
            this._mask.setSize(this.dom.clientWidth, this.getHeight());
        }
        return this._mask;
    },

    /**
     * 移除之前用过的蒙板。
     * Removes a previously applied mask.
     */
    unmask : function(){
        if(this._mask){
            if(this._maskMsg){
                this._maskMsg.remove();
                delete this._maskMsg;
            }
            this._mask.remove();
            delete this._mask;
        }
        this.removeClass(["x-masked", "x-masked-relative"]);
    },

    /**
     * 返回true表示为这个元素应用了蒙板。
     * Returns true if this element is masked
     * @return {Boolean}
     */
    isMasked : function(){
        return this._mask && this._mask.isVisible();
    },

    /**
     * 创建一个“iframe垫片”来使得select和其他windowed对象在该元素显示之下。
     * Creates an iframe shim for this element to keep selects and other windowed objects from
     * showing through.
     * @return {Ext.Element} 新垫片元素The new shim element
     */
    createShim : function(){
        var el = document.createElement('iframe');
        el.frameBorder = '0';
        el.className = 'ext-shim';
        if(Ext.isIE && Ext.isSecure){
            el.src = Ext.SSL_SECURE_URL;
        }
        var shim = Ext.get(this.dom.parentNode.insertBefore(el, this.dom));
        shim.autoBoxAdjust = false;
        return shim;
    },

    /**
     * 从DOM里面移除当前元素，并从缓存中删除。
     * Removes this element from the DOM and deletes it from the cache
     */
    remove : function(){
        Ext.removeNode(this.dom);
        delete El.cache[this.dom.id];
    },

    /**
     * 设置事件句柄，当鼠标在此元素之上作用的Css样式类。自动过滤因mouseout事件引起在子元素上的轻移（Flicker）
     * Sets up event handlers to call the passed functions when the mouse is over this element. Automatically
     * filters child element mouse events.
     * @param {Function} overFn
     * @param {Function} outFn
     * @param {Object} scope (optional)
     * @return {Ext.Element} this
     */
    hover : function(overFn, outFn, scope){
        var preOverFn = function(e){
            if(!e.within(this, true)){
                overFn.apply(scope || this, arguments);
            }
        };
        var preOutFn = function(e){
            if(!e.within(this, true)){
                outFn.apply(scope || this, arguments);
            }
        };
        this.on("mouseover", preOverFn, this.dom);
        this.on("mouseout", preOutFn, this.dom);
        return this;
    },

    /**
     * 数组当鼠标位于元素上方时作用的CSS样式类。
     * Sets up event handlers to add and remove a css class when the mouse is over this element
     * @param {String} className
     * @return {Ext.Element} this
     */
    addClassOnOver : function(className){
        this.hover(
            function(){
                Ext.fly(this, '_internal').addClass(className);
            },
            function(){
                Ext.fly(this, '_internal').removeClass(className);
            }
        );
        return this;
    },

    /**
     * 设置当元素得到焦点（focus）时作用的CSS样式类。
     * Sets up event handlers to add and remove a css class when this element has the focus
     * @param {String} className
     * @return {Ext.Element} this
     */
    addClassOnFocus : function(className){
        this.on("focus", function(){
            Ext.fly(this, '_internal').addClass(className);
        }, this.dom);
        this.on("blur", function(){
            Ext.fly(this, '_internal').removeClass(className);
        }, this.dom);
        return this;
    },
    /**
     * 当鼠标在该元素上面按下接着松开（即单击效果），设置事件处理器来添加和移除css类。
     * Sets up event handlers to add and remove a css class when the mouse is down and then up on this element (a click effect)
     * @param {String} className
     * @return {Ext.Element} this
     */
    addClassOnClick : function(className){
        var dom = this.dom;
        this.on("mousedown", function(){
            Ext.fly(dom, '_internal').addClass(className);
            var d = Ext.getDoc();
            var fn = function(){
                Ext.fly(dom, '_internal').removeClass(className);
                d.removeListener("mouseup", fn);
            };
            d.on("mouseup", fn);
        });
        return this;
    },

    /**
     * 事件上报（bubbling）的过程中停止特定的事件，阻止默认动作（可选的）。
     * Stops the specified event(s) from bubbling and optionally prevents the default action
     * @param {String/Array} eventName 要在上报过程中停止的事件或事件构成的数组an event / array of events to stop from bubbling
     * @param {Boolean} preventDefault （可选的）true表示阻止默认动作(optional) true to prevent the default action too
     * @return {Ext.Element} this
     */
    swallowEvent : function(eventName, preventDefault){
        var fn = function(e){
            e.stopPropagation();
            if(preventDefault){
                e.preventDefault();
            }
        };
        if(Ext.isArray(eventName)){
            for(var i = 0, len = eventName.length; i < len; i++){
                 this.on(eventName[i], fn);
            }
            return this;
        }
        this.on(eventName, fn);
        return this;
    },

    /**
     * 返回当前节点的那个父节点，可选地可送入一个期待的选择符。
     * Gets the parent node for this element, optionally chaining up trying to match a selector
     * @param {String} selector (optional) 通过简易选择符来查找父节点Find a parent node that matches the passed simple selector
     * @param {Boolean} returnDom （可选的） true表示为返回原始过的DOM元素，而非Ext.Element类型的元素(optional) True to return a raw dom node instead of an Ext.Element
     * @return {Ext.Element/HTMLElement} 父节点或是null
	 */
    parent : function(selector, returnDom){
        return this.matchNode('parentNode', 'parentNode', selector, returnDom);
    },

    /**
     * 获取下一个侧边节点，跳过文本节点。
     * Gets the next sibling, skipping text nodes
     * @param {String} selector （可选的） 通过简易选择符来查找下一个侧边节点(optional) Find the next sibling that matches the passed simple selector
     * @param {Boolean} returnDom （可选的） true表示为返回原始过的DOM元素，而非Ext.Element类型的元素(optional) True to return a raw dom node instead of an Ext.Element
     * @return {Ext.Element/HTMLElement} 下一个侧边节点或nullThe next sibling or null
	 */
    next : function(selector, returnDom){
        return this.matchNode('nextSibling', 'nextSibling', selector, returnDom);
    },

    /**
     * 获取上一个侧边节点，跳过文本节点。
     * Gets the previous sibling, skipping text nodes
     * @param {String} selector （可选的） 通过简易选择符来查找上一个侧边节点(optional) Find the previous sibling that matches the passed simple selector
     * @param {Boolean} returnDom （可选的） true表示为返回原始过的DOM元素，而非Ext.Element类型的元素(optional) True to return a raw dom node instead of an Ext.Element
     * @return {Ext.Element/HTMLElement} 上一个侧边节点或nullThe previous sibling or null
	 */
    prev : function(selector, returnDom){
        return this.matchNode('previousSibling', 'previousSibling', selector, returnDom);
    },


    /**
     * 获取第一个子元素，跳过文本节点。
     * Gets the first child, skipping text nodes
     * @param {String} selector （可选的） 通过简易选择符来查找第一个子元素(optional) Find the next sibling that matches the passed simple selector
     * @param {Boolean} returnDom （可选的） true表示为返回原始过的DOM元素，而非Ext.Element类型的元素(optional) True to return a raw dom node instead of an Ext.Element
     * @return {Ext.Element/HTMLElement} 第一个子元素或nullThe first child or null
	 */
    first : function(selector, returnDom){
        return this.matchNode('nextSibling', 'firstChild', selector, returnDom);
    },

    /**
     * 获取最后一个子元素，跳过文本节点。
     * Gets the last child, skipping text nodes
     * @param {String} selector （可选的） 通过简易选择符来查找最后一个元素(optional) Find the previous sibling that matches the passed simple selector
     * @param {Boolean} returnDom （可选的） true表示为返回原始过的DOM元素，而非Ext.Element类型的元素(optional) True to return a raw dom node instead of an Ext.Element
     * @return {Ext.Element/HTMLElement} 最后一个元素或nullThe last child or null
	 */
    last : function(selector, returnDom){
        return this.matchNode('previousSibling', 'lastChild', selector, returnDom);
    },

    matchNode : function(dir, start, selector, returnDom){
        var n = this.dom[start];
        while(n){
            if(n.nodeType == 1 && (!selector || Ext.DomQuery.is(n, selector))){
                return !returnDom ? Ext.get(n) : n;
            }
            n = n[dir];
        }
        return null;
    },

    /**
     * 传入一个DomHelper配置项对象的参数，将其创建并加入到该元素。
     * Creates the passed DomHelper config and appends it to this element or optionally inserts it before the passed child element.
     * @param {Object} config DomHelper元素配置项对象。如果没有传入特定的要求，如{tag:'input'}，那么将自动用DIV去创建，并附有一些属性。DomHelper element config object.  If no tag is specified (e.g., {tag:'input'}) then a div will be
     * automatically generated with the specified attributes.
     * @param {HTMLElement} insertBefore （可选的） 该元素的子元素(optional) a child element of this element
     * @param {Boolean} returnDom (optional) （可选的） true表示为返回原始过的DOM元素，而非Ext.Element类型的元素true to return the dom node instead of creating an Element
     * @return {Ext.Element} 新的子元素The new child element
     */
    createChild: function(config, insertBefore, returnDom){
        config = config || {tag:'div'};
        if(insertBefore){
            return Ext.DomHelper.insertBefore(insertBefore, config, returnDom !== true);
        }
        return Ext.DomHelper[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config,  returnDom !== true);
    },

    /**
     * 创建一个新的元素，包裹在当前元素外面。
     * Creates and wraps this element with another element
     * @param {Object} config （可选的） 包裹元素（null的话则是一个空白的div）的DomHelper配置项对象(optional) DomHelper element config object for the wrapper element or null for an empty div
     * @param {Boolean} returnDom (optional) （可选的） true表示为返回原始过的DOM元素，而非Ext.Element类型的元素True to return the raw DOM element instead of Ext.Element
     * @return {HTMLElement/Element} 刚创建好的包裹元素The newly created wrapper element
     */
    wrap: function(config, returnDom){
        if(!config){
            config = {tag: "div"};
        }
        var newEl = Ext.DomHelper.insertBefore(this.dom, config, !returnDom);
        newEl.dom ? newEl.dom.appendChild(this.dom) : newEl.appendChild(this.dom);
        return newEl;
    },

    /**
     * 插入HTML片断到这个元素。
     * Inserts an html fragment into this element
     * @param {String} where 要插入的html放在元素的哪里。-Where to insert the html in relation to this element - beforeBegin, afterBegin, beforeEnd, afterEnd.
     * @param {String} html HTML片断。The HTML fragment
     * @param {Boolean} returnEl true表示为返回一个Ext.Element类型的DOM对象。(optional) True to return an Ext.Element (defaults to false)
     * @return {HTMLElement/Ext.Element} 被插入之节点（或最近的，如果超过一处插入的话）。The inserted node (or nearest related if more than 1 inserted)
     */
    insertHtml : function(where, html, returnEl){
        var el = Ext.DomHelper.insertHtml(where, this.dom, html);
        return returnEl ? Ext.get(el) : el;
    },

    /**
     * 传入属性（attributes）的参数，使之成为该元素的属性（一个样式的属性可以是字符串，对象或函数function）。
     * Sets the passed attributes as attributes of this element (a style attribute can be a string, object or function)
     * @param {Object} o 属性对象。The object with the attributes
     * @param {Boolean} useSet （可选的） false表示为用expandos来重写默认的setAttribute。(optional) false to override the default setAttribute to use expandos.
     * @return {Ext.Element} this
     */
    set : function(o, useSet){
        var el = this.dom;
        useSet = typeof useSet == 'undefined' ? (el.setAttribute ? true : false) : useSet;
        for(var attr in o){
            if(attr == "style" || typeof o[attr] == "function") continue;
            if(attr=="cls"){
                el.className = o["cls"];
            }else if(o.hasOwnProperty(attr)){
                if(useSet) el.setAttribute(attr, o[attr]);
                else el[attr] = o[attr];
            }
        }
        if(o.style){
            Ext.DomHelper.applyStyles(el, o.style);
        }
        return this;
    },

    /**
     * 送入一个页面坐标的参数，将其翻译到元素的CSS left/top值。
     * Translates the passed page coordinates into left/top css values for this element
     * @param {Number/Array} x 页面x or 数组 [x, y]The page x or an array containing [x, y]
     * @param {Number} y （可选的）如x不是数组那必须指定y(optional) The page y, required if x is not an array
     * @return {Object} 包含left、top属性的对象，如 {left: (值), top: (值)}An object with left and top properties. e.g. {left: (value), top: (value)}
     */
    translatePoints : function(x, y){
        if(typeof x == 'object' || Ext.isArray(x)){
            y = x[1]; x = x[0];
        }
        var p = this.getStyle('position');
        var o = this.getXY();

        var l = parseInt(this.getStyle('left'), 10);
        var t = parseInt(this.getStyle('top'), 10);

        if(isNaN(l)){
            l = (p == "relative") ? 0 : this.dom.offsetLeft;
        }
        if(isNaN(t)){
            t = (p == "relative") ? 0 : this.dom.offsetTop;
        }

        return {left: (x - o[0] + l), top: (y - o[1] + t)};
    },

    /**
     * 返回元素当前滚动的位置。
     * Returns the current scroll position of the element.
     * @return {Object} 包含滚动位置的对象，格式如 {left: (scrollLeft), top: (scrollTop)}An object containing the scroll position in the format {left: (scrollLeft), top: (scrollTop)}
	 */
    getScroll : function(){
        var d = this.dom, doc = document;
        if(d == doc || d == doc.body){
            var l, t;
            if(Ext.isIE && Ext.isStrict){
                l = doc.documentElement.scrollLeft || (doc.body.scrollLeft || 0);
                t = doc.documentElement.scrollTop || (doc.body.scrollTop || 0);
            }else{
                l = window.pageXOffset || (doc.body.scrollLeft || 0);
                t = window.pageYOffset || (doc.body.scrollTop || 0);
            }
            return {left: l, top: t};
        }else{
            return {left: d.scrollLeft, top: d.scrollTop};
        }
    },

    /**
	 * 为指定的CSS属性返回CSS颜色。RGB、三位数(像#fff)和有效值都被转换到标准六位十六进制的颜色。Return the CSS color for the specified CSS attribute. rgb, 3 digit (like #fff) and valid values。
     * @param {String} attr CSS属性The css attribute
     * @param {String} defaultValue 当找不到有效的颜色时所用的默认值。The default value to use when a valid color isn't found
     * @param {String} prefix （可选的） 默认为#。当应用到颜色动画时须为空白字串符。Use an empty string when working with
     * color anims.
     */
    getColor : function(attr, defaultValue, prefix){
        var v = this.getStyle(attr);
        if(!v || v == "transparent" || v == "inherit") {
            return defaultValue;
        }
        var color = typeof prefix == "undefined" ? "#" : prefix;
        if(v.substr(0, 4) == "rgb("){
            var rvs = v.slice(4, v.length -1).split(",");
            for(var i = 0; i < 3; i++){
                var h = parseInt(rvs[i]);
                var s = h.toString(16);
                if(h < 16){
                    s = "0" + s;
                }
                color += s;
            }
        } else {
            if(v.substr(0, 1) == "#"){
                if(v.length == 4) {
                    for(var i = 1; i < 4; i++){
                        var c = v.charAt(i);
                        color +=  c + c;
                    }
                }else if(v.length == 7){
                    color += v.substr(1);
                }
            }
        }
        return(color.length > 5 ? color.toLowerCase() : defaultValue);
    },

    /**
	 * 将指定的元素打包到一个特定的样式/markup块，渲染成为斜纹背景、圆角和四边投影的灰色容器。
     * 用法举例：<pre><code>
// 
Ext.get("foo").boxWrap();

Ext.get("foo").boxWrap().addClass("x-box-blue");
</pre></code>
     * @param {String} class （可选的）一个CSS基类，应用到包裹元素（默认为'x-box'）。
     * 注意有许多依赖该CSS规则来产生整体的效果。
     * 所以你提供一个交替的基样式，必须保证你所提供的都是所需的规则。
     * @return {Ext.Element} this
     */
    /**
     * Wrap()的高级版本。Wrap将指定的元素打包到一个特定的样式/markup块，产生斜纹背景、圆角和四边投影的灰色容器。用法举例：
     * Wraps the specified element with a special markup/CSS block that renders by default as a gray container with a
     * gradient background, rounded corners and a 4-way shadow.  Example usage:
     * <pre><code>
// 基本box打包Basic box wrap
Ext.get("foo").boxWrap();

// 你也可以加入新的CSS样式类来定义box的外观。You can also add a custom class and use CSS inheritance rules to customize the box look.
// 'x-box-blue'是内建的参考项。看看例子中是怎么创建一个自定义的样式。'x-box-blue' is a built-in alternative -- look at the related CSS definitions as an example
// for how to create a custom box wrap style.
Ext.get("foo").boxWrap().addClass("x-box-blue");
</pre></code>
     * @param {String} class （可选的）一个CSS基类，应用到包裹元素（默认为'x-box'）(optional) A base CSS class to apply to the containing wrapper element (defaults to 'x-box').
     * 注意这里须要依赖一些CSS样式规则来产生整体的效果。所以你提供一个交替的基样式，必须保证你所提供的都是所需的规则。
     * Note that there are a number of CSS rules that are dependent on this name to make the overall effect work,
     * so if you supply an alternate base class, make sure you also supply all of the necessary rules.
     * @return {Ext.Element} this
     */
    boxWrap : function(cls){
        cls = cls || 'x-box';
        var el = Ext.get(this.insertHtml('beforeBegin', String.format('<div class="{0}">'+El.boxMarkup+'</div>', cls)));
        el.child('.'+cls+'-mc').dom.appendChild(this.dom);
        return el;
    },

    /**
     * 在DOM节点中的某个元素，返回其一个命名空间属性的值。
     * Returns the value of a namespaced attribute from the element's underlying DOM node.
     * @param {String} namespace 要查找属性所在的命名空间The namespace in which to look for the attribute
     * @param {String} name 属性名称The attribute name
     * @return {String} 属性值The attribute value
     */
    getAttributeNS : Ext.isIE ? function(ns, name){
        var d = this.dom;
        var type = typeof d[ns+":"+name];
        if(type != 'undefined' && type != 'unknown'){
            return d[ns+":"+name];
        }
        return d[name];
    } : function(ns, name){
        var d = this.dom;
        return d.getAttributeNS(ns, name) || d.getAttribute(ns+":"+name) || d.getAttribute(name) || d[name];
    }
};

var ep = El.prototype;

El.addMethods = function(o){
   Ext.apply(ep, o);
};

/**
 * 加入一个事件处理函数（{@link #addListener}的简写方式）Appends an event handler (shorthand for {@link #addListener}).
 * @param {String} eventName 事件处理函数的名称The type of event to handle
 * @param {Function} fn 事件处理函数The handler function the event invokes
 * @param {Object} scope （可选的）函数的作用域（默认这个元素）(optional) The scope (this element) of the handler function
 * @param {Object} options （可选的）标准的事件{@link #addListener} 配置项对象(optional) An object containing standard {@link #addListener} options
 * @member Ext.Element
 * @method on
 */
ep.on = ep.addListener;

ep.getUpdateManager = ep.getUpdater;

/**
 * 从这个元素上移除一个事件处理函数（{@link #removeListener}的简写方式）。
 * Removes an event handler from this element (shorthand for {@link #removeListener}).
 * @param {String} eventName 要移除的事件处理函数的名称the type of event to remove
 * @param {Function} fn 事件处理器the method the event invokes
 * @param {Object} scope （可选的）函数的作用域（默认这个元素）(optional) The scope (The <tt>this</tt> reference) of the handler function. Defaults
 * to this Element.
 * @return {Ext.Element} this
 * @member Ext.Element
 * @method un
 *
ep.un = ep.removeListener;

/**
 * true表示为自动调整由box-mode问题引起的高度和宽度设置（默认true）。
 * true to automatically adjust width and height settings for box-model issues (default to true)
 */
ep.autoBoxAdjust = true;

// private
El.unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i;

// private
El.addUnits = function(v, defaultUnit){
    if(v === "" || v == "auto"){
        return v;
    }
    if(v === undefined){
        return '';
    }
    if(typeof v == "number" || !El.unitPattern.test(v)){
        return v + (defaultUnit || 'px');
    }
    return v;
};

// special markup used throughout Ext when box wrapping elements
El.boxMarkup = '<div class="{0}-tl"><div class="{0}-tr"><div class="{0}-tc"></div></div></div><div class="{0}-ml"><div class="{0}-mr"><div class="{0}-mc"></div></div></div><div class="{0}-bl"><div class="{0}-br"><div class="{0}-bc"></div></div></div>';
/**
 * 显示模式（Visibility mode）的两个常量之一：使用Visibility来隐藏元素
 * Visibility mode constant - Use visibility to hide element
 * @static
 * @type Number
 */
El.VISIBILITY = 1;
/**
 * 显示模式（Visibility mode）的两个常量之一：使用Display来隐藏元素
 * Visibility mode constant - Use display to hide element
 * @static
 * @type Number
 */
El.DISPLAY = 2;

El.borders = {l: "border-left-width", r: "border-right-width", t: "border-top-width", b: "border-bottom-width"};
El.paddings = {l: "padding-left", r: "padding-right", t: "padding-top", b: "padding-bottom"};
El.margins = {l: "margin-left", r: "margin-right", t: "margin-top", b: "margin-bottom"};



/**
 * @private
 */
El.cache = {};

var docEl;

/**
 * 获取元素对象的静态方法。
 * Static method to retrieve Ext.Element objects.
 * <p><b>这个方法并非能获取{@link Ext.Component Component}。</b> 这是一个对DOM元素进行Ext.Element类型的封装方法。要获取组件，请使用{@link Ext.ComponentMgr#get}方法。This method
 * retrieves Ext.Element objects which encapsulate DOM elements. To retrieve a Component by
 * its ID, use {@link Ext.ComponentMgr#get}.</p>
 * <p>如果是相同的对象的话，只是从缓存中提取。Uses simple caching to consistently return the same object.
 * 如果通过AJAX或DOM再创建对象，那么它是同一个ID，这里会自动修正。
 * Automatically fixes if an object was recreated with the same id via AJAX or DOM.</p>
 * @param {Mixed} el 节点的id，一个DOM节点或是已存在的元素The id of the node, a DOM Node or an existing Element.
 * @return {Element} {@link Ext.Element Element}类型的元素对象（null的话就代表没有找到元素）The {@link Ext.Element Element} object (or null if no matching element was found)
 * @static
 */
El.get = function(el){
    var ex, elm, id;
    if(!el){ return null; }
    if(typeof el == "string"){ // element id
        if(!(elm = document.getElementById(el))){
            return null;
        }
        if(ex = El.cache[el]){
            ex.dom = elm;
        }else{
            ex = El.cache[el] = new El(elm);
        }
        return ex;
    }else if(el.tagName){ // dom element
        if(!(id = el.id)){
            id = Ext.id(el);
        }
        if(ex = El.cache[id]){
            ex.dom = el;
        }else{
            ex = El.cache[id] = new El(el);
        }
        return ex;
    }else if(el instanceof El){
        if(el != docEl){
            el.dom = document.getElementById(el.id) || el.dom; // refresh dom element in case no longer valid,
                                                          // catch case where it hasn't been appended
            El.cache[el.id] = el; // in case it was created directly with Element(), let's cache it
        }
        return el;
    }else if(el.isComposite){
        return el;
    }else if(Ext.isArray(el)){
        return El.select(el);
    }else if(el == document){
        // create a bogus element object representing the document object
        if(!docEl){
            var f = function(){};
            f.prototype = El.prototype;
            docEl = new f();
            docEl.dom = document;
        }
        return docEl;
    }
    return null;
};

// private
El.uncache = function(el){
    for(var i = 0, a = arguments, len = a.length; i < len; i++) {
        if(a[i]){
            delete El.cache[a[i].id || a[i]];
        }
    }
};

// private
// Garbage collection - uncache elements/purge listeners on orphaned elements
// so we don't hold a reference and cause the browser to retain them
El.garbageCollect = function(){
    if(!Ext.enableGarbageCollector){
        clearInterval(El.collectorThread);
        return;
    }
    for(var eid in El.cache){
        var el = El.cache[eid], d = el.dom;
        // -------------------------------------------------------
        // Determining what is garbage:
        // -------------------------------------------------------
        // !d
        // dom node is null, definitely garbage
        // -------------------------------------------------------
        // !d.parentNode
        // no parentNode == direct orphan, definitely garbage
        // -------------------------------------------------------
        // !d.offsetParent && !document.getElementById(eid)
        // display none elements have no offsetParent so we will
        // also try to look it up by it's id. However, check
        // offsetParent first so we don't do unneeded lookups.
        // This enables collection of elements that are not orphans
        // directly, but somewhere up the line they have an orphan
        // parent.
        // -------------------------------------------------------
        if(!d || !d.parentNode || (!d.offsetParent && !document.getElementById(eid))){
            delete El.cache[eid];
            if(d && Ext.enableListenerCollection){
                Ext.EventManager.removeAll(d);
            }
        }
    }
}
El.collectorThreadId = setInterval(El.garbageCollect, 30000);

var flyFn = function(){};
flyFn.prototype = El.prototype;
var _cls = new flyFn();

// dom is optional
El.Flyweight = function(dom){
    this.dom = dom;
};

El.Flyweight.prototype = _cls;
El.Flyweight.prototype.isFlyweight = true;

El._flyweights = {};
/**
 * 获取享元的元素，传入的节点会成为活动元素。这里不会保存该元素的引用（reference）－可由其它代码重写dom节点。
 * Gets the globally shared flyweight Element, with the passed node as the active element. Do not store a reference to this element -
 * the dom node can be overwritten by other code.
 * @param {String/HTMLElement} el Dom节点或idThe dom node or id
 * @param {String} named （可选的） 为避免某些冲突（如在ext内部的“_internal”），可另外起一个名字。(optional) Allows for creation of named reusable flyweights to
 *                                  prevent conflicts (e.g. internally Ext uses "_internal")
 * @static
 * @return {Element} 共享的Element对象（null表示为找不到元素）The shared Element object (or null if no matching element was found)
 */
El.fly = function(el, named){
    named = named || '_global';
    el = Ext.getDom(el);
    if(!el){
        return null;
    }
    if(!El._flyweights[named]){
        El._flyweights[named] = new El.Flyweight();
    }
    El._flyweights[named].dom = el;
    return El._flyweights[named];
};

/**
 * 获取元素对象的静态方法。
 * Static method to retrieve Ext.Element objects.
 * <p><b>这个方法并非能获取{@link Ext.Component Component}。</b> 这是一个对DOM元素进行Ext.Element类型的封装方法。要获取组件，请使用{@link Ext.ComponentMgr#get}方法。This method
 * retrieves Ext.Element objects which encapsulate DOM elements. To retrieve a Component by
 * its ID, use {@link Ext.ComponentMgr#get}.</p>
 * <p>如果是相同的对象的话，只是从缓存中提取。Uses simple caching to consistently return the same object.
 * 如果通过AJAX或DOM再创建对象，那么它是同一个ID，这里会自动修正。
 * Automatically fixes if an object was recreated with the same id via AJAX or DOM.</p>
 * @param {Mixed} el 节点的id，一个DOM节点或是已存在的元素The id of the node, a DOM Node or an existing Element.
 * @return {Element} {@link Ext.Element Element}类型的元素对象（null的话就代表没有找到元素）The {@link Ext.Element Element} object (or null if no matching element was found)
 * @member Ext
 * @method get
 */
Ext.get = El.get;
/**
 * 获取享元的元素，传入的节点会成为活动元素。这里不会保存该元素的引用（reference）－可由其它代码重写dom节点。
 * Gets the globally shared flyweight Element, with the passed node as the active element. Do not store a reference to this element -
 * the dom node can be overwritten by other code.
 * @param {String/HTMLElement} el Dom节点或idThe dom node or id
 * @param {String} named （可选的） 为避免某些冲突（如在ext内部的“_internal”），可另外起一个名字。(optional) Allows for creation of named reusable flyweights to
 *                                  prevent conflicts (e.g. internally Ext uses "_internal")
 * @static
 * @return {Element} 共享的Element对象（null表示为找不到元素）The shared Element object (or null if no matching element was found)
 */
Ext.fly = El.fly;

// speedy lookup for elements never to box adjust
var noBoxAdjust = Ext.isStrict ? {
    select:1
} : {
    input:1, select:1, textarea:1
};
if(Ext.isIE || Ext.isGecko){
    noBoxAdjust['button'] = 1;
}


Ext.EventManager.on(window, 'unload', function(){
    delete El.cache;
    delete El._flyweights;
});
})();
