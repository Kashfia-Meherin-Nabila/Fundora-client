
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CircleDollar,
  Eye,
  EyeSlash,  
  Lock,  
  Person,
  Picture,
  Sparkles,
} from "@gravity-ui/icons";
import { authClient } from "@/app/lib/auth-client";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Supporter");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Registration will be connected to backend later
    console.log("Register submitted");
  };

  const handleGoogleRegister = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  } catch (error) {
    console.error("Google registration failed:", error);
  }
};

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl lg:grid-cols-2">

        {/* Left */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700 p-10 lg:flex lg:flex-col lg:justify-between">

          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" />

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
              <CircleDollar
                width={25}
                height={25}
                className="text-white"
              />
            </div>

            <span className="text-2xl font-bold text-white">
              Fundora
            </span>
          </Link>

          {/* Content */}
          <div className="relative z-10 max-w-md">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
              <Sparkles width={17} height={17} />
              Join the community
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Your idea could be
              <span className="mt-2 block text-violet-200">
                someone's inspiration.
              </span>
            </h1>

            <p className="mt-6 leading-7 text-violet-100/80">
              Create your Fundora account and become part of a community that
              believes in people, projects, and possibilities.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Support projects you believe in",
                "Launch your own campaign",
                "Connect with a community of believers",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-violet-100"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                    <span className="h-2 w-2 rounded-full bg-violet-200" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-sm text-violet-200/60">
            © 2026 Fundora. Turn ideas into impact.
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center justify-center bg-slate-900 px-5 py-10 sm:px-10 lg:px-14">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-10 flex items-center justify-center gap-3 lg:hidden"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600">
                <CircleDollar
                  width={25}
                  height={25}
                  className="text-white"
                />
              </div>

              <span className="text-2xl font-bold text-white">
                Fundora
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-violet-400">
                Get started
              </p>

              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Join Fundora and start supporting ideas that matter.
              </p>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-violet-500/50 hover:bg-white/10"
            >
              {/* <LogoGoogle width={19} height={19} /> */}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs text-slate-500">
                OR REGISTER WITH EMAIL
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Full name
                </label>

                <div className="relative">
                  <Person
                    width={18}
                    height={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email address
                </label>

                <div className="relative">
                  {/* <Mail
                    width={18}
                    height={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  /> */}

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              {/* Profile Picture */}
              <div>
                <label
                  htmlFor="photo"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Profile picture URL
                </label>

                <div className="relative">
                  <Picture
                    width={18}
                    height={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="photo"
                    name="photo"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Account type
                </label>

                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="Supporter">Supporter</option>
                  <option value="Creator">Creator</option>
                </select>

                <p className="mt-2 text-xs text-slate-500">
                  {role === "Supporter"
                    ? "You'll receive 50 credits after registration."
                    : "You'll receive 20 credits after registration."}
                </p>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    width={18}
                    height={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeSlash width={18} height={18} />
                    ) : (
                      <Eye width={18} height={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Use at least 6 characters with a mix of letters and numbers.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-purple-500"
              >
                Create account
                <ArrowRight
                  width={18}
                  height={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-violet-400 transition hover:text-violet-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

