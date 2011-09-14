/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.BorderLayout
 * @extends Ext.LayoutManager
 * 该类描述在桌面应用中的一普通的布局管理器，要了解screenshots和更多细节，请查看
 * <br><br>
 * <a href="http://www.jackslocum.com/yui/2006/10/19/cross-browser-web-20-layouts-with-yahoo-ui/">Cross Browser Layouts - Part 1</a><br>
 * <a href="http://www.jackslocum.com/yui/2006/10/28/cross-browser-web-20-layouts-part-2-ajax-feed-viewer-20/">Cross Browser Layouts - Part 2</a><br><br>
 * 例子:
 <pre><code>
 var layout = new Ext.BorderLayout(document.body, {
    north: {
        initialSize: 25,
        titlebar: false
    },
    west: {
        split:true,
        initialSize: 200,
        minSize: 175,
        maxSize: 400,
        titlebar: true,
        collapsible: true
    },
    east: {
        split:true,
        initialSize: 202,
        minSize: 175,
        maxSize: 400,
        titlebar: true,
        collapsible: true
    },
    south: {
        split:true,
        initialSize: 100,
        minSize: 100,
        maxSize: 200,
        titlebar: true,
        collapsible: true
    },
    center: {
        titlebar: true,
        autoScroll:true,
        resizeTabs: true,
        minTabWidth: 50,
        preferredTabWidth: 150
    }
});

// 简写方式
var CP = Ext.ContentPanel;

layout.beginUpdate();
layout.add("north", new CP("north", "North"));
layout.add("south", new CP("south", {title: "South", closable: true}));
layout.add("west", new CP("west", {title: "West"}));
layout.add("east", new CP("autoTabs", {title: "Auto Tabs", closable: true}));
layout.add("center", new CP("center1", {title: "Close Me", closable: true}));
layout.add("center", new CP("center2", {title: "Center Panel", closable: false}));
layout.getRegion("center").showPanel("center1");
layout.endUpdate();
</code></pre>


<b>该布局被渲染进的容器，可以是body元素或其它任何元素.如果不是body元素，该容器需要是一绝对定位的元素.
或者你需要将"position:relative"加入到该容器的css中，并且你需要指定该容器的大小.<b>
* @constructor
* 创建一个新的BorderLayout对象
* @param {String/HTMLElement/Element} 代表布局的容器元素
* @param {Object} config 配置选项
 */
Ext.BorderLayout = function(container, config){
    config = config || {};
    Ext.BorderLayout.superclass.constructor.call(this, container, config);
    this.factory = config.factory || Ext.BorderLayout.RegionFactory;
    for(var i = 0, len = this.factory.validRegions.length; i < len; i++) {
    	var target = this.factory.validRegions[i];
    	if(config[target]){
    	    this.addRegion(target, config[target]);
    	}
    }
};

Ext.extend(Ext.BorderLayout, Ext.LayoutManager, {
    /**
     * 如果该区域不存在，则添加。
     * @param {String} target 目标区域的关键字，如：（north, south, east, west or center）。
     * @param {Object} config 区域的配置对象
     * @return {BorderLayoutRegion} 返回该区域
     */
    addRegion : function(target, config){
        if(!this.regions[target]){
            var r = this.factory.create(target, this, config);
    	    this.bindRegion(target, r);
        }
        return this.regions[target];
    },

    // 私有的 (kinda)
    bindRegion : function(name, r){
        this.regions[name] = r;
        r.on("visibilitychange", this.layout, this);
        r.on("paneladded", this.layout, this);
        r.on("panelremoved", this.layout, this);
        r.on("invalidated", this.layout, this);
        r.on("resized", this.onRegionResized, this);
        r.on("collapsed", this.onRegionCollapsed, this);
        r.on("expanded", this.onRegionExpanded, this);
    },

    /**
     * 执行布局的更新
     */
    layout : function(){
        if(this.updating) return;
        var size = this.getViewSize();
        var w = size.width, h = size.height;
        var centerW = w, centerH = h, centerY = 0, centerX = 0;
        //var x = 0, y = 0;

        var rs = this.regions;
        var n = rs["north"], s = rs["south"], west = rs["west"], e = rs["east"], c = rs["center"];
        //if(this.hideOnLayout){ // not supported anymore
            //c.el.setStyle("display", "none");
        //}
        if(n && n.isVisible()){
            var b = n.getBox();
            var m = n.getMargins();
            b.width = w - (m.left+m.right);
            b.x = m.left;
            b.y = m.top;
            centerY = b.height + b.y + m.bottom;
            centerH -= centerY;
            n.updateBox(this.safeBox(b));
        }
        if(s && s.isVisible()){
            var b = s.getBox();
            var m = s.getMargins();
            b.width = w - (m.left+m.right);
            b.x = m.left;
            var totalHeight = (b.height + m.top + m.bottom);
            b.y = h - totalHeight + m.top;
            centerH -= totalHeight;
            s.updateBox(this.safeBox(b));
        }
        if(west && west.isVisible()){
            var b = west.getBox();
            var m = west.getMargins();
            b.height = centerH - (m.top+m.bottom);
            b.x = m.left;
            b.y = centerY + m.top;
            var totalWidth = (b.width + m.left + m.right);
            centerX += totalWidth;
            centerW -= totalWidth;
            west.updateBox(this.safeBox(b));
        }
        if(e && e.isVisible()){
            var b = e.getBox();
            var m = e.getMargins();
            b.height = centerH - (m.top+m.bottom);
            var totalWidth = (b.width + m.left + m.right);
            b.x = w - totalWidth + m.left;
            b.y = centerY + m.top;
            centerW -= totalWidth;
            e.updateBox(this.safeBox(b));
        }
        if(c){
            var m = c.getMargins();
            var centerBox = {
                x: centerX + m.left,
                y: centerY + m.top,
                width: centerW - (m.left+m.right),
                height: centerH - (m.top+m.bottom)
            };
            //if(this.hideOnLayout){
                //c.el.setStyle("display", "block");
            //}
            c.updateBox(this.safeBox(centerBox));
        }
        this.el.repaint();
        this.fireEvent("layout", this);
    },

    // private
    safeBox : function(box){
        box.width = Math.max(0, box.width);
        box.height = Math.max(0, box.height);
        return box;
    },

    /**
     *  添加一内容面板或其子类到该布局中.
     * @param {String} target 目标区域的关键字，如： (north, south, east, west or center).
     * @param {Ext.ContentPanel} panel 将被添加的面板.
     * @return {Ext.ContentPanel} 被添加的面板.
     */
    add : function(target, panel){
        target = target.toLowerCase();
        return this.regions[target].add(panel);
    },

    /**
     * 从布局中移除一个内容面版或其子类.
     * @param {String} target 目标区域的关键字,如: (north, south, east, west or center).
     * @param {Number/String/Ext.ContentPanel} 面板的ID,或序号,或内容面板对象.
     * @return {Ext.ContentPanel} 被移除的面板.
     */
    remove : function(target, panel){
        target = target.toLowerCase();
        return this.regions[target].remove(panel);
    },

    /**
	 * 在所有区域中查到指定ID的面板.    
     * @param {String} 面板的id
     * @return {Ext.ContentPanel} 如果找到则返回之，反之返回空.
     */
    findPanel : function(panelId){
        var rs = this.regions;
        for(var target in rs){
            if(typeof rs[target] != "function"){
                var p = rs[target].getPanel(panelId);
                if(p){
                    return p;
                }
            }
        }
        return null;
    },

    /**
     * 查找包含指定ID面板的区域并激活（显示）它
     * @param {String/ContentPanel} panelId 面板的ID，或面板对象.
     * @return {Ext.ContentPanel} 找到该面板的区域则显示之，反之返回空.
     */
    showPanel : function(panelId) {
      var rs = this.regions;
      for(var target in rs){
         var r = rs[target];
         if(typeof r != "function"){
            if(r.hasPanel(panelId)){
               return r.showPanel(panelId);
            }
         }
      }
      return null;
   },

    /**
   	 * 使用Ext.state.Manager或传入的状态提供者来恢复布局的状态.
     * @param {Ext.state.Provider} provider (可选项) 另外一个状态提供者.
     */
    restoreState : function(provider){
        if(!provider){
            provider = Ext.state.Manager;
        }
        var sm = new Ext.LayoutStateManager();
        sm.init(this, provider);
    },

    /**
     * 根据传入的一个指定的区域配置对象来动来的添加一个多内容面板的分支.该配置对象必须包含一些属性，来使得各个区域能添加内容面板，
     * 并且各个属性的值必须是一有效的内容面版配置对象.类如：
     * <pre><code>
// 创建主要的layout
var layout = new Ext.BorderLayout('main-ct', {
    west: {
        split:true,
        minSize: 175,
        titlebar: true
    },
    center: {
        title:'Components'
    }
}, 'main-ct');

//通过配置马上创建并添加多个ContentPanels
layout.batchAdd({
   west: {
       id: 'source-files',
       autoCreate:true,
       title:'Ext Source Files',
       autoScroll:true,
       fitToFrame:true
   },
   center : {
       el: cview,
       autoScroll:true,
       fitToFrame:true,
       toolbar: tb,
       resizeEl:'cbody'
   }
});
</code></pre>
     * @param {Object} 一个包含了与区域名对应的内容面版配置的对象
     */
    batchAdd : function(regions){
        this.beginUpdate();
        for(var rname in regions){
            var lr = this.regions[rname];
            if(lr){
                this.addTypedPanels(lr, regions[rname]);
            }
        }
        this.endUpdate();
    },

    // 私有的
    addTypedPanels : function(lr, ps){
        if(typeof ps == 'string'){
            lr.add(new Ext.ContentPanel(ps));
        }
        else if(ps instanceof Array){
            for(var i =0, len = ps.length; i < len; i++){
                this.addTypedPanels(lr, ps[i]);
            }
        }
        else if(!ps.events){ // raw config?
            var el = ps.el;
            delete ps.el; // prevent conflict
            lr.add(new Ext.ContentPanel(el || Ext.id(), ps));
        }
        else {  // panel object assumed!
            lr.add(ps);
        }
    }
});

/**
 * 通来一个步骤来创建一个边界布局对象并添加一或多个内容面板进去的捷经，在内部处理beginUpdate、endUpdate调用.
 * 这个方法关键在于panels属性，它为各个区域提供了配置对象，使得你除了在创建时进行区域配置外可以添加内容面板配置.
 * 如下该类刚开始的代码相当于基础构建器例子
 * <pre><code>
// 简写方式
var CP = Ext.ContentPanel;

var layout = Ext.BorderLayout.create({
    north: {
        initialSize: 25,
        titlebar: false,
        panels: [new CP("north", "North")]
    },
    west: {
        split:true,
        initialSize: 200,
        minSize: 175,
        maxSize: 400,
        titlebar: true,
        collapsible: true,
        panels: [new CP("west", {title: "West"})]
    },
    east: {
        split:true,
        initialSize: 202,
        minSize: 175,
        maxSize: 400,
        titlebar: true,
        collapsible: true,
        panels: [new CP("autoTabs", {title: "Auto Tabs", closable: true})]
    },
    south: {
        split:true,
        initialSize: 100,
        minSize: 100,
        maxSize: 200,
        titlebar: true,
        collapsible: true,
        panels: [new CP("south", {title: "South", closable: true})]
    },
    center: {
        titlebar: true,
        autoScroll:true,
        resizeTabs: true,
        minTabWidth: 50,
        preferredTabWidth: 150,
        panels: [
            new CP("center1", {title: "Close Me", closable: true}),
            new CP("center2", {title: "Center Panel", closable: false})
        ]
    }
}, document.body);

layout.getRegion("center").showPanel("center1");
</code></pre>
 * @param config 配置
 * @param targetEl 目标元素
 */
Ext.BorderLayout.create = function(config, targetEl){
    var layout = new Ext.BorderLayout(targetEl || document.body, config);
    layout.beginUpdate();
    var regions = Ext.BorderLayout.RegionFactory.validRegions;
    for(var j = 0, jlen = regions.length; j < jlen; j++){
        var lr = regions[j];
        if(layout.regions[lr] && config[lr].panels){
            var r = layout.regions[lr];
            var ps = config[lr].panels;
            layout.addTypedPanels(r, ps);
        }
    }
    layout.endUpdate();
    return layout;
};

// private
Ext.BorderLayout.RegionFactory = {
    // private
    validRegions : ["north","south","east","west","center"],

    // private
    create : function(target, mgr, config){
        target = target.toLowerCase();
        if(config.lightweight || config.basic){
            return new Ext.BasicLayoutRegion(mgr, config, target);
        }
        switch(target){
            case "north":
                return new Ext.NorthLayoutRegion(mgr, config);
            case "south":
                return new Ext.SouthLayoutRegion(mgr, config);
            case "east":
                return new Ext.EastLayoutRegion(mgr, config);
            case "west":
                return new Ext.WestLayoutRegion(mgr, config);
            case "center":
                return new Ext.CenterLayoutRegion(mgr, config);
        }
        throw 'Layout region "'+target+'" not supported.';
    }
};