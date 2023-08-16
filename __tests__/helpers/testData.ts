import { CampaignMetricsTable } from "@/app/lib/schema/campaignMetrics";
import { Campaign, NewCampaign } from "@/app/lib/schema/campaigns";

export const date = new Date().toISOString();

export const mockNewCampaign: NewCampaign = {
  name: "Test Campaign",
  startDate: date,
  endDate: date,
  targetAudience: "Test Audience",
  budget: 5000,
  adGroups: JSON.stringify(["Test Group 1", "Test Group 2"]),
  keywords: JSON.stringify(["Test Keyword 1", "Test Keyword 2"]),
  status: "active",
};

export const mockDbAddedProps = {
  id: 1,
  createdAt: date,
  updatedAt: date,
};

export const mockCampaignMetrics: CampaignMetricsTable = {
  averageCpc: 0,
  campaignId: 1,
  clicks: 0,
  conversionRate: 0,
  conversions: 0,
  costPerConversion: 0,
  ctr: 0,
  impressions: 0,
};

export const mockCampaign: Campaign = {
  id: 1,
  name: "Test Campaign",
  startDate: date,
  endDate: date,
  createdAt: date,
  updatedAt: date,
  targetAudience: "Test Audience",
  budget: 5000,
  adGroups: ["Test Group 1", "Test Group 2"],
  keywords: ["Test Keyword 1", "Test Keyword 2"],
  status: "active",
  ...mockCampaignMetrics,
};

export const mockInitialCampaigns = Array(3)
  .fill(mockCampaign)
  .map((campaign, i) => {
    return {
      ...campaign,
      id: campaign.id + i,
      campaignId: campaign.campaignId + i,
    };
  });
