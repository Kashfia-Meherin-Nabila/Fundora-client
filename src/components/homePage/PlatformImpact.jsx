"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  Persons,
  CircleDollar,
  ChartLine,
} from "@gravity-ui/icons";

const stats = [
  {
    icon: Rocket,
    value: "1,200+",
    label: "Ideas launched",
  },
  {
    icon: Persons,
    value: "8K+",
    label: "Community supporters",
  },
  {
    icon: CircleDollar,
    value: "2.4M+",
    label: "Credits contributed",
  },
  {
    icon: ChartLine,
    value: "95%",
    label: "Creator satisfaction",
  },
];

export default function PlatformImpact() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24">
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-violet-950/60 via-slate-950 to-fuchsia-950/40"
        >
          <div className="px-6 py-14 sm:px-10 lg:px-16 lg:py-16">
            {/* Heading */}
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-violet-400">
                The Fundora impact
              </p>

              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Small contributions.
                <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Big possibilities.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                Every credit represents someone believing that an idea is
                worth bringing to life.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                    className="text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-violet-400 ring-1 ring-white/10">
                      <Icon width={22} height={22} />
                    </div>

                    <p className="mt-5 text-3xl font-black text-white">
                      {stat.value}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}