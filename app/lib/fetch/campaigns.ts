import axios from "axios";
import { Campaign, NewCampaign } from "../schema/campaigns";

const baseUrl = "/api/campaigns";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const res = await axios.get(`${baseUrl}`);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch campaigns.");
  }
}

export async function createCampaign(campaign: NewCampaign): Promise<Campaign> {
  try {
    const res = await axios.post(`${baseUrl}`, campaign);
    return res.data;
  } catch (error) {
    throw new Error("Failed to create campaign.");
  }
}

export async function updateCampaignById(
  id: string,
  updatedCampaign: NewCampaign
): Promise<Campaign> {
  try {
    const res = await axios.put(`${baseUrl}/${id}`, updatedCampaign);
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to update campaign with id ${id}`);
  }
}

export async function deleteCampaignById(id: string) {
  try {
    const res = await axios.delete(`${baseUrl}/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to delete campaign with id ${id}`);
  }
}
