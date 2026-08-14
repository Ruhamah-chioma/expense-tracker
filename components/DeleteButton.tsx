"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  table: string;      // Which table to delete from
  id: string;         // Which row to delete
  itemName?: string;  // For the confirmation message
}

export default function DeleteButton({ table, id, itemName = "item" }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${itemName}?`)) {
      return;
    }

    setLoading(true);

    // Dynamic table name! Works for ANY table
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    if (error) {
      alert(`Error deleting ${itemName}: ` + error.message);
    } else {
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      title={`Delete ${itemName}`}
    >
      <Trash2 size={16} />
    </button>
  );
}