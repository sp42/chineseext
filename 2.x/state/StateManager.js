
/**
 * @class Ext.state.Manager
 * 这是个全局state管理器。默认情况下，所有的组件都能“感知state”该类以获得state信息，无须传入一个自定义state provider。
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
         *获取当前已配置的state provider
         * @return {Provider} state provider
         */
        getProvider : function(){
            return provider;
        }
    };
}();