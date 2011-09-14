/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://www.extjs.com/license
 */

/*
 * These classes are derivatives of the similarly named classes in the YUI Library.
 * The original license:
 * Copyright (c) 2006, Yahoo! Inc. All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.yahoo.net/yui/license.txt
 */

(function() {

var Event=Ext.EventManager;
var Dom=Ext.lib.Dom;
/**
 * 对于可被拖动（drag）或可被放下（drop）的目标，进行接口和各项基本操作的定义。
 * 你应该通过继承的方式使用该类，并重写startDrag, onDrag, onDragOver和onDragOut的事件处理器，.
 * 		共有三种html元素可以被关联到DragDrop实例：
 *  	<ul>
 * 		<li>关联元素（linked element）：传入到构造器的元素。
 * 			这是一个为与其它拖放对象交互定义边界的元素</li>
 * 		<li>执行元素（handle element）：只有被点击的元素是执行元素，
 * 			这个拖动操作才会发生。默认就是关联元素，不过有情况你只是想关联元素的某一部分
 * 			来初始化拖动操作。可用setHandleElId()方法重新定义</li>
 * 		<li>拖动元素（drag element）：表示在拖放过程中，参与和鼠标指针一起的那个元素。
 * 			默认就是关联元素本身，如{@link Ext.dd.DD}，setDragElId()可让你定义一个
 * 			可移动的独立元素，如{@link Ext.dd.DDProxy}</li>
 * 		</ul>
 */
/**
 * 必须在onload事件发生之后才能实例化这个类，以保证关联元素已准备可用。
 * 下列语句会将拖放对象放进"group1"的组中，与组内其他拖放对象交互：
 * <pre>
 *  dd = new Ext.dd.DragDrop("div1", "group1");
 * </pre>
 * 由于没有实现任何的事件处理器，所以上面的代码运行后不会有实际的效果发生。
 * 通常的做法是你要先重写这个类或者某个默的实现，但是你可以重写你想出现在这个实例上的方法
 * <pre>
 *  dd.onDragDrop = function(e, id) {
 *  &nbsp;&nbsp;alert("DD落在" + id+"的身上");
 *  }
 * </pre>
 * @constructor
 * @param {String} id 关联到这个实例的那个元素的id
 * @param {String} sGroup 相关拖放对象的组
 * @param {object} config 包含可配置的对象属性
 *                DragDrop的有效属性：
 *                    padding, isTarget, maintainOffset, primaryButtonOnly
 */
Ext.dd.DragDrop = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
    }
};

Ext.dd.DragDrop.prototype = {

    /**
     * 关联该对象元素之id，这便是我们所提及的“关联元素”，
     * 因为拖动过程中的交互行为取决于该元素的大小和尺寸。
     * @property id
     * @type String
     */
    id: null,

    /**
     * 传入构造器的配置项对象
     * @property config
     * @type object
     */
    config: null,

    /**
     * 被拖动的元素id，默认与关联元素相同，但可替换为其他元素，如：Ext.dd.DDProxy
     * @property dragElId
     * @type String
     * @private
     */
    dragElId: null,

    /**
     * 初始化拖动操作的元素id，这是一个关联元素，但可改为这个元素的子元素。
     * @property handleElId
     * @type String
     * @private
     */
    handleElId: null,

    /**
     * 点击时要忽略的HTML标签名称。
     * @property invalidHandleTypes
     * @type {string: string}
     */
    invalidHandleTypes: null,

    /**
     * 点击时要忽略的元素id。
     * @property invalidHandleIds
     * @type {string: string}
     */
    invalidHandleIds: null,

    /**
     * 点击时要忽略的元素的css样式类名称所组成的数组。
     * @property invalidHandleClasses
     * @type string[]
     */
    invalidHandleClasses: null,

    /**
     * 拖动开始时的x绝对位置
     * @property startPageX
     * @type int
     * @private
     */
    startPageX: 0,

    /**
     * 拖动开始时的y绝对位置
     * @property startPageY
     * @type int
     * @private
     */
    startPageY: 0,

    /**
     * 组（Group)定义，相关拖放对象的逻辑集合。
     * 实例只能通过事件与同一组下面的其他拖放对象交互。
     * 这使得我们可以将多个组定义在同一个子类下面。
     * @property groups
     * @type {string: string}
     */
    groups: null,

    /**
     * 每个拖动/落下的实例可被锁定。
     * 这会禁止onmousedown开始拖动。
     * @property locked
     * @type boolean
     * @private
     */
    locked: false,

    /**
     * 锁定实例
     * @method lock
     */
    lock: function() { this.locked = true; },

    /**
     * 解锁实例
     * @method unlock
     */
    unlock: function() { this.locked = false; },

    /**
     * 默认地，所有实例可以是降落目标。
     * 该项可设置isTarget为false来禁止。
     * @method isTarget
     * @type boolean
     */
    isTarget: true,

    /**
     * 当拖放对象与落下区域交互时的外补丁配置。
     * @method padding
     * @type int[]
     */
    padding: null,

    /**
     * 缓存关联元素的引用。
     * @property _domRef
     * @private
     */
    _domRef: null,

    /**
     * Internal typeof flag
     * @property __ygDragDrop
     * @private
     */
    __ygDragDrop: true,

    /**
     * 当水平约束应用时为true。
     * @property constrainX
     * @type boolean
     * @private
     */
    constrainX: false,

    /**
     * 当垂直约束应用时为false。
     * @property constrainY
     * @type boolean
     * @private
     */
    constrainY: false,

    /**
     * 左边坐标
     * @property minX
     * @type int
     * @private
     */
    minX: 0,

    /**
     * 右边坐标
     * @property maxX
     * @type int
     * @private
     */
    maxX: 0,

    /**
     * 上方坐标
     * @property minY
     * @type int
     * @type int
     * @private
     */
    minY: 0,

    /**
     * 下方坐标
     * @property maxY
     * @type int
     * @private
     */
    maxY: 0,

    /**
     * 当重置限制时（constraints）修正偏移。
     * 如果你想在页面变动时，元素的位置与其父级元素的位置不发生变化，可设为true。
     * @property maintainOffset
     * @type boolean
     */
    maintainOffset: false,

    /**
     * 如果我们指定一个垂直的间隔值，元素会作一个象素位置的取样，放到数组中。
     * 如果你定义了一个tick interval，该数组将会自动生成。
     * @property xTicks
     * @type int[]
     */
    xTicks: null,

    /**
     * 如果我们指定一个水平的间隔值，元素会作一个象素位置的取样，放到数组中。
     * 如果你定义了一个tick interval，该数组将会自动生成。
     * @property yTicks
     * @type int[]
     */
    yTicks: null,

    /**
     * 默认下拖放的实例只会响应主要的按钮键（左键和右键）。
     * 设置为true表示开放其他的鼠标的键，只要是浏览器支持的。
     * @property primaryButtonOnly
     * @type boolean
     */
    primaryButtonOnly: true,

    /**
     * 关联的dom元素访问之后该属性才为false。
     * @property available
     * @type boolean
     */
    available: false,

    /**
     * 默认状态下，拖动只会是mousedown发生在关联元素的区域才会初始化。
     * 但是因为某些浏览器的bug,如果之前的mouseup发生在window外部地方，浏览器会漏报告这个事件。
     * 如果已定义外部的处理，这个属性应该设置为true.
     * @property hasOuterHandles
     * @type boolean
     * @default false
     */
    hasOuterHandles: false,

    /**
     * 在startDrag时间之前立即执行的代码。
     * @method b4StartDrag
     * @private
     */
    b4StartDrag: function(x, y) { },

    /**
     * 抽象方法：在拖放对象被点击后和已跨入拖动或mousedown启动时间的时候调用。
     * @method startDrag
     * @param {int} X 方向点击位置
     * @param {int} Y 方向点击位置
     */
    startDrag: function(x, y) { /* override this */ },

    /**
     * onDrag事件发生之前执行的代码。
     * @method b4Drag
     * @private
     */
    b4Drag: function(e) { },

    /**
     * 抽象方法：当拖动某个对象时发生onMouseMove时调用。
     * @method onDrag
     * @param {Event} e mousemove事件
     */
    onDrag: function(e) { /* override this */ },

    /**
     * 抽象方法：在这个元素刚刚开始悬停在其他DD对象身上时调用。
     * @method onDragEnter
     * @param {Event} e mousemove事件
     * @param {String|DragDrop[]} id 在POINT模式中, 是悬浮中的元素id；在INTERSECT模式中, 是DD项组成的数组
     */
    onDragEnter: function(e, id) { /* override this */ },

    /**
     * onDragOver事件发生在前执行的代码。
     * @method b4DragOver
     * @private
     */
    b4DragOver: function(e) { },

    /**
     * 抽象方法：在这个元素悬停在其他DD对象范围内的调用。
     * @method onDragOver
     * @param {Event} e mousemove事件
     * @param {String|DragDrop[]} id 在POINT模式中, 是悬浮中的元素id；在INTERSECT模式中, 是DD项组成的数组
     */
    onDragOver: function(e, id) { /* override this */ },

    /**
     * onDragOut事件发生之前执行的代码。
     * @method b4DragOut
     * @private
     */
    b4DragOut: function(e) { },

    /**
     * 抽象方法：当不再有任何悬停DD对象的时候调用。
     * @method onDragOut
     * @param {Event} e mousemove事件
     * @param {String|DragDrop[]} id 在POINT模式中, 是悬浮中的元素id；在INTERSECT模式中, DD项不再悬浮。
     */
    onDragOut: function(e, id) { /* override this */ },

    /**
     * onDragDrop事件发生之前执行的代码。
     * @method b4DragDrop
     * @private
     */
    b4DragDrop: function(e) { },

    /**
     * 抽象方法：该项在另外一个DD对象上落下的时候调用。
     * @method onDragDrop
     * @param {Event} e mouseup事件
     * @param {String|DragDrop[]} id 在POINT模式中, 是悬浮中的元素id；在INTERSECT模式中, 是DD项组成的数组
     */
    onDragDrop: function(e, id) { /* override this */ },

    /**
     * 抽象方法：当各项在一个没有置下目标的地方置下时调用。
     * @method onInvalidDrop
     * @param {Event} e mouseup事件
     */
    onInvalidDrop: function(e) { /* override this */ },

    /**
     * 在endDrag事件触发之前立即执行的代码。
     * @method b4EndDrag
     * @private
     */
    b4EndDrag: function(e) { },

    /**
     * 当我们完成拖动对象时触发的事件。
     * @method endDrag
     * @param {Event} e mouseup事件
     */
    endDrag: function(e) { /* override this */ },

    /**
     * 在onMouseDown事件触发之前立即执行的代码。
     * @method b4MouseDown
     * @param {Event} e mousedown事件
     * @private
     */
    b4MouseDown: function(e) {  },

    /**
     * 当拖放对象mousedown触发时的事件处理器。
     * @method onMouseDown
     * @param {Event} e mousedown事件
     */
    onMouseDown: function(e) { /* override this */ },

    /**
     * 当DD对象发生mouseup事件时的事件处理器。
     * @method onMouseUp
     * @param {Event} e mouseup事件
     */
    onMouseUp: function(e) { /* override this */ },

    /**
     * 重写onAvailable的方法以便我们在初始化之后做所需要的事情
     * position was determined.
     * @method onAvailable
     */
    onAvailable: function () {
    },

    /*
     * 为“constrainTo”的元素提供默认的外补丁限制。默认为{left: 0, right:0, top:0, bottom:0}
     * @type Object
     */
    defaultPadding : {left:0, right:0, top:0, bottom:0},

    /**
     *
     * 初始化拖放对象的限制，以便控制在某个元的范围内移动
 * 举例：
 <pre><code>
 var dd = new Ext.dd.DDProxy("dragDiv1", "proxytest",
                { dragElId: "existingProxyDiv" });
 dd.startDrag = function(){
     this.constrainTo("parent-id");
 };
 </code></pre>
 *或者你可以使用 {@link Ext.Element}对象初始化它：
 <pre><code>
 Ext.get("dragDiv1").initDDProxy("proxytest", {dragElId: "existingProxyDiv"}, {
     startDrag : function(){
         this.constrainTo("parent-id");
     }
 });
 </code></pre>
     * @param {String/HTMLElement/Element} constrainTo 要限制的元素
     * @param {Object/Number} pad (可选的) Pad提供了指定“外补丁”的限制的一种方式。
     * 例如 {left:4, right:4, top:4, bottom:4})或{right:10, bottom:10}
     * @param {Boolean} inContent (可选的) 限制在元素的正文内容内拖动（包含外补丁和边框）
     */
    constrainTo : function(constrainTo, pad, inContent){
        if(typeof pad == "number"){
            pad = {left: pad, right:pad, top:pad, bottom:pad};
        }
        pad = pad || this.defaultPadding;
        var b = Ext.get(this.getEl()).getBox();
        var ce = Ext.get(constrainTo);
        var s = ce.getScroll();
        var c, cd = ce.dom;
        if(cd == document.body){
            c = { x: s.left, y: s.top, width: Ext.lib.Dom.getViewWidth(), height: Ext.lib.Dom.getViewHeight()};
        }else{
            xy = ce.getXY();
            c = {x : xy[0]+s.left, y: xy[1]+s.top, width: cd.clientWidth, height: cd.clientHeight};
        }


        var topSpace = b.y - c.y;
        var leftSpace = b.x - c.x;

        this.resetConstraints();
        this.setXConstraint(leftSpace - (pad.left||0), // left
                c.width - leftSpace - b.width - (pad.right||0) //right
        );
        this.setYConstraint(topSpace - (pad.top||0), //top
                c.height - topSpace - b.height - (pad.bottom||0) //bottom
        );
    },

    /**
     * 返回关联元素的引用
     * @method getEl
     * @return {HTMLElement} html元素
     */
    getEl: function() {
        if (!this._domRef) {
            this._domRef = Ext.getDom(this.id);
        }

        return this._domRef;
    },

    /**
     * 返回实际拖动元素的引用，默认时和html element一样，不过它可分配给其他元素，可在这里找到。
     * @method getDragEl
     * @return {HTMLElement} html元素
     */
    getDragEl: function() {
        return Ext.getDom(this.dragElId);
    },

    /**
     * 设置拖放对象，须在Ext.dd.DragDrop子类的构造器调用。
     * @method init
     * @param id 关联元素之id
     * @param {String} sGroup 相关项的组
     * @param {object} config 配置属性
     */
    init: function(id, sGroup, config) {
        this.initTarget(id, sGroup, config);
        Event.on(this.id, "mousedown", this.handleMouseDown, this);
        // Event.on(this.id, "selectstart", Event.preventDefault);
    },

    /**
     * 只是有针对性的初始化目标...对象获取不了mousedown handler
     * @method initTarget
     * @param id 关联元素之id
     * @param {String} sGroup 相关项的组
     * @param {object} config 配置属性
     */
    initTarget: function(id, sGroup, config) {

        // configuration attributes
        this.config = config || {};

        // create a local reference to the drag and drop manager
        this.DDM = Ext.dd.DDM;
        // initialize the groups array
        this.groups = {};

        // assume that we have an element reference instead of an id if the
        // parameter is not a string
        if (typeof id !== "string") {
            id = Ext.id(id);
        }

        // set the id
        this.id = id;

        // add to an interaction group
        this.addToGroup((sGroup) ? sGroup : "default");

        // We don't want to register this as the handle with the manager
        // so we just set the id rather than calling the setter.
        this.handleElId = id;

        // the linked element is the element that gets dragged by default
        this.setDragElId(id);

        // by default, clicked anchors will not start drag operations.
        this.invalidHandleTypes = { A: "A" };
        this.invalidHandleIds = {};
        this.invalidHandleClasses = [];

        this.applyConfig();

        this.handleOnAvailable();
    },

    /**
     * 将配置参数应用到构造器。该方法应该在继承链上的每一个环节调用。
     * 所以为了获取每个对象的可用参数，配置将会由DDPRoxy实现应用在DDProxy， DD，DragDrop身上。
     * @method applyConfig
     */
    applyConfig: function() {

        // configurable properties:
        //    padding, isTarget, maintainOffset, primaryButtonOnly
        this.padding           = this.config.padding || [0, 0, 0, 0];
        this.isTarget          = (this.config.isTarget !== false);
        this.maintainOffset    = (this.config.maintainOffset);
        this.primaryButtonOnly = (this.config.primaryButtonOnly !== false);

    },

    /**
     * 当关联元素有效时执行。
     * @method handleOnAvailable
     * @private
     */
    handleOnAvailable: function() {
        this.available = true;
        this.resetConstraints();
        this.onAvailable();
    },

     /**
     * 配置目标区域的外补丁（px）。
     * @method setPadding
     * @param {int} iTop    Top pad
     * @param {int} iRight  Right pad
     * @param {int} iBot    Bot pad
     * @param {int} iLeft   Left pad
     */
    setPadding: function(iTop, iRight, iBot, iLeft) {
        // this.padding = [iLeft, iRight, iTop, iBot];
        if (!iRight && 0 !== iRight) {
            this.padding = [iTop, iTop, iTop, iTop];
        } else if (!iBot && 0 !== iBot) {
            this.padding = [iTop, iRight, iTop, iRight];
        } else {
            this.padding = [iTop, iRight, iBot, iLeft];
        }
    },

    /**
     * 储存关联元素的初始位置。
     * @method setInitialPosition
     * @param {int} diffX   X偏移，默认为0
     * @param {int} diffY   Y偏移，默认为0
     */
    setInitPosition: function(diffX, diffY) {
        var el = this.getEl();

        if (!this.DDM.verifyEl(el)) {
            return;
        }

        var dx = diffX || 0;
        var dy = diffY || 0;

        var p = Dom.getXY( el );

        this.initPageX = p[0] - dx;
        this.initPageY = p[1] - dy;

        this.lastPageX = p[0];
        this.lastPageY = p[1];


        this.setStartPosition(p);
    },

    /**
     * 设置元素的开始位置。对象初始化时便设置，拖动开始时复位。
     * @method setStartPosition
     * @param pos 当前位置（利用刚才的lookup）
     * @private
     */
    setStartPosition: function(pos) {
        var p = pos || Dom.getXY( this.getEl() );
        this.deltaSetXY = null;
        this.startPageX = p[0];
        this.startPageY = p[1];
    },

    /**
     * 将该对象加入到相关的拖放组之中。
     * 所有组实例至少要分配到一个组，也可以是多个组。
     * @method addToGroup
     * @param sGroup {string} 组名称
     */
    addToGroup: function(sGroup) {
        this.groups[sGroup] = true;
        this.DDM.regDragDrop(this, sGroup);
    },

    /**
     * 传入一个“交互组” interaction group的参数，从中删除该实例。
     * @method removeFromGroup
     * @param {string}  sGroup  组名称
     */
    removeFromGroup: function(sGroup) {
        if (this.groups[sGroup]) {
            delete this.groups[sGroup];
        }

        this.DDM.removeDDFromGroup(this, sGroup);
    },

    /**
     * 允许你指定一个不是被移动的关联元素的元素作为拖动处理。
     * @method setDragElId
     * @param id {string} 将会用于初始拖动的元素id
     */
    setDragElId: function(id) {
        this.dragElId = id;
    },

    /**
     * 允许你指定一个关联元素下面的子元素以初始化拖动操作。
     * 一个例子就是假设你有一段套着div文本和若干连接，点击正文的区域便引发拖动的操作。
     * 使用这个方法来指定正文内的div元素，然后拖动操作就会从这个元素开始了。
     * @method setHandleElId
     * @param id {string} 将会用于初始拖动的元素id
     */
    setHandleElId: function(id) {
        if (typeof id !== "string") {
            id = Ext.id(id);
        }
        this.handleElId = id;
        this.DDM.regHandle(this.id, id);
    },

    /**
     * 允许你在关联元素之外设置一个元素作为拖动处理。
     * @method setOuterHandleElId
     * @param id 将会用于初始拖动的元素id
     */
    setOuterHandleElId: function(id) {
        if (typeof id !== "string") {
            id = Ext.id(id);
        }
        Event.on(id, "mousedown",
                this.handleMouseDown, this);
        this.setHandleElId(id);

        this.hasOuterHandles = true;
    },

    /**
     * 移除所有钩在该元素身上的拖放对象。
     * @method unreg
     */
    unreg: function() {
        Event.un(this.id, "mousedown",
                this.handleMouseDown);
        this._domRef = null;
        this.DDM._remove(this);
    },

    destroy : function(){
        this.unreg();
    },

    /**
     * 返回true表示为该实例已被锁定，或者说是拖放控制器（DD Mgr)被锁定。
     * @method isLocked
     * @return {boolean} true表示禁止页面上的所有拖放操作,反之为false
     */
    isLocked: function() {
        return (this.DDM.isLocked() || this.locked);
    },

    /**
     * 当对象单击时触发。
     * @method handleMouseDown
     * @param {Event} e
     * @param {Ext.dd.DragDrop} 单击的 DD 对象（this DD obj）
     * @private
     */
    handleMouseDown: function(e, oDD){
        if (this.primaryButtonOnly && e.button != 0) {
            return;
        }

        if (this.isLocked()) {
            return;
        }

        this.DDM.refreshCache(this.groups);

        var pt = new Ext.lib.Point(Ext.lib.Event.getPageX(e), Ext.lib.Event.getPageY(e));
        if (!this.hasOuterHandles && !this.DDM.isOverTarget(pt, this) )  {
        } else {
            if (this.clickValidator(e)) {

                // set the initial element position
                this.setStartPosition();


                this.b4MouseDown(e);
                this.onMouseDown(e);

                this.DDM.handleMouseDown(e, this);

                this.DDM.stopEvent(e);
            } else {


            }
        }
    },

    clickValidator: function(e) {
        var target = e.getTarget();
        return ( this.isValidHandleChild(target) &&
                    (this.id == this.handleElId ||
                        this.DDM.handleWasClicked(target, this.id)) );
    },

    /**
     * 指定某个标签名称（tag Name），这个标签的元素单击时便不会引发拖动的操作。
     * 这个设计目的在于某个拖动区域中同时又有链接（links）避免执行拖动的动作。
     * @method addInvalidHandleType
     * @param {string} tagName 避免执行元素的类型
     */
    addInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        this.invalidHandleTypes[type] = type;
    },

    /**
     * 可指定某个元素的id，则这个id下的子元素将不会引发拖动的操作。
     * @method addInvalidHandleId
     * @param {string} id 你希望会被忽略的元素id
     */
    addInvalidHandleId: function(id) {
        if (typeof id !== "string") {
            id = Ext.id(id);
        }
        this.invalidHandleIds[id] = id;
    },

    /**
     * 可指定某个css样式类，则这个css样式类的子元素将不会引发拖动的操作。
     * @method addInvalidHandleClass
     * @param {string} cssClass 你希望会被忽略的css样式类
     */
    addInvalidHandleClass: function(cssClass) {
        this.invalidHandleClasses.push(cssClass);
    },

    /**
     * 移除由addInvalidHandleType方法所执行的标签名称。
     * @method removeInvalidHandleType
     * @param {string} tagName 元素类型
     */
    removeInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        // this.invalidHandleTypes[type] = null;
        delete this.invalidHandleTypes[type];
    },

    /**
     * 移除一个无效的handle id
     * @method removeInvalidHandleId
     * @param {string} id 要再“激活”的元素id
     */
    removeInvalidHandleId: function(id) {
        if (typeof id !== "string") {
            id = Ext.id(id);
        }
        delete this.invalidHandleIds[id];
    },

    /**
     * 移除一个无效的css class
     * @method removeInvalidHandleClass
     * @param {string} cssClass 你希望要再“激活”的元素id
     * re-enable
     */
    removeInvalidHandleClass: function(cssClass) {
        for (var i=0, len=this.invalidHandleClasses.length; i<len; ++i) {
            if (this.invalidHandleClasses[i] == cssClass) {
                delete this.invalidHandleClasses[i];
            }
        }
    },

    /**
     * 检查这次单击是否属于在标签排除列表里。
     * @method isValidHandleChild
     * @param {HTMLElement} node 检测的HTML元素
     * @return {boolean} true 表示为这是一个有效的标签类型，反之为false
     */
    isValidHandleChild: function(node) {

        var valid = true;
        // var n = (node.nodeName == "#text") ? node.parentNode : node;
        var nodeName;
        try {
            nodeName = node.nodeName.toUpperCase();
        } catch(e) {
            nodeName = node.nodeName;
        }
        valid = valid && !this.invalidHandleTypes[nodeName];
        valid = valid && !this.invalidHandleIds[node.id];

        for (var i=0, len=this.invalidHandleClasses.length; valid && i<len; ++i) {
            valid = !Dom.hasClass(node, this.invalidHandleClasses[i]);
        }


        return valid;

    },

    /**
     * 若指定了间隔（interval），将会创建水平点击的标记（horizontal tick marks）的数组。
     * @method setXTicks
     * @private
     */
    setXTicks: function(iStartX, iTickSize) {
        this.xTicks = [];
        this.xTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageX; i >= this.minX; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageX; i <= this.maxX; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.xTicks.sort(this.DDM.numericSort) ;
    },

    /**
     * 若指定了间隔（interval），将会创建垂直点击的标记（horizontal tick marks）的数组。
     * @method setYTicks
     * @private
     */
    setYTicks: function(iStartY, iTickSize) {
        this.yTicks = [];
        this.yTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageY; i >= this.minY; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageY; i <= this.maxY; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.yTicks.sort(this.DDM.numericSort) ;
    },

    /**
     * 默认情况下，元素可被拖动到屏幕的任何一个位置。
     * 使用该方法能限制元素的水平方向上的摇动。
     * 如果打算只限制在Y轴的拖动，可传入0,0的参数。
     * @method setXConstraint
     * @param {int} iLeft 元素向左移动的像素值
     * @param {int} iRight 元素向右移动的像素值
     * @param {int} iTickSize （可选项）指定每次元素移动的步幅。
     */
    setXConstraint: function(iLeft, iRight, iTickSize) {
        this.leftConstraint = iLeft;
        this.rightConstraint = iRight;

        this.minX = this.initPageX - iLeft;
        this.maxX = this.initPageX + iRight;
        if (iTickSize) { this.setXTicks(this.initPageX, iTickSize); }

        this.constrainX = true;
    },

    /**
     * 清除该实例的所有坐标。
     * 也清除ticks，因为这时候已不存在任何的坐标。
     * @method clearConstraints
     */
    clearConstraints: function() {
        this.constrainX = false;
        this.constrainY = false;
        this.clearTicks();
    },

    /**
     * 清除该实例的所有tick间歇定义。
     * @method clearTicks
     */
    clearTicks: function() {
        this.xTicks = null;
        this.yTicks = null;
        this.xTickSize = 0;
        this.yTickSize = 0;
    },

    /**
     * 默认情况下，元素可被拖动到屏幕的任何一个位置。
     * 使用该方法能限制元素的水平方向上的摇动。
     * 如果打算只限制在X轴的拖动，可传入0,0的参数。
     * @method setYConstraint
     * @param {int} iUp 元素向上移动的像素值
     * @param {int} iDown 元素向下移动的像素值
     * @param {int} iTickSize （可选项）指定每次元素移动的步幅。
     */
    setYConstraint: function(iUp, iDown, iTickSize) {
        this.topConstraint = iUp;
        this.bottomConstraint = iDown;

        this.minY = this.initPageY - iUp;
        this.maxY = this.initPageY + iDown;
        if (iTickSize) { this.setYTicks(this.initPageY, iTickSize); }

        this.constrainY = true;

    },

    /**
     * 坐标复位需在你手动重新定位一个DD元素是调用。
     * @method resetConstraints
     * @param {boolean} maintainOffset
     */
    resetConstraints: function() {


        // Maintain offsets if necessary
        if (this.initPageX || this.initPageX === 0) {
            // figure out how much this thing has moved
            var dx = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
            var dy = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;

            this.setInitPosition(dx, dy);

        // This is the first time we have detected the element's position
        } else {
            this.setInitPosition();
        }

        if (this.constrainX) {
            this.setXConstraint( this.leftConstraint,
                                 this.rightConstraint,
                                 this.xTickSize        );
        }

        if (this.constrainY) {
            this.setYConstraint( this.topConstraint,
                                 this.bottomConstraint,
                                 this.yTickSize         );
        }
    },

    /**
     * 通常情况下拖动元素是逐个像素地移动的。
     * 不过我们也可以指定一个移动的数值。
     * @method getTick
     * @param {int} val 打算将对象放到的地方
     * @param {int[]} tickArray 已排序的有效点
     * @return {int} 最近的点
     * @private
     */
    getTick: function(val, tickArray) {

        if (!tickArray) {
            // If tick interval is not defined, it is effectively 1 pixel,
            // so we return the value passed to us.
            return val;
        } else if (tickArray[0] >= val) {
            // The value is lower than the first tick, so we return the first
            // tick.
            return tickArray[0];
        } else {
            for (var i=0, len=tickArray.length; i<len; ++i) {
                var next = i + 1;
                if (tickArray[next] && tickArray[next] >= val) {
                    var diff1 = val - tickArray[i];
                    var diff2 = tickArray[next] - val;
                    return (diff2 > diff1) ? tickArray[i] : tickArray[next];
                }
            }

            // The value is larger than the last tick, so we return the last
            // tick.
            return tickArray[tickArray.length - 1];
        }
    },

    /**
     * toString方法
     * @method toString
     * @return {string} string 表示DD对象之字符
     */
    toString: function() {
        return ("DragDrop " + this.id);
    }

};

})();
/**
 * The drag and drop utility provides a framework for building drag and drop
 * applications.  In addition to enabling drag and drop for specific elements,
 * the drag and drop elements are tracked by the manager class, and the
 * interactions between the various elements are tracked during the drag and
 * the implementing code is notified about these important moments.
 */

// Only load the library once.  Rewriting the manager class would orphan
// existing drag and drop instances.
if (!Ext.dd.DragDropMgr) {

/**
 * @class Ext.dd.DragDropMgr
 * DragDropMgr是一个对窗口内所有拖放项跟踪元素交互过程的单例。
 * 一般来说你不会直接调用该类，但是你所实现的拖放中，会提供一些有用的方法。
 * @singleton
 */
Ext.dd.DragDropMgr = function() {

    var Event = Ext.EventManager;

    return {

        /**
         * 已登记拖放对象的二维数组。
         * 第一维是拖放项的组，第二维是拖放对象。
         * @property ids
         * @type {string: string}
         * @private
         * @static
         */
        ids: {},

        /**
         * 元素id组成的数组，由拖动处理定义。
         * 如果元素触发了mousedown事件实际上是一个处理（handle）而非html元素本身。
         * @property handleIds
         * @type {string: string}
         * @private
         * @static
         */
        handleIds: {},

        /**
         * 正在被拖放的DD对象。
         * @property dragCurrent
         * @type DragDrop
         * @private
         * @static
         **/
        dragCurrent: null,

        /**
         * 正被悬浮着的拖放对象。
         * @property dragOvers
         * @type Array
         * @private
         * @static
         */
        dragOvers: {},

        /**
         * 正被拖动对象与指针之间的X间距。
         * @property deltaX
         * @type int
         * @private
         * @static
         */
        deltaX: 0,

        /**
         * 正被拖动对象与指针之间的Y间距。
         * @property deltaY
         * @type int
         * @private
         * @static
         */
        deltaY: 0,

        /**
         * 一个是否应该阻止我们所定义的默认行为的标识。
         * 默认为true，如需默认的行为可设为false（但不推荐）。
         * @property preventDefault
         * @type boolean
         * @static
         */
        preventDefault: true,

        /**
         * 一个是否在该停止事件繁殖的标识（events propagation）。
         * 默认下为true，但如果HTML元素包含了其他mouse点击的所需功能，就可设为false。
         * @property stopPropagation
         * @type boolean
         * @static
         */
        stopPropagation: true,

        /**
         * 一个内置使用的标识，True说明拖放已被初始化。
         * @property initialized
         * @private
         * @static
         */
        initalized: false,

        /**
         * 所有拖放的操作可被禁用。
         * @property locked
         * @private
         * @static
         */
        locked: false,

        /**
         * 元素首次注册时调用。
         * @method init
         * @private
         * @static
         */
        init: function() {
            this.initialized = true;
        },

        /**
         * 由拖放过程中的鼠标指针来定义拖放的交互操作。
         * @property POINT
         * @type int
         * @static
         */
        POINT: 0,

        /**
         * Intersect模式下，拖放的交互是由两个或两个以上的拖放对象的重叠来定义。
         * @property INTERSECT
         * @type int
         * @static
         */
        INTERSECT: 1,

        /**
         * 当前拖放的模式，默认为：POINT
         * @property mode
         * @type int
         * @static
         */
        mode: 0,

        /**
         * 在拖放对象上运行方法
         * @method _execOnAll
         * @private
         * @static
         */
        _execOnAll: function(sMethod, args) {
            for (var i in this.ids) {
                for (var j in this.ids[i]) {
                    var oDD = this.ids[i][j];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }
                    oDD[sMethod].apply(oDD, args);
                }
            }
        },

        /**
         * 拖放的初始化，设置全局的事件处理器。
         * @method _onLoad
         * @private
         * @static
         */
        _onLoad: function() {

            this.init();


            Event.on(document, "mouseup",   this.handleMouseUp, this, true);
            Event.on(document, "mousemove", this.handleMouseMove, this, true);
            Event.on(window,   "unload",    this._onUnload, this, true);
            Event.on(window,   "resize",    this._onResize, this, true);
            // Event.on(window,   "mouseout",    this._test);

        },

        /**
         * 重置拖放对象身上的全部限制。
         * @method _onResize
         * @private
         * @static
         */
        _onResize: function(e) {
            this._execOnAll("resetConstraints", []);
        },

        /**
         * 锁定拖放的功能。
         * @method lock
         * @static
         */
        lock: function() { this.locked = true; },

        /**
         * 解锁拖放的功能。
         * @method unlock
         * @static
         */
        unlock: function() { this.locked = false; },

        /**
         * 拖放是否已锁定？
         * @method isLocked
         * @return {boolean} True 表示为拖放已锁定，反之为false。
         * @static
         */
        isLocked: function() { return this.locked; },

        /**
         * 拖动一开始，就会有“局部缓存”伴随着拖放对象，而拖动完毕就会清除。
         * @property locationCache
         * @private
         * @static
         */
        locationCache: {},

        /**
         * 设置useCache为false的话，表示你想强制对象不断在每个拖放关联对象中轮询。
         * @property useCache
         * @type boolean
         * @static
         */
        useCache: true,

        /**
         * 在mousedown之后，拖动初始化之前，鼠标需要移动的像素值。默认值为3
         * @property clickPixelThresh
         * @type int
         * @static
         */
        clickPixelThresh: 3,

        /**
         * 在mousedown事件触发之后，接着开始拖动但不想触发mouseup的事件的毫秒数。默认值为1000
         * @property clickTimeThresh
         * @type int
         * @static
         */
        clickTimeThresh: 350,

        /**
         * 每当满足拖动像素或mousedown时间的标识。
         * @property dragThreshMet
         * @type boolean
         * @private
         * @static
         */
        dragThreshMet: false,

        /**
         * 开始点击的超时时限。
         * @property clickTimeout
         * @type Object
         * @private
         * @static
         */
        clickTimeout: null,

        /**
         * 拖动动作刚开始，保存mousedown事件的X位置。
         * @property startX
         * @type int
         * @private
         * @static
         */
        startX: 0,

        /**
         * 拖动动作刚开始，保存mousedown事件的Y位置。
         * @property startY
         * @type int
         * @private
         * @static
         */
        startY: 0,

        /**
         * 每个拖放实例必须在DragDropMgr登记好的。
         * @method regDragDrop
         * @param {DragDrop} oDD 要登记的拖动对象
         * @param {String} sGroup 元素所属的组名称
         * @static
         */
        regDragDrop: function(oDD, sGroup) {
            if (!this.initialized) { this.init(); }

            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }
            this.ids[sGroup][oDD.id] = oDD;
        },

        /**
         * 传入两个参数oDD、sGroup，从传入的组之中删除DD实例。
         * 由DragDrop.removeFromGroup执行，所以不会直接调用这个函数。
         * @method removeDDFromGroup
         * @private
         * @static
         */
        removeDDFromGroup: function(oDD, sGroup) {
            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }

            var obj = this.ids[sGroup];
            if (obj && obj[oDD.id]) {
                delete obj[oDD.id];
            }
        },

        /**
         * 注销拖放项，由DragDrop.unreg所调用，直接使用那个方法即可。
         * @method _remove
         * @private
         * @static
         */
        _remove: function(oDD) {
            for (var g in oDD.groups) {
                if (g && this.ids[g][oDD.id]) {
                    delete this.ids[g][oDD.id];
                }
            }
            delete this.handleIds[oDD.id];
        },

        /**
         * 每个拖放处理元素必须先登记。
         * 执行DragDrop.setHandleElId()时会自动完成这工作。
         * @method regHandle
         * @param {String} sDDId 处理拖放对象的id
         * @param {String} sHandleId 在拖动的元素id
         * handle
         * @static
         */
        regHandle: function(sDDId, sHandleId) {
            if (!this.handleIds[sDDId]) {
                this.handleIds[sDDId] = {};
            }
            this.handleIds[sDDId][sHandleId] = sHandleId;
        },

        /**
         * 确认一个元素是否属于已注册的拖放项的实用函数。
         * @method isDragDrop
         * @param {String} id 要检查的元素id
         * @return {boolean} true 表示为该元素是一个拖放项，反之为false
         * @static
         */
        isDragDrop: function(id) {
            return ( this.getDDById(id) ) ? true : false;
        },

        /**
         * 传入一个拖放实例的参数，返回在这个实例“组”下面的全部其他拖放实例。
         * @method getRelated
         * @param {DragDrop} p_oDD 获取相关数据的对象
         * @param {boolean} bTargetsOnly if true 表示为只返回目标对象
         * @return {DragDrop[]} 相关的实例
         * @static
         */
        getRelated: function(p_oDD, bTargetsOnly) {
            var oDDs = [];
            for (var i in p_oDD.groups) {
                for (j in this.ids[i]) {
                    var dd = this.ids[i][j];
                    if (! this.isTypeOfDD(dd)) {
                        continue;
                    }
                    if (!bTargetsOnly || dd.isTarget) {
                        oDDs[oDDs.length] = dd;
                    }
                }
            }

            return oDDs;
        },

        /**
         * 针对某些特定的拖动对象，如果传入的dd目标是合法的目标，返回ture。
         * @method isLegalTarget
         * @param {DragDrop} 拖动对象
         * @param {DragDrop} 目标
         * @return {boolean} true 表示为目标是dd对象合法
         * @static
         */
        isLegalTarget: function (oDD, oTargetDD) {
            var targets = this.getRelated(oDD, true);
            for (var i=0, len=targets.length;i<len;++i) {
                if (targets[i].id == oTargetDD.id) {
                    return true;
                }
            }

            return false;
        },

        /**
         * My goal is to be able to transparently determine if an object is
         * typeof DragDrop, and the exact subclass of DragDrop.  typeof
         * returns "object", oDD.constructor.toString() always returns
         * "DragDrop" and not the name of the subclass.  So for now it just
         * evaluates a well-known variable in DragDrop.
         * @method isTypeOfDD
         * @param {Object} 要计算的对象
         * @return {boolean} true 表示为typeof oDD = DragDrop
         * @static
         */
        isTypeOfDD: function (oDD) {
            return (oDD && oDD.__ygDragDrop);
        },

        /**
         * 指定拖放对象，检测给出的元素是否属于已登记的拖放处理中的一员。
         * @method isHandle
         * @param {String} id 要检测的对象
         * @return {boolean} True表示为元素是拖放的处理
         * @static
         */
        isHandle: function(sDDId, sHandleId) {
            return ( this.handleIds[sDDId] &&
                            this.handleIds[sDDId][sHandleId] );
        },

        /**
         * 指定一个id，返回该id的拖放实例。
         * @method getDDById
         * @param {String} id 拖放对象的id
         * @return {DragDrop} 拖放对象，null表示为找不到
         * @static
         */
        getDDById: function(id) {
            for (var i in this.ids) {
                if (this.ids[i][id]) {
                    return this.ids[i][id];
                }
            }
            return null;
        },

        /**
         * 在一个已登记的拖放对象上发生mousedown事件之后触发。
         * @method handleMouseDown
         * @param {Event} e 事件
         * @param oDD 被拖动的拖放对象
         * @private
         * @static
         */
        handleMouseDown: function(e, oDD) {
            if(Ext.QuickTips){
                Ext.QuickTips.disable();
            }
            this.currentTarget = e.getTarget();

            this.dragCurrent = oDD;

            var el = oDD.getEl();

            // track start position
            this.startX = e.getPageX();
            this.startY = e.getPageY();

            this.deltaX = this.startX - el.offsetLeft;
            this.deltaY = this.startY - el.offsetTop;

            this.dragThreshMet = false;

            this.clickTimeout = setTimeout(
                    function() {
                        var DDM = Ext.dd.DDM;
                        DDM.startDrag(DDM.startX, DDM.startY);
                    },
                    this.clickTimeThresh );
        },

        /**
         * 当拖动象素开始启动或mousedown保持事件正好发生的时候发生。
         * @method startDrag
         * @param x {int} 原始mousedown发生的X位置
         * @param y {int} 原始mousedown发生的Y位置
         * @static
         */
        startDrag: function(x, y) {
            clearTimeout(this.clickTimeout);
            if (this.dragCurrent) {
                this.dragCurrent.b4StartDrag(x, y);
                this.dragCurrent.startDrag(x, y);
            }
            this.dragThreshMet = true;
        },

        /**
         * 处理MouseUp事件的内置函数，会涉及文档的上下文内容。
         * @method handleMouseUp
         * @param {Event} e 事件
         * @private
         * @static
         */
        handleMouseUp: function(e) {

            if(Ext.QuickTips){
                Ext.QuickTips.enable();
            }
            if (! this.dragCurrent) {
                return;
            }

            clearTimeout(this.clickTimeout);

            if (this.dragThreshMet) {
                this.fireEvents(e, true);
            } else {
            }

            this.stopDrag(e);

            this.stopEvent(e);
        },

        /**
         * 如果停止事件值和默认（event propagation）的一项被打开，要执行的实用函数。
         * @method stopEvent
         * @param {Event} e 由this.getEvent()返回的事件
         * @static
         */
        stopEvent: function(e){
            if(this.stopPropagation) {
                e.stopPropagation();
            }

            if (this.preventDefault) {
                e.preventDefault();
            }
        },

        /**
         * 内置函数，用于在拖动操作完成后清理事件处理器（event handlers）
         * @method stopDrag
         * @param {Event} e 事件
         * @private
         * @static
         */
        stopDrag: function(e) {
            // Fire the drag end event for the item that was dragged
            if (this.dragCurrent) {
                if (this.dragThreshMet) {
                    this.dragCurrent.b4EndDrag(e);
                    this.dragCurrent.endDrag(e);
                }

                this.dragCurrent.onMouseUp(e);
            }

            this.dragCurrent = null;
            this.dragOvers = {};
        },

        /**
         * 处理mousemove事件的内置函数，会涉及html元素的上下文内容。
         * @TODO figure out what we can do about mouse events lost when the
         * user drags objects beyond the window boundary.  Currently we can
         * detect this in internet explorer by verifying that the mouse is
         * down during the mousemove event.  Firefox doesn't give us the
         * button state on the mousemove event.
         * @method handleMouseMove
         * @param {Event} e 事件
         * @private
         * @static
         */
        handleMouseMove: function(e) {
            if (! this.dragCurrent) {
                return true;
            }

            // var button = e.which || e.button;

            // check for IE mouseup outside of page boundary
            if (Ext.isIE && (e.button !== 0 && e.button !== 1 && e.button !== 2)) {
                this.stopEvent(e);
                return this.handleMouseUp(e);
            }

            if (!this.dragThreshMet) {
                var diffX = Math.abs(this.startX - e.getPageX());
                var diffY = Math.abs(this.startY - e.getPageY());
                if (diffX > this.clickPixelThresh ||
                            diffY > this.clickPixelThresh) {
                    this.startDrag(this.startX, this.startY);
                }
            }

            if (this.dragThreshMet) {
                this.dragCurrent.b4Drag(e);
                this.dragCurrent.onDrag(e);
                if(!this.dragCurrent.moveOnly){
                    this.fireEvents(e, false);
                }
            }

            this.stopEvent(e);

            return true;
        },

        /**
         * 遍历所有的拖放对象找出我们悬浮或落下的那一个。
         * @method fireEvents
         * @param {Event} e 事件
         * @param {boolean} isDrop 是drop还是mouseover?
         * @private
         * @static
         */
        fireEvents: function(e, isDrop) {
            var dc = this.dragCurrent;

            // If the user did the mouse up outside of the window, we could
            // get here even though we have ended the drag.
            if (!dc || dc.isLocked()) {
                return;
            }

            var pt = e.getPoint();

            // cache the previous dragOver array
            var oldOvers = [];

            var outEvts   = [];
            var overEvts  = [];
            var dropEvts  = [];
            var enterEvts = [];

            // Check to see if the object(s) we were hovering over is no longer
            // being hovered over so we can fire the onDragOut event
            for (var i in this.dragOvers) {

                var ddo = this.dragOvers[i];

                if (! this.isTypeOfDD(ddo)) {
                    continue;
                }

                if (! this.isOverTarget(pt, ddo, this.mode)) {
                    outEvts.push( ddo );
                }

                oldOvers[i] = true;
                delete this.dragOvers[i];
            }

            for (var sGroup in dc.groups) {

                if ("string" != typeof sGroup) {
                    continue;
                }

                for (i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }

                    if (oDD.isTarget && !oDD.isLocked() && oDD != dc) {
                        if (this.isOverTarget(pt, oDD, this.mode)) {
                            // look for drop interactions
                            if (isDrop) {
                                dropEvts.push( oDD );
                            // look for drag enter and drag over interactions
                            } else {

                                // initial drag over: dragEnter fires
                                if (!oldOvers[oDD.id]) {
                                    enterEvts.push( oDD );
                                // subsequent drag overs: dragOver fires
                                } else {
                                    overEvts.push( oDD );
                                }

                                this.dragOvers[oDD.id] = oDD;
                            }
                        }
                    }
                }
            }

            if (this.mode) {
                if (outEvts.length) {
                    dc.b4DragOut(e, outEvts);
                    dc.onDragOut(e, outEvts);
                }

                if (enterEvts.length) {
                    dc.onDragEnter(e, enterEvts);
                }

                if (overEvts.length) {
                    dc.b4DragOver(e, overEvts);
                    dc.onDragOver(e, overEvts);
                }

                if (dropEvts.length) {
                    dc.b4DragDrop(e, dropEvts);
                    dc.onDragDrop(e, dropEvts);
                }

            } else {
                // fire dragout events
                var len = 0;
                for (i=0, len=outEvts.length; i<len; ++i) {
                    dc.b4DragOut(e, outEvts[i].id);
                    dc.onDragOut(e, outEvts[i].id);
                }

                // fire enter events
                for (i=0,len=enterEvts.length; i<len; ++i) {
                    // dc.b4DragEnter(e, oDD.id);
                    dc.onDragEnter(e, enterEvts[i].id);
                }

                // fire over events
                for (i=0,len=overEvts.length; i<len; ++i) {
                    dc.b4DragOver(e, overEvts[i].id);
                    dc.onDragOver(e, overEvts[i].id);
                }

                // fire drop events
                for (i=0, len=dropEvts.length; i<len; ++i) {
                    dc.b4DragDrop(e, dropEvts[i].id);
                    dc.onDragDrop(e, dropEvts[i].id);
                }

            }

            // notify about a drop that did not find a target
            if (isDrop && !dropEvts.length) {
                dc.onInvalidDrop(e);
            }

        },

        /**
         * 当INTERSECT模式时，通过拖放事件返回拖放对象的列表。
         * 这个辅助函数的作用是在这份列表中获取最适合的配对。
         * 有时返回指鼠标下方的第一个对象，有时返回与拖动对象重叠的最大一个对象。
         * @method getBestMatch
         * @param  {DragDrop[]} dds 拖放对象之数组
         * targeted
         * @return {DragDrop}       最佳的单个配对
         * @static
         */
        getBestMatch: function(dds) {
            var winner = null;
            // Return null if the input is not what we expect
            //if (!dds || !dds.length || dds.length == 0) {
               // winner = null;
            // If there is only one item, it wins
            //} else if (dds.length == 1) {

            var len = dds.length;

            if (len == 1) {
                winner = dds[0];
            } else {
                // Loop through the targeted items
                for (var i=0; i<len; ++i) {
                    var dd = dds[i];
                    // If the cursor is over the object, it wins.  If the
                    // cursor is over multiple matches, the first one we come
                    // to wins.
                    if (dd.cursorIsOver) {
                        winner = dd;
                        break;
                    // Otherwise the object with the most overlap wins
                    } else {
                        if (!winner ||
                            winner.overlap.getArea() < dd.overlap.getArea()) {
                            winner = dd;
                        }
                    }
                }
            }

            return winner;
        },

        /**
         * 在指定组中，刷新位于左上方和右下角的点的缓存。
         * 这是保存在拖放实例中的格式。所以典型的用法是:
         * <code>
         * Ext.dd.DragDropMgr.refreshCache(ddinstance.groups);
         * </code>
         * 也可这样:
         * <code>
         * Ext.dd.DragDropMgr.refreshCache({group1:true, group2:true});
         * </code>
         * @TODO this really should be an indexed array.  Alternatively this
         * method could accept both.
         * @method refreshCache
         * @param {Object} groups 要刷新的关联组的数组
         * @static
         */
        refreshCache: function(groups) {
            for (var sGroup in groups) {
                if ("string" != typeof sGroup) {
                    continue;
                }
                for (var i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];

                    if (this.isTypeOfDD(oDD)) {
                    // if (this.isTypeOfDD(oDD) && oDD.isTarget) {
                        var loc = this.getLocation(oDD);
                        if (loc) {
                            this.locationCache[oDD.id] = loc;
                        } else {
                            delete this.locationCache[oDD.id];
                            // this will unregister the drag and drop object if
                            // the element is not in a usable state
                            // oDD.unreg();
                        }
                    }
                }
            }
        },

        /**
         * 检验一个元素是否存在DOM树中，该方法用于innerHTML。
         * @method verifyEl
         * @param {HTMLElement} el 要检测的元素
         * @return {boolean} true 表示为元素似乎可用
         * @static
         */
        verifyEl: function(el) {
            if (el) {
                var parent;
                if(Ext.isIE){
                    try{
                        parent = el.offsetParent;
                    }catch(e){}
                }else{
                    parent = el.offsetParent;
                }
                if (parent) {
                    return true;
                }
            }

            return false;
        },

        /**
         * 返回一个区域对象（Region Object）。
         * 这个区域包含拖放元素位置、大小、和针对其配置好的内补丁（padding）
         * @method getLocation
         * @param {DragDrop} oDD 要获取所在位置的拖放对象
         * @return {Ext.lib.Region} 区域对象，包括元素占位，该实例配置的外补丁。
         * @static
         */
        getLocation: function(oDD) {
            if (! this.isTypeOfDD(oDD)) {
                return null;
            }

            var el = oDD.getEl(), pos, x1, x2, y1, y2, t, r, b, l;

            try {
                pos= Ext.lib.Dom.getXY(el);
            } catch (e) { }

            if (!pos) {
                return null;
            }

            x1 = pos[0];
            x2 = x1 + el.offsetWidth;
            y1 = pos[1];
            y2 = y1 + el.offsetHeight;

            t = y1 - oDD.padding[0];
            r = x2 + oDD.padding[1];
            b = y2 + oDD.padding[2];
            l = x1 - oDD.padding[3];

            return new Ext.lib.Region( t, r, b, l );
        },

        /**
         * 检查鼠标指针是否位于目标的上方。
         * @method isOverTarget
         * @param {Ext.lib.Point} pt 要检测的点
         * @param {DragDrop} oTarget 要检测的拖放对象
         * @return {boolean} true 表示为鼠标位于目标上方
         * @private
         * @static
         */
        isOverTarget: function(pt, oTarget, intersect) {
            // use cache if available
            var loc = this.locationCache[oTarget.id];
            if (!loc || !this.useCache) {
                loc = this.getLocation(oTarget);
                this.locationCache[oTarget.id] = loc;

            }

            if (!loc) {
                return false;
            }

            oTarget.cursorIsOver = loc.contains( pt );

            // DragDrop is using this as a sanity check for the initial mousedown
            // in this case we are done.  In POINT mode, if the drag obj has no
            // contraints, we are also done. Otherwise we need to evaluate the
            // location of the target as related to the actual location of the
            // dragged element.
            var dc = this.dragCurrent;
            if (!dc || !dc.getTargetCoord ||
                    (!intersect && !dc.constrainX && !dc.constrainY)) {
                return oTarget.cursorIsOver;
            }

            oTarget.overlap = null;

            // Get the current location of the drag element, this is the
            // location of the mouse event less the delta that represents
            // where the original mousedown happened on the element.  We
            // need to consider constraints and ticks as well.
            var pos = dc.getTargetCoord(pt.x, pt.y);

            var el = dc.getDragEl();
            var curRegion = new Ext.lib.Region( pos.y,
                                                   pos.x + el.offsetWidth,
                                                   pos.y + el.offsetHeight,
                                                   pos.x );

            var overlap = curRegion.intersect(loc);

            if (overlap) {
                oTarget.overlap = overlap;
                return (intersect) ? true : oTarget.cursorIsOver;
            } else {
                return false;
            }
        },

        /**
         * 卸下事件处理器。
         * @method _onUnload
         * @private
         * @static
         */
        _onUnload: function(e, me) {
            Ext.dd.DragDropMgr.unregAll();
        },

        /**
         * 清除拖放事件和对象。
         * @method unregAll
         * @private
         * @static
         */
        unregAll: function() {

            if (this.dragCurrent) {
                this.stopDrag();
                this.dragCurrent = null;
            }

            this._execOnAll("unreg", []);

            for (i in this.elementCache) {
                delete this.elementCache[i];
            }

            this.elementCache = {};
            this.ids = {};
        },

        /**
         * DOM元素的缓存。
         * @property elementCache
         * @private
         * @static
         */
        elementCache: {},

        /**
         * 返回DOM元素所指定的包装器。
         * @method getElWrapper
         * @param {String} id 要获取的元素id
         * @return {Ext.dd.DDM.ElementWrapper} 包装好的元素
         * @private
         * @deprecated 该包装器用途较小
         * @static
         */
        getElWrapper: function(id) {
            var oWrapper = this.elementCache[id];
            if (!oWrapper || !oWrapper.el) {
                oWrapper = this.elementCache[id] =
                    new this.ElementWrapper(Ext.getDom(id));
            }
            return oWrapper;
        },

        /**
         * 返回实际的DOM元素。
         * @method getElement
         * @param {String} id 要获取的元素的id
         * @return {Object} 元素
         * @deprecated 推荐使用Ext.lib.Ext.getDom
         * @static
         */
        getElement: function(id) {
            return Ext.getDom(id);
        },

        /**
         * 返回该DOM元素的样式属性。
         * @method getCss
         * @param {String} id 要获取元素的id
         * @return {Object} 元素样式属性
         * @deprecated 推荐使用Ext.lib.Dom
         * @static
         */
        getCss: function(id) {
            var el = Ext.getDom(id);
            return (el) ? el.style : null;
        },

        /**
         * 缓冲元素的内置类
         * @class DragDropMgr.ElementWrapper
         * @for DragDropMgr
         * @private
         * @deprecated
         */
        ElementWrapper: function(el) {
                /**
                 * The element
                 * @property el
                 */
                this.el = el || null;
                /**
                 * The element id
                 * @property id
                 */
                this.id = this.el && el.id;
                /**
                 * A reference to the style property
                 * @property css
                 */
                this.css = this.el && el.style;
            },

        /**
         * 返回html元素的X坐标。
         * @method getPosX
         * @param el 指获取坐标的元素
         * @return {int} x坐标
         * @for DragDropMgr
         * @deprecated 推荐使用Ext.lib.Dom.getX
         * @static
         */
        getPosX: function(el) {
            return Ext.lib.Dom.getX(el);
        },

        /**
         * 返回html元素的Y坐标。
         * @method getPosY
         * @param el 指获取坐标的元素
         * @return {int} y坐标
         * @deprecated 推荐使用Ext.lib.Dom.getY
         * @static
         */
        getPosY: function(el) {
            return Ext.lib.Dom.getY(el);
        },

        /**
         * 调换两个节点，对于IE，我们使用原生的方法。
         * @method swapNode
         * @param n1 要调换的第一个节点
         * @param n2 要调换的其他节点
         * @static
         */
        swapNode: function(n1, n2) {
            if (n1.swapNode) {
                n1.swapNode(n2);
            } else {
                var p = n2.parentNode;
                var s = n2.nextSibling;

                if (s == n1) {
                    p.insertBefore(n1, n2);
                } else if (n2 == n1.nextSibling) {
                    p.insertBefore(n2, n1);
                } else {
                    n1.parentNode.replaceChild(n2, n1);
                    p.insertBefore(n1, s);
                }
            }
        },

        /**
         * 返回当前滚动位置。
         * @method getScroll
         * @private
         * @static
         */
        getScroll: function () {
            var t, l, dde=document.documentElement, db=document.body;
            if (dde && (dde.scrollTop || dde.scrollLeft)) {
                t = dde.scrollTop;
                l = dde.scrollLeft;
            } else if (db) {
                t = db.scrollTop;
                l = db.scrollLeft;
            } else {

            }
            return { top: t, left: l };
        },

        /**
         * 指定一个元素，返回其样式的某个属性。
         * @method getStyle
         * @param {HTMLElement} el          元素
         * @param {string}      styleProp   样式名称
         * @return {string} 样式值
         * @deprecated use Ext.lib.Dom.getStyle
         * @static
         */
        getStyle: function(el, styleProp) {
            return Ext.fly(el).getStyle(styleProp);
        },

        /**
         * 获取scrollTop
         * @method getScrollTop
         * @return {int} 文档的scrollTop
         * @static
         */
        getScrollTop: function () { return this.getScroll().top; },

        /**
         * 获取scrollLeft
         * @method getScrollLeft
         * @return {int} 文档的scrollTop
         * @static
         */
        getScrollLeft: function () { return this.getScroll().left; },

        /**
         * 根据目标元素的位置，设置元素的X/Y位置。
         * @method moveToEl
         * @param {HTMLElement} moveEl      要移动的元素
         * @param {HTMLElement} targetEl    引用元素的位置
         * @static
         */
        moveToEl: function (moveEl, targetEl) {
            var aCoord = Ext.lib.Dom.getXY(targetEl);
            Ext.lib.Dom.setXY(moveEl, aCoord);
        },

        /**
         * 数组排列函数
         * @method numericSort
         * @static
         */
        numericSort: function(a, b) { return (a - b); },

        /**
         * 局部计算器
         * @property _timeoutCount
         * @private
         * @static
         */
        _timeoutCount: 0,

        /**
         * 试着押后加载，这样便不会在Event Utility文件加载之前出现的错误。
         * @method _addListeners
         * @private
         * @static
         */
        _addListeners: function() {
            var DDM = Ext.dd.DDM;
            if ( Ext.lib.Event && document ) {
                DDM._onLoad();
            } else {
                if (DDM._timeoutCount > 2000) {
                } else {
                    setTimeout(DDM._addListeners, 10);
                    if (document && document.body) {
                        DDM._timeoutCount += 1;
                    }
                }
            }
        },

        /**
         * 递归搜索最靠近的父、子元素，以便确定处理的元素是否被单击。
         * @method handleWasClicked
         * @param node 要检测的html元素
         * @static
         */
        handleWasClicked: function(node, id) {
            if (this.isHandle(id, node.id)) {
                return true;
            } else {
                // check to see if this is a text node child of the one we want
                var p = node.parentNode;

                while (p) {
                    if (this.isHandle(id, p.id)) {
                        return true;
                    } else {
                        p = p.parentNode;
                    }
                }
            }

            return false;
        }

    };

}();

// shorter alias, save a few bytes
Ext.dd.DDM = Ext.dd.DragDropMgr;
Ext.dd.DDM._addListeners();

}

/**
 * @class Ext.dd.DD
 * 在拖动过程中随伴鼠标指针关联元素的一个播放实现。
 * @extends Ext.dd.DragDrop
 * @constructor
 * @param {String} id 关联元素的id
 * @param {String} sGroup 关联拖放项的组
 * @param {object} config 包含DD的有效配置属性：
 *                    scroll
 */
Ext.dd.DD = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
    }
};

Ext.extend(Ext.dd.DD, Ext.dd.DragDrop, {

    /**
     * 设置为true时，游览器窗口会自动滚动，如果拖放元素被拖到视图的边界，默认为true。
     * @property scroll
     * @type boolean
     */
    scroll: true,

    /**
     * 在关联元素的左上角和元素点击所在位置之间设置一个指针偏移的距离。
     * @method autoOffset
     * @param {int} iPageX 点击的X坐标
     * @param {int} iPageY 点击的Y坐标
     */
    autoOffset: function(iPageX, iPageY) {
        var x = iPageX - this.startPageX;
        var y = iPageY - this.startPageY;
        this.setDelta(x, y);
    },

    /**
     * 设置指针偏移，你可以直接调用以强制偏移到新特殊的位置（像传入0,0，即设置成为对象的一角）。
     * @method setDelta
     * @param {int} iDeltaX 从左边算起的距离
     * @param {int} iDeltaY 从上面算起的距离
     */
    setDelta: function(iDeltaX, iDeltaY) {
        this.deltaX = iDeltaX;
        this.deltaY = iDeltaY;
    },

    /**
     * 设置拖动元素到mousedown或点击事件的位置继续保持指针相关联元素点击的位置。
     * 如果打算将元素放到某个位置而非指针位置，你可重写该方法。
     * @method setDragElPos
     * @param {int} iPageX mousedown或拖动事件的X坐标
     * @param {int} iPageY mousedown或拖动事件的Y坐标
     */
    setDragElPos: function(iPageX, iPageY) {
        // the first time we do this, we are going to check to make sure
        // the element has css positioning

        var el = this.getDragEl();
        this.alignElWithMouse(el, iPageX, iPageY);
    },

    /**
     * 设置元素到mousedown或点击事件的位置继续保持指针相关联元素点击的位置。
     * 如果打算将元素放到某个位置而非指针位置，你可重写该方法。
     * @method alignElWithMouse
     * @param {HTMLElement} el the element to move
     * @param {int} iPageX mousedown或拖动事件的X坐标
     * @param {int} iPageY mousedown或拖动事件的Y坐标
     */
    alignElWithMouse: function(el, iPageX, iPageY) {
        var oCoord = this.getTargetCoord(iPageX, iPageY);
        var fly = el.dom ? el : Ext.fly(el);
        if (!this.deltaSetXY) {
            var aCoord = [oCoord.x, oCoord.y];
            fly.setXY(aCoord);
            var newLeft = fly.getLeft(true);
            var newTop  = fly.getTop(true);
            this.deltaSetXY = [ newLeft - oCoord.x, newTop - oCoord.y ];
        } else {
            fly.setLeftTop(oCoord.x + this.deltaSetXY[0], oCoord.y + this.deltaSetXY[1]);
        }

        this.cachePosition(oCoord.x, oCoord.y);
        this.autoScroll(oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
        return oCoord;
    },

    /**
     * 保存最近的位置，以便我们重量限制和所需要的点击标记。
     * 我们需要清楚这些以便计算元素偏移原来位置的像素值。
     * @method cachePosition
     * @param iPageX 当前X位置（可选的），只要为了以后不用再查询
     * @param iPageY 当前Y位置（可选的），只要为了以后不用再查询
     */
    cachePosition: function(iPageX, iPageY) {
        if (iPageX) {
            this.lastPageX = iPageX;
            this.lastPageY = iPageY;
        } else {
            var aCoord = Ext.lib.Dom.getXY(this.getEl());
            this.lastPageX = aCoord[0];
            this.lastPageY = aCoord[1];
        }
    },

    /**
     * 如果拖动对象移动到可视窗口之外的区域，就自动滚动window。
     * @method autoScroll
     * @param {int} x 拖动元素X坐标
     * @param {int} y 拖动元素Y坐标
     * @param {int} h 拖动元素的高度
     * @param {int} w 拖动元素的宽度
     * @private
     */
    autoScroll: function(x, y, h, w) {

        if (this.scroll) {
            // The client height
            var clientH = Ext.lib.Dom.getViewWidth();

            // The client width
            var clientW = Ext.lib.Dom.getViewHeight();

            // The amt scrolled down
            var st = this.DDM.getScrollTop();

            // The amt scrolled right
            var sl = this.DDM.getScrollLeft();

            // Location of the bottom of the element
            var bot = h + y;

            // Location of the right of the element
            var right = w + x;

            // The distance from the cursor to the bottom of the visible area,
            // adjusted so that we don't scroll if the cursor is beyond the
            // element drag constraints
            var toBot = (clientH + st - y - this.deltaY);

            // The distance from the cursor to the right of the visible area
            var toRight = (clientW + sl - x - this.deltaX);


            // How close to the edge the cursor must be before we scroll
            // var thresh = (document.all) ? 100 : 40;
            var thresh = 40;

            // How many pixels to scroll per autoscroll op.  This helps to reduce
            // clunky scrolling. IE is more sensitive about this ... it needs this
            // value to be higher.
            var scrAmt = (document.all) ? 80 : 30;

            // Scroll down if we are near the bottom of the visible page and the
            // obj extends below the crease
            if ( bot > clientH && toBot < thresh ) {
                window.scrollTo(sl, st + scrAmt);
            }

            // Scroll up if the window is scrolled down and the top of the object
            // goes above the top border
            if ( y < st && st > 0 && y - st < thresh ) {
                window.scrollTo(sl, st - scrAmt);
            }

            // Scroll right if the obj is beyond the right border and the cursor is
            // near the border.
            if ( right > clientW && toRight < thresh ) {
                window.scrollTo(sl + scrAmt, st);
            }

            // Scroll left if the window has been scrolled to the right and the obj
            // extends past the left border
            if ( x < sl && sl > 0 && x - sl < thresh ) {
                window.scrollTo(sl - scrAmt, st);
            }
        }
    },

    /**
     * 找到元素应该放下的位置。
     * @method getTargetCoord
     * @param {int} iPageX 点击的X坐标
     * @param {int} iPageY 点击的Y坐标
     * @return 包含坐标的对象(Object.x和Object.y)
     * @private
     */
    getTargetCoord: function(iPageX, iPageY) {


        var x = iPageX - this.deltaX;
        var y = iPageY - this.deltaY;

        if (this.constrainX) {
            if (x < this.minX) { x = this.minX; }
            if (x > this.maxX) { x = this.maxX; }
        }

        if (this.constrainY) {
            if (y < this.minY) { y = this.minY; }
            if (y > this.maxY) { y = this.maxY; }
        }

        x = this.getTick(x, this.xTicks);
        y = this.getTick(y, this.yTicks);


        return {x:x, y:y};
    },

    /*
     * 为该类配置指定的选项，这样重写Ext.dd.DragDrop，注意该方法的所有版本都会被调用。
     */
    applyConfig: function() {
        Ext.dd.DD.superclass.applyConfig.call(this);
        this.scroll = (this.config.scroll !== false);
    },

    /*
     * 触发优先的onMouseDown事件。
     * 重写Ext.dd.DragDrop.
     */
    b4MouseDown: function(e) {
        // this.resetConstraints();
        this.autoOffset(e.getPageX(),
                            e.getPageY());
    },

    /*
     * 触发优先的onDrag事件。
     * 重写Ext.dd.DragDrop.
     */
    b4Drag: function(e) {
        this.setDragElPos(e.getPageX(),
                            e.getPageY());
    },

    toString: function() {
        return ("DD " + this.id);
    }

    //////////////////////////////////////////////////////////////////////////
    // Debugging ygDragDrop events that can be overridden
    //////////////////////////////////////////////////////////////////////////
    /*
    startDrag: function(x, y) {
    },

    onDrag: function(e) {
    },

    onDragEnter: function(e, id) {
    },

    onDragOver: function(e, id) {
    },

    onDragOut: function(e, id) {
    },

    onDragDrop: function(e, id) {
    },

    endDrag: function(e) {
    }

    */

});
/**
 * @class Ext.dd.DDProxy
 * 一种拖放的实现，把一个空白的、带边框的div插入到文档，并会伴随着鼠标指针移动。
 * 当点击那一下发生，边框div会调整大小到关联html元素的尺寸大小，然后移动到关联元素的位置。
 * “边框”元素的引用指的是页面上我们创建能够被DDProxy元素拖动到的地方的单个代理元素。
 * @extends Ext.dd.DD
 * @constructor
 * @param {String} id 关联html元素之id
 * @param {String} sGroup 相关拖放对象的组
 * @param {object} config 配置项对象属性
 *                DDProxy可用的属性有：
 *                   resizeFrame, centerFrame, dragElId
 */
Ext.dd.DDProxy = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
        this.initFrame();
    }
};

/**
 * 默认的拖动框架div之id
 * @property Ext.dd.DDProxy.dragElId
 * @type String
 * @static
 */
Ext.dd.DDProxy.dragElId = "ygddfdiv";

Ext.extend(Ext.dd.DDProxy, Ext.dd.DD, {

    /**
     *默认下，我们将实际拖动元素调整大小到与打算拖动的那个元素的大小一致（这就是加边框的效果）。
     * 但如果我们想实现另外一种效果可关闭选项。
     * @property resizeFrame
     * @type boolean
     */
    resizeFrame: true,

    /**
     * 默认下，frame是正好处于拖动元素的位置。
     * 因此我们可使Ext.dd.DD来偏移指针。
     * 另外一个方法就是，你没有让做任何限制在对象上，然后设置center Frame为true。
     * @property centerFrame
     * @type boolean
     */
    centerFrame: false,

    /**
     * 如果代理元素仍然不存在，就创建一个。
     * @method createFrame
     */
    createFrame: function() {
        var self = this;
        var body = document.body;

        if (!body || !body.firstChild) {
            setTimeout( function() { self.createFrame(); }, 50 );
            return;
        }

        var div = this.getDragEl();

        if (!div) {
            div    = document.createElement("div");
            div.id = this.dragElId;
            var s  = div.style;

            s.position   = "absolute";
            s.visibility = "hidden";
            s.cursor     = "move";
            s.border     = "2px solid #aaa";
            s.zIndex     = 999;

            // appendChild can blow up IE if invoked prior to the window load event
            // while rendering a table.  It is possible there are other scenarios
            // that would cause this to happen as well.
            body.insertBefore(div, body.firstChild);
        }
    },

    /**
     * 拖动框架元素的初始化，必须在子类的构造器里调用。
     * @method initFrame
     */
    initFrame: function() {
        this.createFrame();
    },

    applyConfig: function() {
        Ext.dd.DDProxy.superclass.applyConfig.call(this);

        this.resizeFrame = (this.config.resizeFrame !== false);
        this.centerFrame = (this.config.centerFrame);
        this.setDragElId(this.config.dragElId || Ext.dd.DDProxy.dragElId);
    },

    /**
     * 调查拖动frame的大小到点击对象的尺寸大小、位置，最后显示它。
     * @method showFrame
     * @param {int} iPageX 点击X位置
     * @param {int} iPageY 点击Y位置
     * @private
     */
    showFrame: function(iPageX, iPageY) {
        var el = this.getEl();
        var dragEl = this.getDragEl();
        var s = dragEl.style;

        this._resizeProxy();

        if (this.centerFrame) {
            this.setDelta( Math.round(parseInt(s.width,  10)/2),
                           Math.round(parseInt(s.height, 10)/2) );
        }

        this.setDragElPos(iPageX, iPageY);

        Ext.fly(dragEl).show();
    },

    /**
     * 拖动开始时，代理与关联元素自适应尺寸，除非resizeFrame设为false。
     * @method _resizeProxy
     * @private
     */
    _resizeProxy: function() {
        if (this.resizeFrame) {
            var el = this.getEl();
            Ext.fly(this.getDragEl()).setSize(el.offsetWidth, el.offsetHeight);
        }
    },

    // overrides Ext.dd.DragDrop
    b4MouseDown: function(e) {
        var x = e.getPageX();
        var y = e.getPageY();
        this.autoOffset(x, y);
        this.setDragElPos(x, y);
    },

    // overrides Ext.dd.DragDrop
    b4StartDrag: function(x, y) {
        // show the drag frame
        this.showFrame(x, y);
    },

    // overrides Ext.dd.DragDrop
    b4EndDrag: function(e) {
        Ext.fly(this.getDragEl()).hide();
    },

    // overrides Ext.dd.DragDrop
    // By default we try to move the element to the last location of the frame.
    // This is so that the default behavior mirrors that of Ext.dd.DD.
    endDrag: function(e) {

        var lel = this.getEl();
        var del = this.getDragEl();

        // Show the drag frame briefly so we can get its position
        del.style.visibility = "";

        this.beforeMove();
        // Hide the linked element before the move to get around a Safari
        // rendering bug.
        lel.style.visibility = "hidden";
        Ext.dd.DDM.moveToEl(lel, del);
        del.style.visibility = "hidden";
        lel.style.visibility = "";

        this.afterDrag();
    },

    beforeMove : function(){

    },

    afterDrag : function(){

    },

    toString: function() {
        return ("DDProxy " + this.id);
    }

});
/**
 * @class Ext.dd.DDTarget
 * 一种拖放的实现，不能移动，但可以置下目标，对于事件回调，省略一些简单的实现也可得到相同的结果。
 * 但这样降低了event listener和回调的处理成本。
 * @extends Ext.dd.DragDrop
 * @constructor
 * @param {String} id 置下目标的那个元素的id
 * @param {String} sGroup 相关拖放对象的组
 * @param {object} config 包括配置属性的对象
 *                 可用的DDTarget属性有DragDrop:
 *                    none
 */
Ext.dd.DDTarget = function(id, sGroup, config) {
    if (id) {
        this.initTarget(id, sGroup, config);
    }
};

// Ext.dd.DDTarget.prototype = new Ext.dd.DragDrop();
Ext.extend(Ext.dd.DDTarget, Ext.dd.DragDrop, {
    toString: function() {
        return ("DDTarget " + this.id);
    }
});
