/*
 * @version Sencha 1.0RC-1
 * @ignore
 * @todo
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */

/**
 * @class Ext.util.DelayedTask
 * <p> 
 * DelayedTask类提供快捷的方法执行setTimeout，新的超时时限会取消旧的超时时限.
 * 例如验证表单的时候，键盘按下(keypress)那一瞬，就可用上该类（不会立即验证表单，稍作延时）。
 * keypress事件会稍作停顿之后（某个时间）才继续执行。
 * The DelayedTask class provides a convenient way to "buffer" the execution of a method,
 * performing setTimeout where a new timeout cancels the old timeout. When called, the
 * task will wait the specified time period before executing. If durng that time period,
 * the task is called again, the original call will be cancelled. This continues so that
 * the function is only called a single time for each iteration.</p>
 * <p>This method is especially useful for things like detecting whether a user has finished
 * typing in a text field. An example would be performing validation on a keypress. You can
 * use this class to buffer the keypress events for a certain number of milliseconds, and
 * perform only if they stop for that amount of time.  Usage:</p><pre><code>
var task = new Ext.util.DelayedTask(function(){
    alert(Ext.getDom('myInputField').value.length);
});
// Wait 500ms before calling our function. If the user presses another key
// during that 500ms, it will be cancelled and we'll wait another 500ms.
Ext.get('myInputField').on('keypress', function(){
    task.{@link #delay}(500);
});
 * </code></pre>
 * <p>Note that we are using a DelayedTask here to illustrate a point. The configuration
 * option <tt>buffer</tt> for {@link Ext.util.Observable#addListener addListener/on} will
 * also setup a delayed task for you to buffer events.</p>
 * @constructor The parameters to this constructor serve as defaults and are not required.
 * @param {Function} fn  （可选的）重写传入到构建器的函数。(optional) The default function to call.
 * @param {Object} scope （可选的）重写传入到构建器的作用域。请注意如果不指定作用域，那么<code>this</code>就是浏览器的windows对象。The default scope (The <code><b>this</b></code> reference) in which the
 * function is called. If not specified, <code>this</code> will refer to the browser window.
 * @param {Array} args 	 （可选的）重写传入到构建器的参数。(optional) The default Array of arguments.
 */
Ext.util.DelayedTask = function(fn, scope, args) {
    var me = this,
        id,
        call = function() {
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        };

    /**
     * 取消所有待定的超时（any pending timeout），并重新排列（queues）。
     * Cancels any pending timeout and queues a new one
     * @param {Number} delay  延迟毫秒数。The milliseconds to delay
     * @param {Function} newFn  （可选的）重写传入到构建器的函数。(optional) Overrides function passed to constructor
     * @param {Object} newScope （可选的）重写传入到构建器的作用域。请注意如果不指定作用域，那么<code>this</code>就是浏览器的windows对象。(optional) Overrides scope passed to constructor. Remember that if no scope
     * is specified, <code>this</code> will refer to the browser window.
     * @param {Array} newArgs   （可选的）重写传入到构建器的参数。(optional) Overrides args passed to constructor
     */
    this.delay = function(delay, newFn, newScope, newArgs) {
        me.cancel();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        id = setInterval(call, delay);
    };

    /**
     *  取消最后的排列超时。
     * Cancel the last queued timeout
     */
    this.cancel = function(){
        if (id) {
            clearInterval(id);
            id = null;
        }
    };
};