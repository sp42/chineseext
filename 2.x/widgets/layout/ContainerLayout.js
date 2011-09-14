/**
 * @class Ext.layout.ContainerLayout
 * 每一个布局都内置有一个或多个{@link Ext.Container}的元素，而在Ext中，ContainerLayout是
 * ContainerLayout没有任何的外观表示，只是为特定功能的容器作为布局提供基础性的逻辑。
 * 应通过继承该类的方式使用，一般很少通过关键字new直接使用。
 */
Ext.layout.ContainerLayout = function(config){
    Ext.apply(this, config);
};

Ext.layout.ContainerLayout.prototype = {
     /**
     * @cfg {String} CSS
     * 一个可选添加的CSS样式类，加入到组件的容器上（默认为''）。
     * 这为容器或容器的子节点加入标准CSS规则提供了方便。
     */    
    /**
     * @cfg {Boolean} renderHidden
     * True表示为在渲染时隐藏包含的每一项（缺省为false）。
     */

    /**
     * 一个已激活{@link Ext.Component}的引用
     * 例如，if(myPanel.layout.activeItem.id == 'item-1') { ... }。
     * activeItem只会作用在布局样式上。（像{@link Ext.layout.Accordion}, 
     * {@link Ext.layout.CardLayout}和{@link Ext.layout.FitLayout}）。只读的。 
     *  Related to {@link Ext.Container#activeItem}.
     * @type {Ext.Component}
     * @property activeItem
     */

    // private
    monitorResize:false,
    // private
    activeItem : null,

    // private
    layout : function(){
        var target = this.container.getLayoutTarget();
        this.onLayout(this.container, target);
        this.container.fireEvent('afterlayout', this.container, this);
    },

    // private
    onLayout : function(ct, target){
        this.renderAll(ct, target);
    },

    // private
    isValidParent : function(c, target){
		var el = c.getPositionEl ? c.getPositionEl() : c.getEl();
		return el.dom.parentNode == target.dom;
    },

    // private
    renderAll : function(ct, target){
        var items = ct.items.items;
        for(var i = 0, len = items.length; i < len; i++) {
            var c = items[i];
            if(c && (!c.rendered || !this.isValidParent(c, target))){
                this.renderItem(c, i, target);
            }
        }
    },

    // private
    renderItem : function(c, position, target){
        if(c && !c.rendered){
            if(this.extraCls){
                c.addClass(this.extraCls);
            }
            c.render(target, position);
            if (this.renderHidden && c != this.activeItem) {
                c.hide();
            }
        }else if(c && !this.isValidParent(c, target)){
            if(this.extraCls){
                c.addClass(this.extraCls);
            }
            if(typeof position == 'number'){
                position = target.dom.childNodes[position];
            }
            target.dom.insertBefore(c.getEl().dom, position || null);
            if (this.renderHidden && c != this.activeItem) {
                c.hide();
            }
        }
    },

    // private
    onResize: function(){
        if(this.container.collapsed){
            return;
        }
        var b = this.container.bufferResize;
        if(b){
            if(!this.resizeTask){
                this.resizeTask = new Ext.util.DelayedTask(this.layout, this);
                this.resizeBuffer = typeof b == 'number' ? b : 100;
            }
            this.resizeTask.delay(this.resizeBuffer);
        }else{
            this.layout();
        }
    },

    // private
    setContainer : function(ct){
        if(this.monitorResize && ct != this.container){
            if(this.container){
                this.container.un('resize', this.onResize, this);
            }
            if(ct){
                ct.on('resize', this.onResize, this);
            }
        }
        this.container = ct;
    },

    // private
    parseMargins : function(v){
        var ms = v.split(' ');
        var len = ms.length;
        if(len == 1){
            ms[1] = ms[0];
            ms[2] = ms[0];
            ms[3] = ms[0];
        }
        if(len == 2){
            ms[2] = ms[0];
            ms[3] = ms[1];
        }
        return {
            top:parseInt(ms[0], 10) || 0,
            right:parseInt(ms[1], 10) || 0,
            bottom:parseInt(ms[2], 10) || 0,
            left:parseInt(ms[3], 10) || 0
        };
    }
};
Ext.Container.LAYOUTS['auto'] = Ext.layout.ContainerLayout;