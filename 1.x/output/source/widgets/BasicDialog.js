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
 * @class Ext.BasicDialog
 * @extends Ext.util.Observable
 * 轻便的 Dialog 类。下面的代码展示了使用已有的 HTML 标签创建一个典型的对话框：
 * <pre><code>
var dlg = new Ext.BasicDialog("my-dlg", {
    height: 200,
    width: 300,
    minHeight: 100,
    minWidth: 150,
    modal: true,
    proxyDrag: true,
    shadow: true
});
dlg.addKeyListener(27, dlg.hide, dlg); // ESC 也能关闭对话框
dlg.addButton('OK', dlg.hide, dlg);    // 可以调用保存function代替隐藏对话框
dlg.addButton('Cancel', dlg.hide, dlg);
dlg.show();
</code></pre>
  <b>对话框应该为“body”元素的直系子节点。</b>
 * @cfg {Boolean/DomHelper} autoCreate 值为“true”时自动创建，或者使用“DomHelper”对象创建（默认为“false”）。
 * @cfg {String} title 标题栏上默认显示的文字（默认为“null”）。
 * @cfg {Number} width 对话框的宽度，单位像素（也可以通过 CSS 来设置）。如果未指定则由浏览器决定。
 * @cfg {Number} height 对话框的高度，单位像素（也可以通过 CSS 来设置）。如果未指定则由浏览器决定。
 * @cfg {Number} x 对话框默认的顶部坐标（默认为屏幕中央）
 * @cfg {Number} y 对话框默认的左边坐标（默认为屏幕中央）
 * @cfg {String/Element} animateTarget 对话框打开时应用动画的 Id 或者元素（默认值为“null”，表示没有动画）。
 * @cfg {Boolean} resizable 值为“false”时禁止手动调整对话框大小（默认为“true”）。
 * @cfg {String} 设置显示的调整柄，详见 {@link Ext.Resizable} 中调整柄的可用值（默认为“all”）。
 * @cfg {Number} minHeight 对话框高度的最小值（默认为“80”）。
 * @cfg {Number} minWidth 对话框宽度的最小值（默认为“200”）。
 * @cfg {Boolean} modal 值为“true”时模式显示对话框，防止用户与页面的剩余部分交互（默认为“false”）。
 * @cfg {Boolean} autoScroll 值为“true”时允许对话框的主体部分里的内容溢出，并显示滚动条（默认为“false”）。
 * @cfg {Boolean} closable 值为“false”时将移除标题栏右上角的关闭按钮（默认为“true”）。
 * @cfg {Boolean} collapsible 值为“false”时将移除标题栏右上角的最小化按钮（默认为“true”）。
 * @cfg {Boolean} constraintoviewport 值为“true”时将保持对话框限定在可视区的边界内（默认为“true”）。
 * @cfg {Boolean} syncHeightBeforeShow 值为“true”时则在对话框显示前重新计算高度（默认为“false”）。
 * @cfg {Boolean} draggable 值为“false”时将禁止对话框在可视区内的拖动（默认为“true”）。
 * @cfg {Boolean} autoTabs 值为“true”时，所有 class 属性为“x-dlg-tab”的元素将被自动转换为 tabs（默认为“false”）。
 * @cfg {String} tabTag “tab”元素的标签名称，当 autoTabs = true 时使用（默认为“div”）。
 * @cfg {Boolean} proxyDrag 值为“true”时拖动对话框会显示一个轮廓，当“draggable”为“true”时使用（默认为“false”）。
 * @cfg {Boolean} fixedcenter 值为“true”时将确保对话框总是在可视区的中央（默认为“false”）。
 * @cfg {Boolean/String} shadow “true”或者“sides”为默认效果，“frame”为4方向阴影，“drop”为右下方阴影（默认为“false”）。
 * @cfg {Number} shadowOffset 阴影显示时的偏移量,单位为像素（默认为“5”）。
 * @cfg {String} buttonAlign 合法的值为：“left”、“center”和“right”（默认为“right”）。
 * @cfg {Number} minButtonWidth 对话框中按钮宽度的最小值（默认为“75”）。
 * @cfg {Boolean} shim 值为“true”时将创建一个“iframe”元素以免被“select”穿越（默认为“false”）。
 * @constructor
 * Create a new BasicDialog.
 * @param {String/HTMLElement/Ext.Element} el The container element or DOM node, or its id
 * @param {Object} config Configuration options
 */
Ext.BasicDialog = function(el, config){
    this.el = Ext.get(el);
    var dh = Ext.DomHelper;
    if(!this.el && config && config.autoCreate){
        if(typeof config.autoCreate == "object"){
            if(!config.autoCreate.id){
                config.autoCreate.id = el;
            }
            this.el = dh.append(document.body,
                        config.autoCreate, true);
        }else{
            this.el = dh.append(document.body,
                        {tag: "div", id: el, style:'visibility:hidden;'}, true);
        }
    }
    el = this.el;
    el.setDisplayed(true);
    el.hide = this.hideAction;
    this.id = el.id;
    el.addClass("x-dlg");

    Ext.apply(this, config);

    this.proxy = el.createProxy("x-dlg-proxy");
    this.proxy.hide = this.hideAction;
    this.proxy.setOpacity(.5);
    this.proxy.hide();

    if(config.width){
        el.setWidth(config.width);
    }
    if(config.height){
        el.setHeight(config.height);
    }
    this.size = el.getSize();
    if(typeof config.x != "undefined" && typeof config.y != "undefined"){
        this.xy = [config.x,config.y];
    }else{
        this.xy = el.getCenterXY(true);
    }
    /** The header element @type Ext.Element */
    this.header = el.child("> .x-dlg-hd");
    /** The body element @type Ext.Element */
    this.body = el.child("> .x-dlg-bd");
    /** The footer element @type Ext.Element */
    this.footer = el.child("> .x-dlg-ft");

    if(!this.header){
        this.header = el.createChild({tag: "div", cls:"x-dlg-hd", html: "&#160;"}, this.body ? this.body.dom : null);
    }
    if(!this.body){
        this.body = el.createChild({tag: "div", cls:"x-dlg-bd"});
    }

    this.header.unselectable();
    if(this.title){
        this.header.update(this.title);
    }
    // this element allows the dialog to be focused for keyboard event
    this.focusEl = el.createChild({tag: "a", href:"#", cls:"x-dlg-focus", tabIndex:"-1"});
    this.focusEl.swallowEvent("click", true);

    this.header.wrap({cls:"x-dlg-hd-right"}).wrap({cls:"x-dlg-hd-left"}, true);

    // wrap the body and footer for special rendering
    this.bwrap = this.body.wrap({tag: "div", cls:"x-dlg-dlg-body"});
    if(this.footer){
        this.bwrap.dom.appendChild(this.footer.dom);
    }

    this.bg = this.el.createChild({
        tag: "div", cls:"x-dlg-bg",
        html: '<div class="x-dlg-bg-left"><div class="x-dlg-bg-right"><div class="x-dlg-bg-center">&#160;</div></div></div>'
    });
    this.centerBg = this.bg.child("div.x-dlg-bg-center");


    if(this.autoScroll !== false && !this.autoTabs){
        this.body.setStyle("overflow", "auto");
    }

    this.toolbox = this.el.createChild({cls: "x-dlg-toolbox"});

    if(this.closable !== false){
        this.el.addClass("x-dlg-closable");
        this.close = this.toolbox.createChild({cls:"x-dlg-close"});
        this.close.on("click", this.closeClick, this);
        this.close.addClassOnOver("x-dlg-close-over");
    }
    if(this.collapsible !== false){
        this.collapseBtn = this.toolbox.createChild({cls:"x-dlg-collapse"});
        this.collapseBtn.on("click", this.collapseClick, this);
        this.collapseBtn.addClassOnOver("x-dlg-collapse-over");
        this.header.on("dblclick", this.collapseClick, this);
    }
    if(this.resizable !== false){
        this.el.addClass("x-dlg-resizable");
        this.resizer = new Ext.Resizable(el, {
            minWidth: this.minWidth || 80,
            minHeight:this.minHeight || 80,
            handles: this.resizeHandles || "all",
            pinned: true
        });
        this.resizer.on("beforeresize", this.beforeResize, this);
        this.resizer.on("resize", this.onResize, this);
    }
    if(this.draggable !== false){
        el.addClass("x-dlg-draggable");
        if (!this.proxyDrag) {
            var dd = new Ext.dd.DD(el.dom.id, "WindowDrag");
        }
        else {
            var dd = new Ext.dd.DDProxy(el.dom.id, "WindowDrag", {dragElId: this.proxy.id});
        }
        dd.setHandleElId(this.header.id);
        dd.endDrag = this.endMove.createDelegate(this);
        dd.startDrag = this.startMove.createDelegate(this);
        dd.onDrag = this.onDrag.createDelegate(this);
        dd.scroll = false;
        this.dd = dd;
    }
    if(this.modal){
        this.mask = dh.append(document.body, {tag: "div", cls:"x-dlg-mask"}, true);
        this.mask.enableDisplayMode("block");
        this.mask.hide();
        this.el.addClass("x-dlg-modal");
    }
    if(this.shadow){
        this.shadow = new Ext.Shadow({
            mode : typeof this.shadow == "string" ? this.shadow : "sides",
            offset : this.shadowOffset
        });
    }else{
        this.shadowOffset = 0;
    }
    if(Ext.useShims && this.shim !== false){
        this.shim = this.el.createShim();
        this.shim.hide = this.hideAction;
        this.shim.hide();
    }else{
        this.shim = false;
    }
    if(this.autoTabs){
        this.initTabs();
    }
    this.addEvents({
        /**
         * @event keydown
         * 按下键盘时触发
         * @param {Ext.BasicDialog} this
         * @param {Ext.EventObject} e
         */
        "keydown" : true,
        /**
         * @event move
         * 用户移动对话框时触发
         * @param {Ext.BasicDialog} this
         * @param {Number} x 新的 X 坐标
         * @param {Number} y 新的 Y 坐标
         */
        "move" : true,
        /**
         * @event resize
         * 用户调整对话框大小时触发。
         * @param {Ext.BasicDialog} this
         * @param {Number} width 新的宽度
         * @param {Number} height 新的高度
         */
        "resize" : true,
        /**
         * @event beforehide
         * 对话框隐藏前触发。 
         * @param {Ext.BasicDialog} this
         */
        "beforehide" : true,
        /**
         * @event hide
         * 对话框隐藏时触发。
         * @param {Ext.BasicDialog} this
         */
        "hide" : true,
        /**
         * @event beforeshow
         * 对话框展示前触发。
         * @param {Ext.BasicDialog} this
         */
        "beforeshow" : true,
        /**
         * @event show
         * 对话框展示时触发。
         * @param {Ext.BasicDialog} this
         */
        "show" : true
    });
    el.on("keydown", this.onKeyDown, this);
    el.on("mousedown", this.toFront, this);
    Ext.EventManager.onWindowResize(this.adjustViewport, this, true);
    this.el.hide();
    Ext.DialogManager.register(this);
    Ext.BasicDialog.superclass.constructor.call(this);
};

Ext.extend(Ext.BasicDialog, Ext.util.Observable, {
    shadowOffset: Ext.isIE ? 6 : 5,
    minHeight: 80,
    minWidth: 200,
    minButtonWidth: 75,
    defaultButton: null,
    buttonAlign: "right",
    tabTag: 'div',
    firstShow: true,

    /**
     * 设置对话框的标题文本。
     * @param {String} text 显示的标题。
     * @return {Ext.BasicDialog} this
     */
    setTitle : function(text){
        this.header.update(text);
        return this;
    },

    // private
    closeClick : function(){
        this.hide();
    },

    // private
    collapseClick : function(){
        this[this.collapsed ? "expand" : "collapse"]();
    },

    /**
     * 将对话框收缩到最小化状态（仅在标题栏可见时有效）。
     * 相当于用户单击了收缩对话框按钮。
     */
    collapse : function(){
        if(!this.collapsed){
            this.collapsed = true;
            this.el.addClass("x-dlg-collapsed");
            this.restoreHeight = this.el.getHeight();
            this.resizeTo(this.el.getWidth(), this.header.getHeight());
        }
    },

    /**
     * 将对话框展开到普通状态。
     * 相当于用户单击了展开对话框按钮。
     */
    expand : function(){
        if(this.collapsed){
            this.collapsed = false;
            this.el.removeClass("x-dlg-collapsed");
            this.resizeTo(this.el.getWidth(), this.restoreHeight);
        }
    },

    /**
     * 重新初始化 tabs 组件，清除原有的 tabs 并返回新的。
     * @return {Ext.TabPanel} tabs组件
     */
    initTabs : function(){
        var tabs = this.getTabs();
        while(tabs.getTab(0)){
            tabs.removeTab(0);
        }
        this.el.select(this.tabTag+'.x-dlg-tab').each(function(el){
            var dom = el.dom;
            tabs.addTab(Ext.id(dom), dom.title);
            dom.title = "";
        });
        tabs.activate(0);
        return tabs;
    },

    // private
    beforeResize : function(){
        this.resizer.minHeight = Math.max(this.minHeight, this.getHeaderFooterHeight(true)+40);
    },

    // private
    onResize : function(){
        this.refreshSize();
        this.syncBodyHeight();
        this.adjustAssets();
        this.focus();
        this.fireEvent("resize", this, this.size.width, this.size.height);
    },

    // private
    onKeyDown : function(e){
        if(this.isVisible()){
            this.fireEvent("keydown", this, e);
        }
    },

    /**
     * 调整对话框大小。
     * @param {Number} 宽度
     * @param {Number} 高度
     * @return {Ext.BasicDialog} this
     */
    resizeTo : function(width, height){
        this.el.setSize(width, height);
        this.size = {width: width, height: height};
        this.syncBodyHeight();
        if(this.fixedcenter){
            this.center();
        }
        if(this.isVisible()){
            this.constrainXY();
            this.adjustAssets();
        }
        this.fireEvent("resize", this, width, height);
        return this;
    },


    /**
     * 将对话框的大小调整到足以填充指定内容的大小。
     * @param {Number} 宽度
     * @param {Number} 高度
     * @return {Ext.BasicDialog} this
     */
    setContentSize : function(w, h){
        h += this.getHeaderFooterHeight() + this.body.getMargins("tb");
        w += this.body.getMargins("lr") + this.bwrap.getMargins("lr") + this.centerBg.getPadding("lr");
        //if(!this.el.isBorderBox()){
            h +=  this.body.getPadding("tb") + this.bwrap.getBorderWidth("tb") + this.body.getBorderWidth("tb") + this.el.getBorderWidth("tb");
            w += this.body.getPadding("lr") + this.bwrap.getBorderWidth("lr") + this.body.getBorderWidth("lr") + this.bwrap.getPadding("lr") + this.el.getBorderWidth("lr");
        //}
        if(this.tabs){
            h += this.tabs.stripWrap.getHeight() + this.tabs.bodyEl.getMargins("tb") + this.tabs.bodyEl.getPadding("tb");
            w += this.tabs.bodyEl.getMargins("lr") + this.tabs.bodyEl.getPadding("lr");
        }
        this.resizeTo(w, h);
        return this;
    },

    /**
     * 当对话框显示的时候添加一个键盘监听器。这样将允许当对话框活动时勾住一个函数，并在按下指定的按键时执行。
     * @param {Number/Array/Object} key 可以是一个 key code 、key code 数组、或者是含有下列选项的对象：{key: (number/array), shift: (true/false), ctrl: (true/false), alt: (true/false)}
     * @param {Function} fn 调用的函数
     * @param {Object} scope (可选的)函数的作用域
     * @return {Ext.BasicDialog} this
     */
    addKeyListener : function(key, fn, scope){
        var keyCode, shift, ctrl, alt;
        if(typeof key == "object" && !(key instanceof Array)){
            keyCode = key["key"];
            shift = key["shift"];
            ctrl = key["ctrl"];
            alt = key["alt"];
        }else{
            keyCode = key;
        }
        var handler = function(dlg, e){
            if((!shift || e.shiftKey) && (!ctrl || e.ctrlKey) &&  (!alt || e.altKey)){
                var k = e.getKey();
                if(keyCode instanceof Array){
                    for(var i = 0, len = keyCode.length; i < len; i++){
                        if(keyCode[i] == k){
                          fn.call(scope || window, dlg, k, e);
                          return;
                        }
                    }
                }else{
                    if(k == keyCode){
                        fn.call(scope || window, dlg, k, e);
                    }
                }
            }
        };
        this.on("keydown", handler);
        return this;
    },

    /**
     * 返回 TabPanel 组件（如果不存在则创建一个）。
     * 注意：如果你只是想检查存在的 TabPanel 而不是创建，设置一个值为空的“tabs”属性。
     * @return {Ext.TabPanel} tabs组件
     */
    getTabs : function(){
        if(!this.tabs){
            this.el.addClass("x-dlg-auto-tabs");
            this.body.addClass(this.tabPosition == "bottom" ? "x-tabs-bottom" : "x-tabs-top");
            this.tabs = new Ext.TabPanel(this.body.dom, this.tabPosition == "bottom");
        }
        return this.tabs;
    },

    /**
     * 在对话框的底部区域添加一个按钮。
     * @param {String/Object} config 如果是字串则为按钮的文本，也可以是按钮设置对象或者 Ext.DomHelper 元素设置。
     * @param {Function} handler 点击按钮时调用的函数。
     * @param {Object} scope (可选的) 调用函数的作用域。
     * @return {Ext.Button} 新的按钮
     */
    addButton : function(config, handler, scope){
        var dh = Ext.DomHelper;
        if(!this.footer){
            this.footer = dh.append(this.bwrap, {tag: "div", cls:"x-dlg-ft"}, true);
        }
        if(!this.btnContainer){
            var tb = this.footer.createChild({

                cls:"x-dlg-btns x-dlg-btns-"+this.buttonAlign,
                html:'<table cellspacing="0"><tbody><tr></tr></tbody></table><div class="x-clear"></div>'
            }, null, true);
            this.btnContainer = tb.firstChild.firstChild.firstChild;
        }
        var bconfig = {
            handler: handler,
            scope: scope,
            minWidth: this.minButtonWidth,
            hideParent:true
        };
        if(typeof config == "string"){
            bconfig.text = config;
        }else{
            if(config.tag){
                bconfig.dhconfig = config;
            }else{
                Ext.apply(bconfig, config);
            }
        }
        var btn = new Ext.Button(
            this.btnContainer.appendChild(document.createElement("td")),
            bconfig
        );
        this.syncBodyHeight();
        if(!this.buttons){
            /**
             * 所有通过“addButton”方法添加的按钮数组
             * @type Array
             */
            this.buttons = [];
        }
        this.buttons.push(btn);
        return btn;
    },

    /**
     * 当对话框显示时将焦点设置在默认的按钮上。
     * @param {Ext.BasicDialog.Button} btn 通过{@link #addButton}方法创建的按钮。
     * @return {Ext.BasicDialog} this
     */
    setDefaultButton : function(btn){
        this.defaultButton = btn;
        return this;
    },

    // private
    getHeaderFooterHeight : function(safe){
        var height = 0;
        if(this.header){
           height += this.header.getHeight();
        }
        if(this.footer){
           var fm = this.footer.getMargins();
            height += (this.footer.getHeight()+fm.top+fm.bottom);
        }
        height += this.bwrap.getPadding("tb")+this.bwrap.getBorderWidth("tb");
        height += this.centerBg.getPadding("tb");
        return height;
    },

    // private
    syncBodyHeight : function(){
        var bd = this.body, cb = this.centerBg, bw = this.bwrap;
        var height = this.size.height - this.getHeaderFooterHeight(false);
        bd.setHeight(height-bd.getMargins("tb"));
        var hh = this.header.getHeight();
        var h = this.size.height-hh;
        cb.setHeight(h);
        bw.setLeftTop(cb.getPadding("l"), hh+cb.getPadding("t"));
        bw.setHeight(h-cb.getPadding("tb"));
        bw.setWidth(this.el.getWidth(true)-cb.getPadding("lr"));
        bd.setWidth(bw.getWidth(true));
        if(this.tabs){
            this.tabs.syncHeight();
            if(Ext.isIE){
                this.tabs.el.repaint();
            }
        }
    },

    /**
     * 如果配置过 Ext.state 则恢复对话框之前的状态。
     * @return {Ext.BasicDialog} this
     */
    restoreState : function(){
        var box = Ext.state.Manager.get(this.stateId || (this.el.id + "-state"));
        if(box && box.width){
            this.xy = [box.x, box.y];
            this.resizeTo(box.width, box.height);
        }
        return this;
    },

    // private
    beforeShow : function(){
        this.expand();
        if(this.fixedcenter){
            this.xy = this.el.getCenterXY(true);
        }
        if(this.modal){
            Ext.get(document.body).addClass("x-body-masked");
            this.mask.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
            this.mask.show();
        }
        this.constrainXY();
    },

    // private
    animShow : function(){
        var b = Ext.get(this.animateTarget, true).getBox();
        this.proxy.setSize(b.width, b.height);
        this.proxy.setLocation(b.x, b.y);
        this.proxy.show();
        this.proxy.setBounds(this.xy[0], this.xy[1], this.size.width, this.size.height,
                    true, .35, this.showEl.createDelegate(this));
    },

    /**
     * 展示对话框。
     * @param {String/HTMLElement/Ext.Element} animateTarget (可选的) 重置动画的目标
     * @return {Ext.BasicDialog} this
     */
    show : function(animateTarget){
        if (this.fireEvent("beforeshow", this) === false){
            return;
        }
        if(this.syncHeightBeforeShow){
            this.syncBodyHeight();
        }else if(this.firstShow){
            this.firstShow = false;
            this.syncBodyHeight(); // sync the height on the first show instead of in the constructor
        }
        this.animateTarget = animateTarget || this.animateTarget;
        if(!this.el.isVisible()){
            this.beforeShow();
            if(this.animateTarget){
                this.animShow();
            }else{
                this.showEl();
            }
        }
        return this;
    },

    // private
    showEl : function(){
        this.proxy.hide();
        this.el.setXY(this.xy);
        this.el.show();
        this.adjustAssets(true);
        this.toFront();
        this.focus();
        // IE peekaboo bug - fix found by Dave Fenwick
        if(Ext.isIE){
            this.el.repaint();
        }
        this.fireEvent("show", this);
    },

    /**
     * 将焦点置于对话框上。
     * 如果设置了 defaultButton ，则该按钮取得焦点，否则对话框本身取得焦点。
     */
    focus : function(){
        if(this.defaultButton){
            this.defaultButton.focus();
        }else{
            this.focusEl.focus();
        }
    },

    // private
    constrainXY : function(){
        if(this.constraintoviewport !== false){
            if(!this.viewSize){
                if(this.container){
                    var s = this.container.getSize();
                    this.viewSize = [s.width, s.height];
                }else{
                    this.viewSize = [Ext.lib.Dom.getViewWidth(),Ext.lib.Dom.getViewHeight()];
                }
            }
            var s = Ext.get(this.container||document).getScroll();

            var x = this.xy[0], y = this.xy[1];
            var w = this.size.width, h = this.size.height;
            var vw = this.viewSize[0], vh = this.viewSize[1];
            // only move it if it needs it
            var moved = false;
            // first validate right/bottom
            if(x + w > vw+s.left){
                x = vw - w;
                moved = true;
            }
            if(y + h > vh+s.top){
                y = vh - h;
                moved = true;
            }
            // then make sure top/left isn't negative
            if(x < s.left){
                x = s.left;
                moved = true;
            }
            if(y < s.top){
                y = s.top;
                moved = true;
            }
            if(moved){
                // cache xy
                this.xy = [x, y];
                if(this.isVisible()){
                    this.el.setLocation(x, y);
                    this.adjustAssets();
                }
            }
        }
    },

    // private
    onDrag : function(){
        if(!this.proxyDrag){
            this.xy = this.el.getXY();
            this.adjustAssets();
        }
    },

    // private
    adjustAssets : function(doShow){
        var x = this.xy[0], y = this.xy[1];
        var w = this.size.width, h = this.size.height;
        if(doShow === true){
            if(this.shadow){
                this.shadow.show(this.el);
            }
            if(this.shim){
                this.shim.show();
            }
        }
        if(this.shadow && this.shadow.isVisible()){
            this.shadow.show(this.el);
        }
        if(this.shim && this.shim.isVisible()){
            this.shim.setBounds(x, y, w, h);
        }
    },

    // private
    adjustViewport : function(w, h){
        if(!w || !h){
            w = Ext.lib.Dom.getViewWidth();
            h = Ext.lib.Dom.getViewHeight();
        }
        // cache the size
        this.viewSize = [w, h];
        if(this.modal && this.mask.isVisible()){
            this.mask.setSize(w, h); // first make sure the mask isn't causing overflow
            this.mask.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
        }
        if(this.isVisible()){
            this.constrainXY();
        }
    },

    /**
     * 销毁对话框和所有它支持的元素（包括 tabs、 shim、 shadow、 proxy、 mask 等等。）同时也去除所有事件监听器。
     * @param {Boolean} removeEl (可选的) 值为 true 时从 DOM 中删除该元素。
     */
    destroy : function(removeEl){
        if(this.isVisible()){
            this.animateTarget = null;
            this.hide();
        }
        Ext.EventManager.removeResizeListener(this.adjustViewport, this);
        if(this.tabs){
            this.tabs.destroy(removeEl);
        }
        Ext.destroy(
             this.shim,
             this.proxy,
             this.resizer,
             this.close,
             this.mask
        );
        if(this.dd){
            this.dd.unreg();
        }
        if(this.buttons){
           for(var i = 0, len = this.buttons.length; i < len; i++){
               this.buttons[i].destroy();
           }
        }
        this.el.removeAllListeners();
        if(removeEl === true){
            this.el.update("");
            this.el.remove();
        }
        Ext.DialogManager.unregister(this);
    },

    // private
    startMove : function(){
        if(this.proxyDrag){
            this.proxy.show();
        }
        if(this.constraintoviewport !== false){
            this.dd.constrainTo(document.body, {right: this.shadowOffset, bottom: this.shadowOffset});
        }
    },

    // private
    endMove : function(){
        if(!this.proxyDrag){
            Ext.dd.DD.prototype.endDrag.apply(this.dd, arguments);
        }else{
            Ext.dd.DDProxy.prototype.endDrag.apply(this.dd, arguments);
            this.proxy.hide();
        }
        this.refreshSize();
        this.adjustAssets();
        this.focus();
        this.fireEvent("move", this, this.xy[0], this.xy[1]);
    },

    /**
     * 将对话框置于其他可见的对话框的前面。
     * @return {Ext.BasicDialog} this
     */
    toFront : function(){
        Ext.DialogManager.bringToFront(this);
        return this;
    },

    /**
     * 将对话框置于其他可见的对话框的后面。
     * @return {Ext.BasicDialog} this
     */
    toBack : function(){
        Ext.DialogManager.sendToBack(this);
        return this;
    },

    /**
     * 将对话框于视图居中显示。
     * @return {Ext.BasicDialog} this
     */
    center : function(){
        var xy = this.el.getCenterXY(true);
        this.moveTo(xy[0], xy[1]);
        return this;
    },

    /**
     * 将对话框的左上角移动到指定的地方。
     * @param {Number} x
     * @param {Number} y
     * @return {Ext.BasicDialog} this
     */
    moveTo : function(x, y){
        this.xy = [x,y];
        if(this.isVisible()){
            this.el.setXY(this.xy);
            this.adjustAssets();
        }
        return this;
    },

    /**
     * 将对话框对齐到指定元素上。
     * @param {String/HTMLElement/Ext.Element} element 要对齐的元素。
     * @param {String} position 对齐到的位置（点击{@link Ext.Element#alignTo}查看详情）。
     * @param {Array} offsets (可选的) 位置偏移量，形如：[x, y]
     * @return {Ext.BasicDialog} this
     */
    alignTo : function(element, position, offsets){
        this.xy = this.el.getAlignToXY(element, position, offsets);
        if(this.isVisible()){
            this.el.setXY(this.xy);
            this.adjustAssets();
        }
        return this;
    },

    /**
     * 将元素与另一个元素绑定，并在调整窗口大小后重新对齐元素。
     * @param {String/HTMLElement/Ext.Element} element 要对齐的元素。
     * @param {String} position 对齐到的位置（点击{@link Ext.Element#alignTo}查看详情）。
     * @param {Array} offsets (可选的) 位置偏移量，形如：[x, y]
     * @param {Boolean/Number} monitorScroll (可选的) 值为 true 时监视容器的滚动并重新定位。如果为数值，将用来做为延迟缓冲量（默认为50毫秒）。
     * @return {Ext.BasicDialog} this
     */
    anchorTo : function(el, alignment, offsets, monitorScroll){
        var action = function(){
            this.alignTo(el, alignment, offsets);
        };
        Ext.EventManager.onWindowResize(action, this);
        var tm = typeof monitorScroll;
        if(tm != 'undefined'){
            Ext.EventManager.on(window, 'scroll', action, this,
                {buffer: tm == 'number' ? monitorScroll : 50});
        }
        action.call(this);
        return this;
    },

    /**
     * 当对话框可见时返回“true”。
     * @return {Boolean}
     */
    isVisible : function(){
        return this.el.isVisible();
    },

    // private
    animHide : function(callback){
        var b = Ext.get(this.animateTarget).getBox();
        this.proxy.show();
        this.proxy.setBounds(this.xy[0], this.xy[1], this.size.width, this.size.height);
        this.el.hide();
        this.proxy.setBounds(b.x, b.y, b.width, b.height, true, .35,
                    this.hideEl.createDelegate(this, [callback]));
    },

    /**
     * 隐藏对话框。
     * @param {Function} callback (可选的) 对话框隐藏时调用的函数。
     * @return {Ext.BasicDialog} this
     */
    hide : function(callback){
        if (this.fireEvent("beforehide", this) === false){
            return;
        }
        if(this.shadow){
            this.shadow.hide();
        }
        if(this.shim) {
          this.shim.hide();
        }
        if(this.animateTarget){
           this.animHide(callback);
        }else{
            this.el.hide();
            this.hideEl(callback);
        }
        return this;
    },

    // private
    hideEl : function(callback){
        this.proxy.hide();
        if(this.modal){
            this.mask.hide();
            Ext.get(document.body).removeClass("x-body-masked");
        }
        this.fireEvent("hide", this);
        if(typeof callback == "function"){
            callback();
        }
    },

    // private
    hideAction : function(){
        this.setLeft("-10000px");
        this.setTop("-10000px");
        this.setStyle("visibility", "hidden");
    },

    // private
    refreshSize : function(){
        this.size = this.el.getSize();
        this.xy = this.el.getXY();
        Ext.state.Manager.set(this.stateId || this.el.id + "-state", this.el.getBox());
    },

    // private
    // z-index is managed by the DialogManager and may be overwritten at any time
    setZIndex : function(index){
        if(this.modal){
            this.mask.setStyle("z-index", index);
        }
        if(this.shim){
            this.shim.setStyle("z-index", ++index);
        }
        if(this.shadow){
            this.shadow.setZIndex(++index);
        }
        this.el.setStyle("z-index", ++index);
        if(this.proxy){
            this.proxy.setStyle("z-index", ++index);
        }
        if(this.resizer){
            this.resizer.proxy.setStyle("z-index", ++index);
        }

        this.lastZIndex = index;
    },

    /**
     * 返回对话框元素。
     * @return {Ext.Element} 所在的对话框元素
     */
    getEl : function(){
        return this.el;
    }
});

/**
 * @class Ext.DialogManager
 * Provides global access to BasicDialogs that have been created and
 * support for z-indexing (layering) multiple open dialogs.
 */
Ext.DialogManager = function(){
    var list = {};
    var accessList = [];
    var front = null;

    // private
    var sortDialogs = function(d1, d2){
        return (!d1._lastAccess || d1._lastAccess < d2._lastAccess) ? -1 : 1;
    };

    // private
    var orderDialogs = function(){
        accessList.sort(sortDialogs);
        var seed = Ext.DialogManager.zseed;
        for(var i = 0, len = accessList.length; i < len; i++){
            var dlg = accessList[i];
            if(dlg){
                dlg.setZIndex(seed + (i*10));
            }
        }
    };

    return {
        /**
         * The starting z-index for BasicDialogs (defaults to 9000)
         * @type Number The z-index value
         */
        zseed : 9000,

        // private
        register : function(dlg){
            list[dlg.id] = dlg;
            accessList.push(dlg);
        },

        // private
        unregister : function(dlg){
            delete list[dlg.id];
            if(!accessList.indexOf){
                for(var i = 0, len = accessList.length; i < len; i++){
                    if(accessList[i] == dlg){
                        accessList.splice(i, 1);
                        return;
                    }
                }
            }else{
                var i = accessList.indexOf(dlg);
                if(i != -1){
                    accessList.splice(i, 1);
                }
            }
        },

        /**
         * Gets a registered dialog by id
         * @param {String/Object} id The id of the dialog or a dialog
         * @return {Ext.BasicDialog} this
         */
        get : function(id){
            return typeof id == "object" ? id : list[id];
        },

        /**
         * Brings the specified dialog to the front
         * @param {String/Object} dlg The id of the dialog or a dialog
         * @return {Ext.BasicDialog} this
         */
        bringToFront : function(dlg){
            dlg = this.get(dlg);
            if(dlg != front){
                front = dlg;
                dlg._lastAccess = new Date().getTime();
                orderDialogs();
            }
            return dlg;
        },

        /**
         * Sends the specified dialog to the back
         * @param {String/Object} dlg The id of the dialog or a dialog
         * @return {Ext.BasicDialog} this
         */
        sendToBack : function(dlg){
            dlg = this.get(dlg);
            dlg._lastAccess = -(new Date().getTime());
            orderDialogs();
            return dlg;
        },

        /**
         * Hides all dialogs
         */
        hideAll : function(){
            for(var id in list){
                if(list[id] && typeof list[id] != "function" && list[id].isVisible()){
                    list[id].hide();
                }
            }
        }
    };
}();

/**
 * @class Ext.LayoutDialog
 * @extends Ext.BasicDialog
 * Dialog which provides adjustments for working with a layout in a Dialog.
 * Add your necessary layout config options to the dialog's config.<br>
 * Example usage (including a nested layout):
 * <pre><code>
if(!dialog){
    dialog = new Ext.LayoutDialog("download-dlg", {
        modal: true,
        width:600,
        height:450,
        shadow:true,
        minWidth:500,
        minHeight:350,
        autoTabs:true,
        proxyDrag:true,
        // layout config merges with the dialog config
        center:{
            tabPosition: "top",
            alwaysShowTabs: true
        }
    });
    dialog.addKeyListener(27, dialog.hide, dialog);
    dialog.setDefaultButton(dialog.addButton("Close", dialog.hide, dialog));
    dialog.addButton("Build It!", this.getDownload, this);

    // we can even add nested layouts
    var innerLayout = new Ext.BorderLayout("dl-inner", {
        east: {
            initialSize: 200,
            autoScroll:true,
            split:true
        },
        center: {
            autoScroll:true
        }
    });
    innerLayout.beginUpdate();
    innerLayout.add("east", new Ext.ContentPanel("dl-details"));
    innerLayout.add("center", new Ext.ContentPanel("selection-panel"));
    innerLayout.endUpdate(true);

    var layout = dialog.getLayout();
    layout.beginUpdate();
    layout.add("center", new Ext.ContentPanel("standard-panel",
                        {title: "Download the Source", fitToFrame:true}));
    layout.add("center", new Ext.NestedLayoutPanel(innerLayout,
               {title: "Build your own ext.js"}));
    layout.getRegion("center").showPanel(sp);
    layout.endUpdate();
}
</code></pre>
    * @constructor
    * @param {String/HTMLElement/Ext.Element} el The id of or container element
    * @param {Object} config configuration options
  */
Ext.LayoutDialog = function(el, config){
    config.autoTabs = false;
    Ext.LayoutDialog.superclass.constructor.call(this, el, config);
    this.body.setStyle({overflow:"hidden", position:"relative"});
    this.layout = new Ext.BorderLayout(this.body.dom, config);
    this.layout.monitorWindowResize = false;
    this.el.addClass("x-dlg-auto-layout");
    // fix case when center region overwrites center function
    this.center = Ext.BasicDialog.prototype.center;
    this.on("show", this.layout.layout, this.layout, true);
};
Ext.extend(Ext.LayoutDialog, Ext.BasicDialog, {
    /**
     * Ends update of the layout <strike>and resets display to none</strike>. Use standard beginUpdate/endUpdate on the layout.
     * @deprecated
     */
    endUpdate : function(){
        this.layout.endUpdate();
    },

    /**
     * Begins an update of the layout <strike>and sets display to block and visibility to hidden</strike>. Use standard beginUpdate/endUpdate on the layout.
     *  @deprecated
     */
    beginUpdate : function(){
        this.layout.beginUpdate();
    },

    /**
     * Get the BorderLayout for this dialog
     * @return {Ext.BorderLayout}
     */
    getLayout : function(){
        return this.layout;
    },

    showEl : function(){
        Ext.LayoutDialog.superclass.showEl.apply(this, arguments);
        if(Ext.isIE7){
            this.layout.layout();
        }
    },

    // private
    // Use the syncHeightBeforeShow config option to control this automatically
    syncBodyHeight : function(){
        Ext.LayoutDialog.superclass.syncBodyHeight.call(this);
        if(this.layout){this.layout.layout();}
    }
});