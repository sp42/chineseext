/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=90 Ext中文站翻译小组
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
 * @constructor
 * 创建一个新的CookieProvider
 * @param {Object} config 配置项对象
 */
Ext.state.CookieProvider = function(config){
    Ext.state.CookieProvider.superclass.constructor.call(this);
    this.path = "/";
    this.expires = new Date(new Date().getTime()+(1000*60*60*24*7)); //7 days
    this.domain = null;
    this.secure = false;
    Ext.apply(this, config);
    this.state = this.readCookies();
};
/**
 * @cfg {String} domain cookie保存的域名。 注意你在某个页面一旦设置好，将不能够再指定其它的域名，但可以是子域名，
 * 或者就是它本身如“extjs.com”,这样可以在不同子域名下访问cookies。
 * 默认为null使用相同的域名（包括www如www.extjs.com）
 **/ 
/**
 * @cfg {Boolean} secure 
 * True表示为网站使用SSL加密（默认false）
 */ 
/**
 * @cfg {String} path 激活cookie之路径（默认是根目录”/“，对该网站下所有的页面激活）
 */ 
/**
 * @cfg {Date} expires 过期的日子（默认七日之后）
 */ 
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