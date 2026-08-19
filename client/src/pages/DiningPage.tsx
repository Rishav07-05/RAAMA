import React, { useState, useEffect } from 'react';
import { Utensils, GlassWater, Search, ShoppingBag, Plus, Minus, X, Send, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { fetchMenuCatalog, createFoodOrder, verifyOrderPayment } from '../services/api';

export const DiningPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'SWAAD_VEG' | 'SWAAD_NON_VEG' | 'LIQUID_LOUNGE'>('SWAAD_VEG');
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Cart State: { [menuItemId_potionSize]: { menuItemId, name, price, quantity, potionSize } }
  const [cart, setCart] = useState<Record<string, any>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isStayingInRoom, setIsStayingInRoom] = useState<boolean>(true);
  const [roomNumber, setRoomNumber] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'ROOM_SERVICE' | 'RECEPTION_PICKUP'>('ROOM_SERVICE');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'RAZORPAY' | 'CASH'>('RAZORPAY');

  // Scanned Menu Viewer Modal State
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerPageIndex, setViewerPageIndex] = useState(0);

  // Swaad has 12 pages, LLB has 2 pages
  const swaadPages = Array.from({ length: 12 }, (_, i) => `/swaad_images/page-${String(i + 1).padStart(2, '0')}.png`);
  const llbPages = Array.from({ length: 2 }, (_, i) => `/llb_beverage_images/page-${i + 1}.png`);
  const currentScannedPages = activeTab !== 'LIQUID_LOUNGE' ? swaadPages : llbPages;

  useEffect(() => {
    fetchMenuCatalog()
      .then((res) => {
        if (res.success) {
          setCategories(res.data.categories);
          setItems(res.data.items);
        }
      })
      .finally(() => setLoading(false));

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const currentItems = items.filter((i) => {
    if (activeTab === 'SWAAD_VEG') {
      if (i.section !== 'SWAAD' || !i.isVeg) return false;
    } else if (activeTab === 'SWAAD_NON_VEG') {
      if (i.section !== 'SWAAD' || i.isVeg) return false;
    } else if (activeTab === 'LIQUID_LOUNGE') {
      if (i.section !== 'LIQUID_LOUNGE') return false;
    }
    if (searchTerm) {
      return i.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const activeCategoryIds = new Set(
    currentItems.map((i) => (typeof i.categoryId === 'object' ? i.categoryId?._id : i.categoryId))
  );
  const currentCategories = categories.filter((c) => activeCategoryIds.has(c._id));

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

  // Force delivery option to RECEPTION_PICKUP if guest is not staying in a room
  const handleRoomToggle = (staying: boolean) => {
    setIsStayingInRoom(staying);
    if (!staying) {
      setRoomNumber('None');
      setDeliveryOption('RECEPTION_PICKUP');
    } else {
      setRoomNumber('');
      setDeliveryOption('ROOM_SERVICE');
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartList.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    if (!guestName || !guestPhone) {
      toast.error('Please enter your full name and phone number.');
      return;
    }

    if (isStayingInRoom && (!roomNumber || roomNumber === 'None')) {
      toast.error('Please enter your room number.');
      return;
    }

    setPlacingOrder(true);

    try {
      // 1. Create order on backend
      const res = await createFoodOrder({
        guestName,
        guestPhone,
        roomNumber: isStayingInRoom ? roomNumber : 'None',
        deliveryOption: isStayingInRoom ? deliveryOption : 'RECEPTION_PICKUP',
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
        toast.success('Order sent to kitchen! Pay cash at reception/counter.');
        try {
          const storedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
          if (!storedOrders.includes(trackingToken)) {
            storedOrders.push(trackingToken);
            localStorage.setItem('my_orders', JSON.stringify(storedOrders));
          }
        } catch (e) {
          console.error('Error updating localStorage:', e);
        }
        setCart({});
        setCartOpen(false);
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
            setCart({});
            setCartOpen(false);
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
          setCart({});
          setCartOpen(false);
          navigate(`/track-order/${trackingToken}`);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Error placing order.');
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCE1] text-[#0B1849] py-16 max-w-7xl mx-auto px-6 lg:px-8 relative">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 border-b border-[#0B1849]/15 pb-8">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#596277] block mb-1">
          Culinary Experiences
        </span>
        <h1 className="editorial-section-title text-[#0B1849]">Dining & Beverage Menu</h1>
        <p className="font-sans text-xs sm:text-sm text-[#596277] max-w-xl mx-auto leading-relaxed">
          Delights from Swaad Pure Veg Restaurant, Non-Veg Specialities, or executive spirits from Liquid Lounge Bar (LLB). Order straight to your room or collect at reception.
        </p>

        {/* Action Buttons: View Scanned Menu & Cart */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => {
              setViewerPageIndex(0);
              setViewerOpen(true);
            }}
            className="px-5 py-2.5 rounded-sm font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-[#0B1849]/20 bg-[#FFFCE1] text-[#0B1849] hover:bg-[#0B1849]/5 transition-all cursor-pointer"
          >
            <BookOpen size={15} /> View Scanned Menu Cards
          </button>

          {totalCartCount > 0 && (
            <button
              onClick={() => setCartOpen(true)}
              className="px-5 py-2.5 rounded-sm font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 bg-[#0B1849] text-[#FFFCE1] shadow-sm hover:bg-[#0B1849]/90 transition-all cursor-pointer"
            >
              <ShoppingBag size={15} /> View Cart ({totalCartCount}) — ₹{totalCartPrice}
            </button>
          )}
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <button
            onClick={() => {
              setActiveTab('SWAAD_VEG');
              setSearchTerm('');
            }}
            className={`px-5 py-3 rounded-sm font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'SWAAD_VEG'
                ? 'bg-[#0B1849] text-[#FFFCE1] shadow-md'
                : 'bg-[#FFFCE1] text-[#0B1849] border border-[#0B1849]/20 hover:border-[#0B1849]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <Utensils size={15} /> Swaad Pure Veg
          </button>

          <button
            onClick={() => {
              setActiveTab('SWAAD_NON_VEG');
              setSearchTerm('');
            }}
            className={`px-5 py-3 rounded-sm font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'SWAAD_NON_VEG'
                ? 'bg-[#0B1849] text-[#FFFCE1] shadow-md'
                : 'bg-[#FFFCE1] text-[#0B1849] border border-[#0B1849]/20 hover:border-[#0B1849]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            <Utensils size={15} /> Non-Veg Specialities
          </button>

          <button
            onClick={() => {
              setActiveTab('LIQUID_LOUNGE');
              setSearchTerm('');
            }}
            className={`px-5 py-3 rounded-sm font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'LIQUID_LOUNGE'
                ? 'bg-[#0B1849] text-[#FFFCE1] shadow-md'
                : 'bg-[#FFFCE1] text-[#0B1849] border border-[#0B1849]/20 hover:border-[#0B1849]'
            }`}
          >
            <GlassWater size={15} /> Liquid Lounge Bar
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mt-6">
          <Search size={16} className="absolute left-3.5 top-3 text-[#596277]" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'LIQUID_LOUNGE' ? 'drinks...' : 'dishes...'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FFFCE1] border border-[#0B1849]/20 rounded-sm pl-10 pr-4 py-2 text-xs font-sans text-[#0B1849] focus:border-[#0B1849] focus:outline-none"
          />
        </div>
      </div>

      {/* Menu Catalog */}
      {loading ? (
        <div className="text-center font-sans text-xs text-[#596277] py-16">Loading menu items...</div>
      ) : (
        <div className="space-y-16">
          {currentCategories.map((cat) => {
            const catItems = currentItems.filter((i) => i.categoryId === cat._id);
            if (catItems.length === 0) return null;

            return (
              <div key={cat._id} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#0B1849]/15 pb-3">
                  <h2 className="text-2xl font-serif text-[#0B1849]">{cat.name}</h2>
                  <span className="text-[10px] font-sans text-[#596277] font-semibold uppercase bg-[#0B1849]/5 px-2.5 py-0.5 rounded-sm border border-[#0B1849]/10">
                    {catItems.length} Items
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {catItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-[#FFFCE1] rounded-sm p-6 border border-[#0B1849]/15 flex flex-col justify-between hover:border-[#0B1849]/40 transition-all duration-300 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-lg font-serif font-bold text-[#0B1849]">{item.name}</h3>
                          <span
                            className={`shrink-0 text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                              item.isVeg
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-red-50 text-red-800 border-red-300'
                            }`}
                          >
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs font-sans text-[#596277] leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#0B1849]/10 mt-4 flex items-center justify-between">
                        <div>
                          {item.price60ml ? (
                            <div className="text-[11px] font-sans text-[#596277]">
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
      )}

      {/* FLOATING CART SUMMARY BAR */}
      {totalCartCount > 0 && !cartOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setCartOpen(true)}
            className="px-6 py-3.5 rounded-sm bg-[#0B1849] text-[#FFFCE1] shadow-2xl font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-3 hover:bg-[#0B1849]/90 transition-all cursor-pointer border border-[#FFFCE1]/20"
          >
            <ShoppingBag size={16} /> Cart ({totalCartCount} Items) · ₹{totalCartPrice}
          </button>
        </div>
      )}

      {/* CART & CHECKOUT MODAL */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B1849] text-[#FFFCE1] border border-[#FFFCE1]/20 rounded-sm max-w-xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl space-y-6">
            <button
              onClick={() => setCartOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#FFFCE1]/10 text-[#FFFCE1]/70 hover:text-[#FFFCE1]"
            >
              <X size={18} />
            </button>

            <div className="border-b border-[#FFFCE1]/10 pb-4">
              <span className="text-[#FFDE74] text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Dining Cart</span>
              <h2 className="text-2xl font-serif text-[#FFFCE1]">Order Checkout</h2>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {cartList.map((item: any) => {
                const key = `${item.menuItemId}_${item.potionSize}`;
                return (
                  <div key={key} className="flex items-center justify-between bg-[#FFFCE1]/5 p-3 rounded-sm border border-[#FFFCE1]/10 text-xs font-sans">
                    <div>
                      <span className="font-bold text-[#FFFCE1] block">{item.name}</span>
                      <span className="text-[10px] text-[#FFFCE1]/60">Size: {item.potionSize} · ₹{item.price} each</span>
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

            {/* Total Amount Summary */}
            <div className="flex justify-between items-center pt-3 border-t border-[#FFFCE1]/10 text-sm font-sans font-bold">
              <span>Total Payable Amount:</span>
              <span className="text-xl font-serif text-[#FFDE74]">₹{totalCartPrice}</span>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleOrderSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-sans uppercase text-[#FFFCE1]/80 font-bold mb-1">Guest Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
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
                    placeholder="9876543210"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1]"
                    required
                  />
                </div>
              </div>

              {/* Staying in Room Toggle */}
              <div className="p-3.5 bg-[#FFFCE1]/5 rounded-sm border border-[#FFFCE1]/10 space-y-3">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#FFDE74] block">
                  Are you staying in a hotel room?
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoomToggle(true)}
                    className={`px-4 py-2 rounded-sm text-xs font-sans font-bold uppercase transition-all cursor-pointer ${
                      isStayingInRoom ? 'bg-[#FFFCE1] text-[#0B1849]' : 'bg-transparent text-[#FFFCE1]/60 border border-[#FFFCE1]/20'
                    }`}
                  >
                    Yes (In Room)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoomToggle(false)}
                    className={`px-4 py-2 rounded-sm text-xs font-sans font-bold uppercase transition-all cursor-pointer ${
                      !isStayingInRoom ? 'bg-[#FFFCE1] text-[#0B1849]' : 'bg-transparent text-[#FFFCE1]/60 border border-[#FFFCE1]/20'
                    }`}
                  >
                    No (Outside / Reception)
                  </button>
                </div>

                {isStayingInRoom && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-sans uppercase text-[#FFFCE1]/80 font-bold mb-1">Room Number *</label>
                      <input
                        type="text"
                        placeholder="e.g. 104"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="w-full bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase text-[#FFFCE1]/80 font-bold mb-1">Delivery Type</label>
                      <select
                        value={deliveryOption}
                        onChange={(e) => setDeliveryOption(e.target.value as any)}
                        className="w-full bg-[#0B1849] border border-[#FFFCE1]/20 rounded-sm px-3.5 py-2 text-xs font-sans text-[#FFFCE1]"
                      >
                        <option value="ROOM_SERVICE">Deliver to Room</option>
                        <option value="RECEPTION_PICKUP">Reception Pickup</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-[10px] font-sans uppercase text-[#FFFCE1]/80 font-bold mb-1">Special Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Less spicy, extra cutlery"
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
                    <span className="text-[10px] opacity-80">UPI, Cards, NetBanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('CASH')}
                    className={`p-3 rounded-sm border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      paymentMode === 'CASH' ? 'bg-[#FFFCE1] text-[#0B1849] font-bold border-[#FFFCE1]' : 'bg-transparent text-[#FFFCE1]/70 border-[#FFFCE1]/20'
                    }`}
                  >
                    <span className="text-xs font-sans uppercase font-bold flex items-center gap-1.5">💵 Pay at Reception</span>
                    <span className="text-[10px] opacity-80">Cash or UPI at counter</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="w-full py-4 rounded-sm bg-[#FFFCE1] text-[#0B1849] font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#FFDE74] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-4"
              >
                <Send size={15} /> {paymentMode === 'RAZORPAY' ? 'Pay & Send Order' : 'Send Order (Pay at Reception)'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SCANNED MENU VIEWER MODAL */}
      {viewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl flex justify-between items-center mb-4 text-[#FFFCE1]">
            <span className="text-xs font-sans uppercase tracking-widest text-[#FFDE74] font-bold">
              {activeTab !== 'LIQUID_LOUNGE' ? 'Swaad Menu Card' : 'Liquid Lounge Bar Menu'} (Page {viewerPageIndex + 1} of {currentScannedPages.length})
            </span>
            <button
              onClick={() => setViewerOpen(false)}
              className="p-2 rounded-full bg-[#FFFCE1]/10 text-[#FFFCE1] hover:bg-[#FFFCE1]/20"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative max-w-4xl max-h-[80vh] overflow-hidden flex items-center justify-center">
            <img
              src={currentScannedPages[viewerPageIndex]}
              alt={`Page ${viewerPageIndex + 1}`}
              className="max-h-[75vh] w-auto object-contain rounded-sm border border-[#FFFCE1]/20 shadow-2xl"
            />

            {viewerPageIndex > 0 && (
              <button
                onClick={() => setViewerPageIndex((prev) => prev - 1)}
                className="absolute left-4 p-3 rounded-full bg-[#0B1849]/80 text-[#FFFCE1] border border-[#FFFCE1]/20 hover:bg-[#0B1849]"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {viewerPageIndex < currentScannedPages.length - 1 && (
              <button
                onClick={() => setViewerPageIndex((prev) => prev + 1)}
                className="absolute right-4 p-3 rounded-full bg-[#0B1849]/80 text-[#FFFCE1] border border-[#FFFCE1]/20 hover:bg-[#0B1849]"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
