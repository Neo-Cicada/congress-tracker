import { Politician, IPolitician } from '../models/Politician';
import { Trade } from '../models/Trade';
import { NormalizedTrade } from './congressAPI';

const upsertPolitician = async (trade: NormalizedTrade): Promise<IPolitician> => {
  const filter = trade.politicianExternalId
    ? { externalId: trade.politicianExternalId }
    : { name: trade.politicianName };

  const update = {
    name: trade.politicianName,
    chamber: trade.chamber,
    party: trade.party,
    state: trade.state,
    externalId: trade.politicianExternalId
  };

  const options = { new: true, upsert: true, setDefaultsOnInsert: true };

  const doc = await Politician.findOneAndUpdate(filter, update, options).exec();

  if (!doc) {
    // This "shouldn't" happen with upsert: true, but satisfies TypeScript
    throw new Error('Failed to upsert politician');
  }

  return doc;
};

export const ingestTrades = async (
  normalizedTrades: NormalizedTrade[]
): Promise<{ newCount: number }> => {
  let newCount = 0;

  for (const t of normalizedTrades) {
    const politician = await upsertPolitician(t);

    const existing = await Trade.findOne({ externalId: t.externalId });

    if (!existing) {
      await Trade.create({
        externalId: t.externalId,
        politicianId: politician._id,
        politicianName: t.politicianName,
        chamber: t.chamber,
        party: t.party,
        ticker: t.ticker.toUpperCase(),
        assetName: t.assetName,
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
