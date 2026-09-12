"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  CircleCheck,
  Clock,
  CircleXmark,
  Receipt,
  Wallet,
} from "@gravity-ui/icons";
import { authClient } from "@/app/lib/auth-client";

export default function PaymentHistoryPage() {
  const { data: session } = authClient.useSession();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const supporter = session?.user;

  useEffect(() => {
    if (!supporter?.email) return;

    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/payments/history?email=${encodeURIComponent(
            supporter.email
          )}`
        );

        const data = await response.json();

        if (data.success) {
          setPayments(data.payments || []);
        } else {
          setPayments([]);
        }
      } catch (error) {
        console.error("Payment history error:", error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [supporter?.email]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(Number(amount || 0));
  };

  const paidPayments = payments.filter(
    (payment) => payment.paid || payment.status === "paid"
  );

  const totalPaid = paidPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const getStatus = (payment) => {
    if (payment.paid || payment.status === "paid") {
      return {
        label: "Paid",
        icon: CircleCheck,
        className:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      };
    }

    if (
      payment.status === "open" ||
      payment.status === "pending"
    ) {
      return {
        label: "Pending",
        icon: Clock,
        className:
          "border-amber-500/20 bg-amber-500/10 text-amber-400",
      };
    }

    return {
      label: "Failed",
      icon: CircleXmark,
      className: "border-red-500/20 bg-red-500/10 text-red-400",
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/supporter"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft width={17} height={17} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
              <Receipt
                width={27}
                height={27}
                className="text-violet-400"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Payment History
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                View your Fundora credit subscription payments
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Payments */}
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Total Payments
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {payments.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                <Receipt
                  width={23}
                  height={23}
                  className="text-violet-400"
                />
              </div>
            </div>
          </div>

          {/* Successful */}
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Successful Payments
                </p>

                <h2 className="mt-2 text-3xl font-bold text-emerald-400">
                  {paidPayments.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <CircleCheck
                  width={23}
                  height={23}
                  className="text-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Total Paid */}
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Total Paid
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  ${totalPaid.toFixed(2)}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10">
                <Wallet
                  width={23}
                  height={23}
                  className="text-pink-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

          {/* Table Header */}
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <CreditCard
                width={21}
                height={21}
                className="text-violet-400"
              />

              <div>
                <h2 className="font-semibold">
                  Transaction History
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your Stripe subscription transactions
                </p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />

                <p className="text-sm text-slate-400">
                  Loading payment history...
                </p>
              </div>
            </div>
          ) : payments.length === 0 ? (
            /* Empty State */
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
                <Receipt
                  width={30}
                  height={30}
                  className="text-slate-500"
                />
              </div>

              <h3 className="text-lg font-semibold">
                No payment history
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                You haven't made any credit subscription payments
                yet. Your Stripe payments will appear here after
                completing a purchase.
              </p>

              <Link
                href="/dashboard/supporter/purchase-credit"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
              >
                <CreditCard width={17} height={17} />
                Purchase Credits
              </Link>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Billing Period
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Receipt
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => {
                    const status = getStatus(payment);
                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={payment.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.02]"
                      >
                        {/* Payment */}
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-medium text-white">
                              Fundora Credit Subscription
                            </p>

                            {payment.description && (
                              <p className="mt-1 max-w-xs text-xs text-slate-500">
                                {payment.description}
                              </p>
                            )}

                            {payment.invoiceNumber && (
                              <p className="mt-1 text-xs text-slate-600">
                                Invoice #{payment.invoiceNumber}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-5">
                          <span className="font-semibold text-white">
                            {formatAmount(
                              payment.amount,
                              payment.currency
                            )}
                          </span>
                        </td>

                        {/* Billing Period */}
                        <td className="px-6 py-5">
                          {payment.periodStart &&
                          payment.periodEnd ? (
                            <div className="text-sm">
                              <p className="text-slate-300">
                                {formatDate(payment.periodStart)}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                to {formatDate(payment.periodEnd)}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              Monthly
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5 text-sm text-slate-400">
                          {formatDate(payment.date)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}
                          >
                            <StatusIcon
                              width={14}
                              height={14}
                            />

                            {status.label}
                          </span>
                        </td>

                        {/* Receipt */}
                        <td className="px-6 py-5">
                          {payment.hostedInvoiceUrl ? (
                            <a
                              href={payment.hostedInvoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-violet-500/10 hover:text-violet-300"
                            >
                              <Receipt
                                width={15}
                                height={15}
                              />
                              View
                            </a>
                          ) : (
                            <span className="text-xs text-slate-600">
                              N/A
                            </span>
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

        {/* Security Notice */}
        <div className="mt-6 rounded-2xl border border-violet-500/10 bg-violet-500/5 p-5">
          <div className="flex gap-3">
            <CreditCard
              width={19}
              height={19}
              className="mt-0.5 shrink-0 text-violet-400"
            />

            <div>
              <p className="text-sm font-medium text-violet-300">
                Secure Stripe Payments
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your payment information is securely processed by
                Stripe. Fundora does not store your card details.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}