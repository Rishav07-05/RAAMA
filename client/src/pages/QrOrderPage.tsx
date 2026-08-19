import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Utensils, GlassWater, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { validateQrToken, fetchMenuCatalog, createFoodOrder, verifyOrderPayment } from '../services/api';

export const QrOrderPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [roomInfo, setRoomInfo] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'SWAAD' | 'LIQUID_LOUNGE'>('SWAAD');
  
  // Cart State: { [menuItemId_potionSize]: { menuItemId, name, price, quantity, potionSize } }
  const [cart, setCart] = useState<Record<string, any>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'RAZORPAY' | 'CASH'>('RAZORPAY');

  useEffect(() => {
    if (!token) return;

    // 1. Validate QR Token
    validateQrToken(token)
      .then((res) => {
        if (res.success) {
          setRoomInfo(res.data);
          // 2. Fetch Menu
          return fetchMenuCatalog();
        } else {
          toast.error(res.message || 'Invalid QR Token');
        }
      })
      .then((res) => {
        if (res?.success) {
          setCategories(res.data.categories);
          setItems(res.data.items);
        }
      })
      .catch(() => {
        toast.error('Failed to initialize QR ordering.');
      })
      .finally(() => setLoading(false));

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [token]);

  const addToCart = (item: any, potionSize: string = 'Standard') => {
    const key = `${item._id}_${potionSize}`;
    const unitPrice = potionSize === '60ML' && item.price60ml ? item.price60ml : item.price;

    setCart((prev) => {
      const existing = prev[key];
      const newQty = existing ? existing.quantity + 1 : 1;
      return {
        ...prev,
        [key]: {
          menuItemId: item._id,
          name: item.name,
          price: unitPrice,
          quantity: newQty,
          potionSize,
        },
      };
    });

    toast.success(`Added ${item.name} to cart`);
  };

  const updateQuantity = (key: string, delta: number) => {
    setCart((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return {
        ...prev,
        [key]: { ...existing, quantity: newQty },
      };
    });
  };

  const cartList = Object.values(cart);
  const totalCartCount = cartList.reduce((sum, i) => sum + i.quantity, 0);
  const totalCartPrice = cartList.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartList.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    if (!guestName || !guestPhone) {
      toast.error('Please provide your name and phone number.');
      return;
    }

    setPlacingOrder(true);

    try {
      const res = await createFoodOrder({
        qrToken: token,
        guestName,
        guestPhone,
        items: cartList,
        specialInstructions,
        paymentMethod: paymentMode,
      });

      if (!res.success) {
        toast.error(res.message || 'Failed to place order.');
        setPlacingOrder(false);
        return;
      }

      const { orderId, trackingToken, totalAmount, razorpayOrderId, razorpayKeyId } = res.data;

      // Handle CASH payment choice (Pay at Reception / Counter)
      if (paymentMode === 'CASH') {
        toast.success('Food order sent to kitchen! Pay cash at reception/counter.');
        try {
          const storedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
          if (!storedOrders.includes(trackingToken)) {
            storedOrders.push(trackingToken);
            localStorage.setItem('my_orders', JSON.stringify(storedOrders));
          }
        } catch (e) {
          console.error('Error updating localStorage:', e);
        }
        navigate(`/track-order/${trackingToken}`);
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: razorpayKeyId,
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        name: 'Hotel Raama, Hassan',
        description: `Food Order ${orderId}`,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=200&q=80',
        order_id: razorpayOrderId && razorpayOrderId.startsWith('order_mock_') ? undefined : razorpayOrderId,
        handler: async function (response: any) {
          toast.loading('Verifying payment signature...');

          const verifyRes = await verifyOrderPayment({
            orderId,
            razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
            razorpaySignature: response.razorpay_signature || 'mock_sig',
          });

          if (verifyRes.success) {
            toast.dismiss();
            toast.success('Payment verified! Food order placed successfully!');
            try {
              const storedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
              if (!storedOrders.includes(trackingToken)) {
                storedOrders.push(trackingToken);
                localStorage.setItem('my_orders', JSON.stringify(storedOrders));
              }
            } catch (e) {
              console.error('Error updating localStorage:', e);
            }
            navigate(`/track-order/${trackingToken}`);
          } else {
            toast.dismiss();
            toast.error(verifyRes.message || 'Payment verification failed.');
          }
        },
        prefill: {
          name: guestName,
          contact: guestPhone,
        },
        theme: {
          color: '#0B1849',
        },
        modal: {
          ondismiss: function () {
            toast.warning('Payment cancelled. Order was not submitted.');
            setPlacingOrder(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for environment without script
        const verifyRes = await verifyOrderPayment({
          orderId,
          razorpayOrderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: 'mock_sig',
        });
        if (verifyRes.success) {
          try {
            const storedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
            if (!storedOrders.includes(trackingToken)) {
              storedOrders.push(trackingToken);
              localStorage.setItem('my_orders', JSON.stringify(storedOrders));
            }
          } catch (e) {
            console.error('Error updating localStorage:', e);
          }
          navigate(`/track-order/${trackingToken}`);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Error placing order.');
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCE1] text-[#0B1849] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1849]"></div>
      </div>
    );
  }

  if (!roomInfo) {
    return (
      <div className="min-h-screen bg-[#FFFCE1] text-[#0B1849] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-serif">Invalid QR Code</h2>
        <p className="text-xs font-sans text-[#596277] mt-2">Please scan the valid QR code present in your room or party hall.</p>
      </div>
    );
  }

  const isPartyHall = roomInfo.roomNumber.toLowerCase().includes('hall');
  const sectionCategories = categories.filter((c) => c.section === activeSection);
  const sectionItems = items.filter((i) => i.section === activeSection);

  return (
    <div className="min-h-screen bg-[#FFFCE1] text-[#0B1849] py-12 px-6 lg:px-8 relative">
      {/* Location Banner Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3 mb-12 border-b border-[#0B1849]/15 pb-8">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#596277]">
          Verified Location
        </span>
        <h1 className="editorial-section-title text-[#0B1849]">
          {isPartyHall ? 'Sambhrama Party Hall' : `Room #${roomInfo.roomNumber}`}
        </h1>
        <p className="text-xs font-sans text-[#596277]">
          Floor {roomInfo.floor} · Contactless Ordering Portal
        </p>

        {/* Section Tabs */}
        <div className="flex justify-center gap-3 pt-6">
          <button
            onClick={() => setActiveSection('SWAAD')}
            className={`px-5 py-2.5 rounded-sm font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'SWAAD'
                ? 'bg-[#0B1849] text-[#FFFCE1]'
                : 'bg-[#FFFCE1] text-[#0B1849] border border-[#0B1849]/20 hover:border-[#0B1849]'
            }`}
          >
            <Utensils size={15} /> Swaad Menu
          </button>
          <button
            onClick={() => setActiveSection('LIQUID_LOUNGE')}
            className={`px-5 py-2.5 rounded-sm font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'LIQUID_LOUNGE'
                ? 'bg-[#0B1849] text-[#FFFCE1]'
                : 'bg-[#FFFCE1] text-[#0B1849] border border-[#0B1849]/20 hover:border-[#0B1849]'
            }`}
          >
            <GlassWater size={15} /> Liquid Lounge Bar
          </button>
        </div>
      </div>

      {/* Menu Catalog */}
      <div className="max-w-6xl mx-auto space-y-12 pb-24">
        {sectionCategories.map((cat) => {
          const catItems = sectionItems.filter((i) => i.categoryId === cat._id);
          if (catItems.length === 0) return null;

          return (
            <div key={cat._id} className="space-y-4">
              <h2 className="text-2xl font-serif text-[#0B1849] border-b border-[#0B1849]/15 pb-2">
                {cat.name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-[#FFFCE1] rounded-sm p-6 border border-[#0B1849]/15 flex flex-col justify-between hover:border-[#0B1849]/40 transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-serif font-bold text-[#0B1849]">{item.name}</h3>
                        <span
                          className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                            item.isVeg ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-red-50 text-red-800 border-red-300'
                          }`}
                        >
                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-xs font-sans text-[#596277] mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#0B1849]/10 mt-4 flex items-center justify-between">
                      <div>
                        {item.price60ml ? (
                          <div className="text-[10px] font-sans text-[#596277]">
                            <span>30ML: <strong className="text-[#0B1849]">₹{item.price}</strong></span>
                            <span className="ml-2">60ML: <strong className="text-[#0B1849]">₹{item.price60ml}</strong></span>
                          </div>
                        ) : (
                          <span className="text-lg font-serif font-bold text-[#0B1849]">₹{item.price}</span>
                        )}
                      </div>

                      {item.price60ml ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => addToCart(item, '30ML')}
                            className="px-2.5 py-1 rounded-sm bg-[#0B1849] text-[#FFFCE1] text-[10px] font-sans font-semibold uppercase hover:bg-[#0B1849]/90 cursor-pointer"
                          >
                            + 30ML
                          </button>
                          <button
                            onClick={() => addToCart(item, '60ML')}
                            className="px-2.5 py-1 rounded-sm bg-[#0B1849] text-[#FFFCE1] text-[10px] font-sans font-semibold uppercase hover:bg-[#0B1849]/90 cursor-pointer"
                          >
                            + 60ML
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item, 'Standard')}
                          className="px-4 py-2 rounded-sm bg-[#0B1849] text-[#FFFCE1] text-xs font-sans font-semibold uppercase hover:bg-[#0B1849]/90 cursor-pointer flex items-center gap-1"
                        >
                          <Plus size={13} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Button */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setCartOpen(true)}
            className="px-6 py-3.5 rounded-sm bg-[#0B1849] text-[#FFFCE1] shadow-2xl font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-3 hover:bg-[#0B1849]/90 transition-all cursor-pointer border border-[#FFFCE1]/20"
          >
            <ShoppingBag size={16} /> Cart ({totalCartCount}) · ₹{totalCartPrice}
          </button>
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B1849] text-[#FFFCE1] border border-[#FFFCE1]/20 rounded-sm max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl space-y-6">
            <button
              onClick={() => setCartOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#FFFCE1]/10 text-[#FFFCE1]/70 hover:text-[#FFFCE1]"
            >
              <X size={18} />
            </button>

            <div className="border-b border-[#FFFCE1]/10 pb-4">
              <span className="text-[#FFDE74] text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
                {isPartyHall ? 'Party Hall Order' : `Room #${roomInfo.roomNumber} Service`}
              </span>
              <h2 className="text-2xl font-serif text-[#FFFCE1]">Confirm Order</h2>
            </div>

            {/* Items */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {cartList.map((item: any) => {
                const key = `${item.menuItemId}_${item.potionSize}`;
                return (
                  <div key={key} className="flex items-center justify-between bg-[#FFFCE1]/5 p-3 rounded-sm border border-[#FFFCE1]/10 text-xs font-sans">
                    <div>
                      <span className="font-bold text-[#FFFCE1] block">{item.name}</span>
                      <span className="text-[10px] text-[#FFFCE1]/60">Size: {item.potionSize} · ₹{item.price}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-2 py-1">
                        <button onClick={() => updateQuantity(key, -1)} className="text-[#FFFCE1]/70 hover:text-[#FFFCE1]">
                          <Minus size={12} />
                        </button>
                        <span className="font-bold text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(key, 1)} className="text-[#FFFCE1]/70 hover:text-[#FFFCE1]">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-bold text-sm text-[#FFDE74] min-w-14 text-right">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#FFFCE1]/10 text-sm font-sans font-bold">
              <span>Total Amount:</span>
              <span className="text-xl font-serif text-[#FFDE74]">₹{totalCartPrice}</span>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-[10px] font-sans uppercase text-[#FFFCE1]/80 font-bold mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="Guest Name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans uppercase text-[#FFFCE1]/80 font-bold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="Contact Mobile Number"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans uppercase text-[#FFFCE1]/80 font-bold mb-1">Special Notes / Spice Level</label>
                <input
                  type="text"
                  placeholder="e.g. Mild spice, no onions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1]"
                />
              </div>

              {/* Payment Mode Selection */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-sans uppercase tracking-wider text-[#FFDE74] font-bold block">Payment Method *</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('RAZORPAY')}
                    className={`p-3 rounded-sm border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      paymentMode === 'RAZORPAY' ? 'bg-[#FFFCE1] text-[#0B1849] font-bold border-[#FFFCE1]' : 'bg-transparent text-[#FFFCE1]/70 border-[#FFFCE1]/20'
                    }`}
                  >
                    <span className="text-xs font-sans uppercase font-bold flex items-center gap-1.5">💳 Online (Razorpay)</span>
                    <span className="text-[10px] opacity-80">Instant UPI & Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('CASH')}
                    className={`p-3 rounded-sm border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      paymentMode === 'CASH' ? 'bg-[#FFFCE1] text-[#0B1849] font-bold border-[#FFFCE1]' : 'bg-transparent text-[#FFFCE1]/70 border-[#FFFCE1]/20'
                    }`}
                  >
                    <span className="text-xs font-sans uppercase font-bold flex items-center gap-1.5">💵 Pay at Reception</span>
                    <span className="text-[10px] opacity-80">Pay upon delivery</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="w-full py-4 rounded-sm bg-[#FFFCE1] text-[#0B1849] font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#FFDE74] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-4"
              >
                <Send size={15} /> {paymentMode === 'RAZORPAY' ? 'Pay Online & Send Order' : 'Send Order to Kitchen'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
