/**
 * @class Ext.form.Text
 * @extends Ext.form.Field
 * <p>Simple text input field. See {@link Ext.form.FormPanel FormPanel} for example usage.</p>
 * @xtype textfield
 */
Ext.form.Text = Ext.extend(Ext.form.Field, {
    ui: 'text',

    /**
     * @cfg {String} focusCls The CSS class to use when the field receives focus (defaults to 'x-field-focus')
     */
    focusCls: 'x-field-focus',

    /**
     * @cfg {Integer} maxLength The maximum number of permitted input characters (defaults to 0).
     */
    maxLength: 0,

    /**
     * @cfg {String} placeHolder A string value displayed in the input (if supported) when the control is empty.
     */
    placeHolder: undefined,

    /**
     * True to set the field's DOM element autocomplete attribute to "on", false to set to "off". Defaults to undefined, leaving the attribute unset
     * @cfg {Boolean} autoComplete
     */
    autoComplete: undefined,

    /**
     * True to set the field's DOM element autocapitalize attribute to "on", false to set to "off". Defaults to undefined, leaving the attribute unset
     * @cfg {Boolean} autoCapitalize
     */
    autoCapitalize: undefined,

    /**
     * True to set the field DOM element autocorrect attribute to "on", false to set to "off". Defaults to undefined, leaving the attribute unset.
     * @cfg {Boolean} autoCorrect
     */
    autoCorrect: undefined,

    /**
     * @property {Boolean} <tt>True</tt> if the field currently has focus.
     */
    isFocused: false,

    // @private
    isClearIconVisible: false,

    useMask: Ext.is.iOS,

    initComponent: function() {
        this.addEvents(
            /**
             * @event focus
             * Fires when this field receives input focus.
             * @param {Ext.form.Text} this This field
             * @param {Ext.EventObject} e
             */
            'focus',
            /**
             * @event blur
             * Fires when this field loses input focus.
             * @param {Ext.form.Text} this This field
             * @param {Ext.EventObject} e
             */
            'blur',
            /**
             * @event keyup
             * Fires when a key is released on the input element.
             * @param {Ext.form.Text} this This field
             * @param {Ext.EventObject} e
             */
            'keyup',
            /**
             * @event change
             * Fires just before the field blurs if the field value has changed.
             * @param {Ext.form.Text} this This field
             * @param {Mixed} newValue The new value
             * @param {Mixed} oldValue The original value
             */
            'change'
        );

        Ext.form.Text.superclass.initComponent.apply(this, arguments);
    },

    applyRenderSelectors: function() {
        this.renderSelectors = Ext.applyIf(this.renderSelectors || {}, {
            clearIconEl: '.x-field-clear',
            clearIconContainerEl: '.x-field-clear-container'
        });
        
        Ext.form.Text.superclass.applyRenderSelectors.call(this);
    },

    initRenderData: function() {
        var renderData     = Ext.form.Text.superclass.initRenderData.call(this),
            autoComplete   = this.autoComplete,
            autoCapitalize = this.autoCapitalize,
            autoCorrect    = this.autoCorrect;

        Ext.applyIf(renderData, {
            placeHolder : this.placeHolder,
            maxlength   : this.maxLength,
            useClearIcon   : this.useClearIcon
        });

        var testArray = [true, 'on'];

        if (autoComplete !== undefined) {
            renderData.autoComplete = (testArray.indexOf(autoComplete) !== -1)  ? 'on': 'off';
        }

        if (autoCapitalize !== undefined) {
            renderData.autoCapitalize = (testArray.indexOf(autoCapitalize) !== -1) ? 'on': 'off';
        }

        if (autoCorrect !== undefined) {
            renderData.autoCorrect = (testArray.indexOf(autoCorrect) !== -1) ? 'on': 'off';
        }

        this.renderData = renderData;
        
        return renderData;
    },

    initEvents: function() {
        Ext.form.Text.superclass.initEvents.call(this);

        if (this.fieldEl) {
            this.mon(this.fieldEl, {
                focus: this.onFocus,
                blur: this.onBlur,
                keyup: this.onKeyUp,
                paste: this.updateClearIconVisibility,
                mousedown: this.onBeforeFocus,
                scope: this
            });

            if(this.clearIconEl){
                this.mon(this.clearIconContainerEl, {
                    scope: this,
                    tap: this.onClearTap
                });
            }
        }
    },

    // @private
    onEnable: function() {
        Ext.form.Text.superclass.onEnable.apply(this, arguments);

        this.disabled = false;
        
        this.updateClearIconVisibility();
    },

    // @private
    onDisable: function() {
        Ext.form.Text.superclass.onDisable.apply(this, arguments);

        this.blur();
        
        this.hideClearIcon();
    },

    onClearTap: function() {
        if (!this.disabled) {
            this.setValue('');
        }
    },

    updateClearIconVisibility: function() {
        var value = this.getValue();

        if (!value) {
            value = '';
        }
        
        if (value.length < 1){
            this.hideClearIcon();
        }
        else {
            this.showClearIcon();
        }

        return this;
    },

    showClearIcon: function() {
        if (!this.disabled && this.fieldEl && this.clearIconEl && !this.isClearIconVisible) {
            this.isClearIconVisible = true;
            this.fieldEl.addCls('x-field-clearable');
            this.clearIconEl.removeCls('x-hidden-visibility');
        }

        return this;
    },

    hideClearIcon: function() {
        if (this.fieldEl && this.clearIconEl && this.isClearIconVisible) {
            this.isClearIconVisible = false;
            this.fieldEl.removeCls('x-field-clearable');
            this.clearIconEl.addCls('x-hidden-visibility');
        }

        return this;
    },

    // @private
    afterRender: function() {
        Ext.form.Text.superclass.afterRender.call(this);
        this.updateClearIconVisibility();
    },
    // @private
    onBeforeFocus: function(e) {
        this.fireEvent('beforefocus', e);
    },

    beforeFocus: Ext.emptyFn,

    // @private
    onFocus: function(e) {
        if (this.mask) {
            if (this.maskCorrectionTimer) {
                clearTimeout(this.maskCorrectionTimer);
            }

            this.hideMask();
        }

        this.beforeFocus();

        if (this.focusCls) {
            this.el.addCls(this.focusCls);
        }

        if (!this.isFocused) {
            this.isFocused = true;
            /**
             * <p>The value that the Field had at the time it was last focused. This is the value that is passed
             * to the {@link #change} event which is fired if the value has been changed when the Field is blurred.</p>
             * <p><b>This will be undefined until the Field has been visited.</b> Compare {@link #originalValue}.</p>
             * @type mixed
             * @property startValue
             */
            this.startValue = this.getValue();
            this.fireEvent('focus', this, e);
        }

    },

    // @private
    beforeBlur: Ext.emptyFn,

    // @private
    onBlur: function(e) {
        this.beforeBlur();

        if (this.focusCls) {
            this.el.removeCls(this.focusCls);
        }

        this.isFocused = false;

        var value = this.getValue();

        if (String(value) != String(this.startValue)){
            this.fireEvent('change', this, value, this.startValue);
        }

        this.fireEvent('blur', this, e);

        this.updateClearIconVisibility();

        this.showMask();

        this.afterBlur();
    },

    // @private
    afterBlur: Ext.emptyFn,

    /**
     * Attempts to set the field as the active input focus.
     * @return {Ext.form.Text} this
     */
    focus: function(){
        if (this.rendered && this.fieldEl && this.fieldEl.dom.focus) {
            this.fieldEl.dom.focus();
        }

        return this;
    },

    /**
     * Attempts to forcefully blur input focus for the field.
     * @return {Ext.form.Text} this
     */
    blur: function(){
        if(this.rendered && this.fieldEl && this.fieldEl.dom.blur) {
            this.fieldEl.dom.blur();
        }
        return this;
    },

    setValue: function() {
        Ext.form.Text.superclass.setValue.apply(this, arguments);

        this.updateClearIconVisibility();
    },

    onKeyUp: function(e) {
        this.updateClearIconVisibility();
        
        if (e.browserEvent.keyCode === 13) {
            this.blur();
        } else {
            this.fireEvent('keyup', this, e);
        }
    }

    /**
     * @cfg {Integer} maxLength Maximum number of character permit by the input. 
     */
});

Ext.reg('textfield', Ext.form.Text);

/**
 * @class Ext.form.TextField
 * @extends Ext.form.Text
 * @private
 * @hidden
 * DEPRECATED - remove this in 1.0. See RC1 Release Notes for details
 */
Ext.form.TextField = Ext.extend(Ext.form.Text, {

    constructor: function() {
        console.warn("Ext.form.TextField has been deprecated and will be removed in Sencha Touch 1.0. Please use Ext.form.Text instead");
        Ext.form.TextField.superclass.constructor.apply(this, arguments);
    }
});