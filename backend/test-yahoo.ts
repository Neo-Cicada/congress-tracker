import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

async function main() {
  try {
    const quote = await yahooFinance.quote('MSFT') as any;
    console.log("quote.regularMarketChangePercent:", quote?.regularMarketChangePercent);
    console.log(quote);
  } catch (e) {
    console.error(e);
  }
}

main();
