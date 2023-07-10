import { db, sql } from "@/lib/kysely";

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

  const addCampaigns = await db
    .insertInto("campaigns")
    .values([
      {
        name: "Campaign 1",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        targetAudience: "Audience 1",
        budget: 10000,
        status: "active",
        adGroups: JSON.stringify(["Group 1", "Group 2", "Group 3"]),
        keywords: JSON.stringify(["Keyword 1", "Keyword 2", "Keyword 3"]),
      },
      {
        name: "Campaign 2",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        targetAudience: "Audience 2",
        budget: 20000,
        status: "active",
        adGroups: JSON.stringify(["Group 2.1", "Group 2.2", "Group 2.3"]),
        keywords: JSON.stringify(["Keyword 2.1", "Keyword 2.2", "Keyword 2.3"]),
      },
      {
        name: "Campaign 3",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        targetAudience: "Audience 3",
        budget: 30000,
        status: "active",
        adGroups: JSON.stringify(["Group 3.1", "Group 3.2", "Group 3.3"]),
        keywords: JSON.stringify(["Keyword 3.1", "Keyword 3.2", "Keyword 3.3"]),
      },
    ])
    .returning("id")
    .execute();

  const addCampaignMetrics = await db
    .insertInto("campaignMetrics")
    .values([
      {
        campaignId: addCampaigns[0].id!,
        impressions: 100000,
        clicks: 10000,
        ctr: 0.1,
        averageCpc: 2.0,
        conversions: 8000,
        costPerConversion: 2.5,
        conversionRate: 0.8,
      },
      {
        campaignId: addCampaigns[1].id!,
        impressions: 200000,
        clicks: 20000,
        ctr: 0.1,
        averageCpc: 2.0,
        conversions: 16000,
        costPerConversion: 2.5,
        conversionRate: 0.8,
      },
      {
        campaignId: addCampaigns[2].id!,
        impressions: 300000,
        clicks: 30000,
        ctr: 0.1,
        averageCpc: 2.0,
        conversions: 24000,
        costPerConversion: 2.5,
        conversionRate: 0.8,
      },
    ])
    .execute();

  return {
    createCampaignsTable,
    addCampaigns,
    createCampaignMetricsTable,
    addCampaignMetrics,
  };
}
