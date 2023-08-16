import { db } from "@/app/lib/kysely";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const campaignMetrics = await db
      .selectFrom("campaignMetrics")
      .selectAll()
      .execute();

    return NextResponse.json(campaignMetrics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get campaign metrics" },
      { status: 500 }
    );
  }
}
