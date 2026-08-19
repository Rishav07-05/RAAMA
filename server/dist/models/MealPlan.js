"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealPlan = void 0;
const mongoose_1 = require("mongoose");
const MealPlanSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['BREAKFAST', 'LUNCH', 'DINNER'], required: true, unique: true },
    pricePerPersonPerNight: { type: Number, required: true, min: 0 },
    description: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.MealPlan = (0, mongoose_1.model)('MealPlan', MealPlanSchema);
