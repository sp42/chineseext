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
 * @class Ext.layout.TableLayout
 * @extends Ext.layout.ContainerLayout
 * <p>
 * 这种布局可以让你把内容轻易地渲染到一个HTML表格。可指定列的总数，而属性：跨行（rowspan）与跨列（colspan）就用于创建表格复杂的布局。
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'table'的方式创建，一般很少通过关键字new直接使用。<br />
 * This layout allows you to easily render content into an HTML table.  The total number of columns can be
 * specified, and rowspan and colspan can be used to create complex layouts within the table.
 * This class is intended to be extended or created via the layout:'table' {@link Ext.Container#layout} config,
 * and should generally not need to be created directly via the new keyword.</p>
 * <p>
 * 注意必须通过{@link Ext.Container#layoutConfig}属性对象来指定属于此布局的配置，以便传入到layout的内部。  
 * 就TableLayout而言，它只有一个配置项属性那便是{@link #columns}。不过，属于TableLayout内的每一项可设置以下针对表格的配置项属性：<br />
 * Note that when creating a layout via config, the layout-specific config properties must be passed in via
 * the {@link Ext.Container#layoutConfig} object which will then be applied internally to the layout.  In the
 * case of TableLayout, the only valid layout config property is {@link #columns}. 
 * However, the items added to a TableLayout can supply the following table-specific config properties:</p>
 * <ul>
 * <li><b>rowspan</b> 该项会在单元格上生效的rowspan。Applied to the table cell containing the item.</li>
 * <li><b>colspan</b> 该项会在单元格上生效的colspan。Applied to the table cell containing the item.</li>
 * <li><b>cellId</b>  该项会在单元格上生效的id。An id applied to the table cell containing the item.</li>
 * <li><b>cellCls</b> 添加到表格单元格内的CSS样式名称。A CSS class name added to the table cell containing the item.</li>
 * </ul>
 * <p>
 * 构建一个TableLayout布局的基本概念与构建一个标准HTML表格在原理上非常相似。
 * 加入子面板时，无论使用哪一种的方式（指定属性rowspan或colspan）进行跨单元格处理时，都与HTML相同。
 * 比较起在HTML中创建何嵌套行或列，这种方式显得更为简单。你只需在layoutConfig中指定好列的数量
 * 跟着按照正常的顺序从左到右，由上到下地加入面板，布局就会自动计算相应的列数、是否跨行，跨列和怎么在单元格内定位。
 * 与HTML表格的要求差不多，必须从整体布局上正确设置好rowspans和colspans，否则表格不能补全或突出多余的单元格。用法举例：<br />
 * The basic concept of building up a TableLayout is conceptually very similar to building up a standard
 * HTML table.  You simply add each panel (or "cell") that you want to include along with any span attributes
 * specified as the special config properties of rowspan and colspan which work exactly like their HTML counterparts.
 * Rather than explicitly creating and nesting rows and columns as you would in HTML, you simply specify the
 * total column count in the layoutConfig and start adding panels in their natural order from left to right,
 * top to bottom.  The layout will automatically figure out, based on the column count, rowspans and colspans,
 * how to position each panel within the table.  Just like with HTML tables, your rowspans and colspans must add
 * up correctly in your overall layout or you'll end up with missing and/or extra cells!  Example usage:</p>
 * <pre><code>
// 以下代码会生成两行三列的表格。基本的布局是：This code will generate a layout table that is 3 columns by 2 rows
// with some spanning included.  The basic layout will be:
// +--------+-----------------+
// |   A    |   B             |
// |        |--------+--------|
// |        |   C    |   D    |
// +--------+--------+--------+
var table = new Ext.Panel({
    title: 'Table Layout',
    layout:'table',
    defaults: {
        // 对每一个子面板都有效applied to each contained panel
        bodyStyle:'padding:20px'
    },
    layoutConfig: {
        // 这里指定总列数The total column count must be specified here
        columns: 3
    },
    items: [{
        html: '&lt;p&gt;Cell A content&lt;/p&gt;',
        rowspan: 2
    },{
        html: '&lt;p&gt;Cell B content&lt;/p&gt;',
        colspan: 2
    },{
        html: '&lt;p&gt;Cell C content&lt;/p&gt;',
        cellCls: 'highlight'
    },{
        html: '&lt;p&gt;Cell D content&lt;/p&gt;'
    }]
});
</code></pre>
 */
Ext.layout.TableLayout = Ext.extend(Ext.layout.ContainerLayout, {
    /**
     * @cfg {Number} columns
     * 为此布局里面的表格指定一个要创建列的数量。
     * 如不指定，所有加入到这个布局里的面板都会渲染单行单列的面板
     * The total number of columns to create in the table for this layout.  If not specified, all Components added to
     * this layout will be rendered into a single row using one column per Component.
     */

    // private
    monitorResize:false,

    /**
     * @cfg {Object} tableAttrs
     * <p>
     * 以{@link Ext.DomHelper DomHelper}专有的形式，指定<tt>&lt;table&gt;</tt>元素是如何创建的。举例：
     * An object containing properties which are added to the {@link Ext.DomHelper DomHelper} specification
     * used to create the layout's <tt>&lt;table&gt;</tt> element. Example:</p><pre><code>
{
    xtype: 'panel',
    layout: 'table',
    layoutConfig: {
        tableAttrs: {
        	style: {
        		width: '100%'
        	}
        },
        columns: 3
    }
}</code></pre>
     */
    tableAttrs:null,
    
    // private
    setContainer : function(ct){
        Ext.layout.TableLayout.superclass.setContainer.call(this, ct);

        this.currentRow = 0;
        this.currentColumn = 0;
        this.cells = [];
    },

    // private
    onLayout : function(ct, target){
        var cs = ct.items.items, len = cs.length, c, i;

        if(!this.table){
            target.addClass('x-table-layout-ct');

            this.table = target.createChild(
                Ext.apply({tag:'table', cls:'x-table-layout', cellspacing: 0, cn: {tag: 'tbody'}}, this.tableAttrs), null, true);

            this.renderAll(ct, target);
        }
    },

    // private
    getRow : function(index){
        var row = this.table.tBodies[0].childNodes[index];
        if(!row){
            row = document.createElement('tr');
            this.table.tBodies[0].appendChild(row);
        }
        return row;
    },

    // private
    getNextCell : function(c){
        var cell = this.getNextNonSpan(this.currentColumn, this.currentRow);
        var curCol = this.currentColumn = cell[0], curRow = this.currentRow = cell[1];
        for(var rowIndex = curRow; rowIndex < curRow + (c.rowspan || 1); rowIndex++){
            if(!this.cells[rowIndex]){
                this.cells[rowIndex] = [];
            }
            for(var colIndex = curCol; colIndex < curCol + (c.colspan || 1); colIndex++){
                this.cells[rowIndex][colIndex] = true;
            }
        }
        var td = document.createElement('td');
        if(c.cellId){
            td.id = c.cellId;
        }
        var cls = 'x-table-layout-cell';
        if(c.cellCls){
            cls += ' ' + c.cellCls;
        }
        td.className = cls;
        if(c.colspan){
            td.colSpan = c.colspan;
        }
        if(c.rowspan){
            td.rowSpan = c.rowspan;
        }
        this.getRow(curRow).appendChild(td);
        return td;
    },
    
    // private
    getNextNonSpan: function(colIndex, rowIndex){
        var cols = this.columns;
        while((cols && colIndex >= cols) || (this.cells[rowIndex] && this.cells[rowIndex][colIndex])) {
            if(cols && colIndex >= cols){
                rowIndex++;
                colIndex = 0;
            }else{
                colIndex++;
            }
        }
        return [colIndex, rowIndex];
    },

    // private
    renderItem : function(c, position, target){
        if(c && !c.rendered){
            c.render(this.getNextCell(c));
            if(this.extraCls){
                var t = c.getPositionEl ? c.getPositionEl() : c;
                t.addClass(this.extraCls);
            }
        }
    },

    // private
    isValidParent : function(c, target){
        return true;
    }

    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS['table'] = Ext.layout.TableLayout;