import axios from 'axios';

export interface NormalizedTrade {
  externalId: string;
  politicianExternalId?: string;
  politicianName: string;
  chamber: 'House' | 'Senate';
  party?: string;
  state?: string;
  ticker: string;
  assetName?: string;
  transactionType: 'Buy' | 'Sell' | 'Unknown';
  amountRange?: string;
  transactionDate?: string;
  filedDate?: string;
  sourceUrl?: string;
}

const api = axios.create({
  baseURL: process.env.CONGRESS_API_BASE_URL || 'https://api.quiverquant.com/beta',
  headers: {
    'Authorization': `Bearer ${process.env.CONGRESS_API_KEY || ''}`,
    'Accept': 'application/json'
  },
  timeout: 15000
});

export const fetchRecentTrades = async (): Promise<NormalizedTrade[]> => {
  try {
    // Quiver API: /beta/bulk/congresstrading
    const { data } = await api.get('/live/congresstrading');

    return data.map((t: any): NormalizedTrade => {
      // Logic to determine transaction type if raw data differs
      let type: 'Buy' | 'Sell' | 'Unknown' = 'Unknown';
      if (t.Transaction && t.Transaction.includes('Buy')) type = 'Buy';
      if (t.Transaction && t.Transaction.includes('Sell')) type = 'Sell';
      if (t.Transaction && t.Transaction.includes('Purchase')) type = 'Buy';
      if (t.Transaction && t.Transaction.includes('Sale')) type = 'Sell';

      return {
        externalId: `${t.Ticker}-${t.Date}-${t.Representative}-${Math.random().toString(36).substr(2, 9)}`,
        politicianName: t.Representative || 'Unknown',
        chamber: t.House === 'House' ? 'House' : 'Senate',
        party: t.Party,
        ticker: t.Ticker,
        transactionType: type,
        amountRange: t.Range,
        transactionDate: t.Date,
        filedDate: t.ReportDate,
        // Fields not provided by this endpoint
        politicianExternalId: undefined,
        state: undefined,
        assetName: undefined,
        sourceUrl: undefined
      };
    });
  } catch (error) {
    console.error('Error fetching trades from Quiver API:', error);
    return [];
  }
};
