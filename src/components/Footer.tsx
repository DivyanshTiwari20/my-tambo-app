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
  { id: "04", text: "The future of analytics won’t have dashboards.", highlight: true }
];

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-16 lg:py-20 border-t border-gray-150 select-none relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


        {/* Giant Footer visual watermark block: The ultimate hard line */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-0 text-center"
        >
          <span className="font-sans font-extrabold text-[28px] sm:text-[44px] md:text-[54px] text-gray-100 tracking-tighter leading-none select-none block uppercase">
            THE FUTURE OF ANALYTICS WON'T HAVE DASHBOARDS.
          </span>
        </motion.div>



      </div>
    </footer>
  );
}
