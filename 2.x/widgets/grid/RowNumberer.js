/**
 * @class Ext.grid.RowNumberer
 * 一个辅助类，用于传入到{@link Ext.grid.ColumnModel} ，作为自动列数字的生成。
 * <br>用法：:<br>
 <pre><code>
 //这是一个典型的例子，第一行生成数字序号
 var colModel = new Ext.grid.ColumnModel([
    new Ext.grid.RowNumberer(),
    {header: "Name", width: 80, sortable: true},
    {header: "Code", width: 50, sortable: true},
    {header: "Description", width: 200, sortable: true}
 ]);
 </code></pre>
 * @constructor
 * @param {Object} config 配置项选项
*/
Ext.grid.RowNumberer = function(config){
    Ext.apply(this, config);
    if(this.rowspan){
        this.renderer = this.renderer.createDelegate(this);
    }
};

Ext.grid.RowNumberer.prototype = {
    /**
     * @cfg {String} header  任何有效的HMTL片断，显示在单元格头部（缺省为''）。
     */
    header: "",
    /**
     * @cfg {Number} width 列的默认宽度（默认为23）。
     */
    width: 23,
    /**
     * @cfg {Boolean} sortable True表示为数字列可以被排序（默认为fasle）
     */
    sortable: false,

    // private
    fixed:true,
    dataIndex: '',
    id: 'numberer',
    rowspan: undefined,

    // private
    renderer : function(v, p, record, rowIndex){
        if(this.rowspan){
            p.cellAttr = 'rowspan="'+this.rowspan+'"';
        }
        return rowIndex+1;
    }
};