 /**
 * @class Ext.Container
 * @extends Ext.BoxComponent
 * {@link Ext.BoxComponent}的子类，用于承载其它任何组件，容器负责一些基础性的行为，也就是装载子项、添加、插入和移除子项。
 * 根据容纳子项的不同，所产生的可视效果，需委托任意布局类{@link #layout}中的一种来指点特定的布局逻辑（layout logic）。
 * 此类被于继承而且一般情况下不应通过关键字new来直接实例化。
 */
Ext.Container = Ext.extend(Ext.BoxComponent, {
     /** @cfg {Boolean} monitorResize
     * Ture表示为自动监视window resize的事件，以处理接下来一切的事情，包括对视见区（viewport）当前大小的感知，一般情况该值由{@link #layout}调控，而无须手动设置。
     */    
	/**
     * @cfg {String} layout
     * 此容器所使用的布局类型。如不指定，则使用缺省的{@link Ext.layout.ContainerLayout}类型。
     * 当中有效的值可以是：accordion、anchor、border、cavd、column、fit、form和table。
	 * 针对所选择布局类型，可指定{@link #layoutConfig}进一步配置。
     */     
	/**
     * @cfg {Object} layoutConfig
     * 选定好layout布局后，其相应的配置属性就在这个对象上进行设置。
     * (即与{@link #layout}配置联合使用)有关不同类型布局有效的完整配置信息，参阅对应的布局类：
     * <ul class="mdetail-params">
     * <li>{@link Ext.layout.Accordion}</li>
     * <li>{@link Ext.layout.AnchorLayout}</li>
     * <li>{@link Ext.layout.BorderLayout}</li>
     * <li>{@link Ext.layout.CardLayout}</li>
     * <li>{@link Ext.layout.ColumnLayout}</li>
     * <li>{@link Ext.layout.FitLayout}</li>
     * <li>{@link Ext.layout.FormLayout}</li>
     * <li>{@link Ext.layout.TableLayout}</li></ul>
     */
        
    /**
     * @cfg {Boolean/Number} bufferResize
     * When set to true (100 milliseconds) or a number of milliseconds, 
     * 当设置为true（100毫秒）或输入一个毫秒数，为此容器所分配的布局会缓冲其计算的频率和缓冲组件的重新布局。
     * 如容器包含大量的子组件或这样重型容器，在频繁进行高开销的布局时，该项尤为有用。
     */
     
    /**
     * @cfg {String/Number} activeItem
     * 组件id的字符串，或组件的索引，用于在容器布局渲染时候的设置为活动。例如，activeItem: 'item-1'或activeItem: 0
     * index 0 = 容器集合中的第一项）。只有某些风格的布局可设置activeItem（如{@link Ext.layout.Accordion}、{@link Ext.layout.CardLayout}和
     * {@link Ext.layout.FitLayout}），以在某个时刻中显示一项内容。相关内容请参阅{@link Ext.layout.ContainerLayout#activeItem}。
     */
        
    /**
     * @cfg {Mixed} items
     * 一个单独项，或子组件组成的数组，加入到此容器中。
     * 每一项的对象类型是基于{@link Ext.Component}的<br><br>
     * 你可传入一个组件的配置对象即是lazy-rendering的做法，这样做的好处是组件不会立即渲染，减低直接构建组件对象带来的开销。
     * 要发挥"lazy instantiation延时初始化"的特性，应对组件所属的登记类型的{@link Ext.Component#xtype}属性进行配置。<br><br>
     * 要了解所有可用的xtyps，可参阅{@link Ext.Component}。如传入的单独一个项，应直接传入一个对象的引用（
     * 如items: {...}）。多个项应以数组的类型传入（如items: [{...}, {...}]）。
     */ 
        
    /**
     * @cfg {Object} defaults
     * 应用在全体组件上的配置项对象，无论组件是由{@link #items}指定，抑或是通过{@link #add}、{@link #insert}的方法加入，都可支持。
     * 缺省的配置可以是任意多个容器能识别的“名称/值”，
     * 假设要自动为每一个{@link Ext.Panel}项设置padding内补丁，你可以传入defaults: {bodyStyle:'padding:15px'}。
     */
     
    /** @cfg {Boolean} autoDestroy
     * 若为true容器会自动销毁容器下面全部的组件，否则的话必须手动执行销毁过程（默认为true）。
     */     
    autoDestroy: true,
    
    /** @cfg {Boolean} hideBorders
     * True表示为隐藏容器下每个组件的边框，false表示保留组件现有的边框设置（默认为false）。
     */ 
        
    /** @cfg {String} defaultType
     * 容器的默认类型，用于在{@link Ext.ComponentMgr}中表示它的对象。（默认为'panel'）
     */     
    defaultType: 'panel',

    // private
    initComponent : function(){
        Ext.Container.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event afterlayout
             * 由关联的布局管理器（layout manager）分配好容器上的组件后触发
             * @param {Ext.Container} this
             * @param {ContainerLayout} layout 此容器的ContainerLayout实现。
             */
            'afterlayout',
            /**
             * @event beforeadd
             * {@link Ext.Component}要加入或要插入到容器之前触发的事件
             * @param {Ext.Container} this
             * @param {Ext.Component} component 要添加的组件
             * @param {Number} index 组件将会加入到容器items集合中的那个索引。
             */
            'beforeadd',
            /**
             * @event beforeremove
             * 任何从该容器身上移除{@link Ext.Component}之前触发的事件。若句柄返回false则取消移除。
             * @param {Ext.Container} this
             * @param {Ext.Component} component 要被移除的组件
             */
            'beforeremove',
            /**
             * @event add
             * {@link Ext.Component}加入或插入到容器成功后触发的事件
             * @param {Ext.Container} this
             * @param {Ext.Component} component 已添加的组件
             * @param {Number} index 组件加入到容器items集合中的索引。
             */
            'add',
            /**
             * @event remove
             * 任何从该容器身上移除{@link Ext.Component}成功后触发的事件。
             * @param {Ext.Container} this
             * @param {Ext.Component} component 被移除的组件对象
             */
            'remove'
        );

        /**
         * 此容器的组件集合，类型为{@link Ext.util.MixedCollection}
         * @type MixedCollection
         * @property items
         */        
        var items = this.items;
        if(items){
            delete this.items;
            if(items instanceof Array){
                this.add.apply(this, items);
            }else{
                this.add(items);
            }
        }
    },

    // private
    initItems : function(){
        if(!this.items){
            this.items = new Ext.util.MixedCollection(false, this.getComponentId);
            this.getLayout(); // initialize the layout
        }
    },

    // private
    setLayout : function(layout){
        if(this.layout && this.layout != layout){
            this.layout.setContainer(null);
        }
        this.initItems();
        this.layout = layout;
        layout.setContainer(this);
    },

    // private
    render : function(){
        Ext.Container.superclass.render.apply(this, arguments);
        if(this.layout){
            if(typeof this.layout == 'string'){
                this.layout = new Ext.Container.LAYOUTS[this.layout.toLowerCase()](this.layoutConfig);
            }
            this.setLayout(this.layout);

            if(this.activeItem !== undefined){
                var item = this.activeItem;
                delete this.activeItem;
                this.layout.setActiveItem(item);
                return;
            }
        }
        if(!this.ownerCt){
            this.doLayout();
        }
        if(this.monitorResize === true){
            Ext.EventManager.onWindowResize(this.doLayout, this);
        }
    },

    // protected - should only be called by layouts
    getLayoutTarget : function(){
        return this.el;
    },

    // private - used as the key lookup function for the items collection
    getComponentId : function(comp){
        return comp.itemId || comp.id;
    },

    /**
	 * 把组件（omponent） 加入到此容器。在加入之前触发 beforeadd 事件和加入完毕后触发 add事件。
	 * 如果在容器已渲染后执行add方法（译注，如没渲染，即是属于lazy_rending状态，自由地调用add方法是无所谓的），
	 * 你或许需要调用{@link #doLayout}的方法，刷新视图。
	 * 而多个子组件加入到布局，你只需执行一次这个方法。
     * @param {Ext.Component/Object} component 欲加入的组件component。<br><br>
     * Ext采用延时渲染（lazy-rendering），加入的组件只有到了需要显示的时候才会被渲染出来。<br><br>
     * 你可传入一个组件的配置对象即是lazy-rendering的做法，这样做的好处是组件不会立即渲染，减低直接构建组件对象带来的开销。<br><br>
	 * 要了解所有可用的xtyps，可参阅{@link Ext.Component}。
	 * 要发挥"lazy instantiation延时初始化"的特性，应对组件所属的登记类型的{@link Ext.Component#xtype}属性进行配置。
     * @return {Ext.Component} component 包含容器缺省配置值的组件（或配置项对象）。
     */     
 add : function(comp){
        if(!this.items){
            this.initItems();
        }
        var a = arguments, len = a.length;
        if(len > 1){
            for(var i = 0; i < len; i++) {
                this.add(a[i]);
            }
            return;
        }
        var c = this.lookupComponent(this.applyDefaults(comp));
        var pos = this.items.length;
        if(this.fireEvent('beforeadd', this, c, pos) !== false && this.onBeforeAdd(c) !== false){
            this.items.add(c);
            c.ownerCt = this;
            this.fireEvent('add', this, c, pos);
        }
        return c;
    },

	/**
     * 把插件(Component)插入到容器指定的位置(按索引)。
     * 执行插入之前触发beforeadd事件，插入完毕触发add事件。
     * @param {Number} index 组件插入到容器collection集合的索引
     * @param {Ext.Component/Object} component 欲加入的组件component。<br><br>
     * Ext采用延时渲染（lazy-rendering），加入的组件只有到了需要显示的时候才会被渲染出来。<br><br>
     * 你可传入一个组件的配置对象即是lazy-rendering，这样做的好处是组件不会立即渲染
	 * 减低直接构建组件对象带来的开销。<br><br>
	 * 要了解所有可用的xtyps，可参阅{@link Ext.Component}。
	 * 要发挥"lazy instantiation延时初始化"的特性，应对组件所属的登记类型的{@link Ext.Component#xtype}属性进行配置。
     * @return {Ext.Component} component 包含容器缺省配置值的组件（或配置项对象）。
     */   
     insert : function(index, comp){
        if(!this.items){
            this.initItems();
        }
        var a = arguments, len = a.length;
        if(len > 2){
            for(var i = len-1; i >= 1; --i) {
                this.insert(index, a[i]);
            }
            return;
        }
        var c = this.lookupComponent(this.applyDefaults(comp));

        if(c.ownerCt == this && this.items.indexOf(c) < index){
            --index;
        }

        if(this.fireEvent('beforeadd', this, c, index) !== false && this.onBeforeAdd(c) !== false){
            this.items.insert(index, c);
            c.ownerCt = this;
            this.fireEvent('add', this, c, index);
        }
        return c;
    },

    // private
    applyDefaults : function(c){
        if(this.defaults){
            if(typeof c == 'string'){
                c = Ext.ComponentMgr.get(c);
                Ext.apply(c, this.defaults);
            }else if(!c.events){
                Ext.applyIf(c, this.defaults);
            }else{
                Ext.apply(c, this.defaults);
            }
        }
        return c;
    },

    // private
    onBeforeAdd : function(item){
        if(item.ownerCt){
            item.ownerCt.remove(item, false);
        }
        if(this.hideBorders === true){
            item.border = (item.border === true);
        }
    },

     /**
     * 从此容器中移除某个组件。执行之前触发beforeremove事件，移除完毕后触发remove事件。
     * @param {Component/String} component 组件的引用或其id
     * @param {Boolean} autoDestroy (可选的) True表示为自动执行组件{@link Ext.Component#destroy} 的函数。
     */
    remove : function(comp, autoDestroy){
        var c = this.getComponent(comp);
        if(c && this.fireEvent('beforeremove', this, c) !== false){
            this.items.remove(c);
            delete c.ownerCt;
            if(autoDestroy === true || (autoDestroy !== false && this.autoDestroy)){
                c.destroy();
            }
            if(this.layout && this.layout.activeItem == c){
                delete this.layout.activeItem;
            }
            this.fireEvent('remove', this, c);
        }
        return c;
    },

    /**
     * 由id或索引直接返回容器的子组件。
     * @param {String/Number} comp id子组件的id或index。
     * @return Ext.Component
     */
     getComponent : function(comp){
        if(typeof comp == 'object'){
            return comp;
        }
        return this.items.get(comp);
    },

    // private
    lookupComponent : function(comp){
        if(typeof comp == 'string'){
            return Ext.ComponentMgr.get(comp);
        }else if(!comp.events){
            return this.createComponent(comp);
        }
        return comp;
    },

    // private
    createComponent : function(config){
        return Ext.ComponentMgr.create(config, this.defaultType);
    },

    /**
     * 重新计算容器的布局尺寸。当有新组件加入到已渲染容器或改变子组件的大小/位置之后，就需要执行此函数。
     */
    doLayout : function(){
        if(this.rendered && this.layout){
            this.layout.layout();
        }
        if(this.items){
            var cs = this.items.items;
            for(var i = 0, len = cs.length; i < len; i++) {
                var c  = cs[i];
                if(c.doLayout){
                    c.doLayout();
                }
            }
        }
    },

    /**
     * 返回容器在使用的布局。
     * 如没设置，会创建默认的{@link Ext.layout.ContainerLayout}作为容器的布局。
     * @return {ContainerLayout} 容器的布局
     */
     getLayout : function(){
        if(!this.layout){
            var layout = new Ext.layout.ContainerLayout(this.layoutConfig);
            this.setLayout(layout);
        }
        return this.layout;
    },

    // private
    onDestroy : function(){
        if(this.items){
            var cs = this.items.items;
            for(var i = 0, len = cs.length; i < len; i++) {
                Ext.destroy(cs[i]);
            }
        }
        if(this.monitorResize){
            Ext.EventManager.removeResizeListener(this.doLayout, this);
        }
        Ext.Container.superclass.onDestroy.call(this);
    },

    /**
     * 逐层上报(Bubbles up)组件/容器，上报过程中对组件执行指定的函数。
     * 函数的作用域（<i>this</i>）既可是参数传入或是当前组件(默认)函数的参数可经由args指定或当前组件提供，
     * 如果函数在某一个层次上返回false，上升将会停止。
     * @param {Function} fn 调用的函数。
     * @param {Object} scope (可选的) 函数的作用域（默认当前的点）
     * @param {Array} args (可选的) 函数将会传入的参数（默认为当前组件）
     */
     bubble : function(fn, scope, args){
        var p = this;
        while(p){
            if(fn.apply(scope || p, args || [p]) === false){
                break;
            }
            p = p.ownerCt;
        }
    },

    /**
     * 逐层下报(Cascades down)组件/容器（从它开始），下报过程中对组件执行指定的函数。
     * 函数的作用域（<i>this</i>）既可是参数传入或是当前组件(默认)函数的参数可经由args指定或当前组件提供，
     * 如果函数在某一个层次上返回false，下降将会停止。
     * @param {Function} fn 调用的函数。
     * @param {Object} scope (可选的) 函数的作用域（默认当前的点）
     * @param {Array} args (可选的) 函数将会传入的参数（默认为当前组件）
     */
     cascade : function(fn, scope, args){
        if(fn.apply(scope || this, args || [this]) !== false){
            if(this.items){
                var cs = this.items.items;
                for(var i = 0, len = cs.length; i < len; i++){
                    if(cs[i].cascade){
                        cs[i].cascade(fn, scope, args);
                    }else{
                        fn.apply(scope || this, args || [cs[i]]);
                    }
                }
            }
        }
    },

    /**
     * 在此容器之下由id查找任意层次的组件。
     * @param {String} id
     * @return Ext.Component
     */
     findById : function(id){
        var m, ct = this;
        this.cascade(function(c){
            if(ct != c && c.id === id){
                m = c;
                return false;
            }
        });
        return m || null;
    },

    /**
     * 在此容器之下由xtype或类本身作搜索依据查找组件。
     * @return {Array} Ext.Components数组
     */
     findByType : function(xtype){
        return typeof xtype == 'function' ?
            this.findBy(function(c){
                return c.constructor === xtype;
            }) :
            this.findBy(function(c){
                return c.constructor.xtype === xtype;
            });
    },

    /**
     * 在此容器之下由属性作搜索依据查找组件。
     * @param {String} prop
     * @param {String} value
     * @return {Array} Ext.Components数组
     */
     find : function(prop, value){
        return this.findBy(function(c){
            return c[prop] === value;
        });
    },

    /**
     * 在此容器之下由自定义的函数作搜索依据查找组件。
     * 如函数返回true返回组件的结果。传入的函数会有(component, this container)的参数。
     * @param {Function} fcn
     * @param {Object} scope （可选的）
     * @return {Array} Ext.Components数组
     */
     findBy : function(fn, scope){
        var m = [], ct = this;
        this.cascade(function(c){
            if(ct != c && fn.call(scope || c, c, ct) === true){
                m.push(c);
            }
        });
        return m;
    }
});

Ext.Container.LAYOUTS = {};
Ext.reg('container', Ext.Container);