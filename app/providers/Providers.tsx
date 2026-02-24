"use client";
import { Toaster } from "react-hot-toast";
import CampaignsProvider from "./CampaignsProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<CampaignsProvider>
			{children}
			<Toaster />
		</CampaignsProvider>
	);
}
