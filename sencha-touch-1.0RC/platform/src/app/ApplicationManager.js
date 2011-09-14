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
 * @class Ext.ApplicationManager
 * @extends Ext.AbstractManager
 * @singleton
 * @ignore
 */
Ext.ApplicationManager = new Ext.AbstractManager({
    register: function(name, options) {
        if (Ext.isObject(name)) {
            options = name;
        } else {
            options.name = name;
        }
        
        var application = new Ext.Application(options);
        
        this.all.add(application);
        
        return application;
    }
});

/**
 * Shorthand for {@link Ext.ApplicationManager#register}
 * 根据指定的配置项对象创建一个Application实例。请参阅{@link Ext.Application}了解完整的例子。
 * Creates a new Application class from the specified config object. See {@link Ext.Application} for full examples.
 * 
 * @param {Object} config 一个你打算为你的程序所定义的配置项对象。A configuration object for the Model you wish to create.
 * @return {Ext.Application} 刚创建的Application对象。The newly created Application
 * @member Ext
 * @method regApplication
 */
Ext.regApplication = function() {
    return Ext.ApplicationManager.register.apply(Ext.ApplicationManager, arguments);
};