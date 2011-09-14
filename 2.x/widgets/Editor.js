/**
 * @class Ext.Editor
 * @extends Ext.Component
 * 一个基础性的字段编辑器，内建按需的显示、隐藏控制和一些内建的调节大小及事件句柄逻辑。
 * @constructor
 * 建立一个新的编辑器
 * @param {Ext.form.Field} field 字段对象（或后代descendant）
 * @param {Object} config 配置项对象
 */
Ext.Editor = function(field, config){
    this.field = field;
    Ext.Editor.superclass.constructor.call(this, config);
};

Ext.extend(Ext.Editor, Ext.Component, {
    /**
	 * @cfg {Boolean/String} autosize
     * True表示为编辑器的大小尺寸自适应到所属的字段，设置“width”表示单单适应宽度，
     * 设置“height”表示单单适应高度（默认为fasle）
     */
    /**
	 * @cfg {Boolean} revertInvalid
     * True表示为当用户完成编辑但字段验证失败后,自动恢复原始值，然后取消这次编辑（默认为true）
     */
    /**
	 * @cfg {Boolean} ignoreNoChange
     * True表示为如果用户完成一次编辑但值没有改变时，中止这次编辑的操作（不保存，不触发事件）（默认为false）。
     * 只对字符类型的值有效，其它编辑的数据类型将会被忽略。
     */
    /**
     * @cfg {Boolean} hideEl
     * False表示为当编辑器显示时，保持绑定的元素可见（默认为true）。
	 */
    /**
	 * @cfg {Mixed} value
     * 所属字段的日期值(默认为"")
     */
    value : "",
    /**
     * @cfg {String} alignment
     * 对齐的位置（参见{@link Ext.Element#alignTo}了解详细，默认为"c-c?"）。
	 */
    alignment: "c-c?",
    /**
	 * @cfg {Boolean/String} shadow属性为"sides"是四边都是向上阴影， "frame"表示四边外发光， "drop"表示
     * 从右下角开始投影（默认为"frame"）
     */
    shadow : "frame",
    /**
	 * @cfg {Boolean} constrain 表示为约束编辑器到视图
     */
    constrain : false,
    /**
     * @cfg {Boolean} swallowKeys 处理keydown/keypress事件使得不会上报（propagate），（默认为true）
     */
    swallowKeys : true,
    /**
	 * @cfg {Boolean} completeOnEnter True表示为回车按下之后就完成编辑（默认为false）
     */
    completeOnEnter : false,
    /**
	 * @cfg {Boolean} cancelOnEsc True表示为escape键按下之后便取消编辑（默认为false）
     */
    cancelOnEsc : false,
    /**
     * @cfg {Boolean} updateEl True to update the innerHTML of the bound element when the update completes (defaults to false)
	 * @cfg {Boolean} updateEl True表示为当更新完成之后同时更新绑定元素的innerHTML（默认为false） 
     */
    updateEl : false,

    initComponent : function(){
        Ext.Editor.superclass.initComponent.call(this);

        this.addEvents(
            /**
			 * @event beforestartedit
	    	 * 编辑器开始初始化，但在修改值之前触发。若事件句柄返回false则取消整个编辑事件。
	   	     * @param {Editor} this
	    	 * @param {Ext.Element} boundEl 编辑器绑定的所属元素
		     * @param {Mixed} value 正被设置的值
             */
            "beforestartedit",
            /**
	   	     * 当编辑器显示时触发
			 * @param {Ext.Element} boundEl 编辑器绑定的所属元素
		     * @param {Mixed} value 原始字段值
             */
            "startedit",
            /**
			 * @event beforecomplete
	  	     * 修改已提交到字段，但修改未真正反映在所属的字段上之前触发。
			 * 若事件句柄返回false则取消整个编辑事件。
			 * 注意如果值没有变动的话并且ignoreNoChange = true的情况下，
			 * 编辑依然会结束但因为没有真正的编辑所以不会触发事件。
			 * @param {Editor} this
			 * @param {Mixed} value 当前字段的值
			 * @param {Mixed} startValue 原始字段的值
             */
            "beforecomplete",
            /**
			 * @event complete
			 * 当编辑完成过后，任何的改变写入到所属字段时触发。
			 * @param {Editor} this
			 * @param {Mixed} value 当前字段的值
			 * @param {Mixed} startValue 原始字段的值
             */
            "complete",
            /**
			 * @event specialkey
			 * 用于导航的任意键被按下触发（arrows、 tab、 enter、esc等等）
			 * 你可检查{@link Ext.EventObject#getKey}以确定哪个键被按了。
			 * @param {Ext.form.Field} this
			 * @param {Ext.EventObject} e 事件对象
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
            shadowOffset:4,
            id: this.id,
            constrain: this.constrain
        });
        this.el.setStyle("overflow", Ext.isGecko ? "auto" : "hidden");
        if(this.field.msgTarget != 'title'){
            this.field.msgTarget = 'qtip';
        }
        this.field.render(this.el);
        if(Ext.isGecko){
            this.field.el.dom.setAttribute('autocomplete', 'off');
        }
        this.field.on("specialkey", this.onSpecialKey, this);
        if(this.swallowKeys){
            this.field.el.swallowEvent(['keydown','keypress']);
        }
        this.field.show();
        this.field.on("blur", this.onBlur, this);
        if(this.field.grow){
            this.field.on("autosize", this.el.sync,  this.el, {delay:1});
        }
    },

    onSpecialKey : function(field, e){
        if(this.completeOnEnter && e.getKey() == e.ENTER){
            e.stopEvent();
            this.completeEdit();
        }else if(this.cancelOnEsc && e.getKey() == e.ESC){
            this.cancelEdit();
        }else{
            this.fireEvent('specialkey', field, e);
        }
    },

    /**
	  * 进入编辑状态并显示编辑器
      * @param {String/HTMLElement/Element} el 要编辑的元素
      * @param {String} value (optional) 编辑器初始化的值，如不设置该值便是元素的innerHTML
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
        this.el.alignTo(this.boundEl, this.alignment);
        this.editing = true;
        this.show();
    },

    /**
	 * 设置编辑器高、宽
     * @param {Number} width 新宽度
     * @param {Number} height 新高度
     */
    setSize : function(w, h){
        this.field.setSize(w, h);
        if(this.el){
            this.el.sync();
        }
    },

    /**
     * 按照当前的最齐设置，把编辑器重新对齐到所绑定的字段。
	 */
    realign : function(){
        this.el.alignTo(this.boundEl, this.alignment);
    },

    /**
     * @param {Boolean} remainVisible Override the default behavior and keep the editor visible after edit (defaults to false)
	 * 结束编辑状态，提交变化的内容到所属的字段，并隐藏编辑器。
     * @param {Boolean} remainVisible 让编辑过后仍然显示编辑器，这是重写默认的动作（默认为false）
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
	 * 取消编辑状态并返回到原始值，不作任何的修改，
     * @param {Boolean} remainVisible 让编辑过后仍然显示编辑器，这是重写默认的动作（默认为false）
     */
    cancelEdit : function(remainVisible){
        if(this.editing){
            this.setValue(this.startValue);
            if(remainVisible !== true){
                this.hide();
            }
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
     * @param {Mixed} value 所属field可支持的任意值
     */
    setValue : function(v){
        this.field.setValue(v);
    },

    /**
	 * 获取编辑器的数据。
     * @return {Mixed} 数据值
     */
    getValue : function(){
        return this.field.getValue();
    },

    beforeDestroy : function(){
        this.field.destroy();
        this.field = null;
    }
});
Ext.reg('editor', Ext.Editor);