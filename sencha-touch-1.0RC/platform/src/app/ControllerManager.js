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
 * @class Ext.ControllerManager
 * @extends Ext.AbstractManager
 * @singleton
 * 
 * <p>
 * 对全体已登记的控制作跟踪。开发者应该很少用到这个类。
 * 其原理是{@link Ext.AbstractManager AbstractManager}加上一个自定义的{@link #register}函数，
 * 用于设置控制器及其关联的{@link Ext.Application application}。
 * Keeps track of all of the registered controllers. This should very rarely need to be used by developers. This 
 * is simply an {@link Ext.AbstractManager AbstractManager} with a custom {@link #register} function which sets up
 * the controller and its linked {@link Ext.Application application}.</p>
 */
Ext.ControllerManager = new Ext.AbstractManager({
    register: function(id, options) {
        options.id = id;
        
        var controller = new Ext.Controller(options);
        
        var application = Ext.ApplicationManager.all.items[0];
        
        if (application) {
            controller.application = application;
        }
        
        if (controller.init) {
            controller.init();
        }
        
        this.all.add(controller);
        
        return controller;
    }
});

/**
 * {@link Ext.ControllerMgr#register}的快捷方式。以特定的配置项对象创建一个新的控制器类。参阅{@link Ext.Controller}的完整例子。
 * Shorthand for {@link Ext.ControllerMgr#register}
 * Creates a new Controller class from the specified config object. See {@link Ext.Controller} for full examples.
 * 
 * @param {Object} config 你想创建控制器其配置项对象。A configuration object for the Controller you wish to create.
 * @return {Ext.Controller} 新登记的控制器。The newly registered Controller
 * @member Ext
 * @method regController
 */
Ext.regController = function() {
    return Ext.ControllerManager.register.apply(Ext.ControllerManager, arguments);
};