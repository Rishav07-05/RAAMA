export const FALLBACK_HOTEL_INFO = {
  hotelName: 'Hotel Raama',
  tagline: 'Hospitality That Feels Like Home',
  address: 'B.M. Road, Thanneeruhalla, Opposite S.D.M. Ayurvedic Hospital & College',
  city: 'Hassan',
  state: 'Karnataka',
  pincode: '573201',
  phone: '081722 57001',
  email: 'reservations@hotelraama.com',
  receptionWhatsapp: '918172257001',
  notificationEmail: 'admin@hotelraama.com',
  taxPercentage: 12,
  bookingHoldMinutes: 15,
};

export const FALLBACK_ROOM_TYPES = [
  {
    _id: 'rt_1',
    name: 'Premium Single Non A/C',
    code: 'PREM_SGL_NONAC',
    description: 'Comfortable single occupancy non-A/C room with queen bed, Wi-Fi, and city views.',
    basePrice: 1200,
    cpPrice: 1350,
    maxOccupancy: 1,
    isAc: false,
    amenities: ['Free Wi-Fi', 'TV', 'Hot Water', 'Work Desk'],
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
  },
  {
    _id: 'rt_2',
    name: 'Premium Double Non A/C',
    code: 'PREM_DBL_NONAC',
    description: 'Spacious double occupancy non-A/C room with plush bedding and modern bathroom.',
    basePrice: 1600,
    cpPrice: 1800,
    maxOccupancy: 2,
    isAc: false,
    amenities: ['Free Wi-Fi', 'LED TV', '24/7 Hot Water', 'Daily Housekeeping'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
  },
  {
    _id: 'rt_3',
    name: 'Executive Single A/C',
    code: 'EXEC_SGL_AC',
    description: 'Elegant single room with climate control A/C, ergonomic desk, and premium bath accessories.',
    basePrice: 1800,
    cpPrice: 2000,
    maxOccupancy: 1,
    isAc: true,
    amenities: ['Air Conditioning', 'High Speed Wi-Fi', 'Smart TV', 'Room Service'],
    images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'],
  },
  {
    _id: 'rt_4',
    name: 'Executive Double A/C',
    code: 'EXEC_DBL_AC',
    description: 'Luxurious double A/C room equipped with king-size bed, seating area, and room dining.',
    basePrice: 2200,
    cpPrice: 2500,
    maxOccupancy: 2,
    isAc: true,
    amenities: ['Air Conditioning', 'King Bed', 'Tea/Coffee Maker', 'Minibar', 'Smart TV'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
  },
  {
    _id: 'rt_5',
    name: 'Triple Occupancy Premium',
    code: 'TRIPLE_PREM',
    description: 'Generous room designed for families or small groups with 3 comfortable single beds.',
    basePrice: 2400,
    cpPrice: 2750,
    maxOccupancy: 3,
    isAc: false,
    amenities: ['3 Single Beds', 'Free Wi-Fi', 'Spacious Wardrobe', 'Bottled Water'],
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'],
  },
  {
    _id: 'rt_6',
    name: 'Triple Occupancy Executive A/C',
    code: 'TRIPLE_EXEC',
    description: 'Air-conditioned family room featuring premium bedding, extra seating, and deluxe amenities.',
    basePrice: 2800,
    cpPrice: 3200,
    maxOccupancy: 3,
    isAc: true,
    amenities: ['Air Conditioning', '3 Beds', 'Smart TV', 'Tea/Coffee Station'],
    images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'],
  },
  {
    _id: 'rt_7',
    name: 'Suite Room',
    code: 'SUITE_ROOM',
    description: 'Presidential suite with separate living lounge, master bedroom, luxury bathtub, and VIP service.',
    basePrice: 3500,
    cpPrice: 4000,
    maxOccupancy: 4,
    isAc: true,
    amenities: ['Living Room Lounge', 'Jacuzzi / Bathtub', 'Fruit Basket', 'Express Check-in', 'Premium A/C'],
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'],
  },
];

// Generate Rooms 1 to 40 + Sambhrama Party Hall
export const FALLBACK_ROOMS = (() => {
  const rooms: any[] = [];
  const typeMapping = [
    FALLBACK_ROOM_TYPES[0],
    FALLBACK_ROOM_TYPES[1],
    FALLBACK_ROOM_TYPES[2],
    FALLBACK_ROOM_TYPES[3],
    FALLBACK_ROOM_TYPES[4],
    FALLBACK_ROOM_TYPES[5],
    FALLBACK_ROOM_TYPES[6],
  ];

  for (let i = 1; i <= 40; i++) {
    const typeObj = typeMapping[(i - 1) % typeMapping.length];
    rooms.push({
      _id: `room_${i}`,
      roomNumber: `${i}`,
      floor: i <= 20 ? 1 : 2,
      status: 'AVAILABLE',
      qrToken: `qr_token_room_${i}`,
      roomTypeId: {
        _id: typeObj._id,
        name: typeObj.name,
      },
    });
  }

  rooms.push({
    _id: 'room_party_hall',
    roomNumber: 'Sambhrama Party Hall',
    floor: 1,
    status: 'AVAILABLE',
    qrToken: 'qr_token_party_hall',
    roomTypeId: {
      _id: 'rt_7',
      name: 'Grand Sambhrama Party Hall',
    },
  });

  return rooms;
})();

export const FALLBACK_MENU_CATEGORIES = [
  // SWAAD RESTAURANT
  { _id: 'cat_swaad_1', name: 'South Indian Specials', section: 'SWAAD', sortOrder: 1 },
  { _id: 'cat_swaad_2', name: 'Dosa Specialities', section: 'SWAAD', sortOrder: 2 },
  { _id: 'cat_swaad_3', name: 'North Pulav & Biriyani', section: 'SWAAD', sortOrder: 3 },
  { _id: 'cat_swaad_4', name: 'Vegetable Curries & Dal', section: 'SWAAD', sortOrder: 4 },
  { _id: 'cat_swaad_5', name: 'Non-Veg Specialities', section: 'SWAAD', sortOrder: 5 },
  { _id: 'cat_swaad_6', name: 'Tandoor Breads', section: 'SWAAD', sortOrder: 6 },
  { _id: 'cat_swaad_7', name: 'Chinese Corner', section: 'SWAAD', sortOrder: 7 },
  { _id: 'cat_swaad_8', name: 'Desserts & Beverages', section: 'SWAAD', sortOrder: 8 },

  // LIQUID LOUNGE BAR
  { _id: 'cat_llb_1', name: 'Premium Whisky', section: 'LIQUID_LOUNGE', sortOrder: 1 },
  { _id: 'cat_llb_2', name: 'Brandy', section: 'LIQUID_LOUNGE', sortOrder: 2 },
  { _id: 'cat_llb_3', name: 'Beer', section: 'LIQUID_LOUNGE', sortOrder: 3 },
  { _id: 'cat_llb_4', name: 'Cocktails & Mocktails', section: 'LIQUID_LOUNGE', sortOrder: 4 },
  { _id: 'cat_llb_5', name: 'Scotch & Single Malt', section: 'LIQUID_LOUNGE', sortOrder: 5 },
];

export const FALLBACK_MENU_ITEMS = [
  // --- SWAAD RESTAURANT ---
  // South Indian
  { _id: 'item_s1', name: 'Single Idli / Vada', categoryId: 'cat_swaad_1', section: 'SWAAD', price: 40, isVeg: true },
  { _id: 'item_s2', name: 'Plain Dosa', categoryId: 'cat_swaad_1', section: 'SWAAD', price: 65, isVeg: true },
  { _id: 'item_s3', name: 'Masala Dosa', categoryId: 'cat_swaad_1', section: 'SWAAD', price: 75, isVeg: true },
  { _id: 'item_s4', name: 'Set Dosa', categoryId: 'cat_swaad_1', section: 'SWAAD', price: 75, isVeg: true },
  { _id: 'item_s5', name: 'Rava Dosa', categoryId: 'cat_swaad_1', section: 'SWAAD', price: 80, isVeg: true },
  { _id: 'item_s6', name: 'Onion Rava Dosa', categoryId: 'cat_swaad_1', section: 'SWAAD', price: 90, isVeg: true },
  { _id: 'item_s7', name: 'Akki Roti (2 Pcs)', categoryId: 'cat_swaad_1', section: 'SWAAD', price: 85, isVeg: true },
  { _id: 'item_s8', name: 'Puri Bhaji', categoryId: 'cat_swaad_1', section: 'SWAAD', price: 70, isVeg: true },
  { _id: 'item_s9', name: 'South Indian Meals', categoryId: 'cat_swaad_1', section: 'SWAAD', price: 125, description: 'Traditional meal with rice, sambar, rasam, palya, papad & curd', isVeg: true, featured: true },

  // Dosa Specialities
  { _id: 'item_s10', name: 'Cheese Masala Dosa', categoryId: 'cat_swaad_2', section: 'SWAAD', price: 110, isVeg: true },
  { _id: 'item_s11', name: 'Paneer Dosa', categoryId: 'cat_swaad_2', section: 'SWAAD', price: 115, isVeg: true },
  { _id: 'item_s12', name: 'Open Butter Masala Dosa', categoryId: 'cat_swaad_2', section: 'SWAAD', price: 95, isVeg: true },

  // North Indian & Biryani
  { _id: 'item_s13', name: 'Veg. Biryani', categoryId: 'cat_swaad_3', section: 'SWAAD', price: 160, isVeg: true },
  { _id: 'item_s14', name: 'Mugalai Biryani', categoryId: 'cat_swaad_3', section: 'SWAAD', price: 170, isVeg: true, featured: true },
  { _id: 'item_s15', name: 'Veg Handi Biryani', categoryId: 'cat_swaad_3', section: 'SWAAD', price: 170, isVeg: true },
  { _id: 'item_s16', name: 'Veg. Hydrabadhi Biryani', categoryId: 'cat_swaad_3', section: 'SWAAD', price: 170, isVeg: true },
  { _id: 'item_s17', name: 'Veg. Pulav', categoryId: 'cat_swaad_3', section: 'SWAAD', price: 160, isVeg: true },
  { _id: 'item_s18', name: 'Peas Pulav', categoryId: 'cat_swaad_3', section: 'SWAAD', price: 160, isVeg: true },
  { _id: 'item_s19', name: 'Dal Kichadi', categoryId: 'cat_swaad_3', section: 'SWAAD', price: 130, isVeg: true },
  { _id: 'item_s20', name: 'North Indian Meals', categoryId: 'cat_swaad_3', section: 'SWAAD', price: 160, isVeg: true, featured: true },

  // Curries & Dal
  { _id: 'item_s21', name: 'Dal Fry', categoryId: 'cat_swaad_4', section: 'SWAAD', price: 120, isVeg: true },
  { _id: 'item_s22', name: 'Dal Tadka', categoryId: 'cat_swaad_4', section: 'SWAAD', price: 130, isVeg: true },
  { _id: 'item_s23', name: 'Paneer Butter Masala', categoryId: 'cat_swaad_4', section: 'SWAAD', price: 185, isVeg: true, featured: true },
  { _id: 'item_s24', name: 'Kadai Paneer', categoryId: 'cat_swaad_4', section: 'SWAAD', price: 185, isVeg: true },
  { _id: 'item_s25', name: 'Mushroom Masala', categoryId: 'cat_swaad_4', section: 'SWAAD', price: 180, isVeg: true },
  { _id: 'item_s26', name: 'Paneer Tikka Masala', categoryId: 'cat_swaad_4', section: 'SWAAD', price: 200, isVeg: true },
  { _id: 'item_s27', name: 'Kaju Masala', categoryId: 'cat_swaad_4', section: 'SWAAD', price: 220, isVeg: true },

  // Non-Veg Section
  { _id: 'item_s28', name: 'Chicken Biryani', categoryId: 'cat_swaad_5', section: 'SWAAD', price: 220, description: 'Flavorful aromatic Dum Chicken Biryani served with raita', isVeg: false, featured: true },
  { _id: 'item_s29', name: 'Chicken Sukka', categoryId: 'cat_swaad_5', section: 'SWAAD', price: 240, description: 'Traditional coastal spicy dry roasted chicken', isVeg: false },
  { _id: 'item_s30', name: 'Chicken Tikka Masala', categoryId: 'cat_swaad_5', section: 'SWAAD', price: 250, description: 'Tandoori chicken pieces cooked in rich tomato gravy', isVeg: false },
  { _id: 'item_s31', name: 'Chicken Butter Masala', categoryId: 'cat_swaad_5', section: 'SWAAD', price: 260, description: 'Tender chicken cooked in creamy tomato butter sauce', isVeg: false, featured: true },
  { _id: 'item_s32', name: 'Mutton Curry', categoryId: 'cat_swaad_5', section: 'SWAAD', price: 320, description: 'Succulent mutton slow-cooked in traditional Indian spices', isVeg: false },
  { _id: 'item_s33', name: 'Mutton Biryani', categoryId: 'cat_swaad_5', section: 'SWAAD', price: 340, description: 'Rich Dum Mutton Biryani with tender meat pieces', isVeg: false },
  { _id: 'item_s34', name: 'Fish Tawa Fry', categoryId: 'cat_swaad_5', section: 'SWAAD', price: 280, description: 'Fresh local catch marinated in coastal spices & tawa fried', isVeg: false },
  { _id: 'item_s35', name: 'Egg Masala Curry', categoryId: 'cat_swaad_5', section: 'SWAAD', price: 160, description: 'Hard-boiled eggs simmered in spicy onion tomato gravy', isVeg: false },
  { _id: 'item_s36', name: 'Egg Fried Rice', categoryId: 'cat_swaad_5', section: 'SWAAD', price: 160, description: 'Wok-tossed rice with scrambled eggs and veggies', isVeg: false },
  { _id: 'item_s37', name: 'Chicken Chilli (Dry / Gravy)', categoryId: 'cat_swaad_5', section: 'SWAAD', price: 220, description: 'Indo-Chinese style crispy chicken with capsicum & chilli', isVeg: false },

  // Tandoor Breads
  { _id: 'item_s38', name: 'Roti', categoryId: 'cat_swaad_6', section: 'SWAAD', price: 35, isVeg: true },
  { _id: 'item_s39', name: 'Butter Roti', categoryId: 'cat_swaad_6', section: 'SWAAD', price: 40, isVeg: true },
  { _id: 'item_s40', name: 'Naan', categoryId: 'cat_swaad_6', section: 'SWAAD', price: 45, isVeg: true },
  { _id: 'item_s41', name: 'Butter Naan', categoryId: 'cat_swaad_6', section: 'SWAAD', price: 50, isVeg: true },
  { _id: 'item_s42', name: 'Garlic Naan', categoryId: 'cat_swaad_6', section: 'SWAAD', price: 70, isVeg: true },
  { _id: 'item_s43', name: 'ROTI BASKET (Butter)', categoryId: 'cat_swaad_6', section: 'SWAAD', price: 165, description: 'Assorted basket with 1 Roti, 1 Naan, 1 Kulcha, 1 Parota', isVeg: true, featured: true },

  // Chinese Corner
  { _id: 'item_s44', name: 'Veg. Fried Rice', categoryId: 'cat_swaad_7', section: 'SWAAD', price: 150, isVeg: true },
  { _id: 'item_s45', name: 'Schezwan Fried Rice', categoryId: 'cat_swaad_7', section: 'SWAAD', price: 160, isVeg: true },
  { _id: 'item_s46', name: 'Gobi Manchurian', categoryId: 'cat_swaad_7', section: 'SWAAD', price: 140, isVeg: true },
  { _id: 'item_s47', name: 'Paneer Manchurian', categoryId: 'cat_swaad_7', section: 'SWAAD', price: 170, isVeg: true },
  { _id: 'item_s48', name: 'Baby Corn Manchurian', categoryId: 'cat_swaad_7', section: 'SWAAD', price: 160, isVeg: true },

  // Desserts & Beverages
  { _id: 'item_s49', name: 'Fruit Salad with Ice Cream', categoryId: 'cat_swaad_8', section: 'SWAAD', price: 90, isVeg: true },
  { _id: 'item_s50', name: 'Gulab Jamun (2 Pcs)', categoryId: 'cat_swaad_8', section: 'SWAAD', price: 50, isVeg: true },
  { _id: 'item_s51', name: 'Filter Coffee', categoryId: 'cat_swaad_8', section: 'SWAAD', price: 30, isVeg: true },
  { _id: 'item_s52', name: 'Masala Tea', categoryId: 'cat_swaad_8', section: 'SWAAD', price: 25, isVeg: true },

  // --- LIQUID LOUNGE BAR ---
  // Whisky
  { _id: 'item_l1', name: 'Imperial Blue', categoryId: 'cat_llb_1', section: 'LIQUID_LOUNGE', price: 90, price60ml: 160, isVeg: true },
  { _id: 'item_l2', name: "McDowell's No.1 Whisky", categoryId: 'cat_llb_1', section: 'LIQUID_LOUNGE', price: 90, price60ml: 160, isVeg: true },
  { _id: 'item_l3', name: 'Royal Stag', categoryId: 'cat_llb_1', section: 'LIQUID_LOUNGE', price: 125, price60ml: 210, isVeg: true },
  { _id: 'item_l4', name: 'Signature Rare', categoryId: 'cat_llb_1', section: 'LIQUID_LOUNGE', price: 150, price60ml: 285, isVeg: true },
  { _id: 'item_l5', name: 'Antiquity Blue', categoryId: 'cat_llb_1', section: 'LIQUID_LOUNGE', price: 150, price60ml: 285, isVeg: true },
  { _id: 'item_l6', name: 'Blenders Pride', categoryId: 'cat_llb_1', section: 'LIQUID_LOUNGE', price: 150, price60ml: 285, isVeg: true, featured: true },
  { _id: 'item_l7', name: 'Signature Premium', categoryId: 'cat_llb_1', section: 'LIQUID_LOUNGE', price: 160, price60ml: 300, isVeg: true },

  // Brandy
  { _id: 'item_l8', name: "McDowell's Brandy", categoryId: 'cat_llb_2', section: 'LIQUID_LOUNGE', price: 85, price60ml: 150, isVeg: true },
  { _id: 'item_l9', name: 'Mansion House Brandy', categoryId: 'cat_llb_2', section: 'LIQUID_LOUNGE', price: 85, price60ml: 150, isVeg: true },
  { _id: 'item_l10', name: 'Morpheus Brandy Blue', categoryId: 'cat_llb_2', section: 'LIQUID_LOUNGE', price: 175, price60ml: 350, isVeg: true },

  // Beer
  { _id: 'item_l11', name: 'Kingfisher Ultra (650ml)', categoryId: 'cat_llb_3', section: 'LIQUID_LOUNGE', price: 300, isVeg: true, featured: true },
  { _id: 'item_l12', name: 'Budweiser Premium (650ml)', categoryId: 'cat_llb_3', section: 'LIQUID_LOUNGE', price: 300, isVeg: true },
  { _id: 'item_l13', name: 'Budweiser Magnum (650ml)', categoryId: 'cat_llb_3', section: 'LIQUID_LOUNGE', price: 320, isVeg: true },
  { _id: 'item_l14', name: 'Carlsberg Strong (650ml)', categoryId: 'cat_llb_3', section: 'LIQUID_LOUNGE', price: 320, isVeg: true },
  { _id: 'item_l15', name: 'Kingfisher Pint (330ml)', categoryId: 'cat_llb_3', section: 'LIQUID_LOUNGE', price: 160, isVeg: true },

  // Cocktails & Mocktails
  { _id: 'item_l16', name: 'Virgin Mojito', categoryId: 'cat_llb_4', section: 'LIQUID_LOUNGE', price: 200, description: 'Mint, lime, sugar & sparkling soda', isVeg: true },
  { _id: 'item_l17', name: 'Fruit Punch Mocktail', categoryId: 'cat_llb_4', section: 'LIQUID_LOUNGE', price: 180, description: 'Blend of tropical fruit juices with vanilla cream', isVeg: true },
  { _id: 'item_l18', name: 'Mojito (Rum Based)', categoryId: 'cat_llb_4', section: 'LIQUID_LOUNGE', price: 325, description: 'Classic Bacardi rum with fresh mint & lime', isVeg: true, featured: true },
  { _id: 'item_l19', name: 'Blue Lagoon Cocktail', categoryId: 'cat_llb_4', section: 'LIQUID_LOUNGE', price: 325, description: 'Vodka, blue curacao & lemonade', isVeg: true },

  // Scotch & Single Malt
  { _id: 'item_l20', name: 'Black Dog Regular', categoryId: 'cat_llb_5', section: 'LIQUID_LOUNGE', price: 185, price60ml: 350, isVeg: true },
  { _id: 'item_l21', name: 'VAT 69', categoryId: 'cat_llb_5', section: 'LIQUID_LOUNGE', price: 185, price60ml: 350, isVeg: true },
  { _id: 'item_l22', name: "Teacher's 50", categoryId: 'cat_llb_5', section: 'LIQUID_LOUNGE', price: 300, price60ml: 550, isVeg: true },
  { _id: 'item_l23', name: 'Johnnie Walker Red Label', categoryId: 'cat_llb_5', section: 'LIQUID_LOUNGE', price: 285, price60ml: 550, isVeg: true },
  { _id: 'item_l24', name: 'Johnnie Walker Black Label', categoryId: 'cat_llb_5', section: 'LIQUID_LOUNGE', price: 475, price60ml: 900, isVeg: true, featured: true },
  { _id: 'item_l25', name: 'Amrut Indian Single Malt', categoryId: 'cat_llb_5', section: 'LIQUID_LOUNGE', price: 285, price60ml: 550, isVeg: true, featured: true },
];

export const FALLBACK_PARTY_PACKAGES = [
  {
    _id: 'pkg_1',
    name: 'Choice of Veg Menu',
    price: 450,
    description: 'Welcome drink, Kosambari, Palya, Payasa, 1 Fried item, 1 Poori/Akki Roti/Dosa/Pulao, Rice, Sambar, Rasam, Curds, Papad, Pickle & Dessert (+GST)',
    isVeg: true,
    featured: true,
  },
  {
    _id: 'pkg_2',
    name: 'Choice of 2 Veg Menu',
    price: 500,
    description: 'Welcome drink, Veg Soup, Kosambari, 1 Fried item, 1 Poori/Akki Roti/Dosa, 1 Pulao/Biriyani, Rice, Sambar, Rasam, Curds, Papad, Pickle & Dessert (+GST)',
    isVeg: true,
    featured: true,
  },
  {
    _id: 'pkg_3',
    name: 'Multiple Cuisine Menu',
    price: 550,
    description: 'Welcome drink, Veg Soup, 2 Salads, 1 Veg starter, 1 Main course, 1 Dal, 2 Breads, 1 Pulao/Biriyani, Rice, Sweet, Sambar, Rasam, Curds, Papad, Pickle & Dessert (+GST)',
    isVeg: true,
    featured: true,
  },
];

export const FALLBACK_ATTRACTIONS = [
  {
    _id: 'attr_1',
    name: 'Chennakeshava Temple, Belur',
    category: 'Hoysala Heritage',
    distance: '38 km',
    image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80',
    description: 'Famous 12th-century Hoysala temple renowned for intricate stone carvings and architecture.',
    sortOrder: 1,
  },
  {
    _id: 'attr_2',
    name: 'Hoysaleswara Temple, Halebidu',
    category: 'Hoysala Heritage',
    distance: '31 km',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    description: 'Twin-temple complex dedicated to Shiva, showcasing breathtaking stone sculptures.',
    sortOrder: 2,
  },
  {
    _id: 'attr_3',
    name: 'Shravanabelagola (Gommateshwara)',
    category: 'Pilgrimage',
    distance: '52 km',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    description: 'Home to the magnificent 57-foot monolithic statue of Lord Bahubali atop Vindhyagiri Hill.',
    sortOrder: 3,
  },
  {
    _id: 'attr_4',
    name: 'Manjarabad Fort, Sakleshpur',
    category: 'History & Forts',
    distance: '40 km',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    description: 'Star-shaped fort built by Tipu Sultan offering panoramic views of the Western Ghats.',
    sortOrder: 4,
  },
  {
    _id: 'attr_5',
    name: 'Shettihalli Rosary Church',
    category: 'Historic Ruins',
    distance: '22 km',
    image: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=800&q=80',
    description: 'Submerged Gothic church ruins built in 1860, famous for its surreal monsoon landscape.',
    sortOrder: 5,
  },
  {
    _id: 'attr_6',
    name: 'Bisle Ghat Viewpoint',
    category: 'Nature & Trekking',
    distance: '85 km',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Spectacular mountain outlook providing sweeping vistas of three mountain ranges.',
    sortOrder: 6,
  },
];

export const mockCalculateAvailability = (payload: any) => {
  const room = FALLBACK_ROOM_TYPES.find((r) => r._id === payload.roomTypeId) || FALLBACK_ROOM_TYPES[0];
  const numNights = 1;
  const baseRate = payload.planType === 'CP' ? (room.cpPrice || room.basePrice + 150) : room.basePrice;
  const roomTotal = baseRate * numNights;
  
  let mealPlanTotal = 0;
  if (payload.mealSelection?.breakfast) mealPlanTotal += 150 * (payload.numGuests || 1) * numNights;
  if (payload.mealSelection?.lunch) mealPlanTotal += 250 * (payload.numGuests || 1) * numNights;
  if (payload.mealSelection?.dinner) mealPlanTotal += 300 * (payload.numGuests || 1) * numNights;

  let discountAmount = 0;
  if (payload.couponCode === 'WELCOME10') {
    discountAmount = Math.min(Math.round((roomTotal + mealPlanTotal) * 0.1), 500);
  } else if (payload.couponCode === 'RAAMA100') {
    discountAmount = 100;
  }

  const taxableAmount = Math.max(0, roomTotal + mealPlanTotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.12);
  const totalAmount = taxableAmount + taxAmount;

  return {
    availability: { isAvailable: true },
    pricing: {
      numNights,
      roomPricePerNight: baseRate,
      roomTotal,
      mealPlanTotal,
      couponCode: payload.couponCode || '',
      discountAmount,
      taxAmount,
      totalAmount,
    },
  };
};

export const mockCreateBooking = (payload: any) => {
  const calc = mockCalculateAvailability(payload);
  const bookingId = `BK${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingToken = `TRK-${Date.now()}`;
  return {
    bookingId,
    trackingToken,
    totalAmount: calc.pricing.totalAmount,
    razorpayOrderId: `order_mock_${Date.now()}`,
    razorpayKeyId: 'rzp_test_mockkey',
  };
};

export const mockCreateOrder = (payload: any) => {
  const orderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingToken = `ORDTRK-${Date.now()}`;
  const totalAmount = payload.items?.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0) || 350;
  return {
    orderId,
    trackingToken,
    totalAmount,
    razorpayOrderId: `order_mock_${Date.now()}`,
    razorpayKeyId: 'rzp_test_mockkey',
  };
};

export const mockAdminMetrics = {
  totalRooms: 40,
  occupiedRooms: 18,
  reservedRooms: 8,
  availableRooms: 14,
  occupancyRate: 65,
  pendingOrdersCount: 4,
  totalConfirmedBookings: 26,
  totalCombinedRevenue: 148500,
  revenueChart: [
    { month: 'Jan', revenue: 95000 },
    { month: 'Feb', revenue: 110000 },
    { month: 'Mar', revenue: 125000 },
    { month: 'Apr', revenue: 140000 },
    { month: 'May', revenue: 165000 },
    { month: 'Jun', revenue: 148500 },
  ],
};
