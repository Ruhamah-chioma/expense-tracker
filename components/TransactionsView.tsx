"use client";

import { useState } from "react";
import TransactionFilters from "@/components/TransactionFilters";
import TransactionItem from "@/components/TransactionItem";
import { Transaction } from "@/types";

interface TransactionsViewProps {
  initialTransactions: Transaction[];
}

export default function TransactionsView({ initialTransactions }: TransactionsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "income" | "expense">("all");

  // Filter transactions locally in the browser (super fast!)
  const filteredTransactions = initialTransactions.filter((transaction) => {
    if (activeFilter !== "all" && transaction.type !== activeFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        transaction.note.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <>
      <TransactionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        {filteredTransactions.length > 0 ? (
          <div>
            {filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </>
  );
}