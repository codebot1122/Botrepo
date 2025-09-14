// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;

// enable CORS for your frontend
app.use(cors());

const API_KEY = "3ade87d28ce9f3ee310814492746fdcf-c-app";

// Proxy endpoint
app.get("/api/candles", async (req, res) => {
  try {
    const { pair = "EURUSD", duration = "3" } = req.query;

    const query = {
      trace: `${pair}-${duration}-${Date.now()}`,
      data: {
        code: pair,
        kline_type: parseInt(duration, 10), // 1=1m, 2=5m, 3=15m, etc
        kline_timestamp_end: 0,
        query_kline_num: 200,
        adjust_type: 0,
      },
    };

    const url =
      `https://quote.alltick.io/quote-b-api/kline?token=${API_KEY}&query=${encodeURIComponent(JSON.stringify(query))}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
