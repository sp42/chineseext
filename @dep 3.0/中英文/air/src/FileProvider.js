/*
 * Ext JS Library 0.20
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * @class Ext.air.FileProvider
 * @extends Ext.state.Provider
 * Ext状态读取器实现的一种，基于AIR程序的特点而设计的，将状态的配置文件保存在程序存储区。
 *  * @constructor
 * @param {Object} config
 */
Ext.air.FileProvider = function(config){
    Ext.air.FileProvider.superclass.constructor.call(this);
	
	this.defaultState = {
		mainWindow : {
			width:780,
			height:580,
			x:10,
			y:10
		}
	};
	
    Ext.apply(this, config);
    this.state = this.readState();
	
	var provider = this;
	air.NativeApplication.nativeApplication.addEventListener('exiting', function(){
		provider.saveState();
	});
};

Ext.extend(Ext.air.FileProvider, Ext.state.Provider, {
	/**
	 * @cfg {String} file
	 * 在程序存储区（application storage directory）生成一个记录状态的文件。该项指定了那个文件的文件名
	 */
	file: 'extstate.data',
	
	/**
	 * @cfg {Object} defaultState
	 * 若未找到任何状态文件，就使用默认的配置
	 */
	// private
    readState : function(){
		var stateFile = air.File.applicationStorageDirectory.resolvePath(this.file);
		if(!stateFile.exists){
			return this.defaultState || {};
		}
		
		var stream = new air.FileStream();
		stream.open(stateFile, air.FileMode.READ);
		
		var stateData = stream.readObject();
		stream.close();
		
		return stateData || this.defaultState || {};
    },

    // private
    saveState : function(name, value){
        var stateFile = air.File.applicationStorageDirectory.resolvePath(this.file);
		var stream = new air.FileStream();
		stream.open(stateFile, air.FileMode.WRITE);
		stream.writeObject(this.state);
		stream.close();
    }
});