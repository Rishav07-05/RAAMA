import { Schema, model, Document, Types } from 'mongoose';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export type OrderPaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'RAZORPAY' | 'OTHER';

export interface IOrderItem {
  menuItemId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  potionSize?: string; // e.g. "30ML", "60ML", "Standard"
  specialInstructions?: string;
}

export interface IOrder extends Document {
  orderId: string; // e.g. "HRO-9842"
  roomNumber: string;
  roomId?: Types.ObjectId | null;
  qrToken?: string;
  deliveryOption?: 'ROOM_SERVICE' | 'RECEPTION_PICKUP';
  guestName: string;
  guestPhone: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  paymentMethod?: PaymentMethod;
  specialInstructions?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  trackingToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    roomNumber: { type: String, required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: false },
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
        menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
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
  },
  { timestamps: true }
);

OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ guestPhone: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = model<IOrder>('Order', OrderSchema);
