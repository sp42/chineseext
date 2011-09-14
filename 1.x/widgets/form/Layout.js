/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.form.Layout
 * @extends Ext.Component
 * 为布局（layout）创建一个容器，域以{@link Ext.form.Form}类型显示
 * @constructor
 * @param {Object} config 配置选项
 */
Ext.form.Layout = function(config){
    Ext.form.Layout.superclass.constructor.call(this, config);
    this.stack = [];
};

Ext.extend(Ext.form.Layout, Ext.Component, {
    /**
     * @cfg {String/Object} autoCreate
     * 一个DomHelper创建元素的对象，或者为true，表示采用默认的方式创建元素。（默认为{tag: 'div', cls: 'x-form-ct'}）
     */
    /**
     * @cfg {String/Object/Function} style
     * 字符串特定的一种风格，例如"width:100px"，或者form中的对象{width:"100px"}，或者返回这样风格的函数。
     */
    /**
     * @cfg {String} labelAlign
     * 属性labelAlign（字符串），有效值为 "left," "top" 和 "right"(默认为 "left")
     */
    /**
     * @cfg {Number} labelWidth
     * 属性labelWidth（数字型），用像素固定域中全部标签的宽度(默认为 undefined)
     */
    /**
     * @cfg {Boolean} clear
     * 属性clear(布朗型),值为true时在布局的结尾添加一个清除元素，等价于CSS的属性clear: both (默认为true)
     */
    clear : true,
    /**
     * @cfg {String} labelSeparator
     * 此分隔符用于域标签之后（默认为':'）
     */
    labelSeparator : ':',
    /**
     * @cfg {Boolean} hideLabels
     * 值为true时隐藏域中的全部标签（默认为false）
     */
    hideLabels : false,

    // private
    defaultAutoCreate : {tag: 'div', cls: 'x-form-ct'},

    // private
    onRender : function(ct, position){
        if(this.el){ // from markup
            this.el = Ext.get(this.el);
        }else {  // generate
            var cfg = this.getAutoCreate();
            this.el = ct.createChild(cfg, position);
        }
        if(this.style){
            this.el.applyStyles(this.style);
        }
        if(this.labelAlign){
            this.el.addClass('x-form-label-'+this.labelAlign);
        }
        if(this.hideLabels){
            this.labelStyle = "display:none";
            this.elementStyle = "padding-left:0;";
        }else{
            if(typeof this.labelWidth == 'number'){
                this.labelStyle = "width:"+this.labelWidth+"px;";
                this.elementStyle = "padding-left:"+((this.labelWidth+(typeof this.labelPad == 'number' ? this.labelPad : 5))+'px')+";";
            }
            if(this.labelAlign == 'top'){
                this.labelStyle = "width:auto;";
                this.elementStyle = "padding-left:0;";
            }
        }
        var stack = this.stack;
        var slen = stack.length;
        if(slen > 0){
            if(!this.fieldTpl){
                var t = new Ext.Template(
                    '<div class="x-form-item {5}">',
                        '<label for="{0}" style="{2}">{1}{4}</label>',
                        '<div class="x-form-element" id="x-form-el-{0}" style="{3}">',
                        '</div>',
                    '</div><div class="x-form-clear-left"></div>'
                );
                t.disableFormats = true;
                t.compile();
                Ext.form.Layout.prototype.fieldTpl = t;
            }
            for(var i = 0; i < slen; i++) {
                if(stack[i].isFormField){
                    this.renderField(stack[i]);
                }else{
                    this.renderComponent(stack[i]);
                }
            }
        }
        if(this.clear){
            this.el.createChild({cls:'x-form-clear'});
        }
    },

    // private
    renderField : function(f){
       this.fieldTpl.append(this.el, [
               f.id, f.fieldLabel,
               f.labelStyle||this.labelStyle||'',
               this.elementStyle||'',
               typeof f.labelSeparator == 'undefined' ? this.labelSeparator : f.labelSeparator,
               f.itemCls||this.itemCls||''
       ]);
    },

    // private
    renderComponent : function(c){
        c.render(this.el);
    }
});

/**
 * @class Ext.form.Column
 * @extends Ext.form.Layout
 * 为布局创建一个列向容器，以{@link Ext.form.Form}类型呈现。
 * @constructor
 * @param {Object} config 配置选项
 */
Ext.form.Column = function(config){
    Ext.form.Column.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.Column, Ext.form.Layout, {
    /**
     * @cfg {Number/String} width
     * 该列的固定宽度，单位像素或是CSS允许的值( 默认为auto)
     */
    /**
     * @cfg {String/Object} autoCreate
	 * @cfg {String/Object} autoCreate 一个DomHelper创建元素的对象，或者为true，表示采用默认的方式创建元素。（默认为{tag: 'div', cls: 'x-form-ct x-form-column'}）
     */

    // private
    defaultAutoCreate : {tag: 'div', cls: 'x-form-ct x-form-column'},

    // private
    onRender : function(ct, position){
        Ext.form.Column.superclass.onRender.call(this, ct, position);
        if(this.width){
            this.el.setWidth(this.width);
        }
    }
});

/**
 * @class Ext.form.FieldSet
 * @extends Ext.form.Layout
 * 为布局创建一个域集合容器，以一个{@link Ext.form.Form}类型呈现
 * @constructor
 * @param {Object} config 配置选项
 */
Ext.form.FieldSet = function(config){
    Ext.form.FieldSet.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.FieldSet, Ext.form.Layout, {
    /**
     * @cfg {String} legend
     * 域集合说明的显示文字（默认''）
     */
    /**
     * @cfg {String/Object} autoCreate
     * 一个DomHelper创建元素的对象，或者为true，表示采用默认的方式创建元素。（默认为(defaults to {tag: 'fieldset', cn: {tag:'legend'}}）
     */

    // private
    defaultAutoCreate : {tag: 'fieldset', cn: {tag:'legend'}},

    // private
    onRender : function(ct, position){
        Ext.form.FieldSet.superclass.onRender.call(this, ct, position);
        if(this.legend){
            this.setLegend(this.legend);
        }
    },

    // private
    setLegend : function(text){
        if(this.rendered){
            this.el.child('legend').update(text);
        }
    }
});