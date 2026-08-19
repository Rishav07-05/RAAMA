"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const Admin_1 = require("../models/Admin");
const HotelSetting_1 = require("../models/HotelSetting");
const MealPlan_1 = require("../models/MealPlan");
const Coupon_1 = require("../models/Coupon");
const Attraction_1 = require("../models/Attraction");
const RoomType_1 = require("../models/RoomType");
const Room_1 = require("../models/Room");
const MenuCategory_1 = require("../models/MenuCategory");
const MenuItem_1 = require("../models/MenuItem");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_raama';
const generateQrToken = (roomNum) => {
    const hash = crypto_1.default.createHash('sha256').update(`hotel_raama_room_${roomNum}_${Date.now()}_${Math.random()}`).digest('hex');
    return hash.substring(0, 16);
};
const seed = async () => {
    try {
        console.log('Connecting to MongoDB for seeding...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected!');
        // 1. Clear existing data
        console.log('Clearing existing collections...');
        await Admin_1.Admin.deleteMany({});
        await HotelSetting_1.HotelSetting.deleteMany({});
        await MealPlan_1.MealPlan.deleteMany({});
        await Coupon_1.Coupon.deleteMany({});
        await Attraction_1.Attraction.deleteMany({});
        await RoomType_1.RoomType.deleteMany({});
        await Room_1.Room.deleteMany({});
        await MenuCategory_1.MenuCategory.deleteMany({});
        await MenuItem_1.MenuItem.deleteMany({});
        // 2. Admin User
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@hotelraama.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'AdminRaama@2026';
        const passwordHash = await bcryptjs_1.default.hash(adminPassword, 10);
        await Admin_1.Admin.create({
            email: adminEmail,
            passwordHash,
            name: 'Hotel Raama Admin',
            role: 'ADMIN',
        });
        console.log(`✓ Admin user created: ${adminEmail}`);
        // 3. Hotel Settings
        await HotelSetting_1.HotelSetting.create({
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
        });
        console.log('✓ Hotel settings created');
        // 4. Meal Plans
        await MealPlan_1.MealPlan.create([
            { name: 'Buffet Breakfast', type: 'BREAKFAST', pricePerPersonPerNight: 150, description: 'Fresh South Indian & Continental breakfast spread' },
            { name: 'Executive Lunch', type: 'LUNCH', pricePerPersonPerNight: 250, description: 'Traditional South/North Indian Thali lunch' },
            { name: 'Royal Dinner', type: 'DINNER', pricePerPersonPerNight: 300, description: 'Gourmet dinner buffet at Swaad restaurant' },
        ]);
        console.log('✓ Meal plans created');
        // 5. Coupons
        const now = new Date();
        const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        await Coupon_1.Coupon.create([
            { code: 'WELCOME10', discountType: 'PERCENTAGE', discountValue: 10, minBookingAmount: 1000, maxDiscountAmount: 500, startDate: now, endDate: nextYear, maxUsage: 500 },
            { code: 'RAAMA100', discountType: 'FLAT', discountValue: 100, minBookingAmount: 500, startDate: now, endDate: nextYear, maxUsage: 1000 },
        ]);
        console.log('✓ Initial coupons created');
        // 6. Attractions
        await Attraction_1.Attraction.create([
            { name: 'Chennakeshava Temple, Belur', category: 'Hoysala Heritage', distance: '38 km', image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80', description: 'Famous 12th-century Hoysala temple renowned for intricate stone carvings and architecture.', sortOrder: 1 },
            { name: 'Hoysaleswara Temple, Halebidu', category: 'Hoysala Heritage', distance: '31 km', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80', description: 'Twin-temple complex dedicated to Shiva, showcasing breathtaking stone sculptures.', sortOrder: 2 },
            { name: 'Shravanabelagola (Gommateshwara)', category: 'Pilgrimage', distance: '52 km', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', description: 'Home to the magnificent 57-foot monolithic statue of Lord Bahubali atop Vindhyagiri Hill.', sortOrder: 3 },
            { name: 'Manjarabad Fort, Sakleshpur', category: 'History & Forts', distance: '40 km', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', description: 'Star-shaped fort built by Tipu Sultan offering panoramic views of the Western Ghats.', sortOrder: 4 },
            { name: 'Shettihalli Rosary Church', category: 'Historic Ruins', distance: '22 km', image: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=800&q=80', description: 'Submerged Gothic church ruins built in 1860, famous for its surreal monsoon landscape.', sortOrder: 5 },
            { name: 'Bisle Ghat Viewpoint', category: 'Nature & Trekking', distance: '85 km', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', description: 'Spectacular mountain outlook providing sweeping vistas of three mountain ranges.', sortOrder: 6 },
        ]);
        console.log('✓ Hassan attractions created');
        // 7. Room Types & 40 Rooms (1 to 40) + 1 Sambhrama Party Hall
        const roomTypesData = [
            { name: 'Premium Single Non A/C', code: 'PREM_SGL_NONAC', description: 'Comfortable single occupancy non-A/C room with queen bed, Wi-Fi, and city views.', basePrice: 1200, cpPrice: 1350, maxOccupancy: 1, isAc: false, amenities: ['Free Wi-Fi', 'TV', 'Hot Water', 'Work Desk'], images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Premium Double Non A/C', code: 'PREM_DBL_NONAC', description: 'Spacious double occupancy non-A/C room with plush bedding and modern bathroom.', basePrice: 1600, cpPrice: 1800, maxOccupancy: 2, isAc: false, amenities: ['Free Wi-Fi', 'LED TV', '24/7 Hot Water', 'Daily Housekeeping'], images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Executive Single A/C', code: 'EXEC_SGL_AC', description: 'Elegant single room with climate control A/C, ergonomic desk, and premium bath accessories.', basePrice: 1800, cpPrice: 2000, maxOccupancy: 1, isAc: true, amenities: ['Air Conditioning', 'High Speed Wi-Fi', 'Smart TV', 'Room Service'], images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Executive Double A/C', code: 'EXEC_DBL_AC', description: 'Luxurious double A/C room equipped with king-size bed, seating area, and room dining.', basePrice: 2200, cpPrice: 2500, maxOccupancy: 2, isAc: true, amenities: ['Air Conditioning', 'King Bed', 'Tea/Coffee Maker', 'Minibar', 'Smart TV'], images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Triple Occupancy Premium', code: 'TRIPLE_PREM', description: 'Generous room designed for families or small groups with 3 comfortable single beds.', basePrice: 2400, cpPrice: 2750, maxOccupancy: 3, isAc: false, amenities: ['3 Single Beds', 'Free Wi-Fi', 'Spacious Wardrobe', 'Bottled Water'], images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Triple Occupancy Executive A/C', code: 'TRIPLE_EXEC', description: 'Air-conditioned family room featuring premium bedding, extra seating, and deluxe amenities.', basePrice: 2800, cpPrice: 3200, maxOccupancy: 3, isAc: true, amenities: ['Air Conditioning', '3 Beds', 'Smart TV', 'Tea/Coffee Station'], images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Suite Room', code: 'SUITE_ROOM', description: 'Presidential suite with separate living lounge, master bedroom, luxury bathtub, and VIP service.', basePrice: 3500, cpPrice: 4000, maxOccupancy: 4, isAc: true, amenities: ['Living Room Lounge', 'Jacuzzi / Bathtub', 'Fruit Basket', 'Express Check-in', 'Premium A/C'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'] },
        ];
        const createdRoomTypes = await RoomType_1.RoomType.create(roomTypesData);
        console.log(`✓ ${createdRoomTypes.length} room types created`);
        // Create 40 rooms (numbered 1 to 40) + 1 Sambhrama Party Hall
        const roomsToSeed = [];
        const rtMap = new Map(createdRoomTypes.map(rt => [rt.code, rt._id]));
        const typeCodes = ['PREM_SGL_NONAC', 'PREM_DBL_NONAC', 'EXEC_SGL_AC', 'EXEC_DBL_AC', 'TRIPLE_PREM', 'TRIPLE_EXEC', 'SUITE_ROOM'];
        for (let i = 1; i <= 40; i++) {
            const roomNum = `${i}`;
            const code = typeCodes[(i - 1) % typeCodes.length];
            const floor = i <= 20 ? 1 : 2;
            roomsToSeed.push({
                roomNumber: roomNum,
                roomTypeId: rtMap.get(code),
                floor,
                status: 'AVAILABLE',
                qrToken: generateQrToken(roomNum),
            });
        }
        // Add Sambhrama Party Hall QR
        roomsToSeed.push({
            roomNumber: 'Sambhrama Party Hall',
            roomTypeId: rtMap.get('SUITE_ROOM'),
            floor: 1,
            status: 'AVAILABLE',
            qrToken: generateQrToken('SambhramaPartyHall'),
        });
        const createdRooms = await Room_1.Room.create(roomsToSeed);
        console.log(`✓ ${createdRooms.length} rooms created (40 rooms numbered 1-40 + 1 Sambhrama Party Hall with unique QR tokens)`);
        // 8. Menu Categories & Items
        // --- SWAAD RESTAURANT ---
        const swaadSouthCategory = await MenuCategory_1.MenuCategory.create({ name: 'South Indian Specials', section: 'SWAAD', sortOrder: 1 });
        const swaadDosaCategory = await MenuCategory_1.MenuCategory.create({ name: 'Dosa Specialities', section: 'SWAAD', sortOrder: 2 });
        const swaadNorthCategory = await MenuCategory_1.MenuCategory.create({ name: 'North Pulav & Biriyani', section: 'SWAAD', sortOrder: 3 });
        const swaadCurryCategory = await MenuCategory_1.MenuCategory.create({ name: 'Vegetable Curries & Dal', section: 'SWAAD', sortOrder: 4 });
        const swaadNonVegCategory = await MenuCategory_1.MenuCategory.create({ name: 'Non-Veg Specialities', section: 'SWAAD', sortOrder: 5 });
        const swaadBreadCategory = await MenuCategory_1.MenuCategory.create({ name: 'Tandoor Breads', section: 'SWAAD', sortOrder: 6 });
        const swaadChineseCategory = await MenuCategory_1.MenuCategory.create({ name: 'Chinese Corner', section: 'SWAAD', sortOrder: 7 });
        const swaadDessertCategory = await MenuCategory_1.MenuCategory.create({ name: 'Desserts & Beverages', section: 'SWAAD', sortOrder: 8 });
        const swaadItems = [
            // South Indian
            { name: 'Single Idli / Vada', categoryId: swaadSouthCategory._id, section: 'SWAAD', price: 40, isVeg: true },
            { name: 'Plain Dosa', categoryId: swaadSouthCategory._id, section: 'SWAAD', price: 65, isVeg: true },
            { name: 'Masala Dosa', categoryId: swaadSouthCategory._id, section: 'SWAAD', price: 75, isVeg: true },
            { name: 'Set Dosa', categoryId: swaadSouthCategory._id, section: 'SWAAD', price: 75, isVeg: true },
            { name: 'Rava Dosa', categoryId: swaadSouthCategory._id, section: 'SWAAD', price: 80, isVeg: true },
            { name: 'Onion Rava Dosa', categoryId: swaadSouthCategory._id, section: 'SWAAD', price: 90, isVeg: true },
            { name: 'Akki Roti (2 Pcs)', categoryId: swaadSouthCategory._id, section: 'SWAAD', price: 85, isVeg: true },
            { name: 'Puri Bhaji', categoryId: swaadSouthCategory._id, section: 'SWAAD', price: 70, isVeg: true },
            { name: 'South Indian Meals', categoryId: swaadSouthCategory._id, section: 'SWAAD', price: 125, description: 'Traditional meal with rice, sambar, rasam, palya, papad & curd', isVeg: true, featured: true },
            // Dosa Specialities
            { name: 'Cheese Masala Dosa', categoryId: swaadDosaCategory._id, section: 'SWAAD', price: 110, isVeg: true },
            { name: 'Paneer Dosa', categoryId: swaadDosaCategory._id, section: 'SWAAD', price: 115, isVeg: true },
            { name: 'Open Butter Masala Dosa', categoryId: swaadDosaCategory._id, section: 'SWAAD', price: 95, isVeg: true },
            // North Indian & Biryani
            { name: 'Veg. Biryani', categoryId: swaadNorthCategory._id, section: 'SWAAD', price: 160, isVeg: true },
            { name: 'Mugalai Biryani', categoryId: swaadNorthCategory._id, section: 'SWAAD', price: 170, isVeg: true, featured: true },
            { name: 'Veg Handi Biryani', categoryId: swaadNorthCategory._id, section: 'SWAAD', price: 170, isVeg: true },
            { name: 'Veg. Hydrabadhi Biryani', categoryId: swaadNorthCategory._id, section: 'SWAAD', price: 170, isVeg: true },
            { name: 'Veg. Pulav', categoryId: swaadNorthCategory._id, section: 'SWAAD', price: 160, isVeg: true },
            { name: 'Peas Pulav', categoryId: swaadNorthCategory._id, section: 'SWAAD', price: 160, isVeg: true },
            { name: 'Dal Kichadi', categoryId: swaadNorthCategory._id, section: 'SWAAD', price: 130, isVeg: true },
            { name: 'North Indian Meals', categoryId: swaadNorthCategory._id, section: 'SWAAD', price: 160, isVeg: true, featured: true },
            // Curries & Dal
            { name: 'Dal Fry', categoryId: swaadCurryCategory._id, section: 'SWAAD', price: 120, isVeg: true },
            { name: 'Dal Tadka', categoryId: swaadCurryCategory._id, section: 'SWAAD', price: 130, isVeg: true },
            { name: 'Paneer Butter Masala', categoryId: swaadCurryCategory._id, section: 'SWAAD', price: 185, isVeg: true, featured: true },
            { name: 'Kadai Paneer', categoryId: swaadCurryCategory._id, section: 'SWAAD', price: 185, isVeg: true },
            { name: 'Mushroom Masala', categoryId: swaadCurryCategory._id, section: 'SWAAD', price: 180, isVeg: true },
            { name: 'Paneer Tikka Masala', categoryId: swaadCurryCategory._id, section: 'SWAAD', price: 200, isVeg: true },
            { name: 'Kaju Masala', categoryId: swaadCurryCategory._id, section: 'SWAAD', price: 220, isVeg: true },
            // Non-Veg Section
            { name: 'Chicken Biryani', categoryId: swaadNonVegCategory._id, section: 'SWAAD', price: 220, description: 'Flavorful aromatic Dum Chicken Biryani served with raita', isVeg: false, featured: true },
            { name: 'Chicken Sukka', categoryId: swaadNonVegCategory._id, section: 'SWAAD', price: 240, description: 'Traditional coastal spicy dry roasted chicken', isVeg: false },
            { name: 'Chicken Tikka Masala', categoryId: swaadNonVegCategory._id, section: 'SWAAD', price: 250, description: 'Tandoori chicken pieces cooked in rich tomato gravy', isVeg: false },
            { name: 'Chicken Butter Masala', categoryId: swaadNonVegCategory._id, section: 'SWAAD', price: 260, description: 'Tender chicken cooked in creamy tomato butter sauce', isVeg: false, featured: true },
            { name: 'Mutton Curry', categoryId: swaadNonVegCategory._id, section: 'SWAAD', price: 320, description: 'Succulent mutton slow-cooked in traditional Indian spices', isVeg: false },
            { name: 'Mutton Biryani', categoryId: swaadNonVegCategory._id, section: 'SWAAD', price: 340, description: 'Rich Dum Mutton Biryani with tender meat pieces', isVeg: false },
            { name: 'Fish Tawa Fry', categoryId: swaadNonVegCategory._id, section: 'SWAAD', price: 280, description: 'Fresh local catch marinated in coastal spices & tawa fried', isVeg: false },
            { name: 'Egg Masala Curry', categoryId: swaadNonVegCategory._id, section: 'SWAAD', price: 160, description: 'Hard-boiled eggs simmered in spicy onion tomato gravy', isVeg: false },
            { name: 'Egg Fried Rice', categoryId: swaadNonVegCategory._id, section: 'SWAAD', price: 160, description: 'Wok-tossed rice with scrambled eggs and veggies', isVeg: false },
            { name: 'Chicken Chilli (Dry / Gravy)', categoryId: swaadNonVegCategory._id, section: 'SWAAD', price: 220, description: 'Indo-Chinese style crispy chicken with capsicum & chilli', isVeg: false },
            // Tandoor Breads
            { name: 'Roti', categoryId: swaadBreadCategory._id, section: 'SWAAD', price: 35, isVeg: true },
            { name: 'Butter Roti', categoryId: swaadBreadCategory._id, section: 'SWAAD', price: 40, isVeg: true },
            { name: 'Naan', categoryId: swaadBreadCategory._id, section: 'SWAAD', price: 45, isVeg: true },
            { name: 'Butter Naan', categoryId: swaadBreadCategory._id, section: 'SWAAD', price: 50, isVeg: true },
            { name: 'Garlic Naan', categoryId: swaadBreadCategory._id, section: 'SWAAD', price: 70, isVeg: true },
            { name: 'ROTI BASKET (Butter)', categoryId: swaadBreadCategory._id, section: 'SWAAD', price: 165, description: 'Assorted basket with 1 Roti, 1 Naan, 1 Kulcha, 1 Parota', isVeg: true, featured: true },
            // Chinese Corner
            { name: 'Veg. Fried Rice', categoryId: swaadChineseCategory._id, section: 'SWAAD', price: 150, isVeg: true },
            { name: 'Schezwan Fried Rice', categoryId: swaadChineseCategory._id, section: 'SWAAD', price: 160, isVeg: true },
            { name: 'Gobi Manchurian', categoryId: swaadChineseCategory._id, section: 'SWAAD', price: 140, isVeg: true },
            { name: 'Paneer Manchurian', categoryId: swaadChineseCategory._id, section: 'SWAAD', price: 170, isVeg: true },
            { name: 'Baby Corn Manchurian', categoryId: swaadChineseCategory._id, section: 'SWAAD', price: 160, isVeg: true },
            // Desserts & Beverages
            { name: 'Fruit Salad with Ice Cream', categoryId: swaadDessertCategory._id, section: 'SWAAD', price: 90, isVeg: true },
            { name: 'Gulab Jamun (2 Pcs)', categoryId: swaadDessertCategory._id, section: 'SWAAD', price: 50, isVeg: true },
            { name: 'Filter Coffee', categoryId: swaadDessertCategory._id, section: 'SWAAD', price: 30, isVeg: true },
            { name: 'Masala Tea', categoryId: swaadDessertCategory._id, section: 'SWAAD', price: 25, isVeg: true },
        ];
        await MenuItem_1.MenuItem.create(swaadItems);
        console.log(`✓ ${swaadItems.length} Swaad Restaurant menu items created`);
        // --- LIQUID LOUNGE BAR ---
        const llbWhiskyCategory = await MenuCategory_1.MenuCategory.create({ name: 'Premium Whisky', section: 'LIQUID_LOUNGE', sortOrder: 1 });
        const llbBrandyCategory = await MenuCategory_1.MenuCategory.create({ name: 'Brandy', section: 'LIQUID_LOUNGE', sortOrder: 2 });
        const llbBeerCategory = await MenuCategory_1.MenuCategory.create({ name: 'Beer', section: 'LIQUID_LOUNGE', sortOrder: 3 });
        const llbCocktailCategory = await MenuCategory_1.MenuCategory.create({ name: 'Cocktails & Mocktails', section: 'LIQUID_LOUNGE', sortOrder: 4 });
        const llbScotchCategory = await MenuCategory_1.MenuCategory.create({ name: 'Scotch & Single Malt', section: 'LIQUID_LOUNGE', sortOrder: 5 });
        const llbItems = [
            // Whisky (30ML / 60ML)
            { name: 'Imperial Blue', categoryId: llbWhiskyCategory._id, section: 'LIQUID_LOUNGE', price: 90, price60ml: 160, isVeg: true },
            { name: 'McDowell\'s No.1 Whisky', categoryId: llbWhiskyCategory._id, section: 'LIQUID_LOUNGE', price: 90, price60ml: 160, isVeg: true },
            { name: 'Royal Stag', categoryId: llbWhiskyCategory._id, section: 'LIQUID_LOUNGE', price: 125, price60ml: 210, isVeg: true },
            { name: 'Signature Rare', categoryId: llbWhiskyCategory._id, section: 'LIQUID_LOUNGE', price: 150, price60ml: 285, isVeg: true },
            { name: 'Antiquity Blue', categoryId: llbWhiskyCategory._id, section: 'LIQUID_LOUNGE', price: 150, price60ml: 285, isVeg: true },
            { name: 'Blenders Pride', categoryId: llbWhiskyCategory._id, section: 'LIQUID_LOUNGE', price: 150, price60ml: 285, isVeg: true, featured: true },
            { name: 'Signature Premium', categoryId: llbWhiskyCategory._id, section: 'LIQUID_LOUNGE', price: 160, price60ml: 300, isVeg: true },
            // Brandy
            { name: 'McDowell\'s Brandy', categoryId: llbBrandyCategory._id, section: 'LIQUID_LOUNGE', price: 85, price60ml: 150, isVeg: true },
            { name: 'Mansion House Brandy', categoryId: llbBrandyCategory._id, section: 'LIQUID_LOUNGE', price: 85, price60ml: 150, isVeg: true },
            { name: 'Morpheus Brandy Blue', categoryId: llbBrandyCategory._id, section: 'LIQUID_LOUNGE', price: 175, price60ml: 350, isVeg: true },
            // Beer
            { name: 'Kingfisher Ultra (650ml)', categoryId: llbBeerCategory._id, section: 'LIQUID_LOUNGE', price: 300, isVeg: true, featured: true },
            { name: 'Budweiser Premium (650ml)', categoryId: llbBeerCategory._id, section: 'LIQUID_LOUNGE', price: 300, isVeg: true },
            { name: 'Budweiser Magnum (650ml)', categoryId: llbBeerCategory._id, section: 'LIQUID_LOUNGE', price: 320, isVeg: true },
            { name: 'Carlsberg Strong (650ml)', categoryId: llbBeerCategory._id, section: 'LIQUID_LOUNGE', price: 320, isVeg: true },
            { name: 'Kingfisher Pint (330ml)', categoryId: llbBeerCategory._id, section: 'LIQUID_LOUNGE', price: 160, isVeg: true },
            // Cocktails & Mocktails
            { name: 'Virgin Mojito', categoryId: llbCocktailCategory._id, section: 'LIQUID_LOUNGE', price: 200, description: 'Mint, lime, sugar & sparkling soda', isVeg: true },
            { name: 'Fruit Punch Mocktail', categoryId: llbCocktailCategory._id, section: 'LIQUID_LOUNGE', price: 180, description: 'Blend of tropical fruit juices with vanilla cream', isVeg: true },
            { name: 'Mojito (Rum Based)', categoryId: llbCocktailCategory._id, section: 'LIQUID_LOUNGE', price: 325, description: 'Classic Bacardi rum with fresh mint & lime', isVeg: true, featured: true },
            { name: 'Blue Lagoon Cocktail', categoryId: llbCocktailCategory._id, section: 'LIQUID_LOUNGE', price: 325, description: 'Vodka, blue curacao & lemonade', isVeg: true },
            // Scotch & Single Malt
            { name: 'Black Dog Regular', categoryId: llbScotchCategory._id, section: 'LIQUID_LOUNGE', price: 185, price60ml: 350, isVeg: true },
            { name: 'VAT 69', categoryId: llbScotchCategory._id, section: 'LIQUID_LOUNGE', price: 185, price60ml: 350, isVeg: true },
            { name: 'Teacher\'s 50', categoryId: llbScotchCategory._id, section: 'LIQUID_LOUNGE', price: 300, price60ml: 550, isVeg: true },
            { name: 'Johnnie Walker Red Label', categoryId: llbScotchCategory._id, section: 'LIQUID_LOUNGE', price: 285, price60ml: 550, isVeg: true },
            { name: 'Johnnie Walker Black Label', categoryId: llbScotchCategory._id, section: 'LIQUID_LOUNGE', price: 475, price60ml: 900, isVeg: true, featured: true },
            { name: 'Amrut Indian Single Malt', categoryId: llbScotchCategory._id, section: 'LIQUID_LOUNGE', price: 285, price60ml: 550, isVeg: true, featured: true },
        ];
        await MenuItem_1.MenuItem.create(llbItems);
        console.log(`✓ ${llbItems.length} Liquid Lounge Bar menu items created`);
        // --- SAMBHRAMA PARTY HALL ---
        const partyCategory = await MenuCategory_1.MenuCategory.create({ name: 'Party Packages', section: 'SAMBHRAMA', sortOrder: 1 });
        await MenuItem_1.MenuItem.create([
            { name: 'Choice of Veg Menu', categoryId: partyCategory._id, section: 'SAMBHRAMA', price: 450, description: 'Welcome drink, Kosambari, Palya, Payasa, 1 Fried item, 1 Poori/Akki Roti/Dosa/Pulao, Rice, Sambar, Rasam, Curds, Papad, Pickle & Dessert (+GST)', isVeg: true, featured: true },
            { name: 'Choice of 2 Veg Menu', categoryId: partyCategory._id, section: 'SAMBHRAMA', price: 500, description: 'Welcome drink, Veg Soup, Kosambari, 1 Fried item, 1 Poori/Akki Roti/Dosa, 1 Pulao/Biriyani, Rice, Sambar, Rasam, Curds, Papad, Pickle & Dessert (+GST)', isVeg: true, featured: true },
            { name: 'Multiple Cuisine Menu', categoryId: partyCategory._id, section: 'SAMBHRAMA', price: 550, description: 'Welcome drink, Veg Soup, 2 Salads, 1 Veg starter, 1 Main course, 1 Dal, 2 Breads, 1 Pulao/Biriyani, Rice, Sweet, Sambar, Rasam, Curds, Papad, Pickle & Dessert (+GST)', isVeg: true, featured: true },
        ]);
        console.log('✓ Sambhrama Party Hall menu packages created');
        console.log('\n========================================');
        console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
        console.log('========================================\n');
    }
    catch (error) {
        console.error('Error during database seeding:', error);
        process.exit(1);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
};
exports.seed = seed;
if (require.main === module) {
    (0, exports.seed)();
}
