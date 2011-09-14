/**
 * @class Ext.WindowGroup
 * 此对象代表一组{@link Ext.Window}的实例并提供z-order的管理和window激活的行为。
 * @constructor
 */
Ext.WindowGroup = function(){
    var list = {};
    var accessList = [];
    var front = null;

    // private
    var sortWindows = function(d1, d2){
        return (!d1._lastAccess || d1._lastAccess < d2._lastAccess) ? -1 : 1;
    };

    // private
    var orderWindows = function(){
        var a = accessList, len = a.length;
        if(len > 0){
            a.sort(sortWindows);
            var seed = a[0].manager.zseed;
            for(var i = 0; i < len; i++){
                var win = a[i];
                if(win && !win.hidden){
                    win.setZIndex(seed + (i*10));
                }
            }
        }
        activateLast();
    };

    // private
    var setActiveWin = function(win){
        if(win != front){
            if(front){
                front.setActive(false);
            }
            front = win;
            if(win){
                win.setActive(true);
            }
        }
    };

    // private
    var activateLast = function(){
        for(var i = accessList.length-1; i >=0; --i) {
            if(!accessList[i].hidden){
                setActiveWin(accessList[i]);
                return;
            }
        }
        // none to activate
        setActiveWin(null);
    };

    return {
        /**
         * windows的初始z-idnex（缺省为9000）
         * @type Number z-index的值
         */
        zseed : 9000,

        // private
        register : function(win){
            list[win.id] = win;
            accessList.push(win);
            win.on('hide', activateLast);
        },

        // private
        unregister : function(win){
            delete list[win.id];
            win.un('hide', activateLast);
            accessList.remove(win);
        },

        /**
         * 返回指定id的window。
         * @param {String/Object} id window的id或{@link Ext.Window}实例。
         * @return {Ext.Window}
         */
        get : function(id){
            return typeof id == "object" ? id : list[id];
        },

        /**
         * 将指定的window居于其它活动的window前面。
         * @param {String/Object} win window的id或{@link Ext.Window}实例。
         * @return {Boolean} True表示为对话框成功居前，else则本身已是在前面。
         */
        bringToFront : function(win){
            win = this.get(win);
            if(win != front){
                win._lastAccess = new Date().getTime();
                orderWindows();
                return true;
            }
            return false;
        },

        /**
         * 将指定的window居于其它活动的window后面。
         * @param {String/Object} win window的id或{@link Ext.Window}实例。
         * @return {Ext.Window} The window
         */
        sendToBack : function(win){
            win = this.get(win);
            win._lastAccess = -(new Date().getTime());
            orderWindows();
            return win;
        },

        /**
         * 隐藏组内的所有的window
         */
        hideAll : function(){
            for(var id in list){
                if(list[id] && typeof list[id] != "function" && list[id].isVisible()){
                    list[id].hide();
                }
            }
        },

        /**
         * 返回组内的当前活动的window
         * @return {Ext.Window} 活动的window
         */
        getActive : function(){
            return front;
        },

        /**
         * 传入一个制定的搜索函数到该方法内，返回组内的零个或多个windows。
         * 函数一般会接收{@link Ext.Window}的引用作为其唯一的函数，若window符合搜索的标准及返回true，
         * 否则应返回false.
         * @param {Function} fn 搜索函数
         * @param {Object} scope （可选的）执行函数的作用域（若不指定便是window会传入）
         * @return {Array} 零个或多个匹配的window
         */		
        getBy : function(fn, scope){
            var r = [];
            for(var i = accessList.length-1; i >=0; --i) {
                var win = accessList[i];
                if(fn.call(scope||win, win) !== false){
                    r.push(win);
                }
            }
            return r;
        },

        /**
         * 在组内的每一个window上执行指定的函数，传入window自身作为唯一的参数。若函数返回false即停止迭代。
         * @param {Function} fn 每一项都会执行的函数
         * @param {Object} scope （可选的）执行函数的作用域
         */		
        each : function(fn, scope){
            for(var id in list){
                if(list[id] && typeof list[id] != "function"){
                    if(fn.call(scope || list[id], list[id]) === false){
                        return;
                    }
                }
            }
        }
    };
};
