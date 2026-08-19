import { Types } from 'mongoose';
import { Room } from '../models/Room';
import { Booking } from '../models/Booking';

export interface IAvailabilityResult {
  roomTypeId: string;
  totalRooms: number;
  bookedRooms: number;
  availableRooms: number;
  isAvailable: boolean;
  assignedRoomId?: Types.ObjectId;
}

export class AvailabilityEngine {
  /**
   * Check room availability for a specific room type between checkIn and checkOut dates
   */
  static async checkAvailability(
    roomTypeId: string | Types.ObjectId,
    checkIn: Date,
    checkOut: Date
  ): Promise<IAvailabilityResult> {
    const rTypeId = typeof roomTypeId === 'string' ? new Types.ObjectId(roomTypeId) : roomTypeId;
    const now = new Date();

    // 1. Get all active rooms of this type
    const rooms = await Room.find({ roomTypeId: rTypeId, isActive: true });
    const totalRooms = rooms.length;

    if (totalRooms === 0) {
      return {
        roomTypeId: rTypeId.toString(),
        totalRooms: 0,
        bookedRooms: 0,
        availableRooms: 0,
        isAvailable: false,
      };
    }

    const roomIds = rooms.map(r => r._id);

    // 2. Find existing conflicting bookings
    // A booking overlaps if: checkIn < existing.checkOut AND checkOut > existing.checkIn
    const conflictingBookings = await Booking.find({
      $and: [
        {
          $or: [
            { assignedRoomId: { $in: roomIds } },
            { roomTypeId: rTypeId },
          ],
        },
        {
          $or: [
            { bookingStatus: { $in: ['CONFIRMED', 'CHECKED_IN'] } },
            {
              bookingStatus: 'PENDING',
              expiresAt: { $gt: now },
            },
          ],
        },
      ],
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    // Extract assigned room IDs that are already booked
    const bookedAssignedRoomIds = new Set(
      conflictingBookings
        .filter(b => b.assignedRoomId)
        .map(b => b.assignedRoomId!.toString())
    );

    const bookedCount = conflictingBookings.length;
    const availableRoomsCount = Math.max(0, totalRooms - bookedCount);

    // Find an unassigned room object to reserve
    const availableRoom = rooms.find(r => !bookedAssignedRoomIds.has(r._id.toString()));

    return {
      roomTypeId: rTypeId.toString(),
      totalRooms,
      bookedRooms: bookedCount,
      availableRooms: availableRoomsCount,
      isAvailable: availableRoomsCount > 0,
      assignedRoomId: availableRoom ? (availableRoom._id as Types.ObjectId) : undefined,
    };
  }

  /**
   * Batch check availability for multiple room types
   */
  static async checkAllRoomTypesAvailability(checkIn: Date, checkOut: Date) {
    const rooms = await Room.find({ isActive: true });
    const now = new Date();

    const conflictingBookings = await Booking.find({
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
      $or: [
        { bookingStatus: { $in: ['CONFIRMED', 'CHECKED_IN'] } },
        { bookingStatus: 'PENDING', expiresAt: { $gt: now } },
      ],
    });

    const roomTypeStats: Record<string, { total: number; booked: number }> = {};

    for (const room of rooms) {
      const typeIdStr = room.roomTypeId.toString();
      if (!roomTypeStats[typeIdStr]) {
        roomTypeStats[typeIdStr] = { total: 0, booked: 0 };
      }
      roomTypeStats[typeIdStr].total += 1;
    }

    for (const booking of conflictingBookings) {
      const typeIdStr = booking.roomTypeId.toString();
      if (roomTypeStats[typeIdStr]) {
        roomTypeStats[typeIdStr].booked += 1;
      }
    }

    return roomTypeStats;
  }
}
