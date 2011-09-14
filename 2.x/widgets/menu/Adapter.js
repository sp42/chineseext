/**
 * @class Ext.menu.Adapter
 * @extends Ext.menu.BaseItem
 * 一个公共的基类，用来使原本无菜单的组件能够被菜单选项封装起来并被添加到菜单中去。
 * 它提供了菜单组件所必须的基本的渲染、活动管理和启用/禁用逻辑功能。
 * @constructor
 * 创建一个 Adapter 对象
 * @param {Ext.Component} component 渲染到菜单的那个组件
 * @param {Object} config 配置选项对象
 */
Ext.menu.Adapter = function(component, config){
    Ext.menu.Adapter.superclass.constructor.call(this, config);
    this.component = component;
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