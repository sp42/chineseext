/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=90 Ext中文站翻译小组
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
 * @class Ext.util.DelayedTask
 * 提供快捷的方法执行setTimeout，新的超时时限会取消旧的超时时限.
 * 例如验证表单的时候，键盘按下(keypress)那一瞬，就可用上该类（不会立即验证表单，稍作延时）。
 * keypress事件会稍作停顿之后（某个时间）才继续执行。
 * Provides a convenient method of performing setTimeout where a new
 * timeout cancels the old timeout. An example would be performing validation on a keypress.
 * You can use this class to buffer
 * the keypress events for a certain number of milliseconds, and perform only if they stop
 * for that amount of time.
 * @constructor 该构建器无须参数，用默认的即可。The parameters to this constructor serve as defaults and are not required.
 * @param {Function} fn （可选的） 默认超时的函数(optional) The default function to timeout
 * @param {Object} scope （可选的） 默认超时的作用域(optional) The default scope of that timeout
 * @param {Array} args （可选的） 默认参数数组(optional) The default Array of arguments
 */
Ext.util.DelayedTask = function(fn, scope, args){
    var id = null, d, t;

    var call = function(){
        var now = new Date().getTime();
        if(now - t >= d){
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        }
    };
    /**
     * 取消所有待定的超时（any pending timeout），并重新排列（queues）。
     * Cancels any pending timeout and queues a new one
     * @param {Number} delay 延迟毫秒数The milliseconds to delay
     * @param {Function} newFn （可选的） 重写传入到构建器的函数(optional) Overrides function passed to constructor
     * @param {Object} newScope （可选的） 重写传入到构建器的作用域(optional) Overrides scope passed to constructor
     * @param {Array} newArgs （可选的） 重写传入到构建器的参数(optional) Overrides args passed to constructor
     */
    this.delay = function(delay, newFn, newScope, newArgs){
        if(id && delay != d){
            this.cancel();
        }
        d = delay;
        t = new Date().getTime();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        if(!id){
            id = setInterval(call, d);
        }
    };

    /**
     * 取消最后的排列超时。
     * Cancel the last queued timeout
     */
    this.cancel = function(){
        if(id){
            clearInterval(id);
            id = null;
        }
    };
};