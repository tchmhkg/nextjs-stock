import assert from "node:assert/strict";
import YahooFinance from "yahoo-finance2";

async function main() {
  const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });
  const now = await yf.chart("AAPL", {
    period1: new Date(Date.now() - 864e5),
    interval: "5m",
  });
  const bars = now.quotes ?? [];
  assert.ok(bars.length > 0, "expected initial bars");
  const oldest = bars[0]!.date!;
  const older = await yf.chart("AAPL", {
    period1: new Date(oldest.getTime() - 864e5),
    period2: new Date(oldest.getTime() - 1000),
    interval: "5m",
  });
  const olderBars = older.quotes ?? [];
  const strictlyOlder = olderBars.filter((b) => b.date && b.date < oldest);
  console.log(
    `ok initial=${bars.length} olderPage=${olderBars.length} strictlyOlder=${strictlyOlder.length}`,
  );
  assert.ok(strictlyOlder.length > 0, "expected strictly older bars");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
