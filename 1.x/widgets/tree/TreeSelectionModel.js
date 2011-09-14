/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.tree.DefaultSelectionModel
 * @extends Ext.util.Observable
 * The default single selection for a TreePanel.一个TreePanel默认是单选择区
 */
Ext.tree.DefaultSelectionModel = function(){
   this.selNode = null;
   
   this.addEvents({
       /**
        * @event selectionchange
        * Fires when the selected node changes 当选择区的节点被改变时触发
        * @param {DefaultSelectionModel} this
        * @param {TreeNode} node the new selection  
        */
       "selectionchange" : true,

       /**
        * @event beforeselect
        * Fires before the selected node changes, return false to cancel the change 当选择区的节点被改变之前触发，返回false时放弃改变
        * @param {DefaultSelectionModel} this
        * @param {TreeNode} node the new selection 节点新的选择区
        * @param {TreeNode} node the old selection 节点旧的选择区
        */
       "beforeselect" : true
   });
};

Ext.extend(Ext.tree.DefaultSelectionModel, Ext.util.Observable, {
    init : function(tree){
        this.tree = tree;
        tree.getTreeEl().on("keydown", this.onKeyDown, this);
        tree.on("click", this.onNodeClick, this);
    },
    
    onNodeClick : function(node, e){
        this.select(node);
    },
    
    /**
     * Select a node. 如果该节点不在选择区，则该节点放入选择区
     * @param {TreeNode} node The node to select 选择的节点
     * @return {TreeNode} The selected node 选择的节点
     */
    select : function(node){
        var last = this.selNode;
        if(last != node && this.fireEvent('beforeselect', this, node, last) !== false){
            if(last){
                last.ui.onSelectedChange(false);
            }
            this.selNode = node;
            node.ui.onSelectedChange(true);
            this.fireEvent("selectionchange", this, node, last);
        }
        return node;
    },
    
    /**
     * Deselect a node. 如果该节点在选择区中，则将该节点移除选择区
     * @param {TreeNode} node The node to unselect 被移除的节点
     */
    unselect : function(node){
        if(this.selNode == node){
            this.clearSelections();
        }    
    },
    
    /**
     * Clear all selections 清空选择区，并返回选择区中的节点
     */
    clearSelections : function(){
        var n = this.selNode;
        if(n){
            n.ui.onSelectedChange(false);
            this.selNode = null;
            this.fireEvent("selectionchange", this, null);
        }
        return n;
    },
    
    /**
     * Get the selected node 得到选择区中的节点
     * @return {TreeNode} The selected node 
     */
    getSelectedNode : function(){
        return this.selNode;    
    },
    
    /**
     * Returns true if the node is selected 如果节点在选择区中则返回true
     * @param {TreeNode} node The node to check 待检查的节点
     * @return {Boolean}
     */
    isSelected : function(node){
        return this.selNode == node;  
    },

    /**
     * Selects the node above the selected node in the tree, intelligently walking the nodes 将选择区中的节点在这棵树中上一个节点放入选择区，而且是智能的检索
     * @return TreeNode The new selection
     */
    selectPrevious : function(){
        var s = this.selNode || this.lastSelNode;
        if(!s){
            return null;
        }
        var ps = s.previousSibling;
        if(ps){
            if(!ps.isExpanded() || ps.childNodes.length < 1){
                return this.select(ps);
            } else{
                var lc = ps.lastChild;
                while(lc && lc.isExpanded() && lc.childNodes.length > 0){
                    lc = lc.lastChild;
                }
                return this.select(lc);
            }
        } else if(s.parentNode && (this.tree.rootVisible || !s.parentNode.isRoot)){
            return this.select(s.parentNode);
        }
        return null;
    },

    /**
     * Selects the node above the selected node in the tree, intelligently walking the nodes 将选择区中的节点在这棵树中下一个节点放入选择区，而且是智能的检索
     * @return TreeNode The new selection
     */
    selectNext : function(){
        var s = this.selNode || this.lastSelNode;
        if(!s){
            return null;
        }
        if(s.firstChild && s.isExpanded()){
             return this.select(s.firstChild);
         }else if(s.nextSibling){
             return this.select(s.nextSibling);
         }else if(s.parentNode){
            var newS = null;
            s.parentNode.bubble(function(){
                if(this.nextSibling){
                    newS = this.getOwnerTree().selModel.select(this.nextSibling);
                    return false;
                }
            });
            return newS;
         }
        return null;
    },

    onKeyDown : function(e){
        var s = this.selNode || this.lastSelNode;
        // undesirable, but required
        var sm = this;
        if(!s){
            return;
        }
        var k = e.getKey();
        switch(k){
             case e.DOWN:
                 e.stopEvent();
                 this.selectNext();
             break;
             case e.UP:
                 e.stopEvent();
                 this.selectPrevious();
             break;
             case e.RIGHT:
                 e.preventDefault();
                 if(s.hasChildNodes()){
                     if(!s.isExpanded()){
                         s.expand();
                     }else if(s.firstChild){
                         this.select(s.firstChild, e);
                     }
                 }
             break;
             case e.LEFT:
                 e.preventDefault();
                 if(s.hasChildNodes() && s.isExpanded()){
                     s.collapse();
                 }else if(s.parentNode && (this.tree.rootVisible || s.parentNode != this.tree.getRootNode())){
                     this.select(s.parentNode, e);
                 }
             break;
        };
    }
});

/**
 * @class Ext.tree.MultiSelectionModel
 * @extends Ext.util.Observable
 * Multi selection for a TreePanel. 一个多选择区的TreePanel
 */
Ext.tree.MultiSelectionModel = function(){
   this.selNodes = [];
   this.selMap = {};
   this.addEvents({
       /**
        * @event selectionchange
        * Fires when the selected nodes change当选择区中的节点改变时触发
        * @param {MultiSelectionModel} this
        * @param {Array} nodes Array of the selected nodes
        */
       "selectionchange" : true
   });
};

Ext.extend(Ext.tree.MultiSelectionModel, Ext.util.Observable, {
    init : function(tree){
        this.tree = tree;
        tree.getTreeEl().on("keydown", this.onKeyDown, this);
        tree.on("click", this.onNodeClick, this);
    },
    
    onNodeClick : function(node, e){
        this.select(node, e, e.ctrlKey);
    },
    
    /**
     * Select a node. 将节点放入选择区
     * @param {TreeNode} node The node to select 要放入的节点
     * @param {EventObject} e (optional) An event associated with the selection 为选择区分配的event对象
     * @param {Boolean} keepExisting True to retain existing selections 如果为true,则保存选择区中已存在的节点
     * @return {TreeNode} The selected node
     */
    select : function(node, e, keepExisting){
        if(keepExisting !== true){
            this.clearSelections(true);
        }
        if(this.isSelected(node)){
            this.lastSelNode = node;
            return node;
        }
        this.selNodes.push(node);
        this.selMap[node.id] = node;
        this.lastSelNode = node;
        node.ui.onSelectedChange(true);
        this.fireEvent("selectionchange", this, this.selNodes);
        return node;
    },
    
    /**
     * Deselect a node. 如果传入的节点在选择区则从中删除
     * @param {TreeNode} node The node to unselect
     */
    unselect : function(node){
        if(this.selMap[node.id]){
            node.ui.onSelectedChange(false);
            var sn = this.selNodes;
            var index = -1;
            if(sn.indexOf){
                index = sn.indexOf(node);
            }else{
                for(var i = 0, len = sn.length; i < len; i++){
                    if(sn[i] == node){
                        index = i;
                        break;
                    }
                }
            }
            if(index != -1){
                this.selNodes.splice(index, 1);
            }
            delete this.selMap[node.id];
            this.fireEvent("selectionchange", this, this.selNodes);
        }
    },
    
    /**
     * Clear all selections 清理选择区中的节点
     */
    clearSelections : function(suppressEvent){
        var sn = this.selNodes;
        if(sn.length > 0){
            for(var i = 0, len = sn.length; i < len; i++){
                sn[i].ui.onSelectedChange(false);
            }
            this.selNodes = [];
            this.selMap = {};
            if(suppressEvent !== true){
                this.fireEvent("selectionchange", this, this.selNodes);
            }
        }
    },
    
    /**
     * Returns true if the node is selected 如果节点已经在选择区中则返回true
     * @param {TreeNode} node The node to check 检查的节点
     * @return {Boolean}
     */
    isSelected : function(node){
        return this.selMap[node.id] ? true : false;  
    },
    
    /**
     * Returns an array of the selected nodes 返回选择区中所有的节点
     * @return {Array}
     */
    getSelectedNodes : function(){
        return this.selNodes;    
    },

    onKeyDown : Ext.tree.DefaultSelectionModel.prototype.onKeyDown,

    selectNext : Ext.tree.DefaultSelectionModel.prototype.selectNext,

    selectPrevious : Ext.tree.DefaultSelectionModel.prototype.selectPrevious
});