"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
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
import server from "@/lib/core/server";
// import server from "@/lib/core/server";

const initialStats = {
  totalCampaigns: 0,
  totalContributions: 0,
  totalPending: 0,
  totalRaised: 0,
};

const formatCredits = (amount) =>
  `${Number(amount || 0).toLocaleString()} credits`;

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString();
};

const getId = (contribution) =>
  contribution?._id?.toString?.() || contribution?._id || "";

const supporterName = (item) =>
  item?.supporterName || item?.Supporter_name || "Unknown supporter";

const supporterEmail = (item) =>
  item?.supporterEmail || item?.Supporter_email || "—";

const campaignTitle = (item) =>
  item?.campaignTitle || item?.campaign_title || "Untitled campaign";

const contributionAmount = (item) =>
  Number(item?.contributionAmount ?? item?.Contribution_amount ?? 0);

const contributionMessage = (item) =>
  item?.message || item?.contributionMessage || "No message provided.";

const contributionDate = (item) =>
  item?.currentDate || item?.current_date || item?.createdAt;



export default function CreatorHome() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const user = session?.user;
  const userEmail = user?.email;
  

  const [stats, setStats] = useState(initialStats);
  const [contributions, setContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  
  // LOAD CREATOR DASHBOARD
  
const loadDashboard = useCallback(async () => {
  if (!userEmail) return;

  setLoading(true);
  setError("");

  try {
    const [statsResponse, contributionsResponse] = await Promise.all([
      server(`/api/creator/stats`),
      server(`/api/creator/pending-contributions`),
    ]);

    const statsPayload = statsResponse?.stats || statsResponse || {};

    setStats({
      totalCampaigns: Number(statsPayload.totalCampaigns || 0),
      totalContributions: Number(statsPayload.totalContributions || 0),
      totalPending: Number(statsPayload.totalPending || 0),
      totalRaised: Number(statsPayload.totalRaised || 0),
    });

    const pendingList =
      contributionsResponse?.contributions ||
      contributionsResponse?.pendingContributions ||
      [];

    setContributions(Array.isArray(pendingList) ? pendingList : []);
  } catch (err) {
    console.error("Creator dashboard error:", err);
    setError(err.message || "Failed to load your dashboard.");
  } finally {
    setLoading(false);
  }
}, [userEmail]);
  // EFFECT: LOAD AFTER SESSION IS READY
  // ---------------------------------------
  useEffect(() => {
    if (sessionLoading || !user?.email) return;

    let cancelled = false;

    const fetchDashboard = async () => {
      // Defer the call so state updates don't run
      // synchronously inside the effect body.
      await Promise.resolve();

      if (cancelled) return;

      await loadDashboard();
    };

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, [sessionLoading, user?.email, loadDashboard]);

  // ---------------------------------------
  // APPROVE CONTRIBUTION
  // ---------------------------------------
  const handleApprove = async (contribution) => {
    const contributionId = getId(contribution);

    if (!contributionId || actionLoading) return false;

    const amount = contributionAmount(contribution);

    const result = await Swal.fire({
      title: "Approve contribution?",
      html: `
        <p>Are you sure you want to approve this contribution?</p>
        <p style="margin-top:12px;font-weight:600;">
          ${formatCredits(amount)}
        </p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return false;

    setActionLoading(contributionId);

    try {
      const response = await server(
        `/api/contributions/${contributionId}/approve`,
        {
          method: "PATCH",
        },
      );

      if (response?.success === false) {
        throw new Error(response.message || "Approval failed.");
      }

      setContributions((previous) =>
        previous.filter((item) => getId(item) !== contributionId),
      );

      setSelectedContribution((previous) =>
        getId(previous) === contributionId ? null : previous,
      );

      await Swal.fire({
        title: "Approved!",
        text:
          response?.message ||
          "The contribution has been approved successfully.",
        icon: "success",
        confirmButtonColor: "#7c3aed",
      });

      await loadDashboard();
      return true;
    } catch (err) {
      console.error("Approve contribution error:", err);

      await Swal.fire({
        title: "Approval failed",
        text: err.message || "Could not approve this contribution.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });

      return false;
    } finally {
      setActionLoading("");
    }
  };

  // ---------------------------------------
  // REJECT CONTRIBUTION
  // ---------------------------------------
  const handleReject = async (contribution) => {
    const contributionId = getId(contribution);

    if (!contributionId || actionLoading) return false;

    const amount = contributionAmount(contribution);

    const result = await Swal.fire({
      title: "Reject contribution?",
      html: `
        <p>This contribution will be rejected.</p>
        <p style="margin-top:12px;font-weight:600;">
          ${formatCredits(amount)}
        </p>
        <p style="margin-top:8px;font-size:14px;color:#64748b;">
          The supporter’s credits will be refunded by the backend.
        </p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Keep pending",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return false;

    setActionLoading(contributionId);

    try {
      const response = await server(
        `/api/contributions/${contributionId}/reject`,
        {
          method: "PATCH",
        },
      );

      if (response?.success === false) {
        throw new Error(response.message || "Rejection failed.");
      }

      setContributions((previous) =>
        previous.filter((item) => getId(item) !== contributionId),
      );

      setSelectedContribution((previous) =>
        getId(previous) === contributionId ? null : previous,
      );

      await Swal.fire({
        title: "Rejected",
        text:
          response?.message ||
          "The contribution was rejected successfully.",
        icon: "success",
        confirmButtonColor: "#7c3aed",
      });

      await loadDashboard();
      return true;
    } catch (err) {
      console.error("Reject contribution error:", err);

      await Swal.fire({
        title: "Rejection failed",
        text: err.message || "Could not reject this contribution.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });

      return false;
    } finally {
      setActionLoading("");
    }
  };

  // ---------------------------------------
  // VIEW CONTRIBUTION
  // ---------------------------------------
  const handleView = (contribution) => {
    setSelectedContribution(contribution);
  };

  const closeModal = () => {
    if (actionLoading) return;
    setSelectedContribution(null);
  };

  // ---------------------------------------
  // LOADING / AUTH STATES
  // ---------------------------------------
  if (sessionLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-white">
        <h2 className="text-xl font-bold">Please log in</h2>
        <p className="mt-2 text-slate-400">
          Log in with your Creator account to view your dashboard.
        </p>
      </div>
    );
  }

  if (loading && contributions.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-violet-400">
              Creator Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {user.name || "Creator"}!
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your campaigns and review supporter contributions.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading || Boolean(actionLoading)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh dashboard"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <p>{error}</p>

            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="mt-3 rounded-lg bg-red-500/20 px-4 py-2 font-semibold hover:bg-red-500/30 disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        )}

        {/* STATS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Campaigns"
            value={stats.totalCampaigns}
            icon={<Folder className="h-6 w-6" />}
            description="Your campaigns"
          />

          <StatCard
            title="Total Contributions"
            value={stats.totalContributions}
            icon={<ChartBar className="h-6 w-6" />}
            description="All contribution requests"
          />

          <StatCard
            title="Pending Contributions"
            value={stats.totalPending}
            icon={<Clock className="h-6 w-6" />}
            description="Waiting for your review"
          />

          <StatCard
            title="Approved Amount"
            value={formatCredits(stats.totalRaised)}
            icon={<CircleDollar className="h-6 w-6" />}
            description="Approved contributions only"
          />
        </section>

        {/* CONTRIBUTIONS TABLE */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <div className="flex flex-col gap-3 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-xl font-bold">
                Pending Contributions
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Review, view details, approve, or reject contributions.
              </p>
            </div>

            <span className="w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-medium text-amber-300">
              {contributions.length} pending
            </span>
          </div>

          {contributions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                <Clock className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                No pending contributions
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                New contributions to your campaigns will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5 text-left">
                <thead className="bg-slate-800/70 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Supporter
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Campaign
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Amount
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {contributions.map((item) => {
                    const id = getId(item);
                    const busy = actionLoading === id;

                    return (
                      <tr
                        key={id}
                        className="transition hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-white">
                            {supporterName(item)}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {supporterEmail(item)}
                          </p>
                        </td>

                        <td className="max-w-xs px-6 py-5">
                          <p className="line-clamp-2 text-sm text-slate-200">
                            {campaignTitle(item)}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span className="font-semibold text-violet-300">
                            {formatCredits(contributionAmount(item))}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                            Pending
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleView(item)}
                              disabled={Boolean(actionLoading)}
                              title="View contribution"
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-violet-500 hover:text-white disabled:opacity-50"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() => handleApprove(item)}
                              disabled={Boolean(actionLoading)}
                              title="Approve contribution"
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CircleCheck className="h-4 w-4" />
                              {busy ? "Working..." : "Approve"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReject(item)}
                              disabled={Boolean(actionLoading)}
                              title="Reject contribution"
                              className="inline-flex items-center gap-2 rounded-lg bg-red-600/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CircleXmark className="h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* CONTRIBUTION DETAILS MODAL */}
      {selectedContribution && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contribution-modal-title"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2
                  id="contribution-modal-title"
                  className="text-xl font-bold"
                >
                  Contribution Details
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Review the supporter’s contribution.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={Boolean(actionLoading)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                aria-label="Close modal"
              >
                <CircleXmark className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="space-y-5 p-6">
              <DetailRow
                label="Supporter"
                value={supporterName(selectedContribution)}
              />

              <DetailRow
                label="Supporter email"
                value={supporterEmail(selectedContribution)}
              />

              <DetailRow
                label="Campaign"
                value={campaignTitle(selectedContribution)}
              />

              <DetailRow
                label="Contribution amount"
                value={formatCredits(
                  contributionAmount(selectedContribution),
                )}
                highlight
              />

              <DetailRow
                label="Submitted"
                value={formatDate(
                  contributionDate(selectedContribution),
                )}
              />

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-300">
                  Supporter message
                </p>

                <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
                  {contributionMessage(selectedContribution)}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-800 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={Boolean(actionLoading)}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleReject(selectedContribution)}
                disabled={Boolean(actionLoading)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                <CircleXmark className="h-4 w-4" />
                Reject
              </button>

              <button
                type="button"
                onClick={() => handleApprove(selectedContribution)}
                disabled={Boolean(actionLoading)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
              >
                <CircleCheck className="h-4 w-4" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ---------------------------------------
// REUSABLE STAT CARD
// ---------------------------------------
function StatCard({ title, value, icon, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-violet-500/40 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
          {icon}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------
// REUSABLE DETAIL ROW
// ---------------------------------------
function DetailRow({ label, value, highlight = false }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <p className="shrink-0 text-sm text-slate-400">{label}</p>

      <p
        className={`wrap-break text-sm font-medium sm:text-right ${
          highlight ? "text-violet-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}