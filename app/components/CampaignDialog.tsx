"use client";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import Dialog from "./UI/Dialog";
import dayjs from "dayjs";
import { NewCampaign, NewCampaignSchema } from "@/app/lib/schema/campaigns";

type CampaignDialogProps = {
  name?: {
    value: string;
    title: string;
  };
  startDate?: {
    value: string;
    title: string;
  };
  endDate?: {
    value: string;
    title: string;
  };
  targetAudience?: {
    value: string;
    title: string;
  };
  budgetNumber?: {
    value: string;
    title: string;
  };
  adGroups?: {
    value: string;
    title: string;
  };
  keywords?: {
    value: string;
    title: string;
  };
  showDialog: boolean;
  setShowDialog: React.Dispatch<SetStateAction<boolean>>;
  action: (campaignToCreate: NewCampaign) => Promise<void>;
  buttonText: string;
};

export default function CampaignDialog(props: CampaignDialogProps) {
  const {
    name,
    startDate,
    endDate,
    targetAudience,
    budgetNumber,
    adGroups,
    keywords,
    showDialog,
    setShowDialog,
    action,
    buttonText,
  } = props;

  const initialNewCampaign = useMemo(
    () => ({
      name: {
        value: name?.value ?? "",
        title: name?.title ?? "Name",
      },
      startDate: {
        value: startDate?.value ?? dayjs().toDate().toLocaleDateString(),
        title: startDate?.title ?? "Start Date",
      },
      endDate: {
        value:
          endDate?.value ?? dayjs().add(7, "day").toDate().toLocaleDateString(),
        title: endDate?.title ?? "End Date",
      },
      targetAudience: {
        value: targetAudience?.value ?? "",
        title: targetAudience?.title ?? "Target Audience",
      },
      budgetNumber: {
        value: budgetNumber?.value ?? "",
        title: budgetNumber?.title ?? "Budget",
      },
      adGroups: {
        value: adGroups?.value ?? "",
        title: adGroups?.title ?? "Ad Groups",
      },
      keywords: {
        value: keywords?.value ?? "",
        title: keywords?.title ?? "Keywords",
      },
    }),
    [
      adGroups?.title,
      adGroups?.value,
      budgetNumber?.title,
      budgetNumber?.value,
      endDate?.title,
      endDate?.value,
      keywords?.title,
      keywords?.value,
      name?.title,
      name?.value,
      startDate?.title,
      startDate?.value,
      targetAudience?.title,
      targetAudience?.value,
    ]
  );

  const [newCampaign, setNewCampaign] = useState(initialNewCampaign);

  useEffect(() => {
    setNewCampaign(initialNewCampaign);
  }, [
    name,
    startDate,
    endDate,
    targetAudience,
    budgetNumber,
    adGroups,
    keywords,
    initialNewCampaign,
  ]);

  const handleCreateCampaign = async () => {
    try {
      const campaignToCreate: NewCampaign = NewCampaignSchema.parse({
        name: newCampaign.name.value,
        startDate: new Date(newCampaign.startDate.value).toISOString(),
        endDate: new Date(newCampaign.endDate.value).toISOString(),
        targetAudience: newCampaign.targetAudience.value,
        budget: Number(newCampaign.budgetNumber.value),
        adGroups: JSON.stringify(newCampaign.adGroups.value.split(",")),
        keywords: JSON.stringify(newCampaign.keywords.value.split(",")),
        status:
          newCampaign.startDate.value === new Date().toLocaleDateString()
            ? "active"
            : "paused",
      });

      if (campaignToCreate) {
        await action(campaignToCreate);
        setNewCampaign(initialNewCampaign);
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create campaign.");
    }
  };

  return (
    <Dialog
      values={newCampaign}
      setValues={setNewCampaign}
      buttonText={buttonText}
      show={showDialog}
      setShow={setShowDialog}
      handleClick={handleCreateCampaign}
    />
  );
}
