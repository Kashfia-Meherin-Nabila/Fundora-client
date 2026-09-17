"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Eye,
  Magnifier,
  Folder,
  CircleDollar,
} from "@gravity-ui/icons";
import { getUserToken } from "@/lib/core/session";

const API_URL =process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  

  useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      // 1. Generate/get the Better Auth JWT
      const token = await getUserToken();

      if (!token) {
        throw new Error("Please log in to get your token.");
      }

      // 2. Send the token to your Express backend
      const response = await fetch(
        `${API_URL}/api/campaigns/explore`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch campaigns: ${response.status}`
        );
      }

      const data = await response.json();

      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  fetchCampaigns();
}, []);

  // Categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(campaigns.map((campaign) => campaign.category)),
    ];

    return ["All", ...uniqueCategories];
  }, [campaigns]);

  // Search + category filtering
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        campaign.campaign_title
          ?.toLowerCase()
          .includes(searchText) ||
        campaign.creator_name
          ?.toLowerCase()
          .includes(searchText) ||
        campaign.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        campaign.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [campaigns, search, selectedCategory]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProgress = (raised, goal) => {
    if (!goal) return 0;

    return Math.min(
      (Number(raised || 0) / Number(goal)) * 100,
      100
    );
    
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-violet-950/30 to-slate-950">

        <div className="mx-auto max-w-7xl px-6 py-16 text-center">

          <div className="mx-auto max-w-3xl">

            <span className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-400">
              Discover • Support • Make an Impact
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Support Ideas That
              <span className="text-violet-500">
                {" "}Matter
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
              Explore inspiring campaigns created by people
              who are turning their ideas into meaningful projects.
              Find a campaign you believe in and help make it happen.
            </p>

          </div>

        </div>

      </section>

      {/* =========================
          SEARCH & FILTER
      ========================= */}
      <section className="mx-auto max-w-7xl px-6 pt-10">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

          {/* Search */}
          <div className="relative">

            <Magnifier
              width={20}
              height={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search campaigns, creators or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
            />

          </div>

          {/* Categories */}
          <div className="mt-5 flex flex-wrap items-center gap-2">

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-violet-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}

          </div>

        </div>

      </section>

      {/* =========================
          CAMPAIGNS SECTION
      ========================= */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Section Header */}
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

          <div>
            <h2 className="text-2xl font-bold">
              Featured Campaigns
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {loading
                ? "Finding campaigns..."
                : `${filteredCampaigns.length} campaign${
                    filteredCampaigns.length !== 1 ? "s" : ""
                  } available`}
            </p>
          </div>

          {!loading && search && (
            <p className="text-sm text-slate-500">
              Searching for {search}
            </p>
          )}

        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
              >
                <div className="h-56 animate-pulse bg-slate-800" />

                <div className="space-y-4 p-6">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />

                  <div className="h-6 w-3/4 animate-pulse rounded bg-slate-800" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-800" />

                  <div className="h-12 animate-pulse rounded bg-slate-800" />
                </div>
              </div>
            ))}

          </div>
        )}

        {/* Empty */}
        {!loading && filteredCampaigns.length === 0 && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-center">

            <div className="rounded-full bg-slate-800 p-4">
              <Folder
                width={35}
                height={35}
                className="text-slate-500"
              />
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              No campaigns found
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-400">
              Try changing your search or selecting another
              category to discover more campaigns.
            </p>

            {(search || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-5 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium hover:bg-violet-500"
              >
                Clear Filters
              </button>
            )}

          </div>
        )}

        {/* Campaign Cards */}
        {!loading && filteredCampaigns.length > 0 && (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">

            {filteredCampaigns.map((campaign) => {

              const progress = getProgress(
                campaign.raised_amount,
                campaign.funding_goal
              );

              return (
                <article
                  key={campaign._id}
                  className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-950/20"
                >

                  {/* Image */}
                  <div className="relative h-60 overflow-hidden bg-slate-800">

                    <Image
                      src={campaign.campaign_image_url}
                      alt={campaign.campaign_title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Category Badge */}
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-violet-300 backdrop-blur-sm">
                        {campaign.category}
                      </span>
                    </div>

                  </div>

                  {/* Content */}
                  <div className="p-6">

                    {/* Title */}
                    <h3 className="line-clamp-2 min-h-[56px] text-xl font-semibold leading-7">
                      {campaign.campaign_title}
                    </h3>

                    {/* Creator */}
                    <p className="mt-2 text-sm text-slate-400">
                      Created by{" "}
                      <span className="font-medium text-slate-300">
                        {campaign.creator_name}
                      </span>
                    </p>

                    {/* Deadline */}
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                      <Calendar
                        width={17}
                        height={17}
                        className="text-violet-400"
                      />

                      <span>
                        Ends {formatDate(campaign.deadline)}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mt-6">

                      <div className="mb-2 flex items-center justify-between text-sm">

                        <span className="text-slate-400">
                          {Number(
                            campaign.raised_amount || 0
                          ).toLocaleString()}{" "}
                          credits raised
                        </span>

                        <span className="font-semibold text-violet-400">
                          {progress.toFixed(0)}%
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                        <div
                          className="h-full rounded-full bg-violet-500 transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* Goal / Raised */}
                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-slate-950 p-3.5">

                        <div className="flex items-center gap-2">
                          <CircleDollar
                            width={16}
                            height={16}
                            className="text-violet-400"
                          />

                          <span className="text-xs text-slate-500">
                            Goal
                          </span>
                        </div>

                        <p className="mt-1 font-semibold">
                          {Number(
                            campaign.funding_goal || 0
                          ).toLocaleString()}{" "}
                          credits
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-950 p-3.5">

                        <span className="text-xs text-slate-500">
                          Raised
                        </span>

                        <p className="mt-1 font-semibold text-emerald-400">
                          {Number(
                            campaign.raised_amount || 0
                          ).toLocaleString()}{" "}
                          credits
                        </p>

                      </div>

                    </div>

                    {/* View Details */}
                    <Link
                      href={`/campaigns/${campaign._id}`}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-medium transition hover:bg-violet-500"
                    >
                      <Eye
                        width={18}
                        height={18}
                      />

                      View Details
                    </Link>

                  </div>
                </article>
              );
            })}

          </div>
        )}

      </section>

    </main>
  );
}