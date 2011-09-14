/**
 * @class Ext.Action
 * <p>Action 是可复用性中可以抽象出来，被任意特定组件所继承的特性之一。
 * Action 使你可以通过所有实现了 Actions 接口的组件共享处理函数、配置选项对象以及 UI 的更新（比如 {@link Ext.Toolbar}、{@link Ext.Button} 和 {@link Ext.menu.Menu} 组件）。</p>
 * <p>除了提供的配置选项对象接口之外，任何想要使用 Action 的组件必需提供下列方法以便在 Action 所需时调用：setText(string)、setIconCls(string)、setDisabled(boolean)、setVisible(boolean)和setHandler(function)。</p>
 * 使用示例：<br>
 * <pre><code>
// Define the shared action.  Each component below will have the same
// display text and icon, and will display the same message on click.
var action = new Ext.Action({
    text: 'Do something',
    handler: function(){
        Ext.Msg.alert('Click', 'You did something.');
    },
    iconCls: 'do-something'
});

var panel = new Ext.Panel({
    title: 'Actions',
    width:500,
    height:300,
    tbar: [
        // Add the action directly to a toolbar as a menu button
        action, {
            text: 'Action Menu',
            // Add the action to a menu as a text item
            menu: [action]
        }
    ],
    items: [
        // Add the action to the panel body as a standard button
        new Ext.Button(action)
    ],
    renderTo: Ext.getBody()
});

// Change the text for all components using the action
action.setText('Something else');
</code></pre>
 * @constructor
 * @param {Object} config 配置选项对象
 */
Ext.Action = function(config){
    this.initialConfig = config;
    this.items = [];
}

Ext.Action.prototype = {
    /**
     * @cfg {String} text 使用 action 对象的所有组件的文本（默认为 ''）。
     */
    /**
     * @cfg {String} iconCls 使用 action 对象的组件的图标样式表（默认为 ''）。
     * 该样式类应该提供一个显示为图标的背景图片。
     */
    /**
     * @cfg {Boolean} disabled true 则禁用组件，false 则启用组件（默认为 false）。
     */
    /**
     * @cfg {Boolean} hidden true 则隐藏组件，false 则显示组件（默认为 false）。
     */
    /**
     * @cfg {Function} handler 每个使用 action 对象的组件的主要事件触发时调用的处理函数（默认为 undefined）。
     */
    /**
     * @cfg {Object} scope {@link #handler} 函数执行的作用域。
     */

    // private
    isAction : true,

    /**
     * 设置使用 action 对象的所有组件的文本。
     * @param {String} text 显示的文本
     */
    setText : function(text){
        this.initialConfig.text = text;
        this.callEach('setText', [text]);
    },

    /**
     * 获取使用 action 对象的组件当前显示的文本。
     */
    getText : function(){
        return this.initialConfig.text;
    },

    /**
     * 设置使用 action 对象的组件的图标样式表。该样式类应该提供一个显示为图标的背景图片。
     * @param {String} cls 提供图标图片的 CSS 样式类
     */
    setIconClass : function(cls){
        this.initialConfig.iconCls = cls;
        this.callEach('setIconClass', [cls]);
    },

    /**
     * 获取使用 action 对象的组件的图标样式表。
     */
    getIconClass : function(){
        return this.initialConfig.iconCls;
    },

    /**
     * 设置所有使用 action 对象的组件的 disabled 状态。{@link #enable} 和 {@link #disable} 方法的快捷方式。
     * @param {Boolean} disabled true 则禁用组件，false 则启用组件
     */
    setDisabled : function(v){
        this.initialConfig.disabled = v;
        this.callEach('setDisabled', [v]);
    },

    /**
     * 启用所有使用 action 对象的组件。
     */
    enable : function(){
        this.setDisabled(false);
    },

    /**
     * 禁用所有使用 action 对象的组件。
     */
    disable : function(){
        this.setDisabled(true);
    },

    /**
     * 如果组件当前使用的 action 对象是禁用的，则返回 true，否则返回 false。只读。
     * @property
     */
    isDisabled : function(){
        return this.initialConfig.disabled;
    },

    /**
     * 设置所有使用 action 对象的组件的 hidden 状态。{@link #hide} 和 {@link #show} 方法的快捷方式。
     * @param {Boolean} hidden true 则隐藏组件，false 则显示组件
     */
    setHidden : function(v){
        this.initialConfig.hidden = v;
        this.callEach('setVisible', [!v]);
    },

    /**
     * 显示所有使用 action 对象的组件。
     */
    show : function(){
        this.setHidden(false);
    },

    /**
     * 隐藏所有使用 action 对象的组件。
     */
    hide : function(){
        this.setHidden(true);
    },

    /**
     * 如果组件当前使用的 action 对象是隐藏的，则返回 true，否则返回 false。只读。
     * @property
     */
    isHidden : function(){
        return this.initialConfig.hidden;
    },

    /**
     * 为每个使用 action 对象的组件设置主要事件触发时调用的处理函数。
     * @param {Function} fn action 对象的组件调用的函数。调用该函数时没有参数。
     * @param {Object} scope 函数运行的作用域
     */
    setHandler : function(fn, scope){
        this.initialConfig.handler = fn;
        this.initialConfig.scope = scope;
        this.callEach('setHandler', [fn, scope]);
    },

    /**
     * 绑定到当前 action 对象上的所有组件都执行一次指定的函数。传入的函数将接受一个由 action 对象所支持的配置选项对象组成的参数。
     * @param {Function} fn 每个组件执行的函数
     * @param {Object} scope 函数运行的作用域
     */
    each : function(fn, scope){
        Ext.each(this.items, fn, scope);
    },

    // private
    callEach : function(fnName, args){
        var cs = this.items;
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i][fnName].apply(cs[i], args);
        }
    },

    // private
    addComponent : function(comp){
        this.items.push(comp);
        comp.on('destroy', this.removeComponent, this);
    },

    // private
    removeComponent : function(comp){
        this.items.remove(comp);
    }
};