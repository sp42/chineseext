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
 * @class Ext.dd.DragZone
 * @extends Ext.dd.DragSource
 * <p>该类继承了{@link Ext.dd.DragSource}，对于多节点的源，该类提供了一个DD实理容器来代理。
 * This class provides a container DD instance that allows dragging of multiple child source nodes.</p>
 * <p>This class does not move the drag target nodes, but a proxy element which may contain
 * any DOM structure you wish. The DOM element to show in the proxy is provided by either a
 * provided implementation of {@link #getDragData}, or by registered draggables registered with {@link Ext.dd.Registry}</p>
 * <p>If you wish to provide draggability for an arbitrary number of DOM nodes, each of which represent some
 * application object (For example nodes in a {@link Ext.DataView DataView}) then use of this class
 * is the most efficient way to "activate" those nodes.</p>
 * <p>
 * 默认情况下，该类要求可拖动的子节点已在{@link Ext.dd.Registry}类中全部注册。
 * By default, this class requires that draggable child nodes are registered with {@link Ext.dd.Registry}.
 * However a simpler way to allow a DragZone to manage any number of draggable elements is to configure
 * the DragZone with  an implementation of the {@link #getDragData} method which interrogates the passed
 * mouse event to see if it has taken place within an element, or class of elements. This is easily done
 * by using the event's {@link Ext.EventObject#getTarget getTarget} method to identify a node based on a
 * {@link Ext.DomQuery} selector. For example, to make the nodes of a DataView draggable, use the following
 * technique. Knowledge of the use of the DataView is required:</p>
 * <pre><code>
myDataView.on('render', function() {
    myDataView.dragZone = new Ext.dd.DragZone(myDataView.getEl(), {

//      On receipt of a mousedown event, see if it is within a DataView node.
//      Return a drag data object if so.
        getDragData: function(e) {

//          Use the DataView's own itemSelector (a mandatory property) to
//          test if the mousedown is within one of the DataView's nodes.
            var sourceEl = e.getTarget(myDataView.itemSelector, 10);

//          If the mousedown is within a DataView node, clone the node to produce
//          a ddel element for use by the drag proxy. Also add application data
//          to the returned data object.
            if (sourceEl) {
                d = sourceEl.cloneNode(true);
                d.id = Ext.id();
                return {
                    ddel: d,
                    sourceEl: sourceEl,
                    repairXY: Ext.fly(sourceEl).getXY(),
                    sourceStore: myDataView.store,
                    draggedRecord: v.getRecord(sourceEl)
                }
            }
        },

//      Provide coordinates for the proxy to slide back to on failed drag.
//      This is the original XY coordinates of the draggable element captured
//      in the getDragData method.
        getRepairXY: function() {
            return this.dragData.repairXY;
        }
    });
});</code></pre>
 * See the {@link Ext.dd.DropZone DropZone} documentation for details about building a DropZone which
 * cooperates with this DragZone.
 * @constructor
 * @param {Mixed} el 容器元素
 * @param {Object} config
 */
Ext.dd.DragZone = function(el, config){
    Ext.dd.DragZone.superclass.constructor.call(this, el, config);
    if(this.containerScroll){
        Ext.dd.ScrollManager.register(this.el);
    }
};

Ext.extend(Ext.dd.DragZone, Ext.dd.DragSource, {
    /**
     * This property contains the data representing the dragged object. This data is set up by the implementation
     * of the {@link #getDragData} method. It must contain a <tt>ddel</tt> property, but can contain
     * any other data according to the application's needs.
     * @type Object
     * @property dragData
     */
    /**
     * @cfg {Boolean} containerScroll 设为True 用来将此容器在Scrollmanager上注册,使得在拖动操作发生时可以自动卷动。
     * True to register this container with the Scrollmanager
     * for auto scrolling during drag operations.
     */
    /**
     * @cfg {String} hlColor 第二个参数:hlColor 用于在一次失败的拖动操作后调用afterRepair方法会用在此设定的颜色(默认颜色为亮蓝"c3daf9")来标识可见的拽源
     * The color to use when visually highlighting the drag source in the afterRepair
     * method after a failed drop (defaults to "c3daf9" - light blue)
     */

    /**
     * 该方法会在鼠标位于该容器内按下时触发，个中机制可参照类{@link Ext.dd.Registry}，因为有效的拖动目标是以获取鼠标按下事件为前提的。<br/>
     * 如果想实现自己的查找方式（如根据类名查找子对象），可以重载这个方法，但是必须确保该方法返回的对象有一个"ddel"属性（属性的值是一个HTML元素），以便函数能正常工作。<br/>   
     * Called when a mousedown occurs in this container. Looks in {@link Ext.dd.Registry}
     * for a valid target to drag based on the mouse down. Override this method
     * to provide your own lookup logic (e.g. finding a child by class name). Make sure your returned
     * object has a "ddel" attribute (with an HTML Element) for other functions to work.
     * @param {EventObject} e 鼠标按下事件The mouse down event
     * @return {Object} 被拖拽对象The dragData
     */
    getDragData : function(e){
        return Ext.dd.Registry.getHandleFromEvent(e);
    },
    
    
    /**
     * 该方法在拖拽动作开始，初始化代理元素时调用，默认情况下，它克隆了this.dragData.ddel。
     * Called once drag threshold has been reached to initialize the proxy element. By default, it clones the
     * this.dragData.ddel.
     * @param {Number} x  被点击的拖拽对象的X坐标The x position of the click on the dragged object
     * @param {Number} y  被点击的拖拽对象的y坐标The y position of the click on the dragged object
     * @return {Boolean} 该方法返回一个布尔常量,当返回true时,表示继续(保持)拖拽,返回false时,表示取消拖拽true to continue the drag, false to cancel
     */
    onInitDrag : function(x, y){
        this.proxy.update(this.dragData.ddel.cloneNode(true));
        this.onStartDrag(x, y);
        return true;
    },
    
    /**
     * 该方法在修复无效的drop操作后调用。默认情况下，高亮显示this.dragData.ddel。     
     * Called after a repair of an invalid drop. By default, highlights this.dragData.ddel 
     */
    afterRepair : function(){
        if(Ext.enableFx){
            Ext.Element.fly(this.dragData.ddel).highlight(this.hlColor || "c3daf9");
        }
        this.dragging = false;
    },
    
    /**
     * 该方法在修复无效的drop操作之前调用，用来获取XY对象来激活(使用对象)，默认情况下返回this.dragData.ddel的XY属性
     * Called before a repair of an invalid drop to get the XY to animate to. By default returns
     * the XY of this.dragData.ddel
     * @param {EventObject} e 鼠标松开事件The mouse up event
     * @return {Array} 区域的xy位置 (例如: [100, 200])The xy location (e.g. [100, 200])
     */
    getRepairXY : function(e){
        return Ext.Element.fly(this.dragData.ddel).getXY();  
    }
});