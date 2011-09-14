/*
 * Ext JS Library 0.20
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * @class Ext.air.SystemMenu
 * 提供一个跨平台的菜单控制类，你可以新建菜单，或者在菜单中插入新的子项 <br/><br/>
 * 此类亦可以将Ext.Action的实例绑定到AIR菜单项上。
 * @singleton
 */
Ext.air.SystemMenu = function(){
	var menu;
	// windows
	if(air.NativeWindow.supportsMenu && nativeWindow.systemChrome != air.NativeWindowSystemChrome.NONE) {
        menu = new air.NativeMenu();
        nativeWindow.menu = menu;
    }
    
	// mac
    if(air.NativeApplication.supportsMenu) {
		menu = air.NativeApplication.nativeApplication.menu;
    }

    function find(menu, text){
        for(var i = 0, len = menu.items.length; i < len; i++){
            if(menu.items[i]['label'] == text){
                return menu.items[i];
            }
        }
        return null;
    }

    return {
		/**
		 * 为菜单添加某一项的内容
		 * @param {String} text 指明在哪一个菜单上添加内容（如'File' or 'Edit'）。
		 * @param {Array} actions 对象组成的数组或菜单项的配置对象组成的数组 
		 * @param {Number} mindex 键盘快捷键的字符索引
		 * @return air.NativeMenu 原生菜单
		 */
		add: function(text, actions, mindex){

            var item = find(menu, text);
            if(!item){
                item = menu.addItem(new air.NativeMenuItem(text));
                item.mnemonicIndex = mindex || 0;

                item.submenu = new air.NativeMenu();
			}
			for (var i = 0, len = actions.length; i < len; i++) {
				item.submenu.addItem(actions[i] == '-' ? new air.NativeMenuItem("", true) : Ext.air.MenuItem(actions[i]));
			}
            return item.submenu;
        },
		
		/**
		 * 返回整个菜单对象
		 */
		get : function(){
			return menu;
		}
	};	
}();

// ability to bind native menu items to an Ext.Action
Ext.air.MenuItem = function(action){
	if(!action.isAction){
		action = new Ext.Action(action);
	}
	var cfg = action.initialConfig;
	var nativeItem = new air.NativeMenuItem(cfg.itemText || cfg.text);
	
	nativeItem.enabled = !cfg.disabled;

    if(!Ext.isEmpty(cfg.checked)){
        nativeItem.checked = cfg.checked;
    }

    var handler = cfg.handler;
	var scope = cfg.scope;
	
	nativeItem.addEventListener(air.Event.SELECT, function(){
		handler.call(scope || window, cfg);
	});
	
	action.addComponent({
		setDisabled : function(v){
			nativeItem.enabled = !v;
		},
		
		setText : function(v){
			nativeItem.label = v;
		},
		
		setVisible : function(v){
			// could not find way to hide in air so disable?
			nativeItem.enabled = !v;
		},
		
		setHandler : function(newHandler, newScope){
			handler = newHandler;
			scope = newScope;
		},
		// empty function
		on : function(){}
	});
	
	return nativeItem;
}
