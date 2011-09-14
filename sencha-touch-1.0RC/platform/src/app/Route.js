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
 * @author Ed Spencer
 * @class Ext.util.Route
 * @extends Object
 * @ignore
 * <p>该类表征了一个url与控制器、控制器/动作结对之间的结合体。它也可以加入其它的参数。Represents a mapping between a url and a controller/action pair. May also contain additional params</p>
 */
Ext.util.Route = Ext.extend(Object, {
    /**
     * @cfg {String} url 要匹配的url字符串。必须的。The url string to match. Required.
     */
    
    constructor: function(config) {
        Ext.apply(this, config, {
            conditions: {}
        });
        
        /*
         * The regular expression we use to match a segment of a route mapping
         * this will recognise segments starting with a colon,
         * e.g. on 'namespace/:controller/:action', :controller and :action will be recognised
         */
        this.paramMatchingRegex = new RegExp(/:([0-9A-Za-z\_]*)/g);
        
        /*
         * Converts a route string into an array of symbols starting with a colon. e.g.
         * ":controller/:action/:id" => [':controller', ':action', ':id']
         */
        this.paramsInMatchString = this.url.match(this.paramMatchingRegex) || [];
        
        this.matcherRegex = this.createMatcherRegex(this.url);
    },
    
    /**
     * 尝试识辨一个url字符串并与控制器、动作相结合。
     * Attempts to recognize a given url string and return controller/action pair for it
     * @param {String} url 要识辨的urlThe url to recognize
     * @return {Object} 匹配的数据，如果返回false表示没有命中匹配。The matched data, or false if no match
     */
    recognize: function(url) {
        if (this.recognizes(url)) {
            var matches = this.matchesFor(url);
            
            return Ext.applyIf(matches, {
                controller: this.controller,
                action    : this.action,
                historyUrl: url
            });
        }
    },
    
    /**
     * 返回ture表示该路由对象匹配了一个指定的url字符串。
     * Returns true if this Route matches the given url string
     * @param {String} url 要测试的url。。The url to test
     * @return {Boolean} True表示为路由对象争取识辨了这个url。True if this Route recognizes the url
     */
    recognizes: function(url) {
        return this.matcherRegex.test(url);
    },
    
    /**
     * @private
     * 指定一个url，返回其匹配的url参数hash。
     * Returns a hash of matching url segments for the given url.
     * @param {String} url 要抽取的url。The url to extract matches for
     * @return {Object} 匹配的url。matching url segments
     */
    matchesFor: function(url) {
        var params = {},
            keys   = this.paramsInMatchString,
            values = url.match(this.matcherRegex),
            length = keys.length,
            i;
        
    //第一个元素是判断条件，不需要。（注：shift()很爽）first value is the entire match so reject
        values.shift();

        for (i = 0; i < length; i++) {
            params[keys[i].replace(":", "")] = values[i];
        }

        return params;
    },
    
    /**
     * 根据一个配置对象构造一个url，支持通贝符。（貌似该函数未搞掂）
     * Constructs a url for the given config object by replacing wildcard placeholders in the Route's url
     * @param {Object} config 配置对象。The config object
     * @return {String} 构建好的url。The constructed url
     */
    urlFor: function(config) {
        
    },
    
    /**
     * @private
     * 送入一个带通贝符的已配置url，返回可以用于匹配url的正则。
     * Takes the configured url string including wildcards and returns a regex that can be used to match
     * against a url
     * @param {String} url url字符串。The url string
     * @return {RegExp} 匹配的正则。The matcher regex
     */
    createMatcherRegex: function(url) {
        /**
         * Converts a route string into an array of symbols starting with a colon. e.g.
         * ":controller/:action/:id" => [':controller', ':action', ':id']
         */
        var paramsInMatchString = this.paramsInMatchString,
            length = paramsInMatchString.length,
            i, cond, matcher;
        
        for (i = 0; i < length; i++) {
            cond    = this.conditions[paramsInMatchString[i]];
            matcher = Ext.util.Format.format("({0})", cond || "[%a-zA-Z0-9\\_\\s,]+");

            url = url.replace(new RegExp(paramsInMatchString[i]), matcher);
        }

        //we want to match the whole string, so include the anchors
        return new RegExp("^" + url + "$");
    }
});