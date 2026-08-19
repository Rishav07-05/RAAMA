"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true, unique: true },
    roomNumber: { type: String, required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room', required: false },
    qrToken: { type: String, required: false },
    deliveryOption: {
        type: String,
        enum: ['ROOM_SERVICE', 'RECEPTION_PICKUP'],
        default: 'ROOM_SERVICE',
    },
    guestName: { type: String, required: true, trim: true },
    guestPhone: { type: String, required: true, trim: true },
    items: [
        {
            menuItemId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true, min: 1 },
            potionSize: { type: String },
            specialInstructions: { type: String },
        },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING',
    },
    paymentStatus: {
        type: String,
        enum: ['UNPAID', 'PARTIALLY_PAID', 'PAID'],
        default: 'UNPAID',
    },
    paymentMethod: {
        type: String,
        enum: ['CASH', 'UPI', 'CARD', 'RAZORPAY', 'OTHER'],
    },
    specialInstructions: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    trackingToken: { type: String, required: true, unique: true },
}, { timestamps: true });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ guestPhone: 1 });
OrderSchema.index({ createdAt: -1 });
exports.Order = (0, mongoose_1.model)('Order', OrderSchema);
