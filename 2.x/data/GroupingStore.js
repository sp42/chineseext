/**
 * @class Ext.data.GroupingStore
 * @extends Ext.data.Store
 * 一个特殊的Store实现，提供由字段中提取某一个来划分记录的功能。
 * @constructor
 * 创建一个新的GroupingStore对象。
 * @param {Object} config 一配置对象，包含了Store用来访问数据，及读数据至Records的对象。
 */
Ext.data.GroupingStore = Ext.extend(Ext.data.Store, {
    /**
     * @cfg {String} groupField
     * Store中哪一个字段的数据是要排序的（默认为""）。
     */
    /**
     * @cfg {Boolean} remoteGroup
     * True表示让服务端进行排序，false就表示本地排序（默认为false）
     * 如果是本地的排序，那么数据会立即发生变化。
     * 如果是远程的， 那么这仅仅是一个辅助类，它会向服务器发出“groupBy”的参数。
    */
    remoteGroup : false,
    /**
     * @cfg {Boolean} groupOnSort
     * True表示为当分组操作发起时，在分组字段上进行数据排序，false表示为只根据当前排序的信息来排序。（默认为false）.
     */
    groupOnSort:false,

    /**
     * 清除当前的组，并使用默认排序来刷新数据。
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
     * @param {String} field Store中哪一个字段的数据是要排序的名称
     * @param {Boolean} forceRegroup （可选的） True表示为强制必须刷新组，即使传入的组与当前在分组的字段同名；false表示跳过同名字段的分组。（默认为false）
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