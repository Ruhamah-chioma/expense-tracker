"use client";

import { useAuth } from "@/lib/useAuth";
import SettingsForm from "@/components/SettingsForm";

export default function Settings() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your profile and account</p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}