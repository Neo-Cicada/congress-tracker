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
  baseURL: process.env.CONGRESS_API_BASE_URL,
  headers: {
    'X-API-KEY': process.env.CONGRESS_API_KEY || ''
  },
  timeout: 15000
});

export const fetchRecentTrades = async (): Promise<NormalizedTrade[]> => {
  const params = { limit: 200 }; // adjust per provider

  const { data } = await api.get('/latest', { params });

  // Adjust mapping to match actual response shape
  return data.map((t: any): NormalizedTrade => ({
    externalId: t.id, // or t.trade_id
    politicianExternalId: t.member_id,
    politicianName: t.member_name,
    chamber: t.chamber,
    party: t.party,
    state: t.state,
    ticker: t.ticker,
    assetName: t.asset_name,
    transactionType: (t.transaction_type as 'Buy' | 'Sell' | 'Unknown') || 'Unknown',
    amountRange: t.amount,
    transactionDate: t.transaction_date,
    filedDate: t.filed_date,
    sourceUrl: t.source_url
  }));
};
