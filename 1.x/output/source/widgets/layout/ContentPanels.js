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
 * @class Ext.ContentPanel
 * @extends Ext.util.Observable
 * 一个基础性的ContentPanel元素。
 * @cfg {Boolean} fitToFrame 设置为True，使得当区域调整大小后，面板会调整自己大小来配合
 * @cfg {Boolean} fitContainer 与fitToFrame和resizeEl一起作用，你可以使面板来适配其父容器.(默认值为 false)
 * @cfg {Boolean/Object} autoCreate 设置为True,用来为该面板自动生成DOM元素,或通过元素配置来创建
 * @cfg {Boolean} closable 设置为True，那么面板能够被关闭或移除，
 * @cfg {Boolean} background 设置为True，那么当添加一个面板时，该面板不会被激活(默认值：false)
 * @cfg {String/HTMLElement/Element} resizeEl 如果fitToFrame属性设置为true,该元素重新构建(代替掉面板的对象)
 * @cfg {Toolbar} toolbar 该面板的工具条
 * @cfg {Boolean} autoScroll 设置为True，使得在该面板中滚动超出的部分 (与{@link #fitToFrame}联合使用)
 * @cfg {String} title 该面板的标题
 * @cfg {Array} 当进行fitToFrame时,进行的宽或高的调整值(默认值 [0, 0])
 * @cfg {String} url 调用{@link #setUrl}方法时，使用此值
 * @cfg {String/Object} params 对{@link #url}地址发送请求时，调用此值的 {@link #setUrl}方法
 * @cfg {Boolean} loadOnce 与url一起使用,调用setUrl方法时，使用此值
 * @constructor
 * 创建一内容面板ContentPanel.
 * @param {String/HTMLElement/Ext.Element} el 该面板的容器对象
 * @param {String/Object} config 参数有两种，当为字符串(仅来设置标题)或配置对象
 * @param {String} content (可选项)设置该面板的html内容
 */
Ext.ContentPanel = function(el, config, content){
    if(el.autoCreate){
        config = el;
        el = Ext.id();
    }
    this.el = Ext.get(el);
    if(!this.el && config && config.autoCreate){
        if(typeof config.autoCreate == "object"){
            if(!config.autoCreate.id){
                config.autoCreate.id = config.id||el;
            }
            this.el = Ext.DomHelper.append(document.body,
                        config.autoCreate, true);
        }else{
            this.el = Ext.DomHelper.append(document.body,
                        {tag: "div", cls: "x-layout-inactive-content", id: config.id||el}, true);
        }
    }
    this.closable = false;
    this.loaded = false;
    this.active = false;
    if(typeof config == "string"){
        this.title = config;
    }else{
        Ext.apply(this, config);
    }
    if(this.resizeEl){
        this.resizeEl = Ext.get(this.resizeEl, true);
    }else{
        this.resizeEl = this.el;
    }
    this.addEvents({
        /**
         * @event activate
         * 当该面板活动时(被激活时)触发该事件. 
         * @param {Ext.ContentPanel} this
         */
        "activate" : true,
        /**
         * @event deactivate
         * 当该面板从脱离活动状态时触发该事件 
         * @param {Ext.ContentPanel} this
         */
        "deactivate" : true,

        /**
         * @event resize
         * 当fitToFrame设置为true条件下，面板被重设大小时触发该事件
         * @param {Ext.ContentPanel} this
         * @param {Number} width 组件调整后的任意宽度
         * @param {Number} height 组件调整后的任意高度
         */
        "resize" : true
    });
    if(this.autoScroll){
        this.resizeEl.setStyle("overflow", "auto");
    }
    content = content || this.content;
    if(content){
        this.setContent(content);
    }
    if(config && config.url){
        this.setUrl(this.url, this.params, this.loadOnce);
    }
    Ext.ContentPanel.superclass.constructor.call(this);
};

Ext.extend(Ext.ContentPanel, Ext.util.Observable, {
    tabTip:'',
    setRegion : function(region){
        this.region = region;
        if(region){
           this.el.replaceClass("x-layout-inactive-content", "x-layout-active-content");
        }else{
           this.el.replaceClass("x-layout-active-content", "x-layout-inactive-content");
        } 
    },
    
    /**
     * 返回该面板的工具栏(如果被配的话)
     * @return {Ext.Toolbar} 
     */
    getToolbar : function(){
        return this.toolbar;
    },
    
    setActiveState : function(active){
        this.active = active;
        if(!active){
            this.fireEvent("deactivate", this);
        }else{
            this.fireEvent("activate", this);
        }
    },
    /**
     * 更新该面板的元素
     * @param {String} content 新的内容
     * @param {Boolean} loadScripts (可选项) 设置为true的话，寻找并执行脚本
    */
    setContent : function(content, loadScripts){
        this.el.update(content, loadScripts);
    },

    ignoreResize : function(w, h){
        if(this.lastSize && this.lastSize.width == w && this.lastSize.height == h){
            return true;
        }else{
            this.lastSize = {width: w, height: h};
            return false;
        }
    },
    /**
     * 获取该面板的UpdateManager对象.使你能够进行ajax更新
     * @return {Ext.UpdateManager} 返回UpdateManager对象
     */
    getUpdateManager : function(){
        return this.el.getUpdateManager();
    },
     /**
     * 
     * 以xhr的方式获取内容装载到当前内容面板。注意：为了能延时加载（即到该面板变为活动状态时才加载内容），使用setUrl.
     * @param {Object/String/Function} url 一个请求的url，或一个函数（用来获取url）,或一个config对象，里面包括如下内容：
<pre><code>
panel.load({
    url: "your-url.php",
    params: {param1: "foo", param2: "bar"}, // 或者是可URL编码的字符串
    callback: yourFunction,
    scope: yourObject, //（可选的作用域）
    discardUrl: false,
    nocache: false,
    text: "Loading...",
    timeout: 30,
    scripts: false
});
</code></pre>
     * 唯一必需的属性是url,这些可选属性没有缓存，文本和脚本都是用无缓存的速记，提示文本和脚本加载是用来设置他们关联到该面板的更新器实例中的属性
	 * @param {String/Object} params (optional) 这些参数通过编码后的url或一个对象形式来为url传参数。
     * @param {Function} callback (optional) 当传输完成后进行回调，通过（方法）签名来调用，如（oElement,bSuccess,oResponse）
     * @param {Boolean} discardUrl (optional) 默认情况下，当你执行一次更新，这个defaultUrl属性也会变成最后一次用过的url,如果设置为true,那么将不再记录（存贮）这个url。
     * @return {Ext.ContentPanel} this
     */
    load : function(){
        var um = this.el.getUpdateManager();
        um.update.apply(um, arguments);
        return this;
    },


    /**
     * 设置一url用来为该面板装载新内容.当该面板处于活动状态，内容将会被通过url来装载
     * @param {String/Function} url 用来装载新内容的url 或者调用一个函数用来获取URL
     * @param {String/Object} params (可选项) 用于更新的参数或参数对象 See {@link Ext.UpdateManager#update} for more details. (默认情况为： null)
     * @param {Boolean} loadOnce (可选项) 是否仅装载内容一次：如果设置为false.它使得ajax调用时该面板一直处于激活(活动)状态(默认为: false)
     * @return {Ext.UpdateManager} 返回UpdateManager对象
     */
    setUrl : function(url, params, loadOnce){
        if(this.refreshDelegate){
            this.removeListener("activate", this.refreshDelegate);
        }
        this.refreshDelegate = this._handleRefresh.createDelegate(this, [url, params, loadOnce]);
        this.on("activate", this.refreshDelegate);
        return this.el.getUpdateManager();
    },
    
    _handleRefresh : function(url, params, loadOnce){
        if(!loadOnce || !this.loaded){
            var updater = this.el.getUpdateManager();
            updater.update(url, params, this._setLoaded.createDelegate(this));
        }
    },
    
    _setLoaded : function(){
        this.loaded = true;
    }, 
    
    /**
     * 返回面板的id
     * @return {String} 
     */
    getId : function(){
        return this.el.id;
    },
    
    /**
     * 返回该面板的元素
     * @return {Ext.Element} 
     */
    getEl : function(){
        return this.el;
    },
    
    adjustForComponents : function(width, height){
        if(this.resizeEl != this.el){
            width -= this.el.getFrameWidth('lr');
            height -= this.el.getFrameWidth('tb');
        }
        if(this.toolbar){
            var te = this.toolbar.getEl();
            height -= te.getHeight();
            te.setWidth(width);
        }
        if(this.adjustments){
            width += this.adjustments[0];
            height += this.adjustments[1];
        }
        return {"width": width, "height": height};
    },
    
    setSize : function(width, height){
        if(this.fitToFrame && !this.ignoreResize(width, height)){
            if(this.fitContainer && this.resizeEl != this.el){
                this.el.setSize(width, height);
            }
            var size = this.adjustForComponents(width, height);
            this.resizeEl.setSize(this.autoWidth ? "auto" : size.width, this.autoHeight ? "auto" : size.height);
            this.fireEvent('resize', this, size.width, size.height);
        }
    },
    
    /**
     * 返回面板的标题
     * @return {String} 
     */
    getTitle : function(){
        return this.title;
    },
    
    /**
     * 设置面板的标题
     * @param {String} title
     */
    setTitle : function(title){
        this.title = title;
        if(this.region){
            this.region.updatePanelTitle(this, title);
        }
    },
    
    /**
     * 如果该面板被配置成可关闭的刚返回true
     * @return {Boolean} 
     */
    isClosable : function(){
        return this.closable;
    },
    
    beforeSlide : function(){
        this.el.clip();
        this.resizeEl.clip();
    },
    
    afterSlide : function(){
        this.el.unclip();
        this.resizeEl.unclip();
    },
    
    /**
     *   强制从setUrl方法指定的url获取新内容来刷新，如果方法未找到，更新会失败，但页面不会报错.
     *   此方法不会激活该面板，仅仅更新内容.     
     */
    refresh : function(){
        if(this.refreshDelegate){
           this.loaded = false;
           this.refreshDelegate();
        }
    },
    
    /**
     * 消毁该面板
     */
    destroy : function(){
        this.el.removeAllListeners();
        var tempEl = document.createElement("span");
        tempEl.appendChild(this.el.dom);
        tempEl.innerHTML = "";
        this.el.remove();
        this.el = null;
    }
});

/**
 * @class Ext.GridPanel
 * @extends Ext.ContentPanel
 * @constructor
 * 创建一新的GridPanel的对象。
 * @param {Ext.grid.Grid} grid 该面板的grid
 * @param {String/Object} 参数有两种，当为字符串(仅来设置标题)或配置对象
 */
Ext.GridPanel = function(grid, config){
    this.wrapper = Ext.DomHelper.append(document.body, // wrapper for IE7 strict & safari scroll issue
        {tag: "div", cls: "x-layout-grid-wrapper x-layout-inactive-content"}, true);
    this.wrapper.dom.appendChild(grid.getGridEl().dom);
    Ext.GridPanel.superclass.constructor.call(this, this.wrapper, config);
    if(this.toolbar){
        this.toolbar.el.insertBefore(this.wrapper.dom.firstChild);
    }
    grid.monitorWindowResize = false; // turn off autosizing
    grid.autoHeight = false;
    grid.autoWidth = false;
    this.grid = grid;
    this.grid.getGridEl().replaceClass("x-layout-inactive-content", "x-layout-component-panel");
};

Ext.extend(Ext.GridPanel, Ext.ContentPanel, {
    getId : function(){
        return this.grid.id;
    },
    
    /**
     * 返回该面板的grid
     * @return {Ext.grid.Grid} 
     */
    getGrid : function(){
        return this.grid;    
    },
    
    setSize : function(width, height){
        if(!this.ignoreResize(width, height)){
            var grid = this.grid;
            var size = this.adjustForComponents(width, height);
            grid.getGridEl().setSize(size.width, size.height);
            grid.autoSize();
        }
    },
    
    beforeSlide : function(){
        this.grid.getView().scroller.clip();
    },
    
    afterSlide : function(){
        this.grid.getView().scroller.unclip();
    },
    
    destroy : function(){
        this.grid.destroy();
        delete this.grid;
        Ext.GridPanel.superclass.destroy.call(this); 
    }
});


/**
 * @class Ext.NestedLayoutPanel
 * @extends Ext.ContentPanel
 * @constructor
 * 创建一嵌套的面板.
 * @param {Ext.BorderLayout} layout 该面板的布局
 * @param {String/Object} 参数有两种，当为字符串(仅来设置标题)或配置对象
 */
Ext.NestedLayoutPanel = function(layout, config){
    Ext.NestedLayoutPanel.superclass.constructor.call(this, layout.getEl(), config);
    layout.monitorWindowResize = false; // turn off autosizing
    this.layout = layout;
    this.layout.getEl().addClass("x-layout-nested-layout");
};

Ext.extend(Ext.NestedLayoutPanel, Ext.ContentPanel, {

    setSize : function(width, height){
        if(!this.ignoreResize(width, height)){
            var size = this.adjustForComponents(width, height);
            var el = this.layout.getEl();
            el.setSize(size.width, size.height);
            var touch = el.dom.offsetWidth;
            this.layout.layout();
            // ie requires a double layout on the first pass
            if(Ext.isIE && !this.initialized){
                this.initialized = true;
                this.layout.layout();
            }
        }
    },
    
    /**
     * 返回当前面板中的嵌套的面板
     * @return {Ext.BorderLayout} 
     */
    getLayout : function(){
        return this.layout;
    }
});

Ext.ScrollPanel = function(el, config, content){
    config = config || {};
    config.fitToFrame = true;
    Ext.ScrollPanel.superclass.constructor.call(this, el, config, content);
    
    this.el.dom.style.overflow = "hidden";
    var wrap = this.el.wrap({cls: "x-scroller x-layout-inactive-content"});
    this.el.removeClass("x-layout-inactive-content");
    this.el.on("mousewheel", this.onWheel, this);

    var up = wrap.createChild({cls: "x-scroller-up", html: "&#160;"}, this.el.dom);
    var down = wrap.createChild({cls: "x-scroller-down", html: "&#160;"});
    up.unselectable(); down.unselectable();
    up.on("click", this.scrollUp, this);
    down.on("click", this.scrollDown, this);
    up.addClassOnOver("x-scroller-btn-over");
    down.addClassOnOver("x-scroller-btn-over");
    up.addClassOnClick("x-scroller-btn-click");
    down.addClassOnClick("x-scroller-btn-click");
    this.adjustments = [0, -(up.getHeight() + down.getHeight())];

    this.resizeEl = this.el;
    this.el = wrap; this.up = up; this.down = down;
};

Ext.extend(Ext.ScrollPanel, Ext.ContentPanel, {
    increment : 100,
    wheelIncrement : 5,
    scrollUp : function(){
        this.resizeEl.scroll("up", this.increment, {callback: this.afterScroll, scope: this});
    },

    scrollDown : function(){
        this.resizeEl.scroll("down", this.increment, {callback: this.afterScroll, scope: this});
    },

    afterScroll : function(){
        var el = this.resizeEl;
        var t = el.dom.scrollTop, h = el.dom.scrollHeight, ch = el.dom.clientHeight;
        this.up[t == 0 ? "addClass" : "removeClass"]("x-scroller-btn-disabled");
        this.down[h - t <= ch ? "addClass" : "removeClass"]("x-scroller-btn-disabled");
    },

    setSize : function(){
        Ext.ScrollPanel.superclass.setSize.apply(this, arguments);
        this.afterScroll();
    },

    onWheel : function(e){
        var d = e.getWheelDelta();
        this.resizeEl.dom.scrollTop -= (d*this.wheelIncrement);
        this.afterScroll();
        e.stopEvent();
    },

    setContent : function(content, loadScripts){
        this.resizeEl.update(content, loadScripts);
    }

});