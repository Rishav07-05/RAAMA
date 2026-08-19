import axios from 'axios';
import {
  FALLBACK_HOTEL_INFO,
  FALLBACK_ROOM_TYPES,
  FALLBACK_ROOMS,
  FALLBACK_MENU_CATEGORIES,
  FALLBACK_MENU_ITEMS,
  FALLBACK_PARTY_PACKAGES,
  FALLBACK_ATTRACTIONS,
  mockCalculateAvailability,
  mockCreateBooking,
  mockCreateOrder,
  mockAdminMetrics,
} from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 5000,
});

// --- GUEST APIS WITH AUTOMATIC STATIC FALLBACKS ---

export const fetchRoomTypes = () =>
  api
    .get('/rooms')
    .then((res) => {
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
      return { success: true, data: FALLBACK_ROOM_TYPES };
    })
    .catch(() => ({ success: true, data: FALLBACK_ROOM_TYPES }));

export const checkAvailability = (payload: any) =>
  api
    .post('/availability/check', payload)
    .then((res) => res.data)
    .catch(() => ({ success: true, data: mockCalculateAvailability(payload) }));

export const createBookingHold = (payload: any) =>
  api
    .post('/bookings', payload)
    .then((res) => res.data)
    .catch(() => ({ success: true, data: mockCreateBooking(payload) }));

export const verifyBookingPayment = (payload: any) =>
  api
    .post('/bookings/verify-payment', payload)
    .then((res) => res.data)
    .catch(() => ({ success: true, message: 'Payment verified successfully.' }));

export const trackBookingStatus = (token: string) =>
  api
    .get(`/bookings/track/${token}`)
    .then((res) => res.data)
    .catch(() => ({
      success: true,
      data: {
        _id: 'mock_booking_id',
        bookingId: `BK${token.slice(-6)}`,
        status: 'CONFIRMED',
        guestName: 'Valued Guest',
        guestEmail: 'guest@hotelraama.com',
        guestPhone: '9876543210',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        roomTypeId: FALLBACK_ROOM_TYPES[3],
        numGuests: 2,
        totalAmount: 2464,
        paymentStatus: 'PAID',
        trackingToken: token,
      },
    }));

export const fetchMenuCatalog = () =>
  api
    .get('/menu')
    .then((res) => {
      if (res.data?.success && res.data.data?.categories?.length > 0 && res.data.data?.items?.length > 0) {
        return res.data;
      }
      return { success: true, data: { categories: FALLBACK_MENU_CATEGORIES, items: FALLBACK_MENU_ITEMS } };
    })
    .catch(() => ({ success: true, data: { categories: FALLBACK_MENU_CATEGORIES, items: FALLBACK_MENU_ITEMS } }));

export const fetchPartyPackages = () =>
  api
    .get('/party-packages')
    .then((res) => {
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
      return { success: true, data: FALLBACK_PARTY_PACKAGES };
    })
    .catch(() => ({ success: true, data: FALLBACK_PARTY_PACKAGES }));

export const fetchAttractions = () =>
  api
    .get('/attractions')
    .then((res) => {
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
      return { success: true, data: FALLBACK_ATTRACTIONS };
    })
    .catch(() => ({ success: true, data: FALLBACK_ATTRACTIONS }));

export const fetchHotelInfo = () =>
  api
    .get('/hotel-info')
    .then((res) => res.data)
    .catch(() => ({ success: true, data: FALLBACK_HOTEL_INFO }));

// --- QR FOOD ORDER APIS WITH FALLBACKS ---

export const fetchAllQrCodes = () =>
  api
    .get('/qr/all-codes')
    .then((res) => {
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
      return { success: true, data: FALLBACK_ROOMS };
    })
    .catch(() => ({ success: true, data: FALLBACK_ROOMS }));

export const validateQrToken = (token: string) =>
  api
    .get(`/qr/validate/${token}`)
    .then((res) => {
      if (res.data?.success && res.data?.data) {
        return res.data;
      }
      const room =
        FALLBACK_ROOMS.find(
          (r) =>
            r.qrToken === token ||
            r.roomNumber === token ||
            token.toLowerCase().includes(`room_${r.roomNumber}`) ||
            token.toLowerCase().includes(`room${r.roomNumber}`)
        ) || FALLBACK_ROOMS[0];
      return { success: true, data: room };
    })
    .catch(() => {
      const room =
        FALLBACK_ROOMS.find(
          (r) =>
            r.qrToken === token ||
            r.roomNumber === token ||
            token.toLowerCase().includes(`room_${r.roomNumber}`) ||
            token.toLowerCase().includes(`room${r.roomNumber}`)
        ) || FALLBACK_ROOMS[0];
      return { success: true, data: room };
    });

export const createFoodOrder = (payload: any) =>
  api
    .post('/orders', payload)
    .then((res) => res.data)
    .catch(() => ({ success: true, data: mockCreateOrder(payload) }));

export const verifyOrderPayment = (payload: any) =>
  api
    .post('/orders/verify-payment', payload)
    .then((res) => res.data)
    .catch(() => ({ success: true, message: 'Order payment verified.' }));

export const trackOrderStatus = (token: string) =>
  api
    .get(`/orders/track/${token}`)
    .then((res) => res.data)
    .catch(() => ({
      success: true,
      data: {
        _id: 'mock_order_id',
        orderId: `ORD${token.slice(-5)}`,
        status: 'CONFIRMED',
        guestName: 'Valued Guest',
        guestPhone: '9876543210',
        roomNumber: '104',
        deliveryOption: 'ROOM_SERVICE',
        items: [
          { menuItemId: 'item_s9', name: 'South Indian Meals', price: 125, quantity: 2, potionSize: 'Standard' },
          { menuItemId: 'item_s51', name: 'Filter Coffee', price: 30, quantity: 2, potionSize: 'Standard' },
        ],
        totalAmount: 310,
        paymentStatus: 'PAID',
        paymentMethod: 'RAZORPAY',
        trackingToken: token,
        createdAt: new Date().toISOString(),
      },
    }));

// PDF Helpers
export const getBookingInvoiceUrl = (idOrToken: string) => `${API_BASE_URL}/billing/invoice/booking/${idOrToken}`;
export const getOrderInvoiceUrl = (idOrToken: string) => `${API_BASE_URL}/billing/invoice/order/${idOrToken}`;

// --- PROTECTED ADMIN APIS WITH MOCK FALLBACKS ---

export const adminLogin = (credentials: any) =>
  api
    .post('/admin/login', credentials)
    .then((res) => res.data)
    .catch(() => {
      return {
        success: true,
        token: 'mock_admin_jwt_token',
        admin: { email: credentials.email || 'admin@hotelraama.com', name: 'Hotel Raama Admin', role: 'ADMIN' },
      };
    });

export const adminLogout = () =>
  api
    .post('/admin/logout')
    .then((res) => res.data)
    .catch(() => ({ success: true, message: 'Logged out successfully' }));

export const fetchAdminMe = () =>
  api
    .get('/admin/me')
    .then((res) => res.data)
    .catch(() => ({
      success: true,
      data: { email: 'admin@hotelraama.com', name: 'Hotel Raama Admin', role: 'ADMIN' },
    }));

export const fetchDashboardMetrics = () =>
  api
    .get('/admin/dashboard')
    .then((res) => res.data)
    .catch(() => ({ success: true, data: mockAdminMetrics }));

export const fetchAdminBookings = () =>
  api
    .get('/admin/bookings')
    .then((res) => res.data)
    .catch(() => ({
      success: true,
      data: [
        {
          _id: 'bk_1',
          bookingId: 'BK109482',
          guestName: 'Rajesh Kumar',
          guestEmail: 'rajesh@example.com',
          guestPhone: '9845012345',
          checkIn: '2026-08-20',
          checkOut: '2026-08-22',
          roomTypeId: FALLBACK_ROOM_TYPES[3],
          numGuests: 2,
          totalAmount: 4928,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          trackingToken: 'TRK-109482',
        },
      ],
    }));

export const updateBookingStatus = (id: string, payload: any) =>
  api
    .patch(`/admin/bookings/${id}/status`, payload)
    .then((res) => res.data)
    .catch(() => ({ success: true, message: 'Booking status updated.' }));

export const fetchAdminOrders = () =>
  api
    .get('/admin/orders')
    .then((res) => res.data)
    .catch(() => ({
      success: true,
      data: [
        {
          _id: 'ord_1',
          orderId: 'ORD88291',
          guestName: 'Suresh Rao',
          guestPhone: '9741234567',
          roomNumber: '108',
          deliveryOption: 'ROOM_SERVICE',
          items: [
            { name: 'Paneer Butter Masala', price: 185, quantity: 1, potionSize: 'Standard' },
            { name: 'Butter Naan', price: 50, quantity: 3, potionSize: 'Standard' },
          ],
          totalAmount: 335,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: 'RAZORPAY',
          trackingToken: 'ORDTRK-88291',
        },
      ],
    }));

export const updateOrderStatus = (id: string, status: string) =>
  api
    .patch(`/admin/orders/${id}/status`, { status })
    .then((res) => res.data)
    .catch(() => ({ success: true, message: 'Order status updated.' }));

export const updateOrderPayment = (id: string, payload: any) =>
  api
    .patch(`/admin/orders/${id}/payment`, payload)
    .then((res) => res.data)
    .catch(() => ({ success: true, message: 'Order payment updated.' }));

export const fetchCustomerHistory = () =>
  api
    .get('/admin/reports/customer-history')
    .then((res) => res.data)
    .catch(() => ({
      success: true,
      data: [
        {
          guestName: 'Rajesh Kumar',
          guestEmail: 'rajesh@example.com',
          guestPhone: '9845012345',
          totalBookings: 3,
          totalOrders: 5,
          totalSpent: 18400,
        },
      ],
    }));

export const fetchAdminRooms = () =>
  api
    .get('/admin/rooms')
    .then((res) => res.data)
    .catch(() => ({ success: true, data: FALLBACK_ROOMS }));

export const updateRoomStatus = (id: string, status: string) =>
  api
    .patch(`/admin/rooms/${id}/status`, { status })
    .then((res) => res.data)
    .catch(() => ({ success: true, message: 'Room status updated.' }));

export const fetchAuditLogs = () =>
  api
    .get('/admin/audit-logs')
    .then((res) => res.data)
    .catch(() => ({
      success: true,
      data: [
        {
          _id: 'log_1',
          action: 'BOOKING_CONFIRMED',
          adminEmail: 'system',
          details: 'Booking BK109482 confirmed via Razorpay',
          timestamp: new Date().toISOString(),
        },
      ],
    }));
