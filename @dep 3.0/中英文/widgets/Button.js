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
 * @class Ext.Button
 * @extends Ext.BoxComponent
 * 简单的按钮类。
 * Simple Button class
 * @cfg {String} text 按钮文本。The button text to be used as innerHTML (html tags are accepted)
 * @cfg {String} icon 背景图片路径（默认是采用css的background-image来设置图片，所以如果你需要混合了图片和文字的图片按钮请使用cls类"x-btn-text-icon"）。The path to an image to display in the button (the image will be set as the background-image
 * CSS property of the button by default, so if you want a mixed icon/text button, set cls:"x-btn-text-icon")
 * @cfg {Function} handler 按钮单击事件触发函数 （可取代单击的事件）。 A function called when the button is clicked (can be used instead of click event)
 * @cfg {Object} scope 按钮单击事件触发函数的作用域。The scope of the handler
 * @cfg {Number} minWidth 按钮最小宽度（常用于定义一组按钮的标准宽度）。The minimum width for this button (used to give a set of buttons a common width)
 * @cfg {String/Object} tooltip 按钮鼠标划过时的提示语类似title - 可以是字符串QuickTips配置项对象。The tooltip for the button - can be a string to be used as innerHTML (html tags are accepted) or QuickTips config object
 * @cfg {Boolean} hidden 是否隐藏（默认为false）。True to start hidden (defaults to false)
 * @cfg {Boolean} disabled True 是否失效（默认为false）。True to start disabled (defaults to false)
 * @cfg {Boolean} pressed 是否为按下状态（仅当enableToggle = true时）。True to start pressed (only if enableToggle = true)
 * @cfg {String} toggleGroup 是否属于按钮组（组里只有一个按钮可以为按下状态，仅当enableToggle = true时）。The group this toggle button is a member of (only 1 per group can be pressed)
 * @cfg {Boolean/Object} repeat 触发函数是否可以重复触发。 默认为false，也可以为{@link Ext.util.ClickRepeater}的参数对象。
 * while the mouse is down.True to repeat fire the click event while the mouse is down. This can also be
  an {@link Ext.util.ClickRepeater} config object (defaults to false).
 * @constructor 创建新的按钮。Create a new button
 * @param {Object} config 参数对象。The config object
 */
Ext.Button = Ext.extend(Ext.BoxComponent, {
    /**
     * Read-only.  如果按钮是隐藏的。
     * True if this button is hidden
     * @type Boolean
     */
    hidden : false,
    /**
     * Read-only. 如果按钮是失效的。
     * True if this button is disabled
     * @type Boolean
     */
    disabled : false,
    /**
     * Read-only.  如果按钮是按下状态（仅当enableToggle = true时）。
     * True if this button is pressed (only if enableToggle = true)
     * @type Boolean
     * @property pressed
     */
    pressed : false,
    /**
     * 按钮所在的{@link Ext.Panel}。（默认为undefined，当按钮加入到容器后自动设置该属性）。只读的。
     * The Button's owner {@link Ext.Panel} (defaults to undefined, and is set automatically when
     * the Button is added to a container).  Read-only.
     * @type Ext.Panel
     * @property ownerCt
     */

    /**
     * @cfg {Number} tabIndex 按钮的DOM焦点序号即tab键时候得到焦点的序号（默认为undefined）。
     * Set a DOM tabIndex for this button (defaults to undefined)
     */

    /**
     * @cfg {Boolean} allowDepress
     * False表示不允许按钮“固定按下的状态”，（默认为undefined）。当{@link #enableToggle}激活时，该项才有效。
     * False to not allow a pressed Button to be depressed (defaults to undefined). Only valid when {@link #enableToggle} is true.
     */

    /**
     * @cfg {Boolean} enableToggle
     * True 是否在 pressed/not pressed 这两个状态间切换 （默认为false）。
     * True to enable pressed/not pressed toggling (defaults to false)
     */
    enableToggle: false,
    /**
     * @cfg {Function} toggleHandler
     * 当{@link #enableToggle}激活时，该项才有效。这是点击的处理函数。会送入两个参数：
     * Function called when a Button with {@link #enableToggle} set to true is clicked. Two arguments are passed:<ul class="mdetail-params">
     * <li><b>button</b> : Ext.Button<div class="sub-desc">Button对象。this Button object</div></li>
     * <li><b>state</b> : Boolean<div class="sub-desc">按钮的已发生的状态，true表示按了。The next state if the Button, true means pressed.</div></li>
     * </ul>
     */
    /**
     * @cfg {Mixed} menu
     * 标准menu属性 可设置为menu的引用 或者menu的id 或者menu的参数对象 （默认为undefined）。
     * Standard menu attribute consisting of a reference to a menu object, a menu id or a menu config blob (defaults to undefined).
     */
    /**
     * @cfg {String} menuAlign
     * 菜单的对齐方式（参阅{@link Ext.Element#alignTo}以了解个中细节，默认为'tl-bl?'）。
     * The position to align the menu to (see {@link Ext.Element#alignTo} for more details, defaults to 'tl-bl?').
     */
    menuAlign : "tl-bl?",

    /**
     * @cfg {String} iconCls
     * 用来指定背景图片的样式类。
     * A css class which sets a background image to be used as the icon for this button
     */
    /**
     * @cfg {String} type
     *  按钮的三种类型（submit、reset、button），默认为'button'。
     *  submit, reset or button - defaults to 'button'
     */
    type : 'button',

    // private
    menuClassTarget: 'tr:nth(2)',

    /**
     * @cfg {String} clickEvent handler 处理函数触发事件（默认是单击）。
     * The type of event to map to the button's event handler (defaults to 'click')
     */
    clickEvent : 'click',

    /**
     * @cfg {Boolean} handleMouseEvents 是否启用mouseover，mouseout与mousedown鼠标事件（默认为true）。
     * False to disable visual cues on mouseover, mouseout and mousedown (defaults to true)
     */
    handleMouseEvents : true,

    /**
     * @cfg {String} tooltipType
     * tooltip 的显示方式 既可是'qtip'（默认），也可是设置title属性的“标题”。
     * The type of tooltip to use. Either "qtip" (default) for QuickTips or "title" for title attribute.
     */
    tooltipType : 'qtip',

    /**
     * @cfg {String} buttonSelector
     * <p>
     * （可选的）
     * 分辨DOM结构其中的激活、可点击元素的{@link Ext.DomQuery DomQuery}。
     * (Optional) A {@link Ext.DomQuery DomQuery} selector which is used to extract the active, clickable element from the
     * DOM structure created.</p>
     * <p>
     * 当定义了{@link #template}，你必须保证该选择符的结果限于一个可以获得焦点的元素。
     * When a custom {@link #template} is used, you  must ensure that this selector results in the selection of
     * a focussable element.</p>
     * <p>
     * 默认为<b><tt>"button:first-child"</tt></b>。
     * Defaults to <b><tt>"button:first-child"</tt></b>.</p>
     */
    buttonSelector : "button:first-child",

    /**
     * @cfg {String} scale
     * <p>
     * （可选的）元素的大小。可允许有这三种的值：
     * (Optional) The size of the Button. Three values are allowed:</p>
     * <ul class="mdetail-params">
     * <li>"small"<div class="sub-desc">按钮元素是16px的高度。Results in the button element being 16px high.</div></li>
     * <li>"medium"<div class="sub-desc">按钮元素是24px的高度。Results in the button element being 24px high.</div></li>
     * <li>"large"<div class="sub-desc">按钮元素是32px的高度。Results in the button element being 32px high.</div></li>
     * </ul>
     * <p>
     * 默认为<b><tt>"small"</tt></b>。
     * Defaults to <b><tt>"small"</tt></b>.</p>
     */
    scale: 'small',

    /**
     * @cfg {String} iconAlign
     * <p>（可选的）渲染图标的按钮方向。可允许有这四种的值：
     * (Optional)The side of the Button box to render the icon. Four values are allowed:</p>
     * <ul class="mdetail-params">
     * <li>"top"<div class="sub-desc"></div></li>
     * <li>"right"<div class="sub-desc"></div></li>
     * <li>"bottom"<div class="sub-desc"></div></li>
     * <li>"left"<div class="sub-desc"></div></li>
     * </ul>
     * <p>
     * 默认为<b><tt>"left"</tt></b>。
     * Defaults to <b><tt>"left"</tt></b>.</p>
     */
    iconAlign : 'left',

    /**
     * @cfg {String} arrowAlign
     * <p>（可选的）渲染图标的箭头方向，如果有关联{@link #menu}的话。可允许有这两种的值：
     * (Optional) The side of the Button box to render the arrow if the button has an associated {@link #menu}.
     * Two values are allowed:</p>
     * <ul class="mdetail-params">
     * <li>"right"<div class="sub-desc"></div></li>
     * <li>"bottom"<div class="sub-desc"></div></li>
     * </ul>
     * <p>Defaults to <b><tt>"right"</tt></b>.</p>
     */
    arrowAlign : 'right',

    /**
     * @cfg {Ext.Template} template 
     * （可选配置） 如果设置了可用来生成按钮的主要元素。第一个占位符为按钮文本.修改这个属性要主意相关参数不能缺失。
     * (Optional)A {@link Ext.Template Template} used to create the Button's DOM structure.
     * Instances, or subclasses which need a different DOM structure may provide a different
     * template layout in conjunction with an implementation of {@link #getTemplateArgs}.
     * @type Ext.Template
     * @property template
     */
    /**
     * @cfg {String} cls
     * 为按钮主元素设置一个CSS样式。
     * A CSS class string to apply to the button's main element.
     */

    initComponent : function(){
        Ext.Button.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event click
             * 单击触发事件。
             * Fires when this button is clicked
             * @param {Button} this
             * @param {EventObject} e 单击的事件对象。The click event
             */
            "click",
            /**
             * @event toggle
             * 按钮按下状态切换触发事件（仅当enableToggle = true时）。
             * Fires when the "pressed" state of this button changes (only if enableToggle = true)
             * @param {Button} this
             * @param {Boolean} pressed
             */
            "toggle",
            /**
             * @event mouseover
             * 鼠标居上触发事件。
             * Fires when the mouse hovers over the button
             * @param {Button} this
             * @param {Event} e 事件对象。The event object
             */
            'mouseover',
            /**
             * @event mouseout
             * 鼠标离开事件。
             * Fires when the mouse exits the button
             * @param {Button} this
             * @param {Event} e 事件对象。The event object
             */
            'mouseout',
            /**
             * @event menushow
             * 有menu的时候 menu显示触发事件。
             * If this button has a menu, this event fires when it is shown
             * @param {Button} this
             * @param {Menu} menu
             */
            'menushow',
            /**
             * @event menuhide
             * 有menu的时候 menu隐藏触发事件。
             * If this button has a menu, this event fires when it is hidden
             * @param {Button} this
             * @param {Menu} menu
             */
            'menuhide',
            /**
             * @event menutriggerover
             * 有menu的时候 menu焦点转移到菜单项时触发事件。
             * If this button has a menu, this event fires when the mouse enters the menu triggering element
             * @param {Button} this
             * @param {Menu} menu
             * @param {EventObject} e 事件对象
             */
            'menutriggerover',
            /**
             * @event menutriggerout
             * 有menu的时候 menu焦点离开菜单项时触发事件。
             * If this button has a menu, this event fires when the mouse leaves the menu triggering element
             * @param {Button} this
             * @param {Menu} menu
             * @param {EventObject} e 事件对象
             */
            'menutriggerout'
        );
        if(this.menu){
            this.menu = Ext.menu.MenuMgr.get(this.menu);
        }
        if(typeof this.toggleGroup === 'string'){
            this.enableToggle = true;
        }
    },

/**
  * <p>
  * 这个方法返回一个提供可替换参数的对象，供{@link #template Template}所使用以创建按钮的DOM结构。
  * {@link #template Template}This method returns an object which provides substitution parameters for the {@link #template Template} used
  * to create this Button's DOM structure.</p>
  * <p>
  * 实例或子类如果在模板上面有变化的话，可提供一个新的该方法之实现，以适应新模板创建不同的DOM结构。
  * Instances or subclasses which use a different Template to create a different DOM structure may need to provide their
  * own implementation of this method.</p>
  * <p>
  * 默认的实现就返回包含以下元素的数组：
  * The default implementation which provides data for the default {@link #template} returns an Array containing the
  * following items:</p><div class="mdetail-params"><ul>
  * <li>按钮的文本{@link #text}。The Button's {@link #text}</li>
  * <li>&lt;button&gt;的类型{@link #type}。The &lt;button&gt;'s {@link #type}</li>
  * <li>&lt;button&gt; {@link #btnEl element}按钮元素的{@link iconCls}。The {@link iconCls} applied to the &lt;button&gt; {@link #btnEl element}</li>
  * <li>The {@link #cls} applied to the Button's main {@link #getEl Element}</li>
  * <li>控制Button的{@link #scale}与{@link #iconAlign icon alignment}的CSS样式名称。A CSS class name controlling the Button's {@link #scale} and {@link #iconAlign icon alignment}</li>
  * <li>若已设{@link #menu}给Button所设的CSS样式名称。A CSS class name which applies an arrow to the Button if configured with a {@link #menu}</li>
  * </ul></div>
  * @return {Object} 模板的替换数据。Substitution data for a Template.
 */
    getTemplateArgs : function(){
        var cls = (this.cls || '');
        cls += this.iconCls ? (this.text ? ' x-btn-text-icon' : ' x-btn-icon') : ' x-btn-noicon';
        if(this.pressed){
            cls += ' x-btn-pressed';
        }
        return [this.text || '&#160;', this.type, this.iconCls || '', cls, 'x-btn-' + this.scale + ' x-btn-icon-' + this.scale + '-' + this.iconAlign, this.getMenuClass()];
    },

    // protected
    getMenuClass : function(){
        return this.menu ? (this.arrowAlign != 'bottom' ? 'x-btn-arrow' : 'x-btn-arrow-bottom') : '';
    },

    // private
    onRender : function(ct, position){
        if(!this.template){
            if(!Ext.Button.buttonTemplate){
                // hideous table template
                Ext.Button.buttonTemplate = new Ext.Template(
                    '<table cellspacing="0" class="x-btn {3}"><tbody class="{4}">',
                    '<tr><td class="x-btn-tl"><i>&#160;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&#160;</i></td></tr>',
                    '<tr><td class="x-btn-ml"><i>&#160;</i></td><td class="x-btn-mc"><em class="{5}" unselectable="on"><button class="x-btn-text {2}" type="{1}">{0}</button></em></td><td class="x-btn-mr"><i>&#160;</i></td></tr>',
                    '<tr><td class="x-btn-bl"><i>&#160;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&#160;</i></td></tr>',
                    "</tbody></table>");
                Ext.Button.buttonTemplate.compile();
            }
            this.template = Ext.Button.buttonTemplate;
        }

        var btn, targs = this.getTemplateArgs();

        if(position){
            btn = this.template.insertBefore(position, targs, true);
        }else{
            btn = this.template.append(ct, targs, true);
        }
        /**
         * 一个对Button可点击元素的封装。默认下这是<tt>&lt;button&gt;</tt>元素的引用。只读的。
         * An {@link Ext.Element Element} encapsulating the Button's clickable element. By default,
         * this references a <tt>&lt;button&gt;</tt> element. Read only.
         * @type Ext.Element
         * @property btnEl
         */
        var btnEl = this.btnEl = btn.child(this.buttonSelector);
        this.mon(btnEl, 'focus', this.onFocus, this);
        this.mon(btnEl, 'blur', this.onBlur, this);

        this.initButtonEl(btn, btnEl);

        Ext.ButtonToggleMgr.register(this);
    },

    // private
    initButtonEl : function(btn, btnEl){
        this.el = btn;

        if(this.id){
            this.el.dom.id = this.el.id = this.id;
        }
        if(this.icon){
            btnEl.setStyle('background-image', 'url(' +this.icon +')');
        }
        if(this.tabIndex !== undefined){
            btnEl.dom.tabIndex = this.tabIndex;
        }
        if(this.tooltip){
            this.setTooltip(this.tooltip);
        }

        if(this.handleMouseEvents){
        	this.mon(btn, 'mouseover', this.onMouseOver, this);
        	this.mon(btn, 'mousedown', this.onMouseDown, this);
        	
            // new functionality for monitoring on the document level
            //this.mon(btn, "mouseout", this.onMouseOut, this);
        }

        if(this.menu){
        	this.mon(this.menu, 'show', this.onMenuShow, this);
        	this.mon(this.menu, 'hide', this.onMenuHide, this);
        }

        if(this.repeat){
            var repeater = new Ext.util.ClickRepeater(btn,
                typeof this.repeat == "object" ? this.repeat : {}
            );
            this.mon(repeater, 'click', this.onClick, this);
        }
		
        this.mon(btn, this.clickEvent, this.onClick, this);
    },

    // private
    afterRender : function(){
        Ext.Button.superclass.afterRender.call(this);
        if(Ext.isIE6){
            this.doAutoWidth.defer(1, this);
        }else{
            this.doAutoWidth();
        }
    },

    /**
     * 替换按钮针对背景图片的css类。连动替换按钮参数对象中的该属性。
     * Sets the CSS class that provides a background image to use as the button's icon.  This method also changes
     * the value of the {@link iconCls} config internally.
     * @param {String} cls 图标的CSS样式类。The CSS class providing the icon image
     * @return {Ext.Button} this
     */
    setIconClass : function(cls){
        if(this.el){
            this.btnEl.replaceClass(this.iconCls, cls);
        }
        this.iconCls = cls;
        return this;
    },

    /**
     * 设置该按钮的tooltip动态提示。
     * Sets the tooltip for this Button.
     * @param {String/Object} tooltip. This may be:<div class="mdesc-details"><ul>
     * <li><b>String</b> : 用于在Tooltip显示的文本，由于分配到innerHTML属性因此可以是HTML标签的。A string to be used as innerHTML (html tags are accepted) to show in a tooltip</li>
     * <li><b>Object</b> : {@link Ext.QuickTips#register}的配置对象。A configuration object for {@link Ext.QuickTips#register}.</li>
     * </ul></div>
     * @return {Ext.Button} this
     */
    setTooltip : function(tooltip){
		if(Ext.isObject(tooltip)){
            Ext.QuickTips.register(Ext.apply({
                  target: this.btnEl.id
            }, tooltip));
        } else {
            this.btnEl.dom[this.tooltipType] = tooltip;
        }
        return this;
    },
	
    // private
    beforeDestroy: function(){
    	if(this.rendered){
	        if(this.btnEl){
                if(typeof this.tooltip == 'object'){
                    Ext.QuickTips.unregister(this.btnEl);
                }
	        }
	    }
        Ext.destroy(this.menu);
    },

    // private
    onDestroy : function(){
        if(this.rendered){
            Ext.ButtonToggleMgr.unregister(this);
        }
    },

    // private
    doAutoWidth : function(){
        if(this.el && this.text && typeof this.width == 'undefined'){
            this.el.setWidth("auto");
            if(Ext.isIE7 && Ext.isStrict){
                var ib = this.btnEl;
                if(ib && ib.getWidth() > 20){
                    ib.clip();
                    ib.setWidth(Ext.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
                }
            }
            if(this.minWidth){
                if(this.el.getWidth() < this.minWidth){
                    this.el.setWidth(this.minWidth);
                }
            }
        }
    },

    /**
     * 增加按钮事件句柄触发函数的方法。
     * Assigns this Button's click handler
     * @param {Function} handler 当按钮按下执行的函数。The function to call when the button is clicked
     * @param {Object} scope （可选的）传入参数的作用域。(optional) Scope for the function passed in
     * @return {Ext.Button} this
     */
    setHandler : function(handler, scope){
        this.handler = handler;
        this.scope = scope;
        return this;
    },

    /**
     * 设置按钮文本。
     * Sets this Button's text
     * @param {String} text 按钮的文字。The button text
     * @return {Ext.Button} this
     */
    setText : function(text){
        this.text = text;
        if(this.el){
            this.el.child("td.x-btn-mc " + this.buttonSelector).update(text);
        }
        this.doAutoWidth();
        return this;
    },

    /**
     * 获取按钮的文字。
     * Gets the text for this Button
     * @return {String} 按钮的文字。The button text
     */
    getText : function(){
        return this.text;
    },

    /**
     * 如果有传入state的参数，就按照state的参数设置否则当前的state就会轮换。
     * If a state it passed, it becomes the pressed state otherwise the current state is toggled.
     * @param {Boolean} state （可选的）指定特定的状态。(optional) Force a particular state
     * @param {Boolean} supressEvent （可选的）表示为调用该方法时不触发事件。(optional) True to stop events being fired when calling this method.
     * @return {Ext.Button} this
     */
    toggle : function(state, suppressEvent){
        state = state === undefined ? !this.pressed : !!state;
        if(state != this.pressed){
            this.el[state ? 'addClass' : 'removeClass']("x-btn-pressed");
            this.pressed = state;
            if(!suppressEvent){
                this.fireEvent("toggle", this, state);
                if(this.toggleHandler){
                    this.toggleHandler.call(this.scope || this, this, state);
                }
            }
        }
        return this;
    },

    /**
     * 使按钮获取焦点。
     * Focus the button
     */
    focus : function(){
        this.btnEl.focus();
    },

    // private
    onDisable : function(){
        this.onDisableChange(true);
    },

    // private
    onEnable : function(){
        this.onDisableChange(false);
    },
    
    onDisableChange : function(disabled){
        if(this.el){
            if(!Ext.isIE6 || !this.text){
                this.el[disabled ? 'addClass' : 'removeClass'](this.disabledClass);
            }
            this.el.dom.disabled = disabled;
        }
        this.disabled = disabled;
    },

    /**
     * 显示按钮附带的菜单（如果有的话）。
     * Show this button's menu (if it has one)
     */
    showMenu : function(){
        if(this.menu){
            this.menu.show(this.el, this.menuAlign);
        }
        return this;
    },

    /**
     * 隐藏按钮附带的菜单（如果有的话）。
     * Hide this button's menu (if it has one)
     */
    hideMenu : function(){
        if(this.menu){
            this.menu.hide();
        }
        return this;
    },

    /**
     * 若按钮附有菜单并且是显示着的就返回true。
     * eturns true if the button has a menu and it is visible
     * @return {Boolean}
     */
    hasVisibleMenu : function(){
        return this.menu && this.menu.isVisible();
    },

    // private
    onClick : function(e){
        if(e){
            e.preventDefault();
        }
        if(e.button != 0){
            return;
        }
        if(!this.disabled){
            if(this.enableToggle && (this.allowDepress !== false || !this.pressed)){
                this.toggle();
            }
            if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
                this.showMenu();
            }
            this.fireEvent("click", this, e);
            if(this.handler){
                //this.el.removeClass("x-btn-over");
                this.handler.call(this.scope || this, this, e);
            }
        }
    },

    // private
    isMenuTriggerOver : function(e, internal){
        return this.menu && !internal;
    },

    // private
    isMenuTriggerOut : function(e, internal){
        return this.menu && !internal;
    },

    // private
    onMouseOver : function(e){
        if(!this.disabled){
            var internal = e.within(this.el,  true);
            if(!internal){
                this.el.addClass("x-btn-over");
                if(!this.monitoringMouseOver){
                    Ext.getDoc().on('mouseover', this.monitorMouseOver, this);
                    this.monitoringMouseOver = true;
                }
                this.fireEvent('mouseover', this, e);
            }
            if(this.isMenuTriggerOver(e, internal)){
                this.fireEvent('menutriggerover', this, this.menu, e);
            }
        }
    },

    // private
    monitorMouseOver : function(e){
        if(e.target != this.el.dom && !e.within(this.el)){
            if(this.monitoringMouseOver){
                Ext.getDoc().un('mouseover', this.monitorMouseOver, this);
                this.monitoringMouseOver = false;
            }
            this.onMouseOut(e);
        }
    },

    // private
    onMouseOut : function(e){
        var internal = e.within(this.el) && e.target != this.el.dom;
        this.el.removeClass("x-btn-over");
        this.fireEvent('mouseout', this, e);
        if(this.isMenuTriggerOut(e, internal)){
            this.fireEvent('menutriggerout', this, this.menu, e);
        }
    },
    // private
    onFocus : function(e){
        if(!this.disabled){
            this.el.addClass("x-btn-focus");
        }
    },
    // private
    onBlur : function(e){
        this.el.removeClass("x-btn-focus");
    },

    // private
    getClickEl : function(e, isUp){
       return this.el;
    },

    // private
    onMouseDown : function(e){
        if(!this.disabled && e.button == 0){
            this.getClickEl(e).addClass("x-btn-click");
            Ext.getDoc().on('mouseup', this.onMouseUp, this);
        }
    },
    // private
    onMouseUp : function(e){
        if(e.button == 0){
            this.getClickEl(e, true).removeClass("x-btn-click");
            Ext.getDoc().un('mouseup', this.onMouseUp, this);
        }
    },
    // private
    onMenuShow : function(e){
        this.ignoreNextClick = 0;
        this.el.addClass("x-btn-menu-active");
        this.fireEvent('menushow', this, this.menu);
    },
    // private
    onMenuHide : function(e){
        this.el.removeClass("x-btn-menu-active");
        this.ignoreNextClick = this.restoreClick.defer(250, this);
        this.fireEvent('menuhide', this, this.menu);
    },

    // private
    restoreClick : function(){
        this.ignoreNextClick = 0;
    }



    /**
     * @cfg {String} autoEl @hide
     */
});
Ext.reg('button', Ext.Button);

// Button的辅助类，是私有的。Private utility class used by Button
Ext.ButtonToggleMgr = function(){
   var groups = {};

   function toggleGroup(btn, state){
       if(state){
           var g = groups[btn.toggleGroup];
           for(var i = 0, l = g.length; i < l; i++){
               if(g[i] != btn){
                   g[i].toggle(false);
               }
           }
       }
   }

   return {
       register : function(btn){
           if(!btn.toggleGroup){
               return;
           }
           var g = groups[btn.toggleGroup];
           if(!g){
               g = groups[btn.toggleGroup] = [];
           }
           g.push(btn);
           btn.on("toggle", toggleGroup);
       },

       unregister : function(btn){
           if(!btn.toggleGroup){
               return;
           }
           var g = groups[btn.toggleGroup];
           if(g){
               g.remove(btn);
               btn.un("toggle", toggleGroup);
           }
       },

       /**
        * 在已按下的组中返回这些按钮。没有就null。
        * Gets the pressed button in the passed group or null
        * @param {String} group
        * @return Button
        */
       getPressed : function(group){
           var g = groups[group];
           if(g){
               for(var i = 0, len = g.length; i < len; i++){
                   if(g[i].pressed === true){
                       return g[i];
                   }
               }
           }
           return null;
       }
   };
}();