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
 * @class Ext.MessageBox
 * <p>用来生成不同样式的消息框的实用类。还可以使用它的别名Ext.Msg。
 * Utility class for generating different styles of message boxes.  The alias Ext.Msg can also be used.<p/>
 * <p>需要注意的是 MessageBox 对象是异步的。不同于 JavaScript中原生的<code>alert</code>（它会暂停浏览器的执行），显示 MessageBox 不会中断代码的运行。
 * 由于这个原因，如果你的代码需要在用户对 MessageBox 做出反馈<em>之后</em>执行，则必须用到回调函数（详情可见{@link #show}方法中的<code>function</code>参数）。
 * Note that the MessageBox is asynchronous.  Unlike a regular JavaScript <code>alert</code> (which will halt
 * browser execution), showing a MessageBox will not cause the code to stop.  For this reason, if you have code
 * that should only run <em>after</em> some user feedback from the MessageBox, you must use a callback function
 * (see the <code>function</code> parameter for {@link #show} for more details).</p>
 * <p>用法示例：Example usage:</p>
 *<pre><code>
// 基本的通知： Basic alert:
Ext.Msg.alert('Status', 'Changes saved successfully.');

// 提示用户输入数据并使用回调方法进得处理： Prompt for user data and process the result using a callback:
Ext.Msg.prompt('Name', 'Please enter your name:', function(btn, text){
    if (btn == 'ok'){
        // process text value and close...
    }
});

// 显示一个使用配置选项的对话框： Show a dialog using config options:
Ext.Msg.show({
   title:'Save Changes?',
   msg: 'You are closing a tab that has unsaved changes. Would you like to save your changes?',
   buttons: Ext.Msg.YESNOCANCEL,
   fn: processResult,
   animEl: 'elId',
   icon: Ext.MessageBox.QUESTION
});
</code></pre>
 * @singleton
 */
Ext.MessageBox = function(){
    var dlg, opt, mask, waitTimer;
    var bodyEl, msgEl, textboxEl, textareaEl, progressBar, pp, iconEl, spacerEl;
    var buttons, activeTextEl, bwidth, iconCls = '';

    // private
    var handleButton = function(button){
        if(dlg.isVisible()){
            dlg.hide();
            Ext.callback(opt.fn, opt.scope||window, [button, activeTextEl.dom.value, opt], 1);
        }
    };

    // private
    var handleHide = function(){
        if(opt && opt.cls){
            dlg.el.removeClass(opt.cls);
        }
        progressBar.reset();
    };

    // private
    var handleEsc = function(d, k, e){
        if(opt && opt.closable !== false){
            dlg.hide();
        }
        if(e){
            e.stopEvent();
        }
    };

    // private
    var updateButtons = function(b){
        var width = 0;
        if(!b){
            buttons["ok"].hide();
            buttons["cancel"].hide();
            buttons["yes"].hide();
            buttons["no"].hide();
            return width;
        }
        dlg.footer.dom.style.display = '';
        for(var k in buttons){
            if(typeof buttons[k] != "function"){
                if(b[k]){
                    buttons[k].show();
                    buttons[k].setText(typeof b[k] == "string" ? b[k] : Ext.MessageBox.buttonText[k]);
                    width += buttons[k].el.getWidth()+15;
                }else{
                    buttons[k].hide();
                }
            }
        }
        return width;
    };

    return {
        /**
         * 返回{@link Ext.Window}对象的元素的引用。
         * Returns a reference to the underlying {@link Ext.Window} element
         * @return {Ext.Window} The window 对象
         */
        getDialog : function(titleText){
           if(!dlg){
                dlg = new Ext.Window({
                    autoCreate : true,
                    title:titleText,
                    resizable:false,
                    constrain:true,
                    constrainHeader:true,
                    minimizable : false,
                    maximizable : false,
                    stateful: false,
                    modal: true,
                    shim:true,
                    buttonAlign:"center",
                    width:400,
                    height:100,
                    minHeight: 80,
                    plain:true,
                    footer:true,
                    closable:true,
                    close : function(){
                        if(opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel){
                            handleButton("no");
                        }else{
                            handleButton("cancel");
                        }
                    }
                });
                buttons = {};
                var bt = this.buttonText;
                //TODO: refactor this block into a buttons config to pass into the Window constructor
                buttons["ok"] = dlg.addButton(bt["ok"], handleButton.createCallback("ok"));
                buttons["yes"] = dlg.addButton(bt["yes"], handleButton.createCallback("yes"));
                buttons["no"] = dlg.addButton(bt["no"], handleButton.createCallback("no"));
                buttons["cancel"] = dlg.addButton(bt["cancel"], handleButton.createCallback("cancel"));
                buttons["ok"].hideMode = buttons["yes"].hideMode = buttons["no"].hideMode = buttons["cancel"].hideMode = 'offsets';
                dlg.render(document.body);
                dlg.getEl().addClass('x-window-dlg');
                mask = dlg.mask;
                bodyEl = dlg.body.createChild({
                    html:'<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"><input type="text" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea></div></div>'
                });
                iconEl = Ext.get(bodyEl.dom.firstChild);
                var contentEl = bodyEl.dom.childNodes[1];
                msgEl = Ext.get(contentEl.firstChild);
                textboxEl = Ext.get(contentEl.childNodes[2].firstChild);
                textboxEl.enableDisplayMode();
                textboxEl.addKeyListener([10,13], function(){
                    if(dlg.isVisible() && opt && opt.buttons){
                        if(opt.buttons.ok){
                            handleButton("ok");
                        }else if(opt.buttons.yes){
                            handleButton("yes");
                        }
                    }
                });
                textareaEl = Ext.get(contentEl.childNodes[2].childNodes[1]);
                textareaEl.enableDisplayMode();
                progressBar = new Ext.ProgressBar({
                    renderTo:bodyEl
                });
               bodyEl.createChild({cls:'x-clear'});
            }
            return dlg;
        },

        /**
         * 更新消息框中body元素的文本。
         * Updates the message box body text
         * @param {String} text （可选）使用指定的文本替换消息框中元素的 innerHTML （默认为XHTML兼容的非换行空格字符 '&amp;#160;'）。(optional) Replaces the message box element's innerHTML with the specified string (defaults to
         * the XHTML-compliant non-breaking space character '&amp;#160;')
         * @return {Ext.MessageBox} this
         */
        updateText : function(text){
            if(!dlg.isVisible() && !opt.width){
                dlg.setSize(this.maxWidth, 100); // resize first so content is never clipped from previous shows
            }
            msgEl.update(text || '&#160;');

            var iw = iconCls != '' ? (iconEl.getWidth() + iconEl.getMargins('lr')) : 0;
            var mw = msgEl.getWidth() + msgEl.getMargins('lr');
            var fw = dlg.getFrameWidth('lr');
            var bw = dlg.body.getFrameWidth('lr');
            if (Ext.isIE && iw > 0){
                //3 pixels get subtracted in the icon CSS for an IE margin issue,
                //so we have to add it back here for the overall width to be consistent
                iw += 3;
            }
            var w = Math.max(Math.min(opt.width || iw+mw+fw+bw, this.maxWidth),
                        Math.max(opt.minWidth || this.minWidth, bwidth || 0));

            if(opt.prompt === true){
                activeTextEl.setWidth(w-iw-fw-bw);
            }
            if(opt.progress === true || opt.wait === true){
                progressBar.setSize(w-iw-fw-bw);
            }
            if(Ext.isIE && w == bwidth){
                w += 4; //Add offset when the content width is smaller than the buttons.    
            }
            dlg.setSize(w, 'auto').center();
            return this;
        },

        /**
         * 更新带有进度条的消息框中的文本和进度条。
         * 仅仅是由通过 {@link Ext.MessageBox#progress}方法或者是在调用{@link Ext.MessageBox#show}方法时使用参数progress: true显示的消息框中可用。
         * Updates a progress-style message box's text and progress bar. Only relevant on message boxes
         * initiated via {@link Ext.MessageBox#progress} or {@link Ext.MessageBox#wait},
         * or by calling {@link Ext.MessageBox#show} with progress: true.
         * @param {Number} value 0 到 1 之间的任意数字（例如： .5，默认为 0）。Any number between 0 and 1 (e.g., .5, defaults to 0)
         * @param {String} progressText 进度条中显示的文本（默认为 ''）。The progress text to display inside the progress bar (defaults to '')
         * @param {String} msg 用于替换消息框中 body 元素内容的文本（默认为 undefined，因此如果没有指定该参数则 body 中任何现存的文本将不会被覆写）。The message box's body text is replaced with the specified string (defaults to undefined
         * so that any existing body text will not get overwritten by default unless a new value is passed in)
         * @return {Ext.MessageBox} this
         */
        updateProgress : function(value, progressText, msg){
            progressBar.updateProgress(value, progressText);
            if(msg){
                this.updateText(msg);
            }
            return this;
        },

        /**
         * 如果消息框当前可见则返回true。
         * Returns true if the message box is currently displayed
         * @return {Boolean} 如果消息框当前可见则返回 true，否则返回 false。True if the message box is visible, else false
         */
        isVisible : function(){
            return dlg && dlg.isVisible();
        },

        /**
         * 如果消息框当前可见则返回true，否则返回false。
         * Hides the message box if it is displayed
         * @return {Ext.MessageBox} this
         */
        hide : function(){
            var proxy = dlg ? dlg.activeGhost : null;
            if(this.isVisible() || proxy){
                dlg.hide();
                handleHide();
                if (proxy){
                    proxy.hide();
                } 
            }
            return this;
        },

        /**
         * 基于给定的配置选项显示一个消息框，或者重新初始一个现存的消息框。
         * MessageBox 对象的所有显示函数（例如：prompt、alert、等等）均为内部调用此函数，
         * 虽然这些调用均为此方法的简单的快捷方式并且不提供所有的下列配置选项。
         * Displays a new message box, or reinitializes an existing message box, based on the config options
         * passed in. All display functions (e.g. prompt, alert, etc.) on MessageBox call this function internally,
         * although those calls are basic shortcuts and do not support all of the config options allowed here.
         * @param {Object} config 可支持的配置项参数：The following config options are supported: <ul>
         * <li><b>animEl</b> : String/Element<div class="sub-desc">消息框显示和关闭时动画展现的目标元素，或它的 ID（默认为 undefined）。
         * An id or Element from which the message box should animate as it
         * opens and closes (defaults to undefined)</div></li>
         * <li><b>buttons</b> : Object/Boolean<div class="sub-desc">Button 配置对象（例如：Ext.MessageBox.OKCANCEL 或者 {ok:'Foo',cancel:'Bar'}），或者 false 表示不显示任何按钮（默认为 false）。
         * A button config object (e.g., Ext.MessageBox.OKCANCEL or {ok:'Foo',
         * cancel:'Bar'}), or false to not show any buttons (defaults to false)</div></li>
         * <li><b>closable</b> : Boolean<div class="sub-desc">值为 false 则隐藏右上角的关闭按钮（默认为 true）。
         * 注意由于 progress 和 wait 对话框只能通过程序关闭，因此它们将忽略此参数并总是隐藏关闭按钮。
         * False to hide the top-right close button (defaults to true). Note that
         * progress and wait dialogs will ignore this property and always hide the close button as they can only
         * be closed programmatically.</div></li>
         * <li><b>cls</b> : String<div class="sub-desc">应用到消息框容器元素中的自定义 CSS 类。
         * A custom CSS class to apply to the message box's container element</div></li>
         * <li><b>defaultTextHeight</b> : Number<div class="sub-desc">以像素为单位表示的默认消息框的文本域高度，如果有的话（默认为 75）。
         * The default height in pixels of the message box's multiline textarea
         * if displayed (defaults to 75)</div></li>
         * <li><b>fn</b> : Function<div class="sub-desc">当对话框关闭后执行的回调函数。参数包括按钮（被点击的按钮的名字，如果可用，如："ok"），文本（活动的文本框的值，如果可用）。
         * A callback function which is called when the dialog is dismissed either
         * by clicking on the configured buttons, or on the dialog close button, or by pressing
         * the return button to enter input.
         * <p>
         * Progress 和 wait 对话框将忽略此选项，因为它们不会回应使用者的动作，并且只能在程序中被关闭，所以任何必须的函数都可以放在关闭对话框的代码中调用。
         * 以下是送入的参数：
         * Progress and wait dialogs will ignore this option since they do not respond to user
         * actions and can only be closed programmatically, so any required function should be called
         * by the same code after it closes the dialog. Parameters passed:<ul>
         * <li><b>buttonId</b> : String<div class="sub-desc">
         * 按下按钮的id，可以是：The ID of the button pressed, one of:<div class="sub-desc"><ul>
         * <li><tt>ok</tt></li>
         * <li><tt>yes</tt></li>
         * <li><tt>no</tt></li>
         * <li><tt>cancel</tt></li>
         * </ul></div></div></li>
         * <li><b>text</b> : String<div class="sub-desc">输入文本字段的值可以是Value of the input field if either <tt><a href="#show-option-prompt" ext:member="show-option-prompt" ext:cls="Ext.MessageBox">prompt</a></tt>
         * or <tt><a href="#show-option-multiline" ext:member="show-option-multiline" ext:cls="Ext.MessageBox">multiline</a></tt> is true</div></li>
         * <li><b>opt</b> : Object<div class="sub-desc">进行显示的配置对象。The config object passed to show.</div></li>
         * </ul></p></div></li>
         * <li><b>scope</b> : Object<div class="sub-desc">回调函数的作用域。The scope of the callback function</div></li>
         * <li><b>icon</b> : String<div class="sub-desc">一个指定了背景图片地址的 CSS 类名用于对话框显示图标（例如：Ext.MessageBox.WARNING 或者 'custom-class'，默认这 ''）。
         * A CSS class that provides a background image to be used as the body icon for the
         * dialog (e.g. Ext.MessageBox.WARNING or 'custom-class') (defaults to '')</div></li>
         * <li><b>iconCls</b> : String<div class="sub-desc">作用在头版图标的标准{@link Ext.Window#iconCls}（默认为''）。The standard {@link Ext.Window#iconCls} to
         * add an optional header icon (defaults to '')</div></li>
         * <li><b>maxWidth</b> : Number<div class="sub-desc">以像素为单位表示的消息框的最大宽度（默认为 600）。The maximum width in pixels of the message box (defaults to 600)</div></li>
         * <li><b>minWidth</b> : Number<div class="sub-desc">以像素为单位表示的消息框的最小宽度（默认为 100）。The minimum width in pixels of the message box (defaults to 100)</div></li>
         * <li><b>modal</b> : Boolean<div class="sub-desc">值为 false 时允许用户在消息框在显示时交互（默认为 true） False to allow user interaction with the page while the message box is
         * displayed (defaults to true)</div></li>
         * <li><b>msg</b> : String<div class="sub-desc">使用指定的文本替换消息框中元素的 innerHTML （默认为XHTML兼容的非换行空格字符 '&amp;#160;'） A string that will replace the existing message box body text (defaults to the
         * XHTML-compliant non-breaking space character '&amp;#160;')</div></li>
         * <li><a id="show-option-multiline"></a><b>multiline</b> : Boolean<div class="sub-desc">
         * 值为 true 时显示一个提示用户输入多行文本的对话框（默认为 false）。True to prompt the user to enter multi-line text (defaults to false)</div></li>
         * <li><b>progress</b> : Boolean<div class="sub-desc">值为 true 时显示一个进度条（默认为 false）。True to display a progress bar (defaults to false)</div></li>
         * <li><b>progressText</b> : String<div class="sub-desc">当 progress = true 时进度条内显示的文本（默认为 ''）。The text to display inside the progress bar if progress = true (defaults to '')</div></li>
         * <li><a id="show-option-prompt"></a><b>prompt</b> : Boolean<div class="sub-desc">值为 true 时显示一个提示用户输入单行文本的对话框（默认为 false）。True to prompt the user to enter single-line text (defaults to false)</div></li>
         * <li><b>proxyDrag</b> : Boolean<div class="sub-desc">值为 true 则在拖拽的时候显示一个轻量级的代理（默认为 false）。True to display a lightweight proxy while dragging (defaults to false)</div></li>
         * <li><b>title</b> : String<div class="sub-desc">标题文本。The title text</div></li>
         * <li><b>value</b> : String<div class="sub-desc">设置到活动文本框中的文本。The string value to set into the active textbox element if displayed</div></li>
         * <li><b>wait</b> : Boolean<div class="sub-desc">值为true时显示一个进度条（默认为 false）。True to display a progress bar (defaults to false)</div></li>
         * <li><b>waitConfig</b> : Object<div class="sub-desc">{@link Ext.ProgressBar#waitConfig}对象（仅在 wait = true 时可用）。A {@link Ext.ProgressBar#waitConfig} object (applies only if wait = true)</div></li>
         * <li><b>width</b> : Number<div class="sub-desc">以像素为单位表示的对话框的宽度。The width of the dialog in pixels</div></li>
         * </ul>
         * 用法示例： Example usage:
         * <pre><code>
Ext.Msg.show({
   title: 'Address',
   msg: 'Please enter your address:',
   width: 300,
   buttons: Ext.MessageBox.OKCANCEL,
   multiline: true,
   fn: saveAddress,
   animEl: 'addAddressBtn',
   icon: Ext.MessageBox.INFO
});
</code></pre>
         * @return {Ext.MessageBox} this
         */
        show : function(options){
            if(this.isVisible()){
                this.hide();
            }
            opt = options;
            var d = this.getDialog(opt.title || "&#160;");

            d.setTitle(opt.title || "&#160;");
            var allowClose = (opt.closable !== false && opt.progress !== true && opt.wait !== true);
            d.tools.close.setDisplayed(allowClose);
            activeTextEl = textboxEl;
            opt.prompt = opt.prompt || (opt.multiline ? true : false);
            if(opt.prompt){
                if(opt.multiline){
                    textboxEl.hide();
                    textareaEl.show();
                    textareaEl.setHeight(typeof opt.multiline == "number" ?
                        opt.multiline : this.defaultTextHeight);
                    activeTextEl = textareaEl;
                }else{
                    textboxEl.show();
                    textareaEl.hide();
                }
            }else{
                textboxEl.hide();
                textareaEl.hide();
            }
            activeTextEl.dom.value = opt.value || "";
            if(opt.prompt){
                d.focusEl = activeTextEl;
            }else{
                var bs = opt.buttons;
                var db = null;
                if(bs && bs.ok){
                    db = buttons["ok"];
                }else if(bs && bs.yes){
                    db = buttons["yes"];
                }
                if (db){
                    d.focusEl = db;
                }
            }
            if(opt.iconCls){
              d.setIconClass(opt.iconCls);
            }
            this.setIcon(opt.icon);
            bwidth = updateButtons(opt.buttons);
            progressBar.setVisible(opt.progress === true || opt.wait === true);
            this.updateProgress(0, opt.progressText);
            this.updateText(opt.msg);
            if(opt.cls){
                d.el.addClass(opt.cls);
            }
            d.proxyDrag = opt.proxyDrag === true;
            d.modal = opt.modal !== false;
            d.mask = opt.modal !== false ? mask : false;
            if(!d.isVisible()){
                // force it to the end of the z-index stack so it gets a cursor in FF
                document.body.appendChild(dlg.el.dom);
                d.setAnimateTarget(opt.animEl);
                d.show(opt.animEl);
            }

            //workaround for window internally enabling keymap in afterShow
            d.on('show', function(){
                if(allowClose === true){
                    d.keyMap.enable();
                }else{
                    d.keyMap.disable();
                }
            }, this, {single:true});

            if(opt.wait === true){
                progressBar.wait(opt.waitConfig);
            }
            return this;
        },

        /**
         * 添加指定的图标到对话框中。默认情况下，'ext-mb-icon' 被应用于默认的样式，给定的样式类需要指定背景图片地址。
         * 如果要清除图标则给定一个空字串（''）。下面是提供的内建图标样式类，当然你也可以给定一个自定义的类：
         * Adds the specified icon to the dialog.  By default, the class 'ext-mb-icon' is applied for default
         * styling, and the class passed in is expected to supply the background image url. Pass in empty string ('')
         * to clear any existing icon.  The following built-in icon classes are supported, but you can also pass
         * in a custom class name:
         * <pre>
Ext.MessageBox.INFO
Ext.MessageBox.WARNING
Ext.MessageBox.QUESTION
Ext.MessageBox.ERROR
         *</pre>
         * @param {String} icon 一个指定了背景图片地址的 CSS 类名，或者一个空字串表示清除图标。A CSS classname specifying the icon's background image url, or empty string to clear the icon
         * @return {Ext.MessageBox} this
         */
        setIcon : function(icon){
            if(icon && icon != ''){
                iconEl.removeClass('x-hidden');
                iconEl.replaceClass(iconCls, icon);
                bodyEl.addClass('x-dlg-icon');
                iconCls = icon;
            }else{
                iconEl.replaceClass(iconCls, 'x-hidden');
                bodyEl.removeClass('x-dlg-icon');
                iconCls = '';
            }
            return this;
        },

        /**
         * 显示一个带有进度条的消息框。此消息框没有按钮并且无法被用户关闭。
         * 你必须通过{@link Ext.MessageBox#updateProgress}方法更新进度条，并当进度完成时关闭消息框。
         * Displays a message box with a progress bar.  This message box has no buttons and is not closeable by
         * the user.  You are responsible for updating the progress bar as needed via {@link Ext.MessageBox#updateProgress}
         * and closing the message box when the process is complete.
         * @param {String} title 标题文本。The title bar text
         * @param {String} msg 消息框body文本。The message box body text
         * @param {String} progressText 进度条显示的文本（默认为 ''）。(optional) The text to display inside the progress bar (defaults to '')
         * @return {Ext.MessageBox} this
         */
        progress : function(title, msg, progressText){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                progress:true,
                closable:false,
                minWidth: this.minProgressWidth,
                progressText: progressText
            });
            return this;
        },

        /**
         * 显示一个带有不断自动更新的进度条的消息框。这个可以被用在一个长时间运行的进程中防止用户交互。你需要在进程完成的时候关闭消息框。
         * Displays a message box with an infinitely auto-updating progress bar.  This can be used to block user
         * interaction while waiting for a long-running process to complete that does not have defined intervals.
         * You are responsible for closing the message box when the process is complete.
         * @param {String} msg 消息框 body 文本 The message box body text
         * @param {String} title （可选） 标题文本。(optional) The title bar text
         * @param {Object} config （可选） {@link Ext.ProgressBar#waitConfig}对象。(optional) A {@link Ext.ProgressBar#waitConfig} object
         * @return {Ext.MessageBox} this
         */
        wait : function(msg, title, config){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                closable:false,
                wait:true,
                modal:true,
                minWidth: this.minProgressWidth,
                waitConfig: config
            });
            return this;
        },

        /**
         * 显示一个标准的带有确认按钮的只读消息框（类似于 JavaScript原生的 alert函数、prompt函数）。
         * 如果给定了回调函数，则会在用户点击按钮后执行，并且被点击的按钮的 ID 会当做唯一的参数传入到回调函数中（也有可能是右上角的关闭按钮）。
         * Displays a standard read-only message box with an OK button (comparable to the basic JavaScript alert prompt).
         * If a callback function is passed it will be called after the user clicks the button, and the
         * id of the button that was clicked will be passed as the only parameter to the callback
         * (could also be the top-right close button).
         * @param {String} title 标题文本。The title bar text
         * @param {String} msg 消息框body文本。The message box body text
         * @param {Function} fn （可选）消息框被关闭后调用的回调函数。(optional) The callback function invoked after the message box is closed
         * @param {Object} scope （可选）回调函数的作用域。(optional)The scope of the callback function
         * @return {Ext.MessageBox} this
         */
        alert : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OK,
                fn: fn,
                scope : scope
            });
            return this;
        },

        /**
         * 显示一个带有是和否按钮的确认消息框（等同与JavaScript 原生的confirm函数）。
         * 如果给定了回调函数，则会在用户点击按钮后执行，并且被点击的按钮的ID会当做唯一的参数传入到回调函数中（也有可能是右上角的关闭按钮）。
         * Displays a confirmation message box with Yes and No buttons (comparable to JavaScript's confirm).
         * If a callback function is passed it will be called after the user clicks either button,
         * and the id of the button that was clicked will be passed as the only parameter to the callback
         * (could also be the top-right close button).
         * @param {String} title 标题文本。The title bar text
         * @param {String} msg 消息框body文本。The message box body text
         * @param {Function} fn （可选）消息框被关闭后调用的回调函数。(optional) The callback function invoked after the message box is closed
         * @param {Object} scope （可选）回调函数的作用域。(optional)The scope of the callback function
         * @return {Ext.MessageBox} this
         */
        confirm : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.YESNO,
                fn: fn,
                scope : scope,
                icon: this.QUESTION
            });
            return this;
        },

        /**
         * 显示一个带有确认和取消按钮的提示框，并接受用户输入文本（等同与JavaScript原生的prompt函数）。
         * 提示框可以是一个单行或多行文本框。如果给定了回调函数，则在用户点击任意一个按钮后执行回调函数，
         * 并且被点击的按钮的ID（有可能是右上角的关闭按钮）和用户输入的文本都将被当做参数传给回调函数。
         * Displays a message box with OK and Cancel buttons prompting the user to enter some text (comparable to JavaScript's prompt).
         * The prompt can be a single-line or multi-line textbox.  If a callback function is passed it will be called after the user
         * clicks either button, and the id of the button that was clicked (could also be the top-right
         * close button) and the text that was entered will be passed as the two parameters to the callback.
         * @param {String} title 标题文本。The title bar text
         * @param {String} msg 消息框body文本。The message box body text
         * @param {Function} fn （可选的）消息框被关闭后调用的回调函数。(optional)The callback function invoked after the message box is closed
         * @param {Object} scope （可选的）回调函数的作用域。(optional)The scope of the callback function
         * @param {Boolean/Number} multiline （可选的）值为true时则创建一个defaultTextHeight值指定行数的文本域，或者一个以像素为单位表示的高度（默认为 false，表示单行）。
         * (optional)True to create a multiline textbox using the defaultTextHeight
         * property, or the height in pixels to create the textbox (defaults to false / single-line)
         * @param {String} value （可选的）text输入元素的默认值（默认为''）。(optional) Default value of the text input element (defaults to '')
         * @return {Ext.MessageBox} this
         */
        prompt : function(title, msg, fn, scope, multiline, value){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OKCANCEL,
                fn: fn,
                minWidth:250,
                scope : scope,
                prompt:true,
                multiline: multiline,
                value: value
            });
            return this;
        },

        /**
         * 只显示一个确认按钮的Button配置项。
         * Button config that displays a single OK button
         * @type Object
         */
        OK : {ok:true},
        /**
         * 只显示一个取消按钮的Button配置项。
         * Button config that displays a single Cancel button
         * @type Object
         */
        CANCEL : {cancel:true},
        /**
         * 显示确认和取消按钮的Button配置项。
         * Button config that displays OK and Cancel buttons
         * @type Object
         */
        OKCANCEL : {ok:true, cancel:true},
        /**
         * 显示是和否按钮的Button配置项。
         * Button config that displays Yes and No buttons
         * @type Object
         */
        YESNO : {yes:true, no:true},
        /**
         * 显示是、否和取消按钮的Button配置项。
         * Button config that displays Yes, No and Cancel buttons
         * @type Object
         */
        YESNOCANCEL : {yes:true, no:true, cancel:true},
        /**
         * 显示INFO图标的CSS类。
         * The CSS class that provides the INFO icon image
         * @type String
         */
        INFO : 'ext-mb-info',
        /**
         * 显示WARNING图标的CSS类。
         * The CSS class that provides the WARNING icon image
         * @type String
         */
        WARNING : 'ext-mb-warning',
        /**
         * 显示QUESTION图标的CSS类。
         * The CSS class that provides the QUESTION icon image
         * @type String
         */
        QUESTION : 'ext-mb-question',
        /**
         * 显示ERROR图标的CSS类。
         * The CSS class that provides the ERROR icon image
         * @type String
         */
        ERROR : 'ext-mb-error',

        /**
         * 以像素为单位表示的消息框中文本域的默认高度（默认为 75）。
         * The default height in pixels of the message box's multiline textarea if displayed (defaults to 75)
         * @type Number
         */
        defaultTextHeight : 75,
        /**
         * 以像素为单位表示的消息框的最大宽度（默认为 600）。
         * The maximum width in pixels of the message box (defaults to 600)
         * @type Number
         */
        maxWidth : 600,
        /**
         * 以像素为单位表示的消息框的最小宽度（默认为 100）。
         * The minimum width in pixels of the message box (defaults to 100)
         * @type Number
         */
        minWidth : 100,
        /**
         * 带有进度条的对话框的以像素为单位表示的最小宽度。在与纯文本对话框设置不同的最小宽度时会用到（默认为 250）。
         * The minimum width in pixels of the message box if it is a progress-style dialog.  This is useful
         * for setting a different minimum width than text-only dialogs may need (defaults to 250)
         * @type Number
         */
        minProgressWidth : 250,
        /**
         * 一个包含默认的按钮文本字串的对象，为本地化支持时可以被覆写。
         * 可用的属性有：ok、cancel、yes 和 no。通常情况下你可以通过包含一个本地资源文件来实现整个框架的本地化。
         * 像这样就可以定制默认的文本：Ext.MessageBox.buttonText.yes = "是"; //中文
         * An object containing the default button text strings that can be overriden for localized language support.
         * Supported properties are: ok, cancel, yes and no.  Generally you should include a locale-specific
         * resource file for handling language support across the framework.
         * Customize the default text like so: Ext.MessageBox.buttonText.yes = "oui"; //french
         * @type Object
         */
        buttonText : {
            ok : "OK",
            cancel : "Cancel",
            yes : "Yes",
            no : "No"
        }
    };
}();

/**
 * {@link Ext.MessageBox} 的缩写。Shorthand for {@link Ext.MessageBox}
 */
Ext.Msg = Ext.MessageBox;