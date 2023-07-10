import { db } from "@/lib/kysely";
import { Campaign, CampaignSchema, NewCampaign } from "@/lib/schema/campaigns";
import { getCampaigns } from "@/lib/campaigns";
import axios from "axios";

const newCampaign: NewCampaign = {
  name: "Test Campaign",
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  targetAudience: "Test Audience",
  budget: 5000,
  adGroups: JSON.stringify(["Test Group 1", "Test Group 2"]),
  keywords: JSON.stringify(["Test Keyword 1", "Test Keyword 2"]),
  status: "active",
};

const campaign: Campaign = {
  id: 1,
  name: "Test Campaign",
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  createdAt: new Date().toISOString(),
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

const initialCampaigns = Array(3)
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

jest.mock("axios");

describe("axios.get", () => {
  it("Returns 200 OK status", async () => {
    const res = { data: initialCampaigns, status: 200 };

    //@ts-expect-error
    axios.get.mockResolvedValue(res);

    const campaigns = await getCampaigns();

    const validatedCampaigns = campaigns.map((c) => CampaignSchema.parse(c));

    expect(campaigns).toEqual(validatedCampaigns);
  });
  it("Returns 500 status code", async () => {
    try {
      const campaigns = await getCampaigns();
    } catch (error) {
      expect(error?.toString()).toContain("Failed to fetch campaigns.");
    }
  });
});

afterAll(async () => {
  await db.destroy();
});
