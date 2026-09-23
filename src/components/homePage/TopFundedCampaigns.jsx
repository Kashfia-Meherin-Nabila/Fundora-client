"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@gravity-ui/icons";
import { useSession } from "@/app/lib/auth-client";
import API_URL from "@/lib/core/url";

export default function TopFundedCampaigns() {
  const { data: session, isPending } = useSession();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isLoggedIn = !!session?.user;

  useEffect(() => {
    let cancelled = false;

    const fetchTopCampaigns = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/campaigns/top-funded`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load campaigns."
          );
        }

        if (!cancelled) {
          setCampaigns(
            Array.isArray(data.campaigns)
              ? data.campaigns
              : []
          );
        }
      } catch (error) {
        console.error("Top funded campaigns error:", error);

        if (!cancelled) {
          setError("Unable to load campaigns right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTopCampaigns();

    return () => {
      cancelled = true;
    };
  }, []);

  // Campaign destination based on login status
  const getCampaignHref = (campaignId) => {
    const detailsUrl = `/campaigns/${campaignId}`;

    if (isLoggedIn) {
      return detailsUrl;
    }

    return `/login?callbackURL=${encodeURIComponent(detailsUrl)}`;
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300">
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              Making an impact
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Top Funded{" "}
              <span className="text-violet-400">
                Campaigns
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Discover the campaigns that have raised the
              most credits with the support of our community.
            </p>
          </div>

          <Link
            href="/campaigns"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-500/40 hover:bg-violet-500/10"
          >
            Explore campaigns
            <ArrowUpRight width={18} height={18} />
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
              >
                <div className="h-56 bg-slate-800" />

                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 rounded bg-slate-800" />
                  <div className="h-4 w-1/2 rounded bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-red-300">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && campaigns.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center">
            <h3 className="text-xl font-semibold text-white">
              No funded campaigns yet
            </h3>

            <p className="mt-2 text-slate-400">
              Check back soon to discover inspiring campaigns.
            </p>
          </div>
        )}

        {/* Campaign cards */}
        {!loading && !error && campaigns.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign, index) => (
              <Link
                key={campaign._id}
                href={getCampaignHref(campaign._id)}
                aria-disabled={isPending}
                onClick={(event) => {
                  if (isPending) {
                    event.preventDefault();
                  }
                }}
                className={`group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 transition duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-950/20 ${
                  isPending ? "pointer-events-none opacity-70" : ""
                }`}
              >
                {/* Cover image */}
                <div className="relative h-56 overflow-hidden bg-slate-800">
                  {campaign.campaign_image_url ? (
                    <Image
                      src={campaign.campaign_image_url}
                      alt={campaign.campaign_title || "Campaign cover"}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      No campaign image
                    </div>
                  )}

                  {/* Ranking badge */}
                  <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                    #{index + 1} Top funded
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/80 to-transparent" />
                </div>

                {/* Card content */}
                <div className="p-5">
                  <h3 className="line-clamp-2 min-h-14 text-lg font-bold text-white transition group-hover:text-violet-300">
                    {campaign.campaign_title}
                  </h3>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Total raised
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-xl font-bold text-violet-400">
                        {Number(
                          campaign.raised_amount || 0
                        ).toLocaleString()}{" "}
                        <span className="text-sm font-medium text-slate-400">
                          Credits
                        </span>
                      </p>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-300 transition group-hover:bg-violet-500 group-hover:text-white">
                        <ArrowUpRight
                          width={18}
                          height={18}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}