"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, TrashBin } from "@gravity-ui/icons";
import { authClient, useSession } from "@/app/lib/auth-client";
import Swal from "sweetalert2";
import EditCampaignModal from "@/components/creatorDashboard/EditCampaignModal";
import Image from "next/image";

const MyCampaigns = () => {
  const { data: session, isPending } = useSession();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const email = session?.user?.email;

  // Fetch auth token once
  useEffect(() => {
    const fetchToken = async () => {
      const { data: tokenData } = await authClient.token();
      setToken(tokenData?.token || null);
    };
    fetchToken();
  }, []);

  // Manual refetch (used after delete/edit)
  const loadCampaigns = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/campaigns/creator`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch campaigns");
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error("Campaign fetch error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load campaigns.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    let ignore = false;

    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/campaigns/creator`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch campaigns");
        const data = await response.json();
        if (!ignore) setCampaigns(data.campaigns || []);
      } catch (error) {
        console.error("Campaign fetch error:", error);
        if (!ignore) {
          Swal.fire({
            title: "Error!",
            text: "Failed to load campaigns.",
            icon: "error",
          });
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchCampaigns();

    return () => {
      ignore = true;
    };
  }, [token]);

  // Delete campaign
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This campaign will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/campaigns/${id}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete campaign");
      }

      await Swal.fire({
        title: "Deleted!",
        text: "Campaign has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#fff",
      });

      loadCampaigns();
    } catch (error) {
      console.error("Delete campaign error:", error);

      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong.",
        icon: "error",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  if (isPending) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Campaigns</h2>
          <p className="mt-1 text-slate-400">
            Total Campaigns : {campaigns.length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="w-full min-w-225">
          <thead className="border-b border-white/10">
            <tr className="text-left text-sm text-slate-400">
              <th className="pb-4">Campaign</th>
              <th className="pb-4">Category</th>
              <th className="pb-4">Funding Goal</th>
              <th className="pb-4">Raised</th>
              <th className="pb-4">Deadline</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  Loading campaigns...
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No campaigns found.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr
                  key={campaign._id}
                  className="border-b border-white/5 transition hover:bg-slate-800/40"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-800">
                        {campaign.campaign_image_url ? (
                          <Image
                            src={campaign.campaign_image_url}
                            alt={campaign.campaign_title || "Campaign image"}
                            fill
                            sizes="(max-width: 768px) 100vw, 80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="max-w-62.5 truncate font-semibold text-white">
                          {campaign.campaign_title}
                        </h3>
                        <p className="mt-1 max-w-62.5 truncate text-xs text-slate-400">
                          {campaign.campaign_story}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="text-slate-300">{campaign.category}</td>
                  <td className="font-semibold text-violet-400">
                    {campaign.funding_goal} Credits
                  </td>
                  <td className="font-semibold text-green-400">
                    {campaign.raised_amount || 0} Credits
                  </td>
                  <td className="text-slate-300">
                    {campaign.deadline
                      ? new Date(campaign.deadline).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        campaign.status === "approved"
                          ? "bg-green-500/10 text-green-400"
                          : campaign.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : campaign.status === "rejected"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-slate-500/10 text-slate-400"
                      }`}
                    >
                      {campaign.status || "pending"}
                    </span>
                  </td>

                  <td>
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        href={`/dashboard/creator/my-campaigns/${campaign._id}`}
                        title="View Campaign"
                        className="rounded-lg bg-slate-800 p-2 transition hover:bg-cyan-600"
                      >
                        <Eye width={17} height={17} className="text-white" />
                      </Link>

                      <EditCampaignModal
                        campaign={campaign}
                        refetch={loadCampaigns}
                      />

                      <button
                        type="button"
                        onClick={() => handleDelete(campaign._id)}
                        title="Delete Campaign"
                        className="rounded-lg bg-slate-800 p-2 transition hover:bg-red-600"
                      >
                        <TrashBin
                          width={17}
                          height={17}
                          className="text-white"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyCampaigns;
