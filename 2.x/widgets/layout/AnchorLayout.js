/**
 * @class Ext.layout.AnchorLayout
 * @extends Ext.layout.ContainerLayout
 * <p>  
 * 相对于容器四周的尺寸大小，对其包含在内的元素进行定位式（Anchoring）的布局。
 * 如果容器大小发生变化，所有已固定的项都会随着定位规则而变化（按照规则自动渲染）。
 * 应通过继承此类或设置{@link Ext.Container#layout}的配置layout:'anchor' 的方式创建，一般很少通过关键字new直接使用。</p>
 * <p>AnchorLayout不存在任何直接的配置项(other than inherited ones).
 * 不过使用这种AnchorLayot的布局就可使用针对该布局的<b>anchorSize</b>配置项属性进行设置。
 * 缺省下，AnchorLayout会基于其自身容器的大小来计算出定位的尺寸数值，但若指定了achorSize的值，AnchorLayout就会
 * 按照该尺寸生成一个虚拟的容器，在这个虚拟容器上计算出定位尺寸，使得定位逻辑和父容器相分离，可实现独立调节大小</p>
 * <p>AnchorLayout的子项都支持<b>anchorSize</b>的配置项属性，这是一个字符串，包含两种值：水平定位值和垂直定位值（例如，'100% 50%'）。
 * 这个值便是告知子项应该怎么在容器内定位。
 * 可使用的定位值有下列类型：
 * <ul>
 * <li><b>Percentage</b>: 1到100的任意百分比值。第一个值是容器作用下子项的宽度百分比，第二个值是高度。例如'100% 50%'就是生成完整的宽度和一半高度的子项。
 * 如果指定的是单独的值就意味着高度和宽度都是这个值。</li>
 * <li><b>Offsets</b>：任意整数值，可为正数或负数。 
 * 第一个值是相当于容器右边缘的便宜值，第二个是相当于底部边缘的偏移值。例如'-50 -100'即表示生成的容器在宽度和高度分别减去50象素和100象素。
 * 若只是指定一个值，那这个值将应用到右偏移而下偏移则缺省为0。</li>
 * <li><b>Sides</b>：有效的值是 'right'（或 'r'）和'bottom'（或 'b'）。  
 * 要么在容器上设置一个固定的值，要么在渲染时候指定好anchorSize的配置项，才能有正确的效果。</li>
 * </ul>
 * <p>可灵活设置定位的值。如'-50 75%'。</p>
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

        if(w < 20 || h < 20){
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