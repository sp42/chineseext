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
 * @class Ext.DatePicker
 * @extends Ext.Component
 * 简单的日期选择类。
 * Simple date picker class.
 * @constructor 创建一个DatePicker对象。Create a new DatePicker
 * @param {Object} config 配置选项对象。The config object
 */
Ext.DatePicker = Ext.extend(Ext.BoxComponent, {
    /**
     * @cfg {String} todayText 显示在选择当前日期的按钮上的文本（默认为 "Today"）。
     * The text to display on the button that selects the current date (defaults to "Today")
     */
    todayText : "Today",
    /**
     * @cfg {String} okText 显示在 ok 按钮上的文本。
     * The text to display on the ok button
     */
    okText : "&#160;OK&#160;", // &#160; 用来给用户更多的点击空间 to give the user extra clicking room
    /**
     * @cfg {String} cancelText 显示在 cancel 按钮上的文本。
     * The text to display on the cancel button
     */
    cancelText : "Cancel",
    /**
     * @cfg {String} todayTip 选择当前日期的按钮的快捷提示（默认为"{current date} (Spacebar)"）。
     * The tooltip to display for the button that selects the current date (defaults to "{current date} (Spacebar)")
     */
    todayTip : "{0} (Spacebar)",
    /**
     * @cfg {String} minText minDate 效验失败时显示的错误文本（默认为"This date is before the minimum date"）。
     * The error text to display if the minDate validation fails (defaults to "This date is before the minimum date")
     */
    minText : "This date is before the minimum date",
    /**
     * @cfg {String} maxText maxDate 效验失败时显示的错误文本（默认为"This date is after the maximum date"）。
     * The error text to display if the maxDate validation fails (defaults to "This date is after the maximum date")
     */
    maxText : "This date is after the maximum date",
    /**
     * @cfg {String} format 默认的日期格式化字串，可以被覆写以实现本地化支持。格式化字串必须为{@link Date#parseDate}中记载的有效格式（默认为 'm/d/y'）。
     * The default date format string which can be overriden for localization support.  The format must be
     * valid according to {@link Date#parseDate} (defaults to 'm/d/y').
     */
    format : "m/d/y",
    /**
     * @cfg {String} disabledDaysText 当选中禁用星期时显示的错误文本（默认为""）。
     * The tooltip to display when the date falls on a disabled day (defaults to "Disabled")
     */
    disabledDaysText : "Disabled",
    /**
     * @cfg {String} disabledDatesText 当选中禁用日期时显示的错误文本（默认为 ""）。
     * The tooltip text to display when the date falls on a disabled date (defaults to "Disabled")
     */
    disabledDatesText : "Disabled",
    /**
     * @cfg {Array} monthNames
     * 出于本地化的支持，决定那些可被覆盖的，这是由月份字符串组成的数组（默认为Date.monthNames）。
     * An array of textual month names which can be overriden for localization support (defaults to Date.monthNames)
     */
    monthNames : Date.monthNames,
    /**
     * @cfg {Array} dayNames
     * 星期名称数组，可以被覆写以实现本地化支持（默认为 Date.dayNames）。
     * An array of textual day names which can be overriden for localization support (defaults to Date.dayNames)
     */
    dayNames : Date.dayNames,
    /**
     * @cfg {String} nextText
     * 下个月按钮的快捷提示（默认为 'Next Month (Control+Right)'）。
     * The next month navigation button tooltip (defaults to 'Next Month (Control+Right)')
     */
    nextText: 'Next Month (Control+Right)',
    /**
     * @cfg {String} prevText
     * 上个月按钮的快捷提示（默认为 'Previous Month (Control+Left)'）。
     * The previous month navigation button tooltip (defaults to 'Previous Month (Control+Left)')
     */
    prevText: 'Previous Month (Control+Left)',
    /**
     * @cfg {String} monthYearText
     * 月份选择器的快捷提示（默认为 'Choose a month (Control+Up/Down to move years)'）。
     * The header month selector tooltip (defaults to 'Choose a month (Control+Up/Down to move years)')
     */
    monthYearText: 'Choose a month (Control+Up/Down to move years)',
    /**
     * @cfg {Number} startDay
     * 每周第一天的索引数，以 0 起始。（默认为 0，表示每周的第一天为周日）。
     * Day index at which the week should begin, 0-based (defaults to 0, which is Sunday)
     */
    startDay : 0,
    /**
     * @cfg {Boolean} showToday
     * False表示隐藏在底部区域的Today按钮，也禁止键盘选取当日的日期（默认为true）。
     * False to hide the footer area containing the Today button and disable the keyboard handler for spacebar
     * that selects the current date (defaults to true).
     */
    showToday : true,
    /**
     * @cfg {Date} minDate
     * 允许的最小日期（JavaScript 日期对象，默认为 null）。
     * Minimum allowable date (JavaScript date object, defaults to null)
     */
    /**
     * @cfg {Date} maxDate
     * 允许的最大日期（JavaScript 日期对象，默认为 null）。
     * Maximum allowable date (JavaScript date object, defaults to null)
     */
    /**
     * @cfg {Array} disabledDays
     * 一个禁用星期数组，以 0 起始。例如：[0, 6] 表示禁用周日和周六（默认为 null）。
     * An array of days to disable, 0-based. For example, [0, 6] disables Sunday and Saturday (defaults to null).
     */
    /**
     * @cfg {RegExp} disabledDatesRE
     * 一个用来表示禁用日期的 JavaScript 正则表达式（默认为 null）。
     * JavaScript regular expression used to disable a pattern of dates (defaults to null).  The {@link #disabledDates}
     * config will generate this regex internally, but if you specify disabledDatesRE it will take precedence over the 
     * disabledDates value.
     */
    /**
     * @cfg {Array} disabledDates
     * 不能选取的日期列表，用字符串表示。这些字符串可以是正则表达式的字符串，因此是非常强大的。若干例子：
     * An array of "dates" to disable, as strings. These strings will be used to build a dynamic regular
     * expression so they are very powerful. Some examples:
     * <ul>
     * <li>["03/08/2003", "09/16/2003"]就是声明禁用这些日期。</li>
     * <li>["03/08", "09/16"] 这样会每年的这些日子都被禁用。would disable those days for every year</li>
     * <li>["^03/08"] 自该日子开始（使用短year格式时有用）.would only match the beginning (useful if you are using short years)</li>
     * <li>["03/../2006"]2006年的三月内每一日都禁用。would disable every day in March 2006</li>
     * <li>["^03"]每逢三月都禁止。would disable every day in every March</li>
     * </ul>
     * 注意数组内的每一个日期的格式，都必须符合{@link #format}格式的要求。如遇到日期格式有“.”的，就要转义以符合正则的要求，如["03\\.08\\.03"]。
     * Note that the format of the dates included in the array should exactly match the {@link #format} config.
     * In order to support regular expressions, if you are using a date format that has "." in it, you will have to
     * escape the dot when restricting dates. For example: ["03\\.08\\.03"].
     */

    // private
    initComponent : function(){
        Ext.DatePicker.superclass.initComponent.call(this);

        this.value = this.value ?
                 this.value.clearTime() : new Date().clearTime();

        this.addEvents(
            /**
             * @event select
             * 选中日期时触发。
             * Fires when a date is selected
             * @param {DatePicker} this
             * @param {Date} date 选中的日期。The selected date
             */
            'select'
        );

        if(this.handler){
            this.on("select", this.handler,  this.scope || this);
        }

        this.initDisabledDays();
    },

    // private
    initDisabledDays : function(){
        if(!this.disabledDatesRE && this.disabledDates){
            var dd = this.disabledDates;
            var re = "(?:";
            for(var i = 0; i < dd.length; i++){
                re += dd[i];
                if(i != dd.length-1) re += "|";
            }
            this.disabledDatesRE = new RegExp(re + ")");
        }
    },
    
    /**
     * 替换现有的不可选取日期，并刷新DatePicker。
     * Replaces any existing disabled dates with new values and refreshes the DatePicker.
     * @param {Array/RegExp} disabledDates 日期的字符串组成的数组，或禁止日期的JavaScript正则表达式。参阅{@link #disabledDays}配置项。An array of date strings (see the {@link #disabledDates} config
     * for details on supported values), or a JavaScript regular expression used to disable a pattern of dates.
     */
    setDisabledDates : function(dd){
        if(Ext.isArray(dd)){
            this.disabledDates = dd;
            this.disabledDatesRE = null;
        }else{
            this.disabledDatesRE = dd;
        }
        this.initDisabledDays();
        this.update(this.value, true);
    },
    
    /**
     * 替换现有的不可选取日子（index式，0-6），并刷新DatePicker。
     * Replaces any existing disabled days (by index, 0-6) with new values and refreshes the DatePicker.
     * @param {Array} disabledDays 禁止日期的数组。参阅{@link #disabledDays}配置项。An array of disabled day indexes. See the {@link #disabledDays} config
     * for details on supported values.
     */
    setDisabledDays : function(dd){
        this.disabledDays = dd;
        this.update(this.value, true);
    },
    
    /**
     * 替换现有的{@link #minDate}值，并刷新DatePicker。
     * Replaces any existing {@link #minDate} with the new value and refreshes the DatePicker.
     * @param {Date} value 允许选择的最早日期。The minimum date that can be selected
     */
    setMinDate : function(dt){
        this.minDate = dt;
        this.update(this.value, true);
    },
    
    /**
     * 替换现有的{@link #maxDate}值，并刷新DatePicker。
     * Replaces any existing {@link #maxDate} with the new value and refreshes the DatePicker.
     * @param {Date} value 允许选择的最迟日期。The maximum date that can be selected
     */
    setMaxDate : function(dt){
        this.maxDate = dt;
        this.update(this.value, true);
    },

    /**
     * 获取当前日期字段中选中的值。
     * Sets the value of the date field
     * @param {Date} value 选中的日期。The date to set
     */
    setValue : function(value){
        var old = this.value;
        this.value = value.clearTime(true);
        if(this.el){
            this.update(this.value);
        }
    },

    /**
     * 获取当前已选中的日期值。
     * Gets the current selected value of the date field
     * @return {Date} 日期。The selected date
     */
    getValue : function(){
        return this.value;
    },

    // private
    focus : function(){
        if(this.el){
            this.update(this.activeDate);
        }
    },

    // private
    onRender : function(container, position){
        var m = [
             '<table cellspacing="0">',
                '<tr><td class="x-date-left"><a href="#" title="', this.prevText ,'">&#160;</a></td><td class="x-date-middle" align="center"></td><td class="x-date-right"><a href="#" title="', this.nextText ,'">&#160;</a></td></tr>',
                '<tr><td colspan="3"><table class="x-date-inner" cellspacing="0"><thead><tr>'];
        var dn = this.dayNames;
        for(var i = 0; i < 7; i++){
            var d = this.startDay+i;
            if(d > 6){
                d = d-7;
            }
            m.push("<th><span>", dn[d].substr(0,1), "</span></th>");
        }
        m[m.length] = "</tr></thead><tbody><tr>";
        for(var i = 0; i < 42; i++) {
            if(i % 7 == 0 && i != 0){
                m[m.length] = "</tr><tr>";
            }
            m[m.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span></span></em></a></td>';
        }
        m.push('</tr></tbody></table></td></tr>', 
                this.showToday ? '<tr><td colspan="3" class="x-date-bottom" align="center"></td></tr>' : '', 
                '</table><div class="x-date-mp"></div>');

        var el = document.createElement("div");
        el.className = "x-date-picker";
        el.innerHTML = m.join("");

        container.dom.insertBefore(el, position);

        this.el = Ext.get(el);
        this.eventEl = Ext.get(el.firstChild);

        new Ext.util.ClickRepeater(this.el.child("td.x-date-left a"), {
            handler: this.showPrevMonth,
            scope: this,
            preventDefault:true,
            stopDefault:true
        });

        new Ext.util.ClickRepeater(this.el.child("td.x-date-right a"), {
            handler: this.showNextMonth,
            scope: this,
            preventDefault:true,
            stopDefault:true
        });

        this.mon(this.eventEl, "mousewheel", this.handleMouseWheel, this);

        this.monthPicker = this.el.down('div.x-date-mp');
        this.monthPicker.enableDisplayMode('block');
        
        var kn = new Ext.KeyNav(this.eventEl, {
            "left" : function(e){
                e.ctrlKey ?
                    this.showPrevMonth() :
                    this.update(this.activeDate.add("d", -1));
            },

            "right" : function(e){
                e.ctrlKey ?
                    this.showNextMonth() :
                    this.update(this.activeDate.add("d", 1));
            },

            "up" : function(e){
                e.ctrlKey ?
                    this.showNextYear() :
                    this.update(this.activeDate.add("d", -7));
            },

            "down" : function(e){
                e.ctrlKey ?
                    this.showPrevYear() :
                    this.update(this.activeDate.add("d", 7));
            },

            "pageUp" : function(e){
                this.showNextMonth();
            },

            "pageDown" : function(e){
                this.showPrevMonth();
            },

            "enter" : function(e){
                e.stopPropagation();
                return true;
            },

            scope : this
        });

        this.mon(this.eventEl, "click", this.handleDateClick,  this, {delegate: "a.x-date-date"});

        this.el.unselectable();
        
        this.cells = this.el.select("table.x-date-inner tbody td");
        this.textNodes = this.el.query("table.x-date-inner tbody span");

        this.mbtn = new Ext.Button({
            text: "&#160;",
            tooltip: this.monthYearText,
            renderTo: this.el.child("td.x-date-middle", true)
        });

		this.mon(this.mbtn, 'click', this.showMonthPicker, this);
        this.mbtn.el.child('em').addClass("x-btn-arrow");

        if(this.showToday){
            this.todayKeyListener = this.eventEl.addKeyListener(Ext.EventObject.SPACE, this.selectToday,  this);
            var today = (new Date()).dateFormat(this.format);
            this.todayBtn = new Ext.Button({
                renderTo: this.el.child("td.x-date-bottom", true),
                text: String.format(this.todayText, today),
                tooltip: String.format(this.todayTip, today),
                handler: this.selectToday,
                scope: this
            });
        }
        
        if(Ext.isIE){
            this.el.repaint();
        }
        this.update(this.value);
    },

    // private
    createMonthPicker : function(){
        if(!this.monthPicker.dom.firstChild){
            var buf = ['<table border="0" cellspacing="0">'];
            for(var i = 0; i < 6; i++){
                buf.push(
                    '<tr><td class="x-date-mp-month"><a href="#">', this.monthNames[i].substr(0, 3), '</a></td>',
                    '<td class="x-date-mp-month x-date-mp-sep"><a href="#">', this.monthNames[i+6].substr(0, 3), '</a></td>',
                    i == 0 ?
                    '<td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-prev"></a></td><td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-next"></a></td></tr>' :
                    '<td class="x-date-mp-year"><a href="#"></a></td><td class="x-date-mp-year"><a href="#"></a></td></tr>'
                );
            }
            buf.push(
                '<tr class="x-date-mp-btns"><td colspan="4"><button type="button" class="x-date-mp-ok">',
                    this.okText,
                    '</button><button type="button" class="x-date-mp-cancel">',
                    this.cancelText,
                    '</button></td></tr>',
                '</table>'
            );
            this.monthPicker.update(buf.join(''));
            
            this.mon(this.monthPicker, 'click', this.onMonthClick, this);
            this.mon(this.dblclick, 'click', this.onMonthDblClick, this);

            this.mpMonths = this.monthPicker.select('td.x-date-mp-month');
            this.mpYears = this.monthPicker.select('td.x-date-mp-year');

            this.mpMonths.each(function(m, a, i){
                i += 1;
                if((i%2) == 0){
                    m.dom.xmonth = 5 + Math.round(i * .5);
                }else{
                    m.dom.xmonth = Math.round((i-1) * .5);
                }
            });
        }
    },

    // private
    showMonthPicker : function(){
        this.createMonthPicker();
        var size = this.el.getSize();
        this.monthPicker.setSize(size);
        this.monthPicker.child('table').setSize(size);

        this.mpSelMonth = (this.activeDate || this.value).getMonth();
        this.updateMPMonth(this.mpSelMonth);
        this.mpSelYear = (this.activeDate || this.value).getFullYear();
        this.updateMPYear(this.mpSelYear);

        this.monthPicker.slideIn('t', {duration:.2});
    },

    // private
    updateMPYear : function(y){
        this.mpyear = y;
        var ys = this.mpYears.elements;
        for(var i = 1; i <= 10; i++){
            var td = ys[i-1], y2;
            if((i%2) == 0){
                y2 = y + Math.round(i * .5);
                td.firstChild.innerHTML = y2;
                td.xyear = y2;
            }else{
                y2 = y - (5-Math.round(i * .5));
                td.firstChild.innerHTML = y2;
                td.xyear = y2;
            }
            this.mpYears.item(i-1)[y2 == this.mpSelYear ? 'addClass' : 'removeClass']('x-date-mp-sel');
        }
    },

    // private
    updateMPMonth : function(sm){
        this.mpMonths.each(function(m, a, i){
            m[m.dom.xmonth == sm ? 'addClass' : 'removeClass']('x-date-mp-sel');
        });
    },

    // private
    selectMPMonth: function(m){
        
    },

    // private
    onMonthClick : function(e, t){
        e.stopEvent();
        var el = new Ext.Element(t), pn;
        if(el.is('button.x-date-mp-cancel')){
            this.hideMonthPicker();
        }
        else if(el.is('button.x-date-mp-ok')){
            var d = new Date(this.mpSelYear, this.mpSelMonth, (this.activeDate || this.value).getDate());
            if(d.getMonth() != this.mpSelMonth){
                // "fix" the JS rolling date conversion if needed
                d = new Date(this.mpSelYear, this.mpSelMonth, 1).getLastDateOfMonth();
            }
            this.update(d);
            this.hideMonthPicker();
        }
        else if(pn = el.up('td.x-date-mp-month', 2)){
            this.mpMonths.removeClass('x-date-mp-sel');
            pn.addClass('x-date-mp-sel');
            this.mpSelMonth = pn.dom.xmonth;
        }
        else if(pn = el.up('td.x-date-mp-year', 2)){
            this.mpYears.removeClass('x-date-mp-sel');
            pn.addClass('x-date-mp-sel');
            this.mpSelYear = pn.dom.xyear;
        }
        else if(el.is('a.x-date-mp-prev')){
            this.updateMPYear(this.mpyear-10);
        }
        else if(el.is('a.x-date-mp-next')){
            this.updateMPYear(this.mpyear+10);
        }
    },

    // private
    onMonthDblClick : function(e, t){
        e.stopEvent();
        var el = new Ext.Element(t), pn;
        if(pn = el.up('td.x-date-mp-month', 2)){
            this.update(new Date(this.mpSelYear, pn.dom.xmonth, (this.activeDate || this.value).getDate()));
            this.hideMonthPicker();
        }
        else if(pn = el.up('td.x-date-mp-year', 2)){
            this.update(new Date(pn.dom.xyear, this.mpSelMonth, (this.activeDate || this.value).getDate()));
            this.hideMonthPicker();
        }
    },

    // private
    hideMonthPicker : function(disableAnim){
        if(this.monthPicker){
            if(disableAnim === true){
                this.monthPicker.hide();
            }else{
                this.monthPicker.slideOut('t', {duration:.2});
            }
        }
    },

    // private
    showPrevMonth : function(e){
        this.update(this.activeDate.add("mo", -1));
    },

    // private
    showNextMonth : function(e){
        this.update(this.activeDate.add("mo", 1));
    },

    // private
    showPrevYear : function(){
        this.update(this.activeDate.add("y", -1));
    },

    // private
    showNextYear : function(){
        this.update(this.activeDate.add("y", 1));
    },

    // private
    handleMouseWheel : function(e){
        var delta = e.getWheelDelta();
        if(delta > 0){
            this.showPrevMonth();
            e.stopEvent();
        } else if(delta < 0){
            this.showNextMonth();
            e.stopEvent();
        }
    },

    // private
    handleDateClick : function(e, t){
        e.stopEvent();
        if(t.dateValue && !Ext.fly(t.parentNode).hasClass("x-date-disabled")){
            this.setValue(new Date(t.dateValue));
            this.fireEvent("select", this, this.value);
        }
    },

    // private
    selectToday : function(){
        if(this.todayBtn && !this.todayBtn.disabled){
            this.setValue(new Date().clearTime());
            this.fireEvent("select", this, this.value);
        }
    },

    // private
    update : function(date, forceRefresh){
        var vd = this.activeDate;
        this.activeDate = date;
        if(!forceRefresh && vd && this.el){
            var t = date.getTime();
            if(vd.getMonth() == date.getMonth() && vd.getFullYear() == date.getFullYear()){
                this.cells.removeClass("x-date-selected");
                this.cells.each(function(c){
                   if(c.dom.firstChild.dateValue == t){
                       c.addClass("x-date-selected");
                       setTimeout(function(){
                            try{c.dom.firstChild.focus();}catch(e){}
                       }, 50);
                       return false;
                   }
                });
                return;
            }
        }
        var days = date.getDaysInMonth();
        var firstOfMonth = date.getFirstDateOfMonth();
        var startingPos = firstOfMonth.getDay()-this.startDay;

        if(startingPos <= this.startDay){
            startingPos += 7;
        }

        var pm = date.add("mo", -1);
        var prevStart = pm.getDaysInMonth()-startingPos;

        var cells = this.cells.elements;
        var textEls = this.textNodes;
        days += startingPos;

        // convert everything to numbers so it's fast
        var day = 86400000;
        var d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart)).clearTime();
        var today = new Date().clearTime().getTime();
        var sel = date.clearTime().getTime();
        var min = this.minDate ? this.minDate.clearTime() : Number.NEGATIVE_INFINITY;
        var max = this.maxDate ? this.maxDate.clearTime() : Number.POSITIVE_INFINITY;
        var ddMatch = this.disabledDatesRE;
        var ddText = this.disabledDatesText;
        var ddays = this.disabledDays ? this.disabledDays.join("") : false;
        var ddaysText = this.disabledDaysText;
        var format = this.format;

        if(this.showToday){
            var td = new Date().clearTime();
            var disable = (td < min || td > max || 
                (ddMatch && format && ddMatch.test(td.dateFormat(format))) || 
                (ddays && ddays.indexOf(td.getDay()) != -1));
                        
            this.todayBtn.setDisabled(disable);
            this.todayKeyListener[disable ? 'disable' : 'enable']();
        }
        
        var setCellClass = function(cal, cell){
            cell.title = "";
            var t = d.getTime();
            cell.firstChild.dateValue = t;
            if(t == today){
                cell.className += " x-date-today";
                cell.title = cal.todayText;
            }
            if(t == sel){
                cell.className += " x-date-selected";
                setTimeout(function(){
                    try{cell.firstChild.focus();}catch(e){}
                }, 50);
            }
            // disabling
            if(t < min) {
                cell.className = " x-date-disabled";
                cell.title = cal.minText;
                return;
            }
            if(t > max) {
                cell.className = " x-date-disabled";
                cell.title = cal.maxText;
                return;
            }
            if(ddays){
                if(ddays.indexOf(d.getDay()) != -1){
                    cell.title = ddaysText;
                    cell.className = " x-date-disabled";
                }
            }
            if(ddMatch && format){
                var fvalue = d.dateFormat(format);
                if(ddMatch.test(fvalue)){
                    cell.title = ddText.replace("%0", fvalue);
                    cell.className = " x-date-disabled";
                }
            }
        };

        var i = 0;
        for(; i < startingPos; i++) {
            textEls[i].innerHTML = (++prevStart);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-prevday";
            setCellClass(this, cells[i]);
        }
        for(; i < days; i++){
            var intDay = i - startingPos + 1;
            textEls[i].innerHTML = (intDay);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-active";
            setCellClass(this, cells[i]);
        }
        var extraDays = 0;
        for(; i < 42; i++) {
             textEls[i].innerHTML = (++extraDays);
             d.setDate(d.getDate()+1);
             cells[i].className = "x-date-nextday";
             setCellClass(this, cells[i]);
        }

        this.mbtn.setText(this.monthNames[date.getMonth()] + " " + date.getFullYear());

        if(!this.internalRender){
            var main = this.el.dom.firstChild;
            var w = main.offsetWidth;
            this.el.setWidth(w + this.el.getBorderWidth("lr"));
            Ext.fly(main).setWidth(w);
            this.internalRender = true;
            // opera does not respect the auto grow header center column
            // then, after it gets a width opera refuses to recalculate
            // without a second pass
            if(Ext.isOpera && !this.secondPass){
                main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth+main.rows[0].cells[2].offsetWidth)) + "px";
                this.secondPass = true;
                this.update.defer(10, this, [date]);
            }
        }
    },

    // private
    beforeDestroy : function() {
        if(this.rendered){
            Ext.destroy(
                this.leftClickRpt,
                this.rightClickRpt,
                this.monthPicker,
                this.eventEl,
                this.mbtn,
                this.todayBtn
            );
        }
    }

    /**
     * @cfg {String} autoEl @hide
     */
});
Ext.reg('datepicker', Ext.DatePicker);