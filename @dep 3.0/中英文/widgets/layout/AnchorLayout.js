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
 * @class Ext.layout.AnchorLayout
 * @extends Ext.layout.ContainerLayout
 * <p>
 * 这是一种相对于容器四周的尺寸大小，对其包含在内的元素进行定位式（Anchoring）的布局。如果容器大小发生变化，所有已固定的项都会随着定位规则而变化（按照规则自动渲染）。
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'anchor' 的方式创建，一般很少通过关键字new直接使用。<br />
 * This is a layout that enables anchoring of contained elements relative to the container's dimensions.  If
 * the container is resized, all anchored items are automatically rerendered according to their anchor rules.
 * This class is intended to be extended or created via the layout:'anchor' {@link Ext.Container#layout} config,
 * and should generally not need to be created directly via the new keyword.</p>
 * 
 * <p>
 * AnchorLayout不存在任何直接的配置项。不过使用这种AnchorLayot的布局就可使用针对该布局的<b>anchorSize</b>配置项属性进行设置。
 * 缺省下，AnchorLayout会基于其自身容器的大小来计算出定位的尺寸数值，但若指定了<b>anchorSize</b>的值，AnchorLayout就会
 * 按照该尺寸生成一个虚拟的容器，在这个虚拟容器上计算出定位尺寸，使得定位逻辑和父容器相分离，可实现独立调节大小。<br />
 * AnchorLayout does not have any direct config options (other than inherited ones).  However, the container
 * using the AnchorLayout can supply an anchoring-specific config property of <b>anchorSize</b>.  By default,
 * AnchorLayout will calculate anchor measurements based on the size of the container itself.  However, if
 * anchorSize is specifed, the layout will use it as a virtual container for the purposes of calculating anchor
 * measurements based on it instead, allowing the container to be sized independently of the anchoring logic if necessary.</p>
 * <p>
 * AnchorLayout所添加的子类都支持<b>anchorSize</b>的配置项属性，这是一个字符串，包含两种值：水平定位值和垂直定位值（例如，'100% 50%'）。
 * 这个值便是告知子项应该怎么在容器内定位。可使用的定位值有下列类型：<br />
 * The items added to an AnchorLayout can also supply an anchoring-specific config property of <b>anchor</b> which
 * is a string containing two values: the horizontal anchor value and the vertical anchor value (for example, '100% 50%').
 * This value is what tells the layout how the item should be anchored to the container.  The following types of
 * anchor values are supported:
 * <ul>
 * <li><b>Percentage</b>: 1到100的任意百分比值。第一个值是容器作用下子项的宽度百分比，第二个值是高度。例如'100% 50%'就是生成完整的宽度和一半高度的子项。
 * 如果指定的是单独的值就意味着高度和宽度都是这个值。<br />
 * Any value between 1 and 100, expressed as a percentage.  The first anchor is the percentage
 * width that the item should take up within the container, and the second is the percentage height.  Example: '100% 50%'
 * would render an item the complete width of the container and 1/2 its height.  If only one anchor value is supplied
 * it is assumed to be the width value and the height will default to auto.</li>
 * <li><b>Offsets</b>: 任意整数值，可为正数或负数。 
 * 第一个值是相当于容器右边缘的便宜值，第二个是相当于底部边缘的偏移值。例如'-50 -100'即表示生成的容器在宽度和高度分别减去50象素和100象素。
 * 若只是指定一个值，那这个值将应用到右偏移而下偏移则缺省为0。<br />
 * Any positive or negative integer value.  The first anchor is the offset from the right edge of
 * the container, and the second is the offset from the bottom edge.  Example: '-50 -100' would render an item the
 * complete width of the container minus 50 pixels and the complete height minus 100 pixels.  If only one anchor value
 * is supplied it is assumed to be the right offset value and the bottom offset will default to 0.</li>
 * <li><b>Sides</b>: 有效的值是'right'（或'r'）和'bottom'（或'b'）。  
 * 要么在容器上设置一个固定的值，要么在渲染时候指定好anchorSize的配置项，才能有正确的效果。<br />
 * Valid values are 'right' (or 'r') and 'bottom' (or 'b').  Either the container must have a fixed
 * size or an anchorSize config value defined at render time in order for these to have any effect.</li>
 * </ul>
 * <p>可灵活设置定位的值。如'-50 75%'就表明这是距离右边缘50像素、容器75%的高度。<br />
 * Anchor values can also be mixed as needed.  For example, '-50 75%' would render the width offset from the
 * container right edge by 50 pixels and 75% of the container's height.</p>
 */
Ext.layout.AnchorLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize:true,

    // private
    getAnchorViewSize : function(ct, target){
        return target.dom == document.body ?
                   target.getViewSize() : target.getStyleSize();
    },

    // private
    onLayout : function(ct, target){
        Ext.layout.AnchorLayout.superclass.onLayout.call(this, ct, target);

        var size = this.getAnchorViewSize(ct, target);

        var w = size.width, h = size.height;

        if(w < 20 && h < 20){
            return;
        }

        // find the container anchoring size
        var aw, ah;
        if(ct.anchorSize){
            if(typeof ct.anchorSize == 'number'){
                aw = ct.anchorSize;
            }else{
                aw = ct.anchorSize.width;
                ah = ct.anchorSize.height;
            }
        }else{
            aw = ct.initialConfig.width;
            ah = ct.initialConfig.height;
        }

        var cs = ct.items.items, len = cs.length, i, c, a, cw, ch;
        for(i = 0; i < len; i++){
            c = cs[i];
            if(c.anchor){
                a = c.anchorSpec;
                if(!a){ // cache all anchor values
                    var vs = c.anchor.split(' ');
                    c.anchorSpec = a = {
                        right: this.parseAnchor(vs[0], c.initialConfig.width, aw),
                        bottom: this.parseAnchor(vs[1], c.initialConfig.height, ah)
                    };
                }
                cw = a.right ? this.adjustWidthAnchor(a.right(w), c) : undefined;
                ch = a.bottom ? this.adjustHeightAnchor(a.bottom(h), c) : undefined;

                if(cw || ch){
                    c.setSize(cw || undefined, ch || undefined);
                }
            }
        }
    },

    // private
    parseAnchor : function(a, start, cstart){
        if(a && a != 'none'){
            var last;
            if(/^(r|right|b|bottom)$/i.test(a)){   // standard anchor
                var diff = cstart - start;
                return function(v){
                    if(v !== last){
                        last = v;
                        return v - diff;
                    }
                }
            }else if(a.indexOf('%') != -1){
                var ratio = parseFloat(a.replace('%', ''))*.01;   // percentage
                return function(v){
                    if(v !== last){
                        last = v;
                        return Math.floor(v*ratio);
                    }
                }
            }else{
                a = parseInt(a, 10);
                if(!isNaN(a)){                            // simple offset adjustment
                    return function(v){
                        if(v !== last){
                            last = v;
                            return v + a;
                        }
                    }
                }
            }
        }
        return false;
    },

    // private
    adjustWidthAnchor : function(value, comp){
        return value;
    },

    // private
    adjustHeightAnchor : function(value, comp){
        return value;
    }
    
    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['anchor'] = Ext.layout.AnchorLayout;