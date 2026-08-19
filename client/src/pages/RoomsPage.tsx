import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { fetchRoomTypes, checkAvailability, createBookingHold, verifyBookingPayment } from '../services/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RoomsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [filterAc, setFilterAc] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [planType, setPlanType] = useState<'NON_CP' | 'CP'>('NON_CP');

  // Booking Modal Form State
  const [checkIn, setCheckIn] = useState<string>(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState<string>(searchParams.get('checkOut') || '');
  const [numGuests, setNumGuests] = useState<number>(parseInt(searchParams.get('guests') || '2', 10));
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Price Calculation State
  const [calcResult, setCalcResult] = useState<any | null>(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    // Default dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    if (!checkIn) setCheckIn(tomorrow.toISOString().split('T')[0]);
    if (!checkOut) setCheckOut(dayAfter.toISOString().split('T')[0]);

    fetchRoomTypes().then((res) => {
      if (res.success) {
        setRoomTypes(res.data);
        const preselectId = searchParams.get('select');
        if (preselectId) {
          const found = res.data.find((r: any) => r._id === preselectId);
          if (found) setSelectedRoom(found);
        }
      }
    });

    // Load Razorpay Script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Recalculate price whenever booking parameters change
  useEffect(() => {
    if (!selectedRoom || !checkIn || !checkOut) return;

    checkAvailability({
      roomTypeId: selectedRoom._id,
      checkIn,
      checkOut,
      numGuests,
      mealSelection: { breakfast, lunch, dinner },
      couponCode,
      planType,
    })
      .then((res) => {
        if (res.success) {
          setCalcResult(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [selectedRoom, checkIn, checkOut, numGuests, breakfast, lunch, dinner, couponCode, planType]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName || !guestEmail || !guestPhone) {
      toast.error('Please enter your full name, email, and phone number.');
      return;
    }

    if (!calcResult?.availability?.isAvailable) {
      toast.error('Sorry, this room is not available for the selected dates.');
      return;
    }

    setSubmittingBooking(true);

    try {
      // 1. Create Hold / Order on backend
      const res = await createBookingHold({
        roomTypeId: selectedRoom._id,
        checkIn,
        checkOut,
        numGuests,
        mealSelection: { breakfast, lunch, dinner },
        couponCode,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        planType,
      });

      if (!res.success) {
        toast.error(res.message || 'Failed to initialize booking.');
        setSubmittingBooking(false);
        return;
      }

      const { bookingId, trackingToken, totalAmount, razorpayOrderId, razorpayKeyId } = res.data;

      // 2. Trigger Razorpay Payment Modal
      const options = {
        key: razorpayKeyId,
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        name: 'Hotel Raama, Hassan',
        description: `Room Booking ${bookingId}`,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=200&q=80',
        order_id: razorpayOrderId && razorpayOrderId.startsWith('order_mock_') ? undefined : razorpayOrderId,
        handler: async function (response: any) {
          toast.loading('Verifying payment signature...');

          const verifyRes = await verifyBookingPayment({
            bookingId,
            razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
            razorpaySignature: response.razorpay_signature || 'mock_sig',
          });

          if (verifyRes.success) {
            toast.dismiss();
            toast.success('Payment successful! Booking confirmed.');
            try {
              const storedBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
              if (!storedBookings.includes(trackingToken)) {
                storedBookings.push(trackingToken);
                localStorage.setItem('my_bookings', JSON.stringify(storedBookings));
              }
            } catch (e) {
              console.error('Error updating localStorage:', e);
            }
            navigate(`/booking/confirmation/${trackingToken}`);
          } else {
            toast.dismiss();
            toast.error(verifyRes.message || 'Payment verification failed.');
          }
        },
        prefill: {
          name: guestName,
          email: guestEmail,
          contact: guestPhone,
        },
        theme: {
          color: '#0B1849',
        },
        modal: {
          ondismiss: function () {
            toast.warning('Payment cancelled. Reservation hold expired.');
            setSubmittingBooking(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for environment without script
        const verifyRes = await verifyBookingPayment({
          bookingId,
          razorpayOrderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: 'mock_sig',
        });
        if (verifyRes.success) {
          try {
            const storedBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
            if (!storedBookings.includes(trackingToken)) {
              storedBookings.push(trackingToken);
              localStorage.setItem('my_bookings', JSON.stringify(storedBookings));
            }
          } catch (e) {
            console.error('Error updating localStorage:', e);
          }
          navigate(`/booking/confirmation/${trackingToken}`);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Error processing booking.');
      setSubmittingBooking(false);
    }
  };

  const filteredRooms = roomTypes.filter((room) => {
    if (filterAc === 'ac') return room.isAc;
    if (filterAc === 'nonac') return !room.isAc;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFFCE1] text-[#0B1849] py-16 max-w-7xl mx-auto px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 border-b border-[#0B1849]/15 pb-8">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#596277] block mb-2">
          Direct Booking Rates
        </span>
        <h1 className="editorial-section-title text-[#0B1849]">Rooms & Luxury Suites</h1>
        <p className="font-sans text-xs sm:text-sm text-[#596277] mt-3 max-w-xl mx-auto leading-relaxed">
          Guaranteed direct tariffs. Transparent 12% GST breakdown, CP (Breakfast included) or Non-CP options.
        </p>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={() => setFilterAc('all')}
            className={`px-5 py-2 rounded-sm text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              filterAc === 'all'
                ? 'bg-[#0B1849] text-[#FFFCE1]'
                : 'bg-[#FFFCE1] text-[#0B1849] border border-[#0B1849]/20 hover:border-[#0B1849]'
            }`}
          >
            All Categories ({roomTypes.length})
          </button>
          <button
            onClick={() => setFilterAc('ac')}
            className={`px-5 py-2 rounded-sm text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              filterAc === 'ac'
                ? 'bg-[#0B1849] text-[#FFFCE1]'
                : 'bg-[#FFFCE1] text-[#0B1849] border border-[#0B1849]/20 hover:border-[#0B1849]'
            }`}
          >
            Air Conditioned (A/C)
          </button>
          <button
            onClick={() => setFilterAc('nonac')}
            className={`px-5 py-2 rounded-sm text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              filterAc === 'nonac'
                ? 'bg-[#0B1849] text-[#FFFCE1]'
                : 'bg-[#FFFCE1] text-[#0B1849] border border-[#0B1849]/20 hover:border-[#0B1849]'
            }`}
          >
            Non-A/C Premium
          </button>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="bg-[#FFFCE1] rounded-sm overflow-hidden border border-[#0B1849]/15 shadow-sm flex flex-col justify-between hover:border-[#0B1849]/40 transition-all duration-300"
          >
            <div>
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0B1849] px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider text-[#FFDE74]">
                  {room.isAc ? 'A/C Executive' : 'Non A/C Premium'}
                </div>
              </div>

              <div className="p-7 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-serif text-[#0B1849]">{room.name}</h3>
                  <span className="text-[10px] font-sans text-[#596277] bg-[#0B1849]/5 px-2.5 py-1 rounded-sm uppercase tracking-wider font-semibold border border-[#0B1849]/10">
                    Max {room.maxOccupancy} Guests
                  </span>
                </div>

                <p className="text-xs font-sans text-[#596277] leading-relaxed">{room.description}</p>

                {/* Amenities list */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {room.amenities?.map((amenity: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] font-sans px-2.5 py-1 rounded-sm bg-[#0B1849]/5 text-[#0B1849] flex items-center gap-1 border border-[#0B1849]/10 font-medium"
                    >
                      <Check size={11} className="text-[#0B1849]" /> {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-7 pt-0 border-t border-[#0B1849]/10 mt-4 space-y-4">
              <div className="flex justify-between items-center bg-[#0B1849]/5 p-3.5 rounded-sm border border-[#0B1849]/10 text-xs">
                <div>
                  <span className="text-[#596277] text-[10px] font-sans uppercase tracking-wider block font-semibold">Non-CP Plan (Room Only)</span>
                  <span className="text-xl font-serif font-bold text-[#0B1849]">₹{room.basePrice}</span>
                  <span className="text-[10px] font-sans text-[#596277]"> / night + GST</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 text-[10px] font-sans uppercase tracking-wider block font-semibold">CP Plan (With Breakfast)</span>
                  <span className="text-xl font-serif font-bold text-emerald-800">₹{room.cpPrice || room.basePrice + 150}</span>
                  <span className="text-[10px] font-sans text-[#596277]"> / night + GST</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-wider text-[#596277] font-semibold">Instant Reservation</span>
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setPlanType('NON_CP');
                  }}
                  className="px-5 py-2.5 rounded-sm bg-[#0B1849] text-[#FFFCE1] font-sans font-semibold text-xs uppercase tracking-wider hover:bg-[#0B1849]/90 transition-all cursor-pointer"
                >
                  Select & Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL - Midnight Navy Container */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0B1849] text-[#FFFCE1] border border-[#FFFCE1]/20 rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl"
          >
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#FFFCE1]/10 text-[#FFFCE1]/70 hover:text-[#FFFCE1]"
            >
              <X size={20} />
            </button>

            <div className="mb-6 border-b border-[#FFFCE1]/10 pb-4">
              <span className="text-[#FFDE74] text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Direct Booking</span>
              <h2 className="text-3xl font-serif text-[#FFFCE1]">{selectedRoom.name}</h2>
              <p className="text-xs font-sans text-[#FFFCE1]/70 mt-1">Base Rate: ₹{selectedRoom.basePrice} / night</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-sans uppercase tracking-wider text-[#FFFCE1]/80 mb-1.5 font-semibold">Check-In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1] focus:border-[#FFDE74] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans uppercase tracking-wider text-[#FFFCE1]/80 mb-1.5 font-semibold">Check-Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1] focus:border-[#FFDE74] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans uppercase tracking-wider text-[#FFFCE1]/80 mb-1.5 font-semibold">Guests</label>
                  <select
                    value={numGuests}
                    onChange={(e) => setNumGuests(parseInt(e.target.value))}
                    className="w-full bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1]"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                  </select>
                </div>
              </div>

              {/* CP vs Non-CP Plan Selection */}
              <div className="p-4 bg-[#FFFCE1]/5 rounded-sm border border-[#FFFCE1]/15 space-y-3">
                <span className="text-[10px] font-sans font-bold text-[#FFDE74] uppercase block tracking-wider">
                  Select Room Booking Plan *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPlanType('NON_CP')}
                    className={`p-3.5 rounded-sm border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      planType === 'NON_CP'
                        ? 'bg-[#FFFCE1]/15 border-[#FFDE74] text-[#FFFCE1]'
                        : 'bg-transparent border-[#FFFCE1]/15 text-[#FFFCE1]/60 hover:border-[#FFFCE1]/30'
                    }`}
                  >
                    <span className="text-xs font-sans font-bold text-[#FFDE74] flex items-center justify-between">
                      🏨 Non-CP Plan (Room Only)
                      <span className="text-sm font-serif font-extrabold">₹{selectedRoom.basePrice}</span>
                    </span>
                    <span className="text-[10px] font-sans text-[#FFFCE1]/70">Standard rate, breakfast not included</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanType('CP')}
                    className={`p-3.5 rounded-sm border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      planType === 'CP'
                        ? 'bg-emerald-500/20 border-emerald-400 text-[#FFFCE1]'
                        : 'bg-transparent border-[#FFFCE1]/15 text-[#FFFCE1]/60 hover:border-[#FFFCE1]/30'
                    }`}
                  >
                    <span className="text-xs font-sans font-bold text-emerald-400 flex items-center justify-between">
                      🍳 CP Plan (With Breakfast)
                      <span className="text-sm font-serif font-extrabold">₹{selectedRoom.cpPrice || selectedRoom.basePrice + 150}</span>
                    </span>
                    <span className="text-[10px] font-sans text-[#FFFCE1]/70">Complimentary morning breakfast included</span>
                  </button>
                </div>
              </div>

              {/* Meal Plan Addons */}
              <div className="p-4 bg-[#FFFCE1]/5 rounded-sm border border-[#FFFCE1]/15 space-y-3">
                <span className="text-[10px] font-sans font-bold text-[#FFDE74] uppercase block tracking-wider">
                  Optional Dining Addons (Per Guest/Night)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans text-[#FFFCE1]/90">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={breakfast}
                      onChange={(e) => setBreakfast(e.target.checked)}
                      className="rounded accent-[#FFDE74]"
                    />
                    <span>Breakfast (+₹150)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lunch}
                      onChange={(e) => setLunch(e.target.checked)}
                      className="rounded accent-[#FFDE74]"
                    />
                    <span>Lunch (+₹250)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dinner}
                      onChange={(e) => setDinner(e.target.checked)}
                      className="rounded accent-[#FFDE74]"
                    />
                    <span>Dinner (+₹300)</span>
                  </label>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans uppercase text-[#FFFCE1]"
                />
                <button
                  type="button"
                  onClick={() => toast.info('Coupon applied automatically!')}
                  className="px-4 py-2 bg-[#FFFCE1]/10 text-xs font-sans uppercase font-bold rounded-sm hover:bg-[#FFFCE1]/20 text-[#FFDE74]"
                >
                  Apply
                </button>
              </div>

              {/* Guest Details */}
              <div className="space-y-3 pt-4 border-t border-[#FFFCE1]/10">
                <span className="text-[10px] font-sans font-bold text-[#FFDE74] uppercase block tracking-wider">Guest Information</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1]"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1]"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1]"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Special Requests / Arrival Time"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1]"
                />
              </div>

              {/* Price Breakdown Calculation */}
              {calcResult && (
                <div className="p-4 bg-[#FFFCE1]/5 rounded-sm border border-[#FFFCE1]/15 space-y-2 text-xs font-sans">
                  <div className="flex justify-between text-[#FFFCE1]/80">
                    <span>Room ({calcResult.pricing.numNights} nights x ₹{calcResult.pricing.roomPricePerNight}):</span>
                    <span>₹{calcResult.pricing.roomTotal}</span>
                  </div>
                  {calcResult.pricing.mealPlanTotal > 0 && (
                    <div className="flex justify-between text-[#FFFCE1]/80">
                      <span>Meals Addon:</span>
                      <span>₹{calcResult.pricing.mealPlanTotal}</span>
                    </div>
                  )}
                  {calcResult.pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Coupon Discount ({calcResult.pricing.couponCode}):</span>
                      <span>- ₹{calcResult.pricing.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#FFFCE1]/60">
                    <span>GST (12%):</span>
                    <span>₹{calcResult.pricing.taxAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#FFDE74] pt-2 border-t border-[#FFFCE1]/10">
                    <span>Total Amount Payable:</span>
                    <span>₹{calcResult.pricing.totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingBooking || !calcResult?.availability?.isAvailable}
                className="w-full py-4 rounded-sm bg-[#FFFCE1] text-[#0B1849] font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#FFDE74] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <CreditCard size={16} /> Pay Online via Razorpay (₹{calcResult?.pricing?.totalAmount || selectedRoom.basePrice})
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
