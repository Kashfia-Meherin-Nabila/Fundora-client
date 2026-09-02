
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import ArrowRight from "@gravity-ui/icons/ArrowRight";
import CircleDollar from "@gravity-ui/icons/CircleDollar";
import Rocket from "@gravity-ui/icons/Rocket";
import Hand from "@gravity-ui/icons/Hand";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    eyebrow: "TURN IDEAS INTO IMPACT",
    title: "Your idea deserves",
    highlight: "a chance to grow.",
    description:
      "Launch your campaign, connect with people who believe in your vision, and turn your ambitious idea into something real.",
    primaryButton: "Explore Campaigns",
    primaryLink: "/campaigns",
    secondaryButton: "Join Fundora",
    secondaryLink: "/register",
    image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aWRlYXxlbnwwfHwwfHx8MA%3D%3D",
    icon: Rocket,
  },
  {
    id: 2,
    eyebrow: "SUPPORT WHAT MATTERS",
    title: "Back ideas that",
    highlight: "can change lives.",
    description:
      "Discover meaningful projects from passionate creators and contribute credits to the campaigns you believe in.",
    primaryButton: "Explore Campaigns",
    primaryLink: "/campaigns",
    secondaryButton: "Join Fundora",
    secondaryLink: "/register",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D",
    icon: Hand,
  },
  {
    id: 3,
    eyebrow: "A COMMUNITY OF BELIEVERS",
    title: "Small contributions,",
    highlight: "big possibilities.",
    description:
      "Every contribution brings a creator one step closer to their goal. Together, we can help great ideas become reality.",
   primaryButton: "Explore Campaigns",
    primaryLink: "/campaigns",
    secondaryButton: "Join Fundora",
    secondaryLink: "/register",
    image: "https://images.unsplash.com/photo-1579227113447-f1e32cc6bd42?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNtYWxsJTIwY29udHJpYnV0aW9ufGVufDB8fDB8fHww",
    icon: CircleDollar,
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-125 w-125 rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="absolute -bottom-40 right-0 h-h-125 w-125 rounded-full bg-fuchsia-600/15 blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop
        speed={900}
        className="fundora-hero-swiper"
      >
        {slides.map((slide) => {
          const SlideIcon = slide.icon;

          return (
            <SwiperSlide key={slide.id}>
              <div className="relative min-h-162.5 overflow-hidden lg:min-h-180">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={slide.id === 1}
                    sizes="100vw"
                    className="object-cover object-center opacity-30"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950/30" />
                </div>

                {/* Content */}
                <div className="relative z-10 mx-auto flex min-h-162.5 max-w-7xl items-center px-5 py-20 sm:px-6 lg:min-h-180 lg:px-8">
                  <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Left Content */}
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: false,
                        amount: 0.3,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      className="max-w-3xl"
                    >
                      {/* Eyebrow */}
                      <motion.div
                        initial={{
                          opacity: 0,
                          x: -20,
                        }}
                        whileInView={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: 0.15,
                          duration: 0.6,
                        }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2"
                      >
                        <span className="h-2 w-2 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />

                        <span className="text-xs font-semibold tracking-[0.16em] text-violet-300">
                          {slide.eyebrow}
                        </span>
                      </motion.div>

                      {/* Heading */}
                      <motion.h1
                        initial={{
                          opacity: 0,
                          y: 25,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: 0.25,
                          duration: 0.7,
                        }}
                        className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl"
                      >
                        {slide.title}

                        <span className="mt-2 block bg-linear-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                          {slide.highlight}
                        </span>
                      </motion.h1>

                      {/* Description */}
                      <motion.p
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: 0.4,
                          duration: 0.7,
                        }}
                        className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8"
                      >
                        {slide.description}
                      </motion.p>

                      {/* Buttons */}
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: 0.55,
                          duration: 0.7,
                        }}
                        className="mt-9 flex flex-col gap-3 sm:flex-row"
                      >
                        <Link
                          href={slide.primaryLink}
                          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-900/30 transition-all duration-300 hover:-translate-y-1 hover:from-violet-500 hover:to-purple-500 hover:shadow-2xl hover:shadow-violet-900/40"
                        >
                          {slide.primaryButton}

                          <ArrowRight
                            width={17}
                            height={17}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>

                        <Link
                          href={slide.secondaryLink}
                          className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/10"
                        >
                          {slide.secondaryButton}
                        </Link>
                      </motion.div>

                      {/* Trust Stats */}
                      <motion.div
                        initial={{
                          opacity: 0,
                        }}
                        whileInView={{
                          opacity: 1,
                        }}
                        transition={{
                          delay: 0.7,
                          duration: 0.8,
                        }}
                        className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
                      >
                        <div>
                          <p className="text-xl font-bold text-white">
                            1,200+
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Ideas funded
                          </p>
                        </div>

                        <div className="h-8 w-px bg-white/10" />

                        <div>
                          <p className="text-xl font-bold text-white">
                            8K+
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Supporters
                          </p>
                        </div>

                        <div className="h-8 w-px bg-white/10" />

                        <div>
                          <p className="text-xl font-bold text-white">
                            95%
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Creator satisfaction
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Right Visual Card */}
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        x: 30,
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: 0.35,
                        duration: 0.9,
                        ease: "easeOut",
                      }}
                      className="hidden justify-center lg:flex"
                    >
                      <div className="relative">
                        {/* Glow */}
                        <div className="absolute inset-0 scale-90 rounded-[2rem] bg-violet-600/30 blur-3xl" />

                        {/* Card */}
                        <div className="relative w-90 overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
                          <div className="relative h-107.5 overflow-hidden rounded-[1.5rem]">
                            <Image
                              src={slide.image}
                              alt=""
                              fill
                              sizes="360px"
                              className="object-cover"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />

                            {/* Floating Icon */}
                            <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-md">
                              <SlideIcon width={22} height={22} />
                            </div>

                            {/* Card Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                              <div className="mb-3 inline-flex rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-200 backdrop-blur-md">
                                Featured on Fundora
                              </div>

                              <h3 className="text-2xl font-bold text-white">
                                Ideas worth believing in.
                              </h3>

                              <div className="mt-5">
                                <div className="mb-2 flex items-center justify-between text-xs">
                                  <span className="text-slate-300">
                                    Community support
                                  </span>

                                  <span className="font-semibold text-white">
                                    78%
                                  </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-white/15">
                                  <motion.div
                                    initial={{
                                      width: 0,
                                    }}
                                    whileInView={{
                                      width: "78%",
                                    }}
                                    transition={{
                                      delay: 0.8,
                                      duration: 1,
                                    }}
                                    className="h-full rounded-full bg-linear-to-r from-violet-500 to-fuchsia-400"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                          animate={{
                            y: [0, -10, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute -bottom-5 -left-8 rounded-2xl border border-white/10 bg-slate-900/90 px-5 py-4 shadow-2xl backdrop-blur-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                              <CircleDollar
                                width={20}
                                height={20}
                              />
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">
                                Community funded
                              </p>

                              <p className="text-sm font-bold text-white">
                                2.4M+ credits
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

    </section>
  );
}

