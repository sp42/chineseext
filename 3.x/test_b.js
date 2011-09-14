        /**
         * OO继承，并由传递的值决定是否覆盖原对象的属性。
         * 返回的类对象中也增加了“override()”函数，用于覆盖实例的成员。
         * Extends one class with another class and optionally overrides members with the passed literal. This class
         * also adds the function "override()" to the class that can be used to override
         * members on an instance.
         * <p>
         * 另外一种用法是，第一个参数不是父类（严格说是父类构造器）的话那么将会发生如下的变化（这是使用2个参数的方式）：
         * This function also supports a 2-argument call in which the subclass's constructor is
         * not passed as an argument. In this form, the parameters are as follows:</p><p>
         * <div class="mdetail-params"><ul>
         * <li><code>superclass</code>
         * <div class="sub-desc">被继承的类。The class being extended</div></li>
         * <li><code>overrides</code>
         * <div class="sub-desc">
         * 成员列表，就是将会复制到子类的prototype对象身上，——这便会让该新类的实例可共享这些成员。
         * A literal with members which are copied into the subclass's
         * prototype, and are therefore shared among all instances of the new class.<p>
         * 注意其中可以包含一个元素为属于子类的构造器，叫<tt><b>constructor</b></tt>的成员。
         * 如果该项<i>不</i>指定，就意味引用父类的构造器，父类构造器就会直接接收所有的参数。
         * This may contain a special member named <tt><b>constructor</b></tt>. This is used
         * to define the constructor of the new class, and is returned. If this property is
         * <i>not</i> specified, a constructor is generated and returned which just calls the
         * superclass's constructor passing on its parameters.</p></div></li>
         * </ul></div></p><p>
         * 例如，这样创建Ext GridPanel的子类。
         * For example, to create a subclass of the Ext GridPanel:
         * <pre><code>
    MyGridPanel = Ext.extend(Ext.grid.GridPanel, {
        constructor: function(config) {
            // 你先这样调用……（就是调用父类的构造函数）
            MyGridPanel.superclass.constructor.apply(this, arguments);
            // 然后接着是子类的代码……
        },

        yourMethod: function() {
            // ……
        }
    });
</code></pre>
         * </p>
         * @param {Function} subclass 子类，用于继承（该类继承了父类所有属性，并最终返回该对象）。The class inheriting the functionality
         * @param {Function} superclass 父类，被继承。The class being extended
         * @param {Object} overrides （可选的）一个对象，将它本身携带的属性对子类进行覆盖。(optional) A literal with members which are copied into the subclass's
         * prototype, and are therefore shared between all instances of the new class.
         * @return {Function} 子类的构造器。The subclass constructor.
         * @method extend
         */