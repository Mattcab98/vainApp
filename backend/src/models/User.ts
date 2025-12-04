import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash?: string;
    role: 'user' | 'shop' | 'admin';
    subscription?: mongoose.Types.ObjectId;
    lastConsumptionDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['user', 'shop', 'admin'], default: 'user' },
    subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    lastConsumptionDate: { type: Date },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
