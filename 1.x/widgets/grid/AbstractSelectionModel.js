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