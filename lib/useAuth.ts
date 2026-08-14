import { useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

let cachedUser: User | null | undefined = undefined;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange((event, session) => {
    cachedUser = session?.user || null;
    emitChange();
  });

  if (cachedUser === undefined) {
    supabase.auth.getUser().then(({ data }) => {
      cachedUser = data.user || null;
      emitChange();
    });
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return cachedUser;
}

function getServerSnapshot() {
  return null;
}

// NEW: Function to manually refresh auth state
export async function refreshAuth() {
  const { data } = await supabase.auth.getUser();
  cachedUser = data.user || null;
  emitChange();
}

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    user,
    loading: user === undefined,
    isAuthenticated: !!user,
  };
}