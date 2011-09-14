/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 * @class Ext.CycleButton
 * @extends Ext.SplitButton
 * 一个包含{@link Ext.menu.CheckItem}元素的特殊分割按钮。
 * 按钮会在点击时自动循环选中每个菜单项，并以该项为活动项触发按钮的{@link #change}事件（或者调用按钮的{@link #changeHandler}函数，如果设置过的话）。
 * 通过点击箭头区域即可像普通分割按钮那样显示下拉列表。使用示例:
 * A specialized SplitButton that contains a menu of {@link Ext.menu.CheckItem} elements.  The button automatically
 * cycles through each menu item on click, raising the button's {@link #change} event (or calling the button's
 * {@link #changeHandler} function, if supplied) for the active menu item. Clicking on the arrow section of the
 * button displays the dropdown menu just like a normal SplitButton.  Example usage:
 * <pre><code>
var btn = new Ext.CycleButton({
    showText: true,
    prependText: 'View as ',
    items: [{
        text:'text only',
        iconCls:'view-text',
        checked:true
    },{
        text:'HTML',
        iconCls:'view-html'
    }],
    changeHandler:function(btn, item){
        Ext.Msg.alert('Change View', item.text);
    }
});
</code></pre>
 * @constructor 创建一个分割按钮。Create a new split button
 * @param {Object} config 配置选项对象。The config object
 */
Ext.CycleButton = Ext.extend(Ext.SplitButton, {
    /**
     * @cfg {Array} items  一个由{@link Ext.menu.CheckItem} <b>config配置项</b>对象组成的数组，用来创建按钮的菜单项（例如：{text:'Foo', iconCls:'foo-icon'}）。
     * An array of {@link Ext.menu.CheckItem} <b>config</b> objects to be used when creating the
     * button's menu items (e.g., {text:'Foo', iconCls:'foo-icon'})
     */
    /**
     * @cfg {Boolean} showText 值为 True 时则将活动项的文本显示为按钮的文本（默认为 false）。
     * True to display the active item's text as the button text (defaults to false)
     */
    /**
     * @cfg {String} prependText 当没有活动项时按钮显示的文本（仅仅当 showText = true 时有效，默认为 ''）。
     * A static string to prepend before the active item's text when displayed as the
     * button's text (only applies when showText = true, defaults to '')
     */
    /**
     * @cfg {Function} changeHandler 每次改变活动项时被调用的函数。
     * 如果没有指定该配置项，则分割按钮将触发活动项的{@link #change}事件。
     * 调用该函数时将携带下列参数：(SplitButton this, Ext.menu.CheckItem item)。
     * A callback function that will be invoked each time the active menu
     * item in the button's menu has changed.  If this callback is not supplied, the SplitButton will instead
     * fire the {@link #change} event on active item change.  The changeHandler function will be called with the
     * following argument list: (SplitButton this, Ext.menu.CheckItem item)
     */
	/**
	 * @cfg {String} forceIcon 对该按钮设置图标，利用了CSS背景图的方法。无论下拉菜单选择了哪一项都会显示这个图标。该项覆盖了原有改变按钮图标原来适应选择项图标的做法。
	 * A css class which sets an image to be used as the static icon for this button.  This
	 * icon will always be displayed regardless of which item is selected in the dropdown list.  This overrides the 
	 * default behavior of changing the button's icon to match the selected item's icon on change.
	 */

    // private
    getItemText : function(item){
        if(item && this.showText === true){
            var text = '';
            if(this.prependText){
                text += this.prependText;
            }
            text += item.text;
            return text;
        }
        return undefined;
    },

    /**
     * 设置按钮的活动菜单项。
     * Sets the button's active menu item.
     * @param {Ext.menu.CheckItem} item 被设置的活动项。The item to activate
     * @param {Boolean} suppressEvent 值为True时阻止触发按钮的change事件（默认为false）。True to prevent the button's change event from firing (defaults to false)
     */
    setActiveItem : function(item, suppressEvent){
        if(typeof item != 'object'){
            item = this.menu.items.get(item);
        }
        if(item){
            if(!this.rendered){
                this.text = this.getItemText(item);
                this.iconCls = item.iconCls;
            }else{
                var t = this.getItemText(item);
                if(t){
                    this.setText(t);
                }
                this.setIconClass(item.iconCls);
            }
            this.activeItem = item;
            if(!item.checked){
                item.setChecked(true, true);
            }
            if(this.forceIcon){
                this.setIconClass(this.forceIcon);
            }
            if(!suppressEvent){
                this.fireEvent('change', this, item);
            }
        }
    },

    /**
     * 获取当前活动菜单项。
     * Gets the currently active menu item.
     * @return {Ext.menu.CheckItem} 活动项。The active item
     */
    getActiveItem : function(){
        return this.activeItem;
    },

    // private
    initComponent : function(){
        this.addEvents(
            /**
             * @event change
             * 在按钮的活动项改变之后触发。
             * 注意，如果按钮指定了{@link #changeHandler}函数，则会调用该函数而不触发此事件。
             * Fires after the button's active menu item has changed.  Note that if a {@link #changeHandler} function
             * is set on this CycleButton, it will be called instead on active item change and this change event will
             * not be fired.
             * @param {Ext.CycleButton} this
             * @param {Ext.menu.CheckItem} item 选中的菜单项。The menu item that was selected
             */
            "change"
        );

        if(this.changeHandler){
            this.on('change', this.changeHandler, this.scope||this);
            delete this.changeHandler;
        }

        this.itemCount = this.items.length;

        this.menu = {cls:'x-cycle-menu', items:[]};
        var checked;
        for(var i = 0, len = this.itemCount; i < len; i++){
            var item = this.items[i];
            item.group = item.group || this.id;
            item.itemIndex = i;
            item.checkHandler = this.checkHandler;
            item.scope = this;
            item.checked = item.checked || false;
            this.menu.items.push(item);
            if(item.checked){
                checked = item;
            }
        }
        this.setActiveItem(checked, true);
        Ext.CycleButton.superclass.initComponent.call(this);

        this.on('click', this.toggleSelected, this);
    },

    // private
    checkHandler : function(item, pressed){
        if(pressed){
            this.setActiveItem(item);
        }
    },

    /**
     * 通常情况下该函数仅仅被内部调用，但也可以在外部调用使得按钮将活动项指向菜单中的下一个选项。
     * 如果当前项是菜单中的最后一项，则活动项会被设置为菜单中的第一项。
     * This is normally called internally on button click, but can be called externally to advance the button's
     * active item programmatically to the next one in the menu.  If the current item is the last one in the menu
     * the active item will be set to the first item in the menu.
     */
    toggleSelected : function(){
        this.menu.render();
		
		var nextIdx, checkItem;
		for (var i = 1; i < this.itemCount; i++) {
			nextIdx = (this.activeItem.itemIndex + i) % this.itemCount;
			// check the potential item
			checkItem = this.menu.items.itemAt(nextIdx);
			// if its not disabled then check it.
			if (!checkItem.disabled) {
				checkItem.setChecked(true);
				break;
			}
		}
    }
});
Ext.reg('cycle', Ext.CycleButton);