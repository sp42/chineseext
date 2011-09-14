/**
* @class Ext.tree.TreeFilter
* 注意这个类是试验性的所以不会更新节点的缩进（连线）或者展开收回图标
* @param {TreePanel} tree
* @param {Object} config  配置项（可选的）
 */
Ext.tree.TreeFilter = function(tree, config){
    this.tree = tree;
    this.filtered = {};
    Ext.apply(this, config);
};

Ext.tree.TreeFilter.prototype = {
    clearBlank:false,
    reverse:false,
    autoClear:false,
    remove:false,

     /**
     * 通过指定的属性过滤数据
     * @param {String/RegExp} value既可以是属性值开头的字符串也可以是针对这个属性的正则表达式
     * @param {String} attr （可选）这个被传递的属性是你的属性的集合中的。默认是"text"
     * @param {TreeNode} startNode (可选)从这个节点开始是过滤的
     */     
    filter : function(value, attr, startNode){
        attr = attr || "text";
        var f;
        if(typeof value == "string"){
            var vlen = value.length;
            // auto clear empty filter
            if(vlen == 0 && this.clearBlank){
                this.clear();
                return;
            }
            value = value.toLowerCase();
            f = function(n){
                return n.attributes[attr].substr(0, vlen).toLowerCase() == value;
            };
        }else if(value.exec){ // regex?
            f = function(n){
                return value.test(n.attributes[attr]);
            };
        }else{
            throw 'Illegal filter type, must be string or regex';
        }
        this.filterBy(f, null, startNode);
	},

    /**
     * 通过一个函数过滤，这个被传递的函数将被这棵树中的每个节点调用（或从startNode开始)。如果函数返回true,那么该节点将保留否则它将被过滤掉.
     * 如果一个节点被过滤掉，那么它的子节点也都被过滤掉了
     * @param {Function} fn 过滤函数
     * @param {Object} scope （可选的）函数的作用域(默认是现在这个节点)
     */   
    filterBy : function(fn, scope, startNode){
        startNode = startNode || this.tree.root;
        if(this.autoClear){
            this.clear();
        }
        var af = this.filtered, rv = this.reverse;
        var f = function(n){
            if(n == startNode){
                return true;
            }
            if(af[n.id]){
                return false;
            }
            var m = fn.call(scope || n, n);
            if(!m || rv){
                af[n.id] = n;
                n.ui.hide();
                return false;
            }
            return true;
        };
        startNode.cascade(f);
        if(this.remove){
           for(var id in af){
               if(typeof id != "function"){
                   var n = af[id];
                   if(n && n.parentNode){
                       n.parentNode.removeChild(n);
                   }
               }
           } 
        }
    },
    
    /**
     * 清理现在的过滤。注意：设置的过滤带有remove选项的不能被清理
     */   

    clear : function(){
        var t = this.tree;
        var af = this.filtered;
        for(var id in af){
            if(typeof id != "function"){
                var n = af[id];
                if(n){
                    n.ui.show();
                }
            }
        }
        this.filtered = {}; 
    }
};