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
 * @class Ext.View
 * @extends Ext.util.Observable
 * 创建某个元素的“视图（View）”，这个“视图”可基于Data Model（数据模型）或 UpdateManager， 并由 DomHelper提供模板的支持。 
 * 选区模式支持单选或多选. <br>
 * 将Data Model绑定到 View。
 <pre><code>
 var store = new Ext.data.Store(...);

 var view = new Ext.View("my-element",
 '&lt;div id="{0}"&gt;{2} - {1}&lt;/div&gt;', // 自动创建模板
 {
 singleSelect: true,
 selectedClass: "ydataview-selected",
 store: store
 });

 //是否侦听节点的单击事件？
 view.on("click", function(vw, index, node, e){
 alert('Node "' + node.id + '" at index: ' + index + " was clicked.");
 });

 //加载XML数据
 dataModel.load("foobar.xml");
 </code></pre>
 * 关于创建 JSON/UpdateManager view 的例子，可见 {@link Ext.JsonView}. 
 *  <br><br>
 * <b>注意：模板的根节点必须是单一节点。由于IE插入的限制和Opera事件上报的失效,表格/行（table/row）的实现可能渲染失真。</b> 
 * @constructor
 * Create a new View
 * @param {String/HTMLElement/Element} container View渲染所在的容器元素
 * @param {String/DomHelper.Template} tpl 渲染模板对象或是创建模板的字符串
 * @param {Object} config 配置项对象
 */
Ext.View = function(container, tpl, config){
    this.el = Ext.get(container);
    if(typeof tpl == "string"){
        tpl = new Ext.Template(tpl);
    }
    tpl.compile();
    /**
     * View所使用的模板
     * @type {Ext.DomHelper.Template}
     */
    this.tpl = tpl;

    Ext.apply(this, config);

    /** @private */
    this.addEvents({
    /**
     * @event beforeclick
     * 单击执行之前触发,如返回 false 则取消默认的动作。
     * @param {Ext.View} this
     * @param {Number} index 目标节点的索引
     * @param {HTMLElement} node 目标节点
     * @param {Ext.EventObject} e 原始事件对象
     */
        "beforeclick" : true,
    /**
     * @event click
     * 当模板节点单击时触发事件
     * @param {Ext.View} this
     * @param {Number} index 目标节点的索引
     * @param {HTMLElement} node 目标节点
     * @param {Ext.EventObject} e 原始事件对象
     */
        "click" : true,
    /**
     * @event dblclick
     * 当模板节点双击时触发事件
     * @param {Ext.View} this
     * @param {Number} index 目标节点的索引
     * @param {HTMLElement} node 目标节点
     * @param {Ext.EventObject} e 原始事件对象
     */
        "dblclick" : true,
    /**
     * @event contextmenu
     * 当模板节右击时触发事件
     * @param {Ext.View} this
     * @param {Number} index 目标节点的索引
     * @param {HTMLElement} node 目标节点
     * @param {Ext.EventObject} e 原始事件对象
     */
        "contextmenu" : true,
    /**
     * @event selectionchange
     * 当选取改变时触发.
     * @param {Ext.View} this
     * @param {Array} selections 已选取节点所组成的数组 
     */
        "selectionchange" : true,

    /**
     * @event beforeselect
     * 选取生成之前触发,如返回false,则选区不会生成.
     * @param {Ext.View} this
     * @param {HTMLElement} node 要选取的节点
     * @param {Array} selections 当前已选取节点所组成的数组 
     */
        "beforeselect" : true
    });

    this.el.on({
        "click": this.onClick,
        "dblclick": this.onDblClick,
        "contextmenu": this.onContextMenu,
        scope:this
    });

    this.selections = [];
    this.nodes = [];
    this.cmp = new Ext.CompositeElementLite([]);
    if(this.store){
        this.setStore(this.store, true);
    }
    Ext.View.superclass.constructor.call(this);
};

Ext.extend(Ext.View, Ext.util.Observable, {
    /**
     * 显示节点已选取的CSS样式类.
     * @type {Ext.DomHelper.Template}
     */
    selectedClass : "x-view-selected",
    
    emptyText : "",
    /**
     * 返回view所绑定的元素.
     * @return {Ext.Element}
     */
    getEl : function(){
        return this.el;
    },

    /**
     * 刷新视图.
     */
    refresh : function(){
        var t = this.tpl;
        this.clearSelections();
        this.el.update("");
        var html = [];
        var records = this.store.getRange();
        if(records.length < 1){
            this.el.update(this.emptyText);
            return;
        }
        for(var i = 0, len = records.length; i < len; i++){
            var data = this.prepareData(records[i].data, i, records[i]);
            html[html.length] = t.apply(data);
        }
        this.el.update(html.join(""));
        this.nodes = this.el.dom.childNodes;
        this.updateIndexes(0);
    },

    /**
     * 重写该函数，可对每个节点的数据进行格式化,再交给模板进一步处理.
     * @param {Array/Object} data 原始数据，是Data Model 绑定视图对象或UpdateManager数据对象绑定的JSON对象
     */
    prepareData : function(data){
        return data;
    },

    onUpdate : function(ds, record){
        this.clearSelections();
        var index = this.store.indexOf(record);
        var n = this.nodes[index];
        this.tpl.insertBefore(n, this.prepareData(record.data));
        n.parentNode.removeChild(n);
        this.updateIndexes(index, index);
    },

    onAdd : function(ds, records, index){
        this.clearSelections();
        if(this.nodes.length == 0){
            this.refresh();
            return;
        }
        var n = this.nodes[index];
        for(var i = 0, len = records.length; i < len; i++){
            var d = this.prepareData(records[i].data);
            if(n){
                this.tpl.insertBefore(n, d);
            }else{
                this.tpl.append(this.el, d);
            }
        }
        this.updateIndexes(index);
    },

    onRemove : function(ds, record, index){
        this.clearSelections();
        this.el.dom.removeChild(this.nodes[index]);
        this.updateIndexes(index);
    },

    /**
     * 刷新不同的节点.
     * @param {Number} index
     */
    refreshNode : function(index){
        this.onUpdate(this.store, this.store.getAt(index));
    },

    updateIndexes : function(startIndex, endIndex){
        var ns = this.nodes;
        startIndex = startIndex || 0;
        endIndex = endIndex || ns.length - 1;
        for(var i = startIndex; i <= endIndex; i++){
            ns[i].nodeIndex = i;
        }
    },

    /**
     * 改变在使用的Data Store并刷新 view。
     * @param {Store} store
     */
    setStore : function(store, initial){
        if(!initial && this.store){
            this.store.un("datachanged", this.refresh);
            this.store.un("add", this.onAdd);
            this.store.un("remove", this.onRemove);
            this.store.un("update", this.onUpdate);
            this.store.un("clear", this.refresh);
        }
        if(store){
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
        var el = this.el.dom;
        if(!node || node.parentNode == el){
		    return node;
	    }
	    var p = node.parentNode;
	    while(p && p != el){
            if(p.parentNode == el){
            	return p;
            }
            p = p.parentNode;
        }
	    return null;
    },

    /** @ignore */
    onClick : function(e){
        var item = this.findItemFromChild(e.getTarget());
        if(item){
            var index = this.indexOf(item);
            if(this.onItemClick(item, index, e) !== false){
                this.fireEvent("click", this, index, item, e);
            }
        }else{
            this.clearSelections();
        }
    },

    /** @ignore */
    onContextMenu : function(e){
        var item = this.findItemFromChild(e.getTarget());
        if(item){
            this.fireEvent("contextmenu", this, this.indexOf(item), item, e);
        }
    },

    /** @ignore */
    onDblClick : function(e){
        var item = this.findItemFromChild(e.getTarget());
        if(item){
            this.fireEvent("dblclick", this, this.indexOf(item), item, e);
        }
    },

    onItemClick : function(item, index, e){
        if(this.fireEvent("beforeclick", this, index, item, e) === false){
            return false;
        }
        if(this.multiSelect || this.singleSelect){
            if(this.multiSelect && e.shiftKey && this.lastSelection){
                this.select(this.getNodes(this.indexOf(this.lastSelection), index), false);
            }else{
                this.select(item, this.multiSelect && e.ctrlKey);
                this.lastSelection = item;
            }
            e.preventDefault();
        }
        return true;
    },

    /**
     * 获取节点选中数
     * @return {Number}
     */
    getSelectionCount : function(){
        return this.selections.length;
    },

    /**
     * 获取当前选中的节点
     * @return {Array} HTMLElements数组
     */
    getSelectedNodes : function(){
        return this.selections;
    },

    /**
     * 获取选中节点的索引
     * @return {Array}
     */
    getSelectedIndexes : function(){
        var indexes = [], s = this.selections;
        for(var i = 0, len = s.length; i < len; i++){
            indexes.push(s[i].nodeIndex);
        }
        return indexes;
    },

    /**
     * 清除选区
     * @param {Boolean} suppressEvent (可选项) true表示为跳过所有selectionchange事件
     */
    clearSelections : function(suppressEvent){
        if(this.nodes && (this.multiSelect || this.singleSelect) && this.selections.length > 0){
            this.cmp.elements = this.selections;
            this.cmp.removeClass(this.selectedClass);
            this.selections = [];
            if(!suppressEvent){
                this.fireEvent("selectionchange", this, this.selections);
            }
        }
    },

    /**

     * 传入一个节点的参数,如果是属于已选取的话便返回true.
     * @param {HTMLElement/Number} node 节点或节点索引
     * @return {Boolean}
     */
    isSelected : function(node){
        var s = this.selections;
        if(s.length < 1){
            return false;
        }
        node = this.getNode(node);
        return s.indexOf(node) !== -1;
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
            if(node && !this.isSelected(node)){
                if(!keepExisting){
                    this.clearSelections(true);
                }
                if(this.fireEvent("beforeselect", this, node, this.selections) !== false){
                    Ext.fly(node).addClass(this.selectedClass);
                    this.selections.push(node);
                    if(!suppressEvent){
                        this.fireEvent("selectionchange", this, this.selections);
                    }
                }
            }
        }
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
            return this.nodes[nodeInfo];
        }
        return nodeInfo;
    },

    /**
     * 获取某个范围的模板节点。
     * @param {Number} 索引头
     * @param {Number} 索引尾
     * @return {Array} 节点数组
     */
    getNodes : function(start, end){
        var ns = this.nodes;
        start = start || 0;
        end = typeof end == "undefined" ? ns.length - 1 : end;
        var nodes = [];
        if(start <= end){
            for(var i = start; i <= end; i++){
                nodes.push(ns[i]);
            }
        } else{
            for(var i = start; i >= end; i--){
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
        if(typeof node.nodeIndex == "number"){
            return node.nodeIndex;
        }
        var ns = this.nodes;
        for(var i = 0, len = ns.length; i < len; i++){
            if(ns[i] == node){
                return i;
            }
        }
        return -1;
    }
});
