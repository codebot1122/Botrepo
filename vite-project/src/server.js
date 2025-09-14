// netlify/functions/candles.js
import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const { pair, duration } = event.queryStringParameters;

    if (!pair || !duration) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing pair or duration" }),
      };
    }

    const API_KEY = "3ade87d28ce9f3ee310814492746fdcf-c-app";

    const query = {
      data: {
        code: pair,
        kline_type: parseInt(duration, 10),
        kline_timestamp_end: "0",
        query_kline_num: "200",
        adjust_type: "0",
      },
    };

    const url = `https://quote.alltick.io/quote-b-api/kline?token=${API_KEY}&query=${encodeURIComponent(
      JSON.stringify(query)
    )}`;

    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Error in candles function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message }),
    };
  }
}
