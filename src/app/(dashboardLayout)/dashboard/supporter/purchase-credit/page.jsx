"use client";

import {
  Wallet,
  CreditCard,
  Sparkles,
  ShieldCheck,
} from "@gravity-ui/icons";
import { authClient } from "@/app/lib/auth-client";

const creditPackages = [
  {
    name: "Starter",
    id: "supporter_starter",
    credits: 100,
    price: 10,
    description: "Perfect for getting started",
  },
  {
    name: "Popular",
    id: "supporter_popular",
    credits: 300,
    price: 25,
    description: "Great choice for regular supporters",
    popular: true,
  },
  {
    name: "Value",
    id: "supporter_value",
    credits: 800,
    price: 60,
    description: "More credits, better value",
  },
  {
    name: "Premium",
    id: "supporter_premium",
    credits: 1500,
    price: 110,
    description: "Best for frequent supporters",
  },
];

export default function PurchaseCreditPage() {
  const { data: session } = authClient.useSession();

  const supporter = session?.user;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-3">
              <Wallet
                width={25}
                height={25}
                className="text-violet-400"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Purchase Credit
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Choose a monthly credit package and support
                the campaigns you care about.
              </p>
            </div>
          </div>
        </div>

        {/* Current Balance */}
        <div className="mb-10 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-pink-500/10 p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-violet-500/10 p-4">
                <Wallet
                  width={30}
                  height={30}
                  className="text-violet-400"
                />
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Your current balance
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  {supporter?.credits ?? 0}

                  <span className="ml-2 text-base font-medium text-slate-400">
                    Credits
                  </span>
                </h2>
              </div>
            </div>

          </div>
        </div>

        {/* Package Heading */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Choose a Monthly Credit Package
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            You will be charged monthly according to your
            selected package.
          </p>
        </div>

        {/* Credit Packages */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          {creditPackages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl border p-6 text-left transition duration-200 ${
                pkg.popular
                  ? "border-violet-500/40 bg-slate-900"
                  : "border-slate-800 bg-slate-900 hover:-translate-y-1 hover:border-violet-500/40"
              }`}
            >

              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles
                      width={13}
                      height={13}
                    />

                    Most Popular
                  </span>
                </div>
              )}

              {/* Package Icon */}
              <div className="mb-5 inline-flex rounded-xl bg-violet-500/10 p-3">
                <Wallet
                  width={23}
                  height={23}
                  className="text-violet-400"
                />
              </div>

              {/* Package Name */}
              <h3 className="text-lg font-semibold">
                {pkg.name}
              </h3>

              {/* Description */}
              <p className="mt-2 min-h-[40px] text-sm leading-5 text-slate-400">
                {pkg.description}
              </p>

              {/* Credits */}
              <div className="mt-6">
                <p className="text-3xl font-bold">
                  {pkg.credits.toLocaleString()}
                </p>

                <p className="text-sm text-slate-500">
                  credits / month
                </p>
              </div>

              {/* Price */}
              <div className="mt-5 border-t border-slate-800 pt-5">
                <span className="text-2xl font-bold text-white">
                  ${pkg.price}
                </span>

                <span className="ml-2 text-sm text-slate-500">
                  / month
                </span>
              </div>

              {/* Purchase Button */}
              <form
                action="/api/checkout_sessions"
                method="POST"
                className="mt-6"
              >
                <input
                  type="hidden"
                  name="package"
                  value={pkg.id}
                />

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  <CreditCard
                    width={17}
                    height={17}
                  />

                  Purchase Now
                </button>
              </form>

            </div>
          ))}

        </div>

        {/* Stripe Information */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-5">

          <ShieldCheck
            width={20}
            height={20}
            className="mt-0.5 shrink-0 text-emerald-400"
          />

          <div>
            <p className="text-sm font-medium text-slate-300">
              Secure Monthly Payment with Stripe
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Your subscription is securely processed by
              Stripe. You will receive the selected credits
              each billing period while your subscription is
              active.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}