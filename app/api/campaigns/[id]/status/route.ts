import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, sql } from "@/app/lib/kysely";

export async function PATCH(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const updatedCampaign = await db
			.updateTable("campaigns")
			.set({
				status: sql`CASE WHEN status = 'active' THEN 'paused' ELSE 'active' END`,
			})
			.where("id", "=", Number(id))
			.returningAll()
			.executeTakeFirstOrThrow();

		const returnedCampaign = {
			...updatedCampaign,
			adGroups: JSON.parse(updatedCampaign.adGroups),
			keywords: JSON.parse(updatedCampaign.keywords),
		};

		return NextResponse.json(returnedCampaign, { status: 200 });
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
