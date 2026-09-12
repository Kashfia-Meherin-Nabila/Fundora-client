"use client";

import { useEffect, useState } from "react";
import {
  CircleCheckFill,
  CircleXmarkFill,
  Clock,
  Eye,
  HandOk,
  Calendar,
  Person,
} from "@gravity-ui/icons";
import Swal from "sweetalert2";

export default function CampaignApprovalsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ==================== LOAD PENDING CAMPAIGNS ====================

  useEffect(() => {
    let cancelled = false;

    const loadCampaigns = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/campaigns/pending",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load campaigns."
          );
        }

        if (!cancelled) {
          setCampaigns(data.campaigns || []);
        }
      } catch (error) {
        console.error("Pending campaigns error:", error);

        if (!cancelled) {
          Swal.fire({
            icon: "error",
            title: "Failed to load",
            text:
              error.message ||
              "Unable to load pending campaigns.",
            background: "#0f172a",
            color: "#fff",
            confirmButtonColor: "#8b5cf6",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCampaigns();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==================== APPROVE ====================

  const handleApprove = async (campaign) => {
    const result = await Swal.fire({
      title: "Approve Campaign?",
      text: `Are you sure you want to approve "${campaign.campaign_title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#475569",
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(campaign._id);

      const response = await fetch(
        `http://localhost:5000/api/admin/campaigns/${campaign._id}/approve`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to approve campaign."
        );
      }

      setCampaigns((previous) =>
        previous.filter(
          (item) => item._id !== campaign._id
        )
      );

      Swal.fire({
        icon: "success",
        title: "Campaign Approved",
        text: "The campaign is now visible to supporters.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } catch (error) {
      console.error("Approve error:", error);

      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text:
          error.message ||
          "Something went wrong.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // ==================== REJECT ====================

  const handleReject = async (campaign) => {
    const result = await Swal.fire({
      title: "Reject Campaign?",
      text: `Why are you rejecting "${campaign.campaign_title}"?`,
      input: "textarea",
      inputPlaceholder: "Enter rejection reason...",
      inputAttributes: {
        "aria-label": "Rejection reason",
      },
      showCancelButton: true,
      confirmButtonText: "Reject Campaign",
      cancelButtonText: "Cancel",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
    });

    if (!result.isConfirmed) return;

    const reason = result.value?.trim();

    if (!reason) {
      Swal.fire({
        icon: "warning",
        title: "Reason Required",
        text: "Please provide a reason for rejecting the campaign.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });

      return;
    }

    try {
      setActionLoading(campaign._id);

      const response = await fetch(
        `http://localhost:5000/api/admin/campaigns/${campaign._id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to reject campaign."
        );
      }

      setCampaigns((previous) =>
        previous.filter(
          (item) => item._id !== campaign._id
        )
      );

      Swal.fire({
        icon: "success",
        title: "Campaign Rejected",
        text: "The creator has been notified.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } catch (error) {
      console.error("Reject error:", error);

      Swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text:
          error.message ||
          "Something went wrong.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-violet-500" />

            <p className="text-sm text-slate-400">
              Loading pending campaigns...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
      {/* Header */}

      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 p-3">
            <Clock className="h-6 w-6 text-violet-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Campaign Approvals
            </h1>

            <p className="text-sm text-slate-400">
              Review and manage newly submitted campaigns
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Pending Campaigns
            </p>

            <p className="mt-1 text-3xl font-bold">
              {campaigns.length}
            </p>
          </div>

          <div className="rounded-xl bg-amber-500/10 p-3">
            <Clock className="h-6 w-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Empty State */}

      {campaigns.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-12 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full bg-emerald-500/10 p-4">
            <CircleCheckFill className="h-8 w-8 text-emerald-400" />
          </div>

          <h2 className="text-lg font-semibold">
            No Pending Campaigns
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            All submitted campaigns have been reviewed.
          </p>
        </div>
      ) : (
        /* Table */

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Campaign
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Creator
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Goal
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Minimum
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Deadline
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {campaigns.map((campaign) => (
                  <tr
                    key={campaign._id}
                    className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                  >
                    {/* Campaign */}

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        {campaign.campaign_image_url ? (
                          <img
                            src={campaign.campaign_image_url}
                            alt={campaign.campaign_title}
                            className="h-12 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-violet-500/10">
                            <HandOk className="h-5 w-5 text-violet-400" />
                          </div>
                        )}

                        <div className="max-w-[240px]">
                          <p className="truncate font-semibold text-white">
                            {campaign.campaign_title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {campaign.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Creator */}

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <Person className="h-4 w-4 text-slate-500" />

                        <div>
                          <p className="text-sm text-slate-200">
                            {campaign.creator_name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {campaign.creator_email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Goal */}

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                        <HandOk className="h-4 w-4" />

                        {Number(
                          campaign.funding_goal || 0
                        ).toLocaleString()}{" "}
                        credits
                      </div>
                    </td>

                    {/* Minimum */}

                    <td className="px-5 py-5 text-sm text-slate-300">
                      {Number(
                        campaign.minimum_contribution || 0
                      ).toLocaleString()}{" "}
                      credits
                    </td>

                    {/* Deadline */}

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Calendar className="h-4 w-4 text-slate-500" />

                        {campaign.deadline
                          ? new Date(
                              campaign.deadline
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        {/* View */}

                        <button
                          type="button"
                          title="View campaign"
                          className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 transition hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-400"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Approve */}

                        <button
                          type="button"
                          disabled={
                            actionLoading === campaign._id
                          }
                          onClick={() =>
                            handleApprove(campaign)
                          }
                          className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CircleCheckFill className="h-4 w-4" />

                          Approve
                        </button>

                        {/* Reject */}

                        <button
                          type="button"
                          disabled={
                            actionLoading === campaign._id
                          }
                          onClick={() =>
                            handleReject(campaign)
                          }
                          className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CircleXmarkFill className="h-4 w-4" />

                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}