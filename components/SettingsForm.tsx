"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { refreshAuth } from "@/lib/useAuth";
import { User } from "@supabase/supabase-js";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";

interface SettingsFormProps {
  user: User;
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const metadata = (user.user_metadata || {}) as { full_name?: string; avatar_url?: string };

  const [name, setName] = useState(metadata.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(metadata.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = (metadata.full_name || user.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ---- Upload Profile Picture ----
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage("");
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB.");
      return;
    }

    setUploading(true);

    // Save as "USER-ID/avatar.png"
    const path = `${user.id}/avatar.png`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true }); // upsert = replace old picture

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    // Get the public URL of the uploaded image
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?updated=${Date.now()}`;

    // Save the URL into the user's metadata
    const { error: metaError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    if (metaError) {
      setError(metaError.message);
    } else {
      setAvatarUrl(publicUrl);
      await refreshAuth();
      setMessage("Profile picture updated!");
    }

    setUploading(false);
  };

  // ---- Save Name ----
  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setSavingName(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name.trim() },
    });

    if (error) {
      setError(error.message);
    } else {
      await refreshAuth();
      setMessage("Name updated!");
    }
    setSavingName(false);
  };

  // ---- Change Password ----
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated!");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSavingPassword(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Feedback Messages */}
      {message && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* PROFILE CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile</h2>

        {/* Avatar + Info */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            {avatarUrl ? (
              <Image
               src={avatarUrl}
               alt="Profile"
               width={80}
               height={80}
               className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-300">
                {initials}
              </div>
            )}

            {/* Camera Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              title="Change profile picture"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {metadata.full_name || "No name set"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Name Form */}
        <form onSubmit={handleSaveName}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Display Name
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Your name"
            />
            <button
              type="submit"
              disabled={savingName}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {savingName ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* PASSWORD CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Change Password</h2>

        <form onSubmit={handleSavePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Repeat new password"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}