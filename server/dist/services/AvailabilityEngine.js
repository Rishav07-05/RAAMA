"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityEngine = void 0;
const mongoose_1 = require("mongoose");
const Room_1 = require("../models/Room");
const Booking_1 = require("../models/Booking");
class AvailabilityEngine {
    /**
     * Check room availability for a specific room type between checkIn and checkOut dates
     */
    static async checkAvailability(roomTypeId, checkIn, checkOut) {
        const rTypeId = typeof roomTypeId === 'string' ? new mongoose_1.Types.ObjectId(roomTypeId) : roomTypeId;
        const now = new Date();
        // 1. Get all active rooms of this type
        const rooms = await Room_1.Room.find({ roomTypeId: rTypeId, isActive: true });
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
        const conflictingBookings = await Booking_1.Booking.find({
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
        const bookedAssignedRoomIds = new Set(conflictingBookings
            .filter(b => b.assignedRoomId)
            .map(b => b.assignedRoomId.toString()));
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
            assignedRoomId: availableRoom ? availableRoom._id : undefined,
        };
    }
    /**
     * Batch check availability for multiple room types
     */
    static async checkAllRoomTypesAvailability(checkIn, checkOut) {
        const rooms = await Room_1.Room.find({ isActive: true });
        const now = new Date();
        const conflictingBookings = await Booking_1.Booking.find({
            checkIn: { $lt: checkOut },
            checkOut: { $gt: checkIn },
            $or: [
                { bookingStatus: { $in: ['CONFIRMED', 'CHECKED_IN'] } },
                { bookingStatus: 'PENDING', expiresAt: { $gt: now } },
            ],
        });
        const roomTypeStats = {};
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
exports.AvailabilityEngine = AvailabilityEngine;
