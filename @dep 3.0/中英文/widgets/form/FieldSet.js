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
 * @class Ext.form.FieldSet
 * @extends Ext.Panel
 * 针对某一组字段的标准容器。<br />
 * Standard container used for grouping form fields.
 * @constructor
 * @param {Object} config 配置选项 Configuration options
 */
Ext.form.FieldSet = Ext.extend(Ext.Panel, {
    /**
     * @cfg {Mixed} checkboxToggle True表示在lengend标签之前fieldset的范围内渲染一个checkbox，或者送入一个DomHelper的配置对象制定checkbox（默认为false）。选择该checkbox会为展开、收起该面板服务。
     * True to render a checkbox into the fieldset frame just in front of the legend,
     * or a DomHelper config object to create the checkbox.  (defaults to false).
     * The fieldset will be expanded or collapsed when the checkbox is toggled.
     */
    /**
     * @cfg {String} checkboxName 分配到fieldset的checkbox的名称，在{@link #checkboxToggle} = true的情况有效。（默认为'[checkbox id]-checkbox'）。
     * The name to assign to the fieldset's checkbox if {@link #checkboxToggle} = true (defaults to '[checkbox id]-checkbox').
     */
    /**
     * @cfg {Number} labelWidth 标签的宽度，该属性会影响下级的子容器。 
     * The width of labels. This property cascades to child containers.
     */
    /**
     * @cfg {String} itemCls 各字段下面的x-form-item的CSS样式类，该属性会影响下级的子容器。 
     * A css class to apply to the x-form-item of fields. This property cascades to child containers.
     */
    /**
     * @cfg {String} baseCls 应用fieldset到基础样式类（默认为'x-fieldset'）。
     * The base CSS class applied to the fieldset (defaults to 'x-fieldset').
     */
    baseCls:'x-fieldset',
    /**
     * @cfg {String} layout fieldset所在的{@link Ext.Container#layout}的类型（默认为'form'）。
     * The {@link Ext.Container#layout} to use inside the fieldset (defaults to 'form').
     */
    layout: 'form',
    /**
     * @cfg {Boolean} animCollapse
     * True to animate the transition when the panel is collapsed, false to skip the animation (defaults to false).
     */
    animCollapse: false,

    // private
    onRender : function(ct, position){
        if(!this.el){
            this.el = document.createElement('fieldset');
            this.el.id = this.id;
            if (this.title || this.header || this.checkboxToggle) {
                this.el.appendChild(document.createElement('legend')).className = 'x-fieldset-header';
            }
        }

        Ext.form.FieldSet.superclass.onRender.call(this, ct, position);

        if(this.checkboxToggle){
            var o = typeof this.checkboxToggle == 'object' ?
                    this.checkboxToggle :
                    {tag: 'input', type: 'checkbox', name: this.checkboxName || this.id+'-checkbox'};
            this.checkbox = this.header.insertFirst(o);
            this.checkbox.dom.checked = !this.collapsed;
            this.mon(this.checkbox, 'click', this.onCheckClick, this);
        }
    },

    // private
    onCollapse : function(doAnim, animArg){
        if(this.checkbox){
            this.checkbox.dom.checked = false;
        }
        Ext.form.FieldSet.superclass.onCollapse.call(this, doAnim, animArg);

    },

    // private
    onExpand : function(doAnim, animArg){
        if(this.checkbox){
            this.checkbox.dom.checked = true;
        }
        Ext.form.FieldSet.superclass.onExpand.call(this, doAnim, animArg);
    },

    /* //protected
     * This function is called by the fieldset's checkbox when it is toggled (only applies when
     * checkboxToggle = true).  This method should never be called externally, but can be
     * overridden to provide custom behavior when the checkbox is toggled if needed.
     */
    onCheckClick : function(){
        this[this.checkbox.dom.checked ? 'expand' : 'collapse']();
    },
    
    // private
    beforeDestroy : function(){
        Ext.form.FieldSet.superclass.beforeDestroy.call(this);
    }

    /**
     * @cfg {String/Number} activeItem
     * @hide
     */
    /**
     * @cfg {Mixed} applyTo
     * @hide
     */
    /**
     * @cfg {Object/Array} bbar
     * @hide
     */
    /**
     * @cfg {Boolean} bodyBorder
     * @hide
     */
    /**
     * @cfg {Boolean} border
     * @hide
     */
    /**
     * @cfg {Boolean/Number} bufferResize
     * @hide
     */
    /**
     * @cfg {String} buttonAlign
     * @hide
     */
    /**
     * @cfg {Array} buttons
     * @hide
     */
    /**
     * @cfg {Boolean} collapseFirst
     * @hide
     */
    /**
     * @cfg {String} defaultType
     * @hide
     */
    /**
     * @cfg {String} disabledClass
     * @hide
     */
    /**
     * @cfg {String} elements
     * @hide
     */
    /**
     * @cfg {Boolean} floating
     * @hide
     */
    /**
     * @cfg {Boolean} footer
     * @hide
     */
    /**
     * @cfg {Boolean} frame
     * @hide
     */
    /**
     * @cfg {Boolean} header
     * @hide
     */
    /**
     * @cfg {Boolean} headerAsText
     * @hide
     */
    /**
     * @cfg {Boolean} hideCollapseTool
     * @hide
     */
    /**
     * @cfg {String} iconCls
     * @hide
     */
    /**
     * @cfg {Boolean/String} shadow
     * @hide
     */
    /**
     * @cfg {Number} shadowOffset
     * @hide
     */
    /**
     * @cfg {Boolean} shim
     * @hide
     */
    /**
     * @cfg {Object/Array} tbar
     * @hide
     */
    /**
     * @cfg {Boolean} titleCollapse
     * @hide
     */
    /**
     * @cfg {Array} tools
     * @hide
     */
    /**
     * @cfg {String} xtype
     * @hide
     */
    /**
     * @property header
     * @hide
     */
    /**
     * @property footer
     * @hide
     */
    /**
     * @method focus
     * @hide
     */
    /**
     * @method getBottomToolbar
     * @hide
     */
    /**
     * @method getTopToolbar
     * @hide
     */
    /**
     * @method setIconClass
     * @hide
     */
    /**
     * @event activate
     * @hide
     */
    /**
     * @event beforeclose
     * @hide
     */
    /**
     * @event bodyresize
     * @hide
     */
    /**
     * @event close
     * @hide
     */
    /**
     * @event deactivate
     * @hide
     */
});
Ext.reg('fieldset', Ext.form.FieldSet);

