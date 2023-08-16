import CampaignsGrid from "@/app/components/CampaignsGrid";
import NewCampaignButton from "@/app/components/NewCampaignButton";

export default function CampaignsPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <NewCampaignButton />
      <CampaignsGrid />
    </div>
  );
}
