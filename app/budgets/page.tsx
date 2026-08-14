import { createClient } from "@/lib/supabase-server";
import BudgetCard from "@/components/BudgetCard";
import AddBudgetButton from "@/components/AddBudgetButton";
import { Budget, Transaction } from "@/types";

export default async function Budgets() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Current month in "2026-08" format
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  // Pretty month name for the header (e.g., "August 2026")
  const monthName = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // 1. Fetch this month's budgets
  const { data: budgetsData } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user?.id)
    .eq("month", currentMonth);

  // 2. Fetch all transactions to calculate spending
  const { data: transactionsData } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user?.id);

  const budgets = (budgetsData as Budget[]) || [];
  const transactions = (transactionsData as Transaction[]) || [];

  // 3. Calculate how much was spent per category THIS month
  const spentByCategory: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.type === "expense" && t.date.startsWith(currentMonth)) {
      const key = t.category.toLowerCase();
      spentByCategory[key] = (spentByCategory[key] || 0) + Number(t.amount);
    }
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Budgets</h1>
          <p className="text-gray-600 dark:text-gray-400">Your spending limits for {monthName}</p>
        </div>
        <AddBudgetButton />
      </div>

      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              spent={spentByCategory[budget.category.toLowerCase()] || 0}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No budgets for this month yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Click &quot;Add Budget&quot; to set a spending limit
          </p>
        </div>
      )}
    </div>
  );
}