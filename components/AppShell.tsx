"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  
  // Check if we're on an auth page
  const isAuthPage = pathname.startsWith("/auth");

  // Auth pages: No sidebar, just the content
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Dashboard pages: With sidebar
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}