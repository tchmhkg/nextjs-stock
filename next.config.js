module.exports = (phase) => {
    const env = {
        NEWS_API_KEY: process.env.NEWS_API_KEY,
        FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
        IEX_API_KEY: process.env.IEX_API_KEY,
        IEX_SANDBOX_API_KEY: process.env.IEX_SANDBOX_API_KEY,
        TDA_CLIENT_ID: process.env.TDA_CLIENT_ID,
        TIINGO_API_KEY: process.env.TIINGO_API_KEY
    }

    // next.config.js object
    return {
        env,
    }
}