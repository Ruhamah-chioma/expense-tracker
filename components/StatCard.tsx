import { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatCard({ title, amount, icon: Icon, iconColor, iconBg }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(amount)}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon size={24} className={iconColor} />
        </div>
      </div>
    </div>
  );
}