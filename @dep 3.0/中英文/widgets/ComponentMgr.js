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
 * @class Ext.ComponentMgr
 * <p>为页面上全体的组件（特指{@link Ext.Component}的子类）以便能够可通过组件的id方便地去访问，（参见{@link Ext.getCmp}方法）。<br />
 * Provides a registry of all Components (instances of {@link Ext.Component} or any subclass
 * thereof) on a page so that they can be easily accessed by component id (see {@link #get}, or
 * the convenience method {@link Ext#getCmp Ext.getCmp}).</p>
 * <p>
 * 此对象对组件的<i>类classes</i>提供索引检索的功能，这个索引应是如{@link Ext.Component#xtype}般的易记标识码。
 * 对于由大量复合配置对象构成的Ext页面，使用<tt>xtype</tt>能避免不必要子组件实例化。<br />
 * This object also provides a registry of available Component <i>classes</i>
 * indexed by a mnemonic code known as the Component's {@link Ext.Component#xtype xtype}.
 * The <tt>xtype</tt> provides a way to avoid instantiating child Components
 * when creating a full, nested config object for a complete Ext page.</p>
 * <p>
 * 只要xtype正确声明好，就可利用<i>配置项对象（config object）</i>表示一个子组件。
 * 这样如遇到组件真是需要显示的时候，与之适合的类型(xtype)就会匹配对应的组件类，达到延时实例化（lazy instantiation）。<br />
 * A child Component may be specified simply as a <i>config object</i>
 * as long as the correct xtype is specified so that if and when the Component
 * needs rendering, the correct type can be looked up for lazy instantiation.</p>
 * <p>
 * 全部的xtype列表可参阅{@link Ext.Component}。<br />
 * For a list of all available xtypes, see {@link Ext.Component}.</p>
 * @singleton
 */
Ext.ComponentMgr = function(){
    var all = new Ext.util.MixedCollection();
    var types = {};
    var ptypes = {};

    return {
        /**
         * 注册一个组件。
         * Registers a component.
         * @param {Ext.Component} c 组件对象。The component
         */
        register : function(c){
            all.add(c);
        },

        /**
         * 撤消登记一个组件。
         * Unregisters a component.
         * @param {Ext.Component} c 组件对象。The component
         */
        unregister : function(c){
            all.remove(c);
        },

        /**
         * 由id返回组件。
         * Returns a component by id
         * @param {String} id 组件的id。The component id
         * @return Ext.Component
         */
        get : function(id){
            return all.get(id);
        },

        /**
         * 当指定组件被加入到ComponentMgr时调用的函数。
         * Registers a function that will be called when a specified component is added to ComponentMgr
         * @param {String} id 组件Id。The component id
         * @param {Function} fn 回调函数。The callback function
         * @param {Object} scope 回调的作用域。The scope of the callback
         */
        onAvailable : function(id, fn, scope){
            all.on("add", function(index, o){
                if(o.id == id){
                    fn.call(scope || o, o);
                    all.un("add", fn, scope);
                }
            });
        },

        /**
         * 为组件缓存所使用的MixedCollection。可在这个MixedCollection中加入相应的事件，监视增加或移除的情况。只读的。
         * The MixedCollection used internally for the component cache. An example usage may be subscribing to
         * events on the MixedCollection to monitor addition or removal.  Read-only.
         * @type MixedCollection
         * @property all
         */
        all : all,

        /**
         * <p>
         * 输入新的{@link Ext.Component#xtype}，登记一个新组件的构造器。 
         * Registers a new Component constructor, keyed by a new
         * {@link Ext.Component#xtype}.</p>
         * <p>使用该方法登记{@link Ext.Component}的子类以便当指定子组件的xtype时即可延时加载（lazy instantiation）。
         * 请参阅{@link Ext.Container#items}。
         * Use this method to register new subclasses of {@link Ext.Component} so
         * that lazy instantiation may be used when specifying child Components.
         * see {@link Ext.Container#items}</p>
         * @param {String} xtype 组件类的标识字符串。The mnemonic string by which the Component class
         * may be looked up.
         * @param {Constructor} cls 新的组件类。The new Component class.
         */
        registerType : function(xtype, cls){
            types[xtype] = cls;
            cls.xtype = xtype;
        },

        /**
         * 告诉需要哪个组建的{@link Ext.component#xtype xtype}，添加适合的配置项对象，就创建新的Component，实际上返回这个类的实例。
         * Creates a new Component from the specified config object using the
         * config object's {@link Ext.component#xtype xtype} to determine the class to instantiate.
         * @param {Object} config你打算创建组件的配置项对象。A configuration object for the Component you wish to create.
         * @param {Constructor} defaultType 如果第一个参数不包含组件的xtype就在第二个参数中指定，作为默认的组件类型。（如果第一个参数已经有的话这个参数就可选吧）。The constructor to provide the default Component type if
         * the config object does not contain an xtype. (Optional if the config contains an xtype).
         * @return {Ext.Component} 刚实例化的组件。The newly instantiated Component.
         */
        create : function(config, defaultType){
            return config.render ? config : new types[config.xtype || defaultType](config);
        },

        registerPlugin : function(ptype, cls){
            ptypes[ptype] = cls;
            cls.ptype = ptype;
        },

        createPlugin : function(config, defaultType){
            return new ptypes[config.ptype || defaultType](config);
        }
    };
}();

/**
 * Shorthand for {@link Ext.ComponentMgr#registerType}
 * @param {String} xtype The mnemonic string by which the Component class
 * may be looked up.
 * @param {Constructor} cls The new Component class.
 * @member Ext
 * @method reg
 */
Ext.reg = Ext.ComponentMgr.registerType; // this will be called a lot internally, shorthand to keep the bytes down
Ext.preg = Ext.ComponentMgr.registerPlugin;
Ext.create = Ext.ComponentMgr.create;
