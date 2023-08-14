import { Campaign, NewCampaign } from "@/app/lib/schema/campaigns";

const newDate = new Date().toISOString();

export const newCampaign: NewCampaign = {
  name: "Test Campaign",
  startDate: newDate,
  endDate: newDate,
  targetAudience: "Test Audience",
  budget: 5000,
  adGroups: JSON.stringify(["Test Group 1", "Test Group 2"]),
  keywords: JSON.stringify(["Test Keyword 1", "Test Keyword 2"]),
  status: "active",
};

export const campaign: Campaign = {
  id: 1,
  name: "Test Campaign",
  startDate: newDate,
  endDate: newDate,
  createdAt: newDate,
  targetAudience: "Test Audience",
  budget: 5000,
  adGroups: ["Test Group 1", "Test Group 2"],
  keywords: ["Test Keyword 1", "Test Keyword 2"],
  status: "active",
  campaignMetrics: {
    averageCpc: 0,
    campaignId: 1,
    clicks: 0,
    conversionRate: 0,
    conversions: 0,
    costPerConversion: 0,
    ctr: 0,
    impressions: 0,
  },
};

export const initialCampaigns = Array(3)
  .fill(campaign)
  .map((campaign, i) => {
    return {
      ...campaign,
      id: campaign.id + i,
      campaignMetrics: {
        ...campaign.campaignMetrics,
        campaignId: campaign.campaignMetrics.campaignId + i,
      },
    };
  });
