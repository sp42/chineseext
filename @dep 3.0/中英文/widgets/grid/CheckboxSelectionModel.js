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
 * @class Ext.grid.CheckboxSelectionModel
 * @extends Ext.grid.RowSelectionModel
 * 通过checkbox选择或反选时触发选区轮换的一个制定选区模型。<br />
 * A custom selection model that renders a column of checkboxes that can be toggled to select or deselect rows.
 * @constructor
 * @param {Object} config 配置项选项 The configuration options
 */
Ext.grid.CheckboxSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {
    /**
     * @cfg {String} header 
	 * 任何显示在checkbox列头部上有效的HTML片断（默认为 '&lt;div class="x-grid3-hd-checker">&#160;&lt;/div>'）
     * 默认的CSS样式类'x-grid3-hd-checker'负责头部的那个checkbox，以支持全局单击、反选的行为。
     * 这个字符串可以替换为任何有效的HTML片断，包括几句的文本字符串（如'Select Rows'）， 但是全局单击、反选行为的checkbox就只能带有“x-grid3-hd-checker”样式的元素才能工作。<br />
	 * Any valid text or HTML fragment to display in the header cell for the checkbox column
     * (defaults to '&lt;div class="x-grid3-hd-checker">&#160;&lt;/div>').  The default CSS class of 'x-grid3-hd-checker'
     * displays a checkbox in the header and provides support for automatic check all/none behavior on header click.
     * This string can be replaced by any valid HTML fragment, including a simple text string (e.g., 'Select Rows'), but
     * the automatic check all/none behavior will only work if the 'x-grid3-hd-checker' class is supplied.
     */
    header: '<div class="x-grid3-hd-checker">&#160;</div>',
    /**
     * @cfg {Number} width checkbox列默认的宽度（默认为20）。 
     * The default width in pixels of the checkbox column (defaults to 20).
     */
    width: 20,
    /**
     * @cfg {Boolean} sortable True 表示为checkbox列可以被排序（默认为fasle）。
     * if the checkbox column is sortable (defaults to false).
     */
    sortable: false,

    // private
    menuDisabled:true,
    fixed:true,
    dataIndex: '',
    id: 'checker',

    constructor: function(){
        Ext.grid.CheckboxSelectionModel.superclass.constructor.apply(this, arguments);

        if(this.checkOnly){
            this.handleMouseDown = Ext.emptyFn;
        }
    },

    // private
    initEvents : function(){
        Ext.grid.CheckboxSelectionModel.superclass.initEvents.call(this);
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
            Ext.fly(view.innerHd).on('mousedown', this.onHdMouseDown, this);

        }, this);
    },

    // private
    onMouseDown : function(e, t){
        if(e.button === 0 && t.className == 'x-grid3-row-checker'){ // Only fire if left-click
            e.stopEvent();
            var row = e.getTarget('.x-grid3-row');
            if(row){
                var index = row.rowIndex;
                if(this.isSelected(index)){
                    this.deselectRow(index);
                }else{
                    this.selectRow(index, true);
                }
            }
        }
    },

    // private
    onHdMouseDown : function(e, t){
        if(t.className == 'x-grid3-hd-checker'){
            e.stopEvent();
            var hd = Ext.fly(t.parentNode);
            var isChecked = hd.hasClass('x-grid3-hd-checker-on');
            if(isChecked){
                hd.removeClass('x-grid3-hd-checker-on');
                this.clearSelections();
            }else{
                hd.addClass('x-grid3-hd-checker-on');
                this.selectAll();
            }
        }
    },

    // private
    renderer : function(v, p, record){
        return '<div class="x-grid3-row-checker">&#160;</div>';
    }
});