"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, default: 'Hotel Raama Manager' },
    role: { type: String, enum: ['ADMIN'], default: 'ADMIN' },
    lastLogin: { type: Date },
}, { timestamps: true });
exports.Admin = (0, mongoose_1.model)('Admin', AdminSchema);
