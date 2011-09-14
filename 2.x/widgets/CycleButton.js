/**
 * @class Ext.CycleButton
 * @extends Ext.SplitButton
 * 一个包含 {@link Ext.menu.CheckItem} 元素的特殊分割按钮。按钮会在点击时自动循环选中每个菜单项，并以该项为活动项触发按钮的 {@link #change} 事件
 * （或者调用按钮的 {@link #changeHandler} 函数，如果设置过的话）。通过点击箭头区域即可像普通分割按钮那样显示下拉列表。使用示例:
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
 * @constructor
 * 创建一个分割按钮
 * @param {Object} config 配置选项对象
 */
Ext.CycleButton = Ext.extend(Ext.SplitButton, {
    /**
     * @cfg {Array} items 一个由 {@link Ext.menu.CheckItem} <b>config</b> 配置选项对象组成的数组，用来创建按钮的菜单项（例如：{text:'Foo', iconCls:'foo-icon'}）
     */
    /**
     * @cfg {Boolean} showText 值为 True 时则将活动项的文本显示为按钮的文本（默认为 false）
     */
    /**
     * @cfg {String} prependText 当没有活动项时按钮显示的文本（仅仅当 showText = true 时有效，默认为 ''）
     */
    /**
     * @cfg {Function} changeHandler 每次改变活动项时被调用的函数。如果没有指定该配置项，则分割按钮将触发活动项的 {@link #change} 事件。
     * 调用该函数时将携带下列参数：(SplitButton this, Ext.menu.CheckItem item)
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
     * @param {Ext.menu.CheckItem} item 被设置的活动项
     * @param {Boolean} suppressEvent 值为 True 时阻止触发按钮的 change 事件（默认为 false）
     */
    setActiveItem : function(item, suppressEvent){
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
            if(!suppressEvent){
                this.fireEvent('change', this, item);
            }
        }
    },

    /**
     * 获取当前活动菜单项。
     * @return {Ext.menu.CheckItem} 活动项
     */
    getActiveItem : function(){
        return this.activeItem;
    },

    // private
    initComponent : function(){
        this.addEvents(
            /**
             * @event change
             * 在按钮的活动项改变之后触发。注意，如果按钮指定了 {@link #changeHandler} 函数，则会调用该函数而不触发此事件。
             * @param {Ext.CycleButton} this
             * @param {Ext.menu.CheckItem} item 选中的菜单项
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