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
 * @class Ext.tree.TreeEditor
 * @extends Ext.Editor
 * 为树节点提供即时的编辑功能，所有合法{@link Ext.form.Field}都可作为其编辑字段。
 * Provides editor functionality for inline tree node editing.  Any valid {@link Ext.form.Field} can be used
 * as the editor field.
 * @constructor
 * @param {TreePanel} tree
 * @param {Object} config Either a prebuilt {@link Ext.form.Field} instance or a Field config object 既可以是内建的{@link Ext.form.Field}实例也可以Field的配置项对象
 */
Ext.tree.TreeEditor = function(tree, config){
    config = config || {};
    var field = config.events ? config : new Ext.form.TextField(config);
    Ext.tree.TreeEditor.superclass.constructor.call(this, field);

    this.tree = tree;

    if(!tree.rendered){
        tree.on('render', this.initEditor, this);
    }else{
        this.initEditor(tree);
    }
};

Ext.extend(Ext.tree.TreeEditor, Ext.Editor, {
    /**
     * @cfg {String} alignment
     * 要对象的方向（参阅{@link Ext.Element#alignTo}了解更多，默认为"l-l"）。
     * The position to align to (see {@link Ext.Element#alignTo} for more details, defaults to "l-l").
     */
    alignment: "l-l",
    // inherit
    autoSize: false,
    /**
     * @cfg {Boolean} hideEl
     * True表示为，当编辑器显示时隐藏绑定的元素（缺省为false）。
     * True to hide the bound element while the editor is displayed (defaults to false)
     */
    hideEl : false,
    /**
     * @cfg {String} cls
     * 编辑器用到的CSS样式类（默认为"x-small-editor x-tree-editor"）。
     * CSS class to apply to the editor (defaults to "x-small-editor x-tree-editor")
     */
    cls: "x-small-editor x-tree-editor",
    /**
     * @cfg {Boolean} shim
     * 如果要避免有select元素或iframe元素遮挡编辑器显示，就使用一个“垫片（shim）”来提供显示（默认为false）。
     * True to shim the editor if selects/iframes could be displayed beneath it (defaults to false)
     */
    shim:false,
    // inherit
    shadow:"frame",
    /**
     * @cfg {Number} maxWidth
     * 编辑器最大的宽度，单位是橡树。注意如果最大尺寸超过放置树元素的尺寸，那么将自动为你适应容器的尺寸，包括滚动条和client offsets into account prior to each edit。
     * The maximum width in pixels of the editor field (defaults to 250).  Note that if the maxWidth would exceed
     * the containing tree element's size, it will be automatically limited for you to the container width, taking
     * scroll and client offsets into account prior to each edit.
     */
    maxWidth: 250,
    /**
     * @cfg {Number} editDelay 
     * 该节点点击一开始，持续多久才等级双击的事件（双击的事件执行时会翻转当前的编辑模式，默认为350）。
     * 如果在同一个节点上，两次点击都是发生在该时间（time span），那么节点的编辑器将会显示，否则它将被作为规则点击处理。
     * The number of milliseconds between clicks to register a double-click 
     * that will trigger editing on the current node (defaults to 350). If two clicks occur on the same node within this time span,
     * the editor for the node will display, otherwise it will be processed as a regular click.
     */
    editDelay : 350,

    initEditor : function(tree){
        tree.on('beforeclick', this.beforeNodeClick, this);
        this.on('complete', this.updateNode, this);
        this.on('beforestartedit', this.fitToTree, this);
        this.on('startedit', this.bindScroll, this, {delay:10});
        this.on('specialkey', this.onSpecialKey, this);
    },

    // private
    fitToTree : function(ed, el){
        var td = this.tree.getTreeEl().dom, nd = el.dom;
        if(td.scrollLeft >  nd.offsetLeft){ // ensure the node left point is visible
            td.scrollLeft = nd.offsetLeft;
        }
        var w = Math.min(
                this.maxWidth,
                (td.clientWidth > 20 ? td.clientWidth : td.offsetWidth) - Math.max(0, nd.offsetLeft-td.scrollLeft) - /*cushion*/5);
        this.setSize(w, '');
    },

    // private
    triggerEdit : function(node){
        this.completeEdit();
        this.editNode = node;
        this.startEdit(node.ui.textNode, node.text);
    },

    // private
    bindScroll : function(){
        this.tree.getTreeEl().on('scroll', this.cancelEdit, this);
    },

    // private
    beforeNodeClick : function(node, e){
        var sinceLast = (this.lastClick ? this.lastClick.getElapsed() : 0);
        this.lastClick = new Date();
        if(sinceLast > this.editDelay && this.tree.getSelectionModel().isSelected(node)){
            e.stopEvent();
            this.triggerEdit(node);
            return false;
        }
    },

    // private
    updateNode : function(ed, value){
        this.tree.getTreeEl().un('scroll', this.cancelEdit, this);
        this.editNode.setText(value);
    },

    // private
    onHide : function(){
        Ext.tree.TreeEditor.superclass.onHide.call(this);
        if(this.editNode){
            this.editNode.ui.focus();
        }
    },

    // private
    onSpecialKey : function(field, e){
        var k = e.getKey();
        if(k == e.ESC){
            e.stopEvent();
            this.cancelEdit();
        }else if(k == e.ENTER && !e.hasModifier()){
            e.stopEvent();
            this.completeEdit();
        }
    }
});