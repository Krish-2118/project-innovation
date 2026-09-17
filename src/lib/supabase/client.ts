import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | undefined;

/**
 * Creates or retrieves a Supabase browser client.
 * Uses `@supabase/ssr` to automatically handle session sync via cookies.
 */
function sanitizeSupabaseUrl(url: string): string {
  return url.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

export function createClient(): SupabaseClient {
  if (typeof window !== "undefined" && browserClient) {
    return browserClient;
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set."
    );
  }

  const supabaseUrl = sanitizeSupabaseUrl(rawUrl);
  const client = createBrowserClient(supabaseUrl, supabaseKey);

  if (typeof window !== "undefined") {
    browserClient = client;
  }

  return client;
}
