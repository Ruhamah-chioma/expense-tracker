import { Budget } from "@/types";
import DeleteButton from "@/components/DeleteButton";
import EditBudgetButton from "@/components/EditBudgetButton";
import { formatCurrency } from "@/lib/utils";

interface BudgetCardProps {
  budget: Budget;
  spent: number;
}

export default function BudgetCard({ budget, spent }: BudgetCardProps) {
  const limit = Number(budget.limit_amount);
  
  const rawPercentage = limit > 0 ? (spent / limit) * 100 : 0;
  const barWidth = Math.min(rawPercentage, 100);
  
  // CHANGE: >= instead of >
  const reachedLimit = spent >= limit; 
  const warning = rawPercentage >= 70 && !reachedLimit;

  const barColor = reachedLimit ? "bg-red-500" : warning ? "bg-yellow-500" : "bg-green-500";
  const textColor = reachedLimit ? "text-red-500" : warning ? "text-yellow-500" : "text-green-500";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors group">
      
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity mr-2">
            <EditBudgetButton budget={budget} />
            <DeleteButton table="budgets" id={budget.id} itemName="budget" />
          </div>
          
          <span className={`text-sm font-bold ${textColor}`}>
            {Math.round(rawPercentage)}%
          </span>
        </div>
      </div>

      <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {formatCurrency(spent)} spent
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          of {formatCurrency(limit)}
        </span>
      </div>

      {/* NEW LOGIC: Smart text depending on if they hit exactly the limit or went over */}
      {reachedLimit && (
        <p className="mt-3 text-sm font-medium text-red-500">
          {spent > limit 
            ? `⚠️ Over budget by ${formatCurrency(spent - limit)}!` 
            : `⚠️ You have reached your budget limit!`}
        </p>
      )}
    </div>
  );
}