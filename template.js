/* eslint-env browser, amd, node */

/**
 *
 * @file Translates plain ASCII punctuation characters into "smart" typographic punctuation
 * @desc See the readme for details, installation instructions, and * license information.
 * @version 0.0.4
 * @author othree
 *
 * Copyright (c) 2003-2004 John Gruber
 * Copyright (c) 2016      Kao, Wei-Ko(othree)
 *
 * @see {@link https://www.npmjs.com/package/smartypants|smartypants.js}
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
