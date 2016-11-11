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

}
