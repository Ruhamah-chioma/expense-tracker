import StatCard from "@/components/StatCard";
import TransactionItem from "@/components/TransactionItem";
import AddTransactionButton from "@/components/AddTransactionButton";
import { createClient } from "@/lib/supabase-server";
import { Transaction } from "@/types";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  
  // Middleware guarantees the user is logged in here
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user?.id)
    .order("date", { ascending: false });

  const transactions = (data as Transaction[]) || [];

  if (error) {
    console.error("Error fetching transactions:", error);
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
             Welcome back, {user?.user_metadata?.full_name || user?.email}
          </p>
        </div>
        <AddTransactionButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Balance"
          amount={balance}
          icon={Wallet}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-900/30"
        />
        <StatCard
          title="Income"
          amount={totalIncome}
          icon={TrendingUp}
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-50 dark:bg-green-900/30"
        />
        <StatCard
          title="Expenses"
          amount={totalExpenses}
          icon={TrendingDown}
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-50 dark:bg-red-900/30"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          <a href="/transactions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all
          </a>
        </div>
        
        {transactions.length > 0 ? (
          <div>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Click &quot;Add Transaction&quot; to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}