"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { createCampaign } from "@/app/lib/fetch/campaigns";
import type { NewCampaign } from "@/app/lib/schema/campaigns";
import { useCampaignsContext } from "@/app/providers/CampaignsProvider";
import { button } from "@/app/style";
import CampaignDialog from "./CampaignDialog";
import { Button } from "./UI/Button";

export default function NewCampaignButton() {
	const { setCampaigns } = useCampaignsContext();
	const [showCreateCampaign, setShowCreateCampaign] = useState(false);

	const handleCreateCampaign = async (campaignToCreate: NewCampaign) => {
		const create = createCampaign(campaignToCreate)
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
