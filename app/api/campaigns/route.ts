import { db } from "@/app/lib/kysely";
import { z } from "zod";
import { CampaignMetricsTable } from "@/app/lib/schema/campaignMetrics";
import {
  CampaignTable,
  NewCampaignSchema,
  convertToCampaignAndValidate,
} from "@/app/lib/schema/campaigns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, _res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page"));
    const limit = Number(searchParams.get("limit"));
    const offset = page * limit;
    const { countAll } = db.fn;

    const campaigns = await db
      .selectFrom("campaigns")
      .innerJoin(
        "campaignMetrics",
        "campaignMetrics.campaignId",
        "campaigns.id"
      )
      .selectAll()
      .orderBy("campaigns.createdAt", "desc")
      .limit(limit)
      .offset(offset)
      .execute();

    if (!campaigns) {
      return NextResponse.json(
        { error: "Failed to get campaigns" },
        { status: 400 }
      );
    }

    const campaignsCount = await db
      .selectFrom("campaigns")
      .select(countAll().as("campaignsCount"))
      .executeTakeFirstOrThrow();

    if (!campaignsCount) {
      return NextResponse.json(
        { error: "Failed to get campaignsCount" },
        { status: 400 }
      );
    }

    const parsedCampaigns = campaigns.map(convertToCampaignAndValidate);

    return NextResponse.json(
      {
        totalPages: Math.ceil(Number(campaignsCount.campaignsCount) / limit),
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
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, _res: Response) {
  try {
    const newCampaign = NewCampaignSchema.parse(await req.json());

    const insertedCampaign = await db
      .insertInto("campaigns")
      .values(newCampaign)
      .returningAll()
      .executeTakeFirstOrThrow();

    if (!insertedCampaign) {
      return NextResponse.json(
        { error: "Failed to insert campaign" },
        { status: 400 }
      );
    }

    const initialCampaignMetrics: CampaignMetricsTable = {
      campaignId: insertedCampaign.id!,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      averageCpc: 0,
      conversions: 0,
      costPerConversion: 0,
      conversionRate: 0,
    };

    const insertedCampaignMetrics = await db
      .insertInto("campaignMetrics")
      .values(initialCampaignMetrics)
      .returningAll()
      .executeTakeFirstOrThrow();

    if (!insertedCampaignMetrics) {
      if (insertedCampaign.id) {
        await db
          .deleteFrom("campaigns")
          .where("id", "=", insertedCampaign.id)
          .executeTakeFirstOrThrow();
      }
      return NextResponse.json(
        { error: "Failed to insert campaignMetrics" },
        { status: 400 }
      );
    }

    const campaignWithMetrics: CampaignTable = {
      ...insertedCampaign,
      ...insertedCampaignMetrics,
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
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
