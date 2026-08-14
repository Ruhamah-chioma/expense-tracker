import { Transaction } from "@/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";
import EditTransactionButton from "@/components/EditTransactionButton";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isExpense = transaction.type === "expense";

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 group">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            isExpense ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20"
          }`}
        >
          {isExpense ? (
            <ArrowDownRight size={18} className="text-red-500" />
          ) : (
            <ArrowUpRight size={18} className="text-green-500" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{transaction.note}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {transaction.category} • {formatDate(transaction.date)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <p
          className={`font-semibold ${
            isExpense ? "text-red-500" : "text-green-500"
          }`}
        >
          {isExpense ? "-" : "+"}{formatCurrency(transaction.amount)}
        </p>
        
        {/* Edit & Delete buttons - appear on hover */}
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <EditTransactionButton transaction={transaction} />
          <DeleteButton table="transactions" id={transaction.id} itemName="transaction" />
        </div>
      </div>
    </div>
  );
}