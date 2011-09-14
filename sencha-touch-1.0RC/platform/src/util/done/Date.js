/**
 * @class Ext.util.Date
 * @singleton
 */

Ext.util.Date = {
	/**
	 * 返回date对象创建时间与现在时间的时间差，单位为毫秒。
	 * Returns the number of milliseconds between this date and date
	 * （译注：）例：var date = new Date();
	 *						var x=0;
	 *						while(x<2){
	 *							alert('x');
	 *							x++;
	 *						}
	 *
	 *		var theTime = date.getElapsed();
	 *		alert(theTime);       //将显示间隔的时间，单位是毫秒
	 *
	 * @param {Date} date （可选的）默认时间是now。(optional) Defaults to now
	 * @return {Number} 间隔毫秒数。The diff in milliseconds
	 * @member Date getElapsed
	 */
    getElapsed: function(dateA, dateB) {
        return Math.abs(dateA - (dateB || new Date));
    }
};