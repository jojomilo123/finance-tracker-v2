# Local Development & Testing Walkthrough — Finance Tracker SaaS

This document provides a step-by-step walkthrough for configuring, starting, and manually testing the **Finance Tracker SaaS** application in your local environment.

---

## 📌 Important Note on Installed Dependencies & Working Directory

> [!IMPORTANT]
> Make sure your terminal working directory is inside **`d:\finance-tracker`** before launching the dev server.
> All `node_modules` dependencies are **already 100% installed and compiled** in your project directory (`d:\finance-tracker\node_modules`).

---

## 🛠️ 1. Environment Setup

Check or create `.env.local` in `d:\finance-tracker`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financetracker?schema=public"
BETTER_AUTH_SECRET="your-32-character-secret-key-here-12345"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 💻 2. Starting the Local Development Server

In your PowerShell terminal, run these 2 commands:

```powershell
# Step A: Navigate into project directory
cd d:\finance-tracker

# Step B: Start Next.js dev server
& "C:\Users\Asus\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "d:\finance-tracker\node_modules\next\dist\bin\next" dev
```

Once started, open your browser at:
👉 **`http://localhost:3000`**

---

## 🔑 3. Login Credentials & Demo Mode

You can log in directly using the pre-filled credentials or click the **"Gunakan Akun Demo (1-Click Fill)"** button on `/login`:

- **Email**: `demo@financetracker.id`
- **Password**: `Demo1234!`

---

## 🗄️ 4. Database Helper Commands

### Generate Prisma Client:
```powershell
cd d:\finance-tracker
& "C:\Users\Asus\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "d:\finance-tracker\node_modules\prisma\build\index.js" generate
```

---

## 🧪 5. Comprehensive Manual Testing Walkthrough

Follow this step-by-step testing plan to verify all application workflows locally:

1. **SaaS Landing Page (`http://localhost:3000/`)**: Open `http://localhost:3000` to view the SaaS Landing Page. Click **"Buka Dashboard"** or **"Masuk"**.
2. **Login Flow (`http://localhost:3000/login`)**: Click **"Gunakan Akun Demo (1-Click Fill)"** and then click **Masuk**. You will be logged in and redirected to `/dashboard`.
3. **Financial Dashboard (`http://localhost:3000/dashboard`)**: Verify KPI summary cards, **Skor Kesehatan Keuangan (0-100)** gauge bar, cash flow area chart, and expense pie chart.
4. **Accounts Management (`http://localhost:3000/accounts`)**: Add a new bank account (*SeaBank*, `Rp2.500.000`) and verify asset summary update.
5. **Categories Management (`http://localhost:3000/categories`)**: Filter between Income/Expense categories and search for *Makanan*.
6. **Transactions Engine (`http://localhost:3000/transactions`)**: Click **"Tambah Transaksi"**, record an Expense (`Rp85.000` for *Resto Sederhana*), test deleting it, and click **Undo (Batal)** on the toast prompt to restore.
7. **Interactive Budget Simulator (`http://localhost:3000/budgets`)**: Drag the budget range slider for *Makanan & Minuman*, type a custom amount into `CurrencyInput`, and apply the 1-click *Balanced Living* template.
8. **Reports & Heatmap (`/reports` & `/analytics`)**: Inspect the GitHub-style calendar contribution heatmap, export a CSV/PDF report, and view merchant rankings.
9. **Goals & Subscriptions (`/goals` & `/subscriptions`)**: Deposit `Rp500.000` into *Dana Darurat* and pause/resume a subscription service.
10. **AI Assistant Chatbot**: Click the floating **AI Coach** button on the bottom right and ask *"Berapa sisa anggaran makanan?"*.
