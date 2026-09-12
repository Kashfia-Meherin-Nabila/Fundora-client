"use client";

import { useEffect, useState } from "react";
import {
  Folder,
  TrashBin,
  Person,
  Calendar,
  CircleDollar,
  Eye,
  Clock,
  Magnifier,
} from "@gravity-ui/icons";
import Swal from "sweetalert2";

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // FETCH ALL CAMPAIGNS
  // =========================
  useEffect(() => {
    let cancelled = false;

    const fetchCampaigns = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/campaigns",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (cancelled) return;

        if (data.success) {
          setCampaigns(data.campaigns || []);
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: data.message || "Failed to load campaigns.",
            background: "#0f172a",
            color: "#fff",
            confirmButtonColor: "#7c3aed",
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Fetch campaigns error:", error);

        if (cancelled) return;

        setLoading(false);

        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: "Unable to load campaigns.",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#7c3aed",
        });
      }
    };

    fetchCampaigns();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================
  // SEARCH
  // =========================
  const filteredCampaigns = campaigns.filter((campaign) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return true;

    return (
      campaign.title?.toLowerCase().includes(searchText) ||
      campaign.category?.toLowerCase().includes(searchText) ||
      campaign.creator_name?.toLowerCase().includes(searchText) ||
      campaign.creator_email?.toLowerCase().includes(searchText) ||
      campaign.status?.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // DELETE CAMPAIGN
  // =========================
  const handleDelete = async (campaign) => {
    const result = await Swal.fire({
      title: "Delete Campaign?",
      text: `"${campaign.title}" will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#475569",
    });

    if (!result.isConfirmed) return;

    setDeletingId(campaign._id);

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/campaigns/${campaign._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete campaign."
        );
      }

      // Remove deleted campaign from UI
      setCampaigns((prev) =>
        prev.filter((item) => item._id !== campaign._id)
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Campaign has been deleted successfully.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#7c3aed",
      });
    } catch (error) {
      console.error("Delete campaign error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message || "Unable to delete campaign.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

      case "pending":
        return "border-amber-500/20 bg-amber-500/10 text-amber-400";

      case "rejected":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      case "suspended":
        return "border-orange-500/20 bg-orange-500/10 text-orange-400";

      default:
        return "border-slate-500/20 bg-slate-500/10 text-slate-400";
    }
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================
  // STATISTICS
  // =========================
  const totalCampaigns = campaigns.length;

  const approvedCampaigns = campaigns.filter(
    (campaign) => campaign.status === "approved"
  ).length;

  const pendingCampaigns = campaigns.filter(
    (campaign) => campaign.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8">
      {/* =================================
          HEADER
      ================================= */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/15">
                <Folder
                  width={22}
                  height={22}
                  className="text-violet-400"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  Manage Campaigns
                </h1>

                <p className="text-sm text-slate-500">
                  View and manage all campaigns on Fundora
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================
          STAT CARDS
      ================================= */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Campaigns */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Campaigns
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalCampaigns}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
              <Folder
                width={21}
                height={21}
                className="text-violet-400"
              />
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Approved
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {approvedCampaigns}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <Eye
                width={21}
                height={21}
                className="text-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {pendingCampaigns}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
              <Clock
                width={21}
                height={21}
                className="text-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =================================
          SEARCH
      ================================= */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900 p-4">
        <div className="relative">
          <Magnifier
            width={18}
            height={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by campaign, creator, category or status..."
            className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50"
          />
        </div>
      </div>

      {/* =================================
          CAMPAIGNS TABLE
      ================================= */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
        {/* Table Header */}
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">
                All Campaigns
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredCampaigns.length} campaign
                {filteredCampaigns.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />

              <p className="text-sm text-slate-500">
                Loading campaigns...
              </p>
            </div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          /* Empty */
          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
              <Folder
                width={25}
                height={25}
                className="text-slate-600"
              />
            </div>

            <h3 className="text-lg font-semibold text-white">
              No campaigns found
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              There are no campaigns matching your search.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Campaign
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Creator
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Goal
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Raised
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Deadline
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign._id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    {/* Campaign */}
                    <td className="px-5 py-5">
                      <div className="flex max-w-[250px] items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-500/10">
                          {campaign.campaign_image_url ? (
                            <img
                              src={campaign.campaign_image_url}
                              alt={campaign.title || "Campaign"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Folder
                              width={18}
                              height={18}
                              className="text-violet-400"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {campaign.title || "Untitled Campaign"}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-600">
                            ID: {campaign._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Creator */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <Person
                          width={16}
                          height={16}
                          className="text-slate-500"
                        />

                        <div>
                          <p className="text-sm text-slate-300">
                            {campaign.creator_name || "Unknown"}
                          </p>

                          <p className="mt-1 max-w-[180px] truncate text-xs text-slate-600">
                            {campaign.creator_email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-5">
                      <span className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-slate-400">
                        {campaign.category || "General"}
                      </span>
                    </td>

                    {/* Goal */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-1.5">
                        <CircleDollar
                          width={16}
                          height={16}
                          className="text-violet-400"
                        />

                        <span className="text-sm font-semibold text-white">
                          {Number(
                            campaign.funding_goal || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Raised */}
                    <td className="px-5 py-5">
                      <div>
                        <p className="text-sm font-semibold text-emerald-400">
                          {Number(
                            campaign.raised_amount || 0
                          ).toLocaleString()}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-600">
                          credits
                        </p>
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <Calendar
                          width={16}
                          height={16}
                          className="text-slate-500"
                        />

                        <span className="text-sm text-slate-400">
                          {formatDate(campaign.deadline)}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${getStatusStyle(
                          campaign.status
                        )}`}
                      >
                        {campaign.status || "unknown"}
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(campaign)}
                        disabled={deletingId === campaign._id}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <TrashBin
                          width={16}
                          height={16}
                        />

                        {deletingId === campaign._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}