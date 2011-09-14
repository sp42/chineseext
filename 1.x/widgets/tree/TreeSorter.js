/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://www.extjs.com/license
 */

/**
 * @class Ext.tree.TreeSorter
 * Provides sorting of nodes in a TreePanel
 * 提供一个可排序节点的Tree面板
 *
 * @cfg {Boolean} folderSort True to sort leaf nodes under non leaf nodes设置为真时则同级的叶节点排在
 * @cfg {String} property The named attribute on the node to sort by (defaults to text)用节点上的那个属性排序（默认是text属性）
 * @cfg {String} dir The direction to sort (asc or desc) (defaults to asc)排序的方式（升序或降序）（默认时升序）
 * @cfg {String} leafAttr The attribute used to determine leaf nodes in folder sort (defaults to "leaf")
 * @cfg {Boolean} caseSensitive true for case sensitive sort (defaults to false)排序时大小写敏感（默认时false)
 * @cfg {Function} sortType A custom "casting" function used to convert node values before sorting
 * 在排序之前可以写一个强转函数用来转换节点的值
 * @constructor
 * @param {TreePanel} tree
 * @param {Object} config
 */
Ext.tree.TreeSorter = function(tree, config){
    Ext.apply(this, config);
    tree.on("beforechildrenrendered", this.doSort, this);
    tree.on("append", this.updateSort, this);
    tree.on("insert", this.updateSort, this);

    var dsc = this.dir && this.dir.toLowerCase() == "desc";
    var p = this.property || "text";
    var sortType = this.sortType;
    var fs = this.folderSort;
    var cs = this.caseSensitive === true;
    var leafAttr = this.leafAttr || 'leaf';

    this.sortFn = function(n1, n2){
        if(fs){
            if(n1.attributes[leafAttr] && !n2.attributes[leafAttr]){
                return 1;
            }
            if(!n1.attributes[leafAttr] && n2.attributes[leafAttr]){
                return -1;
            }
        }
    	var v1 = sortType ? sortType(n1) : (cs ? n1.attributes[p] : n1.attributes[p].toUpperCase());
    	var v2 = sortType ? sortType(n2) : (cs ? n2.attributes[p] : n2.attributes[p].toUpperCase());
    	if(v1 < v2){
			return dsc ? +1 : -1;
		}else if(v1 > v2){
			return dsc ? -1 : +1;
        }else{
	    	return 0;
        }
    };
};

Ext.tree.TreeSorter.prototype = {
    doSort : function(node){
        node.sort(this.sortFn);
    },

    compareNodes : function(n1, n2){
        return (n1.text.toUpperCase() > n2.text.toUpperCase() ? 1 : -1);
    },

    updateSort : function(tree, node){
        if(node.childrenRendered){
            this.doSort.defer(1, this, [node]);
        }
    }
};