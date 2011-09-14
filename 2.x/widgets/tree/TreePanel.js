/**
 * @class Ext.tree.TreePanel
 * <p>
 * TreePanel为树状的数据结构提供了树状结构UI表示层。
 * </p>
 * <p>{@link Ext.tree.TreeNode TreeNode}s是加入到TreePanel的节点，可采用其{@link Ext.tree.TreeNode#attributes attributes}属性
 * 来定义程序的元数据</p>
 * <p><b>TreePanel渲染之前必须有一个{@link #root}根节点的对象</b>。除了可以用{@link #root}配置选项指定外，还可以使用{@link #setRootNode}的方法。
 * @extends Ext.Panel

 * @cfg {Ext.tree.TreeNode} root 树的根节点
 * @cfg {Boolean} rootVisible false表示隐藏根节点（默认为true）
 * @cfg {Boolean} lines false禁止显示树的虚线（默认为true）
 * @cfg {Boolean} enableDD true表示允许拖放
 * @cfg {Boolean} enableDrag true表示仅激活拖动
 * @cfg {Boolean} enableDrop true表示仅激活投下
 * @cfg {Object} dragConfig 自定义的配置对象，作用到{@link Ext.tree.TreeDragZone}实例
 * @cfg {Object} dropConfig 自定义的配置对象，作用到{@link Ext.tree.TreeDropZone}实例
 * @cfg {String} ddGroup 此TreePanel所隶属的DD组
 * @cfg {String} ddAppendOnly True if the tree should only allow append drops （用于树的排序）
 * @cfg {Boolean} ddScroll true表示激活主干部分的滚动
 * @cfg {Boolean} containerScroll true用ScrollerManagee登记该容器
 * @cfg {Boolean} hlDrop false表示在置下时禁止节点的高亮（默认为Ext.enableFx的值）
 * @cfg {String} hlColor 节点对象高亮的颜色（默认为C3DAF9）
 * @cfg {Boolean} animate true表示激活展开、闭合的动画（默认为Ext.enableFx的值）
 * @cfg {Boolean} singleExpand true表示只有一个节点的分支可展开
 * @cfg {Boolean} selModel 此TreePanel所用的选区模型（默认为{@link Ext.tree.DefaultSelectionModel}）
 * @cfg {Ext.tree.TreeLoader} loader 此TreePanel所用的{@link Ext.tree.TreeLoader}对象
 * @cfg {String} pathSeparator 分离路径的标识符（默认为‘/’）
 *
 * @constructor
 * @param {Object} config 配置项对象
 */
Ext.tree.TreePanel = Ext.extend(Ext.Panel, {
    rootVisible : true,
    animate: Ext.enableFx,
    lines : true,
    enableDD : false,
    hlDrop : Ext.enableFx,
    pathSeparator: "/",

    initComponent : function(){
        Ext.tree.TreePanel.superclass.initComponent.call(this);

        if(!this.eventModel){
            this.eventModel = new Ext.tree.TreeEventModel(this);
        }
        
        this.nodeHash = {};

        /**
        * 树的根节点对象
        * @type Ext.tree.TreeNode
        * @property root
        */
        if(this.root){
           this.setRootNode(this.root);
        }

        this.addEvents(

            /**
            * @event append
            * Fires when a new child node is appended to a node in this tree.
            * 当新节点添加到树中的某个节点作为子节点时触发
            * @param {Tree} tree 所在的树对象
            * @param {Node} parent 父节点
            * @param {Node} node 新添加的节点
            * @param {Number} index 刚加入节点的索引位置
            */
           "append",
           /**
            * @event remove
            * Fires when a child node is removed from a node in this tree.
            * 从该树中的某个节点移除下级的节点是触发
            * @param {Tree} tree 所在的树对象
            * @param {Node} parent 父节点
            * @param {Node} node 被移除节点对象
            */
           "remove",
           /**
            * @event movenode
            * Fires when a node is moved to a new location in the tree
            * 树中的某个节点被移除到新位置时触发
            * @param {Tree} tree 所在的树对象
            * @param {Node} node 节点对象 moved
            * @param {Node} oldParent 改节点的原始值
            * @param {Node} newParent 该节点的新值
            * @param {Number} index 移动到索引位置
            */
           "movenode",
           /**
            * @event insert
            * Fires when a new child node is inserted in a node in this tree.
            * 当有一个新的集合插入到该树的某个节点上触发
            * @param {Tree} tree 所在的树对象
            * @param {Node} parent 父节点
            * @param {Node} node 要插入的下级项
            * @param {Node} refNode 说明在这个节点之前加入
            */
           "insert",
           /**
            * @event beforeappend
            * Fires before a new child is appended to a node in this tree, return false to cancel the append.
            * 当这棵树有下级项（child）被被添加到另外一个地方的时候触发，若有false返回就取消添加
            * @param {Tree} tree 所在的树对象
            * @param {Node} parent 父节点
            * @param {Node} node 要添加的子节点
            */
           "beforeappend",
           /**
            * @event beforeremove
            * Fires before a child is removed from a node in this tree, return false to cancel the remove.
            * 当这棵树有下级项（child）被被移动到另外一个地方的时候触发，若有false返回就取消移动
            * @param {Tree} tree 所在的树对象
            * @param {Node} parent 父节点
            * @param {Node} node 要被移除的节点
            */
           "beforeremove",
           /**
            * @event beforemovenode
            * Fires before a node is moved to a new location in the tree. Return false to cancel the move.
            * 当这棵树有节点被被移动到另外一个地方的时候触发，若有false返回就取消移动
            * @param {Tree} tree 所在的树对象
            * @param {Node} node 节点对象 being moved
            * @param {Node} oldParent 节点上一级对象
            * @param {Node} newParent The new parent 节点对象 is moving to
            * @param {Number} index The index it is being moved to
            */
           "beforemovenode",
           /**
            * @event beforeinsert
            * Fires before a new child is inserted in a node in this tree, return false to cancel the insert.
            * 当这棵树有新项（new child）被插入的时候触发，若有false返回就取消插入
            * @param {Tree} tree 所在的树对象
            * @param {Node} parent 父节点
            * @param {Node} node 要插入的子节点
            * @param {Node} refNode The child node 节点对象 is being inserted before
            */
            "beforeinsert",

            /**
            * @event beforeload
            * Fires before a node is loaded, return false to cancel
            * 在节点加载之前触发，若有false返回就取消事件
            * @param {Node} node 被加载的节点对象
            */
            "beforeload",
            /**
            * @event load
            * Fires when a node is loaded
            * 在节点加载后触发
            * @param {Node} node 已加载的节点对象
            */
            "load",
            /**
            * @event textchange
            * Fires when the text for a node is changed
            * 在节点的文本修过后触发
            * @param {Node} node 节点对象
            * @param {String} text 新文本
            * @param {String} oldText 旧文本
            */
            "textchange",
            /**
            * @event beforeexpandnode
            * Fires before a node is expanded, return false to cancel.
            * 在节点展开之前触发，若有false返回就取消事件
            * @param {Node} node 节点对象
            * @param {Boolean} deep 深度
            * @param {Boolean} anim 动画
            */
            "beforeexpandnode",
            /**
            * @event beforecollapsenode
            * Fires before a node is collapsed, return false to cancel.
            * 在节点闭合之前触发，若有false返回就取消事件
            * @param {Node} node 节点对象
            * @param {Boolean} deep 深度
            * @param {Boolean} anim 动画
            */
            "beforecollapsenode",
            /**
            * @event expandnode
            * Fires when a node is expanded
            * 当节点展开是触发
            * @param {Node} node 节点对象
            */
            "expandnode",
            /**
            * @event disabledchange
            * Fires when the disabled status of a node changes
            * 当节点的disabled状态改变后触发
            * @param {Node} node 节点对象
            * @param {Boolean} disabled 禁止
            */
            "disabledchange",
            /**
            * @event collapsenode
            * Fires when a node is collapsed
            * 当节点闭合后触发
            * @param {Node} node 节点对象
            */
            "collapsenode",
            /**
            * @event beforeclick
            * Fires before click processing on a node. Return false to cancel the default action.
            * 当单击在某个节点进行之前触发。返回false则取消默认的动作。
            * @param {Node} node 节点对象
            * @param {Ext.EventObject} e 事件对象
            */
            "beforeclick",
            /**
            * @event click
            * Fires when a node is clicked
            * 当节点单击时触发
            * @param {Node} node 节点对象
            * @param {Ext.EventObject} e 事件对象
            */
            "click",
            /**
            * @event checkchange
            * Fires when a node with a checkbox's checked property changes
            * 当一个带有checkbox控件的节点的checked属性被改变时触发
            * @param {Node} this 这个节点
            * @param {Boolean} checked
            */
            "checkchange",
            /**
            * @event dblclick
            * Fires when a node is double clicked
            * 当节点双击时触发
            * @param {Node} node 节点对象
            * @param {Ext.EventObject} e 事件对象
            */
            "dblclick",
            /**
            * @event contextmenu
            * Fires when a node is right clicked
            * 当节点被右击时触发
            * @param {Node} node 节点对象
            * @param {Ext.EventObject} e 事件对象
            */
            "contextmenu",
            /**
            * @event beforechildrenrendered
            * Fires right before the child nodes for a node are rendered
            * 就在节点的子节点被渲染之前触发
            * @param {Node} node 节点对象
            */
            "beforechildrenrendered",
           /**
             * @event startdrag
             * Fires when a node starts being dragged
             * 当节点开始拖动时触发
             * @param {Ext.tree.TreePanel} this treePanel
             * @param {Ext.tree.TreeNode} node 节点
             * @param {event} e 原始浏览器事件对象
             */
            "startdrag",
            /**
             * @event enddrag
             * Fires when a drag operation is complete
             * 当一次拖动操作完成后触发
             * @param {Ext.tree.TreePanel} this treePanel
             * @param {Ext.tree.TreeNode} node 节点
             * @param {event} e 原始浏览器事件对象
             */
            "enddrag",
            /**
             * @event dragdrop
             * Fires when a dragged node is dropped on a valid DD target
             * 当一个拖动节点在一个有效的DD目标上置下时触发
             * @param {Ext.tree.TreePanel} this treePanel
             * @param {Ext.tree.TreeNode} node 节点             
             * @param {DD} dd 被投下的dd对象
             * @param {event} e 原始浏览器事件对象
             */
            "dragdrop",
            /**
             * @event beforenodedrop
             * 当一个DD对象在置下到某个节点之前触发，用于预处理（preprocessing）
             * 返回false则取消置下
             * 传入的dropEvent处理函数有以下的属性：<br />
             * <ul style="padding:5px;padding-left:16px;">
             * <li>tree - TreePanel对象</li>
             * <li>target - 投下的节点对象（目标）</li>
             * <li>data - 拖动的数据源</li>
             * <li>point - 投下的方式－添加、上方或下方</li>
             * <li>source - 拖动源</li>
             * <li>rawEvent - 原始鼠标事件</li>
             * <li>dropNode - 由源提供的置下节点，<b>或</b>在该对象设置你要插入的节点</li>
             * <li>cancel - 设置为true表示签名投下为不允许</li>
             * </ul>
             * @param {Object} dropEvent 事件对象
             */
            "beforenodedrop",
            /**
             * @event nodedrop
             * 当树节点有一个DD对象被投放后触发。传入的dropEvent处理函数有以下的属性：<br />
             * <ul style="padding:5px;padding-left:16px;">
             * <li>tree - TreePanel对象</li>
             * <li>target - 投下的节点对象（目标）</li>
             * <li>data - 拖动的数据源</li>
             * <li>point - 投下的方式－添加、上方或下方</li>
             * <li>source - 拖动源</li>
             * <li>rawEvent - 原始鼠标事件</li>
             * <li>dropNode - 投下的节点</li>
             * </ul>
             * @param {Object} dropEvent 事件对象
             */
            "nodedrop",
             /**
             * @event nodedragover
             * 当树节点成为拖动目标时触发，返回false签名这次置下将不允许。传入的dropEvent处理函数有以下的属性：
             * <br />
             * <ul style="padding:5px;padding-left:16px;">
             * <li>tree - TreePanel对象</li>
             * <li>target - 投下的节点对象（目标）</li>
             * <li>data - 拖动的数据源</li>
             * <li>point - 投下的方式－添加、上方或下方</li>
             * <li>source - 拖动源</li>
             * <li>rawEvent - 原始鼠标事件</li>
             * <li>dropNode - 由源提供的投下节点</li>
             * <li>cancel - 设置为true表示签名投下为不允许</li>
             * </ul>
             * @param {Object} dragOverEvent 事件对象
             */
            "nodedragover"
        );
        if(this.singleExpand){
            this.on("beforeexpandnode", this.restrictExpand, this);
        }
    },

    // private
    proxyNodeEvent : function(ename, a1, a2, a3, a4, a5, a6){
        if(ename == 'collapse' || ename == 'expand' || ename == 'beforecollapse' || ename == 'beforeexpand' || ename == 'move' || ename == 'beforemove'){
            ename = ename+'node';
        }
        // args inline for performance while bubbling events
        return this.fireEvent(ename, a1, a2, a3, a4, a5, a6);
    },


    /**
     * 返回树的根节点
     * @return {Node}
     */
    getRootNode : function(){
        return this.root;
    },

    /**
     * Sets the root node for this tree during initialization. 
     * 在初始化过程中设置该树的根节点
     * @param {Node} node
     * @return {Node}
     */
    setRootNode : function(node){
        this.root = node;
        node.ownerTree = this;
        node.isRoot = true;
        this.registerNode(node);
        if(!this.rootVisible){
        	var uiP = node.attributes.uiProvider;
        	node.ui = uiP ? new uiP(node) : new Ext.tree.RootTreeNodeUI(node); 
        }
        return node;
    },

    /**
     * 
     * 返回树的ID
     * @param {String} id ID
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

    // private
    toString : function(){
        return "[Tree"+(this.id?" "+this.id:"")+"]";
    },

    // private
    restrictExpand : function(node){
        var p = node.parentNode;
        if(p){
            if(p.expandedChild && p.expandedChild.parentNode == p){
                p.expandedChild.collapse();
            }
            p.expandedChild = node;
        }
    },

    /**
     * 返回选中的节点，或已选中的节点的特定的属性（例如：“id”）
     * @param {String} attribute （可选的）默认为null（返回实际节点）
     * @param {TreeNode} startNode （可选的）开始的节点对象 to start from，默认为根节点
     * @return {Array}
     */
    getChecked : function(a, startNode){
        startNode = startNode || this.root;
        var r = [];
        var f = function(){
            if(this.attributes.checked){
                r.push(!a ? this : (a == 'id' ? this.id : this.attributes[a]));
            }
        }
        startNode.cascade(f);
        return r;
    },

    /**
     * 返回TreePanel所在的容器元素
     * @return {Element} 返回TreePanel容器的元素
     */
    getEl : function(){
        return this.el;
    },

    /**
     *返回该树的 {@link Ext.tree.TreeLoader}对象
     * @return {Ext.tree.TreeLoader} 该树的TreeLoader
     */
    getLoader : function(){
        return this.loader;
    },

    /**
     * 展开所有节点
     */
    expandAll : function(){
        this.root.expand(true);
    },

    /**
     * 闭合所有节点
     */
    collapseAll : function(){
        this.root.collapse(true);
    },

    /**
     * 返回这个treePanel所用的选区模型
     * @return {TreeSelectionModel} TreePanel用着的选区模型
     */
    getSelectionModel : function(){
        if(!this.selModel){
            this.selModel = new Ext.tree.DefaultSelectionModel();
        }
        return this.selModel;
    },

    /**
     * 展开指定的路径。路径可以从{@link Ext.data.Node#getPath}对象上获取
     * @param {String} path 路径
     * @param {String} attr （可选的）路径中使用的属性（参阅{@link Ext.data.Node#getPath}了解个功能）
     * @param {Function} callback （可选的）当展开完成时执行的回调。回调执行时会有以下两个参数
     * (bSuccess, oLastNode)bSuccess表示展开成功而oLastNode就表示展开的最后一个节点
     */
    expandPath : function(path, attr, callback){
        attr = attr || "id";
        var keys = path.split(this.pathSeparator);
        var curNode = this.root;
        if(curNode.attributes[attr] != keys[1]){ // invalid root
            if(callback){
                callback(false, null);
            }
            return;
        }
        var index = 1;
        var f = function(){
            if(++index == keys.length){
                if(callback){
                    callback(true, curNode);
                }
                return;
            }
            var c = curNode.findChild(attr, keys[index]);
            if(!c){
                if(callback){
                    callback(false, curNode);
                }
                return;
            }
            curNode = c;
            c.expand(false, false, f);
        };
        curNode.expand(false, false, f);
    },

    /**
     * 选择树的指定的路径。路径可以从{@link Ext.data.Node#getPath}对象上获取
     * @param {String} path 路径
     * @param {String} attr （可选的）路径中使用的属性（参阅{@link Ext.data.Node#getPath}了解个功能）
     * @param {Function} callback （可选的）当展开完成时执行的回调。回调执行时会有以下两个参数
     * (bSuccess, oLastNode)bSuccess表示选区已成功创建而oLastNode就表示展开的最后一个节点
     */
    selectPath : function(path, attr, callback){
        attr = attr || "id";
        var keys = path.split(this.pathSeparator);
        var v = keys.pop();
        if(keys.length > 0){
            var f = function(success, node){
                if(success && node){
                    var n = node.findChild(attr, v);
                    if(n){
                        n.select();
                        if(callback){
                            callback(true, n);
                        }
                    }else if(callback){
                        callback(false, n);
                    }
                }else{
                    if(callback){
                        callback(false, n);
                    }
                }
            };
            this.expandPath(keys.join(this.pathSeparator), attr, f);
        }else{
            this.root.select();
            if(callback){
                callback(true, this.root);
            }
        }
    },

    /**
     * 返回tree所属的元素
     * @return {Ext.Element} 元素
     */
    getTreeEl : function(){
        return this.body;
    },

    // private
    onRender : function(ct, position){
        Ext.tree.TreePanel.superclass.onRender.call(this, ct, position);
        this.el.addClass('x-tree');
        this.innerCt = this.body.createChild({tag:"ul",
               cls:"x-tree-root-ct " +
               (this.lines ? "x-tree-lines" : "x-tree-no-lines")});
    },

    // private
    initEvents : function(){
        Ext.tree.TreePanel.superclass.initEvents.call(this);

        if(this.containerScroll){
            Ext.dd.ScrollManager.register(this.body);
        }
        if((this.enableDD || this.enableDrop) && !this.dropZone){
           /**
            * 若干置下有效的话，tree所用的dropZone
            * @type Ext.tree.TreeDropZone
            */
             this.dropZone = new Ext.tree.TreeDropZone(this, this.dropConfig || {
               ddGroup: this.ddGroup || "TreeDD", appendOnly: this.ddAppendOnly === true
           });
        }
        if((this.enableDD || this.enableDrag) && !this.dragZone){
           /**
            * 若干拖动有效的话，tree所用的dragZone
            * @type Ext.tree.TreeDragZone
            */
            this.dragZone = new Ext.tree.TreeDragZone(this, this.dragConfig || {
               ddGroup: this.ddGroup || "TreeDD",
               scroll: this.ddScroll
           });
        }
        this.getSelectionModel().init(this);
    },

    // private
    afterRender : function(){
        Ext.tree.TreePanel.superclass.afterRender.call(this);
        this.root.render();
        if(!this.rootVisible){
            this.root.renderChildren();
        }
    },

    onDestroy : function(){
        if(this.rendered){
            this.body.removeAllListeners();
            Ext.dd.ScrollManager.unregister(this.body);
            if(this.dropZone){
                this.dropZone.unreg();
            }
            if(this.dragZone){
               this.dragZone.unreg();
            }
        }
        this.root.destroy();
        this.nodeHash = null;
        Ext.tree.TreePanel.superclass.onDestroy.call(this);
    }
    
    /** 
     * @cfg {String/Number} activeItem 
     * @hide 
     */
    /** 
     * @cfg {Boolean} autoDestroy 
     * @hide 
     */
    /** 
     * @cfg {Object/String/Function} autoLoad 
     * @hide 
     */
    /** 
     * @cfg {Boolean} autoWidth 
     * @hide 
     */
    /** 
     * @cfg {Boolean/Number} bufferResize 
     * @hide 
     */
    /** 
     * @cfg {String} defaultType 
     * @hide 
     */
    /** 
     * @cfg {Object} defaults 
     * @hide 
     */
    /** 
     * @cfg {Boolean} hideBorders 
     * @hide 
     */
    /** 
     * @cfg {Mixed} items 
     * @hide 
     */
    /** 
     * @cfg {String} layout 
     * @hide 
     */
    /** 
     * @cfg {Object} layoutConfig 
     * @hide 
     */
    /** 
     * @cfg {Boolean} monitorResize 
     * @hide 
     */
    /** 
     * @property items 
     * @hide 
     */
    /** 
     * @method add 
     * @hide 
     */
    /** 
     * @method cascade 
     * @hide 
     */
    /** 
     * @method doLayout 
     * @hide 
     */
    /** 
     * @method find 
     * @hide 
     */
    /** 
     * @method findBy 
     * @hide 
     */
    /** 
     * @method findById 
     * @hide 
     */
    /** 
     * @method findByType 
     * @hide 
     */
    /** 
     * @method getComponent 
     * @hide 
     */
    /** 
     * @method getLayout 
     * @hide 
     */
    /** 
     * @method getUpdater 
     * @hide 
     */
    /** 
     * @method insert 
     * @hide 
     */
    /** 
     * @method load 
     * @hide 
     */
    /** 
     * @method remove 
     * @hide 
     */
    /** 
     * @event add 
     * @hide 
     */
    /** 
     * @event afterLayout 
     * @hide 
     */
    /** 
     * @event beforeadd 
     * @hide 
     */
    /** 
     * @event beforeremove 
     * @hide 
     */
    /** 
     * @event remove 
     * @hide 
     */
});
Ext.reg('treepanel', Ext.tree.TreePanel);