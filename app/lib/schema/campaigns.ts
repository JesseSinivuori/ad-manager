import { z } from "zod";

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

function isJsonStringifyable(value: any) {
  try {
    JSON.stringify(value);
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
    message: "adGroups should be a JSON parsable string array",
  }), // JSON parsed string converted to a string array
  keywords: z.string().refine(isJsonParsable, {
    message: "keywords should be a JSON parsable string array",
  }), // JSON parsed string converted to a string array
  createdAt: datetime.optional(),
  updatedAt: datetime.optional(),
  campaignId: z.number().optional(), // Foreign key to the associated campaign
  impressions: z.number().optional(),
  clicks: z.number().optional(),
  ctr: z.number().optional(),
  averageCpc: z.number().optional(),
  conversions: z.number().optional(),
  costPerConversion: z.number().optional(),
  conversionRate: z.number().optional(),
});
export type CampaignTable = z.infer<typeof CampaignTableSchema>;

export const CampaignSchema = CampaignTableSchema.omit({
  adGroups: true,
  keywords: true,
  createdAt: true,
  id: true,
}).and(
  z.object({
    adGroups: stringArray.refine(isJsonStringifyable, {
      message: "adGroups should be a JSON stringifyable string array",
    }), // JSON parsed string converted to a string array
    keywords: stringArray.refine(isJsonStringifyable, {
      message: "keywords should be a JSON stringifyable string array",
    }), // JSON parsed string converted to a string array,
    createdAt: datetime,
    id: z.number(),
  })
);
export type Campaign = z.infer<typeof CampaignSchema>;

export const NewCampaignSchema = z.object({
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
});

export type NewCampaign = z.infer<typeof NewCampaignSchema>;

//Converts CampaignTable (from db) => Campaign (to frontend)
export function convertToCampaignAndValidate(
  campaign: CampaignTable
): Campaign {
  const convertedCampaign: Campaign = CampaignSchema.parse({
    ...campaign,
    createdAt: new Date(campaign.createdAt!).toISOString(),
    updatedAt: new Date(campaign.updatedAt!).toISOString(),
    adGroups: JSON.parse(campaign.adGroups),
    keywords: JSON.parse(campaign.keywords),
    ctr: Number(campaign.ctr),
    averageCpc: Number(campaign.averageCpc),
    costPerConversion: Number(campaign.costPerConversion),
    conversionRate: Number(campaign.conversionRate),
  });

  return convertedCampaign;
}
