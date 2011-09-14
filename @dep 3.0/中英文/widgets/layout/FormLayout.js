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
 * @class Ext.layout.FormLayout
 * @extends Ext.layout.AnchorLayout
 * <p>
 * 这是用来创建一个表单的布局，负责渲染和其部件内的子元件。渲染出来的{@link Ext.form.Field Field}是能够支持HTML label元素的用户体验设计。<br />
 * This layout manager is specifically designed for rendering and managing child Components of forms.
 * It is responsible for rendering the labels of s.</p>
 * <p>
 * 此类可以被继承或通过配置项layout:'form'{@link Ext.Container#layout}来创建，而不像通常情况下使用关键字new来创建。
 * 可是在应用中，一般我们会选择使用{@link Ext.form.FormPanel}（自动使用FormLayout作为布局类），而且它还提供了内建的读取、效验和提交表单的函数。<br />
 * This layout manager is used when a Container is configured with the layout:'form' {@link Ext.Container#layout layout} config,
 * and should generally not need to be created directly via the new keyword. In an application,
 * it will usually be preferrable to use a {@link Ext.form.FormPanel FormPanel} (which automatically uses FormLayout as its layout
 * class) since it also provides built-in functionality for loading, validating and submitting the form.</p>
 * <p>
 * 需要注意的是，当通过配置项来创建布局的时候，布局的属性必须通过{@link Ext.Container#layoutConfig}对象来指定。<br />
 * Note that when creating a layout via config, the layout-specific config properties must be passed in via
 * the {@link Ext.Container#layoutConfig layoutConfig} object which will then be applied internally to the layout.</p>
 * <p>使用{@link Ext.Container Container}布局的容器，也支持以下配置属性：
 * The {@link Ext.Container Container} <i>using</i> the FormLayout can also accept the following layout-specific config
 * properties:
 * <div class="mdetail-params"><ul>
 * <li><b>hideLabels</b>: (Boolean)<div class="sub-desc">值为true则隐藏字段的标签（默认为 false）。True to hide field labels by default (defaults to false)</div></li>
 * <li><b>labelAlign</b>: (String)<div class="sub-desc">添加到每个字段标签和字段元素之外的封装 DIV 之上的 CSS 类（默认类为 'x-form-item' 并且 itemCls 会附加在其后）。The default label alignment.  The default value is empty string ''
 * for left alignment, but specifying 'top' will align the labels above the fields.</div></li>
 * <li><b>labelPad</b>: (Number)<div class="sub-desc">默认的以像素表示的字段标签的padding值（默认为5）。只有在指定了labelWidth的时候labelPad有效，否则被忽略。The default padding in pixels for field labels (defaults to 5).  labelPad only
 * applies if labelWidth is also specified, otherwise it will be ignored.</div>
 * </li>
 * <li><b>labelWidth</b>: (Number)<div class="sub-desc">默认的以像素表示的字段标签的宽度（默认为100）。The default width in pixels of field labels (defaults to 100)</div></li>
 * </ul></div></p>
 * <p>
 * 任意类型的组件都能被添加到FormLayout中，但是继承自{@link Ext.form.Field}的项还支持下列配置项属性：<br />
 * Any type of components can be added to a FormLayout, but items that inherit from {@link Ext.form.Field}
 * can also supply the following field-specific config properties:
 * <div class="mdetail-params">
 * <ul>
 * <li><b>clearCls</b>: (String)<div class="sub-desc">
 * 添加到每个表单字段封装DIV的上用于实现clear效果的CSS类（默认为'x-form-clear-left'）。<br />
 * The CSS class to apply to the special clearing div rendered directly after each
 * form field wrapper (defaults to 'x-form-clear-left')</div>
 * </li>
 * <li><b>fieldLabel</b>: (String)<div class="sub-desc">
 * 显示的字段标签（label）文本（默认为''）。<br />
 * The text to display as the label for this field (defaults to '')</div>
 * </li>
 * <li><b>hideLabel</b>: (Boolean)<div class="sub-desc">
 * 值为true则隐藏字段的标签和分隔符（默认为 false）。<br />
 * True to hide the label and separator for this field (defaults to false).</div>
 * </li>
 * <li><b>itemCls</b>: (String)<div class="sub-desc">
 * 添加到每个字段标签和字段元素之外的封装DIV之上的CSS样式类（默认类为'x-form-item'，并且itemCls会附加在其后）。如果提供了，则字段级的itemCls将会覆盖容器级的。<br />
 * A CSS class to add to the div wrapper that contains this field label
 * and field element (the default class is 'x-form-item' and itemCls will be added to that).  If supplied,
 * itemCls at the field level will override the default itemCls supplied at the container level.</div>
 * </li>
 * <li><b>labelSeparator</b>: (String)<div class="sub-desc">
 * 每个表格标签之后显示的文本分隔符（默认为':'或者{@link #labelSeparator}指定的值）。要隐藏分隔符则设置为 ''。<br />
 * The separator to display after the text of the label for this field
 * (defaults to a colon ':' or the layout's value for {@link #labelSeparator}).  To hide the separator use empty string ''.</div>
 * </li>
 * <li><b>labelStyle</b>: (String)<div class="sub-desc">
 * 一个 CSS 样式字串用于此布局中的所有字段的标签上（默认为''或者{@link #labelStyle}指定的值）。<br />
 * A CSS style specification string to add to the field label for this field
 * (defaults to '' or the layout's value for {@link #labelStyle}).</div>
 * </li>
 * </ul></div></p>
 * 使用示例：Example usage:</p>
 * <pre><code>
// 如果要显示效验信息则必需 Required if showing validation messages
Ext.QuickTips.init();


// 虽然你也可以创建一个包含 layout:'form' 的 Panel，但是我们建议使用 FormPanel 来代替，因为它自带 FormLayout 布局。
// While you can create a basic Panel with layout:'form', practically
// you should usually use a FormPanel to also get its form functionality
// since it already creates a FormLayout internally.
var form = new Ext.form.FormPanel({
    labelWidth: 75,
    title: 'Form Layout',
    bodyStyle:'padding:15px',
    width: 350,
    labelPad: 10,
    defaultType: 'textfield',
    defaults: {
        // 应用于每个被包含的项 applied to each contained item
        width: 230,
        msgTarget: 'side'
    },
    layoutConfig: {
        // 这里是布局配置项 layout-specific configs go here
        labelSeparator: ''
    },
    items: [{
            fieldLabel: 'First Name',
            name: 'first',
            allowBlank: false
        },{
            fieldLabel: 'Last Name',
            name: 'last'
        },{
            fieldLabel: 'Company',
            name: 'company'
        },{
            fieldLabel: 'Email',
            name: 'email',
            vtype:'email'
        }
    ],
    buttons: [{
        text: 'Save'
    },{
        text: 'Cancel'
    }]
});
</code></pre>
 */
Ext.layout.FormLayout = Ext.extend(Ext.layout.AnchorLayout, {
    /**
     * @cfg {String} labelSeparator
     * 每个表格标签之后显示的文本分隔符（默认为 ':'）。要关闭此布局中的所有字段的分隔符，可以设置该字串为 ''
     * （如果在字段的设置里面指定了分隔符，仍然会被显示）。<br />
     * The standard separator to display after the text of each form label (defaults to a colon ':').  To turn off
     * separators for all fields in this layout by default specify empty string '' (if the labelSeparator value is
     * explicitly set at the field level, those will still be displayed).
     */
    labelSeparator : ':',

    // private
    setContainer : function(ct){
        Ext.layout.FormLayout.superclass.setContainer.call(this, ct);
        if(ct.labelAlign){
            ct.addClass('x-form-label-'+ct.labelAlign);
        }

        if(ct.hideLabels){
            this.labelStyle = "display:none";
            this.elementStyle = "padding-left:0;";
            this.labelAdjust = 0;
        }else{
            this.labelSeparator = ct.labelSeparator || this.labelSeparator;
            ct.labelWidth = ct.labelWidth || 100;
            if(typeof ct.labelWidth == 'number'){
                var pad = (typeof ct.labelPad == 'number' ? ct.labelPad : 5);
                this.labelAdjust = ct.labelWidth+pad;
                this.labelStyle = "width:"+ct.labelWidth+"px;";
                this.elementStyle = "padding-left:"+(ct.labelWidth+pad)+'px';
            }
            if(ct.labelAlign == 'top'){
                this.labelStyle = "width:auto;";
                this.labelAdjust = 0;
                this.elementStyle = "padding-left:0;";
            }
        }

        if(!this.fieldTpl){
            // the default field template used by all form layouts
            var t = new Ext.Template(
                '<div class="x-form-item {5}" tabIndex="-1">',
                    '<label for="{0}" style="{2}" class="x-form-item-label">{1}{4}</label>',
                    '<div class="x-form-element" id="x-form-el-{0}" style="{3}">',
                    '</div><div class="{6}"></div>',
                '</div>'
            );
            t.disableFormats = true;
            t.compile();
            Ext.layout.FormLayout.prototype.fieldTpl = t;
        }
    },

    //private
    getLabelStyle: function(s){
        var ls = '', items = [this.labelStyle, s];
        for (var i = 0, len = items.length; i < len; ++i){
            if (items[i]){
                ls += items[i];
                if (ls.substr(-1, 1) != ';'){
                    ls += ';'
                }
            }
        }
        return ls;
    },

    // private
    renderItem : function(c, position, target){
        if(c && !c.rendered && (c.isFormField || c.fieldLabel) && c.inputType != 'hidden'){
            var args = [
                   c.id, c.fieldLabel,
                   this.getLabelStyle(c.labelStyle),
                   this.elementStyle||'',
                   typeof c.labelSeparator == 'undefined' ? this.labelSeparator : c.labelSeparator,
                   (c.itemCls||this.container.itemCls||'') + (c.hideLabel ? ' x-hide-label' : ''),
                   c.clearCls || 'x-form-clear-left' 
            ];
            if(typeof position == 'number'){
                position = target.dom.childNodes[position] || null;
            }
            if(position){
                this.fieldTpl.insertBefore(position, args);
            }else{
                this.fieldTpl.append(target, args);
            }
            c.render('x-form-el-'+c.id);
        }else {
            Ext.layout.FormLayout.superclass.renderItem.apply(this, arguments);
        }
    },

    // private
    adjustWidthAnchor : function(value, comp){
        return value - (comp.isFormField || comp.fieldLabel  ? (comp.hideLabel ? 0 : this.labelAdjust) : 0);
    },

    // private
    isValidParent : function(c, target){
        return true;
    }

    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS['form'] = Ext.layout.FormLayout;