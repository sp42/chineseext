/**
 * @class Ext.layout.FormLayout
 * @extends Ext.layout.AnchorLayout
 * <p>这是用来创建一个表单的布局。
 * 该类可以被继承或通过配置项 layout:'form' {@link Ext.Container#layout} 来创建，
 * 而不像通常情况下使用关键字 new 来创建。可是，在应用中，一般我们会选择使用 {@link Ext.form.FormPanel} （自动使用 FormLayout 作为布局类），而且它还提供了内建的读取、效验和提交表单的函数。</p>
 * <p>需要注意的是，当通过配置项来创建布局的时候，布局的属性必须通过 {@link Ext.Container#layoutConfig} 对象来指定。使用 FormLayout 布局的容器，也支持以下配置属性：
 * <ul>
 * <li><b>hideLabels</b>: (Boolean) 值为 true 则隐藏字段的标签（默认为 false）</li>
 * <li><b>itemCls</b>: (String) 添加到每个字段标签和字段元素之外的封装 DIV 之上的 CSS 类（默认类为 'x-form-item' 并且 itemCls 会附加在其后）</li>
 * <li><b>labelAlign</b>: (String) 默认的标签对齐方式。默认的值为空字串 ''，表示左对齐。指定 'top' 将会使标签顶端对齐。</li>
 * <li><b>labelPad</b>: (Number) 默认的以像素表示的字段标签的 padding 值（默认为 5）。只有在指定了 labelWidth 的时候 labelPad 有效，否则被忽略。</li>
 * <li><b>labelWidth</b>: (Number) 默认的以像素表示的字段标签的宽度（默认为 100）</li>
 * </ul></p>
 * <p>任意类型的组件都能被添加到 FormLayout 中，但是继承自 {@link Ext.form.Field} 的项还支持下列配置项属性：
 * <ul>
 * <li><b>clearCls</b>: (String) 添加到每个表单字段封装 DIV 的上用于实现 clear 效果的 CSS 类（默认为 'x-form-clear-left'）</li>
 * <li><b>fieldLabel</b>: (String) 显示的字段标签文本（默认为 ''）</li>
 * <li><b>hideLabel</b>: (Boolean) 值为 true 则隐藏字段的标签和分隔符（默认为 false）。</li>
 * <li><b>itemCls</b>: (String) 添加到每个字段标签和字段元素之外的封装 DIV 之上的 CSS 类（默认类为 'x-form-item' 并且 itemCls 会附加在其后）。如果提供了，则字段级的 itemCls 将会覆盖容器级的。</li>
 * <li><b>labelSeparator</b>: (String) 每个表格标签之后显示的文本分隔符（默认为 ':' 或者 {@link #labelSeparator} 指定的值）。要隐藏分隔符则设置为 ''。</li>
 * <li><b>labelStyle</b>: (String) 一个 CSS 样式字串用于此布局中的所有字段的标签上（默认为 '' 或者 {@link #labelStyle} 指定的值）。</li>
 * </ul>
 * 使用示例：</p>
 * <pre><code>
// 如果要显示效验信息则必需
Ext.QuickTips.init();

// 虽然你也可以创建一个包含 layout:'form' 的 Panel，但是我们建议使用 FormPanel 来代替，因为它自带 FormLayout 布局。
var form = new Ext.form.FormPanel({
    labelWidth: 75,
    title: 'Form Layout',
    bodyStyle:'padding:15px',
    width: 350,
    labelPad: 10,
    defaultType: 'textfield',
    defaults: {
        // 应用于每个被包含的项
        width: 230,
        msgTarget: 'side'
    },
    layoutConfig: {
        // 这里是布局配置项
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
     * @cfg {String} labelStyle
     * 一个 CSS 样式字串用于此布局中的所有字段的标签上（默认为 ''）。
     */
    /**
     * @cfg {String} elementStyle
     * 一个 CSS 样式字串用于此布局中的所有字段元素上（默认为 ''）。
     */
    /**
     * @cfg {String} labelSeparator
     * 每个表格标签之后显示的文本分隔符（默认为 ':'）。要关闭此布局中的所有字段的分隔符，可以设置该字串为 ''
     * （如果在字段的设置里面指定了分隔符，仍然会被显示）。
     */
    labelSeparator : ':',

    // private
    getAnchorViewSize : function(ct, target){
        return ct.body.getStyleSize();
    },

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

    // private
    renderItem : function(c, position, target){
        if(c && !c.rendered && c.isFormField && c.inputType != 'hidden'){
            var args = [
                   c.id, c.fieldLabel,
                   c.labelStyle||this.labelStyle||'',
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
        return value - (comp.hideLabel ? 0 : this.labelAdjust);
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