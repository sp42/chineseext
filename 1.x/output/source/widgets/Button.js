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
 * @class Ext.Button
 * @extends Ext.util.Observable
 * 简单的按钮类
 * @cfg {String} text 按钮的文本
 * @cfg {String} icon 要显示要按钮上的图片的路径 (要显示的图片将会被设置成背景图片
 * 这是按钮默认的CSS属性, 所以你若想得到一个图标与文字混合的按钮, 设置cls:"x-btn-text-icon")
 * @cfg {Function} handler 当按钮被单击时调用一个函数(可以代替单击事件)
 * @cfg {Object} scope handler的作用范围
 * @cfg {Number} minWidth 按钮最小的宽度 (用于给一系列的按钮一个共同的宽度)
 * @cfg {String/Object} tooltip 按钮的提示小标签 - 可以是一个字符串或者QuickTips配置对象
 * @cfg {Boolean} hidden 设置为True,一开始便隐藏 (默认为false)
 * @cfg {Boolean} disabled 设置为True,按钮一开始就不可用 (默认为false)
 * @cfg {Boolean} pressed 设置为True,按钮一开始就被按下 (只有enableToggle = true 时才有效)
 * @cfg {String} toggleGroup toggle按扭的按钮组名称(一个组中，只会有一个按钮被按下, 并且只有
 * enableToggle = true 时才起作用)
 * @cfg {Boolean/Object} repeat 设置为true，当按钮被按下时会反复激发单击事件。它也可以是一个
  {@link Ext.util.ClickRepeater} 配置对象(默认为false).
 * @constructor
 * 创建一个新的按钮
 * @param {String/HTMLElement/Element} renderTo 需要添加按钮的elemnet对象
 * @param {Object} config 配置对象
 */
Ext.Button = function(renderTo, config){
    Ext.apply(this, config);
    this.addEvents({
        /**
	     * @event click
	     * 当按钮被单击的时候执行
	     * @param {Button} this
	     * @param {EventObject} e 单击事件
	     */
	    "click" : true,
        /**
	     * @event toggle
	     * 当按钮的"pressed"状态发生改变时执行(只有当enableToggle = true)
	     * @param {Button} this
	     * @param {Boolean} pressed
	     */
	    "toggle" : true,
        /**
	     * @event mouseover
	     * 当鼠标在按钮上方的时候执行
	     * @param {Button} this
	     * @param {Event} e 事件对象
	     */
        'mouseover' : true,
        /**
	     * @event mouseout
	     * 当鼠标离开按钮的时候执行
	     * @param {Button} this
	     * @param {Event} e The event object
	     */
        'mouseout': true
    });
    if(this.menu){
        this.menu = Ext.menu.MenuMgr.get(this.menu);
    }
    if(renderTo){
        this.render(renderTo);
    }
    Ext.Button.superclass.constructor.call(this);
};

Ext.extend(Ext.Button, Ext.util.Observable, {
    /**
     * 只读. 如果按钮隐藏则为true
     * @type Boolean
     */
    hidden : false,
    /**
     * 只读. 如果按钮不可用则为true
     * @type Boolean
     */
    disabled : false,
    /**
     * 只读. 当按钮被按下时为true(只有enableToggle = true时可用)
     * @type Boolean
     */
    pressed : false,

    /**
     * @cfg {Number} tabIndex 
     * DOM模型中按钮的tabIndex(默认为 undefined)
     */
    tabIndex : undefined,

    /**
     * @cfg {Boolean} enableToggle
     * 设置为true则按钮允许pressed/不pressed时为toggling(默认为false)
     */
    enableToggle: false,
    /**
     * @cfg {Mixed} menu
     * 由一个菜单对象、id或config组成的标准的菜单属性(默认为undefined).
     */
    menu : undefined,
    /**
     * @cfg {String} menuAlign
     * The position to align the menu to (see {@link Ext.Element#alignTo} for more details, defaults to 'tl-bl?').
     */
    menuAlign : "tl-bl?",

    /**
     * @cfg {String} iconCls
     * 一个可以设置这个按钮的icon背景图片的css类(默认为undefined).
     */
    iconCls : undefined,
    /**
     * @cfg {String} type
     * 按钮的类型，符合DOM的input元素不的type属性规范。可以是任何一个"submit," "reset" or "button" (默认).
     */
    type : 'button',

    // private
    menuClassTarget: 'tr',
	
    /**
     * @cfg {String} clickEvent
     * The type of event to map to the button's event handler (默认为 'click')
     */
    clickEvent : 'click',

    /**
     * @cfg {Boolean} handleMouseEvents
     * False to disable visual cues on mouseover, mouseout and mousedown (defaults to true)
     */
    handleMouseEvents : true,

    /**
     * @cfg {String} tooltipType
     * tooltip的类型。 可以是任何一个 "qtip" (默认) 快速提示 or "title" for title attribute.
     */
    tooltipType : 'qtip',

    /**
     * @cfg {String} cls
     * A CSS class to apply to the button's main element.
     */
    
    /**
     * @cfg {Ext.Template} template (Optional)
     * An {@link Ext.Template} with which to create the Button's main element. This Template must
     * contain numeric substitution parameter 0 if it is to display the text property. Changing the template could
     * require code modifications if required elements (e.g. a button) aren't present.
     */

    // private
    render : function(renderTo){
        var btn;
        if(this.hideParent){
            this.parentEl = Ext.get(renderTo);
        }
        if(!this.dhconfig){
            if(!this.template){
                if(!Ext.Button.buttonTemplate){
                    // hideous table template ->丑恶的表格模板
                    Ext.Button.buttonTemplate = new Ext.Template(
                        '<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>',
                        '<td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><em unselectable="on"><button class="x-btn-text" type="{1}">{0}</button></em></td><td class="x-btn-right"><i>&#160;</i></td>',
                        "</tr></tbody></table>");
                }
                this.template = Ext.Button.buttonTemplate;
            }
            btn = this.template.append(renderTo, [this.text || '&#160;', this.type], true);
            var btnEl = btn.child("button:first");
            btnEl.on('focus', this.onFocus, this);
            btnEl.on('blur', this.onBlur, this);
            if(this.cls){
                btn.addClass(this.cls);
            }
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
                    Ext.QuickTips.tips(Ext.apply({
                          target: btnEl.id
                    }, this.tooltip));
                } else {
                    btnEl.dom[this.tooltipType] = this.tooltip;
                }
            }
        }else{
            btn = Ext.DomHelper.append(Ext.get(renderTo).dom, this.dhconfig, true);
        }
        this.el = btn;
        if(this.id){
            this.el.dom.id = this.el.id = this.id;
        }
        if(this.menu){
            this.el.child(this.menuClassTarget).addClass("x-btn-with-menu");
            this.menu.on("show", this.onMenuShow, this);
            this.menu.on("hide", this.onMenuHide, this);
        }
        btn.addClass("x-btn");
        if(Ext.isIE && !Ext.isIE7){
            this.autoWidth.defer(1, this);
        }else{
            this.autoWidth();
        }
        if(this.handleMouseEvents){
            btn.on("mouseover", this.onMouseOver, this);
            btn.on("mouseout", this.onMouseOut, this);
            btn.on("mousedown", this.onMouseDown, this);
        }
        btn.on(this.clickEvent, this.onClick, this);
        //btn.on("mouseup", this.onMouseUp, this);
        if(this.hidden){
            this.hide();
        }
        if(this.disabled){
            this.disable();
        }
        Ext.ButtonToggleMgr.register(this);
        if(this.pressed){
            this.el.addClass("x-btn-pressed");
        }
        if(this.repeat){
            var repeater = new Ext.util.ClickRepeater(btn,
                typeof this.repeat == "object" ? this.repeat : {}
            );
            repeater.on("click", this.onClick,  this);
        }
    },
    /**
     * 返回按钮下面的元素
     * @return {Ext.Element} The element
     */
    getEl : function(){
        return this.el;  
    },
    
    /**
     * 销毁按钮对象并且移除所有的监听器.
     */
    destroy : function(){
        Ext.ButtonToggleMgr.unregister(this);
        this.el.removeAllListeners();
        this.purgeListeners();
        this.el.remove();
    },

    // private
    autoWidth : function(){
        if(this.el){
            this.el.setWidth("auto");
            if(Ext.isIE7 && Ext.isStrict){
                var ib = this.el.child('button');
                if(ib && ib.getWidth() > 20){
                    ib.clip();
                    ib.setWidth(Ext.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
                }
            }
            if(this.minWidth){
                if(this.hidden){
                    this.el.beginMeasure();
                }
                if(this.el.getWidth() < this.minWidth){
                    this.el.setWidth(this.minWidth);
                }
                if(this.hidden){
                    this.el.endMeasure();
                }
            }
        }
    },

    /**
     * 分配这个按钮的点击处理程序
     * @param {Function} handler 当按钮被点击时就调用此函数
     * @param {Object} scope (optional) Scope for the function passed in
     */
    setHandler : function(handler, scope){
        this.handler = handler;
        this.scope = scope;  
    },
    
    /**
     * 设置这个按钮的Text
     * @param {String} text 按钮的Text
     */
    setText : function(text){
        this.text = text;
        if(this.el){
            this.el.child("td.x-btn-center button.x-btn-text").update(text);
        }
        this.autoWidth();
    },
    
    /**
     * 取得按钮的Text
     * @return {String} 按钮的text
     */
    getText : function(){
        return this.text;  
    },
    
    /**
     * 显示这个按钮
     */
    show: function(){
        this.hidden = false;
        if(this.el){
            this[this.hideParent? 'parentEl' : 'el'].setStyle("display", "");
        }
    },
    
    /**
     * 隐藏这个按钮
     */
    hide: function(){
        this.hidden = true;
        if(this.el){
            this[this.hideParent? 'parentEl' : 'el'].setStyle("display", "none");
        }
    },
    
    /**
     * 为隐藏或显示提供方便的函数
     * @param {Boolean} visible设置为 True 显示, false 则隐藏
     */
    setVisible: function(visible){
        if(visible) {
            this.show();
        }else{
            this.hide();
        }
    },
    
    /**
     * 如果它的状态为passed，它将变为passed状态，否则当前的装态为toggled。
     * @param {Boolean} state (可选的) 强制一个独特的状态
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
     * 使按钮得到焦点
     */
    focus : function(){
        this.el.child('button:first').focus();
    },
    
    /**
     * 使按钮不可用
     */
    disable : function(){
        if(this.el){
            this.el.addClass("x-btn-disabled");
        }
        this.disabled = true;
    },
    
    /**
     * 使按钮可用
     */
    enable : function(){
        if(this.el){
            this.el.removeClass("x-btn-disabled");
        }
        this.disabled = false;
    },

    /**
     * 为设置按钮可用/不可用提供方便设置的函数
     * @param {Boolean} enabled True 为可用, false 为不可用
     */
    setDisabled : function(v){
        this[v !== true ? "enable" : "disable"]();
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
            if(this.enableToggle){
                this.toggle();
            }
            if(this.menu && !this.menu.isVisible()){
                this.menu.show(this.el, this.menuAlign);
            }
            this.fireEvent("click", this, e);
            if(this.handler){
                this.el.removeClass("x-btn-over");
                this.handler.call(this.scope || this, this, e);
            }
        }
    },
    // private
    onMouseOver : function(e){
        if(!this.disabled){
            this.el.addClass("x-btn-over");
            this.fireEvent('mouseover', this, e);
        }
    },
    // private
    onMouseOut : function(e){
        if(!e.within(this.el,  true)){
            this.el.removeClass("x-btn-over");
            this.fireEvent('mouseout', this, e);
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
    onMouseDown : function(e){
        if(!this.disabled && e.button == 0){
            this.el.addClass("x-btn-click");
            Ext.get(document).on('mouseup', this.onMouseUp, this);
        }
    },
    // private
    onMouseUp : function(e){
        if(e.button == 0){
            this.el.removeClass("x-btn-click");
            Ext.get(document).un('mouseup', this.onMouseUp, this);
        }
    },
    // private
    onMenuShow : function(e){
        this.el.addClass("x-btn-menu-active");
    },
    // private
    onMenuHide : function(e){
        this.el.removeClass("x-btn-menu-active");
    }   
});

// 用于按钮的私有类
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