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
 * @class Ext.WindowGroup
 * 此对象代表一组{@link Ext.Window}的实例并提供z-order的管理和window激活的行为。<br />
 * An object that represents a group of {@link Ext.Window} instances and provides z-order management
 * and window activation behavior.
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
         * windows的初始z-idnex（缺省为9000）。
         * The starting z-index for windows (defaults to 9000)
         * @type Number z-index的值。The z-index value
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
         * Gets a registered window by id.
         * @param {String/Object} id window的id或{@link Ext.Window}实例。The id of the window or a {@link Ext.Window} instance
         * @return {Ext.Window}
         */
        get : function(id){
            return typeof id == "object" ? id : list[id];
        },

        /**
         * 将指定的window居于其它活动的window前面。
         * Brings the specified window to the front of any other active windows.
         * @param {String/Object} win window的id或{@link Ext.Window}实例。The id of the window or a {@link Ext.Window} instance
         * @return {Boolean} True表示为对话框成功居前，else则本身已是在前面。True if the dialog was brought to the front, else false
         * if it was already in front
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
         * Sends the specified window to the back of other active windows.
         * @param {String/Object} win window的id或{@link Ext.Window}实例。The id of the window or a {@link Ext.Window} instance
         * @return {Ext.Window} The window
         */
        sendToBack : function(win){
            win = this.get(win);
            win._lastAccess = -(new Date().getTime());
            orderWindows();
            return win;
        },

        /**
         * 隐藏组内的所有的window。
         * Hides all windows in the group.
         */
        hideAll : function(){
            for(var id in list){
                if(list[id] && typeof list[id] != "function" && list[id].isVisible()){
                    list[id].hide();
                }
            }
        },

        /**
         * 返回组内的当前活动的window。
         * Gets the currently-active window in the group.
         * @return {Ext.Window} 活动的window。The active window
         */
        getActive : function(){
            return front;
        },

        /**
         * 传入一个制定的搜索函数到该方法内，返回组内的零个或多个windows。
         * 函数一般会接收{@link Ext.Window}的引用作为其唯一的函数，若window符合搜索的标准及返回true，否则应返回false。
         * Returns zero or more windows in the group using the custom search function passed to this method.
         * The function should accept a single {@link Ext.Window} reference as its only argument and should
         * return true if the window matches the search criteria, otherwise it should return false.
         * @param {Function} fn 搜索函数。The search function
         * @param {Object} scope （可选的）执行函数的作用域（若不指定便是window会传入）。(optional) The scope in which to execute the function (defaults to the window
         * that gets passed to the function if not specified)
         * @return {Array} 零个或多个匹配的window。An array of zero or more matching windows
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
         * Executes the specified function once for every window in the group, passing each
         * window as the only parameter. Returning false from the function will stop the iteration.
         * @param {Function} fn 每一项都会执行的函数。The function to execute for each item
         * @param {Object} scope （可选的）执行函数的作用域。(optional) The scope in which to execute the function
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


/**
 * @class Ext.WindowMgr
 * @extends Ext.WindowGroup
 * 自动创建的window组管理器，全局的。要创建其他的组管理器，提供z-order的堆，实例化{@link Ext.WindowGroup}对象便可。
 * The default global window group that is available automatically.  To have more than one group of windows
 * with separate z-order stacks, create additional instances of {@link Ext.WindowGroup} as needed.
 * @singleton
 */
Ext.WindowMgr = new Ext.WindowGroup();