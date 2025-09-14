// netlify/functions/candles.js
import fetch from "node-fetch";

export async function handler(event) {
  const { pair, duration } = event.queryStringParameters;

  const API_KEY = "3ade87d28ce9f3ee310814492746fdcf-c-app";
  const url = `https://quote.alltick.io/quote-b-api/kline?token=${API_KEY}&query=${encodeURIComponent(
    JSON.stringify({
      data: {
        code: pair,
        kline_type: parseInt(duration, 10),
        kline_timestamp_end: "0",
        query_kline_num: "200",
        adjust_type: "0",
      },
    })
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
