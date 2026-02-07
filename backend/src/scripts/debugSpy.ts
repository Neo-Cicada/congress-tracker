
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

const debugSpy = async () => {
    try {
        const currentYear = new Date().getFullYear();
        // Try fetching from start of LAST year just to be sure we get data if it's very early in current year
        // But for YTD we need Jan 1 of CURRENT year.
        const startOfYear = new Date(`${currentYear}-01-01`);

        console.log(`Fetching SPY data from ${startOfYear.toISOString()}...`);

        const queryOptions = {
            period1: startOfYear,
            period2: new Date(), // Today
            interval: '1d' as const
        };

        // Fetch historical
        const history = await yahooFinance.historical('SPY', queryOptions) as any[];
        console.log(`History length: ${history.length}`);

        if (history.length > 0) {
            console.log('First history item:', history[0]);
            console.log('Last history item:', history[history.length - 1]);

            const startPrice = history[0].close;
            console.log('Start Price (Jan 1ish):', startPrice);

            // Fetch Quote for current price
            const quote = await yahooFinance.quote('SPY') as any;
            console.log('Current Quote Regular Market Price:', quote.regularMarketPrice);

            const currentPrice = quote.regularMarketPrice;
            const ytd = ((currentPrice - startPrice) / startPrice) * 100;

            console.log(`Calculated YTD: ${ytd.toFixed(2)}%`);
        } else {
            console.log('No historical data found.');
        }

    } catch (error) {
        console.error('Error in debugSpy:', error);
    }
};

debugSpy();
