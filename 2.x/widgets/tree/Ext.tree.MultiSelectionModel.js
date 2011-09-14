/**
 * @class Ext.tree.MultiSelectionModel
 * @extends Ext.util.Observable
 * 一个多选择区的TreePanel
 */
Ext.tree.MultiSelectionModel = function(config){
   this.selNodes = [];
   this.selMap = {};
   this.addEvents(
       /**
        * @event selectionchange
        * 当选中的选区有变动时触发
        * @param {MultiSelectionModel} this
        * @param {Array} nodes 选中节点组成的数组
        */
       "selectionchange"
   );
    Ext.apply(this, config);
    Ext.tree.MultiSelectionModel.superclass.constructor.call(this);
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
     * 将节点放入选择区
     * @param {TreeNode} node 要放入的节点
     * @param {EventObject} e 为选择区分配的event对象
     * @param {Boolean} keepExisting 如果为true,则保存选择区中已存在的节点
     * @return {TreeNode} 选中的节点
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
     * 如果传入的节点在选择区则从中删除
     * @param {TreeNode} node 待删除的节点
     */
    unselect : function(node){
        if(this.selMap[node.id]){
            node.ui.onSelectedChange(false);
            var sn = this.selNodes;
            var index = sn.indexOf(node);
            if(index != -1){
                this.selNodes.splice(index, 1);
            }
            delete this.selMap[node.id];
            this.fireEvent("selectionchange", this, this.selNodes);
        }
    },
    
    /**
     * 清理选择区中的节点
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
     * 如果节点已经在选择区中则返回true
     * @param {TreeNode} node  检查的节点
     * @return {Boolean}
     */
    isSelected : function(node){
        return this.selMap[node.id] ? true : false;  
    },
    
    /**
     * 返回选择区中所有的节点
     * @return {Array}
     */
    getSelectedNodes : function(){
        return this.selNodes;    
    },

    onKeyDown : Ext.tree.DefaultSelectionModel.prototype.onKeyDown,

    selectNext : Ext.tree.DefaultSelectionModel.prototype.selectNext,

    selectPrevious : Ext.tree.DefaultSelectionModel.prototype.selectPrevious
});