/**
 * @class Ext.data.Tree
 * @extends Ext.util.Observable
 * 该对象抽象了一棵树的结构和树节点的事件上报。树包含的节点拥有大部分的DOM功能。
 * @constructor
 * @param {Node} root （可选的） 根节点
 */
Ext.data.Tree = function(root){
   this.nodeHash = {};
   /**
    * 该树的根节点
    * @type Node
    */
   this.root = null;
   if(root){
       this.setRootNode(root);
   }
   this.addEvents(
       /**
        * @event append
        * 当有新的节点添加到这棵树的时候触发。
        * @param {Tree} tree 主树
        * @param {Node} parent 父节点
        * @param {Node} node 新增加的节点
        * @param {Number} index 新增加的节点的索引
        */
       "append",
       /**
        * @event remove
        * 当树中有子节点从一个节点那里移动开来的时候触发。
        * @param {Tree} tree 主树
        * @param {Node} parent 父节点
        * @param {Node} node 要移除的节点
        */
       "remove",
       /**
        * @event move
        * 当树中有节点被移动到新的地方时触发。
        * @param {Tree} tree 主树
        * @param {Node} node 移动的节点
        * @param {Node} oldParent 该节点的旧父节点
        * @param {Node} newParent 该节点的新父节点
        * @param {Number} index 被移动的原索引
        */
       "move",
       /**
        * @event insert
        * 当树中有一个新的节点添加到某个节点上的时候触发。
        * @param {Tree} tree 主树
        * @param {Node} parent 父节点
        * @param {Node} node 插入的子节点
        * @param {Node} refNode 节点之前插入的子节点
        */
       "insert",
       /**
        * @event beforeappend
        * 当树中有新的子节点添加到某个节点上之前触发，返回false表示取消这个添加行动。
        * @param {Tree} tree 主树
        * @param {Node} parent 父节点
        * @param {Node} node 要被添加的子节点
        */
       "beforeappend",
       /**
        * @event beforeremove
        * 当树中有新的子节点移除到某个节点上之前触发，返回false表示取消这个移除行动。
        * @param {Tree} tree 主树
        * @param {Node} parent 父节点
        * @param {Node} node 要被移除的子节点
        */
       "beforeremove",
       /**
        * @event beforemove
        * 当树中有节点移动到新的地方之前触发，返回false表示取消这个移动行动。
        * @param {Tree} tree 主树
        * @param {Node} node 被移动的节点
        * @param {Node} oldParent 节点的父节点
        * @param {Node} newParent 要移动到的新的父节点
        * @param {Number} index 要被移动到的索引
        */
       "beforemove",
       /**
        * @event beforeinsert
        * 当树中有新的子节点插入某个节点之前触发，返回false表示取消这个插入行动。
        * @param {Tree} tree 主树
        * @param {Node} parent 父节点
        * @param {Node} node 要被插入的子节点
        * @param {Node} refNode 在插入之前节点所在的那个子节点
        */
       "beforeinsert"
   );

    Ext.data.Tree.superclass.constructor.call(this);
};

Ext.extend(Ext.data.Tree, Ext.util.Observable, {
    /**
     * @cfg {String} pathSeparator
     * 分割节点Id的标识符（默认为"/"）。
     */
    pathSeparator: "/",

    // private
    proxyNodeEvent : function(){
        return this.fireEvent.apply(this, arguments);
    },

    /**
     * 为这棵树返回根节点。
     * @return {Node}
     */
    getRootNode : function(){
        return this.root;
    },

    /**
     * 设置这棵树的根节点。
     * @param {Node} node 节点
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
     * 根据ID查找节点。
     * @param {String} id
     * @return {Node}
     */
    getNodeById : function(id){
        return this.nodeHash[id];
    },

    // private
    registerNode : function(node){
        this.nodeHash[node.id] = node;
    },

    // private
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
 * @cfg {Boolean} leaf true表示该节点是树叶节点没有子节点
 * @cfg {String} id 该节点的Id。如不指定一个，会生成一个。
 * @constructor
 * @param {Object} attributes 节点的属性/配置项
 */
Ext.data.Node = function(attributes){
    /**
     * The attributes supplied for the node. You can use this property to access any custom attributes you supplied.
     * @type {Object}
     */
    this.attributes = attributes || {};
    this.leaf = this.attributes.leaf;
    /**
     * 节点ID。 @type String
     */
    this.id = this.attributes.id;
    if(!this.id){
        this.id = Ext.id(null, "ynode-");
        this.attributes.id = this.id;
    }
    /**
     * 此节点的所有子节点。 @type Array
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
     * 此节点的父节点. @type Node
     */
    this.parentNode = null;
    /**
     * The first direct child node of this node, or null if this node has no child nodes. @type Node
     */
    this.firstChild = null;
    /**
     * The last direct child node of this node, or null if this node has no child nodes. @type Node
     */
    this.lastChild = null;
    /**
     * The node immediately preceding this node in the tree, or null if there is no sibling node. @type Node
     */
    this.previousSibling = null;
    /**
     * The node immediately following this node in the tree, or null if there is no sibling node. @type Node
     */
    this.nextSibling = null;

    this.addEvents({
       /**
        * @event append
        * Fires when a new child node is appended
        * @param {Tree} tree 主树
        * @param {Node} this 此节点
        * @param {Node} node The newly appended node
        * @param {Number} index The index of the newly appended node
        */
       "append" : true,
       /**
        * @event remove
        * Fires when a child node is removed
        * @param {Tree} tree 主树
        * @param {Node} this 此节点
        * @param {Node} node The removed node
        */
       "remove" : true,
       /**
        * @event move
        * Fires when this node is moved to a new location in the tree
        * @param {Tree} tree 主树
        * @param {Node} this 此节点
        * @param {Node} oldParent The old parent of this node
        * @param {Node} newParent The new parent of this node
        * @param {Number} index The index it was moved to
        */
       "move" : true,
       /**
        * @event insert
        * Fires when a new child node is inserted.
        * @param {Tree} tree 主树
        * @param {Node} this 此节点
        * @param {Node} node The child node inserted
        * @param {Node} refNode The child node the node was inserted before
        */
       "insert" : true,
       /**
        * @event beforeappend
        * Fires before a new child is appended, return false to cancel the append.
        * @param {Tree} tree 主树
        * @param {Node} this 此节点
        * @param {Node} node The child node to be appended
        */
       "beforeappend" : true,
       /**
        * @event beforeremove
        * Fires before a child is removed, return false to cancel the remove.
        * @param {Tree} tree 主树
        * @param {Node} this 此节点
        * @param {Node} node The child node to be removed
        */
       "beforeremove" : true,
       /**
        * @event beforemove
        * Fires before this node is moved to a new location in the tree. Return false to cancel the move.
        * @param {Tree} tree 主树
        * @param {Node} this 此节点
        * @param {Node} oldParent The parent of this node
        * @param {Node} newParent The new parent this node is moving to
        * @param {Number} index The index it is being moved to
        */
       "beforemove" : true,
       /**
        * @event beforeinsert
        * Fires before a new child is inserted, return false to cancel the insert.
        * @param {Tree} tree 主树
        * @param {Node} this This node
        * @param {Node} node The child node to be inserted
        * @param {Node} refNode The child node the node is being inserted before
        */
       "beforeinsert" : true
   });
    this.listeners = this.attributes.listeners;
    Ext.data.Node.superclass.constructor.call(this);
};

Ext.extend(Ext.data.Node, Ext.util.Observable, {
    // private
    fireEvent : function(evtName){
        // first do standard event for this node
        if(Ext.data.Node.superclass.fireEvent.apply(this, arguments) === false){
            return false;
        }
        // then bubble it up to the tree if the event wasn't cancelled
        var ot = this.getOwnerTree();
        if(ot){
            if(ot.proxyNodeEvent.apply(ot, arguments) === false){
                return false;
            }
        }
        return true;
    },

    /**
     * 若节点是叶子节点的话返回true。
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
     * 如果这个节点是其父节点下面的最后一个节点的话返回true。
     * @return {Boolean}
     */
    isLast : function(){
       return (!this.parentNode ? true : this.parentNode.lastChild == this);
    },

    /**
     * 如果这个节点是其父节点下面的第一个节点的话返回true。
     * @return {Boolean}
     */
    isFirst : function(){
       return (!this.parentNode ? true : this.parentNode.firstChild == this);
    },

    hasChildNodes : function(){
        return !this.isLeaf() && this.childNodes.length > 0;
    },

    /**
     * 在该节点里面最后的位置上插入节点，可以多个。
     * @param {Node/Array} node 要加入的节点或节点数组
     * @return {Node} 如果是单个节点，加入后返回true，如果是数组返回null。
     */
    appendChild : function(node){
        var multi = false;
        if(node instanceof Array){
            multi = node;
        }else if(arguments.length > 1){
            multi = arguments;
        }
        // if passed an array or multiple args do them one by one
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
     * 从该节点中移除一个子节点。
     * @param {Node} node 要移除的节点
     * @return {Node} 移除后的节点
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
        this.childNodes.splice(index, 1);

        // update siblings
        if(node.previousSibling){
            node.previousSibling.nextSibling = node.nextSibling;
        }
        if(node.nextSibling){
            node.nextSibling.previousSibling = node.previousSibling;
        }

        // update child refs
        if(this.firstChild == node){
            this.setFirstChild(node.nextSibling);
        }
        if(this.lastChild == node){
            this.setLastChild(node.previousSibling);
        }

        node.setOwnerTree(null);
        // clear any references from the node
        node.parentNode = null;
        node.previousSibling = null;
        node.nextSibling = null;
        this.fireEvent("remove", this.ownerTree, this, node);
        return node;
    },

    /**
     * 在当前节点的子节点的集合中，位于第一个节点之前插入节点（第二个参数）。
     * @param {Node} node 要插入的节点
     * @param {Node} refNode 前面插入的节点（如果为null表示节点是追加的）
     * @return {Node}  插入的节点
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
        if(oldParent == this && this.childNodes.indexOf(node) < index){
            refIndex--;
        }

        // it's a move, make sure we move it cleanly
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
     * 从父节点上移除子节点
     * @return {Node} this
     */
    remove : function(){
        this.parentNode.removeChild(this);
        return this;
    },

    /**
     * 指定索引，在自节点中查找匹配索引的节点。
     * @param {Number} index
     * @return {Node}
     */
    item : function(index){
        return this.childNodes[index];
    },

    /**
     * 把下面的某个子节点替换为其他节点。
     * @param {Node} newChild 进来的节点
     * @param {Node} oldChild 去掉的节点
     * @return {Node} 去掉的节点
     */
    replaceChild : function(newChild, oldChild){
        this.insertBefore(newChild, oldChild);
        this.removeChild(oldChild);
        return oldChild;
    },

    /**
     * 返回某个子节点的索引。
     * @param {Node} node 节点
     * @return {Number} 节点的索引或是-1表示找不到
     */
    indexOf : function(child){
        return this.childNodes.indexOf(child);
    },

    /**
     * 返回节点所在的树对象。
     * @return {Tree}
     */
    getOwnerTree : function(){
        // if it doesn't have one, look for one
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
     * 返回该节点的深度（根节点的深度是0）
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
     * 返回该节点的路径，以方便控制这个节点展开或选择。
     * @param {String} attr （可选的）The attr to use for the path (defaults to the node's id)
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
     * 从该节点开始逐层上报(Bubbles up)节点，上报过程中对每个节点执行指定的函数。
     * 函数的作用域（<i>this</i>）既可是参数scope传入或是当前节点。函数的参数可经由args指定或当前节点，
     * 如果函数在某一个层次上返回false，上升将会停止。
     * @param {Function} fn 要调用的函数
     * @param {Object} scope （可选的） 函数的作用域（默认为当前节点）
     * @param {Array} args（可选的） 调用的函数要送入的参数（不指定就默认为遍历过程中当前的节点)
     */
    bubble : function(fn, scope, args){
        var p = this;
        while(p){
            if(fn.apply(scope || p, args || [p]) === false){
                break;
            }
            p = p.parentNode;
        }
    },

    /**
     * 从该节点开始逐层下报(Bubbles up)节点，上报过程中对每个节点执行指定的函数。
     * 函数的作用域（<i>this</i>）既可是参数scope传入或是当前节点。函数的参数可经由args指定或当前节点，
     * 如果函数在某一个层次上返回false，下升到那个分支的位置将会停止。
     * @param {Function} fn 要调用的函数
     * @param {Object} scope （可选的） 函数的作用域（默认为当前节点）
     * @param {Array} args（可选的） 调用的函数要送入的参数（不指定就默认为遍历过程中当前的节点)
     */
    cascade : function(fn, scope, args){
        if(fn.apply(scope || this, args || [this]) !== false){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++) {
            	cs[i].cascade(fn, scope, args);
            }
        }
    },

    /**
     * 遍历该节点下的子节点，枚举过程中对每个节点执行指定的函数。
     * 函数的作用域（<i>this</i>）既可是参数scope传入或是当前节点。函数的参数可经由args指定或当前节点，
     * 如果函数走到某处地方返回false，遍历将会停止。
     * @param {Function} fn 要调用的函数
     * @param {Object} scope （可选的） 函数的作用域（默认为当前节点）
     * @param {Array} args （可选的） 调用的函数要送入的参数（不指定就默认为遍历过程中当前的节点)
     */
    eachChild : function(fn, scope, args){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	if(fn.apply(scope || this, args || [cs[i]]) === false){
        	    break;
        	}
        }
    },

    /**
     * 根据送入的值，如果子节点身上指定属性的值是送入的值，就返回那个节点。
     * @param {String} attribute 属性名称
     * @param {Mixed} value 要查找的值
     * @return {Node} 已找到的子节点或null表示找不到
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
     * 通过自定义的函数查找子节点，找到第一个合适的就返回。要求的条件是函数返回true。
     * @param {Function} fn 函数
     * @param {Object} scope 函数作用域（可选的）
     * @return {Node} 找到的子元素或null就代表没找到
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
     * 用自定义的排序函数对节点的子函数进行排序。
     * @param {Function} fn 函数
     * @param {Object} scope 函数（可选的）
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
     * 返回true表示为该节点是送入节点的祖先节点（无论在哪那一级的）
     * @param {Node} node 节点
     * @return {Boolean}
     */
    contains : function(node){
        return node.isAncestor(this);
    },

    /**
     * 返回true表示为送入的节点是该的祖先节点（无论在哪那一级的）
     * @param {Node} node 节点
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