/*
 * @version Sencha 1.0RC-1
 * @ignore
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */
 
/**
 * @class Ext.LoadMask
 * 一个简单的工具类，用于在加载数据时为元素做出类似于遮罩的效果。
 * 对于有可用的{@link Ext.data.Store}，可将效果与Store的加载达到同步，而mask本身会被缓存以备复用。
 * 而对于其他元素，这个遮照类会替换元素本身的UpdateManager加载指示器，并在初始化完毕后销毁。
 * A simple utility class for generically masking elements while loading data.  If the {@link #store}
 * config option is specified, the masking will be automatically synchronized with the store's loading
 * process and the mask element will be cached for reuse.  For all other elements, this mask will replace the
 * element's Updater load indicator and will be destroyed after the initial load.
 * <p>用法举例：Example usage:</p>
 *<pre><code>
// Basic mask:
var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
myMask.show();
</code></pre>
 * @constructor 创建新的LoadMask对象。Create a new LoadMask
 * @param {Mixed} el 元素、DOM节点或id。The element or DOM node, or its id
 * @param {Object} config 配置项对象。The config object
 */
Ext.LoadMask = Ext.extend(Ext.util.Observable, {

    /**
     * @cfg {Ext.data.Store} store
     * 可选地你可以为该蒙板绑定一个Store对象。当Store的load请求被发起就显示该蒙版，不论load成功或失败之后都隐藏该蒙板。
     * Optional Store to which the mask is bound. The mask is displayed when a load request is issued, and
     * hidden on either load sucess, or load fail.
     */

     
    /**
     * @cfg {String} msg
     * 加载信息中显示文字（默认为'Loading...'）。
     * The text to display in a centered loading message box (defaults to 'Loading...')
     */
    msg : 'Loading...',
    /**
     * @cfg {String} msgCls
     * 加载信息元素的样式（默认为"x-mask-loading"）。
     * The CSS class to apply to the loading message element (defaults to "x-mask-loading")
     */
    msgCls : 'x-mask-loading',

    /**
     * 只读的。True表示为mask已被禁止，所以不会显示出来（默认为false）。
     * Read-only. True if the mask is currently disabled so that it will not be displayed (defaults to false)
     * @type Boolean
     */
    disabled: false,
    
    constructor : function(el, config) {
        this.el = Ext.get(el);
        Ext.apply(this, config);
        
        this.addEvents('show', 'hide');
        if (this.store) {
            this.bindStore(this.store, true);
        }
        Ext.LoadMask.superclass.constructor.call(this);        
    },

    /**
     * 改变LoadMask所绑定的数据Store。
     * Changes the data store bound to this LoadMask.
     * @param {Store} store 要绑定到LoadMask的Store对象。The store to bind to this LoadMask
     */
    bindStore : function(store, initial) {
        if (!initial && this.store) {
            this.mun(this.store, {
                scope: this,
                beforeload: this.onBeforeLoad,
                load: this.onLoad,
                exception: this.onLoad
            });
            if(!store) {
                this.store = null;
            }
        }
        if (store) {
            store = Ext.StoreMgr.lookup(store);
            this.mon(store, {
                scope: this,
                beforeload: this.onBeforeLoad,
                load: this.onLoad,
                exception: this.onLoad
            });
            
        }
        this.store = store;
        if (store && store.isLoading()) {
            this.onBeforeLoad();
        }
    },

     /**
     * 禁用遮罩致使遮罩不会被显示。
     * Disables the mask to prevent it from being displayed
     */

    disable : function() {
       this.disabled = true;
    },

    /**
     * 启用遮罩以显示。
     * Enables the mask so that it can be displayed
     */
    enable : function() {
        this.disabled = false;
    },

    /**
     * 返回当前的LoadMask可否被禁止。
     * Method to determine whether this LoadMask is currently disabled.
     * @return {Boolean} 是否禁止。the disabled state of this LoadMask.
     */
    isDisabled : function() {
        return this.disabled;
    },
    
    // private
    onLoad : function() {
        this.el.unmask();
        this.fireEvent('hide', this, this.el, this.store);
    },

    // private
    onBeforeLoad : function() {
        if (!this.disabled) {
            this.el.mask(this.msg, this.msgCls, false);
            this.fireEvent('show', this, this.el, this.store);
        }
    },

    /**
     * 在已配置元素之前显示LoadMask。
     * Show this LoadMask over the configured Element.
     */
    show: function() {
        this.onBeforeLoad();
    },

    /**
     * 隐藏此LoadMask。
     * Hide this LoadMask.
     */

    hide: function() {
        this.onLoad();
    },

    // private
    destroy : function() {
        this.hide();
        this.clearListeners();
    }
});