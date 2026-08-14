"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTheme } from "@/context/ThemeProvider";
import { formatCurrency } from "@/lib/utils";

// Beautiful colors for the pie chart slices
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

interface InsightsChartsProps {
  categoryData: { name: string; value: number }[];
  monthlyData: { month: string; income: number; expenses: number }[];
}

export default function InsightsCharts({ categoryData, monthlyData }: InsightsChartsProps) {
  const { isDarkMode } = useTheme();

  // Colors that adapt to dark mode!
  const textColor = isDarkMode ? "#9ca3af" : "#6b7280";
  const gridColor = isDarkMode ? "#374151" : "#e5e7eb";
  const tooltipBg = isDarkMode ? "#1f2937" : "#ffffff";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* PIE CHART: Spending by Category */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Spending by Category (This Month)
        </h2>
        {categoryData.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${gridColor}`, borderRadius: 8, color: textColor }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No expenses this month yet</p>
          </div>
        )}
      </div>

      {/* BAR CHART: Income vs Expenses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Income vs Expenses (Last 6 Months)
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${gridColor}`, borderRadius: 8 }}
                cursor={{ fill: isDarkMode ? "#374151" : "#f3f4f6" }}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}