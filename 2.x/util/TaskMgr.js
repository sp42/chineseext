/**
 * @class Ext.util.TaskRunner
 * 提供以多线程的方式执行一个或多个任务的能力。通常情况下，你可以使用 {@link Ext.TaskMgr} 来代替，但是如果需要你可以创建一个独立的 TaskRunner 实例。
 * 任意个独立的任务都可以在任何时候开始，并彼此独立地运行。使用示例：
 * <pre><code>
// 开始一个简单的每秒更新 DIV 的定时任务
var task = {
    run: function(){
        Ext.fly('clock').update(new Date().format('g:i:s A'));
    },
    interval: 1000 //1 second
}
var runner = new Ext.util.TaskRunner();
runner.start(task);
</code></pre>
 * @constructor
 * @param {Number} interval （可选项） The minimum precision in milliseconds supported by this TaskRunner instance
 * @param {Number} interval （可选项） 以毫秒表示的该 TaskRunner 实例所支持的最低精度
 * （默认为 10）
 */
Ext.util.TaskRunner = function(interval){
    interval = interval || 10;
    var tasks = [], removeQueue = [];
    var id = 0;
    var running = false;

    // private
    var stopThread = function(){
        running = false;
        clearInterval(id);
        id = 0;
    };

    // private
    var startThread = function(){
        if(!running){
            running = true;
            id = setInterval(runTasks, interval);
        }
    };

    // private
    var removeTask = function(t){
        removeQueue.push(t);
        if(t.onStop){
            t.onStop.apply(t.scope || t);
        }
    };

    // private
    var runTasks = function(){
        if(removeQueue.length > 0){
            for(var i = 0, len = removeQueue.length; i < len; i++){
                tasks.remove(removeQueue[i]);
            }
            removeQueue = [];
            if(tasks.length < 1){
                stopThread();
                return;
            }
        }
        var now = new Date().getTime();
        for(var i = 0, len = tasks.length; i < len; ++i){
            var t = tasks[i];
            var itime = now - t.taskRunTime;
            if(t.interval <= itime){
                var rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
                t.taskRunTime = now;
                if(rt === false || t.taskRunCount === t.repeat){
                    removeTask(t);
                    return;
                }
            }
            if(t.duration && t.duration <= (now - t.taskStartTime)){
                removeTask(t);
            }
        }
    };

    /**
     * @member Ext.util.TaskRunner
     * @method start
     * 开始一个新任务。
     * @param {Object} task 一个任务配置项，支持的属性如下：<ul>
     * <li><code>run</code> : Function<div class="sub-desc">任务每次运行时执行的函数。
     * 该函数将在每次间隔后被调用并传入 <code>args</code> 参数，如果该项被指定了的话。
     * 如果需要特定的作用域，请保证设置了 <code>scope</scope> 参数。</div></li>
     * <li><code>interval</code> : Number<div class="sub-desc">以毫秒为单位表示的任务执行的间隔。</div></li>
     * <li><code>args</code> : Array<div class="sub-desc">（可选项） 一个由传递给 <code>run</code> 所指定的函数的参数组成的数组。</div></li>
     * <li><code>scope</code> : Object<div class="sub-desc">（可选项） <code>run</code> 指定的函数的作用域。</div></li>
     * <li><code>duration</code> : Number<div class="sub-desc">（可选项） 任务在自动停止前的执行时长（默认为无限制）。</div></li>
     * <li><code>repeat</code> : Number<div class="sub-desc">（可选项） 任务在自动停止前的执行次数（默认为无数次）。</div></li>
     * </ul>
     * @return {Object} 该任务
     */
    this.start = function(task){
        tasks.push(task);
        task.taskStartTime = new Date().getTime();
        task.taskRunTime = 0;
        task.taskRunCount = 0;
        startThread();
        return task;
    };

    /**
     * @member Ext.util.TaskRunner
     * @method stop
     * 停止一个运行中的任务。
     * @param {Object} task 要停止的任务
     * @return {Object} 该任务
     */
    this.stop = function(task){
        removeTask(task);
        return task;
    };

    /**
     * @member Ext.util.TaskRunner
     * @method stopAll
     * 停止所有当前运行的任务。
     */
    this.stopAll = function(){
        stopThread();
        for(var i = 0, len = tasks.length; i < len; i++){
            if(tasks[i].onStop){
                tasks[i].onStop();
            }
        }
        tasks = [];
        removeQueue = [];
    };
};

/**
 * @class Ext.TaskMgr
 * 一个静态的 {@link Ext.util.TaskRunner} 实例，可以用来开始和停止任意任务。可查看 {@link Ext.util.TaskRunner} 中支持的方法和任务配置项属性。
 * <pre><code>
// 开始一个简单的每秒更新 DIV 的定时任务
var task = {
    run: function(){
        Ext.fly('clock').update(new Date().format('g:i:s A'));
    },
    interval: 1000 //1 秒
}
Ext.TaskMgr.start(task);
</code></pre>
 * @singleton
 */
Ext.TaskMgr = new Ext.util.TaskRunner();