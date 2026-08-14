export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number | string;  // Supabase might return as string
  category: string;
  note: string;
  date: string;
  created_at?: string;  // Optional field added by Supabase
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  limit_amount: number | string;
  month: string; // e.g., "2026-08"
}