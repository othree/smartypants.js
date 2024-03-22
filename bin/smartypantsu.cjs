#! /usr/bin/env node

const binary = "smartypantsu";
const mode = process.argv[2] || "1";

if (mode == "-h" || mode == "--help") {
  process.stdout.write(`Usage: ${binary} [mode]

Available modes:

  0     Suppress all transformations. (Do nothing.)
  1     Performs default SmartyPants transformations: quotes (including backticks-style), em-dashes, and ellipses. -- (dash dash) is used to signify an em-dash; there is no support for en-dashes.
  2     Same as 1, except that it uses the old-school typewriter shorthand for dashes: -- (dash dash) for en-dashes, --- (dash dash dash) for em-dashes.
  3     Same 2, but inverts the shorthand for dashes: -- (dash dash) for em-dashes, and --- (dash dash dash) for en-dashes.
  -1    Stupefy mode. Reverses the SmartyPants transformation process, turning the HTML entities produced by SmartyPants into their ASCII equivalents. E.g. &#8220; is turned into a simple double-quote ("), &#8212; is turned into two dashes, etc. This is useful if you are using SmartyPants from Brad Choate's MT-Textile text filter, but wish to suppress smart punctuation in specific MT templates, such as RSS feeds. Text filters do their work before templates are processed; but you can use smarty_pants="-1" to reverse the transformations in specific templates.
  `);
  process.exit(0);
}

if (process.stdin.isTTY) {
  console.error("No input!");
  process.exit(1);
}

let smartypants = require("../smartypants.cjs").smartypantsu;
let text = "";

process.stdin.setEncoding("utf8");

process.stdin.on("readable", () => {
  let chunk = process.stdin.read();
  if (chunk !== null) {
    text = text + chunk;
  }
});

process.stdin.on("end", () => {
  process.stdout.write(smartypants(text, mode));
});
