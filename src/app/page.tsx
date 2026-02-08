import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-mono flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
      {/* Minimalistic Container */}
      <div className="max-w-2xl w-full space-y-12">

        {/* Header Section */}
        <div className="space-y-4 border-l-2 border-black pl-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            SQL_QUERY_BUILDER
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            // ask_questions_in_plain_english<br />
            // get_instant_data_visualizations
          </p>
        </div>

        {/* Feature List as Code Comments */}
        <div className="space-y-2 text-sm text-gray-500">
          <p>{`/* features_loaded: */`}</p>
          <ul className="list-none space-y-1 pl-4 border-l border-gray-200">
            <li>[x] natural_language_processing</li>
            <li>[x] dynamic_visualization_engine</li>
            <li>[x] supabase_direct_integration</li>
            <li>[x] zero_config_required</li>
          </ul>
        </div>

        {/* Primary Action */}
        <div className="pt-8">
          <Link href="/chat" className="group inline-flex items-center space-x-2 text-lg font-bold hover:underline underline-offset-4">
            <span>$ ./start_querying.sh</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Footer / System Status */}
        <div className="fixed bottom-6 left-6 text-xs text-gray-400">
          <p>SYSTEM_STATUS: ONLINE</p>
          <p>VERSION: 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
