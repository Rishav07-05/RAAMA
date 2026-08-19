import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { fetchAdminBookings, updateBookingStatus, getBookingInvoiceUrl } from '../../services/api';

export const AdminBookingsView: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = () => {
    fetchAdminBookings()
      .then((res) => {
        if (res.success) setBookings(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusUpdate = async (id: string, bookingStatus: string) => {
    try {
      const res = await updateBookingStatus(id, { bookingStatus });
      if (res.success) {
        toast.success(`Booking ${res.data.bookingId} updated to ${bookingStatus}`);
        loadBookings();
      }
    } catch (err: any) {
      toast.error('Failed to update booking status.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#0B1849]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1849]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#0B1849]">
      <div className="border-b border-[#0B1849]/15 pb-4">
        <h1 className="text-2xl font-serif text-[#0B1849]">Room Reservations Desk</h1>
        <p className="text-xs font-sans text-[#596277]">Manage guest check-ins, check-outs, and tax invoices</p>
      </div>

      <div className="bg-[#0B1849] text-[#FFFCE1] rounded-sm border border-[#FFFCE1]/15 overflow-hidden shadow-xl font-sans text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#FFFCE1]/10 text-[#FFDE74] uppercase font-bold border-b border-[#FFFCE1]/15 text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Guest Name</th>
                <th className="p-4">Phone / Email</th>
                <th className="p-4">Room Category</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFFCE1]/10 text-[#FFFCE1]/80">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-[#FFFCE1]/5 transition-colors">
                  <td className="p-4 font-serif font-bold text-[#FFDE74]">{b.bookingId}</td>
                  <td className="p-4 font-semibold text-white">{b.guestName}</td>
                  <td className="p-4">
                    <div>{b.guestPhone}</div>
                    <div className="text-[10px] text-[#FFFCE1]/50">{b.guestEmail}</div>
                  </td>
                  <td className="p-4 font-medium text-[#FFFCE1]">{b.roomTypeId?.name || 'Executive'}</td>
                  <td className="p-4 text-[11px]">
                    {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-serif font-bold text-[#FFDE74]">₹{b.totalAmount}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider ${
                        b.paymentStatus === 'PAID'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white uppercase text-[10px] tracking-wider">{b.bookingStatus}</span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {b.bookingStatus === 'CONFIRMED' && (
                      <button
                        onClick={() => handleStatusUpdate(b._id, 'CHECKED_IN')}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-sm font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Check In
                      </button>
                    )}
                    {b.bookingStatus === 'CHECKED_IN' && (
                      <button
                        onClick={() => handleStatusUpdate(b._id, 'CHECKED_OUT')}
                        className="px-2.5 py-1 bg-[#FFFCE1] text-[#0B1849] hover:bg-[#FFDE74] rounded-sm font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Check Out
                      </button>
                    )}
                    <a
                      href={getBookingInvoiceUrl(b.token || b._id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFFCE1]/10 hover:bg-[#FFFCE1]/20 text-[#FFFCE1] rounded-sm font-bold text-[10px] uppercase tracking-wider transition-all"
                    >
                      <Download size={11} /> Invoice
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
