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

/*! smartypants.js 0.0.6 | (c) Kao, Wei-Ko(othree) | github.com/othree/smartypants.js/blob/master/LICENSE */

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

  "use strict";
  exports.__esModule = true;
  exports.smartypantsu = exports.smartellipses = exports.smartdashes = exports.smartquotes = exports.smartypants = void 0;
  var tags_to_skip = /<(\/?)(?:pre|code|kbd|script|math)[^>]*>/i;
  /**
   * @param text text to be parsed
   * @param attr value of the smart_quotes="" attribute
   */
  var SmartyPants = function (text, attr) {
    if (text === void 0) { text = ''; }
    if (attr === void 0) { attr = '1'; }
    var do_quotes;
    var do_backticks;
    var do_dashes;
    var do_ellipses;
    var do_stupefy;
    var convert_quot = 0;
    if (typeof attr === 'number') {
      attr = attr.toString();
    }
    else {
      attr = attr.replace(/\s/g, '');
    }
    /**
     * Parse attributes:
     * 0 : do nothing
     * 1 : set all
     * 2 : set all, using old school en- and em- dash shortcuts
     * 3 : set all, using inverted old school en and em- dash shortcuts
     *
     * q : quotes
     * b : backtick quotes (``double'' only)
     * B : backtick quotes (``double'' and `single')
     * d : dashes
     * D : old school dashes
     * i : inverted old school dashes
     * e : ellipses
     * w : convert &quot; entities to " for Dreamweaver users
     */
    if (attr === '0') {
      // Do nothing
      return text;
    }
    else if (attr === '1') {
      // Do everything, turn all options on.
      do_quotes = 1;
      do_backticks = 1;
      do_dashes = 1;
      do_ellipses = 1;
    }
    else if (attr === '2') {
      // Do everything, turn all options on, use old school dash shorthand.
      do_quotes = 1;
      do_backticks = 1;
      do_dashes = 2;
      do_ellipses = 1;
    }
    else if (attr === '3') {
      // Do everything, turn all options on, use inverted old school dash shorthand.
      do_quotes = 1;
      do_backticks = 1;
      do_dashes = 3;
      do_ellipses = 1;
    }
    else if (attr === '-1') {
      // Special "stupefy" mode.
      do_stupefy = 1;
    }
    else {
      for (var i = 0; i < attr.length; i++) {
        var c = attr[i];
        if (c === 'q') {
          do_quotes = 1;
        }
        if (c === 'b') {
          do_backticks = 1;
        }
        if (c === 'B') {
          do_backticks = 2;
        }
        if (c === 'd') {
          do_dashes = 1;
        }
        if (c === 'D') {
          do_dashes = 2;
        }
        if (c === 'i') {
          do_dashes = 3;
        }
        if (c === 'e') {
          do_ellipses = 1;
        }
        if (c === 'w') {
          convert_quot = 1;
        }
      }
    }
    var tokens = _tokenize(text);
    var result = '';
    /**
     * Keep track of when we're inside <pre> or <code> tags.
     */
    var in_pre = 0;
    /**
     * This is a cheat, used to get some context
     * for one-character tokens that consist of
     * just a quote char. What we do is remember
     * the last character of the previous text
     * token, to use as context to curl single-
     * character quote tokens correctly.
     */
    var prev_token_last_char = '';
    for (var i = 0; i < tokens.length; i++) {
      var cur_token = tokens[i];
      if (cur_token[0] === 'tag') {
        result = result + cur_token[1];
        var matched = tags_to_skip.exec(cur_token[1]);
        if (matched) {
          if (matched[1] === '/') {
            in_pre = 0;
          }
          else {
            in_pre = 1;
          }
        }
      }
      else {
        var t = cur_token[1];
        var last_char = t.substring(t.length - 1, t.length); // Remember last char of this token before processing.
        if (!in_pre) {
          t = ProcessEscapes(t);
          if (convert_quot) {
            t = t.replace(/$quot;/g, '"');
          }
          if (do_dashes) {
            if (do_dashes === 1) {
              t = EducateDashes(t);
            }
            if (do_dashes === 2) {
              t = EducateDashesOldSchool(t);
            }
            if (do_dashes === 3) {
              t = EducateDashesOldSchoolInverted(t);
            }
          }
          if (do_ellipses) {
            t = EducateEllipses(t);
          }
          // Note: backticks need to be processed before quotes.
          if (do_backticks) {
            t = EducateBackticks(t);
            if (do_backticks === 2) {
              t = EducateSingleBackticks(t);
            }
          }
          if (do_quotes) {
            if (t === '\'') {
              // Special case: single-character ' token
              if (/\S/.test(prev_token_last_char)) {
                t = '&#8217;';
              }
              else {
                t = '&#8216;';
              }
            }
            else if (t === '"') {
              // Special case: single-character " token
              if (/\S/.test(prev_token_last_char)) {
                t = '&#8221;';
              }
              else {
                t = '&#8220;';
              }
            }
            else {
              // Normal case:
              t = EducateQuotes(t);
            }
          }
          if (do_stupefy) {
            t = StupefyEntities(t);
          }
        }
        prev_token_last_char = last_char;
        result = result + t;
      }
    }
    return result;
  };
  exports.smartypants = SmartyPants;
  var SmartQuotes = function (text, attr) {
    /**
     * should we educate ``backticks'' -style quotes?
     */
    // var do_backticks:number;
    if (text === void 0) { text = ''; }
    if (attr === void 0) { attr = '1'; }
    if (typeof attr === 'number') {
      attr = attr.toString();
    }
    else {
      attr = attr.replace(/\s/g, '');
    }
    if (attr === '0') {
      // Do nothing
      return text;
      // } else if (attr === '2') {
      //   // smarten ``backticks'' -style quotes
      //   do_backticks = 1;
      // } else {
      //   do_backticks = 0;
    }
    /**
     * Special case to handle quotes at the very end of $text when preceded by
     * an HTML tag. Add a space to give the quote education algorithm a bit of
     * context, so that it can guess correctly that it's a closing quote:
     */
    var add_extra_space = 0;
    if (/>['"]$/.test(text)) {
      add_extra_space = 1; // Remember, so we can trim the extra space later.
      text = text + ' ';
    }
    var tokens = _tokenize(text);
    var result = '';
    /**
     * Keep track of when we're inside <pre> or <code> tags.
     */
    var in_pre = 0;
    /**
     * This is a cheat, used to get some context
     * for one-character tokens that consist of
     * just a quote char. What we do is remember
     * the last character of the previous text
     * token, to use as context to curl single-
     * character quote tokens correctly.
     */
    var prev_token_last_char = '';
    for (var i = 0; i < tokens.length; i++) {
      var cur_token = tokens[i];
      if (cur_token[0] === 'tag') {
        result = result + cur_token[1];
        var matched = tags_to_skip.exec(cur_token[1]);
        if (matched) {
          if (matched[1] === '/') {
            in_pre = 0;
          }
          else {
            in_pre = 1;
          }
        }
      }
      else {
        var t = cur_token[1];
        var last_char = t.substring(t.length - 1, t.length); // Remember last char of this token before processing.
        if (!in_pre) {
          t = ProcessEscapes(t);
          if (t === '\'') {
            // Special case: single-character ' token
            if (/\S/.test(prev_token_last_char)) {
              t = '&#8217;';
            }
            else {
              t = '&#8216;';
            }
          }
          else if (t === '"') {
            // Special case: single-character " token
            if (/\S/.test(prev_token_last_char)) {
              t = '&#8221;';
            }
            else {
              t = '&#8220;';
            }
          }
          else {
            // Normal case:
            t = EducateQuotes(t);
          }
        }
        prev_token_last_char = last_char;
        result = result + t;
      }
    }
    if (add_extra_space) {
      result = result.replace(/ $/, '');
    }
    return result;
  };
  exports.smartquotes = SmartQuotes;
  var SmartDashes = function (text, attr) {
    if (text === void 0) { text = ''; }
    if (attr === void 0) { attr = '1'; }
    // reference to the subroutine to use for dash education, default to EducateDashes:
    var dash_sub_ref = EducateDashes;
    if (typeof attr === 'number') {
      attr = attr.toString();
    }
    else {
      attr = attr.replace(/\s/g, '');
    }
    if (attr === '0') {
      // Do nothing
      return text;
    }
    else if (attr === '2') {
      // use old smart dash shortcuts, "--" for en, "---" for em
      dash_sub_ref = EducateDashesOldSchool;
    }
    else if (attr === '3') {
      // inverse of 2, "--" for em, "---" for en
      dash_sub_ref = EducateDashesOldSchoolInverted;
    }
    var tokens = _tokenize(text);
    var result = '';
    /**
     * Keep track of when we're inside <pre> or <code> tags.
     */
    var in_pre = 0;
    for (var i = 0; i < tokens.length; i++) {
      var cur_token = tokens[i];
      if (cur_token[0] === 'tag') {
        result = result + cur_token[1];
        var matched = tags_to_skip.exec(cur_token[1]);
        if (matched) {
          if (matched[1] === '/') {
            in_pre = 0;
          }
          else {
            in_pre = 1;
          }
        }
      }
      else {
        var t = cur_token[1];
        if (!in_pre) {
          t = ProcessEscapes(t);
          t = dash_sub_ref(t);
        }
        result = result + t;
      }
    }
    return result;
  };
  exports.smartdashes = SmartDashes;
  var SmartEllipses = function (text, attr) {
    if (text === void 0) { text = ''; }
    if (attr === void 0) { attr = '1'; }
    if (typeof attr === 'number') {
      attr = attr.toString();
    }
    else {
      attr = attr.replace(/\s/g, '');
    }
    if (attr === '0') {
      // Do nothing
      return text;
    }
    var tokens = _tokenize(text);
    var result = '';
    /**
     * Keep track of when we're inside <pre> or <code> tags.
     */
    var in_pre = 0;
    for (var i = 0; i < tokens.length; i++) {
      var cur_token = tokens[i];
      if (cur_token[0] === 'tag') {
        result = result + cur_token[1];
        var matched = tags_to_skip.exec(cur_token[1]);
        if (matched) {
          if (matched[1] === '/') {
            in_pre = 0;
          }
          else {
            in_pre = 1;
          }
        }
      }
      else {
        var t = cur_token[1];
        if (!in_pre) {
          t = ProcessEscapes(t);
          t = EducateEllipses(t);
        }
        result = result + t;
      }
    }
    return result;
  };
  exports.smartellipses = SmartEllipses;
  /**
   * @param {string} str String
   * @return {string} The string, with "educated" curly quote HTML entities.
   *
   * Example input:  "Isn't this fun?"
   * Example output: &#8220;Isn&#8217;t this fun?&#8221;
   */
  var EducateQuotes = function (str) {
    /**
     * Make our own "punctuation" character class, because the POSIX-style
     * [:PUNCT:] is only available in Perl 5.6 or later:
     *
     * JavaScript don't have punctuation class neither.
     */
    var punct_class = '[!"#\$\%\'()*+,-./:;<=>?\@\[\\\]\^_`{|}~]'; // eslint-disable-line no-useless-escape
    /**
     * Special case if the very first character is a quote
     * followed by punctuation at a non-word-break. Close the quotes by brute force:
     */
    str = str.replace(new RegExp("^'(?=" + punct_class + "\\B)"), '&#8217;'); // eslint-disable-line no-useless-escape
    str = str.replace(new RegExp("^\"(?=" + punct_class + "\\B)"), '&#8221;'); // eslint-disable-line no-useless-escape
    /**
     * Special case for double sets of quotes, e.g.:
     *   <p>He said, "'Quoted' words in a larger quote."</p>
     */
    str = str.replace(/"'(?=\w)/, '&#8220;&#8216;');
    str = str.replace(/'"(?=\w)/, '&#8216;&#8220;');
    /**
     * Special case for decade abbreviations (the '80s):
     */
    str = str.replace(/'(?=\d\d)/, '&#8217;');
    var close_class = '[^\\ \\t\\r\\n\\[\\{\\(\\-]'; // eslint-disable-line no-useless-escape
    var not_close_class = '[\\ \\t\\r\\n\\[\\{\\(\\-]'; // eslint-disable-line no-useless-escape
    var dec_dashes = '&#8211;|&#8212;';
    /**
     * Get most opening single quotes:
     * s {
     *     (
     *         \s          |   # a whitespace char, or
     *         &nbsp;      |   # a non-breaking space entity, or
     *         --          |   # dashes, or
     *         &[mn]dash;  |   # named dash entities
     *         $dec_dashes |   # or decimal entities
     *         &\#x201[34];    # or hex
     *     )
     *     '                   # the quote
     *     (?=\w)              # followed by a word character
     * } {$1&#8216;}xg;
     */
    str = str.replace(new RegExp("(\\s|&nbsp;|--|&[mn]dash;|" + dec_dashes + "|&#x201[34])'(?=\\w)", 'g'), '\$1&#8216;'); // eslint-disable-line no-useless-escape
    /**
     * Single closing quotes:
     * s {
     *     ($close_class)?
     *     '
     *     (?(1)|          # If $1 captured, then do nothing;
     *       (?=\s | s\b)  # otherwise, positive lookahead for a whitespace
     *     )               # char or an 's' at a word ending position. This
     *                     # is a special case to handle something like:
     *                     # "<i>Custer</i>'s Last Stand."
     * } {$1&#8217;}xgi;
     */
    str = str.replace(new RegExp("(" + close_class + ")'", 'g'), '\$1&#8217;'); // eslint-disable-line no-useless-escape
    str = str.replace(new RegExp("(" + not_close_class + "?)'(?=\\s|s\\b)", 'g'), '\$1&#8217;'); // eslint-disable-line no-useless-escape
    /**
     * Any remaining single quotes should be opening ones:
     */
    str = str.replace(/'/g, '&#8216;');
    /**
     * Get most opening double quotes:
     * s {
     *     (
     *         \s          |   # a whitespace char, or
     *         &nbsp;      |   # a non-breaking space entity, or
     *         --          |   # dashes, or
     *         &[mn]dash;  |   # named dash entities
     *         $dec_dashes |   # or decimal entities
     *         &\#x201[34];    # or hex
     *     )
     *     "                   # the quote
     *     (?=\w)              # followed by a word character
     * } {$1&#8220;}xg;
     */
    str = str.replace(new RegExp("(\\s|&nbsp;|--|&[mn]dash;|" + dec_dashes + "|&#x201[34])\"(?=\\w)", 'g'), '\$1&#8220;'); // eslint-disable-line no-useless-escape
    /**
     * Double closing quotes:
     * s {
     *     ($close_class)?
     *     "
     *     (?(1)|(?=\s))   # If $1 captured, then do nothing;
     *                        # if not, then make sure the next char is whitespace.
     * } {$1&#8221;}xg;
     */
    str = str.replace(new RegExp("(" + close_class + ")\"", 'g'), '\$1&#8221;'); // eslint-disable-line no-useless-escape
    str = str.replace(new RegExp("(" + not_close_class + "?)\"(?=\\s)", 'g'), '\$1&#8221;'); // eslint-disable-line no-useless-escape
    /**
     * Any remaining quotes should be opening ones.
     */
    str = str.replace(/"/g, '&#8220;');
    return str;
  };
  /**
   * @param {string} str String
   * @return {string} The string, with ``backticks'' -style double quotes
   *                  translated into HTML curly quote entities.
   *
   * Example input:  ``Isn't this fun?''
   * Example output: &#8220;Isn't this fun?&#8221;
   */
  var EducateBackticks = function (str) {
    str = str.replace(/``/g, '&#8220;');
    str = str.replace(/''/g, '&#8221;');
    return str;
  };
  /**
   * @param {string} str String
   * @return {string} The string, with `backticks' -style single quotes
   *                  translated into HTML curly quote entities.
   *
   * Example input:  `Isn't this fun?'
   * Example output: &#8216;Isn&#8217;t this fun?&#8217;
   */
  var EducateSingleBackticks = function (str) {
    str = str.replace(/`/g, '&#8216;');
    str = str.replace(/'/g, '&#8217;');
    return str;
  };
  /**
   * @param {string} str String
   * @return {string} The string, with each instance of "--" translated to
   *                  an em-dash HTML entity.
   */
  var EducateDashes = function (str) {
    str = str.replace(/--/g, '&#8212;');
    return str;
  };
  /**
   * @param {string} str String
   * @return {string} The string, with each instance of "--" translated to
   *                  an en-dash HTML entity, and each "---" translated to
   *                  an em-dash HTML entity.
   */
  var EducateDashesOldSchool = function (str) {
    str = str.replace(/---/g, '&#8212;');
    str = str.replace(/--/g, '&#8211;');
    return str;
  };
  /**
   * @param {string} str String
   * @return {string} The string, with each instance of "--" translated to
   *                  an em-dash HTML entity, and each "---" translated to
   *                  an en-dash HTML entity. Two reasons why: First, unlike the
   *                  en- and em-dash syntax supported by
   *                  EducateDashesOldSchool(), it's compatible with existing
   *                  entries written before SmartyPants 1.1, back when "--" was
   *                  only used for em-dashes.  Second, em-dashes are more
   *                  common than en-dashes, and so it sort of makes sense that
   *                  the shortcut should be shorter to type. (Thanks to Aaron
   *                  Swartz for the idea.)
   */
  var EducateDashesOldSchoolInverted = function (str) {
    str = str.replace(/---/g, '&#8211;');
    str = str.replace(/--/g, '&#8212;');
    return str;
  };
  /**
   * @param {string} str String
   * @return {string} The string, with each instance of "..." translated to
   *                  an ellipsis HTML entity. Also converts the case where
   *                  there are spaces between the dots.
   *
   * Example input:  Huh...?
   * Example output: Huh&#8230;?
   */
  var EducateEllipses = function (str) {
    str = str.replace(/\.\.\./g, '&#8230;');
    str = str.replace(/\. \. \./g, '&#8230;');
    return str;
  };
  /**
   * @param {string} str String
   * @return {string} The string, with each SmartyPants HTML entity translated to
   *                  its ASCII counterpart.
   *
   * Example input:  &#8220;Hello &#8212; world.&#8221;
   * Example output: "Hello -- world."
   */
  var StupefyEntities = function (str) {
    str = str.replace(/&#8211;/g, '-'); // en-dash
    str = str.replace(/&#8212;/g, '--'); // em-dash
    str = str.replace(/&#8216;/g, '\''); // open single quote
    str = str.replace(/&#8217;/g, '\''); // close single quote
    str = str.replace(/&#8220;/g, '"'); // open double quote
    str = str.replace(/&#8221;/g, '"'); // close double quote
    str = str.replace(/&#8230;/g, '...'); // ellipsis
    return str;
  };
  /**
   * @param {string} str String
   * @return {string} The string, with each SmartyPants HTML entity translated to
   *                  UTF-8 characters.
   *
   * Example input:  “Hello &#8217; world.”
   * Example output: "Hello — world."
   */
  var EducateEntities = function (text, attr) {
    if (attr === void 0) { attr = '1'; }
    var do_quotes;
    var do_backticks;
    var do_dashes;
    var do_ellipses;
    // var do_stupefy:number;
    if (typeof attr === 'number') {
      attr = attr.toString();
    }
    else {
      attr = attr.replace(/\s/g, '');
    }
    if (attr === '0') {
      // Do nothing
      return text;
    }
    else if (attr === '1') {
      // Do everything, turn all options on.
      do_quotes = 1;
      do_backticks = 1;
      do_dashes = 1;
      do_ellipses = 1;
    }
    else if (attr === '2') {
      // Do everything, turn all options on, use old school dash shorthand.
      do_quotes = 1;
      do_backticks = 1;
      do_dashes = 3;
      do_ellipses = 1;
    }
    else if (attr === '3') {
      // Do everything, turn all options on, use inverted old school dash shorthand.
      do_quotes = 1;
      do_backticks = 1;
      do_dashes = 3;
      do_ellipses = 1;
      // } else if (attr === '-1') {
      //   // Special "stupefy" mode.
      //   do_stupefy = 1;
    }
    else {
      for (var i = 0; i < attr.length; i++) {
        var c = attr[i];
        if (c === 'q') {
          do_quotes = 1;
        }
        if (c === 'b') {
          do_backticks = 1;
        }
        if (c === 'B') {
          do_backticks = 2;
        }
        if (c === 'd') {
          do_dashes = 1;
        }
        if (c === 'D') {
          do_dashes = 2;
        }
        if (c === 'i') {
          do_dashes = 3;
        }
        if (c === 'e') {
          do_ellipses = 1;
        }
      }
    }
    if (do_dashes) {
      text = text.replace(/&#8211;/g, '\u2013'); // en-dash
      text = text.replace(/&#8212;/g, '\u2014'); // em-dash
    }
    if (do_quotes || do_backticks) {
      text = text.replace(/&#8216;/g, '\u2018'); // open single quote
      text = text.replace(/&#8217;/g, '\u2019'); // close single quote
      text = text.replace(/&#8220;/g, '\u201c'); // open double quote
      text = text.replace(/&#8221;/g, '\u201d'); // close double quote
    }
    if (do_ellipses) {
      text = text.replace(/&#8230;/g, '\u2026'); // ellipsis
    }
    return text;
  };
  /**
   * @param {string} str String
   * @return {string} The string, with each SmartyPants UTF-8 chars translated to
   *                  its ASCII counterpart.
   *
   * Example input:  &#8220;Hello &#8212; world.&#8221;
   * Example output: "Hello -- world."
   */
  var StupifyUTF8Char = function (str) {
    str = str.replace(/\u2013/g, '-'); // en-dash
    str = str.replace(/\u2014/g, '--'); // em-dash
    str = str.replace(/\u2018/g, '\''); // open single quote
    str = str.replace(/\u2019/g, '\''); // close single quote
    str = str.replace(/\u201c/g, '"'); // open double quote
    str = str.replace(/\u201d/g, '"'); // close double quote
    str = str.replace(/\u2026/g, '...'); // ellipsis
    return str;
  };
  /**
   * @param {string} str String
   * @return {string} string, with after processing the following backslash
   *                  escape sequences. This is useful if you want to force a "dumb"
   *                  quote or other character to appear.
   *
   *                  Escape  Value
   *                  ------  -----
   *                  \\      &#92;
   *                  \"      &#34;
   *                  \'      &#39;
   *                  \.      &#46;
   *                  \-      &#45;
   *                  \`      &#96;
   *
   */
  var ProcessEscapes = function (str) {
    str = str.replace(/\\\\/g, '&#92;');
    str = str.replace(/\\"/g, '&#34;');
    str = str.replace(/\\'/g, '&#39;');
    str = str.replace(/\\\./g, '&#46;');
    str = str.replace(/\\-/g, '&#45;');
    str = str.replace(/\\`/g, '&#96;');
    return str;
  };
  /**
   * @param {string} str String containing HTML markup.
   * @return {Array<token>} Reference to an array of the tokens comprising the input
   *                        string. Each token is either a tag (possibly with nested,
   *                        tags contained therein, such as <a href="<MTFoo>">, or a
   *                        run of text between tags. Each element of the array is a
   *                        two-element array; the first is either 'tag' or 'text';
   *                        the second is the actual value.
   *
   * Based on the _tokenize() subroutine from Brad Choate's MTRegex plugin.
   *     <http://www.bradchoate.com/past/mtregex.php>
   */
  var _tokenize = function (str) {
    var pos = 0;
    var len = str.length;
    var tokens = [];
    var match = /<!--[\s\S]*?-->|<\?.*?\?>|<[^>]*>/g;
    var matched = null;
    while (matched = match.exec(str)) { // eslint-disable-line no-cond-assign
      if (pos < matched.index) {
        var t_1 = ['text', str.substring(pos, matched.index)];
        tokens.push(t_1);
      }
      var t = ['tag', matched.toString()];
      tokens.push(t);
      pos = match.lastIndex;
    }
    if (pos < len) {
      var t = ['text', str.substring(pos, len)];
      tokens.push(t);
    }
    return tokens;
  };
  var smartypantsu = function (text, attr) {
    if (text === void 0) { text = ''; }
    if (attr === void 0) { attr = '1'; }
    var str = SmartyPants(text, attr);
    if (typeof attr === 'number') {
      attr = attr.toString();
    }
    else {
      attr = attr.replace(/\s/g, '');
    }
    if (attr === '-1') {
      return StupifyUTF8Char(str);
    }
    else {
      return EducateEntities(str, attr);
    }
  };
  exports.smartypantsu = smartypantsu;
  exports["default"] = SmartyPants;


}));
