import test from 'tape';
import { smartypantsu } from '../smartypants.mjs';

test('timing test', function (t) {
  t.plan(3);

  t.equal(smartypantsu('6\'2" tall', '1'), '6\u20192\u201d tall');
  t.equal(smartypantsu("``backticks''", '1'), '\u201cbackticks\u201d');
  t.equal(smartypantsu("A--B", '1'), 'A\u2014B');
});