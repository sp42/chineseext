/*
 * @version Sencha 1.0 RC-1
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */
/**
 * @class Ext.data.Node
 * @extends Ext.util.Observable
 * @cfg {Boolean} leaf true表示该节点是树叶节点没有子节点。
 * true if this node is a leaf and does not have children
 * @cfg {String} id 该节点的Id。如不指定一个，会生成一个。
 * The id for this node. If one is not specified, one is generated.
 * @constructor
 * @param {Object} attributes 节点的属性/配置项。The attributes/config for the node
 */
Ext.data.Node = Ext.extend(Ext.util.Observable, {

    constructor: function(attributes) {
        /**
	     * 节点属性。你可以在此添加任意的自定义的属性。
	     * The attributes supplied for the node. You can use this property to access any custom attributes you supplied.
	     * @type Object
	     * @property attributes
     	*/
        this.attributes = attributes || {};

        this.leaf = !!this.attributes.leaf;
        /**
         * 节点ID。The node id. 
         * @type String
         * @property id
         */
        this.id = this.attributes.id;

        if (!this.id) {
            this.id = Ext.id(null, "xnode-");
            this.attributes.id = this.id;
        }
         /**
         * 此节点的所有子节点。
         * All child nodes of this node. 
         * @type Array
         * @property childNodes
         */    
        this.childNodes = [];
    
        /**
         * 此节点的父节点。
         * The parent node for this node. 
         * @type Node
         * @property parentNode
         */
        this.parentNode = null;

         /**
         * 该节点下面最前一个子节点（直属的），null的话就表示这是没有子节点的。
          * The first direct child node of this node, or null if this node has no child nodes. 
         * @type Node
         * @property firstChild
         */
        this.firstChild = null;

         /**
         * 该节点下面最后一个子节点（直属的），null的话就表示这是没有子节点的。
          * The last direct child node of this node, or null if this node has no child nodes. 
         * @type Node
         * @property lastChild
         */
        this.lastChild = null;

         /**
         * 该节点前面一个节点，同级的，null的话就表示这没有侧边节点。 
         * The node immediately preceding this node in the tree, or null if there is no sibling node. 
         * @type Node
         * @property previousSibling
         */

        this.previousSibling = null;

         /**
         * 该节点后面一个节点，同级的，null的话就表示这没有侧边节点。 
         * The node immediately following this node in the tree, or null if there is no sibling node. 
         * @type Node
         * @property nextSibling
         */
        this.nextSibling = null;

        this.addEvents({
	       /**
	        * @event append
	        * 当有新的子节点添加时触发。
	        * Fires when a new child node is appended
	        * @param {Tree} tree 主树。The owner tree
	        * @param {Node} this 此节点。This node
	        * @param {Node} node 新加入的节点。The newly appended node
	        * @param {Number} index 新加入节点的索引值。The index of the newly appended node
	        */
	       "append" : true,
	       /**
	        * @event remove
	        * 当有子节点被移出的时候触发。
	        * Fires when a child node is removed
	        * @param {Tree} tree 主树。The owner tree
	        * @param {Node} this 此节点。This node
	        * @param {Node} node 被移出的节点。The removed node
	        */
	       "remove" : true,
	       /**
	        * @event move
	        * 当该节点移动到树中的新位置触发。
	        * Fires when this node is moved to a new location in the tree
	        * @param {Tree} tree 主树。The owner tree
	        * @param {Node} this 此节点。This node
	        * @param {Node} oldParent 原来的父节点。The old parent of this node
	        * @param {Node} newParent 新的父节点。The new parent of this node
	        * @param {Number} index 移入的新索引。The index it was moved to
	        */
	       "move" : true,
	       /**
	        * @event insert
	        * 当有子节点被插入的触发。
	        * Fires when a new child node is inserted.
	        * @param {Tree} tree 主树。The owner tree
	        * @param {Node} this 此节点。This node
	        * @param {Node} node 插入的新子节点。The child node inserted
	        * @param {Node} refNode 被插入节点的前面一个字节点。The child node the node was inserted before
	        */
	       "insert" : true,
	       /**
	        * @event beforeappend
	        * 当有新的子节点被添加时触发，返回false就取消添加。
	        * Fires before a new child is appended, return false to cancel the append.
	        * @param {Tree} tree 主树。The owner tree
	        * @param {Node} this 此节点。This node
	        * @param {Node} node 新加入的子节点。The child node to be appended
	        */
	       "beforeappend" : true,
	       /**
	        * @event beforeremove
	        * 当有子节点被移出的时候触发，返回false就取消移出。
	        * Fires before a child is removed, return false to cancel the remove.
	        * @param {Tree} tree 主树。The owner tree
	        * @param {Node} this 此节点。This node
	        * @param {Node} node 被移出的子节点。The child node to be removed
	        */
	       "beforeremove" : true,
	       /**
	        * @event beforemove
	        * 当该节点移动到树下面的另外一个新位置的时候触发。返回false就取消移动。
	        * Fires before this node is moved to a new location in the tree. Return false to cancel the move.
	        * @param {Tree} tree 主树。The owner tree
	        * @param {Node} this 此节点。This node
	        * @param {Node} oldParent 该节点的父节点。The parent of this node
	        * @param {Node} newParent 将要移入新位置的父节点。The new parent this node is moving to
	        * @param {Number} index 将要移入的新索引。The index it is being moved to
	        */
	       "beforemove" : true,
	       /**
	        * @event beforeinsert
	        * 当有新的节点插入时触发，返回false就取消插入。
	        * Fires before a new child is inserted, return false to cancel the insert.
	        * @param {Tree} tree 主树。The owner tree
	        * @param {Node} this 此节点。This node
	        * @param {Node} node 被插入的子节点。The child node to be inserted
	        * @param {Node} refNode 被插入节点的前面一个字节点。The child node the node is being inserted before
	        */
	       "beforeinsert" : true
        });

        this.listeners = this.attributes.listeners;
        Ext.data.Node.superclass.constructor.call(this);
    },

    // private
    fireEvent : function(evtName) {
        // first do standard event for this node
        if (Ext.data.Node.superclass.fireEvent.apply(this, arguments) === false) {
            return false;
        }

        // then bubble it up to the tree if the event wasn't cancelled
        var ot = this.getOwnerTree();
        if (ot) {
            if (ot.proxyNodeEvent.apply(ot, arguments) === false) {
                return false;
            }
        }
        return true;
    },
    
    /**
     * 若节点是叶子节点的话返回true。
     * Returns true if this node is a leaf
     * @return {Boolean}
     */
    isLeaf : function() {
        return this.leaf === true;
    },

    // private
    setFirstChild : function(node) {
        this.firstChild = node;
    },

    //private
    setLastChild : function(node) {
        this.lastChild = node;
    },


    /**
     * 如果这个节点是其父节点下面的最后一个节点的话返回true。
     * Returns true if this node is the last child of its parent
     * @return {Boolean}
     */
    isLast : function() {
       return (!this.parentNode ? true : this.parentNode.lastChild == this);
    },

    /**
     * 如果这个节点是其父节点下面的第一个节点的话返回true。
     * Returns true if this node is the first child of its parent
     * @return {Boolean}
     */
    isFirst : function() {
       return (!this.parentNode ? true : this.parentNode.firstChild == this);
    },

    /**
     * 如果有子节点返回true。
     * Returns true if this node has one or more child nodes, else false.
     * @return {Boolean}
     */
    hasChildNodes : function() {
        return !this.isLeaf() && this.childNodes.length > 0;
    },
 
    /**
     * 如果该节点有一个或多个的子节点，或其节点<tt>可展开的</tt>属性是明确制定为true的话返回true。
     * Returns true if this node has one or more child nodes, or if the <tt>expandable</tt>
     * node attribute is explicitly specified as true (see {@link #attributes}), otherwise returns false.
     * @return {Boolean}
     */    

    isExpandable : function() {
        return this.attributes.expandable || this.hasChildNodes();
    },

    /**
     * 在该节点里面最后的位置上插入节点，可以多个。
     * Insert node(s) as the last child node of this node.
     * @param {Node/Array} node 要加入的节点或节点数组。The node or Array of nodes to append
     * @return {Node} 如果是单个节点，加入后返回true，如果是数组返回null。The appended node if single append, or null if an array was passed
     */
    appendChild : function(node) {
        var multi = false,
            i, len;

        if (Ext.isArray(node)) {
            multi = node;
        } else if (arguments.length > 1) {
            multi = arguments;
        }

        // if passed an array or multiple args do them one by one
        if (multi) {
            len = multi.length;

            for (i = 0; i < len; i++) {
                this.appendChild(multi[i]);
            }
        } else {
            if (this.fireEvent("beforeappend", this.ownerTree, this, node) === false) {
                return false;
            }

            var index = this.childNodes.length;
            var oldParent = node.parentNode;

            // it's a move, make sure we move it cleanly
            if (oldParent) {
                if (node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index) === false) {
                    return false;
                }
                oldParent.removeChild(node);
            }

            index = this.childNodes.length;
            if (index === 0) {
                this.setFirstChild(node);
            }

            this.childNodes.push(node);
            node.parentNode = this;
            var ps = this.childNodes[index-1];
            if (ps) {
                node.previousSibling = ps;
                ps.nextSibling = node;
            } else {
                node.previousSibling = null;
            }

            node.nextSibling = null;
            this.setLastChild(node);
            node.setOwnerTree(this.getOwnerTree());
            this.fireEvent("append", this.ownerTree, this, node, index);

            if (oldParent) {
                node.fireEvent("move", this.ownerTree, node, oldParent, this, index);
            }

            return node;
        }
    },

    /**
     * 
     * Removes a child node from this node.
     * @param {Node} node 要移除的节点。The node to remove
     * @return {Node} 移除后的节点。The removed node
     */
    /**
     * 从该节点中移除一个子节点。Removes a child node from this node.
     * @param {Node} node 要移除的节点。The node to remove
     * @param {Boolean} destroy <tt>true</tt>表示为，移除之后要销毁这个节点。默认为<tt>false</tt>。<tt>true</tt> to destroy the node upon removal. Defaults to <tt>false</tt>.
     * @return {Node}移除后的节点。 The removed node
     */
    removeChild : function(node, destroy) {
        var index = this.indexOf(node);

        if (index == -1) {
            return false;
        }
        if (this.fireEvent("beforeremove", this.ownerTree, this, node) === false) {
            return false;
        }

        // remove it from childNodes collection
        this.childNodes.splice(index, 1);

        // update siblings
        if (node.previousSibling) {
            node.previousSibling.nextSibling = node.nextSibling;
        }
        if (node.nextSibling) {
            node.nextSibling.previousSibling = node.previousSibling;
        }

        // update child refs
        if (this.firstChild == node) {
            this.setFirstChild(node.nextSibling);
        }
        if (this.lastChild == node) {
            this.setLastChild(node.previousSibling);
        }

        this.fireEvent("remove", this.ownerTree, this, node);
        if (destroy) {
            node.destroy(true);
        } else {
            node.clear();
        }

        return node;
    },

    // private
    clear : function(destroy) {
        // clear any references from the node
        this.setOwnerTree(null, destroy);
        this.parentNode = this.previousSibling = this.nextSibling = null;
        if (destroy) {
            this.firstChild = this.lastChild = null;
        }
    },

    /**
     * 销毁节点
     * Destroys the node.
     */
    destroy : function(silent) {
        /*
         * Silent is to be used in a number of cases
         * 1) When setRootNode is called.
         * 2) When destroy on the tree is called
         * 3) For destroying child nodes on a node
         */
        if (silent === true) {
            this.clearListeners();
            this.clear(true);
            Ext.each(this.childNodes, function(n) {
                n.destroy(true);
            });
            this.childNodes = null;
        } else {
            this.remove(true);
        }
    },

    /**
     * 在当前节点的子节点的集合中，位于第二个节点之前插入节点（第一个参数）。
     * Inserts the first node before the second node in this nodes childNodes collection.
     * @param {Node} node 要插入的节点。he node to insert
     * @param {Node} refNode 前面插入的节点（如果为null表示节点是追加的）。The node to insert before (if null the node is appended)
     * @return {Node} 插入的节点。The inserted node
     */
    insertBefore : function(node, refNode) {
        if (!refNode) { // like standard Dom, refNode can be null for append
            return this.appendChild(node);
        }
        // nothing to do
        if (node == refNode) {
            return false;
        }

        if (this.fireEvent("beforeinsert", this.ownerTree, this, node, refNode) === false) {
            return false;
        }

        var index     = this.indexOf(refNode),
            oldParent = node.parentNode,
            refIndex  = index;

        // when moving internally, indexes will change after remove
        if (oldParent == this && this.indexOf(node) < index) {
            refIndex--;
        }

        // it's a move, make sure we move it cleanly
        if (oldParent) {
            if (node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index, refNode) === false) {
                return false;
            }
            oldParent.removeChild(node);
        }

        if (refIndex === 0) {
            this.setFirstChild(node);
        }

        this.childNodes.splice(refIndex, 0, node);
        node.parentNode = this;

        var ps = this.childNodes[refIndex-1];

        if (ps) {
            node.previousSibling = ps;
            ps.nextSibling = node;
        } else {
            node.previousSibling = null;
        }

        node.nextSibling = refNode;
        refNode.previousSibling = node;
        node.setOwnerTree(this.getOwnerTree());
        this.fireEvent("insert", this.ownerTree, this, node, refNode);

        if (oldParent) {
            node.fireEvent("move", this.ownerTree, node, oldParent, this, refIndex, refNode);
        }
        return node;
    },

    /**
     * 从父节点上移除子节点。Removes this node from its parent
     * @param {Boolean} destroy <tt>true</tt>表示为，移除之后要销毁这个节点。默认为<tt>false</tt>。<tt>true</tt> to destroy the node upon removal. Defaults to <tt>false</tt>.
     * @return {Node} this
     */
    remove : function(destroy) {
        var parentNode = this.parentNode;

        if (parentNode) {
            parentNode.removeChild(this, destroy);
        }
        return this;
    },

    /**
     * 从这个节点上移除所有的子节点。
     * Removes all child nodes from this node.
     * @param {Boolean} destroy <tt>true</tt>表示为，移除之后要销毁这个节点。默认为<tt>false</tt>。<tt>true</tt> to destroy the node upon removal. Defaults to <tt>false</tt>.
     * @return {Node} this
     */
    removeAll : function(destroy) {
        var cn = this.childNodes,
            n;

        while ((n = cn[0])) {
            this.removeChild(n, destroy);
        }
        return this;
    },

     /**
     * 指定索引，在自节点中查找匹配索引的节点。
     * Returns the child node at the specified index.
     * @param {Number} index
     * @return {Node}
     */
    getChildAt : function(index) {
        return this.childNodes[index];
    },

    /**
     * 把下面的某个子节点替换为其他节点。
     * Replaces one child node in this node with another.
     * @param {Node} newChild 进来的节点。The replacement node
     * @param {Node} oldChild 去掉的节点。The node to replace
     * @return {Node} 去掉的节点。The replaced node
     */
    replaceChild : function(newChild, oldChild) {
        var s = oldChild ? oldChild.nextSibling : null;

        this.removeChild(oldChild);
        this.insertBefore(newChild, s);
        return oldChild;
    },

    /**
     * 返回某个子节点的索引。
     * Returns the index of a child node
     * @param {Node} node 节点
     * @return {Number} 节点的索引或是-1表示找不到。The index of the node or -1 if it was not found
     */
    indexOf : function(child) {
        return this.childNodes.indexOf(child);
    },

    /**
     * 返回节点所在的树对象。
     * Returns the tree this node is in.
     * @return {Tree}
     */
    getOwnerTree : function() {
        // if it doesn't have one, look for one
        if (!this.ownerTree) {
            var p = this;

            while (p) {
                if (p.ownerTree) {
                    this.ownerTree = p.ownerTree;
                    break;
                }
                p = p.parentNode;
            }
        }

        return this.ownerTree;
    },

    /**
     * 返回该节点的深度（根节点的深度是0）。
     * Returns depth of this node (the root node has a depth of 0)
     * @return {Number}
     */
    getDepth : function() {
        var depth = 0,
            p     = this;

        while (p.parentNode) {
            ++depth;
            p = p.parentNode;
        }

        return depth;
    },

    // private
    setOwnerTree : function(tree, destroy) {
        // if it is a move, we need to update everyone
        if (tree != this.ownerTree) {
            if (this.ownerTree) {
                this.ownerTree.unregisterNode(this);
            }
            this.ownerTree = tree;

            // If we're destroying, we don't need to recurse since it will be called on each child node
            if (destroy !== true) {
                Ext.each(this.childNodes, function(n) {
                    n.setOwnerTree(tree);
                });
            }
            if (tree) {
                tree.registerNode(this);
            }
        }
    },

    /**
     * 改变该节点的id
     * Changes the id of this node.
     * @param {String} id 节点的新id。The new id for the node.
     */
    setId: function(id) {
        if (id !== this.id) {
            var t = this.ownerTree;
            if (t) {
                t.unregisterNode(this);
            }
            this.id = this.attributes.id = id;
            if (t) {
                t.registerNode(this);
            }
            this.onIdChange(id);
        }
    },

    // private
    onIdChange: Ext.emptyFn,

    /**
     * 返回该节点的路径，以方便控制这个节点展开或选择。
     * Returns the path for this node. The path can be used to expand or select this node programmatically.
     * @param {String} attr（可选的）路径采用的属性（默认为节点的id）。 (optional) The attr to use for the path (defaults to the node's id)
     * @return {String} 路径。The path
     */
    getPath : function(attr) {
        attr = attr || "id";
        var p = this.parentNode,
            b = [this.attributes[attr]];

        while (p) {
            b.unshift(p.attributes[attr]);
            p = p.parentNode;
        }

        var sep = this.getOwnerTree().pathSeparator;
        return sep + b.join(sep);
    },

    /**
     * 从该节点开始逐层上报(Bubbles up)节点，上报过程中对每个节点执行指定的函数。
     * 函数的作用域（<i>this</i>）既可是参数scope传入或是当前节点。
     * 函数的参数可经由args指定或当前节点，如果函数在某一个层次上返回false，上升将会停止。Bubbles up the tree from this node, calling the specified function with each node. The scope (<i>this</i>) of
     * function call will be the scope provided or the current node. The arguments to the function
     * will be the args provided or the current node. If the function returns false at any point,
     * the bubble is stopped.
     * @param {Function} fn 要调用的函数。The function to call
     * @param {Object} scope（可选的）函数的作用域（默认为当前节点）。(optional)The scope of the function (defaults to current node)
     * @param {Array} args （可选的）调用的函数要送入的参数（不指定就默认为遍历过程中当前的节点）。(optional)The args to call the function with (default to passing the current node)
     */

    bubble : function(fn, scope, args) {
        var p = this;
        while (p) {
            if (fn.apply(scope || p, args || [p]) === false) {
                break;
            }
            p = p.parentNode;
        }
    },
    

    //<deprecated since=0.99>
    cascade: function() {
        throw "Ext.data.Node: cascade method renamed to cascadeBy.";
    },
    //</deprecated>

    /**
     * 从该节点开始逐层下报(Bubbles up)节点，上报过程中对每个节点执行指定的函数。
     * 函数的作用域（<i>this</i>）既可是参数scope传入或是当前节点。
     * 函数的参数可经由args指定或当前节点，如果函数在某一个层次上返回false，下升到那个分支的位置将会停止。
     * Cascades down the tree from this node, calling the specified function with each node. The arguments to the function
     * will be the args provided or the current node. If the function returns false at any point,
     * the cascade is stopped on that branch.
     * @param {Function} fn 要调用的函数。The function to call
     * @param {Object} scope （可选的） 函数的作用域（默认为当前节点）。(optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the current Node.
     * @param {Array} args （可选的） 调用的函数要送入的参数（不指定就默认为遍历过程中当前的节点）。(optional) The args to call the function with (default to passing the current Node)
     */
    cascadeBy : function(fn, scope, args) {
        if (fn.apply(scope || this, args || [this]) !== false) {
            var childNodes = this.childNodes,
                length     = childNodes.length,
                i;

            for (i = 0; i < length; i++) {
                childNodes[i].cascadeBy(fn, scope, args);
            }
        }
    },


    /**
     * 遍历该节点下的子节点，枚举过程中对每个节点执行指定的函数。函数的作用域（<i>this</i>）既可是参数scope传入或是当前节点。
     * 函数的参数可经由args指定或当前节点，如果函数走到某处地方返回false，遍历将会停止。
     * Interates the child nodes of this node, calling the specified function with each node. The arguments to the function
     * will be the args provided or the current node. If the function returns false at any point,
     * the iteration stops.
     * @param {Function} fn 要调用的函数。The function to call
     * @param {Object} scope （可选的） 函数的作用域（默认为当前节点）。(optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the current Node in the iteration.
     * @param {Array} args （可选的） 调用的函数要送入的参数（不指定就默认为遍历过程中当前的节点）。(optional) The args to call the function with (default to passing the current Node)
     */
    eachChild : function(fn, scope, args) {
        var childNodes = this.childNodes,
            length     = childNodes.length,
            i;

        for (i = 0; i < length; i++) {
            if (fn.apply(scope || this, args || [childNodes[i]]) === false) {
                break;
            }
        }
    },

    /**
     * 根据送入的值，如果子节点身上指定属性的值是送入的值，就返回那个节点。
     * Finds the first child that has the attribute with the specified value.
     * @param {String} attribute 属性名称。The attribute name
     * @param {Mixed} value 要查找的值。The value to search for
     * @param {Boolean} deep (Optional) True to search through nodes deeper than the immediate children
     * @return {Node} 已找到的子节点或null表示找不到。The found child or null if none was found
     */
    findChild : function(attribute, value, deep) {
        return this.findChildBy(function(){
            return this.attributes[attribute] == value;
        }, null, deep);
    },

    /**
     * 通过传入的一个函数执行后查找子元素。如果函数返回<code>true</code>表面这个子元素符合要求，而且停止查找。
     * Finds the first child by a custom function. The child matches if the function passed returns <code>true</code>.
     * @param {Function} fn 要调用的函数。A function which must return <code>true</code> if the passed Node is the required Node.
     * @param {Object} scope （可选的） 函数的作用域（默认为当前节点）。(optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the Node being tested.
     * @param {Boolean} deep (Optional) True to search through nodes deeper than the immediate children
     * @return {Node} 已找到的子节点或null表示找不到。The found child or null if none was found
     */
    findChildBy : function(fn, scope, deep) {
        var cs = this.childNodes,
            len = cs.length,
            i = 0,
            n,
            res;

        for(; i < len; i++){
            n = cs[i];
            if(fn.call(scope || n, n) === true){
                return n;
            }else if (deep){
                res = n.findChildBy(fn, scope, deep);
                if(res != null){
                    return res;
                }
            }

        }

        return null;
    },

    /**
     * 用自定义的排序函数对节点的子函数进行排序。Sorts this nodes children using the supplied sort function.
     * @param {Function} fn 函数。A function which, when passed two Nodes, returns -1, 0 or 1 depending upon required sort order.
     * @param {Object} scope  函数（可选的）。(optional)The scope (<code>this</code> reference) in which the function is executed. Defaults to the browser window.
     */
    sort : function(fn, scope) {
        var cs  = this.childNodes,
            len = cs.length,
            i, n;

        if (len > 0) {
            var sortFn = scope ? function(){return fn.apply(scope, arguments);} : fn;
            cs.sort(sortFn);
            for (i = 0; i < len; i++) {
                n = cs[i];
                n.previousSibling = cs[i-1];
                n.nextSibling = cs[i+1];

                if (i === 0){
                    this.setFirstChild(n);
                }
                if (i == len - 1) {
                    this.setLastChild(n);
                }
            }
        }
    },

    /**
     * 返回true表示为该节点是送入节点的祖先节点（无论在哪那一级的）。
     * Returns true if this node is an ancestor (at any point) of the passed node.
     * @param {Node} node 节点
     * @return {Boolean}
     */
    contains : function(node) {
        return node.isAncestor(this);
    },

     /**
     * 返回true表示为送入的节点是该的祖先节点（无论在哪那一级的）。
     * Returns true if the passed node is an ancestor (at any point) of this node.
     * @param {Node} node 节点
     * @return {Boolean}
     */
    isAncestor : function(node) {
        var p = this.parentNode;
        while (p) {
            if (p == node) {
                return true;
            }
            p = p.parentNode;
        }
        return false;
    },

    toString : function() {
        return "[Node" + (this.id ? " " + this.id : "") + "]";
    }
});


Ext.data.RecordNode = Ext.extend(Ext.data.Node, {
    constructor: function(config) {
        config = config || {};
        if (config.record) {
            // provide back reference
            config.record.node = this;
        }
        Ext.data.RecordNode.superclass.constructor.call(this, config);
    },

    getChildRecords: function() {
        var cn = this.childNodes,
            ln = cn.length,
            i = 0,
            rs = [],
            r;

        for (; i < ln; i++) {
            r = cn[i].attributes.record;
            // Hack to inject leaf attribute into the
            // data portion of a record, this will be
            // removed once Record and Ext.data.Node have
            // been combined rather than aggregated.
            r.data.leaf = cn[i].leaf;
            rs.push(r);
        }
        return rs;
    },

    getRecord: function() {
        return this.attributes.record;
    },


    getSubStore: function() {

        // <debug>
        if (this.isLeaf()) {
            throw "Attempted to get a substore of a leaf node.";
        }
        // </debug>

        var treeStore = this.getOwnerTree().treeStore;
        if (!this.subStore) {
            this.subStore = new Ext.data.Store({
                model: treeStore.model
            });
            // if records have already been preLoaded, apply them
            // to the subStore, if not they will be loaded by the
            // read within the TreeStore itself.
            var children = this.getChildRecords();
            this.subStore.add.apply(this.subStore, children);
        }

        if (!this.loaded) {
            treeStore.load({
                node: this
            });
        }
        return this.subStore;
    },

    destroy : function(silent) {
        if (this.subStore) {
            this.subStore.destroyStore();
        }
        var attr = this.attributes;
        if (attr.record) {
            delete attr.record.node;
            delete attr.record;
        }

        return Ext.data.RecordNode.superclass.destroy.call(this, silent);
    }
});