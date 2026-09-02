
import Link from "next/link";

import LogoGithub from "@gravity-ui/icons/LogoGithub";
import LogoLinkedin from "@gravity-ui/icons/LogoLinkedin";
import LogoFacebook from "@gravity-ui/icons/LogoFacebook";
import Envelope from "@gravity-ui/icons/Envelope";
import ArrowUpRightFromSquare from "@gravity-ui/icons/ArrowUpRightFromSquare";

const platformLinks = [
  {
    name: "Explore Campaigns",
    href: "/campaigns",
  },
  {
    name: "How It Works",
    href: "/#how-it-works",
  },
  {
    name: "Categories",
    href: "/#categories",
  },
];

const accountLinks = [
  {
    name: "Login",
    href: "/login",
  },
  {
    name: "Register",
    href: "/register",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      {/* Decorative gradients */}
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-3xl" />

      {/* Top gradient border */}
      <div className="relative h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* ================= BRAND ================= */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-lg font-bold text-white shadow-lg shadow-violet-900/30 transition-transform duration-300 group-hover:scale-105">
                F
              </span>

              <span className="text-2xl font-bold tracking-tight">
                Fundora
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Fundora connects creators with supporters who believe
              in meaningful ideas. Discover projects, contribute
              credits, and help turn ambitious ideas into reality.
            </p>

            {/* Social Links */}
            <div className="mt-7 flex items-center gap-3">
              {/* GitHub */}
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-400"
              >
                <LogoGithub width={18} height={18} />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-400"
              >
                <LogoLinkedin width={18} height={18} />
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-400"
              >
                <LogoFacebook width={18} height={18} />
              </a>

              {/* Email */}
              <a
                href="mailto:hello@fundora.com"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-400"
              >
                <Envelope width={18} height={18} />
              </a>
            </div>
          </div>

          {/* ================= PLATFORM ================= */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </h3>

            <ul className="mt-5 space-y-4">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-violet-400"
                  >
                    {link.name}

                    <ArrowUpRightFromSquare
                      width={13}
                      height={13}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= ACCOUNT ================= */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Account
            </h3>

            <ul className="mt-5 space-y-4">
              {accountLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-violet-400"
                  >
                    {link.name}

                    <ArrowUpRightFromSquare
                      width={13}
                      height={13}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================= CTA ================= */}
        <div className="mt-14 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-fuchsia-600/10 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Have an idea worth funding?
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Turn your idea into a campaign and find people who
                believe in it.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Start Your Journey
            </Link>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="mt-8 flex flex-col gap-4 border-t border-slate-800 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Fundora. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="transition-colors hover:text-violet-400"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-violet-400"
            >
              Terms
            </Link>

            <span className="hidden h-4 w-px bg-slate-800 sm:block" />

            <span className="text-slate-600">
              Fund Ideas. Fuel Change.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

