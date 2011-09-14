/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.LayoutRegion
 * @extends Ext.BasicLayoutRegion
 * 该类描述在布局管理器中的一区域
 * @cfg {Boolean} collapsible 设置为False,使得该区域失去可折叠的能力，默认值为 true.
 * @cfg {Boolean} collapsed 设置为True，使得该区域在初使化时是折叠状的，默认值为false.
 * @cfg {Boolean} floatable 设置为False，使得该区域失去飘动的效果(经过验证，即指当该区域折叠起来时，点击折叠条，该区域不会飘出)，默认值为true.
 * @cfg {Object} margins 该区域的边缘空白(默认值为 {top: 0, left: 0, right:0, bottom: 0})
 * @cfg {Object} cmargins 折叠时该区域边缘空白(对于南、北两区域，默认值为：{top: 2, left: 0, right:0, bottom: 2}对于东、西两区域： {top: 0, left: 2, right:2, bottom: 0})
 * @cfg {String} tabPosition 标题条出现的位置，有"top"和"bottom"两个可选项，默认值为"bottom".
 * @cfg {String} collapsedTitle (可选项) 当南北两区域折叠起来时，出现在折叠条上的字符串.
 * @cfg {Boolean} alwaysShowTabs 当设置为True时，区域总是会显示tabs即使当前只有一个面板.(默认值为:false)
 * @cfg {Boolean} autoScroll 当设置为True时，使得超出的部分会产生滚动条，默认值为:(false)
 * @cfg {Boolean} titlebar 当设置为True时，显示标题栏，(默认值为：true)
 * @cfg {String} title 该区域的标题 (可以通过此属性来重载区域的标题)
 * @cfg {Boolean} animate 设置为True，以动画效果展开|折叠该区域(默认值：false).
 * @cfg {Boolean} autoHide 设置False，使得鼠标离开飘出状态的区域后该区域不能自动隐藏，(默认值为:true)
 * @cfg {Boolean} preservePanels 设置为True，用来保存被移出的面板，使得在后面可以重新添加上去.(默认值为: false)
 * @cfg {Boolean} closeOnTab 设置为True, 在tabs上安置一个关闭图标来代替titlebar(默认值为：false)
 * @cfg {Boolean} hideTabs 设置为rue，来隐藏标题条(默认值为：false)
 * @cfg {Boolean} resizeTabs 设置为True，即能够自动调节tab大小.使得tab能调整自己到能匹配的大小，类似于fireFox1.5之中的tab一样.
 * @cfg {Number} minTabWidth 最小的tab宽度 (默认值为40像素)
 * @cfg {Number} preferredTabWidth 首先的tab宽度 (默认值为:150)
 * @cfg {Boolean} showPin 设置为True，则显示别针按钮
* @cfg {Boolean} hidden 设置为True，则刚开始是该区域隐藏起来.(默认值为：false)
* @cfg {Boolean} hideWhenEmpty 设置为True，使得当该区域没有面板时隐藏起来 
* @cfg {Boolean} disableTabTips 设置为True，tabtips失效.
 */
Ext.LayoutRegion = function(mgr, config, pos){
    Ext.LayoutRegion.superclass.constructor.call(this, mgr, config, pos, true);
    var dh = Ext.DomHelper;
    /** 代表该区域的容器元素. @type Ext.Element */
    this.el = dh.append(mgr.el.dom, {tag: "div", cls: "x-layout-panel x-layout-panel-" + this.position}, true);
    /** 该区域的标题元素 @type Ext.Element */

    this.titleEl = dh.append(this.el.dom, {tag: "div", unselectable: "on", cls: "x-unselectable x-layout-panel-hd x-layout-title-"+this.position, children:[
        {tag: "span", cls: "x-unselectable x-layout-panel-hd-text", unselectable: "on", html: "&#160;"},
        {tag: "div", cls: "x-unselectable x-layout-panel-hd-tools", unselectable: "on"}
    ]}, true);
    this.titleEl.enableDisplayMode();
    /** 区域的标题文本元素 @type HTMLElement */
    this.titleTextEl = this.titleEl.dom.firstChild;
    this.tools = Ext.get(this.titleEl.dom.childNodes[1], true);
    this.closeBtn = this.createTool(this.tools.dom, "x-layout-close");
    this.closeBtn.enableDisplayMode();
    this.closeBtn.on("click", this.closeClicked, this);
    this.closeBtn.hide();

    this.createBody(config);
    this.visible = true;
    this.collapsed = false;

    if(config.hideWhenEmpty){
        this.hide();
        this.on("paneladded", this.validateVisibility, this);
        this.on("panelremoved", this.validateVisibility, this);
    }
    this.applyConfig(config);
};

Ext.extend(Ext.LayoutRegion, Ext.BasicLayoutRegion, {

    createBody : function(){
        /** This region's body element @type Ext.Element */
        this.bodyEl = this.el.createChild({tag: "div", cls: "x-layout-panel-body"});
    },

    applyConfig : function(c){
        if(c.collapsible && this.position != "center" && !this.collapsedEl){
            var dh = Ext.DomHelper;
            if(c.titlebar !== false){
                this.collapseBtn = this.createTool(this.tools.dom, "x-layout-collapse-"+this.position);
                this.collapseBtn.on("click", this.collapse, this);
                this.collapseBtn.enableDisplayMode();

                if(c.showPin === true || this.showPin){
                    this.stickBtn = this.createTool(this.tools.dom, "x-layout-stick");
                    this.stickBtn.enableDisplayMode();
                    this.stickBtn.on("click", this.expand, this);
                    this.stickBtn.hide();
                }
            }
            /** 该区域折叠元素 @type Ext.Element */
            this.collapsedEl = dh.append(this.mgr.el.dom, {cls: "x-layout-collapsed x-layout-collapsed-"+this.position, children:[
                {cls: "x-layout-collapsed-tools", children:[{cls: "x-layout-ctools-inner"}]}
            ]}, true);
            if(c.floatable !== false){
               this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
               this.collapsedEl.on("click", this.collapseClick, this);
            }

            if(c.collapsedTitle && (this.position == "north" || this.position== "south")) {
                this.collapsedTitleTextEl = dh.append(this.collapsedEl.dom, {tag: "div", cls: "x-unselectable x-layout-panel-hd-text",
                   id: "message", unselectable: "on", style:{"float":"left"}});
               this.collapsedTitleTextEl.innerHTML = c.collapsedTitle;
             }
            this.expandBtn = this.createTool(this.collapsedEl.dom.firstChild.firstChild, "x-layout-expand-"+this.position);
            this.expandBtn.on("click", this.expand, this);
        }
        if(this.collapseBtn){
            this.collapseBtn.setVisible(c.collapsible == true);
        }
        this.cmargins = c.cmargins || this.cmargins ||
                         (this.position == "west" || this.position == "east" ?
                             {top: 0, left: 2, right:2, bottom: 0} :
                             {top: 2, left: 0, right:0, bottom: 2});
        this.margins = c.margins || this.margins || {top: 0, left: 0, right:0, bottom: 0};
        this.bottomTabs = c.tabPosition != "top";
        this.autoScroll = c.autoScroll || false;
        if(this.autoScroll){
            this.bodyEl.setStyle("overflow", "auto");
        }else{
            this.bodyEl.setStyle("overflow", "hidden");
        }
        //if(c.titlebar !== false){
            if((!c.titlebar && !c.title) || c.titlebar === false){
                this.titleEl.hide();
            }else{
                this.titleEl.show();
                if(c.title){
                    this.titleTextEl.innerHTML = c.title;
                }
            }
        //}
        this.duration = c.duration || .30;
        this.slideDuration = c.slideDuration || .45;
        this.config = c;
        if(c.collapsed){
            this.collapse(true);
        }
        if(c.hidden){
            this.hide();
        }
    },
    /**
     * 如果当区域当前可见，则返回true,反之亦然.
     * @return {Boolean}
     */
    isVisible : function(){
        return this.visible;
    },

    /**
     * 更新南、北两区域的标题，与配置文件中的可选项collapsedTitle配合使用.
     * @param {String} title (可选项) 标题的文本(接受html标记, 在没有出现空格的情况下，默认为数字符"&amp;#160;")
     */
    setCollapsedTitle : function(title){
        title = title || "&#160;";
        if(this.collapsedTitleTextEl){
            this.collapsedTitleTextEl.innerHTML = title;
        }
    },

    getBox : function(){
        var b;
        if(!this.collapsed){
            b = this.el.getBox(false, true);
        }else{
            b = this.collapsedEl.getBox(false, true);
        }
        return b;
    },

    getMargins : function(){
        return this.collapsed ? this.cmargins : this.margins;
    },

    highlight : function(){
        this.el.addClass("x-layout-panel-dragover");
    },

    unhighlight : function(){
        this.el.removeClass("x-layout-panel-dragover");
    },

    updateBox : function(box){
        this.box = box;
        if(!this.collapsed){
            this.el.dom.style.left = box.x + "px";
            this.el.dom.style.top = box.y + "px";
            this.updateBody(box.width, box.height);
        }else{
            this.collapsedEl.dom.style.left = box.x + "px";
            this.collapsedEl.dom.style.top = box.y + "px";
            this.collapsedEl.setSize(box.width, box.height);
        }
        if(this.tabs){
            this.tabs.autoSizeTabs();
        }
    },

    updateBody : function(w, h){
        if(w !== null){
            this.el.setWidth(w);
            w -= this.el.getBorderWidth("rl");
            if(this.config.adjustments){
                w += this.config.adjustments[0];
            }
        }
        if(h !== null){
            this.el.setHeight(h);
            h = this.titleEl && this.titleEl.isDisplayed() ? h - (this.titleEl.getHeight()||0) : h;
            h -= this.el.getBorderWidth("tb");
            if(this.config.adjustments){
                h += this.config.adjustments[1];
            }
            this.bodyEl.setHeight(h);
            if(this.tabs){
                h = this.tabs.syncHeight(h);
            }
        }
        if(this.panelSize){
            w = w !== null ? w : this.panelSize.width;
            h = h !== null ? h : this.panelSize.height;
        }
        if(this.activePanel){
            var el = this.activePanel.getEl();
            w = w !== null ? w : el.getWidth();
            h = h !== null ? h : el.getHeight();
            this.panelSize = {width: w, height: h};
            this.activePanel.setSize(w, h);
        }
        if(Ext.isIE && this.tabs){
            this.tabs.el.repaint();
        }
    },

    /**
     * 返回代表该区域的容器元素
     * @return {Ext.Element}
     */
    getEl : function(){
        return this.el;
    },

    /**
     * 隐藏该区域.
     */
    hide : function(){
        if(!this.collapsed){
            this.el.dom.style.left = "-2000px";
            this.el.hide();
        }else{
            this.collapsedEl.dom.style.left = "-2000px";
            this.collapsedEl.hide();
        }
        this.visible = false;
        this.fireEvent("visibilitychange", this, false);
    },

    /**
     * 如果该区域原来是隐藏的，则显示该区域.
     */
    show : function(){
        if(!this.collapsed){
            this.el.show();
        }else{
            this.collapsedEl.show();
        }
        this.visible = true;
        this.fireEvent("visibilitychange", this, true);
    },

    closeClicked : function(){
        if(this.activePanel){
            this.remove(this.activePanel);
        }
    },

    collapseClick : function(e){
        if(this.isSlid){
           e.stopPropagation();
           this.slideIn();
        }else{
           e.stopPropagation();
           this.slideOut();
        }
    },

    /**
     * 折叠该区域.
     * @param {Boolean} skipAnim (可选项) 设置为true，当配置中animate被设为true的话，使得折叠没有动画效果.
     */
    collapse : function(skipAnim){
        if(this.collapsed) return;
        this.collapsed = true;
        if(this.split){
            this.split.el.hide();
        }
        if(this.config.animate && skipAnim !== true){
            this.fireEvent("invalidated", this);
            this.animateCollapse();
        }else{
            this.el.setLocation(-20000,-20000);
            this.el.hide();
            this.collapsedEl.show();
            this.fireEvent("collapsed", this);
            this.fireEvent("invalidated", this);
        }
    },

    animateCollapse : function(){
        // overridden
    },

    /**
     * 如果该区域原来是折叠的，则展开该区域.
     * @param {Ext.EventObject} e 触发展开的事件 (如果手工调用，则为空)
     * @param {Boolean} skipAnim (可选项) 设置为true，当配置中animate被设为true的话，使得展开没有动画效果.
     */
    expand : function(e, skipAnim){
        if(e) e.stopPropagation();
        if(!this.collapsed || this.el.hasActiveFx()) return;
        if(this.isSlid){
            this.afterSlideIn();
            skipAnim = true;
        }
        this.collapsed = false;
        if(this.config.animate && skipAnim !== true){
            this.animateExpand();
        }else{
            this.el.show();
            if(this.split){
                this.split.el.show();
            }
            this.collapsedEl.setLocation(-2000,-2000);
            this.collapsedEl.hide();
            this.fireEvent("invalidated", this);
            this.fireEvent("expanded", this);
        }
    },

    animateExpand : function(){
        // overridden
    },

    initTabs : function(){
        this.bodyEl.setStyle("overflow", "hidden");
        var ts = new Ext.TabPanel(this.bodyEl.dom, {
            tabPosition: this.bottomTabs ? 'bottom' : 'top',
            disableTooltips: this.config.disableTabTips
        });
        if(this.config.hideTabs){
            ts.stripWrap.setDisplayed(false);
        }
        this.tabs = ts;
        ts.resizeTabs = this.config.resizeTabs === true;
        ts.minTabWidth = this.config.minTabWidth || 40;
        ts.maxTabWidth = this.config.maxTabWidth || 250;
        ts.preferredTabWidth = this.config.preferredTabWidth || 150;
        ts.monitorResize = false;
        ts.bodyEl.setStyle("overflow", this.config.autoScroll ? "auto" : "hidden");
        ts.bodyEl.addClass('x-layout-tabs-body');
        this.panels.each(this.initPanelAsTab, this);
    },

    initPanelAsTab : function(panel){
        var ti = this.tabs.addTab(panel.getEl().id, panel.getTitle(), null,
                    this.config.closeOnTab && panel.isClosable());
        if(panel.tabTip !== undefined){
            ti.setTooltip(panel.tabTip);
        }
        ti.on("activate", function(){
              this.setActivePanel(panel);
        }, this);
        if(this.config.closeOnTab){
            ti.on("beforeclose", function(t, e){
                e.cancel = true;
                this.remove(panel);
            }, this);
        }
        return ti;
    },

    updatePanelTitle : function(panel, title){
        if(this.activePanel == panel){
            this.updateTitle(title);
        }
        if(this.tabs){
            var ti = this.tabs.getTab(panel.getEl().id);
            ti.setText(title);
            if(panel.tabTip !== undefined){
                ti.setTooltip(panel.tabTip);
            }
        }
    },

    updateTitle : function(title){
        if(this.titleTextEl && !this.config.title){
            this.titleTextEl.innerHTML = (typeof title != "undefined" && title.length > 0 ? title : "&#160;");
        }
    },

    setActivePanel : function(panel){
        panel = this.getPanel(panel);
        if(this.activePanel && this.activePanel != panel){
            this.activePanel.setActiveState(false);
        }
        this.activePanel = panel;
        panel.setActiveState(true);
        if(this.panelSize){
            panel.setSize(this.panelSize.width, this.panelSize.height);
        }
        if(this.closeBtn){
            this.closeBtn.setVisible(!this.config.closeOnTab && !this.isSlid && panel.isClosable());
        }
        this.updateTitle(panel.getTitle());
        if(this.tabs){
            this.fireEvent("invalidated", this);
        }
        this.fireEvent("panelactivated", this, panel);
    },

    /**
     * 显示指定的面板.
     * @param {Number/String/ContentPanel} 面板ID，面板序号或面板对象
     * @return {Ext.ContentPanel} 如果找到这个面板，则返回这个被显示的面板，反之则返回空.
     */
    showPanel : function(panel){
        if(panel = this.getPanel(panel)){
            if(this.tabs){
                var tab = this.tabs.getTab(panel.getEl().id);
                if(tab.isHidden()){
                    this.tabs.unhideTab(tab.id);
                }
                tab.activate();
            }else{
                this.setActivePanel(panel);
            }
        }
        return panel;
    },

    /**
     * 获到该区域中活动面板
     * @return {Ext.ContentPanel} 如果区域中有活动面板，则返回活动的面板；反之则返回空.
     */
    getActivePanel : function(){
        return this.activePanel;
    },

    validateVisibility : function(){
        if(this.panels.getCount() < 1){
            this.updateTitle("&#160;");
            this.closeBtn.hide();
            this.hide();
        }else{
            if(!this.isVisible()){
                this.show();
            }
        }
    },

    /**
     * 向区域中添加一个或多个传入的内容面板.
     * @param {ContentPanel...} panel 一个或多个传入的面板.
     * @return {Ext.ContentPanel} 如果只传入一个面板，则返回该面板；如果传入的有多个面板，则返回空.
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
        panel.setRegion(this);
        this.panels.add(panel);
        if(this.panels.getCount() == 1 && !this.config.alwaysShowTabs){
            this.bodyEl.dom.appendChild(panel.getEl().dom);
            if(panel.background !== true){
                this.setActivePanel(panel);
            }
            this.fireEvent("paneladded", this, panel);
            return panel;
        }
        if(!this.tabs){
            this.initTabs();
        }else{
            this.initPanelAsTab(panel);
        }
        if(panel.background !== true){
            this.tabs.activate(panel.getEl().id);
        }
        this.fireEvent("paneladded", this, panel);
        return panel;
    },

    /**
     * 隐藏指定的面板
     * @param {Number/String/ContentPanel} 面板的序号，id或面板对象
     */
    hidePanel : function(panel){
        if(this.tabs && (panel = this.getPanel(panel))){
            this.tabs.hideTab(panel.getEl().id);
        }
    },

    /**
     * Unhides the tab for a previously hidden panel.
     * 对原来隐藏的面板中的tab条显示出来，
     * @param {Number/String/ContentPanel} panel 面板ID，面板序号或面板对象
     */
    unhidePanel : function(panel){
        if(this.tabs && (panel = this.getPanel(panel))){
            this.tabs.unhideTab(panel.getEl().id);
        }
    },

    clearPanels : function(){
        while(this.panels.getCount() > 0){
             this.remove(this.panels.first());
        }
    },

    /**
     * Removes the specified panel. If preservePanel is not true (either here or in the config), the panel is destroyed.
     * 移除指定的面板.如果preservePanel属性没有被设置为true,该面板将被消毁.
     * @param {Number/String/ContentPanel} panel 面板ID，面板序号或面板对象
     * @param {Boolean} preservePanel 重载配置项里的preservePanel属性
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
        preservePanel = (typeof preservePanel != "undefined" ? preservePanel : (this.config.preservePanels === true || panel.preserve === true));
        var panelId = panel.getId();
        this.panels.removeKey(panelId);
        if(preservePanel){
            document.body.appendChild(panel.getEl().dom);
        }
        if(this.tabs){
            this.tabs.removeTab(panel.getEl().id);
        }else if (!preservePanel){
            this.bodyEl.dom.removeChild(panel.getEl().dom);
        }
        if(this.panels.getCount() == 1 && this.tabs && !this.config.alwaysShowTabs){
            var p = this.panels.first();
            var tempEl = document.createElement("div"); // temp holder to keep IE from deleting the node
            tempEl.appendChild(p.getEl().dom);
            this.bodyEl.update("");
            this.bodyEl.dom.appendChild(p.getEl().dom);
            tempEl = null;
            this.updateTitle(p.getTitle());
            this.tabs = null;
            this.bodyEl.setStyle("overflow", this.config.autoScroll ? "auto" : "hidden");
            this.setActivePanel(p);
        }
        panel.setRegion(null);
        if(this.activePanel == panel){
            this.activePanel = null;
        }
        if(this.config.autoDestroy !== false && preservePanel !== true){
            try{panel.destroy();}catch(e){}
        }
        this.fireEvent("panelremoved", this, panel);
        return panel;
    },

    /**
     * 返回区域用过的tabPanel组件
     * @return {Ext.TabPanel}
     */
    getTabs : function(){
        return this.tabs;
    },

    createTool : function(parentEl, className){
        var btn = Ext.DomHelper.append(parentEl, {tag: "div", cls: "x-layout-tools-button",
            children: [{tag: "div", cls: "x-layout-tools-button-inner " + className, html: "&#160;"}]}, true);
        btn.addClassOnOver("x-layout-tools-button-over");
        return btn;
    }
});