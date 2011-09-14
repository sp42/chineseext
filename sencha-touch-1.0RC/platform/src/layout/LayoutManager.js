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
 * @class Ext.LayoutManager
 * <p>
 * 提供全体布局对象的等级管理（页面上任何{@link Ext.layout.Layout}的子类）。
 * Provides a registry of all Layouts (instances of {@link Ext.layout.Layout} or any subclass
 * thereof) on a page.</p>
 * @singleton
 */
Ext.layout.LayoutManager = new Ext.AbstractManager({
    /**
     * 传入一个配置项对象的参数，构建新的组件。配置项中的{@link Ext.component#xtype xtype}属性决定了哪个类要去实例化。
     * Creates a new Component from the specified config object using the
     * config object's {@link Ext.component#xtype xtype} to determine the class to instantiate.
     * @param {Object} config 你打算创建的那个组件的配置项对象。A configuration object for the Component you wish to create.
     * @param {Constructor} defaultType 如果配置项对象不包含<code>xtype</code>，那么你可传入一个构建函数。The constructor to provide the default Component type if
     * the config object does not contain a <code>xtype</code>. (Optional if the config contains a <code>xtype</code>).
     * @return {Ext.Component} 刚才实例化的组件。The newly instantiated Component.
     */
    create : function(config, defaultType) {
        if (!config) {
            config = defaultType;
        }
        if (Ext.isString(config)) {
            return new this.types[config || defaultType];
        }
        else if (Ext.isObject(config)) {
            if (config.isLayout) {
                return config;
            }
            else {
                return new this.types[config.type || defaultType](config);
            }
        }
    }
});

/**
 * {@link Ext.layout.LayoutManager#registerType}的简写形式。
 * Shorthand for {@link Ext.layout.LayoutManager#registerType}
 * @param {String} type 要创建的哪一个{@link Ext.layout.Layout#type mnemonic string}类。The {@link Ext.layout.Layout#type mnemonic string} by which the Layout class
 * may be looked up.
 * @param {Constructor} cls 新布局类。The new Layout class.
 * @member Ext
 * @method regLayout
 */
Ext.regLayout = function() {
    return Ext.layout.LayoutManager.registerType.apply(Ext.layout.LayoutManager, arguments);
};