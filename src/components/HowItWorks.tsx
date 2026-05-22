"use client";

import { motion } from "framer-motion";
import { Database, Brain, MessageSquare } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect your database",
    body: "Securely connect using your database URI and credentials.",
    icon: Database,
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    number: "02",
    title: "Tambo understands schema",
    body: "Tables, relationships, and structures are processed automatically.",
    icon: Brain,
    iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    number: "03",
    title: "Start asking questions",
    body: "Generate live analysis, charts, and insights instantly through conversation.",
    icon: MessageSquare,
    iconColor: "text-orange-600 bg-orange-50 border-orange-100",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-zinc-50/30 border-t border-zinc-100 overflow-visible">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
            Start exploring your data in minutes.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-500 font-medium">
            No dashboard setup. No reporting pipelines. No complex onboarding.
          </p>
        </motion.div>


        {/* 3-Column Grid Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-y-16 gap-x-8 sm:grid-cols-1 md:grid-cols-3"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={cardVariants}
                className="relative bg-white border border-gray-200/80 rounded-2xl px-6 pt-14 pb-10 md:px-8 md:pt-16 md:pb-12 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-gray-300/80 transition-all duration-300 group"
              >
                {/* Floating center icon at the top border */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className={`w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${step.iconColor}`}>
                      <Icon className="h-6 w-6 stroke-[2.2]" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div>
                  <span className="block text-xs font-mono font-bold text-gray-400 mb-2">
                    STEP {step.number}
                  </span>
                  <h3 className="text-xl font-bold text-gray-950 leading-snug mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

