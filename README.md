# 💰 Expense Tracker

A modern, full-stack expense tracking web application built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

Track income and expenses, set monthly budgets with live progress tracking, and visualize spending habits with interactive charts — all protected by database-level Row-Level Security.

🔗 **Live demo:** [https://expense-tracker-three-umber.vercel.app](https://expense-tracker-three-umber.vercel.app)

---

## ✨ Features

- 🔐 **Authentication** — Email + password signup/login with email confirmation (Supabase Auth)
- 🧭 **Protected routes** — Next.js middleware guards every page and handles redirects
- 🔒 **Row-Level Security** — PostgreSQL policies ensure users can only read/write their own data
- 💸 **Transactions** — Full CRUD with category, note, date, and type (income/expense)
- 🎯 **Budgets** — Monthly per-category limits with color-coded progress bars
- 📊 **Insights** — Donut chart (spending by category) + 6-month income vs. expenses bar chart (Recharts)
- 📸 **Avatars** — Profile picture uploads via Supabase Storage with per-user folder policies
- 🌙 **Dark mode** — Persistent, flash-free theme toggle
- 📱 **Responsive** — Mobile-first layout with a slide-out sidebar

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage, RLS)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Deployment:** Vercel

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/Ruhamah-chioma/expense-tracker.git
cd expense-tracker
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Database setup

In the Supabase SQL editor, create the tables and enable RLS:

```sql
-- Transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null,
  amount numeric not null,
  category text not null,
  note text,
  date date not null
);

-- Budgets
create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category text not null,
  limit_amount numeric not null,
  month text not null
);

alter table transactions enable row level security;
alter table budgets enable row level security;

create policy "own transactions" on transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own budgets" on budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

Also create a **public** Storage bucket named `avatars` for profile pictures.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📦 Deployment

Deployed on **Vercel** — import the repo, add the two environment variables, and deploy. 
Remember to add your production URL in **Supabase → Authentication → URL Configuration**.

## 📁 Project Structure

```
app/            → Routes (dashboard, transactions, budgets, insights, settings, auth)
components/     → Feature components (cards, charts, modals, forms)
components/ui/  → Reusable primitives (Button, Input, Modal)
lib/            → Supabase clients, auth hook, utilities
context/        → Theme provider (dark mode)
middleware.ts   → Route protection & session refresh
```

## 🙋 Author

Built with ❤️ by **Ruhamah Chioma** — [GitHub](https://github.com/Ruhamah-chioma)