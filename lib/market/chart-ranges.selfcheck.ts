/**
 * ponytail: self-check for lookback × interval rules.
 * yarn tsx lib/market/chart-ranges.selfcheck.ts
 */
import assert from "node:assert/strict";
import {
  coerceInterval,
  effectiveLookbackDays,
  historyChunkDays,
  chartHistoryFloorSec,
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
assert.equal(historyChunkDays("1d"), 365);
assert.equal(historyChunkDays("1m"), 7);

const now = Date.UTC(2026, 7, 5, 18, 0, 0); // Aug 5 2026
const floor5m = chartHistoryFloorSec("5m", now);
assert.ok(floor5m > Math.floor((now - 60 * 86400_000) / 1000));
assert.ok(floor5m < Math.floor(now / 1000));
assert.ok(chartHistoryFloorSec("1d", now) < floor5m);

console.log("ok chart lookback × interval");
