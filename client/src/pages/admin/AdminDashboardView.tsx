import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BedDouble, CalendarCheck, UtensilsCrossed, TrendingUp } from 'lucide-react';
import { fetchDashboardMetrics } from '../../services/api';

export const AdminDashboardView: React.FC = () => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardMetrics()
      .then((res) => {
        if (res.success) setMetrics(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#0B1849]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1849]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[#0B1849]">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0B1849] text-[#FFFCE1] p-6 rounded-sm border border-[#FFFCE1]/15 space-y-2 shadow-md">
          <div className="flex justify-between items-center text-[#FFFCE1]/70 text-xs font-sans font-bold uppercase tracking-wider">
            <span>Occupancy Rate</span>
            <BedDouble size={18} className="text-[#FFDE74]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#FFFCE1]">{metrics?.occupancyRate}%</div>
          <p className="text-[10px] font-sans text-[#FFFCE1]/60">
            {metrics?.occupiedRooms + metrics?.reservedRooms} of {metrics?.totalRooms} Rooms Booked/Occupied
          </p>
        </div>

        <div className="bg-[#0B1849] text-[#FFFCE1] p-6 rounded-sm border border-[#FFFCE1]/15 space-y-2 shadow-md">
          <div className="flex justify-between items-center text-[#FFFCE1]/70 text-xs font-sans font-bold uppercase tracking-wider">
            <span>Live Kitchen Orders</span>
            <UtensilsCrossed size={18} className="text-[#FFDE74]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#FFDE74]">{metrics?.pendingOrdersCount}</div>
          <p className="text-[10px] font-sans text-[#FFFCE1]/60">Active orders on kitchen board</p>
        </div>

        <div className="bg-[#0B1849] text-[#FFFCE1] p-6 rounded-sm border border-[#FFFCE1]/15 space-y-2 shadow-md">
          <div className="flex justify-between items-center text-[#FFFCE1]/70 text-xs font-sans font-bold uppercase tracking-wider">
            <span>Confirmed Bookings</span>
            <CalendarCheck size={18} className="text-[#FFDE74]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#FFFCE1]">{metrics?.totalConfirmedBookings}</div>
          <p className="text-[10px] font-sans text-[#FFFCE1]/60">Active room reservations</p>
        </div>

        <div className="bg-[#0B1849] text-[#FFFCE1] p-6 rounded-sm border border-[#FFFCE1]/15 space-y-2 shadow-md">
          <div className="flex justify-between items-center text-[#FFFCE1]/70 text-xs font-sans font-bold uppercase tracking-wider">
            <span>Combined Revenue</span>
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-400">
            ₹{metrics?.totalCombinedRevenue?.toLocaleString()}
          </div>
          <p className="text-[10px] font-sans text-[#FFFCE1]/60">Rooms + Food Service Payments</p>
        </div>
      </div>

      {/* Revenue Breakdown Chart */}
      <div className="bg-[#0B1849] text-[#FFFCE1] p-6 rounded-sm border border-[#FFFCE1]/15 space-y-4 shadow-md">
        <div className="flex justify-between items-center border-b border-[#FFFCE1]/10 pb-4">
          <div>
            <h3 className="text-xl font-serif text-[#FFFCE1]">Revenue Analytics</h3>
            <p className="text-xs font-sans text-[#FFFCE1]/60">Room bookings + Room service dining revenue</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4 font-sans text-xs">
          {metrics?.revenueChart && metrics.revenueChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.revenueChart}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFDE74" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FFDE74" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,252,225,0.1)" />
                <XAxis dataKey="month" stroke="#FFFCE1" />
                <YAxis stroke="#FFFCE1" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1849', borderColor: '#FFDE74', borderRadius: '4px', color: '#FFFCE1' }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FFDE74" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[#FFFCE1]/50 text-xs font-sans">
              No revenue data points recorded yet. Real bookings will generate chart trends here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
