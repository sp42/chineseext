/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */
 
/**
 * @class Ext.form.TextArea
 * @extends Ext.form.TextField
 * 多行文本域。可以直接用于替代textarea，支持自动调整大小。
 * @constructor
 * 创建一个新的TextArea对象
 * @param {Object} config 配置选项
 */
Ext.form.TextArea = function(config){
    Ext.form.TextArea.superclass.constructor.call(this, config);
    // 提供向后兼容
    // growMin/growMax替代minHeight/maxHeight
    // 兼容TextField递增的配置值
    if(this.minHeight !== undefined){
        this.growMin = this.minHeight;
    }
    if(this.maxHeight !== undefined){
        this.growMax = this.maxHeight;
    }
};

Ext.extend(Ext.form.TextArea, Ext.form.TextField,  {
    /**
     * @cfg {Number} growMin 当grow = true时允许的高度下限（默认为60）
     */
    growMin : 60,
    /**
     * @cfg {Number} growMax 当grow = true时允许的高度上限（默认为1000）
     */
    growMax: 1000,
    /**
     * @cfg {Boolean} preventScrollbars 为True时在为本域中将禁止滑动条，不论域中文本的数量（相当于设置overflow为hidden，默认值为false）
     */   
    preventScrollbars: false,
    
    /**
     * @cfg {String/Object} autoCreate 一个DomHelper创建元素的对象，或者为true，表示采用默认的方式创建元素。（默认为
     * {tag: "textarea", style: "width:300px;height:60px;", autocomplete: "off"}）
     */
    // private
    onRender : function(ct, position){
        if(!this.el){
            this.defaultAutoCreate = {
                tag: "textarea",
                style:"width:300px;height:60px;",
                autocomplete: "off"
            };
        }
        Ext.form.TextArea.superclass.onRender.call(this, ct, position);
        if(this.grow){
            this.textSizeEl = Ext.DomHelper.append(document.body, {
                tag: "pre", cls: "x-form-grow-sizer"
            });
            if(this.preventScrollbars){
                this.el.setStyle("overflow", "hidden");
            }
            this.el.setHeight(this.growMin);
        }
    },

    onDestroy : function(){
        if(this.textSizeEl){
            this.textSizeEl.parentNode.removeChild(this.textSizeEl);
        }
        Ext.form.TextArea.superclass.onDestroy.call(this);
    },

    // private
    onKeyUp : function(e){
        if(!e.isNavKeyPress() || e.getKey() == e.ENTER){
            this.autoSize();
        }
    },

    /**
	 * 自动适应文本行数，直到所设置的最大行数。
	 * 仅当grow = true时触发自适应高度事件。
     */
    autoSize : function(){
        if(!this.grow || !this.textSizeEl){
            return;
        }
        var el = this.el;
        var v = el.dom.value;
        var ts = this.textSizeEl;

        ts.innerHTML = '';
        ts.appendChild(document.createTextNode(v));
        v = ts.innerHTML;

        Ext.fly(ts).setWidth(this.el.getWidth());
        if(v.length < 1){
            v = "&#160;&#160;";
        }else{
            if(Ext.isIE){
                v = v.replace(/\n/g, '<p>&#160;</p>');
            }
            v += "&#160;\n&#160;";
        }
        ts.innerHTML = v;
        var h = Math.min(this.growMax, Math.max(ts.offsetHeight, this.growMin));
        if(h != this.lastHeight){
            this.lastHeight = h;
            this.el.setHeight(h);
            this.fireEvent("autosize", this, h);
        }
    }
});