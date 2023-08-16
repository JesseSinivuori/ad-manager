import { db } from "@/app/lib/kysely";
import {
  NewCampaignSchema,
  convertToCampaignAndValidate,
} from "@/app/lib/schema/campaigns";
import { z } from "zod";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextApiRequest,
  { params: { id } }: { params: { id: string } },
  _res: NextApiResponse
) {
  try {
    const campaign = await db
      .selectFrom("campaigns")
      .innerJoin(
        "campaignMetrics",
        "campaignMetrics.campaignId",
        "campaigns.id"
      )
      .where("campaignId", "=", Number(id))
      .selectAll()
      .executeTakeFirstOrThrow();
    if (!campaign) {
      return NextResponse.json(
        { error: "Failed to get campaign." },
        { status: 400 }
      );
    }

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
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
  _res: NextResponse
) {
  try {
    const newCampaign = NewCampaignSchema.parse(await req.json());

    const updatedCampaign = await db
      .updateTable("campaigns")
      .set(newCampaign)
      .where("id", "=", Number(id))
      .returningAll()
      .executeTakeFirstOrThrow();

    const returnedCampaign = {
      ...updatedCampaign,
      adGroups: JSON.parse(updatedCampaign.adGroups),
      keywords: JSON.parse(updatedCampaign.keywords),
    };

    return NextResponse.json(returnedCampaign, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid campaign details", details: error.errors },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(
  _req: NextApiRequest,
  { params: { id } }: { params: { id: string } },
  _res: NextApiResponse
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
