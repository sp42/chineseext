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
 * @class Ext.form.DisplayField
 * @extends Ext.form.Field
 * @constructor 创建新的字段 Creates a new Field
 * @param {Object} config 配置项 Configuration options
 */
Ext.form.DisplayField = Ext.extend(Ext.form.Field,  {
    validationEvent : false,
    validateOnBlur : false,
    defaultAutoCreate : {tag: "div"},
    fieldClass : "x-form-display-field",
    htmlEncode: false,

    // private
    initEvents : Ext.emptyFn,

    isValid : function(){
        return true;
    },

    validate : function(){
        return true;
    },

    getRawValue : function(){
        var v = this.rendered ? this.el.dom.innerHTML : Ext.value(this.value, '');
        if(v === this.emptyText){
            v = '';
        }
        if(this.htmlEncode){
            v = Ext.util.Format.htmlDecode(v);
        }
        return v;
    },

    getValue : function(){
        return this.getRawValue();
    },

    setRawValue : function(v){
        if(this.htmlEncode){
            v = Ext.util.Format.htmlEncode(v);
        }
        return this.rendered ? (this.el.dom.innerHTML = (v === null || v === undefined ? '' : v)) : (this.value = v);
    },

    setValue : function(v){
        this.setRawValue(v);
    }
});

Ext.reg('displayfield', Ext.form.DisplayField);
