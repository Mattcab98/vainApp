import mongoose, { Schema, Document } from 'mongoose';

export interface IConsumption extends Document {
    userId: mongoose.Types.ObjectId;
    shopId: mongoose.Types.ObjectId;
    consumedAt: Date;
    method: 'qr' | 'manual';
    qrId?: string;
}

const ConsumptionSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    consumedAt: { type: Date, default: Date.now },
    method: { type: String, enum: ['qr', 'manual'], required: true },
    qrId: { type: String },
});

export default mongoose.model<IConsumption>('Consumption', ConsumptionSchema);
