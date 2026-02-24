import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/app/lib/kysely";
import {
	convertToCampaignAndValidate,
	NewCampaignSchema,
} from "@/app/lib/schema/campaigns";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const campaign = await db
			.selectFrom("campaigns")
			.innerJoin(
				"campaignMetrics",
				"campaignMetrics.campaignId",
				"campaigns.id",
			)
			.where("campaignId", "=", Number(id))
			.selectAll()
			.executeTakeFirstOrThrow();
		if (!campaign) {
			return NextResponse.json(
				{ error: "Failed to get campaign." },
				{ status: 400 },
			);
		}

		const convertedCampaign = convertToCampaignAndValidate(campaign);
		return NextResponse.json(convertedCampaign);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid campaign details", details: error.errors },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ error: "Internal server error." },
			{ status: 500 },
		);
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const newCampaign = NewCampaignSchema.parse(await req.json());
		const { status: _status, ...campaignDetailsToUpdate } = newCampaign;

		const updatedCampaign = await db
			.updateTable("campaigns")
			.set(campaignDetailsToUpdate)
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
				{ status: 400 },
			);
		} else {
			return NextResponse.json(
				{ error: "Internal server error." },
				{ status: 500 },
			);
		}
	}
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
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
			{ status: 500 },
		);
	}
}
