import "server-only";
import YahooFinance from "yahoo-finance2";

// Singleton for the Node process — crumb/cookie handled inside the client.
const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

export default yahooFinance;
