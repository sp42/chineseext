/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.grid.AbstractSelectionModel
 * @extends Ext.util.Observable
 * Grid选区模型（SelectionModels）基本抽象类。本类提供了子类要实现的接口。该类不能被直接实例化。
 * @constructor
 */
Ext.grid.AbstractSelectionModel = function(){
    this.locked = false;
    Ext.grid.AbstractSelectionModel.superclass.constructor.call(this);
};

Ext.extend(Ext.grid.AbstractSelectionModel, Ext.util.Observable,  {
    /** @ignore grid自动调用。勿直接调用*/
    init : function(grid){
        this.grid = grid;
        this.initEvents();
    },

    /**
     * 锁定多个选区
     */
    lock : function(){
        this.locked = true;
    },

    /**
     * 解锁多个选区
     */
    unlock : function(){
        this.locked = false;
    },

    /**
     * 返回true如果选区被锁
     * @return {Boolean}
     */
    isLocked : function(){
        return this.locked;
    }
});