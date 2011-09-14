/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.dd.Registry
 * 为在页面上已登记好的拖放组件提供简易的访问。
 * 可按照DOM节点的id的方式直接提取组件，或者是按照传入的拖放事件，事件触发后，在事件目标（event target）里查找。
 * @singleton
 */
Ext.dd.Registry = function(){
    var elements = {}; 
    var handles = {}; 
    var autoIdSeed = 0;

    var getId = function(el, autogen){
        if(typeof el == "string"){
            return el;
        }
        var id = el.id;
        if(!id && autogen !== false){
            id = "extdd-" + (++autoIdSeed);
            el.id = id;
        }
        return id;
    };
    
    return {
    /**
     * 登记一个拖放元素
     * @param {String/HTMLElement) element 要登记的id或DOM节点
     * @param {Object} data (optional) 在拖放过程中，用于在各元素传递的这么一个自定义数据对象
     * 你可以按自身需求定义这个对象，另外有些特定的属性是便于与Registry交互的（如可以的话）：
     * <pre>
值         描述<br />
---------  ------------------------------------------<br />
handles    由DOM节点组成的数组，即被拖动元素，都是已登记好的<br />
isHandle   True表示元素传入后已是翻转的拖动本身，否则false<br />
</pre>
     */
        register : function(el, data){
            data = data || {};
            if(typeof el == "string"){
                el = document.getElementById(el);
            }
            data.ddel = el;
            elements[getId(el)] = data;
            if(data.isHandle !== false){
                handles[data.ddel.id] = data;
            }
            if(data.handles){
                var hs = data.handles;
                for(var i = 0, len = hs.length; i < len; i++){
                	handles[getId(hs[i])] = data;
                }
            }
        },

    /**
     * 注销一个拖放元素
     * @param {String/HTMLElement) element 要注销的id或DOM节点
     */
        unregister : function(el){
            var id = getId(el, false);
            var data = elements[id];
            if(data){
                delete elements[id];
                if(data.handles){
                    var hs = data.handles;
                    for(var i = 0, len = hs.length; i < len; i++){
                    	delete handles[getId(hs[i], false)];
                    }
                }
            }
        },

    /**
     * 按id返回已登记的DOM节点处理
     * @param {String/HTMLElement} id 要查找的id或DOM节点
     * @return {Object} handle 自定义处理数据
     */
        getHandle : function(id){
            if(typeof id != "string"){ // 规定是元素?
            
                id = id.id;
            }
            return handles[id];
        },

    /**
     * 按事件目标返回已登记的DOM节点处理
     * @param {Event} e 事件对象
     * @return {Object} handle 自定义处理数据
     */
        getHandleFromEvent : function(e){
            var t = Ext.lib.Event.getTarget(e);
            return t ? handles[t.id] : null;
        },

    /**
     * 按id返回已登记的自定义处理对象
     * @param {String/HTMLElement} id 要查找的id或DOM节点
     * @return {Object} handle 自定义处理数据
     */
        getTarget : function(id){
            if(typeof id != "string"){ // 规定是元素?
                id = id.id;
            }
            return elements[id];
        },

    /**
     * 按事件目标返回已登记的自定义处理对象
     * @param {Event} e 事件对象
     * @return {Object} handle 自定义处理数据
     */
        getTargetFromEvent : function(e){
            var t = Ext.lib.Event.getTarget(e);
            return t ? elements[t.id] || handles[t.id] : null;
        }
    };
}();