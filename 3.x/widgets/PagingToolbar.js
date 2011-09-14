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
 * @class Ext.PagingToolbar
 * @extends Ext.Toolbar
 * <p>一个要和{@link Ext.data.Store}参与绑定并且自动提供翻页控制的工具栏。
 * A specialized toolbar that is bound to a {@link Ext.data.Store} and provides automatic paging control. This
 * Component {@link Ext.data.Store#load load}s blocks of data into the Store passing parameters who's names are
 * specified by the store's {@link Ext.data.Store#paramNames paramNames} property.</p>
 * @constructor 创建一个新的翻页工具栏。Create a new PagingToolbar
 * @param {Object} config 配置对象。The config object
 */
(function() {

var T = Ext.Toolbar;

Ext.PagingToolbar = Ext.extend(Ext.Toolbar, {
    /**
     * @cfg {Ext.data.Store} store 翻页工具栏应该使用{@link Ext.data.Store}作为它的数据源（在需要的时候）。
     * The {@link Ext.data.Store} the paging toolbar should use as its data source (required).
     */
    /**
     * @cfg {Boolean} displayInfo 为true时展示展现信息（默认为false）。
     * True to display the displayMsg (defaults to false)
     */
    /**
     * @cfg {Number} pageSize 每页要展现的记录数（默认为 20）。
     * The number of records to display per page (defaults to 20)
     */
    /**
     * @cfg {Boolean} prependButtons True表示为在分页按钮<i>之前</i>随便插入可配置的条目。默认为false。
     * True to insert any configured items <i>before</i> the paging buttons. Defaults to false.
     */

    pageSize: 20,
    /**
     * @cfg {String} displayMsg
     * 用来显示翻页的情况信息 (默认为"Displaying {0} - {1} of {2}"). 
     * 注意这个字符串里大括号中的数字是一种标记,其中的数字分别代表起始值,结束值和总数.当重写这个字符串的时候如果这些值是要显示的,那么这些标识应该被保留下来
     * The paging status message to display (defaults to "Displaying {0} - {1} of {2}").  Note that this string is
     * formatted using the braced numbers 0-2 as tokens that are replaced by the values for start, end and total
     * respectively. These tokens should be preserved when overriding this string if showing those values is desired.
     */
    displayMsg : 'Displaying {0} - {1} of {2}',
    /**
     * @cfg {String} emptyMsg 没有数据记录的时候所展示的信息（默认为"No data to display"）。
     * The message to display when no records are found (defaults to "No data to display")
     */
    emptyMsg : 'No data to display',
    /**
     * 可定制的默认翻页文本(默认为 to "Page")。
     * Customizable piece of the default paging text (defaults to "Page")
     * @type String
     */
    beforePageText : "Page",
    /**
     * 可定制的默认翻页文本（默认为"of %0"）。注意该字符串中{0}作为一种表识会被替换为真实的总页数。如要宣示总页数，那么在重写该值的时候也要写出这个{0}。
     * Customizable piece of the default paging text (defaults to "of {0}"). Note that this string is
     * formatted using {0} as a token that is replaced by the number of total pages. This token should be
     * preserved when overriding this string if showing the total page count is desired.
     * @type String
     */
    afterPageText : "of {0}",
    /**
     * 可定制的默认翻页文本(默认为 "First Page")。
     * Customizable piece of the default paging text (defaults to "First Page")
     * @type String
     */
    firstText : "First Page",
    /**
     * 可定制的默认翻页文本(defaults to "Previous Page")。
     * Customizable piece of the default paging text (defaults to "Previous Page")
     * @type String
     */
    prevText : "Previous Page",
    /**
     * 可定制的默认翻页文本(defaults to "Next Page")。
     * Customizable piece of the default paging text (defaults to "Next Page")
     * @type String
     */
    nextText : "Next Page",
    /**
     * 可定制的默认翻页文本(defaults to "Last Page")。
     * Customizable piece of the default paging text (defaults to "Last Page")
     * @type String
     */
    lastText : "Last Page",
    /**
     * 可定制的默认翻页文本 (defaults to "Refresh")。
     * Customizable piece of the default paging text (defaults to "Refresh")
     * @type String
     */
    refreshText : "Refresh",

    /**
     * 加载调用时的参数名对象映射（默认为 {start: 'start', limit: 'limit'}）。
     * Object mapping of parameter names for load calls (defaults to {start: 'start', limit: 'limit'})
     */
    paramNames : {start: 'start', limit: 'limit'},

    // private
    constructor: function(config) {
	    var pagingItems = [this.first = new T.Button({
	        tooltip: this.firstText,
	        iconCls: "x-tbar-page-first",
	        disabled: true,
	        handler: this.onClick,
	        scope: this
	    }), this.prev = new T.Button({
	        tooltip: this.prevText,
	        iconCls: "x-tbar-page-prev",
	        disabled: true,
	        handler: this.onClick,
	        scope: this
	    }), '-', this.beforePageText,
	    this.inputItem = new T.Item({
	    	height: 18,
	    	autoEl: {
		        tag: "input",
		        type: "text",
		        size: "3",
		        value: "1",
		        cls: "x-tbar-page-number"
		    }
	    }), this.afterTextItem = new T.TextItem({
	    	text: String.format(this.afterPageText, 1)
	    }), '-', this.next = new T.Button({
            tooltip: this.nextText,
	        iconCls: "x-tbar-page-next",
	        disabled: true,
	        handler: this.onClick,
	        scope: this
	    }), this.last = new T.Button({
	        tooltip: this.lastText,
	        iconCls: "x-tbar-page-last",
	        disabled: true,
	        handler: this.onClick,
	        scope: this
	    }), '-', this.refresh = new T.Button({
	        tooltip: this.refreshText,
	        iconCls: "x-tbar-loading",
	        handler: this.onClick,
	        scope: this
	    })];


        var userItems = config.items || config.buttons || [];
        if (config.prependButtons) {
            config.items = userItems.concat(pagingItems);
        }else{
            config.items = pagingItems.concat(userItems);
        }
	    delete config.buttons;
	    if(config.displayInfo){
            config.items.push('->');
            config.items.push(this.displayItem = new T.TextItem({}));
        }
	    Ext.PagingToolbar.superclass.constructor.apply(this, arguments);

        this.addEvents(
            /**
             * @event change
             * 当页数改变后触发。
             * Fires after the active page has been changed.
             * @param {Ext.PagingToolbar} this
             * @param {Object} changeEvent 携带以下属性的对象：An object that has these properties:<ul>
             * <li><code>total</code> : Number <div class="sub-desc">记录的总数，该值由服务端的真实数据集所返回。The total number of records in the dataset as
             * returned by the server</div></li>
             * <li><code>activePage</code> : Number <div class="sub-desc">当前页码 The current page number</div></li>
             * <li><code>pages</code> : Number <div class="sub-desc">总页数，该值是服务端数据集的真实总数，并设置到{@link #pageSize}。The total number of pages (calculated from
             * the total number of records in the dataset as returned by the server and the current {@link #pageSize})</div></li>
             * </ul>
             */
            'change',
            /**
             * @event beforechange
             * 当页数改变之前就触发。返回false就取消页数的变换。
             * Fires just before the active page is changed.
             * Return false to prevent the active page from being changed.
             * @param {Ext.PagingToolbar} this
             * @param {Object} beforeChangeEvent 携带以下属性的对象：An object that has these properties:<ul>
             * <li><code>start</code> : Number <div class="sub-desc">下一页将是从第几行的数据读起。The starting row number for the next page of records to
             * be retrieved from the server</div></li>
             * <li><code>limit</code> : Number <div class="sub-desc">从服务端取得的记录的笔数。The number of records to be retrieved from the server</div></li>
             * </ul>
             * （注意：属性<b>start</b>以及<b>limit</b>的名称均由store的{@link Ext.data.Store#paramNames paramNames}属性所决定。）
             * (note: the names of the <b>start</b> and <b>limit</b> properties are determined
             * by the store's {@link Ext.data.Store#paramNames paramNames} property.)
             */
            'beforechange'
        );

        this.cursor = 0;
        this.bind(this.store);
	},
    
    initComponent: function(){
        Ext.PagingToolbar.superclass.initComponent.call(this);
        this.on('afterlayout', this.onFirstLayout, this, {single: true});
    },

    // private
	onFirstLayout: function(ii) {
		this.mon(this.inputItem.el, "keydown", this.onPagingKeyDown, this);
		this.mon(this.inputItem.el, "blur", this.onPagingBlur, this);
		this.mon(this.inputItem.el, "focus", this.onPagingFocus, this);

        this.field = this.inputItem.el.dom;
        if(this.dsLoaded){
            this.onLoad.apply(this, this.dsLoaded);
        }
	},

    // private
    updateInfo : function(){
        if(this.displayItem){
            var count = this.store.getCount();
            var msg = count == 0 ?
                this.emptyMsg :
                String.format(
                    this.displayMsg,
                    this.cursor+1, this.cursor+count, this.store.getTotalCount()
                );
            this.displayItem.setText(msg);
        }
    },

    // private
    onLoad : function(store, r, o){
        if(!this.rendered){
            this.dsLoaded = [store, r, o];
            return;
        }
        this.cursor = (o.params && o.params[this.paramNames.start]) ? o.params[this.paramNames.start] : 0;
        var d = this.getPageData(), ap = d.activePage, ps = d.pages;

        this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
        this.field.value = ap;
        this.first.setDisabled(ap == 1);
        this.prev.setDisabled(ap == 1);
        this.next.setDisabled(ap == ps);
        this.last.setDisabled(ap == ps);
        this.refresh.enable();
        this.updateInfo();
        this.fireEvent('change', this, d);
    },

    // private
    getPageData : function(){
        var total = this.store.getTotalCount();
        return {
            total : total,
            activePage : Math.ceil((this.cursor+this.pageSize)/this.pageSize),
            pages :  total < this.pageSize ? 1 : Math.ceil(total/this.pageSize)
        };
    },

    /**
     * 改变活动的页码。
     * Change the active page
     * @param {Integer} page 要显示的页码。The page to display
     */
    changePage: function(page){
        this.doLoad(((page-1) * this.pageSize).constrain(0, this.store.getTotalCount()));
    },

    // private
    onLoadError : function(){
        if(!this.rendered){
            return;
        }
        this.refresh.enable();
    },

    // private
    readPage : function(d){
        var v = this.field.value, pageNum;
        if (!v || isNaN(pageNum = parseInt(v, 10))) {
            this.field.value = d.activePage;
            return false;
        }
        return pageNum;
    },
    
    onPagingFocus: function(){
        this.field.select();
    },

    //private
    onPagingBlur: function(e){
        this.field.value = this.getPageData().activePage;
    },

    // private
    onPagingKeyDown : function(e){
        var k = e.getKey(), d = this.getPageData(), pageNum;
        if (k == e.RETURN) {
            e.stopEvent();
            pageNum = this.readPage(d);
            if(pageNum !== false){
                pageNum = Math.min(Math.max(1, pageNum), d.pages) - 1;
                this.doLoad(pageNum * this.pageSize);
            }
        }else if (k == e.HOME || k == e.END){
            e.stopEvent();
            pageNum = k == e.HOME ? 1 : d.pages;
            this.field.value = pageNum;
        }else if (k == e.UP || k == e.PAGEUP || k == e.DOWN || k == e.PAGEDOWN){
            e.stopEvent();
            if(pageNum = this.readPage(d)){
                var increment = e.shiftKey ? 10 : 1;
                if(k == e.DOWN || k == e.PAGEDOWN){
                    increment *= -1;
                }
                pageNum += increment;
                if(pageNum >= 1 & pageNum <= d.pages){
                    this.field.value = pageNum;
                }
            }
        }
    },

    // private
    beforeLoad : function(){
        if(this.rendered && this.refresh){
            this.refresh.disable();
        }
    },

    // private
    doLoad : function(start){
        var o = {}, pn = this.paramNames;
        o[pn.start] = start;
        o[pn.limit] = this.pageSize;
        if(this.fireEvent('beforechange', this, o) !== false){
            this.store.load({params:o});
        }
    },

    // private
    onClick : function(button){
        var store = this.store;
        switch(button){
            case this.first:
                this.doLoad(0);
            break;
            case this.prev:
                this.doLoad(Math.max(0, this.cursor-this.pageSize));
            break;
            case this.next:
                this.doLoad(this.cursor+this.pageSize);
            break;
            case this.last:
                var total = store.getTotalCount();
                var extra = total % this.pageSize;
                var lastStart = extra ? (total - extra) : total-this.pageSize;
                this.doLoad(lastStart);
            break;
            case this.refresh:
                this.doLoad(this.cursor);
            break;
        }
    },

    /**
     * 从指定的{@link Ext.data.Store}数据源解除翻页工具栏绑定。
     * Unbinds the paging toolbar from the specified {@link Ext.data.Store}
     * @param {Ext.data.Store} store 要解除绑定的数据源。The data store to unbind
     */
    unbind : function(store){
        store = Ext.StoreMgr.lookup(store);
        store.un("beforeload", this.beforeLoad, this);
        store.un("load", this.onLoad, this);
        store.un("loadexception", this.onLoadError, this);
        this.store = undefined;
    },

    /**
     * 在数据源{@link Ext.data.Store}上绑定指定翻页工具栏。
     * Binds the paging toolbar to the specified {@link Ext.data.Store}
     * @param {Ext.data.Store} store 要绑定的数据源。The data store to bind
     */
    bind : function(store){
        store = Ext.StoreMgr.lookup(store);
        store.on("beforeload", this.beforeLoad, this);
        store.on("load", this.onLoad, this);
        store.on("loadexception", this.onLoadError, this);
        this.store = store;
        this.paramNames.start = store.paramNames.start;
        this.paramNames.limit = store.paramNames.limit;
        if (store.getCount() > 0){
            this.onLoad(store, null, {});
        }
    },

    // private
    onDestroy : function(){
        if(this.store){
            this.unbind(this.store);
        }
        Ext.PagingToolbar.superclass.onDestroy.call(this);
    }
});

})();
Ext.reg('paging', Ext.PagingToolbar);