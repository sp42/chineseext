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
 * @class Ext.dd.DragZone
 * 该类继承了Ext.dd.DragSource,对于多节点的源,该类提供了一个DD实理容器来代理.<br/>	
 * 默认情况下,该类要求可拖动的子节点全都在类(Ext.dd.Registry )中己注册
 * @constructor
 * @param {String/HTMLElement/Element} el 第一个参数为容器元素
 * @param {Object} config    第二个参数为配置对象
 */
Ext.dd.DragZone = function(el, config){
    Ext.dd.DragZone.superclass.constructor.call(this, el, config);
    if(this.containerScroll){
        Ext.dd.ScrollManager.register(this.el);
    }
};

Ext.extend(Ext.dd.DragZone, Ext.dd.DragSource, {
    /**
     * @cfg {Boolean} containerScroll 
     *第一个参数:containerScroll 设为True 用来将此容器在Scrollmanager上注册,使得在拖动操作发生时可以自动卷动.
		*/    
    /**
     * @cfg {String} hlColor 
     *第二个参数:hlColor 用于在一次失败的拖动操作后调用afterRepair方法会用在此设定的颜色(默认颜色为亮蓝"c3daf9")来标识可见的拽源<br/>
     */

    /**
     * 该方法在鼠标在该容器中按下时激发,参照类(Ext.dd.Registry),因为有效的拖动目标是基于鼠标按下事件获取的.<br/>
     * 如果想想实现自己的查找方式(如根据类名查找子对象),可以重载这个主法.但是得确保该方法返回的对象有一个"ddel"属性(即返回一个HTML element),以便别的函数能正常工作<br/>   
     * @param {EventObject} e 鼠标按下事件
     * @return {Object} 被拖拽对象
     */
    getDragData : function(e){
        return Ext.dd.Registry.getHandleFromEvent(e);
    },
    
    /**
     * 该方法在拖拽动作开始,初始化代理元素时调用,默认情况下,它克隆this.dragData.ddel.
     * @param {Number} x  被点击的拖拽对象的X坐标
     * @param {Number} y  被点击的拖拽对象的y坐标
     * @return {Boolean} 该方法返回一个布尔常量,当返回true时,表示继续(保持)拖拽,返回false时,表示取消拖拽<br/>
     */
    onInitDrag : function(x, y){
        this.proxy.update(this.dragData.ddel.cloneNode(true));
        this.onStartDrag(x, y);
        return true;
    },
    
    /**
     * 该方法在修复无效的drop操作后调用.默认情况下.高亮显示this.dragData.ddel     
     */
    afterRepair : function(){
        if(Ext.enableFx){
            Ext.Element.fly(this.dragData.ddel).highlight(this.hlColor || "c3daf9");
        }
        this.dragging = false;
    },

    /**
     * 该方法在修复无效的drop操作之前调用,用来获取XY对象来激活(使用对象),默认情况下返回this.dragData.ddel的XY属性
     * @param {EventObject} e 鼠标松开事件
     * @return {Array} 区域的xy位置 (例如: [100, 200]) 
     */
    getRepairXY : function(e){
        return Ext.Element.fly(this.dragData.ddel).getXY();  
    }
});