/**
 * @class Ext.SplitButton
 * @extends Ext.Button
 * 一个提供了内建下拉箭头的分割按钮，该箭头还可以触发按钮默认的 click 之外的事件。
 * 典型的应用场景是，用来显示一个为主按钮提供附加选项的下拉菜单，并且可以为 arrowclick 事件设置单独的处理函数。
 * @cfg {Function} arrowHandler 点击箭头时调用的函数（可以用来代替的 click 事件）
 * @cfg {String} arrowTooltip 箭头的 title 属性
 * @constructor
 * 创建一个菜单按钮
 * @param {Object} config 配置选项对象
 */
Ext.SplitButton = Ext.extend(Ext.Button, {
    arrowSelector : 'button:last',

    initComponent : function(){
        Ext.SplitButton.superclass.initComponent.call(this);
        /**
         * @event arrowclick
         * 当点击按钮的箭头时触发
         * @param {MenuButton} this
         * @param {EventObject} e click 事件对象
         */
        this.addEvents("arrowclick");
    },

    onRender : function(ct, position){
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
        var btn, targs = [this.text || '&#160;', this.type];
        if(position){
            btn = tpl.insertBefore(position, targs, true);
        }else{
            btn = tpl.append(ct, targs, true);
        }
        var btnEl = btn.child(this.buttonSelector);

        this.initButtonEl(btn, btnEl);
        this.arrowBtnTable = btn.child("table:last");
        if(this.arrowTooltip){
            btn.child(this.arrowSelector).dom[this.tooltipType] = this.arrowTooltip;
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
                var ib = this.el.child(this.buttonSelector);
                if(ib && ib.getWidth() > 20){
                    ib.clip();
                    ib.setWidth(Ext.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
                }
            }
            if(this.minWidth){
                if((tbl.getWidth()+tbl2.getWidth()) < this.minWidth){
                    tbl.setWidth(this.minWidth-tbl2.getWidth());
                }
            }
            this.el.setWidth(tbl.getWidth()+tbl2.getWidth());
        } 
    },

    /**
     * 设置按钮的箭头点击处理函数
     * @param {Function} handler 点击箭头时调用的函数
     * @param {Object} scope （可选）处理函数的作用域
     */
    setArrowHandler : function(handler, scope){
        this.arrowHandler = handler;
        this.scope = scope;  
    },

    // private
    onClick : function(e){
        e.preventDefault();
        if(!this.disabled){
            if(e.getTarget(".x-btn-menu-arrow-wrap")){
                if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
                    this.showMenu();
                }
                this.fireEvent("arrowclick", this, e);
                if(this.arrowHandler){
                    this.arrowHandler.call(this.scope || this, this, e);
                }
            }else{
                if(this.enableToggle){
                    this.toggle();
                }
                this.fireEvent("click", this, e);
                if(this.handler){
                    this.handler.call(this.scope || this, this, e);
                }
            }
        }
    },

    getClickEl : function(e, isUp){
        if(!isUp){
            return (this.lastClickEl = e.getTarget("table", 10, true));
        }
        return this.lastClickEl;
    },

    onDisable : function(){
        if(this.el){
            if(!Ext.isIE6){
                this.el.addClass("x-item-disabled");
            }
            this.el.child(this.buttonSelector).dom.disabled = true;
            this.el.child(this.arrowSelector).dom.disabled = true;
        }
        this.disabled = true;
    },

    onEnable : function(){
        if(this.el){
            if(!Ext.isIE6){
                this.el.removeClass("x-item-disabled");
            }
            this.el.child(this.buttonSelector).dom.disabled = false;
            this.el.child(this.arrowSelector).dom.disabled = false;
        }
        this.disabled = false;
    },

    isMenuTriggerOver : function(e){
        return this.menu && e.within(this.arrowBtnTable) && !e.within(this.arrowBtnTable, true);
    },

    isMenuTriggerOut : function(e, internal){
        return this.menu && !e.within(this.arrowBtnTable);
    },

    onDestroy : function(){
        Ext.destroy(this.arrowBtnTable);
        Ext.SplitButton.superclass.onDestroy.call(this);
    }
});

// backwards compat
Ext.MenuButton = Ext.SplitButton;


Ext.reg('splitbutton', Ext.SplitButton);