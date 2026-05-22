"use client";

import { motion } from "framer-motion";
import { ArrowRight, Database } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#F9FAF9] py-20 lg:py-28 border-t border-gray-150 select-none">
      {/* Background soft ambient glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center justify-center"
        >

          {/* Title - styled similarly to Hero/Comparison headings */}
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-950 max-w-4xl leading-[1.08] mb-6">
            Stop building dashboards for <br className="hidden sm:inline" /> questions that change every day.
          </h2>

          {/* Subtitle - styled similarly to other sections */}
          <p className="text-sm sm:text-base md:text-lg text-gray-500 font-semibold leading-relaxed max-w-2xl mb-10">
            Experience real-time conversational intelligence directly connected to your database. Fully secure, instant insights.
          </p>

          {/* Brand-consistent CTA Button */}
          <motion.a
            href="/chat"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Connect Database
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

