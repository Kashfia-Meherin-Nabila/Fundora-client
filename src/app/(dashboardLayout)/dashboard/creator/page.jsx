"use client";

import { useEffect, useState } from "react";
import {
  CircleDollar,
  Folder,
  ChartBar,
  Clock,
  Eye,
  CircleCheck,
  CircleXmark,
} from "@gravity-ui/icons";
import { authClient } from "@/app/lib/auth-client";

const API_URL = "http://localhost:5000";

export default function CreatorHome() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const email = user?.email;

  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRaised: 0,
  });

  const [contributions, setContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // =========================
  // Fetch Creator Dashboard
  // =========================

  useEffect(() => {
    if (!email) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [statsResponse, contributionResponse] = await Promise.all([
          fetch(`${API_URL}/api/creator/stats/${email}`),
          fetch(`${API_URL}/api/creator/pending-contributions/${email}`),
        ]);

        const statsData = await statsResponse.json();
        const contributionData = await contributionResponse.json();

        if (statsResponse.ok) {
          setStats(statsData);
        }

        if (contributionResponse.ok) {
          setContributions(contributionData);
        }
      } catch (error) {
        console.error("Failed to load creator dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [email]);

  // =========================
  // Approve Contribution
  // =========================

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);

      const response = await fetch(
        `${API_URL}/api/contributions/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to approve contribution.");
        return;
      }

      // Remove approved contribution from pending list
      setContributions((prev) =>
        prev.filter((item) => item._id !== id)
      );

      // Update raised amount immediately
      setStats((prev) => ({
        ...prev,
        totalRaised:
          prev.totalRaised + Number(result.contributionAmount || 0),
      }));
    } catch (error) {
      console.error("Approve error:", error);
      alert("Something went wrong.");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // Reject Contribution
  // =========================

  const handleReject = async (id) => {
    try {
      setActionLoading(id);

      const response = await fetch(
        `${API_URL}/api/contributions/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to reject contribution.");
        return;
      }

      // Remove rejected contribution
      setContributions((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Reject error:", error);
      alert("Something went wrong.");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // Loading
  // =========================

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />

          <p className="text-sm text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // No session
  // =========================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">
          Please login to continue.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8">

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-medium text-violet-400">
          Creator Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Welcome back, {user.name}
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Manage your campaigns and review supporter contributions.
        </p>
      </div>

      {/* =========================
          Statistics
      ========================= */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {/* Total Campaigns */}

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Total Campaigns
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {stats.totalCampaigns}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
              <Folder
                width={23}
                height={23}
                className="text-violet-400"
              />
            </div>

          </div>

          <p className="mt-4 text-xs text-slate-500">
            Campaigns launched by you
          </p>
        </div>

        {/* Active Campaigns */}

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Active Campaigns
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {stats.activeCampaigns}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <Clock
                width={23}
                height={23}
                className="text-emerald-400"
              />
            </div>

          </div>

          <p className="mt-4 text-xs text-slate-500">
            Campaigns with active deadlines
          </p>
        </div>

        {/* Total Raised */}

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Total Amount Raised
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {stats.totalRaised}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-500/10">
              <CircleDollar
                width={23}
                height={23}
                className="text-fuchsia-400"
              />
            </div>

          </div>

          <p className="mt-4 text-xs text-slate-500">
            Approved contribution credits
          </p>
        </div>

      </div>

      {/* =========================
          Contributions To Review
      ========================= */}

      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900">

        {/* Section Header */}

        <div className="flex flex-col gap-3 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Contributions To Review
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review pending contributions from supporters.
            </p>
          </div>

          <div className="rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400">
            {contributions.length} Pending
          </div>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] text-left">

            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">

                <th className="px-6 py-4">
                  Supporter
                </th>

                <th className="px-6 py-4">
                  Campaign
                </th>

                <th className="px-6 py-4">
                  Contribution
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {contributions.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <CircleCheck
                        width={35}
                        height={35}
                        className="mb-3 text-emerald-400"
                      />

                      <p className="font-medium text-slate-300">
                        No pending contributions
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        You're all caught up!
                      </p>

                    </div>
                  </td>
                </tr>

              ) : (

                contributions.map((contribution) => (

                  <tr
                    key={contribution._id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >

                    {/* Supporter */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600/20 text-sm font-bold text-violet-400">
                          {contribution.supporter_name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-white">
                            {contribution.supporter_name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {contribution.supporter_email}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Campaign */}

                    <td className="px-6 py-4">

                      <p className="max-w-[230px] truncate text-sm text-slate-300">
                        {contribution.campaign_title}
                      </p>

                    </td>

                    {/* Amount */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-1.5 font-semibold text-white">
                        <CircleDollar
                          width={16}
                          height={16}
                          className="text-violet-400"
                        />

                        {contribution.contribution_amount}
                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">

                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                        Pending
                      </span>

                    </td>

                    {/* Actions */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        {/* View */}

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedContribution(contribution)
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <Eye
                            width={15}
                            height={15}
                          />

                          View
                        </button>

                        {/* Approve */}

                        <button
                          type="button"
                          disabled={actionLoading === contribution._id}
                          onClick={() =>
                            handleApprove(contribution._id)
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CircleCheck
                            width={15}
                            height={15}
                          />

                          Approve
                        </button>

                        {/* Reject */}

                        <button
                          type="button"
                          disabled={actionLoading === contribution._id}
                          onClick={() =>
                            handleReject(contribution._id)
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CircleX
                            width={15}
                            height={15}
                          />

                          Reject
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

      {/* =========================
          Contribution Modal
      ========================= */}

      {selectedContribution && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedContribution(null)}
        >

          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-6 flex items-start justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                  Contribution Details
                </p>

                <h3 className="mt-1 text-xl font-bold text-white">
                  {selectedContribution.campaign_title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedContribution(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>

            </div>

            <div className="space-y-4">

              <div className="rounded-xl border border-white/10 bg-slate-950 p-4">

                <p className="text-xs text-slate-500">
                  Supporter
                </p>

                <p className="mt-1 font-medium text-white">
                  {selectedContribution.supporter_name}
                </p>

                <p className="text-sm text-slate-500">
                  {selectedContribution.supporter_email}
                </p>

              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950 p-4">

                <p className="text-xs text-slate-500">
                  Contribution Amount
                </p>

                <p className="mt-1 text-2xl font-bold text-violet-400">
                  {selectedContribution.contribution_amount} Credits
                </p>

              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950 p-4">

                <p className="text-xs text-slate-500">
                  Message
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {selectedContribution.message ||
                    "No message provided by the supporter."}
                </p>

              </div>

              <div className="text-xs text-slate-500">
                Submitted:{" "}
                {selectedContribution.current_date
                  ? new Date(
                      selectedContribution.current_date
                    ).toLocaleString()
                  : "N/A"}
              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                disabled={
                  actionLoading === selectedContribution._id
                }
                onClick={async () => {
                  await handleApprove(
                    selectedContribution._id
                  );

                  setSelectedContribution(null);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                <CircleCheck
                  width={17}
                  height={17}
                />

                Approve
              </button>

              <button
                type="button"
                disabled={
                  actionLoading === selectedContribution._id
                }
                onClick={async () => {
                  await handleReject(
                    selectedContribution._id
                  );

                  setSelectedContribution(null);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600/80 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                <CircleXmark
                  width={17}
                  height={17}
                />

                Reject
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}