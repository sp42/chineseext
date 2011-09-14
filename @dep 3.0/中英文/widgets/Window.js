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
 * @class Ext.Window
 * @extends Ext.Panel
 * <p>
 * 一种专用于程序中的"视窗"（window）的特殊面板。Window默认下是可拖动的{@link #draggable}、浮动的窗体。
 * 窗体可以最大化到整个视图、恢复原来的大小，还可以最小化{@link #minimize}。<br />
 * A specialized panel intended for use as an application window.  Windows are floated, {@link #resizable}, and
 * {@link #draggable} by default.  Windows can be maximized to fill the viewport, restored to their prior size, and can be {@link #minimize}d.
 * </p>
 * <p>
 * Windows既可关联到{@link Ext.WindowGroup}或籍由{@link Ext.WindowManager}来管理，
 * 提供分组（grouping），活动（activation），置前/置后（to front/back）或其它应用程序特定的功能。<br />
 * Windows can also be linked to a {@link Ext.WindowGroup} or managed by the {@link Ext.WindowMgr} to provide 
 * grouping, activation, to front, to back and other application-specific behavior.</p>
 * <p>
 * 缺省状态下，窗体都渲染到document.body。
 * 要强制{@link #constrain}窗体以某个元素为依托就要使用{@link Ext.Component#renderTo renderTo}方法。<br />
 * By default, Windows will be rendered to document.body. To {@link #constrain} a Window to another element
 * specify {@link Ext.Component#renderTo renderTo}.</p>
 * @constructor
 * @param {Object} config 配置项对象。The config object
 */
Ext.Window = Ext.extend(Ext.Panel, {
    /**
     * @cfg {Number} x
     * 设置当窗体初次显示的时候，距离左方边缘的X坐标。默认为在窗体其容器元素{@link Ext.Element Element}的居中位置（窗体渲染的元素）。
     * The X position of the left edge of the window on initial showing. Defaults to centering the Window within
     * the width of the Window's container {@link Ext.Element Element} (The Element that the Window is rendered to).
     */
    /**
     * @cfg {Number} y
     * 设置当窗体初次显示的时候，距离左方边缘的Y坐标。默认为在窗体其容器元素{@link Ext.Element Element}的居中位置（窗体渲染的元素）。
     * The Y position of the top edge of the window on initial showing. Defaults to centering the Window within
     * the height of the Window's container {@link Ext.Element Element) (The Element that the Window is rendered to).
     */
    /**
     * @cfg {Boolean} modal
     * True 表示为当window显示时对其后面的一切内容进行遮罩，false表示为限制对其它UI元素的语法（默认为 false）。
     * True to make the window modal and mask everything behind it when displayed, false to display it without
     * restricting access to other UI elements (defaults to false).
     */
    /**
     * @cfg {String/Element} animateTarget
     * 当指定一个id或元素,window打开时会与元素之间产生动画效果（缺省为null即没有动画效果）。
     * Id or element from which the window should animate while opening (defaults to null with no animation).
     */
    /**
     * @cfg {String} resizeHandles
     * 一个有效的 {@link Ext.Resizable}手柄的配置字符串（默认为 'all'）。只当 resizable = true时有效. 
     * A valid {@link Ext.Resizable}handles config string (defaults to 'all').  Only applies when resizable = true.
     */
    /**
     * @cfg {Ext.WindowGroup} manager
     * 管理该window的WindowGroup引用（默认为 {@link Ext.WindowMgr}）。
     * A reference to the WindowGroup that should manage this window (defaults to {@link Ext.WindowMgr}).
     */
    /**
    * @cfg {String/Number/Button} defaultButton
    * 按钮的id/index或按钮实例,当window接收到焦点此按钮也会得到焦点。
    * The id / index of a button or a button instance to focus when this window received the focus.
    */
    /**
    * @cfg {Function} onEsc
    * 允许重写该句柄以替代escape键的内建控制句柄。默认的动作句柄是关闭window（执行 {@link #closeAction}所指的动作）。
    * 若按下escape键不关闭window，可指定此项为{@link Ext#emptyFn})。 
    * Allows override of the built-in processing for the escape key. Default action
    * is to close the Window (performing whatever action is specified in {@link #closeAction}.
    * To prevent the Window closing when the escape key is pressed, specify this as
    * Ext.emptyFn (See {@link Ext#emptyFn}).
    */
    /**
     * @cfg {Boolean} collapsed
     * True表示为渲染window就是关闭着的，false就表示展开地渲染（默认为false）。
     * True to render the window collapsed, false to render it expanded (defaults to false). Note that if 
     * {@link #expandOnShow} is true (the default) it will override the <tt>collapsed</tt> config and the window 
     * will always be expanded when shown.
     */
    /**
     * @cfg {Boolean} maximized
     * True表示显示窗体时就已最大化的状态显示（默认为false）。
     * True to initially display the window in a maximized state. (Defaults to false).
     */
    
    /**
    * @cfg {String} baseCls
    * 作用在面板元素上的CSS样式类（默认为 'x-window'）。
    * The base CSS class to apply to this panel's element (defaults to 'x-window').
    */
    baseCls : 'x-window',
    /**
     * @cfg {Boolean} resizable
     * True 表示为允许用户从window的四边和四角改变window的大小（默认为 true）。
     * True to allow user resizing at each edge and corner of the window, false to disable resizing (defaults to true).
     */
    resizable : true,
    /**
     * @cfg {Boolean} draggable
     * True 表示为window可被拖动,false表示禁止拖动（默认为true）。
     * 注意：默认下window会在视图中居中显示（因为可拖动），所以如果禁止可拖动的话意味着window生成之后应用一定代码定义（如 myWindow.setPosition(100, 100);）。
     * True to allow the window to be dragged by the header bar, false to disable dragging (defaults to true).  Note
     * that by default the window will be centered in the viewport, so if dragging is disabled the window may need
     * to be positioned programmatically after render (e.g., myWindow.setPosition(100, 100);).
     */
    draggable : true,
    /**
     * @cfg {Boolean} closable
     * <p>True 表示为显示'close'的工具按钮可让用户关闭window，false表示为隐藏按钮，并不允许关闭window（默认为 true）。
     * True to display the 'close' tool button and allow the user to close the window, false to
     * hide the button and disallow closing the window (default to true).</p>
     * <p>默认状态下，当那个窗体是拥有焦点的，用户按下关闭按钮或ESC键，{@link #close}方法就会调用。
     * 这表示窗体会彻底被<i>摧毁</i>而且无法在重用。
     * By default, when close is requested by either clicking the close button in the header
     * or pressing ESC when the Window has focus, the {@link #close} method will be called. This
     * will <i>destroy</i> the Window and its content meaning that it may not be reused.</p>
     * <p>要使得窗体只是<i>隐藏</i>的话，就设置{@link #closeAction}为'hide'，这样便可以重用窗体。
     * To make closing a Window <i>hide</i> the Window so that it may be reused, set
     * {@link #closeAction} to 'hide'.
     */
    closable : true,
    /**
     * @cfg {Boolean} constrain
     * True表示为将window约束在视图中显示，false表示为允许window在视图之外的地方显示（默认为false）。
     * 可选地设置{@link #constrainHeader}使得头部只被约束。
     * True to constrain the window within its containing element, false to allow it to fall outside of its
     * containing element. By default the window will be rendered to document.body.  To render and constrain the 
     * window within another element specify {@link #renderTo}.
     * (defaults to false).  Optionally the header only can be constrained using {@link #constrainHeader}.
     */
    constrain : false,
    /**
     * @cfg {Boolean} constrainHeader
     * True表示为将window header约束在视图中显示，
     * false表示为允许header在视图之外的地方显示（默认为false）。可选地设置{@link #constrain}使得整个窗体可被约束。
     * True to constrain the window header within its containing element (allowing the window body to fall outside 
     * of its containing element) or false to allow the header to fall outside its containing element (defaults to 
     * false). Optionally the entire window can be constrained using {@link #constrain}.
     */
    constrainHeader : false,
    /**
     * @cfg {Boolean} plain
     * True表示为渲染window body的背景为透明的背景，这样看来window body与边框元素（framing elements）融为一体，
     * false表示为加入浅色的背景，使得在视觉上body元素与外围边框清晰地分辨出来（默认为false）。
     * True to render the window body with a transparent background so that it will blend into the framing
     * elements, false to add a lighter background color to visually highlight the body element and separate it
     * more distinctly from the surrounding frame (defaults to false).
     */
    plain : false,
    /**
     * @cfg {Boolean} minimizable
     * True表示为显示“最小化minimize”的工具按钮，允许用户最小化window，false表示隐藏按钮，禁止window最小化的功能（默认为false）。
     * 注意最小化window是实现具体特定的（implementation-specific），该按钮不提供最小化window的实现，所以必须提供一个最小化的事件来制定最小化的行为，这样该项才有用的。
     * True to display the 'minimize' tool button and allow the user to minimize the window, false to hide the button
     * and disallow minimizing the window (defaults to false).  Note that this button provides no implementation --
     * the behavior of minimizing a window is implementation-specific, so the minimize event must be handled and a
     * custom minimize behavior implemented for this option to be useful.
     */
    minimizable : false,
    /**
     * @cfg {Boolean} maximizable
     * True表示为显示“最大化maximize”的工具按钮，允许用户最大化window（默认为false）。
     * 注意当window最大化时，这个工具按钮会自动变为“restore”按钮。
     * 同时相应的行为也变成内建复原(restore)行为，即window可回变之前的尺寸。
     * True to display the 'maximize' tool button and allow the user to maximize the window, false to hide the button
     * and disallow maximizing the window (defaults to false).  Note that when a window is maximized, the tool button
     * will automatically change to a 'restore' button with the appropriate behavior already built-in that will
     * restore the window to its previous size.
     */
    maximizable : false,
    /**
     * @cfg {Number} minHeight
     * window高度的最小值，单位为象素（缺省为 100）。只当 resizable 为 true时有效。
     * The minimum height in pixels allowed for this window (defaults to 100).  Only applies when resizable = true.
     */
    minHeight : 100,
    /**
     * @cfg {Number} minWidth
     * window宽度的最小值，单位为象素（缺省为 200）。只当 resizable 为 true时有效。
     * The minimum width in pixels allowed for this window (defaults to 200).  Only applies when resizable = true.
     */
    minWidth : 200,
    /**
     * @cfg {Boolean} expandOnShow
     * True 表示为window显示时总是展开window，false则表示为按照打开时的状态显示（有可能是闭合的{@link #collapsed}）（默认为 true）。
     * True to always expand the window when it is displayed, false to keep it in its current state (which may be
     * {@link #collapsed}) when displayed (defaults to true).
     */
    expandOnShow : true,
    /**
     * @cfg {String} closeAction
     * 当关闭按钮被点击时执行的动作。“close”缺省的动作是从DOM树中移除window并彻底加以销毁。
     * “hide”是另外一个有效的选项，只是在视觉上通过偏移到零下(negative)的区域的手法来隐藏，这样使得window可通过{@link #show} 的方法再显示.
     * The action to take when the close button is clicked.  The default action is 'close' which will actually remove
     * the window from the DOM and destroy it.  The other valid option is 'hide' which will simply hide the window
     * by setting visibility to hidden and applying negative offsets, keeping the window available to be redisplayed
     * via the {@link #show} method.
     */
    closeAction : 'close',

    // inherited docs, same default
    collapsible : false,

    // private
    initHidden : true,
    /**
    * @cfg {Boolean} monitorResize @hide
    * This is automatically managed based on the value of constrain and constrainToHeader
    */
    monitorResize : true,

    // The following configs are set to provide the basic functionality of a window.
    // Changing them would require additional code to handle correctly and should
    // usually only be done in subclasses that can provide custom behavior.  Changing them
    // may have unexpected or undesirable results.
    /** @cfg {String} elements @hide */
    elements : 'header,body',
    /** @cfg {Boolean} frame @hide */
    frame : true,
    /** @cfg {Boolean} floating @hide */
    floating : true,

    // private
    initComponent : function(){
        Ext.Window.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event activate
             * 当通过{@link setActive}的方法视觉上激活window后触发的事件。
             * Fires after the window has been visually activated via {@link setActive}.
             * @param {Ext.Window} this
             */
            /**
             * @event deactivate
             * 当通过{@link setActive}的方法视觉上使window不活动后触发的事件。
             * Fires after the window has been visually deactivated via {@link setActive}.
             * @param {Ext.Window} this
             */
            /**
             * @event resize
             * 调整window大小后触发。
             * Fires after the window has been resized.
             * @param {Ext.Window} this
             * @param {Number} width window的新宽度 The window's new width
             * @param {Number} height window的新高度 The window's new height
             */
            'resize',
            /**
             * @event maximize
             * 当window完成最大化后触发。
             * Fires after the window has been maximized.
             * @param {Ext.Window} this
             */
            'maximize',
            /**
             * @event minimize
             * 当window完成最小化后触发。
             * Fires after the window has been minimized.
             * @param {Ext.Window} this
             */
            'minimize',
            /**
             * @event restore
             * 当window复原到原始的尺寸大小时触发。
             * Fires after the window has been restored to its original size after being maximized.
             * @param {Ext.Window} this
             */
            'restore'
        );
    },

    // private
    getState : function(){
        return Ext.apply(Ext.Window.superclass.getState.call(this) || {}, this.getBox());
    },

    // private
    onRender : function(ct, position){
        Ext.Window.superclass.onRender.call(this, ct, position);

        if(this.plain){
            this.el.addClass('x-window-plain');
        }

        // this element allows the Window to be focused for keyboard events
        this.focusEl = this.el.createChild({
                    tag: "a", href:"#", cls:"x-dlg-focus",
                    tabIndex:"-1", html: "&#160;"});
        this.focusEl.swallowEvent('click', true);

        this.proxy = this.el.createProxy("x-window-proxy");
        this.proxy.enableDisplayMode('block');

        if(this.modal){
            this.mask = this.container.createChild({cls:"ext-el-mask"}, this.el.dom);
            this.mask.enableDisplayMode("block");
            this.mask.hide();
            this.mon(this.mask, 'click', this.focus, this);
        }
        this.initTools();
    },

    // private
    initEvents : function(){
        Ext.Window.superclass.initEvents.call(this);
        if(this.animateTarget){
            this.setAnimateTarget(this.animateTarget);
        }

        if(this.resizable){
            this.resizer = new Ext.Resizable(this.el, {
                minWidth: this.minWidth,
                minHeight:this.minHeight,
                handles: this.resizeHandles || "all",
                pinned: true,
                resizeElement : this.resizerAction
            });
            this.resizer.window = this;
            this.mon(this.resizer, 'beforeresize', this.beforeResize, this);
        }

        if(this.draggable){
            this.header.addClass("x-window-draggable");
        }
		this.mon(this.el, 'mousedown', this.toFront, this);
        this.manager = this.manager || Ext.WindowMgr;
        this.manager.register(this);
        this.hidden = true;
        if(this.maximized){
            this.maximized = false;
            this.maximize();
        }
        if(this.closable){
            var km = this.getKeyMap();
            km.on(27, this.onEsc, this);
            km.disable();
        }
    },

    initDraggable : function(){
        /**
         * 如果窗体的配置项{@link #draggable}被打开，那么该属性就是一个{@link Ext.dd.DD}的实例，包含了拖动窗体的DOM元素信息。
         * If this Window is configured {@link #draggable}, this property will contain
         * an instance of {@link Ext.dd.DD} which handles dragging the Window's DOM Element.
         * @type Ext.dd.DD
         * @property dd
         */
        this.dd = new Ext.Window.DD(this);
    },

   // private
    onEsc : function(){
        this[this.closeAction]();
    },

    // private
    beforeDestroy : function(){
        if (this.rendered){
            this.hide();
		  if(this.doAnchor){
		        Ext.EventManager.removeResizeListener(this.doAnchor, this);
		      Ext.EventManager.un(window, 'scroll', this.doAnchor, this);
            }
            Ext.destroy(
                this.focusEl,
                this.resizer,
                this.dd,
                this.proxy,
                this.mask
            );
        }
        Ext.Window.superclass.beforeDestroy.call(this);
    },

    // private
    onDestroy : function(){
        if(this.manager){
            this.manager.unregister(this);
        }
        Ext.Window.superclass.onDestroy.call(this);
    },

    // private
    initTools : function(){
        if(this.minimizable){
            this.addTool({
                id: 'minimize',
                handler: this.minimize.createDelegate(this, [])
            });
        }
        if(this.maximizable){
            this.addTool({
                id: 'maximize',
                handler: this.maximize.createDelegate(this, [])
            });
            this.addTool({
                id: 'restore',
                handler: this.restore.createDelegate(this, []),
                hidden:true
            });
            this.mon(this.header, 'dblclick', this.toggleMaximize, this);
        }
        if(this.closable){
            this.addTool({
                id: 'close',
                handler: this[this.closeAction].createDelegate(this, [])
            });
        }
    },

    // private
    resizerAction : function(){
        var box = this.proxy.getBox();
        this.proxy.hide();
        this.window.handleResize(box);
        return box;
    },

    // private
    beforeResize : function(){
        this.resizer.minHeight = Math.max(this.minHeight, this.getFrameHeight() + 40); // 40 is a magic minimum content size?
        this.resizer.minWidth = Math.max(this.minWidth, this.getFrameWidth() + 40);
        this.resizeBox = this.el.getBox();
    },

    // private
    updateHandles : function(){
        if(Ext.isIE && this.resizer){
            this.resizer.syncHandleHeight();
            this.el.repaint();
        }
    },

    // private
    handleResize : function(box){
        var rz = this.resizeBox;
        if(rz.x != box.x || rz.y != box.y){
            this.updateBox(box);
        }else{
            this.setSize(box);
        }
        this.focus();
        this.updateHandles();
        this.saveState();
        if(this.layout){
            this.doLayout();
        }
        this.fireEvent("resize", this, box.width, box.height);
    },

    /**
     * 焦点这个window。若有defaultButton，它就会顺便也接送到一个焦点，否则是window本身接收到焦点。
     * Focuses the window.  If a defaultButton is set, it will receive focus, otherwise the
     * window itself will receive focus.
     */
    focus : function(){
        var f = this.focusEl, db = this.defaultButton, t = typeof db;
        if(t != 'undefined'){
            if(t == 'number' && this.fbar){
                f = this.fbar.items.get(db);
            }else if(t == 'string'){
                f = Ext.getCmp(db);
            }else{
                f = db;
            }
        }
        f = f || this.focusEl;
        f.focus.defer(10, f);
    },

    /**
     * 设置window目标动画元素，当window打开是产生动画效果。
     * Sets the target element from which the window should animate while opening.
     * @param {String/Element} el 目标元素或 id。The target element or id
     */
    setAnimateTarget : function(el){
        el = Ext.get(el);
        this.animateTarget = el;
    },

    // private
    beforeShow : function(){
        delete this.el.lastXY;
        delete this.el.lastLT;
        if(this.x === undefined || this.y === undefined){
            var xy = this.el.getAlignToXY(this.container, 'c-c');
            var pos = this.el.translatePoints(xy[0], xy[1]);
            this.x = this.x === undefined? pos.left : this.x;
            this.y = this.y === undefined? pos.top : this.y;
        }
        this.el.setLeftTop(this.x, this.y);

        if(this.expandOnShow){
            this.expand(false);
        }

        if(this.modal){
            Ext.getBody().addClass("x-body-masked");
            this.mask.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
            this.mask.show();
        }
    },

    /**
     * 显示window、或者会先进行渲染、或者会设为活动、又或者会从隐藏变为置顶显示。
     * Shows the window, rendering it first if necessary, or activates it and brings it to front if hidden.
     * @param {String/Element} animateTarget （可选的） window产生动画的那个目标元素或id (默认为null即没有动画).animateTarget (optional) The target element or id from which the window should
     * animate while opening (defaults to null with no animation)
     * @param {Function} callback （可选的） 窗体显示之后执行的回调函数。(optional) A callback function to call after the window is displayed
     * @param {Object} scope (optional) （可选的） window显示后执行的回调函数.The scope in which to execute the callback
     * @return {Ext.Window} this
     */
    show : function(animateTarget, cb, scope){
        if(!this.rendered){
            this.render(Ext.getBody());
        }
        if(this.hidden === false){
            this.toFront();
            return this;
        }
        if(this.fireEvent("beforeshow", this) === false){
            return this;
        }
        if(cb){
            this.on('show', cb, scope, {single:true});
        }
        this.hidden = false;
        if(animateTarget !== undefined){
            this.setAnimateTarget(animateTarget);
        }
        this.beforeShow();
        if(this.animateTarget){
            this.animShow();
        }else{
            this.afterShow();
        }
        return this;
    },

    // private
    afterShow : function(){
        this.proxy.hide();
        this.el.setStyle('display', 'block');
        this.el.show();
        if(this.maximized){
            this.fitContainer();
        }
        if(Ext.isMac && Ext.isGecko){ // work around stupid FF 2.0/Mac scroll bar bug
        	this.cascade(this.setAutoScroll);
        }

        if(this.monitorResize || this.modal || this.constrain || this.constrainHeader){
            Ext.EventManager.onWindowResize(this.onWindowResize, this);
        }
        this.doConstrain();
        if(this.layout){
            this.doLayout();
        }
        if(this.keyMap){
            this.keyMap.enable();
        }
        this.toFront();
        this.updateHandles();
        this.fireEvent("show", this);
    },

    // private
    animShow : function(){
        this.proxy.show();
        this.proxy.setBox(this.animateTarget.getBox());
        this.proxy.setOpacity(0);
        var b = this.getBox(false);
        b.callback = this.afterShow;
        b.scope = this;
        b.duration = .25;
        b.easing = 'easeNone';
        b.opacity = .5;
        b.block = true;
        this.el.setStyle('display', 'none');
        this.proxy.shift(b);
    },

    /**
     * 隐藏window，设其为不可视并偏移到零下的区域。
     * Hides the window, setting it to invisible and applying negative offsets.
     * @param {String/Element} animateTarget （可选的）window产生动画的那个目标元素或id（默认为null即没有动画）。(optional) The target element or id to which the window should
     * animate while hiding (defaults to null with no animation)
     * @param {Function} callback （可选的）window显示后执行的回调函数。(optional) A callback function to call after the window is hidden
     * @param {Object} scope （可选的）回调函数的作用域。(optional)The scope in which to execute the callback
     * @return {Ext.Window} this
     */
    hide : function(animateTarget, cb, scope){
        if(this.hidden || this.fireEvent("beforehide", this) === false){
            return this;
        }
        if(cb){
            this.on('hide', cb, scope, {single:true});
        }
        this.hidden = true;
        if(animateTarget !== undefined){
            this.setAnimateTarget(animateTarget);
        }
        if(this.modal){
            this.mask.hide();
            Ext.getBody().removeClass("x-body-masked");
        }
        if(this.animateTarget){
            this.animHide();
        }else{
            this.el.hide();
            this.afterHide();
        }
        return this;
    },

    // private
    afterHide : function(){
        this.proxy.hide();
        if(this.monitorResize || this.modal || this.constrain || this.constrainHeader){
            Ext.EventManager.removeResizeListener(this.onWindowResize, this);
        }
        if(this.keyMap){
            this.keyMap.disable();
        }
        this.fireEvent("hide", this);
    },

    // private
    animHide : function(){
        this.proxy.setOpacity(.5);
        this.proxy.show();
        var tb = this.getBox(false);
        this.proxy.setBox(tb);
        this.el.hide();
        var b = this.animateTarget.getBox();
        b.callback = this.afterHide;
        b.scope = this;
        b.duration = .25;
        b.easing = 'easeNone';
        b.block = true;
        b.opacity = 0;
        this.proxy.shift(b);
    },

    // private
    onWindowResize : function(){
        if(this.maximized){
            this.fitContainer();
        }
        if(this.modal){
            this.mask.setSize('100%', '100%');
            var force = this.mask.dom.offsetHeight;
            this.mask.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
        }
        this.doConstrain();
    },

    // private
    doConstrain : function(){
        if(this.constrain || this.constrainHeader){
            var offsets;
            if(this.constrain){
                offsets = {
                    right:this.el.shadowOffset,
                    left:this.el.shadowOffset,
                    bottom:this.el.shadowOffset
                };
            }else {
                var s = this.getSize();
                offsets = {
                    right:-(s.width - 100),
                    bottom:-(s.height - 25)
                };
            }

            var xy = this.el.getConstrainToXY(this.container, true, offsets);
            if(xy){
                this.setPosition(xy[0], xy[1]);
            }
        }
    },

    // private - used for dragging
    ghost : function(cls){
        var ghost = this.createGhost(cls);
        var box = this.getBox(true);
        ghost.setLeftTop(box.x, box.y);
        ghost.setWidth(box.width);
        this.el.hide();
        this.activeGhost = ghost;
        return ghost;
    },

    // private
    unghost : function(show, matchPosition){
        if(show !== false){
            this.el.show();
            this.focus();
	        if(Ext.isMac && Ext.isGecko){ // work around stupid FF 2.0/Mac scroll bar bug
	        	this.cascade(this.setAutoScroll);
	        }
        }
        if(matchPosition !== false){
            this.setPosition(this.activeGhost.getLeft(true), this.activeGhost.getTop(true));
        }
        this.activeGhost.hide();
        this.activeGhost.remove();
        delete this.activeGhost;
    },

    /**
     * window最小化方法的载体（Placeholder）。默认下，该方法简单地触发最小化事件{@link #minimize},因为最小化的行为是应用程序特定的，要实现自定义的最小化行为，应提供一个最小化事件处理函数或重写该方法。 
     * Placeholder method for minimizing the window.  By default, this method simply fires the {@link #minimize} event
     * since the behavior of minimizing a window is application-specific.  To implement custom minimize behavior,
     * either the minimize event can be handled or this method can be overridden.
     * @return {Ext.Window} this
     */
    minimize : function(){
        this.fireEvent('minimize', this);
        return this;
    },

    /**
     * 关闭window，在DOM中移除并摧毁window对象。在关闭动作发生之前触发beforeclose事件，如返回false则取消close动作。
     * Closes the window, removes it from the DOM and destroys the window object.  The beforeclose event is fired
     * before the close happens and will cancel the close action if it returns false.
     */
    close : function(){
        if(this.fireEvent("beforeclose", this) !== false){
            this.hide(null, function(){
                this.fireEvent('close', this);
                this.destroy();
            }, this);
        }
    },

    /**
     * 自适应window尺寸到其当前的容器，并将'最大化'按钮换成'复原'按钮。
     * Fits the window within its current container and automatically replaces the 'maximize' tool button with
     * the 'restore' tool button.
     * @return {Ext.Window} this
     */
    maximize : function(){
        if(!this.maximized){
            this.expand(false);
            this.restoreSize = this.getSize();
            this.restorePos = this.getPosition(true);
            if (this.maximizable){
                this.tools.maximize.hide();
                this.tools.restore.show();
            }
            this.maximized = true;
            this.el.disableShadow();

            if(this.dd){
                this.dd.lock();
            }
            if(this.collapsible){
                this.tools.toggle.hide();
            }
            this.el.addClass('x-window-maximized');
            this.container.addClass('x-window-maximized-ct');

            this.setPosition(0, 0);
            this.fitContainer();
            this.fireEvent('maximize', this);
        }
        return this;
    },

    /**
     * 把已最大化window复原到原始的尺寸，并将“复原”按钮换成“最大化”按钮。
     * Restores a maximized window back to its original size and position prior to being maximized and also replaces
     * the 'restore' tool button with the 'maximize' tool button.
     * @return {Ext.Window} this
     */
    restore : function(){
        if(this.maximized){
            this.el.removeClass('x-window-maximized');
            this.tools.restore.hide();
            this.tools.maximize.show();
            this.setPosition(this.restorePos[0], this.restorePos[1]);
            this.setSize(this.restoreSize.width, this.restoreSize.height);
            delete this.restorePos;
            delete this.restoreSize;
            this.maximized = false;
            this.el.enableShadow(true);

            if(this.dd){
                this.dd.unlock();
            }
            if(this.collapsible){
                this.tools.toggle.show();
            }
            this.container.removeClass('x-window-maximized-ct');

            this.doConstrain();
            this.fireEvent('restore', this);
        }
        return this;
    },

    /**
     * 根据当前window的最大化状态轮换{@link #maximize}和{@link #restore}的快捷方法。
     * A shortcut method for toggling between {@link #maximize} and {@link #restore} based on the current maximized state of the window.
     * @return {Ext.Window} this
     */
    toggleMaximize : function(){
        return this[this.maximized ? 'restore' : 'maximize']();
    },

    // private
    fitContainer : function(){
        var vs = this.container.getViewSize();
        this.setSize(vs.width, vs.height);
    },

    // private
    // z-index is managed by the WindowManager and may be overwritten at any time
    setZIndex : function(index){
        if(this.modal){
            this.mask.setStyle("z-index", index);
        }
        this.el.setZIndex(++index);
        index += 5;

        if(this.resizer){
            this.resizer.proxy.setStyle("z-index", ++index);
        }

        this.lastZIndex = index;
    },

    /**
     * 对齐window到特定的元素。
     * Aligns the window to the specified element
     * @param {Mixed} element 要对齐的元素。 The element to align to.
     * @param {String} position 对齐的位置（参阅{@link Ext.Element#alignTo}个中细节）。 The position to align to (see {@link Ext.Element#alignTo} for more details).
     * @param {Array} offsets （可选的）偏移位置 [x, y]。(optional)Offset the positioning by [x, y]
     * @return {Ext.Window} this
     */
    alignTo : function(element, position, offsets){
        var xy = this.el.getAlignToXY(element, position, offsets);
        this.setPagePosition(xy[0], xy[1]);
        return this;
    },

    /**
     * 当window大小变化时或滚动时，固定此window到另外一个元素和重新对齐。
     * Anchors this window to another element and realigns it when the window is resized or scrolled.
     * @param {Mixed} element 对齐的元素。The element to align to.
     * @param {String} position 对齐的位置（参阅{@link Ext.Element#alignTo}细节）。The position to align to (see {@link Ext.Element#alignTo} for more details)
     * @param {Array} offsets （可选的）偏移位置 [x, y]。(optional)Offset the positioning by [x, y]
     * @param {Boolean/Number} monitorScroll （可选的） true表示为随着body的变化而重新定位，如果此参数是一个数字，那么将用于缓冲的延时（默认为50ms）。(optional) true to monitor body scroll and reposition. If this parameter
     * is a number, it is used as the buffer delay (defaults to 50ms).
     * @return {Ext.Window} this
     */
    anchorTo : function(el, alignment, offsets, monitorScroll){
      if(this.doAnchor){
          Ext.EventManager.removeResizeListener(this.doAnchor, this);
          Ext.EventManager.un(window, 'scroll', this.doAnchor, this);
      }
      this.doAnchor = function(){
          this.alignTo(el, alignment, offsets);
      };
      Ext.EventManager.onWindowResize(this.doAnchor, this);
      
      var tm = typeof monitorScroll;
      if(tm != 'undefined'){
          Ext.EventManager.on(window, 'scroll', this.doAnchor, this,
              {buffer: tm == 'number' ? monitorScroll : 50});
      }
      this.doAnchor();
      return this;
    },

    /**
     * 使用window先于其它window显示。
     * Brings this window to the front of any other visible windows
     * @return {Ext.Window} this
     */
    toFront : function(e){
        if(this.manager.bringToFront(this)){
            if(!e || !e.getTarget().focus){
                this.focus();
            }
        }
        return this;
    },

    /**
     * 激活此window并出现投影效果、或“反激活”并隐藏投影效果，此方法会触发相应的激活/反激活事件。
     * Makes this the active window by showing its shadow, or deactivates it by hiding its shadow.  This method also
     * fires the {@link #activate} or {@link #deactivate} event depending on which action occurred.
     * @param {Boolean} active True表示为激活window（默认为 false）。True to activate the window, false to deactivate it (defaults to false)
     */
    setActive : function(active){
        if(active){
            if(!this.maximized){
                this.el.enableShadow(true);
            }
            this.fireEvent('activate', this);
        }else{
            this.el.disableShadow();
            this.fireEvent('deactivate', this);
        }
    },

    /**
     * 让这个window居后显示（设其 z-index 稍低）。
     * Sends this window to the back of (lower z-index than) any other visible windows
     * @return {Ext.Window} this
     */
    toBack : function(){
        this.manager.sendToBack(this);
        return this;
    },

    /**
     * 使window在视图居中。
     * Centers this window in the viewport
     * @return {Ext.Window} this
     */
    center : function(){
        var xy = this.el.getAlignToXY(this.container, 'c-c');
        this.setPagePosition(xy[0], xy[1]);
        return this;
    }

    /**
     * @cfg {Boolean} autoWidth @hide
     */
});
Ext.reg('window', Ext.Window);

// private - custom Window DD implementation
Ext.Window.DD = function(win){
    this.win = win;
    Ext.Window.DD.superclass.constructor.call(this, win.el.id, 'WindowDD-'+win.id);
    this.setHandleElId(win.header.id);
    this.scroll = false;
};

Ext.extend(Ext.Window.DD, Ext.dd.DD, {
    moveOnly:true,
    headerOffsets:[100, 25],
    startDrag : function(){
        var w = this.win;
        this.proxy = w.ghost();
        if(w.constrain !== false){
            var so = w.el.shadowOffset;
            this.constrainTo(w.container, {right: so, left: so, bottom: so});
        }else if(w.constrainHeader !== false){
            var s = this.proxy.getSize();
            this.constrainTo(w.container, {right: -(s.width-this.headerOffsets[0]), bottom: -(s.height-this.headerOffsets[1])});
        }
    },
    b4Drag : Ext.emptyFn,

    onDrag : function(e){
        this.alignElWithMouse(this.proxy, e.getPageX(), e.getPageY());
    },

    endDrag : function(e){
        this.win.unghost();
        this.win.saveState();
    }
});
