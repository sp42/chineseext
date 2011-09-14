/*
 * @version Sencha 1.0RC-1
 * @ignore
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */

/**
 * @class Ext.layout.Layout
 * @extends Object
 * 布局基类，由ComponentLayout和ContainerLayout来扩展。
 * Base Layout class - extended by ComponentLayout and ContainerLayout
 */

Ext.layout.Layout = Ext.extend(Object, {
    isLayout: true,
    initialized: false,

    constructor : function(config) {
        this.id = Ext.id(null, 'ext-layout-' + this.type + '-');
        Ext.apply(this, config);
    },

    /**
     * @private
     */
    layout : function() {
        var me = this;
        me.layoutBusy = true;
        me.initLayout();

        if (me.beforeLayout.apply(me, arguments) !== false) {
            me.onLayout.apply(me, arguments);
            me.afterLayout();
            me.owner.needsLayout = false;
            me.layoutBusy = false;
        }
    },

    beforeLayout : function() {
        this.renderItems(this.getLayoutItems(), this.getTarget());
        return true;
    },

    /**
     * @private
     * 对传入的集合进行枚举，保证它们都渲染好的了。如果已经渲染好的话，保证每一项都在DOM的合适位置。
     * Iterates over all passed items, ensuring they are rendered.  If the items are already rendered,
     * also determines if the items are in the proper place dom.
     */
    renderItems : function(items, target) {
        var ln = items.length,
            i = 0,
            item;

        for (; i < ln; i++) {
            item = items[i];
            if (item && !item.rendered) {
                this.renderItem(item, i, target);
            }
            else if (!this.isValidParent(item, target)) {
                this.moveItem(item, i, target);
            }
        }
    },

    /**
     * @private
     * 渲染指定的组件至到目标元素。
     * Renders the given Component into the target Element.
     * @param {Ext.Component} c 需要渲染的组件。The Component to render
     * @param {Number} position 渲染目标的位置。The position within the target to render the item to
     * @param {Ext.Element} target 目标元素。The target Element
     */
    renderItem : function(item, position, target) {
        if (!item.rendered) {
            item.render(target, position);
            this.configureItem(item, position);
            this.childrenChanged = true;
        }
    },

    /**
     * @private
     * 移动组件，以便提供目标。
     * Moved Component to the provided target instead.
     */
    moveItem : function(item, position, target) {
        if (typeof position == 'number') {
            position = target.dom.childNodes[position];
        }
        // Make sure target is a dom element
        target = target.dom || target;
        target.insertBefore(item.el.dom, position || null);
        item.container = target;
        this.configureItem(item, position);
        this.childrenChanged = true;
    },

    /**
     * @private
     * Adds the layout's targetCls if necessary and sets
     * initialized flag when complete.
     */
    initLayout : function() {
        if (!this.initialized && !Ext.isEmpty(this.targetCls)) {
            this.getTarget().addCls(this.targetCls);
        }
        this.initialized = true;
    },

    // @private Sets the layout owner
    setOwner : function(owner) {
        this.owner = owner;
    },

    // @private - Returns empty array
    getLayoutItems : function() {
        return [];
    },

    // @private - Validates item is in the proper place in the dom.
    isValidParent : function(item, target) {
        var dom = item.el ? item.el.dom : Ext.getDom(item);
        return target && (dom.parentNode == (target.dom || target));
    },

    /**
     * @private
     * Applies itemCls
     */
    configureItem: function(item, position) {
        if (this.itemCls) {
            item.el.addCls(this.itemCls);
        }
    },
    
    // Placeholder empty functions for subclasses to extend
    onLayout : Ext.emptyFn,
    afterLayout : Ext.emptyFn,
    onRemove : Ext.emptyFn,
    onDestroy : Ext.emptyFn,

    /**
     * @private
     * Removes itemCls
     */
    afterRemove : function(item) {
        if (this.itemCls && item.rendered) {
            item.el.removeCls(this.itemCls);
        }
    },

    /*
     * Destroys this layout. This is a template method that is empty by default, but should be implemented
     * by subclasses that require explicit destruction to purge event handlers or remove DOM nodes.
     * @protected
     */
    destroy : function() {
        if (!Ext.isEmpty(this.targetCls)) {
            var target = this.getTarget();
            if (target) {
                target.removeCls(this.targetCls);
            }
        }
        this.onDestroy();
    }
});