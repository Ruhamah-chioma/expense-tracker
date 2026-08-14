import { createClient } from "@/lib/supabase-server";
import InsightsCharts from "@/components/InsightsCharts";
import { Transaction } from "@/types";

export default async function Insights() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all of the user's transactions
  const { data } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user?.id);

  const transactions = (data as Transaction[]) || [];

  // Current month key, e.g. "2026-08"
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // ---- CALCULATION 1: Expenses by category (this month) ----
  const categoryMap: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.type === "expense" && t.date.startsWith(currentMonth)) {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
    }
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  // ---- CALCULATION 2: Income vs Expenses for last 6 months ----
  const monthlyData: { month: string; income: number; expenses: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short" });

    let income = 0;
    let expenses = 0;
    transactions.forEach((t) => {
      if (t.date.startsWith(key)) {
        if (t.type === "income") income += Number(t.amount);
        else expenses += Number(t.amount);
      }
    });

    monthlyData.push({ month: label, income, expenses });
  }

  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Insights</h1>
        <p className="text-gray-600 dark:text-gray-400">Your financial analytics for {monthName}</p>
      </div>

      <InsightsCharts categoryData={categoryData} monthlyData={monthlyData} />
    </div>
  );
}