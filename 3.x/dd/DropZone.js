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
 * @class Ext.dd.DropZone
 * @extends Ext.dd.DropTarget
 * <p>对于多个子节点的目标，该类提供一个DD实例的容器（扮演代理角色）。This class provides a container DD instance that allows dropping on multiple child target nodes.</p>
 * <p>默认地，该类需要一个可拖动的子节点，并且需在{@link Ext.dd.Registry}登记好的。By default, this class requires that child nodes accepting drop are registered with {@link Ext.dd.Registry}.
 * However a simpler way to allow a DropZone to manage any number of target elements is to configure the
 * DropZone with an implementation of {@link #getTargetFromEvent} which interrogates the passed
 * mouse event to see if it has taken place within an element, or class of elements. This is easily done
 * by using the event's {@link Ext.EventObject#getTarget getTarget} method to identify a node based on a
 * {@link Ext.DomQuery} selector.</p>
 * <p>Once the DropZone has detected through calling getTargetFromEvent, that the mouse is over
 * a drop target, that target is passed as the first parameter to {@link #onNodeEnter}, {@link #onNodeOver},
 * {@link #onNodeOut}, {@link #onNodeDrop}. You may configure the instance of DropZone with implementations
 * of these methods to provide application-specific behaviour for these events to update both
 * application state, and UI state.</p>
 * <p>For example to make a GridPanel a cooperating target with the example illustrated in
 * {@link Ext.dd.DragZone DragZone}, the following technique might be used:</p><pre><code>
myGridPanel.on('render', function() {
    myGridPanel.dropZone = new Ext.dd.DropZone(myGridPanel.getView().scroller, {

//      If the mouse is over a grid row, return that node. This is
//      provided as the "target" parameter in all "onNodeXXXX" node event handling functions
        getTargetFromEvent: function(e) {
            return e.getTarget(myGridPanel.getView().rowSelector);
        },

//      On entry into a target node, highlight that node.
        onNodeEnter : function(target, dd, e, data){ 
            Ext.fly(target).addClass('my-row-highlight-class');
        },

//      On exit from a target node, unhighlight that node.
        onNodeOut : function(target, dd, e, data){ 
            Ext.fly(target).removeClass('my-row-highlight-class');
        },

//      While over a target node, return the default drop allowed class which
//      places a "tick" icon into the drag proxy.
        onNodeOver : function(target, dd, e, data){ 
            return Ext.dd.DropZone.prototype.dropAllowed;
        },

//      On node drop we can interrogate the target to find the underlying
//      application object that is the real target of the dragged data.
//      In this case, it is a Record in the GridPanel's Store.
//      We can use the data set up by the DragZone's getDragData method to read
//      any data we decided to attach in the DragZone's getDragData method.
        onNodeDrop : function(target, dd, e, data){
            var rowIndex = myGridPanel.getView().findRowIndex(target);
            var r = myGridPanel.getStore().getAt(rowIndex);
            Ext.Msg.alert('Drop gesture', 'Dropped Record id ' + data.draggedRecord.id +
                ' on Record id ' + r.id);
            return true;
        }
    });
}
</code></pre>
 * See the {@link Ext.dd.DragZone DragZone} documentation for details about building a DragZone which
 * cooperates with this DropZone.
 * @constructor
 * @param {Mixed} el 容器元素
 * @param {Object} config
 */
Ext.dd.DropZone = function(el, config){
    Ext.dd.DropZone.superclass.constructor.call(this, el, config);
};

Ext.extend(Ext.dd.DropZone, Ext.dd.DropTarget, {
    /**
     * 返回一个自定义数据对象，与事件对象的那个DOM节点关联。
     * 默认地，该方法会在事件目标{@link Ext.dd.Registry}中查找对象，但是你亦可以根据自身的需求，重写该方法。
     * Returns a custom data object associated with the DOM node that is the target of the event.  By default
     * this looks up the event target in the {@link Ext.dd.Registry}, although you can override this method to
     * provide your own custom lookup.
     * @param {Event} e 事件对象The event
     * @return {Object} data 自定义数据The custom data
     */
    getTargetFromEvent : function(e){
        return Ext.dd.Registry.getTargetFromEvent(e);
    },

    /**
     * 当DropZone确定有一个{@link Ext.dd.DragSource}，已经进入一个已登记的落下节点（drop node）的范围内，就会调用。
     * 该方法没有默认的实现。如需为某些指定的节点处理，则要重写该方法。
     * Called when the DropZone determines that a {@link Ext.dd.DragSource} has entered a drop node
     * that has either been registered or detected by a configured implementation of {@link #getTargetFromEvent}.
     * This method has no default implementation and should be overridden to provide
     * node-specific processing if necessary.
     * @param {Object} nodeData 自定义数据对象，包含有落下节点（drop node）的内容（其节点的内容与用{@link #getTargetFromEvent}方法得到的值一样）The custom data associated with the drop node (this is the same value returned from 
     * {@link #getTargetFromEvent} for this node)
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源The drag source that was dragged over this drop zone
     * @param {Event} e 事件对象The event
     * @param {Object} data 由拖动源规定格式的数据对象An object containing arbitrary data supplied by the drag source
     */
    onNodeEnter : function(n, dd, e, data){
        
    },

    /**
     * 当DropZone确定有一个{@link Ext.dd.DragSource}，已经位于一个已登记的落下节点（drop node）的上方时，就会调用。
     * 默认的实现是返回this.dropAllowed。因此应该重写它以便提供合适的反馈。
     * Called while the DropZone determines that a {@link Ext.dd.DragSource} is over a drop node
     * that has either been registered or detected by a configured implementation of {@link #getTargetFromEvent}.
     * The default implementation returns this.dropNotAllowed, so it should be
     * overridden to provide the proper feedback.
     * @param {Object} nodeData 自定义数据对象，包含有落下节点（drop node）的内容（其节点的内容与用{@link #getTargetFromEvent}方法得到的值一样）The custom data associated with the drop node (this is the same value returned from
     * {@link #getTargetFromEvent} for this node)
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源The drag source that was dragged over this drop zone
     * @param {Event} e 事件对象The event
     * @param {Object} data 由拖动源规定格式的数据对象An object containing arbitrary data supplied by the drag source
     * @return {String} status 由落下状态反馈到源的CSS class,使得所在的{@link Ext.dd.StatusProxy}可被更新。The CSS class that communicates the drop status back to the source so that the
     * underlying {@link Ext.dd.StatusProxy} can be updated
     */
    onNodeOver : function(n, dd, e, data){
        return this.dropAllowed;
    },

    /**
     * 当DropZone确定有一个{@link Ext.dd.DragSource}，
     * 已经离开一个已登记的落下节点（drop node）的范围内，就会调用。
     * 该方法没有默认的实现。如需为某些指定的节点处理，则要重写该方法。
     * Called when the DropZone determines that a {@link Ext.dd.DragSource} has been dragged out of
     * the drop node without dropping.  This method has no default implementation and should be overridden to provide
     * node-specific processing if necessary.
     * @param {Object} nodeData 自定义数据对象，包含有落下节点（drop node）的内容（其节点的内容与用{@link #getTargetFromEvent}方法得到的值一样）The custom data associated with the drop node (this is the same value returned from
     * {@link #getTargetFromEvent} for this node)
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源The drag source that was dragged over this drop zone
     * @param {Event} e 事件对象The event
     * @param {Object} data 由拖动源规定格式的数据对象An object containing arbitrary data supplied by the drag source
     */
    onNodeOut : function(n, dd, e, data){
        
    },

    /**
     * 当DropZone确定有一个{@link Ext.dd.DragSource}，
     * 已经在一个已登记的落下节点（drop node）落下的时候，就会调用。
     * 默认的方法返回false，应提供一个合适的实现来处理落下的事件，重写该方法，
     * 并返回true值，说明拖放行为有效，拖动源的修复动作便不会进行。
     * Called when the DropZone determines that a {@link Ext.dd.DragSource} has been dropped onto
     * the drop node.  The default implementation returns false, so it should be overridden to provide the
     * appropriate processing of the drop event and return true so that the drag source's repair action does not run.
     * @param {Object} nodeData 自定义数据对象，包含有落下节点（drop node）的内容（其节点的内容与用{@link #getTargetFromEvent}方法得到的值一样）The custom data associated with the drop node (this is the same value returned from
     * {@link #getTargetFromEvent} for this node)
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源The drag source that was dragged over this drop zone
     * @param {Event} e 事件对象The event
     * @param {Object} data 由拖动源规定格式的数据对象An object containing arbitrary data supplied by the drag source
     * @return {Boolean} 有效的落下返回true否则为falseTrue if the drop was valid, else false
     */
    onNodeDrop : function(n, dd, e, data){
        return false;
    },

    /**
     * 当DrapZone发现有一个{@link Ext.dd.DragSource}正处于其上方时，但是没有放下任何落下的节点时调用。
     * 默认的实现是返回this.dropNotAllowed，如需提供一些合适的反馈，应重写该函数。
     * Called while the DropZone determines that a {@link Ext.dd.DragSource} is being dragged over it,
     * but not over any of its registered drop nodes.  The default implementation returns this.dropNotAllowed, so
     * it should be overridden to provide the proper feedback if necessary.
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源The drag source that was dragged over this drop zone
     * @param {Event} e 事件对象The event
     * @param {Object} data 由拖动源规定格式的数据对象An object containing arbitrary data supplied by the drag source
     * @return {String} status 由落下状态反馈到源的CSS class，使得所在的{@link Ext.dd.StatusProxy}可被更新。The CSS class that communicates the drop status back to the source so that the
     * underlying {@link Ext.dd.StatusProxy} can be updated
     */
    onContainerOver : function(dd, e, data){
        return this.dropNotAllowed;
    },

    /**
     * 当DrapZone确定{@link Ext.dd.DragSource}落下的动作已经执行，但是没有放下任何落下的节点时调用。
     * 欲将DropZone本身也可接收落下的行为，应提供一个合适的实现来处理落下的事件，重写该方法，并返回true值，
     * 说明拖放行为有效，拖动源的修复动作便不会进行。默认的实现返回false。
     * Called when the DropZone determines that a {@link Ext.dd.DragSource} has been dropped on it,
     * but not on any of its registered drop nodes.  The default implementation returns false, so it should be
     * overridden to provide the appropriate processing of the drop event if you need the drop zone itself to
     * be able to accept drops.  It should return true when valid so that the drag source's repair action does not run.
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源The drag source that was dragged over this drop zone
     * @param {Event} e 事件对象The event
     * @param {Object} data 由拖动源规定格式的数据对象An object containing arbitrary data supplied by the drag source
     * @return {Boolean} 有效的落下返回true否则为falseTrue if the drop was valid, else false
     */
    onContainerDrop : function(dd, e, data){
        return false;
    },

    /**
	 * 通知DropZone源已经在Zone上方的函数。
     * 默认的实现返回this.dropNotAllowed，一般说只有登记的落下节点可以处理拖放操作。
     * 欲将DropZone本身也可接收落下的行为，应提供一个自定义的实现，重写该方法。
     * The function a {@link Ext.dd.DragSource} calls once to notify this drop zone that the source is now over
     * the zone.  The default implementation returns this.dropNotAllowed and expects that only registered drop
     * nodes can process drag drop operations, so if you need the drop zone itself to be able to process drops
     * you should override this method and provide a custom implementation.
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源The drag source that was dragged over this drop zone
     * @param {Event} e 事件对象The event
     * @param {Object} data 由拖动源规定格式的数据对象An object containing arbitrary data supplied by the drag source
     * @return {String} status 由落下状态反馈到源的CSS class，使得所在的{@link Ext.dd.StatusProxy}可被更新。The CSS class that communicates the drop status back to the source so that the
     * underlying {@link Ext.dd.StatusProxy} can be updated
     */
    notifyEnter : function(dd, e, data){
        return this.dropNotAllowed;
    },

    /**
     * 当{@link Ext.dd.DragSource}在DropZone范围内时，拖动过程中不断调用的函数。
     * 拖动源进入DropZone后，进入每移动一下鼠标都会调用该方法。
	 * 如果拖动源当前在已登记的节点上，通知过程会调用{@link #onNodeOver}，
	 * 如果拖动源进入{@link #onNodeEnter}，{@link #onNodeOut}这样已登记的节点，通知过程会按照需要自动进行指定的节点处理，
	 * 如果拖动源当前在已登记的节点上，通知过程会调用{@link #onContainerOver}。
     * The function a {@link Ext.dd.DragSource} calls continuously while it is being dragged over the drop zone.
     * This method will be called on every mouse movement while the drag source is over the drop zone.
     * It will call {@link #onNodeOver} while the drag source is over a registered node, and will also automatically
     * delegate to the appropriate node-specific methods as necessary when the drag source enters and exits
     * registered nodes ({@link #onNodeEnter}, {@link #onNodeOut}). If the drag source is not currently over a
     * registered node, it will call {@link #onContainerOver}.
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源The drag source that was dragged over this drop zone
     * @param {Event} e 事件对象The event
     * @param {Object} data 由拖动源规定格式的数据对象An object containing arbitrary data supplied by the drag source
     * @return {String} status 由落下状态反馈到源的CSS class,使得所在的{@link Ext.dd.StatusProxy}可被更新。The CSS class that communicates the drop status back to the source so that the
     * underlying {@link Ext.dd.StatusProxy} can be updated
     */
    notifyOver : function(dd, e, data){
        var n = this.getTargetFromEvent(e);
        if(!n){ // not over valid drop target
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
	 * 通知DropZone源已经离开Zone上方却没有落下时{@link Ext.dd.DragSource}所调用的函数。
	 * 如果拖动源当前在已登记的节点上，通知过程会委托{@link #onNodeOut}进行指定的节点处理，否则的话会被忽略。
     * The function a {@link Ext.dd.DragSource} calls once to notify this drop zone that the source has been dragged
     * out of the zone without dropping.  If the drag source is currently over a registered node, the notification
     * will be delegated to {@link #onNodeOut} for node-specific handling, otherwise it will be ignored.
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源The drag source that was dragged over this drop target
     * @param {Event} e 事件对象The event
     * @param {Object} data 由拖动源地区规定格式的数据对象An object containing arbitrary data supplied by the drag zone
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
     * 否则的话调用{@link #onContainerDrop}。
     * The function a {@link Ext.dd.DragSource} calls once to notify this drop zone that the dragged item has
     * been dropped on it.  The drag zone will look up the target node based on the event passed in, and if there
     * is a node registered for that event, it will delegate to {@link #onNodeDrop} for node-specific handling,
     * otherwise it will call {@link #onContainerDrop}.
     * @param {Ext.dd.DragSource} source 处于落下目标上方的拖动源The drag source that was dragged over this drop zone
     * @param {Event} e 事件对象The event
     * @param {Object} data 由拖动源规定格式的数据对象An object containing arbitrary data supplied by the drag source
     * @return {Boolean} 有效的落下返回true否则为falseTrue if the drop was valid, else false
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