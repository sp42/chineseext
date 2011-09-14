/**
 * @class Ext.SplitBar
 * @extends Ext.util.Observable
 * 由DOM元素创建可拖拽的分割控件(可以拖拽和改变的大小的元素)。
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
 * @构造函数
 * 创建一个新的分割控件
 * @参数 {Mixed} 拖拽到元素 作为分割控件被拖拽到元素。
 * @参数 {Mixed} 可收缩大小的元素  根据 分割控件 到拖拽缩放大小的元素
 * @参数 {Number} 方向 (可选)   Ext.SplitBar.HORIZONTAL 或者Ext.SplitBar.VERTICAL. (默认为 HORIZONTAL)
 * @参数 {Number} 方位 (可选)  水平方向上，Ext.SplitBar.LEFT 或者 Ext.SplitBar.RIGHT   
                        垂直方向上，Ext.SplitBar.TOP或 Ext.SplitBar.BOTTOM。(默认的会根据SplitBar初始化的位置自己决定)。
 */
Ext.SplitBar = function(dragElement, resizingElement, orientation, placement, existingProxy){
    
    /**@私有的 */
    this.el = Ext.get(dragElement, true);
    this.el.dom.unselectable = "on";
    /**@私有的 */
    this.resizingEl = Ext.get(resizingElement, true);

    /**
     * @私有的
     * 分割控件的方向。Ext.SplitBar.HORIZONTAL 或者 Ext.SplitBar.VERTICAL. (默认为 HORIZONTAL)
     * Note: 如果在分割控件被创建后修改该属性，placement属性必须要手动修改
     * @type Number
     */
    this.orientation = orientation || Ext.SplitBar.HORIZONTAL;
    
    /**
     * 可缩放元素的最小值(默认为 0)
     * @type Number
     */
    this.minSize = 0;
    
    /**
     * 可缩放元素的最大值。 (默认为 2000)
     * @type Number
     */
    this.maxSize = 2000;
    
    /**
     * 大小变化时是否产生动画效果
     * @type Boolean
     */
    this.animate = false;
    
    /**
     * 拖拽到时候是否在页面上生成透明层。允许跨iframes拖拽
     * @type Boolean
     */
    this.useShim = false;
    
    /**@私有的 */
    this.shim = null;
    
    if(!existingProxy){
        /**@私有的 */
        this.proxy = Ext.SplitBar.createProxy(this.orientation);
    }else{
        this.proxy = Ext.get(existingProxy).dom;
    }
    /**@私有的 */
    this.dd = new Ext.dd.DDProxy(this.el.dom.id, "XSplitBars", {dragElId : this.proxy.id});
    
    /**@私有的 */
    this.dd.b4StartDrag = this.onStartProxyDrag.createDelegate(this);
    
    /**@私有的 */
    this.dd.endDrag = this.onEndProxyDrag.createDelegate(this);
    
    /**@私有的 */
    this.dragSpecs = {};
    
    /**
     *@私有的 放置和重置元素大小的适配器
     */
    this.adapter = new Ext.SplitBar.BasicLayoutAdapter();
    this.adapter.init(this);
    
    if(this.orientation == Ext.SplitBar.HORIZONTAL){
        /**@私有的 */
        this.placement = placement || (this.el.getX() > this.resizingEl.getX() ? Ext.SplitBar.LEFT : Ext.SplitBar.RIGHT);
        this.el.addClass("x-splitbar-h");
    }else{
        /**@私有的 */
        this.placement = placement || (this.el.getY() > this.resizingEl.getY() ? Ext.SplitBar.TOP : Ext.SplitBar.BOTTOM);
        this.el.addClass("x-splitbar-v");
    }
    
    this.addEvents(
        /**
         * @event resize
         * 当分割控件移动的时候激发 ( {@link #event-moved}到别名)
         * @参数 {Ext.SplitBar} this
         * @参数 {Number} newSize 新的高度或者宽度
         */
        "resize",
        /**
         * @event moved
         * 当分割控件移动的时候激发
         * @参数 {Ext.SplitBar} this
         * @参数 {Number} newSize 新的高度或者宽度
         */
        "moved",
        /**
         * @event beforeresize
         * 当分割控件被拖拽的时候激发
         * @参数 {Ext.SplitBar} this
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
        this.activeMinSize = this.getMinimumSize();;
        this.activeMaxSize = this.getMaximumSize();;
        var c1 = size - this.activeMinSize;
        var c2 = Math.max(this.activeMaxSize - size, 0);
        if(this.orientation == Ext.SplitBar.HORIZONTAL){
            this.dd.resetConstraints();
            this.dd.setXConstraint(
                this.placement == Ext.SplitBar.LEFT ? c1 : c2, 
                this.placement == Ext.SplitBar.LEFT ? c2 : c1
            );
            this.dd.setYConstraint(0, 0);
        }else{
            this.dd.resetConstraints();
            this.dd.setXConstraint(0, 0);
            this.dd.setYConstraint(
                this.placement == Ext.SplitBar.TOP ? c1 : c2, 
                this.placement == Ext.SplitBar.TOP ? c2 : c1
            );
         }
        this.dragSpecs.startSize = size;
        this.dragSpecs.startPoint = [x, y];
        Ext.dd.DDProxy.prototype.b4StartDrag.call(this.dd, x, y);
    },
    
    /** 
     *@私有的 拖拽后由DDProxy调用
     */
    onEndProxyDrag : function(e){
        Ext.get(this.proxy).setDisplayed(false);
        var endPoint = Ext.lib.Event.getXY(e);
        if(this.overlay){
            this.overlay.remove();
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
     * 获取分割控件的适配器
     * @return The adapter object
     */
    getAdapter : function(){
        return this.adapter;
    },
    
    /**
     * 设置分割控件的适配器
     * @参数 {Object} adapter A SplitBar adapter object
     */
    setAdapter : function(adapter){
        this.adapter = adapter;
        this.adapter.init(this);
    },
    
    /**
     * 获取该元素可缩放的最小值
     * @return {Number} The minimum size
     */
    getMinimumSize : function(){
        return this.minSize;
    },
    
    /**
     * 设置该元素可缩放的最小值
     * @参数 {Number} minSize 最小的尺寸值
     */
    setMinimumSize : function(minSize){
        this.minSize = minSize;
    },
    
    /**
     * 获取该元素可缩放的最大值
     * @return {Number} The maximum size
     */
    getMaximumSize : function(){
        return this.maxSize;
    },
    
    /**
     * 设置该元素可缩放的最大值
     * @参数 {Number} maxSize 最大尺寸值
     */
    setMaximumSize : function(maxSize){
        this.maxSize = maxSize;
    },
    
    /**
     * 设置该元素初始化可缩放值
     * @参数 {Number} size 初始化值
     */
    setCurrentSize : function(size){
        var oldAnimate = this.animate;
        this.animate = false;
        this.adapter.setElementSize(this, size);
        this.animate = oldAnimate;
    },
    
    /**
     *销毁分割控件
     * @参数 {Boolean} removeEl True，一处分割控件
     */
    destroy : function(removeEl){
        if(this.shim){
            this.shim.remove();
        }
        this.dd.unreg();
        Ext.removeNode(this.proxy);
        if(removeEl){
            this.el.remove();
        }
    }
});

/**
 *@私有的 静态的 创建自己的代理元素，使得在不同的浏览器中，组件的大小都一致。使用背景色而不使用borders。
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
 * @累 Ext.SplitBar.BasicLayoutAdapter
 * 默认的适配器。假设分割组件和可伸缩组件没有被预先定位，
 * 并且只能获取/设置元素的宽度。一般用于基于table到布局。
 */
Ext.SplitBar.BasicLayoutAdapter = function(){
};

Ext.SplitBar.BasicLayoutAdapter.prototype = {
    // 暂时啥也不做
    init : function(s){
    
    },
    /**
     * 在拖拽操作前调用，用于获取被缩放的元素的当前大小。
     * @参数 {Ext.SplitBar} s The SplitBar using this adapter
     */
     getElementSize : function(s){
        if(s.orientation == Ext.SplitBar.HORIZONTAL){
            return s.resizingEl.getWidth();
        }else{
            return s.resizingEl.getHeight();
        }
    },
    
    /**
     *在拖拽操作后调用，用于设置被缩放的元素的大小 
     * @参数 {Ext.SplitBar} s The SplitBar using this adapter
     * @参数 {Number} newSize The new size to set
     * @参数 {Function} onComplete缩放完成后调用的函数
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
 *@类 Ext.SplitBar.AbsoluteLayoutAdapter
 * @父类 Ext.SplitBar.BasicLayoutAdapter
 * 是分割控件与缩放元素对其的适配器。 
 * 使用绝对定位的分割控件的时候使用。
 * @参数 {Mixed} container 包围绝对定位的分割控件的容器。 如果该容器是document.body，
 * 一定要给该控件指定一个ID
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
 * 方向常量-创建一个垂直分割控件
 * @static
 * @type Number
 */
Ext.SplitBar.VERTICAL = 1;

/**
 * 方向常量-创建一个水平分割控件s
 * @static
 * @type Number
 */
Ext.SplitBar.HORIZONTAL = 2;

/**
 *定位常量 - 缩放元素在分割控件的左边。
 * @static
 * @type Number
 */
Ext.SplitBar.LEFT = 1;

/**
 * 定位常量 - 缩放元素在分割控件的右边。
 * @static
 * @type Number
 */
Ext.SplitBar.RIGHT = 2;

/**
 *定位常量 - 缩放元素在分割控件的上面。
 * @static
 * @type Number
 */
Ext.SplitBar.TOP = 3;

/**
 * 定位常量 - 缩放元素在分割控件的下面。
 * @static
 * @type Number
 */
Ext.SplitBar.BOTTOM = 4;
