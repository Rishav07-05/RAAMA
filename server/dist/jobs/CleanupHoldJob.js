"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCleanupHoldJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Booking_1 = require("../models/Booking");
const initCleanupHoldJob = () => {
    // Run every 5 minutes
    node_cron_1.default.schedule('*/5 * * * *', async () => {
        try {
            const now = new Date();
            const result = await Booking_1.Booking.updateMany({
                bookingStatus: 'PENDING',
                paymentStatus: 'PENDING',
                expiresAt: { $lt: now },
            }, {
                $set: {
                    bookingStatus: 'CANCELLED',
                    paymentStatus: 'FAILED',
                },
            });
            if (result.modifiedCount > 0) {
                console.log(`[Cron Job] Cleaned up ${result.modifiedCount} expired unpaid booking holds.`);
            }
        }
        catch (error) {
            console.error('[Cron Job Error] Error cleaning up expired booking holds:', error);
        }
    });
    console.log('[Cron Job] Expired booking hold cleanup job initialized (runs every 5m).');
};
exports.initCleanupHoldJob = initCleanupHoldJob;
