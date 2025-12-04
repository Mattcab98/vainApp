# VainApp - Daily Coffee Subscription Platform

A web-first subscription coffee platform connecting users with local coffee shops via daily QR code redemption.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (access + refresh tokens)
- **Payments**: Stripe (ready for integration)
- **Docker**: Full containerization support

### Frontend
- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **QR**: qrcode.react

## 📁 Project Structure

```
/vainapp
  /frontend          # React frontend
    /src
      /pages         # Landing, Login, Signup, Dashboard, ShopDashboard
      /components    # Reusable components
    tailwind.config.js
    package.json
  /backend           # Express backend
    /src
      /config        # Configuration
      /controllers   # Auth, Consumption, Shop controllers
      /middlewares   # Auth middleware
      /models        # Mongoose models (User, Shop, Subscription, Consumption)
      /routes        # API routes
      /services      # Business logic
      /utils         # JWT utilities
      server.ts
    package.json
    Dockerfile
  docker-compose.yml
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Docker)
- npm or pnpm

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vainapp
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

Run backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### Docker Setup (Recommended)

Run both backend and MongoDB:
```bash
docker-compose up
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Consumption (QR Flow)
- `POST /api/consumption/generate-qr` - Generate daily QR (user)
- `POST /api/consumption/validate` - Validate QR (shop)
- `GET /api/consumption/history` - Get consumption history

### Shops
- `POST /api/shops` - Create shop (admin)
- `GET /api/shops` - List shops (with geosearch)
- `GET /api/shops/:id` - Get shop details

## 🎯 Core Features

### User Flow
1. Sign up and subscribe to daily plan
2. Generate daily QR code from dashboard
3. Show QR at partner coffee shop
4. Shop validates and redeems

### Shop Flow
1. Shop owner logs in with shop account
2. Customer shows QR code
3. Shop scans/enters token
4. System validates and records consumption

### Security
- JWT-based authentication
- Ephemeral QR tokens (15min expiry)
- One redemption per day enforcement
- Role-based access control

## 🎨 Design

- **Primary Color**: `#FFB22C` (vibrant yellow)
- **Accent**: `#D06224` (orange)
- **Dark**: `#244837` (deep green)
- Modern gradient backgrounds
- Glassmorphism effects
- Smooth transitions and hover states

## 📝 Database Models

### User
- name, email, passwordHash
- role: 'user' | 'shop' | 'admin'
- subscription reference
- lastConsumptionDate

### Shop
- name, address, location (geospatial)
- hours, logoUrl, contactEmail
- active status

### Subscription
- userId, stripeSubscriptionId
- planId, priceCents, currency
- status, dates

### Consumption
- userId, shopId
- consumedAt, method ('qr' | 'manual')
- qrId

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Backend
- Deploy to Render, Railway, or DigitalOcean
- Set environment variables
- Connect to MongoDB Atlas

### Frontend
- Deploy to Vercel or Netlify
- Set `VITE_API_URL` to backend URL

## 📋 MVP Acceptance Criteria

✅ User can sign up and login  
✅ User can generate daily QR code  
✅ Shop can validate QR code  
✅ System prevents duplicate same-day consumption  
✅ JWT authentication working  
⏳ Stripe integration (ready for implementation)  
⏳ Webhook handling (ready for implementation)

## 🔮 Future Enhancements

- Stripe subscription integration
- Geofencing for redemption
- Analytics dashboard
- Multiple subscription plans
- Referral system
- Mobile app (React Native)

## 📄 License

MIT

## 👥 Contributing

Contributions welcome! Please open an issue or PR.
