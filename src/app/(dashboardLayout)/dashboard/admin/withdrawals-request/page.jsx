"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  CircleCheckFill,
  Clock,
  Person,
  Calendar,
  HandPointLeft,
  CreditCard,
} from "@gravity-ui/icons";
import Swal from "sweetalert2";

export default function WithdrawalRequestsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ==================== LOAD WITHDRAWALS ====================

  useEffect(() => {
    let cancelled = false;

    const loadWithdrawals = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/withdrawals/pending",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load withdrawal requests."
          );
        }

        if (!cancelled) {
          setWithdrawals(data.withdrawals || []);
        }
      } catch (error) {
        console.error(
          "Withdrawal requests error:",
          error
        );

        if (!cancelled) {
          Swal.fire({
            icon: "error",
            title: "Failed to load",
            text:
              error.message ||
              "Unable to load withdrawal requests.",
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

    loadWithdrawals();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==================== PAYMENT SUCCESS ====================

  const handlePaymentSuccess = async (withdrawal) => {
    const amount = Number(
      withdrawal.amount ||
        withdrawal.withdrawal_amount ||
        withdrawal.credits ||
        0
    );

    const creatorName =
      withdrawal.creator_name ||
      withdrawal.name ||
      "Creator";

    const result = await Swal.fire({
      title: "Confirm Payment?",
      html: `
        <div style="text-align:center">
          <p style="margin-bottom:8px">
            Creator: <strong>${creatorName}</strong>
          </p>
          <p>
            Withdrawal:
            <strong>${amount.toLocaleString()} credits</strong>
          </p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Payment Success",
      cancelButtonText: "Cancel",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#475569",
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(withdrawal._id);

      const response = await fetch(
        `http://localhost:5000/api/admin/withdrawals/${withdrawal._id}/approve`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to process withdrawal."
        );
      }

      setWithdrawals((previous) =>
        previous.filter(
          (item) => item._id !== withdrawal._id
        )
      );

      Swal.fire({
        icon: "success",
        title: "Payment Successful",
        text: `${amount.toLocaleString()} credits withdrawal has been approved.`,
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } catch (error) {
      console.error(
        "Payment success error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text:
          error.message ||
          "Unable to process withdrawal.",
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
              Loading withdrawal requests...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== PAGE ====================

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
      {/* Header */}

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 p-3">
            <Wallet className="h-6 w-6 text-violet-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Withdrawal Requests
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Review and process creator withdrawal requests
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {/* Pending Requests */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Pending Requests
              </p>

              <p className="mt-1 text-3xl font-bold text-white">
                {withdrawals.length}
              </p>
            </div>

            <div className="rounded-xl bg-amber-500/10 p-3">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Total Requested */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Total Requested
              </p>

              <p className="mt-1 text-3xl font-bold text-white">
                {withdrawals
                  .reduce(
                    (total, withdrawal) =>
                      total +
                      Number(
                        withdrawal.amount ||
                          withdrawal.withdrawal_amount ||
                          withdrawal.credits ||
                          0
                      ),
                    0
                  )
                  .toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                credits
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-3">
              <HandPointLeft className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}

      {withdrawals.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-12 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full bg-emerald-500/10 p-4">
            <CircleCheckFill className="h-8 w-8 text-emerald-400" />
          </div>

          <h2 className="text-lg font-semibold">
            No Pending Withdrawals
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            All creator withdrawal requests have been processed.
          </p>
        </div>
      ) : (
        /* Table */

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Creator
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Payment Method
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Request Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {withdrawals.map((withdrawal) => {
                  const amount = Number(
                    withdrawal.amount ||
                      withdrawal.withdrawal_amount ||
                      withdrawal.credits ||
                      0
                  );

                  const creatorName =
                    withdrawal.creator_name ||
                    withdrawal.name ||
                    "Unknown Creator";

                  const creatorEmail =
                    withdrawal.creator_email ||
                    withdrawal.email ||
                    "N/A";

                  const requestDate =
                    withdrawal.createdAt ||
                    withdrawal.request_date ||
                    withdrawal.current_date;

                  return (
                    <tr
                      key={withdrawal._id}
                      className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                    >
                      {/* Creator */}

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
                            <Person className="h-5 w-5 text-violet-400" />
                          </div>

                          <div>
                            <p className="font-medium text-white">
                              {creatorName}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {creatorEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-emerald-500/10 p-2">
                            <HandPointLeft className="h-4 w-4 text-emerald-400" />
                          </div>

                          <div>
                            <p className="font-semibold text-emerald-400">
                              {amount.toLocaleString()}
                            </p>

                            <p className="text-xs text-slate-500">
                              credits
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Payment Method */}

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <CreditCard className="h-4 w-4 text-slate-500" />

                          {withdrawal.payment_method ||
                            "Manual Payment"}
                        </div>
                      </td>

                      {/* Date */}

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="h-4 w-4 text-slate-500" />

                          {requestDate
                            ? new Date(
                                requestDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>

                      {/* Status */}

                      <td className="px-5 py-5">
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />

                          Pending
                        </span>
                      </td>

                      {/* Action */}

                      <td className="px-5 py-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            disabled={
                              actionLoading ===
                              withdrawal._id
                            }
                            onClick={() =>
                              handlePaymentSuccess(
                                withdrawal
                              )
                            }
                            className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <CircleCheckFill className="h-4 w-4" />

                            {actionLoading ===
                            withdrawal._id
                              ? "Processing..."
                              : "Payment Success"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}