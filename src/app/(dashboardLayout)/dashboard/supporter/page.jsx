"use client";

import { useEffect, useState } from "react";
import {
  CircleDollar,
  Clock,
  ChartBar,
  CircleCheck,
} from "@gravity-ui/icons";
import { authClient } from "@/app/lib/auth-client";
import { getUserToken } from "@/lib/core/session";
import API_URL from "@/lib/core/url";



export default function SupporterHome() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const email = user?.email;

  const [stats, setStats] = useState({
    totalContributions: 0,
    totalPending: 0,
    totalAmountContributed: 0,
  });

  const [approvedContributions, setApprovedContributions] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending || !email) return;
        let ignore = false;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = await getUserToken();
        // console.log("TOKEN:", token);

        if (!token) {
          throw new Error("Missing auth token");
        }

        const response = await fetch(`${API_URL}/api/supporter/dashboard`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();

          console.error(
            "Supporter dashboard API error:",
            response.status,
            errorText
          );

          throw new Error(
            `Supporter dashboard API failed with status ${response.status}`
          );
        }

        const data = await response.json();
        if (ignore) return;

        setStats({
          totalContributions: Number(data.totalContributions || 0),
          totalPending: Number(data.totalPending || 0),
          totalAmountContributed: Number(
            data.totalAmountContributed || 0
          ),
        });

        setApprovedContributions(
          Array.isArray(data.approvedContributions)
            ? data.approvedContributions
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load supporter dashboard:",
          error
        );

        setStats({
          totalContributions: 0,
          totalPending: 0,
          totalAmountContributed: 0,
        });

        setApprovedContributions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [email, isPending]);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Supporter Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Track your contributions and support meaningful campaigns.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* Total Contributions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Total Contributions
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {loading ? "..." : stats.totalContributions}
              </h2>
            </div>

            <div className="rounded-xl bg-violet-500/10 p-3">
              <ChartBar
                width={26}
                height={26}
                className="text-violet-400"
              />
            </div>

          </div>
        </div>

        {/* Pending Contributions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Pending Contributions
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {loading ? "..." : stats.totalPending}
              </h2>
            </div>

            <div className="rounded-xl bg-yellow-500/10 p-3">
              <Clock
                width={26}
                height={26}
                className="text-yellow-400"
              />
            </div>

          </div>
        </div>

        {/* Total Amount */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Total Amount Contributed
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {loading
                  ? "..."
                  : `${stats.totalAmountContributed} credits`}
              </h2>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-3">
              <CircleDollar
                width={26}
                height={26}
                className="text-emerald-400"
              />
            </div>

          </div>
        </div>

      </div>

      {/* Approved Contributions */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

        <div className="border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">

            <CircleCheck
              width={22}
              height={22}
              className="text-emerald-400"
            />

            <div>
              <h2 className="text-xl font-semibold">
                Approved Contributions
              </h2>

              <p className="text-sm text-slate-400">
                Your successfully approved contributions
              </p>
            </div>

          </div>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-slate-400">
            Loading contributions...
          </div>
        ) : approvedContributions.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-400">
            No approved contributions yet.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-slate-800 bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-slate-400">
                    Campaign
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-slate-400">
                    Contribution
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-slate-400">
                    Creator
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {approvedContributions.map((contribution) => (
                  <tr
                    key={contribution._id}
                    className="border-b border-slate-800 last:border-0 hover:bg-slate-800/40"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">
                        {contribution.campaign_title}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-medium text-violet-400">
                      {Number(
                        contribution.Contribution_amount || 0
                      )}{" "}
                      credits
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {contribution.creator_name}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
                        <CircleCheck
                          width={15}
                          height={15}
                        />
                        Approved
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