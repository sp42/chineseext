/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.DataView
 * @extends Ext.BoxComponent
 * 能够为自己设计模板和特定格式而提供的一种数据显示机制。
 * DataView采用{@link Ext.XTemplate}为其模板处理的机制，并依靠{@link Ext.data.Store}来绑定数据，这样的话store中数据发生变化时便会自动更新前台。
 * DataView亦提供许多针对对象项（item）的内建事件，如单击、双击、mouseover、mouseout等等，还包括一个内建的选区模型（selection model）。
 * <b>要实现以上这些功能，必须要为DataView对象设置一个itemSelector协同工作。</b><br />
 * A mechanism for displaying data using custom layout templates and formatting. DataView uses an {@link Ext.XTemplate}
 * as its internal templating mechanism, and is bound to an {@link Ext.data.Store}
 * so that as the data in the store changes the view is automatically updated to reflect the changes.  The view also
 * provides built-in behavior for many common events that can occur for its contained items including click, doubleclick,
 * mouseover, mouseout, etc. as well as a built-in selection model. <b>In order to use these features, an {@link #itemSelector}
 * config must be provided for the DataView to determine what nodes it will be working with.</b>
 * <p>
 * 下面给出的例子是已将DataView绑定到一个{@link Ext.data.Store}对象并在一个上{@link Ext.Panel}渲染。<br />
 * The example below binds a DataView to a {@link Ext.data.Store} and renders it into an {@link Ext.Panel}.</p>
 * <pre><code>
var store = new Ext.data.JsonStore({
    url: 'get-images.php',
    root: 'images',
    fields: [
        'name', 'url',
        {name:'size', type: 'float'},
        {name:'lastmod', type:'date', dateFormat:'timestamp'}
    ]
});
store.load();

var tpl = new Ext.XTemplate(
    '&lt;tpl for="."&gt;',
        '&lt;div class="thumb-wrap" id="{name}"&gt;',
        '&lt;div class="thumb"&gt;&lt;img src="{url}" title="{name}"&gt;&lt;/div&gt;',
        '&lt;span class="x-editable"&gt;{shortName}&lt;/span&gt;&lt;/div&gt;',
    '&lt;/tpl&gt;',
    '&lt;div class="x-clear"&gt;&lt;/div&gt;'
);

var panel = new Ext.Panel({
    id:'images-view',
    frame:true,
    width:535,
    autoHeight:true,
    collapsible:true,
    layout:'fit',
    title:'Simple DataView',

    items: new Ext.DataView({
        store: store,
        tpl: tpl,
        autoHeight:true,
        multiSelect: true,
        overClass:'x-view-over',
        itemSelector:'div.thumb-wrap',
        emptyText: 'No images to display'
    })
});
panel.render(document.body);
</code></pre>
 * @constructor 创建一个新的DataView对象。Create a new DataView
 * @param {Object} config 配置对象。The config object
 */
Ext.DataView = Ext.extend(Ext.BoxComponent, {
    /**
     * @cfg {String/Array} tpl 构成这个DataView的HTML片断，或片断的数组，其格式应如{@link Ext.XTemplate}构造器的一样。
     * The HTML fragment or an array of fragments that will make up the template used by this DataView.  This should
     * be specified in the same format expected by the constructor of {@link Ext.XTemplate}.
     */
    /**
     * @cfg {Ext.data.Store} store 此DataView所绑定的{@link Ext.data.Store}。
     * The {@link Ext.data.Store} to bind this DataView to.
     */
    /**
     * @cfg {String} itemSelector <b>此项是必须的设置</b>。任何符号{@link Ext.DomQuery}格式的CSS选择符（如div.some-class or span:first-child），以确定DataView所使用的节点是哪一种元素。
     * This is a required setting</b>. A simple CSS selector (e.g. div.some-class or span:first-child) that will be 
     * used to determine what nodes this DataView will be working with.
     */
    /**
     * @cfg {Boolean} multiSelect
     * True表示为允许同时可以选取多个对象项，false表示只能同时选择单个对象项或根本没有选区，取决于{@link #singleSelect}的值（默认为false）。
     * True to allow selection of more than one item at a time, false to allow selection of only a single item
     * at a time or no selection at all, depending on the value of {@link #singleSelect} (defaults to false).
     */
    /**
     * @cfg {Boolean} singleSelect
     * True表示为同一时间只允许选取一个对象项，false表示没有选区也是可以的（默认为false）。
     * 注意当{@link #multiSelect} = true时，该项的设置会被忽略。
     * True to allow selection of exactly one item at a time, false to allow no selection at all (defaults to false).
     * Note that if {@link #multiSelect} = true, this value will be ignored.
     */
    /**
     * @cfg {Boolean} simpleSelect
     * True表示为不需要用户按下Shift或Ctrl键就可以实现多选，false表示用户一定要用户按下Shift或Ctrl键才可以多选对象项（默认为false）。
     * True to enable multiselection by clicking on multiple items without requiring the user to hold Shift or Ctrl,
     * false to force the user to hold Ctrl or Shift to select more than on item (defaults to false).
     */
    /**
     * @cfg {String} overClass 视图中每一项mouseover事件触发时所应用到的CSS样式类（默认为undefined）。
     * A CSS class to apply to each item in the view on mouseover (defaults to undefined).
     */
    /**
     * @cfg {String} loadingText 当数据加载进行时显示的字符串（默认为undefined）。 
     * A string to display during data load operations (defaults to undefined).  If specified, this text will be
     * displayed in a loading div and the view's contents will be cleared while loading, otherwise the view's
     * contents will continue to display normally until the new data is loaded and the contents are replaced.
     */
    /**
     * @cfg {String} selectedClass 视图中每个选中项所应用到的CSS样式类（默认为'x-view-selected'）。
     * A CSS class to apply to each selected item in the view (defaults to 'x-view-selected').
     */
    selectedClass : "x-view-selected",
    /**
     * @cfg {String} emptyText
     * 没有数据显示时，向用户提示的信息（默认为''）。
     * The text to display in the view when there is no data to display (defaults to '').
     */
    emptyText : "",

    /**
     * @cfg {Boolean} deferEmptyText True表示为emptyText推迟到Store首次加载后才生效。
     * True to defer emptyText being applied until the store's first load
     */
    deferEmptyText: true,
    /**
     * @cfg {Boolean} trackOver True表示为激活mouseenter与mouseleave事件。
     * True to enable mouseenter and mouseleave events
     */
    trackOver: false,

    //private
    last: false,

    // private
    initComponent : function(){
        Ext.DataView.superclass.initComponent.call(this);
        if(typeof this.tpl == "string" || Ext.isArray(this.tpl)){
            this.tpl = new Ext.XTemplate(this.tpl);
        }

        this.addEvents(
            /**
             * @event beforeclick
             * 单击执行之前触发，返回 false 则取消默认的动作。
             * Fires before a click is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Number} index 目标节点的索引。The index of the target node
             * @param {HTMLElement} node 目标节点。The target node
             * @param {Ext.EventObject} e 原始事件对象。The raw event object
             */
            "beforeclick",
            /**
             * @event click
             * 当模板节点单击时触发事件，如返回 false 则取消默认的动作。
             * Fires when a template node is clicked.
             * @param {Ext.DataView} this
             * @param {Number} index 目标节点的索引。The index of the target node
             * @param {HTMLElement} node 目标节点。The target node
             * @param {Ext.EventObject} e 原始事件对象。The raw event object
             */
            "click",
            /**
             * @event mouseenter
             * 当鼠标进入模板节点上触发。必须设置好trackOver:true或overCls中的一项。
             * Fires when the mouse enters a template node. trackOver:true or an overCls must be set to enable this event.
             * @param {Ext.DataView} this
             * @param {Number} index 目标节点的索引。The index of the target node
             * @param {HTMLElement} node 目标节点。The target node
             * @param {Ext.EventObject} e 原始事件对象。The raw event object
             */
            "mouseenter",
            /**
             * @event mouseleave
             * 当鼠标离开模板节点上触发。必须设置好trackOver:true或overCls中的一项。
             * Fires when the mouse leaves a template node. trackOver:true or an overCls must be set to enable this event.
             * @param {Ext.DataView} this
             * @param {Number} index 目标节点的索引。The index of the target node
             * @param {HTMLElement} node 目标节点。The target node
             * @param {Ext.EventObject} e 原始事件对象。The raw event object
             */
            "mouseleave",
            /**
             * @event containerclick
             * 当点击发生时但又不在模板节点上发生时触发。
             * Fires when a click occurs and it is not on a template node.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e 原始事件对象。The raw event object
             */
            "containerclick",
            /**
             * @event dblclick
             * 当模板节点双击时触发事件。
             * Fires when a template node is double clicked.
             * @param {Ext.DataView} this
             * @param {Number} index 目标节点的索引。The index of the target node
             * @param {HTMLElement} node 目标节点。The target node
             * @param {Ext.EventObject} e 原始事件对象。The raw event object
             */
            "dblclick",
            /**
             * @event contextmenu
             * 当模板节右击时触发事件。
             * Fires when a template node is right clicked.
             * @param {Ext.DataView} this
             * @param {Number} index 目标节点的索引。The index of the target node
             * @param {HTMLElement} node 目标节点。The target node
             * @param {Ext.EventObject} e 原始事件对象。The raw event object
             */
            "contextmenu",
            /**
             * @event containercontextmenu
             * 在一个非模板节点区域上右键按下时触发。
             * Fires when a right click occurs that is not on a template node.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e 原始事件对象。The raw event object
             */
            "containercontextmenu",
            /**
             * @event selectionchange
             * 当选取改变时触发。
             * Fires when the selected nodes change.
             * @param {Ext.DataView} this
             * @param {Array} selections 已选取节点所组成的数组。Array of the selected nodes
             */
            "selectionchange",

            /**
             * @event beforeselect
             * 选取生成之前触发,如返回false,则选区不会生成。
             * Fires before a selection is made. If any handlers return false, the selection is cancelled.
             * @param {Ext.DataView} this
             * @param {HTMLElement} node 要选取的节点。The node to be selected
             * @param {Array} selections 当前已选取节点所组成的数组。Array of currently selected nodes
             */
            "beforeselect"
        );

        this.all = new Ext.CompositeElementLite();
        this.selected = new Ext.CompositeElementLite();
    },

    // private
    afterRender : function(){
        Ext.DataView.superclass.afterRender.call(this);

		this.mon(this.getTemplateTarget(), {
            "click": this.onClick,
            "dblclick": this.onDblClick,
            "contextmenu": this.onContextMenu,
            scope:this
        });

        if(this.overClass || this.trackOver){
            this.mon(this.getTemplateTarget(), {
                "mouseover": this.onMouseOver,
                "mouseout": this.onMouseOut,
                scope:this
            });
        }

        if(this.store){
            this.setStore(this.store, true);
        }
    },

    /**
     * 刷新视图。重新加载store的数据并重新渲染模板。
     * Refreshes the view by reloading the data from the store and re-rendering the template.
     */
    refresh : function(){
        this.clearSelections(false, true);
        var el = this.getTemplateTarget();
        el.update("");
        var records = this.store.getRange();
        if(records.length < 1){
            if(!this.deferEmptyText || this.hasSkippedEmptyText){
                el.update(this.emptyText);
            }
            this.all.clear();
        }else{
            this.tpl.overwrite(el, this.collectData(records, 0));
            this.all.fill(Ext.query(this.itemSelector, el.dom));
            this.updateIndexes(0);
        }
        this.hasSkippedEmptyText = true;
    },

    getTemplateTarget: function(){
        return this.el;
    },

    /**
     * 重写该函数，可对每个节点的数据进行格式化,再交给DataView的{@link #tpl template}模板进一步处理。
     * Function which can be overridden to provide custom formatting for each Record that is used by this
     * DataView's {@link #tpl template} to render each node.
     * @param {Array/Object} data 原始数据，是Data Model所绑定的视图的colData数组，或Updater数据对象绑定的JSON对象。
     * The raw data object that was used to create the Record.
     * @param {Number} recordIndex 将要参与进行渲染Record对象的索引，是数字。the index number of the Record being prepared for rendering.
     * @param {Record} record 将要参与进行渲染Record对象。The Record being prepared for rendering.
     * @return {Array/Object} 已格式化的数据，供{@link #tpl template}的overwrite()方法内置使用。既可以是数字式标记的数组（如{0}）或是一个对象（如{foo: 'bar'}）。
     * The formatted data in a format expected by the internal {@link #tpl template}'s overwrite() method.
     * (either an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'}))
     */
    prepareData : function(data){
        return data;
    },

    /**
     * <p>
     * 返回数据对象的函数，配合DataView的{@link #tpl template}来渲染整个DataView。你也可以重写这个函数。
     * Function which can be overridden which returns the data object passed to this
     * DataView's {@link #tpl template} to render the whole DataView.</p>
     * <p>
     * 这应该是由数据对象所组成的数组，
     * 所谓数据对象，就是利用这些数据，让其送入{@link Ext.XTemplate XTemplate}模板中迭代，
     * 解析其中的<tt>'&lt;tpl for="."&gt;'</tt>产生HTML片断。其中，可加入<i>named</i>的属性以表示不重复的数据，例如头部、总数等的地方。
     * This is usually an Array of data objects, each element of which is processed by an
     * {@link Ext.XTemplate XTemplate} which uses <tt>'&lt;tpl for="."&gt;'</tt> to iterate over its supplied
     * data object as an Array. However, <i>named</i> properties may be placed into the data object to
     * provide non-repeating data such as headings, totals etc.</p>
     * @param {Array} records 渲染到DataView的{@link Ext.data.Record}数组。An Array of {@link Ext.data.Record}s to be rendered into the DataView.
     * @return {Array} 数据对象数组，将由XTemplate循化处理。也可以携带<i>named</i>的属性。An Array of data objects to be processed by a repeating XTemplate. May also
     * contain <i>named</i> properties.
     */
    collectData : function(records, startIndex){
        var r = [];
        for(var i = 0, len = records.length; i < len; i++){
            r[r.length] = this.prepareData(records[i].data, startIndex+i, records[i]);
        }
        return r;
    },

    // private
    bufferRender : function(records){
        var div = document.createElement('div');
        this.tpl.overwrite(div, this.collectData(records));
        return Ext.query(this.itemSelector, div);
    },

    // private
    onUpdate : function(ds, record){
        var index = this.store.indexOf(record);
        var sel = this.isSelected(index);
        var original = this.all.elements[index];
        var node = this.bufferRender([record], index)[0];

        this.all.replaceElement(index, node, true);
        if(sel){
            this.selected.replaceElement(original, node);
            this.all.item(index).addClass(this.selectedClass);
        }
        this.updateIndexes(index, index);
    },

    // private
    onAdd : function(ds, records, index){
        if(this.all.getCount() == 0){
            this.refresh();
            return;
        }
        var nodes = this.bufferRender(records, index), n, a = this.all.elements;
        if(index < this.all.getCount()){
            n = this.all.item(index).insertSibling(nodes, 'before', true);
            a.splice.apply(a, [index, 0].concat(nodes));
        }else{
            n = this.all.last().insertSibling(nodes, 'after', true);
            a.push.apply(a, nodes);
        }
        this.updateIndexes(index);
    },

    // private
    onRemove : function(ds, record, index){
        this.deselect(index);
        this.all.removeElement(index, true);
        this.updateIndexes(index);
        if (this.store.getCount() == 0){
            this.refresh();
        }
    },

    /**
     * 刷新store里面各个节点的数据。
     * Refreshes an individual node's data from the store.
     * @param {Number} index store里面的数据索引。The item's data index in the store
     */
    refreshNode : function(index){
        this.onUpdate(this.store, this.store.getAt(index));
    },

    // private
    updateIndexes : function(startIndex, endIndex){
        var ns = this.all.elements;
        startIndex = startIndex || 0;
        endIndex = endIndex || ((endIndex === 0) ? 0 : (ns.length - 1));
        for(var i = startIndex; i <= endIndex; i++){
            ns[i].viewIndex = i;
        }
    },
    
    /**
     * 刷新不同的节点的数据（来自store）。
     * Returns the store associated with this DataView.
     * @return {Ext.data.Store} store中的数据的索引。
     */
    getStore : function(){
        return this.store;
    },

    /**
     * 改变在使用的Data Store并刷新view。
     * Changes the data store bound to this view and refreshes it.
     * @param {Store} store 绑定这个view的store对象。The store to bind to this view
     */
    setStore : function(store, initial){
        if(!initial && this.store){
            this.store.un("beforeload", this.onBeforeLoad, this);
            this.store.un("datachanged", this.refresh, this);
            this.store.un("add", this.onAdd, this);
            this.store.un("remove", this.onRemove, this);
            this.store.un("update", this.onUpdate, this);
            this.store.un("clear", this.refresh, this);
        }
        if(store){
            store = Ext.StoreMgr.lookup(store);
            store.on("beforeload", this.onBeforeLoad, this);
            store.on("datachanged", this.refresh, this);
            store.on("add", this.onAdd, this);
            store.on("remove", this.onRemove, this);
            store.on("update", this.onUpdate, this);
            store.on("clear", this.refresh, this);
        }
        this.store = store;
        if(store){
            this.refresh();
        }
    },

    /**
     * 传入一个节点(node)的参数，返回该属于模板的节点，返回null则代表它不属于模板的任何一个节点。
     * Returns the template node the passed child belongs to, or null if it doesn't belong to one.
     * @param {HTMLElement} node
     * @return {HTMLElement} 模板节点。The template node
     */
    findItemFromChild : function(node){
        return Ext.fly(node).findParent(this.itemSelector, this.getTemplateTarget());
    },

    // private
    onClick : function(e){
        var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
        if(item){
            var index = this.indexOf(item);
            if(this.onItemClick(item, index, e) !== false){
                this.fireEvent("click", this, index, item, e);
            }
        }else{
            if(this.fireEvent("containerclick", this, e) !== false){
                this.onContainerClick(e);
            }
        }
    },

    onContainerClick : function(e){
        this.clearSelections();
    },

    // private
    onContextMenu : function(e){
        var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
        if(item){
            this.fireEvent("contextmenu", this, this.indexOf(item), item, e);
        }else{
            this.fireEvent("containercontextmenu", this, e)
        }
    },

    // private
    onDblClick : function(e){
        var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
        if(item){
            this.fireEvent("dblclick", this, this.indexOf(item), item, e);
        }
    },

    // private
    onMouseOver : function(e){
        var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
        if(item && item !== this.lastItem){
            this.lastItem = item;
            Ext.fly(item).addClass(this.overClass);
            this.fireEvent("mouseenter", this, this.indexOf(item), item, e);
        }
    },

    // private
    onMouseOut : function(e){
        if(this.lastItem){
            if(!e.within(this.lastItem, true, true)){
                Ext.fly(this.lastItem).removeClass(this.overClass);
                this.fireEvent("mouseleave", this, this.indexOf(this.lastItem), this.lastItem, e);
                delete this.lastItem;
            }
        }
    },

    // private
    onItemClick : function(item, index, e){
        if(this.fireEvent("beforeclick", this, index, item, e) === false){
            return false;
        }
        if(this.multiSelect){
            this.doMultiSelection(item, index, e);
            e.preventDefault();
        }else if(this.singleSelect){
            this.doSingleSelection(item, index, e);
            e.preventDefault();
        }
        return true;
    },

    // private
    doSingleSelection : function(item, index, e){
        if(e.ctrlKey && this.isSelected(index)){
            this.deselect(index);
        }else{
            this.select(index, false);
        }
    },

    // private
    doMultiSelection : function(item, index, e){
        if(e.shiftKey && this.last !== false){
            var last = this.last;
            this.selectRange(last, index, e.ctrlKey);
            this.last = last; // reset the last
        }else{
            if((e.ctrlKey||this.simpleSelect) && this.isSelected(index)){
                this.deselect(index);
            }else{
                this.select(index, e.ctrlKey || e.shiftKey || this.simpleSelect);
            }
        }
    },

    /**
     * 返回选中节点的数量。
     * Gets the number of selected nodes.
     * @return {Number} 节点数量。The node count
     */
    getSelectionCount : function(){
        return this.selected.getCount()
    },

    /**
     * 返回当前选中的节点。
     * Gets the currently selected nodes.
     * @return {Array} 数组。An array of HTMLElements
     */
    getSelectedNodes : function(){
        return this.selected.elements;
    },

    /**
     * 返回选中的节点的索引。
     * Gets the indexes of the selected nodes.
     * @return {Array} 数字索引的数组。An array of numeric indexes
     */
    getSelectedIndexes : function(){
        var indexes = [], s = this.selected.elements;
        for(var i = 0, len = s.length; i < len; i++){
            indexes.push(s[i].viewIndex);
        }
        return indexes;
    },

    /**
     * 返回所选记录组成的数组。
     * Gets an array of the selected records
     * @return {Array} {@link Ext.data.Record}对象数组。An array of {@link Ext.data.Record} objects
     */
    getSelectedRecords : function(){
        var r = [], s = this.selected.elements;
        for(var i = 0, len = s.length; i < len; i++){
            r[r.length] = this.store.getAt(s[i].viewIndex);
        }
        return r;
    },

    /**
     * 从一个节点数组中返回记录节点。
     * Gets an array of the records from an array of nodes
     * @param {Array} nodes 参与运算的节点。The nodes to evaluate
     * @return {Array}  {@link Ext.data.Record}记录对象的数组。The {@link Ext.data.Record} objects
     */
    getRecords : function(nodes){
        var r = [], s = nodes;
        for(var i = 0, len = s.length; i < len; i++){
            r[r.length] = this.store.getAt(s[i].viewIndex);
        }
        return r;
    },

    /**
     * 返回节点的记录。
     * Gets a record from a node
     * @param {HTMLElement} node 涉及的节点。The node to evaluate
     * @return {Record} {@link Ext.data.Record}记录对象的数组。The {@link Ext.data.Record} object
     */
    getRecord : function(node){
        return this.store.getAt(node.viewIndex);
    },

    /**
     * 清除所有选区。
     * Clears all selections.
     * @param {Boolean} suppressEvent （可选的）True跃过触发selectionchange的事件。(optional)True to skip firing of the selectionchange event
     */
    clearSelections : function(suppressEvent, skipUpdate){
        if((this.multiSelect || this.singleSelect) && this.selected.getCount() > 0){
            if(!skipUpdate){
                this.selected.removeClass(this.selectedClass);
            }
            this.selected.clear();
            this.last = false;
            if(!suppressEvent){
                this.fireEvent("selectionchange", this, this.selected.elements);
            }
        }
    },

    /**
     * 传入一个节点的参数，如果是属于已选取的话便返回true否则返回false。
     * Returns true if the passed node is selected, else false.
     * @param {HTMLElement/Number} node 节点或节点索引。The node or node index to check
     * @return {Boolean} true表示选中否则返回false。True if selected, else false
     */
    isSelected : function(node){
        return this.selected.contains(this.getNode(node));
    },

    /**
     * 反选节点
     * Deselects a node。
     * @param {HTMLElement/Number} node 反选的节点。The node to deselect
     */
    deselect : function(node){
        if(this.isSelected(node)){
            node = this.getNode(node);
            this.selected.removeElement(node);
            if(this.last == node.viewIndex){
                this.last = false;
            }
            Ext.fly(node).removeClass(this.selectedClass);
            this.fireEvent("selectionchange", this, this.selected.elements);
        }
    },

    /**
     * 选取节点。
     * Selects a set of nodes.
     * @param {Array/HTMLElement/String/Number} nodeInfo HTMLElement类型的模板节点，模板节点的索引或是模板节点的ID。
     * An HTMLElement template node, index of a template node, id of a template node or an array of any of those to select
     * @param {Boolean} keepExisting (可选项)true代表保留当前选区 (optional)true to keep existing selections
     * @param {Boolean} suppressEvent (可选项)true表示为跳过所有selectionchange事件。(optional)true to skip firing of the selectionchange vent
     */
    select : function(nodeInfo, keepExisting, suppressEvent){
        if(Ext.isArray(nodeInfo)){
            if(!keepExisting){
                this.clearSelections(true);
            }
            for(var i = 0, len = nodeInfo.length; i < len; i++){
                this.select(nodeInfo[i], true, true);
            }
            if(!suppressEvent){
                this.fireEvent("selectionchange", this, this.selected.elements);
            }
        } else{
            var node = this.getNode(nodeInfo);
            if(!keepExisting){
                this.clearSelections(true);
            }
            if(node && !this.isSelected(node)){
                if(this.fireEvent("beforeselect", this, node, this.selected.elements) !== false){
                    Ext.fly(node).addClass(this.selectedClass);
                    this.selected.add(node);
                    this.last = node.viewIndex;
                    if(!suppressEvent){
                        this.fireEvent("selectionchange", this, this.selected.elements);
                    }
                }
            }
        }
    },

    /**
     * 选取某段范围的节点。在start与end之间范围内的节点都会被选取。
     * Selects a range of nodes. All nodes between start and end are selected.
     * @param {Number} start 索引头，在范围中第一个节点的索引。The index of the first node in the range
     * @param {Number} end 索引尾，在范围中最后一个节点的索引。The index of the last node in the range
     * @param {Boolean} keepExisting （可选项）true代表保留当前选区。(optional) True to retain existing selections
     */
    selectRange : function(start, end, keepExisting){
        if(!keepExisting){
            this.clearSelections(true);
        }
        this.select(this.getNodes(start, end), true);
    },

    /**
     * 获取多个模板节点。
     * Gets a template node.
     * @param {HTMLElement/String/Number} nodeInfo HTMLElement类型的模板节点，模板节点的索引或是模板节点的ID。
     * An HTMLElement template node, index of a template node or the id of a template node
     * @return {HTMLElement} 若找不到返回null。The node or null if it wasn't found
     */
    getNode : function(nodeInfo){
        if(typeof nodeInfo == "string"){
            return document.getElementById(nodeInfo);
        }else if(typeof nodeInfo == "number"){
            return this.all.elements[nodeInfo];
        }
        return nodeInfo;
    },

    /**
     * 获取某个范围的模板节点。
     * Gets a range nodes.
     * @param {Number} start （可选的）索引头，在范围中第一个节点的索引。(optional) The index of the first node in the range
     * @param {Number} end （可选的）索引尾，在范围中最后一个节点的索引。 (optional) The index of the last node in the range
     * @return {Array} 节点数组。An array of nodes
     */
    getNodes : function(start, end){
        var ns = this.all.elements;
        start = start || 0;
        end = typeof end == "undefined" ? Math.max(ns.length - 1, 0) : end;
        var nodes = [], i;
        if(start <= end){
            for(i = start; i <= end && ns[i]; i++){
                nodes.push(ns[i]);
            }
        } else{
            for(i = start; i >= end && ns[i]; i--){
                nodes.push(ns[i]);
            }
        }
        return nodes;
    },

    /**
     * 传入一个node作为参数，找到它的索引。
     * Finds the index of the passed node.
     * @param {HTMLElement/String/Number} nodeInfo HTMLElement类型的模板节点，模板节点的索引或是模板节点的ID。
     * An HTMLElement template node, index of a template node or the id of a template node
     * @return {Number} 节点索引或-1。The index of the node or -1
     */
    indexOf : function(node){
        node = this.getNode(node);
        if(typeof node.viewIndex == "number"){
            return node.viewIndex;
        }
        return this.all.indexOf(node);
    },

    // private
    onBeforeLoad : function(){
        if(this.loadingText){
            this.clearSelections(false, true);
            this.getTemplateTarget().update('<div class="loading-indicator">'+this.loadingText+'</div>');
            this.all.clear();
        }
    },

    onDestroy : function(){
        Ext.DataView.superclass.onDestroy.call(this);
        this.setStore(null);
    }
});

Ext.reg('dataview', Ext.DataView);