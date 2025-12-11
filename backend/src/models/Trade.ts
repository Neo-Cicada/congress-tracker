import mongoose, { Document, Schema } from 'mongoose';

export interface ITrade extends Document {
  externalId: string;
  politicianId?: mongoose.Types.ObjectId;
  politicianName: string;
  chamber: 'House' | 'Senate';
  party?: string;
  ticker: string;
  assetName?: string;
  transactionType: 'Buy' | 'Sell' | 'Unknown';
  amountRange?: string;
  transactionDate?: Date;
  filedDate?: Date;
  sourceUrl?: string;
}

const TradeSchema = new Schema<ITrade>(
  {
    externalId: { type: String, unique: true, index: true },

    politicianId: { type: Schema.Types.ObjectId, ref: 'Politician' },
    politicianName: { type: String, index: true },
    chamber: { type: String, enum: ['House', 'Senate'], index: true },
    party: { type: String },

    ticker: { type: String, index: true },
    assetName: { type: String },

    transactionType: { type: String, enum: ['Buy', 'Sell', 'Unknown'], index: true },
    amountRange: { type: String },

    transactionDate: { type: Date, index: true },
    filedDate: { type: Date },

    sourceUrl: { type: String }
  },
  { timestamps: true }
);

TradeSchema.index({ ticker: 1, transactionDate: -1 });
TradeSchema.index({ politicianName: 1, transactionDate: -1 });

export const Trade = mongoose.model<ITrade>('Trade', TradeSchema);
