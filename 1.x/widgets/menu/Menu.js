/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.menu.Menu
 * @extends Ext.util.Observable
 * 一个菜单对象。它是所有你添加的菜单项的容器。Menu 类也可以当作是你根据其他组件生成的菜单的基类（例如：{@link Ext.menu.DateMenu}）。
 * @constructor
 * 创建一个 Menu 对象
 * @param {Object} config 配置选项对象
 */
Ext.menu.Menu = function(config){
    Ext.apply(this, config);
    this.id = this.id || Ext.id();
    this.addEvents({
        /**
         * @event beforeshow
         * 在该菜单显示之前触发
         * @param {Ext.menu.Menu} this
         */
        beforeshow : true,
        /**
         * @event beforehide
         * 在该菜单隐藏之前触发
         * @param {Ext.menu.Menu} this
         */
        beforehide : true,
        /**
         * @event show
         * 在该菜单显示之后触发
         * @param {Ext.menu.Menu} this
         */
        show : true,
        /**
         * @event hide
         * 在该菜单隐藏之后触发
         * @param {Ext.menu.Menu} this
         */
        hide : true,
        /**
         * @event click
         * 当点击该菜单时触发（或者当该菜单处于活动状态且回车键被按下时触发）
         * @param {Ext.menu.Menu} this
         * @param {Ext.menu.Item} menuItem 被点击的 Item 对象
         * @param {Ext.EventObject} e
         */
        click : true,
        /**
         * @event mouseover
         * 当鼠标经过该菜单时触发
         * @param {Ext.menu.Menu} this
         * @param {Ext.EventObject} e
         * @param {Ext.menu.Item} menuItem 被点击的 Item 对象
         */
        mouseover : true,
        /**
         * @event mouseout
         * 当鼠标离开该菜单时触发
         * @param {Ext.menu.Menu} this
         * @param {Ext.EventObject} e
         * @param {Ext.menu.Item} menuItem 被点击的 Item 对象
         */
        mouseout : true,
        /**
         * @event itemclick
         * 当该菜单所包含的菜单项被点击时触发
         * @param {Ext.menu.BaseItem} baseItem 被点击的 BaseItem 对象
         * @param {Ext.EventObject} e
         */
        itemclick: true
    });
    Ext.menu.MenuMgr.register(this);
    var mis = this.items;
    this.items = new Ext.util.MixedCollection();
    if(mis){
        this.add.apply(this, mis);
    }
};

Ext.extend(Ext.menu.Menu, Ext.util.Observable, {
    /**
     * @cfg {Number} minWidth 以象素为单位设置的菜单最小宽度值（默认为 120）
     */
    minWidth : 120,
    /**
     * @cfg {Boolean/String} shadow 当值为 True 或者 "sides" 时为默认效果，"frame" 时为4方向有阴影，"drop" 时为右下角有阴影（默认为 "sides"）
     */
    shadow : "sides",
    /**
     * @cfg {String} subMenuAlign 该菜单中子菜单的 {@link Ext.Element#alignTo} 定位锚点的值（默认为 "tl-tr?"）
     */
    subMenuAlign : "tl-tr?",
    /**
     * @cfg {String} defaultAlign 该菜单相对于它的原始元素的 {@link Ext.Element#alignTo) 定位锚点的默认值（默认为 "tl-bl?"）
     */
    defaultAlign : "tl-bl?",
    /**
     * @cfg {Boolean} allowOtherMenus 值为 True 时允许同时显示多个菜单（默认为 false）
     */
    allowOtherMenus : false,

    hidden:true,

    // private
    render : function(){
        if(this.el){
            return;
        }
        var el = this.el = new Ext.Layer({
            cls: "x-menu",
            shadow:this.shadow,
            constrain: false,
            parentEl: this.parentEl || document.body,
            zindex:15000
        });

        this.keyNav = new Ext.menu.MenuNav(this);

        if(this.plain){
            el.addClass("x-menu-plain");
        }
        if(this.cls){
            el.addClass(this.cls);
        }
        // generic focus element
        this.focusEl = el.createChild({
            tag: "a", cls: "x-menu-focus", href: "#", onclick: "return false;", tabIndex:"-1"
        });
        var ul = el.createChild({tag: "ul", cls: "x-menu-list"});
        ul.on("click", this.onClick, this);
        ul.on("mouseover", this.onMouseOver, this);
        ul.on("mouseout", this.onMouseOut, this);
        this.items.each(function(item){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            ul.dom.appendChild(li);
            item.render(li, this);
        }, this);
        this.ul = ul;
        this.autoWidth();
    },

    // private
    autoWidth : function(){
        var el = this.el, ul = this.ul;
        if(!el){
            return;
        }
        var w = this.width;
        if(w){
            el.setWidth(w);
        }else if(Ext.isIE){
            el.setWidth(this.minWidth);
            var t = el.dom.offsetWidth; // force recalc
            el.setWidth(ul.getWidth()+el.getFrameWidth("lr"));
        }
    },

    // private
    delayAutoWidth : function(){
        if(this.rendered){
            if(!this.awTask){
                this.awTask = new Ext.util.DelayedTask(this.autoWidth, this);
            }
            this.awTask.delay(20);
        }
    },

    // private
    findTargetItem : function(e){
        var t = e.getTarget(".x-menu-list-item", this.ul,  true);
        if(t && t.menuItemId){
            return this.items.get(t.menuItemId);
        }
    },

    // private
    onClick : function(e){
        var t;
        if(t = this.findTargetItem(e)){
            t.onClick(e);
            this.fireEvent("click", this, t, e);
        }
    },

    // private
    setActiveItem : function(item, autoExpand){
        if(item != this.activeItem){
            if(this.activeItem){
                this.activeItem.deactivate();
            }
            this.activeItem = item;
            item.activate(autoExpand);
        }else if(autoExpand){
            item.expandMenu();
        }
    },

    // private
    tryActivate : function(start, step){
        var items = this.items;
        for(var i = start, len = items.length; i >= 0 && i < len; i+= step){
            var item = items.get(i);
            if(!item.disabled && item.canActivate){
                this.setActiveItem(item, false);
                return item;
            }
        }
        return false;
    },

    // private
    onMouseOver : function(e){
        var t;
        if(t = this.findTargetItem(e)){
            if(t.canActivate && !t.disabled){
                this.setActiveItem(t, true);
            }
        }
        this.fireEvent("mouseover", this, e, t);
    },

    // private
    onMouseOut : function(e){
        var t;
        if(t = this.findTargetItem(e)){
            if(t == this.activeItem && t.shouldDeactivate(e)){
                this.activeItem.deactivate();
                delete this.activeItem;
            }
        }
        this.fireEvent("mouseout", this, e, t);
    },

    /**
     * 只读。如果当前显示的是该菜单则返回 true，否则返回 false。
     * @type Boolean
     */
    isVisible : function(){
        return this.el && !this.hidden;
    },

    /**
     * 相对于其他元素显示该菜单
     * @param {String/HTMLElement/Ext.Element} element 要对齐到的元素
     * @param {String} position （可选） 对齐元素时使用的{@link Ext.Element#alignTo} 定位锚点（默认为 this.defaultAlign）
     * @param {Ext.menu.Menu} parentMenu （可选） 该菜单的父级菜单，如果有的话（默认为 undefined）
     */
    show : function(el, pos, parentMenu){
        this.parentMenu = parentMenu;
        if(!this.el){
            this.render();
        }
        this.fireEvent("beforeshow", this);
        this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign), parentMenu, false);
    },

    /**
     * 在指定的位置显示该菜单
     * @param {Array} xyPosition 显示菜单时所用的包含 X 和 Y [x, y] 的坐标值（坐标是基于页面的）
     * @param {Ext.menu.Menu} parentMenu （可选） 该菜单的父级菜单，如果有的话（默认为 undefined）
     */
    showAt : function(xy, parentMenu, /* private: */_e){
        this.parentMenu = parentMenu;
        if(!this.el){
            this.render();
        }
        if(_e !== false){
            this.fireEvent("beforeshow", this);
            xy = this.el.adjustForConstraints(xy);
        }
        this.el.setXY(xy);
        this.el.show();
        this.hidden = false;
        this.focus();
        this.fireEvent("show", this);
    },

    focus : function(){
        if(!this.hidden){
            this.doFocus.defer(50, this);
        }
    },

    doFocus : function(){
        if(!this.hidden){
            this.focusEl.focus();
        }
    },

    /**
     * 隐藏该菜单及相关连的父级菜单
     * @param {Boolean} deep （可选） 值为 True 时则递归隐藏所有父级菜单，如果有的话（默认为 false）
     */
    hide : function(deep){
        if(this.el && this.isVisible()){
            this.fireEvent("beforehide", this);
            if(this.activeItem){
                this.activeItem.deactivate();
                this.activeItem = null;
            }
            this.el.hide();
            this.hidden = true;
            this.fireEvent("hide", this);
        }
        if(deep === true && this.parentMenu){
            this.parentMenu.hide(true);
        }
    },

    /**
     * 添加一个或多个 Menu 类支持的菜单项，或者可以被转换为菜单项的对象。
     * 满足下列任一条件即可：
     * <ul>
     * <li>任何基于 {@link Ext.menu.Item} 的菜单项对象</li>
     * <li>可以被转换为菜单项的 HTML 元素对象</li>
     * <li>可以被创建为一个菜单项对象的菜单项配置选项对象</li>
     * <li>任意字符串对象，值为 '-' 或 'separator' 时会在菜单中添加一个分隔栏，其他的情况下会被转换成为一个 {@link Ext.menu.TextItem} 对象并被添加到菜单中</li>
     * </ul>
     * 用法：
     * <pre><code>
// 创建一个菜单
var menu = new Ext.menu.Menu();

// 通过构造方法创建一个菜单项
var menuItem = new Ext.menu.Item({ text: 'New Item!' });

// 通过不同的方法一次添加一组菜单项。
// 最后被添加的菜单项才会被返回。
var item = menu.add(
    menuItem,                // 添加一个已经定义过的菜单项
    'Dynamic Item',          // 添加一个 TextItem 对象
    '-',                     // 添加一个分隔栏
    { text: 'Config Item' }  // 由配置选项对象生成的菜单项
);
</code></pre>
     * @param {Mixed} args 一个或多个菜单项，菜单项配置选项或其他可以被转换为菜单项的对象
     * @return {Ext.menu.Item} 被添加的菜单项，或者多个被添加的菜单项中的最后一个
     */
    add : function(){
        var a = arguments, l = a.length, item;
        for(var i = 0; i < l; i++){
            var el = a[i];
            if(el.render){ // some kind of Item
                item = this.addItem(el);
            }else if(typeof el == "string"){ // string
                if(el == "separator" || el == "-"){
                    item = this.addSeparator();
                }else{
                    item = this.addText(el);
                }
            }else if(el.tagName || el.el){ // element
                item = this.addElement(el);
            }else if(typeof el == "object"){ // must be menu item config?
                item = this.addMenuItem(el);
            }
        }
        return item;
    },

    /**
     * 返回该菜单所基于的 {@link Ext.Element} 对象
     * @return {Ext.Element} 元素对象
     */
    getEl : function(){
        if(!this.el){
            this.render();
        }
        return this.el;
    },

    /**
     * 添加一个分隔栏到菜单
     * @return {Ext.menu.Item} 被添加的菜单项
     */
    addSeparator : function(){
        return this.addItem(new Ext.menu.Separator());
    },

    /**
     * 添加一个 {@link Ext.Element} 对象到菜单
     * @param {String/HTMLElement/Ext.Element} el 被添加的元素或者 DOM 节点，或者它的ID
     * @return {Ext.menu.Item} 被添加的菜单项
     */
    addElement : function(el){
        return this.addItem(new Ext.menu.BaseItem(el));
    },

    /**
     * 添加一个已经存在的基于 {@link Ext.menu.Item} 的对象到菜单
     * @param {Ext.menu.Item} item 被添加的菜单项
     * @return {Ext.menu.Item} 被添加的菜单项
     */
    addItem : function(item){
        this.items.add(item);
        if(this.ul){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            this.ul.dom.appendChild(li);
            item.render(li, this);
            this.delayAutoWidth();
        }
        return item;
    },

    /**
     * 根据给出的配置选项创建一个 {@link Ext.menu.Item} 对象并添加到菜单
     * @param {Object} config 菜单配置选项对象
     * @return {Ext.menu.Item} 被添加的菜单项
     */
    addMenuItem : function(config){
        if(!(config instanceof Ext.menu.Item)){
            if(typeof config.checked == "boolean"){ // must be check menu item config?
                config = new Ext.menu.CheckItem(config);
            }else{
                config = new Ext.menu.Item(config);
            }
        }
        return this.addItem(config);
    },

    /**
     * 根据给出的文本创建一个 {@link Ext.menu.TextItem} 对象并添加到菜单
     * @param {String} text 菜单项中显示的文本
     * @return {Ext.menu.Item} 被添加的菜单项
     */
    addText : function(text){
        return this.addItem(new Ext.menu.TextItem(text));
    },

    /**
     * 在指定的位置插入一个已经存在的基于 {@link Ext.menu.Item} 的对象到菜单
     * @param {Number} index 要插入的对象在菜单中菜单项列表的位置的索引值
     * @param {Ext.menu.Item} item 要添加的菜单项
     * @return {Ext.menu.Item} 被添加的菜单项
     */
    insert : function(index, item){
        this.items.insert(index, item);
        if(this.ul){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            this.ul.dom.insertBefore(li, this.ul.dom.childNodes[index]);
            item.render(li, this);
            this.delayAutoWidth();
        }
        return item;
    },

    /**
     * 从菜单中删除并销毁一个 {@link Ext.menu.Item} 对象
     * @param {Ext.menu.Item} item 要删除的菜单项
     */
    remove : function(item){
        this.items.removeKey(item.id);
        item.destroy();
    },

    /**
     * 从菜单中删除并销毁所有菜单项
     */
    removeAll : function(){
        var f;
        while(f = this.items.first()){
            this.remove(f);
        }
    }
});

// MenuNav 是一个由 Menu 使用的内部私有类
Ext.menu.MenuNav = function(menu){
    Ext.menu.MenuNav.superclass.constructor.call(this, menu.el);
    this.scope = this.menu = menu;
};

Ext.extend(Ext.menu.MenuNav, Ext.KeyNav, {
    doRelay : function(e, h){
        var k = e.getKey();
        if(!this.menu.activeItem && e.isNavKeyPress() && k != e.SPACE && k != e.RETURN){
            this.menu.tryActivate(0, 1);
            return false;
        }
        return h.call(this.scope || this, e, this.menu);
    },

    up : function(e, m){
        if(!m.tryActivate(m.items.indexOf(m.activeItem)-1, -1)){
            m.tryActivate(m.items.length-1, -1);
        }
    },

    down : function(e, m){
        if(!m.tryActivate(m.items.indexOf(m.activeItem)+1, 1)){
            m.tryActivate(0, 1);
        }
    },

    right : function(e, m){
        if(m.activeItem){
            m.activeItem.expandMenu(true);
        }
    },

    left : function(e, m){
        m.hide();
        if(m.parentMenu && m.parentMenu.activeItem){
            m.parentMenu.activeItem.activate();
        }
    },

    enter : function(e, m){
        if(m.activeItem){
            e.stopPropagation();
            m.activeItem.onClick(e);
            m.fireEvent("click", this, m.activeItem);
            return true;
        }
    }
});