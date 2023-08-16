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
  CampaignSchema,
} from "@/app/lib/schema/campaigns";
import toast from "react-hot-toast";

export default function EditCampaignButton({ id }: { id: string }) {
  const { campaigns, setCampaigns } = useCampaignsContext();
  const [showUpdateCampaignDialog, setShowUpdateCampaignDialog] =
    useState(false);
  const selectedCampaign: Campaign | undefined = campaigns.find(
    (campaign) => campaign.id.toString() === id
  );
  if (!selectedCampaign) return;

  const handleUpdateCampaign = async (campaignToUpdate: NewCampaign) => {
    const update = updateCampaignById(id, campaignToUpdate)
      .then((updatedCampaign) => {
        const updatedCampaignWithMetrics = CampaignSchema.parse({
          ...selectedCampaign,
          name: updatedCampaign.name,
          startDate: updatedCampaign.startDate,
          endDate: updatedCampaign.endDate,
          targetAudience: updatedCampaign.targetAudience,
          budget: updatedCampaign.budget,
          status: updatedCampaign.status,
          adGroups: updatedCampaign.adGroups,
          keywords: updatedCampaign.keywords,
        });
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id.toString() !== id
              ? campaign
              : updatedCampaignWithMetrics
          )
        );
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error);
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
          showDialog={showUpdateCampaignDialog}
          setShowDialog={setShowUpdateCampaignDialog}
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
              [...selectedCampaign.adGroups]
                .map((adGroup) => adGroup.trim())
                .join(", ") ?? "",
            title: "Ad Groups",
          }}
          keywords={{
            value:
              [...selectedCampaign.keywords]
                .map((keyword) => keyword.trim())
                .join(", ") ?? "",
            title: "Keywords",
          }}
        />
      )}
      <Button
        className={`${button.transparent}`}
        onClick={() => setShowUpdateCampaignDialog(true)}
      >
        Edit
      </Button>
    </div>
  );
}
