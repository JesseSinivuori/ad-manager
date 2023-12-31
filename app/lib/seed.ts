import { db, sql } from "@/app/lib/kysely";
import dayjs from "dayjs";
import { NewCampaignSchema } from "./schema/campaigns";

export const createCampaignsTable = async () =>
  await db.schema
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

export const createCampaignMetricsTable = async () =>
  await db.schema
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

export async function seed() {
  console.log(`Starting to create "campaigns" table...`);
  await createCampaignsTable();
  console.log(`Created "campaigns" table`);

  await createCampaignMetricsTable();
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

  return {
    createCampaignsTable,
    addCampaigns,
    createCampaignMetricsTable,
  };
}
