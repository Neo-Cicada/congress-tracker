import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription {
    status: 'free' | 'active' | 'past_due' | 'cancelled' | 'expired';
    plan: 'weekly' | 'monthly' | 'yearly' | null;
    lemonSqueezyCustomerId: string | null;
    lemonSqueezySubscriptionId: string | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
}

export interface IUser extends Document {
    email: string;
    passwordHash?: string;
    googleId?: string;
    firstName?: string;
    lastName?: string;
    subscription: ISubscription;
    watchlist?: mongoose.Types.ObjectId[];
    savedTrades?: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const SubscriptionSchema = new Schema({
    status: {
        type: String,
        enum: ['free', 'active', 'past_due', 'cancelled', 'expired'],
        default: 'free',
    },
    plan: {
        type: String,
        enum: ['weekly', 'monthly', 'yearly', null],
        default: null,
    },
    lemonSqueezyCustomerId: { type: String, default: null },
    lemonSqueezySubscriptionId: { type: String, default: null },
    currentPeriodEnd: { type: Date, default: null },
    cancelAtPeriodEnd: { type: Boolean, default: false },
}, { _id: false });

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    passwordHash: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    subscription: {
        type: SubscriptionSchema,
        default: () => ({
            status: 'free',
            plan: null,
            lemonSqueezyCustomerId: null,
            lemonSqueezySubscriptionId: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
        }),
    },
    watchlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Politician',
    }],
    savedTrades: [{
        type: Schema.Types.ObjectId,
        ref: 'Trade',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IUser>('User', UserSchema);
