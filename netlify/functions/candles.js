export async function handler(event) {
  const API_KEY = "3ade87d28ce9f3ee310814492746fdcf-c-app";

  const pair = event.queryStringParameters.pair || "EURUSD";
  const duration = event.queryStringParameters.duration || "3";

  try {
    // Native fetch in Node 18+
    const response = await fetch(
      `https://quote.alltick.io/quote-b-api/kline?token=${API_KEY}&query=${encodeURIComponent(
        JSON.stringify({
          data: {
            code: pair,
            kline_type: duration,
            kline_timestamp_end: 0,
            query_kline_num: 200,
            adjust_type: 0,
          },
        })
      )}`
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };git 
  }
}