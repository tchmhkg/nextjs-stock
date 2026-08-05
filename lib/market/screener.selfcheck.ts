/**
 * ponytail: self-check for screener list ids.
 * yarn tsx lib/market/screener.selfcheck.ts
 */
import assert from "node:assert/strict";
import {
  DEFAULT_SCREENER_COUNT,
  SCREENER_LIST_IDS,
  screenerListSchema,
} from "./screener";

assert.equal(SCREENER_LIST_IDS.length, 3);
assert.ok(screenerListSchema.safeParse("day_gainers").success);
assert.ok(!screenerListSchema.safeParse("undervalued_large_caps").success);
assert.equal(DEFAULT_SCREENER_COUNT, 8);

console.log("ok screener lists");
