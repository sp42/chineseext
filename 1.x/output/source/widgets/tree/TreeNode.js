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
 * @class Ext.tree.TreeNode
 * @extends Ext.data.Node
 * @cfg {String} text The text for this node该节点所显示的文本
 * @cfg {Boolean} expanded true to start the node expanded如果为"true",该节点被展开
 * @cfg {Boolean} allowDrag false to make this node undraggable if DD is on (defaults to true)如果dd为on时，设置为fals将使得该节点不能拖拽
 * @cfg {Boolean} allowDrop false if this node cannot be drop on为false时该节点不能将拖拽的对象放在该节点下
 * @cfg {Boolean} disabled true to start the node disabled为true该节点被禁止
 * @cfg {String} icon The path to an icon for the node. The preferred way to do this
 * is to use the cls or iconCls attributes and add the icon via a CSS background image.
 * 设置该节点上图标的路径.这种方式是首选的，比使用cls或iconCls属性和为这个图标加一个CSS的background-image都好.
 * @cfg {String} cls A css class to be added to the node为该节点设置css样式类
 * @cfg {String} iconCls A css class to be added to the nodes icon element for applying css background images
 * 为该节点上的图标元素应用背景
 * @cfg {String} href URL of the link used for the node (defaults to #)设置该节点url连接(默认是#)
 * @cfg {String} hrefTarget target frame for the link设置该连接应用到那个frame
 * @cfg {String} qtip An Ext QuickTip for the node为该节点设置用于提示的文本
 * @cfg {String} qtipCfg An Ext QuickTip config for the node (used instead of qtip)为该节点设置QuickTip类(用于替换qtip属性)
 * @cfg {Boolean} singleClickExpand True for single click expand on this node为true时当节点被单击时展开
 * @cfg {Function} uiProvider A UI <b>class</b> to use for this node (defaults to Ext.tree.TreeNodeUI)该节点所使用的UI类(默认时Ext.tree.TreeNodeUI)
 * @cfg {Boolean} checked True to render a checked checkbox for this node, false to render an unchecked checkbox
 * (defaults to undefined with no checkbox rendered)
 * 为true将为该节点添加checkbox选择框,为false将不添加(默认为undefined是不添加checkbox的)
 * @constructor构造函数
 * @param {Object/String} attributes The attributes/config for the node or just a string with the text for the node
 * 该节点的属性/配置对象，也可以是带有文本的一个字符串
 */
Ext.tree.TreeNode = function(attributes){
    attributes = attributes || {};
    if(typeof attributes == "string"){
        attributes = {text: attributes};
    }
    this.childrenRendered = false;
    this.rendered = false;
    Ext.tree.TreeNode.superclass.constructor.call(this, attributes);
    this.expanded = attributes.expanded === true;
    this.isTarget = attributes.isTarget !== false;
    this.draggable = attributes.draggable !== false && attributes.allowDrag !== false;
    this.allowChildren = attributes.allowChildren !== false && attributes.allowDrop !== false;

    /**
     * Read-only. The text for this node. To change it use setText().只读属性，该节点所显示的文本.可以用setText方法改变
     * @type String
     */
    this.text = attributes.text;
    /**
     * True if this node is disabled.如果该节点为disabled那为true
     * @type Boolean
     */
    this.disabled = attributes.disabled === true;

    this.addEvents({
        /**
        * @event textchange
        * Fires when the text for this node is changed当这个节点的显示文本被改变时触发
        * @param {Node} this This node该节点
        * @param {String} text The new text新的文本
        * @param {String} oldText The old text以前的文本
        */
        "textchange" : true,
        /**
        * @event beforeexpand
        * Fires before this node is expanded, return false to cancel当该节点被展开之前触发，返回false将取消事件
        * @param {Node} this This node该节点
        * @param {Boolean} deep 该节点当前是否也展开所有子节点的状态
        * @param {Boolean} anim 该节点当前是否启用动画效果的状态
        */
        "beforeexpand" : true,
        /**
        * @event beforecollapse
        * Fires before this node is collapsed, return false to cancel.当该节点被收回之前触发，返回false将取消事件
        * @param {Node} this This node该节点
       	* @param {Boolean} deep 该节点当前是否也展开所有子节点的状态
        * @param {Boolean} anim 该节点当前是否启用动画效果的状态
        */
        "beforecollapse" : true,
        /**
        * @event expand
        * Fires when this node is expanded当该节点被展开时触发。
        * @param {Node} this This node该节点
        */
        "expand" : true,
        /**
        * @event disabledchange
        * Fires when the disabled status of this node changes当该节点的disabled状态被改变时触发
        * @param {Node} this This node该节点
        * @param {Boolean} disabled该节点的disabled属性的状态
        */
        "disabledchange" : true,
        /**
        * @event collapse
        * Fires when this node is collapsed当该节点被收回时触发。
        * @param {Node} this This node该节点
        */
        "collapse" : true,
        /**
        * @event beforeclick
        * Fires before click processing. Return false to cancel the default action.单击处理之前触发，返回false将停止默认的动作
        * @param {Node} this This node该节点
        * @param {Ext.EventObject} e The event object 事件对象
        */
        "beforeclick":true,
        /**
        * @event checkchange
        * Fires when a node with a checkbox's checked property changes当节点的checkbox的状态被改变时触发
        * @param {Node} this This node该节点
        * @param {Boolean} checked当前节点checkbox的状态
        */
        "checkchange":true,
        /**
        * @event click
        * Fires when this node is clicked当节点被点击时触发
        * @param {Node} this This node该节点
        * @param {Ext.EventObject} e The event object 事件对象
        */
        "click":true,
        /**
        * @event dblclick
        * Fires when this node is double clicked 当节点被双点击时触发
        * @param {Node} this This node该节点
        * @param {Ext.EventObject} e The event object 事件对象
        */
        "dblclick":true,
        /**
        * @event contextmenu
        * Fires when this node is right clicked 当节点被右键点击时触发
        * @param {Node} this This node该节点
        * @param {Ext.EventObject} e The event object 事件对象
        */
        "contextmenu":true,
        /**
        * @event beforechildrenrendered
        * Fires right before the child nodes for this node are rendered 当节点的子节点被渲染之前触发
        * @param {Node} this This node该节点
        */
        "beforechildrenrendered":true
    });

    var uiClass = this.attributes.uiProvider || Ext.tree.TreeNodeUI;

    /**
     * Read-only. The UI for this node这个节点的UI
     * @type TreeNodeUI
     */
    this.ui = new uiClass(this);
};
Ext.extend(Ext.tree.TreeNode, Ext.data.Node, {
    preventHScroll: true,
    /**
     * Returns true if this node is expanded如果该节点被展开则返回true
     * @return {Boolean}
     */
    isExpanded : function(){
        return this.expanded;
    },

    /**
     * Returns the UI object for this node返回该节点的UI对象
     * @return {TreeNodeUI}
     */
    getUI : function(){
        return this.ui;
    },

    // private override
    setFirstChild : function(node){
        var of = this.firstChild;
        Ext.tree.TreeNode.superclass.setFirstChild.call(this, node);
        if(this.childrenRendered && of && node != of){
            of.renderIndent(true, true);
        }
        if(this.rendered){
            this.renderIndent(true, true);
        }
    },

    // private override
    setLastChild : function(node){
        var ol = this.lastChild;
        Ext.tree.TreeNode.superclass.setLastChild.call(this, node);
        if(this.childrenRendered && ol && node != ol){
            ol.renderIndent(true, true);
        }
        if(this.rendered){
            this.renderIndent(true, true);
        }
    },

    // these methods are overridden to provide lazy rendering support
    // private override
    appendChild : function(){
        var node = Ext.tree.TreeNode.superclass.appendChild.apply(this, arguments);
        if(node && this.childrenRendered){
            node.render();
        }
        this.ui.updateExpandIcon();
        return node;
    },

    // private override
    removeChild : function(node){
        this.ownerTree.getSelectionModel().unselect(node);
        Ext.tree.TreeNode.superclass.removeChild.apply(this, arguments);
        // if it's been rendered remove dom node
        if(this.childrenRendered){
            node.ui.remove();
        }
        if(this.childNodes.length < 1){
            this.collapse(false, false);
        }else{
            this.ui.updateExpandIcon();
        }
        if(!this.firstChild) {
            this.childrenRendered = false;
        }
        return node;
    },

    // private override
    insertBefore : function(node, refNode){
        var newNode = Ext.tree.TreeNode.superclass.insertBefore.apply(this, arguments);
        if(newNode && refNode && this.childrenRendered){
            node.render();
        }
        this.ui.updateExpandIcon();
        return newNode;
    },

    /**
     * Sets the text for this node设置该节点的显示文本
     * @param {String} text
     */
    setText : function(text){
        var oldText = this.text;
        this.text = text;
        this.attributes.text = text;
        if(this.rendered){ // event without subscribing
            this.ui.onTextChange(this, text, oldText);
        }
        this.fireEvent("textchange", this, text, oldText);
    },

    /**
     * Triggers selection of this node选取该节点所在树选择的选区模型
     */
    select : function(){
        this.getOwnerTree().getSelectionModel().select(this);
    },

    /**
     * Triggers deselection of this node取消选择该节点所在树的选区模型
     */
    unselect : function(){
        this.getOwnerTree().getSelectionModel().unselect(this);
    },

    /**
     * Returns true if this node is selected如果该节点被选中则返回true
     * @return {Boolean}
     */
    isSelected : function(){
        return this.getOwnerTree().getSelectionModel().isSelected(this);
    },

    /**
     * Expand this node.展开这个节点
     * @param {Boolean} deep (optional) True to expand all children as well如果为true展开所有的子节点
     * @param {Boolean} anim (optional) false to cancel the default animation如果为false不启用动画效果
     * @param {Function} callback (optional) A callback to be called when
     * expanding this node completes (does not wait for deep expand to complete).当展开完成时调用这个callback(不等待所有子节点都展开完成后才执行)
     * Called with 1 parameter, this node.调用带有一个参数，就是该节点
     */
    expand : function(deep, anim, callback){
        if(!this.expanded){
            if(this.fireEvent("beforeexpand", this, deep, anim) === false){
                return;
            }
            if(!this.childrenRendered){
                this.renderChildren();
            }
            this.expanded = true;
            if(!this.isHiddenRoot() && (this.getOwnerTree().animate && anim !== false) || anim){
                this.ui.animExpand(function(){
                    this.fireEvent("expand", this);
                    if(typeof callback == "function"){
                        callback(this);
                    }
                    if(deep === true){
                        this.expandChildNodes(true);
                    }
                }.createDelegate(this));
                return;
            }else{
                this.ui.expand();
                this.fireEvent("expand", this);
                if(typeof callback == "function"){
                    callback(this);
                }
            }
        }else{
           if(typeof callback == "function"){
               callback(this);
           }
        }
        if(deep === true){
            this.expandChildNodes(true);
        }
    },

    isHiddenRoot : function(){
        return this.isRoot && !this.getOwnerTree().rootVisible;
    },

    /**
     * Collapse this node.展开该节点
     * @param {Boolean} deep (optional) True to collapse all children as well 为true则也展开所有的子结点
     * @param {Boolean} anim (optional) false to cancel the default animation 如果为false不启用动画效果
     */
    collapse : function(deep, anim){
        if(this.expanded && !this.isHiddenRoot()){
            if(this.fireEvent("beforecollapse", this, deep, anim) === false){
                return;
            }
            this.expanded = false;
            if((this.getOwnerTree().animate && anim !== false) || anim){
                this.ui.animCollapse(function(){
                    this.fireEvent("collapse", this);
                    if(deep === true){
                        this.collapseChildNodes(true);
                    }
                }.createDelegate(this));
                return;
            }else{
                this.ui.collapse();
                this.fireEvent("collapse", this);
            }
        }
        if(deep === true){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++) {
            	cs[i].collapse(true, false);
            }
        }
    },

    // private
    delayedExpand : function(delay){
        if(!this.expandProcId){
            this.expandProcId = this.expand.defer(delay, this);
        }
    },

    // private
    cancelExpand : function(){
        if(this.expandProcId){
            clearTimeout(this.expandProcId);
        }
        this.expandProcId = false;
    },

    /**
     * Toggles expanded/collapsed state of the node轮回该节点的展开/收回状态
     */
    toggle : function(){
        if(this.expanded){
            this.collapse();
        }else{
            this.expand();
        }
    },

    /**
     * Ensures all parent nodes are expanded 确保所有的父节点都被展开了(没理解这个函数的作用)
     */
    ensureVisible : function(callback){
        var tree = this.getOwnerTree();
        tree.expandPath(this.parentNode.getPath(), false, function(){
            tree.getTreeEl().scrollChildIntoView(this.ui.anchor);
            Ext.callback(callback);
        }.createDelegate(this));
    },

    /**
     * Expand all child nodes展开所有的子节点
     * @param {Boolean} deep (optional) true if the child nodes should also expand their child nodes如果为true，子节点如果还有子节点也将被展开
     */
    expandChildNodes : function(deep){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	cs[i].expand(deep);
        }
    },

    /**
     * Collapse all child nodes收回所有的字节点
     * @param {Boolean} deep (optional) true if the child nodes should also collapse their child nodes如果为true，子节点如果还有子节点也将被收回
     */
    collapseChildNodes : function(deep){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	cs[i].collapse(deep);
        }
    },

    /**
     * Disables this node禁用这个节点
     */
    disable : function(){
        this.disabled = true;
        this.unselect();
        if(this.rendered && this.ui.onDisableChange){ // event without subscribing
            this.ui.onDisableChange(this, true);
        }
        this.fireEvent("disabledchange", this, true);
    },

    /**
     * Enables this node启用该节点
     */
    enable : function(){
        this.disabled = false;
        if(this.rendered && this.ui.onDisableChange){ // event without subscribing
            this.ui.onDisableChange(this, false);
        }
        this.fireEvent("disabledchange", this, false);
    },

    // private
    renderChildren : function(suppressEvent){
        if(suppressEvent !== false){
            this.fireEvent("beforechildrenrendered", this);
        }
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i].render(true);
        }
        this.childrenRendered = true;
    },

    // private
    sort : function(fn, scope){
        Ext.tree.TreeNode.superclass.sort.apply(this, arguments);
        if(this.childrenRendered){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++){
                cs[i].render(true);
            }
        }
    },

    // private
    render : function(bulkRender){
        this.ui.render(bulkRender);
        if(!this.rendered){
            this.rendered = true;
            if(this.expanded){
                this.expanded = false;
                this.expand(false, false);
            }
        }
    },

    // private
    renderIndent : function(deep, refresh){
        if(refresh){
            this.ui.childIndent = null;
        }
        this.ui.renderIndent();
        if(deep === true && this.childrenRendered){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++){
                cs[i].renderIndent(true, refresh);
            }
        }
    }
});