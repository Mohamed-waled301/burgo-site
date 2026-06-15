# Burger Box Platform 🍔

A premium, full-stack food-ordering web application for **Burger Box** (a cloud kitchen brand selling ready-to-cook burger boxes where customers grill the patty and assemble the sandwich at home).

Built using **React (Vite) + Node.js (Express) + TypeScript**, styled with **Tailwind CSS**, and utilizing modern state management (**Zustand**), animations (**Framer Motion**), and full internationalization (**react-i18next**) for Arabic (RTL) and English (LTR).

---

## 🎨 Design System

We adhere strictly to the Burger Box visual identity:
*   **Primary Accent**: `#F97316` (Orange CTA)
*   **Primary Hover**: `#EA580C` (Darker Orange)
*   **Dark Neutral**: `#1F2937` (Dark Nav & Footers)
*   **Background**: `#FFF8F0` (Warm Cream Page bg)
*   **Accent Badge**: `#FBBF24` (Yellow Highlights)
*   **Body Text**: `#111827` (Charcoal Text)
*   **Typography**:
    *   *Headings*: `Syne` (Google Fonts) — bold, wide, modern
    *   *Body Copy*: `Inter` (Google Fonts) — clean, highly readable
    *   *Prices & Labels*: `Space Grotesk` (Google Fonts) — techy, distinct

---

## 🧱 Project Structure

```text
burger-box/
├── client/                     # Frontend client workspace (React + Vite)
│   ├── src/
│   │   ├── app/                # Main application entrypoints
│   │   ├── components/         # Shared components (Navbar, Drawer, Switcher, Cards)
│   │   ├── pages/              # Main routing views (Home, Products, Checkout, Admin Panels)
│   │   ├── layouts/            # Page structures (Admin Layout, public layouts)
│   │   ├── locales/            # Translation keys (ar/common.json, en/common.json)
│   │   ├── i18n/               # i18next initialisation script
│   │   ├── services/           # Axios HTTP client configuration
│   │   ├── store/              # Zustand persistent stores
│   │   ├── routes/             # React Router routing configurations
│   │   ├── App.tsx             # Main App layout mounting
│   │   └── main.tsx            # DOM initialization entry
│   ├── vite.config.ts          # Vite bundler options & local reverse proxies
│   └── package.json
│
├── server/                     # Backend server workspace (Node.js + Express)
│   ├── src/
│   │   ├── config/             # System config & environment loader
│   │   ├── controllers/        # REST logic handlers
│   │   ├── middleware/         # Security JWT checks
│   │   ├── routes/             # Express routing namespaces
│   │   ├── utils/              # Local file database helper (db.json persistence)
│   │   ├── app.ts              # Express initialization
│   │   └── server.ts           # Listener starter
│   └── package.json
│
├── .env.example                # Environmental variables template
├── README.md                   # Documentation guide
└── package.json                # Root package executing concurrently
```

---

## 🌍 Internationalization (i18n) & RTL

*   Supports **Arabic (default)** and **English** translation systems.
*   Instantly adapts layout directions (`dir="rtl" lang="ar"` or `dir="ltr" lang="en"`) on the `<html>` node.
*   Paddings, margins, flex boxes, drawers, overlays, and tables adjust automatically based on direction changes.
*   Active language preferences are persisted in browser `localStorage`.

---

## ⚙️ How to Run Locally

### 1. Prerequisite Installations
From the root directory, run the installer script to automatically restore all node packages for both workspaces:
```bash
npm run install:all
```

### 2. Configure Environments
Copy the environment template and customize key entries:
```bash
cp .env.example .env
```
Inside `.env`, you can customize:
*   `PORT` (defaults to `5000` for backend)
*   `JWT_SECRET` (used to sign security tokens)
*   `ADMIN_USERNAME` / `ADMIN_PASSWORD` (defaults to `admin` / `BurgerBox2025!`)
*   `PAYMOB_API_KEY`, `PAYMOB_INTEGRATION_ID`, `PAYMOB_IFRAME_ID` (your Paymob integration codes)

### 3. Run Dev Servers Concurrently
Start both the React development server (port `3000`) and the Express REST APIs (port `5000`) concurrently:
```bash
npm run dev
```

---

## 🔐 Administrative Access & Testing

*   **Login page**: Navigate to `http://localhost:3000/admin/login` (or click on the Admin footer link).
*   **Credentials**:
    *   *Username*: `admin`
    *   *Password*: `BurgerBox2025!`
*   **Features**:
    *   Add, edit, or delete items. Added boxes will instantly display on the frontend `/products` page.
    *   Set discount rates (fixed or percentages) with optional expiry dates. Cards will automatically calculate sale pricing.
    *   Monitor customer orders in real-time, view full detail sheets, and change shipping states.
    *   **New Order Polling**: Place an order in one window while keeping the Admin dashboard open in another. The dashboard will query every 5 seconds, instantly trigger a synthesized warning beep using the **Web Audio API**, and alert the administrator with a toast notification.

---

## 💳 Secure Paymob checkout & simulation

Frontend requests for payment gates are made via backend endpoints to avoid exposing secret keys.

**No credentials required to test**: If no Paymob variables are configured in `.env`, the system automatically resolves checkout attempts to a built-in simulated credit card / mobile wallet sandbox gateway. This allows you to verify checkout success redirects, database persistence, and polling updates out-of-the-box.
