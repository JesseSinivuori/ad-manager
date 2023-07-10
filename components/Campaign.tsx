"use client";
import { Button } from "./UI/Button";
import { button } from "@/app/style";
import { deleteCampaignById } from "@/lib/campaigns";
import { SetStateAction } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import Error from "@/app/error";
import { Campaign } from "@/lib/schema/campaigns";

export const CampaignComponent = ({
  pathname,
  campaign,
  isLoading,
  isError,
  id,
  setCampaigns,
}: {
  pathname?: string;
  campaign: Campaign;
  isLoading: boolean;
  isError: boolean;
  id: number;
  setCampaigns: React.Dispatch<SetStateAction<Campaign[]>>;
}) => {
  const router = useRouter();
  const handleDelete = async () => {
    //await deleteCampaignById(id.toString());
    setCampaigns((prevCampaigns) =>
      prevCampaigns.filter(
        (campaign) => campaign.id!.toString() !== id.toString()
      )
    );
    router.push("/campaigns");
  };

  const CampaignData = () => (
    <table className="flex justify-start">
      <tbody>
        <tr>
          <th>Start date</th>
          <td>{new Date(campaign.startDate).toLocaleDateString()}</td>
        </tr>
        <tr>
          <th>End date</th>
          <td>{new Date(campaign.endDate).toLocaleDateString()}</td>
        </tr>
        <tr>
          <th>Target audience</th>
          <td>{campaign.targetAudience}</td>
        </tr>
        <tr>
          <th>Budget</th>
          <td>{campaign.budget}</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>{campaign.status}</td>
        </tr>
        <tr>
          <th>Ad Groups</th>
          <td>
            {campaign.adGroups.map((adGroup) => (
              <span key={adGroup}>{`${adGroup} `} </span>
            ))}
          </td>
        </tr>
        <tr>
          <th>Keywords</th>
          <td>
            {campaign.keywords.map((keyword) => (
              <span key={keyword}>{`${keyword} `} </span>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col text-start border p-4 m-4 bg-violet-200/50 rounded-md">
      <h2 className="font-bold text-center">{campaign.name}</h2>
      <CampaignData />
      {pathname !== `/campaigns/${id.toString()}` && (
        <Link
          className={`${button.transparent} my-2 justify-center flex`}
          href={`/campaigns/${id}`}
        >
          View
        </Link>
      )}
      {pathname === `/campaigns/${id.toString()}` && (
        <>
          <Button
            className={`${button.transparent} my-2`}
            onClick={() => handleDelete()}
          >
            Edit
          </Button>
          <Button
            className={`${button.red} my-2`}
            onClick={() => handleDelete()}
          >
            Delete
          </Button>
        </>
      )}
    </div>
  );
};
