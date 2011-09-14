/**
 * @class Ext.state.Provider
 * 为State Provider的实现提供一个抽象基类。
 * 该类对<b>某些类型</b>的变量提供了编码、解码方法，包括日期和定义Provider的接口。
 */
Ext.state.Provider = function(){
    /**
     * @event statechange
     * 当state发生改变时触发
     * @param {Provider} this 该state提供者
     * @param {String} key 已改名的那个键
     * @param {String} value 已编码的state值
     */
    this.addEvents("statechange");
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
        //console.log(value);
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
                if(typeof v[key] != "function" && v[key] !== undefined){
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
