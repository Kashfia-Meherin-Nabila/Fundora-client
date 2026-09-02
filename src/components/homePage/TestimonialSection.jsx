"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {CircleQuestionFill, StarFill } from "@gravity-ui/icons";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "Ayesha Rahman",
    role: "Creator",
    image: "https://i.pravatar.cc/150?img=47",
    quote:
      "Fundora helped me turn an idea I had been working on for years into a real community project.",
  },
  {
    id: 2,
    name: "Tanvir Hasan",
    role: "Supporter",
    image: "https://i.pravatar.cc/150?img=12",
    quote:
      "I love how simple it is to discover meaningful campaigns and support ideas that actually matter.",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Creator",
    image: "https://i.pravatar.cc/150?img=32",
    quote:
      "The community support gave our project the confidence and resources needed to move forward.",
  },
  {
    id: 4,
    name: "Rakib Ahmed",
    role: "Supporter",
    image: "https://i.pravatar.cc/150?img=11",
    quote:
      "Fundora makes crowdfunding feel personal. I can easily follow projects and see the impact of my support.",
  },
];

export default function TestimonialSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-violet-300">
            <CircleQuestionFill width={15} height={15} />
            Community voices
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Real people.
            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Real impact.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
            Thousands of creators and supporters are using Fundora to turn
            meaningful ideas into something bigger.
          </p>
        </motion.div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
          }}
          className="testimonial-swiper !pb-14"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="h-full"
              >
                <div className="group relative h-full min-h-[300px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.06] sm:p-8">
                  {/* Quote icon */}
                  <div className="absolute right-7 top-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                    <CircleQuestionFill width={23} height={23} />
                  </div>

                  {/* Stars */}
                  <div className="mb-7 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarFill
                        key={star}
                        width={16}
                        height={16}
                        className="fill-violet-400 text-violet-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="max-w-xl text-base leading-8 text-slate-300">
                    {testimonial.quote}
                  </p>

                  {/* User */}
                  <div className="mt-8 flex items-center gap-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={52}
                      height={52}
                      className="h-13 w-13 rounded-full border-2 border-violet-500/30 object-cover"
                    />

                    <div>
                      <h3 className="font-semibold text-white">
                        {testimonial.name}
                      </h3>

                      <p className="mt-1 text-sm text-violet-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Bottom glow */}
                  <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl transition group-hover:bg-violet-600/20" />
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}