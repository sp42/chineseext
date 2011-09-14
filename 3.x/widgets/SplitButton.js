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
 * @class Ext.SplitButton
 * @extends Ext.Button
 * 一个提供了内建下拉箭头的分割按钮，该箭头还可以触发按钮默认的click 之外的事件。
 * 典型的应用场景是，用来显示一个为主按钮提供附加选项的下拉菜单，并且可以为arrowclick事件设置单独一个的处理函数。<br />
 * A split button that provides a built-in dropdown arrow that can fire an event separately from the default
 * click event of the button.  Typically this would be used to display a dropdown menu that provides additional
 * options to the primary button action, but any custom handler can provide the arrowclick implementation.  Example usage:
 * <pre><code>
//显示一个下拉菜单 display a dropdown menu:
new Ext.SplitButton({
	renderTo: 'button-ct', // 容器的id the container id
   	text: 'Options',
   	handler: optionsHandler, // 按钮本身被按下时触发的事件 handle a click on the button itself
   	menu: new Ext.menu.Menu({
        items: [
        	// 当箭头被按下时就出现下面这些下拉菜单。these items will render as dropdown menu items when the arrow is clicked:
	        {text: 'Item 1', handler: item1Handler},
	        {text: 'Item 2', handler: item2Handler}
        ]
   	})
});

// 除了显示菜单以外，你还可以让下拉箭头发挥更多的功能，——在点击那刹那。
// Instead of showing a menu, you provide any type of custom
// functionality you want when the dropdown arrow is clicked:
new Ext.SplitButton({
	renderTo: 'button-ct',
   	text: 'Options',
   	handler: optionsHandler,
   	arrowHandler: myCustomHandler
});
</code></pre>
 * @cfg {Function} arrowHandler 点击箭头时调用的函数（可以用来代替click事件）。A function called when the arrow button is clicked (can be used instead of click event)
 * @cfg {String} arrowTooltip 箭头的title属性。The title attribute of the arrow
 * @constructor 创建一个菜单按钮。Create a new menu button
 * @param {Object} config 配置选项对象。The config object
 */
Ext.SplitButton = Ext.extend(Ext.Button, {
	// private
    arrowSelector : 'em',
    split: true,

    // private
    initComponent : function(){
        Ext.SplitButton.superclass.initComponent.call(this);
        /**
         * @event arrowclick
         * 当点击按钮的箭头时触发。
         * Fires when this button's arrow is clicked
         * @param {MenuButton} this
         * @param {EventObject} e 事件对象。The click event
         */
        this.addEvents("arrowclick");
    },

    // private
    onRender : function(){
        Ext.SplitButton.superclass.onRender.apply(this, arguments);
        if(this.arrowTooltip){
            btn.child(this.arrowSelector).dom[this.tooltipType] = this.arrowTooltip;
        }
    },

    /**
     * 设置按钮的箭头点击处理函数。
     * Sets this button's arrow click handler.
     * @param {Function} handler 点击箭头时调用的函数。The function to call when the arrow is clicked
     * @param {Object} scope （可选的）处理函数的作用域。(optional) Scope for the function passed above
     */
    setArrowHandler : function(handler, scope){
        this.arrowHandler = handler;
        this.scope = scope;
    },

    getMenuClass : function(){
        return this.menu && this.arrowAlign != 'bottom' ? 'x-btn-split' : 'x-btn-split-bottom';
    },

    isClickOnArrow : function(e){
        return this.arrowAlign != 'bottom' ?
               e.getPageX() > this.el.child(this.buttonSelector).getRegion().right :
               e.getPageY() > this.el.child(this.buttonSelector).getRegion().bottom;
    },

    // private
    onClick : function(e, t){
        e.preventDefault();
        if(!this.disabled){
            if(this.isClickOnArrow(e)){
                if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
                    this.showMenu();
                }
                this.fireEvent("arrowclick", this, e);
                if(this.arrowHandler){
                    this.arrowHandler.call(this.scope || this, this, e);
                }
            }else{
                if(this.enableToggle){
                    this.toggle();
                }
                this.fireEvent("click", this, e);
                if(this.handler){
                    this.handler.call(this.scope || this, this, e);
                }
            }
        }
    },

    // private
    isMenuTriggerOver : function(e){
        return this.menu && e.target.tagName == 'em';
    },

    // private
    isMenuTriggerOut : function(e, internal){
        return this.menu && e.target.tagName != 'em';
    }
});

Ext.reg('splitbutton', Ext.SplitButton);