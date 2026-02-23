import YahooFinance from 'yahoo-finance2';
async function test() {
  try {
    const yahooFinance = new (YahooFinance as any)();
    const q1: any = await yahooFinance.quote('MSFT');
    console.log(q1.regularMarketChangePercent);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}
test();
