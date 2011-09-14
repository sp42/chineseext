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
 * @class Ext.form.ComboBox
 * @extends Ext.form.TriggerField
 * A combobox control with support for autocomplete, remote-loading, paging and many other features.
 * 一个提供自动完成、远程加载、分页和许多其他特性的组合框。
 * @constructor
 * Create a new ComboBox.
 * 创建一个组合框。
 * @param {Object} config 配置选项
 */
Ext.form.ComboBox = function(config){
    Ext.form.ComboBox.superclass.constructor.call(this, config);
    this.addEvents({
        /**
         * @event expand
         * Fires when the dropdown list is expanded
         * 当下拉列表展开的时候触发
	     * @param {Ext.form.ComboBox} combo 组合框本身
	     */
        'expand' : true,
        /**
         * @event collapse
         * Fires when the dropdown list is collapsed
         * 当下拉列表收起的时候触发
	     * @param {Ext.form.ComboBox} combo 组合框本身
	     */
        'collapse' : true,
        /**
         * @event beforeselect
         * Fires before a list item is selected. Return false to cancel the selection.
         * 列表项被选中前触发。返回 false 可以取消选择。
	     * @param {Ext.form.ComboBox} combo 组合框本身
	     * @param {Ext.data.Record} record 从数据仓库中返回的数据记录(The data record returned from the underlying store)
	     * @param {Number} index 选中项在下拉列表中的索引位置
	     */
        'beforeselect' : true,
        /**
         * @event select
         * Fires when a list item is selected
         * 当列表项被选中时触发
	     * @param {Ext.form.ComboBox} combo 组合框本身
	     * @param {Ext.data.Record} record 从数据仓库中返回的数据记录(The data record returned from the underlying store)
	     * @param {Number} index 选中项在下拉列表中的索引位置
	     */
        'select' : true,
        /**
         * @event beforequery
         * Fires before all queries are processed. Return false to cancel the query or set cancel to true.
         * 所有的查询被处理前触发。返回 false 或者设置 cancel 参数为 true 可以取消查询。
         * The event object passed has these properties:
         * 传递的事件对象包含这些属性：
	     * @param {Ext.form.ComboBox} combo 组合框本身
	     * @param {String} query 查询语句
	     * @param {Boolean} forceAll 值为 true 时强制为 "all" 查询
	     * @param {Boolean} cancel 值为 true 时取消查询
	     * @param {Object} e 查询事件对象
	     */
        'beforequery': true
    });
    if(this.transform){
        this.allowDomMove = false;
        var s = Ext.getDom(this.transform);
        if(!this.hiddenName){
            this.hiddenName = s.name;
        }
        if(!this.store){
            this.mode = 'local';
            var d = [], opts = s.options;
            for(var i = 0, len = opts.length;i < len; i++){
                var o = opts[i];
                var value = (Ext.isIE ? o.getAttributeNode('value').specified : o.hasAttribute('value')) ? o.value : o.text;
                if(o.selected) {
                    this.value = value;
                }
                d.push([value, o.text]);
            }
            this.store = new Ext.data.SimpleStore({
                'id': 0,
                fields: ['value', 'text'],
                data : d
            });
            this.valueField = 'value';
            this.displayField = 'text';
        }
        s.name = Ext.id(); // wipe out the name in case somewhere else they have a reference
        if(!this.lazyRender){
            this.target = true;
            this.el = Ext.DomHelper.insertBefore(s, this.autoCreate || this.defaultAutoCreate);
            s.parentNode.removeChild(s); // remove it
            this.render(this.el.parentNode);
        }else{
            s.parentNode.removeChild(s); // remove it
        }

    }
    this.selectedIndex = -1;
    if(this.mode == 'local'){
        if(config.queryDelay === undefined){
            this.queryDelay = 10;
        }
        if(config.minChars === undefined){
            this.minChars = 0;
        }
    }
};

Ext.extend(Ext.form.ComboBox, Ext.form.TriggerField, {
    /**
     * @cfg {String/HTMLElement/Element} transform 要转换为组合框的 id, DOM 节点 或者已有的 select 元素
     */
    /**
     * @cfg {Boolean} lazyRender 值为 true 时阻止 ComboBox 渲染直到该对象被请求(被渲染到 Ext.Editor 组件的时候应该使用这个参数，默认为 false)
     */
    /**
     * @cfg {Boolean/Object} autoCreate 指定一个 DomHelper 对象, 或者设置值为 true 使用默认元素(默认为：{tag: "input", type: "text", size: "24", autocomplete: "off"})
     */
    /**
     * @cfg {Ext.data.Store} store 该组合框绑定的数据仓库(默认为 undefined)
     */
    /**
     * @cfg {String} title 如果提供了, 则会创建一个包含此文本的元素并被添加到下拉列表的顶部(默认为 undefined, 表示没有头部元素)
     */

    // private
    defaultAutoCreate : {tag: "input", type: "text", size: "24", autocomplete: "off"},
    /**
     * @cfg {Number} listWidth 以象素表示的下拉列表的宽度(默认的宽度与 ComboBox 的 width 属性一致)
     */
    listWidth: undefined,
    /**
     * @cfg {String} displayField The underlying data field name to bind to this CombBox (defaults to undefined if mode = 'remote' or 'text' if mode = 'local')
     * 组合框用以展示的数据的字段名(如果 mode = 'remote' 则默认为 undefined, 如果 mode = 'local' 则默认为 'text')
     */
    displayField: undefined,
    /**
     * @cfg {String} valueField The underlying data value name to bind to this CombBox (defaults to undefined if
     * mode = 'remote' or 'value' if mode = 'local'). Note: use of a valueField requires the user make a selection
     * in order for a value to be mapped.
     * 组合框用以取值的数据的字段名(如果 mode = 'remote' 则默认为 undefined, 如果 mode = 'local' 则默认为 'value')。
     */
    valueField: undefined,
    /**
     * @cfg {String} hiddenName 如果指定了, 则会动态生成一个以指定名称命名的隐藏域用来存放值数据(默认为)
     */
    hiddenName: undefined,
    /**
     * @cfg {String} listClass 下拉列表元素应用的 CSS 类(默认为 '')
     */
    listClass: '',
    /**
     * @cfg {String} selectedClass 下拉列表中选中项应用的 CSS 类(默认为 'x-combo-selected')
     */
    selectedClass: 'x-combo-selected',
    /**
     * @cfg {String} triggerClass An additional CSS class used to style the trigger button.  The trigger will always get the
     * class 'x-form-trigger' and triggerClass will be <b>appended</b> if specified (defaults to 'x-form-arrow-trigger'
     * which displays a downward arrow icon).
     * 触发器按钮使用的 CSS 类。触发器的类固定为 'x-form-trigger', 而如果指定了 triggerClass 属性的值则会被 <b>附加</b> 在其后。(默认为 'x-form-arrow-trigger' 用来显示一个向下的箭头图标)
     */
    triggerClass : 'x-form-arrow-trigger',
    /**
     * @cfg {Boolean/String} shadow 值为 true 或者 "sides" 为默认效果, "frame" 为四方向阴影, "drop" 为右下角方向阴影
     */
    shadow:'sides',
    /**
     * @cfg {String} listAlign 一个有效的方位锚点值。 点击 {@link Ext.Element#alignTo} 查看支持的方向锚点(默认为 'tl-bl')
     */
    listAlign: 'tl-bl?',
    /**
     * @cfg {Number} maxHeight 以象素表示的下拉列表最大高度(默认为 300)
     */
    maxHeight: 300,
    /**
     * @cfg {String} triggerAction 触发器被激活时执行的动作。使用 'all' 来运行由 allQuery 属性指定的查询(默认为 'query')
     */
    triggerAction: 'query',
    /**
     * @cfg {Number} minChars 在 autocomplete 和 typeahead 被激活之前用户必须输入的字符数(默认为 4, 如果 editable = false 则此属性无效)
     */
    minChars : 4,
    /**
     * @cfg {Boolean} typeAhead 值为 true 时在经过指定延迟(typeAheadDelay)后弹出并自动选择输入的文本, 如果该文本与已知的值相匹配(默认为 false)
     */
    typeAhead: false,
    /**
     * @cfg {Number} queryDelay 以毫秒表示的从开始输入到发出查询语句过滤下拉列表的时长(如果 mode = 'remote' 则默认为 500, 如果 mode = 'local' 则默认为 10)
     */
    queryDelay: 500,
    /**
     * @cfg {Number} pageSize 如果值大于 0 ,则在下拉列表的底部显示一个分页工具条, 并且在执行过滤查询时将传递起始页和限制参数。只在 mode = 'remote' 时生效(默认为 0)
     */
    pageSize: 0,
    /**
     * @cfg {Boolean} selectOnFocus 值为 true 时选择任何字段内已有文本时立即取得焦点。只在 editable = true 时生效(默认为 false)
     */
    selectOnFocus:false,
    /**
     * @cfg {String} queryParam 供 querystring 查询时传递的名字(默认为 'query')
     */
    queryParam: 'query',
    /**
     * @cfg {String} loadingText 当读取数据时在下拉列表显示的文本。仅当 mode = 'remote' 时可用(默认为 'Loading...')
     */
    loadingText: 'Loading...',
    /**
     * @cfg {Boolean} resizable 值为 true 时则在下拉列表的底部添加缩放柄(默认为 false)
     */
    resizable: false,
    /**
     * @cfg {Number} handleHeight 以像素表示的下拉列表的缩放柄的高度, 仅当 resizable = true 时可用(默认为 8)
     */
    handleHeight : 8,
    /**
     * @cfg {Boolean} editable 值为 false 时防止用户直接在输入框内输入文本, 就像传统的选择框一样(默认为 true)
     */
    editable: true,
    /**
     * @cfg {String} allQuery 发送到服务器用以返回不经过滤的所有记录的文本(默认为 ''
     */
    allQuery: '',
    /**
     * @cfg {String} mode 如果 ComboBox 读取本地数据则将值设为 'local' (默认为 'remote' 表示从服务器读取数据)
     */
    mode: 'remote',
    /**
     * @cfg {Number} minListWidth 以像素表示的下拉列表的最小宽度(默认为 70, 如果 listWidth 的指定值更高则自动忽略该参数)
     */
    minListWidth : 70,
    /**
     * @cfg {Boolean} forceSelection 值为 true 时将限定选中的值为列表中的值, 值为 false 则允许用户将任意文本设置到字段(默认为 false)
     */
    forceSelection:false,
    /**
     * @cfg {Number} typeAheadDelay 以毫秒表示的 typeahead 文本延迟显示量, 仅当 typeAhead = true 时生效(默认为 250)
     */
    typeAheadDelay : 250,
    /**
     * @cfg {String} valueNotFoundText 当使用 name/value 组合框时, 如果调用 setValue 方法时传递的值没有在仓库中找到, 且定义了 valueNotFoundText 则在字段中显示该值(默认为 undefined)
     */
    valueNotFoundText : undefined,

    // private
    onRender : function(ct, position){
        Ext.form.ComboBox.superclass.onRender.call(this, ct, position);
        if(this.hiddenName){
            this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName, id:  (this.hiddenId||this.hiddenName)},
                    'before', true);
            this.hiddenField.value =
                this.hiddenValue !== undefined ? this.hiddenValue :
                this.value !== undefined ? this.value : '';

            // prevent input submission
            this.el.dom.removeAttribute('name');
        }
        if(Ext.isGecko){
            this.el.dom.setAttribute('autocomplete', 'off');
        }

        var cls = 'x-combo-list';

        this.list = new Ext.Layer({
            shadow: this.shadow, cls: [cls, this.listClass].join(' '), constrain:false
        });

        var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
        this.list.setWidth(lw);
        this.list.swallowEvent('mousewheel');
        this.assetHeight = 0;

        if(this.title){
            this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
            this.assetHeight += this.header.getHeight();
        }

        this.innerList = this.list.createChild({cls:cls+'-inner'});
        this.innerList.on('mouseover', this.onViewOver, this);
        this.innerList.on('mousemove', this.onViewMove, this);
        this.innerList.setWidth(lw - this.list.getFrameWidth('lr'))

        if(this.pageSize){
            this.footer = this.list.createChild({cls:cls+'-ft'});
            this.pageTb = new Ext.PagingToolbar(this.footer, this.store,
                    {pageSize: this.pageSize});
            this.assetHeight += this.footer.getHeight();
        }

        if(!this.tpl){
            this.tpl = '<div class="'+cls+'-item">{' + this.displayField + '}</div>';
        }

        this.view = new Ext.View(this.innerList, this.tpl, {
            singleSelect:true, store: this.store, selectedClass: this.selectedClass
        });

        this.view.on('click', this.onViewClick, this);

        this.store.on('beforeload', this.onBeforeLoad, this);
        this.store.on('load', this.onLoad, this);
        this.store.on('loadexception', this.collapse, this);

        if(this.resizable){
            this.resizer = new Ext.Resizable(this.list,  {
               pinned:true, handles:'se'
            });
            this.resizer.on('resize', function(r, w, h){
                this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                this.listWidth = w;
                this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                this.restrictHeight();
            }, this);
            this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
        }
        if(!this.editable){
            this.editable = true;
            this.setEditable(false);
        }
    },

    // private
    initEvents : function(){
        Ext.form.ComboBox.superclass.initEvents.call(this);

        this.keyNav = new Ext.KeyNav(this.el, {
            "up" : function(e){
                this.inKeyMode = true;
                this.selectPrev();
            },

            "down" : function(e){
                if(!this.isExpanded()){
                    this.onTriggerClick();
                }else{
                    this.inKeyMode = true;
                    this.selectNext();
                }
            },

            "enter" : function(e){
                this.onViewClick();
                //return true;
            },

            "esc" : function(e){
                this.collapse();
            },

            "tab" : function(e){
                this.onViewClick(false);
                return true;
            },

            scope : this,

            doRelay : function(foo, bar, hname){
                if(hname == 'down' || this.scope.isExpanded()){
                   return Ext.KeyNav.prototype.doRelay.apply(this, arguments);
                }
                return true;
            },

            forceKeyDown: true
        });
        this.queryDelay = Math.max(this.queryDelay || 10,
                this.mode == 'local' ? 10 : 250);
        this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
        if(this.typeAhead){
            this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this);
        }
        if(this.editable !== false){
            this.el.on("keyup", this.onKeyUp, this);
        }
        if(this.forceSelection){
            this.on('blur', this.doForce, this);
        }
    },

    onDestroy : function(){
        if(this.view){
            this.view.setStore(null);
            this.view.el.removeAllListeners();
            this.view.el.remove();
            this.view.purgeListeners();
        }
        if(this.list){
            this.list.destroy();
        }
        if(this.store){
            this.store.un('beforeload', this.onBeforeLoad, this);
            this.store.un('load', this.onLoad, this);
            this.store.un('loadexception', this.collapse, this);
        }
        Ext.form.ComboBox.superclass.onDestroy.call(this);
    },

    // private
    fireKey : function(e){
        if(e.isNavKeyPress() && !this.list.isVisible()){
            this.fireEvent("specialkey", this, e);
        }
    },

    // private
    onResize: function(w, h){
        Ext.form.ComboBox.superclass.onResize.apply(this, arguments);
        if(this.list && this.listWidth === undefined){
            var lw = Math.max(w, this.minListWidth);
            this.list.setWidth(lw);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
        }
    },

    /**
     * Allow or prevent the user from directly editing the field text.  If false is passed,
     * the user will only be able to select from the items defined in the dropdown list.  This method
     * is the runtime equivalent of setting the 'editable' config option at config time.
     * 允许或防止用户直接编辑字段文本。如果传递值为 false, 用户将只能选择下拉列表中已经定义的选项。此方法相当于在配置时设置 'editable' 属性。
     * @param {Boolean} value 值为 true 时允许用户直接编辑字段文本
     */
    setEditable : function(value){
        if(value == this.editable){
            return;
        }
        this.editable = value;
        if(!value){
            this.el.dom.setAttribute('readOnly', true);
            this.el.on('mousedown', this.onTriggerClick,  this);
            this.el.addClass('x-combo-noedit');
        }else{
            this.el.dom.setAttribute('readOnly', false);
            this.el.un('mousedown', this.onTriggerClick,  this);
            this.el.removeClass('x-combo-noedit');
        }
    },

    // private
    onBeforeLoad : function(){
        if(!this.hasFocus){
            return;
        }
        this.innerList.update(this.loadingText ?
               '<div class="loading-indicator">'+this.loadingText+'</div>' : '');
        this.restrictHeight();
        this.selectedIndex = -1;
    },

    // private
    onLoad : function(){
        if(!this.hasFocus){
            return;
        }
        if(this.store.getCount() > 0){
            this.expand();
            this.restrictHeight();
            if(this.lastQuery == this.allQuery){
                if(this.editable){
                    this.el.dom.select();
                }
                if(!this.selectByValue(this.value, true)){
                    this.select(0, true);
                }
            }else{
                this.selectNext();
                if(this.typeAhead && this.lastKey != Ext.EventObject.BACKSPACE && this.lastKey != Ext.EventObject.DELETE){
                    this.taTask.delay(this.typeAheadDelay);
                }
            }
        }else{
            this.onEmptyResults();
        }
        //this.el.focus();
    },

    // private
    onTypeAhead : function(){
        if(this.store.getCount() > 0){
            var r = this.store.getAt(0);
            var newValue = r.data[this.displayField];
            var len = newValue.length;
            var selStart = this.getRawValue().length;
            if(selStart != len){
                this.setRawValue(newValue);
                this.selectText(selStart, newValue.length);
            }
        }
    },

    // private
    onSelect : function(record, index){
        if(this.fireEvent('beforeselect', this, record, index) !== false){
            this.setValue(record.data[this.valueField || this.displayField]);
            this.collapse();
            this.fireEvent('select', this, record, index);
        }
    },

    /**
     * Returns the currently selected field value or empty string if no value is set.
     * 返回当前选定项的值或在没有选定项时返回空字串
     * @return {String} value 选中的值
     */
    getValue : function(){
        if(this.valueField){
            return typeof this.value != 'undefined' ? this.value : '';
        }else{
            return Ext.form.ComboBox.superclass.getValue.call(this);
        }
    },

    /**
     * Clears any text/value currently set in the field
     * 清除所有当前字段中设定的 text/value
     */
    clearValue : function(){
        if(this.hiddenField){
            this.hiddenField.value = '';
        }
        this.setRawValue('');
        this.lastSelectionText = '';
        this.applyEmptyText();
    },

    /**
     * Sets the specified value into the field.  If the value finds a match, the corresponding record text
     * will be displayed in the field.  If the value does not match the data value of an existing item,
     * and the valueNotFoundText config option is defined, it will be displayed as the default field text.
     * Otherwise the field will be blank (although the value will still be set).
     * 将指定的值设定到字段。如果找到匹配的值, 字段中将显示相应的记录。如果在已有的选项中没有找到匹配的值, 则显示 valueNotFoundText 属性指定的文本。其他情况下显示为空(但仍然将字段的值设置为指定值)。
     * @param {String} value 匹配的值
     */
    setValue : function(v){
        var text = v;
        if(this.valueField){
            var r = this.findRecord(this.valueField, v);
            if(r){
                text = r.data[this.displayField];
            }else if(this.valueNotFoundText !== undefined){
                text = this.valueNotFoundText;
            }
        }
        this.lastSelectionText = text;
        if(this.hiddenField){
            this.hiddenField.value = v;
        }
        Ext.form.ComboBox.superclass.setValue.call(this, text);
        this.value = v;
    },

    // private
    findRecord : function(prop, value){
        var record;
        if(this.store.getCount() > 0){
            this.store.each(function(r){
                if(r.data[prop] == value){
                    record = r;
                    return false;
                }
            });
        }
        return record;
    },

    // private
    onViewMove : function(e, t){
        this.inKeyMode = false;
    },

    // private
    onViewOver : function(e, t){
        if(this.inKeyMode){ // prevent key nav and mouse over conflicts
            return;
        }
        var item = this.view.findItemFromChild(t);
        if(item){
            var index = this.view.indexOf(item);
            this.select(index, false);
        }
    },

    // private
    onViewClick : function(doFocus){
        var index = this.view.getSelectedIndexes()[0];
        var r = this.store.getAt(index);
        if(r){
            this.onSelect(r, index);
        }
        if(doFocus !== false){
            this.el.focus();
        }
    },

    // private
    restrictHeight : function(){
        this.innerList.dom.style.height = '';
        var inner = this.innerList.dom;
        var h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight);
        this.innerList.setHeight(h < this.maxHeight ? 'auto' : this.maxHeight);
        this.list.beginUpdate();
        this.list.setHeight(this.innerList.getHeight()+this.list.getFrameWidth('tb')+(this.resizable?this.handleHeight:0)+this.assetHeight);
        this.list.alignTo(this.el, this.listAlign);
        this.list.endUpdate();
    },

    // private
    onEmptyResults : function(){
        this.collapse();
    },

    /**
     * 如果下拉列表已经展开则返回 true, 否则返回 false。
     */
    isExpanded : function(){
        return this.list.isVisible();
    },

    /**
     * 根据数据的值选择下拉列表中的选项。本函数不会触发 'select' 事件。使用此函数必须在数据已经被读取且列表已经展开, 否则请使用 setValue 方法。
     * @param {String} value 要选择的项的值
     * @param {Boolean} scrollIntoView 值为 false 时阻止下拉列表自动滚动到选中项位置(默认为 true)
     * @return {Boolean} 如果给定值在列表中则返回 true, 否则返回 false
     */
    selectByValue : function(v, scrollIntoView){
        if(v !== undefined && v !== null){
            var r = this.findRecord(this.valueField || this.displayField, v);
            if(r){
                this.select(this.store.indexOf(r), scrollIntoView);
                return true;
            }
        }
        return false;
    },

    /**
     * 根据列表的索引数选择下拉列表中的一项。本函数不会触发 'select' 事件。使用此函数必须在数据已经被读取且列表已经展开, 否则请使用 setValue 方法。
     * @param {Number} index 选中项在列表中以 0 开始的索引数
     * @param {Boolean} scrollIntoView 值为 false 时阻止下拉列表自动滚动到选中项位置(默认为 true)
     */
    select : function(index, scrollIntoView){
        this.selectedIndex = index;
        this.view.select(index);
        if(scrollIntoView !== false){
            var el = this.view.getNode(index);
            if(el){
                this.innerList.scrollChildIntoView(el, false);
            }
        }
    },

    // private
    selectNext : function(){
        var ct = this.store.getCount();
        if(ct > 0){
            if(this.selectedIndex == -1){
                this.select(0);
            }else if(this.selectedIndex < ct-1){
                this.select(this.selectedIndex+1);
            }
        }
    },

    // private
    selectPrev : function(){
        var ct = this.store.getCount();
        if(ct > 0){
            if(this.selectedIndex == -1){
                this.select(0);
            }else if(this.selectedIndex != 0){
                this.select(this.selectedIndex-1);
            }
        }
    },

    // private
    onKeyUp : function(e){
        if(this.editable !== false && !e.isSpecialKey()){
            this.lastKey = e.getKey();
            this.dqTask.delay(this.queryDelay);
        }
    },

    // private
    validateBlur : function(){
        return !this.list || !this.list.isVisible();   
    },

    // private
    initQuery : function(){
        this.doQuery(this.getRawValue());
    },

    // private
    doForce : function(){
        if(this.el.dom.value.length > 0){
            this.el.dom.value =
                this.lastSelectionText === undefined ? '' : this.lastSelectionText;
            this.applyEmptyText();
        }
    },

    /**
     * 执行一个查询语句用以过滤下拉列表。在查询之前触发 'beforequery' 事件, 以便可以在需要的时候取消查询动作。
     * @param {String} query 要执行的查询语句
     * @param {Boolean} forceAll 值为 true 时强制执行查询即使当前输入的字符少于 minChars 设置项指定的值。同时还会清除当前数据仓库中保存的前一次结果(默认为 false)
     */
    doQuery : function(q, forceAll){
        if(q === undefined || q === null){
            q = '';
        }
        var qe = {
            query: q,
            forceAll: forceAll,
            combo: this,
            cancel:false
        };
        if(this.fireEvent('beforequery', qe)===false || qe.cancel){
            return false;
        }
        q = qe.query;
        forceAll = qe.forceAll;
        if(forceAll === true || (q.length >= this.minChars)){
            if(this.lastQuery != q){
                this.lastQuery = q;
                if(this.mode == 'local'){
                    this.selectedIndex = -1;
                    if(forceAll){
                        this.store.clearFilter();
                    }else{
                        this.store.filter(this.displayField, q);
                    }
                    this.onLoad();
                }else{
                    this.store.baseParams[this.queryParam] = q;
                    this.store.load({
                        params: this.getParams(q)
                    });
                    this.expand();
                }
            }else{
                this.selectedIndex = -1;
                this.onLoad();   
            }
        }
    },

    // private
    getParams : function(q){
        var p = {};
        //p[this.queryParam] = q;
        if(this.pageSize){
            p.start = 0;
            p.limit = this.pageSize;
        }
        return p;
    },

    /**
     * 如果下拉列表当前是展开状态则隐藏它。并触发 'collapse' 事件。
     */
    collapse : function(){
        if(!this.isExpanded()){
            return;
        }
        this.list.hide();
        Ext.get(document).un('mousedown', this.collapseIf, this);
        Ext.get(document).un('mousewheel', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },

    // private
    collapseIf : function(e){
        if(!e.within(this.wrap) && !e.within(this.list)){
            this.collapse();
        }
    },

    /**
     * 如果下拉列表当前是隐藏状态则展开它。并触发 'expand' 事件。
     */
    expand : function(){
        if(this.isExpanded() || !this.hasFocus){
            return;
        }
        this.list.alignTo(this.el, this.listAlign);
        this.list.show();
        Ext.get(document).on('mousedown', this.collapseIf, this);
        Ext.get(document).on('mousewheel', this.collapseIf, this);
        this.fireEvent('expand', this);
    },

    // private
    // Implements the default empty TriggerField.onTriggerClick function
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.isExpanded()){
            this.collapse();
            this.el.focus();
        }else {
            this.hasFocus = true;
            if(this.triggerAction == 'all') {
                this.doQuery(this.allQuery, true);
            } else {
                this.doQuery(this.getRawValue());
            }
            this.el.focus();
        }
    }

    /** @cfg {Boolean} grow @hide */
    /** @cfg {Number} growMin @hide */
    /** @cfg {Number} growMax @hide */
    /**
     * @hide
     * @method autoSize
     */
});