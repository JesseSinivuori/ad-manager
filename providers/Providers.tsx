"use client";
import CampaignsProvider from "./CampaignsProvider";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CampaignsProvider>
      {children}
      <Toaster />
    </CampaignsProvider>
  );
}
