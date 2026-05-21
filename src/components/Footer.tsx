"use client";

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 14
    }
  }
};

const statements = [
  { id: "01", text: "Built because dashboards became homework.", highlight: false },
  { id: "02", text: "Analytics software peaked before AI existed.", highlight: false },
  { id: "03", text: "Your database is smarter than your dashboard.", highlight: false },
  { id: "04", text: "The future of analytics won’t have dashboards.", highlight: true }
];

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-16 lg:py-24 border-t border-gray-150 select-none relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Animated Four hard lines / beliefs list in clean typographic layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16"
        >
          {statements.map((stmt) => (
            <motion.div 
              key={stmt.id} 
              variants={itemVariants}
              className="space-y-3"
            >
              <span className="font-mono text-xs sm:text-sm uppercase font-extrabold text-[#059669] tracking-widest block">
                [ STATEMENT {stmt.id} ]
              </span>
              <p className={`font-sans font-extrabold text-lg sm:text-xl md:text-2xl leading-snug tracking-tight ${
                stmt.highlight ? 'text-[#059669]' : 'text-gray-950'
              }`}>
                {stmt.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Giant Footer visual watermark block: The ultimate hard line */}
        <div className="mt-8 pt-12 border-t border-gray-150 text-center">
          <span className="font-sans font-extrabold text-[28px] sm:text-[44px] md:text-[54px] text-gray-100 tracking-tighter leading-none select-none block uppercase">
            THE FUTURE OF ANALYTICS WON'T HAVE DASHBOARDS.
          </span>
        </div>

        {/* Base line */}
        <div className="mt-12 pt-6 border-t border-gray-150 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-500 gap-4 font-mono font-medium">
          <span>&copy; {new Date().getFullYear()} tambo Inc. All queries synthesized securely.</span>
          <div className="flex gap-4">
            <span className="font-semibold text-gray-750">SOC2 Audited</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
