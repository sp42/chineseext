/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.dd.DropTarget
 * @extends Ext.dd.DDTarget. 
 * 一个简单的基础类,该实现使得任何元素变成为可落下的目标,以便让拖动的元素放到其身上。
 * 落下(drop)过程没有特别效果,除非提供了notifyDrop的实现
 * @constructor
 * @param {String/HTMLElement/Element} el 容器元素
 * @param {Object} config
 */
Ext.dd.DropTarget = function(el, config){
    this.el = Ext.get(el);
    
    Ext.apply(this, config);
    
    if(this.containerScroll){
        Ext.dd.ScrollManager.register(this.el);
    }
    
    Ext.dd.DropTarget.superclass.constructor.call(this, this.el.dom, this.ddGroup || this.group, 
          {isTarget: true});

};

Ext.extend(Ext.dd.DropTarget, Ext.dd.DDTarget, {
    /**
     * @cfg {String} overClass
     * 当拖动源到达落下目标上方时的CSS class
     */
    /**
     * @cfg {String} dropAllowed
     * 当可以被落下时拖动源的样式（默认为"x-dd-drop-ok"）。
     */
    dropAllowed : "x-dd-drop-ok",
    /**
     * @cfg {String} dropNotAllowed
     * 当不可以被落下时拖动源的样式（默认为"x-dd-drop-nodrop"）。
     */
    dropNotAllowed : "x-dd-drop-nodrop",

    // private
    isTarget : true,

    // private
    isNotifyTarget : true,

    /** 
     * 当源{@link Ext.dd.DragSource}进入到目标的范围内，它执行通知落下目标的那个函数。
     * 默认的实现是，如存在overClass（或其它）的样式,将其加入到落下元素（drop element），并返回dropAllowed配置的值。
     * 如需对落下验证（drop validation）的话可重写该方法。
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
     * @return {String} status 由落下状态反馈到源的CSS class,使得所在的{@link Ext.dd.StatusProxy}可被更新。
     */
    notifyEnter : function(dd, e, data){
        if(this.overClass){
            this.el.addClass(this.overClass);
        }
        return this.dropAllowed;
    },

    /**
     * 当源{@link Ext.dd.DragSource}进入到目标的范围内，每一下移动鼠标，它不断执行通知落下目标的那个函数。
     * 默认的实现是返回dropAllowed配置值而已
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
     * @return {String} status 由落下状态反馈到源的CSS class,使得所在的{@link Ext.dd.StatusProxy}可被更新。
     */
    notifyOver : function(dd, e, data){
        return this.dropAllowed;
    },

    /**.  
     * 当源{@link Ext.dd.DragSource}移出落下目标的范围后，它执行通知落下目标的那个函数。 
     * 默认的实现仅是移除由overClass（或其它）指定的CSS class。
     * @param {Ext.dd.DragSource} dd 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
     */
    notifyOut : function(dd, e, data){
        if(this.overClass){
            this.el.removeClass(this.overClass);
        }
    },

    /**
     * 当源{@link Ext.dd.DragSource}在落下目标身上完成落下动作后，它执行通知落下目标的那个函数。 
     * 该方法没有默认的实现并返回false，所以你必须提供处理落下事件的实现并返回true，才能修复拖动源没有运行的动作。
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
     * @return {Boolean} True 有效的落下返回true否则为false
     */
    notifyDrop : function(dd, e, data){
        return false;
    }
});