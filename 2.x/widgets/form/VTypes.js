/**
 * @class Ext.form.VTypes
 * 提供一个简单的、易于扩展的、可重写的表单验证功能。
 * @singleton
 */
Ext.form.VTypes = function(){
    // 对下列变量进行闭包，所以只会创建一次
    var alpha = /^[a-zA-Z_]+$/;
    var alphanum = /^[a-zA-Z0-9_]+$/;
    var email = /^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/;
    var url = /(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;

    // 所有这些信息和函数都是可配置的
    return {
        /**
         * 用于验证Email地址的函数
         * @param {String} value The email address
         */
        'email' : function(v){
            return email.test(v);
        },
        /**
         * 当Email验证返回值为false到时候显示的错误信息
         * @type String
         */
        'emailText' : 'This field should be an e-mail address in the format "user@domain.com"',
        /**
         * 只允许email地址格式的正则表达式
         * @type RegExp
         */
        'emailMask' : /[a-z0-9_\.\-@]/i,

        /**
         * 验证URL地址的函数
         * @param {String} value The URL
         */
        'url' : function(v){
            return url.test(v);
        },
        /**
         * 当URL验证返回值为false到时候显示的错误信息
         * @type String
         */
        'urlText' : 'This field should be a URL in the format "http:/'+'/www.domain.com"',
        
        /**
         * 验证alpha到函数
         * @param {String} value The value
         */
        'alpha' : function(v){
            return alpha.test(v);
        },
        /**
         * 当alpha验证返回值为false到时候显示的错误信息
         * @type String
         */
        'alphaText' : 'This field should only contain letters and _',
        /**
         * The keystroke filter mask to be applied on alpha input
         * @type RegExp
         */
        'alphaMask' : /[a-z_]/i,

        /**
         * 验证数字的函数
         * @param {String} value The value
         */
        'alphanum' : function(v){
            return alphanum.test(v);
        },
        /**
         * 验证数字返回false时候显示的错误信息
         * @type String
         */
        'alphanumText' : 'This field should only contain letters, numbers and _',
        /**
         * 只允文数字（alphanum）的正则表达式
         * @type RegExp
         */
        'alphanumMask' : /[a-z0-9_]/i
    };
}();