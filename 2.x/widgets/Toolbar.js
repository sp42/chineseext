/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

 /**
  *@class Ext.Toolbar
 	*@extends Ext.BoxComponent
  *基本工具栏类.工具栏元素可以通过它们的构造函数明确地被创建，或者通过它们的xtype类型来实现。一些项也有创建的简单字符串。
  *@constructor
 	*创建一个新的工具栏
 	*@param {Object/Array} config 要添加的一个配置对象或者一个要按钮数组
  */
 Ext.Toolbar = function(config){
    if(Ext.isArray(config)){
        config = {buttons:config};
    }
    Ext.Toolbar.superclass.constructor.call(this, config);
};

(function(){

var T = Ext.Toolbar;

Ext.extend(T, Ext.BoxComponent, {

    trackMenus : true,

    // private
    initComponent : function(){
        T.superclass.initComponent.call(this);

        if(this.items){
            this.buttons = this.items;
        }
    
         /**
         * 工具栏项的集合类
         * @property items
         * @type Ext.util.MixedCollection
         */
        this.items = new Ext.util.MixedCollection(false, function(o){
            return o.itemId || o.id || Ext.id();
        });
    },

    // private
    autoCreate: {
        cls:'x-toolbar x-small-editor',
        html:'<table cellspacing="0"><tr></tr></table>'
    },

    // private
    onRender : function(ct, position){
        this.el = ct.createChild(Ext.apply({ id: this.id },this.autoCreate), position);
        this.tr = this.el.child("tr", true);
    },

    // private
    afterRender : function(){
        T.superclass.afterRender.call(this);
        if(this.buttons){
            this.add.apply(this, this.buttons);
            delete this.buttons;
        }
    },


     /**
     * 增加一个元素到工具栏上 -- 这个函数可以把许多混合类型的参数添加到工具栏上.
     * @param {Mixed} arg1 下面的所有参数都是有效的:<br />
     * <ul>
     * <li>{@link Ext.Toolbar.Button} config: 一个有效的按钮配置对象 (等价于{@link #addButton})</li>
     * <li>HtmlElement: 任何一个标准的HTML元素 (等价于 {@link #addElement})</li>
     * <li>Field: 任何一个form域 (等价于 {@link #addField})</li>
     * <li>Item: 任何一个{@link Ext.Toolbar.Item}的子类 (等价于{@link #addItem})</li>
     * <li>String: 任何一种类型的字符串 (在{@link Ext.Toolbar.TextItem}里被封装, 等价于 {@link #addText}).
     * 注意:下面这些特殊的字符串被特殊处理</li>
     * <li>'separator' 或 '-': 创建一个分隔符元素 (等价于 {@link #addSeparator})</li>
     * <li>' ': 创建一个空白分隔元素 (等价于 {@link #addSpacer})</li>
     * <li>'->': 创建一个填充元素 (等价于 {@link #addFill})</li>
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
            }else if(el.tagName){ // element
                this.addElement(el);
            }else if(typeof el == "object"){ // must be button config?
                if(el.xtype){
                    this.addField(Ext.ComponentMgr.create(el, 'button'));
                }else{
                    this.addButton(el);
                }
            }
        }
    },
    
    /**
     * 添加一个分隔符
     * @return {Ext.Toolbar.Item} 分隔符项
     */

    addSeparator : function(){
        return this.addItem(new T.Separator());
    },

    /**
     * 添加一个空白分隔符 
     * @return {Ext.Toolbar.Spacer} 空白项
     */
    addSpacer : function(){
        return this.addItem(new T.Spacer());
    },


    /**
     * 添加一个填充元素,把后面的元素全都放到工具栏的右侧
     * @return {Ext.Toolbar.Fill} The fill item
     */
    addFill : function(){
        return this.addItem(new T.Fill());
    },


    /**
     * 在工具栏上添加任何一个标准的HTML元素
     * @param {Mixed} el 要加入的元素本身或元素其id
     * @return {Ext.Toolbar.Item} 元素项
     */
    addElement : function(el){
        return this.addItem(new T.Item(el));
    },
    
 
    /**
     * 添加任何一个 Toolbar.Item 或者其子类
     * @param {Ext.Toolbar.Item} item 元素项
     * @return {Ext.Toolbar.Item} 元素项
     */
    addItem : function(item){
        var td = this.nextBlock();
        this.initMenuTracking(item);
        item.render(td);
        this.items.add(item);
        return item;
    },
    
 
    /**
     * 添加一个按钮(或者一组按钮). 可以查看 {@link Ext.Toolbar.Button} 获取更多的配置信息.
     * @param {Object/Array} config 按钮的配置项或配置项的数组
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
        if(!(config instanceof T.Button)){
            b = config.split ? 
                new T.SplitButton(config) :
                new T.Button(config);
        }
        var td = this.nextBlock();
        this.initMenuTracking(b);
        b.render(td);
        this.items.add(b);
        return b;
    },

    // private
    initMenuTracking : function(item){
        if(this.trackMenus && item.menu){
            item.on({
                'menutriggerover' : this.onButtonTriggerOver,
                'menushow' : this.onButtonMenuShow,
                'menuhide' : this.onButtonMenuHide,
                scope: this
            })
        }
    },

    /**
     * 在工具栏上添加文本
     * @param {String} text 添加的文本
     * @return {Ext.Toolbar.Item} item元素
     */
    addText : function(text){
        return this.addItem(new T.TextItem(text));
    },
    

    /**
     * 在指定的索引位置插入任何一个{@link Ext.Toolbar.Item}/{@link Ext.Toolbar.Button}项.
     * @param {Number} index item插入的地方（索引值）
     * @param {Object/Ext.Toolbar.Item/Ext.Toolbar.Button/Array} item 要插入的按钮本身或按钮其配置项，或配置项的数组
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
        var td = document.createElement("td");
        this.tr.insertBefore(td, this.tr.childNodes[index]);
        this.initMenuTracking(item);
        item.render(td);
        this.items.insert(index, item);
        return item;
    },
    
    /**
     * 在工具栏上添加一个从 {@link Ext.DomHelper}配置传递过来的元素
     * @param {Object} config
     * @return {Ext.Toolbar.Item} item元素
     */
    addDom : function(config, returnEl){
        var td = this.nextBlock();
        Ext.DomHelper.overwrite(td, config);
        var ti = new T.Item(td.firstChild);
        ti.render(td);
        this.items.add(ti);
        return ti;
    },

    /**
     * 添加一个动态的可展现的 Ext.form field (TextField, ComboBox, 等等). 
     * 注意: 这个域应该还没有被展现.对于一个已经被展现了的域,使用{@link #addElement}.
     * @param {Ext.form.Field} field
     * @return {Ext.ToolbarItem}
     */
    addField : function(field){
        var td = this.nextBlock();
        field.render(td);
        var ti = new T.Item(td.firstChild);
        ti.render(td);
        this.items.add(ti);
        return ti;
    },

    // private
    nextBlock : function(){
        var td = document.createElement("td");
        this.tr.appendChild(td);
        return td;
    },

    // private
    onDestroy : function(){
        Ext.Toolbar.superclass.onDestroy.call(this);
        if(this.rendered){
            if(this.items){ // rendered?
                Ext.destroy.apply(Ext, this.items.items);
            }
            Ext.Element.uncache(this.tr);
        }
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

    /**
     * @cfg {String} autoEl @hide
     */
});
Ext.reg('toolbar', Ext.Toolbar);

/**
 * @class Ext.Toolbar.Item
 * 被其他类所继承的基类,以获取一些基本的工具栏项功能
 * @constructor
 * 创建一个新的项
 * @param {HTMLElement} el 
 */
T.Item = function(el){
    this.el = Ext.getDom(el);
    this.id = Ext.id(this.el);
    this.hidden = false;
};

T.Item.prototype = {

    /**
     * 得到此项的HTML元素
     * @return {HTMLElement}
     */
    getEl : function(){
       return this.el;  
    },

    // private
    render : function(td){
        this.td = td;
        td.appendChild(this.el);
    },
    
 
    /**
     * 移除并且销毁此项.
     */
    destroy : function(){
        if(this.td && this.td.parentNode){
            this.td.parentNode.removeChild(this.td);
        }
    },
 
    /**
     * 显示此项.
     */
    show: function(){
        this.hidden = false;
        this.td.style.display = "";
    },
    
  
    /**
     * 隐藏此项.
     */
    hide: function(){
        this.hidden = true;
        this.td.style.display = "none";
    },
    
 
    /**
     * 用于控制显示/隐藏的简便函数.
     * @param {Boolean} visible true就隐藏
     */
    setVisible: function(visible){
        if(visible) {
            this.show();
        }else{
            this.hide();
        }
    },
    
    /**
     * 在该项上获得焦点
     */
    focus : function(){
        Ext.fly(this.el).focus();
    },
    
    /**
     * 禁用该项
     */
    disable : function(){
        Ext.fly(this.td).addClass("x-item-disabled");
        this.disabled = true;
        this.el.disabled = true;
    },
    
    /**
     * 激活该项
     */
    enable : function(){
        Ext.fly(this.td).removeClass("x-item-disabled");
        this.disabled = false;
        this.el.disabled = false;
    }
};
Ext.reg('tbitem', T.Item);



/**
 * @class Ext.Toolbar.Separator
 * @extends Ext.Toolbar.Item
 * 一个简单的类,在工具栏项之间添加垂直竖线分隔符. 实例使用:
 * <pre><code>
new Ext.Panel({
	tbar : [
		'Item 1',
		{xtype: 'tbseparator'}, // 或 '-'
		'Item 2'
	]
});
</code></pre>
 * @constructor
 * 创建一个新的分隔符
 */
T.Separator = function(){
    var s = document.createElement("span");
    s.className = "ytb-sep";
    T.Separator.superclass.constructor.call(this, s);
};
Ext.extend(T.Separator, T.Item, {
    enable:Ext.emptyFn,
    disable:Ext.emptyFn,
    focus:Ext.emptyFn
});
Ext.reg('tbseparator', T.Separator);

/**
 * @class Ext.Toolbar.Spacer
 * @extends Ext.Toolbar.Item
 * 一个在工具栏各项间添加水平方向空间的简单元素.
 * <pre><code>
new Ext.Panel({
	tbar : [
		'Item 1',
		{xtype: 'tbspacer'}, // or ' '
		'Item 2'
	]
});
</code></pre>
 * @constructor
 * 创建一个新空白间位符（spacer）
 */
T.Spacer = function(){
    var s = document.createElement("div");
    s.className = "ytb-spacer";
    T.Spacer.superclass.constructor.call(this, s);
};
Ext.extend(T.Spacer, T.Item, {
    enable:Ext.emptyFn,
    disable:Ext.emptyFn,
    focus:Ext.emptyFn
});

Ext.reg('tbspacer', T.Spacer);

/**
 * @class Ext.Toolbar.Fill
 * @extends Ext.Toolbar.Spacer
 * 一个在工具栏各项间尽最大可能宽度 (100% width) 添加水平方向空间的简单元素.
 * <pre><code>
new Ext.Panel({
	tbar : [
		'Item 1',
		{xtype: 'tbfill'}, // or '->'
		'Item 2'
	]
});
</code></pre>
 * @constructor
 *  创建一个新空白间位符（spacer）
 */
T.Fill = Ext.extend(T.Spacer, {
    // private
    render : function(td){
        td.style.width = '100%';
        T.Fill.superclass.render.call(this, td);
    }
});
Ext.reg('tbfill', T.Fill);

/**
 * @class Ext.Toolbar.TextItem
 * @extends Ext.Toolbar.Item
 * 一个在工具栏直接展现文本的简单类.
 * <pre><code>
new Ext.Panel({
	tbar : [
		{xtype: 'tbtext', text: 'Item 1'} // 或'Item 1'即可
	]
});
</code></pre>
 * @constructor
 * 创建一个新的文本项
 * @param {String/Object} text 文本字符串，或带有<tt>text</tt>属性的配置项对象
 */
T.TextItem = function(t){
    var s = document.createElement("span");
    s.className = "ytb-text";
    s.innerHTML = t.text ? t.text : t;
    T.TextItem.superclass.constructor.call(this, s);
};
Ext.extend(T.TextItem, T.Item, {
    enable:Ext.emptyFn,
    disable:Ext.emptyFn,
    focus:Ext.emptyFn
});
Ext.reg('tbtext', T.TextItem);

/**
 * @class Ext.Toolbar.Button
 * @extends Ext.Button
 * 展现在工具栏中的一个按钮. 使用 <tt>handler</tt> 配置来指定一个回调函数去触发按钮点击的事件
 * <pre><code>
new Ext.Panel({
	tbar : [
		{text: 'OK', handler: okHandler} // 如不指定缺省类型是tbbutton
	]
});
</code></pre>
 * @constructor
 * 创建一个新的按钮
 * @param {Object} config 一个标准{@link Ext.Button}配置项对象
 */
T.Button = Ext.extend(Ext.Button, {
    hideParent : true,

    onDestroy : function(){
        T.Button.superclass.onDestroy.call(this);
        if(this.container){
            this.container.remove();
        }
    }
});
Ext.reg('tbbutton', T.Button);

/**
 * @class Ext.Toolbar.SplitButton
 * @extends Ext.SplitButton
 * 工具栏中一个有分隔符标志的菜单按钮
 * <pre><code>
new Ext.Panel({
	tbar : [
		{
			xtype: 'tbsplit',
		   	text: 'Options',
		   	handler: optionsHandler, // handle a click on the button itself
		   	menu: new Ext.menu.Menu({
		        items: [
		        	// These items will display in a dropdown menu when the split arrow is clicked
			        {text: 'Item 1', handler: item1Handler},
			        {text: 'Item 2', handler: item2Handler},
		        ]
		   	})
		}
	]
});
</code></pre>
 * @constructor
 * 创建一个有分隔符标志的菜单按钮
 * @param {Object} config 一个标准的 {@link Ext.SplitButton} 配置对象
 */
T.SplitButton = Ext.extend(Ext.SplitButton, {
    hideParent : true,

    onDestroy : function(){
        T.SplitButton.superclass.onDestroy.call(this);
        if(this.container){
            this.container.remove();
        }
    }
});

Ext.reg('tbsplit', T.SplitButton);
// backwards compat
T.MenuButton = T.SplitButton;

})();
