type token = [string, string];

var tags_to_skip = /<(?:\/?)(?:pre|code|kbd|script|math)[^>]*>/i;

/**
 * @param text text to be parsed
 * @param attr value of the smart_quotes="" attribute
 */
var smartypants = (text:string = '', attr:string|number = "1"):string => {

  var do_quotes:number;
  var do_backticks:number;
  var do_dashes:number;
  var do_ellipses:number;
  var do_stupefy:number;
  var convert_quot:number = 0;

  if (typeof attr === 'number') {
    attr = attr.toString();
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

  if (attr === "0") {
    // Do nothing
    return text;
  }
  else if (attr === "1") {
    // Do everything, turn all options on.
    do_quotes = 1;
    do_backticks = 1;
    do_dashes = 1;
    do_ellipses = 1;
  }
  else if (attr === "2") {
    // Do everything, turn all options on, use old school dash shorthand.
    do_quotes = 1;
    do_backticks = 1;
    do_dashes = 3;
    do_ellipses = 1;
  }
  else if (attr === "3") {
    // Do everything, turn all options on, use inverted old school dash shorthand.
    do_quotes = 1;
    do_backticks = 1;
    do_dashes = 3;
    do_ellipses = 1;
  }
  else if (attr === "-1") {
    // Special "stupefy" mode.
    do_stupefy = 1;
  }
  else {
    for (let i = 0; i < attr.length; i++) {
      let c = attr[i];
      if (c === 'q') { do_quotes = 1; }
      if (c === 'b') { do_backticks = 1; }
      if (c === 'B') { do_backticks = 2; }
      if (c === 'd') { do_dashes = 1; }
      if (c === 'D') { do_dashes = 2; }
      if (c === 'i') { do_dashes = 3; }
      if (c === 'e') { do_ellipses = 1; }
      if (c === 'w') { convert_quot = 1; }
    }
  }

  var tokens:Array<token> = _tokenize(text);
  var result:string = '';
  /**
   * Keep track of when we're inside <pre> or <code> tags.
   */
  var in_pre:number = 0;
  /**
   * This is a cheat, used to get some context
   * for one-character tokens that consist of 
   * just a quote char. What we do is remember
   * the last character of the previous text
   * token, to use as context to curl single-
   * character quote tokens correctly.
   */
  var prev_token_last_char:string = '';

}

/**
 * @param {string} str String 
 * @return {string} The string, with ``backticks'' -style double quotes
 *                  translated into HTML curly quote entities.
 *     
 * Example input:  ``Isn't this fun?''
 * Example output: &#8220;Isn't this fun?&#8221;
 */
var EducateBackticks = (str:string):string => {
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
var EducateSingleBackticks = (str:string):string => {
  str = str.replace(/`/g, '&#8216;');
  str = str.replace(/'/g, '&#8217;');
  return str;
};

/**
 * @param {string} str String 
 * @return {string} The string, with each instance of "--" translated to
 *                  an em-dash HTML entity.
 */
var EducateDashes = (str:string):string => {
  str = str.replace(/--/g, '&#8212;');
  return str;
};

/**
 * @param {string} str String 
 * @return {string} The string, with each instance of "--" translated to
 *                  an en-dash HTML entity, and each "---" translated to
 *                  an em-dash HTML entity.
 */
var EducateDashesOldSchool = (str:string):string => {
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
var EducateDashesOldSchoolInverted = (str:string):string => {
  str = str.replace(/---/g, '&#8211;');
  str = str.replace(/--/g, '&#8212;');
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
var ProcessEscapes = (str:string):string => {
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
var _tokenize = (str:string):Array<token> => {
  var pos = 0;
  var len = str.length;
  var tokens = [];

  var match = /<!--[\s\S]*?-->|<\?.*?\?>|<[^>]*>/g;

  var matched = null;

  while (matched = match.exec(str)) {
    if (pos < matched.index) {
      let t:token = ['text', str.substring(pos, matched.index)];
      tokens.push(t);
    }
    let t:token = ['tag', matched.toString()];
    tokens.push(t);

    pos = match.lastIndex;
  }
  if (pos < len) {
    let t:token = ['text', str.substring(pos, len)];
    tokens.push(t);
  }

  return tokens;
};

