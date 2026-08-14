"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Plus } from "lucide-react";

export default function AddBudgetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    // Get current month in "2026-08" format
    const currentMonth = new Date().toISOString().slice(0, 7);

    const { error } = await supabase.from("budgets").insert({
      user_id: user.id,
      category,
      limit_amount: parseFloat(limitAmount),
      month: currentMonth,
    });

    if (error) {
      alert("Error adding budget: " + error.message);
    } else {
      setIsOpen(false);
      setCategory("");
      setLimitAmount("");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <Button variant="primary" icon={Plus} onClick={() => setIsOpen(true)}>
        Add Budget
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Budget"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Food, Transport"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monthly Limit
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Budget"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
