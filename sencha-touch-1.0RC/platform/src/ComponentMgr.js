/**
 * @class Ext.ComponentMgr
 * <p>
 * 为页面上全体的组件（特指{@link Ext.Component}的子类）以便能够可通过组件的id方便地去访问，（参见{@link Ext.getCmp}方法）。
 * Provides a registry of all Components (instances of {@link Ext.Component} or any subclass
 * thereof) on a page so that they can be easily accessed by {@link Ext.Component component}
 * {@link Ext.Component#id id} (see {@link #get}, or the convenience method {@link Ext#getCmp Ext.getCmp}).</p>
 * <p>
 * 此对象对组件的<i>类classes</i>提供索引检索的功能，这个索引应是如{@link Ext.Component#xtype}般的易记标识码。
 * 对于由大量复合配置对象构成的Ext页面，使用<tt>xtype</tt>能避免不必要子组件实例化。<br />
 * This object also provides a registry of available Component <i>classes</i>
 * indexed by a mnemonic code known as the Component's {@link Ext.Component#xtype xtype}.
 * The <code>{@link Ext.Component#xtype xtype}</code> provides a way to avoid instantiating child Components
 * when creating a full, nested config object for a complete Ext page.</p>
 * <p>
 * 只要xtype正确声明好，就可利用<i>配置项对象（config object）</i>表示一个子组件。
 * 这样如遇到组件真是需要显示的时候，与之适合的类型(xtype)就会匹配对应的组件类，达到延时实例化（lazy instantiation）。<br />
 * A child Component may be specified simply as a <i>config object</i>
 * as long as the correct <code>{@link Ext.Component#xtype xtype}</code> is specified so that if and when the Component
 * needs rendering, the correct type can be looked up for lazy instantiation.</p>
 * <p>
 * 全部的xtype列表可参阅{@link Ext.Component}。
 * For a list of all available <code>{@link Ext.Component#xtype xtypes}</code>, see {@link Ext.Component}.</p>
 * @singleton
 */
Ext.ComponentMgr = new Ext.AbstractManager({
    typeName: 'xtype',

    /**
     * Creates a new Component from the specified config object using the
     * config object's {@link Ext.component#xtype xtype} to determine the class to instantiate.
     * @param {Object} config A configuration object for the Component you wish to create.
     * @param {Constructor} defaultType The constructor to provide the default Component type if
     * the config object does not contain a <code>xtype</code>. (Optional if the config contains a <code>xtype</code>).
     * @return {Ext.Component} The newly instantiated Component.
     */
    create : function(config, defaultType){
        if (config.isComponent) {
            return config;
        } else {
            var type = config.xtype || defaultType,
                Class = this.types[type];
            if (!Class) {
                throw "Attempting to create a component with an xtype that has not been registered: " + type
            }
            return new Class(config);
        }
        return config.render ? config : new (config);
    },

    registerType : function(type, cls) {
        this.types[type] = cls;
        cls[this.typeName] = type;
        cls.prototype[this.typeName] = type;
    }
});

/**
 * Shorthand for {@link Ext.ComponentMgr#registerType}
 * @param {String} xtype The {@link Ext.component#xtype mnemonic string} by which the Component class
 * may be looked up.
 * @param {Constructor} cls The new Component class.
 * @member Ext
 * @method reg
 */
Ext.reg = function() {
    return Ext.ComponentMgr.registerType.apply(Ext.ComponentMgr, arguments);
}; // this will be called a lot internally, shorthand to keep the bytes down

/**
 * Shorthand for {@link Ext.ComponentMgr#create}
 * Creates a new Component from the specified config object using the
 * config object's {@link Ext.component#xtype xtype} to determine the class to instantiate.
 * @param {Object} config A configuration object for the Component you wish to create.
 * @param {Constructor} defaultType The constructor to provide the default Component type if
 * the config object does not contain a <code>xtype</code>. (Optional if the config contains a <code>xtype</code>).
 * @return {Ext.Component} The newly instantiated Component.
 * @member Ext
 * @method create
 */
Ext.create = function() {
    return Ext.ComponentMgr.create.apply(Ext.ComponentMgr, arguments);
};
