/**
 * @class Ext.BoxComponent
 * @extends Ext.Component
 * 任何使用矩形容器的作可视化组件{@link Ext.Component}的基类。
 * 所有的容器类都应从BoxComponent继承，从而每个嵌套的Ext布局容器都会紧密地协调工作。
 * @constructor
 * @param {Ext.Element/String/Object} config 配置选项
 */
Ext.BoxComponent = function(config){
    Ext.BoxComponent.superclass.constructor.call(this, config);
    this.addEvents({
        /**
         * @event resize
         * 当组件调节过大小后触发。
	     * @param {Ext.Component} this
	     * @param {Number} adjWidth 矩形调整过后的宽度
	     * @param {Number} adjHeight 矩形调整过后的高度
	     * @param {Number} rawWidth 原来设定的宽度
	     * @param {Number} rawHeight 原来设定的高度
	     */
        resize : true,
        /**
         * @event move
         * 当组件被移动过之后触发。
	     * @param {Ext.Component} this
	     * @param {Number} x 新x位置
	     * @param {Number} y 新y位置
	     */
        move : true
    });
};

Ext.extend(Ext.BoxComponent, Ext.Component, {
    // private, set in afterRender to signify that the component has been rendered
    boxReady : false,
    // private, used to defer height settings to subclasses
    deferHeight: false,

    /**
     * 设置组件的宽度和高度。
     * 该方法会触发resize事件。
     * 该方法既可接受单独的数字类型的参数，也可以传入一个size的对象，如 {width:10, height:20}。
     * @param {Number/Object} width 要设置的宽度，或一个size对象，格式是{width, height}
     * @param {Number} height 要设置的高度（如第一参数是size对象的那第二个参数经不需要了）
     * @return {Ext.BoxComponent} this
     */
    setSize : function(w, h){
        // support for standard size objects
        if(typeof w == 'object'){
            h = w.height;
            w = w.width;
        }
        // not rendered
        if(!this.boxReady){
            this.width = w;
            this.height = h;
            return this;
        }

        // prevent recalcs when not needed
        if(this.lastSize && this.lastSize.width == w && this.lastSize.height == h){
            return this;
        }
        this.lastSize = {width: w, height: h};

        var adj = this.adjustSize(w, h);
        var aw = adj.width, ah = adj.height;
        if(aw !== undefined || ah !== undefined){ // this code is nasty but performs better with floaters
            var rz = this.getResizeEl();
            if(!this.deferHeight && aw !== undefined && ah !== undefined){
                rz.setSize(aw, ah);
            }else if(!this.deferHeight && ah !== undefined){
                rz.setHeight(ah);
            }else if(aw !== undefined){
                rz.setWidth(aw);
            }
            this.onResize(aw, ah, w, h);
            this.fireEvent('resize', this, aw, ah, w, h);
        }
        return this;
    },

    /**
     * 返回当前组件所属元素的大小。
     * @return {Object} 包含元素大小的对象，格式为{width: （元素宽度）, height:（元素高度）}
     */
    getSize : function(){
        return this.el.getSize();
    },

    /**
     * 对组件所在元素当前的XY位置
     * @param {Boolean} local （可选的）如为真返回的是元素的left和top而非XY（默认为false）
     * @return {Array} 元素的XY位置（如[100, 200]）
     */
    getPosition : function(local){
        if(local === true){
            return [this.el.getLeft(true), this.el.getTop(true)];
        }
        return this.xy || this.el.getXY();
    },

    /**
     * 返回对组件所在元素的测量矩形大小。
     * @param {Boolean} local （可选的） 如为真返回的是元素的left和top而非XY（默认为false）
     * @returns {Object} 格式为{x, y, width, height}的对象（矩形）
     */
    getBox : function(local){
        var s = this.el.getSize();
        if(local){
            s.x = this.el.getLeft(true);
            s.y = this.el.getTop(true);
        }else{
            var xy = this.xy || this.el.getXY();
            s.x = xy[0];
            s.y = xy[1];
        }
        return s;
    },

    /**
     * 对组件所在元素的测量矩形大小，然后根据此值设置组件的大小。
     * @param {Object} box 格式为{x, y, width, height}的对象
     * @returns {Ext.BoxComponent} this
     */
    updateBox : function(box){
        this.setSize(box.width, box.height);
        this.setPagePosition(box.x, box.y);
        return this;
    },

    // protected
    getResizeEl : function(){
        return this.resizeEl || this.el;
    },

    // protected
    getPositionEl : function(){
        return this.positionEl || this.el;
    },

    /**
     * 设置组件的left和top值。
     * 要设置基于页面的XY位置，可使用{@link #setPagePosition}。
     * 该方法触发move事件。
     * @param {Number} left 新left
     * @param {Number} top 新top
     * @returns {Ext.BoxComponent} this
     */
    setPosition : function(x, y){
        this.x = x;
        this.y = y;
        if(!this.boxReady){
            return this;
        }
        var adj = this.adjustPosition(x, y);
        var ax = adj.x, ay = adj.y;

        var el = this.getPositionEl();
        if(ax !== undefined || ay !== undefined){
            if(ax !== undefined && ay !== undefined){
                el.setLeftTop(ax, ay);
            }else if(ax !== undefined){
                el.setLeft(ax);
            }else if(ay !== undefined){
                el.setTop(ay);
            }
            this.onPosition(ax, ay);
            this.fireEvent('move', this, ax, ay);
        }
        return this;
    },

    /**
     * 设置组件页面上的left和top值。
     * 要设置left、top的位置，可使用{@link #setPosition}。
     * 该方法触发move事件。
     * @param {Number} x 新x位置
     * @param {Number} y 新y位置
     * @returns {Ext.BoxComponent} this
     */
    setPagePosition : function(x, y){
        this.pageX = x;
        this.pageY = y;
        if(!this.boxReady){
            return;
        }
        if(x === undefined || y === undefined){ // cannot translate undefined points
            return;
        }
        var p = this.el.translatePoints(x, y);
        this.setPosition(p.left, p.top);
        return this;
    },

    // private
    onRender : function(ct, position){
        Ext.BoxComponent.superclass.onRender.call(this, ct, position);
        if(this.resizeEl){
            this.resizeEl = Ext.get(this.resizeEl);
        }
        if(this.positionEl){
            this.positionEl = Ext.get(this.positionEl);
        }
    },

    // private
    afterRender : function(){
        Ext.BoxComponent.superclass.afterRender.call(this);
        this.boxReady = true;
        this.setSize(this.width, this.height);
        if(this.x || this.y){
            this.setPosition(this.x, this.y);
        }
        if(this.pageX || this.pageY){
            this.setPagePosition(this.pageX, this.pageY);
        }
    },

    /**
 	 * 强制重新计算组件的大小尺寸，这个尺寸是基于所属元素当前的高度和宽度。
     * @returns {Ext.BoxComponent} this
     */
    syncSize : function(){
        delete this.lastSize;
        this.setSize(this.el.getWidth(), this.el.getHeight());
        return this;
    },

    /**
     * 组件大小调节过后调用的函数，这是个空函数，可由一个子类来实现，执行一些调节大小过后的自定义逻辑。
     * @param {Number} x 新X值
     * @param {Number} y 新y值
     * @param {Number} adjWidth 矩形调整过后的宽度
     * @param {Number} adjHeight 矩形调整过后的高度
     * @param {Number} rawWidth 原本设定的宽度
     * @param {Number} rawHeight 原本设定的高度
     */
    onResize : function(adjWidth, adjHeight, rawWidth, rawHeight){

    },

    /**
     * 组件移动过后调用的函数，这是个空函数，可由一个子类来实现，执行一些移动过后的自定义逻辑。
     * @param {Number} x 新X值
     * @param {Number} y 新y值
     */
    onPosition : function(x, y){

    },

    // private
    adjustSize : function(w, h){
        if(this.autoWidth){
            w = 'auto';
        }
        if(this.autoHeight){
            h = 'auto';
        }
        return {width : w, height: h};
    },

    // private
    adjustPosition : function(x, y){
        return {x : x, y: y};
    }
});