 /**
 * @class Ext.layout.TableLayout
 * @extends Ext.layout.ContainerLayout
 * <p>
 * 这种布局可以让你把内容轻易地渲染到一个HTML表格。
 * 可指定列的总数，而跨行（rowspan）与跨列（colspan）就用于创建表格复杂的布局。
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'table' 的方式创建，一般很少通过关键字new直接使用。</p>
 * <p>注意必须通过{@link Ext.Container#layoutConfig}属性对象来指定属于此布局的配置，以便传入到layout的内部。  
 * 对于TableLayout而言，只有一个配置项属性就是{@link #columns}，
 * 不过在TableLayout下面的子项就有的针对该布局的配置项：<b>rowspan</b>和<b>colspan</b>，下面会进行解释。</p>
 * <p>
 * 构建一个TableLayout布局的基本概念与构建一个标准HTML表格在原理上非常相似。
 * 加入子面板时，无论使用哪一种的方式（指定属性rowspan或colspan）进行跨单元格处理时，都与HTML相同。
 * 比较起在HTML中创建何嵌套行或列，这种方式显得更为简单。你只需在layoutConfig中指定好列的数量
 * 跟着按照正常的顺序从左到右，由上到下地加入面板，布局就会自动计算相应的列数、是否跨行，跨列和怎么在单元格内定位。
 * 与HTML表格的要求差不多，必须从整体布局上正确设置好rowspans和colspans，否则表格不能补全或突出多余的单元格。用法举例：</p>
 * <pre><code>
// 以下代码会生成两行三列的表格。基本的布局是：
// +--------+-----------------+
// |   A    |   B             |
// |        |--------+--------|
// |        |   C    |   D    |
// +--------+--------+--------+
var table = new Ext.Panel({
    title: 'Table Layout',
    layout:'table',
    defaults: {
        // 对每一个子面板都有效
        bodyStyle:'padding:20px'
    },
    layoutConfig: {
        // 这里指定总列数
        columns: 3
    },
    items: [{
        html: '&lt;p&gt;Cell A content&lt;/p&gt;',
        rowspan: 2
    },{
        html: '&lt;p&gt;Cell B content&lt;/p&gt;',
        colspan: 2
    },{
        html: '&lt;p&gt;Cell C content&lt;/p&gt;'
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
     */

    // private
    monitorResize:false,

    // private
    setContainer : function(ct){
        Ext.layout.TableLayout.superclass.setContainer.call(this, ct);

        this.currentRow = 0;
        this.currentColumn = 0;
        this.spanCells = [];
    },

    // private
    onLayout : function(ct, target){
        var cs = ct.items.items, len = cs.length, c, i;

        if(!this.table){
            target.addClass('x-table-layout-ct');

            this.table = target.createChild(
                {tag:'table', cls:'x-table-layout', cellspacing: 0, cn: {tag: 'tbody'}}, null, true);

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
        var td = document.createElement('td'), row, colIndex;
        if(!this.columns){
            row = this.getRow(0);
        }else {
        	colIndex = this.currentColumn;
            if(colIndex !== 0 && (colIndex % this.columns === 0)){
                this.currentRow++;
                colIndex = (c.colspan || 1);
            }else{
                colIndex += (c.colspan || 1);
            }
            
            //advance to the next non-spanning row/col position
            var cell = this.getNextNonSpan(colIndex, this.currentRow);
            this.currentColumn = cell[0];
            if(cell[1] != this.currentRow){
            	//we are on a new row
            	this.currentRow = cell[1];
            	if(c.colspan){
            		//since the col index is now set at the start of the 
            		//new cell, any colspan needs to get reapplied.  This is
            		//only necessary if the row changed since the col index
            		//only gets reset in that case
            		this.currentColumn += c.colspan - 1;
            	}
            }
            row = this.getRow(this.currentRow);
        }
        if(c.colspan){
            td.colSpan = c.colspan;
        }
		td.className = 'x-table-layout-cell';
        if(c.rowspan){
            td.rowSpan = c.rowspan;
			var rowIndex = this.currentRow, colspan = c.colspan || 1;
			//track rowspanned cells to add to the column index during the next call to getNextCell
			for(var r = rowIndex+1; r < rowIndex+c.rowspan; r++){
				for(var col=this.currentColumn-colspan+1; col <= this.currentColumn; col++){
					if(!this.spanCells[col]){
						this.spanCells[col] = [];
					}
					this.spanCells[col][r] = 1;
				}
			}
        }
        row.appendChild(td);
        return td;
    },
    
    // private
    getNextNonSpan: function(colIndex, rowIndex){
    	var c = (colIndex <= this.columns ? colIndex : this.columns), r = rowIndex;
        for(var i=c; i <= this.columns; i++){
        	if(this.spanCells[i] && this.spanCells[i][r]){
        		if(++c > this.columns){
        			//exceeded column count, so reset to the start of the next row
	                return this.getNextNonSpan(1, ++r);
        		}
        	}else{
        		break;
        	}
        }
        return [c,r];
    },

    // private
    renderItem : function(c, position, target){
        if(c && !c.rendered){
            c.render(this.getNextCell(c));
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