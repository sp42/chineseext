/**
 * @class Ext.grid.CheckboxSelectionModel
 * @extends Ext.grid.RowSelectionModel
 * 通过checkbox选择或反选时触发选区轮换的一个制定选区模型。
 * @constructor
 * @param {Object} config 配置项选项
 */
Ext.grid.CheckboxSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {
    /**
     * @cfg {String} header 
     * 任何显示在checkbox列头部上有效的HTML片断（默认为 '&lt;div class="x-grid3-hd-checker">&#160;&lt;/div>'）
     * 默认的CSS样式类'x-grid3-hd-checker'负责头部的那个checkbox，以支持全局单击、反选的行为。
     * 这个字符串可以替换为任何有效的HTML片断，包括几句的文本字符串（如'Select Rows'），
     * 但是全局单击、反选行为的checkbox就只能“ x-grid3-hd-checker”的出现才能工作。
     */
    header: '<div class="x-grid3-hd-checker">&#160;</div>',
    /**
     * @cfg {Number} width 
     * checkbox列默认的宽度（默认为20）
     */
    width: 20,
    /**
     * @cfg {Boolean} sortable 
     * True表示为checkbox列可以被排序（默认为fasle）
     */
    sortable: false,

    // private
    fixed:true,
    dataIndex: '',
    id: 'checker',

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
        if(t.className == 'x-grid3-row-checker'){
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