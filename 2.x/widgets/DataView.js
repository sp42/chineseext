/**
 * @class Ext.DataView
 * @extends Ext.BoxComponent
 * 能够为自己设计模板和特定格式而提供的一种数据显示机制。
 * DataView采用{@link Ext.XTemplate}为其模板处理的机制，并依靠{@link Ext.data.Store}来绑定数据，这样的话store中数据发生变化时便会自动更新前台。DataView亦提供许多针对对象项（item）的内建事件，如单击、双击、mouseover、mouseout等等，还包括一个内建的选区模型（selection model）。<b>要实现以上这些功能，必须要为DataView对象设置一个itemSelector协同工作。</b>
 * <p>下面给出的例子是已将DataView绑定到一个{@link Ext.data.Store}对象并在一个上{@link Ext.Panel}渲染。</p>
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
 * @constructor
 * 创建一个新的DataView对象
 * @param {Object} config 配置对象
 */
Ext.DataView = Ext.extend(Ext.BoxComponent, {
    /**
     * @cfg {String/Array} tpl
     * 构成这个DataView的HTML片断，或片断的数组，其格式应正如{@link Ext.XTemplate}构造器的一样。
     */
    /**
     * @cfg {Ext.data.Store} store
     * 此DataView所绑定的{@link Ext.data.Store}
     */
    /**
     * @cfg {String} itemSelector
     * <b>此项是必须的设置</b>。任何符号{@link Ext.DomQuery}格式的CSS选择符，以确定DataView所使用的节点是哪一种元素
     */
    /**
     * @cfg {Boolean} multiSelect
     * True表示为允许同时可以选取多个对象项，false表示只能同时选择单个对象项
     * at a time or no selection at all, depending on the value of {@link #singleSelect} (defaults to false).
     */
    /**
     * @cfg {Boolean} singleSelect
     * True表示为允许 to allow selection of exactly one item at a time, false to allow no selection at all ，false表示没有选区也是可以的（默认为false）。
     * 注意当{@link #multiSelect} = true时，该项会被忽略。
     */
    /**
     * @cfg {Boolean} simpleSelect
     * True表示为不需要用户按下Shift或Ctrl键就可以实现多选，false表示用户一定要用户按下Shift或Ctrl键才可以多选对象项（默认为false）。
     */
    /**
     * @cfg {String} overClass
     * 视图中每一项mouseover事件触发时所应用到的CSS样式类（默认为undefined）
     */
    /**
     * @cfg {String} loadingText 
     * 当数据加载进行时显示的字符串（默认为undefined）。 If specified, this text will be
     * displayed in a loading div and the view's contents will be cleared while loading, otherwise the view's
     * contents will continue to display normally until the new data is loaded and the contents are replaced.
     */

    /**
     * @cfg {String} selectedClass
     * 视图中每个选中项所应用到的CSS样式类（默认为'x-view-selected'）
     */
    selectedClass : "x-view-selected",
    /**
     * @cfg {String} emptyText
     * 没有数据显示时，向用户提示的信息（默认为''）
     */
    emptyText : "",

    //private
    last: false,

    // private
    initComponent : function(){
        Ext.DataView.superclass.initComponent.call(this);
        if(typeof this.tpl == "string"){
            this.tpl = new Ext.XTemplate(this.tpl);
        }

        this.addEvents(
		    /**
		     * @event beforeclick
		     * 单击执行之前触发，返回 false 则取消默认的动作。
		     * @param {Ext.DataView} this DataView
		     * @param {Number} index 目标节点的索引
		     * @param {HTMLElement} node 目标节点
		     * @param {Ext.EventObject} e 原始事件对象
		     */
		    "beforeclick",
		    /**
		     * @event click
		     * 当模板节点单击时触发事件，如返回 false 则取消默认的动作。
		     * @param {Ext.DataView} this DataView
		     * @param {Number} index 目标节点的索引
		     * @param {HTMLElement} node 目标节点
		     * @param {Ext.EventObject} e 原始事件对象
		     */
            "click",
            /**
             * @event containerclick
             * 当点击发生时但又不在模板节点上发生时触发
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e 原始事件对象
             */
            "containerclick",
		    /**
		     * @event dblclick
		     * 当模板节点双击时触发事件
		     * @param {Ext.DataView} this DataView
		     * @param {Number} index 目标节点的索引
		     * @param {HTMLElement} node 目标节点
		     * @param {Ext.EventObject} e 原始事件对象
		     */
            "dblclick",
		    /**
		     * @event contextmenu
		     * 当模板节右击时触发事件
		     * @param {Ext.DataView} this DataView
		     * @param {Number} index 目标节点的索引
		     * @param {HTMLElement} node 目标节点
		     * @param {Ext.EventObject} e 原始事件对象
		     */
            "contextmenu",
		    /**
		     * @event selectionchange
		     * 当选取改变时触发.
		     * @param {Ext.DataView} this DataView
		     * @param {Array} selections 已选取节点所组成的数组 
		     */
            "selectionchange",
		    /**
		     * @event beforeselect
		     * 选取生成之前触发,如返回false,则选区不会生成。
		     * @param {Ext.DataView} this DataView
		     * @param {HTMLElement} node 要选取的节点
		     * @param {Array} selections 当前已选取节点所组成的数组 
		     */
            "beforeselect"
        );

        this.all = new Ext.CompositeElementLite();
        this.selected = new Ext.CompositeElementLite();
    },

    // private
    onRender : function(){
        if(!this.el){
            this.el = document.createElement('div');
        }
        Ext.DataView.superclass.onRender.apply(this, arguments);
    },

    // private
    afterRender : function(){
        Ext.DataView.superclass.afterRender.call(this);

        this.el.on({
            "click": this.onClick,
            "dblclick": this.onDblClick,
            "contextmenu": this.onContextMenu,
            scope:this
        });

        if(this.overClass){
            this.el.on({
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
     * 刷新视图。重新加载store的数据并重新渲染模板
     */
    refresh : function(){
        this.clearSelections(false, true);
        this.el.update("");
        var html = [];
        var records = this.store.getRange();
        if(records.length < 1){
            this.el.update(this.emptyText);
            this.all.clear();
            return;
        }
        this.tpl.overwrite(this.el, this.collectData(records, 0));
        this.all.fill(Ext.query(this.itemSelector, this.el.dom));
        this.updateIndexes(0);
    },

    /**
     * 重写该函数，可对每个节点的数据进行格式化,再交给模板进一步处理.
     * @param {Array/Object} data 原始数据，是Data Model所绑定的视图的colData数组，或Updater数据对象绑定的JSON对象
     */
    prepareData : function(data){
        return data;
    },

    // private
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
        var nodes = this.bufferRender(records, index), n;
        if(index < this.all.getCount()){
            n = this.all.item(index).insertSibling(nodes, 'before', true);
            this.all.elements.splice(index, 0, n);
        }else{
            n = this.all.last().insertSibling(nodes, 'after', true);
            this.all.elements.push(n);
        }
        this.updateIndexes(index);
    },

    // private
    onRemove : function(ds, record, index){
        this.deselect(index);
        this.all.removeElement(index, true);
        this.updateIndexes(index);
    },

    /**
     * 刷新不同的节点的数据（来自store）。
     * @param {Number} index store中的数据的索引
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
     * 改变在使用的Data Store并刷新 view。
     * @param {Store} store 绑定这个view的store对象
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
     * 传入一个节点(node)的参数,返回该属于模板的节点,返回null则代表它不属于模板的任何一个节点。
     * @param {HTMLElement} node
     * @return {HTMLElement} 模板节点
     */
    findItemFromChild : function(node){
        return Ext.fly(node).findParent(this.itemSelector, this.el);
    },

    // private
    onClick : function(e){
        var item = e.getTarget(this.itemSelector, this.el);
        if(item){
            var index = this.indexOf(item);
            if(this.onItemClick(item, index, e) !== false){
                this.fireEvent("click", this, index, item, e);
            }
        }else{
            if(this.fireEvent("containerclick", this, e) !== false){
                this.clearSelections();
            }
        }
    },

    // private
    onContextMenu : function(e){
        var item = e.getTarget(this.itemSelector, this.el);
        if(item){
            this.fireEvent("contextmenu", this, this.indexOf(item), item, e);
        }
    },

    // private
    onDblClick : function(e){
        var item = e.getTarget(this.itemSelector, this.el);
        if(item){
            this.fireEvent("dblclick", this, this.indexOf(item), item, e);
        }
    },

    // private
    onMouseOver : function(e){
        var item = e.getTarget(this.itemSelector, this.el);
        if(item && item !== this.lastItem){
            this.lastItem = item;
            Ext.fly(item).addClass(this.overClass);
        }
    },

    // private
    onMouseOut : function(e){
        if(this.lastItem){
            if(!e.within(this.lastItem, true)){
                Ext.fly(this.lastItem).removeClass(this.overClass);
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
     * 返回选中节点的数量
     * @return {Number} 节点数量
     */
    getSelectionCount : function(){
        return this.selected.getCount()
    },

    /**
     * 返回当前选中的节点
     * @return {Array} HTMLElements数组
     */
    getSelectedNodes : function(){
        return this.selected.elements;
    },

    /**
     * 返回选中的节点的索引
     * @return {Array} 数字索引的数组
     */
    getSelectedIndexes : function(){
        var indexes = [], s = this.selected.elements;
        for(var i = 0, len = s.length; i < len; i++){
            indexes.push(s[i].viewIndex);
        }
        return indexes;
    },

    /**
     * 返回所选记录组成的数组
     * @return {Array} {@link Ext.data.Record}对象数组
     */
    getSelectedRecords : function(){
        var r = [], s = this.selected.elements;
        for(var i = 0, len = s.length; i < len; i++){
            r[r.length] = this.store.getAt(s[i].viewIndex);
        }
        return r;
    },

    /**
     * 从一个节点数组中返回记录节点
     * @param {Array} nodes 参与运算的节点
     * @return {Array} {@link Ext.data.Record}记录对象的数组
     */
    getRecords : function(nodes){
        var r = [], s = nodes;
        for(var i = 0, len = s.length; i < len; i++){
            r[r.length] = this.store.getAt(s[i].viewIndex);
        }
        return r;
    },

    /**
     * 返回节点的记录
     * @param {HTMLElement} node 涉及的节点
     * @return {Record} {@link Ext.data.Record}对象
     */
    getRecord : function(node){
        return this.store.getAt(node.viewIndex);
    },

    /**
     * 清除所有选区
     * @param {Boolean} suppressEvent （可选的）True跃过触发selectionchange的事件
     */
    clearSelections : function(suppressEvent, skipUpdate){
        if(this.multiSelect || this.singleSelect){
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
     * 传入一个节点的参数,如果是属于已选取的话便返回true否则返回false。
     * @param {HTMLElement/Number} node 节点或节点索引
     * @return {Boolean} true表示选中否则返回false
     */
    isSelected : function(node){
        return this.selected.contains(this.getNode(node));
    },

    /**
     * 反选节点
     * @param {HTMLElement/Number} node 反选的节点
     */
    deselect : function(node){
        if(this.isSelected(node)){
            var node = this.getNode(node);
            this.selected.removeElement(node);
            if(this.last == node.viewIndex){
                this.last = false;
            }
            Ext.fly(node).removeClass(this.selectedClass);
            this.fireEvent("selectionchange", this, this.selected.elements);
        }
    },


    /**
     * 选取节点
     * @param {HTMLElement/String/Number} nodeInfo HTMLElement类型的模板节点,模板节点的索引或是模板节点的ID
     * @param {Boolean} keepExisting (可选项) true 代表保留当前选区
     * @param {Boolean} suppressEvent (可选项) true表示为跳过所有selectionchange事件
     */
    select : function(nodeInfo, keepExisting, suppressEvent){
        if(nodeInfo instanceof Array){
            if(!keepExisting){
                this.clearSelections(true);
            }
            for(var i = 0, len = nodeInfo.length; i < len; i++){
                this.select(nodeInfo[i], true, true);
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
     * 选中某个范围内的节点。所有的节点都是被选中。
     * @param {Number} start 索引头 在范围中第一个节点的索引
     * @param {Number} end 索引尾 在范围中最后一个节点的索引
     * @param {Boolean} keepExisting (可选项) true 代表保留当前选区
     */
    selectRange : function(start, end, keepExisting){
        if(!keepExisting){
            this.clearSelections(true);
        }
        this.select(this.getNodes(start, end), true);
    },

    /**
     * 获取多个模板节点
     * @param {HTMLElement/String/Number} nodeInfo HTMLElement类型的模板节点,模板节点的索引或是模板节点的ID
     * @return {HTMLElement} 若找不到返回null
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
     * @param {Number} start 索引头 在范围中第一个节点的索引
     * @param {Number} end 索引尾 在范围中最后一个节点的索引
     * @return {Array} 节点数组
     */
    getNodes : function(start, end){
        var ns = this.all.elements;
        start = start || 0;
        end = typeof end == "undefined" ? ns.length - 1 : end;
        var nodes = [], i;
        if(start <= end){
            for(i = start; i <= end; i++){
                nodes.push(ns[i]);
            }
        } else{
            for(i = start; i >= end; i--){
                nodes.push(ns[i]);
            }
        }
        return nodes;
    },

    /**
     * 传入一个node作为参数,找到它的索引
     * @param {HTMLElement/String/Number} nodeInfo HTMLElement类型的模板节点,模板节点的索引或是模板节点的ID
     * @return {Number} 节点索引或-1
     * 
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
            this.el.update('<div class="loading-indicator">'+this.loadingText+'</div>');
            this.all.clear();
        }
    }
});

Ext.reg('dataview', Ext.DataView);