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
 * @class Ext.Slider
 * @extends Ext.BoxComponent
 * 滑动条控件支持垂直或水平方向滑动，通过键盘方向键调整滑动，配置捕捉点，在滑动轴上点击调整并有动画显示。可以作为item被添加到任何容器中。使用示例：<br />
 * Slider which supports vertical or horizontal orientation, keyboard adjustments,
 * configurable snapping, axis clicking and animation. Can be added as an item to
 * any container. Example usage:
<pre><code>
new Ext.Slider({
    renderTo: Ext.getBody(),
    width: 200,
    value: 50,
    increment: 10,
    minValue: 0,
    maxValue: 100
});
</code></pre>
 */
Ext.Slider = Ext.extend(Ext.BoxComponent, {
	/**
	 * @cfg {Number} value 滑动条的初始值。默认值为 minValue。The value to initialize the slider with. Defaults to minValue.
	 */
	/**
	 * @cfg {Boolean} vertical 控制滑动条的垂直或水平方向，默认值为 false 表示水平方向。Orient the Slider vertically rather than horizontally, defaults to false.
	 */
    vertical: false,
	/**
	 * @cfg {Number} minValue 滑动条的最小值。默认值为 0。The minimum value for the Slider. Defaults to 0.
	 */
    minValue: 0,
	/**
	 * @cfg {Number} maxValue 滑动条的最大值。默认值为 100。The maximum value for the Slider. Defaults to 100.
	 */
    maxValue: 100,
    /**
     * @cfg {Number/Boolean} decimalPrecision. 小数点位数。
     * <p>滑动条的值再进行四舍五入时的小数点位数。默认值为 0。The number of decimal places to which to round the Slider's value. Defaults to 0.</p>
     * <p>禁用四舍五入，配置为 <tt><b>false</b></tt>。To disable rounding, configure as <tt><b>false</b></tt>.</p>
     */
    decimalPrecision: 0,
	/**
	 * @cfg {Number} keyIncrement 
	 * 方向键调整滑动条时，每次改变的数值。默认值为 1。如果配置大于默认值，将使用配置后的数值。How many units to change the Slider when adjusting with keyboard navigation. Defaults to 1. If the increment config is larger, it will be used instead.
	 */
    keyIncrement: 1,
	/**
	 * @cfg {Number} increment
	 * 拖放调整滑动条时，每次改变的数值。配置此属性来启用“捕捉”功能。How many units to change the slider when adjusting by drag and drop. Use this option to enable 'snapping'.
	 */
    increment: 0,
	// private
    clickRange: [5,15],
	/**
	 * @cfg {Boolean} clickToChange 确定是否要在滑动轴上点击调整。默认值为 true。Determines whether or not clicking on the Slider axis will change the slider. Defaults to true
	 */
    clickToChange : true,
	/**
	 * @cfg {Boolean} animate 开启或关闭动画。默认值为 true。Turn on or off animation. Defaults to true
	 */
    animate: true,

    /**
     * 当滑动时此属性为True。True while the thumb is in a drag operation
     * @type boolean
     */
    dragging: false,

    // private override
    initComponent : function(){
        if(this.value === undefined){
            this.value = this.minValue;
        }
        Ext.Slider.superclass.initComponent.call(this);
        this.keyIncrement = Math.max(this.increment, this.keyIncrement);
        this.addEvents(
            /**
             * @event beforechange
             * 当滑动条的值改变前触发此事件。您可以取消该活动，并防止滑块改变，通过事件处理器（event handler）返回false，您可以取消该事件，并阻止滑动条改变。
             * Fires before the slider value is changed. By returning false from an event handler,
             * you can cancel the event and prevent the slider from changing.
			 * @param {Ext.Slider} slider The slider
			 * @param {Number} newValue 滑动条将要改变到的新值。The new value which the slider is being changed to.
			 * @param {Number} oldValue 滑动条改变之前的旧值。The old value which the slider was previously.
             */
			'beforechange',
			/**
			 * @event change
			 * 当滑动条的值改变后触发此事件。
			 * Fires when the slider value is changed.
			 * @param {Ext.Slider} slider The slider
			 * @param {Number} newValue 滑动条改变后的新值。The new value which the slider has been changed to.
			 */
			'change',
			/**
			 * @event changecomplete
			 * 当用户改变滑动条的值和任何拖动操作完成时触发此事件。
			 * Fires when the slider value is changed by the user and any drag operations have completed.
			 * @param {Ext.Slider} slider The slider
			 * @param {Number} newValue 滑动条改变后的新值。The new value which the slider has been changed to.
			 */
			'changecomplete',
			/**
			 * @event dragstart
			 * 当拖动操作开始后触发此事件。
             * Fires after a drag operation has started.
			 * @param {Ext.Slider} slider The slider
			 * @param {Ext.EventObject} e The event fired from Ext.dd.DragTracker
			 */
			'dragstart',
			/**
			 * @event drag
			 * 拖动操作过程中当鼠标正在移动时触发此事件。
             * Fires continuously during the drag operation while the mouse is moving.
			 * @param {Ext.Slider} slider The slider
			 * @param {Ext.EventObject} e The event fired from Ext.dd.DragTracker
			 */
			'drag',
			/**
			 * @event dragend
			 * 当拖动操作结束后触发此事件。
             * Fires after the drag operation has completed.
			 * @param {Ext.Slider} slider The slider
			 * @param {Ext.EventObject} e The event fired from Ext.dd.DragTracker
			 */
			'dragend'
		);

        if(this.vertical){
            Ext.apply(this, Ext.Slider.Vertical);
        }
    },

	// private override
    onRender : function(){
        this.autoEl = {
            cls: 'x-slider ' + (this.vertical ? 'x-slider-vert' : 'x-slider-horz'),
            cn:{cls:'x-slider-end',cn:{cls:'x-slider-inner',cn:[{cls:'x-slider-thumb'},{tag:'a', cls:'x-slider-focus', href:"#", tabIndex: '-1', hidefocus:'on'}]}}
        };
        Ext.Slider.superclass.onRender.apply(this, arguments);
        this.endEl = this.el.first();
        this.innerEl = this.endEl.first();
        this.thumb = this.innerEl.first();
        this.halfThumb = (this.vertical ? this.thumb.getHeight() : this.thumb.getWidth())/2;
        this.focusEl = this.thumb.next();
        this.initEvents();
    },

	// private override
    initEvents : function(){
        this.thumb.addClassOnOver('x-slider-thumb-over');
        this.mon(this.el, 'mousedown', this.onMouseDown, this);
        this.mon(this.el, 'keydown', this.onKeyDown, this);

        this.focusEl.swallowEvent("click", true);

        this.tracker = new Ext.dd.DragTracker({
            onBeforeStart: this.onBeforeDragStart.createDelegate(this),
            onStart: this.onDragStart.createDelegate(this),
            onDrag: this.onDrag.createDelegate(this),
            onEnd: this.onDragEnd.createDelegate(this),
            tolerance: 3,
            autoStart: 300
        });
        this.tracker.initEl(this.thumb);
        this.on('beforedestroy', this.tracker.destroy, this.tracker);
    },

	// private override
    onMouseDown : function(e){
        if(this.disabled) {return;}
        if(this.clickToChange && e.target != this.thumb.dom){
            var local = this.innerEl.translatePoints(e.getXY());
            this.onClickChange(local);
        }
        this.focus();
    },

	// private
    onClickChange : function(local){
        if(local.top > this.clickRange[0] && local.top < this.clickRange[1]){
            this.setValue(Math.round(this.reverseValue(local.left)), undefined, true);
        }
    },

	// private
    onKeyDown : function(e){
        if(this.disabled){e.preventDefault();return;}
        var k = e.getKey();
        switch(k){
            case e.UP:
            case e.RIGHT:
                e.stopEvent();
                if(e.ctrlKey){
                    this.setValue(this.maxValue, undefined, true);
                }else{
                    this.setValue(this.value+this.keyIncrement, undefined, true);
                }
            break;
            case e.DOWN:
            case e.LEFT:
                e.stopEvent();
                if(e.ctrlKey){
                    this.setValue(this.minValue, undefined, true);
                }else{
                    this.setValue(this.value-this.keyIncrement, undefined, true);
                }
            break;
            default:
                e.preventDefault();
        }
    },

	// private
    doSnap : function(value){
        if(!this.increment || this.increment == 1 || !value) {
            return value;
        }
        var newValue = value, inc = this.increment;
        var m = value % inc;
        if(m != 0){
            newValue -= m;
            if(m * 2 > inc){
                newValue += inc;
            }else if(m * 2 < -inc){
                newValue -= inc;
            }
        }
        return newValue.constrain(this.minValue,  this.maxValue);
    },

	// private
    afterRender : function(){
        Ext.Slider.superclass.afterRender.apply(this, arguments);
        if(this.value !== undefined){
            var v = this.normalizeValue(this.value);
            if(v !== this.value){
                delete this.value;
                this.setValue(v, false);
            }else{
                this.moveThumb(this.translateValue(v), false);
            }
        }
    },

	// private
    getRatio : function(){
        var w = this.innerEl.getWidth();
        var v = this.maxValue - this.minValue;
        return v == 0 ? w : (w/v);
    },

	// private
    normalizeValue : function(v){
        v = Ext.util.Format.round(v, this.decimalPrecision);
        v = this.doSnap(v);
        v = v.constrain(this.minValue, this.maxValue);
        return v;
    },

	/**
	 * 编程方式设置滑动条的数值。确保设置的数值在最小值和最大值之间。
	 * Programmatically sets the value of the Slider. Ensures that the value is constrained within
	 * the minValue and maxValue.
	 * @param {Number} value 设置滑动条的数值，（ value 受到 minValue 和 maxValue 属性的约束）。The value to set the slider to. (This will be constrained within minValue and maxValue)
	 * @param {Boolean} animate 开启或关闭动画，默认值为 true。Turn on or off animation, defaults to true
	 */
    setValue : function(v, animate, changeComplete){
        v = this.normalizeValue(v);
        if(v !== this.value && this.fireEvent('beforechange', this, v, this.value) !== false){
            this.value = v;
            this.moveThumb(this.translateValue(v), animate !== false);
            this.fireEvent('change', this, v);
            if(changeComplete){
                this.fireEvent('changecomplete', this, v);
            }
        }
    },

	// private
    translateValue : function(v){
        var ratio = this.getRatio();
        return (v * ratio)-(this.minValue * ratio)-this.halfThumb;
    },

	reverseValue : function(pos){
        var ratio = this.getRatio();
        return (pos+this.halfThumb+(this.minValue * ratio))/ratio;
    },

	// private
    moveThumb: function(v, animate){
        if(!animate || this.animate === false){
            this.thumb.setLeft(v);
        }else{
            this.thumb.shift({left: v, stopFx: true, duration:.35});
        }
    },

	// private
    focus : function(){
        this.focusEl.focus(10);
    },

	// private
    onBeforeDragStart : function(e){
        return !this.disabled;
    },

	// private
    onDragStart: function(e){
        this.thumb.addClass('x-slider-thumb-drag');
        this.dragging = true;
        this.dragStartValue = this.value;
        this.fireEvent('dragstart', this, e);
    },

	// private
    onDrag: function(e){
        var pos = this.innerEl.translatePoints(this.tracker.getXY());
        this.setValue(Math.round(this.reverseValue(pos.left)), false);
        this.fireEvent('drag', this, e);
    },

	// private
    onDragEnd: function(e){
        this.thumb.removeClass('x-slider-thumb-drag');
        this.dragging = false;
        this.fireEvent('dragend', this, e);
        if(this.dragStartValue != this.value){
            this.fireEvent('changecomplete', this, this.value);
        }
    },

	// private
    onResize : function(w, h){
        this.innerEl.setWidth(w - (this.el.getPadding('l') + this.endEl.getPadding('r')));
        this.syncThumb();
    },
    
    //private
    onDisable: function(){
        Ext.Slider.superclass.onDisable.call(this);
        this.thumb.addClass(this.disabledClass);
        if(Ext.isIE){
            //IE breaks when using overflow visible and opacity other than 1.
            //Create a place holder for the thumb and display it.
            var xy = this.thumb.getXY();
            this.thumb.hide();
            this.innerEl.addClass(this.disabledClass).dom.disabled = true;
            if (!this.thumbHolder){
                this.thumbHolder = this.endEl.createChild({cls: 'x-slider-thumb ' + this.disabledClass});    
            }
            this.thumbHolder.show().setXY(xy);
        }
    },
    
    //private
    onEnable: function(){
        Ext.Slider.superclass.onEnable.call(this);
        this.thumb.removeClass(this.disabledClass);
        if(Ext.isIE){
            this.innerEl.removeClass(this.disabledClass).dom.disabled = false;
            if (this.thumbHolder){
                this.thumbHolder.hide();
            }
            this.thumb.show();
            this.syncThumb();
        }
    },
    
    /**
     * Synchronizes the thumb position to the proper proportion of the total component width based
     * on the current slider {@link #value}.  This will be called automatically when the Slider
     * is resized by a layout, but if it is rendered auto width, this method can be called from
     * another resize handler to sync the Slider if necessary.
     */
    syncThumb : function(){
        if(this.rendered){
            this.moveThumb(this.translateValue(this.value));
        }
    },

	/**
	 * 返回滑动条的当前值
	 * Returns the current value of the slider
	 * @return {Number} The current value of the slider
	 */
    getValue : function(){
        return this.value;
    }
});
Ext.reg('slider', Ext.Slider);

// private class to support vertical sliders
Ext.Slider.Vertical = {
    onResize : function(w, h){
        this.innerEl.setHeight(h - (this.el.getPadding('t') + this.endEl.getPadding('b')));
        this.syncThumb();
    },

    getRatio : function(){
        var h = this.innerEl.getHeight();
        var v = this.maxValue - this.minValue;
        return h/v;
    },

    moveThumb: function(v, animate){
        if(!animate || this.animate === false){
            this.thumb.setBottom(v);
        }else{
            this.thumb.shift({bottom: v, stopFx: true, duration:.35});
        }
    },

    onDrag: function(e){
        var pos = this.innerEl.translatePoints(this.tracker.getXY());
        var bottom = this.innerEl.getHeight()-pos.top;
        this.setValue(this.minValue + Math.round(bottom/this.getRatio()), false);
        this.fireEvent('drag', this, e);
    },

    onClickChange : function(local){
        if(local.left > this.clickRange[0] && local.left < this.clickRange[1]){
            var bottom = this.innerEl.getHeight()-local.top;
            this.setValue(this.minValue + Math.round(bottom/this.getRatio()), undefined, true);
        }
    }
};