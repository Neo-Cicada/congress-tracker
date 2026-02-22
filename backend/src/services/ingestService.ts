import { Politician, IPolitician } from '../models/Politician';
import { Trade } from '../models/Trade';
import { NormalizedTrade } from './congressApi';
import yahooFinance from 'yahoo-finance2';
import { assignMockCommittees } from '../utils/committeeSectors';

const upsertPolitician = async (trade: NormalizedTrade): Promise<IPolitician> => {
  const filter = trade.politicianExternalId
    ? { externalId: trade.politicianExternalId }
    : { name: trade.politicianName };

  const update = {
    name: trade.politicianName,
    chamber: trade.chamber,
    party: trade.party,
    state: trade.state,
    externalId: trade.politicianExternalId,
    $setOnInsert: {
      committees: assignMockCommittees(trade.politicianName)
    }
  };

  const options = { new: true, upsert: true, setDefaultsOnInsert: true };

  const doc = await Politician.findOneAndUpdate(filter, update, options).exec();

  if (!doc) {
    // This "shouldn't" happen with upsert: true, but satisfies TypeScript
    throw new Error('Failed to upsert politician');
  }

  return doc;
};

// Simple in-memory cache for ticker sectors to avoid excessive Yahoo API calls
const sectorCache: Record<string, string> = {};

export const ingestTrades = async (
  normalizedTrades: NormalizedTrade[]
): Promise<{ newCount: number }> => {
  let newCount = 0;

  for (const t of normalizedTrades) {
    const politician = await upsertPolitician(t);

    const existing = await Trade.findOne({ externalId: t.externalId });

    if (!existing) {
      let sector: string = '';
      const ticker = t.ticker.toUpperCase();

      if (sectorCache[ticker]) {
        sector = sectorCache[ticker];
      } else {
        try {
          const profile: any = await yahooFinance.quoteSummary(ticker, { modules: ['assetProfile'] });
          if (profile && profile.assetProfile && profile.assetProfile.sector) {
            sector = profile.assetProfile.sector;
            sectorCache[ticker] = sector;
          } else {
            sectorCache[ticker] = ''; // Store empty string if no sector, to prevent repeated fetches
          }
        } catch (error) {
          console.warn(`Could not fetch sector for ticker ${ticker}`);
          // Cache as empty string to prevent retrying bad tickers repeatedly
          sectorCache[ticker] = '';
        }
      }

      await Trade.create({
        externalId: t.externalId,
        politicianId: politician._id,
        politicianName: t.politicianName,
        chamber: t.chamber,
        party: t.party,
        ticker,
        assetName: t.assetName,
        sector, // Added sector here
        transactionType: t.transactionType || 'Unknown',
        amountRange: t.amountRange,
        transactionDate: t.transactionDate ? new Date(t.transactionDate) : undefined,
        filedDate: t.filedDate ? new Date(t.filedDate) : undefined,
        sourceUrl: t.sourceUrl
      });
      newCount += 1;
    }
  }

  return { newCount };
};
