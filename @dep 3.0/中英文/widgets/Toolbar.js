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
 * @class Ext.layout.ToolbarLayout
 * @extends Ext.layout.ContainerLayout
 */
Ext.layout.ToolbarLayout = Ext.extend(Ext.layout.ContainerLayout, {
    monitorResize: true,
    triggerWidth: 16,
    lastOverflow: false,

    noItemsMenuText: '<div class="x-toolbar-no-items">(None)</div>',
    // private
    onLayout : function(ct, target){
        if(!this.leftTr){
            target.addClass('x-toolbar-layout-ct');
            target.insertHtml('beforeEnd',
                 '<table cellspacing="0" class="x-toolbar-ct"><tbody><tr><td class="x-toolbar-left" align="left"><table cellspacing="0"><tbody><tr class="x-toolbar-left-row"></tr></tbody></table></td><td class="x-toolbar-right" align="right"><table cellspacing="0" class="x-toolbar-right-ct"><tbody><tr><td><table cellspacing="0"><tbody><tr class="x-toolbar-right-row"></tr></tbody></table></td><td><table cellspacing="0"><tbody><tr class="x-toolbar-extras-row"></tr></tbody></table></td></tr></tbody></td></tr></tbody></table>');
            this.leftTr = target.child('tr.x-toolbar-left-row', true);
            this.rightTr = target.child('tr.x-toolbar-right-row', true);
            this.extrasTr = target.child('tr.x-toolbar-extras-row', true);
        }
        var side = this.leftTr;
        var pos = 0;

        var items = ct.items.items;
        for(var i = 0, len = items.length, c; i < len; i++, pos++) {
            c = items[i];
            if(c.isFill){
                side = this.rightTr;
                pos = 0;
            }else if(!c.rendered){
                c.render(this.insertCell(c, side, pos));
            }else{
                if(!c.xtbHidden && !this.isValidParent(c, side.childNodes[pos])){
                    var td = this.insertCell(c, side, pos);
                    td.appendChild(c.getDomPositionEl().dom);
                    c.container = Ext.get(td);
                }
            }
        }
        //strip extra empty cells
        this.cleanup(this.leftTr);
        this.cleanup(this.rightTr);
        this.cleanup(this.extrasTr);
        this.fitToSize(target);
    },

    cleanup : function(row){
        var cn = row.childNodes;
        for(var i = cn.length-1, c; i >= 0 && (c = cn[i]); i--){
            if(!c.firstChild){
                row.removeChild(c);
            }
        }
    },

    insertCell : function(c, side, pos){
        var td = document.createElement('td');
        td.className='x-toolbar-cell';
        side.insertBefore(td, side.childNodes[pos]||null);
        return td;
    },

    hideItem: function(item){
        var h = (this.hiddens = this.hiddens || []);
        h.push(item);
        item.xtbHidden = true;
        item.xtbWidth = item.getDomPositionEl().dom.parentNode.offsetWidth;
        item.hide();
    },

    unhideItem: function(item){
        item.show();
        item.xtbHidden = false;
        this.hiddens.remove(item);
        if(this.hiddens.length < 1){
            delete this.hiddens;
        }
    },

    getItemWidth : function(c){
        return c.hidden ? (c.xtbWidth || 0) : c.getDomPositionEl().dom.parentNode.offsetWidth;
    },

    fitToSize :function(t){
        if(this.container.enableOverflow === false){
            return;
        }
        var w = t.dom.clientWidth;
        var lw = this.lastWidth || 0;
        this.lastWidth = w;
        var iw = t.dom.firstChild.offsetWidth;

        var clipWidth = w - this.triggerWidth;
        var hideIndex = -1;

        if(iw > w || (this.hiddens && w > lw)){
            var i, items = this.container.items.items, len = items.length, c;
            var loopWidth = 0;
            for(i = 0; i < len; i++) {
                c = items[i];
                if(!c.isFill){
                    loopWidth += this.getItemWidth(c);
                    if(loopWidth > clipWidth){
                        if(!c.xtbHidden){
                            this.hideItem(c);
                        }
                    }else{
                        if(c.xtbHidden){
                            this.unhideItem(c);
                        }
                    }
                }
            }
        }
        if(this.hiddens){
            this.initMore();
            if(!this.lastOverflow){
                this.container.fireEvent('overflowchange', this.container, true);
                this.lastOverflow = true;
            }
        }else if(this.more){
            this.clearMenu();
            this.more.destroy();
            delete this.more;
            if(this.lastOverflow){
                this.container.fireEvent('overflowchange', this.container, false);
                this.lastOverflow = false;
            }
        }
    },

    createMenuConfig: function(c, hideOnClick){
        var cfg = {
            text: c.text,
            iconCls: c.iconCls,
            icon: c.icon,
            disabled: c.disabled,
            handler: c.handler,
            scope: c.scope,
            menu: c.menu
        };
        cfg.hideOnClick = hideOnClick;
        delete cfg.xtype;
        delete cfg.id;
        return cfg;
    },

    // private
    addComponentToMenu: function(m, c){
        if(c instanceof Ext.Toolbar.Separator){
            m.add('-');
        }else if(typeof c.isXType == 'function'){
            if(c.isXType('splitbutton')){
                m.add(this.createMenuConfig(c, true));
            }else if(c.isXType('button')){
                m.add(this.createMenuConfig(c, !c.menu));
            }else if(c.isXType('buttongroup')){
                m.add('-');
                c.items.each(function(item){
                     this.addComponentToMenu(m, item);
                }, this);
                m.add('-');
            }
        }
    },
    
    clearMenu: function(){
        var m = this.moreMenu;
        if(m && m.items){
            this.moreMenu.items.each(function(item){
                delete item.menu;
            });
        }
    },

    // private
    beforeMoreShow : function(m){
        this.clearMenu();
        m.removeAll();
        for(var i = 0, h = this.container.items.items, len = h.length, c; i < len; i++){
            c = h[i];
            if(c.xtbHidden){
                this.addComponentToMenu(m, c);
            }
        }
        // put something so the menu isn't empty
        // if no compatible items found
        if(m.items.length < 1){
            m.add(this.noItemsMenuText);
        }
    },

    initMore : function(){
        if(!this.more){
            this.moreMenu = new Ext.menu.Menu({
                listeners: {
                    beforeshow: this.beforeMoreShow,
                    scope: this
                }
            });
            this.more = new Ext.Button({
                iconCls: 'x-toolbar-more-icon',
                cls: 'x-toolbar-more',
                menu: this.moreMenu
            });
            var td = this.insertCell(this.more, this.extrasTr, 100);
            this.more.render(td);
        }
    }
    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS['toolbar'] = Ext.layout.ToolbarLayout;

/**
 * @class Ext.Toolbar
 * @extends Ext.Container
 * 基本工具栏类。工具栏元素可以通过它们的构造函数明确地被创建，或者通过它们的xtype类型来实现。
 * 也有一些简单的字符串代表特定的对象，用于创建各种工具条。
 * Basic Toolbar class. Toolbar elements can be created explicitly via their constructors, or implicitly
 * via their xtypes.  Some items also have shortcut strings for creation.
 * @constructor 创建一个新的工具栏 Creates a new Toolbar
 * @param {Object/Array} config 要添加的一个配置对象或者一个要按钮数组 A config object or an array of buttons to add
 */
 Ext.Toolbar = function(config){
    if(Ext.isArray(config)){
        config = {items: config, layout: 'toolbar'};
    } else {
    	config = Ext.apply({
    		layout: 'toolbar'
    	}, config);
	    if(config.buttons) {
	    	config.items = config.buttons;
	    }
    }
    Ext.Toolbar.superclass.constructor.call(this, config);
};

(function(){

var T = Ext.Toolbar;

Ext.extend(T, Ext.Container, {

    defaultType: 'button',

    trackMenus : true,
    internalDefaults: {removeMode: 'container', hideParent: true},
    toolbarCls: 'x-toolbar',

    initComponent : function(){
        T.superclass.initComponent.call(this);

        this.addEvents('overflowchange');
    },

    // private
    onRender : function(ct, position){
        if(!this.el){
            if(!this.autoCreate){
                this.autoCreate = {
                    cls: this.toolbarCls + ' x-small-editor'
                }
            }
            this.el = ct.createChild(Ext.apply({ id: this.id },this.autoCreate), position);
        }
    },
    
    /**
     * 增加一个元素到工具栏上 -- 这个函数可以把许多混合类型的参数添加到工具栏上。
     * Adds element(s) to the toolbar -- this function takes a variable number of
     * arguments of mixed type and adds them to the toolbar.
     * @param {Mixed} arg1 下面的所有参数都是有效的: The following types of arguments are all valid:<br />
     * <ul>
     * <li>{@link Ext.Toolbar.Button} config: 一个有效的按钮配置对象（等价于{@link #addButton}）。A valid button config object (equivalent to {@link #addButton})</li>
     * <li>HtmlElement: 任何一个标准的HTML元素（等价于 {@link #addElement}）。Any standard HTML element (equivalent to {@link #addElement})</li>
     * <li>Field: 任何一个form域（等价于 {@link #addField}）。Any form field (equivalent to {@link #addField})</li>
     * <li>Item: 任何一个{@link Ext.Toolbar.Item}的子类（等价于{@link #addItem}）。Any subclass of {@link Ext.Toolbar.Item} (equivalent to {@link #addItem})</li>
     * <li>String: 任何一种类型的字符串（在{@link Ext.Toolbar.TextItem}里被封装，等价于{@link #addText}）。Any generic string (gets wrapped in a {@link Ext.Toolbar.TextItem}, equivalent to {@link #addText}).
     * 注意:下面这些特殊的字符串被特殊处理。Note that there are a few special strings that are treated differently as explained next.</li>
     * <li>'separator' or '-': 创建一个分隔符元素（等价于 {@link #addSeparator}）。Creates a separator element (equivalent to {@link #addSeparator})</li>
     * <li>' ': 创建一个空白分隔元素（等价于 {@link #addSpacer}）。Creates a spacer element (equivalent to {@link #addSpacer})</li>
     * <li>'->': 创建一个填充元素（等价于 {@link #addFill}）。Creates a fill element (equivalent to {@link #addFill})</li>
     * </ul>
     * @param {Mixed} arg2
     * @param {Mixed} etc.
     */
    add : function(){
        var a = arguments, l = a.length;
        for(var i = 0; i < l; i++){
            var el = a[i];
            if(el.isFormField){ // some kind of form field
                this.addField(el);
            }else if(el.render){ // some kind of Toolbar.Item
                this.addItem(el);
            }else if(typeof el == "string"){ // string
                if(el == "separator" || el == "-"){
                    this.addSeparator();
                }else if(el == " "){
                    this.addSpacer();
                }else if(el == "->"){
                    this.addFill();
                }else{
                    this.addText(el);
                }
            }else if(el.tag){ // DomHelper spec
                this.addDom(el);
            }else if(el.tagName){ // element
                this.addElement(el);
            }else if(typeof el == "object"){ // must be button config?
                if(el.xtype){
                    this.addItem(Ext.create(el, 'button'));
                }else{
                    this.addButton(el);
                }
            }
        }
    },

    /**
     * 添加一个分隔符。
     * Adds a separator
     * @return {Ext.Toolbar.Item} 分隔符项 The separator item
     */
    addSeparator : function(){
        return this.addItem(new T.Separator());
    },

    /**
     * 添加一个空白分隔符。
     * Adds a spacer element
     * @return {Ext.Toolbar.Spacer} 空白项 The spacer item
     */
    addSpacer : function(){
        return this.addItem(new T.Spacer());
    },

    /**
     * 使得后来添加的元素都像CSS样式：float:right那般向右靠拢。
     * Forces subsequent additions into the float:right toolbar
     */
    addFill : function(){
    	this.addItem(new T.Fill());
    },

    /**
     * 在工具栏上添加任何一个标准的HTML元素。
     * Adds any standard HTML element to the toolbar
     * @param {Mixed} el 要加入的元素本身或元素其。id The element or id of the element to add
     * @return {Ext.Toolbar.Item} 元素项。The element's item
     */
    addElement : function(el){
    	var item = new T.Item({el:el});
        this.addItem(item);
        return item;
    },

    /**
     * 添加任何一个Toolbar.Item或者其子类。
     * Adds any Toolbar.Item or subclass
     * @param {Ext.Toolbar.Item} item 元素项
     * @return {Ext.Toolbar.Item} 元素项 The item
     */
    addItem : function(item){
    	Ext.Toolbar.superclass.add.apply(this, arguments);
    	return item;
    },

    /**
     * 添加一个按钮(或者一组按钮)。可以查看{@link Ext.Toolbar.Button}获取更多的配置信息。
     * Adds a button (or buttons). See {@link Ext.Toolbar.Button} for more info on the config.
     * @param {Object/Array} config 按钮的配置项或配置项的数组。A button config or array of configs
     * @return {Ext.Toolbar.Button/Array}
     */
    addButton : function(config){
        if(Ext.isArray(config)){
            var buttons = [];
            for(var i = 0, len = config.length; i < len; i++) {
                buttons.push(this.addButton(config[i]));
            }
            return buttons;
        }
        var b = config;
        if(!b.events){
            b = config.split ?
                new T.SplitButton(config) :
                new T.Button(config);
        }
        this.initMenuTracking(b);
        this.addItem(b);
        return b;
    },

    // private
    initMenuTracking : function(item){
        if(this.trackMenus && item.menu){
        	this.mon(item, {
                'menutriggerover' : this.onButtonTriggerOver,
                'menushow' : this.onButtonMenuShow,
                'menuhide' : this.onButtonMenuHide,
                scope: this
            });
        }
    },

    /**
     * 在工具栏上添加文本。
     * Adds text to the toolbar
     * @param {String} text 添加的文本。The text to add
     * @return {Ext.Toolbar.Item} 元素。The element's item
     */
    addText : function(text){
    	var t = new T.TextItem(text);
        this.addItem(t);
        return t;
    },

    /**
     * 在指定的索引位置那里插入任何一个{@link Ext.Toolbar.Item}/{@link Ext.Toolbar.Button}项。
     * Inserts any {@link Ext.Toolbar.Item}/{@link Ext.Toolbar.Button} at the specified index.
     * @param {Number} index item插入的地方（索引值） The index where the item is to be inserted
     * @param {Object/Ext.Toolbar.Item/Ext.Toolbar.Button/Array} item 要插入的按钮本身或按钮其配置项，或配置项的数组 item The button, or button config object to be
     * inserted, or an array of buttons/configs.
     * @return {Ext.Toolbar.Button/Item}
     */
    insertButton : function(index, item){
        if(Ext.isArray(item)){
            var buttons = [];
            for(var i = 0, len = item.length; i < len; i++) {
               buttons.push(this.insertButton(index + i, item[i]));
            }
            return buttons;
        }
        if (!(item instanceof T.Button)){
           item = new T.Button(item);
        }
        Ext.Toolbar.superclass.insert.call(this, index, item);
        return item;
    },

    /**
     * 在工具栏上添加一个从{@link Ext.DomHelper}配置传递过来的元素。
     * Adds a new element to the toolbar from the passed {@link Ext.DomHelper} config
     * @param {Object} config
     * @return {Ext.Toolbar.Item} 元素 The element's item
     */
    addDom : function(config){
    	var item = new T.Item({autoEl: config});
        this.addItem(item);
        return item;
    },

    /**
     * 添加一个动态的可展现的 Ext.form field（TextField、ComboBox等等）。
     * 注意:这个域应该还没有被展现。对于一个已经被展现了的域，应使用{@link #addElement}。
     * Adds a dynamically rendered Ext.form field (TextField, ComboBox, etc). Note: the field should not have
     * been rendered yet. For a field that has already been rendered, use {@link #addElement}.
     * @param {Ext.form.Field} field
     * @return {Ext.Toolbar.Item}
     */
    addField : function(field){
    	this.addItem(field);
    	return field;
    },

    applyDefaults : function(c){
        c = Ext.Toolbar.superclass.applyDefaults.call(this, c);
        var d = this.internalDefaults;
        if(c.events){
            Ext.applyIf(c.initialConfig, d);
            Ext.apply(c, d);
        }else{
            Ext.applyIf(c, d);
        }
        return c;
    },

    // private
    onDisable : function(){
        this.items.each(function(item){
             if(item.disable){
                 item.disable();
             }
        });
    },

    // private
    onEnable : function(){
        this.items.each(function(item){
             if(item.enable){
                 item.enable();
             }
        });
    },

    // private
    onButtonTriggerOver : function(btn){
        if(this.activeMenuBtn && this.activeMenuBtn != btn){
            this.activeMenuBtn.hideMenu();
            btn.showMenu();
            this.activeMenuBtn = btn;
        }
    },

    // private
    onButtonMenuShow : function(btn){
        this.activeMenuBtn = btn;
    },

    // private
    onButtonMenuHide : function(btn){
        delete this.activeMenuBtn;
    }
});
Ext.reg('toolbar', Ext.Toolbar);

/**
 * @class Ext.Toolbar.Item
 * 被其他类所继承的基类，以获取一些基本的工具栏项功能。
 * The base class that other non-ineracting Toolbar Item classes should extend in order to
 * get some basic common toolbar item functionality.
 * @constructor 创建一个新的项。Creates a new Item
 * @param {HTMLElement} el
 */
T.Item = Ext.extend(Ext.BoxComponent, {
    hideParent: true, //  Hiding a Toolbar.Item hides its containing TD
    enable:Ext.emptyFn,
    disable:Ext.emptyFn,
    focus:Ext.emptyFn
});
Ext.reg('tbitem', T.Item);

/**
 * @class Ext.Toolbar.Separator
 * @extends Ext.Toolbar.Item
 * 在项与项之间添加一个垂直的分隔符。用法举例：
 * A simple class that adds a vertical separator bar between toolbar items.  Example usage:
 * <pre><code>
new Ext.Panel({
	tbar : [
		'Item 1',
		{xtype: 'tbseparator'}, // or '-'
		'Item 2'
	]
});
</code></pre>
 * @constructor 创建一个新的分隔符。Creates a new Separator
 */
T.Separator = Ext.extend(T.Item, {
    onRender : function(ct, position){
        this.el = ct.createChild({tag:'span', cls:'xtb-sep'}, position);
    }
});
Ext.reg('tbseparator', T.Separator);

/**
 * @class Ext.Toolbar.Spacer
 * @extends Ext.Toolbar.Item
 * 在项与项之间添加一个水平的空白位置。
 * A simple element that adds extra horizontal space between items in a toolbar.
 * <pre><code>
new Ext.Panel({
	tbar : [
		'Item 1',
		{xtype: 'tbspacer'}, // or ' '
		'Item 2'
	]
});
</code></pre>
 * @constructor 创建一个新的Spacer对象 Creates a new Spacer
 */
T.Spacer = Ext.extend(T.Item, {
    onRender : function(ct, position){
        this.el = ct.createChild({tag:'div', cls:'xtb-spacer', style: this.width?'width:'+this.width+'px':''}, position);
    }
});
Ext.reg('tbspacer', T.Spacer);

/**
 * @class Ext.Toolbar.Fill
 * @extends Ext.Toolbar.Spacer
 * 添加一个填充空白的元素，把后面的元素全都放到工具栏的右侧。
 * A non-rendering placeholder item which instructs the Toolbar's Layout to begin using
 * the right-justified button container.
 * <pre><code>
new Ext.Panel({
	tbar : [
		'Item 1',
		{xtype: 'tbfill'}, // or '->'
		'Item 2'
	]
});
</code></pre>
 * @constructor 创建一个新的Fill对象。Creates a new Fill
 */
T.Fill = Ext.extend(T.Item, {
    // private
    render : Ext.emptyFn,
    isFill : true
});
Ext.reg('tbfill', T.Fill);

/**
 * @class Ext.Toolbar.TextItem
 * @extends Ext.Toolbar.Item
 * 只是简单地渲染一段文本字符串。
 * A simple class that renders text directly into a toolbar.
 * <pre><code>
new Ext.Panel({
	tbar : [
		{xtype: 'tbtext', text: 'Item 1'} // 或简单地就是 or simply 'Item 1'
	]
});
</code></pre>
 * @constructor 创建一个新的TextItem对象。Creates a new TextItem
 * @param {String/Object} text 文本字符串，或是一个包含<tt>text</tt>属性的配置对象 A text string, or a config object containing a <tt>text</tt> property
 */
T.TextItem = Ext.extend(T.Item, {
	constructor: function(config){
		if (typeof config == 'string') {
			config = { autoEl: {cls: 'xtb-text', html: config }};
		} else {
			config.autoEl = {cls: 'xtb-text', html: config.text || ''};
		}
	    T.TextItem.superclass.constructor.call(this, config);
	},
    setText: function(t) {
    	if (this.rendered) {
    		this.el.dom.innerHTML = t;
    	} else {
    		this.autoEl.html = t;
    	}
    }
});
Ext.reg('tbtext', T.TextItem);

// 向后兼容 backwards compat
T.Button = Ext.extend(Ext.Button, {});
T.SplitButton = Ext.extend(Ext.SplitButton, {});
Ext.reg('tbbutton', T.Button);
Ext.reg('tbsplit', T.SplitButton);

})();

Ext.ButtonGroup = Ext.extend(Ext.Panel, {
    baseCls: 'x-btn-group',
    layout:'table',
    defaultType: 'button',
    frame: true,
    internalDefaults: {removeMode: 'container', hideParent: true},

    initComponent : function(){
        this.layoutConfig = this.layoutConfig || {};
        Ext.applyIf(this.layoutConfig, {
            columns : this.columns
        });
        if(!this.title){
            this.addClass('x-btn-group-notitle');
        }
        this.on('afterlayout', this.onAfterLayout, this);
        Ext.ButtonGroup.superclass.initComponent.call(this);
    },

    applyDefaults : function(c){
        c = Ext.ButtonGroup.superclass.applyDefaults.call(this, c);
        var d = this.internalDefaults;
        if(c.events){
            Ext.applyIf(c.initialConfig, d);
            Ext.apply(c, d);
        }else{
            Ext.applyIf(c, d);
        }
        return c;
    },

    onAfterLayout : function(){
        var bodyWidth = this.body.getFrameWidth('lr') + this.body.dom.firstChild.offsetWidth;
        this.body.setWidth(bodyWidth);
        this.el.setWidth(bodyWidth + this.getFrameWidth());
    }
});

Ext.reg('buttongroup', Ext.ButtonGroup);