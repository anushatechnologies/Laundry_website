# Laundry_website

Premium soft-luxury customer-facing web application for LaundryFresh.

## 🚀 Features
- **Soft-Luxury Design System**: Custom palette with Deep Plum (`#5B214F`), Champagne Gold (`#D6B36A`), Dusty Rose (`#B76E79`), and Warm White (`#FCF9F7`)
- **Interactive 3D Studio Hero**: Rotating washer drum animation with live order status cards
- **Dual Catalog Selector**: Individual Garment Item Care + Bulk Wash by Weight (Per-KG) estimator
- **Instant Doorstep Scheduling**: 4-field quick pickup banner and full 3-step checkout flow
- **Monthly Passes & Memberships**: 4 tiered prepaid passes with unused weight rollovers
- **Payments & Verification**: Razorpay checkout integration with automated verification
- **Order Tracking**: Visual 5-stage live status pipeline and digital receipt view

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: Tailwind CSS & Material UI (MUI v6)
- **Typography**: Manrope & Inter (Google Fonts)
- **Language**: TypeScript
- **Icons**: Lucide React

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
