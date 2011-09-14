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
 * @class Ext.tree.TreeEventModel
 * Ext.tree.TreeEventModel类。
 */
Ext.tree.TreeEventModel = function(tree){
    this.tree = tree;
    this.tree.on('render', this.initEvents, this);
}

Ext.tree.TreeEventModel.prototype = {
    initEvents : function(){
        var el = this.tree.getTreeEl();
        el.on('click', this.delegateClick, this);
        if(this.tree.trackMouseOver !== false){
            this.tree.innerCt.on('mouseover', this.delegateOver, this);
            this.tree.innerCt.on('mouseout', this.delegateOut, this);
        }
        el.on('dblclick', this.delegateDblClick, this);
        el.on('contextmenu', this.delegateContextMenu, this);
    },

    getNode : function(e){
        var t;
        if(t = e.getTarget('.x-tree-node-el', 10)){
            var id = Ext.fly(t, '_treeEvents').getAttributeNS('ext', 'tree-node-id');
            if(id){
                return this.tree.getNodeById(id);
            }
        }
        return null;
    },

    getNodeTarget : function(e){
        var t = e.getTarget('.x-tree-node-icon', 1);
        if(!t){
            t = e.getTarget('.x-tree-node-el', 6);
        }
        return t;
    },

    delegateOut : function(e, t){
        if(!this.beforeEvent(e)){
            return;
        }
        t = this.getNodeTarget(e);
        if(t && !e.within(t, true)){
            this.onNodeOut(e, this.getNode(e));
        }
    },

    delegateOver : function(e, t){
        if(!this.beforeEvent(e)){
            return;
        }
        if(Ext.isGecko && !this.trackingDoc){ // prevent hanging in FF
            Ext.getBody().on('mouseover', this.trackExit, this);
            this.trackingDoc = true;
        }
        if(this.lastEcOver){ // prevent hung highlight
            this.onIconOut(e, this.lastEcOver);
            delete this.lastEcOver;
        }
        if(e.getTarget('.x-tree-ec-icon', 1)){
            this.lastEcOver = this.getNode(e);
            this.onIconOver(e, this.lastEcOver);
        }
        if(t = this.getNodeTarget(e)){
            this.onNodeOver(e, this.getNode(e));
        }
    },
    
    delegateOver : function(e, t){
        if(!this.beforeEvent(e)){
            return;
        }
        if(Ext.isGecko && !this.trackingDoc){ // prevent hanging in FF
            Ext.getBody().on('mouseover', this.trackExit, this);
            this.trackingDoc = true;
        }
        if(this.lastEcOver){ // prevent hung highlight
            this.onIconOut(e, this.lastEcOver);
            delete this.lastEcOver;
        }
        if(e.getTarget('.x-tree-ec-icon', 1)){
            this.lastEcOver = this.getNode(e);
            this.onIconOver(e, this.lastEcOver);
        }
        if(t = this.getNodeTarget(e)){
            this.onNodeOver(e, this.getNode(e));
        }
    },
    
    delegateClick : function(e, t){
        if(!this.beforeEvent(e)){
            return;
        }

        if(e.getTarget('input[type=checkbox]', 1)){
            this.onCheckboxClick(e, this.getNode(e));
        }
        else if(e.getTarget('.x-tree-ec-icon', 1)){
            this.onIconClick(e, this.getNode(e));
        }
        else if(this.getNodeTarget(e)){
            this.onNodeClick(e, this.getNode(e));
        }
    },

    delegateDblClick : function(e, t){
        if(this.beforeEvent(e) && this.getNodeTarget(e)){
            this.onNodeDblClick(e, this.getNode(e));
        }
    },

    delegateContextMenu : function(e, t){
        if(this.beforeEvent(e) && this.getNodeTarget(e)){
            this.onNodeContextMenu(e, this.getNode(e));
        }
    },

    onNodeClick : function(e, node){
        node.ui.onClick(e);
    },

    onNodeOver : function(e, node){
        this.lastOverNode = node;
        node.ui.onOver(e);
    },

    onNodeOut : function(e, node){
        node.ui.onOut(e);
    },

    onIconClick : function(e, node){
        node.ui.ecClick(e);
    },

    onCheckboxClick : function(e, node){
        node.ui.onCheckChange(e);
    },

    onNodeDblClick : function(e, node){
        node.ui.onDblClick(e);
    },

    onNodeContextMenu : function(e, node){
        node.ui.onContextMenu(e);
    },

    beforeEvent : function(e){
        if(this.disabled){
            e.stopEvent();
            return false;
        }
        return true;
    },

    disable: function(){
        this.disabled = true;
    },

    enable: function(){
        this.disabled = false;
    }
};