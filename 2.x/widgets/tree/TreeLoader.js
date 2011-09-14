/**
 * @class Ext.tree.TreeLoader
 * @extends Ext.util.Observable
 * 树加载器（TreeLoader）的目的是从URL延迟加载树节点{@link Ext.tree.TreeNode}的子节点。
 * 返回值必须是以树格式的javascript数组。
 * 例如:
 * <pre><code>
    [{
        id: 1,
        text: 'A leaf Node',
        leaf: true
    },{
        id: 2,
        text: 'A folder Node',
        children: [{
            id: 3,
            text: 'A child Node',
            leaf: true
        }]
   }]
</code></pre>
 * <br><br>
 * 向服务端发送请求后，只有当展开时才会读取子节点信息。
 * 需要取值的节点id被传到服务端并用于产生正确子节点。
 * <br><br>
 * 当需要传递更多的参数时，可以把一个事件句柄邦定在"beforeload"事件上，
 * 然后把数据放到TreeLoader的baseParams属性上：
 * <pre><code>
    myTreeLoader.on("beforeload", function(treeLoader, node) {
        this.baseParams.category = node.attributes.category;
    }, this);
</code></pre>
 * 如上代码，将会传递一个该节点的，名为"category"的参数到服务端上。
 * @constructor
 * 创建一个Treeloader
 * @param {Object} config 该Treeloader的配置属性。
 */
Ext.tree.TreeLoader = function(config){
    this.baseParams = {};
    Ext.apply(this, config);

    this.addEvents(
        /**
         * @event beforeload
         * 在为子节点获取JSON文本进行网路请求之前触发。
         * @param {Object} 本TreeLoader对象
         * @param {Object} node 已加载好的{@link Ext.tree.TreeNode}的对象
         * @param {Object} callback 在{@link #load}调用中指定的回调函数
         */
        "beforeload",
        /**
         * @event load
         * 当节点加载成功时触发。
         * @param {Object} 本TreeLoader对象
         * @param {Object} node 已加载好的{@link Ext.tree.TreeNode}的对象
         * @param {Object} response 服务器响应的数据对象         
         */
        "load",
        /**
         * @event loadexception
         * 当网路连接失败时触发
         * @param {Object} 本TreeLoader对象
         * @param {Object} node 已加载好的{@link Ext.tree.TreeNode}的对象
         * @param {Object} response 服务器响应的数据对象
         */
        "loadexception"
    );

    Ext.tree.TreeLoader.superclass.constructor.call(this);
};

Ext.extend(Ext.tree.TreeLoader, Ext.util.Observable, {
    /**
    * @cfg {String} dataUrl 进行请求的URL。
    */
    /**
     * @cfg {String} requestMethod 下载数据的HTTP请求方法（默认{@link Ext.Ajax#method}的值）。
     */
    /**
     * @cfg {String} url 相当于{@link #dataUrl}.
     */
    /**
     * @cfg {Boolean} preloadChildren 若为true，则loader在节点第一次访问时加载"children"的属性。
     */
    /**
    * @cfg {Object} baseParams (可选) 一个分别对每个节点进行参数传递的集合对象。
    */
    /**
    * @cfg {Object} baseAttrs (可选) 一个对所有节点进行参数传递的集合对象。如果已经传递这个参数了，则他们优先。
    */
    /**
    * @cfg {Object} uiProviders (可选) 一个针对制定节点 {@link Ext.tree.TreeNodeUI} 进行参数传递的集合对象。
    * 如果传入了该<i>uiProvider</i>参数，返回string而非TreeNodeUI对象
    */	
    uiProviders : {},

    /**
    * @cfg {Boolean} clearOnLoad (可选) 默认为true。 在读取数据前移除已存在的节点。
    */  
    clearOnLoad : true,

    /**
     * 从URL中读取树节点 {@link Ext.tree.TreeNode}。
     * 本函数在节点展开时自动调用，但也可以被用于reload节点。（或是在{@link #clearOnLoad}属性为false时增加新节点）
     * @param {Ext.tree.TreeNode} node
     * @param {Function} callback
     */     
    load : function(node, callback){
        if(this.clearOnLoad){
            while(node.firstChild){
                node.removeChild(node.firstChild);
            }
        }
        if(this.doPreload(node)){ // preloaded json children
            if(typeof callback == "function"){
                callback();
            }
        }else if(this.dataUrl||this.url){
            this.requestData(node, callback);
        }
    },

    doPreload : function(node){
        if(node.attributes.children){
            if(node.childNodes.length < 1){ // preloaded?
                var cs = node.attributes.children;
                node.beginUpdate();
                for(var i = 0, len = cs.length; i < len; i++){
                    var cn = node.appendChild(this.createNode(cs[i]));
                    if(this.preloadChildren){
                        this.doPreload(cn);
                    }
                }
                node.endUpdate();
            }
            return true;
        }else {
            return false;
        }
    },

    getParams: function(node){
        var buf = [], bp = this.baseParams;
        for(var key in bp){
            if(typeof bp[key] != "function"){
                buf.push(encodeURIComponent(key), "=", encodeURIComponent(bp[key]), "&");
            }
        }
        buf.push("node=", encodeURIComponent(node.id));
        return buf.join("");
    },

    requestData : function(node, callback){
        if(this.fireEvent("beforeload", this, node, callback) !== false){
            this.transId = Ext.Ajax.request({
                method:this.requestMethod,
                url: this.dataUrl||this.url,
                success: this.handleResponse,
                failure: this.handleFailure,
                scope: this,
                argument: {callback: callback, node: node},
                params: this.getParams(node)
            });
        }else{
            // if the load is cancelled, make sure we notify
            // the node that we are done
            if(typeof callback == "function"){
                callback();
            }
        }
    },

    isLoading : function(){
        return this.transId ? true : false;
    },

    abort : function(){
        if(this.isLoading()){
            Ext.Ajax.abort(this.transId);
        }
    },

    /**
    * 自定义节点覆盖此方法
    */
    createNode : function(attr){
        // apply baseAttrs, nice idea Corey!
        if(this.baseAttrs){
            Ext.applyIf(attr, this.baseAttrs);
        }
        if(this.applyLoader !== false){
            attr.loader = this;
        }
        if(typeof attr.uiProvider == 'string'){
           attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider);
        }
        return(attr.leaf ?
                        new Ext.tree.TreeNode(attr) :
                        new Ext.tree.AsyncTreeNode(attr));
    },

    processResponse : function(response, node, callback){
        var json = response.responseText;
        try {
            var o = eval("("+json+")");
            node.beginUpdate();
            for(var i = 0, len = o.length; i < len; i++){
                var n = this.createNode(o[i]);
                if(n){
                    node.appendChild(n);
                }
            }
            node.endUpdate();
            if(typeof callback == "function"){
                callback(this, node);
            }
        }catch(e){
            this.handleFailure(response);
        }
    },

    handleResponse : function(response){
        this.transId = false;
        var a = response.argument;
        this.processResponse(response, a.node, a.callback);
        this.fireEvent("load", this, a.node, response);
    },

    handleFailure : function(response){
        this.transId = false;
        var a = response.argument;
        this.fireEvent("loadexception", this, a.node, response);
        if(typeof a.callback == "function"){
            a.callback(this, a.node);
        }
    }
});