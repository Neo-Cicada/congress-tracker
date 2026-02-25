import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    watchlist?: mongoose.Types.ObjectId[];
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
        required: true,
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IUser>('User', UserSchema);
