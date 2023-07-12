import { db } from "@/lib/kysely";
import { z } from "zod";
import { CampaignMetricsSchema } from "@/lib/schema/campaignMetrics";
import {
  CampaignTable,
  NewCampaignSchema,
  convertToCampaignAndValidate,
} from "@/lib/schema/campaigns";
import { NextRequest, NextResponse } from "next/server";
import { seed } from "@/lib/seed";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) + 1;
    const limit = Number(searchParams.get("limit"));
    const offset = (page - 1) * limit;
    const { countAll } = db.fn;

    const campaigns = await db
      .selectFrom("campaigns")
      .innerJoin(
        "campaignMetrics",
        "campaignMetrics.campaignId",
        "campaigns.id"
      )
      .selectAll()
      .select((qb) =>
        qb
          .selectFrom("campaigns")
          .select("id")
          .whereRef("campaignMetrics.campaignId", "=", "campaigns.id")
          .as("id")
      )
      .orderBy("campaigns.createdAt", "desc")
      .limit(limit)
      .offset(offset)
      .execute();

    const campaignsCount = await db
      .selectFrom("campaigns")
      .select(countAll().as("campaignsCount"))
      .executeTakeFirstOrThrow();

    const parsedCampaigns = campaigns.map(convertToCampaignAndValidate);

    return NextResponse.json(
      {
        totalPages: Number(campaignsCount.campaignsCount) / limit,
        currentPage: page,
        campaigns: parsedCampaigns,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid campaign details", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to get campaigns." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const newCampaign = NewCampaignSchema.parse(await req.json());

    const insertedCampaign = await db
      .insertInto("campaigns")
      .values(newCampaign)
      .returningAll()
      .executeTakeFirstOrThrow();

    const initialCampaignMetrics = CampaignMetricsSchema.parse({
      campaignId: insertedCampaign.id,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      averageCpc: 0,
      conversions: 0,
      costPerConversion: 0,
      conversionRate: 0,
    });

    await db
      .insertInto("campaignMetrics")
      .values(initialCampaignMetrics)
      .returningAll()
      .executeTakeFirstOrThrow();

    const campaignWithMetrics: CampaignTable = {
      ...insertedCampaign,
      campaignMetrics: initialCampaignMetrics,
    };

    const convertedCampaign = convertToCampaignAndValidate(campaignWithMetrics);

    return NextResponse.json(convertedCampaign, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid campaign details", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create campaign." },
      { status: 500 }
    );
  }
}
