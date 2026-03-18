import Link from "next/link";

export default function Home() {
  const repoUrl = "https://github.com/DivyanshTiwari20/my-tambo-app";

  return (
    <div className="bg-white text-black font-sans selection:bg-black selection:text-white antialiased overflow-x-hidden min-h-screen">
      
      <div className="flex flex-col lg:flex-row w-full relative">
        
        {/* Left Half: Sticky Animation / Video */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-0 h-[40vh] lg:h-screen flex flex-col items-center justify-center relative group bg-white lg:border-r border-gray-100 z-10">
          {/* Subtle premium glow effect behind the video */}
          <div className="absolute inset-0 bg-blue-50/40 rounded-full blur-3xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full max-w-xs md:max-w-sm rounded-[2rem] object-contain drop-shadow-lg border border-gray-100 bg-white relative z-20 transition-transform duration-500 hover:scale-[1.03]"
          >
            <source src="/cat%20Mark%20loading.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right Half: Scrolling Content */}
        <div className="w-full lg:w-1/2 flex flex-col z-0">
          
          {/* SECTION 1: Intro Text */}
          <section className="min-h-screen flex flex-col justify-center p-8 md:p-12 lg:p-16 pt-12 lg:pt-0">
            <div className="w-full max-w-2xl mx-auto space-y-10">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 pb-2">
                  SQL Query <br /> Builder.
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed">
                  Transform natural language into powerful database queries and beautiful automated data visualizations instantly.
                </p>
                <p className="text-base md:text-lg text-gray-500">
                  Simply ask straightforward questions in plain English. The AI dynamically handles the database querying and builds the perfect chart for your request on the fly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link
                  href="/chat"
                  className="group relative inline-flex items-center justify-center space-x-3 text-lg font-semibold bg-black text-white px-8 py-4 rounded-full overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <span>Get Started Now</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                    →
                  </span>
                </Link>
                
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 text-lg font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-8 py-4 rounded-full hover:bg-gray-100 hover:text-black transition-all hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                  <span>View GitHub Repo</span>
                  <span aria-hidden>↗</span>
                </a>
              </div>

              <div className="pt-8 text-sm font-medium text-gray-400 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-gray-300"></span>
                <p className="animate-pulse">Scroll down for more</p>
              </div>
            </div>
          </section>

          {/* SECTION 2: How It Works */}
          <section className="min-h-screen flex items-center p-8 md:p-12 lg:p-16 bg-zinc-50 border-t border-zinc-200">
            <div className="w-full max-w-2xl mx-auto space-y-12 py-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How it Works</h2>
                <p className="text-xl text-gray-600">
                  The AI interprets your intent, securely queries your connected integration, and dynamically renders the most appropriate component to display your results perfectly.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center text-xl font-bold mb-6">1</div>
                  <h3 className="text-xl font-bold mb-3">Ask Freely</h3>
                  <p className="text-gray-600 leading-relaxed">Type your query into the chat interface. Example: "Show me the top 5 largest orders this month."</p>
                </div>
                
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center text-xl font-bold mb-6">2</div>
                  <h3 className="text-xl font-bold mb-3">AI Analyzes</h3>
                  <p className="text-gray-600 leading-relaxed">The AI parses your request and translates the plain English directly into optimized, robust SQL.</p>
                </div>

                <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center text-xl font-bold mb-6">3</div>
                  <h3 className="text-xl font-bold mb-3">Visualize</h3>
                  <p className="text-gray-600 leading-relaxed">The application dynamically fetches your data and renders an interactive, visually stunning chart.</p>
                </div>
              </div>
              
              <div className="pt-8">
                <Link
                    href="/chat"
                    className="group inline-flex items-center space-x-2 text-xl font-semibold text-black hover:text-gray-600 transition-colors"
                  >
                    <span className="border-b-2 border-transparent group-hover:border-gray-400 pb-1 transition-all">Experience it now</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
