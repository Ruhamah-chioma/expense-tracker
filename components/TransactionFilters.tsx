"use client";

import { Search } from "lucide-react";

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: "all" | "income" | "expense";
  onFilterChange: (filter: "all" | "income" | "expense") => void;
}

export default function TransactionFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: TransactionFiltersProps) {
  const filters = [
    { id: "all" as const, label: "All" },
    { id: "income" as const, label: "Income" },
    { id: "expense" as const, label: "Expenses" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}