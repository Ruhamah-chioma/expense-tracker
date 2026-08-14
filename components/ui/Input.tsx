import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-2.5 bg-white dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white focus:ring-2 outline-none transition-colors ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-200 dark:border-gray-600 focus:ring-blue-500"
        } ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}