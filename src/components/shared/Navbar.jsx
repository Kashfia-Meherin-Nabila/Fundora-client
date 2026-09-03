"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Bars from "@gravity-ui/icons/Bars";
import Xmark from "@gravity-ui/icons/Xmark";
import ArrowRightFromSquare from "@gravity-ui/icons/ArrowRightFromSquare";
import PersonPlus from "@gravity-ui/icons/PersonPlus";
import LayoutHeaderCells from "@gravity-ui/icons/LayoutHeaderCells";
import CircleDollar from "@gravity-ui/icons/CircleDollar";
import Person from "@gravity-ui/icons/Person";
import LogoGithub from "@gravity-ui/icons/LogoGithub";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { CrownDiamond } from "@gravity-ui/icons";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session;

  const user = {
    name: session?.user?.name || "Fundora User",
    image: session?.user?.image || "/avatar-placeholder.png",
    role: session?.user?.role || "Supporter",
    credits: 50,
  };

  const getDashboardRoute = () => {
    const roleLower = user.role?.toLowerCase();
    if (roleLower === "creator") return "/dashboard/creator";
    if (roleLower === "admin") return "/dashboard/admin";
    return "/dashboard/supporter";
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0612]/80 shadow-2xl backdrop-blur-xl">
      {/* Top accent gradient line */}
      <div className="h-0.5 bg-linear-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= LOGO (LEFT) ================= */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-3.5"
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 to-purple-800 shadow-lg shadow-violet-900/40 transition duration-300 group-hover:scale-105">
            <span className="text-xl font-black text-white tracking-wider">F</span>
            <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-fuchsia-400/30 blur-md" />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-violet-300 transition-colors">
              Fundora
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400">
              Fund Ideas. Fuel Change.
            </p>
          </div>
        </Link>

        {/* ================= MIDDLE NAV (Explore & Dashboard) ================= */}
        <nav className="hidden items-center gap-2 md:flex rounded-2xl border border-white/10 bg-white/3 p-1.5 backdrop-blur-md">
          <Link
            href="/campaigns"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <CrownDiamond width={16} height={16} className="text-violet-400"/>
            Explore Campaigns
          </Link>

          {isLoggedIn && (
            <Link
              href={getDashboardRoute()}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              <LayoutHeaderCells width={16} height={16} className="text-violet-400" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* ================= RIGHT SIDE (Credits, Name, Logout / Auth, Developer) ================= */}
        <div className="hidden items-center gap-2.5 md:flex">
          {isLoggedIn ? (
            <>
              {/* Credits Badge */}
              <div className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-950/40 px-3 py-1.5 shadow-inner">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600 text-white shadow-md shadow-violet-600/30">
                  <CircleDollar width={14} height={14} />
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-violet-400 leading-none">
                    Credits
                  </p>
                  <p className="text-xs font-black text-white leading-tight">
                    {user.credits}
                  </p>
                </div>
              </div>

              {/* User Name & Avatar */}
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-1 pl-2 pr-3 backdrop-blur-md">
                <Image
                  src={user.image}
                  alt={user.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-lg object-cover ring-1 ring-violet-500/40"
                />
                <span className="max-w-22.5 truncate text-xs font-medium text-gray-200">
                  {user.name}
                </span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                aria-label="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-all hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
              >
                <ArrowRightFromSquare width={16} height={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
              >
                <ArrowRightFromSquare width={16} height={16} className="text-violet-400" />
                Login
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-600/50"
              >
                <PersonPlus width={16} height={16} />
                Register
              </Link>
            </>
          )}

          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-950/20 px-4 py-2.5 text-sm font-semibold text-violet-300 transition-all duration-200 hover:border-violet-400 hover:bg-violet-900/40 hover:text-white"
          >
            <LogoGithub width={16} height={16} />
            Join as Developer
          </a>
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-violet-300 transition-all hover:bg-white/10 md:hidden"
        >
          {isMenuOpen ? <Xmark width={20} height={20} /> : <Bars width={20} height={20} />}
        </button>
      </div>

      {/* ================= MOBILE NAV DROPDOWN ================= */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#0a0612]/95 backdrop-blur-2xl md:hidden shadow-2xl">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6">
            <Link
              href="/campaigns"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              Explore Campaigns
            </Link>

            {isLoggedIn ? (
              <>
                <div className="flex items-center justify-between rounded-xl border border-violet-500/20 bg-violet-950/40 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
                      <CircleDollar width={16} height={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      Available Credits
                    </span>
                  </div>
                  <span className="font-bold text-violet-400">
                    {user.credits}
                  </span>
                </div>

                <Link
                  href={getDashboardRoute()}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  <LayoutHeaderCells width={18} height={18} className="text-violet-400" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={38}
                    height={38}
                    className="h-10 w-10 rounded-xl object-cover ring-1 ring-violet-500/40"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-violet-400">Fundora Member</p>
                  </div>
                  <Person width={18} height={18} className="text-violet-400" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                >
                  <ArrowRightFromSquare width={18} height={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  <ArrowRightFromSquare width={18} height={18} className="text-violet-400" />
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30"
                >
                  <PersonPlus width={18} height={18} />
                  Register
                </Link>
              </>
            )}

            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-950/30 px-4 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-900/40 hover:text-white"
            >
              <LogoGithub width={18} height={18} />
              Join as Developer
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}