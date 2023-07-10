import CampaignsGrid from "@/components/CampaignsGrid";
import NewCampaignButton from "@/components/NewCampaignButton";

export default function CampaignsPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <NewCampaignButton />
      <CampaignsGrid />
    </div>
  );
}
