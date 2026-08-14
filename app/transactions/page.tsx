import { createClient } from "@/lib/supabase-server";
import TransactionsView from "@/components/TransactionsView";
import AddTransactionButton from "@/components/AddTransactionButton";

export default async function Transactions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user?.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
  }

  const transactions = data || [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">All your transactions</p>
        </div>
        <AddTransactionButton />
      </div>

      <TransactionsView initialTransactions={transactions} />
    </div>
  );
}