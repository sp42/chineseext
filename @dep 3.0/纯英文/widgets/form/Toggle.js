/**
 * @class Ext.form.Toggle
 * @extends Ext.form.Slider
 * <p>Specialized Slider with a single thumb and only two values. By default the toggle component can
 * be switched between the values of 0 and 1.</p>
 * @xtype togglefield
 */
Ext.form.Toggle = Ext.extend(Ext.form.Slider, {
    minValue: 0,
    maxValue: 1,
    ui: 'toggle',
    inputType: 'toggle',

    /**
     * @cfg {Boolean} useClearIcon @hide
     */

    /**
     * @cfg {String} minValueCls CSS class added to the field when toggled to its minValue
     */
    minValueCls: 'x-toggle-off',

    /**
     * @cfg {String} maxValueCls CSS class added to the field when toggled to its maxValue
     */
    maxValueCls: 'x-toggle-on',

    /**
     * Toggles between the minValue (0 by default) and the maxValue (1 by default)
     */
    toggle: function() {
        var me = this,
            thumb = me.thumbs[0],
            value = thumb.getValue();

        me.setValue(value == me.minValue ? me.maxValue : me.minValue, true);
    },

    // inherit docs
    setValue: function(value) {
        var me = this;
        
        Ext.form.Toggle.superclass.setValue.apply(me, arguments);

        var fieldEl = me.fieldEl;
        
        if (me.constrain(value) === me.minValue) {
            fieldEl.addCls(me.minValueCls);
            fieldEl.removeCls(me.maxValueCls);
        }
        else {
            fieldEl.addCls(me.maxValueCls);
            fieldEl.removeCls(me.minValueCls);
        }
    },

    /**
     * @private
     * Listener to the tap event, just toggles the value
     */
    onTap: function() {
        if (!this.disabled) {
            this.toggle();
        }
    },

    getThumbClass: function() {
        return Ext.form.Toggle.Thumb;
    }
});

Ext.reg('togglefield', Ext.form.Toggle);


//DEPRECATED - remove this in 1.0. See RC1 Release Notes for details
Ext.reg('toggle', Ext.form.Toggle);


/**
 * @class Ext.form.Toggle.Thumb
 * @extends Ext.form.Slider.Thumb
 * @private
 * @ignore
 */
Ext.form.Toggle.Thumb = Ext.extend(Ext.form.Slider.Thumb, {
    onRender: function() {
        Ext.form.Toggle.Thumb.superclass.onRender.apply(this, arguments);
        Ext.DomHelper.append(this.el, [{
            cls: 'x-toggle-thumb-off',
            html: '<span>OFF</span>'
        },{
            cls: 'x-toggle-thumb-on',
            html: '<span>ON</span>'
        },{
            cls: 'x-toggle-thumb-thumb'
        }]);
    }
});