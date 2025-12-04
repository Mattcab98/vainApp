import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
    userId: mongoose.Types.ObjectId;
    stripeSubscriptionId?: string;
    planId: string;
    priceCents: number;
    currency: string;
    status: 'active' | 'past_due' | 'canceled' | 'trialing';
    startDate: Date;
    currentPeriodEnd: Date;
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripeSubscriptionId: { type: String },
    planId: { type: String, required: true },
    priceCents: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['active', 'past_due', 'canceled', 'trialing'], required: true },
    startDate: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
