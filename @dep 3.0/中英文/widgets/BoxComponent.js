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
 * @class Ext.BoxComponent
 * @extends Ext.Component
 * <p>
 * 任何使用矩形容器的作可视化组件{@link Ext.Component}的基类，该类的模型提供了自适应高度、宽度调节的功能，具备大小调节和定位的能力。
 * 所有的容器类{@link Ext.Container}都应从BoxComponent继承，从而让参与每个布局的嵌套容器都会紧密地联系在一起工作。<br />
 * Base class for any {@link Ext.Component} that is to be sized as a box, using width and height. 
 * BoxComponent provides automatic box model adjustments for sizing and positioning and will work correctly
 * within the Component rendering model.  All {@link Ext.Container} Container classes should subclass
 * BoxComponent so that they will work consistently when nested within other Ext layout containers.</p>
 * <p>
 * 要让任意的HTML元素演变为所谓的组件概念中的一种，用BoxComponent就可以了，它可以使现有的元素，也可以是将来渲染之时要创建的元素。
 * 另外，一般来说，布局中的许多Component组件就是<b>Box</b>Component，使得具备高、宽可控的特性。<br />
 * A BoxComponent may be created as a custom Component which encapsulates any HTML element, either a pre-existing
 * element, or one that is created to your specifications at render time. Usually, to participate in layouts,
 * a Component will need to be a <b>Box</b>Component in order to have its width and height managed.</p>
 * <p>
 * 要打算让一个现成有的元素为BoxComponent服务，使用<b>el</b>的配置选项，指定是哪个一个元素。 <br />
 * To use a pre-existing element as a BoxComponent, configure it so that you preset the <b>el</b> property to the
 * element to reference:<pre><code>
var pageHeader = new Ext.BoxComponent({
    el: 'my-header-div'
});</code></pre>
 * 
 * 然后就可以使用{@link Ext.Container#add added}来加入{@link Ext.Container Container}对象为子元素。</p>
 * <p>
 * 要打算在BoxComponent渲染之时自动创建一个HTML元素作为其容器元素，使用{@link Ext.Component#autoEl autoEl}的配置选项。
 * 该配置项的内容就是一个{@link Ext.DomHelper DomHelper}的特定项：<br />
 * To create a BoxComponent based around a HTML element to be created at render time, use the
 * {@link Ext.Component#autoEl autoEl} config option which takes the form of a
 * {@link Ext.DomHelper DomHelper} specification:<pre><code>
var myImage = new Ext.BoxComponent({
    autoEl: {
        tag: 'img',
        src: '/images/my-image.jpg'
    }
});</code></pre></p>
 * @constructor
 * @param {Ext.Element/String/Object} config 配置选项。The configuration options.
 */
Ext.BoxComponent = Ext.extend(Ext.Component, {
    /**
     * @cfg {Number} x
     * 如果该组件是在一个定位的组件之中，可通过该属性返回组件的x本地（左边）坐标。
     * The local x (left) coordinate for this component if contained within a positioning container.
     */
    /**
     * @cfg {Number} y
     * 如果该组件是在一个定位的组件之中，可通过该属性返回组件的y本地（顶部）坐标。
     * The local y (top) coordinate for this component if contained within a positioning container.
     */
    /**
     * @cfg {Number} pageX
     * 如果该组件是在一个定位的组件之中，可通过该属性返回组件的x页面坐标。
     * The page level x coordinate for this component if contained within a positioning container.
     */
    /**
     * @cfg {Number} pageY
     * 如果该组件是在一个定位的组件之中，可通过该属性返回组件的y页面坐标。
     * The page level y coordinate for this component if contained within a positioning container.
     */
    /**
     * @cfg {Number} height
     * 此组件的高度（单位象素）（缺省为auto）。 
     * The height of this component in pixels (defaults to auto).
     */
    /**
     * @cfg {Number} width
     * 此组件的宽度（单位象素）（缺省为auto）。 
     * The width of this component in pixels (defaults to auto).
     */
    /**
     * @cfg {Boolean} autoHeight
     * True表示为使用height:'auto'，false表示为使用固定高度（缺省为false）。 
     * <b>注意：</b>尽管许多组件都会继承该配置选项，但是不是全部的'auto' height都有效。
     * autoHeight:true的设定表示会依照元素内容自适应大小，Ext就不会过问高度的问题。
     * True to use height:'auto', false to use fixed height (defaults to false). <b>Note</b>: Although many components 
     * inherit this config option, not all will function as expected with a height of 'auto'. Setting autoHeight:true 
     * means that the browser will manage height based on the element's contents, and that Ext will not manage it at all.
     */
    /**
     * @cfg {Boolean} autoWidth
     * True表示为使用width:'auto'，false表示为使用固定宽度（缺省为false）。
     * <b>注意：</b>尽管许多组件都会继承该配置选项，但是不是全部的'auto' width都有效。
     * autoWidth:true的设定表示会依照元素内容自适应大小，Ext就不会过问宽度的问题。
     * True to use width:'auto', false to use fixed width (defaults to false). <b>Note</b>: Although many components 
     * inherit this config option, not all will function as expected with a width of 'auto'. Setting autoWidth:true 
     * means that the browser will manage width based on the element's contents, and that Ext will not manage it at all.
     */

    /* // private internal config
     * {Boolean} deferHeight
     * True表示为根据外置的组件延时计算高度，false表示允许该组件自行设置高度（缺省为false）。 
     * True to defer height calculations to an external component, false to allow this component to set its own height (defaults to false).
     */

	// private
    initComponent : function(){
        Ext.BoxComponent.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event resize
             * 当组件调节过大小后触发。
             * Fires after the component is resized.
             * @param {Ext.Component} this
             * @param {Number} adjWidth 矩形调整过后的宽度。The box-adjusted width that was set
             * @param {Number} adjHeight 矩形调整过后的高度。The box-adjusted height that was set
             * @param {Number} rawWidth 原来设定的宽度。The width that was originally specified
             * @param {Number} rawHeight 原来设定的高度。The height that was originally specified
             */
            'resize',
            /**
             * @event move
             * 当组件被移动过之后触发。 
             * Fires after the component is moved.
             * @param {Ext.Component} this
             * @param {Number} x 新x位置。The new x position
             * @param {Number} y 新y位置。The new y position
             */
            'move'
        );
    },

    // private, set in afterRender to signify that the component has been rendered
    boxReady : false,
    // private, used to defer height settings to subclasses
    deferHeight: false,

    /**
     * 设置组件的宽度和高度。此方法会触发resize事件。
     * 此方法既可接受单独的数字类型的参数，也可以传入一个size的对象，如 {width:10, height:20}。
     * Sets the width and height of the component.  This method fires the {@link #resize} event.  This method can accept
     * either width and height as separate numeric arguments, or you can pass a size object like {width:10, height:20}.
     * @param {Number/Object} width 要设置的宽度，或一个size对象，格式是{width, height}。The new width to set, or a size object in the format {width, height}
     * @param {Number} height 要设置的高度（如第一参数是size对象的那第二个参数经不需要了）。The new height to set (not required if a size object is passed as the first arg)
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
        if(this.cacheSizes !== false && this.lastSize && this.lastSize.width == w && this.lastSize.height == h){
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
     * 设置组件的宽度。此方法会触发{@link #resize}事件。
     * Sets the width of the component. This method fires the {@link #resize} event.
     * @param {Number} width 要设置的新宽度。The new width to set
     * @return {Ext.BoxComponent} this
     */
    setWidth : function(width){
        return this.setSize(width);
    },

    /**
     * 设置组件的高度。此方法会触发{@link #resize}事件。
     * Sets the height of the component.  This method fires the {@link #resize} event.
     * @param {Number} height 要设置的新高度。The new height to set
     * @return {Ext.BoxComponent} this
     */
    setHeight : function(height){
        return this.setSize(undefined, height);
    },

    /**
     * 返回当前组件所属元素的大小。
     * Gets the current size of the component's underlying element.
     * @return {Object} 包含元素大小的对象，格式为{width: （元素宽度）, height:（元素高度）} An object containing the element's size {width: (element width), height: (element height)}
     */
    getSize : function(){
        return this.getResizeEl().getSize();
    },

    /**
     * 返回当前组件所在的HTML元素的宽度。
     * Gets the current width of the component's underlying element.
     * @return {Number}
     */
    getWidth : function(){
        return this.getResizeEl().getWidth();
    },

    /**
     * 返回当前组件所在的HTML元素的高度。
     * Gets the current height of the component's underlying element.
     * @return {Number}
     */
    getHeight : function(){
        return this.getResizeEl().getHeight();
    },

    /**
     * 返回当前组件所在元素的尺寸大小，包括其外补丁（margin）占据的空白位置。
     * Gets the current size of the component's underlying element, including space taken by its margins.
     * @return {Object} 包含元素大小的对象。{width: （元素宽度 + 左/右边距）, height: （元素高度 + 上/下边距）} An object containing the element's size {width: (element width + left/right margins), height: (element height + top/bottom margins)}
     */
    getOuterSize : function(){
        var el = this.getResizeEl();
        return {width: el.getWidth() + el.getMargins('lr'),
                height: el.getHeight() + el.getMargins('tb')};
    },

    /**
     * 对组件所在元素当前的XY位置查询。
     * Gets the current XY position of the component's underlying element.
     * @param {Boolean} local （可选的）如为真返回的是元素的left和top而非XY（默认为false）。(optional)If true the element's left and top are returned instead of page XY (defaults to false)
     * @return {Array} 元素的XY位置（如[100, 200]）。The XY position of the element (e.g., [100, 200])
     */
    getPosition : function(local){
        var el = this.getPositionEl();
        if(local === true){
            return [el.getLeft(true), el.getTop(true)];
        }
        return this.xy || el.getXY();
    },

    /**
     * 返回对组件所在元素的测量矩形大小。
     * Gets the current box measurements of the component's underlying element.
     * @param {Boolean} local （可选的） 如为真返回的是元素的left和top而非XY（默认为false）。(optional)  If true the element's left and top are returned instead of page XY (defaults to false)
     * @return {Object} box格式为{x, y, width, height}的对象（矩形）。 An object in the format {x, y, width, height}
     */
    getBox : function(local){
        var pos = this.getPosition(local);
        var s = this.getSize();
        s.x = pos[0];
        s.y = pos[1];
        return s;
    },

    /**
     * 对组件所在元素的测量矩形大小，然后根据此值设置组件的大小。
     * Sets the current box measurements of the component's underlying element.
     * @param {Object} box 格式为{x, y, width, height}的对象。An object in the format {x, y, width, height}
     * @return {Ext.BoxComponent} this
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
     * 设置组件的left和top值。要设置基于页面的XY位置，可使用{@link #setPagePosition}。此方法触发{@link #move}事件。
     * Sets the left and top of the component.  To set the page XY position instead, use {@link #setPagePosition}.
     * This method fires the {@link #move} event.
     * @param {Number} left 新left。The new left
     * @param {Number} top 新top。The new top
     * @return {Ext.BoxComponent} this
     */
    setPosition : function(x, y){
        if(x && typeof x[1] == 'number'){
            y = x[1];
            x = x[0];
        }
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
     * 设置组件页面上的left和top值。要设置left、top的位置，可使用{@link #setPosition}。此方法触发{@link #move}事件。 
     * Sets the page XY position of the component.  To set the left and top instead, use {@link #setPosition}.
     * This method fires the {@link #move} event.
     * @param {Number} x 新x位置。The new x position
     * @param {Number} y 新y位置。The new y position
     * @return {Ext.BoxComponent} this
     */
    setPagePosition : function(x, y){
        if(x && typeof x[1] == 'number'){
            y = x[1];
            x = x[0];
        }
        this.pageX = x;
        this.pageY = y;
        if(!this.boxReady){
            return;
        }
        if(x === undefined || y === undefined){ // cannot translate undefined points
            return;
        }
        var p = this.getPositionEl().translatePoints(x, y);
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
        }else if(this.pageX || this.pageY){
            this.setPagePosition(this.pageX, this.pageY);
        }
    },

    /**
     * 强制重新计算组件的大小尺寸，这个尺寸是基于所属元素当前的高度和宽度。
     * Force the component's size to recalculate based on the underlying element's current height and width.
     * @return {Ext.BoxComponent} this
     */
    syncSize : function(){
        delete this.lastSize;
        this.setSize(this.autoWidth ? undefined : this.getResizeEl().getWidth(), this.autoHeight ? undefined : this.getResizeEl().getHeight());
        return this;
    },

    /* // protected
     * 组件大小调节过后调用的函数，这是个空函数，可由一个子类来实现，执行一些调节大小过后的自定义逻辑。  Called after the component is resized, this method is empty by default but can be implemented by any
     * subclass that needs to perform custom logic after a resize occurs.
     * @param {Number} adjWidth 矩形调整过后的宽度 The box-adjusted width that was set
     * @param {Number} adjHeight 矩形调整过后的高度 The box-adjusted height that was set
     * @param {Number} rawWidth 原本设定的宽度 The width that was originally specified
     * @param {Number} rawHeight 原本设定的高度 The height that was originally specified
     */
    onResize : function(adjWidth, adjHeight, rawWidth, rawHeight){

    },

    /* // protected
     * 组件移动过后调用的函数，这是个空函数，可由一个子类来实现，执行一些移动过后的自定义逻辑。 Called after the component is moved, this method is empty by default but can be implemented by any
     * subclass that needs to perform custom logic after a move occurs.
     * @param {Number} x 新X值 The new x position
     * @param {Number} y 新y值 The new y position
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
Ext.reg('box', Ext.BoxComponent);

Ext.Spacer = Ext.extend(Ext.BoxComponent, {
    autoEl:'div'
});
Ext.reg('spacer', Ext.Spacer);