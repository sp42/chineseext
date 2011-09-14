/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
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

/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/*
 * 这些类均为私有内部类
 */
Ext.CenterLayoutRegion = function(mgr, config){
    Ext.CenterLayoutRegion.superclass.constructor.call(this, mgr, config, "center");
    this.visible = true;
    this.minWidth = config.minWidth || 20;
    this.minHeight = config.minHeight || 20;
};

Ext.extend(Ext.CenterLayoutRegion, Ext.LayoutRegion, {
    hide : function(){
        // center 面板不能被隐藏
    },
    
    show : function(){
        // center 面板不能被隐藏
    },
    
    getMinWidth: function(){
        return this.minWidth;
    },
    
    getMinHeight: function(){
        return this.minHeight;
    }
});


Ext.NorthLayoutRegion = function(mgr, config){
    Ext.NorthLayoutRegion.superclass.constructor.call(this, mgr, config, "north", "n-resize");
    if(this.split){
        this.split.placement = Ext.SplitBar.TOP;
        this.split.orientation = Ext.SplitBar.VERTICAL;
        this.split.el.addClass("x-layout-split-v");
    }
    var size = config.initialSize || config.height;
    if(typeof size != "undefined"){
        this.el.setHeight(size);
    }
};
Ext.extend(Ext.NorthLayoutRegion, Ext.SplitLayoutRegion, {
    orientation: Ext.SplitBar.VERTICAL,
    getBox : function(){
        if(this.collapsed){
            return this.collapsedEl.getBox();
        }
        var box = this.el.getBox();
        if(this.split){
            box.height += this.split.el.getHeight();
        }
        return box;
    },
    
    updateBox : function(box){
        if(this.split && !this.collapsed){
            box.height -= this.split.el.getHeight();
            this.split.el.setLeft(box.x);
            this.split.el.setTop(box.y+box.height);
            this.split.el.setWidth(box.width);
        }
        if(this.collapsed){
            this.updateBody(box.width, null);
        }
        Ext.NorthLayoutRegion.superclass.updateBox.call(this, box);
    }
});

Ext.SouthLayoutRegion = function(mgr, config){
    Ext.SouthLayoutRegion.superclass.constructor.call(this, mgr, config, "south", "s-resize");
    if(this.split){
        this.split.placement = Ext.SplitBar.BOTTOM;
        this.split.orientation = Ext.SplitBar.VERTICAL;
        this.split.el.addClass("x-layout-split-v");
    }
    var size = config.initialSize || config.height;
    if(typeof size != "undefined"){
        this.el.setHeight(size);
    }
};
Ext.extend(Ext.SouthLayoutRegion, Ext.SplitLayoutRegion, {
    orientation: Ext.SplitBar.VERTICAL,
    getBox : function(){
        if(this.collapsed){
            return this.collapsedEl.getBox();
        }
        var box = this.el.getBox();
        if(this.split){
            var sh = this.split.el.getHeight();
            box.height += sh;
            box.y -= sh;
        }
        return box;
    },
    
    updateBox : function(box){
        if(this.split && !this.collapsed){
            var sh = this.split.el.getHeight();
            box.height -= sh;
            box.y += sh;
            this.split.el.setLeft(box.x);
            this.split.el.setTop(box.y-sh);
            this.split.el.setWidth(box.width);
        }
        if(this.collapsed){
            this.updateBody(box.width, null);
        }
        Ext.SouthLayoutRegion.superclass.updateBox.call(this, box);
    }
});

Ext.EastLayoutRegion = function(mgr, config){
    Ext.EastLayoutRegion.superclass.constructor.call(this, mgr, config, "east", "e-resize");
    if(this.split){
        this.split.placement = Ext.SplitBar.RIGHT;
        this.split.orientation = Ext.SplitBar.HORIZONTAL;
        this.split.el.addClass("x-layout-split-h");
    }
    var size = config.initialSize || config.width;
    if(typeof size != "undefined"){
        this.el.setWidth(size);
    }
};
Ext.extend(Ext.EastLayoutRegion, Ext.SplitLayoutRegion, {
    orientation: Ext.SplitBar.HORIZONTAL,
    getBox : function(){
        if(this.collapsed){
            return this.collapsedEl.getBox();
        }
        var box = this.el.getBox();
        if(this.split){
            var sw = this.split.el.getWidth();
            box.width += sw;
            box.x -= sw;
        }
        return box;
    },

    updateBox : function(box){
        if(this.split && !this.collapsed){
            var sw = this.split.el.getWidth();
            box.width -= sw;
            this.split.el.setLeft(box.x);
            this.split.el.setTop(box.y);
            this.split.el.setHeight(box.height);
            box.x += sw;
        }
        if(this.collapsed){
            this.updateBody(null, box.height);
        }
        Ext.EastLayoutRegion.superclass.updateBox.call(this, box);
    }
});

Ext.WestLayoutRegion = function(mgr, config){
    Ext.WestLayoutRegion.superclass.constructor.call(this, mgr, config, "west", "w-resize");
    if(this.split){
        this.split.placement = Ext.SplitBar.LEFT;
        this.split.orientation = Ext.SplitBar.HORIZONTAL;
        this.split.el.addClass("x-layout-split-h");
    }
    var size = config.initialSize || config.width;
    if(typeof size != "undefined"){
        this.el.setWidth(size);
    }
};
Ext.extend(Ext.WestLayoutRegion, Ext.SplitLayoutRegion, {
    orientation: Ext.SplitBar.HORIZONTAL,
    getBox : function(){
        if(this.collapsed){
            return this.collapsedEl.getBox();
        }
        var box = this.el.getBox();
        if(this.split){
            box.width += this.split.el.getWidth();
        }
        return box;
    },
    
    updateBox : function(box){
        if(this.split && !this.collapsed){
            var sw = this.split.el.getWidth();
            box.width -= sw;
            this.split.el.setLeft(box.x+box.width);
            this.split.el.setTop(box.y);
            this.split.el.setHeight(box.height);
        }
        if(this.collapsed){
            this.updateBody(null, box.height);
        }
        Ext.WestLayoutRegion.superclass.updateBox.call(this, box);
    }
});
