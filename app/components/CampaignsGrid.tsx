"use client";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import MUIThemeProvider from "./UI/MUIThemeProvider";
import { Button } from "./UI/Button";
import { button } from "@/app/style";
import {
  deleteCampaignById,
  fetcher,
  updateCampaignById,
} from "@/app/lib/fetch/campaigns";
import EditCampaignButton from "./EditCampaignButton";
import { NewCampaign } from "@/app/lib/schema/campaigns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useCampaignsContext } from "@/app/providers/CampaignsProvider";
import Error from "@/app/error";

export default function CampaignsGrid() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const { page, pageSize } = paginationModel;

  const { data, error, isLoading } = useSWR(
    `/api/campaigns?page=${page}&limit=${pageSize}`,
    fetcher
  );

  const { campaigns, setCampaigns } = useCampaignsContext();

  useEffect(() => {
    if (data) {
      setCampaigns(data.campaigns);
    }
  }, [data, setCampaigns]);

  useEffect(() => {
    if (!data && campaigns.length === 0) {
      const infoShown = localStorage.getItem("infoShown");
      if (!infoShown) {
        toast.success(
          "The campaigns will load slowly on the first time, due to cold start.",
          {
            icon: "👋",
            duration: 6000,
          }
        );
        localStorage.setItem("infoShown", "true");
      }
    }
  }, [data, campaigns]);

  if (error) return <Error />;

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      disableColumnMenu: true,
      width: 70,
    },
    {
      field: "name",
      headerName: "Name",
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      type: "string",
      editable: false,
      disableColumnMenu: true,
      width: 120,
      renderCell: ({ value }) => {
        return new Date(value).toLocaleDateString();
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      editable: false,
      disableColumnMenu: true,
      width: 120,
      renderCell: ({ value }) => {
        return new Date(value).toLocaleDateString();
      },
    },
    {
      field: "targetAudience",
      headerName: "Target Audience",
      width: 140,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: "budget",
      headerName: "Budget",
      editable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return value.toLocaleString();
      },
    },
    {
      field: "status",
      headerName: "Status",
      editable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => (
        <div
          data-testid="status"
          className={`
          ${value === "active" && "text-emerald-500"}
          ${value === "paused" && "text-yellow-500"}
        `}
        >
          {value}
        </div>
      ),
    },
    {
      field: "adGroups",
      headerName: "Ad Groups",
      editable: false,
      width: 180,
      disableColumnMenu: true,
      renderCell: ({ value }) => (
        <div className="hover:h-full hover:w-full whitespace-normal break-words z-[10] overscroll-none hover:overflow-y-scroll">
          {value.join(", ")}
        </div>
      ),
    },
    {
      field: "keywords",
      headerName: "Keywords",
      editable: false,
      width: 180,
      disableColumnMenu: true,
      renderCell: ({ value }) => (
        <div className="hover:h-full hover:w-full whitespace-normal break-words z-[10] overscroll-none hover:overflow-y-scroll">
          {value.join(", ")}
        </div>
      ),
    },
    {
      field: "averageCpc",
      headerName: "Average CPC",
      editable: false,
      disableColumnMenu: true,
      width: 140,
      renderCell: ({ value }) => {
        return value.toLocaleString();
      },
    },
    {
      field: "clicks",
      headerName: "Clicks",
      editable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return value.toLocaleString();
      },
    },
    {
      field: "conversionRate",
      headerName: "Conversion Rate",
      editable: false,
      disableColumnMenu: true,
      width: 160,
      renderCell: ({ value }) => {
        return value.toLocaleString();
      },
    },
    {
      field: "conversions",
      headerName: "Conversions",
      editable: false,
      disableColumnMenu: true,
      width: 130,
      renderCell: ({ value }) => {
        return value.toLocaleString();
      },
    },
    {
      field: "costPerConversion",
      headerName: "Cost Per Conversion",
      width: 180,
      editable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return value.toLocaleString();
      },
    },

    {
      field: "ctr",
      headerName: "CTR",
      editable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return value.toLocaleString();
      },
    },
    {
      field: "impressions",
      headerName: "Impressions",
      width: 130,
      editable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return value.toLocaleString();
      },
    },
    {
      field: "createdAt",
      headerName: "Created",
      editable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return new Date(value).toLocaleDateString();
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      editable: false,
      width: 80,
      disableColumnMenu: true,
      renderCell: (params) => {
        const id = params.row.id.toString();
        return <EditCampaignButton id={id} />;
      },
    },
    {
      field: "activate/pause",
      headerName: "Activate/Pause",
      sortable: false,
      editable: false,
      disableColumnMenu: true,
      width: 120,
      renderCell: (params) => {
        const id = params.row.id.toString();

        return (
          <div data-testid="activate/pause-button">
            <Button
              onClick={() => handleToggleCampaignStatus(id)}
              className={`p-2 w-[70px]
            ${button.transparent}
          `}
            >
              {params.row.status === "active" ? "Pause" : "Activate"}
            </Button>
          </div>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      editable: false,
      width: 100,
      disableColumnMenu: true,
      renderCell: (params) => {
        const onClick = async () => {
          const id = params.row.id.toString();
          handleDelete(id);
        };
        return (
          <Button onClick={onClick} className={button.red}>
            Delete
          </Button>
        );
      },
    },
  ];

  const handleToggleCampaignStatus = async (id: string) => {
    const selectedCampaign = campaigns.find(
      (campaign) => campaign.id.toString() === id
    );

    if (!selectedCampaign) return;
    const campaignToUpdate: NewCampaign = {
      status: selectedCampaign.status === "active" ? "paused" : "active",
      adGroups: JSON.stringify(selectedCampaign.adGroups),
      keywords: JSON.stringify(selectedCampaign.keywords),
      name: selectedCampaign.name,
      startDate: selectedCampaign.startDate,
      endDate: selectedCampaign.endDate,
      targetAudience: selectedCampaign.targetAudience,
      budget: selectedCampaign.budget,
    };

    const update = updateCampaignById(id, campaignToUpdate)
      .then((updatedCampaign) => {
        const updatedCampaignWithMetrics = {
          ...selectedCampaign,
          name: updatedCampaign.name,
          startDate: updatedCampaign.startDate,
          endDate: updatedCampaign.endDate,
          targetAudience: updatedCampaign.targetAudience,
          budget: updatedCampaign.budget,
          status: updatedCampaign.status,
          adGroups: updatedCampaign.adGroups,
          keywords: updatedCampaign.keywords,
        };

        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id.toString() !== updatedCampaign.id.toString()
              ? campaign
              : updatedCampaignWithMetrics
          )
        );
      })

      .catch((error) => {
        console.error(error);
      });

    const loadingText =
      campaignToUpdate.status !== "active"
        ? "Pausing campaign..."
        : "Activating campaign...";
    const successText =
      campaignToUpdate.status !== "active"
        ? "Campaign paused!"
        : "Campaign activated!";
    const errorText =
      campaignToUpdate.status !== "active"
        ? "Failed to pause campaign."
        : "Failed to activate campaign.";

    toast.promise(update, {
      loading: loadingText,
      success: successText,
      error: errorText,
    });
  };

  const handleDelete = async (id: string) => {
    const deleteCampaign = deleteCampaignById(id)
      .then((res) => {
        if (res.status === 204) {
          setCampaigns((prevCampaigns) =>
            prevCampaigns.filter(
              (campaign) => campaign.id.toString() !== id.toString()
            )
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });

    toast.promise(deleteCampaign, {
      loading: "Deleting campaign...",
      success: "Campaign deleted!",
      error: "Failed to delete campaign.",
    });
  };

  const rows = campaigns;

  return (
    <div className="overscroll-none flex justify-center w-full p-4 max-w-[1400px]">
      <div className="flex w-full">
        <MUIThemeProvider>
          <Box className="flex justify-center w-full">
            <DataGrid
              autoHeight
              rows={rows ?? []}
              rowCount={data ? data.totalPages * pageSize : 0}
              loading={isLoading}
              columns={columns ?? []}
              initialState={{
                pagination: {
                  paginationModel: paginationModel,
                },
              }}
              pageSizeOptions={[pageSize]}
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode="server"
            />
          </Box>
        </MUIThemeProvider>
      </div>
    </div>
  );
}
