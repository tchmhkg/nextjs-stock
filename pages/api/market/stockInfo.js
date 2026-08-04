import axios from "axios";
import { getMetaInfo, FINNHUB_COMPANY_NEWS_API } from "~/utils/apiUrls";

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.json({ success: false, feeds: [], desc: null });
  }

  try {
    const to = new Date();
    const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().slice(0, 10);

    const [metaRes, newsRes] = await Promise.all([
      axios.get(getMetaInfo(symbol)),
      axios.get(FINNHUB_COMPANY_NEWS_API, {
        params: {
          symbol,
          from: fmt(from),
          to: fmt(to),
        },
      }),
    ]);

    const feeds = (Array.isArray(newsRes?.data) ? newsRes.data : []).slice(0, 20).map((item) => ({
      title: item.headline,
      link: item.url,
      guid: String(item.id ?? item.url),
      pubDate: item.datetime ? new Date(item.datetime * 1000).toISOString() : new Date().toISOString(),
    }));

    res.json({
      success: true,
      feeds,
      desc: metaRes?.data?.description || null,
    });
  } catch (error) {
    console.log(error?.message || error);
    res.json({
      success: false,
      feeds: [],
      desc: null,
    });
  }
}
