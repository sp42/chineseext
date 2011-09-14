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
 * @class Ext.Panel
 * @extends Ext.Container
 * 面板是一种面向用户界面构建应用程序最佳的单元块，一种特定功能和结构化组件。面板包含有底部和顶部的工具条，连同单独的头部、底部和body部分。
 * 它提供内建都得可展开和可闭合的行为，连同多个内建的可制定的行为的工具按钮。面板可简易地置入任意的容器或布局，而面板和渲染管线（rendering pipeline）则由框架完全控制。<br />
 * Panel is a container that has specific functionality and structural components that make it the perfect building
 * block for application-oriented user interfaces. The Panel contains bottom and top toolbars, along with separate
 * header, footer and body sections.  It also provides built-in expandable and collapsible behavior, along with a
 * variety of prebuilt tool buttons that can be wired up to provide other customized behavior.  Panels can be easily
 * dropped into any Container or layout, and the layout and rendering pipeline is completely managed by the framework.
 * @constructor
 * @param {Object} config 配置项对象。The config object
 */
Ext.Panel = Ext.extend(Ext.Container, {
    /**
     * 面板的头部元素{@link Ext.Element Element}。只读的。 
     * The Panel's header {@link Ext.Element Element}. Read-only.
     * <p>
     * 此元素用于承载 {@link #title} 和 {@link #tools}。
     * This Element is used to house the {@link #title} and {@link #tools}</p>
     * @type Ext.Element
     * @property header
     */
    /**
     * 面板的躯干元素{@link Ext.Element Element}用于承载HTML内容。
     * 内容可由配置项{@link #html}指定，亦可通过配置{@link autoLoad}加载，通过面板的{@link #getUpdater Updater}亦是同样的原理。只读的。
     * The Panel's body {@link Ext.Element Element} which may be used to contain HTML content.
     * The content may be specified in the {@link #html} config, or it may be loaded using the
     * {@link autoLoad} config, or through the Panel's {@link #getUpdater Updater}. Read-only.
     * <p>注：若采用了上述的方法，那么面板则不能当作布局的容器嵌套子面板。
     * If this is used to load visible HTML elements in either way, then
     * the Panel may not be used as a Layout for hosting nested Panels.</p>
     * <p>换句话说，若打算将面板用于布局的承载者，Body躯干元素就不能有任何加载或改动，它是由面板的局部（Panel's Layout）负责调控。
     * If this Panel is intended to be used as the host of a Layout (See {@link #layout}
     * then the body Element must not be loaded or changed - it is under the control
     * of the Panel's Layout.</p>
     * @type Ext.Element
     * @property body
     */
    /**
     * @cfg {Object} bodyCfg
     * <p>构成面板{@link #body}元素的{@link Ext.DomHelper DomHelper}配置对象。
     * A {@link Ext.DomHelper DomHelper} configuration object specifying the element structure
     * of this Panel's {@link #body} Element.</p>
     * <p>
     * 这可能会对body元素采用另外一套的结构。例如使用&lt;center&gt; 元素就代表将其中内容都居中显示。
     * This may be used to force the body Element to use a different form of markup than
     * is created automatically. An example of this might be to create a child Panel containing
     * custom content, such as a header, or forcing centering of all Panel
     * content by having the body be a &lt;center&gt; element:</p><code><pre>
new Ext.Panel({
    title: 'New Message',
    collapsible: true,
    renderTo: Ext.getBody(),
    width: 400,
    bodyCfg: {
        tag: 'center',
        cls: 'x-panel-body'
    },
    items: [{
        border: false,
        header: false,
        bodyCfg: {tag: 'h2', html: 'Message'}
    }, {
        xtype: 'textarea',
        style: {
            width: '95%',
            marginBottom: '10px'
        }
    },
        new Ext.Button({
            text: 'Send',
            minWidth: '100',
            style: {
                marginBottom: '10px'
            }
        })
    ]
});</pre></code>
     * <p>By default, the Default element in the table below will be used for the html markup to
     * create a child element with the commensurate Default class name (<tt>baseCls</tt> will be
     * replaced by <tt>{@link #baseCls}</tt>):</p>
     * <pre>
     * Panel      Default  Default             Custom      Additional       Additional
     * Element    element  class               element     class            style
     * ========   ==========================   =========   ==============   ===========
     * {@link #header}     div      {@link #baseCls}+'-header'   {@link #headerCfg}   headerCssClass   headerStyle
     * {@link #bwrap}      div      {@link #baseCls}+'-bwrap'     {@link #bwrapCfg}    bwrapCssClass    bwrapStyle
     * + tbar     div      {@link #baseCls}+'-tbar'       {@link #tbarCfg}     tbarCssClass     tbarStyle
     * + {@link #body}     div      {@link #baseCls}+'-body'       {@link #bodyCfg}     {@link #bodyCssClass}     {@link #bodyStyle}
     * + bbar     div      {@link #baseCls}+'-bbar'       {@link #bbarCfg}     bbarCssClass     bbarStyle
     * + {@link #footer}   div      {@link #baseCls}+'-footer'   {@link #footerCfg}   footerCssClass   footerStyle
     * </pre>
     * <p>Configuring a Custom element may be used, for example, to force the {@link #body} Element
     * to use a different form of markup than is created by default. An example of this might be
     * to {@link Ext.Element#createChild create a child} Panel containing a custom content, such as
     * a header, or forcing centering of all Panel content by having the body be a &lt;center&gt;
     * element:</p>
     * <pre><code>
new Ext.Panel({
    title: 'Message Title',
    renderTo: Ext.getBody(),
    width: 200, height: 130,
    <b>bodyCfg</b>: {
        tag: 'center',
        cls: 'x-panel-body',  // Default class not applied if Custom element specified
        html: 'Message'
    },
    footerCfg: {
        tag: 'h2',
        cls: 'x-panel-footer'        // same as the Default class
        html: 'footer html'
    },
    footerCssClass: 'custom-footer', // additional css class, see {@link Ext.element#addClass addClass}
    footerStyle:    'background-color:red' // see {@link #bodyStyle}
});
     * </code></pre>
     * <p>The example above also explicitly creates a <tt>{@link #footer}</tt> with custom markup and
     * styling applied.</p>
     */
    /**
     * @cfg {Object} headerCfg
     * <p>
     * 面板{@link #header}元素的结构，符合{@link Ext.DomHelper DomHelper}配置的格式。
     * A {@link Ext.DomHelper DomHelper} configuration object specifying the element structure
     * of this Panel's {@link #header} Element.</p>
     */
    /**
     * @cfg {Object} bwrapCfg
     * <p>A {@link Ext.DomHelper DomHelper} element specification object specifying the element structure
     * of this Panel's {@link #bwrap} Element.  See <tt>{@link #bodyCfg}</tt> also.</p>
     */
    /**
     * @cfg {Object} tbarCfg
     * <p>A {@link Ext.DomHelper DomHelper} element specification object specifying the element structure
     * of this Panel's {@link #tbar} Element.  See <tt>{@link #bodyCfg}</tt> also.</p>
     */
    /**
     * @cfg {Object} bbarCfg
     * <p>A {@link Ext.DomHelper DomHelper} element specification object specifying the element structure
     * of this Panel's {@link #bbar} Element.  See <tt>{@link #bodyCfg}</tt> also.</p>
     */	
    /**
     * @cfg {Object} footerCfg
     * <p>
     * 面板{@link #footer}元素的结构，符合{@link Ext.DomHelper DomHelper}配置的格式。
     * A {@link Ext.DomHelper DomHelper} configuration object specifying the element structure
     * of this Panel's {@link #footer} Element.</p>
     */
    /**
     * @cfg {Boolean} closable
     * Panels themselves do not directly support being closed, but some Panel subclasses do (like
     * {@link Ext.Window}) or a Panel Class within an {@link Ext.TabPanel}.  Specify <tt>true</tt>
     * to enable closing in such situations. Defaults to <tt>false</tt>.
     */
    /**
     * 面板的底部元素{@link Ext.Element Element}。只读的。
     * The Panel's footer {@link Ext.Element Element}. Read-only.
     * <p>
     * 该元素用于承托面板的{@link #buttons}。
     * This Element is used to house the Panel's {@link #buttons}.</p>
     * The Panel's footer {@link Ext.Element Element}. Read-only.
     * <p>This Element is used to house the Panel's <tt>{@link #buttons}</tt> or <tt>{@link #fbar}</tt>.</p>
     * <br><p><b>Note</b>: see the Note for <tt>{@link Ext.Component#el el} also.</p>
     * @type Ext.Element
     * @property footer
     */
    /**
     * @cfg {Mixed} applyTo
     * 即applyTo代表一个在页面上已经存在的元素或元素的id，
     * 该元素通过markup的方式来表示欲生成的组件的某些结构化信息，
     * Ext在创建一个组件时会首先考虑使用applyTo元素中的存在的元素，
     * 你可以认为applyTo是组件在页面上的模板，与YUI中的markup模式很相似。
     * The id of the node, a DOM node or an existing Element corresponding to a DIV that is already present in
     * the document that specifies some panel-specific structural markup.  When applyTo is used, constituent parts of
     * the panel can be specified by CSS class name within the main element, and the panel will automatically create those
     * components from that markup. Any required components not specified in the markup will be autogenerated if necessary.
     * The following class names are supported (baseCls will be replaced by {@link #baseCls}):
     * <ul><li>baseCls + '-header'</li>
     * <li>baseCls + '-header-text'</li>
     * <li>baseCls + '-bwrap'</li>
     * <li>baseCls + '-tbar'</li>
     * <li>baseCls + '-body'</li>
     * <li>baseCls + '-bbar'</li>
     * <li>baseCls + '-footer'</li></ul>
     * 当你在config中配置了applyTo属性后，render()方法就不需要了。
     * 有了applyTo之后，{@link #renderTo}属性则会被忽略，并且applyTo所指定元素的父元素，将自动是面板的容器元素。
     * Using this config, a call to render() is not required.  If applyTo is specified, any value passed for
     * {@link #renderTo} will be ignored and the target element's parent node will automatically be used as the panel's container.
     */
    /**
     * @cfg {Object/Array} tbar
     * 面板顶部的工具条。
     * 此项可以是{@link Ext.Toolbar}的实例、工具条的配置对象，或由按钮配置项对象构成的数组，以加入到工具条中。
     * 注意，此项属性渲染过后就不可用了，应使用{@link #getTopToolbar}的方法代替。
     * The top toolbar of the panel. This can be a {@link Ext.Toolbar} object, a toolbar config, or an array of
     * buttons/button configs to be added to the toolbar.  Note that this is not available as a property after render.
     * To access the top toolbar after render, use {@link #getTopToolbar}.
     */
    /**
     * @cfg {Object/Array} bbar
     * 面板底部的工具条。
     * 此项可以是{@link Ext.Toolbar}的实例、工具条的配置对象，或由按钮配置项对象构成的数组，以加入到工具条中。
     * 注意，此项属性渲染过后就不可用了，应使用{@link #getBottomToolbar}的方法代替。
     * The bottom toolbar of the panel. This can be a {@link Ext.Toolbar} object, a toolbar config, or an array of
     * buttons/button configs to be added to the toolbar.  Note that this is not available as a property after render.
     * To access the bottom toolbar after render, use {@link #getBottomToolbar}.
     */
    /** @cfg {Object/Array} fbar
     * <p>A {@link Ext.Toolbar Toolbar} object, a Toolbar config, or an array of
     * {@link Ext.Button Button}s/{@link Ext.Button Button} configs, describing a {@link Ext.Toolbar Toolbar} to be rendered into this Panel's footer element.</p>
     * <p>After render, the <code>fbar</code> property will be an {@link Ext.Toolbar Toolbar} instance.</p>
     * <p>If <tt>{@link #buttons}</tt> are specified, they will supersede the <tt>fbar</tt> configuration property.</p>
     * The Panel's <tt>{@link #buttonAlign}</tt> configuration affects the layout of these items, for example:
     * <pre><code>
var w = new Ext.Window({
    height: 250,
    width: 500,
    bbar: new Ext.Toolbar({
        items: [{
            text: 'bbar Left'
        },'->',{
            text: 'bbar Right'
        }]
    }),
    {@link #buttonAlign}: 'left', // anything but 'center' or 'right' and you can use "-", and "->"
                                  // to control the alignment of fbar items
    fbar: [{
        text: 'fbar Left'
    },'->',{
        text: 'fbar Right'
    }]
}).show();
     * </code></pre>
     * <p><b>Note:</b> Although a Toolbar may contain Field components, these will <b>not<b> be updated by a load
     * of an ancestor FormPanel. A Panel's toolbars are not part of the standard Container->Component hierarchy, and
     * so are not scanned to collect form items. However, the values <b>will</b> be submitted because form
     * submission parameters are collected from the DOM tree.</p>
     */	
    /**
     * @cfg {Boolean} header
     * True表示为显式建立头部元素，false则是跳过创建。
     * 缺省下，如不创建头部，将使用{@link #title}的内容设置到头部去，如没指定title则不会。
     * 如果设置好title，但头部设置为false，那么头部亦不会生成。
     * True to create the header element explicitly, false to skip creating it.  By default, when header is not
     * specified, if a {@link #title} is set the header will be created automatically, otherwise it will not.  If
     * a title is set but header is explicitly set to false, the header will not be rendered.
     */
    /**
     * @cfg {Boolean} footer
     * True表示为显式建立底部元素，false则是跳过创建。
     * 缺省下，就算不声明创建底部，若有一个或一个以上的按钮加入到面板的话，也创建底部，不指定按钮就不会生成。
     * True to create the footer element explicitly, false to skip creating it.  By default, when footer is not
     * specified, if one or more buttons have been added to the panel the footer will be created automatically,
     * otherwise it will not.
     */
    /**
     * @cfg {String} title
     * 显示在面板头部的文本标题(默认为'')。
     * 如有指定了titile那么头部元素<tt>{@link #header}</tt>会自动生成和显示，除非<tt>{@link #header}</tt>强制设为false。如果你不想在写配置时指定好title，
     * 不过想在后面才加入的话，你必须先指定一个非空的标题（具体说是空白字符''亦可或header：true），这样才保证容器元素生成出来。
     * The title text to be used as innerHTML (html tags are accepted) to display in the panel <tt>{@link #header}</tt>(defaults to '').
     * When a title is specified the header element will automatically be created and displayed unless {@link #header}
     * is explicitly set to false.  If you do not want to specify a title at config time, but you may want one later, 
     * you must either specify a non-empty title (a blank space ' ' will do) or header:true so that the container
     * element will get created.
     */
    /**
     * @cfg {Array} buttons
     * 在面板底部加入按钮，{@link Ext.Button}配置的数组。
     * An array of {@link Ext.Button}s or {@link Ext.Button} configs used to add buttons to the footer of this panel.
     */
    /**
     * @cfg {Object/String/Function} autoLoad
     * 一个特定的url反馈到Updater的{@link Ext.Updater#update}方法。
     * 若autoLoad非null，面板会尝试在渲染后立即加载内容。
     * 同时该面板{@link #body}元素的默认URL属性就是这URL，所以可随时调用{@link Ext.Element#refresh refresh}的方法。
     * A valid url spec according to the Updater {@link Ext.Updater#update} method.
     * If autoLoad is not null, the panel will attempt to load its contents immediately upon render.<p>
     * The URL will become the default URL for this panel's {@link #body} element,
     * so it may be {@link Ext.Element#refresh refresh}ed at any time.</p>
     */
    /**
     * @cfg {Boolean} frame
     * True表示为面板的边框外框可自定义的，false表示为边框可1px的点线（默认为false）。
     * True to render the panel with custom rounded borders, false to render with plain 1px square borders (defaults to false).
     */
    /**
     * @cfg {Boolean} border
     * True表示为显示出面板body元素的边框，false则隐藏（缺省为true），默认下，边框是一套2px宽的内边框，但可在{@link #bodyBorder}中进一步设置。
     * True to display the borders of the panel's body element, false to hide them (defaults to true).  By default,
     * the border is a 2px wide inset border, but this can be further altered by setting {@link #bodyBorder} to false.
     */
    /**
     * @cfg {Boolean} bodyBorder
     * True表示为显示出面板body元素的边框，false则隐藏（缺省为true），只有{@link #border} == true时有效。
     * 若border == true and bodyBorder == false，边框则为1px宽，可指定整个body元素的内置外观。
     * True to display an interior border on the body element of the panel, false to hide it (defaults to true).
     * This only applies when {@link #border} == true.  If border == true and bodyBorder == false, the border will display
     * as a 1px wide inset border, giving the entire body element an inset appearance.
     */
    /**
     * @cfg {String/Object/Function} bodyStyle
     * 制定body元素的CSS样式。格式形如{@link Ext.Element#applyStyles}（缺省为null）。
     * Custom CSS styles to be applied to the body element in the format expected by {@link Ext.Element#applyStyles}
     * (defaults to null).
     */
    /**
     * @cfg {String} iconCls
     * 一个能提供背景图片的CSS样式类，用于面板头部的图标：（默认为''）。
     * The CSS class selector that specifies a background image to be used as the header icon (defaults to '').
     * <p>
     * 自定义图标的样式的示例：
     * An example of specifying a custom icon class would be something like:
     * </p><code><pre>
// 在配置项中指定哪一个样式：specify the property in the config for the class:
     ...
     iconCls: 'my-icon'

// 利用css背景图说明图标文件是哪一个。css class that specifies background image to be used as the icon image:
.my-icon { background-image: url(../images/my-icon.gif) 0 6px no-repeat !important; }
</pre></code>
     */
    /**
     * @cfg {Boolean} collapsible
     * True表示为面板是可收缩的，并自动渲染一个展开/收缩的轮换按钮在头部工具条。
     * false表示为保持面板为一个静止的尺寸（缺省为false）。
     * True to make the panel collapsible and have the expand/collapse toggle button automatically rendered into
     * the header tool button area, false to keep the panel statically sized with no button (defaults to false).
     */
    /**
     * @cfg {Array} tools
     * 一个按钮配置组成的数组，加入到头部的工具条区域。
     * 渲染过程中，每一项工具都保存为{@link Ext.Element Element}对象，都集中保存在属性<tt><b></b>tools.<i>&lt;tool-type&gt;</i></tt>之中。
     * 每个工具配置可包含下列属性： 
     * An array of tool button configs to be added to the header tool area. When rendered, each tool is
     * stored as an {@link Ext.Element Element} referenced by a public property called <tt><b></b>tools.<i>&lt;tool-type&gt;</i></tt>
     * <p>Each tool config may contain the following properties:
     * <div class="mdetail-params"><ul>
     * <li><b>id</b> : String<div class="sub-desc"><b>必须的。 Required.</b> 创建tool其类型。默认下有<tt>x-tool-<i>&lt;tool-type&gt;</i></tt>样式分配的了就表示这是一个tool元素。 
     * The type of tool to create. By default, this assigns a CSS class of the form <tt>x-tool-<i>&lt;tool-type&gt;</i></tt> to the
     * resulting tool Element. 
     * Ext自带一些css样式，吻合于各种tool的按钮样式需求。
     * 开发人员也可以自己弄一些css样式和背景图来修改图标。 
     * Ext provides CSS rules, and an icon sprite containing images for the tool types listed below.
     * The developer may implement custom tools by supplying alternate CSS rules and background images:<ul>
     * <li><tt>toggle</tt> 当{@link #collapsible}为<tt>true</tt>时自动创建。(Created by default when {@link #collapsible} is <tt>true</tt>)</li>
     * <li><tt>close</tt></li>
     * <li><tt>minimize</tt></li>
     * <li><tt>maximize</tt></li>
     * <li><tt>restore</tt></li>
     * <li><tt>gear</tt></li>
     * <li><tt>pin</tt></li>
     * <li><tt>unpin</tt></li>
     * <li><tt>right</tt></li>
     * <li><tt>left</tt></li>
     * <li><tt>up</tt></li>
     * <li><tt>down</tt></li>
     * <li><tt>refresh</tt></li>
     * <li><tt>minus</tt></li>
     * <li><tt>plus</tt></li>
     * <li><tt>help</tt></li>
     * <li><tt>search</tt></li>
     * <li><tt>save</tt></li>
     * <li><tt>print</tt></li>
     * </ul></div></li>
     * <li><b>handler</b>: Function<div class="sub-desc"><b> 必须的。Required.</b> 点击后执行的函数。它传入的参数有：
     * The function tocall when clicked. Arguments passed are:<ul>
     * <li><b>event</b> : Ext.EventObject<div class="sub-desc">单击事件。The click event.</div></li>
     * <li><b>toolEl</b> : Ext.Element<div class="sub-desc">工具元素（tool Element） The tool Element.</div></li>
     * <li><b>panel</b> : Ext.Panel<div class="sub-desc">面板。The host Panel</div></li>
     * <li><b>tc</b> : Ext.Panel<div class="sub-desc">The tool configuration object</div></li>
     * </ul></div></li>
     * <li><b>stopEvent</b> : Boolean<div class="sub-desc">默认为true。false的话表示点击事件停止衍生。
     * Defaults to true. Specify as false to allow click event to propagate.</div></li>
     * <li><b>scope</b> : Object<div class="sub-desc">调用处理函数的作用域。The scope in which to call the handler.</div></li>
     * <li><b>qtip</b> : String/Object<div class="sub-desc">提示字符串，或{@link Ext.QuickTip#register}的配置参数。
     * A tip string, or a config argument to {@link Ext.QuickTip#register}</div></li>
     * <li><b>hidden</b> : Boolean<div class="sub-desc">True表示为渲染为隐藏。True to initially render hidden.</div></li>
     * <li><b>on</b> : Object<div class="sub-desc">特定事件侦听器的配置对象，格式形如{@link #addListener}的参数。
     * 侦听器的配置对象格式应如{@link #addListener}。A listener config object specifiying
     * event listeners in the format of an argument to {@link #addListener}</div></li>
     * </ul></div>
     * 用法举例： Example usage:
     * <pre><code>
tools:[{
    id:'refresh',
    qtip: 'Refresh form Data',
    // hidden:true,
    handler: function(event, toolEl, panel){
        // refresh logic
    }
},
{
    id:'help',
    qtip: 'Get Help',
    handler: function(event, toolEl, panel){
        // whatever
    }
}]
</code></pre>
     * 注意面板关闭时的轮换按钮（toggle tool）的实现是分离出去，这些工具按钮只提供视觉上的按钮。
     * 所需的功能必须由事件处理器提供以实现相应的行为。
     * Note that apart from the toggle tool which is provided when a panel is
     * collapsible, these tools only provide the visual button. Any required
     * functionality must be provided by adding handlers that implement the
     * necessary behavior.
     */
    /**
     * @cfg {Ext.Template/Ext.XTemplate} toolTemplate
     * <p> 
     * 位于{@link #header}中的tools其模板是什么。默认是：
     * A Template used to create tools in the {@link #header} Element. Defaults to:</p><pre><code>
new Ext.Template('&lt;div class="x-tool x-tool-{id}">&amp;#160;&lt;/div>')</code></pre>
     * <p>
     * 重写时，或者这是一个复杂的XTemplate。模板数据就是一给单独的配置对象而不会是一个数组，这点要与{@link #tools}比较。
     * This may may be overridden to provide a custom DOM structure for tools based upon a more
     * complex XTemplate. The template's data is a single tool configuration object (Not the entire Array)
     * as specified in {@link #tools} Example:</p><pre><code>
var win = new Ext.Window({
    tools: [{
        id: 'download',
        href: '/MyPdfDoc.pdf'
    }],
    toolTemplate: new Ext.XTemplate(
        '&lt;tpl if="id==\'download\'">',
            '&lt;a class="x-tool x-tool-pdf" href="{href}">&lt;/a>',
        '&lt;/tpl>',
        '&lt;tpl if="id!=\'download\'">',
            '&lt;div class="x-tool x-tool-{id}">&amp;#160;&lt;/div>',
        '&lt;/tpl>'
    ),
    width:500,
    height:300,
    closeAction:'hide'
});</code></pre>
     * <p>
     * 注意"x-tool-pdf"样式必须要对应好样式的定义，提供合适背景图片。
     * Note that the CSS class "x-tool-pdf" should have an associated style rule which provides an appropriate background image.</p>
     */
    /**
     * @cfg {Boolean} hideCollapseTool
     * True表示为不出 展开/收缩的轮换按钮，当{@link #collapsible} = true，false就显示（默认为false）。
     * True to hide the expand/collapse toggle button when {@link #collapsible} = true, false to display it (defaults to false).
     */
    /**
     * @cfg {Boolean} titleCollapse
     * True表示为允许单击头部区域任何一个位置都可收缩面板（当{@link #collapsible} = true）反之只允许单击工具按钮（默认为false）。
     * True to allow expanding and collapsing the panel (when {@link #collapsible} = true) by clicking anywhere in the
     * header bar, false to allow it only by clicking to tool button (defaults to false).
     */
    /**
     * @cfg {Boolean} autoScroll
     * True表示为在面板body元素上，设置overflow：'auto'和出现滚动条false表示为裁剪所有溢出的内容（默认为false）。
     * True to use overflow:'auto' on the panel's body element and show scroll bars automatically when necessary,
     * false to clip any overflowing content (defaults to false).
     */
    /**
     * @cfg {Boolean} floating
     * <p>
     * True表示为浮动此面板（带有自动填充和投影的绝对定位），false表示为在其渲染的位置"就近"显示（默认为false）。
     * True to float this Panel (absolute position it with automatic shimming and shadow), false to display it inline
     * where it is rendered (defaults to false).</p>
     * <p>
     * 设置floating为true，将会在面板元素的基础上创建一个{@link Ext.Layer}
     * 同时让面板显示到非正数的坐标上去了，不能正确显示。因此面板必须精确地设置渲染后的位置，也就是使用绝对的定位方式。
     * （如：myPanel.setPosition(100,100);）
     * Setting floating to true will create an {@link Ext.Layer} encapsulating this Panel's Element and
     * display the Panel at negative offsets so that it is hidden. The position must be set explicitly after render
     * (e.g., myPanel.setPosition(100,100);).</p>
     * <p>
     * 若一个浮动面板是没有固定其宽度的，这导致面板会填满与视图右方的区域。
     * When floating a panel you should always assign a fixed width, otherwise it will be auto width and will expand
     * to fill to the right edge of the viewport.</p>
     * <p>
     * 该属性也可以是创建那个{@link Ext.Layer}对象所用的配置项对象。
     * This property may also be specified as an object to be used as the configuration object for
     * the {@link Ext.Layer} that will be created.
     */
    /**
     * @cfg {Boolean/String} shadow
     * True 表示为（或一个有效{@link Ext.Shadow#mode}值）在面板后显示投影效果（默认为'sides'四边）。
     * 注意此项只当floating = true时有效。
     * True (or a valid Ext.Shadow {@link Ext.Shadow#mode} value) to display a shadow behind the panel, false to
     * display no shadow (defaults to 'sides').  Note that this option only applies when floating = true.
     */
    /**
     * @cfg {Number} shadowOffset
     * 投影偏移的象素值（默认为4）。注意此项只当floating = true时有效。
     * The number of pixels to offset the shadow if displayed (defaults to 4). Note that this option only applies
     * when floating = true.
     */
    /**
     * @cfg {Boolean} shim
     * False表示为禁止用iframe填充，有些浏览器可能需要设置（默认为true）。
     * 注意此项只当floating = true时有效。
     * False to disable the iframe shim in browsers which need one (defaults to true).  Note that this option
     * only applies when floating = true.
     */
    /**
     * @cfg {String/Object} html
     * 一段HTML片段，或{@link Ext.DomHelper DomHelper}配置项作为面板body内容（默认为 ''）。
     * 面板的afterRender方法负责HTML内容的加入这一过程，所以render事件触发的时刻document还没有所说的HTML内容。
     * 该部分的内容又比{@link #contentEl}的显示位置而居前。
     * An HTML fragment, or a {@link Ext.DomHelper DomHelper} specification to use
     * as the panel's body content (defaults to ''). The HTML content is added by the Panel's
     * afterRender method, and so the document will not contain this HTML at the time the render
     * event is fired. This content is inserted into the body <i>before</i> any configured
     * {@link #contentEl} is appended.
     */
    /**
     * @cfg {String} contentEl
     * 用现有HTML节点的内容作为面板body的内容（缺省为''）。
     * 面板的afterRender方法负责了此HTML元素的加入到面板body中去。
     * 该部分的内容又比{@link #html HTML}的显示位置而居后，所以render事件触发的时刻document还没有所说的HTML内容。
     * The id of an existing HTML node to use as the panel's body content (defaults to ''). 
     * specified Element is appended to the Panel's body Element by the Panel's afterRender method
     * <i>after any configured {@link #html HTML} has been inserted</i>, and so the document will
     * not contain this HTML at the time the render event is fired.
     */
    /**
     * @cfg {Object/Array} keys
     * KeyMap的配置项对象（格式形如:{@link Ext.KeyMap#addBinding}）。
     * 可用于将key分配到此面板（缺省为null）。
     * A KeyMap config object (in the format expected by {@link Ext.KeyMap#addBinding} used to assign custom key
     * handling to this panel (defaults to null).
     */
     /**
       * @cfg {Boolean} draggable
       * <p>True表示为激活此面板的拖动（默认为false）。
       * True to enable dragging of this Panel (defaults to false).</p>
       * <p>虽然Ext.Panel.DD是一个内部类并未归档的，但亦可自定义拖放（drag/drop）的实现，具体做法是传入一个Ext.Panel.DD的配置代替true值。
       * 它是{@link Ext.dd.DragSource}的子类，所以可在实现{@link Ext.dd.DragDrop}的接口方法的过程中加入具体行为：
       * For custom drag/drop implementations, an Ext.Panel.DD
       * config could also be passed in this config instead of true. Ext.Panel.DD is an internal,
       * undocumented class which moves a proxy Element around in place of the Panel's element, but
       * provides no other behaviour during dragging or on drop. It is a subclass of
       * {@link Ext.dd.DragSource}, so behaviour may be added by implementing the interface methods
       * of {@link Ext.dd.DragDrop} eg:
       * <pre><code>
new Ext.Panel({
    title: 'Drag me',
    x: 100,
    y: 100,
    renderTo: Ext.getBody(),
    floating: true,
    frame: true,
    width: 400,
    height: 200,
    draggable: {
//      类Ext.Panel.DD的配置。Config option of Ext.Panel.DD class.
//      如果是浮动的面板， 原始位置上不显示容器的代理元素。It's a floating Panel, so do not show a placeholder proxy in the original position.
        insertProxy: false,

//      当拖动DD对象时mousemove事件均会调用。Called for each mousemove event while dragging the DD object.
        onDrag : function(e){
//          记录拖动代理的x、y位置，好让Panel最终能定位。 Record the x,y position of the drag proxy so that we can
//          position the Panel at end of drag.
            var pel = this.proxy.getEl();
            this.x = pel.getLeft(true);
            this.y = pel.getTop(true);

//          出现投影的话一定保证其对其。Keep the Shadow aligned if there is one.
            var s = this.panel.getEl().shadow;
            if (s) {
                s.realign(this.x, this.y, pel.getWidth(), pel.getHeight());
            }
        },

//       mouseup事件触发时发生。Called on the mouseup event.
        endDrag : function(e){
            this.panel.setPosition(this.x, this.y);
        }
    }
}).show();
</code></pre>
     */
    /**
     * @cfg {String} tabTip
     * tooltip的innerHTML字符串（也可以html标签），当鼠标移至tab时会显示。
     * 这时Ext.Panel充当的角色是 Ext.TabPanel某一子面板。记得Ext.QuickTips.init()必须初始化好。
     * A string to be used as innerHTML (html tags are accepted) to show in a tooltip when mousing over the tab of
     * a Ext.Panel which is an item of a Ext.TabPanel. Ext.QuickTips.init() must be called in order for the tips to 
     * render.
     */
    /**
     * @cfg {Boolean} disabled
     * 渲染后就是禁用状态的（默认为false）。
     * 重要的信息就是设面板为disabled的话，IE很可能会不能将其正确地施加disabled的蒙板元素。
     * 如果你遇到这个问题，就要采用{@link afterlayout}事件来初始化disabled的状态：
     * Render this panel disabled (default is false). 
     * An important note when using the disabled config on panels is
     * that IE will often fail to initialize the disabled mask element correectly if the panel's layout has not yet 
     * completed by the time the Panel is disabled during the render process. If you experience this issue, you may 
     * need to instead use the {@link afterlayout} event to initialize the disabled state:
     * <pre><code>
new Ext.Panel({
    ...
    listeners: {
        'afterlayout': {
            fn: function(p){
                p.disable();
            },
            single: true // 关键~事因布局还会来 important, as many layouts can occur
        }
    }
});
</code></pre>
     */
    /**
     * @cfg {Boolean} autoHeight
     * True表示使用height:'auto'，否则采用固定的高度（默认为false）。
     * <b>注意</b>：设置autoHeight:true意味着面板自适应内容的高度，Ext就毫不施以管制。
     * 当一些需要尺寸管控的场合，如处于布局之中，这样的设置就会引起滚动条不能正常地工作的问题，这是因为面板的高度是取决于内容而不是布局上的要求。
     * True to use height:'auto', false to use fixed height (defaults to false). <b>Note</b>: 
     * Setting autoHeight:true means that the browser will manage the panel's height based on its contents, and that Ext will not manage it at 
     * all. If the panel is within a layout that manages dimensions (fit, border, etc.) then setting autoHeight:true
     * can cause issues with scrolling and will not generally work as expected since the panel will take on the height
     * of its contents rather than the height required by the Ext layout.
     */

    
    /**
    * @cfg {String} baseCls
    * 作用在面板元素上的CSS样式类 （默认为 'x-panel'）。
    * The base CSS class to apply to this panel's element (defaults to 'x-panel').
    */
    baseCls : 'x-panel',
    /**
    * @cfg {String} collapsedCls
    * 当面板闭合时，面板元素的CSS样式类 （默认为 'x-panel-collapsed'）。
    * A CSS class to add to the panel's element after it has been collapsed (defaults to 'x-panel-collapsed').
    */
    collapsedCls : 'x-panel-collapsed',
    /**
    * @cfg {Boolean} maskDisabled
    * True表示为当面板不可用时进行遮罩（默认为true）。
    * 当面板禁用时，总是会告知下面的元素亦要禁用，但遮罩是另外一种方式同样达到禁用的效果。
    * True to mask the panel when it is disabled, false to not mask it (defaults to true).  Either way, the panel
    * will always tell its contained elements to disable themselves when it is disabled, but masking the panel
    * can provide an additional visual cue that the panel is disabled.
    */
    maskDisabled: true,
    /**
    * @cfg {Boolean} animCollapse
    * True 表示为面板闭合过程附有动画效果（默认为true，在类 {@link Ext.Fx} 可用的情况下）。
    * True to animate the transition when the panel is collapsed, false to skip the animation (defaults to true
    * if the {@link Ext.Fx} class is available, otherwise false).
    */
    animCollapse: Ext.enableFx,
    /**
    * @cfg {Boolean} headerAsText
    * True表示为显示面板头部的标题（默认为 true）。
    * True to display the panel title in the header, false to hide it (defaults to true).
    */
    headerAsText: true,
    /**
    * @cfg {String} buttonAlign
    * 在此面板上的按钮的对齐方式,有效值是'right,' 'left' and 'center'（默认为 'right'）。 The alignment of any buttons added to this panel.  Valid values are 'right,' 'left' and 'center' (defaults to 'right').
    */
    buttonAlign: 'right',
    /**
     * @cfg {Boolean} collapsed
     * True 表示为渲染面板后即闭合（默认为false）。
     * True to render the panel collapsed, false to render it expanded (defaults to false).
     */
    collapsed : false,
    /**
    * @cfg {Boolean} collapseFirst
    * True 表示为展开/闭合的轮换按钮出现在面板头部的左方,false表示为在右方（默认为true）。
    * True to make sure the collapse/expand toggle button always renders first (to the left of) any other tools
    * in the panel's title bar, false to render it last (defaults to true).
    */
    collapseFirst: true,
    /**
     * @cfg {Number} minButtonWidth
     * 此面板上按钮的最小宽度（默认为75）。
     * Minimum width in pixels of all buttons in this panel (defaults to 75)
     */
    minButtonWidth:75,
    /**
     * @cfg {Boolean} unstyled
     * 不带样式渲染面板。
     * Renders the panel unstyled
     */
    /**
     * @cfg {String} elements
     * 面板渲染后，要初始化面板元素的列表，用逗号分隔开。
     * 正常情况下，该列表会在面板读取配置的时候就自动生成，假设没有进行配置，但结构元素有更新渲染的情况下，
     * 就可根据指值得知结构元素是否已渲染的（例如，你打算在面板完成渲染后动态加入按钮或工具条）。
     * 加入此列表中的这些元素后就在渲染好的面板中分配所需的载体（placeholders）。
     * 有效值是：
     * A comma-delimited list of panel elements to initialize when the panel is rendered.  Normally, this list will be
     * generated automatically based on the items added to the panel at config time, but sometimes it might be useful to
     * make sure a structural element is rendered even if not specified at config time (for example, you may want
     * to add a button or toolbar dynamically after the panel has been rendered).  Adding those elements to this
     * list will allocate the required placeholders in the panel when it is rendered.  Valid values are<ul>
     * <li><b>header</b></li>
     * <li><b>tbar</b> (top bar)</li>
     * <li><b>body</b></li>
     * <li><b>bbar</b> (bottom bar)</li>
     * <li><b>footer</b><li>
     * </ul>
     * 缺省为'body'. Defaults to 'body'.
     */
    elements : 'body',

    // protected - these could be used to customize the behavior of the window,
    // but changing them would not be useful without further mofifications and
    // could lead to unexpected or undesirable results.
    toolTarget : 'header',
    collapseEl : 'bwrap',
    slideAnchor : 't',
    disabledClass: '',

    // private, notify box this class will handle heights
    deferHeight: true,
    // private
    expandDefaults: {
        duration:.25
    },
    // private
    collapseDefaults: {
        duration:.25
    },

    // private
    initComponent : function(){
        Ext.Panel.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event bodyresize
             * 当面板的大小变化后触发。
             * Fires after the Panel has been resized.
             * @param {Ext.Panel} p 调节大小的面板。the Panel which has been resized.
             * @param {Number} width 面板新宽度。The Panel's new width.
             * @param {Number} height 面板新高度。The Panel's new height.
             */
            'bodyresize',
            /**
             * @event titlechange
             * 面板的标题有改动后触发。
             * Fires after the Panel title has been set or changed.
             * @param {Ext.Panel} p 标题被改动的那个面板。the Panel which has had its title changed.
             * @param {String} t 新标题。The new title.
             */
            'titlechange',
            /**
             * @event iconchange
             * 当面板的图标类设置了或改变了触发。
             * Fires after the Panel icon class has been set or changed.
             * @param {Ext.Panel} p 图标类被改动的那个面板。the Panel which has had its icon class changed.
             * @param {String} n 新图标类。The new icon class.
             * @param {String} o 旧图标类。The old icon class.
             */
            'iconchange',
            /**
             * @event collapse
             * 当面板被闭合后触发。
             * Fires after the Panel has been collapsed.
             * @param {Ext.Panel} p 闭合的那个面板。the Panel that has been collapsed.
             */
            'collapse',
            /**
             * @event expand
             * 当面板被展开后触发。
             * Fires after the Panel has been expanded.
             * @param {Ext.Panel} p 展开的面板。The Panel that has been expanded.
             */
            'expand',
            /**
             * @event beforecollapse
             * 当面板被闭合之前触发。若句柄返回false则取消闭合的动作。             
             * Fires before the Panel is collapsed.  A handler can return false to cancel the collapse.
             * @param {Ext.Panel} p 正被闭合的面板。the Panel being collapsed.
             * @param {Boolean} animate True表示闭合时带有动画效果。True if the collapse is animated, else false.
             */
            'beforecollapse',
            /**
             * @event beforeexpand
             * 当面板被展开之前触发。若句柄返回false则取消展开的动作。
             * Fires before the Panel is expanded.  A handler can return false to cancel the expand.
             * @param {Ext.Panel} p 正被展开的面板。The Panel being expanded.
             * @param {Boolean} animate True表示闭合时带有动画效果。True if the expand is animated, else false.
             */
            'beforeexpand',
            /**
             * @event beforeclose
             * 当面板被关闭之前触发。 
             * 注意面板不直接支持“关闭”，不过在面板的子类（如{@link Ext.Window}）可支持即可调用该事件。
             * 若句柄返回false则取消关闭的动作。
             * Fires before the Panel is closed.  Note that Panels do not directly support being closed, but some
             * Panel subclasses do (like {@link Ext.Window}).  This event only applies to such subclasses.
             * A handler can return false to cancel the close.
             * @param {Ext.Panel} p 正被关闭的面板。The Panel being closed.
             */
            'beforeclose',
            /**
             * @event close
             * 当面板被关闭后触发。 
             * 注意面板不直接支持“关闭”，不过在面板的子类（如{@link Ext.Window}）可支持即可调用该事件。
             * Fires after the Panel is closed.  Note that Panels do not directly support being closed, but some
             * Panel subclasses do (like {@link Ext.Window}).
             * @param {Ext.Panel} p 已关闭的面板。The Panel that has been closed.
             */
            'close',
            /**
             * @event activate
             * 当面板视觉上取消活动后触发。
             * 注意面板不直接支持“取消活动”，不过在面板的子类（如{@link Ext.Window}）可支持即可调用该事件。
             * 另外在TabPanel控制下子组件也会触发activate和deactivate事件。
             * Fires after the Panel has been visually activated.
             * Note that Panels do not directly support being activated, but some Panel subclasses
             * do (like {@link Ext.Window}). Panels which are child Components of a TabPanel fire the
             * activate and deactivate events under the control of the TabPanel.
             * @param {Ext.Panel} p 激活的面板。The Panel that has been activated.
             */
            'activate',
            /**
             * @event deactivate
             * 当面板视觉上“反激活”过后触发。
             * 注意面板不直接支持“反激活”，但面板某些子类就支持（如{@link Ext.Window}）。
             * TabPanel控制其子面板的激活与反激活事件。
             * Fires after the Panel has been visually deactivated.
             * Note that Panels do not directly support being deactivated, but some Panel subclasses
             * do (like {@link Ext.Window}). Panels which are child Components of a TabPanel fire the
             * activate and deactivate events under the control of the TabPanel.
             * @param {Ext.Panel} p 已反激活的面板。The Panel that has been deactivated.
             */
            'deactivate'
        );

        if(this.unstyled){
            this.baseCls = 'x-plain';
        }

        // shortcuts
        if(this.tbar){
            this.elements += ',tbar';
            if(typeof this.tbar == 'object'){
                this.topToolbar = this.tbar;
            }
            delete this.tbar;
        }
        if(this.bbar){
            this.elements += ',bbar';
            if(typeof this.bbar == 'object'){
                this.bottomToolbar = this.bbar;
            }
            delete this.bbar;
        }

        if(this.header === true){
            this.elements += ',header';
            delete this.header;
        }else if(this.title && this.header !== false){
            this.elements += ',header';
        }

        if(this.footer === true){
            this.elements += ',footer';
            delete this.footer;
        }

        if(this.buttons){
            this.elements += ',footer';
            var btns = this.buttons;
            /**
             * 面板的按钮组成的数组。只读的。
             * This Panel's Array of buttons as created from the <tt>buttons</tt>
             * config property. Read only.
             * @type Array
             * @property buttons
             */
            this.buttons = [];
            for(var i = 0, len = btns.length; i < len; i++) {
                if(btns[i].render){ // button instance
                    this.buttons.push(btns[i]);
                }else if(btns[i].xtype){
                    this.buttons.push(Ext.create(btns[i], 'button'));
                }else{
                    this.addButton(btns[i]);
                }
            }
        }
        if(this.fbar){
            this.elements += ',footer';
            // if default button align and using fbar, align left by default
            if(this.buttonAlign == 'right' && this.initialConfig.buttonAlign === undefined){
                this.buttonAlign = 'left';
            }
        }
        if(this.autoLoad){
            this.on('render', this.doAutoLoad, this, {delay:10});
        }
    },

    // private
    createElement : function(name, pnode){
        if(this[name]){
            pnode.appendChild(this[name].dom);
            return;
        }

        if(name === 'bwrap' || this.elements.indexOf(name) != -1){
            if(this[name+'Cfg']){
                this[name] = Ext.fly(pnode).createChild(this[name+'Cfg']);
            }else{
                var el = document.createElement('div');
                el.className = this[name+'Cls'];
                this[name] = Ext.get(pnode.appendChild(el));
            }
            if(this[name+'CssClass']){
                this[name].addClass(this[name+'CssClass']);
            }
            if(this[name+'Style']){
                this[name].applyStyles(this[name+'Style']);
            }
        }
    },

    // private
    onRender : function(ct, position){
        Ext.Panel.superclass.onRender.call(this, ct, position);
        this.createClasses();
        
        var el = this.el, d = el.dom;
        el.addClass(this.baseCls);
        if(d.firstChild){ // existing markup
            this.header = el.down('.'+this.headerCls);
            this.bwrap = el.down('.'+this.bwrapCls);
            var cp = this.bwrap ? this.bwrap : el;
            this.tbar = cp.down('.'+this.tbarCls);
            this.body = cp.down('.'+this.bodyCls);
            this.bbar = cp.down('.'+this.bbarCls);
            this.footer = cp.down('.'+this.footerCls);
            this.fromMarkup = true;
        }

        if(this.cls){
            el.addClass(this.cls);
        }

        if(this.buttons){
            this.elements += ',footer';
        }

        // This block allows for maximum flexibility and performance when using existing markup

        // framing requires special markup
        if(this.frame){
            el.insertHtml('afterBegin', String.format(Ext.Element.boxMarkup, this.baseCls));

            this.createElement('header', d.firstChild.firstChild.firstChild);
            this.createElement('bwrap', d);

            // append the mid and bottom frame to the bwrap
            var bw = this.bwrap.dom;
            var ml = d.childNodes[1], bl = d.childNodes[2];
            bw.appendChild(ml);
            bw.appendChild(bl);

            var mc = bw.firstChild.firstChild.firstChild;
            this.createElement('tbar', mc);
            this.createElement('body', mc);
            this.createElement('bbar', mc);
            this.createElement('footer', bw.lastChild.firstChild.firstChild);

            if(!this.footer){
                this.bwrap.dom.lastChild.className += ' x-panel-nofooter';
            }
        }else{
            this.createElement('header', d);
            this.createElement('bwrap', d);

            // append the mid and bottom frame to the bwrap
            var bw = this.bwrap.dom;
            this.createElement('tbar', bw);
            this.createElement('body', bw);
            this.createElement('bbar', bw);
            this.createElement('footer', bw);

            if(!this.header){
                this.body.addClass(this.bodyCls + '-noheader');
                if(this.tbar){
                    this.tbar.addClass(this.tbarCls + '-noheader');
                }
            }
        }

        if(this.padding !== undefined) {
            this.body.setStyle('padding', this.body.addUnits(this.padding));
        }

        if(this.border === false){
            this.el.addClass(this.baseCls + '-noborder');
            this.body.addClass(this.bodyCls + '-noborder');
            if(this.header){
                this.header.addClass(this.headerCls + '-noborder');
            }
            if(this.footer){
                this.footer.addClass(this.footerCls + '-noborder');
            }
            if(this.tbar){
                this.tbar.addClass(this.tbarCls + '-noborder');
            }
            if(this.bbar){
                this.bbar.addClass(this.bbarCls + '-noborder');
            }
        }

        if(this.bodyBorder === false){
           this.body.addClass(this.bodyCls + '-noborder');
        }

        this.bwrap.enableDisplayMode('block');

        if(this.header){
            this.header.unselectable();

            // for tools, we need to wrap any existing header markup
            if(this.headerAsText){
                this.header.dom.innerHTML =
                    '<span class="' + this.headerTextCls + '">'+this.header.dom.innerHTML+'</span>';

                if(this.iconCls){
                    this.setIconClass(this.iconCls);
                }
            }
        }

        if(this.floating){
            this.makeFloating(this.floating);
        }

        if(this.collapsible){
            this.tools = this.tools ? this.tools.slice(0) : [];
            if(!this.hideCollapseTool){
                this.tools[this.collapseFirst?'unshift':'push']({
                    id: 'toggle',
                    handler : this.toggleCollapse,
                    scope: this
                });
            }
            if(this.titleCollapse && this.header){
            	this.mon(this.header, 'click', this.toggleCollapse, this);
                this.header.setStyle('cursor', 'pointer');
            }
        }
        if(this.tools){
            var ts = this.tools;
            this.tools = {};
            this.addTool.apply(this, ts);
        }else{
            this.tools = {};
        }

        if(this.buttons && this.buttons.length > 0){
            this.fbar = new Ext.Toolbar({
                items: this.buttons,
                toolbarCls: 'x-panel-fbar'
            });
        }
        if(this.fbar){
            this.fbar = Ext.create(this.fbar, 'toolbar');
            this.fbar.enableOverflow = false;
            if(this.fbar.items){
                this.fbar.items.each(function(c){
                    c.minWidth = this.minButtonWidth;
                }, this);
            }
            this.fbar.toolbarCls = 'x-panel-fbar';

            var bct = this.footer.createChild({cls: 'x-panel-btns x-panel-btns-'+this.buttonAlign});
            this.fbar.ownerCt = this;
            this.fbar.render(bct);
            bct.createChild({cls:'x-clear'});
        }

        if(this.tbar && this.topToolbar){
            if(Ext.isArray(this.topToolbar)){
                this.topToolbar = new Ext.Toolbar(this.topToolbar);
            }else if(!this.topToolbar.events){
                this.topToolbar = Ext.create(this.topToolbar, 'toolbar');
            }
            this.topToolbar.ownerCt = this;
            this.topToolbar.render(this.tbar);
        }
        if(this.bbar && this.bottomToolbar){
            if(Ext.isArray(this.bottomToolbar)){
                this.bottomToolbar = new Ext.Toolbar(this.bottomToolbar);
            }else if(!this.bottomToolbar.events){
                this.bottomToolbar = Ext.create(this.bottomToolbar, 'toolbar');
            }
            this.bottomToolbar.ownerCt = this;
            this.bottomToolbar.render(this.bbar);
        }
    },

    /**
     * 为该面板设置图标的样式类。此方法会覆盖当前现有的图标。
     * Sets the CSS class that provides the icon image for this panel.  This method will replace any existing
     * icon class if one has already been set.
     * @param {String} cls 新CSS样式类的名称。The new CSS class name
     */
    setIconClass : function(cls){
        var old = this.iconCls;
        this.iconCls = cls;
        if(this.rendered && this.header){
            if(this.frame){
                this.header.addClass('x-panel-icon');
                this.header.replaceClass(old, this.iconCls);
            }else{
                var hd = this.header.dom;
                var img = hd.firstChild && String(hd.firstChild.tagName).toLowerCase() == 'img' ? hd.firstChild : null;
                if(img){
                    Ext.fly(img).replaceClass(old, this.iconCls);
                }else{
                    Ext.DomHelper.insertBefore(hd.firstChild, {
                        tag:'img', src: Ext.BLANK_IMAGE_URL, cls:'x-panel-inline-icon '+this.iconCls
                    });
                 }
            }
        }
        this.fireEvent('iconchange', this, cls, old);
    },

    // private
    makeFloating : function(cfg){
        this.floating = true;
        this.el = new Ext.Layer(
            typeof cfg == 'object' ? cfg : {
                shadow: this.shadow !== undefined ? this.shadow : 'sides',
                shadowOffset: this.shadowOffset,
                constrain:false,
                shim: this.shim === false ? false : undefined
            }, this.el
        );
    },

    /**
     * 返回面板顶部区域的工具条。
     * Returns the toolbar from the top (tbar) section of the panel.
     * @return {Ext.Toolbar} The toolbar对象
     */
    getTopToolbar : function(){
        return this.topToolbar;
    },

    /**
     * 返回面板底部区域的工具条。
     * Returns the toolbar from the bottom (bbar) section of the panel.
     * @return {Ext.Toolbar} The toolbar对象
     */
    getBottomToolbar : function(){
        return this.bottomToolbar;
    },

    /**
     * 为面板添加按钮。注意必须在渲染之前才可以调用该方法。最佳的方法是通过{@link #buttons}的配置项添加按钮。
     * Adds a button to this panel.  Note that this method must be called prior to rendering.  The preferred
     * approach is to add buttons via the {@link #buttons} config.
     * @param {String/Object} config 合法的{@link Ext.Button}配置项对象。若字符类型就表示这是按钮的提示文字。
     * A valid {@link Ext.Button} config.  A string will become the text for a default
     * button config, an object will be treated as a button config object.
     * @param {Function} handler 按钮被按下时执行的函数，等同{@link Ext.Button#click}。The function to be called on button {@link Ext.Button#click}
     * @param {Object} scope 按钮触发时的事件处理函数所在作用域。The scope to use for the button handler function
     * @return {Ext.Button} 已添加的按钮。The button that was added
     */
    addButton : function(config, handler, scope){
        var bc = {
            handler: handler,
            scope: scope,
            minWidth: this.minButtonWidth,
            hideParent:true
        };
        if(typeof config == "string"){
            bc.text = config;
        }else{
            Ext.apply(bc, config);
        }
        var btn = new Ext.Button(bc);
        if(!this.buttons){
            this.buttons = [];
        }
        this.buttons.push(btn);
        return btn;
    },

    // private
    addTool : function(){
        if(!this[this.toolTarget]) { // 没有渲染tools的地方！no where to render tools!
            return;
        }
        if(!this.toolTemplate){
            // 头一次执行时，就生成可供以后使用的tool模板（全局的，见Ext.Panel.prototype.toolTemplate = tt;这句） 
        	// initialize the global tool template on first use
            var tt = new Ext.Template(
                 '<div class="x-tool x-tool-{id}">&#160;</div>'
            );
            tt.disableFormats = true;
            tt.compile();
            Ext.Panel.prototype.toolTemplate = tt;
        }
        for(var i = 0, a = arguments, len = a.length; i < len; i++) {
            var tc = a[i];
            if(!this.tools[tc.id]){
                var overCls = 'x-tool-'+tc.id+'-over';
                var t = this.toolTemplate.insertFirst((tc.align !== 'left') ? this[this.toolTarget] : this[this.toolTarget].child('span'), tc, true);
                this.tools[tc.id] = t;
                t.enableDisplayMode('block');
                this.mon(t, 'click',  this.createToolHandler(t, tc, overCls, this));
                if(tc.on){
                    this.mon(t, tc.on);
                }
                if(tc.hidden){
                    t.hide();
                }
                if(tc.qtip){
                    if(typeof tc.qtip == 'object'){
                        Ext.QuickTips.register(Ext.apply({
                              target: t.id
                        }, tc.qtip));
                    } else {
                        t.dom.qtip = tc.qtip;
                    }
                }
                t.addClassOnOver(overCls);
            }
        }
    },

    doLayout : function(shallow){
        Ext.Panel.superclass.doLayout.call(this, shallow);
        if(this.topToolbar){
            this.topToolbar.doLayout();
        }
        if(this.bottomToolbar){
            this.bottomToolbar.doLayout();
        }
        if(this.fbar){
            this.fbar.doLayout();
        }
        return this;
    },

    // private
    onShow : function(){
        if(this.floating){
            return this.el.show();
        }
        Ext.Panel.superclass.onShow.call(this);
    },

    // private
    onHide : function(){
        if(this.floating){
            return this.el.hide();
        }
        Ext.Panel.superclass.onHide.call(this);
    },

    // private
    createToolHandler : function(t, tc, overCls, panel){
        return function(e){
            t.removeClass(overCls);
			if(tc.stopEvent !== false){
				e.stopEvent();
			}            
            if(tc.handler){
                tc.handler.call(tc.scope || t, e, t, panel, tc);
            }
        };
    },

    // private
    afterRender : function(){
        if(this.floating && !this.hidden && !this.initHidden){
            this.el.show();
        }
        if(this.title){
            this.setTitle(this.title);
        }
        this.setAutoScroll();
        if(this.html){
            this.body.update(typeof this.html == 'object' ?
                             Ext.DomHelper.markup(this.html) :
                             this.html);
            delete this.html;
        }
        if(this.contentEl){
            var ce = Ext.getDom(this.contentEl);
            Ext.fly(ce).removeClass(['x-hidden', 'x-hide-display']);
            this.body.dom.appendChild(ce);
        }
        if(this.collapsed){
            this.collapsed = false;
            this.collapse(false);
        }
        Ext.Panel.superclass.afterRender.call(this); // do sizing calcs last
        this.initEvents();
    },

    // private
    setAutoScroll : function(){
        if(this.rendered && this.autoScroll){
            var el = this.body || this.el;
            if(el){
                el.setOverflow('auto');
            }
        }
    },

    // private
    getKeyMap : function(){
        if(!this.keyMap){
            this.keyMap = new Ext.KeyMap(this.el, this.keys);
        }
        return this.keyMap;
    },

    // private
    initEvents : function(){
        if(this.keys){
            this.getKeyMap();
        }
        if(this.draggable){
            this.initDraggable();
        }
    },

    // private
    initDraggable : function(){
        /**
         * <p>如果面板的{@link #draggable}的配置被打开，那么该属性的值就是一个{@link Ext.dd.DragSource}实例，代表着是谁负责拖动该面板。
         * If this Panel is configured {@link #draggable}, this property will contain
         * an instance of {@link Ext.dd.DragSource} which handles dragging the Panel.</p>
         * 为了定位拖放过程中的每一个阶段，开发人员必须提供抽象方法{@link Ext.dd.DragSource}的一个实作。请参阅{@link #draggable}。
         * The developer must provide implementations of the abstract methods of {@link Ext.dd.DragSource}
         * in order to supply behaviour for each stage of the drag/drop process. See {@link #draggable}.
         * @type Ext.dd.DragSource.
         * @property dd
         */
        this.dd = new Ext.Panel.DD(this, typeof this.draggable == 'boolean' ? null : this.draggable);
    },

    // private
    beforeEffect : function(){
        if(this.floating){
            this.el.beforeAction();
        }
        this.el.addClass('x-panel-animated');
    },

    // private
    afterEffect : function(){
        this.syncShadow();
        this.el.removeClass('x-panel-animated');
    },

    // private - 封装一下动画效果 wraps up an animation param with internal callbacks
    createEffect : function(a, cb, scope){
        var o = {
            scope:scope,
            block:true
        };
        if(a === true){
            o.callback = cb;
            return o;
        }else if(!a.callback){
            o.callback = cb;
        }else { // wrap it up
            o.callback = function(){
                cb.call(scope);
                Ext.callback(a.callback, a.scope);
            };
        }
        return Ext.applyIf(o, a);
    },

    /**
     * 闭合面板body隐藏其内容。
     * 触发{@link #beforecollapse}事件，如返回false则取消展开的动作。
     * Collapses the panel body so that it becomes hidden.  Fires the {@link #beforecollapse} event which will
     * cancel the collapse action if it returns false.
     * @param {Boolean} animate True表示为转换状态时出现动画，（默认为面板{@link #animCollapse}的配置值）。
     * True to animate the transition, else false (defaults to the value of the
     *  {@link #animCollapse} panel config)
     * @return {Ext.Panel} this
     */
    collapse : function(animate){
        if(this.collapsed || this.el.hasFxBlock() || this.fireEvent('beforecollapse', this, animate) === false){
            return;
        }
        var doAnim = animate === true || (animate !== false && this.animCollapse);
        this.beforeEffect();
        this.onCollapse(doAnim, animate);
        return this;
    },

    // private
    onCollapse : function(doAnim, animArg){
        if(doAnim){
            this[this.collapseEl].slideOut(this.slideAnchor,
                    Ext.apply(this.createEffect(animArg||true, this.afterCollapse, this),
                        this.collapseDefaults));
        }else{
            this[this.collapseEl].hide();
            this.afterCollapse();
        }
    },

    // private
    afterCollapse : function(){
        this.collapsed = true;
        this.el.addClass(this.collapsedCls);
        this.afterEffect();
        this.fireEvent('collapse', this);
    },

    /**
     * 展开面板的主体部分，显示全部。这会触发{@link #beforeexpand}的事件，若事件处理函数返回false那么这个方法将失效。
     * Expands the panel body so that it becomes visible.  Fires the {@link #beforeexpand} event which will
     * cancel the expand action if it returns false.
     * @param {Boolean} animate True 表示为转换状态时出现动画（默认为面板{@link #animCollapse}的配置值）。True to animate the transition, else false (defaults to the value of the
     * {@link #animCollapse} panel config)
     * @return {Ext.Panel} this
     */
    expand : function(animate){
        if(!this.collapsed || this.el.hasFxBlock() || this.fireEvent('beforeexpand', this, animate) === false){
            return;
        }
        var doAnim = animate === true || (animate !== false && this.animCollapse);
        this.el.removeClass(this.collapsedCls);
        this.beforeEffect();
        this.onExpand(doAnim, animate);
        return this;
    },

    // private
    onExpand : function(doAnim, animArg){
        if(doAnim){
            this[this.collapseEl].slideIn(this.slideAnchor,
                    Ext.apply(this.createEffect(animArg||true, this.afterExpand, this),
                        this.expandDefaults));
        }else{
            this[this.collapseEl].show();
            this.afterExpand();
        }
    },

    // private
    afterExpand : function(){
        this.collapsed = false;
        this.afterEffect();
        this.fireEvent('expand', this);
    },

    /**
     * 根据面板的当前状态，采取相应的{@link #expand}或{@link #collapse}。
     * Shortcut for performing an {@link #expand} or {@link #collapse} based on the current state of the panel.
     * @param {Boolean} animate True 表示为转换状态时出现动画（默认为面板{@link #animCollapse}的配置值）。True to animate the transition, else false (defaults to the value of the
     * {@link #animCollapse} panel config)
     * @return {Ext.Panel} this
     */
    toggleCollapse : function(animate){
        this[this.collapsed ? 'expand' : 'collapse'](animate);
        return this;
    },

    // private
    onDisable : function(){
        if(this.rendered && this.maskDisabled){
            this.el.mask();
        }
        Ext.Panel.superclass.onDisable.call(this);
    },

    // private
    onEnable : function(){
        if(this.rendered && this.maskDisabled){
            this.el.unmask();
        }
        Ext.Panel.superclass.onEnable.call(this);
    },

    // private
    onResize : function(w, h){
        if(w !== undefined || h !== undefined){
            if(!this.collapsed){
                if(typeof w == 'number'){
					w = this.adjustBodyWidth(w - this.getFrameWidth());
                    if(this.tbar){
	                    this.tbar.setWidth(w);
	                    if(this.topToolbar){
	                        this.topToolbar.setSize(w);
	                    }
	                }
					if(this.bbar){
	                    this.bbar.setWidth(w);
	                    if(this.bottomToolbar){
	                        this.bottomToolbar.setSize(w);
	                    }
	                }
					if(this.fbar && this.buttonAlign != 'center'){
	                    this.fbar.setSize(w - this.fbar.container.getFrameWidth('lr'));
	                }
                    this.body.setWidth(w);
                }else if(w == 'auto'){
                    this.body.setWidth(w);
                }

                if(typeof h == 'number'){
                    h = this.adjustBodyHeight(h - this.getFrameHeight());
				    this.body.setHeight(h);
                }else if(h == 'auto'){
                    this.body.setHeight(h);
                }

                if(this.disabled && this.el._mask){
                    this.el._mask.setSize(this.el.dom.clientWidth, this.el.getHeight());
                }
            }else{
                this.queuedBodySize = {width: w, height: h};
                if(!this.queuedExpand && this.allowQueuedExpand !== false){
                    this.queuedExpand = true;
                    this.on('expand', function(){
                        delete this.queuedExpand;
                        this.onResize(this.queuedBodySize.width, this.queuedBodySize.height);
                        this.doLayout();
                    }, this, {single:true});
                }
            }
            this.fireEvent('bodyresize', this, w, h);
        }
        this.syncShadow();
    },

    // private
    adjustBodyHeight : function(h){
        return h;
    },

    // private
    adjustBodyWidth : function(w){
        return w;
    },

    // private
    onPosition : function(){
        this.syncShadow();
    },

    /**
     * 返回面板框架元素的宽度（不含body宽度）要取的body宽度参阅{@link #getInnerWidth}。
     * Returns the width in pixels of the framing elements of this panel (not including the body width).  To
     * retrieve the body width see {@link #getInnerWidth}.
     * @return {Number}  框架宽度。The frame width
     */
    getFrameWidth : function(){
        var w = this.el.getFrameWidth('lr')+this.bwrap.getFrameWidth('lr');

        if(this.frame){
            var l = this.bwrap.dom.firstChild;
            w += (Ext.fly(l).getFrameWidth('l') + Ext.fly(l.firstChild).getFrameWidth('r'));
            var mc = this.bwrap.dom.firstChild.firstChild.firstChild;
            w += Ext.fly(mc).getFrameWidth('lr');
        }
        return w;
    },

    /**
     * 返回面板框架元素的高度（包括顶部/底部工具条的高度）要取的body高度参阅{@link #getInnerHeight}。 
     * Returns the height in pixels of the framing elements of this panel (including any top and bottom bars and
     * header and footer elements, but not including the body height).  To retrieve the body height see {@link #getInnerHeight}.
     * @return {Number} 框架高度。The frame height
     */
    getFrameHeight : function(){
        var h  = this.el.getFrameWidth('tb')+this.bwrap.getFrameWidth('tb');
        h += (this.tbar ? this.tbar.getHeight() : 0) +
             (this.bbar ? this.bbar.getHeight() : 0);

        if(this.frame){
            var hd = this.el.dom.firstChild;
            var ft = this.bwrap.dom.lastChild;
            h += (hd.offsetHeight + ft.offsetHeight);
            var mc = this.bwrap.dom.firstChild.firstChild.firstChild;
            h += Ext.fly(mc).getFrameWidth('tb');
        }else{
            h += (this.header ? this.header.getHeight() : 0) +
                (this.footer ? this.footer.getHeight() : 0);
        }
        return h;
    },

    /**
     * 返回面板body元素的宽度（不含任何框架元素）要取的框架宽度参阅 {@link #getFrameWidth}。
     * Returns the width in pixels of the body element (not including the width of any framing elements).
     * For the frame width see {@link #getFrameWidth}.
     * @return {Number} 宽度。The body width
     */
    getInnerWidth : function(){
        return this.getSize().width - this.getFrameWidth();
    },

    /**
     * 返回面板body元素的高度（不包括任何框架元素的高度）要取的框架高度参阅{@link #getFrameHeight}。
     * Returns the height in pixels of the body element (not including the height of any framing elements).
     * For the frame height see {@link #getFrameHeight}.
     * @return {Number} 高度。The body height
     */
    getInnerHeight : function(){
        return this.getSize().height - this.getFrameHeight();
    },

    // private
    syncShadow : function(){
        if(this.floating){
            this.el.sync(true);
        }
    },

    // private
    getLayoutTarget : function(){
        return this.body;
    },

    /**
     * <p>
     * 设置面板的标题文本，你也可以在这里指定面板的图片（透过CSS样式类）。
     * Sets the title text for the panel and optionally the icon class.</p>
     * <p>
     * 为了确保标题能被设置，一个面板的头部元素必不可少。具体说，是要让面板的标题非空，或者设置<tt><b>{@link #header}: true</b></tt>即可。 
     * In order to be able to set the title, a header element must have been created
     * for the Panel. This is triggered either by configuring the Panel with a non-blank title,
     * or configuring it with <tt><b>{@link #header}: true</b></tt>.</p>
     * @param {String} title 要设置的标题。The title text to set
     * @param {String} iconCls （可选的）定义该面板用户自定义的图标，这是一个CSS样式类的字符串。(optional)A user-defined CSS class that provides the icon image for this panel
     */
    setTitle : function(title, iconCls){
        this.title = title;
        if(this.header && this.headerAsText){
            this.header.child('span').update(title);
        }
        if(iconCls){
            this.setIconClass(iconCls);
        }
        this.fireEvent('titlechange', this, title);
        return this;
    },

    /**
     * 获取该面板的{@link Ext.Updater}。主要是为面板的主体部分（body）提过面向Ajax的内容更新。
     * Get the {@link Ext.Updater} for this panel. Enables you to perform Ajax updates of this panel's body.
     * @return {Ext.Updater}对象。The Updater 
     */
    getUpdater : function(){
        return this.body.getUpdater();
    },

     /**
     * 利用XHR的访问加载远程的内容，立即显示在面板中。
     * Loads this content panel immediately with content returned from an XHR call.
     * @param {Object/String/Function} config 特定的配置项对象，可包含以下选项： A config object containing any of the following options:
<pre><code>
panel.load({
    url: "your-url.php",
    params: {param1: "foo", param2: "bar"}, // 或URL字符串，要已编码的。or a URL encoded string
    callback: yourFunction,
    scope: yourObject, // 回调函数的可选作用域 optional scope for the callback
    discardUrl: false,
    nocache: false,
    text: "Loading...",
    timeout: 30,
    scripts: false
});
</code></pre>
     * 其中必填的属性是url。至于可选的属性有nocache、text与scripts，分别代表禁止缓存（disableCaching）、加载中的提示信息和是否对脚本敏感，都是关联到面板的Updater实例。
     * The only required property is url. The optional properties nocache, text and scripts
     * are shorthand for disableCaching, indicatorText and loadScripts and are used to set their
     * associated property on this panel Updater instance.
     * @return {Ext.Panel} this
     */
    load : function(){
        var um = this.body.getUpdater();
        um.update.apply(um, arguments);
        return this;
    },

    // private
    beforeDestroy : function(){
        if(this.header){
            this.header.removeAllListeners();
            if(this.headerAsText){
                Ext.Element.uncache(this.header.child('span'));
            }
        }
        Ext.Element.uncache(
            this.header,
            this.tbar,
            this.bbar,
            this.footer,
            this.body,
            this.bwrap
        );
        if(this.tools){
            for(var k in this.tools){
                Ext.destroy(this.tools[k]);
            }
        }
        if(this.buttons){
            for(var b in this.buttons){
                Ext.destroy(this.buttons[b]);
            }
        }
        Ext.destroy(
            this.topToolbar,
            this.bottomToolbar,
            this.fbar
        );
        Ext.Panel.superclass.beforeDestroy.call(this);
    },

    // private
    createClasses : function(){
        this.headerCls = this.baseCls + '-header';
        this.headerTextCls = this.baseCls + '-header-text';
        this.bwrapCls = this.baseCls + '-bwrap';
        this.tbarCls = this.baseCls + '-tbar';
        this.bodyCls = this.baseCls + '-body';
        this.bbarCls = this.baseCls + '-bbar';
        this.footerCls = this.baseCls + '-footer';
    },

    // private
    createGhost : function(cls, useShim, appendTo){
        var el = document.createElement('div');
        el.className = 'x-panel-ghost ' + (cls ? cls : '');
        if(this.header){
            el.appendChild(this.el.dom.firstChild.cloneNode(true));
        }
        Ext.fly(el.appendChild(document.createElement('ul'))).setHeight(this.bwrap.getHeight());
        el.style.width = this.el.dom.offsetWidth + 'px';;
        if(!appendTo){
            this.container.dom.appendChild(el);
        }else{
            Ext.getDom(appendTo).appendChild(el);
        }
        if(useShim !== false && this.el.useShim !== false){
            var layer = new Ext.Layer({shadow:false, useDisplay:true, constrain:false}, el);
            layer.show();
            return layer;
        }else{
            return new Ext.Element(el);
        }
    },

    // private
    doAutoLoad : function(){
        var u = this.body.getUpdater();
        if(this.renderer){
            u.setRenderer(this.renderer);
        }
        u.update(typeof this.autoLoad == 'object' ? this.autoLoad : {url: this.autoLoad});
    },
    
    /**
     * 获取某个工具项的id。
     * Retrieve a tool by id.
     * @param {String} id
     * @return {Object} tool
     */
    getTool: function(id) {
        return this.tools[id];
    }

/**
 * @cfg {String} autoEl @hide
 */
});
Ext.reg('panel', Ext.Panel);
