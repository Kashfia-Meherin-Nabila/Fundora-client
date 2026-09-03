
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleDollar,
  House,
  Compass,
  Heart,
  CreditCard,
  Wallet,
  Person,
  FileText,
  ChartBar,
  Plus,
  Folder,
  Bell,
} from "@gravity-ui/icons";
import { authClient } from "@/app/lib/auth-client";

// import { authClient } from "@/app/lib/auth-client";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

   const user = session?.user;

  const name = user?.name || "User";
  const image = user?.image || "";
  const role = user?.role || "Supporter";
//   const credits = user?.credits ?? 0;



  // Read actual credits from database/session
  const credits =
    typeof user?.credits === "number"
      ? user.credits
      : 0;

  console.log("SESSION:", session);
  console.log("USER:", user);
  console.log("NAME:", name);
  console.log("ROLE:", role);
  console.log("CREDITS:", credits);

  const supporterNavigation = [
    {
      name: "Home",
      href: "/dashboard/supporter",
      icon: House,
    },
    {
      name: "Explore Campaigns",
      href: "/dashboard/supporter/explore-campaigns",
      icon: Compass,
    },
    {
      name: "My Contributions",
      href: "/dashboard/supporter/my-contributions",
      icon: Heart,
    },
    {
      name: "Purchase Credit",
      href: "/dashboard/supporter/purchase-credit",
      icon: CreditCard,
    },
    {
      name: "Payment History",
      href: "/dashboard/supporter/payment-history",
      icon: Wallet,
    },
  ];

  const creatorNavigation = [
    {
      name: "Home",
      href: "/dashboard/creator",
      icon: House,
    },
    {
      name: "Add New Campaign",
      href: "/dashboard/creator/add-campaign",
      icon: Plus,
    },
    {
      name: "My Campaigns",
      href: "/dashboard/creator/my-campaigns",
      icon: Folder,
    },
    {
      name: "Withdrawals",
      href: "/dashboard/creator/withdrawals",
      icon: Wallet,
    },
    {
      name: "Payment History",
      href: "/dashboard/creator/payment-history",
      icon: CreditCard,
    },
  ];

  const adminNavigation = [
    {
      name: "Home",
      href: "/dashboard/admin",
      icon: House,
    },
    {
      name: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Person,
    },
    {
      name: "Manage Campaigns",
      href: "/dashboard/admin/campaigns",
      icon: Folder,
    },
    {
      name: "Withdrawal Requests",
      href: "/dashboard/admin/withdrawals",
      icon: Wallet,
    },
    {
      name: "Reports",
      href: "/dashboard/admin/reports",
      icon: ChartBar,
    },
  ];

  let navigation = supporterNavigation;

  if (role === "Creator") {
    navigation = creatorNavigation;
  }

  if (role === "Admin") {
    navigation = adminNavigation;
  }

  if (isPending) {
    return (
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-slate-950">
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading...
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-slate-950">

      {/* Logo */}
      <div className="border-b border-white/10 p-6">
        <Link
          href={"/"
            // role === "Creator"
            //   ? "/dashboard/creator"
            //   : role === "Admin"
            //   ? "/dashboard/admin"
            //   : "/dashboard/supporter"
          }
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600">
            <CircleDollar
              width={22}
              height={22}
              className="text-white"
            />
          </div>

          <span className="text-xl font-bold text-white">
            Fundora
          </span>
        </Link>
      </div>

      {/* User Information */}
      <div className="border-b border-white/10 p-5">

        <div className="flex items-center gap-3">

          {/* User Image */}
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-violet-500/40 bg-slate-800">

            {image ? (
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}

          </div>

          {/* Name + Role */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {name}
            </p>

            <p className="text-xs text-slate-500">
              {role}
            </p>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-slate-900 px-4 py-3">

          <div className="flex items-center gap-2">
            <CircleDollar
              width={17}
              height={17}
              className="text-violet-400"
            />

            <span className="text-xs text-slate-400">
              Available Credits
            </span>
          </div>

          <span className="font-bold text-white">
            {credits}
          </span>
        </div>
      </div>

      {/* Notification */}
      <div className="px-4 pt-5">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <Bell
            width={18}
            height={18}
          />

          Notifications

          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
            0
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
          Navigation
        </p>

        <div className="space-y-1">

          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-violet-600/15 text-violet-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  width={18}
                  height={18}
                />

                <span>{item.name}</span>
              </Link>
            );
          })}

        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-5">

        <p className="text-center text-xs text-slate-600">
          © 2026 Fundora
        </p>

        <p className="mt-1 text-center text-[10px] text-slate-700">
          Turn ideas into impact.
        </p>

      </div>

    </aside>
  );
}

