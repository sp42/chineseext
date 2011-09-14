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
 * @class Ext.form.Label
 * @extends Ext.BoxComponent
 * 简单的Label字段元素。<br />
 * Basic Label field.
 * @constructor
 * 创建一个新的 Label
 * Creates a new Label
 * @param {Ext.Element/String/Object} config 配置选项。如果传入一个元素(element)，那么该元素会作为label组件的内部元素，使用它(传入的element)的ID作为组件的ID，
 * 如果传入的是一个字符串，假设之该字符串是一个已存在的元素的ID，它的ID作为label组件的ID。
 * 否则，就作为一个普通的配置对象，应用到该组件。<br />
 * The configuration options.  If an element is passed, it is set as the internal
 * element and its id used as the component id.  If a string is passed, it is assumed to be the id of an existing element
 * and is used as the component id.  Otherwise, it is assumed to be a standard config object and is applied to the component.
 * @xtype label
 */
Ext.form.Label = Ext.extend(Ext.BoxComponent, {
    /**
     * @cfg {String} text Label内显示的普通文本，默认为''。如果想在Label组件里嵌入HTML标签，请使用{@link #html}。
     * The plain text to display within the label (defaults to ''). If you need to include HTML 
     * tags within the label's innerHTML, use the {@link #html} config instead.
     */
    /**
     * @cfg {String} forId  该Label将要通过标准的HTML 'for'属性绑定到的页面元素(element)的ID，如果没有指定，那么该属性不会被加到label上。
     * The id of the input element to which this label will be bound via the standard HTML 'for'
     * attribute. If not specified, the attribute will not be added to the label.
     */
    /**
     * @cfg {String} html  Label的内部 HTML片段。如果指定了{@link #text}，将优先使用text属性，html属性将被忽略。
     * An HTML fragment that will be used as the label's innerHTML (defaults to ''). 
     * Note that if {@link #text} is specified it will take precedence and this value will be ignored.
     */

    // private
    onRender : function(ct, position){
        if(!this.el){
            this.el = document.createElement('label');
            this.el.id = this.getId();
            this.el.innerHTML = this.text ? Ext.util.Format.htmlEncode(this.text) : (this.html || '');
            if(this.forId){
                this.el.setAttribute('for', this.forId);
            }
        }
        Ext.form.Label.superclass.onRender.call(this, ct, position);
    },
    
    /**
     * 更改Label的内部HTML为指定的字符串。
     * Updates the label's innerHTML with the specified string.
     * @param {String} text 新指定的在Label内显示的文本。The new label text
     * @param {Boolean} encode （可选选项）默认为true，对html片段进行编码，如果为false将在渲染的时候的时候将跳过对HTML的编码，用于想要在Label里使用html标签而不是
     * 作为普通的字符串进行渲染。
     * (optional) False to skip HTML-encoding the text when rendering it
     * to the label (defaults to true which encodes the value). This might be useful if you want to include 
     * tags in the label's innerHTML rather than rendering them as string literals per the default logic.
     * @return {Label} this
     */
    setText: function(t, encode){
        this.text = t;
        if(this.rendered){
            this.el.dom.innerHTML = encode !== false ? Ext.util.Format.htmlEncode(t) : t;
        }
        return this;
    }
});

Ext.reg('label', Ext.form.Label);