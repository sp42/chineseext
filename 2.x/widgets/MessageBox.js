/**
 * @class Ext.MessageBox
 * <p>用来生成不同样式的消息框的实用类。还可以使用它的别名 Ext.Msg。<p/>
 * <p>需要注意的是 MessageBox 对象是异步的。不同于 JavaScript 中原生的 <code>alert</code>（它会暂停浏览器的执行），显示 MessageBox 不会中断代码的运行。
 * 由于这个原因，如果你的代码需要在用户对 MessageBox 做出反馈<em>之后</em>执行，则必须用到回调函数（详情可见 {@link #show} 方法中的 <code>function</code> 参数）。
 * <p>用法示例：</p>
 *<pre><code>
// 基本的通知：
Ext.Msg.alert('Status', 'Changes saved successfully.');

// 提示用户输入数据并使用回调方法进得处理：
Ext.Msg.prompt('Name', 'Please enter your name:', function(btn, text){
    if (btn == 'ok'){
        // process text value and close...
    }
});

// 显示一个使用配置选项的对话框：
Ext.Msg.show({
   title:'Save Changes?',
   msg: 'Your are closing a tab that has unsaved changes. Would you like to save your changes?',
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
        dlg.hide();
        Ext.callback(opt.fn, opt.scope||window, [button, activeTextEl.dom.value], 1);
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
         * 返回 {@link Ext.Window} 对象的元素的引用
         * @return {Ext.Window} window 对象
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
                    html:'<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><input type="text" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea></div>'
                });
                iconEl = Ext.get(bodyEl.dom.firstChild);
                var contentEl = bodyEl.dom.childNodes[1];
                msgEl = Ext.get(contentEl.firstChild);
                textboxEl = Ext.get(contentEl.childNodes[2]);
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
                textareaEl = Ext.get(contentEl.childNodes[3]);
                textareaEl.enableDisplayMode();
                progressBar = new Ext.ProgressBar({
                    renderTo:bodyEl
                });
               bodyEl.createChild({cls:'x-clear'});
            }
            return dlg;
        },

        /**
         * 更新消息框中 body 元素的文本
         * @param {String} text （可选）使用指定的文本替换消息框中元素的 innerHTML （默认为XHTML兼容的非换行空格字符 '&amp;#160;'）
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
            dlg.setSize(w, 'auto').center();
            return this;
        },

        /**
         * 更新带有进度条的消息框中的文本和进度条。
         * 仅仅是由通过 {@link Ext.MessageBox#progress} 方法或者是在调用 {@link Ext.MessageBox#show} 方法时使用参数 progress: true 显示的消息框中可用。
         * @param {Number} value 0 到 1 之间的任意数字（例如： .5，默认为 0）
         * @param {String} progressText 进度条中显示的文本（默认为 ''）
         * @param {String} msg 用于替换消息框中 body 元素内容的文本（默认为 undefined，因此如果没有指定该参数则 body 中任何现存的文本将不会被覆写）
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
         * 如果消息框当前可见则返回 true
         * @return {Boolean} 如果消息框当前可见则返回 true，否则返回 false
         */
        isVisible : function(){
            return dlg && dlg.isVisible();
        },

        /**
         * 如果消息框当前可见则将其隐藏
         * @return {Ext.MessageBox} this
         */
        hide : function(){
            if(this.isVisible()){
                dlg.hide();
                handleHide();
            }
            return this;
        },

        /**
         * 基于给定的配置选项显示一个消息框，或者重新初始一个现存的消息框。
         * MessageBox 对象的所有显示函数（例如：prompt、alert、等等）均为内部调用此函数，
         * 虽然这些调用均为此方法的简单的快捷方式并且不提供所有的下列配置选项。
         * <pre>
属性              类型             说明
----------------  ---------------  -----------------------------------------------------------------------------
animEl            String/Element   消息框显示和关闭时动画展现的目标元素，或它的 ID（默认为 undefined）
buttons           Object/Boolean   Button 配置对象（例如：Ext.MessageBox.OKCANCEL 或者 {ok:'Foo',
                                   cancel:'Bar'}），或者 false 表示不显示任何按钮（默认为 false）
closable          Boolean          值为 false 则隐藏右上角的关闭按钮（默认为 true）。注意由于 progress 和 wait 对话框只能
                                   通过程序关闭，因此它们将忽略此参数并总是隐藏关闭按钮。
cls               String           应用到消息框的元素中的自定义 CSS 类
defaultTextHeight Number           以像素为单位表示的默认消息框的文本域高度，如果有的话（默认为 75）
fn                Function         当对话框关闭后执行的回调函数。参数包括按钮（被点击的按钮的名字，如果可用，如："ok"），
                                   文本（活动的文本框的值，如果可用）。Progress 和 wait 对话框将忽略此选项，因为它们不会回应使用者的动作，
                                   并且只能在程序中被关闭，所以任何必须的函数都可以放在关闭对话框的代码中调用。
icon              String           一个指定了背景图片地址的 CSS 类名用于对话框显示图标（例如：Ext.MessageBox.WARNING 或者 'custom-class'，默认这 ''）
maxWidth          Number           以像素为单位表示的消息框的最大宽度（默认为 600）
minWidth          Number           以像素为单位表示的消息框的最小宽度（默认为 100）
modal             Boolean          值为 false 时允许用户在消息框在显示时交互（默认为 true）
msg               String           使用指定的文本替换消息框中元素的 innerHTML （默认为XHTML兼容的非换行空格字符 '&amp;#160;'）
multiline         Boolean          值为 true 时显示一个提示用户输入多行文本的对话框（默认为 false）
progress          Boolean          值为 true 时显示一个进度条（默认为 false）
progressText      String           当 progress = true 时进度条内显示的文本（默认为 ''）
prompt            Boolean          值为 true 时显示一个提示用户输入单行文本的对话框（默认为 false）
proxyDrag         Boolean          值为 true 则在拖拽的时候显示一个轻量级的代理（默认为 false）
title             String           标题文本
value             String           设置到活动文本框中的文本
wait              Boolean          值为 true 时显示一个进度条（默认为 false）
waitConfig        Object           {@link Ext.ProgressBar#waitConfig} 对象（仅在 wait = true 时可用）
width             Number           以像素为单位表示的对话框的宽度
</pre>
         *
         * 用法示例：
         * <pre><code>
Ext.Msg.show({
   title: 'Address',
   msg: 'Please enter your address:',
   width: 300,
   buttons: Ext.MessageBox.OKCANCEL,
   multiline: true,
   fn: saveAddress,
   animEl: 'addAddressBtn',
   icon: Ext.MessagBox.INFO
});
</code></pre>
         * @param {Object} config 配置选项
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
            });

            if(opt.wait === true){
                progressBar.wait(opt.waitConfig);
            }
            return this;
        },

        /**
         * 添加指定的图标到对话框中。默认情况下，'ext-mb-icon' 被应用于默认的样式，给定的样式类需要指定背景图片地址。
         * 如果要清除图标则给定一个空字串（''）。下面是提供的内建图标样式类，当然你也可以给定一个自定义的类：
         * <pre>
Ext.MessageBox.INFO
Ext.MessageBox.WARNING
Ext.MessageBox.QUESTION
Ext.MessageBox.ERROR
         *</pre>
         * @param {String} icon 一个指定了背景图片地址的 CSS 类名，或者一个空字串表示清除图标
         * @return {Ext.MessageBox} this
         */
        setIcon : function(icon){
            if(icon && icon != ''){
                iconEl.removeClass('x-hidden');
                iconEl.replaceClass(iconCls, icon);
                iconCls = icon;
            }else{
                iconEl.replaceClass(iconCls, 'x-hidden');
                iconCls = '';
            }
            return this;
        },

        /**
         * 显示一个带有进度条的消息框。此消息框没有按钮并且无法被用户关闭。
         * 你必须通过 {@link Ext.MessageBox#updateProgress} 方法更新进度条，并当进度完成时关闭消息框。
         * @param {String} title 标题文本
         * @param {String} msg 消息框 body 文本
         * @param {String} progressText 进度条显示的文本（默认为 ''）
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
         * @param {String} msg 消息框 body 文本
         * @param {String} title （可选） 标题文本
         * @param {Object} config （可选） {@link Ext.ProgressBar#waitConfig} 对象
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
         * 显示一个标准的带有确认按钮的只读消息框（类似于 JavaScript 原生的 alert、prompt）。
         * 如果给定了回调函数，则会在用户点击按钮后执行，并且被点击的按钮的 ID 会当做唯一的参数传入到回调函数中（也有可能是右上角的关闭按钮）。
         * @param {String} title 标题文本
         * @param {String} msg 消息框 body 文本
         * @param {Function} fn （可选）消息框被关闭后调用的回调函数
         * @param {Object} scope （可选）回调函数的作用域
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
         * 显示一个带有是和否按钮的确认消息框（等同与 JavaScript 原生的 confirm）。
         * 如果给定了回调函数，则会在用户点击按钮后执行，并且被点击的按钮的 ID 会当做唯一的参数传入到回调函数中（也有可能是右上角的关闭按钮）。
         * @param {String} title 标题文本
         * @param {String} msg 消息框 body 文本
         * @param {Function} fn （可选） 消息框被关闭后调用的回调函数
         * @param {Object} scope （可选） 回调函数的作用域
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
         * 显示一个带有确认和取消按钮的提示框，并接受用户输入文本（等同与 JavaScript 原生的 prompt）。
         * 提示框可以是一个单行或多行文本框。如果给定了回调函数，则在用户点击任意一个按钮后执行回调函数，
         * 并且被点击的按钮的 ID（有可能是右上角的关闭按钮）和用户输入的文本都将被当做参数传给回调函数。
         * @param {String} title 标题文本
         * @param {String} msg 消息框 body 文本
         * @param {Function} fn （可选）消息框被关闭后调用的回调函数
         * @param {Object} scope （可选）回调函数的作用域
         * @param {Boolean/Number} multiline （可选）值为 true 时则创建一个 defaultTextHeight 
         * 值指定行数的文本域，或者一个以像素为单位表示的高度（默认为 false，表示单行）
         * @return {Ext.MessageBox} this
         */
        prompt : function(title, msg, fn, scope, multiline){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OKCANCEL,
                fn: fn,
                minWidth:250,
                scope : scope,
                prompt:true,
                multiline: multiline
            });
            return this;
        },

        /**
         * 只显示一个确认按钮的 Button 配置项
         * @type Object
         */
        OK : {ok:true},
        /**
         * 只显示一个取消按钮的 Button 配置项
         * @type Object
         */
        CANCEL : {cancel:true},
        /**
         * 显示确认和取消按钮的 Button 配置项
         * @type Object
         */
        OKCANCEL : {ok:true, cancel:true},
        /**
         * 显示是和否按钮的 Button 配置项
         * @type Object
         */
        YESNO : {yes:true, no:true},
        /**
         * 显示是、否和取消按钮的 Button 配置项
         * @type Object
         */
        YESNOCANCEL : {yes:true, no:true, cancel:true},
        /**
         * 显示 INFO 图标的 CSS 类
         * @type String
         */
        INFO : 'ext-mb-info',
        /**
         * 显示 WARNING 图标的 CSS 类
         * @type String
         */
        WARNING : 'ext-mb-warning',
        /**
         * 显示 QUESTION 图标的 CSS 类
         * @type String
         */
        QUESTION : 'ext-mb-question',
        /**
         * 显示 ERROR 图标的 CSS 类
         * @type String
         */
        ERROR : 'ext-mb-error',

        /**
         * 以像素为单位表示的消息框中文本域的默认高度（默认为 75）
         * @type Number
         */
        defaultTextHeight : 75,
        /**
         * 以像素为单位表示的消息框的最大宽度（默认为 600）
         * @type Number
         */
        maxWidth : 600,
        /**
         * 以像素为单位表示的消息框的最小宽度（默认为 100）
         * @type Number
         */
        minWidth : 100,
        /**
         * 带有进度条的对话框的以像素为单位表示的最小宽度。在与纯文本对话框设置不同的最小宽度时会用到（默认为 250）
         * @type Number
         */
        minProgressWidth : 250,
        /**
         * 一个包含默认的按钮文本字串的对象，为本地化支持时可以被覆写。
         * 可用的属性有：ok、cancel、yes 和 no。通常情况下你可以通过包含一个本地资源文件来实现整个框架的本地化。
         * 像这样就可以定制默认的文本：Ext.MessageBox.buttonText.yes = "是"; //中文
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
 * {@link Ext.MessageBox} 的缩写
 */
Ext.Msg = Ext.MessageBox;