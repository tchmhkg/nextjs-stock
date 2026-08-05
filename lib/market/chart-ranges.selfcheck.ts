/**
 * ponytail: self-check for chart range table.
 * yarn tsx lib/market/chart-ranges.selfcheck.ts
 */
import assert from "node:assert/strict";
import {
  CHART_RANGES,
  CHART_RANGE_IDS,
  isChartRangeId,
} from "./chart-ranges";

assert.equal(CHART_RANGE_IDS.length, 6);
assert.equal(CHART_RANGES["1D"].interval, "1m");
assert.equal(CHART_RANGES["5D"].interval, "5m");
assert.equal(CHART_RANGES["1Y"].lookbackDays, 365);
assert.equal(isChartRangeId("1D"), true);
assert.equal(isChartRangeId("1m"), false);

console.log("ok chart ranges");
