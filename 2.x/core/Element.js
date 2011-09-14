/**
 * @class Ext.Element
 * Represents an Element in the DOM.<br><br>
 * Usage:<br>
 * 呈现DOM里面的一个元素。<br><br>
 * 用法：<br>
<pre><code>
var el = Ext.get("my-div");

// 或者是 getEl
var el = getEl("my-div");

// 或者是一个 DOM element
var el = Ext.get(myDivElement);
</code></pre>
 * 使用Ext.get或是getEl()来代替调用构造函数，保证每次调用都是获取相同的对象而非构建新的一个。
 * <br><br>
 * <b>动画</b><br />
 * 操作DOM元素，很多情况下会用一些到动画效果（可选的）。
 * 动画选项应该是布尔值（true ）或是Object Literal 。动画选项有：
<pre>
可选项    默认值      描述
--------- --------  ---------------------------------------------
duration  .35       动画持续的时间
easing    easeOut   The easing method
callback  none      当动画完成后执行的函数
scope     this      回调函数的作用欲（可选的）
duration  .35       动画持续的时间（单位：秒）
easing    easeOut   YUI的消除方法
callback  none      动画完成之后执行的函数
scope     this      回调函数的作用域
</pre>
*另外，可通过配置项中的“anim“来获取动画对象，这样便可停止或操控这个动画效果。例子如下：
<pre><code>
var el = Ext.get("my-div");

// 没有动画
el.setWidth(100);
// 默认动画
el.setWidth(100, true);
// 对动画的一些设置
el.setWidth(100, {
    duration: 1,
    callback: this.foo,
    scope: this
});

// 使用属性“anim”来获取动画对象
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
 * <b>  组合（集合的）元素</b><br />
 * 要处理一组的元素，参阅<a href="Ext.CompositeElement.html">Ext.CompositeElement</a>
 * @constructor 直接创建新元素
 * @param {String/HTMLElement} element
 * @param {Boolean} forceNew （可选的） 构建函数默认会检查在Cache中是否已经有这个element的实例，并是否能返回一致的实例。设置这个布尔值会中止检查（扩展这个类时较有用）。
 */
(function(){
var D = Ext.lib.Dom;
var E = Ext.lib.Event;
var A = Ext.lib.Anim;

var propCache = {};
var camelRe = /(-[a-z])/gi;
var camelFn = function(m, a){ return a.charAt(1).toUpperCase(); };
var view = document.defaultView;

Ext.Element = function(element, forceNew){
    var dom = typeof element == "string" ?
            document.getElementById(element) : element;
    if(!dom){ //无效的id/element
        return null;
    }
    var id = dom.id;
    if(forceNew !== true && id && Ext.Element.cache[id]){  // 元素对象已存在
        return Ext.Element.cache[id];
    }

    /**
	 * DOM元素
     * @type HTMLElement
     */
    this.dom = dom;

    /**
	 * DOM元素之ID
     * @property id
     */
    this.id = id || Ext.id(dom);
};

var El = Ext.Element;

El.prototype = {
    /**
	 * 元素默认的显示模式（默认为""） 
	 * @type String
     */
    originalDisplay : "",

    visibilityMode : 1,
    
    /**
	 * CSS值的单位。如不指定则默认为px。
     * @type String
     */
    defaultUnit : "px",
    
    /**
	 * 设置元素的可见模式。
	 * 当调用setVisible()时，会确定可见模式究竟是“可见性visibility”的还是“显示display”的。
	 * @param visMode Element.VISIBILITY 或 Element.DISPLAY
	 * @return {Ext.Element} this
     */
    setVisibilityMode : function(visMode){
        this.visibilityMode = visMode;
        return this;
    },
    
    /**
	 * 调用setVisibilityMode(Element.DISPLAY)的快捷方式
     * @param {String} display （可选的）当可见时显示的内容
     * @return {Ext.Element} this
     */
    enableDisplayMode : function(display){
        this.setVisibilityMode(El.DISPLAY);
        if(typeof display != "undefined") this.originalDisplay = display;
        return this;
    },

   
	/**
     * 定位此节点并按照传入的简易选择符（如 div.some-class or span:first-child）查找父节点。
     * @param {String} simpleSelector 要测试的简易选择符
     * @param {Number/String/HTMLElement/Element} maxDepth （可选的） 搜索深度（MaxDepth），可以为number或元素(默认是 10 || document.body)
     * @param {Boolean} returnEl （可选的） True表示为返回Ext.Element对象，false的话返回DOM节点
     * @return {HTMLElement} 匹配的DOM节点（null的话表示没有匹配结果）
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
     * 按照简易选择符查找父节点。选择符如 div.some-class or span:first-child。
     * @param {String} simpleSelector 要测试的简易选择符
     * @param {Number/String/HTMLElement/Element} maxDepth （可选的） 搜索深度（MaxDepth），可以为number或元素(默认是 10 || document.body)
     * @param {Boolean} returnEl （可选的） True表示为返回Ext.Element对象代替DOM节点
     * @return {HTMLElement} 匹配的DOM节点（null的话表示没有匹配结果）
	 */
    findParentNode : function(simpleSelector, maxDepth, returnEl){
        var p = Ext.fly(this.dom.parentNode, '_internal');
        return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
    },

    /**
     * 传入一个选择符的参数，按照选择符并沿着dom查找父节点。选择符应是简易的选择符，如 div.some-class or span:first-child。
     * @param {String} simpleSelector 要测试的简易选择符
     * @param {Number/String/HTMLElement/Element} maxDepth （可选的） 搜索深度（MaxDepth），可以为number或元素(默认是 10 || document.body)
     * @param {Boolean} returnEl （可选的） True：返回Ext.Element对象代替DOM节点
     * @return {HTMLElement} 匹配的DOM节点（null的话表示没有匹配结果）
	 */
    up : function(simpleSelector, maxDepth){
        return this.findParentNode(simpleSelector, maxDepth, true);
    },



    /**
     * 如果这个元素就是传入的简易选择符参数（如 div.some-class或span:first-child，返回true。
     * @param {String} ss 要测试的简易选择符
     * @return {Boolean} true表示元素匹配选择符成功，否则返回false
	 */
    is : function(simpleSelector){
        return Ext.DomQuery.is(this.dom, simpleSelector);
    },

    /**
     * 在元素上执行动画
     * @param {Object} args  YUI之动画配置参数
     * @param {Float} duration （可选的） 动画持续多久 (默认为 .35 秒)
     * @param {Function} onComplete （可选的） 动画完成后调用的函数
     * @param {String} easing （可选的） 采用的“松开”方法 (默认为 'easeOut')
     * @param {String} animType （可选的） 默认为'run'，可以是'color'，'motion'，或'scroll'
     * @return {Ext.Element} this
	 */
    animate : function(args, duration, onComplete, easing, animType){
        this.anim(args, {duration: duration, callback: onComplete, easing: easing}, animType);
        return this;
    },

    /*
   
	 * @私有的 内置动画调用
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

    // private legacy anim prep
	// 私有的 legacy anim prep
    preanim : function(a, i){
        return !a[i] ? false : (typeof a[i] == "object" ? a[i]: {duration: a[i+1], callback: a[i+2], easing: a[i+3]});
    },

    /**
.
	 * 移除无用的文本节点
     * @param {Boolean} forceReclean （可选的）缺省地，
     * 元素会追踪自己是否已被清除了，所以你可以不断地调用这个方法
     * 然而，如果你需要更新元素而且需要强制清除，你可以传入true的参数。
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
    
	 * 传入一个容器（container）参数，把元素滚动到容器的视图（View）。
     * @param {String/HTMLElement/Element} container （可选的）滚动容器的元素（默认为document.body）
     * @param {Boolean} hscroll （可选的）false表示为禁止水平滚动
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
        c.scrollTop = c.scrollTop; 

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

  
    scrollChildIntoView : function(child, hscroll){
        Ext.fly(child, '_scrollChildIntoView').scrollIntoView(this, hscroll);
    },

    /**
   
	 * 测量元素其内容的实际高度，使元素之高度适合。
     * 注：改函数使用setTimeout所以新高度或者不会立即有效。
     * @param {Boolean} animate （可选的）变换（默认 false）
     * @param {Float} duration （可选的）动画持续时间（默认为0.35秒）
     * @param {Function} onComplete （可选的）动画完成后执行的函数
     * @param {String} easing （可选的）采用清除的方法（默认为easeOut）
     * @return {Ext.Element} this
     */
    autoHeight : function(animate, duration, onComplete, easing){
        var oldHeight = this.getHeight();
        this.clip();
        this.setHeight(1);  // 强迫裁剪
        setTimeout(function(){
            var height = parseInt(this.dom.scrollHeight, 10); 
            if(!animate){
                this.setHeight(height);
                this.unclip();
                if(typeof onComplete == "function"){
                    onComplete();
                }
            }else{
                this.setHeight(oldHeight); // 恢复原始高度
                this.setHeight(height, animate, duration, function(){
                    this.unclip();
                    if(typeof onComplete == "function") onComplete();
                }.createDelegate(this), easing);
            }
        }.createDelegate(this), 0);
        return this;
    },

    /**
 
     * 如果当前元素是传入元素的父级元素（ancestor)返回true,
     * @param {HTMLElement/String} el 要检查的元素
     * @return {Boolean} true表示这个元素是传入元素的父级元素，否则返回false
	 */
    contains : function(el){
        if(!el){return false;}
        return D.isAncestor(this.dom, el.dom ? el.dom : el);
    },

    /**
   
     * 检查当前该元素是否都使用属性visibility和属性display来显示。
     * @param {Boolean} deep （可选的）True表示为沿着DOM一路看父元素是否隐藏的。
     * @return {Boolean} true表示该元素当前是可见的，否则返回false
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
    
     * 传入一个CSS选择符的参数，然后基于该选择符为子节点创建一个{@link Ext.CompositeElement}组合元素。（选择符不应有id）
     * @param {String} selector CSS选择符
     * @param {Boolean} unique true表示为为每个子元素创建唯一的Ext.Element（默认为false享元的普通对象flyweight object)
     * @return {CompositeElement/CompositeElementLite} 组合元素
	 */
    select : function(selector, unique){
        return El.select(selector, unique, this.dom);
    },

    /**
    
	 * 传入一个CSS选择符的参数，然后基于该选择符选取其子节点（选择符不应有id）
     * @param {String} selector  CSS选择符
     * @return {Array} 匹配节点之数组
     */
    query : function(selector, unique){
        return Ext.DomQuery.select(selector, this.dom);
    },

    /**
    
     * 传入一个CSS选择符的参数，然后基于该选择符，不限定深度，选取单个子节点（选择符不应有id）
     * @param {String} selector CSS选择符
     * @param {Boolean} returnDom （可选的）true表示为返回DOM节点，false表示为返回Ext.Element（默认为false）
     * @return {HTMLElement/Ext.Element} Ext.Element的子孙（如returnDom = true则为DOM节点）
	 */
    child : function(selector, returnDom){
        var n = Ext.DomQuery.selectNode(selector, this.dom);
        return returnDom ? n : Ext.get(n);
    },

    /**
    
     * 传入一个CSS选择符的参数，然后基于该选择符，"直接"选取单个子节点（选择符不应有id）
     * @param {String} selector CSS选择符
     * @param {Boolean} returnDom （可选的）true表示为返回DOM节点，false表示为返回Ext.Element（默认为false）
     * @return {HTMLElement/Ext.Element} Ext.Element的子孙（如returnDom = true则为DOM节点）
	 */
    down : function(selector, returnDom){
        var n = Ext.DomQuery.selectNode(" > " + selector, this.dom);
        return returnDom ? n : Ext.get(n);
    },

    /**
    
	 * 为这个元素初始化{@link Ext.dd.DD}对象
     * @param {String} DD对象隶属于的那个组（Group）
     * @param {Object} config DD之配置对象
     * @param {Object} overrides 包含一些方法的对象，用于重写或实现（override/implement）DDTarget对象
     * @return {Ext.dd.DD} DD对象
     */
    initDD : function(group, config, overrides){
        var dd = new Ext.dd.DD(Ext.id(this.dom), group, config);
        return Ext.apply(dd, overrides);
    },

    /**
    
	 * 为这个元素初始化{@link Ext.dd.DDProxy}对象
     * @param {String} group  DDProxy对象隶属于的那个组（Group）
     * @param {Object} config DDProxy之配置对象
     * @param {Object} overrides 包含一些方法的对象，用于重写或实现（override/implement）DDTarget对象
     * @return {Ext.dd.DDProxy} DDProxy对象
     */
    initDDProxy : function(group, config, overrides){
        var dd = new Ext.dd.DDProxy(Ext.id(this.dom), group, config);
        return Ext.apply(dd, overrides);
    },

    /**
    
     * 为这个元素初始化{@link Ext.dd.DDTarget}对象
     * @param {String} group DDTarget对象隶属于的那个组（Group）
     * @param {Object} config DDTarget之配置对象
     * @param {Object} overrides 包含一些方法的对象，用于重写或实现（override/implement）DDTarget对象
     * @return {Ext.dd.DDTarget} DDTarget对象
	 */
    initDDTarget : function(group, config, overrides){
        var dd = new Ext.dd.DDTarget(Ext.id(this.dom), group, config);
        return Ext.apply(dd, overrides);
    },

    /**
    
	 * 设置元素可见性（参阅细节）。
     * 如果visibilityMode 被设置成 Element.DISPLAY，
     * 那么它会使用display属性来隐藏元素，否则它会使用visibility。默认是使用 visibility属性。
     * @param {Boolean} visible 元素是否可见的
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
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
      
	 * 如果属性display不是"none"就返回true
     * @return {Boolean}
     */
    isDisplayed : function() {
        return this.getStyle("display") != "none";
    },

    /**
    
	 * 轮回元素visibility或display，取决于visibility mode。
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
     * @return {Ext.Element} this
     */
    toggle : function(animate){
        this.setVisible(!this.isVisible(), this.preanim(arguments, 0));
        return this;
    },

    /**
     
	 * 设置Css display属性。如果value为true，则使用originalDisplay。
     * @param {Boolean} value 如果value为true，则使用originalDisplay。否则直接设置显示的字符串、
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
     * @return {Ext.Element} this
     */
    focus : function() {
        try{
            this.dom.focus();
        }catch(e){}
        return this;
    },

    /**
    
	 * 使这个元素失去焦点。忽略任何已捕获的异常。
     * @return {Ext.Element} this
     */
    blur : function() {
        try{
            this.dom.blur();
        }catch(e){}
        return this;
    },

    /**
    
	 * 为元素添加CSS类（CSS Class）。重复的类会被忽略。
     * @param {String/Array} className  要加入的CSS类或者由类组成的数组
     * @return {Ext.Element} this
     */
    addClass : function(className){
        if(className instanceof Array){
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
     
	 * 添加一个或多个className到这个元素，并移除其侧边（siblings）节点上所有的样式。
     * @param {String} className 要加入的className，或者是由类组成的数组
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
     
	 * 移除元素的CSS类
     * @param {String/Array} className  要移除的CSS类或者由类组成的数组
     * @return {Ext.Element} this
	 */
    removeClass : function(className){
        if(!className || !this.dom.className){
            return this;
        }
        if(className instanceof Array){
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

    
    classReCache: {},

    /**
    
     * 轮换（Toggles）--添加或移除指定的CSS类（如果已经存在的话便删除，否则就是新增加）。
     * @param {String} className 轮换的CSS类
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
      
     * 检查某个CSS类是否存在这个元素的DOM节点上
     * @param {String} className 要检查CSS类
     * @return {Boolean} true表示为类是有的，否则为false
	 */
    hasClass : function(className){
        return className && (' '+this.dom.className+' ').indexOf(' '+className+' ') != -1;
    },

    /**
    
     * 在这个元素身上替换CSS类。如果旧的CSS名称不存在，新的就会加入。
     * @param {String} oldClassName 要被替换之CSS类
     * @param {String} newClassName 新CSS类
     * @return {Ext.Element} this
	 */
    replaceClass : function(oldClassName, newClassName){
        this.removeClass(oldClassName);
        this.addClass(newClassName);
        return this;
    },

    /**
    
     * 给出一些CSS属性名，得到其值
     * 如el.getStyles('color', 'font-size', 'width')会返回
     * {'color': '#FFFFFF', 'font-size': '13px', 'width': '100px'}.
     * @param {String} 样式一
     * @param {String} 样式二
     * @param {String} 等等..
     * @return Object 样式对象
	 */
    getStyles : function(){
        var a = arguments, len = a.length, r = {};
        for(var i = 0; i < len; i++){
            r[a[i]] = this.getStyle(a[i]);
        }
        return r;
    },

    /**
     
     * 常规化当前样式和计算样式。
	 * @param {String} property 返回值的那个样式属性。
	 * @return {String} 该元素样式属性的当前值。
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
     
     * 以打包的方式设置样式属性，也可以用一个对象参数包含多个样式。
     * @param {String/Object} 要设置的样式属性，或是包含多个样式的对象
     * @param {String} value （可选的）样式属性的值，如果第一个参数是对象，则这个参数为null     
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
     
     * {@link #setStyle}的另一个版本，能更灵活地设置样式属性
     * @param {String/Object/Function} styles 表示样式的特定格式字符串，如“width:100px”，或是对象的形式如{width:"100px"}，或是能返回这些格式的函数
     * @return {Ext.Element} this
	 */
    applyStyles : function(style){
        Ext.DomHelper.applyStyles(this.dom, style);
        return this;
    },

    /**
     
      * 获取元素基于页面坐标的X位置。
      * 元素必须是DOM树中的一部分，才拥有页面坐标（display:none或未加入的elements返回false）。
      * @return {Number} 元素的X位置
	  */
    getX : function(){
        return D.getX(this.dom);
    },

    /**
      
      * 获取元素基于页面坐标的Y位置。
      * 元素必须是DOM树中的一部分，才拥有页面坐标（display:none或未加入的elements返回false）。
      * @return {Number} 元素的Y位置
	  */
    getY : function(){
        return D.getY(this.dom);
    },

    /**
      
      * 获取元素基于页面坐标当前的位置。
      * 元素必须是DOM树中的一部分，才拥有页面坐标（display:none或未加入的elements返回false）。
      * @return {Number} 元素的XY位置
	  */
    getXY : function(){
        return D.getXY(this.dom);
    },

   
    getOffsetsTo : function(el){
        var o = this.getXY();
        var e = Ext.fly(el, '_internal').getXY();
        return [o[0]-e[0],o[1]-e[1]];
    },

    /**
     
	 * 设置元素基于页面坐标的X位置。
     * 元素必须是DOM树中的一部分，才拥有页面坐标（display:none或未加入的elements返回 false）。
     * @param {Number} x 元素的X位置
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
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
     * 元素必须是DOM树中的一部分，才拥有页面坐标（display:none或未加入的elements返回 false）。
     * @param {Number} x 元素的Y位置
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
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
     * @param {String} left CSS属性left的值
     * @return {Ext.Element} this
     */
    setLeft : function(left){
        this.setStyle("left", this.addUnits(left));
        return this;
    },

    /**
    
	 * 直接使用CSS样式（代替{@link #setY}），设定元素的top位置。
     * @param {String} top CSS属性top的值
     * @return {Ext.Element} this
     */
    setTop : function(top){
        this.setStyle("top", this.addUnits(top));
        return this;
    },

    /**
    
	 * 设置元素CSS Right的样式
     * @param {String} bottom Bottom CSS属性值
     * @return {Ext.Element} this
     */
    setRight : function(right){
        this.setStyle("right", this.addUnits(right));
        return this;
    },

    /**
   
	 * 设置元素CSS Bottom的样式
     * @param {String} bottom Bottom CSS属性值
     * @return {Ext.Element} this
     */
    setBottom : function(bottom){
        this.setStyle("bottom", this.addUnits(bottom));
        return this;
    },

    /**
	 * 设置元素在页面的坐标位置，不管这个元素如何定位。
     * 元素必须是DOM树中的一部分，才拥有页面坐标（display:none或未加入的elements返回 false）。
     * @param {Array} pos 对于新位置（基于页面坐标）包含X & Y [x, y]的值
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
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
    
	 * 设置元素在页面的坐标位置，不管这个元素如何定位。
     * 元素必须是DOM树中的一部分，才拥有页面坐标（display:none或未加入的elements返回 false）。
     * @param {Number} x 新定位的X值（基于页面坐标）
     * @param {Number} y 新定位的Y值（基于页面坐标）
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
     * @return {Ext.Element} this
     */
    setLocation : function(x, y, animate){
        this.setXY([x, y], this.preanim(arguments, 2));
        return this;
    },

    /**
 
	 * 设置元素在页面的坐标位置，不管这个元素如何定位。
     * 元素必须是DOM树中的一部分，才拥有页面坐标（display:none或未加入的elements返回 false）。
     * @param {Number} x 新定位的X值（基于页面坐标）
     * @param {Number} y 新定位的Y值（基于页面坐标）
     * @param {Boolean/Object} animate （可选的） true ：为默认动画，或有一个标准元素动画配置的对象
     * @return {Ext.Element} this
     */
    moveTo : function(x, y, animate){
        this.setXY([x, y], this.preanim(arguments, 2));
        return this;
    },

    /**
   
     * 返回给出元素的区域。
     * 元素必须是DOM树中的一部分，才拥有页面坐标（display:none或未加入的elements返回 false）。
     * @return {Region} A Ext.lib.Region 包含"top, left, bottom, right" 成员数据
	 */
    getRegion : function(){
        return D.getRegion(this.dom);
    },

    /**
    
     * 返回元素的偏移（offset）高度
     * @param {Boolean} contentHeight （可选的） true表示为获取减去边框和内补丁（borders & padding）的宽度
     * @return {Number} 元素高度
	 */
    getHeight : function(contentHeight){
        var h = this.dom.offsetHeight || 0;
        h = contentHeight !== true ? h : h-this.getBorderWidth("tb")-this.getPadding("tb");
        return h < 0 ? 0 : h;
    },

    /**
    
	 * 返回元素的偏移（offset）宽度
     * @param {Boolean} contentWidth （可选的） true表示为获取减去边框和内补丁（borders & padding）的宽度
     * @return {Number} 元素宽度
     */
    getWidth : function(contentWidth){
        var w = this.dom.offsetWidth || 0;
        w = contentWidth !== true ? w : w-this.getBorderWidth("lr")-this.getPadding("lr");
        return w < 0 ? 0 : w;
    },

  
    /**
     * 当偏移值不可用时就模拟一个出来。该方法返回由padding或borders调整过的元素CSS高度，也可能是偏移的高度。
     * 如果不用CSS设置高度而且是display:none的元素，有可能不能正常工作。
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
     * 如果不用CSS设置宽度而且是display:none的元素，有可能不能正常工作。
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
    
	 * 返回元素尺寸大小。
     * @param {Boolean} contentSize （可选的） true表示为返回减去border和padding的宽度大小
     * @return {Object} 包含元素大小尺寸的对象，如{width: (element width), height: (element height)}
	 */
    getSize : function(contentSize){
        return {width: this.getWidth(contentSize), height: this.getHeight(contentSize)};
    },

    getStyleSize : function(){
        var w, h, d = this.dom, s = d.style;
        if(s.width && s.width != 'auto'){
            w = parseInt(s.width, 10);
            if(Ext.isBorderBox){
               w -= this.getFrameWidth('lr');
            }
        }
        if(s.height && s.height != 'auto'){
            h = parseInt(s.height, 10);
            if(Ext.isBorderBox){
               h -= this.getFrameWidth('tb');
            }
        }
        return {width: w || this.getWidth(true), height: h || this.getHeight(true)};

    },

    /**
    * 返回视图的高度和宽度。
     * @return {Object} 包含视图大小尺寸的对象，如{width: (viewport width), height: (viewport height)}
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
    
	 * 返回“值的”属性值
     * @param {Boolean} asNumber 表示为将值解析为数字
     * @return {String/Number}
     */
    getValue : function(asNumber){
        return asNumber ? parseInt(this.dom.value, 10) : this.dom.value;
    },

 
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
    
	 * 设置元素的宽度
     * @param {Number} width 新宽度
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
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
  
	 * 设置元素的高度
     * @param {Number} height 新高度
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
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
   
	 * 设置元素的大小尺寸。如果动画效果被打开，高度和宽度都会产生动画的变化效果。
     * @param {Number} width 新宽度
     * @param {Number} height 新高度
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
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
    
	 * 一次过设置元素的位置和大小。如果动画效果被打开，高度和宽度都会产生动画的变化效果。
     * @param {Number} x 新位置上的x值（基于页面的坐标）
     * @param {Number} y 新位置上的y值（基于页面的坐标）
     * @param {Number} width 新宽度
     * @param {Number} height 新高度
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
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
    
	 * 设置元素的位置并调整大小到指定的位置。如果动画效果被打开，高度和宽度都会产生动画的变化效果。
     * @param {Ext.lib.Region} region 要填充的区域
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
     * @return {Ext.Element} this
     */
    setRegion : function(region, animate){
        this.setBounds(region.left, region.top, region.right-region.left, region.bottom-region.top, this.preanim(arguments, 1));
        return this;
    },

   /**
     * 为该组件加入事件句柄（event handler）。跟简写方式{@link #on}是一样的。
     * 通常你会更多的使用元素本身{@link Ext.Element#removeListener}的方法。
     * @param {String/HTMLElement}   eventName 侦听事件的类型
     * @param {Function} handler  句柄，事件执行的方法
     * @param {Object}   scope (可选的) 句柄函数执行时所在的作用域。句柄函数“this”的上下文。
     * @param {Object}   options (可选的) 包含句柄配置属性的一个对象。该对象可能会下来的属性：<ul>
     * <li>scope {Object} 句柄函数执行时所在的作用域。句柄函数“this”的上下文。</li>
     * <li>delegate {String} 一个简易选择符，用于过滤目标，或是查找目标的子孙。</li>
     * <li>stopEvent {Boolean} true表示为阻止事件。即停止传播、阻止默认动作。</li>
     * <li>preventDefault {Boolean} true表示为阻止默认动作</li>
     * <li>stopPropagation {Boolean} true表示为阻止事件传播</li>
     * <li>normalized {Boolean} false表示对句柄函数传入一个浏览器对象代替Ext.EventObject</li>    
     * <li>delay {Number} 触发事件后开始执行句柄的延时时间（invocation：the act of making a particular function start），单位：毫秒</li>
     * <li>single {Boolean} true代表为下次事件触发加入一个要处理的句柄，然后再移除本身。</li> 
     * <li>buffer {Number} 指定一个毫秒数，会将句柄安排到{@link Ext.util.DelayedTask}延时之后才执行 . 
     * 如果事件在那个事件再次触发，则原句柄将<em>不会</em> 被启用，但是新句柄会安排在其位置。</li>
     * </ul><br>
     * <p>参阅{@link Ext.Element#addListener}的例子已了解如何使用这些选项。</p>
     * <p>
     * <b>Combining Options</b><br>
     * In the following examples, the shorthand form {@link #on} is used rather than the more verbose
     * addListener.  The two are equivalent.  Using the options argument, it is possible to combine different
     * types of listeners:<br>
     * <br>
     * A normalized, delayed, one-time listener that auto stops the event and passes a custom argument (forumId)<div style="margin: 5px 20px 20px;">
     * Code:<pre><code>
el.on('click', this.onClick, this, {
    single: true,
    delay: 100,
    stopEvent : true,
    forumId: 4
});</code></pre>
     * <p>
     * <b>Attaching multiple handlers in 1 call</b><br>
      * The method also allows for a single argument to be passed which is a config object containing properties
     * which specify multiple handlers.
     * <p>
     * Code:<pre><code>
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
});</code></pre>
     * <p>
     * Or a shorthand syntax:<br>
     * Code:<pre><code>
el.on({
    'click' : this.onClick,
    'mouseover' : this.onMouseOver,
    'mouseout' : this.onMouseOut,
    scope: this
});</code></pre>
     */
    addListener : function(eventName, fn, scope, options){
        Ext.EventManager.on(this.dom,  eventName, fn, scope || this, options);
    },

    /**
     * 从这个元素上移除事件句柄（event handler），跟简写方式{@link #un}是一样的。
     * 举例：
 	 * <pre><code>
     el.removeListener('click', this.handlerFn);
     //或
	 el.un('click', this.handlerFn);
	 </code></pre>
	 * @param {String} eventName 要移除事件的类型
	 * @param {Function} fn 事件执行的方法
	 * @return {Ext.Element} this
     */    
    removeListener : function(eventName, fn){
        Ext.EventManager.removeListener(this.dom,  eventName, fn);
        return this;
    },

    /**
    
     * 在该元素身上移除所有已加入的侦听器
	 * @return {Ext.Element} this
     */
    removeAllListeners : function(){
        E.purgeElement(this.dom);
        return this;
    },

    /**
     * 创建此元素的事件句柄，由此元素接替另外的对象触发和处理事件。
     * @param {String} eventName 要接替的事件名称
     * @param {Object} object 任何继承自{@link Ext.util.Observable}的对象用于在上下文里触发接替的事件
     */
    relayEvent : function(eventName, observable){
        this.on(eventName, function(e){
            observable.fireEvent(eventName, e);
        });
    },

    /**
	 * 设置元素透明度
     * @param {Float} opacity 新的透明度。 0 = 透明, .5 = 50% 可见, 1 =完全可见, 等等
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
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
	 * 获取X坐标
     * @param {Boolean} local true表示为获取局部CSS位置代替页面坐标
     */
    getLeft : function(local){
        if(!local){
            return this.getX();
        }else{
            return parseInt(this.getStyle("left"), 10) || 0;
        }
    },

    /**
	 * 获取元素的右X坐标 (元素X位置 + 元素宽度)
     * @param {Boolean} local True ：获取局部CSS位置代替页面坐标
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
	 * 获取顶部Y坐标
     * @param {Boolean} local  ：获取局部CSS位置代替页面坐标
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
	 * 获取元素的底部Y坐标 (元素Y位置 + 元素宽度)
     * @param {Boolean} local True ：获取局部CSS位置代替页面坐标
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
    * 初始化元素的定位。
    * 如果不传入一个特定的定位，而又还没定位的话，将会使这个元素 相对（relative）定位
    * @param {String} pos （可选的）  使用 "relative", "absolute" 或 "fixed"的定位
    * @param {Number} zIndex （可选的） z-Index值
    * @param {Number} x （可选的）设置页面 X方向位置
    * @param {Number} y （可选的） 设置页面 Y方向位置
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
	* 当文档加载后清除位置并复位到默认
    * @param {String} value （可选的） 用于 left,right,top,bottom的值, 默认为 '' (空白字符串). 你可使用 'auto'.
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
	* 获取一个包含CSS定位的对象
    * 有用的技巧：连同setPostioning一起，可在更新执行之前，先做一个快照（snapshot），之后便可恢复该元素。
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
     * 获取指定边（side(s)）的 border(s)宽度
     * @param {String} side可以是 t, l, r, b或是任何组合
     * 例如，传入lr的参数会得到(l)eft padding +(r)ight padding
     * @return {Number} 四边的padding之和
	 */
    getBorderWidth : function(side){
        return this.addStyles(side, El.borders);
    },

    /**
	 * 获取指定边（side(s)）的padding宽度
     * @param {String} side 可以是 t, l, r, b或是任何组合
     * 例如，传入lr的参数会得到(l)eft padding +(r)ight padding
     * @return {Number} 四边的padding之和
	 */
    getPadding : function(side){
        return this.addStyles(side, El.paddings);
    },

    /**
    * 由getPositioning()返回的对象去设置定位
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

    fixDisplay : function(){
        if(this.getStyle("display") == "none"){
            this.setStyle("visibility", "hidden");
            this.setStyle("display", this.originalDisplay); 
            if(this.getStyle("display") == "none"){ 
                this.setStyle("display", "block");
            }
        }
    },

    /**
     * 快速设置left和top（采用默认单位）
	 * @param {String} left CSS的left属性值
     * @param {String} top TCSS的top属性值
     * @return {Ext.Element} this
     */
     setLeftTop : function(left, top){
        this.dom.style.left = this.addUnits(left);
        this.dom.style.top = this.addUnits(top);
        return this;
    },

    /**
	 * 移动这个元素到相对于当前的位置。
     * @param {String} direction 允许的值："l","left" - "r","right" - "t","top","up" - "b","bottom","down".
     * @param {Number} distance 元素移动有多远（像素）
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
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
	 * 保存当前的溢出（overflow），然后进行裁剪元素的溢出部分 - 使用 {@link #unclip}来移除
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
     * 在调用clip()之前，返回原始的裁剪部分（溢出的）
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


    /**
	 * 返回X、Y坐标，由元素已标记好的位置（anchor position）指定。
     * @param {String} anchor （可选的） 指定的标记位置（默认为 "c"）。参阅 {@link #alignTo}可支持的标记好的位置（anchor position）之细节。
     * @param {Object} size （可选的） 用于计算标记位置的对象
     *                       {width: (目标宽度), height: (目标高度)} (默认为元素当前大小)
     * @param {Boolean} local （可选的） true表示为获取局部的(元素相对的 top/left) 标记的位置而非页面坐标
     * @return {Array} [x, y] 包含元素X、Y坐标的数组
	 */
    getAnchorXY : function(anchor, local, s){
        //Passing a different size is useful for pre-calculating anchors,
        //especially for anchored animations that change the el size.

        var w, h, vp = false;
        if(!s){
            var d = this.dom;
            if(d == document.body || d == document){
                vp = true;
                w = D.getViewWidth(); h = D.getViewHeight();
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
		//加入元素的xy偏移
        var o = this.getXY();
        return [x+o[0], y+o[1]];
    },

    /**
	 * 获取该元素对齐另一个元素时候的x,y坐标。参阅 {@link #alignTo}了解可支持的位置值。
     * @param {String/HTMLElement/Ext.Element} element 要对齐的元素
     * @param {String} position 要对齐的位置
     * @param {Array} offsets （可选的） 偏移位置 [x, y]
     * @return {Array} [x, y]
     */
    getAlignToXY : function(el, p, o){
        el = Ext.get(el);
        if(!el || !el.dom){
            throw "Element.alignToXY with an element that doesn't exist";
        }
        var d = this.dom;
        var c = false; 
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
        var a1 = this.getAnchorXY(p1, true);
        var a2 = el.getAnchorXY(p2, false);

        var x = a2[0] - a1[0] + o[0];
        var y = a2[1] - a1[1] + o[1];

        if(c){
            var w = this.getWidth(), h = this.getHeight(), r = el.getRegion();
            var dw = D.getViewWidth()-5, dh = D.getViewHeight()-5;
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

    getConstrainToXY : function(){
        var os = {top:0, left:0, bottom:0, right: 0};

        return function(el, local, offsets, proposedXY){
            el = Ext.get(el);
            offsets = offsets ? Ext.applyIf(offsets, os) : os;

            var vw, vh, vx = 0, vy = 0;
            if(el.dom == document.body || el.dom == document){
                vw = Ext.lib.Dom.getViewWidth();
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

            var moved = false;

            if((x + w) > vr){
                x = vr - w;
                moved = true;
            }
            if((y + h) > vb){
                y = vb - h;
                moved = true;
            }
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
    }(),

    adjustForConstraints : function(xy, parent, offsets){
        return this.getConstrainToXY(parent || document, false, offsets, xy) ||  xy;
    },

    /**
    

	 * 对齐元素到另外一个元素的指定的标记。如果这个元素是document，对齐到视图
     * 位置参数是可选的, 可指定为下列格式：
     * <ul>
     *   <li><b>空白</b>: 默认为 aligning the element"s top-left corner to
     * the target"s bottom-left corner ("tl-bl").</li>
     *   <li><b>有一个锚点（）One anchor (deprecated)</b>: The passed anchor position is used as the target element's anchor point.
     *       The element being aligned will position its top-left corner (tl) to
     * that point.  <i>This method has been
     *       deprecated in favor of the newer two anchor syntax below</i>.</li>
     *   <li><b>有两个锚点</b>:
     *  If two values from the table below are passed separated by a dash,
     * the first value is used as the
     *       element"s anchor point, and the second value is used as the target"s anchor point.</li>
     * </ul>

     
	 * 下列可支持的锚点位置：
<pre>
值     描述
-----  -----------------------------
tl     The top left corner (default)
t      The center of the top edge
tr     The top right corner
l      The center of the left edge
c      In the center of the element
r      The center of the right edge
bl     The bottom left corner
b      The center of the bottom edge
br     The bottom right corner
</pre>
Example Usage:
使用范例：
<pre><code>
// align el to other-el using the default positioning ("tl-bl", non-constrained)
el.alignTo("other-el");

// align the top left corner of el with the top right corner of other-el (constrained to viewport)
el.alignTo("other-el", "tr?");

// align the bottom right corner of el with the center left edge of other-el
el.alignTo("other-el", "br-l?");

// align the center of el with the bottom left corner of other-el and
// adjust the x position by -6 pixels (and the y position by 0)
el.alignTo("other-el", "c-bl", [-6, 0]);
</code></pre>
     * @param {Mixed} element The element to align to.
     * @param {String} position The position to align to.
     * @param {Array} offsets (optional) Offset the positioning by [x, y]
     * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
     * @return {Ext.Element} this
     * 
	 * @param {String/HTMLElement/Ext.Element} element 要对齐的元素
     * @param {String} position 要对齐的位置
     * @param {Array} offsets （可选的） 偏移位置 [x, y]
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
     * @return {Ext.Element} this
     */
    alignTo : function(element, position, offsets, animate){
        var xy = this.getAlignToXY(element, position, offsets);
        this.setXY(xy, this.preanim(arguments, 3));
        return this;
    },

    /**
	 * 标记一个元素到另外一个元素，并当window resiz时重新对齐。
     * @param {String/HTMLElement/Ext.Element} element 要对齐的元素
     * @param {String} position 要对齐的位置
     * @param {Array} offsets （可选的） 偏移位置 [x, y]
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
     * @param {Boolean/Number} monitorScroll （可选的） true表示为监视body滚动并重新定位。如果该参数是一个数字，即意味有缓冲延时（默认为 50ms）
     * @param {Function} callback 动画完成后执行的函数
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
     * Clears any opacity settings from this element. Required in some cases for IE.
     * 清除这个元素的透明度设置。IE有时候会用到
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
	 * 隐藏此元素 -使用display mode 来决定用 "display" 抑或 "visibility"。 参阅 {@link #setVisible}.
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
     * @return {Ext.Element} this
     */
    hide : function(animate){
        this.setVisible(false, this.preanim(arguments, 0));
        return this;
    },

    /**
	* 显示此元素 -使用display mode 来决定用 "display" 抑或 "visibility"。 参阅 {@link #setVisible}.
    * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
    * @return {Ext.Element} this
     */
    show : function(animate){
        this.setVisible(true, this.preanim(arguments, 0));
        return this;
    },

    /**
     * @私有的 测试某个尺寸是否有单位，否则加入默认单位。
	 */
    addUnits : function(size){
        return Ext.Element.addUnits(size, this.defaultUnit);
    },

    /**
	* 更新该元素的innerHTML,遇到脚本可以执行。
    * @param {String} html 新的HTML
    * @param {Boolean} loadScripts （可选的） true表示为遇到脚本要执行
    * @param {Function} callback  当更新完成后，你加载一个同步脚本，得知更新完成。
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
	 * 直接访问Updater的{@link Ext.Updater#update}方法（相同的参数）
     * @param {String/Function} url 针对该请求的url或是能返回url的函数
     * @param {String/Object} params（可选的）作为url一部分的参数，可以是已编码的字符串"param1=1&amp;param2=2"，或是一个对象{param1: 1, param2: 2}
     * @param {Function} callback （可选的）请求往返完成后的回调，调用时有参数(oElement, bSuccess)
     * @param {Boolean} discardUrl （可选的）默认情况下你执行一次更新后，最后一次url会保存到defaultUrl。如果true的话，将不会保存。
     * @return {Ext.Element} this
     */
    load : function(){
        var um = this.getUpdater();
        um.update.apply(um, arguments);
        return this;
    },

    /**
	* 获取这个元素的UpdateManager
    * @return {Ext.UpdateManager} The Updater
    */
    getUpdater : function(){
        if(!this.updateManager){
            this.updateManager = new Ext.Updater(this);
        }
        return this.updateManager;
    },

    /**
     * 禁止该元素的文本可被选择（可跨浏览器）。
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
    * 计算该元素的x，y到屏幕中心的值
	* @return {Array} The x, y values [x, y]
    */
    getCenterXY : function(){
        return this.getAlignToXY(document, 'c-c');
    },

    /**
    * 在视图或其他元素中，居中元素。
    * @param {String/HTMLElement/Ext.Element} centerIn （可选的）视图或其他元素
	*/
    center : function(centerIn){
        this.alignTo(centerIn || document, 'c-c');
        return this;
    },

    /**
	 * 测试不同的CSS规则/浏览器以确定该元素是否使用Border Box
     * @return {Boolean}
     */
    isBorderBox : function(){
        return noBoxAdjust[this.dom.tagName.toLowerCase()] || Ext.isBorderBox;
    },

    /**
     * 返回一个BOX {x, y, width, height}，可用于匹配其他元素的大小/位置。
     * @param {Boolean} contentBox （可选的）true表示为返回元素内容的BOX。
     * @param {Boolean} local （可选的） true表示为返回元素的left和top代替页面的x/y。
     * @return {Object}
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
     * 参阅getBorderWidth()以得到更多sides的资料
     * @param {String} sides
     * @return {Number}
     */
    getFrameWidth : function(sides, onlyContentBox){
        return onlyContentBox && Ext.isBorderBox ? 0 : (this.getPadding(sides) + this.getBorderWidth(sides));
    },

    /**
	 * 设置元素之Box。使用getBox() 在其他对象身上获取box对象。
     * 如果动画为true，那么高度和宽度都会同时出现动画效果。
     * @param {Object} box 填充的Box {x, y, width, height}
     * @param {Boolean} adjust （可选的） 是否自动调整由box-mode问题引起的高度和宽度设置
     * @param {Boolean/Object} animate （可选的） true表示为为默认动画，或有一个标准元素动画配置的对象
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
     * 强制浏览器重新渲染该元素
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
	 * 返回该元素的top、left、right 和 bottom 属性，以表示margin（外补丁）。
     * 若有sides参数传入，即返回已计算好的sides宽度。
     * @param {String} sides （可选的） 任何 l, r, t, b的组合，以获取该 sides的统计。
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
     * 创建代理（Proxy），即元素的元素
     * @param {String/Object} config 代理元素的类名称或是DomHelper配置项对象
     * @param {String/HTMLElement} renderTo （可选的） 成为代理的元素或是元素ID (默认为 document.body)
     * @param {Boolean} matchBox （可选的） true表示为立即和代理对齐和设置大小 (默认为 false)
     * @return {Ext.Element} 新代理元素
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
     * 在元素身上遮上一个蒙板（mask），以禁止用户操作。须core.css。
     * 这个方法只能用于接受子节点（child nodes）的元素。
     * @param {String} msg （可选的） 蒙板显示的信息
     * @param {String} msgCls （可选的） 信息元素的CSS类
     * @return {Element} 信息元素
	 */
    mask : function(msg, msgCls){
        if(this.getStyle("position") == "static"){
            this.setStyle("position", "relative");
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
        if(Ext.isIE && !(Ext.isIE7 && Ext.isStrict) && this.getStyle('height') == 'auto'){
            this._mask.setSize(this.dom.clientWidth, this.getHeight());
        }
        return this._mask;
    },

    /**
     * 移除之前的蒙板。
     * 如果removeEl是true，则蒙板会被摧毁，否则放在缓存cache中。
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
        this.removeClass("x-masked");
    },

    /**
     * 返回true表示为这个元素应用了蒙板。
	 * @return {Boolean}
     */
    isMasked : function(){
        return this._mask && this._mask.isVisible();
    },

    /**
	 * 创建一个iframe垫片来使得select和其他windowed对象在该元素显示之下。
     * @return {Ext.Element} 新垫片元素
     */
    createShim : function(){
        var el = document.createElement('iframe');
        el.frameBorder = 'no';
        el.className = 'ext-shim';
        if(Ext.isIE && Ext.isSecure){
            el.src = Ext.SSL_SECURE_URL;
        }
        var shim = Ext.get(this.dom.parentNode.insertBefore(el, this.dom));
        shim.autoBoxAdjust = false;
        return shim;
    },

    /**
     * 从DOM里面移除该元素，并从缓存中删除。
	 */
    remove : function(){
        Ext.removeNode(this.dom);
        delete El.cache[this.dom.id];
    },

    /**
	 * 设置事件句柄，当鼠标在此元素之上作用的Css样式类。自动过滤因mouseout事件引起在子元素上的轻移（Flicker）
     * @param {Function} overFn
     * @param {Function} outFn
     * @param {Object} scope （可选的）
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
     * 设置事件句柄，当此鼠标位于元素上方时作用的CSS样式类。
     * @param {String} className
     * @param {Boolean} preventFlicker （可选的） 如果为true，会阻止因mouseout事件引起在子元素上的轻移（Flicker）
     * @return {Ext.Element} this
     */
    addClassOnOver : function(className, preventFlicker){
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
     * 设置事件句柄，当此元素得到焦点（focus）时作用的CSS样式类。
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
     * 当鼠标在该元素上面按下接着松开（即单击效果），设置event handlers来添加和移除css类。
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
     * @param {String} eventName
     * @param {Boolean} preventDefault （可选的）true表示阻止默认动作
     * @return {Ext.Element} this
     */
    swallowEvent : function(eventName, preventDefault){
        var fn = function(e){
            e.stopPropagation();
            if(preventDefault){
                e.preventDefault();
            }
        };
        if(eventName instanceof Array){
            for(var i = 0, len = eventName.length; i < len; i++){
                 this.on(eventName[i], fn);
            }
            return this;
        }
        this.on(eventName, fn);
        return this;
    },

    /**
     * 获取此节点的父级元素
     * @param {String} selector (optional) 通过简易选择符来查找下一个侧边节点
     * @param {Boolean} returnDom (optional) True表示返回原始的dom节点而非Ext.Element
     * @return {Ext.Element/HTMLElement} 下一个侧边节点或null
	 */
    parent : function(selector, returnDom){
        return this.matchNode('parentNode', 'parentNode', selector, returnDom);
    },

     /**
     * 获取下一个侧边节点，跳过文本节点
     * @param {String} selector (optional) 通过简易选择符来查找下一个侧边节点
     * @param {Boolean} returnDom (optional) True表示返回原始的dom节点而非Ext.Element
     * @return {Ext.Element/HTMLElement} 下一个侧边节点或null
	 */
    next : function(selector, returnDom){
        return this.matchNode('nextSibling', 'nextSibling', selector, returnDom);
    },

    /**
     * 获取上一个侧边节点，跳过文本节点
     * @param {String} selector (optional) 通过简易选择符来查找上一个侧边节点
     * @param {Boolean} returnDom (optional) True表示返回原始的dom节点而非Ext.Element
     * @return {Ext.Element/HTMLElement} 上一个侧边节点或null
	 */
    prev : function(selector, returnDom){
        return this.matchNode('previousSibling', 'previousSibling', selector, returnDom);
    },


    /**
     * 获取第一个子元素，跳过文本节点
     * @param {String} selector (optional) 通过简易选择符来查找第一个子元素
     * @param {Boolean} returnDom (optional) True表示返回原始的dom节点而非Ext.Element
     * @return {Ext.Element/HTMLElement} 第一个子元素或null
	 */
    first : function(selector, returnDom){
        return this.matchNode('nextSibling', 'firstChild', selector, returnDom);
    },

    /**
     * 获取最后一个子元素，跳过文本节点
     * @param {String} selector (optional) 通过简易选择符来查找最后一个元素
     * @param {Boolean} returnDom (optional) True表示返回原始的dom节点而非Ext.Element
     * @return {Ext.Element/HTMLElement} 最后一个元素或null
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
     * 传入一个或多个元素，加入到该元素
	 * @param {String/HTMLElement/Array/Element/CompositeElement} el
     * @return {Ext.Element} this
     */
    appendChild: function(el){
        el = Ext.get(el);
        el.appendTo(this);
        return this;
    },

    /**
	 * 传入一个DomHelper配置项对象的参数，将其创建并加入其到该元素；
     * 可选地，可指定在其子元素（哪个子元素由参数传入）之前的地方插入。
     * @param {Object} config DomHelper元素配置项对象
     * @param {HTMLElement} insertBefore （可选的） 该元素的子元素
     * @param {Boolean} returnDom （可选的） true表示为返回标准的DOM节点而非一个Ext.Element类型的元素
     * @return {Ext.Element} 新的子元素
     */
    createChild: function(config, insertBefore, returnDom){
        config = config || {tag:'div'};
        if(insertBefore){
            return Ext.DomHelper.insertBefore(insertBefore, config, returnDom !== true);
        }
        return Ext.DomHelper[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config,  returnDom !== true);
    },

    /**
	 * 传入元素的参数，将该元素加入到传入的元素
     * @param {String/HTMLElement/Element} el 新父元素
     * @return {Ext.Element} this
     */
    appendTo: function(el){
        el = Ext.getDom(el);
        el.appendChild(this.dom);
        return this;
    },

    /**
	 * 传入元素的参数，将该元素的DOM插入其之前
     * @param {String/HTMLElement/Element} el 在它前面插入的那个元素
     * @return {Ext.Element} this
     */
    insertBefore: function(el){
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el);
        return this;
    },

    /**
	 * 传入元素的参数，将该元素的DOM插入其之后
     * @param {String/HTMLElement/Element} el 在它后面插入的那个元素
     * @return {Ext.Element} this
     */
    insertAfter: function(el){
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el.nextSibling);
        return this;
    },

    /**
	 * 插入（或创建）一个元素（或DomHelper配置项对象）作为该元素的第一个子元素
     * @param {String/HTMLElement/Element/Object} el 可以是id；或是插入的元素；或是要创建和插入的DomHelper配置项对象
     * @return {Ext.Element} 新子元素
     */
    insertFirst: function(el, returnDom){
        el = el || {};
        if(typeof el == 'object' && !el.nodeType){ // dh config
            return this.createChild(el, this.dom.firstChild, returnDom);
        }else{
            el = Ext.getDom(el);
            this.dom.insertBefore(el, this.dom.firstChild);
            return !returnDom ? Ext.get(el) : el;
        }
    },

    /**
	 * 插入（或创建）一个元素（或DomHelper配置项对象）作为该元素的侧边节点。
     * @param {String/HTMLElement/Element/Object} el 可以是id；或是插入的元素；或是要创建和插入的DomHelper配置项对象
     * @param {String} where （可选的） 'before' 或 'after' 默认为before
     * @param {Boolean} returnDom （可选的） true表示返回没加工过的DOM元素而非Ext.Element
     * @return {Ext.Element} 被插入的元素
     */
    insertSibling: function(el, where, returnDom){
        var rt;
        if(el instanceof Array){
            for(var i = 0, len = el.length; i < len; i++){
                rt = this.insertSibling(el[i], where, returnDom);
            }
            return rt;
        }
        where = where ? where.toLowerCase() : 'before';
        el = el || {};
        var refNode = where == 'before' ? this.dom : this.dom.nextSibling;

        if(typeof el == 'object' && !el.nodeType){ // dh config
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
     * 创建和打包（warp）该元素和其他元素
     * @param {Object} config （可选的） 包裹元素（null的话则是一个空白的div）的DomHelper配置项对象
     * @param {Boolean} returnDom （可选的） true表示为返回没加工过的DOM元素，而非Ext.Element
     * @return {/HTMLElementElement} 刚创建好的包裹元素
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
	 * 用于当前这个元素替换传入的元素
     * @param {Mixed} el 要替换的元素
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
     * @param {Mixed/Object} el 新元素或是要创建的DomHelper配置项对象
     * @return {Ext.Element} this
     */
    replaceWith: function(el){
        if(typeof el == 'object' && !el.nodeType){ // dh config
            el = this.insertSibling(el, 'before');
        }else{
            el = Ext.getDom(el);
            this.dom.parentNode.insertBefore(el, this.dom);
        }
        El.uncache(this.id);
        this.dom.parentNode.removeChild(this.dom);
        this.dom = el;
        this.id = Ext.id(el);
        El.cache[this.id] = this;
        return this;
    },

    /**
     * 插入HTML片断到这个元素
     * @param {String} where 要插入的html放在元素的哪里 - beforeBegin, afterBegin, beforeEnd, afterEnd.
     * @param {String} html HTML片断
     * @param {Boolean} returnEl true表示为返回一个Ext.Element
     * @return {HTMLElement} 被插入之节点（或最近的，如果超过一处插入的话）
	 */
    insertHtml : function(where, html, returnEl){
        var el = Ext.DomHelper.insertHtml(where, this.dom, html);
        return returnEl ? Ext.get(el) : el;
    },

    /**
	 * 传入属性（attributes）的参数，使之成为该元素的属性（一个样式的属性可以是字符串，对象或函数function）
     * @param {Object} o 属性对象
     * @param {Boolean} useSet （可选的） false表示为用expandos来重写默认的setAttribute
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
	 * 构建KeyMap的快捷方式
     * @param {Number/Array/Object/String} key 可侦听代码的数值、key代码的数组的字串符，或者是像这样的object: {key: (number or array), shift: (true/false), ctrl: (true/false), alt: (true/false)}
     * @param {Function} fn 调用的函数
     * @param {Object} scope （可选的） 函数的作用域
     * @return {Ext.KeyMap} 创建好的KeyMap
     */
    addKeyListener : function(key, fn, scope){
        var config;
        if(typeof key != "object" || key instanceof Array){
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
	 * 为该元素创建一个KeyMap
     * @param {Object} config KeyMap配置项。参阅 {@link Ext.KeyMap}
     * @return {Ext.KeyMap} 创建好的KeyMap
     */
    addKeyMap : function(config){
        return new Ext.KeyMap(this, config);
    },

    /**   
	 * 返回true表示为该元素是可滚动的
     * @return {Boolean}
     */
     isScrollable : function(){
        var dom = this.dom;
        return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
    },

    /**
	 * 滚动该元素到指定的滚动点（scroll point）。
     * 它不会边界检查所以若果你滚动到一个不合理的值时它也会试着去做。
     * 要自动检查边界，请使用scroll()。
     * @param {String} side 即可 "left" 对应scrollLeft的值，也可以 "top" 对于scrollTop的值.
     * @param {Number} value 新滚动值
     * @param {Boolean/Object} animate （可选的） true表示为默认动画，或有一个标准元素动画配置的对象
     * @return {Element} this
     */
    scrollTo : function(side, value, animate){
        var prop = side.toLowerCase() == "left" ? "scrollLeft" : "scrollTop";
        if(!animate || !A){
            this.dom[prop] = value;
        }else{
            var to = prop == "scrollLeft" ? [value, this.dom.scrollTop] : [this.dom.scrollLeft, value];
            this.anim({scroll: {"to": to}}, this.preanim(arguments, 2), 'scroll');
        }
        return this;
    },

    /**
	 
	 * 滚动该元素到指定的方向。须确认元素可滚动的范围，以免滚动超出元素可滚动的范围。
     * @param {String} direction 可能出现的值: "l","left" - "r","right" - "t","top","up" - "b","bottom","down".
     * @param {Number} distance 元素滚动有多远（像素）
     * @param {Boolean/Object} animate （可选的） true表示为默认动画，或有一个标准元素动画配置的对象
     * @return {Boolean} true表示为滚动是轮换的；false表示为元素能滚动其最远的
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
    },

    /**
	 * 传入一个页面坐标的参数，将其翻译到元素的CSS left/top值。
     * @param {Number/Array} x 页面x or 数组 [x, y]
     * @param {Number} y 页面 y
     * @param {Object} 包含left、top属性的对象，如 {left: (值), top: (值)}
	 */
    translatePoints : function(x, y){
        if(typeof x == 'object' || x instanceof Array){
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
     * @return {Object} 包含滚动位置的对象，格式如 {left: (scrollLeft), top: (scrollTop)}
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
	 * 为指定的CSS属性返回CSS颜色。RGB、三位数(像#fff)和有效值都被转换到标准六位十六进制的颜色
     * @param {String} attr CSS属性
     * @param {String} defaultValue 当找不到有效的颜色时所用的默认值
     * @param {String} prefix （可选的） 默认为 #。应用到YUI颜色动画时须为空白字串符
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
// 基本box打包
Ext.get("foo").boxWrap();

Ext.get("foo").boxWrap().addClass("x-box-blue");
</pre></code>
     * @param {String} class （可选的）一个CSS基类，应用到包裹元素（默认为'x-box'）。
     * 注意有许多依赖该CSS规则来产生整体的效果。
     * 所以你提供一个交替的基样式，必须保证你所提供的都是所需的规则。
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
     * @param {String} namespace 要查找属性所在的命名空间
     * @param {String} name 属性名称
     * @return {String} 属性值
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
    },

    getTextWidth : function(text, min, max){
        return (Ext.util.TextMetrics.measure(this.dom, Ext.value(text, this.dom.innerHTML, true)).width).constrain(min || 0, max || 1000000);
    }
};

var ep = El.prototype;

/**
 * 加入一个事件句柄（addListener的简写方式）
 * @param {String}   eventName    加入事件的类型
 * @param {Function} fn         事件执行的方法
 * @param {Object} scope       （可选的）函数之作用域 (这个元素)
 * @param {Object}   options   （可选的）标准的{@link #addListener} 配置项对象
 * @member Ext.Element
 * @method on
 */
ep.on = ep.addListener;
    // backwards compat
ep.mon = ep.addListener;

ep.getUpdateManager = ep.getUpdater;

/**
 * 从这个元素上移除一个event handler（{@link #removeListener}的简写方式）
 * @param {String} eventName 要移除事件的类型
 * @param {Function} fn 事件执行的方法

 * @return {Ext.Element} this
 * @member Ext.Element
 * @method un
 */
ep.un = ep.removeListener;

/**
 * true表示为自动调整由box-mode问题引起的高度和宽度设置（默认true）。
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

El.boxMarkup = '<div class="{0}-tl"><div class="{0}-tr"><div class="{0}-tc"></div></div></div><div class="{0}-ml"><div class="{0}-mr"><div class="{0}-mc"></div></div></div><div class="{0}-bl"><div class="{0}-br"><div class="{0}-bc"></div></div></div>';
/**
 * 显示模式（Visibility mode）的常量 - 使用Visibility来隐藏元素
 * @static
 * @property Element.VISIBILITY 
 */
El.VISIBILITY = 1;
/**
 * 显示模式（Visibility mode）的常量 - 使用Display来隐藏元素
 * @static
 * @property Element.DISPLAY 
 */
El.DISPLAY = 2;

El.borders = {l: "border-left-width", r: "border-right-width", t: "border-top-width", b: "border-bottom-width"};
El.paddings = {l: "padding-left", r: "padding-right", t: "padding-top", b: "padding-bottom"};
El.margins = {l: "margin-left", r: "margin-right", t: "margin-top", b: "margin-bottom"};


El.cache = {};

var docEl;

/**
 * 获取元素对象的静态方法。
 * 如果是相同的对象的话，只是从缓存中提取。
 * Automatically fixes if an object was recreated with the same id via AJAX or DOM.
 * @param {Mixed} el 节点的id，一个DOM节点或是已存在的元素。,
 * @return {Element} 元素对象
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
    }else if(el.tagName){
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
            el.dom = document.getElementById(el.id) || el.dom; 
                                                         
            El.cache[el.id] = el; 
        }
        return el;
    }else if(el.isComposite){
        return el;
    }else if(el instanceof Array){
        return El.select(el);
    }else if(el == document){
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

El.uncache = function(el){
    for(var i = 0, a = arguments, len = a.length; i < len; i++) {
        if(a[i]){
            delete El.cache[a[i].id || a[i]];
        }
    }
};

El.garbageCollect = function(){
    if(!Ext.enableGarbageCollector){
        clearInterval(El.collectorThread);
        return;
    }
    for(var eid in El.cache){
        var el = El.cache[eid], d = el.dom;
      
        if(!d || !d.parentNode || (!d.offsetParent && !document.getElementById(eid))){
            delete El.cache[eid];
            if(d && Ext.enableListenerCollection){
                E.purgeElement(d);
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
 * 获取共享元的元素，传入的节点会成为活动元素。
 * 不保存该元素的引用（reference）－可由其它代码重写dom节点。
 * @param {String/HTMLElement} el Dom节点或id
 * @param {String} named （可选的） 为避免某些冲突（如在ext内部的“_internal”），可另外起一个名字。
 * @static
 * @return {Element} 共享的Element对象（null表示为找不到元素）
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
 * 如果是相同的对象的话，只是从缓存中提取。
 * @param {String/HTMLElement/Element} el 节点的id，一个DOM节点或是已存在的元素。,
 * @return {Element} Element对象

 * @member Ext
 * @method get
 */
Ext.get = El.get;
/**
 * 获取共享元的元素，传入的节点会成为活动元素。
 * 不保存该元素的引用（reference）－可由其它代码重写dom节点。
 * {@link Ext.Element#fly}的简写方式。
 * @param {String/HTMLElement} el Dom节点或id
 * @param {String} named （可选的）为避免某些冲突（如在ext内部的“_internal”），可另外起一个名字。
 * @static
 * @return {Element} 共享的Element对象
 * @member Ext
 * @method fly
 */
Ext.fly = El.fly;

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