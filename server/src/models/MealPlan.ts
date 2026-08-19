import { Schema, model, Document } from 'mongoose';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface IMealPlan extends Document {
  name: string;
  type: MealType;
  pricePerPersonPerNight: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MealPlanSchema = new Schema<IMealPlan>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['BREAKFAST', 'LUNCH', 'DINNER'], required: true, unique: true },
    pricePerPersonPerNight: { type: Number, required: true, min: 0 },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MealPlan = model<IMealPlan>('MealPlan', MealPlanSchema);
