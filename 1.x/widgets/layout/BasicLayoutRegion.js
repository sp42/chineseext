/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.BasicLayoutRegion
 * @extends Ext.util.Observable
 * 该类描述了布局管理器中一个轻量级的区域，该区域除了可以设定面板大小及位置外，不会移动dom节点，并且不含有标题栏，表格，或其它特性.
 * 创建一个基本布局区域，可以在区域配置里这样设置：lightweight:true  或 basic:true
 */
Ext.BasicLayoutRegion = function(mgr, config, pos, skipConfig){
    this.mgr = mgr;
    this.position  = pos;
    this.events = {
        /**
         * @event beforeremove
         * 在面板被取消或关闭前触发该事件.在事件参数中，设置"e.cancel = true"来取消撤除.
         * @param {Ext.LayoutRegion} this
         * @param {Ext.ContentPanel} panel 面板
         * @param {Object} e 取消的事件对象
         */
        "beforeremove" : true,
        /**
         * @event invalidated
         * 当该区域的布局改变时触发事件
         * @param {Ext.LayoutRegion} this
         */
        "invalidated" : true,
        /**
         * @event visibilitychange
         * 当该区域被设置成可见或隐藏时触发该事件.
         * Fires when this region is shown or hidden 
         * @param {Ext.LayoutRegion} this
         * @param {Boolean} 设成True,为可见， 设为false,为隐藏.
         */
        "visibilitychange" : true,
        /**
         * @event paneladded
         * 当一个面板被添加时触发该事件.
         * @param {Ext.LayoutRegion} this
         * @param {Ext.ContentPanel} panel The panel
         */
        "paneladded" : true,
        /**
         * @event panelremoved
         * 当一个面板被去除时触发该事件.
         * @param {Ext.LayoutRegion} this
         * @param {Ext.ContentPanel} panel The panel
         */
        "panelremoved" : true,
        /**
         * @event collapsed
         * 当区域折叠起来时触发该事件.
         * @param {Ext.LayoutRegion} this
         */
        "collapsed" : true,
        /**
         * @event expanded
         * 当区域展开时触发该事件.
         * @param {Ext.LayoutRegion} this
         */
        "expanded" : true,
        /**
         * @event slideshow
         * 当区域滑入视图时触发该事件.
         * @param {Ext.LayoutRegion} this
         */
        "slideshow" : true,
        /**
         * @event slidehide
         * 当区域滑出视图时触发该事件.
         * @param {Ext.LayoutRegion} this
         */
        "slidehide" : true,
        /**
         * @event panelactivated
         * Fires when a panel is activated. 
         * 当一个面板被激活时触发该事件.
         * @param {Ext.LayoutRegion} this
         * @param {Ext.ContentPanel} panel 被激活的面板.
         */
        "panelactivated" : true,
        /**
         * @event resized
         * 当用户调整区域大小时触发该事件.
         * @param {Ext.LayoutRegion} this
         * @param {Number} newSize 对于东、西两区域来说是宽度的调整，对于南、北两区域是高度的调整.
         */
        "resized" : true
    };
    /** 某区域内面板的集合，类型是 Ext.util.MixedCollection */
    this.panels = new Ext.util.MixedCollection();
    this.panels.getKey = this.getPanelId.createDelegate(this);
    this.box = null;
    this.activePanel = null;
    if(skipConfig !== true){
        this.applyConfig(config);
    }
};

Ext.extend(Ext.BasicLayoutRegion, Ext.util.Observable, {
    getPanelId : function(p){
        return p.getId();
    },
    
    applyConfig : function(config){
        this.margins = config.margins || this.margins || {top: 0, left: 0, right:0, bottom: 0};
        this.config = config;
    },
    
    /**
     * 调整区域到指定大小，对于垂直区域（东、西），即调整宽度，对于水平区域（南、北），即调整高度.
     * @param {Number} newSize 新的高度或宽度.
     */
    resizeTo : function(newSize){
        var el = this.el ? this.el :
                 (this.activePanel ? this.activePanel.getEl() : null);
        if(el){
            switch(this.position){
                case "east":
                case "west":
                    el.setWidth(newSize);
                    this.fireEvent("resized", this, newSize);
                break;
                case "north":
                case "south":
                    el.setHeight(newSize);
                    this.fireEvent("resized", this, newSize);
                break;                
            }
        }
    },
    
    getBox : function(){
        return this.activePanel ? this.activePanel.getEl().getBox(false, true) : null;
    },
    
    getMargins : function(){
        return this.margins;
    },
    
    updateBox : function(box){
        this.box = box;
        var el = this.activePanel.getEl();
        el.dom.style.left = box.x + "px";
        el.dom.style.top = box.y + "px";
        this.activePanel.setSize(box.width, box.height);
    },
    
    /**
     * 返回代表区域的容器对象.
     * @return {Ext.Element}
     */
    getEl : function(){
        return this.activePanel;
    },
    
    /**
     * 如果区域当前可见，返回true,反之亦然. 
     * @return {Boolean}
     */
    isVisible : function(){
        return this.activePanel ? true : false;
    },
    
    setActivePanel : function(panel){
        panel = this.getPanel(panel);
        if(this.activePanel && this.activePanel != panel){
            this.activePanel.setActiveState(false);
            this.activePanel.getEl().setLeftTop(-10000,-10000);
        }
        this.activePanel = panel;
        panel.setActiveState(true);
        if(this.box){
            panel.setSize(this.box.width, this.box.height);
        }
        this.fireEvent("panelactivated", this, panel);
        this.fireEvent("invalidated");
    },
    
    /**
     * 显示指定的面板
     * @param {Number/String/ContentPanel} 面板的ID，或序号或面板对象
     * @return {Ext.ContentPanel} 如果该面板存在，则返回之;否则返回空.
     */
    showPanel : function(panel){
        if(panel = this.getPanel(panel)){
            this.setActivePanel(panel);
        }
        return panel;
    },
    
    /**
     * Get the active panel for this region.
     * 获取区域中当前活动的面板.
     * @return {Ext.ContentPanel} 如果当前有活动面板，则返回之;反之返回空.
     */
    getActivePanel : function(){
        return this.activePanel;
    },
    
    /**
     * Add the passed ContentPanel(s)
     * 添加一个或多个传入的内容面板. 
     * @param {ContentPanel...} panel 要添加进来的一个或多个内容面板.
     * @return {Ext.ContentPanel} The panel 如果只添加一个面板的话则反回该面板.多个则返回空.
     */
    add : function(panel){
        if(arguments.length > 1){
            for(var i = 0, len = arguments.length; i < len; i++) {
            	this.add(arguments[i]);
            }
            return null;
        }
        if(this.hasPanel(panel)){
            this.showPanel(panel);
            return panel;
        }
        var el = panel.getEl();
        if(el.dom.parentNode != this.mgr.el.dom){
            this.mgr.el.dom.appendChild(el.dom);
        }
        if(panel.setRegion){
            panel.setRegion(this);
        }
        this.panels.add(panel);
        el.setStyle("position", "absolute");
        if(!panel.background){
            this.setActivePanel(panel);
            if(this.config.initialSize && this.panels.getCount()==1){
                this.resizeTo(this.config.initialSize);
            }
        }
        this.fireEvent("paneladded", this, panel);
        return panel;
    },
    
    /**
     * 如果此区域中包括该面板则返回true,反之亦然.
     * @param {Number/String/ContentPanel} panel 面板的ID，或序号或面板对象.
     * @return {Boolean}
     */
    hasPanel : function(panel){
        if(typeof panel == "object"){ // must be panel obj
            panel = panel.getId();
        }
        return this.getPanel(panel) ? true : false;
    },
    
    /**
     * 移除掉指定的面板，如果preservePanel属性没被设置为true,该面板将被消毁.
     * @param {Number/String/ContentPanel} panel Tpanel 面板的ID，或序号或面板对象.
     * @param {Boolean} preservePanel 是否重载config中preserverPanel属性
     * @return {Ext.ContentPanel} 被移除的面板
     */
    remove : function(panel, preservePanel){
        panel = this.getPanel(panel);
        if(!panel){
            return null;
        }
        var e = {};
        this.fireEvent("beforeremove", this, panel, e);
        if(e.cancel === true){
            return null;
        }
        var panelId = panel.getId();
        this.panels.removeKey(panelId);
        return panel;
    },
    
    /**
     * 如果指定的面板存在，则返回之;反之，返回空.
     * @param {Number/String/ContentPanel} panel 面板的ID，或序号或面板对象.
     * @return {Ext.ContentPanel}
     */
    getPanel : function(id){
        if(typeof id == "object"){ // must be panel obj
            return id;
        }
        return this.panels.get(id);
    },
    
    /**
     * 返回区域的位置.如 (north/south/east/west/center).
     * @return {String} 
     */
    getPosition: function(){
        return this.position;    
    }
});