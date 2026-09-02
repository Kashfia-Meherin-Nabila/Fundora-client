"use client";

import { motion } from "framer-motion";
import {
  Magnifier,
  Hand,
  Rocket,
} from "@gravity-ui/icons";

const steps = [
  {
    number: "01",
    icon: Magnifier,
    title: "Discover an idea",
    description:
      "Explore campaigns created by people who are building something meaningful for their communities.",
  },
  {
    number: "02",
    icon: Hand,
    title: "Make an impact",
    description:
      "Use your Fundora credits to support campaigns that match your interests and values.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Watch it grow",
    description:
      "Follow the journey, receive updates, and see how your contribution helps bring an idea to life.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-violet-400">
            Simple by design
          </p>

          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            How Fundora
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {" "}works
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
            From finding an inspiring campaign to making a contribution,
            everything is designed to keep the process simple.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                className="group relative"
              >
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-8 transition duration-300 hover:-translate-y-2 hover:border-violet-500/30">
                  {/* Number */}
                  <span className="absolute right-6 top-5 text-5xl font-black text-white/[0.04]">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-violet-400 ring-1 ring-violet-500/20 transition group-hover:scale-110">
                    <Icon width={26} height={26} />
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>

                  <div className="mt-7 h-1 w-12 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 group-hover:w-20" />
                </div>

                {/* Connector */}
                {index !== steps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden w-6 translate-x-full border-t border-dashed border-violet-500/30 md:block" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}