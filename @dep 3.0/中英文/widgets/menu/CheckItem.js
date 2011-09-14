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
 * @class Ext.menu.CheckItem
 * @extends Ext.menu.Item
 * 添加一个默认为多选框的菜单选项，也可以是单选框组中的一个组员。<br />
 * @constructor
 * 创建一个 CheckItem 对象
 * @param {Object} config 配置选项对象
 */
Ext.menu.CheckItem = function(config){
    Ext.menu.CheckItem.superclass.constructor.call(this, config);
    this.addEvents(
   		/**
         * @event beforecheckchange
         * 在 checked 属性被设定之前触发，提供一次取消的机会（如果需要的话）
         * @param {Ext.menu.CheckItem} this
         * @param {Boolean} checked 将被设置的新的 checked 属性值
         */
        "beforecheckchange" ,
        /**
         * @event checkchange
         * checked 属性被设置后触发
         * @param {Ext.menu.CheckItem} this
         * @param {Boolean} checked 被设置的 checked 属性值
         */
        "checkchange"
    );

    /**
     * 为checkchange事件准备的函数。
     * 缺省下这个函数是不存在的，如实例有提供这个函数那么将登记到checkchange事件中，一触发该事件就会执行这个函数。
     * @param {Ext.menu.CheckItem} this
     * @param {Boolean} checked 是否选中
     * @method checkHandler
     */
    if(this.checkHandler){
        this.on('checkchange', this.checkHandler, this.scope);
    }
    Ext.menu.MenuMgr.registerCheckable(this);
};
Ext.extend(Ext.menu.CheckItem, Ext.menu.Item, {
    /**
     * @cfg {String} group
     * 所有 group 设置相同的选择项将被自动地组织到一个单选按钮组中（默认为 ''）
     */ 
    /**
     * @cfg {String} itemCls 选择项使用的默认CSS样式类（默认为 "x-menu-item x-menu-check-item"）
     */
    itemCls : "x-menu-item x-menu-check-item",
    /**
     * @cfg {String} groupClass 单选框组中选择项使用的默认CSS样式类（默认为 "x-menu-group-item"）
     */
    groupClass : "x-menu-group-item",

    /**
     * @cfg {Boolean} checked 值为 True 时该选项初始为选中状态（默认为 false）。
     * 注意：如果选择项为单选框组中的一员（group 为 true时）则只有最后的选择项才被初始为选中状态。
     */
    checked: false,

    // private
    ctype: "Ext.menu.CheckItem",

    // private
    onRender : function(c){
        Ext.menu.CheckItem.superclass.onRender.apply(this, arguments);
        if(this.group){
            this.el.addClass(this.groupClass);
        }
        if(this.checked){
            this.checked = false;
            this.setChecked(true, true);
        }
    },

    // private
    destroy : function(){
        Ext.menu.MenuMgr.unregisterCheckable(this);
        Ext.menu.CheckItem.superclass.destroy.apply(this, arguments);
    },

    /**
     * 设置该选项的 checked 属性状态
     * @param {Boolean} checked 新的 checked 属性值
     * @param {Boolean} suppressEvent （可选项） 值为 True 时将阻止 checkchange 事件的触发（默认为 false）
     */
    setChecked : function(state, suppressEvent){
        if(this.checked != state && this.fireEvent("beforecheckchange", this, state) !== false){
            if(this.container){
                this.container[state ? "addClass" : "removeClass"]("x-menu-item-checked");
            }
            this.checked = state;
            if(suppressEvent !== true){
                this.fireEvent("checkchange", this, state);
            }
        }
    },

    // private
    handleClick : function(e){
       if(!this.disabled && !(this.checked && this.group)){// disable unselect on radio item
           this.setChecked(!this.checked);
       }
       Ext.menu.CheckItem.superclass.handleClick.apply(this, arguments);
    }
});