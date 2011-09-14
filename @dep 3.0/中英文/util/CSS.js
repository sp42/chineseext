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
 * @class Ext.util.CSS
 * 操控CSS规则的工具类
 * @singleton
 */
Ext.util.CSS = function(){
	var rules = null;
   	var doc = document;

    var camelRe = /(-[a-z])/gi;
    var camelFn = function(m, a){ return a.charAt(1).toUpperCase(); };

   return {
   /**
    * 动态生成样式表。用style标签围绕样式后加入到文档头部中。
    * @param {String} cssText 包含css的文本
    * @return {StyleSheet}
    */
   createStyleSheet : function(cssText, id){
       var ss;
       var head = doc.getElementsByTagName("head")[0];
       var rules = doc.createElement("style");
       rules.setAttribute("type", "text/css");
       if(id){
           rules.setAttribute("id", id);
       }
       if(Ext.isIE){
           head.appendChild(rules);
           ss = rules.styleSheet;
           ss.cssText = cssText;
       }else{
           try{
                rules.appendChild(doc.createTextNode(cssText));
           }catch(e){
               rules.cssText = cssText;
           }
           head.appendChild(rules);
           ss = rules.styleSheet ? rules.styleSheet : (rules.sheet || doc.styleSheets[doc.styleSheets.length-1]);
       }
       this.cacheStyleSheet(ss);
       return ss;
   },

   /**
    * 由id移除样式或连接
    * @param {String} id 标签的ID
    */
   removeStyleSheet : function(id){
       var existing = doc.getElementById(id);
       if(existing){
           existing.parentNode.removeChild(existing);
       }
   },

   /**
    * 动态交换现有的样式，指向新的一个
    * @param {String} id 要移除的现有链接标签的ID
    * @param {String} url 要包含新样式表的href
    */
   swapStyleSheet : function(id, url){
       this.removeStyleSheet(id);
       var ss = doc.createElement("link");
       ss.setAttribute("rel", "stylesheet");
       ss.setAttribute("type", "text/css");
       ss.setAttribute("id", id);
       ss.setAttribute("href", url);
       doc.getElementsByTagName("head")[0].appendChild(ss);
   },

   /**
    * 如果动态地加入样式表，刷新样式cache。
    * @return {Object} 由选择器索引的样式对象（hash）
    */
   refreshCache : function(){
       return this.getRules(true);
   },

   // private
   cacheStyleSheet : function(ss){
       if(!rules){
           rules = {};
       }
       try{// try catch for cross domain access issue
           var ssRules = ss.cssRules || ss.rules;
           for(var j = ssRules.length-1; j >= 0; --j){
               rules[ssRules[j].selectorText] = ssRules[j];
           }
       }catch(e){}
   },

   /**
    * 获取文档内的所有的CSS rules
    * @param {Boolean} refreshCache true：刷新内置缓存
    * @return {Object} 由选择器索引的样式对象（hash）
    */
   getRules : function(refreshCache){
   		if(rules == null || refreshCache){
   			rules = {};
   			var ds = doc.styleSheets;
   			for(var i =0, len = ds.length; i < len; i++){
   			    try{
    		        this.cacheStyleSheet(ds[i]);
    		    }catch(e){}
	        }
   		}
   		return rules;
   	},

   	/**
    * 由选择符获取不同的CSS规则
    * @param {String/Array} selector 选择符支持数组，在匹配第一个结果后立刻停止继续寻找
    * @param {Boolean} refreshCache true表示为如果你最近有更新或新加样式的话，就刷新内置缓存
    * @return {CSSRule} 找到的CSS rule或null（找不到）
    */
   getRule : function(selector, refreshCache){
   		var rs = this.getRules(refreshCache);
   		if(!(selector instanceof Array)){
   		    return rs[selector];
   		}
   		for(var i = 0; i < selector.length; i++){
			if(rs[selector[i]]){
				return rs[selector[i]];
			}
		}
		return null;
   	},


   	/**
    * 更新样式属性
    * @param {String/Array} selector 选择符支持数组，在匹配第一个结果后立刻停止继续寻找
    * @param {String} property css属性
    * @param {String} value 属性的新值
    * @return {Boolean} true：如果样式找到并更新
    */
   updateRule : function(selector, property, value){
   		if(!(selector instanceof Array)){
   			var rule = this.getRule(selector);
   			if(rule){
   				rule.style[property.replace(camelRe, camelFn)] = value;
   				return true;
   			}
   		}else{
   			for(var i = 0; i < selector.length; i++){
   				if(this.updateRule(selector[i], property, value)){
   					return true;
   				}
   			}
   		}
   		return false;
   	}
   };
}();