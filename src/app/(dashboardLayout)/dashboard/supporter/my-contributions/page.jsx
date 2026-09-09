"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CircleCheck,
  Clock,
  CircleXmark,
  CircleDollar,
  Calendar,
  Person,
  FileDollar,
} from "@gravity-ui/icons";
import { authClient } from "@/app/lib/auth-client";

const API_URL = "http://localhost:5000";

export default function MyContributionsPage() {
  const { data: session } = authClient.useSession();

  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const supporter = session?.user;

  useEffect(() => {
    if (!supporter?.email) return;

    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/contributions/supporter/${encodeURIComponent(
            supporter.email
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch contributions."
          );
        }

        setContributions(data.contributions || []);
      } catch (error) {
        console.error("Fetch contributions error:", error);
        setError(
          error.message || "Failed to load contributions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [supporter?.email]);

  // ===============================
  // STATUS CONFIG
  // ===============================

  const getStatus = (status) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          icon: CircleCheck,
          className:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };

      case "rejected":
        return {
          label: "Rejected",
          icon: CircleXmark,
          className:
            "bg-red-500/10 text-red-400 border-red-500/20",
        };

      default:
        return {
          label: "Pending",
          icon: Clock,
          className:
            "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
    }
  };

  // ===============================
  // FORMAT DATE
  // ===============================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ===============================
  // SUMMARY
  // ===============================

  const totalContributions = contributions.length;

  const pendingCount = contributions.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = contributions.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = contributions.filter(
    (item) => item.status === "rejected"
  ).length;

  const totalApprovedAmount = contributions
    .filter((item) => item.status === "approved")
    .reduce(
      (total, item) =>
        total + Number(item.Contribution_amount || 0),
      0
    );

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-72 rounded-lg bg-slate-800" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-slate-900"
                />
              ))}
            </div>

            <div className="h-96 rounded-2xl bg-slate-900" />
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // PAGE
  // ===============================

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/dashboard/supporter"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft width={16} height={16} />
            Back to Dashboard
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Contributions
            </h1>

            <p className="mt-2 text-slate-400">
              Track all your campaign contributions and their
              current status.
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-violet-500/10 p-3">
                <FileDollar
                  width={22}
                  height={22}
                  className="text-violet-400"
                />
              </div>

              <span className="text-xs font-medium text-slate-500">
                TOTAL
              </span>
            </div>

            <p className="text-3xl font-bold">
              {totalContributions}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Contributions
            </p>
          </div>

          {/* APPROVED */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-emerald-500/10 p-3">
                <CircleCheck
                  width={22}
                  height={22}
                  className="text-emerald-400"
                />
              </div>

              <span className="text-xs font-medium text-slate-500">
                APPROVED
              </span>
            </div>

            <p className="text-3xl font-bold">
              {approvedCount}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Approved contributions
            </p>
          </div>

          {/* PENDING */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-amber-500/10 p-3">
                <Clock
                  width={22}
                  height={22}
                  className="text-amber-400"
                />
              </div>

              <span className="text-xs font-medium text-slate-500">
                PENDING
              </span>
            </div>

            <p className="text-3xl font-bold">
              {pendingCount}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Waiting for approval
            </p>
          </div>

          {/* APPROVED AMOUNT */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-pink-500/10 p-3">
                <CircleDollar
                  width={22}
                  height={22}
                  className="text-pink-400"
                />
              </div>

              <span className="text-xs font-medium text-slate-500">
                CONTRIBUTED
              </span>
            </div>

            <p className="text-3xl font-bold">
              {totalApprovedAmount.toLocaleString()}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Approved credits
            </p>
          </div>
        </div>

        {/* CONTRIBUTIONS TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          {/* TABLE HEADER */}
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold">
              Contribution History
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              All contributions made from your account.
            </p>
          </div>

          {contributions.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 rounded-full bg-slate-800 p-5">
                <FileDollar
                  width={30}
                  height={30}
                  className="text-slate-500"
                />
              </div>

              <h3 className="text-lg font-semibold">
                No Contributions Yet
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-400">
                You haven't contributed to any campaign yet.
                Explore campaigns and support a project you like.
              </p>

              <Link
                href="/dashboard/supporter/explore-campaigns"
                className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
              >
                Explore Campaigns
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-slate-800 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Campaign
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Creator
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {contributions.map((contribution) => {
                    const status = getStatus(
                      contribution.status
                    );

                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={contribution._id}
                        className="border-b border-slate-800/70 transition hover:bg-slate-800/40"
                      >
                        {/* CAMPAIGN */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-violet-500/10 p-2.5">
                              <FileDollar
                                width={19}
                                height={19}
                                className="text-violet-400"
                              />
                            </div>

                            <div>
                              <p className="font-medium text-white">
                                {contribution.campaign_title}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Campaign contribution
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CREATOR */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Person
                              width={17}
                              height={17}
                              className="text-slate-500"
                            />

                            {contribution.creator_name}
                          </div>
                        </td>

                        {/* AMOUNT */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 font-semibold text-white">
                            <CircleDollar
                              width={17}
                              height={17}
                              className="text-pink-400"
                            />

                            {Number(
                              contribution.Contribution_amount || 0
                            ).toLocaleString()}{" "}
                            credits
                          </div>
                        </td>

                        {/* DATE */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Calendar
                              width={16}
                              height={16}
                            />

                            {formatDate(
                              contribution.current_date
                            )}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                          >
                            <StatusIcon
                              width={15}
                              height={15}
                            />

                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* REJECTED INFO */}
        {rejectedCount > 0 && (
          <div className="mt-5 rounded-xl border border-red-500/10 bg-red-500/5 px-5 py-4">
            <p className="text-sm text-slate-400">
              You have{" "}
              <span className="font-semibold text-red-400">
                {rejectedCount}
              </span>{" "}
              rejected contribution
              {rejectedCount > 1 ? "s" : ""}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}