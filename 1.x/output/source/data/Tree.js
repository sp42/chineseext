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
 * @class Ext.data.Tree
 * @extends Ext.util.Observable
 * Represents a tree data structure and bubbles all the events for its nodes. The nodes
 * in the tree have most standard DOM functionality.
 * @constructor
 * @param {Node} root (optional) The root node
 */
 /**
 * @ Ext.data.Tree类
 * @extends Ext.util.Observable
 * 代表一个树的数据结构并且向上传递它结点事件.树上的节点有绝大多数的标准dom的功能
 * @构造器
 * @param {Node} root (optional) 根节点
 */
Ext.data.Tree = function(root){
   this.nodeHash = {};
   /**
    * The root node for this tree
    * @type Node
    */
   this.root = null;
   if(root){
       this.setRootNode(root);
   }
   this.addEvents({
       /**
        * @event append
        * Fires when a new child node is appended to a node in this tree.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The newly appended node
        * @param {Number} index The index of the newly appended node
        */
		 /**
        * @ append事件
        * 当一个新子节点挂到树上某一切点时触发该事件.
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点
        * @param {Node} node 新的被挂上的节点
        * @param {Number} index 新的被挂上的节点的索引
        */
       "append" : true,
       /**
        * @event remove
        * Fires when a child node is removed from a node in this tree.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The child node removed
        */
		/**
        * @remove 移除事件
        * 当一个子节点被从树上的某节点移除时触发该事件.
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点
        * @param {Node} node 被移除的子节点
        */
       "remove" : true,
       /**
        * @event move
        * Fires when a node is moved to a new location in the tree
        * @param {Tree} tree The owner tree
        * @param {Node} node The node moved
        * @param {Node} oldParent The old parent of this node
        * @param {Node} newParent The new parent of this node
        * @param {Number} index The index it was moved to
        */
		/**
        * @ move事件
        * 当树上的某一节点移动到新的位置时触发该事件
        * @param {Tree} tree 该树
        * @param {Node} node 移动的节点
        * @param {Node} oldParent 该移动节点的原父
        * @param {Node} newParent 移动的节点的新父
        * @param {Number} index 移动的节点的在新父下的索引
        */
       "move" : true,
       /**
        * @event insert
        * Fires when a new child node is inserted in a node in this tree.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The child node inserted
        * @param {Node} refNode The child node the node was inserted before
        */
		/**
        * @insert事件
        * 当一个新子节点被插入到树中某个节点下时触发该事件
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点
        * @param {Node} node 插入后的子节点
        * @param {Node} refNode 插入前的子节点
        */
       "insert" : true,
       /**
        * @event beforeappend
        * Fires before a new child is appended to a node in this tree, return false to cancel the append.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The child node to be appended
        */
		/**
        * @beforeappend 事件
        * 在一子点被接挂到树之前触发,如果返回false,则取消接挂.
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点
        * @param {Node} node 被接挂的子节点
        */
       "beforeappend" : true,
       /**
        * @event beforeremove
        * Fires before a child is removed from a node in this tree, return false to cancel the remove.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The child node to be removed
        */

		/**
        * @beforeremove事件
        * 当一个子节点被从树某一个节点被移除时触发该事件,返回false时取消移除.
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点
        * @param {Node} node 将被移除的子节点
        */
       "beforeremove" : true,
       /**
        * @event beforemove
        * Fires before a node is moved to a new location in the tree. Return false to cancel the move.
        * @param {Tree} tree The owner tree
        * @param {Node} node The node being moved
        * @param {Node} oldParent The parent of the node
        * @param {Node} newParent The new parent the node is moving to
        * @param {Number} index The index it is being moved to
        */
		 /**
        * @ beforemove事件
        * 当树上一节点被移动到树上的新位置之前触发,返回false时取消移动
        * @param {Tree} tree The owner tree
        * @param {Node} node The node being moved
        * @param {Node} oldParent The parent of the node
        * @param {Node} newParent The new parent the node is moving to
        * @param {Number} index The index it is being moved to
        */
       "beforemove" : true,
       /**
        * @event beforeinsert
        * Fires before a new child is inserted in a node in this tree, return false to cancel the insert.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The child node to be inserted
        * @param {Node} refNode The child node the node is being inserted before
        */
		/**
        * @ beforeinsert事件
        * 当一新子节点被插入到树上某一节点之前触发该事件,返回false时取消插入
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点 
        * @param {Node} node 插入的子节点
        * @param {Node} refNode 插入之前的子节点
        */
       "beforeinsert" : true
   });

    Ext.data.Tree.superclass.constructor.call(this);
};

Ext.extend(Ext.data.Tree, Ext.util.Observable, {
    pathSeparator: "/",

    proxyNodeEvent : function(){
        return this.fireEvent.apply(this, arguments);
    },

    /**
     * Returns the root node for this tree.
     * @return {Node}
     */

	 /**
     * 返回树的根节点.
     * @return {Node}
     */

    getRootNode : function(){
        return this.root;
    },

    /**
     * Sets the root node for this tree.
     * @param {Node} node
     * @return {Node}
     */
	 /**
     * 设置树的根节点
     * @param {Node} node
     * @return {Node}
     */
    setRootNode : function(node){
        this.root = node;
        node.ownerTree = this;
        node.isRoot = true;
        this.registerNode(node);
        return node;
    },

    /**
     * Gets a node in this tree by its id.
     * @param {String} id
     * @return {Node}
     */
	 /**
     * 根据节点	ID在树里获取节点
     * @param {String} id
     * @return {Node}
     */
    getNodeById : function(id){
        return this.nodeHash[id];
    },

    registerNode : function(node){
        this.nodeHash[node.id] = node;
    },

    unregisterNode : function(node){
        delete this.nodeHash[node.id];
    },

    toString : function(){
        return "[Tree"+(this.id?" "+this.id:"")+"]";
    }
});

/**
 * @class Ext.data.Node
 * @extends Ext.util.Observable
 * @cfg {Boolean} leaf true if this node is a leaf and does not have children
 * @cfg {String} id The id for this node. If one is not specified, one is generated.
 * @constructor
 * @param {Object} attributes The attributes/config for the node
 */
 /**
 * @ Ext.data.Node类
 * @extends Ext.util.Observable
 * @cfg {Boolean} 该节点是否为叶节点
 * @cfg {String}该节点的ID.如果没有指定,则自动生成.
 * @constructor
 * @param {Object} attributes 该节点的属性集或配置
 */
Ext.data.Node = function(attributes){
    /**
     * The attributes supplied for the node. You can use this property to access any custom attributes you supplied.
     * @type {Object}
     */
	 /**
     * 该节点所支持的属性,你可以用此属性访问任一你指定的客户端属性
     * @type {Object}
     */
    this.attributes = attributes || {};
    this.leaf = this.attributes.leaf;
    /**
     * The node id. @type String
     */
    this.id = this.attributes.id;
    if(!this.id){
        this.id = Ext.id(null, "ynode-");
        this.attributes.id = this.id;
    }
    /**
     * All child nodes of this node. @type Array
     */
	 /**
     * 该节点的所有子节点. @type 类型为数组
     */
    this.childNodes = [];
    if(!this.childNodes.indexOf){ // indexOf is a must
        this.childNodes.indexOf = function(o){
            for(var i = 0, len = this.length; i < len; i++){
                if(this[i] == o) return i;
            }
            return -1;
        };
    }
    /**
     * The parent node for this node. @type Node
     */
	 /**
     * 该节点的父节点. @type 类型为节点
     */
    this.parentNode = null;
    /**
     * The first direct child node of this node, or null if this node has no child nodes. @type Node
     */
	  /**
     * 第一个子节点,如果没有则返回为空. @type 类型为节点
     */
    this.firstChild = null;
    /**
     * The last direct child node of this node, or null if this node has no child nodes. @type Node
     */
	 /**
     * 该节点的最后一个子节点,如果没有,则返回为空.@type 类型为节点
     */
    this.lastChild = null;
    /**
     * The node immediately preceding this node in the tree, or null if there is no sibling node. @type Node
     */
	  /**
     * 返回该节点前一个兄弟节点.如果没有,则返回空. @type 类型为节点
     */
    this.previousSibling = null;
    /**
     * The node immediately following this node in the tree, or null if there is no sibling node. @type Node
     */
	 /**
     * 返回该节点的后一个兄弟节点.如果没有,则返回空. @type 类型为节点
     */
    this.nextSibling = null;

    this.addEvents({
       /**
        * @event append
        * Fires when a new child node is appended
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The newly appended node
        * @param {Number} index The index of the newly appended node
        */
		 /**
        * @ append事件
        * 当一个新子节点挂到树上某一切点时触发该事件.
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点
        * @param {Node} node 新的被挂上的节点
        * @param {Number} index 新的被挂上的节点的索引
        */
       "append" : true,
       /**
        * @event remove
        * Fires when a child node is removed
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The removed node
        */
		/**
        * @remove 移除事件
        * 当一个子节点被从树上的某节点移除时触发该事件.
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点
        * @param {Node} node 被移除的子节点
        */
       "remove" : true,
       /**
        * @event move
        * Fires when this node is moved to a new location in the tree
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} oldParent The old parent of this node
        * @param {Node} newParent The new parent of this node
        * @param {Number} index The index it was moved to
        */
		/**
        * @ move事件
        * 当树上的某一节点移动到新的位置时触发该事件
        * @param {Tree} tree 该树
        * @param {Node} node 移动的节点
        * @param {Node} oldParent 该移动节点的原父
        * @param {Node} newParent 移动的节点的新父
        * @param {Number} index 移动的节点的在新父下的索引
        */
       "move" : true,
       /**
        * @event insert
        * Fires when a new child node is inserted.
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The child node inserted
        * @param {Node} refNode The child node the node was inserted before
        */
		/**
        * @insert事件
        * 当一个新子节点被插入到树中某个节点下时触发该事件
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点
        * @param {Node} node 插入后的子节点
        * @param {Node} refNode 插入前的子节点
        */
       "insert" : true,
       /**
        * @event beforeappend
        * Fires before a new child is appended, return false to cancel the append.
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The child node to be appended
        */
		/**
        * @beforeappend 事件
        * 在一子点被接挂到树之前触发,如果返回false,则取消接挂.
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点
        * @param {Node} node 被接挂的子节点
        */
       "beforeappend" : true,
       /**
        * @event beforeremove
        * Fires before a child is removed, return false to cancel the remove.
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The child node to be removed
        */
		/**
        * @beforeremove事件
        * 当一个子节点被从树某一个节点被移除时触发该事件,返回false时取消移除.
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点
        * @param {Node} node 将被移除的子节点
        */
       "beforeremove" : true,
       /**
        * @event beforemove
        * Fires before this node is moved to a new location in the tree. Return false to cancel the move.
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} oldParent The parent of this node
        * @param {Node} newParent The new parent this node is moving to
        * @param {Number} index The index it is being moved to
        */
		/**
        * @ beforemove事件
        * 当树上一节点被移动到树上的新位置之前触发,返回false时取消移动
        * @param {Tree} tree The owner tree
        * @param {Node} node The node being moved
        * @param {Node} oldParent The parent of the node
        * @param {Node} newParent The new parent the node is moving to
        * @param {Number} index The index it is being moved to
        */
       "beforemove" : true,
       /**
        * @event beforeinsert
        * Fires before a new child is inserted, return false to cancel the insert.
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The child node to be inserted
        * @param {Node} refNode The child node the node is being inserted before
        */
		/**
        * @ beforeinsert事件
        * 当一新子节点被插入到树上某一节点之前触发该事件,返回false时取消插入
        * @param {Tree} tree 该树
        * @param {Node} parent 父节点 
        * @param {Node} node 插入的子节点
        * @param {Node} refNode 插入之前的子节点
        */
       "beforeinsert" : true
   });
    this.listeners = this.attributes.listeners;
    Ext.data.Node.superclass.constructor.call(this);
};

Ext.extend(Ext.data.Node, Ext.util.Observable, {
    fireEvent : function(evtName){
        // first do standard event for this node
		// 首先响应该节点的标准事件
        if(Ext.data.Node.superclass.fireEvent.apply(this, arguments) === false){
            return false;
        }
        // then bubble it up to the tree if the event wasn't cancelled
		// 然后在树中向上传递(只要事件未被取消)
        var ot = this.getOwnerTree();
        if(ot){
            if(ot.proxyNodeEvent.apply(ot, arguments) === false){
                return false;
            }
        }
        return true;
    },

    /**
     * Returns true if this node is a leaf
     * @return {Boolean}
     */
	 /**
     * 如果该节点为叶子节点,则返回true
     * @return {Boolean}
     */
    isLeaf : function(){
        return this.leaf === true;
    },

    // private
    setFirstChild : function(node){
        this.firstChild = node;
    },

    //private
    setLastChild : function(node){
        this.lastChild = node;
    },


    /**
     * Returns true if this node is the last child of its parent
     * @return {Boolean}
     */
	 /**
     * 如果该节点是父节点的子节点中最后一个节点时返回true
     * @return {Boolean}
     */
    isLast : function(){
       return (!this.parentNode ? true : this.parentNode.lastChild == this);
    },

    /**
     * Returns true if this node is the first child of its parent
     * @return {Boolean}
     */
	 /**
     * 如果该节点是父节点的子节点的第一个节点时返回true
     * @return {Boolean}
     */
    isFirst : function(){
       return (!this.parentNode ? true : this.parentNode.firstChild == this);
    },

    hasChildNodes : function(){
        return !this.isLeaf() && this.childNodes.length > 0;
    },

    /**
     * Insert node(s) as the last child node of this node.
     * @param {Node/Array} node The node or Array of nodes to append
     * @return {Node} The appended node if single append, or null if an array was passed
     */
	 /**
     * 插入节点作为该节点的最后一个子节点
     * @param {Node/Array} node 要接挂进来的节点或节点数组
     * @return {Node} 接挂一个则返回之.接挂多个则返回空
     */
    appendChild : function(node){
        var multi = false;
        if(node instanceof Array){
            multi = node;
        }else if(arguments.length > 1){
            multi = arguments;
        }
        // if passed an array or multiple args do them one by one
		// 如果传入的是数组.或多个参数.则一个一个的加
        if(multi){
            for(var i = 0, len = multi.length; i < len; i++) {
            	this.appendChild(multi[i]);
            }
        }else{
            if(this.fireEvent("beforeappend", this.ownerTree, this, node) === false){
                return false;
            }
            var index = this.childNodes.length;
            var oldParent = node.parentNode;
            // it's a move, make sure we move it cleanly
			// 这里移动.确保我们移动它cleanly
            if(oldParent){
                if(node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index) === false){
                    return false;
                }
                oldParent.removeChild(node);
            }
            index = this.childNodes.length;
            if(index == 0){
                this.setFirstChild(node);
            }
            this.childNodes.push(node);
            node.parentNode = this;
            var ps = this.childNodes[index-1];
            if(ps){
                node.previousSibling = ps;
                ps.nextSibling = node;
            }else{
                node.previousSibling = null;
            }
            node.nextSibling = null;
            this.setLastChild(node);
            node.setOwnerTree(this.getOwnerTree());
            this.fireEvent("append", this.ownerTree, this, node, index);
            if(oldParent){
                node.fireEvent("move", this.ownerTree, node, oldParent, this, index);
            }
            return node;
        }
    },

    /**
     * Removes a child node from this node.
     * @param {Node} node The node to remove
     * @return {Node} The removed node
     */
	 /**
     * 移队该节点的某一子节点
     * @param {Node} node 要被移除的节点
     * @return {Node} 被移除的节点
     */
    removeChild : function(node){
        var index = this.childNodes.indexOf(node);
        if(index == -1){
            return false;
        }
        if(this.fireEvent("beforeremove", this.ownerTree, this, node) === false){
            return false;
        }

        // remove it from childNodes collection
		// 从子节点集合中移除掉
        this.childNodes.splice(index, 1);

        // update siblings
		// 更新兄弟
        if(node.previousSibling){
            node.previousSibling.nextSibling = node.nextSibling;
        }
        if(node.nextSibling){
            node.nextSibling.previousSibling = node.previousSibling;
        }

        // update child refs
		// 更新子节点的引用
        if(this.firstChild == node){
            this.setFirstChild(node.nextSibling);
        }
        if(this.lastChild == node){
            this.setLastChild(node.previousSibling);
        }

        node.setOwnerTree(null);
        // clear any references from the node
		// 清除任何到该节点的引用
        node.parentNode = null;
        node.previousSibling = null;
        node.nextSibling = null;
        this.fireEvent("remove", this.ownerTree, this, node);
        return node;
    },

    /**
     * Inserts the first node before the second node in this nodes childNodes collection.
     * @param {Node} node The node to insert
     * @param {Node} refNode The node to insert before (if null the node is appended)
     * @return {Node} The inserted node
     */
	 /**
     * 在该节点的子节点集合中插入第一个节点于第二个个节点之前
     * @param {Node} node 要插入的节点
     * @param {Node} refNode 插入之前的节点 (如果为空.该节点被接挂)
     * @return {Node} 返回这插入的节点
     */
    insertBefore : function(node, refNode){
        if(!refNode){ // like standard Dom, refNode can be null for append
            return this.appendChild(node);
        }
        // nothing to do
        if(node == refNode){
            return false;
        }

        if(this.fireEvent("beforeinsert", this.ownerTree, this, node, refNode) === false){
            return false;
        }
        var index = this.childNodes.indexOf(refNode);
        var oldParent = node.parentNode;
        var refIndex = index;

        // when moving internally, indexes will change after remove
		// 当移动在内部进行时,索引将会在移动之后改变
        if(oldParent == this && this.childNodes.indexOf(node) < index){
            refIndex--;
        }

        // it's a move, make sure we move it cleanly
		// 这里移动.确保移动cleanly
        if(oldParent){
            if(node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index, refNode) === false){
                return false;
            }
            oldParent.removeChild(node);
        }
        if(refIndex == 0){
            this.setFirstChild(node);
        }
        this.childNodes.splice(refIndex, 0, node);
        node.parentNode = this;
        var ps = this.childNodes[refIndex-1];
        if(ps){
            node.previousSibling = ps;
            ps.nextSibling = node;
        }else{
            node.previousSibling = null;
        }
        node.nextSibling = refNode;
        refNode.previousSibling = node;
        node.setOwnerTree(this.getOwnerTree());
        this.fireEvent("insert", this.ownerTree, this, node, refNode);
        if(oldParent){
            node.fireEvent("move", this.ownerTree, node, oldParent, this, refIndex, refNode);
        }
        return node;
    },

    /**
     * Returns the child node at the specified index.
     * @param {Number} index
     * @return {Node}
     */
	 /**
     * 返回指定索引的子节点.
     * @param {Number} 索引
     * @return {Node}
     */
    item : function(index){
        return this.childNodes[index];
    },

    /**
     * Replaces one child node in this node with another.
     * @param {Node} newChild The replacement node
     * @param {Node} oldChild The node to replace
     * @return {Node} The replaced node
     */
	 /**
     * 用另一个节点来替换该节点的一个子节点
     * @param {Node} 新节点
     * @param {Node} 被替的子节点
     * @return {Node} 被替的子节点
     */
    replaceChild : function(newChild, oldChild){
        this.insertBefore(newChild, oldChild);
        this.removeChild(oldChild);
        return oldChild;
    },

    /**
     * Returns the index of a child node
     * @param {Node} node
     * @return {Number} The index of the node or -1 if it was not found
     */
	 /**
     * 返回子节点的索引
     * @param {Node} node
     * @return {Number} 返回指定子节点的索引,如果未找到则返回空
     */
    indexOf : function(child){
        return this.childNodes.indexOf(child);
    },

    /**
     * Returns the tree this node is in.
     * @return {Tree}
     */
	 /**
     * Returns 返回该节点所在的树.
     * @return {Tree}
     */
    getOwnerTree : function(){
        // if it doesn't have one, look for one
		// 如果当前结点直接没有此属性.则向上找
        if(!this.ownerTree){
            var p = this;
            while(p){
                if(p.ownerTree){
                    this.ownerTree = p.ownerTree;
                    break;
                }
                p = p.parentNode;
            }
        }
        return this.ownerTree;
    },

    /**
     * Returns depth of this node (the root node has a depth of 0)
     * @return {Number}
     */
	 /**
     * 返回节点的深度,根节点深度为0
     * @return {Number}
     */
    getDepth : function(){
        var depth = 0;
        var p = this;
        while(p.parentNode){
            ++depth;
            p = p.parentNode;
        }
        return depth;
    },

    // private
    setOwnerTree : function(tree){
        // if it's move, we need to update everyone
		// 如果移动.我们需要更新所有节点
        if(tree != this.ownerTree){
            if(this.ownerTree){
                this.ownerTree.unregisterNode(this);
            }
            this.ownerTree = tree;
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++) {
            	cs[i].setOwnerTree(tree);
            }
            if(tree){
                tree.registerNode(this);
            }
        }
    },

    /**
     * Returns the path for this node. The path can be used to expand or select this node programmatically.
     * @param {String} attr (optional) The attr to use for the path (defaults to the node's id)
     * @return {String} The path
     */
	  /**
     * 返回该节点的路径.路径能被用来扩展或选择节点
     * @param {String} attr (可选项) 为路径服务的属性 (默认为节点的ID)
     * @return {String} 路径
     */
    getPath : function(attr){
        attr = attr || "id";
        var p = this.parentNode;
        var b = [this.attributes[attr]];
        while(p){
            b.unshift(p.attributes[attr]);
            p = p.parentNode;
        }
        var sep = this.getOwnerTree().pathSeparator;
        return sep + b.join(sep);
    },

    /**
     * Bubbles up the tree from this node, calling the specified function with each node. The scope (<i>this</i>) of
     * function call will be the scope provided or the current node. The arguments to the function
     * will be the args provided or the current node. If the function returns false at any point,
     * the bubble is stopped.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current node)
     * @param {Array} args (optional) The args to call the function with (default to passing the current node)
     */
	  /**
     * 在树中.从该节点往上的各节点调用指定的函数, 该函数的作用域为提供的作用域或当前节点.该函数的参数为提供的
	 * 参数或当前节点作参数.如果该函数在任一点返回false,则停上bubble
     * @param {Function} fn 要调用的函数
     * @param {Object} scope (可选项) 函数的作用域 (默认为当前节点)
     * @param {Array} args (可选项) 调用函数时所带的参数 (默认值为传递当前节点)
     */
    bubble : function(fn, scope, args){
        var p = this;
        while(p){
            if(fn.call(scope || p, args || p) === false){
                break;
            }
            p = p.parentNode;
        }
    },

    /**
     * Cascades down the tree from this node, calling the specified function with each node. The scope (<i>this</i>) of
     * function call will be the scope provided or the current node. The arguments to the function
     * will be the args provided or the current node. If the function returns false at any point,
     * the cascade is stopped on that branch.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current node)
     * @param {Array} args (optional) The args to call the function with (default to passing the current node)
     */
	 /**
     * 在树中.从该节点往下的各节点调用指定的函数, 该函数的作用域为提供的作用域或当前节点.该函数的参数为提供的
	 * 参数或当前节点作参数.如果该函数在任一点返回false,则停上该分支下的遍历
     * @param {Function} fn 要调用的函数
     * @param {Object} scope (可选项) 函数的作用域 (默认为当前节点)
     * @param {Array} args (可选项) 调用函数时所带的参数 (默认值为传递当前节点)
     */
    cascade : function(fn, scope, args){
        if(fn.call(scope || this, args || this) !== false){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++) {
            	cs[i].cascade(fn, scope, args);
            }
        }
    },

    /**
     * Interates the child nodes of this node, calling the specified function with each node. The scope (<i>this</i>) of
     * function call will be the scope provided or the current node. The arguments to the function
     * will be the args provided or the current node. If the function returns false at any point,
     * the iteration stops.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current node)
     * @param {Array} args (optional) The args to call the function with (default to passing the current node)
     */
	 /**
     * 遍历该节点的子节点, 各节点调用指定的函数. 该函数的作用域是提供的作用域,或是当前节点. 该函数的参数是提供的参数.或当前节点.当任何一点该函数返回false则停止遍历
     * @param {Function} fn 调用的函数
     * @param {Object} scope (可选项) 函数的作用域 (默认为当前节点)
     * @param {Array} args (可选项) 调用函数时所带的参数 (默认值为传递当前节点)
     */
    eachChild : function(fn, scope, args){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	if(fn.call(scope || this, args || cs[i]) === false){
        	    break;
        	}
        }
    },

    /**
     * Finds the first child that has the attribute with the specified value.
     * @param {String} attribute The attribute name
     * @param {Mixed} value The value to search for
     * @return {Node} The found child or null if none was found
     */
	 /**
     * 返回子节点中第一个匹配指字属性值的子切点.
     * @param {String} attribute 属性名
     * @param {Mixed} value 属性值
     * @return {Node} 如果找到则返回之.未找到返回空
     */
    findChild : function(attribute, value){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	if(cs[i].attributes[attribute] == value){
        	    return cs[i];
        	}
        }
        return null;
    },

    /**
     * Finds the first child by a custom function. The child matches if the function passed
     * returns true.
     * @param {Function} fn
     * @param {Object} scope (optional)
     * @return {Node} The found child or null if none was found
     */
	 /**
     * 根据客户函数找到第一个匹配的子节点. 子节点匹配函数时返回true.
     * @param {Function} 函数
     * @param {Object} scope (可选项)
     * @return {Node} 如果找到则返回之.未找到返回空
     */
    findChildBy : function(fn, scope){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	if(fn.call(scope||cs[i], cs[i]) === true){
        	    return cs[i];
        	}
        }
        return null;
    },

    /**
     * Sorts this nodes children using the supplied sort function
     * @param {Function} fn
     * @param {Object} scope (optional)
     */
	 /**
     * 使用指定的函数为该节点的子节点排序
     * @param {Function} fn
     * @param {Object} scope (optional)
     */
    sort : function(fn, scope){
        var cs = this.childNodes;
        var len = cs.length;
        if(len > 0){
            var sortFn = scope ? function(){fn.apply(scope, arguments);} : fn;
            cs.sort(sortFn);
            for(var i = 0; i < len; i++){
                var n = cs[i];
                n.previousSibling = cs[i-1];
                n.nextSibling = cs[i+1];
                if(i == 0){
                    this.setFirstChild(n);
                }
                if(i == len-1){
                    this.setLastChild(n);
                }
            }
        }
    },

    /**
     * Returns true if this node is an ancestor (at any point) of the passed node.
     * @param {Node} node
     * @return {Boolean}
     */
	 /**
     * 如果该节点是传入的节点的祖先,则返回true.
     * @param {Node} node
     * @return {Boolean}
     */
    contains : function(node){
        return node.isAncestor(this);
    },

    /**
     * Returns true if the passed node is an ancestor (at any point) of this node.
     * @param {Node} node
     * @return {Boolean}
     */
	 /**
     * 如果传入的节点是该节点的祖先,则返回true.
     * @param {Node} node
     * @return {Boolean}
     */
    isAncestor : function(node){
        var p = this.parentNode;
        while(p){
            if(p == node){
                return true;
            }
            p = p.parentNode;
        }
        return false;
    },

    toString : function(){
        return "[Node"+(this.id?" "+this.id:"")+"]";
    }
});