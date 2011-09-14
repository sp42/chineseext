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
 * @class Ext.grid.Column
 * Ext.grid.Column类。
 */
Ext.grid.Column = function(config){
    Ext.apply(this, config);

    if(typeof this.renderer == "string"){
        this.renderer = Ext.util.Format[this.renderer];
    }
    if(typeof this.id == "undefined"){
        this.id = ++Ext.grid.Column.AUTO_ID;
    }
    if(this.editor){
        if(this.editor.xtype && !this.editor.events){
            this.editor = Ext.create(this.editor, 'textfield');
        }
    }
}

Ext.grid.Column.AUTO_ID = 0;

Ext.grid.Column.prototype = {
    isColumn : true,
    renderer : function(value){
        if(typeof value == "string" && value.length < 1){
            return "&#160;";
        }
        return value;
    },

    getEditor: function(rowIndex){
        return this.editable !== false ? this.editor : null;
    },

    getCellEditor: function(rowIndex){
        var editor = this.getEditor(rowIndex);
        if(editor){
            if(!editor.startEdit){
                if(!editor.gridEditor){
                    editor.gridEditor = new Ext.grid.GridEditor(editor);
                }
                return editor.gridEditor;
            }else if(editor.startEdit){
                return editor;
            }
        }
        return null;
    }
};

Ext.grid.BooleanColumn = Ext.extend(Ext.grid.Column, {
    trueText: 'true',
    falseText: 'false',
    undefinedText: '&#160;',

    constructor: function(cfg){
        this.supr().constructor.apply(this, arguments);
        var t = this.trueText, f = this.falseText, u = this.undefinedText;
        this.renderer = function(v){
            if(v === undefined){
                return u;
            }
            if(!v || v === 'false'){
                return f;
            }
            return t;
        };
    }
});

Ext.grid.NumberColumn = Ext.extend(Ext.grid.Column, {
    format : '0,000.00',
    constructor: function(cfg){
        this.supr().constructor.apply(this, arguments);
        this.renderer = Ext.util.Format.numberRenderer(this.format);
    }
});

Ext.grid.DateColumn = Ext.extend(Ext.grid.Column, {
    format : 'm/d/Y',
    constructor: function(cfg){
        this.supr().constructor.apply(this, arguments);
        this.renderer = Ext.util.Format.dateRenderer(this.format);
    }
});

Ext.grid.TemplateColumn = Ext.extend(Ext.grid.Column, {
    constructor: function(cfg){
        this.supr().constructor.apply(this, arguments);
        var tpl = typeof this.tpl == 'object' ? this.tpl : new Ext.XTemplate(this.tpl);
        this.renderer = function(value, p, r){
            return tpl.apply(r.data);
        }
        this.tpl = tpl;
    }
});


Ext.grid.Column.types = {
    gridcolumn : Ext.grid.Column,
    booleancolumn: Ext.grid.BooleanColumn,
    numbercolumn: Ext.grid.NumberColumn,
    datecolumn: Ext.grid.DateColumn,
    templatecolumn: Ext.grid.TemplateColumn
};