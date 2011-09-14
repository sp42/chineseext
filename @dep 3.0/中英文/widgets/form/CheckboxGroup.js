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
 * @class Ext.form.CheckboxGroup
 * @extends Ext.form.Field
 * {@link Ext.form.Checkbox}控制器的分组容器。<br />
 * A grouping container for {@link Ext.form.Checkbox} controls.
 * @constructor
 * 创建一个新的 CheckboxGroup。
 * Creates a new CheckboxGroup
 * @param {Object} config 配置选项。Configuration options
 * @xtype checkboxgroup
 */
Ext.form.CheckboxGroup = Ext.extend(Ext.form.Field, {
    /**
     * @cfg {Array} items 一个{@link Ext.form.Checkbox Checkbox}的数组，或者配置选项。
     * An Array of {@link Ext.form.Checkbox Checkbox}es or Checkbox config objects
     * to arrange in the group.
     */
    /**
     * @cfg {String/Number/Array} columns 使用自动布局显示 checkbox/radio 组的时候使用的列的数目，这个配置选项可以有多种不同的类型的值。
     * <ul><li><b>'auto'</b> : <p class="sub-desc"> 渲染的时候，组件会一列挨着一列，每一列的宽度按照整行的宽度均分。默认的是auto </p></li>
     * 
     * <li><b>Number</b> : <p class="sub-desc"> 如果你指定了一个像 3 这样的数字，那么将会创建指定的数目的列，包含的组建将会根据{@link #vertical}的值
     * 自动的分发。</p></li>
     * 
     * <li><b>Array</b> : Object<p class="sub-desc"> 你也可以指定一个整形和浮点型的数字组成的数组来表示各个列的宽度，比如[100, .25, .75]。
     *  Any integer values will be rendered first, 
     *  所有的整数型值会被先用来渲染，然后剩下的浮点型值将会被当做剩下的空间的百分比来计算。虽然不用使数据里的浮点型的值的和为一(100%)，
     *  但是如果你想要让组件填充满容器，你应该是他们的和为一。</p></li></ul>
     *  
     * Specifies the number of columns to use when displaying grouped
     * checkbox/radio controls using automatic layout.  This config can take several types of values:
     * <ul><li><b>'auto'</b> : <p class="sub-desc">The controls will be rendered one per column on one row and the width
     * of each column will be evenly distributed based on the width of the overall field container. This is the default.</p></li>
     * <li><b>Number</b> : <p class="sub-desc">If you specific a number (e.g., 3) that number of columns will be 
     * created and the contained controls will be automatically distributed based on the value of {@link #vertical}.</p></li>
     * <li><b>Array</b> : Object<p class="sub-desc">You can also specify an array of column widths, mixing integer
     * (fixed width) and float (percentage width) values as needed (e.g., [100, .25, .75]). Any integer values will
     * be rendered first, then any float values will be calculated as a percentage of the remaining space. Float
     * values do not have to add up to 1 (100%) although if you want the controls to take up the entire field
     * container you should do so.</p></li></ul>
     */
    columns : 'auto',
    /**
     * @cfg {Boolean} vertical 如果设置为 true，将包含的组件跨列分发，每一行从头到底完全填充。自动计算每一列的组件的数量以使每一列尽量平衡。
     * 默认为 false,每次每一列仅添加一个组件。每一行从头到尾完全填充。
     * True to distribute contained controls across columns, completely filling each column 
     * top to bottom before starting on the next column.  The number of controls in each column will be automatically
     * calculated to keep columns as even as possible.  The default value is false, so that controls will be added
     * to columns one at a time, completely filling each row left to right before starting on the next row.
     */
    vertical : false,
    /**
     * @cfg {Boolean} allowBlank 是否允许为空。false则至少要有一个选项被选中，如果没有被选中的选项，会显示{@link @blankText}的错误信息。默认为 true。
     * False to validate that at least one item in the group is checked (defaults to true).
     * If no items are selected at validation time, {@link @blankText} will be used as the error text. 
     */
    allowBlank : true,
    /**
     * @cfg {String} blankText {@link #allowBlank} 验证失败显示的错误信息。默认为："You must select at least one item in this group"。
     * Error text to display if the {@link #allowBlank} validation fails (defaults to "You must 
     * select at least one item in this group")
     */
    blankText : "You must select at least one item in this group",
    
    // 私有的
    defaultType : 'checkbox',
    
    // 私有的
    groupCls: 'x-form-check-group',
    
    // 私有的
    onRender : function(ct, position){
        if(!this.el){
            var panelCfg = {
                cls: this.groupCls,
                layout: 'column',
                border: false,
                renderTo: ct
            };
            var colCfg = {
                defaultType: this.defaultType,
                layout: 'form',
                border: false,
                defaults: {
                    hideLabel: true,
                    anchor: '100%'
                }
            }
            
            if(this.items[0].items){
                
                // The container has standard ColumnLayout configs, so pass them in directly

            	Ext.apply(panelCfg, {
                    layoutConfig: {columns: this.items.length},
                    defaults: this.defaults,
                    items: this.items
                })
                for(var i=0, len=this.items.length; i<len; i++){
                    Ext.applyIf(this.items[i], colCfg);
                };
                
            }else{
                
                // The container has field item configs, so we have to generate the column
                // panels first then move the items into the columns as needed.
                
                var numCols, cols = [];
                
                if(typeof this.columns == 'string'){ // 'auto' so create a col per item
                    this.columns = this.items.length;
                }
                if(!Ext.isArray(this.columns)){
                    var cs = [];
                    for(var i=0; i<this.columns; i++){
                        cs.push((100/this.columns)*.01); // distribute by even %
                    }
                    this.columns = cs;
                }
                
                numCols = this.columns.length;
                
                // Generate the column configs with the correct width setting
                for(var i=0; i<numCols; i++){
                    var cc = Ext.apply({items:[]}, colCfg);
                    cc[this.columns[i] <= 1 ? 'columnWidth' : 'width'] = this.columns[i];
                    if(this.defaults){
                        cc.defaults = Ext.apply(cc.defaults || {}, this.defaults)
                    }
                    cols.push(cc);
                };
                
                // Distribute the original items into the columns
                if(this.vertical){
                    var rows = Math.ceil(this.items.length / numCols), ri = 0;
                    for(var i=0, len=this.items.length; i<len; i++){
                        if(i>0 && i%rows==0){
                            ri++;
                        }
                        if(this.items[i].fieldLabel){
                            this.items[i].hideLabel = false;
                        }
                        cols[ri].items.push(this.items[i]);
                    };
                }else{
                    for(var i=0, len=this.items.length; i<len; i++){
                        var ci = i % numCols;
                        if(this.items[i].fieldLabel){
                            this.items[i].hideLabel = false;
                        }
                        cols[ci].items.push(this.items[i]);
                    };
                }
                
                Ext.apply(panelCfg, {
                    layoutConfig: {columns: numCols},
                    items: cols
                });
            }
            
            this.panel = new Ext.Panel(panelCfg);
            this.el = this.panel.getEl();
            
            if(this.forId && this.itemCls){
                var l = this.el.up(this.itemCls).child('label', true);
                if(l){
                    l.setAttribute('htmlFor', this.forId);
                }
            }
            
            var fields = this.panel.findBy(function(c){
                return c.isFormField;
            }, this);
            
            this.items = new Ext.util.MixedCollection();
            this.items.addAll(fields);
        }
        Ext.form.CheckboxGroup.superclass.onRender.call(this, ct, position);
    },
    
    // 私有的
    validateValue : function(value){
        if(!this.allowBlank){
            var blank = true;
            this.items.each(function(f){
                if(f.checked){
                    return blank = false;
                }
            }, this);
            if(blank){
                this.markInvalid(this.blankText);
                return false;
            }
        }
        return true;
    },
    
    // 私有的
    onDisable : function(){
        this.items.each(function(item){
            item.disable();
        })
    },

    // 私有的
    onEnable : function(){
        this.items.each(function(item){
            item.enable();
        })
    },
    
    // 私有的
    onResize : function(w, h){
        this.panel.setSize(w, h);
        this.panel.doLayout();
    },
    
    // inherit docs from Field
    reset : function(){
        Ext.form.CheckboxGroup.superclass.reset.call(this);
        this.items.each(function(c){
            if(c.reset){
                c.reset();
            }
        }, this);
    },
    
    /**
     * @cfg {String} name
     * @hide
     */
    /**
     * @method initValue
     * @hide
     */
    initValue : Ext.emptyFn,
    /**
     * @method getValue
     * @hide
     */
    getValue : Ext.emptyFn,
    /**
     * @method getRawValue
     * @hide
     */
    getRawValue : Ext.emptyFn,
    /**
     * @method setValue
     * @hide
     */
    setValue : Ext.emptyFn,
    /**
     * @method setRawValue
     * @hide
     */
    setRawValue : Ext.emptyFn
    
});

Ext.reg('checkboxgroup', Ext.form.CheckboxGroup);
