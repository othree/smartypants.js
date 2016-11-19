#! /usr/bin/env node

if (process.stdin.isTTY) {
  console.error('No input!');
  process.exit(1);
}

var smartypants = require('..').smartypants;

var text = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    text = text + chunk;
  }
});

process.stdin.on('end', () => {
  process.stdout.write(smartypants(text, '1'));
});

