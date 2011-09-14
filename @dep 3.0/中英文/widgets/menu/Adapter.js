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
 * @class Ext.menu.Adapter
 * @extends Ext.menu.BaseItem
 * 一个公共的基类，用来使原本无菜单的组件能够被菜单选项封装起来并被添加到菜单中去。
 * 它提供了菜单组件所必须的基本的渲染、活动管理和启用/禁用逻辑功能。<br />
 * @constructor
 * 创建一个 Adapter 对象
 * @param {Ext.Component} component 渲染到菜单的那个组件
 * @param {Object} config 配置选项对象
 */
Ext.menu.Adapter = function(component, config){
    Ext.menu.Adapter.superclass.constructor.call(this, config);
    this.component = Ext.ComponentMgr.create(component, 'textfield');
};
Ext.extend(Ext.menu.Adapter, Ext.menu.BaseItem, {
    // private
    canActivate : true,

    // private
    onRender : function(container, position){
        this.component.render(container);
        this.el = this.component.getEl();
    },

    // private
    activate : function(){
        if(this.disabled){
            return false;
        }
        this.component.focus();
        this.fireEvent("activate", this);
        return true;
    },

    // private
    deactivate : function(){
        this.fireEvent("deactivate", this);
    },

    // private
    disable : function(){
        this.component.disable();
        Ext.menu.Adapter.superclass.disable.call(this);
    },

    // private
    enable : function(){
        this.component.enable();
        Ext.menu.Adapter.superclass.enable.call(this);
    }
});