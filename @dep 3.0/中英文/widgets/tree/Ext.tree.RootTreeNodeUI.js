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
 * @class Ext.tree.RootTreeNodeUI
 * This class provides the default UI implementation for <b>root</b> Ext TreeNodes.
 * The RootTreeNode UI implementation allows customizing the appearance of the root tree node.<br>
 * <p>
 * If you are customizing the Tree's user interface, you
 * may need to extend this class, but you should never need to instantiate this class.<br>
 */
Ext.tree.RootTreeNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
    // private
    render : function(){
        if(!this.rendered){
            var targetNode = this.node.ownerTree.innerCt.dom;
            this.node.expanded = true;
            targetNode.innerHTML = '<div class="x-tree-root-node"></div>';
            this.wrap = this.ctNode = targetNode.firstChild;
        }
    },
    collapse : Ext.emptyFn,
    expand : Ext.emptyFn
});