import test from "tape";
import { smartypantsu } from "../smartypants.mjs";

const LSQ = "\u2018";
const RSQ = "\u2019";
const LDQ = "\u201c";
const RDQ = "\u201d";
const END = "\u2013";
const EMD = "\u2014";
const ELP = "\u2026";

test("unicode", function (t) {
  t.plan(8);

  t.equal(smartypantsu("6'2\" tall", "1"), `6${RSQ}2${RDQ} tall`);
  t.equal(smartypantsu("``backticks''", "1"), `${LDQ}backticks${RDQ}`);
  t.equal(smartypantsu("A--B", "1"), `A${EMD}B`);
  t.equal(smartypantsu('2018"', "1"), `2018${RDQ}`);
  t.equal(smartypantsu("hello ...", "1"), `hello ${ELP}`);
  t.equal(
    smartypantsu("<i>Custer</i>'s Last Stand.", "1"),
    `<i>Custer</i>${RSQ}s Last Stand.`
  );
  t.equal(
    smartypantsu('<i>Custer</i>"s Last Stand.', "1"),
    `<i>Custer</i>${LDQ}s Last Stand.`
  );
  t.equal(
    smartypantsu('It effectively "skips" over all navigational', "1"),
    `It effectively ${LDQ}skips${RDQ} over all navigational`
  );
});

test("stupefy unicode", function (t) {
  t.plan(5);

  t.equal(smartypantsu(`6${RSQ}2${RDQ} tall`, "-1"), "6'2\" tall");
  t.equal(smartypantsu(`${LDQ}backticks${RDQ}`, "-1"), '"backticks"');
  t.equal(smartypantsu(`A${EMD}B`, "-1"), "A--B");
  t.equal(smartypantsu(`2018${RDQ}`, "-1"), '2018"');
  t.equal(smartypantsu(`hello ${ELP}`, "-1"), "hello ...");
});
