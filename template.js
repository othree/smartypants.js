/**
 * Based on UMD template
 * https://github.com/umdjs/umd/blob/master/templates/commonjsStrictGlobal.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('SmartyPants', ['exports'], function (exports) {
            factory((root.SmartyPants = exports));
        });
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory((root.SmartyPants = {}));
    }
}(this, function (exports) {

// @CODE

}));
