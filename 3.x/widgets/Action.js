/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.Action
 * <p>
 * Action是可复用性中可以抽象出来，被任意特定组件所继承的特性之一。
 * Action使你可以通过所有实现了Actions接口的组件共享处理函数、配置选项对象以及UI的更新（比如{@link Ext.Toolbar}、{@link Ext.Button}和{@link Ext.menu.Menu}组件）。<br />
 * An Action is a piece of reusable functionality that can be abstracted out of any particular component so that it
 * can be usefully shared among multiple components.  Actions let you share handlers, configuration options and UI
 * updates across any components that support the Action interface (primarily {@link Ext.Toolbar}, {@link Ext.Button}
 * and {@link Ext.menu.Menu} components).</p>
 * <p>
 * 除了提供的配置选项对象接口之外，任何想要使用Action的组件必需提供下列方法以便在Action所需时调用：
 * setText(string)、setIconCls(string)、setDisabled(boolean)、setVisible(boolean)和setHandler(function)。<br />
 * Aside from supporting the config object interface, any component that needs to use Actions must also support
 * the following method list, as these will be called as needed by the Action class: setText(string), setIconCls(string),
 * setDisabled(boolean), setVisible(boolean) and setHandler(function).</p>
 * 使用示例：Example usage:<br>
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

// 通过itemId来获取容器下的action
// Reference an action through a container using the itemId
var btn = panel.getComponent('myAction');
var aRef = btn.baseAction;
aRef.setText('New text');
</code></pre>
 * @constructor
 * @param {Object} config 配置选项对象。The configuration options
 */
Ext.Action = function(config){
    this.initialConfig = config;
    this.itemId = config.itemId = (config.itemId || config.id || Ext.id());
    this.items = [];
}

Ext.Action.prototype = {
    /**
     * @cfg {String} text 使用 action 对象的所有组件的文本（默认为 ''）。
     * The text to set for all components using this action (defaults to '').
     */
    /**
     * @cfg {String} iconCls
     * 使用 action 对象的组件的图标样式表（默认为 ''）。该样式类应该提供一个显示为图标的背景图片。
     * The CSS class selector that specifies a background image to be used as the header icon for
     * all components using this action (defaults to '').
     * <p>用css来指定图标的例子会是这样：An example of specifying a custom icon class would be something like:
     * </p><code><pre>
// iconCls是指定图标的配置项。specify the property in the config for the class:
     ...
     iconCls: 'do-something'

// 指定css背景图，作为图标的图片文件。css class that specifies background image to be used as the icon image:
.do-something { background-image: url(../images/my-icon.gif) 0 6px no-repeat !important; }
</pre></code>
     */
    /**
     * @cfg {Boolean} disabled True 则禁用组件，false 则启用组件（默认为 false）。
     * True to disable all components using this action, false to enable them (defaults to false).
     */
    /**
     * @cfg {Boolean} hidden True 则隐藏组件，false 则显示组件（默认为 false）。
     * True to hide all components using this action, false to show them (defaults to false).
     */
    /**
     * @cfg {Function} handler 每个使用 action 对象的组件的主要事件触发时调用的处理函数（默认为 undefined）。
     * The function that will be invoked by each component tied to this action
     * when the component's primary event is triggered (defaults to undefined).
     */
    /**
     * @cfg {Object} scope {@link #handler}函数执行的作用域。
     * The scope in which the {@link #handler} function will execute.
     */

    // private
    isAction : true,

    /**
     * 设置使用 action 对象的所有组件的文本。
     * Sets the text to be displayed by all components using this action.
     * @param {String} text 显示的文本。The text to display 
     */
    setText : function(text){
        this.initialConfig.text = text;
        this.callEach('setText', [text]);
    },

    /**
     * 获取使用 action 对象的组件当前显示的文本。
     * Gets the text currently displayed by all components using this action.
     */
    getText : function(){
        return this.initialConfig.text;
    },

    /**
     * 设置使用 action 对象的组件的图标样式表。该样式类应该提供一个显示为图标的背景图片。
     * Sets the icon CSS class for all components using this action. The class should supply
     * a background image that will be used as the icon image.
     * @param {String} cls 提供图标图片的 CSS 样式类。The CSS class supplying the icon image
     */
    setIconClass : function(cls){
        this.initialConfig.iconCls = cls;
        this.callEach('setIconClass', [cls]);
    },

    /**
     * 获取使用 action 对象的组件的图标样式表。
     * Gets the icon CSS class currently used by all components using this action.
     */
    getIconClass : function(){
        return this.initialConfig.iconCls;
    },

    /**
     * 设置所有使用 action 对象的组件的 disabled 状态。{@link #enable} 和 {@link #disable} 方法的快捷方式。
     * Sets the disabled state of all components using this action.  Shortcut method for {@link #enable} and {@link #disable}.
     * @param {Boolean} disabled True 则禁用组件，false 则启用组件。True to disable the component, false to enable it
     */
    setDisabled : function(v){
        this.initialConfig.disabled = v;
        this.callEach('setDisabled', [v]);
    },

    /**
     * 启用所有使用 action 对象的组件。
     * Enables all components using this action.
     */
    enable : function(){
        this.setDisabled(false);
    },

    /**
     * 禁用所有使用 action 对象的组件。
     * Disables all components using this action.
     */
    disable : function(){
        this.setDisabled(true);
    },

    /**
     * 如果组件当前使用的 action 对象是禁用的，则返回 true，否则返回 false。只读。
     * Returns true if the components using this action are currently disabled, else returns false.  Read-only.
     * @type Boolean
     * @property isDisabled
     */
    isDisabled : function(){
        return this.initialConfig.disabled;
    },

    /**
     * 设置所有使用 action 对象的组件的 hidden 状态。{@link #hide} 和 {@link #show} 方法的快捷方式。
     * Sets the hidden state of all components using this action.  Shortcut method for {@link #hide} and {@link #show}.
     * @param {Boolean} hidden True 则隐藏组件，false 则显示组件。 True to hide the component, false to show it
     */
    setHidden : function(v){
        this.initialConfig.hidden = v;
        this.callEach('setVisible', [!v]);
    },

    /**
     * 显示所有使用 action 对象的组件。
     * Shows all components using this action.
     */
    show : function(){
        this.setHidden(false);
    },

    /**
     * 隐藏所有使用 action 对象的组件。
     * Hides all components using this action.
     */
    hide : function(){
        this.setHidden(true);
    },

    /**
     * 如果组件当前使用的 action 对象是隐藏的，则返回 true，否则返回 false。只读。
     * Returns true if the components using this action are currently hidden, else returns false.  Read-only.
     * @type Boolean
     * @property isHidden
     */
    isHidden : function(){
        return this.initialConfig.hidden;
    },

    /**
     * 为每个使用 action 对象的组件设置主要事件触发时调用的处理函数。
     * Sets the function that will be called by each component using this action when its primary event is triggered.
     * @param {Function} fn 对象的组件调用的函数。调用该函数时没有参数。The function that will be invoked by the action's components.  The function
     * will be called with no arguments.
     * @param {Object} scope 函数运行的作用域。The scope in which the function will execute
     */
    setHandler : function(fn, scope){
        this.initialConfig.handler = fn;
        this.initialConfig.scope = scope;
        this.callEach('setHandler', [fn, scope]);
    },

    /**
     * 绑定到当前 action 对象上的所有组件都执行一次指定的函数。传入的函数将接受一个由 action 对象所支持的配置选项对象组成的参数。
     * Executes the specified function once for each component currently tied to this action.  The function passed
     * in should accept a single argument that will be an object that supports the basic Action config/method interface.
     * @param {Function} fn 每个组件执行的函数。The function to execute for each component
     * @param {Object} scope 函数运行的作用域。The scope in which the function will execute
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
    },

    /**
     * 手动执行动作，采用的是原配置对象上的默认句柄函数。参数也可以一并传递。
     * Executes this action manually using the default handler specified in the original config object.  Any arguments
     * passed to this function will be passed on to the handler function.
     * @param {Mixed} arg1 （可选的）传入到处理器句柄的参数。(optional) Variable number of arguments passed to the handler function 
     * @param {Mixed} arg2 （可选的）(optional)
     * @param {Mixed} etc... （可选的）(optional)
     */
    execute : function(){
        this.initialConfig.handler.apply(this.initialConfig.scope || window, arguments);
    }
};