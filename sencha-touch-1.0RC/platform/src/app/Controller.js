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
 * @class Ext.Controller
 * @extends Ext.util.Observable
 * 
 * @constructor
 */
Ext.Controller = Ext.extend(Ext.util.Observable, {
    constructor: function(config) {
        this.addEvents(
            /**
             * @event instance-created
             * 当控制器成功创建了模型实例的时候触发该事件。
             * Fired when a new model instance has been successfully created by this controller
             * @param {Ext.data.Model} instance 新创建的模型。The newly-created model instance
             */
            'instance-created',
            
            /**
             * @event instance-creation-failed
             * 当控制器创建失败模型实例的时候触发该事件。
             * Fired when an attempt at saving a new instance failed
             * @param {Ext.data.Model} instance 不能保存的实例。The instance that could not be saved
             * @param {Object} errors 导致失败的错误原因（如果有任何）。The set of errors (if any) that caused the failure
             */
            'instance-creation-failed',
            
            /**
             * @event instance-updated
             * 当模型实例被这个控制器更新后触发该事件。
             * Fired when an existing model instance has been successfully updated by this controller
             * @param {Ext.data.Model} instance 更新的实例。The instance that was updated
             */
            'instance-updated',
            
            /**
             * @event instance-update-failed
             * 当模型实例不能被这个控制器更新之后就触发该事件。
             * Fired when an update to existing model instance could not be successfully completed
             * @param {Ext.data.Model} instance 不能更新的实例。The instance that could not be updated
             * @param {Object} errors 导致失败的错误原因（如果有任何）。The set of errors (if any) that caused the failure
             */
            'instance-update-failed',
            
            /**
             * @event instance-destroyed
             * 当控制器销毁一个现有的模型实例的时候触发该事件。
             * Fired when an existing instance has been successfully destroyed by this controller
             * @param {Ext.data.Model} instance 被销毁的实例。The instance that was destroyed
             */
            'instance-destroyed',
            
            /**
             * @event instance-destruction-failed
             * 当控制器不能销毁一个现有的模型实例的时候触发该事件。
             * Fired when an existing instance could not be destroyed
             * @param {Ext.data.Model} instance 未被销毁的实例。The instance that could not be destroyed
             * @param {Object} errors 导致失败的错误原因（如果有任何）。The set of errors (if any) that caused the failure
             */
            'instance-destruction-failed'
        );
        
        Ext.Controller.superclass.constructor.call(this, config);
        
        Ext.apply(this, config || {});
        
        if (typeof this.model == 'string') {
            this.model = Ext.ModelMgr.getModel(this.model);
        }
    },
    
    index: function() {
        this.render('index', {
            listeners: {
                scope  : this,
                edit   : this.edit,
                build  : this.build,
                create : this.onCreateInstance,
                destroy: this.onDestroyInstance
            }
        });
    },
    
    /**
     * 根据指定的模型实例渲染编辑形式。
     * Renders the edit form for a given model instance
     * @param {Ext.data.Model} instance 编辑的实例。The instance to edit
     */
    edit: function(instance) {
        var view = this.render('edit', {
            listeners: this.getEditListeners()
        });
        
        view.loadModel(instance);
    },
    
    /**
     * 绑定到索引的“build”事件。默认下只是渲染登记好的“build”试图。
     * Callback automatically tied to the index view's 'build' event. By default this just renders the registered 'build' view
     */
    build: function() {
        this.render('build', {
            listeners: this.getBuildListeners()
        });
    },
    
    /**
     * 通过其配置好的Proxy保存一个影子模型实例。如成功触发'instance-created'时，如果不成功触发'instance-creation-failed'事件。
     * Saves a phantom Model instance via its configured Proxy. Fires the 'instance-created' event if successful,
     * the 'instance-creation-failed' event if not.
     * @param {Object} data 从哪个实例得到的数据要创建？ The data to create the instance from
     * @param {Object} options 可选的，包含成功和失败外加可选的作用域回调的对象。 Optional options object containing callbacks for success and failure plus optional scope
     */
    create: function(data, options) {
        options = options || {};
        
        var model     = this.getModel(),
            instance  = new model(data),
            successCb = options.success,
            failureCb = options.failure,
            scope     = options.scope || this;
        
        instance.save({
            scope  : this,
            success: function(instance) {
                if (typeof successCb == 'function') {
                    successCb.call(scope, instance);
                }
                
                this.fireEvent('instance-created', instance);
            },
            failure: function(instance, errors) {                
                if (typeof failureCb == 'function') {
                    failureCb.call(scope, instance, errors);
                }
                
                this.fireEvent('instance-creation-failed', instance, errors);
            }
        });
    },
    
    /**
     * 通过应用可选的更新和尝试保存更新一个现有的模型实例。
     * Updates an existing model instance by applying optional updates to it and attempting to save
     * @param {Ext.data.Model} instance 现有的实例。The existing instance
     * @param {Object} updates 可选的，在保存之前应用到实例的额外更新。Optional additional updates to apply to the instance before saving
     * @param {Object} options 成功与失败的回调。success and failure callback functions
     */
    update: function(instance, updates, options) {
        options = options || {};
        
        var successCb = options.success,
            failureCb = options.failure,
            scope     = options.scope || this;
        
        if (Ext.isObject(updates)) {
            instance.set(updates);
        }
        
        instance.save({
            scope  : this,
            success: function(instance) {
                if (typeof successCb == 'function') {
                    successCb.call(scope, instance);
                }
                
                this.fireEvent('instance-updated', instance);
            },
            failure: function(instance, errors) {
                if (typeof failureCb == 'function') {
                    failureCb.call(scope, instance, errors);
                }
                
                this.fireEvent('instance-update-failed', instance, errors);
            }
        });
    },
    
    /**
     * 销毁一个或多个、之前保存的模型实例。
     * Destroys one or more existing, previously saved model instances
     * @param {Ext.data.Model} instance 要销毁的实例模型。The model instance to destroy
     * @param {Object} options 成功与失败的回调。success and failure callbacks
     */
    destroy: function(instance, options) {
        options = options || {};
        
        var successCb = options.success,
            failureCb = options.failure,
            scope     = options.scope || this;
        
        instance.destroy({
            scope  : this,
            success: function(instance) {
                if (typeof successCb == 'function') {
                    successCb.call(scope, instance);
                }
                
                this.fireEvent('instance-destroyed', instance);
            },
            failure: function(instance, errors) {
                if (typeof failureCb == 'function') {
                    failureCb.call(scope, instance, errors);
                }
                
                this.fireEvent('instance-destruction-failed', instance, errors);
            }
        });
    },
    
    /**
     * 返回通过{@link #build}动作渲染的视图它所附加的事件侦听器。默认下该方法返回 保存 和 取消 的事件，但也重写该方法。
     * Returns the listeners to attach to the view rendered by the {@link #build} action. By default this returns listeners
     * for save and cancel, but this can be overridden
     * @return {Object} listeners
     */
    getBuildListeners: function() {
        return {
            scope : this,
            save  : this.onCreateInstance,
            cancel: this.onCancelBuild
        };
    },
    
    /**
     * 返回通过{@link #edit}动作渲染的视图它所附加的事件侦听器。默认下该方法返回 保存 和 取消 的事件，但也重写该方法。
     * Returns the listeners to attach to the view rendered by the {@link #edit} action. By default this returns listeners
     * for save and cancel, but this can be overridden
     * @return {Object} listeners
     */
    getEditListeners: function() {
        return {
            scope : this,
            save  : this.onUpdateInstance,
            cancel: this.onCancelEdit
        };
    },
    
    /**
     *  {@link #edit}视图触发的'cancel'事件其处理器。默认这只是关闭视图。
     *  Handler for the 'cancel' event fired by an {@link #edit} view. By default this just closes the view
     * @param {Ext.Component} view 编辑形式。The edit form
     */
    onCancelEdit: function(view) {
        return this.closeView(view);
    },
    
    /**
     * {@link #build}视图触发的'cancel'事件其处理器。默认这只是关闭视图。
     * Handler for the 'cancel' event fired by an {@link #build} view. By default this just closes the view
     * @param {Ext.Component} view 构建形式。The build form
     */
    onCancelBuild: function(view) {
        return this.closeView(view);
    },
    
    /**
     * 绑定到索引视图的“create”事件。默认只是调用控制器的create函数，参数有数据和一个基本的回调，如处理错误或显示成功的回调。可以重写该函数来自定义动作。
     * Callback automatically tied to the index view's 'create' event. By default this just calls the controller's
     * create function with the data and some basic callbacks to handle errors or show success. Can be overridden
     * to provide custom behavior
     * @param {Ext.View} view 触发事件的那个视图实例。The view instance that fired the event
     */
    onCreateInstance: function(view) {
        this.create(view.getValues(), {
            scope  : this,
            success: function(instance) {
                this.closeView(view);
            },
            failure: function(instance, errors) {
                console.log('fail');
            }
        });
    },
    
    /**
     * 绑定到索引视图的“update”事件。默认只是调用控制器的update函数，参数有数据和一个基本的回调，如处理错误或显示成功的回调。可以重写该函数来自定义动作。
     * Callback automatically tied to the index view's 'update' event. By default this just calls the controller's
     * update function with the data and some basic callbacks to handle errors or show success. Can be overridden
     * to provide custom behavior
     * @param {Ext.Component} view 触发事件的那个视图实例。The view instance that fired the event
     */
    onUpdateInstance: function(view) {
        this.update(view.getRecord(), view.getValues(), {
            scope  : this,
            success: function(instance) {
                this.closeView(view);
            },
            failure: function(instance, errors) {
                
            }
        });
    },
    
    /**
     * 绑定到索引视图的“destroy”事件。默认只是调用控制器的destroy函数，参数有数据和一个基本的回调，如处理错误或显示成功的回调。可以重写该函数来自定义动作。
     * Callback automatically tied to the index view's 'destroy' event. By default that just calls the controller's
     * destroy function with the model instance and some basic callbacks to handle errors or show success. Can be
     * overridden to provide custom behavior.
     * @param {Ext.data.Model} instance 要销毁的实例。The instance to destroy
     * @param {Ext.View} view 触发事件的那个视图实例。The view instance that fired the event
     */
    onDestroyInstance: function(instance, view) {
        this.destroy(instance, {
            scope  : this,
            success: function(instance) {
                
            },
            failure: function(instance, errors) {
                
            }
        });
    },
    
    /**
     * 设置组件通过{@link #render}渲染所在默认的容器。
     * 许多程序中有固定的导航面板和内容面板，在该类型的设置中内容面板通常就是渲染目标。
     * Sets the default container that components rendered using {@link #render} will be added to.
     * In many applications there is a fixed navigation panel and a content panel - the content
     * panel would usually form the render target in this type of setup.
     * @param {Ext.Container} target 对已渲染好组件其所在的容器。The container to add rendered components to
     */
    setRenderTarget: function(target) {
        /**
         * @property renderTarget
         * @type Ext.Container
         * 当前{@link #setRenderTarget 渲染目标}。只读的。
         * The current {@link #setRenderTarget render target}. Read only
         */
        Ext.Controller.renderTarget = target;
    },
    
    /**
     * 根据已登记名称渲染给定的视图。
     * Renders a given view based on a registered name
     * @param {String} viewName 要渲染视图的名称。The name of the view to render
     * @param {Object} config 可选的配置项对象。Optional config object
     * @return {Ext.View} 视图实例。The view instance
     */
    render: function(config, target) {
        var Controller  = Ext.Controller,
            application = this.application,
            profile     = application ? application.currentProfile : undefined,
            profileTarget, view;
        
        Ext.applyIf(config, {
            profile: profile
        });
        
        view = Ext.ComponentMgr.create(config);
        
        if (target !== false) {
            //give the current Ext.Profile a chance to set the target
            profileTarget = profile ? profile.getRenderTarget(config, application) : target;
            
            if (target == undefined) {
                target = profileTarget || (application ? application.defaultTarget : undefined);
            }

            if (typeof target == 'string') {
                target = Ext.getCmp(target);
            }

            if (target != undefined && target.add) {
                if (profile) {
                    profile.beforeLayout(view, target, application);
                }
                
                target.add(view);

                if (target.layout && target.layout.setActiveItem) {
                    target.layout.setActiveItem(view);
                }

                target.doComponentLayout();
                
                if (profile) {
                    profile.afterLayout(view, target, application);
                }
            }
        }
        
        return view;
    },
    
    /**
     * 你个函数允许你以方便的方法为视图加入侦听器。
     * This function allows you to add listeners to a view
     * in a convenient way
     */    
    control : function(view, actions, itemName) {
        if (!view || !view.isView) {
            throw 'Trying to control a view that doesnt exist';
        }

        var item = itemName ? view.refs[itemName] : view,
            key, value, name, child, listener;
    
        if (!item) {
            throw "No item called " + itemName + " found inside the " + view.name + " view.";
        }        
    	
        for (key in actions) {
            value = actions[key];
    	
            // If it is an object, it can either be a listener with a handler defined
            // in which case the key is the event name, or it can be an object containing
            // listener(s), in which case key will be the items name
            if (Ext.isObject(value) && !value.fn) {
                this.control(view, value, key);
            }
            else {
                // Now hopefully we can be sure that key is an event name. We will loop over all
                // child items and enable bubbling for this event
                if (item.refs) {
                    for (name in item.refs) {
                        child = item.refs[name];
                        if (child.isObservable && child.events[key]) {
                            child.enableBubble(key);
                        }
                    }
                }
    
                if (!value.fn) {
                    listener = {};
                    listener[key] = value;
                    listener.scope = this;
                }
                else {
                    listener = value;
                    if (listener.scope === undefined) {
                        listener.scope = this;
                    }
                }

                // Finally we bind the listener on this item
                item.addListener(listener);
            }
        }

        return view;
    },
    
    /**
     * 返回关联到该控制器的模型类型其控制器。
     * Returns the constructor for the model type linked to this controller
     * @return {Ext.data.Model} 模型构造器。The model constructor
     */
    getModel: function() {
        return Ext.ModelMgr.getModel(this.model);
    },
    
    /**
     * @private
     * 从父容器中移除组件的时候使用。参阅onCancelEdit和onCancelBuild。
     * Used internally whenever we want to remove a component from its parent container. See onCancelEdit and onCancelBuild
     * @param {Ext.Component} view 要关闭的组件。The component to close
     */
    closeView: function(view) {
        var ownerCt = view.ownerCt;
        
        if (ownerCt) {
            ownerCt.remove(view);
            ownerCt.doLayout();
            ownerCt.setActiveItem(ownerCt.items.last());
        }
    }
});