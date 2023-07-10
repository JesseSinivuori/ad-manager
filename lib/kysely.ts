import { createKysely } from "@vercel/postgres-kysely";
import { CampaignTable } from "./schema/campaigns";
import { CampaignMetricsTable } from "./schema/campaignMetrics";

// Keys of this interface are table names.
export interface Database {
  campaigns: CampaignTable;
  campaignMetrics: CampaignMetricsTable;
}

export const db = createKysely<Database>();
export { sql } from "kysely";
