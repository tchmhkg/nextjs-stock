/**
 * ponytail: self-check for session refresh mapping.
 * yarn tsx lib/market/session.selfcheck.ts
 */
import assert from "node:assert/strict";
import { quoteRefreshMs, quotesRefreshMs } from "./session";

assert.equal(quoteRefreshMs("REGULAR"), 5_000);
assert.equal(quoteRefreshMs("PRE"), 10_000);
assert.equal(quoteRefreshMs("POST"), 10_000);
assert.equal(quoteRefreshMs("CLOSED"), 60_000);
assert.equal(quoteRefreshMs(null), 60_000);
assert.equal(
  quotesRefreshMs([
    { marketState: "CLOSED" },
    { marketState: "REGULAR" },
  ]),
  5_000,
);
assert.equal(quotesRefreshMs([]), 60_000);

console.log("ok session refresh helpers");
