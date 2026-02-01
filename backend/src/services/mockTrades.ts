import { NormalizedTrade } from './congressApi';

export const mockTrades: NormalizedTrade[] = [
  {
    externalId: 'mock-trade-001',
    politicianExternalId: 'mock-pol-001',
    politicianName: 'John Doe',
    chamber: 'House',
    party: 'Democrat',
    state: 'CA',
    ticker: 'NVDA',
    assetName: 'NVIDIA Corporation',
    transactionType: 'Buy',
    amountRange: '$1,000 - $15,000',
    transactionDate: '2025-12-01',
    filedDate: '2025-12-10',
    sourceUrl: 'https://example.com/mock-report-1'
  },
  {
    externalId: 'mock-trade-002',
    politicianExternalId: 'mock-pol-002',
    politicianName: 'Jane Smith',
    chamber: 'Senate',
    party: 'Republican',
    state: 'TX',
    ticker: 'AAPL',
    assetName: 'Apple Inc.',
    transactionType: 'Sell',
    amountRange: '$15,001 - $50,000',
    transactionDate: '2025-12-03',
    filedDate: '2025-12-12',
    sourceUrl: 'https://example.com/mock-report-2'
  }
];
