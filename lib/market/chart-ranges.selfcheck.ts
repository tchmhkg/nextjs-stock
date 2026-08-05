/**
 * ponytail: self-check for lookback × interval rules.
 * yarn tsx lib/market/chart-ranges.selfcheck.ts
 */
import assert from "node:assert/strict";
import {
  coerceInterval,
  effectiveLookbackDays,
  intervalsForLookback,
} from "./chart-ranges";

assert.deepEqual(intervalsForLookback("1D"), [
  "1m",
  "2m",
  "5m",
  "15m",
  "30m",
  "1h",
  "1d",
]);
assert.ok(!intervalsForLookback("1Y").includes("1m"));
assert.equal(coerceInterval("1Y", "1m"), "1d");
assert.equal(coerceInterval("1D", "15m"), "15m");
assert.equal(effectiveLookbackDays("5Y", "1m"), 7);
assert.equal(effectiveLookbackDays("1D", "15m"), 1);

console.log("ok chart lookback × interval");
