# HOTEL RAAMA — AI AGENT MASTER PROJECT CONTEXT

> **Purpose:** This document is a consolidated source-of-truth/context file for an AI coding agent building the Hotel Raama website and hotel-management platform.
>
> **Important:** This Markdown file summarizes the functional requirements and known hotel-specific information. The original tariff cards, logo, maps link, and menu PDFs should ALSO be supplied to the coding agent because they contain visual assets and source data that should not be reconstructed from text.

---

# 1. PROJECT OVERVIEW

Build a production-ready full-stack hotel platform for **Hotel Raama, Hassan, Karnataka**.

This is NOT only a brochure/landing website.

The system consists of:

1. Premium public hotel website
2. Room availability and booking system
3. Online payment for room bookings
4. Guest QR food-ordering system
5. Guest booking/order tracking without guest accounts
6. Protected admin dashboard
7. Room, menu, booking and order management
8. Billing and invoice generation
9. Customer history and monthly analytics
10. Coupons and meal-inclusion plans
11. Audit logging
12. Hotel content/settings management

The functional specification describes the product as a connected public site, room-booking flow with online payment, and QR-based food-ordering system.

---

# 2. SOURCE-OF-TRUTH RULE

Use the supplied project documents as authoritative references.

## Priority

### 1. Functional Specification
Use for:
- Business rules
- Booking flow
- Payment flow
- QR ordering
- Admin functionality
- Status lifecycles
- Security requirements
- Database entities

### 2. Hotel Raama Tariff Cards
Use for:
- Room types
- Initial/reference room prices
- Extra-person pricing

IMPORTANT:
Two supplied tariff cards contain different price versions.

Do NOT decide which version is correct automatically.

Store prices in MongoDB and make them editable through the admin panel.

### 3. Hotel Raama Logo
Use the supplied logo asset.
Do not recreate the logo using plain text.

### 4. Swaad / Hotel Raama Menu PDFs
Use these as the source for actual menu content and prices.

Do not invent food items or prices.

### 5. Sambhrama Party Hall material
Use this as the source for party/event package information and pricing.

### 6. Google Maps Link
Use the supplied Google Maps link for hotel navigation/location.

---

# 3. HOTEL BRAND

## Name

**HOTEL RAAMA**

## Location

**B.M. Road, Thanneeruhalla, Hassan – 573201, Karnataka**

## Phone

**081722 57001**

## Google Maps

https://maps.app.goo.gl/ytRudLDAau6mBPKH8

Use this supplied Maps link as the primary navigation destination.

## Brand Direction

The website should feel like a:

- Premium hotel
- Elegant boutique hospitality brand
- Refined Indian hotel
- Comfortable but luxurious property

It should NOT look like:
- A generic Bootstrap template
- A gaming website
- A flashy nightclub
- A generic SaaS dashboard

---

# 4. VISUAL DESIGN SYSTEM

Primary colors:

- Midnight Navy: `#07111F`
- Deep Navy: `#0B1D33`
- Royal Navy: `#102A46`
- Gold: `#C9A227`
- Champagne Gold: `#E2C46B`
- Ivory: `#F5F0E6`
- Dark Surface: `#0D1724`

## Default Theme

Dark premium theme.

Use:

- Navy/black backgrounds
- Gold accents
- Ivory text
- Thin gold borders
- Dark glass surfaces
- Cinematic imagery

## Light Theme

Use:

- Warm ivory background
- Navy typography
- Gold accents
- Ivory/white surfaces

Implement a persistent theme toggle.

Store theme preference in localStorage.

Respect `prefers-color-scheme` on first visit.

---

# 5. BRAND / MENU VISUAL INSPIRATION

The supplied Hotel Raama/Swaad materials contain:

- Gold typography
- Indian ornamental motifs
- Elegant serif typography
- Warm traditional visual elements
- Premium dark/wood-like restaurant styling
- Hotel Raama branding

Use these as visual inspiration.

Do NOT copy the menu layouts directly.

Modernize the design into a premium responsive website.

---

# 6. PUBLIC WEBSITE

No guest account is required.

Guests must NOT have to:

- Register
- Login
- Create a password

Guests can:

- Browse rooms
- Check availability
- Book rooms
- Pay for rooms
- Browse dining
- Order food through QR
- Track their own orders
- Track their own booking
- Contact the hotel
- View location
- View gallery
- View attractions
- Enquire about events

---

# 7. PUBLIC NAVIGATION

Desktop:

- Home
- Rooms
- Dining
- Gallery
- Experiences
- About
- Location
- Contact
- Book Now
- Theme Toggle

Mobile:

Use a premium mobile navigation drawer.

Primary CTA:

**BOOK YOUR STAY**

---

# 8. HOME PAGE

Create a cinematic premium hero.

Brand:

**HOTEL RAAMA**

Suggested messaging:

**HOSPITALITY THAT FEELS LIKE HOME**

Supporting message:

**A refined stay in the heart of Hassan.**

Hero CTAs:

- Explore Rooms
- Book Your Stay

Include a booking search widget:

- Check-in
- Check-out
- Guests
- Room type
- Search Availability

Availability must come from the backend.

---

# 9. ROOMS

Room listing should show:

- Room image
- Room type
- Occupancy
- AC / Non-AC
- Description
- Amenities
- Current database price
- Availability
- View Details
- Book Now

Filters:

- Price
- Capacity
- AC / Non-AC
- Room type

---

# 10. INITIAL ROOM TYPES FROM TARIFF CARDS

The supplied tariff cards show:

- Premium Single Non A/C
- Premium Double Non A/C
- Executive Single A/C
- Executive Double A/C
- Triple Occupancy Premium
- Triple Occupancy Executive
- Suit/Suite Room
- Extra Person

## Tariff Card Version A

| Room Type | Rate |
|---|---:|
| Premium Single Non A/C | ₹2200 |
| Premium Double Non A/C | ₹2850 |
| Executive Single A/C | ₹2600 |
| Executive Double A/C | ₹3300 |
| Triple Occupancy Premium | ₹3800 |
| Triple Occupancy Executive | ₹4200 |
| Suit Room | ₹4250 |
| Extra Person | ₹600 |

## Tariff Card Version B

| Room Type | Rate |
|---|---:|
| Premium Single Non A/C | ₹2000 |
| Premium Double Non A/C | ₹2500 |
| Executive Single A/C | ₹2500 |
| Executive Double A/C | ₹2900 |
| Triple Occupancy Premium | ₹3000 |
| Triple Occupancy Executive | ₹3400 |
| Suit Room | ₹3500 |
| Extra Person | ₹600 |

Both cards state that taxes are applicable.

### IMPORTANT

These are source/reference values, not permanent frontend constants.

Because two tariff versions exist:

- Seed one selected/current version only after client confirmation, OR
- Seed a configurable initial rate set and mark the source/version clearly.

Never silently choose one as universally correct.

All room prices must be editable by Admin.

Historical bookings must preserve the price that applied when the booking was created.

---

# 11. ROOM DETAIL PAGE

Show:

- Large image gallery
- Room name
- Price
- Capacity
- Description
- Amenities
- Features
- Availability calendar
- Booking CTA
- Related rooms

Booking panel:

- Check-in
- Check-out
- Guests
- Room count if supported
- Special requests
- Meal inclusion options
- Coupon
- Price summary
- Continue to Payment

---

# 12. BOOKING FLOW

The booking form collects:

- Name
- Phone
- Email
- Check-in
- Check-out
- Number of guests
- Room type
- Special requests

Flow:

1. Server-side availability check
2. Optional meal inclusion plan
3. Optional coupon
4. Server-side final amount calculation
5. Create payment order
6. Guest completes hosted online payment
7. Verify payment server-side
8. Confirm booking
9. Send confirmation
10. Provide WhatsApp confirmation link
11. Send hotel notification email

---

# 13. BOOKING SECURITY

The browser is NOT trusted.

Never trust from the client:

- Final price
- Room price
- Meal-plan price
- Coupon discount
- Final total
- Payment success
- Availability result

Server must calculate:

`room price × number of nights + meal-plan charges - coupon discount + applicable taxes/service charges`

The server must independently recompute the final payable amount when creating the payment order.

Payment credentials remain server-side.

---

# 14. DOUBLE-BOOKING PROTECTION

The backend must prevent race-condition double bookings.

Example:

Guest A and Guest B simultaneously try to reserve the same room for overlapping dates.

The system must ensure only one valid booking can obtain that room.

Use appropriate MongoDB transactional/locking strategy.

A temporary unpaid booking hold may exist during payment, but it must automatically expire after a short configured period so abandoned checkouts do not block inventory.

---

# 15. BOOKING STATUS

Booking:

- PENDING
- CONFIRMED
- CHECKED_IN
- CHECKED_OUT
- CANCELLED
- NO_SHOW

Booking payment:

- PENDING
- PAID
- FAILED
- REFUNDED

Room:

- AVAILABLE
- RESERVED
- OCCUPIED
- CLEANING
- MAINTENANCE
- OUT_OF_SERVICE

Do NOT combine booking status and payment status.

---

# 16. ONLINE PAYMENT

Use a suitable Indian payment gateway such as Razorpay.

Recommended flow:

Frontend
→ Backend
→ Payment Gateway Order
→ Hosted Checkout
→ Payment
→ Webhook
→ Server Verification
→ Booking Confirmation

A booking must NOT become confirmed only because a frontend callback says payment succeeded.

Use:

- Payment signature verification
- Webhook verification
- Idempotency
- Duplicate payment protection
- Rate limiting
- Temporary booking holds
- Refund handling

No card data should be stored on the hotel's servers.

---

# 17. BOOKING CONFIRMATION

After successful payment show:

**YOUR STAY IS CONFIRMED**

Display:

- Guest name
- Booking ID
- Room
- Check-in
- Check-out
- Guests
- Meal plan
- Coupon
- Amount
- Payment status

Buttons:

- Download Invoice
- Send Confirmation on WhatsApp
- Back to Hotel

---

# 18. WHATSAPP

Create a WhatsApp deep link with a prefilled message containing:

- Booking ID
- Guest
- Room
- Check-in
- Check-out
- Guests
- Amount

Important:

The WhatsApp action happens AFTER the booking is saved.

WhatsApp is not the source of truth.

Database + admin dashboard + hotel notification email are the authoritative records.

---

# 19. DINING

Create a premium dining page.

Main property:

**Swaad Restaurant**

Use the supplied menu PDFs as the source of truth for:

- Categories
- Items
- Prices
- Descriptions where provided

Do not invent menu data when source data is available.

Possible UI categories should be based on the actual supplied menu rather than arbitrary invented categories.

---

# 20. LIQUID LOUNGE / BAR

Use the supplied Hotel Raama Liquid Lounge menu as the source for beverage content.

The supplied menu contains categories/products including:

- Whisky
- Brandy
- Beer
- Cocktails
- Mocktails
- Rum
- Soft Drinks
- Mineral Water
- Other beverage categories shown in the source material

Preserve the source's actual products and prices.

Do not invent beverage pricing.

Implement appropriate legal/age messaging where applicable.

---

# 21. SAMBRAMA PARTY HALL

Create:

**Sambhrama Party Hall**

The supplied material includes:

- Choice of Veg Menu
- Choice of 2 Veg Menu
- Multiple Cuisine Menu

with per-person pricing plus GST as shown in the source.

Create an event enquiry form:

- Name
- Phone
- Email
- Event date
- Event type
- Number of guests
- Message

This is an enquiry flow, not room booking.

---

# 22. QR FOOD ORDERING

The functional scope covers:

- 40 rooms
- 1 meeting hall

Generate a unique QR code for each room/hall.

QR example:

`/order/<secure-token>`

Guest scans QR and gets a fast mobile-first menu.

No login.

No normal website chrome required.

---

# 23. QR SECURITY

Never trust a room number supplied in the URL.

Use a secure random QR token mapped to the room/hall.

Server must validate the token.

A guest must never be able to change the URL and access another room's order data.

Never expose sensitive room information through predictable IDs.

---

# 24. QR MENU

Display:

- Categories
- Food image
- Item name
- Description
- Price
- Veg/non-veg indicator
- Availability
- Add button

Cart:

- Item
- Quantity
- Price
- Total

Checkout:

- Room/hall
- Guest name
- Special request

There is NO online payment for QR food orders.

---

# 25. FOOD ORDER STATUS

Order:

- PENDING
- CONFIRMED
- PREPARING
- READY
- DELIVERED
- CANCELLED

Order payment:

- UNPAID
- PARTIALLY_PAID
- PAID

Counter payment methods:

- CASH
- UPI
- CARD
- OTHER

Keep order status and payment status separate.

---

# 26. GUEST ORDER TRACKING

After creating an order, generate a secure tracking token.

Guest can view:

- Order number
- Items
- Quantity
- Total
- Order status
- Payment status

No guest login required.

Guest must only be able to access their own order.

---

# 27. CUSTOMER HISTORY

Do not require customer accounts.

Internally track customer history using suitable identifiers such as phone/email.

Track:

- Guest name
- Phone
- Email
- Booking history
- Orders
- Last order date
- Last ordered items
- Total orders
- Total booking spend
- Total food spend
- Number of stays
- Last stay
- Preferred room type where derivable

Do not expose customer information publicly.

---

# 28. MONTHLY CUSTOMER ANALYTICS

Admin should be able to view:

- Customer
- Phone
- Last order
- Last ordered items
- Total orders
- Total spend
- Last booking
- Total stays

Filters:

- Today
- Yesterday
- Last 7 days
- This month
- Last month
- Custom date range

---

# 29. ADMIN AUTHENTICATION

There is exactly one Admin role.

No staff accounts.

No staff portal.

No public admin registration.

Admin route:

`/admin/login`

Admin uses:

- Email
- Password

Password stored hashed using bcrypt.

Use signed JWT authentication.

Prefer secure HTTP-only cookie storage.

---

# 30. ADMIN PROTECTED ROUTES — NON-NEGOTIABLE

Frontend:

`<ProtectedAdminRoute />`

Routes:

- `/admin`
- `/admin/bookings`
- `/admin/orders`
- `/admin/rooms`
- `/admin/room-types`
- `/admin/menu`
- `/admin/customers`
- `/admin/billing`
- `/admin/reports`
- `/admin/settings`
- `/admin/audit-logs`

Only:

`/admin/login`

is public.

Backend must protect every private `/api/admin/*` endpoint.

Create:

`requireAdminAuth`

Middleware must:

1. Read JWT from secure cookie
2. Verify signature
3. Verify expiration
4. Extract admin identity
5. Validate admin against MongoDB
6. Reject unauthenticated requests with 401
7. Reject invalid/expired sessions with 401

Frontend route protection is only UX.

Backend authorization is the actual security boundary.

Example:

Unauthenticated:

`GET /api/admin/bookings`

must return:

`401 Unauthorized`

Never rely only on React route protection.

---

# 31. ADMIN SESSION

Create:

`GET /api/admin/me`

Used after browser refresh to restore the admin session.

Logout:

`POST /api/admin/logout`

Logout must clear the authentication cookie.

Do NOT store admin JWT in localStorage.

---

# 32. ADMIN DASHBOARD

Dashboard should display real database information:

- Today's bookings
- Today's orders
- Today's revenue
- Online booking revenue
- Counter order revenue
- Occupied rooms
- Available rooms
- Pending bookings
- Pending orders
- Unpaid bills

Charts:

- Revenue trends
- Booking trends
- Order trends
- Occupancy
- Popular menu items
- Room popularity

No hardcoded dashboard numbers.

---

# 33. BOOKINGS ADMIN

Features:

- List bookings
- Search
- Filter
- Date filtering
- Status filtering
- Payment filtering
- Room filtering
- Detail view

Booking detail:

- Guest
- Phone
- Email
- Room
- Dates
- Nights
- Guests
- Meal plan
- Coupon
- Payment
- Booking status
- Special requests
- Created date
- Transaction reference

Online payment status should be sourced from the payment provider and not manually fabricated.

---

# 34. ORDERS ADMIN

Live order management.

Tabs:

- New
- Confirmed
- Preparing
- Ready
- Delivered
- Cancelled

Each order:

- Room/hall
- Guest
- Items
- Quantity
- Total
- Order time
- Payment status

Use Socket.IO for real-time new-order updates.

Optional audio alert for new orders.

---

# 35. ROOM MANAGEMENT

Admin CRUD:

- Create room
- Edit room
- Deactivate room
- Assign room type
- Change status
- Upload images
- Generate QR
- Download QR
- Regenerate QR

---

# 36. ROOM TYPE MANAGEMENT

CRUD:

- Name
- Description
- Base price
- Occupancy
- AC / Non-AC
- Amenities
- Images
- Active/inactive

All pricing comes from MongoDB.

Historical booking prices must be snapshotted.

---

# 37. MENU MANAGEMENT

Admin CRUD:

- Category
- Item name
- Description
- Price
- Image
- Veg/non-veg
- Availability
- Featured
- Sort order

Allow admin to mark an item unavailable without deleting it.

---

# 38. COUPONS

Admin can manage:

- Coupon code
- Percentage discount
- Flat discount
- Start date
- End date
- Minimum booking amount
- Maximum usage
- Active/inactive

Coupon validation is server-side.

Do not expose the complete coupon list publicly.

---

# 39. MEAL INCLUSION PLANS

Admin configures:

- Breakfast
- Lunch
- Dinner

Each has:

- Price
- Active/inactive

When booking is created, snapshot the meal price.

Changing current pricing must not change historical bookings.

---

# 40. BILLING

Support:

- Booking bills
- Food order bills
- Meal-plan charges
- Coupon discounts
- Taxes/service charges
- Payment records
- Partial food-order payments

Generate professional PDF invoices.

Use human-readable invoice numbers.

Do not expose raw MongoDB IDs as invoice numbers.

---

# 41. REPORTS

Reports:

- Revenue
- Bookings
- Food orders
- Occupancy
- Customers
- Popular menu items
- Room performance
- Payments

Filters:

- Date
- Month
- Room
- Room type
- Payment type

Provide CSV export where useful.

---

# 42. AUDIT LOG

Track important admin actions:

- Admin login
- Booking status change
- Payment verification
- Refund
- Coupon creation/edit
- Menu changes
- Room changes
- Meal-plan changes
- Manual payment recording
- Settings changes

Log:

- Admin
- Action
- Entity
- Timestamp
- Relevant metadata

Audit logs should be read-only from the admin UI.

---

# 43. LOCATION / CONTACT

Create a premium location page.

Show:

**Hotel Raama**

**B.M. Road, Thanneeruhalla, Hassan – 573201**

Phone:

**081722 57001**

Buttons:

- Get Directions
- Call
- WhatsApp

Use supplied Google Maps link:

https://maps.app.goo.gl/ytRudLDAau6mBPKH8

Include a good embedded map UI where technically appropriate.

---

# 44. NEARBY ATTRACTIONS

Admin-managed attraction cards:

- Name
- Category
- Distance
- Image
- Description
- Maps link

Do not hardcode the attraction database into React.

---

# 45. GALLERY

Categories:

- Hotel
- Rooms
- Restaurant
- Bar
- Events
- Exterior

Features:

- Responsive grid/masonry
- Lightbox
- Fullscreen
- Lazy loading
- Smooth transitions

---

# 46. ABOUT PAGE

Create an elegant hotel story page.

Focus on:

- Hospitality
- Comfort
- Hassan
- Rooms
- Dining
- Events
- Guest experience

Do not invent historical claims.

---

# 47. DATABASE ENTITIES

Core entities:

- Admin/User
- Hotel
- RoomType
- Room
- Amenity
- Booking
- BookingGuest
- MenuCategory
- MenuItem
- Order
- OrderItem
- Bill
- Payment
- QRCode
- HotelSetting
- AuditLog
- Attraction
- Coupon
- MIPPlan
- BookingMIPSelection

Add appropriate indexes.

Important indexes include:

- Booking room/date/status
- Customer phone
- Customer email
- Order room/status
- Payment status
- Coupon code
- QR token

---

# 48. API STRUCTURE

Public examples:

`GET /api/rooms`

`GET /api/rooms/:id`

`POST /api/availability/check`

`POST /api/bookings`

`POST /api/bookings/:id/payment`

`POST /api/payments/webhook`

`GET /api/bookings/:token`

`GET /api/menu`

`GET /api/attractions`

Admin examples:

`POST /api/admin/login`

`POST /api/admin/logout`

`GET /api/admin/me`

`GET /api/admin/dashboard`

`GET /api/admin/bookings`

`PATCH /api/admin/bookings/:id/status`

`GET /api/admin/orders`

`PATCH /api/admin/orders/:id/status`

`PATCH /api/admin/orders/:id/payment`

CRUD `/api/admin/rooms`

CRUD `/api/admin/room-types`

CRUD `/api/admin/menu`

CRUD `/api/admin/coupons`

CRUD `/api/admin/meal-plans`

CRUD `/api/admin/attractions`

`GET /api/admin/reports`

`GET /api/admin/audit-logs`

Every private admin API must use `requireAdminAuth`.

---

# 49. ORDER CREATION GUARANTEE

QR order flow:

1. Validate QR token
2. Validate menu items
3. Recalculate prices server-side
4. Create order in database
5. Return order confirmation
6. Then open WhatsApp deep link

Never depend on WhatsApp for persistence.

---

# 50. ERROR HANDLING

Use consistent API responses.

Example:

```json
{
  "success": false,
  "message": "Room is no longer available for the selected dates.",
  "code": "ROOM_UNAVAILABLE"
}
```

Never expose raw MongoDB errors.

Never silently fail.

---

# 51. PERFORMANCE

Implement:

- Lazy-loaded images
- WebP/AVIF where appropriate
- Responsive image sizes
- Route-level code splitting
- API caching where appropriate
- MongoDB indexes
- Pagination
- Debounced search
- Optimized database queries

Do not load the entire historical order/booking dataset into the browser.

---

# 52. RESPONSIVE DESIGN

Must work well on:

- Mobile
- Tablet
- Laptop
- Desktop
- Large desktop

QR ordering is primarily mobile-first.

Do not simply shrink desktop layouts.

---

# 53. ANIMATION

Use:

- Hero reveal
- Text reveal
- Scroll reveal
- Card hover
- Image zoom
- Gold-line animations
- Page transitions
- Number counters

Avoid excessive animation.

Luxury > flashy.

---

# 54. SEO

Implement:

- Page titles
- Meta descriptions
- Open Graph
- Semantic HTML
- Sitemap
- robots.txt
- Canonical URLs
- Hotel/local business structured data where appropriate

Do not keyword stuff.

---

# 55. SECURITY

Implement:

- Helmet
- CORS
- Rate limiting
- Input validation
- MongoDB sanitization
- JWT security
- HTTP-only cookies
- bcrypt
- Payment webhook verification
- Authorization middleware
- QR token validation
- Admin route protection
- Request size limits
- Audit logging
- HTTPS in production

Never trust frontend prices or payment callbacks.

---

# 56. TESTING

Test at minimum:

## Booking

- Available room
- Unavailable room
- Overlapping booking
- Concurrent booking
- Invalid dates
- Payment failure
- Payment success
- Duplicate payment
- Expired hold

## Coupon

- Valid
- Expired
- Inactive
- Maximum usage
- Minimum amount
- Invalid code

## QR

- Valid token
- Invalid token
- Cross-room access attempt
- Disabled QR

## Orders

- Valid order
- Invalid menu item
- Changed price
- Quantity validation
- Status transitions

## Admin

- Unauthorized API
- Invalid credentials
- Valid login
- Expired session
- Logout

---

# 57. SEED DATA

Create a seed script.

Seed:

- Hotel information
- Room types
- 40 rooms
- 1 meeting hall QR
- Amenities
- Menu categories
- Menu items
- Meal plans
- Sample attractions
- Admin account

Use supplied documents as the source.

Do not invent missing business information.

---

# 58. ENVIRONMENT VARIABLES

Create `.env.example`:

```text
MONGODB_URI=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
HOTEL_NOTIFICATION_EMAIL=
HOTEL_WHATSAPP_NUMBER=
CLIENT_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Never commit real secrets.

---

# 59. PROJECT STRUCTURE

Recommended:

```text
hotel-raama/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── features/
│       ├── hooks/
│       ├── services/
│       ├── utils/
│       ├── types/
│       └── routes/
│
├── server/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── models/
│       ├── services/
│       ├── middleware/
│       ├── validators/
│       ├── utils/
│       ├── jobs/
│       ├── sockets/
│       └── config/
│
├── shared/
├── .env.example
├── README.md
└── package.json
```

---

# 60. IMPLEMENTATION ORDER

Do NOT build a beautiful frontend first and fake the backend.

Recommended:

### Phase 1
Database + backend architecture

### Phase 2
Room inventory + availability

### Phase 3
Booking + payment

### Phase 4
Admin authentication + booking management

### Phase 5
Menu + QR ordering

### Phase 6
Real-time order management

### Phase 7
Billing + invoices

### Phase 8
Analytics + customer history

### Phase 9
Premium public website

### Phase 10
Security + testing + performance

### Phase 11
Production deployment

---

# 61. DEFINITION OF DONE

The project is not considered complete until:

- Guest can browse the website
- Guest can view rooms
- Guest can check availability
- Backend validates availability
- Guest can submit booking
- Backend calculates final price
- Guest can pay online
- Payment is verified server-side
- Booking confirms only after verification
- Guest receives confirmation
- WhatsApp confirmation works
- Hotel notification email works
- Guest can scan room QR
- Guest can browse menu
- Guest can place food order
- Admin receives order in real time
- Admin can update order status
- Guest can track order
- Admin can record counter payment
- Admin can manage rooms
- Admin can manage room prices
- Admin can manage menu
- Admin can generate QR codes
- Admin can manage bookings
- Admin can manage coupons
- Admin can manage meal plans
- Admin can generate invoices
- Admin can view monthly analytics
- Admin can view customer last-order information
- Admin can view reports
- Admin can view audit logs
- Admin routes are protected
- Admin APIs are protected
- No guest authentication is required
- No cross-room QR access is possible
- No client-side price manipulation is possible
- No fake availability exists
- No fake payment success exists
- No hardcoded dashboard analytics exist

---

# 62. AI AGENT INSTRUCTION

Before writing code:

1. Read this Markdown document completely.
2. Read ALL attached original source PDFs/images.
3. Extract hotel-specific information from the source material.
4. Do not invent missing information.
5. Do not silently reconcile conflicting prices.
6. Identify unresolved business decisions.
7. Create an implementation plan.
8. Explain the database schema.
9. Explain the booking/payment architecture.
10. Explain the admin authentication architecture.
11. Explain the QR security architecture.
12. Then begin implementation.

If information is missing from the supplied sources:

- Make it admin-configurable, OR
- Clearly mark it as requiring client confirmation.

Do NOT fabricate hotel facts, prices, menu items, facilities, attractions, policies, or contact information.

---

# 63. IMPORTANT DELIVERY PRINCIPLE

This must be built as a real hotel business platform, not as a portfolio mockup.

A beautiful UI is not enough.

The following must be real and tested:

- Availability
- Booking
- Payment
- Authentication
- Authorization
- QR security
- Ordering
- Database persistence
- Admin operations
- Billing
- Analytics

The final product should be deployable for actual Hotel Raama operations after the client supplies/validates production credentials, final pricing, payment configuration, and any remaining business-specific information.
