/*
 * @version Sencha 1.0RC-1
 * @ignore
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */

/**
 * @author Ed Spencer
 * @class Ext.Application
 * @extends Ext.util.Observable
 * 
 *<p>
 * 表示整个Sencha的应用程序。对于大多数程序而言，它至少包括有应用程序的名称和一个启动函数：
 * Represents a Sencha Application. Most Applications consist of at least the application's name and a launch
 * function:</p>
 * 
<pre><code>
new Ext.Application({
    name: 'MyApp',

    launch: function() {
        this.viewport = new Ext.Panel({
            fullscreen: true,
            
            id    : 'mainPanel',
            layout: 'card',
            items : [
                {
                    html: '欢迎来到我们的程序！Welcome to My App!'
                }
            ]
        });
    }
});
</code></pre>
 * 
 * <p>
     实例化新的程序的时候，会自动依据配置项{@link #name}定义一个全局变量，设置程序的命名空间，包括有视图的命名空间、store的命名空间和控制器的命名空间。Instantiating
     a new application automatically creates a global variable using the configured {@link #name} 
 * property and sets up namespaces for views, stores, models and controllers within the app:</p>
 * 
<pre>
<code>
// 当创建程序就是定义下面的代码 this code is run internally automatically when creating the app
{@link Ext.ns}('MyApp', 'MyApp.views', 'MyApp.stores', 'MyApp.models', 'MyApp.controllers');
</code></pre>
 * 
 * <p>
     启动函数其职责一般是创建应用程序的Viewport视图和任何程序需要启动的步骤。启动函数应该只会运行一次。The launch function usually creates the Application's Viewport and runs any actions the Application needs to 
 * perform when it boots up. The launch function is only expected to be run once.</p>
 * 
 * <p><u>路由与历史的支持 Routes and history support</u></p>
 * 
 * <p>
     Ext应用程序提供紧密的关联与历史的支持，允许你的用户在应用程序中，既可以使用“后退”按钮，也可以“刷新”页面，哪怕关闭回来后相同的屏幕。紧密的历史回溯依靠路由引擎（Routing
     Engine）的支持，将url映射到controller/action。这里是一个定义路由的例子：Sencha Applications provide in-app deep linking and history support, allowing your users both to use the back
 * button inside your application and to refresh the page and come back to the same screen even after navigating.
 * In-app history support relies on the Routing engine, which maps urls to controller/action pairs. Here's an example
 * route definition:</p>
 * 
<pre><code>
//Note the # in the url examples below
Ext.Router.draw(function(map) {
    //maps the url http://mydomain.com/#dashboard to the home controller's index action
    map.connect('dashboard', {controller: 'home', action: 'index'});

    //fallback route - would match routes like http://mydomain.com/#users/list to the 'users' controller's
    //'list' action
    map.connect(':controller/:action');
});
</code></pre>
 * 
 * <p>
     如果你透过Sencha Command工具生成脚本来导出Sencha程序，那么将会看到这个文件已经位于程序目录的app/routes.js。历史驱动可以指定{@link
     #defaultUrl} 配置项，在当前没有设置url的情况下派遣到默认的url。If you generated your Sencha app using the Sencha Command application generator script, you'll see this file is
 * already present in your application's app/routes.js file. History-driven apps can specify the {@link #defaultUrl}
 * configuration option, which will dispatch to that url if no url is currently set:</p>
 * 
<pre><code>
new Ext.Application({
    name: 'MyApp',
    defaultUrl: 'dashboard'
});
</code></pre>
 * 
 * <p><u>Application profiles</u></p>
 * 
 * <p>
     Applications支持为程序提供多个profiles并且可以依据此自配置。这里我们设置了Application的三个profile，一个是手机上的，另外两个是table
     PC的landscape和portrait方向。Applications support multiple app profiles and reconfigure itself accordingly. Here we set up an Application
 * with 3 profiles - one if the device is a phone, one for tablets in landscape orientation and one for tablets in
 * portrait orientation:</p>
 * 
<pre><code>
new Ext.Application({
    name: 'MyApp',

    profiles: {
        phone: function() {
            return Ext.is.Phone;
        },
        tabletPortrait: function() {
            return Ext.is.Tablet && Ext.orientation == 'portrait';
        },
        tabletLandscape: function() {
            return Ext.is.Tablet && Ext.orientation == 'landscape';
        }
    }
});
</code></pre>
 * 
 * <p>
     当Application 检查其prfile的列表时候，第一个返回true的那个函数表示就是当前的函数。当profile发生变化时，Application会自动检测哪一个profile使用（比如，在tablet方向从portrait变为landscape模式的时候），并触发{@link
     #profilechange}事件。同时也会通知页面上所有的{@link Ext.Component Components} 已经改变了当前的profile，进而调用组件的{@link
     Ext.Component#setProfile setProfile}函数。setProfile函数一个空函数，你可以为你的组件在交互不同设备写入新的实现。When
     the Application checks its list of profiles, the first function that returns true becomes the current profile.
 * The Application will normally automatically detect when a profile change has occurred (e.g. if a tablet is rotated 
 * from portrait to landscape mode) and fire the {@link #profilechange} event. It will also by default inform all 
 * {@link Ext.Component Components} on the page that the current profile has changed by calling their 
 * {@link Ext.Component#setProfile setProfile} functions. The setProfile function is left as an empty function for you
 * to implement if your component needs to react to different device/application profiles.</p>
 * 
 * <p>
     可用通过{@link #getProfile}获取当前的profile。如果Application没有成功检测profile发生改变可以手动执行{@link #determineProfile}
     。The current profile can be found using {@link #getProfile}. If the Application does not correctly detect device 
 * profile changes, calling the {@link #determineProfile} function will force it to re-check.</p
 */
Ext.Application = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {String} name 
     * Application的名称。起名最好与这个程序所使用的单个全局变量的那个名称一致，最好不要有空格。
     * The name of the Application. This should be the same as the single global variable that the
     * application uses, and should not contain spaces
     */
    
    /**
     * @cfg {Object} scope {@link #launch}函数的作用域。默认为Application实例。
     * The scope to execute the {@link #launch} function in. Defaults to the Application
     * instance.
     */
    scope: undefined,
    
    /**
     * @cfg {Boolean} useHistory True表示为自动初始化Ext.History的支持（默认为true）。True to automatically set up Ext.History support (defaults to true)
     */
    useHistory: true,
    
    /**
     * @cfg {String} defaultUrl 当应用程序第一次加载，转向的url。默认是undefined。 When the app is first loaded, this url will be redirected to. Defaults to undefined
     */
    
    /**
     * @cfg {Boolean} autoUpdateComponentProfiles 
     * 若为true便在每个组件上自动调用{@link Ext.Component#setProfile}，无论application/device的profile有否变动（默认为true）。
     * If true, automatically calls {@link Ext.Component#setProfile} on
     * all components whenever a application/device profile change is detected (defaults to true)
     */
    autoUpdateComponentProfiles: true,
    
    /**
     * @cfg {Boolean} setProfilesOnLaunch
     * 若为true，则在调用启动函数便检测当前程序的profile。默认为true。
     * If true, determines the current application profile on launch and calls 
     * {@link #updateComponentProfiles}. Defaults to true
     */
    setProfilesOnLaunch: true,
    
    /**
     * @cfg {Object} profiles 
     * 程序可支持的profile的集合。请参阅介绍的列子。
     * A set of named profile specifications that this application supports. See the intro
     * docs for an example
     */

    constructor: function(config) {
        this.addEvents(
            /**
             * @event launch
             * 当程序启动时触发该函数。
             * Fires when the application is launched
             * @param {Ext.Application} app Application实例。The Application instance
             */
            'launch',
            
            /**
             * @event beforeprofilechange
             * 当程序的profile检测到改变的时候之后并且在通知应用程序的组件之前触发该事件。任何事件侦听器返回false的是取消程序自动更新（参阅{@link #autoUpdateComponentProfiles}）。
             * Fires when a change in Application profile has been detected, but before any action is taken to 
             * update the application's components about the change. Return false from any listener to cancel the
             * automatic updating of application components (see {@link #autoUpdateComponentProfiles})
             * @param {String} profile 新profile的名称。The name of the new profile
             * @param {String} oldProfile 旧profile的名称（可能是undefined）。The name of the old profile (may be undefined)
             */
            'beforeprofilechange',
            
            /**
             * @event profilechange
             * 当程序的profile检测到改变的时候并且已通知应用程序的组件之后触发该事件。如果需要可以在这里执行事件侦听器。
             * Fires when a change in Applicatino profile has been detected and the application's components have
             * already been informed. Listeners can perform additional processing here if required
             * @param {String} profile 新profile的名称。The name of the new profile
             * @param {String} oldProfile 旧profile的名称（可能是undefined）。The name of the old profile (may be undefined)
             */
            'profilechange'
        );
        
        Ext.Application.superclass.constructor.call(this, config);
        
        this.bindReady();
        
        var name = this.name;
        
        if (name) {
            window[name] = this;

            Ext.ns(
                name,
                name + ".views",
                name + ".stores",
                name + ".models",
                name + ".controllers"
            );
        }
        
        if (Ext.addMetaTags) {
            Ext.addMetaTags(config);
        }
    },
    
    /**
     * @private
     * 我们不再构造器中写而是在这里写为了可以我们可以取消测试环境。
     * We bind this outside the constructor so that we can cancel it in the test environment
     */
    bindReady : function() {
        Ext.onReady(this.onReady, this);
    },
    
    /**
     *当页面完成加载后自动调用该函数。这是一个空的函数表示可以由每一个程序自己来制定情况。
     *  Called automatically when the page has completely loaded. This is an empty function that should be
     * overridden by each application that needs to take action on page load
     * @property launch
     * @type Function
     * @param {String} profile 检测的{@link #profiles application profile}。The detected {@link #profiles application profile}
     * @return {Boolean} 默认下，在运行完毕了启动函数后，Application会立刻派遣已配置好的启动控制器和动作。返回false阻止该行为发生。By default, the Application will dispatch to the configured startup controller and
     * action immediately after running the launch function. Return false to prevent this behavior.
     */
    launch: Ext.emptyFn,
    
    /**
     * @cfg {Boolean/String} useLoadMask True表示当DOM可用时自动移除程序的。true的话也表示需要一个id为"loading-mask"的div元素。如果需要自定义loading mask元素的话，可以传入一个DOM元素的id。默认为false。loading mask。True to automatically remove an application loading mask when the 
     * DOM is ready. If set to true, this expects a div called "loading-mask" to be present in the body.
     * Pass the id of some other DOM node if using a custom loading mask element. Defaults to false.
     */
    useLoadMask: false,
    
    /**
     * @cfg {Number} loadMaskFadeDuration 
     * load mask减退的毫秒数。默认为1000。
     * The number of milliseconds the load mask takes to fade out. Defaults to 1000
     */
    loadMaskFadeDuration: 1000,
    
    /**
     * @cfg {Number} loadMaskRemoveDuration 
     * 当开始了{@link #loadMaskFadeDuration fadeout}之后，进行多久就移除mask的毫秒数。默认为1050.
     * The number of milliseconds until the load mask is removed after starting the 
     * {@link #loadMaskFadeDuration fadeout}. Defaults to 1050.
     */
    loadMaskRemoveDuration: 1050,
    
    /**
     * 派遣一个给定的 controller/action 组合，带有可选的参数。
     * Dispatches to a given controller/action combo with optional arguments. 
     * @param {Object} options 对象。包含指向要派遣控制器与动作的字符串，还可以有可选的参数数组。Object containing strings referencing the controller and action to dispatch
     * to, plus optional args array
     * @return {Boolean} True表示为找到控制器和动作，false则没有。True if the controller and action were found and dispatched to, false otherwise
     */
    dispatch: function(options) {
        return Ext.dispatch(options);
    },
    
    /**
     * @private
     * 初始化loading阴影，如果通过onReady设置了{@link #useLoadMask}会自动调用。
     * Initializes the loading mask, called automatically by onReady if {@link #useLoadMask} is configured
     */
    initLoadMask: function() {
        var useLoadMask = this.useLoadMask,
            defaultId   = 'loading-mask',
            loadMaskId  = typeof useLoadMask == 'string' ? useLoadMask : defaultId;
        
        if (useLoadMask) {
            if (loadMaskId == defaultId) {
                Ext.getBody().createChild({id: defaultId});
            }
            
            var loadingMask  = Ext.get('loading-mask'),  
                fadeDuration = this.loadMaskFadeDuration,
                hideDuration = this.loadMaskRemoveDuration;

            Ext.defer(function() {
                loadingMask.addCls('fadeout');

                Ext.defer(function() {
                    loadingMask.remove();
                }, hideDuration);
            }, fadeDuration);
        }
    },
    
    /**
     * @private
     * 当DOM可用是调用的函数。调用程序指定的启动函数和派遣第一个 控制器/动作 的组合。
     * Called when the DOM is ready. Calls the application-specific launch function and dispatches to the
     * first controller/action combo
     */
    onReady: function() {
        var History    = Ext.History,
            useHistory = History && this.useHistory,
            profile    = this.determineProfile(true);
        
        if (this.useLoadMask) {
            this.initLoadMask();
        }
        
        Ext.EventManager.onOrientationChange(this.determineProfile, this);
        
        if (useHistory) {
            this.historyForm = Ext.getBody().createChild({
                id    : 'history-form',
                cls   : 'x-hide-display',
                style : 'display: none;',
                tag   : 'form',
                action: '#',
                children: [
                    {
                        tag: 'div',
                        children: [
                            {
                                tag : 'input',
                                id  : History.fieldId,
                                type: 'hidden'
                            },
                            {
                                tag: 'iframe',
                                id : History.iframeId
                            }
                        ]
                    }
                ]
            });
            
            History.init();
            History.on('change', this.onHistoryChange, this);
            
            var token = History.getToken();
            
            if (this.launch.call(this.scope || this, profile) !== false) {
                Ext.redirect(token || this.defaultUrl || {controller: 'application', action: 'index'});
            }
        } else {
            this.launch.call(this.scope || this, profile);
        }
        
        this.launched = true;
        
        this.fireEvent('launch', this);
        
        if (this.setProfilesOnLaunch) {
            this.updateComponentProfiles(profile);
        }
        
        return this;
    },
    
    /**
     * 调用每个配置好的{@link #profile}函数，标记第一个返回的为当前应用程序的profile。如果profile有变化则触发“beforeprofilechange”和“profilechange”事件。
     * Calls each configured {@link #profile} function, marking the first one that returns true as the current
     * application profile. Fires the 'beforeprofilechange' and 'profilechange' events if the profile has changed
     * @param {Boolean} silent true表示为不触发profilechange事件。
     * If true, the events profilechange event is not fired
     */
    determineProfile: function(silent) {
        var currentProfile = this.currentProfile,
            profiles       = this.profiles,
            name;
        
        for (name in profiles) {
            if (profiles[name]() === true) {
                if (name != currentProfile && this.fireEvent('beforeprofilechange', name, currentProfile) !== false) {
                    if (this.autoUpdateComponentProfiles) {
                        this.updateComponentProfiles(name);
                    }
                    
                    if (silent !== true) {
                        this.fireEvent('profilechange', name, currentProfile);
                    }
                }
                
                this.currentProfile = name;
                break;
            }
        }
        
        return this.currentProfile;
    },
    
    /**
     * @private
     * 为每个组件设置页面上的profile。
     * Sets the profile on every component on the page. Will probably refactor this to something
     * less hacky.
     * @param {String} profile 新的profile名称。The new profile name
     */
    updateComponentProfiles: function(profile) {
        var components = Ext.ComponentMgr.all.items,
            length     = components.length,
            i;
        
        for (i = 0; i < length; i++) {
            if (components[i].setProfile) {
                components[i].setProfile(profile);
            }
        }
    },
    
    /**
     * 获取当前检测到的profile名称。
     * Gets the name of the currently-detected application profile
     * @return {String} Profile名称。The profile name
     */
    getProfile: function() {
        return this.currentProfile;
    },
    
    /**
     * @private
     */
    onHistoryChange: function(token) {
        return Ext.redirect(token);
    }
});