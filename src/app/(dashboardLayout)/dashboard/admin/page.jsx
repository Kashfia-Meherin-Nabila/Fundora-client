"use client";

import { useEffect, useState } from "react";
import {
  Person,
  Persons,
  Wallet,
  CreditCard,
} from "@gravity-ui/icons";
import { getUserToken } from "@/lib/core/session";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSupporters: 0,
    totalCreators: 0,
    totalAvailableCredits: 0,
    totalPaymentsProcessed: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let ignore = false;
    const fetchAdminStats = async () => {
      try {
        setLoading(true);

       const token = await getUserToken();
       console.log(token);

        if (!token) {
          throw new Error("Missing auth token.");
        }

        const response = await fetch(
          "http://localhost:5000/api/admin/stats",
          {
            cache: "no-store",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );


        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load admin statistics."
          );
        }

        setStats(data.stats);
      } catch (error) {
        console.error(
          "Admin stats error:",
          error
        );

        setError(
          error.message ||
            "Failed to load statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
    return () => {
      ignore = true;
    };
  
  }, []);

  const statCards = [
    {
      title: "Total Supporters",
      value: stats.totalSupporters,
      icon: Person,
      description:
        "Registered supporters on Fundora",
      iconStyle:
        "bg-violet-500/10 text-violet-400",
    },

    {
      title: "Total Creators",
      value: stats.totalCreators,
      icon: Persons,
      description:
        "Registered campaign creators",
      iconStyle:
        "bg-pink-500/10 text-pink-400",
    },

    {
      title: "Available Credits",
      value: stats.totalAvailableCredits,
      icon: Wallet,
      description:
        "Credits currently held by users",
      iconStyle:
        "bg-emerald-500/10 text-emerald-400",
    },

    {
      title: "Payments Processed",
      value: stats.totalPaymentsProcessed,
      icon: CreditCard,
      description:
        "Successful Stripe payments",
      iconStyle:
        "bg-blue-500/10 text-blue-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-violet-400 font-medium mb-2">
          Admin Panel
        </p>

        <h1 className="text-3xl md:text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Manage Fundora and monitor platform activity.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-violet-500/30"
            >
              {/* Icon */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconStyle}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              {/* Value */}
              <div className="mt-6">
                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {loading
                    ? "..."
                    : Number(
                        card.value
                      ).toLocaleString()}
                </h2>

                <p className="text-xs text-slate-500 mt-2">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}

      </div>

      {/* Coming sections */}
      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">
          Platform Overview
        </h2>

        <p className="text-slate-400 mt-2">
          Campaign approvals, withdrawal requests,
          user management, campaigns and reports will
          appear here as you build the remaining admin
          sections.
        </p>
      </div>

    </div>
  );
}