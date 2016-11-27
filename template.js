/**
 * Based on UMD template
 * https://github.com/umdjs/umd/blob/master/templates/commonjsStrictGlobal.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('SmartyPants', ['exports'], function (exports, b) {
            factory((root.SmartyPants = exports), b);
        });
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory((root.SmartyPants = {}), root.b);
    }
}(this, function (exports) {

// @CODE

}));
