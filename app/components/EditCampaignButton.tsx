"use client";
import { button } from "@/app/style";
import { Button } from "./UI/Button";
import { useState } from "react";
import CampaignDialog from "./CampaignDialog";
import { updateCampaignById } from "@/app/lib/fetch/campaigns";
import { useCampaignsContext } from "@/app/providers/CampaignsProvider";
import {
  NewCampaign,
  Campaign,
  NewCampaignSchema,
} from "@/app/lib/schema/campaigns";
import toast from "react-hot-toast";

export default function EditCampaignButton({ id }: { id: string }) {
  const { campaigns, setCampaigns } = useCampaignsContext();
  const [showUpdateCampaign, setShowUpdateCampaign] = useState(false);
  const selectedCampaign: Campaign | undefined = campaigns.find(
    (campaign) => campaign.id.toString() === id
  );
  if (!selectedCampaign) return;

  const handleUpdateCampaign = async (campaignToUpdate: NewCampaign) => {
    const campaignWithCurrentStatus = {
      ...campaignToUpdate,
      status: selectedCampaign.status,
    };
    const validatedCampaignToUpdate = NewCampaignSchema.parse(
      campaignWithCurrentStatus
    );

    const update = updateCampaignById(id, validatedCampaignToUpdate)
      .then((updatedCampaign) => {
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id.toString() !== id ? campaign : updatedCampaign
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });

    toast.promise(update, {
      loading: "Updating campaign...",
      success: "Campaign updated!",
      error: "Failed to update campaign.",
    });
  };

  return (
    <div>
      {selectedCampaign && (
        <CampaignDialog
          key={selectedCampaign.id}
          buttonText={"Update"}
          action={handleUpdateCampaign}
          showDialog={showUpdateCampaign}
          setShowDialog={setShowUpdateCampaign}
          name={{ value: selectedCampaign.name ?? "", title: "Name" }}
          startDate={{
            value: selectedCampaign.startDate ?? "",
            title: "Start Date",
          }}
          endDate={{
            value: selectedCampaign.endDate ?? "",
            title: "End Date",
          }}
          targetAudience={{
            value: selectedCampaign.targetAudience ?? "",
            title: "Target Audience",
          }}
          budgetNumber={{
            value: selectedCampaign.budget.toString() ?? "",
            title: "Budget",
          }}
          adGroups={{
            value:
              selectedCampaign.adGroups
                .map((adGroup) => adGroup.trim())
                .join(", ") ?? "",
            title: "Ad Groups",
          }}
          keywords={{
            value:
              selectedCampaign.keywords
                .map((keyword) => keyword.trim())
                .join(", ") ?? "",
            title: "Keywords",
          }}
        />
      )}
      <Button
        className={`${button.transparent}`}
        onClick={() => setShowUpdateCampaign(true)}
      >
        Edit
      </Button>
    </div>
  );
}
