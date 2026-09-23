"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Calendar,
  CircleCheck,
  CircleDollar,
  Clock,
  Person,
  Tag,
  CrownDiamond,
  Wallet,
  TriangleExclamation,
} from "@gravity-ui/icons";

import Swal from "sweetalert2";
import { authClient } from "@/app/lib/auth-client";
import { getUserToken } from "@/lib/core/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params?.id;

  const { data: session } = authClient.useSession();

  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [error, setError] = useState("");

  const supporter = session?.user;

  // =========================================
  // FETCH CAMPAIGN
  // =========================================
  useEffect(() => {
    if (!campaignId) return;

    let cancelled = false;

    const fetchCampaign = async () => {
      try {
        setLoading(true);
        setError("");

        const token = await getUserToken();
        // console.log(token);
        const headers = {};

        if (token) {
          headers.Authorization = `Bearer ${token}`;
          console.log("Token generated:", Boolean(token));
        }

        const response = await fetch(`${API_URL}/api/campaigns/${campaignId}`, {
          method: "GET",
          headers,
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load campaign.");
        }

        if (!cancelled) {
          setCampaign(data);
        }
      } catch (err) {
        console.error("Campaign fetch error:", err);
        if (!cancelled) {
          setError(err.message || "Failed to load campaign.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCampaign();

    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  // =========================================
  // CONTRIBUTION
  // =========================================
  const handleContribution = async (e) => {
    e.preventDefault();

    if (!supporter) {
      await Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login as a Supporter to contribute.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    if (supporter.role !== "Supporter") {
      await Swal.fire({
        icon: "error",
        title: "Supporters Only",
        text: "Only Supporters can contribute to campaigns.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    const contributionAmount = Number(amount);

    if (!contributionAmount || contributionAmount <= 0) {
      setError("Please enter a valid contribution amount.");
      return;
    }

    if (contributionAmount < Number(campaign.minimum_contribution)) {
      setError(
        `Minimum contribution is ${campaign.minimum_contribution} credits.`
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = await getUserToken();

      if (!token) {
        throw new Error("Please log in to contribute.");
      }

      const response = await fetch(`${API_URL}/api/contributions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaign_id: campaign._id,
          campaign_title: campaign.campaign_title,
          Contribution_amount: contributionAmount,
          Supporter_email: supporter.email,
          Supporter_name: supporter.name,
          creator_name: campaign.creator_name,
          creator_email: campaign.creator_email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit contribution.");
      }

      setCampaign((prev) => ({
        ...prev,
        raised_amount: Number(prev.raised_amount || 0) + contributionAmount,
      }));

      setAmount("");

      await Swal.fire({
        icon: "success",
        title: "Contribution Submitted!",
        text: "Your contribution is now pending Creator approval.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================
  // REPORT CAMPAIGN
  // =========================================
  const handleReportCampaign = async () => {
    if (!supporter) {
      await Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login as a Supporter to report a campaign.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    if (supporter.role !== "Supporter") {
      await Swal.fire({
        icon: "error",
        title: "Supporters Only",
        text: "Only Supporters can report campaigns.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Report Campaign",
      text: "Why do you think this campaign is suspicious or fraudulent?",
      input: "textarea",
      inputPlaceholder: "Please describe the reason for reporting this campaign...",
      inputAttributes: {
        "aria-label": "Report reason",
      },
      showCancelButton: true,
      confirmButtonText: "Submit Report",
      cancelButtonText: "Cancel",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#475569",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Please provide a reason for reporting.";
        }
        if (value.trim().length < 10) {
          return "Please provide at least 10 characters.";
        }
        return null;
      },
    });

    if (!result.isConfirmed) return;

    setReporting(true);

    try {
      const token = await getUserToken();

      if (!token) {
        throw new Error("Please log in to report a campaign.");
      }

     const response = await fetch(`${API_URL}/api/reports`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    campaign_id: campaign._id,
    campaign_title: campaign.campaign_title,
    reason: result.value.trim(),
  }),
});

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit report.");
      }

      await Swal.fire({
        icon: "success",
        title: "Report Submitted",
        text: "Thank you. The Admin will review this campaign.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } catch (err) {
      console.error("Report campaign error:", err);
      await Swal.fire({
        icon: "error",
        title: "Report Failed",
        text: err.message || "Unable to submit your report.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } finally {
      setReporting(false);
    }
  };

  // =========================================
  // RENDER LOGIC
  // =========================================
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-6 w-32 rounded bg-slate-800" />
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="h-[500px] rounded-3xl bg-slate-900 lg:col-span-2" />
            <div className="h-[500px] rounded-3xl bg-slate-900" />
          </div>
        </div>
      </main>
    );
  }

  if (error && !campaign) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <CircleCheck width={30} height={30} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Campaign Not Found</h1>
          <p className="mt-2 text-slate-400">{error}</p>
          <Link
            href="/campaigns"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
          >
            <ArrowLeft width={18} height={18} />
            Back to Campaigns
          </Link>
        </div>
      </main>
    );
  }

  const fundingGoal = Number(campaign.funding_goal || 0);
  const raisedAmount = Number(campaign.raised_amount || 0);
  const progress =
    fundingGoal > 0 ? Math.min((raisedAmount / fundingGoal) * 100, 100) : 0;
  const deadline = new Date(campaign.deadline);
  const isExpired = deadline <= new Date();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/campaigns"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft width={18} height={18} />
          Back to Campaigns
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="relative h-[320px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 sm:h-[430px]">
              <Image
                src={campaign.campaign_image_url}
                alt={campaign.campaign_title || "Campaign"}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="rounded-full border border-violet-400/20 bg-violet-500/20 px-4 py-2 text-sm font-semibold text-violet-200 backdrop-blur-md">
                  {campaign.category}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {campaign.campaign_title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Person width={18} height={18} className="text-violet-400" />
                  <span>
                    Created by{" "}
                    <strong className="text-slate-200">
                      {campaign.creator_name}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Tag width={18} height={18} className="text-pink-400" />
                  <span>{campaign.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar width={18} height={18} className="text-emerald-400" />
                  <span>Deadline: {deadline.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleReportCampaign}
                  disabled={reporting}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <TriangleExclamation width={17} height={17} />
                  {reporting ? "Submitting Report..." : "Report Campaign"}
                </button>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-bold">About This Campaign</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-400">
                  {campaign.campaign_story}
                </p>
              </div>

              {campaign.reward_info && (
                <div className="mt-8 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-6">
                  <div className="flex items-center gap-3">
                    <CrownDiamond width={22} height={22} className="text-amber-400" />
                    <h3 className="font-bold text-amber-300">
                      Supporter Reward
                    </h3>
                  </div>
                  <p className="mt-3 leading-7 text-slate-400">
                    {campaign.reward_info}
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside>
            <div className="sticky top-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Raised</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {raisedAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500">credits</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Goal</p>
                  <p className="font-semibold text-slate-300">
                    {fundingGoal.toLocaleString()} credits
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-pink-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="font-semibold text-violet-300">
                    {progress.toFixed(1)}% funded
                  </span>
                  <span className="text-slate-500">
                    {Math.max(fundingGoal - raisedAmount, 0).toLocaleString()}{" "}
                    credits left
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <Clock
                    width={20}
                    height={20}
                    className={isExpired ? "text-red-400" : "text-emerald-400"}
                  />
                  <p className="mt-2 text-xs text-slate-500">Deadline</p>
                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    {deadline.toLocaleDateString()}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <CircleDollar width={20} height={20} className="text-pink-400" />
                  <p className="mt-2 text-xs text-slate-500">Minimum</p>
                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    {campaign.minimum_contribution} credits
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-800 pt-7">
                <div className="flex items-center gap-2">
                  <Wallet width={20} height={20} className="text-violet-400" />
                  <h2 className="text-xl font-bold">Support This Campaign</h2>
                </div>

                {!supporter ? (
                  <div className="mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
                    <p className="text-sm leading-6 text-slate-400">
                      Login as a Supporter to contribute to this campaign.
                    </p>
                    <Link
                      href="/login"
                      className="mt-4 block rounded-xl bg-violet-600 px-4 py-3 text-center font-semibold transition hover:bg-violet-500"
                    >
                      Login to Contribute
                    </Link>
                  </div>
                ) : supporter.role !== "Supporter" ? (
                  <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                    <p className="text-sm leading-6 text-slate-400">
                      Only Supporters can contribute to campaigns.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContribution} className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Contribution Amount
                    </label>

                    <div className="relative">
                      <input
                        type="number"
                        min={campaign.minimum_contribution}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Minimum ${campaign.minimum_contribution} credits`}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-20 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                        Credits
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Your available credits will be checked when you submit.
                    </p>

                    {error && (
                      <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || isExpired}
                      className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting
                        ? "Submitting..."
                        : isExpired
                        ? "Campaign Ended"
                        : "Contribute Now"}
                    </button>

                    <p className="mt-3 text-center text-xs text-slate-600">
                      Contribution will remain pending until the Creator approves it.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}