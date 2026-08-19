# 🏰 Hotel Raama — Premium Hospitality & Real-Time QR Dining Platform

A full-stack, editorial luxury hotel management web application designed for **Hotel Raama**, Hassan, Karnataka. Built with **React, TypeScript, Vite, Node.js, Express, MongoDB, and Socket.IO**, the platform delivers an Awwwards-inspired luxury guest experience alongside a real-time administrative operations console.

---

## 🌟 Highlights & Key Features

### 🏨 Guest Experience & Room Booking
- **Editorial Luxury Design System**: Warm Ivory (`#FFFCE1`) palette with Midnight Navy (`#0B1849`) typography, Cormorant Garamond serif headlines, and Soft Gold (`#FFDE74`) accents.
- **CP & Non-CP Booking Plans**:
  - **CP Plan**: Continental & South Indian Breakfast Included.
  - **Non-CP Plan**: Room Only stay option.
- **Dynamic Search & Availability**: Filter room types (Deluxe, Executive, Suite) with guest count and date selection.
- **Payment Flexibility**: Support for online payments (Razorpay) and Pay-at-Reception options.
- **Instant Tax Invoices**: Downloadable PDF receipts generated on demand for room bookings.

### 🍽️ 40-Room & Party Hall QR Dining System
- **Unique QR Code Direct Ordering**: 41 unique QR endpoints mapping directly to:
  - **40 Deluxe Rooms** (Room #1 to Room #40).
  - **1 Sambhrama Party Hall** dedicated QR ordering code.
- **Comprehensive Menu Catalog**: Full hardcoded Veg and Non-Veg menu options across South Indian, North Indian, Chinese, Tandoor, Desserts, and Bar Beverages.
- **Live Socket.IO Order Tracking**: Real-time status updates (*Order Placed → Preparing in Kitchen → Food Ready → Delivered to Room*).
- **PDF Dining Receipts**: PDF invoice generation for all dining and bar orders.

### 👨‍🍳 Admin Operations & Live Kitchen Board
- **Protected Security Access**: Secured JWT HTTP-Only cookie authentication guarding all `/admin` routes.
- **Executive Operations Dashboard**: Live occupancy rate metrics, active kitchen orders, combined revenue analytics, and Recharts area trends.
- **2-Stage Simplified Kitchen Board**:
  - 🍳 **Cook Food (Kitchen Preparation)**: Orders in preparation status.
  - 🍽️ **Serve Food (Ready & Delivered)**: Food items ready for guest service.
- **Audio Order Alerts**: Real-time sound notifications whenever a new room or party hall order arrives.
- **Customer Lifetime Analytics**: Track guest history, room numbers, order counts, and total spend.
- **Security Audit Logs**: Immutable audit trails recording staff logins and administrative actions.

---

## 🛠️ Technology Stack

### **Frontend (`client/`)**
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Custom Tailwind CSS design tokens & Lucide React icons
- **State & Animations**: Framer Motion, Sonner Toast Notifications
- **Charts & Data Viz**: Recharts (Monthly revenue trends)
- **Real-Time Communication**: Socket.IO Client

### **Backend (`server/`)**
- **Runtime & Server**: Node.js, Express with TypeScript
- **Database**: MongoDB with Mongoose ORM
- **Real-Time Engine**: Socket.IO Server
- **Document Generation**: PDFKit (Tax invoices & billing receipts)
- **Security**: JWT (HTTP-Only cookies), Bcrypt password hashing, Helmet, Express Rate Limiter

---

## 📁 Project Architecture

```
RAAMA/
├── client/                     # Frontend React + Vite Application
│   ├── src/
│   │   ├── components/         # Navbar, Footer, UI Cards & Badges
│   │   ├── context/            # ThemeContext (Locked Light Luxury System)
│   │   ├── pages/              # Guest Views & Admin Dashboard Pages
│   │   │   ├── admin/          # Protected Admin Layout, Orders, Bookings, Audit Logs
│   │   │   └── ...             # Home, Rooms, Dining, QR Ordering, Order Tracking
│   │   └── services/           # Axios API Client & Invoice Helpers
│   ├── index.html
│   └── package.json
│
├── server/                     # Backend Node.js + Express API
│   ├── src/
│   │   ├── controllers/        # Admin, Booking, Order, & Public Controllers
│   │   ├── middleware/         # Auth Middleware & Rate Limiters
│   │   ├── models/             # Mongoose Models (Admin, Room, Booking, Order, etc.)
│   │   ├── routes/             # Express API Routes (Public, QR, Admin)
│   │   ├── seed/               # Database Seeding Script (40 Rooms + Menu Items)
│   │   ├── services/           # Socket.IO & PDF Invoice Generation
│   │   └── index.ts            # Express Server Entry Point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started & Local Setup

### **Prerequisites**
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI

### **1. Clone & Install Dependencies**

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### **2. Environment Configuration Setup**

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Admin Credentials
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

# Client Origin
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### **3. Database Seeding**

Populate the database with room types, 40 unique room QR codes, Sambhrama Party Hall QR code, and Veg/Non-Veg menu items:

```bash
cd server
npm run seed
```

### **4. Run Development Servers**

Open two terminal windows:

```bash
# Terminal 1: Start Backend API (Port 5000)
cd server
npm run dev

# Terminal 2: Start Client App (Port 5173)
cd client
npm run dev
```

Visit the application in your browser at `http://localhost:5173`.

---

## 🔒 Security Architecture

- **HTTP-Only Cookie Authentication**: Admin sessions use secure JWT tokens stored in HTTP-Only cookies to protect against XSS token extraction.
- **Route Guarding**: All administrative API endpoints (`/api/admin/*`) require valid authentication middleware.
- **Rate-Limiting**: Express rate limiters protect authentication endpoints against brute-force attempts.

---

## 📄 License & Credits

Built for **Hotel Raama**, Hassan, Karnataka. Designed and engineered for luxury boutique hospitality.
