/**
 * @class Ext.util.TextMetrics
 * 为一段文字提供一个精确象素级的测量，以便可以得到某段文字的高度和宽度。
 * @singleton
 */
Ext.util.TextMetrics = function(){
    var shared;
    return {
        /**
         * 测量指定文字尺寸
         * @param {String/HTMLElement} el 元素，DOM节点或ID,使得被渲染之文字获得新的CSS样式。
         * @param {String} text 欲测量的文字
         * @param {Number} fixedWidth (optional) 如果文字是多行的，您必须先设置好一个宽度。
         * 以便正确的测出高度。
         * @return {Object} 由文字尺寸组成的对象 {width: (width), height: (height)}
         */
        measure : function(el, text, fixedWidth){
            if(!shared){
                shared = Ext.util.TextMetrics.Instance(el, fixedWidth);
            }
            shared.bind(el);
            shared.setFixedWidth(fixedWidth || 'auto');
            return shared.getSize(text);
        },

       /**
         * 返回一个唯一的TextMetrics实例，直接绑定到某个元素和复用，
         * 这样会减少在每个测量上初始样式属性的多次调用。
         * @param {String/HTMLElement} el 将实例绑定到的元素，DOM节点或ID
         * @param {Number} fixedWidth (optional) 如果文字是多行的，您必须先设置好一个宽度。
         * 以便正确地测出高度。
         * @return {Ext.util.TextMetrics.Instance} instance 新实例
         */
        createInstance : function(el, fixedWidth){
            return Ext.util.TextMetrics.Instance(el, fixedWidth);
        }
    };
}();

Ext.util.TextMetrics.Instance = function(bindTo, fixedWidth){
    var ml = new Ext.Element(document.createElement('div'));
    document.body.appendChild(ml.dom);
    ml.position('absolute');
    ml.setLeftTop(-1000, -1000);
    ml.hide();

    if(fixedWidth){
        ml.setWidth(fixedWidth);
    }

    var instance = {
        /**
         * 返回一个指定文字的尺寸。该文字内置元素的样式和宽度属性
         * @param {String} text 要测量的文字
         * @return {Object} 由文字尺寸组成的对象 {width: (width), height: (height)}
         */
        getSize : function(text){
            ml.update(text);
            var s = ml.getSize();
            ml.update('');
            return s;
        },

        /**
         * 绑定某个样式的TextMetrics实例，使得被渲染之文字重新获得CSS样式。
         * @param {String/HTMLElement} el 元素，DOM节点或ID
         */
        bind : function(el){
            ml.setStyle(
                Ext.fly(el).getStyles('font-size','font-style', 'font-weight', 'font-family','line-height')
            );
        },

       /**
         * 对内置的测量元素设置一个固定的宽度。 如果文字是多行的，您必须先设置好一个宽度。
         * 以便正确地测出高度。
         * @param {Number} width 设置元素的宽度。
         */
        setFixedWidth : function(width){
            ml.setWidth(width);
        },

        /**
         * 返回指定文字的宽度
         * @param {String} text 要测量的文字
         * @return {Number} width  宽度（象素）
         */
        getWidth : function(text){
            ml.dom.style.width = 'auto';
            return this.getSize(text).width;
        },

        /**
         * 返回指定文字的高度，对于多行文本，有可能需要调用 {@link #setFixedWidth} 。
         * @param {String} text 要测量的文字
         * @return {Number} height 高度（象素）
         */
        getHeight : function(text){
            return this.getSize(text).height;
        }
    };

    instance.bind(bindTo);

    return instance;
};

// 向后兼容
Ext.Element.measureText = Ext.util.TextMetrics.measure;