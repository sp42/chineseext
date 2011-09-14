/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.QuickTips
 * 为所有元素提供吸引人的、可定制的工具提示。
 * @singleton
 */
Ext.QuickTips = function(){
    var el, tipBody, tipBodyText, tipTitle, tm, cfg, close, tagEls = {}, esc, removeCls = null, bdLeft, bdRight;
    var ce, bd, xy, dd;
    var visible = false, disabled = true, inited = false;
    var showProc = 1, hideProc = 1, dismissProc = 1, locks = [];
    
    var onOver = function(e){
        if(disabled){
            return;
        }
        var t = e.getTarget();
        if(!t || t.nodeType !== 1 || t == document || t == document.body){
            return;
        }
        if(ce && t == ce.el){
            clearTimeout(hideProc);
            return;
        }
        if(t && tagEls[t.id]){
            tagEls[t.id].el = t;
            showProc = show.defer(tm.showDelay, tm, [tagEls[t.id]]);
            return;
        }
        var ttp, et = Ext.fly(t);
        var ns = cfg.namespace;
        if(tm.interceptTitles && t.title){
            ttp = t.title;
            t.qtip = ttp;
            t.removeAttribute("title");
            e.preventDefault();
        }else{
            ttp = t.qtip || et.getAttributeNS(ns, cfg.attribute);
        }
        if(ttp){
            showProc = show.defer(tm.showDelay, tm, [{
                el: t, 
                text: ttp, 
                width: et.getAttributeNS(ns, cfg.width),
                autoHide: et.getAttributeNS(ns, cfg.hide) != "user",
                title: et.getAttributeNS(ns, cfg.title),
           	    cls: et.getAttributeNS(ns, cfg.cls)
            }]);
        }
    };
    
    var onOut = function(e){
        clearTimeout(showProc);
        var t = e.getTarget();
        if(t && ce && ce.el == t && (tm.autoHide && ce.autoHide !== false)){
            hideProc = setTimeout(hide, tm.hideDelay);
        }
    };
    
    var onMove = function(e){
        if(disabled){
            return;
        }
        xy = e.getXY();
        xy[1] += 18;
        if(tm.trackMouse && ce){
            el.setXY(xy);
        }
    };
    
    var onDown = function(e){
        clearTimeout(showProc);
        clearTimeout(hideProc);
        if(!e.within(el)){
            if(tm.hideOnClick){
                hide();
                tm.disable();
            }
        }
    };
    
    var onUp = function(e){
        tm.enable();
    };

    var getPad = function(){
        return bdLeft.getPadding('l')+bdRight.getPadding('r');
    };

    var show = function(o){
        if(disabled){
            return;
        }
        clearTimeout(dismissProc);
        ce = o;
        if(removeCls){ // in case manually hidden
            el.removeClass(removeCls);
            removeCls = null;
        }
        if(ce.cls){
            el.addClass(ce.cls);
            removeCls = ce.cls;
        }
        if(ce.title){
            tipTitle.update(ce.title);
            tipTitle.show();
        }else{
            tipTitle.update('');
            tipTitle.hide();
        }
        el.dom.style.width  = tm.maxWidth+'px';
        //tipBody.dom.style.width = '';
        tipBodyText.update(o.text);
        var p = getPad(), w = ce.width;
        if(!w){
            var td = tipBodyText.dom;
            var aw = Math.max(td.offsetWidth, td.clientWidth, td.scrollWidth);
            if(aw > tm.maxWidth){
                w = tm.maxWidth;
            }else if(aw < tm.minWidth){
                w = tm.minWidth;
            }else{
                w = aw;
            }
        }
        //tipBody.setWidth(w);
        el.setWidth(parseInt(w, 10) + p);
        if(ce.autoHide === false){
            close.setDisplayed(true);
            if(dd){
                dd.unlock();
            }
        }else{
            close.setDisplayed(false);
            if(dd){
                dd.lock();
            }
        }
        if(xy){
            el.avoidY = xy[1]-18;
            el.setXY(xy);
        }
        if(tm.animate){
            el.setOpacity(.1);
            el.setStyle("visibility", "visible");
            el.fadeIn({callback: afterShow});
        }else{
            afterShow();
        }
    };
    
    var afterShow = function(){
        if(ce){
            el.show();
            esc.enable();
            if(tm.autoDismiss && ce.autoHide !== false){
                dismissProc = setTimeout(hide, tm.autoDismissDelay);
            }
        }
    };
    
    var hide = function(noanim){
        clearTimeout(dismissProc);
        clearTimeout(hideProc);
        ce = null;
        if(el.isVisible()){
            esc.disable();
            if(noanim !== true && tm.animate){
                el.fadeOut({callback: afterHide});
            }else{
                afterHide();
            } 
        }
    };
    
    var afterHide = function(){
        el.hide();
        if(removeCls){
            el.removeClass(removeCls);
            removeCls = null;
        }
    };
    
    return {
        /**
        * @cfg {Number} minWidth
        * 快捷提示的最小宽度(默认为 40)
        */
       minWidth : 40,
        /**
        * @cfg {Number} maxWidth
        * 快捷提示的最大宽度(默认为 300)
        */
       maxWidth : 300,
        /**
        * @cfg {Boolean} interceptTitles
        * 值为 true 时自动使用元素的 DOM 标题, 如果有的话(默认为 false)
        */
       interceptTitles : false,
        /**
        * @cfg {Boolean} trackMouse
        * 值为 true 时当鼠标经过目标对象时快捷提示将跟随鼠标移动(默认为 false)
        */
       trackMouse : false,
        /**
        * @cfg {Boolean} hideOnClick
        * 值为 true 时用户点击页面内任何位置都将隐藏快捷提示(默认为 true)
        */
       hideOnClick : true,
        /**
        * @cfg {Number} showDelay
        * 以毫秒表示的当鼠标进入目标元素后显示快捷提示的延迟时间(默认为 500)
        */
       showDelay : 500,
        /**
        * @cfg {Number} hideDelay
        * 以毫秒表示的隐藏快捷提示的延迟时间, 仅在 autoHide = true 时生效(默认为 200)
        */
       hideDelay : 200,
        /**
        * @cfg {Boolean} autoHide
        * 值为 true 时在鼠标移出目标元素自动隐藏快捷提示(默认为 true)。与 hideDelay 协同生效。
        */
       autoHide : true,
        /**
        * @cfg {Boolean}
        * 值为 true 时自动在规定时间后隐藏快捷提示, 无论用户执行何种操作(默认为 true)。与 autoDismissDelay 协同生效。
        */
       autoDismiss : true,
        /**
        * @cfg {Number}
        * 以毫秒表示的隐藏快捷提示的延迟时间, 仅在 autoDismiss = true 时生效(默认为 5000)
        */
       autoDismissDelay : 5000,
       /**
        * @cfg {Boolean} animate
        * 值为 true 时打开渐变动画。默认为 false (ClearType/scrollbar 在 IE7 中将导致闪烁)。
        */
       animate : false,

       /**
        * @cfg {String} title
        * 显示的标题文本(默认为 '')。此处可谓任意有效的 HTML 标识。
        */
       /**
        * @cfg {String} text
        * 显示的主体文本(默认为 '')。此处可谓任意有效的 HTML 标识。
        */
       /**
        * @cfg {String} cls
        * 快捷提示元素使用的 CSS 样式类(默认为 '')。
        */
       /**
        * @cfg {Number} width
        * 以像素为单位表示的快捷提示宽度(默认为 auto)。如果该值小于 minWidth 或大于 maxWidth 都将被忽略。
        */

    /**
     * 为首次使用初始化并启用 QuickTips 对象。在页面中试图使用或显示 QuickTips 对象之前必须调用一次该方法。
     */
       init : function(){
          tm = Ext.QuickTips;
          cfg = tm.tagConfig;
          if(!inited){
              if(!Ext.isReady){ // allow calling of init() before onReady
                  Ext.onReady(Ext.QuickTips.init, Ext.QuickTips);
                  return;
              }
              el = new Ext.Layer({cls:"x-tip", shadow:"drop", shim: true, constrain:true, shadowOffset:4});
              el.fxDefaults = {stopFx: true};
              // maximum custom styling
              el.update('<div class="x-tip-top-left"><div class="x-tip-top-right"><div class="x-tip-top"></div></div></div><div class="x-tip-bd-left"><div class="x-tip-bd-right"><div class="x-tip-bd"><div class="x-tip-close"></div><h3></h3><div class="x-tip-bd-inner"></div><div class="x-clear"></div></div></div></div><div class="x-tip-ft-left"><div class="x-tip-ft-right"><div class="x-tip-ft"></div></div></div>');
              tipTitle = el.child('h3');
              tipTitle.enableDisplayMode("block");
              tipBody = el.child('div.x-tip-bd');
              tipBodyText = el.child('div.x-tip-bd-inner');
              bdLeft = el.child('div.x-tip-bd-left');
              bdRight = el.child('div.x-tip-bd-right');
              close = el.child('div.x-tip-close');
              close.enableDisplayMode("block");
              close.on("click", hide);
              var d = Ext.get(document);
              d.on("mousedown", onDown);
              d.on("mouseup", onUp);
              d.on("mouseover", onOver);
              d.on("mouseout", onOut);
              d.on("mousemove", onMove);
              esc = d.addKeyListener(27, hide);
              esc.disable();
              if(Ext.dd.DD){
                  dd = el.initDD("default", null, {
                      onDrag : function(){
                          el.sync();  
                      }
                  });
                  dd.setHandleElId(tipTitle.id);
                  dd.lock();
              }
              inited = true;
          }
          this.enable(); 
       },

    /**
     * 配置一个新的快捷提示实例, 并指定到目标元素(目标元素应在 config.target 属性上指定)。
     * @param {Object} config 配置项对象
     */
       register : function(config){
           var cs = config instanceof Array ? config : arguments;
           for(var i = 0, len = cs.length; i < len; i++) {
               var c = cs[i];
               var target = c.target;
               if(target){
                   if(target instanceof Array){
                       for(var j = 0, jlen = target.length; j < jlen; j++){
                           tagEls[target[j]] = c;
                       }
                   }else{
                       tagEls[typeof target == 'string' ? target : Ext.id(target)] = c;
                   }
               }
           }
       },

    /**
     * 从元素中删除此快捷提示并销毁它。
     * @param {String/HTMLElement/Element} el 要删除快捷提示的元素。
     */
       unregister : function(el){
           delete tagEls[Ext.id(el)];
       },

    /**
     * 启用此快捷提示。
     */
       enable : function(){
           if(inited && disabled){
               locks.pop();
               if(locks.length < 1){
                   disabled = false;
               }
           }
       },

    /**
     * 禁用此快捷提示。
     */
       disable : function(){
          disabled = true;
          clearTimeout(showProc);
          clearTimeout(hideProc);
          clearTimeout(dismissProc);
          if(ce){
              hide(true);
          }
          locks.push(1);
       },

    /**
     * 如果快捷提示被启用则返回 true , 否则返回 false。
     */
       isEnabled : function(){
            return !disabled;
       },

        // private
       tagConfig : {
           namespace : "ext",
           attribute : "qtip",
           width : "width",
           target : "target",
           title : "qtitle",
           hide : "hide",
           cls : "qclass"
       }
   };
}();

// backwards compat
Ext.QuickTips.tips = Ext.QuickTips.register;