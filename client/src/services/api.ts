import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Guest APIs
export const fetchRoomTypes = () => api.get('/rooms').then(res => res.data);
export const checkAvailability = (payload: any) => api.post('/availability/check', payload).then(res => res.data);
export const createBookingHold = (payload: any) => api.post('/bookings', payload).then(res => res.data);
export const verifyBookingPayment = (payload: any) => api.post('/bookings/verify-payment', payload).then(res => res.data);
export const trackBookingStatus = (token: string) => api.get(`/bookings/track/${token}`).then(res => res.data);
export const fetchMenuCatalog = () => api.get('/menu').then(res => res.data);
export const fetchPartyPackages = () => api.get('/party-packages').then(res => res.data);
export const fetchAttractions = () => api.get('/attractions').then(res => res.data);
export const fetchHotelInfo = () => api.get('/hotel-info').then(res => res.data);

// QR Food Order APIs
export const fetchAllQrCodes = () => api.get('/qr/all-codes').then(res => res.data);
export const validateQrToken = (token: string) => api.get(`/qr/validate/${token}`).then(res => res.data);
export const createFoodOrder = (payload: any) => api.post('/orders', payload).then(res => res.data);
export const verifyOrderPayment = (payload: any) => api.post('/orders/verify-payment', payload).then(res => res.data);
export const trackOrderStatus = (token: string) => api.get(`/orders/track/${token}`).then(res => res.data);

// PDF Invoice Download Helpers
export const getBookingInvoiceUrl = (idOrToken: string) => `${API_BASE_URL}/billing/invoice/booking/${idOrToken}`;
export const getOrderInvoiceUrl = (idOrToken: string) => `${API_BASE_URL}/billing/invoice/order/${idOrToken}`;

// Protected Admin APIs
export const adminLogin = (credentials: any) => api.post('/admin/login', credentials).then(res => res.data);
export const adminLogout = () => api.post('/admin/logout').then(res => res.data);
export const fetchAdminMe = () => api.get('/admin/me').then(res => res.data);
export const fetchDashboardMetrics = () => api.get('/admin/dashboard').then(res => res.data);
export const fetchAdminBookings = () => api.get('/admin/bookings').then(res => res.data);
export const updateBookingStatus = (id: string, payload: any) => api.patch(`/admin/bookings/${id}/status`, payload).then(res => res.data);
export const fetchAdminOrders = () => api.get('/admin/orders').then(res => res.data);
export const updateOrderStatus = (id: string, status: string) => api.patch(`/admin/orders/${id}/status`, { status }).then(res => res.data);
export const updateOrderPayment = (id: string, payload: any) => api.patch(`/admin/orders/${id}/payment`, payload).then(res => res.data);
export const fetchCustomerHistory = () => api.get('/admin/reports/customer-history').then(res => res.data);
export const fetchAdminRooms = () => api.get('/admin/rooms').then(res => res.data);
export const updateRoomStatus = (id: string, status: string) => api.patch(`/admin/rooms/${id}/status`, { status }).then(res => res.data);
export const fetchAuditLogs = () => api.get('/admin/audit-logs').then(res => res.data);
