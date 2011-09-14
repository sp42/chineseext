/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.Resizable
 * @extends Ext.util.Observable
 * <p>在元素上应用拖动柄以使其支持缩放。拖动柄是嵌入在元素内部的且采用了绝对定位。某些元素, 如文本域或图片, 不支持这种做法。为了克服这种情况, 你可以把文本域打包在一个 Div 内, 并把 "resizeChild" 属性设为 true(或者指向元素的 ID), <b>或者</b>在配置项中设置 wrap 属性为 true, 元素就会被自动打包了。</p>
 * <p>下面是有效的拖动柄的值列表:</p>
 * <p>Applies drag handles to an element to make it resizable. The drag handles are inserted into the element 
 * and positioned absolute. Some elements, such as a textarea or image, don't support this. To overcome that, you can wrap
 * the textarea in a div and set "resizeChild" to true (or to the id of the element), <b>or</b> set wrap:true in your config and
 * the element will be wrapped for you automatically.</p>
 * <p>Here is the list of valid resize handles:</p>
 * <pre>
Value   Description
 值      说明
------  -------------------
  'n'     北(north)
 's'     南(south)
 'e'     东(east)
 'w'     西(west)
 'nw'    西北(northwest)
 'sw'    西南(southwest)
 'se'    东北(southeast)
 'ne'    东南(northeast)
 'all'   所有(all)
</pre>
 * <p>下面是展示的是创建一个典型的 Resizable 对象的例子: Here's an example showing the creation of a typical Resizable:</p>
 * <pre><code>
var resizer = new Ext.Resizable("element-id", {
    handles: 'all',
    minWidth: 200,
    minHeight: 100,
    maxWidth: 500,
    maxHeight: 400,
    pinned: true
});
resizer.on("resize", myHandler);
</code></pre>
 * <p>想要隐藏某个缩放柄, 可以将它的CSS样式中的 display 属性设为 none, 或者通过脚本来实现: To hide a particular handle, set its display to none in CSS, or through script:<br>
 * resizer.east.setDisplayed(false);</p>
 * @cfg {Boolean/String/Element} resizeChild 值为 true 时缩放首个子对象, 或者值为 id/element 时缩放指定对象(默认为 false)。
 * True to resize the first child, or id/element to resize (defaults to false)
 * @cfg {Array/String} adjustments 可以是字串 "auto" 或者形如 [width, height] 的数组， 其值会在执行缩放操作的时候被<b>加入</b>。(默认为 [0, 0])。
 * String "auto" or an array [width, height] with values to be <b>added</b> to the
 * resize operation's new size (defaults to [0, 0])
 * @cfg {Number} minWidth 元素允许的最小宽度(默认为 5)。
 * The minimum width for the element (defaults to 5)
 * @cfg {Number} minHeight 元素允许的最小高度(默认为 5)。
 * The minimum height for the element (defaults to 5)
 * @cfg {Number} maxWidth 元素允许的最大宽度(默认为 10000)。
 * The maximum width for the element (defaults to 10000)
 * @cfg {Number} maxHeight 元素允许的最大高度(默认为 10000)。
 * The maximum height for the element (defaults to 10000)
 * @cfg {Boolean} enabled 设为 false 可禁止缩放(默认为 true)。
 * False to disable resizing (defaults to true)
 * @cfg {Boolean} wrap 设为 true 则在需要的时候将元素用 div 打包(文本域和图片对象必须设置此属性, 默认为 false)。
 * True to wrap an element with a div if needed (required for textareas and images, defaults to false)
 * @cfg {Number} width 以像素表示的元素宽度(默认为 null)。
 * The width of the element in pixels (defaults to null)
 * @cfg {Number} height 以像素表示的元素高度(默认为 null)。
 * The height of the element in pixels (defaults to null)
 * @cfg {Boolean} animate 设为 true 则在缩放时展示动画效果(不可与 dynamic 同时使用, 默认为 false)。
 * True to animate the resize (not compatible with dynamic sizing, defaults to false)
 * @cfg {Number} duration 当 animate = true 时动画持续的时间(默认为 .35)。
 * Animation duration if animate = true (defaults to .35)
 * @cfg {Boolean} dynamic 设为 true 则对元素进行实时缩放而不使用代理(默认为 false)。True to resize the element while dragging instead of using a proxy (defaults to false)
 * @cfg {String} handles 由要显示的缩放柄组成的字串(默认为 undefined) String consisting of the resize handles to display (defaults to undefined)
 * @cfg {Boolean} multiDirectional <b>Deprecated</b>. 以前的添加多向缩放柄的方式，建议使用 handles 属性。(默认为 false)  The old style of adding multi-direction resize handles, deprecated
 * in favor of the handles config option (defaults to false)
 * @cfg {Boolean} disableTrackOver 设为 true 则禁止鼠标跟踪。此属性仅在配置对象时可用。(默认为 false)。True to disable mouse tracking. This is only applied at config time. (defaults to false)
 * @cfg {String} easing 指定当 animate = true 时的动画效果(默认为 'easingOutStrong')。Animation easing if animate = true (defaults to 'easingOutStrong')
 * @cfg {Number} widthIncrement 以像素表示的宽度缩放增量(dynamic 属性必须为 true, 默认为 0)。The increment to snap the width resize in pixels (dynamic must be true, defaults to 0)
 * @cfg {Number} heightIncrement 以像素表示的高度缩放增量(dynamic 属性必须为 true, 默认为 0)。The increment to snap the height resize in pixels (dynamic must be true, defaults to 0)
 * @cfg {Boolean} pinned 设为 true 则保持缩放柄总是可见，false 则只在用户将鼠标经过 resizable 对象的边框时显示缩放柄。此属性仅在配置对象时可用。(默认为 false)。True to ensure that the resize handles are always visible, false to display them only when the
 * user mouses over the resizable borders. This is only applied at config time. (defaults to false)
 * @cfg {Boolean} preserveRatio 设为 true 则在缩放时保持对象的原始长宽比(默认为 false)。True to preserve the original ratio between height and width during resize (defaults to false)
 * @cfg {Boolean} transparent 设为 true 则将缩放柄设为透明。此属性仅在配置对象时可用。(默认为 false)。True for transparent handles. This is only applied at config time. (defaults to false)
 * @cfg {Number} minX The minimum allowed page X for the element (仅用于向左缩放时, 默认为 0) (only used for west resizing, defaults to 0)
 * @cfg {Number} minY The minimum allowed page Y for the element (仅用于向上缩放时, 默认为 0) (only used for north resizing, defaults to 0)
 * @cfg {Boolean} draggable 便利的初始化拖移的方法(默认为 false)。Convenience to initialize drag drop (defaults to false)
 * @constructor
 * 创建一个 resizable 对象。Create a new resizable component
 * @param {Mixed} el 要缩放的对象的 id 或 element 对象。The id or element to resize
 * @param {Object} config 配置项对象。configuration options
  */
Ext.Resizable = function(el, config){
    this.el = Ext.get(el);
    
    if(config && config.wrap){
        config.resizeChild = this.el;
        this.el = this.el.wrap(typeof config.wrap == "object" ? config.wrap : {cls:"xresizable-wrap"});
        this.el.id = this.el.dom.id = config.resizeChild.id + "-rzwrap";
        this.el.setStyle("overflow", "hidden");
        this.el.setPositioning(config.resizeChild.getPositioning());
        config.resizeChild.clearPositioning();
        if(!config.width || !config.height){
            var csize = config.resizeChild.getSize();
            this.el.setSize(csize.width, csize.height);
        }
        if(config.pinned && !config.adjustments){
            config.adjustments = "auto";
        }
    }

    /**
     * 调节期间，代替真实元素的那个代理元素。
     * 有时可能要{@link Ext.Element#getBox}方法提供相应的新区域。
     * The proxy Element that is resized in place of the real Element during the resize operation.
     * This may be queried using {@link Ext.Element#getBox} to provide the new area to resize to.
     * Read only.
     * @type Ext.Element.
     * @property proxy
     */
    this.proxy = this.el.createProxy({tag: "div", cls: "x-resizable-proxy", id: this.el.id + "-rzproxy"}, Ext.getBody());
    this.proxy.unselectable();
    this.proxy.enableDisplayMode('block');

    Ext.apply(this, config);
    
    if(this.pinned){
        this.disableTrackOver = true;
        this.el.addClass("x-resizable-pinned");
    }
    // if the element isn't positioned, make it relative
    var position = this.el.getStyle("position");
    if(position != "absolute" && position != "fixed"){
        this.el.setStyle("position", "relative");
    }
    if(!this.handles){ // no handles passed, must be legacy style
        this.handles = 's,e,se';
        if(this.multiDirectional){
            this.handles += ',n,w';
        }
    }
    if(this.handles == "all"){
        this.handles = "n s e w ne nw se sw";
    }
    var hs = this.handles.split(/\s*?[,;]\s*?| /);
    var ps = Ext.Resizable.positions;
    for(var i = 0, len = hs.length; i < len; i++){
        if(hs[i] && ps[hs[i]]){
            var pos = ps[hs[i]];
            this[pos] = new Ext.Resizable.Handle(this, pos, this.disableTrackOver, this.transparent);
        }
    }
    // legacy
    this.corner = this.southeast;
    
    if(this.handles.indexOf("n") != -1 || this.handles.indexOf("w") != -1){
        this.updateBox = true;
    }   
   
    this.activeHandle = null;
    
    if(this.resizeChild){
        if(typeof this.resizeChild == "boolean"){
            this.resizeChild = Ext.get(this.el.dom.firstChild, true);
        }else{
            this.resizeChild = Ext.get(this.resizeChild, true);
        }
    }
    
    if(this.adjustments == "auto"){
        var rc = this.resizeChild;
        var hw = this.west, he = this.east, hn = this.north, hs = this.south;
        if(rc && (hw || hn)){
            rc.position("relative");
            rc.setLeft(hw ? hw.el.getWidth() : 0);
            rc.setTop(hn ? hn.el.getHeight() : 0);
        }
        this.adjustments = [
            (he ? -he.el.getWidth() : 0) + (hw ? -hw.el.getWidth() : 0),
            (hn ? -hn.el.getHeight() : 0) + (hs ? -hs.el.getHeight() : 0) -1 
        ];
    }
    
    if(this.draggable){
        this.dd = this.dynamic ? 
            this.el.initDD(null) : this.el.initDDProxy(null, {dragElId: this.proxy.id});
        this.dd.setHandleElId(this.resizeChild ? this.resizeChild.id : this.el.id);
    }
    
    // public events
    this.addEvents(
        "beforeresize",
        "resize"
    );
    
    if(this.width !== null && this.height !== null){
        this.resizeTo(this.width, this.height);
    }else{
        this.updateChildSize();
    }
    if(Ext.isIE){
        this.el.dom.style.zoom = 1;
    }
    Ext.Resizable.superclass.constructor.call(this);
};

Ext.extend(Ext.Resizable, Ext.util.Observable, {
        resizeChild : false,
        adjustments : [0, 0],
        minWidth : 5,
        minHeight : 5,
        maxWidth : 10000,
        maxHeight : 10000,
        enabled : true,
        animate : false,
        duration : .35,
        dynamic : false,
        handles : false,
        multiDirectional : false,
        disableTrackOver : false,
        easing : 'easeOutStrong',
        widthIncrement : 0,
        heightIncrement : 0,
        pinned : false,
        width : null,
        height : null,
        preserveRatio : false,
        transparent: false,
        minX: 0,
        minY: 0,
        draggable: false,

        /**
         * @cfg {Mixed} constrainTo 强制缩放到一个指定的元素。
         * Constrain the resize to a particular element
         */
        /**
         * @cfg {Ext.lib.Region} resizeRegion 强制缩放到一个指定区域。
         * Constrain the resize to a particular region
         */

        /**
         * @event beforeresize
         * 在缩放被实施之前触发。设置 enabled 为 false 可以取消缩放。
         * Fired before resize is allowed. Set enabled to false to cancel resize.
         * @param {Ext.Resizable} this
         * @param {Ext.EventObject} e mousedown事件。The mousedown event
         */
        /**
         * @event resize
         * 缩放之后触发。
         * Fired after a resize.
         * @param {Ext.Resizable} this
         * @param {Number} width 新的宽度。The new width
         * @param {Number} height 新的高度。The new height
         * @param {Ext.EventObject} e mouseup事件。The mouseup event
         */
    
    /**
     * 执行手动缩放。
     * Perform a manual resize
     * @param {Number} width
     * @param {Number} height
     */
    resizeTo : function(width, height){
        this.el.setSize(width, height);
        this.updateChildSize();
        this.fireEvent("resize", this, width, height, null);
    },

    // private
    startSizing : function(e, handle){
        this.fireEvent("beforeresize", this, e);
        if(this.enabled){ // 2nd enabled check in case disabled before beforeresize handler

            if(!this.overlay){
                this.overlay = this.el.createProxy({tag: "div", cls: "x-resizable-overlay", html: "&#160;"}, Ext.getBody());
                this.overlay.unselectable();
                this.overlay.enableDisplayMode("block");
                this.overlay.on("mousemove", this.onMouseMove, this);
                this.overlay.on("mouseup", this.onMouseUp, this);
            }
            this.overlay.setStyle("cursor", handle.el.getStyle("cursor"));

            this.resizing = true;
            this.startBox = this.el.getBox();
            this.startPoint = e.getXY();
            this.offsets = [(this.startBox.x + this.startBox.width) - this.startPoint[0],
                            (this.startBox.y + this.startBox.height) - this.startPoint[1]];

            this.overlay.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
            this.overlay.show();

            if(this.constrainTo) {
                var ct = Ext.get(this.constrainTo);
                this.resizeRegion = ct.getRegion().adjust(
                    ct.getFrameWidth('t'),
                    ct.getFrameWidth('l'),
                    -ct.getFrameWidth('b'),
                    -ct.getFrameWidth('r')
                );
            }

            this.proxy.setStyle('visibility', 'hidden'); // workaround display none
            this.proxy.show();
            this.proxy.setBox(this.startBox);
            if(!this.dynamic){
                this.proxy.setStyle('visibility', 'visible');
            }
        }
    },

    // private
    onMouseDown : function(handle, e){
        if(this.enabled){
            e.stopEvent();
            this.activeHandle = handle;
            this.startSizing(e, handle);
        }          
    },

    // private
    onMouseUp : function(e){
        var size = this.resizeElement();
        this.resizing = false;
        this.handleOut();
        this.overlay.hide();
        this.proxy.hide();
        this.fireEvent("resize", this, size.width, size.height, e);
    },

    // private
    updateChildSize : function(){
        if(this.resizeChild){
            var el = this.el;
            var child = this.resizeChild;
            var adj = this.adjustments;
            if(el.dom.offsetWidth){
                var b = el.getSize(true);
                child.setSize(b.width+adj[0], b.height+adj[1]);
            }
            // Second call here for IE
            // The first call enables instant resizing and
            // the second call corrects scroll bars if they
            // exist
            if(Ext.isIE){
                setTimeout(function(){
                    if(el.dom.offsetWidth){
                        var b = el.getSize(true);
                        child.setSize(b.width+adj[0], b.height+adj[1]);
                    }
                }, 10);
            }
        }
    },

    // private
    snap : function(value, inc, min){
        if(!inc || !value) return value;
        var newValue = value;
        var m = value % inc;
        if(m > 0){
            if(m > (inc/2)){
                newValue = value + (inc-m);
            }else{
                newValue = value - m;
            }
        }
        return Math.max(min, newValue);
    },

    /**
     * <p>
     * 对相关的元素进行大小调节。该方法是类的内部方法，不该由用户的代码所调用。
     * Performs resizing of the associated Element. This method is called internally by this
     * class, and should not be called by user code.
     * </p>
     * <p>如果Resizable用于一个复杂的UI的组件之元素，如Panel，
     * 那么该方法可能由实作来重写，以便在最后的mouseup事件有特殊的操作，例如对Panel面板的大小调节，就取决于Panel的内容。
     * If a Resizable is being used to resize an Element which encapsulates a more complex UI
     * component such as a Panel, this method may be overridden by specifying an implementation
     * as a config option to provide appropriate behaviour at the end of the resize operation on
     * mouseup, for example resizing the Panel, and relaying the Panel's content.</p>
     * <p>
     * 调节过后的新区域可以通过检查{@link #proxy}元素状态的情况而得知。例如：
     * The new area to be resized to is available by examining the state of the {@link #proxy}
     * Element. Example:
<pre><code>
new Ext.Panel({
    title: 'Resize me',
    x: 100,
    y: 100,
    renderTo: Ext.getBody(),
    floating: true,
    frame: true,
    width: 400,
    height: 200,
    listeners: {
        render: function(p) {
            new Ext.Resizable(p.getEl(), {
                handles: 'all',
                pinned: true,
                transparent: true,
                resizeElement: function() {
                    var box = this.proxy.getBox();
                    p.updateBox(box);
                    if (p.layout) {
                        p.doLayout();
                    }
                    return box;
                }
           });
       }
    }
}).show();
</code></pre>
     */
    resizeElement : function(){
        var box = this.proxy.getBox();
        if(this.updateBox){
            this.el.setBox(box, false, this.animate, this.duration, null, this.easing);
        }else{
            this.el.setSize(box.width, box.height, this.animate, this.duration, null, this.easing);
        }
        this.updateChildSize();
        if(!this.dynamic){
            this.proxy.hide();
        }
        return box;
    },

    // private
    constrain : function(v, diff, m, mx){
        if(v - diff < m){
            diff = v - m;    
        }else if(v - diff > mx){
            diff = mx - v; 
        }
        return diff;                
    },

    // private
    onMouseMove : function(e){
        if(this.enabled){
            try{// try catch so if something goes wrong the user doesn't get hung

            if(this.resizeRegion && !this.resizeRegion.contains(e.getPoint())) {
                return;
            }

            //var curXY = this.startPoint;
            var curSize = this.curSize || this.startBox;
            var x = this.startBox.x, y = this.startBox.y;
            var ox = x, oy = y;
            var w = curSize.width, h = curSize.height;
            var ow = w, oh = h;
            var mw = this.minWidth, mh = this.minHeight;
            var mxw = this.maxWidth, mxh = this.maxHeight;
            var wi = this.widthIncrement;
            var hi = this.heightIncrement;
            
            var eventXY = e.getXY();
            var diffX = -(this.startPoint[0] - Math.max(this.minX, eventXY[0]));
            var diffY = -(this.startPoint[1] - Math.max(this.minY, eventXY[1]));
            
            var pos = this.activeHandle.position;
            
            switch(pos){
                case "east":
                    w += diffX; 
                    w = Math.min(Math.max(mw, w), mxw);
                    break;
                case "south":
                    h += diffY;
                    h = Math.min(Math.max(mh, h), mxh);
                    break;
                case "southeast":
                    w += diffX; 
                    h += diffY;
                    w = Math.min(Math.max(mw, w), mxw);
                    h = Math.min(Math.max(mh, h), mxh);
                    break;
                case "north":
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    break;
                case "west":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    x += diffX;
                    w -= diffX;
                    break;
                case "northeast":
                    w += diffX; 
                    w = Math.min(Math.max(mw, w), mxw);
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    break;
                case "northwest":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    x += diffX;
                    w -= diffX;
                    break;
               case "southwest":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    h += diffY;
                    h = Math.min(Math.max(mh, h), mxh);
                    x += diffX;
                    w -= diffX;
                    break;
            }
            
            var sw = this.snap(w, wi, mw);
            var sh = this.snap(h, hi, mh);
            if(sw != w || sh != h){
                switch(pos){
                    case "northeast":
                        y -= sh - h;
                    break;
                    case "north":
                        y -= sh - h;
                        break;
                    case "southwest":
                        x -= sw - w;
                    break;
                    case "west":
                        x -= sw - w;
                        break;
                    case "northwest":
                        x -= sw - w;
                        y -= sh - h;
                    break;
                }
                w = sw;
                h = sh;
            }
            
            if(this.preserveRatio){
                switch(pos){
                    case "southeast":
                    case "east":
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        w = ow * (h/oh);
                       break;
                    case "south":
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                        break;
                    case "northeast":
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                    break;
                    case "north":
                        var tw = w;
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                        x += (tw - w) / 2;
                        break;
                    case "southwest":
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        var tw = w;
                        w = ow * (h/oh);
                        x += tw - w;
                        break;
                    case "west":
                        var th = h;
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        y += (th - h) / 2;
                        var tw = w;
                        w = ow * (h/oh);
                        x += tw - w;
                       break;
                    case "northwest":
                        var tw = w;
                        var th = h;
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        w = ow * (h/oh);
                        y += th - h;
                         x += tw - w;
                       break;
                        
                }
            }
            this.proxy.setBounds(x, y, w, h);
            if(this.dynamic){
                this.resizeElement();
            }
            }catch(e){}
        }
    },

    // private
    handleOver : function(){
        if(this.enabled){
            this.el.addClass("x-resizable-over");
        }
    },

    // private
    handleOut : function(){
        if(!this.resizing){
            this.el.removeClass("x-resizable-over");
        }
    },
    
    /**
     * 返回此组件绑定的element对象。
     * Returns the element this component is bound to.
     * @return {Ext.Element}
     */
    getEl : function(){
        return this.el;
    },
    
    /**
     * 返回resizeChild属性指定的element对象（如果没有则返回null）。 
     * Returns the resizeChild element (or null).
     * @return {Ext.Element}
     */
    getResizeChild : function(){
        return this.resizeChild;
    },
    
    /**
     * 销毁此resizable对象。如果元素被打包且 removeEl 属性不为 true 则元素会保留。
     * Destroys this resizable. If the element was wrapped and removeEl is not true then the element remains.
     * @param {Boolean} removeEl （可选的）设为 true 则从 DOM 中删除此元素。(optional) true to remove the element from the DOM
     */
    destroy : function(removeEl){
        if(this.dd){
            this.dd.destroy();
        }
        if(this.overlay){
            Ext.destroy(this.overlay);
            this.overlay = null;
        }
        Ext.destroy(this.proxy);
        this.proxy = null;
        
        var ps = Ext.Resizable.positions;
        for(var k in ps){
            if(typeof ps[k] != "function" && this[ps[k]]){
                this[ps[k]].destroy();
            }
        }
        if(removeEl){
            this.el.update("");
            Ext.destroy(this.el);
            this.el = null;
        }
    },

    syncHandleHeight : function(){
        var h = this.el.getHeight(true);
        if(this.west){
            this.west.el.setHeight(h);
        }
        if(this.east){
            this.east.el.setHeight(h);
        }
    }
});

// private
// hash to map config positions to true positions
Ext.Resizable.positions = {
    n: "north", s: "south", e: "east", w: "west", se: "southeast", sw: "southwest", nw: "northwest", ne: "northeast"
};

// private
Ext.Resizable.Handle = function(rz, pos, disableTrackOver, transparent){
    if(!this.tpl){
        // only initialize the template if resizable is used
        var tpl = Ext.DomHelper.createTemplate(
            {tag: "div", cls: "x-resizable-handle x-resizable-handle-{0}"}
        );
        tpl.compile();
        Ext.Resizable.Handle.prototype.tpl = tpl;
    }
    this.position = pos;
    this.rz = rz;
    this.el = this.tpl.append(rz.el.dom, [this.position], true);
    this.el.unselectable();
    if(transparent){
        this.el.setOpacity(0);
    }
    this.el.on("mousedown", this.onMouseDown, this);
    if(!disableTrackOver){
        this.el.on("mouseover", this.onMouseOver, this);
        this.el.on("mouseout", this.onMouseOut, this);
    }
};

// private
Ext.Resizable.Handle.prototype = {
    // private
    afterResize : function(rz){
        // do nothing    
    },
    // private
    onMouseDown : function(e){
        this.rz.onMouseDown(this, e);
    },
    // private
    onMouseOver : function(e){
        this.rz.handleOver(this, e);
    },
    // private
    onMouseOut : function(e){
        this.rz.handleOut(this, e);
    },
    // private
    destroy : function(){
        Ext.destroy(this.el);
        this.el = null;
    }
};



