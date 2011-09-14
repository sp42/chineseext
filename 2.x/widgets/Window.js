/**
 * @class Ext.Window
 * @extends Ext.Panel
 * 一种特殊的面板,专用于程序中的"视窗"（window）。Windows默认下是
 * 可拖动的、浮动的，并提供若干特定的行为如：最大化、复原（伴随最小化的
 * 事件，由于最小化行为是应用程序指定的。Windows既可关联到 {@link Ext.WindowGroup}
 * 或由 {@link Ext.WindowManager} 管理,提供组(grouping)，活动(activation),置前/置后(to front/back)
 * 和其它应用程序特定的功能.
 * @constructor
 * @param {Object} 配置项对象
 */
 Ext.Window = Ext.extend(Ext.Panel, {
    /**
     * @cfg {Boolean} modal
     * True 表示为当window显示时对其后面的一切内容进行遮罩,false表示为限制
     * 对其它UI元素的语法 (默认为 false).
     */
    /**
     * @cfg {String/Element} animateTarget
     * 当指定一个id或元素,window打开时会与元素之间产生动画效果(缺省为null即没有动画效果).
     */

    /**
     * @cfg {String} resizeHandles
     * 一个有效的 {@link Ext.Resizable} 手柄的配置字符串(默认为 'all').  只当 resizable = true时有效.
     */

    /**
     * @cfg {Ext.WindowGroup} manager
     * 管理该window的WindowGroup引用(默认为 {@link Ext.WindowMgr}).
     */

    /**
    * @cfg {String/Number/Button} defaultButton
    * 按钮的id / index或按钮实例,当window接收到焦点此按钮也会得到焦点.
    */
    /**
    * @cfg {Function} onEsc
    * 允许重写该句柄以替代escape键的内建控制句柄.默认的动作句柄是关闭window
    * (执行 {@link #closeAction}所指的动作).若按下escape键不关闭window,
    * 可指定此项为 {@link Ext#emptyFn}).
    */

    /**
    * @cfg {String} baseCls
    * 作用在面板元素上的CSS样式类(默认为 'x-window').
    */
    baseCls : 'x-window',

    /**
     * @cfg {Boolean} resizable
     * True 表示为允许用户从window的四边和四角改变window的大小(默认为 true).
     */
     resizable:true,

    /**
     * @cfg {Boolean} draggable
     * True 表示为window可被拖动,false表示禁止拖动(默认为true).注意,默认下
     * window会在视图中居中显示(因为可拖动),所以如果禁止可拖动的话意味着window
     * 生成之后应用一定代码定义(如 myWindow.setPosition(100, 100);).
     */
     draggable:true,

    /**
     * @cfg {Boolean} closable
     * True 表示为显示 'close' 的工具按钮可让用户关闭window,
     * false表示为隐藏按钮,并不允许关闭window(默认为 true).
     */
     closable : true,

    /**
     * @cfg {Boolean} constrain
     * True 表示为将window约束在视图中显示,false表示为允许
     * window在视图之外的地方显示(默认为 false).可迭地设置 {@link #constrainHeader}.
     */
     constrain:false,

    /**
     * @cfg {Boolean} constrainHeader
     * True 表示为将 window header约束在视图中显示,
     * false表示为允许header在视图之外的地方显示(默认为 false).可迭地设置{@link #constrain}.
     */
     constrainHeader:false,

    /**
     * @cfg {Boolean} plain
     * True 表示为渲染window body的背景为透明的背景,这样看来window body 
     * 与边框元素(framing elements)融为一体,false表示为加入浅色的背景,
     * 使得在视觉上body元素与外围边框清晰地分辨出来(默认为 false).
     */
     plain:false,

    /**
     * @cfg {Boolean} minimizable
     * True 表示为显示'最小化minimize'的工具按钮,允许用户最小化window,false表示隐藏
     * 按钮,禁止window最小化的功能(默认为 false),注意最小化window是实现具体特定的(implementation-specific),
     * 该按钮不提供最小化window的实现,所以必须提供一个最小化的事件来制定最小化的行为,这样该项
     * 才有用的.
     */
     minimizable : false,

    /**
     * @cfg {Boolean} maximizable
     * True 表示为显示'最大化maximize'的工具按钮,允许用户最大化window(默认为false)
     * 注意当window最大化时,这个工具按钮会自动变为'restore'按钮.相应的行为也变成内建的
     * 复原(restore)行为,即window可回变之前的尺寸.
     */
     maximizable : false,

    /**
     * @cfg {Number} minHeight
     * window高度的最小值,单位为象素(缺省为 100).  只当 resizable 为 true时有效.
     */
     minHeight: 100,

    /**
     * @cfg {Number} minWidth
     * window宽度的最小值,单位为象素(缺省为 200).  只当 resizable 为 true时有效.
     */
     minWidth: 200,

    /**
     * @cfg {Boolean} expandOnShow
     * True 表示为window显示时总是展开window,false则表示为按照
     * 打开时的状态显示(有可能是闭合的)(默认为 true).
     */
     expandOnShow: true,

    /**
     * @cfg {String} closeAction
     * 当关闭按钮被点击时执行的动作. 'close'缺省的动作是从DOM树
     * 中移除window并彻底销毁.'hide'是另外一个有效的选项,只是在
     * 视觉上通过偏移到零下(negative)的区域的手法来隐藏,这样使得
     * window可通过{@link #show} 的方法再显示.
     */
     closeAction: 'close',

    // inherited docs, same default
    collapsible:false,

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
    elements: 'header,body',
    /** @cfg {Boolean} frame @hide */
    frame:true,
    /** @cfg {Boolean} floating @hide */
    floating:true,

    // private
    initComponent : function(){
        Ext.Window.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event activate
             * 当通过{@link setActive}的方法视觉上激活window后触发的事件。
             * @param {Ext.Window} this
             */ 
                                    
            /**
             * @event deactivate
             * 当通过{@link setActive}的方法视觉上使window不活动后触发的事件。
             * @param {Ext.Window} this
             */
             
            /**
             * @event resize
             * 调整window大小后触发
             * @param {Ext.Window} this
             * @param {Number} width window的新宽度
             * @param {Number} height window的新高度
             */
            'resize',
            /**
             * @event maximize
             * 当window完成最大化后触发。
             * @param {Ext.Window} this
             */          
            'maximize',
             /**
             * @event maximize
             * 当window完成最小化后触发。
             * @param {Ext.Window} this
             */     
            'minimize',
            /**
             * @event restore
             * 当window复原到原始的尺寸大小时触发。
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
        }
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
            this.resizer.on("beforeresize", this.beforeResize, this);
        }

        if(this.draggable){
            this.header.addClass("x-window-draggable");
        }
        this.initTools();

        this.el.on("mousedown", this.toFront, this);
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
        this.dd = new Ext.Window.DD(this);  
    },

   // private
    onEsc : function(){
        this[this.closeAction]();  
    },

    // private
    beforeDestroy : function(){
        Ext.destroy(
            this.resizer,
            this.dd,
            this.proxy
        );
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
            this.header.on('dblclick', this.toggleMaximize, this);
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
        this.fireEvent("resize", this, box.width, box.height);
    },

    /**
     * Focuses the window.  If a defaultButton is set, it will receive focus, otherwise the
     * window itself will receive focus.
     */
    /**
     * 焦点这个window. 若有defaultButton,它就会接送到一个焦点,否则是window本身接收到焦点.
     */
     focus : function(){
        var f = this.focusEl, db = this.defaultButton, t = typeof db;
        if(t != 'undefined'){
            if(t == 'number'){
                f = this.buttons[db];
            }else if(t == 'string'){
                f = Ext.getCmp(db);
            }else{
                f = db;
            }
        }
        f.focus.defer(10, f);
    },

    /**
     * 设置window目标动画元素,当window打开是产生动画效果.
     * @param {String/Element} el 目标元素或 id
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
     * 显示window,或者会先进行渲染,或者会设为活动,又或者会从隐藏变为置顶显示.
     * @param {String/Element} animateTarget (可选的) window产生动画的那个目标元素
     * 或id (默认为null即没有动画).
     * @param {Function} callback (可选的) window显示后执行的回调函数.
     * @param {Object} scope (可选的) 回调函数的作用域.
     */
     show : function(animateTarget, cb, scope){
        if(!this.rendered){
            this.render(Ext.getBody());
        }
        if(this.hidden === false){
            this.toFront();
            return;
        }
        if(this.fireEvent("beforeshow", this) === false){
            return;
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
    },

    // private
    afterShow : function(){
        this.proxy.hide();
        this.el.setStyle('display', 'block');
        this.el.show();
        if(this.maximized){
            this.fitContainer();
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
     * 隐藏 window, 设其为不可视并偏移到零下的区域.
     * @param {String/Element} animateTarget (可选的) window产生动画的那个目标元素
     * 或id (默认为null即没有动画).
     * @param {Function} callback (可选的) window显示后执行的回调函数.
     * @param {Object} scope (可选的) 回调函数的作用域.
     */
     hide : function(animateTarget, cb, scope){
        if(this.hidden || this.fireEvent("beforehide", this) === false){
            return;
        }
        if(cb){
            this.on('hide', cb, scope, {single:true});
        }
        this.hidden = true;
        if(animateTarget !== undefined){
            this.setAnimateTarget(animateTarget);
        }
        if(this.animateTarget){
            this.animHide();
        }else{
            this.el.hide();
            this.afterHide();
        }
    },

    // private
    afterHide : function(){
        this.proxy.hide();
        if(this.monitorResize || this.modal || this.constrain || this.constrainHeader){
            Ext.EventManager.removeResizeListener(this.onWindowResize, this);
        }
        if(this.modal){
            this.mask.hide();
            Ext.getBody().removeClass("x-body-masked");
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
        }
        if(matchPosition !== false){
            this.setPosition(this.activeGhost.getLeft(true), this.activeGhost.getTop(true));
        }
        this.activeGhost.hide();
        this.activeGhost.remove();
        delete this.activeGhost;
    },


    /**
     * window最小化方法的载体 (Placeholder),默认下,该方法简单地触发最小化事件,因为
     * 最小化的行为是应用程序特定的,要实现自定义的最小化行为,应提供一个最小化事件句柄或重写该方法. 
     */
     minimize : function(){
        this.fireEvent('minimize', this);
    },


    /**
     * 关闭window,在DOM中移除并摧毁window对象.在关闭动作发生之前触发beforeclose事件,
     * 如返回false则取消close动作.
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
     * 自适应window尺寸到其当前的容器,并将'最大化'按钮换成'复原'按钮.
     */
     maximize : function(){
        if(!this.maximized){
            this.expand(false);
            this.restoreSize = this.getSize();
            this.restorePos = this.getPosition(true);
            this.tools.maximize.hide();
            this.tools.restore.show();
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
    },

    /**
     * 把已最大化window复原到原始的尺寸,并将'复原'按钮换成'最大化'按钮.
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
    },

    /**
     * 根据当前window的最大化状态轮换 {@link #maximize} 和 {@link #restore} 的快捷方法.
     */
     toggleMaximize : function(){
        this[this.maximized ? 'restore' : 'maximize']();
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
     * 对齐window到特定的元素.
     * @param {Mixed} element 要对齐的元素.
     * @param {String} position 对齐的位置(参阅 {@link Ext.Element#alignTo} 细节).
     * @param {Array} offsets (可选的) 偏移位置 [x, y]
     * @return {Ext.Window} this
     */
     alignTo : function(element, position, offsets){
        var xy = this.el.getAlignToXY(element, position, offsets);
        this.setPagePosition(xy[0], xy[1]);
        return this;
    },

    /**
     * 当window大小变化时或滚动时,固定此window到另外一个元素和重新对齐.
     * @param {Mixed} element 对齐的元素.
     * @param {String} position 对齐的位置(参阅 {@link Ext.Element#alignTo} 细节).
     * @param {Array} offsets (可选的) 偏移位置 [x, y]
     * @param {Boolean/Number} monitorScroll (可选的) true 表示为随着body的变化而重新
     * 定位,如果此参数是一个数字,那么将用于缓冲的延时(默认为 50ms).
     * @return {Ext.Window} this
     */
     anchorTo : function(el, alignment, offsets, monitorScroll, _pname){
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
        this[_pname] = action;
        return this;
    },

    /**
     * 使用window先于其它window显示.
     * @return {Ext.Window} this
     */
     toFront : function(){
        if(this.manager.bringToFront(this)){
            this.focus();
        }
        return this;
    },

    /**
     * 激活此window并出现投影效果.或'反激活'并隐藏投影效果,此方法会触发相应的激活/反激活事件.
     * @param {Boolean} active True 表示为激活window(默认为 false)
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
     * 让这个window居后显示(设其 z-index 稍低).
     * @return {Ext.Window} this
     */
     toBack : function(){
        this.manager.sendToBack(this);
        return this;
    },

    /**
     * 使window在视图居中.
     * @return {Ext.Window} this
     */
     center : function(){
        var xy = this.el.getAlignToXY(this.container, 'c-c');
        this.setPagePosition(xy[0], xy[1]);
        return this;
    }
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