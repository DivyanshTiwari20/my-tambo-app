"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 select-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-xl font-extrabold tracking-tighter text-gray-900">
            tambo<span className="text-emerald-500">.</span>
          </span>
        </div>

        {/* Action CTA only */}
        <div>
          <motion.a
            href="/chat"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
          >
            Start Free
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </div>
      </div>
    </header>
  );
}
