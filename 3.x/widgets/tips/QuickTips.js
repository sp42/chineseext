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
 * @class Ext.QuickTips
 * <p>为所有元素提供有吸引力和可定制的工具提示。QuickTips 是一个单态（singleton）类，被用来为多个元素的提示进行通用地、全局地配置和管理。
 * 想要最大化地定制一个工具提示，你可以考虑使用 {@link Ext.Tip} 或者 {@link Ext.ToolTip}。</p>
 * <p>Quicktips 对象可以直接通过标签的属性来配置，或者在程序中通过 {@link #register} 方法注册提示。</p>
 * <p>单态的 {@link Ext.QuickTip} 对象实例可以通过 {@link #getQuickTip} 方法得到，并且提供所有的方法和所有 Ext.QuickTip 对象中的配置属性。
 * 这些设置会被应用于所有显示的工具提示。</p>
 * <p>下面是可用的配置属性的汇总。详细的说明可以参见 {@link #getQuickTip}</p>
 * <p><b>QuickTips 单态配置项（所有均为可选项）</b></p>
 * <div class="mdetail-params"><ul><li>dismissDelay</li>
 * <li>hideDelay</li>
 * <li>maxWidth</li>
 * <li>minWidth</li>
 * <li>showDelay</li>
 * <li>trackMouse</li></ul></div>
 * <p><b>目标元素配置项（除有说明的均为可选项）</b></p>
 * <div class="mdetail-params"><ul><li>autoHide</li>
 * <li>cls</li>
 * <li>dismissDelay （将覆写单态同名选项值）</li>
 * <li>target （必须）</li>
 * <li>text （必须）</li>
 * <li>title</li>
 * <li>width</li></ul></div>
 * <p>下面是一个用来说明其中的一些配置选项如何使用的例子：</p>
 * <pre><code>
// 初始化单态类。所有基于标签的提示将开始启用。
Ext.QuickTips.init();

// 应用配置选项到对象上
Ext.apply(Ext.QuickTips.getQuickTip(), {
    maxWidth: 200,
    minWidth: 100,
    showDelay: 50,
    trackMouse: true
});

// 手动注册一个工具提示到指定的元素上
Ext.QuickTips.register({
    target: 'my-div',
    title: 'My Tooltip',
    text: 'This tooltip was added in code',
    width: 100,
    dismissDelay: 20
});
</code></pre>
 * <p>在标签中注册一个快捷提示，只需要简单地一个或多个有效的 QuickTip 属性并加上 <b>ext:</b> 作为命名空间前缀。
 * HTML 元素自身将自动地被设置为快捷提示的目标。下面是可用的属性的汇总（除有说明的均为可选项）：</p>
 * <ul><li><b>hide</b>：指定为 "user" 等同于设置 autoHide = false。其他任何值则相当于 autoHide = true。</li>
 * <li><b>qclass</b>：应用于快捷提示的 CSS 类（等同于目标元素中的 'cls' 配置）。</li>
 * <li><b>qtip （必须）</b>：快捷提示的文本（等同于目标元素中的 'text' 配置）。</li>
 * <li><b>qtitle</b>：快捷提示的标题（等同于目标元素中的 'title' 配置）。</li>
 * <li><b>qwidth</b>：快捷提示的宽度（等同于目标元素中的 'width' 配置）。</li></ul>
 * <p>下面是一个说明如何通过使用标签在 HTML 元素上显示快捷提示的例子：</p>
 * <pre><code>
// 往一个 HTML 的按钮中添加快捷提示
&lt;input type="button" value="OK" ext:qtitle="OK Button" ext:qwidth="100"
     ext:qtip="This is a quick tip from markup!">&lt;/input>
</code></pre>
 * @singleton
 */
Ext.QuickTips = function(){
    var tip, locks = [];
    return {
        /**
         * 初始化全局 QuickTips 实例
         */
        init : function(){
            if(!tip){
                tip = new Ext.QuickTip({elements:'header,body'});
            }
        },

        /**
         * 打开全局快速提示功能.
         */
        enable : function(){
            if(tip){
                locks.pop();
                if(locks.length < 1){
                    tip.enable();
                }
            }
        },

        /**
         * 关闭全局快速提示功能.
         */
        disable : function(){
            if(tip){
                tip.disable();
            }
            locks.push(1);
        },

        /**
         * 获取一个值,该值指示此quick tips是否可以对用户交互作出响应。
         * @return {Boolean}
         */
        isEnabled : function(){
            return tip && !tip.disabled;
        },

        /**
         * 获得全局QuickTips实例.
         */
        getQuickTip : function(){
            return tip;
        },

        /**
         * 配置一个新的quick tip实例并将其分配到一个目标元素. 详细信息请查看
         * {@link Ext.QuickTip#register}.
         * @param {Object} config 配置对象
         */
        register : function(){
            tip.register.apply(tip, arguments);
        },

        /**
         * 从目标元素中移除并销毁所有已注册的quick tip
         * @param {String/HTMLElement/Element} el 将要被移除的quick tip的所属元素.
         */
        unregister : function(){
            tip.unregister.apply(tip, arguments);
        },

        /**
         * {@link #register}的别名.
         * @param {Object} config 配置对象
         */
        tips :function(){
            tip.register.apply(tip, arguments);
        }
    }
}();