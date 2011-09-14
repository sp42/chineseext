/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.dd.DropZone
 * @extends Ext.dd.DropTarget
 * 对于多个子节点的目标，该类提供一个DD实例的容器（扮演代理角色）。<br />
 * 默认地，该类需要一个可拖动的子节点，并且需在{@link Ext.dd.Registry}登记好的。
 * @constructor
 * @param {String/HTMLElement/Element} el  
 * @param {Object} config
 */
Ext.dd.DropZone = function(el, config){
    Ext.dd.DropZone.superclass.constructor.call(this, el, config);
};

Ext.extend(Ext.dd.DropZone, Ext.dd.DropTarget, {
    /**
     * 返回一个自定义数据对象，与事件对象的那个DOM节点关联。
     * 默认地，该方法会在事件目标{@link Ext.dd.Registry}中查找对象，
     * 但是你亦可以根据自身的需求，重写该方法。
     * @param {Event} e 事件对象
     * @return {Object} data 自定义数据
     */
    getTargetFromEvent : function(e){
        return Ext.dd.Registry.getTargetFromEvent(e);
    },

    /**
     * 内部调用。当DropZone确定有一个{@link Ext.dd.DragSource}，
     * 已经进入一个已登记的落下节点（drop node）的范围内，就会调用。
     * 该方法没有默认的实现。如需为某些指定的节点处理，则要重写该方法。
     * @param {Object} nodeData 自定义数据对象，包含有落下节点（drop node）的内容（其节点的内容与用{@link #getTargetFromEvent}方法得到的值一样）
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象 
     */
    onNodeEnter : function(n, dd, e, data){
        
    },

    /**
     * 内部调用。当DropZone确定有一个{@link Ext.dd.DragSource}，
     * 已经位于一个已登记的落下节点（drop node）的上方时，就会调用。
     * 默认的实现是返回this.dropAllowed。因此应该重写它以便提供合适的反馈。
     * @param {Object} nodeData 自定义数据对象，包含有落下节点（drop node）的内容（其节点的内容与用{@link #getTargetFromEvent}方法得到的值一样）
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象 
     * @return {String} status 由落下状态反馈到源的CSS class,使得所在的{@link Ext.dd.StatusProxy}可被更新。
     */
    onNodeOver : function(n, dd, e, data){
        return this.dropAllowed;
    },

    /**
     * 内部调用。当DropZone确定有一个{@link Ext.dd.DragSource}，
     * 已经离开一个已登记的落下节点（drop node）的范围内，就会调用。
     * 该方法没有默认的实现。如需为某些指定的节点处理，则要重写该方法。
     * @param {Object} nodeData 自定义数据对象，包含有落下节点（drop node）的内容（其节点的内容与用{@link #getTargetFromEvent}方法得到的值一样）
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
    */
    onNodeOut : function(n, dd, e, data){
        
    },

    /**
     * 内部调用。当DropZone确定有一个{@link Ext.dd.DragSource}，
     * 已经在一个已登记的落下节点（drop node）落下的时候，就会调用。
     * 默认的方法返回false，应提供一个合适的实现来处理落下的事件，重写该方法，
     * 并返回true值，说明拖放行为有效，拖动源的修复动作便不会进行。
     * @param {Object} nodeData 自定义数据对象，包含有落下节点（drop node）的内容（其节点的内容与用{@link #getTargetFromEvent}方法得到的值一样）
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
     * @return {Boolean} True 有效的落下返回true否则为false
     */
    onNodeDrop : function(n, dd, e, data){
        return false;
    },

    /**
     * 内部调用。当DrapZone发现有一个{@link Ext.dd.DragSource}正处于其上方时，但是没有放下任何落下的节点时调用。
     * 默认的实现是返回this.dropNotAllowed，如需提供一些合适的反馈，应重写该函数。
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
     * @return {String} status 由落下状态反馈到源的CSS class,使得所在的{@link Ext.dd.StatusProxy}可被更新。
     */
    onContainerOver : function(dd, e, data){
        return this.dropNotAllowed;
    },

    /**
     * 内部调用。当DrapZone确定{@link Ext.dd.DragSource}落下的动作已经执行，但是没有放下任何落下的节点时调用。
     * 欲将DropZone本身也可接收落下的行为，应提供一个合适的实现来处理落下的事件，重写该方法，并返回true值，
     * 说明拖放行为有效，拖动源的修复动作便不会进行。默认的实现返回false。
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
     * @return {Boolean} True 有效的落下返回true否则为false
     */
    onContainerDrop : function(dd, e, data){
        return false;
    },

    /**
	 * 通知DropZone源已经在Zone上方的函数。
     * 默认的实现返回this.dropNotAllowed，一般说只有登记的落下节点可以处理拖放操作。
     * 欲将DropZone本身也可接收落下的行为，应提供一个自定义的实现，重写该方法，
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
     * @return {String} status 由落下状态反馈到源的CSS class,使得所在的{@link Ext.dd.StatusProxy}可被更新。
     */
    notifyEnter : function(dd, e, data){
        return this.dropNotAllowed;
    },

    /**
     * 当{@link Ext.dd.DragSource}在DropZone范围内时，拖动过程中不断调用的函数。
     * 拖动源进入DropZone后，进入每移动一下鼠标都会调用该方法。
	 * 如果拖动源当前在已登记的节点上，通知过程会调用{@link #onNodeOver}，
	 * 如果拖动源进入{@link #onNodeEnter}, {@link #onNodeOut}这样已登记的节点，通知过程会按照需要自动进行指定的节点处理，
	 * 如果拖动源当前在已登记的节点上，通知过程会调用{@link #onContainerOver}。
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
     * @return {String} status 由落下状态反馈到源的CSS class,使得所在的{@link Ext.dd.StatusProxy}可被更新。
     */
    notifyOver : function(dd, e, data){
        var n = this.getTargetFromEvent(e);
        if(!n){ // 不在有效的drop target上
            if(this.lastOverNode){
                this.onNodeOut(this.lastOverNode, dd, e, data);
                this.lastOverNode = null;
            }
            return this.onContainerOver(dd, e, data);
        }
        if(this.lastOverNode != n){
            if(this.lastOverNode){
                this.onNodeOut(this.lastOverNode, dd, e, data);
            }
            this.onNodeEnter(n, dd, e, data);
            this.lastOverNode = n;
        }
        return this.onNodeOver(n, dd, e, data);
    },

    /**
	 * 通知DropZone源已经离开Zone上方{@link Ext.dd.DragSource}所调用的函数。
	 * 如果拖动源当前在已登记的节点上，通知过程会委托{@link #onNodeOut}进行指定的节点处理，
     * 否则的话会被忽略。
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
     */
    notifyOut : function(dd, e, data){
        if(this.lastOverNode){
            this.onNodeOut(this.lastOverNode, dd, e, data);
            this.lastOverNode = null;
        }
    },

    /**  
	 * 通知DropZone源已经在Zone放下item后{@link Ext.dd.DragSource}所调用的函数。
	 * 传入事件的参数，DragZone以此查找目标节点，若是事件已登记的节点的话，便会委托{@link #onNodeDrop}进行指定的节点处理。
     * 否则的话调用{@link #onContainerDrop}.
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源
     * @param {Event} e 事件对象
     * @param {Object} data 由拖动源规定格式的数据对象
     * @return {Boolean} True 有效的落下返回true否则为false
     */
    notifyDrop : function(dd, e, data){
        if(this.lastOverNode){
            this.onNodeOut(this.lastOverNode, dd, e, data);
            this.lastOverNode = null;
        }
        var n = this.getTargetFromEvent(e);
        return n ?
            this.onNodeDrop(n, dd, e, data) :
            this.onContainerDrop(dd, e, data);
    },

    // private
    triggerCacheRefresh : function(){
        Ext.dd.DDM.refreshCache(this.groups);
    }  
});