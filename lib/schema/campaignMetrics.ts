import { z } from "zod";

export const CampaignMetricsSchema = z.object({
  campaignId: z.number(), // Foreign key to the associated campaign
  impressions: z.number(),
  clicks: z.number(),
  ctr: z.number(),
  averageCpc: z.number(),
  conversions: z.number(),
  costPerConversion: z.number(),
  conversionRate: z.number(),
});

export type CampaignMetricsTable = z.infer<typeof CampaignMetricsSchema>;
