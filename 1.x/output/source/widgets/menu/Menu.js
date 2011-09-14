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
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.menu.Menu
 * @extends Ext.util.Observable
 * һ���˵�����������������ӵĲ˵����������Menu ��Ҳ���Ե��������������������ɵĲ˵��Ļ��ࣨ���磺{@link Ext.menu.DateMenu}����
 * @constructor
 * ����һ�� Menu ����
 * @param {Object} config ����ѡ�����
 */
Ext.menu.Menu = function(config){
    Ext.apply(this, config);
    this.id = this.id || Ext.id();
    this.addEvents({
        /**
         * @event beforeshow
         * �ڸò˵���ʾ֮ǰ����
         * @param {Ext.menu.Menu} this
         */
        beforeshow : true,
        /**
         * @event beforehide
         * �ڸò˵�����֮ǰ����
         * @param {Ext.menu.Menu} this
         */
        beforehide : true,
        /**
         * @event show
         * �ڸò˵���ʾ֮�󴥷�
         * @param {Ext.menu.Menu} this
         */
        show : true,
        /**
         * @event hide
         * �ڸò˵�����֮�󴥷�
         * @param {Ext.menu.Menu} this
         */
        hide : true,
        /**
         * @event click
         * ������ò˵�ʱ���������ߵ��ò˵����ڻ״̬�һس���������ʱ������
         * @param {Ext.menu.Menu} this
         * @param {Ext.menu.Item} menuItem ������� Item ����
         * @param {Ext.EventObject} e
         */
        click : true,
        /**
         * @event mouseover
         * ����꾭���ò˵�ʱ����
         * @param {Ext.menu.Menu} this
         * @param {Ext.EventObject} e
         * @param {Ext.menu.Item} menuItem ������� Item ����
         */
        mouseover : true,
        /**
         * @event mouseout
         * ������뿪�ò˵�ʱ����
         * @param {Ext.menu.Menu} this
         * @param {Ext.EventObject} e
         * @param {Ext.menu.Item} menuItem ������� Item ����
         */
        mouseout : true,
        /**
         * @event itemclick
         * ���ò˵��������Ĳ˵�����ʱ����
         * @param {Ext.menu.BaseItem} baseItem ������� BaseItem ����
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
     * @cfg {Number} minWidth ������Ϊ��λ���õĲ˵���С���ֵ��Ĭ��Ϊ 120��
     */
    minWidth : 120,
    /**
     * @cfg {Boolean/String} shadow ��ֵΪ True ���� "sides" ʱΪĬ��Ч����"frame" ʱΪ4��������Ӱ��"drop" ʱΪ���½�����Ӱ��Ĭ��Ϊ "sides"��
     */
    shadow : "sides",
    /**
     * @cfg {String} subMenuAlign �ò˵����Ӳ˵��� {@link Ext.Element#alignTo} ��λê���ֵ��Ĭ��Ϊ "tl-tr?"��
     */
    subMenuAlign : "tl-tr?",
    /**
     * @cfg {String} defaultAlign �ò˵����������ԭʼԪ�ص� {@link Ext.Element#alignTo) ��λê���Ĭ��ֵ��Ĭ��Ϊ "tl-bl?"��
     */
    defaultAlign : "tl-bl?",
    /**
     * @cfg {Boolean} allowOtherMenus ֵΪ True ʱ����ͬʱ��ʾ����˵���Ĭ��Ϊ false��
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
     * ֻ���������ǰ��ʾ���Ǹò˵��򷵻� true�����򷵻� false��
     * @type Boolean
     */
    isVisible : function(){
        return this.el && !this.hidden;
    },

    /**
     * ���������Ԫ����ʾ�ò˵�
     * @param {String/HTMLElement/Ext.Element} element Ҫ���뵽��Ԫ��
     * @param {String} position ����ѡ�� ����Ԫ��ʱʹ�õ�{@link Ext.Element#alignTo} ��λê�㣨Ĭ��Ϊ this.defaultAlign��
     * @param {Ext.menu.Menu} parentMenu ����ѡ�� �ò˵��ĸ����˵�������еĻ���Ĭ��Ϊ undefined��
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
     * ��ָ����λ����ʾ�ò˵�
     * @param {Array} xyPosition ��ʾ�˵�ʱ���õİ��� X �� Y [x, y] ������ֵ�������ǻ���ҳ��ģ�
     * @param {Ext.menu.Menu} parentMenu ����ѡ�� �ò˵��ĸ����˵�������еĻ���Ĭ��Ϊ undefined��
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
     * ���ظò˵���������ĸ����˵�
     * @param {Boolean} deep ����ѡ�� ֵΪ True ʱ��ݹ��������и����˵�������еĻ���Ĭ��Ϊ false��
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
     * ���һ������ Menu ��֧�ֵĲ˵�����߿��Ա�ת��Ϊ�˵���Ķ���
     * ����������һ�������ɣ�
     * <ul>
     * <li>�κλ��� {@link Ext.menu.Item} �Ĳ˵������</li>
     * <li>���Ա�ת��Ϊ�˵���� HTML Ԫ�ض���</li>
     * <li>���Ա�����Ϊһ���˵������Ĳ˵�������ѡ�����</li>
     * <li>�����ַ�������ֵΪ '-' �� 'separator' ʱ���ڲ˵������һ���ָ���������������»ᱻת����Ϊһ�� {@link Ext.menu.TextItem} ���󲢱���ӵ��˵���</li>
     * </ul>
     * �÷���
     * <pre><code>
// ����һ���˵�
var menu = new Ext.menu.Menu();

// ͨ�����췽������һ���˵���
var menuItem = new Ext.menu.Item({ text: 'New Item!' });

// ͨ����ͬ�ķ���һ�����һ��˵��
// �����ӵĲ˵���Żᱻ���ء�
var item = menu.add(
    menuItem,                // ���һ���Ѿ�������Ĳ˵���
    'Dynamic Item',          // ���һ�� TextItem ����
    '-',                     // ���һ���ָ���
    { text: 'Config Item' }  // ������ѡ��������ɵĲ˵���
);
</code></pre>
     * @param {Mixed} args һ�������˵���˵�������ѡ����������Ա�ת��Ϊ�˵���Ķ���
     * @return {Ext.menu.Item} ����ӵĲ˵�����߶������ӵĲ˵����е����һ��
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
     * ���ظò˵������ڵ� {@link Ext.Element} ����
     * @return {Ext.Element} Ԫ�ض���
     */
    getEl : function(){
        if(!this.el){
            this.render();
        }
        return this.el;
    },

    /**
     * ���һ���ָ������˵�
     * @return {Ext.menu.Item} ����ӵĲ˵���
     */
    addSeparator : function(){
        return this.addItem(new Ext.menu.Separator());
    },

    /**
     * ���һ�� {@link Ext.Element} ���󵽲˵�
     * @param {String/HTMLElement/Ext.Element} el ����ӵ�Ԫ�ػ��� DOM �ڵ㣬��������ID
     * @return {Ext.menu.Item} ����ӵĲ˵���
     */
    addElement : function(el){
        return this.addItem(new Ext.menu.BaseItem(el));
    },

    /**
     * ���һ���Ѿ����ڵĻ��� {@link Ext.menu.Item} �Ķ��󵽲˵�
     * @param {Ext.menu.Item} item ����ӵĲ˵���
     * @return {Ext.menu.Item} ����ӵĲ˵���
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
     * ���ݸ���������ѡ���һ�� {@link Ext.menu.Item} ������ӵ��˵�
     * @param {Object} config �˵�����ѡ�����
     * @return {Ext.menu.Item} ����ӵĲ˵���
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
     * ���ݸ������ı�����һ�� {@link Ext.menu.TextItem} ������ӵ��˵�
     * @param {String} text �˵�������ʾ���ı�
     * @return {Ext.menu.Item} ����ӵĲ˵���
     */
    addText : function(text){
        return this.addItem(new Ext.menu.TextItem(text));
    },

    /**
     * ��ָ����λ�ò���һ���Ѿ����ڵĻ��� {@link Ext.menu.Item} �Ķ��󵽲˵�
     * @param {Number} index Ҫ����Ķ����ڲ˵��в˵����б��λ�õ�����ֵ
     * @param {Ext.menu.Item} item Ҫ��ӵĲ˵���
     * @return {Ext.menu.Item} ����ӵĲ˵���
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
     * �Ӳ˵���ɾ��������һ�� {@link Ext.menu.Item} ����
     * @param {Ext.menu.Item} item Ҫɾ���Ĳ˵���
     */
    remove : function(item){
        this.items.removeKey(item.id);
        item.destroy();
    },

    /**
     * �Ӳ˵���ɾ�����������в˵���
     */
    removeAll : function(){
        var f;
        while(f = this.items.first()){
            this.remove(f);
        }
    }
});

// MenuNav ��һ���� Menu ʹ�õ��ڲ�˽����
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