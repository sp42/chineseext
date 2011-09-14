/*
 * Ext JS Library 0.20
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * @class Ext.air.Sound
 * 
 * @singleton
 */
Ext.air.Sound = {
	/**
	 * 播放音频。
	 * @param {String} file 要播放音效的位置。 这个文件应该在程序的安装目录下。
	 * @param {Number} startAt (optional) 指定音频开始播放的位置（可选的）
	 */
	play : function(file, startAt){
		var soundFile = air.File.applicationDirectory.resolvePath(file);
		var sound = new air.Sound();
		sound.load(new air.URLRequest(soundFile.url));
		sound.play(startAt);
	}
};
