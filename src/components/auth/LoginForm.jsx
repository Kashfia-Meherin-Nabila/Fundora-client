
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CircleDollar,
  Eye,
  EyeSlash,
  
  Lock,
  
  Sparkles,
} from "@gravity-ui/icons";
import { authClient } from "@/app/lib/auth-client";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Authentication will be connected later
    console.log("Login submitted");
  };

  const handleGoogleLogin = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  } catch (error) {
    console.error("Google login failed:", error);
  }
};

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl lg:grid-cols-2">

        {/* Left Side */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700 p-10 lg:flex lg:flex-col lg:justify-between">

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl" />

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
              <CircleDollar
                width={25}
                height={25}
                className="text-white"
              />
            </div>

            <span className="text-2xl font-bold tracking-tight text-white">
              Fundora
            </span>
          </Link>

          {/* Content */}
          <div className="relative z-10 max-w-md">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
              <Sparkles width={17} height={17} />
              Welcome back
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Great ideas deserve
              <span className="mt-2 block text-violet-200">
                a chance to grow.
              </span>
            </h1>

            <p className="mt-6 leading-7 text-violet-100/80">
              Support meaningful projects, discover inspiring ideas, and help
              creators turn their dreams into reality with Fundora.
            </p>

            <div className="mt-10 flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold text-white">1,200+</p>
                <p className="mt-1 text-sm text-violet-200/70">
                  Ideas funded
                </p>
              </div>

              <div className="h-10 w-px bg-white/20" />

              <div>
                <p className="text-2xl font-bold text-white">8K+</p>
                <p className="mt-1 text-sm text-violet-200/70">
                  Supporters
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-sm text-violet-200/60">
            © 2026 Fundora. Turn ideas into impact.
          </p>
        </div>

        {/* Right Side */}
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
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-violet-400">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Sign in to Fundora
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Continue supporting ideas and managing your campaigns.
              </p>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-violet-500/50 hover:bg-white/10"
            >
              {/* <LogoGoogle width={19} height={19} /> */}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-500">
                OR CONTINUE WITH EMAIL
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

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

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-violet-400 transition hover:text-violet-300"
                  >
                    Forgot password?
                  </button>
                </div>

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
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeSlash width={18} height={18} />
                    ) : (
                      <Eye width={18} height={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-purple-500"
              >
                Sign in
                <ArrowRight
                  width={18}
                  height={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-violet-400 transition hover:text-violet-300"
              >
                Create an account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}

