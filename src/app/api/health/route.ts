import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Ping the database to verify the connection works
    await db.command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "Successfully connected to MongoDB!",
      database: db.databaseName,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error connecting to database";
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
