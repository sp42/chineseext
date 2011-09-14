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
 * @class Ext.Interaction
 * @extends Ext.util.Observable
 * @ignore
 * 
 * <p>该类表征了控制器与特定动作的结合体。Represents a single interaction performed by a controller/action pair</p>
 * @constructor
 * @param {Object} config 至少包含一個控制器、动作结对的配置项对象。Options object containing at least a controller/action pair
 */
Ext.Interaction = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {String} controller 要调度的控制器。The controller to dispatch to
     */
    controller: '',
    
    /**
     * @cfg {String} action 控制器相关的动作。The controller action to invoke
     */
    action: '',
    
    /**
     * @cfg {Array} args 送入动作当中的参数列表。Any arguments to pass to the action
     */
    
    /**
     * @cfg {Object} scope 可选的，控制器执行的动作。Optional scope to execute the controller action in
     */
    
    /**
     * True表示为这次交互已经被调遣。True if this Interaction has already been dispatched
     * @property dispatched
     * @type Boolean
     */
    dispatched: false,
    
    constructor: function(config) {
        Ext.Interaction.superclass.constructor.apply(this, arguments);
        
        config = config || {};
              
        Ext.applyIf(config, {
            scope: this
        });
        
        Ext.apply(this, config);
        
        if (typeof this.controller == 'string') {
            this.controller = Ext.ControllerManager.get(this.controller);
        }
    }
});