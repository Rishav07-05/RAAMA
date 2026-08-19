import { Request, Response } from 'express';
import crypto from 'crypto';
import { Room } from '../models/Room';
import { MenuItem } from '../models/MenuItem';
import { Order, IOrderItem } from '../models/Order';
import { SocketService } from '../services/SocketService';
import { RazorpayService } from '../services/RazorpayService';

export class QrController {
  /**
   * GET /api/qr/all-codes
   * Fetches all 40 room QRs + Sambhrama Party Hall QR token for public ordering portal
   */
  static async getAllQrCodes(req: Request, res: Response) {
    try {
      const rooms = await Room.find({ isActive: true }).populate('roomTypeId').lean();
      
      // Sort numerically by roomNumber if numeric, or put Party Hall at end
      rooms.sort((a, b) => {
        const numA = parseInt(a.roomNumber, 10);
        const numB = parseInt(b.roomNumber, 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        if (!isNaN(numA)) return -1;
        if (!isNaN(numB)) return 1;
        return a.roomNumber.localeCompare(b.roomNumber);
      });

      return res.json({ success: true, data: rooms });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch QR codes.' });
    }
  }

  /**
   * GET /api/qr/validate/:token
   * Validates QR token and returns room details for guest food ordering portal
   */
  static async validateToken(req: Request, res: Response) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({ success: false, message: 'QR token is required.' });
      }

      const room = await Room.findOne({ qrToken: token, isActive: true }).populate('roomTypeId');
      if (!room) {
        return res.status(404).json({ success: false, message: 'Invalid or inactive QR code.' });
      }

      return res.json({
        success: true,
        data: {
          roomId: room._id,
          roomNumber: room.roomNumber,
          floor: room.floor,
          qrToken: room.qrToken,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to validate QR token.' });
    }
  }

  /**
   * POST /api/orders
   * Submit food order from room QR code
   */
  static async createOrder(req: Request, res: Response) {
    try {
      const { qrToken, roomNumber, deliveryOption, guestName, guestPhone, items, specialInstructions, paymentMethod } = req.body;

      if (!guestName || !guestPhone || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Missing required order fields.' });
      }

      // 1. Determine Room & Delivery Options
      let finalRoomNumber = 'None';
      let roomId: any = null;
      let finalQrToken = '';
      let finalDeliveryOption = deliveryOption || 'ROOM_SERVICE';

      if (qrToken) {
        // Direct QR ordering
        const room = await Room.findOne({ qrToken, isActive: true });
        if (!room) {
          return res.status(404).json({ success: false, message: 'Invalid or inactive room QR code.' });
        }
        finalRoomNumber = room.roomNumber;
        roomId = room._id;
        finalQrToken = qrToken;
        finalDeliveryOption = 'ROOM_SERVICE';
      } else if (roomNumber && roomNumber.toLowerCase() !== 'none') {
        // Dining portal ordering with a room number
        const room = await Room.findOne({ roomNumber: roomNumber.trim(), isActive: true });
        if (!room) {
          return res.status(404).json({ success: false, message: `Room ${roomNumber} not found or is currently inactive.` });
        }
        finalRoomNumber = room.roomNumber;
        roomId = room._id;
        finalQrToken = room.qrToken;
      } else {
        // No room number provided (None)
        finalRoomNumber = 'None';
        finalDeliveryOption = 'RECEPTION_PICKUP';
      }

      // 2. Fetch Menu Items & Recalculate Prices Strictly Server-Side
      const menuItemIds = items.map((i: any) => i.menuItemId);
      const menuItems = await MenuItem.find({ _id: { $in: menuItemIds }, isAvailable: true });
      const menuMap = new Map(menuItems.map(m => [m._id.toString(), m]));

      let subtotal = 0;
      const orderItems: IOrderItem[] = [];

      for (const item of items) {
        const dbItem = menuMap.get(item.menuItemId);
        if (!dbItem) {
          return res.status(400).json({ success: false, message: `Menu item not available: ${item.name || item.menuItemId}` });
        }

        const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
        let unitPrice = dbItem.price;

        if (item.potionSize === '60ML' && dbItem.price60ml) {
          unitPrice = dbItem.price60ml;
        }

        const itemSubtotal = unitPrice * quantity;
        subtotal += itemSubtotal;

        orderItems.push({
          menuItemId: dbItem._id as any,
          name: dbItem.name,
          price: unitPrice,
          quantity,
          potionSize: item.potionSize || 'Standard',
          specialInstructions: item.specialInstructions,
        });
      }

      const orderId = `HRO-${Math.floor(1000 + Math.random() * 9000)}`;
      const trackingToken = crypto.randomBytes(16).toString('hex');
      const totalAmount = subtotal; // GST can be added if applicable

      const chosenPaymentMethod = paymentMethod === 'CASH' ? 'CASH' : 'RAZORPAY';
      let razorpayOrderId: string | undefined = undefined;

      if (chosenPaymentMethod === 'RAZORPAY') {
        const razorpayOrder = await RazorpayService.createOrder(totalAmount, orderId);
        razorpayOrderId = razorpayOrder.id;
      }

      // 3. Create Order in Database
      const order = await Order.create({
        orderId,
        roomNumber: finalRoomNumber,
        roomId,
        qrToken: finalQrToken,
        deliveryOption: finalDeliveryOption,
        guestName,
        guestPhone,
        items: orderItems,
        subtotal,
        tax: 0,
        totalAmount,
        status: chosenPaymentMethod === 'CASH' ? 'CONFIRMED' : 'PENDING',
        paymentStatus: 'UNPAID',
        paymentMethod: chosenPaymentMethod,
        razorpayOrderId,
        specialInstructions,
        trackingToken,
      });

      // Emit Real-time Socket.IO event to Admin Kitchen Dashboard immediately on order creation!
      SocketService.emitNewOrder(order);

      return res.status(201).json({
        success: true,
        message: chosenPaymentMethod === 'CASH'
          ? 'Food order sent to kitchen! Pay cash at reception/counter.'
          : 'Food order created, pending Razorpay payment.',
        data: {
          orderId: order.orderId,
          trackingToken: order.trackingToken,
          roomNumber: order.roomNumber,
          deliveryOption: order.deliveryOption,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentMethod: order.paymentMethod,
          razorpayOrderId,
          razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Failed to place order.' });
    }
  }

  /**
   * POST /api/orders/verify-payment
   */
  static async verifyPayment(req: Request, res: Response) {
    try {
      const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
        return res.status(400).json({ success: false, message: 'Missing payment verification details.' });
      }

      const order = await Order.findOne({ orderId });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }

      // Verify signature
      const isValid = RazorpayService.verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature || 'mock_sig'
      );

      if (!isValid) {
        order.paymentStatus = 'UNPAID';
        order.status = 'CANCELLED';
        await order.save();
        return res.status(400).json({ success: false, message: 'Payment verification failed.' });
      }

      // Transition to PAID & CONFIRMED
      order.paymentStatus = 'PAID';
      order.status = 'CONFIRMED';
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      await order.save();

      // Emit Real-time Socket.IO event to Admin Kitchen Dashboard after payment is verified
      SocketService.emitNewOrder(order);

      return res.json({
        success: true,
        message: 'Payment verified! Order sent to kitchen.',
        data: {
          orderId: order.orderId,
          trackingToken: order.trackingToken,
          status: order.status,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Payment verification error.' });
    }
  }

  /**
   * GET /api/orders/track/:token
   */
  static async trackOrder(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const order = await Order.findOne({ trackingToken: token });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }
      return res.json({ success: true, data: order });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch order status.' });
    }
  }
}
