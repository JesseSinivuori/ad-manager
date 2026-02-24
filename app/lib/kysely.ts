import { createKysely } from "@vercel/postgres-kysely";
import type { CampaignMetricsTable } from "./schema/campaignMetrics";
import type { CampaignTable } from "./schema/campaigns";

// Keys of this interface are table names.
export interface Database {
	campaigns: CampaignTable;
	campaignMetrics: CampaignMetricsTable;
}

export const db = createKysely<Database>();
export { sql } from "kysely";
