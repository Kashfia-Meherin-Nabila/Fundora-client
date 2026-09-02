
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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Temporary authentication state.
  // We will connect this with the real authentication system later.
  const isLoggedIn = false;

  // Temporary user data.
  const user = {
    name: "Fundora User",
    image: "/avatar-placeholder.png",
    credits: 50,
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 shadow-sm backdrop-blur-xl">
      {/* Top gradient line */}
      <div className="h-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* ================= LOGO ================= */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg shadow-violet-200 transition duration-300 group-hover:scale-105">
            <span className="text-lg font-bold text-white">F</span>

            <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-fuchsia-400/40 blur-md" />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight text-gray-950">
              Fundora
            </h1>

            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-violet-600">
              Fund Ideas. Fuel Change.
            </p>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden items-center gap-2 md:flex">
          {/* Explore */}
          <Link
            href="/campaigns"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700"
          >
            Explore Campaigns
          </Link>

          {isLoggedIn ? (
            <>
              {/* Credits */}
              <div className="mx-1 flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-3.5 py-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
                  <CircleDollar width={16} height={16} />
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-violet-500">
                    Credits
                  </p>

                  <p className="text-sm font-bold text-violet-900">
                    {user.credits}
                  </p>
                </div>
              </div>

              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700"
              >
                <LayoutHeaderCells width={17} height={17} />
                Dashboard
              </Link>

              {/* User */}
              <div className="ml-1 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 py-1.5 pl-2 pr-2">
                <Image
                  src={user.image}
                  alt={user.name}
                  width={34}
                  height={34}
                  className="h-8.5 w-8.5 rounded-lg object-cover"
                />

                <span className="max-w-24 truncate px-1 text-sm font-semibold text-gray-800">
                  {user.name}
                </span>

                <button
                  type="button"
                  title="Logout"
                  aria-label="Logout"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
                >
                  <ArrowRightFromSquare width={17} height={17} />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700"
              >
                <ArrowRightFromSquare width={17} height={17} />
                Login
              </Link>

              {/* Register */}
              <Link
                href="/register"
                className="ml-1 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-700 hover:to-purple-700 hover:shadow-lg hover:shadow-violet-200"
              >
                <PersonPlus width={17} height={17} />
                Register
              </Link>
            </>
          )}

          {/* Developer */}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50"
          >
            <LogoGithub width={17} height={17} />
            Join as Developer
          </a>
        </nav>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-700 transition-all hover:bg-violet-100 md:hidden"
        >
          {isMenuOpen ? (
            <Xmark width={20} height={20} />
          ) : (
            <Bars width={20} height={20} />
          )}
        </button>
      </div>

      {/* ================= MOBILE NAV ================= */}
      {isMenuOpen && (
        <div className="border-t border-violet-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 sm:px-6">
            {/* Explore */}
            <Link
              href="/campaigns"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-700"
            >
              Explore Campaigns
            </Link>

            {isLoggedIn ? (
              <>
                {/* Credits */}
                <div className="flex items-center justify-between rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
                      <CircleDollar width={18} height={18} />
                    </div>

                    <span className="text-sm font-medium text-gray-700">
                      Available Credits
                    </span>
                  </div>

                  <span className="font-bold text-violet-700">
                    {user.credits}
                  </span>
                </div>

                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-700"
                >
                  <LayoutHeaderCells width={18} height={18} />
                  Dashboard
                </Link>

                {/* Profile */}
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>

                    <p className="text-xs text-violet-600">
                      Fundora member
                    </p>
                  </div>

                  <Person
                    width={18}
                    height={18}
                    className="text-violet-500"
                  />
                </div>

                {/* Logout */}
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <ArrowRightFromSquare width={18} height={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-700"
                >
                  <ArrowRightFromSquare width={18} height={18} />
                  Login
                </Link>

                {/* Register */}
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200"
                >
                  <PersonPlus width={18} height={18} />
                  Register
                </Link>
              </>
            )}

            {/* Developer */}
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
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

