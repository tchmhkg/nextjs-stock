/**
 * Live smoke check for Yahoo Finance connectivity (quote + daily chart).
 * Run: yarn smoke:market
 */
import assert from "node:assert/strict";
import YahooFinance from "yahoo-finance2";

async function main() {
  const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

  const quote = await yf.quote("AAPL");
  assert.equal(quote.symbol, "AAPL");
  assert.ok(
    typeof quote.regularMarketPrice === "number" && quote.regularMarketPrice > 0,
    "expected positive price",
  );

  const chart = await yf.chart("AAPL", {
    period1: "2026-05-01",
    interval: "1d",
  });
  assert.ok((chart.quotes?.length ?? 0) > 0, "expected chart bars");
  assert.ok(chart.quotes![0].date, "expected bar date");

  console.log(
    `ok quote=${quote.regularMarketPrice} bars=${chart.quotes!.length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
