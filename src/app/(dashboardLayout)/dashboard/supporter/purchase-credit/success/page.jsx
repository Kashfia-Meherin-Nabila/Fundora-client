"use client";

import Link from "next/link";
import { CircleCheckFill, House, Wallet, Compass } from "@gravity-ui/icons";
import { useSearchParams } from "next/navigation";

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams();

  const credits = searchParams.get("credits") || "0";
  const amount = searchParams.get("amount") || "0";
  const packageName = searchParams.get("package") || "Credit Package";
  const balance = searchParams.get("balance") || "0";

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl">

        {/* Success Card */}
        <div className="rounded-3xl border border-emerald-500/20 bg-slate-900 p-8 md:p-10 shadow-2xl shadow-emerald-950/20">

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CircleCheckFill className="w-12 h-12 text-emerald-400" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              Purchase Successful!
            </h1>

            <p className="text-slate-400 mt-3 text-base md:text-lg">
              Your credits have been added to your account successfully.
            </p>
          </div>

          {/* Purchase Details */}
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

            <h2 className="text-lg font-semibold mb-5">
              Purchase Details
            </h2>

            <div className="space-y-4">

              {/* Package */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">
                  Package
                </span>

                <span className="font-semibold text-white">
                  {packageName}
                </span>
              </div>

              {/* Credits */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">
                  Credits Purchased
                </span>

                <span className="font-semibold text-violet-400">
                  +{Number(credits).toLocaleString()} Credits
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">
                  Amount Paid
                </span>

                <span className="font-semibold text-white">
                  ${amount}
                </span>
              </div>

              <div className="border-t border-slate-800 pt-4"></div>

              {/* New Balance */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">
                  New Credit Balance
                </span>

                <span className="text-xl font-bold text-emerald-400">
                  {Number(balance).toLocaleString()} Credits
                </span>
              </div>

            </div>
          </div>

          {/* Success Message */}
          <div className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <div className="flex gap-3">
              <Wallet className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />

              <p className="text-sm text-slate-300">
                Your credits are now available. You can use them to
                support any approved campaign on Fundora.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">

            <Link
              href="/dashboard/supporter"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              <House className="w-4 h-4" />
              Dashboard
            </Link>

            <Link
              href="/dashboard/supporter/explore-campaigns"
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>

            <Link
              href="/dashboard/supporter/purchase-credit"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              <Wallet className="w-4 h-4" />
              Buy More
            </Link>

          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Thank you for supporting creators through Fundora 💜
        </p>

      </div>
    </div>
  );
}