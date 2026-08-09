# Finance Tracker — Personal Financial Workspace

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

A cozy, personal finance management web app built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Recharts**. Designed as a warm personal workspace — not a corporate SaaS product.

---

## ✨ Features

- 📊 **Dashboard**: Overview cards (Income, Expense, Balance) with sparkline charts, spending breakdown pie chart, budget progress bars, and quick action shortcuts.
- 💳 **Accounts & Wallets**: Manage bank accounts (BCA, Mandiri), e-wallets (GoPay, OVO), cash, and credit cards with live balance tracking.
- 💸 **Transactions**: Record expenses, income, and dual-account transfers with category tagging, merchant tracking, and 1-click undo delete.
- 📈 **Income & Expenses**: Dedicated pages for income-only and expense-only recording, each locked to their respective transaction type.
- 🎯 **Budgets**: Interactive budget sliders with progress threshold colors and 1-click budget templates (Minimal, Balanced, Aggressive Saving, Family).
- 🏆 **Goals**: Track savings targets (Emergency Fund, Vacation, Gadgets) with percentage progress badges.
- 📅 **Calendar**: Monthly calendar view with daily income/expense markers.
- 📉 **Reports & Analytics**: GitHub-style spending heatmap, ranked category bar charts with hover amounts, period filters, and multi-format export (PDF, Excel, CSV).
- 🤖 **AI Financial Coach**: Floating AI chatbot for budget queries and saving suggestions.
- 📱 **Mobile Responsive**: Bottom navigation bar on mobile, touch-friendly buttons, scrollable modals, and optimized layouts for all screen sizes.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15.1.7 (App Router), React 19 |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS, Radix UI Primitives |
| **State** | Zustand (with localStorage persistence) |
| **Charts** | Recharts |
| **Database** | PostgreSQL, Prisma ORM |
| **Auth** | Better Auth |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v20+
- pnpm or npm

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and fill in your values:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/financetracker?schema=public"
BETTER_AUTH_SECRET="your-32-character-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup (Optional)
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 📱 Mobile Access

When running the dev/production server, you can access the app from your phone on the same WiFi network:

```
http://<your-local-ip>:3000
```

The app features a mobile-optimized bottom navigation bar, touch-friendly buttons, and responsive layouts for comfortable use on smartphones and tablets.

---

## 📂 Project Structure

```
├── app/
│   ├── (auth)/             # Login, Register, Forgot Password
│   ├── (dashboard)/        # Dashboard, Accounts, Transactions, Income,
│   │                       # Expenses, Budgets, Categories, Reports,
│   │                       # Analytics, Goals, Calendar, Net Worth,
│   │                       # Subscriptions, Recurring, Settings
│   ├── api/                # API routes (Auth, AI Chat)
│   ├── globals.css         # Design system tokens & animations
│   └── page.tsx            # Root page (renders Dashboard)
├── components/
│   ├── ui/                 # Base UI components (Button, Dialog, Toast, etc.)
│   ├── layout/             # Sidebar, Navbar, DashboardShell
│   ├── cards/              # SummaryCard, AccountCard
│   ├── charts/             # CashFlowChart, ExpensePieChart
│   ├── forms/              # TransactionForm, AccountForm
│   ├── budget/             # BudgetCard, BudgetTemplateModal
│   ├── transactions/       # TransactionTimeline
│   ├── goals/              # GoalCard
│   ├── analytics/          # CategoryBarChart, SpendingHeatmap
│   └── ai/                 # AIAssistantModal
├── stores/
│   └── use-transaction-store.ts  # Zustand persistent global state
├── lib/                    # Auth, Prisma, utils, constants
├── services/               # Business logic services
├── prisma/                 # Database schema & seed
└── public/
    └── images/             # Workspace illustration assets
```

---

## 📄 License

MIT © Finance Tracker.
