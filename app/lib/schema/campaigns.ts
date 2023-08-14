import { z } from "zod";
import { CampaignMetricsSchema } from "./campaignMetrics";

export const datetime = z.string().datetime();

const stringArray = z.array(z.string());

function isJsonParsable(value: any) {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}

export const CampaignTableSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  startDate: datetime,
  endDate: datetime,
  targetAudience: z.string(),
  budget: z.number(),
  status: z.literal("active").or(z.literal("paused")),
  adGroups: z.string().refine(isJsonParsable, {
    message: "AdGroups should be a JSON parsable string array",
  }), // JSON parsed string converted to a string array
  keywords: z.string().refine(isJsonParsable, {
    message: "Keywords should be a JSON parsable string array",
  }), // JSON parsed string converted to a string array
  createdAt: datetime.optional(),
  updatedAt: datetime.optional(),
  campaignMetrics: CampaignMetricsSchema.optional(),
});
export type CampaignTable = z.infer<typeof CampaignTableSchema>;

export const CampaignSchema = CampaignTableSchema.omit({
  adGroups: true,
  keywords: true,
  createdAt: true,
  id: true,
}).and(
  z.object({
    adGroups: stringArray, // JSON parsed string converted to a string array
    keywords: stringArray, // JSON parsed string converted to a string array
    createdAt: datetime,
    id: z.number(),
  })
);
export type Campaign = z.infer<typeof CampaignSchema>;

export const NewCampaignSchema = CampaignTableSchema.omit({
  createdAt: true,
  id: true,
  impressions: true,
  clicks: true,
  ctr: true,
  averageCpc: true,
  conversions: true,
  costPerConversion: true,
  conversionRate: true,
  campaignMetrics: true,
});
export type NewCampaign = z.infer<typeof NewCampaignSchema>;

//Converts CampaignTable (from db) => Campaign (to frontend)
export function convertToCampaignAndValidate(
  campaign: CampaignTable
): Campaign {
  const convertedCampaign: Campaign = CampaignSchema.parse({
    ...campaign,
    id: campaign.id!,
    createdAt: new Date(campaign.createdAt!).toISOString(),
    updatedAt: new Date(campaign.updatedAt!).toISOString(),
    adGroups: JSON.parse(campaign.adGroups),
    keywords: JSON.parse(campaign.keywords),
    campaignMetrics: {
      campaignId: campaign.campaignMetrics?.campaignId ?? 0,
      impressions: campaign.campaignMetrics?.impressions ?? 0,
      clicks: campaign.campaignMetrics?.clicks ?? 0,
      ctr: campaign.campaignMetrics?.ctr ?? 0,
      averageCpc: campaign.campaignMetrics?.averageCpc ?? 0,
      conversions: campaign.campaignMetrics?.conversions ?? 0,
      costPerConversion: campaign.campaignMetrics?.costPerConversion ?? 0,
      conversionRate: campaign.campaignMetrics?.conversionRate ?? 0,
    },
  });
  return convertedCampaign;
}
