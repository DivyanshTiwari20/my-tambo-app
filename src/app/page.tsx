import Link from "next/link";
import {
  MessageSquare,
  BarChart3,
  Database,
  Zap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  PieChart,
  LayoutDashboard,
  Heart,
  Shield
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-[#FCFAF8] text-stone-800 font-serif selection:bg-[#FFDCCF] selection:text-[#FF5A36] antialiased overflow-x-hidden min-h-screen">


      {/* ── 1. HERO SECTION (OPENNOTE STYLE) ── */}
      <section className="relative px-6 pt-12 pb-12 md:pt-16 md:pb-16 w-full flex flex-col items-center text-center overflow-hidden">

        {/* Floating Doodles / Characters Background */}
        <div className="absolute inset-0 z-0 pointer-events-none max-w-[1400px] mx-auto w-full">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sam&backgroundColor=transparent"
            alt=""
            className="absolute left-[2%] md:left-[5%] top-[5%] md:top-[10%] w-24 h-24 sm:w-32 sm:h-32 md:w-56 md:h-56 opacity-[0.08] grayscale -rotate-12" />

          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Lucy&backgroundColor=transparent"
            alt=""
            className="absolute right-[-5%] md:right-[2%] top-[10%] md:top-[15%] w-28 h-28 sm:w-40 sm:h-40 md:w-64 md:h-64 opacity-[0.08] grayscale rotate-12" />

          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Oscar&backgroundColor=transparent"
            alt=""
            className="absolute left-[-5%] md:left-[10%] bottom-[5%] w-20 h-20 sm:w-28 sm:h-28 md:w-48 md:h-48 opacity-[0.08] grayscale rotate-6" />

          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Mimi&backgroundColor=transparent"
            alt=""
            className="absolute right-[5%] md:right-[8%] bottom-[5%] md:bottom-[10%] w-24 h-24 sm:w-32 sm:h-32 md:w-56 md:h-56 opacity-[0.08] grayscale -rotate-[15deg] hidden md:block" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          {/* Top Centered Illustration */}
          <div className="relative z-10 mb-12 flex justify-center items-center mt-8">
            <div className="relative group w-48 h-48 bg-white border border-stone-200 rounded-[2rem] shadow-sm transform flex flex-col justify-center items-center hover:-translate-y-1 transition-transform duration-500">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FF5A36] rounded-full flex justify-center items-center animate-bounce shadow-lg shadow-[#FF5A36]/30">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <Database className="w-16 h-16 text-stone-800 mb-4 stroke-[1.5]" />
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-stone-300 relative group-hover:bg-rose-300"></div>
                <div className="w-2 h-2 rounded-full bg-stone-300 relative group-hover:bg-amber-300"></div>
                <div className="w-2 h-2 rounded-full bg-[#FF5A36] relative"></div>
              </div>
            </div>
          </div>

          {/* Large Elegant Title */}
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-stone-900 max-w-4xl mb-8 leading-[1.1] z-10">
            Chat with your database.<br />
            <span className="text-stone-800">No SQL Needed.</span>
          </h1>

          {/* Kept Content (Subtext) */}
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mb-12 leading-relaxed font-medium z-10">
            Connect your database and get instant insights, charts, and answers in plain English.
            It's friendly, fast, and built so anyone can understand their data.
          </p>

          {/* Main Action Area */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10 justify-center items-center relative">
            <Link
              href="/chat"
              className="bg-stone-900 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-stone-800 transition-all hover:scale-105 shadow-xl shadow-stone-900/10 flex items-center justify-center gap-2"
            >
              Try for free <ArrowRight className="w-5 h-5 opacity-70" />
            </Link>
          </div>

          {/* Subtle orange accent kept as requested */}
          <div className="mt-6 text-sm font-medium text-[#FF5A36] flex items-center gap-2 z-10 relative">
            <CheckCircle2 className="w-4 h-4" /> No credit card required. Connect Supabase in 2 clicks.
          </div>
        </div>

      </section>




      {/* ── 4. HOW IT WORKS ── */}
      <section id="how-it-works" className="py-12 md:py-16 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 leading-tight">
                From connection to insights in 60 seconds.
              </h2>
              <p className="text-xl text-stone-500 font-medium mb-12">
                We've stripped away the complexity. No engineering tickets, no complex dashboard builders.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="text-xl font-bold text-stone-900 mb-2">Pop in your credentials</h4>
                    <p className="text-stone-500 font-medium">Add your Supabase URL and Anon Key perfectly securely in the browser settings.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="text-xl font-bold text-stone-900 mb-2">Ask a simple question</h4>
                    <p className="text-stone-500 font-medium">Type anything—"How many users signed up this week?" or "Show me revenue by category".</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#FF5A36] text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-orange-500/30">3</div>
                  <div>
                    <h4 className="text-xl font-bold text-stone-900 mb-2">Get answers instantly</h4>
                    <p className="text-stone-500 font-medium">The AI maps your schema, runs the right queries, and builds a beautiful chart right in the chat.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Decorative abstract shape */}
              <div className="absolute inset-0 bg-rose-100 rounded-[2rem] sm:rounded-[3rem] rotate-3 scale-[1.03] sm:scale-105 z-0"></div>
              <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-xl border border-stone-100 relative z-10 flex flex-col gap-4">
                <div className="flex gap-3 items-center pb-4 border-b border-stone-100">
                  <div className="w-12 h-12 bg-stone-100 rounded-full overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f5f5f5" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">Sarah from Marketing</div>
                    <div className="text-sm text-stone-400">Just now</div>
                  </div>
                </div>
                <div className="bg-stone-50 rounded-2xl p-4 text-stone-700 font-medium">
                  Show me the monthly revenue growth for the US region.
                </div>
                <div className="bg-[#FCFAF8] rounded-2xl p-6 border border-stone-200 mt-2">
                  <div className="flex items-center gap-2 mb-4 text-[#FF5A36] font-bold">
                    <TrendingUp className="w-5 h-5" /> Revenue Trend
                  </div>
                  {/* Fake UI Chart */}
                  <div className="h-32 w-full border-b-2 border-l-2 border-stone-200 relative flex items-end justify-around pb-2">
                    <div className="w-8 bg-blue-200 rounded-t h-[30%]"></div>
                    <div className="w-8 bg-blue-300 rounded-t h-[50%]"></div>
                    <div className="w-8 bg-blue-400 rounded-t h-[70%]"></div>
                    <div className="w-8 bg-blue-500 rounded-t h-[90%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. TESTIMONIAL / CTA ── */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-6xl mx-auto bg-[#FF5A36] rounded-[2rem] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 md:gap-8 shadow-sm">

          {/* Left Side: Content */}
          <div className="w-full md:w-1/2 text-left z-10 md:pr-10">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 font-bold leading-tight tracking-tight">
              Data analytics that feel like magic.
            </h2>
            <p className="text-xl md:text-2xl text-stone-900/80 mb-10 font-medium leading-relaxed font-serif">
              "We used to wait days for the data team to build a simple dashboard. Now anyone on the team can just ask the database a question."
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/chat" className="bg-stone-900 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-stone-800 transition-all font-sans">
                Try for free
              </Link>
            </div>
          </div>

          {/* Right Side: Hand-drawn Avatars (Notionists) */}
          <div className="w-full md:w-1/2 relative flex items-end justify-center z-10 h-64 md:h-80">
            {/* Fun decorative accents matching the image */}
            <div className="absolute top-4 left-10 text-stone-900 text-2xl font-black rotate-12">✧</div>
            <div className="absolute top-12 right-20 text-stone-900 text-xl font-black -rotate-12">×</div>
            <div className="absolute bottom-16 right-4 text-stone-900 text-3xl font-black rotate-45">≈</div>

            <div className="flex items-end justify-center w-full relative">
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent"
                alt="Team Member"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-56 md:h-56 -mr-8 sm:-mr-12 md:-mr-16 z-10 drop-shadow-md"
              />
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Annie&backgroundColor=transparent"
                alt="Team Member"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-72 md:h-72 z-20 pb-2 md:pb-4 drop-shadow-xl"
              />
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Jude&backgroundColor=transparent"
                alt="Team Member"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-56 md:h-56 -ml-8 sm:-ml-12 md:-ml-16 z-10 drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </section>


      {/* ── 10. FOOTER (OPENNOTE DOODLE STYLE) ── */}
      <footer className="relative bg-white pt-16 pb-8 px-6 overflow-hidden border-t border-stone-100 mt-12 flex flex-col justify-end min-h-[350px]">
        {/* Minimal Sketchy Doodle Background */}
        <div className="absolute inset-0 z-0 opacity-[0.05] grayscale pointer-events-none flex items-center justify-between px-2 md:px-12">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Physics&backgroundColor=transparent" className="w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[400px] md:h-[400px] -rotate-12 translate-y-12" alt="" />
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Frog&backgroundColor=transparent" className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[450px] md:h-[450px] rotate-6 translate-y-20 hidden md:block" alt="" />
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Code&backgroundColor=transparent" className="w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[400px] md:h-[400px] -rotate-6 translate-y-12" alt="" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-end h-full">

          {/* Solo Founder Bio Block */}
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200 p-8 rounded-[2rem] shadow-sm text-center mb-12 max-w-lg mx-auto w-full transition-all hover:bg-white hover:shadow-md">
            <div className="w-16 h-16 mx-auto bg-stone-100 rounded-full border border-stone-200 mb-4 overflow-hidden shadow-sm">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Divyansh&backgroundColor=fefefe" alt="Divyansh Tiwari" className="w-full h-full object-cover scale-110" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mb-2">Built by Divyansh Tiwari</h3>
            {/* <p className="text-stone-500 font-medium mb-6 leading-relaxed">
                 Tambo is a passion project built by a solo indie hacker. I'm building tools to make data analytics simple and conversational for everyone.
               </p> */}

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-bold">
              <a href="https://divyanshh.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-stone-700 hover:text-[#FF5A36] transition-colors border-b-2 border-transparent hover:border-[#FF5A36] pb-1">Portfolio</a>
              <a href="https://x.com/divyansh_ai" target="_blank" rel="noopener noreferrer" className="text-stone-700 hover:text-[#FF5A36] transition-colors border-b-2 border-transparent hover:border-[#FF5A36] pb-1">X (Twitter)</a>
              <a href="https://www.linkedin.com/in/divyansh-tiwari-47b2082aa" target="_blank" rel="noopener noreferrer" className="text-stone-700 hover:text-[#FF5A36] transition-colors border-b-2 border-transparent hover:border-[#FF5A36] pb-1">LinkedIn</a>
              <a href="mailto:divyanshtwork@gmail.com" className="text-stone-700 hover:text-[#FF5A36] transition-colors border-b-2 border-transparent hover:border-[#FF5A36] pb-1">Email</a>
            </div>
          </div>

          {/* Simple Floating Copyright referencing the bare UI look of the image */}
          <div className="bg-white/60 px-6 py-2 rounded-full text-stone-500 font-medium text-sm flex items-center justify-center backdrop-blur-sm">
            © {new Date().getFullYear()}  All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}
