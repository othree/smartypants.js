import test from 'tape';
import { smartypants } from '../smartypants.es6.js';

const LSQ = '&#8216;';
const RSQ = '&#8217;';
const LDQ = '&#8220;';
const RDQ = '&#8221;';
const END = '&#8211;';
const EMD = '&#8212;';
const ELP = '&#8230;';

test('entity', function (t) {
  t.plan(7);

  t.equal(smartypants('6\'2" tall', '1'), `6${RSQ}2${RDQ} tall`);
  t.equal(smartypants("``backticks''", '1'), `${LDQ}backticks${RDQ}`);
  t.equal(smartypants("A--B", '1'), `A${EMD}B`);
  t.equal(smartypants('2018"', '1'), `2018${RDQ}`);
  t.equal(smartypants('hello ...', '1'), `hello ${ELP}`);
  t.equal(smartypants("<i>Custer</i>'s Last Stand.", '1'), `<i>Custer</i>${RSQ}s Last Stand.`);
  t.equal(smartypants('<i>Custer</i>"s Last Stand.', '1'), `<i>Custer</i>${RDQ}s Last Stand.`);
});

test('stupefy entity', function (t) {
  t.plan(5);

  t.equal(smartypants(`6${RSQ}2${RDQ} tall`, '-1'), '6\'2" tall');
  t.equal(smartypants(`${LDQ}backticks${RDQ}`, '-1'), '"backticks"');
  t.equal(smartypants(`A${EMD}B`, '-1'), 'A--B');
  t.equal(smartypants(`2018${RDQ}`, '-1'), '2018"');
  t.equal(smartypants(`hello ${ELP}`, '-1'), 'hello ...');
});
