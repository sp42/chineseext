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
 * @class Ext.tree.TreeNode
 * @extends Ext.data.Node
 * @constructor 
 * @param {Object/String} attributes 该节点的属性/配置对象，也可以是带有文本的一个字符串。The attributes/config for the node or just a string with the text for the node
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
 * @cfg {String} text jhj该节点所显示的文本。The text for this node
 */
  ,text:null
/** 
 * @cfg {Boolean} expanded 如果为"true",该节点被展开。true to start the node expanded
 */
  ,expanded:null
/**  
 * @cfg {Boolean} allowDrag 如果dd为on时，设置为fals将使得该节点不能拖拽。False to make this node undraggable if {@link #draggable} = true (defaults to true)
 */
  ,allowDrag:null
/** 
 * @cfg {Boolean} allowDrop 为false时该节点不能将拖拽的对象放在该节点下。False if this node cannot have child nodes dropped on it (defaults to true)
 */
 ,allowDrop:null
/** 
 * @cfg {Boolean} disabled 为true该节点被禁止。true to start the node disabled
 */
  ,allowDrop:null
/** 
 * @cfg {String} icon 设置该节点上图标的路径.这种方式是首选的，比使用cls或iconCls属性和为这个图标加一个CSS的background-image都好。 The path to an icon for the node. The preferred way to do this
 * is to use the cls or iconCls attributes and add the icon via a CSS background image.
 */
  ,allowDrop:null
/** 
 * @cfg {String} cls 为该节点设置css样式类。A css class to be added to the node
 */
  ,allowDrop:null
/** 
 * @cfg {String} iconCls 为该节点上的图标元素应用背景。 A css class to be added to the nodes icon element for applying css background images
 */
  ,allowDrop:null
/** 
 * @cfg {String} href 设置该节点url连接（默认是#）。 URL of the link used for the node (defaults to #)
 */
  ,allowDrop:null
/** 
 * @cfg {String} hrefTarget 设置该连接应用到那个frame。 target frame for the link
 */
  ,allowDrop:null
/** 
 * @cfg {Boolean} hidden True表示一开始就隐藏（默认为false）。True to render hidden. (Defaults to false).
 */
  ,allowDrop:null
/** 
 * @cfg {String} qtip 该节点设置用于提示的文本。An Ext QuickTip for the node
 */
  ,allowDrop:null
/** 
 * @cfg {Boolean} expandable If set to true, the node will always show a plus/minus icon, even when empty
 */
  ,allowDrop:null
/** 
 * @cfg {String} qtipCfg 为该节点设置QuickTip类（用于替换qtip属性）。An Ext QuickTip config for the node (used instead of qtip)
 */
  ,allowDrop:null
/** 
 * @cfg {Boolean} singleClickExpand 为true时当节点被单击时展开。 True for single click expand on this node
 */
  ,allowDrop:null
/** 
 * @cfg {Function} uiProvider 该节点所使用的UI类（默认时Ext.tree.TreeNodeUI）。 A UI <b>class</b> to use for this node (defaults to Ext.tree.TreeNodeUI)
 */
  ,allowDrop:null
/** 
 * @cfg {Boolean} checked 为true将为该节点添加checkbox选择框，为false将不添加（默认为undefined是不添加checkbox的）。True to render a checked checkbox for this node, false to render an unchecked checkbox
 * (defaults to undefined with no checkbox rendered)
 */
  ,allowDrop:null
/** 
 * @cfg {Boolean} draggable True表示该节点可以拖动的（默认为false）。True to make this node draggable (defaults to false)
 */
  ,allowDrop:null
/** 
 * @cfg {Boolean} isTarget False表示该节点不能够充当置落地点的用途（默认为true）。False to not allow this node to act as a drop target (defaults to true)
 */
  ,allowDrop:null
/** 
 * @cfg {Boolean} allowChildren Flase表示该节点不允许有子节点（默认为true）。False to not allow this node to have child nodes (defaults to true)
 */
  ,allowDrop:null
/** 
 * @cfg {Boolean} editable False表示该节点不能够编辑的。{@link Ext.tree.TreeEditor}不能用（默认为true）。False to not allow this node to be edited by an {@link Ext.tree.TreeEditor} (defaults to true)
 */
  ,allowDrop:null
    /**
     * 只读属性，该节点所显示的文本.可以用setText方法改变。
     * Read-only. The text for this node. To change it use setText().
     * @type String
     * @property text
     */
    this.text = attributes.text;
    /**
     * 如果该节点为disabled那为true。
     * True if this node is disabled.
     * @type Boolean
     * @property disabled
     */
    this.disabled = attributes.disabled === true;
    /**
     * True表示该节点市隐藏的。
     * True if this node is hidden.
     * @type Boolean
     * @property hidden
     */
    this.hidden = attributes.hidden === true;

    this.addEvents(
        /**
        * @event textchange
        * 当这个节点的显示文本被改变时触发。
        * Fires when the text for this node is changed
        * @param {Node} this 该节点。This node
        * @param {String} text 新的文本。The new text
        * @param {String} oldText 以前的文本。The old text
        */
        "textchange",
        /**
        * @event beforeexpand
        * 当该节点被展开之前触发，返回false将取消事件。
        * Fires before this node is expanded, return false to cancel.
        * @param {Node} this 该节点。This node
        * @param {Boolean} deep 该节点当前是否也展开所有子节点的状态。
        * @param {Boolean} anim 该节点当前是否启用动画效果的状态。
        */
        "beforeexpand",
        /**
        * @event beforecollapse
        * 当该节点被收回之前触发，返回false将取消事件。
        * Fires before this node is collapsed, return false to cancel.
        * @param {Node} this This node
        * @param {Boolean} deep 该节点当前是否也展开所有子节点的状态。
        * @param {Boolean} anim 该节点当前是否启用动画效果的状态。
        */
        "beforecollapse",
        /**
        * @event expand
        * 当该节点被展开时触发。
        * Fires when this node is expanded
        * @param {Node} this 该节点。This node
        */
        "expand",
        /**
        * @event disabledchange
        * 当该节点的disabled状态被改变时触发。
        * Fires when the disabled status of this node changes
        * @param {Node} this 该节点。This node
        * @param {Boolean} disabled 该节点的disabled属性的状态。
        */
        "disabledchange",
        /**
        * @event collapse
        * 当该节点被收回时触发。
        * Fires when this node is collapsed
        * @param {Node} this 该节点。This node
        */
        "collapse",
        /**
        * @event beforeclick
        * 单击处理之前触发，返回false将停止默认的动作。
        * Fires before click processing. Return false to cancel the default action.
        * @param {Node} this 该节点。This node
        * @param {Ext.EventObject} e 事件对象。The event object
        */
        "beforeclick",
        /**
        * @event click
        * 当节点被点击时触发。
        * Fires when this node is clicked
        * @param {Node} this 该节点。This node
        * @param {Ext.EventObject} e 事件对象。The event object
        */
        "click",
        /**
        * @event checkchange
        * 当节点的checkbox的状态被改变时触发。
        * Fires when a node with a checkbox's checked property changes
        * @param {Node} this 该节点。 This node
        * @param {Boolean} checked 当前节点checkbox的状态。
        */
        "checkchange",
        /**
        * @event dblclick
        * 当节点被双点击时触发。
        * Fires when this node is double clicked
        * @param {Node} this 该节点。This node
        * @param {Ext.EventObject} e 事件对象。The event object
        */
        "dblclick",
        /**
        * @event contextmenu
        * 当该节点被右击的时候触发。
        * Fires when this node is right clicked
        * @param {Node} this 该节点。This node
        * @param {Ext.EventObject} e 事件对象。The event object
        */
        "contextmenu",
        /**
        * @event beforechildrenrendered
        * 当节点的子节点被渲染之前触发。
        * Fires right before the child nodes for this node are rendered
        * @param {Node} this 该节点。This node
        */
        "beforechildrenrendered"
    );

    var uiClass = this.attributes.uiProvider || this.defaultUI || Ext.tree.TreeNodeUI;

    /**
     * 这个节点的UI。
     * Read-only. The UI for this node
     * @type TreeNodeUI
     * @property ui
     */
    this.ui = new uiClass(this);
};
Ext.extend(Ext.tree.TreeNode, Ext.data.Node, {
    preventHScroll: true,
    /**
     * 如果该节点被展开则返回true。
     * Returns true if this node is expanded
     * @return {Boolean}
     */
    isExpanded : function(){
        return this.expanded;
    },

	/**
	 * 返回该节点的UI对象。
	 * Returns the UI object for this node.
	 * @return {TreeNodeUI} 树节点的用户界面对象。除非有另外指定{@link #uiProvider}，否则这就是一个{@link Ext.tree.TreeNodeUI}实例。
	 * The object which is providing the user interface for this tree
	 * node. Unless otherwise specified in the {@link #uiProvider}, this will be an instance
	 * of {@link Ext.tree.TreeNodeUI}
	 */
    getUI : function(){
        return this.ui;
    },

    getLoader : function(){
        var owner;
        return this.loader || ((owner = this.getOwnerTree()) && owner.loader ? owner.loader : new Ext.tree.TreeLoader());
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
    appendChild : function(n){
        if(!n.render && !Ext.isArray(n)){
            n = this.getLoader().createNode(n);
        }
        var node = Ext.tree.TreeNode.superclass.appendChild.call(this, n);
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
        if(!this.firstChild && !this.isHiddenRoot()) {
            this.childrenRendered = false;
        }
        return node;
    },

    // private override
    insertBefore : function(node, refNode){
        if(!node.render){ 
            node = this.getLoader().createNode(node);
        }
        var newNode = Ext.tree.TreeNode.superclass.insertBefore.call(this, node, refNode);
        if(newNode && refNode && this.childrenRendered){
            node.render();
        }
        this.ui.updateExpandIcon();
        return newNode;
    },

    /**
     * 设置该节点的显示文本。
     * Sets the text for this node
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
     * 选取该节点所在树选择的选区模型。
     * Triggers selection of this node
     */
    select : function(){
        this.getOwnerTree().getSelectionModel().select(this);
    },

    /**
     * 取消选择该节点所在树的选区模型。
     * Triggers deselection of this node
     */
    unselect : function(){
        this.getOwnerTree().getSelectionModel().unselect(this);
    },

    /**
     * 如果该节点被选中则返回true。
     * Returns true if this node is selected
     * @return {Boolean}
     */
    isSelected : function(){
        return this.getOwnerTree().getSelectionModel().isSelected(this);
    },

    /**
     * 展开这个节点。
     * Expand this node.
     * @param {Boolean} deep （可选的）如果为true展开所有的子节点。(optional)True to expand all children as well
     * @param {Boolean} anim （可选的）如果为false不启用动画效果。(optional)false to cancel the default animation
     * @param {Function} callback 当展开完成时调用这个callback（不等待所有子节点都展开完成后才执行）。调用带有一个参数，就是该节点。
     * (optional)A callback to be called when expanding this node completes (does not wait for deep expand to complete).
     * Called with 1 parameter, this node.
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
     * 展开该节点。
     * Collapse this node.
     * @param {Boolean} deep （可选的）为true则也展开所有的子结点。(optional)True to collapse all children as well
     * @param {Boolean} anim （可选的）如果为false不启用动画效果。(optional)false to cancel the default animation
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
     * 轮回该节点的展开/收回状态。
     * Toggles expanded/collapsed state of the node
     */
    toggle : function(){
        if(this.expanded){
            this.collapse();
        }else{
            this.expand();
        }
    },

    /**
     * 确保所有的父节点都被展开了（没理解这个函数的作用）。
     * Ensures all parent nodes are expanded, and if necessary, scrolls the node into view.
     * @param {Function} callback （可选的）节点隐藏后调用的函数。(optional) A function to call when the node has been made visible.
     */
    ensureVisible : function(callback){
        var tree = this.getOwnerTree();
        tree.expandPath(this.parentNode ? this.parentNode.getPath() : this.getPath(), false, function(){
            var node = tree.getNodeById(this.id);  // Somehow if we don't do this, we lose changes that happened to node in the meantime
            tree.getTreeEl().scrollChildIntoView(node.ui.anchor);
            Ext.callback(callback);
        }.createDelegate(this));
    },

    /**
     * 展开所有的子节点。
     * Expand all child nodes
     * @param {Boolean} deep 如果为true，子节点如果还有子节点也将被展开。(optional)true if the child nodes should also expand their child nodes
     */
    expandChildNodes : function(deep){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	cs[i].expand(deep);
        }
    },

    /**
     * 收回所有的子节点。
     * Collapse all child nodes
     * @param {Boolean} deep 如果为true，子节点如果还有子节点也将被收回。(optional)true if the child nodes should also collapse their child nodes
     */
    collapseChildNodes : function(deep){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	cs[i].collapse(deep);
        }
    },

    /**
     * 禁用这个节点。
     * Disables this node
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
     * 启用该节点。
     * Enables this node
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
            // make sure it is registered
            this.getOwnerTree().registerNode(this);
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
    },

    beginUpdate : function(){
        this.childrenRendered = false;
    },

    endUpdate : function(){
        if(this.expanded && this.rendered){
            this.renderChildren();
        }
    },

    destroy : function(){
        if(this.childNodes){
            for(var i = 0,l = this.childNodes.length; i < l; i++){
                this.childNodes[i].destroy();
            }
            this.childNodes = null;
        }
        if(this.ui.destroy){
            this.ui.destroy();
        }
    },
    
    // private
    onIdChange: function(id){
        this.ui.onIdChange(id);
    }
});

Ext.tree.TreePanel.nodeTypes.node = Ext.tree.TreeNode;