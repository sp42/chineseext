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
 * @class Ext.state.Provider
 * 为State Provider的实现提供一个抽象基类。
 * 该类对某些类型的变量提供了编码、解码方法，包括日期和定义Provider的接口。
 */
Ext.state.Provider = function(){
    /**
     * @event statechange
     * 当state发生改变时触发
     * @param {Provider} this 该state提供者
     * @param {String} key 已改名的那个键
     * @param {String} value 已编码的state值
     */
    this.addEvents({
        "statechange": true
    });
    this.state = {};
    Ext.state.Provider.superclass.constructor.call(this);
};
Ext.extend(Ext.state.Provider, Ext.util.Observable, {
    /**
     * 返回当前的键值（value for a key）
     * @param {String} name 键名称
     * @param {Mixed} defaultValue 若键值找不到的情况下，返回的默认值
     * @return {Mixed} State数据
     */
    get : function(name, defaultValue){
        return typeof this.state[name] == "undefined" ?
            defaultValue : this.state[name];
    },

    /**
     * 清除某个state的值
     * @param {String} name 键名称
     */
    clear : function(name){
        delete this.state[name];
        this.fireEvent("statechange", this, name, null);
    },

    /**
     * 设置键值
     * @param {String} name 键名称
     * @param {Mixed} value 设置值
     */
    set : function(name, value){
        this.state[name] = value;
        this.fireEvent("statechange", this, name, value);
    },

    /**
     * 对之前用过的 {@link #encodeValue}字符串解码。
     * @param {String} value 要解码的值
     * @return {Mixed} 已解码的值
     */
    decodeValue : function(cookie){
        var re = /^(a|n|d|b|s|o)\:(.*)$/;
        var matches = re.exec(unescape(cookie));
        if(!matches || !matches[1]) return; // non state cookie
        var type = matches[1];
        var v = matches[2];
        switch(type){
            case "n":
                return parseFloat(v);
            case "d":
                return new Date(Date.parse(v));
            case "b":
                return (v == "1");
            case "a":
                var all = [];
                var values = v.split("^");
                for(var i = 0, len = values.length; i < len; i++){
                    all.push(this.decodeValue(values[i]));
                }
                return all;
           case "o":
                var all = {};
                var values = v.split("^");
                for(var i = 0, len = values.length; i < len; i++){
                    var kv = values[i].split("=");
                    all[kv[0]] = this.decodeValue(kv[1]);
                }
                return all;
           default:
                return v;
        }
    },

    /**
     * 针对某些类型的编码，可用 {@link #decodeValue}解码。
     * @param {Mixed} value 要编码的值
     * @return {String} 以编码值
     */
    encodeValue : function(v){
        var enc;
        if(typeof v == "number"){
            enc = "n:" + v;
        }else if(typeof v == "boolean"){
            enc = "b:" + (v ? "1" : "0");
        }else if(v instanceof Date){
            enc = "d:" + v.toGMTString();
        }else if(v instanceof Array){
            var flat = "";
            for(var i = 0, len = v.length; i < len; i++){
                flat += this.encodeValue(v[i]);
                if(i != len-1) flat += "^";
            }
            enc = "a:" + flat;
        }else if(typeof v == "object"){
            var flat = "";
            for(var key in v){
                if(typeof v[key] != "function"){
                    flat += key + "=" + this.encodeValue(v[key]) + "^";
                }
            }
            enc = "o:" + flat.substring(0, flat.length-1);
        }else{
            enc = "s:" + v;
        }
        return escape(enc);
    }
});
/**
 * @class Ext.state.Manager
 * 这是个全局state管理器。默认情况下，所有的组件都能”感知state“该类以获得state信息，无须传入一个自定义state provider。
 * 要实现这个类，必须在应用程序初始化时连同provider一起初始。
 <pre><code>
// 在你的初始化函数中
init : function(){
   Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
   ...
   //假设这是 {@link Ext.BorderLayout}
   var layout = new Ext.BorderLayout(...);
   layout.restoreState();
   // 或者{Ext.BasicDialog}
   var dialog = new Ext.BasicDialog(...);
   dialog.restoreState();
 </code></pre>
 * @singleton
 */
Ext.state.Manager = function(){
    var provider = new Ext.state.Provider();

    return {
        /**
         * 针对应用程序配置默认的state provider
         * @param {Provider} stateProvider 要设置的state provider
         */
        setProvider : function(stateProvider){
            provider = stateProvider;
        },

	    /**
	     * 返回当前的键值（value for a key）
	     * @param {String} name 键名称
	     * @param {Mixed} defaultValue 若键值找不到的情况下，返回的默认值
	     * @return {Mixed} State数据
	     */
        get : function(key, defaultValue){
            return provider.get(key, defaultValue);
        },

	    /**
	     * 设置键值
	     * @param {String} name 键名称
	     * @param {Mixed} value 设置值
	     */
         set : function(key, value){
            provider.set(key, value);
        },

	    /**
	     * 清除某个state的值
	     * @param {String} name 键名称
	     */
        clear : function(key){
            provider.clear(key);
        },

        /**
         *获取当前的 state provider
         * @return {Provider} state provider
         */
        getProvider : function(){
            return provider;
        }
    };
}();

/**
 * @class Ext.state.CookieProvider
 * @extends Ext.state.Provider
 * 通过cookies保存state的Provider之默认实现。
 * <br />用法:
 <pre><code>
   var cp = new Ext.state.CookieProvider({
       path: "/cgi-bin/",
       expires: new Date(new Date().getTime()+(1000*60*60*24*30)); //30天
       domain: "extjs.com"
   })
   Ext.state.Manager.setProvider(cp);
 </code></pre>
 * @cfg {String} path 激活cookie之路径（默认是根目录”/“，对该网站下所有的页面激活）
 * @cfg {Date} expires 过期的日子（默认七人之后）
 * @cfg {String} domain cookie保存的域名。 注意你在某个页面一旦设置好，将不能够再指定其它的域名，但可以是子域名，
 * 或者就是它本身如”extjs.com“,这样可以在不同子域名下访问cookies。
 * 默认为null使用相同的域名（包括www如www.extjs.com）
 * @cfg {Boolean} secure True表示为网站使用SSL加密（默认false）
 * @constructor
 * 创建一个新的CookieProvider
 * @param {Object} config 配置项对象
 */
Ext.state.CookieProvider = function(config){
    Ext.state.CookieProvider.superclass.constructor.call(this);
    this.path = "/";
    this.expires = new Date(new Date().getTime()+(1000*60*60*24*7)); //7天
    this.domain = null;
    this.secure = false;
    Ext.apply(this, config);
    this.state = this.readCookies();
};

Ext.extend(Ext.state.CookieProvider, Ext.state.Provider, {
    // private
    set : function(name, value){
        if(typeof value == "undefined" || value === null){
            this.clear(name);
            return;
        }
        this.setCookie(name, value);
        Ext.state.CookieProvider.superclass.set.call(this, name, value);
    },

    // private
    clear : function(name){
        this.clearCookie(name);
        Ext.state.CookieProvider.superclass.clear.call(this, name);
    },

    // private
    readCookies : function(){
        var cookies = {};
        var c = document.cookie + ";";
        var re = /\s?(.*?)=(.*?);/g;
    	var matches;
    	while((matches = re.exec(c)) != null){
            var name = matches[1];
            var value = matches[2];
            if(name && name.substring(0,3) == "ys-"){
                cookies[name.substr(3)] = this.decodeValue(value);
            }
        }
        return cookies;
    },

    // private
    setCookie : function(name, value){
        document.cookie = "ys-"+ name + "=" + this.encodeValue(value) +
           ((this.expires == null) ? "" : ("; expires=" + this.expires.toGMTString())) +
           ((this.path == null) ? "" : ("; path=" + this.path)) +
           ((this.domain == null) ? "" : ("; domain=" + this.domain)) +
           ((this.secure == true) ? "; secure" : "");
    },

    // private
    clearCookie : function(name){
        document.cookie = "ys-" + name + "=null; expires=Thu, 01-Jan-70 00:00:01 GMT" +
           ((this.path == null) ? "" : ("; path=" + this.path)) +
           ((this.domain == null) ? "" : ("; domain=" + this.domain)) +
           ((this.secure == true) ? "; secure" : "");
    }
});
