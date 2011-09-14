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
 * @class Ext.Toolbar
 * Basic Toolbar class.
 * @constructor
 * 创建一个新的工具条对象
 * @param {String/HTMLElement/Element} container 工具条的容器元素或元素id
 * @param {Array} buttons (optional) 要加入的按钮配置数组或是元素
 * @param {Object} config 配置项对象
 */ 
Ext.Toolbar = function(container, buttons, config){
    if(container instanceof Array){ // omit the container for later rendering
        buttons = container;
        config = buttons;
        container = null;
    }
    Ext.apply(this, config);
    this.buttons = buttons;
    if(container){
        this.render(container);
    }
};

Ext.Toolbar.prototype = {
    // private
    render : function(ct){
        this.el = Ext.get(ct);
        if(this.cls){
            this.el.addClass(this.cls);
        }
        // using a table allows for vertical alignment
        this.el.update('<div class="x-toolbar x-small-editor"><table cellspacing="0"><tr></tr></table></div>');
        this.tr = this.el.child("tr", true);
        var autoId = 0;
        this.items = new Ext.util.MixedCollection(false, function(o){
            return o.id || ("item" + (++autoId));
        });
        if(this.buttons){
            this.add.apply(this, this.buttons);
            delete this.buttons;
        }
    },

    /**
     * 加入工具条一个或多个的元素 -- 该函数需要几个不同类型的参数传入到工具条。
     * @param {Mixed} arg1 可传入下列不同类型的参数：<br />
     * <ul>
     * <li>{@link Ext.Toolbar.Button} config: 有效的按钮配置对象（相当于{@link #addButton}）</li>
     * <li>HtmlElement:任意标准的HTML元素（相当于{@link #addElement}）</li>
     * <li>Field: 任意表单对象（相当于{@link #addField}）</li>
     * <li>Item:任意{@link Ext.Toolbar.Item}的子类（相当于{@link #addItem}）</li>
     * <li>String: 一般意义的字符（经{@link Ext.Toolbar.TextItem}包装，相当于 {@link #addText}）。
     *     须注意有些特殊的字符用于不同的场合，如下面说明的。</li>
     * <li>'separator' 或 '-'：创建一个分隔符元素（相当于{@link #addSeparator}）</li>
     * <li>' ': 创建一个空白符(equivalent to {@link #addSpacer})</li>
     * <li>'->': 创建一个填充元素（相当于{@link #addFill}）</li>
     * </ul>
     * @param {Mixed} 参数2
     * @param {Mixed} 参数3
     */
    add : function(){
        var a = arguments, l = a.length;
        for(var i = 0; i < l; i++){
            var el = a[i];
            if(el.applyTo){ // some kind of form field
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
                this.addButton(el);
            }
        }
    },
    
    /**
     * 返回工具条的元素
     * @return {Ext.Element}
     */
    getEl : function(){
        return this.el;  
    },
    
    /**
     * 加入一个分隔符
     * @return {Ext.Toolbar.Item} 分隔符
     */
    addSeparator : function(){
        return this.addItem(new Ext.Toolbar.Separator());
    },

    /**
     * 加入一个空白元素
     * @return {Ext.Toolbar.Spacer} 空白项
     */
    addSpacer : function(){
        return this.addItem(new Ext.Toolbar.Spacer());
    },

    /**
     * 加入一个填充元素。规定是从工具条后插入（右方开始）
     * @return {Ext.Toolbar.Fill} 填充项
     */
    addFill : function(){
        return this.addItem(new Ext.Toolbar.Fill());
    },

    /**
     * 加入任意的HTML元素到工具条中去
     * @param {String/HTMLElement/Element} el 要加入的元素或元素id
     * @return {Ext.Toolbar.Item} 元素项
     */
    addElement : function(el){
        return this.addItem(new Ext.Toolbar.Item(el));
    },
    
    /**
     * 加入任意的Toolbar.Item或子类
     * @param {Ext.Toolbar.Item} item
     * @return {Ext.Toolbar.Item} Item项
     */
    addItem : function(item){
        var td = this.nextBlock();
        item.render(td);
        this.items.add(item);
        return item;
    },
    
    /**
     * 加入一个或多个按钮。更多配置的资讯可参阅{@link Ext.Toolbar.Button}
     * @param {Object/Array} config 按钮配置或配置项数组
     * @return {Ext.Toolbar.Button/Array}
     */
    addButton : function(config){
        if(config instanceof Array){
            var buttons = [];
            for(var i = 0, len = config.length; i < len; i++) {
                buttons.push(this.addButton(config[i]));
            }
            return buttons;
        }
        var b = config;
        if(!(config instanceof Ext.Toolbar.Button)){
            b = config.split ?
                new Ext.Toolbar.SplitButton(config) :
                new Ext.Toolbar.Button(config);
        }
        var td = this.nextBlock();
        b.render(td);
        this.items.add(b);
        return b;
    },
    
    /**
     * 在工具条中加入文本
     * @param {String} text 要加入的文本
     * @return {Ext.Toolbar.Item} 元素项
     */
    addText : function(text){
        return this.addItem(new Ext.Toolbar.TextItem(text));
    },
    
    /**
     * 位于索引的某一项插入任意的{@link Ext.Toolbar.Item}/{@link Ext.Toolbar.Button}
     * @param {Number} index 插入项所在的索引位置
     * @param {Object/Ext.Toolbar.Item/Ext.Toolbar.Button (可能是数组类型)} item 要插入的按钮，或按钮的配置项对象
     * @return {Ext.Toolbar.Button/Item}
     */
    insertButton : function(index, item){
        if(item instanceof Array){
            var buttons = [];
            for(var i = 0, len = item.length; i < len; i++) {
               buttons.push(this.insertButton(index + i, item[i]));
            }
            return buttons;
        }
        if (!(item instanceof Ext.Toolbar.Button)){
           item = new Ext.Toolbar.Button(item);
        }
        var td = document.createElement("td");
        this.tr.insertBefore(td, this.tr.childNodes[index]);
        item.render(td);
        this.items.insert(index, item);
        return item;
    },
    
    /**
     * 传入一个{@link Ext.DomHelper}配置参数，然后作为新元素加入到工具条。
     * @param {Object} config
     * @return {Ext.Toolbar.Item} 元素项
     */
    addDom : function(config, returnEl){
        var td = this.nextBlock();
        Ext.DomHelper.overwrite(td, config);
        var ti = new Ext.Toolbar.Item(td.firstChild);
        ti.render(td);
        this.items.add(ti);
        return ti;
    },

    /**
     * 动态加入一个可渲染的Ext.form字段（TextField，Combobox，等等）。
     * 注意：字段应该是还未被渲染的。如已渲染，使用{@link #addElement}插入。
     * @param {Ext.form.Field} field
     * @return {Ext.ToolbarItem}
     */
    addField : function(field){
        var td = this.nextBlock();
        field.render(td);
        var ti = new Ext.Toolbar.Item(td.firstChild);
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
    destroy : function(){
        if(this.items){ // rendered?
            Ext.destroy.apply(Ext, this.items.items);
        }
        Ext.Element.uncache(this.el, this.tr);
    }
};

/**
 * @class Ext.Toolbar.Item
 * 一个简单的用来将文本呈现到 toolbar 上的类。
 * @constructor
 * 创建一个 TextItem 对象。
 * @param {HTMLElement} el 
 */
Ext.Toolbar.Item = function(el){
    this.el = Ext.getDom(el);
    this.id = Ext.id(this.el);
    this.hidden = false;
};

Ext.Toolbar.Item.prototype = {
    
    /**
     * 取得此项的 HTML 元素。
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
     * 移除此项。
     */
    destroy : function(){
        this.td.parentNode.removeChild(this.td);
    },
    
    /**
     * 显示此项。
     */
    show: function(){
        this.hidden = false;
        this.td.style.display = "";
    },
    
    /**
     * 隐藏此项。
     */
    hide: function(){
        this.hidden = true;
        this.td.style.display = "none";
    },
    
    /**
     * 方便的布尔函数用来控制显示/隐藏。
     * @param {Boolean} visible true时显示/false 时隐藏
     */
    setVisible: function(visible){
        if(visible) {
            this.show();
        }else{
            this.hide();
        }
    },
    
    /**
     * 试着聚焦到此项。
     */
    focus : function(){
        Ext.fly(this.el).focus();
    },
    
    /**
     * 禁止此项。
     */
    disable : function(){
        Ext.fly(this.td).addClass("x-item-disabled");
        this.disabled = true;
        this.el.disabled = true;
    },
    
    /**
     * 启用此项。
     */
    enable : function(){
        Ext.fly(this.td).removeClass("x-item-disabled");
        this.disabled = false;
        this.el.disabled = false;
    }
};


/**
 * @class Ext.Toolbar.Separator
 * @extends Ext.Toolbar.Item
 * 一个在工具条内的分隔符类
 * @constructor
 * 创建一个新分隔符（Separator）对象
 */
Ext.Toolbar.Separator = function(){
    var s = document.createElement("span");
    s.className = "ytb-sep";
    Ext.Toolbar.Separator.superclass.constructor.call(this, s);
};
Ext.extend(Ext.Toolbar.Separator, Ext.Toolbar.Item, {
    enable:Ext.emptyFn,
    disable:Ext.emptyFn,
    focus:Ext.emptyFn
});

/**
 * @class Ext.Toolbar.Spacer
 * @extends Ext.Toolbar.Item
 * 在工具条中插入一条水平占位符元素。
 * @constructor
 * 创建一个新Spacer对象
 */
Ext.Toolbar.Spacer = function(){
    var s = document.createElement("div");
    s.className = "ytb-spacer";
    Ext.Toolbar.Spacer.superclass.constructor.call(this, s);
};
Ext.extend(Ext.Toolbar.Spacer, Ext.Toolbar.Item, {
    enable:Ext.emptyFn,
    disable:Ext.emptyFn,
    focus:Ext.emptyFn
});

/**
 * @class Ext.Toolbar.Fill
 * @extends Ext.Toolbar.Spacer
 * 在工具条中插入一条100%宽度的空白水平占位符元素。
 * @constructor
 * Creates a new Spacer
 */
Ext.Toolbar.Fill = Ext.extend(Ext.Toolbar.Spacer, {
    // private
    render : function(td){
        td.style.width = '100%';
        Ext.Toolbar.Fill.superclass.render.call(this, td);
    }
});

/**
 * @class Ext.Toolbar.TextItem
 * @extends Ext.Toolbar.Item
 * 一个将文本直接渲染到工具条的简易类。
 * @constructor
 * 创建一个新TextItem的对象
 * @param {String} text
 */
Ext.Toolbar.TextItem = function(text){
    var s = document.createElement("span");
    s.className = "ytb-text";
    s.innerHTML = text;
    Ext.Toolbar.TextItem.superclass.constructor.call(this, s);
};
Ext.extend(Ext.Toolbar.TextItem, Ext.Toolbar.Item, {
    enable:Ext.emptyFn,
    disable:Ext.emptyFn,
    focus:Ext.emptyFn
});

/**
 * @class Ext.Toolbar.Button
 * @extends Ext.Button
 * 用于渲染工具条的按钮。
 * @constructor
 * 创建一个新的按钮对象
 * @param {Object} config 标准{@link Ext.Button}配置项对象
 */
Ext.Toolbar.Button = function(config){
    Ext.Toolbar.Button.superclass.constructor.call(this, null, config);
};
Ext.extend(Ext.Toolbar.Button, Ext.Button, {
    render : function(td){
        this.td = td;
        Ext.Toolbar.Button.superclass.render.call(this, td);
    },
    
    /**
     * 移除并消耗该按钮
     */
    destroy : function(){
        Ext.Toolbar.Button.superclass.destroy.call(this);
        this.td.parentNode.removeChild(this.td);
    },
    
    /**
     * 显示按钮
     */
    show: function(){
        this.hidden = false;
        this.td.style.display = "";
    },
    
    /**
     * 隐藏按钮
     */
    hide: function(){
        this.hidden = true;
        this.td.style.display = "none";
    },

    /**
     * 禁止此项
     */
    disable : function(){
        Ext.fly(this.td).addClass("x-item-disabled");
        this.disabled = true;
    },

    /**
     * 启用此项
     */
    enable : function(){
        Ext.fly(this.td).removeClass("x-item-disabled");
        this.disabled = false;
    }
});
// backwards compat
Ext.ToolbarButton = Ext.Toolbar.Button;

/**
 * @class Ext.Toolbar.SplitButton
 * @extends Ext.SplitButton
 * 用于渲染工具条的菜单。
 * @constructor
 * 创建一个新的SplitButton对象
 * @param {Object} config 标准{@link Ext.SplitButton}配置项对象 
 */
Ext.Toolbar.SplitButton = function(config){
    Ext.Toolbar.SplitButton.superclass.constructor.call(this, null, config);
};
Ext.extend(Ext.Toolbar.SplitButton, Ext.SplitButton, {
    render : function(td){
        this.td = td;
        Ext.Toolbar.SplitButton.superclass.render.call(this, td);
    },
    
    /**
     * 移除并销毁该按钮
     */
    destroy : function(){
        Ext.Toolbar.SplitButton.superclass.destroy.call(this);
        this.td.parentNode.removeChild(this.td);
    },
    
    /**
     * 显示按钮
     */
    show: function(){
        this.hidden = false;
        this.td.style.display = "";
    },
    
    /**
     * 隐藏按钮
     */
    hide: function(){
        this.hidden = true;
        this.td.style.display = "none";
    }
});

// 向后兼容
Ext.Toolbar.MenuButton = Ext.Toolbar.SplitButton;