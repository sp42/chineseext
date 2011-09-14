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
 * @class Ext.layout.ContainerLayout
 * <p>
 * 每个{@link Ext.Container Container}都委托布局管理器来渲染其子组件{@link Ext.Component Component}。
 * 至于哪一种布局管理器就取决于容器的{@link Ext.Container#layout configured}配置项。某些布局也有提供大小控制和子元件的布局控制。 <br />
 * Every delegates the rendering of its childs to a layout manager class which must be  into the Container.
 * Some layouts also provide sizing and positioning of child Components.
 * </p><p>
 * ContainerLayout是其它布局类的子类，它提供了基础性的逻辑。在Ext中，它只是把子元件负责渲染到容器中去，与大小尺寸和定位等的功能没有关系。
 * 应通过继承该类的方式使用，一般很少通过关键字new直接使用。<br />
 * The ContainerLayout class is the default layout manager used when no layout is configured into a Container.
 * It provides the basic foundation for all other layout classes in Ext. It simply renders all child Components
 * into the Container, performing no sizing os positioning services. This class is intended to be extended and should
 * generally not need to be created directly via the new keyword.
 * </p>
 */
Ext.layout.ContainerLayout = function(config){
    Ext.apply(this, config);
};

Ext.layout.ContainerLayout.prototype = {
    /**
     * @cfg {String} extraCls
     * 一个可选添加的CSS样式类，加入到组件的容器上（默认为''）。这为容器或容器的子节点加入标准CSS规则提供了方便。<br />
     * An optional extra CSS class that will be added to the container (defaults to '').  This can be useful for
     * adding customized styles to the container or any of its children using standard CSS rules.
     * 
     * <p>
     * An optional extra CSS class that will be added to the container. This can be useful for adding
     * customized styles to the container or any of its children using standard CSS rules. See
     * {@link Ext.Component}.{@link Ext.Component#ctCls ctCls} also.</p>
     * <p><b>Note</b>: <tt>extraCls</tt> defaults to <tt>''</tt> except for the following classes
     * which assign a value by default:
     * <div class="mdetail-params"><ul>
     * <li>{@link Ext.layout.AbsoluteLayout Absolute Layout} : <tt>'x-abs-layout-item'</tt></li>
     * <li>{@link Ext.layout.Box Box Layout} : <tt>'x-box-item'</tt></li>
     * <li>{@link Ext.layout.ColumnLayout Column Layout} : <tt>'x-column'</tt></li>
     * </ul></div>
     * To configure the above Classes with an extra CSS class append to the default.  For example,
     * for ColumnLayout:<pre><code>
     * extraCls: 'x-column custom-class'
     * </code></pre>
     * </p>
     */
    /**
     * @cfg {Boolean} renderHidden
     * True表示为在渲染时隐藏包含的每一项（缺省为false）。
     * True to hide each contained item on render (defaults to false).
     */

    /**
     * 与{@link Ext.Container#activeItem}关联。
     * 一个已激活{@link Ext.Component}的引用。
     * 例如，if(myPanel.layout.activeItem.id == 'item-1') { ... }。
     * activeItem只会作用在布局样式上。（像{@link Ext.layout.Accordion}，{@link Ext.layout.CardLayout}和{@link Ext.layout.FitLayout}）。只读的。 
     * Related to {@link Ext.Container#activeItem}.
     * A reference to the {@link Ext.Component} that is active.For example,
     * if(myPanel.layout.activeItem.id == 'item-1') { ... }.  activeItem only applies to layout styles that can
     * display items one at a time (like {@link Ext.layout.Accordion}, {@link Ext.layout.CardLayout}
     * and {@link Ext.layout.FitLayout}).  Read-only.  Related to {@link Ext.Container#activeItem}.
     * @type Ext.Component
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
		return target && c.getDomPositionEl().dom.parentNode == (target.dom || target);
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
            c.render(target, position);
            if(this.extraCls){
            	var t = c.getPositionEl ? c.getPositionEl() : c;
            	t.addClass(this.extraCls);
            }
            if (this.renderHidden && c != this.activeItem) {
                c.hide();
            }
        }else if(c && !this.isValidParent(c, target)){
            if(this.extraCls){
                var t = c.getPositionEl ? c.getPositionEl() : c;
            	t.addClass(this.extraCls);
            }
            if(typeof position == 'number'){
                position = target.dom.childNodes[position];
            }
            target.dom.insertBefore(c.getDomPositionEl().dom, position || null);
            c.container = target;
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
        if(typeof v == 'number'){
            v = v.toString();
        }
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
        if(len == 3){
            ms[3] = ms[1];
        }
        return {
            top:parseInt(ms[0], 10) || 0,
            right:parseInt(ms[1], 10) || 0,
            bottom:parseInt(ms[2], 10) || 0,
            left:parseInt(ms[3], 10) || 0
        };
    },

    /**
     * 销毁这个布局。这事一个默认的模板方法，但应该在其的子类中提供一个专门的销毁方法，以注销事件处理器或移除DOM节点。
     * Destroys this layout. This is a template method that is empty by default, but should be implemented
     * by subclasses that require explicit destruction to purge event handlers or remove DOM nodes.
     * @protected
     */
    destroy : Ext.emptyFn
};
Ext.Container.LAYOUTS['auto'] = Ext.layout.ContainerLayout;