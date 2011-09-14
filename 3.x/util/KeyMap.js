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
 * @class Ext.KeyMap
 * Ext.KeyMap类负责在某一元素上，键盘和用户动作（Actions）之间的映射。
 * 构建器可接收由{@link #addBinding}定义的相同配置项对象。
 * 如果你绑定了一个KeyMap的回调函数,KeyMap会在该回调函数上提供下列参数（String key, Ext.EventObject e）
 * 如果匹配的是组合键，回调函数也只会执行一次）
 * KepMap能够实现以字符串来表示key<br />
 * 一个key可用于多个动作。
 * 用法：
 <pre><code>
 // 映射key（由keycode指定）
 var map = new Ext.KeyMap("my-element", {
     key: 13, // 或者是 Ext.EventObject.ENTER
     fn: myHandler,
     scope: myObject
 });

 // 映射组合键（由字符串指定）
 var map = new Ext.KeyMap("my-element", {
     key: "a\r\n\t",
     fn: myHandler,
     scope: myObject
 });

 // 映射多个动作的组合键（由字符串和code数组指定）
 var map = new Ext.KeyMap("my-element", [
    {
        key: [10,13],
        fn: function(){ alert("Return was pressed"); }
    }, {
        key: "abc",
        fn: function(){ alert('a, b or c was pressed'); }
    }, {
        key: "\t",
        ctrl:true,
        shift:true,
        fn: function(){ alert('Control + shift + tab was pressed.'); }
    }
]);
</code></pre>
 * <b>一个KeyMap开始激活</b>
 * @constructor
 * @param {Mixed} el 绑定的元素
 * @param {Object} config T配置项
 * @param {String} eventName （可选地）绑定的事件（默认“keydown”）
 */
Ext.KeyMap = function(el, config, eventName){
    this.el  = Ext.get(el);
    this.eventName = eventName || "keydown";
    this.bindings = [];
    if(config){
        this.addBinding(config);
    }
    this.enable();
};

Ext.KeyMap.prototype = {
    /**
     * 如果让KeyMap来处理key，设置true的话，则停止事件上报（event from bubbling），并阻拦默认浏览器动作（默认为false）
     * @type Boolean
     */
    stopEvent : false,

   /**
     * 新增该KeyMap的新绑定。下列配置项（对象的属性）均被支持：
     * <pre>
属性    类型             描述
----------  ---------------  ----------------------------------------------------------------------
key         String/Array      进行处理的单个keycode或keycodes组成的数组
shift       Boolean           True：只有shift按下的的同时处理key （默认false）
ctrl        Boolean           True：只有ctrl按下的的同时处理key （默认false）
handler     Function          当KeyMap找到预期的组合键时所执行的函数
alt         Boolean           True：只有alt按下的的同时处理key （默认false）
fn          Function          当组合键按下后回调函数
scope       Object            回调函数的作用域
</pre>
     *
     * 用法：
     * <pre><code>
// 创建一个KeyMap
var map = new Ext.KeyMap(document, {
    key: Ext.EventObject.ENTER,
    fn: handleKey,
    scope: this
});

//对现有的KeyMap延迟再绑定
map.addBinding({
    key: 'abc',
    shift: true,
    fn: handleKey,
    scope: this
});
</code></pre>
     * @param {Object} config 单个KeyMap配置
     */
	addBinding : function(config){
        if(config instanceof Array){
            for(var i = 0, len = config.length; i < len; i++){
                this.addBinding(config[i]);
            }
            return;
        }
        var keyCode = config.key,
            shift = config.shift,
            ctrl = config.ctrl,
            alt = config.alt,
            fn = config.fn || config.handler,
            scope = config.scope;
        if(typeof keyCode == "string"){
            var ks = [];
            var keyString = keyCode.toUpperCase();
            for(var j = 0, len = keyString.length; j < len; j++){
                ks.push(keyString.charCodeAt(j));
            }
            keyCode = ks;
        }
        var keyArray = keyCode instanceof Array;
        var handler = function(e){
            if((!shift || e.shiftKey) && (!ctrl || e.ctrlKey) &&  (!alt || e.altKey)){
                var k = e.getKey();
                if(keyArray){
                    for(var i = 0, len = keyCode.length; i < len; i++){
                        if(keyCode[i] == k){
                          if(this.stopEvent){
                              e.stopEvent();
                          }
                          fn.call(scope || window, k, e);
                          return;
                        }
                    }
                }else{
                    if(k == keyCode){
                        if(this.stopEvent){
                           e.stopEvent();
                        }
                        fn.call(scope || window, k, e);
                    }
                }
            }
        };
        this.bindings.push(handler);
	},

    /**
     * 加入单个键侦听器的简写方式
     * @param {Number/Array/Object} key 既可是key code，也可以是key codes的集合，或者是下列的对象
     * {key: (number or array), shift: (true/false), ctrl: (true/false), alt: (true/false)}
     * @param {Function} fn 调用的函数
     * @param {Object} scope (optional) 函数的作用域
     */
    on : function(key, fn, scope){
        var keyCode, shift, ctrl, alt;
        if(typeof key == "object" && !(key instanceof Array)){
            keyCode = key.key;
            shift = key.shift;
            ctrl = key.ctrl;
            alt = key.alt;
        }else{
            keyCode = key;
        }
        this.addBinding({
            key: keyCode,
            shift: shift,
            ctrl: ctrl,
            alt: alt,
            fn: fn,
            scope: scope
        })
    },

    // private
    handleKeyDown : function(e){
	    if(this.enabled){ //以防万一
    	    var b = this.bindings;
    	    for(var i = 0, len = b.length; i < len; i++){
    	        b[i].call(this, e);
    	    }
	    }
	},

	/**
	 KeyMap是已激活的话返回true
	 * @return {Boolean}
	 */
	isEnabled : function(){
	    return this.enabled;
	},

	/**
	 * 激活KeyMap
	 */
	enable: function(){
		if(!this.enabled){
		    this.el.on(this.eventName, this.handleKeyDown, this);
		    this.enabled = true;
		}
	},

	/**
	 * 禁止该KeyMap
	 */
	disable: function(){
		if(this.enabled){
		    this.el.removeListener(this.eventName, this.handleKeyDown, this);
		    this.enabled = false;
		}
	}
};