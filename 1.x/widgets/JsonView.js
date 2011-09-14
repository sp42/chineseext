/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.JsonView
 * @extends Ext.View
 * 为了方便使用JSON+{@link Ext.UpdateManager}，而创建的一个模板视图类。用法：
<pre><code>
var view = new Ext.JsonView("my-element",
    '&lt;div id="{id}"&gt;{foo} - {bar}&lt;/div&gt;', // 自动创建模板
    { multiSelect: true, jsonRoot: "data" }
);

 //是否侦听节点的单击事件？
view.on("click", function(vw, index, node, e){
 	alert('点中节点"' + node.id + '" 位于索引：' + index + "。");
});

 // 直接加载JSON数据
view.load("foobar.php");

 // JACK博客上的范例
var tpl = new Ext.Template(
    '&lt;div class="entry"&gt;' +
    '&lt;a class="entry-title" href="{link}"&gt;{title}&lt;/a&gt;' +
    "&lt;h4&gt;{date} by {author} | {comments} Comments&lt;/h4&gt;{description}" +
    "&lt;/div&gt;&lt;hr /&gt;"
);

var moreView = new Ext.JsonView("entry-list", tpl, {
    jsonRoot: "posts"
});
moreView.on("beforerender", this.sortEntries, this);
moreView.load({
    url: "/blog/get-posts.php",
    params: "allposts=true",
    text: "Loading Blog Entries..."
});
</code></pre>
 * @constructor
 * 创建一个新的JSON视图（JSONView）
 * @param {String/HTMLElement/Element} container 渲染视图的容器元素。
 * @param {Template} tpl 渲染模板
 * @param {Object} config 配置项对象
 */
Ext.JsonView = function(container, tpl, config){
    Ext.JsonView.superclass.constructor.call(this, container, tpl, config);

    var um = this.el.getUpdateManager();
    um.setRenderer(this);
    um.on("update", this.onLoad, this);
    um.on("failure", this.onLoadException, this);

    /**
     * @event beforerender
     * JSON数据已加载好了，view渲染之前触发。
     * @param {Ext.JsonView} this
     * @param {Object} data 已加载好的JSON数据
     */
    /**
     * @event load
     * 当数据加载后触发。
     * @param {Ext.JsonView} this
     * @param {Object} data 已加载好的JSON数据
     * @param {Object} response 原始的连接对象（从服务区响应回来的）
     */
    /**
     * @event loadexception
     * 当加载失败时触发。
     * @param {Ext.JsonView} this
     * @param {Object} response 原始的连接对象（从服务区响应回来的）
     */
    this.addEvents({
        'beforerender' : true,
        'load' : true,
        'loadexception' : true
    });
};
Ext.extend(Ext.JsonView, Ext.View, {
    /**
     * 包含数据的 JSON 对象的根属性
     * @type {String}
     */
    jsonRoot : "",

    /**
     * 刷新 view
     */
    refresh : function(){
        this.clearSelections();
        this.el.update("");
        var html = [];
        var o = this.jsonData;
        if(o && o.length > 0){
            for(var i = 0, len = o.length; i < len; i++){
                var data = this.prepareData(o[i], i, o);
                html[html.length] = this.tpl.apply(data);
            }
        }else{
            html.push(this.emptyText);
        }
        this.el.update(html.join(""));
        this.nodes = this.el.dom.childNodes;
        this.updateIndexes(0);
    },

    /**
     * 发起一个异步的 HTTP 请求,然后得到 JSON 的响应.如不指定<i>params</i> 则使用 POST, 否则就是 GET. 
     * @param {Object/String/Function} 该请求的 URL, 或是可返回 URL 的函数,也可是包含下列选项的配置项对象：
     <pre><code>
     view.load({
         url: "your-url.php",
         params: {param1: "foo", param2: "bar"}, // 或是可URL编码的字符串
         callback: yourFunction,
         scope: yourObject, //（作用域可选）
         discardUrl: false,
         nocache: false,
         text: "加载中...",
         timeout: 30,
         scripts: false
     });
     </code></pre>
     * 只有url的属性是必须的。可选属性有nocache, text and scripts，分别是disableCaching，indicatorText和loadScripts的简写方式
     * 它们用于设置UpdateManager实例相关的属性。
     * @param {String/Object} params（可选的）作为url一部分的参数，可以是已编码的字符串"param1=1&amp;param2=2"，或是一个对象{param1: 1, param2: 2}
     * @param {Function} callback （可选的）请求往返完成后的回调，调用时有参数(oElement, bSuccess)
     * @param {Boolean} discardUrl （可选的）默认情况下你执行一次更新后，最后一次url会保存到defaultUrl。如果true的话，将不会保存。
     */
    load : function(){
        var um = this.el.getUpdateManager();
        um.update.apply(um, arguments);
    },

    render : function(el, response){
        this.clearSelections();
        this.el.update("");
        var o;
        try{
            o = Ext.util.JSON.decode(response.responseText);
            if(this.jsonRoot){
                o = eval("o." + this.jsonRoot);
            }
        } catch(e){
        }
        /**
         * 当前的JSON数据或是null
         */
        this.jsonData = o;
        this.beforeRender();
        this.refresh();
    },

/**
 * 获取当前JSON数据集的总记录数
 * @return {Number}
 */
    getCount : function(){
        return this.jsonData ? this.jsonData.length : 0;
    },

/**
 * 指定一个或多个节点返回JSON对象
 * @param {HTMLElement/Array} 节点或节点组成的数组
 * @return {Object/Array} 如果传入的参数是数组的类型,返回的也是一个数组，反之
 * 你得到是节点的 JSON 对象
 */
    getNodeData : function(node){
        if(node instanceof Array){
            var data = [];
            for(var i = 0, len = node.length; i < len; i++){
                data.push(this.getNodeData(node[i]));
            }
            return data;
        }
        return this.jsonData[this.indexOf(node)] || null;
    },

    beforeRender : function(){
        this.snapshot = this.jsonData;
        if(this.sortInfo){
            this.sort.apply(this, this.sortInfo);
        }
        this.fireEvent("beforerender", this, this.jsonData);
    },

    onLoad : function(el, o){
        this.fireEvent("load", this, this.jsonData, o);
    },

    onLoadException : function(el, o){
        this.fireEvent("loadexception", this, o);
    },

/**
 * 指定某个属性,进行数据筛选
 * @param {String} 指定JSON对象的某个属性
 * @param {String/RegExp} value 既可是属性值的字符串，也可是用来查找属性的正则表达式。
 */
    filter : function(property, value){
        if(this.jsonData){
            var data = [];
            var ss = this.snapshot;
            if(typeof value == "string"){
                var vlen = value.length;
                if(vlen == 0){
                    this.clearFilter();
                    return;
                }
                value = value.toLowerCase();
                for(var i = 0, len = ss.length; i < len; i++){
                    var o = ss[i];
                    if(o[property].substr(0, vlen).toLowerCase() == value){
                        data.push(o);
                    }
                }
            } else if(value.exec){ // regex?
                for(var i = 0, len = ss.length; i < len; i++){
                    var o = ss[i];
                    if(value.test(o[property])){
                        data.push(o);
                    }
                }
            } else{
                return;
            }
            this.jsonData = data;
            this.refresh();
        }
    },

/**
 * 指定一个函数,进行数据筛选。该函数会被当前数据集中的每个对象调用。
 * 若函数返回true值,记录值会被保留,否则会被过滤掉,
 * otherwise it is filtered.
 * @param {Function} fn
 * @param {Object} scope (optional) 函数的作用域（默认为JsonView）
 */
    filterBy : function(fn, scope){
        if(this.jsonData){
            var data = [];
            var ss = this.snapshot;
            for(var i = 0, len = ss.length; i < len; i++){
                var o = ss[i];
                if(fn.call(scope || this, o)){
                    data.push(o);
                }
            }
            this.jsonData = data;
            this.refresh();
        }
    },

/**
 * 清除当前的筛选
 */
    clearFilter : function(){
        if(this.snapshot && this.jsonData != this.snapshot){
            this.jsonData = this.snapshot;
            this.refresh();
        }
    },


/**
 * 对当前的view进行数据排序并刷新
 * @param {String} 要排序的那个JSON对象上的属性
 * @param {String} (可选的)"升序(desc)"或"降序"(asc)
 * @param {Function} 该函数负责将数据转换到可排序的值
 */
    sort : function(property, dir, sortType){
        this.sortInfo = Array.prototype.slice.call(arguments, 0);
        if(this.jsonData){
            var p = property;
            var dsc = dir && dir.toLowerCase() == "desc";
            var f = function(o1, o2){
                var v1 = sortType ? sortType(o1[p]) : o1[p];
                var v2 = sortType ? sortType(o2[p]) : o2[p];
                ;
                if(v1 < v2){
                    return dsc ? +1 : -1;
                } else if(v1 > v2){
                    return dsc ? -1 : +1;
                } else{
                    return 0;
                }
            };
            this.jsonData.sort(f);
            this.refresh();
            if(this.jsonData != this.snapshot){
                this.snapshot.sort(f);
            }
        }
    }
});