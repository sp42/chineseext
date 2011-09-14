/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.tree.MultiSelectionModel
 * @extends Ext.util.Observable
 * 一个多选择区的TreePanel。
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