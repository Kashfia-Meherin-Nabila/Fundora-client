"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/app/lib/auth-client";
import {
  CreditCard,
  Wallet,
  Calendar,
  CircleCheck,
  CircleXmark,
  Clock,
  
  CircleDollar,
} from "@gravity-ui/icons";

export default function PaymentHistoryPage() {
  const { data: session, isPending } = useSession();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;

    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/withdrawals/creator/${encodeURIComponent(
            email
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payment history");
        }

        const data = await response.json();

        setPayments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Payment history error:", error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [email]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
      case "paid":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "rejected":
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
      case "paid":
        return <CircleCheck width={16} height={16} />;

      case "rejected":
      case "cancelled":
        return <CircleXmark width={16} height={16} />;

      default:
        return <Clock width={16} height={16} />;
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-slate-400">
            Loading payment history...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <CreditCard width={22} height={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Payment History
            </h1>

            <p className="text-sm text-slate-400">
              View all your withdrawal and payment records
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Total Payments */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Wallet width={20} height={20} />
            </div>

            <span className="text-xs text-slate-500">
              RECORDS
            </span>
          </div>

          <p className="text-2xl font-bold">
            {payments.length}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Total payments
          </p>
        </div>

        {/* Total Credits */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
              <CircleDollar width={20} height={20} />
            </div>

            <span className="text-xs text-slate-500">
              CREDITS
            </span>
          </div>

          <p className="text-2xl font-bold">
            {payments.reduce(
              (total, payment) =>
                total + Number(payment.withdrawal_credit || 0),
              0
            )}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Credits withdrawn
          </p>
        </div>

        {/* Total Amount */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <CreditCard width={20} height={20} />
            </div>

            <span className="text-xs text-slate-500">
              AMOUNT
            </span>
          </div>

          <p className="text-2xl font-bold">
            $
            {payments
              .reduce(
                (total, payment) =>
                  total + Number(payment.withdrawal_amount || 0),
                0
              )
              .toFixed(2)}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Total withdrawal amount
          </p>
        </div>
      </div>

      {/* Payment Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        {/* Table Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Withdrawal Records
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {payments.length} payment
              {payments.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/50">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-slate-500">
              <CreditCard width={26} height={26} />
            </div>

            <h3 className="text-lg font-medium text-white">
              No payment history
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your withdrawal records will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/70">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    #
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Credits
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Payment System
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Account
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment, index) => (
                  <tr
                    key={payment._id || index}
                    className="border-b border-white/5 transition hover:bg-slate-800/40"
                  >
                    {/* Number */}
                    <td className="px-5 py-5">
                      <span className="text-sm text-slate-500">
                        {index + 1}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <Calendar
                          width={17}
                          height={17}
                          className="text-slate-500"
                        />

                        <span className="text-sm text-slate-300">
                          {formatDate(payment.withdraw_date)}
                        </span>
                      </div>
                    </td>

                    {/* Credits */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <CircleDollar
                          width={17}
                          height={17}
                          className="text-violet-400"
                        />

                        <span className="font-medium text-white">
                          {payment.withdrawal_credit}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-5">
                      <span className="font-semibold text-emerald-400">
                        ${Number(payment.withdrawal_amount || 0).toFixed(2)}
                      </span>
                    </td>

                    {/* Payment System */}
                    <td className="px-5 py-5">
                      <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300">
                        {payment.payment_system || "N/A"}
                      </span>
                    </td>

                    {/* Account */}
                    <td className="px-5 py-5">
                      <span className="text-sm text-slate-400">
                        {payment.account_number || "N/A"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${getStatusStyle(
                          payment.status
                        )}`}
                      >
                        {getStatusIcon(payment.status)}
                        {payment.status || "pending"}
                      </span>
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