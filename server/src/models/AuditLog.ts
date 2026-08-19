import { Schema, model, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: Types.ObjectId;
  adminEmail: string;
  action: string; // e.g. "STATUS_CHANGE", "PRICE_UPDATE", "SETTING_CHANGE", "PAYMENT_SETTLED"
  entity: string; // e.g. "Booking", "Order", "MenuItem", "Room"
  entityId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ entity: 1, entityId: 1 });

export const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);
