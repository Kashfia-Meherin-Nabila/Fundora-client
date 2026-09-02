"use client";

import { motion } from "framer-motion";
import {
  Code,
  Palette,
  HeartPulse,
  House,
  BookOpen,
  Globe,
} from "@gravity-ui/icons";

const categories = [
  {
    icon: Code,
    title: "Technology",
    description: "Build tools, apps and innovative solutions.",
    count: "240+ campaigns",
  },
  {
    icon: Palette,
    title: "Art & Creativity",
    description: "Support artists, designers and creative projects.",
    count: "180+ campaigns",
  },
  {
    icon: HeartPulse,
    title: "Health",
    description: "Help create healthier and stronger communities.",
    count: "120+ campaigns",
  },
  {
    icon: House,
    title: "Community",
    description: "Support projects that improve everyday lives.",
    count: "210+ campaigns",
  },
  {
    icon: BookOpen,
    title: "Education",
    description: "Help make learning opportunities more accessible.",
    count: "150+ campaigns",
  },
  {
    icon: Globe,
    title: "Environment",
    description: "Back ideas that protect our shared planet.",
    count: "95+ campaigns",
  },
];

export default function ExploreCategories() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-violet-400">
              Find your cause
            </p>

            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Explore ideas by
              <span className="block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                category.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-400">
            Whether you're passionate about technology, education, creativity,
            or community, there's an idea waiting for your support.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-slate-900">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 transition group-hover:bg-violet-500/20">
                      <Icon width={23} height={23} />
                    </div>

                    <span className="text-xs font-medium text-slate-500">
                      {category.count}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-white">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {category.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-violet-400">
                    Explore campaigns
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-violet-600/10 blur-3xl transition group-hover:bg-violet-600/20" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}