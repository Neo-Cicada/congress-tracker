export interface MarketEvent {
    id: string;
    name: string;
    date: string; // YYYY-MM-DD
    affectedSectors?: string[];
    affectedTickers?: string[];
    description: string;
}

// A mock database of major market-moving events for the Suspicious Timing Detector.
export const MARKET_EVENTS: MarketEvent[] = [
    {
        id: "evt-1",
        name: "CHIPS Act Hearing",
        date: "2024-03-20", // Mock date for recent data matching
        affectedSectors: ["Technology", "Semiconductors"],
        affectedTickers: ["NVDA", "AMD", "INTC", "TSM"],
        description: "Congress discusses new subsidies for domestic semiconductor manufacturing."
    },
    {
        id: "evt-2",
        name: "Fed Rate Decision",
        date: "2024-05-01",
        affectedSectors: ["Financial Services", "Real Estate"],
        description: "Federal Reserve announces decision on interest rates."
    },
    {
        id: "evt-3",
        name: "Healthcare Policy Vote",
        date: "2024-04-15",
        affectedSectors: ["Healthcare", "Pharmaceuticals"],
        affectedTickers: ["LLY", "UNH", "PFE"],
        description: "Major vote on Medicare drug pricing negotiations."
    },
    {
        id: "evt-4",
        name: "Defense Spending Bill",
        date: "2024-06-10",
        affectedSectors: ["Aerospace & Defense"],
        affectedTickers: ["LMT", "RTX", "NOC", "GD"],
        description: "Approval of increased defense budget for the fiscal year."
    },
    {
        id: "evt-5",
        name: "Energy Infrastructure Act",
        date: "2024-02-15",
        affectedSectors: ["Energy", "Utilities"],
        affectedTickers: ["XOM", "CVX", "NEE"],
        description: "Hearing covering new grants for energy grid modernization."
    },
    {
        id: "evt-6",
        name: "Tech Antitrust Probe",
        date: "2024-01-25",
        affectedSectors: ["Technology", "Communication Services"],
        affectedTickers: ["AAPL", "GOOGL", "META", "AMZN", "MSFT"],
        description: "DOJ announces new antitrust investigations into big tech."
    },
    {
        id: "evt-7",
        name: "Banking Regulations Update",
        date: "2024-07-20",
        affectedSectors: ["Financial Services"],
        affectedTickers: ["JPM", "BAC", "WFC", "C"],
        description: "New proposals for bank capital requirements (Basel III endgame)."
    },
    {
        id: "evt-8",
        name: "Q4 GDP Surprise",
        date: "2026-01-10",
        affectedSectors: ["Technology", "Energy"],
        affectedTickers: ["OTCM", "CHRD", "DT", "NVDA"],
        description: "Unexpected GDP growth spurs market rally."
    },
    {
        id: "evt-9",
        name: "Defense Appropriations",
        date: "2025-12-12",
        affectedSectors: ["Aerospace & Defense", "Industrials"],
        affectedTickers: ["LMT", "BA"],
        description: "New defense spending bill passed for 2026."
    }
];

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Checks if a given trade date and ticker/sector combination is near a major market event.
 * @param tradeDate The date of the trade.
 * @param ticker The stock ticker symbol.
 * @param sector The sector of the stock.
 * @param windowDays The number of days before or after the event to flag as suspicious (default: 7).
 * @returns The matching MarketEvent and the difference in days, or null.
 */
export function checkSuspiciousTiming(
    tradeDate: Date,
    ticker: string,
    sector?: string,
    windowDays: number = 7
): { event: MarketEvent; daysDiff: number } | null {

    const tTime = tradeDate.getTime();

    for (const event of MARKET_EVENTS) {
        const eDate = new Date(event.date);
        const eTime = eDate.getTime();

        const diffTime = tTime - eTime;
        const daysDiff = Math.ceil(diffTime / MS_PER_DAY);

        // Check if within the time window (+/- windowDays)
        if (Math.abs(daysDiff) <= windowDays) {
            // Check if ticker or sector matches
            let isMatch = false;

            if (event.affectedTickers && event.affectedTickers.includes(ticker)) {
                isMatch = true;
            } else if (sector && event.affectedSectors && event.affectedSectors.includes(sector)) {
                isMatch = true;
            } else if (!event.affectedTickers && !event.affectedSectors) {
                // If the event is entirely general (like a broad rate cut), flag it? 
                // Usually, we want exact sector/ticker matches for it to be highly suspicious.
                // Let's assume broad events affect Financial Services/Real Estate which are explicitly listed.
                // For safety, only match if ticker or sector is explicitly affected.
            }

            if (isMatch) {
                return { event, daysDiff };
            }
        }
    }

    return null;
}
