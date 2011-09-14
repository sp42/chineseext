/**
 * @class Ext.TabPanel
 * <p>基础性的tab容器。Tab面板(Tab Panels)可用于如标准{@link Ext.Panel}的布局目的，
 * 亦可将多个面板归纳为一组tabs的特殊用途。</p>
 * <p>这里没有实际tab类,每一张tab便是一个{@link Ext.Panel}。然而，当Panel放在TabPanel
 * 里面作子面板渲染时会额外增加若干事件,而这些事件一般的Panel是没有的，如下列：</p>
 * <ul>
 * <li><b>activate</b>: 当面板变成为活动时触发。
 * <div class="mdetail-params">
 *      <strong style="font-weight: normal;">侦听器（Listeners）调用时会有下列的参数：</strong>
 *      <ul><li><code>tab</code> : Panel<div class="sub-desc">被激活的tab对象/div></li></ul>
 *  </div></li>
 * <li><b>deactivate</b>: 当活动的面板变成为不活动的状态触发。
 * <div class="mdetail-params">
 *      <strong style="font-weight: normal;">侦听器（Listeners）调用时会有下列的参数：</strong>
 *      <ul><li><code>tab</code> : Panel<div class="sub-desc">取消活动状态的tab对象</div></li></ul>
 *  </div></li>
 * </ul>
 * <p>有几种途径可生成Tab面板本身,下面演示的是纯粹通过代码来创建和渲染tabs.</p>
 * <pre><code>
var tabs = new Ext.TabPanel({
    renderTo: Ext.getBody(),
    activeTab: 0,
    items: [{
        title: 'Tab 1',
        html: 'A simple tab'
    },{
        title: 'Tab 2',
        html: 'Another one'
    }]
});
</pre></code>
  * <p>TabPanels can also be rendered from markup in a couple of ways.  See the {@link #autoTabs} example for
  * rendering entirely from markup that is already structured correctly as a TabPanel (a container div with
  * one or more nested tab divs with class 'x-tab'). You can also render from markup that is not strictly
  * structured by simply specifying by id which elements should be the container and the tabs. Using this method,
  * tab content can be pulled from different elements within the page by id regardless of page structure.  Note
  * that the tab divs in this example contain the class 'x-hide-display' so that they can be rendered deferred
  * without displaying outside the tabs. You could alternately set {@link #deferredRender} to false to render all
  * content tabs on page load. For example:
  * <pre><code>
  * 整个TabPanel对象也可以由标签，分别几个途径来创建。参阅{@link #autoTabs}的例子了解由标签创建的全部过程。这些标签必须是符合TabPanel的要求的
  * （div作为容器，然后内含一个或多个'x-tab'样式类的div表示每个标签页）。同时你也可以通过指定id方式来选择哪个是容器的div、哪个是标签页的div，
  * 该方式下，标签页的内容会从页面上不同元素中提取，而不需要考虑页面的分配结构，自由度较高。注意该例中class属性为'x-hide-display'的DIV表示
  * 延时渲染标签页，不会导致标签页在TabPanel外部的区域渲染显示出来。你可选择设置{@link #deferredRender}为false表示所有的内容在页面加载时就渲染出来。例如：
var tabs = new Ext.TabPanel({
    renderTo: 'my-tabs',
    activeTab: 0,
    items:[
        {contentEl:'tab1', title:'Tab 1'},
        {contentEl:'tab2', title:'Tab 2'}
    ]
});

// Note that the tabs do not have to be nested within the container (although they can be)
// 注意tab没有被容器套着（尽管也是可以套着的）
&lt;div id="my-tabs">&lt;/div>
&lt;div id="tab1" class="x-hide-display">A simple tab&lt;/div>
&lt;div id="tab2" class="x-hide-display">Another one&lt;/div>
</pre></code>
 * @extends Ext.Panel
 * @constructor
 * @param {Object} config 配置项对象
 */
 Ext.TabPanel = Ext.extend(Ext.Panel,  {
 
    /**
     * @cfg {Boolean} layoutOnTabChange True表示为每当Tab切换时就绘制一次布局.
     */
 
    /**
     * @cfg {Boolean} monitorResize True表示为自动随着window的大小变化,按照浏览器的大小渲染布局.(默认为 true).
     */
     monitorResize : true,
 
    /**
     * @cfg {Boolean} deferredRender 内置地, Tab面板是采用 {@link Ext.layout.CardLayout} 的方法管理tabs.
     * 此属性的值将会传递到布局的 {@link Ext.layout.CardLayout#deferredRender} 配置值中,以决定是否只有tab面板
     * 第一次访问时才渲染 (缺省为 true).
     */
     deferredRender : true,
 
    /**
     * @cfg {Number} tabWidth 每一张新tab的初始宽度,单位为象素 (缺省为 120).
     */
     tabWidth: 120,
 
    /**
     * @cfg {Number} minTabWidth 每张tab宽度的最小值,仅当 {@link #resizeTabs} = true有效 (缺省为 30).
     */
     minTabWidth: 30,
     
    /**
     * @cfg {Boolean} resizeTabs True to automatically resize each tab so that the tabs will completely fill the
     * tab strip (defaults to false).  
     * Setting this to true may cause specific widths that might be set per tab to
     * be overridden in order to fit them all into view (although {@link #minTabWidth} will always be honored).
     * 
     * True表示为自动调整各个标签页的宽度，以便适应当前TabPanel的候选栏的宽度（默认为false）。
     * 这样设置的话，那么每个标签页都可能会一个规定的宽度，原先标签页的宽度将不会保留以便适应显示（尽管{@link #minTabWidth}依然作用）。
     */     
    resizeTabs:false,
    
    /**
     * @cfg {Number} enableTabScroll 
     * True to enable scrolling to tabs that may be invisible due to overflowing the
     * overall TabPanel width. Only available with tabs on top. (defaults to false).
     * 
     * 『有时标签页会超出TabPanel的整体宽度。为防止此情况下溢出的标签页不可见，就需要将此项设为true以出现标签页可滚动的功能。
     * 只当标签页位于上方的位置时有效（默认为false）。』
     */
    enableTabScroll: false,
    
    /**
     * @cfg {Number} scrollIncrement 
     * The number of pixels to scroll each time a tab scroll button is pressed (defaults
     * to 100, or if {@link #resizeTabs} = true, the calculated tab width). 
     * Only applies when {@link #enableTabScroll} = true.
     * 
     * 『每次滚动按钮按下时，被滚动的标签页所移动的距离（单位是像素，默认为100，若{@link #resizeTabs}=true，那么默认值将是计算好的标签页宽度）。
     * 只当{@link #enableTabScroll} = true时有效。』
     */
    scrollIncrement : 0,
    
    /**
     * @cfg {Number} scrollRepeatInterval Number of milliseconds between each scroll while a tab scroll button is
     * continuously pressed (defaults to 400).
     * 
     * 『当标签页滚动按钮不停地被按下时，两次执行滚动的间隔的毫秒数（默认为400）。』
     */
    scrollRepeatInterval : 400,
    
    /**
     * @cfg {Float} scrollDuration 每次滚动所产生动画会持续多久（单位毫秒，默认为0.35）。只当{@link #animScroll} = true时有效。
     */
    scrollDuration : .35,
 
    /**
     * @cfg {Boolean} animScroll True 表示为tab滚动时出现动画效果以使tab在视图中消失得更平滑 (缺省为true).
     * 只当 {@link #enableTabScroll} = true时有效.
     */
     animScroll : true,
 
    /**
     * @cfg {String} tabPosition Tab候选栏渲染的位置 (默认为 'top'). 其它可支持值是'bottom'.
     * 注意tab滚动 (tab scrolling) 只支持'top'的位置.
     */
     tabPosition: 'top',
 
    /**
     * @cfg {String} baseCls 作用在面板上CSS样式类 (默认为 'x-tab-panel').
     */
     baseCls: 'x-tab-panel',
 
    /**
     * @cfg {Boolean} autoTabs
     * <p>True 表示为查询DOM中任何带 "x-tab' 样式类的div元素,转化为tab加入到此面板中
     * (默认为 false)。注意查询的执行范围仅限于容器元素内
     * (so that multiple tab panels from markup can be supported via this method) </p>
     * <p>此时要求markup(装饰元素)结构(即在容器内嵌有'x-tab'类的div元素)才有效.
     * 要突破这种限制,或从页面上其它元素的内容拉到tab中,可参阅由markup生成tab的第一个示例.</p>
     * <p>采用这种方法须注意下列几个问题:<ul>
     * <li>当使用autoTabs的时候(与不同的tab配置传入到tabPanel
     * {@link #items} 集合的方法相反), 你同时必须使用 {@link #applyTo} 
     * 正确地指明tab容器的id.
     * AutoTabs 方法把现有的内容替换为TabPanel组件.</li>
     * <li>确保已设 {@link #deferredRender} 为false,使得每个tab中的内容元素能在页面加载之后立即渲染到
     * TabPanel,否则的话激活tab也不能成功渲染.</li>
     * </ul>用法举例:</p>
     * <pre><code>
var tabs = new Ext.TabPanel({
    applyTo: 'my-tabs',
    activeTab: 0,
    deferredRender: false,
    autoTabs: true
});

//这些装饰元素会按照以上的代码转换为TabPanel对象
&lt;div id="my-tabs">
    &lt;div class="x-tab" title="Tab 1">A simple tab&lt;/div>
    &lt;div class="x-tab" title="Tab 2">Another one&lt;/div>
&lt;/div>
</code></pre>
     */
     autoTabs : false,
 
     /**
     * @cfg {String} autoTabSelector 用于搜索tab的那个CSS选择符,当 {@link #autoTabs}
     * 时有效. (默认为 'div.x-tab').  此值可是 {@link Ext.DomQuery#select}的任意有效值.
     * 注意  the query will be executed within the scope of this tab panel only (so that multiple tab panels from
     * markup can be supported on a page).
     */
    autoTabSelector:'div.x-tab',
    // private
    itemCls : 'x-tab-item',
 
    /**
     * @cfg {String/Number} activeTab 一个字符串或数字(索引)表示,渲染后就活动的那个tab (默认为没有).
     */
     activeTab : null,
 
    /**
     * @cfg {Number} tabMargin 此象素值参与大小调整和卷动时的运算，以计算空隙的象素值。如果你在CSS中改变了margin（外补丁），那么这个值也要随着更改，才能正确地计算值（默认为2）
     */     
    tabMargin : 2,
 
    /**
     * @cfg {Boolean} plain True表示为不渲染tab候选栏上背景容器图片（默认为false）。
     */   
    plain: false,
 
    /**
     * @cfg {Number} wheelIncrement 对于可滚动的tabs，鼠标滚轮翻页一下的步长值，单位为象素（缺省为20）。
     */    
    wheelIncrement : 20,

    // private config overrides
    elements: 'body',
    headerAsText: false,
    frame: false,
    hideBorders:true,

    // private
    initComponent : function(){
        this.frame = false;
        Ext.TabPanel.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event beforetabchange
             * 当活动tab改变时触发。若句柄返回false则取消tab的切换。
             * @param {TabPanel} this
             * @param {Panel} newTab 活动着的tab对象
             * @param {Panel} currentTab 当前活动tab对象
             */
            'beforetabchange',
            /**
             * @event tabchange
             * 当活动tab改变后触发。
             * @param {TabPanel} this
             * @param {Panel} tab 新的活动tab对象
             */
            'tabchange',
            /**
             * @event contextmenu
             * 当原始浏览器的右键事件在tab元素上触发时，连动到此事件。
             * @param {TabPanel} this
             * @param {Panel} tab 目标tab对象
             * @param {EventObject} e
             */
            'contextmenu'
        );
        this.setLayout(new Ext.layout.CardLayout({
            deferredRender: this.deferredRender
        }));
        if(this.tabPosition == 'top'){
            this.elements += ',header';
            this.stripTarget = 'header';
        }else {
            this.elements += ',footer';
            this.stripTarget = 'footer';
        }
        if(!this.stack){
            this.stack = Ext.TabPanel.AccessStack();
        }
        this.initItems();
    },

    // private
    render : function(){
        Ext.TabPanel.superclass.render.apply(this, arguments);
        if(this.activeTab !== undefined){
            var item = this.activeTab;
            delete this.activeTab;
            this.setActiveTab(item);
        }
    },

    // private
    onRender : function(ct, position){
        Ext.TabPanel.superclass.onRender.call(this, ct, position);

        if(this.plain){
            var pos = this.tabPosition == 'top' ? 'header' : 'footer';
            this[pos].addClass('x-tab-panel-'+pos+'-plain');
        }

        var st = this[this.stripTarget];
        
        this.stripWrap = st.createChild({cls:'x-tab-strip-wrap', cn:{
            tag:'ul', cls:'x-tab-strip x-tab-strip-'+this.tabPosition}});
        this.stripSpacer = st.createChild({cls:'x-tab-strip-spacer'});
        this.strip = new Ext.Element(this.stripWrap.dom.firstChild);
        
        this.edge = this.strip.createChild({tag:'li', cls:'x-tab-edge'});
        this.strip.createChild({cls:'x-clear'});

        this.body.addClass('x-tab-panel-body-'+this.tabPosition);
        
        if(!this.itemTpl){
            var tt = new Ext.Template(
                 '<li class="{cls}" id="{id}"><a class="x-tab-strip-close" onclick="return false;"></a>',
                 '<a class="x-tab-right" href="#" onclick="return false;"><em class="x-tab-left">',
                 '<span class="x-tab-strip-inner"><span class="x-tab-strip-text {iconCls}">{text}</span></span>',
                 '</em></a></li>'
            );
            tt.disableFormats = true;
            tt.compile();
            Ext.TabPanel.prototype.itemTpl = tt;
        }

        this.items.each(this.initTab, this);
    },

    // private
    afterRender : function(){
        Ext.TabPanel.superclass.afterRender.call(this);
        if(this.autoTabs){
            this.readTabs(false);
        }
    },

    // private
    initEvents : function(){
        Ext.TabPanel.superclass.initEvents.call(this);
        this.on('add', this.onAdd, this);
        this.on('remove', this.onRemove, this);

        this.strip.on('mousedown', this.onStripMouseDown, this);
        this.strip.on('click', this.onStripClick, this);
        this.strip.on('contextmenu', this.onStripContextMenu, this);
        if(this.enableTabScroll){
            this.strip.on('mousewheel', this.onWheel, this);
        }
    },

    // private
    findTargets : function(e){
        var item = null;
        var itemEl = e.getTarget('li', this.strip);
        if(itemEl){
            item = this.getComponent(itemEl.id.split('__')[1]);
            if(item.disabled){
                return {
                    close : null,
                    item : null,
                    el : null
                };
            }
        }
        return {
            close : e.getTarget('.x-tab-strip-close', this.strip),
            item : item,
            el : itemEl
        };
    },

    // private
    onStripMouseDown : function(e){
        e.preventDefault();
        if(e.button != 0){
            return;
        }
        var t = this.findTargets(e);
        if(t.close){
            this.remove(t.item);
            return;
        }
        if(t.item && t.item != this.activeTab){
            this.setActiveTab(t.item);
        }
    },

    // private
    onStripClick : function(e){
        var t = this.findTargets(e);
        if(!t.close && t.item && t.item != this.activeTab){
            this.setActiveTab(t.item);
        }
    },

    // private
    onStripContextMenu : function(e){
        e.preventDefault();
        var t = this.findTargets(e);
        if(t.item){
            this.fireEvent('contextmenu', this, t.item, e);
        }
    },
 
    /**
     * True表示为使用autoTabSelector选择符来扫描此tab面板内的markup，以准备autoTabs的特性。
     * @param {Boolean} removeExisting True表示为移除现有的tabs
     */     
    readTabs : function(removeExisting){
        if(removeExisting === true){
            this.items.each(function(item){
                this.remove(item);
            }, this);
        }
        var tabs = this.el.query(this.autoTabSelector);
        for(var i = 0, len = tabs.length; i < len; i++){
            var tab = tabs[i];
            var title = tab.getAttribute('title');
            tab.removeAttribute('title');
            this.add({
                title: title,
                el: tab
            });
        }
    },

    // private
    initTab : function(item, index){
        var before = this.strip.dom.childNodes[index];
        var cls = item.closable ? 'x-tab-strip-closable' : '';
        if(item.disabled){
            cls += ' x-item-disabled';
        }
        if(item.iconCls){
            cls += ' x-tab-with-icon';
        }
        var p = {
            id: this.id + '__' + item.getItemId(),
            text: item.title,
            cls: cls,
            iconCls: item.iconCls || ''
        };
        var el = before ?
                 this.itemTpl.insertBefore(before, p) :
                 this.itemTpl.append(this.strip, p);

        Ext.fly(el).addClassOnOver('x-tab-strip-over');

        if(item.tabTip){
            Ext.fly(el).child('span.x-tab-strip-text', true).qtip = item.tabTip;
        }
        item.on('disable', this.onItemDisabled, this);
        item.on('enable', this.onItemEnabled, this);
        item.on('titlechange', this.onItemTitleChanged, this);
        item.on('beforeshow', this.onBeforeShowItem, this);
    },

    // private
    onAdd : function(tp, item, index){
        this.initTab(item, index);
        if(this.items.getCount() == 1){
            this.syncSize();
        }
        this.delegateUpdates();
    },

    // private
    onBeforeAdd : function(item){
        var existing = item.events ? (this.items.containsKey(item.getItemId()) ? item : null) : this.items.get(item);
        if(existing){
            this.setActiveTab(item);
            return false;
        }
        Ext.TabPanel.superclass.onBeforeAdd.apply(this, arguments);
        var es = item.elements;
        item.elements = es ? es.replace(',header', '') : es;
        item.border = (item.border === true);
    },

    // private
    onRemove : function(tp, item){
        Ext.removeNode(this.getTabEl(item));
        this.stack.remove(item);
        if(item == this.activeTab){
            var next = this.stack.next();
            if(next){
                this.setActiveTab(next);
            }else{
                this.setActiveTab(0);
            }
        }
        this.delegateUpdates();
    },

    // private
    onBeforeShowItem : function(item){
        if(item != this.activeTab){
            this.setActiveTab(item);
            return false;
        }
    },

    // private
    onItemDisabled : function(item){
        var el = this.getTabEl(item);
        if(el){
            Ext.fly(el).addClass('x-item-disabled');
        }
        this.stack.remove(item);
    },

    // private
    onItemEnabled : function(item){
        var el = this.getTabEl(item);
        if(el){
            Ext.fly(el).removeClass('x-item-disabled');
        }
    },

    // private
    onItemTitleChanged : function(item){
        var el = this.getTabEl(item);
        if(el){
            Ext.fly(el).child('span.x-tab-strip-text', true).innerHTML = item.title;
        }
    },

    /**
     * 指定一个子面板，返回此面板在tab候选栏上的DOM元素。访问DOM元素可以修改一些可视化效果，例如更改CSS样式类的名称。
     * @param {Panel} tab tab对象
     * @return {HTMLElement} DOM节点
     */   
    getTabEl : function(item){
        return document.getElementById(this.id+'__'+item.getItemId());
    },

    // private
    onResize : function(){
        Ext.TabPanel.superclass.onResize.apply(this, arguments);
        this.delegateUpdates();
    },

    /**
     * 暂停一切内置的运算或卷动好让扩充操作（bulk operation）进行。参阅{@link #endUpdate}。
     */    
    beginUpdate : function(){
        this.suspendUpdates = true;
    },

    /**
     * 结束扩充操作（bulk operation）后，重新开始一切内置的运算或滚动效果。参阅{@link #beginUpdate}。
     */     
    endUpdate : function(){
        this.suspendUpdates = false;
        this.delegateUpdates();
    },

    /**
     * 隐藏Tab候选栏以传入tab。
     * @param {Number/String/Panel} item tab索引、id或item对象
     */     
    hideTabStripItem : function(item){
        item = this.getComponent(item);
        var el = this.getTabEl(item);
        if(el){
            el.style.display = 'none';
            this.delegateUpdates();
        }
    },

    /**
     * 取消Tab候选栏隐藏的状态以传入tab。
     * @param {Number/String/Panel} item tab索引、id或item对象
     */   
    unhideTabStripItem : function(item){
        item = this.getComponent(item);
        var el = this.getTabEl(item);
        if(el){
            el.style.display = '';
            this.delegateUpdates();
        }
    },

    // private
    delegateUpdates : function(){
        if(this.suspendUpdates){
            return;
        }
        if(this.resizeTabs && this.rendered){
            this.autoSizeTabs();
        }
        if(this.enableTabScroll && this.rendered){
            this.autoScrollTabs();
        }
    },

    // private
    autoSizeTabs : function(){
        var count = this.items.length;
        var ce = this.tabPosition != 'bottom' ? 'header' : 'footer';
        var ow = this[ce].dom.offsetWidth;
        var aw = this[ce].dom.clientWidth;

        if(!this.resizeTabs || count < 1 || !aw){ // !aw for display:none
            return;
        }
        
        var each = Math.max(Math.min(Math.floor((aw-4) / count) - this.tabMargin, this.tabWidth), this.minTabWidth); // -4 for float errors in IE
        this.lastTabWidth = each;
        var lis = this.stripWrap.dom.getElementsByTagName('li');
        for(var i = 0, len = lis.length-1; i < len; i++) { // -1 for the "edge" li
            var li = lis[i];
            var inner = li.childNodes[1].firstChild.firstChild;
            var tw = li.offsetWidth;
            var iw = inner.offsetWidth;
            inner.style.width = (each - (tw-iw)) + 'px';
        }
    },

    // private
    adjustBodyWidth : function(w){
        if(this.header){
            this.header.setWidth(w);
        }
        if(this.footer){
            this.footer.setWidth(w);
        }
        return w;
    },

    /**
     * 设置特定的tab为活动面板。
     * 此方法触发{@link #beforetabchange}事件，若处理函数返回false则取消tab切换。
     * @param {String/Panel} tab 活动面板或其id
     */     
    setActiveTab : function(item){
        item = this.getComponent(item);
        if(!item || this.fireEvent('beforetabchange', this, item, this.activeTab) === false){
            return;
        }
        if(!this.rendered){
            this.activeTab = item;
            return;
        }
        if(this.activeTab != item){
            if(this.activeTab){
                var oldEl = this.getTabEl(this.activeTab);
                if(oldEl){
                    Ext.fly(oldEl).removeClass('x-tab-strip-active');
                }
                this.activeTab.fireEvent('deactivate', this.activeTab);
            }
            var el = this.getTabEl(item);
            Ext.fly(el).addClass('x-tab-strip-active');
            this.activeTab = item;
            this.stack.add(item);

            this.layout.setActiveItem(item);
            if(this.layoutOnTabChange && item.doLayout){
                item.doLayout();
            }
            if(this.scrolling){
                this.scrollToTab(item, this.animScroll);
            }

            item.fireEvent('activate', item);
            this.fireEvent('tabchange', this, item);
        }
    },

    /**
     * 返回当前活动的Tab。
     * @return {Panel} 活动的Tab
     */     
    getActiveTab : function(){
        return this.activeTab || null;
    },

    /**
     * 根据id获取指定tab
     * @param {String} id Tab的ID
     * @return {Panel} tab
     */
          
    getItem : function(item){
        return this.getComponent(item);
    },

    // private
    autoScrollTabs : function(){
        var count = this.items.length;
        var ow = this.header.dom.offsetWidth;
        var tw = this.header.dom.clientWidth;

        var wrap = this.stripWrap;
        var cw = wrap.dom.offsetWidth;
        var pos = this.getScrollPos();
        var l = this.edge.getOffsetsTo(this.stripWrap)[0] + pos;

        if(!this.enableTabScroll || count < 1 || cw < 20){ // 20 to prevent display:none issues
            return;
        }
        if(l <= tw){
            wrap.dom.scrollLeft = 0;
            wrap.setWidth(tw);
            if(this.scrolling){
                this.scrolling = false;
                this.header.removeClass('x-tab-scrolling');
                this.scrollLeft.hide();
                this.scrollRight.hide();
            }
        }else{
            if(!this.scrolling){
                this.header.addClass('x-tab-scrolling');
            }
            tw -= wrap.getMargins('lr');
            wrap.setWidth(tw > 20 ? tw : 20);
            if(!this.scrolling){
                if(!this.scrollLeft){
                    this.createScrollers();
                }else{
                    this.scrollLeft.show();
                    this.scrollRight.show();
                }
            }
            this.scrolling = true;
            if(pos > (l-tw)){ // ensure it stays within bounds
                wrap.dom.scrollLeft = l-tw;
            }else{ // otherwise, make sure the active tab is still visible
                this.scrollToTab(this.activeTab, false);
            }
            this.updateScrollButtons();
        }
    },

    // private
    createScrollers : function(){
        var h = this.stripWrap.dom.offsetHeight;

        // left
        var sl = this.header.insertFirst({
            cls:'x-tab-scroller-left'
        });
        sl.setHeight(h);
        sl.addClassOnOver('x-tab-scroller-left-over');
        this.leftRepeater = new Ext.util.ClickRepeater(sl, {
            interval : this.scrollRepeatInterval,
            handler: this.onScrollLeft,
            scope: this
        });
        this.scrollLeft = sl;

        // right
        var sr = this.header.insertFirst({
            cls:'x-tab-scroller-right'
        });
        sr.setHeight(h);
        sr.addClassOnOver('x-tab-scroller-right-over');
        this.rightRepeater = new Ext.util.ClickRepeater(sr, {
            interval : this.scrollRepeatInterval,
            handler: this.onScrollRight,
            scope: this
        });
        this.scrollRight = sr;
    },

    // private
    getScrollWidth : function(){
        return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos();
    },

    // private
    getScrollPos : function(){
        return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0;
    },

    // private
    getScrollArea : function(){
        return parseInt(this.stripWrap.dom.clientWidth, 10) || 0;
    },

    // private
    getScrollAnim : function(){
        return {duration:this.scrollDuration, callback: this.updateScrollButtons, scope: this};
    },

    // private
    getScrollIncrement : function(){
        return this.scrollIncrement || (this.resizeTabs ? this.lastTabWidth+2 : 100);
    },

    /**
     * 滚动到指定的TAB
     * @param {Panel} item 要滚动到项
     * @param {Boolean} animate True表示有动画效果
     */
     
    scrollToTab : function(item, animate){
        if(!item){ return; }
        var el = this.getTabEl(item);
        var pos = this.getScrollPos(), area = this.getScrollArea();
        var left = Ext.fly(el).getOffsetsTo(this.stripWrap)[0] + pos;
        var right = left + el.offsetWidth;
        if(left < pos){
            this.scrollTo(left, animate);
        }else if(right > (pos + area)){
            this.scrollTo(right - area, animate);
        }
    },

    // private
    scrollTo : function(pos, animate){
        this.stripWrap.scrollTo('left', pos, animate ? this.getScrollAnim() : false);
        if(!animate){
            this.updateScrollButtons();
        }
    },

    onWheel : function(e){
        var d = e.getWheelDelta()*this.wheelIncrement*-1;
        e.stopEvent();

        var pos = this.getScrollPos();
        var newpos = pos + d;
        var sw = this.getScrollWidth()-this.getScrollArea();

        var s = Math.max(0, Math.min(sw, newpos));
        if(s != pos){
            this.scrollTo(s, false);
        }
    },

    // private
    onScrollRight : function(){
        var sw = this.getScrollWidth()-this.getScrollArea();
        var pos = this.getScrollPos();
        var s = Math.min(sw, pos + this.getScrollIncrement());
        if(s != pos){
            this.scrollTo(s, this.animScroll);
        }        
    },

    // private
    onScrollLeft : function(){
        var pos = this.getScrollPos();
        var s = Math.max(0, pos - this.getScrollIncrement());
        if(s != pos){
            this.scrollTo(s, this.animScroll);
        }
    },

    // private
    updateScrollButtons : function(){
        var pos = this.getScrollPos();
        this.scrollLeft[pos == 0 ? 'addClass' : 'removeClass']('x-tab-scroller-left-disabled');
        this.scrollRight[pos >= (this.getScrollWidth()-this.getScrollArea()) ? 'addClass' : 'removeClass']('x-tab-scroller-right-disabled');
    }

    /**
     * @cfg {Boolean} collapsible
     * @hide
     */
    /**
     * @cfg {String} header
     * @hide
     */
    /**
     * @cfg {Boolean} headerAsText
     * @hide
     */
    /**
     * @property header
     * @hide
     */
});
Ext.reg('tabpanel', Ext.TabPanel);

/**
 * 设置特定的tab为活动面板。
 * 此方法触发{@link #beforetabchange}事件若返回false则取消tab切换。
 * @param {String/Panel} tab 活动面板或其id
 * @method activate
 */ 
Ext.TabPanel.prototype.activate = Ext.TabPanel.prototype.setActiveTab;

// private utility class used by TabPanel
Ext.TabPanel.AccessStack = function(){
    var items = [];
    return {
        add : function(item){
            items.push(item);
            if(items.length > 10){
                items.shift();
            }
        },

        remove : function(item){
            var s = [];
            for(var i = 0, len = items.length; i < len; i++) {
                if(items[i] != item){
                    s.push(items[i]);
                }
            }
            items = s;
        },

        next : function(){
            return items.pop();
        }
    };
};

