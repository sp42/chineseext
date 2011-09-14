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
 * @class Ext.SplitBar
 * @extends Ext.util.Observable
 * 由DOM元素创建可拖拽的分割控件(可以拖拽和改变的大小的元素)。<br />
 * Creates draggable splitter bar functionality from two elements (element to be dragged and element to be resized).
 * <br><br>
 * Usage:
 * <pre><code>
var split = new Ext.SplitBar("elementToDrag", "elementToSize",
                   Ext.SplitBar.HORIZONTAL, Ext.SplitBar.LEFT);
split.setAdapter(new Ext.SplitBar.AbsoluteLayoutAdapter("container"));
split.minSize = 100;
split.maxSize = 600;
split.animate = true;
split.on('moved', splitterMoved);
</code></pre>
 * @constructor 创建一个新的分割控件。Create a new SplitBar
 * @param {Mixed} dragElement 拖拽到元素，作为分割控件被拖拽到元素。The element to be dragged and act as the SplitBar.
 * @param {Mixed} resizingElement 根据SplitBar到拖拽缩放大小的元素。The element to be resized based on where the SplitBar element is dragged
 * @param {Number} orientation （可选的）Ext.SplitBar.HORIZONTAL或者Ext.SplitBar.VERTICAL方向（默认为 HORIZONTAL）。(optional)Either Ext.SplitBar.HORIZONTAL or Ext.SplitBar.VERTICAL. (Defaults to HORIZONTAL)
 * @param {Number} placement  （可选的）水平方向上，Ext.SplitBar.LEFT或者Ext.SplitBar.RIGHT垂直方向上，
 * Ext.SplitBar.TOP或Ext.SplitBar.BOTTOM（默认的会根据SplitBar初始化的位置自己决定）。
 * (optional)Either Ext.SplitBar.LEFT or Ext.SplitBar.RIGHT for horizontal or  
                        Ext.SplitBar.TOP or Ext.SplitBar.BOTTOM for vertical. (By default, this is determined automatically by the initial
                        position of the SplitBar).
 */
Ext.SplitBar = function(dragElement, resizingElement, orientation, placement, existingProxy){
    
    /** @private 私有的 */
    this.el = Ext.get(dragElement, true);
    this.el.dom.unselectable = "on";
    /** @private 私有的 */
    this.resizingEl = Ext.get(resizingElement, true);

    /**
     * @private
     * 分割控件的方向。Ext.SplitBar.HORIZONTAL或者Ext.SplitBar.VERTICAL（默认为 HORIZONTAL）。
     * 如果在分割控件被创建后修改该属性，placement属性必须要手动修改。
     * The orientation of the split. Either Ext.SplitBar.HORIZONTAL or Ext.SplitBar.VERTICAL. (Defaults to HORIZONTAL)
     * Note: If this is changed after creating the SplitBar, the placement property must be manually updated
     * @type Number
     */
    this.orientation = orientation || Ext.SplitBar.HORIZONTAL;
    
    /**
     * 移动该SplitBar的步长值，单位是像素。<i>undefined</i>的话，表示SplitBar移动的比较顺滑。
     * The increment, in pixels by which to move this SplitBar. When <i>undefined</i>, the SplitBar moves smoothly.
     * @type Number
     * @property tickSize
     */
    /**
     * 可缩放元素的最小值（默认为0）。
     * The minimum size of the resizing element. (Defaults to 0)
     * @type Number
     */
    this.minSize = 0;
    
    /**
     * 可缩放元素的最大值（默认为 2000）。
     * The maximum size of the resizing element. (Defaults to 2000)
     * @type Number
     */
    this.maxSize = 2000;
    
    /**
     * 大小变化时是否产生动画效果。
     * Whether to animate the transition to the new size
     * @type Boolean
     */
    this.animate = false;
    
    /**
     * 拖拽到时候是否在页面上生成透明层。允许跨iframes拖拽。
     * Whether to create a transparent shim that overlays the page when dragging, enables dragging across iframes.
     * @type Boolean
     */
    this.useShim = false;
    
    /** @private 私有的 */
    this.shim = null;
    
    if(!existingProxy){
        /** @private 私有的*/
        this.proxy = Ext.SplitBar.createProxy(this.orientation);
    }else{
        this.proxy = Ext.get(existingProxy).dom;
    }
    /** @private 私有的 */
    this.dd = new Ext.dd.DDProxy(this.el.dom.id, "XSplitBars", {dragElId : this.proxy.id});
    
    /** @private 私有的 */
    this.dd.b4StartDrag = this.onStartProxyDrag.createDelegate(this);
    
    /** @private 私有的 */
    this.dd.endDrag = this.onEndProxyDrag.createDelegate(this);
    
    /** @private 私有的 */
    this.dragSpecs = {};
    
    /**
     * @private 
     * 放置和重置元素大小的适配器。
     * The adapter to use to positon and resize elements
     */
    this.adapter = new Ext.SplitBar.BasicLayoutAdapter();
    this.adapter.init(this);
    
    if(this.orientation == Ext.SplitBar.HORIZONTAL){
        /** @private 私有的 */
        this.placement = placement || (this.el.getX() > this.resizingEl.getX() ? Ext.SplitBar.LEFT : Ext.SplitBar.RIGHT);
        this.el.addClass("x-splitbar-h");
    }else{
        /** @private 私有的 */
        this.placement = placement || (this.el.getY() > this.resizingEl.getY() ? Ext.SplitBar.TOP : Ext.SplitBar.BOTTOM);
        this.el.addClass("x-splitbar-v");
    }
    
    this.addEvents(
        /**
         * @event resize
         * 当分割控件移动的时候激发（{@link #event-moved}的别名）。
         * Fires when the splitter is moved (alias for {@link #moved})
         * @param {Ext.SplitBar} this
         * @param {Number} newSize 新的高度或者宽度。the new width or height
         */
        "resize",
        /**
         * @event moved
         * 当分割控件移动的时候激发。
         * Fires when the splitter is moved
         * @param {Ext.SplitBar} this
         * @param {Number} newSize 新的高度或者宽度。the new width or height
         */
        "moved",
        /**
         * @event beforeresize
         * 当分割控件被拖拽的时候激发。
         * Fires before the splitter is dragged
         * @param {Ext.SplitBar} this
         */
        "beforeresize",

        "beforeapply"
    );

    Ext.SplitBar.superclass.constructor.call(this);
};

Ext.extend(Ext.SplitBar, Ext.util.Observable, {
    onStartProxyDrag : function(x, y){
        this.fireEvent("beforeresize", this);
        this.overlay =  Ext.DomHelper.append(document.body,  {cls: "x-drag-overlay", html: "&#160;"}, true);
        this.overlay.unselectable();
        this.overlay.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
        this.overlay.show();
        Ext.get(this.proxy).setDisplayed("block");
        var size = this.adapter.getElementSize(this);
        this.activeMinSize = this.getMinimumSize();
        this.activeMaxSize = this.getMaximumSize();
        var c1 = size - this.activeMinSize;
        var c2 = Math.max(this.activeMaxSize - size, 0);
        if(this.orientation == Ext.SplitBar.HORIZONTAL){
            this.dd.resetConstraints();
            this.dd.setXConstraint(
                this.placement == Ext.SplitBar.LEFT ? c1 : c2, 
                this.placement == Ext.SplitBar.LEFT ? c2 : c1,
                this.tickSize
            );
            this.dd.setYConstraint(0, 0);
        }else{
            this.dd.resetConstraints();
            this.dd.setXConstraint(0, 0);
            this.dd.setYConstraint(
                this.placement == Ext.SplitBar.TOP ? c1 : c2, 
                this.placement == Ext.SplitBar.TOP ? c2 : c1,
                this.tickSize
            );
         }
        this.dragSpecs.startSize = size;
        this.dragSpecs.startPoint = [x, y];
        Ext.dd.DDProxy.prototype.b4StartDrag.call(this.dd, x, y);
    },
    
    /** 
     * @private 私有的 
     * 拖拽后由DDProxy调用。
     * Called after the drag operation by the DDProxy
     */
    onEndProxyDrag : function(e){
        Ext.get(this.proxy).setDisplayed(false);
        var endPoint = Ext.lib.Event.getXY(e);
        if(this.overlay){
            Ext.destroy(this.overlay);
            delete this.overlay;
        }
        var newSize;
        if(this.orientation == Ext.SplitBar.HORIZONTAL){
            newSize = this.dragSpecs.startSize + 
                (this.placement == Ext.SplitBar.LEFT ?
                    endPoint[0] - this.dragSpecs.startPoint[0] :
                    this.dragSpecs.startPoint[0] - endPoint[0]
                );
        }else{
            newSize = this.dragSpecs.startSize + 
                (this.placement == Ext.SplitBar.TOP ?
                    endPoint[1] - this.dragSpecs.startPoint[1] :
                    this.dragSpecs.startPoint[1] - endPoint[1]
                );
        }
        newSize = Math.min(Math.max(newSize, this.activeMinSize), this.activeMaxSize);
        if(newSize != this.dragSpecs.startSize){
            if(this.fireEvent('beforeapply', this, newSize) !== false){
                this.adapter.setElementSize(this, newSize);
                this.fireEvent("moved", this, newSize);
                this.fireEvent("resize", this, newSize);
            }
        }
    },
    
    /**
     * 获取分割控件的适配器。
     * Get the adapter this SplitBar uses
     * @return 适配器对象。The adapter object
     */
    getAdapter : function(){
        return this.adapter;
    },
    
    /**
     * 设置分割控件的适配器。
     * Set the adapter this SplitBar uses
     * @param {Object} adapter SplitBar适配器对象。A SplitBar adapter object
     */
    setAdapter : function(adapter){
        this.adapter = adapter;
        this.adapter.init(this);
    },
    
    /**
     *　获取该元素可缩放的最小值。
     * Gets the minimum size for the resizing element
     * @return {Number} 最小尺寸。The minimum size
     */
    getMinimumSize : function(){
        return this.minSize;
    },
    
    /**
     * 设置该元素可缩放的最小值。
     * Sets the minimum size for the resizing element
     * @param {Number} minSize 最小的尺寸值。The minimum size
     */
    setMinimumSize : function(minSize){
        this.minSize = minSize;
    },
    
    /**
     * 获取该元素可缩放的最大值。
     * Gets the maximum size for the resizing element
     * @return {Number} 最大尺寸值。The maximum size
     */
    getMaximumSize : function(){
        return this.maxSize;
    },
    
    /**
     * 设置该元素可缩放的最大值。
     * Sets the maximum size for the resizing element
     * @param {Number} maxSize 最大尺寸值。The maximum size
     */
    setMaximumSize : function(maxSize){
        this.maxSize = maxSize;
    },
    
    /**
     * 设置该元素初始化可缩放值。
     * Sets the initialize size for the resizing element
     * @param {Number} size 初始化值。The initial size
     */
    setCurrentSize : function(size){
        var oldAnimate = this.animate;
        this.animate = false;
        this.adapter.setElementSize(this, size);
        this.animate = oldAnimate;
    },
    
    /**
     * 毁分割控件发。
     * Destroy this splitbar. 
     * @param {Boolean} removeEl　一处分割控件。True to remove the element
     */
    destroy : function(removeEl){
        if(this.shim){
            this.shim.remove();
        }
        this.dd.unreg();
        Ext.destroy(Ext.get(this.proxy));
        if(removeEl){
            this.el.remove();
        }
    }
});

/**
 * @private static　
 * 静态的 
 * 创建自己的代理元素，使得在不同的浏览器中，组件的大小都一致。使用背景色而不使用borders。
 * Create our own proxy element element. So it will be the same same size on all browsers, we won't use borders. Instead we use a background color.
 */
Ext.SplitBar.createProxy = function(dir){
    var proxy = new Ext.Element(document.createElement("div"));
    proxy.unselectable();
    var cls = 'x-splitbar-proxy';
    proxy.addClass(cls + ' ' + (dir == Ext.SplitBar.HORIZONTAL ? cls +'-h' : cls + '-v'));
    document.body.appendChild(proxy.dom);
    return proxy.dom;
};

/** 
 * @class Ext.SplitBar.BasicLayoutAdapter
 * 默认的适配器。假设分割组件和可伸缩组件没有被预先定位，并且只能获取/设置元素的宽度。一般用于基于table到布局。
 * Default Adapter. It assumes the splitter and resizing element are not positioned
 * elements and only gets/sets the width of the element. Generally used for table based layouts.
 */
Ext.SplitBar.BasicLayoutAdapter = function(){
};

Ext.SplitBar.BasicLayoutAdapter.prototype = {
    // do nothing for now
    init : function(s){
    
    },
    /**
     * 在拖拽操作前调用，用于获取被缩放的元素的当前大小。
     * Called before drag operations to get the current size of the resizing element. 
     * @param {Ext.SplitBar} s 使用该适配器的SplitBar对象。The SplitBar using this adapter
     */
     getElementSize : function(s){
        if(s.orientation == Ext.SplitBar.HORIZONTAL){
            return s.resizingEl.getWidth();
        }else{
            return s.resizingEl.getHeight();
        }
    },
    
    /**
     * 在拖拽操作后调用，用于设置被缩放的元素的大小。
     * Called after drag operations to set the size of the resizing element.
     * @param {Ext.SplitBar} s 使用该适配器的SplitBar对象。The SplitBar using this adapter
     * @param {Number} newSize 要设置的新尺寸。The new size to set
     * @param {Function} onComplete 缩放完成后调用的函数。A function to be invoked when resizing is complete
     */
    setElementSize : function(s, newSize, onComplete){
        if(s.orientation == Ext.SplitBar.HORIZONTAL){
            if(!s.animate){
                s.resizingEl.setWidth(newSize);
                if(onComplete){
                    onComplete(s, newSize);
                }
            }else{
                s.resizingEl.setWidth(newSize, true, .1, onComplete, 'easeOut');
            }
        }else{
            
            if(!s.animate){
                s.resizingEl.setHeight(newSize);
                if(onComplete){
                    onComplete(s, newSize);
                }
            }else{
                s.resizingEl.setHeight(newSize, true, .1, onComplete, 'easeOut');
            }
        }
    }
};

/** 
 *@class Ext.SplitBar.AbsoluteLayoutAdapter
 * @extends Ext.SplitBar.BasicLayoutAdapter
 * 是分割控件与缩放元素对其的适配器。使用绝对定位的分割控件的时候使用。
 * Adapter that  moves the splitter element to align with the resized sizing element. 
 * Used with an absolute positioned SplitBar.
 * @param {Mixed} container 包围绝对定位的分割控件的容器。如果该容器是document.body一定要给该控件指定一个ID。
 * The container that wraps around the absolute positioned content. If it's
 * document.body, make sure you assign an id to the body element.
 */
Ext.SplitBar.AbsoluteLayoutAdapter = function(container){
    this.basic = new Ext.SplitBar.BasicLayoutAdapter();
    this.container = Ext.get(container);
};

Ext.SplitBar.AbsoluteLayoutAdapter.prototype = {
    init : function(s){
        this.basic.init(s);
    },
    
    getElementSize : function(s){
        return this.basic.getElementSize(s);
    },
    
    setElementSize : function(s, newSize, onComplete){
        this.basic.setElementSize(s, newSize, this.moveSplitter.createDelegate(this, [s]));
    },
    
    moveSplitter : function(s){
        var yes = Ext.SplitBar;
        switch(s.placement){
            case yes.LEFT:
                s.el.setX(s.resizingEl.getRight());
                break;
            case yes.RIGHT:
                s.el.setStyle("right", (this.container.getWidth() - s.resizingEl.getLeft()) + "px");
                break;
            case yes.TOP:
                s.el.setY(s.resizingEl.getBottom());
                break;
            case yes.BOTTOM:
                s.el.setY(s.resizingEl.getTop() - s.el.getHeight());
                break;
        }
    }
};

/**
 * 方向常量-创建一个垂直分割控件。
 * Orientation constant - Create a vertical SplitBar
 * @static
 * @type Number
 */
Ext.SplitBar.VERTICAL = 1;

/**
 * 方向常量-创建一个水平分割控件。
 * Orientation constant - Create a horizontal SplitBar
 * @static
 * @type Number
 */
Ext.SplitBar.HORIZONTAL = 2;

/**
 * 定位常量 - 缩放元素在分割控件的左边。
 * Placement constant - The resizing element is to the left of the splitter element
 * @static
 * @type Number
 */
Ext.SplitBar.LEFT = 1;

/**
 * 定位常量 - 缩放元素在分割控件的右边。
 * Placement constant - The resizing element is to the right of the splitter element
 * @static
 * @type Number
 */
Ext.SplitBar.RIGHT = 2;

/**
 * 定位常量 - 缩放元素在分割控件的上面。
 * Placement constant - The resizing element is positioned above the splitter element
 * @static
 * @type Number
 */
Ext.SplitBar.TOP = 3;

/**
 * 定位常量 - 缩放元素在分割控件的下面。
 * Placement constant - The resizing element is positioned under splitter element
 * @static
 * @type Number
 */
Ext.SplitBar.BOTTOM = 4;
