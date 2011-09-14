/*
 * Ext JS Library 0.20
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * @class Ext.air.NativeWindow
 * @extends Ext.air.NativeObservable
 * 优化AIR原生窗体（NativeWindows）的功能，使之封装为Ext API的一部分<br/><br/>
 * 该类还包含这一功能：当程序最小化时，会自动通知系统托盘（system tray）。<br/><br/>
 * 此类许多的配置项只能应用到新窗口中。如果读取现有的一个窗体实例，来读取该实例的配置项传入到该类中，这样的做法是无效的
 * @constructor
 * @param {Object} config
 */
Ext.air.NativeWindow = function(config){
	Ext.apply(this, config);
	
	/**
	 * @type String
	 */
	this.id = this.id || Ext.uniqueId();
	
	this.addEvents(
		/**
		 * @event close
		 * @param {Object} e AIR事件对象
		 */
		'close', 
		/**
		 * @event closing
		 * @param {Object} e AIR事件对象
		 */
		'closing',
		/**
		 * @event move
		 * @param {Object} e AIR事件对象
		 */
		'move',
		/**
		 * @event moving
		 * @param {Object} e AIR事件对象
		 */
		'moving',
		/**
		 * @event resize
		 * @param {Object} e AIR事件对象
		 */
		'resize',
		/**
		 * @event resizing
		 * @param {Object} e AIR事件对象
		 */
		'resizing',
		/**
		 * @event displayStateChange
		 * @param {Object} e AIR事件对象
		 */
		'displayStateChange',
		/**
		 * @event displayStateChanging
		 * @param {Object} e AIR事件对象
		 */
		'displayStateChanging'
	);
	
	Ext.air.NativeWindow.superclass.constructor.call(this);
	
	if(!this.instance){
		var options = new air.NativeWindowInitOptions();
		options.systemChrome = this.chrome;
		options.type = this.type;
		options.resizable = this.resizable;
		options.minimizable = this.minimizable;
		options.maximizable = this.maximizable;
		options.transparent = this.transparent;
		
		this.loader = window.runtime.flash.html.HTMLLoader.createRootWindow(false, options, false);
		this.loader.load(new air.URLRequest(this.file));
	
		this.instance = this.loader.window.nativeWindow;
	}else{
		this.loader = this.instance.stage.getChildAt(0);
	}
	
	var provider = Ext.state.Manager;
	var b = air.Screen.mainScreen.visibleBounds;
	
	var state = provider.get(this.id) || {};
	provider.set(this.id, state);
		
	var win = this.instance;
	
	var width = Math.max(state.width || this.width, 100);
	var height = Math.max(state.height || this.height, 100);
	
	var centerX = b.x + ((b.width/2)-(width/2));
	var centerY = b.y + ((b.height/2)-(height/2));
	
	var x = !Ext.isEmpty(state.x, false) ? state.x : (!Ext.isEmpty(this.x, false) ? this.x : centerX);
	var y = !Ext.isEmpty(state.y, false) ? state.y : (!Ext.isEmpty(this.y, false) ? this.y : centerY);
	
	win.width = width;
	win.height = height;
	win.x = x;
	win.y = y;
	
	win.addEventListener('move', function(){
		if(win.displayState != air.NativeWindowDisplayState.MINIMIZED && win.width > 100 && win.height > 100) {
			state.x = win.x;
			state.y = win.y;
		}
	});	
	win.addEventListener('resize', function(){
		if (win.displayState != air.NativeWindowDisplayState.MINIMIZED && win.width > 100 && win.height > 100) {
			state.width = win.width;
			state.height = win.height;
		}
	});
	
	Ext.air.NativeWindowManager.register(this);
	this.on('close', this.unregister, this);
	
	/**
	 * @cfg {Boolean} minimizeToTray 
	 * True表示为可允许最小化到系统托盘中。
	 * 注意该项只适用于程序的主窗体，而且系统托盘的图标必须是指定的。
	 */
	if(this.minimizeToTray){
		this.initMinimizeToTray(this.trayIcon, this.trayMenu);
	}
	
};

Ext.extend(Ext.air.NativeWindow, Ext.air.NativeObservable, {
	
	/**
	 * @cfg {air.NativeWindow} instance 
	 * 要封装的那个原生窗体之实例。如没定义，就会新建一窗口。
	 */
	
	/**
	 * @cfg {String} trayIcon 
	 * 当程序最小化到系统托盘时的图标。
	 */
	/**
	 * @cfg {NativeMenu} trayMenu 
	 *当托盘被右击时，出现的菜单
	 */
	/**
	 * @cfg {String} trayTip 
	 * 托盘图标的提示信息
	 */	
	
	/**
	 * @cfg {String} chrome 
	 * 原生窗体的风格（可以是"standard"或“none"）
	 */
	chrome: 'standard', // can also be none
	/**
	 * @cfg {String} type 
	 * 原生窗体的类型-普通、工具型或轻盈的（默认为普通）
	 */
	type: 'normal',	// can be normal, utility or lightweight
	/**
	 * @cfg {Number} width
	 */
	width:600,
	/**
	 * @cfg {Number} height 
	 */
	height:400,
	/**
	 * @cfg {Boolean} resizable 
	 */
	resizable: true,
	/**
	 * @cfg {Boolean} minimizable 
	 */
	minimizable: true,
	/**
	 * @cfg {Boolean} maximizable 
	 */
	maximizable: true,
	/**
	 * @cfg {Boolean} transparent
	 */
	transparent: false,
	
	/**
	 * 返回air.NativeWindow实例
	 * @return air.NativeWindow
	 */
	getNative : function(){
		return this.instance;
	},
	
	/**
	 * 返回用于在屏幕居中的x/y坐标
	 * @return {x: Number, y: Number}
	 */
	getCenterXY : function(){
		var b = air.Screen.mainScreen.visibleBounds;
		return {
			x: b.x + ((b.width/2)-(this.width/2)),
			y: b.y + ((b.height/2)-(this.height/2))
		};
	},
	
	/**
	 *显示窗体
	 */
	show :function(){
		if(this.trayed){
			Ext.air.SystemTray.hideIcon();
			this.trayed = false;
		}
		this.instance.visible = true;
	},
	
	/**
	 * 显示激活窗体
	 */
	activate : function(){
		this.show();
		this.instance.activate();
	},
	
	/**
	 * 隐藏窗体
	 */
	hide :function(){
		this.instance.visible = false;
	},
	
	/**
	 * 关闭窗体
	 */
	close : function(){
		this.instance.close();	
	},
	
	/**
	 * 若window是最小化的状态返回true
	 * @return Boolean
	 */
	isMinimized :function(){
		return this.instance.displayState == air.NativeWindowDisplayState.MINIMIZED;
	},
	
	/**
	 * 若window是最大化的状态返回true
	 * @return Boolean
	 */
	isMaximized :function(){
		return this.instance.displayState == air.NativeWindowDisplayState.MAXIMIZED;
	},
	
	/**
	 * 移动窗体到指定的xy坐标
	 * @param {Number} x
	 * @param {Number} y
	 */
	moveTo : function(x, y){
		this.x = this.instance.x = x;
		this.y = this.instance.y = y;	
	},
	
	/**
	 * @param {Number} width 宽度
	 * @param {Number} height 高度
	 */
	resize : function(width, height){
		this.width = this.instance.width = width;
		this.height = this.instance.height = height;	
	},
	
	unregister : function(){
		Ext.air.NativeWindowManager.unregister(this);
	},
	
	initMinimizeToTray : function(icon, menu){
		var tray = Ext.air.SystemTray;
		
		tray.setIcon(icon, this.trayTip);
		this.on('displayStateChanging', function(e){
			if(e.afterDisplayState == 'minimized'){
				e.preventDefault();
				this.hide();
				tray.showIcon();
				this.trayed = true;
			}
		}, this);
		
		tray.on('click', function(){
			this.activate();
		}, this);
		
		if(menu){
			tray.setMenu(menu);
		}
	}
});

/**
 * 返回程序中初始窗体（主窗体）。
 * @return air.NativeWindow
 * @static
 */
Ext.air.NativeWindow.getRootWindow = function(){
	return air.NativeApplication.nativeApplication.openedWindows[0];
};

/**
 * 返回程序中初始窗体的那个"window"对象。这个"window"对象指的是浏览器中“原生”对象，与AIR编程模型无关。
 * @return Window
 * @static
 */
Ext.air.NativeWindow.getRootHtmlWindow = function(){
	return Ext.air.NativeWindow.getRootWindow().stage.getChildAt(0).window;
};

/**
 * @class Ext.air.NativeWindowGroup
 * NativeWindows集合类
 */
Ext.air.NativeWindowGroup = function(){
    var list = {};

    return {
		/**
		 * @param {Object} win
		 */
        register : function(win){
            list[win.id] = win;
        },

        /**
		 * @param {Object} win
		 */
        unregister : function(win){
            delete list[win.id];
        },

        /**
		 * @param {String} id
		 */
        get : function(id){
            return list[id];
        },

        /**
		 * Closes all windows
		 */
        closeAll : function(){
            for(var id in list){
                if(list.hasOwnProperty(id)){
                    list[id].close();
                }
            }
        },

        /**
         * Executes the specified function once for every window in the group, passing each
         * window as the only parameter. Returning false from the function will stop the iteration.
         * @param {Function} fn The function to execute for each item
         * @param {Object} scope (optional) The scope in which to execute the function
         */
        each : function(fn, scope){
            for(var id in list){
                if(list.hasOwnProperty(id)){
                    if(fn.call(scope || list[id], list[id]) === false){
                        return;
                    }
                }
            }
        }
    };
};

/**
 * @class Ext.air.NativeWindowManager
 * @extends Ext.air.NativeWindowGroup
 * 所有的NativeWindows保存在该集合中。
 * @singleton
 */
Ext.air.NativeWindowManager = new Ext.air.NativeWindowGroup();