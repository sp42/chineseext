/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见http://ajaxjs.com 或者 http://jstang.cn
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
 * @class Ext.grid.RowNumberer
 *  一个辅助类，用于传入到{@link Ext.grid.ColumnModel}，作为自动列数字的生成。<br />
 *  This is a utility class that can be passed into a {@link Ext.grid.ColumnModel} as a column config that provides an automatic row numbering column.
 * <br>用法 Usage:<br>
 <pre><code>
 // 这是一个典型的例子，第一行生成数字序号 
 // This is a typical column config with the first column providing row numbers
 var colModel = new Ext.grid.ColumnModel([
    new Ext.grid.RowNumberer(),
    {header: "Name", width: 80, sortable: true},
    {header: "Code", width: 50, sortable: true},
    {header: "Description", width: 200, sortable: true}
 ]);
 </code></pre>
 * @constructor
 * @param {Object} config 配置项选项 The configuration options
*/
Ext.grid.RowNumberer = function(config){
    Ext.apply(this, config);
    if(this.rowspan){
        this.renderer = this.renderer.createDelegate(this);
    }
};

Ext.grid.RowNumberer.prototype = {
    /**
     * @cfg {String} header 任何有效的HMTL片断，显示在单元格头部（缺省为''）。
     * Any valid text or HTML fragment to display in the header cell for the row number column (defaults to '').
     */
    header: "",
    /**
     * @cfg {Number} width 列的默认宽度（默认为23）。
     * The default width in pixels of the row number column (defaults to 23).
     */
    width: 23,
    /**
     * @cfg {Boolean} sortable True表示为数字列可以被排序（默认为fasle）。
     * True if the row number column is sortable (defaults to false).
     * @hide
     */
    sortable: false,

    // private
    fixed:true,
    menuDisabled:true,
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