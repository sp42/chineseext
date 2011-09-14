/*
 * @version Sencha 1.0RC-1
 * @ignore
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */
 
/**
 * @author Ed Spencer
 * @class Ext.data.Errors
 * @extends Ext.util.MixedCollection
 * 
 * <p>
 * 为某个字段提供访问的函数和封装验证时错误信息的对象集合。
 * Wraps a collection of validation error responses and provides convenient functions for
 * accessing and errors for specific fields.</p>
 * 
 * <p>
 * 一般来说不用直接实例化该类，当调用模型实例的{@link Ext.data.Model#validate validate}方法就自动创建该类的实例。
 * Usually this class does not need to be instantiated directly - instances are instead created
 * automatically when {@link Ext.data.Model#validate validate} on a model instance:</p>
 * 
<pre><code>
// 对当前的模型实例进行验证，本例中返回两个错误信息。validate some existing model instance - in this case it returned 2 failures messages
var errors = myModel.validate();

errors.isValid(); //false

errors.length; //2
errors.getByField('name');  // [{field: 'name',  error: 'must be present'}]
errors.getByField('title'); // [{field: 'title', error: 'is too short'}]
</code></pre>
 */
Ext.data.Errors = Ext.extend(Ext.util.MixedCollection, {
    /**
     * 如果集合中没有错误返回true。
     * Returns true if there are no errors in the collection
     * @return {Boolean} 
     */
    isValid: function() {
        return this.length == 0;
    },
    
    /**
     * 返回指定字段的所有错误信息。
     * Returns all of the errors for the given field
     * @param {String} fieldName 字段名称。The field to get errors for
     * @return {Array} 错误信息组成的数组。All errors for the given field
     */
    getByField: function(fieldName) {
        var errors = [],
            error, field, i;
            
        for (i = 0; i < this.length; i++) {
            error = this.items[i];
            
            if (error.field == fieldName) {
                errors.push(error);
            }
        }
        
        return errors;
    }
});
