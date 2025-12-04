import mongoose, { Schema, Document } from 'mongoose';

export interface IShop extends Document {
    name: string;
    address: string;
    location: { type: 'Point', coordinates: [number, number] };
    hours: { open: string, close: string };
    logoUrl?: string;
    contactEmail?: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ShopSchema: Schema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    hours: {
        open: { type: String, required: true },
        close: { type: String, required: true },
    },
    logoUrl: { type: String },
    contactEmail: { type: String },
    active: { type: Boolean, default: true },
}, { timestamps: true });

ShopSchema.index({ location: '2dsphere' });

export default mongoose.model<IShop>('Shop', ShopSchema);
