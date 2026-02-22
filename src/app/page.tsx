"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

const TEST_EMAIL = "test@test.com";
const TEST_PASS = "12345";

export default function LandingPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email === TEST_EMAIL && password === TEST_PASS) {
      sessionStorage.setItem("authenticated", "true");
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-gray-900 selection:text-white">
      {/* Nav */}
      <nav className="w-full px-6 md:px-12 py-5 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-gray-900">
          VCConnect
        </span>
        <button
          onClick={() => setShowLogin(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Login
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Now in Beta
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Find the right VC
            <br />
            <span className="text-gray-400">for your startup</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
            Search, filter, and match with venture capitalists.
            AI&#8209;powered insights to help you raise smarter.
          </p>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setShowLogin(true)}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Features strip */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl w-full text-left">
          {[
            {
              title: "Smart Matching",
              desc: "See match % based on your sector, stage, and raise amount.",
            },
            {
              title: "AI Chat",
              desc: "Ask questions about any VC and get instant, data-backed answers.",
            },
            {
              title: "Live Data",
              desc: "Real-time VC database with activity status and portfolio info.",
            },
          ].map((f) => (
            <div key={f.title} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-6 text-xs text-gray-400 flex items-center justify-between">
        <span>&copy; {new Date().getFullYear()} VCConnect</span>
        <span>Built for founders</span>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Sign in to access your dashboard
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@test.com"
                  required
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full h-10 px-3 pr-10 text-sm border border-gray-200 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                className="w-full h-10 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Sign in
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              Demo: test@test.com / 12345
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
