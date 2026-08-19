import { Schema, model, Document } from 'mongoose';

export interface IRoomType extends Document {
  name: string; // e.g. "Executive Double A/C"
  code: string; // e.g. "EXEC_DBL_AC"
  description: string;
  basePrice: number; // Non-CP Plan (Room Only)
  cpPrice: number; // CP Plan (Breakfast Included)
  maxOccupancy: number;
  isAc: boolean;
  amenities: string[];
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomTypeSchema = new Schema<IRoomType>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true, min: 0 },
    cpPrice: { type: Number, required: true, min: 0 },
    maxOccupancy: { type: Number, required: true, default: 2 },
    isAc: { type: Boolean, default: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RoomType = model<IRoomType>('RoomType', RoomTypeSchema);
