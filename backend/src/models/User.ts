import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash?: string;
    googleId?: string;
    firstName?: string;
    lastName?: string;
    watchlist?: mongoose.Types.ObjectId[];
    savedTrades?: mongoose.Types.ObjectId[];
    createdAt: Date;
}

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
        required: false, // Changed to false for Google Auth
    },
    googleId: {          // Added for Google Auth
        type: String,
        unique: true,
        sparse: true,    // Allows null/undefined values to be unique
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
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
