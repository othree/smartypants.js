import test from 'tape';
import { smartypantsu } from '../smartypants.mjs';

test('unicode', function (t) {
  t.plan(4);

  t.equal(smartypantsu('6\'2" tall', '1'), '6\u20192\u201d tall');
  t.equal(smartypantsu("``backticks''", '1'), '\u201cbackticks\u201d');
  t.equal(smartypantsu("A--B", '1'), 'A\u2014B');
  t.equal(smartypantsu('2018"', '1'), '2018\u201d');
});

test('stupefy unicode', function (t) {
  t.plan(4);

  t.equal(smartypantsu('6\u20192\u201d tall', '-1'), '6\'2" tall');
  t.equal(smartypantsu('\u201cbackticks\u201d', '-1'), '"backticks"');
  t.equal(smartypantsu('A\u2014B', '-1'), 'A--B');
  t.equal(smartypantsu('2018\u201d', '-1'), '2018"');
});
