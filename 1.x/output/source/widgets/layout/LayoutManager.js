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
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @ 布局管理器类
 * @ 继承 Ext.util.Observable
 * 布局管理器的基类
 */
Ext.LayoutManager = function(container, config){
    Ext.LayoutManager.superclass.constructor.call(this);
    this.el = Ext.get(container);
    // ie 情况下滚动条修复
    if(this.el.dom == document.body && Ext.isIE && !config.allowScroll){
        document.body.scroll = "no";
    }else if(this.el.dom != document.body && this.el.getStyle('position') == 'static'){
        this.el.position('relative');
    }
    this.id = this.el.id;
    this.el.addClass("x-layout-container");
    /** 设置为false, 则不能根据监视器大小来调整窗口 */
    this.monitorWindowResize = true;
    this.regions = {};
    this.addEvents({
        /**
         * @event layout
         * 当布局完成时触发该事件.
         * @param {Ext.LayoutManager} this
         */
        "layout" : true,
        /**
         * @event regionresized
         * 当用户调整区域大小时触发该事件.
         * @param {Ext.LayoutRegion} region 要调整大小的区域
         * @param {Number} newSize 对于东、西两个区域来说只会调整宽度;对于南、北两个区域来说，只会调整高度.
         */
        "regionresized" : true,
        /**
         * @event regioncollapsed
         * 当区域折叠起来时触发该事件.
         * @param {Ext.LayoutRegion} region 己折叠的区域
         */
        "regioncollapsed" : true,
        /**
         * @event regionexpanded
         * 当区域展开时触发该事件.
         * @param {Ext.LayoutRegion} region 己展开的区域
         */
        "regionexpanded" : true
    });
    this.updating = false;
    Ext.EventManager.onWindowResize(this.onWindowResize, this, true);
};

Ext.extend(Ext.LayoutManager, Ext.util.Observable, {
    /**
     * Returns true if this layout is currently being updated
     * 如果布局当前正在更新，返回True,反之亦然.
     * @return {Boolean}
     */
    isUpdating : function(){
        return this.updating; 
    },
    
    /**
     * 在多个添加或删除调用时进行自动布局情况下，延缓布局管理器.
     */
    beginUpdate : function(){
        this.updating = true;    
    },
    
    /**
     * 恢复自动布局并且在执行布局时可随意地使更新操作失效.
     * @param {Boolean} noLayout 设为true来使布局的更新失效.
     */
    endUpdate : function(noLayout){
        this.updating = false;
        if(!noLayout){
            this.layout();
        }    
    },
    
    layout: function(){
        
    },
    
    onRegionResized : function(region, newSize){
        this.fireEvent("regionresized", region, newSize);
        this.layout();
    },
    
    onRegionCollapsed : function(region){
        this.fireEvent("regioncollapsed", region);
    },
    
    onRegionExpanded : function(region){
        this.fireEvent("regionexpanded", region);
    },
        
    /**
     * 返回当前视图的大小，该方法规格化document.body和element元素内含的布局并且执行box-model调整
     * @return {Object} 以对象形式返回大小，如格式： {width: (the width), height: (the height)}
     */
    getViewSize : function(){
        var size;
        if(this.el.dom != document.body){
            size = this.el.getSize();
        }else{
            size = {width: Ext.lib.Dom.getViewWidth(), height: Ext.lib.Dom.getViewHeight()};
        }
        size.width -= this.el.getBorderWidth("lr")-this.el.getPadding("lr");
        size.height -= this.el.getBorderWidth("tb")-this.el.getPadding("tb");
        return size;
    },
    
    /**
     * 返回该代表该布局的对象.
     * @return {Ext.Element}
     */
    getEl : function(){
        return this.el;
    },
    
    /**
     * 返回指定的区域
     * @param {String} target 代表区域的关键字，如 ('center', 'north', 'south', 'east' or 'west')
     * @return {Ext.LayoutRegion} 返回布局区域.
     */
    getRegion : function(target){
        return this.regions[target.toLowerCase()];
    },
    
    onWindowResize : function(){
        if(this.monitorWindowResize){
            this.layout();
        }
    }
});