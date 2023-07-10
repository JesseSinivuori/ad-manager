"use client";
import { Campaign } from "@/lib/schema/campaigns";
import { createContext, useContext, useState } from "react";

type CampaignsContextType = {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
};

const CampaignsContext = createContext<CampaignsContextType | null>(null);

export default function CampaignsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  return (
    <CampaignsContext.Provider value={{ campaigns, setCampaigns }}>
      {children}
    </CampaignsContext.Provider>
  );
}

export const useCampaignsContext = () => {
  const context = useContext(CampaignsContext);
  if (!context) {
    throw new Error(
      "useCampaignsContext must be used within a CampaignsProvider"
    );
  }
  return context;
};
