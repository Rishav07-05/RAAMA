import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Clock, CheckCircle2, ChefHat, Bike, Download } from 'lucide-react';
import { trackOrderStatus, getOrderInvoiceUrl } from '../services/api';

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

export const OrderTrackingPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    trackOrderStatus(token)
      .then((res) => {
        if (res.success) setOrder(res.data);
      })
      .finally(() => setLoading(false));

    // Connect Socket.IO for real-time order status updates
    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on('connect', () => {
      socket.emit('join_guest_order', token);
    });

    socket.on('order_status_changed', (updatedOrder: any) => {
      setOrder(updatedOrder);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCE1] text-[#0B1849] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1849]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FFFCE1] text-[#0B1849] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-serif">Order Not Found</h2>
        <p className="text-xs font-sans text-[#596277] mt-2">The order tracking link is invalid.</p>
      </div>
    );
  }

  const isPickup = order.deliveryOption === 'RECEPTION_PICKUP';

  const steps = [
    { key: 'PENDING', label: 'Order Received', icon: Clock },
    { key: 'CONFIRMED', label: 'Accepted by Kitchen', icon: CheckCircle2 },
    { key: 'PREPARING', label: 'Chef Preparing', icon: ChefHat },
    { key: 'READY', label: isPickup ? 'Ready for Pickup' : 'Out for Delivery', icon: Bike },
    { key: 'DELIVERED', label: isPickup ? 'Collected at Reception' : 'Delivered to Room', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-[#FFFCE1] text-[#0B1849] py-16 px-6 max-w-lg mx-auto space-y-6">
      {/* Card Header */}
      <div className="bg-[#0B1849] text-[#FFFCE1] p-8 rounded-sm border border-[#FFFCE1]/20 space-y-8 shadow-2xl text-center">
        <div>
          <span className="text-[10px] font-sans text-[#FFDE74] font-bold uppercase tracking-[0.2em] block">
            {order.roomNumber && order.roomNumber.toLowerCase() !== 'none'
              ? `Room #${order.roomNumber} Service Live Tracker`
              : 'Reception Pickup Live Tracker'}
          </span>
          <h1 className="text-2xl font-serif text-[#FFFCE1] mt-1">Order #{order.orderId}</h1>
          <span className="inline-block mt-2 px-3 py-1 bg-[#FFFCE1]/10 border border-[#FFFCE1]/20 text-[#FFDE74] text-[10px] font-sans font-bold uppercase tracking-wider rounded-sm">
            {order.status}
          </span>
        </div>

        {/* Progress Tracker Steps */}
        <div className="space-y-4 text-left pt-6 border-t border-[#FFFCE1]/10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.key} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                    isCompleted
                      ? 'bg-[#FFDE74] text-[#0B1849] border-[#FFDE74]'
                      : 'bg-[#FFFCE1]/5 text-[#FFFCE1]/40 border-[#FFFCE1]/15'
                  } ${isCurrent ? 'animate-pulse ring-2 ring-[#FFDE74]' : ''}`}
                >
                  <Icon size={15} />
                </div>
                <span className={`text-xs font-sans font-semibold ${isCompleted ? 'text-[#FFFCE1]' : 'text-[#FFFCE1]/40'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Items Summary */}
        <div className="p-5 bg-[#FFFCE1]/5 rounded-sm border border-[#FFFCE1]/15 text-left space-y-3 text-xs font-sans">
          <span className="text-[10px] font-bold text-[#FFDE74] uppercase tracking-wider block">Ordered Items</span>
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between text-[#FFFCE1]/80">
              <span>
                {item.quantity}x {item.name} {item.potionSize !== 'Standard' && `(${item.potionSize})`}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-[#FFFCE1]/10 flex justify-between font-bold text-sm text-[#FFDE74]">
            <span>Total Bill Amount:</span>
            <span className="font-serif">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* PDF Receipt Link */}
        <div>
          <a
            href={getOrderInvoiceUrl(order.trackingToken || order._id)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#FFFCE1] text-[#0B1849] hover:bg-[#FFDE74] text-xs font-sans font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Download size={15} /> Download Digital Receipt (PDF)
          </a>
        </div>
      </div>
    </div>
  );
};
