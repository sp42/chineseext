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
 * @class Ext.Editor
 * @extends Ext.Component
 * 一个基础性的字段编辑器，它负责完成按需显示方面的工作，还有隐藏控制、某些内建的调节大小工作及事件处理函数的逻辑。
 * A base editor field that handles displaying/hiding on demand and has some built-in sizing and event handling logic.
 * @constructor 建立一个新的编辑器。Create a new Editor
 * @param {Object} config 配置项对象。The config object
 */
Ext.Editor = function(field, config){
    if(field.field){
        this.field = Ext.create(field.field, 'textfield');
        config = Ext.apply({}, field); // 复制对象那么不影响原始的值 copy so we don't disturb original config
        delete config.field;
    }else{
        this.field = field;
    }
    Ext.Editor.superclass.constructor.call(this, config);
};

Ext.extend(Ext.Editor, Ext.Component, {
    /**
    * @cfg {Ext.form.Field} field
    * Field字段对象（或祖先）或field的配置项对象。
    * The Field object (or descendant) or config object for field
    */
    /**
     * @cfg {Boolean/String} autoSize
     * True表示为编辑器的大小尺寸自适应到所属的字段，设置“width”表示单单适应宽度，设置“height”表示单单适应高度（默认为fasle）。
     * True for the editor to automatically adopt the size of the element being edited, "width" to adopt the width only,
     * or "height" to adopt the height only (defaults to false)
     */
    /**
     * @cfg {Boolean} revertInvalid
     * True表示为当用户完成编辑但字段验证失败后，自动恢复原始值，然后取消这次编辑（默认为true）。
     * True to automatically revert the field value and cancel the edit when the user completes an edit and the field
     * validation fails (defaults to true)
     */
    /**
     * @cfg {Boolean} ignoreNoChange
     * True表示为如果用户完成一次编辑但值没有改变时，中止这次编辑的操作（不保存，不触发事件）（默认为false）。
     * 只对字符类型的值有效，其它编辑的数据类型将会被忽略。
     * True to skip the edit completion process (no save, no events fired) if the user completes an edit and
     * the value has not changed (defaults to false).  Applies only to string values - edits for other data types
     * will never be ignored.
     */
    /**
     * @cfg {Boolean} hideEl
     * False表示为当编辑器显示时，保持绑定的元素可见（默认为true）。 
     * False to keep the bound element visible while the editor is displayed (defaults to true)
     */
    /**
     * @cfg {Mixed} value 所属字段的日期值（默认为""）。
     * The data value of the underlying field (defaults to "")
     */
    value : "",
    /**
     * @cfg {String} alignment 对齐的位置（参见{@link Ext.Element#alignTo}了解详细，默认为"c-c?"）。
     * The position to align to (see {@link Ext.Element#alignTo} for more details, defaults to "c-c?").
     */
    alignment: "c-c?",
    /**
     * @cfg {Boolean/String} shadow 属性为"sides"是四边都是向上阴影，"frame"表示四边外发光，"drop"表示从右下角开始投影（默认为"frame"）。  
     * "sides" for sides/bottom only, "frame" for 4-way shadow, and "drop" for bottom-right shadow (defaults to "frame")
     */
    shadow : "frame",
    /**
     * @cfg {Boolean} constrain 表示为约束编辑器到视图。
     * True to constrain the editor to the viewport
     */
    constrain : false,
    /**
     * @cfg {Boolean} swallowKeys 处理keydown/keypress事件使得不会上报（propagate），（默认为true）。
     * Handle the keydown/keypress events so they don't propagate (defaults to true)
     */
    swallowKeys : true,
    /**
     * @cfg {Boolean} completeOnEnter True表示为回车按下之后就完成编辑（默认为false）。
     * True to complete the edit when the enter key is pressed (defaults to false)
     */
    completeOnEnter : false,
    /**
     * @cfg {Boolean} cancelOnEsc True表示为escape键按下之后便取消编辑（默认为false）。
     * True to cancel the edit when the escape key is pressed (defaults to false)
     */
    cancelOnEsc : false,
    /**
     * @cfg {Boolean} updateEl True表示为当更新完成之后同时更新绑定元素的innerHTML（默认为false）。
     * True to update the innerHTML of the bound element when the update completes (defaults to false)
     */
    updateEl : false,

    initComponent : function(){
        Ext.Editor.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event beforestartedit
             * 编辑器开始初始化，但在修改值之前触发。若事件句柄返回false则取消整个编辑事件。
             * Fires when editing is initiated, but before the value changes.  Editing can be canceled by returning
             * false from the handler of this event.
             * @param {Editor} this
             * @param {Ext.Element} boundEl 编辑器绑定的所属元素。The underlying element bound to this editor
             * @param {Mixed} value 正被设置的值。The field value being set
             */
            "beforestartedit",
            /**
             * @event startedit
             * 当编辑器显示时触发。
             * Fires when this editor is displayed
             * @param {Ext.Element} boundEl 编辑器绑定的所属元素。The underlying element bound to this editor
             * @param {Mixed} value 原始字段。The starting field value
             */
            "startedit",
            /**
             * @event beforecomplete
             * 修改已提交到字段，但修改未真正反映在所属的字段上之前触发。
			 * 若事件句柄返回false则取消整个编辑事件。
			 * 注意如果值没有变动的话并且ignoreNoChange = true的情况下，
			 * 编辑依然会结束但因为没有真正的编辑所以不会触发事件。
             * Fires after a change has been made to the field, but before the change is reflected in the underlying
             * field.  Saving the change to the field can be canceled by returning false from the handler of this event.
             * Note that if the value has not changed and ignoreNoChange = true, the editing will still end but this
             * event will not fire since no edit actually occurred.
             * @param {Editor} this
             * @param {Mixed} value 当前字段的值。The current field value
             * @param {Mixed} startValue 原始字段的值。The original field value
             */
            "beforecomplete",
            /**
             * @event complete
             * 当编辑完成过后，任何的改变写入到所属字段时触发。 
             * Fires after editing is complete and any changed value has been written to the underlying field.
             * @param {Editor} this
             * @param {Mixed} value 当前字段的值。The current field value
             * @param {Mixed} startValue 原始字段的值。The original field value
             */
            "complete",
            /**
             * @event canceledit
             * 当编辑器取消后和编辑器复位之后触发。
			 * Fires after editing has been canceled and the editor's value has been reset.
             * @param {Editor} this
             * @param {Mixed} value 用户被取消的值。The user-entered field value that was discarded
             * @param {Mixed} startValue 原始值。The original field value that was set back into the editor after cancel
             */
            "canceledit",
            /**
             * @event specialkey
             * 用于导航的任意键被按下触发（arrows、tab、enter、esc等等）。
			 * 你可检查{@link Ext.EventObject#getKey}以确定哪个键被按了。
             * Fires when any key related to navigation (arrows, tab, enter, esc, etc.) is pressed.  You can check
             * {@link Ext.EventObject#getKey} to determine which key was pressed.
             * @param {Ext.form.Field} this
             * @param {Ext.EventObject} e 事件对象。The event object
             */
            "specialkey"
        );
    },

    // private
    onRender : function(ct, position){
        this.el = new Ext.Layer({
            shadow: this.shadow,
            cls: "x-editor",
            parentEl : ct,
            shim : this.shim,
            shadowOffset: this.shadowOffset || 4,
            id: this.id,
            constrain: this.constrain
        });
        if(this.zIndex){
            this.el.setZIndex(this.zIndex);
        }
        this.el.setStyle("overflow", Ext.isGecko ? "auto" : "hidden");
        if(this.field.msgTarget != 'title'){
            this.field.msgTarget = 'qtip';
        }
        this.field.inEditor = true;
        this.field.render(this.el);
        if(Ext.isGecko){
            this.field.el.dom.setAttribute('autocomplete', 'off');
        }
        this.mon(this.field, "specialkey", this.onSpecialKey, this);
        if(this.swallowKeys){
            this.field.el.swallowEvent(['keydown','keypress']);
        }
        this.field.show();
        this.mon(this.field, "blur", this.onBlur, this);
        if(this.field.grow){
        	this.mon(this.field, "autosize", this.el.sync,  this.el, {delay:1});
        }
    },

    // private
    onSpecialKey : function(field, e){
        var key = e.getKey();
        if(this.completeOnEnter && key == e.ENTER){
            e.stopEvent();
            this.completeEdit();
        }else if(this.cancelOnEsc && key == e.ESC){
            this.cancelEdit();
        }else{
            this.fireEvent('specialkey', field, e);
        }
        if(this.field.triggerBlur && (key == e.ENTER || key == e.ESC || key == e.TAB)){
            this.field.triggerBlur();
        }
    },

    /**
     * 进入编辑状态并显示编辑器。
     * Starts the editing process and shows the editor.
     * @param {Mixed} el 要编辑的元素。The element to edit
     * @param {String} value 编辑器初始化的值，如不设置该值便是元素的innerHTML。(optional) A value to initialize the editor with. If a value is not provided, it defaults
      * to the innerHTML of el.
     */
    startEdit : function(el, value){
        if(this.editing){
            this.completeEdit();
        }
        this.boundEl = Ext.get(el);
        var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
        if(!this.rendered){
            this.render(this.parentEl || document.body);
        }
        if(this.fireEvent("beforestartedit", this, this.boundEl, v) === false){
            return;
        }
        this.startValue = v;
        this.field.setValue(v);
        this.doAutoSize();
        this.el.alignTo(this.boundEl, this.alignment);
        this.editing = true;
        this.show();
    },

    // private
    doAutoSize : function(){
        if(this.autoSize){
            var sz = this.boundEl.getSize();
            switch(this.autoSize){
                case "width":
                    this.setSize(sz.width,  "");
                break;
                case "height":
                    this.setSize("",  sz.height);
                break;
                default:
                    this.setSize(sz.width,  sz.height);
            }
        }
    },

    /**
     * 设置编辑器高、宽。
     * Sets the height and width of this editor.
     * @param {Number} width 新宽度。The new width
     * @param {Number} height 新高度。The new height
     */
    setSize : function(w, h){
        delete this.field.lastSize;
        this.field.setSize(w, h);
        if(this.el){
            if(Ext.isGecko2 || Ext.isOpera){
                // prevent layer scrollbars
                this.el.setSize(w, h);
            }
            this.el.sync();
        }
    },

    /**
     * 按照当前的最齐设置，把编辑器重新对齐到所绑定的字段。
     * Realigns the editor to the bound field based on the current alignment config value.
     */
    realign : function(){
        this.el.alignTo(this.boundEl, this.alignment);
    },

    /**
     * 结束编辑状态，提交变化的内容到所属的字段，并隐藏编辑器。
     * Ends the editing process, persists the changed value to the underlying field, and hides the editor.
     * @param {Boolean} remainVisible 让编辑过后仍然显示编辑器，这是重写默认的动作（默认为false）。Override the default behavior and keep the editor visible after edit (defaults to false)
     */
    completeEdit : function(remainVisible){
        if(!this.editing){
            return;
        }
        var v = this.getValue();
        if(this.revertInvalid !== false && !this.field.isValid()){
            v = this.startValue;
            this.cancelEdit(true);
        }
        if(String(v) === String(this.startValue) && this.ignoreNoChange){
            this.editing = false;
            this.hide();
            return;
        }
        if(this.fireEvent("beforecomplete", this, v, this.startValue) !== false){
            this.editing = false;
            if(this.updateEl && this.boundEl){
                this.boundEl.update(v);
            }
            if(remainVisible !== true){
                this.hide();
            }
            this.fireEvent("complete", this, v, this.startValue);
        }
    },

    // private
    onShow : function(){
        this.el.show();
        if(this.hideEl !== false){
            this.boundEl.hide();
        }
        this.field.show();
        if(Ext.isIE && !this.fixIEFocus){ // IE has problems with focusing the first time
            this.fixIEFocus = true;
            this.deferredFocus.defer(50, this);
        }else{
            this.field.focus();
        }
        this.fireEvent("startedit", this.boundEl, this.startValue);
    },

    deferredFocus : function(){
        if(this.editing){
            this.field.focus();
        }
    },

    /**
     * 取消编辑状态并返回到原始值，不作任何的修改。 
     * Cancels the editing process and hides the editor without persisting any changes.  The field value will be
     * reverted to the original starting value.
     * @param {Boolean} remainVisible 让编辑过后仍然显示编辑器，这是重写默认的动作（默认为false）。Override the default behavior and keep the editor visible after
     * cancel (defaults to false)
     */
    cancelEdit : function(remainVisible){
        if(this.editing){
            var v = this.getValue();
            this.setValue(this.startValue);
            if(remainVisible !== true){
                this.hide();
            }
            this.fireEvent("canceledit", this, v, this.startValue);
        }
    },

    // private
    onBlur : function(){
        if(this.allowBlur !== true && this.editing){
            this.completeEdit();
        }
    },

    // private
    onHide : function(){
        if(this.editing){
            this.completeEdit();
            return;
        }
        this.field.blur();
        if(this.field.collapse){
            this.field.collapse();
        }
        this.el.hide();
        if(this.hideEl !== false){
            this.boundEl.show();
        }
    },

    /**
     * 设置编辑器的数据。
     * Sets the data value of the editor
     * @param {Mixed} value 所属field可支持的任意值。Any valid value supported by the underlying field
     */
    setValue : function(v){
        this.field.setValue(v);
    },

    /**
     * 获取编辑器的数据。
     * Gets the data value of the editor
     * @return {Mixed} 数据值。The data value
     */
    getValue : function(){
        return this.field.getValue();
    },

    beforeDestroy : function(){
        Ext.destroy(this.field);
        this.field = null;
    }
});
Ext.reg('editor', Ext.Editor);