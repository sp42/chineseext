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
 * @class Ext.tree.TreeLoader
 * @extends Ext.util.Observable
 * 树加载器（TreeLoader）的目的是从URL延迟加载树节点{@link Ext.tree.TreeNode}的子节点。
 * 返回值必须是以树格式的javascript数组。例如:<br />
 * A TreeLoader provides for lazy loading of an {@link Ext.tree.TreeNode}'s child
 * nodes from a specified URL. The response must be a JavaScript Array definition
 * whose elements are node definition objects. eg:
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
 * 向服务端发送请求后，只有当展开时才会读取子节点信息。需要取值的节点id被传到服务端并用于产生正确子节点。<br />
 * A server request is sent, and child nodes are loaded only when a node is expanded.
 * The loading node's id is passed to the server under the parameter name "node" to
 * enable the server to produce the correct child nodes.
 * <br><br>
 * 当需要传递更多的参数时，可以把一个事件句柄邦定在"beforeload"事件上，然后把数据放到TreeLoader的baseParams属性上：<br />
 * To pass extra parameters, an event handler may be attached to the "beforeload"
 * event, and the parameters specified in the TreeLoader's baseParams property:
 * <pre><code>
    myTreeLoader.on("beforeload", function(treeLoader, node) {
        this.baseParams.category = node.attributes.category;
    }, this);
</code></pre>
 * 如上代码，将会传递一个该节点的，名为"category"的参数到服务端上。<br />
 * This would pass an HTTP parameter called "category" to the server containing
 * the value of the Node's "category" attribute.
 * @constructor 创建一个Treeloader。Creates a new Treeloader.
 * @param {Object} config 该Treeloader的配置属性。A config object containing config properties.
 */
Ext.tree.TreeLoader = function(config){
    this.baseParams = {};
    Ext.apply(this, config);

    this.addEvents(
        /**
         * @event beforeload
         * 在为子节点获取JSON文本进行网路请求之前触发。
         * Fires before a network request is made to retrieve the Json text which specifies a node's children.
         * @param {Object} tree 本TreeLoader对象。This TreeLoader object.
         * @param {Object} node 已加载好的{@link Ext.tree.TreeNode}的对象。The {@link Ext.tree.TreeNode} object being loaded.
         * @param {Object} callback 在{@link #load}调用中指定的回调函数。The callback function specified in the {@link #load} call.
         */
        "beforeload",
        /**
         * @event load
         * 当节点加载成功时触发。
         * Fires when the node has been successfuly loaded.
         * @param {Object} tree 本TreeLoader对象。This TreeLoader object.
         * @param {Object} node 已加载好的{@link Ext.tree.TreeNode}的对象。The {@link Ext.tree.TreeNode} object being loaded.
         * @param {Object} response 服务器响应的数据对象。The response object containing the data from the server.
         */
        "load",
        /**
         * @event loadexception
         * 当网路连接失败时触发。
         * Fires if the network request failed.
         * @param {Object} tree 本TreeLoader对象。This TreeLoader object.
         * @param {Object} node 已加载好的{@link Ext.tree.TreeNode}的对象。The {@link Ext.tree.TreeNode} object being loaded.
         * @param {Object} response 服务器响应的数据对象。The response object containing the data from the server.
         */
        "loadexception"
    );

    Ext.tree.TreeLoader.superclass.constructor.call(this);
};

Ext.extend(Ext.tree.TreeLoader, Ext.util.Observable, {
    /**
    * @cfg {String} dataUrl 进行请求的URL。URL处返回节点对象的序列，表示要加载的子节点。
    * The URL from which to request a Json string which
    * specifies an array of node definition objects representing the child nodes
    * to be loaded.
    */
    /**
     * @cfg {String} requestMethod 下载数据的HTTP请求方法（默认{@link Ext.Ajax#method}的值）。
     * The HTTP request method for loading data (defaults to the value of {@link Ext.Ajax#method}).
     */
    /**
     * @cfg {String} url 相当于{@link #dataUrl}。
     * Equivalent to {@link #dataUrl}.
     */
    /**
     * @cfg {Boolean} preloadChildren 若为true，则loader在节点第一次访问时加载"children"的属性。
     * If set to true, the loader recursively loads "children" attributes when doing the first load on nodes.
     */
    /**
    * @cfg {Object} baseParams （可选的）一个分别对每个节点进行参数传递的集合对象。
    * (optional) An object containing properties which
    * specify HTTP parameters to be passed to each request for child nodes.
    */
    /**
    * @cfg {Object} baseAttrs （可选）一个对所有节点进行参数传递的集合对象。如果已经传递这个参数了，则他们优先。
    * (optional)An object containing attributes to be added to all nodes
    * created by this loader. If the attributes sent by the server have an attribute in this object,
    * they take priority.
    */
    /**
    * @cfg {Object} uiProviders （可选的）一个针对制定节点{@link Ext.tree.TreeNodeUI}进行参数传递的集合对象。
    * 如果传入了该<i>uiProvider</i>参数，返回string而非TreeNodeUI对象。
    * (optional) An object containing properties which
    * specify custom {@link Ext.tree.TreeNodeUI} implementations. If the optional
    * <i>uiProvider</i> attribute of a returned child node is a string rather
    * than a reference to a TreeNodeUI implementation, then that string value
    * is used as a property name in the uiProviders object.
    */
    uiProviders : {},

    /**
    * @cfg {Boolean} clearOnLoad （可选）默认为true。在读取数据前移除已存在的节点。
    * (optional) Default to true. Remove previously existing
    * child nodes before loading.
    */
    clearOnLoad : true,

    /**
     * 从URL中读取树节点{@link Ext.tree.TreeNode}。
     * 本函数在节点展开时自动调用，但也可以被用于reload节点（或是在{@link #clearOnLoad}属性为false时增加新节点）。
     * Load an {@link Ext.tree.TreeNode} from the URL specified in the constructor.
     * This is called automatically when a node is expanded, but may be used to reload
     * a node (or append new children if the {@link #clearOnLoad} option is false.)
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
        return !!this.transId;
    },

    abort : function(){
        if(this.isLoading()){
            Ext.Ajax.abort(this.transId);
        }
    },

    /**
    * <p>
    * 覆盖此函数以自定义TreeNode的节点，或在创建的时刻修改节点的属性
    * Override this function for custom TreeNode node implementation, or to
    * modify the attributes at creation time.</p>
    * Example:<code><pre>
new Ext.tree.TreePanel({
    ...
    new Ext.tree.TreeLoader({
        url: 'dataUrl',
        createNode: function(attr) {
//        	允许合并项用拖动就可两项合并在一起
//          Allow consolidation consignments to have
//          consignments dropped into them.
            if (attr.isConsolidation) {
                attr.iconCls = 'x-consol',
                attr.allowDrop = true;
            }
            return Ext.tree.TreeLoader.prototype.call(this, attr);
        }
    }),
    ...
});
</pre></code>
    * @param {Object} attr 创建新节点的属性。The attributes from which to create the new node.
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
        if(attr.nodeType){
            return new Ext.tree.TreePanel.nodeTypes[attr.nodeType](attr);
        }else{
            return attr.leaf ?
                        new Ext.tree.TreeNode(attr) :
                        new Ext.tree.AsyncTreeNode(attr);
        }
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