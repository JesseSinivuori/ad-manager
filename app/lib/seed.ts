import { db, sql } from "@/app/lib/kysely";
import dayjs from "dayjs";
import { CampaignMetricsSchema } from "./schema/campaignMetrics";
import { NewCampaignSchema } from "./schema/campaigns";

export async function seed() {
  console.log(`Starting to create "campaigns" table...`);
  const createCampaignsTable = await db.schema
    .createTable("campaigns")
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("name", "varchar(255)", (cb) => cb.notNull())
    .addColumn("startDate", "varchar(255)", (cb) => cb.notNull())
    .addColumn("endDate", "varchar(255)", (cb) => cb.notNull())
    .addColumn("targetAudience", "varchar(255)", (cb) => cb.notNull())
    .addColumn("budget", "integer", (cb) => cb.notNull())
    .addColumn("status", "varchar(255)", (cb) => cb.notNull())
    .addColumn("adGroups", "text", (cb) => cb.notNull())
    .addColumn("keywords", "text", (cb) => cb.notNull())
    .addColumn("createdAt", sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`)
    )
    .addColumn("updatedAt", sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`)
    )
    .execute();
  console.log(`Created "campaigns" table`);

  const createCampaignMetricsTable = await db.schema
    .createTable("campaignMetrics")
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("campaignId", "integer", (cb) => cb.notNull())
    .addColumn("impressions", "integer", (cb) => cb.notNull())
    .addColumn("clicks", "integer", (cb) => cb.notNull())
    .addColumn("ctr", "numeric", (cb) => cb.notNull())
    .addColumn("averageCpc", "numeric", (cb) => cb.notNull())
    .addColumn("conversions", "integer", (cb) => cb.notNull())
    .addColumn("costPerConversion", "numeric", (cb) => cb.notNull())
    .addColumn("conversionRate", "numeric", (cb) => cb.notNull())
    .addColumn("createdAt", sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`)
    )
    .addColumn("updatedAt", sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`)
    )
    .addForeignKeyConstraint(
      "campaignMetricsCampaignIdForeignKey",
      ["campaignId"],
      "campaigns",
      ["id"]
    )
    .execute();

  console.log(`Created "campaignMetrics" table`);

  const campaigns = Array(30)
    .fill({})
    .map((_c, i) => {
      return NewCampaignSchema.parse({
        name: `Campaign ${i}`,
        startDate: dayjs().add(i).toISOString(),
        endDate: dayjs()
          .add(7 + i)
          .toISOString(),
        targetAudience: `Audience ${i}`,
        budget: 1000 * i,
        status: "active",
        adGroups: JSON.stringify(["Group 1", "Group 2", "Group 3"]),
        keywords: JSON.stringify(["Keyword 1", "Keyword 2", "Keyword 3"]),
      });
    });

  const addCampaigns = await db
    .insertInto("campaigns")
    .values(campaigns)
    .returning("id")
    .execute();

  const campaignMetrics = Array(30)
    .fill({})
    .map((_m, i) => {
      console.log(addCampaigns);
      return CampaignMetricsSchema.parse({
        campaignId: addCampaigns[i].id,
        impressions: 10000 * i,
        clicks: 1000 * i,
        ctr: 0.1 * i,
        averageCpc: 2.0 * i,
        conversions: 8000 * i,
        costPerConversion: 2.5 * i,
        conversionRate: 0.8 * i,
      });
    });

  const addCampaignMetrics = await db
    .insertInto("campaignMetrics")
    .values(campaignMetrics)
    .execute();

  return {
    createCampaignsTable,
    addCampaigns,
    createCampaignMetricsTable,
    //addCampaignMetrics,
  };
}
