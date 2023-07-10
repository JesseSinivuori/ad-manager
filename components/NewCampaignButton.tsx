"use client";
import { button } from "@/app/style";
import { Button } from "./UI/Button";
import { useState } from "react";
import CampaignDialog from "./CampaignDialog";
import { createCampaign } from "@/lib/campaigns";
import { useCampaignsContext } from "@/providers/CampaignsProvider";
import { NewCampaign, NewCampaignSchema } from "@/lib/schema/campaigns";
import toast from "react-hot-toast";

export default function NewCampaignButton() {
  const { setCampaigns } = useCampaignsContext();
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  const handleCreateCampaign = async (campaignToCreate: NewCampaign) => {
    const validatedCampaignToCreate = NewCampaignSchema.parse(campaignToCreate);
    const create = createCampaign(validatedCampaignToCreate)
      .then((createdCampaign) => {
        setCampaigns((prevCampaigns) => [createdCampaign, ...prevCampaigns]);
      })
      .catch((error) => {
        console.error(error);
      });

    toast.promise(create, {
      loading: "Creating campaign...",
      success: "Campaign created!",
      error: "Failted to create campaign.",
    });
  };

  return (
    <div className="p-8">
      <CampaignDialog
        buttonText={"Create"}
        action={handleCreateCampaign}
        showDialog={showCreateCampaign}
        setShowDialog={setShowCreateCampaign}
      />
      <Button
        className={`${button.violet}`}
        onClick={() => setShowCreateCampaign(true)}
      >
        New campaign
      </Button>
    </div>
  );
}
