// src/CurrencySignalBot.jsx

import React, { useState } from "react";
import { EMA, RSI, MACD, BollingerBands } from "technicalindicators";

export default function CurrencySignalBot() {
  const [pair, setPair] = useState("EURUSD");
  const [duration, setDuration] = useState("3"); // 3 = 15m in AllTick docs
  const [signal, setSignal] = useState("");
  const [loading, setLoading] = useState(false);

  // list of pairs
  const pairs = [
    { value: "EURUSD", label: "EUR/USD" },
    { value: "USDJPY", label: "USD/JPY" },
    { value: "GBPUSD", label: "GBP/USD" },
    { value: "AUDUSD", label: "AUD/USD" },
    { value: "USDCAD", label: "USD/CAD" },
    { value: "NZDUSD", label: "NZD/USD" },
  ];

  // list of durations
  const durations = [
    { value: "1", label: "1 Minute" },
    { value: "2", label: "5 Minutes" },
    { value: "3", label: "15 Minutes" },
    { value: "4", label: "30 Minutes" },
    { value: "5", label: "1 Hour" },
    { value: "7", label: "4 Hours" },
    { value: "8", label: "1 Day" },
    { value: "9", label: "1 Week" },
    { value: "10", label: "1 Month" },
  ];

  const getSignal = async () => {
    setLoading(true);
    setSignal("");
    try {
      // ✅ use Netlify function instead of localhost
      const url = `/.netlify/functions/candles?pair=${pair}&duration=${duration}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const json = await res.json();

      if (!json.data || !json.data.kline_list || json.data.kline_list.length === 0) {
        setSignal("No kline data");
        setLoading(false);
        return;
      }

      const klineList = json.data.kline_list;
      const closes = klineList.map((item) => parseFloat(item.close_price));

      // Indicators
      const ema = EMA.calculate({ period: 14, values: closes });
      const rsi = RSI.calculate({ period: 14, values: closes });
      const macd = MACD.calculate({
        values: closes,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      });
      const bb = BollingerBands.calculate({
        period: 20,
        stdDev: 2,
        values: closes,
      });

      const lastClose = closes[closes.length - 1];
      const lastEMA = ema[ema.length - 1];
      const lastRSI = rsi[rsi.length - 1];
      const lastMACD = macd[macd.length - 1];
      const lastBB = bb[bb.length - 1];

      let score = 0;
      if (lastClose > lastEMA) score++;
      if (lastRSI < 30) score++;
      if (lastMACD && lastMACD.MACD > lastMACD.signal) score++;
      if (lastBB && lastClose <= lastBB.lower) score++;

      if (lastClose < lastEMA) score--;
      if (lastRSI > 70) score--;
      if (lastMACD && lastMACD.MACD < lastMACD.signal) score--;
      if (lastBB && lastClose >= lastBB.upper) score--;

      let final = "Neutral";
      if (score >= 2) final = "Buy";
      else if (score <= -2) final = "Sell";

      setSignal(final);
    } catch (err) {
      console.error("Fetch or processing error:", err);
      setSignal("Error fetching data");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Currency Signal Bot</h2>

      <div style={{ margin: "10px 0" }}>
        <label>Pair: </label>
        <select value={pair} onChange={(e) => setPair(e.target.value)}>
          {pairs.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ margin: "10px 0" }}>
        <label>Duration: </label>
        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
          {durations.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <button onClick={getSignal} disabled={loading}>
        {loading ? "Loading..." : "Get Signal"}
      </button>

      <div style={{ marginTop: "20px", fontSize: "1.5em", fontWeight: "bold" }}>
        {signal && (
          <span
            style={{
              color:
                signal === "Buy"
                  ? "green"
                  : signal === "Sell"
                  ? "red"
                  : "goldenrod",
            }}
          >
            Signal: {signal}
          </span>
        )}
      </div>
    </div>
  );
}
