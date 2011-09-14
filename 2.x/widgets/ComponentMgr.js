/**
 * @class Ext.ComponentMgr
 * <p>为页面上全体的组件（特指 {@link Ext.Component} 的子类) 以便能够可通过
 * 组件的id方便地访问 (see {@link Ext.getCmp}).</p>
 * <p>此对象对组件的类 <i>classes</i> 提供索引的功能，这个索引应是如 {@link Ext.Component#xtype}.
 * 般的易记标识码。对于大量复合配置对象 Ext构成的页面。
 * <tt>xtype</tt> 避免不必要子组件实例化。只要xtype正确声明好，就可利用 <i>配置项对象config object</i>
 * 表示一个子组件，这样，如遇到组件真是需要显示的时候，与之适合的类型(xtype)就会匹配对应的组件类，达到
 * 延时实例化 lazy instantiation.</p>
 * <p>For a list of all available xtypes, see {@link Ext.Component}.</p>
 * @singleton
 */
 Ext.ComponentMgr = function(){
    var all = new Ext.util.MixedCollection();
    var types = {};

    return {
        /**
         * 注册一个组件
         * @param {Ext.Component} c 组件对象
         */
        register : function(c){
            all.add(c);
        },

        /**
         * 撤消登记一个组件
         * @param {Ext.Component} c 组件对象
         */
        unregister : function(c){
            all.remove(c);
        },

        /**
         * 由id返回组件
         * @param {String} id 组件的id
         * @return Ext.Component
         */		
        get : function(id){
            return all.get(id);
        },

        /**
         * 当指定组件被加入到ComponentMgr时调用的函数。
         * @param {String} id 组件Id
         * @param {Function} fn 回调函数
         * @param {Object} scope 回调的作用域
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
         * 为组件缓存所使用的MixedCollection。
         * 可在这个MixedCollection中加入相应的事件，监视增加或移除的情况。只读的
         * @type {MixedCollection}
         */       
        all : all,

        /**
         * 输入新的{@link Ext.Component#xtype}，登记一个新组件的构造器。<br><br>
         * 使用该方法登记{@link Ext.Component}的子类以便当指定子组件的xtype时即可延时加载（lazy instantiation）
         * 参阅{@link Ext.Container#items}
         * @param {String} xtype 组件类的标识字符串
         * @param {Constructor} cls 新的组件类
         */        
         
        registerType : function(xtype, cls){
            types[xtype] = cls;
            cls.xtype = xtype;
        },

        // private
        create : function(config, defaultType){
            return new types[config.xtype || defaultType](config);
        }
    };
}();

// this will be called a lot internally,
// shorthand to keep the bytes down
Ext.reg = Ext.ComponentMgr.registerType;