/**
 * @class Ext.tree.DefaultSelectionModel
 * @extends Ext.util.Observable
 * 默认是一个单选择区的TreePanel
 */
Ext.tree.DefaultSelectionModel = function(config){
   this.selNode = null;
   
   this.addEvents(
       /**
        * @event selectionchange
        * 当选中的选区有变动时触发
        * @param {DefaultSelectionModel} this
        * @param {TreeNode} node 新选区
        */
       "selectionchange",
       /**
        * @event beforeselect
        * 选中的节点加载之前触发，返回false则取消。
        * @param {DefaultSelectionModel} this
        * @param {TreeNode} node 新选区
        * @param {TreeNode} node 旧选区
        */
       "beforeselect"
   );

    Ext.apply(this, config);
    Ext.tree.DefaultSelectionModel.superclass.constructor.call(this);
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
     * @param {TreeNode} node 要选择的节点
     * @return {TreeNode} 选择的节点
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
     *  如果该节点在选择区中，则将该节点移除选择区
     * @param {TreeNode} node 被移除的节点
     */    
    unselect : function(node){
        if(this.selNode == node){
            this.clearSelections();
        }    
    },
    
    /**
     * 清空选择区，并返回选择区中的节点
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
     * 得到选择区中的节点
     * @return {TreeNode} 选中的节点
     */
    getSelectedNode : function(){
        return this.selNode;    
    },
    
    /**
     * 如果节点在选择区中则返回true
     * @param {TreeNode} node 待检查的节点
     * @return {Boolean}
     */
    isSelected : function(node){
        return this.selNode == node;  
    },

    /**
     * 将选择区中的节点在这棵树中上一个节点放入选择区，而且是智能的检索。
     * @return TreeNode 新选区
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
     * 将选择区中的节点在这棵树中下一个节点放入选择区，而且是智能的检索。
     * @return TreeNode 新选区
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