/**
 * @class Ext.form.FieldSet
 * @extends Ext.Panel
 * 针对某一组字段的标准容器
 * @constructor
 * @param {Object} config 配置选项
 */
Ext.form.FieldSet = Ext.extend(Ext.Panel, {
    /**
     * @cfg {Boolean} checkboxToggle True表示在lengend标签之前fieldset的范围内渲染一个checkbox（默认为false）。
     * 选择该checkbox会为展开、收起该面板服务。 
     */
    /**
     * @cfg {String} checkboxName 分配到fieldset的checkbox的名称，在{@link #checkboxToggle} = true的情况有效
     * (defaults to '[checkbox id]-checkbox').
     */
    /**
     * @cfg {Number} labelWidth 标签的宽度，该属性会影响下级的子容器
     */
    /**
     * @cfg {String} itemCls 各字段下面的x-form-item的CSS样式类， 该属性会影响下级的子容器
     */
    /**
     * @cfg {String} baseCls 应用fieldset到基础样式类（默认为'x-fieldset'）
     */
    baseCls:'x-fieldset',
    /**
     * @cfg {String} layout fieldset所在的{@link Ext.Container#layout}的类型（默认为'form'）。
     */
    layout: 'form',
    
    // private
    onRender : function(ct, position){
        if(!this.el){
            this.el = document.createElement('fieldset');
            this.el.id = this.id;
            this.el.appendChild(document.createElement('legend')).className = 'x-fieldset-header';
        }

        Ext.form.FieldSet.superclass.onRender.call(this, ct, position);

        if(this.checkboxToggle){
            var o = typeof this.checkboxToggle == 'object' ?
                    this.checkboxToggle :
                    {tag: 'input', type: 'checkbox', name: this.checkboxName || this.id+'-checkbox'};
            this.checkbox = this.header.insertFirst(o);
            this.checkbox.dom.checked = !this.collapsed;
            this.checkbox.on('click', this.onCheckClick, this);
        }
    },

    // private
    onCollapse : function(doAnim, animArg){
        if(this.checkbox){
            this.checkbox.dom.checked = false;
        }
        this.afterCollapse();

    },

    // private
    onExpand : function(doAnim, animArg){
        if(this.checkbox){
            this.checkbox.dom.checked = true;
        }
        this.afterExpand();
    },

    /* //protected
     * This function is called by the fieldset's checkbox when it is toggled (only applies when
     * checkboxToggle = true).  This method should never be called externally, but can be
     * overridden to provide custom behavior when the checkbox is toggled if needed.
     */
    onCheckClick : function(){
        this[this.checkbox.dom.checked ? 'expand' : 'collapse']();
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

