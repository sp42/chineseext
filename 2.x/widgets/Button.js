
/**
 * @class Ext.Button
 * @extends Ext.Component
 * 简单的按钮类
 * @cfg {String} text 按钮文本
 * @cfg {String} 背景图片路径 (默认是采用css的background-image来设置图片,所以如果你需要混合了图片和文字的图片按钮请使用cls类"x-btn-text-icon")
 * @cfg {Function} 按钮单击事件触发函数 （可取代单击的事件）
 * @cfg {Object} scope 按钮单击事件触发函数的作用域 
 * @cfg {Number} minWidth 按钮最小宽度（常用于定义一组按钮的标准宽度）
 * @cfg {String/Object} tooltip 按钮鼠标划过时的提示语类似title - 可以是字符串QuickTips配置项对象
 * @cfg {Boolean} hidden 是否隐藏 默认否 （默认为false）
 * @cfg {Boolean} disabled True 是否失效 默认否 （默认为false）
 * @cfg {Boolean} pressed 是否为按下状态 （仅当enableToggle = true时）
 * @cfg {String} toggleGroup 是否属于按钮组 （组里只有一个按钮可以为按下状态，仅当enableToggle = true时）
 * @cfg {Boolean/Object} repeat 触发函数是否可以重复触发while the mouse is down. 默认为false，也可以为{@link Ext.util.ClickRepeater}的参数对象.
 * @constructor 构造函数
 * @param {Object} config 参数对象
 */
Ext.Button = Ext.extend(Ext.Component, {
    /**
     * Read-only. True 如果按钮是隐藏的
     * @type Boolean
     */
    hidden : false,
    /**
     * Read-only. True 如果按钮是失效的
     * @type Boolean
     */
    disabled : false,
    /**
     * Read-only. True 如果按钮是按下状态 （仅当enableToggle = true时）
     * @type Boolean
     */
    pressed : false,

    /**
     * @cfg {Number} tabIndex 按钮的DOM焦点序号即tab键时候得到焦点的序号 （默认为undefined）
     */

    /**
     * @cfg {Boolean} enableToggle
     * True 是否在 pressed/not pressed 这两个状态间切换 （默认为false）
     */
    enableToggle: false,
    /**
     * @cfg {Mixed} menu
     * 标准menu属性 可设置为menu的引用 或者menu的id 或者menu的参数对象 （默认为undefined）.
     */
    /**
     * @cfg {String} menuAlign
     * 菜单的对齐方式（参阅{@link Ext.Element#alignTo}以了解个中细节，默认为'tl-bl?'）。
     */
    menuAlign : "tl-bl?",

    /**
     * @cfg {String} iconCls
     * A css class 用来指定背景图片
     */
    /**
     * @cfg {String} type
     * submit, reset or button - 按钮的三种类型 默认为'button'
     */
    type : 'button',

    // private
    menuClassTarget: 'tr',

    /**
     * @cfg {String} clickEvent
     *  handler 句柄触发事件 默认是单击 (defaults to 'click')
     */
    clickEvent : 'click',

    /**
     * @cfg {Boolean} handleMouseEvents
     * 是否启用mouseover, mouseout and mousedown鼠标事件 （默认为true）
     */
    handleMouseEvents : true,

    /**
     * @cfg {String} tooltipType
     * tooltip 的显示方式 既可是'qtip'（默认），也可是设置title属性的“标题”。
     */
    tooltipType : 'qtip',

    buttonSelector : "button:first",

    /**
     * @cfg {String} cls
     * 作用在按钮主元素的CSS样式类。
     */
    
    /**
     * @cfg {Ext.Template} template (Optional)
     * An {@link Ext.Template}可选配置 如果设置了可用来生成按钮的主要元素. 第一个占位符为按钮文本.修改这个属性要主意相关参数不能缺失.
     */
    initComponent : function(){
        Ext.Button.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event click
             *单击触发事件
             * @param {Button} this
             * @param {EventObject} e 单击的事件对象
             */
            "click",
            /**
             * @event toggle
             * 按钮按下状态切换触发事件（仅当enableToggle = true时）
             * @param {Button} this
             * @param {Boolean} pressed
             */
            "toggle",
            /**
             * @event mouseover
             * 鼠标居上触发事件
             * @param {Button} this
             * @param {Event} e The 事件对象
             */
            'mouseover',
            /**
             * @event mouseout
             * 鼠标离开事件
             * @param {Button} this
             * @param {Event} e 事件对象
             */
            'mouseout',
            /**
             * @event menushow
             * 有menu的时候 menu显示触发事件
             * @param {Button} this
             * @param {Menu} menu
             */
            'menushow',
            /**
             * @event menuhide
             * 有menu的时候 menu隐藏触发事件
             * @param {Button} this
             * @param {Menu} menu
             */
            'menuhide',
            /**
             * @event menutriggerover
             * 有menu的时候 menu焦点转移到菜单项时触发事件
             * @param {Button} this
             * @param {Menu} menu
             * @param {EventObject} e 事件对象
             */
            'menutriggerover',
            /**
             * @event menutriggerout
             * 有menu的时候 menu焦点离开菜单项时触发事件
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

    // private
    onRender : function(ct, position){
        if(!this.template){
            if(!Ext.Button.buttonTemplate){
                // hideous table template
                Ext.Button.buttonTemplate = new Ext.Template(
                    '<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>',
                    '<td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><em unselectable="on"><button class="x-btn-text" type="{1}">{0}</button></em></td><td class="x-btn-right"><i>&#160;</i></td>',
                    "</tr></tbody></table>");
            }
            this.template = Ext.Button.buttonTemplate;
        }
        var btn, targs = [this.text || '&#160;', this.type];

        if(position){
            btn = this.template.insertBefore(position, targs, true);
        }else{
            btn = this.template.append(ct, targs, true);
        }
        var btnEl = btn.child(this.buttonSelector);
        btnEl.on('focus', this.onFocus, this);
        btnEl.on('blur', this.onBlur, this);

        this.initButtonEl(btn, btnEl);

        if(this.menu){
            this.el.child(this.menuClassTarget).addClass("x-btn-with-menu");
        }
        Ext.ButtonToggleMgr.register(this);
    },

    // private
    initButtonEl : function(btn, btnEl){

        this.el = btn;
        btn.addClass("x-btn");

        if(this.icon){
            btnEl.setStyle('background-image', 'url(' +this.icon +')');
        }
        if(this.iconCls){
            btnEl.addClass(this.iconCls);
            if(!this.cls){
                btn.addClass(this.text ? 'x-btn-text-icon' : 'x-btn-icon');
            }
        }
        if(this.tabIndex !== undefined){
            btnEl.dom.tabIndex = this.tabIndex;
        }
        if(this.tooltip){
            if(typeof this.tooltip == 'object'){
                Ext.QuickTips.register(Ext.apply({
                      target: btnEl.id
                }, this.tooltip));
            } else {
                btnEl.dom[this.tooltipType] = this.tooltip;
            }
        }

        if(this.pressed){
            this.el.addClass("x-btn-pressed");
        }

        if(this.handleMouseEvents){
            btn.on("mouseover", this.onMouseOver, this);
            // new functionality for monitoring on the document level
            //btn.on("mouseout", this.onMouseOut, this);
            btn.on("mousedown", this.onMouseDown, this);
        }

        if(this.menu){
            this.menu.on("show", this.onMenuShow, this);
            this.menu.on("hide", this.onMenuHide, this);
        }

        if(this.id){
            this.el.dom.id = this.el.id = this.id;
        }

        if(this.repeat){
            var repeater = new Ext.util.ClickRepeater(btn,
                typeof this.repeat == "object" ? this.repeat : {}
            );
            repeater.on("click", this.onClick,  this);
        }

        btn.on(this.clickEvent, this.onClick, this);
    },

    // private
    afterRender : function(){
        Ext.Button.superclass.afterRender.call(this);
        if(Ext.isIE6){
            this.autoWidth.defer(1, this);
        }else{
            this.autoWidth();
        }
    },

    /**
     * 替换按钮针对背景图片的css类 连动替换按钮参数对象中的该属性  
     * @param {String} cls 图标的CSS样式类
     */
    setIconClass : function(cls){
        if(this.el){
            this.el.child(this.buttonSelector).replaceClass(this.iconCls, cls);
        }
        this.iconCls = cls;
    },
    
    // private
    beforeDestroy: function(){
    	if(this.rendered){
	        var btn = this.el.child(this.buttonSelector);
	        if(btn){
	            btn.removeAllListeners();
	        }
	    }
        if(this.menu){
            Ext.destroy(this.menu);
        }
    },

    // private
    onDestroy : function(){
        if(this.rendered){
            Ext.ButtonToggleMgr.unregister(this);
        }
    },

    // private
    autoWidth : function(){
        if(this.el){
            this.el.setWidth("auto");
            if(Ext.isIE7 && Ext.isStrict){
                var ib = this.el.child(this.buttonSelector);
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
     * 增加按钮事件句柄触发函数的方法
     * @param {Function} handler 当按钮按下执行的函数
     * @param {Object} scope (optional) 传入参数的作用域
     */
    setHandler : function(handler, scope){
        this.handler = handler;
        this.scope = scope;  
    },
    
    /**
     * 设置按钮文本
     * @param {String} text 按钮的文字
     */
    setText : function(text){
        this.text = text;
        if(this.el){
            this.el.child("td.x-btn-center " + this.buttonSelector).update(text);
        }
        this.autoWidth();
    },
    
    /**
     * 获取按钮的文字
     * @return {String} 按钮的文字
     */
    getText : function(){
        return this.text;  
    },
    
    /**
     * 如果有传入state的参数，就按照state的参数设置否则当前的state就会轮换。
     * @param {Boolean} state （可选的）指定特定的状态
     */
    toggle : function(state){
        state = state === undefined ? !this.pressed : state;
        if(state != this.pressed){
            if(state){
                this.el.addClass("x-btn-pressed");
                this.pressed = true;
                this.fireEvent("toggle", this, true);
            }else{
                this.el.removeClass("x-btn-pressed");
                this.pressed = false;
                this.fireEvent("toggle", this, false);
            }
            if(this.toggleHandler){
                this.toggleHandler.call(this.scope || this, this, state);
            }
        }
    },
    
    /**
     * 使按钮获取焦点
     */
    focus : function(){
        this.el.child(this.buttonSelector).focus();
    },
    
    // private
    onDisable : function(){
        if(this.el){
            if(!Ext.isIE6){
                this.el.addClass("x-item-disabled");
            }
            this.el.dom.disabled = true;
        }
        this.disabled = true;
    },

    // private
    onEnable : function(){
        if(this.el){
            if(!Ext.isIE6){
                this.el.removeClass("x-item-disabled");
            }
            this.el.dom.disabled = false;
        }
        this.disabled = false;
    },

    /**
     * 显示按钮附带的菜单（如果有的话）
     */
    showMenu : function(){
        if(this.menu){
            this.menu.show(this.el, this.menuAlign);
        }
        return this;
    },

    /**
     * 隐藏按钮附带的菜单（如果有的话）
     */
    hideMenu : function(){
        if(this.menu){
            this.menu.hide();
        }
        return this;
    },

    /**
     * 若按钮附有菜单并且是显示着的就返回true
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
                Ext.getDoc().on('mouseover', this.monitorMouseOver, this);
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
            Ext.getDoc().un('mouseover', this.monitorMouseOver, this);
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
});
Ext.reg('button', Ext.Button);

// Private utility class used by Button
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
       }
   };
}();