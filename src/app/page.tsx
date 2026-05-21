import Header from '@/components/Header';
import HeroSandbox from '@/components/HeroSandbox';
import Footer from '@/components/Footer';
import { 
  ArrowRight, Database, Terminal, Check, Users, MessageSquare, 
  TrendingUp, BarChart, Zap, ShieldAlert, Sparkles, X, Filter, RefreshCw
} from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-gray-950 overflow-x-hidden antialiased font-sans select-none">
      
      {/* HEADER SECTION */}
      <Header />

      {/* HERO SECTION with the highly interactive Screenshot 1 Dashboard emulator */}
      <HeroSandbox />

      {/* COMPRESSED VALUE & SHIFT SECTION — Replaces 6 generic sections to look short, dense, and meaningful */}
      <section className="py-24 bg-[#F9FAF9] border-b border-gray-150">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <span className="font-mono text-xs uppercase font-extrabold tracking-widest text-[#059669] bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-md inline-block">
              THE ACCESS REVOLUTION
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tighter text-gray-950 leading-tight">
              Tambo replaces the entire dashboard stack.
            </h2>
            <p className="text-sm sm:text-base text-gray-650 leading-relaxed font-sans max-w-2xl mx-auto">
              For decades, business teams have spent thousands of dollars hiring data analysts and learning complex BI query systems just to get everyday answers. Tambo completely simplifies this loop.
            </p>
          </div>

          {/* High-density grid comparison layout - "Old Way" vs "Tambo Way" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* The Old Way: Crossed Out and Muted */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 opacity-75 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-red-50 text-red-500 rounded-bl-xl font-mono text-xs font-bold border-l border-b border-red-100 uppercase tracking-wider">
                Outdated Stack
              </div>

              <div className="space-y-1.5 text-left border-b border-gray-100 pb-4">
                <h3 className="text-lg font-extrabold text-gray-950 leading-tight">Traditional Analytics Graveyards</h3>
                <p className="text-sm text-gray-500">Dashboards built for analysts, not human decisions.</p>
              </div>

              <ul className="space-y-5 text-sm font-semibold text-gray-500">
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="line-through text-gray-800 font-bold">Complex BI dashboards & reports</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">Opening 40 charts and complex filters that load slowly and get ignored.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="line-through text-gray-800 font-bold">Hiring expensive analytics teams</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">Putting questions into queues and waiting days for static SQL results.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="line-through text-gray-800 font-bold">Struggling to write custom SQL strings</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">Typos and syntax queries cause error warnings instead of business growth insights.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="line-through text-gray-800 font-bold">Offline reports out of sync</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">Reading old figures and static CSV uploads that do not reflect production.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* The Tambo Way: Active Highlighted Emerald */}
            <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl shadow-emerald-50/50">
              <div className="absolute top-0 right-0 p-3 bg-emerald-500 text-white font-mono text-xs font-extrabold uppercase tracking-wider">
                ⚡ TAMBO WAY
              </div>

              <div className="space-y-1.5 text-left border-b border-gray-100 pb-4">
                <h3 className="text-xl font-extrabold text-gray-950 leading-tight">Conversational Database Clarity</h3>
                <p className="text-sm text-[#059669] font-extrabold">Your dataset can already answer you. Tambo lets it speak.</p>
              </div>

              <ul className="space-y-5 text-sm font-semibold text-gray-800">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <div>
                    <p className="text-gray-955 font-extrabold text-base">Conversational execution</p>
                    <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">Simply ask questions in normal wording. Tambo auto-extracts fields and tables.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <div>
                    <p className="text-gray-955 font-extrabold text-base">Instant visual reporting cards</p>
                    <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">Get beautiful cohort bars, line paths, and summaries in 0.04s.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <div>
                    <p className="text-gray-955 font-extrabold text-base">No learning curve</p>
                    <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">If your staff can write a text message, they can query your entire data warehouse.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <div>
                    <p className="text-gray-955 font-extrabold text-base">Linked directly to Supabase / Postgres</p>
                    <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">Read-only live connection. Always exact, zero latency caching issues.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* HIGH-DENSITY GRID OF CAPABILITIES — Combines values in small scannable blocks */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-1 space-y-2 border-l-2 border-emerald-500 pl-4">
              <span className="font-mono text-xs font-bold text-emerald-600 block uppercase tracking-wider">// RECENT INSIGHT 01</span>
              <h3 className="font-sans font-extrabold text-gray-950 text-base">Zero Caching Latency</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-semibold">
                Tambo executes query synthesis directly against your reader schema. Your data is never centralized, copied, or stored.
              </p>
            </div>

            <div className="p-1 space-y-2 border-l-2 border-emerald-500 pl-4">
              <span className="font-mono text-xs font-bold text-emerald-600 block uppercase tracking-wider">// RECENT INSIGHT 02</span>
              <h3 className="font-sans font-extrabold text-gray-950 text-base">Automated Alerts Engine</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-semibold">
                Receive visual breakdown digests straight inside Slack, Email, or Webhooks on any daily or custom schedule.
              </p>
            </div>

            <div className="p-1 space-y-2 border-l-2 border-emerald-500 pl-4">
              <span className="font-mono text-xs font-bold text-[#059669] block uppercase tracking-wider">// RECENT INSIGHT 03</span>
              <h3 className="font-sans font-extrabold text-gray-950 text-base">SOC2 Hardware Security</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-semibold">
                Credentials are locked securely using hardware-based keys. Your operational workloads remain safe and separate.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* TWO BOX PRICING SECTION - EXACTLY AS HIGHLIGHTED BY THE USER */}
      <section id="pricing" className="py-24 lg:py-28 bg-[#F9FAF9] border-b border-gray-150">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 select-none">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="font-mono text-xs uppercase font-extrabold tracking-widest text-[#059669] bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-md inline-block">
              LAUNCH SPECIAL BETA
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tighter text-gray-950">
              Free while we build.
            </h2>
            <p className="text-sm sm:text-base text-gray-650 font-semibold leading-relaxed">
              No subscription contracts. No hidden enterprise demo games. We are giving our $99 premium plan for 100% free while we scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            
            {/* BOX 1: THE $99 PREMIUM PLAN (COMPLETELY CROSSED OUT AS FREE) */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden opacity-75">
              
              {/* Promotional Ribbon stating free eligibility */}
              <div className="absolute top-3.5 right-3.5 bg-red-500 text-white text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-xs z-10">
                PROMO EXEMPT • NOW $0
              </div>

              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-gray-500 block uppercase tracking-wider">STANDARD PRO PLAN</span>
                <h3 className="font-sans font-extrabold text-2xl text-gray-900">Enterprise Team Stack</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                  Complete advanced dashboard tools suited for professional team collaboration and Slack alert reports.
                </p>

                {/* Highly visible crossed price */}
                <div className="pt-2 flex items-baseline gap-1.5 text-gray-450">
                  <span className="text-3xl sm:text-4xl font-display font-extrabold text-gray-400 line-through">
                    $99
                  </span>
                  <span className="text-sm font-semibold text-gray-550">/ month, billed annual</span>
                </div>
              </div>

              {/* Fully crossed out list items */}
              <div className="border-t border-gray-100 my-6 pt-5 flex-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 block mb-3">CONSTRAINED PRO CAPABILITIES:</span>
                <ul className="space-y-3 text-sm font-semibold text-gray-400">
                  <li className="flex items-start gap-2 line-through">
                    <X className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>Unlimited connected database tunnels</span>
                  </li>
                  <li className="flex items-start gap-2 line-through">
                    <X className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>Weekly scheduled reports in Slack channels</span>
                  </li>
                  <li className="flex items-start gap-2 line-through">
                    <X className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>Collaborative team workspace sharing</span>
                  </li>
                  <li className="flex items-start gap-2 line-through">
                    <X className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>Full metrics mapping Semantic Dictionary</span>
                  </li>
                </ul>
              </div>

              {/* Disabled button styling */}
              <button disabled className="w-full py-3 bg-gray-100 hover:bg-gray-150 text-gray-400 font-bold rounded-lg text-sm tracking-wider transition-colors">
                PROMO RE-ROUTED
              </button>
            </div>

            {/* BOX 2: THE $0 FREE PLAN (100% ACTIVE & HEROIZED) */}
            <div className="rounded-2xl border-2 border-emerald-500 bg-white p-6 sm:p-8 flex flex-col justify-between relative shadow-xl shadow-emerald-50/70">
              
              {/* Highlight active badge */}
              <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1 text-xs font-mono font-extrabold uppercase tracking-widest text-white shadow-md">
                <span>100% FREE BETA</span>
              </span>

              <div className="space-y-4">
                <span className="text-xs font-mono font-extrabold text-emerald-600 block uppercase tracking-wider">DEVELOPER BETA ACCESS</span>
                <h3 className="font-sans font-extrabold text-2xl text-gray-900">Unlimited Conversation</h3>
                <p className="text-sm sm:text-base text-gray-650 leading-relaxed font-semibold">
                  Unlock everything. Ask questions, receive styled answers, and sync databases securely for $0 while we work on our initial phase.
                </p>

                {/* Huge active Free price indicator */}
                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-display font-black text-emerald-600">
                    $0
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded font-mono">
                    Free Forever Beta
                  </span>
                </div>
              </div>

              {/* High contrast active checks */}
              <div className="border-t border-gray-150 my-6 pt-5 flex-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 block mb-3">ACTIVATE ALL PRO CAPABILITIES FOR FREE:</span>
                <ul className="space-y-3 text-sm font-bold text-gray-800">
                  <li className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                    <span>Unlimited database credentials linked securely</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                    <span>Weekly scheduled visual reports pushed directly</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                    <span>Full conversational team sharing and analytics search</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                    <span>SOC2-grade end-to-end VPC reader pipelines</span>
                  </li>
                </ul>
              </div>

              {/* High visibility CTA button */}
              <a 
                href="/chat"
                className="w-full text-center py-3.5 bg-gray-950 font-bold text-white rounded-lg text-sm tracking-wider cursor-pointer hover:bg-black font-sans shadow-md"
              >
                Claim Free Beta Account
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL MINI CTA SECTION */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tighter text-gray-950 leading-none">
            Stop learning dashboards. Start talking to your database.
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold max-w-xl mx-auto">
            Get instant access to human-readable insights with $0 commitments. Connect your Postgres database and start asking questions in seconds.
          </p>
          <div className="pt-2">
            <a 
              href="/chat"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-gray-950 text-white rounded-lg font-bold text-xs hover:bg-black transition-all cursor-pointer shadow-md"
            >
              <span>Connect Free Beta Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <Footer />

    </div>
  );
}
