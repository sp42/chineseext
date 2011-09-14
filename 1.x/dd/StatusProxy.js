/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.dd.StatusProxy
 * 一个特殊的拖动代理，可支持落下状态时的图标，{@link Ext.Layer} 样式和自动修复。
 * Ext.dd components默认都是使用这个代理
 * @constructor
 * @param {Object} config
 */
Ext.dd.StatusProxy = function(config){
    Ext.apply(this, config);
    this.id = this.id || Ext.id();
    this.el = new Ext.Layer({
        dh: {
            id: this.id, tag: "div", cls: "x-dd-drag-proxy "+this.dropNotAllowed, children: [
                {tag: "div", cls: "x-dd-drop-icon"},
                {tag: "div", cls: "x-dd-drag-ghost"}
            ]
        }, 
        shadow: !config || config.shadow !== false
    });
    this.ghost = Ext.get(this.el.dom.childNodes[1]);
    this.dropStatus = this.dropNotAllowed;
};

Ext.dd.StatusProxy.prototype = {
    /**
     * @cfg {String} dropAllowed
     * 当拖动源到达落下目标上方时的CSS class
     */
    dropAllowed : "x-dd-drop-ok",
    /**
     * @cfg {String} dropNotAllowed
     * 当不可以被落下时拖动源的样式（默认为"x-dd-drop-nodrop"）。
     */
    dropNotAllowed : "x-dd-drop-nodrop",

    /**
     * 更新代理的可见元素，用来指明在当前元素上可否落下的状态。 
     * @param {String} cssClass 对指示器图象的新CSS样式
     */
    setStatus : function(cssClass){
        cssClass = cssClass || this.dropNotAllowed;
        if(this.dropStatus != cssClass){
            this.el.replaceClass(this.dropStatus, cssClass);
            this.dropStatus = cssClass;
        }
    },

    /**
     * 对默认dropNotAllowed值的状态提示器进行复位
     * @param {Boolean} clearGhost true的话移除所有ghost的内容,false的话保留
     */
    reset : function(clearGhost){
        this.el.dom.className = "x-dd-drag-proxy " + this.dropNotAllowed;
        this.dropStatus = this.dropNotAllowed;
        if(clearGhost){
            this.ghost.update("");
        }
    },

    /**
     * 更新ghost元素的内容
     * @param {String} html 替换当前ghost元素的innerHTML的那个html
     */
    update : function(html){
        if(typeof html == "string"){
            this.ghost.update(html);
        }else{
            this.ghost.update("");
            html.style.margin = "0";
            this.ghost.dom.appendChild(html);
        }        
    },

    /**
     * 返所在在的代理{@link Ext.Layer}
     * @return {Ext.Layer} el
    */
    getEl : function(){
        return this.el;
    },

    /**
     * 返回ghost元素
     * @return {Ext.Element} el
     */
    getGhost : function(){
        return this.ghost;
    },

    /**
     * 隐藏代理
     * @param {Boolean} clear True的话复位状态和清除ghost内容,false的话就保留
     */
    hide : function(clear){
        this.el.hide();
        if(clear){
            this.reset(true);
        }
    },

    /**
     * 如果运行中就停止修复动画
     */
    stop : function(){
        if(this.anim && this.anim.isAnimated && this.anim.isAnimated()){
            this.anim.stop();
        }
    },

    /**
     * 显示代理
     */
    show : function(){
        this.el.show();
    },

    /**
     * 迫使层同步阴影和闪烁元素的位置
     */
    sync : function(){
        this.el.sync();
    },

    /**
     * 通过动画让代理返回到原来位置。
	 * 应由拖动项在完成一次无效的落下动作之后调用.
     * @param {Array} xy 元素的XY位置([x, y])
     * @param {Function} callback 完成修复之后的回调函数
     * @param {Object} scope 执行回调函数的作用域
     */
    repair : function(xy, callback, scope){
        this.callback = callback;
        this.scope = scope;
        if(xy && this.animRepair !== false){
            this.el.addClass("x-dd-drag-repair");
            this.el.hideUnders(true);
            this.anim = this.el.shift({
                duration: this.repairDuration || .5,
                easing: 'easeOut',
                xy: xy,
                stopFx: true,
                callback: this.afterRepair,
                scope: this
            });
        }else{
            this.afterRepair();
        }
    },

    // private
    afterRepair : function(){
        this.hide(true);
        if(typeof this.callback == "function"){
            this.callback.call(this.scope || this);
        }
        this.callback = null;
        this.scope = null;
    }
};