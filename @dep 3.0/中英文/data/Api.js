/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见http://ajaxjs.com 或者 http://jstang.cn
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
 * @class Ext.data.Api
 * @extends Object
 * 为了确保开发者的DataProxy API使用无误，我们定义了Ext.data.Api单例管理这些数据的API。
 * 除了创、见、变、灭的这四种CRUD操作进行了定义之外，还分别将这些操作映射到了RESTful的HTTP方法：GET、POST、PUT和DELETE。<br />
 * Ext.data.Api is a singleton designed to manage the data API including methods
 * for validating a developer's DataProxy API.  Defines variables for CRUD actions
 * create, read, update and destroy in addition to a mapping of RESTful HTTP methods
 * GET, POST, PUT and DELETE to CRUD actions.
 * @singleton
 */
Ext.data.Api = (function() {

    // private validActions.  
    // validActions就是反转Ext.data.Api.actions的哈希表hash，即value变为是key。
    // 本单例的一些方法（如getActions、getVerb）以<code>for (var verb in this.actions)</code>遍历这些actions，
    // 所以为了效率更快的话，访问过hash的会保存成为缓存，某些方法首先会检查hash命中匹配的值。
    // 需要注意的是，此hash运作过程中不断的读写、修改，因此我们不能够预定义这个hash。
    // validActions is essentially an inverted hash of Ext.data.Api.actions, where value becomes the key.
    // Some methods in this singleton (e.g.: getActions, getVerb) 
    // will loop through actions with the code <code>for (var verb in this.actions)</code>
    // For efficiency, some methods will first check this hash for a match.  
    // Those methods which do acces validActions will cache their result here.
    // We cannot pre-define this hash since the developer may over-ride the actions at runtime.
    var validActions = {};

    return {
        /**
         * 定义远程动作所关联的本地动作：
         * Defined actions corresponding to remote actions:
         * <pre><code>
actions: {
    create  : 'create',  // 表示位于服务端创建记录所执行的创建动作。Text representing the remote-action to create records on server.
    read    : 'read',    // 表示位于服务端读取、加载数据所执行的创建动作。Text representing the remote-action to read/load data from server.
    update  : 'update',  // 表示位于服务端更新记录所执行的创建动作。Text representing the remote-action to update records on server.
    destroy : 'destroy'  // 表示位于服务端消除记录所执行的创建动作。Text representing the remote-action to destroy records on server.
}
         * </code></pre>
         * @property actions
         * @type Object
         */
        actions : {
            create  : 'create',
            read    : 'read',
            update  : 'update',
            destroy : 'destroy'
        },

        /**
         * 将HTTP方法与关联的动作定义在一起的{CRUD action}:{HTTP method}的结对，将用于{@link Ext.data.DataProxy#restful RESTful proxies}的时候。
         * 默认为：
         * Defined {CRUD action}:{HTTP method} pairs to associate HTTP methods with the
         * corresponding actions for {@link Ext.data.DataProxy#restful RESTful proxies}.
         * Defaults to:
         * <pre><code>
restActions : {
    create  : 'POST',
    read    : 'GET',
    update  : 'PUT',
    destroy : 'DELETE'
},
         * </code></pre>
         */
        restActions : {
            create  : 'POST',
            read    : 'GET',
            update  : 'PUT',
            destroy : 'DELETE'
        },

        /**
         * 若传入的动作名称，在常量<code>{@link #actions}</code>中已经是有的就返回true.<br />
         * Returns true if supplied action-name is a valid API action defined in <code>{@link #actions}</code> constants
         * @param {String/String[]} action CRUD操作字符串，也可以是CRUD操作的数组。多次操作的时候传入数组的话会更快。List of available CRUD actions.  Pass in list when executing multiple times for efficiency.
         * @return {Boolean}
         */
        isAction : function(action) {
            return (Ext.data.Api.actions[action]) ? true : false;
        },

        /**
         * 返回实际的CRUD操作键值，根据传入的动作名称辨认出实际的"create", "read", "update"或"destroy"操作类型。
         * 一般来说该方法是内置使用的，不会直接地调用它。 Ext.data.Api.actions的key/value结对是相同无异的，但是也不一定的说。
         * 有需要的话，开发者可允许覆盖约定的名称。不过，框架内部依据KEY来调用方法的，因此就需要某种方式取得"create"、"read"、"update"和"destroy" 关键字才可以。
         * 如果发现KEYS已被缓存在validActions中，那么该就会直接从缓存中返回。<br />
         * Returns the actual CRUD action KEY "create", "read", "update" or "destroy" from the supplied action-name.  This method is used internally and shouldn't generally
         * need to be used directly.  The key/value pair of Ext.data.Api.actions will often be identical but this is not necessarily true. 
         * A developer can override this naming
         * convention if desired.  However, the framework internally calls methods based upon the KEY so a way of retreiving the the words "create", "read", "update" and "destroy" is
         * required.  This method will cache discovered KEYS into the private validActions hash.
         * @param {String} name The runtime name of the action.
         * @return {String||null} returns the action-key, or verb of the user-action or null if invalid.
         * @nodoc
         */
        getVerb : function(name) {
            if (validActions[name]) {
                return validActions[name];  // <-- found in cache.  return immediately.
            }
            for (var verb in this.actions) {
                if (this.actions[verb] === name) {
                    validActions[name] = verb;
                    break;
                }
            }
            return (validActions[name] !== undefined) ? validActions[name] : null;
        },

        /**
         * 如果传入的API是有效的，就返回true；这样的话，同时检查到预定义没有的动作，就会传入到数组中，最后返回（错误的动作）。<br />
         * Returns true if the supplied API is valid; that is, check that all keys match defined actions
         * otherwise returns an array of mistakes.
         * @return {String[]||true}
         */
        isValid : function(api){
            var invalid = [];
            var crud = this.actions; // <-- cache a copy of the actions.
            for (var action in api) {
                if (!(action in crud)) {
                    invalid.push(action);
                }
            }
            return (!invalid.length) ? true : invalid;
        },

        /**
         * 在传入的proxy在一个原来唯一的proxy地址的时候，并没有其他API动作染指的时候，返回true。
         * 当决定是否插入“xaction”的HTTP参数到某个Ajax请求的时候，这个问题就显得重要了。 
         * 一般来说该方法是内置使用的，不会直接地调用它。<br />
         * Returns true if the supplied verb upon the supplied proxy points to a unique url 
         * in that none of the other api-actions
         * point to the same url.  The question is important for deciding whether to insert the "xaction" HTTP parameter within an
         * Ajax request.  This method is used internally and shouldn't generally need to be called directly.
         * @param {Ext.data.DataProxy} proxy
         * @param {String} verb
         * @return {Boolean}
         */
        hasUniqueUrl : function(proxy, verb) {
            var url = (proxy.api[verb]) ? proxy.api[verb].url : null;
            var unique = true;
            for (var action in proxy.api) {
                if ((unique = (action === verb) ? true : (proxy.api[action].url != url) ? true : false) === false) {
                    break;
                }
            }
            return unique;
        },

        /**
         * 该方法由<tt>{@link Ext.data.DataProxy DataProxy}</tt>内部使用，一般不宜直接使用。
         * 内部定义时，每个DataProxy API的动作可以是String或者是Object。
         * 当定义为Object的时候，就可以为其中的CRUD操作精确指定是哪一种HTTP方法（GET、POST…）。
         * 该方法会初始化传入的API，将每一项的操作转换为Object的形式。如果你传入的API没有设定HTTP方法的话，那么“method”所指定的配置项就是默认的方法。
         * 如果连method的配置项都没有指定的话，那么就是POST了。<br />
         * This method is used internally by <tt>{@link Ext.data.DataProxy DataProxy}</tt> and should not generally need to be used directly.
         * Each action of a DataProxy api can be initially defined as either a String or an Object.  
         * When specified as an object,
         * one can explicitly define the HTTP method (GET|POST) to use for each CRUD action.  
         * This method will prepare the supplied API, setting
         * each action to the Object form.  If your API-actions do not explicitly define the HTTP method, the "method" configuration-parameter will
         * be used.  If the method configuration parameter is not specified, POST will be used.
         <pre><code>
new Ext.data.HttpProxy({
    method: "POST",     // 没有指定时默认的HTTP方法。<-- default HTTP method when not specified.
    api: {
        create: 'create.php',
        load: 'read.php',
        save: 'save.php',
        destroy: 'destroy.php'
    }
});

// 可选地，也可以对象形式定义。Alternatively, one can use the object-form to specify the API
new Ext.data.HttpProxy({
    api: {
        load: {url: 'read.php', method: 'GET'},
        create: 'create.php',
        destroy: 'destroy.php',
        save: 'update.php'
    }
});
        </code></pre>
         *
         * @param {Ext.data.DataProxy} proxy
         */
        prepare : function(proxy) {
            if (!proxy.api) {
                proxy.api = {}; // <-- No api?  create a blank one.
            }
            for (var verb in this.actions) {
                var action = this.actions[verb];
                proxy.api[action] = proxy.api[action] || proxy.url || proxy.directFn;
                if (typeof(proxy.api[action]) == 'string') {
                    proxy.api[action] = {
                        url: proxy.api[action]
                    };
                }
            }
        },

        /**
         *　初始化Proxy，让其成为RESTful的。可根据{@link #restActions}的值定义每个API动作的HTTP方法（GET, POST, PUT, DELETE的任意一种）。<br />
         * Prepares a supplied Proxy to be RESTful.  Sets the HTTP method for each api-action to be one of
         * GET, POST, PUT, DELETE according to the defined {@link #restActions}.
         * @param {Ext.data.DataProxy} proxy
         */
        restify : function(proxy) {
            proxy.restful = true;
            for (var verb in this.restActions) {
                proxy.api[this.actions[verb]].method = this.restActions[verb];
            }
        }
    };
})();

/**
 * @class Ext.data.Api.Error
 * @extends Ext.Error
 * 
 * Error class for Ext.data.Api errors
 */
Ext.data.Api.Error = Ext.extend(Ext.Error, {
    constructor : function(message, arg) {
        this.arg = arg;
        Ext.Error.call(this, message);
    },
    name: 'Ext.data.Api'
});
Ext.apply(Ext.data.Api.Error.prototype, {
    lang: {
        'action-url-undefined': 'No fallback url defined for this action.  When defining a DataProxy api, please be sure to define an url for each CRUD action in Ext.data.Api.actions or define a default url in addition to your api-configuration.',
        'invalid': 'received an invalid API-configuration.  Please ensure your proxy API-configuration contains only the actions defined in Ext.data.Api.actions',
        'invalid-url': 'Invalid url.  Please review your proxy configuration.',
        'execute': 'Attempted to execute an unknown action.  Valid API actions are defined in Ext.data.Api.actions"'
    }
});
