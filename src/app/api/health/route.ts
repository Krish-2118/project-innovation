import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("events").select("id").limit(1);

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "Supabase PostgreSQL",
      connected: !error,
      service: "INNOVISION 2026 Core API",
    });
  } catch (error: unknown) {
    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Service health check degraded."
        : error instanceof Error
        ? error.message
        : "Health check error";

    return NextResponse.json(
      {
        status: "unhealthy",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
