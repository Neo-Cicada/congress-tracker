import mongoose, { Document, Schema } from 'mongoose';

export interface IPolitician extends Document {
  name: string;
  chamber: 'House' | 'Senate';
  party?: string;
  state?: string;
  externalId?: string;
  photoUrl?: string;
  committees?: string[]; // Added committees field
  stats?: {
    ytdReturn: number;
    topHolding: string;
    lastUpdated: Date;
  };
}

const PoliticianSchema = new Schema<IPolitician>(
  {
    name: { type: String, required: true, index: true },
    chamber: { type: String, enum: ['House', 'Senate'], index: true },
    party: { type: String },
    state: { type: String },
    externalId: { type: String, index: true },
    photoUrl: { type: String },
    committees: [{ type: String }], // Added committees field
    stats: {
      ytdReturn: { type: Number },
      topHolding: { type: String },
      lastUpdated: { type: Date }
    }
  },
  { timestamps: true }
);

export const Politician = mongoose.model<IPolitician>('Politician', PoliticianSchema);
