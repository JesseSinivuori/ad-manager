import { db } from "@/lib/kysely";
import {
  NewCampaignSchema,
  convertToCampaignAndValidate,
} from "@/lib/schema/campaigns";
import { z } from "zod";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextApiRequest,
  { params: { id } }: { params: { id: string } },
  res: NextApiResponse
) {
  try {
    const campaign = await db
      .selectFrom("campaigns")
      .leftJoin("campaignMetrics", "campaignMetrics.campaignId", "campaigns.id")
      .selectAll()
      .where("id", "=", Number(id))
      .executeTakeFirstOrThrow();

    const convertedCampaign = convertToCampaignAndValidate(campaign);
    return NextResponse.json(convertedCampaign);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid campaign details", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to get campaign." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
  res: NextResponse
) {
  try {
    const newCampaign = NewCampaignSchema.parse(await req.json());

    const updatedCampaign = await db
      .updateTable("campaigns")
      .set(newCampaign)
      .where("id", "=", Number(id))
      .returningAll()
      .executeTakeFirstOrThrow();

    const convertedCampaign = convertToCampaignAndValidate(updatedCampaign);

    return NextResponse.json(convertedCampaign);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid campaign details", details: error.errors },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to update campaign." },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(
  req: NextApiRequest,
  { params: { id } }: { params: { id: string } },
  res: NextApiResponse
) {
  try {
    await db
      .deleteFrom("campaignMetrics")
      .where("campaignId", "=", Number(id))
      .executeTakeFirstOrThrow();

    await db
      .deleteFrom("campaigns")
      .where("id", "=", Number(id))
      .executeTakeFirstOrThrow();

    return NextResponse.json({ status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete campaign." },
      { status: 500 }
    );
  }
}
