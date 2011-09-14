/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=90 Ext中文站翻译小组
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
 * @class Ext.layout.BorderLayout
 * @extends Ext.layout.ContainerLayout
 * <p>
 * 这是一种多面板，面向应用程序UI的布局风格，可支持多个套嵌面板，各区域间自动分隔和扩展/收缩功能。
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'border' 的方式创建，一般很少通过关键字new直接使用。<br />
 * This is a multi-pane, application-oriented UI layout style that supports multiple nested panels, automatic
 * split bars between regions and built-in expanding and collapsing of regions.
 * This class is intended to be extended or created via the layout:'border' {@link Ext.Container#layout} config,
 * and should generally not need to be created directly via the new keyword.</p>
 * <p>
 * BorderLayout不存在任何直接的配置项（不同于继承）。
 * 所有为BorderLayout可制定的配置均位于{@link Ext.layout.BorderLayout.Region}和{@link Ext.layout.BorderLayout.SplitRegion}。<br />
 * BorderLayout does not have any direct config options (other than inherited ones).  All configs available
 * for customizing the BorderLayout are at the {@link Ext.layout.BorderLayout.Region} and
 * {@link Ext.layout.BorderLayout.SplitRegion} levels.</p>
 * <p><b>
 * BorderLayout具有固定性，渲染之后就不会任意变动或改变格局。
 * 中央区域（center region）在BorderLayout设定中不可或缺。假使没有其它的区域，中央布局便会就是该布局的全部区域。<br />
 * The regions of a BorderLayout are fixed at render time and thereafter, no regions may be removed or
 * added.The BorderLayout must have a center region, which will always fill the remaining space not used by
 * the other regions in the layout.
 * </b></p>
 * <p>用法举例：Example usage:</p>
 * <pre><code>
var border = new Ext.Panel({
    title: 'Border布局Border Layout',
    layout:'border',
    items: [{
        title: '南部面板South Panel',
        region: 'south',
        height: 100,
        minSize: 75,
        maxSize: 250,
        margins: '0 5 5 5'
    },{
        title: '西部面板West Panel',
        region:'west',
        margins: '5 0 0 5',
        cmargins: '5 5 0 5',
        width: 200,
        minSize: 100,
        maxSize: 300
    },{
        title: '主面板Main Content',
        region:'center',
        margins: '5 5 0 0'
    }]
});
</code></pre>
 */
Ext.layout.BorderLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize:true,
    // private
    rendered : false,

    // private
    onLayout : function(ct, target){
        var collapsed;
        if(!this.rendered){
            target.position();
            target.addClass('x-border-layout-ct');
            var items = ct.items.items;
            collapsed = [];
            for(var i = 0, len = items.length; i < len; i++) {
                var c = items[i];
                var pos = c.region;
                if(c.collapsed){
                    collapsed.push(c);
                }
                c.collapsed = false;
                if(!c.rendered){
                    c.cls = c.cls ? c.cls +' x-border-panel' : 'x-border-panel';
                    c.render(target, i);
                }
                this[pos] = pos != 'center' && c.split ?
                    new Ext.layout.BorderLayout.SplitRegion(this, c.initialConfig, pos) :
                    new Ext.layout.BorderLayout.Region(this, c.initialConfig, pos);
                this[pos].render(target, c);
            }
            this.rendered = true;
        }

        var size = target.getViewSize();
        if(size.width < 20 || size.height < 20){ // display none?
            if(collapsed){
                this.restoreCollapsed = collapsed;
            }
            return;
        }else if(this.restoreCollapsed){
            collapsed = this.restoreCollapsed;
            delete this.restoreCollapsed;
        }

        var w = size.width, h = size.height;
        var centerW = w, centerH = h, centerY = 0, centerX = 0;

        var n = this.north, s = this.south, west = this.west, e = this.east, c = this.center;
        if(!c && Ext.layout.BorderLayout.WARN !== false){
            throw 'No center region defined in BorderLayout ' + ct.id;
        }

        if(n && n.isVisible()){
            var b = n.getSize();
            var m = n.getMargins();
            b.width = w - (m.left+m.right);
            b.x = m.left;
            b.y = m.top;
            centerY = b.height + b.y + m.bottom;
            centerH -= centerY;
            n.applyLayout(b);
        }
        if(s && s.isVisible()){
            var b = s.getSize();
            var m = s.getMargins();
            b.width = w - (m.left+m.right);
            b.x = m.left;
            var totalHeight = (b.height + m.top + m.bottom);
            b.y = h - totalHeight + m.top;
            centerH -= totalHeight;
            s.applyLayout(b);
        }
        if(west && west.isVisible()){
            var b = west.getSize();
            var m = west.getMargins();
            b.height = centerH - (m.top+m.bottom);
            b.x = m.left;
            b.y = centerY + m.top;
            var totalWidth = (b.width + m.left + m.right);
            centerX += totalWidth;
            centerW -= totalWidth;
            west.applyLayout(b);
        }
        if(e && e.isVisible()){
            var b = e.getSize();
            var m = e.getMargins();
            b.height = centerH - (m.top+m.bottom);
            var totalWidth = (b.width + m.left + m.right);
            b.x = w - totalWidth + m.left;
            b.y = centerY + m.top;
            centerW -= totalWidth;
            e.applyLayout(b);
        }
        if(c){
            var m = c.getMargins();
            var centerBox = {
                x: centerX + m.left,
                y: centerY + m.top,
                width: centerW - (m.left+m.right),
                height: centerH - (m.top+m.bottom)
            };
            c.applyLayout(centerBox);
        }
        if(collapsed){
            for(var i = 0, len = collapsed.length; i < len; i++){
                collapsed[i].collapse(false);
            }
        }
        if(Ext.isIE && Ext.isStrict){ // workaround IE strict repainting issue
            target.repaint();
        }
    },

    destroy: function() {
        var r = ['north', 'south', 'east', 'west'];
        for (var i = 0; i < r.length; i++) {
            var region = this[r[i]];
            if(region){
                if(region.destroy){
                    region.destroy();
                }else if (region.split){
                    region.split.destroy(true);
                }
            }
        }
        Ext.layout.BorderLayout.superclass.destroy.call(this);
    }
    
    /**
     * @property activeItem
     * @hide
     */
});

/**
 * @class Ext.layout.BorderLayout.Region
 * 这是属于BorderLayout的区域，用作布局内的子容器。每一个区域都有自己的布局，并可容纳BorderLayout，或是任意类型的Ext布局类型。
 * 区域的大小是自动管理并且不能由用户改变--关于可变化大小的区域，参阅{@link Ext.layout.BorderLayout.SplitRegion}。
 * This is a region of a BorderLayout that acts as a subcontainer within the layout.  Each region has its own
 * layout that is independent of other regions and the containing BorderLayout, and can be any of the valid
 * Ext layout types.  Region size is managed automatically and cannot be changed by the user -- for resizable
 * regions, see {@link Ext.layout.BorderLayout.SplitRegion}.
 * @constructor 建立一个新Region对象。Create a new Region.
 * @param {Layout} layout 任何有效Ext布局类。Any valid Ext layout class
 * @param {Object} config 配置项对象。The configuration options
 * @param {String} position 区域的位置。有效的值是：north, south, east, west和center。
 * 每个BorderLayout不能缺少center区域作为主要的内容，其它区域是可选的。The region position.  Valid values are: north, south, east, west and center.  Every
 * BorderLayout must have a center region for the primary content -- all other regions are optional.
 */
Ext.layout.BorderLayout.Region = function(layout, config, pos){
    Ext.apply(this, config);
    this.layout = layout;
    this.position = pos;
    this.state = {};
    if(typeof this.margins == 'string'){
        this.margins = this.layout.parseMargins(this.margins);
    }
    this.margins = Ext.applyIf(this.margins || {}, this.defaultMargins);
    if(this.collapsible){
        if(typeof this.cmargins == 'string'){
            this.cmargins = this.layout.parseMargins(this.cmargins);
        }
        if(this.collapseMode == 'mini' && !this.cmargins){
            this.cmargins = {left:0,top:0,right:0,bottom:0};
        }else{
            this.cmargins = Ext.applyIf(this.cmargins || {},
                pos == 'north' || pos == 'south' ? this.defaultNSCMargins : this.defaultEWCMargins);
        }
    }
};

Ext.layout.BorderLayout.Region.prototype = {
    /**
     * @cfg {Boolean} animFloat
     * 当一个已关闭的区域上的工具条被点击时，一旦用户的鼠标移开时面板会再次关闭（或在外面点击，若autoHide=false的话）。
     * 设置animFloat为fasle会阻止这些浮动的面板以动画的方式打开和关闭（默认为true）。
     * When a collapsed region's bar is clicked, the region's panel will be displayed as a floated panel that will
     * close again once the user mouses out of that panel (or clicks out if autoHide = false).  Setting animFloat
     * to false will prevent the open and close of these floated panels from being animated (defaults to true).
     */
    /**
     * @cfg {Boolean} autoHide
     * 当一个已关闭的区域上的工具条被点击时，区域的面板会显示为浮动的面板。如果autoHide为true，用户鼠标移开面板时会自动隐藏面板。
     * 若autoHide为false，面板会一直显示除非用户点击了面板以外的区域（默认为true）。
     * When a collapsed region's bar is clicked, the region's panel will be displayed as a floated panel.  If
     * autoHide is true, the panel will automatically hide after the user mouses out of the panel.  If autoHide
     * is false, the panel will continue to display until the user clicks outside of the panel (defaults to true).
     */
    /**
     * @cfg {String} collapseMode
     * 默认下，可关闭的区域是通过点击区域标题条上的工具按钮来控制区域是否关闭的。
     * 可选的，当collapseMdoe被设置为'mini'时，区域的分隔条中间仍然会有一个小小的关闭按钮。
     * 在'mini'模式下区域会闭合成为一个比常规模式下更细小的水平条。  
     * 默认下collapseMode是设置为undefined，支持两种值undefined和'mini'。
     * 注意如果可关闭的区域如果没有标题条，那么collapseMode必须设置为'mini'以便即使工具按钮没有渲染也可以由用户来关闭区域。
     * By default, collapsible regions are collapsed by clicking the expand/collapse tool button that renders into
     * the region's title bar.  Optionally, when collapseMode is set to 'mini' the region's split bar will also
     * display a small collapse button in the center of the bar.  In 'mini' mode the region will collapse to a
     * thinner bar than in normal mode.  By default collapseMode is undefined, and the only two supported values
     * are undefined and 'mini'.  Note that if a collapsible region does not have a title bar, then collapseMode
     * must be set to 'mini' in order for the region to be collapsible by the user as the tool button will not
     * be rendered.
     */
    /**
     * @cfg {Object} margins
     * 作用在区域上的外补丁对象，对象的格式如{left: （左边距）, top: （上边距）, right: （右边距）, bottom: （下边距）}。
     * An object containing margins to apply to the region in the format {left: (left margin), top: (top margin),
     * right: (right margin), bottom: (bottom margin)}
     */
    /**
     * @cfg {Object} cmargins
     * 作用在区域闭合元素上的外补丁对象，对象的格式如{left: （左边距）, top: （上边距）, right: （右边距）, bottom: （下边距）}。
     * An object containing margins to apply to the region's collapsed element in the format {left: (left margin),
     * top: (top margin), right: (right margin), bottom: (bottom margin)}
     */
    /**
     * @cfg {Boolean} collapsible
     * True表示为允许用户闭合此区域（默认为false）。如为true，区域上的title bar将会渲染出“展开/收缩”的按钮，否则将不会显示。
     * 注意title bar需要显示的是一个轮换按钮－－如不指定区域的title，那么只有当{@link #collapseMode}设为'mini'时，区域才能收缩。
     * True to allow the user to collapse this region (defaults to false).  If true, an expand/collapse tool button
     * will automatically be rendered into the title bar of the region, otherwise the button will not be shown.
     * Note that a title bar is required to display the toggle button -- if no region title is specified, the
     * region will only be collapsible if {@link #collapseMode} is set to 'mini'.
     */
    collapsible : false,
    /**
     * @cfg {Boolean} split
     * True表示为显示在此区域与旁边区域显示{@link Ext.SplitBar}，可允许用户动态调节区域的大小（缺省为false）。
     * 当split=true，通常需要指定区域的{@link #minSize}和{@link #maxSize}。
     * True to display a {@link Ext.SplitBar} between this region and its neighbor, allowing the user to resize
     * the regions dynamically (defaults to false).  When split == true, it is common to specify a minSize
     * and maxSize for the BoxComponent representing the region. These are not native configs of BoxComponent, and
     * are used only by this class.
     */
    split:false,
    /**
     * @cfg {Boolean} floatable
     * true表示为可通过单击收缩区域条状就能显示整个区域的面板，浮动在布局上。
     * false表示为限制用户只能通过单击“展开expand”按钮才能展开收缩的区域。（缺省为true）
     * True to allow clicking a collapsed region's bar to display the region's panel floated above the layout,
     * false to force the user to fully expand a collapsed region by clicking the expand button to see it again
     * (defaults to true).
     */
    floatable: true,
    /**
     * @cfg {Number} minWidth
     * 此区域可允许的最小宽度象素值（缺省为50）。
     * The minimum allowable width in pixels for this region (defaults to 50)
     */
    minWidth:50,
    /**
     * @cfg {Number} minHeight
     * 此区域可允许的最大宽度象素值（缺省为50）。
     * The minimum allowable height in pixels for this region (defaults to 50)
     */
    minHeight:50,

    // private
    defaultMargins : {left:0,top:0,right:0,bottom:0},
    // private
    defaultNSCMargins : {left:5,top:5,right:5,bottom:5},
    // private
    defaultEWCMargins : {left:5,top:0,right:5,bottom:0},
    floatingZIndex: 100,

    /**
     * True表示为该区域可收缩的。只读的。
     * True if this region is collapsed. Read-only.
     * @type Boolean
     * @property isCollapsed
     */
    isCollapsed : false,

    /**
     * 此区域的面板。只读的。
     * This region's panel.  Read-only.
     * @type Ext.Panel
     * @property panel
     */
    /**
     * 此区域的布局。只读的。
     * This region's layout.  Read-only.
     * @type Layout
     * @property layout
     */
    /**
     * 此区域布局的位置（north, south, east, west或center）。只读的。
     * This region's layout position (north, south, east, west or center).  Read-only.
     * @type String
     * @property position
     */

    // private
    render : function(ct, p){
        this.panel = p;
        p.el.enableDisplayMode();
        this.targetEl = ct;
        this.el = p.el;

        var gs = p.getState, ps = this.position;
        p.getState = function(){
            return Ext.apply(gs.call(p) || {}, this.state);
        }.createDelegate(this);

        if(ps != 'center'){
            p.allowQueuedExpand = false;
            p.on({
                beforecollapse: this.beforeCollapse,
                collapse: this.onCollapse,
                beforeexpand: this.beforeExpand,
                expand: this.onExpand,
                hide: this.onHide,
                show: this.onShow,
                scope: this
            });
            if(this.collapsible){
                p.collapseEl = 'el';
                p.slideAnchor = this.getSlideAnchor();
            }
            if(p.tools && p.tools.toggle){
                p.tools.toggle.addClass('x-tool-collapse-'+ps);
                p.tools.toggle.addClassOnOver('x-tool-collapse-'+ps+'-over');
            }
        }
    },

    // private
    getCollapsedEl : function(){
        if(!this.collapsedEl){
            if(!this.toolTemplate){
                var tt = new Ext.Template(
                     '<div class="x-tool x-tool-{id}">&#160;</div>'
                );
                tt.disableFormats = true;
                tt.compile();
                Ext.layout.BorderLayout.Region.prototype.toolTemplate = tt;
            }
            this.collapsedEl = this.targetEl.createChild({
                cls: "x-layout-collapsed x-layout-collapsed-"+this.position,
                id: this.panel.id + '-xcollapsed'
            });
            this.collapsedEl.enableDisplayMode('block');

            if(this.collapseMode == 'mini'){
                this.collapsedEl.addClass('x-layout-cmini-'+this.position);
                this.miniCollapsedEl = this.collapsedEl.createChild({
                    cls: "x-layout-mini x-layout-mini-"+this.position, html: "&#160;"
                });
                this.miniCollapsedEl.addClassOnOver('x-layout-mini-over');
                this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
                this.collapsedEl.on('click', this.onExpandClick, this, {stopEvent:true});
            }else {
                var t = this.toolTemplate.append(
                        this.collapsedEl.dom,
                        {id:'expand-'+this.position}, true);
                t.addClassOnOver('x-tool-expand-'+this.position+'-over');
                t.on('click', this.onExpandClick, this, {stopEvent:true});
                
                if(this.floatable !== false){
                   this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
                   this.collapsedEl.on("click", this.collapseClick, this);
                }
            }
        }
        return this.collapsedEl;
    },

    // private
    onExpandClick : function(e){
        if(this.isSlid){
            this.afterSlideIn();
            this.panel.expand(false);
        }else{
            this.panel.expand();
        }
    },

    // private
    onCollapseClick : function(e){
        this.panel.collapse();
    },

    // private
    beforeCollapse : function(p, animate){
        this.lastAnim = animate;
        if(this.splitEl){
            this.splitEl.hide();
        }
        this.getCollapsedEl().show();
        this.panel.el.setStyle('z-index', 100);
        this.isCollapsed = true;
        this.layout.layout();
    },

    // private
    onCollapse : function(animate){
        this.panel.el.setStyle('z-index', 1);
        if(this.lastAnim === false || this.panel.animCollapse === false){
            this.getCollapsedEl().dom.style.visibility = 'visible';
        }else{
            this.getCollapsedEl().slideIn(this.panel.slideAnchor, {duration:.2});
        }
        this.state.collapsed = true;
        this.panel.saveState();
    },

    // private
    beforeExpand : function(animate){
        var c = this.getCollapsedEl();
        this.el.show();
        if(this.position == 'east' || this.position == 'west'){
            this.panel.setSize(undefined, c.getHeight());
        }else{
            this.panel.setSize(c.getWidth(), undefined);
        }
        c.hide();
        c.dom.style.visibility = 'hidden';
        this.panel.el.setStyle('z-index', this.floatingZIndex);
    },

    // private
    onExpand : function(){
        this.isCollapsed = false;
        if(this.splitEl){
            this.splitEl.show();
        }
        this.layout.layout();
        this.panel.el.setStyle('z-index', 1);
        this.state.collapsed = false;
        this.panel.saveState();
    },

    // private
    collapseClick : function(e){
        if(this.isSlid){
           e.stopPropagation();
           this.slideIn();
        }else{
           e.stopPropagation();
           this.slideOut();
        }
    },

    // private
    onHide : function(){
        if(this.isCollapsed){
            this.getCollapsedEl().hide();
        }else if(this.splitEl){
            this.splitEl.hide();
        }
    },

    // private
    onShow : function(){
        if(this.isCollapsed){
            this.getCollapsedEl().show();
        }else if(this.splitEl){
            this.splitEl.show();
        }
    },

    /**
     * True表示为当前区域已隐藏，反之为false。
     * True if this region is currently visible, else false.
     * @return {Boolean}
     */
    isVisible : function(){
        return !this.panel.hidden;
    },

    /**
     * 返回当前区域的外补丁。如果区域是闭合的，就返回cmargins（collapsed margins）值。
     * Returns the current margins for this region. If the region is collapsed, the cmargins (collapsed
     * margins) value will be returned, otherwise the margins value will be returned.
     * @return {Object} 包含元素大小的对象： {left: （左边距）, top: （上边距）,
     * right: （右边距）, bottom: （下边距）} An object containing the element's margins: {left: (left margin), top: (top margin),
     * right: (right margin), bottom: (bottom margin)}
     */
    getMargins : function(){
        return this.isCollapsed && this.cmargins ? this.cmargins : this.margins;
    },

    /**
     * 返回此区域的当前大小尺寸。如果区域是闭合的，那么就返回collapsedEl的大小。 
     * Returns the current size of this region.  If the region is collapsed, the size of the collapsedEl will
     * be returned, otherwise the size of the region's panel will be returned.
     * @return {Object} 包含元素大小的对象： {width: （元素宽度）, height:（元素高度）} An object containing the element's size: {width: (element width), height: (element height)}  
     */
    getSize : function(){
        return this.isCollapsed ? this.getCollapsedEl().getSize() : this.panel.getSize();
    },

    /**
     * 指定一个面板作为此区域的容器元素
     * Sets the specified panel as the container element for this region.
     * @param {Ext.Panel} panel 新面板The new panel
     */
    setPanel : function(panel){
        this.panel = panel;
    },

    /**
     * 返回此区域可允许的最小宽度。
     * Returns the minimum allowable width for this region.
     * @return {Number} 最小宽度The minimum width
     */
    getMinWidth: function(){
        return this.minWidth;
    },

    /**
     * 返回此区域可允许的最小高度。
     * Returns the minimum allowable height for this region.
     * @return {Number} 最小高度The minimum height
     */
    getMinHeight: function(){
        return this.minHeight;
    },

    // private
    applyLayoutCollapsed : function(box){
        var ce = this.getCollapsedEl();
        ce.setLeftTop(box.x, box.y);
        ce.setSize(box.width, box.height);
    },

    // private
    applyLayout : function(box){
        if(this.isCollapsed){
            this.applyLayoutCollapsed(box);
        }else{
            this.panel.setPosition(box.x, box.y);
            this.panel.setSize(box.width, box.height);
        }
    },

    // private
    beforeSlide: function(){
        this.panel.beforeEffect();
    },

    // private
    afterSlide : function(){
        this.panel.afterEffect();
    },

    // private
    initAutoHide : function(){
        if(this.autoHide !== false){
            if(!this.autoHideHd){
                var st = new Ext.util.DelayedTask(this.slideIn, this);
                this.autoHideHd = {
                    "mouseout": function(e){
                        if(!e.within(this.el, true)){
                            st.delay(500);
                        }
                    },
                    "mouseover" : function(e){
                        st.cancel();
                    },
                    scope : this
                };
            }
            this.el.on(this.autoHideHd);
        }
    },

    // private
    clearAutoHide : function(){
        if(this.autoHide !== false){
            this.el.un("mouseout", this.autoHideHd.mouseout);
            this.el.un("mouseover", this.autoHideHd.mouseover);
        }
    },

    // private
    clearMonitor : function(){
        Ext.getDoc().un("click", this.slideInIf, this);
    },

    // these names are backwards but not changed for compat
    // private
    slideOut : function(){
        if(this.isSlid || this.el.hasActiveFx()){
            return;
        }
        this.isSlid = true;
        var ts = this.panel.tools;
        if(ts && ts.toggle){
            ts.toggle.hide();
        }
        this.el.show();
        if(this.position == 'east' || this.position == 'west'){
            this.panel.setSize(undefined, this.collapsedEl.getHeight());
        }else{
            this.panel.setSize(this.collapsedEl.getWidth(), undefined);
        }
        this.restoreLT = [this.el.dom.style.left, this.el.dom.style.top];
        this.el.alignTo(this.collapsedEl, this.getCollapseAnchor());
        this.el.setStyle("z-index", this.floatingZIndex+2);
        this.panel.el.replaceClass('x-panel-collapsed', 'x-panel-floating');
        if(this.animFloat !== false){
            this.beforeSlide();
            this.el.slideIn(this.getSlideAnchor(), {
                callback: function(){
                    this.afterSlide();
                    this.initAutoHide();
                    Ext.getDoc().on("click", this.slideInIf, this);
                },
                scope: this,
                block: true
            });
        }else{
            this.initAutoHide();
             Ext.getDoc().on("click", this.slideInIf, this);
        }
    },

    // private
    afterSlideIn : function(){
        this.clearAutoHide();
        this.isSlid = false;
        this.clearMonitor();
        this.el.setStyle("z-index", "");
        this.panel.el.replaceClass('x-panel-floating', 'x-panel-collapsed');
        this.el.dom.style.left = this.restoreLT[0];
        this.el.dom.style.top = this.restoreLT[1];

        var ts = this.panel.tools;
        if(ts && ts.toggle){
            ts.toggle.show();
        }
    },

    // private
    slideIn : function(cb){
        if(!this.isSlid || this.el.hasActiveFx()){
            Ext.callback(cb);
            return;
        }
        this.isSlid = false;
        if(this.animFloat !== false){
            this.beforeSlide();
            this.el.slideOut(this.getSlideAnchor(), {
                callback: function(){
                    this.el.hide();
                    this.afterSlide();
                    this.afterSlideIn();
                    Ext.callback(cb);
                },
                scope: this,
                block: true
            });
        }else{
            this.el.hide();
            this.afterSlideIn();
        }
    },

    // private
    slideInIf : function(e){
        if(!e.within(this.el)){
            this.slideIn();
        }
    },

    // private
    anchors : {
        "west" : "left",
        "east" : "right",
        "north" : "top",
        "south" : "bottom"
    },

    // private
    sanchors : {
        "west" : "l",
        "east" : "r",
        "north" : "t",
        "south" : "b"
    },

    // private
    canchors : {
        "west" : "tl-tr",
        "east" : "tr-tl",
        "north" : "tl-bl",
        "south" : "bl-tl"
    },

    // private
    getAnchor : function(){
        return this.anchors[this.position];
    },

    // private
    getCollapseAnchor : function(){
        return this.canchors[this.position];
    },

    // private
    getSlideAnchor : function(){
        return this.sanchors[this.position];
    },

    // private
    getAlignAdj : function(){
        var cm = this.cmargins;
        switch(this.position){
            case "west":
                return [0, 0];
            break;
            case "east":
                return [0, 0];
            break;
            case "north":
                return [0, 0];
            break;
            case "south":
                return [0, 0];
            break;
        }
    },

    // private
    getExpandAdj : function(){
        var c = this.collapsedEl, cm = this.cmargins;
        switch(this.position){
            case "west":
                return [-(cm.right+c.getWidth()+cm.left), 0];
            break;
            case "east":
                return [cm.right+c.getWidth()+cm.left, 0];
            break;
            case "north":
                return [0, -(cm.top+cm.bottom+c.getHeight())];
            break;
            case "south":
                return [0, cm.top+cm.bottom+c.getHeight()];
            break;
        }
    }
};

/**
 * @class Ext.layout.BorderLayout.SplitRegion
 * @extends Ext.layout.BorderLayout.Region
 * 这是为用户调节区域大小而内置的{@link Ext.SplitBar}的特殊类型BorderLayout区域。
 * This is a specialized type of BorderLayout region that has a built-in {@link Ext.SplitBar} for user resizing of regions.
 * @constructor 创建新的SplitRegion对象。Create a new SplitRegion.
 * @param {Layout} layout 任意有效的EXT布局类。Any valid Ext layout class
 * @param {Object} config 配置选项。The configuration options
 * @param {String} position 区域位置。有效的值是： north, south, east, west and center。每个BorderLayout必须有一个center区域以便摆放主要内容－－其他的就属于可选。
 * The region position. Valid values are: north, south, east, west and center.  Every
 * BorderLayout must have a center region for the primary content -- all other regions are optional.
 */
Ext.layout.BorderLayout.SplitRegion = function(layout, config, pos){
    Ext.layout.BorderLayout.SplitRegion.superclass.constructor.call(this, layout, config, pos);
    // prevent switch
    this.applyLayout = this.applyFns[pos];
};

Ext.extend(Ext.layout.BorderLayout.SplitRegion, Ext.layout.BorderLayout.Region, {
    /**
     * @cfg {String} splitTip
     * 当用户鼠标悬浮到一个非闭合的区域分隔条上提示文本（缺省为"Drag to resize."）。
     * 只当{@link #useSplitTips} = true时有效。
     * The tooltip to display when the user hovers over a non-collapsible region's split bar (defaults to "Drag
     * to resize."). Only applies if {@link #useSplitTips} = true.
     */
    splitTip : "Drag to resize.",
    /**
     * @cfg {String} collapsibleSplitTip
     * 当用户鼠标悬浮到已闭合的区域分隔条上提示文本（缺省为"Drag to resize. Double click to hide."）。
     * 只当{@link #useSplitTips} = true时有效。
     * The tooltip to display when the user hovers over a collapsible region's split bar (defaults to "Drag
     * to resize. Double click to hide.").  Only applies if {@link #useSplitTips} = true.
     */
    collapsibleSplitTip : "Drag to resize. Double click to hide.",
    /**
     * @cfg {Boolean} useSplitTips
     * True表示为当用户悬浮在区域splitBar上时显示的提示信息（缺省为false）。
     * tooltip的文本以相应是{@link #splitTip}或{@link #collapsibleSplitTip}的值。
     * True to display a tooltip when the user hovers over a region's split bar (defaults to false).  The tooltip
     * text will be the value of either {@link #splitTip} or {@link #collapsibleSplitTip} as appropriate.
     */
    useSplitTips : false,

    // private
    splitSettings : {
        north : {
            orientation: Ext.SplitBar.VERTICAL,
            placement: Ext.SplitBar.TOP,
            maxFn : 'getVMaxSize',
            minProp: 'minHeight',
            maxProp: 'maxHeight'
        },
        south : {
            orientation: Ext.SplitBar.VERTICAL,
            placement: Ext.SplitBar.BOTTOM,
            maxFn : 'getVMaxSize',
            minProp: 'minHeight',
            maxProp: 'maxHeight'
        },
        east : {
            orientation: Ext.SplitBar.HORIZONTAL,
            placement: Ext.SplitBar.RIGHT,
            maxFn : 'getHMaxSize',
            minProp: 'minWidth',
            maxProp: 'maxWidth'
        },
        west : {
            orientation: Ext.SplitBar.HORIZONTAL,
            placement: Ext.SplitBar.LEFT,
            maxFn : 'getHMaxSize',
            minProp: 'minWidth',
            maxProp: 'maxWidth'
        }
    },

    // private
    applyFns : {
        west : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            this.panel.setPosition(box.x, box.y);
            var sw = sd.offsetWidth;
            s.left = (box.x+box.width-sw)+'px';
            s.top = (box.y)+'px';
            s.height = Math.max(0, box.height)+'px';
            this.panel.setSize(box.width-sw, box.height);
        },
        east : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            var sw = sd.offsetWidth;
            this.panel.setPosition(box.x+sw, box.y);
            s.left = (box.x)+'px';
            s.top = (box.y)+'px';
            s.height = Math.max(0, box.height)+'px';
            this.panel.setSize(box.width-sw, box.height);
        },
        north : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            var sh = sd.offsetHeight;
            this.panel.setPosition(box.x, box.y);
            s.left = (box.x)+'px';
            s.top = (box.y+box.height-sh)+'px';
            s.width = Math.max(0, box.width)+'px';
            this.panel.setSize(box.width, box.height-sh);
        },
        south : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            var sh = sd.offsetHeight;
            this.panel.setPosition(box.x, box.y+sh);
            s.left = (box.x)+'px';
            s.top = (box.y)+'px';
            s.width = Math.max(0, box.width)+'px';
            this.panel.setSize(box.width, box.height-sh);
        }
    },

    // private
    render : function(ct, p){
        Ext.layout.BorderLayout.SplitRegion.superclass.render.call(this, ct, p);

        var ps = this.position;

        this.splitEl = ct.createChild({
            cls: "x-layout-split x-layout-split-"+ps, html: "&#160;",
            id: this.panel.id + '-xsplit'
        });

        if(this.collapseMode == 'mini'){
            this.miniSplitEl = this.splitEl.createChild({
                cls: "x-layout-mini x-layout-mini-"+ps, html: "&#160;"
            });
            this.miniSplitEl.addClassOnOver('x-layout-mini-over');
            this.miniSplitEl.on('click', this.onCollapseClick, this, {stopEvent:true});
        }

        var s = this.splitSettings[ps];

        this.split = new Ext.SplitBar(this.splitEl.dom, p.el, s.orientation);
        this.split.placement = s.placement;
        this.split.getMaximumSize = this[s.maxFn].createDelegate(this);
        this.split.minSize = this.minSize || this[s.minProp];
        this.split.on("beforeapply", this.onSplitMove, this);
        this.split.useShim = this.useShim === true;
        this.maxSize = this.maxSize || this[s.maxProp];

        if(p.hidden){
            this.splitEl.hide();
        }

        if(this.useSplitTips){
            this.splitEl.dom.title = this.collapsible ? this.collapsibleSplitTip : this.splitTip;
        }
        if(this.collapsible){
            this.splitEl.on("dblclick", this.onCollapseClick,  this);
        }
    },

    //docs inherit from superclass
    getSize : function(){
        if(this.isCollapsed){
            return this.collapsedEl.getSize();
        }
        var s = this.panel.getSize();
        if(this.position == 'north' || this.position == 'south'){
            s.height += this.splitEl.dom.offsetHeight;
        }else{
            s.width += this.splitEl.dom.offsetWidth;
        }
        return s;
    },

    // private
    getHMaxSize : function(){
         var cmax = this.maxSize || 10000;
         var center = this.layout.center;
         return Math.min(cmax, (this.el.getWidth()+center.el.getWidth())-center.getMinWidth());
    },

    // private
    getVMaxSize : function(){
        var cmax = this.maxSize || 10000;
        var center = this.layout.center;
        return Math.min(cmax, (this.el.getHeight()+center.el.getHeight())-center.getMinHeight());
    },

    // private
    onSplitMove : function(split, newSize){
        var s = this.panel.getSize();
        this.lastSplitSize = newSize;
        if(this.position == 'north' || this.position == 'south'){
            this.panel.setSize(s.width, newSize);
            this.state.height = newSize;
        }else{
            this.panel.setSize(newSize, s.height);
            this.state.width = newSize;
        }
        this.layout.layout();
        this.panel.saveState();
        return false;
    },

    /**
     * 返回此区域SplitBar引用。
     * Returns a reference to the split bar in use by this region.
     * @return {Ext.SplitBar} SplitBar对象。The split bar
     */
    getSplitBar : function(){
        return this.split;
    },
    
    // inherit docs
    destroy : function() {
        Ext.destroy(
            this.miniSplitEl, 
            this.split, 
            this.splitEl
        );
    }
});

Ext.Container.LAYOUTS['border'] = Ext.layout.BorderLayout;