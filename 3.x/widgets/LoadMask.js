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
Ext.LoadMask = function(el, config){
    this.el = Ext.get(el);
    Ext.apply(this, config);
    if(this.store){
        this.store.on('beforeload', this.onBeforeLoad, this);
        this.store.on('load', this.onLoad, this);
        this.store.on('loadexception', this.onLoad, this);
        this.removeMask = Ext.value(this.removeMask, false);
    }else{
        var um = this.el.getUpdater();
        um.showLoadIndicator = false; // disable the default indicator
        um.on('beforeupdate', this.onBeforeLoad, this);
        um.on('update', this.onLoad, this);
        um.on('failure', this.onLoad, this);
        this.removeMask = Ext.value(this.removeMask, true);
    }
};

Ext.LoadMask.prototype = {
    /**
     * @cfg {Ext.data.Store} store
     * 可选地你可以为该蒙板绑定一个Store对象。当Store的load请求被发起就显示该蒙版，不论load成功或失败之后都隐藏该蒙板。
     * Optional Store to which the mask is bound. The mask is displayed when a load request is issued, and
     * hidden on either load sucess, or load fail.
     */
    /**
     * @cfg {Boolean} removeMask True表示为一次性使用，即加载之后自动销毁（页面加载时有用），false表示为多次使用模版效果，保留这个mask（例如，页面上数据的加载）。默认为false。
     * True to create a single-use mask that is automatically destroyed after loading (useful for page loads),
     * False to persist the mask element reference for multiple uses (e.g., for paged data widgets).  Defaults to false.
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

    /**
     * 禁用遮罩致使遮罩不会被显示。
     * Disables the mask to prevent it from being displayed
     */
    disable : function(){
       this.disabled = true;
    },

    /**
     * 启用遮罩以显示。
     * Enables the mask so that it can be displayed
     */
    enable : function(){
        this.disabled = false;
    },

    // private
    onLoad : function(){
        this.el.unmask(this.removeMask);
    },

    // private
    onBeforeLoad : function(){
        if(!this.disabled){
            this.el.mask(this.msg, this.msgCls);
        }
    },

    /**
     * 在已配置元素之前显示LoadMask。
     * Show this LoadMask over the configured Element.
     */
    show: function(){
        this.onBeforeLoad();
    },

    /**
     * 隐藏此LoadMask。
     * Hide this LoadMask.
     */
    hide: function(){
        this.onLoad();    
    },

    // private
    destroy : function(){
        if(this.store){
            this.store.un('beforeload', this.onBeforeLoad, this);
            this.store.un('load', this.onLoad, this);
            this.store.un('loadexception', this.onLoad, this);
        }else{
            var um = this.el.getUpdater();
            um.un('beforeupdate', this.onBeforeLoad, this);
            um.un('update', this.onLoad, this);
            um.un('failure', this.onLoad, this);
        }
    }
};