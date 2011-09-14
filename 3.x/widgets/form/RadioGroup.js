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
 * @class Ext.form.RadioGroup
 * @extends Ext.form.CheckboxGroup
 * 群组{@link Ext.form.Radio}控件的容器。 <br />
 * A grouping container for {@link Ext.form.Radio} controls.
 * @constructor 创建新的RadioGroup对象 Creates a new RadioGroup
 * @param {Object} config 配置项 Configuration options
 */
Ext.form.RadioGroup = Ext.extend(Ext.form.CheckboxGroup, {
    /**
     * @cfg {Boolean} allowBlank 
     * True表示为group里面的每一项都可以允许空白（默认为false）。如果allowBlank = false而且验证的时候没有一项被选中，{@link @blankText}就是用于提示的错误信息。
     * True to allow every item in the group to be blank (defaults to false). If allowBlank = 
     * false and no items are selected at validation time, {@link @blankText} will be used as the error text.
     */
    allowBlank : true,
    /**
     * @cfg {String} blankText 
     * 若{@link #allowBlank}验证不通过显示的文字（默认为You must select one item in this group"）。
     * Error text to display if the {@link #allowBlank} validation fails (defaults to "You must 
     * select one item in this group")
     */
    blankText : "You must select one item in this group",
    
    // private
    defaultType : 'radio',
    
    // private
    groupCls: 'x-form-radio-group'
});

Ext.reg('radiogroup', Ext.form.RadioGroup);
