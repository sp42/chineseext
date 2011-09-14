/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.data.GroupingStore
 * @extends Ext.data.Store
 * 一个特殊的Store实现，提供由字段中提取某一个来划分记录的功能。
 * GroupingStore通常和{@link Ext.grid.GroupingView}一起用，来证明为分组GridPanel划分data model。<br />
 * A specialized store implementation that provides for grouping records by one of the available fields. This
 * is usually used in conjunction with an {@link Ext.grid.GroupingView} to proved the data model for
 * a grouped GridPanel.
 * @constructor 创建一个新的GroupingStore对象。Creates a new GroupingStore.
 * @param {Object} config 一配置对象，包含了Store用来访问数据，及读数据至Records的对象。 A config object containing the objects needed for the Store to access data,
 * and read the data into Records.
 */
Ext.data.GroupingStore = Ext.extend(Ext.data.Store, {
    /**
     * @cfg {String} groupField
     * Store中哪一个字段的数据是要排序的（默认为""）。
     * The field name by which to sort the store's data (defaults to '').
     */
    /**
     * @cfg {Boolean} remoteGroup
     * True表示让服务端进行排序，false就表示本地排序（默认为false）
     * 如果是本地的排序，那么数据会立即发生变化。
     * 如果是远程的， 那么这仅仅是一个辅助类，它会向服务器发出“groupBy”的参数。
     * True if the grouping should apply on the server side, false if it is local only (defaults to false).  If the
     * grouping is local, it can be applied immediately to the data.  If it is remote, then it will simply act as a
     * helper, automatically sending the grouping field name as the 'groupBy' param with each XHR call.
     */
    remoteGroup : false,
    /**
     * @cfg {Boolean} groupOnSort
     * True表示为当分组操作发起时，在分组字段上进行数据排序，false表示为只根据当前排序的信息来排序（默认为false）。
     * True to sort the data on the grouping field when a grouping operation occurs, false to sort based on the
     * existing sort info (defaults to false).
     */
    groupOnSort:false,

    /**
     * 清除当前的组，并使用默认排序来刷新数据。
     * Clears any existing grouping and refreshes the data using the default sort.
     */
    clearGrouping : function(){
        this.groupField = false;
        if(this.remoteGroup){
            if(this.baseParams){
                delete this.baseParams.groupBy;
            }
            this.reload();
        }else{
            this.applySort();
            this.fireEvent('datachanged', this);
        }
    },

    /**
     * 对特定的字段进行分组。
     * Groups the data by the specified field.
     * @param {String} field field中哪一个字段的数据是要排序的名称。The field name by which to sort the store's data
     * @param {Boolean} forceRegroup （可选的）True表示为强制必须刷新组，即使传入的组与当前在分组的字段同名；false表示跳过同名字段的分组（默认为false）。 (optional)True to force the group to be refreshed even if the field passed
     * in is the same as the current grouping field, false to skip grouping on the same field (defaults to false)
     */
    groupBy : function(field, forceRegroup){
        if(this.groupField == field && !forceRegroup){
            return; // already grouped by this field
        }
        this.groupField = field;
        if(this.remoteGroup){
            if(!this.baseParams){
                this.baseParams = {};
            }
            this.baseParams['groupBy'] = field;
        }
        if(this.groupOnSort){
            this.sort(field);
            return;
        }
        if(this.remoteGroup){
            this.reload();
        }else{
            var si = this.sortInfo || {};
            if(si.field != field){
                this.applySort();
            }else{
                this.sortData(field);
            }
            this.fireEvent('datachanged', this);
        }
    },

    // private
    applySort : function(){
        Ext.data.GroupingStore.superclass.applySort.call(this);
        if(!this.groupOnSort && !this.remoteGroup){
            var gs = this.getGroupState();
            if(gs && gs != this.sortInfo.field){
                this.sortData(this.groupField);
            }
        }
    },

    // private
    applyGrouping : function(alwaysFireChange){
        if(this.groupField !== false){
            this.groupBy(this.groupField, true);
            return true;
        }else{
            if(alwaysFireChange === true){
                this.fireEvent('datachanged', this);
            }
            return false;
        }
    },

    // private
    getGroupState : function(){
        return this.groupOnSort && this.groupField !== false ?
               (this.sortInfo ? this.sortInfo.field : undefined) : this.groupField;
    }
});