import axios from "axios";
import {
	createCampaign,
	deleteCampaignById,
	getCampaigns,
	toggleCampaignStatusById,
	updateCampaignById,
} from "@/app/lib/fetch/campaigns";
import { convertToCampaignAndValidate } from "@/app/lib/schema/campaigns";
import {
	mockCampaign,
	mockCampaignMetrics,
	mockDbAddedProps,
	mockInitialCampaigns,
	mockNewCampaign,
} from "./helpers/testData";

jest.mock("axios");

beforeEach(() => {
	jest.clearAllMocks();
});

describe("mockCampaign API Fetch Functions", () => {
	describe("getCampaigns", () => {
		it("successfully gets campaigns", async () => {
			const res = { data: mockInitialCampaigns, status: 200 };

			//@ts-expect-error
			axios.get.mockResolvedValueOnce(res);

			const campaigns = await getCampaigns();

			expect(campaigns).toEqual(mockInitialCampaigns);
		});
		it("throws error when getting campaigns fails", async () => {
			try {
				await getCampaigns();
			} catch (error) {
				expect(error?.toString()).toContain("Failed to fetch campaigns.");
			}
		});
	});

	describe("createCampaign", () => {
		it("successfully creates a mockCampaign", async () => {
			//@ts-expect-error
			axios.post.mockResolvedValueOnce({ data: { ...mockCampaign } });
			const result = await createCampaign(mockNewCampaign);
			expect(result).toEqual(mockCampaign);
		});

		it("throws error when creation fails", async () => {
			//@ts-expect-error
			axios.post.mockRejectedValueOnce(new Error());
			await expect(createCampaign(mockNewCampaign)).rejects.toThrow(
				"Failed to create campaign.",
			);
		});
	});

	describe("updateCampaignById", () => {
		it("successfully updates a mockCampaign by id", async () => {
			const updatedCampaign = { ...mockNewCampaign };
			//@ts-expect-error
			axios.put.mockResolvedValueOnce({ data: updatedCampaign });

			const result = await updateCampaignById("123", updatedCampaign);
			expect(result).toEqual(updatedCampaign);
		});

		it("throws error when update fails", async () => {
			//@ts-expect-error
			axios.put.mockRejectedValueOnce(new Error());
			await expect(updateCampaignById("123", mockNewCampaign)).rejects.toThrow(
				"Failed to update campaign with id 123",
			);
		});
	});

	describe("deleteCampaignById", () => {
		it("successfully deletes a mockCampaign by id", async () => {
			//@ts-expect-error
			axios.delete.mockResolvedValueOnce({ data: {} });
			const result = await deleteCampaignById("123");
			expect(result).toEqual({});
		});

		it("throws error when deletion fails", async () => {
			//@ts-expect-error
			axios.delete.mockRejectedValueOnce(new Error());
			await expect(deleteCampaignById("123")).rejects.toThrow(
				"Failed to delete campaign with id 123",
			);
		});
	});

	describe("toggleCampaignStatusById", () => {
		it("successfully toggles a mockCampaign status by id", async () => {
			const toggledCampaign = { ...mockCampaign, status: "paused" as const };
			//@ts-expect-error
			axios.patch.mockResolvedValueOnce({ data: toggledCampaign });

			const result = await toggleCampaignStatusById("123");
			expect(result).toEqual(toggledCampaign);
		});

		it("throws error when toggle fails", async () => {
			//@ts-expect-error
			axios.patch.mockRejectedValueOnce(new Error());
			await expect(toggleCampaignStatusById("123")).rejects.toThrow(
				"Failed to toggle campaign status with id 123",
			);
		});
	});
});

describe("convertToCampaignAndValidate", () => {
	it("returns correct data", async () => {
		const newCampaign = {
			...mockNewCampaign,
			...mockCampaignMetrics,
			...mockDbAddedProps,
		};

		const convertedCampaign = convertToCampaignAndValidate(newCampaign);

		expect(convertedCampaign).toEqual(mockCampaign);
	});
});
