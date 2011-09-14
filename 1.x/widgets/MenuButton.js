/**
 * @class Ext.SplitButton
 * @extends Ext.Button
 * Split按钮可为按钮提供内建的箭头，能触发与按钮本身的单击事件不同事件。
 * 典型的应用是一个“总的”按钮按下后出现的下拉菜单，以提供更大的选择，但是也可以在箭头被单击时提供一个自定义的事件处理器实现。
 * @cfg {Function} arrowHandler 当箭头按钮被单击时所执行的函数（可代替单击的事件）
 * @cfg {String} arrowTooltip 箭头的title属性
 * @constructor
 * 创建菜单按钮
 * @param {String/HTMLElement/Element} renderTo 按钮加入到的元素
 * @param {Object} config 配置项对象
 */
Ext.SplitButton = function(renderTo, config){
    Ext.SplitButton.superclass.constructor.call(this, renderTo, config);
    /**
     * @event arrowclick
     * 当按钮箭头单击时触发
     * @param {SplitButton} this
     * @param {EventObject} e 单击事件
     */
    this.addEvents({"arrowclick":true});
};

Ext.extend(Ext.SplitButton, Ext.Button, {
    render : function(renderTo){
        // this is one sweet looking template!
        var tpl = new Ext.Template(
            '<table cellspacing="0" class="x-btn-menu-wrap x-btn"><tr><td>',
            '<table cellspacing="0" class="x-btn-wrap x-btn-menu-text-wrap"><tbody>',
            '<tr><td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><button class="x-btn-text" type="{1}">{0}</button></td></tr>',
            "</tbody></table></td><td>",
            '<table cellspacing="0" class="x-btn-wrap x-btn-menu-arrow-wrap"><tbody>',
            '<tr><td class="x-btn-center"><button class="x-btn-menu-arrow-el" type="button">&#160;</button></td><td class="x-btn-right"><i>&#160;</i></td></tr>',
            "</tbody></table></td></tr></table>"
        );
        var btn = tpl.append(renderTo, [this.text, this.type], true);
        var btnEl = btn.child("button");
        if(this.cls){
            btn.addClass(this.cls);
        }
        if(this.icon){
            btnEl.setStyle('background-image', 'url(' +this.icon +')');
        }
        if(this.iconCls){
            btnEl.addClass(this.iconCls);
            if(!this.cls){
                btn.addClass(this.text ? 'x-btn-text-icon' : 'x-btn-icon');
            }
        }
        this.el = btn;
        if(this.handleMouseEvents){
            btn.on("mouseover", this.onMouseOver, this);
            btn.on("mouseout", this.onMouseOut, this);
            btn.on("mousedown", this.onMouseDown, this);
            btn.on("mouseup", this.onMouseUp, this);
        }
        btn.on(this.clickEvent, this.onClick, this);
        if(this.tooltip){
            if(typeof this.tooltip == 'object'){
                Ext.QuickTips.tips(Ext.apply({
                      target: btnEl.id
                }, this.tooltip));
            } else {
                btnEl.dom[this.tooltipType] = this.tooltip;
            }
        }
        if(this.arrowTooltip){
            btn.child("button:nth(2)").dom[this.tooltipType] = this.arrowTooltip;
        }
        if(this.hidden){
            this.hide();
        }
        if(this.disabled){
            this.disable();
        }
        if(this.pressed){
            this.el.addClass("x-btn-pressed");
        }
        if(Ext.isIE && !Ext.isIE7){
            this.autoWidth.defer(1, this);
        }else{
            this.autoWidth();
        }
        if(this.menu){
            this.menu.on("show", this.onMenuShow, this);
            this.menu.on("hide", this.onMenuHide, this);
        }
    },

    // private
    autoWidth : function(){
        if(this.el){
            var tbl = this.el.child("table:first");
            var tbl2 = this.el.child("table:last");
            this.el.setWidth("auto");
            tbl.setWidth("auto");
            if(Ext.isIE7 && Ext.isStrict){
                var ib = this.el.child('button:first');
                if(ib && ib.getWidth() > 20){
                    ib.clip();
                    ib.setWidth(Ext.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
                }
            }
            if(this.minWidth){
                if(this.hidden){
                    this.el.beginMeasure();
                }
                if((tbl.getWidth()+tbl2.getWidth()) < this.minWidth){
                    tbl.setWidth(this.minWidth-tbl2.getWidth());
                }
                if(this.hidden){
                    this.el.endMeasure();
                }
            }
            this.el.setWidth(tbl.getWidth()+tbl2.getWidth());
        }
    },
    /**
     * 设置按钮单击时的事件处理器
     * @param {Function} handler 按钮单击时调用的函数
     * @param {Object} scope （可选的）刚才传入函数的作用域
     */
    setHandler : function(handler, scope){
        this.handler = handler;
        this.scope = scope;
    },

    /**
     * 设置按钮箭头被单击时的动作（事件处理器）
     * @param {Function} handler 箭头单击时调用的函数
     * @param {Object} scope （可选的）刚才传入函数的作用域
     */
    setArrowHandler : function(handler, scope){
        this.arrowHandler = handler;
        this.scope = scope;
    },

    /**
     * 按钮得到焦点
     */
    focus : function(){
        if(this.el){
            this.el.child("button:first").focus();
        }
    },

    // private
    onClick : function(e){
        e.preventDefault();
        if(!this.disabled){
            if(e.getTarget(".x-btn-menu-arrow-wrap")){
                if(this.menu && !this.menu.isVisible()){
                    this.menu.show(this.el, this.menuAlign);
                }
                this.fireEvent("arrowclick", this, e);
                if(this.arrowHandler){
                    this.arrowHandler.call(this.scope || this, this, e);
                }
            }else{
                this.fireEvent("click", this, e);
                if(this.handler){
                    this.handler.call(this.scope || this, this, e);
                }
            }
        }
    },
    // private
    onMouseDown : function(e){
        if(!this.disabled){
            Ext.fly(e.getTarget("table")).addClass("x-btn-click");
        }
    },
    // private
    onMouseUp : function(e){
        Ext.fly(e.getTarget("table")).removeClass("x-btn-click");
    }
});

// backwards compat
Ext.MenuButton = Ext.SplitButton;