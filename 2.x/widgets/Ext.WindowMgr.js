/**
 * @class Ext.WindowMgr
 * @extends Ext.WindowGroup
 * 缺省的全局window组，自动创建。
 * 要单独处理多个z-order的window组，按情况另外建立{@link Ext.WindowGroup}的实例
 * @singleton
 */
Ext.WindowMgr = new Ext.WindowGroup();