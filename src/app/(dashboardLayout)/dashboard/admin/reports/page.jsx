"use client";

import { useEffect, useState } from "react";
import {
  ChartBar,
  Folder,
  Person,
  Calendar,
  CircleXmarkFill,
  TriangleExclamation,
  Shield,
  TrashBin,
  Clock,
} from "@gravity-ui/icons";
import Swal from "sweetalert2";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // =================================
  // FETCH REPORTS
  // =================================
  useEffect(() => {
    let cancelled = false;

    const fetchReports = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/reports",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (cancelled) return;

        if (data.success) {
          setReports(data.reports || []);
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: data.message || "Failed to load reports.",
            background: "#0f172a",
            color: "#fff",
            confirmButtonColor: "#7c3aed",
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Fetch reports error:", error);

        if (cancelled) return;

        setLoading(false);

        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: "Unable to load reports.",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#7c3aed",
        });
      }
    };

    fetchReports();

    return () => {
      cancelled = true;
    };
  }, []);

  // =================================
  // SUSPEND CAMPAIGN
  // =================================
  const handleSuspend = async (report) => {
    const result = await Swal.fire({
      title: "Suspend Campaign?",
      text: `"${report.campaign_title}" will be suspended.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Suspend",
      cancelButtonText: "Cancel",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#475569",
    });

    if (!result.isConfirmed) return;

    setActionId(report._id);

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/reports/${report._id}/suspend`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to suspend campaign."
        );
      }

      setReports((prev) =>
        prev.map((item) =>
          item._id === report._id
            ? {
                ...item,
                status: "suspended",
              }
            : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "Campaign Suspended",
        text: "The reported campaign has been suspended.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#7c3aed",
      });
    } catch (error) {
      console.error("Suspend campaign error:", error);

      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text: error.message || "Unable to suspend campaign.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setActionId(null);
    }
  };

  // =================================
  // DELETE CAMPAIGN
  // =================================
  const handleDelete = async (report) => {
    const result = await Swal.fire({
      title: "Delete Campaign?",
      text: `"${report.campaign_title}" will be permanently deleted.`,
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

    setActionId(report._id);

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/reports/${report._id}/campaign`,
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

      setReports((prev) =>
        prev.map((item) =>
          item._id === report._id
            ? {
                ...item,
                status: "deleted",
              }
            : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "Campaign Deleted",
        text: "The reported campaign has been deleted.",
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
      setActionId(null);
    }
  };

  // =================================
  // FORMAT DATE
  // =================================
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

  // =================================
  // STATUS STYLE
  // =================================
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "border-amber-500/20 bg-amber-500/10 text-amber-400";

      case "suspended":
        return "border-orange-500/20 bg-orange-500/10 text-orange-400";

      case "deleted":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      default:
        return "border-slate-500/20 bg-slate-500/10 text-slate-400";
    }
  };

  // =================================
  // STATISTICS
  // =================================
  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === "pending"
  ).length;

  const resolvedReports = reports.filter(
    (report) =>
      report.status === "suspended" ||
      report.status === "deleted"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8">
      {/* =================================
          HEADER
      ================================= */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/15">
            <ChartBar
              width={22}
              height={22}
              className="text-violet-400"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Reports
            </h1>

            <p className="text-sm text-slate-500">
              Review suspicious or fraudulent campaign reports
            </p>
          </div>
        </div>
      </div>

      {/* =================================
          STAT CARDS
      ================================= */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Reports */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Reports
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalReports}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
              <TriangleExclamation
                width={21}
                height={21}
                className="text-violet-400"
              />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Pending Reports
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {pendingReports}
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

        {/* Resolved */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Resolved
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {resolvedReports}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <Shield
                width={21}
                height={21}
                className="text-emerald-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =================================
          REPORTS TABLE
      ================================= */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
        <div className="border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="font-semibold text-white">
              Campaign Reports
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Reports submitted by Supporters
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />

              <p className="text-sm text-slate-500">
                Loading reports...
              </p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          /* Empty */
          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
              <TriangleExclamation
                width={25}
                height={25}
                className="text-slate-600"
              />
            </div>

            <h3 className="text-lg font-semibold text-white">
              No Reports
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              There are currently no campaign reports from
              Supporters.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Reporter
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Campaign
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Reason
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date
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
                {reports.map((report) => {
                  const isHandled =
                    report.status === "suspended" ||
                    report.status === "deleted";

                  return (
                    <tr
                      key={report._id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >
                      {/* Reporter */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
                            <Person
                              width={18}
                              height={18}
                              className="text-violet-400"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-white">
                              {report.reporter_name ||
                                "Unknown"}
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              {report.reporter_email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Campaign */}
                      <td className="px-5 py-5">
                        <div className="flex max-w-[230px] items-center gap-2">
                          <Folder
                            width={17}
                            height={17}
                            className="shrink-0 text-violet-400"
                          />

                          <span className="truncate text-sm font-medium text-slate-300">
                            {report.campaign_title ||
                              "Unknown Campaign"}
                          </span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="px-5 py-5">
                        <div className="max-w-[320px]">
                          <p className="line-clamp-2 text-sm leading-6 text-slate-400">
                            {report.reason ||
                              "No reason provided"}
                          </p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">
                          <Calendar
                            width={16}
                            height={16}
                            className="text-slate-500"
                          />

                          <span className="text-sm text-slate-400">
                            {formatDate(report.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${getStatusStyle(
                            report.status
                          )}`}
                        >
                          {report.status || "pending"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-5">
                        {isHandled ? (
                          <div className="flex justify-end">
                            <span className="text-xs text-slate-600">
                              Handled
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            {/* Suspend */}
                            <button
                              type="button"
                              onClick={() =>
                                handleSuspend(report)
                              }
                              disabled={
                                actionId === report._id
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-400 transition hover:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Shield
                                width={15}
                                height={15}
                              />

                              {actionId === report._id
                                ? "Processing..."
                                : "Suspend"}
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(report)
                              }
                              disabled={
                                actionId === report._id
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <TrashBin
                                width={15}
                                height={15}
                              />

                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}