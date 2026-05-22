import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function ComparisonSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#F9FAF9] border-t border-gray-150">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tighter text-gray-950">
            Analytics became unnecessarily complicated.
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-semibold leading-relaxed max-w-2xl mx-auto">
            Modern analytics workflows are buried under dashboards, SQL queries, filters, exports, and reporting tools. Tambo removes the complexity completely.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto"
        >

          {/* LEFT CARD — OLD WORKFLOW (Traditional Analytics) */}
          <motion.div
            animate={{
              x: [-1, 1, -1.5, 1.5, 0],
              y: [0, 1, -1, 0.5, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "linear",
              repeatType: "mirror"
            }}
            className="relative p-6 sm:p-8 flex flex-col justify-between border-2 border-gray-300 bg-gray-50 overflow-hidden opacity-80 rounded-2xl shadow-sm"
          >
            {/* SVG Noise Filter overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.2] pointer-events-none mix-blend-overlay">
              <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            <div className="relative z-10 space-y-4 blur-[0.5px]">
              <h3 className="font-sans font-extrabold text-2xl text-gray-700">Traditional Analytics</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                Slow, fragmented, and maintenance-heavy.
              </p>

              <div className="pt-2 flex items-baseline gap-1.5 text-gray-400">
                <span className="text-4xl font-display font-extrabold text-gray-400">
                  $99
                </span>
                <span className="text-sm font-semibold text-gray-500">/ month</span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6 pt-5 flex-1 relative z-10 blur-[0.5px]">
              <ul className="space-y-3 text-sm font-semibold text-gray-400 grayscale">
                {[
                  "Writing SQL queries",
                  "Building dashboards",
                  "Managing filters",
                  "Waiting on analysts",
                  "Exporting CSVs",
                  "Rebuilding reports",
                  "Learning BI tools",
                  "Context switching constantly"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 mt-2 text-xs font-mono font-bold uppercase tracking-wider text-gray-400 blur-[0.5px]">
              Analytics became interface management.
            </div>
          </motion.div>

          {/* RIGHT CARD — TAMBO */}
          <div className="rounded-2xl border-2 border-emerald-500 bg-white p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10">

            <div className="space-y-4">
              <h3 className="font-sans font-extrabold text-2xl text-gray-900">Tambo Early Access</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-semibold">
                Ask questions, get visual answers instantly.
              </p>

              <div className="pt-2 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-display font-black text-emerald-600">
                  $0
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 my-6 pt-5 flex-1">
              <ul className="space-y-3 text-sm font-bold text-gray-800">
                {[
                  "Conversational exploration",
                  "Live visual analysis",
                  "Context-aware sessions",
                  "Instant charts",
                  "Direct database connection",
                  "Unlimited during beta"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-sm font-bold text-emerald-600">
              Free while we build the future of analytics.
            </div>
          </div>

        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex items-center justify-center mt-16"
        >
          <span className="font-sans font-extrabold text-gray-950 text-sm sm:text-base text-gray-500 font-semibold leading-relaxed max-w-2xl mx-auto">
            No dashboards. No SQL. No friction.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
