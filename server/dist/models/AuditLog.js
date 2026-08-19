"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const mongoose_1 = require("mongoose");
const AuditLogSchema = new mongoose_1.Schema({
    adminId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Admin', required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    details: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
}, { timestamps: true });
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ entity: 1, entityId: 1 });
exports.AuditLog = (0, mongoose_1.model)('AuditLog', AuditLogSchema);
