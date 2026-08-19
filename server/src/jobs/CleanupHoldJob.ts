import cron from 'node-cron';
import { Booking } from '../models/Booking';

export const initCleanupHoldJob = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      const result = await Booking.updateMany(
        {
          bookingStatus: 'PENDING',
          paymentStatus: 'PENDING',
          expiresAt: { $lt: now },
        },
        {
          $set: {
            bookingStatus: 'CANCELLED',
            paymentStatus: 'FAILED',
          },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[Cron Job] Cleaned up ${result.modifiedCount} expired unpaid booking holds.`);
      }
    } catch (error) {
      console.error('[Cron Job Error] Error cleaning up expired booking holds:', error);
    }
  });

  console.log('[Cron Job] Expired booking hold cleanup job initialized (runs every 5m).');
};
